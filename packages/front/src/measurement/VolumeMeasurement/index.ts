import * as OBC from "@thatopen/components";
import { Volume } from "../../utils";
import { Measurement } from "../Measurement";
import { VolumeMeasurerModes, VolumeMeasurerTempData } from "./src";
import { Hoverer } from "../../fragments";
import { MeasureVolume } from "../../utils/measure-volume";

/**
 * A basic dimension tool to measure volumes and display a 3D symbol with the numeric value. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/VolumeMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/VolumeMeasurement).
 */
export class VolumeMeasurement extends Measurement<Volume, "volume"> {
  static uuid = "01f885ab-ec4e-4e6c-a853-9dfc0d6766ed" as const;

  private _temp: VolumeMeasurerTempData = {};

  readonly onPreviewInitialized = new OBC.Event<MeasureVolume>();

  /**
   * The possible modes in which a measurement of this type may be created.
   */
  modes: VolumeMeasurerModes[number][] = ["free"];

  private _mode: VolumeMeasurerModes[number] = "free";

  get mode(): VolumeMeasurerModes[number] {
    return this._mode;
  }

  /**
   * Represents the current measurement mode being used.
   */
  set mode(value: VolumeMeasurerModes[number]) {
    this._mode = value;
    this.cancelCreation();
    this.onStateChanged.trigger(["mode"]);
  }

  constructor(components: OBC.Components) {
    super(components, "volume");
    components.add(VolumeMeasurement.uuid, this);
    this.initHandlers();
  }

  private initHandlers() {
    this.list.onItemAdded.add((volume) => {
      const element = this.createVolumeElement(volume);
      element.color = this.color;
      element.rounding = this.rounding;
      element.units = this.units;
      this.volumes.add(element);
    });

    this.list.onBeforeDelete.add((volume) => {
      const volumeElements = [...this.volumes];
      const volumeElement = volumeElements.find(
        (element) => element.volume === volume,
      );
      if (volumeElement) this.volumes.delete(volumeElement);
    });

    this.onStateChanged.add((states) => {
      if (states.includes("color")) {
        if (!this._temp.preview) return;
        this._temp.preview.color = this.color;
      }

      if (states.includes("units")) {
        if (!this._temp.preview) return;
        this._temp.preview.units = this.units;
      }

      if (states.includes("rounding")) {
        if (!this._temp.preview) return;
        this._temp.preview.rounding = this.rounding;
      }

      if (states.includes("enabled")) {
        const hoverer = this.components.get(Hoverer);
        hoverer.world = this.world;
        if (this.enabled) {
          this._previousHovererState = hoverer.enabled;
          hoverer.enabled = true;
        } else {
          hoverer.clear();
          hoverer.enabled = this._previousHovererState;
        }
        hoverer.hover();
      }
    });
  }

  private _previousHovererState = false;

  private async initPreview() {
    if (!this.enabled) return;
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    this._temp.preview = new MeasureVolume(this.components, this.world);
    this._temp.preview.color = this.color;
    this._temp.preview.rounding = this.rounding;
    this._temp.preview.units = this.units;
    this.onPreviewInitialized.trigger(this._temp.preview);
  }

  create = async () => {
    if (!this.enabled) return;

    const pickResult = (await this._vertexPicker.get()) as any;
    if (!pickResult) return;

    if (!this._temp.preview) {
      await this.initPreview();
    }

    this._temp.preview!.volume.items = OBC.ModelIdMapUtils.join([
      this._temp.preview!.volume.items,
      {
        [pickResult.fragments.modelId]: new Set([pickResult.localId]),
      },
    ]);
  };

  endCreation = () => {
    if (!this._temp.preview) return;
    if (OBC.ModelIdMapUtils.isEmpty(this._temp.preview.volume.items)) return;
    const volume = this._temp.preview.volume.clone();
    this.list.add(volume);
    this._temp.preview.dispose();
    delete this._temp.preview;
  };

  cancelCreation = () => {
    this._temp.preview?.dispose();
    delete this._temp.preview;
  };

  delete = async () => {
    if (this.list.size === 0 || !this.world) return;
    const meshes = await this.getVolumeBoxes();

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);

    for (const group of meshes) {
      const intersect = caster.castRayToObjects(group);
      if (!intersect) continue;
      const volumeElements = [...this.volumes];
      const volumeElement = volumeElements.find((element) =>
        element.meshes.some((item) => item === intersect.object),
      );
      if (!volumeElement) return;
      this.list.delete(volumeElement.volume);
    }
  };
}
