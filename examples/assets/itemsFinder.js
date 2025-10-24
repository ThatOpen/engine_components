import{u as h,V as b,f as m,a as y,J as w}from"./index-BVinSk0X.js";import{C as L,W as C,S as v,a as I,O as S,F as k,H as f}from"./index-DBG1qVuX.js";import{I as A}from"./index-D4Av9AF8.js";const s=new L,N=s.get(C),n=N.create();n.scene=new v(s);n.scene.setup();n.scene.three.background=null;const q=document.getElementById("container");n.renderer=new I(s,q);n.camera=new S(s);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);s.init();const F="https://thatopen.github.io/engine_fragment/resources/worker.mjs",o=s.get(k);o.init(F);n.camera.controls.addEventListener("rest",()=>o.core.update(!0));n.onCameraChanged.add(t=>{for(const[,e]of o.list)e.useCamera(t.three);o.core.update(!0)});o.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),o.core.update(!0)});const R=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(R.map(async t=>{var l;const e=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!e)return null;const r=await(await fetch(t)).arrayBuffer();return o.core.load(r,{modelId:e})}));const u=s.get(A);u.create("Walls & Slabs",[{categories:[/WALL/,/SLAB/]}]);u.create("Masonry Walls",[{categories:[/WALL/],attributes:{queries:[{name:/Name/,value:/Masonry/}]}}]);const W={categories:[/BUILDINGSTOREY/],attributes:{queries:[{name:/Name/,value:/Entry/}]}};u.create("First Level Columns",[{categories:[/COLUMN/],relation:{name:"ContainedInStructure",query:W}}]);const B=async t=>{const e=u.list.get(t);return e?await e.test():{}};h.init();const M=()=>m`
    <bim-table ${w(e=>{if(!e)return;const a=e;a.loadFunction=async()=>{const r=[];for(const[l]of u.list)r.push({data:{Name:l,Actions:""}});return r},a.loadData(!0)})}></bim-table>
  `,i=b.create(M);i.style.maxHeight="25rem";i.columns=["Name",{name:"Actions",width:"auto"}];i.noIndentation=!0;i.headersHidden=!0;i.dataTransform={Actions:(t,e)=>{const{Name:a}=e;if(!a)return t;const r=s.get(f);return m`<bim-button icon="solar:cursor-bold" @click=${async({target:p})=>{p.loading=!0;const g=await B(a);await r.isolate(g),p.loading=!1}}></bim-button>`}};const d=b.create(()=>m`
    <bim-panel active label="Items Finder Tutorial" class="options-menu">
      <bim-panel-section style="min-width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:e})=>{e.loading=!0,await s.get(f).set(!0),e.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Queries">
        ${i}
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(d);const U=b.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);const c=new y;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>c.begin());n.renderer.onAfterUpdate.add(()=>c.end());
