# Contributing to @thatopen/components

Thanks for your interest in contributing. This guide covers how the repo is laid out, how to run it locally, and a few gotchas that aren't obvious from reading the code.

For general guidelines shared across all That Open Company repos (ask-first policy, conventional commits, JSDoc rules, example code rules), read [docs.thatopen.com/contributing](https://docs.thatopen.com/contributing) first. This file only covers what's specific to `engine_components`.

## What this is

`@thatopen/components` is a modular BIM toolkit built on top of [`@thatopen/fragments`](https://github.com/ThatOpen/engine_fragment) and Three.js. It provides the building blocks for authoring BIM web apps: scene/camera/renderer bundles (`Worlds`), model loading and classification, clipping, raycasting, measurements, property viewers, and so on. Each feature is an independent `Component` you opt into.

The repo ships two packages:

- `@thatopen/components` (in `packages/core/`) — renderer-agnostic base. Safe to use in headless or server-side workflows.
- `@thatopen/components-front` (in `packages/front/`) — front-end additions that assume a rendered scene (post-production renderer, highlighter, outliner, markers, etc.).

## Repo layout

```
packages/
├── core/src/                 # @thatopen/components
│   ├── core/
│   │   ├── Components/       # Root container: singleton registry + animation loop
│   │   ├── Worlds/           # Scene + camera + renderer bundles
│   │   ├── Types/            # Base classes: Component, Disposable, Event, DataMap, World
│   │   ├── ConfigManager/    # Typed config with diff + apply
│   │   ├── Clipper/          # Section planes
│   │   ├── Grids/            # Ground grid
│   │   ├── Raycasters/       # Mouse / screen raycasting helpers
│   │   ├── OrthoPerspectiveCamera/
│   │   ├── FastModelPicker/  # GPU-based picking
│   │   ├── ShadowedScene/
│   │   ├── Viewpoints/       # Named camera states
│   │   ├── Views/            # 2D technical views
│   │   └── Disposer/
│   ├── fragments/            # Fragments integration (thin wrappers on @thatopen/fragments)
│   │   ├── FragmentsManager/ # Loads & owns FragmentsModels
│   │   ├── IfcLoader/        # IFC → .frag via IfcImporter
│   │   ├── Classifier/       # Group items by category / attributes
│   │   ├── Hider/            # Visibility management
│   │   ├── BoundingBoxer/    # Per-item AABB queries
│   │   ├── ItemsFinder/      # Query items by rule sets
│   │   └── EdgeProjector/    # Silhouette/edge extraction
│   ├── measurement/          # Distance, area, angle
│   ├── drawings/             # 2D drawing generation from 3D models
│   ├── openbim/              # BCF topics, IDS specifications
│   └── utils/                # Math, UUID, helpers
└── front/src/                # @thatopen/components-front (adds renderer features)
    ├── core/
    │   ├── PostproductionRenderer/ # N8AO + edges + shadows
    │   ├── ClipStyler/             # Filled clipping sections
    │   ├── Marker/                 # 3D labels
    │   ├── PlatformComponents/     # Floating UI bits
    │   └── DepthDebugRenderer/
    ├── fragments/
    │   ├── Highlighter/   # Click-to-highlight items
    │   ├── Hoverer/       # Hover events
    │   ├── Outliner/      # Per-item outlines
    │   └── Mesher/        # Extract mesh from fragment items
    ├── civil/             # Alignment viewers (road / rail)
    ├── drawings/          # Front-end drawing helpers
    ├── measurement/       # Renderer-aware measurement UIs
    └── utils/
```

### Key mental model

- **`Components` is the root container.** Every feature is a `Component` subclass registered once and retrieved via `components.get(SomeComponent)`. Singletons per `Components` instance.
- **`Worlds` bundles scene + camera + renderer.** A single app can have many worlds (e.g., main viewport + minimap). Each world has its own lifecycle.
- **Features are opt-in.** Importing a component doesn't add cost until you `get()` it. Most features are lazy-initialized on first access.
- **Events are typed.** `new Event<Payload>()` → `.add(handler)` / `.trigger(payload)`. Used everywhere for loose coupling between components.
- **Front vs core split is strict.** If a feature needs a renderer (postproduction, highlight materials, outlines), it lives in `packages/front/`. If it only needs scene graph or data (classification, measurements, drawings metadata), it lives in `packages/core/`. New features should default to core unless rendering is essential.
- **Fragments is the data layer.** `@thatopen/components` doesn't own model data — it wraps `@thatopen/fragments`. `FragmentsManager` holds the `FragmentsModels` instance; other components query it.

## Setting up

```bash
git clone https://github.com/ThatOpen/engine_components.git
cd engine_components
yarn install
yarn dev
```

`yarn dev` starts a Vite server that serves every `example.ts` in the repo. Browse to the printed URL and pick one. Changes to source files hot-reload.

## Running examples locally against your changes

Examples import from the local source (e.g., `../../../..` into `packages/core/src/index.ts`), so edits to either package show up immediately without rebuilding.

The only time you need an explicit build:

- **Before opening a PR**, run `yarn build-libraries` to verify both packages build cleanly. This is the same check CI runs.
- **Testing consumer-side integration** (i.e., using the built `dist/` from another repo), run `yarn build-core` and/or `yarn build-front`.

## Adding a feature

1. Open an issue first (ask-first policy, per [docs.thatopen.com/contributing](https://docs.thatopen.com/contributing)).
2. Decide core vs front: does it need a renderer? If yes, front. If no, core.
3. Branch from `main`.
4. Create a folder under the appropriate package (e.g., `packages/core/src/core/MyFeature/`) with:
   - `index.ts` (re-exports)
   - `src/my-feature.ts` (the `Component` subclass)
   - `example.ts` + `example.html` (doubles as docs + regression test; deployed to the docs site)
5. Register your component in the parent `index.ts` barrel export.
6. Update `CHANGELOG.md` under `## Unreleased` if user-visible.
7. `yarn build-libraries` to verify the build.
8. Open a PR with a conventional-commits title (`feat:`, `fix:`, `feat!:` for breaking).

## Fixing a bug

1. Reproduce in the relevant `example.ts`, or add a new one under `packages/*/src/**/examples/` if the existing tutorial doesn't exercise the broken path.
2. Keep the fix minimal. Add a regression path in the example where practical.
3. PR title: `fix: <one-line description>`.

## Gotchas

- **Don't bundle `three` or `three/...` subpaths.** Both vite configs externalize `three` via a function that matches `three` and any `three/*` subpath (not just the exact string). Addons like `three/examples/jsm/...` and `three/webgpu` internally reach into three's build via relative paths — treating them as external prevents rollup from pulling the entire three source into the dist. If you're adding a new peer dep, match the pattern.
- **`Components.get()` is a singleton registry.** Calling it twice returns the same instance. Create-and-throw-away is not a supported pattern.
- **`World.camera` / `World.renderer` / `World.scene` can be reassigned.** Don't cache references; re-read from the world on demand if you need them later.
- **The front package depends on core.** Never import from `packages/front/` inside `packages/core/`. CI doesn't enforce this at build time, but it'll break consumers using only `@thatopen/components`.
- **Peer dependencies matter.** `@thatopen/components-front` has `@thatopen/components` as a peer. Your PR shouldn't bump the version range unless you genuinely depend on new API from core.
- **Most internal state lives on the `Component` instance, not the `Components` container.** When writing new components, prefer class fields to module-level globals so multiple `Components` instances can coexist.

## When in doubt

Read the existing examples under `packages/*/src/**/examples/` — they cover most of the public API. Every feature has a dedicated example, and they're the fastest way to understand integration patterns.
