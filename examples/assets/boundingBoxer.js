import"./web-ifc-api-r1ed24cU.js";import{S as c}from"./stats.min-GTpOrGrX.js";import{T as l,L as a,m as r}from"./index-ByMLC5eT.js";import{C as d,W as m,S as p,d as b,a as u,G as g,F as f,q as w}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const h=document.getElementById("container"),t=new d,B=t.get(m),e=B.create();e.scene=new p(t);e.renderer=new b(t,h);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const y=t.get(g);y.create(e);e.scene.three.background=null;const S=t.get(f),x=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),L=await x.arrayBuffer(),v=new Uint8Array(L),i=S.load(v);e.scene.three.add(i);const s=t.get(w);s.add(i);const k=s.getMesh();s.reset();const n=new c;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(k,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const C=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);
