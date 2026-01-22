import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";
import * as OBC from "@thatopen/components";
import { getProjectedNormalMaterial } from "./projected-normal-material";

/**
 * A postprocessing pass that applies a gloss effect to the rendered scene. The gloss effect makes surfaces appear more reflective based on their angle relative to the camera view.
 */
export class GlossPass extends Pass {
  resolution: THREE.Vector2;
  renderScene: THREE.Scene;
  renderCamera: THREE.Camera;
  fsQuad: FullScreenQuad;
  glossOverrideMaterial: THREE.ShaderMaterial;

  glossBuffer: THREE.WebGLRenderTarget;

  private _glossEnabled = true;

  get glossEnabled() {
    return this._glossEnabled;
  }

  set glossEnabled(active: boolean) {
    this._glossEnabled = active;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.glossEnabled.value = active ? 1 : 0;
  }

  get minGloss() {
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    return material.uniforms.minGloss.value;
  }

  set minGloss(value: number) {
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.minGloss.value = value;
  }

  get maxGloss() {
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    return material.uniforms.maxGloss.value;
  }

  set maxGloss(value: number) {
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.maxGloss.value = value;
  }

  get glossExponent() {
    return this.glossOverrideMaterial.uniforms.glossExponent.value;
  }

  set glossExponent(value: number) {
    this.glossOverrideMaterial.uniforms.glossExponent.value = value;
  }

  get fresnelExponent() {
    return this.glossOverrideMaterial.uniforms.fresnelExponent.value;
  }

  set fresnelExponent(value: number) {
    this.glossOverrideMaterial.uniforms.fresnelExponent.value = value;
  }

  get glossFactor() {
    return this.glossOverrideMaterial.uniforms.glossFactor.value;
  }

  set glossFactor(value: number) {
    this.glossOverrideMaterial.uniforms.glossFactor.value = value;
  }

  get fresnelFactor() {
    return this.glossOverrideMaterial.uniforms.fresnelFactor.value;
  }

  set fresnelFactor(value: number) {
    this.glossOverrideMaterial.uniforms.fresnelFactor.value = value;
  }

  constructor(resolution: THREE.Vector2, world: OBC.World) {
    super();

    this.renderScene = world.scene.three as THREE.Scene;
    this.renderCamera = world.camera.three;
    this.resolution = new THREE.Vector2(resolution.x, resolution.y);

    this.fsQuad = new FullScreenQuad();
    this.fsQuad.material = this.createGlossMaterial();

    this.glossBuffer = this.newRenderTarget();

    const glossMaterial = getProjectedNormalMaterial();
    // Note: clippingPlanes would need to be set separately if needed
    this.glossOverrideMaterial = glossMaterial;
  }

  dispose() {
    this.glossBuffer.dispose();
    this.glossOverrideMaterial.dispose();
    this.fsQuad.dispose();
  }

  setSize(width: number, height: number) {
    this.glossBuffer.setSize(width, height);
    this.resolution.set(width, height);

    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.screenSize.value.set(
      this.resolution.x,
      this.resolution.y,
      1 / this.resolution.x,
      1 / this.resolution.y,
    );
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: any, readBuffer: any) {
    // Turn off writing to the depth buffer
    const depthBufferValue = writeBuffer.depthBuffer;
    writeBuffer.depthBuffer = false;

    // Render gloss pass
    const previousOverrideMaterial = this.renderScene.overrideMaterial;
    const previousBackground = this.renderScene.background;
    this.renderScene.background = null;

    renderer.setRenderTarget(this.glossBuffer);
    this.renderScene.overrideMaterial = this.glossOverrideMaterial;
    renderer.render(this.renderScene, this.renderCamera);

    this.renderScene.overrideMaterial = previousOverrideMaterial;
    this.renderScene.background = previousBackground;

    // Set uniforms for the final pass
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.glossBuffer.value = this.glossBuffer.texture;
    material.uniforms.sceneColorBuffer.value = readBuffer.texture;

    // Render the final gloss effect
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      this.fsQuad.render(renderer);
    }

    // Reset the depthBuffer value
    writeBuffer.depthBuffer = depthBufferValue;
  }

  get vertexShader() {
    return `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }

  get fragmentShader() {
    return `
      uniform sampler2D sceneColorBuffer;
      uniform sampler2D glossBuffer;
      uniform vec4 screenSize;
      uniform float glossEnabled;
      uniform float minGloss;
      uniform float maxGloss;


      varying vec2 vUv;

      vec4 getValue(sampler2D buffer, int x, int y) {
        return texture2D(buffer, vUv + screenSize.zw * vec2(x, y));
      }

      void main() {
        vec4 sceneColor = getValue(sceneColorBuffer, 0, 0);
        
        // Apply gloss effect
        vec3 gloss = getValue(glossBuffer, 0, 0).xyz;
        // Prevent the gloss from being zero, which would break normalize() later
        gloss = max(gloss, vec3(0.001));
        
        vec3 glossEffect = gloss * glossEnabled;

        // Map glossEffect to range [minGloss, maxGloss]
        // All dimensions of the glossEffect are the same, so we can use the x dimension.
        float mappedGloss = minGloss + (maxGloss - minGloss) * glossEffect.x;


        glossEffect = normalize(glossEffect) * mappedGloss;

        vec4 glossedColor = sceneColor + vec4(glossEffect, 0.0);

        // Prevent the glossed color from being darker than zero
        glossedColor = max(glossedColor, vec4(0.0, 0.0, 0.0, sceneColor.a));
        
        gl_FragColor = glossedColor;
      }
    `;
  }

  createGlossMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        sceneColorBuffer: { value: null },
        glossBuffer: { value: null },
        glossEnabled: { value: this._glossEnabled ? 1 : 0 },
        minGloss: { value: -0.12 },
        maxGloss: { value: 0.8 },
        screenSize: {
          value: new THREE.Vector4(
            this.resolution.x,
            this.resolution.y,
            1 / this.resolution.x,
            1 / this.resolution.y,
          ),
        },
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
    });
  }

  private newRenderTarget() {
    const renderTarget = new THREE.WebGLRenderTarget(
      this.resolution.x,
      this.resolution.y,
    );
    renderTarget.texture.colorSpace = "srgb-linear";
    renderTarget.texture.format = THREE.RGBAFormat;
    renderTarget.texture.type = THREE.HalfFloatType;
    renderTarget.texture.minFilter = THREE.NearestFilter;
    renderTarget.texture.magFilter = THREE.NearestFilter;
    renderTarget.texture.generateMipmaps = false;
    renderTarget.stencilBuffer = false;
    return renderTarget;
  }
}
