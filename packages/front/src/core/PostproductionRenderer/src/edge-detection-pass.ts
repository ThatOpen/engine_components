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
  private _depthBiasStrength = 0.001; // Adjustable depth bias strength

  private _mode = EdgeDetectionPassMode.DEFAULT;

  get mode() {
    return this._mode;
  }

  set mode(value: EdgeDetectionPassMode) {
    this._mode = value;
    const currentWorld = this._renderer.currentWorld as OBC.World;
    const scene = currentWorld!.scene.three as THREE.Scene;
    scene.traverse((child) => this.setMaterialToMesh(child, false));
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
      vertexColors: true,
      side: THREE.DoubleSide,
      uniforms: {
        depthBiasStrength: { value: this._depthBiasStrength },
      },
      vertexShader: `
        #include <common>
        #include <color_pars_vertex>
        #include <clipping_planes_pars_vertex>
        
        uniform float depthBiasStrength;
        
        void main() {
          #include <color_vertex>
          vColor = color;
          
          #include <begin_vertex>
          #include <project_vertex>
          
          // Compute priority from vertex color (using luminance)
          // Higher values = higher priority = render on top
          float priority = dot(color, vec3(0.299, 0.587, 0.114)); // Luminance
          
          // Apply depth bias: subtract from z to bring higher priority faces closer
          // In clip space, smaller z values are closer to camera
          gl_Position.z -= priority * depthBiasStrength;

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

    this._vertexColorRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
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
      scene.traverse((child) => this.setMaterialToMesh(child, true));
      renderer.setRenderTarget(this._vertexColorRenderTarget);
      renderer.render(scene, currentWorld!.camera.three);
      scene.traverse((child) => this.setMaterialToMesh(child, false));
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

  private setMaterialToMesh(object: THREE.Object3D, apply: boolean) {
    if (!("isMesh" in object)) {
      return;
    }

    const mesh = object as THREE.Mesh;

    if (!("geometry" in mesh)) {
      return;
    }

    if ("isLODGeometry" in mesh.geometry) {
      return;
    }

    if (apply) {
      mesh.userData.edgePassPreviousMaterial = mesh.material;
      mesh.material = this._overrideMaterial;
    } else if ("edgePassPreviousMaterial" in mesh.userData) {
      mesh.material = mesh.userData.edgePassPreviousMaterial;
    }
  }
}
