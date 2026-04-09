import * as THREE from "three";
import { Components } from "../../../core";
import { TechnicalDrawing } from "../../TechnicalDrawings/src/TechnicalDrawing";
import { TechnicalDrawings } from "../../TechnicalDrawings";
import { LinearAnnotations } from "../../TechnicalDrawings/src/LinearAnnotations";
import { AngleAnnotations } from "../../TechnicalDrawings/src/AngleAnnotations";
import { LeaderAnnotations } from "../../TechnicalDrawings/src/LeaderAnnotations";
import { SlopeAnnotations } from "../../TechnicalDrawings/src/SlopeAnnotations";
import { CalloutAnnotations } from "../../TechnicalDrawings/src/CalloutAnnotations";
import { BlockAnnotations } from "../../TechnicalDrawings/src/BlockAnnotations";
import { DrawingSystem } from "../../TechnicalDrawings/src/DrawingSystem";
import { DrawingViewport } from "../../TechnicalDrawings/src/DrawingViewport";
import {
  buildDimensionPositions,
  getDimensionTickEndpoints,
} from "../../TechnicalDrawings/src/LinearAnnotations/src/geometry";
import {
  buildAnglePositions,
  computeAngle,
  computeBisectorAngle,
  getAngleTickEndpoints,
} from "../../TechnicalDrawings/src/AngleAnnotations/src/geometry";
import { buildLeaderPositions } from "../../TechnicalDrawings/src/LeaderAnnotations/src/geometry";
import {
  buildSlopePositions,
  getSlopeTip,
} from "../../TechnicalDrawings/src/SlopeAnnotations/src/geometry";
import { formatSlope } from "../../TechnicalDrawings/src/SlopeAnnotations/src/format";
import { buildCalloutPositions } from "../../TechnicalDrawings/src/CalloutAnnotations/src/geometry";
import { DrawingLayer } from "../../TechnicalDrawings/src/types";

// ─── ACI color lookup ─────────────────────────────────────────────────────────

const _ACI_TABLE: Array<[number, number]> = [
  [0xff0000, 1],
  [0xffff00, 2],
  [0x00ff00, 3],
  [0x00ffff, 4],
  [0x0000ff, 5],
  [0xff00ff, 6],
  [0xffffff, 7],
  [0x000000, 7],
];

function hexToAci(hex: number): number {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  let bestAci = 7;
  let bestDist = Infinity;
  for (const [h, aci] of _ACI_TABLE) {
    const dist = (r - ((h >> 16) & 0xff)) ** 2 + (g - ((h >> 8) & 0xff)) ** 2 + (b - (h & 0xff)) ** 2;
    if (dist < bestDist) { bestDist = dist; bestAci = aci; }
  }
  return bestAci;
}

// ─── DXF string builder ───────────────────────────────────────────────────────

class DxfWriter {
  private readonly _lines: string[] = [];
  private _handleCounter = 1;

  p(code: number, value: string | number): this {
    this._lines.push(String(code), String(value));
    return this;
  }

  n(code: number, value: number, prec = 6): this {
    this._lines.push(String(code), value.toFixed(prec));
    return this;
  }

  handle(): string {
    return (this._handleCounter++).toString(16).toUpperCase();
  }

  build(): string {
    return this._lines.join("\n") + "\n";
  }
}

// ─── Public context types ─────────────────────────────────────────────────────

/** Optional text formatting overrides for {@link DxfWriteContext.writeText}. */
export interface DxfTextOptions {
  layer?: string;
  aciColor?: number;
  rotDeg?: number;
  hAlign?: 0 | 1 | 2;
}

/**
 * Write-context passed to custom system exporters registered via
 * {@link DxfExporter.registerSystemExporter}.
 */
export interface DxfWriteContext {
  writeLine(x1: number, y1: number, x2: number, y2: number, layer?: string, aciColor?: number): void;
  writePairs(positions: ArrayLike<number>, layer?: string, aciColor?: number): void;
  writeText(text: string, x: number, y: number, height: number, options?: DxfTextOptions): void;
  /** Writes a flat XYZ triangle array (9 values per triangle) as DXF SOLID entities. */
  writeMeshTriangles(triangles: number[], layer?: string, aciColor?: number): void;
  hexToAci(hex: number): number;
  textAngle(dx: number, dz: number): number;
}

// ─── Entry types ──────────────────────────────────────────────────────────────

