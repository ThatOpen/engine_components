import * as THREE from "three";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader";
import { Component, Disposable } from "../../base-types";
import { Components, Disposer, ToolComponent } from "../../core";

// TODO: Clean up and document this

export interface Shadow {
  root: THREE.Group;
  rt: THREE.WebGLRenderTarget;
  rtBlur: THREE.WebGLRenderTarget;
  blurPlane: THREE.Mesh;
  camera: THREE.Camera;
}

export interface Shadows {
  [id: string]: Shadow;
}

export class ShadowDropper extends Component<Shadows> implements Disposable {
  static readonly uuid = "f833a09a-a3ab-4c58-b03e-da5298c7a1b6" as const;

  enabled = true;

  // Controls how far away the shadow is computed
  cameraHeight = 10;

  darkness = 1.2;
  opacity = 1;
  resolution = 512;
  amount = 3.5;
  planeColor = 0xffffff;
  shadowOffset = 0;

  shadowExtraScaleFactor = 1.5;

  private shadows: Shadows = {};
  private tempMaterial = new THREE.MeshBasicMaterial({ visible: false });
  private depthMaterial = new THREE.MeshDepthMaterial();

  constructor(components: Components) {
    super(components);

    this.components.tools.add(ShadowDropper.uuid, this);

    this.initializeDepthMaterial();
  }

  /** {@link Component.get} */
  get(): Shadows {
    return this.shadows;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    for (const id in this.shadows) {
      await this.deleteShadow(id);
    }
    this.tempMaterial.dispose();
    this.depthMaterial.dispose();
    (this.components as any) = null;
  }

  /**
   * Creates a blurred dropped shadow of the given mesh.
   *
   * @param model - the mesh whose shadow to generate.
   * @param id - the name of this shadow.
   */
  renderShadow(model: THREE.Mesh[], id: string) {
    if (this.shadows[id]) {
      throw new Error(`There is already a shadow with ID ${id}`);
    }
    const { size, center, min } = this.getSizeCenterMin(model);
    const shadow = this.createShadow(id, size);
    this.initializeShadow(shadow, center, min);
    this.createPlanes(shadow, size);
    this.bakeShadow(model, shadow);
    return shadow.root;
  }

  /**
   * Deletes the specified shadow (if it exists).
   *
   * @param id - the name of this shadow.
   */
  async deleteShadow(id: string) {
    const disposer = await this.components.tools.get(Disposer);
    const shadow = this.shadows[id];
    delete this.shadows[id];
    if (!shadow) throw new Error(`No shadow with ID ${id} was found.`);
    disposer.destroy(shadow.root as any);
    disposer.destroy(shadow.blurPlane);
    shadow.rt.dispose();
    shadow.rtBlur.dispose();
  }

  private createPlanes(currentShadow: Shadow, size: THREE.Vector3) {
    const planeGeometry = new THREE.PlaneGeometry(size.x, size.z).rotateX(
      Math.PI / 2
    );
    this.createBasePlane(currentShadow, planeGeometry);
    ShadowDropper.createBlurPlane(currentShadow, planeGeometry);
    // this.createGroundColorPlane(currentShadow, planeGeometry);
  }

  private initializeShadow(
    shadow: Shadow,
    center: THREE.Vector3,
    min: THREE.Vector3
  ) {
    this.initializeRoot(shadow, center, min);
    ShadowDropper.initializeRenderTargets(shadow);
    ShadowDropper.initializeCamera(shadow);
  }

  private bakeShadow(meshes: THREE.Mesh[], shadow: Shadow) {
    const scene = this.components.scene.get();

    const areModelsInScene = meshes.map((mesh) => !!mesh.parent);
    for (let i = 0; i < meshes.length; i++) {
      if (!areModelsInScene[i]) {
        scene.add(meshes[i]);
      }
    }

    const children = scene.children.filter(
      (obj) => !meshes.includes(obj as any) && obj !== shadow.root
    );

    for (let i = children.length - 1; i >= 0; i--) {
      scene.remove(children[i]);
    }

    // remove the background
    const initialBackground = scene.background;
    scene.background = null;

    // force the depthMaterial to everything
    scene.overrideMaterial = this.depthMaterial;

    // Make meshes visible if they were invisible
    const previousVisibleAttributes: boolean[] = [];
    for (const mesh of meshes) {
      previousVisibleAttributes.push(mesh.visible);
      mesh.visible = true;
    }

    // render to the render target to get the depths
    const renderer = this.components.renderer.get();
    renderer.setRenderTarget(shadow.rt);
    renderer.render(scene, shadow.camera);

    // and reset the override material
    scene.overrideMaterial = null;

    this.blurShadow(shadow, this.amount);
    // a second pass to reduce the artifacts
    // (0.4 is the minimum blur amount so that the artifacts are gone)
    this.blurShadow(shadow, this.amount * 0.4);

    // reset and render the normal scene
    renderer.setRenderTarget(null);
    scene.background = initialBackground;

    // reset visibility
    for (let i = 0; i < meshes.length; i++) {
      meshes[i].visible = previousVisibleAttributes[i];
    }

    for (let i = children.length - 1; i >= 0; i--) {
      scene.add(children[i]);
    }

    for (let i = 0; i < meshes.length; i++) {
      if (!areModelsInScene[i]) {
        scene.remove(meshes[i]);
      }
    }
  }

