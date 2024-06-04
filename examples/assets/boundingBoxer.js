import"./web-ifc-api-D3oDn2HF.js";import{S as c}from"./stats.min-DDrWCSVO.js";import{p as l,J as a,m as r}from"./index-K5IA6oiZ.js";import{a as d,W as m,S as p,c as b,b as u,G as g,F as f,B as w}from"./index-DPB0U-mi.js";const h=document.getElementById("container"),t=new d,B=t.get(m),e=B.create();e.scene=new p(t);e.renderer=new b(t,h);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const y=t.get(g);y.create(e);e.scene.three.background=null;const S=t.get(f),x=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),v=await x.arrayBuffer(),k=new Uint8Array(v),i=S.load(k);e.scene.three.add(i);const s=t.get(w);s.add(i);const L=s.getMesh();s.reset();const n=new c;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(L,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const A=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);
