import{a as O,u as M,M as w,B as k,j as S,V as v,f as $}from"./index-b0R13blq.js";import{C as E,W as L,S as C,O as y,d as A,F as D,e as c}from"./graphic-vertex-picker-DjytwMNw.js";import{P as R,a as l}from"./index-BMGFic9y.js";import{O as G}from"./index-BnBYKBGR.js";import"./index-Cul4yEyt.js";import"./index-BOl1U6wY.js";const d=new E,F=d.get(L),n=F.create();n.scene=new C(d);n.scene.setup();n.scene.three.background=null;const I=document.getElementById("container");n.renderer=new R(d,I);n.camera=new y(d);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const U=d.get(A),_=U.create(n);_.config.color.set(6710886);n.scene.three.background=null;const a=()=>{n.renderer.mode===c.MANUAL&&(n.renderer.needsUpdate=!0)};n.camera.controls.addEventListener("update",a);n.renderer.onResize.add(a);const N="https://thatopen.github.io/engine_fragment/resources/worker.mjs",W=await fetch(N),j=await W.blob(),B=new File([j],"worker.mjs",{type:"text/javascript"}),H=URL.createObjectURL(B),r=d.get(D);r.init(H);n.camera.controls.addEventListener("rest",()=>r.core.update(!0));n.onCameraChanged.add(e=>{for(const[,s]of r.list)s.useCamera(e.three);r.core.update(!0)});r.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),r.core.update(!0)});r.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const T=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(T.map(async e=>{var h;const s=(h=e.split("/").pop())==null?void 0:h.split(".").shift();if(!s)return null;const f=await(await fetch(e)).arrayBuffer();return r.core.load(f,{modelId:s})}));n.renderer.postproduction.enabled=!0;n.dynamicAnchor=!1;r.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial&&n.renderer.postproduction.basePass.isolatedMaterials.push(e)});const P=r.list.values().next().value,x=d.get(G);x.world=n;const q=await P.getItemsOfCategories([/IFCWALL/]),z=q.IFCWALL,[V,J]=z;x.addItems({[P.modelId]:new Set([V,J])});const m=new O;m.showPanel(2);document.body.append(m.dom);m.dom.style.left="0px";m.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>m.begin());n.renderer.onAfterUpdate.add(()=>m.end());M.init();const{aoPass:i,outlinePass:u,edgesPass:g,defaultAoParameters:t}=n.renderer.postproduction,o={lumaPhi:10,depthPhi:2,normalPhi:3,radius:4,radiusExponent:1,rings:2,samples:16};i.updateGtaoMaterial(t);i.updatePdMaterial(o);const b=new w(new k(1,1,1),new S({color:65280}));b.position.set(10,0,0);n.scene.three.add(b);n.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(b.material);const p=v.create(()=>$`
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
        color="#${g.color.getHexString()}"
        @input="${({target:e})=>{g.color.set(e.value.color),a()}}">
      </bim-color-input>

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
    `);document.body.append(p);const K=v.create(()=>$`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(K);
