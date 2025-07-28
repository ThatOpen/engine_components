import * as OBC from "@thatopen/components";

export class Volume {
  private _components: OBC.Components;

  id = OBC.UUID.create();

  readonly onItemsChanged = new OBC.Event<undefined>();
  private _items: OBC.ModelIdMap = {};

  set items(value: OBC.ModelIdMap) {
    this._items = value;
    this.onItemsChanged.trigger();
  }

  get items() {
    return this._items;
  }

  private _units: "m3" | "cm3" | "mm3" | "km3" = "m3";

  set units(value: "m3" | "cm3" | "mm3" | "km3") {
    this._units = value;
  }

  get units() {
    return this._units;
  }

  private _rounding = 2;

  set rounding(value: number) {
    this._rounding = value;
  }

  get rounding() {
    return this._rounding;
  }

  async getValue() {
    const utils = this._components.get(OBC.MeasurementUtils);
    const volume = await utils.getItemsVolume(this.items);
    const convertedValue = OBC.MeasurementUtils.convertUnits(
      volume,
      "m3",
      this.units,
      this.rounding,
    );
    return convertedValue;
  }

  async getCenter() {
    const boxer = this._components.get(OBC.BoundingBoxer);
    const center = await boxer.getCenter(this.items);
    return center;
  }

  constructor(components: OBC.Components) {
    this._components = components;
  }

  async getBox() {
    const boxer = this._components.get(OBC.BoundingBoxer);
    boxer.list.clear();
    await boxer.addFromModelIdMap(this.items);
    const box = boxer.get();
    boxer.list.clear();
    return box;
  }

  clone() {
    const volume = new Volume(this._components);
    volume.items = OBC.ModelIdMapUtils.clone(this.items);
    return volume;
  }
}
