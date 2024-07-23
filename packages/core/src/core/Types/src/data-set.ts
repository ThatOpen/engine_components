import { Event } from "./event";

export class DataSet<T> extends Set<T> {
  readonly onItemAdded = new Event<T>();
  readonly onItemDeleted = new Event();
  readonly onCleared = new Event();

  constructor() {
    super();
  }

  clear() {
    super.clear();
    this.onCleared.trigger();
  }

  add(value: T) {
    const result = super.add(value);
    this.onItemAdded.trigger(value);
    return result;
  }

  delete(value: T) {
    const result = super.delete(value);
    this.onItemDeleted.trigger();
    return result;
  }

  dispose() {
    this.clear();
    this.onItemAdded.reset();
    this.onItemDeleted.reset();
    this.onCleared.reset();
  }
}
