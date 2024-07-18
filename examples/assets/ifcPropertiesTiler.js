import"./web-ifc-api-CfQNUy7g.js";import{S as b}from"./stats.min-BpIepu9J.js";import{m as w,t as f,a as u}from"./index-tywNknxv.js";import{p as y,C as g,i as h,n as B,W as F,d as L,h as S,$ as U,a as k}from"./index-D2xchnNe.js";const v=document.getElementById("container"),s=new y,x=s.get(g),n=x.create();n.scene=new h(s);n.renderer=new B(s,v);n.camera=new F(s);s.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const I=s.get(L);I.create(n);n.scene.three.background=null;const R=new S(s),A=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),P=await A.arrayBuffer(),$=new Uint8Array(P),j=R.load($);n.scene.three.add(j);function C(e,o){const t=new File([o],e),a=document.createElement("a"),p=URL.createObjectURL(t);a.href=p,a.download=t.name,a.click(),URL.revokeObjectURL(p)}async function O(e){for(const{name:o,bits:t}of e)C(o,t),await new Promise(a=>{setTimeout(a,100)})}const c=s.get(U);c.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.55/",absolute:!0};const r={types:{},ids:{},indexesFile:"small.ifc-processed-properties-indexes"};let l=0;const d=[];c.onPropertiesStreamed.add(async e=>{r.types[e.type]||(r.types[e.type]=[]),r.types[e.type].push(l);for(const a in e.data)r.ids[a]=l;const o=`small.ifc-processed-properties-${l}`,t=new Blob([JSON.stringify(e.data)]);d.push({bits:t,name:o}),l++});c.onProgress.add(async e=>{console.log(e)});c.onIndicesStreamed.add(async e=>{d.push({name:"small.ifc-processed-properties.json",bits:new Blob([JSON.stringify(r)])});const t=s.get(k).serializeRelations(e);d.push({name:"small.ifc-processed-properties-indexes",bits:new Blob([t])}),await O(d)});async function z(){const o=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),t=new Uint8Array(o);await c.streamFromBuffer(t)}const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());w.init();const m=f.create(()=>u`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{z()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const T=f.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
