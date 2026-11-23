import * as FRAGS from "@thatopen/fragments";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { getParameterXML } from "../exporters/parameter";
import { IDSCheck, IDSFacetParameter, IDSItemCheckResult } from "../types";
import { IDSFacet } from "./Facet";
import { ModelIdMapUtils } from "../../../../utils";
import { XML } from "../../../../utils/xml";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/material-facet.md

export class IDSMaterial extends IDSFacet {
  // Every type IfcRelAssociatesMaterial.RelatingMaterial (IfcMaterialSelect)
  // can point at. Missing any of them silently drops every element that
  // associates its material through it: an element can reference a layer set
  // directly instead of through a layer set usage, and both spellings are
  // valid IFC.
  private _ifcMaterialEntities = [
    /^IFCMATERIALLAYERSETUSAGE$/,
    /^IFCMATERIALLAYERSET$/,
    /^IFCMATERIALPROFILESETUSAGE$/,
    /^IFCMATERIALPROFILESET$/,
    /^IFCMATERIALCONSTITUENTSET$/,
    /^IFCMATERIAL$/,
    /^IFCMATERIALLIST$/,
  ];

  // Attributes that lead from a material set / usage down to its IfcMaterial.
  private _materialParentAttributes = [
    "ForLayerSet",
    "MaterialLayers",
    "ForProfileSet",
    "MaterialProfiles",
    "Material",
    "MaterialConstituents",
    "Materials",
  ];

  private _materialRelations = {
    MaterialConstituents: { attributes: true, relations: true },
    ForLayerSet: { attributes: true, relations: true },
    MaterialLayers: { attributes: true, relations: true },
    ForProfileSet: { attributes: true, relations: true },
    MaterialProfiles: { attributes: true, relations: true },
    Materials: { attributes: true, relations: false },
  };

  facetType = "Material" as const;
  value?: IDSFacetParameter;
  uri?: string;

