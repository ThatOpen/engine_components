import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import * as OBC from "@thatopen/components";
import { Mark, Marker } from "../../core";

type CivilHighlightType = "horizontal" | "absolute" | "vertical";

const CivilLabelArray = [
  "Station",
  "Radius",
  "Length",
  "InitialKP",
  "FinalKP",
  "KP",
  "Slope",
  "Height",
  "InitialKPV",
  "FinalKPV",
] as const;

type CivilLabel = (typeof CivilLabelArray)[number];

export class CivilMarker extends OBC.Component {
  static readonly uuid = "0af12c32-81ee-4100-a030-e9ae546f6170" as const;

  enabled = true;

  world: OBC.World | null = null;

  list = new Map<CivilLabel, Set<string>>();

  // TODO: Replace with UUID for the marker key
  protected _markerKey = 0;

  private type: CivilHighlightType = "horizontal";

  private divisionLength = 100;

  constructor(components: OBC.Components) {
    super(components);
    components.add(CivilMarker.uuid, this);
  }

  addKPStation(world: OBC.World, text: string, mesh: THREE.Line) {
    const marker = this.components.get(Marker);

    const container = document.createElement("div");
    const span = document.createElement("div");
    container.appendChild(span);

    span.innerHTML = text;

    span.style.color = marker.color;
    span.style.borderBottom = "1px dotted white";
    span.style.width = "160px";
    span.style.textAlign = "left";

    const mark = new Mark(world, container);

    const point = new THREE.Vector3();
    point.x = mesh.geometry.attributes.position.getX(
      mesh.geometry.attributes.position.count - 1,
    );
    point.y = mesh.geometry.attributes.position.getY(
      mesh.geometry.attributes.position.count - 1,
    );
    point.z = mesh.geometry.attributes.position.getZ(
      mesh.geometry.attributes.position.count - 1,
    );

    const secondLastPoint = new THREE.Vector3();
    secondLastPoint.x = mesh.geometry.attributes.position.getX(
      mesh.geometry.attributes.position.count - 2,
    );
    secondLastPoint.y = mesh.geometry.attributes.position.getY(
      mesh.geometry.attributes.position.count - 2,
    );
    secondLastPoint.z = mesh.geometry.attributes.position.getZ(
      mesh.geometry.attributes.position.count - 2,
    );

    const midPoint = new THREE.Vector3();
    midPoint.x = (point.x + secondLastPoint.x) / 2;
    midPoint.y = (point.y + secondLastPoint.y) / 2;
    midPoint.z = (point.z + secondLastPoint.z) / 2;

    mark.three.position.copy(midPoint);

    const direction = new THREE.Vector3();
    direction.subVectors(point, secondLastPoint).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    const eulerZ = new THREE.Euler().setFromQuaternion(quaternion).z;
    const rotationZ = THREE.MathUtils.radToDeg(eulerZ);

    span.style.transform = `rotate(${
      -rotationZ - 90
    }deg) translate(-35%, -50%)`;

    const key = this._markerKey.toString();

    marker.list.set(key, {
      label: mark,
      key,
      merged: false,
      static: false,
    });
    this._markerKey++;

    this.save(key, "KP");
  }

  addVerticalMarker(
    world: OBC.World,
    text: string,
    mesh: FRAGS.CurveMesh,
    type: CivilLabel,
    root: THREE.Object3D,
  ) {
    const marker = this.components.get(Marker);

    const span = document.createElement("span");
    span.innerHTML = text;
    span.style.color = marker.color;

    const mark = new Mark(world, span, root);

    if (type === "Height") {
      const span = document.createElement("span");
      span.innerHTML = text;
      span.style.color = marker.color;

      const { position } = mesh.geometry.attributes;
      const setArray = position.array.length / 3;

      const firstIndex = (setArray - 1) * 3;
      const lastIndex = position.array.slice(firstIndex, firstIndex + 3);

      mark.three.position.set(lastIndex[0], lastIndex[1] + 10, lastIndex[2]);
    } else if (type === "InitialKPV") {
      const { position } = mesh.geometry.attributes;

      const pX = position.getX(0);
      const pY = position.getY(0);
      const pZ = position.getZ(0);

      mark.three.position.set(pX - 20, pY, pZ);
    } else if (type === "FinalKPV") {
      const { position } = mesh.geometry.attributes;

      const pX = position.getX(mesh.geometry.attributes.position.count - 1);
      const pY = position.getY(mesh.geometry.attributes.position.count - 1);
      const pZ = position.getZ(mesh.geometry.attributes.position.count - 1);

      mark.three.position.set(pX + 20, pY, pZ);
    } else if (type === "Slope") {
      span.style.color = "grey";
      const { position } = mesh.geometry.attributes;

      const pointStart = new THREE.Vector3();
      pointStart.x = position.getX(0);
      pointStart.y = position.getY(0);
      pointStart.z = position.getZ(0);

      const pointEnd = new THREE.Vector3();
      pointEnd.x = position.getX(position.count - 1);
      pointEnd.y = position.getY(position.count - 1);
      pointEnd.z = position.getZ(position.count - 1);

      const midPoint = new THREE.Vector3();
      midPoint.addVectors(pointStart, pointEnd).multiplyScalar(0.5);

      mark.three.position.set(midPoint.x, midPoint.y - 10, midPoint.z);
    }

    const key = this._markerKey.toString();

    marker.list.set(key, {
      label: mark,
      key,
      type,
      merged: false,
      static: false,
    });
    this._markerKey++;

    this.save(key, type);

    return mark;
  }

