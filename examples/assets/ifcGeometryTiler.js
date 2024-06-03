import"./web-ifc-api-z0lP7pyY.js";import{S as w}from"./stats.min-GTpOrGrX.js";import{p as h,a as b,m as g}from"./index-DyM33b1I.js";import{p as y,C as F,i as L,n as k,k as B,a as I,u as S,N as U}from"./index-CDtayhLQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),a=new y,A=a.get(F),t=A.create();t.scene=new L(a);t.renderer=new k(a,v);t.camera=new B(a);a.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const D=a.get(I);D.create(t);t.scene.three.background=null;const C=new S(a),N=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await N.arrayBuffer(),$=new Uint8Array(R),j=C.load($);t.scene.three.add(j);const i=a.get(U),x={path:"https://unpkg.com/web-ifc@0.0.53/",absolute:!0};i.settings.wasm=x;i.settings.minGeometrySize=20;i.settings.minAssetsSize=1e3;let l=[],f={},u=1;i.onGeometryStreamed.add(e=>{const{buffer:s,data:n}=e,o=`small.ifc-processed-geometries-${u}`;for(const c in n){const p=n[c];p.geometryFile=o,f[c]=p}l.push({name:o,bits:[s]}),u++});let d=[];i.onAssetStreamed.add(e=>{d=[...d,...e]});i.onIfcLoaded.add(e=>{l.push({name:"small.ifc-processed-global",bits:[e]})});function z(e,...s){const n=new File(s,e),o=document.createElement("a"),c=URL.createObjectURL(n);o.href=c,o.download=n.name,o.click(),URL.revokeObjectURL(c)}async function G(e){for(const{name:s,bits:n}of e)z(s,...n),await new Promise(o=>{setTimeout(o,100)})}i.onProgress.add(e=>{e===1&&setTimeout(async()=>{const s={geometries:f,assets:d,globalDataFileId:"small.ifc-processed-global"};l.push({name:"small.ifc-processed.json",bits:[JSON.stringify(s)]}),await G(l),d=[],f={},l=[],u=1})});async function O(){const s=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),n=new Uint8Array(s);await i.streamFromBuffer(n)}const r=new w;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>r.begin());t.renderer.onAfterUpdate.add(()=>r.end());h.init();const m=b.create(()=>g`
    <bim-panel active label="Geometry tiles Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button label="Load IFC"
          @click="${()=>{O()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(m);const P=b.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);
