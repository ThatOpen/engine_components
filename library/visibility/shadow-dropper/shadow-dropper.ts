import {
  Box3,
  BufferGeometry,
  Camera,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader";
import { disposeMeshRecursively } from "../../core";
import { Components } from "../../components";

export interface Shadow {
  root: Group;
  rt: WebGLRenderTarget;
  rtBlur: WebGLRenderTarget;
  blurPlane: Mesh;
  camera: Camera;
}

export class ShadowDropper {
  shadows: { [id: string]: Shadow } = {};

  // Controls how far away the shadow is computed
  cameraHeight = 10;

  darkness = 1.2;
  opacity = 1;
  resolution = 512;
  amount = 3.5;
  planeColor = 0xffffff;
  shadowOffset = 0;

  shadowExtraScaleFactor = 1.5;

  private tempMaterial = new MeshBasicMaterial({ visible: false });
  private depthMaterial = new MeshDepthMaterial();

  constructor(private components: Components) {
    this.initializeDepthMaterial();
  }

  dispose() {
    const shadowIDs = Object.keys(this.shadows);
    shadowIDs.forEach((shadowID) => this.deleteShadow(shadowID));
    (this.shadows as any) = null;
    this.tempMaterial.dispose();
    (this.tempMaterial as any) = null;
    this.depthMaterial.dispose();
    (this.depthMaterial as any) = null;
    (this.components as any) = null;
  }

  renderShadow(model: Mesh[], id: string) {
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

  deleteShadow(id: string) {
    const shadow = this.shadows[id];
    delete this.shadows[id];
    if (!shadow) throw new Error(`No shadow with ID ${id} was found.`);
    disposeMeshRecursively(shadow.root as any);
    disposeMeshRecursively(shadow.blurPlane);
    shadow.rt.dispose();
    shadow.rtBlur.dispose();
  }

  private createPlanes(currentShadow: Shadow, size: Vector3) {
    const planeGeometry = new PlaneGeometry(size.x, size.z).rotateX(
      Math.PI / 2
    );
    this.createBasePlane(currentShadow, planeGeometry);
    ShadowDropper.createBlurPlane(currentShadow, planeGeometry);
    // this.createGroundColorPlane(currentShadow, planeGeometry);
  }

  private initializeShadow(shadow: Shadow, center: Vector3, min: Vector3) {
    this.initializeRoot(shadow, center, min);
    ShadowDropper.initializeRenderTargets(shadow);
    ShadowDropper.initializeCamera(shadow);
  }

  private bakeShadow(meshes: Mesh[], shadow: Shadow) {
    const scene = this.components.scene.getScene();

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

    // render to the render target to get the depths
    const renderer = this.components.renderer.renderer;
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

  private initializeRoot(shadow: Shadow, center: Vector3, min: Vector3) {
    const scene = this.components.scene.getScene();
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

  private createBasePlane(shadow: Shadow, planeGeometry: BufferGeometry) {
    const planeMaterial = this.createPlaneMaterial(shadow);
    const plane = new Mesh(planeGeometry, planeMaterial);
    // make sure it's rendered after the fillPlane
    plane.renderOrder = 2;
    shadow.root.add(plane);
    // the y from the texture is flipped!
    plane.scale.y = -1;
  }

  private static createBlurPlane(
    shadow: Shadow,
    planeGeometry: BufferGeometry
  ) {
    shadow.blurPlane.geometry = planeGeometry;
    shadow.blurPlane.visible = false;
    shadow.root.add(shadow.blurPlane);
  }

  private createPlaneMaterial(shadow: Shadow) {
    return new MeshBasicMaterial({
      map: shadow.rt.texture,
      opacity: this.opacity,
      transparent: true,
      depthWrite: false,
      clippingPlanes: this.components.clipplingPlanes,
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

  private createShadow(id: string, size: Vector3) {
    this.shadows[id] = {
      root: new Group(),
      rt: new WebGLRenderTarget(this.resolution, this.resolution),
      rtBlur: new WebGLRenderTarget(this.resolution, this.resolution),
      blurPlane: new Mesh(),
      camera: this.createCamera(size),
    };
    return this.shadows[id];
  }

  private createCamera(size: Vector3) {
    return new OrthographicCamera(
      -size.x / 2,
      size.x / 2,
      size.z / 2,
      -size.z / 2,
      0,
      this.cameraHeight
    );
  }

  private getSizeCenterMin(meshes: Mesh[]) {
    const parent = meshes[0].parent;
    const group = new Group();
    group.children = meshes;
    const boundingBox = new Box3().setFromObject(group);
    parent?.add(...meshes);

    const size = new Vector3();
    boundingBox.getSize(size);
    size.x *= this.shadowExtraScaleFactor;
    size.z *= this.shadowExtraScaleFactor;
    const center = new Vector3();
    boundingBox.getCenter(center);
    const min = boundingBox.min;
    return { size, center, min };
  }

  private blurShadow(shadow: Shadow, amount: number) {
    const horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader);
    horizontalBlurMaterial.depthTest = false;

    const verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader);
    verticalBlurMaterial.depthTest = false;

    shadow.blurPlane.visible = true;

    // blur horizontally and draw in the renderTargetBlur
    shadow.blurPlane.material = horizontalBlurMaterial;
    // @ts-ignore
    shadow.blurPlane.material.uniforms.tDiffuse.value = shadow.rt.texture;
    horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256;

    const renderer = this.components.renderer.renderer;
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
