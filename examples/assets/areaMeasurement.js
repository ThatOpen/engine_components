var A=Object.defineProperty;var M=(n,t,e)=>t in n?A(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var p=(n,t,e)=>(M(n,typeof t!="symbol"?t+"":t,e),e);import{V as _,D as I,C as y,c as b,S as T,p as B,m as L,a as w,b as F}from"./index-r1u2qk8S.js";import{R as z,D as O,C as V,W as R,S as j,O as q,F as N,a as U}from"./graphic-vertex-picker-CWFP0Ixd.js";import{w as H}from"./worker-C2DG9TTm.js";import{P as W}from"./index-XrFy7Sj7.js";import{M as G,A as J,L as C}from"./index-Rf_GGFMf.js";import"./three.tsl-BohoDV_b.js";import"./renderer-with-2d-8C_aJlkt.js";const k=class k extends G{constructor(e){super(e,"area");p(this,"pickTolerance",.1);p(this,"tolerance",.005);p(this,"modes",["free","square","face"]);p(this,"_mode","free");p(this,"_temp",{isDragging:!1,area:new J,lines:new I,point:new _});p(this,"_lineToAreaMap",new WeakMap);p(this,"computeLineElements",()=>{const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!this.world){this._temp.lines.clear();return}if(e.length<2){this._temp.lines.clear();return}const s=e.length,a=[...this._temp.lines];if(a.length!==s){this._temp.lines.clear();for(let i=0;i<s;i++){const r=e[i],l=e[(i+1)%s],c=new C(r,l),m=this.createLineElement(c);this._temp.lines.add(m)}return}for(let i=0;i<s;i++){const r=e[i],l=e[(i+1)%s],c=a[i];c.start=r,c.end=l}});p(this,"create",async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;if(this.mode==="face"){const i=e.facePoints;if(!i)return;const r=[];for(let l=0;l<i.length-2;l+=3){const c=i[l],m=i[l+1],g=i[l+2];r.push(new _(c,m,g))}this._temp.area.points.add(...r),this.endCreation();return}const{area:s,point:a}=this._temp;if(this._temp.isDragging||(s.tolerance=this.tolerance,s.points.clear(),this._temp.isDragging=!0),s.points.size===0&&a.copy(e.point),s.points.add(a.clone()),this.mode==="square"&&s.points.size===2&&e.normal){const[i,r]=s.points,l=new _().subVectors(r,i),c=l.clone(),m=l.clone().negate();Math.abs(l.y)>=.1?(c.y=0,m.y=0):(c.x=0,m.x=0);const g=i.clone().add(c),E=r.clone().add(m);s.points.clear(),s.points.add(i,g,r,E),this.endCreation()}});p(this,"endCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this._temp.area.rawValue>1e-6&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())});p(this,"cancelCreation",()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())});p(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),i=this.components.get(z).get(this.world).castRayToObjects(e);if(!i)return;const l=[...this.fills].find(g=>g.three===i.object);if(!l)return;const c=l.area;this.fills.delete(l),this.list.delete(c),this.components.get(O).destroy(i.object)});e.add(k.uuid,this),this.initHandlers(),this.color=new y("#6528d7")}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const s=this.createFillElement(e);s.color=this.color,this.fills.add(s),this.addLineElementsFromPointsForArea([...e.points],e)}),this.list.onBeforeDelete.add(e=>{const s=[...this.fills].find(i=>i.area===e);s&&this.fills.delete(s);const a=[];for(const i of this.lines)this._lineToAreaMap.get(i)===e&&a.push(i);for(const i of a)this.lines.delete(i),this._lineToAreaMap.delete(i)}),this.onPointerMove.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}updatePreview(){if(!this.enabled||!this.world)return;const e=this.lastPick;if(!(e&&e.point&&this._temp.isDragging))return;const s=e.point.clone(),{plane:a}=this._temp.area;if(a){const i=a.distanceToPoint(s);if(Math.abs(i)<.1){const r=new _;a.projectPoint(s,r),s.copy(r)}}this._temp.point.copy(s),this.computeLineElements()}addLineElementsFromPointsForArea(e,s){for(let a=0;a<e.length;a++){const i=e[a],r=e[(a+1)%e.length],l=new C(i,r),c=this.createLineElement(l);c.label.visible=!1,this.lines.add(c),this._lineToAreaMap.set(c,s)}}};p(k,"uuid","09b78c1f-0ff1-4630-a818-ceda3d878c75");let S=k;const u=new V,K=u.get(R),d=K.create();d.scene=new j(u);d.scene.setup();d.scene.three.background=null;const P=document.getElementById("container");d.renderer=new W(u,P);d.camera=new q(u);await d.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);u.init();const h=u.get(N);h.init(H);d.camera.controls.addEventListener("update",()=>h.core.update());d.onCameraChanged.add(n=>{for(const[,t]of h.list)t.useCamera(n.three);h.core.update(!0)});h.list.onItemSet.add(({value:n})=>{n.useCamera(d.camera.three),d.scene.three.add(n.object),h.core.update(!0)});h.core.models.materials.list.onItemSet.add(({value:n})=>{"isLodMaterial"in n&&n.isLodMaterial||(n.polygonOffset=!0,n.polygonOffsetUnits=1,n.polygonOffsetFactor=Math.random())});const Q=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(Q.map(async n=>{var a;const t=(a=n.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const s=await(await fetch(n)).arrayBuffer();return h.core.load(s,{modelId:t})}));const o=u.get(S);o.world=d;o.color=new y("#494cb6");o.enabled=!0;o.snappings=[b.POINT];P.ondblclick=()=>o.create();window.addEventListener("keydown",n=>{(n.code==="Enter"||n.code==="NumpadEnter")&&o.endCreation()});const X=()=>{o.list.clear()},Y=()=>{const n=[];for(const t of o.list)n.push(t.value);return n};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&o.delete()};o.list.onItemAdded.add(n=>{if(!n.boundingBox)return;const t=new T;n.boundingBox.getBoundingSphere(t),d.camera.controls.fitToSphere(t,!0)});B.init();const D=u.get(U).get(),$=n=>{var t;return((t=o.snappings)==null?void 0:t.includes(n))??!1},x=(n,t)=>{const e=new Set(o.snappings??[]);t?e.add(n):e.delete(n),o.snappings=Array.from(e)},Z=()=>w`
  <bim-checkbox label="Snap: Point" ?checked=${$(b.POINT)}
    @change="${({target:n})=>x(b.POINT,n.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${$(b.LINE)}
    @change="${({target:n})=>x(b.LINE,n.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${$(b.FACE)}
    @change="${({target:n})=>x(b.FACE,n.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${D.maxDistance}" min="0.05" max="5"
    @change="${({target:n})=>{D.maxDistance=n.value}}">
  </bim-number-input>
`,v=L.create(()=>{const n=()=>{const t=Y();console.log(t)};return w`
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
        
<bim-number-input
          slider step="1" label="Picker Size" value="${o.pickerSize}" min="2" max="20"
          @change="${({target:t})=>{o.pickerSize=t.value}}">
        </bim-number-input>

        <bim-color-input 
          label="Color" color=#${o.linesMaterial.color.getHexString()}
          @input="${({target:t})=>{o.color=new y(t.color)}}">
        </bim-color-input>
        
        <bim-dropdown
          label="Measure Mode" required
          @change="${({target:t})=>{const[e]=t.value;o.mode=e}}"> ${o.modes.map(t=>w`<bim-option label=${t} value=${t} ?checked=${t===o.mode}></bim-option>`)}
        </bim-dropdown>

        ${Z()}

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

        <bim-button label="Delete all" @click=${()=>X()}></bim-button>
        
        <bim-button label="Log Values" @click=${n}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(v);const ee=L.create(()=>w`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{v.classList.contains("options-menu-visible")?v.classList.remove("options-menu-visible"):v.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(ee);const f=new F;f.showPanel(2);document.body.append(f.dom);f.dom.style.left="0px";f.dom.style.zIndex="unset";d.renderer.onBeforeUpdate.add(()=>f.begin());d.renderer.onAfterUpdate.add(()=>f.end());
