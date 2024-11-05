import{aA as S}from"./web-ifc-api-BlC6WGhG.js";import{S as k}from"./stats.min-ClRtqrR4.js";import{T as x,z as r,m as l}from"./index-DtbylpTq.js";import{C,T as v,e as F,m as T,x as B,N as I,a as L,G as N,D as j,B as $}from"./index-D5jRLLPO.js";const A=document.getElementById("container"),e=new C,D=e.get(v),t=D.create();t.scene=new F(e);t.renderer=new T(e,A);t.camera=new B(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=e.get(I);E.create(t);t.scene.three.background=null;const b=e.get(L),M=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await M.arrayBuffer(),U=new Uint8Array(O),i=b.load(U);t.scene.three.add(i);const _=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await _.json());const d=e.get(N),z=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),G=d.getRelationsMapFromJSON(await z.text());d.setRelationMap(i,G);const f=e.get(j),o=e.get($);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},R=Object.keys(o.list.spatialStructures);for(const n of R)g[n]=!0;const h={},q=Object.keys(o.list.entities);for(const n of q)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const P=s.querySelector("bim-panel-section[name='Floors']"),H=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[Y,u]of b.groups){const w=d.getEntityChildren(u,c.id),y=u.getFragmentMap(w);f.set(p.value,y)}}}">
      </bim-checkbox>
    `);P.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);H.append(m)}const J=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
