// Source: https://github.com/rollup/rollup/issues/1052
import { basename, dirname, isAbsolute, resolve } from 'path';
import * as fs from 'fs';

function isFile ( file ) {
	try {
		return fs.statSync( file ).isFile();
	} catch ( err ) {
		return false;
	}
}

function addExtensionIfNecessary ( file, extensions ) {
	try {
		const name = basename( file );
		const files = fs.readdirSync( dirname( file ) );

		if ( ~files.indexOf( name ) && isFile( file ) ) return file;
		for ( const ext of extensions ) {
			if ( ~files.indexOf( `${name}${ext}` ) && isFile( `${file}${ext}` ) ) {
				return `${file}${ext}`;
			}
		}
	} catch ( err ) {
		// noop
	}

	return null;
}

export default function extensions ({extensions}) {
	if (!extensions || !extensions.length) {
		throw new Error( `Must specify { extensions: [..] } as non-empty array!` );
	}

	return {
		name: 'extensions',

		resolveId ( importee, importer ) {
			// absolute paths are left untouched
			if ( isAbsolute( importee ) ) {
				return addExtensionIfNecessary( resolve( importee ), extensions );
			}

			// if this is the entry point, resolve against cwd
			if ( importer === undefined ) {
				return addExtensionIfNecessary( resolve( process.cwd(), importee ), extensions );
			}

			// external modules are skipped at this stage
			if ( importee[0] !== '.' ) return null;

			return addExtensionIfNecessary( resolve( dirname( importer ), importee ), extensions );
		}
	};
}