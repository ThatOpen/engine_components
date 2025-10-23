import{l as p,u,V as c,f as m,a as f,C as b}from"./index-BVinSk0X.js";import{C as g,W as h,S as w,O as C,F as v}from"./graphic-vertex-picker-DIM7gQA5.js";import{P as y}from"./index-BLwIRjEQ.js";import{H as k}from"./index-Ml4pzqOS.js";import"./index-uVKS97J8.js";const a=new g,P=a.get(h),e=P.create();e.scene=new w(a);e.scene.setup();e.scene.three.background=null;const S=document.getElementById("container");e.renderer=new y(a,S);e.camera=new C(a);await e.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const L="/node_modules/@thatopen-platform/fragments-beta/dist/Worker/worker.mjs",r=a.get(v);r.init(L);e.camera.controls.addEventListener("rest",()=>r.core.update(!0));e.onCameraChanged.add(t=>{for(const[,n]of r.list)n.useCamera(t.three);r.core.update(!0)});r.list.onItemSet.add(({value:t})=>{t.useCamera(e.camera.three),e.scene.three.add(t.object),r.core.update(!0)});const B=["/resources/frags/school_arq.frag"];await Promise.all(B.map(async t=>{var l;const n=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!n)return null;const d=await(await fetch(t)).arrayBuffer();return r.core.load(d,{modelId:n})}));const o=a.get(k);o.world=e;o.enabled=!0;o.material=new p({color:6629591,transparent:!0,opacity:.5,depthTest:!1});u.init();const i=c.create(()=>{const t=({target:n})=>{"color"in o.material&&o.material.color instanceof b&&o.material.color.set(n.color)};return m`
    <bim-panel active label="Hoverer Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-color-input color="#${o.material.color.getHexString()}" label="Color" @input=${t}></bim-color-input>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(i);const H=c.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(H);const s=new f;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());
