import { Material, Matrix4, Mesh } from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { Fragments } from ".";

export class FragmentHighlighter {
  active = false;
  highlights: { [name: string]: Material[] | undefined } = {};

  private tempMatrix = new Matrix4();
  private selection: { [id: string]: Fragment } = {};

  constructor(private components: Components, private fragments: Fragments) {}

  add(name: string, material?: Material[]) {
    if (this.highlights[name]) {
      throw new Error("A highlight with this name already exists");
    }

    this.highlights[name] = material;
    this.update();
  }

  update() {
    for (const fragmentID in this.fragments.fragments) {
      const fragment = this.fragments.fragments[fragmentID];
      this.updateFragmentHighlight(fragment);
    }
  }

  // TODO: Fix multi selection
  highlight(name: string, removePrevious = true) {
    if (!this.active) return null;

    const meshes = this.fragments.fragmentMeshes;
    const result = this.components.raycaster.castRay(meshes);

    let selection = this.selection[name];

    if (!result) {
      selection?.mesh.removeFromParent();
      return null;
    }

    const mesh = result.object as Mesh;
    const geometry = mesh.geometry;
    const index = result.face?.a;
    const instanceID = result.instanceId;
    if (!geometry || !index || instanceID === undefined) return null;

    const scene = this.components.scene.get();
    const fragment = this.fragments.fragments[result.object.uuid];
    if (!fragment || !fragment.fragments[name]) return null;

    if (selection) {
      selection.mesh.removeFromParent();
    }

    this.selection[name] = fragment.fragments[name];
    selection = this.selection[name];

    scene.add(selection.mesh);
    fragment.getInstance(instanceID as number, this.tempMatrix);
    selection.setInstance(0, { transform: this.tempMatrix });
    selection.mesh.instanceMatrix.needsUpdate = true;

    // Select block
    const blockID = selection.getVertexBlockID(geometry, index);
    if (blockID !== null && selection.blocks.count > 1) {
      selection.blocks.add([blockID], removePrevious);
    }

    const id = fragment.getItemID(instanceID, blockID);
    return { id, fragment };
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  clear() {
    for (const name in this.selection) {
      this.selection[name]?.mesh.removeFromParent();
    }
  }

  private updateFragmentHighlight(fragment: Fragment) {
    for (const name in this.highlights) {
      if (!fragment.fragments[name]) {
        const material = this.highlights[name];
        fragment.addFragment(name, material);
        fragment.fragments[name].mesh.renderOrder = 1;
      }
    }
  }
}
