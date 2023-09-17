import * as THREE from "three";
import { Component, Disposable, Hideable } from "../../base-types";
import { Disposer } from "../Disposer";
import { Components } from "../Components";
import { SimpleCamera } from "../SimpleCamera";
import { ToolComponent } from "../ToolsComponent";

/**
 * An infinite grid. Created by
 * [fyrestar](https://github.com/Fyrestar/THREE.InfiniteGridHelper)
 * and translated to typescript by
 * [dkaraush](https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts).
 */
export class SimpleGrid
  extends Component<THREE.Mesh>
  implements Hideable, Disposable
{
  static readonly uuid = "d1e814d5-b81c-4452-87a2-f039375e0489" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Hideable.visible} */
  get visible() {
    return this._grid.visible;
  }

  /** {@link Hideable.visible} */
  set visible(visible: boolean) {
    if (visible) {
      const scene = this.components.scene.get();
      scene.add(this._grid);
    } else {
      this._grid.removeFromParent();
    }
  }

  /** The material of the grid. */
  get material() {
    return this._grid.material as THREE.ShaderMaterial;
  }

  /**
   * Whether the grid should fade away with distance. Recommended to be true for
   * perspective cameras and false for orthographic cameras.
   */
  get fade() {
    return this._fade === 3;
  }

  /**
   * Whether the grid should fade away with distance. Recommended to be true for
   * perspective cameras and false for orthographic cameras.
   */
  set fade(active: boolean) {
    this._fade = active ? 3 : 0;
    this.material.uniforms.uFade.value = this._fade;
  }

  private readonly _grid: THREE.Mesh;
  private _fade = 3;

  constructor(
    components: Components,
    color = new THREE.Color(0xbbbbbb),
    size1: number = 1,
    size2: number = 10,
    distance: number = 500
  ) {
    super(components);
    this.components.tools.add(SimpleGrid.uuid, this);

    // Source: https://github.com/dkaraush/THREE.InfiniteGridHelper/blob/master/InfiniteGridHelper.ts
    // Author: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)

    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,

      uniforms: {
        uSize1: {
          value: size1,
        },
        uSize2: {
          value: size2,
        },
        uColor: {
          value: color,
        },
        uDistance: {
          value: distance,
        },
        uFade: {
          value: this._fade,
        },
        uZoom: {
          value: 1,
        },
      },
      transparent: true,
      vertexShader: `
            
            varying vec3 worldPosition;
            
            uniform float uDistance;
            
            void main() {
            
                    vec3 pos = position.xzy * uDistance;
                    pos.xz += cameraPosition.xz;
                    
                    worldPosition = pos;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            
            }
            `,

      fragmentShader: `
            
            varying vec3 worldPosition;
            
            uniform float uZoom;
            uniform float uFade;
            uniform float uSize1;
            uniform float uSize2;
            uniform vec3 uColor;
            uniform float uDistance;
                
                
                
                float getGrid(float size) {
                
                    vec2 r = worldPosition.xz / size;
                    
                    
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y);
                    
                
                    return 1.0 - min(line, 1.0);
                }
                
            void main() {
            
                    
                    float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
                    
                    float g1 = getGrid(uSize1);
                    float g2 = getGrid(uSize2);
                    
                    // Ortho camera fades the grid away when zooming out
                    float minZoom = step(0.2, uZoom);
                    float zoomFactor = pow(min(uZoom, 1.), 2.) * minZoom;
                    
                    gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, uFade));
                    gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2) * zoomFactor;
                    
                    if ( gl_FragColor.a <= 0.0 ) discard;
                    
            
            }
            
            `,

      extensions: {
        derivatives: true,
      },
    });

    this._grid = new THREE.Mesh(geometry, material);
    this._grid.frustumCulled = false;
    const scene = components.scene.get();
    scene.add(this._grid);

    this.setupEvents(true);
  }

  /** {@link Component.get} */
  get() {
    return this._grid;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this.setupEvents(false);
    const disposer = await this.components.tools.get(Disposer);
    disposer.destroy(this._grid);
  }

  private setupEvents(active: boolean) {
    const camera = this.components.camera as SimpleCamera;
    const controls = camera.controls;
    if (active) {
      controls.addEventListener("update", this.updateZoom);
    } else {
      controls.removeEventListener("update", this.updateZoom);
    }
  }

  private updateZoom = () => {
    const camera = this.components.camera as SimpleCamera;
    this.material.uniforms.uZoom.value = camera.get().zoom;
  };
}

ToolComponent.libraryUUIDs.add(SimpleGrid.uuid);
