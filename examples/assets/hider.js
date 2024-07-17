import"./web-ifc-api-5J0YW9AE.js";import{S as k}from"./stats.min-BpIepu9J.js";import{m as S,t as r,a as l}from"./index-tywNknxv.js";import{p as x,C as v,s as C,i as F,H as _,d as j,h as A,k as L,_ as $,A as M}from"./index-BemOs1Zp.js";const B=document.getElementById("container"),e=new x,E=e.get(v),t=E.create();t.scene=new C(e);t.renderer=new F(e,B);t.camera=new _(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const H=e.get(j);H.create(t);t.scene.three.background=null;const b=e.get(A),I=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),N=await I.arrayBuffer(),O=new Uint8Array(N),i=b.load(O);t.scene.three.add(i);const U=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await U.json());const d=e.get(L),q=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),P=d.getRelationsMapFromJSON(await q.text());d.setRelationMap(i,P);const f=e.get($),o=e.get(M);o.byEntity(i);await o.bySpatialStructure(i);const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());S.init();const g={},R=Object.keys(o.list.spatialStructures);for(const n of R)g[n]=!0;const h={},z=Object.keys(o.list.entities);for(const n of z)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const D=s.querySelector("bim-panel-section[name='Floors']"),J=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[G,u]of b.groups){const w=d.getElementsChildren(u,c.id),y=u.getFragmentMap(w);f.set(p.value,y)}}}">
      </bim-checkbox>
    `);D.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);J.append(m)}const T=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
