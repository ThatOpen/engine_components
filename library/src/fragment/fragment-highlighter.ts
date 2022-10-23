import { Material, Matrix4, Mesh } from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { Fragments } from ".";

export class FragmentHighlighter {
  active = false;
  highlights: { [name: string]: Material } = {};

  private tempMatrix = new Matrix4();
  private selection?: Fragment;

  constructor(private components: Components, private fragments: Fragments) {}

  add(name: string, material: Material) {
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

  highlight(name: string, removePrevious = true) {
    if (!this.active) return null;

    const meshes = this.fragments.fragmentMeshes;
    const result = this.components.raycaster.castRay(meshes);

    if (!result) {
      this.selection?.mesh.removeFromParent();
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

    if (this.selection) this.selection.mesh.removeFromParent();

    this.selection = fragment.fragments[name];
    scene.add(this.selection.mesh);
    fragment.getInstance(instanceID as number, this.tempMatrix);
    this.selection.setInstance(0, { transform: this.tempMatrix });
    this.selection.mesh.instanceMatrix.needsUpdate = true;

    // Select block
    const blockID = this.selection.getVertexBlockID(geometry, index);
    if (blockID !== null) {
      this.selection.blocks.add([blockID], removePrevious);
    }

    const id = fragment.getItemID(instanceID, blockID);
    return { id, fragment };
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  clear(){
    this.selection?.mesh.removeFromParent();
  }

  private updateFragmentHighlight(fragment: Fragment) {
    for (const name in this.highlights) {
      if (!fragment.fragments[name]) {
        const material = this.highlights[name];
        fragment.addFragment(name, [material]);
        fragment.fragments[name].mesh.renderOrder = 1;
      }
    }
  }
}
