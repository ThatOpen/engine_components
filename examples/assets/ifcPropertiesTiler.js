import"./web-ifc-api-CBCWqdvz.js";import{S as b}from"./stats.min-BpIepu9J.js";import{m as w,t as f,a as u}from"./index-TmOv0r_5.js";import{p as y,C as g,O as h,a as B,H as F,u as L,h as S,e as U,c as k}from"./index-B7_GRGdn.js";const v=document.getElementById("container"),n=new y,x=n.get(g),s=x.create();s.scene=new h(n);s.renderer=new B(n,v);s.camera=new F(n);n.init();s.camera.controls.setLookAt(12,6,8,0,0,-10);s.scene.setup();const I=n.get(L);I.create(s);s.scene.three.background=null;const O=new S(n),R=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),A=await R.arrayBuffer(),P=new Uint8Array(A),j=O.load(P);s.scene.three.add(j);function C(e,o){const t=new File([o],e),a=document.createElement("a"),p=URL.createObjectURL(t);a.href=p,a.download=t.name,a.click(),URL.revokeObjectURL(p)}async function z(e){for(const{name:o,bits:t}of e)C(o,t),await new Promise(a=>{setTimeout(a,100)})}const r=n.get(U);r.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.56/",absolute:!0};const c={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];r.onPropertiesStreamed.add(async e=>{c.types[e.type]||(c.types[e.type]=[]),c.types[e.type].push(l);for(const a in e.data)c.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});r.onProgress.add(async e=>{console.log(e)});r.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(c)])});const t=n.get(k).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await z(d)});async function T(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await r.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>i.begin());s.renderer.onAfterUpdate.add(()=>i.end());w.init();const m=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{T()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const $=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
