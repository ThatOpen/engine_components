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
    const { components, topics } = state;
    const [, updateElement] = element;
    const bcfTopics = components.get(BCFTopics);
    bcfTopics.list.onItemUpdated.add(() => updateElement());
    bcfTopics.list.onItemDeleted.add(() => updateElement());
    if (topics) {
      for (const topic of topics) {
        topic.relatedTopics.onItemAdded.add(() => updateElement());
        topic.relatedTopics.onItemDeleted.add(() => updateElement());
        topic.relatedTopics.onCleared.add(() => updateElement());
      }
    } else {
      bcfTopics.list.onItemSet.add(() => updateElement());
    }
  }

  return element;
};
