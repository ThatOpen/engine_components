import * as FRAGS from "@thatopen/fragments";

/**
 * Mapping of model identifiers to a collection of numbers representing localIds.
 */
export type ModelIdMap = Record<string, Set<number>>;

export type ModelIdDataMap<T> = FRAGS.DataMap<string, FRAGS.DataMap<number, T>>;
