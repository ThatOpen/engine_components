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
 * A highlight style: the material definition used to color the items that
 * claim it, plus an optional draw priority. `null` means the style selects
 * items without coloring them.
 */
export type HighlightStyle =
  | (Omit<FRAGS.MaterialDefinition, "customId"> & {
      /**
       * Decides which style colors an item when several styles claim it: the
       * highest priority wins, and the others color the item again as soon as
       * the winner releases it. Defaults to 0. The select style defaults to the
       * highest priority, so a selection always shows on top. Ties are broken by
       * registration order, most recently registered first.
       */
      priority?: number;
    })
  | null;

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
