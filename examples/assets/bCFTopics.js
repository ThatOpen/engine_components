var A=Object.defineProperty;var I=(n,s,e)=>s in n?A(n,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[s]=e;var i=(n,s,e)=>(I(n,typeof s!="symbol"?s+"":s,e),e);import{C as h,V as W,z as Z,D as O,A as T,W as z,h as C,N as V,at as k,Q as G,a as j,bb as H}from"./web-ifc-api-CgBULNZm.js";import{d as N,R as y,m as x}from"./index-CqPyogbW.js";import{B as L,E as l,D as E,S as g,C as $,a as Q,W as q,I as J,b as K,F as X,c as Y,V as ee}from"./index-PN7JV3bA.js";import"./_commonjsHelpers-Cpj98o6Y.js";class te extends L{constructor(){super(...arguments);i(this,"onAfterUpdate",new l);i(this,"onBeforeUpdate",new l);i(this,"onDisposed",new l);i(this,"onResize",new l);i(this,"onClippingPlanesUpdated",new l);i(this,"clippingPlanes",[])}updateClippingPlanes(){this.onClippingPlanesUpdated.trigger()}setPlane(e,t,o){t.isLocal=o;const r=this.clippingPlanes.indexOf(t);e&&r===-1?this.clippingPlanes.push(t):!e&&r>-1&&this.clippingPlanes.splice(r,1),this.three.clippingPlanes=this.clippingPlanes.filter(c=>!c.isLocal)}}class ie extends L{constructor(e){super(e);i(this,"onDisposed",new l);i(this,"directionalLights",new Map);i(this,"ambientLights",new Map)}dispose(){const e=this.components.get(E);for(const t of this.three.children){const o=t;o.geometry&&e.destroy(o)}for(const[,t]of this.directionalLights)t.removeFromParent(),t.target.removeFromParent(),t.dispose();for(const[,t]of this.ambientLights)t.removeFromParent(),t.dispose();this.three.children=[],this.onDisposed.trigger(),this.onDisposed.reset()}}class se extends ie{constructor(e){super(e);i(this,"isSetup",!1);i(this,"three");i(this,"onSetup",new l);i(this,"config",{directionalLight:{color:new h("white"),intensity:1.5,position:new W(5,10,3)},ambientLight:{color:new h("white"),intensity:1}});this.three=new Z,this.three.background=new h(2107698)}setup(e){this.config={...this.config,...e};const t=new O(this.config.directionalLight.color,this.config.directionalLight.intensity);t.position.copy(this.config.directionalLight.position);const o=new T(this.config.ambientLight.color,this.config.ambientLight.intensity);this.three.add(t,o),this.directionalLights.set(t.uuid,t),this.ambientLights.set(o.uuid,o),this.isSetup=!0,this.onSetup.trigger(this)}}class ne extends te{constructor(e,t,o){super(e);i(this,"enabled",!0);i(this,"container");i(this,"three");i(this,"_canvas");i(this,"_parameters");i(this,"_resizeObserver",null);i(this,"onContainerUpdated",new l);i(this,"_resizing",!1);i(this,"resize",e=>{if(this._resizing)return;this._resizing=!0,this.onContainerUpdated.trigger();const t=e?e.x:this.container.clientWidth,o=e?e.y:this.container.clientHeight;this.three.setSize(t,o),this.onResize.trigger(new C(t,o)),this._resizing=!1});i(this,"resizeEvent",()=>{this.resize()});i(this,"onContextLost",e=>{e.preventDefault(),this.enabled=!1});i(this,"onContextBack",()=>{this.three.setRenderTarget(null),this.three.dispose(),this.three=new z({canvas:this._canvas,antialias:!0,alpha:!0,...this._parameters}),this.enabled=!0});this.container=t,this._parameters=o,this.three=new z({antialias:!0,alpha:!0,...o}),this.three.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.setupRenderer(),this.setupEvents(!0),this.resize(),this._canvas=this.three.domElement;const r=this.three.getContext(),{canvas:c}=r;c.addEventListener("webglcontextlost",this.onContextLost,!1),c.addEventListener("webglcontextrestored",this.onContextBack,!1)}update(){if(!this.enabled||!this.currentWorld)return;this.onBeforeUpdate.trigger(this);const e=this.currentWorld.scene.three,t=this.currentWorld.camera.three;this.three.render(e,t),this.onAfterUpdate.trigger(this)}dispose(){this.enabled=!1,this.setupEvents(!1),this.three.domElement.remove(),this.three.forceContextLoss(),this.three.dispose(),this.onResize.reset(),this.onAfterUpdate.reset(),this.onBeforeUpdate.reset(),this.onDisposed.trigger(),this.onDisposed.reset()}getSize(){return new C(this.three.domElement.clientWidth,this.three.domElement.clientHeight)}setupEvents(e){const t=this.three.domElement.parentElement;if(!t)throw new Error("This renderer needs to have an HTML container!");this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),window.removeEventListener("resize",this.resizeEvent),e&&(this._resizeObserver=new ResizeObserver(this.resizeEvent),this._resizeObserver.observe(t),window.addEventListener("resize",this.resizeEvent))}setupRenderer(){this.three.localClippingEnabled=!0,this.container&&this.container.appendChild(this.three.domElement),this.onContainerUpdated.trigger()}}class oe{constructor(s,e,t){i(this,"onDisposed",new l);i(this,"world");i(this,"components");i(this,"three");i(this,"_fade",3);i(this,"updateZoom",()=>{this.world.camera instanceof g&&(this.material.uniforms.uZoom.value=this.world.camera.three.zoom)});this.world=e;const{color:o,size1:r,size2:c,distance:R}=t;this.components=s;const M=new V(2,2,1,1),U=new k({side:G,uniforms:{uSize1:{value:r},uSize2:{value:c},uColor:{value:o},uDistance:{value:R},uFade:{value:this._fade},uZoom:{value:1}},transparent:!0,vertexShader:`
            
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
            
            `,extensions:{derivatives:!0}});this.three=new j(M,U),this.three.frustumCulled=!1,e.scene.three.add(this.three),this.setupEvents(!0)}get visible(){return this.three.visible}set visible(s){s?this.world.scene.three.add(this.three):this.three.removeFromParent()}get material(){return this.three.material}get fade(){return this._fade===3}set fade(s){this._fade=s?3:0,this.material.uniforms.uFade.value=this._fade}dispose(){this.setupEvents(!1),this.components.get(E).destroy(this.three),this.onDisposed.trigger(),this.onDisposed.reset(),this.world=null,this.components=null}setupEvents(s){if(this.world.isDisposing||!(this.world.camera instanceof g))return;const e=this.world.camera.controls;s?e.addEventListener("update",this.updateZoom):e.removeEventListener("update",this.updateZoom)}}const m=class m extends ${constructor(e){super(e);i(this,"list",new Map);i(this,"config",{color:new h(12303291),size1:1,size2:10,distance:500});i(this,"onDisposed",new l);i(this,"enabled",!0);e.add(m.uuid,this)}create(e){if(this.list.has(e.uuid))throw new Error("This world already has a grid!");const t=new oe(this.components,e,this.config);return this.list.set(e.uuid,t),e.onDisposed.add(()=>{this.delete(e)}),t}delete(e){const t=this.list.get(e.uuid);t&&t.dispose(),this.list.delete(e.uuid)}dispose(){for(const[e,t]of this.list)t.dispose();this.list.clear(),this.onDisposed.trigger(),this.onDisposed.reset()}};i(m,"uuid","d1e814d5-b81c-4452-87a2-f039375e0489");let f=m;N.init();const a=new Q,re=a.get(q),d=re.create(),D=new se(a);D.setup();d.scene=D;d.scene.three.add(new H(10));const u=document.createElement("bim-viewport"),P=new ne(a,u);d.renderer=P;const S=new g(a);d.camera=S;u.addEventListener("resize",()=>{P.resize(),S.updateAspect()});const w=document.createElement("bim-grid");w.floating=!0;u.append(w);const ae=a.get(f);ae.create(d);a.init();const _=a.get(J);await _.setup();const ce=a.get(K),le=a.get(X);le.onFragmentsLoaded.add(async n=>{d.scene.three.add(n),n.hasProperties&&await ce.process(n);for(const s of n.items)d.meshes.add(s.mesh)});const de=async n=>{const s=[];for(const e of n){const o=await(await fetch(e)).arrayBuffer(),r=new Uint8Array(o),c=await _.load(r);s.push(c)}return s},he=await de(["https://thatopen.github.io/engine_components/resources/small.ifc"]),pe=he[0],p=a.get(Y);p.setup({types:new Set([...p.config.types,"Information","Coordination"]),statuses:new Set(["Active","In Progress","Done","In Review","Closed"]),users:new Set(["juan.hoyos4@gmail.com"])});const me=a.get(ee);w.layouts={main:{template:`
      "empty topicPanel" 1fr
      /1fr 22rem
    `,elements:{}}};const ue=async n=>{const s={viewpoints:[],topics:[]};for(const e of n){const o=await(await fetch(e)).arrayBuffer(),{viewpoints:r,topics:c}=await p.load(new Uint8Array(o),d);s.viewpoints.push(...r),s.topics.push(...c)}return s};await ue([]);const v=p.create({title:"Missing information",description:"It seems these elements are badly defined.",dueDate:new Date("08-01-2020"),type:"Clash",priority:"Major",stage:"Design",labels:new Set(["Architecture","Cost Estimation"]),assignedTo:"juan.hoyos4@gmail.com"}),b=me.create(d,{title:"Custom Viewpoint"});b.addComponentsFromMap(pe.getFragmentMap([186]));v.viewpoints.add(b.guid);const F=v.createComment("What if we talk about this next meeting?");F.author="juan.hoyos4@gmail.com";v.createComment("Hi there! I agree.");F.viewpoint=b;const ge=y.create(()=>x`
   <bim-panel>
    <bim-panel-section label="Viewpoints">
      <!-- viewpointsListElement -->
    </bim-panel-section>
   </bim-panel>
  `),fe=y.create(()=>x`
   <bim-panel>
    <bim-panel-section label="Topics">
      <div style="display: flex; gap: 0.25rem">
        <bim-button label="Download" icon="tabler:download" @click=${async()=>{}}></bim-button>
        <!-- <bim-button style="flex: 0;" label="New Topic" icon="mi:add" @click=${()=>{}}></bim-button> -->
      </div>
      <!-- topicsList -->
    </bim-panel-section>
   </bim-panel>
  `),B=document.getElementById("app");B.layouts={main:{template:`
      "leftPanel viewport" 2fr
      "leftPanel bottomPanel" 1fr
      / 25rem 1fr
    `,elements:{leftPanel:ge,viewport:u,bottomPanel:fe}}};B.layout="main";
