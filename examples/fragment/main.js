import Stats from 'stats.js/src/Stats';
import * as THREE from 'three'
import {
    Components,
    SimpleGrid,
    SimpleScene,
    SimpleRenderer,
    SimpleCamera,
    SimpleClipper,
    SimpleDimensions,
    Fragments,
    SimpleRaycaster
} from 'openbim-components'
import { unzip } from "unzipit";

const container = document.getElementById('viewer-container');

const components = new Components();

components.scene = new SimpleScene(components);
components.renderer = new SimpleRenderer(components, container);
components.camera = new SimpleCamera(components);
components.raycaster = new SimpleRaycaster(components);

components.init();

const scene = components.scene.getScene();

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

components.renderer.onStartRender.on(() => stats.begin());
components.renderer.onFinishRender.on(() => stats.end());

const fragments = new Fragments(components);
loadFragments();

async function loadFragments() {
    const { entries } = await unzip('../models/small.zip');

    const fileNames = Object.keys(entries);

    const allTypes = await entries['all-types.json'].json();
    const modelTypes = await entries['model-types.json'].json();
    const levelsProperties = await entries['levels-properties.json'].json();
    const levelsRelationship = await entries['levels-relationship.json'].json();

    const floorNames = {};
    for(const levelProps of levelsProperties) {
        floorNames[levelProps.expressID] = levelProps.Name.value;
    }

    for (let i = 0; i < fileNames.length; i++) {

        const name = fileNames[i];
        if(!name.includes('.glb')) continue;

        // Load data
        const geometryName = fileNames[i];
        const geometry = await entries[geometryName].blob();
        const geometryURL = URL.createObjectURL(geometry);

        const dataName = geometryName.substring(0, geometryName.indexOf('.glb')) + '.json';
        const dataBlob = await entries[dataName].blob();
        const data = await entries[dataName].json();
        const dataURL = URL.createObjectURL(dataBlob);

       const fragment = await fragments.load(geometryURL, dataURL);

       // Categorize items

        const groups = {category: {}, floor: {}}
        const ids = data.ids;

        for(const id of ids) {
            const categoryID = modelTypes[id];
            const category = allTypes[categoryID];
            if(!groups.category[category]) {
                groups.category[category] = [];
            }
            groups.category[category].push(id);

            const floorID = levelsRelationship[id];
            const floor = floorNames[floorID];
            if(!groups.floor[floor]) {
                groups.floor[floor] = [];
            }
            groups.floor[floor].push(floor);
        }

        fragments.groups.add(fragment.id, groups);
    }

    console.log(fragments.groups);

    const buttonContainer = document.getElementById('button-container');
    const categories = Object.keys(fragments.groups.groupSystems.category);
    for(const category of categories) {
        const button = document.createElement('button');
        button.textContent = category;
        buttonContainer.appendChild(button);

        let visible = true;
        button.onclick = () => {
            visible = !visible;
            const models = fragments.groups.get({ category });
            for(const guid in models) {
                const ids = models[guid];
                const frag = fragments.fragments[guid];
                frag.setVisibility(ids, visible);
            }
        }
    }

    fragments.updateHighlight();
}

window.addEventListener("mousemove", () => fragments.highlighter.highlightOnHover());

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
        case "Escape" :{
            if(dimensions.enabled){
                dimensions.cancelDrawing()
            }
            break;
        }
        case "KeyP": {
            components.tools.printToolsState();
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