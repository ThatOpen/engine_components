import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Disposable, Event, BaseRenderer } from "../../../base-types";
import { Components } from "../../../core";

/**
 * Minimal renderer that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 * [See example](https://ifcjs.github.io/components/examples/mapbox.html).
 */
export class MapboxRenderer extends BaseRenderer implements Disposable {
  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event<MapboxRenderer>();

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event<MapboxRenderer>();

  /**
   * The renderer can only be initialized once Mapbox' map has been loaded. This
   * method triggers when that happens, so any initial logic that depends on the
   * renderer has to subscribe to this.
   */
  readonly onInitialized = new Event<THREE.Renderer>();

  private _labelRenderer = new CSS2DRenderer();
  private _renderer = new THREE.WebGLRenderer();
  private _map: any;
  private _components: Components;
  private readonly _initError = "Mapbox scene isn't initialized yet!";

  private _modelTransform: {
    translateX: number;
    translateY: number;
    translateZ: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    scale: number;
  };

  constructor(
    components: Components,
    map: any,
    coords: any,
    rotation = new THREE.Vector3(Math.PI / 2, 0, 0)
  ) {
    super(components);
    this._components = components;
    this._map = map;
    this._modelTransform = this.newModelTransform(coords, rotation);
    this.setupMap(map);
    this.setup3DBuildings();
  }

  /** {@link Component.get} */
  get(): THREE.WebGLRenderer {
    return this._renderer;
  }

  /** {@link Resizeable.getSize} */
  getSize(): THREE.Vector2 {
    if (!this._renderer) {
      throw new Error(this._initError);
    }
    return new THREE.Vector2(
      this._renderer.domElement.clientWidth,
      this._renderer.domElement.clientHeight
    );
  }

  /** {@link Resizeable.resize}. Mapbox automatically handles this. */
  resize(): void {}

  /** {@link Disposable.dispose} */
  async dispose() {
    this.onInitialized.reset();
    this.enabled = false;
    this.setupEvents(false);
    this._renderer.dispose();
    this._map.remove();
    this._map = null;
  }

  private initialize(context: WebGLRenderingContext) {
    const canvas = this._map.getCanvas();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      antialias: true,
    });
    this._renderer = renderer;
    this._renderer.autoClear = false;
    this.initializeLabelRenderer();
    this.onInitialized.trigger(renderer);
  }

  private setupMap(map: any) {
    const scene = this._components.scene.get();
    const onAdd = (_map: any, gl: any) => this.initialize(gl);
    const render = (_gl: any, matrix: any) => this.render(scene, matrix);
    const customLayer = this.newMapboxLayer(onAdd, render);
    map.on("style.load", () => {
      map.addLayer(customLayer, "waterway-label");
    });
  }

  private newMapboxLayer(onAdd: any, render: any) {
    return {
      id: "3d-model",
      type: "custom",
      renderingMode: "3d",
      onAdd,
      render,
    };
  }

  private newModelTransform(coords: any, rotation: THREE.Vector3) {
    return {
      translateX: coords.x,
      translateY: coords.y,
      translateZ: coords.z,
      rotateX: rotation.x,
      rotateY: rotation.y,
      rotateZ: rotation.z,
      scale: coords.meterInMercatorCoordinateUnits(),
    };
  }

  // Source: https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/

  private render(scene: THREE.Scene, matrix: number[]) {
    if (!this._renderer || !this.enabled) return;
    this.onBeforeUpdate.trigger(this);

    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      this._modelTransform.rotateX
    );

    const rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      this._modelTransform.rotateY
    );

    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      this._modelTransform.rotateZ
    );

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        this._modelTransform.translateX,
        this._modelTransform.translateY,
        this._modelTransform.translateZ
      )
      .scale(
        new THREE.Vector3(
          this._modelTransform.scale,
          -this._modelTransform.scale,
          this._modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    const camera = this._components.camera.get();
    camera.projectionMatrix = m.multiply(l);
    this._renderer.resetState();
    this._renderer.render(scene, camera);

    this._labelRenderer.render(scene, camera);

    this._map.triggerRepaint();

    this.onAfterUpdate.trigger(this);
  }

  private initializeLabelRenderer() {
    this.updateLabelRendererSize();
    this.setupEvents(true);
    this._labelRenderer.domElement.style.position = "absolute";
    this._labelRenderer.domElement.style.top = "0px";
    const dom = this._labelRenderer.domElement;
    this._renderer?.domElement.parentElement?.appendChild(dom);
  }

  private updateLabelRendererSize = () => {
    if (this._renderer?.domElement) {
      this._labelRenderer.setSize(
        this._renderer.domElement.clientWidth,
        this._renderer.domElement.clientHeight
      );
    }
  };

  // Source: https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/

  private setup3DBuildings() {
    this._map.on("load", () => {
      const layers = this._map.getStyle().layers as any[];
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      ).id;

      this._map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });
  }

  private setupEvents(active: boolean) {
    if (active) {
      window.addEventListener("resize", this.updateLabelRendererSize);
    } else {
      window.removeEventListener("resize", this.updateLabelRendererSize);
    }
  }
}
