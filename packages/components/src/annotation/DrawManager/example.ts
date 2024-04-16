import * as THREE from "three";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(components);
components.scene = sceneComponent;

const rendererComponent = new OBC.PostproductionRenderer(components, container);
components.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
components.camera = cameraComponent;
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

rendererComponent.postproduction.enabled = true;

cameraComponent.controls.setLookAt(12, 6, 8, 0, 0, -10);

sceneComponent.setup();

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const customEffects = rendererComponent.postproduction.customEffects;
customEffects.excludedMeshes.push(grid.get());

// Tutorial starts here
const drawManager = new OBC.DrawManager(components);
// @ts-ignore
const arrowAnnotation = new OBC.ArrowAnnotation(components);
// @ts-ignore
const circleAnnotation = new OBC.CircleAnnotation(components);
// @ts-ignore
const rectangleAnnotation = new OBC.RectangleAnnotation(components);
// @ts-ignore
const textAnnotation = new OBC.TextAnnotation(components);

const mainToolbar = new OBC.Toolbar(components);
mainToolbar.addChild(drawManager.uiElement.get("main"));

components.ui.addToolbar(mainToolbar);
