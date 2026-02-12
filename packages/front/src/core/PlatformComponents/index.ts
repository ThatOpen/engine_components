import * as OBC from "@thatopen/components";

export class PlatformComponents extends OBC.Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "74c0c370-1af8-4ca9-900a-4a4196c0f2f5" as const;

  enabled = true;

  inputs = ["OBC", "BUI"];

  constructor(components: OBC.Components) {
    super(components);
    components.add(PlatformComponents.uuid, this);
  }

  import<T extends OBC.Component = OBC.Component>(
    componentSource: string,
  ): T | null {
    const globals = (window as any).ThatOpenCompany ?? {};
    const keys = this.inputs;
    const values = keys.map((k) => globals[k]);

    // Execute the component source with the required globals in scope.
    // The source is expected to declare a `main` variable with a
    // `componentDefinition` property pointing to the OBC.Component class.
    // eslint-disable-next-line no-new-func
    const factory = new Function(...keys, `${componentSource}\nreturn main;`);
    const main = factory(...values);

    const componentDefinition = main?.componentDefinition ?? main;
    if (!componentDefinition) return null;

    const ComponentClass = componentDefinition as new (
      components: OBC.Components,
    ) => T;

    return this.components.get(ComponentClass);
  }
}
