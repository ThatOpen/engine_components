import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";
import * as OBC from "@thatopen/components";

/**
 * The mode of the edge detection pass.
 */
export enum EdgeDetectionPassMode {
  /**
   * Looks good, including LODs, but less performant.
   */
  DEFAULT,
  /**
   * Doesn't include LODs, but much more performant.
   */
  GLOBAL,
}

export class EdgeDetectionPass extends Pass {
  private _edgeMaterial: THREE.ShaderMaterial;
  private _combineMaterial: THREE.ShaderMaterial;
  private _fsQuad: FullScreenQuad;
  private _edgeRenderTarget: THREE.WebGLRenderTarget;
  private _vertexColorRenderTarget: THREE.WebGLRenderTarget;
  // @ts-ignore
  private _fragments: OBC.FragmentsManager;
  private _renderer: OBC.BaseRenderer;
  private _overrideMaterial: THREE.ShaderMaterial;
  // World-space (view-space) coplanar priority offset in scene units. Applied
  // toward the camera so higher-priority coplanar surfaces win the depth tie
  // without ever overrunning a real occluder farther than this distance.
  private _depthBiasStrength = 0.005;

  private _mode = EdgeDetectionPassMode.DEFAULT;

  /**
   * When enabled, invisible materials still produce edges,
   * giving an X-ray effect where hidden geometry is shown as outlines.
   */
  xray = false;

  get mode() {
    return this._mode;
  }

  set mode(value: EdgeDetectionPassMode) {
    this._mode = value;
    this.setMaterialToMesh(false);
  }

  get width() {
    return this._edgeMaterial.uniforms.width.value;
  }

  set width(value: number) {
    this._edgeMaterial.uniforms.width.value = value;
  }

  get color() {
    return this._combineMaterial.uniforms.edgeColor.value;
  }

  set color(value: THREE.Color) {
    this._combineMaterial.uniforms.edgeColor.value = value;
  }

  get depthBiasStrength() {
    return this._depthBiasStrength;
  }

  set depthBiasStrength(value: number) {
    this._depthBiasStrength = value;
    if (this._overrideMaterial) {
      this._overrideMaterial.uniforms.depthBiasStrength.value = value;
    }
  }

