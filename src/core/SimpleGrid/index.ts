import * as THREE from "three";
import { Component, Disposable, Hideable } from "../../base-types";
import { Disposer } from "../Disposer";
import { Components } from "../Components";

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
  /** {@link Component.name} */
  name = "SimpleGrid";

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Hideable.visible} */
  get visible() {
    return this._grid.visible;
  }

  /** {@link Hideable.visible} */
  set visible(visible: boolean) {
    this._grid.visible = visible;
  }

  private readonly _grid: THREE.Mesh;
  private _disposer = new Disposer();

  constructor(
    components: Components,
    size1: number = 1,
    size2: number = 10,
    color = new THREE.Color(0xcccccc),
    distance: number = 100
  ) {
    super();
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
                    
                    
                    gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
                    gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
                    
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
  }

  /** {@link Component.get} */
  get() {
    return this._grid;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._disposer.dispose(this._grid);
  }
}
