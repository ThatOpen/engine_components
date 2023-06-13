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

  coordinateFragments(list: Fragment[], originalMatrix: THREE.Matrix4) {
    this._fragments.push({
      list,
      coordinationMatrix: originalMatrix,
    });
    if (this._coordinations === 0) {
      this._baseCoordinationMatrix.copy(originalMatrix);
    } else {
      list.forEach((fragment) => {
        fragment.mesh.applyMatrix4(originalMatrix.clone().invert()); // Translates back the model to its original world position.
        fragment.mesh.applyMatrix4(this._baseCoordinationMatrix); // Translates the model to be relative positioned to the first one loaded.
      });
    }
    this._coordinations++;
  }

  /**
   * @description Applies the base transformation matrix to a vector. This method doesn't modify the provided vector.
   * @param vector Vector3 to be coordinated by the base transformation matrix.
   * @returns A coordinated copy of the given vector.
   */
  coordinateVector(vector: THREE.Vector3) {
    return vector.clone().applyMatrix4(this._baseCoordinationMatrix);
  }

  get(): IFragmentCoordinator {
    return {
      fragments: this._fragments,
      baseCoordinationMatrix: this._baseCoordinationMatrix,
    };
  }
}