  constructor(
    renderer: OBC.BaseRenderer,
    fragments: OBC.FragmentsManager,
    width: number = 1,
  ) {
    super();

    this._renderer = renderer;
    this._fragments = fragments;

    // Create override material with depth bias based on vertex colors
    // Higher vertex colors will render on top (closer to camera)
    this._overrideMaterial = new THREE.ShaderMaterial({
      clipping: true,
      side: THREE.DoubleSide,
      uniforms: {
        depthBiasStrength: { value: this._depthBiasStrength },
      },
      // Note: we don't use `vertexColors: true` or the three.js color_pars
      // / color_vertex includes here. In recent three.js versions those
      // includes declare `vColor` as vec4 when the geometry has a 4-channel
      // color attribute, which breaks the vec3 assignment below. Strict
      // GLSL validators (WebView2 / ANGLE) reject the implicit
      // vec3→vec4 conversion even though Chrome's validator tolerates it.
      // See engine_components#728. Declaring `color` and `vColor` manually
      // keeps types consistent across vertex and fragment shaders.
      vertexShader: `
        #include <common>
        #include <clipping_planes_pars_vertex>

        attribute vec3 color;
        varying vec3 vColor;
        uniform float depthBiasStrength;

        void main() {
          vColor = color;

          #include <begin_vertex>
          #include <project_vertex>

          // Coplanar priority, applied as a small WORLD-space nudge toward the
          // camera in view space (+Z is toward the camera), then re-projected.
          // A constant clip-space bias falls off ~1/d while the real depth gap
          // falls off ~1/d^2, so at distance it overran genuine occluders and
          // leaked their edges (#718). A view-space offset instead behaves like
          // a real epsilon separation: its projected depth gap scales like real
          // geometry, so it breaks coplanar ties at every distance without ever
          // pulling an occluder forward. Convention-independent (correct under
          // standard-Z and reversed-Z). mvPosition comes from <project_vertex>,
          // so instancing/batching are already applied.
          //
          // Two terms (mirrors beta's per-faceId band + hash, adapted to view
          // space): luminance priority so brighter surfaces render on top, plus
          // a deterministic per-colour hash so coplanar surfaces of EQUAL
          // priority still get a stable winner instead of z-fighting. The hash
          // is a fraction of the priority step, so priority still dominates.
          float priority = dot(color, vec3(0.299, 0.587, 0.114));
          float tie = fract(
            sin(dot(color, vec3(12.9898, 78.233, 37.719))) * 43758.5453
          );
          mvPosition.z += (priority + (tie - 0.5) * 0.25) * depthBiasStrength;
          gl_Position = projectionMatrix * mvPosition;

          #include <clipping_planes_vertex>
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        #include <clipping_planes_pars_fragment>

        void main() {
          #include <clipping_planes_fragment>
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
    });

    this._edgeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        width: { value: width },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float width;
        varying vec2 vUv;

        void main() {
          vec2 texel = vec2(1.0 / float(textureSize(tDiffuse, 0).x), 1.0 / float(textureSize(tDiffuse, 0).y));
          vec2 offset = texel * width;
          
          vec4 center = texture2D(tDiffuse, vUv);
          vec4 right = texture2D(tDiffuse, vUv + vec2(offset.x, 0.0));
          vec4 up = texture2D(tDiffuse, vUv + vec2(0.0, offset.y));
          
          float diff = 0.0;
          diff += distance(center.rgb, right.rgb);
          diff += distance(center.rgb, up.rgb);
          gl_FragColor = vec4(vec3(step(0.0001, diff)), 1.0);
        }
      `,
    });

    this._combineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tEdges: { value: null },
        edgeColor: { value: new THREE.Color(0x888888) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tEdges;
        uniform vec3 edgeColor;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          vec4 edges = texture2D(tEdges, vUv);
          
          // Combine color with edges (edges are black, so we multiply)
          gl_FragColor = mix(color, vec4(edgeColor, 1.0), edges.r);
        }
      `,
    });

    this._fsQuad = new FullScreenQuad(this._edgeMaterial);

    this._edgeRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    // When the renderer runs reversed-Z, give this pass a float32 depth
    // attachment so precision stays near-uniform across the range: the real
    // depth test then separates near-coplanar surfaces on its own, so coplanar
    // z-fighting is resolved structurally rather than by bias. On a standard-Z
    // renderer we keep the default integer depth (float32 there would actually
    // be worse at distance), so this is a no-op unless the consumer opted into
    // `reversedDepthBuffer`.
    const options: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    const reversedZ =
      (this._renderer.three.capabilities as { reversedDepthBuffer?: boolean })
        .reversedDepthBuffer === true;
    if (reversedZ) {
      const depthTexture = new THREE.DepthTexture(1, 1);
      depthTexture.type = THREE.FloatType;
      options.depthTexture = depthTexture;
    }
    this._vertexColorRenderTarget = new THREE.WebGLRenderTarget(1, 1, options);
  }

  setSize(width: number, height: number) {
    this._edgeRenderTarget.setSize(width, height);
    this._vertexColorRenderTarget.setSize(width, height);
  }

  setWidth(width: number) {
    this._edgeMaterial.uniforms.width.value = width;
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
  ) {
    const currentWorld = this._renderer.currentWorld as OBC.World;
    const scene = currentWorld!.scene.three as THREE.Scene;

    // Render vertex colors

    const currentScene = currentWorld.scene.three as THREE.Scene;
    const prevFog = currentScene.fog;
    const prevBackground = currentScene.background;
    currentScene.fog = null;
    currentScene.background = null;

    if (this._mode === EdgeDetectionPassMode.DEFAULT) {
      this.setMaterialToMesh(true);
      renderer.setRenderTarget(this._vertexColorRenderTarget);
      renderer.render(scene, currentWorld!.camera.three);
      this.setMaterialToMesh(false);
    } else if (this._mode === EdgeDetectionPassMode.GLOBAL) {
      const previousOverrideMaterial = scene.overrideMaterial;
      scene.overrideMaterial = this._overrideMaterial;
      renderer.setRenderTarget(this._vertexColorRenderTarget);
      renderer.render(scene, currentWorld!.camera.three);
      scene.overrideMaterial = previousOverrideMaterial;
    }

    currentScene.fog = prevFog;
    currentScene.background = prevBackground;

    // Render edges
    this._edgeMaterial.uniforms.tDiffuse.value =
      this._vertexColorRenderTarget.texture;
    this._fsQuad.material = this._edgeMaterial;
    renderer.setRenderTarget(this._edgeRenderTarget);
    this._fsQuad.render(renderer);

    // Combine color and edges
    this._combineMaterial.uniforms.tDiffuse.value = readBuffer.texture;
    this._combineMaterial.uniforms.tEdges.value =
      this._edgeRenderTarget.texture;
    this._fsQuad.material = this._combineMaterial;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
    }

    this._fsQuad.render(renderer);
  }

  dispose() {
    this._edgeMaterial.dispose();
    this._combineMaterial.dispose();
    this._overrideMaterial.dispose();
    this._fsQuad.dispose();
    this._edgeRenderTarget.dispose();
    this._vertexColorRenderTarget.dispose();
  }

  private setMaterialToMesh(apply: boolean) {
    if (!this._fragments.initialized) return;
    for (const [, model] of this._fragments.core.models.list) {
      for (const [, mesh] of model.tiles) {
        if ("isLODGeometry" in mesh.geometry) {
          continue;
        }

        if (apply) {
          mesh.userData.edgePassPreviousMaterial = mesh.material;
          // Fragments meshes are batched: each mesh has a material array
          // indexed by group `materialIndex`. Highlighted samples live in
          // groups whose materialIndex > 0 (pointing to the highlight
          // material slot). Replacing `mesh.material` with a length-1 array
          // leaves those groups resolving to `undefined`, so Three.js
          // silently skips them and they produce no edges — which is the
          // root of issue #707 (highlighted items look see-through under
          // outline styles).
          //
          // Mirror the original material array length so every group maps
          // to the override material. The override array is cached on the
          // mesh and only rebuilt when the source array length changes
          // (e.g. when the highlight system adds or removes a material
          // slot), so we don't pay an allocation per mesh per frame. For
          // non-array materials (xray, or non-fragments meshes), keep the
          // single-material path which bypasses groups entirely.
          const prev = mesh.material;
          if (this.xray) {
            mesh.material = this._overrideMaterial;
          } else if (Array.isArray(prev)) {
            let overrideArr = mesh.userData.edgePassOverrideArray as
              | THREE.Material[]
              | undefined;
            if (!overrideArr || overrideArr.length !== prev.length) {
              overrideArr = new Array<THREE.Material>(prev.length).fill(
                this._overrideMaterial,
              );
              mesh.userData.edgePassOverrideArray = overrideArr;
            }
            mesh.material = overrideArr;
          } else {
            mesh.material = [this._overrideMaterial];
          }
        } else if ("edgePassPreviousMaterial" in mesh.userData) {
          mesh.material = mesh.userData.edgePassPreviousMaterial;
        }
      }
    }
  }
}
