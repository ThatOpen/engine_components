import * as THREE from "three";

export class BoundingBoxes {
  mesh: THREE.InstancedMesh;

  resizeStep = 1000;
  capacity = 1000;

  private _globalTransform = new THREE.Matrix4();
  private _geometryTransform = new THREE.Matrix4();
  private _translation = new THREE.Matrix4();
  private _scale = new THREE.Matrix4();
  private _color = new THREE.Color();

  constructor() {
    this.mesh = this.initializeBoundingBoxes();
  }

  add(bbox: number[], transformation: number[], color: number[]) {
    if (this.mesh.count === this.capacity) {
      this.resizeBoundingBoxes();
    }

    this._globalTransform.fromArray(transformation);
    this._geometryTransform.identity();

    const [minX, minY, minZ, maxX, maxY, maxZ] = bbox;

    this._translation.makeTranslation(minX, minY, minZ);

    const scaleX = Math.abs(maxX - minX);
    const scaleY = Math.abs(maxY - minY);
    const scaleZ = Math.abs(maxZ - minZ);

    this._scale.makeScale(scaleX, scaleY, scaleZ);

    this._geometryTransform.multiply(this._globalTransform);
    this._geometryTransform.multiply(this._translation);
    this._geometryTransform.multiply(this._scale);

    const count = this.mesh.count;
    this.mesh.setMatrixAt(count, this._geometryTransform);

    const [r, g, b] = color;
    this._color.set(`rgb(${r}, ${g}, ${b})`);
    this.mesh.setColorAt(count, this._color);

    this.mesh.count++;
  }

  update() {
    const { instanceMatrix, instanceColor } = this.mesh;
    instanceMatrix.needsUpdate = true;
    if (instanceColor) {
      instanceColor.needsUpdate = true;
    }
  }

  setVisibility() {}

  private resizeBoundingBoxes() {
    this.capacity += this.resizeStep;
    const { geometry, material } = this.mesh;
    const parent = this.mesh.removeFromParent();
    this.mesh.removeFromParent();
    const newBoundingBox = new THREE.InstancedMesh(
      geometry,
      material,
      this.capacity
    );
    newBoundingBox.frustumCulled = false;
    this.initializeBboxColor(newBoundingBox);
    newBoundingBox.count = this.mesh.count;

    const { instanceMatrix, instanceColor } = this.mesh;
    if (!instanceColor) {
      throw new Error("Error with bounding box color!");
    }

    newBoundingBox.instanceMatrix = instanceMatrix.clone() as any;
    newBoundingBox.instanceColor = instanceColor.clone() as any;
    this.mesh.geometry = null as any;
    this.mesh.material = null as any;
    this.mesh.dispose();
    this.mesh = newBoundingBox;
    // this.components.scene.get().add(newBoundingBox);
    parent.add(newBoundingBox);
  }

  private initializeBoundingBoxes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.deleteAttribute("uv");
    const position = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < position.length; i++) {
      position[i] += 0.5;
    }
    geometry.attributes.position.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
    });

    const bbox = new THREE.InstancedMesh(geometry, material, this.capacity);
    bbox.frustumCulled = false;
    this.initializeBboxColor(bbox);
    bbox.count = 0;
    return bbox;
  }

  private initializeBboxColor(bbox: THREE.InstancedMesh) {
    const color = new THREE.Color("rgb(255, 0, 0)");
    for (let i = 0; i < bbox.count; i++) {
      bbox.setColorAt(i, color);
    }
  }
}
