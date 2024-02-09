import * as THREE from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
import { ToolComponent } from "../ToolsComponent";
import { MeshCullerRenderer, CullerRendererSettings } from "./src";

// TODO: Work at the instance level instead of the mesh level?

export interface ScreenCullerConfig {
  updateInterval?: number;
  rtWidth?: number;
  rtHeight?: number;
  autoUpdate?: boolean;
}

/**
 * A tool to handle big scenes efficiently by automatically hiding the objects
 * that are not visible to the camera.
 */
export class ScreenCuller
  extends Component<Map<string, THREE.InstancedMesh>>
  implements Disposable, Configurable<ScreenCullerConfig>
{
  static readonly uuid = "69f2a50d-c266-44fc-b1bd-fa4d34be89e6" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /** {@link Component.enabled} */
  get enabled() {
    return this.elements.enabled;
  }

  set enabled(value: boolean) {
    this.elements.enabled = value;
  }

  /** @deprecated use ScreenCuller.elements.onViewUpdated instead. */
  get onViewUpdated() {
    return this.elements.onViewUpdated;
  }

  /** @deprecated use ScreenCuller.elements.needsUpdate instead. */
  get needsUpdate() {
    return this.elements.needsUpdate;
  }

  /** @deprecated use ScreenCuller.elements.needsUpdate instead. */
  set needsUpdate(value: boolean) {
    this.elements.needsUpdate = value;
  }

  /** @deprecated use ScreenCuller.elements.renderDebugFrame instead. */
  get renderDebugFrame() {
    return this.elements.renderDebugFrame;
  }

  /** @deprecated use ScreenCuller.elements.renderDebugFrame instead. */
  set renderDebugFrame(value: boolean) {
    this.elements.renderDebugFrame = value;
  }

  elements: MeshCullerRenderer;

  /** @deprecated use ScreenCuller.elements.get instead. */
  get renderer() {
    return this.elements.get();
  }

  constructor(components: Components, settings?: CullerRendererSettings) {
    super(components);
    components.tools.add(ScreenCuller.uuid, this);
    this.elements = new MeshCullerRenderer(components, settings);

    this.elements.onViewUpdated.add(({ seen, unseen }) => {
      for (const mesh of seen) {
        mesh.visible = true;
      }
      for (const mesh of unseen) {
        mesh.visible = false;
      }
    });
  }

  /**
   * {@link Component.get}.
   * @returns the map of internal meshes used to determine visibility.
   */
  get() {
    return this.elements.colorMeshes;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this.enabled = false;
    await this.elements.dispose();
    await this.onDisposed.trigger(ScreenCuller.uuid);
    this.onDisposed.reset();
  }

  /**
   * @deprecated use ScreenCuller.elements.add instead.
   */
  add(mesh: THREE.Mesh | THREE.InstancedMesh) {
    this.elements.add(mesh);
  }

  /**
   * @deprecated use ScreenCuller.elements.updateVisibility instead.
   */
  updateVisibility = async (force?: boolean) => {
    await this.elements.updateVisibility(force);
  };
}

ToolComponent.libraryUUIDs.add(ScreenCuller.uuid);
