import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "../..";

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

const grids = components.get(OBC.Grids);
grids.create(world);

const marker = components.get(OBCF.Marker);

marker.threshold = 10;

// marker.autoCluster = false;

for (let i = 0; i < 20; i++) {
  const x = Math.random() * 5;
  const y = Math.random() * 5;
  const z = Math.random() * 5;
  marker.create(world, "🚀", new THREE.Vector3(x, y, z));
}
