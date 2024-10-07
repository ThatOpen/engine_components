import{aA as l}from"./web-ifc-api-Dlf_dxms.js";import{S as m}from"./stats.min-bmkVNhZk.js";import{T as p,z as a,m as i}from"./index-DtbylpTq.js";import{p as d,A as b,e as u,m as g,v as h,O as f,T as w,k as x,z as y,U as v}from"./index-6e07lNWw.js";const k=document.getElementById("container"),e=new d,S=e.get(b),t=S.create();t.scene=new u(e);t.renderer=new g(e,k);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=e.get(f);A.create(t);t.scene.three.background=null;const L=new w(e),T=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await T.arrayBuffer(),z=new Uint8Array(U),s=L.load(z);t.scene.three.add(s);const I=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await I.json());const r=e.get(x),B=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),E=r.getRelationsMapFromJSON(await B.text());r.setRelationMap(s,E);const O=e.get(y),j=e.get(v);await j.bySpatialStructure(s,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{O.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const F=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
