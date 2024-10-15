import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { PostproductionRenderer } from "../../core";

/**
 * This component allows adding a colored outline with thickness to fragments in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Highlighter). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Outliner).
 */
export class Outliner extends OBC.Component implements OBC.Disposable {
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /**
   * The world where the outliner operates.
   */
  world?: OBC.World;

  /** {@link OBC.Component.enabled} */
  get enabled() {
    if (!this.world || this.world.isDisposing) {
      return false;
    }

    const renderer = this.getRenderer();
    return renderer.postproduction.customEffects.outlineEnabled;
  }

  /** {@link OBC.Component.enabled} */
  set enabled(value: boolean) {
    if (!this.world || this.world.isDisposing) {
      return;
    }

    const renderer = this.getRenderer();
    renderer.postproduction.customEffects.outlineEnabled = value;
  }

  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "2fd3bcc5-b3b6-4ded-9f64-f47a02854a10" as const;

  /**
   * Creates a new outlining style.
   *
   * @param name - The name of the style.
   * @param material - The material to use for the style. The color controls the line color and the opacity controls the line thickness.
   *
   */
  create(name: string, material: THREE.MeshBasicMaterial) {
    const renderer = this.getRenderer();

    const styles = renderer.postproduction.customEffects.outlinedMeshes;
    if (styles[name] !== undefined) {
      throw new Error(`There's already a style with the name ${name}.`);
    }

    renderer.postproduction.customEffects.outlinedMeshes[name] = {
      material,
      meshes: new Set(),
    };
  }

  /**
   * Adds fragments to the specified outlining style.
   *
   * @param name - The name of the style.
   * @param items - The fragments to add to the style.
   *
   */
  add(name: string, items: FRAGS.FragmentIdMap) {
    const renderer = this.getRenderer();
    const styles = this.getStyles();
    const style = styles[name];
    if (!style) {
      throw new Error(`The style ${name} does not exist`);
    }

    const scene = renderer.postproduction.customEffects.outlineScene;

    const fragments = this.components.get(OBC.FragmentsManager);
    for (const fragID in items) {
      const found = fragments.list.get(fragID);
      if (!found) {
        continue;
      }
      const ids = items[fragID];
      const clonedFrag = found.clone(ids);

      clonedFrag.mesh.position.set(0, 0, 0);
      clonedFrag.mesh.rotation.set(0, 0, 0);
      clonedFrag.mesh.applyMatrix4(found.mesh.matrixWorld);

      clonedFrag.mesh.instanceColor = null;
      clonedFrag.mesh.material = [style.material];
      style.meshes.add(clonedFrag.mesh);
      scene.add(clonedFrag.mesh);
    }
  }

  /**
   * Clears the specified style. If no style is specified, clear all styles.
   *
   * @param name - Optional: the style to clear.
   *
   */
  clear(name?: string) {
    if (name) {
      this.clearStyle(name, false);
      return;
    }

    const styles = this.getStyles();
    const styleNames = Object.keys(styles);
    for (const name of styleNames) {
      this.clearStyle(name, false);
    }

    this.world = undefined;
  }

  /** {@link OBC.Disposable.dispose} */

  dispose() {
    if (this.world && !this.world.isDisposing) {
      const styles = this.getStyles();
      const styleNames = Object.keys(styles);
      for (const name of styleNames) {
        this.clearStyle(name, true);
      }
    }
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private clearStyle(name: string, dispose: boolean) {
    const styles = this.getStyles();
    const style = styles[name];
    if (!style) {
      return;
    }

    const disposer = this.components.get(OBC.Disposer);

    for (const mesh of style.meshes) {
      const fragMesh = mesh as FRAGS.FragmentMesh;
      if (fragMesh.fragment) {
        fragMesh.fragment.dispose(false);
      }
      disposer.destroy(mesh);
    }

    style.meshes.clear();

    if (dispose) {
      style.material.dispose();
      delete styles[name];
    }
  }

  private getStyles() {
    const renderer = this.getRenderer();
    return renderer.postproduction.customEffects.outlinedMeshes;
  }

  private getRenderer() {
    if (!this.world) {
      throw new Error("You must set a world to use the outliner!");
    }

    const renderer = this.world.renderer as PostproductionRenderer;
    if (!renderer.postproduction) {
      throw new Error(
        "The world given to the outliner must use the postproduction renderer.",
      );
    }

    return renderer;
  }
}
