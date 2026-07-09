import{p as g,m as p,a as d,C as v,b as h}from"./index-r1u2qk8S.js";import{C as w,W as y,S as C,a as S,O as G,F as b}from"./index-Dx2GLmSS.js";import{G as I}from"./index-39aW9CcY.js";const i=new w,L=i.get(y),t=L.create();t.scene=new C(i);t.scene.setup();t.scene.three.background=null;const k=document.getElementById("container");t.renderer=new S(i,k);t.camera=new G(i);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);i.init();const O=await b.getWorker(),o=i.get(b);o.init(O);t.camera.controls.addEventListener("update",()=>o.core.update());t.onCameraChanged.add(n=>{for(const[,e]of o.list)e.useCamera(n.three);o.core.update(!0)});o.list.onItemSet.add(({value:n})=>{n.useCamera(t.camera.three),t.scene.three.add(n.object),o.core.update(!0)});o.core.models.materials.list.onItemSet.add(({value:n})=>{"isLodMaterial"in n&&n.isLodMaterial||(n.polygonOffset=!0,n.polygonOffsetUnits=1,n.polygonOffsetFactor=Math.random())});const $=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"],[m]=await Promise.all($.map(async n=>{var u;const e=(u=n.split("/").pop())==null?void 0:u.split(".").shift();if(!e)return null;const a=await(await fetch(n)).arrayBuffer();return o.core.load(a,{modelId:e})})),E=i.get(I),l=E.create(t),N=await m.getItemsOfCategories([/BUILDINGSTOREY/]),x=Object.values(N).flat(),f=await m.getItemsData(x),z=async n=>{const e=f.find(a=>"Name"in a&&"value"in a.Name?a.Name.value===n:!1);if(!e||!("Elevation"in e&&"value"in e.Elevation))return 0;const[,s]=await m.getCoordinates();return e.Elevation.value+s};g.init();const c=p.create(()=>d`
    <bim-panel active label="Grids Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown @change=${async({target:e})=>{const[s]=e.value;if(!s)return;const a=await z(s);l.three.position.y=a}} placeholder="Select a grid level">
          ${f.map(e=>"Name"in e&&"value"in e.Name?d`<bim-option label=${e.Name.value}></bim-option>`:null)}
        </bim-dropdown>
        <bim-checkbox label="Grid visible" checked 
          @change="${({target:e})=>{l.config.visible=e.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Grid Color" color="#bbbbbb" 
          @input="${({target:e})=>{l.config.color=new v(e.color)}}">
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
  `);document.body.append(c);const U=p.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);const r=new h;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>r.begin());t.renderer.onAfterUpdate.add(()=>r.end());
