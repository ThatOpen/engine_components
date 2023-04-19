import { Component, Disposable, Event } from "../../base-types";

import { urls } from "./platform";

/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export class ToolComponent implements Disposable {
  tools: Component<any>[] = [];
  onToolAdded: Event<Component<any>> = new Event()
  onToolRemoved: Event<Component<any>> = new Event()

  /**
   * Registers a new tool component.
   * @param tool - The tool to register in the application.
   */
  add(...tool: Component<any>[]) {
    tool.forEach( t => {
      this.tools.push(t);
      this.onToolAdded.trigger(t);
    } );
  }

  /**
   * Deletes a previously registered tool component.
   * @param tool - The tool to delete.
   */
  remove(tool: Component<any>) {
    const index = this.tools.findIndex((c) => c === tool);
    if (index > -1) {
      this.tools.splice(index, 1);
      this.onToolRemoved.trigger(tool);
      return true;
    }
    return false;
  }

  /**
   * Retrieves a tool component by its name.
   * @param name - The {@link Component.name} of the component..
   */
  get(name: string) {
    return this.tools.find((tool) => tool.name === name);
  }

  /**
   * Gets one of your tools of That Open Platform. You can pass the type of
   * component as the generic parameter T to get the types and intellisense
   * for the component.
   * @param token The authentication token to authorise this request.
   * @param id The ID of the tool you want to get
   */
  async use<T>(token: string, id: string) {
    const { base, path } = urls;
    const url = base + id + path + token;
    const imported = await import(url);
    return imported.get() as new (...args: any) => T;
  }

  /**
   * Updates all the registered tool components. Only the components where the
   * property {@link Component.enabled} is true will be updated.
   * @param delta - The
   * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
   */
  update(delta: number) {
    for (const tool of this.tools) {
      if (tool.enabled && tool.isUpdateable()) {
        tool.update(delta);
      }
    }
  }

  /**
   * Disposes all the memory used by all the tools.
   */
  dispose() {
    for (const tool of this.tools) {
      tool.enabled = false;
      if (tool.isDisposeable()) {
        tool.dispose();
      }
    }
    this.tools = [];
  }
}
