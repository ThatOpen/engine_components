import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { ClipStyle, ClipEdges, ClipEdgesCreationConfig } from "./src";

/**
 * A component that can style Clipping Planes by adding edges and fills. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/ClipStyler). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/ClipStyler).
 */
export class ClipStyler extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "24dfc306-a3c4-410f-8071-babc4afa5e4d" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * Represents the current world instance used by the ClipStyler.
   * This can be an instance of `OBC.World` or `null` if no world is set.
   * You can still specify other world during the ClipEdges creation.
   */
  world: OBC.World | null = null;

  readonly styles = new FRAGS.DataMap<string, ClipStyle>();

  // Developers are not supposed to set anything in the list
  // It is done automatically
  readonly list = new FRAGS.DataMap<string, ClipEdges>();

  private _visible = true;

  /**
   * Gets the visibility state of the edges.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Sets the visibility state of the edges.
   * @param {boolean} active - The new visibility state.
   */
  set visible(active: boolean) {
    this._visible = active;
    for (const [, edges] of this.list) {
      edges.visible = active;
    }
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.list.set(ClipStyler.uuid, this);
    this.setEvents();
  }

  private setEvents() {
    this.list.onBeforeDelete.add(({ value: edges }) => edges.dispose());
  }

  private setEdgesConfig(edges: ClipEdges, config: ClipEdgesCreationConfig) {
    edges.world = config?.world ?? this.world;
    if (config?.items) {
      for (const [name, data] of Object.entries(config.items)) {
        edges.items.set(name, data);
      }
    }
    const id = config?.id ?? OBC.UUID.create();
    this.list.set(id, edges);
  }

  /**
   * Creates a new instance of `ClipEdges` using the specified plane and optional configuration.
   *
   * @param plane - The `THREE.Plane` object used to define the clipping plane.
   * @param config - Optional configuration for the edges creation.
   * @returns A new instance of `ClipEdges` initialized with the specified plane and configuration.
   * @remarks The given plane won't be copied during the ClipEdges creation.
   */
  create(plane: THREE.Plane, config?: ClipEdgesCreationConfig) {
    const edges = new ClipEdges(this.components, plane);
    if (config) this.setEdgesConfig(edges, config);
    return edges;
  }

  /**
   * Creates and configures clip edges from a given view.
   *
   * This method generates clip edges based on the provided view's plane and optional configuration.
   * If the `link` option in the configuration is enabled (default is `true`), the clip edges are
   * dynamically linked to the view's lifecycle events, ensuring proper disposal, updates, and visibility
   * synchronization with the view's state.
   *
   * @param view - The view object from which the clip edges are created.
   * @param config - Optional configuration for clip edge creation.
   * @returns The created clip edges object, configured and optionally linked to the view's lifecycle.
   */
  createFromView(view: OBC.View, config?: ClipEdgesCreationConfig) {
    const edges = this.create(view.plane, config);
    const link = config?.link !== undefined ? config.link : true;
    if (link) {
      view.onDisposed.add(() => edges.dispose());
      view.onUpdated.add(() => edges.update());
      view.onStateChanged.add(() => (edges.visible = view.open));
    }
    return edges;
  }

  /**
   * Creates and returns styled edges from a clipping plane identified by its ID.
   * Optionally, a configuration object can be provided to customize the creation process.
   *
   * @param id - The unique identifier of the clipping plane to create edges from.
   * @param config - Optional configuration for edge creation, including visibility and linking behavior.
   *
   * @returns The created edges styled from the clipping plane.
   *
   * @remarks
   * - If `config.link` is `true` (default), the edges will automatically update when the clipping plane's dragging ends
   *   and will be disposed of when the clipping plane is disposed.
   */
  createFromClipping(id: string, config?: ClipEdgesCreationConfig) {
    const clipper = this.components.get(OBC.Clipper);
    const clippingPlane = clipper.list.get(id);
    if (!clippingPlane) {
      throw new Error(`ClipStyler: Clipping plane with ID ${id} not found.`);
    }
    const edges = this.create(clippingPlane.three, config);
    edges.visible = true;
    const link = config?.link !== undefined ? config.link : true;
    if (link) {
      clippingPlane.onDraggingEnded.add(() => edges.update());
      clippingPlane.onDisposed.add(() => edges.dispose());
      // TODO: Add here the visibility toggle based on clippingPlane.visible chanages
    }
    return edges;
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    this.styles.clear();
    this.list.clear();
    this.onDisposed.trigger(ClipStyler.uuid);
  }
}

export * from "./src";
