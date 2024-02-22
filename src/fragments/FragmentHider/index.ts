import { Fragment } from "bim-fragment";
import { FragmentManager } from "../FragmentManager";
import { Components, ScreenCuller, ToolComponent } from "../../core";
import {
  Component,
  Disposable,
  FragmentIdMap,
  UI,
  UIElement,
  Event,
} from "../../base-types";
import {
  Button,
  CheckboxInput,
  FloatingWindow,
  SimpleUIComponent,
  TextInput,
} from "../../ui";
import { IfcPropertiesFinder } from "../../ifc";
import { QueryBuilder } from "../../ifc/IfcPropertiesFinder/src/query-builder";

interface FilterData {
  name: string;
  id: string;
  visible: boolean;
  enabled: boolean;
}

export class FragmentHider extends Component<void> implements Disposable, UI {
  static readonly uuid = "dd9ccf2d-8a21-4821-b7f6-2949add16a29" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  enabled = true;

  uiElement = new UIElement<{
    main: Button;
    window: FloatingWindow;
  }>();

  private _localStorageID = "FragmentHiderCache";
  private _updateVisibilityOnFound = true;

  private _filterCards: {
    [id: string]: {
      styleCard: SimpleUIComponent<any>;
      name: TextInput;
      finder: IfcPropertiesFinder;
      fragments: FragmentIdMap;
      deleteButton: Button;
      visible: CheckboxInput;
      enabled: CheckboxInput;
    };
  } = {};

  constructor(components: Components) {
    super(components);

    this.components.tools.add(FragmentHider.uuid, this);

    if (components.uiEnabled) {
      this.setupUI(components);
    }
  }

  private setupUI(components: Components) {
    const mainWindow = new FloatingWindow(components);
    mainWindow.title = "Filters";

    mainWindow.visible = false;
    components.ui.add(mainWindow);

    mainWindow.domElement.style.width = "530px";
    mainWindow.domElement.style.height = "400px";

    const mainButton = new Button(components, {
      materialIconName: "filter_alt",
      tooltip: "Visibility filters",
    });

    mainButton.onClick.add(() => {
      this.hideAllFinders();
      mainWindow.visible = !mainWindow.visible;
    });

    const topButtonContainerHtml = `<div class="flex"></div>`;
    const topButtonContainer = new SimpleUIComponent(
      components,
      topButtonContainerHtml
    );

    const createButton = new Button(components, {
      materialIconName: "add",
    });
    createButton.onClick.add(() => this.createStyleCard());
    topButtonContainer.addChild(createButton);
    mainWindow.addChild(topButtonContainer);

    this.uiElement.set({ window: mainWindow, main: mainButton });
  }

  async dispose() {
    this.uiElement.dispose();
    await this.onDisposed.trigger(FragmentHider.uuid);
    this.onDisposed.reset();
  }

  set(visible: boolean, items?: FragmentIdMap) {
    const fragments = this.components.tools.get(FragmentManager);
    if (!items) {
      for (const id in fragments.list) {
        const fragment = fragments.list[id];
        if (fragment) {
          fragment.setVisibility(visible);
          this.updateCulledVisibility(fragment);
        }
      }
      return;
    }
    for (const fragID in items) {
      const ids = items[fragID];
      const fragment = fragments.list[fragID];
      fragment.setVisibility(visible, ids);
      this.updateCulledVisibility(fragment);
    }
  }

  isolate(items: FragmentIdMap) {
    this.set(false);
    this.set(true, items);
  }

  get() {}

  async update() {
    this._updateVisibilityOnFound = false;
    for (const id in this._filterCards) {
      const { finder } = this._filterCards[id];
      await finder.find();
    }
    this._updateVisibilityOnFound = true;
    this.updateQueries();
  }

  async loadCached() {
    const serialized = localStorage.getItem(this._localStorageID);
    if (!serialized) return;
    const filters = JSON.parse(serialized) as FilterData[];
    for (const filter of filters) {
      this.createStyleCard(filter);
    }
    await this.update();
  }

  private updateCulledVisibility(fragment: Fragment) {
    const culler = this.components.tools.get(ScreenCuller);
    if (!culler.isSetup) {
      return;
    }
    const colorMeshes = culler.get();
    const culled = colorMeshes.get(fragment.id);
    if (culled) {
      culled.count = fragment.mesh.count;
    }
  }

