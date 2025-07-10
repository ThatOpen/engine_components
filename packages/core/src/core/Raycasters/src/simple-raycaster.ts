import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../Components";
import { Component, Event, World, Disposable } from "../../Types";
import { Mouse } from "./mouse";
import { FragmentsManager } from "../../../fragments";

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
      fragResult = await fragments.raycast({
        camera,
        dom,
        mouse,
        snappingClasses,
      });
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

  // /**
  //  * Casts a ray from a given origin in a given direction and returns the first item found.
  //  * This method also takes into account the clipping planes used by the renderer.
  //  *
  //  * @param origin - The origin of the ray.
  //  * @param direction - The direction of the ray.
  //  * @param items - The meshes to query. If not provided, it will query all the meshes stored in {@link World.meshes}.
  //  * @returns The first intersection found or `null` if no intersection was found.
  //  */
  // castRayFromVector(
  //   origin: THREE.Vector3,
  //   direction: THREE.Vector3,
  //   items = Array.from(this.world.meshes),
  // ) {
  //   // TODO: Implement for fragmentsmodel
  //   this.three.set(origin, direction);
  //   return this.intersect(items);
  // }

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
