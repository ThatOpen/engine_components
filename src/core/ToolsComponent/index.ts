import * as THREE from "three";
import ToolBufferReader from "top-tool-package-reader";
import { Component, Disposable } from "../../base-types";
import { Components } from "../Components";

/** A list of tools sorted by their UUID. */
type ToolsList = Map<string, Component<any>>;

/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export class ToolComponent
  extends Component<Promise<Component<any>>>
  implements Disposable
{
  /** The list of components created in this app. */
  list: ToolsList = new Map();

  /** The list of UUIDs of all the components in this library. */
  static readonly libraryUUIDs = new Set();

  /** The auth token to get tools from That Open Platform. */
  token = "";

  /** {@link Component.uuid} */
  uuid = "ToolComponent";

  /** {@link Component.enabled} */
  enabled = true;

  private _reader = new ToolBufferReader();

  private _urls = {
    base: "https://api.platform.thatopen.com/v1/tools/",
    baseDev: "https://dev.api.dev.platform.thatopen.com/v1/tools/",
    path: "/download?accessToken=",
  };

  private _OBC: any;

  /** Pass the whole library object as argument.
   * @param ORB: `import * as OBC from "openbim-components"`.
   */
  init(OBC: any) {
    this._OBC = OBC;
  }

  /**
   * Adds a new tool. Use this in the constructor of your tools.
   *
   * @param uuid The UUID of your tool.
   * @param instance The instance of your tool (`this` inside the constructor).
   */
  add(uuid: string, instance: Component<any>) {
    if (!this.list.has(uuid)) {
      this.list.set(uuid, instance);
    }
  }

  /**
   * Retrieves a tool component. If it already exists in this app, it returns the instance of the component. If it
   * doesn't exist, it will instance it automatically.
   *
   * @param ToolClass - The component to get or create.
   */
  async get<T, U extends Component<T>>(
    ToolClass: new (components: Components) => U
  ): Promise<U> {
    const id = (ToolClass as any).uuid;
    if (!this.list.has(id)) {
      const isLibraryComponent = ToolComponent.libraryUUIDs.has(id);
      if (isLibraryComponent) {
        const newLibraryComponent = new ToolClass(this.components);
        this.list.set(id, newLibraryComponent);
        return newLibraryComponent;
      }
      return this.getPlatformComponent(id);
    }
    return this.list.get(id) as U;
  }

  /**
   * Updates all the registered tool components. Only the components where the
   * property {@link Component.enabled} is true will be updated.
   * @param delta - The
   * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
   */
  async update(delta: number) {
    const tools = this.list.values();
    for (const tool of tools) {
      if (tool.enabled && tool.isUpdateable()) {
        await tool.update(delta);
      }
    }
  }

  /**
   * Disposes all the MEMORY used by all the tools.
   */
  async dispose() {
    const tools = this.list.values();
    for (const tool of tools) {
      tool.enabled = false;
      if (tool.isDisposeable()) {
        await tool.dispose();
      }
    }
  }

  async getPlatformComponent<T, U extends Component<T>>(
    id: string
  ): Promise<U> {
    if (!this._OBC) {
      console.log("Tools component not initialized! Call the init method.");
    }
    const { base, baseDev, path } = this._urls;
    const currentUrl = window.location.href;
    const devPattern = /(https:\/\/qa.)|(localhost)/;
    const isDev = currentUrl.match(devPattern);
    const baseUrl = isDev ? baseDev : base;
    const url = baseUrl + id + path + this.token;

    const fetched = await fetch(url);
    const rawBuffer = await fetched.arrayBuffer();
    const buffer = new Uint8Array(rawBuffer);
    const code = this._reader.read(buffer);
    const script = document.createElement("script");
    script.textContent = code.js;
    document.body.appendChild(script);

    const win = window as any;
    if (!win.ThatOpenTool) {
      throw new Error(`There was a problem fetching the tool ${id}.`);
    }

    const ToolClass = win.ThatOpenTool(this._OBC, THREE) as any;
    win.ThatOpenTool = undefined;

    script.remove();

    return new ToolClass(this.components);
  }
}
