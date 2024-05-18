var h=Object.defineProperty;var g=(s,i,e)=>i in s?h(s,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[i]=e;var o=(s,i,e)=>(g(s,typeof i!="symbol"?i+"":i,e),e);import{o as f,s as p,aa as v,M as w,C as z}from"./web-ifc-api-eJ7dR4yy.js";import{E as a,D as _,c as r,C as x}from"./index-BRIP3dnE.js";class C{constructor(i,e,t){o(this,"onDisposed",new a);o(this,"world");o(this,"components");o(this,"_grid");o(this,"_fade",3);o(this,"updateZoom",()=>{this.world.camera instanceof r&&(this.material.uniforms.uZoom.value=this.world.camera.three.zoom)});this.world=e;const{color:n,size1:d,size2:l,distance:u}=t;this.components=i;const m=new f(2,2,1,1),c=new p({side:v,uniforms:{uSize1:{value:d},uSize2:{value:l},uColor:{value:n},uDistance:{value:u},uFade:{value:this._fade},uZoom:{value:1}},transparent:!0,vertexShader:`
            
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
            
            `,extensions:{derivatives:!0}});this._grid=new w(m,c),this._grid.frustumCulled=!1,e.scene.three.add(this._grid),this.setupEvents(!0)}get visible(){return this._grid.visible}set visible(i){i?this.world.scene.three.add(this._grid):this._grid.removeFromParent()}get material(){return this._grid.material}get fade(){return this._fade===3}set fade(i){this._fade=i?3:0,this.material.uniforms.uFade.value=this._fade}[Symbol.dispose](){throw new Error("Method not implemented.")}get(){return this._grid}dispose(){this.setupEvents(!1),this.components.get(_).destroy(this._grid),this.onDisposed.trigger(),this.onDisposed.reset(),this.world=null,this.components=null}setupEvents(i){if(!(this.world.camera instanceof r))return;const e=this.world.camera.controls;i?e.addEventListener("update",this.updateZoom):e.removeEventListener("update",this.updateZoom)}}class D extends x{constructor(){super(...arguments);o(this,"list",new Map);o(this,"onDisposed",new a);o(this,"config",{color:new z(12303291),size1:1,size2:10,distance:500});o(this,"enabled",!0)}create(e){if(this.list.has(e.uuid))throw new Error("This world already has a grid!");const t=new C(this.components,e,this.config);return this.list.set(e.uuid,t),e.onDisposed.add(()=>{this.delete(e)}),t}delete(e){const t=this.list.get(e.uuid);t&&t.dispose(),this.list.delete(e.uuid)}dispose(){for(const[e,t]of this.list)t.dispose();this.list.clear(),this.onDisposed.trigger()}}o(D,"uuid","d1e814d5-b81c-4452-87a2-f039375e0489");export{D as G};
