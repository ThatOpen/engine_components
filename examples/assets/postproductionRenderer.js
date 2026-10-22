import{S as L,K as F,M as N,aH as G,aI as W,n as y,b as w}from"./TransformControls-lNp9RmyE.js";import{c as H,W as _,S as I,O as U,G as B,F as M,g as f}from"./graphic-vertex-picker-DI4NqEOA.js";import{P as j,b as t,a as P,D as E,E as k}from"./index-DRMWQziR.js";import{O as q}from"./index-CDrmeedZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-w2Uqv0fG.js";import"./renderer-with-2d-DTPUqC0M.js";import"./index-6WqdzqCF.js";const c=new H,T=c.get(_),a=T.create();a.scene=new I(c);a.scene.setup();a.scene.three.background=null;const z=document.getElementById("container");a.renderer=new j(c,z);a.camera=new U(c);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);c.init();const K=c.get(B),A=K.create(a);A.config.color.set(6710886);a.scene.three.background=null;const n=()=>{a.renderer.mode===f.MANUAL&&(a.renderer.needsUpdate=!0)};a.camera.controls.addEventListener("update",n);a.renderer.onResize.add(n);const V=await M.getWorker(),d=c.get(M);d.init(V);a.camera.controls.addEventListener("update",()=>d.core.update());a.onCameraChanged.add(e=>{for(const[,s]of d.list)s.useCamera(e.three);d.core.update(!0)});d.list.onItemSet.add(({value:e})=>{e.useCamera(a.camera.three),a.scene.three.add(e.object),d.core.update(!0)});d.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const X=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(X.map(async e=>{const s=e.split("/").pop()?.split(".").shift();if(!s)return null;const R=await(await fetch(e)).arrayBuffer();return d.core.load(R,{modelId:s})}));a.renderer.postproduction.enabled=!0;a.renderer.postproduction.style=t.COLOR_PEN_SHADOWS;a.dynamicAnchor=!1;a.renderer.postproduction.basePass.isolatedMaterials.push(A.material);a.renderer.postproduction.deferred;a.renderer.postproduction.mode=P.DEFERRED;const C=d.list.values().next().value,h=c.get(q);h.world=a;h.enabled=!0;const J=await C.getItemsOfCategories([/IFCWALL/]),Q=J.IFCWALL,[Y,Z]=Q;h.addItems({[C.modelId]:new Set([Y,Z])});const x=new L;x.showPanel(2);document.body.append(x.dom);x.dom.style.left="0px";x.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>x.begin());a.renderer.onAfterUpdate.add(()=>x.end());F.init();const{aoPass:r,outlinePass:p,edgesPass:O,defaultAoParameters:l}=a.renderer.postproduction,o={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};r.updateGtaoMaterial(l);r.updatePdMaterial(o);const S=new N(new G(1,1,1),new W({color:65280}));S.position.set(10,0,0);a.scene.three.add(S);a.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(S.material);const m=a.renderer.postproduction.deferred,b=m.ao.settings,u=m.worldAo.settings,v=m.denoise.settings,i=m.composite.settings,$=y.create(()=>w`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">

    <bim-panel-section label="General">

      <bim-checkbox checked label="Postproduction enabled"
        @change="${({target:e})=>{a.renderer.postproduction.enabled=e.value,n()}}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction mode"
        @change="${({target:e})=>{const s=Number(e.value[0]);a.renderer.postproduction.mode=s,D(s),n()}}">
        <bim-option label="Composer" value="${P.COMPOSER}"></bim-option>
        <bim-option checked label="Deferred" value="${P.DEFERRED}"></bim-option>
      </bim-dropdown>

      <bim-dropdown required label="Projection"
        @change="${async({target:e})=>{const s=e.value[0];await a.camera.projection.set(s);for(const g of d.list.values())g.useCamera(a.camera.three);a.renderer.postproduction.updateCamera(),n()}}">
        <bim-option checked label="Perspective" value="Perspective"></bim-option>
        <bim-option label="Orthographic" value="Orthographic"></bim-option>
      </bim-dropdown>

      <bim-button label="${h.enabled?"Outline: ON":"Outline: OFF"}"
        @click="${({target:e})=>{h.enabled=!h.enabled,e.label=h.enabled?"Outline: ON":"Outline: OFF",n()}}">
      </bim-button>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Pipeline">

      <bim-dropdown required label="Visual style"
        @change="${({target:e})=>{a.renderer.postproduction.style=Number(e.value[0]),n()}}">
        <bim-option label="Color" value="${t.COLOR}"></bim-option>
        <bim-option label="Pen" value="${t.PEN}"></bim-option>
        <bim-option label="Pen shadows" value="${t.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color pen" value="${t.COLOR_PEN}"></bim-option>
        <bim-option label="Color shadows" value="${t.COLOR_SHADOWS}"></bim-option>
        <bim-option checked label="Color pen shadows" value="${t.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Ambient occlusion enabled"
        ?checked=${m.settings.aoEnabled}
        @change="${({target:e})=>{m.settings.aoEnabled=e.value,n()}}">
      </bim-checkbox>

      <bim-dropdown required label="AO estimator"
        @change="${({target:e})=>{m.settings.aoMode=Number(e.value[0]),n()}}">
        <bim-option checked label="Screen-space" value="${E.SCREEN_SPACE}"></bim-option>
        <bim-option label="World-space" value="${E.WORLD_SPACE}"></bim-option>
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
        value="${b.radius}" min="0.05" max="4"
        @change="${({target:e})=>{b.radius=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.002" label="Bias"
        value="${b.bias}" min="0" max="0.1"
        @change="${({target:e})=>{b.bias=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Intensity"
        value="${b.intensity}" min="0" max="3"
        @change="${({target:e})=>{b.intensity=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contrast"
        value="${b.contrast}" min="0.25" max="4"
        @change="${({target:e})=>{b.contrast=e.value,n()}}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Samples"
        value="${b.samples}" min="4" max="32"
        @change="${({target:e})=>{b.samples=e.value,n()}}">
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

        <bim-option label="Basic" value="${t.COLOR}"></bim-option>
        <bim-option label="Pen" value="${t.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${t.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${t.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${t.COLOR_SHADOWS}"></bim-option>
        <bim-option checked label="Color Pen Shadows" value="${t.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

      <bim-panel-section class="composer-only" label="Edges">

      <bim-number-input
          slider step="0.1" label="Width"
          value="${a.renderer.postproduction.edgesPass.width}" min="1" max="3"
          @change="${({target:e})=>{a.renderer.postproduction.edgesPass.width=e.value,n()}}">
      </bim-number-input>

      <bim-color-input label="Edges color"
        color="#${O.color.getHexString()}"
        @input="${({target:e})=>{O.color.set(e.value.color),n()}}">
      </bim-color-input>

      <bim-dropdown label="Edges Mode"
        @change="${({target:e})=>{O.mode=e.value[0],n()}}">
        <bim-option checked label="Default" value="${k.DEFAULT}"></bim-option>
        <bim-option label="Global" value="${k.GLOBAL}"></bim-option>
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

    <bim-panel-section label="Manual mode">
      <bim-checkbox label="Enabled"
        ?checked=${a.renderer.mode===f.MANUAL}
        @change="${({target:e})=>{a.renderer.mode=e.value?f.MANUAL:f.AUTO}}">
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
        <bim-option label="Basic" value="${t.COLOR}"></bim-option>
        <bim-option label="Pen" value="${t.PEN}"></bim-option>
        <bim-option label="Pen Shadows" value="${t.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${t.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${t.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${t.COLOR_PEN_SHADOWS}"></bim-option>
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
          value="${o.lumaPhi}" min="0" max="20"
          @change="${({target:e})=>{o.lumaPhi=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${o.depthPhi}" min="0.01" max="20"
          @change="${({target:e})=>{o.depthPhi=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${o.normalPhi}" min="0.01" max="20"
          @change="${({target:e})=>{o.normalPhi=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${o.radius}" min="0" max="32"
          @change="${({target:e})=>{o.radius=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${o.radiusExponent}" min="0.1" max="4"
          @change="${({target:e})=>{o.radiusExponent=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${o.rings}" min="1" max="16"
          @change="${({target:e})=>{o.rings=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${o.samples}" min="2" max="32"
          @change="${({target:e})=>{o.samples=e.value,r.updatePdMaterial(o),n()}}">
        </bim-number-input>

      </bim-panel-section>


    </bim-panel>
    `);document.body.append($);function D(e){const s=e===P.DEFERRED;$.querySelectorAll(".deferred-only").forEach(g=>{g.style.display=s?"":"none"}),$.querySelectorAll(".composer-only").forEach(g=>{g.style.display=s?"none":""})}D(a.renderer.postproduction.mode);const ee=y.create(()=>w`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{$.classList.contains("options-menu-visible")?$.classList.remove("options-menu-visible"):$.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(ee);
