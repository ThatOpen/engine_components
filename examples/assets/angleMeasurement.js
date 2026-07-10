var U=Object.defineProperty;var q=(s,i,e)=>i in s?U(s,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[i]=e;var p=(s,i,e)=>(q(s,typeof i!="symbol"?i+"":i,e),e);import{G as B,B as N,L as W,V as u,M as j,d as X,e as Y,C as D,c as _,p as Z,m as I,a as C,b as J}from"./index-S6p3h9tm.js";import{R as K,b as V,C as Q,W as ee,S as te,O as ie,F as se,a as ne}from"./graphic-vertex-picker-Byv2XlPs.js";import{w as oe}from"./worker-C2DG9TTm.js";import{P as re}from"./index-DXEOSG22.js";import{L as ae}from"./LineSegments2--9zWwnCe.js";import{L as le,a as E}from"./Line2-DeFsBH49.js";import{M as ce,c as L,n as de,d as pe,b as F}from"./index-DpZIcuTh.js";import"./three.tsl-Cqi8bW1b.js";import"./renderer-with-2d-CcxfXmTD.js";const z=32,T=.3,me=1.4,h=class h extends ce{constructor(e){super(e,"angle");p(this,"_visuals",new Map);p(this,"_temp",{clickCount:0,angle:new L});p(this,"modes",["free"]);p(this,"_mode","free");p(this,"create",async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!(e!=null&&e.point))return;const t=e.point;this._temp.clickCount===0?(this._temp.angle.start.copy(t),this._temp.clickCount=1,this.initFirstPreview(t)):this._temp.clickCount===1?(this._temp.angle.vertex.copy(t),this._temp.clickCount=2,this.upgradeToAnglePreview(t)):this._temp.clickCount===2&&(this._temp.angle.end.copy(t),this.endCreation())});p(this,"endCreation",()=>{this.enabled&&this._temp.clickCount===2&&(this.disposeAllPreview(),this.list.add(this._temp.angle.clone()),this._temp.clickCount=0,this._temp.angle=new L)});p(this,"cancelCreation",()=>{this.disposeAllPreview(),this._temp.clickCount=0,this._temp.angle=new L});p(this,"delete",()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=[];for(const[,a]of this._visuals)e.push(a.boundingBox);const o=this.components.get(K).get(this.world).castRayToObjects(e);if(o){for(const[a,l]of this._visuals)if(l.boundingBox===o.object){this.list.delete(a);break}}});e.add(h.uuid,this),this.initHandlers()}get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}initHandlers(){this.list.onItemAdded.add(e=>{const t=this.createAngleVisual(e);this._visuals.set(e,t)}),this.list.onBeforeDelete.add(e=>{const t=this._visuals.get(e);t&&(this.disposeVisual(t),this._visuals.delete(e))}),this.list.onCleared.add(()=>{for(const[,e]of this._visuals)this.disposeVisual(e);this._visuals.clear()}),this.onStateChanged.add(e=>{if(e.includes("color")){const t=`#${this.linesMaterial.color.getHexString()}`;for(const[,n]of this._visuals){n.label.three.element.style.backgroundColor=t;for(const o of n.endpoints)o.three.element.style.border=`2px solid ${t}`}}if(e.includes("units")||e.includes("rounding"))for(const[t,n]of this._visuals)n.label.three.element.textContent=this.formatAngle(t);if(e.includes("lineType"))for(const[t,n]of this._visuals)this.disposeVisual(n),this._visuals.set(t,this.createAngleVisual(t))}),this.onPointerMove.add(()=>this.updatePreview()),this.onVisibilityChange.add(e=>{for(const[,t]of this._visuals){t.group.visible=e,t.label.visible=e;for(const n of t.endpoints)n.visible=e}})}dispose(){for(const[,e]of this._visuals)this.disposeVisual(e);this._visuals.clear(),this.disposeAllPreview(),super.dispose()}initFirstPreview(e){if(!this.world)return;const t=new B;t.renderOrder=2;const n=this.makeLine([e,e]);t.add(n);const o=this.createEndpointMark(t,e);this.world.scene.three.add(t),this._temp.previewGroup=t,this._temp.previewLine=n,this._temp.previewEndpoint=o}upgradeToAnglePreview(e){this.world&&(this.disposeFirstPreview(),this._temp.visual=this.createAngleVisual(this._temp.angle))}updatePreview(){if(!this.world)return;const e=this.lastPick;if(!(e!=null&&e.point))return;const t=e.point;this._temp.clickCount===1&&this._temp.previewLine?this.setLinePoints(this._temp.previewLine,[this._temp.angle.start,t]):this._temp.clickCount===2&&this._temp.visual&&(this._temp.angle.end.copy(t),this.updateAngleVisual(this._temp.visual,this._temp.angle))}disposeFirstPreview(){this._temp.previewEndpoint&&(this._temp.previewEndpoint.dispose(),this._temp.previewEndpoint=void 0),this._temp.previewLine&&(this._temp.previewLine.geometry.dispose(),this._temp.previewLine=void 0),this._temp.previewGroup&&(this._temp.previewGroup.removeFromParent(),this._temp.previewGroup=void 0)}disposeAllPreview(){this.disposeFirstPreview(),this._temp.visual&&(this.disposeVisual(this._temp.visual),this._temp.visual=void 0)}makeLine(e){const t=this.linesMaterial;if(t instanceof ae){const o=new le;o.setPositions(e.flatMap(l=>[l.x,l.y,l.z]));const a=new E(o,t);return a.computeLineDistances(),a}const n=new N().setFromPoints(e);return new W(n,t)}setLinePoints(e,t){if(e instanceof E){e.geometry.setPositions(t.flatMap(o=>[o.x,o.y,o.z])),e.computeLineDistances();return}const n=e.geometry.attributes.position;if(n&&n.count===t.length){for(let o=0;o<t.length;o++)n.setXYZ(o,t[o].x,t[o].y,t[o].z);n.needsUpdate=!0}else e.geometry.setFromPoints(t)}createAngleVisual(e){if(!this.world)throw new Error("AngleMeasurement: world is needed!");const t=new B;t.renderOrder=2;const n=`#${this.linesMaterial.color.getHexString()}`,o=this.makeLine([e.vertex,e.start]),a=this.makeLine([e.vertex,e.end]),l=this.makeLine(h.getArcPoints(e.vertex,e.start,e.end));t.add(o,a,l);const g=[this.createEndpointMark(t,e.start,n),this.createEndpointMark(t,e.vertex,n),this.createEndpointMark(t,e.end,n)],d=de();d.textContent=this.formatAngle(e),d.style.backgroundColor=n;const m=new V(this.world,d,t);m.three.renderOrder=1;const k=h.getArcMidpoint(e.vertex,e.start,e.end);m.three.position.copy(k);const v=this.createBoundingBox(e);return v.visible=!1,t.add(v),this.world.scene.three.add(t),{group:t,line1:o,line2:a,arc:l,label:m,endpoints:g,boundingBox:v}}updateAngleVisual(e,t){this.setLinePoints(e.line1,[t.vertex,t.start]),this.setLinePoints(e.line2,[t.vertex,t.end]),this.setLinePoints(e.arc,h.getArcPoints(t.vertex,t.start,t.end)),e.endpoints[0].three.position.copy(t.start),e.endpoints[1].three.position.copy(t.vertex),e.endpoints[2].three.position.copy(t.end),e.label.three.element.textContent=this.formatAngle(t);const n=h.getArcMidpoint(t.vertex,t.start,t.end);e.label.three.position.copy(n),this.updateBoundingBox(e.boundingBox,t)}disposeVisual(e){e.label.dispose();for(const t of e.endpoints)t.dispose();e.line1.geometry.dispose(),e.line2.geometry.dispose(),e.arc.geometry.dispose(),e.boundingBox.geometry.dispose(),e.boundingBox.material.dispose(),e.group.removeFromParent()}createEndpointMark(e,t,n){if(!this.world)throw new Error("AngleMeasurement: world is needed!");const o=pe({border:`2px solid ${n??`#${this.linesMaterial.color.getHexString()}`}`}),a=new V(this.world,o,e);return a.three.position.copy(t),a}formatAngle(e){return`${e.value.toFixed(this.rounding)}${this.units==="deg"?"°":" rad"}`}createBoundingBox(e){const t=new u().add(e.start).add(e.vertex).add(e.end).divideScalar(3),n=Math.max(e.vertex.distanceTo(e.start),e.vertex.distanceTo(e.end),.5),o=new j(new X(n*.5),new Y({visible:!1}));return o.position.copy(t),o}updateBoundingBox(e,t){const n=new u().add(t.start).add(t.vertex).add(t.end).divideScalar(3);e.position.copy(n)}static getArcPoints(e,t,n){const o=new u().subVectors(t,e),a=new u().subVectors(n,e),l=o.length(),g=a.length();if(l===0||g===0)return[];const d=o.clone().normalize(),m=a.clone().normalize(),k=Math.min(l,g)*T,v=d.angleTo(m),w=new u().crossVectors(d,m);if(w.lengthSq()<1e-10)return[];w.normalize();const y=[];for(let P=0;P<=z;P++){const R=P/z,H=d.clone().applyAxisAngle(w,R*v);y.push(e.clone().add(H.multiplyScalar(k)))}return y}static getArcMidpoint(e,t,n){const o=new u().subVectors(t,e),a=new u().subVectors(n,e),l=o.length(),g=a.length();if(l===0||g===0)return e.clone();const d=o.clone().normalize(),m=a.clone().normalize(),k=Math.min(l,g)*T,v=d.angleTo(m),w=new u().crossVectors(d,m);if(w.lengthSq()<1e-10)return e.clone();w.normalize();const y=d.clone().applyAxisAngle(w,v/2);return e.clone().add(y.multiplyScalar(k*me))}};p(h,"uuid","2c88a142-2378-422e-b26a-bb2710841813");let $=h;const f=new Q,ue=f.get(ee),c=ue.create();c.scene=new te(f);c.scene.setup();c.scene.three.background=null;const G=document.getElementById("container");c.renderer=new re(f,G);c.camera=new ie(f);await c.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);f.init();const b=f.get(se);b.init(oe);c.camera.controls.addEventListener("update",()=>b.core.update());c.onCameraChanged.add(s=>{for(const[,i]of b.list)i.useCamera(s.three);b.core.update(!0)});b.list.onItemSet.add(({value:s})=>{s.useCamera(c.camera.three),c.scene.three.add(s.object),b.core.update(!0)});b.core.models.materials.list.onItemSet.add(({value:s})=>{"isLodMaterial"in s&&s.isLodMaterial||(s.polygonOffset=!0,s.polygonOffsetUnits=1,s.polygonOffsetFactor=Math.random())});const he=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(he.map(async s=>{var n;const i=(n=s.split("/").pop())==null?void 0:n.split(".").shift();if(!i)return null;const t=await(await fetch(s)).arrayBuffer();return b.core.load(t,{modelId:i})}));const r=f.get($);r.world=c;r.color=new D("#494cb6");r.enabled=!0;r.snappings=[_.POINT];G.ondblclick=()=>r.create();const be=()=>{r.list.clear()},fe=()=>{const s=[];for(const i of r.list)s.push(i.value);return s};window.onkeydown=s=>{(s.code==="Delete"||s.code==="Backspace")&&r.delete()};Z.init();const O=f.get(ne).get(),M=s=>{var i;return((i=r.snappings)==null?void 0:i.includes(s))??!1},S=(s,i)=>{const e=new Set(r.snappings??[]);i?e.add(s):e.delete(s),r.snappings=Array.from(e)},ge=()=>C`
  <bim-checkbox label="Snap: Point" ?checked=${M(_.POINT)}
    @change="${({target:s})=>S(_.POINT,s.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${M(_.LINE)}
    @change="${({target:s})=>S(_.LINE,s.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${M(_.FACE)}
    @change="${({target:s})=>S(_.FACE,s.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${O.maxDistance}" min="0.05" max="5"
    @change="${({target:s})=>{O.maxDistance=s.value}}">
  </bim-number-input>
`,A=I.create(()=>{const s=()=>{const i=fe();console.log(i)};return C`
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
          @input="${({target:i})=>{r.color=new D(i.color)}}">
        </bim-color-input>

        ${ge()}

        <bim-dropdown
          label="Units" required
          @change="${({target:i})=>{const[e]=i.value;r.units=e}}">
          ${r.unitsList.map(i=>C`<bim-option label=${i} value=${i} ?checked=${i===r.units}></bim-option>`)}
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

        <bim-dropdown
          label="Line type" required
          @change="${({target:i})=>{r.lineType=i.value[0]}}">
          <bim-option label="Basic" value="${F.Basic}" checked></bim-option>
          <bim-option label="Fat" value="${F.Fat}"></bim-option>
        </bim-dropdown>

        <bim-number-input
          slider label="Line width" value="${r.lineWidth}"
          min="1" max="10" step="0.5"
          @change="${({target:i})=>{r.lineWidth=i.value}}">
        </bim-number-input>

        <bim-button label="Delete all" @click=${()=>be()}></bim-button>

        <bim-button label="Log Values" @click=${s}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(A);const ve=I.create(()=>C`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{A.classList.contains("options-menu-visible")?A.classList.remove("options-menu-visible"):A.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(ve);const x=new J;x.showPanel(2);document.body.append(x.dom);x.dom.style.left="0px";x.dom.style.zIndex="unset";c.renderer.onBeforeUpdate.add(()=>x.begin());c.renderer.onAfterUpdate.add(()=>x.end());
