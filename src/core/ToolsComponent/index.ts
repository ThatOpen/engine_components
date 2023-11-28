import * as THREE from "three";
import ToolBufferReader from "top-tool-package-reader";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";

/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export class ToolComponent
  extends Component<Component<any>>
  implements Disposable
{
  /** The list of components created in this app. */
  list: Record<string, Component<any>> = {};

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

  readonly onToolAdded = new Event<Component<any>>();

  /**
   * Adds a new tool. Use this in the constructor of your tools.
   *
   * @param uuid The UUID of your tool.
   * @param instance The instance of your tool (`this` inside the constructor).
   */
  add(uuid: string, instance: Component<any>) {
    if (uuid in this.list)
      throw new Error(
        `You're trying to add a tool that already exists in the components intance. Use ToolsComponent.get() instead.`
      );
    this.validateUUID(uuid);
    this.list[uuid] = instance;
    this.onToolAdded.trigger(instance);
  }

  /**
   * Retrieves a tool component. If it already exists in this app, it returns the instance of the component. If it
   * doesn't exist, it will instance it automatically.
   *
   * @param ToolClass - The component to get or create.
   */
  get<T, U extends Component<T>>(
    ToolClass: new (components: Components) => U
  ): U {
    const uuid = (ToolClass as any).uuid;
    if (!(uuid in this.list)) {
      const toolInstance = new ToolClass(this.components);
      // If true, means the tool is not autoregistered.
      if (!(uuid in this.list)) {
        this.add(uuid, toolInstance);
      }
      return toolInstance;
    }
    return this.list[uuid] as U;
  }

  /**
   * Updates all the registered tool components. Only the components where the
   * property {@link Component.enabled} is true will be updated.
   * @param delta - The
   * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
   */
  async update(delta: number) {
    for (const uuid in this.list) {
      const tool = this.list[uuid];
      if (tool.enabled && tool.isUpdateable()) {
        await tool.update(delta);
      }
    }
  }

  /**
   * Disposes all the MEMORY used by all the tools.
   */
  async dispose() {
    for (const uuid in this.list) {
      const tool = this.list[uuid];
      tool.enabled = false;
      if (tool.isDisposeable()) {
        await tool.dispose();
      }
    }
  }

  private _uuidv4Pattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  private validateUUID(uuid: string) {
    if (!this._uuidv4Pattern.test(uuid))
      throw new Error(
        `${uuid} is not a valid UUID v4.

- If you're the tool creator, you can take one from https://www.uuidgenerator.net/.

- If you're using a platform tool, verify the uuid isn't misspelled or contact the tool creator.`
      );
  }

  async getPlatformComponent<T extends Component<any>>(id: string): Promise<T> {
    if (!this._OBC) {
      console.log("Tools component not initialized! Call the init method.");
    }
    this.validateUUID(id);
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
