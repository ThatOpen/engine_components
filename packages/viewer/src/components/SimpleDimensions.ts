import {
  BufferGeometry,
  Color,
  ConeGeometry,
  Intersection,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D, Raycaster, Vector2,
  Vector3
} from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import {ToolComponent} from "../base-types";
import {Components} from "../components";
import {
  BoxGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Camera
} from 'three';
import { disposeMeshRecursively } from '../utils/ThreeUtils';

export class SimpleDimensions implements ToolComponent {
  private readonly context: Components;
  private dimensions: IfcDimensionLine[] = [];
  private currentDimension?: IfcDimensionLine;
  readonly labelClassName = 'ifcjs-dimension-label';
  readonly previewClassName = 'ifcjs-dimension-preview';

  // State
  public _enabled = false;
  private preview = false;
  private dragging = false;
  snapDistance = 0.25;

  // Measures

  private baseScale = new Vector3(1, 1, 1);

  // Geometries
  private endpoint: BufferGeometry;
  private previewElement: CSS2DObject;

  // Materials
  private lineMaterial = new LineDashedMaterial({
    color: 0x000000,
    linewidth: 2,
    depthTest: false,
    dashSize: 0.2,
    gapSize: 0.2
  });

  private endpointsMaterial = new MeshBasicMaterial({ color: 0x000000, depthTest: false });

  // Temp variables
  private startPoint = new Vector3();
  private endPoint = new Vector3();

  position = new Vector2();
  rawPosition = new Vector2();
  raycaster = new Raycaster()

  constructor(context: Components) {
    this.context = context;
    this.endpoint = SimpleDimensions.getDefaultEndpointGeometry();
    const htmlPreview = document.createElement('div');
    htmlPreview.className = this.previewClassName;
    this.previewElement = new CSS2DObject(htmlPreview);
    this.previewElement.visible = false;

    // Mouse position
    const domElement = context.renderer!.renderer.domElement

    domElement.onmousemove = (event: MouseEvent) => {
      this.rawPosition.x = event.clientX;
      this.rawPosition.y = event.clientY;
      const bounds = domElement.getBoundingClientRect();
      this.position.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
      this.position.y = -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;
    };
  }

  dispose() {
    (this.context as any) = null;
    this.dimensions.forEach((dim) => dim.dispose());
    (this.dimensions as any) = null;
    (this.currentDimension as any) = null;
    this.endpoint.dispose();
    (this.endpoint as any) = null;

    this.previewElement.removeFromParent();
    this.previewElement.element.remove();
    (this.previewElement as any) = null;
  }

  update(_delta: number) {
    if (this._enabled && this.preview) {
      const intersects = this.castRayIfc();
      this.previewElement.visible = !!intersects;
      if (!intersects) return;
      this.previewElement.visible = true;
      const closest = this.getClosestVertex(intersects);
      this.previewElement.visible = !!closest;
      if (!closest) return;
      this.previewElement.position.set(closest.x, closest.y, closest.z);
      if (this.dragging) {
        this.drawInProcess();
      }
    }
  }

  setArrow(height: number, radius: number) {
    this.endpoint = SimpleDimensions.getDefaultEndpointGeometry(height, radius);
  }

  setPreviewElement(element: HTMLElement) {
    this.previewElement = new CSS2DObject(element);
  }

  get enabled() {
    return this._enabled;
  }

  get previewActive() {
    return this.preview;
  }

  get previewObject() {
    return this.previewElement;
  }

  set previewActive(state: boolean) {
    this.preview = state;
    const scene = this.context.scene?.getScene();
    if(!scene) throw new Error("Dimensions rely on scene to be present.")
    if (this.preview) {
      scene.add(this.previewElement);
    } else {
      scene.remove(this.previewElement);
    }
  }

  set enabled(state: boolean) {
    this._enabled = state;
    this.dimensions.forEach((dim) => {
      dim.visibility = state;
    });
  }

  set dimensionsColor(color: Color) {
    this.endpointsMaterial.color = color;
    this.lineMaterial.color = color;
  }

  set dimensionsWidth(width: number) {
    this.lineMaterial.linewidth = width;
  }

