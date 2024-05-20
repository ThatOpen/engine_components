import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "../core";

// TODO: Make a component?

export class GraphicVertexPicker
  extends OBC.VertexPicker
  implements OBC.Disposable
{
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  marker: Mark | null = null;

  dispose() {
    if (this.marker) {
      this.marker.dispose();
    }
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  get(world: OBC.World) {
    const found = super.get(world) as THREE.Vector3 | null;

    if (found) {
      if (!this.marker) {
        this.marker = new Mark(world);
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
