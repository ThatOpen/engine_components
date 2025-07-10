import { World } from "../../Types";

/**
 * Configuration options for creating views from a plane.
 */
export interface CreateViewConfig {
  /**
   * Optional identifier for the view. If not provided, a random ID will be generated.
   */
  id?: string;

  /**
   * Optional world instance to use when creating the view. If not set, the component's default world will be used.
   */
  world?: World;
}

/**
 * Configuration options for creating a view from IFC storeys.
 */
export interface CreateViewFromIfcStoreysConfig {
  /**
   * An optional array of regular expressions to match model IDs. If not provided, all models will be used.
   */
  modelIds?: RegExp[];

  /**
   * An optional array of regular expressions to match storey names. If not provided, all storeys will be used.
   */
  storeyNames?: RegExp[];

  /**
   * An optional offset value to displace the storey plane upward. Defaults to `0.25`.
   */
  offset?: number;

  /**
   * Optional world instance to use when creating the view. If not set, the component's default world will be used.
   */
  world?: World;
}

/**
 * Configuration options for creating views from bounding boxes.
 */
export interface CreateElevationViewsConfig {
  /**
   * Determines whether to combine all models into a single bounding box. If `true`, a single bounding box will be created from all models. If `false`, each model will be treated separately. Defaults to `false`.
   */
  combine?: boolean;

  /**
   * An optional array of regular expressions to match model IDs. If not provided, all models will be used.
   */
  modelIds?: RegExp[];

  /**
   * Optional world instance to use when creating the view. If not set, the component's default world will be used.
   */
  world?: World;

  /**
   * A callback function to generate names for the views based on the model ID. Defaults to a function that generates names in the format: `<modelId>: Front`, `<modelId>: Back`, `<modelId>: Left`, `<modelId>: Right`.
   */
  namingCallback?: (modelId: string) => {
    front: string;
    back: string;
    left: string;
    right: string;
  };
}
