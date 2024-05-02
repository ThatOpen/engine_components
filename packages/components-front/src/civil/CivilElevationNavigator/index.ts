import * as OBC from "@thatopen/components";
import { CivilMarker } from "../CivilMarker";
import { CivilNavigator } from "../CivilNavigator";

export class CivilElevationNavigator extends CivilNavigator {
  static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;

  readonly view = "vertical";

  enabled = true;

  set world(world: OBC.World) {
    if (this.world === world) return;
    super.world = world;

    if (!this.highlighter) {
      return;
    }

    // TODO: Can we substitute this by the .onHighlight event?
    //  That way we can put this in the constructor
    this.highlighter.onSelect.add((mesh) => {
      if (!this.world) {
        throw new Error("A world is needed to work with this component!");
      }

      // Add markers elevation

      const marker = this.components.get(CivilMarker);

      marker.deleteByType(["Slope", "Height", "InitialKPV", "FinalKPV"]);

      const { alignment } = mesh.curve;
      const positionsVertical = [];

      for (const align of alignment.vertical) {
        const pos = align.mesh.geometry.attributes.position.array;
        positionsVertical.push(pos);
      }

      const { defSegments, slope } = this.setDefSegments(positionsVertical);

      const scene = this.world.scene.three;

      for (let i = 0; i < alignment.vertical.length; i++) {
        const align = alignment.vertical[i];

        marker.addVerticalMarker(
          this.world,
          `S: ${slope[i].slope}%`,
          align.mesh,
          "Slope",
          scene,
        );

        marker.addVerticalMarker(
          this.world,
          `H: ${defSegments[i].end.y.toFixed(2)}`,
          align.mesh,
          "Height",
          scene,
        );
      }

      marker.addVerticalMarker(
        this.world,
        "KP: 0",
        alignment.vertical[0].mesh,
        "InitialKPV",
        scene,
      );

      marker.addVerticalMarker(
        this.world,
        `KP: ${alignment.vertical.length}`,
        alignment.vertical[alignment.vertical.length - 1].mesh,
        "FinalKPV",
        scene,
      );
    });
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilElevationNavigator.uuid, this);
  }
}
