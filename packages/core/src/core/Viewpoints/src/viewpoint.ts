import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { UUID } from "../../../utils";
import {
  BCFViewpoint,
  ViewpointCamera,
  ViewpointOrthographicCamera,
  ViewpointPerspectiveCamera,
} from "./types";
import {
  CameraProjection,
  OrthoPerspectiveCamera,
} from "../../OrthoPerspectiveCamera";
import { Components } from "../../Components";
import { DataMap, DataSet, World } from "../../Types";
import { FragmentsManager } from "../../../fragments/FragmentsManager";
import { BCFTopics } from "../../../openbim/BCFTopics";
import { Raycasters } from "../../Raycasters";
import { BoundingBoxer } from "../../../fragments/BoundingBoxer";
import { Classifier, Hider } from "../../../fragments";
import { SimplePlane } from "../../Clipper";
import { Viewpoints } from "..";

/**
 * Represents a BCF compliant viewpoint from BuildingSMART.
 *
 * The Viewpoint class provides methods for managing and interacting with viewpoints.
 * It includes functionality for setting viewpoint properties, updating the camera,
 * applying color to components, and serializing the viewpoint for export.
 */
export class Viewpoint implements BCFViewpoint {
  title?: string;
  readonly guid = UUID.create();

  /**
   * ClippingPlanes can be used to define a subsection of a building model that is related to the topic.
   * Each clipping plane is defined by Location and Direction.
   * The Direction vector points in the invisible direction meaning the half-space that is clipped.
   * @experimental
   */
  clippingPlanes = new DataSet<SimplePlane>();

