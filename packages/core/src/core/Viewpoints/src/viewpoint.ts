/* eslint-disable camelcase */
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { UUID } from "../../../utils";
import {
  ViewpointVector,
  BCFViewpoint,
  ViewpointCamera,
  ViewpointOrthogonalCamera,
  ViewpointPerspectiveCamera,
} from "./types";
import {
  CameraProjection,
  OrthoPerspectiveCamera,
} from "../../OrthoPerspectiveCamera";
import { Components } from "../../Components";
import { World } from "../../Types";
import { FragmentsManager } from "../../../fragments/FragmentsManager";
import { BCFTopics } from "../../../openbim/BCFTopics";
import { Clipper } from "../../Clipper";
import { Viewpoints } from "..";
import { Hider } from "../../../fragments";

/**
 * Represents a BCF compliant viewpoint from BuildingSMART. The Viewpoint class provides methods for managing and interacting with viewpoints. It includes functionality for setting viewpoint properties, updating the camera, applying color to components, and serializing the viewpoint for export.
 */
export class Viewpoint {
  title?: string;
  readonly guid = UUID.create();

  /**
   * ClippingPlanes can be used to define a subsection of a building model that is related to the topic.
   * Each clipping plane is defined by Location and Direction.
   * The Direction vector points in the invisible direction meaning the half-space that is clipped.
   */
  readonly clippingPlanes = new FRAGS.DataSet<string>();

  camera: ViewpointPerspectiveCamera | ViewpointOrthogonalCamera = {
    aspect_ratio: 1,
    field_of_view: 60,
    camera_direction: { x: 0, y: 0, z: 0 },
    camera_view_point: { x: 0, y: 0, z: 0 },
    camera_up_vector: { x: 0, y: 1, z: 0 },
  };

  /**
   * A list of components GUIDs to hide when defaultVisibility = true or to show when defaultVisibility = false
   */
  readonly exceptionComponents = new FRAGS.DataSet<string>();

  /**
   * A list of components GUIDs that should be selected (highlighted) when displaying a viewpoint.
   */
  readonly selectionComponents = new FRAGS.DataSet<string>(); // this is not directly a ModelIdMap because a viewpoint should be able to reference elements from models that are not loaded, usually from information comming externally

  /**
   * A map of colors and components GUIDs that should be colorized when displaying a viewpoint.
   * For this to work, call viewpoint.colorize()
   */
  readonly componentColors = new FRAGS.DataMap<string, string[]>();

  /**
   * Boolean flags to allow fine control over the visibility of spaces.
   * A typical use of these flags is when DefaultVisibility=true but spaces should remain hidden.
   * @default false
   */
  spacesVisible = false;

  /**
   * Boolean flags to allow fine control over the visibility of space boundaries.
   * A typical use of these flags is when DefaultVisibility=true but space boundaries should remain hidden.
   * @default false
   */
  spaceBoundariesVisible = false;

  /**
   * Boolean flags to allow fine control over the visibility of openings.
   * A typical use of these flags is when DefaultVisibility=true but openings should remain hidden.
   * @default false
   */
  openingsVisible = false;

  /**
   * When true, all components should be visible unless listed in the exceptions
   * When false all components should be invisible unless listed in the exceptions
   */
  defaultVisibility = true;

  /**
   * The snapshotID that will be used for this viewpoint when exported.
   */
  snapshot = this.guid;

  async getSelectionMap() {
    const fragments = this._components.get(FragmentsManager);
    const modelIdMap = await fragments.guidsToModelIdMap([
      ...this.selectionComponents,
    ]);
    return modelIdMap;
  }

  async getExceptionMap() {
    const fragments = this._components.get(FragmentsManager);
    const modelIdMap = await fragments.guidsToModelIdMap([
      ...this.exceptionComponents,
    ]);
    return modelIdMap;
  }

  /**
   * Retrieves the projection type of the viewpoint's camera.
   *
   * @returns A string representing the projection type of the viewpoint's camera.
   *          It can be either 'Perspective' or 'Orthographic'.
   */
  get projection(): CameraProjection {
    if ("field_of_view" in this.camera) return "Perspective";
    return "Orthographic";
  }

  /**
   * Retrieves the position vector of the viewpoint's camera.
   *
   * @returns A THREE.Vector3 representing the position of the viewpoint's camera.
   */
  get position() {
    const fragments = this._components.get(FragmentsManager);
    const { camera_view_point } = this.camera;
    const { x, y, z } = camera_view_point;
    const vector = new THREE.Vector3(x, y, z);
    fragments.applyBaseCoordinateSystem(vector, new THREE.Matrix4());
    return vector;
  }

