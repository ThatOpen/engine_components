import {
	BufferGeometry,
	Vector3,
	BufferAttribute,
	Mesh,
	Scene,
} from 'three';
import { MeshBVH, SAH } from 'three-mesh-bvh';
import { isYProjectedLineDegenerate } from './utils/triangleLineUtils.js';
import { overlapsToLines } from './utils/overlapUtils.js';
import { EdgeGenerator } from './EdgeGenerator.js';
import { LineObjectsBVH } from './utils/LineObjectsBVH.js';
import { bvhcastEdges } from './utils/bvhcastEdges.js';
import { getAllMeshes } from './utils/getAllMeshes.js';
import { VisibilityCuller } from './VisibilityCuller.js';
import { Logger } from './utils/Logger.js';
import { getBvhcastEdgesWebgpu, getEdgesTrianglesGroups } from './utils/bvhcastEdgesWebgpu.js';

// these shared variables are not used across "yield" boundaries in the
// generator so there's no risk of overwriting another tasks data
const UP_VECTOR = /* @__PURE__ */ new Vector3( 0, 1, 0 );

function toLineGeometry( edges, groupIndices = null ) {

	const edgeArray = new Float32Array( edges.length * 6 );
	let c = 0;
	for ( let i = 0, l = edges.length; i < l; i ++ ) {

		const line = edges[ i ];
		edgeArray[ c ++ ] = line[ 0 ];
		edgeArray[ c ++ ] = 0;
		edgeArray[ c ++ ] = line[ 2 ];
		edgeArray[ c ++ ] = line[ 3 ];
		edgeArray[ c ++ ] = 0;
		edgeArray[ c ++ ] = line[ 5 ];

	}

	const edgeGeom = new BufferGeometry();
	const edgeBuffer = new BufferAttribute( edgeArray, 3, true );
	edgeGeom.setAttribute( 'position', edgeBuffer );

	if ( groupIndices ) {

		// two vertices per line segment, both get the same group index
		const groupArray = new Float32Array( edges.length * 2 );
		for ( let i = 0, l = groupIndices.length; i < l; i ++ ) {

			groupArray[ i * 2 ] = groupIndices[ i ];
			groupArray[ i * 2 + 1 ] = groupIndices[ i ];

		}

		edgeGeom.setAttribute( 'group', new BufferAttribute( groupArray, 1 ) );

	}

	return edgeGeom;

}

class ProjectedEdgeCollector {

	constructor( scene, useWebGPU = true ) {

		this.meshes = getAllMeshes( scene );
		this.bvhs = new Map();
		this.visibleEdges = [];
		this.hiddenEdges = [];
		this.visibleGroupIndices = [];
		this.hiddenGroupIndices = [];
		this.groupKeyToIndex = null;
		this.hasGroups = false;
		this.iterationTime = 30;
		this.useWebGPU = useWebGPU;

	}

	reset() {

		this.visibleEdges.length = 0;
		this.hiddenEdges.length = 0;
		this.visibleGroupIndices.length = 0;
		this.hiddenGroupIndices.length = 0;
		this.groupKeyToIndex = null;
		this.hasGroups = false;

	}

	getVisibleLineGeometry() {

		return toLineGeometry( this.visibleEdges, this.groupKeyToIndex ? this.visibleGroupIndices : null );

	}

	getHiddenLineGeometry() {

		return toLineGeometry( this.hiddenEdges, this.groupKeyToIndex ? this.hiddenGroupIndices : null );

	}

	getGroupKeys() {

		if ( ! this.groupKeyToIndex ) return {};
		return Object.fromEntries( this.groupKeyToIndex );

	}

	addEdges( ...args ) {

		const currIterationTime = this.iterationTime;
		this.iterationTime = Infinity;

		const result = this.addEdgesGenerator( ...args ).next().value;
		this.iterationTime = currIterationTime;

		return result;

	}

