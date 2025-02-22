import"./web-ifc-api-r1ed24cU.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as g,L as f,m as u}from"./index-ByMLC5eT.js";import{C as y,W as w,S as h,d as S,a as B,G as F,F as I,o as L,I as x}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const R=document.getElementById("container"),s=new y,U=s.get(w),n=U.create();n.scene=new h(s);n.renderer=new S(s,R);n.camera=new B(s);s.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const k=s.get(F);k.create(n);n.scene.three.background=null;const P=new I(s),T=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),v=await T.arrayBuffer(),A=new Uint8Array(v),C=P.load(A);n.scene.three.add(C);function j(e,o){const t=new File([o],e),a=document.createElement("a"),p=URL.createObjectURL(t);a.href=p,a.download=t.name,a.click(),URL.revokeObjectURL(p)}async function O(e){for(const{name:o,bits:t}of e)j(o,t),await new Promise(a=>{setTimeout(a,100)})}const c=s.get(L);c.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.66/",absolute:!0};const r={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];c.onPropertiesStreamed.add(async e=>{r.types[e.type]||(r.types[e.type]=[]),r.types[e.type].push(l);for(const a in e.data)r.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});c.onProgress.add(async e=>{console.log(e)});c.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(r)])});const t=s.get(x).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await O(d)});async function z(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await c.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());g.init();const m=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Export IFC Property Tiles"
          @click="${()=>{z()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const E=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(E);
