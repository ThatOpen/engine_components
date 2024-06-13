import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader.js";

/**
 * Represents a shadow object used in the application.
 */
export interface Shadow {
  /**
   * The root group of the shadow.
   */
  root: THREE.Group;

  /**
   * The render target for the shadow texture.
   */
  rt: THREE.WebGLRenderTarget;

  /**
   * The render target for the blurred shadow texture.
   */
  rtBlur: THREE.WebGLRenderTarget;

  /**
   * The mesh used for blurring the shadow.
   */
  blurPlane: THREE.Mesh;

  /**
   * The camera used to render the shadow.
   */
  camera: THREE.Camera;

  /**
   * The world in which the shadow is rendered.
   */
  world: OBC.World;
}

/**
 * Represents a collection of shadows, where each shadow is identified by a unique ID. The keys of the object are the IDs, and the values are the corresponding {@link Shadow} objects.
 */
export interface Shadows {
  [id: string]: Shadow;
}

/**
 * This component drops shadows on meshes in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/ShadowDropper). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/ShadowDropper).
 */
export class ShadowDropper extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "f833a09a-a3ab-4c58-b03e-da5298c7a1b6" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * Controls how far away the shadow is computed
   */
  cameraHeight = 10;

  /**
   * The darkness of the shadow.
   * A higher value makes the shadow darker.
   */
  darkness = 1.2;

  /**
   * The opacity of the shadow.
   * A higher value makes the shadow more opaque.
   */
  opacity = 1;

  /**
   * The resolution of the shadow texture.
   * A higher value results in a higher-quality shadow.
   */
  resolution = 512;

  /**
   * The amount of blur applied to the shadow.
   * A higher value makes the shadow more blurred.
   */
  amount = 3.5;

  /**
   * The color of the shadow plane.
   * This color is used when the ground color plane is enabled.
   */
  planeColor = 0xffffff;

  /**
   * The offset of the shadow from the ground.
   * A positive value moves the shadow upwards.
   */
  shadowOffset = 0;

  /**
   * The extra scale factor applied to the shadow size.
   * A higher value makes the shadow larger.
   */
  shadowExtraScaleFactor = 1.5;

  /**
   * A collection of shadows, where each shadow is identified by a unique ID.
   */
  list: Shadows = {};

  private tempMaterial = new THREE.MeshBasicMaterial({ visible: false });
  private depthMaterial = new THREE.MeshDepthMaterial();

  constructor(components: OBC.Components) {
    super(components);

    this.components.add(ShadowDropper.uuid, this);

    this.initializeDepthMaterial();
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    for (const id in this.list) {
      this.deleteShadow(id);
    }
    this.tempMaterial.dispose();
    this.depthMaterial.dispose();
    (this.components as any) = null;
    this.onDisposed.trigger(ShadowDropper.uuid);
    this.onDisposed.reset();
  }

  /**
   * Creates a blurred dropped shadow of the given mesh.
   *
   * @param model - the mesh whose shadow to generate.
   * @param id - the name of this shadow.
   */
  create(model: THREE.Mesh[], id: string, world: OBC.World) {
    if (this.list[id]) {
      throw new Error(`There is already a shadow with ID ${id}`);
    }
    const { size, center, min } = this.getSizeCenterMin(model);
    const shadow = this.createShadow(id, size, world);
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
  deleteShadow(id: string) {
    const disposer = this.components.get(OBC.Disposer);
    const shadow = this.list[id];
    delete this.list[id];
    if (!shadow) throw new Error(`No shadow with ID ${id} was found.`);
    disposer.destroy(shadow.root as any);
    disposer.destroy(shadow.blurPlane);
    shadow.rt.dispose();
    shadow.rtBlur.dispose();
  }

  private createPlanes(currentShadow: Shadow, size: THREE.Vector3) {
    const planeGeometry = new THREE.PlaneGeometry(size.x, size.z).rotateX(
      Math.PI / 2,
    );
    this.createBasePlane(currentShadow, planeGeometry);
    ShadowDropper.createBlurPlane(currentShadow, planeGeometry);
    // this.createGroundColorPlane(currentShadow, planeGeometry);
  }

  private initializeShadow(
    shadow: Shadow,
    center: THREE.Vector3,
    min: THREE.Vector3,
  ) {
    this.initializeRoot(shadow, center, min);
    ShadowDropper.initializeRenderTargets(shadow);
    ShadowDropper.initializeCamera(shadow);
  }

  private bakeShadow(meshes: THREE.Mesh[], shadow: Shadow) {
    const scene = shadow.world.scene.three;

    if (!(scene instanceof THREE.Scene)) {
      throw new Error("The core of the scene of the world must be a scene!");
    }

    if (!shadow.world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    const renderer = shadow.world.renderer.three;

    const areModelsInScene = meshes.map((mesh) => !!mesh.parent);
    for (let i = 0; i < meshes.length; i++) {
      if (!areModelsInScene[i]) {
        scene.add(meshes[i]);
      }
    }

    const children = scene.children.filter(
      (obj) => !meshes.includes(obj as any) && obj !== shadow.root,
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
    min: THREE.Vector3,
  ) {
    const scene = shadow.world.scene.three;
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
    planeGeometry: THREE.BufferGeometry,
  ) {
    shadow.blurPlane.geometry = planeGeometry;
    shadow.blurPlane.visible = false;
    shadow.root.add(shadow.blurPlane);
  }

  private createPlaneMaterial(shadow: Shadow) {
    if (!shadow.world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    const renderer = shadow.world.renderer.three;

    return new THREE.MeshBasicMaterial({
      map: shadow.rt.texture,
      opacity: this.opacity,
      transparent: true,
      depthWrite: false,
      clippingPlanes: renderer.clippingPlanes as THREE.Plane[],
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

  private createShadow(id: string, size: THREE.Vector3, world: OBC.World) {
    this.list[id] = {
      root: new THREE.Group(),
      world,
      rt: new THREE.WebGLRenderTarget(this.resolution, this.resolution),
      rtBlur: new THREE.WebGLRenderTarget(this.resolution, this.resolution),
      blurPlane: new THREE.Mesh(),
      camera: this.createCamera(size),
    };
    return this.list[id];
  }

  private createCamera(size: THREE.Vector3) {
    return new THREE.OrthographicCamera(
      -size.x / 2,
      size.x / 2,
      size.z / 2,
      -size.z / 2,
      0,
      this.cameraHeight,
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
    if (!shadow.world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    const horizontalBlurMaterial = new THREE.ShaderMaterial(
      HorizontalBlurShader,
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

    const renderer = shadow.world.renderer.three;
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
