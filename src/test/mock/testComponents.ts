import { Components, SimpleScene } from "../../core";
import { TestRenderer } from "../TestRenderer";
import { TestCamera } from "../TestCamera";

export default () => {
  const components = new Components();

  components.scene = new SimpleScene(components);

  const div = document.createElement("div");

  components.renderer = new TestRenderer(div, { antialias: true, alpha: true });

  components.camera = new TestCamera(components);

  return components;
};
