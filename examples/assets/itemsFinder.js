import{T as y,L as b,m as u,a as h,H as w}from"./index-BR15nMAM.js";import{C as L,W as C,S as v,a as I,O as k,F as S,H as f}from"./index-DQoMA9YT.js";import{I as A}from"./index-PJMzNvVv.js";const a=new L,N=a.get(C),n=N.create();n.scene=new v(a);n.scene.setup();n.scene.three.background=null;const W=document.getElementById("container");n.renderer=new I(a,W);n.camera=new k(a);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);a.init();const q="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",o=a.get(S);o.init(q);n.camera.controls.addEventListener("rest",()=>o.core.update(!0));n.onCameraChanged.add(t=>{for(const[,e]of o.list)e.useCamera(t.three);o.core.update(!0)});o.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),o.core.update(!0)});const F=["/resources/frags/school_arq.frag","/resources/frags/school_str.frag"];await Promise.all(F.map(async t=>{var l;const e=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!e)return null;const r=await(await fetch(t)).arrayBuffer();return o.core.load(r,{modelId:e})}));const d=a.get(A);d.create("Walls & Slabs",[{categories:[/WALL/,/SLAB/]}]);d.create("Masonry Walls",[{categories:[/WALL/],attributes:{queries:[{name:/Name/,value:/Masonry/}]}}]);const H={categories:[/BUILDINGSTOREY/],attributes:{queries:[{name:/Name/,value:/Entry/}]}};d.create("First Level Columns",[{categories:[/COLUMN/],relation:{name:"ContainedInStructure",query:H}}]);const R=async t=>{const e=d.list.get(t);return e?await e.test():{}};y.init();const T=()=>u`
    <bim-table ${w(e=>{if(!e)return;const s=e;s.loadFunction=async()=>{const r=[];for(const[l]of d.list)r.push({data:{Name:l,Actions:""}});return r},s.loadData(!0)})}></bim-table>
  `,i=b.create(T);i.style.maxHeight="25rem";i.columns=["Name",{name:"Actions",width:"auto"}];i.noIndentation=!0;i.headersHidden=!0;i.dataTransform={Actions:(t,e)=>{const{Name:s}=e;if(!s)return t;const r=a.get(f);return u`<bim-button icon="solar:cursor-bold" @click=${async({target:p})=>{p.loading=!0;const g=await R(s);await r.isolate(g),p.loading=!1}}></bim-button>`}};const m=b.create(()=>u`
    <bim-panel active label="Items Finder Tutorial" class="options-menu">
      <bim-panel-section style="min-width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${async({target:e})=>{e.loading=!0,await a.get(f).set(!0),e.loading=!1}}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Queries">
        ${i}
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(m);const B=b.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);const c=new h;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>c.begin());n.renderer.onAfterUpdate.add(()=>c.end());
