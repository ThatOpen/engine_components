import{ae as d}from"./web-ifc-api-CpQ3aV8c.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as f,z as c,m as i}from"./index-BEvRfOoQ.js";import{C as u,T as g,s as w,g as h,x as y,L as x,a as L,y as k}from"./index-B03kGVBW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const I=document.getElementById("container"),t=new u,U=t.get(g),e=U.create();e.scene=new w(t);e.renderer=new h(t,I);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(x);v.create(e);e.scene.three.background=null;const B=new L(t),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await O.arrayBuffer(),T=new Uint8Array(S),A=B.load(T);e.scene.three.add(A);const j=t.get(k),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.57/",!0);await a.Init();const z=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),C=await z.arrayBuffer(),E=new Uint8Array(C),F=a.OpenModel(E),n=new b;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());f.init();const s=c.create(()=>i`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await j.export(a,F),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const R=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(R);
