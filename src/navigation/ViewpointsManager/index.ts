import { Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import {
  SimpleDimensionLine,
  LengthMeasurement,
} from "../../measurement/LengthMeasurement";
import { Components } from "../../core/Components";
import {
  UI,
  Component,
  Event,
  FragmentIdMap,
  UIElement,
} from "../../base-types";
import { Button, SimpleUICard, FloatingWindow } from "../../ui";

import { DrawManager } from "../../annotation";
import { OrthoPerspectiveCamera } from "../OrthoPerspectiveCamera";
import { CameraProjection } from "../OrthoPerspectiveCamera/src/types";
import { FragmentHighlighter } from "../../fragments";

// TODO: Update and implement memory disposal

export interface IViewpointsManagerConfig {
  selectionHighlighter: string;
  drawManager?: DrawManager;
}

export interface IViewpoint {
  guid: string;
  title: string;
  description: string | null;
  position: Vector3;
  target: Vector3;
  selection: FragmentIdMap;
  projection: CameraProjection;
  dimensions: { start: Vector3; end: Vector3 }[];
  filter?: { [groupSystem: string]: string };
  annotations?: SVGGElement;
}

export class ViewpointsManager extends Component<string> implements UI {
  //   private _fragmentManager: FragmentManager;
  //   private _fragmentGrouper: FragmentGrouper;
  private _drawManager?: DrawManager;
  name: string = "ViewpointsManager";

  uiElement = new UIElement<{
    main: Button;
    newButton: Button;
    window: FloatingWindow;
  }>();

  enabled: boolean = true;
  list: IViewpoint[] = [];
  selectionHighlighter = "";
  readonly onViewpointViewed = new Event<string>();
  readonly onViewpointAdded = new Event<string>();

  constructor(components: Components) {
    super(components);
    this.components = components;
  }

  initialize(config: IViewpointsManagerConfig) {
    this.selectionHighlighter = config.selectionHighlighter;
    // this._fragmentGrouper = config.fragmentGrouper;
    // this._fragmentManager = config.fragmentManager;
    this._drawManager = config.drawManager;
    if (this.components.uiEnabled) {
      this.setUI();
    }
  }

  private setUI() {
    const viewerContainer = this.components.renderer.get().domElement
      .parentElement as HTMLElement;
    const window = new FloatingWindow(this.components);
    window.title = "Viewpoints";
    viewerContainer.append(window.get());
    window.visible = false;
    const main = new Button(this.components, {
      materialIconName: "photo_camera",
    });
    const newButton = new Button(this.components, {
      materialIconName: "add",
      name: "New viewpoint",
    });
    const listButton = new Button(this.components, {
      materialIconName: "format_list_bulleted",
      name: "Viewpoints list",
    });
    listButton.onClick.add(() => {
      window.visible = !window.visible;
    });
    main.addChild(listButton, newButton);
    this.uiElement.set({ main, newButton, window });
  }

  get(): string {
    throw new Error("Method not implemented.");
  }

  async add(data: { title: string; description: string | null }) {
    const { title, description } = data;
    if (!title) {
      return undefined;
    }

    const guid = generateUUID().toLowerCase();

    // #region Store dimensions
    const dimensions: { start: Vector3; end: Vector3 }[] = [];
    const dimensionsComp = await this.components.tools.get(LengthMeasurement);
    const allDimensions = dimensionsComp.get();
    for (const dimension of allDimensions) {
      dimensions.push({ start: dimension.start, end: dimension.end });
    }
    // #endregion

    // #redgion Store selection
    const highlighter = await this.components.tools.get(FragmentHighlighter);
    const selection = highlighter.selection[this.selectionHighlighter];
    // #endregion

    // #region Store filter (WIP)
    // const filter = {entities: "IFCBEAM", storeys: "N07"}
    // #endregion

    // #region Store camera position and target
    const camera = this.components.camera as OrthoPerspectiveCamera;
    const controls = camera.controls;
    const target = new Vector3();
    const position = new Vector3();
    controls.getTarget(target);
    controls.getPosition(position);
    const projection = camera.getProjection();
    // #endregion

    // #region Store annotations
    const annotations = this._drawManager?.saveDrawing(guid);
    // #endregion

    const viewpoint: IViewpoint = {
      guid,
      title,
      target,
      position,
      selection,
      // filter,
      description,
      dimensions,
      annotations,
      projection,
    };

    // #region UI representation
    const card = new SimpleUICard(this.components, viewpoint.guid);
    card.title = title;
    card.description = description;
    card.domElement.onclick = () => this.view(viewpoint.guid);
    this.uiElement.get("window").addChild(card);
    // #endregion

    this.list.push(viewpoint);
    await this.onViewpointAdded.trigger(guid);
    return viewpoint;
  }

  retrieve(guid: string) {
    return this.list.find((v) => v.guid === guid);
  }

  async view(guid: string) {
    const viewpoint = this.retrieve(guid);
    if (!viewpoint) {
      return;
    }

    // #region Recover annotations
    if (this._drawManager && viewpoint.annotations) {
      this._drawManager.viewport.clear();
      this._drawManager.enabled = true;
      this._drawManager.viewport.get().append(viewpoint.annotations);
    }
    // #endregion

    // #region Recover dimensions
    const dimensionsComponent = this.components.tools.get(LengthMeasurement);

    viewpoint.dimensions.forEach((data) => {
      const dimension = new SimpleDimensionLine(this.components, {
        start: data.start,
        end: data.end,
        // @ts-ignore
        lineMaterial: dimensionsComponent._lineMaterial,
        // @ts-ignore
        endpoint: dimensionsComponent._endpointMesh,
      });
      dimension.createBoundingBox();
      // @ts-ignore
      dimensionsComponent._dimensions.push(dimension);
    });
    // #endregion

    // #region Recover filtered elements
    // if (viewpoint.filter) {
    //     const filterData = fragments.groups.get(viewpoint.filter)
    //     for (const fragmentID in fragments.list) {
    //         const fragment = fragments.list[fragmentID]
    //         fragment.setVisibility(fragment.items, false)
    //     }
    //     for (const fragmentID in filterData) {
    //         const ids = filterData[fragmentID]
    //         fragments.list[fragmentID]?.setVisibility(ids, true)
    //     }
    // }
    // #endregion

    // Select elements in the viewpoint
    const selection: { [fragmentID: string]: Set<string> } = {};
    for (const fragmentID in viewpoint.selection) {
      selection[fragmentID] = viewpoint.selection[fragmentID];
    }

    const highlighter = await this.components.tools.get(FragmentHighlighter);
    await highlighter.highlightByID(this.selectionHighlighter, selection, true);

    // #region Recover camera position & target
    const camera = this.components.camera as OrthoPerspectiveCamera;
    const controls = camera.controls;
    controls.setLookAt(
      viewpoint.position.x,
      viewpoint.position.y,
      viewpoint.position.z,
      viewpoint.target.x,
      viewpoint.target.y,
      viewpoint.target.z,
      true
    );
    await this.onViewpointViewed.trigger(guid);
    // #endregion
  }
}
