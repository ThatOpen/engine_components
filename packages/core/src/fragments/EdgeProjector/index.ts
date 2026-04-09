import * as THREE from "three";
import { MeshBVH, SAH } from "three-mesh-bvh";
import { Component, Components, Disposable, Event, World } from "../../core";
import { FragmentsManager, ModelIdMap } from "../FragmentsManager";
// @ts-ignore
import { EdgeProjectorProjectionGenerator, EdgeProjectorVisibilityCuller } from "./projection/index.js";

/**
 * Result of an edge projection, containing visible/hidden geometries
 * and a mapping from group indices to model item identifiers.
 */
export interface EdgeProjectionResult {
  /** Line segment geometry for visible edges. Has a `group` vertex attribute with group indices. */
  visible: THREE.BufferGeometry;
  /** Line segment geometry for hidden edges. Has a `group` vertex attribute with group indices. */
  hidden: THREE.BufferGeometry;
  /** Maps group index to `{ modelId, localId }` identifying the source item. */
  groups: Record<number, { modelId: string; localId: number }>;
}

/**
 * Component that generates 2D edge projections from fragment model items.
 * It takes a ModelIdMap, converts items to meshes, and runs them through
 * the three-edge-projection library to produce visible/hidden line segment geometries.
 */
export class EdgeProjector extends Component implements Disposable {
  static readonly uuid = "f2e76c3a-8b1d-4d5e-9a3f-7c6b2d4e8f1a" as const;

  enabled = true;

  readonly onDisposed = new Event();

  /**
   * The underlying ProjectionGenerator from three-edge-projection.
   * You can configure angleThreshold, iterationTime, includeIntersectionEdges, and useWebGPU.
   */
  readonly generator: any = new EdgeProjectorProjectionGenerator();

  /**
   * Resolution of the visibility culler in pixels per meter.
   * Higher values = more accurate occlusion but slower culling.
   */
  cullerPixelsPerMeter = 0.05;

  /**
   * The direction the projector looks along. Meshes are projected onto the plane
   * perpendicular to this direction. Default is top-down (plan view).
   *
   * Common values:
   * - Top/Plan: `(0, -1, 0)`
   * - Front: `(0, 0, -1)`
   * - Back: `(0, 0, 1)`
   * - Left: `(-1, 0, 0)`
   * - Right: `(1, 0, 0)`
   */
  readonly projectionDirection = new THREE.Vector3(0, -1, 0);

  /**
   * Near clipping plane along the projection direction.
   * Meshes whose AABB is fully "behind" this plane (closer to the viewer) are excluded.
   * Set to -Infinity to disable.
   */
  nearPlane = -Infinity;

  /**
   * Far clipping plane along the projection direction.
   * Meshes whose AABB is fully "beyond" this plane (farther from the viewer) are excluded.
   * Set to Infinity to disable.
   */
  farPlane = Infinity;

  constructor(components: Components) {
    super(components);
    this.components.add(EdgeProjector.uuid, this);
    this.generator.includeIntersectionEdges = false;
  }

  /**
   * Generates 2D edge projections for the given model items.
   *
   * @param modelIdMap - A map of model IDs to sets of local IDs specifying items to project.
   * @param world - The world whose renderer will be used for visibility culling.
   * @param config - Optional configuration.
   * @param config.onProgress - Optional progress callback receiving (message, progress?, collector?).
   * @returns Visible/hidden geometries with a `group` vertex attribute, and a groups mapping.
   */
  async get(
    modelIdMap: ModelIdMap,
    world: World,
    config?: {
      onProgress?: (message: string, progress?: number) => void;
    },
  ): Promise<EdgeProjectionResult> {
    const fragments = this.components.get(FragmentsManager);
    const group = new THREE.Group();
    const geometries = new Map<string | number, THREE.BufferGeometry>();

    for (const [modelId, localIds] of Object.entries(modelIdMap)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;

      // Filter to only items that have geometry
      const idsWithGeometry = await model.getItemsIdsWithGeometry();
      const ids = idsWithGeometry.filter((id: number) => localIds.has(id));
      if (ids.length === 0) continue;

      const allMeshesData = await model.getItemsGeometry(ids);

      for (const itemId in allMeshesData) {
        const meshData = allMeshesData[itemId];
        for (const geomData of meshData) {
          if (
            !geomData.positions ||
            !geomData.indices ||
            !geomData.transform ||
            !geomData.representationId
          ) {
            continue;
          }

          const repId = geomData.representationId;
          if (!geometries.has(repId)) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute(
              "position",
              new THREE.Float32BufferAttribute(geomData.positions, 3),
            );
            if (geomData.normals) {
              geometry.setAttribute(
                "normal",
                new THREE.Float32BufferAttribute(geomData.normals, 3),
              );
            }
            geometry.setIndex(Array.from(geomData.indices));
            geometries.set(repId, geometry);
          }

          const geometry = geometries.get(repId)!;
          const mesh = new THREE.Mesh(geometry);
          mesh.applyMatrix4(geomData.transform);
          mesh.applyMatrix4(model.object.matrixWorld);
          mesh.updateWorldMatrix(true, true);

          // Tag mesh with item identity for groupFn
          mesh.userData._edgeProjectorModelId = modelId;
          mesh.userData._edgeProjectorLocalId = geomData.localId;

          group.add(mesh);
        }
      }
    }

