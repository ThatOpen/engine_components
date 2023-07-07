import * as THREE from "three";
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { getPlaneDistanceMaterial } from "./plane-distance-shader";
import { Components } from "../../../core";
import { getProjectedNormalMaterial } from "./projected-normal-shader";

// Follows the structure of
// 		https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/OutlinePass.js
export class CustomEffectsPass extends Pass {
  resolution: THREE.Vector2;
  renderScene: THREE.Scene;
  renderCamera: THREE.Camera;
  fsQuad: FullScreenQuad;
  planeBuffer: THREE.WebGLRenderTarget;
  glossBuffer: THREE.WebGLRenderTarget;
  normalOverrideMaterial: THREE.ShaderMaterial;
  glossOverrideMaterial: THREE.ShaderMaterial;
  excludedMeshes: THREE.Mesh[] = [];

  private _color = 0x999999;
  private _opacity = 0.4;
  private _tolerance = 3;
  private _correctColor = false;
  private _glossEnabled = true;
  private _glossExponent = 0.7;
  private _minGloss = -0.3;
  private _maxGloss = 0.15;

  get color() {
    return this._color;
  }

  set color(color: number) {
    this._color = color;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.outlineColor.value.set(color);
  }

  get tolerance() {
    return this._tolerance;
  }

