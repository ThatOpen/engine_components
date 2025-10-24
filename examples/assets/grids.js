import{u as g,V as p,f as m,C as f,a as v}from"./index-BVinSk0X.js";import{C as h,W as w,S as y,a as C,O as S,F as G}from"./index-DBG1qVuX.js";import{G as I}from"./index-C6-W7G3U.js";const r=new h,k=r.get(w),n=k.create();n.scene=new y(r);n.scene.setup();n.scene.three.background=null;const L=document.getElementById("container");n.renderer=new C(r,L);n.camera=new S(r);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const $="https://thatopen.github.io/engine_fragment/resources/worker.mjs",a=r.get(G);a.init($);n.camera.controls.addEventListener("rest",()=>a.core.update(!0));n.onCameraChanged.add(t=>{for(const[,e]of a.list)e.useCamera(t.three);a.core.update(!0)});a.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),a.core.update(!0)});const E=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"],[d]=await Promise.all(E.map(async t=>{var u;const e=(u=t.split("/").pop())==null?void 0:u.split(".").shift();if(!e)return null;const o=await(await fetch(t)).arrayBuffer();return a.core.load(o,{modelId:e})})),N=r.get(I),l=N.create(n),x=await d.getItemsOfCategories([/BUILDINGSTOREY/]),z=Object.values(x).flat(),b=await d.getItemsData(z),O=async t=>{const e=b.find(o=>"Name"in o&&"value"in o.Name?o.Name.value===t:!1);if(!e||!("Elevation"in e&&"value"in e.Elevation))return 0;const[,s]=await d.getCoordinates();return e.Elevation.value+s};g.init();const c=p.create(()=>m`
    <bim-panel active label="Grids Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown @change=${async({target:e})=>{const[s]=e.value;if(!s)return;const o=await O(s);l.three.position.y=o}} placeholder="Select a grid level">
          ${b.map(e=>"Name"in e&&"value"in e.Name?m`<bim-option label=${e.Name.value}></bim-option>`:null)}
        </bim-dropdown>
        <bim-checkbox label="Grid visible" checked 
          @change="${({target:e})=>{l.config.visible=e.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Grid Color" color="#bbbbbb" 
          @input="${({target:e})=>{l.config.color=new f(e.color)}}">
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
  `);document.body.append(c);const B=p.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);const i=new v;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());
