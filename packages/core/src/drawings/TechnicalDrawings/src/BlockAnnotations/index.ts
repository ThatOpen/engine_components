import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Disposable } from "../../../../core/Types";
import { Components } from "../../../../core/Components";
import { TechnicalDrawing } from "../TechnicalDrawing";
import { AnnotationSystem } from "../DrawingSystem";
import { BlockDefinition, BlockInsertion, BlockInsertionData, BlockStyle } from "./src/types";

export * from "./src";

interface BlockAnnotationsSystem {
  item:   BlockInsertion;
  data:   BlockInsertionData;
  style:  BlockStyle;
  handle: "position" | "rotation" | "scale";
}

/** Global drawing system that manages block insertions across all {@link TechnicalDrawing} instances. */
export class BlockAnnotations
  extends AnnotationSystem<BlockAnnotationsSystem>
  implements Disposable
{
  enabled = true;
  declare readonly _item: BlockInsertion;

  // Shared geometry must never be disposed when clearing/redrawing groups.
  protected override _ownsChildGeometry = false;

  /**
   * Named block definitions in block-local XZ space.
   * Register via {@link define}. Geometry is shared across all drawings and insertions.
   */
  readonly definitions = new FRAGS.DataMap<string, BlockDefinition>();

  /**
   * A **block** is a named, reusable geometry definition (e.g. a furniture symbol
   * or a detail imported from a DXF). Multiple insertions of the same block share
   * the same `THREE.BufferGeometry`, so only the transform (position, rotation,
   * scale) differs per instance.
   *
   * Register via {@link TechnicalDrawings.use}:
   * ```ts
   * const blocks = techDrawings.use(BlockAnnotations);
   * ```
   *
   * Typical workflow:
   * ```ts
   * // 1. Project external geometry to drawing space
   * const projected = TechnicalDrawing.toDrawingSpace(ifcLines, drawing);
   *
   * // 2. Register the block definition (global — do this once)
   * blocks.define("CHAIR", { lines: projected.geometry });
   *
   * // 3. Insert on any drawing
   * blocks.add(drawing, { blockName: "CHAIR", position, rotation: 0, scale: 1, style: "default" });
   * ```
   */
  constructor(components: Components) {
    super(components);

    this.styles.set("default", {
      color: 0x000000,
      textOffset: 0,
      fontSize: 0,
    });
  }

  // ─── pickHandle ────────────────────────────────────────────────────────────

  pickHandle(
    _drawing: TechnicalDrawing,
    _ray: THREE.Ray,
    _threshold?: number,
  ): { uuid: string; handle: "position" | "rotation" | "scale" } | null {
    return null; // TODO: implement block handle picking
  }

  // ─── pick (override) ──────────────────────────────────────────────────────

  /**
   * Overrides the base `pick` to use the correct `LineSegments.raycast` (pair-based)
   * rather than `THREE.Line.prototype.raycast` (continuous-line).
   */
  override pick(ray: THREE.Ray, threshold = 0.05): string | null {
    const raycaster = new THREE.Raycaster();
    raycaster.ray.copy(ray);
    (raycaster.params as any).Line         = { threshold };
    (raycaster.params as any).LineSegments = { threshold };

    let closest: string | null = null;
    let closestDist = Infinity;

    for (const drawing of this._knownDrawings) {
      for (const [uuid, entry] of drawing.annotations) {
        if (entry.system !== (this as any)) continue;
        const group = entry.three;
        group.updateWorldMatrix(true, true);
        group.traverse((child) => {
          if (child === group) return;
          if (!(child instanceof THREE.LineSegments)) return;
          const hits: THREE.Intersection[] = [];
          // child.raycast uses the correct pair-based LineSegments implementation.
          child.raycast(raycaster, hits);
          if (hits.length > 0 && hits[0].distance < closestDist) {
            closestDist = hits[0].distance;
            closest = uuid;
          }
        });
      }
    }

    return closest;
  }

  // ─── define ───────────────────────────────────────────────────────────────

  /**
   * Registers a block definition by name (global — not tied to any drawing).
   * All geometry must be in block-local XZ space (Y = 0).
   * Use {@link TechnicalDrawing.toDrawingSpace} to project external geometry first.
   *
   * Replaces any existing definition with the same name without disposing the old geometry.
   */
  define(name: string, definition: BlockDefinition): void {
    this.definitions.set(name, definition);
  }

  // ─── _buildGroup ──────────────────────────────────────────────────────────

  protected _buildGroup(ins: BlockInsertion, _style: BlockStyle): THREE.Group {
    const def = this.definitions.get(ins.blockName);
    if (!def) throw new Error(`BlockAnnotations: block "${ins.blockName}" is not defined.`);

    const group = new THREE.Group();

    if (def.lines) {
      // Geometry is shared — do NOT dispose it on clear/redraw (_ownsChildGeometry = false).
      const ls = new THREE.LineSegments(def.lines, this._getMaterial(ins.style));
      ls.layers.set(1);
      ls.userData.isDimension = true;
      group.add(ls);
    }

    if (def.mesh) {
      const mesh = new THREE.Mesh(def.mesh, this._getMeshMaterial(ins.style));
      mesh.layers.set(1);
      mesh.userData.isBlockMesh = true;
      group.add(mesh);
    }

    return group;
  }

  // ─── _onAfterPersist ──────────────────────────────────────────────────────

  protected override _onAfterPersist(ins: BlockInsertion, group: THREE.Group): void {
    group.position.set(ins.position.x, 0, ins.position.z);
    group.rotation.set(0, ins.rotation, 0);
    group.scale.setScalar(ins.scale);
  }

  // ─── _onDispose ───────────────────────────────────────────────────────────

  protected override _onDispose(): void {
    for (const def of this.definitions.values()) {
      def.lines?.dispose();
      def.mesh?.dispose();
    }
    this.definitions.clear();
  }
}