  private static initializeCamera(shadow: Shadow) {
    shadow.camera.rotation.x = Math.PI / 2; // get the camera to look up
    shadow.root.add(shadow.camera);
  }

  private static initializeRenderTargets(shadow: Shadow) {
    shadow.rt.texture.generateMipmaps = false;
    shadow.rtBlur.texture.generateMipmaps = false;
  }

  private initializeRoot(
    shadow: Shadow,
    center: THREE.Vector3,
    min: THREE.Vector3
  ) {
    const scene = this.components.scene.get();
    shadow.root.position.set(center.x, min.y - this.shadowOffset, center.z);
    scene.add(shadow.root);
  }

  // Plane simulating the "ground". This is not needed for BIM models generally
  // private createGroundColorPlane(_shadow: Shadow, planeGeometry: BufferGeometry) {
  //   const fillPlaneMaterial = new MeshBasicMaterial({
  //     color: this.planeColor,
  //     opacity: this.opacity,
  //     transparent: true,
  //     depthWrite: false,
  //     clippingPlanes: this.context.getClippingPlanes()
  //   });
  //   const fillPlane = new Mesh(planeGeometry, fillPlaneMaterial);
  //   fillPlane.rotateX(Math.PI);
  //   fillPlane.renderOrder = -1;
  //   shadow.root.add(fillPlane);
  // }

  private createBasePlane(shadow: Shadow, planeGeometry: THREE.BufferGeometry) {
    const planeMaterial = this.createPlaneMaterial(shadow);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // make sure it's rendered after the fillPlane
    plane.renderOrder = 2;
    shadow.root.add(plane);
    // the y from the texture is flipped!
    plane.scale.y = -1;
  }

  private static createBlurPlane(
    shadow: Shadow,
    planeGeometry: THREE.BufferGeometry
  ) {
    shadow.blurPlane.geometry = planeGeometry;
    shadow.blurPlane.visible = false;
    shadow.root.add(shadow.blurPlane);
  }

  private createPlaneMaterial(shadow: Shadow) {
    const renderer = this.components.renderer;
    return new THREE.MeshBasicMaterial({
      map: shadow.rt.texture,
      opacity: this.opacity,
      transparent: true,
      depthWrite: false,
      clippingPlanes: renderer.clippingPlanes,
    });
  }

  // like MeshDepthMaterial, but goes from black to transparent
  private initializeDepthMaterial() {
    this.depthMaterial.depthTest = false;
    this.depthMaterial.depthWrite = false;

    const oldShader =
      "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );";

    const newShader =
      "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );";

    this.depthMaterial.userData.darkness = { value: this.darkness };

    this.depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.darkness = this.depthMaterial.userData.darkness;
      shader.fragmentShader = /* glsl */ `
						uniform float darkness;
						${shader.fragmentShader.replace(oldShader, newShader)}
					`;
    };
  }

  private createShadow(id: string, size: THREE.Vector3) {
    this.shadows[id] = {
      root: new THREE.Group(),
      rt: new THREE.WebGLRenderTarget(this.resolution, this.resolution),
      rtBlur: new THREE.WebGLRenderTarget(this.resolution, this.resolution),
      blurPlane: new THREE.Mesh(),
      camera: this.createCamera(size),
    };
    return this.shadows[id];
  }

  private createCamera(size: THREE.Vector3) {
    return new THREE.OrthographicCamera(
      -size.x / 2,
      size.x / 2,
      size.z / 2,
      -size.z / 2,
      0,
      this.cameraHeight
    );
  }

  private getSizeCenterMin(meshes: THREE.Mesh[]) {
    const parent = meshes[0].parent;
    const group = new THREE.Group();
    group.children = meshes;
    const boundingBox = new THREE.Box3().setFromObject(group);
    parent?.add(...meshes);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    size.x *= this.shadowExtraScaleFactor;
    size.z *= this.shadowExtraScaleFactor;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const min = boundingBox.min;
    return { size, center, min };
  }

  private blurShadow(shadow: Shadow, amount: number) {
    const horizontalBlurMaterial = new THREE.ShaderMaterial(
      HorizontalBlurShader
    );
    horizontalBlurMaterial.depthTest = false;

    const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
    verticalBlurMaterial.depthTest = false;

    shadow.blurPlane.visible = true;

    // blur horizontally and draw in the renderTargetBlur
    shadow.blurPlane.material = horizontalBlurMaterial;
    // @ts-ignore
    shadow.blurPlane.material.uniforms.tDiffuse.value = shadow.rt.texture;
    horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;

    const renderer = this.components.renderer.get();
    renderer.setRenderTarget(shadow.rtBlur);
    renderer.render(shadow.blurPlane, shadow.camera);

    // blur vertically and draw in the main renderTarget
    shadow.blurPlane.material = verticalBlurMaterial;
    // @ts-ignore
    shadow.blurPlane.material.uniforms.tDiffuse.value = shadow.rtBlur.texture;
    verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256;

    renderer.setRenderTarget(shadow.rt);
    renderer.render(shadow.blurPlane, shadow.camera);

    shadow.blurPlane.visible = false;
  }
}

ToolComponent.libraryUUIDs.add(ShadowDropper.uuid);
