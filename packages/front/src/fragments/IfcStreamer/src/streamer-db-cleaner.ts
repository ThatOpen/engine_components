import { StreamFileDatabase } from "./streamer-db";

export class StreamerDbCleaner {
  interval = 10000;

  maxTime = 60000;

  list = new Map<string, number>();

  private _enabled = false;
  private _intervalId: number | null = null;
  private _fileCache: StreamFileDatabase;

  constructor(fileCache: StreamFileDatabase) {
    this._fileCache = fileCache;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    if (this._enabled === value) return;
    this._enabled = value;
    if (!value) {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
      }
      this._intervalId = null;
      return;
    }
    this._intervalId = setInterval(() => {
      const now = performance.now();
      for (const [id, time] of this.list) {
        const age = now - time;
        if (age > this.maxTime) {
          this.clean(id);
        }
      }
    }, this.interval);
  }

  update(id: string) {
    if (!this.enabled) return;
    // console.log(`Added to indexedDB: ${id}`);
    this.list.set(id, performance.now());
  }

  async clear() {
    for (const [id] of this.list) {
      this.clean(id);
    }
  }

  private clean(id: string) {
    try {
      this._fileCache.files.delete(id);
      // console.log(`Deleted from indexedDB: ${id}`);
    } catch (e) {
      console.log(`File not found in indexedDB: ${id}`);
    }
    this.list.delete(id);
  }
}
