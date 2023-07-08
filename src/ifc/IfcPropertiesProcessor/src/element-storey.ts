import * as WEBIFC from "web-ifc";

export function getElementStorey(
  properties: Record<string, Record<string, any>>,
  expressID: number,
  onStoreyFound?: (expressID: number) => void
) {
  const defaultCallback = () => {};
  const _onStoreyFound = onStoreyFound ?? defaultCallback;
  const arrayProperties = Object.values(properties);
  const psets = arrayProperties.map((entity) => {
    const isRel = entity?.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE;
    if (!isRel) return null;
    const storeyExpressID = entity.RelatingStructure?.value;
    const isStorey =
      properties[storeyExpressID]?.type === WEBIFC.IFCBUILDINGSTOREY;
    if (!isStorey) return null;
    const relatedObjects = entity.RelatedElements ?? [{}];
    const elements = relatedObjects.map((obj: any) => {
      return obj.value;
    });
    if (!elements.includes(expressID)) return null;
    _onStoreyFound(storeyExpressID);
    return storeyExpressID;
  });
  return psets.filter((pset) => pset !== null);
}
