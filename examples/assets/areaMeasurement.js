var L=Object.defineProperty;var $=(i,t,e)=>t in i?L(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var r=(i,t,e)=>($(i,typeof t!="symbol"?t+"":t,e),e);import{V as _,W as E,C as k,S as P,a as B}from"./index-D7EC26VF.js";import{R as S,D as M,C as A,W as I,S as j,O as R,F as U}from"./graphic-vertex-picker-C_xseSgk.js";import{a as V,R as y,m as f}from"./index-bERBRksd.js";import{P as F}from"./index-WsJUHyIb.js";import{M as q,A as z,L as T}from"./index-DcVFLBvm.js";const w=class w extends q{constructor(e){super(e,"area");r(this,"pickTolerance",.1);r(this,"tolerance",.005);r(this,"modes",["free","square"]);r(this,"_mode","free");r(this,"_temp",{isDragging:!1,area:new z,lines:new E,point:new _});r(this,"computeLineElements",()=>{this._temp.lines.clear();const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!(e.length<2||!this.world))for(let n=0;n<e.length;n++){const s=e[n],l=e[(n+1)%e.length],c=new T(s,l),b=this.createLineElement(c);this._temp.lines.add(b)}});r(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;const{area:n,point:s}=this._temp;if(this._temp.isDragging||(n.tolerance=this.tolerance,n.points.clear(),this._temp.isDragging=!0),n.points.size===0&&s.copy(e.point),n.points.add(s.clone()),this.mode==="square"&&n.points.size===2&&e.normal){const[l,c]=n.points,b=new _().subVectors(c,l),h=b.clone(),d=b.clone().negate();Math.abs(b.y)>=.1?(h.y=0,d.y=0):(h.x=0,d.x=0);const D=l.clone().add(h),x=c.clone().add(d);n.points.clear(),n.points.add(l,D,c,x),this.endCreation()}});r(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});r(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});r(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),l=this.components.get(S).get(this.world).castRayToObjects(e),c=this.components.get(M);for(const d of e)c.destroy(d);if(!l)return;const h=[...this.fills].find(d=>d.three===l.object);h&&(this.list.delete(h.area),this.lines.clear())});e.add(w.uuid,this),this.initHandlers(),this.color=new k("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const n=this.createFillElement(e);n.color=this.color,this.fills.add(n),this.addLineElementsFromPoints([...e.points])}),this.list.onBeforeDelete.add(e=>{const n=[...this.fills].find(s=>s.area===e);n&&this.fills.delete(n)}),this.onPointerStop.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()})}async updatePreview(){if(!this.enabled||!this.world)throw new Error("Measurement is not enabled or world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point&&this._temp.isDragging))return;const n=e.point.clone(),{plane:s}=this._temp.area;if(s){const l=s.distanceToPoint(n);if(Math.abs(l)<.1){const c=new _;s.projectPoint(n,c),n.copy(c)}}this._temp.point.copy(n),this.computeLineElements()}};r(w,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let v=w;const m=new A,O=m.get(I),a=O.create();a.scene=new j(m);a.scene.setup();a.scene.three.background=null;const C=document.getElementById("container");a.renderer=new F(m,C);a.camera=new R(m);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);m.init();const W="https://thatopen.github.io/engine_fragment/resources/worker.mjs",H=await fetch(W),N=await H.blob(),G=new File([N],"worker.mjs",{type:"text/javascript"}),J=URL.createObjectURL(G),p=m.get(U);p.init(J);a.camera.controls.addEventListener("rest",()=>p.core.update(!0));a.onCameraChanged.add(i=>{for(const[,t]of p.list)t.useCamera(i.three);p.core.update(!0)});p.list.onItemSet.add(({value:i})=>{i.useCamera(a.camera.three),a.scene.three.add(i.object),p.core.update(!0)});const K=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(K.map(async i=>{var s;const t=(s=i.split("/").pop())==null?void 0:s.split(".").shift();if(!t)return null;const n=await(await fetch(i)).arrayBuffer();return p.core.load(n,{modelId:t})}));const o=m.get(v);o.world=a;o.color=new k("#494cb6");o.enabled=!0;C.ondblclick=()=>o.create();window.addEventListener("keydown",i=>{(i.code==="Enter"||i.code==="NumpadEnter")&&o.endCreation()});const Q=()=>{o.list.clear()},X=()=>{const i=[];for(const t of o.list)i.push(t.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&o.delete()};o.list.onItemAdded.add(i=>{if(!i.boundingBox)return;const t=new P;i.boundingBox.getBoundingSphere(t),a.camera.controls.fitToSphere(t,!0)});V.init();const g=y.create(()=>{const i=()=>{const t=X();console.log(t)};return f`
    <bim-panel active label="Area Measurement Tutorial" class="options-menu">
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
          @input="${({target:t})=>{o.color=new k(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;o.mode=e}}"> ${o.modes.map(t=>f`<bim-option label=${t} value=${t} ?checked=${t===o.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;o.units=e}}">
          ${o.unitsList.map(t=>f`<bim-option label=${t} value=${t} ?checked=${t===o.units}></bim-option>`)}
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

        <bim-button label="Delete all" @click=${()=>Q()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(g);const Y=y.create(()=>f`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{g.classList.contains("options-menu-visible")?g.classList.remove("options-menu-visible"):g.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Y);const u=new B;u.showPanel(2);document.body.append(u.dom);u.dom.style.left="0px";u.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>u.begin());a.renderer.onAfterUpdate.add(()=>u.end());
