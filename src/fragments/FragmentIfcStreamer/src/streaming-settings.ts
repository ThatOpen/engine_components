import { IfcFragmentSettings } from "../../FragmentIfcLoader/src";

/** Configuration of the IFC-fragment streaming. */
export class IfcStreamingSettings extends IfcFragmentSettings {
  minGeometrySize = 10;
  minAssetsSize = 1000;
}
