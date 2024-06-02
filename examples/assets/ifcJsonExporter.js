import{a8 as d}from"./web-ifc-api-BffFJDIm.js";import{S as f}from"./stats.min-GTpOrGrX.js";import{p as b,a as i,m as c}from"./index-DyM33b1I.js";import{a as u}from"./index-BSAL1QGz.js";import{W as g,S as w,a as h,b as y,G as S}from"./index-C7tNMTLj.js";import{I}from"./index-DCGuIamj.js";import{F as x}from"./index-EnshWEFz.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),t=new u,L=t.get(g),e=L.create();e.scene=new w(t);e.renderer=new h(t,k);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const U=t.get(S);U.create(e);e.scene.three.background=null;const v=new x(t),B=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),F=await B.arrayBuffer(),O=new Uint8Array(F),A=v.load(O);e.scene.three.add(A);const E=t.get(I),a=new d;a.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/",!0);await a.Init();const R=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),j=await R.arrayBuffer(),C=new Uint8Array(j),J=a.OpenModel(C),n=new f;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());b.init();const s=i.create(()=>c`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const l=await E.export(a,J),p=JSON.stringify(l),m=new File([new Blob([p])],"properties.json"),r=URL.createObjectURL(m),o=document.createElement("a");o.download="properties.json",o.href=r,o.click(),URL.revokeObjectURL(r),o.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const D=i.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(D);