  /**
   * Sets the position of the viewpoint's camera.
   * @param value - The new position for the viewpoint's camera.
   */
  set position(value: THREE.Vector3) {
    const position = value.clone();

    const fragments = this._components.get(FragmentsManager);
    value
      .clone()
      .applyMatrix4(fragments.baseCoordinationMatrix.clone().invert());

    this.camera.camera_view_point = {
      x: position.x,
      y: position.y,
      z: position.z,
    };
  }

  /**
   * Retrieves the direction vector of the viewpoint's camera.
   * @returns A THREE.Vector3 representing the direction of the viewpoint's camera.
   */
  get direction() {
    const { camera_direction } = this.camera;
    const { x, y, z } = camera_direction;
    const vector = new THREE.Vector3(x, y, z);
    return vector;
  }

  private _components: Components;

  private _world: World | null = null;

  /**
   * Represents the world in which the viewpoint will take effect.
   */
  set world(value: World | null) {
    this._world = value;
  }

  get world() {
    return this._world;
  }

  private get _managerVersion() {
    const manager = this._components.get(BCFTopics);
    return manager.config.version;
  }

  /**
   * Retrieves the list of BCF topics associated with the current viewpoint.
   *
   * @remarks
   * This function retrieves the BCFTopics manager from the components,
   * then filters the list of topics to find those associated with the current viewpoint.
   *
   * @returns An array of BCF topics associated with the current viewpoint.
   */
  get topics() {
    const manager = this._components.get(BCFTopics);
    const topicsList = [...manager.list.values()];
    const topics = topicsList.filter((topic) =>
      topic.viewpoints.has(this.guid),
    );
    return topics;
  }

  constructor(
    components: Components,
    data?: Partial<BCFViewpoint & { title: string }>,
  ) {
    this._components = components;
    if (data) {
      this.guid = data.guid ?? this.guid;
      this.set(data);
    }
    this.setEvents();
  }

  private notifyUpdate = () => {
    const manager = this._components.get(Viewpoints);
    manager.list.set(this.guid, this);
  };

  // TODO: Remove the notifyUpdate when needed
  private setEvents() {
    this.selectionComponents.onUpdated.add(this.notifyUpdate);
    this.exceptionComponents.onUpdated.add(this.notifyUpdate);
    this.clippingPlanes.onUpdated.add(this.notifyUpdate);
    this.componentColors.onItemSet.add(this.notifyUpdate);
    this.componentColors.onItemDeleted.add(this.notifyUpdate);
    this.componentColors.onItemUpdated.add(this.notifyUpdate);
    this.componentColors.onCleared.add(this.notifyUpdate);
  }

  /**
   * Fully replace the properties of the viewpoint with the provided data.
   * The properties not included will remain unchanged.
   *
   * @remarks The guid will be ommited as it shouldn't change after it has been initially set.
   *
   * @param data - An object containing the properties to be set.
   */
  set(data: Partial<BCFViewpoint>) {
    this.title = data.title;

    const {
      components,
      perspective_camera,
      orthogonal_camera,
      clipping_planes,
    } = data;

    if (components) {
      const { selection, visibility, coloring } = components;

      if (selection) {
        this.selectionComponents.clear();
        for (const { ifc_guid } of selection) {
          if (!ifc_guid) continue;
          this.selectionComponents.add(ifc_guid);
        }
      }

      if (visibility) {
        const { default_visibility, exceptions, view_setup_hints } = visibility;

        if (default_visibility !== undefined) {
          this.defaultVisibility = default_visibility;
        }

        if (exceptions) {
          this.exceptionComponents.clear();
          for (const { ifc_guid } of exceptions) {
            if (!ifc_guid) continue;
            this.exceptionComponents.add(ifc_guid);
          }
        }

        if (view_setup_hints) {
          const { spaces_visible, space_boundaries_visible, openings_visible } =
            view_setup_hints;

          if (spaces_visible !== undefined) {
            this.spacesVisible = spaces_visible;
          }

          if (space_boundaries_visible !== undefined) {
            this.spaceBoundariesVisible = space_boundaries_visible;
          }

          if (openings_visible !== undefined) {
            this.openingsVisible = openings_visible;
          }
        }
      }

      if (coloring) {
        this.componentColors.clear();
        for (const description of coloring) {
          const { color, components } = description;
          const guids = components
            .map((component) => component.ifc_guid)
            .filter((guid) => guid !== null) as string[];
          this.componentColors.set(color, guids);
        }
      }
    }

    if (perspective_camera || orthogonal_camera) {
      this.camera = perspective_camera ?? orthogonal_camera!;
    }

    if (clipping_planes && this.world) {
      const clipper = this._components.get(Clipper);
      for (const data of clipping_planes) {
        const { location, direction } = data;
        const locationVector = new THREE.Vector3(
          location.x,
          location.z,
          -location.y,
        );
        const directionVector = new THREE.Vector3(
          direction.x,
          direction.z,
          -direction.y,
        );
        const id = clipper.createFromNormalAndCoplanarPoint(
          this.world,
          directionVector,
          locationVector,
        );
        this.clippingPlanes.add(id);
        clipper.list.get(id)!.enabled = false;
        clipper.list.get(id)!.visible = false;
      }
    }

    this.notifyUpdate();
  }

