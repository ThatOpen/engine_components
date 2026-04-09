import {
	ShaderMaterial,
	GLSL3,
	WebGLRenderTarget,
	Box3,
	Vector3,
	Vector4,
	OrthographicCamera,
	Color,
	Scene,
	NoBlending,
} from 'three';

// RGBA8 ID encoding - supports up to 16,777,215 objects (2^24 - 1)
// ID 0 is valid, background is indicated by alpha = 0
function encodeId( id, target ) {

	target.x = ( id & 0xFF ) / 255;
	target.y = ( ( id >> 8 ) & 0xFF ) / 255;
	target.z = ( ( id >> 16 ) & 0xFF ) / 255;
	target.w = 1;

}

function decodeId( buffer, index ) {

	return buffer[ index ] | ( buffer[ index + 1 ] << 8 ) | ( buffer[ index + 2 ] << 16 );

}

function collectAllObjects( objects ) {

	const result = new Set();
	objects.traverse( c => {

		if ( c.isMesh ) {

			result.add( c );

		}

	} );

	return Array.from( result );

}

// TODO: WebGPU or occlusion queries would let us accelerate this. Ideally would we "contract" the depth buffer by one pixel by
// taking the lowest value from all surrounding pixels in order to avoid mesh misses.
export class VisibilityCuller {

	constructor( renderer, options = {} ) {

		const { pixelsPerMeter = 0.1 } = options;

		this.pixelsPerMeter = pixelsPerMeter;
		this.renderer = renderer;

	}

	async cull( objects ) {

		objects = collectAllObjects( objects );

		const { renderer, pixelsPerMeter } = this;
		const size = new Vector3();
		const camera = new OrthographicCamera();
		const box = new Box3();

		const target = new WebGLRenderTarget( 1, 1 );

		// get the bounds of the image
		box.makeEmpty();
		objects.forEach( o => {

			box.expandByObject( o );

		} );

		// get the bounds dimensions
		box.getSize( size );

		// calculate the tile and target size
		const maxTextureSize = Math.min( renderer.capabilities.maxTextureSize, 2 ** 13 );
		const pixelWidth = Math.ceil( size.x / pixelsPerMeter );
		const pixelHeight = Math.ceil( size.z / pixelsPerMeter );
		const tilesX = Math.ceil( pixelWidth / maxTextureSize );
		const tilesY = Math.ceil( pixelHeight / maxTextureSize );

		target.setSize( Math.ceil( pixelWidth / tilesX ), Math.ceil( pixelHeight / tilesY ) );

		// set the camera bounds
		camera.rotation.x = - Math.PI / 2;
		camera.far = ( box.max.y - box.min.y ) + camera.near;
		camera.position.y = box.max.y + camera.near;

		// Create a scene with all objects using ID materials
		const idScene = new Scene();
		const originalMaterials = new Map();
		const originalParents = new Map();
		const idMaterials = [];

		for ( let i = 0; i < objects.length; i ++ ) {

			const object = objects[ i ];

			// Store original material and parent
			originalMaterials.set( object, object.material );
			originalParents.set( object, object.parent );

			// Create and assign ID material
			const idMaterial = new IDMaterial();
			idMaterial.objectId = i;
			idMaterials.push( idMaterial );
			object.material = idMaterial;

			// Add to ID scene
			idScene.add( object );

		}

		// save render state
		const color = renderer.getClearColor( new Color() );
		const alpha = renderer.getClearAlpha();
		const renderTarget = renderer.getRenderTarget();
		const autoClear = renderer.autoClear;

		// render ids
		renderer.autoClear = true;
		renderer.setClearColor( 0, 0 );
		renderer.setRenderTarget( target );

		const readBuffer = new Uint8Array( target.width * target.height * 4 );
		const visibleSet = new Set();
		const stepX = size.x / tilesX;
		const stepZ = size.z / tilesY;
		for ( let tx = 0; tx < tilesX; tx ++ ) {

			for ( let ty = 0; ty < tilesY; ty ++ ) {

				// Calculate tile bounds in world space
				const tileMinX = box.min.x + stepX * tx;
				const tileMaxX = tileMinX + stepX;
				const tileMinZ = box.min.z + stepZ * ty;
				const tileMaxZ = tileMinZ + stepZ;

				// Position camera at center of this tile
				const tileCenterX = ( tileMinX + tileMaxX ) / 2;
				const tileCenterZ = ( tileMinZ + tileMaxZ ) / 2;
				camera.position.set( tileCenterX, box.max.y, tileCenterZ );

				// Set symmetric frustum around camera center
				// For a camera looking down (-90° X rotation):
				// - camera left/right map to world X
				// - camera top/bottom map to world -Z/+Z (inverted)
				const halfWidth = stepX / 2;
				const halfHeight = stepZ / 2;
				camera.left = - halfWidth;
				camera.right = halfWidth;
				camera.top = halfHeight;
				camera.bottom = - halfHeight;

				camera.updateProjectionMatrix();

				// Single render call for all objects in this tile
				renderer.render( idScene, camera );

				const buffer = await renderer.readRenderTargetPixelsAsync( target, 0, 0, target.width, target.height, readBuffer );

				// find all visible objects - decode RGBA to ID
				for ( let i = 0, l = buffer.length; i < l; i += 4 ) {

					// alpha = 0 indicates background (no object)
					if ( buffer[ i + 3 ] === 0 ) continue;

					const id = decodeId( buffer, i );
					visibleSet.add( objects[ id ] );

				}

			}

		}

		// Restore original materials and re-add to original parents
		for ( const object of objects ) {

			object.material = originalMaterials.get( object );
			const originalParent = originalParents.get( object );
			if ( originalParent ) {

				originalParent.add( object );

			} else {

				idScene.remove( object );

			}

		}

		// reset render state
		renderer.setClearColor( color, alpha );
		renderer.setRenderTarget( renderTarget );
		renderer.autoClear = autoClear;

		// dispose of intermediate values
		for ( const material of idMaterials ) {

			material.dispose();

		}

		target.dispose();


		// console.log( objects.length, visibleSet.size );
		return Array.from( visibleSet );

	}

}


class IDMaterial extends ShaderMaterial {

	get objectId() {

		return this._objectId;

	}

	set objectId( v ) {

		this._objectId = v;
		encodeId( v, this.uniforms.objectId.value );

	}

	constructor( params ) {

		super( {

			glslVersion: GLSL3,
			blending: NoBlending,

			uniforms: {
				objectId: { value: new Vector4() },
			},

			vertexShader: /* glsl */`
				void main() {

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,

			fragmentShader: /* glsl */`
				layout(location = 0) out vec4 out_id;
				uniform vec4 objectId;

				void main() {

					out_id = objectId;

				}
			`,

		} );

		this._objectId = 0;
		this.setValues( params );

	}

}
