import{C as l,K as h,n as f,b as g,S as w}from"./TransformControls-uP1Cexzu.js";import{c as C,W as O,S as y,O as v,F as I,R as S,I as d}from"./graphic-vertex-picker-BijCnCEg.js";import{w as k}from"./worker-BGfbLmKH.js";import{P as $,a as L,b as P}from"./index-B9_sa_qD.js";import{H as W}from"./index-B8cfUU4g.js";import{O as D}from"./index-DoEfgNun.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bKcSih7U.js";import"./renderer-with-2d-CrQsY-US.js";const a=new C,F=a.get(O),o=F.create();o.scene=new y(a);o.scene.setup();o.scene.three.background=null;const R=document.getElementById("container");o.renderer=new $(a,R);o.camera=new v(a);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const s=a.get(I);s.init(k);o.camera.controls.addEventListener("update",()=>s.core.update());o.onCameraChanged.add(t=>{for(const[,n]of s.list)n.useCamera(t.three);s.core.update(!0)});s.list.onItemSet.add(({value:t})=>{t.useCamera(o.camera.three),o.scene.three.add(t.object),s.core.update(!0)});s.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const x=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(x.map(async t=>{const n=t.split("/").pop()?.split(".").shift();if(!n)return null;const m=await(await fetch(t)).arrayBuffer();return s.core.load(m,{modelId:n})}));const e=a.get(D),{postproduction:b}=o.renderer;b.enabled=!0;b.mode=L.DEFERRED;b.style=P.COLOR_PEN_SHADOWS;e.world=o;e.color=new l(12382500);e.fillColor=new l("#9519c2");e.fillOpacity=.5;e.enabled=!0;const A=async()=>{const n=await a.get(d).getItems([{categories:[/DOOR/]}]);await e.addItems(n)};e.create("walls",{color:new l("#00ffff"),fillColor:new l("#00ffff"),fillOpacity:.15,thickness:3});e.create("slabs",{color:new l("#ff7a00"),fillColor:new l("#ff7a00"),fillOpacity:.2,thickness:3});const E=async()=>{const n=await a.get(d).getItems([{categories:[/WALL/]}]);await e.addItems(n,"walls")},H=async()=>{const n=await a.get(d).getItems([{categories:[/SLAB/]}]);await e.addItems(n,"slabs")},M=()=>e.clean("walls"),B=()=>e.clean("slabs");a.get(S).get(o);const u=a.get(W);u.setup({world:o,selectMaterialDefinition:null});u.events.select.onHighlight.add(t=>{e.addItems(t)});u.events.select.onClear.add(t=>{e.removeItems(t)});const U=()=>{e.clean()};h.init();const c=f.create(()=>{const t=({target:i})=>{e.color=new l(i.color)},n=({target:i})=>{e.fillColor=new l(i.color)},p=({target:i})=>{e.fillOpacity=i.value},m=({target:i})=>{e.thickness=i.value};return g`
    <bim-panel active label="Outliner Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button @click=${U} label="Clear Outlines"></bim-button>
        <bim-color-input color="#${e.color.getHexString()}" label="Line Color" @input=${t}></bim-color-input>
        <bim-color-input color="#${e.fillColor.getHexString()}" label="Fill Color" @input=${n}></bim-color-input>
        <bim-number-input vertical value=${e.fillOpacity} min=0 max=1 step=0.01 slider label="Opacity" @change=${p}></bim-number-input>
        <bim-number-input vertical value=${e.thickness} min=1 max=5 step=0.1 slider label="Thickness" @change=${m}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Default group">
        <bim-button @click=${A} label="Outline Doors"></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Walls group (cyan)">
        <bim-button @click=${E} label="Outline Walls"></bim-button>
        <bim-button @click=${M} label="Clear Walls"></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Slabs group (orange)">
        <bim-button @click=${H} label="Outline Slabs"></bim-button>
        <bim-button @click=${B} label="Clear Slabs"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(c);const _=f.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(_);const r=new w;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>r.begin());o.renderer.onAfterUpdate.add(()=>r.end());