  /**
   * Sets the viewpoint of the camera in the world.
   *
   * @remarks
   * This function calculates the target position based on the viewpoint information.
   * It sets the visibility of the viewpoint components and then applies the viewpoint using the camera's controls.
   *
   * @param transition - Indicates whether the camera movement should have a transition effect.
   *                      Default value is `true`.
   *
   * @throws An error if the world's camera does not have camera controls.
   *
   * @returns A Promise that resolves when the camera has been set.
   */
  async go(_config?: {
    transition?: boolean;
    applyClippings?: boolean;
    clippingsVisibility?: boolean;
    applyVisibility?: boolean;
  }) {
    if (!this.world) return;

    const { camera } = this.world;
    if (!(camera instanceof OrthoPerspectiveCamera)) {
      throw new Error(
        "Viewpoint: the world's camera component must be of type OrthoPerspectiveCamera to switch between perspective and orthographic projections.",
      );
    }

    const { transition, applyClippings, applyVisibility, clippingsVisibility } =
      {
        transition: true,
        applyClippings: true,
        applyVisibility: true,
        clippingsVisibility: true,
        ..._config,
      };

    camera.projection.set(this.projection);

    const basePosition = new THREE.Vector3(
      this.camera.camera_view_point.x,
      this.camera.camera_view_point.y,
      this.camera.camera_view_point.z,
    );

    const baseTarget = new THREE.Vector3(
      this.camera.camera_direction.x,
      this.camera.camera_direction.y,
      this.camera.camera_direction.z,
    );

    if (
      basePosition.equals(new THREE.Vector3()) &&
      baseTarget.equals(new THREE.Vector3())
    ) {
      return;
    }

    const position = this.position;
    const direction = this.direction;

    // Default target based on the viewpoint information
    const factor = 80;
    const target = {
      x: position.x + direction.x * factor,
      y: position.y + direction.y * factor,
      z: position.z + direction.z * factor,
    };

    const promises = [];

    if (applyClippings) this.setClippingState(true);
    if (applyVisibility) promises.push(this.applyVisibility());
    this.setClippingVisibility(clippingsVisibility);

    promises.push(
      camera.controls.setLookAt(
        position.x,
        position.y,
        position.z,
        target.x,
        target.y,
        target.z,
        transition,
      ),
    );

    await Promise.all(promises);
  }

