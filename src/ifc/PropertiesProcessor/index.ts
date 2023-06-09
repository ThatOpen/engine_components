// eslint-disable-next-line max-classes-per-file
import * as WEBIFC from "web-ifc";
import {
  createPopper,
  Instance as PopperInstance,
  // @ts-ignore
} from "@popperjs/core/dist/esm";
import { EditProp } from "./src/edit-prop";
import { Button } from "../../ui/ButtonComponent";
import { UI, Component } from "../../base-types";
import { TreeView, FloatingWindow, VerticalStack } from "../../ui";
import { Components } from "../../core/Components";
import { PropertyTag } from "./src/property-tag";
import { FragmentHighlighter } from "../../fragments";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
import { IfcCategoryMap } from "../ifc-category-map";
import {
  getElementPsets,
  getElementQsets,
  getPsetProps,
  getQsetQuantities,
} from "./src";
import { getRelationMap } from "./src/relation-map";

// TODO: Clean up, make more modular and decouple from fragments.

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
  prefix: string;
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

interface IEntityAttributes {
  globalId: IPropData;
  ifcEntity: IPropData;
  name?: IPropData;
  predefinedType?: IPropData;
  description?: IPropData;
  longName?: IPropData;
  tag?: IPropData;
  type?: IPropData;
}

interface IModelProp {
  [propertyName: string]: IPropData;
}

interface IModelProperties {
  [expressID: string]: IModelProp;
}

interface IPropertiesList {
  [modelID: string]: IModelProperties;
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
  components: Components;
  uiElement!: { container: FloatingWindow; showButton: Button };
  propsManager: IfcPropertiesManager;
  private _propsList: VerticalStack;
  private _editInput: EditProp;
  private _editInputPopper: PopperInstance;
  private _fragmentsHighlighter: FragmentHighlighter;
  private _map: IPropertiesList = {};
  private _config: PropertiesProcessorConfig = {
    selectionHighlighter: "select",
  };

  constructor(
    components: Components,
    fragmentHighlighter: FragmentHighlighter,
    config?: PropertiesProcessorConfig
  ) {
    super();
    this.components = components;
    this._config = { ...this._config, ...config };
    this._fragmentsHighlighter = fragmentHighlighter;

    this._propsList = new VerticalStack(this.components);

    this._editInput = new EditProp(this.components);
    this._editInput.visible = false;
    this._editInput.nameInput.visible = false;
    this.components.ui.add(this._editInput);

    this.propsManager = new IfcPropertiesManager(components);

    this.setEventListeners();
    this.setUI();
  }

  private setUI() {
    const container = new FloatingWindow(this.components, {
      title: "Properties List",
    });

    this.components.ui.add(container);
    container.visible = false;
    container.addChild(this._propsList);

    const showButton = new Button(this.components, {
      materialIconName: "list",
    });

    container.onVisible.on(() => (showButton.active = true));
    container.onHidden.on(() => (showButton.active = false));

    showButton.onclick = () => {
      container.visible = !container.visible;
    };

    this._editInputPopper = createPopper(
      container.get(),
      this._editInput.get(),
      {
        modifiers: [
          {
            name: "offset",
            options: { offset: [15, 15] },
          },
          {
            name: "preventOverflow",
            // @ts-ignore
            options: { boundary: this.components.ui.viewerContainer },
          },
        ],
      }
    );

    this._editInputPopper.setOptions({ placement: "right" });
    container.onMoved.on(() => {
      this._editInputPopper.update();
    });

    container.onResized.on(() => {
      this._editInputPopper.update();
    });

    container.onHidden.on(() => {
      this._editInput.visible = false;
    });

    this.uiElement = {
      container,
      showButton,
    };
  }

