import{C as w,p as y,m as u,a as c,b as C,z as v}from"./index-r1u2qk8S.js";import{C as S,W as I,S as k,a as L,O,F as b,R}from"./index-Dx2GLmSS.js";const s=new S,$=s.get(I),o=$.create();o.scene=new k(s);o.scene.setup();o.scene.three.background=null;const g=document.getElementById("container");o.renderer=new L(s,g);o.camera=new O(s);await o.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);s.init();const F=await b.getWorker(),t=s.get(b);t.init(F);o.camera.controls.addEventListener("update",()=>t.core.update());o.onCameraChanged.add(e=>{for(const[,a]of t.list)a.useCamera(e.three);t.core.update(!0)});t.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),t.core.update(!0)});t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const P=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(P.map(async e=>{var n;const a=(n=e.split("/").pop())==null?void 0:n.split(".").shift();if(!a)return null;const i=await(await fetch(e)).arrayBuffer();return t.core.load(i,{modelId:a})}));const E=s.get(R),M=E.get(o);let f=e=>{};g.addEventListener("dblclick",async()=>{const e=await M.castRay();if(!e)return;const a={[e.fragments.modelId]:new Set([e.localId])};f(a)});let h=()=>{},d;const p=new w("purple");f=async e=>{const a=Object.keys(e)[0];if(a&&t.list.get(a)){const r=t.list.get(a),[i]=await r.getItemsData([...e[a]]);d=i}await t.highlight({color:p,renderedFaces:v.ONE,opacity:1,transparent:!1},e),await t.core.update(!0),h()};y.init();const[m,U]=u.create(e=>{const a=({target:n})=>{p.set(n.color)};let r=c`<bim-label>There is no item name to display.</bim-label>`;d&&"value"in d.Name&&(r=c`<bim-label>${d.Name.value}</bim-label>`);const i=async({target:n})=>{n.loading=!0,await t.resetHighlight(),await t.core.update(!0),n.loading=!1};return c`
    <bim-panel active label="Raycasters Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Double Click: Colorize element</bim-label>
        <bim-color-input @input=${a} color=#${p.getHexString()}></bim-color-input>
        <bim-button label="Clear Colors" @click=${i}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Item Data">
        ${r}
      </bim-panel-section>
    </bim-panel>
  `},{});h=()=>U();document.body.append(m);const _=u.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{m.classList.contains("options-menu-visible")?m.classList.remove("options-menu-visible"):m.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(_);const l=new C;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>l.begin());o.renderer.onAfterUpdate.add(()=>l.end());
