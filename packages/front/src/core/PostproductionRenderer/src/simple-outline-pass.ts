import * as OBC from "@thatopen/components";
import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";

const PALETTE_SIZE = 256;
const DEFAULT_GROUP = "default";

interface OutlineGroup {
  id: number;
  name: string;
  /** Container parented to the root scene; ghost meshes live here. */
  container: THREE.Group;
  /** Dedicated material for this group, with its idColor uniform baked in. */
  material: THREE.ShaderMaterial;
  outlineColor: THREE.Color;
  fillColor: THREE.Color;
  fillOpacity: number;
  thickness: number;
  /**
   * Higher priority wins at coplanar pixels. Applied as a polygon-offset bias
   * on the group's material so depth test resolves ties in its favor.
   */
  priority: number;
}

/**
 * A proxy mesh attached to the pass via {@link SimpleOutlinePass.attachOutlinedTile}.
 *
 * The proxy carries its own `BufferGeometry` whose `attributes` and `index`
 * are aliased from the source tile (no GPU duplication) and whose
 * `groups` cover only the index chunks for outlined items in that tile.
 * Drawing the proxy with the group's mask material paints those chunks
 * into the mask buffer; everything else in the tile is invisible.
 *
 * Per-frame the proxy's `matrixWorld` is synced from the source so the
 * outline tracks the tile through camera moves and any model-level
 * transforms.
 */
interface OutlinedTileProxy {
  source: THREE.Mesh;
  proxy: THREE.Mesh;
  groupName: string;
}

const GHOST_VERT = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GHOST_FRAG = `
  uniform vec4 idColor;
  void main() { gl_FragColor = idColor; }
`;

/**
 * Multi-group outline pass.
 *
 * Every group has its own material with its id baked into a `idColor` uniform,
 * and its own container `Group` parented to a single root scene. Ghost meshes
 * are tagged at assign time (`mesh.material = group.material`) and added to
 * the group's container; all ghosts across all groups are then rendered into
 * the mask target in one `renderer.render(rootScene, camera)` call.
 *
 * A composite shader reads the mask (center pixel id), applies that group's
 * fill via a palette texture, then samples the neighborhood within the
 * group's thickness to paint an inward outline wherever the center is near a
 * different id.
 *
 * Legacy single-outline API (`outlineColor`, `thickness`, `fillColor`,
 * `fillOpacity`, `scene`) is preserved as a delegate to the "default" group.
 */
export class SimpleOutlinePass extends Pass {
  debugShowMask = false;

  private _world: OBC.World;
  private _maskTarget: THREE.WebGLRenderTarget;
  private _rootScene: THREE.Scene;
  private _fsQuad: FullScreenQuad;
  private _debugQuad: FullScreenQuad;

  private _groups = new Map<string, OutlineGroup>();
  private _groupsById = new Map<number, OutlineGroup>();
  /**
   * Outlined-tile proxies, keyed by source tile mesh. The pass owns the
   * proxy meshes (and their lightweight `BufferGeometry` wrappers); the
   * source meshes, their `attributes`, and their `index` belong to
   * fragments and are never mutated here.
   */
  private _outlinedTiles = new Map<THREE.Mesh, OutlinedTileProxy>();
  private _nextId = 1;
  private _maxThickness = 2;

  private _paletteData: Uint8Array;
  private _paletteTexture: THREE.DataTexture;

