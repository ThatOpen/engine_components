import * as THREE from "three";
import { DataMap } from "@thatopen/fragments";
import { Component, World } from "../Types";
import { CreateViewConfig, CreateViewFromIfcStoreysConfig, View } from "./src";
import { BoundingBoxer, FragmentsManager } from "../../fragments";
import { Components } from "../Components";

/**
 * The `Views` class is responsible for managing and interacting with a collection of 2D sections. It provides methods for creating, opening, closing, and managing views, as well as generating views from specific configurations such as IFC storeys or bounding boxes. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Views). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Views).
 */
export class Views extends Component {
  static uuid = "fb22f1f5-6598-4664-a11d-de8963ae420f" as const;

  /**
   * The default range value used by the Views component.
   * This represents the standard range setting applied unless explicitly overridden.
   */
  static defaultRange = 15;

  /**
   * A readonly map that associates string keys with `View` instances.
   * This map is used to store and manage a collection of views.
   */
  readonly list = new DataMap<string, View>();

  enabled = true;

  /**
   * The default world to be used when creating views.
   *
   * - If `world` is set to `null`, views can still specify another world directly in their instance.
   * - This property allows views to inherit a default world context unless explicitly overridden.
   */
  world: World | null = null;

  private _fragmentsUpdateEvent = () => {
    const fragments = this.components.get(FragmentsManager);
    fragments.core.update(true);
  };

  /**
   * When true, opening a view snapshots the active camera's controls state
   * (via `controls.toJSON()`) and closing the view restores that snapshot
   * (via `controls.fromJSON(json, true)`), so exiting a view returns the
   * camera to the same pose the user had before entering it. Default true.
   *
   * Set to `false` to keep the legacy behavior, where the default camera
   * lands at whatever pose its controls drifted to during the view session.
   */
  restoreCameraOnClose = true;

  // Snapshot of the active camera's pose right before the most recent
  // `default → view` transition. Cleared on close. Stays a single field
  // (not a stack) because Views enforces "one open view per world": a
  // view-to-view switch is internally a close + open, which consumes the
  // snapshot then re-captures the (now default) one.
  private _restoreState: {
    camera: import("../Types").BaseCamera;
    json: string;
  } | null = null;

  /**
   * Determines whether there are any open views in this component's list.
   */
  get hasOpenViews() {
    return [...this.list.values()].some((v) => v.open);
  }

  constructor(components: Components) {
    super(components);
    components.add(Views.uuid, this);
    this.setupEvents();
  }

  private setupEvents() {
    this.list.onBeforeDelete.add(({ key, value: view }) => {
      if (view.open) this.close(key);
      view.dispose();
    });
  }

  /**
   * Creates a new view with the specified normal vector, point, and optional configuration.
   *
   * @param normal - The normal vector defining the orientation of the view.
   * @param point - The point in space where the view is centered.
   * @param config - Optional configuration for the view creation.
   * @returns The newly created `View` instance.
   * @remarks The created view will be added to the component's list data map.
   */
  create(
    normal: THREE.Vector3,
    point: THREE.Vector3,
    config?: CreateViewConfig,
  ) {
    const view = new View(this.components, { id: config?.id, normal, point });
    view.world = config?.world ?? this.world;
    this.list.set(view.id, view);
    return view;
  }

  /**
   * Creates a new view from the specified plane and optional configuration.
   *
   * @param plane - The `THREE.Plane` object representing the plane to create the view from.
   * @param config - Optional configuration for creating the view.
   * @returns The newly created `View` instance.
   * @remarks The created view will be added to the component's list data map.
   */
  createFromPlane(plane: THREE.Plane, config?: CreateViewConfig) {
    const view = new View(this.components, { id: config?.id });
    view.plane.copy(plane);
    view.update();
    view.world = config?.world ?? this.world;
    this.list.set(view.id, view);
    return view;
  }

