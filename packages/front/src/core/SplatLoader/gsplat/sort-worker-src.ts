// The splat depth-sort worker, inlined as a SOURCE STRING so it can be instantiated from a
// Blob URL (`new Worker(URL.createObjectURL(new Blob([SORT_WORKER_SRC])))`). Inlining avoids
// every bundler-specific worker-asset path (`new URL(...import.meta.url)` behaves differently
// across Vite library mode, webpack, esbuild, …) — a published library can't assume any of them.
//
// An O(n) counting sort over quantized view depth, run off the render
// thread. Two clients:
//  - `init` + `sort`      : sort a whole (or subset) index buffer.
//  - `initGroups` + `sortCells` : the UNIFIED global sort. centres + per-(cell,level) index
//    groups are sent ONCE; each frame the main thread sends only the per-cell chosen-LOD bytes,
//    the worker builds the visible set from them and sorts it GLOBALLY (no per-tile sort → no
//    cross-tile blending artifact), then transfers back the far→near order.
//
// Plain JS (no TS types) so it runs verbatim as a classic worker.
export const SORT_WORKER_SRC = /* js */ `
let centers = null, count = 0, order = null, depths = null;
let groupIdx = null, groupStart = null, groupCount = null, nLev = 0, active = null;
const BUCKETS = 65536;
const counts = new Uint32Array(BUCKETS);

function runSort(idx, N, dx, dy, dz) {
  const c = centers, ord = order, dep = depths;
  let dmin = Infinity, dmax = -Infinity;
  for (let i = 0; i < N; i++) {
    const o = idx[i] * 3;
    const d = c[o] * dx + c[o + 1] * dy + c[o + 2] * dz;
    dep[i] = d; if (d < dmin) dmin = d; if (d > dmax) dmax = d;
  }
  const scale = (BUCKETS - 1) / (dmax - dmin || 1);
  counts.fill(0);
  for (let i = 0; i < N; i++) counts[((dep[i] - dmin) * scale) | 0]++;
  let acc = 0;
  for (let b = 0; b < BUCKETS; b++) { const cc = counts[b]; counts[b] = acc; acc += cc; }
  for (let i = 0; i < N; i++) ord[counts[((dep[i] - dmin) * scale) | 0]++] = idx[i];
  const out = new Uint32Array(N);
  for (let i = 0; i < N; i++) out[i] = ord[N - 1 - i]; // far first (back-to-front)
  return out;
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    centers = new Float32Array(m.centers); count = centers.length / 3;
    order = new Uint32Array(count); depths = new Float32Array(count);
    self.postMessage({ type: "ready", count }); return;
  }
  if (m.type === "initGroups") {
    centers = new Float32Array(m.centers); count = centers.length / 3;
    order = new Uint32Array(count); depths = new Float32Array(count); active = new Uint32Array(count);
    groupIdx = new Uint32Array(m.groupIdx); groupStart = new Uint32Array(m.groupStart);
    groupCount = new Uint32Array(m.groupCount); nLev = m.nLev;
    self.postMessage({ type: "ready", count }); return;
  }
  if (m.type === "sort" && centers && order && depths) {
    const t0 = performance.now();
    const dx = m.dir[0], dy = m.dir[1], dz = m.dir[2];
    const sub = m.active ? new Uint32Array(m.active) : null;
    let idx, N;
    if (sub) { idx = sub; N = sub.length; }
    else { idx = (active || (active = new Uint32Array(count))); for (let i = 0; i < count; i++) idx[i] = i; N = count; }
    const out = runSort(idx, N, dx, dy, dz);
    self.postMessage({ type: "sorted", order: out.buffer, version: m.version, sortMs: performance.now() - t0, n: N }, [out.buffer]);
    return;
  }
  if (m.type === "sortCells" && centers && groupIdx && groupStart && groupCount && active) {
    const t0 = performance.now();
    const dx = m.dir[0], dy = m.dir[1], dz = m.dir[2];
    const cellLod = new Uint8Array(m.cellLod);
    let N = 0;
    for (let cIdx = 0; cIdx < cellLod.length; cIdx++) {
      const lod = cellLod[cIdx];
      if (lod >= nLev) continue; // culled cell (outside frustum) contributes nothing
      const gi = cIdx * nLev + lod;
      const s = groupStart[gi], n = groupCount[gi];
      for (let k = 0; k < n; k++) active[N++] = groupIdx[s + k];
    }
    const out = runSort(active, N, dx, dy, dz);
    self.postMessage({ type: "sorted", order: out.buffer, version: m.version, sortMs: performance.now() - t0, n: N }, [out.buffer]);
    return;
  }

  // ── STREAMING protocol (out-of-core GSplatStream) ─────────────────────────
  // 'centers' is a fixed BUDGET-sized slab; chunks copy their centres into their slab rows on
  // load and the main thread sends the per-frame wanted slab index RANGES to sort GLOBALLY.
  if (m.type === "initBudget") {
    count = m.budget;
    centers = new Float32Array(count * 3);   // slab of BUDGET splat centres (rows mirror the GPU)
    order = new Uint32Array(count); depths = new Float32Array(count); active = new Uint32Array(count);
    self.postMessage({ type: "ready", count }); return;
  }
  if (m.type === "addChunk" && centers) {
    // slabStart = rowStart*2048 (absolute splat index of the chunk's first slab slot).
    const cen = new Float32Array(m.centers);
    centers.set(cen, m.slabStart * 3);
    return;
  }
  if (m.type === "removeChunk" && centers) {
    // nothing to clear: evicted rows are simply never referenced by a wanted range until reused.
    return;
  }
  if (m.type === "sortActive" && centers && active) {
    const t0 = performance.now();
    const dx = m.dir[0], dy = m.dir[1], dz = m.dir[2];
    // ranges = Int32Array [start0,count0, start1,count1, …] (absolute slab indices). Expand into
    // the active list, then global counting-sort back-to-front by centre·dir.
    const ranges = new Int32Array(m.ranges);
    let N = 0;
    for (let r = 0; r < ranges.length; r += 2) {
      const s = ranges[r], n = ranges[r + 1];
      for (let k = 0; k < n; k++) active[N++] = s + k;
    }
    const out = runSort(active, N, dx, dy, dz);
    self.postMessage({ type: "sorted", order: out.buffer, version: m.version, sortMs: performance.now() - t0, n: N }, [out.buffer]);
  }
};
`;
