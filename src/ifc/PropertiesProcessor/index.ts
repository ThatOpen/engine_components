// eslint-disable-next-line max-classes-per-file
import * as WEBIFC from "web-ifc";
import { createPopper, Instance as PopperInstance } from "@popperjs/core";
import { EditProp } from "./src/edit-prop";
import { Button } from "../../ui/ButtonComponent";
import { UI, Component } from "../../base-types";
import { FloatingWindow, UIComponentsStack } from "../../ui";
import { Components } from "../../core/Components";
import { FragmentHighlighter } from "../../fragments";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
import { IfcCategoryMap } from "../ifc-category-map";
import { getElementQsets, getPsetProps, getQsetQuantities } from "./src";
import { getRelationMap } from "./src/relation-map";
import { NewProp } from "./src/new-prop";
import { NewPset } from "./src/new-pset";
import { PropertyGroup } from "./src/testing/PropertyGroup";
import { Property } from "./src/testing/Property";
import { ElementPropertiesManager } from "./src/testing/ElementPropertiesManager";

// TODO: Clean up, make more modular.

// @ts-ignore
enum IfcTokenType {
  UNKNOWN = 0,
  STRING = 1,
  LABEL = 2,
  ENUM = 3,
  REAL = 4,
  REF = 5,
  EMPTY = 6,
  SET_BEGIN,
  SET_END,
  LINE_END,
}

interface PropName {
  Constructor: (new (value: any) => any) | null;
  value: string;
  type: number;
}

interface PropValue {
  Constructor: (new (value: any) => any) | null;
  value: string | number | boolean;
  type: number;
  key: string;
}

interface IPropData {
  expressID: number;
  name: PropName;
  value: PropValue;
  group: string;
}

interface IModelProp {
  [propertyName: string]: IPropData;
}

interface IModelProperties {
  [expressID: string]: IModelProp;
}

interface NewDataStructure {
  [fragmentID: string]: { [expressID: string]: ElementPropertiesManager };
}

interface IPropertiesList {
  [fragmentID: string]: IModelProperties;
}

interface PropertiesProcessorConfig {
  selectionHighlighter: string;
}

