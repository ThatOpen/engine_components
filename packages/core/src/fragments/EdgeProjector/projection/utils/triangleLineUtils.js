import { Vector3 } from 'three';

const EPSILON = 1e-16;
const UP_VECTOR = /* @__PURE__ */ new Vector3( 0, 1, 0 );
const _dir = new Vector3();

export function isYProjectedLineDegenerate( line ) {

	line.delta( _dir ).normalize();
	return Math.abs( _dir.dot( UP_VECTOR ) ) >= 1.0 - EPSILON;

}

// checks whether the y-projected triangle will be degenerate
export function isYProjectedTriangleDegenerate( tri ) {

	if ( tri.needsUpdate ) {

		tri.update();

	}

	return Math.abs( tri.plane.normal.dot( UP_VECTOR ) ) <= EPSILON;

}

// Is the provided line exactly an edge on the triangle
export function isLineTriangleEdge( tri, line ) {

	// if this is the same line as on the triangle
	const { start, end } = line;
	const triPoints = tri.points;
	let startMatches = false;
	let endMatches = false;
	for ( let i = 0; i < 3; i ++ ) {

		const tp = triPoints[ i ];
		if ( ! startMatches && start.distanceToSquared( tp ) <= EPSILON ) {

			startMatches = true;

		}

		if ( ! endMatches && end.distanceToSquared( tp ) <= EPSILON ) {

			endMatches = true;

		}

		if ( startMatches && endMatches ) {

			return true;

		}

	}

	return startMatches && endMatches;

}
