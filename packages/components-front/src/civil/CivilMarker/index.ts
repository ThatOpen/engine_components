// import * as FRAGS from "bim-fragment";
// import * as THREE from "three";
// import { World } from "@thatopen/components/src";
// import { Marker } from "../../core";
// import { Mark } from "../../core/Marker/src";
//
// type CivilLabels =
//   | "Station"
//   | "Radius"
//   | "Length"
//   | "InitialKP"
//   | "FinalKP"
//   | "KP"
//   | "Slope"
//   | "Height"
//   | "InitialKPV"
//   | "FinalKPV";
//
// /**
//  * Class for Managing Markers along with creating different types of markers
//  * Every marker is a Simple2DMarker
//  * For every marker that needs to be added, you can use the Manager to add the marker and change its look and feel
//  */
// export class CivilMarker extends Marker {
//   addKPStation(world: World, text: string, mesh: THREE.Line) {
//     const container = document.createElement("div");
//     const span = document.createElement("div");
//     container.appendChild(span);
//
//     span.innerHTML = text;
//
//     span.style.color = this._color;
//     span.style.borderBottom = "1px dotted white";
//     span.style.width = "160px";
//     span.style.textAlign = "left";
//
//     const marker = new Mark(world, container);
//
//     const point = new THREE.Vector3();
//     point.x = mesh.geometry.attributes.position.getX(
//       mesh.geometry.attributes.position.count - 1,
//     );
//     point.y = mesh.geometry.attributes.position.getY(
//       mesh.geometry.attributes.position.count - 1,
//     );
//     point.z = mesh.geometry.attributes.position.getZ(
//       mesh.geometry.attributes.position.count - 1,
//     );
//
//     const secondLastPoint = new THREE.Vector3();
//     secondLastPoint.x = mesh.geometry.attributes.position.getX(
//       mesh.geometry.attributes.position.count - 2,
//     );
//     secondLastPoint.y = mesh.geometry.attributes.position.getY(
//       mesh.geometry.attributes.position.count - 2,
//     );
//     secondLastPoint.z = mesh.geometry.attributes.position.getZ(
//       mesh.geometry.attributes.position.count - 2,
//     );
//
//     const midPoint = new THREE.Vector3();
//     midPoint.x = (point.x + secondLastPoint.x) / 2;
//     midPoint.y = (point.y + secondLastPoint.y) / 2;
//     midPoint.z = (point.z + secondLastPoint.z) / 2;
//
//     marker.three.position.copy(midPoint);
//
//     const direction = new THREE.Vector3();
//     direction.subVectors(point, secondLastPoint).normalize();
//     const quaternion = new THREE.Quaternion();
//     quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
//
//     const eulerZ = new THREE.Euler().setFromQuaternion(quaternion).z;
//     const rotationZ = THREE.MathUtils.radToDeg(eulerZ);
//
//     span.style.transform = `rotate(${
//       -rotationZ - 90
//     }deg) translate(-35%, -50%)`;
//
//     this.list.add({
//       label: marker,
//       key: this._markerKey.toString(),
//       merged: false,
//       static: false,
//     });
//     this._markerKey++;
//   }
//
//   addCivilVerticalMarker(
//     world: World,
//     text: string,
//     mesh: FRAGS.CurveMesh,
//     type: CivilLabels,
//     root: THREE.Object3D,
//   ) {
//     const span = document.createElement("span");
//     span.innerHTML = text;
//     span.style.color = this._color;
//
//     const marker = new Mark(world, span, root);
//
//     if (type === "Height") {
//       const span = document.createElement("span");
//       span.innerHTML = text;
//       span.style.color = this._color;
//
//       const { position } = mesh.geometry.attributes;
//       const setArray = position.array.length / 3;
//
//       const firstIndex = (setArray - 1) * 3;
//       const lastIndex = position.array.slice(firstIndex, firstIndex + 3);
//
//       marker.three.position.set(lastIndex[0], lastIndex[1] + 10, lastIndex[2]);
//     } else if (type === "InitialKPV") {
//       const { position } = mesh.geometry.attributes;
//
//       const pX = position.getX(0);
//       const pY = position.getY(0);
//       const pZ = position.getZ(0);
//
//       marker.three.position.set(pX - 20, pY, pZ);
//     } else if (type === "FinalKPV") {
//       const { position } = mesh.geometry.attributes;
//
//       const pX = position.getX(mesh.geometry.attributes.position.count - 1);
//       const pY = position.getY(mesh.geometry.attributes.position.count - 1);
//       const pZ = position.getZ(mesh.geometry.attributes.position.count - 1);
//
//       marker.three.position.set(pX + 20, pY, pZ);
//     } else if (type === "Slope") {
//       span.style.color = "grey";
//       const { position } = mesh.geometry.attributes;
//
//       const pointStart = new THREE.Vector3();
//       pointStart.x = position.getX(0);
//       pointStart.y = position.getY(0);
//       pointStart.z = position.getZ(0);
//
//       const pointEnd = new THREE.Vector3();
//       pointEnd.x = position.getX(position.count - 1);
//       pointEnd.y = position.getY(position.count - 1);
//       pointEnd.z = position.getZ(position.count - 1);
//
//       const midPoint = new THREE.Vector3();
//       midPoint.addVectors(pointStart, pointEnd).multiplyScalar(0.5);
//
//       marker.three.position.set(midPoint.x, midPoint.y - 10, midPoint.z);
//     }
//
//     this.list.add({
//       label: marker,
//       key: this._markerKey.toString(),
//       type,
//       merged: false,
//       static: false,
//     });
//     this._markerKey++;
//
//     return marker;
//   }
//
//   addCivilMarker(
//     world: World,
//     text: string,
//     mesh: FRAGS.CurveMesh,
//     type: CivilLabels,
//   ) {
//     const span = document.createElement("span");
//     span.innerHTML = text;
//     span.style.color = this._color;
//
//     const marker = new Mark(world, span);
//
//     if (type === "InitialKP") {
//       const pX = mesh.geometry.attributes.position.getX(0);
//       const pY = mesh.geometry.attributes.position.getY(0);
//       const pZ = mesh.geometry.attributes.position.getZ(0);
//       marker.three.position.set(pX + 2, pY + 2, pZ);
//     } else if (type === "FinalKP") {
//       const pX = mesh.geometry.attributes.position.getX(
//         mesh.geometry.attributes.position.count - 1,
//       );
//       const pY = mesh.geometry.attributes.position.getY(
//         mesh.geometry.attributes.position.count - 1,
//       );
//       const pZ = mesh.geometry.attributes.position.getZ(
//         mesh.geometry.attributes.position.count - 1,
//       );
//       marker.three.position.set(pX + 2, pY - 2, pZ);
//     } else if (type === "Length") {
//       const pointStart = new THREE.Vector3();
//       pointStart.x = mesh.geometry.attributes.position.getX(0);
//       pointStart.y = mesh.geometry.attributes.position.getY(0);
//       pointStart.z = mesh.geometry.attributes.position.getZ(0);
//
//       const pointEnd = new THREE.Vector3();
//       pointEnd.x = mesh.geometry.attributes.position.getX(
//         mesh.geometry.attributes.position.count - 1,
//       );
//       pointEnd.y = mesh.geometry.attributes.position.getY(
//         mesh.geometry.attributes.position.count - 1,
//       );
//       pointEnd.z = mesh.geometry.attributes.position.getZ(
//         mesh.geometry.attributes.position.count - 1,
//       );
//
//       const length = pointStart.distanceTo(pointEnd);
//       marker.three.element.innerText = length.toFixed(2);
//       const target = pointEnd.clone().add(pointStart).divideScalar(2);
//       marker.three.position.copy(target);
//     }
//
//     this.list.add({
//       label: marker,
//       key: this._markerKey.toString(),
//       type,
//       merged: false,
//       static: false,
//     });
//     this._markerKey++;
//
//     return marker;
//   }
// }
