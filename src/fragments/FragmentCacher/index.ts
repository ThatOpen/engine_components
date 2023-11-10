import { FragmentsGroup } from "bim-fragment";
import { Components, LocalCacher } from "../../core";
import { FragmentManager } from "../FragmentManager";
import { Button, FloatingWindow, SimpleUICard } from "../../ui";

// TODO: Clean up
// TODO: Improve UI element

export class FragmentCacher extends LocalCacher {
  private _mode: "save" | "load" | "none" = "none";

  get fragmentsIDs() {
    const allIDs = this.ids;
    const fragIDs = allIDs.filter((id) => id.includes("-fragments"));
    if (!fragIDs.length) return fragIDs;
    return fragIDs.map((id) => id.replace("-fragments", ""));
  }

  constructor(components: Components) {
    super(components);

    components.tools.list.set(FragmentCacher.uuid, this);

    if (components.uiEnabled) {
      this.setupUI();
    }
  }

  private setupUI() {
    const saveButton = this.uiElement.get<Button>("saveButton");
    saveButton.onClick.add(() => this.onSaveButtonClicked());
    const loadButton = this.uiElement.get<Button>("loadButton");
    loadButton.onClick.add(() => this.onLoadButtonClicked());
  }

  async getFragmentGroup(id: string) {
    const { fragmentsCacheID, propertiesCacheID } = this.getIDs(id);

    if (!fragmentsCacheID || !propertiesCacheID) {
      return null;
    }

    const fragments = await this.components.tools.get(FragmentManager);

    const fragmentFile = await this.get(fragmentsCacheID);
    if (fragmentFile === null) {
      throw new Error("Loading error");
    }

    const fragmentsData = await fragmentFile.arrayBuffer();
    const buffer = new Uint8Array(fragmentsData);
    const group = await fragments.load(buffer);

    const propertiesFile = await this.get(propertiesCacheID);
    if (propertiesFile !== null) {
      const propertiesData = await propertiesFile.text();
      group.properties = JSON.parse(propertiesData);
    }

    const scene = this.components.scene.get();
    scene.add(group);

    return group;
  }

  async saveFragmentGroup(group: FragmentsGroup, id = group.uuid) {
    const fragments = await this.components.tools.get(FragmentManager);

    const { fragmentsCacheID, propertiesCacheID } = this.getIDs(id);
    const exported = fragments.export(group);
    const fragmentsFile = new File([new Blob([exported])], fragmentsCacheID);
    const fragmentsUrl = URL.createObjectURL(fragmentsFile);
    await this.save(fragmentsCacheID, fragmentsUrl);

    if (group.properties) {
      const json = JSON.stringify(group.properties);
      const jsonFile = new File([new Blob([json])], propertiesCacheID);
      const propertiesUrl = URL.createObjectURL(jsonFile);
      await this.save(propertiesCacheID, propertiesUrl);
    }
  }

  existsFragmentGroup(id: string) {
    const { fragmentsCacheID } = this.getIDs(id);
    return this.exists(fragmentsCacheID);
  }

  private async onLoadButtonClicked() {
    const floatingMenu = this.uiElement.get<FloatingWindow>("floatingMenu");
    floatingMenu.title = "Load saved items";
    if (floatingMenu.visible && this._mode === "load") {
      floatingMenu.visible = false;
      return;
    }
    this._mode = "load";

    const allIDs = this.fragmentsIDs;

    for (const card of this.cards) {
      await card.dispose();
    }
    this.cards = [];

    for (const id of allIDs) {
      const card = new SimpleUICard(this.components, id);
      card.title = id;
      this.cards.push(card);

      const deleteCardButton = new Button(this.components, {
        materialIconName: "delete",
      });
      card.addChild(deleteCardButton);

      deleteCardButton.onClick.add(async () => {
        const ids = Object.values(this.getIDs(id));
        await this.delete(ids);
        const index = this.cards.indexOf(card);
        this.cards.splice(index, 1);
        await card.dispose();
      });

      const loadFileButton = new Button(this.components, {
        materialIconName: "download",
      });
      card.addChild(loadFileButton);

      loadFileButton.onClick.add(async () => {
        await this.getFragmentGroup(id);
        await this.onFileLoaded.trigger({ id });
      });

      floatingMenu.addChild(card);
    }

    floatingMenu.visible = true;
  }

  private async onSaveButtonClicked() {
    const floatingMenu = this.uiElement.get<FloatingWindow>("floatingMenu");
    const fragments = await this.components.tools.get(FragmentManager);

    floatingMenu.title = "Save items";
    if (floatingMenu.visible && this._mode === "save") {
      floatingMenu.visible = false;
      return;
    }
    this._mode = "save";
    for (const card of this.cards) {
      await card.dispose();
    }
    this.cards = [];

    const savedIDs = this.fragmentsIDs;

    const ids = fragments.groups.map((group) => group.uuid);
    for (const id of ids) {
      if (savedIDs.includes(id)) continue;

      const card = new SimpleUICard(this.components, id);
      card.title = id;
      this.cards.push(card);
      floatingMenu.addChild(card);

      const saveCardButton = new Button(this.components, {
        materialIconName: "save",
      });
      card.addChild(saveCardButton);

      saveCardButton.onClick.add(async () => {
        const group = fragments.groups.find((group) => group.uuid === id);

        if (group) {
          await this.saveFragmentGroup(group);
          const index = this.cards.indexOf(card);
          this.cards.splice(index, 1);
          await card.dispose();
          await this.onItemSaved.trigger({ id });
        }
      });
    }

    floatingMenu.visible = true;
  }

  private getIDs(id: string) {
    return {
      fragmentsCacheID: `${id}-fragments`,
      propertiesCacheID: `${id}-properties`,
    };
  }
}
