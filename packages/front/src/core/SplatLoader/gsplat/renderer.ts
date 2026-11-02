import * as THREE from "three";
import type { SplatData } from "./ply";
import { SORT_WORKER_SRC } from "./sort-worker-src";
import { TEX_W, mkQuadGeo, mkSplatMaterial, buildCovariance } from "./shaders";
import type { ISplatRenderer } from "./types";

/**
 * The from-scratch WebGL2 3D-Gaussian-splat renderer. Splat data lives in GPU textures; an instanced quad shader does the
 * antimatter15/EWA covariance projection; a worker keeps the draw order depth-sorted.
 *
 * UNIFIED global sort: every LOD level is concatenated into ONE buffer, a 10³ cell grid
 * picks a LOD per cell each frame (by camera distance) + frustum-culls cells, and the
 * worker sorts the whole visible subset GLOBALLY — so there are never cross-tile blending
 * seams and the GPU does a single draw. A single dataset is just the degenerate one-level
 * case (cells are visible-or-culled), so this one path serves both.
 *
 * FIRST-CLASS deferred integration: unlike a standalone viewer (which draws all splats at
 * `gl_Position.z = 0` with depth-test OFF and relies purely on its own back-to-front order),
 * here every splat writes its CENTRE's reversed-Z depth and the material depth-TESTS
 * (`GreaterEqualDepth`, no depth write) against the BIM depth borrowed by the occlusion seam.
 * That is what lets BIM geometry occlude the splats with no shader patching — exactly how a
 * real mesh would behave in the pipeline.
 */

// ---- LOD distance pick (mirrors lodtree.pickLod for the unified cell grid) ------------------
function pickLod(dist: number, base: number, mult: number, maxLod: number): number {
  let lod = 0;
  let r = base;
  while (lod < maxLod && dist > r) { r *= mult; lod++; }
  return lod;
}

/**
 * One loaded splat dataset: GPU textures + an instanced mesh + a depth-sort worker.
 * `object` is a {@link THREE.Group} the caller places (anchor / BIM alignment) and adds to the
 * splat scene; `update(camera)` re-picks per-cell LOD, frustum-culls and re-sorts as the camera
 * moves. Correct under an arbitrary `object` transform: the frustum + camera position + sort
 * direction are all taken into the dataset's LOCAL space first.
 */
export class GSplat implements ISplatRenderer {
  readonly object = new THREE.Group();
  readonly center = new THREE.Vector3();
  readonly radius: number;
  readonly total: number;
  readonly nCells: number;

  private readonly _mesh: THREE.Mesh;
  private readonly _geo: THREE.InstancedBufferGeometry;
  private readonly _mat: THREE.RawShaderMaterial;
  private readonly _aIndex: THREE.InstancedBufferAttribute;
  private readonly _idxArr: Float32Array;
  private readonly _worker: Worker;
  private readonly _workerUrl: string;
  private readonly _textures: THREE.Texture[] = [];
  private _gpuBytes = 0;
  private _disposed = false;

  // shared frame uniforms (the loader pushes viewport/focal/minPx each frame)
  private readonly _uViewport = { value: new THREE.Vector2(1, 1) };
  private readonly _uFocal = { value: new THREE.Vector2() };
  private readonly _uMinPx = { value: 3 };
  private readonly _uOrtho = { value: 0 }; // 1 under an orthographic camera



  // unified cell-grid state
  private readonly _G = 10;
  private readonly _nLev: number;
  private readonly _mn: [number, number, number];
  private readonly _sz: [number, number, number];
  private readonly _cellCenter: Float32Array;
  private _base: number;
  private readonly _mult = 2.0;
  private readonly _lastLod: Int16Array;
  private readonly _cellLod: Uint8Array;
  private readonly _CULLED = 255;

  // sort throttling
  private _visN = 0;
  private _sortMs = 0;
  private _sortPending = false;
  private _version = 0;
  private _dirty = true;
  private _visCells = 0;

  // scratch
  private readonly _fwd = new THREE.Vector3();
  private readonly _lastDir = new THREE.Vector3(0, 0, 1);
  private readonly _frustum = new THREE.Frustum();
  private readonly _pvm = new THREE.Matrix4();
  private readonly _mInv = new THREE.Matrix4();
  private readonly _nrm3 = new THREE.Matrix3();
  private readonly _camLocal = new THREE.Vector3();
  private readonly _cbox = new THREE.Box3();

