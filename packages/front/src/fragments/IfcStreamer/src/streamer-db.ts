import Dexie from "dexie";

/**
 * Interface representing a streamed file.
 */
interface IStreamedFile {
  /**
   * Unique identifier for the file.
   */
  id: string;

  /**
   * The file content as a Uint8Array.
   */
  file: Uint8Array;
}

/**
 * A class representing a database for storing streamed files. It extends Dexie, a minimalistic wrapper for IndexedDB.
 */
export class StreamFileDatabase extends Dexie {
  /**
   * Declare implicit table properties.
   * (Just to inform Typescript. Instantiated by Dexie in stores() method)
   * @type {Dexie.Table<IStreamedFile, string>}
   */
  files!: Dexie.Table<IStreamedFile, string>; // number = type of the primkey

  constructor() {
    super("MyAppDatabase");
    this.version(1).stores({
      files: "id, file",
    });
  }
}
