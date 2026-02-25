import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Angle } from "../../utils";
import { Mark } from "../../core";
import { Measurement } from "../Measurement";
import { newDimensionMark, newEndPoint } from "../utils";
import {
  AngleMeasurerModes,
  AngleMeasurerTempData,
  AngleVisual,
} from "./src";

const ARC_SEGMENTS = 32;
const ARC_RADIUS_FACTOR = 0.3;
const LABEL_OFFSET_FACTOR = 1.4;

/**
 * A measurement tool to measure angles between 3 points in 3D and display a visual arc with the numeric angle value.
 */
export class AngleMeasurement extends Measurement<Angle, "angle"> {
  static uuid = "2c88a142-2378-422e-b26a-bb2710841813" as const;

  private _visuals = new Map<Angle, AngleVisual>();

  private _temp: AngleMeasurerTempData = {
    clickCount: 0,
    angle: new Angle(),
  };

  /** The list of available measurement modes. */
  modes: AngleMeasurerModes[number][] = ["free"];

  private _mode: AngleMeasurerModes[number] = "free";

  /** The current measurement mode. Changing the mode cancels any in-progress creation. */
  get mode(): AngleMeasurerModes[number] {
    return this._mode;
  }

  set mode(value: AngleMeasurerModes[number]) {
    this._mode = value;
    this.cancelCreation();
    this.onStateChanged.trigger(["mode"]);
  }

  constructor(components: OBC.Components) {
    super(components, "angle");
    components.add(AngleMeasurement.uuid, this);
    this.initHandlers();
  }

  private initHandlers() {
    this.list.onItemAdded.add((angle) => {
      const visual = this.createAngleVisual(angle);
      this._visuals.set(angle, visual);
    });

    this.list.onBeforeDelete.add((angle) => {
      const visual = this._visuals.get(angle);
      if (visual) {
        this.disposeVisual(visual);
        this._visuals.delete(angle);
      }
    });

    this.list.onCleared.add(() => {
      for (const [, visual] of this._visuals) {
        this.disposeVisual(visual);
      }
      this._visuals.clear();
    });

    this.onPointerStop.add(() => this.updatePreview());

    this.onVisibilityChange.add((value) => {
      for (const [, visual] of this._visuals) {
        visual.group.visible = value as boolean;
        visual.label.visible = value as boolean;
        for (const ep of visual.endpoints) ep.visible = value as boolean;
      }
    });
  }

  /** {@link OBC.Createable.create}. Requires 3 successive calls (start, vertex, end) to complete an angle. */
  create = async () => {
    if (!this.enabled) return;

    const pickResult = await this._vertexPicker.get({
      snappingClasses: this.snappings,
    });

    if (!pickResult?.point) return;
    const point = pickResult.point;

    if (this._temp.clickCount === 0) {
      // First click: set start, show rubber-band line
      this._temp.angle.start.copy(point);
      this._temp.clickCount = 1;
      this.initFirstPreview(point);
    } else if (this._temp.clickCount === 1) {
      // Second click: set vertex, upgrade to full angle preview
      this._temp.angle.vertex.copy(point);
      this._temp.clickCount = 2;
      this.upgradeToAnglePreview(point);
    } else if (this._temp.clickCount === 2) {
      // Third click: set end and finalize
      this._temp.angle.end.copy(point);
      this.endCreation();
    }
  };

  /** {@link OBC.Createable.endCreation}. Finalizes the current angle after the third point is set. */
  endCreation = () => {
    if (!this.enabled) return;
    if (this._temp.clickCount !== 2) return;

    this.disposeAllPreview();
    this.list.add(this._temp.angle.clone());

    this._temp.clickCount = 0;
    this._temp.angle = new Angle();
  };

  /** {@link OBC.Createable.cancelCreation}. Cancels the in-progress angle and disposes preview visuals. */
  cancelCreation = () => {
    this.disposeAllPreview();
    this._temp.clickCount = 0;
    this._temp.angle = new Angle();
  };

  /** {@link OBC.Createable.delete}. Deletes the angle measurement under the cursor via raycasting. */
  delete = () => {
    if (!this.enabled) return;
    if (this.list.size === 0 || !this.world) return;

    const boxes: THREE.Mesh[] = [];
    for (const [, visual] of this._visuals) {
      boxes.push(visual.boundingBox);
    }

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersect = caster.castRayToObjects(boxes);

    if (!intersect) return;

    for (const [angle, visual] of this._visuals) {
      if (visual.boundingBox === intersect.object) {
        this.list.delete(angle);
        break;
      }
    }
  };

  /** {@link OBC.Disposable.dispose}. */
  dispose() {
    for (const [, visual] of this._visuals) {
      this.disposeVisual(visual);
    }
    this._visuals.clear();
    this.disposeAllPreview();
    super.dispose();
  }

  // -- Preview for click 1: rubber-band line from start to cursor --

