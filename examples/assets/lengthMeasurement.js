var E=Object.defineProperty;var L=(i,t,e)=>t in i?E(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var c=(i,t,e)=>(L(i,typeof t!="symbol"?t+"":t,e),e);import{V as P,C,d as y,S as I,B as S,F as B,M as j,l as O,c as $,a as u,b as U}from"./index-lAiblgEx.js";import{R as A,C as F,W as N,S as V,O as G,F as T,G as k}from"./graphic-vertex-picker-BP6CeVm1.js";import{P as W}from"./index-DQnkIW5Q.js";import{M as z,L as q}from"./index-DJMoeYZj.js";import"./renderer-with-2d-B--NFzoM.js";import"./index-DEJ-iF65.js";const f=class f extends z{constructor(e){super(e,"length");c(this,"_temp",{isDragging:!1,line:new q});c(this,"modes",["free","edge"]);c(this,"_mode","free");c(this,"create",async()=>{if(this.enabled){if(!this._temp.isDragging){await this.initPreview();return}this.endCreation()}});c(this,"endCreation",()=>{this.enabled&&this._temp.dimension&&(this.list.add(this._temp.line.clone()),this.mode==="free"&&(this._temp.dimension.dispose(),this._temp.dimension=void 0,this._temp.isDragging=!1,this._temp.startNormal=void 0))});c(this,"cancelCreation",()=>{var e;this.enabled&&(this._temp.isDragging=!1,this._temp.dimension&&((e=this._temp.dimension)==null||e.dispose(),this._temp.dimension=void 0))});c(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getLineBoxes(),l=this.components.get(A).get(this.world).castRayToObjects(e);if(!l)return;const p=[...this.lines].find(w=>w.boundingBox===l.object);p&&this.list.delete(p.line)});e.add(f.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),e==="edge"&&this.initPreview(),this.onStateChanged.trigger(["mode"])}get isDragging(){return this._temp.isDragging}initHandlers(){this.list.onItemAdded.add(e=>{const s=this.createLineElement(e,this._temp.startNormal);s.createBoundingBox(),this.lines.add(s)}),this.list.onBeforeDelete.add(e=>{const a=[...this.lines].find(l=>l.line===e);a&&this.lines.delete(a)}),this.onPointerStop.add(()=>this.updatePreviewLine()),this.onEnabledChange.add(e=>{e&&this.mode==="edge"&&this.initPreview()})}async initPreview(){if(!this.world)throw new Error("Measurement: world is need!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point))return;const s=e.point;this._temp.line.set(s,s.clone()),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.startNormal=e.normal??void 0}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,a=e==null?void 0:e.snappedEdgeP2,l=s||new P,r=l||a;this._temp.line.set(l,r),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.dimension.visible=!!(s&&a)}}async updatePreviewLine(){if(!this.world)throw new Error("Measurement: world is need!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point)||(this._temp.line.end.copy(e.point),!this._temp.dimension))return;this._temp.dimension.end=this._temp.line.end}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,a=e==null?void 0:e.snappedEdgeP2;if(this._temp.dimension&&(this._temp.dimension.visible=!!(s&&a)),!(s&&a)||(this._temp.line.start.copy(s),this._temp.line.end.copy(a),!this._temp.dimension))return;this._temp.dimension.start=this._temp.line.start,this._temp.dimension.end=this._temp.line.end}}};c(f,"uuid","2f9bcacf-18a9-4be6-a293-e898eae64ea1");let _=f;const d=new F,H=d.get(N),o=H.create();o.scene=new V(d);o.scene.setup();o.scene.three.background=null;const x=document.getElementById("container");o.renderer=new W(d,x);o.camera=new G(d);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const R="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Y=await fetch(R),J=await Y.blob(),K=new File([J],"worker.mjs",{type:"text/javascript"}),Q=URL.createObjectURL(K),m=d.get(T);m.init(Q);o.camera.controls.addEventListener("update",()=>m.core.update());o.onCameraChanged.add(i=>{for(const[,t]of m.list)t.useCamera(i.three);m.core.update(!0)});m.list.onItemSet.add(({value:i})=>{i.useCamera(o.camera.three),o.scene.three.add(i.object),m.core.update(!0)});m.core.models.materials.list.onItemSet.add(({value:i})=>{"isLodMaterial"in i&&i.isLodMaterial||(i.polygonOffset=!0,i.polygonOffsetUnits=1,i.polygonOffsetFactor=Math.random())});const X=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(X.map(async i=>{var a;const t=(a=i.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const s=await(await fetch(i)).arrayBuffer();return m.core.load(s,{modelId:t})}));const n=d.get(_);n.world=o;n.color=new C("#494cb6");n.enabled=!0;n.snappings=[y.POINT];x.ondblclick=()=>n.create();const Z=()=>{n.list.clear()},ee=()=>{const i=[];for(const t of n.list)i.push(t.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&n.delete()};n.list.onItemAdded.add(i=>{const t=new P;i.getCenter(t);const e=i.distance()/3,s=new I(t,e);o.camera.controls.fitToSphere(s,!0)});const te=()=>{for(const i of n.lines)i.displayRectangularDimensions()},ie=()=>{for(const i of n.lines)i.invertRectangularDimensions()},ne=()=>{for(const i of n.lines)i.displayProjectionDimensions()},se=()=>{for(const i of n.lines)i.rectangleDimensions.clear(),i.projectionDimensions.clear()},D=[];for(const[,i]of m.list){const t=await i.getItemsIdsWithGeometry(),e=await i.getItemsGeometry(t),s=new Map;for(const a in e){const l=e[a];for(const r of l){if(!r.positions||!r.indices||!r.transform||!r.representationId)continue;const p=r.representationId;if(!s.has(p)){const v=new S;v.setAttribute("position",new B(r.positions,3)),v.setIndex(Array.from(r.indices)),s.set(p,v)}const w=s.get(p),h=new j(w);h.applyMatrix4(r.transform),h.applyMatrix4(i.object.matrixWorld),h.updateWorldMatrix(!0,!0),D.push(h)}}}const oe=n.delay,M=async i=>{if(i){n.pickerMode=k.SYNCHRONOUS,n.delay=0;for(const t of D)o.meshes.add(t);return}n.pickerMode=k.DEFAULT,n.delay=oe;for(const t of D)o.meshes.delete(t)};await M(!0);O.init();const g=$.create(()=>{const i=()=>{const t=ee();console.log(t)};return u`
    <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:t})=>{n.enabled=t.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:t})=>{n.visible=t.value}}">  
        </bim-checkbox>  
        
        <bim-checkbox checked label="Synchronous Picking"
          @change="${({target:t})=>{M(t.value)}}">
        </bim-checkbox>

        <bim-number-input
          slider step="1" label="Picker Size" value="${n.pickerSize}" min="2" max="20"
          @change="${({target:t})=>{n.pickerSize=t.value}}">
        </bim-number-input>

        <bim-color-input
          label="Color" color=#${n.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{n.color=new C(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;n.mode=e,n.snappings=e==="edge"?[y.LINE]:[y.POINT]}}"> ${n.modes.map(t=>u`<bim-option label=${t} value=${t} ?checked=${t===n.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;n.units=e}}">
          ${n.unitsList.map(t=>u`<bim-option label=${t} value=${t} ?checked=${t===n.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Precision" required
          @change="${({target:t})=>{const[e]=t.value;n.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Display Rectangle Dimensions" @click=${te}></bim-button>

        <bim-button label="Invert Rectangle Dimensions" @click=${ie}></bim-button>

        <bim-button label="Display Projection Dimensions" @click=${ne}></bim-button>

        <bim-button label="Remove Complementary Dimensions" @click=${se}></bim-button>

        <bim-button label="Delete all" @click=${()=>Z()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(g);const ae=$.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{g.classList.contains("options-menu-visible")?g.classList.remove("options-menu-visible"):g.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(ae);const b=new U;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>b.begin());o.renderer.onAfterUpdate.add(()=>b.end());
