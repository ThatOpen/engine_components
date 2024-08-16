import{as as l}from"./web-ifc-api-BXZoUgQp.js";import{S as d}from"./stats.min-GTpOrGrX.js";import{d as m,R as a,m as i}from"./index-CqPyogbW.js";import{o as p,a as b,L as u,M as g,N as f,l as h,_ as w,J as y,y as x,d as L}from"./index-CbQqmTVP.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),e=new p,v=e.get(b),t=v.create();t.scene=new u(e);t.renderer=new g(e,S);t.camera=new f(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const k=e.get(h);k.create(t);t.scene.three.background=null;const I=new w(e),R=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),_=await R.arrayBuffer(),B=new Uint8Array(_),s=I.load(B);t.scene.three.add(s);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await E.json());const r=e.get(y),M=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),N=r.getRelationsMapFromJSON(await M.text());r.setRelationMap(s,N);const U=e.get(x),j=e.get(L);await j.bySpatialStructure(s,{isolate:new Set([l])});const n=new d;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());m.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{U.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const A=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);
