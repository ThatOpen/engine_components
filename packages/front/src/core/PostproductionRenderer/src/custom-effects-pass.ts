import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";
import { getPlaneDistanceMaterial } from "./plane-distance-shader";
import { getProjectedNormalMaterial } from "./projected-normal-shader";

// Follows the structure of
// 		https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/OutlinePass.js
export class CustomEffectsPass extends Pass {
  components: OBC.Components;

  resolution: THREE.Vector2;
  renderScene: THREE.Scene;
  renderCamera: THREE.Camera;
  fsQuad: FullScreenQuad;
  normalOverrideMaterial: THREE.ShaderMaterial;
  glossOverrideMaterial: THREE.ShaderMaterial;

  planeBuffer: THREE.WebGLRenderTarget;
  glossBuffer: THREE.WebGLRenderTarget;
  outlineBuffer: THREE.WebGLRenderTarget;

  excludedMeshes: THREE.Mesh[] = [];

  outlinedMeshes: {
    [name: string]: {
      meshes: Set<THREE.InstancedMesh | THREE.Mesh | FRAGS.FragmentMesh>;
      material: THREE.MeshBasicMaterial;
    };
  } = {};

  outlineScene = new THREE.Scene();

  private _outlineEnabled = false;

  private _lineColor = 0x999999;
  private _opacity = 0.4;
  private _tolerance = 3;
  private _glossEnabled = true;

  private _glossExponent = 1.9;
  private _minGloss = -0.1;
  private _maxGloss = 0.1;

  get lineColor() {
    return this._lineColor;
  }

