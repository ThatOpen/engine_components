import{av as l}from"./web-ifc-api-JuXSH2nk.js";import{S as d}from"./stats.min-GTpOrGrX.js";import{d as m,R as a,m as i}from"./index-CqPyogbW.js";import{o as p,a as b,M as u,v as g,N as h,h as w,_ as f,x,w as v,b as y}from"./index-DtdmE_hK.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),e=new p,L=e.get(b),t=L.create();t.scene=new u(e);t.renderer=new g(e,S);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const k=e.get(w);k.create(t);t.scene.three.background=null;const I=new f(e),R=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),_=await R.arrayBuffer(),B=new Uint8Array(_),s=I.load(B);t.scene.three.add(s);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await E.json());const r=e.get(x),M=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),N=r.getRelationsMapFromJSON(await M.text());r.setRelationMap(s,N);const U=e.get(v),j=e.get(y);await j.bySpatialStructure(s,{isolate:new Set([l])});const n=new d;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());m.init();const o=a.create(()=>i`
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
