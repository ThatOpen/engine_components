import * as THREE from "three";
import { Writer, Units, Colors, Block, point } from "@tarikjabiri/dxf";
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

  async export3D() {
    const writer = new Writer();
    writer.document.setUnits(Units.Meters);
    const modelSpace = writer.document.modelSpace;

    const fragments = await this.components.tools.get(FragmentManager);

    fragments.groups[0].children.forEach((child) => {
      if (!(child instanceof THREE.InstancedMesh)) return;

      child.updateWorldMatrix(false, false);
      const transform = child.matrixWorld.clone();
      const matrix = new THREE.Matrix4();

      for (let i = 0; i < child.count; i++) {
        const mesh = modelSpace.addMesh({ size: 3 });
        child.getMatrixAt(i, matrix);
        matrix.multiply(transform);

        const position = child.geometry.getAttribute("position");
        const index = child.geometry.index;

        for (let i = 0; i < position.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(position, i);
          vertex.applyMatrix4(matrix);
          mesh.vertices.push(vertex);
        }

        for (let i = 0; i < index.count; ) {
          const indices = [index.getX(i++), index.getX(i++), index.getX(i++)];
          mesh.faces.push(indices as number[]);
        }
      }
    });

    return writer.stringify();
  }

  async export(name: string) {
    const writer = new Writer();
    writer.document.setUnits(Units.Meters);

    const modelSpace = writer.document.modelSpace;
    const tables = writer.document.tables;

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

    const projectionLayer = tables.addLayer({
      name: "projection",
      colorNumber: Colors.Blue,
    });
    modelSpace.currentLayerName = projectionLayer.name;

    const projectedLines = await this._projector.project(meshes, height);
    this.drawGeometry(projectedLines.geometry, modelSpace);

    projectedLines.geometry.dispose();
    projectedLines.material.dispose();

    // Draw section lines

    const edges = plan.plane.edges.get();

    for (const layerName in edges) {
      const mesh = edges[layerName].mesh;
      const material = mesh.material as THREE.LineBasicMaterial;
      const { r, g, b } = material.color;

      let colorNumber: number;
      if (r > g && r > b) colorNumber = Colors.Red;
      else if (g > r && g > b) colorNumber = Colors.Green;
      else if (b > r && b > g) colorNumber = Colors.Blue;
      else colorNumber = Colors.White;

      const layer = tables.addLayer({ name: layerName, colorNumber });
      modelSpace.currentLayerName = layer.name;

      this.drawGeometry(mesh.geometry, modelSpace);
    }

    return writer.stringify();
  }

  private drawGeometry(geometry: THREE.BufferGeometry, block: Block) {
    const pos = geometry.attributes.position.array;
    const range = Math.min(geometry.drawRange.count * 3, pos.length);
    for (let i = 0; i < range; i += 6) {
      const start = point(pos[i], pos[i + 2]);
      const end = point(pos[i + 3], pos[i + 5]);
      const dx = Math.abs(end.x - start.x);
      const dy = Math.abs(end.y - start.y);
      if (dx + dy > this.precission) block.addLine({ start, end });
    }
  }
}

ToolComponent.libraryUUIDs.add(DXFExporter.uuid);
