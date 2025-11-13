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
      let edges: LineSegments2 | undefined;
      if (linesMaterial) {
        edges = new LineSegments2(new LineSegmentsGeometry(), linesMaterial);
        edges.frustumCulled = false;
        if (model) {
          fragments.applyBaseCoordinateSystem(edges, await model.getCoordinationMatrix())
        }
        this.three.add(edges);
      }
      
      let fills: THREE.Mesh | undefined;
      if (fillsMaterial) {
        fills = new THREE.Mesh(new THREE.BufferGeometry(), fillsMaterial);
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

    const plane = this.plane.clone();

    const planeTransform = (await model.getCoordinationMatrix())
      .clone()
      .multiply(fragments.baseCoordinationMatrix.clone().invert());
    
    plane.applyMatrix4(planeTransform)

    plane.constant -= 0.01; // little offset to avoid z-fighting

    const section = await model.getSection(plane, localIds);
    const { buffer, index, fillsIndices } = section;

    const meshes = await this.getStyleMeshes(modelId, styleName);
    const { edges, fills } = meshes;

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
  }
}
