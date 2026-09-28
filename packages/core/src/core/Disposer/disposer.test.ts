import * as THREE from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Components } from "../../index";
import { loadSourceBundle } from "../../../tests/source-bundle";

// Needs the real `Components`, so the whole graph: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

/** A group of `count` meshes, each with its own geometry and material. */
const groupOf = (count: number) => {
  const group = new THREE.Group();
  const meshes = Array.from({ length: count }, () => {
    const mesh = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshBasicMaterial(),
    );
    group.add(mesh);
    return {
      mesh,
      geometry: vi.spyOn(mesh.geometry, "dispose"),
      material: vi.spyOn(mesh.material, "dispose"),
    };
  });
  return { group, meshes };
};

describe("Disposer.destroy", () => {
  let components: Components;
  let disposer: InstanceType<typeof OBC.Disposer>;

  beforeEach(() => {
    components = new OBC.Components();
    disposer = components.get(OBC.Disposer);
  });

  afterEach(() => {
    components.dispose();
  });

  it.each([1, 2, 5, 8])(
    "disposes every one of %i children",
    (count) => {
      const { group, meshes } = groupOf(count);

      disposer.destroy(group);

      const geometries = meshes.filter((m) => m.geometry.mock.calls.length);
      const materials = meshes.filter((m) => m.material.mock.calls.length);
      expect(geometries.length).toBe(count);
      expect(materials.length).toBe(count);
      // Each one is also detached, not merely dropped from the array.
      expect(meshes.filter((m) => m.mesh.parent !== null)).toEqual([]);
      expect(group.children).toEqual([]);
    },
  );

  it("disposes every level of a nested tree", () => {
    const root = new THREE.Group();
    const leaves: ReturnType<typeof groupOf>["meshes"] = [];
    for (let i = 0; i < 4; i++) {
      const { group, meshes } = groupOf(3);
      root.add(group);
      leaves.push(...meshes);
    }

    disposer.destroy(root);

    expect(leaves.filter((m) => !m.geometry.mock.calls.length)).toEqual([]);
  });
});
