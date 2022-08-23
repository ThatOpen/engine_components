import {
  EdgesGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Object3D,
} from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";

export class FragmentEdges {
  edgesList: { [guid: string]: LineSegments } = {};
  edgesToUpdate = new Set<string>();
  threshold = 80;

  private mat4 = new Matrix4();
  private dummy = new Object3D();

  private pos: number[] = [];
  private rot: number[] = [];
  private scl: number[] = [];

  private lineMat = new LineBasicMaterial({
    color: 0x555555,
    // @ts-ignore
    onBeforeCompile: (shader) => {
      shader.vertexShader = `
    attribute vec3 instT;
    attribute vec4 instR;
    attribute vec3 instS;
    
    // http://barradeau.com/blog/?p=1109
    vec3 trs( inout vec3 position, vec3 T, vec4 R, vec3 S ) {
        position *= S;
        position += 2.0 * cross( R.xyz, cross( R.xyz, position ) + R.w * position );
        position += T;
        return position;
    }
    ${shader.vertexShader}
`.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
      transformed = trs(transformed, instT, instR, instS);
`
      );
      console.log(shader.vertexShader);
    },
  });

  constructor(private components: Components) {}

  generate(fragment: Fragment) {
    if (this.edgesList[fragment.id]) {
      const previous = this.edgesList[fragment.id];
      previous.removeFromParent();
      previous.geometry.dispose();
      (previous.geometry as any) = null;
      delete this.edgesList[fragment.id];
    }

    this.getInstanceTransforms(fragment);

    const edgesGeom = new EdgesGeometry(fragment.mesh.geometry, this.threshold);
    const lineGeom = new InstancedBufferGeometry().copy(edgesGeom);
    lineGeom.instanceCount = Infinity;

    this.setAttributes(lineGeom);

    const lines = new LineSegments(lineGeom, this.lineMat);
    lines.frustumCulled = false;

    const scene = this.components.scene.getScene();
    scene.add(lines);
    this.edgesList[fragment.id] = lines;

    this.updateInstancedEdges(fragment, lineGeom);

    return lines;
  }

  private updateInstancedEdges(
    fragment: Fragment,
    lineGeom: InstancedBufferGeometry
  ) {
    for (let i = 0; i < fragment.mesh.count; i++) {
      fragment.mesh.getMatrixAt(i, this.mat4);
      this.mat4.decompose(
        this.dummy.position,
        this.dummy.quaternion,
        this.dummy.scale
      );
      this.linesTRS(i, this.dummy, lineGeom);
    }
  }

  private setAttributes(lineGeom: InstancedBufferGeometry) {
    lineGeom.setAttribute(
      "instT",
      new InstancedBufferAttribute(new Float32Array(this.pos), 3)
    );

    lineGeom.setAttribute(
      "instR",
      new InstancedBufferAttribute(new Float32Array(this.rot), 4)
    );

    lineGeom.setAttribute(
      "instS",
      new InstancedBufferAttribute(new Float32Array(this.scl), 3)
    );

    this.pos.length = 0;
    this.rot.length = 0;
    this.scl.length = 0;
  }

  private getInstanceTransforms(fragment: Fragment) {
    for (let i = 0; i < fragment.mesh.count; i++) {
      fragment.getInstance(i, this.dummy.matrix);
      this.dummy.updateMatrix();
      this.pos.push(
        this.dummy.position.x,
        this.dummy.position.y,
        this.dummy.position.z
      );
      this.rot.push(
        this.dummy.quaternion.x,
        this.dummy.quaternion.y,
        this.dummy.quaternion.z,
        this.dummy.quaternion.w
      );
      this.scl.push(this.dummy.scale.x, this.dummy.scale.y, this.dummy.scale.z);
    }
  }

  linesTRS(index: any, o: any, lineGeom: any) {
    lineGeom.attributes.instT.setXYZ(
      index,
      o.position.x,
      o.position.y,
      o.position.z
    );
    lineGeom.attributes.instT.needsUpdate = true;
    lineGeom.attributes.instR.setXYZW(
      index,
      o.quaternion.x,
      o.quaternion.y,
      o.quaternion.z,
      o.quaternion.w
    );
    lineGeom.attributes.instR.needsUpdate = true;
    lineGeom.attributes.instS.setXYZ(index, o.scale.x, o.scale.y, o.scale.z);
    lineGeom.attributes.instS.needsUpdate = true;
  }
}
