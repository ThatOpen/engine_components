import { Matrix4, Mesh, MeshBasicMaterial } from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";

export class FragmentHighlighter {
  highlightMaterial = new MeshBasicMaterial({
    color: 0xff0000,
    depthTest: false,
  });

  readonly selectionId = "selection";

  private fragmentsById: { [id: string]: Fragment } = {};
  private fragmentMeshes: Mesh[] = [];
  private tempMatrix = new Matrix4();
  private selection?: Fragment;

  constructor(private components: Components) {}

  set fragments(fragments: Fragment[]) {
    this.fragmentsById = {};
    this.fragmentMeshes.length = 0;

    for (const fragment of fragments) {
      this.fragmentsById[fragment.id] = fragment;
      this.fragmentMeshes.push(fragment.mesh);

      if (!fragment.fragments[this.selectionId]) {
        fragment.addFragment(this.selectionId, [this.highlightMaterial]);
        fragment.fragments[this.selectionId].mesh.renderOrder = 1;
      }
    }
  }

  highlightOnHover() {
    const t0 = performance.now();
    const result = this.components.raycaster.castRay(this.fragmentMeshes);
    const t1 = performance.now();
    console.log(`Time ${t1 - t0}`)
    if (result) {
      const scene = this.components.scene.getScene();
      const fragment = this.fragmentsById[result.object.uuid];
      if (fragment) {
        if (this.selection) this.selection.mesh.removeFromParent();
        this.selection = fragment.fragments[this.selectionId];
        scene.add(this.selection.mesh);
        fragment.getInstance(result.instanceId as number, this.tempMatrix);
        this.selection.setInstance(0, { transform: this.tempMatrix });
        this.selection.mesh.instanceMatrix.needsUpdate = true;

        // Select block
        const blockID = this.selection.getBlockID(result);
        if (blockID !== null) {
          this.selection.blocks.add([blockID], true);

          const itemID = fragment.getItemID(
            result.instanceId as number,
            blockID
          );

          console.log(itemID);
        }
      }
    } else if (this.selection) this.selection.mesh.removeFromParent();
  }
}
