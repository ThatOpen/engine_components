import{K as y,n as m,b as g,S as w,m as h}from"./TransformControls-lNp9RmyE.js";import{C,W as I,S as v,a as $,O as S,F as f,H as O}from"./index-CVHtJqZ2.js";const l=new C,k=l.get(I),a=k.create();a.scene=new v(l);a.scene.setup();a.scene.three.background=null;const R=document.getElementById("container");a.renderer=new $(l,R);a.camera=new S(l);await a.camera.controls.setLookAt(78,20,-2.2,26,-4,25);l.init();const H=await f.getWorker(),s=l.get(f);s.init(H);a.camera.controls.addEventListener("update",()=>s.core.update());a.onCameraChanged.add(e=>{for(const[,t]of s.list)t.useCamera(e.three);s.core.update(!0)});s.list.onItemSet.add(({value:e})=>{e.useCamera(a.camera.three),a.scene.three.add(e.object),s.core.update(!0)});s.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const L=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(L.map(async e=>{const t=e.split("/").pop()?.split(".").shift();if(!t)return null;const n=await(await fetch(e)).arrayBuffer();return s.core.load(n,{modelId:t})}));const u=l.get(O),x=async e=>{const t={},c=e.map(n=>new RegExp(`^${n}$`));for(const[,n]of s.list){const i=await n.getItemsOfCategories(c),o=Object.values(i).flat();t[n.modelId]=new Set(o)}await u.isolate(t)},B=async e=>{const t={},c=e.map(n=>new RegExp(`^${n}$`));for(const[,n]of s.list){const i=await n.getItemsOfCategories(c),o=Object.values(i).flat();t[n.modelId]=new Set(o)}await u.set(!1,t)},M=async()=>{await u.set(!0)};y.init();const b=()=>g`
    <bim-dropdown multiple ${h(async t=>{if(!t)return;const c=t,n=new Set;for(const[,i]of s.list){const o=await i.getItemsWithGeometryCategories();for(const r of o)r&&n.add(r)}for(const i of n){const o=m.create(()=>g`<bim-option label=${i}></bim-option>`);c.append(o)}})}></bim-dropdown>
  `,p=m.create(()=>{const e=m.create(b),t=m.create(b);return g`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section style="width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:o})=>{o.loading=!0,await M(),o.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Isolation">
        ${e}
        <bim-button label="Isolate Category" @click=${async({target:o})=>{if(!e)return;const r=e.value;r.length!==0&&(o.loading=!0,await x(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Hiding">
        ${t}
        <bim-button label="Hide Category" @click=${async({target:o})=>{if(!t)return;const r=t.value;r.length!==0&&(o.loading=!0,await B(r),o.loading=!1)}}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(p);const E=m.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(E);const d=new w;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>d.begin());a.renderer.onAfterUpdate.add(()=>d.end());
