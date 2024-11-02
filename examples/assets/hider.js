import{aA as S}from"./web-ifc-api-DyW6VqW2.js";import{S as k}from"./stats.min-Bv-3LaW7.js";import{T as x,z as r,m as l}from"./index-DtbylpTq.js";import{C,T as L,e as v,m as B,x as F,N as T,a as I,b as N,L as j,B as $}from"./index-DYQXApaH.js";const A=document.getElementById("container"),e=new C,E=e.get(L),t=E.create();t.scene=new v(e);t.renderer=new B(e,A);t.camera=new F(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const M=e.get(T);M.create(t);t.scene.three.background=null;const b=e.get(I),O=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await O.arrayBuffer(),_=new Uint8Array(U),i=b.load(_);t.scene.three.add(i);const z=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await z.json());const d=e.get(N),R=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),q=d.getRelationsMapFromJSON(await R.text());d.setRelationMap(i,q);const f=e.get(j),o=e.get($);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},D=Object.keys(o.list.spatialStructures);for(const n of D)g[n]=!0;const h={},P=Object.keys(o.list.entities);for(const n of P)h[n]=!0;const s=r.create(()=>l`
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
