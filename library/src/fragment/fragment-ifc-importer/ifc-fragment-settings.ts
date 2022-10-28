import * as WEBIFC from "web-ifc";

export class IfcFragmentSettings {
  // Categories that always will be instanced
  instancedCategories = new Set<number>();

  optionalCategories: number[] = [WEBIFC.IFCSPACE];

  webIfc: WEBIFC.LoaderSettings = {
    COORDINATE_TO_ORIGIN: true,
    USE_FAST_BOOLS: false,
  };

  constructor() {
    this.instancedCategories.add(WEBIFC.IFCFURNISHINGELEMENT);
    this.instancedCategories.add(WEBIFC.IFCWINDOW);
    this.instancedCategories.add(WEBIFC.IFCDOOR);
  }
}