  set endpointGeometry(geometry: BufferGeometry) {
    this.dimensions.forEach((dim) => {
      dim.endpointGeometry = geometry;
    });
  }

  set endpointScaleFactor(factor: number) {
    IfcDimensionLine.scaleFactor = factor;
  }

  set endpointScale(scale: Vector3) {
    this.baseScale = scale;
    this.dimensions.forEach((dim) => {
      dim.endpointScale = scale;
    });
  }

  create() {
    if (!this._enabled) return;
    if (!this.dragging) {
      this.drawStart();
      return;
    }
    this.drawEnd();
  }

  createInPlane(plane: Object3D) {
    if (!this._enabled) return;
    if (!this.dragging) {
      this.drawStartInPlane(plane);
      return;
    }
    this.drawEnd();
  }

  delete() {
    if (!this._enabled || this.dimensions.length === 0) return;
    const boundingBoxes = this.getBoundingBoxes();
    const intersects = this.castRay(boundingBoxes);
    if (intersects.length === 0) return;
    const selected = this.dimensions.find((dim) => dim.boundingBox === intersects[0].object);
    if (!selected) return;
    const index = this.dimensions.indexOf(selected);
    this.dimensions.splice(index, 1);
    selected.removeFromScene();
  }

  castRay(items: Object3D[]) {
    const camera = this.context.camera?.getCamera();
    if(!camera) throw new Error("Camera required for clipper")
    this.raycaster.setFromCamera(this.position, camera);
    return this.raycaster.intersectObjects(items);
  }

  castRayIfc() {
    const items = this.castRay(this.context.meshes);
    const filtered = this.filterClippingPlanes(items);
    return filtered.length > 0 ? filtered[0] : null;
  }

  private filterClippingPlanes(objs: Intersection[]) {
    const planes = this.context.renderer?.renderer.clippingPlanes;
    if (objs.length <= 0 || !planes || planes?.length <= 0) return objs;
    // const planes = this.clipper?.planes.map((p) => p.plane);
    return objs.filter((elem) => planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0));
  }

  deleteAll() {
    this.dimensions.forEach((dim) => {
      dim.removeFromScene();
    });
    this.dimensions = [];
  }

  cancelDrawing() {
    if (!this.currentDimension) return;
    this.dragging = false;
    this.currentDimension?.removeFromScene();
    this.currentDimension = undefined;
  }

  private drawStart() {
    this.dragging = true;
    const intersects = this.castRayIfc();
    if (!intersects) return;
    const found = this.getClosestVertex(intersects);
    if (!found) return;
    this.startPoint = found;
  }

  private drawStartInPlane(plane: Object3D) {
    this.dragging = true;

    const intersects = this.castRay([plane]);
    if (!intersects || intersects.length < 1) return;
    this.startPoint = intersects[0].point;
  }

  private drawInProcess() {
    const intersects = this.castRayIfc();
    if (!intersects) return;
    const found = this.getClosestVertex(intersects);
    if (!found) return;
    this.endPoint = found;
    if (!this.currentDimension) this.currentDimension = this.drawDimension();
    this.currentDimension.endPoint = this.endPoint;
  }

  private drawEnd() {
    if (!this.currentDimension) return;
    this.currentDimension.createBoundingBox();
    this.dimensions.push(this.currentDimension);
    this.currentDimension = undefined;
    this.dragging = false;
  }

  get getDimensionsLines() {
    return this.dimensions;
  }

  private drawDimension() {
    return new IfcDimensionLine(
      this.context,
      this.startPoint,
      this.endPoint,
      this.lineMaterial,
      this.endpointsMaterial,
      this.endpoint,
      this.labelClassName,
      this.baseScale
    );
  }

  private getBoundingBoxes() {
    return this.dimensions
      .map((dim) => dim.boundingBox)
      .filter((box) => box !== undefined) as Mesh[];
  }

  private static getDefaultEndpointGeometry(height = 0.02, radius = 0.05) {
    const coneGeometry = new ConeGeometry(radius, height);
    coneGeometry.translate(0, -height / 2, 0);
    coneGeometry.rotateX(-Math.PI / 2);
    return coneGeometry;
  }

  private getClosestVertex(intersects: Intersection) {
    let closestVertex = new Vector3();
    let vertexFound = false;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    const vertices = this.getVertices(intersects);
    vertices?.forEach((vertex) => {
      if (!vertex) return;
      const distance = intersects.point.distanceTo(vertex);
      if (distance > closestDistance || distance > this.snapDistance) return;
      vertexFound = true;
      closestVertex = vertex;
      closestDistance = intersects.point.distanceTo(vertex);
    });
    return vertexFound ? closestVertex : intersects.point;
  }

  private getVertices(intersects: Intersection) {
    const mesh = intersects.object as Mesh;
    if (!intersects.face || !mesh) return null;
    const geom = mesh.geometry;
    return [
      this.getVertex(intersects.face.a, geom),
      this.getVertex(intersects.face.b, geom),
      this.getVertex(intersects.face.c, geom)
    ];
  }

  private getVertex(index: number, geom: BufferGeometry) {
    if (index === undefined) return null;
    const vertices = geom.attributes.position;
    return new Vector3(vertices.getX(index), vertices.getY(index), vertices.getZ(index));
  }
}



