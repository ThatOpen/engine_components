import { ModelDatabase } from "./db";

export class LocalCacher {
  private _db: ModelDatabase;
  private readonly _storedModels = "open-bim-components-stored-files";

  constructor() {
    this._db = new ModelDatabase();
  }

  async get(id: string) {
    if (this.exists(id)) {
      await this._db.open();
      const result = await this.getModelFromLocalCache(id);
      this._db.close();
      return result;
    }

    return null;
  }

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

  exists(id: string) {
    const stored = localStorage.getItem(id);
    return stored !== null;
  }

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

  async deleteAll() {
    await this._db.open();
    this.clearStoredIDs();
    await this._db.delete();
    this._db = new ModelDatabase();
    this._db.close();
  }

  private async getModelFromLocalCache(id: string) {
    const found = await this._db.models.where("id").equals(id).toArray();
    return found[0].file;
  }

  private clearStoredIDs() {
    const ids = this.getStoredIDs();
    for (const id of ids) {
      this.removeStoredID(id);
    }
  }

  private removeStoredID(id: string) {
    localStorage.removeItem(id);
    const ids = this.getStoredIDs().filter((savedId) => savedId !== id);
    this.setStoredIDs(ids);
  }

  private addStoredID(id: string) {
    const time = performance.now().toString();
    localStorage.setItem(id, time);
    const ids = this.getStoredIDs();
    ids.push(id);
    this.setStoredIDs(ids);
  }

  private getStoredIDs() {
    const serialized = localStorage.getItem(this._storedModels) || "[]";
    return JSON.parse(serialized) as string[];
  }

  private setStoredIDs(ids: string[]) {
    localStorage.setItem(this._storedModels, JSON.stringify(ids));
  }
}
