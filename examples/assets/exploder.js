import{aA as l}from"./web-ifc-api-DyW6VqW2.js";import{S as m}from"./stats.min-Bv-3LaW7.js";import{T as p,z as a,m as i}from"./index-DtbylpTq.js";import{C as d,T as b,e as u,m as g,x as h,N as f,a as w,b as x,U as y,B}from"./index-DYQXApaH.js";const S=document.getElementById("container"),e=new d,T=e.get(b),t=T.create();t.scene=new u(e);t.renderer=new g(e,S);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const v=e.get(f);v.create(t);t.scene.three.background=null;const L=new w(e),U=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),k=await U.arrayBuffer(),I=new Uint8Array(k),o=L.load(I);t.scene.three.add(o);const A=await fetch("https://thatopen.github.io/engine_components/resources/small.json");o.setLocalProperties(await A.json());const r=e.get(x),C=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),E=r.getRelationsMapFromJSON(await C.text());r.setRelationMap(o,E);const N=e.get(y),j=e.get(B);await j.bySpatialStructure(o,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const s=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{N.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const z=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
