import{a as f}from"./index-D7EC26VF.js";import{a as g,R as u,m as l}from"./index-bERBRksd.js";import{C as h,W as w,S as k,a as y,O as I,F as L}from"./index-Bv9-N0Ab.js";import{G as F}from"./index-l9Fj5h2Z.js";const r=new h,M=r.get(w),t=M.create();t.scene=new k(r);t.scene.setup();t.scene.three.background=null;const $=document.getElementById("container");t.renderer=new y(r,$);t.camera=new I(r);await t.camera.controls.setLookAt(78,20,-2.2,26,-4,25);r.init();r.get(F).create(t);const v="https://thatopen.github.io/engine_fragment/resources/worker.mjs",e=r.get(L);e.init(v);t.camera.controls.addEventListener("rest",()=>e.core.update(!0));e.list.onItemSet.add(({value:o})=>{o.useCamera(t.camera.three),t.scene.three.add(o.object),e.core.update(!0)});const B=async()=>{const o=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(o.map(async s=>{var c;const n=(c=s.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const d=await(await fetch(s)).arrayBuffer();return e.core.load(d,{modelId:n})}))},A=async()=>{for(const[,o]of e.list){const s=await o.getBuffer(!1),n=new File([s],`${o.modelId}.frag`),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download=n.name,a.click(),URL.revokeObjectURL(a.href)}},R=()=>{const s=[...e.list.keys()].find(n=>/arq/.test(n));s&&e.core.disposeModel(s)},S=()=>{for(const[o]of e.list)e.core.disposeModel(o)};g.init();const[p,U]=u.create(o=>{const s=async({target:m})=>{m.loading=!0,await B(),m.loading=!1};let n;e.list.size===0&&(n=l`
      <bim-button label="Load fragments" @click=${s}></bim-button>
    `);let a;[...e.list.keys()].some(m=>/arq/.test(m))&&(a=l`
      <bim-button label="Dispose Arch Model" @click=${R}></bim-button>
      `);let d,c;return e.list.size>0&&(c=l`
      <bim-button label="Dispose All Models" @click=${S}></bim-button>
    `,d=l`
      <bim-button label="Export fragments" @click=${A}></bim-button>
    `),l`
    <bim-panel active label="FragmentsManager Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        ${n}
        ${a}
        ${c}
        ${d}
      </bim-panel-section>
    </bim-panel>
  `},{}),b=()=>U();e.list.onItemSet.add(b);e.list.onItemDeleted.add(b);document.body.append(p);const _=u.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(_);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
