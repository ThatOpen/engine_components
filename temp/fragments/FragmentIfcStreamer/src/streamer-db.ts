import Dexie from "dexie";

interface IStreamedFile {
  id: string;
  file: Uint8Array;
}

export class StreamFileDatabase extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instantiated by Dexie in stores() method)
  files!: Dexie.Table<IStreamedFile, string>; // number = type of the primkey

  constructor() {
    super("MyAppDatabase");
    this.version(1).stores({
      files: "id, file",
    });
  }
}
