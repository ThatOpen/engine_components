import * as THREE from "three";
import { outlineIndex } from "./outline-index";

const PALETTE_SIZE = 256;
const DEFAULT_GROUP = "default";

interface OutlineGroup {
  id: number;
  name: string;
  /** Container parented to the mask scene; ghost/proxy meshes live here. */
  container: THREE.Group;
  /** Ghost NodeMaterial writing this group's id into the mask's R byte. */
  material: THREE.Material;
  outlineColor: THREE.Color;
  fillColor: THREE.Color;
  fillOpacity: number;
  thickness: number;
  priority: number;
}

interface OutlinedTileProxy {
  source: THREE.Mesh;
  proxy: THREE.Mesh;
  groupName: string;
}

/**
 * The REAL WebGPU outline pass — the bookkeeping half of the WebGL
 * `SimpleOutlinePass`, with the drawing done by the mounted TSL composition
 * instead of an EffectComposer pass. It owns exactly what the composition
 * needs to draw outlines:
 *
 *   - {@link maskScene}: a root scene of ghost proxies, one container per
 *     group, each proxy carrying its group's id-writing NodeMaterial. The
 *     composition renders it into an RGBA8 mask once per frame.
 *   - {@link paletteTexture}: the 256x2 palette the WebGL composite uses,
 *     byte-identical layout (row 0 line colour + thickness byte, row 1 fill
 *     colour + opacity byte), read live by the TSL composite.
 *   - {@link active}: whether anything is outlined RIGHT NOW. The host
 *     compiles the outline stage in only while this is true (see
 *     `needsRemount`), so an app that never outlines pays nothing — no mask
 *     target, no extra pass, no composite taps. That is the opt-in contract.
 *
 * API mirrors `SimpleOutlinePass` (groups, outlined tiles, the legacy
 * default-group accessors) so the Outliner and app code do not branch on the
 * engine. `resolutionScale` and `debugShowMask` are accepted and inert under
 * WebGPU for now (the mask runs full-res).
 */
export class WebGPUOutlinePass {
  debugShowMask = false;

  /** Accepted for API compatibility; the WebGPU mask runs full-res for now. */
  resolutionScale = 1;

  private _rootScene = new THREE.Scene();
  private _groups = new Map<string, OutlineGroup>();
  private _groupsById = new Map<number, OutlineGroup>();
  private _outlinedTiles = new Map<THREE.Mesh, Map<string, OutlinedTileProxy>>();
  private _nextId = 1;

  private _paletteData = new Uint8Array(PALETTE_SIZE * 2 * 4);
  private _paletteTexture: THREE.DataTexture;

