import * as WEBIFC from "web-ifc";

export function getElementSpatialContainer(
  properties: Record<string, Record<string, any>>
) {
  const arrayProperties = Object.values(properties);
  arrayProperties.filter((prop: any) => {
    return prop.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE;
  });
}
