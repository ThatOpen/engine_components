import * as THREE from "three";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = new OBC.SimpleWorld(components);

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

worlds.add(world);

components.init();

const cube = new THREE.Mesh(new THREE.BoxGeometry());
world.scene.three.add(cube);