  private setEventListeners() {
    const highlighterEvents = this._fragmentsHighlighter.events;
    highlighterEvents[this._config.selectionHighlighter]?.onClear.on(() => {
      this.uiElement.container.description = null;
      this._editInput.visible = false;
      this._propsList.dispose(true);
    });
    highlighterEvents[this._config.selectionHighlighter]?.onHighlight.on(
      (selection) => {
        const fragmentIDs = Object.keys(selection);
        if (fragmentIDs.length !== 1) {
          this._propsList.dispose(true);
          return;
        }
        const fragmentID = fragmentIDs[0];
        const expressIDs = [...selection[fragmentID]];
        if (expressIDs.length !== 1) {
          this._propsList.dispose(true);
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

  process(
    properties: Record<string, any>,
    expressIDFragmentIDMap: { [fragmentID: string]: string[] }
  ) {
    const processResult: IModelProperties = {};
    // @ts-ignore
    const expressIDs = Object.values(expressIDFragmentIDMap).flat();
    this.processElements(properties, expressIDs, processResult);
    this.processStoreys(properties, processResult);
    this.processGroups(properties, processResult);
    this.processQsets(properties, processResult, expressIDs);
    this.processPsets(properties, processResult, expressIDs);
    for (const fragmentID in expressIDFragmentIDMap) {
      const expressIDs = expressIDFragmentIDMap[fragmentID];
      this._map[fragmentID] = {};
      expressIDs.forEach((expressID) => {
        this._map[fragmentID][expressID] = processResult[expressID];
      });
    }
    return processResult;
  }

  groupProperties(props: IModelProp) {
    const groups: Record<string, IPropData[]> = {};
    for (const name in props) {
      const prop = props[name];
      if (!groups[prop.group]) {
        groups[prop.group] = [];
      }
      groups[prop.group].push(prop);
    }
    return groups;
  }

  private renderProperties(fragmentID: string, expressID: string) {
    this._propsList.dispose(true);
    const fragmentProperties = this.get()[fragmentID];
    if (!fragmentProperties) {
      return;
    }
    const elementProperties = fragmentProperties[expressID];
    if (!elementProperties) {
      return;
    }
    const groupedProperties = this.groupProperties(elementProperties);
    const name = groupedProperties.Attributes?.find(
      (v) => v.name.value === "Name"
    );
    if (name) {
      this.uiElement.container.description = name.value.value.toString();
    }
    for (const groupName in groupedProperties) {
      const groupTree = new TreeView(this.components, groupName);
      this._propsList.addChild(groupTree);
      const props = groupedProperties[groupName];

      props.forEach((prop) => {
        const value =
          typeof prop.value.value === "number"
            ? prop.value.value.toPrecision(4)
            : prop.value.value;

        const propTag = new PropertyTag(
          this.components,
          prop.name.value,
          value
        );
        groupTree.addChild(propTag);

        const editButton = new Button(this.components, {
          materialIconName: "edit",
        });
        editButton.visible = false;
        editButton.onclick = () => {
          this._editInput.nameInput.inputValue = prop.name.value;
          this._editInput.valueInput.labelElement.textContent = `${prop.group}: ${prop.name.value}`;
          this._editInput.valueInput.inputValue = value.toString();
          this._editInput.visible = true;
          this._editInputPopper.update();

          this._editInput.acceptButton.onclick = () => {
            this._editInput.visible = false;
            const inputValue = this._editInput.valueInput.inputValue;
            prop.value.value = inputValue;
            propTag.value = inputValue;
            if (prop.value.Constructor && prop.value.key) {
              this.propsManager.addChange(
                {
                  expressID: prop.expressID,
                  propName: prop.value.key,
                  newValue: new prop.value.Constructor(inputValue),
                },
                fragmentID
              );
            }
          };
        };
        propTag.addChild(editButton);

        propTag.get().onmouseover = () => {
          editButton.visible = true;
        };
        propTag.get().onmouseout = () => {
          editButton.visible = false;
        };
      });
      groupTree.collapse(true);
    }
  }

  private storeProperty(
    props: IModelProperties,
    expressID: number,
    data: IPropData
  ) {
    if (!props[expressID]) {
      props[expressID] = {};
    }
    props[expressID][`${data.name.prefix}${data.name.value}`] = data;
  }

  /**
   * @description Foundation function that returns entity attributes.
   * @param model
   * @param expressID
   */
  private processAttributes(
    properties: Record<string, any>,
    expressID: number,
    options?: { group?: string; prefix?: string }
  ) {
    const props = properties[expressID];
    if (!props) {
      return null;
    }
    const _options = { group: "Attributes", prefix: "", ...options };
    const { group, prefix } = _options;

    const attrs = [
      "GlobalId",
      "IfcEntity",
      "Name",
      "Description",
      "Tag",
      "Type",
      "LongName",
    ];

    const attributes: Record<string, any> = {};

    attrs.forEach((attribute) => {
      if (props[attribute]) {
        const key = attribute[0].toLocaleLowerCase() + attribute.slice(1);
        const value: IPropData = {
          name: {
            prefix,
            value: attribute,
            type: 1,
            Constructor: null,
          },
          value: {
            ...props[attribute],
            Constructor: props[attribute].constructor ?? null,
            key: attribute,
          },
          group,
          expressID: props.expressID,
        };
        attributes[key] = value;
      }
    });
    return attributes as IEntityAttributes;
  }

  private processElements(
    properties: Record<string, any>,
    expressIDs: string[],
    props: IModelProperties
  ) {
    const arrayProperties = Object.values(properties);

    // #region Building properties
    let buildingAttributes: IEntityAttributes | null;
    const building: any = arrayProperties.find(
      (prop: any) => prop.type === WEBIFC.IFCBUILDING
    );
    if (building) {
      buildingAttributes = this.processAttributes(
        properties,
        building.expressID,
        {
          group: "Building",
          prefix: "Building",
        }
      );
    }
    // #endregion

    // #region Site properties
    let siteAttributes: IEntityAttributes | null;
    const site: any = arrayProperties.find(
      (prop: any) => prop.type === WEBIFC.IFCSITE
    );
    if (site) {
      siteAttributes = this.processAttributes(properties, site.expressID, {
        group: "Site",
        prefix: "Site",
      });
    }
    // #endregion

    expressIDs.forEach((expressID) => {
      const elementAttributes = this.processAttributes(
        properties,
        Number(expressID)
      );
      if (elementAttributes) {
        for (const name in elementAttributes) {
          // @ts-ignore
          const attribute = elementAttributes[name];
          this.storeProperty(props, Number(expressID), attribute);
        }
      }
      if (buildingAttributes) {
        const { globalId, type, tag, ifcEntity, ...attrs } = buildingAttributes;
        for (const name in attrs) {
          // @ts-ignore
          const attribute = attrs[name];
          this.storeProperty(props, Number(expressID), attribute);
        }
      }
      if (siteAttributes) {
        const { globalId, type, tag, ifcEntity, ...attrs } = siteAttributes;
        for (const name in attrs) {
          // @ts-ignore
          const attribute = attrs[name];
          this.storeProperty(props, Number(expressID), attribute);
        }
      }
    });
  }

  private processPsets(
    properties: Record<string, any>,
    props: IModelProperties,
    expressIDs: number[]
  ) {
    expressIDs.forEach((elementID) => {
      getElementPsets(properties, Number(elementID), (psetID) => {
        const pset = properties[psetID];
        getPsetProps(properties, psetID, (propertyID) => {
          const prop = properties[propertyID];
          const value =
            prop.NominalValue?.constructor.name === "IfcBoolean"
              ? prop.NominalValue.value === "T"
              : prop.NominalValue?.value;

          const data: IPropData = {
            name: {
              prefix: "",
              ...prop.Name,
              Constructor: prop.Name?.constructor ?? null,
            },
            value: {
              value,
              type: prop.NominalValue?.type,
              Constructor: prop.NominalValue?.constructor ?? null,
              key: "NominalValue",
            },
            group: pset.Name.value,
            expressID: prop.expressID,
          };
          this.storeProperty(props, elementID, data);
        });
      });
    });
  }

  private processQsets(
    properties: Record<string, any>,
    props: IModelProperties,
    expressIDs: number[]
  ) {
    expressIDs.forEach((elementID) => {
      getElementQsets(properties, Number(elementID), (qsetID) => {
        const qset = properties[qsetID];
        getQsetQuantities(properties, qsetID, (quantityID) => {
          const qto = properties[quantityID];
          const entityName = IfcCategoryMap[qto.type];
          let valuePropName = entityName
            .replace(/IFCQUANTITY/, "")
            .toLowerCase();
          valuePropName = `${
            valuePropName[0].toUpperCase() + valuePropName.slice(1)
          }Value`;
          const data: IPropData = {
            name: {
              prefix: "",
              ...qto.Name,
              typeConstructor: qto.Name?.constructor.name ?? null,
              Constructor: qto.Name?.constructor ?? null,
            },
            value: {
              ...qto[valuePropName],
              typeConstructor: qto[valuePropName]?.constructor.name ?? null,
              Constructor: qto[valuePropName]?.constructor ?? null,
              key: valuePropName,
            },
            group: qset.Name.value,
            expressID: qto.expressID,
          };
          this.storeProperty(props, Number(elementID), data);
        });
      });
    });
  }

  private processStoreys(
    properties: Record<string, any>,
    props: IModelProperties
  ) {
    getRelationMap(
      properties,
      WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      (storeyID, expressIDs) => {
        const storey = properties[storeyID];
        const storeyAttributes = this.processAttributes(properties, storeyID, {
          group: "Storey",
          prefix: "Storey",
        });
        expressIDs.forEach((expressID: number) => {
          if (storey.Elevation) {
            const elevation: IPropData = {
              name: {
                prefix: "",
                value: "StoreyElevation",
                type: 1,
                Constructor: null,
              },
              value: {
                ...storey.Elevation,
                typeConstructor: storey.Elevation?.constructor.name ?? null,
                Constructor: storey.Elevation?.constructor ?? null,
                key: "Elevation",
              },
              group: "Storey",
              expressID: storey.expressID,
            };
            this.storeProperty(props, expressID, elevation);
          }
          if (storeyAttributes) {
            const { globalId, type, tag, ifcEntity, ...attrs } =
              storeyAttributes;
            for (const name in attrs) {
              // @ts-ignore
              const attribute = attrs[name];
              this.storeProperty(props, expressID, attribute);
            }
          }
        });
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
          prefix: `Group: ${group.Name?.value}`,
        });
        expressIDs.forEach((expressID: number) => {
          if (groupAttributes?.name) {
            this.storeProperty(props, expressID, groupAttributes.name);
          }
          if (groupAttributes?.description) {
            this.storeProperty(props, expressID, groupAttributes.description);
          }
        });
      }
    );
  }

  // createGroupSystem(propName: string, autoAdd: boolean) {

  // }
}

export * from "./src";
