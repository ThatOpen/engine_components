import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Components } from "../../../core";
import { FragmentBoundingBox } from "../../FragmentBoundingBox";
import { PlanView } from "./types";
import { Button } from "../../../ui";
import { UI, Event, UIElement } from "../../../base-types";

interface PlanObject {
  root: THREE.Group;
  plane: THREE.Mesh;
  outline: THREE.LineSegments;
  marker: CSS2DObject;
  button: Button;
}

export class PlanObjects implements UI {
  offsetFactor = 0.2;

  uiElement = new UIElement<{ main: Button }>();

  planClicked = new Event<{ id: string }>();
  components: Components;

  private _scale = new THREE.Vector2(1, 1);
  private _min = new THREE.Vector3();
  private _max = new THREE.Vector3();
  private _objects: { [id: string]: PlanObject } = {};
  private _visible = false;

  private _planeGeometry = new THREE.PlaneGeometry(1, 1, 1);
  private _linesGeometry = new THREE.BufferGeometry();

  private lineMaterial = new THREE.LineDashedMaterial({
    color: 0xbcf124,
    dashSize: 0.2,
    gapSize: 0.2,
  });

  private _material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0x1a2128,
    depthTest: false,
  });

  get visible() {
    return this._visible;
  }

  set visible(active: boolean) {
    this._visible = active;
    const scene = this.components.scene.get();
    for (const id in this._objects) {
      const { root, marker } = this._objects[id];
      if (active) {
        scene.add(root);
        root.add(marker);
      } else {
        root.removeFromParent();
        marker.removeFromParent();
      }
    }
  }

  constructor(components: Components) {
    this.components = components;
    this.resetBounds();
    this.createPlaneOutlineGeometry();
    if (components.uiEnabled) {
      this.setUI(components);
    }
  }

  async dispose() {
    this.planClicked.reset();
    this.visible = false;
    for (const id in this._objects) {
      const { marker, button, outline, root, plane } = this._objects[id];
      await button.dispose();
      outline.removeFromParent();
      (outline.geometry as any) = null;
      outline.material = [];
      root.removeFromParent();
      root.children = [];
      plane.removeFromParent();
      plane.material = [];
      (plane.geometry as any) = null;
      marker.element.remove();
    }
    this._objects = {};
    this._planeGeometry.dispose();
    this._material.dispose();
    this.uiElement.dispose();
    this.lineMaterial.dispose();
    this._material.dispose();
    (this.components as any) = null;
  }

  add(config: PlanView) {
    const { id, point, name } = config;
    const root = new THREE.Group();
    root.position.copy(point);

    const plane = new THREE.Mesh(this._planeGeometry, this._material);
    plane.rotation.x = -Math.PI / 2;
    root.add(plane);

    const outline = new THREE.LineSegments(
      this._linesGeometry,
      this.lineMaterial
    );

    outline.computeLineDistances();
    outline.rotation.x = -Math.PI / 2;
    root.add(outline);

    const button = new Button(this.components, {
      materialIconName: "location_on",
      tooltip: name,
    });

    button.onClick.add(async () => {
      await this.planClicked.trigger({ id: config.id });
    });

    const { domElement } = button;

    domElement.classList.remove("bg-transparent");
    domElement.className += " transition-none rounded-full";

    // element.className = this.pointClass;
    const marker = new CSS2DObject(domElement);
    root.add(marker);

    this._objects[id] = { root, plane, outline, marker, button };
  }

  setBounds(points: THREE.Vector3[], override = false) {
    if (override) {
      this.resetBounds();
    }
    const bbox = FragmentBoundingBox.getBounds(points, this._min, this._max);
    this._min = bbox.min;
    this._max = bbox.max;
    const dimensions = FragmentBoundingBox.getDimensions(bbox);
    const { width, depth, center } = dimensions;
    const offset = (width + depth / 2) * this.offsetFactor;

    const newScale = new THREE.Vector2(width + offset, depth + offset);
    const previousScaleMatrix = this.newScaleMatrix(this._scale);
    const newScaleMatrix = this.newScaleMatrix(newScale);
    previousScaleMatrix.invert();
    this._planeGeometry.applyMatrix4(previousScaleMatrix);
    this._linesGeometry.applyMatrix4(previousScaleMatrix);
    this._planeGeometry.applyMatrix4(newScaleMatrix);
    this._linesGeometry.applyMatrix4(newScaleMatrix);

    for (const id in this._objects) {
      const { root, outline } = this._objects[id];
      outline.computeLineDistances();
      root.position.x = center.x;
      root.position.z = center.z;
    }
  }

  private setUI(components: Components) {
    const button = new Button(components, {
      materialIconName: "layers",
      tooltip: "3D Plans",
    });
    button.onClick.add(() => {
      this.visible = !this.visible;
    });
    this.uiElement.set({ main: button });
  }

  private resetBounds() {
    this._min = FragmentBoundingBox.newBound(true);
    this._max = FragmentBoundingBox.newBound(false);
  }

  private newScaleMatrix(scale: THREE.Vector2) {
    const { x, y } = scale;
    // prettier-ignore
    return new THREE.Matrix4().fromArray([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
  }

  private createPlaneOutlineGeometry() {
    // prettier-ignore
    const vertices = new Float32Array([
        -0.5, -0.5, 0,
        -0.5, 0.5, 0,
        -0.5, 0.5, 0,
        0.5, 0.5, 0,
        0.5, 0.5, 0,
        0.5, -0.5, 0,
        0.5, -0.5, 0,
        -0.5, -0.5, 0,
    ]);

    const posAttr = new THREE.BufferAttribute(vertices, 3);
    this._linesGeometry.setAttribute("position", posAttr);
  }
}
