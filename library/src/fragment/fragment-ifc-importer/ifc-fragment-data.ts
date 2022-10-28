import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import { Event, Progress } from "../../core";
import { IfcItemsCategories, IfcCategories } from "../../ifc/ifc-categories";

export class IfcFragmentData {
  progress = new Event<Progress>();

  categories: IfcItemsCategories = {};

  items: {
    [geometryID: string]: {
      instances: { id: number; matrix: THREE.Matrix4 }[];
      geometriesByMaterial: { [materialID: string]: THREE.BufferGeometry[] };
      referenceMatrix: THREE.Matrix4;
    };
  } = {};

  uniqueItems: {
    [category: string]: {
      [floor: string]: {
        [materialID: string]: THREE.BufferGeometry[];
      };
    };
  } = {};

  materials: { [materialID: string]: THREE.MeshLambertMaterial } = {};

  private load = {
    total: 0,
    current: 0,
    step: 0,
  };

  private _ifcCategories = new IfcCategories();

  get fragments() {
    return Object.values(this.items);
  }

  reset() {
    this.items = {};
    this.materials = {};
  }

  initLoadProgress(webIfc: WEBIFC.IfcAPI) {
    const shapes = webIfc.GetLineIDsWithType(
      0,
      WEBIFC.IFCPRODUCTDEFINITIONSHAPE
    );
    this.load.total = shapes.size();
    this.load.current = 0;
    this.load.step = 0.1;
  }

  updateLoadProgress() {
    const loadedItems = Math.min(this.load.current++, this.load.total);
    const isStepReached = loadedItems / this.load.total >= this.load.step;
    if (isStepReached) {
      const total = this.load.total;
      const current = Math.ceil(total * this.load.step);
      this.progress.trigger({ current, total });
      this.load.step += 0.1;
    }
  }

  getCategories(webIfc: WEBIFC.IfcAPI) {
    this.categories = this._ifcCategories.getAll(webIfc, 0);
  }
}
