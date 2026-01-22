var $=Object.defineProperty;var E=(i,t,e)=>t in i?$(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var r=(i,t,e)=>(E(i,typeof t!="symbol"?t+"":t,e),e);import{C as g,S,u as x,V as _,f as m,a as M}from"./index-DcyXhVxI.js";import{E as P,M as f,R as I,C as L,W as B,S as H,O as V,F as D}from"./graphic-vertex-picker-ClbEbQzL.js";import{P as j}from"./index-CoP0RxlY.js";import{M as A,a as R}from"./index-CPjwm29m.js";import{H as U}from"./index-BebKEmv5.js";import"./index-BcAp4ueJ.js";const p=class p extends A{constructor(e){super(e,"volume");r(this,"_temp",{});r(this,"onPreviewInitialized",new P);r(this,"modes",["free"]);r(this,"_mode","free");r(this,"_previousHovererState",!1);r(this,"create",async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get();e&&(this._temp.preview||await this.initPreview(),this._temp.preview.volume.items=f.join([this._temp.preview.volume.items,{[e.fragments.modelId]:new Set([e.localId])}]))});r(this,"endCreation",()=>{if(!this._temp.preview||f.isEmpty(this._temp.preview.volume.items))return;const e=this._temp.preview.volume.clone();this.list.add(e),this._temp.preview.dispose(),delete this._temp.preview});r(this,"cancelCreation",()=>{var e;(e=this._temp.preview)==null||e.dispose(),delete this._temp.preview});r(this,"delete",async()=>{if(this.list.size===0||!this.world)return;const e=await this.getVolumeBoxes(),a=this.components.get(I).get(this.world);for(const b of e){const v=a.castRayToObjects(b);if(!v)continue;const w=[...this.volumes].find(y=>y.meshes.some(C=>C===v.object));if(!w)return;this.list.delete(w.volume)}});e.add(p.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.list.onItemAdded.add(e=>{const n=this.createVolumeElement(e);n.color=this.color,n.rounding=this.rounding,n.units=this.units,this.volumes.add(n)}),this.list.onBeforeDelete.add(e=>{const a=[...this.volumes].find(b=>b.volume===e);a&&this.volumes.delete(a)}),this.onStateChanged.add(e=>{if(e.includes("color")){if(!this._temp.preview)return;this._temp.preview.color=this.color}if(e.includes("units")){if(!this._temp.preview)return;this._temp.preview.units=this.units}if(e.includes("rounding")){if(!this._temp.preview)return;this._temp.preview.rounding=this.rounding}if(e.includes("enabled")){const n=this.components.get(U);n.world=this.world,this.enabled?(this._previousHovererState=n.enabled,n.enabled=!0):(n.clear(),n.enabled=this._previousHovererState),n.hover()}})}async initPreview(){if(this.enabled){if(!this.world)throw new Error("Measurement: world is need!");this._temp.preview=new R(this.components,this.world),this._temp.preview.color=this.color,this._temp.preview.rounding=this.rounding,this._temp.preview.units=this.units,this.onPreviewInitialized.trigger(this._temp.preview)}}};r(p,"uuid","01f885ab-ec4e-4e6c-a853-9dfc0d6766ed");let h=p;const c=new L,q=c.get(B),s=q.create();s.scene=new H(c);s.scene.setup();s.scene.three.background=null;const k=document.getElementById("container");s.renderer=new j(c,k);s.camera=new V(c);await s.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);c.init();const z="https://thatopen.github.io/engine_fragment/resources/worker.mjs",l=c.get(D);l.init(z);s.camera.controls.addEventListener("rest",()=>l.core.update(!0));s.onCameraChanged.add(i=>{for(const[,t]of l.list)t.useCamera(i.three);l.core.update(!0)});l.list.onItemSet.add(({value:i})=>{i.useCamera(s.camera.three),s.scene.three.add(i.object),l.core.update(!0)});const O=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(O.map(async i=>{var a;const t=(a=i.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const n=await(await fetch(i)).arrayBuffer();return l.core.load(n,{modelId:t})}));const o=c.get(h);o.world=s;o.color=new g("#494cb6");o.enabled=!0;k.ondblclick=()=>o.create();window.addEventListener("keydown",i=>{(i.code==="Enter"||i.code==="NumpadEnter")&&o.endCreation()});const T=()=>{o.list.clear()},F=async()=>{const i=[];for(const t of o.list){const e=await t.getValue();i.push(e)}return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&o.delete()};o.list.onItemAdded.add(async i=>{const t=await i.getBox(),e=new S;t.getBoundingSphere(e),s.camera.controls.fitToSphere(e,!0)});x.init();const u=_.create(()=>{const i=async({target:t})=>{t.loading=!0;const e=await F();console.log(e),t.loading=!1};return m`
    <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:t})=>{o.enabled=t.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:t})=>{o.visible=t.value}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${o.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{o.color=new g(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;o.mode=e}}"> ${o.modes.map(t=>m`<bim-option label=${t} value=${t} ?checked=${t===o.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;o.units=e}}">
          ${o.unitsList.map(t=>m`<bim-option label=${t} value=${t} ?checked=${t===o.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Pricision" required
          @change="${({target:t})=>{const[e]=t.value;o.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>T()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const W=_.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(W);const d=new M;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>d.begin());s.renderer.onAfterUpdate.add(()=>d.end());
