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

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/material-facet.md

export class IDSMaterial extends IDSFacet {
  private _ifcMaterialEntities = [
    /^IFCMATERIALLAYERSETUSAGE$/,
    /^IFCMATERIALCONSTITUENTSET$/,
    /^IFCMATERIAL$/,
    /^IFCMATERIALLIST$/,
  ];

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
        ? `instructions="${this.instructions}"`
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
          MaterialConstituents: { attributes: true, relations: true },
          ForLayerSet: { attributes: true, relations: true },
          MaterialLayers: { attributes: true, relations: true },
          Materials: { attributes: true, relations: false },
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
    }
  }

  async test(items: ModelIdMap, collector: ModelIdDataMap<IDSItemCheckResult>) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;

      const data = await model.getItemsData([[...localIds][0]], {
        relations: {
          AssociatedTo: { attributes: false, relations: false },
          HasAssociations: { attributes: true, relations: true },
          MaterialConstituents: { attributes: true, relations: true },
          ForLayerSet: { attributes: true, relations: true },
          MaterialLayers: { attributes: true, relations: true },
          Materials: { attributes: true, relations: false },
        },
      });

      for (const item of data) {
        const checks = this.getItemChecks(collector, modelId, item);
        if (!checks) continue;

        // If it doesn't have associations
        // is because it doesn't have materials
        if (!Array.isArray(item.HasAssociations)) {
          checks.push({
            parameter: null,
            currentValue: null,
            requiredValue: this.value,
            pass: false,
          });
          continue;
        }

        for (const association of item.HasAssociations) {
          if (
            !this._ifcMaterialEntities.some((parent) => {
              if (!("value" in association._category)) return false;
              return parent.test(association._category.value);
            })
          ) {
            continue;
          }

          const isValid = this.hasValidMaterial(association, checks);
          if (isValid) break;
        }
      }
    }
  }

  private hasValidMaterial(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    let isValid = false;
    if ("value" in item._category && item._category.value === "IFCMATERIAL") {
      const result = this.evalValue(item, checks);
      if (result) isValid = true;
    } else {
      // if its not a material, it should be a parent
      for (const [name, attribute] of Object.entries(item)) {
        if (
          ![
            "ForLayerSet",
            "MaterialLayers",
            "Material",
            "MaterialConstituents",
            "Materials",
          ].includes(name)
        )
          continue;
        if (!Array.isArray(attribute)) continue;
        for (const item of attribute) {
          const isMaterial =
            "value" in item._category && item._category.value === "IFCMATERIAL";
          if (isMaterial) {
            const result = this.evalValue(item, checks);
            if (result) {
              isValid = true;
              break;
            }
          } else {
            const result = this.hasValidMaterial(item);
            if (result) {
              isValid = true;
              break;
            }
          }
        }
      }
    }
    return isValid;
  }

  private evalValue(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    if (!this.value) {
      checks?.push({
        parameter: null,
        currentValue:
          item.Name && "value" in item.Name ? item.Name.value : null,
        pass: true,
      });
      return true;
    }
    if (
      !("value" in item._category && item._category.value === "IFCMATERIAL")
    ) {
      return null;
    }

    let result = false;

    if (item.Name && "value" in item.Name) {
      result = this.evalRequirement(
        item.Name.value,
        this.value,
        "Value",
        checks,
      );
    }

    if (result) return result;

    // IDSDocs: if the name doesn't match, the category is also an option
    // to look at.
    if (item.Category && "value" in item.Category) {
      result = this.evalRequirement(
        item.Category.value,
        this.value,
        "Value",
        checks,
      );
    }

    return result;
  }
}
