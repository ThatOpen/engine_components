import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import {
  BCFViewpoint,
  ViewpointOrthographicCamera,
  ViewpointPerspectiveCamera,
} from "./types";
import { UUID } from "../../../utils";
import { Components } from "../../../core/Components";
import { World } from "../../../core/Types/src/world";
import { FragmentsManager } from "../../../fragments/FragmentsManager";
import {
  CameraProjection,
  OrthoPerspectiveCamera,
} from "../../../core/OrthoPerspectiveCamera";

export class Viewpoint implements BCFViewpoint {
  guid = UUID.create();
  coordinationMatrix = new THREE.Matrix4();
  camera: ViewpointPerspectiveCamera | ViewpointOrthographicCamera = {
    aspect: 0,
    fov: 0,
    direction: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 },
  };

  selectionComponents: FRAGS.FragmentIdMap = {};
  spacesVisible = false;
  spaceBoundariesVisible = false;
  openingsVisible = false;
  defaultVisibility = true;

  get cameraProjection(): CameraProjection {
    if ("fov" in this.camera) {
      return "Perspective";
    }
    return "Orthographic";
  }

  get cameraPosition() {
    const { position } = this.camera;
    const { x, y, z } = position;
    return new THREE.Vector3(x, y, z);
  }

  get cameraDirection() {
    const { direction } = this.camera;
    const { x, y, z } = direction;
    return new THREE.Vector3(x, y, z);
  }

  private _world: World | null = null;

  get world(): World {
    if (!this._world) {
      throw new Error("Viewport: no world has been set.");
    }
    return this._world;
  }

  set world(world: World | null) {
    this._world = world;
    if (world) this.update();
  }

  private _components: Components;

  constructor(components: Components) {
    this._components = components;
  }

  set(data: Partial<BCFViewpoint>) {
    const {
      guid,
      camera,
      selectionComponents,
      spacesVisible,
      spaceBoundariesVisible,
      openingsVisible,
      defaultVisibility,
    } = data;
    if (guid) {
      this.guid = guid;
    }
    if (camera) {
      this.camera = camera;
    }
    if (selectionComponents) {
      this.selectionComponents = selectionComponents as FRAGS.FragmentIdMap;
    }
    if (spacesVisible) {
      this.spacesVisible = spacesVisible;
    }
    if (spaceBoundariesVisible) {
      this.spaceBoundariesVisible = spaceBoundariesVisible;
    }
    if (openingsVisible) {
      this.openingsVisible = openingsVisible;
    }
    if (defaultVisibility) {
      this.defaultVisibility = defaultVisibility;
    }
  }

  async go(transition = true) {
    const { camera } = this.world;
    if (!camera.hasCameraControls()) {
      throw new Error("Viewpoint: camera controls are needed.");
    }

    if (camera instanceof OrthoPerspectiveCamera) {
      camera.projection.set(this.cameraProjection);
    }

    const controls = camera.controls;
    const position = this.cameraPosition;

    const fragments = this._components.get(FragmentsManager);
    const baseModel = fragments.groups.get(fragments.baseCoordinationModel);
    if (baseModel) {
      position.applyMatrix4(baseModel.coordinationMatrix.clone().invert());
    }

    const target = {
      x: position.x + this.cameraDirection.x,
      y: position.y + this.cameraDirection.y,
      z: position.z + this.cameraDirection.z,
    };

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
  }

  async getXML() {
    const fragmentManager = this._components.get(FragmentsManager);

    let componentSelection = "";
    for (const fragmentID in this.selectionComponents) {
      const fragment = fragmentManager.list.get(fragmentID);
      if (!(fragment && fragment.group)) continue;
      const model = fragment.group;
      const expressIDs = this.selectionComponents[fragmentID];
      for (const expressID of expressIDs) {
        const attrs = await model.getProperties(expressID);
        if (!attrs) continue;
        const globalID = attrs.GlobalId?.value as string | undefined;
        const tag = attrs.Tag?.value as string | undefined;
        if (!(globalID || tag)) continue;
        const componentAttributes = `${globalID ? `IfcGuid="${globalID}"` : ""} ${tag ? `AuthoringToolId="${tag}"` : ""}`;
        componentSelection += `\n<Component ${componentAttributes} />`;
      }
    }

    const coordinationMatrix = new THREE.Matrix4();
    const baseModel = fragmentManager.groups.get(
      fragmentManager.baseCoordinationModel,
    );
    if (baseModel) {
      coordinationMatrix.copy(baseModel.coordinationMatrix);
    }
    const position = this.cameraPosition
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
