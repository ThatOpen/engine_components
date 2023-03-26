<p align="center">
  <a href="https://ifcjs.io/">ifc.js</a>
  |
  <a href="https://ifcjs.github.io/components/docs/index.html">documentation</a>
  |
  <a href="https://ifcjs.github.io/components/examples/fragment-hello-world.html">demo</a>
  |
  <a href="https://discord.gg/FXfyR4XrKT">discord</a>
  |
  <a href="https://www.npmjs.com/package/openbim-components">npm package</a>
  |
  <a href="https://airtable.com/shrP82Kgb9Q1LEgbU">roadmap</a>
</p>

![cover](cover.png)

<h1>Open BIM Components <img src="https://ifcjs.github.io/info/img/logo.svg" width="32"></h1>

[![NPM Package][npm]][npm-url]
[![NPM Package][npm-downloads]][npm-url]
[![NPM Package][oc-contributors]][oc]
[![Discord][discord]][discord-url]
[![Tests](https://github.com/IFCjs/components/actions/workflows/tests.yaml/badge.svg)](https://github.com/IFCjs/components/actions/workflows/tests.yaml)

This library is a collection of BIM tools based on [Three.js](https://github.com/mrdoob/three.js/) and other libraries. It includes pre-made features to easily build browser-based 3D BIM applications, such as postproduction, dimensions, floorplan navigation, DXF export and much more. 

### Usage

You need to be familiar with [Three.js API](https://github.com/mrdoob/three.js/) to be able to use this library effectively. In the following example, we will create a cube in a 3D scene that can be navigated with the mouse or touch events. You can see the full example [here](https://github.com/IFCjs/components/blob/main/examples/hello-world.html) and the deployed app [here](https://ifcjs.github.io/components/examples/hello-world.html).

```js
import * as THREE from "three";
import * as OBC from "openbim-components";

// Get the <div> element where the scene will be displayed

const container = document.getElementById('container');

// Initialize the basic components needed to use this library

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components._renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

// Add some elements to the scene

const scene = components.scene.get();

const geometry = new new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshStandardMaterial({ color: "red" });
const cube = THREE.Mesh(geometry, material);
cube.position.set(0, 1.5, 0);
scene.add(cube);

components.meshes.push(cube);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);
```



[ifcjs]: https://ifcjs.io/
[npm]: https://img.shields.io/npm/v/openbim-components
[npm-url]: https://www.npmjs.com/package/openbim-components
[npm-downloads]: https://img.shields.io/npm/dw/openbim-components
[discord]: https://img.shields.io/discord/799990228336115742
[discord-url]: https://discord.gg/FXfyR4XrKT
[oc]: https://opencollective.com/ifcjs
[oc-contributors]: https://opencollective.com/ifcjs/tiers/badge.svg
