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
      forRelating: "IsDecomposedBy",
      forRelated: "Decomposes",
    },
  ],
  [
    WEBIFC.IFCRELASSOCIATESMATERIAL,
    {
      forRelating: "AssociatedTo",
      forRelated: "HasAssociations",
    },
  ],
  [
    WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
    {
      forRelating: "ClassificationForObjects",
      forRelated: "HasAssociations",
    },
  ],
  [
    WEBIFC.IFCRELASSIGNSTOGROUP,
    {
      forRelating: "IsGroupedBy",
      forRelated: "HasAssignments",
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
]);
