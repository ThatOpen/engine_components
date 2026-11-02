import * as THREE from "three";
import { SORT_WORKER_SRC } from "./sort-worker-src";
import { DECODE_WORKER_SRC } from "./decode-worker-src";
import { TEX_W, mkQuadGeo, mkSplatMaterial } from "./shaders";
import { fetchSOGChunkRaw } from "./sog";
import {
  closestDist,
  pickLod,
  type LodMeta,
  type Leaf,
  type LeafLod,
  type LodCell,
} from "./lodtree";
import type { ISplatRenderer } from "./types";

/**
 * OUT-OF-CORE streaming gaussian-splat renderer. Mirrors the in-core {@link GSplat} (same shaders,
 * material, DataTexture formats and worker depth-sort) but keeps only a FIXED BUDGET of splats
 * resident in a GPU "work-buffer" slab; the rest live as on-disk SOG chunks referenced by an
 * `lod-meta.json` B-tree manifest. Each frame it:
 *   1. takes the camera + frustum into the dataset's LOCAL space (correct under any placement),
 *   2. traverses the manifest tree, picks a LOD per visible leaf by distance, and runs a BUDGET
 *      balancer (coarsen the farthest leaves until the wanted total fits the budget),
 *   3. fetches+decodes any wanted-but-not-resident chunk (throttled) into a slab region,
 *   4. evicts least-recently-wanted chunks when the budget would overflow,
 *   5. sends the wanted slab index RANGES to the worker → one global back-to-front sort → one draw.
 *
 * The slab is allocated in WHOLE-ROW units (multiples of TEX_W texels) so a chunk's GPU upload is
 * a full-width row rectangle (`texSubImage2D`), and the worker's slab centres mirror the GPU rows
 * 1:1 (chunk slab base = rowBegins*TEX_W). Two parts to the design: the interval
 * allocator (fixed work-buffer sub-allocated as runs) + the budget balancer.
 */

// ── slab allocator: a free-list of contiguous ROW ranges (each row = TEX_W texels) ──
interface RowRange { start: number; rows: number } // start in ROWS

class SlabAllocator {
  private free: RowRange[]; // sorted by start, kept coalesced
  constructor(rowTotal: number) {
    this.free = [{ start: 0, rows: rowTotal }];
  }
  /** First-fit allocate `rows` contiguous rows; returns the row start or -1 if no room. */
  alloc(rows: number): number {
    for (let i = 0; i < this.free.length; i++) {
      const f = this.free[i];
      if (f.rows >= rows) {
        const start = f.start;
        if (f.rows === rows) this.free.splice(i, 1);
        else { f.start += rows; f.rows -= rows; }
        return start;
      }
    }
    return -1;
  }
  /** Return a row range to the free-list and coalesce with neighbours. */
  free_(start: number, rows: number): void {
    const r: RowRange = { start, rows };
    // insert sorted
    let i = 0;
    while (i < this.free.length && this.free[i].start < start) i++;
    this.free.splice(i, 0, r);
    // coalesce backward + forward
    if (i > 0 && this.free[i - 1].start + this.free[i - 1].rows === r.start) {
      this.free[i - 1].rows += r.rows;
      this.free.splice(i, 1);
      i--;
    }
    if (i + 1 < this.free.length && this.free[i].start + this.free[i].rows === this.free[i + 1].start) {
      this.free[i].rows += this.free[i + 1].rows;
      this.free.splice(i + 1, 1);
    }
  }
}

interface ResidentChunk {
  rowBegins: number;          // slab row of this chunk's first splat
  rows: number;              // rows occupied (ceil(splatCount / TEX_W))
  splatCount: number;        // splats actually decoded into the slab
  lastWantedFrame: number;   // for LRU eviction
}

// a wanted slice this frame: a contiguous run of slab splat indices [slabStart, slabStart+count)
interface WantedSlice { file: number; slabStart: number; count: number }

export interface GSplatStreamOptions {
  /** Max resident splats (slab size). ~6M default. */
  budget?: number;
  /** Max concurrent chunk fetches. */
  maxConcurrentFetches?: number;
}

const DEFAULT_BUDGET = 6_000_000;

// The packed texel that dequantizes to "all coefficients zero". The encoder's range is symmetric
// about 0, so the neutral BYTE is mid-scale (128) rather than zero, and the texel carries three of
// them per component. See SH_RANGE_MIN/MAX in core's fq-codec.ts.
const SH_NEUTRAL = 0x00808080;

export class GSplatStream implements ISplatRenderer {
  readonly object = new THREE.Group();
  readonly center = new THREE.Vector3();
  readonly radius: number;
  readonly total: number;
  readonly nCells: number; // = number of leaves

  // ── GPU: budget-sized textures + instanced mesh ──
  private readonly _budget: number;
  private readonly _texH: number;
  private readonly _texLen: number;
  private readonly _mesh: THREE.Mesh;
  private readonly _geo: THREE.InstancedBufferGeometry;
  private readonly _mat: THREE.RawShaderMaterial;
  private readonly _aIndex: THREE.InstancedBufferAttribute;
  private readonly _idxArr: Float32Array;

