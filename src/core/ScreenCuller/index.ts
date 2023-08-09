import * as THREE from "three";
import { Material } from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
import { Disposer } from "../Disposer";

// TODO: Clean up and document
// TODO: Work at the instance level instead of the mesh level

export class ScreenCuller extends Component<null> implements Disposable {
  readonly renderer: THREE.WebGLRenderer;
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly bufferSize: number;
  readonly materialCache: Map<string, THREE.MeshBasicMaterial>;
  readonly worker: Worker;

  name: string = "ScreenCuller";
  enabled = true;

  viewUpdated = new Event();

  needsUpdate = false;
  meshColorMap = new Map<string, THREE.Mesh>();
  renderDebugFrame = false;
  visibleMeshes: THREE.Mesh[] = [];
  colorMeshes = new Map<string, THREE.InstancedMesh>();
  meshes = new Map<string, THREE.Mesh>();

  currentVisibleMeshes = new Set<string>();
  recentlyHiddenMeshes = new Set<string>();

  private readonly _transparentMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });

  private _disposer = new Disposer();
  private _colors = { r: 0, g: 0, b: 0, i: 0 };

  // Alternative scene and meshes to make the visibility check
  private readonly _scene = new THREE.Scene();
  private readonly _buffer: Uint8Array;

  constructor(private components: Components, readonly updateInterval = 1000, readonly rtWidth = 512, readonly rtHeight = 512, readonly autoUpdate = true) {
    super();
    this.renderer = new THREE.WebGLRenderer();
    const planes = this.components.renderer.clippingPlanes;
    this.renderer.clippingPlanes = planes;
    this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    this.bufferSize = rtWidth * rtHeight * 4;
    this._buffer = new Uint8Array(this.bufferSize);
    this.materialCache = new Map<string, THREE.MeshBasicMaterial>();

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

  get(): null {
    return null;
  }

  dispose() {
    this.enabled = false;
    this.currentVisibleMeshes.clear();
    this.recentlyHiddenMeshes.clear();
    this._scene.children.length = 0;
    this.viewUpdated.reset();
    this.worker.terminate();
    this.renderer.dispose();
    this.renderTarget.dispose();
    (this._buffer as any) = null;
    this._transparentMat.dispose();
    this.meshColorMap.clear();
    this.visibleMeshes = [];
    for (const id in this.materialCache) {
      const material = this.materialCache.get(id);
      if (material) {
        material.dispose();
      }
    }
    for (const id in this.colorMeshes) {
      const mesh = this.colorMeshes.get(id);
      if (mesh) {
        this._disposer.dispose(mesh);
      }
    }
    this.colorMeshes.clear();
    this.meshes.clear();
  }

  add(mesh: THREE.Mesh | THREE.InstancedMesh) {
    if (!this.enabled) return;

    const isInstanced = mesh instanceof THREE.InstancedMesh;

    const { geometry, material } = mesh;

    const { r, g, b, code } = this.getNextColor();
    const colorMaterial = this.getMaterial(r, g, b);

    let newMaterial: Material[] | Material;

    if (Array.isArray(material)) {
      let transparentOnly = true;
      const matArray: any[] = [];

      for (const mat of material) {
        if (this.isTransparent(mat)) {
          matArray.push(this._transparentMat);
        } else {
          transparentOnly = false;
          matArray.push(colorMaterial);
        }
      }

      // If we find that all the materials are transparent then we must remove this from analysis
      if (transparentOnly) {
        colorMaterial.dispose();
        return;
      }

      newMaterial = matArray;
    } else if (this.isTransparent(material)) {
      // This material is transparent, so we must remove it from analysis
      colorMaterial.dispose();
      return;
    } else {
      newMaterial = colorMaterial;
    }

    this.meshColorMap.set(code, mesh);

    const count = isInstanced ? mesh.count : 1;
    const colorMesh = new THREE.InstancedMesh(geometry, newMaterial, count);

    if (isInstanced) {
      colorMesh.instanceMatrix = mesh.instanceMatrix;
    } else {
      colorMesh.setMatrixAt(0, new THREE.Matrix4());
    }

    mesh.visible = false;

    colorMesh.applyMatrix4(mesh.matrix);
    colorMesh.updateMatrix();

    this._scene.add(colorMesh);
    this.colorMeshes.set(mesh.uuid, colorMesh);
    this.meshes.set(mesh.uuid, mesh);
  }

  updateVisibility = async (force?: boolean) => {
    if (!this.enabled) return;
    if (!this.needsUpdate && !force) return;

    const camera = this.components.camera.get();
    camera.updateMatrix();

    this.renderer.setSize(this.rtWidth, this.rtHeight);
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this._scene, camera);

    const context = this.renderer.getContext() as WebGL2RenderingContext;
    await readPixelsAsync(context, 0, 0, this.rtWidth, this.rtHeight, context.RGBA, context.UNSIGNED_BYTE, this._buffer);

    this.renderer.setRenderTarget(null);

    if (this.renderDebugFrame) {
      this.renderer.render(this._scene, camera);
    }

    this.worker.postMessage({
      buffer: this._buffer,
    });

    this.needsUpdate = false;
  };

  private handleWorkerMessage = (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    this.recentlyHiddenMeshes = new Set(this.currentVisibleMeshes);
    this.currentVisibleMeshes.clear();

    this.visibleMeshes = [];

    // Make found meshes visible
    for (const code of colors.values()) {
      const mesh = this.meshColorMap.get(code);
      if (mesh) {
        this.visibleMeshes.push(mesh);
        mesh.visible = true;
        this.currentVisibleMeshes.add(mesh.uuid);
        this.recentlyHiddenMeshes.delete(mesh.uuid);
      }
    }

    // Hide meshes that were visible before but not anymore
    for (const uuid of this.recentlyHiddenMeshes) {
      const mesh = this.meshes.get(uuid);
      if (mesh === undefined) continue;
      mesh.visible = false;
    }

    this.viewUpdated.trigger();
  };

  private getMaterial(r: number, g: number, b: number) {
    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;
    const code = `rgb(${r}, ${g}, ${b})`;
    const color = new THREE.Color(code);
    let material = this.materialCache.get(code);
    const clippingPlanes = this.components.renderer.clippingPlanes;
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color,
        clippingPlanes,
        side: THREE.DoubleSide,
      });
      this.materialCache.set(code, material);
    }
    THREE.ColorManagement.enabled = colorEnabled;
    return material;
  }

  private isTransparent(material: THREE.Material) {
    return material.transparent && material.opacity < 1;
  }

  private getNextColor() {
    if (this._colors.i === 0) {
      this._colors.b++;
      if (this._colors.b === 256) {
        this._colors.b = 0;
        this._colors.i = 1;
      }
    }

    if (this._colors.i === 1) {
      this._colors.g++;
      this._colors.i = 0;
      if (this._colors.g === 256) {
        this._colors.g = 0;
        this._colors.i = 2;
      }
    }

    if (this._colors.i === 2) {
      this._colors.r++;
      this._colors.i = 1;
      if (this._colors.r === 256) {
        this._colors.r = 0;
        this._colors.i = 0;
      }
    }

    return {
      r: this._colors.r,
      g: this._colors.g,
      b: this._colors.b,
      code: `${this._colors.r}-${this._colors.g}-${this._colors.b}`,
    };
  }
}

