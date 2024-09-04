import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { IDSFacetParameter } from "../types";
import { Components } from "../../../../core/Components";
import { IfcRelationsIndexer } from "../../../../ifc";
import { IDSFacet } from "./Facet";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/property-facet.md

export class IDSProperty extends IDSFacet {
  propertySet: IDSFacetParameter;
  baseName: IDSFacetParameter;
  dataType?: number;
  value?: IDSFacetParameter;
  uri?: string;

  constructor(
    components: Components,
    propertySet: IDSFacetParameter,
    name: IDSFacetParameter,
  ) {
    super(components);
    this.propertySet = propertySet;
    this.baseName = name;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    let sets: FRAGS.IfcProperties = {};
    const psets = await model.getAllPropertiesOfType(WEBIFC.IFCPROPERTYSET);
    sets = { ...sets, ...psets };
    const qsets = await model.getAllPropertiesOfType(WEBIFC.IFCELEMENTQUANTITY);
    sets = { ...sets, ...qsets };
    if (Object.keys(sets).length === 0) return [];

    const matchingSets: number[] = [];

    for (const _setID in sets) {
      const setID = Number(_setID);
      const attrs = await model.getProperties(setID);
      if (!attrs) continue;

      const nameMatches = attrs.Name?.value === this.propertySet.parameter;
      if (!nameMatches) continue;

      let propsListName: string | undefined;
      if (attrs.type === WEBIFC.IFCPROPERTYSET) propsListName = "HasProperties";
      if (attrs.type === WEBIFC.IFCELEMENTQUANTITY)
        propsListName = "Quantities";
      if (!propsListName) continue;

      for (const handle of attrs[propsListName]) {
        const propAttrs = await model.getProperties(handle.value);
        if (!propAttrs) continue;

        const propNameMatches =
          propAttrs.Name?.value === this.baseName.parameter;
        if (!propNameMatches) continue;

        if (this.value) {
          const valueKey = Object.keys(propAttrs).find((name) =>
            name.endsWith("Value"),
          );
          if (!valueKey) continue;
          const valueMatches =
            propAttrs[valueKey].value === this.value.parameter;
          if (!valueMatches) continue;
        }

        matchingSets.push(setID);
      }
    }

    const result: number[] = [];
    const indexer = this.components.get(IfcRelationsIndexer);

    for (const setID of matchingSets) {
      const expressIDs = indexer.getEntitiesWithRelation(
        model,
        "IsDefinedBy",
        setID,
      );

      for (const expressID of expressIDs) {
        if (expressID in collector) continue;
        const attrs = await model.getProperties(expressID);
        if (!attrs) continue;
        collector[expressID] = attrs;
        result.push(expressID);
      }
    }

    return [];
  }

  async test(entities: FRAGS.IfcProperties, model: FRAGS.FragmentsGroup) {
    this.testResult = [];
    const indexer = this.components.get(IfcRelationsIndexer);
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      let matches = false;

      const definitions = indexer.getEntityRelations(
        model,
        expressID,
        "IsDefinedBy",
      );
      if (!definitions) {
        this.saveResult(attrs, matches);
        continue;
      }

      for (const definitionID of definitions) {
        const definitionAttrs = await model.getProperties(definitionID);
        if (!definitionAttrs) continue;

        const nameMatches =
          definitionAttrs.Name?.value === this.propertySet.parameter;
        if (!nameMatches) continue;

        let propsListName: string | undefined;
        if (definitionAttrs.type === WEBIFC.IFCPROPERTYSET)
          propsListName = "HasProperties";
        if (definitionAttrs.type === WEBIFC.IFCELEMENTQUANTITY)
          propsListName = "Quantities";
        if (!propsListName) continue;

        for (const handle of definitionAttrs[propsListName]) {
          const propAttrs = await model.getProperties(handle.value);
          if (!propAttrs) continue;

          const propNameMatches =
            propAttrs.Name?.value === this.baseName.parameter;
          if (!propNameMatches) continue;

          if (this.value) {
            const valueKey = Object.keys(propAttrs).find((name) =>
              name.endsWith("Value"),
            );
            if (!valueKey) continue;
            const valueMatches =
              propAttrs[valueKey].value === this.value.parameter;
            if (!valueMatches) continue;
          }

          matches = true;
          break;
        }
      }

      this.saveResult(attrs, matches);
    }

    return this.testResult;
  }
}
