import{S as N,K as W,M as H,aH as _,aI as I,n as A,b as E}from"./TransformControls-uP1Cexzu.js";import{c as U,W as B,S as T,O as j,G as q,F as C,g as P}from"./graphic-vertex-picker-BijCnCEg.js";import{P as z,b as o,a as O,D as w,E as M}from"./index-B9_sa_qD.js";import{O as K}from"./index-DoEfgNun.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bKcSih7U.js";import"./renderer-with-2d-CrQsY-US.js";import"./index-B8cfUU4g.js";const c=new U,V=c.get(B),a=V.create();a.scene=new T(c);a.scene.setup();a.scene.three.background=null;const X=document.getElementById("container");a.renderer=new z(c,X);a.camera=new j(c);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);c.init();const J=c.get(q),D=J.create(a);D.config.color.set(6710886);a.scene.three.background=null;a.renderer.cssSize=!1;a.renderer.adaptiveResolution=!0;const n=()=>{a.renderer.mode===P.MANUAL&&(a.renderer.needsUpdate=!0)};a.camera.controls.addEventListener("update",n);a.renderer.onResize.add(n);const Q=await C.getWorker(),b=c.get(C);b.init(Q);a.camera.controls.addEventListener("update",()=>b.core.update());a.onCameraChanged.add(e=>{for(const[,s]of b.list)s.useCamera(e.three);b.core.update(!0)});b.list.onItemSet.add(({value:e})=>{e.useCamera(a.camera.three),a.scene.three.add(e.object),b.core.update(!0)});b.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const Y=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(Y.map(async e=>{const s=e.split("/").pop()?.split(".").shift();if(!s)return null;const G=await(await fetch(e)).arrayBuffer();return b.core.load(G,{modelId:s})}));a.renderer.postproduction.enabled=!0;a.renderer.postproduction.style=o.COLOR_PEN_SHADOWS;a.dynamicAnchor=!1;a.renderer.postproduction.basePass.isolatedMaterials.push(D.material);a.renderer.postproduction.deferred;a.renderer.postproduction.mode=O.DEFERRED;const S=b.list.values().next().value,h=c.get(K);h.world=a;h.enabled=!0;const Z=await S.getItemsOfCategories([/IFCWALL/]),ee=Z.IFCWALL,[R,F]=ee;h.addItems({[S.modelId]:new Set([R,F])});let f=!1;const x=new N;x.showPanel(2);document.body.append(x.dom);x.dom.style.left="0px";x.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>x.begin());a.renderer.onAfterUpdate.add(()=>x.end());W.init();const{aoPass:r,outlinePass:p,edgesPass:k,defaultAoParameters:l}=a.renderer.postproduction,t={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};r.updateGtaoMaterial(l);r.updatePdMaterial(t);const y=new H(new _(1,1,1),new I({color:65280}));y.position.set(10,0,0);a.scene.three.add(y);a.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(y.material);const m=a.renderer.postproduction.deferred,d=m.ao.settings,u=m.worldAo.settings,v=m.denoise.settings,i=m.composite.settings,$=A.create(()=>E`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">

    <bim-panel-section label="General">

      <bim-checkbox checked label="Postproduction enabled"
        @change="${({target:e})=>{a.renderer.postproduction.enabled=e.value,n()}}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction mode"
        @change="${({target:e})=>{const s=Number(e.value[0]);a.renderer.postproduction.mode=s,L(s),n()}}">
        <bim-option label="Composer" value="${O.COMPOSER}"></bim-option>
        <bim-option checked label="Deferred" value="${O.DEFERRED}"></bim-option>
      </bim-dropdown>

      <bim-dropdown required label="Projection"
        @change="${async({target:e})=>{const s=e.value[0];await a.camera.projection.set(s);for(const g of b.list.values())g.useCamera(a.camera.three);a.renderer.postproduction.updateCamera(),n()}}">
        <bim-option checked label="Perspective" value="Perspective"></bim-option>
        <bim-option label="Orthographic" value="Orthographic"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Native DPR sizing (sharp, slower)"
        ?checked=${!a.renderer.cssSize}
        @change="${({target:e})=>{a.renderer.cssSize=!e.value,a.renderer.applyPostproductionSize(),n()}}">
      </bim-checkbox>

      <bim-checkbox label="Adaptive resolution (hold target fps)"
        ?checked=${a.renderer.adaptiveResolution}
        @change="${({target:e})=>{a.renderer.adaptiveResolution=e.value,n()}}">
      </bim-checkbox>

      <bim-number-input
        slider step="5" label="Adaptive target fps"
        value="${a.renderer.adaptiveTargetFps}" min="24" max="120"
        @change="${({target:e})=>{a.renderer.adaptiveTargetFps=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Min resolution (never blurrier than this)"
        value="${a.renderer.adaptiveMinScale}" min="0.25" max="1"
        @change="${({target:e})=>{a.renderer.adaptiveMinScale=e.value,n()}}">
      </bim-number-input>

      <bim-button label="${h.enabled?"Outline: ON":"Outline: OFF"}"
        @click="${({target:e})=>{h.enabled=!h.enabled,e.label=h.enabled?"Outline: ON":"Outline: OFF",n()}}">
      </bim-button>

      <bim-button label="Ghost rest (x-ray): OFF"
        @click="${async({target:e})=>{f=!f,f?await S.setGhostItems([R,F],!0):S.clearGhost(),e.label=f?"Ghost rest (x-ray): ON":"Ghost rest (x-ray): OFF",await b.core.update(!0),n()}}">
      </bim-button>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Pipeline">

      <bim-dropdown required label="Visual style"
        @change="${({target:e})=>{a.renderer.postproduction.style=Number(e.value[0]),n()}}">
        <bim-option label="Color" value="${o.COLOR}"></bim-option>
        <bim-option label="Pen" value="${o.PEN}"></bim-option>
        <bim-option label="Pen shadows" value="${o.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color pen" value="${o.COLOR_PEN}"></bim-option>
        <bim-option label="Color shadows" value="${o.COLOR_SHADOWS}"></bim-option>
        <bim-option checked label="Color pen shadows" value="${o.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Ambient occlusion enabled"
        ?checked=${m.settings.aoEnabled}
        @change="${({target:e})=>{m.settings.aoEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-dropdown required label="AO estimator"
        @change="${({target:e})=>{m.settings.aoMode=Number(e.value[0]),n()}}">
        <bim-option checked label="Screen-space" value="${w.SCREEN_SPACE}"></bim-option>
        <bim-option label="World-space" value="${w.WORLD_SPACE}"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Anti-aliasing (FXAA)"
        ?checked=${m.settings.fxaaEnabled}
        @change="${({target:e})=>{m.settings.fxaaEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-checkbox label="Half-resolution AO (faster, softer)"
        ?checked=${m.aoHalfRes}
        @change="${({target:e})=>{m.aoHalfRes=e.value,n()}}">
      </bim-checkbox>

      <bim-checkbox label="Tonal orientation shade"
        ?checked=${i.tonalShadingEnabled}
        @change="${({target:e})=>{i.tonalShadingEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-number-input
        slider step="0.05" label="Render scale"
        value="${m.renderScale}" min="0.25" max="1"
        @change="${({target:e})=>{m.renderScale=e.value,n()}}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Ambient Occlusion">

      <bim-number-input
        slider step="0.05" label="World radius"
        value="${d.radius}" min="0.05" max="4"
        @change="${({target:e})=>{d.radius=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.002" label="Bias"
        value="${d.bias}" min="0" max="0.1"
        @change="${({target:e})=>{d.bias=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Intensity"
        value="${d.intensity}" min="0" max="3"
        @change="${({target:e})=>{d.intensity=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contrast"
        value="${d.contrast}" min="0.25" max="4"
        @change="${({target:e})=>{d.contrast=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Samples"
        value="${d.samples}" min="4" max="32"
        @change="${({target:e})=>{d.samples=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Denoise radius (taps)"
        value="${v.radius}" min="1" max="12"
        @change="${({target:e})=>{v.radius=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Denoise depth sigma"
        value="${v.depthSigma}" min="0.05" max="3"
        @change="${({target:e})=>{v.depthSigma=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Denoise normal sigma"
        value="${v.normalSigma}" min="0.05" max="2"
        @change="${({target:e})=>{v.normalSigma=e.value,n()}}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · World AO">

      <bim-number-input
        slider step="0.05" label="Hemisphere reach"
        value="${u.reach}" min="0.05" max="4"
        @change="${({target:e})=>{u.reach=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.005" label="Probe lift"
        value="${u.lift}" min="0" max="0.2"
        @change="${({target:e})=>{u.lift=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.1" label="Range decay"
        value="${u.decay}" min="0.1" max="6"
        @change="${({target:e})=>{u.decay=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Strength"
        value="${u.power}" min="0" max="3"
        @change="${({target:e})=>{u.power=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contrast"
        value="${u.shape}" min="0.25" max="4"
        @change="${({target:e})=>{u.shape=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Probes"
        value="${u.rays}" min="4" max="32"
        @change="${({target:e})=>{u.rays=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Distance fade start"
        value="${u.vanishStart}" min="0" max="1"
        @change="${({target:e})=>{u.vanishStart=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Distance fade end"
        value="${u.vanishEnd}" min="0" max="1"
        @change="${({target:e})=>{u.vanishEnd=e.value,n()}}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Composite">

      <bim-number-input
        slider step="0.05" label="AO strength"
        value="${i.aoStrength}" min="0" max="3"
        @change="${({target:e})=>{i.aoStrength=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Tonal floor"
        value="${i.tonalFloor}" min="0" max="1"
        @change="${({target:e})=>{i.tonalFloor=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contour strength"
        value="${i.edgeStrength}" min="0" max="1"
        @change="${({target:e})=>{i.edgeStrength=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contour width"
        value="${i.edgeHalfWidth}" min="0.1" max="2.5"
        @change="${({target:e})=>{i.edgeHalfWidth=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contour softness (AA)"
        value="${i.edgeAA}" min="0.1" max="2"
        @change="${({target:e})=>{i.edgeAA=e.value,n()}}">
      </bim-number-input>

      <bim-color-input label="Contour color"
        color="#${i.edgeColor.getHexString()}"
        @input="${({target:e})=>{i.edgeColor.set(e.value.color),n()}}">
      </bim-color-input>

      <bim-number-input
        slider step="0.5" label="Sheen gloss exponent"
        value="${i.glossExp}" min="0.5" max="24"
        @change="${({target:e})=>{i.glossExp=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Sheen gloss factor"
        value="${i.glossFactor}" min="0" max="1"
        @change="${({target:e})=>{i.glossFactor=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.5" label="Fresnel exponent"
        value="${i.fresnelExp}" min="0.5" max="24"
        @change="${({target:e})=>{i.fresnelExp=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Fresnel factor"
        value="${i.fresnelFactor}" min="0" max="1"
        @change="${({target:e})=>{i.fresnelFactor=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Sheen output min"
        value="${i.sheenOutMin}" min="0" max="1"
        @change="${({target:e})=>{i.sheenOutMin=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Sheen output max"
        value="${i.sheenOutMax}" min="0" max="1"
        @change="${({target:e})=>{i.sheenOutMax=e.value,n()}}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="composer-only" label="Composer · General">

      <bim-checkbox checked label="Outlines enabled"
        ?checked=${a.renderer.postproduction.outlinesEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.outlinesEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-checkbox checked label="Excluded objects enabled"
        ?checked=${a.renderer.postproduction.excludedObjectsEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.excludedObjectsEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-checkbox checked label="SMAA enabled"
        ?checked=${a.renderer.postproduction.smaaEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.smaaEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-checkbox label="MSAA enabled"
        ?checked=${a.renderer.postproduction.msaaEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.msaaEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction style"
        @change="${({target:e})=>{const s=e.value[0];a.renderer.postproduction.style=s,n()}}">

        <bim-option label="Basic" value="${o.COLOR}"></bim-option>
        <bim-option label="Pen" value="${o.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${o.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${o.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${o.COLOR_SHADOWS}"></bim-option>
        <bim-option checked label="Color Pen Shadows" value="${o.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

      <bim-panel-section class="composer-only" label="Edges">

      <bim-number-input
          slider step="0.1" label="Width"
          value="${a.renderer.postproduction.edgesPass.width}" min="1" max="3"
          @change="${({target:e})=>{a.renderer.postproduction.edgesPass.width=e.value,n()}}">
      </bim-number-input>

      <bim-color-input label="Edges color"
        color="#${k.color.getHexString()}"
        @input="${({target:e})=>{k.color.set(e.value.color),n()}}">
      </bim-color-input>

      <bim-dropdown label="Edges Mode"
        @change="${({target:e})=>{k.mode=e.value[0],n()}}">
        <bim-option checked label="Default" value="${M.DEFAULT}"></bim-option>
        <bim-option label="Global" value="${M.GLOBAL}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

    <bim-panel-section class="composer-only" label="Outline">

      <bim-number-input
          slider step="0.1" label="Outline thickness"
          value="${p.thickness}" min="1" max="10"
          @change="${({target:e})=>{p.thickness=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
          slider step="0.01" label="Fill opacity"
          value="${p.fillOpacity}" min="0" max="1"
          @change="${({target:e})=>{p.fillOpacity=e.value,n()}}">
      </bim-number-input>

      <bim-color-input label="Line color"
        color="#${p.outlineColor.getHexString()}"
        @input="${({target:e})=>{p.outlineColor.set(e.value.color),n()}}">
      </bim-color-input>

      <bim-color-input label="Fill color"
        color="#${p.fillColor.getHexString()}"
        @input="${({target:e})=>{p.fillColor.set(e.value.color),n()}}">
      </bim-color-input>

    </bim-panel-section>

  
    <bim-panel-section class="composer-only" label="Gloss">

      <bim-checkbox label="Enabled"
        ?checked=${a.renderer.postproduction.glossEnabled}
        @change="${({target:e})=>{a.renderer.postproduction.glossEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-number-input
        slider step="0.01" label="Min gloss"
        value="${a.renderer.postproduction.glossPass.minGloss}" min="-1" max="1"
        @change="${({target:e})=>{a.renderer.postproduction.glossPass.minGloss=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Max gloss"
        value="${a.renderer.postproduction.glossPass.maxGloss}" min="-1" max="1"
        @change="${({target:e})=>{a.renderer.postproduction.glossPass.maxGloss=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Gloss exponent"
        value="${a.renderer.postproduction.glossPass.glossExponent}" min="0.1" max="20"
        @change="${({target:e})=>{a.renderer.postproduction.glossPass.glossExponent=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Fresnel exponent"
        value="${a.renderer.postproduction.glossPass.fresnelExponent}" min="0.1" max="50"
        @change="${({target:e})=>{a.renderer.postproduction.glossPass.fresnelExponent=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Gloss factor"
        value="${a.renderer.postproduction.glossPass.glossFactor}" min="0" max="1"
        @change="${({target:e})=>{a.renderer.postproduction.glossPass.glossFactor=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Fresnel factor"
        value="${a.renderer.postproduction.glossPass.fresnelFactor}" min="0" max="10"
        @change="${({target:e})=>{a.renderer.postproduction.glossPass.fresnelFactor=e.value,n()}}">
      </bim-number-input>

    </bim-panel-section>

    ${a.renderer.api==="webgpu"?E`
    <bim-panel-section label="Moving resolution">
      <bim-checkbox label="Lower resolution while the camera moves"
        ?checked=${a.renderer.movingResolution.enabled}
        @change="${({target:e})=>{a.renderer.movingResolution.enabled=e.value,n()}}">
      </bim-checkbox>
    </bim-panel-section>`:null}

    <bim-panel-section label="Manual mode">
      <bim-checkbox label="Enabled"
        ?checked=${a.renderer.mode===P.MANUAL}
        @change="${({target:e})=>{a.renderer.mode=e.value?P.MANUAL:P.AUTO}}">
      </bim-checkbox>

      <bim-number-input label="Delay"
        value="${a.renderer.manualModeDelay}" min="10" max="1000"
        @change="${({target:e})=>{a.renderer.manualModeDelay=e.value,n()}}">
      </bim-number-input>

      <bim-checkbox label="Turn off on manual mode"
        ?checked=${a.renderer.turnOffOnManualMode}
        @change="${({target:e})=>{a.renderer.turnOffOnManualMode=e.value,n()}}">
      </bim-checkbox>

      <bim-dropdown label="Default style"
        @change="${({target:e})=>{const s=e.value[0];a.renderer.manualDefaultStyle=s,n()}}">
        <bim-option label="Basic" value="${o.COLOR}"></bim-option>
        <bim-option label="Pen" value="${o.PEN}"></bim-option>
        <bim-option label="Pen Shadows" value="${o.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${o.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${o.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${o.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>


    </bim-panel-section>

    <bim-panel-section class="composer-only" label="Ambient Occlusion">

        <bim-checkbox checked label="Screen Space Radius"
          ?checked=${l.screenSpaceRadius}
          @change="${({target:e})=>{l.screenSpaceRadius=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${r.blendIntensity}" min="0" max="1"
          @change="${({target:e})=>{r.blendIntensity=e.value,n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${l.radius}" min="0.01" max="1"
          @change="${({target:e})=>{l.radius=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${l.distanceExponent}" min="1" max="10"
          @change="${({target:e})=>{l.distanceExponent=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${l.thickness}" min="0.01" max="10"
          @change="${({target:e})=>{l.thickness=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${l.distanceFallOff}" min="0" max="1"
          @change="${({target:e})=>{l.distanceFallOff=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${l.scale}" min="0.01" max="10"
          @change="${({target:e})=>{l.scale=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${l.samples}" min="2" max="32"
          @change="${({target:e})=>{l.samples=e.value,r.updateGtaoMaterial(l),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${t.lumaPhi}" min="0" max="20"
          @change="${({target:e})=>{t.lumaPhi=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${t.depthPhi}" min="0.01" max="20"
          @change="${({target:e})=>{t.depthPhi=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${t.normalPhi}" min="0.01" max="20"
          @change="${({target:e})=>{t.normalPhi=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${t.radius}" min="0" max="32"
          @change="${({target:e})=>{t.radius=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${t.radiusExponent}" min="0.1" max="4"
          @change="${({target:e})=>{t.radiusExponent=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${t.rings}" min="1" max="16"
          @change="${({target:e})=>{t.rings=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${t.samples}" min="2" max="32"
          @change="${({target:e})=>{t.samples=e.value,r.updatePdMaterial(t),n()}}">
        </bim-number-input>

      </bim-panel-section>


    </bim-panel>
    `);document.body.append($);function L(e){const s=e===O.DEFERRED;$.querySelectorAll(".deferred-only").forEach(g=>{g.style.display=s?"":"none"}),$.querySelectorAll(".composer-only").forEach(g=>{g.style.display=s?"none":""})}L(a.renderer.postproduction.mode);const ne=A.create(()=>E`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{$.classList.contains("options-menu-visible")?$.classList.remove("options-menu-visible"):$.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(ne);
