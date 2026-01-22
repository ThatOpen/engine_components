import{l as b,c as u,a as l,b as g}from"./index-BET5fVdQ.js";import{C as h,W as w,S as k,a as y,O as L,F}from"./index-B31d80Z1.js";import{G as M}from"./index-DFO-Vypy.js";const r=new h,I=r.get(w),o=I.create();o.scene=new k(r);o.scene.setup();o.scene.three.background=null;const U=document.getElementById("container");o.renderer=new y(r,U);o.camera=new L(r);await o.camera.controls.setLookAt(78,20,-2.2,26,-4,25);r.init();r.get(M).create(o);const v="https://thatopen.github.io/engine_fragment/resources/worker.mjs",B=await fetch(v),$=await B.blob(),O=new File([$],"worker.mjs",{type:"text/javascript"}),S=URL.createObjectURL(O),t=r.get(F);t.init(S);o.camera.controls.addEventListener("update",()=>t.core.update());t.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),t.core.update(!0)});t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const j=async()=>{const e=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(e.map(async s=>{var c;const n=(c=s.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const d=await(await fetch(s)).arrayBuffer();return t.core.load(d,{modelId:n})}))},A=async()=>{for(const[,e]of t.list){const s=await e.getBuffer(!1),n=new File([s],`${e.modelId}.frag`),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download=n.name,a.click(),URL.revokeObjectURL(a.href)}},R=()=>{const s=[...t.list.keys()].find(n=>/arq/.test(n));s&&t.core.disposeModel(s)},C=()=>{for(const[e]of t.list)t.core.disposeModel(e)};b.init();const[p,_]=u.create(e=>{const s=async({target:m})=>{m.loading=!0,await j(),m.loading=!1};let n;t.list.size===0&&(n=l`
      <bim-button label="Load fragments" @click=${s}></bim-button>
    `);let a;[...t.list.keys()].some(m=>/arq/.test(m))&&(a=l`
      <bim-button label="Dispose Arch Model" @click=${R}></bim-button>
      `);let d,c;return t.list.size>0&&(c=l`
      <bim-button label="Dispose All Models" @click=${C}></bim-button>
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
  `},{}),f=()=>_();t.list.onItemSet.add(f);t.list.onItemDeleted.add(f);document.body.append(p);const P=u.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);const i=new g;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>i.begin());o.renderer.onAfterUpdate.add(()=>i.end());
