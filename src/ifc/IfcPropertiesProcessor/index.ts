import * as WEBIFC from "web-ifc";
import {
  createPopper,
  Instance as PopperInstance,
  // @ts-ignore
} from "@popperjs/core/dist/esm";
import { FragmentsGroup } from "bim-fragment";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { Button } from "../../ui/ButtonComponent";
import { UI, Component, UIComponent } from "../../base-types";
import {
  FloatingWindow,
  SimpleUIComponent,
  TreeView,
  UIComponentsStack,
} from "../../ui";
import { Components } from "../../core/Components";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
import { IfcCategoryMap } from "../ifc-category-map";
import { PropertyTag, NewPset, NewProp, EditProp } from "./src";

interface IndexMap {
  [modelID: string]: { [expressID: string]: Set<number> };
}

interface ExtendedFragmentsGroup extends FragmentsGroup {
  properties: Record<string, Record<string, any>>;
  ifcFileData: {
    name: string;
    description: string;
    schema: "IFC2X3" | "IFC4" | "IFC4X3";
    maxExpressID: number;
  };
}

type RenderFunction = (
  model: ExtendedFragmentsGroup,
  expressID: number,
  ...args: any
) => TreeView[] | TreeView | null;

export class IfcPropertiesProcessor extends Component<IndexMap> implements UI {
  name: string = "PropertiesParser";
  enabled: boolean = true;
  uiElement!: { container: FloatingWindow; showButton: Button };

  relationsToProcess = [
    WEBIFC.IFCRELDEFINESBYPROPERTIES,
    WEBIFC.IFCRELDEFINESBYTYPE,
    WEBIFC.IFCRELASSOCIATESMATERIAL,
    WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
    WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
    WEBIFC.IFCRELASSIGNSTOGROUP,
  ];
  entitiesToIgnore = [WEBIFC.IFCOWNERHISTORY, WEBIFC.IFCMATERIALLAYERSETUSAGE];
  attributesToIgnore = ["CompositionType"];

  private _components: Components;
  private _propsList: UIComponentsStack;
  private _editContainer: UIComponentsStack;
  private _newInput: NewProp;
  private _newPsetInput: NewPset;
  private _editInput: EditProp;
  private _editContainerPopper!: PopperInstance;
  private _indexMap: IndexMap = {};
  private _renderFunctions: { [entityType: number]: RenderFunction } = {};
  // @ts-ignore
  private _uiList: { [expressID: number]: UIComponent } = {};
  private _propertiesManager: IfcPropertiesManager | null = null;

  set propertiesManager(manager: IfcPropertiesManager | null) {
    if (!this._propertiesManager && manager) {
      manager.onElementToPset.on(({ model, psetID, elementID }) => {
        const modelIndexMap = this._indexMap[model.uuid];
        if (!modelIndexMap) return;
        this.setEntityIndex(model, elementID).add(psetID);
      });
      this._propertiesManager = manager;
    }
  }

  get propertiesManager() {
    return this._propertiesManager;
  }

  constructor(components: Components) {
    super();
    this._components = components;

    this._propsList = new UIComponentsStack(this._components, "Vertical");

    this._editInput = new EditProp(this._components);
    this._editInput.visible = false;
    this._editInput.nameInput.visible = false;

    this._newInput = new NewProp(this._components);
    this._newInput.visible = false;

    this._newPsetInput = new NewPset(this._components);
    this._newPsetInput.visible = false;

    this._editContainer = new UIComponentsStack(this._components);
    this._editContainer.onHidden.on(() => {
      this._editInput.visible = false;
      this._newInput.visible = false;
      this._newPsetInput.visible = false;
    });

    this._components.ui.add(this._editContainer);
    this._editContainer.get().classList.add("absolute", "top-5", "left-5");
    this._editContainer.addChild(
      this._editInput,
      this._newInput,
      this._newPsetInput
    );

    this.setUI();

    this._renderFunctions = {
      0: (model: ExtendedFragmentsGroup, expressID: number) =>
        this.newEntityUI(model, expressID),
      [WEBIFC.IFCPROPERTYSET]: (
        model: ExtendedFragmentsGroup,
        expressID: number
      ) => this.newPsetUI(model, expressID),
      [WEBIFC.IFCELEMENTQUANTITY]: (
        model: ExtendedFragmentsGroup,
        expressID: number
      ) => this.newQsetUI(model, expressID),
    };
  }

  private setUI() {
    const container = new FloatingWindow(this._components);
    this._components.ui.add(container);
    container.title = "Properties List";
    container.visible = false;

    container.addChild(this._propsList);

    const showButton = new Button(this._components, {
      materialIconName: "list",
    });

    showButton.onclick = () => {
      container.visible = !container.visible;
    };

    this._editContainerPopper = createPopper(
      container.get(),
      this._editContainer.get(),
      {
        modifiers: [
          {
            name: "offset",
            options: { offset: [15, 15] },
          },
          {
            name: "preventOverflow",
            options: { boundary: this._components.ui.viewerContainer },
          },
        ],
      }
    );

    this._editContainerPopper.setOptions({ placement: "right" });

    container.onMoved.on(() => this._editContainerPopper.update());
    container.onResized.on(() => this._editContainerPopper.update());
    container.onHidden.on(() => (this._editInput.visible = false));
    container.onVisible.on(() => (showButton.active = true));
    container.onHidden.on(() => (showButton.active = false));

    this.uiElement = { container, showButton };
  }

