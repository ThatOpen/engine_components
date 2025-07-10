var C=Object.defineProperty;var P=(i,t,e)=>t in i?C(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var r=(i,t,e)=>(P(i,typeof t!="symbol"?t+"":t,e),e);import{V as w,C as _,S as $,a as E}from"./index-D7EC26VF.js";import{R as k,C as L,W as x,S,O as B,F as M}from"./graphic-vertex-picker-C_xseSgk.js";import{a as j,R as v,m as p}from"./index-bERBRksd.js";import{P as I}from"./index-WsJUHyIb.js";import{M as V,L as A}from"./index-DcVFLBvm.js";const h=class h extends V{constructor(e){super(e,"length");r(this,"_temp",{isDragging:!1,line:new A});r(this,"modes",["free","edge"]);r(this,"_mode","free");r(this,"create",()=>{if(this.enabled){if(!this._temp.isDragging){this.initPreview();return}this.endCreation()}});r(this,"endCreation",()=>{this.enabled&&this._temp.dimension&&(this.list.add(this._temp.line.clone()),this.mode==="free"&&(this._temp.dimension.dispose(),this._temp.dimension=void 0,this._temp.isDragging=!1,this._temp.startNormal=void 0))});r(this,"cancelCreation",()=>{var e;this.enabled&&(this._temp.isDragging=!1,this._temp.dimension&&((e=this._temp.dimension)==null||e.dispose(),this._temp.dimension=void 0))});r(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getLineBoxes(),l=this.components.get(k).get(this.world).castRayToObjects(e);if(!l)return;const f=[...this.lines].find(y=>y.boundingBox===l.object);f&&this.list.delete(f.line)});e.add(h.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),e==="edge"&&this.initPreview(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.list.onItemAdded.add(e=>{const s=this.createLineElement(e,this._temp.startNormal);s.createBoundingBox(),this.lines.add(s)}),this.list.onBeforeDelete.add(e=>{const a=[...this.lines].find(l=>l.line===e);a&&this.lines.delete(a)}),this.onPointerStop.add(()=>this.updatePreviewLine()),this.onEnabledChange.add(e=>{e&&this.mode==="edge"&&this.initPreview()})}async initPreview(){if(!this.world)throw new Error("Measurement: world is need!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point))return;const s=e.point;this._temp.line.set(s,s.clone()),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.startNormal=e.normal??void 0}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,a=e==null?void 0:e.snappedEdgeP2,l=s||new w,g=l||a;this._temp.line.set(l,g),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.dimension.visible=!!(s&&a)}}async updatePreviewLine(){if(!this.world)throw new Error("Measurement: world is need!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point)||(this._temp.line.end.copy(e.point),!this._temp.dimension))return;this._temp.dimension.end=this._temp.line.end}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,a=e==null?void 0:e.snappedEdgeP2;if(this._temp.dimension&&(this._temp.dimension.visible=!!(s&&a)),!(s&&a)||(this._temp.line.start.copy(s),this._temp.line.end.copy(a),!this._temp.dimension))return;this._temp.dimension.start=this._temp.line.start,this._temp.dimension.end=this._temp.line.end}}};r(h,"uuid","2f9bcacf-18a9-4be6-a293-e898eae64ea1");let u=h;const d=new L,q=d.get(x),o=q.create();o.scene=new S(d);o.scene.setup();o.scene.three.background=null;const D=document.getElementById("container");o.renderer=new I(d,D);o.camera=new B(d);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const U="https://thatopen.github.io/engine_fragment/resources/worker.mjs",m=d.get(M);m.init(U);o.camera.controls.addEventListener("rest",()=>m.core.update(!0));o.onCameraChanged.add(i=>{for(const[,t]of m.list)t.useCamera(i.three);m.core.update(!0)});m.list.onItemSet.add(({value:i})=>{i.useCamera(o.camera.three),o.scene.three.add(i.object),m.core.update(!0)});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(H.map(async i=>{var a;const t=(a=i.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const s=await(await fetch(i)).arrayBuffer();return m.core.load(s,{modelId:t})}));const n=d.get(u);n.world=o;n.color=new _("#494cb6");n.enabled=!0;D.ondblclick=()=>n.create();const N=()=>{n.list.clear()},O=()=>{const i=[];for(const t of n.list)i.push(t.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&n.delete()};n.list.onItemAdded.add(i=>{const t=new w;i.getCenter(t);const e=i.distance()/3,s=new $(t,e);o.camera.controls.fitToSphere(s,!0)});const R=()=>{for(const i of n.lines)i.displayRectangularDimensions()},T=()=>{for(const i of n.lines)i.invertRectangularDimensions()},z=()=>{for(const i of n.lines)i.displayProjectionDimensions()},F=()=>{for(const i of n.lines)i.rectangleDimensions.clear(),i.projectionDimensions.clear()};j.init();const b=v.create(()=>{const i=()=>{const t=O();console.log(t)};return p`
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
        
        <bim-color-input 
          label="Color" color=#${n.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{n.color=new _(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;n.mode=e}}"> ${n.modes.map(t=>p`<bim-option label=${t} value=${t} ?checked=${t===n.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;n.units=e}}">
          ${n.unitsList.map(t=>p`<bim-option label=${t} value=${t} ?checked=${t===n.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Pricision" required
          @change="${({target:t})=>{const[e]=t.value;n.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Display Rectangle Dimensions" @click=${R}></bim-button>

        <bim-button label="Invert Rectangle Dimensions" @click=${T}></bim-button>

        <bim-button label="Display Projection Dimensions" @click=${z}></bim-button>

        <bim-button label="Remove Complementary Dimensions" @click=${F}></bim-button>

        <bim-button label="Delete all" @click=${()=>N()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(b);const W=v.create(()=>p`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{b.classList.contains("options-menu-visible")?b.classList.remove("options-menu-visible"):b.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(W);const c=new E;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>c.begin());o.renderer.onAfterUpdate.add(()=>c.end());
