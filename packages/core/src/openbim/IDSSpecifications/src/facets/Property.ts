import { IDS_PREDEFINED_PROPERTIES } from "./predefined-properties";
import { idsUnitConverter } from "./units";
import * as FRAGS from "@thatopen/fragments";
import { IDSCheck, IDSFacetParameter, IDSItemCheckResult } from "../types";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { XML } from "../../../../utils/xml";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/property-facet.md

export class IDSProperty extends IDSFacet {
  facetType = "Property" as const;
  private _schema = "IFC4";
  private _convertUnit?: Awaited<ReturnType<typeof idsUnitConverter>>;
  propertySet: IDSFacetParameter;
  baseName: IDSFacetParameter;
  value?: IDSFacetParameter;
  dataType?: string;
  uri?: string;

  // These are defined by the IDS specification
  private _unsupportedTypes = [
    "IFCCOMPLEXPROPERTY",
    "IFCPHYSICALCOMPLEXQUANTITY",
  ];

  constructor(
    components: Components,
    propertySet: IDSFacetParameter,
    baseName: IDSFacetParameter,
  ) {
    super(components);
    this.propertySet = propertySet;
    this.baseName = baseName;
  }

  serialize(type: "applicability" | "requirement") {
    const propertySetXML = getParameterXML("PropertySet", this.propertySet);
    const baseNameXML = getParameterXML("BaseName", this.baseName);
    const valueXML = getParameterXML("Value", this.value);
    const dataTypeXML = this.dataType
      ? `dataType="${XML.escape(this.dataType)}"`
      : "";
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.uri ? ` uri="${XML.escape(this.uri)}"` : "";
      attributes += this.instructions
        ? ` instructions="${XML.escape(this.instructions)}"`
        : "";
    }
    return `<property ${dataTypeXML} ${attributes}>
  ${propertySetXML}
  ${baseNameXML}
  ${valueXML}
</property>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    for (const [modelId, model] of this._components.get(FragmentsManager)
      .list) {
      if (!modelIds.some((pattern) => pattern.test(modelId))) continue;
      const ids = Object.values(
        await model.getItemsOfCategories([/.*/]),
      ).flat();
      const results: ModelIdDataMap<IDSItemCheckResult> = new FRAGS.DataMap();
      await this.test({ [modelId]: new Set(ids) }, results, {
        skipIfFails: false,
      });
      const selected = collector[modelId] ?? new Set<number>();
      for (const [id, result] of results.get(modelId) ?? [])
        if (result.pass) selected.add(id);
      if (selected.size) collector[modelId] = selected;
    }
  }

  async test(
    items: ModelIdMap,
    collector: ModelIdDataMap<IDSItemCheckResult>,
    config: { skipIfFails: boolean } = { skipIfFails: true },
  ) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      this._schema = String((await model.getMetadata()).schema);
      this._convertUnit = await idsUnitConverter(model);
      const data = await model.getItemsData([...localIds], {
        relations: {
          IsDefinedBy: { attributes: true, relations: true },
          HasProperties: { attributes: true, relations: true },
          Properties: { attributes: true, relations: true },
          ExtendedProperties: { attributes: true, relations: true },
          IsTypedBy: { attributes: true, relations: true },
          HasPropertySets: { attributes: true, relations: true },
          Unit: { attributes: true, relations: false },
          DefiningUnit: { attributes: true, relations: false },
          DefinedUnit: { attributes: true, relations: false },
          // Both spellings on purpose: old .frag files store the pre-3.4
          // relation name "DefinesOcurrence" (see getEntities above).
          DefinesOccurrence: { attributes: false, relations: false },
          DefinesOcurrence: { attributes: false, relations: false },
        },
      });

      for (const item of data) {
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;

        // Evaluate the facet itself (as if required), then apply the
        // cardinality once. Prohibited: passes when the facet does not match.
        // Optional: never fails ("If the requirement is optional but would fail
        // if it were required instead, the checker tool must not log an
        // error", IDS developer guide).
        const facetChecks: IDSCheck[] = [];
        const present = await this.evalFacet(item, facetChecks);
        const matches =
          facetChecks.length > 0 && facetChecks.every(({ pass }) => pass);

        if (this.cardinality === "prohibited") {
          checks.push({
            parameter: "BaseName",
            currentValue: present ? this.baseName.parameter : null,
            pass: !matches,
            requiredValue: this.baseName,
          } as IDSCheck);
        } else if (this.cardinality === "optional") {
          checks.push({
            parameter: "BaseName",
            currentValue: present ? this.baseName.parameter : null,
            pass: true,
            requiredValue: this.baseName,
          } as IDSCheck);
        } else {
          checks.push(...facetChecks);
        }
      }
    }
  }

  /**
   * Checks the property set, name, value and data type of one item, as for a
   * required facet, and returns whether a property with the required set and
   * name is present at all.
   */
  private async evalFacet(item: FRAGS.ItemData, checks: IDSCheck[]) {
    const sets = await this.getPsets(item);
    const matchingSets = sets.filter((set) => {
      if (!(set.Name && "value" in set.Name)) return false;
      const result = this.evalRequirement(
        set.Name.value,
        this.propertySet,
        "PropertySet",
        undefined,
        "required",
      );
      if (!result) return false;
      checks.push({
        currentValue: set.Name.value,
        parameter: "PropertySet",
        pass: true,
        requiredValue: this.propertySet,
      });
      return true;
    });

    if (matchingSets.length === 0) {
      checks.push({
        currentValue: null,
        parameter: "PropertySet",
        pass: false,
        requiredValue: this.propertySet,
      });
      return false;
    }

    let present = false;
    for (const set of matchingSets) {
      const propsListName = this.getPropertyListName(set);
      if (!propsListName) continue;

      const props = set[propsListName];
      if (!Array.isArray(props)) {
        checks.push({
          currentValue: null,
          parameter: "BaseName",
          pass: false,
          requiredValue: this.baseName,
        });
        continue;
      }

      const matchingProps = props.filter((item) => {
        if (!(item._category && item.Name)) return false;
        if (!("value" in item._category && "value" in item.Name)) return false;
        if (this._unsupportedTypes.includes(item._category.value)) {
          return false;
        }

        const result = this.evalRequirement(
          item.Name.value,
          this.baseName,
          "BaseName",
          undefined,
          "required",
        );
        if (!result) return false;

        checks.push({
          currentValue: item.Name.value,
          parameter: "BaseName",
          pass: true,
          requiredValue: this.baseName,
        });
        return true;
      });

      if (matchingProps.length === 0) {
        checks.push({
          currentValue: null,
          parameter: "BaseName",
          pass: false,
          requiredValue: this.baseName,
        });
        continue;
      }

      present = true;
      for (const item of matchingProps) {
        this.evalValue(item, checks);
        this.evalDataType(item, checks);
        this.evalURI();
      }
    }
    return present;
  }

  private getPropertyListName(item: FRAGS.ItemData) {
    let propsListName: string | undefined;
    if (!(item._category && "value" in item._category)) return propsListName;

    if (item._category.value === "IFCPROPERTYSET")
      propsListName = "HasProperties";
    if (item._category.value === "IFCELEMENTQUANTITY")
      propsListName = "Quantities";

    if (item._category.value === "IFCMATERIALPROPERTIES")
      propsListName = "Properties";
    if (item._category.value === "IFCEXTENDEDMATERIALPROPERTIES")
      propsListName = "ExtendedProperties";
    return propsListName;
  }

  // Every value attribute of a property: NominalValue, ListValues,
  // LowerBoundValue / UpperBoundValue / SetPointValue, EnumerationValues,
  // DefiningValues / DefinedValues, and the quantities' *Value. Relations
  // (arrays of items) and unset attributes are left out.
  private getValueAttrs(item: FRAGS.ItemData) {
    const attrs: { value: unknown; type?: string }[] = [];
    for (const [name, attr] of Object.entries(item)) {
      if (!/Values?$/.test(name) || !attr || Array.isArray(attr)) continue;
      if (!("value" in attr) || attr.value === null || attr.value === undefined)
        continue;
      const attribute = attr as { value: unknown; type?: string };
      const convert = (actual: unknown) =>
        this._convertUnit?.(actual, attribute.type, item, name) ?? actual;
      attrs.push({
        ...attribute,
        value: Array.isArray(attribute.value)
          ? attribute.value.map(convert)
          : convert(attribute.value),
      });
    }
    return attrs;
  }

  private describeValues(values: (string | number | boolean)[]) {
    if (values.length === 0) return null;
    if (values.length === 1) return values[0];
    return values.join(", ");
  }

  // IDS: a property with several values (list, bounded, enumerated, table)
  // matches when any one of them does.
  private getValues(item: FRAGS.ItemData) {
    return this.getValueAttrs(item).flatMap((attr) =>
      Array.isArray(attr.value) ? attr.value : [attr.value],
    ) as (string | number | boolean)[];
  }

  private getTypePsets(item: FRAGS.ItemData) {
    // The element's type is reached either through IsTypedBy (IfcRelDefinesByType)
    // or, depending on the source, through IsDefinedBy. Either way it is the
    // definition that carries `HasPropertySets` (only IfcTypeObject has it), so
    // we collect the property sets from any such definition.
    const definitions = [
      ...(Array.isArray(item.IsTypedBy) ? item.IsTypedBy : []),
      ...(Array.isArray(item.IsDefinedBy) ? item.IsDefinedBy : []),
    ];

    const psets: FRAGS.ItemData[] = [];
    for (const definition of definitions) {
      if (Array.isArray(definition?.HasPropertySets)) {
        psets.push(...definition.HasPropertySets);
      }
    }

    // When the item is itself a type object (e.g. an IfcWallType selected by
    // the applicability), its own property sets are in HasPropertySets.
    if (Array.isArray(item.HasPropertySets)) {
      psets.push(...item.HasPropertySets);
    }

    return psets;
  }

  private async getPsets(item: FRAGS.ItemData) {
    const typeSets = this.getTypePsets(item);
    const materialSets = Array.isArray(item.HasProperties)
      ? item.HasProperties
      : [];
    const definitions = [
      ...(Array.isArray(item.IsDefinedBy) ? item.IsDefinedBy : []),
      ...materialSets,
    ];
    for (const definition of definitions) {
      const category =
        definition._category && "value" in definition._category
          ? String(definition._category.value)
          : "";
      const declared = IDS_PREDEFINED_PROPERTIES[this._schema]?.[category];
      if (!declared) continue;
      const properties: FRAGS.ItemData[] = [];
      for (const [name, type] of Object.entries(declared)) {
        const attribute = definition[name];
        if (!attribute || Array.isArray(attribute) || attribute.value == null)
          continue;
        properties.push({
          _category: { value: "IFCPROPERTYSINGLEVALUE" },
          Name: { value: name },
          NominalValue: { value: attribute.value, type },
        });
      }
      definition._category = { value: "IFCPROPERTYSET" };
      definition.HasProperties = properties;
    }
    if (definitions.length) item = { ...item, IsDefinedBy: definitions };
    if (!Array.isArray(item.IsDefinedBy)) return typeSets;

    const sets: FRAGS.ItemData[] = [];
    // Type property sets already represented by (merged into) an instance
    // pset of the same name, so we don't add them again below.
    const mergedTypeSets = new Set<FRAGS.ItemData>();

    for (const definition of item.IsDefinedBy) {
      if (!(definition.Name && "value" in definition.Name)) continue;
      const definitionName = definition.Name.value;
      const propsListName = this.getPropertyListName(definition);
      if (!(definitionName && propsListName)) continue;

      const typeSet = typeSets.find((set) => {
        if (!(set.Name && "value" in set.Name)) return false;
        return set.Name.value === definitionName;
      });

      if (typeSet) {
        mergedTypeSets.add(typeSet);
        if (
          Array.isArray(typeSet.HasProperties) &&
          Array.isArray(definition.HasProperties)
        ) {
          for (const prop of typeSet.HasProperties) {
            if (!(prop.Name && "value" in prop.Name)) continue;
            const name = prop.Name.value;
            const existingProp = definition.HasProperties.find((p) => {
              if (!(p.Name && "value" in p.Name)) return false;
              return p.Name.value === name;
            });
            if (!existingProp) definition.HasProperties.push(prop);
          }
        }
      }

      sets.push(definition);
    }

    // Type-only property sets (inherited via IsTypedBy with no matching-name
    // instance pset) must still be checked; otherwise a property that lives
    // only on the element's type is reported as missing (issue #708).
    for (const typeSet of typeSets) {
      if (!mergedTypeSets.has(typeSet)) sets.push(typeSet);
    }

    return sets;
  }

  // TODO: Work must to be done to convert numerical value units to IDS-nominated standard units https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/units.md
  private evalValue(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    const values = this.getValues(item);

    if (this.value) {
      const facetValue = this.value;
      const match = values.find((value) => {
        const parameter = structuredClone(facetValue);
        // The IDS XML parser coerces numeric-looking simpleValues to JS numbers
        // (e.g. "410.20257" becomes 410.20257). When the actual IFC value is a
        // string (IFCTEXT, IFCIDENTIFIER, IFCLABEL, ...), a strict comparison
        // against that number always fails, so align the facet value to a
        // string whenever the property value is a string (issue #731).
        if (typeof value === "string" && parameter.type === "simple") {
          parameter.parameter = String(parameter.parameter);
        }
        return this.evalRequirement(
          value,
          parameter,
          "Value",
          undefined,
          "required",
        );
      });
      const pass = match !== undefined;
      if (checks) {
        this.addCheckResult(
          {
            parameter: "Value",
            currentValue: pass ? match : this.describeValues(values),
            pass,
            requiredValue: facetValue,
          },
          checks,
        );
      }
      return pass;
    }

    if (values.length === 0) return true;

    // IDSDocs: Values with a logical unknown always fail
    // if (valueAttr.type === 3 && valueAttr.value === 2) {
    //   checks?.push({
    //     parameter: "Value",
    //     currentValue: null,
    //     pass: false,
    //     requiredValue: null,
    //   });
    //   return false;
    // }

    // IDSDocs: An empty string is considered false
    if (values.every((v) => typeof v === "string" && v.trim() === "")) {
      checks?.push({
        parameter: "Value",
        currentValue: "",
        pass: false,
        requiredValue: this.value,
      });
      return false;
    }

    return true;
  }

  private evalDataType(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    if (!this.dataType) return true;
    const types = this.getValueAttrs(item).map((attr) => attr.type ?? null);
    const dataType = { type: "simple" as const, parameter: this.dataType };
    const match = types.find((type) =>
      this.evalRequirement(type, dataType, "DataType", undefined, "required"),
    );
    const pass = match !== undefined;
    if (checks) {
      this.addCheckResult(
        {
          parameter: "DataType",
          currentValue: pass ? match : types[0] ?? null,
          pass,
          requiredValue: dataType,
        },
        checks,
      );
    }
    return pass;
  }

  private evalURI() {
    return true;
  }
}
