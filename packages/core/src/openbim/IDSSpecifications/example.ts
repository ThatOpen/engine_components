// import * as FRAGS from "@thatopen/fragments";
import * as OBC from "../..";

const components = new OBC.Components();
const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
// const file = await fetch("/resources/structure.ifc");
// const file = await fetch(
//   "https://raw.githubusercontent.com/buildingSMART/IDS/development/Documentation/ImplementersDocumentation/TestCases/attribute/fail-a_prohibited_facet_returns_the_opposite_of_a_required_facet.ifc",
// );
// const data = await file.arrayBuffer();
// const buffer = new Uint8Array(data);
// const model = await ifcLoader.load(buffer);

// const indexer = components.get(OBC.IfcRelationsIndexer);
// await indexer.process(model);

const ids = components.get(OBC.IDSSpecifications);
const idsFile = await fetch("/resources/specs.ids");
const idsContent = await idsFile.text();
const specs = ids.load(idsContent);
console.log(ids, specs);

// const specification = ids.create("My First IDS!", ["IFC4X3_ADD2"]);
// specification.description = "Description";
// specification.instructions = "Instructions";

// Define some facets to be used in specifications
const entityFacet = new OBC.IDSEntity(components, {
  type: "enumeration",
  parameter: ["IFCSLAB", "IFCWALL"],
});

// specification.applicability.add(entityFacet);

const propertyFacet = new OBC.IDSProperty(
  components,
  { type: "simple", parameter: "Pset_SlabCommon" },
  { type: "simple", parameter: "IsExternal" },
);

propertyFacet.value = { type: "simple", parameter: false };

// specification.requirements.add(propertyFacet);

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

//     const model = await ifcLoader.load(new Uint8Array(ifcContent));
//     await indexer.process(model);

//     const imports = ids.load(idsContent);
//     for (const spec of imports) {
//       const app = [...spec.applicability][0];
//       const req = [...spec.requirements][0];
//       const entities: FRAGS.IfcProperties = {};
//       await app.getEntities(model, entities);
//       const result = await req.test(entities, model);
//       const passes = result.filter(({ pass }) => pass);
//       const fails = result.filter(({ pass }) => !pass);
//       console.log(bsResult, passes, fails, ifcUrl, idsUrl);
//     }

//     // Use your custom loaders for IFC and IDS
//     // customIfcLoader(ifcContent);
//     // customIdsLoader(idsContent);

//     // console.log(`Successfully processed pair: ${ifcUrl}, ${idsUrl}`);
//   } catch (error) {
//     // console.error(`Error processing pair: ${ifcUrl}, ${idsUrl}`, error);
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
// const url = `${baseURL}/property/pass-a_number_specified_as_a_string_is_treated_as_a_string`;
// processPair(`${url}.ifc`, `${url}.ids`);
