import { Component, Disposable, Event } from "../Types";
import { Components } from "../Components";
import { SnapResolver } from "./src";

export * from "./src";

/**
 * Singleton component that owns one shared {@link SnapResolver} for
 * the {@link Components} instance. Snap caches are keyed by
 * `(modelId, localId)` so a single resolver across all worlds is
 * fine — there's no per-world state.
 */
export class SnapResolvers extends Component implements Disposable {
  /** Components-system UUID. */
  static readonly uuid = "be9b8e6c-7f5b-4a36-8e7e-3a1f5e2a6c9d" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  private readonly _resolver: SnapResolver;

  constructor(components: Components) {
    super(components);
    components.add(SnapResolvers.uuid, this);
    this._resolver = new SnapResolver(components);
  }

  /** The shared {@link SnapResolver}. */
  get(): SnapResolver {
    return this._resolver;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._resolver.dispose();
    this.onDisposed.trigger();
  }
}
