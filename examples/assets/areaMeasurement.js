var S=Object.defineProperty;var $=(n,t,e)=>t in n?S(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var p=(n,t,e)=>($(n,typeof t!="symbol"?t+"":t,e),e);import{V as g,W as E,C as M,S as I,B,F,M as T,l as j,c as C,a as w,b as U}from"./index-xBtFzQOP.js";import{R as z,D as O,C as V,W,S as R,O as q,F as G,G as x}from"./graphic-vertex-picker-DsFwZW9k.js";import{P as H}from"./index-Ca9h7DsT.js";import{M as N,A as Y,L as D}from"./index-C3O16z9u.js";import"./index-C04wXp5L.js";const k=class k extends N{constructor(e){super(e,"area");p(this,"pickTolerance",.1);p(this,"tolerance",.005);p(this,"modes",["free","square","face"]);p(this,"_mode","free");p(this,"_temp",{isDragging:!1,area:new Y,lines:new E,point:new g});p(this,"_lineToAreaMap",new WeakMap);p(this,"computeLineElements",()=>{this._temp.lines.clear();const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!(e.length<2||!this.world))for(let i=0;i<e.length;i++){const r=e[i],s=e[(i+1)%e.length],a=new D(r,s),l=this.createLineElement(a);this._temp.lines.add(l)}});p(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;if(this.mode==="face"){const s=e.facePoints;if(!s)return;const a=[];for(let l=0;l<s.length-2;l+=3){const d=s[l],m=s[l+1],h=s[l+2];a.push(new g(d,m,h))}this._temp.area.points.add(...a),this.endCreation();return}const{area:i,point:r}=this._temp;if(this._temp.isDragging||(i.tolerance=this.tolerance,i.points.clear(),this._temp.isDragging=!0),i.points.size===0&&r.copy(e.point),i.points.add(r.clone()),this.mode==="square"&&i.points.size===2&&e.normal){const[s,a]=i.points,l=new g().subVectors(a,s),d=l.clone(),m=l.clone().negate();Math.abs(l.y)>=.1?(d.y=0,m.y=0):(d.x=0,m.x=0);const h=s.clone().add(d),A=a.clone().add(m);i.points.clear(),i.points.add(s,h,a,A),this.endCreation()}});p(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});p(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});p(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),s=this.components.get(z).get(this.world).castRayToObjects(e);if(!s)return;const l=[...this.fills].find(h=>h.three===s.object);if(!l)return;const d=l.area;this.fills.delete(l),this.list.delete(d),this.components.get(O).destroy(s.object)});e.add(k.uuid,this),this.initHandlers(),this.color=new M("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const i=this.createFillElement(e);i.color=this.color,this.fills.add(i),this.addLineElementsFromPointsForArea([...e.points],e)}),this.list.onBeforeDelete.add(e=>{const i=[...this.fills].find(s=>s.area===e);i&&this.fills.delete(i);const r=[];for(const s of this.lines)this._lineToAreaMap.get(s)===e&&r.push(s);for(const s of r)this.lines.delete(s),this._lineToAreaMap.delete(s)}),this.onPointerStop.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}async updatePreview(){if(!this.enabled||!this.world)return;const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point&&this._temp.isDragging))return;const i=e.point.clone(),{plane:r}=this._temp.area;if(r){const s=r.distanceToPoint(i);if(Math.abs(s)<.1){const a=new g;r.projectPoint(i,a),i.copy(a)}}this._temp.point.copy(i),this.computeLineElements()}addLineElementsFromPointsForArea(e,i){for(let r=0;r<e.length;r++){const s=e[r],a=e[(r+1)%e.length],l=new D(s,a),d=this.createLineElement(l);d.label.visible=!1,this.lines.add(d),this._lineToAreaMap.set(d,i)}}};p(k,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let _=k;const b=new V,J=b.get(W),c=J.create();c.scene=new R(b);c.scene.setup();c.scene.three.background=null;const L=document.getElementById("container");c.renderer=new H(b,L);c.camera=new q(b);await c.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);b.init();const K="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Q=await fetch(K),X=await Q.blob(),Z=new File([X],"worker.mjs",{type:"text/javascript"}),ee=URL.createObjectURL(Z),u=b.get(G);u.init(ee);c.camera.controls.addEventListener("update",()=>u.core.update());c.onCameraChanged.add(n=>{for(const[,t]of u.list)t.useCamera(n.three);u.core.update(!0)});u.list.onItemSet.add(({value:n})=>{n.useCamera(c.camera.three),c.scene.three.add(n.object),u.core.update(!0)});u.core.models.materials.list.onItemSet.add(({value:n})=>{"isLodMaterial"in n&&n.isLodMaterial||(n.polygonOffset=!0,n.polygonOffsetUnits=1,n.polygonOffsetFactor=Math.random())});const te=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(te.map(async n=>{var r;const t=(r=n.split("/").pop())==null?void 0:r.split(".").shift();if(!t)return null;const i=await(await fetch(n)).arrayBuffer();return u.core.load(i,{modelId:t})}));const o=b.get(_);o.world=c;o.color=new M("#494cb6");o.enabled=!0;L.ondblclick=()=>o.create();window.addEventListener("keydown",n=>{(n.code==="Enter"||n.code==="NumpadEnter")&&o.endCreation()});const ne=()=>{o.list.clear()},ie=()=>{const n=[];for(const t of o.list)n.push(t.value);return n};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&o.delete()};o.list.onItemAdded.add(n=>{if(!n.boundingBox)return;const t=new I;n.boundingBox.getBoundingSphere(t),c.camera.controls.fitToSphere(t,!0)});const v=[];for(const[,n]of u.list){const t=await n.getItemsIdsWithGeometry(),e=await n.getItemsGeometry(t),i=new Map;for(const r in e){const s=e[r];for(const a of s){if(!a.positions||!a.indices||!a.transform||!a.representationId)continue;const l=a.representationId;if(!i.has(l)){const h=new B;h.setAttribute("position",new F(a.positions,3)),h.setIndex(Array.from(a.indices)),i.set(l,h)}const d=i.get(l),m=new T(d);m.applyMatrix4(a.transform),m.applyMatrix4(n.object.matrixWorld),m.updateWorldMatrix(!0,!0),v.push(m)}}}const se=o.delay,P=async n=>{if(n){o.pickerMode=x.SYNCHRONOUS,o.delay=0;for(const t of v)c.meshes.add(t);return}o.pickerMode=x.DEFAULT,o.delay=se;for(const t of v)c.meshes.delete(t)};await P(!0);j.init();const y=C.create(()=>{const n=()=>{const t=ie();console.log(t)};return w`
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
        
        <bim-checkbox checked label="Synchronous Picking"
          @change="${({target:t})=>{P(t.value)}}">
        </bim-checkbox>

        <bim-number-input
          slider step="1" label="Picker Size" value="${o.pickerSize}" min="2" max="20"
          @change="${({target:t})=>{o.pickerSize=t.value}}">
        </bim-number-input>

        <bim-color-input 
          label="Color" color=#${o.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{o.color=new M(t.color)}}">
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

        <bim-button label="Delete all" @click=${()=>ne()}></bim-button>
        
        <bim-button label="Log Values" @click=${n}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(y);const oe=C.create(()=>w`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{y.classList.contains("options-menu-visible")?y.classList.remove("options-menu-visible"):y.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(oe);const f=new U;f.showPanel(2);document.body.append(f.dom);f.dom.style.left="0px";f.dom.style.zIndex="unset";c.renderer.onBeforeUpdate.add(()=>f.begin());c.renderer.onAfterUpdate.add(()=>f.end());
