import * as THREE from "three";
import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
components.scene = sceneComponent;

const rendererComponent = new OBC.PostproductionRenderer(components, container);
components.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
components.camera = cameraComponent;

cameraComponent.controls.setLookAt(12, 6, 8, 0, 0, -10);

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

const { postproduction } = rendererComponent;
postproduction.enabled = true;

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const gridMesh = grid.get();
postproduction.customEffects.excludedMeshes.push(gridMesh);

const culler = new OBC.ScreenCuller(components);

const fragments = new OBC.FragmentManager(components);

// Set up fragment culler update

container.addEventListener(
  "mouseup",
  () => (culler.elements.needsUpdate = true),
);
container.addEventListener("wheel", () => (culler.elements.needsUpdate = true));

// Load the fragments

const file = await fetch("../../../resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);

for (const fragment of model.items) {
  culler.elements.add(fragment.mesh);
}

const properties = await fetch("../../../resources/small.json");
model.setLocalProperties(await properties.json());

culler.elements.needsUpdate = true;

const clipper = new OBC.EdgesClipper(components);
const thickMaterial = new THREE.LineBasicMaterial({ color: "black" });
const thinMaterial = new THREE.LineBasicMaterial({ color: "blue" });
const fillMaterial = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
const fillOutline = new THREE.MeshBasicMaterial({
  color: "black",
  side: 1,
  opacity: 0.5,
  transparent: true,
});

clipper.styles.create("projected", new Set(), thinMaterial);
clipper.styles.create(
  "filled",
  new Set(),
  thickMaterial,
  fillMaterial,
  fillOutline,
);
const styles = clipper.styles.get();

postproduction.customEffects.outlineEnabled = true;

const classifier = new OBC.FragmentClassifier(components);
classifier.byEntity(model);

const found = classifier.find({ entities: ["IFCWALLSTANDARDCASE", "IFCWALL"] });

for (const fragID in found) {
  const { mesh } = fragments.list[fragID];
  styles.filled.fragments[fragID] = new Set(found[fragID]);
  styles.filled.meshes.add(mesh);
}

const meshes = [];
for (const fragment of model.items) {
  const { mesh } = fragment;
  meshes.push(mesh);
  styles.projected.meshes.add(mesh);
}

const whiteColor = new THREE.Color("white");
const whiteMaterial = new THREE.MeshBasicMaterial({ color: whiteColor });
const materialManager = new OBC.MaterialManager(components);
materialManager.addMaterial("white", whiteMaterial);
materialManager.addMeshes("white", meshes);

const plans = new OBC.FragmentPlans(components);
await plans.computeAllPlanViews(model);

classifier.byStorey(model);

const mainToolbar = new OBC.Toolbar(components);
components.ui.addToolbar(mainToolbar);

mainToolbar.addChild(plans.uiElement.get("main"));

plans.onNavigated.add(() => {
  postproduction.customEffects.glossEnabled = false;
  materialManager.setBackgroundColor(whiteColor);
  materialManager.set(true, ["white"]);
  grid.visible = false;
});

plans.onExited.add(() => {
  postproduction.customEffects.glossEnabled = true;
  materialManager.resetBackgroundColor();
  materialManager.set(false, ["white"]);
  grid.visible = true;
});

const dxfExporter = new OBC.DXFExporter(components);

plans.commands = {
  "Export to DXF": async (plan) => {
    if (!plan) return;
    const link = document.createElement("a");
    const result = await dxfExporter.export(plan.name);
    const fileName = `${plan.name}.dxf`;
    const file = new File([new Blob([result])], fileName);
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
  },
};

await plans.updatePlansList();

for (const { mesh } of model.items) {
  if (mesh.material[0].opacity !== 1) {
    mesh.material[0].depthWrite = false;
    mesh.material[0].polygonOffset = true;
    mesh.material[0].polygonOffsetFactor = 5;
    mesh.material[0].polygonOffsetUnits = 1;
  }
}

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
