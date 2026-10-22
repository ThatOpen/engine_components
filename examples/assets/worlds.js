import{K as u,n as r,C as p,b as l,S as b}from"./TransformControls-uP1Cexzu.js";import{C as g,W as f,S as h,a as w,e as y,F as c}from"./index-CmPoL2JM.js";const v=document.getElementById("container"),o=new g,L=o.get(f),n=L.create();n.scene=new h(o);n.renderer=new w(o,v);n.camera=new y(o);o.init();n.scene.setup();n.scene.three.background=null;n.renderer.showLogo=!0;const d=await c.getWorker(),t=o.get(c);t.init(d);t.init(d);n.camera.controls.addEventListener("update",()=>t.core.update());t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});t.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),t.core.update(!0)});const C=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(C.map(async e=>{const i=e.split("/").pop()?.split(".").shift();if(!i)return null;const m=await(await fetch(e)).arrayBuffer();return t.core.load(m,{modelId:i})}));await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);await t.core.update(!0);u.init();const a=r.create(()=>l`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:e})=>{n.scene.config.backgroundColor=new p(e.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:e})=>{n.scene.config.directionalLight.intensity=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:e})=>{n.scene.config.ambientLight.intensity=e.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(a);const S=r.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);const s=new b;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>s.begin());n.renderer.onAfterUpdate.add(()=>s.end());
