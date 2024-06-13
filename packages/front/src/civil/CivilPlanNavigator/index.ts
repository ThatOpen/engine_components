import * as OBC from "@thatopen/components";
import { CivilNavigator } from "../CivilNavigator";
import { PlanHighlighter } from "./src/plan-highlighter";

/**
 * This component is responsible for navigating and visualizing plan data of infra/civil models (horizontal alignments). 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/CivilPlanNavigator). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/CivilPlanNavigator).
 */
export class CivilPlanNavigator extends CivilNavigator {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "3096dea0-5bc2-41c7-abce-9089b6c9431b" as const;

  /**
   * The view mode of the component.
   * In this case, the view mode is set to "horizontal".
   */
  readonly view = "horizontal";

  private planHighlighter?: PlanHighlighter;

  /**
   * Getter for the world property.
   * Returns the world associated with the CivilPlanNavigator instance.
   */
  get world() {
    return super.world;
  }

  /**
   * Setter for the world property.
   * Sets the world associated with the CivilPlanNavigator instance.
   * If a new world is provided, the existing PlanHighlighter instance is disposed and a new one is created.
   * @param world - The new world to be associated with the CivilPlanNavigator instance.
   */
  set world(world: OBC.World | null) {
    super.world = world;
    if (!world) return;
    this.planHighlighter?.dispose();
    this.planHighlighter = new PlanHighlighter(
      this.components,
      world.scene.three,
      world,
    );
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilPlanNavigator.uuid, this);

    this.onHighlight.add(({ mesh }) => {
      if (!this._highlighter || !this.planHighlighter) {
        return;
      }
      this.planHighlighter.showCurveInfo(mesh);
      // this.fitCameraToAlignment(mesh);
    });
  }
}
