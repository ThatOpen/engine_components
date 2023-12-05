import * as THREE from "three";
import {
  Createable,
  Disposable,
  Event,
  UI,
  Component,
  UIElement,
} from "../../base-types";
import { Components, ToolComponent } from "../../core";
import { Button } from "../../ui";

export class VolumeMeasurement
  extends Component<void>
  implements Createable, UI, Disposable
{
  static readonly uuid = "811da532-7af3-4635-b592-1c06ae494af5" as const;

  uiElement = new UIElement<{ main: Button }>();

  private _enabled: boolean = false;

  readonly onBeforeCreate = new Event<any>();
  readonly onAfterCreate = new Event<any>();
  readonly onBeforeCancel = new Event<any>();
  readonly onAfterCancel = new Event<any>();
  readonly onBeforeDelete = new Event<any>();
  readonly onAfterDelete = new Event<any>();

  set enabled(value: boolean) {
    this._enabled = value;
    if (this.components.uiEnabled) {
      const main = this.uiElement.get("main");
      main.active = value;
    }
    this.setupEvents(value);
    if (!value) {
      this.cancelCreation();
    }
  }

  get enabled() {
    return this._enabled;
  }

  constructor(components: Components) {
    super(components);

    this.components.tools.add(VolumeMeasurement.uuid, this);

    if (components.uiEnabled) {
      this.setUI();
    }
  }

  async dispose() {
    this.setupEvents(false);
    this.onBeforeCreate.reset();
    this.onAfterCreate.reset();
    this.onBeforeCancel.reset();
    this.onAfterCancel.reset();
    this.onBeforeDelete.reset();
    this.onAfterDelete.reset();
    await this.uiElement.dispose();
    (this.components as any) = null;
  }

  private setUI() {
    const main = new Button(this.components);
    main.materialIcon = "check_box_outline_blank";
    main.onClick.add(() => {
      if (!this.enabled) {
        main.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        main.active = false;
      }
    });
    this.uiElement.set({ main });
  }

  create = () => {
    if (!this.enabled) return;
    const result = this.components.raycaster.castRay();
    if (!result || !result.object) return;
    const { object } = result;
    if (object instanceof THREE.Mesh) {
      const volume = this.getVolumeOfMesh(object);
      console.log(volume);
    }
  };

  delete() {}

  /** Deletes all the dimensions that have been previously created. */
  async deleteAll() {}

  endCreation() {}

  cancelCreation() {}

  get() {}

  getVolumeFromMeshes(meshes: THREE.Mesh[]) {
    let volume = 0;
    for (const mesh of meshes) {
      volume += this.getVolumeOfMesh(mesh);
    }
    return volume;
  }

  private setupEvents(active: boolean) {
    const viewerContainer = this.components.ui.viewerContainer;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeydown);
    }
  }

  private onMouseMove = () => {};

  private onKeydown = (_e: KeyboardEvent) => {};

  // https://stackoverflow.com/a/1568551
  private getVolumeOfMesh(mesh: THREE.Mesh | THREE.InstancedMesh) {
    let volume = 0;
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();
    const { index } = mesh.geometry;
    const pos = mesh.geometry.attributes.position.array;
    if (!index) {
      console.warn("Geometry must be indexed to compute its volume!");
      return 0;
    }
    // prettier-ignore
    const instances: THREE.Matrix4[] = [];
    if (mesh instanceof THREE.InstancedMesh) {
      for (let i = 0; i < mesh.count; i++) {
        const matrix = new THREE.Matrix4();
        mesh.getMatrixAt(i, matrix);
        instances.push(matrix);
      }
    } else {
      instances.push(new THREE.Matrix4().identity());
    }
    const { matrixWorld } = mesh;
    for (let i = 0; i < index.array.length - 2; i += 3) {
      for (const instance of instances) {
        const transform = instance.multiply(matrixWorld);
        const i1 = index.array[i] * 3;
        const i2 = index.array[i + 1] * 3;
        const i3 = index.array[i + 2] * 3;
        p1.set(pos[i1], pos[i1 + 1], pos[i1 + 2]).applyMatrix4(transform);
        p2.set(pos[i2], pos[i2 + 1], pos[i2 + 2]).applyMatrix4(transform);
        p3.set(pos[i3], pos[i3 + 1], pos[i3 + 2]).applyMatrix4(transform);
        volume += this.getSignedVolumeOfTriangle(p1, p2, p3);
      }
    }
    return Math.abs(volume);
  }

  private getSignedVolumeOfTriangle(
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3
  ) {
    const v321 = p3.x * p2.y * p1.z;
    const v231 = p2.x * p3.y * p1.z;
    const v312 = p3.x * p1.y * p2.z;
    const v132 = p1.x * p3.y * p2.z;
    const v213 = p2.x * p1.y * p3.z;
    const v123 = p1.x * p2.y * p3.z;
    return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
  }
}

ToolComponent.libraryUUIDs.add(VolumeMeasurement.uuid);
