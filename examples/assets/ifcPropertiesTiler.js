import"./web-ifc-api-BlmMr04K.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as g,L as f,m as u}from"./index-C8nqhRYO.js";import{C as w,W as y,S as h,d as S,a as B,G as F,F as L,o as I,I as R}from"./index-CVzIUIEt.js";import"./_commonjsHelpers-Cpj98o6Y.js";const U=document.getElementById("container"),s=new w,k=s.get(y),n=k.create();n.scene=new h(s);n.renderer=new S(s,U);n.camera=new B(s);s.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const x=s.get(F);x.create(n);n.scene.three.background=null;const v=new L(s),P=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),T=await P.arrayBuffer(),A=new Uint8Array(T),C=v.load(A);n.scene.three.add(C);function j(e,o){const t=new File([o],e),a=document.createElement("a"),p=URL.createObjectURL(t);a.href=p,a.download=t.name,a.click(),URL.revokeObjectURL(p)}async function O(e){for(const{name:o,bits:t}of e)j(o,t),await new Promise(a=>{setTimeout(a,100)})}const c=s.get(I);c.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.66/",absolute:!0};const r={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];c.onPropertiesStreamed.add(async e=>{r.types[e.type]||(r.types[e.type]=[]),r.types[e.type].push(l);for(const a in e.data)r.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});c.onProgress.add(async e=>{console.log(e)});c.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(r)])});const t=s.get(R).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await O(d)});async function z(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await c.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());g.init();const m=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{z()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const $=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
