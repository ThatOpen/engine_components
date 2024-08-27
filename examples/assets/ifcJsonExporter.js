import{ac as m}from"./web-ifc-api-JuXSH2nk.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{d as f,R as c,m as i}from"./index-CqPyogbW.js";import{o as u,a as g,M as w,v as h,N as y,h as v,_ as k,g as x}from"./index-DtdmE_hK.js";import"./_commonjsHelpers-Cpj98o6Y.js";const I=document.getElementById("container"),t=new u,L=t.get(g),e=L.create();e.scene=new w(t);e.renderer=new h(t,I);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const U=t.get(v);U.create(e);e.scene.three.background=null;const B=new k(t),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await O.arrayBuffer(),S=new Uint8Array(R),A=B.load(S);e.scene.three.add(A);const N=t.get(x),a=new m;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.57/",!0);await a.Init();const j=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),E=await j.arrayBuffer(),F=new Uint8Array(E),_=a.OpenModel(F),n=new b;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());f.init();const s=c.create(()=>i`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await N.export(a,_),p=JSON.stringify(l),d=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(d),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const D=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(D);
