import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { IDSCheckResult, IDSFacet, IDSFacetParameter } from "../types";
import { Components } from "../../../../core/Components";
import { IfcRelationsIndexer } from "../../../../ifc";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/property-facet.md
export class IDSPropertyFacet {
  propertySet: IDSFacetParameter; // This is the name of the property set, like Pset_WallCommon, Qto_WallBaseQuantities or any other custom one.
  name: IDSFacetParameter; // This is the name of the property like LoadBearing, IsExternal or any other custom one.
  dataType?: string;
  value?: IDSFacetParameter;
  uri?: string;

  private _components: Components;

  constructor(
    components: Components,
    propertySet: IDSFacetParameter,
    name: IDSFacetParameter,
  ) {
    this._components = components;
    this.propertySet = propertySet;
    this.name = name;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: { [expressID: string]: Record<string, any> } = {},
  ) {}

  async test(entities: FRAGS.IfcProperties, model: FRAGS.FragmentsGroup) {
    const result: IDSCheckResult = { pass: [], fail: [] };
    const indexer = this._components.get(IfcRelationsIndexer);
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      const definitions = indexer.getEntityRelations(
        model,
        expressID,
        "IsDefinedBy",
      );
      if (!definitions) continue;

      let matches = false;

      for (const definitionID of definitions) {
        const definitionAttrs = await model.getProperties(definitionID);
        if (!definitionAttrs) continue;

        const nameMatches =
          definitionAttrs.Name?.value === this.propertySet.value;
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

          const propNameMatches = propAttrs.Name?.value === this.name.value;
          if (!propNameMatches) continue;

          if (this.value) {
            const valueKey = Object.keys(propAttrs).find((name) =>
              name.endsWith("Value"),
            );
            if (!valueKey) continue;
            const valueMatches = propAttrs[valueKey].value === this.value.value;
            if (!valueMatches) continue;
          }

          matches = true;
          break;
        }
      }

      if (matches) {
        result.pass.push(attrs.GlobalId.value);
      } else {
        result.fail.push(attrs.GlobalId.value);
      }
    }
    return result;
  }
}
