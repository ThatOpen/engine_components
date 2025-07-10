import{C as h,a as u}from"./index-D7EC26VF.js";import{C as f,W as w,S as y,O as C,F as v,R as k,c as I}from"./graphic-vertex-picker-C_xseSgk.js";import{a as H,R as b,m as g}from"./index-bERBRksd.js";import{P as S}from"./index-WsJUHyIb.js";import{H as R}from"./index-BEyww2em.js";const l=new f,P=l.get(w),t=P.create();t.scene=new y(l);t.scene.setup();t.scene.three.background=null;const L=document.getElementById("container");t.renderer=new S(l,L);t.camera=new C(l);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);l.init();const M="https://thatopen.github.io/engine_fragment/resources/worker.mjs",a=l.get(v);a.init(M);t.camera.controls.addEventListener("rest",()=>a.core.update(!0));t.onCameraChanged.add(e=>{for(const[,s]of a.list)s.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),a.core.update(!0)});const $=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all($.map(async e=>{var r;const s=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!s)return null;const d=await(await fetch(e)).arrayBuffer();return a.core.load(d,{modelId:s})}));l.get(k).get(t);const o=l.get(R);o.setup({world:t,selectMaterialDefinition:{color:new h("#bcf124"),opacity:1,transparent:!1,renderedFaces:0}});o.events.select.onHighlight.add(async e=>{console.log("Something was selected");const s=[];for(const[d,r]of Object.entries(e)){const p=a.list.get(d);p&&s.push(p.getItemsData([...r]))}const m=(await Promise.all(s)).flat();console.log(m)});o.events.select.onClear.add(()=>{console.log("Selection was cleared")});const n="Red";o.styles.set(n,{color:new h("red"),opacity:1,transparent:!1,renderedFaces:0});o.events[n].onHighlight.add(e=>{console.log("Highligthed with red",e)});o.events[n].onClear.add(e=>{console.log("Red highlighter cleared",e)});const A=async()=>{if(!o.styles.has(n))return;const e=o.selection.select;I.isEmpty(e)||await o.highlightByID(n,e,!1)},B=async(e=!0)=>{if(!o.styles.has(n))return;const s=o.selection.select;await o.clear(n,e?s:void 0),await o.clear("select")};H.init();const c=b.create(()=>g`
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
  `);document.body.append(c);const F=b.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);const i=new u;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
