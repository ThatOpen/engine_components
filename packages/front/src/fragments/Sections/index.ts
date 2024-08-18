import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EdgesPlane } from "../../core";

/** The data that describes a section view. */
export interface Section {
  /** The human-readable name of this floor plan (e.g. "First floor"). */
  name: string;

  /** The unique identifier for this Section plan (e.g. "0w984V0GL6yR4z75YWgVfX"). */
  id: string;

  /** The clipping plane object that cuts the model. */
  plane: EdgesPlane;

  /** The offset of the camera to the clipping plane. */
  offset: number;

  /** The cached camera data of the view when the user exited it. */
  cached: {
    position: THREE.Vector3;
    target: THREE.Vector3;
    zoom: number;
    size: number;
  };
}

/**
 * A component to create and manage arbitrary sections for BIM models.
 */
export class Sections extends OBC.Component implements OBC.Disposable {
  enabled = false;

  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "45b41ba3-7bb8-4e08-909f-e0fa87973965" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** Event that fires after navigating to ta section. */
  readonly onNavigated = new OBC.Event<{ id: string }>();

  /** Event that fires after exiting the section navigation mode. */
  readonly onExited = new OBC.Event<void>();

  /** The plane type for the clipping planes created by this component. */
  readonly planeType = "section";

  /** The default offset of the camera to the clipping plane. */
  offset = 100;

  /** All the created sections. */
  list = new Map<string, Section>();

  /** The current world where the sections are being created. */
  world?: OBC.World;

  /** The current section that is being navigated. */
  current: Section | null = null;

  private cached3DCamera = {
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
    projection: "Perspective" as OBC.CameraProjection,
    zoom: 1,
    top: 10,
    bottom: -10,
    right: 10,
    left: -10,
  };

  /**
   * Generates a section with the given data.
   * @param data - The required data to create a section.
   * @param data.id - The unique identifier of the section.
   * @param data.name - The human-readable name of the section.
   * @param data.point - The 3D point where the section plane lies.
   * @param data.normal - The unit vector that describes the orientation of the clipping plane.
   * @param data.type - The type to apply to the created clipping plane.
   * @param data.offset - The offset of the camera to the section.
   */
  create(data: {
    id: string;
    name?: string;
    point: THREE.Vector3;
    normal: THREE.Vector3;
    type?: string;
    offset?: number;
  }) {
    const world = this.getWorld();

    const { id, point, normal, type } = data;
    let { name, offset } = data;

    const clipper = this.components.get(OBC.Clipper);

    const previousType = clipper.Type;
    clipper.Type = EdgesPlane;

    const plane = clipper.createFromNormalAndCoplanarPoint(
      world,
      normal,
      point,
    ) as EdgesPlane;

    plane.visible = false;
    plane.edges.visible = false;
    plane.enabled = false;

    name = name || id;
    offset = offset || this.offset;
    plane.type = type || this.planeType;
    plane.updateFill();

    const position = normal.clone().multiplyScalar(-offset).add(point);
    const target = point.clone();
    const zoom = 1;
    const size = 10;

    const cached = { position, target, zoom, size };

    const section: Section = { id, name, plane, offset, cached };
    this.list.set(id, section);

    clipper.Type = previousType;

    return section;
  }

  /**
   * Deletes the section with the given ID.
   * @param id - The identifier whose section to delete.
   */
  delete(id: string) {
    const found = this.list.get(id);
    if (!found) {
      return;
    }
    found.plane.dispose();
    this.list.delete(id);
  }

  /**
   * Goes to the section with the given ID.
   * @param id - The identifier whose section to delete.
   * @param animate - Whether to animate the transition.
   */
  async goTo(id: string, animate = false) {
    const camera = this.getCamera();

    if (this.current?.id === id) {
      return;
    }

    const found = this.list.get(id);

    if (!found) {
      throw new Error(`There's no section with the ID: ${id}.`);
    }

    this.cacheCameraPosition();

    await this.hidePreviousClippingPlane();

    await camera.projection.set("Orthographic");

    this.current = found;

    const t = new THREE.Vector3();
    const p = new THREE.Vector3();

    const { cached } = found;
    const { position, target } = cached;
    t.copy(target);
    p.copy(position);

    await camera.controls.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, animate);

