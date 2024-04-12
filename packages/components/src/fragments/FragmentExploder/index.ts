import * as THREE from "three";
import { Component, Disposable, UI, UIElement, Event } from "../../base-types";
import { Button } from "../../ui";
import { Components, ToolComponent } from "../../core";
import { FragmentClassifier } from "../FragmentClassifier";
import { FragmentManager } from "../FragmentManager";

// TODO: Clean up and document

export class FragmentExploder
  extends Component<Set<string>>
  implements Disposable, UI
{
  static readonly uuid = "d260618b-ce88-4c7d-826c-6debb91de3e2" as const;

  enabled = false;

  height = 10;
  groupName = "storeys";

  uiElement = new UIElement<{ main: Button }>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  private _explodedFragments = new Set<string>();

  get(): Set<string> {
    return this._explodedFragments;
  }

  constructor(components: Components) {
    super(components);

    components.tools.add(FragmentExploder.uuid, this);

    if (components.uiEnabled) {
      this.setupUI(components);
    }
  }

  async dispose() {
    this._explodedFragments.clear();
    await this.uiElement.dispose();
    await this.onDisposed.trigger(FragmentExploder.uuid);
    this.onDisposed.reset();
  }

  explode() {
    this.enabled = true;
    this.update();
  }

  reset() {
    this.enabled = false;
    this.update();
  }

  update() {
    const classifier = this.components.tools.get(FragmentClassifier);
    const fragments = this.components.tools.get(FragmentManager);

    const factor = this.enabled ? 1 : -1;
    let i = 0;

    const systems = classifier.get();
    const groups = systems[this.groupName];

    const yTransform = new THREE.Matrix4();

    for (const groupName in groups) {
      yTransform.elements[13] = i * factor * this.height;
      for (const fragID in groups[groupName]) {
        const fragment = fragments.list[fragID];
        const itemsID = groupName + fragID;
        const areItemsExploded = this._explodedFragments.has(itemsID);
        if (
          !fragment ||
          (this.enabled && areItemsExploded) ||
          (!this.enabled && !areItemsExploded)
        ) {
          continue;
        }
        if (this.enabled) {
          this._explodedFragments.add(itemsID);
        } else {
          this._explodedFragments.delete(itemsID);
        }

        const ids = groups[groupName][fragID];
        fragment.applyTransform(ids, yTransform);
      }
      i++;
    }
  }

  private setupUI(components: Components) {
    const main = new Button(components);
    this.uiElement.set({ main });
    main.tooltip = "Explode";
    main.materialIcon = "splitscreen";
    main.onClick.add(async () => {
      if (this.enabled) {
        this.reset();
      } else {
        this.explode();
      }
    });
  }
}

ToolComponent.libraryUUIDs.add(FragmentExploder.uuid);
