import{p as g,m as u,a as l,b as h}from"./index-S6p3h9tm.js";import{C as w,W as y,S as k,a as L,O as M,F as f}from"./index-obm6UPqW.js";import{G as I}from"./index-BtRmUtZZ.js";const r=new w,F=r.get(y),o=F.create();o.scene=new k(r);o.scene.setup();o.scene.three.background=null;const v=document.getElementById("container");o.renderer=new L(r,v);o.camera=new M(r);await o.camera.controls.setLookAt(78,20,-2.2,26,-4,25);r.init();r.get(I).create(o);const $=await f.getWorker(),t=r.get(f);t.init($);o.camera.controls.addEventListener("update",()=>t.core.update());t.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),t.core.update(!0)});t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const B=async()=>{const e=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(e.map(async s=>{var c;const n=(c=s.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const d=await(await fetch(s)).arrayBuffer();return t.core.load(d,{modelId:n})}))},S=async()=>{for(const[,e]of t.list){const s=await e.getBuffer(!1),n=new File([s],`${e.modelId}.frag`),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download=n.name,a.click(),URL.revokeObjectURL(a.href)}},U=()=>{const s=[...t.list.keys()].find(n=>/arq/.test(n));s&&t.core.disposeModel(s)},A=()=>{for(const[e]of t.list)t.core.disposeModel(e)};g.init();const[p,O]=u.create(e=>{const s=async({target:m})=>{m.loading=!0,await B(),m.loading=!1};let n;t.list.size===0&&(n=l`
      <bim-button label="Load fragments" @click=${s}></bim-button>
    `);let a;[...t.list.keys()].some(m=>/arq/.test(m))&&(a=l`
      <bim-button label="Dispose Arch Model" @click=${U}></bim-button>
      `);let d,c;return t.list.size>0&&(c=l`
      <bim-button label="Dispose All Models" @click=${A}></bim-button>
    `,d=l`
      <bim-button label="Export fragments" @click=${S}></bim-button>
    `),l`
    <bim-panel active label="FragmentsManager Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        ${n}
        ${a}
        ${c}
        ${d}
      </bim-panel-section>
    </bim-panel>
  `},{}),b=()=>O();t.list.onItemSet.add(b);t.list.onItemDeleted.add(b);document.body.append(p);const C=u.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);const i=new h;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>i.begin());o.renderer.onAfterUpdate.add(()=>i.end());
