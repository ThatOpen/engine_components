import * as OBC from "@thatopen/components";
import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";
import { outlineIndex } from "./outline-index";

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
  #include <clipping_planes_pars_vertex>
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <clipping_planes_vertex>
  }
`;

const GHOST_FRAG = `
  #include <clipping_planes_pars_fragment>
  uniform vec4 idColor;
  void main() {
    #include <clipping_planes_fragment>
    gl_FragColor = idColor;
  }
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

  // Reduced-resolution outline path (resolutionScale < 1). When scaled, the
  // mask AND the edge/fill composite run at reduced resolution into
  // _overlayBuffer (a premultiplied-alpha overlay), which _blendQuad then
  // upscales (one bilinear sample) over the full-resolution scene. A scale of
  // 1 keeps the single-pass full-quality path untouched.
  private _overlayBuffer: THREE.WebGLRenderTarget;
  private _overlayQuad: FullScreenQuad;
  private _blendQuad: FullScreenQuad;
  private _width: number;
  private _height: number;
  private _resolutionScale = 1;

  private _groups = new Map<string, OutlineGroup>();
  private _groupsById = new Map<number, OutlineGroup>();
  /**
   * Outlined-tile proxies, keyed by source tile mesh. The pass owns the
   * proxy meshes (and their lightweight `BufferGeometry` wrappers); the
   * source meshes, their `attributes`, and their `index` belong to
   * fragments and are never mutated here.
   */
  private _outlinedTiles = new Map<string, OutlinedTileProxy>();
  private _nextId = 1;
  private _maxThickness = 2;

  private _paletteData: Uint8Array;
  private _paletteTexture: THREE.DataTexture;

  constructor(width: number, height: number, world: OBC.World) {
    super();
    this._world = world;
    this._width = width;
    this._height = height;

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

            // Inner outline of width t, sampled as a fixed 8-tap RING at
            // radius t (diagonals normalized by 1/sqrt(2) so they land at
            // radius t too). A box scan of the whole neighbourhood cost
            // O((2t+1)^2) dependent reads for every interior pixel (they never
            // hit the early break), which made a close-up selection filling
            // the screen the frame's bottleneck. The ring is O(1) whatever the
            // thickness: a tap of length t hitting a different id means a
            // boundary is within t along that direction, so it paints the
            // same solid t-wide inward band.
            float edge = 0.0;
            if (t >= 0.5) {
              vec2 o = texel * t;
              const float D = 0.70710678;
              if      (readId(vUv + vec2( o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0,  o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0, -o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D, -o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D, -o.y * D)) != centerId) edge = 1.0;
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

    // Overlay buffer for the reduced-resolution path (LinearFilter so the
    // full-resolution blend upscales it bilinearly). Starts 1x1; sized to the
    // scaled resolution only while resolutionScale < 1. No depth: it is a
    // flat overlay.
    this._overlayBuffer = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false,
    });

    // Overlay shader: the same id-based fill + 8-tap ring edge as the
    // composite, but it outputs a PREMULTIPLIED-alpha overlay (no scene read)
    // so it can be upscaled and blended over the full-resolution scene without
    // edge fringing. `outlineScale` (= resolutionScale) keeps the outline the
    // same on-screen thickness after upscaling.
    this._overlayQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          tMask: { value: null },
          tPalette: { value: this._paletteTexture },
          resolution: { value: new THREE.Vector2(width, height) },
          outlineScale: { value: 1 },
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
          uniform sampler2D tMask;
          uniform sampler2D tPalette;
          uniform vec2 resolution;
          uniform float outlineScale;

          vec4 paletteLine(float id) { return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.25)); }
          vec4 paletteFill(float id) { return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.75)); }
          float readId(vec2 uv) { return floor(texture2D(tMask, uv).r * 255.0 + 0.5); }

          void main() {
            float centerId = readId(vUv);
            if (centerId < 0.5) { gl_FragColor = vec4(0.0); return; }

            vec4 fill = paletteFill(centerId);
            vec4 line = paletteLine(centerId);
            // Thickness in scaled pixels: full-resolution thickness x scale,
            // at least 1 so a thin outline survives the downscale (0 stays 0).
            float tFull = line.a * 255.0;
            float t = tFull < 0.5 ? 0.0 : max(1.0, tFull * outlineScale);
            vec2 texel = 1.0 / resolution;

            float edge = 0.0;
            if (t >= 0.5) {
              vec2 o = texel * t;
              const float D = 0.70710678;
              if      (readId(vUv + vec2( o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0,  o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0, -o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D, -o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D, -o.y * D)) != centerId) edge = 1.0;
            }

            vec3 col = edge > 0.5 ? line.rgb : fill.rgb;
            float a = edge > 0.5 ? 1.0 : fill.a;
            gl_FragColor = vec4(col * a, a);
          }
        `,
      }),
    );

    // Blends the (upscaled, premultiplied) overlay over the full-resolution scene.
    this._blendQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          tDiffuse: { value: null },
          tOverlay: { value: null },
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
          uniform sampler2D tOverlay;
          void main() {
            vec4 scene = texture2D(tDiffuse, vUv);
            vec4 ov = texture2D(tOverlay, vUv);
            gl_FragColor = vec4(scene.rgb * (1.0 - ov.a) + ov.rgb, scene.a);
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
      clipping: true,
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
    for (const [key, target] of this._outlinedTiles) {
      if (target.groupName !== name) continue;
      target.proxy.removeFromParent();
      this._outlinedTiles.delete(key);
    }
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

    const key = this.getOutlinedTileKey(tile, groupName);
    const existing = this._outlinedTiles.get(key);
    if (existing) {
      const proxy = existing.proxy;
      const proxyGeom = proxy.geometry;
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
    this._outlinedTiles.set(key, { source: tile, proxy, groupName });
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
  detachOutlinedTile(tile: THREE.Mesh, groupName?: string) {
    if (groupName !== undefined) {
      const key = this.getOutlinedTileKey(tile, groupName);
      const target = this._outlinedTiles.get(key);
      if (!target) return;
      target.proxy.removeFromParent();
      this._outlinedTiles.delete(key);
      return;
    }

    for (const [key, target] of this._outlinedTiles) {
      if (target.source !== tile) continue;
      target.proxy.removeFromParent();
      this._outlinedTiles.delete(key);
    }
  }

  hasOutlinedTile(tile: THREE.Mesh, groupName?: string) {
    if (groupName !== undefined) {
      return this._outlinedTiles.has(this.getOutlinedTileKey(tile, groupName));
    }
    for (const target of this._outlinedTiles.values()) {
      if (target.source === tile) return true;
    }
    return false;
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

  /**
   * Internal resolution the selection mask and outline composite render at,
   * as a fraction of the canvas (0.25 to 1). 1 (default) = full quality, the
   * single-pass path. Lower (e.g. 0.5) renders the mask and composite at
   * reduced resolution into an overlay that is upscaled over the
   * full-resolution scene: about 4x cheaper at 0.5, slightly softer, to hold
   * the framerate when a selection covers much of the screen. The scene
   * itself is never downscaled.
   */
  get resolutionScale() {
    return this._resolutionScale;
  }

  set resolutionScale(value: number) {
    const scale = Math.min(1, Math.max(0.25, value));
    if (scale === this._resolutionScale) return;
    this._resolutionScale = scale;
    this.applyResolution();
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.applyResolution();
  }

  /** Sizes the mask and overlay targets and their uniforms for the current scale. */
  private applyResolution() {
    const scale = this._resolutionScale;
    const fullWidth = Math.max(1, this._width);
    const fullHeight = Math.max(1, this._height);
    const width =
      scale >= 1 ? fullWidth : Math.max(1, Math.floor(fullWidth * scale));
    const height =
      scale >= 1 ? fullHeight : Math.max(1, Math.floor(fullHeight * scale));

    this._maskTarget.setSize(width, height);
    // The full-resolution composite reads the mask, so its `resolution`
    // tracks the mask size.
    const mat = this._fsQuad.material as THREE.ShaderMaterial;
    mat.uniforms.resolution.value.set(width, height);

    if (scale < 1) {
      this._overlayBuffer.setSize(width, height);
      const overlay = this._overlayQuad.material as THREE.ShaderMaterial;
      overlay.uniforms.resolution.value.set(width, height);
      overlay.uniforms.outlineScale.value = scale;
    } else {
      // Full resolution: the overlay buffer is unused, kept tiny.
      this._overlayBuffer.setSize(1, 1);
    }
  }

  /** The ghosts this pass took out of sight for having no data: looked at again before every frame. */
  private readonly _withoutData = new Set<THREE.Object3D>();

  /** Whether every attribute and the index of an object's geometry still hold their data. */
  private hasData(object: THREE.Object3D) {
    const geometry = (object as THREE.Mesh).geometry as
      | THREE.BufferGeometry
      | undefined;
    if (!geometry) return true;
    const attributes = Object.values(geometry.attributes ?? {}) as {
      array?: unknown;
      data?: { array?: unknown };
    }[];
    const index = geometry.index as { array?: unknown } | null;
    return (
      attributes.every(
        (one) =>
          one && (one.array !== undefined || one.data?.array !== undefined),
      ) &&
      (!index || index.array !== undefined)
    );
  }

  /**
   * A ghost whose geometry holds no data is left out of the mask until it has
   * some. A ghost draws the geometry of a mesh of the model, and one being
   * written again (an element moved, undone) is for a moment a geometry with
   * an attribute that has no array: three then throws in `createBuffer` on
   * every frame, and each frame that throws is very slow for as long as the
   * element stays outlined.
   *
   * Only AFTER three has thrown, never before every frame: a geometry with
   * no array is the ordinary state of a model mesh already on the GPU
   * (fragments lets go of the arrays once they are uploaded). Looked at
   * before each frame, every ghost would be left out and nothing outlined.
   */
  private leaveOutWhatHasNoData() {
    this._rootScene.traverse((object) => {
      if (!object.visible || this.hasData(object)) return;
      object.visible = false;
      this._withoutData.add(object);
    });
  }

  /** What was left out comes back once its geometry holds data again; one that left the scene is forgotten. */
  private showAgainWhatHasData() {
    if (this._withoutData.size === 0) return;
    for (const object of [...this._withoutData]) {
      if (!object.parent || object.visible) {
        this._withoutData.delete(object);
        continue;
      }
      if (!this.hasData(object)) continue;
      object.visible = true;
      this._withoutData.delete(object);
    }
  }

  /**
   * The local clipping planes of the renderer onto every group's mask
   * material, so the outline and fill are cut by section planes in local
   * clipping mode too. Global planes already reach the mask through
   * `three.clippingPlanes`; local ones (`isLocal`, kept out of that list by
   * the renderer) have to be set per material. Changing the plane count
   * recompiles the ghost shader (rare: only on plane add/remove).
   */
  private syncLocalClippingPlanes() {
    const all =
      (this._world.renderer as { clippingPlanes?: THREE.Plane[] } | undefined)
        ?.clippingPlanes ?? [];
    let local: THREE.Plane[] | null = null;
    for (const plane of all) {
      if (!(plane as { isLocal?: boolean }).isLocal) continue;
      if (!local) local = [];
      local.push(plane);
    }
    for (const group of this._groups.values()) {
      const current = group.material.clippingPlanes;
      if (!local) {
        if (current && current.length) group.material.clippingPlanes = null;
        continue;
      }
      const same =
        current &&
        current.length === local.length &&
        current.every((plane, i) => plane === local![i]);
      if (!same) group.material.clippingPlanes = local;
    }
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

    this.syncLocalClippingPlanes();

    // Single draw of all groups. Each ghost mesh already holds its group's
    // material with the right id baked in; three.js sorts and batches the
    // draws, and the shared depth buffer gives "closer outlined item wins"
    // across groups.
    this.showAgainWhatHasData();
    try {
      renderer.render(this._rootScene, camera);
    } catch (error) {
      this.leaveOutWhatHasNoData();
      console.error(
        "[outline] a ghost could not be drawn and was left out:",
        error,
      );
    }

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

    if (this._resolutionScale >= 1) {
      // Full-resolution single-pass composite.
      const mat = this._fsQuad.material as THREE.ShaderMaterial;
      mat.uniforms.tDiffuse.value = readBuffer.texture;
      mat.uniforms.tMask.value = this._maskTarget.texture;
      mat.uniforms.maxThickness.value = this._maxThickness;

      if (this.renderToScreen) renderer.setRenderTarget(null);
      else renderer.setRenderTarget(writeBuffer);
      this._fsQuad.render(renderer);
      return;
    }

    // Reduced resolution: the mask was already drawn at the scaled size
    // above. Build the premultiplied overlay at that size, then upscale-blend
    // it over the full-resolution scene. NoBlending on both quads: each
    // overwrites every pixel, so neither target needs a clear first.
    const overlay = this._overlayQuad.material as THREE.ShaderMaterial;
    overlay.uniforms.tMask.value = this._maskTarget.texture;
    renderer.setRenderTarget(this._overlayBuffer);
    this._overlayQuad.render(renderer);

    const blend = this._blendQuad.material as THREE.ShaderMaterial;
    blend.uniforms.tDiffuse.value = readBuffer.texture;
    blend.uniforms.tOverlay.value = this._overlayBuffer.texture;
    if (this.renderToScreen) renderer.setRenderTarget(null);
    else renderer.setRenderTarget(writeBuffer);
    this._blendQuad.render(renderer);
  }

  dispose() {
    // FullScreenQuad.dispose() only disposes its internal geometry; the
    // materials we passed in are our responsibility.
    (this._fsQuad.material as THREE.Material).dispose();
    (this._debugQuad.material as THREE.Material).dispose();
    (this._overlayQuad.material as THREE.Material).dispose();
    (this._blendQuad.material as THREE.Material).dispose();
    this._fsQuad.dispose();
    this._debugQuad.dispose();
    this._overlayQuad.dispose();
    this._blendQuad.dispose();

    this._maskTarget.dispose();
    this._overlayBuffer.dispose();
    this._withoutData.clear();
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

  private getOutlinedTileKey(tile: THREE.Mesh, groupName: string) {
    return `${groupName}:${tile.uuid}`;
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
