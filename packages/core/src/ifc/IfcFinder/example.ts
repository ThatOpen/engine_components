/* MD
### 🏢 Loading IFC files
---

IFC is complex, and sometimes we want to look for items using complex filters. For instance, imagine we want to target all items in a file that have a property called FireProtection. This is due to the indirection present in most IFC files. Luckily for you, we have a component to easily perform complex queries on any IFC: the IfcFinder. In this tutorial, you'll learn how to use it.

:::tip What does the finder do?

The finder is a powerful text scanner that can make complex queries in one or multiple IFC files. You can use regular expressions, operators, combine multiple filters, etc.

:::

In this tutorial, we will import:

- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as BUI from "@thatopen/ui";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";

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

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC fileResponse.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const fragments = new OBC.FragmentsManager(components);
const fragFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const data = await fragFile.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const indexer = components.get(OBC.IfcRelationsIndexer);
const relationsFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small-relations.json",
);
const relations = indexer.getRelationsMapFromJSON(await relationsFile.text());
indexer.setRelationMap(model, relations);

/* MD
  ### 🔎 Setting up the finder
  ---

 Now, let's get the finder component and create a new queryGroup. A query group is a set of questions we can apply to one or many models.
*/

const finder = components.get(OBC.IfcFinder);
const queryGroup = finder.create();

/* MD
 Now we need an IFC file to feed to the finder. The finder operates on IFC files directly, so it can perform high-performance text queries.
*/

const fileResponse = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const ifcFile = new File([await fileResponse.arrayBuffer()], "example");

/* MD
 Great! Now, let's create our first query. There are different types of queries. You'll have to pick one or another depending on the type of data you are looking for. In this case we want to check the direct attributes of elements, so we will use an IfcBasicQuery.
*/

const basicQuery = new OBC.IfcBasicQuery(components, {
  name: "category",
  inclusive: false,
  rules: [],
});

queryGroup.add(basicQuery);

/* MD
 Great job! Now we have a query, but it's empty. Queries are made of rules. There are rules of different types for different purposes. In this case we want to filter the walls, so let's a
*/

const categoryRule: OBC.IfcCategoryRule = {
  type: "category",
  value: /IfcWallStandardCase/,
};

basicQuery.rules.push(categoryRule);

/* MD
 Awesome! Now, our library has better ways to filter by category, so what's the point of the finder? Well, let's make something a bit more complex. Imagine we want to look for any object that has any property (in a pset) with the word yeso (plaster in spanish). We can do this easily with the finder using another type of query: a property query.
*/

const propertyRule: OBC.IfcPropertyRule = {
  type: "property",
  name: /.*/,
  value: /yeso/,
};

const propertyQuery = new OBC.IfcPropertyQuery(components, {
  name: "property",
  inclusive: false,
  rules: [propertyRule],
});

queryGroup.add(propertyQuery);

/* MD
 Great! Now, to perform the query we just need to update the group, and we can then get the items resulting from all the queries of the query group. To illustrate this, we'll isolate the found items in the scene:
*/

await queryGroup.update(model.uuid, ifcFile);
const items = queryGroup.items;

const hider = components.get(OBC.Hider);
hider.set(false);
hider.set(true, items);

/* MD
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
Now we will add some UI to play around with the Finder, isolating the items that it finds in the scene. For more information about the UI library, you can check the specific documentation for it!
*/

const categoryInput = BUI.Component.create<BUI.TextInput>(() => {
  return BUI.html`
  <bim-text-input label="Category" value="${categoryRule.value.source}"></bim-text-input>
  `;
});

const propertyInput = BUI.Component.create<BUI.TextInput>(() => {
  return BUI.html`
  <bim-text-input label="Property" value="${propertyRule.value.source}"></bim-text-input>
  `;
});

const updateFinder = async () => {
  basicQuery.clear();
  propertyQuery.clear();
  categoryRule.value = new RegExp(categoryInput.value);
  propertyRule.value = new RegExp(propertyInput.value);
  await queryGroup.update(model.uuid, ifcFile);
  const items = queryGroup.items;
  console.log(items);
  if (Object.keys(items).length === 0) {
    alert("No items found!");
    return;
  }
  hider.set(false);
  hider.set(true, items);
};

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${categoryInput}
        ${propertyInput}
      
        <bim-button label="Update"
          @click="${async () => {
            await updateFinder();
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

  That's it! You have created an app that can make complex text queries in an IFC. Congratulations!
*/