  set tolerance(value: number) {
    this._tolerance = value;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.tolerance.value = value;
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(value: number) {
    this._opacity = value;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.opacity.value = value;
  }

  get correctColor() {
    return this._correctColor;
  }

  set correctColor(active: boolean) {
    this._correctColor = active;
    const value = active ? 1 : 0;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.correctColor.value = value;
  }

  get glossEnabled() {
    return this._glossEnabled;
  }

  set glossEnabled(active: boolean) {
    this._glossEnabled = active;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.glossEnabled.value = active ? 1 : 0;
  }

  get glossExponent() {
    return this._glossExponent;
  }

  set glossExponent(value: number) {
    this._glossExponent = value;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.glossExponent.value = value;
  }

  get minGloss() {
    return this._minGloss;
  }

  set minGloss(value: number) {
    this._minGloss = value;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.minGloss.value = value;
  }

  get maxGloss() {
    return this._maxGloss;
  }

  set maxGloss(value: number) {
    this._maxGloss = value;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.maxGloss.value = value;
  }

  constructor(resolution: THREE.Vector2, components: Components) {
    super();

    this.renderScene = components.scene.get();
    this.renderCamera = components.camera.get();
    this.resolution = new THREE.Vector2(resolution.x, resolution.y);

    this.fsQuad = new FullScreenQuad();
    this.fsQuad.material = this.createOutlinePostProcessMaterial();

    this.planeBuffer = this.newRenderTarget();
    this.glossBuffer = this.newRenderTarget();

    const normalMaterial = getPlaneDistanceMaterial();
    normalMaterial.clippingPlanes = components.renderer.clippingPlanes;
    this.normalOverrideMaterial = normalMaterial;

    const glossMaterial = getProjectedNormalMaterial();
    glossMaterial.clippingPlanes = components.renderer.clippingPlanes;
    this.glossOverrideMaterial = glossMaterial;
  }

  dispose() {
    this.planeBuffer.dispose();
    this.glossBuffer.dispose();
    this.normalOverrideMaterial.dispose();
    this.glossOverrideMaterial.dispose();
    this.fsQuad.dispose();
  }

  setSize(width: number, height: number) {
    this.planeBuffer.setSize(width, height);
    this.glossBuffer.setSize(width, height);
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

    const previousOverrideMaterial = this.renderScene.overrideMaterial;
    const previousBackground = this.renderScene.background;
    this.renderScene.background = null;

    for (const mesh of this.excludedMeshes) {
      mesh.visible = false;
    }

    // Render normal pass

    renderer.setRenderTarget(this.planeBuffer);
    this.renderScene.overrideMaterial = this.normalOverrideMaterial;
    renderer.render(this.renderScene, this.renderCamera);

    // Render gloss pass

    if (this._glossEnabled) {
      renderer.setRenderTarget(this.glossBuffer);
      this.renderScene.overrideMaterial = this.glossOverrideMaterial;
      renderer.render(this.renderScene, this.renderCamera);
    }

    for (const mesh of this.excludedMeshes) {
      mesh.visible = true;
    }

    this.renderScene.overrideMaterial = previousOverrideMaterial;
    this.renderScene.background = previousBackground;

    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.planeBuffer.value = this.planeBuffer.texture;
    material.uniforms.glossBuffer.value = this.glossBuffer.texture;
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
	  uniform sampler2D glossBuffer;
	  uniform vec4 screenSize;
	  uniform vec3 outlineColor;
      uniform int width;
	  uniform float opacity;
      uniform float tolerance;
      uniform float correctColor;
      uniform float glossExponent;
      uniform float minGloss;
      uniform float maxGloss;
      uniform float glossEnabled;

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
				vec3 normSceneColor = normalize(sceneColor);
        vec4 color = vec4(outlineColor,1.);

        vec4 plane = getValue(planeBuffer, 0, 0);
				vec3 normal = plane.xyz;
        float distance = plane.w;

        vec3 normalTop = getValue(planeBuffer, 0, width).rgb;
        vec3 normalBottom = getValue(planeBuffer, 0, -width).rgb;
        vec3 normalRight = getValue(planeBuffer, width, 0).rgb;
        vec3 normalLeft = getValue(planeBuffer, -width, 0).rgb;
        vec3 normalTopRight = getValue(planeBuffer, width, width).rgb;
        vec3 normalTopLeft = getValue(planeBuffer, -width, width).rgb;
        vec3 normalBottomRight = getValue(planeBuffer, width, -width).rgb;
        vec3 normalBottomLeft = getValue(planeBuffer, -width, -width).rgb;

        float distanceTop = getValue(planeBuffer, 0, width).a;
        float distanceBottom = getValue(planeBuffer, 0, -width).a;
        float distanceRight = getValue(planeBuffer, width, 0).a;
        float distanceLeft = getValue(planeBuffer, -width, 0).a;
        float distanceTopRight = getValue(planeBuffer, width, width).a;
        float distanceTopLeft = getValue(planeBuffer, -width, width).a;
        float distanceBottomRight = getValue(planeBuffer, width, -width).a;
        float distanceBottomLeft = getValue(planeBuffer, -width, -width).a;
        
        vec3 sceneColorTop = normalize(getValue(sceneColorBuffer, 1, 0).rgb);
        vec3 sceneColorBottom = normalize(getValue(sceneColorBuffer, -1, 0).rgb);
        vec3 sceneColorLeft = normalize(getValue(sceneColorBuffer, 0, -1).rgb);
        vec3 sceneColorRight = normalize(getValue(sceneColorBuffer, 0, 1).rgb);
        vec3 sceneColorTopRight = normalize(getValue(sceneColorBuffer, 1, 1).rgb);
        vec3 sceneColorBottomRight = normalize(getValue(sceneColorBuffer, -1, 1).rgb);
        vec3 sceneColorTopLeft = normalize(getValue(sceneColorBuffer, 1, 1).rgb);
        vec3 sceneColorBottomLeft = normalize(getValue(sceneColorBuffer, -1, 1).rgb);

        // Checks if the planes of this texel and the neighbour texels are different

        float planeDiff = 0.0;

        planeDiff += step(0.001, normalDiff(normal, normalTop));
        planeDiff += step(0.001, normalDiff(normal, normalBottom));
        planeDiff += step(0.001, normalDiff(normal, normalLeft));
        planeDiff += step(0.001, normalDiff(normal, normalRight));
        planeDiff += step(0.001, normalDiff(normal, normalTopRight));
        planeDiff += step(0.001, normalDiff(normal, normalTopLeft));
        planeDiff += step(0.001, normalDiff(normal, normalBottomRight));
        planeDiff += step(0.001, normalDiff(normal, normalBottomLeft));
        
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorTop));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorBottom));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorLeft));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorRight));
       	planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorTopRight));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorTopLeft));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorBottomRight));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorBottomLeft));

        planeDiff += step(0.001, abs(distance - distanceTop));
        planeDiff += step(0.001, abs(distance - distanceBottom));
        planeDiff += step(0.001, abs(distance - distanceLeft));
        planeDiff += step(0.001, abs(distance - distanceRight));
        planeDiff += step(0.001, abs(distance - distanceTopRight));
        planeDiff += step(0.001, abs(distance - distanceTopLeft));
        planeDiff += step(0.001, abs(distance - distanceBottomRight));
        planeDiff += step(0.001, abs(distance - distanceBottomLeft));

        // Add extra background outline

        int width2 = width + 1;
        vec3 normalTop2 = getValue(planeBuffer, 0, width2).rgb;
        vec3 normalBottom2 = getValue(planeBuffer, 0, -width2).rgb;
        vec3 normalRight2 = getValue(planeBuffer, width2, 0).rgb;
        vec3 normalLeft2 = getValue(planeBuffer, -width2, 0).rgb;
        vec3 normalTopRight2 = getValue(planeBuffer, width2, width2).rgb;
        vec3 normalTopLeft2 = getValue(planeBuffer, -width2, width2).rgb;
        vec3 normalBottomRight2 = getValue(planeBuffer, width2, -width2).rgb;
        vec3 normalBottomLeft2 = getValue(planeBuffer, -width2, -width2).rgb;

        planeDiff += -(getIsBackground(normalTop2) - 1.);
        planeDiff += -(getIsBackground(normalBottom2) - 1.);
        planeDiff += -(getIsBackground(normalRight2) - 1.);
        planeDiff += -(getIsBackground(normalLeft2) - 1.);
        planeDiff += -(getIsBackground(normalTopRight2) - 1.);
        planeDiff += -(getIsBackground(normalBottomRight2) - 1.);
        planeDiff += -(getIsBackground(normalBottomRight2) - 1.);
        planeDiff += -(getIsBackground(normalBottomLeft2) - 1.);

        // Tolerance sets the minimum amount of differences to consider
        // this texel an edge

        float outline = step(tolerance, planeDiff);

        // Exclude background and apply opacity

        float background = getIsBackground(normal);
        outline *= background;
        outline *= opacity;
        
        // Correct color to make it look similar to sao postprocessing colors
        
        float factor = clamp(correctColor * 1.5, 1., 4.);
        float sum = 0.05 * step(1.5, factor);
        float r = pow(sceneColor.r + sum, 1. / factor);
        float g = pow(sceneColor.g + sum, 1. / factor);
        float b = pow(sceneColor.b + sum, 1. / factor);
        vec4 corrected = vec4(r, g, b, 1.);
        
        // Add gloss
        
        vec3 gloss = getValue(glossBuffer, 0, 0).xyz;
        float diffGloss = abs(maxGloss - minGloss);
        vec3 glossExpVector = vec3(glossExponent,glossExponent,glossExponent);
        gloss = min(pow(gloss, glossExpVector), vec3(1.,1.,1.));
        gloss *= diffGloss;
        gloss += minGloss;
        vec4 glossedColor = corrected + vec4(gloss, 1.) * glossEnabled;
        
        corrected = mix(corrected, glossedColor, background);
        
        gl_FragColor = mix(corrected, color, outline);
	}
			`;
  }

  createOutlinePostProcessMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: this._opacity },
        correctColor: { value: 0 },
        debugVisualize: { value: 0 },
        sceneColorBuffer: { value: null },
        tolerance: { value: this._tolerance },
        planeBuffer: { value: null },
        glossBuffer: { value: null },
        glossEnabled: { value: 1 },
        minGloss: { value: -0.4 },
        maxGloss: { value: 0 },
        glossExponent: { value: this._glossExponent },
        width: { value: 1 },
        outlineColor: { value: new THREE.Color(this._color) },
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

  private newRenderTarget() {
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
    return planeBuffer;
  }
}
