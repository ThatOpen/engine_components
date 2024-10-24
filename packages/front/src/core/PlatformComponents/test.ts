import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBCF from "../..";

BUI.Manager.init();

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBCF.RendererWith2D
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.RendererWith2D(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

container.appendChild(world.renderer.three2D.domElement);

const grids = components.get(OBC.Grids);
grids.create(world);

world.scene.three.background = null;

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

(window as any).ThatOpenCompany = { OBC, BUI };

const cloudComponents = components.get(OBCF.PlatformComponents);

async function importComponent(url: string) {
  const fetched = await fetch(url);
  const componentData = await fetched.text();
  const test = await cloudComponents.import(componentData);
  console.log(test);
}

await importComponent("../../../../../resources/mock-cloud-component.js");
await importComponent("../../../../../resources/mock-cloud-component-2.js");