  // CPU backing arrays (mirror the GPU textures; chunks are baked here then uploaded by rows)
  private readonly _texCenter: THREE.DataTexture;
  private readonly _texCovA: THREE.DataTexture;
  private readonly _texCovB: THREE.DataTexture;
  private readonly _texColor: THREE.DataTexture;
  private readonly _bufCenter: Float32Array;
  private readonly _bufCovA: Uint16Array;
  private readonly _bufCovB: Uint16Array;
  private readonly _bufColor: Uint8Array;
  // Spherical harmonics (degree 1). Allocated ONLY when the manifest ships `.sh` sidecars, so a
  // flat-colour dataset pays nothing. One RGBA32UI texel per splat = 16 bytes, on top of the 36
  // the other three textures cost.
  private readonly _shBands: number;
  private readonly _texSH: THREE.DataTexture | null = null;
  private readonly _bufSH: Uint32Array | null = null;

  private readonly _worker: Worker;
  private readonly _workerUrl: string;
  // ── decode worker pool: heavy SOG decode + covariance + half-quantize runs OFF the main thread ──
  private readonly _unpackerPool: Worker[] = [];
  private readonly _decodeWorkerUrl: string;
  private readonly _freeDecodeWorkers: Worker[] = [];   // free-list; dispatch pulls, decode returns
  private readonly _decodeWaiters: ((w: Worker) => void)[] = []; // fetches awaiting a free worker
  private _disposed = false;

  // shared frame uniforms (the loader pushes viewport/focal/minPx each frame)
  private readonly _uViewport = { value: new THREE.Vector2(1, 1) };
  private readonly _uFocal = { value: new THREE.Vector2() };
  private readonly _uMinPx = { value: 3 };
  private readonly _uOrtho = { value: 0 }; // 1 under an orthographic camera

  // ── manifest + residency ──
  private readonly _listing: LodMeta;
  private readonly _fetchFn?: (url: string) => Promise<Response>;
  private readonly _rootAddress: string;
  private readonly _alloc: SlabAllocator;
  private readonly _resident = new Map<number, ResidentChunk>(); // chunk file number → slab placement
  private readonly _fetching = new Set<number>();
  private readonly _fetchQueue: number[] = []; // pending chunk file numbers (FIFO)
  private readonly _maxFetches: number;
  // rows pending GPU upload since the last flush (coalesced to a single dirty span per texture)
  private _uploadDirty = false;
  private _dirtyRowMin = Infinity;
  private _dirtyRowMax = -1;
  private _glReady = false;

  // LOD pick
  private _base: number;
  private readonly _mult = 2.0;

  // sort throttling
  private _visN = 0;
  private _sortMs = 0;
  private _sortPending = false;
  private _version = 0;
  private _frame = 0;
  private _visLeaves = 0;
  private _lastRangesKey = "";
  private _dirty = false;                       // a newer wanted-set is waiting to be sorted
  private _wantRanges = new Int32Array(0);      // the latest wanted slab ranges
  private _wantDir: [number, number, number] = [0, 0, 1];

  // scratch
  private readonly _fwd = new THREE.Vector3();
  private readonly _lastDir = new THREE.Vector3(0, 0, 1);
  private readonly _frustum = new THREE.Frustum();
  private readonly _pvm = new THREE.Matrix4();
  private readonly _mInv = new THREE.Matrix4();
  private readonly _nrm3 = new THREE.Matrix3();
  private readonly _camLocal = new THREE.Vector3();
  private readonly _box = new THREE.Box3();

  /** Async factory: the manifest must be loaded before construction (the constructor can't be
   * async). `manifestBaseUrl` is the folder holding `lod-meta.json`; chunk SOG folders are
   * resolved relative to it. */
  static async create(
    manifestBaseUrl: string,
    fetcher?: (url: string) => Promise<Response>,
    options?: GSplatStreamOptions,
  ): Promise<GSplatStream> {
    const get = fetcher ?? ((u: string) => fetch(u));
    // Fetch the manifest through `fetcher` (so signed-URL / Range transports work for it too) and
    // parse it exactly like lodtree.loadLodMeta does (see buildManifest).
    const base = manifestBaseUrl.replace(/\/$/, "");
    // A dev server answers a missing path with its index.html and a 200, so `.json()` would die
    // with an unreadable "Unexpected token '<'" three frames away from the URL that caused it.
    // Name the URL and the status instead: a missing dataset must read as a missing dataset.
    const res = await get(`${base}/lod-meta.json`);
    const text = await res.text();
    if (!res.ok || text.trimStart().startsWith("<")) {
      throw new Error(
        `[SplatLoader] no splat manifest at ${base}/lod-meta.json ` +
          `(HTTP ${res.status}${text.trimStart().startsWith("<") ? ", got HTML" : ""}) — ` +
          `does that dataset folder exist?`,
      );
    }
    const m = JSON.parse(text);
    return new GSplatStream(buildManifest(m), base, fetcher, options);
  }