/** One viewport placement within a drawing entry. */
export interface DxfViewportEntry {
  /** Viewport to clip and transform against. If omitted, exports the full drawing. */
  viewport?: DrawingViewport;
  /** Horizontal position in mm from the top-left of the drawing area (paper-space only). */
  x?: number;
  /** Vertical position in mm from the top-left of the drawing area (paper-space only). */
  y?: number;
}

/** One drawing with one or more viewport placements to export. */
export interface DxfDrawingEntry {
  drawing: TechnicalDrawing;
  viewports: DxfViewportEntry[];
}

/** Paper sheet dimensions for paper-space export. */
export interface DxfPaperOptions {
  /** Total paper width in mm. */
  widthMm: number;
  /** Total paper height in mm. */
  heightMm: number;
  /** Uniform margin in mm. */
  margin: number;
}

// ─── DxfExporter ──────────────────────────────────────────────────────────────

/** Serializes {@link TechnicalDrawing} content to DXF format (AC1015 / AutoCAD R2000). */
export class DxfExporter {
  /** Decimal places used when formatting measurement text in DXF. */
  precision = 2;

  /**
   * Export configuration options.
   * - `trueColor` — when `true`, upgrades the output to AC1018 (AutoCAD 2004+) and
   *   emits group code 420 (RGB true color) alongside group code 62 (ACI) on every
   *   entity. Modern viewers prioritize 420; older apps fall back to 62.
   *   Note: the adaptive black/white behavior of ACI 7 is lost when true color is on,
   *   since viewers treat the explicit RGB as fixed. Defaults to `false`.
   */
  config = { trueColor: false };

  private _viewport: DrawingViewport | null = null;
  private _paperSlot: {
    x: number; y: number; mmPerUnit: number; vpLeft: number; vpTop: number;
  } | null = null;

  private readonly _annotationLayers = new Map<string, string>();
  private readonly _systemExporters = new Map<
    new (...args: any[]) => DrawingSystem<any>,
    (sys: DrawingSystem<any>, ctx: DxfWriteContext) => void
  >();

  /**
   * Used through {@link DxfManager}:
   * ```ts
   * const dxf = components.get(OBC.DxfManager).exporter.export([
   *   { drawing, viewports: [{ viewport, x: 10, y: 10 }] },
   * ], { widthMm: 420, heightMm: 297, margin: 10 });
   * ```
   */
  constructor(private readonly _components: Components) {}

  /**
   * Registers a custom DXF exporter for a {@link DrawingSystem} subclass.
   */
  registerSystemExporter<T extends DrawingSystem<any>>(
    SystemClass: new (...args: any[]) => T,
    handler: (sys: T, ctx: DxfWriteContext) => void,
  ): void {
    this._systemExporters.set(
      SystemClass,
      handler as (sys: DrawingSystem<any>, ctx: DxfWriteContext) => void,
    );
  }

  /**
   * Serializes one or more drawings to a DXF string.
   *
   * When `paper` is supplied the output uses millimetres (INSUNITS=4) and
   * each viewport is placed at its (`x`, `y`) position on the sheet.
   * Without `paper` the output uses world units (INSUNITS=6).
   *
   * @param entries - Drawings with their viewport placements.
   * @param paper   - Optional paper sheet dimensions for paper-space export.
   */
  export(entries: DxfDrawingEntry[], paper?: DxfPaperOptions): string {
    const isPaper = !!paper;
    const w = new DxfWriter();

    // Collect layers from all drawings (deduplicated by name).
    const layerMap = new Map<string, DrawingLayer>();
    for (const entry of entries) {
      for (const layer of entry.drawing.layers.values()) {
        if (!layerMap.has(layer.name)) layerMap.set(layer.name, layer);
      }
    }
    const layers = [...layerMap.values()];

    const techDrawings = this._components.get(TechnicalDrawings);
    const blocks = techDrawings.systems.get(BlockAnnotations) as BlockAnnotations | undefined;
    const blockNames = blocks ? [...blocks.definitions.keys()] : [];

    this._writeHeader(w, isPaper);
    this._writeTables(w, layers, blockNames);
    this._writeBlocks(w, blocks ?? null);

    w.p(0, "SECTION").p(2, "ENTITIES");

    if (isPaper && paper) this._writePaperBorders(w, paper);

    for (const entry of entries) {
      // Build uuid→layer lookup for this drawing's annotations.
      entry.drawing.three.traverse((child) => {
        if (child.userData.isDimension && child.userData.annotationUuid) {
          this._annotationLayers.set(child.userData.annotationUuid, child.userData.layer ?? "0");
        }
      });

      for (const slot of entry.viewports) {
        this._viewport = slot.viewport ?? null;

        if (isPaper && slot.viewport) {
          const vp = slot.viewport;
          const dH = paper!.heightMm - 2 * paper!.margin;
          this._paperSlot = {
            x: slot.x ?? 0,
            // slot.y is screen-space (Y down from top); DXF uses Y up from bottom.
            y: dH - (slot.y ?? 0),
            mmPerUnit: 1000 / vp.drawingScale,
            vpLeft: vp.left,
            vpTop: vp.top,
          };
        } else {
          this._paperSlot = null;
        }

        this._writeViewportBorder(w);
        this._writeRawLines(w, entry.drawing);
        this._writeLinearAnnotations(w, entry.drawing);
        this._writeAngleAnnotations(w, entry.drawing);
        this._writeLeaderAnnotations(w, entry.drawing);
        this._writeSlopeAnnotations(w, entry.drawing);
        this._writeCalloutAnnotations(w, entry.drawing);
        this._writeBlockInsertions(w, entry.drawing);
        this._writeCustomSystems(w, entry.drawing);
      }

      this._annotationLayers.clear();
    }

    w.p(0, "ENDSEC");
    this._writeObjects(w);
    w.p(0, "EOF");

    this._viewport = null;
    this._paperSlot = null;

    return w.build();
  }

