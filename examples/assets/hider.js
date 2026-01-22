import{l as f,c as m,a as g,b as w,t as y}from"./index-BET5fVdQ.js";import{C as h,W as C,S as I,a as v,O as $,F as k,H as O}from"./index-B31d80Z1.js";const l=new h,R=l.get(C),s=R.create();s.scene=new I(l);s.scene.setup();s.scene.three.background=null;const S=document.getElementById("container");s.renderer=new v(l,S);s.camera=new $(l);await s.camera.controls.setLookAt(78,20,-2.2,26,-4,25);l.init();const L="https://thatopen.github.io/engine_fragment/resources/worker.mjs",U=await fetch(L),j=await U.blob(),x=new File([j],"worker.mjs",{type:"text/javascript"}),B=URL.createObjectURL(x),i=l.get(k);i.init(B);s.camera.controls.addEventListener("update",()=>i.core.update());s.onCameraChanged.add(e=>{for(const[,t]of i.list)t.useCamera(e.three);i.core.update(!0)});i.list.onItemSet.add(({value:e})=>{e.useCamera(s.camera.three),s.scene.three.add(e.object),i.core.update(!0)});i.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const H=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(H.map(async e=>{var a;const t=(a=e.split("/").pop())==null?void 0:a.split(".").shift();if(!t)return null;const n=await(await fetch(e)).arrayBuffer();return i.core.load(n,{modelId:t})}));const u=l.get(O),F=async e=>{const t={},c=e.map(n=>new RegExp(`^${n}$`));for(const[,n]of i.list){const a=await n.getItemsOfCategories(c),o=Object.values(a).flat();t[n.modelId]=new Set(o)}await u.isolate(t)},M=async e=>{const t={},c=e.map(n=>new RegExp(`^${n}$`));for(const[,n]of i.list){const a=await n.getItemsOfCategories(c),o=Object.values(a).flat();t[n.modelId]=new Set(o)}await u.set(!1,t)},_=async()=>{await u.set(!0)};f.init();const b=()=>g`
    <bim-dropdown multiple ${y(async t=>{if(!t)return;const c=t,n=new Set;for(const[,a]of i.list){const o=await a.getItemsWithGeometryCategories();for(const r of o)r&&n.add(r)}for(const a of n){const o=m.create(()=>g`<bim-option label=${a}></bim-option>`);c.append(o)}})}></bim-dropdown>
  `,p=m.create(()=>{const e=m.create(b),t=m.create(b);return g`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section style="width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:o})=>{o.loading=!0,await _(),o.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Isolation">
        ${e}
        <bim-button label="Isolate Category" @click=${async({target:o})=>{if(!e)return;const r=e.value;r.length!==0&&(o.loading=!0,await F(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Hiding">
        ${t}
        <bim-button label="Hide Category" @click=${async({target:o})=>{if(!t)return;const r=t.value;r.length!==0&&(o.loading=!0,await M(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(p);const E=m.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(E);const d=new w;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>d.begin());s.renderer.onAfterUpdate.add(()=>d.end());
