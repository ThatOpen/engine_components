import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { CivilNavigator } from "./src";

/**
 * This component provides functionality for navigating and interacting with civil engineering data in a 3D environment. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/CivilNavigators). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/CivilNavigators).
 *
 */
export class CivilNavigators extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "0a59c09e-2b49-474a-9320-99f51f40f182" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  list = new Map<string, CivilNavigator>();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  highlightMaterial = new LineMaterial({
    color: 0x7a4bd1,
    linewidth: 5,
    depthTest: false,
  });

  private _increments = 20;

  private _screenDistanceLimit = 0.1;

  private _fadeInTime = 500;

  private _stationLabelColor = new THREE.Color(0xffffff);
  private _stationLabelBackgroundColor = new THREE.Color(0x7a4bd1);
  private _stationPointerColor = new THREE.Color(0xffffff);
  private _stationPointerBackgroundColor = new THREE.Color(0x494cb6);

  get increments() {
    return this._increments;
  }

  set increments(value: number) {
    this._increments = value;
    for (const [, navigator] of this.list) {
      navigator.increments = value;
    }
  }

  get screenDistanceLimit() {
    return this._screenDistanceLimit;
  }

  set screenDistanceLimit(value: number) {
    this._screenDistanceLimit = value;
    for (const [, navigator] of this.list) {
      navigator.screenDistanceLimit = value;
    }
  }

  get fadeInTime() {
    return this._fadeInTime;
  }

  set fadeInTime(value: number) {
    this._fadeInTime = value;
    for (const [, navigator] of this.list) {
      navigator.fadeInTime = value;
    }
  }

  get stationLabelColor() {
    return this._stationLabelColor;
  }

  set stationLabelColor(color: THREE.Color) {
    this._stationLabelColor = color;
    for (const [, navigator] of this.list) {
      navigator.stationLabelColor = color;
    }
  }

  get stationLabelBackgroundColor() {
    return this._stationLabelBackgroundColor;
  }

  set stationLabelBackgroundColor(color: THREE.Color) {
    this._stationLabelBackgroundColor = color;
    for (const [, navigator] of this.list) {
      navigator.stationLabelBackgroundColor = color;
    }
  }

  get stationPointerColor() {
    return this._stationPointerColor;
  }

  set stationPointerColor(color: THREE.Color) {
    this._stationPointerColor = color;
    for (const [, navigator] of this.list) {
      navigator.stationPointerColor = color;
    }
  }

  get stationPointerBackgroundColor() {
    return this._stationPointerBackgroundColor;
  }

  set stationPointerBackgroundColor(color: THREE.Color) {
    this._stationPointerBackgroundColor = color;
    for (const [, navigator] of this.list) {
      navigator.stationPointerBackgroundColor = color;
    }
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilNavigators.uuid, this);
  }

  create(id: string) {
    const navigator = new CivilNavigator(
      this.components,
      this.highlightMaterial,
    );
    this.list.set(id, navigator);
    return navigator;
  }

  delete(id: string) {
    const navigator = this.list.get(id);
    if (navigator) {
      navigator.dispose();
      this.list.delete(id);
    }
  }

  dispose() {
    for (const [, navigator] of this.list) {
      navigator.dispose();
    }
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  updateAlignments() {
    for (const [, navigator] of this.list) {
      navigator.updateAlignments();
    }
  }
}
