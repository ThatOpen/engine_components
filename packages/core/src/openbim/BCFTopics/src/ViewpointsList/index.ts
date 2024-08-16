// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import { ViewpointsUI, viewpointsListTemplate } from "./src/template";
import { Viewpoints } from "../../../../core";

/**
 * Creates a Viewpoints component with the given UI state.
 *
 * @param state - The initial state of the Viewpoints component.
 * @param autoUpdate - A flag indicating whether the component should automatically update based on events happening in the BCFTopic component.
 * Default value is `true`.
 *
 * @returns A tuple containing the created Viewpoints component and a function to update it.
 */
export const viewpointsList = (state: ViewpointsUI, autoUpdate = true) => {
  const element = BUI.Component.create<BUI.Table, ViewpointsUI>(
    viewpointsListTemplate,
    state,
  );

  const { components, topic } = state;
  if (autoUpdate) {
    const [, updateElement] = element;
    const manager = components.get(Viewpoints);
    manager.list.onItemUpdated.add(() => updateElement());
    manager.list.onItemDeleted.add(() => updateElement());
    manager.list.onCleared.add(() => updateElement());
    if (topic) {
      topic.viewpoints.onItemAdded.add(() => updateElement());
      topic.viewpoints.onItemDeleted.add(() => updateElement());
      topic.viewpoints.onCleared.add(() => updateElement());
    } else {
      manager.list.onItemSet.add(() => updateElement());
    }
  }

  return element;
};
