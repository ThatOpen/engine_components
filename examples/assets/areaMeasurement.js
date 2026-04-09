var S=Object.defineProperty;var $=(i,t,e)=>t in i?S(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var p=(i,t,e)=>($(i,typeof t!="symbol"?t+"":t,e),e);import{V as g,W as E,C as M,S as I,B,F,M as T,l as j,c as C,a as w,b as U}from"./index-lAiblgEx.js";import{R as z,D as O,C as V,W,S as R,O as q,F as G,G as x}from"./graphic-vertex-picker-BP6CeVm1.js";import{P as H}from"./index-DQnkIW5Q.js";import{M as N,A as Y,L as D}from"./index-DJMoeYZj.js";import"./renderer-with-2d-B--NFzoM.js";import"./index-DEJ-iF65.js";const k=class k extends N{constructor(e){super(e,"area");p(this,"pickTolerance",.1);p(this,"tolerance",.005);p(this,"modes",["free","square","face"]);p(this,"_mode","free");p(this,"_temp",{isDragging:!1,area:new Y,lines:new E,point:new g});p(this,"_lineToAreaMap",new WeakMap);p(this,"computeLineElements",()=>{this._temp.lines.clear();const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!(e.length<2||!this.world))for(let n=0;n<e.length;n++){const r=e[n],s=e[(n+1)%e.length],a=new D(r,s),l=this.createLineElement(a);this._temp.lines.add(l)}});p(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;if(this.mode==="face"){const s=e.facePoints;if(!s)return;const a=[];for(let l=0;l<s.length-2;l+=3){const d=s[l],m=s[l+1],h=s[l+2];a.push(new g(d,m,h))}this._temp.area.points.add(...a),this.endCreation();return}const{area:n,point:r}=this._temp;if(this._temp.isDragging||(n.tolerance=this.tolerance,n.points.clear(),this._temp.isDragging=!0),n.points.size===0&&r.copy(e.point),n.points.add(r.clone()),this.mode==="square"&&n.points.size===2&&e.normal){const[s,a]=n.points,l=new g().subVectors(a,s),d=l.clone(),m=l.clone().negate();Math.abs(l.y)>=.1?(d.y=0,m.y=0):(d.x=0,m.x=0);const h=s.clone().add(d),A=a.clone().add(m);n.points.clear(),n.points.add(s,h,a,A),this.endCreation()}});p(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});p(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});p(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),s=this.components.get(z).get(this.world).castRayToObjects(e);if(!s)return;const l=[...this.fills].find(h=>h.three===s.object);if(!l)return;const d=l.area;this.fills.delete(l),this.list.delete(d),this.components.get(O).destroy(s.object)});e.add(k.uuid,this),this.initHandlers(),this.color=new M("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const n=this.createFillElement(e);n.color=this.color,this.fills.add(n),this.addLineElementsFromPointsForArea([...e.points],e)}),this.list.onBeforeDelete.add(e=>{const n=[...this.fills].find(s=>s.area===e);n&&this.fills.delete(n);const r=[];for(const s of this.lines)this._lineToAreaMap.get(s)===e&&r.push(s);for(const s of r)this.lines.delete(s),this._lineToAreaMap.delete(s)}),this.onPointerStop.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}async updatePreview(){if(!this.enabled||!this.world)return;const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point&&this._temp.isDragging))return;const n=e.point.clone(),{plane:r}=this._temp.area;if(r){const s=r.distanceToPoint(n);if(Math.abs(s)<.1){const a=new g;r.projectPoint(n,a),n.copy(a)}}this._temp.point.copy(n),this.computeLineElements()}addLineElementsFromPointsForArea(e,n){for(let r=0;r<e.length;r++){const s=e[r],a=e[(r+1)%e.length],l=new D(s,a),d=this.createLineElement(l);d.label.visible=!1,this.lines.add(d),this._lineToAreaMap.set(d,n)}}};p(k,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let _=k;const b=new V,J=b.get(W),c=J.create();c.scene=new R(b);c.scene.setup();c.scene.three.background=null;const L=document.getElementById("container");c.renderer=new H(b,L);c.camera=new q(b);await c.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);b.init();const K="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Q=await fetch(K),X=await Q.blob(),Z=new File([X],"worker.mjs",{type:"text/javascript"}),ee=URL.createObjectURL(Z),u=b.get(G);u.init(ee);c.camera.controls.addEventListener("update",()=>u.core.update());c.onCameraChanged.add(i=>{for(const[,t]of u.list)t.useCamera(i.three);u.core.update(!0)});u.list.onItemSet.add(({value:i})=>{i.useCamera(c.camera.three),c.scene.three.add(i.object),u.core.update(!0)});u.core.models.materials.list.onItemSet.add(({value:i})=>{"isLodMaterial"in i&&i.isLodMaterial||(i.polygonOffset=!0,i.polygonOffsetUnits=1,i.polygonOffsetFactor=Math.random())});const te=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(te.map(async i=>{var r;const t=(r=i.split("/").pop())==null?void 0:r.split(".").shift();if(!t)return null;const n=await(await fetch(i)).arrayBuffer();return u.core.load(n,{modelId:t})}));const o=b.get(_);o.world=c;o.color=new M("#494cb6");o.enabled=!0;L.ondblclick=()=>o.create();window.addEventListener("keydown",i=>{(i.code==="Enter"||i.code==="NumpadEnter")&&o.endCreation()});const ie=()=>{o.list.clear()},ne=()=>{const i=[];for(const t of o.list)i.push(t.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&o.delete()};o.list.onItemAdded.add(i=>{if(!i.boundingBox)return;const t=new I;i.boundingBox.getBoundingSphere(t),c.camera.controls.fitToSphere(t,!0)});const v=[];for(const[,i]of u.list){const t=await i.getItemsIdsWithGeometry(),e=await i.getItemsGeometry(t),n=new Map;for(const r in e){const s=e[r];for(const a of s){if(!a.positions||!a.indices||!a.transform||!a.representationId)continue;const l=a.representationId;if(!n.has(l)){const h=new B;h.setAttribute("position",new F(a.positions,3)),h.setIndex(Array.from(a.indices)),n.set(l,h)}const d=n.get(l),m=new T(d);m.applyMatrix4(a.transform),m.applyMatrix4(i.object.matrixWorld),m.updateWorldMatrix(!0,!0),v.push(m)}}}const se=o.delay,P=async i=>{if(i){o.pickerMode=x.SYNCHRONOUS,o.delay=0;for(const t of v)c.meshes.add(t);return}o.pickerMode=x.DEFAULT,o.delay=se;for(const t of v)c.meshes.delete(t)};await P(!0);j.init();const y=C.create(()=>{const i=()=>{const t=ne();console.log(t)};return w`
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

        <bim-button label="Delete all" @click=${()=>ie()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(y);const oe=C.create(()=>w`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{y.classList.contains("options-menu-visible")?y.classList.remove("options-menu-visible"):y.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(oe);const f=new U;f.showPanel(2);document.body.append(f.dom);f.dom.style.left="0px";f.dom.style.zIndex="unset";c.renderer.onBeforeUpdate.add(()=>f.begin());c.renderer.onAfterUpdate.add(()=>f.end());
