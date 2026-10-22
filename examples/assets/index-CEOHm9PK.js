import{m as O,E as S,n as j,D as q,e as F,c as H}from"./index-CVHtJqZ2.js";import{C as P,a2 as I,s as Z,P as V,d as k,e as A,M as J}from"./TransformControls-lNp9RmyE.js";class K extends O{_config={visible:{value:!0,type:"Boolean"},color:{value:new P,type:"Color"},primarySize:{type:"Number",interpolable:!0,value:1,min:0,max:1e3},secondarySize:{type:"Number",interpolable:!0,value:10,min:0,max:1e3},distance:{type:"Number",interpolable:!0,value:500,min:0,max:500}};get visible(){return this._config.visible.value}set visible(e){this._config.visible.value=e,this._component.visible=e}get color(){return this._config.color.value}set color(e){this._config.color.value=e,this._component.material.uniforms.uColor.value=e,this._component.material.uniformsNeedUpdate=!0}get primarySize(){return this._config.primarySize.value}set primarySize(e){this._config.primarySize.value=e,this._component.material.uniforms.uSize1.value=e,this._component.material.uniformsNeedUpdate=!0}get secondarySize(){return this._config.secondarySize.value}set secondarySize(e){this._config.secondarySize.value=e,this._component.material.uniforms.uSize2.value=e,this._component.material.uniformsNeedUpdate=!0}get distance(){return this._config.distance.value}set distance(e){this._config.distance.value=e,this._component.material.uniforms.uDistance.value=e,this._component.material.uniformsNeedUpdate=!0}}function Q(h,e,i,r,n,a=!0){const{TSL:d,MeshBasicNodeMaterial:f}=I,{sRGBTransferEOTF:y,uniform:o,positionGeometry:M,positionWorld:w,cameraPosition:p,fwidth:E,min:c,distance:N,pow:b,mix:_,step:W,float:s,vec3:T,vec4:L,Fn:U,Discard:R}=d,t={uSize1:o(i),uSize2:o(r),uColor:o(e),uDistance:o(n),uFade:o(h),uZoom:o(1)},m=new f({side:Z,transparent:!0,depthWrite:!1}),g=M.xzy.mul(t.uDistance);m.positionNode=T(g.x.add(p.x),g.y,g.z.add(p.z));const x=v=>{const u=w.xz.div(v),l=u.sub(.5).fract().sub(.5).abs().div(E(u)),z=c(l.x,l.y);return s(1).sub(c(z,s(1)))};return m.outputNode=U(()=>{const v=s(1).sub(c(N(p.xz,w.xz).div(t.uDistance),s(1))),u=x(t.uSize1),l=x(t.uSize2),z=W(s(.2),t.uZoom),B=b(c(t.uZoom,s(1)),s(2)).mul(z),C=_(l,u,u).mul(b(v,t.uFade)),D=_(C.mul(.5),C,l).mul(B);return R(D.lessThanEqual(s(0))),L(a?y(t.uColor):t.uColor,D)})(),m.uniforms=t,m}class X{onDisposed=new S;onSetup=new S;isSetup=!1;world;components;config;_defaultConfig={visible:!0,color:new P(12303291),primarySize:1,secondarySize:10,distance:500};get visible(){return this.three.visible}set visible(e){this.three.visible=e,e?this.world.scene.three.add(this.three):this.three.removeFromParent()}get material(){return this.three.material}get fade(){return this._fade===3}set fade(e){this._fade=e?3:0,this.material.uniforms.uFade.value=this._fade}three;_fade=3;constructor(e,i){this.world=i;const{color:r,primarySize:n,secondarySize:a,distance:d}=this._defaultConfig;this.components=e,this.config=new K(this,this.components,"Grid");const f=new V(2,2,1,1),o=i.renderer?.three?.isWebGPURenderer===!0||typeof k!="function"?this.newWebgpuMaterial(r,n,a,d):new A({side:Z,uniforms:{uSize1:{value:n},uSize2:{value:a},uColor:{value:r},uDistance:{value:d},uFade:{value:this._fade},uZoom:{value:1}},transparent:!0,vertexShader:`
            
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
            
            `,extensions:{derivatives:!0}});this.three=new J(f,o),this.three.frustumCulled=!1,i.scene.three.add(this.three),this.setupEvents(!0)}setup(e){const i={...this._defaultConfig,...e};this.config.visible=!0,this.config.color=i.color,this.config.primarySize=i.primarySize,this.config.secondarySize=i.secondarySize,this.config.distance=i.distance,this.isSetup=!0,this.onSetup.trigger()}dispose(){this.setupEvents(!1),this.components.get(j).list.delete(this.config.uuid),this.components.get(q).destroy(this.three),this.onDisposed.trigger(),this.onDisposed.reset(),this.world=null,this.components=null}setupEvents(e){if(this.world.isDisposing||!(this.world.camera instanceof F))return;const i=this.world.camera.controls;e?i.addEventListener("update",this.updateZoom):i.removeEventListener("update",this.updateZoom)}updateZoom=()=>{this.world.camera instanceof F&&(this.material.uniforms.uZoom.value=this.world.camera.three.zoom)};newWebgpuMaterial(e,i,r,n){const a="webgpuPost"in(this.world?.renderer??{});return Q(this._fade,e,i,r,n,!a)}}class G extends H{static uuid="d1e814d5-b81c-4452-87a2-f039375e0489";list=new Map;onDisposed=new S;enabled=!0;constructor(e){super(e),e.add(G.uuid,this)}create(e){if(this.list.has(e.uuid))throw new Error("This world already has a grid!");const i=new X(this.components,e);return this.list.set(e.uuid,i),e.onDisposed.add(()=>{this.delete(e)}),i}delete(e){const i=this.list.get(e.uuid);i&&i.dispose(),this.list.delete(e.uuid)}dispose(){for(const[e,i]of this.list)i.dispose();this.list.clear(),this.onDisposed.trigger(),this.onDisposed.reset()}}export{G};
