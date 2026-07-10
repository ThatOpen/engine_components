var S=Object.defineProperty;var $=(o,t,e)=>t in o?S(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var r=(o,t,e)=>($(o,typeof t!="symbol"?t+"":t,e),e);import{C as g,S as E,p as M,m as _,a as m,b as x}from"./index-S6p3h9tm.js";import{E as I,M as f,R as L,C as P,W as B,S as H,O as D,F as O}from"./graphic-vertex-picker-Byv2XlPs.js";import{w as U}from"./worker-C2DG9TTm.js";import{P as V}from"./index-DXEOSG22.js";import{M as A,a as R}from"./index-DFBHscnQ.js";import{H as j}from"./index-B5dtpuMY.js";import"./three.tsl-Cqi8bW1b.js";import"./renderer-with-2d-CcxfXmTD.js";const p=class p extends A{constructor(e){super(e,"volume");r(this,"_temp",{});r(this,"onPreviewInitialized",new I);r(this,"modes",["free"]);r(this,"snappings");r(this,"_mode","free");r(this,"_previousHovererState",!1);r(this,"create",async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get();e&&(this._temp.preview||await this.initPreview(),this._temp.preview.volume.items=f.join([this._temp.preview.volume.items,{[e.fragments.modelId]:new Set([e.localId])}]))});r(this,"endCreation",()=>{if(!this._temp.preview||f.isEmpty(this._temp.preview.volume.items))return;const e=this._temp.preview.volume.clone();this.list.add(e),this._temp.preview.dispose(),delete this._temp.preview});r(this,"cancelCreation",()=>{var e;(e=this._temp.preview)==null||e.dispose(),delete this._temp.preview});r(this,"delete",async()=>{if(this.list.size===0||!this.world)return;const e=await this.getVolumeBoxes(),l=this.components.get(L).get(this.world);for(const b of e){const v=l.castRayToObjects(b);if(!v)continue;const w=[...this.volumes].find(y=>y.meshes.some(C=>C===v.object));if(!w)return;this.list.delete(w.volume)}});e.add(p.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.list.onItemAdded.add(e=>{const n=this.createVolumeElement(e);n.color=this.color,n.rounding=this.rounding,n.units=this.units,this.volumes.add(n)}),this.list.onBeforeDelete.add(e=>{const l=[...this.volumes].find(b=>b.volume===e);l&&this.volumes.delete(l)}),this.onStateChanged.add(e=>{if(e.includes("color")){if(!this._temp.preview)return;this._temp.preview.color=this.color}if(e.includes("units")){if(!this._temp.preview)return;this._temp.preview.units=this.units}if(e.includes("rounding")){if(!this._temp.preview)return;this._temp.preview.rounding=this.rounding}if(e.includes("enabled")){const n=this.components.get(j);n.world=this.world,this.enabled?(this._previousHovererState=n.enabled,n.enabled=!0):(n.clear(),n.enabled=this._previousHovererState),n.hover()}})}async initPreview(){if(this.enabled){if(!this.world)throw new Error("Measurement: world is need!");this._temp.preview=new R(this.components,this.world),this._temp.preview.color=this.color,this._temp.preview.rounding=this.rounding,this._temp.preview.units=this.units,this.onPreviewInitialized.trigger(this._temp.preview)}}};r(p,"uuid","01f885ab-ec4e-4e6c-a853-9dfc0d6766ed");let h=p;const d=new P,q=d.get(B),s=q.create();s.scene=new H(d);s.scene.setup();s.scene.three.background=null;const k=document.getElementById("container");s.renderer=new V(d,k);s.camera=new D(d);await s.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const a=d.get(O);a.init(U);s.camera.controls.addEventListener("update",()=>a.core.update());s.onCameraChanged.add(o=>{for(const[,t]of a.list)t.useCamera(o.three);a.core.update(!0)});a.list.onItemSet.add(({value:o})=>{o.useCamera(s.camera.three),s.scene.three.add(o.object),a.core.update(!0)});a.core.models.materials.list.onItemSet.add(({value:o})=>{"isLodMaterial"in o&&o.isLodMaterial||(o.polygonOffset=!0,o.polygonOffsetUnits=1,o.polygonOffsetFactor=Math.random())});const z=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(z.map(async o=>{var l;const t=(l=o.split("/").pop())==null?void 0:l.split(".").shift();if(!t)return null;const n=await(await fetch(o)).arrayBuffer();return a.core.load(n,{modelId:t})}));const i=d.get(h);i.world=s;i.color=new g("#494cb6");i.enabled=!0;k.ondblclick=()=>i.create();window.addEventListener("keydown",o=>{(o.code==="Enter"||o.code==="NumpadEnter")&&i.endCreation()});const F=()=>{i.list.clear()},T=async()=>{const o=[];for(const t of i.list){const e=await t.getValue();o.push(e)}return o};window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&i.delete()};i.list.onItemAdded.add(async o=>{const t=await o.getBox(),e=new E;t.getBoundingSphere(e),s.camera.controls.fitToSphere(e,!0)});M.init();const u=_.create(()=>{const o=async({target:t})=>{t.loading=!0;const e=await T();console.log(e),t.loading=!1};return m`
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
        
        <bim-color-input 
          label="Color" color=#${i.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{i.color=new g(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;i.mode=e}}"> ${i.modes.map(t=>m`<bim-option label=${t} value=${t} ?checked=${t===i.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;i.units=e}}">
          ${i.unitsList.map(t=>m`<bim-option label=${t} value=${t} ?checked=${t===i.units}></bim-option>`)}
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

        <bim-button label="Delete all" @click=${()=>F()}></bim-button>
        
        <bim-button label="Log Values" @click=${o}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const W=_.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(W);const c=new x;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>c.begin());s.renderer.onAfterUpdate.add(()=>c.end());
