import{a as h,R as b,m as d,b as y,r as w}from"./index-CZukAoYd.js";import{C as L,W as C,S as v,a as I,O as S,F as k,H as g}from"./index-C2IU-BFV.js";import{I as A}from"./index-tfVFkCea.js";const s=new L,R=s.get(C),n=R.create();n.scene=new v(s);n.scene.setup();n.scene.three.background=null;const F=document.getElementById("container");n.renderer=new I(s,F);n.camera=new S(s);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);s.init();const N="https://thatopen.github.io/engine_fragment/resources/worker.mjs",o=s.get(k);o.init(N);n.camera.controls.addEventListener("rest",()=>o.core.update(!0));n.onCameraChanged.add(t=>{for(const[,e]of o.list)e.useCamera(t.three);o.core.update(!0)});o.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),o.core.update(!0)});const q=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(q.map(async t=>{var l;const e=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!e)return null;const r=await(await fetch(t)).arrayBuffer();return o.core.load(r,{modelId:e})}));const m=s.get(A);m.create("Walls & Slabs",[{categories:[/WALL/,/SLAB/]}]);m.create("Masonry Walls",[{categories:[/WALL/],attributes:{queries:[{name:/Name/,value:/Masonry/}]}}]);const W={categories:[/BUILDINGSTOREY/],attributes:{queries:[{name:/Name/,value:/Entry/}]}};m.create("First Level Columns",[{categories:[/COLUMN/],relation:{name:"ContainedInStructure",query:W}}]);const B=async t=>{const e=m.list.get(t);return e?await e.test():{}};h.init();const M=()=>d`
    <bim-table ${w(e=>{if(!e)return;const a=e;a.loadFunction=async()=>{const r=[];for(const[l]of m.list)r.push({data:{Name:l,Actions:""}});return r},a.loadData(!0)})}></bim-table>
  `,i=b.create(M);i.style.maxHeight="25rem";i.columns=["Name",{name:"Actions",width:"auto"}];i.noIndentation=!0;i.headersHidden=!0;i.dataTransform={Actions:(t,e)=>{const{Name:a}=e;if(!a)return t;const r=s.get(g);return d`<bim-button icon="solar:cursor-bold" @click=${async({target:p})=>{p.loading=!0;const f=await B(a);await r.isolate(f),p.loading=!1}}></bim-button>`}};const u=b.create(()=>d`
    <bim-panel active label="Items Finder Tutorial" class="options-menu">
      <bim-panel-section style="min-width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:e})=>{e.loading=!0,await s.get(g).set(!0),e.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Queries">
        ${i}
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(u);const U=b.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);const c=new y;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>c.begin());n.renderer.onAfterUpdate.add(()=>c.end());
