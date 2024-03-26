import * as THREE from "three";
import { Vector3 } from "three";
import { RoadNavigator } from "../RoadNavigator";

export class AnchorPosition {
  private _model2DPosition: THREE.Vector3 | undefined;
  private _alignment2D: THREE.Object3D | undefined;

  private _components: any;
  private _container: HTMLElement;
  private _navigator: RoadNavigator;
  private _modelAlignments: any;

  constructor(
    components: any,
    container: HTMLElement,
    navigator: any,
    modelAlignments: any
  ) {
    this._components = components;
    this._container = container;
    this._navigator = navigator;
    this._modelAlignments = modelAlignments;
  }

  model: any = [];
  model3DPosition: Vector3 = new THREE.Vector3(0, 0, 0);
  completedAlignment: boolean = false;

  mousePositionSphere: THREE.Mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );

  get modelAlignments(): any {
    return this._modelAlignments;
  }

  set modelAlignments(model: any) {
    this._modelAlignments = model;
  }

  get navigator(): RoadNavigator {
    return this._navigator;
  }

  set navigator(navigator: RoadNavigator) {
    this._navigator = navigator;
  }

  get container(): HTMLElement {
    return this._container;
  }

  set container(value: HTMLElement) {
    this._container = value;
  }

  get components(): any {
    return this._components;
  }

  set components(value: any) {
    this._components = value;
  }

  get alignment2D(): any {
    return this._alignment2D;
  }

  set alignment2D(alignment: THREE.Object3D) {
    this._alignment2D = alignment;
  }

  get model2DPosition(): Vector3 | undefined {
    return this._model2DPosition;
  }

  set model2DPosition(position: Vector3 | undefined) {
    this._model2DPosition = position;
  }

  setAnchorPosition() {
    if (!this.container) return;

    this.getModel3DFragments(this.components);

    const scene = this.components.scene.get();
    scene.add(this.mousePositionSphere);

    this.handleMouseMove();
    this.handleClick();
  }

  private getModel3DFragments(components: any) {
    components.meshes.forEach((m: THREE.Mesh) => {
      this.model.push(m);
    });
  }

  private handleMouseMove() {
    this.container.addEventListener("mousemove", (event: MouseEvent) => {
      const { alignment2D } = this.navigator.anchor;
      const { domElement } = this.components.renderer._renderer;

      if (!alignment2D) return;
      if (this.model3DPosition.x !== 0) return;
      if (this.completedAlignment) return;

      const rect = domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.components.raycaster._raycaster.setFromCamera(
        mouse,
        this.components.camera.activeCamera
      );

      const intersects = this.components.raycaster._raycaster.intersectObjects(
        this.model,
        true
      );

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { point } = intersect;

        this.mousePositionSphere.visible = true;
        this.mousePositionSphere.position.copy(point);
      } else {
        this.mousePositionSphere.visible = false;
      }
    });
  }

  private handleClick() {
    this.container.addEventListener("click", () => {
      const { alignment2D, model2DPosition } = this.navigator.anchor;
      this.model3DPosition = this.mousePositionSphere.position.clone();

      if (!model2DPosition) return;
      if (this.model3DPosition.x === 0) return;
      if (this.completedAlignment) return;

      const { index } = alignment2D.curve;
      const curve = alignment2D.curve;
      const mesh = curve.alignment.vertical[index].mesh;
      const position = mesh.geometry.attributes.position.array;
      let altitudes = [];

      for (let i = 0; i < position.length; i += 3) {
        altitudes.push({
          x: position[i],
          y: position[i + 1],
          z: position[i + 2],
        });
      }

      let altitude = 0;

      for (const alt of altitudes) {
        altitude += alt.y;
      }

      const result = altitude / altitudes.length;
      const threshold = 8;

      const mat = new THREE.Matrix4();

      mat.makeTranslation(
        -model2DPosition.x + this.model3DPosition.x,
        -result - threshold,
        model2DPosition.y + this.model3DPosition.z
      );

      const scene = this.components.scene.get();

      // @ts-ignore
      for (const [id, alignment] of this.modelAlignments.civilData.alignments) {
        for (const align of alignment.absolute) {
          align.mesh.applyMatrix4(mat);

          scene.add(align.mesh);
        }
      }

      this.completedAlignment = true;
    });
  }
}
