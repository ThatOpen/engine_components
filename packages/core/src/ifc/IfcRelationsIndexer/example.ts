/* MD
### 🔁 Getting relations (easy)
---

 If you're aware of the IFC schema, you should know that all the possible information an entity have is not directly inside its attributes. For example, the property sets, classifications, materials, etc, of a wall (or any other element) are not directly in the wall attributes 🤯 but in other entities which are related to the wall using relations.


:::tip Why so much indirection?

 Indirection is perfect for an schema like the IFC which aims to store all the building data within a single text file in the easiest way possible. However, is not that easy to work just because you need to find the relations you want to get to the element data you're looking for 😪. Luckily for you, the `IfcRelationsIndexer` already gives you an easy way to get the entities which are related with your elements thanks to the inverse attributes! 🔥🔥

:::

In this tutorial, we will import:

- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.
*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding an IFC model to our scene.

  :::tip Loading an IFC?

    If you are not familiar with IFC loading, check out the IFC Loader tutorial first!

  :::
*/

const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const buffer = await file.arrayBuffer();
const typedArray = new Uint8Array(buffer);
const model = await ifcLoader.load(typedArray);
world.scene.three.add(model);

/* MD
  ### 📋 Indexing the model
  ---

 Once the model is loaded in memory, you just need to get an instance of the IfcRelationsIndexer and process the model... it's as easy as that! 😎
*/

const indexer = components.get(OBC.IfcRelationsIndexer);
await indexer.process(model);

/* MD
 The result of that is basically a map where the keys are the expressIDs and the values are other expressIDs related to the first one and grouped by the type of relation. You don't need to worry too much about the details of that, as the usage is pretty straighforward 🔝. The only thing that matters is you've now an easy way to access the entities related to your element 🙂

  ### 📄 Getting element psets 
  ---

 One of the most important relations between different entities is the `IfcRelDefinesByProperties`. That relation links together an arbitrary entity with a set of `IfcPropertySet` entities that applies properties. Getting them with the indexer once the model is indexed is pretty easy:
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

  ### ↘️ Exporting the indexation
  ---

 In bigger models, the process to calculate the relations index may take some time. There is no reason to calculate over and over the relations index every time you load a model. If the model hasn't change, their properties shouldn't neither! So, let's download the relations index to load it later.
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
console.log(json);

/* MD
 :::tip

 As `@thatopen/components` can be used in either NodeJS and Browser environments, the logic to generate a JSON file may vary!

 :::

 Now, in case you've loaded several models and want to get all the computed relations, there is also a handy method to do it.
 */

const allRelationsJSON = indexer.serializeAllRelations();

/* MD 
  ### ↗️ Loading back the relations index
  ---
   
  What do we gain with having a pre-processed relations index if we can't use it again, right? Well, let's use the downloaded relations index 😎
 */

// Lets first delete the existing model relations
delete indexer.relationMaps[model.uuid];
const relationsIndexFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small-relations.json",
);
const relationsIndex = indexer.getRelationsMapFromJSON(
  await relationsIndexFile.text(),
);

indexer.setRelationMap(model, relationsIndex);

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

 ### 🤏 Getting entities related with another
 There are situations in which you need to know elements related to another based on a specific inverse attribute. For example, to know all the elements that has a specific IfcPropertySet, all elements inside a known IfcBuildingStorey, all elements sharing a common IfcClassificationReference, etc. Let's take the following as examples of this feature!
 */

// This is the equivalent to say: All entities in the model that are contained in structure 138
const storeyElements = indexer.getEntitiesWithRelation(
  model,
  "ContainedInStructure",
  138,
);

console.log(
  `IfcBuildingStorey 138 has the following IfcElement: ${[...storeyElements]}`,
);

// This is the equivalent to say: All entities in the model that contains entity 138
const elementStorey = indexer.getEntitiesWithRelation(
  model,
  "ContainsElements",
  186,
);

console.log(
  `IfcElement 186 is located inside IfcBuildingStorey ${[...elementStorey][0]}`,
);

// This is the equivalent to say: All entities in the model that are defined by entity 303
const psetDefinitions = indexer.getEntitiesWithRelation(
  model,
  "IsDefinedBy",
  303,
);

console.log(`${[...psetDefinitions]} are defined by IfcPropertySet 303`);

