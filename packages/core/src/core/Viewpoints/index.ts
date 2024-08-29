import {
  World,
  Component,
  Disposable,
  Event,
  DataMap,
  Configurable,
} from "../Types";
import { Components } from "../Components";
import { BCFViewpoint, Viewpoint } from "./src";

/**
 * Configuration interface for the Viewpoints general behavior.
 */
interface ViewpointsConfig {
  /**
   * Indicates whether to overwrite the fragments colors when applying viewpoints.
   * @remarks BCF Viewpoints comes with information to indicate the colors to be applied to components, if any.
   * @default false
   */
  overwriteColors: boolean;
}

/*
 * The viewpoints component manages and applies BCF compliant viewpoint to a world.
 */
export class Viewpoints
  extends Component
  implements Disposable, Configurable<ViewpointsConfig>
{
  static readonly uuid = "ee867824-a796-408d-8aa0-4e5962a83c66" as const;
  enabled = true;

  /**
   * A DataMap that stores Viewpoint instances, indexed by their unique identifiers (guid).
   * This map is used to manage and retrieve Viewpoint instances within the Viewpoints component.
   */
  readonly list = new DataMap<string, Viewpoint>();

  /**
   * Creates a new Viewpoint instance and adds it to the list.
   *
   * @param world - The world in which the Viewpoint will be created.
   * @param data - Optional partial data for the Viewpoint. If not provided, default data will be used.
   *
   * @returns The newly created Viewpoint instance.
   */
  create(world: World, data?: Partial<BCFViewpoint>): Viewpoint {
    const viewpoint = new Viewpoint(this.components, world, { data });
    if (!data) this.list.set(viewpoint.guid, viewpoint);
    return viewpoint;
  }

  constructor(components: Components) {
    super(components);
    components.add(Viewpoints.uuid, this);
  }

  isSetup = false;
  setup() {}
  onSetup = new Event();
  config: Required<ViewpointsConfig> = { overwriteColors: false };

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

export * from "./src";
