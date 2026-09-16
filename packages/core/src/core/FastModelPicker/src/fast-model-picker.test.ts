// @vitest-environment happy-dom
import {
  EditRequestType,
  EditUtils,
  GeomsFbUtils,
  SingleThreadedFragmentsModel,
  type EditRequest,
} from "@thatopen/fragments";
import * as THREE from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Components } from "../../Components";
import type { World } from "../../Types";
import {
  asciiSnapshot,
  recordCanvasBlits,
} from "../../../../tests/canvas-snapshot";
import { FastModelPicker } from "./fast-model-picker";

const MODEL_ID = "authored";

const SIZE = new THREE.Vector2(200, 120);

/** The world-space point the fake GPU readbacks describe. */
const HIT = new THREE.Vector3(1.5, -0.75, 2.25);

/** The surface normal the fake normal pass reports at {@link HIT}. */
const NORMAL = new THREE.Vector3(0, 1, 0);

/**
 * The three helpers below stand in for the GPU: each hand-encodes what one
 * output of the picker's shader would have written, so the fake readbacks
 * decode back to a known point / normal / item. They mirror GLSL that
 * this test cannot run — a real WebGL2 context would mean browser mode —
 * so keep them in step with {@link FastModelPicker.buildPickMaterial}.
 */
const gpuStubs = {
  /**
   * The `id` output: model byte in R, `itemId + 1` (0 = void) in the lower
   * three bytes of GBA.
   */
  idPixel(modelByte: number, itemId: number) {
    const encoded = itemId + 1;
    return new Uint8Array([
      modelByte,
      Math.floor(encoded / 65536) % 256,
      Math.floor(encoded / 256) % 256,
      encoded % 256,
    ]);
  },

  /**
   * The `depth` output: the four-byte depth packing, inverse of the
   * module's `unpackDepthFromRGBA`. The `r.yzw -= r.xyz / 256` step reads
   * the original components, so the subtractions can't be done in place.
   */
  depthPixel(depth: number) {
    const fract = (value: number) => value - Math.floor(value);
    const r = [
      fract(depth * 16777216),
      fract(depth * 65536),
      fract(depth * 256),
      depth,
    ];
    const packed = [
      r[0],
      r[1] - r[0] / 256,
      r[2] - r[1] / 256,
      r[3] - r[2] / 256,
    ];
    return new Uint8Array(
      packed.map((value) => Math.min(255, Math.round(value * 256))),
    );
  },

  /**
   * The `normal` output: `normal * 0.5 + 0.5` in RGB, alpha = 1.
   */
  normalPixel(normal: THREE.Vector3) {
    return new Uint8Array([
      ...normal.toArray().map((value) => Math.round((value * 0.5 + 0.5) * 255)),
      255,
    ]);
  },
};

/**
 * The picker's render target attachments, as laid out by the pick shader's
 * `layout(location)`s. Keep in step with `PickOutput`.
 */
const ATTACHMENT = { id: 0, depth: 1, normal: 2 } as const;

/**
 * Enough of `THREE.WebGLRenderer` for the pick render: every render is a
 * no-op and `readRenderTargetPixels` hands back the pixel queued for the
 * attachment it reads, so the tests decide what the GPU "saw".
 */
const createRenderer = () => {
  /** Pixel each attachment reads back, by attachment index. */
  const pixels: Uint8Array[] = [];
  /** Whole-frame contents for reads bigger than a pixel, by attachment. */
  const frames: Uint8Array[] = [];
  let target: THREE.WebGLRenderTarget | null = null;
  return {
    pixels,
    frames,
    autoClear: true,
    clippingPlanes: [] as THREE.Plane[],
    shadowMap: { autoUpdate: true, needsUpdate: false },
    domElement: document.createElement("canvas"),
    getSize: vi.fn((into: THREE.Vector2) => into.copy(SIZE)),
    getRenderTarget: vi.fn(() => target),
    setRenderTarget: vi.fn((next: THREE.WebGLRenderTarget | null) => {
      target = next;
    }),
    getClearColor: vi.fn((into: THREE.Color) => into.set(0x000000)),
    getClearAlpha: vi.fn(() => 0),
    setClearColor: vi.fn(),
    clear: vi.fn(),
    render: vi.fn<(scene: THREE.Scene, camera: THREE.Camera) => void>(),
    readRenderTargetPixels: vi.fn(
      (
        _target: THREE.WebGLRenderTarget,
        _x: number,
        _y: number,
        width: number,
        height: number,
        buffer: Uint8Array,
        _activeCubeFaceIndex?: number,
        textureIndex = 0,
      ) => {
        const source =
          width * height > 1 ? frames[textureIndex] : pixels[textureIndex];
        if (source) buffer.set(source);
      },
    ),
  };
};

