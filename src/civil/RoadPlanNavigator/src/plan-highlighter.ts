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

  showCurveInfo(curveMesh: FRAGS.CurveMesh) {
    this.highlight(curveMesh);
    const linePoints = [];
    if (curveMesh.curve.data.TYPE === "CIRCULARARC") {
      console.log("ES CIRCULARARC");
      console.log(curveMesh);
      const radius = curveMesh.curve.data.RADIUS;
      const positions = curveMesh.geometry.attributes.position.array;
      const count = curveMesh.geometry.attributes.position.count;
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
      const testGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const radiusLine = new THREE.Line(testGeometry, this.testMaterial);
      this.scene.add(radiusLine);
    }
    if (curveMesh.curve.data.TYPE === "CLOTHOID") {
      console.log("ES CLOTHOID");
      // logica de lineas
    }
  }
}
