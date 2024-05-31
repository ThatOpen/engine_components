import * as OBC from "../..";

const components = new OBC.Components();
const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch("/resources/small.ifc");
const buffer = await file.arrayBuffer();
const model = await ifcLoader.load(new Uint8Array(buffer));

const propertiesManager = components.get(OBC.IfcPropertiesManager);

const { pset } = await propertiesManager.newPset(model, "CalculatedQuantities");

const prop = await propertiesManager.newSingleNumericProperty(
  model,
  "IfcReal",
  "Volume",
  12.25,
);

await propertiesManager.addPropToPset(model, pset.expressID, prop.expressID);
await propertiesManager.addElementToPset(model, pset.expressID, 186);

// const modifiedBuffer = await propertiesManager.saveToIfc(
//   model,
//   new Uint8Array(buffer),
// );

// const modifiedFile = new File([modifiedBuffer], "small-modified.ifc");
// const a = document.createElement("a");
// a.href = URL.createObjectURL(modifiedFile);
// a.download = modifiedFile.name;
// a.click();
// URL.revokeObjectURL(a.href);
