import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import CameraControls from "camera-controls";
import { Components, SimpleRenderer } from "../../../core";
import { MarkerManager } from "../../../core/Simple2DMarker/src/marker-manager";
import { PostproductionRenderer } from "../../../navigation";

type CivilHighlightType = "horizontal" | "absolute" | "vertical";

export class KPManager extends MarkerManager {
  private view: CivilHighlightType;

  private divisionLength = 100;

  constructor(
    components: Components,
    renderer: SimpleRenderer | PostproductionRenderer,
    scene: THREE.Group | THREE.Scene,
    controls: CameraControls,
    type: CivilHighlightType,
  ) {
    super(components, renderer, scene, controls);
    this.view = type;
  }

  showKPStations(mesh: FRAGS.CurveMesh) {
    if (this.view === "horizontal") {
      const endKPStations = this.generateStartAndEndKP(mesh);
      for (const [, data] of endKPStations) {
        this.addKPStation(data.value, data.normal);
      }

      const constantKPStations = this.generateConstantKP(mesh);
      for (const [, data] of constantKPStations) {
        this.addKPStation(data.value, data.normal);
      }
    }
  }

  showCurveLength(points: THREE.Vector3[], length: number) {
    const count = points.length;
    const formattedLength = `${length.toFixed(2)} m`;
    const midpointIndex = Math.round(count / 2);
    const middlePoint = points[midpointIndex];

    this.addMarkerAtPoint(formattedLength, middlePoint, "Length", true);
  }

  showLineLength(line: THREE.Line, length: number) {
    const startPoint = new THREE.Vector3();
    startPoint.x = line.geometry.getAttribute("position").getX(0);
    startPoint.y = line.geometry.getAttribute("position").getY(0);
    startPoint.z = line.geometry.getAttribute("position").getZ(0);

    const endPoint = new THREE.Vector3();
    endPoint.x = line.geometry.getAttribute("position").getX(1);
    endPoint.y = line.geometry.getAttribute("position").getY(1);
    endPoint.z = line.geometry.getAttribute("position").getZ(1);

    const formattedLength = `${length.toFixed(2)} m`;
    const middlePoint = new THREE.Vector3();
    middlePoint.addVectors(startPoint, endPoint).multiplyScalar(0.5);

    this.addMarkerAtPoint(formattedLength, middlePoint, "Length", true);
  }

  showCurveRadius(line: THREE.Line, radius: number) {
    const startPoint = new THREE.Vector3();
    startPoint.x = line.geometry.getAttribute("position").getX(0);
    startPoint.y = line.geometry.getAttribute("position").getY(0);
    startPoint.z = line.geometry.getAttribute("position").getZ(0);

    const endPoint = new THREE.Vector3();
    endPoint.x = line.geometry.getAttribute("position").getX(1);
    endPoint.y = line.geometry.getAttribute("position").getY(1);
    endPoint.z = line.geometry.getAttribute("position").getZ(1);

    const formattedLength = `R = ${radius.toFixed(2)} m`;
    const middlePoint = new THREE.Vector3();
    middlePoint.addVectors(startPoint, endPoint).multiplyScalar(0.5);

    this.addMarkerAtPoint(formattedLength, middlePoint, "Radius", true);
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
      secondLastPoint,
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

  generateConstantKP(mesh: FRAGS.CurveMesh) {
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

    const alignmentLength = alignment.getLength("horizontal");
    const divisions = Math.floor(alignmentLength / this.divisionLength);
    for (let i = 0; i < divisions; i++) {
      const percentage = i / divisions;
      const kpPoint = alignment.getPointAt(percentage, "horizontal");
      const length = alignmentLength * percentage;
      // const curve = alignment.getCurveAt(percentage, "horizontal");
      const normalLine = this.getNormal(alignment, kpPoint);
      data.set(i, {
        value: this.getShortendKPValue(length),
        distance: length,
        point: kpPoint,
        normal: normalLine,
      });
    }

    return data;
  }

  // TODO: Move Generation of Points to Previous Method Call
  private getNormal(curve: FRAGS.Alignment, point: THREE.Vector3) {
    const pointsInCurve = [];
    const normalPoints = {
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
    };

    for (let i = 0; i < curve.horizontal.length; i++) {
      const curveMesh = curve.horizontal[i].mesh;
      const position = curveMesh.geometry.attributes.position;
      const length = position.count;

      for (let j = 0; j < length; j++) {
        const x = position.getX(j);
        const y = position.getY(j);
        const z = position.getZ(j);
        pointsInCurve.push(new THREE.Vector3(x, y, z));
      }
    }

    for (let i = 0; i < pointsInCurve.length - 1; i++) {
      const p1 = pointsInCurve[i];
      const p2 = pointsInCurve[i + 1];

      const distanceP1 = p1.distanceTo(point);
      const distanceP2 = p2.distanceTo(point);
      const distanceP1P2 = p1.distanceTo(p2);

      const epsilion = 0.00001;
      const isOnLine = Math.abs(distanceP1 + distanceP2 - distanceP1P2);

      if (isOnLine < epsilion) {
        normalPoints.start = p1;
        normalPoints.end = p2;
      }
    }

    const direction = new THREE.Vector3().subVectors(
      normalPoints.end,
      normalPoints.start,
    );
    const normal = direction
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 0.5)
      .normalize();
    const normalGeom = new THREE.BufferGeometry().setFromPoints([
      normal.clone().setLength(10).add(point),
      normal.clone().setLength(-10).add(point),
    ]);
    const normalLine = new THREE.Line(
      normalGeom,
      new THREE.LineBasicMaterial({ color: 0xff0000 }),
    );
    return normalLine;
  }

  public getShortendKPValue(value: number) {
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
    this.clearMarkers();
  }
}
