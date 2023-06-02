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
import { Components } from "../Components";
import { PropertyTag } from "./src/property-tag";
import {
  FragmentGroup,
  FragmentManager,
  FragmentHighlighter,
} from "../../fragments";

// TODO: Clean up, making more modular, decouple from fragments and
//  move to IFC folder

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
  typeConstructor: string | null;
  value: string;
  type: number;
}

interface PropValue {
  typeConstructor: string | null;
  value: string | number | boolean;
  type: number;
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
  private _propsList: VerticalStack;
  private _editInput: EditProp;
  private _editInputPopper: PopperInstance;
  private _fragmentsHighlighter: FragmentHighlighter;
  private _fragmentsManager: FragmentManager;
  private _map: IPropertiesList = {};
  private _config: PropertiesProcessorConfig = {
    selectionHighlighter: "select",
  };

  constructor(
    components: Components,
    fragmentManager: FragmentManager,
    fragmentHighlighter: FragmentHighlighter,
    config?: PropertiesProcessorConfig
  ) {
    super();
    this.components = components;
    this._config = { ...this._config, ...config };
    this._fragmentsManager = fragmentManager;
    this._fragmentsHighlighter = fragmentHighlighter;

    this._propsList = new VerticalStack(this.components);

    this._editInput = new EditProp(this.components);
    this._editInput.visible = false;
    this._editInput.nameInput.visible = false;
    this.components.ui.add(this._editInput);

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
        const modelID =
          this._fragmentsManager.list[fragmentID].mesh.parent?.uuid;
        if (!modelID) {
          return;
        }
        this.renderProperties(modelID, expressID);
      }
    );
  }

  get(): IPropertiesList {
    return this._map;
  }

  process(model: FragmentGroup) {
    const props: IModelProperties = {};
    this.processElements(model, props);
    this.processStoreys(model, props);
    this.processQsets(model, props);
    this.processPsets(model, props);
    this._map[model.uuid] = props;
    return props;
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

  renderProperties(modelID: string, expressID: string) {
    this._propsList.dispose(true);
    const modelProperties = this.get()[modelID];
    if (!modelProperties) {
      return;
    }
    const elementProperties = modelProperties[expressID];
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
          this._editInput.valueInput.labelElement.textContent = `${prop.name.prefix}: ${prop.name.value}`;
          this._editInput.valueInput.inputValue = value.toString();
          this._editInput.valueInput.get().focus();
          this._editInput.visible = true;
          this._editInputPopper.update();

          this._editInput.acceptButton.onclick = () => {
            this._editInput.visible = false;
            const inputValue = this._editInput.valueInput.inputValue;
            prop.value.value = inputValue;
            propTag.value = inputValue;
          };

          console.log(prop);
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
   * @description Foundation function that returns basic entity information such as name, description, type, globalID and tag. That information is called attributes in the IFC Schema.
   * @param model
   * @param expressID
   */
  private processAttributes(
    model: FragmentGroup,
    expressID: number,
    options?: { group?: string; prefix?: string }
  ) {
    const props = model.properties[expressID];
    if (!props) {
      return null;
    }
    const _options = { group: "Attributes", prefix: "", ...options };
    const { group, prefix } = _options;
    const attributes: IEntityAttributes = {
      globalId: {
        name: {
          prefix,
          value: "GlobalId",
          type: 1,
          typeConstructor: null,
        },
        value: {
          ...props.GlobalId,
          typeConstructor: props.GlobalId?.constructor.name ?? null,
        },
        group,
        expressID: props.expressID,
      },
      ifcEntity: {
        name: {
          prefix,
          value: "IfcEntity",
          type: 1,
          typeConstructor: null,
        },
        value: {
          value: model.allTypes[props.type],
          type: 1,
          typeConstructor: null,
        },
        group,
        expressID: props.expressID,
      },
    };
    if (props.Name) {
      attributes.name = {
        name: {
          prefix,
          value: "Name",
          type: 1,
          typeConstructor: null,
        },
        value: {
          ...props.Name,
          typeConstructor: props.Name?.constructor.name ?? null,
        },
        group,
        expressID: props.expressID,
      };
    }
    if (props.Description) {
      attributes.description = {
        name: {
          prefix,
          value: "Description",
          type: 1,
          typeConstructor: null,
        },
        value: {
          ...props.Description,
          typeConstructor: props.Description?.constructor.name ?? null,
        },
        group,
        expressID: props.expressID,
      };
    }
    if (props.Tag) {
      attributes.tag = {
        name: {
          prefix,
          value: "Tag",
          type: 1,
          typeConstructor: null,
        },
        value: {
          ...props.Tag,
          typeConstructor: props.Tag?.constructor.name ?? null,
        },
        group,
        expressID: props.expressID,
      };
    }
    if (props.ObjectType) {
      attributes.type = {
        name: {
          prefix,
          value: "Type",
          type: 1,
          typeConstructor: null,
        },
        value: {
          ...props.ObjectType,
          typeConstructor: props.ObjectType?.constructor.name ?? null,
        },
        group,
        expressID: props.expressID,
      };
    }
    if (props.LongName) {
      attributes.longName = {
        name: {
          prefix,
          value: "LongName",
          type: 1,
          typeConstructor: null,
        },
        value: {
          ...props.LongName,
          typeConstructor: props.LongName?.constructor.name ?? null,
        },
        group,
        expressID: props.expressID,
      };
    }
    return attributes;
  }

  private processElements(model: FragmentGroup, props: IModelProperties) {
    const properties = model.properties;
    const arrayProperties = Object.values(properties);

    // #region Building properties
    let buildingAttributes: IEntityAttributes | null;
    const building: any = arrayProperties.find(
      (prop: any) => prop.type === WEBIFC.IFCBUILDING
    );
    if (building) {
      buildingAttributes = this.processAttributes(model, building.expressID, {
        group: "Building",
        prefix: "Building",
      });
    }
    // #endregion

    // #region Site properties
    let siteAttributes: IEntityAttributes | null;
    const site: any = arrayProperties.find(
      (prop: any) => prop.type === WEBIFC.IFCSITE
    );
    if (site) {
      siteAttributes = this.processAttributes(model, site.expressID, {
        group: "Site",
        prefix: "Site",
      });
    }
    // #endregion

    model.fragments.forEach((fragment) => {
      fragment.items.forEach((expressID) => {
        const elementAttributes = this.processAttributes(
          model,
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
          const { globalId, type, tag, ifcEntity, ...attrs } =
            buildingAttributes;
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
    });
  }

  private processPsets(model: FragmentGroup, props: IModelProperties) {
    const properties = model.properties;
    const arrayProperties = Object.values(properties);
    const psetRels = arrayProperties.filter((prop: any) => {
      const isRel = prop.type === WEBIFC.IFCRELDEFINESBYPROPERTIES;
      const propertyDefinitionID = prop.RelatingPropertyDefinition?.value;
      const isPset =
        properties[propertyDefinitionID]?.type === WEBIFC.IFCPROPERTYSET;
      return isRel && isPset;
    });
    psetRels.forEach((rel: any) => {
      const definition = properties[rel.RelatingPropertyDefinition.value];
      const elements = rel.RelatedObjects.map((obj: any) => {
        return obj.value;
      });
      elements.forEach((expressID: number) => {
        const definitionProperties = definition.HasProperties.map(
          (prop: any) => {
            return properties[prop.value];
          }
        );
        definitionProperties.forEach((prop: any) => {
          const value =
            prop.NominalValue?.constructor.name === "IfcBoolean"
              ? prop.NominalValue.value === "T"
              : prop.NominalValue?.value;

          const data: IPropData = {
            name: {
              prefix: "",
              ...prop.Name,
              typeConstructor: prop.Name?.constructor.name ?? null,
            },
            value: {
              value,
              type: prop.NominalValue?.type,
              typeConstructor: prop.NominalValue?.constructor.name ?? null,
            },
            group: definition.Name.value,
            expressID: prop.expressID,
          };
          this.storeProperty(props, expressID, data);
        });
      });
    });
  }

  private processQsets(model: FragmentGroup, props: IModelProperties) {
    const properties = model.properties;
    const arrayProperties = Object.values(properties);
    const qsetRels = arrayProperties.filter((prop: any) => {
      const isRel = prop.type === WEBIFC.IFCRELDEFINESBYPROPERTIES;
      const propertyDefinitionID = prop.RelatingPropertyDefinition?.value;
      const isQset =
        properties[propertyDefinitionID]?.type === WEBIFC.IFCELEMENTQUANTITY;
      return isRel && isQset;
    });
    qsetRels.forEach((rel: any) => {
      const definition = properties[rel.RelatingPropertyDefinition.value];
      const elements = rel.RelatedObjects.map((obj: any) => {
        return obj.value;
      });
      elements.forEach((expressID: number) => {
        const definitionQuantities = definition.Quantities.map((prop: any) => {
          return properties[prop.value];
        });
        definitionQuantities.forEach((qto: any) => {
          const entityName = model.allTypes[qto.type];
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
            },
            value: {
              ...qto[valuePropName],
              typeConstructor: qto[valuePropName]?.constructor.name ?? null,
            },
            group: definition.Name.value,
            expressID: qto.expressID,
          };
          this.storeProperty(props, expressID, data);
        });
      });
    });
  }

  private processStoreys(model: FragmentGroup, props: IModelProperties) {
    const properties = model.properties;
    const arrayProperties = Object.values(properties);
    const spatialRelations = arrayProperties.filter((prop: any) => {
      return prop.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE;
    });
    spatialRelations.forEach((rel: any) => {
      const structure = properties[rel.RelatingStructure.value];
      if (structure.type !== WEBIFC.IFCBUILDINGSTOREY) {
        return;
      }
      const elements = rel.RelatedElements.map((el: any) => {
        return el.value;
      });
      const storeyAttributes = this.processAttributes(
        model,
        structure.expressID,
        {
          group: "Storey",
          prefix: "Storey",
        }
      );

      elements.forEach((expressID: number) => {
        if (structure.Elevation) {
          const elevation: IPropData = {
            name: {
              prefix: "",
              value: "StoreyElevation",
              type: 1,
              typeConstructor: null,
            },
            value: {
              ...structure.Elevation,
              typeConstructor: structure.Elevation?.constructor.name ?? null,
            },
            group: "Storey",
            expressID: structure.expressID,
          };
          this.storeProperty(props, expressID, elevation);
        }
        if (storeyAttributes) {
          const { globalId, type, tag, ifcEntity, ...attrs } = storeyAttributes;
          for (const name in attrs) {
            // @ts-ignore
            const attribute = attrs[name];
            this.storeProperty(props, expressID, attribute);
          }
        }
      });
    });
  }

  // createGroupSystem(propName: string, autoAdd: boolean) {

  // }
}
