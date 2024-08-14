import{au as S}from"./web-ifc-api-CBCWqdvz.js";import{S as k}from"./stats.min-BpIepu9J.js";import{m as x,t as r,a as l}from"./index-TmOv0r_5.js";import{p as F,C,O as v,a as I,H as L,u as O,h as _,c as j,_ as $,F as B}from"./index-B7_GRGdn.js";const E=document.getElementById("container"),e=new F,M=e.get(C),t=M.create();t.scene=new v(e);t.renderer=new I(e,E);t.camera=new L(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const N=e.get(O);N.create(t);t.scene.three.background=null;const b=e.get(_),U=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),A=await U.arrayBuffer(),H=new Uint8Array(A),i=b.load(H);t.scene.three.add(i);const R=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await R.json());const d=e.get(j),q=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),D=d.getRelationsMapFromJSON(await q.text());d.setRelationMap(i,D);const f=e.get($),o=e.get(B);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([S])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},P=Object.keys(o.list.spatialStructures);for(const n of P)g[n]=!0;const h={},T=Object.keys(o.list.entities);for(const n of T)h[n]=!0;const s=r.create(()=>l`
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
    `);G.append(m)}const J=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