//
// Thanks to the advice here https://github.com/zalo/TetSim/commit/9696c2e1cd6354fb9bd40dbd299c58f4de0341dd
//

function clientWaitAsync(gl: WebGL2RenderingContext, sync: WebGLSync, flags: GLenum, interval_ms: number) {
  return new Promise<void>((resolve, reject) => {
    function test() {
      const res = gl.clientWaitSync(sync, flags, 0);
      if (res == gl.WAIT_FAILED) {
        reject();
        return;
      }
      if (res == gl.TIMEOUT_EXPIRED) {
        setTimeout(test, interval_ms);
        return;
      }
      resolve();
    }

    test();
  });
}

async function getBufferSubDataAsync(
  gl: WebGL2RenderingContext,
  target: number,
  buffer: WebGLBuffer,
  srcByteOffset: number,
  dstBuffer: ArrayBufferView,
  dstOffset?: number,
  length?: number
) {
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)!;
  gl.flush();

  await clientWaitAsync(gl, sync, 0, 10);
  gl.deleteSync(sync);
  gl.bindBuffer(target, buffer);
  gl.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length);
  gl.bindBuffer(target, null);
}

async function readPixelsAsync(gl: WebGL2RenderingContext, x: number, y: number, w: number, h: number, format: GLenum, type: GLenum, dest: ArrayBufferView) {
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
  gl.bufferData(gl.PIXEL_PACK_BUFFER, dest.byteLength, gl.STREAM_READ);
  gl.readPixels(x, y, w, h, format, type, 0);
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

  await getBufferSubDataAsync(gl, gl.PIXEL_PACK_BUFFER, buf, 0, dest);

  gl.deleteBuffer(buf);
  return dest;
}
