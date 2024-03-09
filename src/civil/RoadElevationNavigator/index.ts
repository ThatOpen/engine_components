// import * as THREE from "three";
// import { FragmentsGroup } from "bim-fragment";
// import { Component, UI, UIElement } from "../../base-types";
// import { Drawer } from "../../ui";
// import { Components, Simple2DScene } from "../../core";
// import { CivilUtils } from "../CivilUtils";
//
// export class RoadElevationNavigator extends Component<any> implements UI {
//   static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;
//
//   enabled = true;
//
//   uiElement = new UIElement<{
//     drawer: Drawer;
//   }>();
//
//   scene: Simple2DScene;
//
//   caster = new THREE.Raycaster();
//
//   private readonly _alignment: THREE.LineSegments;
//
//   constructor(components: Components) {
//     super(components);
//
//     this.caster.params.Line = { threshold: 5 };
//
//     this.components.tools.add(RoadElevationNavigator.uuid, this);
//
//     this.scene = new Simple2DScene(this.components, false);
//
//     this._alignment = new THREE.LineSegments(
//       new THREE.BufferGeometry(),
//       new THREE.LineBasicMaterial()
//     );
//
//     const scene = this.scene.get();
//     scene.add(this._alignment);
//
//     this.setUI();
//   }
//
//   get() {
//     return this._alignment;
//   }
//
//   draw(model: FragmentsGroup) {
//     if (!model.ifcCivil) {
//       console.warn("The provided model doesn't have civil data!");
//       return;
//     }
//     const alignment = model.ifcCivil.verticalAlignments;
//     const { geometry } = this._alignment;
//     CivilUtils.getAlignmentGeometry(alignment, geometry, false);
//   }
//
//   private setUI() {
//     const drawer = new Drawer(this.components);
//     this.components.ui.add(drawer);
//     drawer.alignment = "top";
//
//     drawer.onVisible.add(() => {
//       this.scene.grid.regenerate();
//     });
//     drawer.visible = false;
//
//     drawer.slots.content.domElement.style.padding = "0";
//     drawer.slots.content.domElement.style.overflow = "hidden";
//
//     const { clientWidth, clientHeight } = drawer.domElement;
//     this.scene.setSize(clientHeight, clientWidth);
//
//     const vContainer = this.scene.uiElement.get("container");
//     drawer.addChild(vContainer);
//
//     this.uiElement.set({ drawer });
//
//     if (this.components.renderer.isUpdateable()) {
//       this.components.renderer.onAfterUpdate.add(async () => {
//         if (drawer.visible) {
//           await this.scene.update();
//         }
//       });
//     }
//   }
// }
