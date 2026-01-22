import{l as u,c as l,C as p,a as c,b}from"./index-D_lOu8Cy.js";import{C as g,W as f,S as h,a as w,f as y,F as v}from"./index-BXecBxnk.js";const L=document.getElementById("container"),o=new g,k=o.get(f),t=k.create();t.scene=new h(o);t.renderer=new w(o,L);t.camera=new y(o);o.init();t.scene.setup();t.scene.three.background=null;const C="https://thatopen.github.io/engine_fragment/resources/worker.mjs",S=await fetch(C),U=await S.blob(),j=new File([U],"worker.mjs",{type:"text/javascript"}),m=URL.createObjectURL(j),n=o.get(v);n.init(m);n.init(m);t.camera.controls.addEventListener("update",()=>n.core.update());n.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});n.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),n.core.update(!0)});const x=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(x.map(async e=>{var r;const i=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!i)return null;const d=await(await fetch(e)).arrayBuffer();return n.core.load(d,{modelId:i})}));await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);await n.core.update(!0);u.init();const a=l.create(()=>c`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:e})=>{t.scene.config.backgroundColor=new p(e.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:e})=>{t.scene.config.directionalLight.intensity=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:e})=>{t.scene.config.ambientLight.intensity=e.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(a);const B=l.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);const s=new b;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());
