import{a as p,R as m,m as d,b}from"./index-CZukAoYd.js";import{C as u,W as h,S as g,a as f,O as w,F as v}from"./index-C2IU-BFV.js";import{G as P}from"./index-C79suBt5.js";const r=new u,k=r.get(h),e=k.create();e.scene=new g(r);e.scene.setup();e.scene.three.background=null;const F=document.getElementById("container");e.renderer=new f(r,F);e.camera=new w(r);await e.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);r.init();const O=r.get(P).create(e),j="https://thatopen.github.io/engine_fragment/resources/worker.mjs",n=r.get(v);n.init(j);e.camera.controls.addEventListener("rest",()=>n.core.update(!0));e.onCameraChanged.add(t=>{for(const[,o]of n.list)o.useCamera(t.three);n.core.update(!0)});n.list.onItemSet.add(({value:t})=>{t.useCamera(e.camera.three),e.scene.three.add(t.object),n.core.update(!0)});const C=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(C.map(async t=>{var l;const o=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!o)return null;const i=await(await fetch(t)).arrayBuffer();return n.core.load(i,{modelId:o})}));e.camera.projection.onChanged.add(()=>{const t=e.camera.projection.current;O.fade=t==="Perspective"});p.init();const c=m.create(()=>d`
    <bim-panel active label="OrthoPerspectiveCamera Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown required label="Navigation Mode" 
            @change="${({target:t})=>{const o=t.value[0],{current:s}=e.camera.projection;if(s==="Orthographic"&&o==="FirstPerson"){alert("First person is not compatible with ortho!"),t.value[0]=e.camera.mode.id;return}e.camera.set(o)}}">

          <bim-option checked label="Orbit"></bim-option>
          <bim-option label="FirstPerson"></bim-option>
          <bim-option label="Plan"></bim-option>
        </bim-dropdown>
          
      
        <bim-dropdown required label="Projection" 
            @change="${({target:t})=>{const o=t.value[0],s=o==="Orthographic",i=e.camera.mode.id==="FirstPerson";if(s&&i){alert("First person is not compatible with ortho!"),t.value[0]=e.camera.projection.current;return}e.camera.projection.set(o)}}">
          <bim-option checked label="Perspective"></bim-option>
          <bim-option label="Orthographic"></bim-option>
        </bim-dropdown>

        <bim-checkbox 
          label="Allow User Input" checked 
          @change="${({target:t})=>{e.camera.setUserInput(t.checked)}}">  
        </bim-checkbox>  
        
        <bim-button 
          label="Fit Model" 
          @click=${()=>e.camera.fitToItems()}>
        </bim-button>
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(c);const y=m.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(y);const a=new b;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());
