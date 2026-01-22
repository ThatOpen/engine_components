var E=Object.defineProperty;var A=(i,t,e)=>t in i?E(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var d=(i,t,e)=>(A(i,typeof t!="symbol"?t+"":t,e),e);import{V as g,W as $,C,S as x,l as M,c as D,a as w,b as S}from"./index-D_lOu8Cy.js";import{R as B,D as T,C as I,W as F,S as V,O as j,F as q}from"./graphic-vertex-picker-BY8Y4wOR.js";import{P as z}from"./index-B5aStPSH.js";import{M as W,A as R,L as y}from"./index-DgX7OH5o.js";import"./index-CenXdrKi.js";const v=class v extends W{constructor(e){super(e,"area");d(this,"pickTolerance",.1);d(this,"tolerance",.005);d(this,"modes",["free","square","face"]);d(this,"_mode","free");d(this,"_temp",{isDragging:!1,area:new R,lines:new $,point:new g});d(this,"_lineToAreaMap",new WeakMap);d(this,"computeLineElements",()=>{this._temp.lines.clear();const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!(e.length<2||!this.world))for(let n=0;n<e.length;n++){const o=e[n],s=e[(n+1)%e.length],l=new y(o,s),r=this.createLineElement(l);this._temp.lines.add(r)}});d(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;if(this.mode==="face"){const s=e.facePoints;if(!s)return;const l=[];for(let r=0;r<s.length-2;r+=3){const p=s[r],u=s[r+1],f=s[r+2];l.push(new g(p,u,f))}this._temp.area.points.add(...l),this.endCreation();return}const{area:n,point:o}=this._temp;if(this._temp.isDragging||(n.tolerance=this.tolerance,n.points.clear(),this._temp.isDragging=!0),n.points.size===0&&o.copy(e.point),n.points.add(o.clone()),this.mode==="square"&&n.points.size===2&&e.normal){const[s,l]=n.points,r=new g().subVectors(l,s),p=r.clone(),u=r.clone().negate();Math.abs(r.y)>=.1?(p.y=0,u.y=0):(p.x=0,u.x=0);const f=s.clone().add(p),P=l.clone().add(u);n.points.clear(),n.points.add(s,f,l,P),this.endCreation()}});d(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});d(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});d(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),s=this.components.get(B).get(this.world).castRayToObjects(e);if(!s)return;const r=[...this.fills].find(f=>f.three===s.object);if(!r)return;const p=r.area;this.fills.delete(r),this.list.delete(p),this.components.get(T).destroy(s.object)});e.add(v.uuid,this),this.initHandlers(),this.color=new C("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const n=this.createFillElement(e);n.color=this.color,this.fills.add(n),this.addLineElementsFromPointsForArea([...e.points],e)}),this.list.onBeforeDelete.add(e=>{const n=[...this.fills].find(s=>s.area===e);n&&this.fills.delete(n);const o=[];for(const s of this.lines)this._lineToAreaMap.get(s)===e&&o.push(s);for(const s of o)this.lines.delete(s),this._lineToAreaMap.delete(s)}),this.onPointerStop.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}async updatePreview(){if(!this.enabled||!this.world)throw new Error("Measurement is not enabled or world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point&&this._temp.isDragging))return;const n=e.point.clone(),{plane:o}=this._temp.area;if(o){const s=o.distanceToPoint(n);if(Math.abs(s)<.1){const l=new g;o.projectPoint(n,l),n.copy(l)}}this._temp.point.copy(n),this.computeLineElements()}addLineElementsFromPointsForArea(e,n){for(let o=0;o<e.length;o++){const s=e[o],l=e[(o+1)%e.length],r=new y(s,l),p=this.createLineElement(r);p.label.visible=!1,this.lines.add(p),this._lineToAreaMap.set(p,n)}}};d(v,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let k=v;const h=new I,U=h.get(F),c=U.create();c.scene=new V(h);c.scene.setup();c.scene.three.background=null;const L=document.getElementById("container");c.renderer=new z(h,L);c.camera=new j(h);await c.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);h.init();const H="https://thatopen.github.io/engine_fragment/resources/worker.mjs",m=h.get(q);m.init(H);c.camera.controls.addEventListener("rest",()=>m.core.update(!0));c.onCameraChanged.add(i=>{for(const[,t]of m.list)t.useCamera(i.three);m.core.update(!0)});m.list.onItemSet.add(({value:i})=>{i.useCamera(c.camera.three),c.scene.three.add(i.object),m.core.update(!0)});const O=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(O.map(async i=>{var o;const t=(o=i.split("/").pop())==null?void 0:o.split(".").shift();if(!t)return null;const n=await(await fetch(i)).arrayBuffer();return m.core.load(n,{modelId:t})}));const a=h.get(k);a.world=c;a.color=new C("#494cb6");a.enabled=!0;L.ondblclick=()=>a.create();window.addEventListener("keydown",i=>{(i.code==="Enter"||i.code==="NumpadEnter")&&a.endCreation()});const N=()=>{a.list.clear()},G=()=>{const i=[];for(const t of a.list)i.push(t.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&a.delete()};a.list.onItemAdded.add(i=>{if(!i.boundingBox)return;const t=new x;i.boundingBox.getBoundingSphere(t),c.camera.controls.fitToSphere(t,!0)});M.init();const _=D.create(()=>{const i=()=>{const t=G();console.log(t)};return w`
    <bim-panel active label="Area Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:t})=>{a.enabled=t.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:t})=>{a.visible=t.value}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${a.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{a.color=new C(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;a.mode=e}}"> ${a.modes.map(t=>w`<bim-option label=${t} value=${t} ?checked=${t===a.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;a.units=e}}">
          ${a.unitsList.map(t=>w`<bim-option label=${t} value=${t} ?checked=${t===a.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Pricision" required
          @change="${({target:t})=>{const[e]=t.value;a.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>N()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(_);const J=D.create(()=>w`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{_.classList.contains("options-menu-visible")?_.classList.remove("options-menu-visible"):_.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);const b=new S;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";c.renderer.onBeforeUpdate.add(()=>b.begin());c.renderer.onAfterUpdate.add(()=>b.end());
