import { Fragment } from "bim-fragment";
import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";

interface IFragmentList {
  list: Fragment[];
  coordinationMatrix: THREE.Matrix4;
}

interface IFragmentCoordinator {
  baseCoordinationMatrix: THREE.Matrix4;
  fragments: IFragmentList[];
}

export class FragmentCoordinator extends Component<IFragmentCoordinator> {
  name: string = "FragmentCoordinator";
  enabled: boolean = true;
  private _baseCoordinationMatrix = new THREE.Matrix4();
  private _fragments: IFragmentList[] = [];
  private _coordinations: number = 0;

  // @ts-ignore
  private _components: Components;

  constructor(components: Components) {
    super();
    this._components = components;
  }

  coordinate(fragmentsList: Fragment[], coordinationMatrix: THREE.Matrix4) {
    this._fragments.push({ list: fragmentsList, coordinationMatrix });
    if (this._coordinations === 0) {
      this._baseCoordinationMatrix = coordinationMatrix.clone();
    } else {
      fragmentsList.forEach((fragment) => {
        fragment.mesh.applyMatrix4(coordinationMatrix.clone().invert()); // Translates back the model to its original world position.
        fragment.mesh.applyMatrix4(this._baseCoordinationMatrix); // Translates the model to be relative positioned to the first one loaded.
      });
    }
    this._coordinations++;
  }

  get(): IFragmentCoordinator {
    return {
      fragments: this._fragments,
      baseCoordinationMatrix: this._baseCoordinationMatrix,
    };
  }
}
