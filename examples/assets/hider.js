import{ab as S}from"./web-ifc-api-CpQ3aV8c.js";import{S as k}from"./stats.min-GTpOrGrX.js";import{T as x,z as r,m as l}from"./index-BEvRfOoQ.js";import{C,T as L,s as v,g as F,x as T,L as B,a as I,G as j,d as $,B as E}from"./index-B03kGVBW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const M=document.getElementById("container"),e=new C,N=e.get(L),t=N.create();t.scene=new v(e);t.renderer=new F(e,M);t.camera=new T(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const O=e.get(B);O.create(t);t.scene.three.background=null;const b=e.get(I),U=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),_=await U.arrayBuffer(),z=new Uint8Array(_),i=b.load(z);t.scene.three.add(i);const A=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await A.json());const d=e.get(j),G=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),R=d.getRelationsMapFromJSON(await G.text());d.setRelationMap(i,R);const g=e.get($),o=e.get(E);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const f={},q=Object.keys(o.list.spatialStructures);for(const n of q)f[n]=!0;const h={},D=Object.keys(o.list.entities);for(const n of D)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const P=s.querySelector("bim-panel-section[name='Floors']"),H=s.querySelector("bim-panel-section[name='Categories']");for(const n in f){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[Y,u]of b.groups){const w=d.getEntityChildren(u,c.id),y=u.getFragmentMap(w);g.set(p.value,y)}}}">
      </bim-checkbox>
    `);P.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});g.set(p.value,c)}}">
      </bim-checkbox>
    `);H.append(m)}const J=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