  set lineColor(lineColor: number) {
    this._lineColor = lineColor;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.lineColor.value.set(lineColor);
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

  get glossEnabled() {
    return this._glossEnabled;
  }

  set glossEnabled(active: boolean) {
    if (active === this._glossEnabled) return;
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
    new THREE.MeshBasicMaterial().color.convertLinearToSRGB();
    return this._maxGloss;
  }

  set maxGloss(value: number) {
    this._maxGloss = value;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.maxGloss.value = value;
  }

  get outlineEnabled() {
    return this._outlineEnabled;
  }

  set outlineEnabled(active: boolean) {
    if (active === this._outlineEnabled) return;
    this._outlineEnabled = active;
    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.outlineEnabled.value = active ? 1 : 0;
  }

  constructor(
    resolution: THREE.Vector2,
    components: OBC.Components,
    world: OBC.World,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) {
    super();

    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this.components = components;
    this.renderScene = scene;
    this.renderCamera = camera;
    this.resolution = new THREE.Vector2(resolution.x, resolution.y);

    this.fsQuad = new FullScreenQuad();
    this.fsQuad.material = this.createOutlinePostProcessMaterial();

    this.planeBuffer = this.newRenderTarget();
    this.glossBuffer = this.newRenderTarget();
    this.outlineBuffer = this.newRenderTarget();

    const normalMaterial = getPlaneDistanceMaterial();
    normalMaterial.clippingPlanes = world.renderer.clippingPlanes;
    this.normalOverrideMaterial = normalMaterial;

    const glossMaterial = getProjectedNormalMaterial();
    glossMaterial.clippingPlanes = world.renderer.clippingPlanes;
    this.glossOverrideMaterial = glossMaterial;
  }

  async dispose() {
    this.planeBuffer.dispose();
    this.glossBuffer.dispose();
    this.outlineBuffer.dispose();
    this.normalOverrideMaterial.dispose();
    this.glossOverrideMaterial.dispose();
    this.fsQuad.material.dispose();
    this.fsQuad.dispose();

    this.excludedMeshes = [];
    this.outlineScene.children = [];

    const disposer = this.components.get(OBC.Disposer);

    for (const name in this.outlinedMeshes) {
      const style = this.outlinedMeshes[name];
      for (const mesh of style.meshes) {
        disposer.destroy(mesh, true, true);
        const fragMesh = mesh as FRAGS.FragmentMesh;
        if (fragMesh.fragment) {
          fragMesh.fragment.dispose(true);
        }
      }
      style.material.dispose();
    }
  }

  setSize(width: number, height: number) {
    this.planeBuffer.setSize(width, height);
    this.glossBuffer.setSize(width, height);
    this.outlineBuffer.setSize(width, height);
    this.resolution.set(width, height);

    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.screenSize.value.set(
      this.resolution.x,
      this.resolution.y,
      1 / this.resolution.x,
      1 / this.resolution.y,
    );
    material.uniformsNeedUpdate = true;
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

    this.renderScene.overrideMaterial = previousOverrideMaterial;

    // Render outline pass

    renderer.setRenderTarget(this.outlineBuffer);
    if (this._outlineEnabled) {
      renderer.render(this.outlineScene, this.renderCamera);
    } else {
      renderer.clear();
    }

    for (const mesh of this.excludedMeshes) {
      mesh.visible = true;
    }

    this.renderScene.background = previousBackground;

    const material = this.fsQuad.material as THREE.ShaderMaterial;
    material.uniforms.planeBuffer.value = this.planeBuffer.texture;
    material.uniforms.glossBuffer.value = this.glossBuffer.texture;
    material.uniforms.outlineBuffer.value = this.outlineBuffer.texture;
    material.uniforms.sceneColorBuffer.value = readBuffer.texture;

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
	  uniform sampler2D outlineBuffer;
	  uniform vec4 screenSize;
	  uniform vec3 lineColor;
	  
	  uniform float outlineEnabled;
	  
      uniform int width;
	  uniform float opacity;
      uniform float tolerance;
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
	  
	    vec4 sceneColor = getValue(sceneColorBuffer, 0, 0);
	    vec3 normSceneColor = normalize(sceneColor.rgb);
  
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

        float line = step(tolerance, planeDiff);

        // Exclude background and apply opacity

        float background = getIsBackground(normal);
        line *= background;
        line *= opacity;
        
        // Add gloss
        
        vec3 gloss = getValue(glossBuffer, 0, 0).xyz;
        float diffGloss = abs(maxGloss - minGloss);
        vec3 glossExpVector = vec3(glossExponent,glossExponent,glossExponent);
        gloss = min(pow(gloss, glossExpVector), vec3(1.,1.,1.));
        gloss *= diffGloss;
        gloss += minGloss;
        vec4 glossedColor = sceneColor + vec4(gloss, 1.) * glossEnabled;
        
        vec4 corrected = mix(sceneColor, glossedColor, background);
        
        // Draw lines
        
        corrected = mix(corrected, vec4(lineColor, 1.), line);
        
        // Add outline
        
        vec4 outlinePreview =getValue(outlineBuffer, 0, 0);
        float outlineColorCorrection = 1. / max(0.2, outlinePreview.a);
        vec3 outlineColor = outlinePreview.rgb * outlineColorCorrection;
        
        // thickness between 10 and 2, opacity between 1 and 0.2
	    int outlineThickness = int(outlinePreview.a * 10.);
	    
	    float outlineDiff = 0.;
        
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 1, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -1, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, -1).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, 1).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, outlineThickness, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -outlineThickness, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, -outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, outlineThickness, outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -outlineThickness, outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -outlineThickness, -outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, outlineThickness, -outlineThickness).a);
        
        float outLine = step(4., outlineDiff) * step(outlineDiff, 12.) * outlineEnabled;
        corrected = mix(corrected, vec4(outlineColor, 1.), outLine);
        
        gl_FragColor = corrected;
	}
			`;
  }

  createOutlinePostProcessMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: this._opacity },
        debugVisualize: { value: 0 },
        sceneColorBuffer: { value: null },
        tolerance: { value: this._tolerance },
        planeBuffer: { value: null },
        glossBuffer: { value: null },
        outlineBuffer: { value: null },
        glossEnabled: { value: 1 },
        minGloss: { value: this._minGloss },
        maxGloss: { value: this._maxGloss },
        outlineEnabled: { value: 0 },
        glossExponent: { value: this._glossExponent },
        width: { value: 1 },
        lineColor: { value: new THREE.Color(this._lineColor) },
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
    const planeBuffer = new THREE.WebGLRenderTarget(
      this.resolution.x,
      this.resolution.y,
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
