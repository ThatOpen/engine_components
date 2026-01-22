import{a as k,u as M,c as w,B as E,k as S,V as $,f as P}from"./index-DcyXhVxI.js";import{C as L,W as C,S as y,O as A,d as D,F as G,e as c}from"./graphic-vertex-picker-ClbEbQzL.js";import{P as R,a as l,E as v}from"./index-CoP0RxlY.js";import{O as F}from"./index-D2StEo97.js";import"./index-CqkqUpiT.js";import"./index-BcAp4ueJ.js";const d=new L,I=d.get(C),n=I.create();n.scene=new y(d);n.scene.setup();n.scene.three.background=null;const U=document.getElementById("container");n.renderer=new R(d,U);n.camera=new A(d);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const _=d.get(D),N=_.create(n);N.config.color.set(6710886);n.scene.three.background=null;const a=()=>{n.renderer.mode===c.MANUAL&&(n.renderer.needsUpdate=!0)};n.camera.controls.addEventListener("update",a);n.renderer.onResize.add(a);const W="https://thatopen.github.io/engine_fragment/resources/worker.mjs",B=await fetch(W),j=await B.blob(),H=new File([j],"worker.mjs",{type:"text/javascript"}),T=URL.createObjectURL(H),r=d.get(G);r.init(T);n.camera.controls.addEventListener("rest",()=>r.core.update(!0));n.onCameraChanged.add(e=>{for(const[,s]of r.list)s.useCamera(e.three);r.core.update(!0)});r.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),r.core.update(!0)});r.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const q=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(q.map(async e=>{var g;const s=(g=e.split("/").pop())==null?void 0:g.split(".").shift();if(!s)return null;const O=await(await fetch(e)).arrayBuffer();return r.core.load(O,{modelId:s})}));n.renderer.postproduction.enabled=!0;n.dynamicAnchor=!1;r.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial&&n.renderer.postproduction.basePass.isolatedMaterials.push(e)});const x=r.list.values().next().value,f=d.get(F);f.world=n;const z=await x.getItemsOfCategories([/IFCWALL/]),V=z.IFCWALL,[J,K]=V;f.addItems({[x.modelId]:new Set([J,K])});const m=new k;m.showPanel(2);document.body.append(m.dom);m.dom.style.left="0px";m.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>m.begin());n.renderer.onAfterUpdate.add(()=>m.end());M.init();const{aoPass:i,outlinePass:u,edgesPass:p,defaultAoParameters:t}=n.renderer.postproduction,o={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};i.updateGtaoMaterial(t);i.updatePdMaterial(o);const h=new w(new E(1,1,1),new S({color:65280}));h.position.set(10,0,0);n.scene.three.add(h);n.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(h.material);const b=$.create(()=>P`
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

      <bim-dropdown required label="Postproduction style"
        @change="${({target:e})=>{const s=e.value[0];n.renderer.postproduction.style=s,a()}}">

        <bim-option checked label="Basic" value="${l.COLOR}"></bim-option>
        <bim-option label="Pen" value="${l.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${l.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${l.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${l.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${l.COLOR_PEN_SHADOWS}"></bim-option>
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
        <bim-option checked label="Default" value="${v.DEFAULT}"></bim-option>
        <bim-option label="Global" value="${v.GLOBAL}"></bim-option>
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
        ?checked=${n.renderer.mode===c.MANUAL}
        @change="${({target:e})=>{n.renderer.mode=e.value?c.MANUAL:c.AUTO}}">
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
        <bim-option label="Basic" value="${l.COLOR}"></bim-option>
        <bim-option label="Pen" value="${l.PEN}"></bim-option>
        <bim-option label="Pen Shadows" value="${l.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${l.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${l.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${l.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>


    </bim-panel-section>

    <bim-panel-section label="Ambient Occlusion">

        <bim-checkbox checked label="Screen Space Radius"
          ?checked=${t.screenSpaceRadius}
          @change="${({target:e})=>{t.screenSpaceRadius=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${i.blendIntensity}" min="0" max="1"
          @change="${({target:e})=>{i.blendIntensity=e.value,a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${t.radius}" min="0.01" max="1"
          @change="${({target:e})=>{t.radius=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${t.distanceExponent}" min="1" max="10"
          @change="${({target:e})=>{t.distanceExponent=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${t.thickness}" min="0.01" max="10"
          @change="${({target:e})=>{t.thickness=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${t.distanceFallOff}" min="0" max="1"
          @change="${({target:e})=>{t.distanceFallOff=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${t.scale}" min="0.01" max="10"
          @change="${({target:e})=>{t.scale=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${t.samples}" min="2" max="32"
          @change="${({target:e})=>{t.samples=e.value,i.updateGtaoMaterial(t),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${o.lumaPhi}" min="0" max="20"
          @change="${({target:e})=>{o.lumaPhi=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${o.depthPhi}" min="0.01" max="20"
          @change="${({target:e})=>{o.depthPhi=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${o.normalPhi}" min="0.01" max="20"
          @change="${({target:e})=>{o.normalPhi=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${o.radius}" min="0" max="32"
          @change="${({target:e})=>{o.radius=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${o.radiusExponent}" min="0.1" max="4"
          @change="${({target:e})=>{o.radiusExponent=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${o.rings}" min="1" max="16"
          @change="${({target:e})=>{o.rings=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${o.samples}" min="2" max="32"
          @change="${({target:e})=>{o.samples=e.value,i.updatePdMaterial(o),a()}}">
        </bim-number-input>

      </bim-panel-section>


    </bim-panel>
    `);document.body.append(b);const Q=$.create(()=>P`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{b.classList.contains("options-menu-visible")?b.classList.remove("options-menu-visible"):b.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Q);
