import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { CurveHighlighter } from "../../CivilNavigator/src/curve-highlighter";
import { KPManager } from "../../CivilNavigator/src/kp-manager";

export class PlanHighlighter extends CurveHighlighter {
  private readonly markupMaterial: THREE.LineBasicMaterial;
  private offset: number = 10;
  private markupLines: THREE.Line[] = [];
  private currentCurveMesh?: FRAGS.CurveMesh;

  constructor(scene: THREE.Group | THREE.Scene, kpManager: KPManager) {
    super(scene, "horizontal", kpManager);
    this.markupMaterial = new THREE.LineBasicMaterial({
      color: 0x686868,
    });
  }

  showCurveInfo(curveMesh: FRAGS.CurveMesh): void {
    this.disposeMarkups();
    this.currentCurveMesh = curveMesh;

    switch (curveMesh.curve.data.TYPE) {
      case "LINE":
        this.showLineInfo(curveMesh, this.offset);
        break;
      case "CIRCULARARC":
        this.showCircularArcInfo(curveMesh, this.offset);
        break;
      case "CLOTHOID":
        this.showClothoidInfo(curveMesh, this.offset);
        break;
      default:
        console.log("Unknown curve type:", curveMesh.curve.data.TYPE);
        break;
    }
  }

  updateOffset(
    screenSize: {
      height: number;
      width: number;
    },
    _zoom: number,
    _triggerRedraw: boolean,
  ) {
    const biggerSize = Math.max(screenSize.height, screenSize.width);
    const newOffset = biggerSize / (_zoom * 150);
    if (newOffset !== this.offset) {
      this.offset = newOffset;
      if (_triggerRedraw && this.currentCurveMesh) {
        this.showCurveInfo(this.currentCurveMesh);
      }
    }
  }

  dispose() {
    super.dispose();
    for (const line of this.markupLines) {
      this.scene.remove(line);
      line.removeFromParent();
    }
    this.disposeMarkups();
    this.markupMaterial.dispose();
  }

  private disposeMarkups(): void {
    for (const line of this.markupLines) {
      line.geometry.dispose();
      this.scene.remove(line);
    }
    this.markupLines = [];
  }

  unSelect(): void {
    super.unSelect();
    this.disposeMarkups();
  }

  private calculateTangent(
    positions: THREE.TypedArray,
    index: number,
  ): THREE.Vector3 {
    const numComponents = 3;
    const pointIndex = index * numComponents;
    const prevPointIndex = Math.max(0, pointIndex - numComponents);
    const nextPointIndex = Math.min(
      positions.length - numComponents,
      pointIndex + numComponents,
    );
    const prevPoint = new THREE.Vector3().fromArray(positions, prevPointIndex);
    const nextPoint = new THREE.Vector3().fromArray(positions, nextPointIndex);
    const tangent = nextPoint.clone().sub(prevPoint).normalize();
    return tangent;
  }

