class PlatformComponent extends OBC.ComponentWithUI {
  static uuid = "392b7198-0193-4364-8b89-dfad1b386c50";

  onDisposed = new OBC.Event();

  enabled = true;

  name = "Mock Personal Component";

  _uiElements = new Set();

  constructor(components) {
    super(components);
    this.components.add(PlatformComponent.uuid, this);
  }

  getUI() {
    console.log("Hello from personal component!");
    return [
      {
        name: "Panel",
        id: "panel",
        icon: "",
        componentID: PlatformComponent.uuid,
        get: () => {
          const panel = BUI.Component.create(() => {
            return BUI.html`
              <bim-panel></bim-panel> 
            `;
          });
          this._uiElements.add(panel);
          return { element: panel };
        }
      }
    ];
  }

  dispose() {
    for (const element of this._uiElements) {
      element.remove();
    }
    this._uiElements.clear();
  }
}

const main = PlatformComponent;