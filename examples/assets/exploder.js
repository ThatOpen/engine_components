import{aq as l}from"./web-ifc-api-56EJvEs4.js";import{S as p}from"./stats.min-BpIepu9J.js";import{m,t as a,a as i}from"./index-TmOv0r_5.js";import{p as d,C as u,o as b,r as g,W as h,u as f,h as w,c as x,S as y,A as S}from"./index-BcIWfMQD.js";const v=document.getElementById("container"),e=new d,L=e.get(u),t=L.create();t.scene=new b(e);t.renderer=new g(e,v);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const k=e.get(f);k.create(t);t.scene.three.background=null;const A=new w(e),I=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),B=await I.arrayBuffer(),C=new Uint8Array(B),s=A.load(C);t.scene.three.add(s);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await E.json());const r=e.get(x),U=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),j=r.getRelationsMapFromJSON(await U.text());r.setRelationMap(s,j);const F=e.get(y),R=e.get(S);await R.bySpatialStructure(s,{isolate:new Set([l])});const n=new p;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());m.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{F.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const _=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(_);
