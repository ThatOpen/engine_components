import{C as h,u as g,V as b,f as u,a as f}from"./index-BVinSk0X.js";import{C as w,W as y,S as C,O as v,F as k,R as I,M as H}from"./graphic-vertex-picker-DIM7gQA5.js";import{P as S}from"./index-BLwIRjEQ.js";import{H as P}from"./index-DTBV6yJD.js";const l=new w,M=l.get(y),t=M.create();t.scene=new C(l);t.scene.setup();t.scene.three.background=null;const R=document.getElementById("container");t.renderer=new S(l,R);t.camera=new v(l);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);l.init();const L="https://thatopen.github.io/engine_fragment/resources/worker.mjs",a=l.get(k);a.init(L);t.camera.controls.addEventListener("rest",()=>a.core.update(!0));t.onCameraChanged.add(e=>{for(const[,o]of a.list)o.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),a.core.update(!0)});const $=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all($.map(async e=>{var r;const o=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!o)return null;const d=await(await fetch(e)).arrayBuffer();return a.core.load(d,{modelId:o})}));l.get(I).get(t);const s=l.get(P);s.setup({world:t,selectMaterialDefinition:{color:new h("#bcf124"),opacity:1,transparent:!1,renderedFaces:0}});s.events.select.onHighlight.add(async e=>{console.log("Something was selected");const o=[];for(const[d,r]of Object.entries(e)){const p=a.list.get(d);p&&o.push(p.getItemsData([...r]))}const m=(await Promise.all(o)).flat();console.log(m)});s.events.select.onClear.add(()=>{console.log("Selection was cleared")});const n="Red";s.styles.set(n,{color:new h("red"),opacity:1,transparent:!1,renderedFaces:0});s.events[n].onHighlight.add(e=>{console.log("Highligthed with red",e)});s.events[n].onClear.add(e=>{console.log("Red highlighter cleared",e)});const A=async()=>{if(!s.styles.has(n))return;const e=s.selection.select;H.isEmpty(e)||await s.highlightByID(n,e,!1)},B=async(e=!0)=>{if(!s.styles.has(n))return;const o=s.selection.select;await s.clear(n,e?o:void 0),await s.clear("select")};g.init();const c=b.create(()=>u`
    <bim-panel active label="Highlighter Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Click: single-selection</bim-label>
        <bim-label>Ctrl + click: multi-selection</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-label style="white-space: normal; width: 14rem;">Select some items, click the apply button, and then deselect them again to see the color applied</bim-label>
        <bim-button @click=${A} label="Apply ${n}"></bim-button>
        <bim-label style="white-space: normal; width: 14rem;">Select some item colored with red and apply the button. Then, deselect it to </bim-label>
        <bim-button @click=${B} label="Reset ${n}"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(c);const F=b.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
