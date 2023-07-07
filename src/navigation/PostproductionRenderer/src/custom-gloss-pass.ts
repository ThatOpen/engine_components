import * as THREE from "three";
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { Components } from "../../../core";
import { getProjectedNormalMaterial } from "./projected-normal-shader";

// Follows the structure of
// 		https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/OutlinePass.js
export class CustomGlossPass extends Pass {
  resolution: THREE.Vector2;
  renderScene: THREE.Scene;
  renderCamera: THREE.Camera;
  fsQuad: FullScreenQuad;
  planeBuffer: THREE.WebGLRenderTarget;
  normalOverrideMaterial: THREE.ShaderMaterial;
  excludedMeshes: THREE.Mesh[] = [];

  constructor(resolution: THREE.Vector2, components: Components) {
    super();

    this.renderScene = components.scene.get();
    this.renderCamera = components.camera.get();
    this.resolution = new THREE.Vector2(resolution.x, resolution.y);

    this.fsQuad = new FullScreenQuad();
    this.fsQuad.material = this.createOutlinePostProcessMaterial();

    // Create a buffer to store the plane of each face the scene onto
    const planeBuffer = new THREE.WebGLRenderTarget(
      this.resolution.x,
      this.resolution.y
    );
    planeBuffer.texture.colorSpace = "srgb-linear";
    planeBuffer.texture.format = THREE.RGBAFormat;
    planeBuffer.texture.type = THREE.HalfFloatType;
    planeBuffer.texture.minFilter = THREE.NearestFilter;
    planeBuffer.texture.magFilter = THREE.NearestFilter;
    planeBuffer.texture.generateMipmaps = false;
    planeBuffer.stencilBuffer = false;
    this.planeBuffer = planeBuffer;

    const material = getProjectedNormalMaterial();
    material.clippingPlanes = components.renderer.clippingPlanes;
    this.normalOverrideMaterial = material;
  }

  dispose() {
    this.planeBuffer.dispose();
    this.fsQuad.dispose();
  }

  setSize(width: number, height: number) {
    this.planeBuffer.setSize(width, height);
    this.resolution.set(width, height);

    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.screenSize.value.set(
      this.resolution.x,
      this.resolution.y,
      1 / this.resolution.x,
      1 / this.resolution.y
    );
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: any, readBuffer: any) {
    // Turn off writing to the depth buffer
    // because we need to read from it in the subsequent passes.
    const depthBufferValue = writeBuffer.depthBuffer;
    writeBuffer.depthBuffer = false;

    // 1. Re-render the scene to capture all normals in a texture.

    const overrideMaterialValue = this.renderScene.overrideMaterial;
    const previousBackground = this.renderScene.background;
    this.renderScene.background = null;

    for (const mesh of this.excludedMeshes) {
      mesh.visible = false;
    }

    renderer.setRenderTarget(this.planeBuffer);
    this.renderScene.overrideMaterial = this.normalOverrideMaterial;
    renderer.render(this.renderScene, this.renderCamera);

    for (const mesh of this.excludedMeshes) {
      mesh.visible = true;
    }

    this.renderScene.overrideMaterial = overrideMaterialValue;

    this.renderScene.background = previousBackground;

    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.planeBuffer.value = this.planeBuffer.texture;
    material.uniforms.sceneColorBuffer.value = readBuffer.texture;

    // 2. Draw the outlines using the normal texture
    // and combine it with the scene color

    if (this.renderToScreen) {
      // If this is the last effect, then renderToScreen is true.
      // So we should render to the screen by setting target null
      // Otherwise, just render into the writeBuffer that the next effect will use as its read buffer.
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      this.fsQuad.render(renderer);
    }

    // Reset the depthBuffer value so we continue writing to it in the next render.
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
	  uniform sampler2D planeBuffer;
	  uniform vec4 screenSize;
    uniform int width;
    uniform float correctColor;

			varying vec2 vUv;

			vec4 getValue(sampler2D buffer, int x, int y) {
				return texture2D(buffer, vUv + screenSize.zw * vec2(x, y));
			}

      float normalDiff(vec3 normal1, vec3 normal2) {
        return ((dot(normal1, normal2) - 1.) * -1.) / 2.;
      }

      // Returns 0 if it's background, 1 if it's not
      float getIsBackground(vec3 normal) {
        float background = 1.0;
        background *= step(normal.x, 0.);
        background *= step(normal.y, 0.);
        background *= step(normal.z, 0.);
        background = (background - 1.) * -1.;
        return background;
      }

			void main() {
				vec3 sceneColor = getValue(sceneColorBuffer, 0, 0).rgb;
        
        // Correct color to make it look similar to sao postprocessing colors
        
        float factor = clamp(correctColor * 1.5, 1., 4.);
        float sum = 0.05 * step(1.5, factor);
        float r = pow(sceneColor.r + sum, 1. / factor);
        float g = pow(sceneColor.g + sum, 1. / factor);
        float b = pow(sceneColor.b + sum, 1. / factor);
        vec4 corrected = vec4(r, g, b, 1.);
        
        // Exclude background and apply gloss
        
				vec3 glossLayer = getValue(planeBuffer, 0, 0).xyz;
        float background = getIsBackground(glossLayer);
        
        // glossLayer = 1. - glossLayer;
				
				float glossCorrection = 1.5;
				glossLayer *= glossCorrection;
				
				float minGloss = 0.9;
				float maxGloss = 1.3;
				glossLayer = max(glossLayer, minGloss);
				glossLayer = min(glossLayer, maxGloss);
				
        vec3 finalColor = glossLayer * corrected.xyz;
        finalColor = mix(corrected.xyz, finalColor, background);
        
        gl_FragColor = vec4(finalColor, 1.);
	}
			`;
  }

  createOutlinePostProcessMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        correctColor: { value: 0 },
        debugVisualize: { value: 0 },
        sceneColorBuffer: { value: null },
        planeBuffer: { value: null },
        width: { value: 1 },
        screenSize: {
          value: new THREE.Vector4(
            this.resolution.x,
            this.resolution.y,
            1 / this.resolution.x,
            1 / this.resolution.y
          ),
        },
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
    });
  }
}