export class PropertiesProcessor
  extends Component<IPropertiesList>
  implements UI
{
  name: string = "PropertiesParser";
  enabled: boolean = true;
  uiElement!: { container: FloatingWindow; showButton: Button };
  propsManager: IfcPropertiesManager;
  groupButtons: UIComponentsStack;
  private _components: Components;
  private _propsList: UIComponentsStack;
  private _editContainer: UIComponentsStack;
  private _newInput: NewProp;
  private _newPsetInput: NewPset;
  private _editInput: EditProp;
  private _editBtn: Button;
  private _newPsetBtn: Button;
  private _editContainerPopper!: PopperInstance;
  private _fragmentsHighlighter: FragmentHighlighter;
  private _map: IPropertiesList = {};
  private _map2: NewDataStructure = {};
  private _config: PropertiesProcessorConfig = {
    selectionHighlighter: "select",
  };

  constructor(
    components: Components,
    fragmentHighlighter: FragmentHighlighter,
    config?: PropertiesProcessorConfig
  ) {
    super();
    this._components = components;
    this._config = { ...this._config, ...config };
    this._fragmentsHighlighter = fragmentHighlighter;

    this._propsList = new UIComponentsStack(this._components, "Vertical");
    this._propsList.get().classList.add("gap-y-1");

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

    this._editBtn = new Button(this._components, {
      materialIconName: "edit",
    });

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
    const addBtn = new Button(this._components, { materialIconName: "add" });
    const removeBtn = new Button(this._components, {
      materialIconName: "delete",
    });
    const editBtn = new Button(this._components, {
      materialIconName: "edit",
    });
    this.groupButtons.addChild(addBtn, editBtn, removeBtn);

    this.setEventListeners();
    this.setUI();
  }

  private setUI() {
    const container = new FloatingWindow(this._components);

    this._components.ui.add(container);
    container.title = "Properties List";
    container.visible = false;

    const topMenu = new UIComponentsStack(this._components, "Horizontal");
    topMenu.addChild(this._newPsetBtn);

    this._newPsetInput.acceptButton.onclick = () => {
      const pset = new PropertyGroup(
        this._components,
        this._newPsetInput.nameInput.inputValue
      );
      pset.buttons = this.groupButtons;
      pset.description = this._newPsetInput.descriptionInput.inputValue;
      const selection = this._fragmentsHighlighter.selection.select;
      for (const fragmentID in selection) {
        const elements = selection[fragmentID];
        for (const expressID of elements) {
          const elementPropertiesManager = this._map2[fragmentID][expressID];
          elementPropertiesManager.addGroup(pset);
          this.renderProperties(fragmentID, expressID);
        }
      }
      this._editContainer.visible = false;
    };

    container.addChild(topMenu, this._propsList);

    const showButton = new Button(this._components, {
      materialIconName: "list",
    });

    container.onVisible.on(() => (showButton.active = true));
    container.onHidden.on(() => (showButton.active = false));

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
    container.onMoved.on(() => {
      this._editContainerPopper.update();
    });

    container.onResized.on(() => {
      this._editContainerPopper.update();
    });

    container.onHidden.on(() => {
      this._editInput.visible = false;
    });

    this.uiElement = {
      container,
      showButton,
    };
  }

  private cleanPropertiesList() {
    for (const child of this._propsList.children) {
      child.domElement.remove();
    }
    this._propsList.children = [];
  }

  private setEventListeners() {
    const highlighterEvents = this._fragmentsHighlighter.events;
    highlighterEvents[this._config.selectionHighlighter]?.onClear.on(() => {
      this.uiElement.container.description = null;
      this._editContainer.visible = false;
      this._newPsetBtn.visible = false;
      this.cleanPropertiesList();
    });
    highlighterEvents[this._config.selectionHighlighter]?.onHighlight.on(
      (selection) => {
        this._newPsetBtn.visible = true;
        const fragmentIDs = Object.keys(selection);
        if (fragmentIDs.length !== 1) {
          this.cleanPropertiesList();
          return;
        }
        const fragmentID = fragmentIDs[0];
        const expressIDs = [...selection[fragmentID]];
        if (expressIDs.length !== 1) {
          this.cleanPropertiesList();
          return;
        }
        const expressID = expressIDs[0];
        this.renderProperties(fragmentID, expressID);
      }
    );
  }

  get(): IPropertiesList {
    return this._map;
  }

  // TODO: Some of these take an array of strings and another an array of functions. Is it correct?

  process(
    properties: Record<string, any>,
    fragmentIDExpressIDMap: { [fragmentID: string]: Set<string> }
  ) {
    const expressIDFragmentIDMap: Record<string, string> = {};
    for (const fragmentID in fragmentIDExpressIDMap) {
      this._map2[fragmentID] = {};
      const expressIDs = fragmentIDExpressIDMap[fragmentID];
      for (const expressID of expressIDs) {
        this._map2[fragmentID][expressID] = new ElementPropertiesManager(
          this._components,
          Number(expressID)
        );
        expressIDFragmentIDMap[expressID] = fragmentID;
      }
    }
    this.processElements(properties, expressIDFragmentIDMap);
    this.processStoreys(properties, expressIDFragmentIDMap);
    this.processSets(properties, expressIDFragmentIDMap);
    // this.processGroups(properties, processResult);
  }

  renderProperties(fragmentID: string, expressID: string) {
    this.cleanPropertiesList();
    const fragmentProperties = this._map2[fragmentID];
    if (!fragmentProperties) {
      return;
    }
    const elementProperties = fragmentProperties[expressID];
    if (!elementProperties) {
      return;
    }
    const name = elementProperties
      .getGroupByName("Attributes")
      ?.getPropertyByName("Name");
    if (name) {
      this.uiElement.container.description = name.value?.toString() ?? null;
    }
    for (const group of elementProperties.propertyGroups) {
      this._propsList.addChild(group.uiElement);
    }
    // for (const groupName in groupedProperties) {

    //   add.onclick = () => {
    //     this._newPsetInput.visible = false;
    //     this._editInput.visible = false;
    //     this._newInput.visible = true;
    //     this._editContainer.visible = true;
    //     this._editContainerPopper.update();

    //     this._newInput.acceptButton.onclick = () => {
    //       const prop: IPropData = {
    //         group: groupName,
    //         expressID: -1,
    //         name: {
    //           Constructor: null,
    //           value: this._newInput.nameInput.inputValue,
    //           type: 1,
    //         },
    //         value: {
    //           Constructor: null,
    //           value: this._newInput.valueInput.inputValue,
    //           type: 1,
    //           key: "NominalValue",
    //         },
    //       };
    //       const selection = this._fragmentsHighlighter.selection.select;
    //       for (const fragmentID in selection) {
    //         const ids = selection[fragmentID];
    //         for (const expressID of ids) {
    //           const elementProps = this.get()[fragmentID][expressID];
    //           elementProps[this._newInput.nameInput.inputValue] = prop;
    //           this.renderProperties(fragmentID, expressID);
    //         }
    //       }
    //       this._editContainer.visible = false;
    //     };
    //   };

    //   const props = groupedProperties[groupName];

    //   props.forEach((prop) => {
    //     const value =
    //       typeof prop.value.value === "number"
    //         ? prop.value.value.toPrecision(4)
    //         : prop.value.value;

    //     const editButton = new Button(this._components, {
    //       materialIconName: "edit",
    //     });
    //     editButton.visible = false;
    //     editButton.onclick = () => {
    //       this._newPsetInput.visible = false;
    //       this._newInput.visible = false;
    //       this._editInput.visible = true;
    //       this._editInput.nameInput.inputValue = prop.name.value;
    //       this._editInput.valueInput.labelElement.textContent = `${prop.group}: ${prop.name.value}`;
    //       this._editInput.valueInput.inputValue = value.toString();

    //       this._editContainer.visible = true;
    //       this._editContainerPopper.update();

    //       this._editInput.acceptButton.onclick = () => {
    //         this._editInput.visible = false;
    //         const inputValue = this._editInput.valueInput.inputValue;
    //         prop.value.value = inputValue;
    //         propTag.value = inputValue;
    //         if (prop.value.Constructor && prop.value.key) {
    //           this.propsManager.addChange(
    //             {
    //               expressID: prop.expressID,
    //               propName: prop.value.key,
    //               newValue: new prop.value.Constructor(inputValue),
    //             },
    //             fragmentID
    //           );
    //         }
    //       };
    //     };
    //     propTag.addChild(editButton);

    //     propTag.get().onmouseenter = () => {
    //       editButton.visible = true;
    //     };
    //     propTag.get().onmouseleave = () => {
    //       editButton.visible = false;
    //     };
    //   });
    // }
  }

  /**
   * @description Foundation function that returns entity attributes.
   * @param model
   * @param expressID
   */
  private processAttributes(
    properties: Record<string, any>,
    expressID: number,
    options?: { group?: string }
  ) {
    const props = properties[expressID];
    if (!props) {
      return null;
    }
    const _options = { group: "Attributes", ...options };
    const { group: groupName } = _options;

    const group = new PropertyGroup(this._components, groupName);
    group.editable = false;
    group.buttons = this.groupButtons;

    const ifcEntity = new Property(
      this._components,
      "IfcEntity",
      IfcCategoryMap[props.type]
    );

    group.addProperty(ifcEntity);

    const attributes = [
      {
        name: "PredefinedType",
        editable: true,
        applicableEntities: [WEBIFC.IFCWALL, WEBIFC.IFCWALLSTANDARDCASE],
      },
      {
        name: "Name",
        editable: true,
      },
      {
        name: "LongName",
        editable: true,
      },
      {
        name: "Description",
        editable: true,
      },
      {
        name: "ObjectType",
        editable: true,
      },
      {
        name: "Tag",
        editable: true,
      },
      {
        name: "GlobalId",
        editable: true,
      },
      {
        name: "Elevation",
        editable: true,
      },
    ];

    for (const attribute of attributes) {
      if (!props[attribute.name]) {
        continue;
      }
      const attributeProperty = new Property(
        this._components,
        attribute.name,
        props[attribute.name].value
      );
      attributeProperty.editable = attribute.editable;
      group.addProperty(attributeProperty);
    }

    return group;
  }

  private processElements(
    properties: Record<string, any>,
    expressIDFragmentIDMap: Record<string, string>
  ) {
    const arrayProperties = Object.values(properties);

    // #region Building properties
    let buildingAttributes: PropertyGroup | null = null;
    const building: any = arrayProperties.find(
      (prop: any) => prop.type === WEBIFC.IFCBUILDING
    );
    if (building) {
      buildingAttributes = this.processAttributes(
        properties,
        building.expressID,
        {
          group: "Building",
        }
      );
    }
    // #endregion

    // #region Site properties
    let siteAttributes: PropertyGroup | null = null;
    const site: any = arrayProperties.find(
      (prop: any) => prop.type === WEBIFC.IFCSITE
    );
    if (site) {
      siteAttributes = this.processAttributes(properties, site.expressID, {
        group: "Site",
      });
    }
    // #endregion

    const expressIDs = Object.keys(expressIDFragmentIDMap);

    for (const expressID of expressIDs) {
      const fragmentID = expressIDFragmentIDMap[expressID];
      const elementPropsManager = this._map2[fragmentID][expressID];
      const elementAttributes = this.processAttributes(
        properties,
        Number(expressID)
      );
      if (elementAttributes) {
        elementPropsManager.addGroup(elementAttributes);
      }
      if (buildingAttributes) {
        elementPropsManager.addGroup(buildingAttributes);
      }
      if (siteAttributes) {
        elementPropsManager.addGroup(siteAttributes);
      }
    }
  }

  private processSets(
    properties: Record<string, any>,
    expressIDFragmentIDMap: Record<string, string>
  ) {
    const idsToProcess = Object.keys(expressIDFragmentIDMap);
    getRelationMap(
      properties,
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      (relatingID, expressIDs) => {
        const relating = properties[relatingID];
        if (relating.type === WEBIFC.IFCPROPERTYSET) {
          const psetGroup = new PropertyGroup(
            this._components,
            relating.Name.value
          );
          psetGroup.buttons = this.groupButtons;
          getPsetProps(properties, relatingID, (propID) => {
            const prop = properties[propID];
            const value =
              prop.NominalValue?.constructor.name === "IfcBoolean"
                ? prop.NominalValue.value === "T"
                : prop.NominalValue?.value;

            const property = new Property(
              this._components,
              prop.Name.value,
              value
            );
            psetGroup.addProperty(property);

            for (const expressID of expressIDs) {
              if (!idsToProcess.includes(String(expressID))) {
                continue;
              }
              const fragmentID = expressIDFragmentIDMap[expressID];
              this._map2[fragmentID][expressID].addGroup(psetGroup);
            }
          });
        } else if (relating.type === WEBIFC.IFCELEMENTQUANTITY) {
          const qsetGroup = new PropertyGroup(
            this._components,
            relating.Name.value
          );
          qsetGroup.buttons = this.groupButtons;
          getQsetQuantities(properties, relatingID, (qtoID) => {
            const qto = properties[qtoID];
            const entityName = IfcCategoryMap[qto.type];
            let valuePropName = entityName
              .replace(/IFCQUANTITY/, "")
              .toLowerCase();
            valuePropName = `${
              valuePropName[0].toUpperCase() + valuePropName.slice(1)
            }Value`;
            const property = new Property(
              this._components,
              qto.Name.value,
              qto[valuePropName].value
            );
            qsetGroup.addProperty(property);

            for (const expressID of expressIDs) {
              if (!idsToProcess.includes(String(expressID))) {
                continue;
              }
              const fragmentID = expressIDFragmentIDMap[expressID];
              this._map2[fragmentID][expressID].addGroup(qsetGroup);
            }
            // const data: IPropData = {
            //   name: {
            //     ...qto.Name,
            //     Constructor: qto.Name?.constructor ?? null,
            //   },
            //   value: {
            //     ...qto[valuePropName],
            //     Constructor: qto[valuePropName]?.constructor ?? null,
            //     key: valuePropName,
            //   },
            //   group: qto.Name.value,
            //   expressID: qto.expressID,
            // };
          });
        }
      }
    );
  }

  private processStoreys(
    properties: Record<string, any>,
    expressIDFragmentIDMap: Record<string, string>
  ) {
    const idsToProcess = Object.keys(expressIDFragmentIDMap);
    getRelationMap(
      properties,
      WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      (storeyID, expressIDs) => {
        const storeyAttributes = this.processAttributes(properties, storeyID, {
          group: "Storey",
        });
        for (const expressID of expressIDs) {
          if (!idsToProcess.includes(String(expressID))) {
            continue;
          }
          const fragmentID = expressIDFragmentIDMap[expressID];
          const elementPropsManager = this._map2[fragmentID][expressID];
          if (storeyAttributes) {
            elementPropsManager.addGroup(storeyAttributes);
          }
        }
      }
    );
  }

  private processGroups(
    properties: Record<string, any>,
    props: IModelProperties
  ) {
    getRelationMap(
      properties,
      WEBIFC.IFCRELASSIGNSTOGROUP,
      (groupID, expressIDs) => {
        const group = properties[groupID];
        const groupAttributes = this.processAttributes(properties, groupID, {
          group: `Group: ${group.Name?.value}`,
        });
        expressIDs.forEach((expressID: number) => {
          if (groupAttributes?.name) {
            // this.storeProperty(props, expressID, groupAttributes.name);
          }
          if (groupAttributes?.description) {
            // this.storeProperty(props, expressID, groupAttributes.description);
          }
        });
      }
    );
  }

  // createGroupSystem(propName: string) {

  // }
}

export * from "./src";