/* MD
  :::tip

 Needless to say, you must know the expressID of the entity you want to find its relations (138 is the expressID of the IfcBuildingStorey named "Nivel 1" in the example model).

 :::

 ### 🆕 Creating relations between entities
 Getting the relations between entities is great, but making them is what really takes your BIM apps to the next level. We really care about information in the IFC file (because it is database it-self) and the indexer makes possible (and also really easy!) to start building relations between elements to then save them into the file. Let's take a look how this works to create an assign a new IfcPropertySet!

 The first thing we need is to create at least one IfcPropertySingleValue and one IfcPropertySet using the web-ifc API:
 */

const propsManager = components.get(OBC.IfcPropertiesManager);
const ownerHistory = await propsManager.getEntityRef(
  model,
  WEBIFC.IFCOWNERHISTORY,
);

const property = new WEBIFC.IFC4X3.IfcPropertySingleValue(
  new WEBIFC.IFC4X3.IfcIdentifier("Property Name"),
  null,
  new WEBIFC.IFC4X3.IfcLabel("Property Value"),
  null,
);

// Is important to use the IfcPropertiesManager to register the change
await propsManager.setData(model, property);

const pset = new WEBIFC.IFC4X3.IfcPropertySet(
  new WEBIFC.IFC4X3.IfcGloballyUniqueId(OBC.UUID.create()),
  ownerHistory ? ownerHistory[0] : null,
  new WEBIFC.IFC4X3.IfcLabel("My New Pset!"),
  null,
  [new WEBIFC.Handle(property.expressID)],
);

await propsManager.setData(model, pset);

/* MD
 Once the IfcPropertySingleValue and IfcPropertySet have been created and properly registered, let's assign the IfcPropertySet to all IfcWallStandardCase in the model using the IfcRelationsIndexer component 👇
 */

const walls = (await model.getAllPropertiesOfType(WEBIFC.IFCWALLSTANDARDCASE))!;
const expressIDs = Object.values(walls).map(
  (wall) => wall.expressID,
) as number[];

// This is what makes the magic.
// You need to know the name of the IfcRelationship that defines a relation between an IfcObject and an IfcPropertySet
// Also, you need to know the name of the inverse attribute to specify how they related to each other
indexer.addEntitiesRelation(
  model,
  pset.expressID,
  {
    type: WEBIFC.IFCRELDEFINESBYPROPERTIES,
    inv: "DefinesOcurrence",
  },
  ...expressIDs,
);

/* MD
 The following is another way of doing the same thing (you can choose which to use based on your needs), just that we iterate each IfcWallStandardCase and tell it is defined by the IfcPropertySet created earlier. Despite it produce the same result, the relation will only be stablish once.
 */

for (const wallID in walls) {
  indexer.addEntitiesRelation(
    model,
    Number(wallID),
    { type: WEBIFC.IFCRELDEFINESBYPROPERTIES, inv: "IsDefinedBy" },
    pset.expressID,
  );
}

/* MD
  :::tip

  You need to have a little understanding of the IfcRelationship in the IFC schema to effectively use this IfcRelationsIndexer feature. You can start by taking a look at the [corresponding documentation](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcRelationship.htm).

  :::

  ### ⏱️ Measuring the performance (optional)
  ---

  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI export the relations that we just generated. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC Relations Indexer Tutorial" class="options-menu">
  <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async () => {
            downloadJSON(allRelationsJSON, "relations-index-all.json");
          }}">  
        </bim-button>        

        <bim-button 
          label="Download Model" 
          @click="${async () => {
            const propsManager = components.get(OBC.IfcPropertiesManager);
            try {
              const newIfc = await propsManager.saveToIfc(model, typedArray);
              const ifcFile = new File([newIfc], "new.ifc");
              const a = document.createElement("a");
              a.href = URL.createObjectURL(ifcFile);
              a.download = ifcFile.name;
              a.click();
              URL.revokeObjectURL(a.href);
            } catch (error) {
              alert(error);
            }
          }}">  
        </bim-button>        

      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
});

document.body.append(button);

/* MD
  ### 🎉 Wrap up
  ---

  That's it! Now you know how to get an easy way to get the relations of your model. Keep going with more tutorials! 💪
*/
