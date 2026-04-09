import { Vector3, Triangle, Line3, MathUtils } from 'three';

// Modified version of js EdgesGeometry logic to handle silhouette edges
const EPSILON = 1e-10;
const UP_VECTOR = /* @__PURE__ */ new Vector3( 0, 1, 0 );
const _v0 = /* @__PURE__ */ new Vector3();
const _v1 = /* @__PURE__ */ new Vector3();
const _normal = /* @__PURE__ */ new Vector3();
const _triangle = /* @__PURE__ */ new Triangle();

export function* generateEdges( geometry, target = [], options = {} ) {

	const {
		projectionDirection = UP_VECTOR,
		thresholdAngle = 1,
		iterationTime = 30,
	} = options;

	const precisionPoints = 4;
	const precision = Math.pow( 10, precisionPoints );
	const thresholdDot = Math.cos( MathUtils.DEG2RAD * thresholdAngle );

	const indexAttr = geometry.getIndex();
	const positionAttr = geometry.getAttribute( 'position' );
	const indexCount = indexAttr ? indexAttr.count : positionAttr.count;

	const indexArr = [ 0, 0, 0 ];
	const vertKeys = [ 'a', 'b', 'c' ];
	const hashes = new Array( 3 );

	const edgeData = {};
	let time = performance.now();
	for ( let i = 0; i < indexCount; i += 3 ) {

		if ( performance.now() - time > iterationTime ) {

			yield;
			time = performance.now();

		}

		if ( indexAttr ) {

			indexArr[ 0 ] = indexAttr.getX( i );
			indexArr[ 1 ] = indexAttr.getX( i + 1 );
			indexArr[ 2 ] = indexAttr.getX( i + 2 );

		} else {

			indexArr[ 0 ] = i;
			indexArr[ 1 ] = i + 1;
			indexArr[ 2 ] = i + 2;

		}

		const { a, b, c } = _triangle;
		a.fromBufferAttribute( positionAttr, indexArr[ 0 ] );
		b.fromBufferAttribute( positionAttr, indexArr[ 1 ] );
		c.fromBufferAttribute( positionAttr, indexArr[ 2 ] );
		_triangle.getNormal( _normal );

		// create hashes for the edge from the vertices
		hashes[ 0 ] = `${ Math.round( a.x * precision ) },${ Math.round( a.y * precision ) },${ Math.round( a.z * precision ) }`;
		hashes[ 1 ] = `${ Math.round( b.x * precision ) },${ Math.round( b.y * precision ) },${ Math.round( b.z * precision ) }`;
		hashes[ 2 ] = `${ Math.round( c.x * precision ) },${ Math.round( c.y * precision ) },${ Math.round( c.z * precision ) }`;

		// skip degenerate triangles
		if ( hashes[ 0 ] === hashes[ 1 ] || hashes[ 1 ] === hashes[ 2 ] || hashes[ 2 ] === hashes[ 0 ] ) {

			continue;

		}

		// iterate over every edge
		for ( let j = 0; j < 3; j ++ ) {

			// get the first and next vertex making up the edge
			const jNext = ( j + 1 ) % 3;
			const vecHash0 = hashes[ j ];
			const vecHash1 = hashes[ jNext ];
			const v0 = _triangle[ vertKeys[ j ] ];
			const v1 = _triangle[ vertKeys[ jNext ] ];

			const hash = `${ vecHash0 }_${ vecHash1 }`;
			const reverseHash = `${ vecHash1 }_${ vecHash0 }`;

			if ( reverseHash in edgeData && edgeData[ reverseHash ] ) {

				// if we found a sibling edge add it into the vertex array if
				// it meets the angle threshold and delete the edge from the map.
				const otherNormal = edgeData[ reverseHash ].normal;
				const meetsThreshold = _normal.dot( otherNormal ) <= thresholdDot;

				// get the dot product relative to the projection angle and
				// add an epsilon for nearly vertical triangles
				let projectionThreshold = false;
				if ( projectionDirection !== null ) {

					let normDot = projectionDirection.dot( _normal );
					normDot = Math.abs( normDot ) < EPSILON ? 0 : normDot;

					let otherDot = projectionDirection.dot( otherNormal );
					otherDot = Math.abs( otherDot ) < EPSILON ? 0 : otherDot;

					projectionThreshold = Math.sign( normDot ) !== Math.sign( otherDot );

				}

				if ( meetsThreshold || projectionThreshold ) {

					const line = new Line3();
					line.start.copy( v0 );
					line.end.copy( v1 );
					target.push( line );

				}

				edgeData[ reverseHash ] = null;

			} else if ( ! ( hash in edgeData ) ) {

				// if we've already got an edge here then skip adding a new one
				edgeData[ hash ] = {

					index0: indexArr[ j ],
					index1: indexArr[ jNext ],
					normal: _normal.clone(),

				};

			}

		}

	}

	// iterate over all remaining, unmatched edges and add them to the vertex array
	for ( const key in edgeData ) {

		if ( edgeData[ key ] ) {

			const { index0, index1 } = edgeData[ key ];
			_v0.fromBufferAttribute( positionAttr, index0 );
			_v1.fromBufferAttribute( positionAttr, index1 );

			const line = new Line3();
			line.start.copy( _v0 );
			line.end.copy( _v1 );
			target.push( line );

		}

	}

	return target;

}
