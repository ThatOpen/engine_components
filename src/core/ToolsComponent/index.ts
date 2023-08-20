import * as THREE from "three";
import * as OBC from "../../index";
import { Component, Disposable, Event } from "../../base-types";

type ToolsList = Map<symbol | string, Component<any>>;

/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export class ToolComponent
  extends Component<ToolsList | Component<any> | null>
  implements Disposable
{
  list: ToolsList = new Map();
  onToolAdded: Event<Component<any>> = new Event();
  onToolRemoved: Event<null> = new Event();

  /** {@link Component.name} */
  name = "ToolComponent";

  /** {@link Component.enabled} */
  enabled = true;

  private _urls = {
    base: "https://2fomw59q4h.execute-api.eu-central-1.amazonaws.com/v1/tools/",
    path: "/contents/index.js?accessToken=",
  };

  /**
   * Registers a new tool component in the application instance.
   * @param id - Unique ID to register the tool in the application.
   * @param tool - The tool to register.
   */
  add(id: symbol | string, tool: Component<any>) {
    const existingTool = this.list.get(id);
    if (existingTool) {
      console.warn(`A tool with the id: ${String(id)} already exists`);
      return;
    }
    this.list.set(id, tool);
  }

  /**
   * Deletes a previously registered tool component.
   * @param id - The registered ID of the tool to be delete.
   */
  remove(id: symbol | string) {
    this.list.delete(id);
    this.onToolRemoved.trigger();
  }

  /**
   * Retrieves a tool component by its registered id.
   * @param id - The id of the registered tool.
   */
  get<T extends Component<any>>(id: symbol | string): T {
    if (!this.list.has(id)) {
      throw new Error("The requested component does not exist!");
    }
    return this.list.get(id) as T;
  }

  /**
   * Gets one of your tools of That Open Platform. You can pass the type of
   * component as the generic parameter T to get the types and intellisense
   * for the component.
   * @param token The authentication token to authorise this request.
   * @param id The ID of the tool you want to get
   */
  async use<T>(token: string, id: string) {
    const { base, path } = this._urls;
    const url = base + id + path + token;

    const fetched = await fetch(url);
    const code = await fetched.text();
    const script = document.createElement("script");
    script.textContent = code;
    document.body.appendChild(script);

    const win = window as any;
    const toolClass = win.ThatOpenTool(OBC, THREE) as new (...args: any) => T;

    win.ThatOpenTool = undefined;
    script.remove();

    return toolClass;
  }

  /**
   * Updates all the registered tool components. Only the components where the
   * property {@link Component.enabled} is true will be updated.
   * @param delta - The
   * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
   */
  update(delta: number) {
    const tools = this.list.values();
    for (const tool of tools) {
      if (tool.enabled && tool.isUpdateable()) {
        tool.update(delta);
      }
    }
  }

  /**
   * Disposes all the memory used by all the tools.
   */
  dispose() {
    this.onToolAdded.reset();
    this.onToolRemoved.reset();
    const tools = this.list.values();
    for (const tool of tools) {
      tool.enabled = false;
      if (tool.isDisposeable()) {
        tool.dispose();
      }
    }
  }
}
