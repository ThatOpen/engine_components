// TODO: Update this tutorial

// Set up scene (see SimpleScene tutorial)
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
components.scene = sceneComponent;

const rendererComponent = new OBC.PostproductionRenderer(components, container);
components.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
components.camera = cameraComponent;

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

/* MD
  ### 🍱 Keeping things tidy
  ___
  BIM applications are complex and can have a lot of different functionalities. We distinguish between 2 types of
  functionalities:

  - Components: self-contained pieces of logic that can be used to create tools.
  - Tools: Features for the end user. They are unique and accessible from anywhere.

  For example: the EdgesClipper of this library is a `tool`, and it can create, edit and destroy clipping planes. Each
  clipping plane is a `component`.

    :::info Why unique? 🤔

  Tools are unique because you generally want one object to handle a specific feature. That way, we foster the single
  responsibility principle. That means that each tool has an UUID (Universal Unique ID).

  :::

  Luckily, there's an easy way to handle this: the [Tools Component](../api/classes/components.ToolComponent)!
  This component has two purposes:

  - Making your components available anywhere in your application.
  - Getting your tools from [That Open Platform](../that-open-platform/getting-started.mdx).

  ### ✨ Components anywhere
  ___
  First, we will create a very simple tool: a [simple grid component](../api/classes/components.SimpleGrid). It's not
  very exciting, but we don't want to distract you with the fanciness of more complex tools! This same workflow will work for
  any other component that you use.

  First, let's instantiate it:
  */

// @ts-ignore
const grid = new OBC.SimpleGrid(components);

/* MD
  Now, it is likely that your application will have many menus. What if you need access to this component in many
  places? For example, you may have a menu that controls the color and size of the grid, and other menus that goes
  into floor plan navigation mode and need to hide the grid.

  Now, getting the SimpleGrid component back is as easy as using the `get()` method and passing the id of the
  component as an argument. That's it! 👇

  */

// @ts-ignore
const simpleGrid = await components.tools.get(OBC.SimpleGrid);

/* MD
   :::info Psst... it get's even easier! 🧠

  You don't even need to instantiate the tool yourself. You can simply call `components.tools.get` and if the component
  was not instantiated, the library will instantiate it for you! keep in mind that tools are designed to be singletons, so
  you should never create more than one instance of a tool.

  :::

  The components library will also take care of releasing the memory of all the tools you create as soon as you call
  `components.dispose()`.

  ### ⛅ Tools from the cloud
  ___
  Maybe you have uploaded some tools to That Open Platform and want to easily share them with someone. Or maybe you
  have got some nice tools in That Open Store and want to use them in your app. Either way, using these components
  is a piece of cake with ToolComponent!

   :::tip What's That Open Platform?

  That Open Platform is a place where people can share and make money from their tools. You can learn more about
  how to get started [right here](../that-open-platform/getting-started.mdx).

  :::

  For example, let's fetch an example tool from the platform and add it to a simple toolbar. This is a
  simple tool that just logs a message to the console:

    */

components.tools.init(OBC);
components.tools.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNjUwNmYyZjk0NWM4YmM2YTk0Mzg0NjM4IiwiYSI6IjY1MDhhN2VjZGZjYTQ5Mjc2MmE0YjFlZiJ9.Rr7bq9qJdm4pRUnXF0pUt9QhrtJLOS6koVyZMcf5XoU";
// const toolID = "50301542-4c0b-42ca-b2b4-066d45ca6735";
// const tool = await components.tools.getPlatformComponent(toolID);
// const button = tool.uiElement.get("Measure");
// button.materialIcon = "straighten";

// const toolbar = new OBC.Toolbar(components);
// components.ui.addToolbar(toolbar);
// toolbar.addChild(button);

/* MD

  Fantastic work! 🎉🎉🎉 Now you know how to keep your `Tools` tidy and how to get them from the cloud. Another
step forward in your journey to build your own BIM software. 🥳 Don't forget to check out That Open Platform if
you haven't already!

*/
