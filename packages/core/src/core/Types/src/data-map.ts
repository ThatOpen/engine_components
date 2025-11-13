import { UUID } from "../../../utils";
import { Event } from "./event";

/**
 * A class that extends the built-in Map class and provides additional events for item set, update, delete, and clear operations.
 *
 * @template K - The type of keys in the map.
 * @template V - The type of values in the map.
 */
export class DataMap<K, V> extends Map<K, V> {
  /**
   * An event triggered when a new item is set in the map.
   */
  readonly onItemSet = new Event<{ key: K; value: V }>();

  /**
   * An event triggered when an existing item in the map is updated.
   */
  readonly onItemUpdated = new Event<{ key: K; value: V }>();

  /**
   * An event triggered when an item is deleted from the map.
   */
  readonly onItemDeleted = new Event<K>();

  /**
   * An event triggered when the map is cleared.
   */
  readonly onCleared = new Event();

  /**
   * Constructs a new DataMap instance.
   *
   * @param iterable - An iterable object containing key-value pairs to populate the map.
   */
  constructor(iterable?: Iterable<readonly [K, V]> | null | undefined) {
    super(iterable);
  }

  /**
   * Clears the map and triggers the onCleared event.
   */
  clear() {
    super.clear();
    this.onCleared.trigger();
  }

  /**
   * Sets the value for the specified key in the map.
   * If the item is new, then onItemSet is triggered.
   * If the item is already in the map, then onItemUpdated is triggered.
   *
   * @param key - The key of the item to set.
   * @param value - The value of the item to set.
   * @returns The DataMap instance.
   */
  set(key: K, value: V) {
    const triggerUpdate = this.has(key);
    const guard = this.guard ?? (() => true);
    const isValid = guard(key, value);
    if (!isValid) return this;
    const result = super.set(key, value);
    if (triggerUpdate) {
      if (!this.onItemUpdated) {
        (this.onItemUpdated as any) = new Event<{ key: K; value: V }>();
      }
      this.onItemUpdated.trigger({ key, value });
    } else {
      if (!this.onItemSet) {
        (this.onItemSet as any) = new Event<{ key: K; value: V }>();
      }
      this.onItemSet.trigger({ key, value });
    }
    return result;
  }

  /**
   * Sets the value in the map with a randomly generated uuidv4 key.
   * Only use this if your keys are strings
   *
   * @param value - The value of the item to set.
   * @returns The key used.
   */
  add(value: V) {
    const key = UUID.create() as K;
    this.set(key, value);
    return key;
  }

  /**
   * A function that acts as a guard for adding items to the set.
   * It determines whether a given value should be allowed to be added to the set.
   *
   * @param key - The key of the entry to be checked against the guard.
   * @param value - The value of the entry to be checked against the guard.
   * @returns A boolean indicating whether the value should be allowed to be added to the set.
   *          By default, this function always returns true, allowing all values to be added.
   *          You can override this behavior by providing a custom implementation.
   */
  guard: (key: K, value: V) => boolean = () => true;

  /**
   * Deletes the specified key from the map and triggers the onItemDeleted event if the key was found.
   *
   * @param key - The key of the item to delete.
   * @returns True if the key was found and deleted; otherwise, false.
   */
  delete(key: K) {
    const deleted = super.delete(key);
    if (deleted) this.onItemDeleted.trigger(key);
    return deleted;
  }

  /**
   * Clears the map and resets the events.
   */
  dispose() {
    this.clear();
    this.onItemSet.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
