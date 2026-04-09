import { BufferAttribute, BufferGeometry } from 'three';
import { OUTPUT_BOTH, SilhouetteGenerator } from '../SilhouetteGenerator.js';

onmessage = function ( { data } ) {

	let prevTime = performance.now();
	function onProgressCallback( progress ) {

		const currTime = performance.now();
		if ( currTime - prevTime >= 10 || progress === 1.0 ) {

			postMessage( {

				error: null,
				progress,

			} );
			prevTime = currTime;

		}

	}

	try {

		const { index, position, options } = data;
		const geometry = new BufferGeometry();
		geometry.setIndex( new BufferAttribute( index, 1, false ) );
		geometry.setAttribute( 'position', new BufferAttribute( position, 3, false ) );

		const generator = new SilhouetteGenerator();
		generator.doubleSided = options.doubleSided ?? generator.doubleSided;
		generator.output = options.output ?? generator.output;
		generator.intScalar = options.intScalar ?? generator.intScalar;
		generator.sortTriangles = options.sortTriangles ?? generator.sortTriangles;
		const task = generator.generate( geometry, {
			onProgress: onProgressCallback,
		} );

		let result = task.next();
		while ( ! result.done ) {

			result = task.next();

		}

		let buffers, output;
		if ( generator.output === OUTPUT_BOTH ) {

			buffers = [];
			output = [];
			result.value.forEach( g => {

				console.log( g );
				const posArr = g.attributes.position.array;
				const indexArr = g.index?.array || null;
				output.push( {
					position: posArr,
					index: indexArr,
				} );
				buffers.push(
					posArr.buffer,
					indexArr?.buffer,
				);

			} );

		} else {

			const posArr = result.value.attributes.position.array;
			const indexArr = result.value.index.array;
			output = {
				position: posArr,
				index: indexArr,
			};
			buffers = [ posArr.buffer, indexArr.buffer ];

		}

		postMessage( {

			result: output,
			error: null,
			progress: 1,

		}, buffers.filter( b => ! ! b ) );

	} catch ( error ) {

		postMessage( {

			error,
			progress: 1,

		} );

	}

};
