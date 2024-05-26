import * as FRAGS from "@thatopen/fragments";
import { FragmentsManager } from "../FragmentsManager";
import { Components, Component, Cullers } from "../../core";

export class Hider extends Component {
  static readonly uuid = "dd9ccf2d-8a21-4821-b7f6-2949add16a29" as const;

  enabled = true;

  constructor(components: Components) {
    super(components);

    this.components.add(Hider.uuid, this);
  }

  set(visible: boolean, items?: FRAGS.FragmentIdMap) {
    const fragments = this.components.get(FragmentsManager);
    if (!items) {
      for (const id in fragments.list) {
        const fragment = fragments.list.get(id);
        if (fragment) {
          fragment.setVisibility(visible);
          this.updateCulledVisibility(fragment);
        }
      }
      return;
    }
    for (const fragID in items) {
      const ids = items[fragID];
      const fragment = fragments.list.get(fragID);

      if (fragment) {
        fragment.setVisibility(visible, ids);
        this.updateCulledVisibility(fragment);
      }
    }
  }

  isolate(items: FRAGS.FragmentIdMap) {
    this.set(false);
    this.set(true, items);
  }

  private updateCulledVisibility(fragment: FRAGS.Fragment) {
    // TODO: This affects all worlds. Should we make it more granular?
    const cullers = this.components.get(Cullers);
    for (const [_id, culler] of cullers.list) {
      const culled = culler.colorMeshes.get(fragment.id);
      if (culled) {
        culled.count = fragment.mesh.count;
      }
    }
  }
}
