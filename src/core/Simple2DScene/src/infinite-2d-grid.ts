import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

/**
 * An infinite lightweight 2D grid that can be used for any
 * kind of 2d viewports.
 */
export class Infinite2dGrid {
  grids: {
    main: THREE.LineSegments;
    secondary: THREE.LineSegments;
  };

  numbers = new THREE.Group();

  maxRegenerateRetrys = 4;

  gridsFactor = 5;

  scaleX = 1;
  scaleY = 1;

  private _group = new THREE.Group();
  private _frustum = new THREE.Frustum();
  private _frustumMat = new THREE.Matrix4();
  private _camera: THREE.Camera;
  private _container: HTMLElement;

  private _regenerateDelay = 200;
  private _regenerateCounter = 0;

  constructor(camera: THREE.Camera, container: HTMLElement) {
    this._camera = camera;
    this._container = container;

    const main = this.newGrid(0x222222, -1);
    const secondary = this.newGrid(0x111111, -2);
    this.grids = { main, secondary };

    this._group.add(secondary, main, this.numbers);
  }

  get() {
    return this._group;
  }

  dispose() {
    const { main, secondary } = this.grids;
    main.removeFromParent();
    secondary.removeFromParent();
    main.geometry.dispose();
    const mMat = main.material as THREE.LineBasicMaterial;
    mMat.dispose();
    secondary.geometry.dispose();
    const sMat = secondary.material as THREE.LineBasicMaterial;
    sMat.dispose();
  }