	// all edges are expected to be in world coordinates
	*addEdgesGenerator( edges, options = {} ) {

		const { meshes, bvhs, visibleEdges, hiddenEdges, iterationTime } = this;
		let time = performance.now();

		// Build mesh BVHs
		Logger.startStep( 'Building mesh BVH' );
		for ( let i = 0; i < meshes.length; i ++ ) {

			if ( performance.now() - time > iterationTime ) {

				yield;
				time = performance.now();

			}

			const mesh = meshes[ i ];
			const geometry = mesh.geometry;
			if ( ! bvhs.has( geometry ) ) {

				const bvh = geometry.boundsTree || new MeshBVH( geometry );
				bvhs.set( geometry, bvh );

			}

		}

		// Count total triangles across all meshes
		let totalTriangles = 0;
		for ( let i = 0; i < meshes.length; i ++ ) {

			const geometry = meshes[ i ].geometry;
			totalTriangles += geometry.index
				? geometry.index.count / 3
				: geometry.attributes.position.count / 3;

		}

		// initialize hidden line object
		const hiddenOverlapMap = {};
		for ( let i = 0; i < edges.length; i ++ ) {

			hiddenOverlapMap[ i ] = [];

		}

		// Build line BVH
		Logger.startStep( 'Building line BVH' );
		const edgesBvh = new LineObjectsBVH( edges, { maxLeafSize: 2, strategy: SAH } );

		// BVHcast overlaps
		Logger.startStep( 'BVHcast overlaps' );
		time = performance.now();

		const bvhStats = {
			candidates: 0,
			backFaceCulled: 0,
			yBoundsCulled: 0,
			xzBoundsCulled: 0,
			triangleEdgeCulled: 0,
			planeTrimCulled: 0,
			distThresholdCulled: 0,
			noOverlapCulled: 0,
			used: 0,
			totalEdges: edges.length,
			totalTriangles: totalTriangles,
		};
		const useWebGpu = this.useWebGPU;
		const webgpuData = {};

		if ( useWebGpu ) {

			webgpuData._edgeOffsets = [];
			webgpuData._edgeCounts = [];
			webgpuData._meshOffsets = [];
			webgpuData._meshCounts = [];
			webgpuData._meshIndex = [];
			webgpuData.groupCount = 0;

		}

		for ( let m = 0; m < meshes.length; m ++ ) {

			if ( performance.now() - time > iterationTime ) {

				if ( options.onProgress ) {

					options.onProgress( m, meshes.length );

				}

				yield;
				time = performance.now();

			}

			// use bvhcast to compare all edges against all meshes
			const mesh = meshes[ m ];
			if ( useWebGpu ) {

				// bvhcastEdges( edgesBvh, bvhs.get( mesh.geometry ), mesh, hiddenOverlapMap );
				getEdgesTrianglesGroups( edgesBvh, bvhs.get( mesh.geometry ), mesh, webgpuData, m );

			} else {

				bvhcastEdges( edgesBvh, bvhs.get( mesh.geometry ), mesh, hiddenOverlapMap, bvhStats );

			}

		}


		if ( useWebGpu ) {

			// Wait for async WebGPU computation to complete
			let webgpuFinished = false;
			getBvhcastEdgesWebgpu( webgpuData, meshes, edgesBvh, hiddenOverlapMap, bvhStats ).then( () => {

				webgpuFinished = true;

			} );

			while ( ! webgpuFinished ) {

				yield;

			}

		}

		const bruteForcePairs = bvhStats.totalEdges * bvhStats.totalTriangles;
		Logger.setStat( 'Total edges', bvhStats.totalEdges.toLocaleString() );
		Logger.setStat( 'Total triangles', bvhStats.totalTriangles.toLocaleString() );
		Logger.setStat( 'Brute-force pairs (edges × triangles)', bruteForcePairs.toLocaleString() );
		Logger.setStat( 'BVH candidate pairs', bvhStats.candidates.toLocaleString() );

		if ( bruteForcePairs > 0 ) {

			Logger.setStat( 'BVH reduction', ( bvhStats.candidates / bruteForcePairs * 100 ).toFixed( 3 ) + '% of brute-force' );

		}

		if ( bvhStats.candidates > 0 ) {

			const c = bvhStats.candidates;
			const pct = v => ( v / c * 100 ).toFixed( 2 ) + '%';

			if ( ! useWebGpu ) {

				Logger.setStat( 'Rejected: back-face culling', bvhStats.backFaceCulled.toLocaleString() + ' (' + pct( bvhStats.backFaceCulled ) + ')' );
				Logger.setStat( 'Rejected: Y-bounds (tri below edge)', bvhStats.yBoundsCulled.toLocaleString() + ' (' + pct( bvhStats.yBoundsCulled ) + ')' );
				Logger.setStat( 'Rejected: XZ-bounds (no 2D overlap)', bvhStats.xzBoundsCulled.toLocaleString() + ' (' + pct( bvhStats.xzBoundsCulled ) + ')' );
				Logger.setStat( 'Rejected: edge lies on triangle', bvhStats.triangleEdgeCulled.toLocaleString() + ' (' + pct( bvhStats.triangleEdgeCulled ) + ')' );
				Logger.setStat( 'Rejected: line above tri plane', bvhStats.planeTrimCulled.toLocaleString() + ' (' + pct( bvhStats.planeTrimCulled ) + ')' );
				Logger.setStat( 'Rejected: trimmed edge too small', bvhStats.distThresholdCulled.toLocaleString() + ' (' + pct( bvhStats.distThresholdCulled ) + ')' );
				Logger.setStat( 'Rejected: no projected overlap', bvhStats.noOverlapCulled.toLocaleString() + ' (' + pct( bvhStats.noOverlapCulled ) + ')' );

			}

			Logger.setStat( 'Producing overlaps', bvhStats.used.toLocaleString() + ' (' + pct( bvhStats.used ) + ')' );

		}

		// Convert overlaps to lines
		Logger.startStep( 'Converting overlaps to lines' );

		const hasGroups = this.hasGroups;

		for ( let i = 0; i < edges.length; i ++ ) {

			if ( performance.now() - time > iterationTime ) {

				yield;
				time = performance.now();

			}

			// convert the overlap points to proper lines
			const line = edges[ i ];
			const hiddenOverlaps = hiddenOverlapMap[ i ];

			const prevVisibleCount = visibleEdges.length;
			const prevHiddenCount = hiddenEdges.length;

			overlapsToLines( line, hiddenOverlaps, false, visibleEdges );
			overlapsToLines( line, hiddenOverlaps, true, hiddenEdges );

			if ( hasGroups ) {

				// groupIndex was stamped directly on the Line3 before the BVH reordered edges
				const groupIndex = line.groupIndex;

				for ( let j = prevVisibleCount; j < visibleEdges.length; j ++ ) {

					this.visibleGroupIndices.push( groupIndex );

				}

				for ( let j = prevHiddenCount; j < hiddenEdges.length; j ++ ) {

					this.hiddenGroupIndices.push( groupIndex );

				}

			}

		}

	}

}

