/**
 * Minimal @thatopen/components example in pure Node.js.
 *
 * The components library is primarily a browser/rendering library, but the
 * Components registry and several data-oriented components (Viewpoints,
 * BCFTopics, Clipper, ...) work in Node without a WebGL context as long as
 * you don't attach a renderer. This script shows the pattern: create a
 * Components instance, create a viewpoint with some BCF data, save it to
 * disk as JSON.
 *
 * Rendering in Node (generating actual image snapshots) needs a headless
 * WebGL context plus DOM + Worker polyfills; the pragmatic route for that
 * is Puppeteer / Playwright, which run a real browser headlessly.
 *
 * Run with:
 *   tsx packages/core/src/core/Worlds/node-example.ts
 */

import * as fs from "fs";
import * as THREE from "three";

import * as OBC from "../..";

async function run() {
  const components = new OBC.Components();

  // A viewpoint can optionally reference a world to pull camera state from.
  // We create one without a renderer — Worlds allows that — and give it a
  // plain PerspectiveCamera wrapped as a BaseCamera.
  const worlds = components.get(OBC.Worlds);
  const world = worlds.create();
  world.scene = new OBC.SimpleScene(components);

  // Not calling components.init(): it starts a requestAnimationFrame update
  // loop, which Node doesn't expose. Data-only scripts like this one don't
  // need it; the components we use below work against the registry alone.

  // Create a BCF viewpoint with a camera pose and a selection of IFC GUIDs.
  const viewpoints = components.get(OBC.Viewpoints);

  const viewpoint = viewpoints.create({
    title: "Front entrance",
    perspective_camera: {
      camera_view_point: { x: 10, y: 5, z: 10 },
      camera_direction: { x: -1, y: -0.5, z: -1 },
      camera_up_vector: { x: 0, y: 1, z: 0 },
      field_of_view: 60,
      aspect_ratio: 16 / 9,
    },
    components: {
      selection: [
        { ifc_guid: "3u4vLH8Q12BxpD8wz1yExq", authoring_tool_id: null },
        { ifc_guid: "0pc0WQ8Q1BQgKEq0fWbZmT", authoring_tool_id: null },
      ],
      coloring: [],
      visibility: {
        default_visibility: true,
        exceptions: [],
        view_setup_hints: {
          spaces_visible: false,
          space_boundaries_visible: false,
          openings_visible: false,
        },
      },
    },
  });

  // Sanity-check: compute a bounding sphere from the camera position for a
  // downstream renderer (just plain three.js math, no components needed).
  const pos = new THREE.Vector3(10, 5, 10);
  const target = pos.clone().add(new THREE.Vector3(-1, -0.5, -1).normalize());
  console.log(`Camera at ${pos.toArray()}, looking at ${target.toArray()}.`);

  // Serialize to JSON (BCF-shaped) and to BCF-XML.
  const json = viewpoint.toJSON();
  const xml = await viewpoint.serialize();

  fs.writeFileSync("viewpoint.json", JSON.stringify(json, null, 2));
  fs.writeFileSync("viewpoint.bcfv", xml);

  console.log(
    `Saved viewpoint ${viewpoint.guid} to viewpoint.json and viewpoint.bcfv.`,
  );
  console.log(`Total viewpoints: ${viewpoints.list.size}.`);

  // The JSON produced here can be consumed by any BCF-aware viewer (including
  // a browser running the same components library) to restore the camera and
  // selection, and then render a snapshot from the matching model.
}

run();
