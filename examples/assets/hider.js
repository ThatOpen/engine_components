import{aB as y}from"./web-ifc-api-r1ed24cU.js";import{S as k}from"./stats.min-GTpOrGrX.js";import{T as x,L as r,m as l}from"./index-ByMLC5eT.js";import{C,W as F,S as I,d as L,a as v,G as j,F as B,I as M,H as R,c as $}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const E=document.getElementById("container"),e=new C,N=e.get(F),t=N.create();t.scene=new I(e);t.renderer=new L(e,E);t.camera=new v(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const O=e.get(j);O.create(t);t.scene.three.background=null;const b=e.get(B),T=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),U=await T.arrayBuffer(),_=new Uint8Array(U),i=b.load(_);t.scene.three.add(i);const A=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await A.json());const d=e.get(M),G=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),H=d.getRelationsMapFromJSON(await G.text());d.setRelationMap(i,H);const f=e.get(R),o=e.get($);o.byEntity(i);await o.bySpatialStructure(i,{isolate:new Set([y])});const a=new k;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());x.init();const g={},q=Object.keys(o.list.spatialStructures);for(const n of q)g[n]=!0;const h={},D=Object.keys(o.list.entities);for(const n of D)h[n]=!0;const s=r.create(()=>l`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const P=s.querySelector("bim-panel-section[name='Floors']"),W=s.querySelector("bim-panel-section[name='Categories']");for(const n in g){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.list.spatialStructures[n];if(c&&c.id!==null)for(const[J,u]of b.groups){const S=d.getEntityChildren(u,c.id),w=u.getFragmentMap(S);f.set(p.value,w)}}}">
      </bim-checkbox>
    `);P.append(m)}for(const n in h){const m=r.create(()=>l`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const c=o.find({entities:[n]});f.set(p.value,c)}}">
      </bim-checkbox>
    `);W.append(m)}const z=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
