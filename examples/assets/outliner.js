import{C as c,a as g}from"./index-lvtjgYNN.js";import{C as f,W as h,S as w,O as C,F as v,R as y,I as O}from"./graphic-vertex-picker-CqNhsDsK.js";import{a as k,R as p,m as b}from"./index-bERBRksd.js";import{P as I}from"./index-DXj1C1yG.js";import{H as $}from"./index-Cah51jn0.js";import{O as L}from"./index-CVwM873C.js";import"./index-B41enjmT.js";const r=new f,R=r.get(h),t=R.create();t.scene=new w(r);t.scene.setup();t.scene.three.background=null;const x=document.getElementById("container");t.renderer=new I(r,x);t.camera=new C(r);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const F="https://thatopen.github.io/engine_fragment/resources/worker.mjs",S=await fetch(F),U=await S.blob(),P=new File([U],"worker.mjs",{type:"text/javascript"}),j=URL.createObjectURL(P),s=r.get(v);s.init(j);t.camera.controls.addEventListener("rest",()=>s.core.update(!0));t.onCameraChanged.add(n=>{for(const[,a]of s.list)a.useCamera(n.three);s.core.update(!0)});s.list.onItemSet.add(({value:n})=>{n.useCamera(t.camera.three),t.scene.three.add(n.object),s.core.update(!0)});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(H.map(async n=>{var o;const a=(o=n.split("/").pop())==null?void 0:o.split(".").shift();if(!a)return null;const m=await(await fetch(n)).arrayBuffer();return s.core.load(m,{modelId:a})}));const e=r.get(L),{postproduction:B}=t.renderer;B.enabled=!0;e.world=t;e.color=new c(12382500);e.fillColor=new c("#9519c2");e.fillOpacity=.5;e.enabled=!0;const A=async()=>{const a=await r.get(O).getItems([{categories:[/DOOR/]}]);await e.addItems(a)};r.get(y).get(t);const u=r.get($);u.setup({world:t,selectMaterialDefinition:null});u.events.select.onHighlight.add(n=>{e.addItems(n)});u.events.select.onClear.add(n=>{e.removeItems(n)});const D=()=>{e.clean()};k.init();const l=p.create(()=>{const n=({target:o})=>{e.color=new c(o.color)},a=({target:o})=>{e.fillColor=new c(o.color)},d=({target:o})=>{e.fillOpacity=o.value},m=({target:o})=>{e.thickness=o.value};return b`
    <bim-panel active label="Outliner Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button @click=${D} label="Clear Outlines"></bim-button>
        <bim-color-input color="#${e.color.getHexString()}" label="Line Color" @input=${n}></bim-color-input>
        <bim-color-input color="#${e.fillColor.getHexString()}" label="Fill Color" @input=${a}></bim-color-input>
        <bim-number-input vertical value=${e.fillOpacity} min=0 max=1 step=0.01 slider label="Opacity" @change=${d}></bim-number-input>
        <bim-number-input vertical value=${e.thickness} min=1 max=5 step=0.1 slider label="Thickness" @change=${m}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-button @click=${A} label="Outline Items"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(l);const T=p.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);const i=new g;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
