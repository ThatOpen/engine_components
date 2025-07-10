import{T as p,L as f,m as l,a as g}from"./index-BR15nMAM.js";import{C as w,W as h,S as k,a as y,O as L,F as I}from"./index-DQoMA9YT.js";import{G as F}from"./index-Q4q2MoOf.js";const r=new w,M=r.get(h),t=M.create();t.scene=new k(r);t.scene.setup();t.scene.three.background=null;const $=document.getElementById("container");t.renderer=new y(r,$);t.camera=new L(r);await t.camera.controls.setLookAt(78,20,-2.2,26,-4,25);r.init();r.get(F).create(t);const v="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",e=r.get(I);e.init(v);t.camera.controls.addEventListener("rest",()=>e.core.update(!0));e.list.onItemSet.add(({value:o})=>{o.useCamera(t.camera.three),t.scene.three.add(o.object),e.core.update(!0)});const B=async()=>{const o=["/resources/frags/school_arq.frag","/resources/frags/school_str.frag"];await Promise.all(o.map(async n=>{var c;const s=(c=n.split("/").pop())==null?void 0:c.split(".").shift();if(!s)return null;const d=await(await fetch(n)).arrayBuffer();return e.core.load(d,{modelId:s})}))},A=async()=>{for(const[,o]of e.list){const n=await o.getBuffer(!1),s=new File([n],`${o.modelId}.frag`),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download=s.name,a.click(),URL.revokeObjectURL(a.href)}},S=()=>{const n=[...e.list.keys()].find(s=>/arq/.test(s));n&&e.core.disposeModel(n)},U=()=>{for(const[o]of e.list)e.core.disposeModel(o)};p.init();const[u,C]=f.create(o=>{const n=async({target:m})=>{m.loading=!0,await B(),m.loading=!1};let s;e.list.size===0&&(s=l`
      <bim-button label="Load fragments" @click=${n}></bim-button>
    `);let a;[...e.list.keys()].some(m=>/arq/.test(m))&&(a=l`
      <bim-button label="Dispose Arch Model" @click=${S}></bim-button>
      `);let d,c;return e.list.size>0&&(c=l`
      <bim-button label="Dispose All Models" @click=${U}></bim-button>
    `,d=l`
      <bim-button label="Export fragments" @click=${A}></bim-button>
    `),l`
    <bim-panel active label="FragmentsManager Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        ${s}
        ${a}
        ${c}
        ${d}
      </bim-panel-section>
    </bim-panel>
  `},{}),b=()=>C();e.list.onItemSet.add(b);e.list.onItemDeleted.add(b);document.body.append(u);const P=f.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);const i=new g;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