export class ProjectionGenerator {

	constructor() {

		this.iterationTime = 30;
		this.angleThreshold = 50;
		this.includeIntersectionEdges = true;
		this.useWebGPU = true;

	}

	generateAsync( geometry, options = {} ) {

		return new Promise( ( resolve, reject ) => {

			const { signal } = options;
			const task = this.generate( geometry, options );
			run();

			function run() {

				if ( signal && signal.aborted ) {

					reject( new Error( 'ProjectionGenerator: Process aborted via AbortSignal.' ) );
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

	*generate( scene, options ) {

		const { iterationTime, angleThreshold, includeIntersectionEdges } = this;
		const {
			onProgress = () => {},
			visibilityCuller = null,
			groupFn = null,
		} = options;

		Logger.reset();
		Logger.startTotal();

		if ( scene.isBufferGeometry ) {

			scene = new Mesh( scene );

		}

		if ( visibilityCuller ) {

			Logger.startStep( 'Visibility culling' );
			let finished = false;
			visibilityCuller.cull( scene ).then( res => {

				// TODO: the functions should be able to handle an array of objects
				scene = new Scene();
				scene.children = res;
				finished = true;

			} );

			while ( ! finished ) {

				yield;

			}

		}

		const edgeGenerator = new EdgeGenerator();
		edgeGenerator.iterationTime = iterationTime;
		edgeGenerator.thresholdAngle = angleThreshold;
		edgeGenerator.projectionDirection.copy( UP_VECTOR );

		Logger.startStep( 'Generating candidate edges' );
		onProgress( 'Generating candidate edges' );
		let edges = [];
		let edgeMeshMap = groupFn ? [] : null;
		yield* edgeGenerator.getEdgesGenerator( scene, edges, edgeMeshMap );
		if ( includeIntersectionEdges ) {

			Logger.startStep( 'Generating intersection edges' );
			onProgress( 'Generating intersection edges' );
			yield* edgeGenerator.getIntersectionEdgesGenerator( scene, edges, edgeMeshMap );

		}

		// filter out any degenerate projected edges
		Logger.startStep( 'Pre-filtering edges' );
		onProgress( 'Pre-filtering edges' );
		if ( edgeMeshMap ) {

			const filteredEdges = [];
			const filteredMap = [];
			for ( let i = 0; i < edges.length; i ++ ) {

				if ( ! isYProjectedLineDegenerate( edges[ i ] ) ) {

					filteredEdges.push( edges[ i ] );
					filteredMap.push( edgeMeshMap[ i ] );

				}

			}

			edges = filteredEdges;
			edgeMeshMap = filteredMap;

		} else {

			edges = edges.filter( e => ! isYProjectedLineDegenerate( e ) );

		}

		yield;

		const collector = new ProjectedEdgeCollector( scene, this.useWebGPU );
		collector.iterationTime = iterationTime;

		// Stamp group index directly on each Line3 edge so it survives BVH reordering
		if ( groupFn && edgeMeshMap ) {

			const groupKeyToIndex = new Map();
			for ( let i = 0; i < edges.length; i ++ ) {

				const key = groupFn( edgeMeshMap[ i ] );
				if ( ! groupKeyToIndex.has( key ) ) {

					groupKeyToIndex.set( key, groupKeyToIndex.size );

				}

				edges[ i ].groupIndex = groupKeyToIndex.get( key );

			}

			collector.groupKeyToIndex = groupKeyToIndex;
			collector.hasGroups = true;

		}

		onProgress( 'Building BVH & computing overlaps' );
		yield* collector.addEdgesGenerator( edges, {
			onProgress: ! onProgress ? null : ( prog, tot ) => {

				onProgress( 'Building BVH & computing overlaps', prog / tot, collector );

			},
		} );
		Logger.printSummary();

		return collector;

	}

}
