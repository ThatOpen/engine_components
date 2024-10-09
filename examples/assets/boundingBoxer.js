import"./web-ifc-api-Dxv4iFj4.js";import{S as i}from"./stats.min-DYv0AsOH.js";import{T as l,z as a,m as r}from"./index-DtbylpTq.js";import{C as d,T as m,e as b,m as p,U as u,O as g,a as f,w}from"./index-2dtfnFEV.js";const h=document.getElementById("container"),t=new d,y=t.get(m),e=y.create();e.scene=new b(t);e.renderer=new p(t,h);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const B=t.get(g);B.create(e);e.scene.three.background=null;const T=t.get(f),v=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),x=await v.arrayBuffer(),U=new Uint8Array(x),c=T.load(U);e.scene.three.add(c);const s=t.get(w);s.add(c);const k=s.getMesh();s.reset();const n=new i;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(k,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const L=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(L);
