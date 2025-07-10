import{C as b,T as g,L as h,m as u,a as f}from"./index-BR15nMAM.js";import{C as w,W as y,S as C,O as v,F as k,R as I,c as H}from"./graphic-vertex-picker-WQ6fDD2d.js";import{P as S}from"./index-BYTOCRNk.js";import{H as L}from"./index-CGLMC8u3.js";const l=new w,P=l.get(y),t=P.create();t.scene=new C(l);t.scene.setup();t.scene.three.background=null;const R=document.getElementById("container");t.renderer=new S(l,R);t.camera=new v(l);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);l.init();const M="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",n=l.get(k);n.init(M);t.camera.controls.addEventListener("rest",()=>n.core.update(!0));t.onCameraChanged.add(e=>{for(const[,o]of n.list)o.useCamera(e.three);n.core.update(!0)});n.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),n.core.update(!0)});const $=["/resources/frags/school_arq.frag"];await Promise.all($.map(async e=>{var r;const o=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!o)return null;const d=await(await fetch(e)).arrayBuffer();return n.core.load(d,{modelId:o})}));l.get(I).get(t);const s=l.get(L);s.setup({world:t,selectMaterialDefinition:{color:new b("#bcf124"),opacity:1,transparent:!1,renderedFaces:0}});s.events.select.onHighlight.add(async e=>{console.log("Something was selected");const o=[];for(const[d,r]of Object.entries(e)){const p=n.list.get(d);p&&o.push(p.getItemsData([...r]))}const m=(await Promise.all(o)).flat();console.log(m)});s.events.select.onClear.add(()=>{console.log("Selection was cleared")});const a="Red";s.styles.set(a,{color:new b("red"),opacity:1,transparent:!1,renderedFaces:0});s.events[a].onHighlight.add(e=>{console.log("Highligthed with red",e)});s.events[a].onClear.add(e=>{console.log("Red highlighter cleared",e)});const A=async()=>{if(!s.styles.has(a))return;const e=s.selection.select;H.isEmpty(e)||await s.highlightByID(a,e,!1)},B=async(e=!0)=>{if(!s.styles.has(a))return;const o=s.selection.select;await s.clear(a,e?o:void 0),await s.clear("select")};g.init();const c=h.create(()=>u`
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
