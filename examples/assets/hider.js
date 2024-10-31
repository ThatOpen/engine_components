import{aA as S}from"./web-ifc-api-BlC6WGhG.js";import{S as k}from"./stats.min-ClRtqrR4.js";import{T as x,z as r,m as l}from"./index-DtbylpTq.js";import{C,T as v,e as F,m as T,x as B,O as I,a as L,G as O,b as j,B as M}from"./index-B-8uKlMo.js";const $=document.getElementById("container"),e=new C,A=e.get(v),t=A.create();t.scene=new F(e);t.renderer=new T(e,$);t.camera=new B(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=e.get(I);E.create(t);t.scene.three.background=null;const b=e.get(L),N=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await N.arrayBuffer(),_=new Uint8Array(U),i=b.load(_);t.scene.three.add(i);const z=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await z.json());const d=e.get(O),G=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),R=d.getRelationsMapFromJSON(await G.text());d.setRelationMap(i,R);const f=e.get(j),o=e.get(M);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},q=Object.keys(o.list.spatialStructures);for(const n of q)g[n]=!0;const h={},D=Object.keys(o.list.entities);for(const n of D)h[n]=!0;const s=r.create(()=>l`
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
