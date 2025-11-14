import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";

/**
 * Interface defining the events that the Highlighter class can trigger. Each highlighter has its own set of events, identified by the highlighter name.
 */
export interface HighlightEvents {
  [highlighterName: string]: {
    /** Event triggered before a fragment is highlighted, giving the last selection. */
    onBeforeHighlight: OBC.Event<OBC.ModelIdMap>;
    /** Event triggered when a fragment is highlighted. */
    onHighlight: OBC.Event<OBC.ModelIdMap>;
    /** Event triggered when a fragment is cleared. */
    onClear: OBC.Event<OBC.ModelIdMap>;
  };
}

/**
 * Interface defining the configuration options for the Highlighter class.
 */
export interface HighlighterConfig {
  /** Name of the selection event. */
  selectName: string;
  /** Toggles the select functionality. */
  selectEnabled: boolean;
  /**
   * Color used for selection.
   * @deprecated use selectMaterialDefinition instead
   * */
  selectionColor: THREE.Color | null;
  /** Whether to automatically highlight fragments on click. */
  autoHighlightOnClick: boolean;
  /** The world in which the highlighter operates. */
  world: OBC.World | null;
  selectMaterialDefinition: Omit<FRAGS.MaterialDefinition, "customId"> | null;
  /** Whether to automatically update fragments when highlighting. */
  autoUpdateFragments: boolean;
}
