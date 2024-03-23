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
      console.log("First Point:", firstPoint);
      console.log("Last Point:", lastPoint);
      console.log("Middle Point:", middlePoint);
      const secondPoint = new THREE.Vector3(
        positions[3],
        positions[4],
        positions[5]
      );
      const thirdPoint = new THREE.Vector3(
        positions[6],
        positions[7],
        positions[8]
      );
      const line1 = new THREE.Line3(firstPoint, secondPoint);
      const line2 = new THREE.Line3(secondPoint, thirdPoint);

      const delta1 = line1.end.clone().sub(line1.start);
      const delta2 = line2.end.clone().sub(line2.start);
      const angleBetweenSegments = delta1.angleTo(delta2);
      const halfAngle = angleBetweenSegments / 2;
      const angleDirection = Math.atan2(delta2.y, delta2.x) + halfAngle;
      const endPointX = secondPoint.x + radius * Math.cos(angleDirection);
      const endPointY = secondPoint.y + radius * Math.sin(angleDirection);
      const endPointZ = secondPoint.z;
      const arcCenterPoint = new THREE.Vector3(endPointX, endPointY, endPointZ);
      console.log("Center of the arc:", arcCenterPoint);
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
