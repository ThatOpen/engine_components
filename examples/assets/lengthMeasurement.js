var E=Object.defineProperty;var L=(n,t,e)=>t in n?E(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var l=(n,t,e)=>(L(n,typeof t!="symbol"?t+"":t,e),e);import{V as P,C as k,M as f,S as I,B as S,F as B,d as j,l as O,c as C,a as b,b as U}from"./index-BET5fVdQ.js";import{R as A,C as F,W as N,S as V,O as G,F as T,G as _}from"./graphic-vertex-picker-D88BIZW2.js";import{P as W}from"./index-oGDxbV82.js";import{M as q,L as H}from"./index-dHOtP3jI.js";import"./index-CtMoHNvK.js";const u=class u extends q{constructor(e){super(e,"length");l(this,"_temp",{isDragging:!1,line:new H});l(this,"modes",["free","edge"]);l(this,"_mode","free");l(this,"create",async()=>{if(this.enabled){if(!this._temp.isDragging){await this.initPreview();return}this.endCreation()}});l(this,"endCreation",()=>{this.enabled&&this._temp.dimension&&(this.list.add(this._temp.line.clone()),this.mode==="free"&&(this._temp.dimension.dispose(),this._temp.dimension=void 0,this._temp.isDragging=!1,this._temp.startNormal=void 0))});l(this,"cancelCreation",()=>{var e;this.enabled&&(this._temp.isDragging=!1,this._temp.dimension&&((e=this._temp.dimension)==null||e.dispose(),this._temp.dimension=void 0))});l(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getLineBoxes(),r=this.components.get(A).get(this.world).castRayToObjects(e);if(!r)return;const y=[...this.lines].find(M=>M.boundingBox===r.object);y&&this.list.delete(y.line)});e.add(u.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),e==="edge"&&this.initPreview(),this.onStateChanged.trigger(["mode"])}get isDragging(){return this._temp.isDragging}initHandlers(){this.list.onItemAdded.add(e=>{const s=this.createLineElement(e,this._temp.startNormal);s.createBoundingBox(),this.lines.add(s)}),this.list.onBeforeDelete.add(e=>{const a=[...this.lines].find(r=>r.line===e);a&&this.lines.delete(a)}),this.onPointerStop.add(()=>this.updatePreviewLine()),this.onEnabledChange.add(e=>{e&&this.mode==="edge"&&this.initPreview()})}async initPreview(){if(!this.world)throw new Error("Measurement: world is need!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point))return;const s=e.point;this._temp.line.set(s,s.clone()),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.startNormal=e.normal??void 0}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,a=e==null?void 0:e.snappedEdgeP2,r=s||new P,m=r||a;this._temp.line.set(r,m),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.dimension.visible=!!(s&&a)}}async updatePreviewLine(){if(!this.world)throw new Error("Measurement: world is need!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point)||(this._temp.line.end.copy(e.point),!this._temp.dimension))return;this._temp.dimension.end=this._temp.line.end}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,a=e==null?void 0:e.snappedEdgeP2;if(this._temp.dimension&&(this._temp.dimension.visible=!!(s&&a)),!(s&&a)||(this._temp.line.start.copy(s),this._temp.line.end.copy(a),!this._temp.dimension))return;this._temp.dimension.start=this._temp.line.start,this._temp.dimension.end=this._temp.line.end}}};l(u,"uuid","2f9bcacf-18a9-4be6-a293-e898eae64ea1");let w=u;const d=new F,R=d.get(N),o=R.create();o.scene=new V(d);o.scene.setup();o.scene.three.background=null;const $=document.getElementById("container");o.renderer=new W(d,$);o.camera=new G(d);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const z="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Y=await fetch(z),J=await Y.blob(),K=new File([J],"worker.mjs",{type:"text/javascript"}),Q=URL.createObjectURL(K),c=d.get(T);c.init(Q);o.camera.controls.addEventListener("update",()=>c.core.update());o.onCameraChanged.add(n=>{for(const[,t]of c.list)t.useCamera(n.three);c.core.update(!0)});c.list.onItemSet.add(({value:n})=>{n.useCamera(o.camera.three),o.scene.three.add(n.object),c.core.update(!0)});c.core.models.materials.list.onItemSet.add(({value:n})=>{"isLodMaterial"in n&&n.isLodMaterial||(n.polygonOffset=!0,n.polygonOffsetUnits=1,n.polygonOffsetFactor=Math.random())});const X=["/resources/frags/school_arq.frag"];await Promise.all(X.map(async n=>{var a;const t=(a=n.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const s=await(await fetch(n)).arrayBuffer();return c.core.load(s,{modelId:t})}));const i=d.get(w);i.world=o;i.color=new k("#494cb6");i.enabled=!0;i.snappings=[f.POINT];$.ondblclick=()=>i.create();const Z=()=>{i.list.clear()},ee=()=>{const n=[];for(const t of i.list)n.push(t.value);return n};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&i.delete()};i.list.onItemAdded.add(n=>{const t=new P;n.getCenter(t);const e=n.distance()/3,s=new I(t,e);o.camera.controls.fitToSphere(s,!0)});const te=()=>{for(const n of i.lines)n.displayRectangularDimensions()},ne=()=>{for(const n of i.lines)n.invertRectangularDimensions()},ie=()=>{for(const n of i.lines)n.displayProjectionDimensions()},se=()=>{for(const n of i.lines)n.rectangleDimensions.clear(),n.projectionDimensions.clear()},v=[],x=c.list.values().next().value,oe=await x.getItemsIdsWithGeometry(),D=await x.getItemsGeometry(oe),g=new Map;for(const n in D){const t=D[n];for(const e of t){if(!e.positions||!e.indices||!e.transform||!e.representationId)continue;const s=e.representationId;if(!g.has(s)){const m=new S;m.setAttribute("position",new B(e.positions,3)),m.setIndex(Array.from(e.indices)),g.set(s,m)}const a=g.get(s),r=new j(a);r.applyMatrix4(e.transform),r.updateWorldMatrix(!0,!0),v.push(r)}}const ae=i.delay,re=async n=>{if(n){i.pickerMode=_.SYNCHRONOUS,i.delay=0;for(const t of v)o.meshes.add(t);return}i.pickerMode=_.DEFAULT,i.delay=ae;for(const t of v)o.meshes.delete(t)};O.init();const h=C.create(()=>{const n=()=>{const t=ee();console.log(t)};return b`
    <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:t})=>{i.enabled=t.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:t})=>{i.visible=t.value}}">  
        </bim-checkbox>  
        
        <bim-checkbox label="Synchronous Picking" 
          @change="${({target:t})=>{re(t.value)}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${i.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{i.color=new k(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;i.mode=e,i.snappings=e==="edge"?[f.LINE]:[f.POINT]}}"> ${i.modes.map(t=>b`<bim-option label=${t} value=${t} ?checked=${t===i.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;i.units=e}}">
          ${i.unitsList.map(t=>b`<bim-option label=${t} value=${t} ?checked=${t===i.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Precision" required
          @change="${({target:t})=>{const[e]=t.value;i.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Display Rectangle Dimensions" @click=${te}></bim-button>

        <bim-button label="Invert Rectangle Dimensions" @click=${ne}></bim-button>

        <bim-button label="Display Projection Dimensions" @click=${ie}></bim-button>

        <bim-button label="Remove Complementary Dimensions" @click=${se}></bim-button>

        <bim-button label="Delete all" @click=${()=>Z()}></bim-button>
        
        <bim-button label="Log Values" @click=${n}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(h);const le=C.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{h.classList.contains("options-menu-visible")?h.classList.remove("options-menu-visible"):h.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(le);const p=new U;p.showPanel(2);document.body.append(p.dom);p.dom.style.left="0px";p.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>p.begin());o.renderer.onAfterUpdate.add(()=>p.end());