export class IfcDimensionLine {
  private readonly context: Components;
  private readonly camera: Camera;
  private readonly labelClassName: string;
  static scaleFactor = 0.1;

  static scale = 1;
  static units = 'm';

  // Elements
  private root = new Group();
  private readonly line: Line;
  private readonly textLabel: CSS2DObject;
  private endpointMeshes: Mesh[] = [];

  // Geometries
  private readonly axis: BufferGeometry;
  private endpoint: BufferGeometry;

  // Dimensions
  start: Vector3;
  end: Vector3;
  center: Vector3;
  private length: number;
  private scale = new Vector3(1, 1, 1);

  // Materials
  private readonly lineMaterial: LineBasicMaterial;
  private readonly endpointMaterial: MeshBasicMaterial;

  // Bounding box
  private boundingMesh?: Mesh;
  private readonly boundingSize = 0.05;

  constructor(
    context: Components,
    start: Vector3,
    end: Vector3,
    lineMaterial: LineBasicMaterial,
    endpointMaterial: MeshBasicMaterial,
    endpointGeometry: BufferGeometry,
    className: string,
    endpointScale: Vector3
  ) {
    this.context = context;
    this.labelClassName = className;

    this.start = start;
    this.end = end;
    this.scale = endpointScale;

    this.lineMaterial = lineMaterial;
    this.endpointMaterial = endpointMaterial;

    this.length = this.getLength();
    this.center = this.getCenter();

    this.axis = new BufferGeometry().setFromPoints([start, end]);
    this.line = new Line(this.axis, this.lineMaterial);
    this.root.add(this.line);
    this.endpoint = endpointGeometry;
    this.addEndpointMeshes();
    this.textLabel = this.newText();

    this.root.renderOrder = 2;
    this.context.scene.getScene().add(this.root);

    this.camera = this.context.camera.getCamera();
    // this.context.ifcCamera.onChange.on(() => this.rescaleObjectsToCameraPosition());
    this.rescaleObjectsToCameraPosition();
  }

  dispose() {
    this.removeFromScene();
    (this.context as any) = null;
    disposeMeshRecursively(this.root as any);
    (this.root as any) = null;
    disposeMeshRecursively(this.line as any);
    (this.line as any) = null;
    this.endpointMeshes.forEach((mesh) => disposeMeshRecursively(mesh));
    this.endpointMeshes.length = 0;
    this.axis.dispose();
    (this.axis as any) = null;
    this.endpoint.dispose();
    (this.endpoint as any) = null;

    this.textLabel.removeFromParent();
    this.textLabel.element.remove();
    (this.textLabel as any) = null;

    this.lineMaterial.dispose();
    (this.lineMaterial as any) = null;
    this.endpointMaterial.dispose();
    (this.endpointMaterial as any) = null;

    if (this.boundingMesh) {
      disposeMeshRecursively(this.boundingMesh);
      (this.boundingMesh as any) = null;
    }
  }

  get boundingBox() {
    return this.boundingMesh;
  }