  /**
   * Creates views from IFC storeys based on the provided configuration.
   * This method iterates through the fragments of the model, filters storeys
   * based on the configuration, and generates views for each storey.
   *
   * @param config - Optional configuration for creating views from IFC storeys.
   * @returns A promise that resolves to an array of `View` objects created from the IFC storeys.
   *
   * @remarks Each IfcBuilsingStorey is represented as a plane in 3D space, with its elevation adjusted by the `offset`. The created views will be added to the component's list data map.
   */
  async createFromIfcStoreys(config?: CreateViewFromIfcStoreysConfig) {
    const result: View[] = [];

    const fragments = this.components.get(FragmentsManager);
    const offset = config?.offset === undefined ? 0.25 : config.offset;

    for (const [modelId, model] of fragments.list) {
      if (
        config &&
        config.modelIds &&
        !config.modelIds.some((regex) => regex.test(modelId))
      ) {
        continue;
      }

      const storeys = Object.values(
        await model.getItemsOfCategories([/BUILDINGSTOREY/]),
      ).flat();

      if (storeys.length === 0) continue;

      const storeysData = await model.getItemsData(storeys);
      const [, coordHeight] = await model.getCoordinates();
      const normal = new THREE.Vector3(0, -1, 0);

      for (const storey of storeysData) {
        if (!("value" in storey.Name && "value" in storey.Elevation)) {
          continue;
        }
        const { value: name } = storey.Name;
        if (
          config?.storeyNames &&
          !config.storeyNames.some((value) => value.test(name))
        ) {
          continue;
        }
        const height = storey.Elevation.value + coordHeight + offset;
        const plane = new THREE.Plane(normal, height);
        const view = this.createFromPlane(plane, {
          id: name,
          world: config?.world,
        });

        result.push(view);
      }
    }

    return result;
  }

