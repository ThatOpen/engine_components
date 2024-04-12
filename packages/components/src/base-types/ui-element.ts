import { SimpleUIComponent } from "../ui";

/**
 * A simple object to handle UI components. You can use the generic constructor
 * to specify the types of your UI components.
 */
export class UIElement<T extends { [value: string]: SimpleUIComponent }> {
  private _data: T | null = null;
  private readonly initError = "UI Components not initialized.";

  /**
   * Gets the UI Component with the given name. If it doesn't exist, it will
   * throw an error.
   *
   * @param name the identifier of the UI component.
   */
  get<U = SimpleUIComponent>(name: keyof T): U {
    if (!this._data) {
      throw new Error(this.initError);
    }
    return this._data[name] as U;
  }

  /**
   * Sets all the UI components of this instance.
   *
   * @param data all the UI components sorted by name in an object.
   */
  set(data: T) {
    this._data = data;
  }

  /**
   * Release all the memory used by this instance deleting all the UI components
   * inside.
   */
  async dispose() {
    if (!this._data) return;
    for (const name in this._data) {
      const uiComponent = this._data[name];
      await uiComponent.dispose();
    }
    this._data = null;
  }
}
