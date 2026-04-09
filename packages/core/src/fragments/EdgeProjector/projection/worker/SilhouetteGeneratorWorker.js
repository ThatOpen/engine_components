import { BufferAttribute, BufferGeometry } from 'three';
import { OUTPUT_BOTH } from '../SilhouetteGenerator';

const NAME = 'SilhouetteGeneratorWorker';
export class SilhouetteGeneratorWorker {

	constructor() {

		this.running = false;
		this.worker = new Worker( new URL( './silhouetteAsync.worker.js', import.meta.url ), { type: 'module' } );
		this.worker.onerror = e => {

			if ( e.message ) {

				throw new Error( `${ NAME }: Could not create Web Worker with error "${ e.message }"` );

			} else {

				throw new Error( `${ NAME }: Could not create Web Worker.` );

			}

		};

	}

	generate( geometry, options = {} ) {

		if ( this.running ) {

			throw new Error( `${ NAME }: Already running job.` );

		}

		if ( this.worker === null ) {

			throw new Error( `${ NAME }: Worker has been disposed.` );

		}

		const { worker } = this;
		this.running = true;

		return new Promise( ( resolve, reject ) => {

			worker.onerror = e => {

				reject( new Error( `${ NAME }: ${ e.message }` ) );
				this.running = false;

			};

			worker.onmessage = e => {

				this.running = false;
				const { data } = e;

				if ( data.error ) {

					reject( new Error( data.error ) );
					worker.onmessage = null;

				} else if ( data.result ) {

					if ( options.output === OUTPUT_BOTH ) {

						const result = data.result.map( info => {

							const geometry = new BufferGeometry();
							geometry.setAttribute( 'position', new BufferAttribute( info.position, 3, false ) );
							if ( info.index ) {

								geometry.setIndex( new BufferAttribute( info.index, 1, false ) );

							}

							return geometry;

						} );

						resolve( result );

					} else {

						const geometry = new BufferGeometry();
						geometry.setAttribute( 'position', new BufferAttribute( data.result.position, 3, false ) );
						geometry.setIndex( new BufferAttribute( data.result.index, 1, false ) );
						resolve( geometry );

					}

					worker.onmessage = null;

				} else if ( options.onProgress ) {

					options.onProgress( data.progress );

				}

			};

			const index = geometry.index ? geometry.index.array.slice() : null;
			const position = geometry.attributes.position.array.slice();
			const transfer = [ position.buffer ];
			if ( index ) {

				transfer.push( index.buffer );

			}

			worker.postMessage( {
				index,
				position,
				options: {
					...options,
					onProgress: null,
					includedProgressCallback: Boolean( options.onProgress ),
				},
			}, transfer );

		} );

	}

	dispose() {

		this.worker.terminate();
		this.worker = null;

	}

}
