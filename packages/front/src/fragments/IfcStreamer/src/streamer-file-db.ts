export class StreamerFileDb {
  baseDirectory = "that-open-company-streaming";

  maxDeadTime = 60000;

  private _memoryCleanTime = 10000;

  get memoryCleanTime() {
    return this._memoryCleanTime;
  }

  set memoryCleanTime(value: number) {
    this._memoryCleanTime = value;
    this.dispose();
    this.setupMemoryCleanup();
  }

  private _intervalID: number | null = null;

  private _isCleaningMemory = false;

  constructor() {
    this.setupMemoryCleanup();
  }

  async get(name: string) {
    const encodedName = this.encodeName(name);
    const baseDir = await this.getDir(this.baseDirectory);
    try {
      const fileHandle = await baseDir.getFileHandle(encodedName);
      const file = await fileHandle.getFile();
      this.updateLastAccessTime(encodedName);
      const buffer = await file.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (e) {
      return null;
    }
  }

  async add(name: string, buffer: Uint8Array) {
    const encodedName = this.encodeName(name);
    const baseDir = await this.getDir(this.baseDirectory);
    const fileHandle = await baseDir.getFileHandle(encodedName, {
      create: true,
    });

    const writable = await fileHandle.createWritable();
    await writable.write(buffer);
    await writable.close();
    this.updateLastAccessTime(encodedName);
  }

  async clear() {
    const baseDir = await this.getDir(this.baseDirectory);
    // @ts-ignore
    for await (const [name] of baseDir.entries()) {
      await baseDir.removeEntry(name);
    }
  }

  dispose() {
    if (this._intervalID !== null) {
      window.clearInterval(this._intervalID);
    }
  }

  private setupMemoryCleanup() {
    this._intervalID = window.setInterval(
      this.cleanMemory,
      this.memoryCleanTime,
    );
  }

  private cleanMemory = async () => {
    if (this._isCleaningMemory) {
      return;
    }
    this._isCleaningMemory = true;

    const rootDir = await this.getDir(this.baseDirectory);

    const filesToDelete = new Set<string>();

    const now = new Date().getTime();

    // @ts-ignore
    for await (const entry of rootDir.values()) {
      const serializedLastAccessed = localStorage.getItem(entry.name) || "0";
      const lastAccess = parseInt(serializedLastAccessed, 10);

      const deadTime = now - lastAccess;

      if (deadTime > this.maxDeadTime) {
        filesToDelete.add(entry.name);
        localStorage.removeItem(entry.name);
      }
    }

    for (const name of filesToDelete) {
      console.log(`deleted: ${name}`);
      rootDir.removeEntry(name);
    }

    this._isCleaningMemory = false;
  };

  private async getDir(path: string) {
    const root = await navigator.storage.getDirectory();
    return root.getDirectoryHandle(path, {
      create: true,
    });
  }

  private encodeName(name: string) {
    const illegalChars = /[\\/:*?"<>|]/g;
    return name.replace(illegalChars, "ñ");
  }

  private updateLastAccessTime(encodedName: string) {
    const now = new Date().getTime().toString();
    localStorage.setItem(encodedName, now);
  }
}
