import{a as x,M as f,B as w,h as k}from"./index-D7EC26VF.js";import{C as O,W as S,S as M,O as L,d as C,F as E}from"./graphic-vertex-picker-C_xseSgk.js";import{a as y,R as h,m as g}from"./index-bERBRksd.js";import{P as R,a as u}from"./index-WsJUHyIb.js";import{O as D}from"./index-BXQwErj3.js";import"./index-BEyww2em.js";const s=new O,I=s.get(S),a=I.create();a.scene=new M(s);a.scene.setup();a.scene.three.background=null;const F=document.getElementById("container");a.renderer=new R(s,F);a.camera=new L(s);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const G=s.get(C),A=G.create(a);A.config.color.set(6710886);a.scene.three.background=null;const j="https://thatopen.github.io/engine_fragment/resources/worker.mjs",B=await fetch(j),W=await B.blob(),_=new File([W],"worker.mjs",{type:"text/javascript"}),U=URL.createObjectURL(_),l=s.get(E);l.init(U);a.camera.controls.addEventListener("rest",()=>l.core.update(!0));a.onCameraChanged.add(e=>{for(const[,r]of l.list)r.useCamera(e.three);l.core.update(!0)});l.list.onItemSet.add(({value:e})=>{e.useCamera(a.camera.three),a.scene.three.add(e.object),l.core.update(!0)});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(H.map(async e=>{var p;const r=(p=e.split("/").pop())==null?void 0:p.split(".").shift();if(!r)return null;const P=await(await fetch(e)).arrayBuffer();return l.core.load(P,{modelId:r})}));a.renderer.postproduction.enabled=!0;a.dynamicAnchor=!1;l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial&&a.renderer.postproduction.basePass.isolatedMaterials.push(e)});const v=l.list.values().next().value,$=s.get(D);$.world=a;const N=await v.getItemsOfCategories([/IFCWALL/]),q=N.IFCWALL,[T,z]=q;$.addItems({[v.modelId]:new Set([T,z])});const c=new x;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>c.begin());a.renderer.onAfterUpdate.add(()=>c.end());y.init();const{aoPass:i,outlinePass:o,edgesPass:b}=a.renderer.postproduction,t={radius:.25,distanceExponent:1,thickness:1,scale:1,samples:16,distanceFallOff:1,screenSpaceRadius:!0},n={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};i.updateGtaoMaterial(t);i.updatePdMaterial(n);const m=new f(new w(1,1,1),new k({color:65280}));m.position.set(10,0,0);a.scene.three.add(m);a.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(m.material);const d=h.create(()=>g`
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
    `);document.body.append(d);const J=h.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
