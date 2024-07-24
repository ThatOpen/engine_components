import { Event } from "./event";

export class DataSet<T> extends Set<T> {
  readonly onItemAdded = new Event<T>();
  readonly onItemDeleted = new Event();
  readonly onCleared = new Event();

  constructor(iterable?: Iterable<T> | null) {
    super(iterable);
  }

  clear() {
    super.clear();
    this.onCleared.trigger();
  }

  add(value: T) {
    const existing = this.has(value);
    if (existing) return this;
    const result = super.add(value);
    if (!this.onItemAdded) (this.onItemAdded as any) = new Event<T>();
    this.onItemAdded.trigger(value);
    return result;
  }

  delete(value: T) {
    const deleted = super.delete(value);
    if (deleted) this.onItemDeleted.trigger();
    return deleted;
  }

  dispose() {
    this.clear();
    this.onItemAdded.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
