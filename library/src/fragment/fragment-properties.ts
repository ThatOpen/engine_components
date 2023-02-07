import { Disposable } from "../core";

// TODO: Clean up and document

export class FragmentProperties implements Disposable {
  properties: { [guid: string]: any } = {};
  fragmentGuid = new Map<string, string>();

  dispose() {
    this.properties = {};
    this.fragmentGuid.clear();
  }

  add(properties: any) {
    const project = Object.values(properties).find(
      (item: any) => item.type === "IFCPROJECT"
    ) as any;
    const guid = project.GlobalId;
    this.properties[guid] = properties;
    return guid;
  }

  assign(guid: string, fragmentID: string) {
    this.fragmentGuid.set(fragmentID, guid);
  }

  getItemsOfType(guid: string, type: string) {
    const properties = this.properties[guid];
    return Object.values(properties).filter(
      (item: any) => item.type === type
    ) as any[];
  }

  get(guid: string, itemID: string, psets = false) {
    if (!guid) throw new Error("This fragment has no properties assigned.");
    const properties = this.properties[guid][itemID];
    const id = properties.expressID;
    if (psets) {
      this.getPropertySets(guid, id, properties);
    }
    return properties;
  }

  private getPropertySets(guid: string, id: number, properties: any) {
    this.getItemsOfType(guid, "IFCRELDEFINESBYPROPERTIES");
    const psets = this.getPsetDefinition(guid, id);

    const currentProperties = this.properties[guid];
    for (const pset of psets) {
      if (pset.HasProperties) {
        pset.HasProperties = pset.HasProperties.map(
          (id: string) => currentProperties[id]
        );
      }
      if (pset.Quantities) {
        pset.Quantities = pset.Quantities.map(
          (id: string) => currentProperties[id]
        );
      }
    }

    properties.psets = psets;
  }

  private getPsetDefinition(guid: string, id: number) {
    const allPsetsRels = this.getItemsOfType(guid, "IFCRELDEFINESBYPROPERTIES");
    const relatedPsetsRels = allPsetsRels.filter((item) =>
      item.RelatedObjects.includes(id)
    );

    const currentProperties = this.properties[guid];
    return relatedPsetsRels.map(
      (item) => currentProperties[item.RelatingPropertyDefinition]
    );
  }
}
