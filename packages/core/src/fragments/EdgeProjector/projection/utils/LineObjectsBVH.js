import { BVH } from 'three-mesh-bvh';
export class LineObjectsBVH extends BVH {

	get lines() {

		return this.primitiveBuffer;

	}

	constructor( lines, options ) {

		super( options );

		this.primitiveBuffer = lines;
		this.primitiveBufferStride = 1;

		this.heightOffset = options.heightOffset ?? 1e3;
		this.init( options );

	}

	writePrimitiveBounds( i, targetBuffer, writeOffset ) {

		const { primitiveBuffer, heightOffset } = this;
		const { start, end } = primitiveBuffer[ i ];

		targetBuffer[ writeOffset + 0 ] = Math.min( start.x, end.x );
		targetBuffer[ writeOffset + 1 ] = Math.min( start.y, end.y );
		targetBuffer[ writeOffset + 2 ] = Math.min( start.z, end.z );

		targetBuffer[ writeOffset + 3 ] = Math.max( start.x, end.x );
		targetBuffer[ writeOffset + 4 ] = Math.max( start.y, end.y ) + heightOffset;
		targetBuffer[ writeOffset + 5 ] = Math.max( start.z, end.z );

	}

	getRootRanges() {

		return [ { offset: 0, count: this.primitiveBuffer.length } ];

	}

}
