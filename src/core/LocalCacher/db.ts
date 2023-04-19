import { Dexie } from "dexie";

interface IFile {
  id: string;
  file: Blob;
}

export class ModelDatabase extends Dexie {
  models!: Dexie.Table<IFile, number>;

  constructor() {
    super("ModelDatabase");
    this.version(2).stores({
      models: "id, file",
    });
  }
}
