var c=Object.defineProperty;var f=(s,t,e)=>t in s?c(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var i=(s,t,e)=>(f(s,typeof t!="symbol"?t+"":t,e),e);import{m as g,q as p,Z as v,M as w,C as z}from"./web-ifc-api-BC8YMRiS.js";import{E as a,D as x,c as r,C}from"./index-BY1If8xF.js";class D{constructor(t,e,o){i(this,"onDisposed",new a);i(this,"world");i(this,"components");i(this,"three");i(this,"_fade",3);i(this,"updateZoom",()=>{this.world.camera instanceof r&&(this.material.uniforms.uZoom.value=this.world.camera.three.zoom)});this.world=e;const{color:n,size1:d,size2:l,distance:u}=o;this.components=t;const m=new g(2,2,1,1),h=new p({side:v,uniforms:{uSize1:{value:d},uSize2:{value:l},uColor:{value:n},uDistance:{value:u},uFade:{value:this._fade},uZoom:{value:1}},transparent:!0,vertexShader:`
            
            varying vec3 worldPosition;
            
            uniform float uDistance;
            
            void main() {
            
                    vec3 pos = position.xzy * uDistance;
                    pos.xz += cameraPosition.xz;
                    
                    worldPosition = pos;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            
            }
            `,fragmentShader:`
            
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
            
            `,extensions:{derivatives:!0}});this.three=new w(m,h),this.three.frustumCulled=!1,e.scene.three.add(this.three),this.setupEvents(!0)}get visible(){return this.three.visible}set visible(t){t?this.world.scene.three.add(this.three):this.three.removeFromParent()}get material(){return this.three.material}get fade(){return this._fade===3}set fade(t){this._fade=t?3:0,this.material.uniforms.uFade.value=this._fade}[Symbol.dispose](){throw new Error("Method not implemented.")}dispose(){this.setupEvents(!1),this.components.get(x).destroy(this.three),this.onDisposed.trigger(),this.onDisposed.reset(),this.world=null,this.components=null}setupEvents(t){if(!(this.world.camera instanceof r))return;const e=this.world.camera.controls;t?e.addEventListener("update",this.updateZoom):e.removeEventListener("update",this.updateZoom)}}class S extends C{constructor(){super(...arguments);i(this,"list",new Map);i(this,"onDisposed",new a);i(this,"config",{color:new z(12303291),size1:1,size2:10,distance:500});i(this,"enabled",!0)}create(e){if(this.list.has(e.uuid))throw new Error("This world already has a grid!");const o=new D(this.components,e,this.config);return this.list.set(e.uuid,o),e.onDisposed.add(()=>{this.delete(e)}),o}delete(e){const o=this.list.get(e.uuid);o&&o.dispose(),this.list.delete(e.uuid)}dispose(){for(const[e,o]of this.list)o.dispose();this.list.clear(),this.onDisposed.trigger()}}i(S,"uuid","d1e814d5-b81c-4452-87a2-f039375e0489");export{S as G};
