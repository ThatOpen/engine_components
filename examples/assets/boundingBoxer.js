import{p as A,m as C,I as B,a as v,b as D,S as x,aX as q}from"./index-S6p3h9tm.js";import{C as P,W as T,S as R,a as U,O as W,F as O,e as _,D as j}from"./index-obm6UPqW.js";const d=new P,z=d.get(T),n=z.create();n.scene=new R(d);n.scene.setup();n.scene.three.background=null;const E=document.getElementById("container");n.renderer=new U(d,E);n.camera=new W(d);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);d.init();const G=await O.getWorker(),a=d.get(O);a.init(G);n.camera.controls.addEventListener("update",()=>a.core.update());n.onCameraChanged.add(e=>{for(const[,o]of a.list)o.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),a.core.update(!0)});a.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const X=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(X.map(async e=>{var b;const o=(b=e.split("/").pop())==null?void 0:b.split(".").shift();if(!o)return null;const l=await(await fetch(e)).arrayBuffer();return a.core.load(l,{modelId:o})}));const c=d.get(_),I=()=>{c.list.clear(),c.addFromModels();const e=c.get();return c.list.clear(),e},S=async e=>{const o=[...a.list.keys()].find(w=>/arq/.test(w));if(!o)return null;const r=a.list.get(o);if(!r)return null;const l=await r.getItemsOfCategories([new RegExp(`^${e}$`)]),f=Object.values(l).flat().slice(0,1),g={[o]:new Set(f)};c.list.clear(),await c.addFromModelIdMap(g);const h=c.get();return c.list.clear(),h},J=async e=>{const o=n.camera;if(!o.hasCameraControls())return;const{position:r,target:l}=await c.getCameraOrientation(e);await o.controls.setLookAt(r.x,r.y,r.z,l.x,l.y,l.z,!0)};let k=[];const M=e=>{const o=new q(e);n.scene.three.add(o),k.push(o)},K=()=>{const e=d.get(j);for(const o of k)e.destroy(o);k=[]};A.init();const u=C.create(()=>{let e,o;const r=({target:t})=>{t.loading=!0;const i=I(),s=new x;i.getBoundingSphere(s),n.camera.controls.fitToSphere(s,!0),t.loading=!1},l=()=>{const t=I();M(t)},b=async({target:t})=>{if(!e)return;t.loading=!0;const[i]=e.value,s=await S(i);if(!s){t.loading=!1;return}M(s),t.loading=!1},f=async t=>{if(!t)return;const i=[...a.list.keys()].find(y=>/arq/.test(y));if(!i)return;const s=a.list.get(i);if(!s)return;const m=t;e=m,m.innerHTML="";const L=await s.getItemsWithGeometryCategories();for(const[y,F]of L.entries()){const H=C.create(()=>v`<bim-option ?checked=${y===0} label=${F}></bim-option>`);m.append(H)}},g=async({target:t})=>{if(!e)return;t.loading=!0;const[i]=e.value,s=await S(i);if(!s){t.loading=!1;return}const m=new x;s.getBoundingSphere(m),n.camera.controls.fitToSphere(m,!0),t.loading=!1},h=()=>{K()},w=t=>{t&&(o=t)},$=async({target:t})=>{if(!o)return;t.loading=!0;const[i]=o.value;await J(i),t.loading=!1};return v`
    <bim-panel active label="Bounding Boxer Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-label style="width: 15rem; white-space: normal;">Get rid of all helpers created, to prevent memory leaks.</bim-label>
        <bim-button label="Dispose Helpers" @click=${h}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Models">
        <bim-button label="Fit Models" @click=${r}></bim-button>
        <bim-button label="Add Helper" @click=${l}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Categories">
        <bim-label style="width: 15rem; white-space: normal;">As elements from categories are dispersed around the whole model, the camera fit will take the first element of the category so its easier to see the result.</bim-label>
        <bim-dropdown ${B(f)} required></bim-dropdown>
        <bim-button label="Fit Category Item" @click=${g}></bim-button>
        <bim-button label="Add Helper" @click=${b}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Orientation">
        <bim-label style="width: 15rem; white-space: normal;">Please, be aware there may be some discrepancies between Back, Front, Left and Right because of how the model was created in the authoring software.</bim-label>
        <bim-dropdown ${B(w)} required>
          <bim-option label="Back" value="back"></bim-option>
          <bim-option label="Left" value="left"></bim-option>
          <bim-option label="Right" value="right"></bim-option>
          <bim-option label="Top" value="top"></bim-option>
          <bim-option label="Bottom" value="bottom"></bim-option>
        </bim-dropdown>
        <bim-button label="Set Camera Orientation" @click=${$}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const N=C.create(()=>v`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(N);const p=new D;p.showPanel(2);document.body.append(p.dom);p.dom.style.left="0px";p.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>p.begin());n.renderer.onAfterUpdate.add(()=>p.end());