  /** Build from one or more LOD levels (finest → coarsest). A single level = no LOD switching,
   * just global sort + frustum cull. All levels share one set of GPU textures + one draw. */
  constructor(datas: SplatData[]) {
    const toHalf = THREE.DataUtils.toHalfFloat;
    this._nLev = datas.length;
    this.total = datas.reduce((a, d) => a + d.count, 0);
    const texH = Math.ceil(this.total / TEX_W);
    const textureLength = TEX_W * texH;

    const centerBuf = new Float32Array(textureLength * 4);
    const covAh = new Uint16Array(textureLength * 4);
    const covBh = new Uint16Array(textureLength * 4);
    const colorU8 = new Uint8Array(textureLength * 4);
    const allCenters = new Float32Array(this.total * 3);

    // scene bounds (local space) for the cell grid
    const mn: [number, number, number] = [Infinity, Infinity, Infinity];
    const mx: [number, number, number] = [-Infinity, -Infinity, -Infinity];
    for (const d of datas) {
      for (let i = 0; i < d.count; i++) {
        for (let c = 0; c < 3; c++) {
          const v = d.centers[i * 3 + c];
          if (v < mn[c]) mn[c] = v;
          if (v > mx[c]) mx[c] = v;
        }
      }
    }
    const G = this._G;
    const nCells = (this.nCells = G * G * G);
    const sz: [number, number, number] = [mx[0] - mn[0] || 1, mx[1] - mn[1] || 1, mx[2] - mn[2] || 1];
    this._mn = mn;
    this._sz = sz;
    const cellFor = (x: number, y: number, z: number) => {
      const cx = Math.min(G - 1, Math.max(0, ((x - mn[0]) / sz[0] * G) | 0));
      const cy = Math.min(G - 1, Math.max(0, ((y - mn[1]) / sz[1] * G) | 0));
      const cz = Math.min(G - 1, Math.max(0, ((z - mn[2]) / sz[2] * G) | 0));
      return (cz * G + cy) * G + cx;
    };
    const nLev = this._nLev;
    const groupsTmp: number[][][] = Array.from({ length: nCells }, () =>
      Array.from({ length: nLev }, () => [] as number[]),
    );

    let g = 0;
    for (let L = 0; L < nLev; L++) {
      const d = datas[L];
      const { covA, covB } = buildCovariance(d.scales, d.quats, d.count, d.count);
      for (let i = 0; i < d.count; i++) {
        const cx = d.centers[i * 3], cy = d.centers[i * 3 + 1], cz = d.centers[i * 3 + 2];
        centerBuf[g * 4] = cx; centerBuf[g * 4 + 1] = cy; centerBuf[g * 4 + 2] = cz;
        allCenters[g * 3] = cx; allCenters[g * 3 + 1] = cy; allCenters[g * 3 + 2] = cz;
        covAh[g * 4] = toHalf(covA[i * 4]); covAh[g * 4 + 1] = toHalf(covA[i * 4 + 1]); covAh[g * 4 + 2] = toHalf(covA[i * 4 + 2]);
        covBh[g * 4] = toHalf(covB[i * 4]); covBh[g * 4 + 1] = toHalf(covB[i * 4 + 1]); covBh[g * 4 + 2] = toHalf(covB[i * 4 + 2]);
        colorU8[g * 4] = d.colors[i * 4] * 255; colorU8[g * 4 + 1] = d.colors[i * 4 + 1] * 255;
        colorU8[g * 4 + 2] = d.colors[i * 4 + 2] * 255; colorU8[g * 4 + 3] = d.colors[i * 4 + 3] * 255;
        groupsTmp[cellFor(cx, cy, cz)][L].push(g);
        g++;
      }
    }

    // flatten groups → one index list + per-(cell,level) start/count (sent to the worker once)
    const groupStart = new Uint32Array(nCells * nLev);
    const groupCount = new Uint32Array(nCells * nLev);
    const groupIdx = new Uint32Array(this.total);
    let gpos = 0;
    for (let c = 0; c < nCells; c++) {
      for (let L = 0; L < nLev; L++) {
        const arr = groupsTmp[c][L];
        const gi = c * nLev + L;
        groupStart[gi] = gpos; groupCount[gi] = arr.length;
        for (let k = 0; k < arr.length; k++) groupIdx[gpos++] = arr[k];
      }
    }

    // per-cell centre (local) for distance-based LOD
    this._cellCenter = new Float32Array(nCells * 3);
    for (let cz = 0; cz < G; cz++) {
      for (let cy = 0; cy < G; cy++) {
        for (let cx = 0; cx < G; cx++) {
          const ci = (cz * G + cy) * G + cx;
          this._cellCenter[ci * 3] = mn[0] + (cx + 0.5) / G * sz[0];
          this._cellCenter[ci * 3 + 1] = mn[1] + (cy + 0.5) / G * sz[1];
          this._cellCenter[ci * 3 + 2] = mn[2] + (cz + 0.5) / G * sz[2];
        }
      }
    }
    this.center.set((mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2);
    this.radius = Math.hypot(sz[0], sz[1], sz[2]) / 2 || 1;
    this._base = this.radius * 0.55;
    this._lastLod = new Int16Array(nCells).fill(-1);
    this._cellLod = new Uint8Array(nCells);

    // material: premultiplied "over", DEPTH-TESTED against the borrowed BIM depth (reversed-Z),
    // never writing depth. DoubleSide because the EWA offset can flip quad winding.
    // material: premultiplied "over", DEPTH-TESTED against the borrowed BIM depth (reversed-Z;
    // three AUTO-INVERTS LessEqual→GreaterEqual at GL level under the deferred pipeline), never
    // writing depth. Shared with the streaming renderer via mkSplatMaterial.
    this._mat = mkSplatMaterial({
      texCenter: this._dataTex(centerBuf, texH),
      texCovA: this._halfTex(covAh, texH),
      texCovB: this._halfTex(covBh, texH),
      texColor: this._u8Tex(colorU8, texH),
      uViewport: this._uViewport,
      uFocal: this._uFocal,
      uMinPx: this._uMinPx,
      uOrtho: this._uOrtho,
    });

    this._geo = mkQuadGeo();
    this._idxArr = new Float32Array(this.total);
    this._aIndex = new THREE.InstancedBufferAttribute(this._idxArr, 1);
    this._aIndex.setUsage(THREE.DynamicDrawUsage);
    this._geo.setAttribute("aSlot", this._aIndex);
    this._geo.instanceCount = 0;
    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.frustumCulled = false; // we cull per-cell ourselves
    this._mesh.userData.splatCount = 0;
    this.object.add(this._mesh);

    // worker (inlined Blob — no bundler worker-asset dependency)
    this._workerUrl = URL.createObjectURL(
      new Blob([SORT_WORKER_SRC], { type: "application/javascript" }),
    );
    this._worker = new Worker(this._workerUrl);
    this._worker.postMessage(
      {
        type: "initGroups",
        centers: allCenters.buffer,
        groupIdx: groupIdx.buffer,
        groupStart: groupStart.buffer,
        groupCount: groupCount.buffer,
        nLev,
      },
      [allCenters.buffer, groupIdx.buffer, groupStart.buffer, groupCount.buffer],
    );
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
    };
  }

