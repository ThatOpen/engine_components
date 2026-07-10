var P=Object.defineProperty;var C=(i,t,e)=>t in i?P(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var r=(i,t,e)=>(C(i,typeof t!="symbol"?t+"":t,e),e);import{V as y,C as E,c as m,S as x,p as M,m as k,a as h,b as L}from"./index-S6p3h9tm.js";import{R as I,C as N,W as O,S as A,O as B,F as T,a as j}from"./graphic-vertex-picker-Byv2XlPs.js";import{w as z}from"./worker-C2DG9TTm.js";import{P as Q}from"./index-DXEOSG22.js";import{M as F,L as R}from"./index-DFBHscnQ.js";import"./three.tsl-Cqi8bW1b.js";import"./renderer-with-2d-CcxfXmTD.js";const p=class p extends F{constructor(e){super(e,"length");r(this,"_temp",{isDragging:!1,line:new R});r(this,"_lastEdgeKey",null);r(this,"_edgeMissStreak",0);r(this,"modes",["free","edge"]);r(this,"_mode","free");r(this,"create",async()=>{if(this.enabled){if(!this._temp.isDragging){await this.initPreview();return}this.endCreation()}});r(this,"endCreation",()=>{this.enabled&&this._temp.dimension&&(this.list.add(this._temp.line.clone()),this.mode==="free"&&(this._temp.dimension.dispose(),this._temp.dimension=void 0,this._temp.isDragging=!1,this._temp.startNormal=void 0))});r(this,"cancelCreation",()=>{var e;this.enabled&&(this._temp.isDragging=!1,this._temp.dimension&&((e=this._temp.dimension)==null||e.dispose(),this._temp.dimension=void 0))});r(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getLineBoxes(),l=this.components.get(I).get(this.world).castRayToObjects(e);if(!l)return;const w=[...this.lines].find(S=>S.boundingBox===l.object);w&&this.list.delete(w.line)});e.add(p.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),e==="edge"&&this.initPreview(),this.onStateChanged.trigger(["mode"])}get isDragging(){return this._temp.isDragging}initHandlers(){this.list.onItemAdded.add(e=>{const s=this.createLineElement(e,this._temp.startNormal);s.createBoundingBox(),this.lines.add(s)}),this.list.onBeforeDelete.add(e=>{const o=[...this.lines].find(l=>l.line===e);o&&this.lines.delete(o)}),this.onPointerMove.add(()=>this.updatePreviewLine()),this.onEnabledChange.add(e=>{e&&this.mode==="edge"&&this.initPreview()})}async initPreview(){if(!this.world)throw new Error("Measurement: world is need!");const e=this.lastPick??await this._vertexPicker.get({snappingClasses:this.snappings});if(this.mode==="free"){if(!(e!=null&&e.point))return;const s=e.point;this._temp.line.set(s,s.clone()),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.startNormal=e.normal??void 0}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,o=e==null?void 0:e.snappedEdgeP2,l=s||new y,v=l||o;this._temp.line.set(l,v),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.dimension.visible=!!(s&&o)}}updatePreviewLine(){if(!this.world)throw new Error("Measurement: world is need!");const e=this.lastPick;if(this.mode==="free"){if(!(e!=null&&e.point)||(this._temp.line.end.copy(e.point),!this._temp.dimension))return;this._temp.dimension.end=this._temp.line.end}else if(this.mode==="edge"){const s=e==null?void 0:e.snappedEdgeP1,o=e==null?void 0:e.snappedEdgeP2;if(!(s&&o)){this._edgeMissStreak+=1,this._edgeMissStreak>p.EDGE_MISS_TOLERANCE&&this._temp.dimension&&this._temp.dimension.visible&&(this._temp.dimension.visible=!1,this._lastEdgeKey=null);return}this._edgeMissStreak=0;const l=V(s,o);if(l===this._lastEdgeKey){this._temp.dimension&&!this._temp.dimension.visible&&(this._temp.dimension.visible=!0);return}if(this._lastEdgeKey=l,this._temp.line.start.copy(s),this._temp.line.end.copy(o),!this._temp.dimension)return;this._temp.dimension.visible||(this._temp.dimension.visible=!0),this._temp.dimension.start=this._temp.line.start,this._temp.dimension.end=this._temp.line.end}}};r(p,"uuid","2f9bcacf-18a9-4be6-a293-e898eae64ea1"),r(p,"EDGE_MISS_TOLERANCE",3);let _=p;function V(i,t){const s=`${Math.round(i.x*1e3)},${Math.round(i.y*1e3)},${Math.round(i.z*1e3)}`,o=`${Math.round(t.x*1e3)},${Math.round(t.y*1e3)},${Math.round(t.z*1e3)}`;return s<o?`${s}|${o}`:`${o}|${s}`}const c=new N,K=c.get(O),a=K.create();a.scene=new A(c);a.scene.setup();a.scene.three.background=null;const D=document.getElementById("container");a.renderer=new Q(c,D);a.camera=new B(c);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);c.init();const d=c.get(T);d.init(z);a.camera.controls.addEventListener("update",()=>d.core.update());a.onCameraChanged.add(i=>{for(const[,t]of d.list)t.useCamera(i.three);d.core.update(!0)});d.list.onItemSet.add(({value:i})=>{i.useCamera(a.camera.three),a.scene.three.add(i.object),d.core.update(!0)});d.core.models.materials.list.onItemSet.add(({value:i})=>{"isLodMaterial"in i&&i.isLodMaterial||(i.polygonOffset=!0,i.polygonOffsetUnits=1,i.polygonOffsetFactor=Math.random())});const U=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(U.map(async i=>{var o;const t=(o=i.split("/").pop())==null?void 0:o.split(".").shift();if(!t)return null;const s=await(await fetch(i)).arrayBuffer();return d.core.load(s,{modelId:t})}));const n=c.get(_);n.world=a;n.color=new E("#494cb6");n.enabled=!0;n.snappings=[m.POINT,m.LINE];D.ondblclick=()=>n.create();const q=()=>{n.list.clear()},H=()=>{const i=[];for(const t of n.list)i.push(t.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&n.delete()};n.list.onItemAdded.add(i=>{const t=new y;i.getCenter(t);const e=i.distance()/3,s=new x(t,e);a.camera.controls.fitToSphere(s,!0)});const G=()=>{for(const i of n.lines)i.displayRectangularDimensions()},W=()=>{for(const i of n.lines)i.invertRectangularDimensions()},J=()=>{for(const i of n.lines)i.displayProjectionDimensions()},X=()=>{for(const i of n.lines)i.rectangleDimensions.clear(),i.projectionDimensions.clear()};M.init();const $=c.get(j).get(),g=i=>{var t;return((t=n.snappings)==null?void 0:t.includes(i))??!1},f=(i,t)=>{const e=new Set(n.snappings??[]);t?e.add(i):e.delete(i),n.snappings=Array.from(e)},Y=()=>h`
  <bim-checkbox label="Snap: Point" ?checked=${g(m.POINT)}
    @change="${({target:i})=>f(m.POINT,i.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${g(m.LINE)}
    @change="${({target:i})=>f(m.LINE,i.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${g(m.FACE)}
    @change="${({target:i})=>f(m.FACE,i.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${$.maxDistance}" min="0.05" max="5"
    @change="${({target:i})=>{$.maxDistance=i.value}}">
  </bim-number-input>
`,u=k.create(()=>{const i=()=>{const t=H();console.log(t)};return h`
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
        
<bim-number-input
          slider step="1" label="Picker Size" value="${n.pickerSize}" min="2" max="20"
          @change="${({target:t})=>{n.pickerSize=t.value}}">
        </bim-number-input>

        <bim-color-input
          label="Color" color=#${n.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{n.color=new E(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;n.mode=e}}"> ${n.modes.map(t=>h`<bim-option label=${t} value=${t} ?checked=${t===n.mode}></bim-option>`)}
        </bim-dropdown>

        ${Y()}

        <bim-dropdown
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;n.units=e}}">
          ${n.unitsList.map(t=>h`<bim-option label=${t} value=${t} ?checked=${t===n.units}></bim-option>`)}
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

        <bim-button label="Display Rectangle Dimensions" @click=${G}></bim-button>

        <bim-button label="Invert Rectangle Dimensions" @click=${W}></bim-button>

        <bim-button label="Display Projection Dimensions" @click=${J}></bim-button>

        <bim-button label="Remove Complementary Dimensions" @click=${X}></bim-button>

        <bim-button label="Delete all" @click=${()=>q()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const Z=k.create(()=>h`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Z);const b=new L;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>b.begin());a.renderer.onAfterUpdate.add(()=>b.end());
