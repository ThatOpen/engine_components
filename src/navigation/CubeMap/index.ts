import * as THREE from "three";
import {
  Component,
  Disposable,
  Event,
  Hideable,
  Updateable,
} from "../../base-types";
import { Components, ToolComponent } from "../../core";
import { OrthoPerspectiveCamera } from "../OrthoPerspectiveCamera";

type CubeMapPositions =
  | "top-left"
  | "top-right"
  | "bottom-right"
  | "bottom-left";

export type CubeMapFace =
  | "front"
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "back";

/**
 * A simple navigation cube to zoom the scene to its basic views (top, bottom,
 * left, right, back and front).
 */
export class CubeMap
  extends Component<HTMLDivElement>
  implements Updateable, Hideable, Disposable
{
  static readonly uuid = "53311ea3-323a-476f-ae4a-d681778e8f67" as const;

  /** {@link Component.enabled} */
  enabled: boolean = true;

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate: Event<CubeMap> = new Event();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate: Event<CubeMap> = new Event();

  /** The minimum zoom distance to the scene. */
  offset = 1;

  private _cubeFaceClass =
    "flex justify-center font-bold hover:bg-ifcjs-200 hover:text-ifcjs-100 text-white select-none text-xl items-center cursor-pointer text-center text-ifcjs-100 absolute w-[60px] h-[60px] border-solid border-ifcjs-120";
  private _cyan = "bg-[#3CE6FEDD]";
  private _pink = "bg-[#BD4BF3DD]";
  private _blue = "bg-[#201491DD]";
  private _cube = document.createElement("div");
  private _cubeWrapper = document.createElement("div");
  private _matrix = new THREE.Matrix4();
  private _visible!: boolean;

  private _faceOrientations = {
    front: new THREE.Vector3(0, 0, 1),
    top: new THREE.Vector3(0, 1, 0),
    bottom: new THREE.Vector3(0, -1, 0),
    right: new THREE.Vector3(1, 0, 0),
    left: new THREE.Vector3(-1, 0, 0),
    back: new THREE.Vector3(0, 0, -1),
  };

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
    if (this._visible) {
      this._cubeWrapper.classList.remove("hidden");
    } else {
      this._cubeWrapper.classList.add("hidden");
    }
  }

  constructor(components: Components) {
    super(components);

    this.components.tools.add(CubeMap.uuid, this);

    this._cubeWrapper.id = "tooeen-cube-map";
    this._cubeWrapper.className = "absolute z-10";
    this.setPosition("bottom-right");
    this._cube.className = "w-[60px] h-[60px] relative";
    this.setSize("400");
    this._cube.style.transformStyle = "preserve-3d";
    this._cube.style.transform = "translateZ(-300px)";
    this._cube.style.textTransform = "uppercase";
    this._cubeWrapper.append(this._cube);

    if (components.camera.isUpdateable()) {
      components.camera.onAfterUpdate.add(this.update);
    }

    // #region Cube faces
    const frontFace = document.createElement("div");
    frontFace.id = "cube-map-front";
    frontFace.className = `${this._cubeFaceClass} ${this._cyan}`;
    frontFace.style.transform = "rotateX(180deg) translateZ(-30px)";
    frontFace.style.transition = "all 0.2s";
    frontFace.onclick = () => this.orientToFace("front");

    const topFace = document.createElement("div");
    topFace.className = `${this._cubeFaceClass} ${this._pink}`;
    topFace.style.transform = "rotateX(90deg) translateZ(-30px)";
    topFace.style.transition = "all 0.2s";
    topFace.onclick = () => this.orientToFace("top");

    const bottomFace = document.createElement("div");
    bottomFace.className = `${this._cubeFaceClass} ${this._pink}`;
    bottomFace.style.transform = "rotateX(270deg) translateZ(-30px)";
    bottomFace.style.transition = "all 0.2s";
    bottomFace.onclick = () => this.orientToFace("bottom");

    const rightFace = document.createElement("div");
    rightFace.className = `${this._cubeFaceClass} ${this._blue}`;
    rightFace.style.transform =
      "rotateY(-270deg) rotateX(180deg) translateZ(-30px)";
    rightFace.style.transition = "all 0.2s";
    rightFace.onclick = () => this.orientToFace("right");

    const leftFace = document.createElement("div");
    leftFace.className = `${this._cubeFaceClass} ${this._blue}`;
    leftFace.style.transform =
      "rotateY(-90deg) rotateX(180deg) translateZ(-30px)";
    leftFace.style.transition = "all 0.2s";
    leftFace.onclick = () => this.orientToFace("left");

    const backFace = document.createElement("div");
    backFace.className = `${this._cubeFaceClass} ${this._cyan}`;
    backFace.style.transform = "translateZ(-30px) rotateZ(180deg)";
    backFace.style.transition = "all 0.2s";
    backFace.onclick = () => this.orientToFace("back");
    // #endregion

    this._cube.append(
      frontFace,
      topFace,
      bottomFace,
      rightFace,
      leftFace,
      backFace
    );
    this._viewerContainer?.append(this._cubeWrapper);

    this.visible = true;
  }

  async dispose() {
    this.onAfterUpdate.reset();
    this.onBeforeUpdate.reset();
    this._cube.remove();
    this._cubeWrapper.remove();
    (this.components as any) = null;
  }

  setSize(value: string = "350") {
    this._cubeWrapper.style.perspective = `${value}px`;
  }

  setPosition(corner: CubeMapPositions) {
    this._cubeWrapper.classList.remove(
      "top-8",
      "bottom-8",
      "left-8",
      "right-8"
    );
    const wrapperPositions: Record<CubeMapPositions, string[]> = {
      "top-left": ["top-8", "left-8"],
      "top-right": ["top-8", "right-8"],
      "bottom-right": ["bottom-8", "right-8"],
      "bottom-left": ["bottom-8", "left-8"],
    };
    this._cubeWrapper.classList.add(...wrapperPositions[corner]);
  }

  orientToFace(orientation: CubeMapFace) {
    const camera = this._camera.get();
    if (this._camera instanceof OrthoPerspectiveCamera) {
      const controls = this._camera.controls;

      const projection = this._camera.getProjection();

      const target = camera.position
        .clone()
        .add(this._faceOrientations[orientation].clone().multiplyScalar(-1));

      const { x, y, z } = camera.position;

      if (projection === "Perspective") {
        controls.setLookAt(x, y, z, target.x, target.y, target.z, true);
      } else {
        const pos = new THREE.Vector3();
        if (orientation === "top") pos.set(0, 200, 0);
        if (orientation === "bottom") pos.set(0, -200, 0);
        if (orientation === "left") pos.set(-200, 0, 0);
        if (orientation === "right") pos.set(200, 0, 0);
        if (orientation === "front") pos.set(0, 0, 200);
        if (orientation === "back") pos.set(0, 0, -200);
        controls.setPosition(pos.x, pos.y, pos.z, true);
        controls.setTarget(0, 0, 0, true);
      }

      this._camera.fit(undefined, this.offset);
    }
  }

  update = () => {
    this._matrix.extractRotation(this._camera.get().matrixWorldInverse);
    this._cube.style.transform = `translateZ(-300px) ${this.getCameraCSSMatrix(
      this._matrix
    )}`;
  };

  private get _viewerContainer() {
    return this.components.renderer.get().domElement.parentElement;
  }

  private get _camera() {
    return this.components.camera;
  }

  private getCameraCSSMatrix(matrix: any) {
    const { elements } = matrix;
    const epsilon = (value: number) => {
      return Math.abs(value) < 1e-10 ? 0 : value;
    };
    return `matrix3d(
            ${epsilon(elements[0])},
            ${epsilon(-elements[1])},
            ${epsilon(elements[2])},
            ${epsilon(elements[3])},
            ${epsilon(elements[4])},
            ${epsilon(-elements[5])},
            ${epsilon(elements[6])},
            ${epsilon(elements[7])},
            ${epsilon(elements[8])},
            ${epsilon(-elements[9])},
            ${epsilon(elements[10])},
            ${epsilon(elements[11])},
            ${epsilon(elements[12])},
            ${epsilon(-elements[13])},
            ${epsilon(elements[14])},
            ${epsilon(elements[15])})
        `;
  }

  get(): HTMLDivElement {
    return this._cubeWrapper;
  }
}

ToolComponent.libraryUUIDs.add(CubeMap.uuid);
