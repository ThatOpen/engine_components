import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { FragmentHighlighter } from "../../fragments/FragmentHighlighter";
import { FragmentIdMap } from "../../base-types";
import { FragmentBoundingBox, FragmentManager } from "../../fragments";
import { SimpleCamera } from "../../core";

interface SelectionHandlerConfig {
  selectionName: string;
  selectionMaterial: THREE.Material;
  highlightName: string;
  highlightMaterial: THREE.Material;
}

export class SelectionHandler extends Component<FragmentIdMap> {
  name: string = "SelectionHandler";
  enabled: boolean = true;

  highlightEnabled = true;
  selectEnabled = true;
  multiple: "none" | "shiftKey" | "ctrlKey" = "none";
  zoomToSelection = false;
  zoomFactor = 1.5;

  private _components: Components;
  private _fragments: FragmentManager;
  private _fragmentHighlighter: FragmentHighlighter;
  private _config: SelectionHandlerConfig;
  private _bbox = new FragmentBoundingBox();

  constructor(
    components: Components,
    fragments: FragmentManager,
    fragmentHighlighter: FragmentHighlighter,
    config?: Partial<SelectionHandlerConfig>
  ) {
    super();
    this._components = components;
    this._fragments = fragments;
    this._fragmentHighlighter = fragmentHighlighter;

    this._config = {
      selectionName: config?.selectionName ?? "select",
      selectionMaterial:
        config?.selectionMaterial ??
        new THREE.MeshBasicMaterial({
          color: "#BCF124",
          transparent: true,
          opacity: 0.85,
          depthTest: true,
        }),
      highlightName: config?.highlightName ?? "hover",
      highlightMaterial:
        config?.highlightMaterial ??
        new THREE.MeshBasicMaterial({
          color: "#6528D7",
          transparent: true,
          opacity: 0.2,
          depthTest: true,
        }),
      ...config,
    };

    this.setup();
  }

  private get _viewerContainer() {
    const renderer = this._components.renderer.get();
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
      if (e.target !== this._components.renderer.get().domElement) return;
      mouseDown = false;
      if (mouseMoved || e.button !== 0) {
        mouseMoved = false;
        return;
      }
      mouseMoved = false;
      if (this.selectEnabled) {
        const mult = this.multiple === "none" ? true : !e[this.multiple];
        this._fragmentHighlighter.highlight(this._config.selectionName, mult);
      }

      if (this.zoomToSelection) {
        this.zoomSelection();
      }
    });

    this._viewerContainer.addEventListener("mousemove", () => {
      if (mouseMoved) {
        this._fragmentHighlighter.clear(this._config.highlightName);
        return;
      }
      mouseMoved = true;
      if (!mouseDown) {
        mouseMoved = false;
      }
      if (this.highlightEnabled) {
        this._fragmentHighlighter.highlight(this._config.highlightName);
      }
    });
  }

  private zoomSelection() {
    this._bbox.reset();
    const name = this._config.highlightName;
    const higlight = this._fragmentHighlighter.selection[name];
    if (!Object.keys(higlight).length) {
      return;
    }
    for (const fragID in higlight) {
      const fragment = this._fragments.list[fragID];
      const highlight = fragment.fragments[name];
      if (highlight) {
        this._bbox.addFragment(highlight);
      }
    }
    const sphere = this._bbox.getSphere();
    sphere.radius *= this.zoomFactor;
    const camera = this._components.camera as SimpleCamera;
    camera.controls.fitToSphere(sphere, true);
  }

  get(): FragmentIdMap {
    return this._fragmentHighlighter.selection.select;
  }
}
