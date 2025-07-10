import{a as O,S as B,dt as A}from"./index-D7EC26VF.js";import{a as D,R as C,F as x,m as k}from"./index-bERBRksd.js";import{C as q,W as R,S as P,a as T,O as _,F as j,e as z,D as E}from"./index-Bv9-N0Ab.js";const d=new q,G=d.get(R),n=G.create();n.scene=new P(d);n.scene.setup();n.scene.three.background=null;const U=document.getElementById("container");n.renderer=new T(d,U);n.camera=new _(d);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);d.init();const W="https://thatopen.github.io/engine_fragment/resources/worker.mjs",s=d.get(j);s.init(W);n.camera.controls.addEventListener("rest",()=>s.core.update(!0));n.onCameraChanged.add(e=>{for(const[,o]of s.list)o.useCamera(e.three);s.core.update(!0)});s.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),s.core.update(!0)});const J=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(J.map(async e=>{var p;const o=(p=e.split("/").pop())==null?void 0:p.split(".").shift();if(!o)return null;const l=await(await fetch(e)).arrayBuffer();return s.core.load(l,{modelId:o})}));const c=d.get(z),I=()=>{c.list.clear(),c.addFromModels();const e=c.get();return c.list.clear(),e},S=async e=>{const o=[...s.list.keys()].find(w=>/arq/.test(w));if(!o)return null;const i=s.list.get(o);if(!i)return null;const l=await i.getItemsOfCategories([new RegExp(`^${e}$`)]),g=Object.values(l).flat().slice(0,1),f={[o]:new Set(g)};c.list.clear(),await c.addFromModelIdMap(f);const h=c.get();return c.list.clear(),h},K=async e=>{const o=n.camera;if(!o.hasCameraControls())return;const{position:i,target:l}=await c.getCameraOrientation(e);await o.controls.setLookAt(i.x,i.y,i.z,l.x,l.y,l.z,!0)};let v=[];const $=e=>{const o=new A(e);n.scene.three.add(o),v.push(o)},N=()=>{const e=d.get(E);for(const o of v)e.destroy(o);v=[]};D.init();const u=C.create(()=>{let e,o;const i=({target:t})=>{t.loading=!0;const r=I(),a=new B;r.getBoundingSphere(a),n.camera.controls.fitToSphere(a,!0),t.loading=!1},l=()=>{const t=I();$(t)},p=async({target:t})=>{if(!e)return;t.loading=!0;const[r]=e.value,a=await S(r);if(!a){t.loading=!1;return}$(a),t.loading=!1},g=async t=>{if(!t)return;const r=[...s.list.keys()].find(y=>/arq/.test(y));if(!r)return;const a=s.list.get(r);if(!a)return;const m=t;e=m,m.innerHTML="";const M=await a.getItemsWithGeometryCategories();for(const[y,H]of M.entries()){const L=C.create(()=>k`<bim-option ?checked=${y===0} label=${H}></bim-option>`);m.append(L)}},f=async({target:t})=>{if(!e)return;t.loading=!0;const[r]=e.value,a=await S(r);if(!a){t.loading=!1;return}const m=new B;a.getBoundingSphere(m),n.camera.controls.fitToSphere(m,!0),t.loading=!1},h=()=>{N()},w=t=>{t&&(o=t)},F=async({target:t})=>{if(!o)return;t.loading=!0;const[r]=o.value;await K(r),t.loading=!1};return k`
    <bim-panel active label="Bounding Boxer Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-label style="width: 15rem; white-space: normal;">Get rid of all helpers created, to prevent memory leaks.</bim-label>
        <bim-button label="Dispose Helpers" @click=${h}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Models">
        <bim-button label="Fit Models" @click=${i}></bim-button>
        <bim-button label="Add Helper" @click=${l}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Categories">
        <bim-label style="width: 15rem; white-space: normal;">As elements from categories are dispersed around the whole model, the camera fit will take the first element of the category so its easier to see the result.</bim-label>
        <bim-dropdown ${x(g)} required></bim-dropdown>
        <bim-button label="Fit Category Item" @click=${f}></bim-button>
        <bim-button label="Add Helper" @click=${p}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Orientation">
        <bim-label style="width: 15rem; white-space: normal;">Please, be aware there may be some discrepancies between Back, Front, Left and Right because of how the model was created in the authoring software.</bim-label>
        <bim-dropdown ${x(w)} required>
          <bim-option label="Back" value="back"></bim-option>
          <bim-option label="Left" value="left"></bim-option>
          <bim-option label="Right" value="right"></bim-option>
          <bim-option label="Top" value="top"></bim-option>
          <bim-option label="Bottom" value="bottom"></bim-option>
        </bim-dropdown>
        <bim-button label="Set Camera Orientation" @click=${F}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const Q=C.create(()=>k`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Q);const b=new O;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>b.begin());n.renderer.onAfterUpdate.add(()=>b.end());
