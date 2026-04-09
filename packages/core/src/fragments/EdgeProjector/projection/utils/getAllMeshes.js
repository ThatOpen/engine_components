export function getAllMeshes( scene ) {

	removeUndefinedChildrenRecursively( scene );

	let meshes = [];
	scene.traverse( c => {

		if ( c.geometry && c.visible ) {

			meshes.push( c );

		}

	} );

	return meshes;

}


const removeUndefinedChildrenRecursively = ( scene ) => {

	if ( scene === undefined ) return;

	const children = [ ...scene.children ];

	for ( const child of children ) {

		if ( child === undefined ) {

			scene.children.splice( scene.children.indexOf( child ), 1 );

		} else {

			removeUndefinedChildrenRecursively( child );

		}

	}

};
