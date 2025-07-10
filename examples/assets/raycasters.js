import{C as w,T as h,L as b,m as c,a as C,v as y}from"./index-BR15nMAM.js";import{C as v,W as k,S as I,a as S,O as L,F as $,R as P}from"./index-DQoMA9YT.js";const s=new v,R=s.get(k),n=R.create();n.scene=new I(s);n.scene.setup();n.scene.three.background=null;const p=document.getElementById("container");n.renderer=new S(s,p);n.camera=new L(s);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const E="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",a=s.get($);a.init(E);n.camera.controls.addEventListener("rest",()=>a.core.update(!0));n.onCameraChanged.add(e=>{for(const[,t]of a.list)t.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),a.core.update(!0)});const O=["/resources/frags/school_arq.frag"];await Promise.all(O.map(async e=>{var o;const t=(o=e.split("/").pop())==null?void 0:o.split(".").shift();if(!t)return null;const i=await(await fetch(e)).arrayBuffer();return a.core.load(i,{modelId:t})}));const T=s.get(P),_=T.get(n);let g=e=>{};p.addEventListener("dblclick",async()=>{const e=await _.castRay();if(!e)return;const t={[e.fragments.modelId]:new Set([e.localId])};g(t)});let f=()=>{},m;const u=new w("purple");g=async e=>{const t=Object.keys(e)[0];if(t&&a.list.get(t)){const l=a.list.get(t),[i]=await l.getItemsData([...e[t]]);m=i}await a.highlight({color:u,renderedFaces:y.ONE,opacity:1,transparent:!1},e),await a.core.update(!0),f()};h.init();const[d,j]=b.create(e=>{const t=({target:o})=>{u.set(o.color)};let l=c`<bim-label>There is no item name to display.</bim-label>`;m&&"value"in m.Name&&(l=c`<bim-label>${m.Name.value}</bim-label>`);const i=async({target:o})=>{o.loading=!0,await a.resetHighlight(),await a.core.update(!0),o.loading=!1};return c`
    <bim-panel active label="Raycasters Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Double Click: Colorize element</bim-label>
        <bim-color-input @input=${t} color=#${u.getHexString()}></bim-color-input>
        <bim-button label="Clear Colors" @click=${i}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Item Data">
        ${l}
      </bim-panel-section>
    </bim-panel>
  `},{});f=()=>j();document.body.append(d);const x=b.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(x);const r=new C;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>r.begin());n.renderer.onAfterUpdate.add(()=>r.end());
