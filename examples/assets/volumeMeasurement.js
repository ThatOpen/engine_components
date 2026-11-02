import{C as v,J as k,K as y,n as w,b as d,S as $}from"./TransformControls-uP1Cexzu.js";import{E as C,B as h,R as E,c as S,W as M,S as x,O as I,F as L}from"./graphic-vertex-picker-BijCnCEg.js";import{w as P}from"./worker-BGfbLmKH.js";import{P as B}from"./index-B9_sa_qD.js";import{M as H,d as V}from"./index-DlCiRCyW.js";import{H as D}from"./index-DORdsqwq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bKcSih7U.js";import"./renderer-with-2d-CrQsY-US.js";class u extends H{static uuid="01f885ab-ec4e-4e6c-a853-9dfc0d6766ed";_temp={};onPreviewInitialized=new C;modes=["free"];snappings=void 0;_mode="free";get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}constructor(e){super(e,"volume"),e.add(u.uuid,this),this.initHandlers()}initHandlers(){this.list.onItemAdded.add(e=>{const t=this.createVolumeElement(e);t.color=this.color,t.rounding=this.rounding,t.units=this.units,this.volumes.add(t)}),this.list.onBeforeDelete.add(e=>{const l=[...this.volumes].find(m=>m.volume===e);l&&this.volumes.delete(l)}),this.onStateChanged.add(e=>{if(e.includes("color")){if(!this._temp.preview)return;this._temp.preview.color=this.color}if(e.includes("units")){if(!this._temp.preview)return;this._temp.preview.units=this.units}if(e.includes("rounding")){if(!this._temp.preview)return;this._temp.preview.rounding=this.rounding}if(e.includes("enabled")){const t=this.components.get(D);t.world=this.world,this.enabled?(this._previousHovererState=t.enabled,t.enabled=!0):(t.clear(),t.enabled=this._previousHovererState),t.hover()}})}_previousHovererState=!1;async initPreview(){if(this.enabled){if(!this.world)throw new Error("Measurement: world is need!");this._temp.preview=new V(this.components,this.world),this._temp.preview.color=this.color,this._temp.preview.rounding=this.rounding,this._temp.preview.units=this.units,this.onPreviewInitialized.trigger(this._temp.preview)}}create=async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get();e&&(this._temp.preview||await this.initPreview(),this._temp.preview.volume.items=h.join([this._temp.preview.volume.items,{[e.fragments.modelId]:new Set([e.localId])}]))};endCreation=()=>{if(!this._temp.preview||h.isEmpty(this._temp.preview.volume.items))return;const e=this._temp.preview.volume.clone();this.list.add(e),this._temp.preview.dispose(),delete this._temp.preview};cancelCreation=()=>{this._temp.preview?.dispose(),delete this._temp.preview};delete=async()=>{if(this.list.size===0||!this.world)return;const e=await this.getVolumeBoxes(),l=this.components.get(E).get(this.world);for(const m of e){const p=l.castRayToObjects(m);if(!p)continue;const b=[...this.volumes].find(g=>g.meshes.some(_=>_===p.object));if(!b)return;this.list.delete(b.volume)}}}const r=new S,O=r.get(M),n=O.create();n.scene=new x(r);n.scene.setup();n.scene.three.background=null;const f=document.getElementById("container");n.renderer=new B(r,f);n.camera=new I(r);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const s=r.get(L);s.init(P);n.camera.controls.addEventListener("update",()=>s.core.update());n.onCameraChanged.add(o=>{for(const[,e]of s.list)e.useCamera(o.three);s.core.update(!0)});s.list.onItemSet.add(({value:o})=>{o.useCamera(n.camera.three),n.scene.three.add(o.object),s.core.update(!0)});s.core.models.materials.list.onItemSet.add(({value:o})=>{"isLodMaterial"in o&&o.isLodMaterial||(o.polygonOffset=!0,o.polygonOffsetUnits=1,o.polygonOffsetFactor=Math.random())});const U=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(U.map(async o=>{const e=o.split("/").pop()?.split(".").shift();if(!e)return null;const l=await(await fetch(o)).arrayBuffer();return s.core.load(l,{modelId:e})}));const i=r.get(u);i.world=n;i.color=new v("#494cb6");i.enabled=!0;f.ondblclick=()=>i.create();window.addEventListener("keydown",o=>{(o.code==="Enter"||o.code==="NumpadEnter")&&i.endCreation()});const A=()=>{i.list.clear()},R=async()=>{const o=[];for(const e of i.list){const t=await e.getValue();o.push(t)}return o};window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&i.delete()};i.list.onItemAdded.add(async o=>{const e=await o.getBox(),t=new k;e.getBoundingSphere(t),n.camera.controls.fitToSphere(t,!0)});y.init();const c=w.create(()=>{const o=async({target:e})=>{e.loading=!0;const t=await R();console.log(t),e.loading=!1};return d`
    <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:e})=>{i.enabled=e.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:e})=>{i.visible=e.value}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${i.linesMaterial.color.getHexString()}
          @input="${({target:e})=>{i.color=new v(e.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:e})=>{const[t]=e.value;i.mode=t}}"> ${i.modes.map(e=>d`<bim-option label=${e} value=${e} ?checked=${e===i.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({target:e})=>{const[t]=e.value;i.units=t}}">
          ${i.unitsList.map(e=>d`<bim-option label=${e} value=${e} ?checked=${e===i.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Precision" required
          @change="${({target:e})=>{const[t]=e.value;i.rounding=t}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>A()}></bim-button>
        
        <bim-button label="Log Values" @click=${o}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(c);const j=w.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(j);const a=new $;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>a.begin());n.renderer.onAfterUpdate.add(()=>a.end());
