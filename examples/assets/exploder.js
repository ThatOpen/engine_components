import"./web-ifc-api-CwSt8Jc1.js";import{S as l}from"./stats.min-BpIepu9J.js";import{p,J as a,m as i}from"./index-K5IA6oiZ.js";import{p as d,C as m,s as u,i as b,H as g,d as h,u as f,k as w,g as x,A as y}from"./index-CflsZ4Kv.js";const k=document.getElementById("container"),e=new d,v=e.get(m),t=v.create();t.scene=new u(e);t.renderer=new b(e,k);t.camera=new g(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=e.get(h);A.create(t);t.scene.three.background=null;const L=new f(e),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),j=await S.arrayBuffer(),B=new Uint8Array(j),s=L.load(B);t.scene.three.add(s);const C=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await C.json());const r=e.get(w),E=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),J=r.getRelationsMapFromJSON(await E.text());r.setRelationMap(s,J);const U=e.get(x),_=e.get(y);await _.bySpatialStructure(s);const n=new l;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const o=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{U.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const $=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
