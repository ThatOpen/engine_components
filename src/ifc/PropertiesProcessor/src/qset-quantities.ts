import * as WEBIFC from "web-ifc";

export function getQsetQuantities(
  properties: Record<string, Record<string, any>>,
  expressID: number,
  onQuantityFound?: (expressID: number) => void
) {
  const defaultCallback = () => {};
  const _onQuantityFound = onQuantityFound ?? defaultCallback;
  const pset = properties[expressID];
  if (pset?.type !== WEBIFC.IFCELEMENTQUANTITY) {
    return null;
  }
  const quantities = pset.Quantities ?? [{}];
  const qtos = quantities.map((prop: any) => {
    if (prop.value) {
      _onQuantityFound(prop.value);
    }
    return prop.value;
  });
  return qtos.filter((prop: any) => prop !== null);
}
