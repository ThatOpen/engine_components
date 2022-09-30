import { Component } from "./base-components";

/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export class ToolComponents {
  readonly tools: Component<any>[] = [];

  /**
   * Registers a new tool component.
   * @param tool - The tool to register in the application.
   */
  add(tool: Component<any>) {
    this.tools.push(tool);
  }

  /**
   * Deletes a previously registered tool component.
   * @param tool - The tool to delete.
   */
  remove(tool: Component<any>) {
    const index = this.tools.findIndex((c) => c === tool);
    if (index > -1) {
      this.tools.splice(index, 1);
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
   * Sets the {@link Component.enabled} property of one or multiple components.
   * @param enabled - Whether to enable or disable the components.
   * @param name - The {@link Component.name} of the tool to enable or disable.
   * If undefined, all components will be enabled or disabled.
   */
  setEnabled(enabled: boolean, name?: string) {
    if (name) {
      const tool = this.get(name);
      if (tool) {
        tool.enabled = enabled;
      }
      return;
    }
    for (const tool of this.tools) {
      tool.enabled = enabled;
    }
  }

  /**
   * Shows or hides one or multiple components.
   * @param visible - Whether to show or hide the tool components.
   * @param name - The {@link Component.name} of the tool to show or hide.
   * If undefined, all components will be enabled or disabled.
   */
  setVisible(visible: boolean, name?: string) {
    if (name) {
      const tool = this.get(name);
      if (tool && tool.isHideable()) {
        tool.visible = visible;
      }
      return;
    }
    for (const tool of this.tools) {
      if (tool.isHideable()) {
        tool.visible = visible;
      }
    }
  }
}
