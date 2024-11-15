import{ab as l}from"./web-ifc-api-1K9lRohe.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{T as p,z as a,m as i}from"./index-BEvRfOoQ.js";import{C as d,T as b,e as u,m as g,x as h,y as f,a as w,G as x,H as y,B as S}from"./index-3A2kWhNU.js";import"./_commonjsHelpers-Cpj98o6Y.js";const T=document.getElementById("container"),e=new d,v=e.get(b),t=v.create();t.scene=new u(e);t.renderer=new g(e,T);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const B=e.get(f);B.create(t);t.scene.three.background=null;const L=new w(e),k=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),I=await k.arrayBuffer(),C=new Uint8Array(I),s=L.load(C);t.scene.three.add(s);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await E.json());const r=e.get(x),U=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),j=r.getRelationsMapFromJSON(await U.text());r.setRelationMap(s,j);const z=e.get(y),A=e.get(S);await A.bySpatialStructure(s,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{z.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const F=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
