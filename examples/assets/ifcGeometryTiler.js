import"./web-ifc-api-Dlf_dxms.js";import{S as w}from"./stats.min-bmkVNhZk.js";import{T as h,z as b,m as g}from"./index-DtbylpTq.js";import{p as y,A as F,e as L,m as v,v as A,O as k,T as B,g as I}from"./index-6e07lNWw.js";const S=document.getElementById("container"),a=new y,U=a.get(F),t=U.create();t.scene=new L(a);t.renderer=new v(a,S);t.camera=new A(a);a.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const T=a.get(k);T.create(t);t.scene.three.background=null;const D=new B(a),z=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await z.arrayBuffer(),R=new Uint8Array(O),j=D.load(R);t.scene.three.add(j);const i=a.get(I),x={path:"https://unpkg.com/web-ifc@0.0.57/",absolute:!0};i.settings.wasm=x;i.settings.minGeometrySize=20;i.settings.minAssetsSize=1e3;let l=[],f={},u=1;i.onGeometryStreamed.add(e=>{const{buffer:s,data:n}=e,o=`small.ifc-processed-geometries-${u}`;for(const c in n){const p=n[c];p.geometryFile=o,f[c]=p}l.push({name:o,bits:[s]}),u++});let d=[];i.onAssetStreamed.add(e=>{d=[...d,...e]});i.onIfcLoaded.add(e=>{l.push({name:"small.ifc-processed-global",bits:[e]})});function C(e,...s){const n=new File(s,e),o=document.createElement("a"),c=URL.createObjectURL(n);o.href=c,o.download=n.name,o.click(),URL.revokeObjectURL(c)}async function G(e){for(const{name:s,bits:n}of e)C(s,...n),await new Promise(o=>{setTimeout(o,100)})}i.onProgress.add(e=>{e===1&&setTimeout(async()=>{const s={geometries:f,assets:d,globalDataFileId:"small.ifc-processed-global"};l.push({name:"small.ifc-processed.json",bits:[JSON.stringify(s)]}),await G(l),d=[],f={},l=[],u=1})});async function P(){const s=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),n=new Uint8Array(s);await i.streamFromBuffer(n)}const r=new w;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>r.begin());t.renderer.onAfterUpdate.add(()=>r.end());h.init();const m=b.create(()=>g`
    <bim-panel active label="Geometry tiles Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button label="Load IFC"
          @click="${()=>{P()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const $=b.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
