import * as THREE from "three";
import { Component } from "../../../base-types";
import { StreamedAsset, StreamedGeometries } from "./base-types";
import { Components, ToolComponent } from "../../../core";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";

export class FragmentStreamLoader extends Component<any> {
  enabled = true;

  culler: GeometryCullerRenderer;

  private _boundingBoxes: THREE.InstancedMesh;

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentStreamLoader.uuid, this);
    const geometry = this.getBoundingBoxesGeometry();
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
    });
    this._boundingBoxes = new THREE.InstancedMesh(geometry, material, 1000);
    this._boundingBoxes.frustumCulled = false;
    this.components.scene.get().add(this._boundingBoxes);
    this.culler = new GeometryCullerRenderer(components);

    const color = new THREE.Color("rgb(255, 0, 0)");
    for (let i = 0; i < this._boundingBoxes.count; i++) {
      this._boundingBoxes.setColorAt(i, color);
    }
  }

  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  async load(assets: StreamedAsset[], geometries: StreamedGeometries) {
    let counter = 0;
    const geometryTransform = new THREE.Matrix4();
    const globalTransform = new THREE.Matrix4();
    const translation = new THREE.Matrix4();
    const inverseTranslation = new THREE.Matrix4();
    const scale = new THREE.Matrix4();
    const geometryIDs: number[] = [];
    const tempColor = new THREE.Color().setRGB(255, 0, 0);
    for (const asset of assets) {
      for (const geometryData of asset.geometries) {
        const { geometryID, transformation } = geometryData;
        geometryIDs.push(geometryID);
        globalTransform.fromArray(transformation);
        const { boundingBox } = geometries[geometryID];
        geometryTransform.identity();
        const [minX, minY, minZ, maxX, maxY, maxZ] = Object.values(boundingBox);
        // prettier-ignore
        translation.makeTranslation(minX, minY, minZ)
        inverseTranslation.copy(translation).invert();
        const scaleX = Math.abs(maxX - minX);
        const scaleY = Math.abs(maxY - minY);
        const scaleZ = Math.abs(maxZ - minZ);
        scale.makeScale(scaleX, scaleY, scaleZ);
        geometryTransform.multiply(globalTransform);
        geometryTransform.multiply(translation);
        geometryTransform.multiply(scale);
        this._boundingBoxes.setMatrixAt(counter, geometryTransform);
        this._boundingBoxes.setColorAt(counter, tempColor);
        counter++;
      }
    }
    this._boundingBoxes.count = counter;
    this._boundingBoxes.instanceMatrix.needsUpdate = true;
    this.culler.add("modelID", this._boundingBoxes, geometryIDs);
  }

  get() {}

  update() {}

  private getBoundingBoxesGeometry() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.deleteAttribute("uv");
    const position = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < position.length; i++) {
      position[i] += 0.5;
    }
    geometry.attributes.position.needsUpdate = true;
    return geometry;
  }
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
