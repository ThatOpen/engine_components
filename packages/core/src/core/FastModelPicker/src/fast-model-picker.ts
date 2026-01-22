import * as THREE from "three";
import { Components } from "../../Components";
import { Component, Event, World, Disposable } from "../../Types";
import { Mouse } from "../../Raycasters/src/mouse";
import { FragmentsManager } from "../../../fragments";

/**
 * A fast model picker that uses color coding to identify fragment models under the mouse cursor. This is much faster than raycasting for simple model identification.
 */
export class FastModelPicker implements Disposable {
  /** {@link Component.enabled} */
  enabled = true;

  /** The components instance to which this FastModelPicker belongs. */
  components: Components;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** The position of the mouse in the screen. */
  readonly mouse: Mouse;

  /**
   * A reference to the world instance to which this FastModelPicker belongs.
   * This is used to access the camera and scene.
   */
  world: World;

  /**
   * Whether debug mode is enabled. When enabled, shows the color-coded canvas.
   */
  debugMode = false;

  /**
   * Map from color (as RGB number) to model ID.
   * Color is encoded as: (r << 16) | (g << 8) | b
   */
  private colorToModelId = new Map<number, string>();

  /**
   * Map from model ID to color.
   */
  private modelIdToColor = new Map<string, THREE.Color>();

  /**
   * Render target for the color-coded scene.
   */
  private renderTarget?: THREE.WebGLRenderTarget;

  /**
   * Size of the render target (stored separately since getSize doesn't exist).
   */
  private renderTargetSize = new THREE.Vector2();

  /**
   * Debug canvas element (shown when debugMode is true).
   */
  private debugCanvas?: HTMLCanvasElement;

  /**
   * Debug container element.
   */
  private debugContainer?: HTMLDivElement;

  /**
   * Material used for color-coding models.
   */
  private colorMaterials = new Map<string, THREE.MeshBasicMaterial>();

  /**
   * Original materials cache (to restore after picking).
   */
  private originalMaterials = new Map<
    THREE.Mesh<any, any>,
    THREE.MeshLambertMaterial[]
  >();

  private originalLodColors = new Map<any, THREE.Color>();

  /**
   * Whether colors need to be reassigned (when models change).
   */
  private colorsNeedUpdate = true;

  constructor(components: Components, world: World) {
    const renderer = world.renderer;
    if (!renderer) {
      throw new Error("A renderer is needed for the FastModelPicker to work!");
    }
    this.world = world;
    this.mouse = new Mouse(renderer.three.domElement);
    this.components = components;
    this.setupRenderTarget();
    this.setupFragmentListeners();
  }

  /**
   * Sets up listeners for fragment model changes.
   */
  private setupFragmentListeners() {
    const fragments = this.components.get(FragmentsManager);

    // Mark colors as needing update when models are added or removed
    fragments.list.onItemSet.add(() => {
      this.colorsNeedUpdate = true;
    });

    fragments.list.onItemDeleted.add(() => {
      this.colorsNeedUpdate = true;
    });
  }

  /**
   * Sets up the render target for color-coded picking.
   */
  private setupRenderTarget() {
    const renderer = this.world.renderer!.three;
    const size = renderer.getSize(new THREE.Vector2());
    this.renderTargetSize.copy(size);

    // Create render target
    this.renderTarget = new THREE.WebGLRenderTarget(size.x, size.y);
    this.renderTarget.texture.format = THREE.RGBAFormat;
    this.renderTarget.texture.type = THREE.UnsignedByteType;

    // Setup debug canvas if needed
    if (this.debugMode) {
      this.setupDebugCanvas();
    }

    // Listen to resize events
    this.world.renderer!.onResize.add((size) => {
      this.renderTargetSize.copy(size);
      this.renderTarget!.setSize(size.x, size.y);
      if (this.debugCanvas) {
        this.debugCanvas.width = size.x;
        this.debugCanvas.height = size.y;
      }
    });
  }

  /**
   * Sets up the debug canvas for visualization.
   */
  private setupDebugCanvas() {
    if (this.debugCanvas) return;

    const size = this.world.renderer!.three.getSize(new THREE.Vector2());

    // Create debug container
    this.debugContainer = document.createElement("div");
    this.debugContainer.style.position = "fixed";
    this.debugContainer.style.top = "10px";
    this.debugContainer.style.right = "10px";
    this.debugContainer.style.width = "300px";
    this.debugContainer.style.height = "300px";
    this.debugContainer.style.border = "2px solid #fff";
    this.debugContainer.style.backgroundColor = "#000";
    this.debugContainer.style.zIndex = "10000";
    this.debugContainer.style.pointerEvents = "none";

    // Create debug canvas
    this.debugCanvas = document.createElement("canvas");
    this.debugCanvas.width = size.x;
    this.debugCanvas.height = size.y;
    this.debugCanvas.style.width = "100%";
    this.debugCanvas.style.height = "100%";
    this.debugCanvas.style.imageRendering = "pixelated";
    this.debugContainer.appendChild(this.debugCanvas);
    document.body.appendChild(this.debugContainer);
  }

