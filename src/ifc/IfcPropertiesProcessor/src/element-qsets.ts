import * as WEBIFC from "web-ifc";

export function getElementQsets(
  properties: Record<string, Record<string, any>>,
  expressID: number,
  onQsetFound?: (expressID: number) => void
) {
  const defaultCallback = () => {};
  const _onQsetFound = onQsetFound ?? defaultCallback;
  const arrayProperties = Object.values(properties);
  const psets = arrayProperties.map((entity) => {
    const isRel = entity?.type === WEBIFC.IFCRELDEFINESBYPROPERTIES;
    if (!isRel) return null;
    const qsetExpressID = entity.RelatingPropertyDefinition?.value;
    const isQset =
      properties[qsetExpressID]?.type === WEBIFC.IFCELEMENTQUANTITY;
    if (!isQset) return null;
    const relatedObjects = entity.RelatedObjects ?? [{}];
    const elements = relatedObjects.map((obj: any) => {
      return obj.value;
    });
    if (!elements.includes(expressID)) return null;
    _onQsetFound(qsetExpressID);
    return qsetExpressID;
  });
  return psets.filter((pset) => pset !== null);
}
