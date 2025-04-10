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

[![NPM Package][npm]][npm-url]
[![NPM Package][npm-downloads]][npm-url]

This library is a collection of BIM tools based on [Three.js](https://github.com/mrdoob/three.js/) and other libraries. It includes pre-made features to easily build browser-based 3D BIM applications, such as postproduction, dimensions, floorplan navigation, DXF export and much more. 


## 🤝 Want our help?
Are you developing a project with our technology and would like our help?
Apply now to join [That Open Accelerator Program](https://thatopen.com/accelerator)!


## 🧩 Integration with fragments
As you might know, we have 4 open source libraries:
- [web-ifc](https://github.com/ThatOpen/engine_web-ifc): the IFC parser and geometry engine.
- [fragments](https://github.com/ThatOpen/engine_fragment): the open source format and 3D engine.
- [components](https://github.com/ThatOpen/engine_components): a set of tools to build BIM software fast. 
- [ui components](https://github.com/ThatOpen/engine_ui-components): our agnostic UI system.

Components doesn't work with this new version of Fragments yet. In the next release, at the end of Q2, all components will be updated to work with this new version of Fragments. In the meantime, you have 3 options:

- Work with Fragments and build your own BIM components from scratch.
- Work with Components (which don't use this new version of Fragments).
- Check out our [Accelerator Program](https://thatopen.com/accelerator) to get previous access to the upcoming components.

Once the release at the end of Q2 is made, Components will work natively with this new version of Fragments.

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
