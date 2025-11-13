import { BCFTopics, BCFVersion } from "../index";
import {
  BooleanSettingsControl,
  Configurator,
  SelectSettingControl,
  TextSetSettingControl,
  TextSettingsControl,
} from "../../../core";

/**
 * Configuration settings for managing BCF topics. This interface defines the properties and their meanings used to control the behavior of exporting and importing BCF topics.
 */
export interface BCFTopicsConfig {
  /**
   * The BCF version used during export.
   */
  version: BCFVersion;

  /**
   * The email of the user creating topics using this component.
   */
  author: string;

  /**
   * The set of allowed topic types. This is exported inside the
   * [bcf.extensions](https://github.com/buildingSMART/BCF-XML/tree/release_3_0/Documentation#bcf-file-structure).
   */
  types: Set<string>;

  /**
   * The set of allowed topic statuses. This is exported inside the
   * [bcf.extensions](https://github.com/buildingSMART/BCF-XML/tree/release_3_0/Documentation#bcf-file-structure).
   */
  statuses: Set<string>;

  /**
   * The set of allowed topic priorities. This is exported inside the
   * [bcf.extensions](https://github.com/buildingSMART/BCF-XML/tree/release_3_0/Documentation#bcf-file-structure).
   */
  priorities: Set<string>;

  /**
   * The set of allowed topic labels. This is exported inside the
   * [bcf.extensions](https://github.com/buildingSMART/BCF-XML/tree/release_3_0/Documentation#bcf-file-structure).
   */
  labels: Set<string>;

  /**
   * The set of allowed topic stages. This is exported inside the
   * [bcf.extensions](https://github.com/buildingSMART/BCF-XML/tree/release_3_0/Documentation#bcf-file-structure).
   */
  stages: Set<string>;

  /**
   * The set of allowed topic users. This is exported inside the
   * [bcf.extensions](https://github.com/buildingSMART/BCF-XML/tree/release_3_0/Documentation#bcf-file-structure).
   */
  users: Set<string>;

  /**
   * Whether or not to include the AuthoringSoftwareId in the viewpoint components during export.
   */
  includeSelectionTag: boolean;

  /**
   * Updates the types, statuses, users, etc., after importing an external BCF.
   */
  updateExtensionsOnImport: boolean;

  /**
   * Only allow to use the extensions (types, statuses, etc.) defined in the config when setting the corresponding data in a topic.
   */
  strict: boolean;

  /**
   * If true, export the extensions (types, status, etc.) based on topics data. This doesn't update the extensions in the config.
   * If false, only export the extensions defined in each collection of possibilities set in the config.
   * In all cases, all the values from each collection of extensions defined in the config are going to be exported.
   */
  includeAllExtensionsOnExport: boolean;

  /**
   * Version to be used when importing if no bcf.version file is present in the incoming data.
   * When null, the importer will throw an error if the version is missing or is not supported.
   */
  fallbackVersionOnImport: BCFVersion | null;

  /**
   * If true, do not import a topic with missing information (guid, type, status, title, creationDate or creationAuthor).
   * If false, use default values for missing data.
   */
  ignoreIncompleteTopicsOnImport: boolean;

  exportCustomDataAsLabels: boolean;
}

type BCFTopicsConfigType = {
  version: SelectSettingControl;
  author: TextSettingsControl;
  types: TextSetSettingControl;
  statuses: TextSetSettingControl;
  priorities: TextSetSettingControl;
  labels: TextSetSettingControl;
  stages: TextSetSettingControl;
  users: TextSetSettingControl;
  includeSelectionTag: BooleanSettingsControl;
  updateExtensionsOnImport: BooleanSettingsControl;
  strict: BooleanSettingsControl;
  includeAllExtensionsOnExport: BooleanSettingsControl;
  fallbackVersionOnImport: SelectSettingControl;
  ignoreIncompleteTopicsOnImport: BooleanSettingsControl;
  exportCustomDataAsLabels: BooleanSettingsControl;
};

