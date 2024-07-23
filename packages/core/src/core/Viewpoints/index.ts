import { World, Component, Disposable, Event } from "../Types";
import { Components } from "../Components";
import { Viewpoint } from "./src";

export class Viewpoints extends Component implements Disposable {
  static readonly uuid = "ee867824-a796-408d-8aa0-4e5962a83c66" as const;
  enabled = true;

  readonly list = new Map<string, Viewpoint>();

  readonly onViewpointCreated = new Event<Viewpoint>();
  readonly onViewpointDeleted = new Event<string>();

  create(world: World) {
    const viewpoint = new Viewpoint(this.components, world);
    this.list.set(viewpoint.guid, viewpoint);
    this.onViewpointCreated.trigger(viewpoint);
    return viewpoint;
  }

  delete(viewpoint: Viewpoint) {
    const { guid } = viewpoint;
    const deleted = this.list.delete(guid);
    this.onViewpointDeleted.trigger(guid);
    return deleted;
  }

  constructor(components: Components) {
    super(components);
    components.add(Viewpoints.uuid, this);
  }

  readonly onDisposed = new Event();

  dispose() {
    (this.list as any) = new Set();
    this.onDisposed.trigger();
  }
}

export * from "./src";
