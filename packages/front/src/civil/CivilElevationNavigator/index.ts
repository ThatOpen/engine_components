import * as OBC from "@thatopen/components";
import { CivilMarker } from "../CivilMarker";
import { CivilNavigator } from "../CivilNavigator";

/**
 * This component is responsible for navigating and visualizing elevation data of infra/civil models (vertical alignments). 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/CivilElevationNavigator). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/CivilElevationNavigator).
 */
export class CivilElevationNavigator extends CivilNavigator {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;

  /** {@link OBC.Component.enabled} */
  enabled = true;

  readonly view = "vertical";

  /**
   * Getter for the world property.
   * This property is used to retrieve the world context for the component.
   *
   * @returns {OBC.World | null} - The current world context for the component.
   * If null, it means the world has not been set yet.
   */
  get world() {
    return super.world;
  }

  /**
   * Sets the world for the CivilElevationNavigator.
   * This property is used to manage the world context for the component.
   * When the world is set, it triggers the addition of elevation markers to the scene.
   *
   * @param world - The world to set for the component. If null, it will not update the world.
   */
  set world(world: OBC.World | null) {
    if (this.world === world) return;
    super.world = world;

    if (!this._highlighter) {
      return;
    }

    // TODO: Can we substitute this by the .onHighlight event?
    //  That way we can put this in the constructor
    this._highlighter.onSelect.add((mesh) => {
      if (!this.world) {
        throw new Error("A world is needed to work with this component!");
      }

      // Add markers elevation

      const civilMarker = this.components.get(CivilMarker);

      civilMarker.deleteByType(["Slope", "Height", "InitialKPV", "FinalKPV"]);

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

        civilMarker.addVerticalMarker(
          this.world,
          `S: ${slope[i].slope}%`,
          align.mesh,
          "Slope",
          scene,
        );

        civilMarker.addVerticalMarker(
          this.world,
          `H: ${defSegments[i].end.y.toFixed(2)}`,
          align.mesh,
          "Height",
          scene,
        );
      }

      civilMarker.addVerticalMarker(
        this.world,
        "KP: 0",
        alignment.vertical[0].mesh,
        "InitialKPV",
        scene,
      );

      civilMarker.addVerticalMarker(
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