  serialize(type: "applicability" | "requirement") {
    if (!(this.value && this.uri)) return "<material />";
    const valueXML = getParameterXML("Value", this.value);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.uri ? `uri=${this.uri}` : "";
      attributes += this.instructions
        ? `instructions="${XML.escape(this.instructions)}"`
        : "";
    }
    return `<material ${attributes}>
  ${valueXML}
</material>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    const fragments = this._components.get(FragmentsManager);

    for (const [modelId, model] of fragments.list) {
      const isValidModel = modelIds.find((regex) => regex.test(modelId));
      if (!isValidModel) continue;

      // IFCMATERIALLIST: DONE
      // IFCMATERIALLAYERSETUSAGE: DONE
      // IFCMATERIALCONSTITUENTSET: DONE
      // IFCMATERIAL: DONE
      const items = await model.getItemsOfCategories(this._ifcMaterialEntities);
      const localIds = Object.values(items).flat();
      if (localIds.length === 0) continue;

      const data = await model.getItemsData(localIds, {
        relations: {
          AssociatedTo: { attributes: true, relations: false },
          ...this._materialRelations,
        },
      });

      for (const item of data) {
        if (
          !(
            "value" in item._localId &&
            "value" in item._category &&
            Array.isArray(item.AssociatedTo)
          )
        ) {
          continue;
        }

        const isValid = this.hasValidMaterial(item);
        if (!isValid) continue;

        const relations = item.AssociatedTo.map((relation) => {
          if (!("value" in relation._localId && relation._localId.value))
            return null;
          return relation._localId.value;
        }).filter((value) => value !== null);

        ModelIdMapUtils.append(collector, modelId, ...relations);
      }

      await this.appendTypeInstances(model, modelId, collector);
    }
  }

  /**
   * An element without a material of its own uses its type's material, so
   * when a matching material is associated to a type, the type's instances
   * that have no material association themselves apply too.
   */
  private async appendTypeInstances(
    model: FRAGS.FragmentsModel,
    modelId: string,
    collector: ModelIdMap,
  ) {
    const selected = collector[modelId];
    if (!selected || selected.size === 0) return;

    const related = { attributes: true, relations: false };
    const types = await model.getItemsData([...selected], {
      attributesDefault: false,
      relations: {
        // The fragments name for the inverse of IfcRelDefinesByType, and
        // the IFC one, in case a file stores that (as in IDSProperty).
        ObjectTypeOf: related,
        Types: related,
      },
    });

    const instanceIds = new Set<number>();
    for (const type of types) {
      const instances = [
        ...(Array.isArray(type.ObjectTypeOf) ? type.ObjectTypeOf : []),
        ...(Array.isArray(type.Types) ? type.Types : []),
      ];
      for (const instance of instances) {
        if (!(instance._localId && "value" in instance._localId)) continue;
        const id = instance._localId.value;
        if (typeof id === "number" && !selected.has(id)) instanceIds.add(id);
      }
    }
    if (instanceIds.size === 0) return;

    const instances = await model.getItemsData([...instanceIds], {
      attributesDefault: false,
      relations: { HasAssociations: related },
    });
    const inheriting: number[] = [];
    for (const instance of instances) {
      if (!("value" in instance._localId)) continue;
      if (this.getMaterialAssociations(instance).length > 0) continue;
      inheriting.push(instance._localId.value as number);
    }
    ModelIdMapUtils.append(collector, modelId, ...inheriting);
  }

  private getMaterialAssociations(item: FRAGS.ItemData) {
    if (!Array.isArray(item.HasAssociations)) return [];
    return item.HasAssociations.filter((association) =>
      this._ifcMaterialEntities.some(
        (entity) =>
          association._category &&
          "value" in association._category &&
          entity.test(String(association._category.value)),
      ),
    );
  }

  /**
   * The material associations of each item's type, for the items that have
   * none of their own.
   */
  private async getTypeMaterialAssociations(
    model: FRAGS.FragmentsModel,
    data: FRAGS.ItemData[],
  ) {
    const typeOf = new Map<number, number>();
    for (const item of data) {
      if (!("value" in item._localId)) continue;
      if (this.getMaterialAssociations(item).length > 0) continue;
      // The type is reached through IsTypedBy or, in models converted by
      // IfcImporter, through IsDefinedBy (as in IDSEntity).
      const definitions = [
        ...(Array.isArray(item.IsTypedBy) ? item.IsTypedBy : []),
        ...(Array.isArray(item.IsDefinedBy) ? item.IsDefinedBy : []),
      ];
      const type = definitions.find(
        (definition) =>
          definition?._category &&
          "value" in definition._category &&
          /TYPE$|^IFCTYPE|STYLE$/.test(String(definition._category.value)),
      );
      if (type && "value" in type._localId) {
        const itemId = item._localId.value as number;
        typeOf.set(itemId, type._localId.value as number);
      }
    }

    const result = new Map<number, FRAGS.ItemData[]>();
    if (typeOf.size === 0) return result;

    const typeIds = [...new Set(typeOf.values())];
    const types = await model.getItemsData(typeIds, {
      relations: {
        HasAssociations: { attributes: true, relations: true },
        ...this._materialRelations,
      },
    });
    const byId = new Map<number, FRAGS.ItemData[]>();
    for (const type of types) {
      if (!("value" in type._localId)) continue;
      byId.set(
        type._localId.value as number,
        this.getMaterialAssociations(type),
      );
    }
    for (const [itemId, typeId] of typeOf) {
      result.set(itemId, byId.get(typeId) ?? []);
    }
    return result;
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

      const data = await model.getItemsData([...localIds], {
        relations: {
          AssociatedTo: { attributes: false, relations: false },
          HasAssociations: { attributes: true, relations: true },
          IsTypedBy: { attributes: true, relations: false },
          IsDefinedBy: { attributes: true, relations: false },
          ...this._materialRelations,
        },
      });

      const typeAssociations = await this.getTypeMaterialAssociations(
        model,
        data,
      );

      for (const item of data) {
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;

        // Its own material, or else its type's.
        let associations = this.getMaterialAssociations(item);
        if (associations.length === 0 && "value" in item._localId) {
          associations =
            typeAssociations.get(item._localId.value as number) ?? [];
        }

        // Without a material association, the element has no material.
        if (associations.length === 0) {
          checks.push({
            parameter: null,
            currentValue: null,
            requiredValue: this.value,
            pass: false,
          });
          continue;
        }

        for (const association of associations) {
          if (this.hasValidMaterial(association, checks)) break;
        }
      }
    }
  }

  /**
   * Whether the material, material set or one of its layers, profiles,
   * constituents or materials matches the facet's value. Per the IDS
   * material facet, the value can be any of their names or categories, so a
   * set with nothing that matches (e.g. an empty constituent set) fails.
   */
  private hasValidMaterial(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    if (!this.value) {
      checks?.push({
        parameter: null,
        currentValue: this.getMaterialNames(item)[0] ?? null,
        pass: true,
      });
      return true;
    }

    const value = this.value;
    const names = this.getMaterialNames(item);
    if (
      names.some((name) => this.evalRequirement(name, value, "Value", checks))
    ) {
      return true;
    }

    for (const [name, attribute] of Object.entries(item)) {
      if (!this._materialParentAttributes.includes(name)) continue;
      if (!Array.isArray(attribute)) continue;
      for (const child of attribute) {
        if (this.hasValidMaterial(child, checks)) return true;
      }
    }

    // Nothing to compare at all: record the failure, so the element doesn't
    // pass for lack of a check.
    if (checks && !checks.some(({ parameter }) => parameter === "Value")) {
      this.evalRequirement(null, value, "Value", checks);
    }
    return false;
  }

  // The names and categories a material facet value can match: a material's
  // Name and Category, a layer set's LayerSetName, a profile or constituent
  // set's Name, and a layer's, profile's or constituent's Name and Category.
  private getMaterialNames(item: FRAGS.ItemData) {
    const names: string[] = [];
    for (const key of ["Name", "LayerSetName", "Category"]) {
      const attribute = item[key];
      if (!attribute || Array.isArray(attribute) || !("value" in attribute)) {
        continue;
      }
      if (typeof attribute.value === "string" && attribute.value !== "") {
        names.push(attribute.value);
      }
    }
    return names;
  }
}
