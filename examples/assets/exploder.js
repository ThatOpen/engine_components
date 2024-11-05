import{aA as l}from"./web-ifc-api-BlC6WGhG.js";import{S as m}from"./stats.min-ClRtqrR4.js";import{T as p,z as a,m as i}from"./index-DtbylpTq.js";import{C as d,T as b,e as u,m as g,x as h,N as f,a as w,G as x,k as y,B as k}from"./index-D5jRLLPO.js";const S=document.getElementById("container"),e=new d,T=e.get(b),t=T.create();t.scene=new u(e);t.renderer=new g(e,S);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const v=e.get(f);v.create(t);t.scene.three.background=null;const B=new w(e),L=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),I=await L.arrayBuffer(),A=new Uint8Array(I),o=B.load(A);t.scene.three.add(o);const C=await fetch("https://thatopen.github.io/engine_components/resources/small.json");o.setLocalProperties(await C.json());const r=e.get(x),E=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),N=r.getRelationsMapFromJSON(await E.text());r.setRelationMap(o,N);const U=e.get(y),j=e.get(k);await j.bySpatialStructure(o,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const s=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{U.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const z=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
