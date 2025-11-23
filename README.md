<p align="center">
  <a href="https://thatopen.com/">TOC</a>
  |
  <a href="https://docs.thatopen.com/intro">documentation</a>
  |
  <a href="https://thatopen.github.io/engine_components/examples/IfcLoader/index.html">demo</a>
  |
  <a href="https://people.thatopen.com/">community</a>
  |
  <a href="https://www.npmjs.com/org/thatopen">npm package</a>
</p>

![cover](https://thatopen.github.io/engine_components/resources/cover.png)

<h1>Open BIM Components <img src="https://thatopen.github.io/engine_components/resources/favicon.ico" width="32"/></h1>

[![Components NPM Package][npm]][npm-url]
[![Components NPM Package][npm-downloads]][npm-url]
[![Components Front NPM Package][npm-front]][npm-url-front]
[![Components Front NPM Package][npm-downloads-front]][npm-url-front]

This library is a collection of BIM tools based on [Three.js](https://github.com/mrdoob/three.js/) and other libraries. It includes pre-made features to easily build browser-based 3D BIM applications, such as postproduction, dimensions, floorplan navigation, DXF export and much more. 


## 🤝 Want our help?
Are you developing a project with our technology and would like our help?
Apply now to join [That Open Accelerator Program](https://thatopen.com/accelerator)!

## Packages

This library contains 2 packages:

`@thatopen/components` - The core functionality. Compatible both with browser and Node.js environments.

`@thatopen/components-front` - Features exclusive for browser environments.

## Usage

You need to be familiar with [Three.js API](https://github.com/mrdoob/three.js/) to be able to use this library effectively. In the following example, we will create a cube in a 3D scene that can be navigated with the mouse or touch events. You can see the full example [here](https://github.com/ThatOpen/engine_components/blob/main/packages/core/src/core/Worlds/example.ts) and the deployed app [here](https://thatopen.github.io/engine_components/examples/Worlds/index.html).

```js
/* eslint import/no-extraneous-dependencies: 0 */

import * as THREE from "three";
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

const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
world.scene.three.add(cube);

world.scene.setup();

world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);
```


[npm]: https://img.shields.io/npm/v/@thatopen/components
[npm-url]: https://www.npmjs.com/package/@thatopen/components
[npm-downloads]: https://img.shields.io/npm/dw/@thatopen/components
[npm-front]: https://img.shields.io/npm/v/@thatopen/components-front
[npm-url-front]: https://www.npmjs.com/package/@thatopen/components-front
[npm-downloads-front]: https://img.shields.io/npm/dw/@thatopen/components-front
