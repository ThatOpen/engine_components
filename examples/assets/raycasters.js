import{C as w,K as y,n as p,b as c,S as C,R as v}from"./TransformControls-lNp9RmyE.js";import{C as S,W as I,S as k,a as L,O,F as b,R}from"./index-CVHtJqZ2.js";const n=new S,$=n.get(I),o=$.create();o.scene=new k(n);o.scene.setup();o.scene.three.background=null;const g=document.getElementById("container");o.renderer=new L(n,g);o.camera=new O(n);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);n.init();const F=await b.getWorker(),t=n.get(b);t.init(F);o.camera.controls.addEventListener("update",()=>t.core.update());o.onCameraChanged.add(e=>{for(const[,a]of t.list)a.useCamera(e.three);t.core.update(!0)});t.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),t.core.update(!0)});t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const P=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(P.map(async e=>{const a=e.split("/").pop()?.split(".").shift();if(!a)return null;const r=await(await fetch(e)).arrayBuffer();return t.core.load(r,{modelId:a})}));const E=n.get(R),M=E.get(o);let f=e=>{};g.addEventListener("dblclick",async()=>{const e=await M.castRay();if(!e)return;const a={[e.fragments.modelId]:new Set([e.localId])};f(a)});let h=()=>{},d;const u=new w("purple");f=async e=>{const a=Object.keys(e)[0];if(a&&t.list.get(a)){const l=t.list.get(a),[r]=await l.getItemsData([...e[a]]);d=r}await t.highlight({color:u,renderedFaces:v.ONE,opacity:1,transparent:!1},e),await t.core.update(!0),h()};y.init();const[m,U]=p.create(e=>{const a=({target:i})=>{u.set(i.color)};let l=c`<bim-label>There is no item name to display.</bim-label>`;d&&"value"in d.Name&&(l=c`<bim-label>${d.Name.value}</bim-label>`);const r=async({target:i})=>{i.loading=!0,await t.resetHighlight(),await t.core.update(!0),i.loading=!1};return c`
    <bim-panel active label="Raycasters Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Double Click: Colorize element</bim-label>
        <bim-color-input @input=${a} color=#${u.getHexString()}></bim-color-input>
        <bim-button label="Clear Colors" @click=${r}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Item Data">
        ${l}
      </bim-panel-section>
    </bim-panel>
  `},{});h=()=>U();document.body.append(m);const _=p.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(_);const s=new C;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>s.begin());o.renderer.onAfterUpdate.add(()=>s.end());
