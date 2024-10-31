import{Y as d}from"./web-ifc-api-BlC6WGhG.js";import{S as f}from"./stats.min-ClRtqrR4.js";import{T as b,z as c,m as i}from"./index-DtbylpTq.js";import{C as u,T as w,e as g,m as h,x as y,O as x,a as O,f as k}from"./index-B-8uKlMo.js";const I=document.getElementById("container"),t=new u,L=t.get(w),e=L.create();e.scene=new g(t);e.renderer=new h(t,I);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const U=t.get(x);U.create(e);e.scene.three.background=null;const v=new O(t),B=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await B.arrayBuffer(),T=new Uint8Array(S),A=v.load(T);e.scene.three.add(A);const j=t.get(k),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.57/",!0);await a.Init();const z=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),C=await z.arrayBuffer(),E=new Uint8Array(C),F=a.OpenModel(E),n=new f;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());b.init();const s=c.create(()=>i`
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
