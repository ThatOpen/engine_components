var $=Object.defineProperty;var S=(o,t,e)=>t in o?$(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var r=(o,t,e)=>(S(o,typeof t!="symbol"?t+"":t,e),e);import{C as g,S as E,a as x}from"./index-lvtjgYNN.js";import{M as f,R as L,C as M,W as P,S as B,O as I,F as R}from"./graphic-vertex-picker-CqNhsDsK.js";import{a as U,R as k,m}from"./index-bERBRksd.js";import{P as j}from"./index-DXj1C1yG.js";import{M as H,a as D}from"./index-9wSURd18.js";import{H as V}from"./index-DuS2E1Kd.js";import"./index-B41enjmT.js";const p=class p extends H{constructor(e){super(e,"volume");r(this,"_temp",{});r(this,"modes",["free"]);r(this,"_mode","free");r(this,"_previousHovererState",!1);r(this,"create",async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get();e&&(this._temp.preview||this.initPreview(),this._temp.preview.volume.items=f.join([this._temp.preview.volume.items,{[e.fragments.modelId]:new Set([e.localId])}]))});r(this,"endCreation",()=>{if(!this._temp.preview||f.isEmpty(this._temp.preview.volume.items))return;const e=this._temp.preview.volume.clone();this.list.add(e),this._temp.preview.dispose(),delete this._temp.preview});r(this,"cancelCreation",()=>{var e;(e=this._temp.preview)==null||e.dispose(),delete this._temp.preview});r(this,"delete",async()=>{if(this.list.size===0||!this.world)return;const e=await this.getVolumeBoxes(),a=this.components.get(L).get(this.world);for(const b of e){const v=a.castRayToObjects(b);if(!v)continue;const w=[...this.volumes].find(y=>y.meshes.some(C=>C===v.object));if(!w)return;this.list.delete(w.volume)}});e.add(p.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.list.onItemAdded.add(e=>{const n=this.createVolumeElement(e);n.color=this.color,n.rounding=this.rounding,n.units=this.units,this.volumes.add(n)}),this.list.onBeforeDelete.add(e=>{const a=[...this.volumes].find(b=>b.volume===e);a&&this.volumes.delete(a)}),this.onStateChanged.add(e=>{if(e.includes("color")){if(!this._temp.preview)return;this._temp.preview.color=this.color}if(e.includes("enabled")){const n=this.components.get(V);n.world=this.world,this.enabled?(this._previousHovererState=n.enabled,n.enabled=!0):(n.clear(),n.enabled=this._previousHovererState),n.hover()}})}async initPreview(){if(this.enabled){if(!this.world)throw new Error("Measurement: world is need!");this._temp.preview=new D(this.components,this.world),this._temp.preview.color=this.color,this._temp.preview.rounding=this.rounding,this._temp.preview.units=this.units}}};r(p,"uuid","01f885ab-ec4e-4e6c-a853-9dfc0d6766ed");let h=p;const c=new M,A=c.get(P),s=A.create();s.scene=new B(c);s.scene.setup();s.scene.three.background=null;const _=document.getElementById("container");s.renderer=new j(c,_);s.camera=new I(c);await s.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);c.init();const q="https://thatopen.github.io/engine_fragment/resources/worker.mjs",F=await fetch(q),O=await F.blob(),T=new File([O],"worker.mjs",{type:"text/javascript"}),z=URL.createObjectURL(T),l=c.get(R);l.init(z);s.camera.controls.addEventListener("rest",()=>l.core.update(!0));s.onCameraChanged.add(o=>{for(const[,t]of l.list)t.useCamera(o.three);l.core.update(!0)});l.list.onItemSet.add(({value:o})=>{o.useCamera(s.camera.three),s.scene.three.add(o.object),l.core.update(!0)});const W=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(W.map(async o=>{var a;const t=(a=o.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const n=await(await fetch(o)).arrayBuffer();return l.core.load(n,{modelId:t})}));const i=c.get(h);i.world=s;i.color=new g("#494cb6");i.enabled=!0;_.ondblclick=()=>i.create();window.addEventListener("keydown",o=>{(o.code==="Enter"||o.code==="NumpadEnter")&&i.endCreation()});const N=()=>{i.list.clear()},G=async()=>{const o=[];for(const t of i.list){const e=await t.getValue();o.push(e)}return o};window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&i.delete()};i.list.onItemAdded.add(async o=>{const t=await o.getBox(),e=new E;t.getBoundingSphere(e),s.camera.controls.fitToSphere(e,!0)});U.init();const u=k.create(()=>{const o=async({target:t})=>{t.loading=!0;const e=await G();console.log(e),t.loading=!1};return m`
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
          label="Pricision" required
          @change="${({target:t})=>{const[e]=t.value;i.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>N()}></bim-button>
        
        <bim-button label="Log Values" @click=${o}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const J=k.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);const d=new x;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>d.begin());s.renderer.onAfterUpdate.add(()=>d.end());
