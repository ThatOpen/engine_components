/* eslint import/no-extraneous-dependencies: 0 */

import * as THREE from "three";
import * as BUI from "@thatopen/ui";
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

BUI.Manager.registerComponents();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Worlds Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section style="padding-top: 10px">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            world.scene.three.background = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            for (const child of world.scene.three.children) {
              if (child instanceof THREE.DirectionalLight) {
                child.intensity = target.value;
              }
            }
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            for (const child of world.scene.three.children) {
              if (child instanceof THREE.AmbientLight) {
                child.intensity = target.value;
              }
            }
          }}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);
