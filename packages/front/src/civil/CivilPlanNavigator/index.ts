import * as OBC from "@thatopen/components";
import { CivilNavigator } from "../CivilNavigator";
import { PlanHighlighter } from "./src/plan-highlighter";

export class CivilPlanNavigator extends CivilNavigator {
  static readonly uuid = "3096dea0-5bc2-41c7-abce-9089b6c9431b" as const;

  readonly view = "horizontal";

  private planHighlighter?: PlanHighlighter;

  get world() {
    return super.world;
  }

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
