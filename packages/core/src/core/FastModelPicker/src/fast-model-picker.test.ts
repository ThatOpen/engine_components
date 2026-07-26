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
import { FastModelPicker } from "./fast-model-picker";

const MODEL_ID = "authored";

const SIZE = new THREE.Vector2(200, 120);

/** The world-space point the fake GPU readbacks describe. */
const HIT = new THREE.Vector3(1.5, -0.75, 2.25);

/** The surface normal the fake normal pass reports at {@link HIT}. */
const NORMAL = new THREE.Vector3(0, 1, 0);

/**
 * The three helpers below stand in for the GPU: each hand-encodes what
 * one of the picker's shaders would have written, so the fake readbacks
 * decode back to a known point / normal / item. They mirror GLSL that
 * this test cannot run — a real WebGL2 context would mean browser mode —
 * so keep them in step with the shader they name.
 */
const gpuStubs = {
  /**
   * {@link FastModelPicker.buildIdMaterial}: model byte in R, `itemId + 1` (0 = void) in the
   * lower three bytes of GBA.
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
   * {@link FastModelPicker.buildDepthMaterial}: the four-byte depth packing, inverse of the
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
   * {@link FastModelPicker.buildNormalMaterial}: `normal * 0.5 + 0.5` in RGB, alpha = 1.
   */
  normalPixel(normal: THREE.Vector3) {
    return new Uint8Array([
      ...normal.toArray().map((value) => Math.round((value * 0.5 + 0.5) * 255)),
      255,
    ]);
  },
};

/**
 * Enough of `THREE.WebGLRenderer` for the pick passes: every render is a
 * no-op and every `readRenderTargetPixels` hands back the next queued
 * pixel, so the tests decide what the GPU "saw".
 */
const createRenderer = () => {
  /** Consumed in order: id pass, then depth pass, then normal pass. */
  const readbacks: Uint8Array[] = [];
  let target: THREE.WebGLRenderTarget | null = null;
  return {
    readbacks,
    autoClear: true,
    clippingPlanes: [] as THREE.Plane[],
    domElement: { addEventListener: vi.fn(), removeEventListener: vi.fn() },
    getSize: vi.fn((into: THREE.Vector2) => into.copy(SIZE)),
    getPixelRatio: vi.fn(() => 1),
    getRenderTarget: vi.fn(() => target),
    setRenderTarget: vi.fn((next: THREE.WebGLRenderTarget | null) => {
      target = next;
    }),
    getClearColor: vi.fn((into: THREE.Color) => into.set(0x000000)),
    getClearAlpha: vi.fn(() => 0),
    setClearColor: vi.fn(),
    getScissorTest: vi.fn(() => false),
    getScissor: vi.fn((into: THREE.Vector4) => into.set(0, 0, SIZE.x, SIZE.y)),
    setScissorTest: vi.fn(),
    setScissor: vi.fn(),
    clear: vi.fn(),
    render: vi.fn(),
    readRenderTargetPixels: vi.fn(
      (
        _target: THREE.WebGLRenderTarget,
        _x: number,
        _y: number,
        _width: number,
        _height: number,
        buffer: Uint8Array,
      ) => {
        const pixel = readbacks.shift();
        if (pixel) buffer.set(pixel);
      },
    ),
  };
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

  // Contents don't matter: the fake readbacks decide what the pick
  // decodes. The attribute's presence is what the id pass looks for.
  const pickable = geometry.clone();
  pickable.setAttribute(
    "id",
    new THREE.BufferAttribute(
      new Uint8Array(pickable.attributes.position.count * 4),
      4,
    ),
  );
  const object = new THREE.Group();
  object.add(new THREE.Mesh(pickable, new THREE.MeshBasicMaterial()));

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
    renderer: { three: renderer, onResize: { add: vi.fn() } },
  };

  const fragments = { initialized: true, list: new Map([[MODEL_ID, model]]) };
  const components = { get: vi.fn(() => fragments) } as unknown as Components;

  const picker = new FastModelPicker(
    components,
    world as unknown as World & typeof world,
  );

  // Screen position and depth of HIT as seen by the starting camera.
  const ndc = HIT.clone().project(camera);
  const position = new THREE.Vector2(ndc.x, ndc.y);
  const depth = (ndc.z + 1) / 2;

  renderer.readbacks.push(
    gpuStubs.idPixel(1, itemId),
    gpuStubs.depthPixel(depth),
    gpuStubs.normalPixel(NORMAL),
  );

  const dispose = () => {
    picker.dispose();
    model.dispose();
  };

  return {
    camera,
    depth,
    itemId,
    localId,
    model,
    movedCamera,
    picker,
    position,
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

    // The GPU passes are synchronous, but the worker-backed model answers
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
