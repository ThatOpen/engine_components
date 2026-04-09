import { Vector3, Line3, Plane } from 'three';
import { ExtendedTriangle } from 'three-mesh-bvh';

const AREA_EPSILON = 1e-16;
const DIST_EPSILON = 1e-16;
const _orthoPlane = /* @__PURE__ */ new Plane();
const _edgeLine = /* @__PURE__ */ new Line3();
const _point = /* @__PURE__ */ new Vector3();
const _vec = /* @__PURE__ */ new Vector3();
const _tri = /* @__PURE__ */ new ExtendedTriangle();
const _line = /* @__PURE__ */ new Line3();
const _triLine = /* @__PURE__ */ new Line3();
const _dir = /* @__PURE__ */ new Vector3();
const _ortho = /* @__PURE__ */ new Vector3();
const _triDir = /* @__PURE__ */ new Vector3();

// Returns the portion of the line that is overlapping the triangle when projected
// TODO: rename this, remove need for tri update, plane
export function getProjectedLineOverlap( line, triangle, lineTarget = new Line3() ) {

	// flatten the shapes
	_tri.copy( triangle );
	_tri.a.y = 0;
	_tri.b.y = 0;
	_tri.c.y = 0;
	_tri.update();

	_line.copy( line );
	_line.start.y = 0;
	_line.end.y = 0;

	// if the triangle is degenerate then return no overlap
	if ( _tri.getArea() <= AREA_EPSILON ) {

		return null;

	}

	const lineDistance = _line.distance();
	_line.delta( _dir ).divideScalar( lineDistance );
	_ortho.copy( _dir ).cross( _tri.plane.normal ).normalize();
	_orthoPlane.setFromNormalAndCoplanarPoint( _ortho, _line.start );

	// find the line of intersection of the triangle along the plane if it exists
	let intersectCount = 0;
	const { points } = _tri;
	for ( let i = 0; i < 3; i ++ ) {

		const p1 = points[ i ];
		const p2 = points[ ( i + 1 ) % 3 ];

		const distToStart = _orthoPlane.distanceToPoint( p1 );
		const distToEnd = _orthoPlane.distanceToPoint( p2 );
		const startIntersects = Math.abs( distToStart ) < DIST_EPSILON;
		const endIntersects = Math.abs( distToEnd ) < DIST_EPSILON;

		let edgeIntersects = false;
		if ( ! startIntersects && ! endIntersects && distToStart * distToEnd < 0 ) {

			// manual edge-plane intersection (faster than Plane.intersectLine)
			const t = distToStart / ( distToStart - distToEnd );
			_point.lerpVectors( p1, p2, t );
			edgeIntersects = true;

		}

		if ( edgeIntersects && ! endIntersects || startIntersects ) {

			if ( startIntersects && ! edgeIntersects ) {

				_point.copy( p1 );

			}

			if ( intersectCount === 0 ) {

				_triLine.start.copy( _point );

			} else {

				_triLine.end.copy( _point );

			}

			intersectCount ++;
			if ( intersectCount === 2 ) {

				break;

			}

		}

	}

	if ( intersectCount === 2 ) {

		// find the intersect line if any
		_triLine.delta( _triDir ).normalize();

		// swap edges so they're facing in the same direction
		if ( _dir.dot( _triDir ) < 0 ) {

			const tmp = _triLine.start;
			_triLine.start = _triLine.end;
			_triLine.end = tmp;

		}

		// check if the edges are overlapping
		const s1 = 0;
		const e1 = _vec.subVectors( _line.end, _line.start ).dot( _dir );
		const s2 = _vec.subVectors( _triLine.start, _line.start ).dot( _dir );
		const e2 = _vec.subVectors( _triLine.end, _line.start ).dot( _dir );
		const separated1 = e1 <= s2;
		const separated2 = e2 <= s1;

		if ( separated1 || separated2 ) {

			return null;

		}

		line.at(
			Math.max( s1, s2 ) / lineDistance,
			lineTarget.start,
		);

		line.at(
			Math.min( e1, e2 ) / lineDistance,
			lineTarget.end,
		);

		return lineTarget;

	}

	return null;

}
