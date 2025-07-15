import{C as u,a as d}from"./index-D7EC26VF.js";import{a as p,R as c,m as l}from"./index-bERBRksd.js";import{C as b,W as g,S as f,a as h,f as w,F as y}from"./index-Bv9-N0Ab.js";const v=document.getElementById("container"),o=new b,k=o.get(g),e=k.create();e.scene=new f(o);e.renderer=new h(o,v);e.camera=new w(o);o.init();e.scene.setup();e.scene.three.background=null;const C="https://thatopen.github.io/engine_fragment/resources/worker.mjs",L=await fetch(C),S=await L.blob(),U=new File([S],"worker.mjs",{type:"text/javascript"}),j=URL.createObjectURL(U),n=o.get(y);n.init(j);e.camera.controls.addEventListener("rest",()=>n.core.update(!0));n.list.onItemSet.add(({value:t})=>{t.useCamera(e.camera.three),e.scene.three.add(t.object),n.core.update(!0)});const x=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(x.map(async t=>{var i;const s=(i=t.split("/").pop())==null?void 0:i.split(".").shift();if(!s)return null;const m=await(await fetch(t)).arrayBuffer();return n.core.load(m,{modelId:s})}));await e.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);await n.core.update(!0);p.init();const r=c.create(()=>l`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:t})=>{e.scene.config.backgroundColor=new u(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:t})=>{e.scene.config.directionalLight.intensity=t.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:t})=>{e.scene.config.ambientLight.intensity=t.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const B=c.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);const a=new d;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());
