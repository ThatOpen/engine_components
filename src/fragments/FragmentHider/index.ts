import { Fragment } from "bim-fragment";
import { FragmentManager } from "../FragmentManager";
import { ScreenCuller } from "../../core";
import { Component, Disposable } from "../../base-types";

export class FragmentHider extends Component<void> implements Disposable {
  name = "FragmentHider";
  enabled = true;

  private _fragments: FragmentManager;
  private _culler?: ScreenCuller;

  constructor(fragments: FragmentManager, culler?: ScreenCuller) {
    super();
    this._fragments = fragments;
    this._culler = culler;
  }

  dispose() {
    (this._fragments as any) = null;
    (this._culler as any) = null;
  }

  set(visible: boolean, items?: { [id: string]: string[] }) {
    if (!items) {
      for (const id in this._fragments.list) {
        const fragment = this._fragments.list[id];
        if (fragment) {
          fragment.setVisibility(visible);
          this.updateCulledVisibility(fragment);
        }
      }
    }
    for (const fragID in items) {
      const ids = items[fragID];
      const fragment = this._fragments.list[fragID];
      fragment.setVisibility(visible, ids);
      this.updateCulledVisibility(fragment);
    }
  }

  isolate(items: { [id: string]: string[] }) {
    this.set(false);
    this.set(true, items);
  }

  get() {}

  private updateCulledVisibility(fragment: Fragment) {
    if (this._culler) {
      const culled = this._culler.colorMeshes.get(fragment.id);
      if (culled) {
        culled.count = fragment.mesh.count;
      }
    }
  }
}