  // ─── Sections ────────────────────────────────────────────────────────────────

  private _writeHeader(w: DxfWriter, paperSpace: boolean): void {
    w.p(0, "SECTION").p(2, "HEADER");
    w.p(9, "$ACADVER").p(1, this.config.trueColor ? "AC1018" : "AC1015");
    // 4 = millimetres (paper-space output), 6 = metres (world-unit output).
    w.p(9, "$INSUNITS").p(70, paperSpace ? 4 : 6);
    w.p(0, "ENDSEC");
  }

  private _writeTables(w: DxfWriter, layers: DrawingLayer[], blockNames: string[]): void {
    w.p(0, "SECTION").p(2, "TABLES");

    w.p(0, "TABLE").p(2, "VPORT").p(70, 0).p(0, "ENDTAB");

    w.p(0, "TABLE").p(2, "LTYPE").p(70, 1);
    w.p(0, "LTYPE").p(2, "CONTINUOUS").p(70, 0)
      .p(3, "Solid line").p(72, 65).p(73, 0).n(40, 0.0);
    w.p(0, "ENDTAB");

    w.p(0, "TABLE").p(2, "LAYER").p(70, layers.length);
    for (const layer of layers) {
      const aci = hexToAci(layer.material.color.getHex());
      w.p(0, "LAYER").p(2, layer.name).p(70, 0).p(62, aci).p(6, "CONTINUOUS");
    }
    w.p(0, "ENDTAB");

    w.p(0, "TABLE").p(2, "STYLE").p(70, 1);
    w.p(0, "STYLE").p(2, "STANDARD").p(70, 0)
      .n(40, 0.0).n(41, 1.0).n(50, 0.0).p(71, 0).n(42, 0.2)
      .p(3, "txt").p(4, "");
    w.p(0, "ENDTAB");

    w.p(0, "TABLE").p(2, "VIEW").p(70, 0).p(0, "ENDTAB");
    w.p(0, "TABLE").p(2, "UCS").p(70, 0).p(0, "ENDTAB");
    w.p(0, "TABLE").p(2, "APPID").p(70, 1);
    w.p(0, "APPID").p(2, "ACAD").p(70, 0);
    w.p(0, "ENDTAB");
    w.p(0, "TABLE").p(2, "DIMSTYLE").p(70, 0).p(0, "ENDTAB");

    const records = ["*Model_Space", "*Paper_Space", ...blockNames];
    w.p(0, "TABLE").p(2, "BLOCK_RECORD").p(70, records.length);
    for (const name of records) {
      w.p(0, "BLOCK_RECORD").p(5, w.handle()).p(2, name);
    }
    w.p(0, "ENDTAB");

    w.p(0, "ENDSEC");
  }

  private _writeBlocks(w: DxfWriter, blocks: BlockAnnotations | null): void {
    w.p(0, "SECTION").p(2, "BLOCKS");
    this._writeBlock(w, "*Model_Space", null);
    this._writeBlock(w, "*Paper_Space", null);
    if (blocks) {
      for (const [name, def] of blocks.definitions) {
        this._writeBlock(w, name, def.lines ?? null);
      }
    }
    w.p(0, "ENDSEC");
  }

