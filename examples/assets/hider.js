import{T as f,L as m,m as u,a as w,H as y}from"./index-BR15nMAM.js";import{C,W as h,S as I,a as v,O as $,F as k,H}from"./index-DQoMA9YT.js";const l=new C,S=l.get(h),a=S.create();a.scene=new I(l);a.scene.setup();a.scene.three.background=null;const R=document.getElementById("container");a.renderer=new v(l,R);a.camera=new $(l);await a.camera.controls.setLookAt(78,20,-2.2,26,-4,25);l.init();const L="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",i=l.get(k);i.init(L);a.camera.controls.addEventListener("rest",()=>i.core.update(!0));a.onCameraChanged.add(t=>{for(const[,e]of i.list)e.useCamera(t.three);i.core.update(!0)});i.list.onItemSet.add(({value:t})=>{t.useCamera(a.camera.three),a.scene.three.add(t.object),i.core.update(!0)});const x=["/resources/frags/school_arq.frag","/resources/frags/school_str.frag"];await Promise.all(x.map(async t=>{var s;const e=(s=t.split("/").pop())==null?void 0:s.split(".").shift();if(!e)return null;const n=await(await fetch(t)).arrayBuffer();return i.core.load(n,{modelId:e})}));const b=l.get(H),B=async t=>{const e={},c=t.map(n=>new RegExp(`^${n}$`));for(const[,n]of i.list){const s=await n.getItemsOfCategories(c),o=Object.values(s).flat();e[n.modelId]=new Set(o)}await b.isolate(e)},O=async t=>{const e={},c=t.map(n=>new RegExp(`^${n}$`));for(const[,n]of i.list){const s=await n.getItemsOfCategories(c),o=Object.values(s).flat();e[n.modelId]=new Set(o)}await b.set(!1,e)},j=async()=>{await b.set(!0)};f.init();const g=()=>u`
    <bim-dropdown multiple ${y(async e=>{if(!e)return;const c=e,n=new Set;for(const[,s]of i.list){const o=await s.getItemsWithGeometryCategories();for(const r of o)r&&n.add(r)}for(const s of n){const o=m.create(()=>u`<bim-option label=${s}></bim-option>`);c.append(o)}})}></bim-dropdown>
  `,p=m.create(()=>{const t=m.create(g),e=m.create(g);return u`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section style="width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:o})=>{o.loading=!0,await j(),o.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Isolation">
        ${t}
        <bim-button label="Isolate Category" @click=${async({target:o})=>{if(!t)return;const r=t.value;r.length!==0&&(o.loading=!0,await B(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Hiding">
        ${e}
        <bim-button label="Hide Category" @click=${async({target:o})=>{if(!e)return;const r=e.value;r.length!==0&&(o.loading=!0,await O(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(p);const E=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(E);const d=new w;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>d.begin());a.renderer.onAfterUpdate.add(()=>d.end());
