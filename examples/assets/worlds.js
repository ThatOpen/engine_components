import{p,m as l,C as b,a as c,b as g}from"./index-S6p3h9tm.js";import{C as f,W as h,S as w,a as y,f as v,F as m}from"./index-obm6UPqW.js";const L=document.getElementById("container"),o=new f,C=o.get(h),n=C.create();n.scene=new w(o);n.renderer=new y(o,L);n.camera=new v(o);o.init();n.scene.setup();n.scene.three.background=null;n.renderer.showLogo=!0;const d=await m.getWorker(),t=o.get(m);t.init(d);t.init(d);n.camera.controls.addEventListener("update",()=>t.core.update());t.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});t.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),t.core.update(!0)});const S=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(S.map(async e=>{var r;const i=(r=e.split("/").pop())==null?void 0:r.split(".").shift();if(!i)return null;const u=await(await fetch(e)).arrayBuffer();return t.core.load(u,{modelId:i})}));await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);await t.core.update(!0);p.init();const s=l.create(()=>c`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:e})=>{n.scene.config.backgroundColor=new b(e.color)}}">
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
    `);document.body.append(s);const k=l.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(k);const a=new g;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>a.begin());n.renderer.onAfterUpdate.add(()=>a.end());
