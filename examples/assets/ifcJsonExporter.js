import{_ as d}from"./web-ifc-api-DyW6VqW2.js";import{S as b}from"./stats.min-Bv-3LaW7.js";import{T as f,z as c,m as i}from"./index-DtbylpTq.js";import{C as u,T as g,e as w,m as h,x as y,N as x,a as k,g as I}from"./index-DYQXApaH.js";const L=document.getElementById("container"),t=new u,U=t.get(g),e=U.create();e.scene=new w(t);e.renderer=new h(t,L);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(x);v.create(e);e.scene.three.background=null;const B=new k(t),N=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await N.arrayBuffer(),S=new Uint8Array(O),T=B.load(S);e.scene.three.add(T);const A=t.get(I),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.57/",!0);await a.Init();const j=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),z=await j.arrayBuffer(),C=new Uint8Array(z),E=a.OpenModel(C),n=new b;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());f.init();const s=c.create(()=>i`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await A.export(a,E),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const F=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
