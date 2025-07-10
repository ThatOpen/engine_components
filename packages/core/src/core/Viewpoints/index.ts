import { DataMap } from "@thatopen/fragments";
import { Component, Disposable, Event, Configurable, World } from "../Types";
import { Components } from "../Components";
import { BCFViewpoint, Viewpoint } from "./src";
import {
  ViewpointsConfigManager,
  ViewpointsConfig,
} from "./src/viewpoints-config";

export * from "./src";

/*
 * The viewpoints component manages and applies BCF compliant viewpoint to a world. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Viewpoints). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Viewpoints).
 */
export class Viewpoints
  extends Component
  implements
    Disposable,
    Configurable<ViewpointsConfigManager, ViewpointsConfig>
{
  static readonly uuid = "ee867824-a796-408d-8aa0-4e5962a83c66" as const;

  enabled = true;

  /**
   * Represents the default world where all viewpoints will be created.
   * A viewpoint can specify a different world if necessary.
   */
  world: World | null = null;

  /**
   * A DataMap that stores Viewpoint instances, indexed by their unique identifiers (guid).
   * This map is used to manage and retrieve Viewpoint instances within the Viewpoints component.
   */
  readonly list = new DataMap<string, Viewpoint>();

  /**
   * A collection of snapshots represented as a mapping between string keys and their corresponding binary data.
   */
  readonly snapshots = new DataMap<string, Uint8Array>();

  /**
   * Creates a new Viewpoint instance and adds it to the list.
   *
   * @param data - Optional partial data for the Viewpoint. If not provided, default data will be used.
   *
   * @returns The newly created Viewpoint instance.
   */
  create(data?: Partial<BCFViewpoint>): Viewpoint {
    const viewpoint = new Viewpoint(this.components, data);
    viewpoint.world = this.world;
    if (!data) this.list.set(viewpoint.guid, viewpoint);
    return viewpoint;
  }

  constructor(components: Components) {
    super(components);
    components.add(Viewpoints.uuid, this);
  }

  /**
   * Determines the file extension of a snapshot based on its header bytes.
   *
   * @param name - The name of the snapshot from the list to retrieve its extension.
   * @returns The file extension as a string. Defaults to "jpeg" if the snapshot
   *          does not exist or the header bytes do not match known formats.
   */
  getSnapshotExtension(name: string) {
    let extension = "jpeg";
    const bytes = this.snapshots.get(name);
    if (!bytes) return extension;
    const headerBytes = bytes.subarray(0, 4);
    let header = "";
    for (let i = 0; i < headerBytes.length; i++) {
      header += headerBytes[i].toString(16);
    }
    if (header.startsWith("89504e47")) {
      extension = "png";
    }

    if (header.startsWith("ffd8ffe")) {
      extension = "jpeg";
    }

    return extension;
  }

  isSetup = false;

  setup() {}

  onSetup = new Event();

  config = new ViewpointsConfigManager(
    this,
    this.components,
    "Viewpoints",
    Viewpoints.uuid,
  );

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * Disposes of the Viewpoints component and its associated resources.
   *
   * This method is responsible for cleaning up any resources held by the Viewpoints component,
   * such as disposing of the DataMap of Viewpoint instances and triggering and resetting the
   * onDisposed event.
   */
  dispose() {
    this.list.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
