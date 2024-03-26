import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { CurveHighlighter } from "../../RoadNavigator/src/curve-highlighter";

export class PlanHighlighter extends CurveHighlighter {
  private readonly markupMaterial: THREE.LineBasicMaterial;
  private readonly offset: number = 10;
  private markupLines: THREE.Line[] = [];

  constructor(scene: THREE.Group | THREE.Scene) {
    super(scene);
    this.markupMaterial = new THREE.LineBasicMaterial({
      color: 0x686868,
    });
  }

  private calculateTangent(
    positions: THREE.TypedArray,
    index: number
  ): THREE.Vector3 {
    const numComponents = 3;
    const pointIndex = index * numComponents;
    const prevPointIndex = Math.max(0, pointIndex - numComponents);
    const nextPointIndex = Math.min(
      positions.length - numComponents,
      pointIndex + numComponents
    );
    const prevPoint = new THREE.Vector3().fromArray(positions, prevPointIndex);
    const nextPoint = new THREE.Vector3().fromArray(positions, nextPointIndex);
    const tangent = nextPoint.clone().sub(prevPoint).normalize();
    return tangent;
  }

  private calculateParallelCurve(
    positions: THREE.TypedArray,
    count: number,
    offset: number
  ): THREE.Vector3[] {
    const parallelCurvePoints = [];
    console.log(offset);
    for (let i = 0; i < count; i++) {
      const tangentVector = this.calculateTangent(positions, i);
      const perpendicularVector = tangentVector
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
      perpendicularVector.normalize();
      const offsetVector = perpendicularVector.clone().multiplyScalar(offset);
      const pointIndex = i * 3;
      const parallelPoint = new THREE.Vector3()
        .fromArray(positions, pointIndex)
        .add(offsetVector);
      parallelCurvePoints.push(parallelPoint);
    }
    return parallelCurvePoints;
  }

  public showCurveInfo(curveMesh: FRAGS.CurveMesh): void {
    this.clearMarkups();
    this.highlight(curveMesh);

    // eslint-disable-next-line default-case
    switch (curveMesh.curve.data.TYPE) {
      case "LINE":
        this.showLineInfo(curveMesh);
        break;
      case "CIRCULARARC":
        this.showCircularArcInfo(curveMesh);
        break;
      case "CLOTHOID":
        this.showClothoidInfo(curveMesh);
        break;
    }
  }

  private clearMarkups(): void {
    for (const line of this.markupLines) {
      this.scene.remove(line);
    }
    this.markupLines = [];
  }

  private addMarkupLine(geometry: THREE.BufferGeometry): void {
    const markupLine = new THREE.Line(geometry, this.markupMaterial);
    this.scene.add(markupLine);
    this.markupLines.push(markupLine);
  }

  showLineInfo(curveMesh: FRAGS.CurveMesh) {
    // console.log("ES LINE");
    // console.log(curveMesh);

    const positions = curveMesh.geometry.attributes.position.array;
    const parallelCurvePoints = this.calculateParallelCurve(
      positions,
      positions.length / 3,
      this.offset
    );
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(
      parallelCurvePoints
    );
    this.addMarkupLine(lengthGeometry);
  }

  showCircularArcInfo(curveMesh: FRAGS.CurveMesh) {
    // console.log("ES CIRCULARARC");
    // console.log(curveMesh);

    const radius = curveMesh.curve.data.RADIUS;
    const positions = curveMesh.geometry.attributes.position.array;
    const count = curveMesh.geometry.attributes.position.count;
    const linePoints = [];
    const firstPoint = new THREE.Vector3(
      positions[0],
      positions[1],
      positions[2]
    );
    const lastPointIndex = (count - 1) * 3;
    const lastPoint = new THREE.Vector3(
      positions[lastPointIndex],
      positions[lastPointIndex + 1],
      positions[lastPointIndex + 2]
    );
    const middlePointIndex = (count / 2) * 3;
    const middlePoint = new THREE.Vector3(
      positions[middlePointIndex],
      positions[middlePointIndex + 1],
      positions[middlePointIndex + 2]
    );
    const tangentVector = lastPoint.clone().sub(firstPoint).normalize();
    const perpendicularVector = new THREE.Vector3(
      -tangentVector.y,
      tangentVector.x,
      0
    );
    perpendicularVector.multiplyScalar(radius);
    const arcCenterPoint = middlePoint.clone().add(perpendicularVector);
    linePoints.push(middlePoint);
    linePoints.push(arcCenterPoint);
    const radiusGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    this.addMarkupLine(radiusGeometry);

    const parallelCurvePoints = [];
    for (let i = 0; i < count; i++) {
      const tangentVector = this.calculateTangent(positions, i);
      const radius = curveMesh.curve.data.RADIUS;
      const perpendicularVector = new THREE.Vector3(
        tangentVector.y,
        -tangentVector.x,
        0
      );
      perpendicularVector.normalize();
      if (radius < 0) {
        perpendicularVector.negate();
      }
      const offsetVector = perpendicularVector
        .clone()
        .multiplyScalar(this.offset);
      const pointIndex = i * 3;
      const parallelPoint = new THREE.Vector3(
        positions[pointIndex] + offsetVector.x,
        positions[pointIndex + 1] + offsetVector.y,
        positions[pointIndex + 2] + offsetVector.z
      );
      parallelCurvePoints.push(parallelPoint);
    }
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(
      parallelCurvePoints
    );
    this.addMarkupLine(lengthGeometry);
  }

  showClothoidInfo(curveMesh: FRAGS.CurveMesh) {
    // console.log("ES CLOTHOID");
    // console.log(curveMesh);
    const positions = curveMesh.geometry.attributes.position.array;
    const parallelCurvePoints = this.calculateParallelCurve(
      positions,
      positions.length / 3,
      this.offset
    );
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(
      parallelCurvePoints
    );
    this.addMarkupLine(lengthGeometry);
  }
}