  private _writeBlock(w: DxfWriter, name: string, geo: THREE.BufferGeometry | null): void {
    w.p(0, "BLOCK").p(5, w.handle()).p(8, "0")
      .p(2, name).p(70, 0).n(10, 0.0).n(20, 0.0).n(30, 0.0)
      .p(3, name).p(1, "");
    if (geo) {
      // Block definitions are in block-local space — skip viewport clipping/transform.
      const savedVp = this._viewport;
      const savedPs = this._paperSlot;
      this._viewport = null;
      this._paperSlot = null;
      this._writeGeoAsLines(w, geo, "0");
      this._viewport = savedVp;
      this._paperSlot = savedPs;
    }
    w.p(0, "ENDBLK").p(5, w.handle()).p(8, "0");
  }

  /** Writes a rectangular border for the active viewport (no-op when no viewport is set). */
  private _writeViewportBorder(w: DxfWriter): void {
    if (!this._viewport) return;
    const vp = this._viewport;
    const x0 = this._tx(vp.left);
    const x1 = this._tx(vp.right);
    const y0 = this._ty(-vp.bottom);
    const y1 = this._ty(-vp.top);
    this._writeRawLine(w, x0, y0, x1, y0, "0", 7);
    this._writeRawLine(w, x1, y0, x1, y1, "0", 7);
    this._writeRawLine(w, x1, y1, x0, y1, "0", 7);
    this._writeRawLine(w, x0, y1, x0, y0, "0", 7);
  }

  /**
   * Writes drawing-area and full-sheet border rectangles in paper-space coordinates.
   * Origin (0, 0) is the top-left corner of the drawing area (inside margins).
   */
  private _writePaperBorders(w: DxfWriter, paper: DxfPaperOptions): void {
    const { margin: m, widthMm, heightMm } = paper;
    const dW = widthMm  - 2 * m;
    const dH = heightMm - 2 * m;

    // Drawing area border
    this._writeRawLine(w,  0,  0, dW,  0, "0", 7);
    this._writeRawLine(w, dW,  0, dW, dH, "0", 7);
    this._writeRawLine(w, dW, dH,  0, dH, "0", 7);
    this._writeRawLine(w,  0, dH,  0,  0, "0", 7);

    // Full sheet border (extends into the margin area)
    this._writeRawLine(w, -m,     -m,     dW + m, -m,     "0", 7);
    this._writeRawLine(w, dW + m, -m,     dW + m, dH + m, "0", 7);
    this._writeRawLine(w, dW + m, dH + m, -m,     dH + m, "0", 7);
    this._writeRawLine(w, -m,     dH + m, -m,     -m,     "0", 7);
  }

  private _writeObjects(w: DxfWriter): void {
    w.p(0, "SECTION").p(2, "OBJECTS");
    w.p(0, "DICTIONARY").p(5, w.handle()).p(330, 0).p(100, "AcDbRootDictionary");
    w.p(0, "ENDSEC");
  }

  // ─── Entity writers ──────────────────────────────────────────────────────────

  private _writeRawLines(w: DxfWriter, drawing: TechnicalDrawing): void {
    drawing.three.traverse((child) => {
      if (!(child instanceof THREE.LineSegments)) return;
      if (child.userData.isDimension) return;
      if (child.parent?.userData.blockUuid) return;
      if (!child.visible) return;
      const layer = (child.userData.layer as string) ?? "0";
      const hex = (child.material as THREE.LineBasicMaterial).color.getHex();
      this._writeGeoAsLines(w, child.geometry, layer, hexToAci(hex), hex);
    });
  }

