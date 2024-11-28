import { Event } from "./event";

/**
 * A class that extends the built-in Set class and provides additional functionality. It triggers events when items are added, deleted, or the set is cleared.
 *
 * @template T - The type of elements in the set.
 */
export class DataSet<T> extends Set<T> {
  /**
   * An event that is triggered when a new item is added to the set.
   */
  readonly onItemAdded = new Event<T>();

  /**
   * An event that is triggered when an item is deleted from the set.
   */
  readonly onItemDeleted = new Event();

  /**
   * An event that is triggered when the set is cleared.
   */
  readonly onCleared = new Event();

  /**
   * Constructs a new instance of the DataSet class.
   *
   * @param iterable - An optional iterable object to initialize the set with.
   */
  constructor(iterable?: Iterable<T> | null) {
    super(iterable);
  }

  /**
   * Clears the set and triggers the onCleared event.
   */
  clear() {
    super.clear();
    this.onCleared.trigger();
  }

  /**
   * Adds one or multiple values to the set and triggers the onItemAdded event per each.
   *
   * @param value - The value to add to the set.
   * @returns - The set instance.
   */
  add(...value: T[]) {
    for (const item of value) {
      const existing = this.has(item);
      if (existing) continue;
      const isValid = this.guard(item);
      if (!isValid) continue;
      super.add(item);
      if (!this.onItemAdded) (this.onItemAdded as any) = new Event<T>();
      this.onItemAdded.trigger(item);
    }
    return this;
  }

  /**
   * A function that acts as a guard for adding items to the set.
   * It determines whether a given value should be allowed to be added to the set.
   *
   * @param value - The value to be checked against the guard.
   * @returns A boolean indicating whether the value should be allowed to be added to the set.
   *          By default, this function always returns true, allowing all values to be added.
   *          You can override this behavior by providing a custom implementation.
   */
  guard: (value: T) => boolean = () => true;

  /**
   * Deletes a value from the set and triggers the onItemDeleted event.
   *
   * @param value - The value to delete from the set.
   * @returns - True if the value was successfully deleted, false otherwise.
   */
  delete(value: T) {
    const deleted = super.delete(value);
    if (deleted) this.onItemDeleted.trigger();
    return deleted;
  }

  /**
   * Clears the set and resets the onItemAdded, onItemDeleted, and onCleared events.
   */
  dispose() {
    this.clear();
    this.onItemAdded.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
