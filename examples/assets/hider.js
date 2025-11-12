import{u as f,V as m,f as u,a as w,J as y}from"./index-b0R13blq.js";import{C as h,W as C,S as I,a as v,O as $,F as S,H as k}from"./index-CEn02O1f.js";const l=new h,R=l.get(C),a=R.create();a.scene=new I(l);a.scene.setup();a.scene.three.background=null;const H=document.getElementById("container");a.renderer=new v(l,H);a.camera=new $(l);await a.camera.controls.setLookAt(78,20,-2.2,26,-4,25);l.init();const x="https://thatopen.github.io/engine_fragment/resources/worker.mjs",i=l.get(S);i.init(x);a.camera.controls.addEventListener("rest",()=>i.core.update(!0));a.onCameraChanged.add(t=>{for(const[,e]of i.list)e.useCamera(t.three);i.core.update(!0)});i.list.onItemSet.add(({value:t})=>{t.useCamera(a.camera.three),a.scene.three.add(t.object),i.core.update(!0)});const B=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(B.map(async t=>{var s;const e=(s=t.split("/").pop())==null?void 0:s.split(".").shift();if(!e)return null;const n=await(await fetch(t)).arrayBuffer();return i.core.load(n,{modelId:e})}));const g=l.get(k),O=async t=>{const e={},c=t.map(n=>new RegExp(`^${n}$`));for(const[,n]of i.list){const s=await n.getItemsOfCategories(c),o=Object.values(s).flat();e[n.modelId]=new Set(o)}await g.isolate(e)},V=async t=>{const e={},c=t.map(n=>new RegExp(`^${n}$`));for(const[,n]of i.list){const s=await n.getItemsOfCategories(c),o=Object.values(s).flat();e[n.modelId]=new Set(o)}await g.set(!1,e)},L=async()=>{await g.set(!0)};f.init();const b=()=>u`
    <bim-dropdown multiple ${y(async e=>{if(!e)return;const c=e,n=new Set;for(const[,s]of i.list){const o=await s.getItemsWithGeometryCategories();for(const r of o)r&&n.add(r)}for(const s of n){const o=m.create(()=>u`<bim-option label=${s}></bim-option>`);c.append(o)}})}></bim-dropdown>
  `,p=m.create(()=>{const t=m.create(b),e=m.create(b);return u`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section style="width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:o})=>{o.loading=!0,await L(),o.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Isolation">
        ${t}
        <bim-button label="Isolate Category" @click=${async({target:o})=>{if(!t)return;const r=t.value;r.length!==0&&(o.loading=!0,await O(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Hiding">
        ${e}
        <bim-button label="Hide Category" @click=${async({target:o})=>{if(!e)return;const r=e.value;r.length!==0&&(o.loading=!0,await V(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(p);const _=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(_);const d=new w;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>d.begin());a.renderer.onAfterUpdate.add(()=>d.end());