  addCivilMarker(
    world: OBC.World,
    text: string,
    mesh: FRAGS.CurveMesh,
    type: CivilLabel,
  ) {
    const marker = this.components.get(Marker);

    const span = document.createElement("span");
    span.innerHTML = text;
    span.style.color = marker.color;

    const mark = new Mark(world, span);

    if (type === "InitialKP") {
      const pX = mesh.geometry.attributes.position.getX(0);
      const pY = mesh.geometry.attributes.position.getY(0);
      const pZ = mesh.geometry.attributes.position.getZ(0);
      mark.three.position.set(pX + 2, pY + 2, pZ);
    } else if (type === "FinalKP") {
      const pX = mesh.geometry.attributes.position.getX(
        mesh.geometry.attributes.position.count - 1,
      );
      const pY = mesh.geometry.attributes.position.getY(
        mesh.geometry.attributes.position.count - 1,
      );
      const pZ = mesh.geometry.attributes.position.getZ(
        mesh.geometry.attributes.position.count - 1,
      );
      mark.three.position.set(pX + 2, pY - 2, pZ);
    } else if (type === "Length") {
      const pointStart = new THREE.Vector3();
      pointStart.x = mesh.geometry.attributes.position.getX(0);
      pointStart.y = mesh.geometry.attributes.position.getY(0);
      pointStart.z = mesh.geometry.attributes.position.getZ(0);

      const pointEnd = new THREE.Vector3();
      pointEnd.x = mesh.geometry.attributes.position.getX(
        mesh.geometry.attributes.position.count - 1,
      );
      pointEnd.y = mesh.geometry.attributes.position.getY(
        mesh.geometry.attributes.position.count - 1,
      );
      pointEnd.z = mesh.geometry.attributes.position.getZ(
        mesh.geometry.attributes.position.count - 1,
      );

      const length = pointStart.distanceTo(pointEnd);
      mark.three.element.innerText = length.toFixed(2);
      const target = pointEnd.clone().add(pointStart).divideScalar(2);
      mark.three.position.copy(target);
    }

    const key = this._markerKey.toString();

    marker.list.set(key, {
      label: mark,
      key,
      type,
      merged: false,
      static: false,
    });
    this._markerKey++;

    this.save(key, type);

    return mark;
  }

  showKPStations(mesh: FRAGS.CurveMesh) {
    if (!this.world) {
      throw new Error("A world is needed for this component to work!");
    }

    if (this.type === "horizontal") {
      const endKPStations = this.generateStartAndEndKP(mesh);
      for (const [, data] of endKPStations) {
        this.addKPStation(this.world, data.value, data.normal);
      }

      const constantKPStations = this.generateConstantKP(mesh);
      for (const [, data] of constantKPStations) {
        this.addKPStation(this.world, data.value, data.normal);
      }
    }
  }

  showCurveLength(points: THREE.Vector3[], length: number) {
    if (!this.world) {
      throw new Error("A world is needed for this component to work!");
    }

    const marker = this.components.get(Marker);

    const count = points.length;
    const formattedLength = `${length.toFixed(2)} m`;
    const midpointIndex = Math.round(count / 2);
    const middlePoint = points[midpointIndex];

    const id = marker.create(this.world, formattedLength, middlePoint, true);
    this.save(id, "Length");
  }

  showLineLength(line: THREE.Line, length: number) {
    if (!this.world) {
      throw new Error("A world is needed for this component to work!");
    }

    const marker = this.components.get(Marker);

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

    const id = marker.create(this.world, formattedLength, middlePoint, true);
    this.save(id, "Length");
  }

  showCurveRadius(line: THREE.Line, radius: number) {
    if (!this.world) {
      throw new Error("A world is needed for this component to work!");
    }

    const marker = this.components.get(Marker);

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

    const id = marker.create(this.world, formattedLength, middlePoint, true);
    this.save(id, "Radius");
  }

  deleteByType(types: Iterable<CivilLabel> = CivilLabelArray) {
    const marker = this.components.get(Marker);
    for (const type of types) {
      const found = this.list.get(type);
      if (!found) continue;
      for (const id of found) {
        marker.delete(id);
      }
      this.list.delete(type);
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

  private generateConstantKP(mesh: FRAGS.CurveMesh) {
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

  private save(id: string, type: CivilLabel) {
    if (!this.list.has(type)) {
      this.list.set(type, new Set());
    }
    const list = this.list.get(type) as Set<string>;
    list.add(id);
  }
}
