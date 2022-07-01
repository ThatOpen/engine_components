import Stats from 'stats.js/src/Stats';
import { Components } from 'viewer'
import {SimpleGrid} from "viewer/dist/components/SimpleGrid.js";
import {SimpleScene} from "viewer/dist/components/SimpleScene.js";
import {SimpleRenderer} from "viewer/dist/components/SimpleRenderer.js";
import {SimpleCamera} from "viewer/dist/components/SimpleCamera.js";
import * as THREE from 'three'
import {SimpleClipper} from "viewer/dist/components/SimpleClipper.js";
import {SimpleDimensions} from "viewer/dist/components/SimpleDimensions.js";

const container = document.getElementById('viewer-container');

const components = new Components();

const scene = new SimpleScene(components);
components.scene = scene;

const renderer = new SimpleRenderer(components, container);
components.renderer = renderer;

const camera = new SimpleCamera(components);
components.camera = camera;

components.init()

const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ color: "red" }))
cube.position.set(0, 1.5, 0)
scene.getScene().add(cube)

components.meshes.push(cube);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3)
directionalLight.intensity = 0.5;
scene.getScene().add(directionalLight)

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.getScene().add(ambientLight)

// Add some components
const grid = new SimpleGrid(components);
components.addComponent(grid);

const clipper = new SimpleClipper(components);
components.addComponent(clipper)

const dimensions = new SimpleDimensions(components);
components.addComponent(dimensions)

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.right = '0px';
stats.dom.style.left = 'auto';

renderer.onStartRender.on(() => stats.begin())
renderer.onFinishRender.on(() => stats.end())

window.onkeydown = (event) => {
    switch (event.code){
        case "KeyC": {
            clipper.enabled = !clipper.enabled;
            console.log("Clipper active: " + clipper.enabled)
            break;
        }
        case "KeyD": {
            dimensions.enabled = !dimensions.enabled;
            if(dimensions.enabled){
                dimensions.previewActive = true;
            }else {
                dimensions.previewActive = false;
            }
            console.log("Dimensions active: " + dimensions.enabled)
            break;
        }
        case "Escape" :{
            if(dimensions.enabled){
                dimensions.cancelDrawing()
            }
            break;
        }
        case "Delete": {
            if(clipper.enabled)
                clipper.deletePlane()

            if(dimensions.enabled){
                dimensions.delete()
            }
        }
    }
}

window.ondblclick = () => {
    if(clipper.enabled){
        clipper.createPlane();
    }

    else if(dimensions.enabled){
        dimensions.create()
    }
}