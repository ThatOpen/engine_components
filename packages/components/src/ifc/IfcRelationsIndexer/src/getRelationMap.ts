export const getRelationMap = (
  properties: Record<string, Record<string, any>>,
  relationType: number,
  onElementsFound?: (relatingID: number, relatedIDs: number[]) => void,
) => {
  const defaultCallback = () => {};
  const _onElementsFound = onElementsFound ?? defaultCallback;
  const result: { [relatingID: number]: number[] } = {};
  const ids = Object.keys(properties);
  for (const expressID of ids) {
    const prop = properties[expressID];

    if (!prop) continue;

    const isRelation = prop.type === relationType;
    const relatingKey = Object.keys(prop).find((key) =>
      key.startsWith("Relating"),
    );

    const relatedKey = Object.keys(prop).find((key) =>
      key.startsWith("Related"),
    );

    if (!(isRelation && relatingKey && relatedKey)) continue;
    const relating = properties[prop[relatingKey]?.value];
    const related = prop[relatedKey];

    if (!relating || !related) continue;

    if (!(related && Array.isArray(related))) continue;
    const elements = related.map((el: any) => el.value);

    _onElementsFound(relating.expressID, elements);
    result[relating.expressID] = elements;
  }
  return result;
};
