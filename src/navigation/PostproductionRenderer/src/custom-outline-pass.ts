import * as THREE from "three";
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { getPlaneDistanceMaterial } from "./plane-distance-shader";
import { Components } from "../../../core";

// Follows the structure of
// 		https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/OutlinePass.js
export class CustomOutlinePass extends Pass {
  resolution: THREE.Vector2;
  renderScene: THREE.Scene;
  renderCamera: THREE.Camera;
  fsQuad: FullScreenQuad;
  planeBuffer: THREE.WebGLRenderTarget;
  normalOverrideMaterial: THREE.ShaderMaterial;
  excludedMeshes: THREE.Mesh[] = [];

  private _color = 0x999999;
  private _correctColor = false;

  get color() {
    return this._color;
  }

  set color(color: number) {
    this._color = color;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.outlineColor.value.set(color);
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

    const material = getPlaneDistanceMaterial();
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
	  uniform vec3 outlineColor;
      uniform int width;
      uniform float tolerance;
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
				vec4 sceneColor = texture2D(sceneColorBuffer, vUv);

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

        // Exclude background

        float background = getIsBackground(normal);
        outline *= background;

        vec4 color = vec4(outlineColor,1.);
        
        // Correct color to make it look similar to sao postprocessing colors
        
        float factor = clamp(correctColor * 1.5, 1., 4.);
        float sum = 0.05 * step(1.5, factor);
        float r = pow(sceneColor.r + sum, 1. / factor);
        float g = pow(sceneColor.g + sum, 1. / factor);
        float b = pow(sceneColor.b + sum, 1. / factor);
        vec4 corrected = vec4(r, g, b, 1.);
        
        gl_FragColor = mix(corrected, color, outline);
	}
			`;
  }

  createOutlinePostProcessMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        correctColor: { value: 0 },
        debugVisualize: { value: 0 },
        sceneColorBuffer: { value: null },
        tolerance: { value: 2 },
        planeBuffer: { value: null },
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
}
