var $=Object.defineProperty;var S=(n,t,e)=>t in n?$(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var d=(n,t,e)=>(S(n,typeof t!="symbol"?t+"":t,e),e);import{V as g,W as B,C as D,S as F,B as T,F as U,d as j,l as O,c as A,a as w,b as V}from"./index-BET5fVdQ.js";import{R as W,D as R,C as q,W as z,S as G,O as H,F as N,G as x}from"./graphic-vertex-picker-D88BIZW2.js";import{P as Y}from"./index-oGDxbV82.js";import{M as J,A as K,L as C}from"./index-dHOtP3jI.js";import"./index-CtMoHNvK.js";const _=class _ extends J{constructor(e){super(e,"area");d(this,"pickTolerance",.1);d(this,"tolerance",.005);d(this,"modes",["free","square","face"]);d(this,"_mode","free");d(this,"_temp",{isDragging:!1,area:new K,lines:new B,point:new g});d(this,"_lineToAreaMap",new WeakMap);d(this,"computeLineElements",()=>{this._temp.lines.clear();const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!(e.length<2||!this.world))for(let s=0;s<e.length;s++){const a=e[s],i=e[(s+1)%e.length],r=new C(a,i),l=this.createLineElement(r);this._temp.lines.add(l)}});d(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;if(this.mode==="face"){const i=e.facePoints;if(!i)return;const r=[];for(let l=0;l<i.length-2;l+=3){const p=i[l],u=i[l+1],f=i[l+2];r.push(new g(p,u,f))}this._temp.area.points.add(...r),this.endCreation();return}const{area:s,point:a}=this._temp;if(this._temp.isDragging||(s.tolerance=this.tolerance,s.points.clear(),this._temp.isDragging=!0),s.points.size===0&&a.copy(e.point),s.points.add(a.clone()),this.mode==="square"&&s.points.size===2&&e.normal){const[i,r]=s.points,l=new g().subVectors(r,i),p=l.clone(),u=l.clone().negate();Math.abs(l.y)>=.1?(p.y=0,u.y=0):(p.x=0,u.x=0);const f=i.clone().add(p),I=r.clone().add(u);s.points.clear(),s.points.add(i,f,r,I),this.endCreation()}});d(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});d(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});d(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),i=this.components.get(W).get(this.world).castRayToObjects(e);if(!i)return;const l=[...this.fills].find(f=>f.three===i.object);if(!l)return;const p=l.area;this.fills.delete(l),this.list.delete(p),this.components.get(R).destroy(i.object)});e.add(_.uuid,this),this.initHandlers(),this.color=new D("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const s=this.createFillElement(e);s.color=this.color,this.fills.add(s),this.addLineElementsFromPointsForArea([...e.points],e)}),this.list.onBeforeDelete.add(e=>{const s=[...this.fills].find(i=>i.area===e);s&&this.fills.delete(s);const a=[];for(const i of this.lines)this._lineToAreaMap.get(i)===e&&a.push(i);for(const i of a)this.lines.delete(i),this._lineToAreaMap.delete(i)}),this.onPointerStop.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}async updatePreview(){if(!this.enabled||!this.world)throw new Error("Measurement is not enabled or world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point&&this._temp.isDragging))return;const s=e.point.clone(),{plane:a}=this._temp.area;if(a){const i=a.distanceToPoint(s);if(Math.abs(i)<.1){const r=new g;a.projectPoint(s,r),s.copy(r)}}this._temp.point.copy(s),this.computeLineElements()}addLineElementsFromPointsForArea(e,s){for(let a=0;a<e.length;a++){const i=e[a],r=e[(a+1)%e.length],l=new C(i,r),p=this.createLineElement(l);p.label.visible=!1,this.lines.add(p),this._lineToAreaMap.set(p,s)}}};d(_,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let v=_;const h=new q,Q=h.get(z),c=Q.create();c.scene=new G(h);c.scene.setup();c.scene.three.background=null;const P=document.getElementById("container");c.renderer=new Y(h,P);c.camera=new H(h);await c.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);h.init();const X="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Z=await fetch(X),ee=await Z.blob(),te=new File([ee],"worker.mjs",{type:"text/javascript"}),ne=URL.createObjectURL(te),m=h.get(N);m.init(ne);c.camera.controls.addEventListener("update",()=>m.core.update());c.onCameraChanged.add(n=>{for(const[,t]of m.list)t.useCamera(n.three);m.core.update(!0)});m.list.onItemSet.add(({value:n})=>{n.useCamera(c.camera.three),c.scene.three.add(n.object),m.core.update(!0)});m.core.models.materials.list.onItemSet.add(({value:n})=>{"isLodMaterial"in n&&n.isLodMaterial||(n.polygonOffset=!0,n.polygonOffsetUnits=1,n.polygonOffsetFactor=Math.random())});const se=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(se.map(async n=>{var a;const t=(a=n.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const s=await(await fetch(n)).arrayBuffer();return m.core.load(s,{modelId:t})}));const o=h.get(v);o.world=c;o.color=new D("#494cb6");o.enabled=!0;P.ondblclick=()=>o.create();window.addEventListener("keydown",n=>{(n.code==="Enter"||n.code==="NumpadEnter")&&o.endCreation()});const ie=()=>{o.list.clear()},oe=()=>{const n=[];for(const t of o.list)n.push(t.value);return n};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&o.delete()};o.list.onItemAdded.add(n=>{if(!n.boundingBox)return;const t=new F;n.boundingBox.getBoundingSphere(t),c.camera.controls.fitToSphere(t,!0)});const M=[],E=m.list.values().next().value,ae=await E.getItemsIdsWithGeometry(),L=await E.getItemsGeometry(ae),k=new Map;for(const n in L){const t=L[n];for(const e of t){if(!e.positions||!e.indices||!e.transform||!e.representationId)continue;const s=e.representationId;if(!k.has(s)){const r=new T;r.setAttribute("position",new U(e.positions,3)),r.setIndex(Array.from(e.indices)),k.set(s,r)}const a=k.get(s),i=new j(a);i.applyMatrix4(e.transform),i.updateWorldMatrix(!0,!0),M.push(i)}}const re=o.delay,le=async n=>{if(n){o.pickerMode=x.SYNCHRONOUS,o.delay=0;for(const t of M)c.meshes.add(t);return}o.pickerMode=x.DEFAULT,o.delay=re;for(const t of M)c.meshes.delete(t)};O.init();const y=A.create(()=>{const n=()=>{const t=oe();console.log(t)};return w`
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
        
        <bim-checkbox label="Synchronous Picking" 
          @change="${({target:t})=>{le(t.value)}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${o.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{o.color=new D(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;o.mode=e}}"> ${o.modes.map(t=>w`<bim-option label=${t} value=${t} ?checked=${t===o.mode}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Units" required
          @change="${({target:t})=>{const[e]=t.value;o.units=e}}">
          ${o.unitsList.map(t=>w`<bim-option label=${t} value=${t} ?checked=${t===o.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Precision" required
          @change="${({target:t})=>{const[e]=t.value;o.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>ie()}></bim-button>
        
        <bim-button label="Log Values" @click=${n}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(y);const ce=A.create(()=>w`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{y.classList.contains("options-menu-visible")?y.classList.remove("options-menu-visible"):y.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(ce);const b=new V;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";c.renderer.onBeforeUpdate.add(()=>b.begin());c.renderer.onAfterUpdate.add(()=>b.end());
