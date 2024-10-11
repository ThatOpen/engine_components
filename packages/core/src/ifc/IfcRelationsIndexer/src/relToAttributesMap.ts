import * as WEBIFC from "web-ifc";
import { IfcRelation, InverseAttribute } from "./types";

// TODO: Construct this based on the IFC EXPRESS long form schema?
export const relToAttributesMap = new Map<
  IfcRelation,
  { forRelating: InverseAttribute; forRelated: InverseAttribute }
>([
  [
    WEBIFC.IFCRELAGGREGATES,
    {
      forRelated: "Decomposes",
      forRelating: "IsDecomposedBy",
    },
  ],
  [
    WEBIFC.IFCRELASSOCIATESMATERIAL,
    {
      forRelated: "HasAssociations",
      forRelating: "AssociatedTo",
    },
  ],
  [
    WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
    {
      forRelated: "HasAssociations",
      forRelating: "ClassificationForObjects",
    },
  ],
  [
    WEBIFC.IFCRELASSIGNSTOGROUP,
    {
      forRelated: "HasAssignments",
      forRelating: "IsGroupedBy",
    },
  ],
  [
    WEBIFC.IFCRELDEFINESBYPROPERTIES,
    {
      forRelated: "IsDefinedBy",
      forRelating: "DefinesOcurrence",
    },
  ],
  [
    WEBIFC.IFCRELDEFINESBYTYPE,
    {
      forRelated: "IsTypedBy",
      forRelating: "Types",
    },
  ],
  [
    WEBIFC.IFCRELDEFINESBYTEMPLATE,
    {
      forRelated: "IsDefinedBy",
      forRelating: "Defines",
    },
  ],
  [
    WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
    {
      forRelated: "ContainedInStructure",
      forRelating: "ContainsElements",
    },
  ],
  [
    WEBIFC.IFCRELFLOWCONTROLELEMENTS,
    {
      forRelated: "AssignedToFlowElement",
      forRelating: "HasControlElements",
    },
  ],
  [
    WEBIFC.IFCRELCONNECTSELEMENTS,
    {
      forRelated: "ConnectedFrom",
      forRelating: "ConnectedTo",
    },
  ],
  [
    WEBIFC.IFCRELASSIGNSTOPRODUCT,
    {
      forRelated: "HasAssignments",
      forRelating: "ReferencedBy",
    },
  ],
  [
    WEBIFC.IFCRELDECLARES,
    {
      forRelated: "HasContext",
      forRelating: "Declares",
    },
  ],
  [
    WEBIFC.IFCRELASSIGNSTOCONTROL,
    {
      forRelated: "HasAssignments",
      forRelating: "Controls",
    },
  ],
  [
    WEBIFC.IFCRELNESTS,
    {
      forRelated: "Nests",
      forRelating: "IsNestedBy",
    },
  ],
  [
    WEBIFC.IFCRELASSOCIATESDOCUMENT,
    {
      forRelated: "HasAssociations",
      forRelating: "DocumentRefForObjects",
    },
  ],
]);
