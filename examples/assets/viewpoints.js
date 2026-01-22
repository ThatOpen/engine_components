import{l as C,c as f,a as d,b as y,V as u}from"./index-BET5fVdQ.js";import{C as S,W as V,S as v,a as k,O as I,F as U,V as P,B as $,H as g}from"./index-B31d80Z1.js";import{I as L}from"./index-B13xoQwy.js";const i=new S,M=i.get(V),o=M.create();o.scene=new v(i);o.scene.setup();o.scene.three.background=null;const O=document.getElementById("container");o.renderer=new k(i,O);o.camera=new I(i);await o.camera.controls.setLookAt(78,20,-2.2,26,-4,25);i.init();const R="https://thatopen.github.io/engine_fragment/resources/worker.mjs",D=await fetch(R),F=await D.blob(),B=new File([F],"worker.mjs",{type:"text/javascript"}),T=URL.createObjectURL(B),a=i.get(U);a.init(T);o.camera.controls.addEventListener("update",()=>a.core.update());o.onCameraChanged.add(e=>{for(const[,n]of a.list)n.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),a.core.update(!0)});a.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const _=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(_.map(async e=>{var c;const n=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!n)return null;const s=await(await fetch(e)).arrayBuffer();return a.core.load(s,{modelId:n})}));const l=i.get(P);l.world=o;let t;const j=async()=>{t=l.create(),t.title="My Viewpoint",await t.updateCamera()},x=()=>{t&&t.takeSnapshot()},W=async()=>{t&&(console.log("Position before updating",t.position),await t.updateCamera(),console.log("Position after updating",t.position))},E=async()=>{if(!t)return;const e=new u;o.camera.controls.getPosition(e),console.log("Camera position before updating",e),await t.go();const n=new u;o.camera.controls.getPosition(n),console.log("Camera position before updating",n)};l.list.onItemSet.add(({value:e})=>{e.selectionComponents.add("3V$FMCDUfCoPwUaHMPfteW","1fIVuvFffDJRV_SJESOtCZ")});l.list.onItemSet.add(async({value:e})=>{const r=await i.get(L).getItems([{categories:[/DOOR/]}]),s=await a.modelIdMapToGuids(r);e.selectionComponents.add(...s)});const H=async()=>{if(!t)return;const e=t.selectionComponents,n=await t.getSelectionMap();console.log(e,n)},A=async()=>{if(!t)return;const e=await t.getSelectionMap();i.get(g).isolate(e)};l.list.onItemSet.add(({value:e})=>{i.get($).create().viewpoints.add(e.guid)});const G=()=>{if(!t)return null;const e=l.snapshots.get(t.snapshot);return e||null};C.init();const[m,w]=f.create(e=>{const n=async({target:s})=>{s.loading=!0,await i.get(g).set(!0),s.loading=!1};let r=d`
    <bim-panel-section label="Viewpoint Creation">
      <bim-label>To start, hit the button below to create a new viewpoint</bim-label>
      <bim-button label="Create Viewpoint" @click=${j}></bim-button>
    </bim-panel-section>
  `;if(t){const s=G();let c;if(s){const b=new Blob([s],{type:"image/png"}),h=URL.createObjectURL(b);c=d`
        <img src="${h}" alt="Viewpoint Snapshot" style="max-width: 20rem;"/>
      `}r=d`
      <bim-panel-section label="Controls">
        <bim-button @click=${x} label="Update Snapshot"></bim-button>
        ${c}
        <bim-button @click=${W} label="Update Viewpoint Camera"></bim-button>
        <bim-button @click=${E} label="Set World Camera"></bim-button>
        <bim-button @click=${H} label="Report Selection Components"></bim-button>
        <bim-button @click=${A} label="Isolate Components"></bim-button>
        <bim-button @click=${()=>{if(!t)return;const{guid:b}=t;t=void 0,l.list.delete(b)}} label="Delete Viewpoint"></bim-button>
      </bim-panel-section>
    `}return d`
    <bim-panel active label="Viewpoints Tutorial" class="options-menu">
      <bim-panel-section label="Information">
        <bim-label style="white-space: normal; width: 18rem;">To better experience this tutorial, open the developer tool's console in your browser to see some logs.</bim-label>
        <bim-button label="Reset Visibility" @click=${n}></bim-button>
      </bim-panel-section>
      ${r}
    </bim-panel>
  `},{});l.list.onItemDeleted.add(()=>w());l.list.onItemUpdated.add(()=>w());document.body.append(m);const J=f.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);const p=new y;p.showPanel(2);document.body.append(p.dom);p.dom.style.left="0px";p.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>p.begin());o.renderer.onAfterUpdate.add(()=>p.end());
