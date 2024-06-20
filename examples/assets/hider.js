import"./web-ifc-api-CwSt8Jc1.js";import{S as g}from"./stats.min-BpIepu9J.js";import{p as h,J as i,m as r}from"./index-K5IA6oiZ.js";import{p as w,C as y,s as k,i as S,H as x,d as v,u as $,k as j,_ as A,A as C}from"./index-BVLgAR8-.js";const L=document.getElementById("container"),e=new w,_=e.get(y),t=_.create();t.scene=new k(e);t.renderer=new S(e,L);t.camera=new x(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const F=e.get(v);F.create(t);t.scene.three.background=null;const B=e.get($),H=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),J=await H.arrayBuffer(),N=new Uint8Array(J),c=B.load(N);t.scene.three.add(c);const O=await fetch("https://thatopen.github.io/engine_components/resources/small.json");c.setLocalProperties(await O.json());const d=e.get(j),U=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),q=d.getRelationsMapFromJSON(await U.text());d.setRelationMap(c,q);const u=e.get(A),o=e.get(C);o.byEntity(c);await o.bySpatialStructure(c);const a=new g;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());h.init();const b={},E=Object.keys(o.list.spatialStructures);for(const n of E)b[n]=!0;const f={},I=Object.keys(o.list.entities);for(const n of I)f[n]=!0;const s=i.create(()=>r`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const M=s.querySelector("bim-panel-section[name='Floors']"),P=s.querySelector("bim-panel-section[name='Categories']");for(const n in b){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({spatialStructures:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);M.append(l)}for(const n in f){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({entities:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);P.append(l)}const R=i.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(R);
