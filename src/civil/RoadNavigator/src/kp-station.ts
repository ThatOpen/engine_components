import * as FRAGS from "bim-fragment";
import * as THREE from "three";
import CameraControls from "camera-controls";
import { MarkerManager } from "../../../core/Simple2DMarker/src/marker-manager";
import { Components, SimpleRenderer } from "../../../core";
import { PostproductionRenderer } from "../../../navigation";

type CivilHighlightType = "horizontal" | "absolute" | "vertical";

export class KPStation {
  private type: CivilHighlightType;

  private scene: THREE.Group | THREE.Scene;

  private markerManager: MarkerManager;

  private divisionLength = 100;

  constructor(
    components: Components,
    renderer: SimpleRenderer | PostproductionRenderer,
    scene: THREE.Group | THREE.Scene,
    controls: CameraControls,
    type: CivilHighlightType
  ) {
    this.scene = scene;
    this.type = type;

    this.markerManager = new MarkerManager(
      components,
      renderer,
      scene,
      controls
    );
  }

  showKPStations(mesh: FRAGS.CurveMesh) {
    if (this.type === "horizontal") {
      const endKPStations = this.generateStartAndEndKP(mesh);
      for (const [, data] of endKPStations) {
        this.markerManager.addKPStation(data.value, data.normal);
      }

      // const constantKPStations =
      this.generateConstantKP(mesh);
    }
  }

  private generateStartAndEndKP(mesh: FRAGS.CurveMesh) {
    const { alignment } = mesh.curve;
    const data = new Map<
      number,
      {
        value: string;
        distance: number;
        point: THREE.Vector3;
        normal: THREE.Line;
      }
    >();

    for (const curve of alignment.horizontal) {
      const length = curve.getLength();
      if (data.size > 0) {
        const last = curve.index - 1;
        const previousData = data.get(last);
        const updateDistance = previousData!.distance + length;

        const curvePosition = curve.mesh.geometry.getAttribute("position");
        const lastSegmentIndex = curvePosition.count - 1;

        const lastSegment = new THREE.Vector3();
        lastSegment.x = curvePosition.getX(lastSegmentIndex);
        lastSegment.y = curvePosition.getY(lastSegmentIndex);
        lastSegment.z = curvePosition.getZ(lastSegmentIndex);

        const normalLine = this.createNormalLine(curve.mesh);

        data.set(curve.index, {
          value: this.getShortendKPValue(updateDistance),
          distance: updateDistance,
          point: lastSegment,
          normal: normalLine,
        });
      } else {
        const curvePosition = curve.mesh.geometry.getAttribute("position");
        const lastSegmentIndex = curvePosition.count - 1;

        const lastSegment = new THREE.Vector3();
        lastSegment.x = curvePosition.getX(lastSegmentIndex);
        lastSegment.y = curvePosition.getY(lastSegmentIndex);
        lastSegment.z = curvePosition.getZ(lastSegmentIndex);

        const normalLine = this.createNormalLine(curve.mesh);

        data.set(curve.index, {
          value: this.getShortendKPValue(length),
          distance: length,
          point: lastSegment,
          normal: normalLine,
        });
      }
    }

    return data;
  }

  private createNormalLine(curveMesh: FRAGS.CurveMesh) {
    const lastIndex = curveMesh.geometry.attributes.position.count - 1;
    const secondLastIndex = lastIndex - 1;

    const lastPoint = new THREE.Vector3();
    lastPoint.x = curveMesh.geometry.attributes.position.getX(lastIndex);
    lastPoint.y = curveMesh.geometry.attributes.position.getY(lastIndex);
    lastPoint.z = curveMesh.geometry.attributes.position.getZ(lastIndex);

    const secondLastPoint = new THREE.Vector3();
    secondLastPoint.x =
      curveMesh.geometry.attributes.position.getX(secondLastIndex);
    secondLastPoint.y =
      curveMesh.geometry.attributes.position.getY(secondLastIndex);
    secondLastPoint.z =
      curveMesh.geometry.attributes.position.getZ(secondLastIndex);

    const direction = new THREE.Vector3().subVectors(
      lastPoint,
      secondLastPoint
    );

    const normal = direction
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 0.5)
      .normalize();
    const normalGeom = new THREE.BufferGeometry().setFromPoints([
      normal.clone().setLength(10).add(lastPoint),
      normal.clone().setLength(-10).add(lastPoint),
    ]);
    const normalLine = new THREE.Line(normalGeom);
    // this.scene.add(normalLine);

    return normalLine;
  }

  private generateConstantKP(mesh: FRAGS.CurveMesh) {
    const { alignment } = mesh.curve;
    // const data = new Map<
    //   number,
    //   {
    //     value: string;
    //     distance: number;
    //     point: THREE.Vector3;
    //     normal: THREE.Line;
    //   }
    // >();

    const alignmentLength = alignment.getLength("horizontal");
    const divisions = Math.floor(alignmentLength / this.divisionLength);
    console.log(`divisions: ${divisions}`);
    for (let i = 0; i < divisions; i++) {
      // const percentage = i / divisions;
      // const point = alignment.getPointAt(percentage, "horizontal");
      console.log(this.scene);
    }
  }

  // private getDistanceTillPercentage(
  //   alignment: FRAGS.Alignment,
  //   percentage: number
  // ) {
  //   if (percentage < 0) {
  //     percentage = 0;
  //   } else if (percentage > 1) {
  //     percentage = 1;
  //   }
  //   for (const curve of alignment.horizontal) {
  //     const curvePosition = curve.mesh.geometry.getAttribute("position");
  //     const lastSegmentIndex = curvePosition.count - 1;

  //     const lastSegment = new THREE.Vector3();
  //     lastSegment.x = curvePosition.getX(lastSegmentIndex);
  //     lastSegment.y = curvePosition.getY(lastSegmentIndex);
  //     lastSegment.z = curvePosition.getZ(lastSegmentIndex);

  //     if (lastSegment.equals(point)) {
  //       return distance;
  //     }

  //     distance += curve.getLength();
  //   }

  //   return distance;
  // }

  private getShortendKPValue(value: number) {
    const formattedValue = value.toFixed(2);
    const [integerPart, fractionalPart] = formattedValue.toString().split(".");
    const formattedFractionalPart = fractionalPart || "00";

    if (parseInt(integerPart, 10) > 1000 && parseInt(integerPart, 10) < 10000) {
      const [first, ...rest] = integerPart;
      return `${first}+${rest.join("")}.${formattedFractionalPart}`;
    }
    if (parseInt(integerPart, 10) > 10000) {
      const [first, second, ...rest] = integerPart;
      return `${first}${second}+${rest.join("")}.${formattedFractionalPart}`;
    }

    return `0+${integerPart.padStart(3, "0")}.${formattedFractionalPart}`;
  }

  clearKPStations() {
    this.markerManager.clearMarkers();
  }

  dispose() {
    this.markerManager.dispose();
  }
}
