import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { DataSet } from "@thatopen/fragments";
import { Highlighter } from "../Highlighter";
import { PostproductionRenderer } from "../../core";
import { Mesher } from "../Mesher";

/**
 * This component allows adding a colored outline with thickness to fragments in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Outliner). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Outliner).
 */
export class Outliner extends OBC.Component implements OBC.Disposable {
  private _world?: OBC.World;

  /**
   * The world where the outliner operates.
   */
  set world(value: OBC.World | undefined) {
    this._world = value;
    if (!value) return;
    const renderer = this.getRenderer();
    renderer.postproduction.excludedObjectsPass.addExcludedMaterial(
      this._points.material,
    );
  }

  get world() {
    return this._world;
  }

  /**
   * A set of Highlighter styles to be linked with the outliner.
   * @remarks Use this or addItems directly but avoid using both at the same time to prevent unwanted results
   */
  styles = new DataSet<string>();

  // display a point for very far elements
  outlinePositions = false;

  private _mesh: THREE.Points<
    THREE.BufferGeometry,
    THREE.PointsMaterial
  > | null = null;

  private get _points() {
    if (!this._mesh) {
      this._mesh = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({
          size: 10,
          sizeAttenuation: false,
          depthTest: false,
        }),
      );
    }
    return this._mesh;
  }

  /** {@link OBC.Component.enabled} */
  get enabled() {
    if (!this.world || this.world.isDisposing) {
      return false;
    }

    const renderer = this.getRenderer();
    return renderer.postproduction.outlinesEnabled;
  }

  /** {@link OBC.Component.enabled} */
  set enabled(value: boolean) {
    if (!this.world || this.world.isDisposing) {
      return;
    }

    const renderer = this.getRenderer();
    renderer.postproduction.outlinesEnabled = value;

    if (this.outlinePositions) {
      this._points.material.color = this.color;
      this.world.scene.three.add(this._points);
    }
  }

  get color() {
    return this.getRenderer().postproduction.outlinePass.outlineColor;
  }

  /**
   * Sets the color for the outline.
   */
  set color(value: THREE.Color) {
    const postproduction = this.getRenderer().postproduction;
    postproduction.outlinePass.outlineColor.copy(value);
    this._points.material.color.copy(value);
  }

  get thickness() {
    return this.getRenderer().postproduction.outlinePass.thickness;
  }

  /**
   * Sets the thickness of the outline effect in the post-production renderer.
   */
  set thickness(value: number) {
    this.getRenderer().postproduction.outlinePass.thickness = value;
  }

  get fillColor() {
    return this.getRenderer().postproduction.outlinePass.fillColor;
  }

  /**
   * Sets the fill color for the outline effect in the postproduction pipeline.
   */
  set fillColor(value: THREE.Color) {
    const postproduction = this.getRenderer().postproduction;
    postproduction.outlinePass.fillColor.copy(value);
  }

  get fillOpacity() {
    return this.getRenderer().postproduction.outlinePass.fillOpacity;
  }

  /**
   * Sets the fill opacity for the outline pass in the postproduction renderer.
   */
  set fillOpacity(value: number) {
    const postproduction = this.getRenderer().postproduction;
    postproduction.outlinePass.fillOpacity = value;
  }

  readonly onDisposed = new OBC.Event();

  /**
   * A unique identifier for the component.

   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "2fd3bcc5-b3b6-4ded-9f64-f47a02854a10" as const;

  private _meshes: THREE.Mesh[] = [];

  private _map: OBC.ModelIdMap = {};

  private _activeStyles = new Set<string>();
  private _styleCallbacks: {
    [style: string]: {
      onHighlight: () => void;
      onClear: (map: OBC.ModelIdMap) => void;
    };
  } = {};

  constructor(components: OBC.Components) {
    super(components);
    components.add(Outliner.uuid, this);
    this.setupEvents();
  }

  private setupEvents() {
    const highlighter = this.components.get(Highlighter);

    // Only add the style if it exist in the highlighter
    this.styles.guard = (style) => {
      return highlighter.styles.has(style);
    };

    this.styles.onItemAdded.add((style) => {
      const highlighter = this.components.get(Highlighter);
      const onHighlight = () => {
        this._activeStyles.add(style);
        this.updateFromStyles();
      };
      const onClear = () => {
        this._activeStyles.delete(style);
        this.updateFromStyles();
      };
      this._styleCallbacks[style] = { onHighlight, onClear };
      highlighter.events[style].onHighlight.add(onHighlight);
      highlighter.events[style].onClear.add(onClear);
    });

    this.styles.onBeforeDelete.add((style) => {
      const { onHighlight, onClear } = this._styleCallbacks[style];
      highlighter.events[style].onHighlight.remove(onHighlight);
      highlighter.events[style].onClear.remove(onClear);
      this._activeStyles.delete(style);
      delete this._styleCallbacks[style];
    });

    highlighter.styles.onItemDeleted.add((style) => this.styles.delete(style));
  }

  private async updateFromStyles() {
    const highlighter = this.components.get(Highlighter);
    const maps: OBC.ModelIdMap[] = [];
    for (const style of this._activeStyles) {
      const map = highlighter.selection[style];
      if (!map) continue;
      maps.push(map);
    }
    const map = OBC.ModelIdMapUtils.join(maps);
    this._map = map;
    await this.update();
  }

  /**
   * Updates the outline effect with the current meshes from the mesher component.
   */
  async update(modelIdMap = this._map) {
    if (modelIdMap === this._map) this.cleanMeshes();
    if (this.outlinePositions) this.updatePoints();
    if (Object.keys(modelIdMap).length === 0) return;
    const renderer = this.getRenderer();
    const outlinePass = renderer.postproduction.outlinePass;
    const mesher = this.components.get(Mesher);
    const meshes = await mesher.get(modelIdMap);
    for (const [_, data] of meshes.entries()) {
      const meshes = [...data.values()].flat();
      for (const mesh of meshes) {
        this._meshes.push(mesh);
        outlinePass.scene.add(mesh);
      }
    }
  }

  /**
   * Adds items to be outlined.
   *
   * @param modelIdMap - An object representing the model ID map to be added.
   * @returns A promise that resolves once the outliner has been updated with the new model ID map.
   */
  async addItems(modelIdMap: OBC.ModelIdMap) {
    OBC.ModelIdMapUtils.add(this._map, modelIdMap);
    await this.update(modelIdMap);
  }

  /**
   * Removes items from the current outlines.
   *
   * @param modelIdMap - An object representing the mapping of model IDs to be removed.
   * @returns A promise that resolves once the update operation is complete.
   */
  async removeItems(modelIdMap: OBC.ModelIdMap) {
    OBC.ModelIdMapUtils.remove(this._map, modelIdMap);
    await this.update();
  }

  /**
   * Cleans up the outlines.
   */
  clean() {
    this._map = {};
    this._activeStyles.clear();
    this.cleanMeshes();
    if (this._mesh) {
      const disposer = this.components.get(OBC.Disposer);
      disposer.destroy(this._mesh, true, true);
    }
    this._mesh = null;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.styles.clear();
    this.clean();
    this.onDisposed.trigger(Outliner.uuid);
  }

  private cleanMeshes() {
    for (const mesh of this._meshes) {
      mesh.removeFromParent();
    }
    this._meshes = [];
  }

  private async updatePoints() {
    let items = 0;

    for (const [_, localIds] of Object.entries(this._map)) {
      items += localIds.size;
    }

    this._points.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(items * 3), 3),
    );

    const fragments = this.components.get(OBC.FragmentsManager);
    const positions = await fragments.getPositions(this._map);

    for (let i = 0; i < positions.length; i++) {
      const { x, y, z } = positions[i];
      this._points.geometry.attributes.position.array[i * 3] = x;
      this._points.geometry.attributes.position.array[i * 3 + 1] = y;
      this._points.geometry.attributes.position.array[i * 3 + 2] = z;
    }

    this._points.geometry.attributes.position.needsUpdate = true;
  }

  private getRenderer() {
    if (!this.world) {
      throw new Error("You must set a world to use the outliner!");
    }

    const renderer = this.world.renderer as PostproductionRenderer;
    if (!renderer.postproduction) {
      throw new Error(
        "The world given to the outliner must use the postproduction renderer.",
      );
    }

    return renderer;
  }
}
