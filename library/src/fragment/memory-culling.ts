import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { Event } from "../core";

export interface FragmentsByModel {
  [model: string]: string[];
}

export class MemoryCulling {
  // Alternative scene and meshes to make the visibility check
  private readonly scene = new THREE.Scene();

  readonly renderer: THREE.WebGLRenderer;
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly bufferSize: number;
  readonly buffer: Uint8Array;
  readonly materialCache = new Map<string, THREE.MeshBasicMaterial>();
  readonly worker: Worker;

  readonly fragmentsDiscovered = new Event<FragmentsByModel>();

  // TODO: Document and clean up data structures
  enabled = true;
  opaqueMeshes: THREE.Mesh[] = [];
  transparentMeshes: THREE.Mesh[] = [];

  fragmentColorMap = new Map<string, string>();
  fragmentModelMap = new Map<string, string>();
  fragmentMeshMap: {
    [fragmentID: string]: {
      [itemID: string]: {
        mesh: THREE.InstancedMesh;
        index: number;
      };
    };
  } = {};

  exclusions = new Map<string, Fragment>();
  needsUpdate = false;
  renderDebugFrame = false;
  isFirstRenderingPass = true;

  discoveredFragments = new Set<string>();
  undiscoveredFragments = new Map<string, number>();
  previouslyDiscoveredFragments = new Set<string>();

  public visibleExpressId: string[] = [];

  private readonly scaleFactor = 0.00001;
  private readonly invisibleBoxes = new Set<string>();

  private colors = { r: 0, g: 0, b: 0, i: 0 };

  constructor(
    private components: Components,
    readonly updateInterval = 1000,
    readonly rtWidth = 512,
    readonly rtHeight = 512,
    readonly autoUpdate = true
  ) {
    this.renderer = new THREE.WebGLRenderer();
    const planes = this.components.renderer.get().clippingPlanes;
    this.renderer.clippingPlanes = planes;
    this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    this.bufferSize = rtWidth * rtHeight * 4;
    this.buffer = new Uint8Array(this.bufferSize);

    const code = `
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Set();
        for (let i = 0; i < buffer.length; i += 4) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];
            const code = "" + r + "-" + g + "-" + b;
            colors.add(code);
        }
        postMessage({ colors });
      });
    `;

    const blob = new Blob([code], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener("message", this.handleWorkerMessage);
    if (autoUpdate) window.setInterval(this.updateVisibility, updateInterval);
  }

  updateVisibility = (force?: boolean) => {
    if (!this.opaqueMeshes) return;
    if (!this.enabled) return;
    if (!this.needsUpdate && !force) return;

    const camera = this.components.camera.get();
    camera.updateMatrix();

    this.renderer.setSize(this.rtWidth, this.rtHeight);
    this.renderer.setRenderTarget(this.renderTarget);

    this.renderer.render(this.scene, camera);

    this.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.rtWidth,
      this.rtHeight,
      this.buffer
    );

    this.worker.postMessage({
      buffer: this.buffer,
    });

    for (const mesh of this.transparentMeshes) {
      this.scene.add(mesh);
    }

    this.renderer.render(this.scene, camera);

    this.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.rtWidth,
      this.rtHeight,
      this.buffer
    );

    this.worker.postMessage({
      buffer: this.buffer,
    });

    this.renderer.setRenderTarget(null);

    if (this.renderDebugFrame && this.isFirstRenderingPass) {
      this.renderer.render(this.scene, camera);
    }

    for (const mesh of this.transparentMeshes) {
      mesh.removeFromParent();
    }

