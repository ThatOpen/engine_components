import Drawing from "dxf-writer";
import * as THREE from "three";
import { FragmentManager, FragmentPlans } from "../../fragments";
import { EdgeProjector } from "./src/edge-projector";
import { Component } from "../../base-types";
import { Components, ToolComponent } from "../../core";

export class DXFExporter extends Component<EdgeProjector> {
  static readonly uuid = "568f2167-24a3-4519-b552-3b04cc74a6a6" as const;

  enabled = true;

  precission = 0.001;

  private _projector = new EdgeProjector();

  constructor(components: Components) {
    super(components);

    this.components.tools.add(DXFExporter.uuid, this);
  }

  get() {
    return this._projector;
  }

  dispose() {
    this._projector.dispose();
  }

  async export(name: string) {
    const drawing = new Drawing();
    drawing.setUnits("Meters");

    // Draw projected lines

    const fragPlans = await this.components.tools.get(FragmentPlans);
    const fragments = await this.components.tools.get(FragmentManager);

    const plans = fragPlans.get();
    const plan = plans.find((plan) => plan.name === name);
    if (!plan || !plan.plane) {
      throw new Error("Plan doesn't exist!");
    }

    const meshes = Object.values(fragments.list).map((frag) => frag.mesh);
    let height = plan.point.y;
    if (plan.offset) {
      height += plan.offset;
    }

    drawing.addLayer("projection", Drawing.ACI.BLUE, "CONTINUOUS");
    drawing.setActiveLayer("projection");

    const projectedLines = await this._projector.project(meshes, height);
    this.drawGeometry(projectedLines.geometry, drawing);

    projectedLines.geometry.dispose();
    projectedLines.material.dispose();

    // Draw section lines

    const edges = plan.plane.edges.get();

    for (const layerName in edges) {
      const mesh = edges[layerName].mesh;
      const material = mesh.material as THREE.LineBasicMaterial;
      const { r, g, b } = material.color;

      let layerColor: number;
      if (r > g && r > b) {
        layerColor = Drawing.ACI.RED;
      } else if (g > r && g > b) {
        layerColor = Drawing.ACI.GREEN;
      } else if (b > r && b > g) {
        layerColor = Drawing.ACI.BLUE;
      } else {
        layerColor = Drawing.ACI.WHITE;
      }

      drawing.addLayer(layerName, layerColor, "CONTINUOUS");
      drawing.setActiveLayer(layerName);

      this.drawGeometry(mesh.geometry, drawing);
    }

    return drawing.toDxfString();
  }

  private drawGeometry(geometry: THREE.BufferGeometry, drawing: Drawing) {
    const pos = geometry.attributes.position.array;
    const range = Math.min(geometry.drawRange.count * 3, pos.length);
    for (let i = 0; i < range; i += 6) {
      const x1 = pos[i];
      const y1 = pos[i + 2];
      const x2 = pos[i + 3];
      const y2 = pos[i + 5];
      const diffX = Math.abs(x2 - x1);
      const diffY = Math.abs(y2 - y1);
      const approxDistance = diffX + diffY;
      if (approxDistance > this.precission) {
        drawing.drawLine(x1, y1, x2, y2);
      }
    }
  }
}

ToolComponent.libraryUUIDs.add(DXFExporter.uuid);
