import * as WEBIFC from "web-ifc";
import * as OBC from "../..";

const components = new OBC.Components();
const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const buffer = await file.arrayBuffer();
const model = await ifcLoader.load(new Uint8Array(buffer));

const indexer = components.get(OBC.IfcRelationsIndexer);

// By the time beign, the model relations must be processed to see the new relations when downloading the IFC
await indexer.process(model);

const propertiesManager = components.get(OBC.IfcPropertiesManager);

// Add a new pset
const { pset } = await propertiesManager.newPset(model, "CalculatedQuantities");

const prop = await propertiesManager.newSingleNumericProperty(
  model,
  "IfcReal",
  "Volume",
  12.25,
);

await propertiesManager.addPropToPset(model, pset.expressID, prop.expressID);
indexer.addEntitiesRelation(
  model,
  pset.expressID,
  { type: WEBIFC.IFCRELDEFINESBYPROPERTIES, inv: "DefinesOcurrence" },
  186,
);

// Modify existing entity attributes
const entityAttributes = await model.getProperties(186);
if (entityAttributes) {
  entityAttributes.Name.value = "New Wall Name";
  await propertiesManager.setData(model, entityAttributes);
}

// Create a new random entity
const ifcTask = new WEBIFC.IFC4X3.IfcTask(
  new WEBIFC.IFC4X3.IfcGloballyUniqueId(OBC.UUID.create()),
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  new WEBIFC.IFC4X3.IfcBoolean(false),
  null,
  null,
  null,
);

await propertiesManager.setData(model, ifcTask);

// Export modified model
const downloadBtn = document.getElementById("download-btn")!;
downloadBtn.addEventListener("click", async () => {
  const modifiedBuffer = await propertiesManager.saveToIfc(
    model,
    new Uint8Array(buffer),
  );

  const modifiedFile = new File([modifiedBuffer], "small-modified.ifc");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(modifiedFile);
  a.download = modifiedFile.name;
  a.click();
  URL.revokeObjectURL(a.href);
});
