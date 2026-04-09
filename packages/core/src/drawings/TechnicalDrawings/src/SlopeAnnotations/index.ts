import * as THREE from "three";
import { Disposable } from "../../../../core/Types";
import { Components } from "../../../../core/Components";
import { TechnicalDrawing } from "../TechnicalDrawing";
import { AnnotationSystem } from "../DrawingSystem";
import {
  SlopeAnnotation,
  SlopeAnnotationData,
  SlopeAnnotationStyle,
} from "./src/types";
import { buildSlopePositions, getSlopeTip } from "./src/geometry";
import { FilledArrowTick, NoTick } from "../ticks";

export * from "./src";

interface SlopeAnnotationSystem {
  item:   SlopeAnnotation;
  data:   SlopeAnnotationData;
  style:  SlopeAnnotationStyle;
  handle: string;
}

/** Global drawing system that manages slope annotations across all {@link TechnicalDrawing} instances. */
export class SlopeAnnotations
  extends AnnotationSystem<SlopeAnnotationSystem>
  implements Disposable
{
  enabled = true;
  declare readonly _item: SlopeAnnotation;

  /**
   * Because slope data comes from the 3D model, there is no state machine.
   * Call {@link add} directly with the computed slope values:
   * ```ts
   * slopes.add(drawing, { position, direction, slope, style: "default" });
   * ```
   */
  constructor(components: Components) {
    super(components);

    this.styles.set("default", {
      lineTick: NoTick,
      meshTick: FilledArrowTick,
      tickSize: 0.4,
      length: 3,
      color: 0x000000,
      textOffset: 0.1,
      fontSize: 0.45,
      format: "percentage",
    });
  }

  // ─── pickHandle ────────────────────────────────────────────────────────────

  pickHandle(
    _drawing: TechnicalDrawing,
    _ray: THREE.Ray,
    _threshold?: number,
  ): { uuid: string; handle: string } | null {
    return null; // TODO: implement slope annotation handle picking
  }

  // ─── _buildGroup ──────────────────────────────────────────────────────────

  protected _buildGroup(ann: SlopeAnnotation, style: SlopeAnnotationStyle): THREE.Group {
    const group = new THREE.Group();

    const positions = buildSlopePositions(ann, style);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const ls = new THREE.LineSegments(geo, this._getMaterial(ann.style));
    ls.layers.set(1);
    ls.userData.isDimension = true;
    group.add(ls);

    if (style.meshTick) {
      const tip = getSlopeTip(ann, style.length);
      const triangles = style.meshTick(tip, ann.direction, style.tickSize);
      const meshGeo = new THREE.BufferGeometry();
      meshGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(triangles), 3));
      const mesh = new THREE.Mesh(meshGeo, this._getMeshMaterial(ann.style));
      mesh.layers.set(1);
      mesh.userData.isDimension = true;
      group.add(mesh);
    }

    return group;
  }
}