    this.needsUpdate = false;
  };

  getNextColor() {
    if (this.colors.i === 0) {
      this.colors.b++;
      if (this.colors.b === 256) {
        this.colors.b = 0;
        this.colors.i = 1;
      }
    }

    if (this.colors.i === 1) {
      this.colors.g++;
      this.colors.i = 0;
      if (this.colors.g === 256) {
        this.colors.g = 0;
        this.colors.i = 2;
      }
    }

    if (this.colors.i === 2) {
      this.colors.r++;
      this.colors.i = 1;
      if (this.colors.r === 256) {
        this.colors.r = 0;
        this.colors.i = 0;
      }
    }

    return {
      r: this.colors.r,
      g: this.colors.g,
      b: this.colors.b,
      code: `${this.colors.r}-${this.colors.g}-${this.colors.b}`,
    };
  }

  // TODO: This needs cleanup and get rid of repeated code
  loadBoxes(
    modelID: string,
    boundingBoxes: any,
    transparentBoundingBoxes: any,
    expressIDTofragmentIDMap: any[]
  ) {
    const boxes: any[] = Object.values(boundingBoxes);
    const geometry = new THREE.BoxGeometry();
    const clippingPlanes = this.components.renderer.get().clippingPlanes;
    const material = new THREE.MeshBasicMaterial({ clippingPlanes });
    const mesh = new THREE.InstancedMesh(geometry, material, boxes.length);
    const tempMatrix = new THREE.Matrix4();
    const expressIDs = Object.keys(boundingBoxes);
    for (let i = 0; i < boxes.length; i++) {
      const itemID = expressIDs[i];
      const expressID = parseInt(expressIDs[i], 10);
      const fragmentID = expressIDTofragmentIDMap[expressID];

      this.fragmentModelMap.set(fragmentID, modelID);

      const newCol = this.getNextColor();
      tempMatrix.fromArray(boxes[i]);
      mesh.setMatrixAt(i, tempMatrix);

      mesh.setColorAt(
        i,
        new THREE.Color(`rgb(${newCol.r},${newCol.g}, ${newCol.b})`)
      );

      if (this.fragmentMeshMap[fragmentID] === undefined) {
        this.fragmentMeshMap[fragmentID] = {};
      }

      this.fragmentMeshMap[fragmentID][itemID] = { mesh, index: i };

      this.fragmentColorMap.set(newCol.code, fragmentID);
    }

    const boxes2: any[] = Object.values(transparentBoundingBoxes);
    const geometry2 = new THREE.BoxGeometry();
    const material2 = new THREE.MeshBasicMaterial();
    const mesh2 = new THREE.InstancedMesh(geometry2, material2, boxes2.length);
    const tempMatrix2 = new THREE.Matrix4();
    const expressIDs2 = Object.keys(transparentBoundingBoxes);
    for (let i = 0; i < boxes2.length; i++) {
      const itemID = expressIDs2[i];
      const expressID2 = parseInt(expressIDs2[i], 10);
      const fragmentID2 = expressIDTofragmentIDMap[expressID2];

      const newCol = this.getNextColor();
      tempMatrix2.fromArray(boxes2[i]);
      mesh2.setMatrixAt(i, tempMatrix2);
      mesh2.setColorAt(
        i,
        new THREE.Color(`rgb(${newCol.r},${newCol.g}, ${newCol.b})`)
      );

      if (this.fragmentMeshMap[fragmentID2] === undefined) {
        this.fragmentMeshMap[fragmentID2] = {};
      }

      this.fragmentMeshMap[fragmentID2][itemID] = { mesh: mesh2, index: i };
      this.fragmentModelMap.set(fragmentID2, modelID);
      this.fragmentColorMap.set(newCol.code, fragmentID2);
    }

    this.scene.add(mesh);
    this.opaqueMeshes.push(mesh);
    this.transparentMeshes.push(mesh2);
  }

  toggleVisibility(visible: boolean, items: { [fragID: string]: string[] }) {
    const tempMatrix = new THREE.Matrix4();
    const scaleMatrix = this.getScaleMatrix(visible);
    for (const fragID in items) {
      for (const itemID of items[fragID]) {
        const proxy = this.fragmentMeshMap[fragID][itemID];
        if (!proxy) continue;

        const id = `${fragID}-${proxy.index}`;
        const isVisible = !this.invisibleBoxes.has(id);
        if (isVisible === visible) continue;

        if (visible) {
          this.invisibleBoxes.delete(id);
        } else {
          this.invisibleBoxes.add(id);
        }

        proxy.mesh.getMatrixAt(proxy.index, tempMatrix);
        tempMatrix.premultiply(scaleMatrix);
        proxy.mesh.setMatrixAt(proxy.index, tempMatrix);
        proxy.mesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  private handleWorkerMessage = (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;
    const foundFragmentsIDs = this.getFragmentsIDs(colors);
    if (this.isFirstRenderingPass) {
      this.renderFirstPass(foundFragmentsIDs);
    } else {
      this.renderSecondPass(foundFragmentsIDs);
    }
  };

  private getFragmentsIDs(colors: Set<string>) {
    const foundFragmentsIDs = new Set<string>();
    for (const col of colors) {
      if (col !== undefined) {
        const fragmentID = this.fragmentColorMap.get(col) as string;
        foundFragmentsIDs.add(fragmentID);
      }
    }
    return foundFragmentsIDs;
  }

  private renderFirstPass(foundFragmentsIDs: Set<string>) {
    this.discoveredFragments.clear();
    this.saveFoundFragments(foundFragmentsIDs);
    this.isFirstRenderingPass = false;
  }

  private renderSecondPass(foundFragmentsIDs: Set<string>) {
    this.saveFoundFragments(foundFragmentsIDs);

    for (const item of this.previouslyDiscoveredFragments) {
      if (!foundFragmentsIDs.has(item)) {
        this.undiscoveredFragments.set(item, performance.now());
      }
    }

    const newlyDiscoveredFrags: FragmentsByModel = {};
    for (const frag of this.discoveredFragments) {
      if (!this.previouslyDiscoveredFragments.has(frag)) {
        this.saveDiscovered(frag, newlyDiscoveredFrags);
      }
      this.previouslyDiscoveredFragments.add(frag);
    }

    for (const item of foundFragmentsIDs) {
      this.undiscoveredFragments.delete(item);
    }

    this.fragmentsDiscovered.trigger(newlyDiscoveredFrags);

    this.isFirstRenderingPass = true;
  }

  private saveDiscovered(frag: string, discovered: FragmentsByModel) {
    const model = this.fragmentModelMap.get(frag);
    if (!model) {
      throw new Error("Error when getting model of fragment");
    }
    if (!discovered[model]) {
      discovered[model] = [];
    }
    discovered[model].push(frag);
  }

  private saveFoundFragments(foundFragmentsIDs: Set<string>) {
    for (const item of foundFragmentsIDs) {
      if (item !== undefined) {
        this.discoveredFragments.add(item);
      }
    }
  }

  private getScaleMatrix(visible: boolean) {
    const scaleMatrix = new THREE.Matrix4().fromArray([
      this.scaleFactor,
      0,
      0,
      0,
      0,
      this.scaleFactor,
      0,
      0,
      0,
      0,
      this.scaleFactor,
      0,
      0,
      0,
      0,
      1,
    ]);
    if (!visible) {
      scaleMatrix.invert();
    }
    return scaleMatrix;
  }
}
