import type { FragmentsModels } from "@thatopen/fragments";
import type { ModelIdMap } from "@thatopen/components";
import { IsolationMaterials } from "./isolation-materials";

type State = { selection: ModelIdMap | null; opacity: number };

/** Isolates the active selection with an adjustable, streamed material context. */
export class HighlighterIsolation {
  private desired: State = { selection: null, opacity: 1 };
  private applied: State | null = null;
  private running: Promise<void> | null = null;
  private materials: IsolationMaterials | null = null;
  private core: FragmentsModels | null = null;
  private disposed = false;

  /** Whether a non-empty selection is currently isolated. */
  get active() {
    return this.desired.selection !== null;
  }

  /** Context opacity in the range 0–1; zero hides context geometry. */
  get opacity() {
    return this.desired.opacity;
  }

  constructor(
    private getCore: () => FragmentsModels,
    private getSelection: () => ModelIdMap,
    private getStyle: () => string | null,
    private validateSelection: (selection: ModelIdMap) => void = () => {},
  ) {}

  /** Isolates the selection; resetting or clearing it shows all loaded items. */
  async isolate(opacity = 0) {
    this.validate(opacity);
    const source = this.getSelection();
    const selection: ModelIdMap = {};
    for (const [modelId, ids] of Object.entries(source)) {
      if (ids.size) selection[modelId] = new Set(ids);
    }
    if (!Object.keys(selection).length) {
      await this.reset();
      return;
    }
    this.core ??= this.getCore();
    this.validateStyle(opacity);
    if (opacity > 0) this.validateSelection(selection);
    for (const modelId of Object.keys(selection)) {
      if (!this.core.models.list.has(modelId))
        throw new Error(`Unknown isolation model: ${modelId}`);
    }
    this.desired = { selection, opacity };
    await this.schedule();
  }

  /** Changes context opacity without enumerating model items or creating worker materials. */
  async setOpacity(opacity: number) {
    this.validate(opacity);
    if (!this.active) return;
    this.validateStyle(opacity);
    if (this.opacity === 0 && opacity > 0)
      this.validateSelection(this.desired.selection!);
    this.desired = { ...this.desired, opacity };
    await this.schedule();
  }

  /** Refreshes isolation after selection changes or loading another model. */
  async refresh() {
    if (!this.active) return;
    try {
      await this.isolate(this.opacity);
    } catch (error) {
      // An invalid selection/style must not leave selected items faded.
      await this.reset();
      throw error;
    }
  }

  /** Restores original material properties and shows all loaded items. */
  async reset() {
    if (this.disposed || (!this.active && !this.running)) return;
    this.desired = { selection: null, opacity: 1 };
    await this.schedule();
  }

  /** Cancels pending updates and restores materials synchronously; call reset first to restore visibility in a retained scene. */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.desired = { selection: null, opacity: 1 };
    this.materials?.dispose();
    this.materials = null;
    this.core = null;
  }

  private validate(opacity: number) {
    if (this.disposed) throw new Error("Isolation has been disposed.");
    if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
      throw new Error("Context opacity must be between 0 and 1.");
    }
  }

  private validateStyle(opacity: number) {
    if (opacity > 0 && this.getStyle() === null) {
      throw new Error(
        "A non-null select material is required for translucent context.",
      );
    }
  }

  private schedule() {
    if (!this.running) {
      this.running = Promise.resolve().then(async () => {
        try {
          while (!this.disposed && this.applied !== this.desired)
            await this.apply(this.desired);
        } catch (error) {
          this.applied = null;
          throw error;
        } finally {
          // Clear within the drain: a request arriving as its promise settles
          // must start a new drain instead of joining an already-finished one.
          this.running = null;
        }
      });
    }
    return this.running;
  }

  private async apply(state: State) {
    const core = this.core!;
    const hidden = state.selection !== null && state.opacity === 0;
    const wasHidden =
      this.applied?.selection !== null && this.applied?.opacity === 0;
    // Positive opacity changes touch only GPU materials: O(materials), no IFC ID scan.
    if (!this.applied || hidden || wasHidden || !state.selection) {
      for (const [modelId, model] of core.models.list) {
        if (this.disposed) return;
        await model.setVisible(undefined, !hidden);
        if (this.disposed) return;
        const ids = state.selection?.[modelId];
        if (hidden && ids?.size) await model.setVisible([...ids], true);
      }
      if (this.disposed) return;
      if (core.models.list.size) await core.update(true);
    }
    if (this.disposed) return;
    this.materials ??= new IsolationMaterials(
      core.models.materials.list,
      this.getStyle,
    );
    this.materials.setOpacity(state.selection && !hidden ? state.opacity : 1);
    this.applied = state;
  }
}
