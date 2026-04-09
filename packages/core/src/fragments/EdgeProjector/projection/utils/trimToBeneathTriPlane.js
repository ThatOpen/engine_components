import { Plane, Vector3, MathUtils } from 'three';

const EPSILON = 1e-16;
const UP_VECTOR = /* @__PURE__ */ new Vector3( 0, 1, 0 );
const _plane = /* @__PURE__ */ new Plane();
const _planeHit = /* @__PURE__ */ new Vector3();
const _lineDirection = /* @__PURE__ */ new Vector3();
export function trimToBeneathTriPlane( tri, line, lineTarget ) {

	// update triangle if needed
	if ( tri.needsUpdate ) {

		tri.update();

	}

	// if the plane is not facing up then flip the direction
	_plane.copy( tri.plane );
	if ( _plane.normal.dot( UP_VECTOR ) < 0 ) {

		_plane.normal.multiplyScalar( - 1 );
		_plane.constant *= - 1;

	}

	const startDist = _plane.distanceToPoint( line.start );
	const endDist = _plane.distanceToPoint( line.end );
	const isStartOnPlane = Math.abs( startDist ) < EPSILON;
	const isEndOnPlane = Math.abs( endDist ) < EPSILON;
	const isStartBelow = startDist < 0;
	const isEndBelow = endDist < 0;

	// if the line and plane are coplanar then return that we can't trim
	line.delta( _lineDirection ).normalize();
	if ( Math.abs( _plane.normal.dot( _lineDirection ) ) < EPSILON ) {

		// if the line is definitely above or on the plane then skip it
		if ( isStartOnPlane || ! isStartBelow ) {

			return false;

		} else {

			lineTarget.copy( line );
			return true;

		}

	}

	// find the point that's below the plane. If both points are below the plane
	// then we assume we're dealing with floating point error
	if ( isStartBelow && isEndBelow ) {

		// if the whole line is below then just copy that
		lineTarget.copy( line );
		return true;

	} else if ( ! isStartBelow && ! isEndBelow ) {

		// if it's wholly above then skip it
		return false;

	} else {

		const t = MathUtils.mapLinear( 0, startDist, endDist, 0, 1 );
		line.at( t, _planeHit );

		if ( isStartBelow ) {

			lineTarget.start.copy( line.start );
			lineTarget.end.copy( _planeHit );
			return true;

		} else if ( isEndBelow ) {

			lineTarget.end.copy( line.end );
			lineTarget.start.copy( _planeHit );
			return true;

		}

	}

	return false;

}
