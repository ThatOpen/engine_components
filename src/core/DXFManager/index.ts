// import * as THREE from "three";
// import { DXFLoader } from "three-dxf-loader/dist/three-dxf-loader";
// import { Component, Disposable, Event, UI } from "../../base-types";
// import { Components } from "../Components";
// import { Button, FloatingWindow } from "../../ui";

// export class DXFManager
//   extends Component<THREE.Group[]>
//   implements UI, Disposable
// {
//   name: string = "DXFManager";
//   enabled: boolean = true;
//   uiElement!: Button;
//   onDXFImported: Event<THREE.Group> = new Event();
//   onDXFTransformed: Event<THREE.Matrix4> = new Event();
//   private _components: Components;
//   private _dxfLoader: DXFLoader;
//   private _list: THREE.Group[] = [];
//   private _input = document.createElement("input");

//   constructor(components: Components) {
//     super();
//     this._components = components;
//     this._dxfLoader = new DXFLoader();
//     this._dxfLoader.setFont("/assets/fonts/Roboto-LightItalic.ttf");
//     this._dxfLoader.setEnableLayer(true);
//     this.setUI();
//   }

//   private setUI() {
//     this.viewerContainer.append(this._input);
//     this._input.type = "file";
//     this._input.accept = ".dxf";
//     this._input.style.display = "none";
//     this._input.onchange = async (e) => {
//       // @ts-ignore
//       const file = e.target.files[0] as File;
//       this.load(URL.createObjectURL(file).toString(), file.name);
//     };

//     const button = new Button(this._components, { materialIconName: "villa" });
//     const upload = new Button(this._components, {
//       materialIconName: "upload",
//       name: "Import DXF",
//     });
//     upload.onclick = () => {
//       this._input.click();
//     };

//     const listWindow = new FloatingWindow(this._components);
//     listWindow.visible = false;
//     this._components.ui.add(listWindow);
//     listWindow.title = "DXF Drawings";

//     const buttonList = new Button(this._components, {
//       materialIconName: "format_list_bulleted",
//       name: "DXF list",
//     });
//     buttonList.onclick = () => {
//       listWindow.visible = !listWindow.visible;
//     };
//     button.addChild(buttonList, upload);
//     this.uiElement = button;
//   }

//   private get viewerContainer() {
//     return this._components.renderer.get().domElement
//       .parentElement as HTMLElement;
//   }

//   private get scene() {
//     return this._components.scene.get();
//   }

//   load(url: string, name: string) {
//     const existingDrawing = this._list.find((drawing) => drawing.name === name);

//     const dxfGroup = existingDrawing || new THREE.Group();

//     if (existingDrawing) {
//       this.disposeDrawing(name);
//     } else {
//       dxfGroup.name = name;
//       this.scene.add(dxfGroup);
//       this._list.push(dxfGroup);
//     }

//     const onLoad = (data: any) => {
//       if (!(data && data.entities)) return;
//       data.entities.forEach((ent: THREE.Group) => dxfGroup.add(ent));
//       this.onDXFImported.trigger(dxfGroup);
//     };
//     const onError = (error: any) => {
//       console.log(error);
//     };
//     const onProgress = (xhr: any) => {
//       console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
//     };

//     this._dxfLoader.load(url, onLoad, onProgress, onError);

//     return dxfGroup;
//   }

//   transform(
//     id: string,
//     baseA: THREE.Vector3,
//     baseB: THREE.Vector3,
//     targetA: THREE.Vector3,
//     targetB: THREE.Vector3,
//     targetPlaneNormal: THREE.Vector3
//   ) {
//     const existingDrawing = this._list.find((drawing) => (drawing.uuid = id));
//     if (!existingDrawing) {
//       console.warn(`There is no dxf drawing with id ${id}`);
//       return;
//     }
//     const matrix = this.getTransformMatrix(
//       baseA,
//       baseB,
//       targetA,
//       targetB,
//       targetPlaneNormal
//     );
//     existingDrawing.applyMatrix4(matrix);
//     this.onDXFTransformed.trigger(matrix);
//   }

//   private getTransformMatrix(
//     baseA: THREE.Vector3,
//     baseB: THREE.Vector3,
//     targetA: THREE.Vector3,
//     targetB: THREE.Vector3,
//     targetPlaneNormal: THREE.Vector3
//   ) {
//     baseB.sub(baseA);
//     targetB.sub(targetA);

//     // Scale
//     const scaleFactor = targetB.length() / baseB.length();
//     const scaleVector = new THREE.Vector3(1, 1, 1).multiplyScalar(scaleFactor);

//     // Rotation
//     const angle = targetB.angleTo(baseB);
//     const axis = baseB.clone().cross(targetB).normalize();
//     const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);

//     // Additional rotation to align object's up direction with target plane normal
//     const upDirection = new THREE.Vector3(0, 1, 0);
//     const upAngle = upDirection.angleTo(targetPlaneNormal);
//     const upAxis = upDirection.clone().cross(targetPlaneNormal).normalize();
//     const upRotationMatrix = new THREE.Matrix4().makeRotationAxis(
//       upAxis,
//       upAngle
//     );

//     const finalRotation = upRotationMatrix.multiply(rotationMatrix);

//     // Transform matrix
//     const matrix = new THREE.Matrix4();
//     matrix.multiply(finalRotation);
//     matrix.scale(scaleVector);
//     const finalPosition = baseA
//       .multiplyScalar(scaleFactor * -1)
//       .applyMatrix4(finalRotation.clone().setPosition(targetA));
//     matrix.setPosition(
//       finalPosition.add(
//         new THREE.Vector3().addScalar(0.001).multiply(targetPlaneNormal)
//       )
//     );

//     return matrix;
//   }

//   disposeDrawing(id: string) {
//     const existingDrawing = this._list.find((drawing) => (drawing.uuid = id));
//     if (!existingDrawing) return;
//     for (const child of existingDrawing.children) {
//       for (const groupChild of child.children) {
//         // @ts-ignore
//         groupChild.material?.dispose();
//         // @ts-ignore
//         groupChild.geometry?.dispose();
//         groupChild.removeFromParent();
//         const filteredMeshes = this._components.meshes.filter(
//           (mesh) => mesh.uuid !== child.uuid
//         );
//         this._components.meshes = filteredMeshes;
//       }
//       child.removeFromParent();
//     }
//   }

//   dispose() {
//     for (const name in this._list) {
//       this.disposeDrawing(name);
//     }
//   }

//   get(): THREE.Group[] {
//     return this._list;
//   }
// }
