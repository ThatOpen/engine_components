import { BooleanSettingsControl } from "../../Types";
import { Viewpoints } from "../index";
import { Configurator } from "../../ConfigManager";

/**
 * Configuration interface for the Viewpoints general behavior.
 */
export interface ViewpointsConfig {
  /**
   * Indicates whether to overwrite the fragments colors when applying viewpoints.
   * @remarks BCF Viewpoints comes with information to indicate the colors to be applied to components, if any.
   * @default false
   */
  overwriteColors: boolean;
}

type ViewpointsConfigType = {
  overwriteColors: BooleanSettingsControl;
};

export class ViewpointsConfigManager extends Configurator<
  Viewpoints,
  ViewpointsConfigType
> {
  protected _config: ViewpointsConfigType = {
    overwriteColors: {
      value: false,
      type: "Boolean" as const,
    },
  };

  get overwriteColors() {
    return this._config.overwriteColors.value;
  }

  set overwriteColors(value: boolean) {
    this._config.overwriteColors.value = value;
  }
}
