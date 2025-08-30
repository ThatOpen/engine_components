import{a as C,V as u}from"./index-lvtjgYNN.js";import{a as y,R as g,m}from"./index-bERBRksd.js";import{C as V,W as S,S as v,a as k,O as I,F as U,V as P,B as $,H as w}from"./index-BPZgAaC0.js";import{I as R}from"./index-DZMSIHVX.js";const i=new V,D=i.get(S),o=D.create();o.scene=new v(i);o.scene.setup();o.scene.three.background=null;const L=document.getElementById("container");o.renderer=new k(i,L);o.camera=new I(i);await o.camera.controls.setLookAt(78,20,-2.2,26,-4,25);i.init();const F="https://thatopen.github.io/engine_fragment/resources/worker.mjs",M=await fetch(F),B=await M.blob(),O=new File([B],"worker.mjs",{type:"text/javascript"}),T=URL.createObjectURL(O),r=i.get(U);r.init(T);o.camera.controls.addEventListener("rest",()=>r.core.update(!0));o.onCameraChanged.add(e=>{for(const[,n]of r.list)n.useCamera(e.three);r.core.update(!0)});r.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),r.core.update(!0)});const _=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(_.map(async e=>{var c;const n=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const a=await(await fetch(e)).arrayBuffer();return r.core.load(a,{modelId:n})}));const s=i.get(P);s.world=o;let t;const j=async()=>{t=s.create(),t.title="My Viewpoint",await t.updateCamera()},x=()=>{t&&t.takeSnapshot()},W=async()=>{t&&(console.log("Position before updating",t.position),await t.updateCamera(),console.log("Position after updating",t.position))},E=async()=>{if(!t)return;const e=new u;o.camera.controls.getPosition(e),console.log("Camera position before updating",e),await t.go();const n=new u;o.camera.controls.getPosition(n),console.log("Camera position before updating",n)};s.list.onItemSet.add(({value:e})=>{e.selectionComponents.add("3V$FMCDUfCoPwUaHMPfteW","1fIVuvFffDJRV_SJESOtCZ")});s.list.onItemSet.add(async({value:e})=>{const l=await i.get(R).getItems([{categories:[/DOOR/]}]),a=await r.modelIdMapToGuids(l);e.selectionComponents.add(...a)});const H=async()=>{if(!t)return;const e=t.selectionComponents,n=await t.getSelectionMap();console.log(e,n)},A=async()=>{if(!t)return;const e=await t.getSelectionMap();i.get(w).isolate(e)};s.list.onItemSet.add(({value:e})=>{i.get($).create().viewpoints.add(e.guid)});const G=()=>{if(!t)return null;const e=s.snapshots.get(t.snapshot);return e||null};y.init();const[d,f]=g.create(e=>{const n=async({target:a})=>{a.loading=!0,await i.get(w).set(!0),a.loading=!1};let l=m`
    <bim-panel-section label="Viewpoint Creation">
      <bim-label>To start, hit the button below to create a new viewpoint</bim-label>
      <bim-button label="Create Viewpoint" @click=${j}></bim-button>
    </bim-panel-section>
  `;if(t){const a=G();let c;if(a){const b=new Blob([a],{type:"image/png"}),h=URL.createObjectURL(b);c=m`
        <img src="${h}" alt="Viewpoint Snapshot" style="max-width: 20rem;"/>
      `}l=m`
      <bim-panel-section label="Controls">
        <bim-button @click=${x} label="Update Snapshot"></bim-button>
        ${c}
        <bim-button @click=${W} label="Update Viewpoint Camera"></bim-button>
        <bim-button @click=${E} label="Set World Camera"></bim-button>
        <bim-button @click=${H} label="Report Selection Components"></bim-button>
        <bim-button @click=${A} label="Isolate Components"></bim-button>
        <bim-button @click=${()=>{if(!t)return;const{guid:b}=t;t=void 0,s.list.delete(b)}} label="Delete Viewpoint"></bim-button>
      </bim-panel-section>
    `}return m`
    <bim-panel active label="Viewpoints Tutorial" class="options-menu">
      <bim-panel-section label="Information">
        <bim-label style="white-space: normal; width: 18rem;">To better experience this tutorial, open the developer tool's console in your browser to see some logs.</bim-label>
        <bim-button label="Reset Visibility" @click=${n}></bim-button>
      </bim-panel-section>
      ${l}
    </bim-panel>
  `},{});s.list.onItemDeleted.add(()=>f());s.list.onItemUpdated.add(()=>f());document.body.append(d);const J=g.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);const p=new C;p.showPanel(2);document.body.append(p.dom);p.dom.style.left="0px";p.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>p.begin());o.renderer.onAfterUpdate.add(()=>p.end());
