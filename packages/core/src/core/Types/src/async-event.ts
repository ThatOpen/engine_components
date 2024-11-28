/**
 * Simple event handler by [Jason Kleban](https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540). Keep in mind that if you want to remove it later, you might want to declare the callback as an object. If you want to maintain the reference to `this`, you will need to declare the callback as an arrow function.
 */
export class AsyncEvent<T> {
  /**
   * Whether this event is active or not. If not, it won't trigger.
   */
  enabled = true;

  /**
   * Add a callback to this event instance.
   * @param handler - the callback to be added to this event.
   */
  add(
    handler: T extends void
      ? { (): Promise<void> }
      : { (data: T): Promise<void> },
  ): void {
    this.handlers.push(handler);
  }

  /**
   * Removes a callback from this event instance.
   * @param handler - the callback to be removed from this event.
   */
  remove(
    handler: T extends void
      ? { (): Promise<void> }
      : { (data: T): Promise<void> },
  ): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  /** Triggers all the callbacks assigned to this event. */
  trigger = async (data?: T) => {
    if (!this.enabled) {
      return;
    }
    const handlers = this.handlers.slice(0);
    for (const handler of handlers) {
      await handler(data as any);
    }
  };

  /** Gets rid of all the suscribed events. */
  reset() {
    this.handlers.length = 0;
  }

  private handlers: (T extends void
    ? { (): Promise<void> }
    : { (data: T): Promise<void> })[] = [];
}
