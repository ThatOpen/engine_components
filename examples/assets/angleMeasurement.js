var H=Object.defineProperty;var N=(s,i,e)=>i in s?H(s,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[i]=e;var m=(s,i,e)=>(N(s,typeof i!="symbol"?i+"":i,e),e);import{G as F,B as y,L as S,V as h,M as q,d as X,e as Y,C as I,c as x,p as Z,m as D,a as $,b as j}from"./index-S6p3h9tm.js";import{R as W,b as z,C as J,W as K,S as Q,O as ee,F as te,a as se}from"./graphic-vertex-picker-Byv2XlPs.js";import{w as ie}from"./worker-C2DG9TTm.js";import{P as oe}from"./index-DXEOSG22.js";import{M as ne,b as B,n as re,c as ae}from"./index-DFBHscnQ.js";import"./three.tsl-Cqi8bW1b.js";import"./renderer-with-2d-CcxfXmTD.js";const O=32,T=.3,le=1.4,b=class b extends ne{constructor(e){super(e,"angle");m(this,"_visuals",new Map);m(this,"_temp",{clickCount:0,angle:new B});m(this,"modes",["free"]);m(this,"_mode","free");m(this,"create",async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e!=null&&e.point))return;const t=e.point;this._temp.clickCount===0?(this._temp.angle.start.copy(t),this._temp.clickCount=1,this.initFirstPreview(t)):this._temp.clickCount===1?(this._temp.angle.vertex.copy(t),this._temp.clickCount=2,this.upgradeToAnglePreview(t)):this._temp.clickCount===2&&(this._temp.angle.end.copy(t),this.endCreation())});m(this,"endCreation",()=>{this.enabled&&this._temp.clickCount===2&&(this.disposeAllPreview(),this.list.add(this._temp.angle.clone()),this._temp.clickCount=0,this._temp.angle=new B)});m(this,"cancelCreation",()=>{this.disposeAllPreview(),this._temp.clickCount=0,this._temp.angle=new B});m(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=[];for(const[,a]of this._visuals)e.push(a.boundingBox);const n=this.components.get(W).get(this.world).castRayToObjects(e);if(n){for(const[a,d]of this._visuals)if(d.boundingBox===n.object){this.list.delete(a);break}}});e.add(b.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.list.onItemAdded.add(e=>{const t=this.createAngleVisual(e);this._visuals.set(e,t)}),this.list.onBeforeDelete.add(e=>{const t=this._visuals.get(e);t&&(this.disposeVisual(t),this._visuals.delete(e))}),this.list.onCleared.add(()=>{for(const[,e]of this._visuals)this.disposeVisual(e);this._visuals.clear()}),this.onStateChanged.add(e=>{if(e.includes("color")){const t=`#${this.linesMaterial.color.getHexString()}`;for(const[,o]of this._visuals){o.label.three.element.style.backgroundColor=t;for(const n of o.endpoints)n.three.element.style.border=`2px solid ${t}`}}if(e.includes("units")||e.includes("rounding"))for(const[t,o]of this._visuals)o.label.three.element.textContent=this.formatAngle(t)}),this.onPointerMove.add(()=>this.updatePreview()),this.onVisibilityChange.add(e=>{for(const[,t]of this._visuals){t.group.visible=e,t.label.visible=e;for(const o of t.endpoints)o.visible=e}})}dispose(){for(const[,e]of this._visuals)this.disposeVisual(e);this._visuals.clear(),this.disposeAllPreview(),super.dispose()}initFirstPreview(e){if(!this.world)return;const t=new F;t.renderOrder=2;const o=new y().setFromPoints([e,e]),n=new S(o,this.linesMaterial);t.add(n);const a=this.createEndpointMark(t,e);this.world.scene.three.add(t),this._temp.previewGroup=t,this._temp.previewLine=n,this._temp.previewEndpoint=a}upgradeToAnglePreview(e){this.world&&(this.disposeFirstPreview(),this._temp.visual=this.createAngleVisual(this._temp.angle))}updatePreview(){if(!this.world)return;const e=this.lastPick;if(!(e!=null&&e.point))return;const t=e.point;if(this._temp.clickCount===1&&this._temp.previewLine){const o=this._temp.previewLine.geometry.attributes.position;o.setXYZ(1,t.x,t.y,t.z),o.needsUpdate=!0}else this._temp.clickCount===2&&this._temp.visual&&(this._temp.angle.end.copy(t),this.updateAngleVisual(this._temp.visual,this._temp.angle))}disposeFirstPreview(){this._temp.previewEndpoint&&(this._temp.previewEndpoint.dispose(),this._temp.previewEndpoint=void 0),this._temp.previewLine&&(this._temp.previewLine.geometry.dispose(),this._temp.previewLine=void 0),this._temp.previewGroup&&(this._temp.previewGroup.removeFromParent(),this._temp.previewGroup=void 0)}disposeAllPreview(){this.disposeFirstPreview(),this._temp.visual&&(this.disposeVisual(this._temp.visual),this._temp.visual=void 0)}createAngleVisual(e){if(!this.world)throw new Error("AngleMeasurement: world is needed!");const t=new F;t.renderOrder=2;const o=this.linesMaterial,n=`#${o.color.getHexString()}`,a=new y().setFromPoints([e.vertex,e.start]),d=new S(a,o),w=new y().setFromPoints([e.vertex,e.end]),p=new S(w,o),g=b.createArcGeometry(e.vertex,e.start,e.end),_=new S(g,o);t.add(d,p,_);const A=[this.createEndpointMark(t,e.start,n),this.createEndpointMark(t,e.vertex,n),this.createEndpointMark(t,e.end,n)],c=re();c.textContent=this.formatAngle(e),c.style.backgroundColor=n;const u=new z(this.world,c,t);u.three.renderOrder=1;const C=b.getArcMidpoint(e.vertex,e.start,e.end);u.three.position.copy(C);const P=this.createBoundingBox(e);return P.visible=!1,t.add(P),this.world.scene.three.add(t),{group:t,line1:d,line2:p,arc:_,label:u,endpoints:A,boundingBox:P}}updateAngleVisual(e,t){const o=e.line1.geometry.attributes.position;o.setXYZ(0,t.vertex.x,t.vertex.y,t.vertex.z),o.setXYZ(1,t.start.x,t.start.y,t.start.z),o.needsUpdate=!0;const n=e.line2.geometry.attributes.position;n.setXYZ(0,t.vertex.x,t.vertex.y,t.vertex.z),n.setXYZ(1,t.end.x,t.end.y,t.end.z),n.needsUpdate=!0,e.arc.geometry.dispose(),e.arc.geometry=b.createArcGeometry(t.vertex,t.start,t.end),e.endpoints[0].three.position.copy(t.start),e.endpoints[1].three.position.copy(t.vertex),e.endpoints[2].three.position.copy(t.end),e.label.three.element.textContent=this.formatAngle(t);const a=b.getArcMidpoint(t.vertex,t.start,t.end);e.label.three.position.copy(a),this.updateBoundingBox(e.boundingBox,t)}disposeVisual(e){e.label.dispose();for(const t of e.endpoints)t.dispose();e.line1.geometry.dispose(),e.line2.geometry.dispose(),e.arc.geometry.dispose(),e.boundingBox.geometry.dispose(),e.boundingBox.material.dispose(),e.group.removeFromParent()}createEndpointMark(e,t,o){if(!this.world)throw new Error("AngleMeasurement: world is needed!");const n=ae({border:`2px solid ${o??`#${this.linesMaterial.color.getHexString()}`}`}),a=new z(this.world,n,e);return a.three.position.copy(t),a}formatAngle(e){return`${e.value.toFixed(this.rounding)}${this.units==="deg"?"°":" rad"}`}createBoundingBox(e){const t=new h().add(e.start).add(e.vertex).add(e.end).divideScalar(3),o=Math.max(e.vertex.distanceTo(e.start),e.vertex.distanceTo(e.end),.5),n=new q(new X(o*.5),new Y({visible:!1}));return n.position.copy(t),n}updateBoundingBox(e,t){const o=new h().add(t.start).add(t.vertex).add(t.end).divideScalar(3);e.position.copy(o)}static createArcGeometry(e,t,o){const n=new h().subVectors(t,e),a=new h().subVectors(o,e),d=n.length(),w=a.length();if(d===0||w===0)return new y;const p=n.clone().normalize(),g=a.clone().normalize(),_=Math.min(d,w)*T,A=p.angleTo(g),c=new h().crossVectors(p,g);if(c.lengthSq()<1e-10)return new y;c.normalize();const u=[];for(let C=0;C<=O;C++){const P=C/O,U=p.clone().applyAxisAngle(c,P*A);u.push(e.clone().add(U.multiplyScalar(_)))}return new y().setFromPoints(u)}static getArcMidpoint(e,t,o){const n=new h().subVectors(t,e),a=new h().subVectors(o,e),d=n.length(),w=a.length();if(d===0||w===0)return e.clone();const p=n.clone().normalize(),g=a.clone().normalize(),_=Math.min(d,w)*T,A=p.angleTo(g),c=new h().crossVectors(p,g);if(c.lengthSq()<1e-10)return e.clone();c.normalize();const u=p.clone().applyAxisAngle(c,A/2);return e.clone().add(u.multiplyScalar(_*le))}};m(b,"uuid","2c88a142-2378-422e-b26a-bb2710841813");let L=b;const f=new J,ce=f.get(K),l=ce.create();l.scene=new Q(f);l.scene.setup();l.scene.three.background=null;const R=document.getElementById("container");l.renderer=new oe(f,R);l.camera=new ee(f);await l.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);f.init();const v=f.get(te);v.init(ie);l.camera.controls.addEventListener("update",()=>v.core.update());l.onCameraChanged.add(s=>{for(const[,i]of v.list)i.useCamera(s.three);v.core.update(!0)});v.list.onItemSet.add(({value:s})=>{s.useCamera(l.camera.three),l.scene.three.add(s.object),v.core.update(!0)});v.core.models.materials.list.onItemSet.add(({value:s})=>{"isLodMaterial"in s&&s.isLodMaterial||(s.polygonOffset=!0,s.polygonOffsetUnits=1,s.polygonOffsetFactor=Math.random())});const de=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(de.map(async s=>{var o;const i=(o=s.split("/").pop())==null?void 0:o.split(".").shift();if(!i)return null;const t=await(await fetch(s)).arrayBuffer();return v.core.load(t,{modelId:i})}));const r=f.get(L);r.world=l;r.color=new I("#494cb6");r.enabled=!0;r.snappings=[x.POINT];R.ondblclick=()=>r.create();const pe=()=>{r.list.clear()},me=()=>{const s=[];for(const i of r.list)s.push(i.value);return s};window.onkeydown=s=>{(s.code==="Delete"||s.code==="Backspace")&&r.delete()};Z.init();const G=f.get(se).get(),V=s=>{var i;return((i=r.snappings)==null?void 0:i.includes(s))??!1},E=(s,i)=>{const e=new Set(r.snappings??[]);i?e.add(s):e.delete(s),r.snappings=Array.from(e)},ue=()=>$`
  <bim-checkbox label="Snap: Point" ?checked=${V(x.POINT)}
    @change="${({target:s})=>E(x.POINT,s.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${V(x.LINE)}
    @change="${({target:s})=>E(x.LINE,s.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${V(x.FACE)}
    @change="${({target:s})=>E(x.FACE,s.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${G.maxDistance}" min="0.05" max="5"
    @change="${({target:s})=>{G.maxDistance=s.value}}">
  </bim-number-input>
`,M=D.create(()=>{const s=()=>{const i=me();console.log(i)};return $`
    <bim-panel active label="Angle Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create angle: Double click 3 points</bim-label>
          <bim-label>Delete measurement: Delete</bim-label>
      </bim-panel-section>

      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled"
          @change="${({target:i})=>{r.enabled=i.value}}">
        </bim-checkbox>
        <bim-checkbox checked label="Measurements Visible"
          @change="${({target:i})=>{r.visible=i.value}}">
        </bim-checkbox>

<bim-number-input
          slider step="1" label="Picker Size" value="${r.pickerSize}" min="2" max="20"
          @change="${({target:i})=>{r.pickerSize=i.value}}">
        </bim-number-input>

        <bim-color-input
          label="Color" color=#${r.linesMaterial.color.getHexString()}
          @input="${({target:i})=>{r.color=new I(i.color)}}">
        </bim-color-input>

        ${ue()}

        <bim-dropdown
          label="Units" required
          @change="${({target:i})=>{const[e]=i.value;r.units=e}}">
          ${r.unitsList.map(i=>$`<bim-option label=${i} value=${i} ?checked=${i===r.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Precision" required
          @change="${({target:i})=>{const[e]=i.value;r.rounding=e}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Delete all" @click=${()=>pe()}></bim-button>

        <bim-button label="Log Values" @click=${s}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(M);const he=D.create(()=>$`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{M.classList.contains("options-menu-visible")?M.classList.remove("options-menu-visible"):M.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(he);const k=new j;k.showPanel(2);document.body.append(k.dom);k.dom.style.left="0px";k.dom.style.zIndex="unset";l.renderer.onBeforeUpdate.add(()=>k.begin());l.renderer.onAfterUpdate.add(()=>k.end());