  /**
   * Generates a deterministic color for a model based on its ID.
   * This ensures the same model always gets the same color.
   */
  private generateColorForModel(modelId: string): THREE.Color {
    // Hash the model ID to get a deterministic color
    let hash = 0;
    for (let i = 0; i < modelId.length; i++) {
      // eslint-disable-next-line no-bitwise
      hash = (hash << 5) - hash + modelId.charCodeAt(i);
      // eslint-disable-next-line no-bitwise
      hash &= hash; // Convert to 32-bit integer
    }

    // Convert hash to a positive number and ensure it's not 0 (black)
    // eslint-disable-next-line no-bitwise
    let colorId = Math.abs(hash) % 0xffffff;
    if (colorId === 0) {
      colorId = 1; // Avoid pure black
    }

    // Extract RGB components
    // eslint-disable-next-line no-bitwise
    const r = (colorId >> 16) & 0xff || 1;
    // eslint-disable-next-line no-bitwise
    const g = (colorId >> 8) & 0xff || 1;
    // eslint-disable-next-line no-bitwise
    const b = colorId & 0xff || 1;

    return new THREE.Color(r / 255, g / 255, b / 255);
  }

  /**
   * Converts a color to a numeric ID.
   */
  private colorToId(color: THREE.Color): number {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    // eslint-disable-next-line no-bitwise
    return (r << 16) | (g << 8) | b;
  }

  /**
   * Assigns unique colors to all fragment models.
   * Colors are deterministic based on model ID, so the same model always gets the same color.
   */
  private assignColors() {
    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized) {
      return;
    }

    // Only regenerate colors if models have changed
    if (!this.colorsNeedUpdate) {
      // Check if any models were added or removed
      const currentModelIds = new Set(fragments.list.keys());
      const cachedModelIds = new Set(this.modelIdToColor.keys());

      // Check if sets are different
      if (
        currentModelIds.size !== cachedModelIds.size ||
        [...currentModelIds].some((id) => !cachedModelIds.has(id))
      ) {
        this.colorsNeedUpdate = true;
      }
    }

    if (!this.colorsNeedUpdate) {
      return; // Colors are already assigned and up to date
    }

    // Clear existing mappings
    this.colorToModelId.clear();
    this.modelIdToColor.clear();

    // Dispose old materials
    for (const material of this.colorMaterials.values()) {
      material.dispose();
    }
    this.colorMaterials.clear();

    // Assign deterministic colors to each model
    for (const [modelId] of fragments.list) {
      const color = this.generateColorForModel(modelId);
      const colorId = this.colorToId(color);

      this.colorToModelId.set(colorId, modelId);
      this.modelIdToColor.set(modelId, color);

      // Create a material for this model
      const material = new THREE.MeshBasicMaterial({
        color,
        depthTest: true,
        depthWrite: true,
      });
      this.colorMaterials.set(modelId, material);
    }

