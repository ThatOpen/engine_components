import { isEnableable, isHideable, ToolComponent } from "./base-types";

export class ToolComponents {
  readonly tools: ToolComponent[] = [];

  add(tool: ToolComponent) {
    this.tools.push(tool);
  }

  remove(tool: ToolComponent) {
    const index = this.tools.findIndex((c) => c === tool);
    if (index > -1) {
      this.tools.splice(index, 1);
      return true;
    }
    return false;
  }

  removeByName(name: string) {
    const tool = this.get(name);
    if (tool) {
      this.remove(tool);
      return true;
    }
    return false;
  }

  update(delta: number) {
    for (const tool of this.tools) {
      tool.update(delta);
    }
  }

  hideAll() {
    for (const tool of this.tools) {
      if (tool && isHideable(tool)) {
        tool.visible = false;
      }
    }
  }

  showAll() {
    for (const tool of this.tools) {
      if (tool && isHideable(tool)) {
        tool.visible = true;
      }
    }
  }

  toggleAllVisibility() {
    for (const tool of this.tools) {
      if (tool && isHideable(tool)) {
        tool.visible = !tool.visible;
      }
    }
  }

  enable(name: string, isolate: boolean = true) {
    if (isolate === false) {
      this.disableAll();
    }

    const tool = this.get(name);
    if (tool && isEnableable(tool)) {
      tool.enabled = true;
      return true;
    }
    return false;
  }

  disable(name: string) {
    const tool = this.get(name);
    if (tool && isEnableable(tool)) {
      tool.enabled = false;
      return true;
    }
    return false;
  }

  disableAll() {
    for (const tool of this.tools) {
      if (tool && isEnableable(tool)) {
        console.log(`Disabling tool: ${tool.name}`);
        tool.enabled = false;
      }
    }
  }

  toggle(name: string) {
    const tool = this.get(name);
    if (tool && isEnableable(tool)) {
      const enabled = tool.enabled;
      this.disableAll();
      tool.enabled = !enabled;
    }
  }

  get(name: string) {
    return this.tools.find((tool) => tool.name === name);
  }

  printToolsState() {
    const states = this.tools.map((tool) => ({
      name: tool.name,
      // @ts-ignore
      enabled: tool?.enabled,
      // @ts-ignore
      visible: tool?.enabled,
    }));

    console.table(states);
  }
}
