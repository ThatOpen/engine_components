import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "../core";

// TODO: Make a component?

/**
 * A class that extends {@link OBC.VertexPicker} to provide a graphical marker for picking vertices in a 3D scene.
 */
export class GraphicVertexPicker
  extends OBC.VertexPicker
  implements OBC.Disposable
{
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** The marker used to indicate the picked vertex. */
  marker: Mark | null = null;

  private _className = "default-vertex-picker";

  get className() {
    return this._className;
  }

  set className(name: string) {
    this._className = name;
    if (this.marker) {
      this.marker.three.element.className = name;
    }
  }

  constructor(
    components: OBC.Components,
    config?: Partial<OBC.VertexPickerConfig>,
  ) {
    super(components, config);
    this.onEnabled.add((value: boolean) => {
      if (this.marker) {
        this.marker.visible = value;
      }
    });
  }

  /** {@link OBC.Disposable.onDisposed} */
  dispose() {
    if (this.marker) {
      this.marker.dispose();
    }
    super.dispose();
  }

  /**
   * Retrieves the picked vertex from the world and updates the marker's position.
   * If no vertex is picked, the marker is hidden.
   *
   * @param world - The world in which to pick the vertex.
   * @returns The picked vertex, or null if no vertex was picked.
   */
  get(world: OBC.World) {
    const found = super.get(world) as THREE.Vector3 | null;

    if (found) {
      if (!this.marker) {
        this.marker = new Mark(world);
        this.marker.three.element.className = this._className;
      }
      if (this.marker.world !== world) {
        this.marker.world = world;
        this.marker.three.removeFromParent();
        world.scene.three.add(this.marker.three);
      }
      this.marker.visible = true;
      this.marker.three.position.copy(found);
    } else if (this.marker) {
      this.marker.visible = false;
    }

    return found;
  }
}
