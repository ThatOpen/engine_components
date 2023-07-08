export function getRelationMap(
  properties: Record<string, Record<string, any>>,
  relationType: number,
  onElementsFound?: (relatingID: number, relatedIDs: number[]) => void
) {
  const defaultCallback = () => {};
  const _onElementsFound = onElementsFound ?? defaultCallback;
  const arrayProperties = Object.values(properties);
  const result: { [groupID: string]: string[] } = {};
  arrayProperties.forEach((prop: any) => {
    const isRelation = prop.type === relationType;
    const relatingKey = Object.keys(prop).find((key) =>
      key.startsWith("Relating")
    );
    const relatedKey = Object.keys(prop).find((key) =>
      key.startsWith("Related")
    );
    if (!(isRelation && relatingKey && relatedKey)) return;
    const relating = properties[prop[relatingKey]?.value];
    const related = prop[relatedKey];
    if (!related) return;
    const elements = related.map((el: any) => {
      return el.value;
    });
    _onElementsFound(relating.expressID, elements);
    result[relating.expressID] = elements;
  });
  return result;
}
