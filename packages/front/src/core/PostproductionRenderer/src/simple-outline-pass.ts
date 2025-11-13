import * as OBC from "@thatopen/components";
import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";

export class SimpleOutlinePass extends Pass {
  outlineColor: THREE.Color = new THREE.Color(0xffc800);
  thickness: number = 2.0;
  fillColor: THREE.Color = new THREE.Color(0xffff00);
  fillOpacity: number = 0.3;
  debugShowMask = false;
  scene = new THREE.Scene();

  private _maskTarget: THREE.WebGLRenderTarget;
  private _fsQuad: FullScreenQuad;
  private _world: OBC.World;
  private _debugQuad: FullScreenQuad | null = null;

  constructor(width: number, height: number, world: OBC.World) {
    super();

    this._world = world;

    // Set background to black for proper mask rendering
    this.scene.background = new THREE.Color(0x000000);

    this._maskTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });

    this._fsQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          tMask: { value: null },
          outlineColor: { value: new THREE.Color(0x00ff00) },
          thickness: { value: 2.0 },
          resolution: { value: new THREE.Vector2(width, height) },
          fillColor: { value: new THREE.Color(0xffff00) },
          fillOpacity: { value: 0.3 },
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
          uniform sampler2D tMask;
          uniform vec3 outlineColor;
          uniform float thickness;
          uniform vec2 resolution;
          uniform vec3 fillColor;
          uniform float fillOpacity;
          varying vec2 vUv;

          void main() {
            float mask = texture2D(tMask, vUv).r;
            float outline = 0.0;
            float t = thickness;
            vec2 texel = 1.0 / resolution;
            for (float x = -t; x <= t; x++) {
              for (float y = -t; y <= t; y++) {
                vec2 offset = vec2(x, y) * texel;
                float neighbor = texture2D(tMask, vUv + offset).r;
                if (neighbor > 0.5) outline = 1.0;
              }
            }
            vec4 sceneColor = texture2D(tDiffuse, vUv);
            // Fill inside
            if (mask > 0.5) {
              sceneColor.rgb = mix(sceneColor.rgb, fillColor, fillOpacity);
            }
            // Only draw outline where mask is not set but neighbor is
            if (outline > 0.5 && mask < 0.5) {
              gl_FragColor = vec4(outlineColor, 1.0);
            } else {
              gl_FragColor = sceneColor;
            }
          }
        `,
      }),
    );

    // Add debug quad for mask visualization
    this._debugQuad = new FullScreenQuad(
      new THREE.ShaderMaterial({
        uniforms: {
          tMask: { value: null },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tMask;
          varying vec2 vUv;
          void main() {
            float mask = texture2D(tMask, vUv).r;
            gl_FragColor = vec4(vec3(mask), 1.0);
          }
        `,
      }),
    );
  }

  setSize(width: number, height: number) {
    this._maskTarget.setSize(width, height);
    (
      this._fsQuad.material as THREE.ShaderMaterial
    ).uniforms.resolution.value.set(width, height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
  ) {
    // Render mask
    const camera = this._world.camera.three;

    // Store current clear color and set to black
    const originalClearColor = renderer.getClearColor(new THREE.Color());
    const originalClearAlpha = renderer.getClearAlpha();

    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(this._maskTarget);
    renderer.clear();
    renderer.render(this.scene, camera);

    // Restore original clear color
    renderer.setClearColor(originalClearColor, originalClearAlpha);

    // Outline shader or debug mask
    if (this.debugShowMask) {
      const debugMat = this._debugQuad!.material as THREE.ShaderMaterial;
      debugMat.uniforms.tMask.value = this._maskTarget.texture;
      if (this.renderToScreen) {
        renderer.setRenderTarget(null);
      } else {
        renderer.setRenderTarget(writeBuffer);
      }
      this._debugQuad!.render(renderer);
      return;
    }

    // Outline shader
    const mat = this._fsQuad.material as THREE.ShaderMaterial;
    mat.uniforms.tDiffuse.value = readBuffer.texture;
    mat.uniforms.tMask.value = this._maskTarget.texture;
    mat.uniforms.outlineColor.value.copy(this.outlineColor);
    mat.uniforms.thickness.value = this.thickness;
    mat.uniforms.fillColor.value.copy(this.fillColor);
    mat.uniforms.fillOpacity.value = this.fillOpacity;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
    }
    this._fsQuad.render(renderer);
  }

  dispose() {
    this._maskTarget.dispose();
    this._fsQuad.dispose();
    const children = [...this.scene.children];
    for (const child of children) {
      child.removeFromParent();
    }
  }
}
