import{au as d}from"./web-ifc-api-D3oDn2HF.js";import{S as b}from"./stats.min-DDrWCSVO.js";import{p as f,J as c,m as i}from"./index-K5IA6oiZ.js";import{a as u,W as g,S as w,c as h,b as y,G as S,F as k,k as x}from"./index-DPB0U-mi.js";const I=document.getElementById("container"),t=new u,L=t.get(g),e=L.create();e.scene=new w(t);e.renderer=new h(t,I);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const U=t.get(S);U.create(e);e.scene.three.background=null;const v=new k(t),B=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),F=await B.arrayBuffer(),J=new Uint8Array(F),O=v.load(J);e.scene.three.add(O);const A=t.get(x),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/",!0);await a.Init();const E=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),R=await E.arrayBuffer(),j=new Uint8Array(R),C=a.OpenModel(j),n=new b;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());f.init();const s=c.create(()=>i`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await A.export(a,C),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const D=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(D);
