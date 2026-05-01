import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Volume } from "./volume";
import { MeasureMark } from "./measure-mark";

/**
 * Per-tile chunk shape returned by `FragmentsModel.getItemDrawChunks`.
 * Re-declared here so we don't pull an internal fragments type into
 * MeasureVolume's signature.
 */
interface ItemDrawChunks {
  tileId: number;
  position: Uint32Array;
  size: Uint32Array;
}

/**
 * Visual representation of a {@link Volume} measurement.
 *
 * Items added to the volume are highlighted by **proxy meshes** that
 * alias each source tile's `BufferGeometry` attributes and `index`,
 * with `geometry.groups` set to the per-item draw ranges returned by
 * `FragmentsModel.getItemDrawChunks`. No vertex / normal / index data
 * is duplicated — a proxy carries no GPU memory of its own beyond a
 * small `BufferGeometry` wrapper. On a 250k-item model this means the
 * cost of visualising a measurement is proportional to the number of
 * items the user has clicked, not the total geometry of the model.
 *
 * (Previous implementation materialised one full `THREE.Mesh` per
 * picked item by deep-copying the tile geometry through `Mesher`,
 * which dominated memory once a measurement contained more than a
 * handful of items.)
 */
export class MeasureVolume {
  private _components: OBC.Components;

  private _material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    color: "red",
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  /**
   * Wrapped in a one-element array because three only honours
   * `geometry.groups` when the mesh's material is `Material[]`.
   */
  private get materialArray(): THREE.Material[] {
    return [this._material];
  }

  set material(value: THREE.MeshLambertMaterial) {
    this._material.dispose();
    this._material = value;
    for (const mesh of this.meshes) {
      mesh.material = [value];
    }
  }

  get material() {
    return this._material;
  }

  private _visible = true;

  set visible(value: boolean) {
    this._visible = value;
    this.label.visible = value;
    for (const mesh of this.meshes) {
      if (value) {
        this.world.scene.three.add(mesh);
      } else {
        mesh.removeFromParent();
      }
    }
  }

  get visible() {
    return this._visible;
  }

  set rounding(value: number) {
    this.label.rounding = value;
  }

  get rounding() {
    return this.label.rounding;
  }

  set units(value: "m3" | "cm3" | "mm3" | "km3") {
    this.label.units = value;
  }

  get units() {
    return this.label.units as "m3" | "cm3" | "mm3" | "km3";
  }

  private _color = new THREE.Color();

  set color(color: THREE.Color) {
    this._color = color;
    this.label.color = color;
    this._material.color.set(color);
  }

  get color() {
    return this._color;
  }

  readonly label: MeasureMark;
  world: OBC.World;
  volume: Volume;
  meshes: THREE.Mesh[] = [];

  constructor(
    components: OBC.Components,
    world: OBC.World,
    volume = new Volume(components),
  ) {
    this._components = components;
    this.world = world;
    this.volume = volume;
    this.label = new MeasureMark(world);
    this.visible = true;
    this.update();
    this.volume.onItemsChanged.add(() => this.update());
  }

  applyPlanesVisibility(planes: THREE.Plane[]) {
    if (!this.label.wasVisible) return;
    let isBehind = false;
    for (const mesh of this.meshes) {
      for (const plane of planes) {
        if (plane.distanceToPoint(mesh.position) < 0) {
          isBehind = true;
          break;
        }
      }
      this.label.three.visible = !isBehind;
    }
  }

  private async updateMesh() {
    this.cleanMeshes();
    const fragments = this._components.get(OBC.FragmentsManager);
    if (!fragments.initialized) return;

    for (const [modelId, localIds] of Object.entries(this.volume.items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      if (!localIds || (localIds as Set<number>).size === 0) continue;
      let chunks: ItemDrawChunks[];
      try {
        chunks = (await (model as any).getItemDrawChunks(
          localIds,
        )) as ItemDrawChunks[];
      } catch {
        continue;
      }
      if (!chunks || chunks.length === 0) continue;
      for (const entry of chunks) {
        const tile = model.tiles.get(entry.tileId);
        if (!tile) continue;
        const proxy = this.buildProxy(tile, entry.position, entry.size);
        this.world.scene.three.add(proxy);
        this.meshes.push(proxy);
      }
    }
  }

  /**
   * Build a single proxy mesh for one tile + its picked draw chunks.
   * Aliases the source geometry's attributes and index, so the proxy
   * holds no GPU buffers of its own. Material is wrapped in
   * `Material[]` because three only honours `geometry.groups` when
   * the mesh's material is an array.
   *
   * Mirrors the Hoverer / Outliner proxy pattern.
   */
  private buildProxy(
    tile: THREE.Mesh,
    positions: Uint32Array,
    sizes: Uint32Array,
  ): THREE.Mesh {
    const sourceGeom = tile.geometry as THREE.BufferGeometry;
    const proxyGeom = new THREE.BufferGeometry();
    proxyGeom.attributes = sourceGeom.attributes;
    if (sourceGeom.index) proxyGeom.setIndex(sourceGeom.index);
    proxyGeom.boundingBox = sourceGeom.boundingBox;
    proxyGeom.boundingSphere = sourceGeom.boundingSphere;

    const n = Math.min(positions.length, sizes.length);
    for (let i = 0; i < n; i++) {
      const start = positions[i];
      const raw = sizes[i];
      const count = raw === 0xffffffff ? Infinity : raw;
      proxyGeom.addGroup(start, count, 0);
    }

    const proxy = new THREE.Mesh(proxyGeom, this.materialArray);
    proxy.matrixAutoUpdate = false;
    proxy.matrixWorldAutoUpdate = false;
    // The source tile's matrixWorld is owned by fragments and updated
    // when the model is repositioned; mirroring it here keeps the
    // proxy in lockstep without three running a redundant matrix
    // recompute every frame.
    proxy.frustumCulled = false;
    proxy.matrixWorld.copy(tile.matrixWorld);
    proxy.userData.__measureVolumeSource = tile;
    return proxy;
  }

  async update() {
    await this.updateMesh();
    const value = await this.volume.getRawValue();
    this.label.visible = value !== 0;
    this.label.value = value;
    const center = await this.volume.getCenter();
    if (center) this.label.three.position.copy(center);
  }

  private cleanMeshes() {
    for (const mesh of this.meshes) {
      mesh.removeFromParent();
      // We don't call `geometry.dispose()` on the proxy: its
      // attributes and index are aliased from the source tile, and
      // disposing would free the source's GPU buffers and break the
      // model render. The lightweight `BufferGeometry` wrapper itself
      // is GC'd along with the mesh.
    }
    this.meshes = [];
  }

  dispose() {
    this.label.dispose();
    this.cleanMeshes();
    this._material.dispose();
    this.volume.items = {};
  }
}