  private _writeLinearAnnotations(w: DxfWriter, drawing: TechnicalDrawing): void {
    const sys = this._components.get(TechnicalDrawings).systems.get(LinearAnnotations) as LinearAnnotations | undefined;
    if (!sys) return;

    for (const [, dim] of drawing.annotations.getBySystem(sys)) {
      const style = sys.styles.get(dim.style) ?? sys.styles.get("default")!;
      const color = hexToAci(style.color);
      const layer = this._annotationLayers.get(dim.uuid) ?? "0";
      if (drawing.layers.get(layer)?.visible === false) continue;
      const positions = buildDimensionPositions(dim, style);
      if (!this._fullyInViewport(this._bboxFromPositions(positions))) continue;
      this._writePairsAsLines(w, positions, layer, color, style.color);

      if (style.meshTick) {
        for (const { tip, dir } of getDimensionTickEndpoints(dim)) {
          this._writeMeshTriangles(w, style.meshTick(tip, dir, style.tickSize), layer, color, style.color);
        }
      }

      const ab = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
      const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
      const sign = dim.offset >= 0 ? 1 : -1;
      const dimA = dim.pointA.clone().addScaledVector(perp, dim.offset);
      const dimB = dim.pointB.clone().addScaledVector(perp, dim.offset);
      const mid = dimA.clone().add(dimB).multiplyScalar(0.5)
        .addScaledVector(perp, (style.textOffset + style.fontSize * 0.5) * sign);
      const unit = style.unit ?? { factor: 1, suffix: "m" };
      const text = `${(dim.pointA.distanceTo(dim.pointB) * unit.factor).toFixed(this.precision)} ${unit.suffix}`;
      this._writeText(w, text, mid.x, mid.z, style.fontSize, layer, color,
        this._textAngle(ab.x, ab.z), 1, 2, style.color);
    }
  }

  private _writeAngleAnnotations(w: DxfWriter, drawing: TechnicalDrawing): void {
    const sys = this._components.get(TechnicalDrawings).systems.get(AngleAnnotations) as AngleAnnotations | undefined;
    if (!sys) return;

    for (const [, dim] of drawing.annotations.getBySystem(sys)) {
      const style = sys.styles.get(dim.style) ?? sys.styles.get("default")!;
      const color = hexToAci(style.color);
      const layer = this._annotationLayers.get(dim.uuid) ?? "0";
      if (drawing.layers.get(layer)?.visible === false) continue;
      const positions = buildAnglePositions(dim, style);
      if (!this._fullyInViewport(this._bboxFromPositions(positions))) continue;
      this._writePairsAsLines(w, positions, layer, color, style.color);

      if (style.meshTick) {
        for (const { tip, dir } of getAngleTickEndpoints(dim)) {
          this._writeMeshTriangles(w, style.meshTick(tip, dir, style.tickSize), layer, color, style.color);
        }
      }

      const bisAngle = computeBisectorAngle(dim);
      const r = dim.arcRadius + style.textOffset;
      const tx = dim.vertex.x + Math.cos(bisAngle) * r;
      const tz = dim.vertex.z + Math.sin(bisAngle) * r;
      const deg = THREE.MathUtils.radToDeg(computeAngle(dim));
      this._writeText(w, `${deg.toFixed(this.precision)}\u00b0`,
        tx, tz, style.fontSize, layer, color, 0, 1, 0, style.color);
    }
  }

  private _writeLeaderAnnotations(w: DxfWriter, drawing: TechnicalDrawing): void {
    const sys = this._components.get(TechnicalDrawings).systems.get(LeaderAnnotations) as LeaderAnnotations | undefined;
    if (!sys) return;

    for (const [, ann] of drawing.annotations.getBySystem(sys)) {
      const style = sys.styles.get(ann.style) ?? sys.styles.get("default")!;
      const color = hexToAci(style.color);
      const layer = this._annotationLayers.get(ann.uuid) ?? "0";
      if (drawing.layers.get(layer)?.visible === false) continue;
      const positions = buildLeaderPositions(ann, style);
      if (!this._fullyInViewport(this._bboxFromPositions(positions))) continue;
      this._writePairsAsLines(w, positions, layer, color, style.color);

      if (style.meshTick) {
        const dir = new THREE.Vector3().subVectors(ann.arrowTip, ann.elbow);
        if (dir.lengthSq() > 1e-10) {
          this._writeMeshTriangles(w, style.meshTick(ann.arrowTip, dir.normalize(), style.tickSize), layer, color, style.color);
        }
      }

      const extDir = new THREE.Vector3()
        .subVectors(ann.extensionEnd, ann.elbow).setY(0).normalize();
      const leaderHAlign: 0 | 1 | 2 = extDir.x < -0.1 ? 2 : extDir.x > 0.1 ? 0 : 1;
      const extraOffset = leaderHAlign === 1 ? style.fontSize * 0.5 : 0;
      const tp = ann.extensionEnd.clone().addScaledVector(extDir, style.textOffset + extraOffset);
      this._writeText(w, ann.text, tp.x, tp.z, style.fontSize, layer, color,
        0, leaderHAlign, 2, style.color);
    }
  }

