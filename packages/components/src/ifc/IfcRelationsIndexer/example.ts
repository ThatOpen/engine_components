import * as OBC from "../..";

/* MD
 ## Getting entity relations the easy way 💪
 ---
 If you're aware of the IFC schema, you should know that all the possible information an entity have is not directly inside its attributes. For example, the property sets, classifications, materials, etc, of a wall (or any other element) are not directly in the wall attributes 🤯 but in other entities which are related to the wall using relations. <br><br>

 Now, that is perfect for an schema like the IFC which aims to store all the building data within a single text file in the easiest way possible. However, is not that easy to work just because you need to find the relations you want to get to the element data you're looking for 😪. Luckily for you, the `IfcRelationsIndexer` already gives you an easy way to get the entities which are related with your elements thanks to the inverse attributes! 🔥🔥

 ### Loading a model 🏦
 First things first, lets load an IFC model to process its relations.

 :::tip

 If you're unsure on the details to load a model, just tool at the [FragmentIfcLoader]() tutorial!

 :::
 */

const components = new OBC.Components();

const ifcLoader = components.get(OBC.FragmentIfcLoader);
await ifcLoader.setup();
const file = await fetch("/resources/small.ifc");
const buffer = await file.arrayBuffer();
const typedArray = new Uint8Array(buffer);
const model = await ifcLoader.load(typedArray);

/* MD
 Once the model is loaded in memory, you just need to get an instance of the IfcRelationsIndexer and process the model... it's as easy as that! 😎
 */

const indexer = components.get(OBC.IfcRelationsIndexer);
await indexer.process(model);

/* MD
 The result of that is basically a map where the keys are the expressIDs and the values are other expressIDs related to the first one and grouped by the type of relation. You don't need to worry too much about the details of that, as the usage is pretty straighforward 🔝. The only thing that matters is you've now an easy way to access the entities related to your element 🙂

 ### Getting element psets 📄
 One of the most important relations between different entities is the `IfcRelDefinesByProperties`. That relation links together an arbitrary entity with a set of `IfcPropertySet` entities that applies properties. Getting them with the `IfcRelationsIndexer` once the model is indexed is pretty easy:
 */

const psets = indexer.getEntityRelations(model, 6518, "IsDefinedBy");
if (psets) {
  for (const expressID of psets) {
    // You can get the pset attributes like this
    const pset = await model.getProperties(expressID);
    console.log(pset);
    // You can get the pset props like this or iterate over pset.HasProperties yourself
    await OBC.IfcPropertiesUtils.getPsetProps(
      model,
      expressID,
      async (propExpressID) => {
        const prop = await model.getProperties(propExpressID);
        console.log(prop);
      },
    );
  }
}

/* MD
 :::tip

  IsDefinedBy is the inverse attribute name in the IFC Schema that holds the relations with property sets 😉

 :::

 Awesome! really easy right?

 ### Exporting the indexation
 In bigger models, the process to calculate the relations index may take some time. The important thing is that there is no reason to calculate over and over the relations index every time you load a model. If the model hasn't change, their properties shouldn't neither! So, let's download the relations index to load it later.
 */

const downloadJSON = (json: string, name: string) => {
  const file = new File([json], name);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(a.href);
};

const json = indexer.serializeModelRelations(model);
if (json) downloadJSON(json, "small-relations.json");

/* MD
 :::tip

 As `@thatopen/components` can be used in either NodeJS and Browser environments, the logic to generate a JSON file may vary!

 :::
 Now, in case you've loaded several models and want to get all the calculated relations, there is also a handy method to do it.
 */

const allRelationsJSON = indexer.serializeAllRelations();
downloadJSON(allRelationsJSON, "relations-index-all.json");

/* MD 
 ### Loading back the relations index
 What do we gain with having a pre-processed relations index if we can't use it again, right? Well, let's use the downloaded relations index 😎
 */

// Lets first delete the existing model relations
delete indexer.relationMaps[model.uuid];

const relationsIndex = await fetch("/resources/small-relations.json");
indexer.relationMaps[model.uuid] = indexer.getRelationsMapFromJSON(
  await relationsIndex.text(),
);

/* MD
 Great! Now try to get again the property sets and you will see everything working nice and neat. In fact, lets try to get the building storey of one element in the IFC 👇
 */

const buildingStorey = indexer.getEntityRelations(
  model,
  6518,
  "ContainedInStructure",
);

if (buildingStorey && buildingStorey[0]) {
  const storey = await model.getProperties(buildingStorey[0]);
  console.log(storey);
}

/* MD
 :::tip

 Despite there are some relations that corresponds to only one element (e.g., an element can only have one associated building storey) the `getEntityRelations` will always return an array. That's the reason we take the first buildingStorey relation despite it will always be the only one.

 :::
 Congratulations! Now you know how to get an easy way to get the relations of your model. Keep going with more tutorials! 💪
 */
