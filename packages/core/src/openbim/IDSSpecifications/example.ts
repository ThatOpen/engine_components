import * as WEBIFC from "web-ifc";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "../..";

const components = new OBC.Components();
const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch("/resources/structure.ifc");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await ifcLoader.load(buffer);

const indexer = components.get(OBC.IfcRelationsIndexer);
await indexer.process(model);

// const ids = components.get(OBC.IDSSpecifications);
// const specifications = ids.create("My First IDS!", "IFC4X3");

// Define some facets to be used in specifications
const entityFacet = new OBC.IDSEntityFacet(components, WEBIFC.IFCSLAB);
const propertyFacet = new OBC.IDSPropertyFacet(
  components,
  { type: "simpleValue", value: "Pset_SlabCommon" },
  { type: "simpleValue", value: "IsExternal" },
);

propertyFacet.value = { type: "simpleValue", value: false };

const classificationFacet = new OBC.IDSClassificationFacet(components, {
  type: "simpleValue",
  value: "Uniformat",
});

const partOfFacet = new OBC.IDSPartOfFacet(
  components,
  WEBIFC.IFCBUILDINGSTOREY,
);

partOfFacet.relation = WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE;

// IfcSlab entities must have a Pset_SlabCommon with an IsExternal property set to false
const entitiesA: FRAGS.IfcProperties = {};
await entityFacet.getEntities(model, entitiesA);
const resultA = await propertyFacet.test(entitiesA, model);
console.log(resultA);

// Entities with a Pset_SlabCommon including an IsExternal property set to false, must be IfcSlab
const entitiesB: FRAGS.IfcProperties = {};
await propertyFacet.getEntities(model, entitiesB);
const resultB = await entityFacet.test(entitiesB);
console.log(resultB);

// Entities with Uniformat IfcClassification must be IfcSlab
const entitiesC: FRAGS.IfcProperties = {};
await classificationFacet.getEntities(model, entitiesC);
const resultC = await entityFacet.test(entitiesC);
console.log(resultC);

// IfcSlab entities must have IfcClassification as Uniformat
const entitiesD: FRAGS.IfcProperties = {};
await entityFacet.getEntities(model, entitiesD);
const resultD = await classificationFacet.test(entitiesD, model);
console.log(resultD);

// IfcSlab entities must be related with IfcBuildingStorey
const entitiesE: FRAGS.IfcProperties = {};
await entityFacet.getEntities(model, entitiesE);
const resultE = await partOfFacet.test(entitiesE, model);
console.log(resultE);

// Entities related with any IfcBuildingStorey must have a Pset_SlabCommon with an IsExternal property set to false
const entitiesF: FRAGS.IfcProperties = {};
await partOfFacet.getEntities(model, entitiesF);
const resultF = await propertyFacet.test(entitiesF, model);
console.log(resultF);
