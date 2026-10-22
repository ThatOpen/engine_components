import{S as M,K as E,M as S,aH as w,aI as L,n as v,b as $}from"./TransformControls-Cj7TVMGg.js";import{c as A,W as C,S as y,O as D,G,F as P,g as b}from"./graphic-vertex-picker-j9h-4x5w.js";import{P as R,b as i,E as g}from"./index-DCDEpjw-.js";import{O as F}from"./index-DzvqS1FY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-XE3BY6F0.js";import"./renderer-with-2d-CoXYxj2B.js";import"./index-BpgOAmhZ.js";const d=new A,I=d.get(C),n=I.create();n.scene=new y(d);n.scene.setup();n.scene.three.background=null;const N=document.getElementById("container");n.renderer=new R(d,N);n.camera=new D(d);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const W=d.get(G),x=W.create(n);x.config.color.set(6710886);n.scene.three.background=null;const a=()=>{n.renderer.mode===b.MANUAL&&(n.renderer.needsUpdate=!0)};n.camera.controls.addEventListener("update",a);n.renderer.onResize.add(a);const _=await P.getWorker(),r=d.get(P);r.init(_);n.camera.controls.addEventListener("update",()=>r.core.update());n.onCameraChanged.add(e=>{for(const[,s]of r.list)s.useCamera(e.three);r.core.update(!0)});r.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),r.core.update(!0)});r.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(H.map(async e=>{const s=e.split("/").pop()?.split(".").shift();if(!s)return null;const k=await(await fetch(e)).arrayBuffer();return r.core.load(k,{modelId:s})}));n.renderer.postproduction.enabled=!0;n.dynamicAnchor=!1;n.renderer.postproduction.basePass.isolatedMaterials.push(x.material);const f=r.list.values().next().value,O=d.get(F);O.world=n;const U=await f.getItemsOfCategories([/IFCWALL/]),B=U.IFCWALL,[j,T]=B;O.addItems({[f.modelId]:new Set([j,T])});const m=new M;m.showPanel(2);document.body.append(m.dom);m.dom.style.left="0px";m.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>m.begin());n.renderer.onAfterUpdate.add(()=>m.end());E.init();const{aoPass:l,outlinePass:u,edgesPass:p,defaultAoParameters:o}=n.renderer.postproduction,t={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};l.updateGtaoMaterial(o);l.updatePdMaterial(t);const h=new S(new w(1,1,1),new L({color:65280}));h.position.set(10,0,0);n.scene.three.add(h);n.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(h.material);const c=v.create(()=>$`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">

    <bim-panel-section label="General">

      <bim-checkbox checked label="Postproduction enabled"
        @change="${({target:e})=>{n.renderer.postproduction.enabled=e.value,a()}}">
      </bim-checkbox>

      <bim-checkbox checked label="Outlines enabled"
        ?checked=${n.renderer.postproduction.outlinesEnabled}
        @change="${({target:e})=>{n.renderer.postproduction.outlinesEnabled=e.value,a()}}">
      </bim-checkbox>

      <bim-checkbox checked label="Excluded objects enabled"
        ?checked=${n.renderer.postproduction.excludedObjectsEnabled}
        @change="${({target:e})=>{n.renderer.postproduction.excludedObjectsEnabled=e.value,a()}}">
      </bim-checkbox>

      <bim-checkbox checked label="SMAA enabled"
        ?checked=${n.renderer.postproduction.smaaEnabled}
        @change="${({target:e})=>{n.renderer.postproduction.smaaEnabled=e.value,a()}}">
      </bim-checkbox>

      <bim-checkbox label="MSAA enabled"
        ?checked=${n.renderer.postproduction.msaaEnabled}
        @change="${({target:e})=>{n.renderer.postproduction.msaaEnabled=e.value,a()}}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction style"
        @change="${({target:e})=>{const s=e.value[0];n.renderer.postproduction.style=s,a()}}">

        <bim-option checked label="Basic" value="${i.COLOR}"></bim-option>
        <bim-option label="Pen" value="${i.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${i.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${i.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${i.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${i.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

      <bim-panel-section label="Edges">

      <bim-number-input
          slider step="0.1" label="Width"
          value="${n.renderer.postproduction.edgesPass.width}" min="1" max="3"
          @change="${({target:e})=>{n.renderer.postproduction.edgesPass.width=e.value,a()}}">
      </bim-number-input>

      <bim-color-input label="Edges color"
        color="#${p.color.getHexString()}"
        @input="${({target:e})=>{p.color.set(e.value.color),a()}}">
      </bim-color-input>

      <bim-dropdown label="Edges Mode"
        @change="${({target:e})=>{p.mode=e.value[0],a()}}">
        <bim-option checked label="Default" value="${g.DEFAULT}"></bim-option>
        <bim-option label="Global" value="${g.GLOBAL}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

    <bim-panel-section label="Outline">

      <bim-number-input
          slider step="0.1" label="Outline thickness"
          value="${u.thickness}" min="1" max="10"
          @change="${({target:e})=>{u.thickness=e.value,a()}}">
      </bim-number-input>

      <bim-number-input
          slider step="0.01" label="Fill opacity"
          value="${u.fillOpacity}" min="0" max="1"
          @change="${({target:e})=>{u.fillOpacity=e.value,a()}}">
      </bim-number-input>

      <bim-color-input label="Line color"
        color="#${u.outlineColor.getHexString()}"
        @input="${({target:e})=>{u.outlineColor.set(e.value.color),a()}}">
      </bim-color-input>

      <bim-color-input label="Fill color"
        color="#${u.fillColor.getHexString()}"
        @input="${({target:e})=>{u.fillColor.set(e.value.color),a()}}">
      </bim-color-input>

    </bim-panel-section>

  
    <bim-panel-section label="Gloss">

      <bim-checkbox label="Enabled"
        ?checked=${n.renderer.postproduction.glossEnabled}
        @change="${({target:e})=>{n.renderer.postproduction.glossEnabled=e.value,a()}}">
      </bim-checkbox>

      <bim-number-input
        slider step="0.01" label="Min gloss"
        value="${n.renderer.postproduction.glossPass.minGloss}" min="-1" max="1"
        @change="${({target:e})=>{n.renderer.postproduction.glossPass.minGloss=e.value,a()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Max gloss"
        value="${n.renderer.postproduction.glossPass.maxGloss}" min="-1" max="1"
        @change="${({target:e})=>{n.renderer.postproduction.glossPass.maxGloss=e.value,a()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Gloss exponent"
        value="${n.renderer.postproduction.glossPass.glossExponent}" min="0.1" max="20"
        @change="${({target:e})=>{n.renderer.postproduction.glossPass.glossExponent=e.value,a()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Fresnel exponent"
        value="${n.renderer.postproduction.glossPass.fresnelExponent}" min="0.1" max="50"
        @change="${({target:e})=>{n.renderer.postproduction.glossPass.fresnelExponent=e.value,a()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Gloss factor"
        value="${n.renderer.postproduction.glossPass.glossFactor}" min="0" max="1"
        @change="${({target:e})=>{n.renderer.postproduction.glossPass.glossFactor=e.value,a()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Fresnel factor"
        value="${n.renderer.postproduction.glossPass.fresnelFactor}" min="0" max="10"
        @change="${({target:e})=>{n.renderer.postproduction.glossPass.fresnelFactor=e.value,a()}}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section label="Manual mode">
      <bim-checkbox label="Enabled"
        ?checked=${n.renderer.mode===b.MANUAL}
        @change="${({target:e})=>{n.renderer.mode=e.value?b.MANUAL:b.AUTO}}">
      </bim-checkbox>

      <bim-number-input label="Delay"
        value="${n.renderer.manualModeDelay}" min="10" max="1000"
        @change="${({target:e})=>{n.renderer.manualModeDelay=e.value,a()}}">
      </bim-number-input>

      <bim-checkbox label="Turn off on manual mode"
        ?checked=${n.renderer.turnOffOnManualMode}
        @change="${({target:e})=>{n.renderer.turnOffOnManualMode=e.value,a()}}">
      </bim-checkbox>

      <bim-dropdown label="Default style"
        @change="${({target:e})=>{const s=e.value[0];n.renderer.manualDefaultStyle=s,a()}}">
        <bim-option label="Basic" value="${i.COLOR}"></bim-option>
        <bim-option label="Pen" value="${i.PEN}"></bim-option>
        <bim-option label="Pen Shadows" value="${i.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${i.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${i.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${i.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>


    </bim-panel-section>

    <bim-panel-section label="Ambient Occlusion">

        <bim-checkbox checked label="Screen Space Radius"
          ?checked=${o.screenSpaceRadius}
          @change="${({target:e})=>{o.screenSpaceRadius=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${l.blendIntensity}" min="0" max="1"
          @change="${({target:e})=>{l.blendIntensity=e.value,a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${o.radius}" min="0.01" max="1"
          @change="${({target:e})=>{o.radius=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${o.distanceExponent}" min="1" max="10"
          @change="${({target:e})=>{o.distanceExponent=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${o.thickness}" min="0.01" max="10"
          @change="${({target:e})=>{o.thickness=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${o.distanceFallOff}" min="0" max="1"
          @change="${({target:e})=>{o.distanceFallOff=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${o.scale}" min="0.01" max="10"
          @change="${({target:e})=>{o.scale=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${o.samples}" min="2" max="32"
          @change="${({target:e})=>{o.samples=e.value,l.updateGtaoMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${t.lumaPhi}" min="0" max="20"
          @change="${({target:e})=>{t.lumaPhi=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${t.depthPhi}" min="0.01" max="20"
          @change="${({target:e})=>{t.depthPhi=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${t.normalPhi}" min="0.01" max="20"
          @change="${({target:e})=>{t.normalPhi=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${t.radius}" min="0" max="32"
          @change="${({target:e})=>{t.radius=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${t.radiusExponent}" min="0.1" max="4"
          @change="${({target:e})=>{t.radiusExponent=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${t.rings}" min="1" max="16"
          @change="${({target:e})=>{t.rings=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${t.samples}" min="2" max="32"
          @change="${({target:e})=>{t.samples=e.value,l.updatePdMaterial(t),a()}}">
        </bim-number-input>

      </bim-panel-section>


    </bim-panel>
    `);document.body.append(c);const q=v.create(()=>$`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(q);
