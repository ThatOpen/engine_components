import{a as f}from"./index-lvtjgYNN.js";import{a as g,R as u,m as l}from"./index-bERBRksd.js";import{C as h,W as w,S as k,a as y,O as L,F}from"./index-BPZgAaC0.js";import{G as I}from"./index-_W6Uwbrx.js";const r=new h,U=r.get(w),t=U.create();t.scene=new k(r);t.scene.setup();t.scene.three.background=null;const v=document.getElementById("container");t.renderer=new y(r,v);t.camera=new L(r);await t.camera.controls.setLookAt(78,20,-2.2,26,-4,25);r.init();r.get(I).create(t);const B="https://thatopen.github.io/engine_fragment/resources/worker.mjs",M=await fetch(B),$=await M.blob(),R=new File([$],"worker.mjs",{type:"text/javascript"}),j=URL.createObjectURL(R),e=r.get(F);e.init(j);t.camera.controls.addEventListener("rest",()=>e.core.update(!0));e.list.onItemSet.add(({value:o})=>{o.useCamera(t.camera.three),t.scene.three.add(o.object),e.core.update(!0)});const A=async()=>{const o=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(o.map(async s=>{var c;const n=(c=s.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const d=await(await fetch(s)).arrayBuffer();return e.core.load(d,{modelId:n})}))},S=async()=>{for(const[,o]of e.list){const s=await o.getBuffer(!1),n=new File([s],`${o.modelId}.frag`),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download=n.name,a.click(),URL.revokeObjectURL(a.href)}},_=()=>{const s=[...e.list.keys()].find(n=>/arq/.test(n));s&&e.core.disposeModel(s)},C=()=>{for(const[o]of e.list)e.core.disposeModel(o)};g.init();const[p,O]=u.create(o=>{const s=async({target:m})=>{m.loading=!0,await A(),m.loading=!1};let n;e.list.size===0&&(n=l`
      <bim-button label="Load fragments" @click=${s}></bim-button>
    `);let a;[...e.list.keys()].some(m=>/arq/.test(m))&&(a=l`
      <bim-button label="Dispose Arch Model" @click=${_}></bim-button>
      `);let d,c;return e.list.size>0&&(c=l`
      <bim-button label="Dispose All Models" @click=${C}></bim-button>
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
  `},{}),b=()=>O();e.list.onItemSet.add(b);e.list.onItemDeleted.add(b);document.body.append(p);const P=u.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
