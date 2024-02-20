import * as WEBIFC from "web-ifc";
import { Component, Disposable, Event } from "../../../base-types";
import { PropertiesStreamingSettings } from "./streaming-settings";
import { GeometryTypes } from "../../../ifc/IfcJsonExporter/src/ifc-geometry-types";

// TODO: Deduplicate with IFC stream converter

export class FragmentPropsStreamConverter
  extends Component<WEBIFC.IfcAPI>
  implements Disposable
{
  static readonly uuid = "88d2c89c-ce32-47d7-8cb6-d51e4b311a0b" as const;

  onPropertiesStreamed = new Event<{
    type: number;
    data: { [id: number]: any };
  }>();

  onIndicesStreamed = new Event<number[][]>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  enabled: boolean = true;

  settings = new PropertiesStreamingSettings();

  private _webIfc = new WEBIFC.IfcAPI();

  get(): WEBIFC.IfcAPI {
    return this._webIfc;
  }

  async dispose() {
    this.onIndicesStreamed.reset();
    this.onPropertiesStreamed.reset();
    (this._webIfc as any) = null;
    this.onDisposed.reset();
  }

  async streamFromBuffer(data: Uint8Array) {
    const before = performance.now();
    await this.readIfcFile(data);

    await this.streamAllProperties();
    this.cleanUp();

    console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  async streamFromCallBack(loadCallback: WEBIFC.ModelLoadCallback) {
    const before = performance.now();
    await this.streamIfcFile(loadCallback);

    await this.streamAllProperties();
    this.cleanUp();

    console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  private async readIfcFile(data: Uint8Array) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
    if (logLevel) {
      this._webIfc.SetLogLevel(logLevel);
    }
    this._webIfc.OpenModel(data, this.settings.webIfc);
  }

  private async streamIfcFile(loadCallback: WEBIFC.ModelLoadCallback) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
    if (logLevel) {
      this._webIfc.SetLogLevel(logLevel);
    }
    this._webIfc.OpenModelFromCallback(loadCallback, this.settings.webIfc);
  }

  private async streamAllProperties() {
    const { propertiesSize } = this.settings;

    const allIfcEntities = new Set(this._webIfc.GetIfcEntityList(0));

    // Types used to construct the property index
    const relationTypes = [
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      WEBIFC.IFCRELDEFINESBYTYPE,
      WEBIFC.IFCRELASSOCIATESMATERIAL,
      WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
      WEBIFC.IFCRELASSIGNSTOGROUP,
    ];

    const propertyIndices = new Map<number, Set<number>>();

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

    for (const type of allIfcEntities) {
      if (GeometryTypes.has(type)) {
        continue;
      }

      const isSpatial = spatialStructure.has(type);

      const ids = this._webIfc.GetLineIDsWithType(0, type);

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

          const property = this._webIfc.GetLine(
            0,
            nextProperty,
            isSpatial,
            true
          );

          if (relationTypes.includes(type)) {
            this.getIndices(property, nextProperty, propertyIndices);
          }

          data[property.expressID] = property;
        }
        await this.onPropertiesStreamed.trigger({ type, data });
      }

      // Stream the last chunk

      if (count !== idCount) {
        const data: { [id: number]: any } = {};
        for (let i = count; i < idCount; i++) {
          // finalCount++;
          const nextProperty = ids.get(i);
          const property = this._webIfc.GetLine(
            0,
            nextProperty,
            isSpatial,
            true
          );

          if (relationTypes.includes(type)) {
            this.getIndices(property, nextProperty, propertyIndices);
          }

          data[property.expressID] = property;
        }
        await this.onPropertiesStreamed.trigger({ type, data });
      }
    }

    // Stream indices

    const compressedIndices: number[][] = [];
    for (const [id, indices] of propertyIndices) {
      compressedIndices.push([id, ...indices]);
    }

    await this.onIndicesStreamed.trigger(compressedIndices);

    // console.log(finalCount);
  }

  private getIndices(
    property: any,
    nextProperty: number,
    propertyIndex: Map<number, Set<number>>
  ) {
    const related = property.RelatedObjects || property.RelatedElements;
    if (!related) {
      console.log(`Related objects not found: ${nextProperty}`);
      return;
    }

    const relating =
      property.RelatingType ||
      property.RelatingMaterial ||
      property.RelatingStructure ||
      property.RelatingPropertyDefinition ||
      property.RelatingGroup ||
      property.RelatingClassification;

    if (!relating) {
      console.log(`Relating object not found: ${nextProperty}`);
      return;
    }

    if (!Array.isArray(related) || relating.value === undefined) {
      return;
    }

    const relatingID = relating.value;

    for (const item of related) {
      if (item.value === undefined || item.value === null) {
        continue;
      }

      const id = item.value;

      if (!propertyIndex.has(id)) {
        propertyIndex.set(id, new Set());
      }

      const indices = propertyIndex.get(id) as Set<number>;
      indices.add(relatingID);
    }
  }

  private cleanUp() {
    (this._webIfc as any) = null;
    this._webIfc = new WEBIFC.IfcAPI();
  }
}
