import { FragmentsManager, ModelIdMap } from "../FragmentsManager";
import { Components, Component } from "../../core";

/**
 * A component that manages visibility of fragments within a 3D scene. It extends the base Component class and provides methods to control fragment visibility and isolation. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Hider). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Hider).
 */
export class Hider extends Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "dd9ccf2d-8a21-4821-b7f6-2949add16a29" as const;

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
    this.components.add(Hider.uuid, this);
  }

  /**
   * Sets the visibility of fragment items within the 3D scene.
   * If no `modelIdMap` parameter is provided, all fragments will be set to the specified visibility.
   * If it is provided, only the specified fragment items will be affected.
   *
   * @param visible - The visibility state to set for the items.
   * @param modelIdMap - An optional map of modelIds and their corresponding itemIds to be affected.
   * If not provided, all fragment items will be affected.
   */
  async set(visible: boolean, modelIdMap?: ModelIdMap) {
    const fragments = this.components.get(FragmentsManager);
    const promises = [];

    if (modelIdMap) {
      for (const [modelId, localIds] of Object.entries(modelIdMap)) {
        const model = fragments.list.get(modelId);
        if (!model) continue;
        promises.push(model.setVisible([...localIds], visible));
      }
    } else {
      for (const model of fragments.list.values()) {
        promises.push(model.setVisible(undefined, visible));
      }
    }

    await Promise.all(promises);
    await fragments.core.update(true);
  }

  /**
   * Isolates fragments within the 3D scene by hiding all other fragments and showing only the specified ones.
   * It calls the `set` method twice: first to hide all fragments, and then to show only the specified ones.
   *
   * @param modelIdMap - A map of model IDs and their corresponding itemIds to be isolated.
   */
  async isolate(modelIdMap: ModelIdMap) {
    // TODO: Add isolate directly on FragmentsModel for better performance
    await Promise.all([
      this.set(false), // Hides all fragments
      this.set(true, modelIdMap), // Shows only the specified fragments
    ]);
  }

  /**
   * Toggles the visibility of specified items in the fragments.
   *
   * @param modelIdMap - An object where the keys are model IDs and the values are arrays of local IDs representing the fragments to be toggled.
   * @returns A promise that resolves when all visibility toggles and the core update are complete.
   */
  async toggle(modelIdMap: ModelIdMap) {
    const promises: Promise<void>[] = [];
    const fragments = this.components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(modelIdMap)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      promises.push(model.toggleVisible([...localIds]));
    }
    await Promise.all(promises);
    await fragments.core.update(true);
  }

  /**
   * Asynchronously retrieves a map of model IDs to their corresponding item IDs based on visibility state.
   *
   * @param state - The visibility state to filter items by.
   * @param modelIds - Optional array of model IDs to filter the items. If not provided, all models will be considered.
   * @returns A promise that resolves to a ModelIdMap record where the keys are model IDs and the values are arrays of item IDs that match the visibility state.
   */
  async getVisibilityMap(state: boolean, modelIds?: string[]) {
    const models: string[] = [];
    const promises: Promise<number[]>[] = [];
    const fragments = this.components.get(FragmentsManager);
    if (modelIds) {
      for (const modelId of modelIds) {
        const model = fragments.list.get(modelId);
        if (!model) continue;
        models.push(model.modelId);
        promises.push(model.getItemsByVisibility(state));
      }
    } else {
      for (const model of fragments.list.values()) {
        models.push(model.modelId);
        promises.push(model.getItemsByVisibility(state));
      }
    }
    const localIds = await Promise.all(promises);
    const modelIdMap: Record<string, number[]> = {};
    for (const [index, modelId] of models.entries()) {
      modelIdMap[modelId] = localIds[index];
    }
    return modelIdMap;
  }
}