/** The size of each render target the picker rendered into, in order. */
const renderedTargets = (renderer: ReturnType<typeof createRenderer>) =>
  renderer.setRenderTarget.mock.calls
    .map(([target]) => target)
    .filter((target): target is THREE.WebGLRenderTarget => target !== null)
    .map((target) => [target.width, target.height]);

/** The attachments read back so far, in read order. */
const readAttachments = (renderer: ReturnType<typeof createRenderer>) =>
  renderer.readRenderTargetPixels.mock.calls.map((call) => call[7]);

/**
 * What three does with the pick render, reduced to what the picker relies
 * on: skip invisible subtrees and run the override material's
 * `onBeforeRender` before drawing each object. Returns the model byte each
 * drawn object was drawn with.
 */
const drawScene = (scene: THREE.Scene, camera: THREE.Camera) => {
  const material = scene.overrideMaterial as THREE.ShaderMaterial;
  const draws = new Map<THREE.Object3D, number>();
  const visit = (object: THREE.Object3D) => {
    if (!object.visible) return;
    const drawable = object as Partial<
      THREE.Mesh & THREE.Line & THREE.Points & THREE.Sprite
    >;
    if (
      drawable.isMesh ||
      drawable.isLine ||
      drawable.isPoints ||
      drawable.isSprite
    ) {
      material.onBeforeRender(
        null as unknown as THREE.WebGLRenderer,
        scene,
        camera,
        drawable.geometry!,
        object,
        null as unknown as THREE.Group,
      );
      draws.set(object, material.uniforms.modelByte.value);
    }
    object.children.forEach(visit);
  };
  visit(scene);
  return draws;
};

/**
 * The edit requests for one element: an item, plus the geometry chain
 * that earns it an itemId. Only items reachable from a sample get one —
 * an item on its own is invisible to `getLocalIdsFromItemIds`.
 */
const elementRequests = (
  index: number,
  geometry: THREE.BufferGeometry,
): EditRequest[] => [
  {
    type: EditRequestType.CREATE_ITEM,
    tempId: `item-${index}`,
    data: {
      category: "IFCWALL",
      data: { Name: { value: `Wall ${index}`, type: "IFCLABEL" } },
    },
  },
  {
    type: EditRequestType.CREATE_GLOBAL_TRANSFORM,
    tempId: `transform-${index}`,
    data: {
      itemId: `item-${index}`,
      ...GeomsFbUtils.transformFromMatrix(
        new THREE.Matrix4().makeTranslation(index * 2, 0, 0),
      ),
    },
  },
  {
    type: EditRequestType.CREATE_LOCAL_TRANSFORM,
    tempId: `local-transform-${index}`,
    data: GeomsFbUtils.transformFromMatrix(new THREE.Matrix4()),
  },
  {
    type: EditRequestType.CREATE_REPRESENTATION,
    tempId: `shell-${index}`,
    data: GeomsFbUtils.representationFromGeometry(geometry),
  },
  {
    type: EditRequestType.CREATE_MATERIAL,
    tempId: `material-${index}`,
    // Opaque red, both faces rendered, no stroke.
    data: { r: 255, g: 0, b: 0, a: 255, renderedFaces: 1, stroke: 0 },
  },
  {
    type: EditRequestType.CREATE_SAMPLE,
    tempId: `sample-${index}`,
    data: {
      item: `transform-${index}`,
      material: `material-${index}`,
      representation: `shell-${index}`,
      localTransform: `local-transform-${index}`,
    },
  },
];

/**
 * A tile shell as fragments builds it. Contents don't matter: the fake
 * readbacks decide what the pick decodes. The `id` attribute's presence is
 * what makes a mesh pickable.
 */
const createShell = (
  geometry: THREE.BufferGeometry = new THREE.BoxGeometry(),
) => {
  const pickable = geometry.clone();
  pickable.setAttribute(
    "id",
    new THREE.BufferAttribute(
      new Uint8Array(pickable.attributes.position.count * 4),
      4,
    ),
  );
  return new THREE.Mesh(pickable, [new THREE.MeshBasicMaterial()]);
};

/**
 * A model authored on the spot with the edit API, so the localIds the
 * pick has to arrive at are known up front — they are what the edit
 * solver hands back — instead of being read out of the same model the
 * picker queries.
 *
 * `SingleThreadedFragmentsModel` is data only — tile meshes are built by
 * the worker-backed `FragmentsModels` — so we also attach the one thing
 * the render passes need: a mesh carrying the per-vertex `id` attribute,
 * which is what marks geometry as pickable.
 */
