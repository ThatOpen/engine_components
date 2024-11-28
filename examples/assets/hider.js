import{ab as y}from"./web-ifc-api-nU1-R_1k.js";import{S as k}from"./stats.min-GTpOrGrX.js";import{T as x,z as r,m as l}from"./index-BEvRfOoQ.js";import{C,W as F,S as I,d as v,a as L,G as j,F as M,g as R,H as $,c as B}from"./index-C8rcJyf0.js";import"./_commonjsHelpers-Cpj98o6Y.js";const E=document.getElementById("container"),e=new C,N=e.get(F),t=N.create();t.scene=new I(e);t.renderer=new v(e,E);t.camera=new L(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const O=e.get(j);O.create(t);t.scene.three.background=null;const b=e.get(M),T=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await T.arrayBuffer(),_=new Uint8Array(U),i=b.load(_);t.scene.three.add(i);const z=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await z.json());const d=e.get(R),A=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),G=d.getRelationsMapFromJSON(await A.text());d.setRelationMap(i,G);const f=e.get($),o=e.get(B);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([y])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},H=Object.keys(o.list.spatialStructures);for(const n of H)g[n]=!0;const h={},q=Object.keys(o.list.entities);for(const n of q)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const D=s.querySelector("bim-panel-section[name='Floors']"),P=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[J,u]of b.groups){const S=d.getEntityChildren(u,c.id),w=u.getFragmentMap(S);f.set(p.value,w)}}}">
      </bim-checkbox>
    `);D.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);P.append(m)}const W=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(W);
