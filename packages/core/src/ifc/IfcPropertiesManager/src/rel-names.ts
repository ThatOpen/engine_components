import * as WEBIFC from "web-ifc";
import { IfcRelName } from "./types";
import { IfcRelation } from "../../IfcRelationsIndexer";

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
