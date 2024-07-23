import { Event } from "./event";

export class DataMap<K, V> extends Map<K, V> {
  readonly onItemSet = new Event<{ key: K; value: V }>();
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
    const result = super.set(key, value);
    this.onItemSet.trigger({ key, value });
    return result;
  }

  delete(key: K) {
    const result = super.delete(key);
    this.onItemDeleted.trigger();
    return result;
  }

  dispose() {
    this.clear();
    this.onItemSet.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