  /**
   * Creates views representing the front, back, left, and right sides of bounding boxes for specified models or a combined bounding box of all models.
   *
   * @param config - Optional configuration object for creating bounding views.
   * @returns A promise that resolves to an array of `View` objects created from the boundings.
   * @remarks The method calculates bounding boxes for the specified models, optionally combines them into a single bounding box, and creates views for the planes representing the bounding box sides.
   */
  createElevations(config?: {
    combine?: boolean; // if true, a single bounding box will be created from all models, if false each model will be threated separately. defaults to false
    modelIds?: RegExp[];
    world?: World;
    namingCallback?: (modelId: string) => {
      front: string;
      back: string;
      left: string;
      right: string;
    };
  }) {
    const result: View[] = [];

    const fragments = this.components.get(FragmentsManager);
    const combine = config?.combine === undefined ? false : config.combine;
    const namingFunction =
      config?.namingCallback ??
      ((modelId) => {
        return {
          front: `${combine ? "Front" : `${modelId}: Front`}`,
          back: `${combine ? "Back" : `${modelId}: Back`}`,
          left: `${combine ? "Left" : `${modelId}: Left`}`,
          right: `${combine ? "Right" : `${modelId}: Right`}`,
        };
      });

    let boxes: { id: string; box: THREE.Box3 }[] = [];

    for (const [id, model] of fragments.list) {
      if (
        config &&
        config.modelIds &&
        !config.modelIds.some((regex) => regex.test(id))
      ) {
        continue;
      }
      boxes.push({ id, box: model.box });
    }

    if (boxes.length === 0) return result;

    if (combine) {
      const boxer = this.components.get(BoundingBoxer);
      boxer.list.clear();
      boxer.list.add(...boxes.map((data) => data.box));
      const box = boxer.get();
      boxes = [{ id: "combined", box }];
    }

    for (const { id: modelId, box } of boxes) {
      const { min, max } = box;

      const xLength = Math.abs(max.x - min.x);
      const zLength = Math.abs(max.z - min.z);

      const center = new THREE.Vector3();
      box.getCenter(center);

      const frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), max.z);
      const backPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -min.z);
      const leftPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), max.x);
      const rightPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -min.x);

      const {
        front: frontName,
        back: backName,
        left: leftName,
        right: rightName,
      } = namingFunction(modelId);

      const frontView = this.createFromPlane(frontPlane, {
        id: frontName,
        world: config?.world,
      });

      frontView.range = zLength;

      const backView = this.createFromPlane(backPlane, {
        id: backName,
        world: config?.world,
      });

      backView.range = zLength;

      const leftView = this.createFromPlane(leftPlane, {
        id: leftName,
        world: config?.world,
      });

      leftView.range = xLength;

      const rightView = this.createFromPlane(rightPlane, {
        id: rightName,
        world: config?.world,
      });

      rightView.range = xLength;

      result.push(frontView, backView, leftView, rightView);
    }

    return result;
  }

  /**
   * Opens a view by its unique identifier. Ensures that no more than one view
   * is opened in the same world at a time. If the view is already open, the method
   * returns without performing any action.
   *
   * @param id - The unique identifier of the view to open.
   * @remarks This method changes world camera to use the view's.
   */
  open(id: string) {
    const view = this.list.get(id);
    if (!view) {
      throw new Error(`Views: the view with id ${id} doesn't exist.`);
    }

    if (view.open) return;

    const { world } = view;
    if (!world) {
      throw new Error(`Views: no world found for view with id ${id}.`);
    }

    const { renderer } = world;
    if (!renderer) {
      throw new Error(
        `Views: no renderer found for world with id ${world.uuid}.`,
      );
    }

    // Ensure no more than one view is opened in the same
    // world at the time
    for (const [, existingView] of this.list) {
      if (existingView.world !== world) continue;
      this.close(existingView.id);
    }

    // Snapshot the active camera before swapping. Guarded so a view-to-view
    // transition (close-then-open under the hood) doesn't overwrite the
    // pre-default snapshot with the freshly-restored one.
    if (
      this.restoreCameraOnClose &&
      world.camera !== view.camera &&
      !this._restoreState &&
      world.camera.controls
    ) {
      this._restoreState = {
        camera: world.camera,
        json: world.camera.controls.toJSON(),
      };
    }

    renderer.setPlane(true, view.plane);
    renderer.setPlane(true, view.farPlane);

    // Each camera in the world owns its own CameraControls instance bound
    // to the renderer's DOM element. They all receive input events in
    // parallel, so without disabling the inactive ones they keep updating
    // their cameras while the user is driving the active view. This is the
    // root cause of "moving in section also moves the floor plan camera".
    // We toggle controls.enabled so only the active camera responds.
    this.setOnlyEnabledControls(world, view);

    view.camera.controls.addEventListener("rest", this._fragmentsUpdateEvent);
    world.camera = view.camera;
    view.open = true;
  }

  /**
   * Closes a view by its unique identifier and performs necessary cleanup operations.
   *
   * @param id - The unique identifier of the view to be closed. If not provided, all opened views across worlds will be closed.
   * @remarks This method resets the world to use its default camera.
   */
  close(id?: string) {
    let view: View | undefined;
    if (id) {
      view = this.list.get(id);
    } else {
      view = [...this.list.values()].find((v) => v.open);
    }

    if (id && !view) {
      throw new Error(`Views: the view with id ${id} doesn't exist.`);
    }

    if (!view) return;

    if (!view.open) return;

    const { world } = view;
    if (!world) {
      throw new Error(`Views: no world found for view with id ${id}.`);
    }

    const { renderer } = world;
    if (!renderer) {
      throw new Error(
        `Views: no renderer found for world with id ${world.uuid}.`,
      );
    }

    renderer.setPlane(false, view.plane);
    renderer.setPlane(false, view.farPlane);

    view.camera.controls.removeEventListener(
      "rest",
      this._fragmentsUpdateEvent,
    );

    world.useDefaultCamera();
    view.open = false;

    // Re-enable only the now-active camera's controls (the default), and
    // disable every view camera so navigation in subsequent view sessions
    // doesn't bleed into the closed view's pose.
    this.setOnlyEnabledControls(world, null);

    // Restore the camera pose captured at open() time. Smooth-transitioned
    // (true) so the user sees the camera glide back to where it was, rather
    // than a hard cut.
    if (this.restoreCameraOnClose && this._restoreState) {
      const { camera, json } = this._restoreState;
      if (camera === world.camera && camera.controls) {
        // false = no smooth transition. Instant snap to the saved pose.
        camera.controls.fromJSON(json, false);
      }
      this._restoreState = null;
    }
  }

  /**
   * Routes input to a single camera by toggling `controls.enabled`. Every
   * camera in the world owns its own CameraControls instance bound to the
   * renderer's DOM element; without this, all of them would react to the
   * same wheel/pointer events in parallel, so navigating one view would
   * drift every other camera at the same time.
   */
  private setOnlyEnabledControls(world: World, activeView: View | null) {
    const activeCamera = activeView ? activeView.camera : world.defaultCamera;
    const enable = (cam: import("../Types").BaseCamera, on: boolean) => {
      if (cam.controls) cam.controls.enabled = on;
    };
    enable(activeCamera, true);
    if (activeCamera !== world.defaultCamera) {
      enable(world.defaultCamera, false);
    }
    for (const [, otherView] of this.list) {
      if (otherView.world !== world) continue;
      if (otherView.camera === activeCamera) continue;
      enable(otherView.camera, false);
    }
  }
}

export * from "./src";
