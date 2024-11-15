import{ae as d}from"./web-ifc-api-1K9lRohe.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as f,z as c,m as i}from"./index-BEvRfOoQ.js";import{C as u,T as w,e as g,m as h,x as y,y as x,a as k,N as I}from"./index-3A2kWhNU.js";import"./_commonjsHelpers-Cpj98o6Y.js";const L=document.getElementById("container"),t=new u,U=t.get(w),e=U.create();e.scene=new g(t);e.renderer=new h(t,L);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(x);v.create(e);e.scene.three.background=null;const B=new k(t),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await O.arrayBuffer(),T=new Uint8Array(S),A=B.load(T);e.scene.three.add(A);const N=t.get(I),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.57/",!0);await a.Init();const j=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),z=await j.arrayBuffer(),C=new Uint8Array(z),E=a.OpenModel(C),n=new b;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());f.init();const s=c.create(()=>i`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await N.export(a,E),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const F=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