  constructor() {
    this._rootScene.background = null;
    this._paletteTexture = new THREE.DataTexture(
      this._paletteData,
      PALETTE_SIZE,
      2,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    this._paletteTexture.minFilter = THREE.NearestFilter;
    this._paletteTexture.magFilter = THREE.NearestFilter;
    this._paletteTexture.wrapS = THREE.ClampToEdgeWrapping;
    this._paletteTexture.wrapT = THREE.ClampToEdgeWrapping;
    this._paletteTexture.colorSpace = THREE.NoColorSpace;
    this._paletteTexture.needsUpdate = true;

    this.addGroup(DEFAULT_GROUP, {
      outlineColor: new THREE.Color(0xffc800),
      fillColor: new THREE.Color(0xffff00),
      fillOpacity: 0.3,
      thickness: 2,
    });
  }

  // ---------------------------------------------------------------------------
  // The surface the composition consumes
  // ---------------------------------------------------------------------------

  /** The scene of ghost proxies the composition's mask pass renders. */
  get maskScene(): THREE.Scene {
    return this._rootScene;
  }

  /** The 256x2 line/fill palette the TSL composite samples. */
  get paletteTexture(): THREE.DataTexture {
    return this._paletteTexture;
  }

  /**
   * Whether anything is outlined right now.
   */
  get active(): boolean {
    for (const group of this._groups.values()) {
      if (group.container.children.length > 0) return true;
    }
    return false;
  }

  private _everActive = false;

  /**
   * Whether anything has EVER been outlined in this session. This — not
   * {@link active} — drives the opt-in compile: mounting the outline stage
   * costs a full pipeline remount plus its first-frame shader compile
   * (~1.1 s measured on an integrated laptop GPU), so flipping the stage with CONTENT
   * (compile on first attach, decompile on clear, recompile on the next
   * outline) turned every Clear ↔ Outline cycle into a second-long hitch.
   * Sticky instead: the first outline pays the mount once, and while the
   * Outliner stays enabled the stage stays compiled — an empty mask frame
   * costs one clear plus one mask read per pixel. An app that never
   * outlines anything still pays exactly nothing.
   */
  get everActive(): boolean {
    return this._everActive;
  }

  /**
   * Once-per-frame advance, called by the composition's `__refresh`: sync
   * proxy matrices from their source tiles so outlines track model
   * transforms. Bounded by outlined tiles, not items.
   */
  advance() {
    for (const perSet of this._outlinedTiles.values()) {
      for (const target of perSet.values()) {
        target.proxy.matrixWorld.copy(target.source.matrixWorld);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Group API (mirrors SimpleOutlinePass)
  // ---------------------------------------------------------------------------

  addGroup(
    name: string,
    config?: Partial<Omit<OutlineGroup, "id" | "name" | "container" | "material">>,
  ) {
    let group = this._groups.get(name);
    if (group) {
      if (config) this.configureGroup(name, config);
      return group;
    }

    const id = this.allocateId();
    const priority = config?.priority ?? 0;
    const material = this.buildGhostMaterial(id, priority);

    const container = new THREE.Group();
    container.name = `outline-group:${name}`;
    container.renderOrder = priority;
    this._rootScene.add(container);

    group = {
      id,
      name,
      container,
      material,
      outlineColor: config?.outlineColor?.clone() ?? new THREE.Color(0xffc800),
      fillColor: config?.fillColor?.clone() ?? new THREE.Color(0xffff00),
      fillOpacity: config?.fillOpacity ?? 0.3,
      thickness: config?.thickness ?? 2,
      priority,
    };

    this._groups.set(name, group);
    this._groupsById.set(id, group);
    this.writePaletteEntry(group);
    return group;
  }

  configureGroup(
    name: string,
    config: Partial<Omit<OutlineGroup, "id" | "name" | "container" | "material">>,
  ) {
    const group = this._groups.get(name);
    if (!group) return;
    if (config.outlineColor) group.outlineColor.copy(config.outlineColor);
    if (config.fillColor) group.fillColor.copy(config.fillColor);
    if (config.fillOpacity !== undefined) group.fillOpacity = config.fillOpacity;
    if (config.thickness !== undefined) group.thickness = config.thickness;
    if (config.priority !== undefined) {
      group.priority = config.priority;
      group.material.polygonOffset = config.priority !== 0;
      group.material.polygonOffsetFactor = -config.priority;
      group.material.polygonOffsetUnits = -config.priority;
      group.container.renderOrder = config.priority;
    }
    this.writePaletteEntry(group);
  }

  removeGroup(name: string) {
    if (name === DEFAULT_GROUP) return;
    const group = this._groups.get(name);
    if (!group) return;
    while (group.container.children.length) {
      group.container.children[0].removeFromParent();
    }
    group.container.removeFromParent();
    group.material.dispose();
    this._groups.delete(name);
    this._groupsById.delete(group.id);
    for (const [tile, perSet] of this._outlinedTiles) {
      if (perSet.delete(name) && perSet.size === 0) {
        this._outlinedTiles.delete(tile);
      }
    }
    this.clearPaletteEntry(group.id);
  }

  hasGroup(name: string) {
    return this._groups.has(name);
  }

  getGroup(name: string) {
    return this._groups.get(name);
  }

  /** Assigns the group's mask material and parents the mesh into the group. */
  addMeshToGroup(mesh: THREE.Mesh, name: string) {
    let group = this._groups.get(name);
    if (!group) group = this.addGroup(name);
    // A grouped geometry needs the material as an array for three to honour
    // `geometry.groups`; a group-less one must take the single material (an
    // array over no groups draws NOTHING — the streamed pick lesson).
    const grouped = mesh.geometry.groups && mesh.geometry.groups.length > 0;
    mesh.material = grouped ? [group.material] : group.material;
    group.container.add(mesh);
    this._everActive = true;
  }

  // ---------------------------------------------------------------------------
  // Outlined-tile API (mirrors SimpleOutlinePass)
  // ---------------------------------------------------------------------------

  attachOutlinedTile(
    tile: THREE.Mesh,
    chunks: { position: ArrayLike<number>; size: ArrayLike<number> },
    groupName: string = DEFAULT_GROUP,
  ) {
    let group = this._groups.get(groupName);
    if (!group) group = this.addGroup(groupName);

    let perSet = this._outlinedTiles.get(tile);
    if (!perSet) {
      perSet = new Map<string, OutlinedTileProxy>();
      this._outlinedTiles.set(tile, perSet);
    }

    const existing = perSet.get(groupName);
    if (existing) {
      const proxyGeom = existing.proxy.geometry;
      const index = outlineIndex(tile.geometry);
      if (index && proxyGeom.index !== index) proxyGeom.setIndex(index);
      proxyGeom.clearGroups();
      this.fillProxyGroups(proxyGeom, chunks);
      return;
    }

    const sourceGeom = tile.geometry;
    const proxyGeom = new THREE.BufferGeometry();
    proxyGeom.attributes = sourceGeom.attributes;
    const index = outlineIndex(sourceGeom);
    if (index) proxyGeom.setIndex(index);
    proxyGeom.boundingBox = sourceGeom.boundingBox;
    proxyGeom.boundingSphere = sourceGeom.boundingSphere;
    this.fillProxyGroups(proxyGeom, chunks);

    // Array material because the proxy HAS groups (see addMeshToGroup).
    const proxy = new THREE.Mesh(proxyGeom, [group.material]);
    proxy.matrixAutoUpdate = false;
    proxy.matrixWorldAutoUpdate = false;
    proxy.frustumCulled = false; // matrix is owned by source; trust it
    proxy.matrixWorld.copy(tile.matrixWorld);

    group.container.add(proxy);
    perSet.set(groupName, { source: tile, proxy, groupName });
    this._everActive = true;
  }

  /**
   * Stop outlining a tile. The proxy geometry is NOT disposed: its attributes
   * and index alias the source tile's, and disposing would free the source's
   * GPU buffers (the same lesson as SimpleOutlinePass).
   */
  detachOutlinedTile(tile: THREE.Mesh, groupName: string = DEFAULT_GROUP) {
    const perSet = this._outlinedTiles.get(tile);
    if (!perSet) return;
    const target = perSet.get(groupName);
    if (!target) return;
    target.proxy.removeFromParent();
    perSet.delete(groupName);
    if (perSet.size === 0) this._outlinedTiles.delete(tile);
  }

  hasOutlinedTile(tile: THREE.Mesh, groupName?: string) {
    const perSet = this._outlinedTiles.get(tile);
    if (!perSet) return false;
    return groupName === undefined ? perSet.size > 0 : perSet.has(groupName);
  }

  getGroupContainer(name: string): THREE.Object3D {
    let group = this._groups.get(name);
    if (!group) group = this.addGroup(name);
    return group.container;
  }

  /** @deprecated Kept for API compatibility. Use {@link getGroupContainer}. */
  getGroupScene(name: string): THREE.Object3D {
    return this.getGroupContainer(name);
  }

  listGroups() {
    return [...this._groups.keys()];
  }

  // ---------------------------------------------------------------------------
  // Legacy singular API (delegates to the default group)
  // ---------------------------------------------------------------------------

  get scene(): THREE.Object3D {
    return this._groups.get(DEFAULT_GROUP)!.container;
  }

  get outlineColor() {
    return this._groups.get(DEFAULT_GROUP)!.outlineColor;
  }

  set outlineColor(value: THREE.Color) {
    this.configureGroup(DEFAULT_GROUP, { outlineColor: value });
  }

  get thickness() {
    return this._groups.get(DEFAULT_GROUP)!.thickness;
  }

  set thickness(value: number) {
    this.configureGroup(DEFAULT_GROUP, { thickness: value });
  }

  get fillColor() {
    return this._groups.get(DEFAULT_GROUP)!.fillColor;
  }

  set fillColor(value: THREE.Color) {
    this.configureGroup(DEFAULT_GROUP, { fillColor: value });
  }

  get fillOpacity() {
    return this._groups.get(DEFAULT_GROUP)!.fillOpacity;
  }

  set fillOpacity(value: number) {
    this.configureGroup(DEFAULT_GROUP, { fillOpacity: value });
  }

  dispose() {
    for (const perSet of this._outlinedTiles.values()) {
      for (const target of perSet.values()) {
        target.proxy.removeFromParent();
      }
    }
    this._outlinedTiles.clear();
    for (const group of this._groups.values()) {
      while (group.container.children.length) {
        group.container.children[0].removeFromParent();
      }
      group.container.removeFromParent();
      group.material.dispose();
    }
    this._groups.clear();
    this._groupsById.clear();
    this._paletteTexture.dispose();
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  /**
   * The ghost material: writes the group id into the mask's R byte, opaque,
   * depth-tested, so the closest outlined surface wins across groups —
   * exactly what the GLSL GHOST shader does. Built lazily per group, and only
   * ever under the webgpu build (this class is constructed by
   * `WebGPUPostproduction`, which only exists there).
   *
   * v1 divergence, same as the picker's TSL twins: no clipping-plane cutout
   * (a `fragmentNode` override bypasses the node clipping setup).
   */
  private buildGhostMaterial(id: number, priority: number): THREE.Material {
    const TSL = (THREE as any).TSL;
    if (!TSL || typeof (THREE as any).NodeMaterial !== "function") {
      throw new Error(
        "WebGPUOutlinePass: `three` must resolve to the webgpu build (ESGPU) " +
          "before outline groups are created.",
      );
    }
    const { vec4, Fn } = TSL;
    const material = new (THREE as any).NodeMaterial();
    material.fragmentNode = Fn(() => vec4(id / 255, 0, 0, 1))();
    material.depthTest = true;
    material.depthWrite = true;
    material.transparent = false;
    material.polygonOffset = priority !== 0;
    material.polygonOffsetFactor = -priority;
    material.polygonOffsetUnits = -priority;
    return material as THREE.Material;
  }

  private fillProxyGroups(
    proxyGeom: THREE.BufferGeometry,
    chunks: { position: ArrayLike<number>; size: ArrayLike<number> },
  ) {
    const positions = chunks.position;
    const sizes = chunks.size;
    const n = Math.min(positions.length, sizes.length);
    for (let i = 0; i < n; i++) {
      const start = positions[i];
      const raw = sizes[i];
      const count = raw === 0xffffffff ? Infinity : raw;
      proxyGeom.addGroup(start, count, 0);
    }
  }

  private allocateId() {
    for (let i = 0; i < PALETTE_SIZE - 1; i++) {
      const candidate = ((this._nextId - 1 + i) % (PALETTE_SIZE - 1)) + 1;
      if (!this._groupsById.has(candidate)) {
        this._nextId = (candidate % (PALETTE_SIZE - 1)) + 1;
        return candidate;
      }
    }
    throw new Error(
      `WebGPUOutlinePass: cannot allocate outline group id, ${PALETTE_SIZE - 1} groups active.`,
    );
  }

  private writePaletteEntry(group: OutlineGroup) {
    const id = group.id;
    const lineOffset = id * 4;
    const fillOffset = (PALETTE_SIZE + id) * 4;
    const data = this._paletteData;
    const clampByte = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    // 🔴 IN THE COLOURS AS SEEN. The palette is read as the picture's own values (`NoColorSpace`), and a `THREE.Color`
    // keeps its components linear: written as they were, the accent purple #6528d7 was drawn as navy, a chosen floor
    // (32, 21, 91) where its purple at 40 % is (55, 31, 104) (Antonio, 2026-10-16: «NADA se debe ver azul»).
    const line = group.outlineColor.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace);
    const fill = group.fillColor.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace);

    data[lineOffset] = clampByte(line.r * 255);
    data[lineOffset + 1] = clampByte(line.g * 255);
    data[lineOffset + 2] = clampByte(line.b * 255);
    data[lineOffset + 3] = clampByte(group.thickness);

    data[fillOffset] = clampByte(fill.r * 255);
    data[fillOffset + 1] = clampByte(fill.g * 255);
    data[fillOffset + 2] = clampByte(fill.b * 255);
    data[fillOffset + 3] = clampByte(group.fillOpacity * 255);

    this._paletteTexture.needsUpdate = true;
  }

  private clearPaletteEntry(id: number) {
    const data = this._paletteData;
    const lineOffset = id * 4;
    const fillOffset = (PALETTE_SIZE + id) * 4;
    for (let i = 0; i < 4; i++) data[lineOffset + i] = 0;
    for (let i = 0; i < 4; i++) data[fillOffset + i] = 0;
    this._paletteTexture.needsUpdate = true;
  }
}
