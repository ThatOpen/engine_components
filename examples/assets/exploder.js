import{ab as l}from"./web-ifc-api-CpQ3aV8c.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{T as p,z as a,m as i}from"./index-BEvRfOoQ.js";import{C as d,T as b,s as u,g,x as h,L as f,a as w,G as x,X as y,B as L}from"./index-B03kGVBW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),e=new d,T=e.get(b),t=T.create();t.scene=new u(e);t.renderer=new g(e,S);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const v=e.get(f);v.create(t);t.scene.three.background=null;const B=new w(e),k=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),I=await k.arrayBuffer(),C=new Uint8Array(I),o=B.load(C);t.scene.three.add(o);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");o.setLocalProperties(await E.json());const r=e.get(x),U=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),j=r.getRelationsMapFromJSON(await U.text());r.setRelationMap(o,j);const z=e.get(y),A=e.get(L);await A.bySpatialStructure(o,{isolate:new Set([l])});const s=new m;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());p.init();const n=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{z.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(n);const F=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{n.classList.contains("options-menu-visible")?n.classList.remove("options-menu-visible"):n.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
