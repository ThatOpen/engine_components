import{T as C,L as f,m,a as y,V as u}from"./index-BR15nMAM.js";import{C as V,W as S,S as v,a as I,O as k,F as P,V as $,B as U,H as w}from"./index-DQoMA9YT.js";import{I as D}from"./index-PJMzNvVv.js";const i=new V,L=i.get(S),o=L.create();o.scene=new v(i);o.scene.setup();o.scene.three.background=null;const T=document.getElementById("container");o.renderer=new I(i,T);o.camera=new k(i);await o.camera.controls.setLookAt(78,20,-2.2,26,-4,25);i.init();const M="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",r=i.get(P);r.init(M);o.camera.controls.addEventListener("rest",()=>r.core.update(!0));o.onCameraChanged.add(e=>{for(const[,n]of r.list)n.useCamera(e.three);r.core.update(!0)});r.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),r.core.update(!0)});const R=["/resources/frags/school_arq.frag","/resources/frags/school_str.frag"];await Promise.all(R.map(async e=>{var c;const n=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const a=await(await fetch(e)).arrayBuffer();return r.core.load(a,{modelId:n})}));const s=i.get($);s.world=o;let t;const B=async()=>{t=s.create(),t.title="My Viewpoint",await t.updateCamera()},F=()=>{t&&t.takeSnapshot()},O=async()=>{t&&(console.log("Position before updating",t.position),await t.updateCamera(),console.log("Position after updating",t.position))},W=async()=>{if(!t)return;const e=new u;o.camera.controls.getPosition(e),console.log("Camera position before updating",e),await t.go();const n=new u;o.camera.controls.getPosition(n),console.log("Camera position before updating",n)};s.list.onItemSet.add(({value:e})=>{e.selectionComponents.add("3V$FMCDUfCoPwUaHMPfteW","1fIVuvFffDJRV_SJESOtCZ")});s.list.onItemSet.add(async({value:e})=>{const l=await i.get(D).getItems([{categories:[/DOOR/]}]),a=await r.modelIdMapToGuids(l);e.selectionComponents.add(...a)});const _=async()=>{if(!t)return;const e=t.selectionComponents,n=await t.getSelectionMap();console.log(e,n)},x=async()=>{if(!t)return;const e=await t.getSelectionMap();i.get(w).isolate(e)};s.list.onItemSet.add(({value:e})=>{i.get(U).create().viewpoints.add(e.guid)});const E=()=>{if(!t)return null;const e=s.snapshots.get(t.snapshot);return e||null};C.init();const[p,g]=f.create(e=>{const n=async({target:a})=>{a.loading=!0,await i.get(w).set(!0),a.loading=!1};let l=m`
    <bim-panel-section label="Viewpoint Creation">
      <bim-label>To start, hit the button below to create a new viewpoint</bim-label>
      <bim-button label="Create Viewpoint" @click=${B}></bim-button>
    </bim-panel-section>
  `;if(t){const a=E();let c;if(a){const b=new Blob([a],{type:"image/png"}),h=URL.createObjectURL(b);c=m`
        <img src="${h}" alt="Viewpoint Snapshot" style="max-width: 20rem;"/>
      `}l=m`
      <bim-panel-section label="Controls">
        <bim-button @click=${F} label="Update Snapshot"></bim-button>
        ${c}
        <bim-button @click=${O} label="Update Viewpoint Camera"></bim-button>
        <bim-button @click=${W} label="Set World Camera"></bim-button>
        <bim-button @click=${_} label="Report Selection Components"></bim-button>
        <bim-button @click=${x} label="Isolate Components"></bim-button>
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
  `},{});s.list.onItemDeleted.add(()=>g());s.list.onItemUpdated.add(()=>g());document.body.append(p);const j=f.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(j);const d=new y;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>d.begin());o.renderer.onAfterUpdate.add(()=>d.end());
