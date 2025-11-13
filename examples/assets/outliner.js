import{C as c,u as g,V as p,f as b,a as f}from"./index-b0R13blq.js";import{C as h,W as C,S as w,O as v,F as y,R as O,I}from"./graphic-vertex-picker-DjytwMNw.js";import{P as k}from"./index-BMGFic9y.js";import{H as $}from"./index-Cul4yEyt.js";import{O as L}from"./index-BnBYKBGR.js";import"./index-BOl1U6wY.js";const a=new h,S=a.get(C),t=S.create();t.scene=new w(a);t.scene.setup();t.scene.three.background=null;const x=document.getElementById("container");t.renderer=new k(a,x);t.camera=new v(a);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const P="https://thatopen.github.io/engine_fragment/resources/worker.mjs",s=a.get(y);s.init(P);t.camera.controls.addEventListener("rest",()=>s.core.update(!0));t.onCameraChanged.add(n=>{for(const[,r]of s.list)r.useCamera(n.three);s.core.update(!0)});s.list.onItemSet.add(({value:n})=>{n.useCamera(t.camera.three),t.scene.three.add(n.object),s.core.update(!0)});const F=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(F.map(async n=>{var o;const r=(o=n.split("/").pop())==null?void 0:o.split(".").shift();if(!r)return null;const m=await(await fetch(n)).arrayBuffer();return s.core.load(m,{modelId:r})}));const e=a.get(L),{postproduction:H}=t.renderer;H.enabled=!0;e.world=t;e.color=new c(12382500);e.fillColor=new c("#9519c2");e.fillOpacity=.5;e.enabled=!0;const R=async()=>{const r=await a.get(I).getItems([{categories:[/DOOR/]}]);await e.addItems(r)};a.get(O).get(t);const u=a.get($);u.setup({world:t,selectMaterialDefinition:null});u.events.select.onHighlight.add(n=>{e.addItems(n)});u.events.select.onClear.add(n=>{e.removeItems(n)});const A=()=>{e.clean()};g.init();const l=p.create(()=>{const n=({target:o})=>{e.color=new c(o.color)},r=({target:o})=>{e.fillColor=new c(o.color)},d=({target:o})=>{e.fillOpacity=o.value},m=({target:o})=>{e.thickness=o.value};return b`
    <bim-panel active label="Outliner Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button @click=${A} label="Clear Outlines"></bim-button>
        <bim-color-input color="#${e.color.getHexString()}" label="Line Color" @input=${n}></bim-color-input>
        <bim-color-input color="#${e.fillColor.getHexString()}" label="Fill Color" @input=${r}></bim-color-input>
        <bim-number-input vertical value=${e.fillOpacity} min=0 max=1 step=0.01 slider label="Opacity" @change=${d}></bim-number-input>
        <bim-number-input vertical value=${e.thickness} min=1 max=5 step=0.1 slider label="Thickness" @change=${m}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-button @click=${R} label="Outline Items"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(l);const B=p.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
