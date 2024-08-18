import{av as S}from"./web-ifc-api-CgBULNZm.js";import{S as k}from"./stats.min-GTpOrGrX.js";import{d as x,R as r,m as l}from"./index-CqPyogbW.js";import{o as v,a as L,L as F,M as C,N as I,l as M,_ as N,J as _,m as j,b as R}from"./index-C11PlHsI.js";import"./_commonjsHelpers-Cpj98o6Y.js";const $=document.getElementById("container"),e=new v,B=e.get(L),t=B.create();t.scene=new F(e);t.renderer=new C(e,$);t.camera=new I(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=e.get(M);E.create(t);t.scene.three.background=null;const b=e.get(N),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await O.arrayBuffer(),A=new Uint8Array(U),i=b.load(A);t.scene.three.add(i);const J=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await J.json());const d=e.get(_),q=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),D=d.getRelationsMapFromJSON(await q.text());d.setRelationMap(i,D);const f=e.get(j),s=e.get(R);s.byEntity(i);await s.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},P=Object.keys(s.list.spatialStructures);for(const n of P)g[n]=!0;const h={},T=Object.keys(s.list.entities);for(const n of T)h[n]=!0;const o=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(o);const z=o.querySelector("bim-panel-section[name='Floors']"),G=o.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=s.list.spatialStructures[n];if(c&&c.id!==null)for(const[Y,u]of b.groups){const w=d.getEntityChildren(u,c.id),y=u.getFragmentMap(w);f.set(p.value,y)}}}">
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