  constructor(
    manifest: LodMeta,
    baseUrl: string,
    fetcher?: (url: string) => Promise<Response>,
    options?: GSplatStreamOptions,
  ) {
    this._listing = manifest;
    this._rootAddress = baseUrl.replace(/\/$/, "");
    this._fetchFn = fetcher;
    this._budget = Math.max(TEX_W, options?.budget ?? DEFAULT_BUDGET);
    this._maxFetches = options?.maxConcurrentFetches ?? 3;
    this.nCells = manifest.leaves.length;
    // total = finest-level (LOD 0) count across all leaves
    this.total = manifest.counts?.[0] ?? manifest.leaves.reduce((a, l) => a + (l.lods[0]?.count ?? 0), 0);

    // bounds from the tree root → centre / radius / LOD base
    const mn = manifest.tree.min, mx = manifest.tree.max;
    this.center.set((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2);
    this.radius = Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2 || 1;
    this._base = this.radius * 0.55;

    // ── budget-sized GPU textures (same formats as GSplat) ──
    this._texH = Math.ceil(this._budget / TEX_W);
    this._texLen = TEX_W * this._texH;
    this._bufCenter = new Float32Array(this._texLen * 4);
    this._bufCovA = new Uint16Array(this._texLen * 4);
    this._bufCovB = new Uint16Array(this._texLen * 4);
    this._bufColor = new Uint8Array(this._texLen * 4);
    this._texCenter = this._mkTex(this._bufCenter, THREE.FloatType);
    this._texCovA = this._mkTex(this._bufCovA, THREE.HalfFloatType);
    this._texCovB = this._mkTex(this._bufCovB, THREE.HalfFloatType);
    this._texColor = this._mkTex(this._bufColor, THREE.UnsignedByteType);
    this._texColor.colorSpace = THREE.NoColorSpace;

    // SH: ONE texel per splat, same grid as every other data texture, so the row allocator and the
    // whole-row uploads carry over untouched.
    this._shBands = manifest.shFilenames?.length ? (manifest.shBands ?? 0) : 0;
    if (this._shBands > 0) {
      // The byte scale is centred, so a zeroed slab would dequantize to the range MINIMUM (-2) and
      // tint every splat it touched. SH_NEUTRAL is the packed "all coefficients zero" texel, and it
      // has to be the resting state of the whole slab — a region whose sidecar failed, or that no
      // chunk has written yet, must read as flat rather than as the last tenant's colours.
      this._bufSH = new Uint32Array(this._texLen * 4).fill(SH_NEUTRAL);
      this._texSH = new THREE.DataTexture(
        this._bufSH, TEX_W, this._texH, THREE.RGBAIntegerFormat, THREE.UnsignedIntType,
      );
      // ⚠️ NO EXPLICIT `internalFormat` ON THIS TEXTURE. The WebGL backend derives RGBA32UI from
      // RGBAIntegerFormat + UnsignedIntType by itself; the WebGPU backend passes `internalFormat`
      // VERBATIM as the GPUTextureDescriptor format, and "RGBA32UI" is a WebGL2 name, not a WebGPU
      // one ("rgba32uint"). With it set, texture creation fails ("Failed to create texture with
      // descriptor"), every SH fetch reads zeros, and zero bytes dequantize to the range MINIMUM
      // (-2): the whole capture takes a view-direction-shaped tint — black where the basis sums
      // positive, washed white where it sums negative. Antonio read it as "the splats have gloss".
      this._texSH.minFilter = this._texSH.magFilter = THREE.NearestFilter;
      this._texSH.colorSpace = THREE.NoColorSpace;
      this._texSH.needsUpdate = true;
    }

    this._mat = mkSplatMaterial({
      texCenter: this._texCenter,
      texCovA: this._texCovA,
      texCovB: this._texCovB,
      texColor: this._texColor,
      texSH: this._texSH ?? undefined,
      shBands: this._shBands,
      uViewport: this._uViewport,
      uFocal: this._uFocal,
      uMinPx: this._uMinPx,
      uOrtho: this._uOrtho,
    });

    this._geo = mkQuadGeo();
    this._idxArr = new Float32Array(this._budget);
    this._aIndex = new THREE.InstancedBufferAttribute(this._idxArr, 1);
    this._aIndex.setUsage(THREE.DynamicDrawUsage);
    this._geo.setAttribute("aSlot", this._aIndex);
    this._geo.instanceCount = 0;
    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.frustumCulled = false;
    this._mesh.userData.splatCount = 0;
    this.object.add(this._mesh);

    this._alloc = new SlabAllocator(this._texH);

    // worker (inlined Blob — same source as the in-core path; streaming messages added)
    this._workerUrl = URL.createObjectURL(
      new Blob([SORT_WORKER_SRC], { type: "application/javascript" }),
    );
    this._worker = new Worker(this._workerUrl);
    this._worker.postMessage({ type: "initBudget", budget: this._budget });
    this._worker.onmessage = (e) => {
      if (this._disposed || e.data.type !== "sorted") return;
      const order = new Uint32Array(e.data.order);
      this._visN = e.data.n;
      this._idxArr.set(order.subarray(0, this._visN));
      this._aIndex.clearUpdateRanges();
      this._aIndex.addUpdateRange(0, this._visN);
      this._aIndex.needsUpdate = true;
      this._geo.instanceCount = this._visN;
      this._mesh.userData.splatCount = this._visN;
      this._sortMs = e.data.sortMs;
      this._sortPending = false;
      this._dispatchSort(); // a chunk may have streamed in mid-sort → flush the newer set now
    };

    // decode worker pool (each an inlined Blob of DECODE_WORKER_SRC). Default 2 (or maxFetches),
    // free-list dispatch. The heavy per-splat SOG decode + covariance build + half-quantize run in
    // these, so the main thread only fetches + memcpys + uploads.
    this._decodeWorkerUrl = URL.createObjectURL(
      new Blob([DECODE_WORKER_SRC], { type: "application/javascript" }),
    );
    const nDecoders = Math.max(1, options?.maxConcurrentFetches ?? 2);
    for (let i = 0; i < nDecoders; i++) {
      const w = new Worker(this._decodeWorkerUrl);
      this._unpackerPool.push(w);
      this._freeDecodeWorkers.push(w);
    }
  }

  // ── ISplatRenderer surface ──
  get drawn() { return this._visN; }
  get cellsInView() { return this._visLeaves; }
  get sortMs() { return this._sortMs; }
  get lodBase() { return this._base; }
  set lodBase(d: number) { this._base = d; }

  /** Degree of view-dependent colour this dataset actually carries (0 = flat, converted before
   * SH support or from a source with no `f_rest_*`). */
  get shBands() { return this._shBands; }
  /** How much of the view-dependent term to apply, 0..1. Free to change per frame — the
   * coefficients are already resident, so this is a uniform write, not a re-stream. */
  get shStrength() { return this._mat.uniforms.uShStrength.value as number; }
  set shStrength(v: number) { this._mat.uniforms.uShStrength.value = Math.max(0, Math.min(1, v)); }
  /** Distance (local units) past which the view-dependent term fades out. 0 = no limit. */
  get shMaxDistance() { return this._mat.uniforms.uShMaxDist.value as number; }
  set shMaxDistance(v: number) { this._mat.uniforms.uShMaxDist.value = Math.max(0, v); }

  /**
   * Splats being drawn this frame, bucketed by how far their leaf is from the camera:
   * [<25, <50, <100, <200, >=200] in local units. Free to collect — the traversal already has both
   * the distance and the count — and it is what says whether a distance limit has any headroom on
   * a given view BEFORE anyone tunes one. A limit only pays if the far buckets hold real numbers.
   */
  readonly drawnByDistance = [0, 0, 0, 0, 0];

  /** Keep sub-pixel splats (grow to the floor + compensate opacity) instead of discarding them. */
  get subPixelDetail() { return (this._mat.uniforms.uSubPixel.value as number) > 0.5; }
  set subPixelDetail(v: boolean) { this._mat.uniforms.uSubPixel.value = v ? 1 : 0; }
  /** Alpha below which a grown sub-pixel splat is dropped. Pure cost/fidelity dial. */
  get subPixelMinAlpha() { return this._mat.uniforms.uSubMinA.value as number; }
  set subPixelMinAlpha(v: number) { this._mat.uniforms.uSubMinA.value = Math.max(0, v); }

  setFrameUniforms(width: number, height: number, camera: THREE.Camera, minPixelSize: number) {
    this._uViewport.value.set(width, height);
    const e = (camera as THREE.PerspectiveCamera).projectionMatrix.elements;
    this._uFocal.value.set(e[0] * 0.5 * width, e[5] * 0.5 * height);
    this._uMinPx.value = minPixelSize;
    this._uOrtho.value = (camera as THREE.OrthographicCamera).isOrthographicCamera ? 1 : 0;
  }

  /**
   * Per frame: local-space frustum + camera, traverse the manifest, pick LOD per visible leaf,
   * budget-balance, fetch/evict chunks, and (when the resident wanted set or the camera direction
   * changed) re-sort the wanted slab ranges off-thread.
   */
  update(camera: THREE.PerspectiveCamera) {
    if (this._disposed) return;
    this._frame++;
    this.object.updateMatrixWorld();
    this._mInv.copy(this.object.matrixWorld).invert();

    // frustum + camera position + forward in LOCAL space (matches GSplat.update exactly)
    this._pvm
      .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      .multiply(this.object.matrixWorld);
    this._frustum.setFromProjectionMatrix(this._pvm);
    this._camLocal.copy(camera.position).applyMatrix4(this._mInv);
    camera.getWorldDirection(this._fwd);
    this._nrm3.getNormalMatrix(this._mInv);
    this._fwd.applyMatrix3(this._nrm3).normalize();
    // The SH view direction is per-splat (centre − eye), so the shader needs the eye in the
    // dataset's OWN space — the same local-space camera the LOD pick and frustum cull use, which
    // is what keeps it correct under an arbitrary placement/anchor transform.
    if (this._shBands > 0) this._mat.uniforms.uCamLocal.value.copy(this._camLocal);

    // 1) visible leaves + an initial per-leaf LOD pick by distance
    const leaves = this._listing.leaves;
    const maxLod = this._listing.lodLevels - 1;
    const px = this._camLocal.x, py = this._camLocal.y, pz = this._camLocal.z;
    // chosen[leafIdx] = LeafLod (or undefined if culled). dist kept for the budget balancer.
    const wanted: { leaf: Leaf; lodIdx: number; dist: number }[] = [];
    this._visLeaves = 0;
    for (let li = 0; li < leaves.length; li++) {
      const leaf = leaves[li];
      this._box.min.set(leaf.min[0], leaf.min[1], leaf.min[2]);
      this._box.max.set(leaf.max[0], leaf.max[1], leaf.max[2]);
      if (!this._frustum.intersectsBox(this._box)) continue;
      this._visLeaves++;
      const dist = closestDist(leaf.min, leaf.max, px, py, pz);
      const lodIdx = Math.min(leaf.lods.length - 1, pickLod(dist, this._base, this._mult, Math.min(maxLod, leaf.lods.length - 1)));
      wanted.push({ leaf, lodIdx, dist });
    }

    // 2) BUDGET balancer (mirror gsplat-budget-balancer): if the wanted total exceeds the budget,
    // coarsen the FARTHEST leaves' LOD (one level per pass) until it fits — preserving near detail.
    let totalWanted = 0;
    for (const w of wanted) totalWanted += w.leaf.lods[w.lodIdx].count;
    if (totalWanted > this._budget) {
      // farthest first
      const order = wanted.slice().sort((a, b) => b.dist - a.dist);
      let guard = 0;
      while (totalWanted > this._budget && guard++ < leaves.length * maxLod + 1) {
        let modified = false;
        for (const w of order) {
          if (totalWanted <= this._budget) break;
          if (w.lodIdx < w.leaf.lods.length - 1) {
            const before = w.leaf.lods[w.lodIdx].count;
            w.lodIdx++;
            totalWanted += w.leaf.lods[w.lodIdx].count - before;
            modified = true;
          }
        }
        if (!modified) break; // every leaf at its coarsest — can't shrink further
      }
    }

    // 3) wanted chunk FILE set + the slab ranges to actually DRAW. We always enqueue the chosen
    // LOD's chunk for fetching, but to keep a leaf from going BLANK while that chunk streams in we
    // draw the best ALREADY-RESIDENT LOD of the same leaf (nearest LOD index; ties → coarser/
    // cheaper). Without this fallback a leaf vanishes whenever its target LOD isn't resident yet —
    // which reads exactly as "only one LOD is being streamed / it disappears at a distance".
    const wantedFiles = new Set<number>();
    const wantedSlices: WantedSlice[] = [];
    this.drawnByDistance.fill(0);
    for (const w of wanted) {
      const target = w.leaf.lods[w.lodIdx];
      wantedFiles.add(target.file); // fetch the target LOD's chunk regardless of what we draw now
      let drawLod = this._resident.has(target.file) ? w.lodIdx : -1;
      if (drawLod < 0) {
        let bestDelta = Infinity;
        for (let l = w.leaf.lods.length - 1; l >= 0; l--) { // coarse→fine so ties keep the cheaper
          if (!this._resident.has(w.leaf.lods[l].file)) continue;
          const delta = Math.abs(l - w.lodIdx);
          if (delta < bestDelta) { bestDelta = delta; drawLod = l; }
        }
      }
      if (drawLod < 0) continue; // nothing resident for this leaf yet → pops in once a chunk lands
      const slice: LeafLod = w.leaf.lods[drawLod];
      const rc = this._resident.get(slice.file)!;
      rc.lastWantedFrame = this._frame;
      // a slice (file, offset, count) → slab indices [rowBegins*TEX_W + offset, +count)
      wantedSlices.push({ file: slice.file, slabStart: rc.rowBegins * TEX_W + slice.offset, count: slice.count });
      // Bucket what we are about to draw by leaf distance. `w.dist` is the leaf's CLOSEST point,
      // so this is a conservative (near-biased) read of how much sits far away.
      const b = w.dist < 25 ? 0 : w.dist < 50 ? 1 : w.dist < 100 ? 2 : w.dist < 200 ? 3 : 4;
      this.drawnByDistance[b] += slice.count;
    }

    // 4) enqueue fetches for wanted-but-not-resident files (throttled)
    for (const file of wantedFiles) {
      if (this._resident.has(file) || this._fetching.has(file)) continue;
      if (!this._fetchQueue.includes(file)) this._fetchQueue.push(file);
    }
    this._pumpFetches(wantedFiles);

    // 5) sort the wanted resident slices (only when the range set or camera direction changed)
    this._maybeSort(wantedSlices);
  }

  /** Process any pending partial-row GPU uploads. Called by the loader with the occlusion-pass
   * renderer (we only have a live WebGLRenderer there). Uploads the coalesced dirty row span. */
  flushUploads(renderer: THREE.WebGLRenderer) {
    if (this._disposed || !this._uploadDirty) return;
    // Ensure GL textures exist before sub-uploading (one-time init).
    if (!this._glReady) {
      renderer.initTexture(this._texCenter);
      renderer.initTexture(this._texCovA);
      renderer.initTexture(this._texCovB);
      renderer.initTexture(this._texColor);
      if (this._texSH) renderer.initTexture(this._texSH);
      this._glReady = true;
    }
    const rowBegins = this._dirtyRowMin;
    const rows = this._dirtyRowMax - this._dirtyRowMin + 1;
    if (rows > 0) {
      this._subUpload(renderer, this._texCenter, this._bufCenter, rowBegins, rows, 4);
      this._subUpload(renderer, this._texCovA, this._bufCovA, rowBegins, rows, 4);
      this._subUpload(renderer, this._texCovB, this._bufCovB, rowBegins, rows, 4);
      this._subUpload(renderer, this._texColor, this._bufColor, rowBegins, rows, 4);
      if (this._texSH && this._bufSH) {
        this._subUpload(renderer, this._texSH, this._bufSH, rowBegins, rows, 4);
      }
    }
    this._uploadDirty = false;
    this._dirtyRowMin = Infinity;
    this._dirtyRowMax = -1;
  }

  dispose() {
    this._disposed = true;
    this._worker.terminate();
    URL.revokeObjectURL(this._workerUrl);
    for (const w of this._unpackerPool) w.terminate();
    this._unpackerPool.length = 0;
    this._freeDecodeWorkers.length = 0;
    // wake any pending waiters so their promises don't dangle (they early-return on _disposed).
    for (const resolve of this._decodeWaiters.splice(0)) resolve(undefined as unknown as Worker);
    URL.revokeObjectURL(this._decodeWorkerUrl);
    this.object.remove(this._mesh);
    this._geo.dispose();
    this._mat.dispose();
    this._texCenter.dispose();
    this._texCovA.dispose();
    this._texCovB.dispose();
    this._texColor.dispose();
    this._texSH?.dispose();
  }

  // ── internals ───────────────────────────────────────────────────────────

  private _mkTex(buf: Float32Array | Uint16Array | Uint8Array, type: THREE.TextureDataType): THREE.DataTexture {
    const t = new THREE.DataTexture(buf, TEX_W, this._texH, THREE.RGBAFormat, type);
    t.minFilter = t.magFilter = THREE.NearestFilter;
    t.needsUpdate = true; // first full upload happens on initTexture/first draw
    return t;
  }

  /** Upload `rows` full-width rows starting at `rowBegins` from a texture's backing buffer.
   * Uses raw `gl.texSubImage2D` (partial-row rectangle) when the GL handle is available; falls
   * back to a full `needsUpdate` re-upload otherwise. */
  private _subUpload(
    renderer: THREE.WebGLRenderer,
    tex: THREE.DataTexture,
    buf: Float32Array | Uint16Array | Uint8Array | Uint32Array,
    rowBegins: number,
    rows: number,
    comps: number,
    width = TEX_W,
  ) {
    // A WebGPU renderer has neither `properties` nor a GL context, and reaching for them threw
    // rather than falling back — the guard below only caught a MISSING handle, not a renderer that
    // cannot be asked for one. Its partial upload is `needsUpdate`, which three's WebGPU backend
    // honours through the texture's own update ranges.
    const props: any = (renderer as any).properties?.get?.(tex);
    const glTex = props?.__webglTexture;
    const gl = glTex
      ? ((renderer as any).getContext() as WebGL2RenderingContext)
      : null;
    if (!glTex || !gl) {
      // FALLBACK: no raw GL handle → full re-upload (acceptable first-cut; coarse but correct).
      tex.needsUpdate = true;
      return;
    }
    const fmtType = this._glFormatType(gl, tex.type);
    // Integer textures (the SH slab) take RGBA_INTEGER, not RGBA. Passing RGBA for a *32UI
    // internal format is an INVALID_OPERATION and the upload is silently dropped.
    const glFormat = tex.format === THREE.RGBAIntegerFormat ? gl.RGBA_INTEGER : gl.RGBA;
    const view = buf.subarray(rowBegins * width * comps, (rowBegins + rows) * width * comps);
    const prevUnpack = gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL);
    gl.bindTexture(gl.TEXTURE_2D, glTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, rowBegins, width, rows, glFormat, fmtType.type, view as any);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, prevUnpack);
  }

  private _glFormatType(gl: WebGL2RenderingContext, type: THREE.TextureDataType) {
    if (type === THREE.FloatType) return { type: gl.FLOAT };
    if (type === THREE.HalfFloatType) return { type: gl.HALF_FLOAT };
    if (type === THREE.UnsignedIntType) return { type: gl.UNSIGNED_INT };
    return { type: gl.UNSIGNED_BYTE };
  }

  /** Start up to `_maxFetches` concurrent chunk fetches from the queue (skip no-longer-wanted). */
  private _pumpFetches(wantedFiles: Set<number>) {
    while (this._fetching.size < this._maxFetches && this._fetchQueue.length) {
      const file = this._fetchQueue.shift()!;
      if (this._resident.has(file) || this._fetching.has(file)) continue;
      if (!wantedFiles.has(file)) continue; // stale request — dropped
      this._fetching.add(file);
      void this._fetchChunk(file);
    }
  }

  /** Acquire a free decode worker (waiting in FIFO if all are busy). */
  private _acquireDecodeWorker(): Promise<Worker> {
    const w = this._freeDecodeWorkers.pop();
    if (w) return Promise.resolve(w);
    return new Promise<Worker>((resolve) => this._decodeWaiters.push(resolve));
  }

  /** Return a decode worker to the pool (handing it straight to the next waiter if any). */
  private _releaseDecodeWorker(w: Worker) {
    const next = this._decodeWaiters.shift();
    if (next) next(w);
    else this._freeDecodeWorkers.push(w);
  }

  /** Fetch one SOG chunk (network on the main thread) → hand the raw WebP buffers to a decode
   * worker for the heavy per-splat decode + covariance + half-quantize → on `decoded` allocate slab
   * rows (evicting LRU if needed) and MEMCPY the ready-to-upload arrays into the slab (no per-splat
   * loop, no covariance on the main thread), then tell the sort worker its centres. */
  private async _fetchChunk(file: number) {
    try {
      const filename = this._listing.filenames[file]; // SOG: "1_0/meta.json" · FQ: "n3_l0.fq"
      const isFq = this._listing.format === "fq";
      // Fetch the node bytes on the main thread (so an app fetcher/requestManager keeps working):
      // FQ = one byte-range-able `.fq` blob; SOG = the WebP bundle (meta.json + 5 webp).
      let raw: Awaited<ReturnType<typeof fetchSOGChunkRaw>> | null = null;
      let packedBytes: ArrayBuffer | null = null;
      let shBytes: ArrayBuffer | null = null;
      if (isFq) {
        const get = this._fetchFn ?? ((u: string) => fetch(u));
        // The SH sidecar rides alongside the node, in parallel — it is a separate file precisely
        // so a viewer that doesn't want view-dependent colour never downloads it. A sidecar that
        // 404s or errors is NOT fatal: the node still renders, just flat.
        const shName = this._shBands > 0 ? this._listing.shFilenames?.[file] : undefined;
        [packedBytes, shBytes] = await Promise.all([
          get(`${this._rootAddress}/${filename}`).then((r) => r.arrayBuffer()),
          shName
            ? get(`${this._rootAddress}/${shName}`)
                .then((r) => (r.ok ? r.arrayBuffer() : null))
                .catch(() => null)
            : Promise.resolve(null),
        ]);
      } else {
        const dir = filename.replace(/\/meta\.json$/, "");
        raw = await fetchSOGChunkRaw(`${this._rootAddress}/${dir}`, this._fetchFn);
      }
      if (this._disposed) return;

      const decoder = await this._acquireDecodeWorker();
      if (this._disposed || !decoder) return;
      const decoded = await new Promise<{
        count: number;
        center: ArrayBuffer; covA: ArrayBuffer; covB: ArrayBuffer;
        color: ArrayBuffer; centers: ArrayBuffer; sh: ArrayBuffer | null;
      } | null>((resolve) => {
        const onMsg = (e: MessageEvent) => {
          if (e.data?.type !== "decoded" || e.data.file !== file) return;
          decoder.removeEventListener("message", onMsg);
          resolve(e.data);
        };
        decoder.addEventListener("message", onMsg);
        if (isFq) {
          const transfer: ArrayBuffer[] = [packedBytes!];
          if (shBytes) transfer.push(shBytes);
          decoder.postMessage({ type: "decodeFQ", file, bytes: packedBytes, sh: shBytes }, transfer);
        } else {
          const r = raw!;
          decoder.postMessage(
            {
              type: "decode",
              file,
              count: r.count,
              mins: r.mins,
              maxs: r.maxs,
              scalesCodebook: r.scalesCodebook,
              sh0Codebook: r.sh0Codebook,
              webp: r.webp,
            },
            [r.webp.meansL, r.webp.meansU, r.webp.scales, r.webp.quats, r.webp.sh0],
          );
        }
      });
      this._releaseDecodeWorker(decoder);
      if (this._disposed || !decoded) return;

      const count = decoded.count;
      const rows = Math.ceil(count / TEX_W);
      let rowBegins = this._alloc.alloc(rows);
      if (rowBegins < 0) {
        // EVICT least-recently-wanted resident chunks (not wanted this frame) until it fits.
        this._evictUntil(rows, file);
        rowBegins = this._alloc.alloc(rows);
      }
      if (rowBegins < 0) {
        // still no room (everything wanted this frame) → drop this chunk; it'll be retried later.
        return;
      }
      this._bakeDecoded(decoded, rowBegins, rows);
      this._resident.set(file, { rowBegins, rows, splatCount: count, lastWantedFrame: this._frame });
      // tell the sort worker the chunk's centres at its slab base (rowBegins*TEX_W); transfer it.
      this._worker.postMessage(
        { type: "addChunk", slabStart: rowBegins * TEX_W, centers: decoded.centers },
        [decoded.centers],
      );
    } finally {
      this._fetching.delete(file);
    }
  }

  /** Evict resident chunks by LRU (lastWantedFrame ascending) until a single contiguous free run
   * of >= `rowsNeeded` rows exists. Never evicts the chunk we are loading or any wanted this
   * frame. (Coalescing in the allocator stitches freed neighbours back into big-enough holes.) */
  private _evictUntil(rowsNeeded: number, keepFile: number) {
    if (this._freeRowsAtLeast(rowsNeeded)) return;
    const casualties = [...this._resident.entries()]
      .filter(([f, rc]) => f !== keepFile && rc.lastWantedFrame !== this._frame)
      .sort((a, b) => a[1].lastWantedFrame - b[1].lastWantedFrame);
    for (const [f, rc] of casualties) {
      this._alloc.free_(rc.rowBegins, rc.rows);
      this._resident.delete(f);
      this._worker.postMessage({ type: "removeChunk", slabStart: rc.rowBegins * TEX_W });
      if (this._freeRowsAtLeast(rowsNeeded)) break;
    }
  }

  /** True if a single contiguous free run of >= rows exists (probe: alloc then immediately free). */
  private _freeRowsAtLeast(rows: number): boolean {
    const start = this._alloc.alloc(rows);
    if (start >= 0) { this._alloc.free_(start, rows); return true; }
    return false;
  }

  /** Memcpy a WORKER-DECODED chunk (already in the exact slab RGBA layout) into the slab backing
   * arrays at [rowBegins..] and mark the row span dirty for the next GPU flush. The heavy per-splat
   * decode + covariance + half-quantize already happened in the decode worker — this is a straight
   * `.set()` at the chunk's slab base, no per-splat loop. */
  private _bakeDecoded(
    decoded: { center: ArrayBuffer; covA: ArrayBuffer; covB: ArrayBuffer; color: ArrayBuffer; sh?: ArrayBuffer | null },
    rowBegins: number,
    rows: number,
  ) {
    const base = rowBegins * TEX_W * 4;        // first component of the chunk's first splat slot
    this._bufCenter.set(new Float32Array(decoded.center), base);
    this._bufCovA.set(new Uint16Array(decoded.covA), base);
    this._bufCovB.set(new Uint16Array(decoded.covB), base);
    this._bufColor.set(new Uint8Array(decoded.color), base);
    // 12 bytes/splat instead of 4, but the SAME row base — splat i of the chunk lands at
    // rowBegins*TEX_W*12 + i*12, which is exactly texel 3i of row rowBegins+floor(i/TEX_W).
    if (this._bufSH) {
      const shBase = rowBegins * TEX_W * 4; // 4 uint32 per splat
      if (decoded.sh) this._bufSH.set(new Uint32Array(decoded.sh), shBase);
      // Sidecar missing or mismatched: RESET the region. The slab is recycled, so leaving it
      // alone would paint this chunk with the evicted tenant's coefficients.
      else this._bufSH.fill(SH_NEUTRAL, shBase, shBase + rows * TEX_W * 4);
    }
    // mark dirty rows (coalesced span)
    this._uploadDirty = true;
    if (rowBegins < this._dirtyRowMin) this._dirtyRowMin = rowBegins;
    if (rowBegins + rows - 1 > this._dirtyRowMax) this._dirtyRowMax = rowBegins + rows - 1;
  }

  /** Record the latest wanted slab ranges (when the resident set or camera direction changed) and
   * try to dispatch. Decoupled from {@link _dispatchSort} so a set that changes WHILE a sort is in
   * flight (a chunk finished streaming) is still flushed when that sort returns — instead of being
   * silently dropped until the camera next moves (which made loaded chunks stay invisible). */
  private _maybeSort(slices: WantedSlice[]) {
    const ranges = new Int32Array(slices.length * 2);
    let key = "";
    for (let i = 0; i < slices.length; i++) {
      ranges[i * 2] = slices[i].slabStart;
      ranges[i * 2 + 1] = slices[i].count;
      key += slices[i].slabStart + ":" + slices[i].count + "|";
    }
    const dirMoved = this._fwd.dot(this._lastDir) < 0.9995;
    if (key === this._lastRangesKey && !dirMoved) return; // nothing changed → nothing to do
    this._lastRangesKey = key;
    this._lastDir.copy(this._fwd);
    this._wantRanges = ranges;
    this._wantDir = [this._fwd.x, this._fwd.y, this._fwd.z];
    this._dirty = true;
    this._dispatchSort();
  }

  /** Issue the latest wanted ranges to the worker if no sort is in flight. Called from
   * {@link _maybeSort} and again whenever a sort completes, so the newest set always wins. */
  private _dispatchSort() {
    if (this._sortPending || !this._dirty) return;
    this._dirty = false;
    this._sortPending = true;
    this._version++;
    // send a copy of the buffer (postMessage clones it) so the retained _wantRanges stays intact
    this._worker.postMessage({
      type: "sortActive",
      dir: this._wantDir,
      ranges: this._wantRanges.buffer.slice(0),
      version: this._version,
    });
  }
}

