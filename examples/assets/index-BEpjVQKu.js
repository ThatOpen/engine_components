var g=Object.defineProperty;var p=(s,i,e)=>i in s?g(s,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[i]=e;var t=(s,i,e)=>(p(s,typeof i!="symbol"?i+"":i,e),e);import{g as v,E as a,h as z,D as S,S as n,i as _}from"./index-D8-6eVKV.js";import{C as u,N as y,ax as w,Q as b,a as C}from"./web-ifc-api-r1ed24cU.js";class x extends v{constructor(){super(...arguments);t(this,"_config",{visible:{value:!0,type:"Boolean"},color:{value:new u,type:"Color"},primarySize:{type:"Number",interpolable:!0,value:1,min:0,max:1e3},secondarySize:{type:"Number",interpolable:!0,value:10,min:0,max:1e3},distance:{type:"Number",interpolable:!0,value:500,min:0,max:500}})}get visible(){return this._config.visible.value}set visible(e){this._config.visible.value=e,this._component.visible=e}get color(){return this._config.color.value}set color(e){this._config.color.value=e,this._component.material.uniforms.uColor.value=e,this._component.material.uniformsNeedUpdate=!0}get primarySize(){return this._config.primarySize.value}set primarySize(e){this._config.primarySize.value=e,this._component.material.uniforms.uSize1.value=e,this._component.material.uniformsNeedUpdate=!0}get secondarySize(){return this._config.secondarySize.value}set secondarySize(e){this._config.secondarySize.value=e,this._component.material.uniforms.uSize2.value=e,this._component.material.uniformsNeedUpdate=!0}get distance(){return this._config.distance.value}set distance(e){this._config.distance.value=e,this._component.material.uniforms.uDistance.value=e,this._component.material.uniformsNeedUpdate=!0}}class D{constructor(i,e){t(this,"onDisposed",new a);t(this,"onSetup",new a);t(this,"isSetup",!1);t(this,"world");t(this,"components");t(this,"config");t(this,"_defaultConfig",{visible:!0,color:new u(12303291),primarySize:1,secondarySize:10,distance:500});t(this,"three");t(this,"_fade",3);t(this,"updateZoom",()=>{this.world.camera instanceof n&&(this.material.uniforms.uZoom.value=this.world.camera.three.zoom)});this.world=e;const{color:o,primarySize:d,secondarySize:c,distance:m}=this._defaultConfig;this.components=i,this.config=new x(this,this.components,"Grid");const h=new y(2,2,1,1),f=new w({side:b,uniforms:{uSize1:{value:d},uSize2:{value:c},uColor:{value:o},uDistance:{value:m},uFade:{value:this._fade},uZoom:{value:1}},transparent:!0,vertexShader:`
            
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
            
            `,extensions:{derivatives:!0}});this.three=new C(h,f),this.three.frustumCulled=!1,e.scene.three.add(this.three),this.setupEvents(!0)}get visible(){return this.three.visible}set visible(i){i?this.world.scene.three.add(this.three):this.three.removeFromParent()}get material(){return this.three.material}get fade(){return this._fade===3}set fade(i){this._fade=i?3:0,this.material.uniforms.uFade.value=this._fade}setup(i){const e={...this._defaultConfig,...i};this.config.visible=!0,this.config.color=e.color,this.config.primarySize=e.primarySize,this.config.secondarySize=e.secondarySize,this.config.distance=e.distance,this.isSetup=!0,this.onSetup.trigger()}dispose(){this.setupEvents(!1),this.components.get(z).list.delete(this.config.uuid),this.components.get(S).destroy(this.three),this.onDisposed.trigger(),this.onDisposed.reset(),this.world=null,this.components=null}setupEvents(i){if(this.world.isDisposing||!(this.world.camera instanceof n))return;const e=this.world.camera.controls;i?e.addEventListener("update",this.updateZoom):e.removeEventListener("update",this.updateZoom)}}const r=class r extends _{constructor(e){super(e);t(this,"list",new Map);t(this,"onDisposed",new a);t(this,"enabled",!0);e.add(r.uuid,this)}create(e){if(this.list.has(e.uuid))throw new Error("This world already has a grid!");const o=new D(this.components,e);return this.list.set(e.uuid,o),e.onDisposed.add(()=>{this.delete(e)}),o}delete(e){const o=this.list.get(e.uuid);o&&o.dispose(),this.list.delete(e.uuid)}dispose(){for(const[e,o]of this.list)o.dispose();this.list.clear(),this.onDisposed.trigger(),this.onDisposed.reset()}};t(r,"uuid","d1e814d5-b81c-4452-87a2-f039375e0489");let l=r;export{l as G};
