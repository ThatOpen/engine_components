
import {
  Components,
  ToolComponent,
} from "../../core";
import { Component, Disposable, UIElement } from "../../base-types";

export class RoadNavigator extends Component<any> {
  /** {@link Component.uuid} */
  static readonly uuid = "85f2c89c-4c6b-4c7d-bc20-5b675874b228" as const;

  enabled = true;

  constructor(components: Components) {
    super(components);

    this.components.tools.add(RoadNavigator.uuid, this);

  }

  get() {
  }
}

ToolComponent.libraryUUIDs.add(RoadNavigator.uuid);
