import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { UUID } from "../../../utils";
import {
  BCFViewpoint,
  ViewpointOrthographicCamera,
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
import { Raycasters } from "../../Raycasters";
import { BoundingBoxer } from "../../../fragments/BoundingBoxer";

export class Viewpoint {
  guid = UUID.create();

  // The transformation matrix used at the time of creation
  coordinationMatrix = new THREE.Matrix4();

  camera: ViewpointPerspectiveCamera | ViewpointOrthographicCamera = {
    aspect: 0,
    fov: 0,
    direction: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 },
  };

  readonly selectionComponents = new Set<string>();
  spacesVisible = false;
  spaceBoundariesVisible = false;
  openingsVisible = false;
  defaultVisibility = true;

  private get _modelIdMap() {
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

  get selection() {
    const fragments = this._components.get(FragmentsManager);
    const fragmentIdMap = fragments.modelIdToFragmentIdMap(this._modelIdMap);
    return fragmentIdMap;
  }

  get projection(): CameraProjection {
    if ("fov" in this.camera) {
      return "Perspective";
    }
    return "Orthographic";
  }

  get position() {
    const { position } = this.camera;
    const { x, y, z } = position;
    return new THREE.Vector3(x, y, z);
  }

  get direction() {
    const { direction } = this.camera;
    const { x, y, z } = direction;
    return new THREE.Vector3(x, y, z);
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
    const topics = topicsList.filter((topic) => topic.viewpoints.has(this));
    return topics;
  }

  constructor(components: Components, world: World) {
    this._components = components;
    this.world = world;
    this.update();
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
  }

  set(data: Partial<BCFViewpoint>) {
    const _data = data as any;
    const _this = this as any;
    for (const key in data) {
      if (key === "guid") continue;
      const value = _data[key];
      if (key in this) _this[key] = value;
    }
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

    const controls = camera.controls;
    const position = this.position;

    const fragments = this._components.get(FragmentsManager);
    fragments.applyBaseCoordinateSystem(
      position.clone(),
      this.coordinationMatrix,
    );

    // Default target based on the viewpoint information
    let target = {
      x: position.x + this.direction.x * 80,
      y: position.y + this.direction.y * 80,
      z: position.z + this.direction.z * 80,
    };

    const selection = this.selection;
    if (Object.keys(selection).length !== 0) {
      // In case there are selection components, use their center as the target
      const bb = this._components.get(BoundingBoxer);
      bb.reset();
      bb.addFragmentIdMap(this.selection);
      target = bb.getSphere().center;
      bb.reset();
    } else {
      // In case there are not selection components, use the raycaster to calculate one
      const raycasters = this._components.get(Raycasters);
      const raycaster = raycasters.get(this.world);
      const result = raycaster.castRayFromVector(position, this.direction);
      if (result) target = result.point;
    }

    await controls.setLookAt(
      position.x,
      position.y,
      position.z,
      target.x,
      target.y,
      target.z,
      transition,
    );
  }

  update() {
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
    let aspect = width / height;

    // If the renderer exists but there is no HTMLElement, then aspect will be 0 / 0. In that case, use 1 as a fallback.
    if (Number.isNaN(aspect)) aspect = 1;

    const fragments = this._components.get(FragmentsManager);
    const baseModel = fragments.groups.get(fragments.baseCoordinationModel);
    if (baseModel) position.applyMatrix4(baseModel.coordinationMatrix);

    const partialCamera = {
      aspect,
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
        viewtoWorld: threeCamera.top - threeCamera.bottom,
      };
    }

    this.coordinationMatrix = fragments.baseCoordinationMatrix;
  }

  async serialize(version = this._managerVersion) {
    const fragments = this._components.get(FragmentsManager);
    const manager = this._components.get(BCFTopics);

    let componentSelection = "";
    if (manager.config.includeSelectionTag) {
      const modelIdMap = this._modelIdMap;
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
          componentSelection += `\n<Component IfcGuid="${globalID}" ${tagAttribute ?? ""} />`;
        }
      }
    } else {
      componentSelection = [...this.selectionComponents]
        .map((globalId) => `<Component IfcGuid="${globalId}" />`)
        .join(`\n`);
    }

    const coordinationMatrix = new THREE.Matrix4();
    const baseModel = fragments.groups.get(fragments.baseCoordinationModel);
    if (baseModel) {
      coordinationMatrix.copy(baseModel.coordinationMatrix);
    }
    const position = this.position
      .clone()
      .applyMatrix4(this.coordinationMatrix.clone().invert());
    position.applyMatrix4(coordinationMatrix);

    const cameraViewpointXML = `<CameraViewPoint>
      <X>${position.x}</X>
      <Y>${-position.z}</Y>
      <Z>${position.y}</Z>
    </CameraViewPoint>`;

    const cameraDirectionXML = `<CameraDirection>
      <X>${this.camera.direction.x}</X>
      <Y>${-this.camera.direction.z}</Y>
      <Z>${this.camera.direction.y}</Z>
    </CameraDirection>`;

    const cameraUpVectorXML = `<CameraUpVector>
      <X>0</X>
      <Y>0</Y>
      <Z>1</Z>
    </CameraUpVector>`;

    const cameraRatioXML = `<AspectRatio>${this.camera.aspect}</AspectRatio>`;

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

    return `<?xml version="1.0" encoding="UTF-8"?>
    <VisualizationInfo Guid="${this.guid}">
      <Components>
        <ViewSetupHints SpacesVisible="${this.spacesVisible ?? false}" SpaceBoundariesVisible="${this.spaceBoundariesVisible ?? false}" OpeningsVisible="${this.openingsVisible ?? false}" />
        <Selection>
          ${componentSelection}
        </Selection>
        <Visibility DefaultVisibility="${this.defaultVisibility ?? true}" />
      </Components>
      ${cameraXML}
    </VisualizationInfo>`;
  }
}
