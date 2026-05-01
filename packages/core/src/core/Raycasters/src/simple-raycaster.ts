import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../Components";
import { Component, Event, World, Disposable } from "../../Types";
import { Mouse } from "./mouse";
import { FragmentsManager } from "../../../fragments";
import { FastModelPickers } from "../../FastModelPicker";

/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster) that allows to easily get items from the scene using the mouse and touch events.
 */
export class SimpleRaycaster implements Disposable {
  /** {@link Component.enabled} */
  enabled = true;

  /** The components instance to which this Raycaster belongs. */
  components: Components;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** The position of the mouse in the screen. */
  readonly mouse: Mouse;

  /**
   * A reference to the Three.js Raycaster instance.
   * This is used for raycasting operations.
   */
  readonly three = new THREE.Raycaster();

  /**
   * A reference to the world instance to which this Raycaster belongs.
   * This is used to access the camera and meshes.
   */
  world: World;

  /**
   * Whether to use fast model picking to optimize raycasting.
   * When enabled, the raycaster will first use FastModelPicker to identify
   * which model is under the mouse, then only raycast that specific model.
   * This can significantly improve performance when there are many models.
   */
  useFastModelPicking = false;

  /**
   * Whether to resolve picks entirely on the GPU when no extra data is
   * needed. When enabled and the call has no `snappingClasses` and no
   * extra `items` to intersect, `castRay` returns directly from the
   * GPU-readback {@link FastModelPicker}'s `getItemAt` — one render pass
   * plus one 4-byte readback, no worker round-trip.
   *
   * Trade-off: the synthesised result only carries `localId` and the
   * model reference (matching what fragments raycast returns at minimum).
   * Fields like `point`, `normal`, `distance`, snap candidates etc. are
   * **not** populated. Tools that need any of those should leave this
   * flag off.
   *
   * Snap-aware calls (`snappingClasses` non-empty) and calls that pass
   * `items` to intersect always fall through to the existing worker
   * path, regardless of this flag.
   */
  useFastItemPicking = false;