const createModel = ({ itemCount }: { itemCount: number }) => {
  const geometry = new THREE.BoxGeometry();
  const requests = Array.from({ length: itemCount }, (_, index) =>
    elementRequests(index, geometry),
  ).flat();

  const draft = new SingleThreadedFragmentsModel(
    MODEL_ID,
    EditUtils.newModel({ raw: true }),
    true,
  );
  // `ids[i]` is what the solver assigned to request `i`, so the
  // CREATE_ITEM entries are the localIds of the elements we just wrote,
  // in creation order — which is also their itemId order.
  const { ids } = draft.edit(requests, true);
  const localIds = requests.flatMap((request, i) =>
    request.type === EditRequestType.CREATE_ITEM ? [ids[i]] : [],
  );
  // Pending edits don't reach the virtual model, so flatten and reload.
  const model = new SingleThreadedFragmentsModel(
    MODEL_ID,
    draft.save(true),
    true,
  );
  draft.dispose();

  const object = new THREE.Group();
  object.add(createShell(geometry));

  return Object.assign(model, { object, localIds });
};

const createCamera = (position: THREE.Vector3) => {
  const camera = new THREE.PerspectiveCamera(60, SIZE.x / SIZE.y, 0.1, 1000);
  camera.position.copy(position);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  return camera;
};

const setup = () => {
  const renderer = createRenderer();
  const model = createModel({ itemCount: 3 });

  /**
   * The element under the cursor. Not the first one, so an off-by-one
   * anywhere in the itemId decode shows up as a wrong localId.
   * itemIds run in creation order, so the picked element's localId is the
   * one the edit solver assigned it — known without asking the model.
   */
  const itemId = 1;
  const localId = model.localIds[itemId];
  const translate = vi.spyOn(model, "getLocalIdsFromItemIds");

  const scene = new THREE.Scene();
  scene.add(model.object);

  const camera = createCamera(new THREE.Vector3(0, 4, 12));
  // Where the camera ends up after the user keeps orbiting mid-pick.
  const movedCamera = createCamera(new THREE.Vector3(-18, 9, -6));

  const world = {
    scene: { three: scene },
    camera: { three: camera as THREE.Camera },
    renderer: { three: renderer },
  };

  const fragments = {
    initialized: true,
    list: new Map<string, { object: THREE.Object3D }>([[MODEL_ID, model]]),
  };
  const components = { get: vi.fn(() => fragments) } as unknown as Components;

  const picker = new FastModelPicker(
    components,
    world as unknown as World & typeof world,
  );

  // Screen position and depth of HIT as seen by the starting camera.
  const ndc = HIT.clone().project(camera);
  const position = new THREE.Vector2(ndc.x, ndc.y);
  const depth = (ndc.z + 1) / 2;

  renderer.pixels[ATTACHMENT.id] = gpuStubs.idPixel(1, itemId);
  renderer.pixels[ATTACHMENT.depth] = gpuStubs.depthPixel(depth);
  renderer.pixels[ATTACHMENT.normal] = gpuStubs.normalPixel(NORMAL);

  const dispose = () => {
    picker.dispose();
    model.dispose();
  };

  return {
    camera,
    components,
    depth,
    fragments,
    itemId,
    localId,
    model,
    movedCamera,
    picker,
    position,
    renderer,
    scene,
    translate,
    world,
    dispose,
  };
};

describe("FastModelPicker.getFullPick", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("resolves the item, point, normal and distance under the cursor", async () => {
    const { camera, itemId, localId, picker, position, translate } = context;

    const pick = await picker.getFullPick(position);

    expect(translate).toHaveBeenCalledWith([itemId]);
    expect(pick).not.toBeNull();
    expect(pick!.modelId).toBe(MODEL_ID);
    expect(pick!.itemId).toBe(itemId);
    expect(pick!.localId).toBe(localId);
    expect(pick!.point.distanceTo(HIT)).toBeLessThan(1e-3);
    expect(pick!.normal!.angleTo(NORMAL)).toBeLessThan(0.02);
    expect(pick!.distance).toBeCloseTo(HIT.distanceTo(camera.position), 3);
  });

  it("keeps the camera-dependent data of the camera the pick started with when the camera changes mid flight", async () => {
    const { camera, depth, localId, movedCamera, picker, position, translate } =
      context;

    // The GPU pick is synchronous, but the worker-backed model answers
    // the itemId → localId translation over a message hop. Move the camera
    // while that answer is in flight, which is what happens when the user
    // keeps orbiting after clicking: `world.camera` is swapped by
    // `world.onCameraChanged` consumers, and the new camera sits somewhere
    // else entirely.
    translate.mockImplementation(() => {
      context.world.camera = { three: movedCamera };
      return Promise.resolve([localId]) as unknown as number[];
    });

    const pick = await picker.getFullPick(position);

    expect(
      context.world.camera.three,
      "expected camera to change mid flight",
    ).toBe(movedCamera);
    const drifted = new THREE.Vector3(position.x, position.y, depth * 2 - 1);
    drifted.unproject(movedCamera);
    expect(
      drifted.distanceTo(HIT),
      "expected camera to drift mid flight",
    ).toBeGreaterThan(1);

    expect(pick).not.toBeNull();
    expect(pick!.localId).toBe(localId);
    expect(pick!.point.distanceTo(HIT)).toBeLessThan(1e-3);
    expect(pick!.distance).toBeCloseTo(HIT.distanceTo(camera.position), 3);
  });
});

