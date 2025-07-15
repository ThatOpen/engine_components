import{a as p}from"./index-D7EC26VF.js";import{a as b,R as m,m as d}from"./index-bERBRksd.js";import{C as u,W as h,S as f,a as g,O as w,F as v}from"./index-Bv9-N0Ab.js";import{G as k}from"./index-l9Fj5h2Z.js";const n=new u,P=n.get(h),e=P.create();e.scene=new f(n);e.scene.setup();e.scene.three.background=null;const F=document.getElementById("container");e.renderer=new g(n,F);e.camera=new w(n);await e.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);n.init();const j=n.get(k).create(e),O="https://thatopen.github.io/engine_fragment/resources/worker.mjs",y=await fetch(O),C=await y.blob(),U=new File([C],"worker.mjs",{type:"text/javascript"}),I=URL.createObjectURL(U),r=n.get(v);r.init(I);e.camera.controls.addEventListener("rest",()=>r.core.update(!0));e.onCameraChanged.add(t=>{for(const[,o]of r.list)o.useCamera(t.three);r.core.update(!0)});r.list.onItemSet.add(({value:t})=>{t.useCamera(e.camera.three),e.scene.three.add(t.object),r.core.update(!0)});const L=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(L.map(async t=>{var l;const o=(l=t.split("/").pop())==null?void 0:l.split(".").shift();if(!o)return null;const s=await(await fetch(t)).arrayBuffer();return r.core.load(s,{modelId:o})}));e.camera.projection.onChanged.add(()=>{const t=e.camera.projection.current;j.fade=t==="Perspective"});b.init();const c=m.create(()=>d`
    <bim-panel active label="OrthoPerspectiveCamera Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown required label="Navigation Mode" 
            @change="${({target:t})=>{const o=t.value[0],{current:i}=e.camera.projection;if(i==="Orthographic"&&o==="FirstPerson"){alert("First person is not compatible with ortho!"),t.value[0]=e.camera.mode.id;return}e.camera.set(o)}}">

          <bim-option checked label="Orbit"></bim-option>
          <bim-option label="FirstPerson"></bim-option>
          <bim-option label="Plan"></bim-option>
        </bim-dropdown>
          
      
        <bim-dropdown required label="Projection" 
            @change="${({target:t})=>{const o=t.value[0],i=o==="Orthographic",s=e.camera.mode.id==="FirstPerson";if(i&&s){alert("First person is not compatible with ortho!"),t.value[0]=e.camera.projection.current;return}e.camera.projection.set(o)}}">
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
  `);document.body.append(c);const S=m.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);const a=new p;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());
