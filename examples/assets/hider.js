import{ao as S}from"./web-ifc-api-Du2rJhcJ.js";import{S as k}from"./stats.min-BpIepu9J.js";import{m as x,t as r,a as l}from"./index-tywNknxv.js";import{p as C,C as v,o as F,r as I,W as L,d as j,h as A,b as $,S as B,A as E}from"./index-BPLzurvS.js";const M=document.getElementById("container"),e=new C,N=e.get(v),t=N.create();t.scene=new F(e);t.renderer=new I(e,M);t.camera=new L(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const O=e.get(j);O.create(t);t.scene.three.background=null;const b=e.get(A),U=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),_=await U.arrayBuffer(),R=new Uint8Array(_),i=b.load(R);t.scene.three.add(i);const q=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await q.json());const d=e.get($),D=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),P=d.getRelationsMapFromJSON(await D.text());d.setRelationMap(i,P);const f=e.get(B),s=e.get(E);s.byEntity(i);await s.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},T=Object.keys(s.list.spatialStructures);for(const n of T)g[n]=!0;const h={},W=Object.keys(s.list.entities);for(const n of W)h[n]=!0;const o=r.create(()=>l`
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