  private _writeSlopeAnnotations(w: DxfWriter, drawing: TechnicalDrawing): void {
    const sys = this._components.get(TechnicalDrawings).systems.get(SlopeAnnotations) as SlopeAnnotations | undefined;
    if (!sys) return;

    for (const [, ann] of drawing.annotations.getBySystem(sys)) {
      const style = sys.styles.get(ann.style) ?? sys.styles.get("default")!;
      const color = hexToAci(style.color);
      const layer = this._annotationLayers.get(ann.uuid) ?? "0";
      if (drawing.layers.get(layer)?.visible === false) continue;
      const positions = buildSlopePositions(ann, style);
      if (!this._fullyInViewport(this._bboxFromPositions(positions))) continue;
      this._writePairsAsLines(w, positions, layer, color, style.color);

      if (style.meshTick) {
        const tip = getSlopeTip(ann, style.length);
        this._writeMeshTriangles(w, style.meshTick(tip, ann.direction, style.tickSize), layer, color, style.color);
      }

      const tip = new THREE.Vector3(
        ann.position.x + ann.direction.x * style.length,
        0,
        ann.position.z + ann.direction.z * style.length,
      );
      const mid = ann.position.clone().add(tip).multiplyScalar(0.5)
        .addScaledVector(new THREE.Vector3(-ann.direction.z, 0, ann.direction.x), style.textOffset + style.fontSize);
      this._writeText(w, formatSlope(ann.slope, style.format),
        mid.x, mid.z, style.fontSize, layer, color,
        this._textAngle(ann.direction.x, ann.direction.z), 1, 0, style.color);
    }
  }

  private _writeCalloutAnnotations(w: DxfWriter, drawing: TechnicalDrawing): void {
    const sys = this._components.get(TechnicalDrawings).systems.get(CalloutAnnotations) as CalloutAnnotations | undefined;
    if (!sys) return;

    for (const [, ann] of drawing.annotations.getBySystem(sys)) {
      const style = sys.styles.get(ann.style) ?? sys.styles.get("default")!;
      const color = hexToAci(style.color);
      const layer = this._annotationLayers.get(ann.uuid) ?? "0";
      if (drawing.layers.get(layer)?.visible === false) continue;
      const positions = buildCalloutPositions(ann, style);
      if (!this._fullyInViewport(this._bboxFromPositions(positions))) continue;
      this._writePairsAsLines(w, positions, layer, color, style.color);

      if (style.meshTick) {
        const extDir = new THREE.Vector3().subVectors(ann.extensionEnd, ann.elbow);
        if (extDir.lengthSq() > 1e-10) {
          this._writeMeshTriangles(w, style.meshTick(ann.extensionEnd, extDir.normalize(), style.tickSize), layer, color, style.color);
        }
      }

      const extDir = new THREE.Vector3()
        .subVectors(ann.extensionEnd, ann.elbow).setY(0).normalize();
      const hAlign: 0 | 1 | 2 = extDir.x < -0.1 ? 2 : extDir.x > 0.1 ? 0 : 1;
      // For vertical extensions the text is horizontal, so its nearest edge sits at
      // textOffset − fontSize/2 from the tick. Add fontSize/2 to restore the gap.
      const extraOffset = hAlign === 1 ? style.fontSize * 0.5 : 0;
      const tp = ann.extensionEnd.clone().addScaledVector(extDir, style.textOffset + extraOffset);
      this._writeText(w, ann.text, tp.x, tp.z, style.fontSize, layer, color,
        0, hAlign, 2, style.color);
    }
  }

  private _writeBlockInsertions(w: DxfWriter, drawing: TechnicalDrawing): void {
    const sys = this._components.get(TechnicalDrawings).systems.get(BlockAnnotations) as BlockAnnotations | undefined;
    if (!sys) return;

    for (const [, ins] of drawing.annotations.getBySystem(sys)) {
      if (!this._inViewport(ins.position.x, ins.position.z)) continue;
      const insStyle = sys.styles.get(ins.style) ?? sys.styles.get("default")!;
      const color = hexToAci(insStyle.color);
      const rotDeg = -THREE.MathUtils.radToDeg(ins.rotation);
      // In paper-space the INSERT position is transformed to mm; the scale must
      // also be multiplied so block geometry renders at the correct paper size.
      const scale = ins.scale * this._scale();
      w.p(0, "INSERT")
        .p(5, w.handle())
        .p(8, "0")
        .p(62, color);
      this._emitTrueColor(w, insStyle.color);
      w
        .p(2, ins.blockName)
        .n(10, this._tx(ins.position.x))
        .n(20, this._ty(ins.position.z))
        .n(30, 0.0)
        .n(41, scale)
        .n(42, scale)
        .n(43, scale)
        .n(50, rotDeg);
    }
  }

