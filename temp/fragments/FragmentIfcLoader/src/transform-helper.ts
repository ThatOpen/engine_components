import { BufferGeometry } from "three";
import * as THREE from "three";

export class TransformHelper {
  getHelper(geometries: BufferGeometry[]) {
    const baseHelper = new THREE.Object3D();

    let cenx = 0;
    let ceny = 0;
    let cenz = 0;
    let num = 0;

    for (const geom of geometries) {
      const position = geom.attributes.position as THREE.BufferAttribute;
      const positions = position.array;
      for (let i = 0; i < positions.length; i += 3) {
        cenx += positions[i];
        ceny += positions[i + 1];
        cenz += positions[i + 2];
        num++;
      }
    }

    if (num > 0) {
      cenx /= num;
      ceny /= num;
      cenz /= num;
    }
    const cen = new THREE.Vector3(cenx, ceny, cenz);

    let vx = new THREE.Vector3();
    let vy = new THREE.Vector3();
    let vz = new THREE.Vector3();

    let newDimx = 0;
    let newDimy = 0;
    let newDimz = 0;

    let despx = 0;
    let despy = 0;
    let despz = 0;

    let volumPrev = 10000000000000;

    for (let r = 0; r < 15; r++) {
      let vvx = new THREE.Vector3();

      if (r === 0) {
        vvx = new THREE.Vector3(1, 0, 0);
      }
      if (r === 1) {
        vvx = new THREE.Vector3(1, 0, 1);
      }
      if (r === 2) {
        vvx = new THREE.Vector3(1, 1, 0);
      }
      if (r === 3) {
        vvx = new THREE.Vector3(1, 1, 1);
      }
      if (r === 4) {
        vvx = new THREE.Vector3(0, 1, 1);
      }
      if (r === 5) {
        vvx = new THREE.Vector3(1, 0, 0.5);
      }
      if (r === 6) {
        vvx = new THREE.Vector3(1, 0.5, 0);
      }
      if (r === 7) {
        vvx = new THREE.Vector3(1, 1, 0.5);
      }
      if (r === 8) {
        vvx = new THREE.Vector3(0, 1, 0.5);
      }
      if (r === 9) {
        vvx = new THREE.Vector3(0.5, 0, 1);
      }
      if (r === 10) {
        vvx = new THREE.Vector3(0.5, 1, 0);
      }
      if (r === 11) {
        vvx = new THREE.Vector3(0.5, 1, 1);
      }
      if (r === 12) {
        vvx = new THREE.Vector3(0, 0.5, 1);
      }
      if (r === 13) {
        vvx = new THREE.Vector3(0.5, 0.5, 1);
      }
      if (r === 14) {
        vvx = new THREE.Vector3(1, 0.5, 0.5);
      }

      vvx.normalize();

      const vvy = new THREE.Vector3(vvx.x, vvx.y, vvx.z);
      vvy.cross(new THREE.Vector3(0, 0, 1));
      const vvz = new THREE.Vector3(vvy.x, vvy.y, vvy.z);
      vvz.cross(vvx);

      vvx.normalize();
      vvy.normalize();
      vvz.normalize();

      let mabX = -1e10;
      let mabY = -1e10;
      let mabZ = -1e10;
      let mibX = 1e10;
      let mibY = 1e10;
      let mibZ = 1e10;

      for (const geom of geometries) {
        const position = geom.attributes.position as THREE.BufferAttribute;
        const positions = position.array;
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];
          const dx = x - cen.x;
          const dy = y - cen.y;
          const dz = z - cen.z;
          const vp = new THREE.Vector3(dx, dy, dz);
          const newX = vvx.dot(vp);
          const newY = vvy.dot(vp);
          const newZ = vvz.dot(vp);

          if (newX > mabX) {
            mabX = newX;
          }
          if (newY > mabY) {
            mabY = newY;
          }
          if (newZ > mabZ) {
            mabZ = newZ;
          }
          if (newX < mibX) {
            mibX = newX;
          }
          if (newY < mibY) {
            mibY = newY;
          }
          if (newZ < mibZ) {
            mibZ = newZ;
          }
        }
      }

      const newDix = mabX - mibX;
      const newDiy = mabY - mibY;
      const newDiz = mabZ - mibZ;

      const volume = newDix * newDiy * newDiz;
      if (volume < volumPrev) {
        volumPrev = volume;
        vx = vvx;
        vy = vvy;
        vz = vvz;
        newDimx = newDix;
        newDimy = newDiy;
        newDimz = newDiz;
        despx = (mabX + mibX) / 2;
        despy = (mabY + mibY) / 2;
        despz = (mabZ + mibZ) / 2;
      }
    }

    cen.x += despx * vx.x;
    cen.y += despx * vx.y;
    cen.z += despx * vx.z;

    cen.x += despy * vy.x;
    cen.y += despy * vy.y;
    cen.z += despy * vy.z;

    cen.x += despz * vz.x;
    cen.y += despz * vz.y;
    cen.z += despz * vz.z;

    vx = vx.setLength(newDimx);
    vy = vy.setLength(newDimy);
    vz = vz.setLength(newDimz);

    baseHelper.matrix = new THREE.Matrix4();
    baseHelper.matrix.set(
      vx.x,
      vx.y,
      vx.z,
      0,
      vy.x,
      vy.y,
      vy.z,
      0,
      vz.x,
      vz.y,
      vz.z,
      0,
      cen.x,
      cen.y,
      cen.z,
      1
    );

    baseHelper.matrix.transpose();

    return baseHelper;
  }
}