  private calculateParallelCurve(
    positions: THREE.TypedArray,
    count: number,
    offset: number,
  ): THREE.Vector3[] {
    const parallelCurvePoints = [];
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

  private calculateDimensionLines(
    curve: FRAGS.CurveMesh,
    line: THREE.Line,
  ): {
    startDimensionPoints: THREE.Vector3[];
    endDimensionPoints: THREE.Vector3[];
  } {
    const startDimensionPoints = [];
    const curvePositions = curve.geometry.attributes.position.array;
    const linePositions = line.geometry.attributes.position.array;
    if (curvePositions.length < 6 && linePositions.length < 6) {
      throw new Error("Line must have at least two vertices");
    }
    const startCurvePoint = new THREE.Vector3(
      curvePositions[0],
      curvePositions[1],
      curvePositions[2],
    );
    const startLinePoint = new THREE.Vector3(
      linePositions[0],
      linePositions[1],
      linePositions[2],
    );
    const endDimensionPoints = [];
    const lastCurveIndex = curvePositions.length - 3;
    const endCurvePoint = new THREE.Vector3(
      curvePositions[lastCurveIndex],
      curvePositions[lastCurveIndex + 1],
      curvePositions[lastCurveIndex + 2],
    );
    const lastLineIndex = linePositions.length - 3;
    const endLinePoint = new THREE.Vector3(
      linePositions[lastLineIndex],
      linePositions[lastLineIndex + 1],
      linePositions[lastLineIndex + 2],
    );
    startDimensionPoints.push(startCurvePoint, startLinePoint);
    endDimensionPoints.push(endCurvePoint, endLinePoint);
    return { startDimensionPoints, endDimensionPoints };
  }

  private offsetDimensionLine(points: THREE.Vector3[], offset: number) {
    const direction = new THREE.Vector3()
      .copy(points[points.length - 1])
      .sub(points[0])
      .normalize();
    const offsetVector = direction.clone().multiplyScalar(offset);
    const newPoints = points.map((point) => point.clone().add(offsetVector));
    return newPoints;
  }

  private showLineInfo(curveMesh: FRAGS.CurveMesh, offset: number) {
    this.kpManager.clearMarkersByType("Length");
    this.kpManager.clearMarkersByType("Radius");
    const positions = curveMesh.geometry.attributes.position.array;
    const parallelCurvePoints = this.calculateParallelCurve(
      positions,
      positions.length / 3,
      offset,
    );
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(
      parallelCurvePoints,
    );
    const lineParallelLine = new THREE.Line(
      lengthGeometry,
      this.markupMaterial,
    );
    this.kpManager.showLineLength(
      lineParallelLine,
      curveMesh.curve.getLength(),
    );
    this.scene.add(lineParallelLine);
    this.markupLines.push(lineParallelLine);
    const { startDimensionPoints, endDimensionPoints } =
      this.calculateDimensionLines(curveMesh, lineParallelLine);
    const offsetStartDimensionPoints = this.offsetDimensionLine(
      startDimensionPoints,
      offset * 0.1,
    );
    const offsetEndDimensionPoints = this.offsetDimensionLine(
      endDimensionPoints,
      offset * 0.1,
    );
    const startDimensionGeometry = new THREE.BufferGeometry().setFromPoints(
      offsetStartDimensionPoints,
    );
    const endDimensionGeometry = new THREE.BufferGeometry().setFromPoints(
      offsetEndDimensionPoints,
    );
    const lineStartDimensionlLine = new THREE.Line(
      startDimensionGeometry,
      this.markupMaterial,
    );
    this.scene.add(lineStartDimensionlLine);
    this.markupLines.push(lineStartDimensionlLine);
    const lineEndDimensionlLine = new THREE.Line(
      endDimensionGeometry,
      this.markupMaterial,
    );
    this.scene.add(lineEndDimensionlLine);
    this.markupLines.push(lineEndDimensionlLine);
  }

  private showClothoidInfo(curveMesh: FRAGS.CurveMesh, offset: number) {
    this.kpManager.clearMarkersByType("Length");
    this.kpManager.clearMarkersByType("Radius");
    const positions = curveMesh.geometry.attributes.position.array;
    const parallelCurvePoints = this.calculateParallelCurve(
      positions,
      positions.length / 3,
      offset,
    );
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(
      parallelCurvePoints,
    );
    this.kpManager.showCurveLength(
      parallelCurvePoints,
      curveMesh.curve.getLength(),
    );
    const clothParallelLine = new THREE.Line(
      lengthGeometry,
      this.markupMaterial,
    );
    this.scene.add(clothParallelLine);
    this.markupLines.push(clothParallelLine);
    const { startDimensionPoints, endDimensionPoints } =
      this.calculateDimensionLines(curveMesh, clothParallelLine);
    const offsetStartDimensionPoints = this.offsetDimensionLine(
      startDimensionPoints,
      offset * 0.1,
    );
    const offsetEndDimensionPoints = this.offsetDimensionLine(
      endDimensionPoints,
      offset * 0.1,
    );
    const startDimensionGeometry = new THREE.BufferGeometry().setFromPoints(
      offsetStartDimensionPoints,
    );
    const endDimensionGeometry = new THREE.BufferGeometry().setFromPoints(
      offsetEndDimensionPoints,
    );
    const clothStartDimensionLine = new THREE.Line(
      startDimensionGeometry,
      this.markupMaterial,
    );
    this.scene.add(clothStartDimensionLine);
    this.markupLines.push(clothStartDimensionLine);
    const clothEndDimensionLine = new THREE.Line(
      endDimensionGeometry,
      this.markupMaterial,
    );
    this.scene.add(clothEndDimensionLine);
    this.markupLines.push(clothEndDimensionLine);
  }

  private showCircularArcInfo(curveMesh: FRAGS.CurveMesh, offset: number) {
    this.kpManager.clearMarkersByType("Length");
    this.kpManager.clearMarkersByType("Radius");
    const radius = curveMesh.curve.data.RADIUS;
    const positions = curveMesh.geometry.attributes.position.array;
    const count = curveMesh.geometry.attributes.position.count;
    const linePoints = [];
    const firstPoint = new THREE.Vector3(
      positions[0],
      positions[1],
      positions[2],
    );
    const lastPointIndex = (count - 1) * 3;
    const lastPoint = new THREE.Vector3(
      positions[lastPointIndex],
      positions[lastPointIndex + 1],
      positions[lastPointIndex + 2],
    );
    const middlePointIndex = (count / 2) * 3;
    const middlePoint = new THREE.Vector3(
      positions[middlePointIndex],
      positions[middlePointIndex + 1],
      positions[middlePointIndex + 2],
    );
    const tangentVector = lastPoint.clone().sub(firstPoint).normalize();
    const perpendicularVector = new THREE.Vector3(
      -tangentVector.y,
      tangentVector.x,
      0,
    );
    perpendicularVector.multiplyScalar(radius);
    const arcCenterPoint = middlePoint.clone().add(perpendicularVector);
    linePoints.push(middlePoint);
    linePoints.push(arcCenterPoint);
    const radiusGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const radiusLine = new THREE.Line(radiusGeometry, this.markupMaterial);
    this.kpManager.showCurveRadius(radiusLine, Math.abs(radius));
    this.scene.add(radiusLine);
    this.markupLines.push(radiusLine);

    const parallelCurvePoints = [];
    for (let i = 0; i < count; i++) {
      const tangentVector = this.calculateTangent(positions, i);
      const radius = curveMesh.curve.data.RADIUS;
      const perpendicularVector = new THREE.Vector3(
        tangentVector.y,
        -tangentVector.x,
        0,
      );
      perpendicularVector.normalize();
      if (radius < 0) {
        perpendicularVector.negate();
      }
      const offsetVector = perpendicularVector.clone().multiplyScalar(offset);
      const pointIndex = i * 3;
      const parallelPoint = new THREE.Vector3(
        positions[pointIndex] + offsetVector.x,
        positions[pointIndex + 1] + offsetVector.y,
        positions[pointIndex + 2] + offsetVector.z,
      );
      parallelCurvePoints.push(parallelPoint);
    }
    const lengthGeometry = new THREE.BufferGeometry().setFromPoints(
      parallelCurvePoints,
    );
    this.kpManager.showCurveLength(
      parallelCurvePoints,
      curveMesh.curve.getLength(),
    );
    const circArcParallelLine = new THREE.Line(
      lengthGeometry,
      this.markupMaterial,
    );
    this.scene.add(circArcParallelLine);
    this.markupLines.push(circArcParallelLine);
    const { startDimensionPoints, endDimensionPoints } =
      this.calculateDimensionLines(curveMesh, circArcParallelLine);

    const offsetStartDimensionPoints = this.offsetDimensionLine(
      startDimensionPoints,
      offset * 0.1,
    );
    const offsetEndDimensionPoints = this.offsetDimensionLine(
      endDimensionPoints,
      offset * 0.1,
    );
    const startDimensionGeometry = new THREE.BufferGeometry().setFromPoints(
      offsetStartDimensionPoints,
    );
    const endDimensionGeometry = new THREE.BufferGeometry().setFromPoints(
      offsetEndDimensionPoints,
    );
    const circArcStartDimensionlLine = new THREE.Line(
      startDimensionGeometry,
      this.markupMaterial,
    );
    this.scene.add(circArcStartDimensionlLine);
    this.markupLines.push(circArcStartDimensionlLine);
    const circArcEndDimensionlLine = new THREE.Line(
      endDimensionGeometry,
      this.markupMaterial,
    );
    this.scene.add(circArcEndDimensionlLine);
    this.markupLines.push(circArcEndDimensionlLine);
  }
}
