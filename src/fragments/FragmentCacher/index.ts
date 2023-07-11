import { FragmentsGroup } from "bim-fragment";
import { Components, LocalCacher } from "../../core";
import { FragmentManager } from "../FragmentManager";
import { Button, SimpleUICard } from "../../ui";

// TODO: Clean up

export class FragmentCacher extends LocalCacher {
  private _fragments: FragmentManager;
  private _mode: "save" | "load" | "none" = "none";

  get fragmentsIDs() {
    const allIDs = this.ids;
    const fragIDs = allIDs.filter((id) => id.includes("-fragments"));
    if (!fragIDs.length) return fragIDs;
    return fragIDs.map((id) => id.replace("-fragments", ""));
  }

  constructor(components: Components, fragments: FragmentManager) {
    super(components);
    this._fragments = fragments;

    this.saveButton.onclick = () => {
      this.floatingMenu.title = "Save items";
      if (this.floatingMenu.visible && this._mode === "save") {
        this.floatingMenu.visible = false;
        return;
      }
      this._mode = "save";
      for (const card of this._cards) {
        card.dispose();
      }
      this._cards = [];

      const savedIDs = this.fragmentsIDs;

      const ids = this._fragments.groups.map((group) => group.uuid);
      for (const id of ids) {
        if (savedIDs.includes(id)) continue;

        const card = new SimpleUICard(this._components, {
          title: id,
          id,
        });
        this._cards.push(card);
        this.floatingMenu.addChild(card);

        const saveCardButton = new Button(this._components, {
          materialIconName: "save",
        });
        card.addChild(saveCardButton);

        saveCardButton.onclick = async () => {
          const group = this._fragments.groups.find(
            (group) => group.uuid === id
          );

          if (group) {
            await this.saveFragmentGroup(group);
            const index = this._cards.indexOf(card);
            this._cards.splice(index, 1);
            card.dispose();
            this.itemSaved.trigger({ id });
          }
        };
      }
      this.floatingMenu.visible = true;
    };

    this.loadButton.onclick = () => {
      this.floatingMenu.title = "Load saved items";
      if (this.floatingMenu.visible && this._mode === "load") {
        this.floatingMenu.visible = false;
        return;
      }
      this._mode = "load";

      const allIDs = this.fragmentsIDs;

      for (const card of this._cards) {
        card.dispose();
      }
      this._cards = [];

      for (const id of allIDs) {
        const card = new SimpleUICard(this._components, {
          title: id,
          id,
        });
        this._cards.push(card);

        const deleteCardButton = new Button(this._components, {
          materialIconName: "delete",
        });
        card.addChild(deleteCardButton);

        deleteCardButton.onclick = async () => {
          const ids = Object.values(this.getIDs(id));
          await this.delete(ids);
          const index = this._cards.indexOf(card);
          this._cards.splice(index, 1);
          card.dispose();
        };

        const loadFileButton = new Button(this._components, {
          materialIconName: "download",
        });
        card.addChild(loadFileButton);

        loadFileButton.onclick = async () => {
          await this.getFragmentGroup(id);
          this.fileLoaded.trigger({ id });
        };

        this.floatingMenu.addChild(card);
      }

      this.floatingMenu.visible = true;
    };
  }

  async getFragmentGroup(id: string) {
    const { fragmentsCacheID, propertiesCacheID } = this.getIDs(id);

    if (!fragmentsCacheID || !propertiesCacheID) {
      return null;
    }

    const fragmentFile = await this.get(fragmentsCacheID);
    if (fragmentFile === null) {
      throw new Error("Loading error");
    }

    const fragmentsData = await fragmentFile.arrayBuffer();
    const buffer = new Uint8Array(fragmentsData);
    const group = this._fragments.load(buffer);

    const propertiesFile = await this.get(propertiesCacheID);
    if (propertiesFile !== null) {
      const propertiesData = await propertiesFile.text();
      group.properties = JSON.parse(propertiesData);
    }

    this._components.scene.get().add(group);
    return group;
  }

  async saveFragmentGroup(group: FragmentsGroup, id = group.uuid) {
    const fragments = new FragmentManager(this._components);

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

  dispose() {
    super.dispose();
    (this._fragments as any) = null;
  }

  private getIDs(id: string) {
    return {
      fragmentsCacheID: `${id}-fragments`,
      propertiesCacheID: `${id}-properties`,
    };
  }
}
