import{b as x,a as f,M as w,B as k,i as O,R as h,m as g}from"./index-CZukAoYd.js";import{C as S,W as M,S as C,O as E,d as L,F as y}from"./graphic-vertex-picker-DJhsmSZm.js";import{P as R,a as u}from"./index-DaXsRl3f.js";import{O as D}from"./index-6dbdwACP.js";import"./index-CV_r3Qsl.js";const s=new S,I=s.get(M),a=I.create();a.scene=new C(s);a.scene.setup();a.scene.three.background=null;const G=document.getElementById("container");a.renderer=new R(s,G);a.camera=new E(s);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const A=s.get(L),F=A.create(a);F.config.color.set(6710886);a.scene.three.background=null;const W="https://thatopen.github.io/engine_fragment/resources/worker.mjs",l=s.get(y);l.init(W);a.camera.controls.addEventListener("rest",()=>l.core.update(!0));a.onCameraChanged.add(e=>{for(const[,r]of l.list)r.useCamera(e.three);l.core.update(!0)});l.list.onItemSet.add(({value:e})=>{e.useCamera(a.camera.three),a.scene.three.add(e.object),l.core.update(!0)});const _=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(_.map(async e=>{var p;const r=(p=e.split("/").pop())==null?void 0:p.split(".").shift();if(!r)return null;const P=await(await fetch(e)).arrayBuffer();return l.core.load(P,{modelId:r})}));a.renderer.postproduction.enabled=!0;a.dynamicAnchor=!1;l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial&&a.renderer.postproduction.basePass.isolatedMaterials.push(e)});const v=l.list.values().next().value,$=s.get(D);$.world=a;const B=await v.getItemsOfCategories([/IFCWALL/]),j=B.IFCWALL,[H,N]=j;$.addItems({[v.modelId]:new Set([H,N])});const c=new x;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>c.begin());a.renderer.onAfterUpdate.add(()=>c.end());f.init();const{aoPass:i,outlinePass:o,edgesPass:b}=a.renderer.postproduction,n={radius:.25,distanceExponent:1,thickness:1,scale:1,samples:16,distanceFallOff:1,screenSpaceRadius:!0},t={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};i.updateGtaoMaterial(n);i.updatePdMaterial(t);const m=new w(new k(1,1,1),new O({color:65280}));m.position.set(10,0,0);a.scene.three.add(m);a.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(m.material);const d=h.create(()=>g`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">

    <bim-panel-section label="General">

      <bim-checkbox checked label="Postproduction enabled"
        @change="${({target:e})=>{a.renderer.postproduction.enabled=e.value}}">
      </bim-checkbox>

      <bim-checkbox checked label="Outlines enabled"
        ?checked=${a.renderer.postproduction.outlinesEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.outlinesEnabled=e.value}}">
      </bim-checkbox>

      <bim-checkbox checked label="Excluded objects enabled"
        ?checked=${a.renderer.postproduction.excludedObjectsEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.excludedObjectsEnabled=e.value}}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction style"
        @change="${({target:e})=>{const r=e.value[0];a.renderer.postproduction.style=r}}">

        <bim-option checked label="Basic" value="${u.COLOR}"></bim-option>
        <bim-option label="Pen" value="${u.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${u.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${u.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${u.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${u.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

      <bim-panel-section label="Edges">

      <bim-number-input
          slider step="0.1" label="Width"
          value="${a.renderer.postproduction.edgesPass.width}" min="1" max="3"
          @change="${({target:e})=>{a.renderer.postproduction.edgesPass.width=e.value}}">
      </bim-number-input>

      <bim-color-input label="Edges color"
        color="#${b.color.getHexString()}"
        @input="${({target:e})=>{b.color.set(e.value.color)}}">
      </bim-color-input>

    </bim-panel-section>

    <bim-panel-section label="Outline">

      <bim-number-input
          slider step="0.1" label="Outline thickness"
          value="${o.thickness}" min="1" max="10"
          @change="${({target:e})=>{o.thickness=e.value}}">
      </bim-number-input>

      <bim-number-input
          slider step="0.01" label="Fill opacity"
          value="${o.fillOpacity}" min="0" max="1"
          @change="${({target:e})=>{o.fillOpacity=e.value}}">
      </bim-number-input>

      <bim-color-input label="Line color"
        color="#${o.outlineColor.getHexString()}"
        @input="${({target:e})=>{o.outlineColor.set(e.value.color)}}">
      </bim-color-input>

      <bim-color-input label="Fill color"
        color="#${o.fillColor.getHexString()}"
        @input="${({target:e})=>{o.fillColor.set(e.value.color)}}">
      </bim-color-input>

    </bim-panel-section>

    <bim-panel-section label="Ambient Occlusion">

        <bim-checkbox checked label="Screen Space Radius"
          ?checked=${n.screenSpaceRadius}
          @change="${({target:e})=>{n.screenSpaceRadius=e.value,i.updateGtaoMaterial(n)}}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${i.blendIntensity}" min="0" max="1"
          @change="${({target:e})=>{i.blendIntensity=e.value}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${n.radius}" min="0.01" max="1"
          @change="${({target:e})=>{n.radius=e.value,i.updateGtaoMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${n.distanceExponent}" min="1" max="4"
          @change="${({target:e})=>{n.distanceExponent=e.value,i.updateGtaoMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${n.thickness}" min="0.01" max="10"
          @change="${({target:e})=>{n.thickness=e.value,i.updateGtaoMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${n.distanceFallOff}" min="0" max="1"
          @change="${({target:e})=>{n.distanceFallOff=e.value,i.updateGtaoMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${n.scale}" min="0.01" max="2"
          @change="${({target:e})=>{n.scale=e.value,i.updateGtaoMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${n.samples}" min="2" max="32"
          @change="${({target:e})=>{n.samples=e.value,i.updateGtaoMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${t.lumaPhi}" min="0" max="20"
          @change="${({target:e})=>{t.lumaPhi=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${t.depthPhi}" min="0.01" max="20"
          @change="${({target:e})=>{t.depthPhi=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${t.normalPhi}" min="0.01" max="20"
          @change="${({target:e})=>{t.normalPhi=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${t.radius}" min="0" max="32"
          @change="${({target:e})=>{t.radius=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${t.radiusExponent}" min="0.1" max="4"
          @change="${({target:e})=>{t.radiusExponent=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${t.rings}" min="1" max="16"
          @change="${({target:e})=>{t.rings=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${t.samples}" min="2" max="32"
          @change="${({target:e})=>{t.samples=e.value,i.updatePdMaterial(t)}}">
        </bim-number-input>

      </bim-panel-section>

    </bim-panel>
    `);document.body.append(d);const U=h.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);
