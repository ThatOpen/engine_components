import{a as f,u as x,M as w,B as O,j as k,V as h,f as g}from"./index-BVinSk0X.js";import{C as M,W as S,S as L,O as y,d as C,F as E}from"./graphic-vertex-picker-DIM7gQA5.js";import{P as I,a as u}from"./index-BLwIRjEQ.js";import{O as D}from"./index-CW0y8L7f.js";import"./index-DTBV6yJD.js";import"./index-uVKS97J8.js";const s=new M,R=s.get(S),a=R.create();a.scene=new L(s);a.scene.setup();a.scene.three.background=null;const G=document.getElementById("container");a.renderer=new I(s,G);a.camera=new y(s);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const A=s.get(C),F=A.create(a);F.config.color.set(6710886);a.scene.three.background=null;const W="/node_modules/@thatopen-platform/fragments-beta/dist/Worker/worker.mjs",l=s.get(E);l.init(W);a.camera.controls.addEventListener("rest",()=>l.core.update(!0));a.onCameraChanged.add(e=>{for(const[,r]of l.list)r.useCamera(e.three);l.core.update(!0)});l.list.onItemSet.add(({value:e})=>{e.useCamera(a.camera.three),a.scene.three.add(e.object),l.core.update(!0)});l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const _=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(_.map(async e=>{var p;const r=(p=e.split("/").pop())==null?void 0:p.split(".").shift();if(!r)return null;const P=await(await fetch(e)).arrayBuffer();return l.core.load(P,{modelId:r})}));a.renderer.postproduction.enabled=!0;a.dynamicAnchor=!1;l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial&&a.renderer.postproduction.basePass.isolatedMaterials.push(e)});const v=l.list.values().next().value,$=s.get(D);$.world=a;const j=await v.getItemsOfCategories([/IFCWALL/]),B=j.IFCWALL,[H,N]=B;$.addItems({[v.modelId]:new Set([H,N])});const d=new f;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>d.begin());a.renderer.onAfterUpdate.add(()=>d.end());x.init();const{aoPass:i,outlinePass:o,edgesPass:b}=a.renderer.postproduction,t={radius:.25,distanceExponent:1,thickness:1,scale:1,samples:16,distanceFallOff:1,screenSpaceRadius:!0},n={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};i.updateGtaoMaterial(t);i.updatePdMaterial(n);const m=new w(new O(1,1,1),new k({color:65280}));m.position.set(10,0,0);a.scene.three.add(m);a.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(m.material);const c=h.create(()=>g`
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
          ?checked=${t.screenSpaceRadius}
          @change="${({target:e})=>{t.screenSpaceRadius=e.value,i.updateGtaoMaterial(t)}}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${i.blendIntensity}" min="0" max="1"
          @change="${({target:e})=>{i.blendIntensity=e.value}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${t.radius}" min="0.01" max="1"
          @change="${({target:e})=>{t.radius=e.value,i.updateGtaoMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${t.distanceExponent}" min="1" max="4"
          @change="${({target:e})=>{t.distanceExponent=e.value,i.updateGtaoMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${t.thickness}" min="0.01" max="10"
          @change="${({target:e})=>{t.thickness=e.value,i.updateGtaoMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${t.distanceFallOff}" min="0" max="1"
          @change="${({target:e})=>{t.distanceFallOff=e.value,i.updateGtaoMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${t.scale}" min="0.01" max="2"
          @change="${({target:e})=>{t.scale=e.value,i.updateGtaoMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${t.samples}" min="2" max="32"
          @change="${({target:e})=>{t.samples=e.value,i.updateGtaoMaterial(t)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${n.lumaPhi}" min="0" max="20"
          @change="${({target:e})=>{n.lumaPhi=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${n.depthPhi}" min="0.01" max="20"
          @change="${({target:e})=>{n.depthPhi=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${n.normalPhi}" min="0.01" max="20"
          @change="${({target:e})=>{n.normalPhi=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${n.radius}" min="0" max="32"
          @change="${({target:e})=>{n.radius=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${n.radiusExponent}" min="0.1" max="4"
          @change="${({target:e})=>{n.radiusExponent=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${n.rings}" min="1" max="16"
          @change="${({target:e})=>{n.rings=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${n.samples}" min="2" max="32"
          @change="${({target:e})=>{n.samples=e.value,i.updatePdMaterial(n)}}">
        </bim-number-input>

      </bim-panel-section>

    </bim-panel>
    `);document.body.append(c);const U=h.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);
