/* MD
  ### Reviewing Your IFC Files 🧐
  ---
  The buildingSMART has been creating nice standards for the AEC just like IFC for BIM models and BCF for communication. The two of them are great, but when it comes to review if an IFC file complies with some requirements there is the perfect standard for it: IDS. In That Open Engine is possibile not only to create IDS files, but also to import and export then; in this tutorial you will learn everything you need to know to get started!

  ### 🚧 Scaffolding The Project
  ---
  Before we dive in, let's create a very simple app with the engine. Start by including the dependencies:
  */

import * as FRAGS from "@thatopen/fragments";
// You have to import from @thatopen/components
import * as OBC from "../..";

/* MD
  Then, let's initialize components and also load an IFC file we can use to test some requirements against:
  */

const components = new OBC.Components();

const workerUrl =
  "/node_modules/@thatopen/fragments/dist/Worker/worker.mjs";
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

const file = await fetch("/resources/test/HNS-CTL-MOD-EST-001.frag");
const buffer = await file.arrayBuffer();
await fragments.core.load(buffer, { modelId: "example" });
// const ifcLoader = components.get(OBC.IfcLoader);
// await ifcLoader.setup();
// const file = await fetch(
//   "https://thatopen.github.io/engine_components/resources/small.ifc",
// );
// const data = await file.arrayBuffer();
// const buffer = new Uint8Array(data);
// const model = await ifcLoader.load(buffer);
// world.scene.three.add(model);

// const indexer = components.get(OBC.IfcRelationsIndexer);
// await indexer.process(model);

// const idsFile = await fetch("/resources/specs.ids");
// const idsContent = await idsFile.text();
// const specs = ids.load(idsContent);
// console.log(ids, specs);

// const specification = ids.create("My First IDS!", ["IFC4X3_ADD2"]);
// specification.description = "Description";
// specification.instructions = "Instructions";

// Define some facets to be used in specifications
const entityFacet = new OBC.IDSEntity(components, {
  type: "enumeration",
  parameter: ["IFCSITE"],
});

const items: OBC.ModelIdMap = {};
await entityFacet.getEntities([/example/], items);

const result: OBC.ModelIdDataMap<OBC.IDSItemCheckResult> = new FRAGS.DataMap();
const materialFacet = new OBC.IDSMaterial(components);
await materialFacet.test(items, result);
console.log(result);

// specification.applicability.add(entityFacet);

// const propertyFacet = new OBC.IDSProperty(
//   components,
//   { type: "simple", parameter: "Dimensiones" },
//   { type: "simple", parameter: "Area" },
// );

// const attributeFacet = new OBC.IDSAttribute(components, {
//   type: "simple",
//   parameter: "asdasd",
// });

// attributeFacet.value = { type: "simple", parameter: 0 };

// propertyFacet.dataType = "IFCREAL";
// propertyFacet.value = { type: "simple", parameter: 5.8520157500041 };
// propertyFacet.value = {
//   type: "bounds",
//   parameter: { max: 5.796520000000004, maxInclusive: true },
// };

// const finder = components.get(OBC.ItemsFinder);
// const queryResult = await finder.getItems([
//   {
//     categories: [/PROPERTYSET/, /ELEMENTQUANTITY/],
//     attributes: { queries: [{ name: /^Name$/, value: /^Dimensiones$/ }] },
//     relation: {
//       name: "HasProperties",
//       query: { attributes: { queries: [{ name: /^Name$/, value: /^Area$/ }] } },
//     },
//   },
// ]);

// const localIds = queryResult.example;
// if (localIds.size !== 0) {
//   console.log(
//     await model.getItemsData([...localIds], {
//       relations: { HasProperties: { attributes: true, relations: false } },
//     }),
//   );
// } else {
//   console.log("Nothing");
// }

// const spec = ids.create("Custom Specification", ["IFC4"]);
// spec.applicability.add(entityFacet);
// spec.requirements.add(attributeFacet, propertyFacet);
// const result = await spec.test([/example/]);
// console.log(result);

