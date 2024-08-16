// // eslint-disable-next-line import/no-extraneous-dependencies
// import * as BUI from "@thatopen/ui";
// import * as THREE from "three";
// import * as FRAGS from "@thatopen/fragments";
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { createRef } from "lit/directives/ref.js";
// // eslint-disable-next-line import/no-extraneous-dependencies
// import * as OBC from "../..";
// import { bcfTopicsList } from "./src/TopicsList";
// import { topicForm } from "./src/TopicForm";
// import { topicPanel } from "./src/TopicPanel";
// import { viewpointsList } from "./src/ViewpointsList";

// BUI.Manager.init();

// const components = new OBC.Components();

// const worlds = components.get(OBC.Worlds);
// const world = worlds.create();

// const sceneComponent = new OBC.SimpleScene(components);
// sceneComponent.setup();
// world.scene = sceneComponent;

// world.scene.three.add(new THREE.AxesHelper(10));

// const viewport = document.createElement("bim-viewport");
// const rendererComponent = new OBC.SimpleRenderer(components, viewport);
// world.renderer = rendererComponent;

// const cameraComponent = new OBC.SimpleCamera(components);
// world.camera = cameraComponent;

// viewport.addEventListener("resize", () => {
//   rendererComponent.resize();
//   cameraComponent.updateAspect();
// });

// const viewportGrid = document.createElement("bim-grid");
// viewportGrid.floating = true;
// viewport.append(viewportGrid);

// const viewerGrids = components.get(OBC.Grids);
// viewerGrids.create(world);

// components.init();

// const ifcLoader = components.get(OBC.IfcLoader);
// await ifcLoader.setup();

// const indexer = components.get(OBC.IfcRelationsIndexer);

// const fragments = components.get(OBC.FragmentsManager);
// fragments.onFragmentsLoaded.add(async (model) => {
//   world.scene.three.add(model);
//   if (model.hasProperties) await indexer.process(model);
//   for (const fragment of model.items) world.meshes.add(fragment.mesh);
// });

// const loadModels = async (urls: string[]) => {
//   const models: FRAGS.FragmentsGroup[] = [];
//   for (const url of urls) {
//     const file = await fetch(url);
//     const data = await file.arrayBuffer();
//     const buffer = new Uint8Array(data);
//     const model = await ifcLoader.load(buffer);
//     models.push(model);
//   }
//   return models;
// };

// const models = await loadModels([
//   "https://thatopen.github.io/engine_components/resources/small.ifc",
// ]);

// // const models = await loadModels([
// //   "/resources/NAV-IPI-ET1_E03-ZZZ-M3D-EST.ifc",
// //   "/resources/NAV-IPI-ET1_E07-ZZZ-M3D-EST.ifc",
// // ]);

// const model = models[0];

// const bcfTopics = components.get(OBC.BCFTopics);
// bcfTopics.setup({
//   types: new Set([...bcfTopics.config.types, "Information", "Coordination"]),
//   statuses: new Set(["Active", "In Progress", "Done", "In Review", "Closed"]),
//   users: new Set(["juan.hoyos4@gmail.com"]),
// });

// const viewpoints = components.get(OBC.Viewpoints);

// // Creating a custom Topic
// const topicsUIStyles = {
//   users: {
//     "jhon.doe@example.com": {
//       name: "Jhon Doe",
//       picture:
//         "https://www.profilebakery.com/wp-content/uploads/2023/04/Profile-Image-AI.jpg",
//     },
//     "juan.hoyos4@gmail.com": {
//       name: "Juan Hoyos",
//       picture:
//         "https://media.licdn.com/dms/image/D4E03AQEo2otgxQ8Y3A/profile-displayphoto-shrink_200_200/0/1718545012590?e=1728518400&v=beta&t=6s2ULNJHPjbWBTZt_S35e-BN2LHUavVXa2vEljGM2TM",
//     },
//   },
// };

// const [topicPopup, updateTopicPopup] = BUI.Component.create<
//   HTMLDialogElement,
//   { topic?: OBC.Topic }
// >((state: { topic?: OBC.Topic }) => {
//   const { topic } = state;
//   const dialog = createRef<HTMLDialogElement>();

//   const [form] = topicForm({
//     components,
//     topic,
//     styles: { users: topicsUIStyles.users },
//     onSubmit() {
//       dialog.value?.close();
//     },
//     onCancel() {
//       dialog.value?.close();
//     },
//   });

//   return BUI.html`<dialog ${BUI.ref(dialog)}>${form}</dialog> `;
// }, {});

// document.body.append(topicPopup);

