import{as as S}from"./web-ifc-api-BXZoUgQp.js";import{S as k}from"./stats.min-GTpOrGrX.js";import{d as x,R as r,m as l}from"./index-CqPyogbW.js";import{o as L,a as v,L as F,M as C,N as I,l as M,_ as N,J as _,m as j,d as R}from"./index-CbQqmTVP.js";import"./_commonjsHelpers-Cpj98o6Y.js";const $=document.getElementById("container"),e=new L,B=e.get(v),t=B.create();t.scene=new F(e);t.renderer=new C(e,$);t.camera=new I(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=e.get(M);E.create(t);t.scene.three.background=null;const b=e.get(N),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await O.arrayBuffer(),A=new Uint8Array(U),i=b.load(A);t.scene.three.add(i);const J=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await J.json());const d=e.get(_),q=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),D=d.getRelationsMapFromJSON(await q.text());d.setRelationMap(i,D);const f=e.get(j),o=e.get(R);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},P=Object.keys(o.list.spatialStructures);for(const n of P)g[n]=!0;const h={},T=Object.keys(o.list.entities);for(const n of T)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const z=s.querySelector("bim-panel-section[name='Floors']"),G=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[Y,u]of b.groups){const w=d.getEntityChildren(u,c.id),y=u.getFragmentMap(w);f.set(p.value,y)}}}">
      </bim-checkbox>
    `);z.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);G.append(m)}const H=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(H);