    this.colorsNeedUpdate = false;
  }

  /**
   * Applies color materials to fragment models.
   */
  private applyColorMaterials() {
    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized) {
      return;
    }

    // Store original materials and apply color materials
    for (const [modelId, model] of fragments.list) {
      const modelMaterial = this.colorMaterials.get(modelId);
      if (!modelMaterial) continue;

      // Traverse the model's object and apply the color material
      model.object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if ("isLODGeometry" in child.geometry) {
            const originalLodMaterial = child.material[0];
            const lodColor = originalLodMaterial.uniforms.lodColor;
            if (!this.originalLodColors.has(lodColor)) {
              this.originalLodColors.set(lodColor, lodColor.value);
            }
            lodColor.value = modelMaterial.color;
            return;
          }
          if (!this.originalMaterials.has(child)) {
            this.originalMaterials.set(child, child.material);
          }
          child.material = modelMaterial;
        }
      });
    }
  }

  /**
   * Restores original materials to fragment models.
   */
  private restoreOriginalMaterials() {
    for (const [object, material] of this.originalMaterials) {
      object.material = material;
    }

    for (const [lodColor, color] of this.originalLodColors) {
      lodColor.value = color;
    }

    this.originalMaterials.clear();
  }

  /**
   * Renders the scene with color-coded models.
   */
  private renderColorCoded() {
    if (!this.renderTarget || !this.world.renderer) {
      throw new Error("Render target not initialized!");
    }

    const renderer = this.world.renderer.three;
    const scene = this.world.scene.three;
    const camera = this.world.camera.three;

    // Store current render target and clear settings
    const currentRenderTarget = renderer.getRenderTarget();
    const currentAutoClear = renderer.autoClear;
    const currentClearColor = new THREE.Color();
    const currentClearAlpha = renderer.getClearAlpha();
    renderer.getClearColor(currentClearColor);

    // Apply color materials
    this.applyColorMaterials();

    // Render to offscreen target with explicit black background
    renderer.setRenderTarget(this.renderTarget);
    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 1.0); // Black background
    // Clear both color and depth buffers
    renderer.clear(true, true, false);
    renderer.render(scene, camera);

    // Restore renderer state
    renderer.setRenderTarget(currentRenderTarget);
    renderer.autoClear = currentAutoClear;
    renderer.setClearColor(currentClearColor, currentClearAlpha);

    // Restore original materials
    this.restoreOriginalMaterials();

    // Update debug canvas if enabled
    if (this.debugMode && this.debugCanvas) {
      this.updateDebugCanvas();
    }
  }

  /**
   * Updates the debug canvas with the color-coded render.
   */
  private updateDebugCanvas() {
    if (!this.debugCanvas || !this.renderTarget || !this.world.renderer) return;

    const renderer = this.world.renderer.three;
    const size = this.renderTargetSize;

    // Read pixels from render target
    const pixels = new Uint8Array(size.x * size.y * 4);
    renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      size.x,
      size.y,
      pixels,
    );

    // Draw to debug canvas
    const ctx = this.debugCanvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(size.x, size.y);

    // Flip Y axis: WebGL has Y=0 at bottom, canvas 2D has Y=0 at top
    const rowSize = size.x * 4;
    for (let y = 0; y < size.y; y++) {
      const srcRow = y;
      const dstRow = size.y - 1 - y;
      const srcOffset = srcRow * rowSize;
      const dstOffset = dstRow * rowSize;
      imageData.data.set(
        pixels.subarray(srcOffset, srcOffset + rowSize),
        dstOffset,
      );
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Gets the model ID at the given screen position.
   *
   * @param position - Optional screen position. If not provided, uses current mouse position.
   * @returns The model ID at the position, or null if no model is found.
   */
  async getModelAt(position?: THREE.Vector2): Promise<string | null> {
    if (!this.renderTarget || !this.world.renderer) {
      throw new Error("Render target not initialized!");
    }

    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized || fragments.list.size === 0) {
      return null;
    }

    // Assign colors to models
    this.assignColors();

    // Render color-coded scene
    this.renderColorCoded();

    // Get position
    const pos = position || this.mouse.position;
    const size = this.renderTargetSize;

    // Convert normalized position to pixel coordinates
    // Mouse position: x = -1 (left) to 1 (right), y = 1 (top) to -1 (bottom)
    // Render target: x = 0 (left) to width-1 (right), y = 0 (bottom) to height-1 (top)
    const x = Math.floor((pos.x + 1) * 0.5 * size.x);
    // Convert Y: pos.y = 1 (top) -> y = height-1 (top), pos.y = -1 (bottom) -> y = 0 (bottom)
    // Linear mapping from [-1, 1] to [0, size.y - 1]
    // y = (pos.y - (-1)) / (1 - (-1)) * ((size.y - 1) - 0) + 0
    // y = (pos.y + 1) / 2 * (size.y - 1)
    const y = Math.floor((pos.y + 1) * 0.5 * (size.y - 1));

    // Clamp to valid range
    const clampedX = Math.max(0, Math.min(size.x - 1, x));
    const clampedY = Math.max(0, Math.min(size.y - 1, y));

    // Read pixel at position
    const renderer = this.world.renderer.three;
    const pixels = new Uint8Array(4);
    renderer.readRenderTargetPixels(
      this.renderTarget,
      clampedX,
      clampedY,
      1,
      1,
      pixels,
    );

    // Extract RGB color
    const r = pixels[0];
    const g = pixels[1];
    const b = pixels[2];

    // Convert to color ID
    // eslint-disable-next-line no-bitwise
    const colorId = (r << 16) | (g << 8) | b;

    // Look up model ID
    const modelId = this.colorToModelId.get(colorId);
    return modelId || null;
  }

  /**
   * Enables or disables debug mode.
   * When enabled, shows a canvas with the color-coded render.
   */
  setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    if (enabled) {
      this.setupDebugCanvas();
    } else {
      this.removeDebugCanvas();
    }
  }

  /**
   * Removes the debug canvas.
   */
  private removeDebugCanvas() {
    if (this.debugContainer) {
      this.debugContainer.remove();
      this.debugContainer = undefined;
      this.debugCanvas = undefined;
    }
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.mouse.dispose();
    this.removeDebugCanvas();

    // Dispose materials
    for (const material of this.colorMaterials.values()) {
      material.dispose();
    }
    this.colorMaterials.clear();

    // Dispose render target
    if (this.renderTarget) {
      this.renderTarget.dispose();
    }

    this.colorToModelId.clear();
    this.modelIdToColor.clear();
    this.originalMaterials.clear();
    this.originalLodColors.clear();

    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
