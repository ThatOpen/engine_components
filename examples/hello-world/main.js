import Stats from 'stats.js/src/Stats';
import * as THREE from 'three'
import {
    Components,
    SimpleGrid,
    SimpleScene,
    SimpleRenderer,
    SimpleClipper,
    SimpleDimensions,
    SimpleRaycaster,
    SimpleCamera
} from 'openbim-components'

const container = document.getElementById('viewer-container');

const components = new Components();

components.scene = new SimpleScene(components);
components.renderer = new SimpleRenderer(components, container);
components.camera = new SimpleCamera(components);
components.raycaster = new SimpleRaycaster(components);

components.init();

const scene = components.scene.getScene();

const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({color: "red"}))
cube.position.set(0, 1.5, 0)
scene.add(cube)

components.meshes.push(cube);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3)
directionalLight.intensity = 0.5;
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight)

// Add some components
const grid = new SimpleGrid(components);
components.tools.add(grid);

const clipper = new SimpleClipper(components);
components.tools.add(clipper)

const dimensions = new SimpleDimensions(components);
components.tools.add(dimensions)

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.right = '0px';
stats.dom.style.left = 'auto';

window.onkeydown = (event) => {
    switch (event.code){
        case "KeyC": {
            components.tools.toggle("clipper");
            break;
        }
        case "KeyD": {
            components.tools.toggle("dimensions");
            break;
        }
        case "KeyH": {
            components.tools.toggleAllVisibility()
            break;
        }
        case "Escape" : {
            if (dimensions.enabled) {
                dimensions.cancelDrawing()
            }
            break;
        }
        case "KeyP": {
            components.tools.printToolsState();
        }
        case "Delete": {
            if (clipper.enabled)
                clipper.deletePlane()

            if (dimensions.enabled) {
                dimensions.delete()
            }
        }
    }
}

window.ondblclick = () => {
    if (clipper.enabled) {
        clipper.createPlane();
    } else if (dimensions.enabled) {
        dimensions.create()
    }
}