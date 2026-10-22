import{K as y,n as f,b as p,S,V as u}from"./TransformControls-Cj7TVMGg.js";import{C as V,W as v,S as I,a as k,O as P,F as g,V as $,B as M,H as w}from"./index-DqZKPMhV.js";import{I as U}from"./index-BD2gMwJZ.js";const i=new V,D=i.get(v),o=D.create();o.scene=new I(i);o.scene.setup();o.scene.three.background=null;const L=document.getElementById("container");o.renderer=new k(i,L);o.camera=new P(i);await o.camera.controls.setLookAt(78,20,-2.2,26,-4,25);i.init();const O=await g.getWorker(),s=i.get(g);s.init(O);o.camera.controls.addEventListener("update",()=>s.core.update());o.onCameraChanged.add(e=>{for(const[,n]of s.list)n.useCamera(e.three);s.core.update(!0)});s.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),s.core.update(!0)});s.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const R=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(R.map(async e=>{const n=e.split("/").pop()?.split(".").shift();if(!n)return null;const a=await(await fetch(e)).arrayBuffer();return s.core.load(a,{modelId:n})}));const l=i.get($);l.world=o;let t;const F=async()=>{t=l.create(),t.title="My Viewpoint",await t.updateCamera()},T=()=>{t&&t.takeSnapshot()},B=async()=>{t&&(console.log("Position before updating",t.position),await t.updateCamera(),console.log("Position after updating",t.position))},W=async()=>{if(!t)return;const e=new u;o.camera.controls.getPosition(e),console.log("Camera position before updating",e),await t.go();const n=new u;o.camera.controls.getPosition(n),console.log("Camera position before updating",n)};l.list.onItemSet.add(({value:e})=>{e.selectionComponents.add("3V$FMCDUfCoPwUaHMPfteW","1fIVuvFffDJRV_SJESOtCZ")});l.list.onItemSet.add(async({value:e})=>{const r=await i.get(U).getItems([{categories:[/DOOR/]}]),a=await s.modelIdMapToGuids(r);e.selectionComponents.add(...a)});const _=async()=>{if(!t)return;const e=t.selectionComponents,n=await t.getSelectionMap();console.log(e,n)},x=async()=>{if(!t)return;const e=await t.getSelectionMap();i.get(w).isolate(e)};l.list.onItemSet.add(({value:e})=>{i.get(M).create().viewpoints.add(e.guid)});const E=()=>{if(!t)return null;const e=l.snapshots.get(t.snapshot);return e||null};y.init();const[d,h]=f.create(e=>{const n=async({target:a})=>{a.loading=!0,await i.get(w).set(!0),a.loading=!1};let r=p`
    <bim-panel-section label="Viewpoint Creation">
      <bim-label>To start, hit the button below to create a new viewpoint</bim-label>
      <bim-button label="Create Viewpoint" @click=${F}></bim-button>
    </bim-panel-section>
  `;if(t){const a=E();let m;if(a){const b=new Blob([a],{type:"image/png"}),C=URL.createObjectURL(b);m=p`
        <img src="${C}" alt="Viewpoint Snapshot" style="max-width: 20rem;"/>
      `}r=p`
      <bim-panel-section label="Controls">
        <bim-button @click=${T} label="Update Snapshot"></bim-button>
        ${m}
        <bim-button @click=${B} label="Update Viewpoint Camera"></bim-button>
        <bim-button @click=${W} label="Set World Camera"></bim-button>
        <bim-button @click=${_} label="Report Selection Components"></bim-button>
        <bim-button @click=${x} label="Isolate Components"></bim-button>
        <bim-button @click=${()=>{if(!t)return;const{guid:b}=t;t=void 0,l.list.delete(b)}} label="Delete Viewpoint"></bim-button>
      </bim-panel-section>
    `}return p`
    <bim-panel active label="Viewpoints Tutorial" class="options-menu">
      <bim-panel-section label="Information">
        <bim-label style="white-space: normal; width: 18rem;">To better experience this tutorial, open the developer tool's console in your browser to see some logs.</bim-label>
        <bim-button label="Reset Visibility" @click=${n}></bim-button>
      </bim-panel-section>
      ${r}
    </bim-panel>
  `},{});l.list.onItemDeleted.add(()=>h());l.list.onItemUpdated.add(()=>h());document.body.append(d);const H=f.create(()=>p`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(H);const c=new S;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>c.begin());o.renderer.onAfterUpdate.add(()=>c.end());
