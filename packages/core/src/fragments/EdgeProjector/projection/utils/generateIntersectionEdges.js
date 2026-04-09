import { Line3 } from 'three';
import { isLineTriangleEdge } from './triangleLineUtils.js';

// TODO: How can we add support for "iterationTime"?

const _line = /* @__PURE__ */ new Line3();
export function generateIntersectionEdges( bvhA, bvhB, matrixBToA, target = [] ) {

	bvhA.bvhcast( bvhB, matrixBToA, {
		intersectsTriangles: ( tri1, tri2 ) => {

			if ( areTrianglesOnEdge( tri1, tri2 ) ) {

				return false;

			}

			if ( tri1.needsUpdate ) {

				tri1.update();

			}

			if ( tri2.needsUpdate ) {

				tri2.update();

			}

			if ( Math.abs( tri1.plane.normal.dot( tri2.plane.normal ) ) > 1 - 1e-6 ) {

				return false;

			}

			if (
				tri1.intersectsTriangle( tri2, _line, true ) &&
				! isLineTriangleEdge( tri1, _line ) &&
				! isLineTriangleEdge( tri2, _line )
			) {

				target.push( _line.clone() );

			}

		}

	} );

	return target;

}

function areVectorsEqual( a, b ) {

	return a.distanceTo( b ) < 1e-10;

}

function areTrianglesOnEdge( t1, t2 ) {

	const indices = [ 'a', 'b', 'c' ];
	let tot = 0;
	for ( let i = 0; i < 3; i ++ ) {

		for ( let j = 0; j < 3; j ++ ) {

			const v0 = t1[ indices[ i ] ];
			const v1 = t2[ indices[ j ] ];
			if ( areVectorsEqual( v0, v1 ) ) {

				tot ++;

			}

		}

	}

	return tot >= 2;

}
