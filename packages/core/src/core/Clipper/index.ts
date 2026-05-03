import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import {
  Component,
  Configurable,
  Createable,
  Disposable,
  Event,
  Hideable,
  World,
} from "../Types";
import { SimplePlane } from "./src";
import { Components } from "../Components";
import { Raycasters } from "../Raycasters";
import { Worlds } from "../Worlds";
import { ClipperConfig, ClipperConfigManager } from "./src/clipper-config";
import { ConfigManager } from "../ConfigManager";
import { UUID } from "../../utils";
import { FragmentsManager } from "../../fragments";

export * from "./src";

/**
 * A lightweight component to easily create, delete and handle [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes). 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Clipper). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Clipper).
 */
export class Clipper
  extends Component
  implements
    Createable,
    Disposable,
    Hideable,
    Configurable<ClipperConfigManager, ClipperConfig>
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "66290bc5-18c4-4cd1-9379-2e17a0617611" as const;

  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event();

  /** Event that fires when the user starts dragging a clipping plane. */
  readonly onBeforeDrag = new Event<SimplePlane>();

  /** Event that fires when the user stops dragging a clipping plane. */
  readonly onAfterDrag = new Event<SimplePlane>();

  /**
   * Event that fires when the user starts creating a clipping plane.
   */
  readonly onBeforeCreate = new Event();

  /**
   * Event that fires when the user cancels the creation of a clipping plane.
   */
  readonly onBeforeCancel = new Event();

  /**
   * Event that fires after the user cancels the creation of a clipping plane.
   */
  readonly onAfterCancel = new Event();

  /**
   * Event that fires when the user starts deleting a clipping plane.
   */
  readonly onBeforeDelete = new Event();

  /**
   * Event that fires after a clipping plane has been created.
   * @param plane - The newly created clipping plane.
   */
  readonly onAfterCreate = new Event<SimplePlane>();

  /**
   * Event that fires after a clipping plane has been deleted.
   * @param plane - The deleted clipping plane.
   */
  readonly onAfterDelete = new Event<SimplePlane>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /** {@link Configurable.isSetup} */
  isSetup = false;

  /**
   * Whether to force the clipping plane to be orthogonal in the Y direction
   * (up). This is desirable when clipping a building horizontally and a
   * clipping plane is created in its roof, which might have a slight
   * slope for draining purposes.
   */
  orthogonalY = false;

  /**
   * The tolerance that determines whether an almost-horizontal clipping plane
   * will be forced to be orthogonal to the Y direction. {@link orthogonalY}
   * has to be `true` for this to apply.
   */
  toleranceOrthogonalY = 0.7;

  /**
   * Whether clipping planes should automatically scale based on
   * camera distance. When true, the plane surface stays proportional
   * to the arrow gizmo as you zoom in/out. Default is true.
   */
  autoScalePlanes = true;

  /**
   * When true, planes created by this Clipper are flagged
   * `isLocal: true` so they stay out of `renderer.three.clippingPlanes`
   * (the WebGL-level global list). All clipping happens via per-
   * material `material.clippingPlanes`, which `Clipper.updateMaterialsAndPlanes`
   * already populates from the renderer's component-side array. The
   * global list still works for non-Clipper code that pushes its own
   * planes via `setPlane(active, plane, /*isLocal*\/ false)`.
   *
   * Why this matters: with planes only on materials (not global),
   * consumers like {@link ClipStyler} can give their section fill /
   * line meshes a *different* `material.clippingPlanes` list — one
   * that excludes the section's own plane — so the cut geometry
   * sits exactly on the cut without being discarded by it. The old
   * 1cm world-space offset workaround is no longer needed and the
   * fill stays aligned at every camera angle (issue #733).
   *
   * Default `false` to preserve existing behavior. Set this once
   * before creating planes; toggling at runtime won't reclassify
   * planes already on the renderer.
   */
  localClippingPlanes = false;

  /**
   * The type of clipping plane to be created.
   * Default is {@link SimplePlane}.
   */
  Type: new (...args: any) => SimplePlane = SimplePlane;

  /**
   * A list of all the clipping planes created by this component.
   */
  readonly list = new FRAGS.DataMap<string, SimplePlane>();

  /** {@link Configurable.config} */
  config = new ClipperConfigManager(
    this,
    this.components,
    "Clipper",
    Clipper.uuid,
  );

  protected _defaultConfig: ClipperConfig = {
    color: new THREE.Color(0xbb00ff),
    opacity: 0.2,
    size: 2,
  };

  /** The material used in all the clipping planes. */
  private _material = new THREE.MeshBasicMaterial({
    color: 0xbb00ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });

  private _size = 5;
  private _enabled = false;
  private _visible = true;
  readonly onStateChanged = new Event<("enabled" | "visibility" | "material" | "size")[]>()

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    this.onStateChanged.trigger(["enabled"])
    // for (const [_, plane] of this.list) {
    //   plane.enabled = state;
    // }
    // this.updateMaterialsAndPlanes();
  }

  /** {@link Hideable.visible } */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible } */
  set visible(state: boolean) {
    this._visible = state;
    for (const [_, plane] of this.list) {
      plane.visible = state;
    }
    this.onStateChanged.trigger(["visibility"])
  }

  /** The material of the clipping plane representation. */
  get material() {
    return this._material;
  }

  /** The material of the clipping plane representation. */
  set material(material: THREE.MeshBasicMaterial) {
    this._material = material;
    for (const [_, plane] of this.list) {
      plane.planeMaterial = material;
    }
    this.onStateChanged.trigger(["material"])
  }

  /** The size of the geometric representation of the clippings planes. */
  get size() {
    return this._size;
  }

  /** The size of the geometric representation of the clippings planes. */
  set size(size: number) {
    this._size = size;
    for (const [_, plane] of this.list) {
      plane.size = size;
    }
    this.onStateChanged.trigger(["size"])
  }

  constructor(components: Components) {
    super(components);
    this.components.add(Clipper.uuid, this);
    this.setEvents();
  }

  private setEvents() {
    this.list.onBeforeDelete.add(({ value: plane }) => {
      if (!plane.world.renderer) {
        throw new Error("Renderer not found for this plane's world!");
      }
      plane.world.renderer.setPlane(false, plane.three);
      plane.dispose();
      this.updateMaterialsAndPlanes();

      this.onAfterDelete.trigger(plane);
    });

    // Subscribe to fragments material lifecycle so we can auto-bind
    // their `clippingPlanes` in local-clipping mode. Done once here
    // (not on every plane operation) — the per-material handler
    // checks `localClippingPlanes` lazily so legacy mode is a no-op
    // for fragments materials (they get clipped by the renderer's
    // global list as before). If fragments hasn't been initialized
    // yet, wait for the first model load before subscribing —
    // accessing `fragments.core` throws until `init()` has run.
    const fragments = this.components.get(FragmentsManager);
    if (fragments.initialized) {
      this.subscribeToFragmentMaterials();
    } else {
      const onceLoaded = () => {
        fragments.onFragmentsLoaded.remove(onceLoaded);
        this.subscribeToFragmentMaterials();
      };
      fragments.onFragmentsLoaded.add(onceLoaded);
    }
  }

  private subscribeToFragmentMaterials() {
    const fragments = this.components.get(FragmentsManager);
    // Existing materials at subscribe time (the model that just
    // loaded plus any already-loaded ones).
    for (const [, material] of fragments.core.models.materials.list) {
      this.applyClippingToFragmentMaterial(material);
    }
    // Future materials (additional models loaded later, dynamically
    // created highlight materials, etc.).
    fragments.core.models.materials.list.onItemSet.add(({ value }) => {
      this.applyClippingToFragmentMaterial(value);
    });
  }

  /**
   * Assign `material.clippingPlanes` to the renderer's component-
   * side `clippingPlanes` array — the only place local planes live
   * once `localClippingPlanes = true`. In legacy global-clipping
   * mode this is a no-op: the renderer's global list handles
   * fragments clipping and assigning per-material would just be
   * redundant.
   *
   * Applied to every fragment material, including LOD line
   * materials — they need the planes too, otherwise far-LOD line
   * geometry stays visible past the cut while the shell geometry
   * clips correctly.
   */
  private applyClippingToFragmentMaterial(material: THREE.Material) {
    if (!this.localClippingPlanes) return;
    const worlds = this.components.get(Worlds);
    for (const [, world] of worlds.list) {
      if (!world.renderer) continue;
      material.clippingPlanes = world.renderer.clippingPlanes;
      return;
    }
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._enabled = false;

    const configs = this.components.get(ConfigManager);
    configs.list.delete(this.config.uuid);
    this.list.clear();
    this._material.dispose();
    this.onBeforeCreate.reset();
    this.onBeforeCancel.reset();
    this.onBeforeDelete.reset();
    this.onBeforeDrag.reset();
    this.onAfterCreate.reset();
    this.onAfterCancel.reset();
    this.onAfterDelete.reset();
    this.onAfterDrag.reset();
    this.onDisposed.trigger(Clipper.uuid);
    this.onDisposed.reset();
  }

  /** {@link Createable.create} */
  async create(world: World) {
    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);

    const intersects = await caster.castRay();
    if (intersects) {
      return this.createPlaneFromIntersection(world, intersects);
    }
    return null;
  }

  /**
   * Creates a plane in a certain place and with a certain orientation,
   * without the need of the mouse.
   *
   * @param world - the world where this plane should be created.
   * @param normal - the orientation of the clipping plane.
   * @param point - the position of the clipping plane.
   * navigation.
   */
  createFromNormalAndCoplanarPoint(
    world: World,
    normal: THREE.Vector3,
    point: THREE.Vector3,
  ) {
    const id = this.newPlane(world, point, normal);
    this.updateMaterialsAndPlanes();
    return id;
  }

  /**
   * {@link Createable.delete}
   *
   * @param world - the world where the plane to delete is.
   * @param planeId - the plane to delete. If undefined, the first plane
   * found under the cursor will be deleted.
   */
  async delete(world: World, planeId?: string) {
    if (!planeId) {
      const plane = await this.pickPlane(world);
      if (!plane) return;
      planeId = this.list.getKey(plane);
    }
    if (!planeId) {
      return;
    }
    this.list.delete(planeId);
  }

  /**
   * Deletes all the existing clipping planes.
   *
   * @param types - the types of planes to be deleted. If not provided, all planes will be deleted.
   */
  deleteAll(types?: Set<string>) {
    for (const [id, plane] of this.list) {
      if (!types || types.has(plane.type)) {
        this.list.delete(id);
      }
    }
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<ClipperConfig>) {
    const fullConfig = { ...this._defaultConfig, ...config };

    this.config.color = fullConfig.color;
    this.config.opacity = fullConfig.opacity;
    this.config.size = fullConfig.size;

    this.isSetup = true;
    this.onSetup.trigger();
  }

  // private deletePlane(plane: SimplePlane) {
  //   const index = this.list.indexOf(plane);
  //   if (index !== -1) {
  //     this.list.splice(index, 1);
  //     if (!plane.world.renderer) {
  //       throw new Error("Renderer not found for this plane's world!");
  //     }
  //     plane.world.renderer.setPlane(false, plane.three);
  //     plane.dispose();
  //     this.updateMaterialsAndPlanes();
  //     this.onAfterDelete.trigger(plane);
  //   }
  // }

  private pickPlane(world: World): SimplePlane | undefined {
    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);
    const items = this.getAllPlaneMeshes();
    const intersects = caster.castRayToObjects(items);
    if (intersects) {
      const found = intersects.object as THREE.Mesh;
      return [...this.list.values()].find((p) => p.meshes.includes(found));
    }
    return undefined;
  }

  private getAllPlaneMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const [_, plane] of this.list) {
      meshes.push(...plane.meshes);
    }
    return meshes;
  }

  private createPlaneFromIntersection(
    world: World,
    intersect: THREE.Intersection,
  ) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }
    const constant = intersect.point.distanceTo(new THREE.Vector3(0, 0, 0));
    const normal = intersect.normal || intersect.face?.normal;
    if (!constant || !normal) {
      return null;
    }
    const worldNormal = this.getWorldNormal(intersect, normal);
    const id = this.newPlane(world, intersect.point, worldNormal.negate());
    const plane = this.list.get(id)!;
    plane.visible = this._visible;
    plane.size = this._size;
    world.renderer.setPlane(true, plane.three, this.localClippingPlanes);
    this.updateMaterialsAndPlanes();
    return plane;
  }

  private getWorldNormal(intersect: THREE.Intersection, normal: THREE.Vector3) {
    const object = intersect.object;
    let transform = intersect.object.matrixWorld.clone();
    const isInstance = object instanceof THREE.InstancedMesh;
    if (isInstance && intersect.instanceId !== undefined) {
      const temp = new THREE.Matrix4();
      object.getMatrixAt(intersect.instanceId, temp);
      transform = temp.multiply(transform);
    }
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(transform);
    const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    this.normalizePlaneDirectionY(worldNormal);
    return worldNormal;
  }

  private normalizePlaneDirectionY(normal: THREE.Vector3) {
    if (this.orthogonalY) {
      if (normal.y > this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = 1;
        normal.z = 0;
      }
      if (normal.y < -this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = -1;
        normal.z = 0;
      }
    }
  }

  private newPlane(world: World, point: THREE.Vector3, normal: THREE.Vector3) {
    const plane = new this.Type(
      this.components,
      world,
      point,
      normal,
      this._material,
    );
    plane.autoScale = this.autoScalePlanes;
    plane.onDraggingStarted.add(() => this.onBeforeDrag.trigger(plane));
    plane.onDraggingEnded.add(() => this.onAfterDrag.trigger(plane));
    const id = UUID.create();
    this.list.set(id, plane);
    this.onAfterCreate.trigger(plane);
    return id;
  }

  private updateMaterialsAndPlanes() {
    const worlds = this.components.get(Worlds);
    for (const [_id, world] of worlds.list) {
      if (!world.renderer) {
        continue;
      }
      world.renderer.updateClippingPlanes();
      const { clippingPlanes } = world.renderer;
      for (const model of world.meshes) {
        if (!model.material) {
          continue;
        }
        if (Array.isArray(model.material)) {
          for (const mat of model.material) {
            mat.clippingPlanes = clippingPlanes;
          }
        } else {
          model.material.clippingPlanes = clippingPlanes;
        }
      }
    }
  }

}
