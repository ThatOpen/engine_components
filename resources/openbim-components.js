import * as THREE$1 from 'https://unpkg.com/three@0.135.0/build/three.module.js';
import { Vector3, Matrix4, Object3D, BufferAttribute, Vector2, Plane, Line3, Triangle, Sphere, Box3, BackSide, DoubleSide, FrontSide, Mesh, Ray } from 'https://unpkg.com/three@0.135.0/build/three.module.js';

/**
 * A class to safely remove meshes and geometries from memory to
 * [prevent memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 */
class Disposer {
    /**
     * Removes a mesh, its geometry and its materials from memory. If you are
     * using any of these in other parts of the application, make sure that you
     * remove them from the mesh before disposing it.
     *
     * @param mesh - the [mesh](https://threejs.org/docs/#api/en/objects/Mesh)
     * to remove.
     *
     * @param materials - whether to dispose the materials of the mesh.
     *
     * @param recursive - whether to recursively dispose the children of the mesh.
     */
    dispose(mesh, materials = true, recursive = true) {
        mesh.removeFromParent();
        this.disposeGeometryAndMaterials(mesh, materials);
        if (recursive && mesh.children.length) {
            this.disposeChildren(mesh);
        }
        mesh.material = [];
        mesh.children.length = 0;
    }
    /**
     * Disposes a geometry from memory.
     *
     * @param geometry - the
     * [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
     * to remove.
     */
    disposeGeometry(geometry) {
        if (geometry.boundsTree) {
            geometry.disposeBoundsTree();
        }
        geometry.dispose();
    }
    disposeGeometryAndMaterials(mesh, materials) {
        if (mesh.geometry) {
            this.disposeGeometry(mesh.geometry);
        }
        if (materials) {
            Disposer.disposeMaterial(mesh);
        }
    }
    disposeChildren(mesh) {
        for (const child of mesh.children) {
            this.dispose(child);
        }
    }
    static disposeMaterial(mesh) {
        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                for (const mat of mesh.material) {
                    mat.dispose();
                }
            }
            else {
                mesh.material.dispose();
            }
        }
    }
}

/**
 * Components are the building blocks of this library. Everything is a
 * component: tools, scenes, objects, cameras, etc.
 * All components must inherit from this class. The `Type` parameter defines
 * the type of the core of this component. For instance, a component containing a
 */
class Component {
    constructor() {
        /** Whether is component is {@link Disposable}. */
        this.isDisposeable = () => {
            return "dispose" in this;
        };
        /** Whether is component is {@link Resizeable}. */
        this.isResizeable = () => {
            return "resize" in this && "getSize" in this;
        };
        /** Whether is component is {@link Updateable}. */
        this.isUpdateable = () => {
            return "afterUpdate" in this && "beforeUpdate" in this && "update" in this;
        };
        /** Whether is component is {@link Hideable}. */
        this.isHideable = () => {
            return "visible" in this;
        };
        /** Whether is component implements any kind of {@link UI}. */
        this.hasUI = () => {
            return "uiElement" in this;
        };
    }
}

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically, and easily dispose them when you are finished with it.
 * @noInheritDoc
 */
class SimpleScene extends Component {
    constructor(_components) {
        super();
        /** {@link Component.enabled} */
        this.enabled = true;
        /** {@link Component.name} */
        this.name = "SimpleScene";
        this._disposer = new Disposer();
        this._scene = new THREE$1.Scene();
        this._scene.background = new THREE$1.Color(0xcccccc);
    }
    /** {@link Component.get} */
    get() {
        return this._scene;
    }
    /** {@link Disposable.dispose} */
    dispose() {
        for (const child of this._scene.children) {
            const mesh = child;
            if (mesh.geometry) {
                this._disposer.dispose(mesh);
            }
        }
        this._scene.children = [];
    }
}

const urls = {
    base: "https://2fomw59q4h.execute-api.eu-central-1.amazonaws.com/v1/tools/",
    path: "/contents/index.js?accessToken=",
};