    const size = found.cached.size;
    const aspect = camera.threePersp.aspect;

    camera.threeOrtho.top = size;
    camera.threeOrtho.bottom = -size;
    camera.threeOrtho.left = -size * aspect;
    camera.threeOrtho.right = size * aspect;

    camera.threeOrtho.updateProjectionMatrix();
    await camera.controls.zoomTo(cached.zoom, false);

    camera.set("Plan");

    if (this.current.plane) {
      this.current.plane.enabled = true;
      this.current.plane.edges.fillNeedsUpdate = true;
      this.current.plane.edges.visible = true;
    }

    this.enabled = true;

    this.onNavigated.trigger({ id });
  }

  /**
   * Exits the section view mode.
   * @param animate - Whether to animate the transition.
   */
  async exit(animate = false) {
    if (!this.enabled || !this.world) {
      return;
    }

    this.cacheCameraPosition();

    const camera = this.getCamera();
    camera.set("Orbit");

    const { position, target, projection } = this.cached3DCamera;

    await camera.projection.set(projection);

    if (this.current) {
      this.current.plane.enabled = false;
      this.current.plane.edges.enabled = false;
      this.current.plane.edges.visible = false;
    }
    this.current = null;

    const { x: px, y: py, z: pz } = position;
    const { x: tx, y: ty, z: tz } = target;
    await camera.controls.setLookAt(px, py, pz, tx, ty, tz, animate);

    if (camera.projection.current === "Orthographic") {
      await camera.controls.zoomTo(this.cached3DCamera.zoom, false);
      camera.threeOrtho.left = this.cached3DCamera.left;
      camera.threeOrtho.right = this.cached3DCamera.right;
      camera.threeOrtho.top = this.cached3DCamera.top;
      camera.threeOrtho.bottom = this.cached3DCamera.bottom;
    }

    this.enabled = false;

    this.onExited.trigger();
  }

  /** {@link OBC.Disposable.onDisposed} */
  dispose() {
    for (const [, { plane }] of this.list) {
      plane.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private getWorld() {
    if (!this.world) {
      throw new Error("World is needed to create sections!");
    }
    return this.world;
  }

  private getCamera() {
    const world = this.getWorld();
    const camera = world.camera as OBC.OrthoPerspectiveCamera;
    if (!camera.hasCameraControls() || !camera.projection) {
      throw new Error(
        "The world given to sections must have an OrthoPerspective camera.",
      );
    }
    return camera;
  }

  private cacheCameraPosition() {
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }
    const camera = this.getCamera();

    if (this.enabled) {
      // We are in section view
      if (!this.current) {
        throw new Error("Current section not found!");
      }
      const { cached } = this.current;
      const { position, target } = cached;
      camera.controls.getPosition(position);
      camera.controls.getTarget(target);
      cached.zoom = camera.threeOrtho.zoom;
      cached.size = camera.threeOrtho.top;
    } else {
      // We are in a 3D view
      camera.three.getWorldPosition(this.cached3DCamera.position);
      camera.controls.getTarget(this.cached3DCamera.target);
      this.cached3DCamera.projection = camera.projection.current;
      this.cached3DCamera.zoom = camera.threeOrtho.zoom;
      const { top, bottom, left, right } = camera.threeOrtho;
      this.cached3DCamera.top = top;
      this.cached3DCamera.bottom = bottom;
      this.cached3DCamera.left = left;
      this.cached3DCamera.right = right;
    }
  }

  private async hidePreviousClippingPlane() {
    if (this.current) {
      const plane = this.current.plane;
      if (plane) {
        plane.enabled = false;
      }
      this.current.plane.edges.visible = false;
    }
  }
}
