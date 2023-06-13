import * as WEBIFC from "web-ifc";

export function getPsetProps(
  properties: Record<string, Record<string, any>>,
  expressID: number,
  onPropFound?: (expressID: number) => void
) {
  const defaultCallback = () => {};
  const _onPropFound = onPropFound ?? defaultCallback;
  const pset = properties[expressID];
  if (pset?.type !== WEBIFC.IFCPROPERTYSET) {
    return null;
  }
  const hasProperties = pset.HasProperties ?? [{}];
  const props = hasProperties.map((prop: any) => {
    if (prop.value) {
      _onPropFound(prop.value);
    }
    return prop.value;
  });
  return props.filter((prop: any) => prop !== null);
}