  /** GPU-texture bytes allocated for this dataset (diagnostic). */
  get gpuBytes() {
    return this._gpuBytes;
  }
  /** Splats actually being drawn this frame (visible subset after LOD + cull). */
  get drawn() {
    return this._visN;
  }
  /** Cells passing the frustum cull this frame. */
  get cellsInView() {
    return this._visCells;
  }
  get sortMs() {
    return this._sortMs;
  }
  /** LOD base distance (local units). Smaller = finer/closer = more splats. */
  get lodBase() {
    return this._base;
  }
  set lodBase(d: number) {
    this._base = d;
    this._lastLod.fill(-1);
    this._dirty = true;
  }

  /** Push per-frame uniforms (the loader computes these from the seam ctx + camera). */
  setFrameUniforms(width: number, height: number, camera: THREE.Camera, minPixelSize: number) {
    this._uViewport.value.set(width, height);
    const e = (camera as THREE.PerspectiveCamera).projectionMatrix.elements;
    this._uFocal.value.set(e[0] * 0.5 * width, e[5] * 0.5 * height);
    this._uMinPx.value = minPixelSize;
    this._uOrtho.value = (camera as THREE.OrthographicCamera).isOrthographicCamera ? 1 : 0;
  }

  /**
   * Per frame: re-pick per-cell LOD by distance, frustum-cull cells, and (when the camera
   * direction or the LOD set changed) re-sort the visible subset off-thread. All geometry tests
   * are done in the dataset's LOCAL space so an arbitrary `object` transform stays correct.
   */
  update(camera: THREE.PerspectiveCamera) {
    if (this._disposed) return;
    this.object.updateMatrixWorld();
    this._mInv.copy(this.object.matrixWorld).invert();

    // frustum in LOCAL space: proj · viewInverse · objectWorld
    this._pvm
      .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      .multiply(this.object.matrixWorld);
    this._frustum.setFromProjectionMatrix(this._pvm);

    // camera position + forward in LOCAL space
    this._camLocal.copy(camera.position).applyMatrix4(this._mInv);
    camera.getWorldDirection(this._fwd);
    this._nrm3.getNormalMatrix(this._mInv); // inverse-transpose of the object matrix
    this._fwd.applyMatrix3(this._nrm3).normalize();

    const G = this._G, mn = this._mn, sz = this._sz;
    const csx = sz[0] / G, csy = sz[1] / G, csz = sz[2] / G;
    const px = this._camLocal.x, py = this._camLocal.y, pz = this._camLocal.z;
    let changed = false;
    this._visCells = 0;
    for (let c = 0; c < this.nCells; c++) {
      const cx = c % G, cy = ((c / G) | 0) % G, cz = (c / (G * G)) | 0;
      this._cbox.min.set(mn[0] + cx * csx, mn[1] + cy * csy, mn[2] + cz * csz);
      this._cbox.max.set(this._cbox.min.x + csx, this._cbox.min.y + csy, this._cbox.min.z + csz);
      let lod: number;
      if (!this._frustum.intersectsBox(this._cbox)) {
        lod = this._CULLED;
      } else {
        const dx = this._cellCenter[c * 3] - px;
        const dy = this._cellCenter[c * 3 + 1] - py;
        const dz = this._cellCenter[c * 3 + 2] - pz;
        lod = Math.min(this._nLev - 1, pickLod(Math.hypot(dx, dy, dz), this._base, this._mult, this._nLev - 1));
        this._visCells++;
      }
      this._cellLod[c] = lod;
      if (lod !== this._lastLod[c]) { this._lastLod[c] = lod; changed = true; }
    }
    if (changed) this._dirty = true;

    const dirMoved = this._fwd.dot(this._lastDir) < 0.9995;
    if (!this._sortPending && (this._dirty || dirMoved)) {
      this._lastDir.copy(this._fwd);
      this._dirty = false;
      this._sortPending = true;
      this._version++;
      this._worker.postMessage({
        type: "sortCells",
        dir: [this._fwd.x, this._fwd.y, this._fwd.z],
        cellLod: this._cellLod.slice().buffer,
        version: this._version,
      });
    }
  }

