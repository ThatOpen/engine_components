import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { Components } from "../../../../core";
import { getParameterXML } from "../exporters/parameter";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { IDSFacet } from "./Facet";
import { IfcRelationsIndexer } from "../../../../ifc";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/material-facet.md

export class IDSMaterial extends IDSFacet {
  facetType = "Material" as const;
  value?: IDSFacetParameter;
  uri?: string;

  protected getMaterialDefinition = {
    [WEBIFC.IFCMATERIAL]: (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): string[] | null => {
      const values: string[] = [];
      if (attr.Name) values.push(attr.Name.value);
      if (attr.Category) values.push(attr.Category.value);
      return values.length > 0 ? values : null;
    },
    [WEBIFC.IFCMATERIALLIST]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materials = attr.Materials;
      if (!materials) return null;
      const materialValues = await Promise.all(
        materials.map(async (material: any) => {
          const materialAttrs = await model.getProperties(material.value);
          return this.getMaterialDefinition[WEBIFC.IFCMATERIAL](
            model,
            materialAttrs,
          );
        }),
      );
      return materialValues.length > 0 ? materialValues.flat() : null;
    },
    [WEBIFC.IFCMATERIALLAYER]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materialAttrs = await model.getProperties(attr.Material?.value);
      if (!materialAttrs) return null;
      return this.getMaterialDefinition[WEBIFC.IFCMATERIAL](
        model,
        materialAttrs,
      );
    },
    [WEBIFC.IFCMATERIALLAYERSET]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materialLayers = attr.MaterialLayers;
      const layerSetAttrs = await Promise.all(
        materialLayers.map(async ({ value }: any) => {
          const materialProfile = await model.getProperties(value);
          return this.getMaterialDefinition[WEBIFC.IFCMATERIALLAYER](
            model,
            materialProfile,
          );
        }),
      );
      if (!layerSetAttrs || layerSetAttrs.length === 0) return null;
      return layerSetAttrs.length === 1 ? layerSetAttrs[0] : layerSetAttrs;
    },
    [WEBIFC.IFCMATERIALLAYERSETUSAGE]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const layerSet = attr.ForLayerSet;
      const layerSetAttrs = await model.getProperties(layerSet.value);
      const materialDefinition = this.getMaterialDefinition[
        WEBIFC.IFCMATERIALLAYERSET
      ](model, layerSetAttrs);
      if (!materialDefinition) return null;
      return materialDefinition;
    },
    [WEBIFC.IFCMATERIALPROFILE]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materialAttrs = await model.getProperties(attr.Material?.value);
      if (!materialAttrs) return null;
      return this.getMaterialDefinition[WEBIFC.IFCMATERIAL](
        model,
        materialAttrs,
      );
    },
    [WEBIFC.IFCMATERIALPROFILESET]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materialProfiles = attr.MaterialProfiles;
      const profileSetAttrs = await Promise.all(
        materialProfiles.map(async ({ value }: any) => {
          const materialProfile = await model.getProperties(value);
          return this.getMaterialDefinition[WEBIFC.IFCMATERIALPROFILE](
            model,
            materialProfile,
          );
        }),
      );
      if (!profileSetAttrs || profileSetAttrs.length === 0) return null;
      return profileSetAttrs.length === 1
        ? profileSetAttrs[0]
        : profileSetAttrs;
    },
    [WEBIFC.IFCMATERIALPROFILESETUSAGE]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const profileSet = attr.ForProfileSet;
      const profileSetAttrs = await model.getProperties(profileSet.value);
      const materialDefinition = this.getMaterialDefinition[
        WEBIFC.IFCMATERIALPROFILESET
      ](model, profileSetAttrs);
      if (!materialDefinition) return null;
      return materialDefinition;
    },
    [WEBIFC.IFCMATERIALCONSTITUENT]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materialAttrs = await model.getProperties(attr.Material?.value);
      const values: string[] = [];
      if (attr.Name) values.push(attr.Name.value);
      if (attr.Category) values.push(attr.Category.value);
      if (!materialAttrs) return null;
      const materialValue = this.getMaterialDefinition[WEBIFC.IFCMATERIAL](
        model,
        materialAttrs,
      );
      if (materialValue) values.push(...materialValue);
      return values.length > 0 ? values : null;
    },
    [WEBIFC.IFCMATERIALCONSTITUENTSET]: async (
      model: FRAGS.FragmentsGroup,
      attr: any,
    ): Promise<string[] | null> => {
      const materialConstituents = attr.MaterialConstituents;
      const values: string[] = [];
      if (attr.Name) values.push(attr.Name.value);
      if (attr.Category) values.push(attr.Category.value);
      if (!materialConstituents) return null;
      const constituentSetAttrs = await Promise.all(
        materialConstituents.map(async ({ value }: any) => {
          const materialProfile = await model.getProperties(value);
          return this.getMaterialDefinition[WEBIFC.IFCMATERIALCONSTITUENT](
            model,
            materialProfile,
          );
        }),
      );
      if (constituentSetAttrs) {
        constituentSetAttrs.flat().forEach((constituentSet) => {
          if (!values.includes(constituentSet)) values.push(constituentSet);
        });
      }
      return values.length > 0 ? values : null;
    },
  };

  constructor(components: Components, value?: IDSFacetParameter) {
    super(components);
    this.value = value;
  }
  serialize(type: "applicability" | "requirement") {
    if (!(this.value && this.uri)) return "<ids:material />";
    const valueXML = getParameterXML("Value", this.value);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.uri ? `uri=${this.uri}` : "";
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<ids:material ${attributes}>
  ${valueXML}
</ids:material>`;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const materialRelations = await model.getAllPropertiesOfType(
      WEBIFC.IFCRELASSOCIATESMATERIAL,
    );

    if (!materialRelations || Object.keys(materialRelations).length === 0)
      return [];

    const matchingSets: number[] = [];

    for (const _materialRelID in materialRelations) {
      const materialRelID = Number(_materialRelID);
      const materialRelation = materialRelations[materialRelID];
      const materialID = materialRelation.RelatingMaterial.value;
      const attr = await model.getProperties(materialID);
      if (
        !attr ||
        !Object.keys(this.getMaterialDefinition).includes(String(attr.type))
      )
        continue;
      const type = attr.type as keyof typeof this.getMaterialDefinition;
      const materialDefinition = await this.getMaterialDefinition[type](
        model,
        attr,
      );
      if (!materialDefinition) continue;
      const validValue = await this.evalValue(materialDefinition);
      if (!validValue || materialRelation.RelatedObjects.length === 0) continue;

      let elements: number[] = [];
      for (const objects of [...materialRelation.RelatedObjects]) {
        elements = [...elements, objects.value];
      }
      for (const _expressID in elements) {
        const expressID = elements[Number(_expressID)];
        const attrs = await model.getProperties(expressID);
        if (!attrs) continue;
        this.entities[expressID] = attrs;
        if (expressID in collector) continue;
        collector[expressID] = attrs;
      }
      matchingSets.push(...elements);
    }

    return matchingSets;
  }

  async test(entities: FRAGS.IfcProperties, model: FRAGS.FragmentsGroup) {
    this.testResult = [];
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];
      const checks: IDSCheck[] = [];
      const result: IDSCheckResult = {
        guid: attrs.GlobalId?.value,
        expressID,
        pass: false,
        checks,
        cardinality: this.cardinality,
      };
      this.testResult.push(result);

      const indexer = this.components.get(IfcRelationsIndexer);

      const materialExpressIds = indexer.getEntityRelations(
        model,
        expressID,
        "HasAssociations",
      );
      if (
        materialExpressIds.length === 0 &&
        (this.cardinality === "prohibited" || this.cardinality === "optional")
      )
        result.pass = true;

      for (const materialExpressId of materialExpressIds) {
        const materialAttrs = await model.getProperties(materialExpressId);
        if (
          !materialAttrs ||
          !Object.keys(this.getMaterialDefinition).includes(
            String(materialAttrs.type),
          )
        )
          continue;
        const type =
          materialAttrs.type as keyof typeof this.getMaterialDefinition;
        const materialDefinition = await this.getMaterialDefinition[type](
          model,
          materialAttrs,
        );
        if (!materialDefinition) continue;
        materialDefinition.forEach((materialValue) => {
          const pass = this.value
            ? this.evalRequirement(materialValue ?? null, this.value, "Value")
            : this.cardinality !== "prohibited";

          checks.push({
            currentValue: materialValue,
            parameter: "Value",
            pass,
            requiredValue: this.value ? this.value.parameter : undefined,
          });
          if (pass)
            result.pass = this.cardinality === "prohibited" ? false : pass;
        });
      }
    }
    return this.testResult;
  }

  protected async evalValue(attrs: any, checks?: IDSCheck[]) {
    if (!this.value) return false;
    const result = this.evalRequirement(attrs, this.value, "Value", checks);
    return result;
  }
}