export class BCFTopicsConfigManager extends Configurator<
  BCFTopics,
  BCFTopicsConfigType
> {
  protected _config: BCFTopicsConfigType = {
    version: {
      type: "Select" as const,
      options: new Set<string>(["2.1", "3"]),
      multiple: false,
      value: "",
    },
    author: {
      type: "Text" as const,
      value: "",
    },
    types: {
      type: "TextSet" as const,
      value: new Set<string>(),
    },
    statuses: {
      type: "TextSet" as const,
      value: new Set<string>(),
    },
    priorities: {
      type: "TextSet" as const,
      value: new Set<string>(),
    },
    labels: {
      type: "TextSet" as const,
      value: new Set<string>(),
    },
    stages: {
      type: "TextSet" as const,
      value: new Set<string>(),
    },
    users: {
      type: "TextSet" as const,
      value: new Set<string>(),
    },
    includeSelectionTag: {
      type: "Boolean" as const,
      value: false,
    },
    updateExtensionsOnImport: {
      type: "Boolean" as const,
      value: false,
    },
    strict: {
      type: "Boolean" as const,
      value: false,
    },
    includeAllExtensionsOnExport: {
      type: "Boolean" as const,
      value: false,
    },
    fallbackVersionOnImport: {
      type: "Select" as const,
      multiple: false,
      options: new Set<string>(["2.1", "3"]),
      value: "",
    },
    ignoreIncompleteTopicsOnImport: {
      type: "Boolean" as const,
      value: false,
    },
    exportCustomDataAsLabels: {
      type: "Boolean" as const,
      value: false,
    },
  };

  get version() {
    return this._config.version.value;
  }
  set version(value) {
    this._config.version.value = value;
  }

  get author() {
    return this._config.author.value;
  }

  set author(value) {
    this._config.author.value = value;
  }

  get types() {
    return this._config.types.value;
  }

  set types(value) {
    this._config.types.value = value;
  }

  get statuses() {
    return this._config.statuses.value;
  }

  set statuses(value) {
    this._config.statuses.value = value;
  }

  get priorities() {
    return this._config.priorities.value;
  }

  set priorities(value) {
    this._config.priorities.value = value;
  }

  get labels() {
    return this._config.labels.value;
  }

  set labels(value) {
    this._config.labels.value = value;
  }

  get stages() {
    return this._config.stages.value;
  }

  set stages(value) {
    this._config.stages.value = value;
  }

  get users() {
    return this._config.users.value;
  }

  set users(value) {
    this._config.users.value = value;
  }

  get includeSelectionTag() {
    return this._config.includeSelectionTag.value;
  }

  set includeSelectionTag(value) {
    this._config.includeSelectionTag.value = value;
  }

  get updateExtensionsOnImport() {
    return this._config.updateExtensionsOnImport.value;
  }

  set updateExtensionsOnImport(value) {
    this._config.updateExtensionsOnImport.value = value;
  }

  get strict() {
    return this._config.strict.value;
  }

  set strict(value) {
    this._config.strict.value = value;
  }

  get includeAllExtensionsOnExport() {
    return this._config.includeAllExtensionsOnExport.value;
  }

  set includeAllExtensionsOnExport(value) {
    this._config.includeAllExtensionsOnExport.value = value;
  }

  get fallbackVersionOnImport() {
    return this._config.fallbackVersionOnImport.value;
  }

  set fallbackVersionOnImport(value) {
    this._config.fallbackVersionOnImport.value = value;
  }

  get ignoreIncompleteTopicsOnImport() {
    return this._config.ignoreIncompleteTopicsOnImport.value;
  }

  set ignoreIncompleteTopicsOnImport(value) {
    this._config.ignoreIncompleteTopicsOnImport.value = value;
  }

  get exportCustomDataAsLabels() {
    return this._config.exportCustomDataAsLabels.value;
  }

  set exportCustomDataAsLabels(value) {
    this._config.exportCustomDataAsLabels.value = value;
  }
}
