import"./web-ifc-api-D3oDn2HF.js";import{S as g}from"./stats.min-DDrWCSVO.js";import{p as h,J as i,m as r}from"./index-K5IA6oiZ.js";import{a as S,W as w,S as y,c as k,b as x,G as v,F as C,I as F,H as j,e as I}from"./index-DPB0U-mi.js";const L=document.getElementById("container"),e=new S,$=e.get(w),t=$.create();t.scene=new y(e);t.renderer=new k(e,L);t.camera=new x(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const R=e.get(v);R.create(t);t.scene.three.background=null;const A=e.get(C),B=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),H=await B.arrayBuffer(),J=new Uint8Array(H),c=A.load(J);t.scene.three.add(c);const M=await fetch("https://thatopen.github.io/engine_components/resources/small.json");c.setLocalProperties(await M.json());const d=e.get(F),N=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),O=d.getRelationsMapFromJSON(await N.text());d.setRelationMap(c,O);const u=e.get(j),o=e.get(I);o.byEntity(c);await o.bySpatialStructure(c);const a=new g;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());h.init();const b={},U=Object.keys(o.list.spatialStructures);for(const n of U)b[n]=!0;const f={},_=Object.keys(o.list.entities);for(const n of _)f[n]=!0;const s=i.create(()=>r`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const q=s.querySelector("bim-panel-section[name='Floors']"),E=s.querySelector("bim-panel-section[name='Categories']");for(const n in b){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:m})=>{const p=o.find({spatialStructures:[n]});u.set(m.value,p)}}">
      </bim-checkbox>
    `);q.append(l)}for(const n in f){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:m})=>{const p=o.find({entities:[n]});u.set(m.value,p)}}">
      </bim-checkbox>
    `);E.append(l)}const G=i.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(G);
