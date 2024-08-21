export type IfcRelationNames = [
  // IfcRelAssigns
  "IfcRelAssignsToControl",
  "IfcRelAssignsToGroup",
  "IfcRelAssignsToProduct",
  // IfcRelAssociates
  "IfcRelAssociatesClassification",
  "IfcRelAssociatesMaterial",
  "IfcRelAssociatesDocument",
  // IfcRelConnects
  "IfcRelContainedInSpatialStructure",
  "IfcRelFlowControlElements",
  "IfcRelConnectsElements",
  // IfcRelDeclares
  "IfcRelDeclares",
  // IfcRelDecomposes
  "IfcRelAggregates",
  "IfcRelNests",
  // IfcRelDefines
  "IfcRelDefinesByProperties",
  "IfcRelDefinesByType",
  "IfcRelDefinesByTemplate",
];

export type IfcRelName = IfcRelationNames[number];
