import * as WEBIFC from "web-ifc";
import { AsyncEvent, Component, Disposable, Event } from "../../core";
import { PropertiesStreamingSettings } from "./src";
import { GeometryTypes } from "../../ifc/IfcJsonExporter/src/ifc-geometry-types";
import { IfcRelationsIndexer } from "../../ifc";

export * from "./src";

/**
 * A component that converts the properties of an IFC file to tiles. It uses the Web-IFC library to read and process the IFC data. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcPropertiesTiler). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcPropertiesTiler).
 */
export class IfcPropertiesTiler extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "88d2c89c-ce32-47d7-8cb6-d51e4b311a0b" as const;

  /**
   * An event that is triggered when properties are streamed from the IFC file.
   * The event provides the type of the IFC entity and the corresponding data.
   */
  readonly onPropertiesStreamed = new AsyncEvent<{
    type: number;
    data: { [id: number]: any };
  }>();

  /**
   * An event that is triggered to indicate the progress of the streaming process.
   * The event provides a number between 0 and 1 representing the progress percentage.
   */
  readonly onProgress = new AsyncEvent<number>();

  /**
   * An event that is triggered when indices are streamed from the IFC file.
   * The event provides a map of indices, where the key is the entity type and the value is another map of indices.
   */
  readonly onIndicesStreamed = new AsyncEvent<
    Map<number, Map<number, number[]>>
  >();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /** {@link Component.enabled} */
  enabled: boolean = true;

  /**
   * An instance of the PropertiesStreamingSettings class, which holds the settings for the streaming process.
   */
  settings = new PropertiesStreamingSettings();

  /**
   * An instance of the IfcAPI class from the Web-IFC library, which provides methods for reading and processing IFC data.
   */
  webIfc = new WEBIFC.IfcAPI();

  /** {@link Disposable.dispose} */
  async dispose() {
    this.onIndicesStreamed.reset();
    this.onPropertiesStreamed.reset();
    (this.webIfc as any) = null;
    this.onDisposed.reset();
  }

  /**
   * This method converts properties from an IFC file to tiles given its data as a Uint8Array.
   *
   * @param data - The Uint8Array containing the IFC file data.
   * @returns A Promise that resolves when the streaming process is complete.
   */
  async streamFromBuffer(data: Uint8Array) {
    // const before = performance.now();
    await this.readIfcFile(data);

    await this.streamAllProperties();
    this.cleanUp();

    // console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  /**
   * This method converts properties from an IFC file to tiles using a given callback function to read the file.
   *
   * @param loadCallback - A callback function that loads the IFC file data.
   * @returns A Promise that resolves when the streaming process is complete.
   */
  async streamFromCallBack(loadCallback: WEBIFC.ModelLoadCallback) {
    // const before = performance.now();
    await this.streamIfcFile(loadCallback);

    await this.streamAllProperties();
    this.cleanUp();

    // console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  private async readIfcFile(data: Uint8Array) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this.webIfc.SetWasmPath(path, absolute);
    await this.webIfc.Init();
    if (logLevel) {
      this.webIfc.SetLogLevel(logLevel);
    }
    this.webIfc.OpenModel(data, this.settings.webIfc);
  }

  private async streamIfcFile(loadCallback: WEBIFC.ModelLoadCallback) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this.webIfc.SetWasmPath(path, absolute);
    await this.webIfc.Init();
    if (logLevel) {
      this.webIfc.SetLogLevel(logLevel);
    }
    this.webIfc.OpenModelFromCallback(loadCallback, this.settings.webIfc);
  }

  private async streamAllProperties() {
    const { propertiesSize } = this.settings;

    const allIfcEntities = new Set(this.webIfc.GetIfcEntityList(0));

    // let finalCount = 0;

    // Spatial items get their properties recursively to make
    // the location data available (e.g. absolute position of building)
    const spatialStructure = new Set([
      WEBIFC.IFCPROJECT,
      WEBIFC.IFCSITE,
      WEBIFC.IFCBUILDING,
      WEBIFC.IFCBUILDINGSTOREY,
      WEBIFC.IFCSPACE,
    ]);

    for (const type of spatialStructure) {
      allIfcEntities.add(type);
    }

    let nextProgress = 0.01;
    let typeCounter = 0;

    for (const type of allIfcEntities) {
      typeCounter++;
      if (GeometryTypes.has(type)) {
        continue;
      }

      const isSpatial = spatialStructure.has(type);

      const ids = this.webIfc.GetLineIDsWithType(0, type);

      // const allIDs = this._webIfc.GetAllLines(0);
      const idCount = ids.size();
      let count = 0;

      // Stream all properties in chunks of the specified size

      for (let i = 0; i < idCount - propertiesSize; i += propertiesSize) {
        const data: { [id: number]: any } = {};
        for (let j = 0; j < propertiesSize; j++) {
          count++;

          // finalCount++;
          const nextProperty = ids.get(i + j);

          try {
            const property = this.webIfc.GetLine(0, nextProperty, isSpatial);
            data[property.expressID] = property;
          } catch (e) {
            console.log(`Could not get property: ${nextProperty}`);
          }
        }
        await this.onPropertiesStreamed.trigger({ type, data });
      }

      // Stream the last chunk

      if (count !== idCount) {
        const data: { [id: number]: any } = {};
        for (let i = count; i < idCount; i++) {
          // finalCount++;
          const nextProperty = ids.get(i);

          try {
            const property = this.webIfc.GetLine(0, nextProperty, isSpatial);
            data[property.expressID] = property;
          } catch (e) {
            console.log(`Could not get property: ${nextProperty}`);
          }
        }

        await this.onPropertiesStreamed.trigger({ type, data });
      }

      const currentProgress = typeCounter / allIfcEntities.size;
      if (currentProgress > nextProgress) {
        nextProgress = Math.round(nextProgress * 100) / 100;
        await this.onProgress.trigger(nextProgress);
        nextProgress += 0.01;
      }
    }

    await this.onProgress.trigger(1);

    // Stream indices

    const relations = this.components.get(IfcRelationsIndexer);
    const rels = await relations.processFromWebIfc(this.webIfc, 0);
    await this.onIndicesStreamed.trigger(rels);

    // console.log(finalCount);
  }

  private cleanUp() {
    this.webIfc.Dispose();
    (this.webIfc as any) = null;
    this.webIfc = new WEBIFC.IfcAPI();
  }
}
