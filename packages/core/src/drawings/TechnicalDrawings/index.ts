import * as FRAGS from "@thatopen/fragments";
import { Component, Disposable, World, Event } from "../../core/Types";
import { Components } from "../../core/Components";
import { OrthoPerspectiveCamera } from "../../core/OrthoPerspectiveCamera";
import { TechnicalDrawing, AnnotationSystem } from "./src";

export * from "./src";

/**
 * OBC Component that creates and manages {@link TechnicalDrawing} instances.
 *
 * A TechnicalDrawing is a 2D drawing plane that lives in 3D world space.
 * It contains projection lines and dimension annotations (layer 1 geometry)
 * framed by one or more orthographic {@link DrawingViewport}s.
 *
 * The drawing's `container` (a `THREE.Group`) can be freely transformed in the
 * 3D world — all viewports and geometry move together as a single unit.
 *
 * @example
 * ```ts
 * const techDrawings = components.get(TechnicalDrawings);
 * const drawing = techDrawings.create(world);
 *
 * // Add layer-1 geometry to the drawing
 * const lines = new THREE.LineSegments(geometry, material);
 * lines.layers.set(1);
 * drawing.three.add(lines);
 *
 * // Add viewports
 * const vp = drawing.viewports.create({ left: -1, right: 5, top: 1, bottom: -4 });
 * ```
 */
export class TechnicalDrawings extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "5c7d3b9a-4e8f-4a2b-9c1d-0e3f2a5b7c8d" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** All active drawings, keyed by their UUID. */
  readonly list = new FRAGS.DataMap<string, TechnicalDrawing>();

  /**
   * Global system instances keyed by their constructor.
   * Register a system with {@link use}; inspect or iterate here for UI purposes.
   */
  readonly systems = new FRAGS.DataMap<Function, AnnotationSystem<any>>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  constructor(components: Components) {
    super(components);
    components.add(TechnicalDrawings.uuid, this);

    // Dispose a drawing or system automatically when removed from its map.
    this.list.onBeforeDelete.add(({ value: drawing }) => drawing.dispose());
    this.systems.onBeforeDelete.add(({ value: system }) => system.dispose());
  }

  /**
   * Returns the global singleton instance of the given system, creating it if it
   * does not yet exist. The system constructor must accept `Components` as its
   * only argument (new-style global systems). Safe to call multiple times — always
   * returns the same instance.
   *
   * ```ts
   * const dims = techDrawings.use(OBC.LinearAnnotations);
   * dims.styles.set("default", { ... });
   * ```
   */
  use<T extends AnnotationSystem<any>>(
    SystemClass: new (components: Components) => T,
  ): T {
    if (this.systems.has(SystemClass)) {
      return this.systems.get(SystemClass) as T;
    }
    const instance = new SystemClass(this.components);
    this.systems.set(SystemClass, instance);
    return instance;
  }

  /**
   * Creates a new {@link TechnicalDrawing} hosted in the given world.
   *
   * The drawing's Three.js group is added to the world's scene and its
   * lifecycle is tied to the world — it is automatically removed when the
   * world is disposed. Three.js rendering layer 1 is enabled on the world
   * camera so that annotation geometry is visible in the 3D view. Both
   * perspective and orthographic cameras are configured when using
   * {@link OrthoPerspectiveCamera}.
   *
   * To hide the drawing from the 3D view without removing it from the world,
   * either set `drawing.three.visible = false` or disable layer 1 on the
   * world camera: `world.camera.three.layers.disable(1)`.
   *
   * @param world - The world that will host this drawing.
   * @returns The newly created drawing.
   */
  create(world: World): TechnicalDrawing {
    const drawing = new TechnicalDrawing(this.components);
    drawing.world = world;
    world.scene.three.add(drawing.three);
    world.onDisposed.add(() => this.list.delete(drawing.uuid));
    const cam = world.camera;
    cam.three.layers.enable(1);
    if (cam instanceof OrthoPerspectiveCamera) {
      cam.threePersp.layers.enable(1);
      cam.threeOrtho.layers.enable(1);
    }
    this.list.set(drawing.uuid, drawing);
    return drawing;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    // clear() triggers onBeforeDelete for each entry, calling dispose() on each.
    this.list.clear();
    this.systems.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
