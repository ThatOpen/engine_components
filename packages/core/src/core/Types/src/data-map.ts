import { Event } from "./event";

export class DataMap<K, V> extends Map<K, V> {
  readonly onItemSet = new Event<{ key: K; value: V }>();
  readonly onItemUpdated = new Event<{ key: K; value: V }>();
  readonly onItemDeleted = new Event();
  readonly onCleared = new Event();

  constructor(iterable?: Iterable<readonly [K, V]> | null | undefined) {
    super(iterable);
  }

  clear() {
    super.clear();
    this.onCleared.trigger();
  }

  set(key: K, value: V) {
    const triggerUpdate = this.has(key);
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

  delete(key: K) {
    const deleted = super.delete(key);
    if (deleted) this.onItemDeleted.trigger();
    return deleted;
  }

  dispose() {
    this.clear();
    this.onItemSet.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
