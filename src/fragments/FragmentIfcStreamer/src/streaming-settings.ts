import { IfcFragmentSettings } from "../../FragmentIfcLoader/src";

/** Configuration of the IFC-fragment streaming. */
export class IfcStreamingSettings extends IfcFragmentSettings {
  maxGeometrySize = 1000;
  maxAssetSize = 1000;
}
