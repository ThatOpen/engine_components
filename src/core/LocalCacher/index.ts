import { ModelDatabase } from "./db";
import { Component, Disposable, UI, Event, UIElement } from "../../base-types";
import { Button, FloatingWindow, SimpleUICard } from "../../ui";
import { Components } from "../Components";
import { ToolComponent } from "../ToolsComponent";

// TODO: Implement UI elements (this is probably just for 3d scans)

/**
 * A tool to cache files using the browser's IndexedDB API. This might
 * save loading time and infrastructure costs for files that need to be
 * fetched from the cloud.
 */
export class LocalCacher extends Component<any> implements UI, Disposable {
  static readonly uuid = "22ae591a-3a67-4988-86c6-68d7b83febf2" as const;

  /** Fires when a file has been loaded from cache. */
  readonly onFileLoaded = new Event<{ id: string }>();

  /** Fires when a file has been saved into cache. */
  readonly onItemSaved = new Event<{ id: string }>();

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link UI.uiElement} */
  uiElement = new UIElement<{
    main: Button;
    saveButton: Button;
    loadButton: Button;
    floatingMenu: FloatingWindow;
  }>();

  protected cards: SimpleUICard[] = [];

  private _db: ModelDatabase;
  private readonly _storedModels = "open-bim-components-stored-files";

  /** The IDs of all the stored files. */
  get ids() {
    const serialized = localStorage.getItem(this._storedModels) || "[]";
    return JSON.parse(serialized) as string[];
  }

  constructor(components: Components) {
    super(components);
    components.tools.add(LocalCacher.uuid, this);
    this._db = new ModelDatabase();
    if (components.uiEnabled) {
      this.setUI(components);
    }
  }

  /**
   * {@link Component.get}.
   * @param id the ID of the file to fetch.
   */
  async get(id: string) {
    if (this.exists(id)) {
      await this._db.open();
      const result = await this.getModelFromLocalCache(id);
      this._db.close();
      return result;
    }

    return null;
  }

  /**
   * Saves the file with the given ID.
   * @param id the ID to assign to the file.
   * @param url the URL where the file is located.
   */
  async save(id: string, url: string) {
    this.addStoredID(id);
    const rawData = await fetch(url);
    const file = await rawData.blob();
    await this._db.open();
    await this._db.models.add({
      id,
      file,
    });
    this._db.close();
  }

  /**
   * Checks if there's a file stored with the given ID.
   * @param id to check.
   */
  exists(id: string) {
    const stored = localStorage.getItem(id);
    return stored !== null;
  }

  /**
   * Deletes the files stored in the given ids.
   * @param ids the identifiers of the files to delete.
   */
  async delete(ids: string[]) {
    await this._db.open();
    for (const id of ids) {
      if (this.exists(id)) {
        this.removeStoredID(id);
        await this._db.models.where("id").equals(id).delete();
      }
    }
    this._db.close();
  }

  /** Deletes all the stored files. */
  async deleteAll() {
    await this._db.open();
    this.clearStoredIDs();
    await this._db.delete();
    this._db = new ModelDatabase();
    this._db.close();
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this.onFileLoaded.reset();
    this.onItemSaved.reset();
    for (const card of this.cards) {
      await card.dispose();
    }
    this.cards = [];
    await this.uiElement.dispose();
    (this._db as any) = null;
  }

  private setUI(components: Components) {
    const main = new Button(components);
    main.materialIcon = "storage";
    main.tooltip = "Local cacher";

    const saveButton = new Button(components);
    saveButton.label = "Save";
    saveButton.materialIcon = "save";

    const loadButton = new Button(components);
    loadButton.label = "Download";
    loadButton.materialIcon = "download";

    main.addChild(saveButton, loadButton);

    const floatingMenu = new FloatingWindow(components, "file-list-menu");
    this.uiElement.set({ main, loadButton, saveButton, floatingMenu });

    floatingMenu.title = "Saved Files";
    floatingMenu.visible = false;
    const savedFilesMenuHTML = floatingMenu.get();
    savedFilesMenuHTML.style.left = "70px";
    savedFilesMenuHTML.style.top = "100px";
    savedFilesMenuHTML.style.width = "340px";
    savedFilesMenuHTML.style.height = "400px";

    const renderer = this.components.renderer.get();
    const viewerContainer = renderer.domElement.parentElement as HTMLElement;
    viewerContainer.appendChild(floatingMenu.get());
  }

  private async getModelFromLocalCache(id: string) {
    const found = await this._db.models.where("id").equals(id).toArray();
    return found[0].file;
  }

  private clearStoredIDs() {
    const ids = this.ids;
    for (const id of ids) {
      this.removeStoredID(id);
    }
  }

  private removeStoredID(id: string) {
    localStorage.removeItem(id);
    const allIDs = this.ids;
    const ids = allIDs.filter((savedId) => savedId !== id);
    this.setStoredIDs(ids);
  }

  private addStoredID(id: string) {
    const time = performance.now().toString();
    localStorage.setItem(id, time);
    const ids = this.ids;
    ids.push(id);
    this.setStoredIDs(ids);
  }

  private setStoredIDs(ids: string[]) {
    localStorage.setItem(this._storedModels, JSON.stringify(ids));
  }
}

ToolComponent.libraryUUIDs.add(LocalCacher.uuid);
