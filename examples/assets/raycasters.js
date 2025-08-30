import{C as w,a as h,v as C}from"./index-lvtjgYNN.js";import{a as y,R as u,m as c}from"./index-bERBRksd.js";import{C as v,W as k,S as I,a as S,O as L,F as R,R as U}from"./index-BPZgAaC0.js";const s=new v,j=s.get(k),o=j.create();o.scene=new I(s);o.scene.setup();o.scene.three.background=null;const p=document.getElementById("container");o.renderer=new S(s,p);o.camera=new L(s);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const $="https://thatopen.github.io/engine_fragment/resources/worker.mjs",F=await fetch($),O=await F.blob(),P=new File([O],"worker.mjs",{type:"text/javascript"}),_=URL.createObjectURL(P),a=s.get(R);a.init(_);o.camera.controls.addEventListener("rest",()=>a.core.update(!0));o.onCameraChanged.add(e=>{for(const[,t]of a.list)t.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),a.core.update(!0)});const x=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(x.map(async e=>{var n;const t=(n=e.split("/").pop())==null?void 0:n.split(".").shift();if(!t)return null;const i=await(await fetch(e)).arrayBuffer();return a.core.load(i,{modelId:t})}));const B=s.get(U),E=B.get(o);let g=e=>{};p.addEventListener("dblclick",async()=>{const e=await E.castRay();if(!e)return;const t={[e.fragments.modelId]:new Set([e.localId])};g(t)});let f=()=>{},m;const b=new w("purple");g=async e=>{const t=Object.keys(e)[0];if(t&&a.list.get(t)){const l=a.list.get(t),[i]=await l.getItemsData([...e[t]]);m=i}await a.highlight({color:b,renderedFaces:C.ONE,opacity:1,transparent:!1},e),await a.core.update(!0),f()};y.init();const[d,D]=u.create(e=>{const t=({target:n})=>{b.set(n.color)};let l=c`<bim-label>There is no item name to display.</bim-label>`;m&&"value"in m.Name&&(l=c`<bim-label>${m.Name.value}</bim-label>`);const i=async({target:n})=>{n.loading=!0,await a.resetHighlight(),await a.core.update(!0),n.loading=!1};return c`
    <bim-panel active label="Raycasters Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Double Click: Colorize element</bim-label>
        <bim-color-input @input=${t} color=#${b.getHexString()}></bim-color-input>
        <bim-button label="Clear Colors" @click=${i}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Item Data">
        ${l}
      </bim-panel-section>
    </bim-panel>
  `},{});f=()=>D();document.body.append(d);const N=u.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(N);const r=new h;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>r.begin());o.renderer.onAfterUpdate.add(()=>r.end());
