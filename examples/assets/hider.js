import"./web-ifc-api-C62xsSvk.js";import{S as g}from"./stats.min-BpIepu9J.js";import{p as h,J as i,m as r}from"./index-K5IA6oiZ.js";import{p as w,C as y,i as k,n as S,k as x,u as v,a as $,W as j,_ as A,A as C}from"./index-CTnQ5y92.js";const L=document.getElementById("container"),e=new w,_=e.get(y),t=_.create();t.scene=new k(e);t.renderer=new S(e,L);t.camera=new x(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const F=e.get(v);F.create(t);t.scene.three.background=null;const B=e.get($),J=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),N=await J.arrayBuffer(),O=new Uint8Array(N),c=B.load(O);t.scene.three.add(c);const U=await fetch("https://thatopen.github.io/engine_components/resources/small.json");c.setLocalProperties(await U.json());const d=e.get(j),q=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),E=d.getRelationsMapFromJSON(await q.text());d.setRelationMap(c,E);const u=e.get(A),o=e.get(C);o.byEntity(c);await o.bySpatialStructure(c);const a=new g;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());h.init();const b={},I=Object.keys(o.list.spatialStructures);for(const n of I)b[n]=!0;const f={},M=Object.keys(o.list.entities);for(const n of M)f[n]=!0;const s=i.create(()=>r`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const P=s.querySelector("bim-panel-section[name='Floors']"),R=s.querySelector("bim-panel-section[name='Categories']");for(const n in b){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({spatialStructures:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);P.append(l)}for(const n in f){const l=i.create(()=>r`
      <bim-checkbox checked label="${n}"
        @change="${({target:p})=>{const m=o.find({entities:[n]});u.set(p.value,m)}}">
      </bim-checkbox>
    `);R.append(l)}const W=i.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(W);