// propertyFacet.value = {
//   type: "length",
//   parameter: { length: 10 },
// };

// The name attribute must exist
// const attributeFacet = new OBC.IDSAttribute(components, {
//   type: "simple",
//   parameter: "Name",
// });

// const collector = {};
// await entityFacet.getEntities([/example/], collector);
// const result = await attributeFacet.test(collector);
// console.log(result);

// const spec = ids.create("Specification name", ["IFC4"]);
// spec.applicability.add(entityFacet);
// spec.requirements.add(propertyFacet, attributeFacet);

// const xml = ids.export({
//   title: "My nice requirements file",
// });

// console.log(xml);

// const idsTitle = "My Custom IDS";
// const idsExport = ids.export({ title: idsTitle });
// const file = new File([idsExport], "idsTitle.ids");
// const a = document.createElement("a");
// a.href = URL.createObjectURL(file);
// a.download = file.name;
// a.click();
// URL.revokeObjectURL(a.href);

// const classificationFacet = new OBC.IDSClassification(components, {
//   type: "simple",
//   parameter: "Uniformat",
// });

// const partOfFacet = new OBC.IDSPartOf(components, {
//   name: { type: "simple", parameter: "IFCBUILDINGSTOREY" },
// });

// partOfFacet.relation = WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE;

// // IfcSlab entities must have a Pset_SlabCommon with an IsExternal property set to false
// const entitiesA: FRAGS.IfcProperties = {};
// await entityFacet.getEntities(model, entitiesA);
// const resultA = await propertyFacet.test(entitiesA, model);
// logResult(resultA);

// // Entities with a Pset_SlabCommon including an IsExternal property set to false, must be IfcSlab
// const entitiesB: FRAGS.IfcProperties = {};
// await propertyFacet.getEntities(model, entitiesB);
// const resultB = await entityFacet.test(entitiesB);
// logResult(resultB);

// // Entities with Uniformat IfcClassification must be IfcSlab
// const entitiesC: FRAGS.IfcProperties = {};
// await classificationFacet.getEntities(model, entitiesC);
// const resultC = await entityFacet.test(entitiesC);
// logResult(resultC);

// // IfcSlab entities must have IfcClassification as Uniformat
// const entitiesD: FRAGS.IfcProperties = {};
// await entityFacet.getEntities(model, entitiesD);
// const resultD = await classificationFacet.test(entitiesD, model);
// logResult(resultD);

// // IfcSlab entities must be related with IfcBuildingStorey
// const entitiesE: FRAGS.IfcProperties = {};
// await entityFacet.getEntities(model, entitiesE);
// const resultE = await partOfFacet.test(entitiesE, model);
// logResult(resultE);

// // Entities related with any IfcBuildingStorey must have a Pset_SlabCommon with an IsExternal property set to false
// const entitiesF: FRAGS.IfcProperties = {};
// await partOfFacet.getEntities(model, entitiesF);
// const resultF = await propertyFacet.test(entitiesF, model);
// logResult(resultF);

// Importing
// const idsFile = await fetch(
//   "https://raw.githubusercontent.com/buildingSMART/IDS/development/Documentation/ImplementersDocumentation/TestCases/attribute/fail-a_prohibited_facet_returns_the_opposite_of_a_required_facet.ids",
// );
// const idsFile = await fetch("/resources/ids.ids");

// const idsData = await idsFile.text();
// const imports = ids.load(idsData);
// for (const spec of imports) {
//   const app = [...spec.applicability][0];
//   const req = [...spec.requirements][0];
//   const entities: FRAGS.IfcProperties = {};
//   await app.getEntities(model, entities);
//   const result = await req.test(entities, model);
//   logResult(result);
// }

// Load test cases from GitHub
// Define the URL for fetching the files list
// const apiURL =
//   "https://api.github.com/repos/buildingSMART/IDS/contents/Documentation/ImplementersDocumentation/TestCases/property?ref=development";

