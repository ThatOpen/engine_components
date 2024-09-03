import * as WEBIFC from "web-ifc";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "../..";

const components = new OBC.Components();
const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch("/resources/small.ifc");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await ifcLoader.load(buffer);

const world = components.get(OBC.Worlds).create();

const indexer = components.get(OBC.IfcRelationsIndexer);
await indexer.process(model);

// IDS Integration
const collector: FRAGS.IfcProperties = {};

const entityFacet = new OBC.IDSEntityFacet(WEBIFC.IFCSLAB);
await entityFacet.getEntities(model, collector);

const propertyFacet = new OBC.IDSPropertyFacet(
  components,
  { type: "simpleValue", value: "Pset_SlabCommon" },
  { type: "simpleValue", value: "IsExternal" },
);

propertyFacet.value = { type: "simpleValue", value: true };

const result = await propertyFacet.test(collector, model);

// BCF Integration
const bcfTopics = components.get(OBC.BCFTopics);
const viewpoints = components.get(OBC.Viewpoints);

if (result.fail.length > 0) {
  const topic = bcfTopics.create({
    title: "Invalid Property",
    description: "This elements are not external",
  });

  const viewpoint = viewpoints.create(world);
  viewpoint.selectionComponents.add(...result.fail);
  topic.viewpoints.add(viewpoint.guid);
}