// Build a LodMeta from a raw lod-meta.json object (duplicate of lodtree.loadLodMeta's parse so
// GSplatStream.create can use a custom fetcher for the manifest itself).
//
// CRITICAL: the manifest bounds are in the ORIGINAL splat space, but loadSOGChunkData decodes
// centres Y-UP (180° about X → negate y,z). So every node/leaf box MUST be flipped the same way,
// or the per-leaf distance-LOD AND the frustum cull run against mirrored bounds — detail loads on
// the wrong end and near leaves vanish as you approach (the "tiles load backwards" bug). Negating
// y,z swaps min/max on those axes: min=[mn.x,-mx.y,-mx.z], max=[mx.x,-mn.y,-mn.z].
function buildManifest(m: any): LodMeta {
  const leaves: Leaf[] = [];
  const build = (n: any): LodCell => {
    const o0 = n.bound.min as [number, number, number];
    const o1 = n.bound.max as [number, number, number];
    const min: [number, number, number] = [o0[0], -o1[1], -o1[2]];
    const max: [number, number, number] = [o1[0], -o0[1], -o0[2]];
    if (n.children) return { min, max, children: n.children.map(build) };
    const lods: LeafLod[] = [];
    for (const k of Object.keys(n.lods).sort((a, b) => +a - +b)) lods[+k] = n.lods[k];
    const leaf = leaves.length;
    leaves.push({ min, max, lods });
    return { min, max, leaf };
  };
  const tree = build(m.tree);
  return {
    filenames: m.filenames, leaves, tree, lodLevels: m.lodLevels, counts: m.counts, format: m.format,
    shBands: m.shBands, shFilenames: m.shFilenames,
  };
}
