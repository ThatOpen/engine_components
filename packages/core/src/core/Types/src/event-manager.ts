import { Event } from "./event";
import { AsyncEvent } from "./async-event";

/**
 * Simple class to easily toggle and reset event lists.
 */
export class EventManager {
  /**
   * The list of events managed by this instance.
   */
  list = new Set<Event<any> | AsyncEvent<any>>();

  /**
   * Adds events to this manager.
   * @param events the events to add.
   */
  add(events: Iterable<Event<any> | AsyncEvent<any>>) {
    for (const event of events) {
      this.list.add(event);
    }
  }
  /**
   * Removes events from this manager.
   * @param events the events to remove.
   */
  remove(events: Iterable<Event<any> | AsyncEvent<any>>) {
    for (const event of events) {
      this.list.delete(event);
    }
  }

  /**
   * Sets all the events managed by this instance as enabled or disabled.
   * @param active whether to turn on or off the events.
   */
  set(active: boolean) {
    for (const event of this.list) {
      event.enabled = active;
    }
  }

  /**
   * Resets all the events managed by this instance.
   */
  reset() {
    for (const event of this.list) {
      event.reset();
    }
  }
}