describe("FastModelPicker pick render", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("picks into a 1×1 target, and renders the viewport only for the debug overlay", () => {
    const { picker, position, renderer } = context;

    picker.getModelAt(position);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(renderedTargets(renderer)).toEqual([[1, 1]]);
    expect(document.querySelector("canvas")).toBeNull();

    picker.setDebugMode(true);
    const canvas = document.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect([canvas!.width, canvas!.height]).toEqual([SIZE.x, SIZE.y]);

    renderer.render.mockClear();
    renderer.setRenderTarget.mockClear();
    renderer.readRenderTargetPixels.mockClear();

    expect(picker.getModelAt(position)).toBe(MODEL_ID);

    // The overlay renders the whole viewport before the pick it mirrors, and
    // reads the id output back for the full frame rather than one pixel.
    expect(renderer.render).toHaveBeenCalledTimes(2);
    expect(renderedTargets(renderer)).toEqual([
      [SIZE.x, SIZE.y],
      [1, 1],
    ]);
    const reads = renderer.readRenderTargetPixels.mock.calls.map((call) => [
      call[3],
      call[4],
      call[7],
    ]);
    expect(reads).toEqual([
      [SIZE.x, SIZE.y, ATTACHMENT.id],
      [1, 1, ATTACHMENT.id],
    ]);

    picker.setDebugMode(false);
    expect(document.querySelector("canvas")).toBeNull();
    renderer.render.mockClear();
    renderer.setRenderTarget.mockClear();

    expect(picker.getModelAt(position)).toBe(MODEL_ID);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(renderedTargets(renderer)).toEqual([[1, 1]]);
  });

  it("mirrors the id output onto the debug canvas, flipped into canvas orientation", () => {
    const { picker, position, renderer } = context;

    // What the GPU holds for the id output: model 1 across the bottom half of
    // the frame, model 2 in the top-right quadrant, void elsewhere. WebGL's
    // first row is the bottom one, so the overlay has to flip it.
    const frame = new Uint8Array(SIZE.x * SIZE.y * 4);
    for (let y = 0; y < SIZE.y; y++) {
      for (let x = 0; x < SIZE.x; x++) {
        const bottomHalf = y < SIZE.y / 2;
        const right = x >= SIZE.x / 2;
        const modelByte = bottomHalf ? 1 : Number(right) * 2;
        const offset = (y * SIZE.x + x) * 4;
        frame[offset] = modelByte;
        // Any non-zero item id: the overlay only reads the model byte.
        frame[offset + 3] = modelByte;
      }
    }
    renderer.frames[ATTACHMENT.id] = frame;

    const blits = recordCanvasBlits();
    picker.setDebugMode(true);
    picker.getModelAt(position);

    expect(blits).toHaveLength(1);
    expect([blits[0].width, blits[0].height]).toEqual([SIZE.x, SIZE.y]);
    expect(asciiSnapshot(blits[0], { step: 20 })).toMatchSnapshot();
  });

  it("renders every output in one draw and reads back only the requested ones", async () => {
    const { picker, position, renderer } = context;

    await picker.getFullPick(position);

    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(readAttachments(renderer)).toEqual([
      ATTACHMENT.id,
      ATTACHMENT.depth,
      ATTACHMENT.normal,
    ]);

    renderer.render.mockClear();
    renderer.readRenderTargetPixels.mockClear();

    expect(picker.getPointAt(position)!.distanceTo(HIT)).toBeLessThan(1e-3);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(readAttachments(renderer)).toEqual([ATTACHMENT.depth]);
  });

  it("draws each model's shells with that model's byte and nothing else", () => {
    const { fragments, model, picker, position, renderer, scene } = context;
    const [authoredShell] = model.object.children;

    // A delta model hangs under its parent model's object (see the
    // fragments EditHelper) while being a model of its own.
    const delta = new THREE.Group();
    const deltaShell = createShell();
    delta.add(deltaShell);
    model.object.add(delta);
    fragments.list.set("delta", { object: delta });

    // In a model, but without the `id` attribute: an LOD line mesh.
    const lodLines = new THREE.Mesh(new THREE.BufferGeometry());
    model.object.add(lodLines);
    // Hidden by fragments: must stay out of the pick.
    const staleShell = createShell();
    staleShell.visible = false;
    model.object.add(staleShell);
    // Not BIM at all.
    const helpers = [
      new THREE.Mesh(new THREE.BoxGeometry()),
      new THREE.Line(),
      new THREE.Points(),
      new THREE.Sprite(),
    ];
    scene.add(...helpers);

    let draws = new Map<THREE.Object3D, number>();
    renderer.render.mockImplementation((renderedScene, camera) => {
      draws = drawScene(renderedScene, camera);
      // The GPU saw the delta shell under the cursor.
      const byte = draws.get(deltaShell) ?? 0;
      renderer.pixels[ATTACHMENT.id] = gpuStubs.idPixel(byte, 0);
    });

    expect(picker.getModelAt(position)).toBe("delta");

    expect(new Set(draws.keys())).toEqual(new Set([authoredShell, deltaShell]));
    expect(draws.get(authoredShell)).not.toBe(draws.get(deltaShell));
    for (const object of [lodLines, ...helpers]) {
      expect(object.visible).toBe(true);
    }
    expect(staleShell.visible).toBe(false);
  });

  it("leaves the scene and renderer as found, even when rendering throws", () => {
    const { picker, position, renderer, scene } = context;
    const background = new THREE.Color(0xffffff);
    scene.background = background;
    const helper = new THREE.Mesh(new THREE.BoxGeometry());
    scene.add(helper);
    // The app asked for a shadow refresh on its next frame.
    renderer.shadowMap.needsUpdate = true;

    let during: unknown;
    renderer.render.mockImplementation((renderedScene) => {
      during = {
        background: renderedScene.background,
        overrideMaterial: renderedScene.overrideMaterial !== null,
        shadowMap: { ...renderer.shadowMap },
        helperVisible: helper.visible,
      };
      throw new Error("context lost");
    });

    expect(() => picker.getPointAt(position)).toThrow("context lost");

    expect(during).toEqual({
      background: null,
      overrideMaterial: true,
      shadowMap: { autoUpdate: false, needsUpdate: false },
      helperVisible: false,
    });
    expect(scene.background).toBe(background);
    expect(scene.overrideMaterial).toBeNull();
    expect(renderer.shadowMap).toEqual({ autoUpdate: true, needsUpdate: true });
    expect(helper.visible).toBe(true);
    expect(renderer.getRenderTarget()).toBeNull();
    expect(renderer.autoClear).toBe(true);
  });

  it("renders through a copy of the camera narrowed to the cursor pixel", () => {
    const { camera, depth, picker, position, renderer } = context;
    const projection = camera.projectionMatrix.clone();

    picker.getPointAt(position);
    const [, pickCamera] = renderer.render.mock.calls[0];

    expect(pickCamera).not.toBe(camera);
    expect(camera.projectionMatrix.equals(projection)).toBe(true);

    // The cursor lands in the centre of the 1×1 target, at its own depth.
    const cursor = HIT.clone().project(pickCamera);
    expect(cursor.x).toBeCloseTo(0, 6);
    expect(cursor.y).toBeCloseTo(0, 6);
    expect((cursor.z + 1) / 2).toBeCloseTo(depth, 9);

    // Half a viewport pixel to the right is the edge of the pick frustum.
    const halfPixelRight = new THREE.Vector3(
      position.x + 1 / SIZE.x,
      position.y,
      depth * 2 - 1,
    )
      .unproject(camera)
      .project(pickCamera);
    expect(halfPixelRight.x).toBeCloseTo(1, 6);
  });
});

