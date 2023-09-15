import { SimpleUIComponent } from "../ui";

/**
 * A simple object to handle UI components.
 */
export class UIElement<T extends { [value: string]: SimpleUIComponent }> {
  private _data: T | null = null;
  private readonly initError = "UI Components not initialized.";

  get<U = SimpleUIComponent>(name: keyof T): U {
    if (!this._data) {
      throw new Error(this.initError);
    }
    return this._data[name] as U;
  }

  set(data: T) {
    this._data = data;
  }

  dispose() {
    if (!this._data) return;
    for (const name in this._data) {
      const uiComponent = this._data[name];
      uiComponent.dispose();
    }
    this._data = null;
  }
}
