import{V as g,aa as D,C as k,bw as h,J as E,K as A,n as S,b as f,S as M}from"./TransformControls-uP1Cexzu.js";import{R as I,D as T,c as B,W as F,S as z,O,F as V,a6 as q}from"./graphic-vertex-picker-BijCnCEg.js";import{w as R}from"./worker-BGfbLmKH.js";import{P as j}from"./index-B9_sa_qD.js";import{M as N,c as U,L as y,b as x}from"./index-DlCiRCyW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bKcSih7U.js";import"./renderer-with-2d-CrQsY-US.js";class $ extends N{static uuid="09b78c1f-0ff1-4630-a818-ceda3d878c75";pickTolerance=.1;tolerance=.005;modes=["free","square","face"];_mode="free";get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}_temp={isDragging:!1,area:new U,lines:new D,point:new g};_lineToAreaMap=new WeakMap;constructor(e){super(e,"area"),e.add($.uuid,this),this.initHandlers(),this.color=new k("#6528d7")}initHandlers(){this.onVisibilityChange.add(()=>{for(const e of this.lines)e.label.visible=!1}),this.list.onItemAdded.add(e=>{if(!this.world)return;const n=this.createFillElement(e);n.color=this.color,this.fills.add(n),this.addLineElementsFromPointsForArea([...e.points],e)}),this.list.onBeforeDelete.add(e=>{const n=[...this.fills].find(i=>i.area===e);n&&this.fills.delete(n);const o=[];for(const i of this.lines)this._lineToAreaMap.get(i)===e&&o.push(i);for(const i of o)this.lines.delete(i),this._lineToAreaMap.delete(i)}),this.onPointerMove.add(()=>this.updatePreview()),this._temp.lines.onItemAdded.add(e=>e.label.visible=!1),this._temp.lines.onBeforeDelete.add(e=>e.dispose()),this._temp.area.points.onItemAdded.add(()=>{this.computeLineElements()}),this._temp.area.points.onItemDeleted.add(()=>{this._temp.lines.clear()}),this.onStateChanged.add(e=>{e.includes("rounding")&&(this._temp.area.rounding=this.rounding),e.includes("units")&&(this._temp.area.units=this.units)})}computeLineElements=()=>{const e=[...this._temp.area.points];if(this._temp.area.isPointInPlane(this._temp.point)&&e.push(this._temp.point),!this.world){this._temp.lines.clear();return}if(e.length<2){this._temp.lines.clear();return}const n=e.length,o=[...this._temp.lines];if(o.length!==n){this._temp.lines.clear();for(let i=0;i<n;i++){const l=e[i],a=e[(i+1)%n],r=new y(l,a),d=this.createLineElement(r);this._temp.lines.add(d)}return}for(let i=0;i<n;i++){const l=e[i],a=e[(i+1)%n],r=o[i];r.start=l,r.end=a}};updatePreview(){if(!this.enabled||!this.world)return;const e=this.lastPick;if(!(e&&e.point&&this._temp.isDragging))return;const n=e.point.clone(),{plane:o}=this._temp.area;if(o){const i=o.distanceToPoint(n);if(Math.abs(i)<.1){const l=new g;o.projectPoint(n,l),n.copy(l)}}this._temp.point.copy(n),this.computeLineElements()}create=async()=>{if(!this.enabled)return;if(!this.world)throw new Error("Area Measurement: world is not defined!");const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e&&e.point))return;if(this.mode==="face"){const i=e.facePoints;if(!i)return;const l=[];for(let a=0;a<i.length-2;a+=3){const r=i[a],d=i[a+1],u=i[a+2];l.push(new g(r,d,u))}this._temp.area.points.add(...l),this.endCreation();return}const{area:n,point:o}=this._temp;if(this._temp.isDragging||(n.tolerance=this.tolerance,n.points.clear(),this._temp.isDragging=!0),n.points.size===0&&o.copy(e.point),n.points.add(o.clone()),this.mode==="square"&&n.points.size===2&&e.normal){const[i,l]=n.points,a=new g().subVectors(l,i),r=a.clone(),d=a.clone().negate();Math.abs(a.y)>=.1?(r.y=0,d.y=0):(r.x=0,d.x=0);const u=i.clone().add(r),P=l.clone().add(d);n.points.clear(),n.points.add(i,u,l,P),this.endCreation()}};endCreation=()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.size>=3&&this._temp.area.rawValue>1e-6&&this.list.add(this._temp.area.clone()),this._temp.area.points.clear(),this._temp.lines.clear())};cancelCreation=()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.area.points.clear(),this._temp.lines.clear())};addLineElementsFromPointsForArea(e,n){for(let o=0;o<e.length;o++){const i=e[o],l=e[(o+1)%e.length],a=new y(i,l),r=this.createLineElement(a);r.label.visible=!1,this.lines.add(r),this._lineToAreaMap.set(r,n)}}delete=()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getFillBoxes(),i=this.components.get(I).get(this.world).castRayToObjects(e);if(!i)return;const a=[...this.fills].find(u=>u.three===i.object);if(!a)return;const r=a.area;this.fills.delete(a),this.list.delete(r),this.components.get(T).destroy(i.object)}}const m=new B,W=m.get(F),c=W.create();c.scene=new z(m);c.scene.setup();c.scene.three.background=null;const C=document.getElementById("container");c.renderer=new j(m,C);c.camera=new O(m);await c.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);m.init();const p=m.get(V);p.init(R);c.camera.controls.addEventListener("update",()=>p.core.update());c.onCameraChanged.add(t=>{for(const[,e]of p.list)e.useCamera(t.three);p.core.update(!0)});p.list.onItemSet.add(({value:t})=>{t.useCamera(c.camera.three),c.scene.three.add(t.object),p.core.update(!0)});p.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(H.map(async t=>{const e=t.split("/").pop()?.split(".").shift();if(!e)return null;const o=await(await fetch(t)).arrayBuffer();return p.core.load(o,{modelId:e})}));const s=m.get($);s.world=c;s.color=new k("#494cb6");s.enabled=!0;s.snappings=[h.POINT];C.ondblclick=()=>s.create();window.addEventListener("keydown",t=>{(t.code==="Enter"||t.code==="NumpadEnter")&&s.endCreation()});const K=()=>{s.list.clear()},J=()=>{const t=[];for(const e of s.list)t.push(e.value);return t};window.onkeydown=t=>{(t.code==="Delete"||t.code==="Backspace")&&s.delete()};s.list.onItemAdded.add(t=>{if(!t.boundingBox)return;const e=new E;t.boundingBox.getBoundingSphere(e),c.camera.controls.fitToSphere(e,!0)});A.init();const L=m.get(q).get(),v=t=>s.snappings?.includes(t)??!1,_=(t,e)=>{const n=new Set(s.snappings??[]);e?n.add(t):n.delete(t),s.snappings=Array.from(n)},G=()=>f`
  <bim-checkbox label="Snap: Point" ?checked=${v(h.POINT)}
    @change="${({target:t})=>_(h.POINT,t.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${v(h.LINE)}
    @change="${({target:t})=>_(h.LINE,t.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${v(h.FACE)}
    @change="${({target:t})=>_(h.FACE,t.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${L.maxDistance}" min="0.05" max="5"
    @change="${({target:t})=>{L.maxDistance=t.value}}">
  </bim-number-input>
`,w=S.create(()=>{const t=()=>{const e=J();console.log(e)};return f`
    <bim-panel active label="Area Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:e})=>{s.enabled=e.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:e})=>{s.visible=e.value}}">  
        </bim-checkbox>  
        
<bim-number-input
          slider step="1" label="Picker Size" value="${s.pickerSize}" min="2" max="20"
          @change="${({target:e})=>{s.pickerSize=e.value}}">
        </bim-number-input>

        <bim-color-input 
          label="Color" color=#${s.linesMaterial.color.getHexString()}
          @input="${({target:e})=>{s.color=new k(e.color)}}">
        </bim-color-input>
        
        <bim-dropdown
          label="Measure Mode" required
          @change="${({target:e})=>{const[n]=e.value;s.mode=n}}"> ${s.modes.map(e=>f`<bim-option label=${e} value=${e} ?checked=${e===s.mode}></bim-option>`)}
        </bim-dropdown>

        ${G()}

        <bim-dropdown 
          label="Units" required
          @change="${({target:e})=>{const[n]=e.value;s.units=n}}">
          ${s.unitsList.map(e=>f`<bim-option label=${e} value=${e} ?checked=${e===s.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Precision" required
          @change="${({target:e})=>{const[n]=e.value;s.rounding=n}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-dropdown
          label="Line type" required
          @change="${({target:e})=>{s.lineType=e.value[0]}}">
          <bim-option label="Basic" value="${x.Basic}" checked></bim-option>
          <bim-option label="Fat" value="${x.Fat}"></bim-option>
        </bim-dropdown>

        <bim-number-input
          slider label="Line width" value="${s.lineWidth}"
          min="1" max="10" step="0.5"
          @change="${({target:e})=>{s.lineWidth=e.value}}">
        </bim-number-input>

        <bim-button label="Delete all" @click=${()=>K()}></bim-button>
        
        <bim-button label="Log Values" @click=${t}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(w);const Q=S.create(()=>f`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{w.classList.contains("options-menu-visible")?w.classList.remove("options-menu-visible"):w.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Q);const b=new M;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";c.renderer.onBeforeUpdate.add(()=>b.begin());c.renderer.onAfterUpdate.add(()=>b.end());
