// eslint-disable-next-line max-classes-per-file
import * as THREE from "three";
import { BooleanSettingsControl, NumberSettingControl } from "../../Types";
import { Configurator } from "../../ConfigManager";
import { CullerRenderer } from "../index";

type CullerRendererConfigType = {
  enabled: BooleanSettingsControl;
  width: NumberSettingControl;
  height: NumberSettingControl;
  updateInterval: NumberSettingControl;
  autoUpdate: BooleanSettingsControl;
  renderDebugFrame: BooleanSettingsControl;
  threshold: NumberSettingControl;
};

/**
 * Configuration interface for the {@link CullerRenderer}.
 */
export interface CullerRendererConfig {
  /**
   * Whether the culler renderer should make renders or not.
   */
  enabled: boolean;

  /**
   * Width of the render target used for visibility checks.
   */
  width: number;

  /**
   * Height of the render target used for visibility checks.
   * Default value is 512.
   */
  height: number;

  /**
   * Whether the visibility check should be performed automatically.
   * Default value is true.
   */
  autoUpdate: boolean;

  /**
   * Interval in milliseconds at which the visibility check should be performed.
   */
  updateInterval: number;

  /**
   * Whether to render the frame use to debug the culler behavior.
   */
  renderDebugFrame: boolean;

  /**
   * Pixels in screen a geometry must occupy to be considered "seen".
   * Default value is 100.
   */
  threshold: number;
}

/**
 * Settings to configure the CullerRenderer.
 */

export class CullerRendererConfigManager extends Configurator<
  CullerRenderer,
  CullerRendererConfigType
> {
  protected _config: CullerRendererConfigType = {
    enabled: {
      value: true,
      type: "Boolean" as const,
    },
    width: {
      type: "Number" as const,
      interpolable: true,
      value: 512,
      min: 32,
      max: 1024,
    },
    height: {
      type: "Number" as const,
      interpolable: true,
      value: 512,
      min: 32,
      max: 1024,
    },
    autoUpdate: {
      value: true,
      type: "Boolean" as const,
    },
    renderDebugFrame: {
      value: false,
      type: "Boolean" as const,
    },
    updateInterval: {
      type: "Number" as const,
      interpolable: true,
      value: 1,
      min: 0,
      max: 1,
    },
    threshold: {
      type: "Number" as const,
      interpolable: true,
      value: 100,
      min: 1,
      max: 512,
    },
  };

  private _interval: number | null = null;

  get enabled() {
    return this._config.enabled.value;
  }

  set enabled(value: boolean) {
    this._config.enabled.value = value;
    this._component.enabled = value;
  }

  get width() {
    return this._config.width.value;
  }

  set width(value: number) {
    this.setWidthHeight(value, this.height);
  }

  get height() {
    return this._config.height.value;
  }

  set height(value: number) {
    this.setWidthHeight(this.width, value);
  }

  get autoUpdate() {
    return this._config.autoUpdate.value;
  }

  set autoUpdate(value: boolean) {
    this.setAutoAndInterval(value, this.updateInterval);
  }

  get updateInterval() {
    return this._config.updateInterval.value;
  }

  set updateInterval(value: number) {
    this.setAutoAndInterval(this.autoUpdate, value);
  }

  get renderDebugFrame() {
    return this._config.renderDebugFrame.value;
  }

  set renderDebugFrame(value: boolean) {
    this._config.renderDebugFrame.value = value;
  }

  get threshold() {
    return this._config.threshold.value;
  }

  set threshold(value: number) {
    this._config.threshold.value = value;
  }

  setWidthHeight(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error(
        "The width and height of the culler renderer must be more than 0!",
      );
    }
    this._config.width.value = width;
    this._config.height.value = height;
    this.resetRenderTarget();
  }

  setAutoAndInterval(auto: boolean, interval: number) {
    if (interval <= 0) {
      throw new Error(
        "The updateInterval of the culler renderer must be more than 0!",
      );
    }
    this._config.autoUpdate.value = auto;
    this._config.updateInterval.value = interval;
    this.resetInterval(auto);
  }

  private resetRenderTarget() {
    this._component.renderTarget.dispose();
    this._component.renderTarget = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
    );
    this._component.bufferSize = this.width * this.height * 4;
    this._component.buffer = new Uint8Array(this._component.bufferSize);
  }

  private resetInterval(enabled: boolean) {
    if (this._interval !== null) {
      window.clearInterval(this._interval);
    }

    if (!enabled) return;

    this._interval = window.setInterval(async () => {
      if (!this._component.preventUpdate) {
        await this._component.updateVisibility();
      }
    }, this.updateInterval);
  }
}
