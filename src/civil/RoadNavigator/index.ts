import * as THREE from "three";
import { Lines } from "openbim-clay";
import { FragmentMesh } from "bim-fragment/fragment-mesh";
import {
  Components,
  Disposer,
  Simple2DScene,
  SimpleCamera,
  ToolComponent,
} from "../../core";
import { Component, Disposable, UIElement } from "../../base-types";
import { Button, Drawer, FloatingWindow } from "../../ui";
import {
  EdgesClipper,
  EdgesPlane,
  PostproductionRenderer,
} from "../../navigation";
import { FragmentManager } from "../../fragments";

export class RoadNavigator extends Component<Lines> implements Disposable {
  /** {@link Component.uuid} */
  static readonly uuid = "85f2c89c-4c6b-4c7d-bc20-5b675874b228" as const;

  enabled = true;

  longSection: Simple2DScene;

  uiElement = new UIElement<{ main: Button; window: Drawer }>();

  offset = 10;

  planeEnabled = true;

  private _plane?: EdgesPlane;
  private _focusSphere = new THREE.Mesh(new THREE.SphereGeometry());
  private _focusBox = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 1, 0.2),
    new THREE.MeshBasicMaterial({
      color: "red",
      depthTest: false,
      transparent: true,
    })
  );

  private _scene2dSide?: Simple2DScene;
  private _scene2dTrans?: Simple2DScene;
  private _scene2dTop?: Simple2DScene;
  private _basicMaterial = new THREE.MeshBasicMaterial({ color: "white" });

  private _crossSectionLines: {
    [name: string]: { mesh: THREE.LineSegments; fill: THREE.Mesh };
  } = {};

  private _floorPlanElements: { [name: string]: THREE.Group } = {};

  private _lines = new Lines();
  private _longProjection: Lines;

  private _sideRoadDiagram?: {
    top: THREE.Line;
    bottom: THREE.Line;
    middle: THREE.Line;
  };

  private _mouseMarker?: { line: THREE.Line; verticalMarker: THREE.Points };

  private _roadDiagramData?: {
    length: number;
    mousePosition: number | null;
    mouseSegment: number | null;
  };

  // TODO: this should be handled better and allow to define lines per IFC model
  private _defaultID = "RoadNavigator";

  constructor(components: Components) {
    super(components);

    this.components.tools.add(RoadNavigator.uuid, this);

    const raycaster = this.components.raycaster.get();
    raycaster.params.Points = { threshold: 1 };
    this._lines.baseColor = new THREE.Color("#6528D7");
    const scene = components.scene.get();
    scene.add(this._lines.mesh);
    scene.add(this._lines.vertices.mesh);

    this.longSection = new Simple2DScene(components);
    this._longProjection = new Lines();
    const longSection = this.longSection.get();
    longSection.add(
      this._longProjection.mesh,
      this._longProjection.vertices.mesh
    );

    if (components.uiEnabled) {
      this.setupUI();
    }
  }

  get() {
    return this._lines;
  }

  async updateDrawings() {
    if (this._scene2dTrans) {
      await this._scene2dTrans.update();
    }
  }

  async dispose() {
    if (this._scene2dSide) {
      await this._scene2dSide.dispose();
    }
    if (this._scene2dTrans) {
      await this._scene2dTrans.dispose();
    }
    if (this._scene2dTop) {
      await this._scene2dTop.dispose();
    }
    const disposer = await this.components.tools.get(Disposer);
    for (const name in this._crossSectionLines) {
      const { mesh, fill } = this._crossSectionLines[name];
      disposer.destroy(mesh);
      disposer.destroy(fill);
    }
    this._crossSectionLines = {};
    for (const id in this._floorPlanElements) {
      const group = this._floorPlanElements[id];
      disposer.destroy(group);
    }
    disposer.destroy(this._focusSphere);
    disposer.destroy(this._focusBox);
    this._floorPlanElements = {};
    if (this._plane) {
      await this._plane.dispose();
    }
    await this.uiElement.dispose();
  }

  drawPoint() {
    const found = this.components.raycaster.castRay();
    if (!found) return;
    const { x, y, z } = found.point;
    const [id] = this._lines.addPoints([[x, y, z]]);
    this._lines.vertices.mesh.geometry.computeBoundingSphere();

    const selected = Array.from(this._lines.vertices.selected.data);
    if (selected.length) {
      const previousPoint = selected[0];
      this._lines.add([previousPoint, id]);
    }

    this._lines.selectPoints(false);
    this._lines.selectPoints(true, [id]);

    this.updateLongProjection();
    this.cache();
  }

  select(removePrevious = true) {
    if (removePrevious) {
      this._lines.selectPoints(false);
    }
    // TODO: Fix cast ray type
    const found = this.components.raycaster.castRay([
      this._lines.vertices.mesh as any,
    ]);
    if (found && found.index !== undefined) {
      const id = this._lines.vertices.idMap.getId(found.index);
      this._lines.selectPoints(true, [id]);
    }
  }

  delete() {
    this._lines.removePoints();
    // TODO: Clay bug: The selected point keeps existing in vertices
    this._lines.vertices.selected.data.clear();
    this._lines.vertices.mesh.geometry.computeBoundingSphere();

    this.updateLongProjection();
    this.cache();
  }

  // TODO: All fragment clases should include built-in caching in dexie
  cache(id = this._defaultID) {
    const points: [number, number, number][] = [];
    const lines: [number, number][] = [];
    const newPointIDMap = new Map<number, number>();
    let pointCounter = 0;
    for (const key in this._lines.points) {
      const pointID = parseInt(key, 10);
      const coords = this._lines.vertices.get(pointID);
      if (!coords) continue;
      points.push(coords);
      newPointIDMap.set(pointID, pointCounter);
      pointCounter++;
    }
    for (const id in this._lines.list) {
      const line = this._lines.list[id];
      const newStart = newPointIDMap.get(line.start);
      const newEnd = newPointIDMap.get(line.end);
      if (newStart !== undefined && newEnd !== undefined) {
        lines.push([newStart, newEnd]);
      }
    }

    localStorage.setItem(id, JSON.stringify({ lines, points }));
  }

  loadCached(id = this._defaultID) {
    const cached = localStorage.getItem(id);
    if (!cached) return;
    const parsed = JSON.parse(cached);
    if (parsed.points && parsed.points.length) {
      this._lines.addPoints(parsed.points);
    }
    if (parsed.lines && parsed.lines.length) {
      for (const line of parsed.lines) {
        this._lines.add(line);
      }
    }
    this.updateLongProjection();
  }

  // Navigate through road with clipping plane
  // TODO: 2d window with floorplan

  async focus(animate = true) {
    const data = this._roadDiagramData;
    if (!data) return;
    const { mousePosition, mouseSegment } = data;
    if (mousePosition === null || mouseSegment === null) {
      if (this.planeEnabled && this._plane) {
        await this._plane.setEnabled(false);
      }
      return;
    }

    const index = mouseSegment * 6;
    const position = this._longProjection.mesh.geometry.attributes.position;
    const x1Diagram = position.array[index];
    const x2Diagram = position.array[index + 3];
    const segmentLength = x2Diagram - x1Diagram;
    const portion = (mousePosition - x1Diagram) / segmentLength;

    const axis3d = this._lines.mesh.geometry.attributes.position.array;
    const x1 = axis3d[index];
    const y1 = axis3d[index + 1];
    const z1 = axis3d[index + 2];
    const x2 = axis3d[index + 3];
    const y2 = axis3d[index + 4];
    const z2 = axis3d[index + 5];

    const p1 = new THREE.Vector3(x1, y1, z1);
    const p2 = new THREE.Vector3(x2, y2, z2);
    const vector = p2.sub(p1);
    vector.normalize();
    const target = vector.clone().multiplyScalar(segmentLength * portion);
    target.add(p1);

    const scale = this.offset;
    this._focusSphere.scale.set(scale, scale, scale);
    this._focusSphere.position.copy(target);

    const camera = this.components.camera as SimpleCamera;

    if (this.planeEnabled) {
      if (!this._plane) {
        const clipper = await this.components.tools.get(EdgesClipper);
        clipper.enabled = true;
        this._plane = clipper.createFromNormalAndCoplanarPoint(vector, target);
        this._plane.visible = false;
      }
      if (!this._plane.enabled) {
        await this._plane.setEnabled(true);
      }
      if (this._plane.edges.fillVisible) {
        this._plane.edges.fillVisible = false;
      }
      this._plane.setFromNormalAndCoplanarPoint(vector, target);

      if (this._scene2dTop) {
        this._focusBox.position.copy(target);
        this._focusBox.rotation.y = Math.atan2(vector.x, vector.z);
        this._scene2dTop.controls.target.copy(target);
        this._scene2dTop.camera.position.x = target.x;
        this._scene2dTop.camera.position.z = target.z;
        this._scene2dTop.camera.up.copy(vector);
        await this._scene2dTop.update();
      }
    }

    await camera.controls.fitToSphere(this._focusSphere, animate);
  }

  // saveView();

  // deleteView();

  // goTo(view: any);

  private setupUI() {
    const { main, drawer } = this.setupMainMenu();
    this.setupTransMenu();
    this.setupTopMenu();
    this.uiElement.set({ main, window: drawer });
  }

  private setupTransMenu() {
    const { scene2d } = this.newFloating2DScene("Section");
    const gray = new THREE.Color(0.05, 0.05, 0.05);
    const grid2d = new THREE.GridHelper(1000, 1000, gray, gray);
    grid2d.position.z = -20;
    grid2d.rotation.x = Math.PI / 2;
    scene2d.camera.add(grid2d);
    this._scene2dTrans = scene2d;
  }

  private setupTopMenu() {
    const { scene2d } = this.newFloating2DScene("Floorplan", true);
    const { postproduction } = scene2d.renderer as PostproductionRenderer;
    postproduction.overrideClippingPlanes = true;
    postproduction.overrideScene = scene2d.get();
    postproduction.overrideCamera = scene2d.camera;
    postproduction.enabled = true;
    scene2d.camera.position.set(0, 20, 0);
    scene2d.controls.target.set(0, 0, 0);
    const scene = scene2d.get();
    const light = new THREE.AmbientLight();
    scene.add(light);
    this._focusBox.position.y -= 1;
    scene.add(this._focusBox);
    this._scene2dTop = scene2d;
  }

  private newFloating2DScene(title: string, postproduction = false) {
    const floatingWindow = new FloatingWindow(this.components);
    this.components.ui.add(floatingWindow);
    floatingWindow.title = title;

    const scene2d = new Simple2DScene(this.components, postproduction);
    const canvasUIElement = scene2d.uiElement.get("canvas");
    floatingWindow.addChild(canvasUIElement);

    const style = floatingWindow.slots.content.domElement.style;
    style.padding = "0";
    style.overflow = "hidden";

    const { clientHeight, clientWidth } = floatingWindow.domElement;
    scene2d.setSize(clientHeight, clientWidth);

    floatingWindow.onResized.add(async () => {
      const { clientHeight, clientWidth } = floatingWindow.domElement;
      scene2d.setSize(clientHeight, clientWidth);
      await scene2d.update();
    });

    const canvas = scene2d.uiElement.get("canvas");
    canvas.domElement.addEventListener("mousemove", async () => {
      await scene2d.update();
    });
    canvas.domElement.addEventListener("wheel", async () => {
      await scene2d.update();
    });

    return { scene2d, floatingWindow };
  }

  private setupMainMenu() {
    const main = new Button(this.components);
    main.materialIcon = "edit_road";
    main.tooltip = "Road navigator";

    const drawer = new Drawer(this.components);
    this.components.ui.add(drawer);
    drawer.alignment = "top";

    const scene2d = new Simple2DScene(this.components);

    const canvasUIElement = scene2d.uiElement.get("canvas");
    drawer.addChild(canvasUIElement);
    const { clientHeight, clientWidth } = drawer.domElement;

    const windowStyle = drawer.slots.content.domElement.style;
    windowStyle.padding = "10px";
    windowStyle.overflow = "hidden";

    scene2d.setSize(clientHeight - 20, clientWidth - 20);

    drawer.onResized.add(async () => {
      const { clientHeight, clientWidth } = drawer.domElement;
      scene2d.setSize(clientHeight - 20, clientWidth - 20);
      await scene2d.update();
    });

    this._scene2dSide = scene2d;
    this._scene2dSide.camera.zoom = 3;

    // TODO: Make sure all this is disposed
    const mouse = new THREE.Vector2();
    const canvas = canvasUIElement.domElement;

    canvas.addEventListener("mousemove", async () => {
      await scene2d.update();
    });
    canvas.addEventListener("wheel", async () => {
      await scene2d.update();
    });

    let mouseDown = false;

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000));
    plane.rotation.x += Math.PI / 90;
    plane.position.z = -10;

    canvas.addEventListener("mousedown", async (event) => {
      if (event.button !== 0) {
        return;
      }
      mouseDown = true;
      if (!this._roadDiagramData || !this._roadDiagramData.mousePosition) {
        return;
      }
      if (this._plane && !this._plane.enabled) {
        await this._plane.setEnabled(true);
        await this._plane.edges.setVisible(true);
      }
      for (const id in this._crossSectionLines) {
        const { fill } = this._crossSectionLines[id];
        fill.visible = false;
      }
    });

    canvas.addEventListener("mouseup", async (event) => {
      if (event.button !== 0) {
        return;
      }
      mouseDown = false;
      if (!this._roadDiagramData || !this._roadDiagramData.mousePosition) {
        if (this._plane) {
          await this._plane.setEnabled(false);
          await this._plane.edges.setVisible(false);
        }
        return;
      }
      if (this._plane) {
        this._plane.edges.fillVisible = true;
        await this._plane.updateFill();
      }
      for (const id in this._crossSectionLines) {
        const { fill } = this._crossSectionLines[id];
        fill.visible = true;
      }
      await this.updateCrossSection();
      await this.updateFloorPlan();
    });

    canvas.addEventListener("mousemove", async (event) => {
      if (!this._roadDiagramData) {
        return;
      }
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, scene2d.camera);
      const intersects = raycaster.intersectObject(plane);
      if (intersects.length) {
        const found = intersects[0];
        const x = found.point.x;
        if (x > 0 && x < this._roadDiagramData.length) {
          this._roadDiagramData.mousePosition = x;
        } else {
          this._roadDiagramData.mousePosition = null;
        }
        this.updateMouseMarker();
      }

      if (mouseDown) {
        await this.focus();
        if (this._scene2dTrans) {
          await this._scene2dTrans.update();
        }
      }
    });

    // TODO: make smart 2d grid

    const gray = new THREE.Color(0.05, 0.05, 0.05);
    const grid2d = new THREE.GridHelper(1000, 1000, gray, gray);
    grid2d.position.z = -10;
    grid2d.rotation.x = Math.PI / 2;
    scene2d.camera.add(grid2d);

    main.onClick.add(() => {
      drawer.visible = !drawer.visible;
    });
    return { main, drawer };
  }

  private updateLongProjection() {
    // Assuming that the lines of the road axis are sorted
    // TODO: Sort them in case they are not
    if (this._scene2dSide) {
      this._longProjection.mesh.removeFromParent();
      this._longProjection.vertices.mesh.removeFromParent();
    }

    this._longProjection.clear();
    this._longProjection = new Lines();
    if (this._scene2dSide) {
      const scene2d = this._scene2dSide.get();
      scene2d.add(this._longProjection.mesh);
      scene2d.add(this._longProjection.vertices.mesh);
    }

    if (!this._roadDiagramData) {
      this._roadDiagramData = {
        length: 0,
        mousePosition: null,
        mouseSegment: null,
      };
    }

    const vertices = this._lines.mesh.geometry.attributes.position;

    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const points: [number, number, number][] = [];
    let accumulatedX = 0;
    let minY = Number.MAX_VALUE;
    for (let i = 0; i < vertices.count * 3 - 5; i += 6) {
      const x1 = vertices.array[i];
      const y1 = vertices.array[i + 1];
      const z1 = vertices.array[i + 2];
      const x2 = vertices.array[i + 3];
      const y2 = vertices.array[i + 4];
      const z2 = vertices.array[i + 5];

      if (!points.length) {
        points.push([0, y1, 0]);
      }

      v1.set(x1, y1, z1);
      v2.set(x2, y2, z2);
      const length = v1.distanceTo(v2);
      accumulatedX += length;
      points.push([accumulatedX, y2, 0]);

      if (y2 < minY) {
        minY = y2;
      }
    }
    const ids = this._longProjection.addPoints(points);
    this._longProjection.add(ids);

    this._roadDiagramData.length = accumulatedX;

    this.updateSideDiagram(accumulatedX, minY);
  }

  private updateSideDiagram(distance: number, minY: number) {
    if (!this._scene2dSide) return;
    const start = new THREE.Vector3(0, 0, 0);
    const one = new THREE.Vector3(1, 0, 0);
    const end = new THREE.Vector3(distance, 0, 0);

    if (!this._sideRoadDiagram) {
      const regularLine = new THREE.LineBasicMaterial({ color: 0xffffff });
      const dashedLine = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 1,
        gapSize: 0.5,
      });

      const sideBottomGeometry = new THREE.BufferGeometry().setFromPoints([
        start,
        one,
      ]);

      const middleGeometry = new THREE.BufferGeometry().setFromPoints([
        start,
        one,
      ]);

      const top = new THREE.Line(sideBottomGeometry, regularLine);
      const middle = new THREE.Line(middleGeometry, dashedLine);
      const bottom = new THREE.Line(sideBottomGeometry, regularLine);

      top.position.y = minY - 6;
      middle.position.y = minY - 10;
      bottom.position.y = minY - 13;
      const scene = this._scene2dSide.get();
      scene.add(top);
      scene.add(middle);
      scene.add(bottom);

      this._sideRoadDiagram = { top, bottom, middle };
    }

    const { top, bottom, middle } = this._sideRoadDiagram;
    top.position.y = minY - 6;
    middle.position.y = minY - 10;
    bottom.position.y = minY - 13;
    top.scale.x = distance;
    bottom.scale.x = distance;
    middle.geometry.setFromPoints([start, end]);
    middle.computeLineDistances();
  }

  private async updateCrossSection() {
    if (!this._plane || !this._scene2dTrans) return;
    const meshes = this._plane.edges.get();
    const scene = this._scene2dTrans.get();
    const translate = new THREE.Matrix4();
    const rotate = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    for (const name in meshes) {
      if (!this._crossSectionLines[name]) {
        const mesh = new THREE.LineSegments();
        const fill = new THREE.Mesh();
        this._crossSectionLines[name] = { mesh, fill };
        scene.add(mesh, fill);
      }
      const edge = meshes[name];
      const { mesh, fill } = this._crossSectionLines[name];
      mesh.geometry = edge.mesh.geometry;
      mesh.material = edge.mesh.material;
      // TODO: This doesn't work well
      // Bring rotation to center looking at camera
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      fill.position.set(0, 0, 0);
      fill.rotation.set(0, 0, 0);
      mesh.updateMatrix();
      if (this._plane) {
        const trans = this._plane.origin;
        translate.makeTranslation(trans.x, trans.y, trans.z).invert();
        rotate.lookAt(trans, this._plane.normal, up).invert();
        mesh.applyMatrix4(translate);
        mesh.applyMatrix4(rotate);
        fill.applyMatrix4(translate);
        fill.applyMatrix4(rotate);
      }
      if (edge.fill) {
        fill.geometry = edge.fill.mesh.geometry;
        fill.material = edge.fill.mesh.material;
      }
      await this._scene2dTrans.update();
    }
  }

  private async updateFloorPlan() {
    if (!this._plane || !this._scene2dTop) return;
    const fragments = await this.components.tools.get(FragmentManager);
    const scene = this._scene2dTop.get();
    for (const group of fragments.groups) {
      if (this._floorPlanElements[group.uuid]) continue;
      const newGroup = new THREE.Group();
      this._floorPlanElements[group.uuid] = newGroup;
      scene.add(newGroup);
      newGroup.matrix = group.matrix;
      for (const child of group.children) {
        const frag = child as FragmentMesh;
        const size = frag.fragment.capacity;
        const newMesh = new THREE.InstancedMesh(
          frag.geometry,
          this._basicMaterial,
          size
        );
        newMesh.instanceMatrix = frag.instanceMatrix;
        newMesh.instanceMatrix.needsUpdate = true;
        newGroup.add(newMesh);
      }
    }
  }

  private updateMouseMarker() {
    if (!this._scene2dSide || !this._roadDiagramData) return;
    if (!this._mouseMarker) {
      const scene = this._scene2dSide.get();
      const redLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const top = new THREE.Vector3(0, 1000, 0);
      const bottom = new THREE.Vector3(0, -1000, 0);
      const geometry = new THREE.BufferGeometry().setFromPoints([top, bottom]);
      const line = new THREE.Line(geometry, redLineMaterial);
      scene.add(line);

      const zero = new THREE.Vector3();
      const verticalGeom = new THREE.BufferGeometry().setFromPoints([zero]);
      const verticalMat = new THREE.PointsMaterial({
        color: "red",
        size: 15,
      });
      const verticalMarker = new THREE.Points(verticalGeom, verticalMat);
      scene.add(verticalMarker);

      this._mouseMarker = { line, verticalMarker };
    }
    const { line, verticalMarker } = this._mouseMarker;
    line.visible = this._roadDiagramData.mousePosition !== null;
    verticalMarker.visible = this._roadDiagramData.mousePosition !== null;
    if (this._roadDiagramData.mousePosition !== null) {
      line.position.x = this._roadDiagramData.mousePosition;
      verticalMarker.position.x = this._roadDiagramData.mousePosition;
      verticalMarker.position.y = this.getCurrentVerticalProjectionHeight();
    }
  }

  private getCurrentVerticalProjectionHeight() {
    if (!this._roadDiagramData) return 0;
    if (this._roadDiagramData.mousePosition === null) return 0;
    const { mousePosition } = this._roadDiagramData;
    const geometry = this._longProjection.mesh.geometry;
    const position = geometry.attributes.position;
    const size = position.count * 3;
    let segmentIndex = 0;
    for (let i = 0; i < size - 5; i += 6) {
      const x1 = position.array[i];
      const y1 = position.array[i + 1];
      const x2 = position.array[i + 3];
      const y2 = position.array[i + 4];
      if (mousePosition > x1 && mousePosition < x2) {
        this._roadDiagramData.mouseSegment = segmentIndex;
        const slope = (y2 - y1) / (x2 - x1);
        const originY = (mousePosition - x1) * slope;
        return originY + y1;
      }
      segmentIndex++;
    }
    return 0;
  }
}

ToolComponent.libraryUUIDs.add(RoadNavigator.uuid);
