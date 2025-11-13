import * as THREE from "three";
import { Event, World } from "../../Types";
import { Components } from "../../Components";
import { readPixelsAsync } from "./pixel-reader";

// Source: https://threejs.org/examples/?q=depth#webgl_depth_texture

/**
 * A base renderer to determine visibility on screen.
 */
export class DistanceRenderer {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Fires after making the visibility check to the meshes. It lists the
   * meshes that are currently visible, and the ones that were visible
   * just before but not anymore.
   */
  readonly onDistanceComputed = new Event<number>();

  /**
   * Objects that won't be taken into account in the distance check.
   */
  excludedObjects = new Set<THREE.Object3D>();

  /**
   * Whether this renderer is active or not. If not, it won't render anything.
   */
  enabled = true;

  /**
   * Render the internal scene used to determine the object visibility. Used
   * for debugging purposes.
   */
  renderDebugFrame = false;

  /** The components instance to which this renderer belongs. */
  components: Components;

  /**
   * The scene where the distance is computed.
   */
  scene = new THREE.Scene();

  /**
   * The camera used to compute the distance.
   */
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /**
   * The material used to compute the distance.
   */
  depthMaterial: THREE.ShaderMaterial;

  /** The world instance to which this renderer belongs. */
  readonly world: World;

  protected readonly worker: Worker;

  private _width = 512;

  private _height = 512;

  private readonly _postQuad: THREE.Mesh;
  private readonly tempRT: THREE.WebGLRenderTarget;
  private readonly resultRT: THREE.WebGLRenderTarget;

  private readonly bufferSize: number;

  private readonly _buffer: Uint8Array;

  // Prevents worker being fired multiple times
  protected _isWorkerBusy = false;

  constructor(components: Components, world: World) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this.components = components;

    this.world = world;

    const camera = world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;

    this.tempRT = new THREE.WebGLRenderTarget(this._width, this._height);
    this.bufferSize = this._width * this._height * 4;
    this._buffer = new Uint8Array(this.bufferSize);

    this.tempRT.texture.minFilter = THREE.NearestFilter;
    this.tempRT.texture.magFilter = THREE.NearestFilter;
    this.tempRT.stencilBuffer = false;
    this.tempRT.samples = 0;
    this.tempRT.depthTexture = new THREE.DepthTexture(
      this._width,
      this._height,
    );

    this.tempRT.depthTexture.format = THREE.DepthFormat;
    this.tempRT.depthTexture.type = THREE.UnsignedShortType;

    this.resultRT = new THREE.WebGLRenderTarget(this._width, this._height);

    // Setup post processing stage

    this.depthMaterial = new THREE.ShaderMaterial({
      vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,
      fragmentShader: `
#include <packing>

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;


float readDepth( sampler2D depthSampler, vec2 coord ) {
  float fragCoordZ = texture2D( depthSampler, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  //vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
  float depth = readDepth( tDepth, vUv );

  gl_FragColor.rgb = 1.0 - vec3( depth );
  gl_FragColor.a = 1.0;
}
    `,
      uniforms: {
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far },
        tDiffuse: { value: null },
        tDepth: { value: null },
      },
    });

    const postPlane = new THREE.PlaneGeometry(2, 2);
    this._postQuad = new THREE.Mesh(postPlane, this.depthMaterial);
    this.scene.add(this._postQuad);

    const code = `
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Set();
        for (let i = 0; i < buffer.length; i += 4) {
          const r = buffer[i];
          colors.add(r);
        }
        postMessage({ colors });
      });
    `;

    const blob = new Blob([code], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.addEventListener("message", this.handleWorkerMessage);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.onDistanceComputed.reset();
    this.worker.terminate();
    this.tempRT.dispose();
    this.resultRT.dispose();
    const children = [...this.scene.children];
    this.excludedObjects.clear();
    for (const child of children) {
      child.removeFromParent();
    }
    this._postQuad.geometry.dispose();
    this._postQuad.removeFromParent();
    (this._buffer as any) = null;
    this.onDisposed.reset();
  }

  /**
   * The function that the culler uses to reprocess the scene. Generally it's
   * better to call needsUpdate, but you can also call this to force it.
   * @param force if true, it will refresh the scene even if needsUpdate is
   * not true.
   */
  compute = async () => {
    if (!this.enabled || this.world.isDisposing) {
      return;
    }

    if (this._isWorkerBusy) {
      return;
    }

    this._isWorkerBusy = true;

    this.world.camera.three.updateMatrix();

    const renderer = this.world.renderer!.three;

    // renderer.setSize(this._width, this._height);
    renderer.setRenderTarget(this.tempRT);

    const tempVariableName = "visibilityBeforeDistanceCheck";

    for (const object of this.excludedObjects) {
      object.userData[tempVariableName] = object.visible;
      object.visible = false;
    }

    renderer.render(this.world.scene.three, this.world.camera.three);

    for (const object of this.excludedObjects) {
      if (object.userData[tempVariableName] !== undefined) {
        object.visible = object.userData[tempVariableName];
      }
    }

    this.depthMaterial.uniforms.tDiffuse.value = this.tempRT.texture;
    this.depthMaterial.uniforms.tDepth.value = this.tempRT.depthTexture;

    renderer.setRenderTarget(this.resultRT);
    renderer.render(this.scene, this.camera);

    const context = renderer.getContext() as WebGL2RenderingContext;

    try {
      await readPixelsAsync(
        context,
        0,
        0,
        this._width,
        this._height,
        context.RGBA,
        context.UNSIGNED_BYTE,
        this._buffer,
      );
    } catch (e) {
      // Pixels couldn't be read, possibly because culler was disposed
      renderer.setRenderTarget(null);
      this._isWorkerBusy = false;
      return;
    }

    renderer.setRenderTarget(null);

    if (this.renderDebugFrame) {
      renderer.render(this.scene, this.camera);
    }

    this.worker.postMessage({
      buffer: this._buffer,
    });
  };

  private handleWorkerMessage = (event: MessageEvent) => {
    if (!this.enabled || this.world.isDisposing) {
      return;
    }

    const colors = event.data.colors as Set<number>;

    let min = Number.MAX_VALUE;
    for (const value of colors) {
      if (value === 0) {
        continue;
      }
      if (value < min) {
        min = value;
      }
    }

    const camera =
      (this.world.camera.three as THREE.PerspectiveCamera) ||
      THREE.OrthographicCamera;

    const normalized = min / 255;
    // By default, 0 is camera.far and 1 is camera.near: let's invert it
    // and multiply it by the camera frustum length to see the depth distance
    const maxFoundDistance = (normalized - 1) * -1 * (camera.far - camera.near);
    // We won't see anything beyond camera far, so use it as a limit
    const maxValidDistance = Math.min(maxFoundDistance, camera.far);

    this.onDistanceComputed.trigger(maxValidDistance);

    this._isWorkerBusy = false;
  };
}
