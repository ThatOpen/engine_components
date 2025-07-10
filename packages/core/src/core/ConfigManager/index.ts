import { Component, DataMap } from "../Types";
import { Components } from "../Components";
import { Configurator } from "./src";

export * from "./src";

/**
 * A tool to manage all the configuration from the app centrally. 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/ConfigManager).
 */
export class ConfigManager extends Component {
  /**
   * The list of all configurations of this app.
   */
  list = new DataMap<string, Configurator<any, any>>();

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "b8c764e0-6b24-4e77-9a32-35fa728ee5b4" as const;

  constructor(components: Components) {
    super(components);
    components.add(ConfigManager.uuid, this);
  }
}