  private createStyleCard(config?: FilterData) {
    const filterCard = new SimpleUIComponent(this.components);
    if (config && config.id.length) {
      filterCard.id = config.id;
    }
    const { id } = filterCard;

    filterCard.domElement.className = `m-4 p-4 border-1 border-solid border-[#3A444E] rounded-md flex flex-col`;

    filterCard.domElement.innerHTML = `
        <div id="top-container-${id}" class="flex">
        </div>
        <div id="bottom-container-${id}" class="flex gap-4 items-center">
        </div>
    `;

    const deleteButton = new Button(this.components, {
      materialIconName: "close",
    });

    deleteButton.domElement.classList.add("self-end");
    deleteButton.onClick.add(() => this.deleteStyleCard(id));

    const topContainer = filterCard.getInnerElement("top-container");
    if (topContainer) {
      topContainer.appendChild(deleteButton.domElement);
    }

    const bottomContainer = filterCard.getInnerElement("bottom-container");
    if (!bottomContainer) {
      throw new Error("Error creating UI elements!");
    }

    const name = new TextInput(this.components);
    name.label = "Name";
    name.domElement.addEventListener("focusout", () => {
      this.cache();
    });

    if (config) {
      name.value = config.name;
    }

    bottomContainer.append(name.domElement);

    const visible = new CheckboxInput(this.components);
    visible.value = config ? config.visible : true;
    visible.label = "Visible";
    visible.onChange.add(() => this.updateQueries());

    const enabled = new CheckboxInput(this.components);
    enabled.value = config ? config.enabled : true;
    enabled.label = "Enabled";
    enabled.onChange.add(() => this.updateQueries());

    const checkBoxContainer = new SimpleUIComponent(this.components);
    checkBoxContainer.domElement.classList.remove("w-full");
    checkBoxContainer.addChild(visible);
    checkBoxContainer.addChild(enabled);
    bottomContainer.append(checkBoxContainer.domElement);

    const finder = new IfcPropertiesFinder(this.components);
    finder.init();
    finder.loadCached(id);

    const queryBuilder = finder.uiElement.get<QueryBuilder>("query");
    const mainButton = finder.uiElement.get("main");
    const finderWindow = finder.uiElement.get("queryWindow");
    queryBuilder.findButton.label = "Apply";

    bottomContainer.append(mainButton.domElement);

    finderWindow.onVisible.add(() => {
      this.hideAllFinders(finderWindow.id);
      const rect = mainButton.domElement.getBoundingClientRect();
      finderWindow.domElement.style.left = `${rect.x + 90}px`;
      finderWindow.domElement.style.top = `${rect.y - 120}px`;
    });

    finder.onFound.add((data) => {
      finderWindow.visible = false;
      mainButton.active = false;
      this._filterCards[id].fragments = data;
      this.cache();
      if (this._updateVisibilityOnFound) {
        this.updateQueries();
      }
    });

    const fragments: FragmentIdMap = {};

    this._filterCards[id] = {
      styleCard: filterCard,
      fragments,
      name,
      finder,
      deleteButton,
      visible,
      enabled,
    };

    const mainWindow = this.uiElement.get<FloatingWindow>("window");
    mainWindow.addChild(filterCard);
  }

  private updateQueries() {
    this.set(true);
    for (const id in this._filterCards) {
      const { enabled, visible, fragments } = this._filterCards[id];
      if (enabled.value) {
        this.set(visible.value, fragments);
      }
    }
    this.cache();
  }

  private async deleteStyleCard(id: string) {
    const found = this._filterCards[id];
    if (found) {
      await found.styleCard.dispose();
      await found.deleteButton.dispose();
      await found.name.dispose();
      found.finder.deleteCache();
      await found.finder.dispose();
      await found.visible.dispose();
      await found.enabled.dispose();
    }
    delete this._filterCards[id];

    this.updateQueries();
  }

  private hideAllFinders(excludeID?: string) {
    for (const id in this._filterCards) {
      const { finder } = this._filterCards[id];
      const queryWindow = finder.uiElement.get("queryWindow");
      const mainButton = finder.uiElement.get("main");
      if (queryWindow.id === excludeID) {
        continue;
      }
      if (queryWindow.visible) {
        mainButton.domElement.click();
      }
    }
  }

  private cache() {
    const filters: FilterData[] = [];
    for (const id in this._filterCards) {
      const styleCard = this._filterCards[id];
      const { visible, enabled, name } = styleCard;
      filters.push({
        visible: visible.value,
        enabled: enabled.value,
        name: name.value,
        id,
      });
    }
    const serialized = JSON.stringify(filters);
    localStorage.setItem(this._localStorageID, serialized);
  }
}

ToolComponent.libraryUUIDs.add(FragmentHider.uuid);
