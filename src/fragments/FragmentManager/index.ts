import { Fragment, FragmentsGroup, Serializer } from "bim-fragment";
import * as THREE from "three";
import { Component, Disposable, Event, UI, UIElement } from "../../base-types";
import { Components, ToolComponent } from "../../core";
import {
  Button,
  FloatingWindow,
  SimpleUICard,
  SimpleUIComponent,
} from "../../ui";

/**
 * Object that can efficiently load binary files that contain
 * [fragment geometry](https://github.com/ifcjs/fragment).
 */
export class FragmentManager
  extends Component<Fragment[]>
  implements Disposable, UI
{
  static readonly uuid = "fef46874-46a3-461b-8c44-2922ab77c806" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** All the created [fragments](https://github.com/ifcjs/fragment). */
  list: { [guid: string]: Fragment } = {};

  groups: FragmentsGroup[] = [];

  baseCoordinationModel = "";

  readonly onFragmentsLoaded: Event<FragmentsGroup> = new Event();
  readonly onFragmentsDisposed: Event<{
    groupID: string;
    fragmentIDs: string[];
  }> = new Event();

  uiElement = new UIElement<{
    main: Button;
    window: FloatingWindow;
  }>();

  commands: Button[] = [];

  private _loader = new Serializer();
  private _cards: SimpleUICard[] = [];

  /** The list of meshes of the created fragments. */
  get meshes() {
    const allMeshes: THREE.Mesh[] = [];
    for (const fragID in this.list) {
      allMeshes.push(this.list[fragID].mesh);
    }
    return allMeshes;
  }

  constructor(components: Components) {
    super(components);

    this.components.tools.add(FragmentManager.uuid, this);

    if (components.uiEnabled) {
      this.setupUI(components);
    }
  }

  /** {@link Component.get} */
  get(): Fragment[] {
    return Object.values(this.list);
  }

  /** {@link Component.get} */
  async dispose(disposeUI = false) {
    if (disposeUI) {
      this.uiElement.dispose();
    }
    for (const group of this.groups) {
      group.dispose(true);
    }
    for (const command of this.commands) {
      await command.dispose();
    }
    for (const card of this._cards) {
      await card.dispose();
    }
    this.groups = [];
    this.list = {};
    this.onFragmentsLoaded.reset();
    this.onFragmentsDisposed.reset();
  }

  async disposeGroup(group: FragmentsGroup) {
    const { uuid: groupID } = group;
    const fragmentIDs = group.items.map((fragment) => fragment.id);
    for (const fragment of group.items) {
      this.removeFragmentMesh(fragment);
      delete this.list[fragment.id];
    }
    group.dispose(true);
    const index = this.groups.indexOf(group);
    this.groups.splice(index, 1);
    await this.onFragmentsDisposed.trigger({
      groupID,
      fragmentIDs,
    });

    await this.updateWindow();
  }

  /** Disposes all existing fragments */
  reset() {
    for (const id in this.list) {
      const fragment = this.list[id];
      fragment.dispose();
    }
    this.list = {};
  }

  /**
   * Loads one or many fragments into the scene.
   * @param data - the bytes containing the data for the fragments to load.
   * @returns the list of IDs of the loaded fragments.
   */
  async load(data: Uint8Array) {
    const group = this._loader.import(data);
    const scene = this.components.scene.get();
    const ids: string[] = [];
    scene.add(group);
    for (const fragment of group.items) {
      fragment.group = group;
      this.list[fragment.id] = fragment;
      ids.push(fragment.id);
      this.components.meshes.push(fragment.mesh);
    }
    this.groups.push(group);
    await this.onFragmentsLoaded.trigger(group);
    return group;
  }

  /**
   * Export the specified fragments.
   * @param group - the fragments group to be exported.
   * @returns the exported data as binary buffer.
   */
  export(group: FragmentsGroup) {
    return this._loader.export(group);
  }

  async updateWindow() {
    if (!this.components.uiEnabled) {
      return;
    }

    for (const card of this._cards) {
      await card.dispose();
    }
    for (const group of this.groups) {
      const card = new SimpleUICard(this.components);

      // TODO: Make all cards like this?
      card.domElement.classList.remove("bg-ifcjs-120");
      card.domElement.classList.remove("border-transparent");
      card.domElement.className += ` min-w-[300px] my-2 border-1 border-solid border-[#3A444E] `;

      const buttonContainer = new SimpleUIComponent(this.components);
      card.addChild(buttonContainer);

      card.title = group.name;
      this.uiElement.get("window").addChild(card);
      this._cards.push(card);

      // TODO: Use command list just like in fragment plans
      const commandsButton = new Button(this.components);
      commandsButton.materialIcon = "delete";
      buttonContainer.addChild(commandsButton);
      commandsButton.onClick.add(() => this.disposeGroup(group));
    }
  }

  coordinate(models = this.groups) {
    const baseModel = this.groups.find(
      (group) => group.uuid === this.baseCoordinationModel
    );

    if (!baseModel) {
      console.log("No base model found for coordination!");
      return;
    }

    for (const model of models) {
      if (model === baseModel) {
        continue;
      }
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      model.updateMatrix();
      model.applyMatrix4(model.coordinationMatrix.clone().invert());
      model.applyMatrix4(baseModel.coordinationMatrix);
    }
  }

  private setupUI(components: Components) {
    const window = new FloatingWindow(components);
    window.title = "Models";
    window.domElement.style.left = "70px";
    window.domElement.style.top = "100px";
    window.domElement.style.width = "340px";
    window.domElement.style.height = "400px";

    const windowContent = window.slots.content.domElement;
    windowContent.classList.remove("overflow-auto");
    windowContent.classList.add("overflow-x-hidden");

    components.ui.add(window);
    window.visible = false;

    const main = new Button(components);
    main.tooltip = "Models";
    main.materialIcon = "inbox";
    main.onClick.add(() => {
      window.visible = !window.visible;
    });

    this.uiElement.set({ main, window });

    this.onFragmentsLoaded.add(() => this.updateWindow());
  }

  private removeFragmentMesh(fragment: Fragment) {
    const meshes = this.components.meshes;
    const mesh = fragment.mesh;
    if (meshes.includes(mesh)) {
      meshes.splice(meshes.indexOf(mesh), 1);
    }
  }
}

ToolComponent.libraryUUIDs.add(FragmentManager.uuid);
