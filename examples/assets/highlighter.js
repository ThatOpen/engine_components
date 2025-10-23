import{C as b,u as g,V as h,f as u,a as f}from"./index-BVinSk0X.js";import{C as w,W as y,S as C,O as v,F as k,R as I,M as H}from"./graphic-vertex-picker-DIM7gQA5.js";import{P as S}from"./index-BLwIRjEQ.js";import{H as P}from"./index-DTBV6yJD.js";const l=new w,M=l.get(y),t=M.create();t.scene=new C(l);t.scene.setup();t.scene.three.background=null;const R=document.getElementById("container");t.renderer=new S(l,R);t.camera=new v(l);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);l.init();const L="/node_modules/@thatopen-platform/fragments-beta/dist/Worker/worker.mjs",n=l.get(k);n.init(L);t.camera.controls.addEventListener("rest",()=>n.core.update(!0));t.onCameraChanged.add(e=>{for(const[,s]of n.list)s.useCamera(e.three);n.core.update(!0)});n.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),n.core.update(!0)});const $=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all($.map(async e=>{var r;const s=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!s)return null;const d=await(await fetch(e)).arrayBuffer();return n.core.load(d,{modelId:s})}));l.get(I).get(t);const o=l.get(P);o.setup({world:t,selectMaterialDefinition:{color:new b("#bcf124"),opacity:1,transparent:!1,renderedFaces:0}});o.events.select.onHighlight.add(async e=>{console.log("Something was selected");const s=[];for(const[d,r]of Object.entries(e)){const p=n.list.get(d);p&&s.push(p.getItemsData([...r]))}const m=(await Promise.all(s)).flat();console.log(m)});o.events.select.onClear.add(()=>{console.log("Selection was cleared")});const a="Red";o.styles.set(a,{color:new b("red"),opacity:1,transparent:!1,renderedFaces:0});o.events[a].onHighlight.add(e=>{console.log("Highligthed with red",e)});o.events[a].onClear.add(e=>{console.log("Red highlighter cleared",e)});const A=async()=>{if(!o.styles.has(a))return;const e=o.selection.select;H.isEmpty(e)||await o.highlightByID(a,e,!1)},B=async(e=!0)=>{if(!o.styles.has(a))return;const s=o.selection.select;await o.clear(a,e?s:void 0),await o.clear("select")};g.init();const c=h.create(()=>u`
    <bim-panel active label="Highlighter Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Click: single-selection</bim-label>
        <bim-label>Ctrl + click: multi-selection</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-label style="white-space: normal; width: 14rem;">Select some items, click the apply button, and then deselect them again to see the color applied</bim-label>
        <bim-button @click=${A} label="Apply ${a}"></bim-button>
        <bim-label style="white-space: normal; width: 14rem;">Select some item colored with red and apply the button. Then, deselect it to </bim-label>
        <bim-button @click=${B} label="Reset ${a}"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(c);const F=h.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
