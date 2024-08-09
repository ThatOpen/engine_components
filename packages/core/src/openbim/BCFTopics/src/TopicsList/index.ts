// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import { BCFTopicsUI, bcfTopicsListTemplate } from "./src/template";
import { BCFTopics } from "../..";

/**
 * Creates a BCF Topics List component with the given UI state.
 *
 * @param state - The initial state of the BCF Topics List component.
 * @param autoUpdate - A flag indicating whether the component should automatically update based on events happening in the BCFTopic component.
 * Default value is `true`.
 *
 * @returns A tuple containing the created BCF Topics List component and a function to update it.
 */
export const bcfTopicsList = (state: BCFTopicsUI, autoUpdate = true) => {
  const element = BUI.Component.create<BUI.Table, BCFTopicsUI>(
    bcfTopicsListTemplate,
    state,
  );

  if (autoUpdate) {
    const { components } = state;
    const bcfTopics = components.get(BCFTopics);
    const [, updateElement] = element;
    bcfTopics.list.onItemSet.add(() => updateElement());
    bcfTopics.list.onItemDeleted.add(() => updateElement());
    bcfTopics.list.onItemUpdated.add(() => updateElement());
  }

  return element;
};
