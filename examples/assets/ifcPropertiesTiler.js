import"./web-ifc-api-Dxv4iFj4.js";import{S as b}from"./stats.min-DYv0AsOH.js";import{T as w,z as f,m as u}from"./index-DtbylpTq.js";import{C as y,T as g,e as h,m as B,U,O as k,a as F,h as L,k as S}from"./index-BRzxhLMM.js";const T=document.getElementById("container"),n=new y,v=n.get(g),s=v.create();s.scene=new h(n);s.renderer=new B(n,T);s.camera=new U(n);n.init();s.camera.controls.setLookAt(12,6,8,0,0,-10);s.scene.setup();const x=n.get(k);x.create(s);s.scene.three.background=null;const I=new F(n),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await O.arrayBuffer(),z=new Uint8Array(R),A=I.load(z);s.scene.three.add(A);function P(e,o){const t=new File([o],e),a=document.createElement("a"),p=URL.createObjectURL(t);a.href=p,a.download=t.name,a.click(),URL.revokeObjectURL(p)}async function j(e){for(const{name:o,bits:t}of e)P(o,t),await new Promise(a=>{setTimeout(a,100)})}const r=n.get(L);r.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.57/",absolute:!0};const c={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];r.onPropertiesStreamed.add(async e=>{c.types[e.type]||(c.types[e.type]=[]),c.types[e.type].push(l);for(const a in e.data)c.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});r.onProgress.add(async e=>{console.log(e)});r.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(c)])});const t=n.get(S).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await j(d)});async function C(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await r.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>i.begin());s.renderer.onAfterUpdate.add(()=>i.end());w.init();const m=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{C()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const $=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
