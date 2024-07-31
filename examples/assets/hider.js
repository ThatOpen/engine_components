import{aq as S}from"./web-ifc-api-56EJvEs4.js";import{S as k}from"./stats.min-BpIepu9J.js";import{m as x,t as r,a as l}from"./index-TmOv0r_5.js";import{p as C,C as v,o as F,r as I,W as L,u as _,h as j,c as A,_ as $,A as B}from"./index-BcIWfMQD.js";const E=document.getElementById("container"),e=new C,M=e.get(v),t=M.create();t.scene=new F(e);t.renderer=new I(e,E);t.camera=new L(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const N=e.get(_);N.create(t);t.scene.three.background=null;const b=e.get(j),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await O.arrayBuffer(),q=new Uint8Array(U),i=b.load(q);t.scene.three.add(i);const R=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await R.json());const d=e.get(A),D=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),P=d.getRelationsMapFromJSON(await D.text());d.setRelationMap(i,P);const f=e.get($),s=e.get(B);s.byEntity(i);await s.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},T=Object.keys(s.list.spatialStructures);for(const n of T)g[n]=!0;const h={},W=Object.keys(s.list.entities);for(const n of W)h[n]=!0;const o=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(o);const z=o.querySelector("bim-panel-section[name='Floors']"),G=o.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=s.list.spatialStructures[n];if(c&&c.id!==null)for(const[J,u]of b.groups){const w=d.getEntityChildren(u,c.id),y=u.getFragmentMap(w);f.set(p.value,y)}}}">
      </bim-checkbox>
    `);z.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=s.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);G.append(m)}const H=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(H);