// const [topicUI, updateTopicUI] = topicPanel({
//   components,
//   styles: topicsUIStyles,
//   world,
//   onUpdateInformation(topic) {
//     updateTopicPopup({ topic });
//     topicPopup.showModal();
//   },
// });

// viewportGrid.layouts = {
//   main: {
//     template: `
//       "empty topicPanel" 1fr
//       /1fr 22rem
//     `,
//     elements: { topicPanel: topicUI },
//   },
// };

// const [topicsList] = bcfTopicsList({
//   components,
//   dataStyles: topicsUIStyles,
//   onTopicEnter(topic) {
//     updateTopicUI({ topic });
//     viewportGrid.layout = "main";
//   },
// });

// // Importing an external BCF (topics and viewpoints are going to be created)
// const loadBCFs = async (urls: string[]) => {
//   const data: { viewpoints: OBC.Viewpoint[]; topics: OBC.Topic[] } = {
//     viewpoints: [],
//     topics: [],
//   };

//   for (const url of urls) {
//     const bcfFile = await fetch(url);
//     const bcfData = await bcfFile.arrayBuffer();
//     const { viewpoints, topics } = await bcfTopics.load(
//       world,
//       new Uint8Array(bcfData),
//     );
//     data.viewpoints.push(...viewpoints);
//     data.topics.push(...topics);
//   }

//   return data;
// };

// await loadBCFs([
//   "/resources/topics.bcf",
//   // "/resources/MaximumInformation_2.1.bcf",
//   // "/resources/MaximumInformation_3.0.bcf",
// ]);

// const topic = bcfTopics.create({
//   title: "Missing information",
//   description: "It seems these elements are badly defined.",
//   dueDate: new Date("08-01-2020"),
//   type: "Clash",
//   priority: "Major",
//   stage: "Design",
//   labels: new Set(["Architecture", "Cost Estimation"]),
//   assignedTo: "juan.hoyos4@gmail.com",
// });

// const [topicAGuid] = [...bcfTopics.list][0];
// topic.relatedTopics.add(topicAGuid);

// // Creating a custom viewpoint
// const viewpoint = viewpoints.create(world, { title: "Custom Viewpoint" });
// viewpoint.addComponentsFromMap(model.getFragmentMap([186])); // You can provide a FragmentIdMap to the viewpoint selection
// // viewpoint.selectionComponents.add("2idC0G3ezCdhA9WVjWemcy"); // You can provide a GlobalId to the viewpoint selection
// // viewpoint.selection gives the fragmentIdMap to select elements with the highlighter from @thatopen/components-front
// // you can also use the viewpoint.selection fragmentIdMap to query elements data using FragmentsGroup.getProperty()

// topic.viewpoints.add(viewpoint.guid);
// const comment = topic.createComment("What if we talk about this next meeting?");
// comment.author = "juan.hoyos4@gmail.com";
// topic.createComment("Hi there! I agree.");
// comment.viewpoint = viewpoint;

// const [viewpointsListElement] = viewpointsList({ components });

// const leftPanel = BUI.Component.create(() => {
//   return BUI.html`
//    <bim-panel>
//     <bim-panel-section label="Viewpoints">
//       ${viewpointsListElement}
//     </bim-panel-section>
//    </bim-panel>
//   `;
// });

// const bottomPanel = BUI.Component.create(() => {
//   const onBcfDownload = async () => {
//     const topics = [...topicsList.selection]
//       .map(({ Guid }) => {
//         if (typeof Guid !== "string") return null;
//         return bcfTopics.list.get(Guid);
//       })
//       .filter((topic) => topic) as OBC.Topic[];

//     const bcf = await bcfTopics.export(
//       topics.length !== 0 ? topics : undefined,
//     );
//     const bcfFile = new File([bcf], "topics.bcf");
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(bcfFile);
//     a.download = bcfFile.name;
//     a.click();
//     URL.revokeObjectURL(a.href);
//   };

//   return BUI.html`
//    <bim-panel>
//     <bim-panel-section label="Topics">
//       <div style="display: flex; gap: 0.25rem">
//         <bim-button label="Download" icon="tabler:download" @click=${onBcfDownload}></bim-button>
//         <bim-button style="flex: 0;" label="New Topic" icon="mi:add" @click=${() => topicPopup.showModal()}></bim-button>
//       </div>
//       ${topicsList}
//     </bim-panel-section>
//    </bim-panel>
//   `;
// });

// const app = document.getElementById("app") as BUI.Grid;
// app.layouts = {
//   main: {
//     template: `
//       "leftPanel viewport" 2fr
//       "leftPanel bottomPanel" 1fr
//       / 25rem 1fr
//     `,
//     elements: { leftPanel, viewport, bottomPanel },
//   },
// };

// app.layout = "main";
