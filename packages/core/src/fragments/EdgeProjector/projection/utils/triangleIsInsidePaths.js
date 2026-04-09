import { Line3, Ray } from 'three';

function xzToXzCopy( v, target ) {

	target.x = v.x;
	target.y = v.z;

}

function epsEquals( a, b ) {

	return Math.abs( a - b ) <= 500;

}

function vectorEpsEquals( v0, v1 ) {

	return epsEquals( v0.x, v1.x ) &&
		epsEquals( v0.y, v1.y ) &&
		epsEquals( v0.z, v1.z );

}

export function triangleIsInsidePaths( tri, paths ) {

	const indices = [ 'a', 'b', 'c' ];
	const edges = [ new Line3(), new Line3(), new Line3() ];
	const line = new Line3();
	const ray = new Line3();
	ray.start
		.set( 0, 0, 0 )
		.addScaledVector( tri.a, 1 / 3 )
		.addScaledVector( tri.b, 1 / 3 )
		.addScaledVector( tri.c, 1 / 3 );

	xzToXzCopy( ray.start, ray.start );
	ray.end.copy( ray.start );
	ray.end.y += 1e10;

	// get all triangle edges
	for ( let i = 0; i < 3; i ++ ) {

		const i1 = ( i + 1 ) % 3;
		const p0 = tri[ indices[ i ] ];
		const p1 = tri[ indices[ i1 ] ];

		const edge = edges[ i ];
		xzToXzCopy( p0, edge.start );
		xzToXzCopy( p1, edge.end );

	}

	let crossCount = 0;
	for ( let p = 0, pl = paths.length; p < pl; p ++ ) {

		const points = paths[ p ];
		for ( let i = 0, l = points.length; i < l; i ++ ) {

			const i1 = ( i + 1 ) % l;
			line.start.copy( points[ i ] );
			line.start.z = 0;

			line.end.copy( points[ i1 ] );
			line.end.z = 0;

			if ( lineCrossesLine( ray, line ) ) {

				crossCount ++;

			}

			for ( let e = 0; e < 3; e ++ ) {

				const edge = edges[ e ];
				if (
					lineCrossesLine( edge, line ) ||
					vectorEpsEquals( edge.start, line.start ) ||
					vectorEpsEquals( edge.end, line.end ) ||
					vectorEpsEquals( edge.end, line.start ) ||
					vectorEpsEquals( edge.start, line.end )
				) {

					return false;

				}

			}

		}

	}

	return crossCount % 2 === 1;

}

// https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
function lineCrossesLine( l1, l2 ) {

	function ccw( A, B, C ) {

		return ( C.y - A.y ) * ( B.x - A.x ) > ( B.y - A.y ) * ( C.x - A.x );

	}

	const A = l1.start;
	const B = l1.end;

	const C = l2.start;
	const D = l2.end;

	return ccw( A, C, D ) !== ccw( B, C, D ) && ccw( A, B, C ) !== ccw( A, B, D );

}
