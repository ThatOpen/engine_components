var x=Object.defineProperty;var E=(n,t,e)=>t in n?x(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var r=(n,t,e)=>(E(n,typeof t!="symbol"?t+"":t,e),e);import{b as _,W as P,C as k,S as L,u as S,V as y,f,a as B}from"./index-BVinSk0X.js";import{R as M,D as A,C as I,W as V,S as j,O as q,F as z}from"./graphic-vertex-picker-DIM7gQA5.js";import{P as F}from"./index-BLwIRjEQ.js";import{M as T,A as W,L as R}from"./index-CsCoojiw.js";import"./index-uVKS97J8.js";const w=class w extends T{constructor(e){super(e,"area");r(this,"pickTolerance",.1);r(this,"tolerance",.005);r(this,"modes",["free","square"]);r(this,"_mode","free");r(this,"_temp",{isDragging:!1,area:new W,lines:new P,point:new _});r(this,"computeLineElements",()=>{this._temp.lines.clear();const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!(e.length<2||!this.world))for(let i=0;i<e.length;i++){const o=e[i],l=e[(i+1)%e.length],c=new R(o,l),u=this.createLineElement(c);this._temp.lines.add(u)}});r(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;const{area:i,point:o}=this._temp;if(this._temp.isDragging||(i.tolerance=this.tolerance,i.points.clear(),this._temp.isDragging=!0),i.points.size===0&&o.copy(e.point),i.points.add(o.clone()),this.mode==="square"&&i.points.size===2&&e.normal){const[l,c]=i.points,u=new _().subVectors(c,l),h=u.clone(),d=u.clone().negate();Math.abs(u.y)>=.1?(h.y=0,d.y=0):(h.x=0,d.x=0);const D=l.clone().add(h),$=c.clone().add(d);i.points.clear(),i.points.add(l,D,c,$),this.endCreation()}});r(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});r(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});r(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),l=this.components.get(M).get(this.world).castRayToObjects(e),c=this.components.get(A);for(const d of e)c.destroy(d);if(!l)return;const h=[...this.fills].find(d=>d.three===l.object);h&&(this.list.delete(h.area),this.lines.clear())});e.add(w.uuid,this),this.initHandlers(),this.color=new k("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const i=this.createFillElement(e);i.color=this.color,this.fills.add(i),this.addLineElementsFromPoints([...e.points])}),this.list.onBeforeDelete.add(e=>{const i=[...this.fills].find(o=>o.area===e);i&&this.fills.delete(i)}),this.onPointerStop.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}async updatePreview(){if(!this.enabled||!this.world)throw new Error("Measurement is not enabled or world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point&&this._temp.isDragging))return;const i=e.point.clone(),{plane:o}=this._temp.area;if(o){const l=o.distanceToPoint(i);if(Math.abs(l)<.1){const c=new _;o.projectPoint(i,c),i.copy(c)}}this._temp.point.copy(i),this.computeLineElements()}};r(w,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let v=w;const m=new I,U=m.get(V),a=U.create();a.scene=new j(m);a.scene.setup();a.scene.three.background=null;const C=document.getElementById("container");a.renderer=new F(m,C);a.camera=new q(m);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);m.init();const H="/node_modules/@thatopen-platform/fragments-beta/dist/Worker/worker.mjs",p=m.get(z);p.init(H);a.camera.controls.addEventListener("rest",()=>p.core.update(!0));a.onCameraChanged.add(n=>{for(const[,t]of p.list)t.useCamera(n.three);p.core.update(!0)});p.list.onItemSet.add(({value:n})=>{n.useCamera(a.camera.three),a.scene.three.add(n.object),p.core.update(!0)});const O=["/resources/frags/school_arq.frag"];await Promise.all(O.map(async n=>{var o;const t=(o=n.split("/").pop())==null?void 0:o.split(".").shift();if(!t)return null;const i=await(await fetch(n)).arrayBuffer();return p.core.load(i,{modelId:t})}));const s=m.get(v);s.world=a;s.color=new k("#494cb6");s.enabled=!0;C.ondblclick=()=>s.create();window.addEventListener("keydown",n=>{(n.code==="Enter"||n.code==="NumpadEnter")&&s.endCreation()});const N=()=>{s.list.clear()},G=()=>{const n=[];for(const t of s.list)n.push(t.value);return n};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&s.delete()};s.list.onItemAdded.add(n=>{if(!n.boundingBox)return;const t=new L;n.boundingBox.getBoundingSphere(t),a.camera.controls.fitToSphere(t,!0)});S.init();const g=y.create(()=>{const n=()=>{const t=G();console.log(t)};return f`
    <bim-panel active label="Area Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:t})=>{s.enabled=t.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:t})=>{s.visible=t.value}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${s.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{s.color=new k(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;s.mode=e}}"> ${s.modes.map(t=>f`<bim-option label=${t} value=${t} ?checked=${t===s.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;s.units=e}}">
          ${s.unitsList.map(t=>f`<bim-option label=${t} value=${t} ?checked=${t===s.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Pricision" required
          @change="${({target:t})=>{const[e]=t.value;s.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>N()}></bim-button>
        
        <bim-button label="Log Values" @click=${n}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(g);const J=y.create(()=>f`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{g.classList.contains("options-menu-visible")?g.classList.remove("options-menu-visible"):g.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);const b=new B;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>b.begin());a.renderer.onAfterUpdate.add(()=>b.end());
