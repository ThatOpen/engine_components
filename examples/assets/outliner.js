import{C as s,p as g,m as p,a as f,b as h}from"./index-r1u2qk8S.js";import{C as w,W as C,S as y,O,F as v,R as I,I as b}from"./graphic-vertex-picker-CWFP0Ixd.js";import{w as k}from"./worker-C2DG9TTm.js";import{P as S}from"./index-XrFy7Sj7.js";import{H as $}from"./index-CmJd1fkT.js";import{O as L}from"./index-DmW5gVCU.js";import"./three.tsl-BohoDV_b.js";import"./renderer-with-2d-8C_aJlkt.js";const a=new w,W=a.get(C),n=W.create();n.scene=new y(a);n.scene.setup();n.scene.three.background=null;const x=document.getElementById("container");n.renderer=new S(a,x);n.camera=new O(a);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const i=a.get(v);i.init(k);n.camera.controls.addEventListener("update",()=>i.core.update());n.onCameraChanged.add(t=>{for(const[,o]of i.list)o.useCamera(t.three);i.core.update(!0)});i.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),i.core.update(!0)});i.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const F=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(F.map(async t=>{var l;const o=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!o)return null;const m=await(await fetch(t)).arrayBuffer();return i.core.load(m,{modelId:o})}));const e=a.get(L),{postproduction:P}=n.renderer;P.enabled=!0;e.world=n;e.color=new s(12382500);e.fillColor=new s("#9519c2");e.fillOpacity=.5;e.enabled=!0;const D=async()=>{const o=await a.get(b).getItems([{categories:[/DOOR/]}]);await e.addItems(o)};e.create("walls",{color:new s("#00ffff"),fillColor:new s("#00ffff"),fillOpacity:.15,thickness:3});e.create("slabs",{color:new s("#ff7a00"),fillColor:new s("#ff7a00"),fillOpacity:.2,thickness:3});const H=async()=>{const o=await a.get(b).getItems([{categories:[/WALL/]}]);await e.addItems(o,"walls")},M=async()=>{const o=await a.get(b).getItems([{categories:[/SLAB/]}]);await e.addItems(o,"slabs")},A=()=>e.clean("walls"),B=()=>e.clean("slabs");a.get(I).get(n);const d=a.get($);d.setup({world:n,selectMaterialDefinition:null});d.events.select.onHighlight.add(t=>{e.addItems(t)});d.events.select.onClear.add(t=>{e.removeItems(t)});const R=()=>{e.clean()};g.init();const c=p.create(()=>{const t=({target:l})=>{e.color=new s(l.color)},o=({target:l})=>{e.fillColor=new s(l.color)},u=({target:l})=>{e.fillOpacity=l.value},m=({target:l})=>{e.thickness=l.value};return f`
    <bim-panel active label="Outliner Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button @click=${R} label="Clear Outlines"></bim-button>
        <bim-color-input color="#${e.color.getHexString()}" label="Line Color" @input=${t}></bim-color-input>
        <bim-color-input color="#${e.fillColor.getHexString()}" label="Fill Color" @input=${o}></bim-color-input>
        <bim-number-input vertical value=${e.fillOpacity} min=0 max=1 step=0.01 slider label="Opacity" @change=${u}></bim-number-input>
        <bim-number-input vertical value=${e.thickness} min=1 max=5 step=0.1 slider label="Thickness" @change=${m}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Default group">
        <bim-button @click=${D} label="Outline Doors"></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Walls group (cyan)">
        <bim-button @click=${H} label="Outline Walls"></bim-button>
        <bim-button @click=${A} label="Clear Walls"></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Slabs group (orange)">
        <bim-button @click=${M} label="Outline Slabs"></bim-button>
        <bim-button @click=${B} label="Clear Slabs"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(c);const U=p.create(()=>f`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);const r=new h;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>r.begin());n.renderer.onAfterUpdate.add(()=>r.end());
