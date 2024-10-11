import{aA as k}from"./web-ifc-api-Dxv4iFj4.js";import{S}from"./stats.min-DYv0AsOH.js";import{T as x,z as r,m as l}from"./index-DtbylpTq.js";import{C,T as v,e as F,m as T,U as I,O as L,a as O,k as U,c as j,x as M}from"./index-BRzxhLMM.js";const $=document.getElementById("container"),e=new C,A=e.get(v),t=A.create();t.scene=new F(e);t.renderer=new T(e,$);t.camera=new I(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const B=e.get(L);B.create(t);t.scene.three.background=null;const b=e.get(O),E=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),N=await E.arrayBuffer(),_=new Uint8Array(N),i=b.load(_);t.scene.three.add(i);const z=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await z.json());const d=e.get(U),R=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),q=d.getRelationsMapFromJSON(await R.text());d.setRelationMap(i,q);const f=e.get(j),o=e.get(M);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([k])});const a=new S;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},D=Object.keys(o.list.spatialStructures);for(const n of D)g[n]=!0;const h={},P=Object.keys(o.list.entities);for(const n of P)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const G=s.querySelector("bim-panel-section[name='Floors']"),H=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[Y,u]of b.groups){const w=d.getEntityChildren(u,c.id),y=u.getFragmentMap(w);f.set(p.value,y)}}}">
      </bim-checkbox>
    `);G.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);H.append(m)}const J=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
