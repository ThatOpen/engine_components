export interface Item3D extends THREE.Object3D {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
}