  camera: ViewpointPerspectiveCamera | ViewpointOrthographicCamera = {
    aspectRatio: 1,
    fov: 60,
    direction: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 },
  };

  /**
   * A list of components GUIDs to hide when defaultVisibility = true or to show when defaultVisibility = false
   */
  readonly exceptionComponents = new DataSet<string>();

  /**
   * A list of components GUIDs that should be selected (highlighted) when displaying a viewpoint.
   */
  readonly selectionComponents = new DataSet<string>();

  /**
   * A map of colors and components GUIDs that should be colorized when displaying a viewpoint.
   * For this to work, call viewpoint.colorize()
   */
  readonly componentColors = new DataMap<THREE.Color, string[]>();

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

  private get _selectionModelIdMap() {
    const fragments = this._components.get(FragmentsManager);
    const modelIdMap: { [modelID: string]: Set<number> } = {};
    for (const [id, model] of fragments.groups) {
      if (!(id in modelIdMap)) modelIdMap[id] = new Set();
      for (const globalId of this.selectionComponents) {
        const expressID = model.globalToExpressIDs.get(globalId);
        if (expressID) modelIdMap[id].add(expressID);
      }
    }
    return modelIdMap;
  }

  private get _exceptionModelIdMap() {
    const fragments = this._components.get(FragmentsManager);
    const modelIdMap: { [modelID: string]: Set<number> } = {};
    for (const [id, model] of fragments.groups) {
      if (!(id in modelIdMap)) modelIdMap[id] = new Set();
      for (const globalId of this.exceptionComponents) {
        const expressID = model.globalToExpressIDs.get(globalId);
        if (expressID) modelIdMap[id].add(expressID);
      }
    }
    return modelIdMap;
  }

  /**
   * A list of components that should be selected (highlighted) when displaying a viewpoint.
   * @returns The fragmentIdMap for components marked as selections.
   */
  get selection() {
    const fragments = this._components.get(FragmentsManager);
    const fragmentIdMap = fragments.modelIdToFragmentIdMap(
      this._selectionModelIdMap,
    );
    return fragmentIdMap;
  }

  /**
   * A list of components to hide when defaultVisibility = true or to show when defaultVisibility = false
   * @returns The fragmentIdMap for components marked as exceptions.
   */
  get exception() {
    const fragments = this._components.get(FragmentsManager);
    const fragmentIdMap = fragments.modelIdToFragmentIdMap(
      this._exceptionModelIdMap,
    );
    return fragmentIdMap;
  }

  /**
   * Retrieves the projection type of the viewpoint's camera.
   *
   * @returns A string representing the projection type of the viewpoint's camera.
   *          It can be either 'Perspective' or 'Orthographic'.
   */
  get projection(): CameraProjection {
    if ("fov" in this.camera) return "Perspective";
    return "Orthographic";
  }

  /**
   * Retrieves the position vector of the viewpoint's camera.
   *
   * @remarks
   * The position vector represents the camera's position in the world coordinate system.
   * The function applies the base coordinate system transformation to the position vector.
   *
   * @returns A THREE.Vector3 representing the position of the viewpoint's camera.
   */
  get position() {
    const fragments = this._components.get(FragmentsManager);
    const { position } = this.camera;
    const { x, y, z } = position;
    const vector = new THREE.Vector3(x, y, z);
    fragments.applyBaseCoordinateSystem(vector, new THREE.Matrix4());
    return vector;
  }
  /**
   * Retrieves the direction vector of the viewpoint's camera.
   *
   * @remarks
   * The direction vector represents the direction in which the camera is pointing.
   * It is calculated by extracting the x, y, and z components from the camera's direction property.
   *
   * @returns A THREE.Vector3 representing the direction of the viewpoint's camera.
   */
  get direction() {
    const { direction } = this.camera;
    const { x, y, z } = direction;
    const vector = new THREE.Vector3(x, y, z);
    return vector;
  }

  private _components: Components;

  /**
   * Represents the world in which the viewpoints are created and managed.
   */
  readonly world: World;

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
    world: World,
    _config?: {
      data?: Partial<BCFViewpoint>;
      setCamera?: boolean;
    },
  ) {
    const config = { setCamera: true, ..._config };
    const { data, setCamera } = config;
    this._components = components;
    this.world = world;
    if (data) {
      this.guid = data.guid ?? this.guid;
      this.set(data);
    }
    if (setCamera) this.updateCamera();
  }

  /**
   * Adds components to the viewpoint based on the provided fragment ID map.
   *
   * @param fragmentIdMap - A map containing fragment IDs as keys and arrays of express IDs as values.
   */
  addComponentsFromMap(fragmentIdMap: FRAGS.FragmentIdMap) {
    const fragments = this._components.get(FragmentsManager);
    const guids = fragments.fragmentIdMapToGuids(fragmentIdMap);
    this.selectionComponents.add(...guids);
    const manager = this._components.get(Viewpoints);
    manager.list.set(this.guid, this);
  }

  /**
   * Replace the properties of the viewpoint with the provided data.
   *
   * @remarks The guid will be ommited as it shouldn't change after it has been initially set.
   * @remarks The existing selection and exception components will be fully replaced in case new ones are provided.
   *
   * @param data - An object containing the properties to be set.
   *               The properties not included in the object will remain unchanged.
   *
   * @returns The viewpoint instance with the updated properties.
   */
  set(data: Partial<BCFViewpoint>) {
    const _data = data as any;
    const _this = this as any;
    for (const key in data) {
      if (key === "guid") continue;
      const value = _data[key];
      if (key === "selectionComponents") {
        this.selectionComponents.clear();
        this.selectionComponents.add(...value);
        continue;
      }
      if (key === "exceptionComponents") {
        this.exceptionComponents.clear();
        this.exceptionComponents.add(...value);
        continue;
      }
      if (key in this) _this[key] = value;
    }
    const manager = this._components.get(Viewpoints);
    manager.list.set(this.guid, this);
    return this;
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
  async go(world?: World, transition = true) {
    const { camera } = world ?? this.world;
    if (!camera.hasCameraControls()) {
      throw new Error(
        "Viewpoint: the world's camera need controls to set the viewpoint.",
      );
    }

    if (camera instanceof OrthoPerspectiveCamera) {
      camera.projection.set(this.projection);
    }

    const basePosition = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
    );

    const baseTarget = new THREE.Vector3(
      this.camera.direction.x,
      this.camera.direction.y,
      this.camera.direction.z,
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
    let target = {
      x: position.x + direction.x * 80,
      y: position.y + direction.y * 80,
      z: position.z + direction.z * 80,
    };

    const selection = this.selection;
    if (Object.keys(selection).length === 0) {
      // In case there are not selection components, use the raycaster to calculate one
      const raycasters = this._components.get(Raycasters);
      const raycaster = raycasters.get(this.world);
      const result = raycaster.castRayFromVector(position, this.direction);
      if (result) target = result.point; // If there is no result, the default calculated target will be used
    } else {
      // In case there are selection components, use their center as the target
      const bb = this._components.get(BoundingBoxer);
      bb.reset();
      bb.addFragmentIdMap(selection);
      target = bb.getSphere().center;
      bb.reset();
    }

    await camera.controls.setLookAt(
      position.x,
      position.y,
      position.z,
      target.x,
      target.y,
      target.z,
      transition,
    );
  }

  /**
   * Updates the camera settings of the viewpoint based on the current world's camera and renderer.
   *
   * @remarks
   * This function retrieves the camera's position, direction, and aspect ratio from the world's camera and renderer.
   * It then calculates the camera's perspective or orthographic settings based on the camera type.
   * Finally, it updates the viewpoint's camera settings and updates the viewpoint to the Viewpoints manager.
   *
   * @throws An error if the world's camera does not have camera controls.
   * @throws An error if the world's renderer is not available.
   */
  updateCamera(world?: World) {
    const { camera, renderer } = world ?? this.world;
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
    let aspectRatio = width / height;

    // If the renderer exists but there is no HTMLElement, then aspect will be 0 / 0. In that case, use 1 as a fallback.
    if (Number.isNaN(aspectRatio)) aspectRatio = 1;

    const fragments = this._components.get(FragmentsManager);
    position.applyMatrix4(fragments.baseCoordinationMatrix.clone().invert());

    const partialCamera: ViewpointCamera = {
      aspectRatio,
      position: { x: position.x, y: position.y, z: position.z },
      direction: { x: direction.x, y: direction.y, z: direction.z },
    };

    if (threeCamera instanceof THREE.PerspectiveCamera) {
      this.camera = {
        ...partialCamera,
        fov: threeCamera.fov,
      };
    } else if (threeCamera instanceof THREE.OrthographicCamera) {
      this.camera = {
        ...partialCamera,
        viewToWorldScale: threeCamera.top - threeCamera.bottom,
      };
    }

    const manager = this._components.get(Viewpoints);
    manager.list.set(this.guid, this);
  }

  applyVisibility() {
    const hider = this._components.get(Hider);
    hider.set(this.defaultVisibility);
    hider.set(!this.defaultVisibility, this.exception);
    hider.set(true, this.selection); // Always make sure the selection is visible
  }

  /**
   * Applies color to the components in the viewpoint based on their GUIDs.
   *
   * This function iterates through the `componentColors` map, retrieves the fragment IDs
   * corresponding to each color, and then uses the `Classifier` to apply the color to those fragments.
   *
   * @remarks
   * The color is applied using the `Classifier.setColor` method, which sets the color of the specified fragments.
   * The color is provided as a hexadecimal string, prefixed with a '#'.
   */
  applyColors() {
    const manager = this._components.get(Viewpoints);
    const fragments = this._components.get(FragmentsManager);
    const classifier = this._components.get(Classifier);
    for (const [color, guids] of this.componentColors) {
      const fragmentIdMap = fragments.guidToFragmentIdMap(guids);
      classifier.setColor(fragmentIdMap, color, manager.config.overwriteColors);
    }
  }

  /**
   * Resets the colors of all components in the viewpoint to their original color.
   */
  resetColors() {
    const fragments = this._components.get(FragmentsManager);
    const classifier = this._components.get(Classifier);
    for (const [_, guids] of this.componentColors) {
      const fragmentIdMap = fragments.guidToFragmentIdMap(guids);
      classifier.resetColor(fragmentIdMap);
    }
  }

  private async createComponentTags(from: "selection" | "exception") {
    const fragments = this._components.get(FragmentsManager);
    const manager = this._components.get(BCFTopics);
    let tags = "";
    if (manager.config.includeSelectionTag) {
      const modelIdMap =
        from === "selection"
          ? this._selectionModelIdMap
          : this._exceptionModelIdMap;
      for (const modelID in modelIdMap) {
        const model = fragments.groups.get(modelID);
        if (!model) continue;
        const expressIDs = modelIdMap[modelID];
        for (const expressID of expressIDs) {
          const attrs = await model.getProperties(expressID);
          if (!attrs) continue;
          const globalID = attrs.GlobalId?.value;
          if (!globalID) continue;
          const tag = attrs.Tag?.value;
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
      const hex = `#${color.getHexString()}`;
      const tags = components
        .map((globalId) => `\n<Component IfcGuid="${globalId}" />`)
        .join("\n");
      colorTags += `<Color Color="${hex}">\n${tags}\n</Color>`;
    }

    if (colorTags.length !== 0) {
      return `<Coloring>\n${colorTags}\n</Coloring>`;
    }

    return `<Coloring />`;
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

    const cameraRatioXML = `<AspectRatio>${this.camera.aspectRatio}</AspectRatio>`;

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
