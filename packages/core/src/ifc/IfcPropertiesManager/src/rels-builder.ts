import * as WEBIFC from "web-ifc";
import { IfcRelName } from "./types";
import { IfcRelation } from "../../IfcRelationsIndexer";

type IfcRelAttributePosition = { related: number; relating: number };

export const ifcRelAttrsPosition: Record<IfcRelName, IfcRelAttributePosition> =
  {
    // IfcRelAssigns
    IfcRelAssignsToControl: { related: 5, relating: 7 },
    IfcRelAssignsToGroup: { related: 5, relating: 7 },
    IfcRelAssignsToProduct: { related: 5, relating: 7 },
    // IfcRelAssociates
    IfcRelAssociatesClassification: { related: 5, relating: 6 },
    IfcRelAssociatesMaterial: { related: 5, relating: 6 },
    IfcRelAssociatesDocument: { related: 5, relating: 6 },
    // IfcRelConnects
    IfcRelContainedInSpatialStructure: { related: 5, relating: 6 },
    IfcRelFlowControlElements: { related: 5, relating: 6 },
    IfcRelConnectsElements: { related: 7, relating: 6 },
    // IfcRelDeclares
    IfcRelDeclares: { related: 6, relating: 5 },
    // IfcRelDecomposes
    IfcRelAggregates: { related: 6, relating: 5 },
    IfcRelNests: { related: 6, relating: 5 },
    // IfcRelDefines
    IfcRelDefinesByProperties: { related: 5, relating: 6 },
    IfcRelDefinesByType: { related: 5, relating: 6 },
    IfcRelDefinesByTemplate: { related: 5, relating: 6 },
  };

export const ifcRelClassNames: Record<IfcRelation, IfcRelName> = {
  // IfcRelAssigns
  [WEBIFC.IFCRELASSIGNSTOCONTROL]: "IfcRelAssignsToControl",
  [WEBIFC.IFCRELASSIGNSTOGROUP]: "IfcRelAssignsToGroup",
  [WEBIFC.IFCRELASSIGNSTOPRODUCT]: "IfcRelAssignsToProduct",
  // IfcRelAssociates
  [WEBIFC.IFCRELASSOCIATESCLASSIFICATION]: "IfcRelAssociatesClassification",
  [WEBIFC.IFCRELASSOCIATESMATERIAL]: "IfcRelAssociatesMaterial",
  [WEBIFC.IFCRELASSOCIATESDOCUMENT]: "IfcRelAssociatesDocument",
  // IfcRelConnects
  [WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE]:
    "IfcRelContainedInSpatialStructure",
  [WEBIFC.IFCRELCONNECTSELEMENTS]: "IfcRelConnectsElements",
  [WEBIFC.IFCRELFLOWCONTROLELEMENTS]: "IfcRelFlowControlElements",
  // IfcRelDeclares
  [WEBIFC.IFCRELDECLARES]: "IfcRelDeclares",
  // IfcRelDecomposes
  [WEBIFC.IFCRELAGGREGATES]: "IfcRelAggregates",
  [WEBIFC.IFCRELNESTS]: "IfcRelNests",
  // IfcRelDefines
  [WEBIFC.IFCRELDEFINESBYPROPERTIES]: "IfcRelDefinesByProperties",
  [WEBIFC.IFCRELDEFINESBYTYPE]: "IfcRelDefinesByType",
  [WEBIFC.IFCRELDEFINESBYTEMPLATE]: "IfcRelDefinesByTemplate",
};
