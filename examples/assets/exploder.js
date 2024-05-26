import{a7 as c}from"./web-ifc-api-BC8YMRiS.js";import{S as l}from"./stats.min-GTpOrGrX.js";import{p,a,m as i}from"./index-DyM33b1I.js";import{f as d,p as m,s as b,i as u,k as f,N as g,u as h,O as w,R as y}from"./index-CLKLHy3P.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),t=new d,x=t.get(m),e=x.create();e.scene=new b(t);e.renderer=new u(t,k);e.camera=new f(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const I=t.get(g);I.create(e);e.scene.three.background=null;const L=new h(t),v=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),A=await v.arrayBuffer(),E=new Uint8Array(A),s=L.load(E);e.scene.three.add(s);const R=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await R.json());const N=t.get(w),T=t.get(y);T.byIfcRel(s,c,"storeys");const n=new l;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());p.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:r})=>{N.set(r.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const U=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);