  get text() {
    return this.textLabel;
  }

  set dimensionColor(dimensionColor: Color) {
    this.endpointMaterial.color = dimensionColor;
    this.lineMaterial.color = dimensionColor;
  }

  set visibility(visible: boolean) {
    this.root.visible = visible;
    this.textLabel.visible = visible;
  }

  set endpointGeometry(geometry: BufferGeometry) {
    this.endpointMeshes.forEach((mesh) => this.root.remove(mesh));
    this.endpointMeshes = [];
    this.endpoint = geometry;
    this.addEndpointMeshes();
  }

  set endpointScale(scale: Vector3) {
    this.scale = scale;
    this.endpointMeshes.forEach((mesh) => mesh.scale.set(scale.x, scale.y, scale.z));
  }

  set endPoint(point: Vector3) {
    this.end = point;
    if (!this.axis) return;
    const position = this.axis.attributes.position;
    if (!position) return;
    position.setXYZ(1, point.x, point.y, point.z);
    position.needsUpdate = true;
    this.endpointMeshes[1].position.set(point.x, point.y, point.z);
    this.endpointMeshes[1].lookAt(this.start);
    this.endpointMeshes[0].lookAt(this.end);
    this.length = this.getLength();
    this.textLabel.element.textContent = this.getTextContent();
    this.center = this.getCenter();
    this.textLabel.position.set(this.center.x, this.center.y, this.center.z);
    this.line.computeLineDistances();
  }

  removeFromScene() {
    this.context.scene.getScene().remove(this.root);
    this.root.remove(this.textLabel);
  }

  createBoundingBox() {
    this.boundingMesh = this.newBoundingBox();
    this.setupBoundingBox(this.end);
  }

  private rescaleObjectsToCameraPosition() {
    this.endpointMeshes.forEach((mesh) => this.rescaleMesh(mesh, IfcDimensionLine.scaleFactor));
    if (this.boundingMesh) {
      this.rescaleMesh(this.boundingMesh, this.boundingSize, true, true, false);
    }
  }

  private rescaleMesh(mesh: Mesh, scalefactor = 1, x = true, y = true, z = true) {
    let scale = new Vector3().subVectors(mesh.position, this.camera.position).length();
    scale *= scalefactor;
    const scaleX = x ? scale : 1;
    const scaleY = y ? scale : 1;
    const scaleZ = z ? scale : 1;
    mesh.scale.set(scaleX, scaleY, scaleZ);
  }

  private addEndpointMeshes() {
    this.newEndpointMesh(this.start, this.end);
    this.newEndpointMesh(this.end, this.start);
  }

  private newEndpointMesh(position: Vector3, direction: Vector3) {
    const mesh = new Mesh(this.endpoint, this.endpointMaterial);
    mesh.position.set(position.x, position.y, position.z);
    mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
    mesh.lookAt(direction);
    this.endpointMeshes.push(mesh);
    this.root.add(mesh);
  }

  private newText() {
    const htmlText = document.createElement('div');
    htmlText.className = this.labelClassName;
    htmlText.textContent = this.getTextContent();
    const label = new CSS2DObject(htmlText);
    label.position.set(this.center.x, this.center.y, this.center.z);
    this.root.add(label);
    return label;
  }

  private getTextContent() {
    return `${this.length / IfcDimensionLine.scale} ${IfcDimensionLine.units}`;
  }

  private newBoundingBox() {
    const box = new BoxGeometry(1, 1, this.length);
    return new Mesh(box);
  }

  private setupBoundingBox(end: Vector3) {
    if (!this.boundingMesh) return;
    this.boundingMesh.position.set(this.center.x, this.center.y, this.center.z);
    this.boundingMesh.lookAt(end);
    this.boundingMesh.visible = false;
    this.root.add(this.boundingMesh);
  }

  private getLength() {
    return parseFloat(this.start.distanceTo(this.end).toFixed(2));
  }

  private getCenter() {
    let dir = this.end.clone().sub(this.start);
    const len = dir.length() * 0.5;
    dir = dir.normalize().multiplyScalar(len);
    return this.start.clone().add(dir);
  }
}
