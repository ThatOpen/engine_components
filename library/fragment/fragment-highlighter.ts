import { Matrix4, Mesh, MeshBasicMaterial } from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { Fragments } from "./fragments";

export class FragmentHighlighter {
  highlightMaterial = new MeshBasicMaterial({
    color: 0xff0000,
    depthTest: false,
  });

  active = false;

  readonly selectionId = "selection";

  private tempMatrix = new Matrix4();
  private selection?: Fragment;

  constructor(private components: Components, private fragments: Fragments) {}

  update() {
    for (const fragmentID in this.fragments.fragments) {
      const fragment = this.fragments.fragments[fragmentID];
      if (!fragment.fragments[this.selectionId]) {
        fragment.addFragment(this.selectionId, [this.highlightMaterial]);
        fragment.fragments[this.selectionId].mesh.renderOrder = 1;
      }
    }
  }

  highlightOnHover() {
    if (!this.active) return;

    const meshes = this.fragments.fragmentMeshes;
    const result = this.components.raycaster.castRay(meshes);

    if (!result) {
      this.selection?.mesh.removeFromParent();
      return;
    }

    const mesh = result.object as Mesh;
    const geometry = mesh.geometry;
    const index = result.face?.a;
    if (!geometry || !index) return;

    const scene = this.components.scene.getScene();
    const fragment = this.fragments.fragments[result.object.uuid];

    if (fragment && fragment.fragments[this.selectionId]) {
      if (this.selection) this.selection.mesh.removeFromParent();
      this.selection = fragment.fragments[this.selectionId];
      scene.add(this.selection.mesh);
      fragment.getInstance(result.instanceId as number, this.tempMatrix);
      this.selection.setInstance(0, { transform: this.tempMatrix });
      this.selection.mesh.instanceMatrix.needsUpdate = true;

      // Select block
      const blockID = this.selection.getVertexBlockID(geometry, index);
      if (blockID !== null) {
        this.selection.blocks.add([blockID], true);
      }
    }
  }
}
