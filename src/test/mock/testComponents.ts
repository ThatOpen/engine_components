import { Components, SimpleRaycaster, SimpleScene } from "../../core";
import { TestRenderer } from "../TestRenderer";
import { TestCamera } from "../TestCamera";

export default () => {
  const components = new Components();

  components.scene = new SimpleScene(components);

  const parent = document.createElement("div");
  const container = document.createElement("div");

  parent.appendChild(container);

  components.renderer = new TestRenderer(container, {
    antialias: true,
    alpha: true,
  });

  components.raycaster = new SimpleRaycaster(components);

  components.camera = new TestCamera(components);

  components.init();

  return components;
};
