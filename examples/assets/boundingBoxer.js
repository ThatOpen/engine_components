import"./web-ifc-api-BC8YMRiS.js";import{S as c}from"./stats.min-GTpOrGrX.js";import{p as l,a,m as r}from"./index-DyM33b1I.js";import{f as d,p as m,s as p,i as b,k as u,N as f,u as g,A as w}from"./index-C-JPXu_n.js";import"./_commonjsHelpers-Cpj98o6Y.js";const h=document.getElementById("container"),t=new d,y=t.get(m),e=y.create();e.scene=new p(t);e.renderer=new b(t,h);e.camera=new u(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const B=t.get(f);B.create(e);e.scene.three.background=null;const k=t.get(g),v=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),x=await v.arrayBuffer(),A=new Uint8Array(x),i=k.load(A);e.scene.three.add(i);const s=t.get(w);s.add(i);const L=s.getMesh();s.reset();const n=new c;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());l.init();const o=a.create(()=>r`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${()=>{e.camera.controls.fitToSphere(L,!0)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const I=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(I);