  constructor(width: number, height: number, world: OBC.World) {
    super();
    this._world = world;

    this._maskTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: true,
    });

    this._rootScene = new THREE.Scene();
    this._rootScene.background = null;

    this._paletteData = new Uint8Array(PALETTE_SIZE * 2 * 4);
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
    this._paletteTexture.needsUpdate = true;

    this._fsQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          tMask: { value: null },
          tPalette: { value: this._paletteTexture },
          resolution: { value: new THREE.Vector2(width, height) },
          maxThickness: { value: this._maxThickness },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec2 vUv;

          uniform sampler2D tDiffuse;
          uniform sampler2D tMask;
          uniform sampler2D tPalette;
          uniform vec2 resolution;
          uniform float maxThickness;

          // Palette is 256x2. y=0.25 (row 0) line, y=0.75 (row 1) fill.
          vec4 paletteLine(float id) {
            return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.25));
          }
          vec4 paletteFill(float id) {
            return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.75));
          }

          float readId(vec2 uv) {
            return floor(texture2D(tMask, uv).r * 255.0 + 0.5);
          }

          void main() {
            vec4 scene = texture2D(tDiffuse, vUv);
            float centerId = readId(vUv);

            if (centerId < 0.5) {
              gl_FragColor = scene;
              return;
            }

            // Inward outline: we are inside group centerId. Apply its fill,
            // and if any pixel within this group's thickness belongs to a
            // different id, we are near the group's interior silhouette and
            // paint the outline color. This guarantees outlines never spill
            // past the group's own footprint.
            vec4 fill = paletteFill(centerId);
            vec4 line = paletteLine(centerId);
            float t = line.a * 255.0;
            vec2 texel = 1.0 / resolution;

            vec3 rgb = mix(scene.rgb, fill.rgb, fill.a);

            float edge = 0.0;
            for (float y = -maxThickness; y <= maxThickness; y += 1.0) {
              if (abs(y) > t) continue;
              for (float x = -maxThickness; x <= maxThickness; x += 1.0) {
                if (abs(x) > t) continue;
                float nId = readId(vUv + vec2(x, y) * texel);
                if (nId != centerId) { edge = 1.0; break; }
              }
              if (edge > 0.5) break;
            }

            if (edge > 0.5) rgb = line.rgb;
            gl_FragColor = vec4(rgb, 1.0);
          }
        `,
      }),
    );

    this._debugQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        uniforms: { tMask: { value: null } },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tMask;
          varying vec2 vUv;
          void main() {
            float id = texture2D(tMask, vUv).r;
            gl_FragColor = vec4(vec3(id * 8.0), 1.0);
          }
        `,
      }),
    );

    // Create the default group so legacy code has something to target.
    this.addGroup(DEFAULT_GROUP, {
      outlineColor: new THREE.Color(0xffc800),
      fillColor: new THREE.Color(0xffff00),
      fillOpacity: 0.3,
      thickness: 2,
    });
  }

  // ---------------------------------------------------------------------------
  // Group API
  // ---------------------------------------------------------------------------

  /**
   * Creates a named outline group. Each group has its own container, material
   * (with id baked in) and visual config. No hard cap on active groups beyond
   * the palette size (255 concurrent).
   */
  addGroup(
    name: string,
    config?: Partial<
      Omit<OutlineGroup, "id" | "name" | "container" | "material">
    >,
  ) {
    let group = this._groups.get(name);
    if (group) {
      if (config) this.configureGroup(name, config);
      return group;
    }

    const id = this.allocateId();
    const priority = config?.priority ?? 0;

    const material = new THREE.ShaderMaterial({
      uniforms: { idColor: { value: new THREE.Vector4(id / 255, 0, 0, 1) } },
      vertexShader: GHOST_VERT,
      fragmentShader: GHOST_FRAG,
      depthTest: true,
      depthWrite: true,
      transparent: false,
      polygonOffset: priority !== 0,
      polygonOffsetFactor: -priority,
      polygonOffsetUnits: -priority,
    });

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
    this.updateMaxThickness();
    return group;
  }

  /**
   * Updates an existing group's visual config.
   */
  configureGroup(
    name: string,
    config: Partial<
      Omit<OutlineGroup, "id" | "name" | "container" | "material">
    >,
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
    this.updateMaxThickness();
  }

  /**
   * Removes a group. Detaches its ghost meshes (the caller still owns them)
   * and disposes the group's material.
   */
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
    this.clearPaletteEntry(group.id);
    this.updateMaxThickness();
  }

  hasGroup(name: string) {
    return this._groups.has(name);
  }

  getGroup(name: string) {
    return this._groups.get(name);
  }

  /**
   * Attaches a mesh to a group: assigns the group's material and parents the
   * mesh into the group's container. Creates the group on demand.
   */
  addMeshToGroup(mesh: THREE.Mesh, name: string) {
    let group = this._groups.get(name);
    if (!group) group = this.addGroup(name);
    mesh.material = group.material;
    group.container.add(mesh);
  }

  // ---------------------------------------------------------------------------
  // Outlined-tile API
  //
  // The mainstream way to outline geometry through this pass: hand it a
  // source tile mesh and the index chunks within that tile that should be
  // outlined. The pass clones the mesh sharing `geometry.attributes` /
  // `index` (no GPU duplication), adds `geometry.groups` for the chunks,
  // and keeps it in the named group's container.
  // ---------------------------------------------------------------------------

  /**
   * Attach a tile mesh as an outline target. Creates a proxy mesh that
   * shares the source's `geometry.attributes` and `index` and draws only
   * the slices specified by `position[i] / size[i]` (parallel arrays of
   * index-buffer offsets).
   *
   * Calling again with the same tile rebuilds the proxy's groups from
   * the new chunks; calling with a different `groupName` reparents the
   * proxy and reassigns its mask material.
   */
  attachOutlinedTile(
    tile: THREE.Mesh,
    chunks: { position: ArrayLike<number>; size: ArrayLike<number> },
    groupName: string = DEFAULT_GROUP,
  ) {
    let group = this._groups.get(groupName);
    if (!group) group = this.addGroup(groupName);

    const existing = this._outlinedTiles.get(tile);
    if (existing) {
      // Reuse the proxy shell; rebuild geometry groups against the new
      // chunks, and re-home it if the group changed.
      const proxy = existing.proxy;
      const proxyGeom = proxy.geometry;
      proxyGeom.clearGroups();
      this.fillProxyGroups(proxyGeom, chunks);
      if (existing.groupName !== groupName) {
        proxy.removeFromParent();
        // Material must stay as a single-element array; see comment below.
        proxy.material = [group.material];
        group.container.add(proxy);
        existing.groupName = groupName;
      }
      return;
    }

    const sourceGeom = tile.geometry;
    const proxyGeom = new THREE.BufferGeometry();
    proxyGeom.attributes = sourceGeom.attributes;
    if (sourceGeom.index) proxyGeom.setIndex(sourceGeom.index);
    proxyGeom.boundingBox = sourceGeom.boundingBox;
    proxyGeom.boundingSphere = sourceGeom.boundingSphere;
    this.fillProxyGroups(proxyGeom, chunks);

    // Material assigned as `Material[]`, not a single `Material`. Three's
    // `WebGLRenderer.renderObject` only honors `geometry.groups` when the
    // mesh's material is an array; with a single material it draws the
    // entire indexed geometry and ignores the groups, which would render
    // the whole tile silhouette instead of just the outlined slices.
    const proxy = new THREE.Mesh(proxyGeom, [group.material]);
    proxy.matrixAutoUpdate = false;
    proxy.matrixWorldAutoUpdate = false;
    proxy.frustumCulled = false; // matrix is owned by source; trust it
    proxy.matrixWorld.copy(tile.matrixWorld);

    group.container.add(proxy);
    this._outlinedTiles.set(tile, { source: tile, proxy, groupName });
  }

  /**
   * Stop outlining a tile. Removes the proxy from its container and
   * drops our reference to it. We deliberately do NOT call
   * `proxy.geometry.dispose()`: the proxy's `attributes` and `index`
   * are aliased from the source, and `BufferGeometry.dispose()`
   * dispatches a `dispose` event that tells `WebGLAttributes` to free
   * the GPU buffers of every attached attribute. That would yank the
   * source tile's GPU buffers too, after which the next source render
   * tries to re-upload from `attribute.array` and crashes because
   * fragments deletes the array on first upload to save memory.
   *
   * The proxy's tiny BufferGeometry wrapper (just metadata) is left to
   * GC. Attributes and index belong to fragments.
   */
  detachOutlinedTile(tile: THREE.Mesh) {
    const target = this._outlinedTiles.get(tile);
    if (!target) return;
    target.proxy.removeFromParent();
    this._outlinedTiles.delete(tile);
  }

  hasOutlinedTile(tile: THREE.Mesh) {
    return this._outlinedTiles.has(tile);
  }

  /**
   * Container (THREE.Group) where a group's ghost meshes live. Creates the
   * group on demand. Use {@link addMeshToGroup} when adding ghosts so the
   * right material gets assigned; this accessor is for introspection.
   */
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

  /**
   * @deprecated Previously a `THREE.Scene`. Now the default group's container
   * (a `THREE.Group`). Use `getGroupContainer(name)` or `addMeshToGroup(mesh, name)`.
   */
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

  // ---------------------------------------------------------------------------
  // Pass overrides
  // ---------------------------------------------------------------------------

  setSize(width: number, height: number) {
    this._maskTarget.setSize(width, height);
    const mat = this._fsQuad.material as THREE.ShaderMaterial;
    mat.uniforms.resolution.value.set(width, height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
  ) {
    const camera = this._world.camera.three;

    const prevClearColor = renderer.getClearColor(new THREE.Color());
    const prevClearAlpha = renderer.getClearAlpha();

    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(this._maskTarget);
    renderer.clear(true, true, false);

    // Sync proxy matrices from their source tiles. Cheap: bounded by the
    // number of currently-outlined tiles, not items. The source's
    // `matrixWorld` is updated by three when the model gets transformed.
    if (this._outlinedTiles.size > 0) {
      for (const target of this._outlinedTiles.values()) {
        target.proxy.matrixWorld.copy(target.source.matrixWorld);
      }
    }

    // Single draw of all groups. Each ghost mesh already holds its group's
    // material with the right id baked in; three.js sorts and batches the
    // draws, and the shared depth buffer gives "closer outlined item wins"
    // across groups.
    renderer.render(this._rootScene, camera);

    renderer.setClearColor(prevClearColor, prevClearAlpha);

    // --- Composite
    if (this.debugShowMask) {
      const debugMat = this._debugQuad.material as THREE.ShaderMaterial;
      debugMat.uniforms.tMask.value = this._maskTarget.texture;
      if (this.renderToScreen) renderer.setRenderTarget(null);
      else renderer.setRenderTarget(writeBuffer);
      this._debugQuad.render(renderer);
      return;
    }

    const mat = this._fsQuad.material as THREE.ShaderMaterial;
    mat.uniforms.tDiffuse.value = readBuffer.texture;
    mat.uniforms.tMask.value = this._maskTarget.texture;
    mat.uniforms.maxThickness.value = this._maxThickness;

    if (this.renderToScreen) renderer.setRenderTarget(null);
    else renderer.setRenderTarget(writeBuffer);
    this._fsQuad.render(renderer);
  }

  dispose() {
    // FullScreenQuad.dispose() only disposes its internal geometry; the
    // materials we passed in are our responsibility.
    (this._fsQuad.material as THREE.Material).dispose();
    (this._debugQuad.material as THREE.Material).dispose();
    this._fsQuad.dispose();
    this._debugQuad.dispose();

    this._maskTarget.dispose();
    this._paletteTexture.dispose();

    // Drop proxies but never call `proxy.geometry.dispose()`: see the
    // comment on `detachOutlinedTile` — disposing would cascade to the
    // aliased source attributes and crash the next source render.
    for (const target of this._outlinedTiles.values()) {
      target.proxy.removeFromParent();
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
  }

  /**
   * Push the given index chunks into the proxy's `geometry.groups`.
   * `Infinity` and `0xffffffff` are both treated as "to end of buffer";
   * three.js accepts `Infinity` natively, which we pass through.
   */
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

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private allocateId() {
    for (let i = 0; i < PALETTE_SIZE - 1; i++) {
      const candidate = ((this._nextId - 1 + i) % (PALETTE_SIZE - 1)) + 1;
      if (!this._groupsById.has(candidate)) {
        this._nextId = (candidate % (PALETTE_SIZE - 1)) + 1;
        return candidate;
      }
    }
    throw new Error(
      `SimpleOutlinePass: cannot allocate outline group id, ${PALETTE_SIZE - 1} groups active.`,
    );
  }

  private writePaletteEntry(group: OutlineGroup) {
    const id = group.id;
    const lineOffset = id * 4;
    const fillOffset = (PALETTE_SIZE + id) * 4;
    const data = this._paletteData;
    const clampByte = (v: number) =>
      Math.max(0, Math.min(255, Math.round(v)));

    data[lineOffset] = clampByte(group.outlineColor.r * 255);
    data[lineOffset + 1] = clampByte(group.outlineColor.g * 255);
    data[lineOffset + 2] = clampByte(group.outlineColor.b * 255);
    data[lineOffset + 3] = clampByte(group.thickness);

    data[fillOffset] = clampByte(group.fillColor.r * 255);
    data[fillOffset + 1] = clampByte(group.fillColor.g * 255);
    data[fillOffset + 2] = clampByte(group.fillColor.b * 255);
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

  private updateMaxThickness() {
    let max = 1;
    for (const group of this._groups.values()) {
      if (group.thickness > max) max = group.thickness;
    }
    this._maxThickness = Math.max(1, Math.round(max));
  }
}
