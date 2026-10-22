import{K as f,n as u,b as d,C as g,S as v}from"./TransformControls-lNp9RmyE.js";import{C as h,W as w,S as y,a as C,O as S,F as p}from"./index-CVHtJqZ2.js";import{G}from"./index-CEOHm9PK.js";const i=new h,I=i.get(w),t=I.create();t.scene=new y(i);t.scene.setup();t.scene.three.background=null;const L=document.getElementById("container");t.renderer=new C(i,L);t.camera=new S(i);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);i.init();const k=await p.getWorker(),o=i.get(p);o.init(k);t.camera.controls.addEventListener("update",()=>o.core.update());t.onCameraChanged.add(n=>{for(const[,e]of o.list)e.useCamera(n.three);o.core.update(!0)});o.list.onItemSet.add(({value:n})=>{n.useCamera(t.camera.three),t.scene.three.add(n.object),o.core.update(!0)});o.core.models.materials.list.onItemSet.add(({value:n})=>{"isLodMaterial"in n&&n.isLodMaterial||(n.polygonOffset=!0,n.polygonOffsetUnits=1,n.polygonOffsetFactor=Math.random())});const O=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"],[m]=await Promise.all(O.map(async n=>{const e=n.split("/").pop()?.split(".").shift();if(!e)return null;const a=await(await fetch(n)).arrayBuffer();return o.core.load(a,{modelId:e})})),$=i.get(G),l=$.create(t),E=await m.getItemsOfCategories([/BUILDINGSTOREY/]),N=Object.values(E).flat(),b=await m.getItemsData(N),x=async n=>{const e=b.find(a=>"Name"in a&&"value"in a.Name?a.Name.value===n:!1);if(!e||!("Elevation"in e&&"value"in e.Elevation))return 0;const[,s]=await m.getCoordinates();return e.Elevation.value+s};f.init();const c=u.create(()=>d`
    <bim-panel active label="Grids Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown @change=${async({target:e})=>{const[s]=e.value;if(!s)return;const a=await x(s);l.three.position.y=a}} placeholder="Select a grid level">
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
  `);document.body.append(c);const z=u.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);const r=new v;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>r.begin());t.renderer.onAfterUpdate.add(()=>r.end());
