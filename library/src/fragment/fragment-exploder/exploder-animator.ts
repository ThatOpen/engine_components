import * as THREE from "three";

export class ExploderAnimator {
  offset = 0;
  factor = 1;
  tempMatrix = new THREE.Matrix4();
  fragment: any;
  id = "";
  height = 10;

  constructor() {}
  get y() {
    return this.offset;
  }

  set y(value: number) {
    this.offset = value;
    const yTransform = this.getOffsetY(value * this.factor);
    if (this.fragment.blocks.count === 1) {
      const { instanceID } = this.fragment.getInstanceAndBlockID(this.id);
      this.fragment.getInstance(instanceID, this.tempMatrix);
      this.tempMatrix.premultiply(yTransform);
      this.fragment.setInstance(instanceID, {
        transform: this.tempMatrix,
        ids: [this.id],
      });
    } else {
      // For merged fragments
      this.fragment.getInstance(0, this.tempMatrix);
      this.tempMatrix.premultiply(yTransform);
      this.fragment.setInstance(0, {
        transform: this.tempMatrix,
        ids: this.fragment.items,
      });
    }
  }

  private getOffsetY(y: number) {
    return new THREE.Matrix4().fromArray([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      y * this.height,
      0,
      1,
    ]);
  }
}
