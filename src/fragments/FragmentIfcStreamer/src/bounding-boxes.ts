import * as THREE from "three";

export class BoundingBoxes {
  mesh: THREE.InstancedMesh;

  resizeStep = 1000;

  private _capacity = 1000;
  private _m1 = new THREE.Matrix4();
  private _m2 = new THREE.Matrix4();
  private _color = new THREE.Color();

  get capacity() {
    return this._capacity;
  }

  constructor() {
    this.mesh = this.initializeBoundingBoxes();
  }

  add(bbox: number[], transformation: number[], color: number[]) {
    if (this.mesh.count === this._capacity) {
      this.resizeBoundingBoxes();
    }

    this._m1.fromArray(transformation);
    this._m2.fromArray(bbox);
    this._m1.multiply(this._m2);

    const count = this.mesh.count;
    this.mesh.setMatrixAt(count, this._m1);

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
    this._capacity += this.resizeStep;
    const { geometry, material } = this.mesh;
    const parent = this.mesh.parent;
    this.mesh.removeFromParent();
    const newBoundingBox = new THREE.InstancedMesh(
      geometry,
      material,
      this._capacity
    );

    newBoundingBox.frustumCulled = false;
    this.initializeBboxColor(newBoundingBox);

    if (!this.mesh.instanceColor) {
      throw new Error("Error with bounding box color!");
    }

    const tempMatrix = new THREE.Matrix4();
    for (let i = 0; i < this.mesh.instanceMatrix.count; i++) {
      this.mesh.getMatrixAt(i, tempMatrix);
      newBoundingBox.setMatrixAt(i, tempMatrix);
    }

    const tempColor = new THREE.Color();
    for (let i = 0; i < this.mesh.instanceColor.count; i++) {
      this.mesh.getColorAt(i, tempColor);
      newBoundingBox.setColorAt(i, tempColor);
    }

    newBoundingBox.count = this.mesh.count;

    this.mesh.geometry = null as any;
    this.mesh.material = null as any;
    this.mesh.dispose();
    this.mesh = newBoundingBox;
    // this.components.scene.get().add(newBoundingBox);
    if (parent) {
      parent.add(newBoundingBox);
    }
  }

  getMesh() {
    this.mesh.computeBoundingBox();
    const { min, max } = this.mesh.boundingBox as THREE.Box3;
    const width = Math.abs(max.x - min.x);
    const height = Math.abs(max.y - min.y);
    const depth = Math.abs(max.z - min.z);
    const center = new THREE.Vector3();
    center.subVectors(max, min).divideScalar(2).add(min);
    const box = new THREE.BoxGeometry(width, height, depth);
    const boxMesh = new THREE.Mesh(box);
    boxMesh.position.copy(center);
    return boxMesh;
  }

  getSphere() {
    this.mesh.computeBoundingSphere();
    return this.mesh.boundingSphere;
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

    const bbox = new THREE.InstancedMesh(geometry, material, this._capacity);
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
