import{az as d}from"./web-ifc-api-z0lP7pyY.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{p as b,a as i,m as c}from"./index-DyM33b1I.js";import{p as f,C as w,i as g,n as h,k as y,a as k,u as x,m as I}from"./index-CDtayhLQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";const L=document.getElementById("container"),t=new f,U=t.get(w),e=U.create();e.scene=new g(t);e.renderer=new h(t,L);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(k);v.create(e);e.scene.three.background=null;const B=new x(t),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await O.arrayBuffer(),A=new Uint8Array(S),j=B.load(A);e.scene.three.add(j);const C=t.get(I),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/",!0);await a.Init();const E=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),F=await E.arrayBuffer(),R=new Uint8Array(F),z=a.OpenModel(R),n=new u;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());b.init();const s=i.create(()=>c`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await C.export(a,z),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const D=i.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(D);