  /**
   * Updates the camera settings of the viewpoint based on the current world's camera and renderer.
   * @returns A boolean indicating if the camera data was updated or not.
   */
  async updateCamera(takeSnapshot = true) {
    return new Promise<boolean>((resolve) => {
      if (!this.world) {
        resolve(false);
        return;
      }

      const { camera, renderer } = this.world;
      if (!renderer) {
        throw new Error("Viewpoint: the world needs to have a renderer!");
      }

      if (!camera.hasCameraControls()) {
        throw new Error("Viewpoint: world's camera need camera controls!");
      }

      const position = new THREE.Vector3();
      camera.controls.getPosition(position);

      const threeCamera = camera.three;

      const direction = new THREE.Vector3(0, 0, -1).applyEuler(
        threeCamera.rotation,
      );

      const { width, height } = renderer.getSize();
      let aspect_ratio = width / height;

      // If the renderer exists but there is no HTMLElement, then aspect will be 0 / 0. In that case, use 1 as a fallback.
      if (Number.isNaN(aspect_ratio)) aspect_ratio = 1;

      const fragments = this._components.get(FragmentsManager);
      position.applyMatrix4(fragments.baseCoordinationMatrix.clone().invert());

      const partialCamera: ViewpointCamera = {
        aspect_ratio,
        camera_view_point: { x: position.x, y: position.y, z: position.z },
        camera_direction: { x: direction.x, y: direction.y, z: direction.z },
        camera_up_vector: { x: 0, y: 1, z: 0 },
      };

      if (threeCamera instanceof THREE.PerspectiveCamera) {
        this.camera = {
          ...partialCamera,
          field_of_view: threeCamera.fov,
        };
      } else if (threeCamera instanceof THREE.OrthographicCamera) {
        this.camera = {
          ...partialCamera,
          view_to_world_scale: threeCamera.top - threeCamera.bottom,
        };
      }

      if (takeSnapshot) {
        const manager = this._components.get(Viewpoints);
        const canvas = renderer.three.domElement;
        renderer.three.render(this.world!.scene.three, camera.three);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const data = await blob.arrayBuffer();
            const buffer = new Uint8Array(data);
            manager.snapshots.set(this.guid, buffer);
          }
          this.notifyUpdate();
          resolve(true);
        });
      } else {
        this.notifyUpdate();
        resolve(true);
      }
    });
  }

  /**
   * Captures a snapshot of the current viewpoint and stores it in the snapshots manager.
   */
  takeSnapshot() {
    return new Promise<boolean>((resolve) => {
      if (!this.world) {
        resolve(false);
        return;
      }

      const { camera, renderer } = this.world;
      if (!renderer) {
        throw new Error("Viewpoint: the world needs to have a renderer!");
      }

      const manager = this._components.get(Viewpoints);
      const canvas = renderer.three.domElement;
      renderer.three.render(this.world!.scene.three, camera.three);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const data = await blob.arrayBuffer();
          const buffer = new Uint8Array(data);
          manager.snapshots.set(this.guid, buffer);
        }
        this.notifyUpdate();
        resolve(true);
      });
    });
  }

  /**
   * Updates the collection of clipping planes by clearing the current set and adding enabled planes
   * from the associated `Clipper` component.
   */
  updateClippingPlanes() {
    this.clippingPlanes.clear();
    const clipper = this._components.get(Clipper);
    for (const [id, plane] of clipper.list) {
      if (!plane.enabled) continue;
      this.clippingPlanes.add(id);
    }
  }

  /**
   * Applies visibility settings to components based on default visibility, exceptions, and selections.
   *
   * This method adjusts the visibility of components using the `Hider` instance. It ensures that:
   * - The default visibility is applied to all components.
   * - Exceptions are handled to override the default visibility.
   * - Selected components are always visible.
   */
  async applyVisibility() {
    const hider = this._components.get(Hider);
    hider.set(this.defaultVisibility);
    const exception = await this.getExceptionMap();
    hider.set(!this.defaultVisibility, exception);
    const selection = await this.getSelectionMap();
    hider.set(true, selection); // Always make sure the selection is visible
  }

  // TODO: Analyze how this works along with the Highlighter
  /**
   * Asynchronously sets the colorization state for the viewpoint's components.
   * When the state is true, it applies the defined component colors to the corresponding fragments.
   * When the state is false, it resets the highlight for the corresponding fragments.
   *
   * @param state - A boolean indicating whether to apply or reset the colorization.
   *                If true, the components will be colorized. If false, the colorization will be reset.
   * @returns A Promise that resolves when all colorization or reset operations are complete.
   * @remarks Be careful when using this method along with the Highlighter as it can cause unwanted results
   */
  async setColorizationState(state: boolean) {
    const fragments = this._components.get(FragmentsManager);
    const promises = [];
    if (state) {
      for (const [color, guids] of this.componentColors) {
        const hexColorString = `#${color}`;
        const modelIdMap = await fragments.guidsToModelIdMap(guids);
        for (const [modelId, localIds] of Object.entries(modelIdMap)) {
          const model = fragments.list.get(modelId);
          if (!model) continue;
          promises.push(
            model.highlight([...localIds], {
              customId: hexColorString,
              color: new THREE.Color(hexColorString),
              renderedFaces: FRAGS.RenderedFaces.ONE,
              opacity: 1,
              transparent: false,
            }),
          );
        }
      }
    } else {
      for (const [_, guids] of this.componentColors) {
        const modelIdMap = await fragments.guidsToModelIdMap(guids);
        for (const [modelId, localIds] of Object.entries(modelIdMap)) {
          const model = fragments.list.get(modelId);
          if (!model) continue;
          promises.push(model.resetHighlight([...localIds]));
        }
      }
    }
    promises.push(fragments.core.update(true));
    await Promise.all(promises);
  }

  /**
   * Sets the enabled state of all clipping planes associated with this viewpoint.
   * @param state A boolean indicating whether the clipping planes should be enabled or disabled.
   */
  setClippingState(state: boolean) {
    const clipper = this._components.get(Clipper);
    for (const [id, plane] of clipper.list) {
      plane.enabled = state && this.clippingPlanes.has(id);
    }
  }

  /**
   * Sets the visibility of all clipping planes associated with this viewpoint.
   *
   * @param visibility - A boolean indicating whether the clipping planes should be visible (`true`) or hidden (`false`).
   */
  setClippingVisibility(visibility: boolean) {
    const clipper = this._components.get(Clipper);
    for (const id of this.clippingPlanes) {
      const plane = clipper.list.get(id);
      if (!plane) continue;
      plane.visible = visibility;
    }
  }

  private async createComponentTags(from: "selection" | "exception") {
    const fragments = this._components.get(FragmentsManager);
    const manager = this._components.get(BCFTopics);
    let tags = "";
    if (manager.config.includeSelectionTag) {
      const modelIdMap =
        from === "selection"
          ? await this.getSelectionMap()
          : await this.getExceptionMap();
      for (const modelID in modelIdMap) {
        const model = fragments.list.get(modelID);
        if (!model) continue;
        const localIds = modelIdMap[modelID];
        for (const localId of localIds) {
          const item = model.getItem(localId);
          const globalID = await item.getGuid();
          if (!globalID) continue;
          const tag = (await item.getAttributes())?.getValue("Tag");
          let tagAttribute: string | null = null;
          if (tag) tagAttribute = `AuthoringToolId="${tag}"`;
          tags += `\n<Component IfcGuid="${globalID}" ${tagAttribute ?? ""} />`;
        }
      }
    } else {
      tags = [...this.selectionComponents]
        .map((globalId) => `<Component IfcGuid="${globalId}" />`)
        .join(`\n`);
    }
    return tags;
  }

  private createColorTags() {
    let colorTags = "";
    for (const [color, components] of this.componentColors.entries()) {
      const tags = components
        .map((globalId) => `\n<Component IfcGuid="${globalId}" />`)
        .join("\n");
      colorTags += `<Color Color="${color}">\n${tags}\n</Color>`;
    }

    if (colorTags.length !== 0) {
      return `<Coloring>\n${colorTags}\n</Coloring>`;
    }

    return `<Coloring />`;
  }

  /**
   * Converts the current viewpoint instance into a JSON representation compliant with the BCFViewpoint format.
   *
   * @returns A BCF API JSON complaint object representing the viewpoint, including its GUID, components,
   * visibility settings, clipping planes, camera configuration, and snapshot data.
   */
  toJSON() {
    const clipper = this._components.get(Clipper);

    const result: BCFViewpoint = {
      guid: this.guid,
      components: {
        selection: [...this.selectionComponents].map((guid) => {
          return { ifc_guid: guid, authoring_tool_id: null };
        }),
        coloring: [...this.componentColors].map(([color, guids]) => {
          return {
            color,
            components: guids.map((guid) => {
              return { ifc_guid: guid, authoring_tool_id: null };
            }),
          };
        }),
        visibility: {
          default_visibility: this.defaultVisibility,
          exceptions: [...this.exceptionComponents].map((guid) => {
            return { ifc_guid: guid, authoring_tool_id: null };
          }),
          view_setup_hints: {
            spaces_visible: this.spacesVisible,
            space_boundaries_visible: this.spaceBoundariesVisible,
            openings_visible: this.openingsVisible,
          },
        },
      },
      clipping_planes: [...this.clippingPlanes]
        .map((id) => {
          const plane = clipper.list.get(id);
          if (!plane) return null;
          // @ts-ignore TODO: Replace this!
          const origin = plane._controls.worldPosition ?? plane.origin;
          const { normal } = plane;
          return {
            location: { x: origin.x, y: -origin.z, z: origin.y },
            direction: { x: normal.x, y: -normal.z, z: normal.y },
          };
        })
        .filter((plane) => plane !== null) as {
        location: ViewpointVector;
        direction: ViewpointVector;
      }[],
    };

    if ("field_of_view" in this.camera) {
      result.perspective_camera = this.camera as ViewpointPerspectiveCamera;
    } else {
      result.orthogonal_camera = this.camera as ViewpointOrthogonalCamera;
    }

    const manager = this._components.get(Viewpoints);
    const snapshot = manager.snapshots.get(this.snapshot);
    if (snapshot) {
      const str = snapshot.toString();
      const base64Data = btoa(str);
      const extension = manager.getSnapshotExtension(this.snapshot) as
        | "png"
        | "jpg";
      result.snapshot = { snapshot_type: extension, snapshot_data: base64Data };
    }

    return result;
  }

  /**
   * Serializes the viewpoint into a buildingSMART compliant XML string for export.
   *
   * @param version - The version of the BCF Manager to use for serialization.
   *                   If not provided, the current version of the manager will be used.
   *
   * @returns A Promise that resolves to an XML string representing the viewpoint.
   *          The XML string follows the BCF VisualizationInfo schema.
   *
   * @throws An error if the world's camera does not have camera controls.
   * @throws An error if the world's renderer is not available.
   */
  async serialize(version = this._managerVersion) {
    const fragments = this._components.get(FragmentsManager);

    // Set the position back to the original transformation for exporting purposes
    const position = this.position;
    position.applyMatrix4(fragments.baseCoordinationMatrix.clone().invert());

    // Set the direction back to the original transformation for exporting purposes
    const direction = this.direction;
    direction.normalize();

    // The up vector doesn't seem to do anything in other software
    const rotationMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    const upVector = direction.clone().applyMatrix4(rotationMatrix);
    upVector.normalize();

    const cameraViewpointXML = `<CameraViewPoint>
      <X>${position.x}</X>
      <Y>${-position.z}</Y>
      <Z>${position.y}</Z>
    </CameraViewPoint>`;

    const cameraDirectionXML = `<CameraDirection>
      <X>${direction.x}</X>
      <Y>${-direction.z}</Y>
      <Z>${direction.y}</Z>
    </CameraDirection>`;

    const cameraUpVectorXML = `<CameraUpVector>
      <X>${upVector.x}</X>
      <Y>${-upVector.z}</Y>
      <Z>${upVector.y}</Z>
    </CameraUpVector>`;

    const cameraRatioXML = `<AspectRatio>${this.camera.aspect_ratio}</AspectRatio>`;

    let cameraXML = "";
    if ("viewToWorld" in this.camera) {
      cameraXML = `<OrthogonalCamera>
        ${cameraViewpointXML}
        ${cameraDirectionXML}
        ${cameraUpVectorXML}
        ${cameraRatioXML}
        <ViewToWorldScale>${this.camera.viewToWorld}</ViewToWorldScale>
      </OrthogonalCamera>`;
    } else if ("fov" in this.camera) {
      cameraXML = `<PerspectiveCamera>
        ${cameraViewpointXML}
        ${cameraDirectionXML}
        ${cameraUpVectorXML}
        ${cameraRatioXML}
        <FieldOfView>${this.camera.fov}</FieldOfView>
      </PerspectiveCamera>`;
    }

    const viewSetupHints = `<ViewSetupHints SpacesVisible="${this.spacesVisible ?? false}" SpaceBoundariesVisible="${this.spaceBoundariesVisible ?? false}" OpeningsVisible="${this.openingsVisible ?? false}" />`;

    const selectionTags = (await this.createComponentTags("selection")).trim();
    const exceptionTags = (await this.createComponentTags("exception")).trim();
    const colorTags = this.createColorTags();

    return `<?xml version="1.0" encoding="UTF-8"?>
    <VisualizationInfo Guid="${this.guid}">
      <Components>
        ${version === "2.1" ? viewSetupHints : ""}
        ${selectionTags.length !== 0 ? `<Selection>${selectionTags}</Selection>` : ""}
        <Visibility DefaultVisibility="${this.defaultVisibility}">
          ${version === "3" ? viewSetupHints : ""}
          ${exceptionTags.length !== 0 ? `<Exceptions>${exceptionTags}</Exceptions>` : ""}
        </Visibility>
        ${colorTags}
      </Components>
      ${cameraXML}
    </VisualizationInfo>`;
  }
}