  dispose() {
    this._disposed = true;
    this._worker.terminate();
    URL.revokeObjectURL(this._workerUrl);
    this.object.remove(this._mesh);
    this._geo.dispose();
    this._mat.dispose();
    for (const t of this._textures) t.dispose();
  }

  // ---- texture helpers (track GPU bytes) ----
  private _dataTex(buf: Float32Array, h: number) {
    const t = new THREE.DataTexture(buf, TEX_W, h, THREE.RGBAFormat, THREE.FloatType);
    t.minFilter = t.magFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    this._gpuBytes += TEX_W * h * 16;
    this._textures.push(t);
    return t;
  }
  private _halfTex(buf: Uint16Array, h: number) {
    const t = new THREE.DataTexture(buf, TEX_W, h, THREE.RGBAFormat, THREE.HalfFloatType);
    t.minFilter = t.magFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    this._gpuBytes += TEX_W * h * 8;
    this._textures.push(t);
    return t;
  }
  private _u8Tex(buf: Uint8Array, h: number) {
    const t = new THREE.DataTexture(buf, TEX_W, h, THREE.RGBAFormat, THREE.UnsignedByteType);
    t.minFilter = t.magFilter = THREE.NearestFilter;
    t.colorSpace = THREE.NoColorSpace;
    t.needsUpdate = true;
    this._gpuBytes += TEX_W * h * 4;
    this._textures.push(t);
    return t;
  }
}
