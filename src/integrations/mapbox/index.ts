import * as THREE from "three";
import * as MAPBOX from "mapbox-gl";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { MapboxBuilding, MapboxParameters } from "./src/types";
import { Components, SimpleRaycaster, SimpleScene } from "../../core";
import { MapboxRenderer } from "./src/mapbox-renderer";
import { MapboxCamera } from "./src/mapbox-camera";

/**
 * The main element to create a mapbox-IFC.js application.
 */
export class MapboxWindow {
  minTargetZoom = 0.0015;

  private readonly _components: Components;
  private readonly _map: MAPBOX.Map;
  private readonly _center: [number, number];
  private readonly _style = "mapbox://styles/mapbox/light-v10";

  private _labels: { [id: string]: CSS2DObject } = {};
  private _buildings: MapboxBuilding[] = [];

  /**
   * @param config: information needed to initialize the scene, including
   * the Mapbox access token and the HTML div element to display the scene.
   */
  constructor(config: MapboxParameters) {
    this._components = new Components();
    this._center = [0, 0];
    const merc = MAPBOX.MercatorCoordinate;
    const coords = merc.fromLngLat(this._center, 0);
    this._map = this.newMap(config);
    this.setupComponents(coords);
    this.setupScene();
    this.add(config.buildings);
  }

  /**
   * Add a new set of buildings to the GIS scene.
   *
   * @param buildings The array of {@link MapboxBuilding} to add.
   * @param fitToScreen Whether to center the camera to see all buildings.
   */
  add(buildings: MapboxBuilding[], fitToScreen = true) {
    for (const building of buildings) {
      const { id, lng, lat, htmlElement } = building;
      if (lng === undefined || lat === undefined) continue;

      const label = new CSS2DObject(htmlElement);

      const center = MAPBOX.MercatorCoordinate.fromLngLat(
        { lng: this._center[0], lat: this._center[1] },
        0
      );

      const units = center.meterInMercatorCoordinateUnits();

      const model = MAPBOX.MercatorCoordinate.fromLngLat({ lng, lat }, 0);
      model.x /= units;
      model.y /= units;
      center.x /= units;
      center.y /= units;

      label.position.set(model.x - center.x, 0, model.y - center.y);

      this._components.scene.get().add(label);
      this._labels[id] = label;
      this._buildings.push(building);
    }

    if (this._buildings.length && fitToScreen) {
      this.centerMapToBuildings();
    }
  }

  /**
   * Removes a building from the map.
   *
   * @param id The {@link MapboxBuilding} to remove.
   */
  remove(id: string) {
    const label = this._labels[id];
    delete this._labels[id];
    label.removeFromParent();
    (label.element as any) = undefined;
    const found = this._buildings.find((building) => building.id === id);
    if (found) {
      const index = this._buildings.indexOf(found);
      this._buildings.splice(index, 1);
    }
  }

  /**
   * Removes all buildings from the map.
   */
  removeAll() {
    for (const id in this._labels) {
      this.remove(id);
    }
  }

  /**
   * Disposes all the data of the map. This needs to be called if the
   * component that contains the map is deleted: otherwise, a memory leak
   * will be created.
   */
  async dispose() {
    for (const id in this._labels) {
      const label = this._labels[id];
      label.removeFromParent();
      label.element.remove();
    }
    this._buildings = [];
    this._labels = {};
    await this._components.dispose();
    (this._map as any) = null;
    (this._components as any) = null;
  }

  centerMapToBuildings() {
    let maxLng = -Number.MAX_VALUE;
    let maxLat = -Number.MAX_VALUE;
    let minLng = Number.MAX_VALUE;
    let minLat = Number.MAX_VALUE;

    for (const building of this._buildings) {
      if (building.lng > maxLng) {
        maxLng = building.lng;
      }
      if (building.lng < minLng) {
        minLng = building.lng;
      }
      if (building.lat > maxLat) {
        maxLat = building.lat;
      }
      if (building.lat < minLat) {
        minLat = building.lat;
      }
    }

    const factor = 0.4;
    const width = Math.max(this.minTargetZoom, maxLng - minLng);
    const height = Math.max(this.minTargetZoom, maxLat - minLat);

    maxLng += factor * width;
    maxLat += factor * height;
    minLng -= factor * width;
    minLat -= factor * height;
    if (maxLng > 180) maxLng = 180;
    if (minLng < -180) minLng = -180;
    if (maxLat > 90) maxLat = 90;
    if (minLat < -90) minLat = -90;

    this._map.fitBounds([minLng, minLat, maxLng, maxLat]);
  }

  private newMap(config: MapboxParameters) {
    return new MAPBOX.Map({
      ...config,
      pitch: 60,
      bearing: -40,
      zoom: 4,
      style: this._style,
      antialias: true,
    });
  }

  private setupComponents(coords: MAPBOX.MercatorCoordinate) {
    this._components.scene = new SimpleScene(this._components);
    this._components.camera = new MapboxCamera(this._components);
    const renderer = new MapboxRenderer(this._components, this._map, coords);
    this._components.renderer = renderer;
    renderer.onInitialized.add(() => {
      this._components.raycaster = new SimpleRaycaster(this._components);
      this._components.init();
    });
  }

  private setupScene() {
    const scene = this._components.scene.get();
    scene.background = null;
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);
  }
}
