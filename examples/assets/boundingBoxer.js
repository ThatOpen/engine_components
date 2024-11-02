import"./web-ifc-api-DyW6VqW2.js";import{S as i}from"./stats.min-Bv-3LaW7.js";import{T as l,z as a,m as r}from"./index-DtbylpTq.js";import{C as d,T as m,e as b,m as p,x as u,N as g,a as f,y as h}from"./index-DYQXApaH.js";const w=document.getElementById("container"),t=new d,y=t.get(m),e=y.create();e.scene=new b(t);e.renderer=new p(t,w);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const x=t.get(g);x.create(e);e.scene.three.background=null;const B=t.get(f),T=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),v=await T.arrayBuffer(),k=new Uint8Array(v),c=B.load(k);e.scene.three.add(c);const s=t.get(h);s.add(c);const L=s.getMesh();s.reset();const n=new i;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
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