  private initFirstPreview(start: THREE.Vector3) {
    if (!this.world) return;

    const group = new THREE.Group();
    group.renderOrder = 2;
    const geom = new THREE.BufferGeometry().setFromPoints([start, start]);
    const line = new THREE.Line(geom, this.linesMaterial);
    group.add(line);

    const endpoint = this.createEndpointMark(group, start);

    this.world.scene.three.add(group);
    this._temp.previewGroup = group;
    this._temp.previewLine = line;
    this._temp.previewEndpoint = endpoint;
  }

  // -- Preview for click 2: upgrade to two lines + arc + label --

  private upgradeToAnglePreview(_vertex: THREE.Vector3) {
    if (!this.world) return;

    // Clean up the simple rubber-band preview
    this.disposeFirstPreview();

    // Create full angle preview visual
    this._temp.visual = this.createAngleVisual(this._temp.angle);
  }

  private async updatePreview() {
    if (!this.world) return;

    const pickResult = await this._vertexPicker.get({
      snappingClasses: this.snappings,
    });
    if (!pickResult?.point) return;
    const cursor = pickResult.point;

    if (this._temp.clickCount === 1 && this._temp.previewLine) {
      // Update rubber-band line: start → cursor
      const pos = this._temp.previewLine.geometry.attributes
        .position as THREE.BufferAttribute;
      pos.setXYZ(1, cursor.x, cursor.y, cursor.z);
      pos.needsUpdate = true;
    } else if (this._temp.clickCount === 2 && this._temp.visual) {
      // Update full angle preview: vertex → cursor as end
      this._temp.angle.end.copy(cursor);
      this.updateAngleVisual(this._temp.visual, this._temp.angle);
    }
  }

  private disposeFirstPreview() {
    if (this._temp.previewEndpoint) {
      this._temp.previewEndpoint.dispose();
      this._temp.previewEndpoint = undefined;
    }
    if (this._temp.previewLine) {
      this._temp.previewLine.geometry.dispose();
      this._temp.previewLine = undefined;
    }
    if (this._temp.previewGroup) {
      this._temp.previewGroup.removeFromParent();
      this._temp.previewGroup = undefined;
    }
  }

  private disposeAllPreview() {
    this.disposeFirstPreview();
    if (this._temp.visual) {
      this.disposeVisual(this._temp.visual);
      this._temp.visual = undefined;
    }
  }

  // -- Full angle visual (used for both preview and final) --

  private createAngleVisual(angle: Angle): AngleVisual {
    if (!this.world) {
      throw new Error("AngleMeasurement: world is needed!");
    }

    const group = new THREE.Group();
    group.renderOrder = 2;
    const material = this.linesMaterial;
    const colorHex = `#${material.color.getHexString()}`;

    // Line from vertex to start
    const geom1 = new THREE.BufferGeometry().setFromPoints([
      angle.vertex,
      angle.start,
    ]);
    const line1 = new THREE.Line(geom1, material);

    // Line from vertex to end
    const geom2 = new THREE.BufferGeometry().setFromPoints([
      angle.vertex,
      angle.end,
    ]);
    const line2 = new THREE.Line(geom2, material);

    // Arc
    const arcGeom = AngleMeasurement.createArcGeometry(
      angle.vertex,
      angle.start,
      angle.end,
    );
    const arc = new THREE.Line(arcGeom, material);

    group.add(line1, line2, arc);

    // Endpoints at all 3 points
    const endpoints = [
      this.createEndpointMark(group, angle.start, colorHex),
      this.createEndpointMark(group, angle.vertex, colorHex),
      this.createEndpointMark(group, angle.end, colorHex),
    ];

    // Label
    const labelElement = newDimensionMark();
    labelElement.textContent = this.formatAngle(angle);
    labelElement.style.backgroundColor = colorHex;
    const label = new Mark(this.world, labelElement, group);
    label.three.renderOrder = 1;

    const labelPos = AngleMeasurement.getArcMidpoint(
      angle.vertex,
      angle.start,
      angle.end,
    );
    label.three.position.copy(labelPos);

    // Bounding box for raycasting
    const boundingBox = this.createBoundingBox(angle);
    boundingBox.visible = false;
    group.add(boundingBox);

    this.world.scene.three.add(group);

    return { group, line1, line2, arc, label, endpoints, boundingBox };
  }

  private updateAngleVisual(visual: AngleVisual, angle: Angle) {
    // Update line1 (vertex -> start)
    const pos1 = visual.line1.geometry.attributes
      .position as THREE.BufferAttribute;
    pos1.setXYZ(0, angle.vertex.x, angle.vertex.y, angle.vertex.z);
    pos1.setXYZ(1, angle.start.x, angle.start.y, angle.start.z);
    pos1.needsUpdate = true;

    // Update line2 (vertex -> end)
    const pos2 = visual.line2.geometry.attributes
      .position as THREE.BufferAttribute;
    pos2.setXYZ(0, angle.vertex.x, angle.vertex.y, angle.vertex.z);
    pos2.setXYZ(1, angle.end.x, angle.end.y, angle.end.z);
    pos2.needsUpdate = true;

    // Update arc
    visual.arc.geometry.dispose();
    visual.arc.geometry = AngleMeasurement.createArcGeometry(
      angle.vertex,
      angle.start,
      angle.end,
    );

    // Update endpoints
    visual.endpoints[0].three.position.copy(angle.start);
    visual.endpoints[1].three.position.copy(angle.vertex);
    visual.endpoints[2].three.position.copy(angle.end);

    // Update label
    visual.label.three.element.textContent = this.formatAngle(angle);
    const labelPos = AngleMeasurement.getArcMidpoint(
      angle.vertex,
      angle.start,
      angle.end,
    );
    visual.label.three.position.copy(labelPos);

    // Update bounding box
    this.updateBoundingBox(visual.boundingBox, angle);
  }

