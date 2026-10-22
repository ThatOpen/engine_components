import{G as M,ay as I,ko as G,kp as S,B as H,u as U,V as p,M as q,H as N,r as W,C as z,bw as f,K as j,n as T,b as y,S as K}from"./TransformControls-Cj7TVMGg.js";import{R as X,M as $,c as Y,W as Z,S as J,O as Q,F as ee,a6 as te}from"./graphic-vertex-picker-j9h-4x5w.js";import{w as ie}from"./worker-kCPUG8rI.js";import{P as se}from"./index-DCDEpjw-.js";import{M as ne,A as C,n as oe,a as re,b as B}from"./index-3oG9WXOg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-XE3BY6F0.js";import"./renderer-with-2d-CoXYxj2B.js";const V=32,E=.3,ae=1.4;class v extends ne{static uuid="2c88a142-2378-422e-b26a-bb2710841813";_visuals=new Map;_temp={clickCount:0,angle:new C};modes=["free"];_mode="free";get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),this.onStateChanged.trigger(["mode"])}constructor(e){super(e,"angle"),e.add(v.uuid,this),this.initHandlers()}initHandlers(){this.list.onItemAdded.add(e=>{e.units=this.units,e.rounding=this.rounding;const t=this.createAngleVisual(e);this._visuals.set(e,t)}),this.list.onBeforeDelete.add(e=>{const t=this._visuals.get(e);t&&(this.disposeVisual(t),this._visuals.delete(e))}),this.list.onCleared.add(()=>{for(const[,e]of this._visuals)this.disposeVisual(e);this._visuals.clear()}),this.onStateChanged.add(e=>{if(e.includes("color")){const t=`#${this.linesMaterial.color.getHexString()}`;for(const[,i]of this._visuals){i.label.three.element.style.backgroundColor=t;for(const n of i.endpoints)n.three.element.style.border=`2px solid ${t}`}}if(e.includes("units")||e.includes("rounding")){for(const[t,i]of this._visuals)i.label.three.element.textContent=this.formatAngle(t);this._temp.angle.units=this.units,this._temp.angle.rounding=this.rounding,this._temp.visual&&(this._temp.visual.label.three.element.textContent=this.formatAngle(this._temp.angle))}if(e.includes("lineType"))for(const[t,i]of this._visuals)this.disposeVisual(i),this._visuals.set(t,this.createAngleVisual(t))}),this.onPointerMove.add(()=>this.updatePreview()),this.onVisibilityChange.add(e=>{for(const[,t]of this._visuals){t.group.visible=e,t.label.visible=e;for(const i of t.endpoints)i.visible=e}})}create=async()=>{if(!this.enabled)return;const e=await this._vertexPicker.get({snappingClasses:this.snappings});if(!e?.point)return;const t=e.point;this._temp.clickCount===0?(this._temp.angle.units=this.units,this._temp.angle.rounding=this.rounding,this._temp.angle.start.copy(t),this._temp.clickCount=1,this.initFirstPreview(t)):this._temp.clickCount===1?(this._temp.angle.vertex.copy(t),this._temp.clickCount=2,this.upgradeToAnglePreview(t)):this._temp.clickCount===2&&(this._temp.angle.end.copy(t),this.endCreation())};endCreation=()=>{this.enabled&&this._temp.clickCount===2&&(this.disposeAllPreview(),this.list.add(this._temp.angle.clone()),this._temp.clickCount=0,this._temp.angle=new C)};cancelCreation=()=>{this.disposeAllPreview(),this._temp.clickCount=0,this._temp.angle=new C};delete=()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=[];for(const[,r]of this._visuals)e.push(r.boundingBox);const n=this.components.get(X).get(this.world).castRayToObjects(e);if(n){for(const[r,a]of this._visuals)if(a.boundingBox===n.object){this.list.delete(r);break}}};dispose(){for(const[,e]of this._visuals)this.disposeVisual(e);this._visuals.clear(),this.disposeAllPreview(),super.dispose()}initFirstPreview(e){if(!this.world)return;const t=new M;t.renderOrder=2;const i=this.makeLine([e,e]);t.add(i);const n=this.createEndpointMark(t,e);this.world.scene.three.add(t),this._temp.previewGroup=t,this._temp.previewLine=i,this._temp.previewEndpoint=n}upgradeToAnglePreview(e){this.world&&(this.disposeFirstPreview(),this._temp.visual=this.createAngleVisual(this._temp.angle))}updatePreview(){if(!this.world)return;const e=this.lastPick;if(!e?.point)return;const t=e.point;this._temp.clickCount===1&&this._temp.previewLine?this.setLinePoints(this._temp.previewLine,[this._temp.angle.start,t]):this._temp.clickCount===2&&this._temp.visual&&(this._temp.angle.end.copy(t),this.updateAngleVisual(this._temp.visual,this._temp.angle))}disposeFirstPreview(){this._temp.previewEndpoint&&(this._temp.previewEndpoint.dispose(),this._temp.previewEndpoint=void 0),this._temp.previewLine&&(this._temp.previewLine.geometry.dispose(),this._temp.previewLine=void 0),this._temp.previewGroup&&(this._temp.previewGroup.removeFromParent(),this._temp.previewGroup=void 0)}disposeAllPreview(){this.disposeFirstPreview(),this._temp.visual&&(this.disposeVisual(this._temp.visual),this._temp.visual=void 0)}makeLine(e){const t=this.linesMaterial;if(t instanceof I){const n=new G;n.setPositions(e.flatMap(a=>[a.x,a.y,a.z]));const r=new S(n,t);return r.computeLineDistances(),r}const i=new H().setFromPoints(e);return new U(i,t)}setLinePoints(e,t){if(e instanceof S){e.geometry.setPositions(t.flatMap(n=>[n.x,n.y,n.z])),e.computeLineDistances();return}const i=e.geometry.attributes.position;if(i&&i.count===t.length){for(let n=0;n<t.length;n++)i.setXYZ(n,t[n].x,t[n].y,t[n].z);i.needsUpdate=!0}else e.geometry.setFromPoints(t)}createAngleVisual(e){if(!this.world)throw new Error("AngleMeasurement: world is needed!");const t=new M;t.renderOrder=2;const i=`#${this.linesMaterial.color.getHexString()}`,n=this.makeLine([e.vertex,e.start]),r=this.makeLine([e.vertex,e.end]),a=this.makeLine(v.getArcPoints(e.vertex,e.start,e.end));t.add(n,r,a);const h=[this.createEndpointMark(t,e.start,i),this.createEndpointMark(t,e.vertex,i),this.createEndpointMark(t,e.end,i)],c=oe();c.textContent=this.formatAngle(e),c.style.backgroundColor=i;const d=new $(this.world,c,t);d.three.renderOrder=1;const _=v.getArcMidpoint(e.vertex,e.start,e.end);d.three.position.copy(_);const b=this.createBoundingBox(e);return b.visible=!1,t.add(b),this.world.scene.three.add(t),{group:t,line1:n,line2:r,arc:a,label:d,endpoints:h,boundingBox:b}}updateAngleVisual(e,t){this.setLinePoints(e.line1,[t.vertex,t.start]),this.setLinePoints(e.line2,[t.vertex,t.end]),this.setLinePoints(e.arc,v.getArcPoints(t.vertex,t.start,t.end)),e.endpoints[0].three.position.copy(t.start),e.endpoints[1].three.position.copy(t.vertex),e.endpoints[2].three.position.copy(t.end),e.label.three.element.textContent=this.formatAngle(t);const i=v.getArcMidpoint(t.vertex,t.start,t.end);e.label.three.position.copy(i),this.updateBoundingBox(e.boundingBox,t)}disposeVisual(e){e.label.dispose();for(const t of e.endpoints)t.dispose();e.line1.geometry.dispose(),e.line2.geometry.dispose(),e.arc.geometry.dispose(),e.boundingBox.geometry.dispose(),e.boundingBox.material.dispose(),e.group.removeFromParent()}createEndpointMark(e,t,i){if(!this.world)throw new Error("AngleMeasurement: world is needed!");const n=re({border:`2px solid ${i??`#${this.linesMaterial.color.getHexString()}`}`}),r=new $(this.world,n,e);return r.three.position.copy(t),r}formatAngle(e){return`${e.value.toFixed(this.rounding)}${this.units==="deg"?"°":" rad"}`}createBoundingBox(e){const t=new p().add(e.start).add(e.vertex).add(e.end).divideScalar(3),i=Math.max(e.vertex.distanceTo(e.start),e.vertex.distanceTo(e.end),.5),n=new q(new N(i*.5),new W({visible:!1}));return n.position.copy(t),n}updateBoundingBox(e,t){const i=new p().add(t.start).add(t.vertex).add(t.end).divideScalar(3);e.position.copy(i)}static getArcPoints(e,t,i){const n=new p().subVectors(t,e),r=new p().subVectors(i,e),a=n.length(),h=r.length();if(a===0||h===0)return[];const c=n.clone().normalize(),d=r.clone().normalize(),_=Math.min(a,h)*E,b=c.angleTo(d),g=new p().crossVectors(c,d);if(g.lengthSq()<1e-10)return[];g.normalize();const k=[];for(let A=0;A<=V;A++){const R=A/V,D=c.clone().applyAxisAngle(g,R*b);k.push(e.clone().add(D.multiplyScalar(_)))}return k}static getArcMidpoint(e,t,i){const n=new p().subVectors(t,e),r=new p().subVectors(i,e),a=n.length(),h=r.length();if(a===0||h===0)return e.clone();const c=n.clone().normalize(),d=r.clone().normalize(),_=Math.min(a,h)*E,b=c.angleTo(d),g=new p().crossVectors(c,d);if(g.lengthSq()<1e-10)return e.clone();g.normalize();const k=c.clone().applyAxisAngle(g,b/2);return e.clone().add(k.multiplyScalar(_*ae))}}const m=new Y,le=m.get(Z),l=le.create();l.scene=new J(m);l.scene.setup();l.scene.three.background=null;const O=document.getElementById("container");l.renderer=new se(m,O);l.camera=new Q(m);await l.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);m.init();const u=m.get(ee);u.init(ie);l.camera.controls.addEventListener("update",()=>u.core.update());l.onCameraChanged.add(s=>{for(const[,e]of u.list)e.useCamera(s.three);u.core.update(!0)});u.list.onItemSet.add(({value:s})=>{s.useCamera(l.camera.three),l.scene.three.add(s.object),u.core.update(!0)});u.core.models.materials.list.onItemSet.add(({value:s})=>{"isLodMaterial"in s&&s.isLodMaterial||(s.polygonOffset=!0,s.polygonOffsetUnits=1,s.polygonOffsetFactor=Math.random())});const ce=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(ce.map(async s=>{const e=s.split("/").pop()?.split(".").shift();if(!e)return null;const i=await(await fetch(s)).arrayBuffer();return u.core.load(i,{modelId:e})}));const o=m.get(v);o.world=l;o.color=new z("#494cb6");o.enabled=!0;o.snappings=[f.POINT];O.ondblclick=()=>o.create();const de=()=>{o.list.clear()},pe=()=>{const s=[];for(const e of o.list)s.push(e.value);return s};window.onkeydown=s=>{(s.code==="Delete"||s.code==="Backspace")&&o.delete()};j.init();const F=m.get(te).get(),P=s=>o.snappings?.includes(s)??!1,L=(s,e)=>{const t=new Set(o.snappings??[]);e?t.add(s):t.delete(s),o.snappings=Array.from(t)},ue=()=>y`
  <bim-checkbox label="Snap: Point" ?checked=${P(f.POINT)}
    @change="${({target:s})=>L(f.POINT,s.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${P(f.LINE)}
    @change="${({target:s})=>L(f.LINE,s.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${P(f.FACE)}
    @change="${({target:s})=>L(f.FACE,s.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${F.maxDistance}" min="0.05" max="5"
    @change="${({target:s})=>{F.maxDistance=s.value}}">
  </bim-number-input>
`,x=T.create(()=>{const s=()=>{const e=pe();console.log(e)};return y`
    <bim-panel active label="Angle Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create angle: Double click 3 points</bim-label>
          <bim-label>Delete measurement: Delete</bim-label>
      </bim-panel-section>

      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled"
          @change="${({target:e})=>{o.enabled=e.value}}">
        </bim-checkbox>
        <bim-checkbox checked label="Measurements Visible"
          @change="${({target:e})=>{o.visible=e.value}}">
        </bim-checkbox>

<bim-number-input
          slider step="1" label="Picker Size" value="${o.pickerSize}" min="2" max="20"
          @change="${({target:e})=>{o.pickerSize=e.value}}">
        </bim-number-input>

        <bim-color-input
          label="Color" color=#${o.linesMaterial.color.getHexString()}
          @input="${({target:e})=>{o.color=new z(e.color)}}">
        </bim-color-input>

        ${ue()}

        <bim-dropdown
          label="Units" required
          @change="${({target:e})=>{const[t]=e.value;o.units=t}}">
          ${o.unitsList.map(e=>y`<bim-option label=${e} value=${e} ?checked=${e===o.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown
          label="Precision" required
          @change="${({target:e})=>{const[t]=e.value;o.rounding=t}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-dropdown
          label="Line type" required
          @change="${({target:e})=>{o.lineType=e.value[0]}}">
          <bim-option label="Basic" value="${B.Basic}" checked></bim-option>
          <bim-option label="Fat" value="${B.Fat}"></bim-option>
        </bim-dropdown>

        <bim-number-input
          slider label="Line width" value="${o.lineWidth}"
          min="1" max="10" step="0.5"
          @change="${({target:e})=>{o.lineWidth=e.value}}">
        </bim-number-input>

        <bim-button label="Delete all" @click=${()=>de()}></bim-button>

        <bim-button label="Log Values" @click=${s}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(x);const me=T.create(()=>y`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{x.classList.contains("options-menu-visible")?x.classList.remove("options-menu-visible"):x.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(me);const w=new K;w.showPanel(2);document.body.append(w.dom);w.dom.style.left="0px";w.dom.style.zIndex="unset";l.renderer.onBeforeUpdate.add(()=>w.begin());l.renderer.onAfterUpdate.add(()=>w.end());
