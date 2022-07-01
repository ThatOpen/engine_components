import {CameraComponent} from "../base-types";
import * as THREE from 'three'
import {Components} from "../components";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class SimpleCamera implements CameraComponent {
  activeCamera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls

  constructor(components: Components) {
    this.activeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.activeCamera.position.set( 50, 50, 0 );

    this.orbitControls = new OrbitControls(this.activeCamera, components.renderer?.renderer.domElement)
    this.orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.minDistance = 1;
    this.orbitControls.maxDistance = 500;
    this.orbitControls.maxPolarAngle = Math.PI / 2;

    components.scene?.getScene().add(this.activeCamera);
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.activeCamera;
  }

  update(_delta: number): void {
    this.orbitControls.update()
  }

  set enabled(enabled: boolean) {
    this.orbitControls.enabled = enabled;
  }

  get enabled(){
    return this.orbitControls.enabled;
  }
}