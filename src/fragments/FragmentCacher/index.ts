import * as THREE from "three";
import { FragmentsGroup } from "bim-fragment";
import { LocalCacher } from "../../core";
import { FragmentManager } from "../FragmentManager";

export class FragmentCacher extends LocalCacher {
  async getFragmentGroup(id: string, fragments: FragmentManager) {
    const { fragmentsCacheID, propertiesCacheID } = this.getIDs(id);

    if (!fragmentsCacheID || !propertiesCacheID) {
      return null;
    }

    const fragmentFile = await this.get(fragmentsCacheID);
    if (fragmentFile === null) {
      throw new Error("Loading error");
    }
    const fragmentsData = await fragmentFile.arrayBuffer();
    const buffer = new Uint8Array(fragmentsData);
    fragments.load(buffer);

    const propertiesFile = await this.get(propertiesCacheID);
    if (propertiesFile === null) {
      throw new Error("Loading error");
    }
    const propertiesData = await propertiesFile.text();
    const properties = JSON.parse(propertiesData);
    const loadedModel: any = new THREE.Mesh();

    this.components.scene.get().add(loadedModel);
    for (const id in properties) {
      loadedModel[id] = properties[id];
    }

    loadedModel.fragments = Object.values(fragments.list);

    for (const id in fragments.list) {
      const fragment = fragments.list[id];
      loadedModel.attach(fragment.mesh);
    }

    return loadedModel;
  }

  async saveFragmentGroup(group: FragmentsGroup, id: string) {
    const fragments = new FragmentManager(this.components);

    const { fragmentsCacheID, propertiesCacheID } = this.getIDs(id);
    const exported = fragments.export(group);
    const fragmentsFile = this.newFile(exported, fragmentsCacheID);
    const fragmentsUrl = URL.createObjectURL(fragmentsFile);
    await this.save(fragmentsCacheID, fragmentsUrl);

    const json = JSON.stringify(group.properties);
    const jsonFile = this.newFile(json, propertiesCacheID);
    const propertiesUrl = URL.createObjectURL(jsonFile);
    await this.save(propertiesCacheID, propertiesUrl);
  }

  private getIDs(id: string) {
    return {
      fragmentsCacheID: `${id}-fragments`,
      propertiesCacheID: `${id}-properties`,
    };
  }

  private newFile(data: any, name: string) {
    return new File([new Blob([data])], name);
  }
}
