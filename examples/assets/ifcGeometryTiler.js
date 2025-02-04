import"./web-ifc-api-BlmMr04K.js";import{S as w}from"./stats.min-GTpOrGrX.js";import{T as y,L as b,m as g}from"./index-C8nqhRYO.js";import{C as h,W as F,S,d as L,a as I,G as B,F as U,p as k}from"./index-CVzIUIEt.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),a=new h,A=a.get(F),t=A.create();t.scene=new S(a);t.renderer=new L(a,v);t.camera=new I(a);a.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const C=a.get(B);C.create(t);t.scene.three.background=null;const D=new U(a),G=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),T=await G.arrayBuffer(),R=new Uint8Array(T),j=D.load(R);t.scene.three.add(j);const r=a.get(k),x={path:"https://unpkg.com/web-ifc@0.0.66/",absolute:!0};r.settings.wasm=x;r.settings.minGeometrySize=20;r.settings.minAssetsSize=1e3;let l=[],f={},p=1;r.onGeometryStreamed.add(e=>{const{buffer:s,data:n}=e,o=`small.ifc-processed-geometries-${p}`;for(const c in n){const u=n[c];u.geometryFile=o,f[c]=u}l.push({name:o,bits:[s]}),p++});let d=[];r.onAssetStreamed.add(e=>{d=[...d,...e]});r.onIfcLoaded.add(e=>{l.push({name:"small.ifc-processed-global",bits:[e]})});function z(e,...s){const n=new File(s,e),o=document.createElement("a"),c=URL.createObjectURL(n);o.href=c,o.download=n.name,o.click(),URL.revokeObjectURL(c)}async function O(e){for(const{name:s,bits:n}of e)z(s,...n),await new Promise(o=>{setTimeout(o,100)})}r.onProgress.add(e=>{e===1&&setTimeout(async()=>{const s={geometries:f,assets:d,globalDataFileId:"small.ifc-processed-global"};l.push({name:"small.ifc-processed.json",bits:[JSON.stringify(s)]}),await O(l),d=[],f={},l=[],p=1})});async function P(){const s=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),n=new Uint8Array(s);await r.streamFromBuffer(n)}const i=new w;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());y.init();const m=b.create(()=>g`
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
