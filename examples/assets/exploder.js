import{ao as l}from"./web-ifc-api-CfQNUy7g.js";import{S as p}from"./stats.min-BpIepu9J.js";import{m,t as a,a as i}from"./index-tywNknxv.js";import{p as d,C as b,i as u,n as g,W as h,d as f,h as w,a as x,O as y,A as S}from"./index-D2xchnNe.js";const v=document.getElementById("container"),e=new d,L=e.get(b),t=L.create();t.scene=new u(e);t.renderer=new g(e,v);t.camera=new h(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const k=e.get(f);k.create(t);t.scene.three.background=null;const A=new w(e),I=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),B=await I.arrayBuffer(),C=new Uint8Array(B),s=A.load(C);t.scene.three.add(s);const E=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await E.json());const r=e.get(x),O=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),U=r.getRelationsMapFromJSON(await O.text());r.setRelationMap(s,U);const j=e.get(y),F=e.get(S);await F.bySpatialStructure(s,{isolate:new Set([l])});const n=new p;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());m.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{j.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const R=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(R);
