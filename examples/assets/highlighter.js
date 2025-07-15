import{C as b,a as u}from"./index-D7EC26VF.js";import{C as f,W as w,S as y,O as C,F as v,R as k,c as I}from"./graphic-vertex-picker-C_xseSgk.js";import{a as R,R as h,m as g}from"./index-bERBRksd.js";import{P as H}from"./index-WsJUHyIb.js";import{H as S}from"./index-BEyww2em.js";const l=new f,U=l.get(w),t=U.create();t.scene=new y(l);t.scene.setup();t.scene.three.background=null;const L=document.getElementById("container");t.renderer=new H(l,L);t.camera=new C(l);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);l.init();const P="https://thatopen.github.io/engine_fragment/resources/worker.mjs",j=await fetch(P),F=await j.blob(),B=new File([F],"worker.mjs",{type:"text/javascript"}),M=URL.createObjectURL(B),n=l.get(v);n.init(M);t.camera.controls.addEventListener("rest",()=>n.core.update(!0));t.onCameraChanged.add(e=>{for(const[,s]of n.list)s.useCamera(e.three);n.core.update(!0)});n.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),n.core.update(!0)});const $=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all($.map(async e=>{var r;const s=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!s)return null;const d=await(await fetch(e)).arrayBuffer();return n.core.load(d,{modelId:s})}));l.get(k).get(t);const o=l.get(S);o.setup({world:t,selectMaterialDefinition:{color:new b("#bcf124"),opacity:1,transparent:!1,renderedFaces:0}});o.events.select.onHighlight.add(async e=>{console.log("Something was selected");const s=[];for(const[d,r]of Object.entries(e)){const p=n.list.get(d);p&&s.push(p.getItemsData([...r]))}const m=(await Promise.all(s)).flat();console.log(m)});o.events.select.onClear.add(()=>{console.log("Selection was cleared")});const a="Red";o.styles.set(a,{color:new b("red"),opacity:1,transparent:!1,renderedFaces:0});o.events[a].onHighlight.add(e=>{console.log("Highligthed with red",e)});o.events[a].onClear.add(e=>{console.log("Red highlighter cleared",e)});const A=async()=>{if(!o.styles.has(a))return;const e=o.selection.select;I.isEmpty(e)||await o.highlightByID(a,e,!1)},O=async(e=!0)=>{if(!o.styles.has(a))return;const s=o.selection.select;await o.clear(a,e?s:void 0),await o.clear("select")};R.init();const c=h.create(()=>g`
    <bim-panel active label="Highlighter Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Click: single-selection</bim-label>
        <bim-label>Ctrl + click: multi-selection</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-label style="white-space: normal; width: 14rem;">Select some items, click the apply button, and then deselect them again to see the color applied</bim-label>
        <bim-button @click=${A} label="Apply ${a}"></bim-button>
        <bim-label style="white-space: normal; width: 14rem;">Select some item colored with red and apply the button. Then, deselect it to </bim-label>
        <bim-button @click=${O} label="Reset ${a}"></bim-button>
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(c);const x=h.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(x);const i=new u;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
