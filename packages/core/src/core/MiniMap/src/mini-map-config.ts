import * as THREE from "three";
import {
  BooleanSettingsControl,
  ColorSettingsControl,
  NumberSettingControl,
} from "../../Types";
import { Configurator } from "../../ConfigManager";
import { MiniMap } from "./index";

type MiniMapConfigType = {
  visible: BooleanSettingsControl;
  lockRotation: BooleanSettingsControl;
  zoom: NumberSettingControl;
  frontOffset: NumberSettingControl;
  sizeX: NumberSettingControl;
  sizeY: NumberSettingControl;
  backgroundColor: ColorSettingsControl;
};

/**
 * Configuration interface for the {@link MiniMap}.
 */
export interface MiniMapConfig {
  /**
   * Whether the minimap is visible or not.
   */
  visible: boolean;

  /**
   * Whether to lock the rotation of the top camera in the minimap.
   */
  lockRotation: boolean;

  /**
   * The zoom of the camera in the minimap.
   */
  zoom: number;

  /**
   * The front offset of the minimap.
   * It determines how much the minimap's view is offset from the camera's view.
   * By pushing the map to the front, what the user sees on screen corresponds with what they see on the map
   */
  frontOffset: number;

  /**
   * The horizontal dimension of the minimap.
   */
  sizeX: number;

  /**
   * The vertical dimension of the minimap.
   */
  sizeY: number;

  /**
   * The color of the background of the minimap.
   */
  backgroundColor: THREE.Color;
}

export class MiniMapConfigManager extends Configurator<
  MiniMap,
  MiniMapConfigType
> {
  protected _config: MiniMapConfigType = {
    visible: {
      value: true,
      type: "Boolean" as const,
    },
    lockRotation: {
      value: true,
      type: "Boolean" as const,
    },
    zoom: {
      type: "Number" as const,
      interpolable: true,
      value: 0.05,
      min: 0.001,
      max: 5,
    },
    frontOffset: {
      type: "Number" as const,
      interpolable: true,
      value: 0,
      min: 0,
      max: 100,
    },
    sizeX: {
      type: "Number" as const,
      interpolable: true,
      value: 320,
      min: 20,
      max: 5000,
    },
    sizeY: {
      type: "Number" as const,
      interpolable: true,
      value: 160,
      min: 20,
      max: 5000,
    },
    backgroundColor: {
      value: new THREE.Color() as THREE.Color,
      type: "Color" as const,
    },
  };

  /**
   * Whether the minimap is visible or not.
   */
  get visible() {
    return this._config.visible.value;
  }

  /**
   * Whether the minimap is visible or not.
   */
  set visible(value: boolean) {
    this._config.visible.value = value;
    const style = this._component.renderer.domElement.style;
    style.display = value ? "block" : "none";
  }

  /**
   * Whether to lock the rotation of the top camera in the minimap.
   */
  get lockRotation() {
    return this._config.lockRotation.value;
  }

  /**
   * Whether to lock the rotation of the top camera in the minimap.
   */
  set lockRotation(value: boolean) {
    this._config.lockRotation.value = value;
    this._component.lockRotation = value;
  }

  /**
   * The zoom of the camera in the minimap.
   */
  get zoom() {
    return this._config.zoom.value;
  }

  /**
   * The zoom of the camera in the minimap.
   */
  set zoom(value: number) {
    this._config.zoom.value = value;
    this._component.zoom = value;
  }

  /**
   * The front offset of the minimap.
   * It determines how much the minimap's view is offset from the camera's view.
   * By pushing the map to the front, what the user sees on screen corresponds with what they see on the map
   */
  get frontOffset() {
    return this._config.frontOffset.value;
  }

  /**
   * The front offset of the minimap.
   * It determines how much the minimap's view is offset from the camera's view.
   * By pushing the map to the front, what the user sees on screen corresponds with what they see on the map
   */
  set frontOffset(value: number) {
    this._config.frontOffset.value = value;
    this._component.frontOffset = value;
  }

  /**
   * The horizontal dimension of the minimap.
   */
  get sizeX() {
    return this._config.sizeX.value;
  }

  /**
   * The horizontal dimension of the minimap.
   */
  set sizeX(value: number) {
    this._config.sizeX.value = value;
    const { sizeX, sizeY } = this._config;
    const size = new THREE.Vector2(sizeX.value, sizeY.value);
    this._component.resize(size);
  }

  /**
   * The vertical dimension of the minimap.
   */
  get sizeY() {
    return this._config.sizeY.value;
  }

  /**
   * The vertical dimension of the minimap.
   */
  set sizeY(value: number) {
    this._config.sizeY.value = value;
    const { sizeX, sizeY } = this._config;
    const size = new THREE.Vector2(sizeX.value, sizeY.value);
    this._component.resize(size);
  }

  /**
   * The color of the background of the minimap.
   */
  get backgroundColor() {
    return this._config.backgroundColor.value;
  }

  /**
   * The color of the background of the minimap.
   */
  set backgroundColor(value: THREE.Color) {
    this._config.backgroundColor.value = value;
    this._component.backgroundColor = value;
  }
}
