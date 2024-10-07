import"./web-ifc-api-Dxv4iFj4.js";import{S as i}from"./stats.min-DYv0AsOH.js";import{T as l,z as a,m as r}from"./index-DtbylpTq.js";import{p as d,C as m,e as p,m as b,v as u,O as g,T as f,w}from"./index-Go5pwCUJ.js";const h=document.getElementById("container"),t=new d,y=t.get(m),e=y.create();e.scene=new p(t);e.renderer=new b(t,h);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(g);v.create(e);e.scene.three.background=null;const B=t.get(f),T=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),x=await T.arrayBuffer(),k=new Uint8Array(x),c=B.load(k);e.scene.three.add(c);const s=t.get(w);s.add(c);const L=s.getMesh();s.reset();const n=new i;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(L,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const z=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
