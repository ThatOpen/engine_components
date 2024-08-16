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

export class Viewpoint implements BCFViewpoint {
  title?: string;
  guid = UUID.create();

  clippingPlanes = new DataSet<SimplePlane>();

  camera: ViewpointPerspectiveCamera | ViewpointOrthographicCamera = {
    aspectRatio: 0,
    fov: 0,
    direction: { x: 0, y: 0, z: 80 },
    position: { x: 0, y: 0, z: 0 },
  };

  readonly exceptionComponents = new DataSet<string>();
  readonly selectionComponents = new DataSet<string>();
  readonly componentColors = new DataMap<string, string[]>();
  spacesVisible = false;
  spaceBoundariesVisible = false;
  openingsVisible = false;
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

  get selection() {
    const fragments = this._components.get(FragmentsManager);
    const fragmentIdMap = fragments.modelIdToFragmentIdMap(
      this._selectionModelIdMap,
    );
    return fragmentIdMap;
  }

  get exception() {
    const fragments = this._components.get(FragmentsManager);
    const fragmentIdMap = fragments.modelIdToFragmentIdMap(
      this._exceptionModelIdMap,
    );
    return fragmentIdMap;
  }

  get projection(): CameraProjection {
    if ("fov" in this.camera) return "Perspective";
    return "Orthographic";
  }

  get position() {
    const fragments = this._components.get(FragmentsManager);
    const { position } = this.camera;
    const { x, y, z } = position;
    const vector = new THREE.Vector3(x, y, z);
    fragments.applyBaseCoordinateSystem(vector, new THREE.Matrix4());
    return vector;
  }

  get direction() {
    const { direction } = this.camera;
    const { x, y, z } = direction;
    const vector = new THREE.Vector3(x, y, z);
    return vector;
  }

  private _components: Components;
  readonly world: World;

  private get _managerVersion() {
    const manager = this._components.get(BCFTopics);
    return manager.config.version;
  }

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

  async addComponentsFromMap(fragmentIdMap: FRAGS.FragmentIdMap) {
    const fragments = this._components.get(FragmentsManager);
    for (const fragmentID in fragmentIdMap) {
      const fragment = fragments.list.get(fragmentID);
      if (!(fragment && fragment.group)) continue;
      const model = fragment.group;
      const expressIDs = fragmentIdMap[fragmentID];
      for (const expressID of expressIDs) {
        const attrs = await model.getProperties(expressID);
        if (!attrs) continue;
        const globalId = attrs.GlobalId?.value;
        if (globalId) this.selectionComponents.add(globalId);
      }
    }
    const manager = this._components.get(Viewpoints);
    manager.list.set(this.guid, this);
  }

  set(data: Partial<BCFViewpoint>) {
    const _data = data as any;
    const _this = this as any;
    for (const key in data) {
      if (key === "guid") continue;
      const value = _data[key];
      if (key in this) _this[key] = value;
    }
    const manager = this._components.get(Viewpoints);
    manager.list.set(this.guid, this);
    return this;
  }

  async go(transition = true) {
    const { camera } = this.world;
    if (!camera.hasCameraControls()) {
      throw new Error(
        "Viewpoint: the world's camera need controls to set the viewpoint.",
      );
    }

    if (camera instanceof OrthoPerspectiveCamera) {
      camera.projection.set(this.projection);
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
      if (result) target = result.point;
    } else {
      // In case there are selection components, use their center as the target
      const bb = this._components.get(BoundingBoxer);
      bb.reset();
      bb.addFragmentIdMap(selection);
      target = bb.getSphere().center;
      bb.reset();
    }

    // Sets the viewpoint components visibility
    const hider = this._components.get(Hider);
    hider.set(this.defaultVisibility);
    hider.set(!this.defaultVisibility, this.exception);
    hider.set(true, selection); // Always make sure the selection is visible

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

  updateCamera() {
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

  colorize() {
    const manager = this._components.get(Viewpoints);
    const fragments = this._components.get(FragmentsManager);
    const classifier = this._components.get(Classifier);
    for (const [color, guids] of this.componentColors) {
      const fragmentIdMap = fragments.guidToFragmentIdMap(guids);
      const threeColor = new THREE.Color(`#${color}`);
      classifier.setColor(
        fragmentIdMap,
        threeColor,
        manager.config.overwriteColors,
      );
    }
  }

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

    return `<?xml version="1.0" encoding="UTF-8"?>
    <VisualizationInfo Guid="${this.guid}">
      <Components>
        ${version === "2.1" ? viewSetupHints : ""}
        ${selectionTags.length !== 0 ? `<Selection>${selectionTags}</Selection>` : ""}
        <Visibility DefaultVisibility="${this.defaultVisibility}">
          ${version === "3" ? viewSetupHints : ""}
          ${exceptionTags.length !== 0 ? `<Exceptions>${exceptionTags}</Exceptions>` : ""}
        </Visibility>
      </Components>
      ${cameraXML}
    </VisualizationInfo>`;
  }
}