/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
class ToolComponent {
    constructor() {
        this.tools = [];
    }
    /**
     * Registers a new tool component.
     * @param tool - The tool to register in the application.
     */
    add(tool) {
        this.tools.push(tool);
    }
    /**
     * Deletes a previously registered tool component.
     * @param tool - The tool to delete.
     */
    remove(tool) {
        const index = this.tools.findIndex((c) => c === tool);
        if (index > -1) {
            this.tools.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Retrieves a tool component by its name.
     * @param name - The {@link Component.name} of the component..
     */
    get(name) {
        return this.tools.find((tool) => tool.name === name);
    }
    /**
     * Gets one of your tools of That Open Platform. You can pass the type of
     * component as the generic parameter T to get the types and intellisense
     * for the component.
     * @param token The authentication token to authorise this request.
     * @param id The ID of the tool you want to get
     */
    async use(token, id) {
        const { base, path } = urls;
        const url = base + id + path + token;
        const imported = await import(url);
        return imported.get();
    }
    /**
     * Updates all the registered tool components. Only the components where the
     * property {@link Component.enabled} is true will be updated.
     * @param delta - The
     * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
     */
    update(delta) {
        for (const tool of this.tools) {
            if (tool.enabled && tool.isUpdateable()) {
                tool.update(delta);
            }
        }
    }
    /**
     * Disposes all the memory used by all the tools.
     */
    dispose() {
        for (const tool of this.tools) {
            tool.enabled = false;
            if (tool.isDisposeable()) {
                tool.dispose();
            }
        }
        this.tools = [];
    }
}

class CSS2DObject extends Object3D {

	constructor( element = document.createElement( 'div' ) ) {

		super();

		this.element = element;

		this.element.style.position = 'absolute';
		this.element.style.userSelect = 'none';

		this.element.setAttribute( 'draggable', false );

		this.addEventListener( 'removed', function () {

			this.traverse( function ( object ) {

				if ( object.element instanceof Element && object.element.parentNode !== null ) {

					object.element.parentNode.removeChild( object.element );

				}

			} );

		} );

	}

	copy( source, recursive ) {

		super.copy( source, recursive );

		this.element = source.element.cloneNode( true );

		return this;

	}

}

CSS2DObject.prototype.isCSS2DObject = true;

//

const _vector = new Vector3();
const _viewMatrix = new Matrix4();
const _viewProjectionMatrix = new Matrix4();
const _a = new Vector3();
const _b = new Vector3();

class CSS2DRenderer {

	constructor( parameters = {} ) {

		const _this = this;

		let _width, _height;
		let _widthHalf, _heightHalf;

		const cache = {
			objects: new WeakMap()
		};

		const domElement = parameters.element !== undefined ? parameters.element : document.createElement( 'div' );

		domElement.style.overflow = 'hidden';

		this.domElement = domElement;

		this.getSize = function () {

			return {
				width: _width,
				height: _height
			};

		};

		this.render = function ( scene, camera ) {

			if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
			if ( camera.parent === null ) camera.updateMatrixWorld();

			_viewMatrix.copy( camera.matrixWorldInverse );
			_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

			renderObject( scene, scene, camera );
			zOrder( scene );

		};

		this.setSize = function ( width, height ) {

			_width = width;
			_height = height;

			_widthHalf = _width / 2;
			_heightHalf = _height / 2;

			domElement.style.width = width + 'px';
			domElement.style.height = height + 'px';

		};

		function renderObject( object, scene, camera ) {

			if ( object.isCSS2DObject ) {

				object.onBeforeRender( _this, scene, camera );

				_vector.setFromMatrixPosition( object.matrixWorld );
				_vector.applyMatrix4( _viewProjectionMatrix );

				const element = object.element;

				if ( /apple/i.test( navigator.vendor ) ) {

					// https://github.com/mrdoob/three.js/issues/21415
					element.style.transform = 'translate(-50%,-50%) translate(' + Math.round( _vector.x * _widthHalf + _widthHalf ) + 'px,' + Math.round( - _vector.y * _heightHalf + _heightHalf ) + 'px)';

				} else {

					element.style.transform = 'translate(-50%,-50%) translate(' + ( _vector.x * _widthHalf + _widthHalf ) + 'px,' + ( - _vector.y * _heightHalf + _heightHalf ) + 'px)';

				}

				element.style.display = ( object.visible && _vector.z >= - 1 && _vector.z <= 1 ) ? '' : 'none';

				const objectData = {
					distanceToCameraSquared: getDistanceToSquared( camera, object )
				};

				cache.objects.set( object, objectData );

				if ( element.parentNode !== domElement ) {

					domElement.appendChild( element );

				}

				object.onAfterRender( _this, scene, camera );

			}

			for ( let i = 0, l = object.children.length; i < l; i ++ ) {

				renderObject( object.children[ i ], scene, camera );

			}

		}

		function getDistanceToSquared( object1, object2 ) {

			_a.setFromMatrixPosition( object1.matrixWorld );
			_b.setFromMatrixPosition( object2.matrixWorld );

			return _a.distanceToSquared( _b );

		}

		function filterAndFlatten( scene ) {

			const result = [];

			scene.traverse( function ( object ) {

				if ( object.isCSS2DObject ) result.push( object );

			} );

			return result;

		}

		function zOrder( scene ) {

			const sorted = filterAndFlatten( scene ).sort( function ( a, b ) {

				const distanceA = cache.objects.get( a ).distanceToCameraSquared;
				const distanceB = cache.objects.get( b ).distanceToCameraSquared;

				return distanceA - distanceB;

			} );

			const zMax = sorted.length;

			for ( let i = 0, l = sorted.length; i < l; i ++ ) {

				sorted[ i ].element.style.zIndex = zMax - i;

			}

		}

	}

}

// Split strategy constants
const CENTER = 0;
const AVERAGE = 1;
const SAH = 2;
const CONTAINED = 2;

// SAH cost constants
// TODO: hone these costs more. The relative difference between them should be the
// difference in measured time to perform a triangle intersection vs traversing
// bounds.
const TRIANGLE_INTERSECT_COST = 1.25;
const TRAVERSAL_COST = 1;


// Build constants
const BYTES_PER_NODE = 6 * 4 + 4 + 4;
const IS_LEAFNODE_FLAG = 0xFFFF;

// EPSILON for computing floating point error during build
// https://en.wikipedia.org/wiki/Machine_epsilon#Values_for_standard_hardware_floating_point_arithmetics
const FLOAT32_EPSILON = Math.pow( 2, - 24 );

class MeshBVHNode {

	constructor() {

		// internal nodes have boundingData, left, right, and splitAxis
		// leaf nodes have offset and count (referring to primitives in the mesh geometry)

	}

}

function arrayToBox( nodeIndex32, array, target ) {

	target.min.x = array[ nodeIndex32 ];
	target.min.y = array[ nodeIndex32 + 1 ];
	target.min.z = array[ nodeIndex32 + 2 ];

	target.max.x = array[ nodeIndex32 + 3 ];
	target.max.y = array[ nodeIndex32 + 4 ];
	target.max.z = array[ nodeIndex32 + 5 ];

	return target;

}

function getLongestEdgeIndex( bounds ) {

	let splitDimIdx = - 1;
	let splitDist = - Infinity;

	for ( let i = 0; i < 3; i ++ ) {

		const dist = bounds[ i + 3 ] - bounds[ i ];
		if ( dist > splitDist ) {

			splitDist = dist;
			splitDimIdx = i;

		}

	}

	return splitDimIdx;

}

// copys bounds a into bounds b
function copyBounds( source, target ) {

	target.set( source );

}

// sets bounds target to the union of bounds a and b
function unionBounds( a, b, target ) {

	let aVal, bVal;
	for ( let d = 0; d < 3; d ++ ) {

		const d3 = d + 3;

		// set the minimum values
		aVal = a[ d ];
		bVal = b[ d ];
		target[ d ] = aVal < bVal ? aVal : bVal;

		// set the max values
		aVal = a[ d3 ];
		bVal = b[ d3 ];
		target[ d3 ] = aVal > bVal ? aVal : bVal;

	}

}

// expands the given bounds by the provided triangle bounds
function expandByTriangleBounds( startIndex, triangleBounds, bounds ) {

	for ( let d = 0; d < 3; d ++ ) {

		const tCenter = triangleBounds[ startIndex + 2 * d ];
		const tHalf = triangleBounds[ startIndex + 2 * d + 1 ];

		const tMin = tCenter - tHalf;
		const tMax = tCenter + tHalf;

		if ( tMin < bounds[ d ] ) {

			bounds[ d ] = tMin;

		}

		if ( tMax > bounds[ d + 3 ] ) {

			bounds[ d + 3 ] = tMax;

		}

	}

}

// compute bounds surface area
function computeSurfaceArea( bounds ) {

	const d0 = bounds[ 3 ] - bounds[ 0 ];
	const d1 = bounds[ 4 ] - bounds[ 1 ];
	const d2 = bounds[ 5 ] - bounds[ 2 ];

	return 2 * ( d0 * d1 + d1 * d2 + d2 * d0 );

}

function ensureIndex( geo, options ) {

	if ( ! geo.index ) {

		const vertexCount = geo.attributes.position.count;
		const BufferConstructor = options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer;
		let index;
		if ( vertexCount > 65535 ) {

			index = new Uint32Array( new BufferConstructor( 4 * vertexCount ) );

		} else {

			index = new Uint16Array( new BufferConstructor( 2 * vertexCount ) );

		}

		geo.setIndex( new BufferAttribute( index, 1 ) );

		for ( let i = 0; i < vertexCount; i ++ ) {

			index[ i ] = i;

		}

	}

}

// Computes the set of { offset, count } ranges which need independent BVH roots. Each
// region in the geometry index that belongs to a different set of material groups requires
// a separate BVH root, so that triangles indices belonging to one group never get swapped
// with triangle indices belongs to another group. For example, if the groups were like this:
//
// [-------------------------------------------------------------]
// |__________________|
//   g0 = [0, 20]  |______________________||_____________________|
//                      g1 = [16, 40]           g2 = [41, 60]
//
// we would need four BVH roots: [0, 15], [16, 20], [21, 40], [41, 60].
function getRootIndexRanges( geo ) {

	if ( ! geo.groups || ! geo.groups.length ) {

		return [ { offset: 0, count: geo.index.count / 3 } ];

	}

	const ranges = [];
	const rangeBoundaries = new Set();
	for ( const group of geo.groups ) {

		rangeBoundaries.add( group.start );
		rangeBoundaries.add( group.start + group.count );

	}

	// note that if you don't pass in a comparator, it sorts them lexicographically as strings :-(
	const sortedBoundaries = Array.from( rangeBoundaries.values() ).sort( ( a, b ) => a - b );
	for ( let i = 0; i < sortedBoundaries.length - 1; i ++ ) {

		const start = sortedBoundaries[ i ], end = sortedBoundaries[ i + 1 ];
		ranges.push( { offset: ( start / 3 ), count: ( end - start ) / 3 } );

	}

	return ranges;

}

// computes the union of the bounds of all of the given triangles and puts the resulting box in target. If
// centroidTarget is provided then a bounding box is computed for the centroids of the triangles, as well.
// These are computed together to avoid redundant accesses to bounds array.
function getBounds( triangleBounds, offset, count, target, centroidTarget = null ) {

	let minx = Infinity;
	let miny = Infinity;
	let minz = Infinity;
	let maxx = - Infinity;
	let maxy = - Infinity;
	let maxz = - Infinity;

	let cminx = Infinity;
	let cminy = Infinity;
	let cminz = Infinity;
	let cmaxx = - Infinity;
	let cmaxy = - Infinity;
	let cmaxz = - Infinity;

	const includeCentroid = centroidTarget !== null;
	for ( let i = offset * 6, end = ( offset + count ) * 6; i < end; i += 6 ) {

		const cx = triangleBounds[ i + 0 ];
		const hx = triangleBounds[ i + 1 ];
		const lx = cx - hx;
		const rx = cx + hx;
		if ( lx < minx ) minx = lx;
		if ( rx > maxx ) maxx = rx;
		if ( includeCentroid && cx < cminx ) cminx = cx;
		if ( includeCentroid && cx > cmaxx ) cmaxx = cx;

		const cy = triangleBounds[ i + 2 ];
		const hy = triangleBounds[ i + 3 ];
		const ly = cy - hy;
		const ry = cy + hy;
		if ( ly < miny ) miny = ly;
		if ( ry > maxy ) maxy = ry;
		if ( includeCentroid && cy < cminy ) cminy = cy;
		if ( includeCentroid && cy > cmaxy ) cmaxy = cy;

		const cz = triangleBounds[ i + 4 ];
		const hz = triangleBounds[ i + 5 ];
		const lz = cz - hz;
		const rz = cz + hz;
		if ( lz < minz ) minz = lz;
		if ( rz > maxz ) maxz = rz;
		if ( includeCentroid && cz < cminz ) cminz = cz;
		if ( includeCentroid && cz > cmaxz ) cmaxz = cz;

	}

	target[ 0 ] = minx;
	target[ 1 ] = miny;
	target[ 2 ] = minz;

	target[ 3 ] = maxx;
	target[ 4 ] = maxy;
	target[ 5 ] = maxz;

	if ( includeCentroid ) {

		centroidTarget[ 0 ] = cminx;
		centroidTarget[ 1 ] = cminy;
		centroidTarget[ 2 ] = cminz;

		centroidTarget[ 3 ] = cmaxx;
		centroidTarget[ 4 ] = cmaxy;
		centroidTarget[ 5 ] = cmaxz;

	}

}

// A stand alone function for retrieving the centroid bounds.
function getCentroidBounds( triangleBounds, offset, count, centroidTarget ) {

	let cminx = Infinity;
	let cminy = Infinity;
	let cminz = Infinity;
	let cmaxx = - Infinity;
	let cmaxy = - Infinity;
	let cmaxz = - Infinity;

	for ( let i = offset * 6, end = ( offset + count ) * 6; i < end; i += 6 ) {

		const cx = triangleBounds[ i + 0 ];
		if ( cx < cminx ) cminx = cx;
		if ( cx > cmaxx ) cmaxx = cx;

		const cy = triangleBounds[ i + 2 ];
		if ( cy < cminy ) cminy = cy;
		if ( cy > cmaxy ) cmaxy = cy;

		const cz = triangleBounds[ i + 4 ];
		if ( cz < cminz ) cminz = cz;
		if ( cz > cmaxz ) cmaxz = cz;

	}

	centroidTarget[ 0 ] = cminx;
	centroidTarget[ 1 ] = cminy;
	centroidTarget[ 2 ] = cminz;

	centroidTarget[ 3 ] = cmaxx;
	centroidTarget[ 4 ] = cmaxy;
	centroidTarget[ 5 ] = cmaxz;

}


// reorders `tris` such that for `count` elements after `offset`, elements on the left side of the split
// will be on the left and elements on the right side of the split will be on the right. returns the index
// of the first element on the right side, or offset + count if there are no elements on the right side.
function partition( index, triangleBounds, offset, count, split ) {

	let left = offset;
	let right = offset + count - 1;
	const pos = split.pos;
	const axisOffset = split.axis * 2;

	// hoare partitioning, see e.g. https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme
	while ( true ) {

		while ( left <= right && triangleBounds[ left * 6 + axisOffset ] < pos ) {

			left ++;

		}


		// if a triangle center lies on the partition plane it is considered to be on the right side
		while ( left <= right && triangleBounds[ right * 6 + axisOffset ] >= pos ) {

			right --;

		}

		if ( left < right ) {

			// we need to swap all of the information associated with the triangles at index
			// left and right; that's the verts in the geometry index, the bounds,
			// and perhaps the SAH planes

			for ( let i = 0; i < 3; i ++ ) {

				let t0 = index[ left * 3 + i ];
				index[ left * 3 + i ] = index[ right * 3 + i ];
				index[ right * 3 + i ] = t0;

				let t1 = triangleBounds[ left * 6 + i * 2 + 0 ];
				triangleBounds[ left * 6 + i * 2 + 0 ] = triangleBounds[ right * 6 + i * 2 + 0 ];
				triangleBounds[ right * 6 + i * 2 + 0 ] = t1;

				let t2 = triangleBounds[ left * 6 + i * 2 + 1 ];
				triangleBounds[ left * 6 + i * 2 + 1 ] = triangleBounds[ right * 6 + i * 2 + 1 ];
				triangleBounds[ right * 6 + i * 2 + 1 ] = t2;

			}

			left ++;
			right --;

		} else {

			return left;

		}

	}

}

const BIN_COUNT = 32;
const binsSort = ( a, b ) => a.candidate - b.candidate;
const sahBins = new Array( BIN_COUNT ).fill().map( () => {

	return {

		count: 0,
		bounds: new Float32Array( 6 ),
		rightCacheBounds: new Float32Array( 6 ),
		leftCacheBounds: new Float32Array( 6 ),
		candidate: 0,

	};

} );
const leftBounds = new Float32Array( 6 );

function getOptimalSplit( nodeBoundingData, centroidBoundingData, triangleBounds, offset, count, strategy ) {

	let axis = - 1;
	let pos = 0;

	// Center
	if ( strategy === CENTER ) {

		axis = getLongestEdgeIndex( centroidBoundingData );
		if ( axis !== - 1 ) {

			pos = ( centroidBoundingData[ axis ] + centroidBoundingData[ axis + 3 ] ) / 2;

		}

	} else if ( strategy === AVERAGE ) {

		axis = getLongestEdgeIndex( nodeBoundingData );
		if ( axis !== - 1 ) {

			pos = getAverage( triangleBounds, offset, count, axis );

		}

	} else if ( strategy === SAH ) {

		const rootSurfaceArea = computeSurfaceArea( nodeBoundingData );
		let bestCost = TRIANGLE_INTERSECT_COST * count;

		// iterate over all axes
		const cStart = offset * 6;
		const cEnd = ( offset + count ) * 6;
		for ( let a = 0; a < 3; a ++ ) {

			const axisLeft = centroidBoundingData[ a ];
			const axisRight = centroidBoundingData[ a + 3 ];
			const axisLength = axisRight - axisLeft;
			const binWidth = axisLength / BIN_COUNT;

			// If we have fewer triangles than we're planning to split then just check all
			// the triangle positions because it will be faster.
			if ( count < BIN_COUNT / 4 ) {

				// initialize the bin candidates
				const truncatedBins = [ ...sahBins ];
				truncatedBins.length = count;

				// set the candidates
				let b = 0;
				for ( let c = cStart; c < cEnd; c += 6, b ++ ) {

					const bin = truncatedBins[ b ];
					bin.candidate = triangleBounds[ c + 2 * a ];
					bin.count = 0;

					const {
						bounds,
						leftCacheBounds,
						rightCacheBounds,
					} = bin;
					for ( let d = 0; d < 3; d ++ ) {

						rightCacheBounds[ d ] = Infinity;
						rightCacheBounds[ d + 3 ] = - Infinity;

						leftCacheBounds[ d ] = Infinity;
						leftCacheBounds[ d + 3 ] = - Infinity;

						bounds[ d ] = Infinity;
						bounds[ d + 3 ] = - Infinity;

					}

					expandByTriangleBounds( c, triangleBounds, bounds );

				}

				truncatedBins.sort( binsSort );

				// remove redundant splits
				let splitCount = count;
				for ( let bi = 0; bi < splitCount; bi ++ ) {

					const bin = truncatedBins[ bi ];
					while ( bi + 1 < splitCount && truncatedBins[ bi + 1 ].candidate === bin.candidate ) {

						truncatedBins.splice( bi + 1, 1 );
						splitCount --;

					}

				}

				// find the appropriate bin for each triangle and expand the bounds.
				for ( let c = cStart; c < cEnd; c += 6 ) {

					const center = triangleBounds[ c + 2 * a ];
					for ( let bi = 0; bi < splitCount; bi ++ ) {

						const bin = truncatedBins[ bi ];
						if ( center >= bin.candidate ) {

							expandByTriangleBounds( c, triangleBounds, bin.rightCacheBounds );

						} else {

							expandByTriangleBounds( c, triangleBounds, bin.leftCacheBounds );
							bin.count ++;

						}

					}

				}

				// expand all the bounds
				for ( let bi = 0; bi < splitCount; bi ++ ) {

					const bin = truncatedBins[ bi ];
					const leftCount = bin.count;
					const rightCount = count - bin.count;

					// check the cost of this split
					const leftBounds = bin.leftCacheBounds;
					const rightBounds = bin.rightCacheBounds;

					let leftProb = 0;
					if ( leftCount !== 0 ) {

						leftProb = computeSurfaceArea( leftBounds ) / rootSurfaceArea;

					}

					let rightProb = 0;
					if ( rightCount !== 0 ) {

						rightProb = computeSurfaceArea( rightBounds ) / rootSurfaceArea;

					}

					const cost = TRAVERSAL_COST + TRIANGLE_INTERSECT_COST * (
						leftProb * leftCount + rightProb * rightCount
					);

					if ( cost < bestCost ) {

						axis = a;
						bestCost = cost;
						pos = bin.candidate;

					}

				}

			} else {

				// reset the bins
				for ( let i = 0; i < BIN_COUNT; i ++ ) {

					const bin = sahBins[ i ];
					bin.count = 0;
					bin.candidate = axisLeft + binWidth + i * binWidth;

					const bounds = bin.bounds;
					for ( let d = 0; d < 3; d ++ ) {

						bounds[ d ] = Infinity;
						bounds[ d + 3 ] = - Infinity;

					}

				}

				// iterate over all center positions
				for ( let c = cStart; c < cEnd; c += 6 ) {

					const triCenter = triangleBounds[ c + 2 * a ];
					const relativeCenter = triCenter - axisLeft;

					// in the partition function if the centroid lies on the split plane then it is
					// considered to be on the right side of the split
					let binIndex = ~ ~ ( relativeCenter / binWidth );
					if ( binIndex >= BIN_COUNT ) binIndex = BIN_COUNT - 1;

					const bin = sahBins[ binIndex ];
					bin.count ++;

					expandByTriangleBounds( c, triangleBounds, bin.bounds );

				}

				// cache the unioned bounds from right to left so we don't have to regenerate them each time
				const lastBin = sahBins[ BIN_COUNT - 1 ];
				copyBounds( lastBin.bounds, lastBin.rightCacheBounds );
				for ( let i = BIN_COUNT - 2; i >= 0; i -- ) {

					const bin = sahBins[ i ];
					const nextBin = sahBins[ i + 1 ];
					unionBounds( bin.bounds, nextBin.rightCacheBounds, bin.rightCacheBounds );

				}

				let leftCount = 0;
				for ( let i = 0; i < BIN_COUNT - 1; i ++ ) {

					const bin = sahBins[ i ];
					const binCount = bin.count;
					const bounds = bin.bounds;

					const nextBin = sahBins[ i + 1 ];
					const rightBounds = nextBin.rightCacheBounds;

					// dont do anything with the bounds if the new bounds have no triangles
					if ( binCount !== 0 ) {

						if ( leftCount === 0 ) {

							copyBounds( bounds, leftBounds );

						} else {

							unionBounds( bounds, leftBounds, leftBounds );

						}

					}

					leftCount += binCount;

					// check the cost of this split
					let leftProb = 0;
					let rightProb = 0;

					if ( leftCount !== 0 ) {

						leftProb = computeSurfaceArea( leftBounds ) / rootSurfaceArea;

					}

					const rightCount = count - leftCount;
					if ( rightCount !== 0 ) {

						rightProb = computeSurfaceArea( rightBounds ) / rootSurfaceArea;

					}

					const cost = TRAVERSAL_COST + TRIANGLE_INTERSECT_COST * (
						leftProb * leftCount + rightProb * rightCount
					);

					if ( cost < bestCost ) {

						axis = a;
						bestCost = cost;
						pos = bin.candidate;

					}

				}

			}

		}

	} else {

		console.warn( `MeshBVH: Invalid build strategy value ${ strategy } used.` );

	}

	return { axis, pos };

}

// returns the average coordinate on the specified axis of the all the provided triangles
function getAverage( triangleBounds, offset, count, axis ) {

	let avg = 0;
	for ( let i = offset, end = offset + count; i < end; i ++ ) {

		avg += triangleBounds[ i * 6 + axis * 2 ];

	}

	return avg / count;

}

// precomputes the bounding box for each triangle; required for quickly calculating tree splits.
// result is an array of size tris.length * 6 where triangle i maps to a
// [x_center, x_delta, y_center, y_delta, z_center, z_delta] tuple starting at index i * 6,
// representing the center and half-extent in each dimension of triangle i
function computeTriangleBounds( geo, fullBounds ) {

	const posAttr = geo.attributes.position;
	const posArr = posAttr.array;
	const index = geo.index.array;
	const triCount = index.length / 3;
	const triangleBounds = new Float32Array( triCount * 6 );

	// support for an interleaved position buffer
	const bufferOffset = posAttr.offset || 0;
	let stride = 3;
	if ( posAttr.isInterleavedBufferAttribute ) {

		stride = posAttr.data.stride;

	}

	for ( let tri = 0; tri < triCount; tri ++ ) {

		const tri3 = tri * 3;
		const tri6 = tri * 6;
		const ai = index[ tri3 + 0 ] * stride + bufferOffset;
		const bi = index[ tri3 + 1 ] * stride + bufferOffset;
		const ci = index[ tri3 + 2 ] * stride + bufferOffset;

		for ( let el = 0; el < 3; el ++ ) {

			const a = posArr[ ai + el ];
			const b = posArr[ bi + el ];
			const c = posArr[ ci + el ];

			let min = a;
			if ( b < min ) min = b;
			if ( c < min ) min = c;

			let max = a;
			if ( b > max ) max = b;
			if ( c > max ) max = c;

			// Increase the bounds size by float32 epsilon to avoid precision errors when
			// converting to 32 bit float. Scale the epsilon by the size of the numbers being
			// worked with.
			const halfExtents = ( max - min ) / 2;
			const el2 = el * 2;
			triangleBounds[ tri6 + el2 + 0 ] = min + halfExtents;
			triangleBounds[ tri6 + el2 + 1 ] = halfExtents + ( Math.abs( min ) + halfExtents ) * FLOAT32_EPSILON;

			if ( min < fullBounds[ el ] ) fullBounds[ el ] = min;
			if ( max > fullBounds[ el + 3 ] ) fullBounds[ el + 3 ] = max;

		}

	}

	return triangleBounds;

}

function buildTree( geo, options ) {

	function triggerProgress( trianglesProcessed ) {

		if ( onProgress ) {

			onProgress( trianglesProcessed / totalTriangles );

		}

	}

	// either recursively splits the given node, creating left and right subtrees for it, or makes it a leaf node,
	// recording the offset and count of its triangles and writing them into the reordered geometry index.
	function splitNode( node, offset, count, centroidBoundingData = null, depth = 0 ) {

		if ( ! reachedMaxDepth && depth >= maxDepth ) {

			reachedMaxDepth = true;
			if ( verbose ) {

				console.warn( `MeshBVH: Max depth of ${ maxDepth } reached when generating BVH. Consider increasing maxDepth.` );
				console.warn( geo );

			}

		}

		// early out if we've met our capacity
		if ( count <= maxLeafTris || depth >= maxDepth ) {

			triggerProgress( offset + count );
			node.offset = offset;
			node.count = count;
			return node;

		}

		// Find where to split the volume
		const split = getOptimalSplit( node.boundingData, centroidBoundingData, triangleBounds, offset, count, strategy );
		if ( split.axis === - 1 ) {

			triggerProgress( offset + count );
			node.offset = offset;
			node.count = count;
			return node;

		}

		const splitOffset = partition( indexArray, triangleBounds, offset, count, split );

		// create the two new child nodes
		if ( splitOffset === offset || splitOffset === offset + count ) {

			triggerProgress( offset + count );
			node.offset = offset;
			node.count = count;

		} else {

			node.splitAxis = split.axis;

			// create the left child and compute its bounding box
			const left = new MeshBVHNode();
			const lstart = offset;
			const lcount = splitOffset - offset;
			node.left = left;
			left.boundingData = new Float32Array( 6 );

			getBounds( triangleBounds, lstart, lcount, left.boundingData, cacheCentroidBoundingData );
			splitNode( left, lstart, lcount, cacheCentroidBoundingData, depth + 1 );

			// repeat for right
			const right = new MeshBVHNode();
			const rstart = splitOffset;
			const rcount = count - lcount;
			node.right = right;
			right.boundingData = new Float32Array( 6 );

			getBounds( triangleBounds, rstart, rcount, right.boundingData, cacheCentroidBoundingData );
			splitNode( right, rstart, rcount, cacheCentroidBoundingData, depth + 1 );

		}

		return node;

	}

	ensureIndex( geo, options );

	// Compute the full bounds of the geometry at the same time as triangle bounds because
	// we'll need it for the root bounds in the case with no groups and it should be fast here.
	// We can't use the geometrying bounding box if it's available because it may be out of date.
	const fullBounds = new Float32Array( 6 );
	const cacheCentroidBoundingData = new Float32Array( 6 );
	const triangleBounds = computeTriangleBounds( geo, fullBounds );
	const indexArray = geo.index.array;
	const maxDepth = options.maxDepth;
	const verbose = options.verbose;
	const maxLeafTris = options.maxLeafTris;
	const strategy = options.strategy;
	const onProgress = options.onProgress;
	const totalTriangles = geo.index.count / 3;
	let reachedMaxDepth = false;

	const roots = [];
	const ranges = getRootIndexRanges( geo );

	if ( ranges.length === 1 ) {

		const range = ranges[ 0 ];
		const root = new MeshBVHNode();
		root.boundingData = fullBounds;
		getCentroidBounds( triangleBounds, range.offset, range.count, cacheCentroidBoundingData );

		splitNode( root, range.offset, range.count, cacheCentroidBoundingData );
		roots.push( root );

	} else {

		for ( let range of ranges ) {

			const root = new MeshBVHNode();
			root.boundingData = new Float32Array( 6 );
			getBounds( triangleBounds, range.offset, range.count, root.boundingData, cacheCentroidBoundingData );

			splitNode( root, range.offset, range.count, cacheCentroidBoundingData );
			roots.push( root );

		}

	}

	return roots;

}

function buildPackedTree( geo, options ) {

	// boundingData  				: 6 float32
	// right / offset 				: 1 uint32
	// splitAxis / isLeaf + count 	: 1 uint32 / 2 uint16
	const roots = buildTree( geo, options );

	let float32Array;
	let uint32Array;
	let uint16Array;
	const packedRoots = [];
	const BufferConstructor = options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer;
	for ( let i = 0; i < roots.length; i ++ ) {

		const root = roots[ i ];
		let nodeCount = countNodes( root );

		const buffer = new BufferConstructor( BYTES_PER_NODE * nodeCount );
		float32Array = new Float32Array( buffer );
		uint32Array = new Uint32Array( buffer );
		uint16Array = new Uint16Array( buffer );
		populateBuffer( 0, root );
		packedRoots.push( buffer );

	}

	return packedRoots;

	function countNodes( node ) {

		if ( node.count ) {

			return 1;

		} else {

			return 1 + countNodes( node.left ) + countNodes( node.right );

		}

	}

	function populateBuffer( byteOffset, node ) {

		const stride4Offset = byteOffset / 4;
		const stride2Offset = byteOffset / 2;
		const isLeaf = ! ! node.count;
		const boundingData = node.boundingData;
		for ( let i = 0; i < 6; i ++ ) {

			float32Array[ stride4Offset + i ] = boundingData[ i ];

		}

		if ( isLeaf ) {

			const offset = node.offset;
			const count = node.count;
			uint32Array[ stride4Offset + 6 ] = offset;
			uint16Array[ stride2Offset + 14 ] = count;
			uint16Array[ stride2Offset + 15 ] = IS_LEAFNODE_FLAG;
			return byteOffset + BYTES_PER_NODE;

		} else {

			const left = node.left;
			const right = node.right;
			const splitAxis = node.splitAxis;

			let nextUnusedPointer;
			nextUnusedPointer = populateBuffer( byteOffset + BYTES_PER_NODE, left );

			if ( ( nextUnusedPointer / 4 ) > Math.pow( 2, 32 ) ) {

				throw new Error( 'MeshBVH: Cannot store child pointer greater than 32 bits.' );

			}

			uint32Array[ stride4Offset + 6 ] = nextUnusedPointer / 4;
			nextUnusedPointer = populateBuffer( nextUnusedPointer, right );

			uint32Array[ stride4Offset + 7 ] = splitAxis;
			return nextUnusedPointer;

		}

	}

}

class SeparatingAxisBounds {

	constructor() {

		this.min = Infinity;
		this.max = - Infinity;

	}

	setFromPointsField( points, field ) {

		let min = Infinity;
		let max = - Infinity;
		for ( let i = 0, l = points.length; i < l; i ++ ) {

			const p = points[ i ];
			const val = p[ field ];
			min = val < min ? val : min;
			max = val > max ? val : max;

		}

		this.min = min;
		this.max = max;

	}

	setFromPoints( axis, points ) {

		let min = Infinity;
		let max = - Infinity;
		for ( let i = 0, l = points.length; i < l; i ++ ) {

			const p = points[ i ];
			const val = axis.dot( p );
			min = val < min ? val : min;
			max = val > max ? val : max;

		}

		this.min = min;
		this.max = max;

	}

	isSeparated( other ) {

		return this.min > other.max || other.min > this.max;

	}

}

SeparatingAxisBounds.prototype.setFromBox = ( function () {

	const p = new Vector3();
	return function setFromBox( axis, box ) {

		const boxMin = box.min;
		const boxMax = box.max;
		let min = Infinity;
		let max = - Infinity;
		for ( let x = 0; x <= 1; x ++ ) {

			for ( let y = 0; y <= 1; y ++ ) {

				for ( let z = 0; z <= 1; z ++ ) {

					p.x = boxMin.x * x + boxMax.x * ( 1 - x );
					p.y = boxMin.y * y + boxMax.y * ( 1 - y );
					p.z = boxMin.z * z + boxMax.z * ( 1 - z );

					const val = axis.dot( p );
					min = Math.min( val, min );
					max = Math.max( val, max );

				}

			}

		}

		this.min = min;
		this.max = max;

	};

} )();

( (function () {

	const cacheSatBounds = new SeparatingAxisBounds();
	return function areIntersecting( shape1, shape2 ) {

		const points1 = shape1.points;
		const satAxes1 = shape1.satAxes;
		const satBounds1 = shape1.satBounds;

		const points2 = shape2.points;
		const satAxes2 = shape2.satAxes;
		const satBounds2 = shape2.satBounds;

		// check axes of the first shape
		for ( let i = 0; i < 3; i ++ ) {

			const sb = satBounds1[ i ];
			const sa = satAxes1[ i ];
			cacheSatBounds.setFromPoints( sa, points2 );
			if ( sb.isSeparated( cacheSatBounds ) ) return false;

		}

		// check axes of the second shape
		for ( let i = 0; i < 3; i ++ ) {

			const sb = satBounds2[ i ];
			const sa = satAxes2[ i ];
			cacheSatBounds.setFromPoints( sa, points1 );
			if ( sb.isSeparated( cacheSatBounds ) ) return false;

		}

	};

}) )();

const closestPointLineToLine = ( function () {

	// https://github.com/juj/MathGeoLib/blob/master/src/Geometry/Line.cpp#L56
	const dir1 = new Vector3();
	const dir2 = new Vector3();
	const v02 = new Vector3();
	return function closestPointLineToLine( l1, l2, result ) {

		const v0 = l1.start;
		const v10 = dir1;
		const v2 = l2.start;
		const v32 = dir2;

		v02.subVectors( v0, v2 );
		dir1.subVectors( l1.end, l1.start );
		dir2.subVectors( l2.end, l2.start );

		// float d0232 = v02.Dot(v32);
		const d0232 = v02.dot( v32 );

		// float d3210 = v32.Dot(v10);
		const d3210 = v32.dot( v10 );

		// float d3232 = v32.Dot(v32);
		const d3232 = v32.dot( v32 );

		// float d0210 = v02.Dot(v10);
		const d0210 = v02.dot( v10 );

		// float d1010 = v10.Dot(v10);
		const d1010 = v10.dot( v10 );

		// float denom = d1010*d3232 - d3210*d3210;
		const denom = d1010 * d3232 - d3210 * d3210;

		let d, d2;
		if ( denom !== 0 ) {

			d = ( d0232 * d3210 - d0210 * d3232 ) / denom;

		} else {

			d = 0;

		}

		d2 = ( d0232 + d * d3210 ) / d3232;

		result.x = d;
		result.y = d2;

	};

} )();

const closestPointsSegmentToSegment = ( function () {

	// https://github.com/juj/MathGeoLib/blob/master/src/Geometry/LineSegment.cpp#L187
	const paramResult = new Vector2();
	const temp1 = new Vector3();
	const temp2 = new Vector3();
	return function closestPointsSegmentToSegment( l1, l2, target1, target2 ) {

		closestPointLineToLine( l1, l2, paramResult );

		let d = paramResult.x;
		let d2 = paramResult.y;
		if ( d >= 0 && d <= 1 && d2 >= 0 && d2 <= 1 ) {

			l1.at( d, target1 );
			l2.at( d2, target2 );

			return;

		} else if ( d >= 0 && d <= 1 ) {

			// Only d2 is out of bounds.
			if ( d2 < 0 ) {

				l2.at( 0, target2 );

			} else {

				l2.at( 1, target2 );

			}

			l1.closestPointToPoint( target2, true, target1 );
			return;

		} else if ( d2 >= 0 && d2 <= 1 ) {

			// Only d is out of bounds.
			if ( d < 0 ) {

				l1.at( 0, target1 );

			} else {

				l1.at( 1, target1 );

			}

			l2.closestPointToPoint( target1, true, target2 );
			return;

		} else {

			// Both u and u2 are out of bounds.
			let p;
			if ( d < 0 ) {

				p = l1.start;

			} else {

				p = l1.end;

			}

			let p2;
			if ( d2 < 0 ) {

				p2 = l2.start;

			} else {

				p2 = l2.end;

			}

			const closestPoint = temp1;
			const closestPoint2 = temp2;
			l1.closestPointToPoint( p2, true, temp1 );
			l2.closestPointToPoint( p, true, temp2 );

			if ( closestPoint.distanceToSquared( p2 ) <= closestPoint2.distanceToSquared( p ) ) {

				target1.copy( closestPoint );
				target2.copy( p2 );
				return;

			} else {

				target1.copy( p );
				target2.copy( closestPoint2 );
				return;

			}

		}

	};

} )();


const sphereIntersectTriangle = ( function () {

	// https://stackoverflow.com/questions/34043955/detect-collision-between-sphere-and-triangle-in-three-js
	const closestPointTemp = new Vector3();
	const projectedPointTemp = new Vector3();
	const planeTemp = new Plane();
	const lineTemp = new Line3();
	return function sphereIntersectTriangle( sphere, triangle ) {

		const { radius, center } = sphere;
		const { a, b, c } = triangle;

		// phase 1
		lineTemp.start = a;
		lineTemp.end = b;
		const closestPoint1 = lineTemp.closestPointToPoint( center, true, closestPointTemp );
		if ( closestPoint1.distanceTo( center ) <= radius ) return true;

		lineTemp.start = a;
		lineTemp.end = c;
		const closestPoint2 = lineTemp.closestPointToPoint( center, true, closestPointTemp );
		if ( closestPoint2.distanceTo( center ) <= radius ) return true;

		lineTemp.start = b;
		lineTemp.end = c;
		const closestPoint3 = lineTemp.closestPointToPoint( center, true, closestPointTemp );
		if ( closestPoint3.distanceTo( center ) <= radius ) return true;

		// phase 2
		const plane = triangle.getPlane( planeTemp );
		const dp = Math.abs( plane.distanceToPoint( center ) );
		if ( dp <= radius ) {

			const pp = plane.projectPoint( center, projectedPointTemp );
			const cp = triangle.containsPoint( pp );
			if ( cp ) return true;

		}

		return false;

	};

} )();

const DIST_EPSILON = 1e-15;
function isNearZero( value ) {

	return Math.abs( value ) < DIST_EPSILON;

}

class ExtendedTriangle extends Triangle {

	constructor( ...args ) {

		super( ...args );

		this.isExtendedTriangle = true;
		this.satAxes = new Array( 4 ).fill().map( () => new Vector3() );
		this.satBounds = new Array( 4 ).fill().map( () => new SeparatingAxisBounds() );
		this.points = [ this.a, this.b, this.c ];
		this.sphere = new Sphere();
		this.plane = new Plane();
		this.needsUpdate = true;

	}

	intersectsSphere( sphere ) {

		return sphereIntersectTriangle( sphere, this );

	}

	update() {

		const a = this.a;
		const b = this.b;
		const c = this.c;
		const points = this.points;

		const satAxes = this.satAxes;
		const satBounds = this.satBounds;

		const axis0 = satAxes[ 0 ];
		const sab0 = satBounds[ 0 ];
		this.getNormal( axis0 );
		sab0.setFromPoints( axis0, points );

		const axis1 = satAxes[ 1 ];
		const sab1 = satBounds[ 1 ];
		axis1.subVectors( a, b );
		sab1.setFromPoints( axis1, points );

		const axis2 = satAxes[ 2 ];
		const sab2 = satBounds[ 2 ];
		axis2.subVectors( b, c );
		sab2.setFromPoints( axis2, points );

		const axis3 = satAxes[ 3 ];
		const sab3 = satBounds[ 3 ];
		axis3.subVectors( c, a );
		sab3.setFromPoints( axis3, points );

		this.sphere.setFromPoints( this.points );
		this.plane.setFromNormalAndCoplanarPoint( axis0, a );
		this.needsUpdate = false;

	}

}

ExtendedTriangle.prototype.closestPointToSegment = ( function () {

	const point1 = new Vector3();
	const point2 = new Vector3();
	const edge = new Line3();

	return function distanceToSegment( segment, target1 = null, target2 = null ) {

		const { start, end } = segment;
		const points = this.points;
		let distSq;
		let closestDistanceSq = Infinity;

		// check the triangle edges
		for ( let i = 0; i < 3; i ++ ) {

			const nexti = ( i + 1 ) % 3;
			edge.start.copy( points[ i ] );
			edge.end.copy( points[ nexti ] );

			closestPointsSegmentToSegment( edge, segment, point1, point2 );

			distSq = point1.distanceToSquared( point2 );
			if ( distSq < closestDistanceSq ) {

				closestDistanceSq = distSq;
				if ( target1 ) target1.copy( point1 );
				if ( target2 ) target2.copy( point2 );

			}

		}

		// check end points
		this.closestPointToPoint( start, point1 );
		distSq = start.distanceToSquared( point1 );
		if ( distSq < closestDistanceSq ) {

			closestDistanceSq = distSq;
			if ( target1 ) target1.copy( point1 );
			if ( target2 ) target2.copy( start );

		}

		this.closestPointToPoint( end, point1 );
		distSq = end.distanceToSquared( point1 );
		if ( distSq < closestDistanceSq ) {

			closestDistanceSq = distSq;
			if ( target1 ) target1.copy( point1 );
			if ( target2 ) target2.copy( end );

		}

		return Math.sqrt( closestDistanceSq );

	};

} )();

ExtendedTriangle.prototype.intersectsTriangle = ( function () {

	const saTri2 = new ExtendedTriangle();
	const arr1 = new Array( 3 );
	const arr2 = new Array( 3 );
	const cachedSatBounds = new SeparatingAxisBounds();
	const cachedSatBounds2 = new SeparatingAxisBounds();
	const cachedAxis = new Vector3();
	const dir1 = new Vector3();
	const dir2 = new Vector3();
	const tempDir = new Vector3();
	const edge = new Line3();
	const edge1 = new Line3();
	const edge2 = new Line3();

	// TODO: If the triangles are coplanar and intersecting the target is nonsensical. It should at least
	// be a line contained by both triangles if not a different special case somehow represented in the return result.
	return function intersectsTriangle( other, target = null ) {

		if ( this.needsUpdate ) {

			this.update();

		}

		if ( ! other.isExtendedTriangle ) {

			saTri2.copy( other );
			saTri2.update();
			other = saTri2;

		} else if ( other.needsUpdate ) {

			other.update();

		}

		const plane1 = this.plane;
		const plane2 = other.plane;

		if ( Math.abs( plane1.normal.dot( plane2.normal ) ) > 1.0 - 1e-10 ) {

			// perform separating axis intersection test only for coplanar triangles
			const satBounds1 = this.satBounds;
			const satAxes1 = this.satAxes;
			arr2[ 0 ] = other.a;
			arr2[ 1 ] = other.b;
			arr2[ 2 ] = other.c;
			for ( let i = 0; i < 4; i ++ ) {

				const sb = satBounds1[ i ];
				const sa = satAxes1[ i ];
				cachedSatBounds.setFromPoints( sa, arr2 );
				if ( sb.isSeparated( cachedSatBounds ) ) return false;

			}

			const satBounds2 = other.satBounds;
			const satAxes2 = other.satAxes;
			arr1[ 0 ] = this.a;
			arr1[ 1 ] = this.b;
			arr1[ 2 ] = this.c;
			for ( let i = 0; i < 4; i ++ ) {

				const sb = satBounds2[ i ];
				const sa = satAxes2[ i ];
				cachedSatBounds.setFromPoints( sa, arr1 );
				if ( sb.isSeparated( cachedSatBounds ) ) return false;

			}

			// check crossed axes
			for ( let i = 0; i < 4; i ++ ) {

				const sa1 = satAxes1[ i ];
				for ( let i2 = 0; i2 < 4; i2 ++ ) {

					const sa2 = satAxes2[ i2 ];
					cachedAxis.crossVectors( sa1, sa2 );
					cachedSatBounds.setFromPoints( cachedAxis, arr1 );
					cachedSatBounds2.setFromPoints( cachedAxis, arr2 );
					if ( cachedSatBounds.isSeparated( cachedSatBounds2 ) ) return false;

				}

			}

			if ( target ) {

				// TODO find two points that intersect on the edges and make that the result
				console.warn( 'ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0.' );

				target.start.set( 0, 0, 0 );
				target.end.set( 0, 0, 0 );

			}

			return true;

		} else {

			// find the edge that intersects the other triangle plane
			const points1 = this.points;
			let found1 = false;
			let count1 = 0;
			for ( let i = 0; i < 3; i ++ ) {

				const p = points1[ i ];
				const pNext = points1[ ( i + 1 ) % 3 ];

				edge.start.copy( p );
				edge.end.copy( pNext );
				edge.delta( dir1 );

				const targetPoint = found1 ? edge1.start : edge1.end;
				const startIntersects = isNearZero( plane2.distanceToPoint( p ) );
				if ( isNearZero( plane2.normal.dot( dir1 ) ) && startIntersects ) {

					// if the edge lies on the plane then take the line
					edge1.copy( edge );
					count1 = 2;
					break;

				}

				// check if the start point is near the plane because "intersectLine" is not robust to that case
				const doesIntersect = plane2.intersectLine( edge, targetPoint ) || startIntersects;
				if ( doesIntersect && ! isNearZero( targetPoint.distanceTo( pNext ) ) ) {

					count1 ++;
					if ( found1 ) {

						break;

					}

					found1 = true;

				}

			}

			if ( count1 === 1 && this.containsPoint( edge1.end ) ) {

				if ( target ) {

					target.start.copy( edge1.end );
					target.end.copy( edge1.end );

				}

				return true;

			} else if ( count1 !== 2 ) {

				return false;

			}

			// find the other triangles edge that intersects this plane
			const points2 = other.points;
			let found2 = false;
			let count2 = 0;
			for ( let i = 0; i < 3; i ++ ) {

				const p = points2[ i ];
				const pNext = points2[ ( i + 1 ) % 3 ];

				edge.start.copy( p );
				edge.end.copy( pNext );
				edge.delta( dir2 );

				const targetPoint = found2 ? edge2.start : edge2.end;
				const startIntersects = isNearZero( plane1.distanceToPoint( p ) );
				if ( isNearZero( plane1.normal.dot( dir2 ) ) && startIntersects ) {

					// if the edge lies on the plane then take the line
					edge2.copy( edge );
					count2 = 2;
					break;

				}

				// check if the start point is near the plane because "intersectLine" is not robust to that case
				const doesIntersect = plane1.intersectLine( edge, targetPoint ) || startIntersects;
				if ( doesIntersect && ! isNearZero( targetPoint.distanceTo( pNext ) ) ) {

					count2 ++;
					if ( found2 ) {

						break;

					}

					found2 = true;

				}

			}

			if ( count2 === 1 && this.containsPoint( edge2.end ) ) {

				if ( target ) {

					target.start.copy( edge2.end );
					target.end.copy( edge2.end );

				}

				return true;

			} else if ( count2 !== 2 ) {

				return false;

			}

			// find swap the second edge so both lines are running the same direction
			edge1.delta( dir1 );
			edge2.delta( dir2 );

			if ( dir1.dot( dir2 ) < 0 ) {

				let tmp = edge2.start;
				edge2.start = edge2.end;
				edge2.end = tmp;

			}

			// check if the edges are overlapping
			const s1 = edge1.start.dot( dir1 );
			const e1 = edge1.end.dot( dir1 );
			const s2 = edge2.start.dot( dir1 );
			const e2 = edge2.end.dot( dir1 );
			const separated1 = e1 < s2;
			const separated2 = s1 < e2;

			if ( s1 !== e2 && s2 !== e1 && separated1 === separated2 ) {

				return false;

			}

			// assign the target output
			if ( target ) {

				tempDir.subVectors( edge1.start, edge2.start );
				if ( tempDir.dot( dir1 ) > 0 ) {

					target.start.copy( edge1.start );

				} else {

					target.start.copy( edge2.start );

				}

				tempDir.subVectors( edge1.end, edge2.end );
				if ( tempDir.dot( dir1 ) < 0 ) {

					target.end.copy( edge1.end );

				} else {

					target.end.copy( edge2.end );

				}

			}

			return true;

		}

	};

} )();


ExtendedTriangle.prototype.distanceToPoint = ( function () {

	const target = new Vector3();
	return function distanceToPoint( point ) {

		this.closestPointToPoint( point, target );
		return point.distanceTo( target );

	};

} )();


ExtendedTriangle.prototype.distanceToTriangle = ( function () {

	const point = new Vector3();
	const point2 = new Vector3();
	const cornerFields = [ 'a', 'b', 'c' ];
	const line1 = new Line3();
	const line2 = new Line3();

	return function distanceToTriangle( other, target1 = null, target2 = null ) {

		const lineTarget = target1 || target2 ? line1 : null;
		if ( this.intersectsTriangle( other, lineTarget ) ) {

			if ( target1 || target2 ) {

				if ( target1 ) lineTarget.getCenter( target1 );
				if ( target2 ) lineTarget.getCenter( target2 );

			}

			return 0;

		}

		let closestDistanceSq = Infinity;

		// check all point distances
		for ( let i = 0; i < 3; i ++ ) {

			let dist;
			const field = cornerFields[ i ];
			const otherVec = other[ field ];
			this.closestPointToPoint( otherVec, point );

			dist = otherVec.distanceToSquared( point );

			if ( dist < closestDistanceSq ) {

				closestDistanceSq = dist;
				if ( target1 ) target1.copy( point );
				if ( target2 ) target2.copy( otherVec );

			}


			const thisVec = this[ field ];
			other.closestPointToPoint( thisVec, point );

			dist = thisVec.distanceToSquared( point );

			if ( dist < closestDistanceSq ) {

				closestDistanceSq = dist;
				if ( target1 ) target1.copy( thisVec );
				if ( target2 ) target2.copy( point );

			}

		}

		for ( let i = 0; i < 3; i ++ ) {

			const f11 = cornerFields[ i ];
			const f12 = cornerFields[ ( i + 1 ) % 3 ];
			line1.set( this[ f11 ], this[ f12 ] );
			for ( let i2 = 0; i2 < 3; i2 ++ ) {

				const f21 = cornerFields[ i2 ];
				const f22 = cornerFields[ ( i2 + 1 ) % 3 ];
				line2.set( other[ f21 ], other[ f22 ] );

				closestPointsSegmentToSegment( line1, line2, point, point2 );

				const dist = point.distanceToSquared( point2 );
				if ( dist < closestDistanceSq ) {

					closestDistanceSq = dist;
					if ( target1 ) target1.copy( point );
					if ( target2 ) target2.copy( point2 );

				}

			}

		}

		return Math.sqrt( closestDistanceSq );

	};

} )();

class OrientedBox extends Box3 {

	constructor( ...args ) {

		super( ...args );

		this.isOrientedBox = true;
		this.matrix = new Matrix4();
		this.invMatrix = new Matrix4();
		this.points = new Array( 8 ).fill().map( () => new Vector3() );
		this.satAxes = new Array( 3 ).fill().map( () => new Vector3() );
		this.satBounds = new Array( 3 ).fill().map( () => new SeparatingAxisBounds() );
		this.alignedSatBounds = new Array( 3 ).fill().map( () => new SeparatingAxisBounds() );
		this.needsUpdate = false;

	}

	set( min, max, matrix ) {

		super.set( min, max );
		this.matrix.copy( matrix );
		this.needsUpdate = true;

	}

	copy( other ) {

		super.copy( other );
		this.matrix.copy( other.matrix );
		this.needsUpdate = true;

	}

}

OrientedBox.prototype.update = ( function () {

	return function update() {

		const matrix = this.matrix;
		const min = this.min;
		const max = this.max;

		const points = this.points;
		for ( let x = 0; x <= 1; x ++ ) {

			for ( let y = 0; y <= 1; y ++ ) {

				for ( let z = 0; z <= 1; z ++ ) {

					const i = ( ( 1 << 0 ) * x ) | ( ( 1 << 1 ) * y ) | ( ( 1 << 2 ) * z );
					const v = points[ i ];
					v.x = x ? max.x : min.x;
					v.y = y ? max.y : min.y;
					v.z = z ? max.z : min.z;

					v.applyMatrix4( matrix );

				}

			}

		}

		const satBounds = this.satBounds;
		const satAxes = this.satAxes;
		const minVec = points[ 0 ];
		for ( let i = 0; i < 3; i ++ ) {

			const axis = satAxes[ i ];
			const sb = satBounds[ i ];
			const index = 1 << i;
			const pi = points[ index ];

			axis.subVectors( minVec, pi );
			sb.setFromPoints( axis, points );

		}

		const alignedSatBounds = this.alignedSatBounds;
		alignedSatBounds[ 0 ].setFromPointsField( points, 'x' );
		alignedSatBounds[ 1 ].setFromPointsField( points, 'y' );
		alignedSatBounds[ 2 ].setFromPointsField( points, 'z' );

		this.invMatrix.copy( this.matrix ).invert();
		this.needsUpdate = false;

	};

} )();

OrientedBox.prototype.intersectsBox = ( function () {

	const aabbBounds = new SeparatingAxisBounds();
	return function intersectsBox( box ) {

		// TODO: should this be doing SAT against the AABB?
		if ( this.needsUpdate ) {

			this.update();

		}

		const min = box.min;
		const max = box.max;
		const satBounds = this.satBounds;
		const satAxes = this.satAxes;
		const alignedSatBounds = this.alignedSatBounds;

		aabbBounds.min = min.x;
		aabbBounds.max = max.x;
		if ( alignedSatBounds[ 0 ].isSeparated( aabbBounds ) ) return false;

		aabbBounds.min = min.y;
		aabbBounds.max = max.y;
		if ( alignedSatBounds[ 1 ].isSeparated( aabbBounds ) ) return false;

		aabbBounds.min = min.z;
		aabbBounds.max = max.z;
		if ( alignedSatBounds[ 2 ].isSeparated( aabbBounds ) ) return false;

		for ( let i = 0; i < 3; i ++ ) {

			const axis = satAxes[ i ];
			const sb = satBounds[ i ];
			aabbBounds.setFromBox( axis, box );
			if ( sb.isSeparated( aabbBounds ) ) return false;

		}

		return true;

	};

} )();

OrientedBox.prototype.intersectsTriangle = ( function () {

	const saTri = new ExtendedTriangle();
	const pointsArr = new Array( 3 );
	const cachedSatBounds = new SeparatingAxisBounds();
	const cachedSatBounds2 = new SeparatingAxisBounds();
	const cachedAxis = new Vector3();
	return function intersectsTriangle( triangle ) {

		if ( this.needsUpdate ) {

			this.update();

		}

		if ( ! triangle.isExtendedTriangle ) {

			saTri.copy( triangle );
			saTri.update();
			triangle = saTri;

		} else if ( triangle.needsUpdate ) {

			triangle.update();

		}

		const satBounds = this.satBounds;
		const satAxes = this.satAxes;

		pointsArr[ 0 ] = triangle.a;
		pointsArr[ 1 ] = triangle.b;
		pointsArr[ 2 ] = triangle.c;

		for ( let i = 0; i < 3; i ++ ) {

			const sb = satBounds[ i ];
			const sa = satAxes[ i ];
			cachedSatBounds.setFromPoints( sa, pointsArr );
			if ( sb.isSeparated( cachedSatBounds ) ) return false;

		}

		const triSatBounds = triangle.satBounds;
		const triSatAxes = triangle.satAxes;
		const points = this.points;
		for ( let i = 0; i < 3; i ++ ) {

			const sb = triSatBounds[ i ];
			const sa = triSatAxes[ i ];
			cachedSatBounds.setFromPoints( sa, points );
			if ( sb.isSeparated( cachedSatBounds ) ) return false;

		}

		// check crossed axes
		for ( let i = 0; i < 3; i ++ ) {

			const sa1 = satAxes[ i ];
			for ( let i2 = 0; i2 < 4; i2 ++ ) {

				const sa2 = triSatAxes[ i2 ];
				cachedAxis.crossVectors( sa1, sa2 );
				cachedSatBounds.setFromPoints( cachedAxis, pointsArr );
				cachedSatBounds2.setFromPoints( cachedAxis, points );
				if ( cachedSatBounds.isSeparated( cachedSatBounds2 ) ) return false;

			}

		}

		return true;

	};

} )();

OrientedBox.prototype.closestPointToPoint = ( function () {

	return function closestPointToPoint( point, target1 ) {

		if ( this.needsUpdate ) {

			this.update();

		}

		target1
			.copy( point )
			.applyMatrix4( this.invMatrix )
			.clamp( this.min, this.max )
			.applyMatrix4( this.matrix );

		return target1;

	};

} )();

OrientedBox.prototype.distanceToPoint = ( function () {

	const target = new Vector3();
	return function distanceToPoint( point ) {

		this.closestPointToPoint( point, target );
		return point.distanceTo( target );

	};

} )();

OrientedBox.prototype.distanceToBox = ( function () {

	const xyzFields = [ 'x', 'y', 'z' ];
	const segments1 = new Array( 12 ).fill().map( () => new Line3() );
	const segments2 = new Array( 12 ).fill().map( () => new Line3() );

	const point1 = new Vector3();
	const point2 = new Vector3();

	// early out if we find a value below threshold
	return function distanceToBox( box, threshold = 0, target1 = null, target2 = null ) {

		if ( this.needsUpdate ) {

			this.update();

		}

		if ( this.intersectsBox( box ) ) {

			if ( target1 || target2 ) {

				box.getCenter( point2 );
				this.closestPointToPoint( point2, point1 );
				box.closestPointToPoint( point1, point2 );

				if ( target1 ) target1.copy( point1 );
				if ( target2 ) target2.copy( point2 );

			}

			return 0;

		}

		const threshold2 = threshold * threshold;
		const min = box.min;
		const max = box.max;
		const points = this.points;


		// iterate over every edge and compare distances
		let closestDistanceSq = Infinity;

		// check over all these points
		for ( let i = 0; i < 8; i ++ ) {

			const p = points[ i ];
			point2.copy( p ).clamp( min, max );

			const dist = p.distanceToSquared( point2 );
			if ( dist < closestDistanceSq ) {

				closestDistanceSq = dist;
				if ( target1 ) target1.copy( p );
				if ( target2 ) target2.copy( point2 );

				if ( dist < threshold2 ) return Math.sqrt( dist );

			}

		}

		// generate and check all line segment distances
		let count = 0;
		for ( let i = 0; i < 3; i ++ ) {

			for ( let i1 = 0; i1 <= 1; i1 ++ ) {

				for ( let i2 = 0; i2 <= 1; i2 ++ ) {

					const nextIndex = ( i + 1 ) % 3;
					const nextIndex2 = ( i + 2 ) % 3;

					// get obb line segments
					const index = i1 << nextIndex | i2 << nextIndex2;
					const index2 = 1 << i | i1 << nextIndex | i2 << nextIndex2;
					const p1 = points[ index ];
					const p2 = points[ index2 ];
					const line1 = segments1[ count ];
					line1.set( p1, p2 );


					// get aabb line segments
					const f1 = xyzFields[ i ];
					const f2 = xyzFields[ nextIndex ];
					const f3 = xyzFields[ nextIndex2 ];
					const line2 = segments2[ count ];
					const start = line2.start;
					const end = line2.end;

					start[ f1 ] = min[ f1 ];
					start[ f2 ] = i1 ? min[ f2 ] : max[ f2 ];
					start[ f3 ] = i2 ? min[ f3 ] : max[ f2 ];

					end[ f1 ] = max[ f1 ];
					end[ f2 ] = i1 ? min[ f2 ] : max[ f2 ];
					end[ f3 ] = i2 ? min[ f3 ] : max[ f2 ];

					count ++;

				}

			}

		}

		// check all the other boxes point
		for ( let x = 0; x <= 1; x ++ ) {

			for ( let y = 0; y <= 1; y ++ ) {

				for ( let z = 0; z <= 1; z ++ ) {

					point2.x = x ? max.x : min.x;
					point2.y = y ? max.y : min.y;
					point2.z = z ? max.z : min.z;

					this.closestPointToPoint( point2, point1 );
					const dist = point2.distanceToSquared( point1 );
					if ( dist < closestDistanceSq ) {

						closestDistanceSq = dist;
						if ( target1 ) target1.copy( point1 );
						if ( target2 ) target2.copy( point2 );

						if ( dist < threshold2 ) return Math.sqrt( dist );

					}

				}

			}

		}

		for ( let i = 0; i < 12; i ++ ) {

			const l1 = segments1[ i ];
			for ( let i2 = 0; i2 < 12; i2 ++ ) {

				const l2 = segments2[ i2 ];
				closestPointsSegmentToSegment( l1, l2, point1, point2 );
				const dist = point1.distanceToSquared( point2 );
				if ( dist < closestDistanceSq ) {

					closestDistanceSq = dist;
					if ( target1 ) target1.copy( point1 );
					if ( target2 ) target2.copy( point2 );

					if ( dist < threshold2 ) return Math.sqrt( dist );

				}

			}

		}

		return Math.sqrt( closestDistanceSq );

	};

} )();

// Ripped and modified From THREE.js Mesh raycast
// https://github.com/mrdoob/three.js/blob/0aa87c999fe61e216c1133fba7a95772b503eddf/src/objects/Mesh.js#L115
const vA = /* @__PURE__ */ new Vector3();
const vB = /* @__PURE__ */ new Vector3();
const vC = /* @__PURE__ */ new Vector3();

const uvA = /* @__PURE__ */ new Vector2();
const uvB = /* @__PURE__ */ new Vector2();
const uvC = /* @__PURE__ */ new Vector2();

const intersectionPoint = /* @__PURE__ */ new Vector3();
function checkIntersection( ray, pA, pB, pC, point, side ) {

	let intersect;
	if ( side === BackSide ) {

		intersect = ray.intersectTriangle( pC, pB, pA, true, point );

	} else {

		intersect = ray.intersectTriangle( pA, pB, pC, side !== DoubleSide, point );

	}

	if ( intersect === null ) return null;

	const distance = ray.origin.distanceTo( point );

	return {

		distance: distance,
		point: point.clone(),

	};

}

function checkBufferGeometryIntersection( ray, position, uv, a, b, c, side ) {

	vA.fromBufferAttribute( position, a );
	vB.fromBufferAttribute( position, b );
	vC.fromBufferAttribute( position, c );

	const intersection = checkIntersection( ray, vA, vB, vC, intersectionPoint, side );

	if ( intersection ) {

		if ( uv ) {

			uvA.fromBufferAttribute( uv, a );
			uvB.fromBufferAttribute( uv, b );
			uvC.fromBufferAttribute( uv, c );

			intersection.uv = Triangle.getUV( intersectionPoint, vA, vB, vC, uvA, uvB, uvC, new Vector2( ) );

		}

		const face = {
			a: a,
			b: b,
			c: c,
			normal: new Vector3(),
			materialIndex: 0
		};

		Triangle.getNormal( vA, vB, vC, face.normal );

		intersection.face = face;
		intersection.faceIndex = a;

	}

	return intersection;

}

// https://github.com/mrdoob/three.js/blob/0aa87c999fe61e216c1133fba7a95772b503eddf/src/objects/Mesh.js#L258
function intersectTri( geo, side, ray, tri, intersections ) {

	const triOffset = tri * 3;
	const a = geo.index.getX( triOffset );
	const b = geo.index.getX( triOffset + 1 );
	const c = geo.index.getX( triOffset + 2 );

	const intersection = checkBufferGeometryIntersection( ray, geo.attributes.position, geo.attributes.uv, a, b, c, side );

	if ( intersection ) {

		intersection.faceIndex = tri;
		if ( intersections ) intersections.push( intersection );
		return intersection;

	}

	return null;

}

function intersectTris( geo, side, ray, offset, count, intersections ) {

	for ( let i = offset, end = offset + count; i < end; i ++ ) {

		intersectTri( geo, side, ray, i, intersections );

	}

}

function intersectClosestTri( geo, side, ray, offset, count ) {

	let dist = Infinity;
	let res = null;
	for ( let i = offset, end = offset + count; i < end; i ++ ) {

		const intersection = intersectTri( geo, side, ray, i );
		if ( intersection && intersection.distance < dist ) {

			res = intersection;
			dist = intersection.distance;

		}

	}

	return res;

}

// converts the given BVH raycast intersection to align with the three.js raycast
// structure (include object, world space distance and point).
function convertRaycastIntersect( hit, object, raycaster ) {

	if ( hit === null ) {

		return null;

	}

	hit.point.applyMatrix4( object.matrixWorld );
	hit.distance = hit.point.distanceTo( raycaster.ray.origin );
	hit.object = object;

	if ( hit.distance < raycaster.near || hit.distance > raycaster.far ) {

		return null;

	} else {

		return hit;

	}

}

// sets the vertices of triangle `tri` with the 3 vertices after i
function setTriangle( tri, i, index, pos ) {

	const ta = tri.a;
	const tb = tri.b;
	const tc = tri.c;

	let i0 = i;
	let i1 = i + 1;
	let i2 = i + 2;
	if ( index ) {

		i0 = index.getX( i );
		i1 = index.getX( i + 1 );
		i2 = index.getX( i + 2 );

	}

	ta.x = pos.getX( i0 );
	ta.y = pos.getY( i0 );
	ta.z = pos.getZ( i0 );

	tb.x = pos.getX( i1 );
	tb.y = pos.getY( i1 );
	tb.z = pos.getZ( i1 );

	tc.x = pos.getX( i2 );
	tc.y = pos.getY( i2 );
	tc.z = pos.getZ( i2 );

}

function iterateOverTriangles(
	offset,
	count,
	geometry,
	intersectsTriangleFunc,
	contained,
	depth,
	triangle
) {

	const index = geometry.index;
	const pos = geometry.attributes.position;
	for ( let i = offset, l = count + offset; i < l; i ++ ) {

		setTriangle( triangle, i * 3, index, pos );
		triangle.needsUpdate = true;

		if ( intersectsTriangleFunc( triangle, i, contained, depth ) ) {

			return true;

		}

	}

	return false;

}

class PrimitivePool {

	constructor( getNewPrimitive ) {

		this._getNewPrimitive = getNewPrimitive;
		this._primitives = [];

	}

	getPrimitive() {

		const primitives = this._primitives;
		if ( primitives.length === 0 ) {

			return this._getNewPrimitive();

		} else {

			return primitives.pop();

		}

	}

	releasePrimitive( primitive ) {

		this._primitives.push( primitive );

	}

}

function IS_LEAF( n16, uint16Array ) {

	return uint16Array[ n16 + 15 ] === 0xFFFF;

}

function OFFSET( n32, uint32Array ) {

	return uint32Array[ n32 + 6 ];

}

function COUNT( n16, uint16Array ) {

	return uint16Array[ n16 + 14 ];

}

function LEFT_NODE( n32 ) {

	return n32 + 8;

}

function RIGHT_NODE( n32, uint32Array ) {

	return uint32Array[ n32 + 6 ];

}

function SPLIT_AXIS( n32, uint32Array ) {

	return uint32Array[ n32 + 7 ];

}

function BOUNDING_DATA_INDEX( n32 ) {

	return n32;

}

const boundingBox = new Box3();
const boxIntersection = new Vector3();
const xyzFields = [ 'x', 'y', 'z' ];

function raycast( nodeIndex32, geometry, side, ray, intersects ) {

	let nodeIndex16 = nodeIndex32 * 2, float32Array = _float32Array, uint16Array = _uint16Array, uint32Array = _uint32Array;

	const isLeaf = IS_LEAF( nodeIndex16, uint16Array );
	if ( isLeaf ) {

		const offset = OFFSET( nodeIndex32, uint32Array );
		const count = COUNT( nodeIndex16, uint16Array );

		intersectTris( geometry, side, ray, offset, count, intersects );

	} else {

		const leftIndex = LEFT_NODE( nodeIndex32 );
		if ( intersectRay( leftIndex, float32Array, ray, boxIntersection ) ) {

			raycast( leftIndex, geometry, side, ray, intersects );

		}

		const rightIndex = RIGHT_NODE( nodeIndex32, uint32Array );
		if ( intersectRay( rightIndex, float32Array, ray, boxIntersection ) ) {

			raycast( rightIndex, geometry, side, ray, intersects );

		}

	}

}

function raycastFirst( nodeIndex32, geometry, side, ray ) {

	let nodeIndex16 = nodeIndex32 * 2, float32Array = _float32Array, uint16Array = _uint16Array, uint32Array = _uint32Array;

	const isLeaf = IS_LEAF( nodeIndex16, uint16Array );
	if ( isLeaf ) {

		const offset = OFFSET( nodeIndex32, uint32Array );
		const count = COUNT( nodeIndex16, uint16Array );
		return intersectClosestTri( geometry, side, ray, offset, count );

	} else {

		// consider the position of the split plane with respect to the oncoming ray; whichever direction
		// the ray is coming from, look for an intersection among that side of the tree first
		const splitAxis = SPLIT_AXIS( nodeIndex32, uint32Array );
		const xyzAxis = xyzFields[ splitAxis ];
		const rayDir = ray.direction[ xyzAxis ];
		const leftToRight = rayDir >= 0;

		// c1 is the child to check first
		let c1, c2;
		if ( leftToRight ) {

			c1 = LEFT_NODE( nodeIndex32 );
			c2 = RIGHT_NODE( nodeIndex32, uint32Array );

		} else {

			c1 = RIGHT_NODE( nodeIndex32, uint32Array );
			c2 = LEFT_NODE( nodeIndex32 );

		}

		const c1Intersection = intersectRay( c1, float32Array, ray, boxIntersection );
		const c1Result = c1Intersection ? raycastFirst( c1, geometry, side, ray ) : null;

		// if we got an intersection in the first node and it's closer than the second node's bounding
		// box, we don't need to consider the second node because it couldn't possibly be a better result
		if ( c1Result ) {

			// check if the point is within the second bounds
			// "point" is in the local frame of the bvh
			const point = c1Result.point[ xyzAxis ];
			const isOutside = leftToRight ?
				point <= float32Array[ c2 + splitAxis ] : // min bounding data
				point >= float32Array[ c2 + splitAxis + 3 ]; // max bounding data

			if ( isOutside ) {

				return c1Result;

			}

		}

		// either there was no intersection in the first node, or there could still be a closer
		// intersection in the second, so check the second node and then take the better of the two
		const c2Intersection = intersectRay( c2, float32Array, ray, boxIntersection );
		const c2Result = c2Intersection ? raycastFirst( c2, geometry, side, ray ) : null;

		if ( c1Result && c2Result ) {

			return c1Result.distance <= c2Result.distance ? c1Result : c2Result;

		} else {

			return c1Result || c2Result || null;

		}

	}

}

const shapecast = ( function () {

	let _box1, _box2;
	const boxStack = [];
	const boxPool = new PrimitivePool( () => new Box3() );

	return function shapecast( ...args ) {

		_box1 = boxPool.getPrimitive();
		_box2 = boxPool.getPrimitive();
		boxStack.push( _box1, _box2 );

		const result = shapecastTraverse( ...args );

		boxPool.releasePrimitive( _box1 );
		boxPool.releasePrimitive( _box2 );
		boxStack.pop();
		boxStack.pop();

		const length = boxStack.length;
		if ( length > 0 ) {

			_box2 = boxStack[ length - 1 ];
			_box1 = boxStack[ length - 2 ];

		}

		return result;

	};

	function shapecastTraverse(
		nodeIndex32,
		geometry,
		intersectsBoundsFunc,
		intersectsRangeFunc,
		nodeScoreFunc = null,
		nodeIndexByteOffset = 0, // offset for unique node identifier
		depth = 0
	) {

		// Define these inside the function so it has access to the local variables needed
		// when converting to the buffer equivalents
		function getLeftOffset( nodeIndex32 ) {

			let nodeIndex16 = nodeIndex32 * 2, uint16Array = _uint16Array, uint32Array = _uint32Array;

			// traverse until we find a leaf
			while ( ! IS_LEAF( nodeIndex16, uint16Array ) ) {

				nodeIndex32 = LEFT_NODE( nodeIndex32 );
				nodeIndex16 = nodeIndex32 * 2;

			}

			return OFFSET( nodeIndex32, uint32Array );

		}

		function getRightEndOffset( nodeIndex32 ) {

			let nodeIndex16 = nodeIndex32 * 2, uint16Array = _uint16Array, uint32Array = _uint32Array;

			// traverse until we find a leaf
			while ( ! IS_LEAF( nodeIndex16, uint16Array ) ) {

				// adjust offset to point to the right node
				nodeIndex32 = RIGHT_NODE( nodeIndex32, uint32Array );
				nodeIndex16 = nodeIndex32 * 2;

			}

			// return the end offset of the triangle range
			return OFFSET( nodeIndex32, uint32Array ) + COUNT( nodeIndex16, uint16Array );

		}

		let nodeIndex16 = nodeIndex32 * 2, float32Array = _float32Array, uint16Array = _uint16Array, uint32Array = _uint32Array;

		const isLeaf = IS_LEAF( nodeIndex16, uint16Array );
		if ( isLeaf ) {

			const offset = OFFSET( nodeIndex32, uint32Array );
			const count = COUNT( nodeIndex16, uint16Array );
			arrayToBox( BOUNDING_DATA_INDEX( nodeIndex32 ), float32Array, _box1 );
			return intersectsRangeFunc( offset, count, false, depth, nodeIndexByteOffset + nodeIndex32, _box1 );

		} else {

			const left = LEFT_NODE( nodeIndex32 );
			const right = RIGHT_NODE( nodeIndex32, uint32Array );
			let c1 = left;
			let c2 = right;

			let score1, score2;
			let box1, box2;
			if ( nodeScoreFunc ) {

				box1 = _box1;
				box2 = _box2;

				// bounding data is not offset
				arrayToBox( BOUNDING_DATA_INDEX( c1 ), float32Array, box1 );
				arrayToBox( BOUNDING_DATA_INDEX( c2 ), float32Array, box2 );

				score1 = nodeScoreFunc( box1 );
				score2 = nodeScoreFunc( box2 );

				if ( score2 < score1 ) {

					c1 = right;
					c2 = left;

					const temp = score1;
					score1 = score2;
					score2 = temp;

					box1 = box2;
					// box2 is always set before use below

				}

			}

			// Check box 1 intersection
			if ( ! box1 ) {

				box1 = _box1;
				arrayToBox( BOUNDING_DATA_INDEX( c1 ), float32Array, box1 );

			}

			const isC1Leaf = IS_LEAF( c1 * 2, uint16Array );
			const c1Intersection = intersectsBoundsFunc( box1, isC1Leaf, score1, depth + 1, nodeIndexByteOffset + c1 );

			let c1StopTraversal;
			if ( c1Intersection === CONTAINED ) {

				const offset = getLeftOffset( c1 );
				const end = getRightEndOffset( c1 );
				const count = end - offset;

				c1StopTraversal = intersectsRangeFunc( offset, count, true, depth + 1, nodeIndexByteOffset + c1, box1 );

			} else {

				c1StopTraversal =
					c1Intersection &&
					shapecastTraverse(
						c1,
						geometry,
						intersectsBoundsFunc,
						intersectsRangeFunc,
						nodeScoreFunc,
						nodeIndexByteOffset,
						depth + 1
					);

			}

			if ( c1StopTraversal ) return true;

			// Check box 2 intersection
			// cached box2 will have been overwritten by previous traversal
			box2 = _box2;
			arrayToBox( BOUNDING_DATA_INDEX( c2 ), float32Array, box2 );

			const isC2Leaf = IS_LEAF( c2 * 2, uint16Array );
			const c2Intersection = intersectsBoundsFunc( box2, isC2Leaf, score2, depth + 1, nodeIndexByteOffset + c2 );

			let c2StopTraversal;
			if ( c2Intersection === CONTAINED ) {

				const offset = getLeftOffset( c2 );
				const end = getRightEndOffset( c2 );
				const count = end - offset;

				c2StopTraversal = intersectsRangeFunc( offset, count, true, depth + 1, nodeIndexByteOffset + c2, box2 );

			} else {

				c2StopTraversal =
					c2Intersection &&
					shapecastTraverse(
						c2,
						geometry,
						intersectsBoundsFunc,
						intersectsRangeFunc,
						nodeScoreFunc,
						nodeIndexByteOffset,
						depth + 1
					);

			}

			if ( c2StopTraversal ) return true;

			return false;

		}

	}

} )();

const intersectsGeometry = ( function () {

	const triangle = new ExtendedTriangle();
	const triangle2 = new ExtendedTriangle();
	const invertedMat = new Matrix4();

	const obb = new OrientedBox();
	const obb2 = new OrientedBox();

	return function intersectsGeometry( nodeIndex32, geometry, otherGeometry, geometryToBvh, cachedObb = null ) {

		let nodeIndex16 = nodeIndex32 * 2, float32Array = _float32Array, uint16Array = _uint16Array, uint32Array = _uint32Array;

		if ( cachedObb === null ) {

			if ( ! otherGeometry.boundingBox ) {

				otherGeometry.computeBoundingBox();

			}

			obb.set( otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh );
			cachedObb = obb;

		}

		const isLeaf = IS_LEAF( nodeIndex16, uint16Array );
		if ( isLeaf ) {

			const thisGeometry = geometry;
			const thisIndex = thisGeometry.index;
			const thisPos = thisGeometry.attributes.position;

			const index = otherGeometry.index;
			const pos = otherGeometry.attributes.position;

			const offset = OFFSET( nodeIndex32, uint32Array );
			const count = COUNT( nodeIndex16, uint16Array );

			// get the inverse of the geometry matrix so we can transform our triangles into the
			// geometry space we're trying to test. We assume there are fewer triangles being checked
			// here.
			invertedMat.copy( geometryToBvh ).invert();

			if ( otherGeometry.boundsTree ) {

				arrayToBox( BOUNDING_DATA_INDEX( nodeIndex32 ), float32Array, obb2 );
				obb2.matrix.copy( invertedMat );
				obb2.needsUpdate = true;

				const res = otherGeometry.boundsTree.shapecast( {

					intersectsBounds: box => obb2.intersectsBox( box ),

					intersectsTriangle: tri => {

						tri.a.applyMatrix4( geometryToBvh );
						tri.b.applyMatrix4( geometryToBvh );
						tri.c.applyMatrix4( geometryToBvh );
						tri.needsUpdate = true;

						for ( let i = offset * 3, l = ( count + offset ) * 3; i < l; i += 3 ) {

							// this triangle needs to be transformed into the current BVH coordinate frame
							setTriangle( triangle2, i, thisIndex, thisPos );
							triangle2.needsUpdate = true;
							if ( tri.intersectsTriangle( triangle2 ) ) {

								return true;

							}

						}

						return false;

					}

				} );

				return res;

			} else {

				for ( let i = offset * 3, l = ( count + offset * 3 ); i < l; i += 3 ) {

					// this triangle needs to be transformed into the current BVH coordinate frame
					setTriangle( triangle, i, thisIndex, thisPos );
					triangle.a.applyMatrix4( invertedMat );
					triangle.b.applyMatrix4( invertedMat );
					triangle.c.applyMatrix4( invertedMat );
					triangle.needsUpdate = true;

					for ( let i2 = 0, l2 = index.count; i2 < l2; i2 += 3 ) {

						setTriangle( triangle2, i2, index, pos );
						triangle2.needsUpdate = true;

						if ( triangle.intersectsTriangle( triangle2 ) ) {

							return true;

						}

					}

				}

			}

		} else {

			const left = nodeIndex32 + 8;
			const right = uint32Array[ nodeIndex32 + 6 ];

			arrayToBox( BOUNDING_DATA_INDEX( left ), float32Array, boundingBox );
			const leftIntersection =
				cachedObb.intersectsBox( boundingBox ) &&
				intersectsGeometry( left, geometry, otherGeometry, geometryToBvh, cachedObb );

			if ( leftIntersection ) return true;

			arrayToBox( BOUNDING_DATA_INDEX( right ), float32Array, boundingBox );
			const rightIntersection =
				cachedObb.intersectsBox( boundingBox ) &&
				intersectsGeometry( right, geometry, otherGeometry, geometryToBvh, cachedObb );

			if ( rightIntersection ) return true;

			return false;

		}

	};

} )();

function intersectRay( nodeIndex32, array, ray, target ) {

	arrayToBox( nodeIndex32, array, boundingBox );
	return ray.intersectBox( boundingBox, target );

}

const bufferStack = [];
let _prevBuffer;
let _float32Array;
let _uint16Array;
let _uint32Array;
function setBuffer( buffer ) {

	if ( _prevBuffer ) {

		bufferStack.push( _prevBuffer );

	}

	_prevBuffer = buffer;
	_float32Array = new Float32Array( buffer );
	_uint16Array = new Uint16Array( buffer );
	_uint32Array = new Uint32Array( buffer );

}

function clearBuffer() {

	_prevBuffer = null;
	_float32Array = null;
	_uint16Array = null;
	_uint32Array = null;

	if ( bufferStack.length ) {

		setBuffer( bufferStack.pop() );

	}

}

const SKIP_GENERATION = Symbol( 'skip tree generation' );

const aabb = /* @__PURE__ */ new Box3();
const aabb2 = /* @__PURE__ */ new Box3();
const tempMatrix = /* @__PURE__ */ new Matrix4();
const obb = /* @__PURE__ */ new OrientedBox();
const obb2 = /* @__PURE__ */ new OrientedBox();
const temp = /* @__PURE__ */ new Vector3();
const temp1 = /* @__PURE__ */ new Vector3();
const temp2 = /* @__PURE__ */ new Vector3();
const temp3 = /* @__PURE__ */ new Vector3();
const temp4 = /* @__PURE__ */ new Vector3();
const tempBox = /* @__PURE__ */ new Box3();
const trianglePool = /* @__PURE__ */ new PrimitivePool( () => new ExtendedTriangle() );

class MeshBVH {

	static serialize( bvh, options = {} ) {

		if ( options.isBufferGeometry ) {

			console.warn( 'MeshBVH.serialize: The arguments for the function have changed. See documentation for new signature.' );

			return MeshBVH.serialize(
				arguments[ 0 ],
				{
					cloneBuffers: arguments[ 2 ] === undefined ? true : arguments[ 2 ],
				}
			);

		}

		options = {
			cloneBuffers: true,
			...options,
		};

		const geometry = bvh.geometry;
		const rootData = bvh._roots;
		const indexAttribute = geometry.getIndex();
		let result;
		if ( options.cloneBuffers ) {

			result = {
				roots: rootData.map( root => root.slice() ),
				index: indexAttribute.array.slice(),
			};

		} else {

			result = {
				roots: rootData,
				index: indexAttribute.array,
			};

		}

		return result;

	}

	static deserialize( data, geometry, options = {} ) {

		if ( typeof options === 'boolean' ) {

			console.warn( 'MeshBVH.deserialize: The arguments for the function have changed. See documentation for new signature.' );

			return MeshBVH.deserialize(
				arguments[ 0 ],
				arguments[ 1 ],
				{
					setIndex: arguments[ 2 ] === undefined ? true : arguments[ 2 ],
				}
			);

		}

		options = {
			setIndex: true,
			...options,
		};

		const { index, roots } = data;
		const bvh = new MeshBVH( geometry, { ...options, [ SKIP_GENERATION ]: true } );
		bvh._roots = roots;

		if ( options.setIndex ) {

			const indexAttribute = geometry.getIndex();
			if ( indexAttribute === null ) {

				const newIndex = new BufferAttribute( data.index, 1, false );
				geometry.setIndex( newIndex );

			} else if ( indexAttribute.array !== index ) {

				indexAttribute.array.set( index );
				indexAttribute.needsUpdate = true;

			}

		}

		return bvh;

	}

	constructor( geometry, options = {} ) {

		if ( ! geometry.isBufferGeometry ) {

			throw new Error( 'MeshBVH: Only BufferGeometries are supported.' );

		} else if ( geometry.index && geometry.index.isInterleavedBufferAttribute ) {

			throw new Error( 'MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.' );

		}

		// default options
		options = Object.assign( {

			strategy: CENTER,
			maxDepth: 40,
			maxLeafTris: 10,
			verbose: true,
			useSharedArrayBuffer: false,
			setBoundingBox: true,
			onProgress: null,

			// undocumented options

			// Whether to skip generating the tree. Used for deserialization.
			[ SKIP_GENERATION ]: false,

		}, options );

		if ( options.useSharedArrayBuffer && typeof SharedArrayBuffer === 'undefined' ) {

			throw new Error( 'MeshBVH: SharedArrayBuffer is not available.' );

		}

		this._roots = null;
		if ( ! options[ SKIP_GENERATION ] ) {

			this._roots = buildPackedTree( geometry, options );

			if ( ! geometry.boundingBox && options.setBoundingBox ) {

				geometry.boundingBox = this.getBoundingBox( new Box3() );

			}

		}

		// retain references to the geometry so we can use them it without having to
		// take a geometry reference in every function.
		this.geometry = geometry;

	}

	refit( nodeIndices = null ) {

		if ( nodeIndices && Array.isArray( nodeIndices ) ) {

			nodeIndices = new Set( nodeIndices );

		}

		const geometry = this.geometry;
		const indexArr = geometry.index.array;
		const posAttr = geometry.attributes.position;
		const posArr = posAttr.array;

		// support for an interleaved position buffer
		const bufferOffset = posAttr.offset || 0;
		let stride = 3;
		if ( posAttr.isInterleavedBufferAttribute ) {

			stride = posAttr.data.stride;

		}

		let buffer, uint32Array, uint16Array, float32Array;
		let byteOffset = 0;
		const roots = this._roots;
		for ( let i = 0, l = roots.length; i < l; i ++ ) {

			buffer = roots[ i ];
			uint32Array = new Uint32Array( buffer );
			uint16Array = new Uint16Array( buffer );
			float32Array = new Float32Array( buffer );

			_traverse( 0, byteOffset );
			byteOffset += buffer.byteLength;

		}

		function _traverse( node32Index, byteOffset, force = false ) {

			const node16Index = node32Index * 2;
			const isLeaf = uint16Array[ node16Index + 15 ] === IS_LEAFNODE_FLAG;
			if ( isLeaf ) {

				const offset = uint32Array[ node32Index + 6 ];
				const count = uint16Array[ node16Index + 14 ];

				let minx = Infinity;
				let miny = Infinity;
				let minz = Infinity;
				let maxx = - Infinity;
				let maxy = - Infinity;
				let maxz = - Infinity;
				for ( let i = 3 * offset, l = 3 * ( offset + count ); i < l; i ++ ) {

					const index = indexArr[ i ] * stride + bufferOffset;
					const x = posArr[ index + 0 ];
					const y = posArr[ index + 1 ];
					const z = posArr[ index + 2 ];

					if ( x < minx ) minx = x;
					if ( x > maxx ) maxx = x;

					if ( y < miny ) miny = y;
					if ( y > maxy ) maxy = y;

					if ( z < minz ) minz = z;
					if ( z > maxz ) maxz = z;

				}

				if (
					float32Array[ node32Index + 0 ] !== minx ||
					float32Array[ node32Index + 1 ] !== miny ||
					float32Array[ node32Index + 2 ] !== minz ||

					float32Array[ node32Index + 3 ] !== maxx ||
					float32Array[ node32Index + 4 ] !== maxy ||
					float32Array[ node32Index + 5 ] !== maxz
				) {

					float32Array[ node32Index + 0 ] = minx;
					float32Array[ node32Index + 1 ] = miny;
					float32Array[ node32Index + 2 ] = minz;

					float32Array[ node32Index + 3 ] = maxx;
					float32Array[ node32Index + 4 ] = maxy;
					float32Array[ node32Index + 5 ] = maxz;

					return true;

				} else {

					return false;

				}

			} else {

				const left = node32Index + 8;
				const right = uint32Array[ node32Index + 6 ];

				// the identifying node indices provided by the shapecast function include offsets of all
				// root buffers to guarantee they're unique between roots so offset left and right indices here.
				const offsetLeft = left + byteOffset;
				const offsetRight = right + byteOffset;
				let forceChildren = force;
				let includesLeft = false;
				let includesRight = false;

				if ( nodeIndices ) {

					// if we see that neither the left or right child are included in the set that need to be updated
					// then we assume that all children need to be updated.
					if ( ! forceChildren ) {

						includesLeft = nodeIndices.has( offsetLeft );
						includesRight = nodeIndices.has( offsetRight );
						forceChildren = ! includesLeft && ! includesRight;

					}

				} else {

					includesLeft = true;
					includesRight = true;

				}

				const traverseLeft = forceChildren || includesLeft;
				const traverseRight = forceChildren || includesRight;

				let leftChange = false;
				if ( traverseLeft ) {

					leftChange = _traverse( left, byteOffset, forceChildren );

				}

				let rightChange = false;
				if ( traverseRight ) {

					rightChange = _traverse( right, byteOffset, forceChildren );

				}

				const didChange = leftChange || rightChange;
				if ( didChange ) {

					for ( let i = 0; i < 3; i ++ ) {

						const lefti = left + i;
						const righti = right + i;
						const minLeftValue = float32Array[ lefti ];
						const maxLeftValue = float32Array[ lefti + 3 ];
						const minRightValue = float32Array[ righti ];
						const maxRightValue = float32Array[ righti + 3 ];

						float32Array[ node32Index + i ] = minLeftValue < minRightValue ? minLeftValue : minRightValue;
						float32Array[ node32Index + i + 3 ] = maxLeftValue > maxRightValue ? maxLeftValue : maxRightValue;

					}

				}

				return didChange;

			}

		}

	}

	traverse( callback, rootIndex = 0 ) {

		const buffer = this._roots[ rootIndex ];
		const uint32Array = new Uint32Array( buffer );
		const uint16Array = new Uint16Array( buffer );
		_traverse( 0 );

		function _traverse( node32Index, depth = 0 ) {

			const node16Index = node32Index * 2;
			const isLeaf = uint16Array[ node16Index + 15 ] === IS_LEAFNODE_FLAG;
			if ( isLeaf ) {

				const offset = uint32Array[ node32Index + 6 ];
				const count = uint16Array[ node16Index + 14 ];
				callback( depth, isLeaf, new Float32Array( buffer, node32Index * 4, 6 ), offset, count );

			} else {

				// TODO: use node functions here
				const left = node32Index + BYTES_PER_NODE / 4;
				const right = uint32Array[ node32Index + 6 ];
				const splitAxis = uint32Array[ node32Index + 7 ];
				const stopTraversal = callback( depth, isLeaf, new Float32Array( buffer, node32Index * 4, 6 ), splitAxis );

				if ( ! stopTraversal ) {

					_traverse( left, depth + 1 );
					_traverse( right, depth + 1 );

				}

			}

		}

	}

	/* Core Cast Functions */
	raycast( ray, materialOrSide = FrontSide ) {

		const roots = this._roots;
		const geometry = this.geometry;
		const intersects = [];
		const isMaterial = materialOrSide.isMaterial;
		const isArrayMaterial = Array.isArray( materialOrSide );

		const groups = geometry.groups;
		const side = isMaterial ? materialOrSide.side : materialOrSide;
		for ( let i = 0, l = roots.length; i < l; i ++ ) {

			const materialSide = isArrayMaterial ? materialOrSide[ groups[ i ].materialIndex ].side : side;
			const startCount = intersects.length;

			setBuffer( roots[ i ] );
			raycast( 0, geometry, materialSide, ray, intersects );
			clearBuffer();

			if ( isArrayMaterial ) {

				const materialIndex = groups[ i ].materialIndex;
				for ( let j = startCount, jl = intersects.length; j < jl; j ++ ) {

					intersects[ j ].face.materialIndex = materialIndex;

				}

			}

		}

		return intersects;

	}

	raycastFirst( ray, materialOrSide = FrontSide ) {

		const roots = this._roots;
		const geometry = this.geometry;
		const isMaterial = materialOrSide.isMaterial;
		const isArrayMaterial = Array.isArray( materialOrSide );

		let closestResult = null;

		const groups = geometry.groups;
		const side = isMaterial ? materialOrSide.side : materialOrSide;
		for ( let i = 0, l = roots.length; i < l; i ++ ) {

			const materialSide = isArrayMaterial ? materialOrSide[ groups[ i ].materialIndex ].side : side;

			setBuffer( roots[ i ] );
			const result = raycastFirst( 0, geometry, materialSide, ray );
			clearBuffer();

			if ( result != null && ( closestResult == null || result.distance < closestResult.distance ) ) {

				closestResult = result;
				if ( isArrayMaterial ) {

					result.face.materialIndex = groups[ i ].materialIndex;

				}

			}

		}

		return closestResult;

	}

	intersectsGeometry( otherGeometry, geomToMesh ) {

		const geometry = this.geometry;
		let result = false;
		for ( const root of this._roots ) {

			setBuffer( root );
			result = intersectsGeometry( 0, geometry, otherGeometry, geomToMesh );
			clearBuffer();

			if ( result ) {

				break;

			}

		}

		return result;

	}

	shapecast( callbacks, _intersectsTriangleFunc, _orderNodesFunc ) {

		const geometry = this.geometry;
		if ( callbacks instanceof Function ) {

			if ( _intersectsTriangleFunc ) {

				// Support the previous function signature that provided three sequential index buffer
				// indices here.
				const originalTriangleFunc = _intersectsTriangleFunc;
				_intersectsTriangleFunc = ( tri, index, contained, depth ) => {

					const i3 = index * 3;
					return originalTriangleFunc( tri, i3, i3 + 1, i3 + 2, contained, depth );

				};


			}

			callbacks = {

				boundsTraverseOrder: _orderNodesFunc,
				intersectsBounds: callbacks,
				intersectsTriangle: _intersectsTriangleFunc,
				intersectsRange: null,

			};

			console.warn( 'MeshBVH: Shapecast function signature has changed and now takes an object of callbacks as a second argument. See docs for new signature.' );

		}

		const triangle = trianglePool.getPrimitive();
		let {
			boundsTraverseOrder,
			intersectsBounds,
			intersectsRange,
			intersectsTriangle,
		} = callbacks;

		if ( intersectsRange && intersectsTriangle ) {

			const originalIntersectsRange = intersectsRange;
			intersectsRange = ( offset, count, contained, depth, nodeIndex ) => {

				if ( ! originalIntersectsRange( offset, count, contained, depth, nodeIndex ) ) {

					return iterateOverTriangles( offset, count, geometry, intersectsTriangle, contained, depth, triangle );

				}

				return true;

			};

		} else if ( ! intersectsRange ) {

			if ( intersectsTriangle ) {

				intersectsRange = ( offset, count, contained, depth ) => {

					return iterateOverTriangles( offset, count, geometry, intersectsTriangle, contained, depth, triangle );

				};

			} else {

				intersectsRange = ( offset, count, contained ) => {

					return contained;

				};

			}

		}

		let result = false;
		let byteOffset = 0;
		for ( const root of this._roots ) {

			setBuffer( root );
			result = shapecast( 0, geometry, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset );
			clearBuffer();

			if ( result ) {

				break;

			}

			byteOffset += root.byteLength;

		}

		trianglePool.releasePrimitive( triangle );

		return result;

	}

	bvhcast( otherBvh, matrixToLocal, callbacks ) {

		// BVHCast function for intersecting two BVHs against each other. Ultimately just uses two recursive shapecast calls rather
		// than an approach that walks down the tree (see bvhcast.js file for more info).

		let {
			intersectsRanges,
			intersectsTriangles,
		} = callbacks;

		const indexAttr = this.geometry.index;
		const positionAttr = this.geometry.attributes.position;

		const otherIndexAttr = otherBvh.geometry.index;
		const otherPositionAttr = otherBvh.geometry.attributes.position;

		tempMatrix.copy( matrixToLocal ).invert();

		const triangle = trianglePool.getPrimitive();
		const triangle2 = trianglePool.getPrimitive();

		if ( intersectsTriangles ) {

			function iterateOverDoubleTriangles( offset1, count1, offset2, count2, depth1, index1, depth2, index2 ) {

				for ( let i2 = offset2, l2 = offset2 + count2; i2 < l2; i2 ++ ) {

					setTriangle( triangle2, i2 * 3, otherIndexAttr, otherPositionAttr );
					triangle2.a.applyMatrix4( matrixToLocal );
					triangle2.b.applyMatrix4( matrixToLocal );
					triangle2.c.applyMatrix4( matrixToLocal );
					triangle2.needsUpdate = true;

					for ( let i1 = offset1, l1 = offset1 + count1; i1 < l1; i1 ++ ) {

						setTriangle( triangle, i1 * 3, indexAttr, positionAttr );
						triangle.needsUpdate = true;

						if ( intersectsTriangles( triangle, triangle2, i1, i2, depth1, index1, depth2, index2 ) ) {

							return true;

						}

					}

				}

				return false;

			}

			if ( intersectsRanges ) {

				const originalIntersectsRanges = intersectsRanges;
				intersectsRanges = function ( offset1, count1, offset2, count2, depth1, index1, depth2, index2 ) {

					if ( ! originalIntersectsRanges( offset1, count1, offset2, count2, depth1, index1, depth2, index2 ) ) {

						return iterateOverDoubleTriangles( offset1, count1, offset2, count2, depth1, index1, depth2, index2 );

					}

					return true;

				};

			} else {

				intersectsRanges = iterateOverDoubleTriangles;

			}

		}

		otherBvh.getBoundingBox( aabb2 );
		aabb2.applyMatrix4( matrixToLocal );
		const result = this.shapecast( {

			intersectsBounds: box => aabb2.intersectsBox( box ),

			intersectsRange: ( offset1, count1, contained, depth1, nodeIndex1, box ) => {

				aabb.copy( box );
				aabb.applyMatrix4( tempMatrix );
				return otherBvh.shapecast( {

					intersectsBounds: box => aabb.intersectsBox( box ),

					intersectsRange: ( offset2, count2, contained, depth2, nodeIndex2 ) => {

						return intersectsRanges( offset1, count1, offset2, count2, depth1, nodeIndex1, depth2, nodeIndex2 );

					},

				} );

			}

		} );

		trianglePool.releasePrimitive( triangle );
		trianglePool.releasePrimitive( triangle2 );
		return result;

	}

	/* Derived Cast Functions */
	intersectsBox( box, boxToMesh ) {

		obb.set( box.min, box.max, boxToMesh );
		obb.needsUpdate = true;

		return this.shapecast(
			{
				intersectsBounds: box => obb.intersectsBox( box ),
				intersectsTriangle: tri => obb.intersectsTriangle( tri )
			}
		);

	}

	intersectsSphere( sphere ) {

		return this.shapecast(
			{
				intersectsBounds: box => sphere.intersectsBox( box ),
				intersectsTriangle: tri => tri.intersectsSphere( sphere )
			}
		);

	}

	closestPointToGeometry( otherGeometry, geometryToBvh, target1 = { }, target2 = { }, minThreshold = 0, maxThreshold = Infinity ) {

		if ( ! otherGeometry.boundingBox ) {

			otherGeometry.computeBoundingBox();

		}

		obb.set( otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh );
		obb.needsUpdate = true;

		const geometry = this.geometry;
		const pos = geometry.attributes.position;
		const index = geometry.index;
		const otherPos = otherGeometry.attributes.position;
		const otherIndex = otherGeometry.index;
		const triangle = trianglePool.getPrimitive();
		const triangle2 = trianglePool.getPrimitive();

		let tempTarget1 = temp1;
		let tempTargetDest1 = temp2;
		let tempTarget2 = null;
		let tempTargetDest2 = null;

		if ( target2 ) {

			tempTarget2 = temp3;
			tempTargetDest2 = temp4;

		}

		let closestDistance = Infinity;
		let closestDistanceTriIndex = null;
		let closestDistanceOtherTriIndex = null;
		tempMatrix.copy( geometryToBvh ).invert();
		obb2.matrix.copy( tempMatrix );
		this.shapecast(
			{

				boundsTraverseOrder: box => {

					return obb.distanceToBox( box );

				},

				intersectsBounds: ( box, isLeaf, score ) => {

					if ( score < closestDistance && score < maxThreshold ) {

						// if we know the triangles of this bounds will be intersected next then
						// save the bounds to use during triangle checks.
						if ( isLeaf ) {

							obb2.min.copy( box.min );
							obb2.max.copy( box.max );
							obb2.needsUpdate = true;

						}

						return true;

					}

					return false;

				},

				intersectsRange: ( offset, count ) => {

					if ( otherGeometry.boundsTree ) {

						// if the other geometry has a bvh then use the accelerated path where we use shapecast to find
						// the closest bounds in the other geometry to check.
						return otherGeometry.boundsTree.shapecast( {
							boundsTraverseOrder: box => {

								return obb2.distanceToBox( box );

							},

							intersectsBounds: ( box, isLeaf, score ) => {

								return score < closestDistance && score < maxThreshold;

							},

							intersectsRange: ( otherOffset, otherCount ) => {

								for ( let i2 = otherOffset * 3, l2 = ( otherOffset + otherCount ) * 3; i2 < l2; i2 += 3 ) {

									setTriangle( triangle2, i2, otherIndex, otherPos );
									triangle2.a.applyMatrix4( geometryToBvh );
									triangle2.b.applyMatrix4( geometryToBvh );
									triangle2.c.applyMatrix4( geometryToBvh );
									triangle2.needsUpdate = true;

									for ( let i = offset * 3, l = ( offset + count ) * 3; i < l; i += 3 ) {

										setTriangle( triangle, i, index, pos );
										triangle.needsUpdate = true;

										const dist = triangle.distanceToTriangle( triangle2, tempTarget1, tempTarget2 );
										if ( dist < closestDistance ) {

											tempTargetDest1.copy( tempTarget1 );

											if ( tempTargetDest2 ) {

												tempTargetDest2.copy( tempTarget2 );

											}

											closestDistance = dist;
											closestDistanceTriIndex = i / 3;
											closestDistanceOtherTriIndex = i2 / 3;

										}

										// stop traversal if we find a point that's under the given threshold
										if ( dist < minThreshold ) {

											return true;

										}

									}

								}

							},
						} );

					} else {

						// If no bounds tree then we'll just check every triangle.
						const triCount = otherIndex ? otherIndex.count : otherPos.count;
						for ( let i2 = 0, l2 = triCount; i2 < l2; i2 += 3 ) {

							setTriangle( triangle2, i2, otherIndex, otherPos );
							triangle2.a.applyMatrix4( geometryToBvh );
							triangle2.b.applyMatrix4( geometryToBvh );
							triangle2.c.applyMatrix4( geometryToBvh );
							triangle2.needsUpdate = true;

							for ( let i = offset * 3, l = ( offset + count ) * 3; i < l; i += 3 ) {

								setTriangle( triangle, i, index, pos );
								triangle.needsUpdate = true;

								const dist = triangle.distanceToTriangle( triangle2, tempTarget1, tempTarget2 );
								if ( dist < closestDistance ) {

									tempTargetDest1.copy( tempTarget1 );

									if ( tempTargetDest2 ) {

										tempTargetDest2.copy( tempTarget2 );

									}

									closestDistance = dist;
									closestDistanceTriIndex = i / 3;
									closestDistanceOtherTriIndex = i2 / 3;

								}

								// stop traversal if we find a point that's under the given threshold
								if ( dist < minThreshold ) {

									return true;

								}

							}

						}

					}

				},

			}

		);

		trianglePool.releasePrimitive( triangle );
		trianglePool.releasePrimitive( triangle2 );

		if ( closestDistance === Infinity ) return null;

		if ( ! target1.point ) target1.point = tempTargetDest1.clone();
		else target1.point.copy( tempTargetDest1 );
		target1.distance = closestDistance,
		target1.faceIndex = closestDistanceTriIndex;

		if ( target2 ) {

			if ( ! target2.point ) target2.point = tempTargetDest2.clone();
			else target2.point.copy( tempTargetDest2 );
			target2.point.applyMatrix4( tempMatrix );
			tempTargetDest1.applyMatrix4( tempMatrix );
			target2.distance = tempTargetDest1.sub( target2.point ).length();
			target2.faceIndex = closestDistanceOtherTriIndex;

		}

		return target1;

	}

	closestPointToPoint( point, target = { }, minThreshold = 0, maxThreshold = Infinity ) {

		// early out if under minThreshold
		// skip checking if over maxThreshold
		// set minThreshold = maxThreshold to quickly check if a point is within a threshold
		// returns Infinity if no value found
		const minThresholdSq = minThreshold * minThreshold;
		const maxThresholdSq = maxThreshold * maxThreshold;
		let closestDistanceSq = Infinity;
		let closestDistanceTriIndex = null;
		this.shapecast(

			{

				boundsTraverseOrder: box => {

					temp.copy( point ).clamp( box.min, box.max );
					return temp.distanceToSquared( point );

				},

				intersectsBounds: ( box, isLeaf, score ) => {

					return score < closestDistanceSq && score < maxThresholdSq;

				},

				intersectsTriangle: ( tri, triIndex ) => {

					tri.closestPointToPoint( point, temp );
					const distSq = point.distanceToSquared( temp );
					if ( distSq < closestDistanceSq ) {

						temp1.copy( temp );
						closestDistanceSq = distSq;
						closestDistanceTriIndex = triIndex;

					}

					if ( distSq < minThresholdSq ) {

						return true;

					} else {

						return false;

					}

				},

			}

		);

		if ( closestDistanceSq === Infinity ) return null;

		const closestDistance = Math.sqrt( closestDistanceSq );

		if ( ! target.point ) target.point = temp1.clone();
		else target.point.copy( temp1 );
		target.distance = closestDistance,
		target.faceIndex = closestDistanceTriIndex;

		return target;

	}

	getBoundingBox( target ) {

		target.makeEmpty();

		const roots = this._roots;
		roots.forEach( buffer => {

			arrayToBox( 0, new Float32Array( buffer ), tempBox );
			target.union( tempBox );

		} );

		return target;

	}

}

// Deprecation
const originalRaycast = MeshBVH.prototype.raycast;
MeshBVH.prototype.raycast = function ( ...args ) {

	if ( args[ 0 ].isMesh ) {

		console.warn( 'MeshBVH: The function signature and results frame for "raycast" has changed. See docs for new signature.' );
		const [
			mesh, raycaster, ray, intersects,
		] = args;

		const results = originalRaycast.call( this, ray, mesh.material );
		results.forEach( hit => {

			hit = convertRaycastIntersect( hit, mesh, raycaster );
			if ( hit ) {

				intersects.push( hit );

			}

		} );

		return intersects;

	} else {

		return originalRaycast.apply( this, args );

	}

};

const originalRaycastFirst = MeshBVH.prototype.raycastFirst;
MeshBVH.prototype.raycastFirst = function ( ...args ) {

	if ( args[ 0 ].isMesh ) {

		console.warn( 'MeshBVH: The function signature and results frame for "raycastFirst" has changed. See docs for new signature.' );
		const [
			mesh, raycaster, ray,
		] = args;

		return convertRaycastIntersect( originalRaycastFirst.call( this, ray, mesh.material ), mesh, raycaster );

	} else {

		return originalRaycastFirst.apply( this, args );

	}

};

const originalClosestPointToPoint = MeshBVH.prototype.closestPointToPoint;
MeshBVH.prototype.closestPointToPoint = function ( ...args ) {


	if ( args[ 0 ].isMesh ) {

		console.warn( 'MeshBVH: The function signature and results frame for "closestPointToPoint" has changed. See docs for new signature.' );

		args.unshift();

		const target = args[ 1 ];
		const result = {};
		args[ 1 ] = result;

		originalClosestPointToPoint.apply( this, args );

		if ( target ) {

			target.copy( result.point );

		}

		return result.distance;

	} else {

		return originalClosestPointToPoint.apply( this, args );

	}

};

const originalClosestPointToGeometry = MeshBVH.prototype.closestPointToGeometry;
MeshBVH.prototype.closestPointToGeometry = function ( ...args ) {

	const target1 = args[ 2 ];
	const target2 = args[ 3 ];
	if ( target1 && target1.isVector3 || target2 && target2.isVector3 ) {

		console.warn( 'MeshBVH: The function signature and results frame for "closestPointToGeometry" has changed. See docs for new signature.' );

		const result1 = {};
		const result2 = {};
		const geometryToBvh = args[ 1 ];
		args[ 2 ] = result1;
		args[ 3 ] = result2;

		originalClosestPointToGeometry.apply( this, args );

		if ( target1 ) {

			target1.copy( result1.point );

		}

		if ( target2 ) {

			target2.copy( result2.point ).applyMatrix4( geometryToBvh );

		}

		return result1.distance;

	} else {

		return originalClosestPointToGeometry.apply( this, args );

	}

};

const originalRefit = MeshBVH.prototype.refit;
MeshBVH.prototype.refit = function ( ...args ) {

	const nodeIndices = args[ 0 ];
	const terminationIndices = args[ 1 ];
	if ( terminationIndices && ( terminationIndices instanceof Set || Array.isArray( terminationIndices ) ) ) {

		console.warn( 'MeshBVH: The function signature for "refit" has changed. See docs for new signature.' );

		const newNodeIndices = new Set();
		terminationIndices.forEach( v => newNodeIndices.add( v ) );
		if ( nodeIndices ) {

			nodeIndices.forEach( v => newNodeIndices.add( v ) );

		}

		originalRefit.call( this, newNodeIndices );

	} else {

		originalRefit.apply( this, args );

	}

};

[
	'intersectsGeometry',
	'shapecast',
	'intersectsBox',
	'intersectsSphere',
].forEach( name => {

	const originalFunc = MeshBVH.prototype[ name ];
	MeshBVH.prototype[ name ] = function ( ...args ) {

		if ( args[ 0 ] === null || args[ 0 ].isMesh ) {

			args.shift();
			console.warn( `MeshBVH: The function signature for "${ name }" has changed and no longer takes Mesh. See docs for new signature.` );

		}

		return originalFunc.apply( this, args );

	};

} );

const ray = /* @__PURE__ */ new Ray();
const tmpInverseMatrix = /* @__PURE__ */ new Matrix4();
const origMeshRaycastFunc = Mesh.prototype.raycast;

function acceleratedRaycast( raycaster, intersects ) {

	if ( this.geometry.boundsTree ) {

		if ( this.material === undefined ) return;

		tmpInverseMatrix.copy( this.matrixWorld ).invert();
		ray.copy( raycaster.ray ).applyMatrix4( tmpInverseMatrix );

		const bvh = this.geometry.boundsTree;
		if ( raycaster.firstHitOnly === true ) {

			const hit = convertRaycastIntersect( bvh.raycastFirst( ray, this.material ), this, raycaster );
			if ( hit ) {

				intersects.push( hit );

			}

		} else {

			const hits = bvh.raycast( ray, this.material );
			for ( let i = 0, l = hits.length; i < l; i ++ ) {

				const hit = convertRaycastIntersect( hits[ i ], this, raycaster );
				if ( hit ) {

					intersects.push( hit );

				}

			}

		}

	} else {

		origMeshRaycastFunc.call( this, raycaster, intersects );

	}

}

function computeBoundsTree( options ) {

	this.boundsTree = new MeshBVH( this, options );
	return this.boundsTree;

}

function disposeBoundsTree() {

	this.boundsTree = null;

}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, getWindow(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = offset + overflow[mainSide];
    var max$1 = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Toolbar_position, _Toolbar_enabled, _Toolbar_visible;
class Toolbar extends Component {
    constructor(components, options) {
        super();
        this.domElement = document.createElement("div");
        this.children = [];
        _Toolbar_position.set(this, void 0);
        _Toolbar_enabled.set(this, true);
        _Toolbar_visible.set(this, true);
        this.components = components;
        const _options = {
            name: "Toolbar",
            position: "bottom",
            ...options
        };
        this.name = _options.name;
        this.domElement.id = _options.name;
        this.domElement.classList.add("tooeen-toolbar");
        this.position = _options.position;
        this.visible = true;
    }
    set visible(visible) {
        this.domElement.style.display = visible && this.hasElements ? "flex" : "none";
        __classPrivateFieldSet$1(this, _Toolbar_visible, visible && this.hasElements, "f");
    }
    get visible() { return __classPrivateFieldGet$1(this, _Toolbar_visible, "f"); }
    set enabled(enabled) {
        this.closeMenus();
        this.children.forEach(button => {
            button.enabled = enabled;
            button.menu.enabled = enabled;
        });
        __classPrivateFieldSet$1(this, _Toolbar_enabled, enabled, "f");
    }
    get enabled() { return __classPrivateFieldGet$1(this, _Toolbar_enabled, "f"); }
    set position(position) {
        __classPrivateFieldSet$1(this, _Toolbar_position, position, "f");
        this.updateElements();
    }
    get position() { return __classPrivateFieldGet$1(this, _Toolbar_position, "f"); }
    get hasElements() {
        return this.children.length > 0;
    }
    get() { return this.domElement; }
    addButton(...button) {
        button.forEach(btn => {
            btn.parent = this;
            this.children.push(btn);
            this.domElement.append(btn.domElement);
        });
        //@ts-ignore
        this.components.ui.updateToolbars();
    }
    updateElements() {
        this.children.forEach(button => button.parent = this);
    }
    closeMenus() {
        this.children.forEach(button => button.closeMenus());
    }
    setDirection(direction = "horizontal") {
        this.domElement.classList.remove("htoolbar", "vtoolbar");
        this.domElement.classList.add(`${direction[0]}toolbar`);
    }
}
_Toolbar_position = new WeakMap(), _Toolbar_enabled = new WeakMap(), _Toolbar_visible = new WeakMap();

// @ts-ignore
class UIManager extends Component {
    constructor(components) {
        super();
        this.name = "UIManager";
        this.enabled = true;
        this.toolbars = [];
        this.containers = {
            top: document.createElement("div"),
            right: document.createElement("div"),
            bottom: document.createElement("div"),
            left: document.createElement("div"),
        };
        this.contextMenu = new Toolbar(components);
        this.contextMenu.domElement.classList.add("vtoolbar");
        this.contextMenu.setDirection("vertical");
        this.contextMenu.position = "left";
        this.components = components;
        for (const id in this.containers) {
            const container = this.containers[id];
            container.classList.add("tooeen-toolbar-container");
            container.id = `${id}-toolbar-container`;
            this.setContainerAlignment(id, "center");
        }
        this.containers.top.classList.add("hcontainer");
        this.containers.right.classList.add("vcontainer");
        this.containers.bottom.classList.add("hcontainer");
        this.containers.left.classList.add("vcontainer");
    }
    get() {
        return this.toolbars;
    }
    setup() {
        this.viewerContainer = this.components.renderer.get().domElement
            .parentElement;
        // #region Context menu
        const contextParent = document.createElement("div");
        contextParent.style.position = "absolute";
        contextParent.append(this.contextMenu.domElement);
        const popperInstance = createPopper(contextParent, this.contextMenu.domElement, {
            placement: "bottom-start",
            modifiers: [
                {
                    name: "preventOverflow",
                    options: {
                        boundary: this.viewerContainer,
                    },
                },
            ],
        });
        let mouseMoved = false;
        let mouseDown = false;
        this.viewerContainer.addEventListener("contextmenu", (e) => {
            if (mouseMoved) {
                mouseMoved = false;
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            this.closeMenus();
            contextParent.style.left = `${e.offsetX}px`;
            contextParent.style.top = `${e.offsetY}px`;
            this.contextMenu.visible = true;
            popperInstance.update();
        });
        this.viewerContainer.addEventListener("mousedown", (e) => {
            mouseDown = true;
            const canvas = this.components.renderer.get().domElement;
            if (e.target === canvas) {
                this.closeMenus();
                this.contextMenu.visible = false;
            }
        });
        this.viewerContainer.addEventListener("mousemove", () => {
            if (mouseDown) {
                mouseMoved = true;
            }
        });
        this.viewerContainer.addEventListener("mouseup", () => {
            mouseDown = false;
        });
        // #endregion
        this.viewerContainer.append(this.containers.top, this.containers.right, this.containers.bottom, this.containers.left, contextParent);
    }
    closeMenus() {
        this.toolbars.forEach((toolbar) => toolbar.closeMenus());
        this.contextMenu.closeMenus();
    }
    setContainerAlignment(container, alingment) {
        this.containers[container].style.justifyContent = alingment;
    }
    addToolbar(...toolbar) {
        toolbar.forEach((tlbr) => {
            const container = this.containers[tlbr.position];
            if (!container) {
                return;
            }
            container.append(tlbr.domElement);
            this.toolbars.push(tlbr);
        });
        this.updateToolbars();
    }
    updateToolbars() {
        this.toolbars.forEach((toolbar) => {
            toolbar.visible = true;
            toolbar.updateElements();
            if (toolbar.position === "bottom" || toolbar.position === "top") {
                toolbar.setDirection("horizontal");
            }
            else {
                toolbar.setDirection("vertical");
            }
        });
    }
}

/**
 * The entry point of Open BIM Components.
 * It contains the basic items to create a BIM 3D scene based on Three.js, as
 * well as all the tools provided by this library. It also manages the update
 * loop of everything. Each instance has to be initialized with {@link init}.
 *
 */
class Components {
    constructor() {
        /**
         * All the loaded [meshes](https://threejs.org/docs/#api/en/objects/Mesh).
         * This includes IFC models, fragments, 3D scans, etc.
         */
        this.meshes = [];
        this._enabled = true;
        this.update = () => {
            if (!this._enabled)
                return;
            const delta = this._clock.getDelta();
            Components.update(this.scene, delta);
            Components.update(this.renderer, delta);
            Components.update(this.camera, delta);
            this.tools.update(delta);
            const renderer = this.renderer.get();
            // Works the same as requestAnimationFrame, but let us use WebXR.
            renderer.setAnimationLoop(this.update);
        };
        this._clock = new THREE$1.Clock();
        this.tools = new ToolComponent();
        this.ui = new UIManager(this);
        Components.setupBVH();
    }
    /**
     * The [Three.js renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
     * used to render the scene. This library provides multiple renderer
     * components with pre-made functionality (e.g. rendering of 2D CSS elements.
     */
    get renderer() {
        if (!this._renderer) {
            throw new Error("Renderer hasn't been initialised.");
        }
        return this._renderer;
    }
    /**
     * This needs to be initialized before calling init().
     */
    set renderer(renderer) {
        this._renderer = renderer;
    }
    /**
     * The [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene)
     * where all the rendered items are placed.
     */
    get scene() {
        if (!this._scene) {
            throw new Error("Scene hasn't been initialised.");
        }
        return this._scene;
    }
    /**
     * This needs to be initialized before calling init().
     */
    set scene(scene) {
        this._scene = scene;
    }
    /**
     * The [Three.js camera](https://threejs.org/docs/#api/en/cameras/Camera)
     * that determines the point of view of the renderer.
     */
    get camera() {
        if (!this._camera) {
            throw new Error("Camera hasn't been initialised.");
        }
        return this._camera;
    }
    /**
     * This needs to be initialized before calling init().
     */
    set camera(camera) {
        this._camera = camera;
    }
    /**
     * A component using the [Three.js raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
     * used primarily to pick 3D items with the mouse or a touch screen.
     */
    get raycaster() {
        if (!this._raycaster) {
            throw new Error("Raycaster hasn't been initialised.");
        }
        return this._raycaster;
    }
    /**
     * Although this is not necessary to make the library work, it's necessary
     * to initialize this if any component that needs a raycaster is used.
     */
    set raycaster(raycaster) {
        this._raycaster = raycaster;
    }
    /**
     * Initializes the library. It should be called at the start of the app after
     * initializing the scene, the renderer and the
     * camera. Additionally, if any component that need a raycaster is
     * used, the {@link raycaster} will need to be initialized.
     */
    init() {
        this._clock.start();
        this.ui.setup();
        this.update();
    }
    /**
     * Disposes the memory of all the components and tools of this instance of
     * the library. A memory leak will be created if:
     *
     * - An instance of the library ends up out of scope and this function isn't
     * called. This is especially relevant in Single Page Applications (React,
     * Angular, Vue, etc).
     *
     * - Any of the objects of this instance (meshes, geometries, etc) is
     * referenced by a reference type (object or array).
     *
     * You can learn more about how Three.js handles memory leaks
     * [here](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
     *
     */
    dispose() {
        this._enabled = false;
        this.tools.dispose();
        if (this.renderer.isDisposeable())
            this.renderer.dispose();
        if (this.scene.isDisposeable())
            this.scene.dispose();
        if (this.camera.isDisposeable())
            this.camera.dispose();
    }
    static update(component, delta) {
        if (component.isUpdateable() && component.enabled) {
            component.update(delta);
        }
    }
    static setupBVH() {
        THREE$1.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE$1.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE$1.Mesh.prototype.raycast = acceleratedRaycast;
    }
}

/**
 * Simple event handler by
 * [Jason Kleban](https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540).
 * Keep in mind that:
 * - If you want to remove it later, you might want to declare the callback as
 * an object.
 * - If you want to maintain the reference to `this`, you will need to declare
 * the callback as an arrow function.
 */
class Event {
    constructor() {
        /**
         * Triggers all the callbacks assigned to this event.
         */
        this.trigger = ((data) => {
            // @ts-ignore
            this.handlers.slice(0).forEach((h) => h(data));
        });
        this.handlers = [];
    }
    /**
     * Add a callback to this event instance.
     * @param handler - the callback to be added to this event.
     */
    on(handler) {
        this.handlers.push(handler);
    }
    /**
     * Removes a callback from this event instance.
     * @param handler - the callback to be removed from this event.
     */
    off(handler) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }
    /**
     * Gets rid of all the suscribed events.
     */
    reset() {
        this.handlers.length = 0;
    }
}

/**
 * A base component for other components whose main mission is to render a
 * [scene](https://threejs.org/docs/#api/en/scenes/Scene).
 * @noInheritDoc
 */
class BaseRenderer extends Component {
    constructor() {
        super(...arguments);
        /**
         * The list of [clipping planes](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes) used by this
         * instance of the renderer.
         */
        this.clippingPlanes = [];
    }
    /**
     * Adds or removes a
     * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
     * to the renderer.
     */
    togglePlane(active, plane, isLocal) {
        plane.isLocal = isLocal;
        const index = this.clippingPlanes.indexOf(plane);
        if (active && index === -1) {
            this.clippingPlanes.push(plane);
        }
        else if (!active && index > -1) {
            this.clippingPlanes.splice(index, 1);
        }
        const renderer = this.get();
        renderer.clippingPlanes = this.clippingPlanes.filter((plane) => !plane.isLocal);
    }
}

/**
 * A helper to easily get the real position of the mouse in the Three.js canvas
 * to work with tools like the
 * [raycaster](https://threejs.org/docs/#api/en/core/Raycaster), even if it has
 * been transformed through CSS or doesn't occupy the whole screen.
 */
class Mouse {
    constructor(dom) {
        this.dom = dom;
        this._position = new THREE$1.Vector2();
        this.updateMouseInfo = (event) => {
            this._event = event;
        };
        this.setupMousePositionUpdate();
    }
    /**
     * The real position of the mouse of the Three.js canvas.
     */
    get position() {
        if (this._event) {
            const bounds = this.dom.getBoundingClientRect();
            this._position.x = this.getPositionX(bounds, this._event);
            this._position.y = this.getPositionY(bounds, this._event);
        }
        return this._position;
    }
    /** {@link Disposable.dispose} */
    dispose() {
        this.dom.removeEventListener("mousemove", this.updateMouseInfo);
    }
    getPositionY(bound, event) {
        return -((event.clientY - bound.top) / (bound.bottom - bound.top)) * 2 + 1;
    }
    getPositionX(bound, event) {
        return ((event.clientX - bound.left) / (bound.right - bound.left)) * 2 - 1;
    }
    setupMousePositionUpdate() {
        this.dom.addEventListener("mousemove", this.updateMouseInfo);
    }
}

/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
class SimpleRenderer extends BaseRenderer {
    constructor(components, container) {
        super();
        this.components = components;
        this.container = container;
        /** {@link Component.name} */
        this.name = "SimpleRenderer";
        /** {@link Component.enabled} */
        this.enabled = true;
        /** {@link Updateable.beforeUpdate} */
        this.beforeUpdate = new Event();
        /** {@link Updateable.afterUpdate} */
        this.afterUpdate = new Event();
        this._renderer2D = new CSS2DRenderer();
        this._renderer = new THREE$1.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.setupRenderers();
        this.setupEvents();
        this.resize();
    }
    /** {@link Component.get} */
    get() {
        return this._renderer;
    }
    /** {@link Updateable.update} */
    update(_delta) {
        var _a, _b;
        this.beforeUpdate.trigger(this);
        const scene = (_a = this.components.scene) === null || _a === void 0 ? void 0 : _a.get();
        const camera = (_b = this.components.camera) === null || _b === void 0 ? void 0 : _b.get();
        if (!scene || !camera)
            return;
        this._renderer.render(scene, camera);
        this._renderer2D.render(scene, camera);
        this.afterUpdate.trigger(this);
    }
    /** {@link Disposable.dispose} */
    dispose() {
        this.enabled = false;
        this._renderer.domElement.remove();
        this._renderer.dispose();
        this.afterUpdate.reset();
        this.beforeUpdate.reset();
    }
    /** {@link Resizeable.getSize}. */
    getSize() {
        return new THREE$1.Vector2(this._renderer.domElement.clientWidth, this._renderer.domElement.clientHeight);
    }
    /** {@link Resizeable.resize}. */
    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this._renderer.setSize(width, height);
        this._renderer2D.setSize(width, height);
    }
    setupRenderers() {
        this._renderer.localClippingEnabled = true;
        this.container.appendChild(this._renderer.domElement);
        this._renderer2D.domElement.style.position = "absolute";
        this._renderer2D.domElement.style.top = "0px";
        this._renderer2D.domElement.style.pointerEvents = "none";
        this.container.appendChild(this._renderer2D.domElement);
    }
    setupEvents() {
        window.addEventListener("resize", () => {
            this.resize();
        });
    }
}

/*!
 * camera-controls
 * https://github.com/yomotsu/camera-controls
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
// see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#value
const MOUSE_BUTTON = {
    LEFT: 1,
    RIGHT: 2,
    MIDDLE: 4,
};
const ACTION = Object.freeze({
    NONE: 0,
    ROTATE: 1,
    TRUCK: 2,
    OFFSET: 4,
    DOLLY: 8,
    ZOOM: 16,
    TOUCH_ROTATE: 32,
    TOUCH_TRUCK: 64,
    TOUCH_OFFSET: 128,
    TOUCH_DOLLY: 256,
    TOUCH_ZOOM: 512,
    TOUCH_DOLLY_TRUCK: 1024,
    TOUCH_DOLLY_OFFSET: 2048,
    TOUCH_ZOOM_TRUCK: 4096,
    TOUCH_ZOOM_OFFSET: 8192,
});
function isPerspectiveCamera(camera) {
    return camera.isPerspectiveCamera;
}
function isOrthographicCamera(camera) {
    return camera.isOrthographicCamera;
}

const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI / 2;

const EPSILON = 1e-5;
function approxZero(number, error = EPSILON) {
    return Math.abs(number) < error;
}
function approxEquals(a, b, error = EPSILON) {
    return approxZero(a - b, error);
}
function roundToStep(value, step) {
    return Math.round(value / step) * step;
}
function infinityToMaxNumber(value) {
    if (isFinite(value))
        return value;
    if (value < 0)
        return -Number.MAX_VALUE;
    return Number.MAX_VALUE;
}
function maxNumberToInfinity(value) {
    if (Math.abs(value) < Number.MAX_VALUE)
        return value;
    return value * Infinity;
}

function extractClientCoordFromEvent(pointers, out) {
    out.set(0, 0);
    pointers.forEach((pointer) => {
        out.x += pointer.clientX;
        out.y += pointer.clientY;
    });
    out.x /= pointers.length;
    out.y /= pointers.length;
}

function notSupportedInOrthographicCamera(camera, message) {
    if (isOrthographicCamera(camera)) {
        console.warn(`${message} is not supported in OrthographicCamera`);
        return true;
    }
    return false;
}

/**
 * A compat function for `Quaternion.invert()` / `Quaternion.inverse()`.
 * `Quaternion.invert()` is introduced in r123 and `Quaternion.inverse()` emits a warning.
 * We are going to use this compat for a while.
 * @param target A target quaternion
 */
function quatInvertCompat(target) {
    if (target.invert) {
        target.invert();
    }
    else {
        target.inverse();
    }
    return target;
}

class EventDispatcher {
    constructor() {
        this._listeners = {};
    }
    /**
     * Adds the specified event listener.
     * @param type event name
     * @param listener handler function
     * @category Methods
     */
    addEventListener(type, listener) {
        const listeners = this._listeners;
        if (listeners[type] === undefined)
            listeners[type] = [];
        if (listeners[type].indexOf(listener) === -1)
            listeners[type].push(listener);
    }
    // hasEventListener( type: string, listener: Listener ): boolean {
    // 	const listeners = this._listeners;
    // 	return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
    // }
    /**
     * Removes the specified event listener
     * @param type event name
     * @param listener handler function
     * @category Methods
     */
    removeEventListener(type, listener) {
        const listeners = this._listeners;
        const listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener);
            if (index !== -1)
                listenerArray.splice(index, 1);
        }
    }
    /**
     * Removes all event listeners
     * @param type event name
     * @category Methods
     */
    removeAllEventListeners(type) {
        if (!type) {
            this._listeners = {};
            return;
        }
        if (Array.isArray(this._listeners[type]))
            this._listeners[type].length = 0;
    }
    /**
     * Fire an event type.
     * @param event DispatcherEvent
     * @category Methods
     */
    dispatchEvent(event) {
        const listeners = this._listeners;
        const listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            const array = listenerArray.slice(0);
            for (let i = 0, l = array.length; i < l; i++) {
                array[i].call(this, event);
            }
        }
    }
}

