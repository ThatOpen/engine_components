/* MD
  ### 📄 Managing Your Model Properties
  ---
  When it comes to deal with BIM models there are two important aspects: geometry and information. The latter is so important we have developed a dedicated component to help you in the process of creating, deleting, and editing information in your BIM models. Let's dive in!

  ### 🏗️ Scaffolding the Project
  ---
  Before we even do something with the properties in your IFC file, let's import the necessary dependencies and programatically load a file in memory using `@thatopen/components` IfcLoader as follows:
  */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

const components = new OBC.Components();
const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const buffer = await file.arrayBuffer();
const typedArray = new Uint8Array(buffer);
const model = await ifcLoader.load(typedArray);

/* MD
  :::tip

  If you're unsure about the loading process of an IFC file in the That Open Engine, take a look at the IfcLoader tutorial.

  :::

  Once the model has been loaded into memory, we can start to do things with the properties 💪

  ### ✅ Creating a New IfcPropertySet
  ---
  The first thing we need to do is get an instance of the IfcPropertiesManager component as follows:
  */

const propsManager = components.get(OBC.IfcPropertiesManager);

/* MD
  You have two ways to create a new IfcPropertySet: by using the IfcPropertiesManager or using WebIFC. The properties manager component includes some methods that acts as wrappers around instancing IFC entities with WebIFC, which makes easier to create them. Those wrapper method were made for the most common entities you probably want to create, which are IfcPropertySet and IfcPropertySingleValue. However, if you want to have full control over which entities do you create, then is better to stick with WebIFC as a preferred solution. Let's see how to use it in conjunction with the IfcPropertiesManager:
  */

const { handle: ownerHistoryHandle } =
  await propsManager.getOwnerHistory(model);

// The loaded model is known to be in version 2x3
const newPset = new WEBIFC.IFC2X3.IfcPropertySet(
  new WEBIFC.IFC2X3.IfcGloballyUniqueId(OBC.UUID.create()),
  ownerHistoryHandle,
  new WEBIFC.IFC2X3.IfcLabel("Custom Property Set"),
  null,
  [],
);

/* MD
  The most important thing to know when creating a new entity using WebIFC is that it comes without an expressID. Well, it comes with an expressID but its -1, which is not a valid expressID. So, why it comes with an invalid expressID? Easy, because it doesn't know the IFC where the entity will be added, so its our job to determine the expressID to be applied to it. Typically, the expressID will be the next number of the latest expressID found in the file. Appart of that, the entity must be added to the corresponding model information. To help you with the process so you don't have to do it all by yourself, the IfcPropertiesManager comes with a handy method as follows:
  */

// This not only adds the entity to the model, but it also determines a valid expressID
await propsManager.setData(model, newPset);

/* MD
  :::tip

  You should always use the method above immediately after a new entity has been created as most information operations are based on expressIDs!

  :::

  Let's now create a property and add it to the property set:
  */

const newProp = new WEBIFC.IFC2X3.IfcPropertySingleValue(
  new WEBIFC.IFC2X3.IfcIdentifier("Custom Property"),
  null,
  new WEBIFC.IFC2X3.IfcText("Custom Property Text Value"),
  null,
);

await propsManager.setData(model, newProp);
newPset.HasProperties.push(new WEBIFC.Handle(newProp.expressID));

/* MD
  As the property set has been created with a valid property, the next logical step is to add the set to the elements we want. Surprisingly, this job doesn't belong to the IfcPropertiesManager, but to the IfcRelationsIndexer! The reason is because when it comes to add a property set to another entity, what happens behind the scenes is a new IfcRelation has to be created. Everything that has to be with IfcRelations is managed by the IfcRelationsIndexer, and you can do it as follows:
  */

const indexer = components.get(OBC.IfcRelationsIndexer);
indexer.addEntitiesRelation(
  model,
  newPset.expressID,
  { type: WEBIFC.IFCRELDEFINESBYPROPERTIES, inv: "DefinesOcurrence" },
  186, // This is a known expressID for an IfcWall in the loaded file
);

// You can also add the relation like this
// indexer.addEntitiesRelation(
//   model,
//   186, // This is a known expressID for an IfcWall in the loaded file
//   { type: WEBIFC.IFCRELDEFINESBYPROPERTIES, inv: "IsDefinedBy" },
//   newPset.expressID,
// );

/* MD
  :::tip

  When you relate entities with the IfcRelationsIndexer, the corresponding IfcRelations are not created directly in the IFC file but in its relations maps; in other words, the only thing created is the definition of how both entities relates to each other. That means, you can't expect to have the IfcRelation in the file right away; the IfcRelation is only created when you export the file (see down below the tutorial). If you're new to the IfcRelationsIndexer, check the corresponding tutorial!

  :::

  ### ⚠️ Modifying Existing Entity Attributes
  ---
  Usually we not only have to create new data in the model, but also to modify existing. This process is extremely simple, and can be done as follows:
  */

const entityAttributes = await model.getProperties(186);
if (entityAttributes) {
  // Names are optional attributes! So we check if the entity has it.
  if (entityAttributes.Name) {
    entityAttributes.Name.value = "New Wall Name";
  } else {
    entityAttributes.Name = new WEBIFC.IFC2X3.IfcIdentifier("New Wall Name");
  }
  // You not only need to use this method when a new entity has been created, but also when it has been modified!
  await propsManager.setData(model, entityAttributes);
}

/* MD
  ### ❌ Deleting Entities
  ---
  Just as adding data to the model, sometimes you need to delete information. Just as before, this process is really straightforward and you can go as follows:
  */

await model.setProperties(243, null);
propsManager.registerChange(model, 243);

/* MD
  :::info

  Deleting data is not just removing the entity from the IFC file; for example, if you want to delete a wall, then you should also remove all the entities that defines its shape, its properties, etc, as they are no longer needed. So, many times, deleting one single entity should lead to deleting many others. Right now the engine doesn't have the tools to do it, but we're working on it! Stay tuned 😉

  :::

  ### ⏬ Exporting the Modified Model
  ---
  Lastly, you can use the IfcPropertiesManager to export the modified file! You can proceed as follows:
  */

const downloadBtn = document.getElementById("download-btn")!;
downloadBtn.addEventListener("click", async () => {
  // Here you need to provide the UInt8Array of the original model you want to modify
  const modifiedBuffer = await propsManager.saveToIfc(model, typedArray);
  const file = new File([modifiedBuffer], "small-modified.ifc");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(a.href);
});

/* MD
  ### 🎉 Wrap Up!
  ---
  That's it! Now you know how to use the IfcPropertiesManager to add, modify and delete entities in your IFC file. Keep going with more tutorials! 💪
  */
