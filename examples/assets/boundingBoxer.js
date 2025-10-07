import{a as H,S as B,dt as A}from"./index-lvtjgYNN.js";import{a as D,R as k,F as x,m as C}from"./index-bERBRksd.js";import{C as R,W as q,S as U,a as j,O as P,F as T,e as _,D as z}from"./index-BPZgAaC0.js";const d=new R,E=d.get(q),n=E.create();n.scene=new U(d);n.scene.setup();n.scene.three.background=null;const G=document.getElementById("container");n.renderer=new j(d,G);n.camera=new P(d);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);d.init();const W="https://thatopen.github.io/engine_fragment/resources/worker.mjs",J=await fetch(W),K=await J.blob(),N=new File([K],"worker.mjs",{type:"text/javascript"}),Q=URL.createObjectURL(N),s=d.get(T);s.init(Q);n.camera.controls.addEventListener("rest",()=>s.core.update(!0));n.onCameraChanged.add(e=>{for(const[,o]of s.list)o.useCamera(e.three);s.core.update(!0)});s.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),s.core.update(!0)});const V=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(V.map(async e=>{var p;const o=(p=e.split("/").pop())==null?void 0:p.split(".").shift();if(!o)return null;const l=await(await fetch(e)).arrayBuffer();return s.core.load(l,{modelId:o})}));const c=d.get(_),I=()=>{c.list.clear(),c.addFromModels();const e=c.get();return c.list.clear(),e},S=async e=>{const o=[...s.list.keys()].find(w=>/arq/.test(w));if(!o)return null;const i=s.list.get(o);if(!i)return null;const l=await i.getItemsOfCategories([new RegExp(`^${e}$`)]),g=Object.values(l).flat().slice(0,1),f={[o]:new Set(g)};c.list.clear(),await c.addFromModelIdMap(f);const h=c.get();return c.list.clear(),h},X=async e=>{const o=n.camera;if(!o.hasCameraControls())return;const{position:i,target:l}=await c.getCameraOrientation(e);await o.controls.setLookAt(i.x,i.y,i.z,l.x,l.y,l.z,!0)};let v=[];const F=e=>{const o=new A(e);n.scene.three.add(o),v.push(o)},Y=()=>{const e=d.get(z);for(const o of v)e.destroy(o);v=[]};D.init();const u=k.create(()=>{let e,o;const i=({target:t})=>{t.loading=!0;const r=I(),a=new B;r.getBoundingSphere(a),n.camera.controls.fitToSphere(a,!0),t.loading=!1},l=()=>{const t=I();F(t)},p=async({target:t})=>{if(!e)return;t.loading=!0;const[r]=e.value,a=await S(r);if(!a){t.loading=!1;return}F(a),t.loading=!1},g=async t=>{if(!t)return;const r=[...s.list.keys()].find(y=>/arq/.test(y));if(!r)return;const a=s.list.get(r);if(!a)return;const m=t;e=m,m.innerHTML="";const L=await a.getItemsWithGeometryCategories();for(const[y,M]of L.entries()){const O=k.create(()=>C`<bim-option ?checked=${y===0} label=${M}></bim-option>`);m.append(O)}},f=async({target:t})=>{if(!e)return;t.loading=!0;const[r]=e.value,a=await S(r);if(!a){t.loading=!1;return}const m=new B;a.getBoundingSphere(m),n.camera.controls.fitToSphere(m,!0),t.loading=!1},h=()=>{Y()},w=t=>{t&&(o=t)},$=async({target:t})=>{if(!o)return;t.loading=!0;const[r]=o.value;await X(r),t.loading=!1};return C`
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
        <bim-button label="Set Camera Orientation" @click=${$}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const Z=k.create(()=>C`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Z);const b=new H;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>b.begin());n.renderer.onAfterUpdate.add(()=>b.end());
