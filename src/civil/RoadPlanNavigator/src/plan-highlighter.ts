import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { CurveHighlighter } from "../../RoadNavigator/src/curve-highlighter";

export class PlanHighlighter extends CurveHighlighter {
  constructor(scene: THREE.Group | THREE.Scene) {
    super(scene);
  }

  testMaterial = new THREE.LineBasicMaterial({
    color: 0x424242,
    linewidth: 5,
  });

  calculateTangent(positions: THREE.TypedArray, index: number) {
    const numComponents = 3; // Coordenadas en 3D (x, y, z)
    const pointIndex = index * numComponents;
    const prevPointIndex = Math.max(0, pointIndex - numComponents);
    const nextPointIndex = Math.min(
      positions.length - numComponents,
      pointIndex + numComponents
    );
    const prevPoint = new THREE.Vector3(
      positions[prevPointIndex],
      positions[prevPointIndex + 1],
      positions[prevPointIndex + 2]
    );
    const nextPoint = new THREE.Vector3(
      positions[nextPointIndex],
      positions[nextPointIndex + 1],
      positions[nextPointIndex + 2]
    );
    const tangent = nextPoint.clone().sub(prevPoint).normalize();
    return tangent;
  }

  showCurveInfo(curveMesh: FRAGS.CurveMesh) {
    this.highlight(curveMesh);

    if (curveMesh.curve.data.TYPE === "LINE") {
      this.showLineInfo(curveMesh);
    }

    if (curveMesh.curve.data.TYPE === "CIRCULARARC") {
      this.showCircularArcInfo(curveMesh);
    }

    if (curveMesh.curve.data.TYPE === "CLOTHOID") {
      this.showClothoidInfo(curveMesh);
    }
  }

  showLineInfo(curveMesh: FRAGS.CurveMesh) {
    console.log("ES LINE");
    console.log(curveMesh);

    const positions = curveMesh.geometry.attributes.position.array;
    const count = curveMesh.geometry.attributes.position.count;
    const parallelCurvePoints = [];
    for (let i = 0; i < count; i++) {
      const tangentVector = this.calculateTangent(positions, i);
      // const length = curveMesh.curve.data.LENGTH;
      const perpendicularVector = new THREE.Vector3(
        tangentVector.y,
        -tangentVector.x,
        0
      );
      perpendicularVector.normalize();
      const distance = 10; // Adjust as needed
      const offsetVector = perpendicularVector.clone().multiplyScalar(distance);
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
    const lengthLine = new THREE.Line(lengthGeometry, this.testMaterial);

    this.scene.add(lengthLine);
  }

  showCircularArcInfo(curveMesh: FRAGS.CurveMesh) {
    console.log("ES CIRCULARARC");
    console.log(curveMesh);

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
    // createLabel(text: string, curve: FRAGS.CivilCurve, type: string)

    const testGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const radiusLine = new THREE.Line(testGeometry, this.testMaterial);

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
      // Ensure the normal vector points outward
      if (radius < 0) {
        perpendicularVector.negate();
      }
      const distance = 10; // Adjust as needed
      const offsetVector = perpendicularVector.clone().multiplyScalar(distance);
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
    const lengthLine = new THREE.Line(lengthGeometry, this.testMaterial);

    this.scene.add(radiusLine, lengthLine);
  }

  showClothoidInfo(curveMesh: FRAGS.CurveMesh) {
    console.log("ES CLOTHOID");
    console.log(curveMesh);

    }
  }
}
