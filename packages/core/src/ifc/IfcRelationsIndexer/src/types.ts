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
  "DocumentRefForObjects",
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
  typeof WEBIFC.IFCRELASSOCIATESDOCUMENT,
];

export type IfcRelation = IfcRelations[number];

export interface RelationsProcessingConfig {
  relationsToProcess: IfcRelation[];
}

/**
 * Interface definition of an Entities Related Event from the IfcRelationsIndexer. This event gets triggered when two or more entities has been related with each other.
 */
export interface EntitiesRelatedEvent {
  /** The type of the IFC relation. */
  relType: IfcRelation;
  /** The inverse attribute of the relation. */
  invAttribute: InverseAttribute;
  /** The IDs of the entities that are relating. */
  relatingIDs: number[];
  /** The IDs of the entities that are being related. */
  relatedIDs: number[];
}
