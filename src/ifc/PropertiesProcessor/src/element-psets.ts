import * as WEBIFC from "web-ifc";

export function getElementPsets(
  properties: Record<string, Record<string, any>>,
  expressID: number,
  onPsetFound?: (expressID: number) => void
) {
  const defaultCallback = () => {};
  const _onPsetFound = onPsetFound ?? defaultCallback;
  const arrayProperties = Object.values(properties);
  const psets = arrayProperties.map((entity) => {
    const isRel = entity?.type === WEBIFC.IFCRELDEFINESBYPROPERTIES;
    if (!isRel) {
      return null;
    }
    const psetExpressID = entity.RelatingPropertyDefinition?.value;
    const isPset = properties[psetExpressID]?.type === WEBIFC.IFCPROPERTYSET;
    if (!isPset) {
      return null;
    }
    const relatedObjects = entity.RelatedObjects ?? [{}];
    const elements = relatedObjects.map((obj: any) => {
      return obj.value;
    });
    if (!elements.includes(expressID)) {
      return null;
    }
    _onPsetFound(psetExpressID);
    return psetExpressID;
  });
  return psets.filter((pset) => pset !== null);
}
