import{C as h,l as w,c as p,a as c,b as y,z as C}from"./index-BET5fVdQ.js";import{C as k,W as v,S as I,a as L,O as S,F as O,R as U}from"./index-B31d80Z1.js";const s=new k,R=s.get(v),o=R.create();o.scene=new I(s);o.scene.setup();o.scene.three.background=null;const u=document.getElementById("container");o.renderer=new L(s,u);o.camera=new S(s);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const j="https://thatopen.github.io/engine_fragment/resources/worker.mjs",F=await fetch(j),$=await F.blob(),P=new File([$],"worker.mjs",{type:"text/javascript"}),_=URL.createObjectURL(P),t=s.get(O);t.init(_);o.camera.controls.addEventListener("update",()=>t.core.update());o.onCameraChanged.add(e=>{for(const[,a]of t.list)a.useCamera(e.three);t.core.update(!0)});t.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),t.core.update(!0)});t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const x=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(x.map(async e=>{var n;const a=(n=e.split("/").pop())==null?void 0:n.split(".").shift();if(!a)return null;const i=await(await fetch(e)).arrayBuffer();return t.core.load(i,{modelId:a})}));const z=s.get(U),B=z.get(o);let g=e=>{};u.addEventListener("dblclick",async()=>{const e=await B.castRay();if(!e)return;const a={[e.fragments.modelId]:new Set([e.localId])};g(a)});let f=()=>{},d;const b=new h("purple");g=async e=>{const a=Object.keys(e)[0];if(a&&t.list.get(a)){const l=t.list.get(a),[i]=await l.getItemsData([...e[a]]);d=i}await t.highlight({color:b,renderedFaces:C.ONE,opacity:1,transparent:!1},e),await t.core.update(!0),f()};w.init();const[m,E]=p.create(e=>{const a=({target:n})=>{b.set(n.color)};let l=c`<bim-label>There is no item name to display.</bim-label>`;d&&"value"in d.Name&&(l=c`<bim-label>${d.Name.value}</bim-label>`);const i=async({target:n})=>{n.loading=!0,await t.resetHighlight(),await t.core.update(!0),n.loading=!1};return c`
    <bim-panel active label="Raycasters Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Double Click: Colorize element</bim-label>
        <bim-color-input @input=${a} color=#${b.getHexString()}></bim-color-input>
        <bim-button label="Clear Colors" @click=${i}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Item Data">
        ${l}
      </bim-panel-section>
    </bim-panel>
  `},{});f=()=>E();document.body.append(m);const M=p.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(M);const r=new y;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>r.begin());o.renderer.onAfterUpdate.add(()=>r.end());
