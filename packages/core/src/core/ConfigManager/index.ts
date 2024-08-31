import { Component } from "../Types";
import { Components } from "../Components";
import { Configurator } from "./src";

export * from "./src";

/**
 * A tool to manage all the configuration from the app centrally.
 */
export class ConfigManager extends Component {
  list = new Set<Configurator<any, any>>();

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "dc86e7e9-a8fd-5473-9ef6-724c67fecb0f" as const;

  constructor(components: Components) {
    super(components);
    components.add(ConfigManager.uuid, this);
  }
}