  constructor(components: Components, world: World) {
    const renderer = world.renderer;
    if (!renderer) {
      throw new Error("A renderer is needed for the raycaster to work!");
    }
    this.world = world;
    this.mouse = new Mouse(renderer.three.domElement);
    this.components = components;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.mouse.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  castRayToObjects(
    items: THREE.Object3D[] = Array.from(this.world.meshes),
    position = this.mouse.position,
  ): THREE.Intersection | null {
    if (!this.world) {
      throw new Error("A world is needed to cast rays!");
    }

    const camera = this.world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;

    this.three.setFromCamera(position, camera);
    return this.intersect(items);
  }

  /**
   * Throws a ray from the camera to the mouse or touch event point and returns
   * the first item found. This also takes into account the clipping planes
   * used by the renderer.
   *
   * @param items - the [meshes](https://threejs.org/docs/#api/en/objects/Mesh)
   * to query. If not provided, it will query all the meshes stored in
   * {@link Components.meshes}.
   * @param position - the screen position to use for raycasting. If not provided,
   * the last pointer (mouse/touch) position will be used.
   */
  async castRay(data?: {
    snappingClasses?: FRAGS.SnappingClass[];
    items?: THREE.Object3D[];
    position?: THREE.Vector2;
  }): Promise<THREE.Intersection | null> {
    const snappingClasses = data?.snappingClasses;
    const items = data?.items ?? Array.from(this.world.meshes);
    const position = data?.position ?? this.mouse.position;

    if (!this.world) {
      throw new Error("A world is needed to cast rays!");
    }
    const camera = this.world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;

    // Raycast the BIM models
    const fragments = this.components.get(FragmentsManager);
    const dom = this.world.renderer!.three.domElement;
    const mouse = this.mouse.rawPosition;
    let fragResult: any = null;

    if (fragments.initialized) {
      // Fastest path: GPU-readback item pick. No worker call. Limited
      // to the `localId` + model — see `useFastItemPicking`'s docs.
      // Skipped when the caller asks for snapping (the pick can't
      // produce snap candidates) or supplies its own `items` (those
      // need a full ray test, which only the worker path runs).
      const hasSnap = !!(snappingClasses && snappingClasses.length > 0);
      const hasItems = items.length > 0;
      if (this.useFastItemPicking && !hasSnap && !hasItems) {
        const fastPickers = this.components.get(FastModelPickers);
        const fastPicker = fastPickers.get(this.world);
        const hit = await fastPicker.getItemAt(position);
        if (hit) {
          const model = fragments.list.get(hit.modelId);
          // Match the shape consumers expect: fragments raycast
          // returns the model in `fragments`. We attach it here so
          // existing code paths (`result.fragments.modelId`,
          // `result.localId`) keep working unchanged.
          fragResult = {
            localId: hit.localId,
            fragments: model,
          };
        }
        return fragResult;
      }
      // Use fast model picking if enabled
      if (this.useFastModelPicking) {
        const fastPickers = this.components.get(FastModelPickers);
        const fastPicker = fastPickers.get(this.world);
        const modelId = await fastPicker.getModelAt(position);

        if (modelId) {
          // Only raycast the specific model identified by fast picking
          const model = fragments.list.get(modelId);
          if (model) {
            if (snappingClasses && snappingClasses.length > 0) {
              const snappingRaycast = await model.raycastWithSnapping({
                camera,
                dom,
                mouse,
                snappingClasses,
              } as FRAGS.SnappingRaycastData);
              if (snappingRaycast && snappingRaycast.length > 0) {
                fragResult = snappingRaycast[0];
              } else {
                fragResult = await model.raycast({
                  camera,
                  dom,
                  mouse,
                });
              }
            } else {
              fragResult = await model.raycast({
                camera,
                dom,
                mouse,
              });
            }
          }
        }
        // If fast picking didn't find a model, fragResult remains null
      } else {
        // Original behavior: raycast all models
        fragResult = await fragments.raycast({
          camera,
          dom,
          mouse,
          snappingClasses,
        });
      }
      if (items.length === 0) {
        return fragResult;
      }
    }

    // Raycast the items

    this.three.setFromCamera(position, camera);
    const itemsResult = this.intersect(items);
    if (!fragResult) {
      return itemsResult;
    }
    if (!itemsResult) {
      return fragResult;
    }
    if (itemsResult.distance < fragResult.distance) {
      return itemsResult;
    }
    return fragResult;
  }

  /**
   * Casts a ray from a given origin in a given direction and returns the first item found.
   * This method also takes into account the clipping planes used by the renderer.
   *
   * @param origin - The origin of the ray.
   * @param direction - The direction of the ray.
   * @param items - The meshes to query. If not provided, it will query all the meshes stored in {@link World.meshes}.
   * @returns The first intersection found or `null` if no intersection was found.
   */
  castRayFromVector(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    items = Array.from(this.world.meshes),
  ) {
    // TODO: Implement for fragmentsmodel
    this.three.set(origin, direction);
    return this.intersect(items);
  }

  private intersect(items: THREE.Object3D[] = Array.from(this.world.meshes)) {
    const result = this.three.intersectObjects(items);
    const filtered = this.filterClippingPlanes(result);
    return filtered.length > 0 ? filtered[0] : null;
  }

  private filterClippingPlanes(objs: THREE.Intersection[]) {
    if (!this.world.renderer) {
      throw new Error("Renderer not found!");
    }
    const renderer = this.world.renderer.three;
    if (!renderer.clippingPlanes) {
      return objs;
    }
    const planes = renderer.clippingPlanes;
    if (objs.length <= 0 || !planes || planes?.length <= 0) return objs;
    return objs.filter((elem) =>
      planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0),
    );
  }
}
