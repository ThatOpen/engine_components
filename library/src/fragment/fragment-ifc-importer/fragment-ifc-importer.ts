import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import { GeometryUtils } from "bim-fragment/geometry-utils";
import { Fragment } from "bim-fragment/fragment";
import { FragmentGroup } from "./base-types";
import { IfcFragmentSettings } from "./ifc-fragment-settings";
import { IfcFragmentData } from "./ifc-fragment-data";
import { IfcFragmentGeometry } from "./ifc-fragment-geometry";
import { IfcCategoryMap } from "../../ifc/ifc-category-map";
import { IfcItemsCategories } from "../../ifc/ifc-categories";

/**
 * Reads all the geometry of the IFC file and generates an optimized `THREE.Mesh`.
 */
export class FragmentParser {
  settings = new IfcFragmentSettings();

  webIfc = new WEBIFC.IfcAPI();

  data = new IfcFragmentData();

  geometry = new IfcFragmentGeometry();

  async parse(buffer: any) {
    const data = new Uint8Array(buffer);
    await this.resetWebIfc();
    await this.webIfc.OpenModel(data, this.settings.webIfc);
    return this.loadAllGeometry();
  }

  private async resetWebIfc() {
    (this.webIfc as any) = null;
    this.webIfc = new WEBIFC.IfcAPI();
    await this.webIfc.Init();
  }

  private async loadAllGeometry() {
    await this.data.initLoadProgress(this.webIfc);
    this.data.getCategories(this.webIfc);
    this.loadOptionalCategories();
    this.loadMainCategories();

    const floorPropertyList: any[] = [];
    const categories: IfcItemsCategories = {};

    const floors = await this.getFloors();
    for (const floor of floors) {
      await this.getFloorProperties(floor, floorPropertyList);
      this.saveFloorRelations(floor, categories);
    }

    const model = new FragmentGroup();

    this.processFragmentData(model, categories);
    this.processUniqueItems(model);

    model.levelRelationships = categories;
    model.allTypes = IfcCategoryMap;
    model.itemTypes = this.data.categories;
    model.floorsProperties = floorPropertyList;

    for (const data of fragmentsData) {
      (data.geometriesByMaterial as any) = null;
      (data.instances as any) = null;
      (data.referenceMatrix as any) = null;
    }

    this.data.reset();
    this.data.updateLoadProgress();
    return model;
  }

  private loadMainCategories() {
    this.webIfc.StreamAllMeshes(0, (mesh: WEBIFC.FlatMesh) => {
      this.data.updateLoadProgress();
      this.geometry.streamMesh(mesh);
    });
  }

  private processUniqueItems(
    uniqueItems: {
      [p: string]: { [p: string]: { [p: string]: THREE.BufferGeometry[] } };
    },
    model: FragmentGroup
  ) {
    for (const categoryString in uniqueItems) {
      for (const levelString in uniqueItems[categoryString]) {
        const category = parseInt(categoryString);
        const level = parseInt(levelString);
        if (!level || !category) {
          continue;
        }
        const mats = Object.keys(uniqueItems[category][level]).map(
          (id) => this.materials[id]
        );
        const geometries = Object.values(uniqueItems[category][level]);

        let size = 0;
        const itemsIDs = new Set<number>();
        for (const geometryGroup of geometries) {
          for (const geom of geometryGroup) {
            size += geom.attributes.position.count;
            itemsIDs.add(geom.userData.id);
          }
        }

        const buffer = new Uint32Array(size);
        const currentIDs = new Map<number, number>();
        let offset = 0;
        let blockID = 0;

        for (const geometryGroup of geometries) {
          for (const geom of geometryGroup) {
            if (!currentIDs.has(geom.userData.id)) {
              currentIDs.set(geom.userData.id, blockID++);
            }
            const size = geom.attributes.position.count;
            const currentBlockID = currentIDs.get(geom.userData.id) as number;
            buffer.fill(currentBlockID, offset, offset + size);
            offset += size;
          }
        }

        const merged = GeometryUtils.merge(geometries);
        merged.setAttribute("blockID", new BufferAttribute(buffer, 1));
        const mergedFragment = new Fragment(merged, mats, 1);
        const ids = Array.from(itemsIDs).map((id) => id.toString());

        mergedFragment.setInstance(0, { ids, transform: new Matrix4() });
        model.fragments.push(mergedFragment);
        model.add(mergedFragment.mesh);
      }
    }
  }

  private processFragmentData(model: FragmentGroup, tree: IfcItemsCategories) {
    for (const data of fragmentsData) {
      const size = data.instances.length;

      const id = data.instances[0].id;
      const categoryID = this.data.categories[id];

      // Gather unique items to merge them together in a single fragment
      const isUnique = size === 1;

      // Each repeated item will be a separate fragment
      const isInstanced = this.settings.instancedCategories.has(categoryID);
      if (!isUnique || isInstanced) {
        const mats = Object.keys(data.geometriesByMaterial).map(
          (id) => this.materials[id]
        );
        const geoms = Object.values(data.geometriesByMaterial);
        const merged = GeometryUtils.merge(geoms);

        const fragment = new Fragment(merged, mats, size);
        for (let i = 0; i < size; i++) {
          const instance = data.instances[i];
          fragment.setInstance(i, {
            ids: [instance.id.toString()],
            transform: instance.matrix,
          });
        }
        model.fragments.push(fragment);
        model.add(fragment.mesh);
      } else {
        // Unique items will be collapsed to save draw calls

        for (const matID in data.geometriesByMaterial) {
          const id = data.instances[0].id;
          const category = this.splitByCategory
            ? this.state.models[modelID].types[id]
            : -1;
          if (!uniqueItems[category]) {
            uniqueItems[category] = {};
          }

          const level = this.splitByFloors ? tree[id] : -1;
          if (!uniqueItems[category][level]) {
            uniqueItems[category][level] = {};
          }

          if (!uniqueItems[category][level][matID]) {
            uniqueItems[category][level][matID] = [];
          }
          const geometries = data.geometriesByMaterial[matID];
          const instance = data.instances[0];

          for (const geom of geometries) {
            geom.userData.id = id;
            uniqueItems[category][level][matID].push(geom);

            geom.applyMatrix4(instance.matrix);
          }
        }
      }
    }
  }

  private saveFloorRelations(floor: any, tree: any) {
    for (const item of floor.children) {
      tree[item.expressID] = floor.expressID;
      if (item.children.length) {
        for (const child of item.children) {
          tree[child.expressID] = floor.expressID;
        }
      }
    }
  }

  private async getFloorProperties(floor: any, floorProperties: any[]) {
    const props = await this.webIfc.properties.getItemProperties(
      0,
      floor.expressID,
      false
    );
    floorProperties.push(props);
  }

  private async getFloors() {
    const project = await this.webIfc.properties.getSpatialStructure(0);

    // TODO: This is fixed from web-ifc 0.0.37
    // TODO: This fails with IFCs with uncommon spatial structure. To be improved
    // @ts-ignore
    const floors = project.children[0].children[0].children;
    return floors;
  }

  // Some categories (like IfcSpace and IfcOpeningElement) need to be set explicitly
  private loadOptionalCategories() {
    this.webIfc.StreamAllMeshesWithTypes(
      0,
      this.settings.optionalCategories,
      (mesh: WEBIFC.FlatMesh) => {
        this.geometry.streamMesh(mesh);
      }
    );
  }
}
