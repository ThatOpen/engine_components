import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { DataMap } from "@thatopen/fragments";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { ClipEdgesItemStyle, ClipStyler } from "..";

/**
 * The `ClipEdges` class is responsible for managing and rendering clipped edges and fills in a ThreeJS scene based on specified styles and models. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/ClipStyler). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/ClipEdges).
 */
export class ClipEdges implements OBC.Disposable {
  private _components: OBC.Components;

  private _modelStyleGeometries = new DataMap<
    string, // modelIds
    DataMap<string, { edges?: LineSegments2; fills?: THREE.Mesh }>
  >();

  /**
   * Detach functions for any Clipper plane add/remove listeners we
   * registered. Populated when local-clipping mode is on, so the
   * per-material `clippingPlanes` lists stay in sync with the live
   * Clipper state. Cleared on `dispose`.
   */
  private _clipperUnlisten: (() => void)[] = [];

  readonly onDisposed = new OBC.Event<undefined>();

  /**
   * The ThreeJS group that holds all the edges and fills together
   */
  readonly three = new THREE.Group();

  /**
   * A readonly property representing the ThreeJS plane used to created the edges and fills.
   */
  readonly plane: THREE.Plane;

  readonly items = new DataMap<
    string, // custom names
    ClipEdgesItemStyle
  >();

  /**
   * The world in which the edges and fills will be placed.
   */
  world: OBC.World | null = null;

  private _visible = false;

  /**
   * Sets the visibility of the object in the scene.
   * When set to `true`, the object is added to the scene if the `world` property is defined.
   * When set to `false`, the object is removed from its parent.
   */
  set visible(value: boolean) {
    if (value) {
      if (this.world) {
        this.world.scene.three.add(this.three);
        this._visible = true;
      }
    } else {
      this.three.removeFromParent();
      this._visible = false;
    }
  }

  get visible() {
    return this._visible;
  }

  constructor(components: OBC.Components, plane: THREE.Plane) {
    this._components = components;
    this.plane = plane;
    this.setupEvents();
  }

  private setupEvents() {
    const clipStyler = this._components.get(ClipStyler);

    // If the styler doesn't have the styleName, do not add it
    this.items.guard = (_, { style: styleName }) =>
      !!clipStyler.styles.get(styleName);

    this.items.onItemSet.add(({ value }) => {
      const { style: styleName, data } = value;
      this.create(styleName, data);
    });

    // In local-clipping mode the per-material `clippingPlanes` list
    // we build references the *current* set of Clipper planes; if a
    // user adds or removes a plane later we need to refresh ours so
    // the section keeps respecting (or stops respecting) that plane.
    // In legacy global-clipping mode the renderer handles propagation
    // for us, so we only wire these in local mode.
    const clipper = this._components.get(OBC.Clipper);
    if (!clipper.localClippingPlanes) return;
    const refresh = () => this.refreshClippingPlanes();
    clipper.onAfterCreate.add(refresh);
    clipper.onAfterDelete.add(refresh);
    this._clipperUnlisten.push(() => clipper.onAfterCreate.remove(refresh));
    this._clipperUnlisten.push(() => clipper.onAfterDelete.remove(refresh));
  }

  /**
   * Recomputes each section mesh's `material.clippingPlanes` to
   * `(all clipper planes) - (this.plane)`. Cheap (a couple of array
   * pushes per material); called whenever the Clipper plane list
   * changes so existing sections stay in sync.
   */
  private refreshClippingPlanes() {
    const clipper = this._components.get(OBC.Clipper);
    const others: THREE.Plane[] = [];
    for (const [, clip] of clipper.list) {
      if (clip.three === this.plane) continue;
      others.push(clip.three);
    }
    for (const [, modelStyles] of this._modelStyleGeometries) {
      for (const [, { edges, fills }] of modelStyles) {
        if (edges) edges.material.clippingPlanes = others;
        if (fills) {
          (fills.material as THREE.Material).clippingPlanes = others;
        }
      }
    }
  }