    // Compute rotation to align projectionDirection with Y-down (what the library expects)
    const dir = this.projectionDirection.clone().normalize();
    const yDown = new THREE.Vector3(0, -1, 0);
    const rotationQuat = new THREE.Quaternion().setFromUnitVectors(dir, yDown);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(rotationQuat);
    const inverseRotationMatrix = rotationMatrix.clone().invert();

    // Apply rotation to each mesh directly so matrixWorld is correct
    for (const child of group.children) {
      child.applyMatrix4(rotationMatrix);
      child.updateWorldMatrix(false, false);
    }

    // Pre-build BVHs (after rotation so bounds are correct)
    group.traverse((c) => {
      const child = c as THREE.Mesh;
      if (child.geometry && !child.geometry.boundsTree) {
        const elCount = child.geometry.index
          ? child.geometry.index.count
          : child.geometry.attributes.position.count;
        child.geometry.groups.forEach((g) => {
          if (g.count === Infinity) {
            g.count = elCount - g.start;
          }
        });
        child.geometry.boundsTree = new MeshBVH(child.geometry, {
          maxLeafSize: 1,
          strategy: SAH,
        });
      }
    });

    // Filter meshes by near/far planes (along Y after rotation = along projectionDirection in world)
    if (this.nearPlane !== -Infinity || this.farPlane !== Infinity) {
      const box = new THREE.Box3();
      const toRemove: THREE.Object3D[] = [];
      for (const child of group.children) {
        const mesh = child as THREE.Mesh;
        if (!mesh.geometry) continue;
        box.setFromObject(mesh);
        if (box.max.y < this.nearPlane || box.min.y > this.farPlane) {
          toRemove.push(mesh);
        }
      }
      for (const mesh of toRemove) {
        group.remove(mesh);
      }
    }

    // Use VisibilityCuller to pre-filter meshes (provides occlusion)
    const renderer = world.renderer as any;
    const threeRenderer = renderer.three as THREE.WebGLRenderer;
    const visibilityCuller = new EdgeProjectorVisibilityCuller(threeRenderer, {
      pixelsPerMeter: this.cullerPixelsPerMeter,
    });

    // Use groupFn to tag edges by source item
    const collector = await this.generator.generateAsync(group, {
      visibilityCuller,
      groupFn: (mesh: THREE.Mesh) => {
        const mid = mesh.userData._edgeProjectorModelId ?? "unknown";
        const lid = mesh.userData._edgeProjectorLocalId ?? 0;
        return `${mid}:${lid}`;
      },
      onProgress: config?.onProgress,
    });

    const visible = collector.getVisibleLineGeometry();
    const hidden = collector.getHiddenLineGeometry();

    // Rotate results back to world space
    visible.applyMatrix4(inverseRotationMatrix);
    hidden.applyMatrix4(inverseRotationMatrix);

    // Build groups mapping: group index -> { modelId, localId }
    const groupKeys: Record<string, number> = collector.getGroupKeys();
    const groups: Record<number, { modelId: string; localId: number }> = {};
    for (const [key, index] of Object.entries(groupKeys)) {
      const separatorIdx = key.lastIndexOf(":");
      const modelId = key.substring(0, separatorIdx);
      const localId = Number(key.substring(separatorIdx + 1));
      groups[index] = { modelId, localId };
    }

    // Clean up
    for (const geometry of geometries.values()) {
      geometry.dispose();
    }

    return { visible, hidden, groups };
  }

  dispose() {
    this.onDisposed.trigger(EdgeProjector.uuid);
    this.onDisposed.reset();
  }
}
