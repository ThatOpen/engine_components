import"./web-ifc-api-JuXSH2nk.js";import{S as c}from"./stats.min-GTpOrGrX.js";import{d as l,R as a,m as r}from"./index-CqPyogbW.js";import{o as d,a as m,M as p,v as b,N as u,h as g,_ as f,m as h}from"./index-DtdmE_hK.js";import"./_commonjsHelpers-Cpj98o6Y.js";const w=document.getElementById("container"),t=new d,y=t.get(m),e=y.create();e.scene=new p(t);e.renderer=new b(t,w);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(g);v.create(e);e.scene.three.background=null;const B=t.get(f),x=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),k=await x.arrayBuffer(),L=new Uint8Array(k),i=B.load(L);e.scene.three.add(i);const s=t.get(h);s.add(i);const M=s.getMesh();s.reset();const n=new c;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(M,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const A=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);
