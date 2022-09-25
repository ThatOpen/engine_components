import { FragmentProperties } from "./fragment-properties";

export interface Node {
  expressID: any;
  type: string;
  children: Node[];
}

export class FragmentSpatialTree {
  constructor(private props: FragmentProperties) {}

  private readonly relAggregates = "IFCRELAGGREGATES";
  private readonly relSpatial = "IFCRELCONTAINEDINSPATIALSTRUCTURE";

  // Get spatial tree
  generate(guid: string) {
    const ifcProject = this.props.getItemsOfType(guid, "IFCPROJECT")[0];
    const expressID = ifcProject.expressID;
    const projectNode: Node = { expressID, type: "IFCPROJECT", children: [] };
    const relContained = this.props.getItemsOfType(guid, this.relAggregates);
    const relSpatial = this.props.getItemsOfType(guid, this.relSpatial);
    this.constructSpatialNode(guid, projectNode, relContained, relSpatial);
    return projectNode;
  }

  // Recursively constructs the spatial tree
  constructSpatialNode(
    guid: string,
    item: Node,
    contains: any[],
    spatials: any[]
  ) {
    const spatialRels = spatials.filter(
      (rel) => rel.RelatingStructure === item.expressID
    );

    const containsRels = contains.filter(
      (rel) => rel.RelatingObject === item.expressID
    );

    const spatialRelsIDs: number[] = [];
    for (const rel of spatialRels) {
      spatialRelsIDs.push(...rel.RelatedElements);
    }

    const containsRelsIDs: number[] = [];
    for (const rel of containsRels) {
      containsRelsIDs.push(...rel.RelatedObjects);
    }

    const childrenIDs = [...spatialRelsIDs, ...containsRelsIDs];

    const children = [];
    for (let i = 0; i < childrenIDs.length; i++) {
      const childID = childrenIDs[i];
      const props = this.props.get(guid, childID.toString());
      const child = {
        expressID: props.expressID,
        type: props.type,
        children: [],
      };

      this.constructSpatialNode(guid, child, contains, spatials);
      children.push(child);
    }

    item.children = children;
  }
}
