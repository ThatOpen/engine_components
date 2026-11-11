import { describe, expect, it } from "vitest";
import { loadSourceBundle } from "../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

describe("Viewpoint.go", () => {
  it("rejects with a clear error when the viewpoint has no world", async () => {
    const components = new OBC.Components();
    const viewpoints = components.get(OBC.Viewpoints);
    expect(viewpoints.world).toBeNull();
    const viewpoint = viewpoints.create();
    await expect(viewpoint.go()).rejects.toThrow(/no world/);
  });
});
