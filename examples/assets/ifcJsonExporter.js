import{ab as d}from"./web-ifc-api-CBCWqdvz.js";import{S as u}from"./stats.min-BpIepu9J.js";import{m as b,t as i,a as c}from"./index-TmOv0r_5.js";import{p as f,C as w,O as g,a as h,H as y,u as k,h as x,m as I}from"./index-B7_GRGdn.js";const L=document.getElementById("container"),t=new f,O=t.get(w),e=O.create();e.scene=new g(t);e.renderer=new h(t,L);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const U=t.get(k);U.create(e);e.scene.three.background=null;const v=new x(t),B=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await B.arrayBuffer(),A=new Uint8Array(S),j=v.load(A);e.scene.three.add(j);const C=t.get(I),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.56/",!0);await a.Init();const E=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),F=await E.arrayBuffer(),R=new Uint8Array(F),D=a.OpenModel(R),n=new u;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());b.init();const s=i.create(()=>c`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await C.export(a,D),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const J=i.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
