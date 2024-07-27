export type RelationsMap = Map<number, Map<number, number[]>>;

export interface ModelsRelationMap {
  [modelID: string]: RelationsMap;
}

/**
 * Type alias for an array of inverse attribute names.
 */
export type InverseAttributes = [
  "IsDecomposedBy",
  "Decomposes",
  "AssociatedTo",
  "HasAssociations",
  "ClassificationForObjects",
  "IsGroupedBy",
  "HasAssignments",
  "IsDefinedBy",
  "DefinesOcurrence",
  "IsTypedBy",
  "Types",
  "Defines",
  "ContainedInStructure",
  "ContainsElements",
  "HasControlElements",
  "AssignedToFlowElement",
  "ConnectedTo",
  "ConnectedFrom",
];

export type InverseAttribute = InverseAttributes[number];
