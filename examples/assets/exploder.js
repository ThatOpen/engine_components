import{E as l}from"./web-ifc-api-CuDRTh9k.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{T as p,L as a,m as r}from"./index-C8nqhRYO.js";import{C as d,W as b,S as u,d as g,a as f,G as h,F as w,I as S,E as x,c as y}from"./index-MG2l5tzA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const I=document.getElementById("container"),e=new d,L=e.get(b),t=L.create();t.scene=new u(e);t.renderer=new g(e,I);t.camera=new f(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=e.get(h);E.create(t);t.scene.three.background=null;const v=new w(e),C=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),k=await C.arrayBuffer(),F=new Uint8Array(k),s=v.load(F);t.scene.three.add(s);const R=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await R.json());const i=e.get(S),B=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),T=i.getRelationsMapFromJSON(await B.text());i.setRelationMap(s,T);const U=e.get(x),j=e.get(y);await j.bySpatialStructure(s,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const o=a.create(()=>r`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{U.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const A=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);
