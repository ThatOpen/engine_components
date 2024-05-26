import{a7 as f}from"./web-ifc-api-BC8YMRiS.js";import{S as h}from"./stats.min-GTpOrGrX.js";import{p as g,a as c,m as i}from"./index-DyM33b1I.js";import{f as y,p as w,s as k,i as S,k as v,N as x,u as I,h as L,R as N}from"./index-CLKLHy3P.js";import"./_commonjsHelpers-Cpj98o6Y.js";const A=document.getElementById("container"),n=new y,C=n.get(w),e=C.create();e.scene=new k(n);e.renderer=new S(n,A);e.camera=new v(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const R=n.get(x);R.create(e);e.scene.three.background=null;const $=new I(n),E=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),T=await E.arrayBuffer(),U=new Uint8Array(T),r=$.load(U);e.scene.three.add(r);const j=await fetch("https://thatopen.github.io/engine_components/resources/small.json");r.setLocalProperties(await j.json());const d=new L(n),o=new N(n);o.byEntity(r);await o.byIfcRel(r,f,"storeys");const a=new h;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());g.init();const b={},B=Object.keys(o.list.storeys);for(const t of B)b[t]=!0;const u={},F=Object.keys(o.list.entities);for(const t of F)u[t]=!0;const s=c.create(()=>i`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const O=s.querySelector("bim-panel-section[name='Floors']"),P=s.querySelector("bim-panel-section[name='Categories']");for(const t in b){const l=c.create(()=>i`
      <bim-checkbox checked label="${t}"
        @change="${({target:m})=>{const p=o.find({storeys:[t]});d.set(m.value,p)}}">
      </bim-checkbox>
    `);O.append(l)}for(const t in u){const l=c.create(()=>i`
      <bim-checkbox checked label="${t}"
        @change="${({target:m})=>{const p=o.find({entities:[t]});d.set(m.value,p)}}">
      </bim-checkbox>
    `);P.append(l)}const q=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(q);
