import"./web-ifc-api-BC8YMRiS.js";import{S as g}from"./stats.min-GTpOrGrX.js";import{p as h,a as i,m as r}from"./index-DyM33b1I.js";import{f as w,p as y,s as k,i as S,k as x,N as v,u as $,W as j,g as L,R as N}from"./index-C-JPXu_n.js";import"./_commonjsHelpers-Cpj98o6Y.js";const F=document.getElementById("container"),e=new w,R=e.get(y),t=R.create();t.scene=new k(e);t.renderer=new S(e,F);t.camera=new x(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=e.get(v);A.create(t);t.scene.three.background=null;const B=e.get($),C=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await C.arrayBuffer(),U=new Uint8Array(O),c=B.load(U);t.scene.three.add(c);const _=await fetch("https://thatopen.github.io/engine_components/resources/small.json");c.setLocalProperties(await _.json());const d=e.get(j),q=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),E=d.getRelationsMapFromJSON(await q.text());d.setRelationMap(c,E);const u=e.get(L),o=e.get(N);o.byEntity(c);await o.bySpatialStructure(c);const a=new g;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());h.init();const b={},I=Object.keys(o.list.spatialStructures);for(const n of I)b[n]=!0;const f={},M=Object.keys(o.list.entities);for(const n of M)f[n]=!0;const s=i.create(()=>r`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const P=s.querySelector("bim-panel-section[name='Floors']"),W=s.querySelector("bim-panel-section[name='Categories']");for(const n in b){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({spatialStructures:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);P.append(l)}for(const n in f){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({entities:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);W.append(l)}const z=i.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