const isBrowser = typeof window !== 'undefined';
const isMac = isBrowser && /Mac/.test(navigator.platform);
const isPointerEventsNotSupported = !(isBrowser && 'PointerEvent' in window); // Safari 12 does not support PointerEvents API
const TOUCH_DOLLY_FACTOR = 1 / 8;
let THREE;
let _ORIGIN;
let _AXIS_Y;
let _AXIS_Z;
let _v2;
let _v3A;
let _v3B;
let _v3C;
let _xColumn;
let _yColumn;
let _zColumn;
let _deltaTarget;
let _deltaOffset;
let _sphericalA;
let _sphericalB;
let _box3A;
let _box3B;
let _sphere;
let _quaternionA;
let _quaternionB;
let _rotationMatrix;
let _raycaster;
class CameraControls extends EventDispatcher {
    /**
     * Creates a `CameraControls` instance.
     *
     * Note:
     * You **must install** three.js before using camera-controls. see [#install](#install)
     * Not doing so will lead to runtime errors (`undefined` references to THREE).
     *
     * e.g.
     * ```
     * CameraControls.install( { THREE } );
     * const cameraControls = new CameraControls( camera, domElement );
     * ```
     *
     * @param camera A `THREE.PerspectiveCamera` or `THREE.OrthographicCamera` to be controlled.
     * @param domElement A `HTMLElement` for the draggable area, usually `renderer.domElement`.
     * @category Constructor
     */
    constructor(camera, domElement) {
        super();
        /**
         * Minimum vertical angle in radians.
         * The angle has to be between `0` and `.maxPolarAngle` inclusive.
         * The default value is `0`.
         *
         * e.g.
         * ```
         * cameraControls.maxPolarAngle = 0;
         * ```
         * @category Properties
         */
        this.minPolarAngle = 0; // radians
        /**
         * Maximum vertical angle in radians.
         * The angle has to be between `.maxPolarAngle` and `Math.PI` inclusive.
         * The default value is `Math.PI`.
         *
         * e.g.
         * ```
         * cameraControls.maxPolarAngle = Math.PI;
         * ```
         * @category Properties
         */
        this.maxPolarAngle = Math.PI; // radians
        /**
         * Minimum horizontal angle in radians.
         * The angle has to be less than `.maxAzimuthAngle`.
         * The default value is `- Infinity`.
         *
         * e.g.
         * ```
         * cameraControls.minAzimuthAngle = - Infinity;
         * ```
         * @category Properties
         */
        this.minAzimuthAngle = -Infinity; // radians
        /**
         * Maximum horizontal angle in radians.
         * The angle has to be greater than `.minAzimuthAngle`.
         * The default value is `Infinity`.
         *
         * e.g.
         * ```
         * cameraControls.maxAzimuthAngle = Infinity;
         * ```
         * @category Properties
         */
        this.maxAzimuthAngle = Infinity; // radians
        // How far you can dolly in and out ( PerspectiveCamera only )
        /**
         * Minimum distance for dolly. The value must be higher than `0`.
         * PerspectiveCamera only.
         * @category Properties
         */
        this.minDistance = 0;
        /**
         * Maximum distance for dolly. The value must be higher than `minDistance`.
         * PerspectiveCamera only.
         * @category Properties
         */
        this.maxDistance = Infinity;
        /**
         * `true` to enable Infinity Dolly.
         * When the Dolly distance is less than the `minDistance`, radius of the sphere will be set `minDistance` automatically.
         * @category Properties
         */
        this.infinityDolly = false;
        /**
         * Minimum camera zoom.
         * @category Properties
         */
        this.minZoom = 0.01;
        /**
         * Maximum camera zoom.
         * @category Properties
         */
        this.maxZoom = Infinity;
        /**
         * The damping inertia.
         * The value must be between `Math.EPSILON` to `1` inclusive.
         * Setting `1` to disable smooth transitions.
         * @category Properties
         */
        this.dampingFactor = 0.05;
        /**
         * The damping inertia while dragging.
         * The value must be between `Math.EPSILON` to `1` inclusive.
         * Setting `1` to disable smooth transitions.
         * @category Properties
         */
        this.draggingDampingFactor = 0.25;
        /**
         * Speed of azimuth (horizontal) rotation.
         * @category Properties
         */
        this.azimuthRotateSpeed = 1.0;
        /**
         * Speed of polar (vertical) rotation.
         * @category Properties
         */
        this.polarRotateSpeed = 1.0;
        /**
         * Speed of mouse-wheel dollying.
         * @category Properties
         */
        this.dollySpeed = 1.0;
        /**
         * Speed of drag for truck and pedestal.
         * @category Properties
         */
        this.truckSpeed = 2.0;
        /**
         * `true` to enable Dolly-in to the mouse cursor coords.
         * @category Properties
         */
        this.dollyToCursor = false;
        /**
         * @category Properties
         */
        this.dragToOffset = false;
        /**
         * The same as `.screenSpacePanning` in three.js's OrbitControls.
         * @category Properties
         */
        this.verticalDragToForward = false;
        /**
         * Friction ratio of the boundary.
         * @category Properties
         */
        this.boundaryFriction = 0.0;
        /**
         * Controls how soon the `rest` event fires as the camera slows.
         * @category Properties
         */
        this.restThreshold = 0.01;
        /**
         * An array of Meshes to collide with camera.
         * Be aware colliderMeshes may decrease performance. The collision test uses 4 raycasters from the camera since the near plane has 4 corners.
         * @category Properties
         */
        this.colliderMeshes = [];
        /**
         * Force cancel user dragging.
         * @category Methods
         */
        // cancel will be overwritten in the constructor.
        this.cancel = () => { };
        this._enabled = true;
        this._state = ACTION.NONE;
        this._viewport = null;
        this._dollyControlAmount = 0;
        this._hasRested = true;
        this._boundaryEnclosesCamera = false;
        this._needsUpdate = true;
        this._updatedLastTime = false;
        this._elementRect = new DOMRect();
        this._activePointers = [];
        this._truckInternal = (deltaX, deltaY, dragToOffset) => {
            if (isPerspectiveCamera(this._camera)) {
                const offset = _v3A.copy(this._camera.position).sub(this._target);
                // half of the fov is center to top of screen
                const fov = this._camera.getEffectiveFOV() * THREE.MathUtils.DEG2RAD;
                const targetDistance = offset.length() * Math.tan(fov * 0.5);
                const truckX = (this.truckSpeed * deltaX * targetDistance / this._elementRect.height);
                const pedestalY = (this.truckSpeed * deltaY * targetDistance / this._elementRect.height);
                if (this.verticalDragToForward) {
                    dragToOffset ?
                        this.setFocalOffset(this._focalOffsetEnd.x + truckX, this._focalOffsetEnd.y, this._focalOffsetEnd.z, true) :
                        this.truck(truckX, 0, true);
                    this.forward(-pedestalY, true);
                }
                else {
                    dragToOffset ?
                        this.setFocalOffset(this._focalOffsetEnd.x + truckX, this._focalOffsetEnd.y + pedestalY, this._focalOffsetEnd.z, true) :
                        this.truck(truckX, pedestalY, true);
                }
            }
            else if (isOrthographicCamera(this._camera)) {
                // orthographic
                const camera = this._camera;
                const truckX = deltaX * (camera.right - camera.left) / camera.zoom / this._elementRect.width;
                const pedestalY = deltaY * (camera.top - camera.bottom) / camera.zoom / this._elementRect.height;
                dragToOffset ?
                    this.setFocalOffset(this._focalOffsetEnd.x + truckX, this._focalOffsetEnd.y + pedestalY, this._focalOffsetEnd.z, true) :
                    this.truck(truckX, pedestalY, true);
            }
        };
        this._rotateInternal = (deltaX, deltaY) => {
            const theta = PI_2 * this.azimuthRotateSpeed * deltaX / this._elementRect.height; // divide by *height* to refer the resolution
            const phi = PI_2 * this.polarRotateSpeed * deltaY / this._elementRect.height;
            this.rotate(theta, phi, true);
        };
        this._dollyInternal = (delta, x, y) => {
            const dollyScale = Math.pow(0.95, -delta * this.dollySpeed);
            const distance = this._sphericalEnd.radius * dollyScale;
            const prevRadius = this._sphericalEnd.radius;
            const signedPrevRadius = prevRadius * (delta >= 0 ? -1 : 1);
            this.dollyTo(distance);
            if (this.infinityDolly && (distance < this.minDistance || this.maxDistance === this.minDistance)) {
                this._camera.getWorldDirection(_v3A);
                this._targetEnd.add(_v3A.normalize().multiplyScalar(signedPrevRadius));
                this._target.add(_v3A.normalize().multiplyScalar(signedPrevRadius));
            }
            if (this.dollyToCursor) {
                this._dollyControlAmount += this._sphericalEnd.radius - prevRadius;
                if (this.infinityDolly && (distance < this.minDistance || this.maxDistance === this.minDistance)) {
                    this._dollyControlAmount -= signedPrevRadius;
                }
                this._dollyControlCoord.set(x, y);
            }
            return;
        };
        this._zoomInternal = (delta, x, y) => {
            const zoomScale = Math.pow(0.95, delta * this.dollySpeed);
            // for both PerspectiveCamera and OrthographicCamera
            this.zoomTo(this._zoom * zoomScale);
            if (this.dollyToCursor) {
                this._dollyControlAmount = this._zoomEnd;
                this._dollyControlCoord.set(x, y);
            }
            return;
        };
        // Check if the user has installed THREE
        if (typeof THREE === 'undefined') {
            console.error('camera-controls: `THREE` is undefined. You must first run `CameraControls.install( { THREE: THREE } )`. Check the docs for further information.');
        }
        this._camera = camera;
        this._yAxisUpSpace = new THREE.Quaternion().setFromUnitVectors(this._camera.up, _AXIS_Y);
        this._yAxisUpSpaceInverse = quatInvertCompat(this._yAxisUpSpace.clone());
        this._state = ACTION.NONE;
        this._domElement = domElement;
        this._domElement.style.touchAction = 'none';
        this._domElement.style.userSelect = 'none';
        this._domElement.style.webkitUserSelect = 'none';
        // the location
        this._target = new THREE.Vector3();
        this._targetEnd = this._target.clone();
        this._focalOffset = new THREE.Vector3();
        this._focalOffsetEnd = this._focalOffset.clone();
        // rotation
        this._spherical = new THREE.Spherical().setFromVector3(_v3A.copy(this._camera.position).applyQuaternion(this._yAxisUpSpace));
        this._sphericalEnd = this._spherical.clone();
        this._zoom = this._camera.zoom;
        this._zoomEnd = this._zoom;
        // collisionTest uses nearPlane.s
        this._nearPlaneCorners = [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
        ];
        this._updateNearPlaneCorners();
        // Target cannot move outside of this box
        this._boundary = new THREE.Box3(new THREE.Vector3(-Infinity, -Infinity, -Infinity), new THREE.Vector3(Infinity, Infinity, Infinity));
        // reset
        this._target0 = this._target.clone();
        this._position0 = this._camera.position.clone();
        this._zoom0 = this._zoom;
        this._focalOffset0 = this._focalOffset.clone();
        this._dollyControlAmount = 0;
        this._dollyControlCoord = new THREE.Vector2();
        // configs
        this.mouseButtons = {
            left: ACTION.ROTATE,
            middle: ACTION.DOLLY,
            right: ACTION.TRUCK,
            wheel: isPerspectiveCamera(this._camera) ? ACTION.DOLLY :
                isOrthographicCamera(this._camera) ? ACTION.ZOOM :
                    ACTION.NONE,
        };
        this.touches = {
            one: ACTION.TOUCH_ROTATE,
            two: isPerspectiveCamera(this._camera) ? ACTION.TOUCH_DOLLY_TRUCK :
                isOrthographicCamera(this._camera) ? ACTION.TOUCH_ZOOM_TRUCK :
                    ACTION.NONE,
            three: ACTION.TOUCH_TRUCK,
        };
        if (this._domElement) {
            const dragStartPosition = new THREE.Vector2();
            const lastDragPosition = new THREE.Vector2();
            const dollyStart = new THREE.Vector2();
            const onPointerDown = (event) => {
                if (!this._enabled)
                    return;
                // Don't call `event.preventDefault()` on the pointerdown event
                // to keep receiving pointermove evens outside dragging iframe
                // https://taye.me/blog/tips/2015/11/16/mouse-drag-outside-iframe/
                const pointer = {
                    pointerId: event.pointerId,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    deltaX: 0,
                    deltaY: 0,
                };
                this._activePointers.push(pointer);
                // eslint-disable-next-line no-undef
                this._domElement.ownerDocument.removeEventListener('pointermove', onPointerMove, { passive: false });
                this._domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);
                this._domElement.ownerDocument.addEventListener('pointermove', onPointerMove, { passive: false });
                this._domElement.ownerDocument.addEventListener('pointerup', onPointerUp);
                startDragging(event);
            };
            const onMouseDown = (event) => {
                if (!this._enabled)
                    return;
                const pointer = {
                    pointerId: 0,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    deltaX: 0,
                    deltaY: 0,
                };
                this._activePointers.push(pointer);
                // see https://github.com/microsoft/TypeScript/issues/32912#issuecomment-522142969
                // eslint-disable-next-line no-undef
                this._domElement.ownerDocument.removeEventListener('mousemove', onMouseMove);
                this._domElement.ownerDocument.removeEventListener('mouseup', onMouseUp);
                this._domElement.ownerDocument.addEventListener('mousemove', onMouseMove);
                this._domElement.ownerDocument.addEventListener('mouseup', onMouseUp);
                startDragging(event);
            };
            const onTouchStart = (event) => {
                if (!this._enabled)
                    return;
                event.preventDefault();
                Array.prototype.forEach.call(event.changedTouches, (touch) => {
                    const pointer = {
                        pointerId: touch.identifier,
                        clientX: touch.clientX,
                        clientY: touch.clientY,
                        deltaX: 0,
                        deltaY: 0,
                    };
                    this._activePointers.push(pointer);
                });
                // eslint-disable-next-line no-undef
                this._domElement.ownerDocument.removeEventListener('touchmove', onTouchMove, { passive: false });
                this._domElement.ownerDocument.removeEventListener('touchend', onTouchEnd);
                this._domElement.ownerDocument.addEventListener('touchmove', onTouchMove, { passive: false });
                this._domElement.ownerDocument.addEventListener('touchend', onTouchEnd);
                startDragging(event);
            };
            const onPointerMove = (event) => {
                if (event.cancelable)
                    event.preventDefault();
                const pointerId = event.pointerId;
                const pointer = this._findPointerById(pointerId);
                if (!pointer)
                    return;
                pointer.clientX = event.clientX;
                pointer.clientY = event.clientY;
                pointer.deltaX = event.movementX;
                pointer.deltaY = event.movementY;
                if (event.pointerType === 'touch') {
                    switch (this._activePointers.length) {
                        case 1:
                            this._state = this.touches.one;
                            break;
                        case 2:
                            this._state = this.touches.two;
                            break;
                        case 3:
                            this._state = this.touches.three;
                            break;
                    }
                }
                else {
                    this._state = 0;
                    if ((event.buttons & MOUSE_BUTTON.LEFT) === MOUSE_BUTTON.LEFT) {
                        this._state = this._state | this.mouseButtons.left;
                    }
                    if ((event.buttons & MOUSE_BUTTON.MIDDLE) === MOUSE_BUTTON.MIDDLE) {
                        this._state = this._state | this.mouseButtons.middle;
                    }
                    if ((event.buttons & MOUSE_BUTTON.RIGHT) === MOUSE_BUTTON.RIGHT) {
                        this._state = this._state | this.mouseButtons.right;
                    }
                }
                dragging();
            };
            const onMouseMove = (event) => {
                const pointer = this._findPointerById(0);
                if (!pointer)
                    return;
                pointer.clientX = event.clientX;
                pointer.clientY = event.clientY;
                pointer.deltaX = event.movementX;
                pointer.deltaY = event.movementY;
                this._state = 0;
                if ((event.buttons & MOUSE_BUTTON.LEFT) === MOUSE_BUTTON.LEFT) {
                    this._state = this._state | this.mouseButtons.left;
                }
                if ((event.buttons & MOUSE_BUTTON.MIDDLE) === MOUSE_BUTTON.MIDDLE) {
                    this._state = this._state | this.mouseButtons.middle;
                }
                if ((event.buttons & MOUSE_BUTTON.RIGHT) === MOUSE_BUTTON.RIGHT) {
                    this._state = this._state | this.mouseButtons.right;
                }
                dragging();
            };
            const onTouchMove = (event) => {
                if (event.cancelable)
                    event.preventDefault();
                Array.prototype.forEach.call(event.changedTouches, (touch) => {
                    const pointerId = touch.identifier;
                    const pointer = this._findPointerById(pointerId);
                    if (!pointer)
                        return;
                    pointer.clientX = touch.clientX;
                    pointer.clientY = touch.clientY;
                    // touch event does not have movementX and movementY.
                });
                dragging();
            };
            const onPointerUp = (event) => {
                const pointerId = event.pointerId;
                const pointer = this._findPointerById(pointerId);
                pointer && this._activePointers.splice(this._activePointers.indexOf(pointer), 1);
                if (event.pointerType === 'touch') {
                    switch (this._activePointers.length) {
                        case 0:
                            this._state = ACTION.NONE;
                            break;
                        case 1:
                            this._state = this.touches.one;
                            break;
                        case 2:
                            this._state = this.touches.two;
                            break;
                        case 3:
                            this._state = this.touches.three;
                            break;
                    }
                }
                else {
                    this._state = ACTION.NONE;
                }
                endDragging();
            };
            const onMouseUp = () => {
                const pointer = this._findPointerById(0);
                pointer && this._activePointers.splice(this._activePointers.indexOf(pointer), 1);
                this._state = ACTION.NONE;
                endDragging();
            };
            const onTouchEnd = (event) => {
                Array.prototype.forEach.call(event.changedTouches, (touch) => {
                    const pointerId = touch.identifier;
                    const pointer = this._findPointerById(pointerId);
                    pointer && this._activePointers.splice(this._activePointers.indexOf(pointer), 1);
                });
                switch (this._activePointers.length) {
                    case 0:
                        this._state = ACTION.NONE;
                        break;
                    case 1:
                        this._state = this.touches.one;
                        break;
                    case 2:
                        this._state = this.touches.two;
                        break;
                    case 3:
                        this._state = this.touches.three;
                        break;
                }
                endDragging();
            };
            let lastScrollTimeStamp = -1;
            const onMouseWheel = (event) => {
                if (!this._enabled || this.mouseButtons.wheel === ACTION.NONE)
                    return;
                event.preventDefault();
                if (this.dollyToCursor ||
                    this.mouseButtons.wheel === ACTION.ROTATE ||
                    this.mouseButtons.wheel === ACTION.TRUCK) {
                    const now = performance.now();
                    // only need to fire this at scroll start.
                    if (lastScrollTimeStamp - now < 1000)
                        this._getClientRect(this._elementRect);
                    lastScrollTimeStamp = now;
                }
                // Ref: https://github.com/cedricpinson/osgjs/blob/00e5a7e9d9206c06fdde0436e1d62ab7cb5ce853/sources/osgViewer/input/source/InputSourceMouse.js#L89-L103
                const deltaYFactor = isMac ? -1 : -3;
                const delta = (event.deltaMode === 1) ? event.deltaY / deltaYFactor : event.deltaY / (deltaYFactor * 10);
                const x = this.dollyToCursor ? (event.clientX - this._elementRect.x) / this._elementRect.width * 2 - 1 : 0;
                const y = this.dollyToCursor ? (event.clientY - this._elementRect.y) / this._elementRect.height * -2 + 1 : 0;
                switch (this.mouseButtons.wheel) {
                    case ACTION.ROTATE: {
                        this._rotateInternal(event.deltaX, event.deltaY);
                        break;
                    }
                    case ACTION.TRUCK: {
                        this._truckInternal(event.deltaX, event.deltaY, false);
                        break;
                    }
                    case ACTION.OFFSET: {
                        this._truckInternal(event.deltaX, event.deltaY, true);
                        break;
                    }
                    case ACTION.DOLLY: {
                        this._dollyInternal(-delta, x, y);
                        break;
                    }
                    case ACTION.ZOOM: {
                        this._zoomInternal(-delta, x, y);
                        break;
                    }
                }
                this.dispatchEvent({ type: 'control' });
            };
            const onContextMenu = (event) => {
                if (!this._enabled)
                    return;
                event.preventDefault();
            };
            const startDragging = (event) => {
                if (!this._enabled)
                    return;
                extractClientCoordFromEvent(this._activePointers, _v2);
                this._getClientRect(this._elementRect);
                dragStartPosition.copy(_v2);
                lastDragPosition.copy(_v2);
                const isMultiTouch = this._activePointers.length >= 2;
                if (isMultiTouch) {
                    // 2 finger pinch
                    const dx = _v2.x - this._activePointers[1].clientX;
                    const dy = _v2.y - this._activePointers[1].clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    dollyStart.set(0, distance);
                    // center coords of 2 finger truck
                    const x = (this._activePointers[0].clientX + this._activePointers[1].clientX) * 0.5;
                    const y = (this._activePointers[0].clientY + this._activePointers[1].clientY) * 0.5;
                    lastDragPosition.set(x, y);
                }
                if ('touches' in event ||
                    'pointerType' in event && event.pointerType === 'touch') {
                    switch (this._activePointers.length) {
                        case 1:
                            this._state = this.touches.one;
                            break;
                        case 2:
                            this._state = this.touches.two;
                            break;
                        case 3:
                            this._state = this.touches.three;
                            break;
                    }
                }
                else {
                    this._state = 0;
                    if ((event.buttons & MOUSE_BUTTON.LEFT) === MOUSE_BUTTON.LEFT) {
                        this._state = this._state | this.mouseButtons.left;
                    }
                    if ((event.buttons & MOUSE_BUTTON.MIDDLE) === MOUSE_BUTTON.MIDDLE) {
                        this._state = this._state | this.mouseButtons.middle;
                    }
                    if ((event.buttons & MOUSE_BUTTON.RIGHT) === MOUSE_BUTTON.RIGHT) {
                        this._state = this._state | this.mouseButtons.right;
                    }
                }
                this.dispatchEvent({ type: 'controlstart' });
            };
            const dragging = () => {
                if (!this._enabled)
                    return;
                extractClientCoordFromEvent(this._activePointers, _v2);
                // When pointer lock is enabled clientX, clientY, screenX, and screenY remain 0.
                // If pointer lock is enabled, use the Delta directory, and assume active-pointer is not multiple.
                const isPointerLockActive = this._domElement && document.pointerLockElement === this._domElement;
                const deltaX = isPointerLockActive ? -this._activePointers[0].deltaX : lastDragPosition.x - _v2.x;
                const deltaY = isPointerLockActive ? -this._activePointers[0].deltaY : lastDragPosition.y - _v2.y;
                lastDragPosition.copy(_v2);
                if ((this._state & ACTION.ROTATE) === ACTION.ROTATE ||
                    (this._state & ACTION.TOUCH_ROTATE) === ACTION.TOUCH_ROTATE) {
                    this._rotateInternal(deltaX, deltaY);
                }
                if ((this._state & ACTION.DOLLY) === ACTION.DOLLY ||
                    (this._state & ACTION.ZOOM) === ACTION.ZOOM) {
                    const dollyX = this.dollyToCursor ? (dragStartPosition.x - this._elementRect.x) / this._elementRect.width * 2 - 1 : 0;
                    const dollyY = this.dollyToCursor ? (dragStartPosition.y - this._elementRect.y) / this._elementRect.height * -2 + 1 : 0;
                    this._state === ACTION.DOLLY ?
                        this._dollyInternal(deltaY * TOUCH_DOLLY_FACTOR, dollyX, dollyY) :
                        this._zoomInternal(deltaY * TOUCH_DOLLY_FACTOR, dollyX, dollyY);
                }
                if ((this._state & ACTION.TOUCH_DOLLY) === ACTION.TOUCH_DOLLY ||
                    (this._state & ACTION.TOUCH_ZOOM) === ACTION.TOUCH_ZOOM ||
                    (this._state & ACTION.TOUCH_DOLLY_TRUCK) === ACTION.TOUCH_DOLLY_TRUCK ||
                    (this._state & ACTION.TOUCH_ZOOM_TRUCK) === ACTION.TOUCH_ZOOM_TRUCK ||
                    (this._state & ACTION.TOUCH_DOLLY_OFFSET) === ACTION.TOUCH_DOLLY_OFFSET ||
                    (this._state & ACTION.TOUCH_ZOOM_OFFSET) === ACTION.TOUCH_ZOOM_OFFSET) {
                    const dx = _v2.x - this._activePointers[1].clientX;
                    const dy = _v2.y - this._activePointers[1].clientY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const dollyDelta = dollyStart.y - distance;
                    dollyStart.set(0, distance);
                    const dollyX = this.dollyToCursor ? (lastDragPosition.x - this._elementRect.x) / this._elementRect.width * 2 - 1 : 0;
                    const dollyY = this.dollyToCursor ? (lastDragPosition.y - this._elementRect.y) / this._elementRect.height * -2 + 1 : 0;
                    this._state === ACTION.TOUCH_DOLLY ||
                        this._state === ACTION.TOUCH_DOLLY_TRUCK ||
                        this._state === ACTION.TOUCH_DOLLY_OFFSET ?
                        this._dollyInternal(dollyDelta * TOUCH_DOLLY_FACTOR, dollyX, dollyY) :
                        this._zoomInternal(dollyDelta * TOUCH_DOLLY_FACTOR, dollyX, dollyY);
                }
                if ((this._state & ACTION.TRUCK) === ACTION.TRUCK ||
                    (this._state & ACTION.TOUCH_TRUCK) === ACTION.TOUCH_TRUCK ||
                    (this._state & ACTION.TOUCH_DOLLY_TRUCK) === ACTION.TOUCH_DOLLY_TRUCK ||
                    (this._state & ACTION.TOUCH_ZOOM_TRUCK) === ACTION.TOUCH_ZOOM_TRUCK) {
                    this._truckInternal(deltaX, deltaY, false);
                }
                if ((this._state & ACTION.OFFSET) === ACTION.OFFSET ||
                    (this._state & ACTION.TOUCH_OFFSET) === ACTION.TOUCH_OFFSET ||
                    (this._state & ACTION.TOUCH_DOLLY_OFFSET) === ACTION.TOUCH_DOLLY_OFFSET ||
                    (this._state & ACTION.TOUCH_ZOOM_OFFSET) === ACTION.TOUCH_ZOOM_OFFSET) {
                    this._truckInternal(deltaX, deltaY, true);
                }
                this.dispatchEvent({ type: 'control' });
            };
            const endDragging = () => {
                extractClientCoordFromEvent(this._activePointers, _v2);
                lastDragPosition.copy(_v2);
                if (this._activePointers.length === 0) {
                    // eslint-disable-next-line no-undef
                    this._domElement.ownerDocument.removeEventListener('pointermove', onPointerMove, { passive: false });
                    this._domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);
                    // eslint-disable-next-line no-undef
                    this._domElement.ownerDocument.removeEventListener('touchmove', onTouchMove, { passive: false });
                    this._domElement.ownerDocument.removeEventListener('touchend', onTouchEnd);
                    this.dispatchEvent({ type: 'controlend' });
                }
            };
            this._domElement.addEventListener('pointerdown', onPointerDown);
            isPointerEventsNotSupported && this._domElement.addEventListener('mousedown', onMouseDown);
            isPointerEventsNotSupported && this._domElement.addEventListener('touchstart', onTouchStart);
            this._domElement.addEventListener('pointercancel', onPointerUp);
            this._domElement.addEventListener('wheel', onMouseWheel, { passive: false });
            this._domElement.addEventListener('contextmenu', onContextMenu);
            this._removeAllEventListeners = () => {
                this._domElement.removeEventListener('pointerdown', onPointerDown);
                this._domElement.removeEventListener('mousedown', onMouseDown);
                this._domElement.removeEventListener('touchstart', onTouchStart);
                this._domElement.removeEventListener('pointercancel', onPointerUp);
                // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
                // > it's probably wise to use the same values used for the call to `addEventListener()` when calling `removeEventListener()`
                // see https://github.com/microsoft/TypeScript/issues/32912#issuecomment-522142969
                // eslint-disable-next-line no-undef
                this._domElement.removeEventListener('wheel', onMouseWheel, { passive: false });
                this._domElement.removeEventListener('contextmenu', onContextMenu);
                // eslint-disable-next-line no-undef
                this._domElement.ownerDocument.removeEventListener('pointermove', onPointerMove, { passive: false });
                this._domElement.ownerDocument.removeEventListener('mousemove', onMouseMove);
                // eslint-disable-next-line no-undef
                this._domElement.ownerDocument.removeEventListener('touchmove', onTouchMove, { passive: false });
                this._domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);
                this._domElement.ownerDocument.removeEventListener('mouseup', onMouseUp);
                this._domElement.ownerDocument.removeEventListener('touchend', onTouchEnd);
            };
            this.cancel = () => {
                if (this._state === ACTION.NONE)
                    return;
                this._state = ACTION.NONE;
                this._activePointers.length = 0;
                endDragging();
            };
        }
        this.update(0);
    }
    /**
     * Injects THREE as the dependency. You can then proceed to use CameraControls.
     *
     * e.g
     * ```javascript
     * CameraControls.install( { THREE: THREE } );
     * ```
     *
     * Note: If you do not wish to use enter three.js to reduce file size(tree-shaking for example), make a subset to install.
     *
     * ```js
     * import {
     * 	Vector2,
     * 	Vector3,
     * 	Vector4,
     * 	Quaternion,
     * 	Matrix4,
     * 	Spherical,
     * 	Box3,
     * 	Sphere,
     * 	Raycaster,
     * 	MathUtils,
     * } from 'three';
     *
     * const subsetOfTHREE = {
     * 	Vector2   : Vector2,
     * 	Vector3   : Vector3,
     * 	Vector4   : Vector4,
     * 	Quaternion: Quaternion,
     * 	Matrix4   : Matrix4,
     * 	Spherical : Spherical,
     * 	Box3      : Box3,
     * 	Sphere    : Sphere,
     * 	Raycaster : Raycaster,
     * 	MathUtils : {
     * 		DEG2RAD: MathUtils.DEG2RAD,
     * 		clamp: MathUtils.clamp,
     * 	},
     * };

     * CameraControls.install( { THREE: subsetOfTHREE } );
     * ```
     * @category Statics
     */
    static install(libs) {
        THREE = libs.THREE;
        _ORIGIN = Object.freeze(new THREE.Vector3(0, 0, 0));
        _AXIS_Y = Object.freeze(new THREE.Vector3(0, 1, 0));
        _AXIS_Z = Object.freeze(new THREE.Vector3(0, 0, 1));
        _v2 = new THREE.Vector2();
        _v3A = new THREE.Vector3();
        _v3B = new THREE.Vector3();
        _v3C = new THREE.Vector3();
        _xColumn = new THREE.Vector3();
        _yColumn = new THREE.Vector3();
        _zColumn = new THREE.Vector3();
        _deltaTarget = new THREE.Vector3();
        _deltaOffset = new THREE.Vector3();
        _sphericalA = new THREE.Spherical();
        _sphericalB = new THREE.Spherical();
        _box3A = new THREE.Box3();
        _box3B = new THREE.Box3();
        _sphere = new THREE.Sphere();
        _quaternionA = new THREE.Quaternion();
        _quaternionB = new THREE.Quaternion();
        _rotationMatrix = new THREE.Matrix4();
        _raycaster = new THREE.Raycaster();
    }
    /**
     * list all ACTIONs
     * @category Statics
     */
    static get ACTION() {
        return ACTION;
    }
    /**
     * The camera to be controlled
     * @category Properties
     */
    get camera() {
        return this._camera;
    }
    set camera(camera) {
        this._camera = camera;
        this.updateCameraUp();
        this._camera.updateProjectionMatrix();
        this._updateNearPlaneCorners();
        this._needsUpdate = true;
    }
    /**
     * Whether or not the controls are enabled.
     * `false` to disable user dragging/touch-move, but all methods works.
     * @category Properties
     */
    get enabled() {
        return this._enabled;
    }
    set enabled(enabled) {
        this._enabled = enabled;
        if (enabled) {
            this._domElement.style.touchAction = 'none';
            this._domElement.style.userSelect = 'none';
            this._domElement.style.webkitUserSelect = 'none';
        }
        else {
            this.cancel();
            this._domElement.style.touchAction = '';
            this._domElement.style.userSelect = '';
            this._domElement.style.webkitUserSelect = '';
        }
    }
    /**
     * Returns `true` if the controls are active updating.
     * readonly value.
     * @category Properties
     */
    get active() {
        return !this._hasRested;
    }
    /**
     * Getter for the current `ACTION`.
     * readonly value.
     * @category Properties
     */
    get currentAction() {
        return this._state;
    }
    /**
     * get/set Current distance.
     * @category Properties
     */
    get distance() {
        return this._spherical.radius;
    }
    set distance(distance) {
        if (this._spherical.radius === distance &&
            this._sphericalEnd.radius === distance)
            return;
        this._spherical.radius = distance;
        this._sphericalEnd.radius = distance;
        this._needsUpdate = true;
    }
    // horizontal angle
    /**
     * get/set the azimuth angle (horizontal) in radians.
     * Every 360 degrees turn is added to `.azimuthAngle` value, which is accumulative.
     * @category Properties
     */
    get azimuthAngle() {
        return this._spherical.theta;
    }
    set azimuthAngle(azimuthAngle) {
        if (this._spherical.theta === azimuthAngle &&
            this._sphericalEnd.theta === azimuthAngle)
            return;
        this._spherical.theta = azimuthAngle;
        this._sphericalEnd.theta = azimuthAngle;
        this._needsUpdate = true;
    }
    // vertical angle
    /**
     * get/set the polar angle (vertical) in radians.
     * @category Properties
     */
    get polarAngle() {
        return this._spherical.phi;
    }
    set polarAngle(polarAngle) {
        if (this._spherical.phi === polarAngle &&
            this._sphericalEnd.phi === polarAngle)
            return;
        this._spherical.phi = polarAngle;
        this._sphericalEnd.phi = polarAngle;
        this._needsUpdate = true;
    }
    /**
     * Whether camera position should be enclosed in the boundary or not.
     * @category Properties
     */
    get boundaryEnclosesCamera() {
        return this._boundaryEnclosesCamera;
    }
    set boundaryEnclosesCamera(boundaryEnclosesCamera) {
        this._boundaryEnclosesCamera = boundaryEnclosesCamera;
        this._needsUpdate = true;
    }
    /**
     * Adds the specified event listener.
     * Applicable event types (which is `K`) are:
     * | Event name          | Timing |
     * | ------------------- | ------ |
     * | `'controlstart'`    | When the user starts to control the camera via mouse / touches. ¹ |
     * | `'control'`         | When the user controls the camera (dragging). |
     * | `'controlend'`      | When the user ends to control the camera. ¹ |
     * | `'transitionstart'` | When any kind of transition starts, either user control or using a method with `enableTransition = true` |
     * | `'update'`          | When the camera position is updated. |
     * | `'wake'`            | When the camera starts moving. |
     * | `'rest'`            | When the camera movement is below `.restThreshold` ². |
     * | `'sleep'`           | When the camera end moving. |
     *
     * 1. `mouseButtons.wheel` (Mouse wheel control) does not emit `'controlstart'` and `'controlend'`. `mouseButtons.wheel` uses scroll-event internally, and scroll-event happens intermittently. That means "start" and "end" cannot be detected.
     * 2. Due to damping, `sleep` will usually fire a few seconds after the camera _appears_ to have stopped moving. If you want to do something (e.g. enable UI, perform another transition) at the point when the camera has stopped, you probably want the `rest` event. This can be fine tuned using the `.restThreshold` parameter. See the [Rest and Sleep Example](https://yomotsu.github.io/camera-controls/examples/rest-and-sleep.html).
     *
     * e.g.
     * ```
     * cameraControl.addEventListener( 'controlstart', myCallbackFunction );
     * ```
     * @param type event name
     * @param listener handler function
     * @category Methods
     */
    addEventListener(type, listener) {
        super.addEventListener(type, listener);
    }
    /**
     * Removes the specified event listener
     * e.g.
     * ```
     * cameraControl.addEventListener( 'controlstart', myCallbackFunction );
     * ```
     * @param type event name
     * @param listener handler function
     * @category Methods
     */
    removeEventListener(type, listener) {
        super.removeEventListener(type, listener);
    }
    /**
     * Rotate azimuthal angle(horizontal) and polar angle(vertical).
     * Every value is added to the current value.
     * @param azimuthAngle Azimuth rotate angle. In radian.
     * @param polarAngle Polar rotate angle. In radian.
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    rotate(azimuthAngle, polarAngle, enableTransition = false) {
        return this.rotateTo(this._sphericalEnd.theta + azimuthAngle, this._sphericalEnd.phi + polarAngle, enableTransition);
    }
    /**
     * Rotate azimuthal angle(horizontal) to the given angle and keep the same polar angle(vertical) target.
     *
     * e.g.
     * ```
     * cameraControls.rotateAzimuthTo( 30 * THREE.MathUtils.DEG2RAD, true );
     * ```
     * @param azimuthAngle Azimuth rotate angle. In radian.
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    rotateAzimuthTo(azimuthAngle, enableTransition = false) {
        return this.rotateTo(azimuthAngle, this._sphericalEnd.phi, enableTransition);
    }
    /**
     * Rotate polar angle(vertical) to the given angle and keep the same azimuthal angle(horizontal) target.
     *
     * e.g.
     * ```
     * cameraControls.rotatePolarTo( 30 * THREE.MathUtils.DEG2RAD, true );
     * ```
     * @param polarAngle Polar rotate angle. In radian.
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    rotatePolarTo(polarAngle, enableTransition = false) {
        return this.rotateTo(this._sphericalEnd.theta, polarAngle, enableTransition);
    }
    /**
     * Rotate azimuthal angle(horizontal) and polar angle(vertical) to the given angle.
     * Camera view will rotate over the orbit pivot absolutely:
     *
     * azimuthAngle
     * ```
     *       0º
     *         \
     * 90º -----+----- -90º
     *           \
     *           180º
     * ```
     * | direction | angle                  |
     * | --------- | ---------------------- |
     * | front     | 0º                     |
     * | left      | 90º (`Math.PI / 2`)    |
     * | right     | -90º (`- Math.PI / 2`) |
     * | back      | 180º (`Math.PI`)       |
     *
     * polarAngle
     * ```
     *     180º
     *      |
     *      90º
     *      |
     *      0º
     * ```
     * | direction            | angle                  |
     * | -------------------- | ---------------------- |
     * | top/sky              | 180º (`Math.PI`)       |
     * | horizontal from view | 90º (`Math.PI / 2`)    |
     * | bottom/floor         | 0º                     |
     *
     * @param azimuthAngle Azimuth rotate angle to. In radian.
     * @param polarAngle Polar rotate angle to. In radian.
     * @param enableTransition  Whether to move smoothly or immediately
     * @category Methods
     */
    rotateTo(azimuthAngle, polarAngle, enableTransition = false) {
        const theta = THREE.MathUtils.clamp(azimuthAngle, this.minAzimuthAngle, this.maxAzimuthAngle);
        const phi = THREE.MathUtils.clamp(polarAngle, this.minPolarAngle, this.maxPolarAngle);
        this._sphericalEnd.theta = theta;
        this._sphericalEnd.phi = phi;
        this._sphericalEnd.makeSafe();
        this._needsUpdate = true;
        if (!enableTransition) {
            this._spherical.theta = this._sphericalEnd.theta;
            this._spherical.phi = this._sphericalEnd.phi;
        }
        const resolveImmediately = !enableTransition ||
            approxEquals(this._spherical.theta, this._sphericalEnd.theta, this.restThreshold) &&
                approxEquals(this._spherical.phi, this._sphericalEnd.phi, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * Dolly in/out camera position.
     * @param distance Distance of dollyIn. Negative number for dollyOut.
     * @param enableTransition Whether to move smoothly or immediately.
     * @category Methods
     */
    dolly(distance, enableTransition = false) {
        return this.dollyTo(this._sphericalEnd.radius - distance, enableTransition);
    }
    /**
     * Dolly in/out camera position to given distance.
     * @param distance Distance of dolly.
     * @param enableTransition Whether to move smoothly or immediately.
     * @category Methods
     */
    dollyTo(distance, enableTransition = false) {
        const lastRadius = this._sphericalEnd.radius;
        const newRadius = THREE.MathUtils.clamp(distance, this.minDistance, this.maxDistance);
        const hasCollider = this.colliderMeshes.length >= 1;
        if (hasCollider) {
            const maxDistanceByCollisionTest = this._collisionTest();
            const isCollided = approxEquals(maxDistanceByCollisionTest, this._spherical.radius);
            const isDollyIn = lastRadius > newRadius;
            if (!isDollyIn && isCollided)
                return Promise.resolve();
            this._sphericalEnd.radius = Math.min(newRadius, maxDistanceByCollisionTest);
        }
        else {
            this._sphericalEnd.radius = newRadius;
        }
        this._needsUpdate = true;
        if (!enableTransition) {
            this._spherical.radius = this._sphericalEnd.radius;
        }
        const resolveImmediately = !enableTransition || approxEquals(this._spherical.radius, this._sphericalEnd.radius, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * Zoom in/out camera. The value is added to camera zoom.
     * Limits set with `.minZoom` and `.maxZoom`
     * @param zoomStep zoom scale
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    zoom(zoomStep, enableTransition = false) {
        return this.zoomTo(this._zoomEnd + zoomStep, enableTransition);
    }
    /**
     * Zoom in/out camera to given scale. The value overwrites camera zoom.
     * Limits set with .minZoom and .maxZoom
     * @param zoom
     * @param enableTransition
     * @category Methods
     */
    zoomTo(zoom, enableTransition = false) {
        this._zoomEnd = THREE.MathUtils.clamp(zoom, this.minZoom, this.maxZoom);
        this._needsUpdate = true;
        if (!enableTransition) {
            this._zoom = this._zoomEnd;
        }
        const resolveImmediately = !enableTransition || approxEquals(this._zoom, this._zoomEnd, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * @deprecated `pan()` has been renamed to `truck()`
     * @category Methods
     */
    pan(x, y, enableTransition = false) {
        console.warn('`pan` has been renamed to `truck`');
        return this.truck(x, y, enableTransition);
    }
    /**
     * Truck and pedestal camera using current azimuthal angle
     * @param x Horizontal translate amount
     * @param y Vertical translate amount
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    truck(x, y, enableTransition = false) {
        this._camera.updateMatrix();
        _xColumn.setFromMatrixColumn(this._camera.matrix, 0);
        _yColumn.setFromMatrixColumn(this._camera.matrix, 1);
        _xColumn.multiplyScalar(x);
        _yColumn.multiplyScalar(-y);
        const offset = _v3A.copy(_xColumn).add(_yColumn);
        const to = _v3B.copy(this._targetEnd).add(offset);
        return this.moveTo(to.x, to.y, to.z, enableTransition);
    }
    /**
     * Move forward / backward.
     * @param distance Amount to move forward / backward. Negative value to move backward
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    forward(distance, enableTransition = false) {
        _v3A.setFromMatrixColumn(this._camera.matrix, 0);
        _v3A.crossVectors(this._camera.up, _v3A);
        _v3A.multiplyScalar(distance);
        const to = _v3B.copy(this._targetEnd).add(_v3A);
        return this.moveTo(to.x, to.y, to.z, enableTransition);
    }
    /**
     * Move target position to given point.
     * @param x x coord to move center position
     * @param y y coord to move center position
     * @param z z coord to move center position
     * @param enableTransition Whether to move smoothly or immediately
     * @category Methods
     */
    moveTo(x, y, z, enableTransition = false) {
        const offset = _v3A.set(x, y, z).sub(this._targetEnd);
        this._encloseToBoundary(this._targetEnd, offset, this.boundaryFriction);
        this._needsUpdate = true;
        if (!enableTransition) {
            this._target.copy(this._targetEnd);
        }
        const resolveImmediately = !enableTransition ||
            approxEquals(this._target.x, this._targetEnd.x, this.restThreshold) &&
                approxEquals(this._target.y, this._targetEnd.y, this.restThreshold) &&
                approxEquals(this._target.z, this._targetEnd.z, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * Fit the viewport to the box or the bounding box of the object, using the nearest axis. paddings are in unit.
     * set `cover: true` to fill enter screen.
     * e.g.
     * ```
     * cameraControls.fitToBox( myMesh );
     * ```
     * @param box3OrObject Axis aligned bounding box to fit the view.
     * @param enableTransition Whether to move smoothly or immediately.
     * @param options | `<object>` { cover: boolean, paddingTop: number, paddingLeft: number, paddingBottom: number, paddingRight: number }
     * @returns Transition end promise
     * @category Methods
     */
    fitToBox(box3OrObject, enableTransition, { cover = false, paddingLeft = 0, paddingRight = 0, paddingBottom = 0, paddingTop = 0 } = {}) {
        const promises = [];
        const aabb = box3OrObject.isBox3
            ? _box3A.copy(box3OrObject)
            : _box3A.setFromObject(box3OrObject);
        if (aabb.isEmpty()) {
            console.warn('camera-controls: fitTo() cannot be used with an empty box. Aborting');
            Promise.resolve();
        }
        // round to closest axis ( forward | backward | right | left | top | bottom )
        const theta = roundToStep(this._sphericalEnd.theta, PI_HALF);
        const phi = roundToStep(this._sphericalEnd.phi, PI_HALF);
        promises.push(this.rotateTo(theta, phi, enableTransition));
        const normal = _v3A.setFromSpherical(this._sphericalEnd).normalize();
        const rotation = _quaternionA.setFromUnitVectors(normal, _AXIS_Z).multiply(this._yAxisUpSpaceInverse);
        const viewFromPolar = approxEquals(Math.abs(normal.y), 1);
        if (viewFromPolar) {
            rotation.multiply(_quaternionB.setFromAxisAngle(_AXIS_Y, theta));
        }
        // make oriented bounding box
        const bb = _box3B.makeEmpty();
        // left bottom back corner
        _v3B.copy(aabb.min).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // right bottom back corner
        _v3B.copy(aabb.min).setX(aabb.max.x).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // left top back corner
        _v3B.copy(aabb.min).setY(aabb.max.y).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // right top back corner
        _v3B.copy(aabb.max).setZ(aabb.min.z).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // left bottom front corner
        _v3B.copy(aabb.min).setZ(aabb.max.z).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // right bottom front corner
        _v3B.copy(aabb.max).setY(aabb.min.y).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // left top front corner
        _v3B.copy(aabb.max).setX(aabb.min.x).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // right top front corner
        _v3B.copy(aabb.max).applyQuaternion(rotation);
        bb.expandByPoint(_v3B);
        // add padding
        bb.min.x -= paddingLeft;
        bb.min.y -= paddingBottom;
        bb.max.x += paddingRight;
        bb.max.y += paddingTop;
        rotation.setFromUnitVectors(_AXIS_Z, normal).multiply(this._yAxisUpSpace);
        const bbSize = bb.getSize(_v3A);
        const center = bb.getCenter(_v3B).applyQuaternion(rotation);
        if (isPerspectiveCamera(this._camera)) {
            const distance = this.getDistanceToFitBox(bbSize.x, bbSize.y, bbSize.z, cover);
            promises.push(this.moveTo(center.x, center.y, center.z, enableTransition));
            promises.push(this.dollyTo(distance, enableTransition));
            promises.push(this.setFocalOffset(0, 0, 0, enableTransition));
        }
        else if (isOrthographicCamera(this._camera)) {
            const camera = this._camera;
            const width = camera.right - camera.left;
            const height = camera.top - camera.bottom;
            const zoom = cover ? Math.max(width / bbSize.x, height / bbSize.y) : Math.min(width / bbSize.x, height / bbSize.y);
            promises.push(this.moveTo(center.x, center.y, center.z, enableTransition));
            promises.push(this.zoomTo(zoom, enableTransition));
            promises.push(this.setFocalOffset(0, 0, 0, enableTransition));
        }
        return Promise.all(promises);
    }
    /**
     * Fit the viewport to the sphere or the bounding sphere of the object.
     * @param sphereOrMesh
     * @param enableTransition
     * @category Methods
     */
    fitToSphere(sphereOrMesh, enableTransition) {
        const promises = [];
        const isSphere = sphereOrMesh instanceof THREE.Sphere;
        const boundingSphere = isSphere ?
            _sphere.copy(sphereOrMesh) :
            createBoundingSphere(sphereOrMesh, _sphere);
        promises.push(this.moveTo(boundingSphere.center.x, boundingSphere.center.y, boundingSphere.center.z, enableTransition));
        if (isPerspectiveCamera(this._camera)) {
            const distanceToFit = this.getDistanceToFitSphere(boundingSphere.radius);
            promises.push(this.dollyTo(distanceToFit, enableTransition));
        }
        else if (isOrthographicCamera(this._camera)) {
            const width = this._camera.right - this._camera.left;
            const height = this._camera.top - this._camera.bottom;
            const diameter = 2 * boundingSphere.radius;
            const zoom = Math.min(width / diameter, height / diameter);
            promises.push(this.zoomTo(zoom, enableTransition));
        }
        promises.push(this.setFocalOffset(0, 0, 0, enableTransition));
        return Promise.all(promises);
    }
    /**
     * Make an orbit with given points.
     * @param positionX
     * @param positionY
     * @param positionZ
     * @param targetX
     * @param targetY
     * @param targetZ
     * @param enableTransition
     * @category Methods
     */
    setLookAt(positionX, positionY, positionZ, targetX, targetY, targetZ, enableTransition = false) {
        const target = _v3B.set(targetX, targetY, targetZ);
        const position = _v3A.set(positionX, positionY, positionZ);
        this._targetEnd.copy(target);
        this._sphericalEnd.setFromVector3(position.sub(target).applyQuaternion(this._yAxisUpSpace));
        this.normalizeRotations();
        this._needsUpdate = true;
        if (!enableTransition) {
            this._target.copy(this._targetEnd);
            this._spherical.copy(this._sphericalEnd);
        }
        const resolveImmediately = !enableTransition ||
            approxEquals(this._target.x, this._targetEnd.x, this.restThreshold) &&
                approxEquals(this._target.y, this._targetEnd.y, this.restThreshold) &&
                approxEquals(this._target.z, this._targetEnd.z, this.restThreshold) &&
                approxEquals(this._spherical.theta, this._sphericalEnd.theta, this.restThreshold) &&
                approxEquals(this._spherical.phi, this._sphericalEnd.phi, this.restThreshold) &&
                approxEquals(this._spherical.radius, this._sphericalEnd.radius, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * Similar to setLookAt, but it interpolates between two states.
     * @param positionAX
     * @param positionAY
     * @param positionAZ
     * @param targetAX
     * @param targetAY
     * @param targetAZ
     * @param positionBX
     * @param positionBY
     * @param positionBZ
     * @param targetBX
     * @param targetBY
     * @param targetBZ
     * @param t
     * @param enableTransition
     * @category Methods
     */
    lerpLookAt(positionAX, positionAY, positionAZ, targetAX, targetAY, targetAZ, positionBX, positionBY, positionBZ, targetBX, targetBY, targetBZ, t, enableTransition = false) {
        const targetA = _v3A.set(targetAX, targetAY, targetAZ);
        const positionA = _v3B.set(positionAX, positionAY, positionAZ);
        _sphericalA.setFromVector3(positionA.sub(targetA).applyQuaternion(this._yAxisUpSpace));
        const targetB = _v3C.set(targetBX, targetBY, targetBZ);
        const positionB = _v3B.set(positionBX, positionBY, positionBZ);
        _sphericalB.setFromVector3(positionB.sub(targetB).applyQuaternion(this._yAxisUpSpace));
        this._targetEnd.copy(targetA.lerp(targetB, t)); // tricky
        const deltaTheta = _sphericalB.theta - _sphericalA.theta;
        const deltaPhi = _sphericalB.phi - _sphericalA.phi;
        const deltaRadius = _sphericalB.radius - _sphericalA.radius;
        this._sphericalEnd.set(_sphericalA.radius + deltaRadius * t, _sphericalA.phi + deltaPhi * t, _sphericalA.theta + deltaTheta * t);
        this.normalizeRotations();
        this._needsUpdate = true;
        if (!enableTransition) {
            this._target.copy(this._targetEnd);
            this._spherical.copy(this._sphericalEnd);
        }
        const resolveImmediately = !enableTransition ||
            approxEquals(this._target.x, this._targetEnd.x, this.restThreshold) &&
                approxEquals(this._target.y, this._targetEnd.y, this.restThreshold) &&
                approxEquals(this._target.z, this._targetEnd.z, this.restThreshold) &&
                approxEquals(this._spherical.theta, this._sphericalEnd.theta, this.restThreshold) &&
                approxEquals(this._spherical.phi, this._sphericalEnd.phi, this.restThreshold) &&
                approxEquals(this._spherical.radius, this._sphericalEnd.radius, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * setLookAt without target, keep gazing at the current target
     * @param positionX
     * @param positionY
     * @param positionZ
     * @param enableTransition
     * @category Methods
     */
    setPosition(positionX, positionY, positionZ, enableTransition = false) {
        return this.setLookAt(positionX, positionY, positionZ, this._targetEnd.x, this._targetEnd.y, this._targetEnd.z, enableTransition);
    }
    /**
     * setLookAt without position, Stay still at the position.
     * @param targetX
     * @param targetY
     * @param targetZ
     * @param enableTransition
     * @category Methods
     */
    setTarget(targetX, targetY, targetZ, enableTransition = false) {
        const pos = this.getPosition(_v3A);
        return this.setLookAt(pos.x, pos.y, pos.z, targetX, targetY, targetZ, enableTransition);
    }
    /**
     * Set focal offset using the screen parallel coordinates. z doesn't affect in Orthographic as with Dolly.
     * @param x
     * @param y
     * @param z
     * @param enableTransition
     * @category Methods
     */
    setFocalOffset(x, y, z, enableTransition = false) {
        this._focalOffsetEnd.set(x, y, z);
        this._needsUpdate = true;
        if (!enableTransition) {
            this._focalOffset.copy(this._focalOffsetEnd);
        }
        const resolveImmediately = !enableTransition ||
            approxEquals(this._focalOffset.x, this._focalOffsetEnd.x, this.restThreshold) &&
                approxEquals(this._focalOffset.y, this._focalOffsetEnd.y, this.restThreshold) &&
                approxEquals(this._focalOffset.z, this._focalOffsetEnd.z, this.restThreshold);
        return this._createOnRestPromise(resolveImmediately);
    }
    /**
     * Set orbit point without moving the camera.
     * @param targetX
     * @param targetY
     * @param targetZ
     * @category Methods
     */
    setOrbitPoint(targetX, targetY, targetZ) {
        _xColumn.setFromMatrixColumn(this._camera.matrixWorldInverse, 0);
        _yColumn.setFromMatrixColumn(this._camera.matrixWorldInverse, 1);
        _zColumn.setFromMatrixColumn(this._camera.matrixWorldInverse, 2);
        const position = _v3A.set(targetX, targetY, targetZ);
        const distance = position.distanceTo(this._camera.position);
        const cameraToPoint = position.sub(this._camera.position);
        _xColumn.multiplyScalar(cameraToPoint.x);
        _yColumn.multiplyScalar(cameraToPoint.y);
        _zColumn.multiplyScalar(cameraToPoint.z);
        _v3A.copy(_xColumn).add(_yColumn).add(_zColumn);
        _v3A.z = _v3A.z + distance;
        this.dollyTo(distance, false);
        this.setFocalOffset(-_v3A.x, _v3A.y, -_v3A.z, false);
        this.moveTo(targetX, targetY, targetZ, false);
    }
    /**
     * Set the boundary box that encloses the target of the camera. box3 is in THREE.Box3
     * @param box3
     * @category Methods
     */
    setBoundary(box3) {
        if (!box3) {
            this._boundary.min.set(-Infinity, -Infinity, -Infinity);
            this._boundary.max.set(Infinity, Infinity, Infinity);
            this._needsUpdate = true;
            return;
        }
        this._boundary.copy(box3);
        this._boundary.clampPoint(this._targetEnd, this._targetEnd);
        this._needsUpdate = true;
    }
    /**
     * Set (or unset) the current viewport.
     * Set this when you want to use renderer viewport and .dollyToCursor feature at the same time.
     * @param viewportOrX
     * @param y
     * @param width
     * @param height
     * @category Methods
     */
    setViewport(viewportOrX, y, width, height) {
        if (viewportOrX === null) { // null
            this._viewport = null;
            return;
        }
        this._viewport = this._viewport || new THREE.Vector4();
        if (typeof viewportOrX === 'number') { // number
            this._viewport.set(viewportOrX, y, width, height);
        }
        else { // Vector4
            this._viewport.copy(viewportOrX);
        }
    }
    /**
     * Calculate the distance to fit the box.
     * @param width box width
     * @param height box height
     * @param depth box depth
     * @returns distance
     * @category Methods
     */
    getDistanceToFitBox(width, height, depth, cover = false) {
        if (notSupportedInOrthographicCamera(this._camera, 'getDistanceToFitBox'))
            return this._spherical.radius;
        const boundingRectAspect = width / height;
        const fov = this._camera.getEffectiveFOV() * THREE.MathUtils.DEG2RAD;
        const aspect = this._camera.aspect;
        const heightToFit = (cover ? boundingRectAspect > aspect : boundingRectAspect < aspect) ? height : width / aspect;
        return heightToFit * 0.5 / Math.tan(fov * 0.5) + depth * 0.5;
    }
    /**
     * Calculate the distance to fit the sphere.
     * @param radius sphere radius
     * @returns distance
     * @category Methods
     */
    getDistanceToFitSphere(radius) {
        if (notSupportedInOrthographicCamera(this._camera, 'getDistanceToFitSphere'))
            return this._spherical.radius;
        // https://stackoverflow.com/a/44849975
        const vFOV = this._camera.getEffectiveFOV() * THREE.MathUtils.DEG2RAD;
        const hFOV = Math.atan(Math.tan(vFOV * 0.5) * this._camera.aspect) * 2;
        const fov = 1 < this._camera.aspect ? vFOV : hFOV;
        return radius / (Math.sin(fov * 0.5));
    }
    /**
     * Returns its current gazing target, which is the center position of the orbit.
     * @param out current gazing target
     * @category Methods
     */
    getTarget(out) {
        const _out = !!out && out.isVector3 ? out : new THREE.Vector3();
        return _out.copy(this._targetEnd);
    }
    /**
     * Returns its current position.
     * @param out current position
     * @category Methods
     */
    getPosition(out) {
        const _out = !!out && out.isVector3 ? out : new THREE.Vector3();
        return _out.setFromSpherical(this._sphericalEnd).applyQuaternion(this._yAxisUpSpaceInverse).add(this._targetEnd);
    }
    /**
     * Returns its current focal offset, which is how much the camera appears to be translated in screen parallel coordinates.
     * @param out current focal offset
     * @category Methods
     */
    getFocalOffset(out) {
        const _out = !!out && out.isVector3 ? out : new THREE.Vector3();
        return _out.copy(this._focalOffsetEnd);
    }
    /**
     * Normalize camera azimuth angle rotation between 0 and 360 degrees.
     * @category Methods
     */
    normalizeRotations() {
        this._sphericalEnd.theta = this._sphericalEnd.theta % PI_2;
        if (this._sphericalEnd.theta < 0)
            this._sphericalEnd.theta += PI_2;
        this._spherical.theta += PI_2 * Math.round((this._sphericalEnd.theta - this._spherical.theta) / PI_2);
    }
    /**
     * Reset all rotation and position to defaults.
     * @param enableTransition
     * @category Methods
     */
    reset(enableTransition = false) {
        const promises = [
            this.setLookAt(this._position0.x, this._position0.y, this._position0.z, this._target0.x, this._target0.y, this._target0.z, enableTransition),
            this.setFocalOffset(this._focalOffset0.x, this._focalOffset0.y, this._focalOffset0.z, enableTransition),
            this.zoomTo(this._zoom0, enableTransition),
        ];
        return Promise.all(promises);
    }
    /**
     * Set current camera position as the default position.
     * @category Methods
     */
    saveState() {
        this._target0.copy(this._target);
        this._position0.copy(this._camera.position);
        this._zoom0 = this._zoom;
    }
    /**
     * Sync camera-up direction.
     * When camera-up vector is changed, `.updateCameraUp()` must be called.
     * @category Methods
     */
    updateCameraUp() {
        this._yAxisUpSpace.setFromUnitVectors(this._camera.up, _AXIS_Y);
        quatInvertCompat(this._yAxisUpSpaceInverse.copy(this._yAxisUpSpace));
    }
    /**
     * Update camera position and directions.
     * This should be called in your tick loop every time, and returns true if re-rendering is needed.
     * @param delta
     * @returns updated
     * @category Methods
     */
    update(delta) {
        const dampingFactor = this._state === ACTION.NONE ? this.dampingFactor : this.draggingDampingFactor;
        // The original THREE.OrbitControls assume 60 FPS fixed and does NOT rely on delta time.
        // (that must be a problem of the original one though)
        // To to emulate the speed of the original one under 60 FPS, multiply `60` to delta,
        // but ours are more flexible to any FPS unlike the original.
        const lerpRatio = Math.min(dampingFactor * delta * 60, 1);
        const deltaTheta = this._sphericalEnd.theta - this._spherical.theta;
        const deltaPhi = this._sphericalEnd.phi - this._spherical.phi;
        const deltaRadius = this._sphericalEnd.radius - this._spherical.radius;
        const deltaTarget = _deltaTarget.subVectors(this._targetEnd, this._target);
        const deltaOffset = _deltaOffset.subVectors(this._focalOffsetEnd, this._focalOffset);
        if (!approxZero(deltaTheta) ||
            !approxZero(deltaPhi) ||
            !approxZero(deltaRadius) ||
            !approxZero(deltaTarget.x) ||
            !approxZero(deltaTarget.y) ||
            !approxZero(deltaTarget.z) ||
            !approxZero(deltaOffset.x) ||
            !approxZero(deltaOffset.y) ||
            !approxZero(deltaOffset.z)) {
            this._spherical.set(this._spherical.radius + deltaRadius * lerpRatio, this._spherical.phi + deltaPhi * lerpRatio, this._spherical.theta + deltaTheta * lerpRatio);
            this._target.add(deltaTarget.multiplyScalar(lerpRatio));
            this._focalOffset.add(deltaOffset.multiplyScalar(lerpRatio));
            this._needsUpdate = true;
        }
        else {
            this._spherical.copy(this._sphericalEnd);
            this._target.copy(this._targetEnd);
            this._focalOffset.copy(this._focalOffsetEnd);
        }
        if (this._dollyControlAmount !== 0) {
            if (isPerspectiveCamera(this._camera)) {
                const camera = this._camera;
                const direction = _v3A.setFromSpherical(this._sphericalEnd).applyQuaternion(this._yAxisUpSpaceInverse).normalize().negate();
                const planeX = _v3B.copy(direction).cross(camera.up).normalize();
                if (planeX.lengthSq() === 0)
                    planeX.x = 1.0;
                const planeY = _v3C.crossVectors(planeX, direction);
                const worldToScreen = this._sphericalEnd.radius * Math.tan(camera.getEffectiveFOV() * THREE.MathUtils.DEG2RAD * 0.5);
                const prevRadius = this._sphericalEnd.radius - this._dollyControlAmount;
                const lerpRatio = (prevRadius - this._sphericalEnd.radius) / this._sphericalEnd.radius;
                const cursor = _v3A.copy(this._targetEnd)
                    .add(planeX.multiplyScalar(this._dollyControlCoord.x * worldToScreen * camera.aspect))
                    .add(planeY.multiplyScalar(this._dollyControlCoord.y * worldToScreen));
                this._targetEnd.lerp(cursor, lerpRatio);
                this._target.copy(this._targetEnd);
            }
            else if (isOrthographicCamera(this._camera)) {
                const camera = this._camera;
                const worldPosition = _v3A.set(this._dollyControlCoord.x, this._dollyControlCoord.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera);
                const quaternion = _v3B.set(0, 0, -1).applyQuaternion(camera.quaternion);
                const divisor = quaternion.dot(camera.up);
                const distance = approxZero(divisor) ? -worldPosition.dot(camera.up) : -worldPosition.dot(camera.up) / divisor;
                const cursor = _v3C.copy(worldPosition).add(quaternion.multiplyScalar(distance));
                this._targetEnd.lerp(cursor, 1 - camera.zoom / this._dollyControlAmount);
                this._target.copy(this._targetEnd);
            }
            this._dollyControlAmount = 0;
        }
        const maxDistance = this._collisionTest();
        this._spherical.radius = Math.min(this._spherical.radius, maxDistance);
        // decompose spherical to the camera position
        this._spherical.makeSafe();
        this._camera.position.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse).add(this._target);
        this._camera.lookAt(this._target);
        // set offset after the orbit movement
        const affectOffset = !approxZero(this._focalOffset.x) ||
            !approxZero(this._focalOffset.y) ||
            !approxZero(this._focalOffset.z);
        if (affectOffset) {
            this._camera.updateMatrix();
            _xColumn.setFromMatrixColumn(this._camera.matrix, 0);
            _yColumn.setFromMatrixColumn(this._camera.matrix, 1);
            _zColumn.setFromMatrixColumn(this._camera.matrix, 2);
            _xColumn.multiplyScalar(this._focalOffset.x);
            _yColumn.multiplyScalar(-this._focalOffset.y);
            _zColumn.multiplyScalar(this._focalOffset.z); // notice: z-offset will not affect in Orthographic.
            _v3A.copy(_xColumn).add(_yColumn).add(_zColumn);
            this._camera.position.add(_v3A);
        }
        if (this._boundaryEnclosesCamera) {
            this._encloseToBoundary(this._camera.position.copy(this._target), _v3A.setFromSpherical(this._spherical).applyQuaternion(this._yAxisUpSpaceInverse), 1.0);
        }
        // zoom
        const deltaZoom = this._zoomEnd - this._zoom;
        this._zoom += deltaZoom * lerpRatio;
        if (this._camera.zoom !== this._zoom) {
            if (approxZero(deltaZoom))
                this._zoom = this._zoomEnd;
            this._camera.zoom = this._zoom;
            this._camera.updateProjectionMatrix();
            this._updateNearPlaneCorners();
            this._needsUpdate = true;
        }
        const updated = this._needsUpdate;
        if (updated && !this._updatedLastTime) {
            this._hasRested = false;
            this.dispatchEvent({ type: 'wake' });
            this.dispatchEvent({ type: 'update' });
        }
        else if (updated) {
            this.dispatchEvent({ type: 'update' });
            if (approxZero(deltaTheta, this.restThreshold) &&
                approxZero(deltaPhi, this.restThreshold) &&
                approxZero(deltaRadius, this.restThreshold) &&
                approxZero(deltaTarget.x, this.restThreshold) &&
                approxZero(deltaTarget.y, this.restThreshold) &&
                approxZero(deltaTarget.z, this.restThreshold) &&
                approxZero(deltaOffset.x, this.restThreshold) &&
                approxZero(deltaOffset.y, this.restThreshold) &&
                approxZero(deltaOffset.z, this.restThreshold) &&
                approxZero(deltaZoom, this.restThreshold) &&
                !this._hasRested) {
                this._hasRested = true;
                this.dispatchEvent({ type: 'rest' });
            }
        }
        else if (!updated && this._updatedLastTime) {
            this.dispatchEvent({ type: 'sleep' });
        }
        this._updatedLastTime = updated;
        this._needsUpdate = false;
        return updated;
    }
    /**
     * Get all state in JSON string
     * @category Methods
     */
    toJSON() {
        return JSON.stringify({
            enabled: this._enabled,
            minDistance: this.minDistance,
            maxDistance: infinityToMaxNumber(this.maxDistance),
            minZoom: this.minZoom,
            maxZoom: infinityToMaxNumber(this.maxZoom),
            minPolarAngle: this.minPolarAngle,
            maxPolarAngle: infinityToMaxNumber(this.maxPolarAngle),
            minAzimuthAngle: infinityToMaxNumber(this.minAzimuthAngle),
            maxAzimuthAngle: infinityToMaxNumber(this.maxAzimuthAngle),
            dampingFactor: this.dampingFactor,
            draggingDampingFactor: this.draggingDampingFactor,
            dollySpeed: this.dollySpeed,
            truckSpeed: this.truckSpeed,
            dollyToCursor: this.dollyToCursor,
            verticalDragToForward: this.verticalDragToForward,
            target: this._targetEnd.toArray(),
            position: _v3A.setFromSpherical(this._sphericalEnd).add(this._targetEnd).toArray(),
            zoom: this._zoomEnd,
            focalOffset: this._focalOffsetEnd.toArray(),
            target0: this._target0.toArray(),
            position0: this._position0.toArray(),
            zoom0: this._zoom0,
            focalOffset0: this._focalOffset0.toArray(),
        });
    }
    /**
     * Reproduce the control state with JSON. enableTransition is where anim or not in a boolean.
     * @param json
     * @param enableTransition
     * @category Methods
     */
    fromJSON(json, enableTransition = false) {
        const obj = JSON.parse(json);
        const position = _v3A.fromArray(obj.position);
        this.enabled = obj.enabled;
        this.minDistance = obj.minDistance;
        this.maxDistance = maxNumberToInfinity(obj.maxDistance);
        this.minZoom = obj.minZoom;
        this.maxZoom = maxNumberToInfinity(obj.maxZoom);
        this.minPolarAngle = obj.minPolarAngle;
        this.maxPolarAngle = maxNumberToInfinity(obj.maxPolarAngle);
        this.minAzimuthAngle = maxNumberToInfinity(obj.minAzimuthAngle);
        this.maxAzimuthAngle = maxNumberToInfinity(obj.maxAzimuthAngle);
        this.dampingFactor = obj.dampingFactor;
        this.draggingDampingFactor = obj.draggingDampingFactor;
        this.dollySpeed = obj.dollySpeed;
        this.truckSpeed = obj.truckSpeed;
        this.dollyToCursor = obj.dollyToCursor;
        this.verticalDragToForward = obj.verticalDragToForward;
        this._target0.fromArray(obj.target0);
        this._position0.fromArray(obj.position0);
        this._zoom0 = obj.zoom0;
        this._focalOffset0.fromArray(obj.focalOffset0);
        this.moveTo(obj.target[0], obj.target[1], obj.target[2], enableTransition);
        _sphericalA.setFromVector3(position.sub(this._targetEnd).applyQuaternion(this._yAxisUpSpace));
        this.rotateTo(_sphericalA.theta, _sphericalA.phi, enableTransition);
        this.zoomTo(obj.zoom, enableTransition);
        this.setFocalOffset(obj.focalOffset[0], obj.focalOffset[1], obj.focalOffset[2], enableTransition);
        this._needsUpdate = true;
    }
    /**
     * Dispose the cameraControls instance itself, remove all eventListeners.
     * @category Methods
     */
    dispose() {
        this._removeAllEventListeners();
    }
    _findPointerById(pointerId) {
        // to support IE11 use some instead of Array#find (will be removed when IE11 is deprecated)
        let pointer = null;
        this._activePointers.some((activePointer) => {
            if (activePointer.pointerId === pointerId) {
                pointer = activePointer;
                return true;
            }
            return false;
        });
        return pointer;
    }
    _encloseToBoundary(position, offset, friction) {
        const offsetLength2 = offset.lengthSq();
        if (offsetLength2 === 0.0) { // sanity check
            return position;
        }
        // See: https://twitter.com/FMS_Cat/status/1106508958640988161
        const newTarget = _v3B.copy(offset).add(position); // target
        const clampedTarget = this._boundary.clampPoint(newTarget, _v3C); // clamped target
        const deltaClampedTarget = clampedTarget.sub(newTarget); // newTarget -> clampedTarget
        const deltaClampedTargetLength2 = deltaClampedTarget.lengthSq(); // squared length of deltaClampedTarget
        if (deltaClampedTargetLength2 === 0.0) { // when the position doesn't have to be clamped
            return position.add(offset);
        }
        else if (deltaClampedTargetLength2 === offsetLength2) { // when the position is completely stuck
            return position;
        }
        else if (friction === 0.0) {
            return position.add(offset).add(deltaClampedTarget);
        }
        else {
            const offsetFactor = 1.0 + friction * deltaClampedTargetLength2 / offset.dot(deltaClampedTarget);
            return position
                .add(_v3B.copy(offset).multiplyScalar(offsetFactor))
                .add(deltaClampedTarget.multiplyScalar(1.0 - friction));
        }
    }
    _updateNearPlaneCorners() {
        if (isPerspectiveCamera(this._camera)) {
            const camera = this._camera;
            const near = camera.near;
            const fov = camera.getEffectiveFOV() * THREE.MathUtils.DEG2RAD;
            const heightHalf = Math.tan(fov * 0.5) * near; // near plain half height
            const widthHalf = heightHalf * camera.aspect; // near plain half width
            this._nearPlaneCorners[0].set(-widthHalf, -heightHalf, 0);
            this._nearPlaneCorners[1].set(widthHalf, -heightHalf, 0);
            this._nearPlaneCorners[2].set(widthHalf, heightHalf, 0);
            this._nearPlaneCorners[3].set(-widthHalf, heightHalf, 0);
        }
        else if (isOrthographicCamera(this._camera)) {
            const camera = this._camera;
            const zoomInv = 1 / camera.zoom;
            const left = camera.left * zoomInv;
            const right = camera.right * zoomInv;
            const top = camera.top * zoomInv;
            const bottom = camera.bottom * zoomInv;
            this._nearPlaneCorners[0].set(left, top, 0);
            this._nearPlaneCorners[1].set(right, top, 0);
            this._nearPlaneCorners[2].set(right, bottom, 0);
            this._nearPlaneCorners[3].set(left, bottom, 0);
        }
    }
    // lateUpdate
    _collisionTest() {
        let distance = Infinity;
        const hasCollider = this.colliderMeshes.length >= 1;
        if (!hasCollider)
            return distance;
        if (notSupportedInOrthographicCamera(this._camera, '_collisionTest'))
            return distance;
        // divide by distance to normalize, lighter than `Vector3.prototype.normalize()`
        const direction = _v3A.setFromSpherical(this._spherical).divideScalar(this._spherical.radius);
        _rotationMatrix.lookAt(_ORIGIN, direction, this._camera.up);
        for (let i = 0; i < 4; i++) {
            const nearPlaneCorner = _v3B.copy(this._nearPlaneCorners[i]);
            nearPlaneCorner.applyMatrix4(_rotationMatrix);
            const origin = _v3C.addVectors(this._target, nearPlaneCorner);
            _raycaster.set(origin, direction);
            _raycaster.far = this._spherical.radius + 1;
            const intersects = _raycaster.intersectObjects(this.colliderMeshes);
            if (intersects.length !== 0 && intersects[0].distance < distance) {
                distance = intersects[0].distance;
            }
        }
        return distance;
    }
    /**
     * Get its client rect and package into given `DOMRect` .
     */
    _getClientRect(target) {
        const rect = this._domElement.getBoundingClientRect();
        target.x = rect.left;
        target.y = rect.top;
        if (this._viewport) {
            target.x += this._viewport.x;
            target.y += rect.height - this._viewport.w - this._viewport.y;
            target.width = this._viewport.z;
            target.height = this._viewport.w;
        }
        else {
            target.width = rect.width;
            target.height = rect.height;
        }
        return target;
    }
    _createOnRestPromise(resolveImmediately) {
        if (resolveImmediately)
            return Promise.resolve();
        this._hasRested = false;
        this.dispatchEvent({ type: 'transitionstart' });
        return new Promise((resolve) => {
            const onResolve = () => {
                this.removeEventListener('rest', onResolve);
                resolve();
            };
            this.addEventListener('rest', onResolve);
        });
    }
    _removeAllEventListeners() { }
}
function createBoundingSphere(object3d, out) {
    const boundingSphere = out;
    const center = boundingSphere.center;
    _box3A.makeEmpty();
    // find the center
    object3d.traverseVisible((object) => {
        if (!object.isMesh)
            return;
        _box3A.expandByObject(object);
    });
    _box3A.getCenter(center);
    // find the radius
    let maxRadiusSq = 0;
    object3d.traverseVisible((object) => {
        if (!object.isMesh)
            return;
        const mesh = object;
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        if (geometry.isBufferGeometry) {
            const bufferGeometry = geometry;
            const position = bufferGeometry.attributes.position;
            for (let i = 0, l = position.count; i < l; i++) {
                _v3A.fromBufferAttribute(position, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_v3A));
            }
        }
        else {
            // for old three.js, which supports both BufferGeometry and Geometry
            // this condition block will be removed in the near future.
            const position = geometry.attributes.position;
            const vector = new THREE.Vector3();
            for (let i = 0, l = position.count; i < l; i++) {
                vector.fromBufferAttribute(position, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
            }
        }
    });
    boundingSphere.radius = Math.sqrt(maxRadiusSq);
    return boundingSphere;
}

/**
 * A basic camera that uses
 * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to
 * easily control the camera in 2D and 3D. Check out it's API to find out
 * what features it offers.
 */
class SimpleCamera extends Component {
    constructor(components) {
        super();
        this.components = components;
        /** {@link Component.name} */
        this.name = "SimpleCamera";
        /** {@link Updateable.beforeUpdate} */
        this.beforeUpdate = new Event();
        /** {@link Updateable.afterUpdate} */
        this.afterUpdate = new Event();
        this._perspectiveCamera = this.setupCamera();
        this.activeCamera = this._perspectiveCamera;
        this.controls = this.setupCameraControls();
        const scene = components.scene.get();
        scene.add(this._perspectiveCamera);
        this.setupEvents();
    }
    /** {@link Component.enabled} */
    get enabled() {
        return this.controls.enabled;
    }
    /** {@link Component.enabled} */
    set enabled(enabled) {
        this.controls.enabled = enabled;
    }
    /** {@link Component.get} */
    get() {
        return this.activeCamera;
    }
    /** {@link Disposable.dispose} */
    dispose() {
        this.enabled = false;
        this.beforeUpdate.reset();
        this.afterUpdate.reset();
        this._perspectiveCamera.removeFromParent();
        this.controls.dispose();
    }
    /** {@link Updateable.update} */
    update(_delta) {
        if (this.enabled) {
            this.beforeUpdate.trigger(this);
            this.controls.update(_delta);
            this.afterUpdate.trigger(this);
        }
    }
    /**
     * Updates the aspect of the camera to match the size of the
     * {@link Components.renderer}.
     */
    updateAspect() {
        if (this.components.renderer.isResizeable()) {
            const size = this.components.renderer.getSize();
            this._perspectiveCamera.aspect = size.width / size.height;
            this._perspectiveCamera.updateProjectionMatrix();
        }
    }
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE$1.PerspectiveCamera(60, aspect, 1, 1000);
        camera.position.set(50, 50, 50);
        camera.lookAt(new THREE$1.Vector3(0, 0, 0));
        return camera;
    }
    setupCameraControls() {
        CameraControls.install({ THREE: SimpleCamera.getSubsetOfThree() });
        const dom = this.components.renderer.get().domElement;
        const controls = new CameraControls(this._perspectiveCamera, dom);
        controls.dampingFactor = 0.2;
        controls.dollyToCursor = true;
        controls.infinityDolly = true;
        controls.setTarget(0, 0, 0);
        return controls;
    }
    setupEvents() {
        window.addEventListener("resize", () => {
            this.updateAspect();
        });
    }
    static getSubsetOfThree() {
        return {
            MOUSE: THREE$1.MOUSE,
            Vector2: THREE$1.Vector2,
            Vector3: THREE$1.Vector3,
            Vector4: THREE$1.Vector4,
            Quaternion: THREE$1.Quaternion,
            Matrix4: THREE$1.Matrix4,
            Spherical: THREE$1.Spherical,
            Box3: THREE$1.Box3,
            Sphere: THREE$1.Sphere,
            Raycaster: THREE$1.Raycaster,
            MathUtils: THREE$1.MathUtils,
        };
    }
}

/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
 * that allows to easily get items from the scene using the mouse and touch
 * events.
 */
class SimpleRaycaster extends Component {
    constructor(components) {
        super();
        this.components = components;
        /** {@link Component.name} */
        this.name = "SimpleRaycaster";
        /** {@link Component.enabled} */
        this.enabled = true;
        this._raycaster = new THREE$1.Raycaster();
        const scene = components.renderer.get();
        const dom = scene.domElement;
        this._mouse = new Mouse(dom);
    }
    /** {@link Component.get} */
    get() {
        return this._raycaster;
    }
    /**
     * Throws a ray from the camera to the mouse or touch event point and returns
     * the first item found. This also takes into account the clipping planes
     * used by the renderer.
     *
     * @param items - the [meshes](https://threejs.org/docs/#api/en/objects/Mesh)
     * to query. If not provided, it will query all the meshes stored in
     * {@link Components.meshes}.
     */
    castRay(items = this.components.meshes) {
        const camera = this.components.camera.get();
        this._raycaster.setFromCamera(this._mouse.position, camera);
        const result = this._raycaster.intersectObjects(items);
        const filtered = this.filterClippingPlanes(result);
        return filtered.length > 0 ? filtered[0] : null;
    }
    filterClippingPlanes(objs) {
        const renderer = this.components.renderer;
        if (!renderer.clippingPlanes) {
            return objs;
        }
        const planes = renderer.clippingPlanes;
        if (objs.length <= 0 || !planes || (planes === null || planes === void 0 ? void 0 : planes.length) <= 0)
            return objs;
        return objs.filter((elem) => planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0));
    }
}

/**
 * A basic
 * [Three.js grid helper](https://threejs.org/docs/#api/en/helpers/GridHelper).
 */
class SimpleGrid extends Component {
    constructor(components) {
        super();
        /** {@link Component.name} */
        this.name = "SimpleGrid";
        /** {@link Component.enabled} */
        this.enabled = true;
        this._disposer = new Disposer();
        this._grid = new THREE$1.GridHelper(50, 50);
        const scene = components.scene.get();
        scene.add(this._grid);
    }
    /** {@link Hideable.visible} */
    get visible() {
        return this._grid.visible;
    }
    /** {@link Hideable.visible} */
    set visible(visible) {
        this._grid.visible = visible;
    }
    /** {@link Component.get} */
    get() {
        return this._grid;
    }
    /** {@link Disposable.dispose} */
    dispose() {
        this._disposer.dispose(this._grid);
    }
}

var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Button_instances, _Button_enabled, _Button_visible, _Button_parent, _Button_popper, _Button_active, _Button_updateMenuPlacement;
class Button extends Component {
    constructor(components, options) {
        var _a, _b;
        super();
        _Button_instances.add(this);
        _Button_enabled.set(this, true);
        _Button_visible.set(this, true);
        _Button_parent.set(this, void 0);
        _Button_popper.set(this, void 0);
        _Button_active.set(this, false);
        this.components = components;
        this.name = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : "Custom Button";
        if (options === null || options === void 0 ? void 0 : options.element) {
            this.domElement = options.element;
        }
        else {
            const btn = document.createElement("button");
            btn.id = (_b = options === null || options === void 0 ? void 0 : options.materialIconName) !== null && _b !== void 0 ? _b : "";
            btn.classList.add("tooeen-button");
            this.domElement = btn;
            if (options === null || options === void 0 ? void 0 : options.materialIconName) {
                const icon = document.createElement("span");
                icon.className = "material-icons md-18";
                icon.innerText = options === null || options === void 0 ? void 0 : options.materialIconName;
                btn.append(icon);
            }
            if (options === null || options === void 0 ? void 0 : options.name) {
                const name = document.createElement("p");
                name.style.whiteSpace = "nowrap";
                name.innerText = options.name;
                this.domElement.append(name);
            }
        }
        this.domElement.onclick = (e) => {
            var _a;
            e.stopImmediatePropagation();
            // @ts-ignore
            if (!((_a = this.parent) === null || _a === void 0 ? void 0 : _a.parent) && this.components.ui) {
                this.components.ui.closeMenus();
            }
            this.menu.visible = true;
            __classPrivateFieldGet(this, _Button_popper, "f").update();
        };
        // #region Extensible menu
        this.menu = new Toolbar(components);
        this.menu.visible = false;
        this.menu.parent = this;
        this.menu.domElement.classList.add("vtoolbar");
        this.domElement.append(this.menu.domElement);
        __classPrivateFieldSet(this, _Button_popper, createPopper(this.domElement, this.menu.domElement, {
            modifiers: [
                {
                    name: "offset",
                    options: { offset: [0, 15] },
                },
                {
                    name: "preventOverflow",
                    // @ts-ignore
                    options: { boundary: this.components.ui.viewerContainer },
                },
            ],
        }), "f");
        // #endregion
    }
    get active() {
        return __classPrivateFieldGet(this, _Button_active, "f");
    }
    set active(active) {
        this.domElement.setAttribute("data-active", String(active));
        __classPrivateFieldSet(this, _Button_active, active, "f");
    }
    set visible(visible) {
        __classPrivateFieldSet(this, _Button_visible, visible, "f");
    } // Not implemented yet.
    get visible() {
        return __classPrivateFieldGet(this, _Button_visible, "f");
    }
    set enabled(enabled) {
        this.domElement.disabled = !enabled;
        __classPrivateFieldSet(this, _Button_enabled, enabled, "f");
    }
    get enabled() {
        return __classPrivateFieldGet(this, _Button_enabled, "f");
    }
    set onclick(listener) {
        this.domElement.onclick = (e) => {
            e.stopImmediatePropagation();
            listener(e);
            // @ts-ignore
            this.components.ui.closeMenus();
            // @ts-ignore
            this.components.ui.contextMenu.visible = false;
        };
    }
    set parent(toolbar) {
        __classPrivateFieldSet(this, _Button_parent, toolbar, "f");
        this.menu.position = toolbar.position;
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_updateMenuPlacement).call(this);
    }
    get parent() {
        return __classPrivateFieldGet(this, _Button_parent, "f");
    }
    get() {
        return this.domElement;
    }
    addButton(...button) {
        this.menu.addButton(...button);
    }
    closeMenus() {
        this.menu.closeMenus();
        this.menu.visible = false;
    }
}
_Button_enabled = new WeakMap(), _Button_visible = new WeakMap(), _Button_parent = new WeakMap(), _Button_popper = new WeakMap(), _Button_active = new WeakMap(), _Button_instances = new WeakSet(), _Button_updateMenuPlacement = function _Button_updateMenuPlacement() {
    var _a, _b, _c, _d, _e, _f;
    let placement = "bottom";
    if (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.position) === "bottom") {
        placement = ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.parent) ? "right" : "top";
    }
    if (((_c = this.parent) === null || _c === void 0 ? void 0 : _c.position) === "top") {
        placement = ((_d = this.parent) === null || _d === void 0 ? void 0 : _d.parent) ? "right" : "bottom";
    }
    if (((_e = this.parent) === null || _e === void 0 ? void 0 : _e.position) === "left") {
        placement = "right";
    }
    if (((_f = this.parent) === null || _f === void 0 ? void 0 : _f.position) === "right") {
        placement = "left";
    }
    __classPrivateFieldGet(this, _Button_popper, "f").setOptions({ placement });
};

export { BaseRenderer, Button, Component, Components, Disposer, Event, Mouse, SimpleCamera, SimpleGrid, SimpleRaycaster, SimpleRenderer, SimpleScene, ToolComponent, Toolbar, UIManager };
