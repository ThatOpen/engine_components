import * as WEBIFC from "web-ifc";

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
  "ReferencedBy",
  "Declares",
  "HasContext",
  "Controls",
  "IsNestedBy",
  "Nests",
];

export type InverseAttribute = InverseAttributes[number];

/**
 * Type alias for an array of IfcRelation types from WebIfc.
 */
export type IfcRelations = [
  typeof WEBIFC.IFCRELAGGREGATES,
  typeof WEBIFC.IFCRELASSOCIATESMATERIAL,
  typeof WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
  typeof WEBIFC.IFCRELASSIGNSTOGROUP,
  typeof WEBIFC.IFCRELDEFINESBYPROPERTIES,
  typeof WEBIFC.IFCRELDEFINESBYTYPE,
  typeof WEBIFC.IFCRELDEFINESBYTEMPLATE,
  typeof WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
  typeof WEBIFC.IFCRELFLOWCONTROLELEMENTS,
  typeof WEBIFC.IFCRELCONNECTSELEMENTS,
  typeof WEBIFC.IFCRELASSIGNSTOPRODUCT,
  typeof WEBIFC.IFCRELDECLARES,
  typeof WEBIFC.IFCRELASSIGNSTOCONTROL,
  typeof WEBIFC.IFCRELNESTS,
];

export type IfcRelation = IfcRelations[number];
