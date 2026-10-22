import{K as A,n as y,m as B,b as C,S as D,J as x,T as q}from"./TransformControls-uP1Cexzu.js";import{C as T,W as P,S as R,a as U,O as W,F as O,d as _,D as z}from"./index-CmPoL2JM.js";const d=new T,E=d.get(P),n=E.create();n.scene=new R(d);n.scene.setup();n.scene.three.background=null;const G=document.getElementById("container");n.renderer=new U(d,G);n.camera=new W(d);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);d.init();const j=await O.getWorker(),a=d.get(O);a.init(j);n.camera.controls.addEventListener("update",()=>a.core.update());n.onCameraChanged.add(e=>{for(const[,o]of a.list)o.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),a.core.update(!0)});a.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const K=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(K.map(async e=>{const o=e.split("/").pop()?.split(".").shift();if(!o)return null;const l=await(await fetch(e)).arrayBuffer();return a.core.load(l,{modelId:o})}));const c=d.get(_),I=()=>{c.list.clear(),c.addFromModels();const e=c.get();return c.list.clear(),e},S=async e=>{const o=[...a.list.keys()].find(h=>/arq/.test(h));if(!o)return null;const r=a.list.get(o);if(!r)return null;const l=await r.getItemsOfCategories([new RegExp(`^${e}$`)]),u=Object.values(l).flat().slice(0,1),f={[o]:new Set(u)};c.list.clear(),await c.addFromModelIdMap(f);const g=c.get();return c.list.clear(),g},J=async e=>{const o=n.camera;if(!o.hasCameraControls())return;const{position:r,target:l}=await c.getCameraOrientation(e);await o.controls.setLookAt(r.x,r.y,r.z,l.x,l.y,l.z,!0)};let v=[];const M=e=>{const o=new q(e);n.scene.three.add(o),v.push(o)},N=()=>{const e=d.get(z);for(const o of v)e.destroy(o);v=[]};A.init();const p=y.create(()=>{let e,o;const r=({target:t})=>{t.loading=!0;const i=I(),s=new x;i.getBoundingSphere(s),n.camera.controls.fitToSphere(s,!0),t.loading=!1},l=()=>{const t=I();M(t)},k=async({target:t})=>{if(!e)return;t.loading=!0;const[i]=e.value,s=await S(i);if(!s){t.loading=!1;return}M(s),t.loading=!1},u=async t=>{if(!t)return;const i=[...a.list.keys()].find(w=>/arq/.test(w));if(!i)return;const s=a.list.get(i);if(!s)return;const m=t;e=m,m.innerHTML="";const L=await s.getItemsWithGeometryCategories();for(const[w,F]of L.entries()){const H=y.create(()=>C`<bim-option ?checked=${w===0} label=${F}></bim-option>`);m.append(H)}},f=async({target:t})=>{if(!e)return;t.loading=!0;const[i]=e.value,s=await S(i);if(!s){t.loading=!1;return}const m=new x;s.getBoundingSphere(m),n.camera.controls.fitToSphere(m,!0),t.loading=!1},g=()=>{N()},h=t=>{t&&(o=t)},$=async({target:t})=>{if(!o)return;t.loading=!0;const[i]=o.value;await J(i),t.loading=!1};return C`
    <bim-panel active label="Bounding Boxer Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-label style="width: 15rem; white-space: normal;">Get rid of all helpers created, to prevent memory leaks.</bim-label>
        <bim-button label="Dispose Helpers" @click=${g}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Models">
        <bim-button label="Fit Models" @click=${r}></bim-button>
        <bim-button label="Add Helper" @click=${l}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Categories">
        <bim-label style="width: 15rem; white-space: normal;">As elements from categories are dispersed around the whole model, the camera fit will take the first element of the category so its easier to see the result.</bim-label>
        <bim-dropdown ${B(u)} required></bim-dropdown>
        <bim-button label="Fit Category Item" @click=${f}></bim-button>
        <bim-button label="Add Helper" @click=${k}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Orientation">
        <bim-label style="width: 15rem; white-space: normal;">Please, be aware there may be some discrepancies between Back, Front, Left and Right because of how the model was created in the authoring software.</bim-label>
        <bim-dropdown ${B(h)} required>
          <bim-option label="Back" value="back"></bim-option>
          <bim-option label="Left" value="left"></bim-option>
          <bim-option label="Right" value="right"></bim-option>
          <bim-option label="Top" value="top"></bim-option>
          <bim-option label="Bottom" value="bottom"></bim-option>
        </bim-dropdown>
        <bim-button label="Set Camera Orientation" @click=${$}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(p);const Q=y.create(()=>C`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Q);const b=new D;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>b.begin());n.renderer.onAfterUpdate.add(()=>b.end());
