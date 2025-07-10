import{a as h}from"./index-D7EC26VF.js";import{a as y,R as b,m as d,F as w}from"./index-bERBRksd.js";import{C as L,W as C,S as v,a as I,O as S,F as k,H as f}from"./index-Bv9-N0Ab.js";import{I as A}from"./index-BBVfCO_1.js";const a=new L,F=a.get(C),n=F.create();n.scene=new v(a);n.scene.setup();n.scene.three.background=null;const R=document.getElementById("container");n.renderer=new I(a,R);n.camera=new S(a);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);a.init();const N="https://thatopen.github.io/engine_fragment/resources/worker.mjs",o=a.get(k);o.init(N);n.camera.controls.addEventListener("rest",()=>o.core.update(!0));n.onCameraChanged.add(t=>{for(const[,e]of o.list)e.useCamera(t.three);o.core.update(!0)});o.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),o.core.update(!0)});const q=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(q.map(async t=>{var l;const e=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!e)return null;const r=await(await fetch(t)).arrayBuffer();return o.core.load(r,{modelId:e})}));const m=a.get(A);m.create("Walls & Slabs",[{categories:[/WALL/,/SLAB/]}]);m.create("Masonry Walls",[{categories:[/WALL/],attributes:{queries:[{name:/Name/,value:/Masonry/}]}}]);const W={categories:[/BUILDINGSTOREY/],attributes:{queries:[{name:/Name/,value:/Entry/}]}};m.create("First Level Columns",[{categories:[/COLUMN/],relation:{name:"ContainedInStructure",query:W}}]);const B=async t=>{const e=m.list.get(t);return e?await e.test():{}};y.init();const M=()=>d`
    <bim-table ${w(e=>{if(!e)return;const s=e;s.loadFunction=async()=>{const r=[];for(const[l]of m.list)r.push({data:{Name:l,Actions:""}});return r},s.loadData(!0)})}></bim-table>
  `,i=b.create(M);i.style.maxHeight="25rem";i.columns=["Name",{name:"Actions",width:"auto"}];i.noIndentation=!0;i.headersHidden=!0;i.dataTransform={Actions:(t,e)=>{const{Name:s}=e;if(!s)return t;const r=a.get(f);return d`<bim-button icon="solar:cursor-bold" @click=${async({target:p})=>{p.loading=!0;const g=await B(s);await r.isolate(g),p.loading=!1}}></bim-button>`}};const u=b.create(()=>d`
    <bim-panel active label="Items Finder Tutorial" class="options-menu">
      <bim-panel-section style="min-width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:e})=>{e.loading=!0,await a.get(f).set(!0),e.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Queries">
        ${i}
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(u);const U=b.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);const c=new h;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>c.begin());n.renderer.onAfterUpdate.add(()=>c.end());