  // ─── Geometry helpers ─────────────────────────────────────────────────────────

  private _writeGeoAsLines(w: DxfWriter, geo: THREE.BufferGeometry, layer: string, color = 7, hex?: number): void {
    const pos = geo.attributes.position as THREE.BufferAttribute | undefined;
    if (!pos) return;
    for (let i = 0; i + 1 < pos.count; i += 2) {
      const seg = this._clipSegment(
        new THREE.Vector3(pos.getX(i), 0, pos.getZ(i)),
        new THREE.Vector3(pos.getX(i + 1), 0, pos.getZ(i + 1)),
      );
      if (!seg) continue;
      this._writeLine(w, seg.start.x, seg.start.z, seg.end.x, seg.end.z, layer, color, hex);
    }
  }

  private _writePairsAsLines(w: DxfWriter, positions: ArrayLike<number>, layer: string, color = 7, hex?: number): void {
    for (let i = 0; i + 5 < positions.length; i += 6) {
      const seg = this._clipSegment(
        new THREE.Vector3(positions[i], 0, positions[i + 2]),
        new THREE.Vector3(positions[i + 3], 0, positions[i + 5]),
      );
      if (!seg) continue;
      this._writeLine(w, seg.start.x, seg.start.z, seg.end.x, seg.end.z, layer, color, hex);
    }
  }

  private _emitTrueColor(w: DxfWriter, hex?: number): void {
    if (this.config.trueColor && hex !== undefined) w.p(420, hex);
  }

  private _writeLine(w: DxfWriter, x1: number, y1: number, x2: number, y2: number, layer: string, color: number, hex?: number): void {
    w.p(0, "LINE").p(5, w.handle()).p(8, layer).p(62, color);
    this._emitTrueColor(w, hex);
    w.n(10, this._tx(x1)).n(20, this._ty(y1)).n(30, 0.0)
      .n(11, this._tx(x2)).n(21, this._ty(y2)).n(31, 0.0);
  }

  /** Writes a LINE entity with coordinates already in DXF space (no transform applied). */
  private _writeRawLine(w: DxfWriter, x1: number, y1: number, x2: number, y2: number, layer: string, color: number): void {
    w.p(0, "LINE").p(5, w.handle()).p(8, layer).p(62, color)
      .n(10, x1).n(20, y1).n(30, 0.0)
      .n(11, x2).n(21, y2).n(31, 0.0);
  }

  /**
   * Writes a single triangle as a DXF SOLID entity.
   * Coordinates are in drawing local space (XZ plane) — transform is applied internally.
   * The 4th vertex equals the 3rd (degenerate quad = triangle).
   */
  private _writeSolid(
    w: DxfWriter,
    x1: number, z1: number,
    x2: number, z2: number,
    x3: number, z3: number,
    layer: string, color: number, hex?: number,
  ): void {
    w.p(0, "SOLID").p(5, w.handle()).p(8, layer).p(62, color);
    this._emitTrueColor(w, hex);
    w.n(10, this._tx(x1)).n(20, this._ty(z1)).n(30, 0.0)
      .n(11, this._tx(x2)).n(21, this._ty(z2)).n(31, 0.0)
      .n(12, this._tx(x3)).n(22, this._ty(z3)).n(32, 0.0)
      .n(13, this._tx(x3)).n(23, this._ty(z3)).n(33, 0.0);
  }

  /**
   * Writes a flat XYZ triangle array (9 values per triangle, XZ plane) as SOLID entities.
   * Matches the output format of {@link MeshTickBuilder}.
   */
  private _writeMeshTriangles(w: DxfWriter, triangles: number[], layer: string, color: number, hex?: number): void {
    for (let i = 0; i + 8 < triangles.length; i += 9) {
      this._writeSolid(w,
        triangles[i],     triangles[i + 2],
        triangles[i + 3], triangles[i + 5],
        triangles[i + 6], triangles[i + 8],
        layer, color, hex,
      );
    }
  }

