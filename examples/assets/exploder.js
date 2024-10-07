import{aA as l}from"./web-ifc-api-Dxv4iFj4.js";import{S as m}from"./stats.min-DYv0AsOH.js";import{T as p,z as a,m as i}from"./index-DtbylpTq.js";import{p as d,C as b,e as u,m as g,v as h,O as f,T as w,k as x,z as y,U as v}from"./index-Go5pwCUJ.js";const k=document.getElementById("container"),e=new d,S=e.get(b),t=S.create();t.scene=new u(e);t.renderer=new g(e,k);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const L=e.get(f);L.create(t);t.scene.three.background=null;const T=new w(e),U=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),z=await U.arrayBuffer(),I=new Uint8Array(z),o=T.load(I);t.scene.three.add(o);const A=await fetch("https://thatopen.github.io/engine_components/resources/small.json");o.setLocalProperties(await A.json());const r=e.get(x),B=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),C=r.getRelationsMapFromJSON(await B.text());r.setRelationMap(o,C);const E=e.get(y),O=e.get(v);await O.bySpatialStructure(o,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const s=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{E.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const j=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(j);