// Function to process each pair of IFC and IDS files
// async function processPair(ifcUrl: string, idsUrl: string) {
//   try {
//     const routes = ifcUrl.split("/");
//     const name = routes[routes.length - 1];
//     const pieces = name.split("-");
//     const bsResult = pieces[0] === "pass";

//     // Fetch the IFC and IDS content
//     const ifcResponse = await fetch(ifcUrl);
//     const idsResponse = await fetch(idsUrl);

//     if (!ifcResponse.ok || !idsResponse.ok) {
//       throw new Error("Error fetching IFC or IDS file");
//     }

//     const ifcContent = await ifcResponse.arrayBuffer();
//     const idsContent = await idsResponse.text();

//     const importer = new FRAGS.IfcImporter();
//     importer.wasm = {
//       absolute: true,
//       path: "https://unpkg.com/web-ifc@0.0.70/",
//     };

//     const asd = await fetch("/resources/ifc/test/generic/school_str.ifc");
//     const fragBytes = await importer.process({
//       bytes: new Uint8Array(ifcContent),
//     });

//     const model = await fragments.core.load(fragBytes, { modelId: ifcUrl });
//     console.log(model);

//     const imports = ids.load(idsContent);
//     console.log(imports);
//     // for (const spec of imports) {
//     //   const app = [...spec.applicability][0];
//     //   const req = [...spec.requirements][0];
//     //   const entities: FRAGS.IfcProperties = {};
//     //   await app.getEntities(model, entities);
//     //   const result = await req.test(entities, model);
//     //   const passes = result.filter(({ pass }) => pass);
//     //   const fails = result.filter(({ pass }) => !pass);
//     //   console.log(bsResult, passes, fails, ifcUrl, idsUrl);
//     // }

//     // Use your custom loaders for IFC and IDS
//     // customIfcLoader(ifcContent);
//     // customIdsLoader(idsContent);

//     // console.log(`Successfully processed pair: ${ifcUrl}, ${idsUrl}`);
//   } catch (error) {
//     console.error(`Error processing pair: ${ifcUrl}, ${idsUrl}`, error);
//   }
// }

// Function to fetch the list of files and group them by pairs (IFC + IDS)
// async function fetchFileListAndProcessPairs() {
//   try {
//     const response = await fetch(apiURL);

//     if (!response.ok) {
//       throw new Error(`Error fetching files list: ${response.statusText}`);
//     }

//     const files = await response.json();
//     const filePairs: { [key: string]: { ifc?: string; ids?: string } } = {};

//     // Group files by their base names
//     for (const file of files) {
//       const fileName = file.name;

//       // Extract the base name (everything before the file extension)
//       const baseName = fileName.split(".").slice(0, -1).join(".");

//       // Check if the file is an .ifc or .ids and group them
//       if (fileName.endsWith(".ifc")) {
//         if (!filePairs[baseName]) filePairs[baseName] = {};
//         filePairs[baseName].ifc = file.download_url;
//       } else if (fileName.endsWith(".ids")) {
//         if (!filePairs[baseName]) filePairs[baseName] = {};
//         filePairs[baseName].ids = file.download_url;
//       }
//     }

//     // Now process each pair using the custom loaders
//     for (const baseName in filePairs) {
//       const { ifc, ids } = filePairs[baseName];

//       if (ifc && ids) {
//         // console.log(`Processing pair: ${baseName}`);
//         await processPair(ifc, ids);
//       } else {
//         // console.warn(`Pair incomplete for ${baseName}`);
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// Call the function to fetch and process file pairs
// fetchFileListAndProcessPairs();

// const baseURL =
//   "https://raw.githubusercontent.com/buildingSMART/IDS/development/Documentation/ImplementersDocumentation/TestCases";
// const url = `${baseURL}/classification/fail-a_classification_facet_with_no_data_matches_any_classification_1_2`;
// processPair(`${url}.ifc`, `${url}.ids`);
