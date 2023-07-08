import * as WEBIFC from "web-ifc";
import { createPopper, Instance as PopperInstance } from "@popperjs/core";
import { FragmentsGroup } from "bim-fragment";
import { EditProp } from "./src/edit-prop";
import { Button } from "../../ui/ButtonComponent";
import { UI, Component, UIComponent } from "../../base-types";
import { FloatingWindow, TreeView, UIComponentsStack } from "../../ui";
import { Components } from "../../core/Components";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
import { IfcCategoryMap } from "../ifc-category-map";
import { getPsetProps, getQsetQuantities, getRelationMap } from "./src";
import { NewProp } from "./src/new-prop";
import { NewPset } from "./src/new-pset";
import { PropertyTag } from "./src/property-tag";

// TODO: Clean up, make more modular.

interface NewDataStructure {
  [modelID: string]: { [expressID: string]: Set<number> };
}

interface PropertiesProcessorConfig {
  selectionHighlighter: string;
}

type RenderFunction = (
  properties: any,
  expressID: number,
  ...args: any
) => TreeView[];

export class IfcPropertiesProcessor
  extends Component<NewDataStructure>
  implements UI
{
  name: string = "PropertiesParser";
  enabled: boolean = true;
  uiElement!: { container: FloatingWindow; showButton: Button };
  propsManager: IfcPropertiesManager;
  groupButtons: UIComponentsStack;
  private _attributesToIgnore = [
    "OwnerHistory",
    "ObjectPlacement",
    "Representation",
    "CompositionType",
    "Material",
    "ReferencedSource",
  ];
  private _components: Components;
  private _propsList: UIComponentsStack;
  private _editContainer: UIComponentsStack;
  private _newInput: NewProp;
  private _newPsetInput: NewPset;
  private _editInput: EditProp;
  private _newPsetBtn: Button;
  private _editContainerPopper!: PopperInstance;
  private _map: NewDataStructure = {};
  private _processedModels: FragmentsGroup[] = [];
  private _renderFunctions: { [entityType: number]: RenderFunction } = {};
  private _uiList: { [expressID: number]: UIComponent } = {};
  private _config: PropertiesProcessorConfig = {
    selectionHighlighter: "select",
  };

  constructor(components: Components, config?: PropertiesProcessorConfig) {
    super();
    this._components = components;
    this._config = { ...this._config, ...config };

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

    this._newPsetBtn = new Button(this._components, {
      materialIconName: "add",
      name: "Add property set",
    });
    this._newPsetBtn.visible = false;
    this._newPsetBtn.onclick = () => {
      this._editContainer.visible = true;
      this._editInput.visible = false;
      this._newInput.visible = false;
      this._newPsetInput.visible = true;
      this._editContainerPopper.update();
    };

    this.propsManager = new IfcPropertiesManager(components);

    this.groupButtons = new UIComponentsStack(this._components, "Horizontal");
    this.groupButtons.get().classList.add("my-[8px]");
    this.setGroupButtons();

    this.setUI();
    this.setNewPsetLogic();

    this._renderFunctions = {
      0: (properties: any, expressID: number) =>
        this.createAttributesUI(properties, expressID),
      [WEBIFC.IFCPROPERTYSET]: (properties: any, expressID: number) =>
        this.createPsetUI(properties, expressID),
      [WEBIFC.IFCELEMENTQUANTITY]: (properties: any, expressID: number) =>
        this.createQsetUI(properties, expressID),
    };
  }

  private setGroupButtons() {
    const addBtn = new Button(this._components, { materialIconName: "add" });
    addBtn.onclick = () => {
      this._editContainer.visible = true;
      this._editInput.visible = false;
      this._newInput.visible = true;
      this._newPsetInput.visible = false;
      this._editContainerPopper.update();
    };
    const removeBtn = new Button(this._components, {
      materialIconName: "delete",
    });
    const editBtn = new Button(this._components, {
      materialIconName: "edit",
    });
    this.groupButtons.addChild(addBtn);
  }

  private setNewPsetLogic() {
    // this._newPsetInput.acceptButton.onclick = () => {
    //   const pset = new PropertyGroup(
    //     this._components,
    //     this._newPsetInput.nameInput.inputValue
    //   );
    //   pset.actionButtons = this.groupButtons;
    //   pset.description = this._newPsetInput.descriptionInput.inputValue;
    //   const selection = this._fragmentsHighlighter.selection.select;
    //   for (const fragmentID in selection) {
    //     const elements = selection[fragmentID];
    //     for (const expressID of elements) {
    //       const elementPropertiesManager = this._map[fragmentID][expressID];
    //       elementPropertiesManager.addGroup(pset);
    //       this.renderProperties(fragmentID, expressID);
    //     }
    //   }
    //   this._editContainer.visible = false;
    // };
  }

  private setUI() {
    const container = new FloatingWindow(this._components);

    this._components.ui.add(container);
    container.title = "Properties List";
    container.visible = false;

    const topMenu = new UIComponentsStack(this._components, "Horizontal");
    topMenu.addChild(this._newPsetBtn);

    container.addChild(topMenu, this._propsList);

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
    this._newPsetBtn.visible = false;
    this._propsList.children = [];
  }

  get(): NewDataStructure {
    return this._map;
  }

  process(model: FragmentsGroup) {
    const properties = model.properties;
    if (!properties) throw new Error("FragmentsGroup properties not found");
    this._processedModels.push(model);
    this._map[model.uuid] = {};
    this.indexTypes(model);
    this.indexStructure(model);
    this.indexProperties(model);
    this.indexMaterials(model);
    this.indexClassifications(model);
  }

  private indexClassifications(model: FragmentsGroup) {
    getRelationMap(
      model.properties,
      WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
      (classificationID, relatedIDs) => {
        const classificationEntity = model.properties[classificationID];
        const classificationIndex = this.setEntityIndex(
          model,
          classificationID
        );
        classificationIndex.add(classificationEntity.ReferencedSource.value);
        this.setEntityIndex(model, classificationEntity.ReferencedSource.value);
        for (const expressID of relatedIDs) {
          const entityIndex = this.setEntityIndex(model, expressID);
          entityIndex.add(classificationID);
        }
      }
    );
  }

  private indexTypes(model: FragmentsGroup) {
    getRelationMap(
      model.properties,
      WEBIFC.IFCRELDEFINESBYTYPE,
      (typeID, relatedIDs) => {
        this.setEntityIndex(model, typeID);
        for (const expressID of relatedIDs) {
          const entityIndex = this.setEntityIndex(model, expressID);
          entityIndex.add(typeID);
        }
      }
    );
  }

  private indexStructure(model: FragmentsGroup) {
    getRelationMap(
      model.properties,
      WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      (structureID, relatedIDs) => {
        this.setEntityIndex(model, structureID);
        for (const expressID of relatedIDs) {
          const entityIndex = this.setEntityIndex(model, expressID);
          entityIndex.add(structureID);
        }
      }
    );
  }

  private indexProperties(model: FragmentsGroup) {
    getRelationMap(
      model.properties,
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      (relatingID, relatedIDs) => {
        for (const expressID of relatedIDs) {
          const entityIndex = this.setEntityIndex(model, expressID);
          entityIndex.add(relatingID);
        }
      }
    );
  }

  private indexMaterials(model: FragmentsGroup) {
    getRelationMap(
      model.properties,
      WEBIFC.IFCRELASSOCIATESMATERIAL,
      (relatingID, relatedIDs) => {
        let relatingEntity = model.properties[relatingID];
        if (relatingEntity.type === WEBIFC.IFCMATERIALLAYERSETUSAGE)
          relatingEntity = model.properties[relatingEntity.ForLayerSet.value];
        if (relatingEntity.type !== WEBIFC.IFCMATERIALLAYERSET) return;
        const relatingIndex = this.setEntityIndex(
          model,
          relatingEntity.expressID
        );
        for (const layerHandle of relatingEntity.MaterialLayers) {
          const layerID = layerHandle.value;
          relatingIndex.add(layerID);
          const layerIndex = this.setEntityIndex(model, layerID);
          const materialID = model.properties[layerID].Material.value;
          layerIndex.add(materialID);
          this.setEntityIndex(model, materialID);
        }
        for (const expressID of relatedIDs) {
          const entityIndex = this.setEntityIndex(model, expressID);
          entityIndex.add(relatingEntity.expressID);
        }
      }
    );
  }

  private setEntityIndex(model: FragmentsGroup, expressID: number) {
    if (!this._map[model.uuid][expressID])
      this._map[model.uuid][expressID] = new Set();
    return this._map[model.uuid][expressID];
  }

  private generate(model: FragmentsGroup, expressID: number) {
    const properties = model.properties;
    if (!properties) throw new Error("FragmentsGroup properties not found.");
    const modelElementsIndexation = this._map[model.uuid];
    if (!modelElementsIndexation)
      throw new Error("FragmentsGroup properties are not indexed.");
    const elementPropsIndexation = modelElementsIndexation[expressID] ?? [];

    const mainGroup = new TreeView(
      this._components,
      `${IfcCategoryMap[properties[expressID].type]}: ${expressID}`
    );
    mainGroup.titleElement.description = properties[expressID].Name?.value;
    mainGroup.addChild(...this.createAttributesUI(properties, expressID));

    const subGroups: TreeView[] = []; // Other groups representing direct relations with the provided expressID

    for (const id of elementPropsIndexation) {
      if (modelElementsIndexation[id]) {
        const [mg, ...sg] = this.generate(model, id);
        mg.addChild(...sg);
        subGroups.push(mg);
      } else {
        const entity = properties[id];
        const renderFunction =
          this._renderFunctions[entity.type] ?? this._renderFunctions[0];
        mainGroup.addChild(...renderFunction(properties, id));
      }
    }

    return [mainGroup, ...subGroups];
  }

  renderProperties(model: FragmentsGroup, expressID: number) {
    this.cleanPropertiesList();
    const ui = this.generate(model, expressID);
    this._newPsetBtn.visible = true;
    this.uiElement.container.description =
      model.properties[expressID].Name?.value ?? "Unnamed Element";
    this._propsList.addChild(...ui);
  }

  private createAttributesUI(properties: any, expressID: number) {
    const attributesGroup = new TreeView(this._components, "Attributes");
    const elementAttributes = properties[expressID];
    for (const name in elementAttributes) {
      const ignorable = this._attributesToIgnore.includes(name);
      const value = elementAttributes[name]?.value;
      if (ignorable || !value) continue;
      const tag = new PropertyTag(this._components);
      tag.label = name[0].toUpperCase() + name.slice(1);
      tag.value = value;
      attributesGroup.addChild(tag);
    }
    return [attributesGroup];
  }

  private createPsetUI(properties: any, psetID: number) {
    const uiGroups: TreeView[] = [];
    const pset = properties[psetID];
    if (pset.type !== WEBIFC.IFCPROPERTYSET) return uiGroups;
    const uiGroup = new TreeView(
      this._components,
      pset.Name?.value ?? "Unnamed Pset"
    );
    getPsetProps(properties, psetID, (propID) => {
      const prop = properties[propID];
      const tag = new PropertyTag(this._components);
      tag.label = prop.Name?.value ?? "Unnamed Property";
      tag.value = prop.NominalValue.value;
      uiGroup.addChild(tag);
    });
    uiGroups.push(uiGroup);
    return uiGroups;
  }

  private createQsetUI(properties: any, qsetID: number) {
    const uiGroups: TreeView[] = [];
    const qset = properties[qsetID];
    if (qset.type !== WEBIFC.IFCELEMENTQUANTITY) return uiGroups;
    const uiGroup = new TreeView(
      this._components,
      qset.Name?.value ?? "Unnamed Qset"
    );
    getQsetQuantities(properties, qsetID, (quantityID) => {
      const quantity = properties[quantityID];
      const valueKey = Object.keys(quantity).find((key) =>
        key.endsWith("Value")
      );
      if (!valueKey) return;
      const tag = new PropertyTag(this._components);
      tag.label = quantity.Name?.value ?? "Unnamed Quantity";
      tag.value = quantity[valueKey].value;
      uiGroup.addChild(tag);
    });
    uiGroups.push(uiGroup);
    return uiGroups;
  }

  private storeUI(expressID: number, uiComponent: UIComponent) {
    this._uiList[expressID] = uiComponent;
  }
}

export * from "./src";
