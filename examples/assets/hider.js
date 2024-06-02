import"./web-ifc-api-BffFJDIm.js";import{S as g}from"./stats.min-GTpOrGrX.js";import{p as h,a as i,m as r}from"./index-DyM33b1I.js";import{p as w,C as y,i as k,n as S,k as x,a as v,u as $,W as j,_ as C,c as L}from"./index-D43g96vP.js";import"./_commonjsHelpers-Cpj98o6Y.js";const _=document.getElementById("container"),e=new w,A=e.get(y),t=A.create();t.scene=new k(e);t.renderer=new S(e,_);t.camera=new x(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const F=e.get(v);F.create(t);t.scene.three.background=null;const B=e.get($),N=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await N.arrayBuffer(),U=new Uint8Array(O),c=B.load(U);t.scene.three.add(c);const q=await fetch("https://thatopen.github.io/engine_components/resources/small.json");c.setLocalProperties(await q.json());const d=e.get(j),E=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),I=d.getRelationsMapFromJSON(await E.text());d.setRelationMap(c,I);const u=e.get(C),o=e.get(L);o.byEntity(c);await o.bySpatialStructure(c);const a=new g;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());h.init();const b={},M=Object.keys(o.list.spatialStructures);for(const n of M)b[n]=!0;const f={},P=Object.keys(o.list.entities);for(const n of P)f[n]=!0;const s=i.create(()=>r`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const R=s.querySelector("bim-panel-section[name='Floors']"),W=s.querySelector("bim-panel-section[name='Categories']");for(const n in b){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({spatialStructures:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);R.append(l)}for(const n in f){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({entities:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);W.append(l)}const z=i.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
