import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { RendererWith2D } from "../Marker";
import { Postproduction, PostproductionAspect } from "./src";

export { PostproductionAspect, GlossPass, EdgeDetectionPassMode } from "./src";

/**
 * A class that extends RendererWith2D and adds post-processing capabilities. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/PostproductionRenderer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/PostproductionRenderer).
 */
export class PostproductionRenderer extends RendererWith2D {
  /**
   * The default style to use when the mode is MANUAL.
   */
  manualDefaultStyle = PostproductionAspect.COLOR;

  /**
   * Whether the postproduction will temporarily be turned off when the mode is MANUAL to get a more fluid navigation experience.
   */
  turnOffOnManualMode = true;

  /**
   * The delay in milliseconds to wait before turning the postproduction back on when the mode is MANUAL.
   */
  manualModeDelay = 50;

  private _postproduction?: Postproduction;
  private _timeout: any;
  private _previousStyle: PostproductionAspect = PostproductionAspect.COLOR;
  private _previousEnabled: boolean = false;
  /**
   * Getter for the postproduction instance.
   * Throws an error if the postproduction instance is not yet initialized.
   *
   * @returns The initialized Postproduction instance.
   */
  get postproduction() {
    if (!this._postproduction) {
      throw new Error("Renderer not initialized yet with a world!");
    }
    return this._postproduction;
  }

  constructor(
    components: OBC.Components,
    container: HTMLElement,
    parameters?: Partial<THREE.WebGLRendererParameters>,
  ) {
    super(components, container, parameters);

    this.onResize.add((size) => {
      this.setPostproductionSize(size);
    });

    this.onWorldChanged.add(() => {
      if (this.currentWorld) {
        if (this._postproduction) {
          this._postproduction.dispose();
        }
        this._postproduction = new Postproduction(components, this);

        this._postproduction.onStyleChanged.add(
          (style: PostproductionAspect) => {
            this._previousStyle = style;
          },
        );

        this.setPostproductionSize();
      }
    });
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled) return;
    if (!this.currentWorld) {
      return;
    }

    if (this.mode === OBC.RendererMode.MANUAL && !this.needsUpdate) {
      return;
    }
    this.needsUpdate = false;

    this.onBeforeUpdate.trigger();
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;

    const isManualMode = this.mode === OBC.RendererMode.MANUAL;
    if (isManualMode) {
      if (this.turnOffOnManualMode && this.postproduction.enabled) {
        this._previousEnabled = this.postproduction.enabled;
        this.postproduction.enabled = false;
      }

      if (this.manualDefaultStyle !== this.postproduction.style) {
        this.setStyleWithoutEvent(this.manualDefaultStyle);
      }
    }

    if (this.postproduction.enabled) {
      this.postproduction.update();
    } else {
      this.three.render(scene, camera);
    }
    if (scene instanceof THREE.Scene) {
      this.three2D.render(scene, camera);
    }

    if (this.mode === OBC.RendererMode.MANUAL) {
      // Use postproduction only on last frame
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      this._timeout = setTimeout(() => {
        if (this.turnOffOnManualMode) {
          this.postproduction.enabled = this._previousEnabled;
        }

        this.setStyleWithoutEvent(this._previousStyle);

        this.postproduction.update();
      }, this.manualModeDelay);
    }

    this.onAfterUpdate.trigger();
  }

  /** {@link OBC.Disposable.dispose}. */
  dispose() {
    super.dispose();
    this.postproduction.dispose();
  }

  // used to set the style without setting the _previousStyle
  private setStyleWithoutEvent(style: PostproductionAspect) {
    this.postproduction.onStyleChanged.enabled = false;
    this.postproduction.style = style;
    this.postproduction.onStyleChanged.enabled = true;
  }

  private setPostproductionSize(size?: THREE.Vector2) {
    if (size) {
      if (size.x === 0 || size.y === 0) {
        return;
      }
    }
    if (!this.container || !this._postproduction) {
      return;
    }
    const ratio = Math.min(window.devicePixelRatio, 2);
    const width = size?.x ?? this.container.clientWidth * ratio;
    const height = size?.y ?? this.container.clientHeight * ratio;
    if (width === 0 || height === 0) {
      return;
    }
    this.postproduction.setSize(width, height);
  }
}