  private _writeText(
    w: DxfWriter, text: string, x: number, y: number, height: number,
    layer: string, color: number, rotDeg = 0, hAlign = 0, vAlign = 0, hex?: number,
  ): void {
    const dx = this._tx(x);
    const dy = this._ty(y);
    // Scale text height to match the coordinate units (mm in paper-space, world units otherwise).
    w.p(0, "TEXT").p(5, w.handle()).p(8, layer).p(62, color);
    this._emitTrueColor(w, hex);
    w.n(10, dx).n(20, dy).n(30, 0.0)
      .n(40, height * this._scale())
      .n(50, rotDeg)
      .p(1, text);
    if (hAlign !== 0 || vAlign !== 0) {
      if (hAlign !== 0) w.p(72, hAlign);
      if (vAlign !== 0) w.p(73, vAlign);
      w.n(11, dx).n(21, dy).n(31, 0.0);
    }
  }

  // ─── Coordinate transforms ────────────────────────────────────────────────────

  /** Maps world X to DXF X. In paper-space, output is in mm from the drawing area origin. */
  private _tx(x: number): number {
    if (this._paperSlot) {
      return this._paperSlot.x + (x - this._paperSlot.vpLeft) * this._paperSlot.mmPerUnit;
    }
    return this._viewport ? x - this._viewport.left : x;
  }

  /**
   * Maps world Z to DXF Y.
   * In paper-space, output is in mm from the drawing area bottom (DXF Y-up).
   * In world-space mode, uses Y-down convention (Y=0 at viewport top).
   */
  private _ty(z: number): number {
    if (this._paperSlot) {
      // vp.top/bottom are OrthographicCamera frustum params (top > 0 > bottom).
      // The actual world Z of the top edge is −vpTop, and Z increases downward.
      // Equivalent to the non-paper −z convention: DXF_Y = paperY − (z + vpTop) × scale.
      return this._paperSlot.y - (z + this._paperSlot.vpTop) * this._paperSlot.mmPerUnit;
    }
    return this._viewport ? -z - this._viewport.bottom : -z;
  }

  /** Returns the coordinate scale factor: mm-per-world-unit in paper mode, 1 otherwise. */
  private _scale(): number {
    return this._paperSlot ? this._paperSlot.mmPerUnit : 1;
  }

  private _clipSegment(start: THREE.Vector3, end: THREE.Vector3): THREE.Line3 | null {
    if (!this._viewport) return new THREE.Line3(start, end);
    return this._viewport.clipLine(new THREE.Line3(start, end));
  }

  private _inViewport(x: number, z: number): boolean {
    if (!this._viewport) return true;
    return this._viewport.bbox.containsPoint(new THREE.Vector3(x, 0, z));
  }

  private _bboxFromPositions(positions: ArrayLike<number>): THREE.Box3 {
    const box = new THREE.Box3();
    for (let i = 0; i + 2 < positions.length; i += 3) {
      box.expandByPoint(new THREE.Vector3(positions[i], 0, positions[i + 2]));
    }
    return box;
  }

  private _fullyInViewport(bbox: THREE.Box3): boolean {
    if (!this._viewport) return true;
    return this._viewport.bbox.containsBox(bbox);
  }

  private _textAngle(dx: number, dz: number): number {
    let angle = Math.atan2(-dz, dx);
    if (angle > Math.PI / 2 || angle <= -Math.PI / 2) angle += Math.PI;
    return THREE.MathUtils.radToDeg(angle);
  }

  // ─── Custom system exporters ──────────────────────────────────────────────────

  private _writeCustomSystems(w: DxfWriter, _drawing: TechnicalDrawing): void {
    if (this._systemExporters.size === 0) return;
    const ctx = this._makeContext(w);
    for (const [SystemClass, handler] of this._systemExporters) {
      const sys = this._components.get(TechnicalDrawings).systems.get(SystemClass);
      if (sys) handler(sys, ctx);
    }
  }

  private _makeContext(w: DxfWriter): DxfWriteContext {
    return {
      writeLine: (x1, y1, x2, y2, layer = "0", aciColor = 7) => {
        this._writeLine(w, x1, y1, x2, y2, layer, aciColor);
      },
      writePairs: (positions, layer = "0", aciColor = 7) => {
        this._writePairsAsLines(w, positions, layer, aciColor);
      },
      writeMeshTriangles: (triangles, layer = "0", aciColor = 7) => {
        this._writeMeshTriangles(w, triangles, layer, aciColor);
      },
      writeText: (text, x, y, height, options = {}) => {
        this._writeText(w, text, x, y, height,
          options.layer ?? "0", options.aciColor ?? 7,
          options.rotDeg ?? 0, options.hAlign ?? 0);
      },
      hexToAci,
      textAngle: (dx, dz) => this._textAngle(dx, dz),
    };
  }
}