  private async getStyleMeshes(modelId: string, styleName: string) {
    const clipStyler = this._components.get(ClipStyler);
    const style = clipStyler.styles.get(styleName);
    if (!style) {
      throw new Error(`ClipStyler: "${styleName}" style not found.`);
    }

    const fragments = this._components.get(OBC.FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) {
      throw new Error(`ClipEdges: model with id "${modelId}" not found.`);
    }

    const { linesMaterial, fillsMaterial } = style;

    let modelStyles = this._modelStyleGeometries.get(modelId);
    if (!modelStyles) {
      modelStyles = new DataMap();
      this._modelStyleGeometries.set(modelId, modelStyles);
    }

    let styleGeometries = modelStyles.get(styleName);
    if (!styleGeometries) {
      // When the Clipper is in local-clipping mode we need *this*
      // ClipEdges' section meshes to use a `clippingPlanes` list
      // that excludes its own plane (so the cut isn't culled by
      // the very plane it represents) while still being clipped
      // by every other Clipper plane (section box walls, multi-
      // clipper setups). three.js applies clipping per-material,
      // not per-mesh, so we have to clone the style's materials
      // per ClipEdges to give each one its own filtered list. In
      // the legacy global-clipping mode we keep the original
      // shared-material behavior for backwards compatibility.
      const localMode = this._components.get(OBC.Clipper).localClippingPlanes;
      const myLinesMaterial =
        localMode && linesMaterial ? linesMaterial.clone() : linesMaterial;
      const myFillsMaterial =
        localMode && fillsMaterial ? fillsMaterial.clone() : fillsMaterial;

      let edges: LineSegments2 | undefined;
      if (myLinesMaterial) {
        edges = new LineSegments2(new LineSegmentsGeometry(), myLinesMaterial);
        edges.frustumCulled = false;
        if (model) {
          fragments.applyBaseCoordinateSystem(edges, await model.getCoordinationMatrix())
        }
        this.three.add(edges);
      }

      let fills: THREE.Mesh | undefined;
      if (myFillsMaterial) {
        fills = new THREE.Mesh(new THREE.BufferGeometry(), myFillsMaterial);
        if (model) {
          fragments.applyBaseCoordinateSystem(fills, await model.getCoordinationMatrix())
        }
        this.three.add(fills);
      }

      styleGeometries = { edges, fills };
      modelStyles.set(styleName, styleGeometries);
    }

    return styleGeometries;
  }

  private async updateMeshes(
    modelId: string,
    styleName: string,
    localIds?: number[],
  ) {
    const fragments = this._components.get(OBC.FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) return;

    const disposer = this._components.get(OBC.Disposer);
    const clipper = this._components.get(OBC.Clipper);
    const localMode = clipper.localClippingPlanes;

    const plane = this.plane.clone();

    const planeTransform = (await model.getCoordinationMatrix())
      .clone()
      .multiply(fragments.baseCoordinationMatrix.clone().invert());

    plane.applyMatrix4(planeTransform)

    if (!localMode) {
      // Legacy global-clipping mode: the section sits on the cut
      // and three.js's global clipping discard would cull it (any
      // fragment dotted with the clip plane equals the plane
      // constant and gets culled). Push the section a centimeter
      // along the normal to dodge the cull. Looks correct head-on
      // but introduces a sideways screen-space shift at oblique
      // viewing angles — that's the misalignment described in
      // issue #733. The local-clipping path below sidesteps the
      // whole problem by giving the section's own material a
      // `clippingPlanes` list that excludes this plane.
      plane.constant -= 0.01;
    }

    const section = await model.getSection(plane, localIds);
    const { buffer, index, fillsIndices } = section;

    const meshes = await this.getStyleMeshes(modelId, styleName);
    const { edges, fills } = meshes;

    // Build the section's clipping list: every active clipper plane
    // *except* this section's own plane. The cut geometry sits
    // exactly on that plane, so including it would discard the
    // whole fill; including the rest keeps multi-plane setups
    // (section box, multiple clippers) working.
    if (localMode) this.refreshClippingPlanes();

    const posAttr = new THREE.BufferAttribute(buffer, 3, false);

    // Update edges
    if (edges) {
      posAttr.setUsage(THREE.DynamicDrawUsage);
      const tempGeo = new THREE.BufferGeometry();
      tempGeo.setAttribute("position", posAttr);
      tempGeo.setDrawRange(0, index);
      const temp = new THREE.LineSegments(tempGeo);
      edges.geometry.fromLineSegments(temp);
      disposer.destroy(temp);
    }
    
    // Update fills
    if (fills) {
      fills.geometry.attributes.position = posAttr;
      fills.geometry.setIndex(fillsIndices);
    }
  }

  private async create(
    styleName: string,
    data?: OBC.ClassifierIntersectionInput,
  ) {
    const clipStyler = this._components.get(ClipStyler);
    const style = clipStyler.styles.get(styleName);
    if (!style) {
      throw new Error(`ClipEdges: "${styleName}" style not found.`);
    }

    const classifier = this._components.get(OBC.Classifier);
    let modelIdMap = null;
    if (data) modelIdMap = await classifier.find(data);

    const fragments = this._components.get(OBC.FragmentsManager);

    if (modelIdMap) {
      for (const [modelId, localIds] of Object.entries(modelIdMap)) {
        const model = fragments.list.get(modelId);
        if (!model) continue;
        this.updateMeshes(modelId, styleName, [...localIds]);
      }
    } else {
      for (const [modelId] of fragments.list) {
        this.updateMeshes(modelId, styleName);
      }
    }
  }

  /**
   * Updates the clip edges based on the provided groups and their associated styles and data.
   * If no groups are specified, all items will be updated.
   *
   * @param groups - An optional array of group names to filter which items should be updated.
   * @returns A promise that resolves when the update process is complete.
   */
  async update(groups?: string[]) {
    for (const [group, { data, style: styleName }] of this.items) {
      if (groups && !groups.includes(group)) continue;
      this.create(styleName, data);
    }
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    const disposer = this._components.get(OBC.Disposer);
    disposer.destroy(this.three, true, true);
    this._modelStyleGeometries.clear();
    for (const off of this._clipperUnlisten) off();
    this._clipperUnlisten.length = 0;
  }
}
