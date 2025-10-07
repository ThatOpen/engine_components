import{C as g,a as f}from"./index-lvtjgYNN.js";import{a as v,R as p,m}from"./index-bERBRksd.js";import{C as h,W as w,S as y,a as C,O as S,F as k}from"./index-BPZgAaC0.js";import{G}from"./index-_W6Uwbrx.js";const r=new h,L=r.get(w),t=L.create();t.scene=new y(r);t.scene.setup();t.scene.three.background=null;const I=document.getElementById("container");t.renderer=new C(r,I);t.camera=new S(r);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const U="https://thatopen.github.io/engine_fragment/resources/worker.mjs",$=await fetch(U),x=await $.blob(),E=new File([x],"worker.mjs",{type:"text/javascript"}),N=URL.createObjectURL(E),a=r.get(k);a.init(N);t.camera.controls.addEventListener("rest",()=>a.core.update(!0));t.onCameraChanged.add(n=>{for(const[,e]of a.list)e.useCamera(n.three);a.core.update(!0)});a.list.onItemSet.add(({value:n})=>{n.useCamera(t.camera.three),t.scene.three.add(n.object),a.core.update(!0)});const j=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"],[d]=await Promise.all(j.map(async n=>{var u;const e=(u=n.split("/").pop())==null?void 0:u.split(".").shift();if(!e)return null;const o=await(await fetch(n)).arrayBuffer();return a.core.load(o,{modelId:e})})),O=r.get(G),l=O.create(t),R=await d.getItemsOfCategories([/BUILDINGSTOREY/]),z=Object.values(R).flat(),b=await d.getItemsData(z),B=async n=>{const e=b.find(o=>"Name"in o&&"value"in o.Name?o.Name.value===n:!1);if(!e||!("Elevation"in e&&"value"in e.Elevation))return 0;const[,s]=await d.getCoordinates();return e.Elevation.value+s};v.init();const c=p.create(()=>m`
    <bim-panel active label="Grids Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown @change=${async({target:e})=>{const[s]=e.value;if(!s)return;const o=await B(s);l.three.position.y=o}} placeholder="Select a grid level">
          ${b.map(e=>"Name"in e&&"value"in e.Name?m`<bim-option label=${e.Name.value}></bim-option>`:null)}
        </bim-dropdown>
        <bim-checkbox label="Grid visible" checked 
          @change="${({target:e})=>{l.config.visible=e.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Grid Color" color="#bbbbbb" 
          @input="${({target:e})=>{l.config.color=new g(e.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid primary size" value="1" min="0" max="10"
          @change="${({target:e})=>{l.config.primarySize=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid secondary size" value="10" min="0" max="20"
          @change="${({target:e})=>{l.config.secondarySize=e.value}}">
        </bim-number-input>
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(c);const F=p.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());
