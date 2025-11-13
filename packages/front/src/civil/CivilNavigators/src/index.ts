import * as THREE from "three";
import * as OBC from "@thatopen/components";
// import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/Addons.js";
import { CivilRaycaster } from "../../CivilRaycaster";
import { CivilUtils } from "../../Utils/civil-utils";
import { CivilPoint } from "../../Types";

export class CivilNavigator implements OBC.Disposable {
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  alignments: THREE.Group[] = [];

  components: OBC.Components;

  /**
   * Event triggered when a marker (point) on a curve changes.
   * Provides information about the alignment, percentage, type of marker, and the curve.
   */
  readonly onMarkerChange = new OBC.Event<{
    alignment: THREE.Group;
    curve: THREE.Line;
    point: THREE.Vector3;
    normal: THREE.Vector3;
  }>();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  highlightMaterial: LineMaterial;

  increments = 20;

  screenDistanceLimit = 0.1;

  fadeInTime = 500;

  private _mouseMarkers?: {
    hover: CSS2DObject;
    select: CSS2DObject;
  };

  private _highlighted = new Set<THREE.Group>();

  private _stationPoints = new Map<
    string,
    { alignment: THREE.Group; labels: THREE.Group }
  >();

  private readonly _originalHighlightMaterialId = "originalHighlightMaterial";

  private _world: OBC.World | null = null;

  private _raycaster: CivilRaycaster;

  private _stationLabelColor = new THREE.Color(0xffffff);
  private _stationLabelBackgroundColor = new THREE.Color(0x7a4bd1);
  private _stationPointerColor = new THREE.Color(0xffffff);
  private _stationPointerBackgroundColor = new THREE.Color(0x494cb6);

  /**
   * Getter for the world property.
   * Returns the current world instance.
   * @returns {OBC.World | null} The current world instance or null if not set.
   */
  get world() {
    return this._world;
  }

  /**
   * Setter for the world property.
   * Sets the world instance and initializes the component.
   * @param {OBC.World | null} world - The new world instance or null to clear the current world.
   */
  set world(world: OBC.World | null) {
    if (world === this._world) {
      return;
    }

    if (this._world) {
      this.setupEvents(false);
    }

    this._world = world;

    // this._highlighter?.dispose();
    this._mouseMarkers?.hover.removeFromParent();
    this._mouseMarkers?.select.removeFromParent();
    this._mouseMarkers?.hover.element.remove();
    this._mouseMarkers?.select.element.remove();

    if (!world) {
      return;
    }

    this._raycaster.world = world;

    const select = this.newCivilLabel(0, "stationPointer");
    world.scene.three.add(select);
    select.visible = false;
    select.element.style.transition = "";

    const hover = this.newCivilLabel(0, "stationPointer");
    hover.element.style.transition = "";
    hover.element.style.opacity = "0.5";
    world.scene.three.add(hover);
    hover.visible = false;

    this._mouseMarkers = {
      select,
      hover,
    };

    this.setupEvents(true);
  }

  get stationLabelColor() {
    return this._stationLabelColor;
  }

  set stationLabelColor(color: THREE.Color) {
    this._stationLabelColor = color;
    const hex = `#${color.getHexString()}`;
    for (const [, { labels }] of this._stationPoints) {
      const children = [...labels.children] as CSS2DObject[];
      for (const child of children) {
        const label = this.getLabel(child);
        label.style.color = hex;
        const point = this.getPoint(child);
        point.style.backgroundColor = hex;
      }
    }
  }

  get stationLabelBackgroundColor() {
    return this._stationLabelBackgroundColor;
  }

  set stationLabelBackgroundColor(color: THREE.Color) {
    this._stationLabelBackgroundColor = color;
    const hex = `#${color.getHexString()}`;
    for (const [, { labels }] of this._stationPoints) {
      const children = [...labels.children] as CSS2DObject[];
      for (const child of children) {
        const label = this.getLabel(child);
        label.style.backgroundColor = hex;
        const point = this.getPoint(child);
        point.style.border = `2px solid ${hex}`;
      }
    }
  }

  get stationPointerColor() {
    return this._stationPointerColor;
  }

  set stationPointerColor(color: THREE.Color) {
    this._stationPointerColor = color;
    const hex = `#${color.getHexString()}`;
    if (this._mouseMarkers) {
      const select = this._mouseMarkers.select;
      const label = this.getLabel(select);
      label.style.color = hex;
      const point = this.getPoint(select);
      point.style.backgroundColor = hex;
    }
  }

  get stationPointerBackgroundColor() {
    return this._stationPointerBackgroundColor;
  }

