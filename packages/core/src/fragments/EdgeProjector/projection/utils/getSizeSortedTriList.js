import { Triangle } from 'three';
import { getTriCount } from './geometryUtils.js';

const _tri = new Triangle();
export function getSizeSortedTriList( geometry ) {

	const index = geometry.index;
	const posAttr = geometry.attributes.position;
	const triCount = getTriCount( geometry );

	return new Array( triCount )
		.fill()
		.map( ( v, i ) => {

			let i0 = i * 3 + 0;
			let i1 = i * 3 + 1;
			let i2 = i * 3 + 2;
			if ( index ) {

				i0 = index.getX( i0 );
				i1 = index.getX( i1 );
				i2 = index.getX( i2 );

			}

			_tri.a.fromBufferAttribute( posAttr, i0 );
			_tri.b.fromBufferAttribute( posAttr, i1 );
			_tri.c.fromBufferAttribute( posAttr, i2 );

			_tri.a.y = 0;
			_tri.b.y = 0;
			_tri.c.y = 0;

			// get the projected area of the triangle to sort largest triangles first
			return {
				area: _tri.getArea(),
				index: i,
			};

		} )
		.sort( ( a, b ) => {

			// sort the triangles largest to smallest
			return b.area - a.area;

		} )
		.map( o => {

			// map to the triangle index
			return o.index;

		} );

}
