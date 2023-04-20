import * as WEBIFC from "web-ifc";

// TODO: Clean up, add proper types and make this independent from fragments

export class FragmentGroups {
  groupByPredefinedType(model: any) {
    const group: any = {};
    const arrayProperties = Object.values(model.properties) as any[];
    const levelRelations = arrayProperties.filter(
      (prop) => prop.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE
    );
    const elements: any[] = [];
    levelRelations.forEach((rel) => {
      const expressIDs = rel.RelatedElements.map(
        (element: any) => element.value
      );
      elements.push(...expressIDs);
    });
    elements.forEach((element) => {
      const entity = model.properties[element];
      if (!entity) { return }
      const fragmentID = model.expressIDFragmentIDMap[entity.expressID];
      const predefinedType = String(entity.PredefinedType?.value).toUpperCase();
      if (!group[predefinedType]) {
        group[predefinedType] = {};
      }
      if (!group[predefinedType][fragmentID]) {
        group[predefinedType][fragmentID] = [];
      }
      group[predefinedType][fragmentID].push(entity.expressID);
    });
    return group;
  }

  groupByEntity(model: any) {
    const group: any = {};
    for (const expressID in model.itemTypes) {
      const entity = model.allTypes[model.itemTypes[expressID]];
      const fragment = model.expressIDFragmentIDMap[expressID];
      if (!fragment) {
        continue;
      }
      if (!group[entity]) {
        group[entity] = {};
      }
      if (!group[entity][fragment]) {
        group[entity][fragment] = [];
      }
      group[entity][fragment].push(expressID);
    }
    return group;
  }

  groupByStorey(model: any) {
    const group: any = {};
    const properties = Object.values(model.properties) as any[];
    const spatialRels = properties.filter(
      (entity) => entity.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE
    );
    spatialRels.forEach((rel) => {
      if (!rel.RelatingStructure || !rel.RelatingStructure.value) {
        return;
      }
      const storeyElements = rel.RelatedElements.map((element: any) => {
        return element.value.toString();
      });
      const fragmentMap: any = {};
      storeyElements.forEach((expressID: any) => {
        const fragment = model.expressIDFragmentIDMap[expressID];
        if (!fragment) {
          return;
        }
        if (!fragmentMap[fragment]) {
          fragmentMap[fragment] = [];
        }
        fragmentMap[fragment].push(expressID);
      });
      const storey = properties.find(
        (prop) => prop.expressID === rel.RelatingStructure.value
      );
      const storeyName = storey.Name.value;
      group[storeyName] = fragmentMap;
    });
    return group;
  }
}
