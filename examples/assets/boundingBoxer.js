import"./web-ifc-api-C62xsSvk.js";import{S as c}from"./stats.min-BpIepu9J.js";import{p as l,J as a,m as i}from"./index-K5IA6oiZ.js";import{p as d,C as m,i as p,n as b,k as u,u as g,a as f,c as w}from"./index-f5QEetul.js";const h=document.getElementById("container"),t=new d,y=t.get(m),e=y.create();e.scene=new p(t);e.renderer=new b(t,h);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const B=t.get(g);B.create(e);e.scene.three.background=null;const k=t.get(f),v=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),x=await v.arrayBuffer(),L=new Uint8Array(x),r=k.load(L);e.scene.three.add(r);const s=t.get(w);s.add(r);const A=s.getMesh();s.reset();const n=new c;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>i`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(A,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const C=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);
