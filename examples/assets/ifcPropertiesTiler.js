import"./web-ifc-api-BXZoUgQp.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{d as w,R as f,m as u}from"./index-CqPyogbW.js";import{o as y,a as g,L as h,M as B,N as L,l as F,_ as R,c as S,J as U}from"./index-CbQqmTVP.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),n=new y,v=n.get(g),s=v.create();s.scene=new h(n);s.renderer=new B(n,k);s.camera=new L(n);n.init();s.camera.controls.setLookAt(12,6,8,0,0,-10);s.scene.setup();const x=n.get(F);x.create(s);s.scene.three.background=null;const I=new R(n),A=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await A.arrayBuffer(),P=new Uint8Array(O),j=I.load(P);s.scene.three.add(j);function J(e,o){const t=new File([o],e),a=document.createElement("a"),p=URL.createObjectURL(t);a.href=p,a.download=t.name,a.click(),URL.revokeObjectURL(p)}async function N(e){for(const{name:o,bits:t}of e)J(o,t),await new Promise(a=>{setTimeout(a,100)})}const c=n.get(S);c.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.56/",absolute:!0};const r={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];c.onPropertiesStreamed.add(async e=>{r.types[e.type]||(r.types[e.type]=[]),r.types[e.type].push(l);for(const a in e.data)r.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});c.onProgress.add(async e=>{console.log(e)});c.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(r)])});const t=n.get(U).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await N(d)});async function _(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await c.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>i.begin());s.renderer.onAfterUpdate.add(()=>i.end());w.init();const m=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{_()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const z=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
