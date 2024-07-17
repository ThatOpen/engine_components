import"./web-ifc-api-5J0YW9AE.js";import{S as l}from"./stats.min-BpIepu9J.js";import{m as p,t as a,a as i}from"./index-tywNknxv.js";import{p as d,C as m,s as b,i as u,H as g,d as h,h as f,k as w,g as x,A as y}from"./index-BemOs1Zp.js";const k=document.getElementById("container"),e=new d,v=e.get(m),t=v.create();t.scene=new b(e);t.renderer=new u(e,k);t.camera=new g(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=e.get(h);A.create(t);t.scene.three.background=null;const L=new f(e),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),j=await S.arrayBuffer(),B=new Uint8Array(j),o=L.load(B);t.scene.three.add(o);const C=await fetch("https://thatopen.github.io/engine_components/resources/small.json");o.setLocalProperties(await C.json());const r=e.get(w),E=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),U=r.getRelationsMapFromJSON(await E.text());r.setRelationMap(o,U);const _=e.get(x),F=e.get(y);await F.bySpatialStructure(o);const n=new l;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>n.begin());t.renderer.onAfterUpdate.add(()=>n.end());p.init();const s=a.create(()=>i`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:c})=>{_.set(c.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const H=a.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(H);
