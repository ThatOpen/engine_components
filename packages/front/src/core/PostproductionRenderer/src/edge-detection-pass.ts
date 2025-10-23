import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";
import * as OBC from "@thatopen/components";

export class EdgeDetectionPass extends Pass {
  private _edgeMaterial: THREE.ShaderMaterial;
  private _combineMaterial: THREE.ShaderMaterial;
  private _fsQuad: FullScreenQuad;
  private _edgeRenderTarget: THREE.WebGLRenderTarget;
  private _vertexColorRenderTarget: THREE.WebGLRenderTarget;
  // @ts-ignore
  private _fragments: OBC.FragmentsManager;
  private _renderer: OBC.BaseRenderer;
  private _overrideMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
  });

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

  constructor(
    renderer: OBC.BaseRenderer,
    fragments: OBC.FragmentsManager,
    width: number = 1,
  ) {
    super();

    this._renderer = renderer;
    this._fragments = fragments;

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
    currentScene.fog = null;

    const previousOverrideMaterial = scene.overrideMaterial;
    scene.overrideMaterial = this._overrideMaterial;
    renderer.setRenderTarget(this._vertexColorRenderTarget);
    renderer.render(scene, currentWorld!.camera.three);
    scene.overrideMaterial = previousOverrideMaterial;

    currentScene.fog = prevFog;

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
    this._fsQuad.dispose();
    this._edgeRenderTarget.dispose();
    this._vertexColorRenderTarget.dispose();
  }
}