describe("FastModelPicker guards", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  /** Every entry point, so a guard can be checked against all of them at once. */
  const pickEverything = async (picker: FastModelPicker, at: THREE.Vector2) => [
    picker.getModelAt(at),
    picker.getPointAt(at),
    picker.getNormalAt(at),
    await picker.getItemAt(at),
    await picker.getFullPick(at),
  ];

  it("returns null from every entry point when disabled", async () => {
    const { picker, position, renderer } = context;
    picker.enabled = false;

    expect(await pickEverything(picker, position)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(renderer.render).not.toHaveBeenCalled();
  });

  it("returns null when the world has no renderer", async () => {
    const { picker, position, world } = context;
    world.renderer = undefined as unknown as typeof world.renderer;

    expect(await pickEverything(picker, position)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  it("returns null when the scene is not a THREE.Scene", async () => {
    const { picker, position, renderer, world } = context;
    // `overrideMaterial` only applies to a Scene, so a bare Object3D root
    // would render the models with their own materials.
    world.scene = { three: new THREE.Group() } as unknown as typeof world.scene;

    expect(await pickEverything(picker, position)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(renderer.render).not.toHaveBeenCalled();
  });

  it("returns null when fragments has nothing loaded", async () => {
    const { fragments, picker, position, renderer } = context;

    fragments.initialized = false;
    expect(picker.getModelAt(position)).toBeNull();

    fragments.initialized = true;
    fragments.list.clear();
    expect(await pickEverything(picker, position)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(renderer.render).not.toHaveBeenCalled();
  });

  it("returns null when the viewport has no size", async () => {
    const { picker, position, renderer } = context;
    renderer.getSize.mockImplementation((into: THREE.Vector2) =>
      into.set(0, 0),
    );

    expect(await pickEverything(picker, position)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(renderer.render).not.toHaveBeenCalled();
  });

  it("returns null once disposed", async () => {
    const { picker, position, renderer } = context;
    picker.dispose();

    expect(await pickEverything(picker, position)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(renderer.render).not.toHaveBeenCalled();
  });

  it("returns null when no model has pickable shells", () => {
    const { model, picker, position, renderer } = context;
    // A mesh without the per-vertex `id` attribute is not pickable: an LOD
    // line mesh, say. With nothing else loaded there is no byte to hand out.
    model.object.clear();
    const lines = new THREE.Mesh(new THREE.BufferGeometry());
    model.object.add(lines);

    expect(picker.getModelAt(position)).toBeNull();
    expect(renderer.render).not.toHaveBeenCalled();
    expect(lines.visible).toBe(true);
  });

  it("needs a renderer to be constructed at all", () => {
    const { components, world } = context;

    expect(
      () =>
        new FastModelPicker(components, {
          ...world,
          renderer: undefined,
        } as unknown as World),
    ).toThrow(/renderer/);
  });
});

describe("FastModelPicker void pixels", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("reads an unwritten id pixel as empty space", async () => {
    const { picker, position, renderer } = context;
    renderer.pixels[ATTACHMENT.id] = new Uint8Array(4);

    expect(picker.getModelAt(position)).toBeNull();
    expect(await picker.getItemAt(position)).toBeNull();
    expect(await picker.getFullPick(position)).toBeNull();
  });

  it("reads a model byte with no item as empty space", async () => {
    const { picker, position, renderer } = context;
    // The id is written as `itemId + 1`, so 0 across GBA means no item, even
    // though the red channel names a model.
    renderer.pixels[ATTACHMENT.id] = new Uint8Array([1, 0, 0, 0]);

    expect(picker.getModelAt(position)).toBeNull();
    expect(await picker.getItemAt(position)).toBeNull();
    expect(await picker.getFullPick(position)).toBeNull();
  });

  it("reads an unwritten depth pixel as empty space", async () => {
    const { picker, position, renderer } = context;
    renderer.pixels[ATTACHMENT.depth] = new Uint8Array(4);

    expect(picker.getPointAt(position)).toBeNull();
    expect(await picker.getFullPick(position)).toBeNull();
  });

  it("reads the far plane as empty space", async () => {
    const { picker, position, renderer } = context;
    // A fragment at the far plane packs to all-255. (Exactly `1.0` instead
    // saturates to (0, 0, 0, 255), a value real geometry never reaches.)
    renderer.pixels[ATTACHMENT.depth] = new Uint8Array([255, 255, 255, 255]);

    expect(picker.getPointAt(position)).toBeNull();
    expect(await picker.getFullPick(position)).toBeNull();
  });

  it("reads an unwritten normal pixel as empty space", async () => {
    const { picker, position, renderer } = context;
    // The shader writes alpha 1 wherever it draws; a cleared pixel is 0.
    renderer.pixels[ATTACHMENT.normal] = new Uint8Array([128, 128, 128, 0]);

    expect(picker.getNormalAt(position)).toBeNull();
    // A pick still resolves: only the normal is optional.
    const pick = await picker.getFullPick(position);
    expect(pick).not.toBeNull();
    expect(pick!.normal).toBeNull();
  });
});

describe("FastModelPicker.getItemAt", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("resolves the item under the cursor", async () => {
    const { itemId, localId, picker, position, translate } = context;

    expect(await picker.getItemAt(position)).toEqual({
      modelId: MODEL_ID,
      itemId,
      localId,
    });
    expect(translate).toHaveBeenCalledWith([itemId]);
  });

  it("returns null when the model cannot resolve the item id", async () => {
    const { picker, position, translate } = context;
    translate.mockResolvedValue([] as unknown as number[]);

    expect(await picker.getItemAt(position)).toBeNull();
    expect(await picker.getFullPick(position)).toBeNull();
  });

  it("returns null when the model is gone by the time the id is read", async () => {
    const { fragments, picker, position, renderer } = context;
    // Models can be unloaded while a pick is in flight.
    renderer.render.mockImplementation(() => {
      fragments.list.delete(MODEL_ID);
    });

    expect(await picker.getItemAt(position)).toBeNull();
    expect(await picker.getFullPick(position)).toBeNull();
  });
});

describe("FastModelPicker model bytes", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("hands out at most one byte per model, up to MAX_MODELS", () => {
    const { fragments, picker, position, renderer, scene } = context;
    // One model is already loaded; fill the rest of the byte range and add one
    // model too many.
    for (let i = 0; i < FastModelPicker.MAX_MODELS; i++) {
      const object = new THREE.Group();
      object.add(createShell());
      scene.add(object);
      fragments.list.set(`extra-${i}`, { object });
    }
    expect(fragments.list.size).toBe(FastModelPicker.MAX_MODELS + 1);

    let draws = new Map<THREE.Object3D, number>();
    renderer.render.mockImplementation((renderedScene, camera) => {
      draws = drawScene(renderedScene, camera);
    });
    picker.getModelAt(position);

    // The model that misses out is not drawn at all, rather than drawn with a
    // byte that decodes to another model.
    expect(draws.size).toBe(FastModelPicker.MAX_MODELS);
    expect(new Set(draws.values()).size).toBe(FastModelPicker.MAX_MODELS);
    expect(Math.min(...draws.values())).toBe(1);
    expect(Math.max(...draws.values())).toBe(FastModelPicker.MAX_MODELS);
  });

  it("forces `allowOverride` on for the render, and restores it", () => {
    const { model, picker, position, renderer } = context;
    const [shell] = model.object.children as THREE.Mesh[];
    const [material] = shell.material as THREE.Material[];
    // Three skips the override material for these, which would draw the shell
    // with its own shader into the pick outputs.
    material.allowOverride = false;

    let duringRender: boolean | undefined;
    renderer.render.mockImplementation(() => {
      duringRender = material.allowOverride;
    });

    expect(picker.getModelAt(position)).toBe(MODEL_ID);
    expect(duringRender).toBe(true);
    expect(material.allowOverride).toBe(false);
  });

  it("picks at the last known mouse position when given none", () => {
    const { camera, depth, picker, renderer, world } = context;
    const canvas = world.renderer.three.domElement;
    // happy-dom has no layout, so the canvas reports a zero-sized rect.
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: SIZE.x,
      bottom: SIZE.y,
      width: SIZE.x,
      height: SIZE.y,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    canvas.dispatchEvent(
      new MouseEvent("pointermove", {
        clientX: SIZE.x * 0.75,
        clientY: SIZE.y * 0.25,
      }),
    );

    picker.getModelAt();

    // That pointer sits at NDC (0.5, 0.5); the pick frustum should be centred
    // there, so a point under it lands in the middle of the pick target.
    const [, pickCamera] = renderer.render.mock.calls[0];
    const under = new THREE.Vector3(0.5, 0.5, depth * 2 - 1)
      .unproject(camera)
      .project(pickCamera);
    expect(under.x).toBeCloseTo(0, 6);
    expect(under.y).toBeCloseTo(0, 6);
  });
});

describe("FastModelPicker debug overlay", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("keeps a single canvas however often it is switched on", () => {
    const { picker } = context;

    picker.setDebugMode(true);
    picker.setDebugMode(true);

    expect(document.querySelectorAll("canvas")).toHaveLength(1);
  });

  it("skips the overlay when there is nothing to draw it on", () => {
    const { fragments, picker, position, renderer } = context;
    picker.setDebugMode(true);

    // No 2D context to blit into.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(picker.getModelAt(position)).toBe(MODEL_ID);
    vi.restoreAllMocks();

    // Nothing loaded to render.
    fragments.list.clear();
    expect(picker.getModelAt(position)).toBeNull();

    // No viewport to render into.
    renderer.getSize.mockImplementation((into: THREE.Vector2) =>
      into.set(0, 0),
    );
    expect(picker.getModelAt(position)).toBeNull();
  });
});

describe("FastModelPicker render state", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("draws with the renderer's clipping planes, so picks match what is on screen", () => {
    const { picker, position, renderer, scene } = context;
    const planes = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 2)];
    renderer.clippingPlanes = planes;

    let material: THREE.ShaderMaterial | undefined;
    renderer.render.mockImplementation((renderedScene) => {
      material = renderedScene.overrideMaterial as THREE.ShaderMaterial;
    });
    picker.getModelAt(position);

    expect(material!.clippingPlanes).toBe(planes);
    expect(material!.clipping).toBe(true);

    // A renderer with no clipping planes at all leaves the material unclipped.
    renderer.clippingPlanes = undefined as unknown as THREE.Plane[];
    picker.getModelAt(position);
    expect(scene.overrideMaterial).toBeNull();
    expect(material!.clippingPlanes).toEqual([]);
    expect(material!.clipping).toBe(false);
  });

  it("draws anything it did not register with the void byte", () => {
    const { picker, position, renderer } = context;
    // Nothing should reach the shader without a byte, but if it does it has to
    // decode as empty space rather than as some other model.
    const stray = new THREE.Mesh(new THREE.BoxGeometry());

    let byte: number | undefined;
    renderer.render.mockImplementation((renderedScene, camera) => {
      const material = renderedScene.overrideMaterial as THREE.ShaderMaterial;
      material.onBeforeRender(
        null as unknown as THREE.WebGLRenderer,
        renderedScene,
        camera,
        stray.geometry,
        stray,
        null as unknown as THREE.Group,
      );
      byte = material.uniforms.modelByte.value;
    });
    picker.getModelAt(position);

    expect(byte).toBe(0);
  });

  it("skips the overlay when there is no canvas or renderer for it", () => {
    const { picker, position, world } = context;

    // `debugMode` is public: set without `setDebugMode` there is no canvas.
    picker.debugMode = true;
    expect(picker.getModelAt(position)).toBe(MODEL_ID);

    picker.setDebugMode(true);
    world.renderer = undefined as unknown as typeof world.renderer;
    expect(picker.getModelAt(position)).toBeNull();
  });
});

