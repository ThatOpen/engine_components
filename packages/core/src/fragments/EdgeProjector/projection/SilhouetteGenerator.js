import { Path64, Clipper, FillRule } from 'clipper2-js';
import { ShapeGeometry, Vector3, Shape, Vector2, Triangle, ShapeUtils, BufferGeometry } from 'three';
import { compressPoints } from './utils/compressPoints.js';
import { triangleIsInsidePaths } from './utils/triangleIsInsidePaths.js';
import { getSizeSortedTriList } from './utils/getSizeSortedTriList.js';
import { getTriCount } from './utils/geometryUtils.js';

const AREA_EPSILON = 1e-8;
const UP_VECTOR = /* @__PURE__ */ new Vector3( 0, 1, 0 );
const _tri = /* @__PURE__ */ new Triangle();
const _normal = /* @__PURE__ */ new Vector3();
const _center = /* @__PURE__ */ new Vector3();
const _vec = /* @__PURE__ */ new Vector3();

function convertPathToGeometry( path, scale ) {

	const vector2s = path.map( points => {

		return points.flatMap( v => new Vector2( v.x / scale, v.y / scale ) );

	} );

	const holesShapes = vector2s
		.filter( p => ShapeUtils.isClockWise( p ) )
		.map( p => new Shape( p ) );

	const solidShapes = vector2s
		.filter( p => ! ShapeUtils.isClockWise( p ) )
		.map( p => {

			const shape = new Shape( p );
			shape.holes = holesShapes;
			return shape;

		} );

	// flip the triangles so they're facing in the right direction
	const result = new ShapeGeometry( solidShapes ).rotateX( Math.PI / 2 );
	result.index.array.reverse();
	return result;

}

function convertPathToLineSegments( path, scale ) {

	const arr = [];
	path.forEach( points => {

		for ( let i = 0, l = points.length; i < l; i ++ ) {

			const i1 = ( i + 1 ) % points.length;
			const p0 = points[ i ];
			const p1 = points[ i1 ];
			arr.push(
				new Vector3( p0.x / scale, 0, p0.y / scale ),
				new Vector3( p1.x / scale, 0, p1.y / scale )
			);

		}

	} );

	const result = new BufferGeometry();
	result.setFromPoints( arr );
	return result;

}

export const OUTPUT_MESH = 0;
export const OUTPUT_LINE_SEGMENTS = 1;
export const OUTPUT_BOTH = 2;
export class SilhouetteGenerator {

	constructor() {

		this.iterationTime = 30;
		this.intScalar = 1e9;
		this.doubleSided = false;
		this.sortTriangles = false;
		this.output = OUTPUT_MESH;

	}

	generateAsync( geometry, options = {} ) {

		return new Promise( ( resolve, reject ) => {

			const { signal } = options;
			const task = this.generate( geometry, options );
			run();

			function run() {

				if ( signal && signal.aborted ) {

					reject( new Error( 'SilhouetteGenerator: Process aborted via AbortSignal.' ) );
					return;

				}

				const result = task.next();
				if ( result.done ) {

					resolve( result.value );

				} else {

					requestAnimationFrame( run );

				}

			}


		} );

	}

	*generate( geometry, options = {} ) {

		const { iterationTime, intScalar, doubleSided, output, sortTriangles } = this;
		const { onProgress } = options;
		const power = Math.log10( intScalar );
		const extendMultiplier = Math.pow( 10, - ( power - 2 ) );

		const index = geometry.index;
		const posAttr = geometry.attributes.position;
		const triCount = getTriCount( geometry );
		let overallPath = null;

		const triList = sortTriangles ?
			getSizeSortedTriList( geometry ) :
			new Array( triCount ).fill().map( ( v, i ) => i );

		const handle = {

			getGeometry() {

				if ( output === OUTPUT_MESH ) {

					return convertPathToGeometry( overallPath, intScalar );

				} else if ( output === OUTPUT_LINE_SEGMENTS ) {

					return convertPathToLineSegments( overallPath, intScalar );

				} else {

					return [
						convertPathToGeometry( overallPath, intScalar ),
						convertPathToLineSegments( overallPath, intScalar ),
					];

				}

			}

		};

		let time = performance.now();
		for ( let ti = 0; ti < triCount; ti ++ ) {

			const i = triList[ ti ] * 3;
			let i0 = i + 0;
			let i1 = i + 1;
			let i2 = i + 2;
			if ( index ) {

				i0 = index.getX( i0 );
				i1 = index.getX( i1 );
				i2 = index.getX( i2 );

			}

			// get the triangle
			const { a, b, c } = _tri;
			a.fromBufferAttribute( posAttr, i0 );
			b.fromBufferAttribute( posAttr, i1 );
			c.fromBufferAttribute( posAttr, i2 );
			if ( ! doubleSided ) {

				_tri.getNormal( _normal );
				if ( _normal.dot( UP_VECTOR ) < 0 ) {

					continue;

				}

			}

			// flatten the triangle
			a.y = 0;
			b.y = 0;
			c.y = 0;

			if ( _tri.getArea() < AREA_EPSILON ) {

				continue;

			}

			// expand the triangle by a small degree to ensure overlap
			_center
				.copy( a )
				.add( b )
				.add( c )
				.multiplyScalar( 1 / 3 );

			_vec.subVectors( a, _center ).normalize();
			a.addScaledVector( _vec, extendMultiplier );

			_vec.subVectors( b, _center ).normalize();
			b.addScaledVector( _vec, extendMultiplier );

			_vec.subVectors( c, _center ).normalize();
			c.addScaledVector( _vec, extendMultiplier );

			// create the path
			const path = new Path64();
			path.push( Clipper.makePath( [
				a.x * intScalar, a.z * intScalar,
				b.x * intScalar, b.z * intScalar,
				c.x * intScalar, c.z * intScalar,
			] ) );

			a.multiplyScalar( intScalar );
			b.multiplyScalar( intScalar );
			c.multiplyScalar( intScalar );
			if ( overallPath && triangleIsInsidePaths( _tri, overallPath ) ) {

				continue;

			}

			// perform union
			if ( overallPath === null ) {

				overallPath = path;

			} else {

				overallPath = Clipper.Union( overallPath, path, FillRule.NonZero );
				overallPath.forEach( path => compressPoints( path ) );

			}

			const delta = performance.now() - time;
			if ( delta > iterationTime ) {

				if ( onProgress ) {

					const progress = ti / triCount;
					onProgress( progress, handle );

				}

				yield;
				time = performance.now();

			}

		}

		return handle.getGeometry();

	}

}
