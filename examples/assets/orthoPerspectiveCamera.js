import{p as b,m as d,a as m,b as u}from"./index-S6p3h9tm.js";import{C as h,W as f,S as g,a as w,O as v,F as p}from"./index-CwaFiFbj.js";import{G as P}from"./index-DZWeVj07.js";const r=new h,O=r.get(f),t=O.create();t.scene=new g(r);t.scene.setup();t.scene.three.background=null;const k=document.getElementById("container");t.renderer=new w(r,k);t.camera=new v(r);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const F=r.get(P).create(t),y=await p.getWorker(),n=r.get(p);n.init(y);t.camera.controls.addEventListener("update",()=>n.core.update());t.onCameraChanged.add(e=>{for(const[,o]of n.list)o.useCamera(e.three);n.core.update(!0)});n.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),n.core.update(!0)});n.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const C=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(C.map(async e=>{var l;const o=(l=e.split("/").pop())==null?void 0:l.split(".").shift();if(!o)return null;const i=await(await fetch(e)).arrayBuffer();return n.core.load(i,{modelId:o})}));t.camera.projection.onChanged.add(()=>{const e=t.camera.projection.current;F.fade=e==="Perspective"});b.init();const c=d.create(()=>m`
    <bim-panel active label="OrthoPerspectiveCamera Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown required label="Navigation Mode" 
            @change="${({target:e})=>{const o=e.value[0],{current:s}=t.camera.projection;if(s==="Orthographic"&&o==="FirstPerson"){alert("First person is not compatible with ortho!"),e.value[0]=t.camera.mode.id;return}t.camera.set(o)}}">

          <bim-option checked label="Orbit"></bim-option>
          <bim-option label="FirstPerson"></bim-option>
          <bim-option label="Plan"></bim-option>
        </bim-dropdown>
          
      
        <bim-dropdown required label="Projection" 
            @change="${({target:e})=>{const o=e.value[0],s=o==="Orthographic",i=t.camera.mode.id==="FirstPerson";if(s&&i){alert("First person is not compatible with ortho!"),e.value[0]=t.camera.projection.current;return}t.camera.projection.set(o)}}">
          <bim-option checked label="Perspective"></bim-option>
          <bim-option label="Orthographic"></bim-option>
        </bim-dropdown>

        <bim-checkbox 
          label="Allow User Input" checked 
          @change="${({target:e})=>{t.camera.setUserInput(e.checked)}}">  
        </bim-checkbox>  
        
        <bim-button 
          label="Fit Model" 
          @click=${()=>t.camera.fitToItems()}>
        </bim-button>
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(c);const S=d.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);const a=new u;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());
