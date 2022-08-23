import Stats from 'stats.js/src/Stats';
import * as THREE from 'three'
import {
    Components,
    SimpleGrid,
    SimpleScene,
    SimpleCamera,
    SimpleClipper,
    SimpleDimensions,
    Fragments,
    SimpleRaycaster,
    PostproductionRenderer,
    ShadowDropper,
    SimplePlane
} from 'openbim-components'
import { unzip } from "unzipit";

const container = document.getElementById('viewer-container');

const components = new Components();

components.scene = new SimpleScene(components);
const renderer = new PostproductionRenderer(components, container);
components.renderer = renderer;
renderer.postproduction.outlineColor = 0x999999;

const camera = new SimpleCamera(components);
components.camera = camera;
renderer.postproduction.setup(camera.controls);
renderer.postproduction.active = true;

components.raycaster = new SimpleRaycaster(components);

components.init();


const scene = components.scene.getScene();

const shadows = new ShadowDropper(components);


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
renderer.postproduction.excludedItems.add(grid.grid);

const clipper = new SimpleClipper(components, SimplePlane);
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
    const { entries } = await unzip('../models/medium.zip');

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

        // TODO: string conversion temporary until we update the fragment files (ids are now strings)
       fragment.items = fragment.items.map(item => item.toString());

       // Group items for visibility

        const groups = {category: {}, floor: {}}

        // TODO: string conversion temporary until we update the fragment files (ids are now strings)
        const ids = data.ids.map(id => id.toString());

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
            groups.floor[floor].push(id);
        }

        fragments.groups.add(fragment.id, groups);

    }

    // Group by category

    const categoryContainer = document.getElementById('category-container');

    const categories = Object.keys(fragments.groups.groupSystems.category);
    for(const category of categories) {
        const button = document.createElement('button');
        button.textContent = category;
        categoryContainer.appendChild(button);

        let visible = true;
        button.onclick = () => {
            visible = !visible;
            const models = fragments.groups.get({ category });
            for(const guid in models) {
                const ids = models[guid];
                const frag = fragments.fragments[guid];
                frag.setVisibility(ids, visible);

                const culled = fragments.culler.meshes.get(frag.id);
                if(culled) culled.count = frag.mesh.count;

            }
            fragments.culler.needsUpdate = true;
            renderer.postproduction.update();
        }
    }

    // Group by level

    const levelContainer = document.getElementById('level-container');

    const floors = Object.keys(fragments.groups.groupSystems.floor);
    for(const floor of floors) {
        const button = document.createElement('button');
        button.textContent = floor;
        levelContainer.appendChild(button);

        let visible = true;
        button.onclick = () => {
            visible = !visible;
            const models = fragments.groups.get({ floor });
            for(const guid in models) {
                const ids = models[guid];
                const frag = fragments.fragments[guid];
                frag.setVisibility(ids, visible);

                const culled = fragments.culler.meshes.get(frag.id);
                if(culled) culled.count = frag.mesh.count;
            }
            fragments.culler.needsUpdate = true;
            renderer.postproduction.update();
        }
    }

    fragments.highlighter.update();
    fragments.highlighter.active = true;

    // Render shadows
    const guids = fragments.groups.get({category: 'IFCSLAB'});
    const slabs = Object.keys(guids).map(guid => fragments.fragments[guid]);
    const meshes = slabs.map(slab => slab.mesh);
    const shadow = shadows.renderShadow(meshes, 'example');
    renderer.postproduction.excludedItems.add(shadow);
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