  cleanPropertiesList() {
    this._propsList.dispose(true);
    this.uiElement.container.description = null;
    this._editContainer.visible = false;
    this._propsList.children = [];
  }

  get(): IndexMap {
    return this._indexMap;
  }

  process(model: ExtendedFragmentsGroup) {
    const properties = model.properties;
    if (!properties) throw new Error("FragmentsGroup properties not found");
    this._indexMap[model.uuid] = {};
    // const relations: number[] = [];
    // for (const typeID in IfcCategoryMap) {
    //   const name = IfcCategoryMap[typeID];
    //   if (name.startsWith("IFCREL")) relations.push(Number(typeID));
    // }
    const setEntities = [WEBIFC.IFCPROPERTYSET, WEBIFC.IFCELEMENTQUANTITY];
    for (const relation of this.relationsToProcess) {
      IfcPropertiesUtils.getRelationMap(
        properties,
        relation,
        (relationID, relatedIDs) => {
          const relationEntity = properties[relationID];
          if (!setEntities.includes(relationEntity.type))
            this.setEntityIndex(model, relationID);
          for (const expressID of relatedIDs)
            this.setEntityIndex(model, expressID).add(relationID);
        }
      );
    }
  }

  renderProperties(model: ExtendedFragmentsGroup, expressID: number) {
    this.cleanPropertiesList();
    const ui = this.newEntityUI(model, expressID);
    if (!ui) return;
    const { name } = IfcPropertiesUtils.getEntityName(
      model.properties,
      expressID
    );
    this.uiElement.container.description = name;
    this._propsList.addChild(...[ui].flat());
  }

  private newEntityUI(model: ExtendedFragmentsGroup, expressID: number) {
    const properties = model.properties;
    if (!properties) throw new Error("FragmentsGroup properties not found.");
    const modelElementsIndexation = this._indexMap[model.uuid];
    if (!modelElementsIndexation) return null;

    const entity = properties[expressID];
    const ignorable = this.entitiesToIgnore.includes(entity?.type);
    if (!entity || ignorable) return null;

    if (entity.type === WEBIFC.IFCPROPERTYSET)
      return this.newPsetUI(model, expressID);

    const mainGroup = this.newEntityTree(model, expressID);
    if (!mainGroup) return null;
    this.addEntityActions(model, expressID, mainGroup);

    mainGroup.onExpand.on(() => {
      const { uiProcessed } = mainGroup.data;
      if (uiProcessed) return;
      mainGroup.addChild(...this.newAttributesUI(model, expressID));
      const elementPropsIndexation = modelElementsIndexation[expressID] ?? [];
      for (const id of elementPropsIndexation) {
        const entity = properties[id];
        if (!entity) continue;
        const renderFunction =
          this._renderFunctions[entity.type] ?? this._renderFunctions[0];
        const ui = modelElementsIndexation[id]
          ? this.newEntityUI(model, id)
          : renderFunction(model, id);
        if (!ui) continue;
        mainGroup.addChild(...[ui].flat());
      }
      mainGroup.data.uiProcessed = true;
    });

    return mainGroup;
  }

  private setEntityIndex(model: ExtendedFragmentsGroup, expressID: number) {
    if (!this._indexMap[model.uuid][expressID])
      this._indexMap[model.uuid][expressID] = new Set();
    return this._indexMap[model.uuid][expressID];
  }

  private newAttributesUI(model: ExtendedFragmentsGroup, expressID: number) {
    const properties = model.properties;
    const entityAttributes = properties[expressID];
    if (!entityAttributes) return [];
    const attributesGroup = new TreeView(this._components, "ATTRIBUTES");

    attributesGroup.onExpand.on(() => {
      const { uiProcessed } = attributesGroup.data;
      if (uiProcessed) return;
      let attributesCount = 0;
      for (const name in entityAttributes) {
        const attribute = entityAttributes[name];
        if (!attribute) continue; // in case there is a null attribute
        attributesCount++;
        for (const handle of [attribute].flat()) {
          const ui = this.newAttributeTag(model, name, handle);
          if (!ui) continue;
          attributesGroup.addChild(...[ui].flat());
        }
      }
      if (attributesCount === 0) {
        const p = document.createElement("p");
        p.className = "text-base text-gray-500 py-1 px-3";
        p.textContent = "This entity has no attributes";
        const notFoundText = new SimpleUIComponent(this._components, p);
        attributesGroup.addChild(notFoundText);
      }
      attributesGroup.data.uiProcessed = true;
    });

    return [attributesGroup];
  }

