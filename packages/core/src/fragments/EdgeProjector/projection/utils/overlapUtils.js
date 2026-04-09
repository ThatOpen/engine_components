import { Line3 } from 'three';

const _line = /* @__PURE__ */ new Line3();

// Converts the given array of overlaps into line segments
export function overlapsToLines( line, overlaps, invert = false, target = [] ) {

	// Function assumes the line overlaps are already compressed
	let invOverlaps = [[ 0, 1 ]];
	for ( let i = 0, l = overlaps.length; i < l; i ++ ) {

		const invOverlap = invOverlaps[ i ];
		const overlap = overlaps[ i ];
		invOverlap[ 1 ] = overlap[ 0 ];
		invOverlaps.push( [ overlap[ 1 ], 1 ] );

	}

	if ( invert ) {

		[ overlaps, invOverlaps ] = [ invOverlaps, overlaps ];

	}

	for ( let i = 0, l = invOverlaps.length; i < l; i ++ ) {

		const { start, end } = line;
		_line.start.lerpVectors( start, end, invOverlaps[ i ][ 0 ] );
		_line.end.lerpVectors( start, end, invOverlaps[ i ][ 1 ] );

		target.push( new Float32Array( [
			_line.start.x,
			_line.start.y,
			_line.start.z,

			_line.end.x,
			_line.end.y,
			_line.end.z,
		] ) );

	}

	return target;

}