  private disposeVisual(visual: AngleVisual) {
    visual.label.dispose();
    for (const ep of visual.endpoints) ep.dispose();
    visual.line1.geometry.dispose();
    visual.line2.geometry.dispose();
    visual.arc.geometry.dispose();
    visual.boundingBox.geometry.dispose();
    (visual.boundingBox.material as THREE.Material).dispose();
    visual.group.removeFromParent();
  }

  // -- Helpers --

  private createEndpointMark(
    parent: THREE.Object3D,
    position: THREE.Vector3,
    color?: string,
  ): Mark {
    if (!this.world) {
      throw new Error("AngleMeasurement: world is needed!");
    }
    const element = newEndPoint({
      border: `2px solid ${color ?? `#${this.linesMaterial.color.getHexString()}`}`,
    });
    const mark = new Mark(this.world, element, parent);
    mark.three.position.copy(position);
    return mark;
  }

  private formatAngle(angle: Angle): string {
    const value = angle.value;
    const formattedValue = Measurement.valueFormatter
      ? Measurement.valueFormatter(value)
      : value.toFixed(this.rounding);
    return `${formattedValue}${this.units === "deg" ? "\u00B0" : " rad"}`;
  }

  private createBoundingBox(angle: Angle): THREE.Mesh {
    const center = new THREE.Vector3()
      .add(angle.start)
      .add(angle.vertex)
      .add(angle.end)
      .divideScalar(3);

    const size = Math.max(
      angle.vertex.distanceTo(angle.start),
      angle.vertex.distanceTo(angle.end),
      0.5,
    );

    const box = new THREE.Mesh(
      new THREE.SphereGeometry(size * 0.5),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    box.position.copy(center);
    return box;
  }

  private updateBoundingBox(box: THREE.Mesh, angle: Angle) {
    const center = new THREE.Vector3()
      .add(angle.start)
      .add(angle.vertex)
      .add(angle.end)
      .divideScalar(3);
    box.position.copy(center);
  }

  private static createArcGeometry(
    vertex: THREE.Vector3,
    start: THREE.Vector3,
    end: THREE.Vector3,
  ): THREE.BufferGeometry {
    const vA = new THREE.Vector3().subVectors(start, vertex);
    const vB = new THREE.Vector3().subVectors(end, vertex);
    const lenA = vA.length();
    const lenB = vB.length();

    if (lenA === 0 || lenB === 0) {
      return new THREE.BufferGeometry();
    }

    const normalizedA = vA.clone().normalize();
    const normalizedB = vB.clone().normalize();
    const radius = Math.min(lenA, lenB) * ARC_RADIUS_FACTOR;
    const angle = normalizedA.angleTo(normalizedB);

    const normal = new THREE.Vector3().crossVectors(normalizedA, normalizedB);

    if (normal.lengthSq() < 1e-10) {
      return new THREE.BufferGeometry();
    }

    normal.normalize();

    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= ARC_SEGMENTS; i++) {
      const t = i / ARC_SEGMENTS;
      const dir = normalizedA.clone().applyAxisAngle(normal, t * angle);
      points.push(vertex.clone().add(dir.multiplyScalar(radius)));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }

  private static getArcMidpoint(
    vertex: THREE.Vector3,
    start: THREE.Vector3,
    end: THREE.Vector3,
  ): THREE.Vector3 {
    const vA = new THREE.Vector3().subVectors(start, vertex);
    const vB = new THREE.Vector3().subVectors(end, vertex);
    const lenA = vA.length();
    const lenB = vB.length();

    if (lenA === 0 || lenB === 0) return vertex.clone();

    const normalizedA = vA.clone().normalize();
    const normalizedB = vB.clone().normalize();
    const radius = Math.min(lenA, lenB) * ARC_RADIUS_FACTOR;
    const angle = normalizedA.angleTo(normalizedB);

    const normal = new THREE.Vector3().crossVectors(normalizedA, normalizedB);
    if (normal.lengthSq() < 1e-10) return vertex.clone();
    normal.normalize();

    const midDir = normalizedA.clone().applyAxisAngle(normal, angle / 2);
    return vertex.clone().add(midDir.multiplyScalar(radius * LABEL_OFFSET_FACTOR));
  }
}