  private newAttributeTag(
    model: ExtendedFragmentsGroup,
    name: string,
    attribute: { value: number; type: number }
  ) {
    if (this.attributesToIgnore.includes(name)) return null;
    const { value, type } = attribute;
    if (!(value && type)) return null;
    if (type === WEBIFC.REF) return this.newEntityUI(model, value);
    const tag = new PropertyTag(this._components);
    tag.label = name;
    tag.value = value;
    return tag;
  }

  private newPsetUI(model: ExtendedFragmentsGroup, psetID: number) {
    const properties = model.properties;
    const uiGroups: TreeView[] = [];
    const pset = properties[psetID];
    if (pset.type !== WEBIFC.IFCPROPERTYSET) return uiGroups;

    const uiGroup = this.newEntityTree(model, psetID);
    if (!uiGroup) return uiGroups;
    this.addPsetActions(model, psetID, uiGroup);

    uiGroup.onExpand.on(() => {
      const { uiProcessed } = uiGroup.data;
      if (uiProcessed) return;
      const psetPropsID = IfcPropertiesUtils.getPsetProps(
        properties,
        psetID,
        (propID) => {
          const prop = properties[propID];
          if (!prop) return;
          const tag = this.newPropertyTag(
            model,
            psetID,
            propID,
            "NominalValue"
          );
          if (tag) uiGroup.addChild(tag);
        }
      );
      if (!psetPropsID || psetPropsID.length === 0) {
        const p = document.createElement("p");
        p.className = "text-base text-gray-500 py-1 px-3";
        p.textContent = "This pset has no properties";
        const notFoundText = new SimpleUIComponent(this._components, p);
        uiGroup.addChild(notFoundText);
      }
      uiGroup.data.uiProcessed = true;
    });

    uiGroups.push(uiGroup);
    return uiGroups;
  }

  private newQsetUI(model: ExtendedFragmentsGroup, qsetID: number) {
    const properties = model.properties;
    const uiGroups: TreeView[] = [];
    const qset = properties[qsetID];
    if (qset.type !== WEBIFC.IFCELEMENTQUANTITY) return uiGroups;

    const uiGroup = this.newEntityTree(model, qsetID);
    if (!uiGroup) return uiGroups;

    this.addPsetActions(model, qsetID, uiGroup);

    IfcPropertiesUtils.getQsetQuantities(properties, qsetID, (quantityID) => {
      const { key } = IfcPropertiesUtils.getQuantityValue(
        properties,
        quantityID
      );
      if (!key) return;
      const tag = this.newPropertyTag(model, qsetID, quantityID, key);
      if (tag) uiGroup.addChild(tag);
    });
    uiGroups.push(uiGroup);
    return uiGroups;
  }

  private addPsetActions(
    model: ExtendedFragmentsGroup,
    psetID: number,
    uiGroup: TreeView
  ) {
    if (!this.propertiesManager) return;
    const { psetActions } = this.propertiesManager.uiElement;
    uiGroup.titleElement.get().onmouseenter = () => {
      psetActions.data = { model, psetID };
      uiGroup.titleElement.addChild(psetActions);
    };
    uiGroup.titleElement.get().onmouseleave = () => {
      psetActions.cleanData();
      uiGroup.titleElement.removeChild(psetActions);
    };
  }

  private addEntityActions(
    model: ExtendedFragmentsGroup,
    expressID: number,
    uiGroup: TreeView
  ) {
    if (!this.propertiesManager) return;
    const { entityActions } = this.propertiesManager.uiElement;
    uiGroup.titleElement.get().onmouseenter = () => {
      entityActions.data = { model, elementID: expressID };
      uiGroup.titleElement.addChild(entityActions);
    };
    uiGroup.titleElement.get().onmouseleave = () => {
      entityActions.cleanData();
      uiGroup.titleElement.removeChild(entityActions);
    };
  }

  private newEntityTree(model: ExtendedFragmentsGroup, expressID: number) {
    const properties = model.properties;
    const entity = properties[expressID];
    if (!entity) return null;
    const entityTree = new TreeView(
      this._components,
      `${IfcCategoryMap[entity.type]}`
    );
    const { name } = IfcPropertiesUtils.getEntityName(properties, expressID);
    entityTree.titleElement.description = name;
    return entityTree;
  }

  private newPropertyTag(
    model: ExtendedFragmentsGroup,
    setID: number,
    expressID: number,
    valueKey: string
  ) {
    const properties = model.properties;
    const entity = properties[expressID];
    if (!entity) return null;
    const tag = new PropertyTag(this._components);
    tag.label = entity.Name?.value;
    tag.value = entity[valueKey]?.value;

    if (!this.propertiesManager) return tag;

    // #region ManagementUI
    const { propActions } = this.propertiesManager.uiElement;
    tag.get().onmouseenter = () => {
      propActions.data = { model, setID, expressID, valueKey };
      tag.addChild(propActions);
    };
    tag.get().onmouseleave = () => {
      tag.removeChild(propActions);
      propActions.cleanData();
    };
    // #endregion ManagementUI

    return tag;
  }
}

export * from "./src";
