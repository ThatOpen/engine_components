import { Component, Disposable, Updateable, World, Event } from "../Types";

export class Worlds extends Component implements Updateable, Disposable {
  static readonly uuid = "fdb61dc4-2ec1-4966-b83d-54ea795fad4a" as const;

  readonly onAfterUpdate = new Event();

  readonly onBeforeUpdate = new Event();

  readonly onDisposed = new Event();

  list = new Map<string, World>();

  enabled = true;

  dispose() {
    this.enabled = false;
    for (const [_id, world] of this.list) {
      world.dispose();
    }
    this.onDisposed.trigger();
  }

  update(delta?: number): void | Promise<void> {
    if (!this.enabled) return;
    for (const [_id, world] of this.list) {
      world.update(delta);
    }
  }
}