  set stationPointerBackgroundColor(color: THREE.Color) {
    this._stationPointerBackgroundColor = color;
    const hex = `#${color.getHexString()}`;
    if (this._mouseMarkers) {
      const select = this._mouseMarkers.select;
      const label = this.getLabel(select);
      label.style.backgroundColor = hex;
      const point = this.getPoint(select);
      point.style.border = `2px solid ${hex}`;
    }
  }

  constructor(components: OBC.Components, highlightMaterial: LineMaterial) {
    this.components = components;
    this.highlightMaterial = highlightMaterial;
    this._raycaster = new CivilRaycaster(components);
    this._raycaster.alignments = this.alignments;
  }

  dispose() {
    this.clearHighlight();
    this.clearStations();
    this.alignments = [];
    this._mouseMarkers?.hover.removeFromParent();
    this._mouseMarkers?.select.removeFromParent();
    this._mouseMarkers?.hover.element.remove();
    this._mouseMarkers?.select.element.remove();
    this._raycaster.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  updateAlignments() {
    this._raycaster.update();
  }

  setMarkerAtPoint(point: CivilPoint, type: "select" | "hover") {
    if (!this._mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    this.updateMarkerValue(point, type);
    this._mouseMarkers[type].visible = true;
    this._mouseMarkers[type].position.copy(point.point);
  }

  highlight(alignment: THREE.Group, removePrevious = true) {
    if (removePrevious) {
      this.clearHighlight(this._highlighted);
    }
    for (const child of alignment.children) {
      if (!("isLineSegments2" in child && "material" in child)) continue;
      child.userData[this._originalHighlightMaterialId] = child.material;
      child.material = this.highlightMaterial;
    }
    this._highlighted.add(alignment);
  }

  clearHighlight(alignments = this._highlighted as Iterable<THREE.Group>) {
    for (const alignment of alignments) {
      for (const child of alignment.children) {
        if (!("isLineSegments2" in child && "material" in child)) continue;
        child.material = child.userData[this._originalHighlightMaterialId];
        delete child.userData[this._originalHighlightMaterialId];
      }
    }
    this._highlighted.clear();
  }

  createStations(alignment: THREE.Group) {
    if (!this.world || this._stationPoints.has(alignment.uuid)) {
      return;
    }
    const labels = new THREE.Group();
    this.world.scene.three.add(labels);
    this._stationPoints.set(alignment.uuid, { alignment, labels });
  }

  clearStations(ids = this._stationPoints.keys() as Iterable<string>) {
    for (const id of ids) {
      const found = this._stationPoints.get(id);
      if (!found) {
        continue;
      }
      this.clearLabels(found.labels);
      this._stationPoints.delete(id);
    }
  }

  updateStations() {
    if (!this.world) {
      throw new Error("No world found!");
    }

    if (!this.world.renderer) {
      throw new Error("No renderer found!");
    }

    const camera = this.world.camera.three;
    const renderer = this.world.renderer.three;
    const frustum = new THREE.Frustum();

    const planes = renderer.clippingPlanes;

    // Limit screen distance to prevent many labels stacked over one another
    const prevScreenPos = new THREE.Vector3();
    const currentScreenPos = new THREE.Vector3();
    let firstPoint = true;

    const tempPoint = new THREE.Vector3();

    // if (this.mouseMarkers) {
    //   const select = this.mouseMarkers.select;
    //   if (this.isLabelClipped(planes, select.position)) {
    //     select.visible = false;
    //   }
    // }

    for (const [, { alignment, labels }] of this._stationPoints) {
      this.clearLabels(labels);

      alignment.updateWorldMatrix(true, true);

      const initialStation = alignment.userData.initialStation as number;
      let currentDistance = initialStation || 0;

      const start = currentDistance % this.increments;
      let nextStationLabel = initialStation + this.increments - start;

      for (const curve of alignment.children) {
        if (!("isLine2" in curve)) {
          continue;
        }

        // Only compute labels if the curve is visible

        const line = curve as Line2;
        if (!line.geometry.boundingBox) {
          line.geometry.computeBoundingBox();
        }

        frustum.setFromProjectionMatrix(
          new THREE.Matrix4().multiplyMatrices(
            camera.projectionMatrix,
            camera.matrixWorldInverse,
          ),
        );

        if (!frustum.intersectsBox(line.geometry.boundingBox!)) {
          const curveLength = CivilUtils.curveLength(curve);
          currentDistance += curveLength;
          const startDiff = currentDistance % this.increments;
          nextStationLabel = currentDistance + this.increments - startDiff;
          continue;
        }

        const points = curve.userData.points as Float32Array;

        // First point

        const firstX = points[0];
        const firstY = points[1];
        const firstZ = points[2];

        tempPoint.set(firstX, firstY, firstZ);
        tempPoint.applyMatrix4(curve.matrixWorld);
        const isFirstClipped = this.isLabelClipped(planes, tempPoint);

        if (!isFirstClipped) {
          // If it's the first point, just create the label
          if (firstPoint) {
            firstPoint = false;
            prevScreenPos.set(tempPoint.x, tempPoint.y, tempPoint.z);
            prevScreenPos.project(camera);
            prevScreenPos.z = 0;
            const startCivilLabel = this.newCivilLabel(
              currentDistance,
              "stationLabel",
            );
            startCivilLabel.position.set(tempPoint.x, tempPoint.y, tempPoint.z);
            labels.children.push(startCivilLabel);
          } else {
            // If it's not the first point, check if the distance
            // to the previous point complies with the screen distance limit
            currentScreenPos.set(tempPoint.x, tempPoint.y, tempPoint.z);
            currentScreenPos.project(camera);
            currentScreenPos.z = 0;
            const screenDistance = prevScreenPos.distanceTo(currentScreenPos);
            if (screenDistance > this.screenDistanceLimit) {
              const startLabel = this.newCivilLabel(
                currentDistance,
                "stationLabel",
              );
              startLabel.position.set(tempPoint.x, tempPoint.y, tempPoint.z);
              labels.children.push(startLabel);
              prevScreenPos.copy(currentScreenPos);
            }
          }
        }

        // Middle points

        const p1 = new THREE.Vector3();
        const p2 = new THREE.Vector3();

        for (let i = 0; i < points.length - 3; i += 3) {
          p1.set(points[i], points[i + 1], points[i + 2]);
          p2.set(points[i + 3], points[i + 4], points[i + 5]);

          const distance = p1.distanceTo(p2);

          const newDistance = currentDistance + distance;

          const direction = p2.clone().sub(p1).normalize();

          while (newDistance > nextStationLabel) {
            const offsetDistance = nextStationLabel - currentDistance;
            const offsetVec = direction.clone();
            offsetVec.multiplyScalar(offsetDistance);
            const { x, y, z } = p1.clone().add(offsetVec);

            tempPoint.set(x, y, z);
            tempPoint.applyMatrix4(curve.matrixWorld);

            const isClipped = this.isLabelClipped(planes, tempPoint);

            if (!isClipped && frustum.containsPoint(tempPoint)) {
              currentScreenPos.set(tempPoint.x, tempPoint.y, tempPoint.z);
              currentScreenPos.project(camera);
              currentScreenPos.z = 0;
              const screenDistance = prevScreenPos.distanceTo(currentScreenPos);
              if (screenDistance > this.screenDistanceLimit) {
                const civilLabel = this.newCivilLabel(
                  nextStationLabel,
                  "stationLabel",
                );
                civilLabel.position.set(tempPoint.x, tempPoint.y, tempPoint.z);
                labels.children.push(civilLabel);
                prevScreenPos.copy(currentScreenPos);
              }
            }

            nextStationLabel += this.increments;
          }

          currentDistance += distance;
        }

        // Last point

        const lastX = points[points.length - 3];
        const lastY = points[points.length - 2];
        const lastZ = points[points.length - 1];

        tempPoint.set(lastX, lastY, lastZ);
        tempPoint.applyMatrix4(curve.matrixWorld);

        const isLastClipped = this.isLabelClipped(planes, tempPoint);
        if (isLastClipped || !frustum.containsPoint(tempPoint)) {
          continue;
        }

        currentScreenPos.set(tempPoint.x, tempPoint.y, tempPoint.z);
        currentScreenPos.project(camera);
        currentScreenPos.z = 0;
        const screenDistance = prevScreenPos.distanceTo(currentScreenPos);
        if (screenDistance > this.screenDistanceLimit) {
          const endCivilLabel = this.newCivilLabel(
            currentDistance,
            "stationLabel",
          );
          endCivilLabel.position.set(tempPoint.x, tempPoint.y, tempPoint.z);
          labels.children.push(endCivilLabel);
          prevScreenPos.copy(currentScreenPos);
        }
      }
    }
  }

  getCursorValue() {
    if (!this._mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    const root = this._mouseMarkers.select.element.children[0];
    const label = root.children[0] as HTMLElement;
    return label.innerText;
  }

  setCursorValue(value: string, type: "select" | "hover") {
    if (!this._mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    const root = this._mouseMarkers[type].element.children[0];
    const label = root.children[0] as HTMLElement;
    label.innerText = value;
  }

  private isLabelClipped(planes: THREE.Plane[], point: THREE.Vector3) {
    for (const plane of planes) {
      const distance = plane.distanceToPoint(point);
      const isInFront = distance > 0;
      const isClipped = !isInFront;
      if (isClipped) {
        return true;
      }
    }
    return false;
  }

  private clearLabels(labels: THREE.Group) {
    const children = [...labels.children] as CSS2DObject[];
    for (const child of children) {
      child.element.style.opacity = "0";
    }
    setTimeout(() => {
      for (const child of children) {
        child.removeFromParent();
        child.element.remove();
        child.visible = false;
      }
    }, this.fadeInTime);
  }

  private newCivilLabel(
    distance: number,
    type: "stationLabel" | "stationPointer",
  ) {
    const root = document.createElement("div");

    const color =
      type === "stationLabel"
        ? this.stationLabelColor
        : this.stationPointerColor;

    const backgroundColor =
      type === "stationLabel"
        ? this.stationLabelBackgroundColor
        : this.stationPointerBackgroundColor;

    const point = document.createElement("div");
    point.style.width = "4px";
    point.style.height = "4px";
    point.style.borderRadius = "50%";
    point.style.backgroundColor = `#${color.getHexString()}`;
    point.style.border = `2px solid #${backgroundColor.getHexString()}`;
    point.style.display = "flex";
    point.style.justifyContent = "center";

    const formattedStation = this.getFormattedStation(distance);

    const sign = document.createElement("div");
    sign.innerText = formattedStation;
    sign.style.backgroundColor = `#${backgroundColor.getHexString()}`;
    sign.style.color = `#${color.getHexString()}`;
    sign.style.padding = "0.3rem";
    sign.style.position = "absolute";
    sign.style.bottom = "1rem";
    sign.style.borderRadius = "6px";
    sign.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 4px 6px";

    point.appendChild(sign);

    const stationPoint = new CSS2DObject(root);

    root.appendChild(point);
    if (type === "stationLabel") {
      root.style.transition = `opacity ${this.fadeInTime}ms ease-in-out`;
      root.style.opacity = "0";
      setTimeout(() => {
        root.style.opacity = "1";
      });
    }

    return stationPoint;
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("No world found!");
    }

    if (this.world.isDisposing || !this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    const casters = this.components.get(OBC.Raycasters) as OBC.Raycasters;
    const raycaster = casters.get(this.world);
    // TODO: Make this configurable?
    if (!raycaster.three.params.Line) {
      raycaster.three.params.Line = {
        threshold: 10,
      };
    }

    // this.world.renderer?.onResize.remove(this.updateLinesResolution);
    dom.removeEventListener("pointerdown", this.onPointerDown);
    dom.removeEventListener("pointerup", this.onPointerUp);
    dom.removeEventListener("pointermove", this.onMouseMove);

    if (active) {
      dom.addEventListener("pointerdown", this.onPointerDown);
      dom.addEventListener("pointerup", this.onPointerUp);
      dom.addEventListener("pointermove", this.onMouseMove);
      // this.world.renderer?.onResize.add(this.updateLinesResolution);
    }
  }

  private _pointerDown = performance.now();
  private _pointerDownTime = 150;
  private onPointerDown = () => {
    this._pointerDown = performance.now();
  };

  private onPointerUp = () => {
    if (performance.now() - this._pointerDown > this._pointerDownTime) {
      return;
    }
    const result = this.setMarkerToMouse("select");
    if (!result) {
      return;
    }
    this.onMarkerChange.trigger(result);
  };

  private onMouseMove = () => {
    this.setMarkerToMouse("hover");
  };

  private setMarkerToMouse(marker: "hover" | "select") {
    if (!this.enabled || !this._mouseMarkers) {
      return null;
    }
    if (!this.world) {
      throw new Error("No world found!");
    }

    const intersects = this._raycaster.castRay();
    if (!intersects) {
      this._mouseMarkers[marker].visible = false;
      return null;
    }

    this._mouseMarkers[marker].visible = true;
    const point = intersects.point;
    this._mouseMarkers[marker].position.copy(point);

    this.updateMarkerValue(intersects, marker);

    return intersects;
  }

  private updateMarkerValue(
    civilPoint: CivilPoint,
    marker: "hover" | "select",
  ) {
    if (!this._mouseMarkers) {
      return;
    }
    const { alignment, curve, point } = civilPoint;
    const percentage = CivilUtils.curvePointToAlignmentPercentage(
      alignment,
      point,
      curve,
    );

    if (percentage === null) {
      throw new Error("Point is not on the curve");
    }

    const distance = percentage * CivilUtils.alignmentLength(alignment);
    const absoluteDistance = distance + alignment.userData.initialStation;
    const formattedStation = this.getFormattedStation(absoluteDistance);
    this.setCursorValue(formattedStation, marker);
  }

  private getFormattedStation(distance: number) {
    const kilometers = Math.floor(distance / 1000);
    const meters = Math.round(distance - kilometers * 1000);
    const formattedStation = `${kilometers}+${meters}`;
    return formattedStation;
  }

  private getLabel(child: CSS2DObject) {
    const root = child.element.children[0];
    const label = root.children[0] as HTMLElement;
    return label;
  }

  private getPoint(child: CSS2DObject) {
    return child.element.children[0] as HTMLElement;
  }
}
