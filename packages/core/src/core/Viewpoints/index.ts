import { World, Component, Disposable, Event, DataMap } from "../Types";
import { Components } from "../Components";
import { BCFViewpoint, Viewpoint } from "./src";

export class Viewpoints extends Component implements Disposable {
  static readonly uuid = "ee867824-a796-408d-8aa0-4e5962a83c66" as const;
  enabled = true;

  readonly list = new DataMap<string, Viewpoint>();

  create(world: World, data?: Partial<BCFViewpoint>) {
    const viewpoint = new Viewpoint(this.components, world, { data });
    if (!data) this.list.set(viewpoint.guid, viewpoint);
    return viewpoint;
  }

  constructor(components: Components) {
    super(components);
    components.add(Viewpoints.uuid, this);
  }

  readonly onDisposed = new Event();

  dispose() {
    this.list.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}

export * from "./src";
