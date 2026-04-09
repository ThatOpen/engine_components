export function getTriCount( geometry ) {

	const { index } = geometry;
	const posAttr = geometry.attributes.position;
	return index ? index.count / 3 : posAttr.count / 3;

}
