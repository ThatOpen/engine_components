import"./web-ifc-api-BffFJDIm.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{p as w,a as f,m as u}from"./index-DyM33b1I.js";import{p as y,C as g,i as h,n as B,k,a as F,u as L,e as S,W as U}from"./index-DTZynfbV.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),s=new y,x=s.get(g),n=x.create();n.scene=new h(s);n.renderer=new B(s,v);n.camera=new k(s);s.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const I=s.get(F);I.create(n);n.scene.three.background=null;const R=new L(s),A=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),P=await A.arrayBuffer(),j=new Uint8Array(P),C=R.load(j);n.scene.three.add(C);function O(e,o){const t=new File([o],e),a=document.createElement("a"),m=URL.createObjectURL(t);a.href=m,a.download=t.name,a.click(),URL.revokeObjectURL(m)}async function $(e){for(const{name:o,bits:t}of e)O(o,t),await new Promise(a=>{setTimeout(a,100)})}const c=s.get(S);c.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.53/",absolute:!0};const r={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];c.onPropertiesStreamed.add(async e=>{r.types[e.type]||(r.types[e.type]=[]),r.types[e.type].push(l);for(const a in e.data)r.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});c.onProgress.add(async e=>{console.log(e)});c.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(r)])});const t=s.get(U).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await $(d)});async function z(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await c.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());w.init();const p=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{z()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(p);const T=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
