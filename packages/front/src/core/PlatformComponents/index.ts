import * as OBC from "@thatopen/components";

export class PlatformComponents extends OBC.Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "74c0c370-1af8-4ca9-900a-4a4196c0f2f5" as const;

  enabled = true;

  inputs = ["OBC", "BUI"];

  private readonly _requestEventID = "thatOpenCompanyComponentRequested";

  private readonly _createEventID = "thatOpenCompanyComponentCreated";

  constructor(components: OBC.Components) {
    super(components);
    components.add(PlatformComponents.uuid, this);
  }

  async import(componentSource: string) {
    return new Promise<OBC.ComponentWithUI>((resolve) => {
      const script = document.createElement("script");

      const src = `
        function main() {
          const { ${this.inputs} } = window.ThatOpenCompany;
        
          ${componentSource}
        
          const onComponentRequested = () => {
            window.removeEventListener("${this._requestEventID}", onComponentRequested);
            const event = new CustomEvent("${this._createEventID}", { detail: main });
            window.dispatchEvent(event);
          };
          
          window.addEventListener("${this._requestEventID}", onComponentRequested);
        }
        
        main();
      `;

      const onCreated = (event: any) => {
        window.removeEventListener(this._createEventID, onCreated);

        const ComponentClass = event.detail as new (
          components: OBC.Components,
        ) => OBC.ComponentWithUI;

        const component = this.components.get(ComponentClass);
        script.remove();
        resolve(component);
      };

      script.addEventListener("load", () => {
        window.addEventListener(this._createEventID, onCreated);
        window.dispatchEvent(new Event(this._requestEventID));
      });

      script.src = URL.createObjectURL(new File([src], "temp.js"));
      document.head.appendChild(script);
    });
  }
}
