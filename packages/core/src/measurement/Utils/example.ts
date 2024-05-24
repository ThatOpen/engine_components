/* eslint import/no-extraneous-dependencies: 0 */

import * as THREE from "three";
import Stats from "stats.js";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

const fragments = new OBC.FragmentsManager(components);

const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const cullers = components.get(OBC.Cullers);
const culler = cullers.create(world);

for (const child of model.children) {
  if (child instanceof THREE.Mesh) {
    culler.add(child);
  }
}

culler.needsUpdate = true;

world.camera.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true;
});

const measurements = components.get(OBC.MeasurementUtils);

const casters = components.get(OBC.Raycasters);
const caster = casters.get(world);

const edges = new THREE.EdgesGeometry();
const material = new THREE.LineBasicMaterial({
  color: 0xff0000,
  depthTest: false,
});
const line = new THREE.LineSegments(edges, material);
world.scene.three.add(line);

if (world.renderer) {
  const canvas = world.renderer.three.domElement;
  canvas.addEventListener("mousemove", () => {
    const result = caster.castRay([model]);

    if (!result) return;
    if (!(result.object instanceof THREE.Mesh)) return;
    if (result.faceIndex === undefined) return;

    const face = measurements.getFace(
      result.object,
      result.faceIndex,
      result.instanceId,
    );

    if (face) {
      const points: THREE.Vector3[] = [];
      for (const edge of face.edges) {
        points.push(...edge.points);
      }
      edges.setFromPoints(points);
    }
  });
}

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
