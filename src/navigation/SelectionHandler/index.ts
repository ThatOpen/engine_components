import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import {
  HighlightMap,
  FragmentHighlighter,
} from "../../fragments/FragmentHighlighter";

interface SelectionHandlerConfig {
  selectionName: string;
  selectionMaterial: THREE.Material;
  highlightName: string;
  highlightMaterial: THREE.Material;
}

export class SelectionHandler extends Component<HighlightMap> {
  name: string = "SelectionHandler";
  enabled: boolean = true;
  components: Components;
  private _fragmentHighlighter: FragmentHighlighter;
  private _config: SelectionHandlerConfig;

  constructor(
    components: Components,
    fragmentHighlighter: FragmentHighlighter,
    config?: Partial<SelectionHandlerConfig>
  ) {
    super();
    this._config = {
      selectionName: "select",
      selectionMaterial:
        config?.selectionMaterial ??
        new THREE.MeshBasicMaterial({
          color: "#BCF124",
          transparent: true,
          opacity: 0.6,
          depthTest: true,
        }),
      highlightName: "highlight",
      highlightMaterial:
        config?.selectionMaterial ??
        new THREE.MeshBasicMaterial({
          color: "#6528D7",
          transparent: true,
          opacity: 0.2,
          depthTest: true,
        }),
      ...config,
    };
    this.components = components;
    this._fragmentHighlighter = fragmentHighlighter;
    this.setup();
  }

  private get _viewerContainer() {
    const renderer = this.components.renderer.get();
    return renderer.domElement.parentElement as HTMLElement;
  }

  private setup() {
    this._fragmentHighlighter.enabled = true;

    this._fragmentHighlighter.add(this._config.selectionName, [
      this._config.selectionMaterial,
    ]);

    this._fragmentHighlighter.add(this._config.highlightName, [
      this._config.highlightMaterial,
    ]);

    let mouseDown = false;
    let mouseMoved = false;

    this._viewerContainer.addEventListener("mousedown", () => {
      mouseDown = true;
    });

    this._viewerContainer.addEventListener("mouseup", (e) => {
      if (e.target !== this.components.renderer.get().domElement) {
        return;
      }
      mouseDown = false;
      if (mouseMoved || e.button !== 0) {
        mouseMoved = false;
        return;
      }
      mouseMoved = false;
      this._fragmentHighlighter.highlight(
        this._config.selectionName,
        !e.ctrlKey
      );
    });

    this._viewerContainer.addEventListener("mousemove", () => {
      if (mouseMoved) {
        this._fragmentHighlighter.clear(this._config.highlightName);
        return;
      }
      this._fragmentHighlighter.highlight(this._config.highlightName);
      mouseMoved = true;
      if (!mouseDown) {
        mouseMoved = false;
      }
    });
  }

  get(): HighlightMap {
    return this._fragmentHighlighter.selection.select;
  }
}
