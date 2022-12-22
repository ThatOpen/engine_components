import * as WEBIFC from "web-ifc";

export class Settings {
  // Categories that always will be instanced
  instancedCategories = new Set<number>();

  includeProperties = true;

  optionalCategories: number[] = [WEBIFC.IFCSPACE];

  wasm = {
    path: "",
    absolute: false,
  };

  instanceLimit = 5;

  webIfc: WEBIFC.LoaderSettings = {
    COORDINATE_TO_ORIGIN: true,
    USE_FAST_BOOLS: true,
  };

  constructor() {
    this.instancedCategories.add(WEBIFC.IFCFURNISHINGELEMENT);
    this.instancedCategories.add(WEBIFC.IFCWINDOW);
    this.instancedCategories.add(WEBIFC.IFCDOOR);
  }
}
