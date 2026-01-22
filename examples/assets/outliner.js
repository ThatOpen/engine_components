import{C as c,l as g,c as p,a as b,b as f}from"./index-BET5fVdQ.js";import{C as h,W as w,S as C,O as v,F as y,R as O,I as k}from"./graphic-vertex-picker-D88BIZW2.js";import{P as I}from"./index-oGDxbV82.js";import{H as L}from"./index-CgGl_Ams.js";import{O as $}from"./index-BM5VovnA.js";import"./index-CtMoHNvK.js";const s=new h,F=s.get(w),o=F.create();o.scene=new C(s);o.scene.setup();o.scene.three.background=null;const S=document.getElementById("container");o.renderer=new I(s,S);o.camera=new v(s);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const U="https://thatopen.github.io/engine_fragment/resources/worker.mjs",x=await fetch(U),P=await x.blob(),R=new File([P],"worker.mjs",{type:"text/javascript"}),j=URL.createObjectURL(R),r=s.get(y);r.init(j);o.camera.controls.addEventListener("update",()=>r.core.update());o.onCameraChanged.add(e=>{for(const[,a]of r.list)a.useCamera(e.three);r.core.update(!0)});r.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),r.core.update(!0)});r.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(H.map(async e=>{var n;const a=(n=e.split("/").pop())==null?void 0:n.split(".").shift();if(!a)return null;const m=await(await fetch(e)).arrayBuffer();return r.core.load(m,{modelId:a})}));const t=s.get($),{postproduction:M}=o.renderer;M.enabled=!0;t.world=o;t.color=new c(12382500);t.fillColor=new c("#9519c2");t.fillOpacity=.5;t.enabled=!0;const B=async()=>{const a=await s.get(k).getItems([{categories:[/DOOR/]}]);await t.addItems(a)};s.get(O).get(o);const d=s.get(L);d.setup({world:o,selectMaterialDefinition:null});d.events.select.onHighlight.add(e=>{t.addItems(e)});d.events.select.onClear.add(e=>{t.removeItems(e)});const A=()=>{t.clean()};g.init();const l=p.create(()=>{const e=({target:n})=>{t.color=new c(n.color)},a=({target:n})=>{t.fillColor=new c(n.color)},u=({target:n})=>{t.fillOpacity=n.value},m=({target:n})=>{t.thickness=n.value};return b`
    <bim-panel active label="Outliner Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button @click=${A} label="Clear Outlines"></bim-button>
        <bim-color-input color="#${t.color.getHexString()}" label="Line Color" @input=${e}></bim-color-input>
        <bim-color-input color="#${t.fillColor.getHexString()}" label="Fill Color" @input=${a}></bim-color-input>
        <bim-number-input vertical value=${t.fillOpacity} min=0 max=1 step=0.01 slider label="Opacity" @change=${u}></bim-number-input>
        <bim-number-input vertical value=${t.thickness} min=1 max=5 step=0.1 slider label="Thickness" @change=${m}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-button @click=${B} label="Outline Items"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(l);const D=p.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(D);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>i.begin());o.renderer.onAfterUpdate.add(()=>i.end());
