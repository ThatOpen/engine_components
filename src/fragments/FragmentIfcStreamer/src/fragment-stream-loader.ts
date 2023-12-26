import { Component } from "../../../base-types";
import { StreamedAsset, StreamedGeometries } from "./base-types";
import { Components, ToolComponent } from "../../../core";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";

export class FragmentStreamLoader extends Component<any> {
  enabled = true;

  culler: GeometryCullerRenderer;

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentStreamLoader.uuid, this);

    this.culler = new GeometryCullerRenderer(components);
  }

  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  async load(assets: StreamedAsset[], geometries: StreamedGeometries) {
    this.culler.add("modelID", assets, geometries);
  }

  get() {}

  update() {}
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
