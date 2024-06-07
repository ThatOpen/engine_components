import{a4 as c}from"./web-ifc-api-C62xsSvk.js";import{S as l}from"./stats.min-BpIepu9J.js";import{p as d,J as a,m as i}from"./index-K5IA6oiZ.js";import{p,C as m,i as b,n as u,k as f,u as g,a as h,S as w,A as y}from"./index-dcGUkgb8.js";const A=document.getElementById("container"),t=new p,k=t.get(m),e=k.create();e.scene=new b(t);e.renderer=new u(t,A);e.camera=new f(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const x=t.get(g);x.create(e);e.scene.three.background=null;const I=new h(t),L=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),v=await L.arrayBuffer(),C=new Uint8Array(v),s=I.load(C);e.scene.three.add(s);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await E.json());const S=t.get(w),T=t.get(y);T.byIfcRel(s,c,"storeys");const n=new l;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());d.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:r})=>{S.set(r.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const U=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);
