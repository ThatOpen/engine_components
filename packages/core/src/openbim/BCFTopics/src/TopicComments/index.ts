// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import { TopicCommentsUI, topicCommentsTemplate } from "./src/template";

/**
 * Creates a Topic Comments List component with the given UI state.
 *
 * @param state - The initial state of the Topic Comments List component.
 * @param autoUpdate - A flag indicating whether the component should automatically update based on events happening in the BCFTopic component.
 * Default value is `true`.
 *
 * @returns A tuple containing the created Topic Comments List component and a function to update it.
 */
export const topicComments = (state: TopicCommentsUI, autoUpdate = true) => {
  const element = BUI.Component.create<BUI.Table, TopicCommentsUI>(
    topicCommentsTemplate,
    state,
  );

  if (autoUpdate) {
    const { topic } = state;
    const [_, updateElement] = element;
    topic.comments.onItemSet.add(() => updateElement());
    topic.comments.onItemUpdated.add(() => updateElement());
    topic.comments.onItemDeleted.add(() => updateElement());
    topic.comments.onCleared.add(() => updateElement());
  }

  return element;
};