describe("FastModelPicker vs. the worker raycast", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  /**
   * A pick can only report geometry that is rasterized carrying the `id`
   * attribute. Fragments draws small or distant items at a reduced LOD, as
   * line meshes without that attribute, and the picker hides those for the
   * pick pass — otherwise they would write their own colors into the pick
   * outputs. The worker raycast tests the authored geometry instead, so the
   * two disagree exactly where an item is currently drawn as an LOD line.
   */
  it("cannot pick an item that fragments currently draws as an LOD line", () => {
    const { model, picker, position, renderer } = context;
    const [shell] = model.object.children;
    const lodLine = new THREE.Mesh(new THREE.BufferGeometry());
    model.object.add(lodLine);

    let draws = new Map<THREE.Object3D, number>();
    renderer.render.mockImplementation((renderedScene, camera) => {
      draws = drawScene(renderedScene, camera);
    });
    picker.getModelAt(position);

    // The LOD mesh is not drawn, so nothing it stands for can win the pixel:
    // the pick resolves to whatever is behind it.
    expect([...draws.keys()]).toEqual([shell]);
    // ...and fragments' own visibility flags survive the pick.
    expect(lodLine.visible).toBe(true);
  });
});

describe("FastModelPicker decoding", () => {
  let context: ReturnType<typeof setup>;

  beforeEach(() => {
    context = setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    context?.dispose();
  });

  it("decodes what the shader wrote into items, points and normals", async () => {
    const { model, picker, renderer } = context;
    const samples = [
      { at: [-0.6, 0.35], itemId: 0, depth: 0.82, normal: [0, 1, 0] },
      { at: [0, 0], itemId: 1, depth: 0.9, normal: [1, 0, 0] },
      { at: [0.75, -0.4], itemId: 2, depth: 0.95, normal: [0, 0, -1] },
    ];

    const round = (value: number) => value.toFixed(3);
    const vector = (v: THREE.Vector3) =>
      `(${round(v.x)}, ${round(v.y)}, ${round(v.z)})`;

    const rows: string[] = [];
    const localIds: number[] = [];
    for (const sample of samples) {
      // Everything below this line is the picker's own decoding: only the
      // pixels are stand-ins for the GPU.
      renderer.pixels[ATTACHMENT.id] = gpuStubs.idPixel(1, sample.itemId);
      renderer.pixels[ATTACHMENT.depth] = gpuStubs.depthPixel(sample.depth);
      renderer.pixels[ATTACHMENT.normal] = gpuStubs.normalPixel(
        new THREE.Vector3(...sample.normal),
      );
      const at = new THREE.Vector2(sample.at[0], sample.at[1]);
      // eslint-disable-next-line no-await-in-loop
      const pick = await picker.getFullPick(at);
      expect(pick).not.toBeNull();
      localIds.push(pick!.localId);
      rows.push(
        [
          `at (${round(at.x)}, ${round(at.y)}) depth ${sample.depth}`,
          `${pick!.modelId} item ${pick!.itemId} localId ${pick!.localId}`,
          `point ${vector(pick!.point)}`,
          `normal ${vector(pick!.normal!)}`,
          `distance ${round(pick!.distance)}`,
        ].join(" | "),
      );
    }

    // The localIds are the ones the edit solver assigned when the model was
    // authored, so this also pins the itemId -> localId translation.
    expect(localIds).toEqual(
      samples.map((sample) => model.localIds[sample.itemId]),
    );
    expect(rows.join("\n")).toMatchSnapshot();
  });
});
