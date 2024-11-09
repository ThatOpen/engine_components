import{aA as l}from"./web-ifc-api-B6ue9hUU.js";import{S as m}from"./stats.min-CtzdRBYU.js";import{T as p,z as a,m as i}from"./index-DtbylpTq.js";import{C as d,T as b,e as u,m as g,x as h,y as f,a as w,G as x,H as y,B as S}from"./index-BVVn3bHk.js";const T=document.getElementById("container"),e=new d,v=e.get(b),t=v.create();t.scene=new u(e);t.renderer=new g(e,T);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const B=e.get(f);B.create(t);t.scene.three.background=null;const L=new w(e),k=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),I=await k.arrayBuffer(),A=new Uint8Array(I),o=L.load(A);t.scene.three.add(o);const C=await fetch("https://thatopen.github.io/engine_components/resources/small.json");o.setLocalProperties(await C.json());const r=e.get(x),E=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),U=r.getRelationsMapFromJSON(await E.text());r.setRelationMap(o,U);const j=e.get(y),z=e.get(S);await z.bySpatialStructure(o,{isolate:new Set([l])});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const s=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{j.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const F=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
