const DIRECTION_EPSILON = 1e-3;
const DIST_EPSILON = 1e2;

function sameDirection( p0, p1, p2 ) {

	const dx1 = p1.x - p0.x;
	const dy1 = p1.y - p0.y;

	const dx2 = p2.x - p1.x;
	const dy2 = p2.y - p1.y;

	const s1 = dx1 / dy1;
	const s2 = dx2 / dy2;

	return Math.abs( s1 - s2 ) < DIRECTION_EPSILON;

}

function areClose( p0, p1 ) {

	const dx = p1.x - p0.x;
	const dy = p1.y - p0.y;
	return Math.sqrt( dx * dx + dy * dy ) < DIST_EPSILON;

}

function areEqual( p0, p1 ) {

	return p0.x === p1.x && p0.y === p1.y;

}

export function compressPoints( points ) {

	for ( let k = 0; k < points.length; k ++ ) {

		// remove points that are equal or very close to each other
		const v = points[ k ];
		while ( true ) {

			const k1 = k + 1;
			if (
				points.length > k1 &&
				(
					areEqual( v, points[ k1 ] ) ||
					areClose( v, points[ k1 ] )
				)
			) {

				points.splice( k1, 1 );

			} else {

				break;

			}


		}

		// join lines that are almost the same direction
		while ( true ) {

			const k1 = k + 1;
			const k2 = k + 2;
			if (
				points.length > k2 &&
				sameDirection( v, points[ k1 ], points[ k2 ] )
			) {

				points.splice( k + 1, 1 );

			} else {

				break;

			}

		}

	}

}
