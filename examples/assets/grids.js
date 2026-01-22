import{l as f,c as p,a as d,C as g,b as v}from"./index-BET5fVdQ.js";import{C as h,W as w,S as y,a as C,O as S,F as L}from"./index-B31d80Z1.js";import{G as k}from"./index-DFO-Vypy.js";const r=new h,G=r.get(w),n=G.create();n.scene=new y(r);n.scene.setup();n.scene.three.background=null;const I=document.getElementById("container");n.renderer=new C(r,I);n.camera=new S(r);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const O="https://thatopen.github.io/engine_fragment/resources/worker.mjs",U=await fetch(O),$=await U.blob(),x=new File([$],"worker.mjs",{type:"text/javascript"}),E=URL.createObjectURL(x),o=r.get(L);o.init(E);n.camera.controls.addEventListener("update",()=>o.core.update());n.onCameraChanged.add(t=>{for(const[,e]of o.list)e.useCamera(t.three);o.core.update(!0)});o.list.onItemSet.add(({value:t})=>{t.useCamera(n.camera.three),n.scene.three.add(t.object),o.core.update(!0)});o.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const N=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"],[m]=await Promise.all(N.map(async t=>{var u;const e=(u=t.split("/").pop())==null?void 0:u.split(".").shift();if(!e)return null;const a=await(await fetch(t)).arrayBuffer();return o.core.load(a,{modelId:e})})),j=r.get(k),l=j.create(n),z=await m.getItemsOfCategories([/BUILDINGSTOREY/]),B=Object.values(z).flat(),b=await m.getItemsData(B),F=async t=>{const e=b.find(a=>"Name"in a&&"value"in a.Name?a.Name.value===t:!1);if(!e||!("Elevation"in e&&"value"in e.Elevation))return 0;const[,s]=await m.getCoordinates();return e.Elevation.value+s};f.init();const c=p.create(()=>d`
    <bim-panel active label="Grids Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown @change=${async({target:e})=>{const[s]=e.value;if(!s)return;const a=await F(s);l.three.position.y=a}} placeholder="Select a grid level">
          ${b.map(e=>"Name"in e&&"value"in e.Name?d`<bim-option label=${e.Name.value}></bim-option>`:null)}
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
  `);document.body.append(c);const M=p.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(M);const i=new v;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());