  regenerate() {
    const isReady = this.isGridReady();
    if (!isReady) {
      this._regenerateCounter++;
      if (this._regenerateCounter > this.maxRegenerateRetrys) {
        throw new Error("Grid could not be regenerated");
      }
      setTimeout(() => this.regenerate, this._regenerateDelay);
      return;
    }
    this._regenerateCounter = 0;

    const matrix = this._frustumMat.multiplyMatrices(
      this._camera.projectionMatrix,
      this._camera.matrixWorldInverse
    );
    this._frustum.setFromProjectionMatrix(matrix);

    // Step 1: find out the distance of the visible area of the 2D scene
    // and the translation pixel / 3d unit

    const { planes } = this._frustum;
    const right = planes[0].constant * -planes[0].normal.x;
    const left = planes[1].constant * -planes[1].normal.x;
    const bottom = planes[2].constant * -planes[2].normal.y;
    const top = planes[3].constant * -planes[3].normal.y;
    const horizontalDistance = Math.abs(right - left);
    const verticalDistance = Math.abs(top - bottom);

    const { clientWidth, clientHeight } = this._container;
    const maxPixelDist = Math.max(clientWidth, clientHeight);
    const maxUnit3dDist = Math.max(horizontalDistance, verticalDistance);
    const unit3dPixelRel = maxUnit3dDist / maxPixelDist;

    // Step 2: find out its order of magnitude

    const magnitudeX = Math.ceil(Math.log10(horizontalDistance / this.scaleX));
    const magnitudeY = Math.ceil(Math.log10(verticalDistance / this.scaleY));

    // Step 3: represent main grid
    const sDistanceHor = 10 ** (magnitudeX - 2) * this.scaleX;
    const sDistanceVert = 10 ** (magnitudeY - 2) * this.scaleY;
    const mDistanceHor = sDistanceHor * this.gridsFactor;
    const mDistanceVert = sDistanceVert * this.gridsFactor;

    const mainGridCountVert = Math.ceil(verticalDistance / mDistanceVert);
    const mainGridCountHor = Math.ceil(horizontalDistance / mDistanceHor);
    const secondaryGridCountVert = Math.ceil(verticalDistance / sDistanceVert);
    const secondaryGridCountHor = Math.ceil(horizontalDistance / sDistanceHor);

    // Step 4: find out position of first lines
    const sTrueLeft = sDistanceHor * Math.ceil(left / sDistanceHor);
    const sTrueBottom = sDistanceVert * Math.ceil(bottom / sDistanceVert);
    const mTrueLeft = mDistanceHor * Math.ceil(left / mDistanceHor);
    const mTrueBottom = mDistanceVert * Math.ceil(bottom / mDistanceVert);

    // Step 5: draw lines and texts
    const numbers = [...this.numbers.children];
    for (const number of numbers) {
      number.removeFromParent();
    }
    this.numbers.children = [];

    const mPoints = [];

    const realWidthPerCharacter = 9 * unit3dPixelRel; // 9 pixels per char

    const p = 10000;

    // Avoid horizontal text overlap by computing the real width of a text
    // and computing which lines should have a label starting from zero
    const minLabel = Math.round(Math.abs(mTrueLeft / this.scaleX) * p) / p;
    const maxDist = (mainGridCountHor - 1) * mDistanceHor;
    const maxLabel =
      Math.round(Math.abs((mTrueLeft + maxDist) / this.scaleX) * p) / p;
    const biggestLabelLength = Math.max(minLabel, maxLabel).toString().length;
    const biggestLabelSize = biggestLabelLength * realWidthPerCharacter;
    const cellsOccupiedByALabel = Math.ceil(biggestLabelSize / mDistanceHor);
    let offsetToZero = cellsOccupiedByALabel * mDistanceHor;

    for (let i = 0; i < mainGridCountHor; i++) {
      let offset = mTrueLeft + i * mDistanceHor;
      mPoints.push(offset, top, 0, offset, bottom, 0);

      const value = offset / this.scaleX;

      offset = Math.round(offset * p) / p;
      offsetToZero = Math.round(offsetToZero * p) / p;
      const result = offset % offsetToZero;

      // TODO: Removing horizontal labels for clarity doesn't work for small distances
      const isSmall = mDistanceHor < 1 || mDistanceVert < 1;

      if (!isSmall && Math.abs(result) > 0.01) {
        continue;
      }

      const sign = this.newNumber(value);
      const textOffsetPixels = 12;
      const textOffset = textOffsetPixels * unit3dPixelRel;
      sign.position.set(offset, bottom + textOffset, 0);
    }
    for (let i = 0; i < mainGridCountVert; i++) {
      const offset = mTrueBottom + i * mDistanceVert;
      mPoints.push(left, offset, 0, right, offset, 0);
      const sign = this.newNumber(offset / this.scaleY);
      let textOffsetPixels = 12;
      if (sign.element.textContent) {
        textOffsetPixels += 4 * sign.element.textContent.length;
      }
      const textOffset = textOffsetPixels * unit3dPixelRel;
      sign.position.set(left + textOffset, offset, 0);
    }

    const sPoints = [];
    for (let i = 0; i < secondaryGridCountHor; i++) {
      const offset = sTrueLeft + i * sDistanceHor;
      sPoints.push(offset, top, 0, offset, bottom, 0);
    }
    for (let i = 0; i < secondaryGridCountVert; i++) {
      const offset = sTrueBottom + i * sDistanceVert;
      sPoints.push(left, offset, 0, right, offset, 0);
    }

    const mBuffer = new THREE.BufferAttribute(new Float32Array(mPoints), 3);
    const sBuffer = new THREE.BufferAttribute(new Float32Array(sPoints), 3);
    const { main, secondary } = this.grids;
    main.geometry.setAttribute("position", mBuffer);
    secondary.geometry.setAttribute("position", sBuffer);
  }

  private newNumber(offset: number) {
    const text = document.createElement("div");
    const formattedNumber = Math.round(offset * 100) / 100;
    text.textContent = `${formattedNumber}`;
    text.style.height = "24px";
    text.style.fontSize = "12px";
    const sign = new CSS2DObject(text);
    this.numbers.add(sign);
    return sign;
  }

  private newGrid(color: number, renderOrder: number) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color });
    const grid = new THREE.LineSegments(geometry, material);
    grid.frustumCulled = false;
    grid.renderOrder = renderOrder;
    return grid;
  }

  private isGridReady() {
    const nums = this._camera.projectionMatrix.elements;
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      if (Number.isNaN(num)) {
        return false;
      }
    }
    return true;
  }
}
