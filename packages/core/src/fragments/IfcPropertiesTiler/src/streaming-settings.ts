import { IfcFragmentSettings } from "../../IfcLoader/src";

/**
 * Settings for streaming properties. Extends {@link IfcFragmentSettings} to inherit common settings.
 */
export class PropertiesStreamingSettings extends IfcFragmentSettings {
  /**
   * Amount of properties to be streamed.
   * Defaults to 100 properties.
   */
  propertiesSize = 100;
}
