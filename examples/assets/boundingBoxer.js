import{l as H,c as k,t as B,a as C,b as A,S as x,aQ as D}from"./index-BET5fVdQ.js";import{C as U,W as q,S as j,a as R,O as P,F as T,e as _,D as z}from"./index-B31d80Z1.js";const d=new U,E=d.get(q),n=E.create();n.scene=new j(d);n.scene.setup();n.scene.three.background=null;const G=document.getElementById("container");n.renderer=new R(d,G);n.camera=new P(d);await n.camera.controls.setLookAt(78,20,-2.2,26,-4,25);d.init();const W="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Q=await fetch(W),J=await Q.blob(),K=new File([J],"worker.mjs",{type:"text/javascript"}),N=URL.createObjectURL(K),a=d.get(T);a.init(N);n.camera.controls.addEventListener("update",()=>a.core.update());n.onCameraChanged.add(e=>{for(const[,o]of a.list)o.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),a.core.update(!0)});a.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const V=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag","https://thatopen.github.io/engine_components/resources/frags/school_str.frag"];await Promise.all(V.map(async e=>{var p;const o=(p=e.split("/").pop())==null?void 0:p.split(".").shift();if(!o)return null;const l=await(await fetch(e)).arrayBuffer();return a.core.load(l,{modelId:o})}));const c=d.get(_),I=()=>{c.list.clear(),c.addFromModels();const e=c.get();return c.list.clear(),e},S=async e=>{const o=[...a.list.keys()].find(w=>/arq/.test(w));if(!o)return null;const r=a.list.get(o);if(!r)return null;const l=await r.getItemsOfCategories([new RegExp(`^${e}$`)]),f=Object.values(l).flat().slice(0,1),g={[o]:new Set(f)};c.list.clear(),await c.addFromModelIdMap(g);const h=c.get();return c.list.clear(),h},X=async e=>{const o=n.camera;if(!o.hasCameraControls())return;const{position:r,target:l}=await c.getCameraOrientation(e);await o.controls.setLookAt(r.x,r.y,r.z,l.x,l.y,l.z,!0)};let v=[];const F=e=>{const o=new D(e);n.scene.three.add(o),v.push(o)},Y=()=>{const e=d.get(z);for(const o of v)e.destroy(o);v=[]};H.init();const u=k.create(()=>{let e,o;const r=({target:t})=>{t.loading=!0;const i=I(),s=new x;i.getBoundingSphere(s),n.camera.controls.fitToSphere(s,!0),t.loading=!1},l=()=>{const t=I();F(t)},p=async({target:t})=>{if(!e)return;t.loading=!0;const[i]=e.value,s=await S(i);if(!s){t.loading=!1;return}F(s),t.loading=!1},f=async t=>{if(!t)return;const i=[...a.list.keys()].find(y=>/arq/.test(y));if(!i)return;const s=a.list.get(i);if(!s)return;const m=t;e=m,m.innerHTML="";const M=await s.getItemsWithGeometryCategories();for(const[y,O]of M.entries()){const $=k.create(()=>C`<bim-option ?checked=${y===0} label=${O}></bim-option>`);m.append($)}},g=async({target:t})=>{if(!e)return;t.loading=!0;const[i]=e.value,s=await S(i);if(!s){t.loading=!1;return}const m=new x;s.getBoundingSphere(m),n.camera.controls.fitToSphere(m,!0),t.loading=!1},h=()=>{Y()},w=t=>{t&&(o=t)},L=async({target:t})=>{if(!o)return;t.loading=!0;const[i]=o.value;await X(i),t.loading=!1};return C`
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
        <bim-button label="Add Helper" @click=${p}></bim-button>
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
        <bim-button label="Set Camera Orientation" @click=${L}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(u);const Z=k.create(()=>C`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{u.classList.contains("options-menu-visible")?u.classList.remove("options-menu-visible"):u.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Z);const b=new A;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>b.begin());n.renderer.onAfterUpdate.add(()=>b.end());
