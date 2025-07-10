import{C as u,a as d}from"./index-D7EC26VF.js";import{a as p,R as l,m as c}from"./index-bERBRksd.js";import{C as b,W as g,S as f,a as h,f as w,F as y}from"./index-Bv9-N0Ab.js";const v=document.getElementById("container"),o=new b,C=o.get(g),e=C.create();e.scene=new f(o);e.renderer=new h(o,v);e.camera=new w(o);o.init();e.scene.setup();e.scene.three.background=null;const k="https://thatopen.github.io/engine_fragment/resources/worker.mjs",t=o.get(y);t.init(k);e.camera.controls.addEventListener("rest",()=>t.core.update(!0));t.list.onItemSet.add(({value:n})=>{n.useCamera(e.camera.three),e.scene.three.add(n.object),t.core.update(!0)});const L=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(L.map(async n=>{var i;const r=(i=n.split("/").pop())==null?void 0:i.split(".").shift();if(!r)return null;const m=await(await fetch(n)).arrayBuffer();return t.core.load(m,{modelId:r})}));await e.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);await t.core.update(!0);p.init();const s=l.create(()=>c`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:n})=>{e.scene.config.backgroundColor=new u(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:n})=>{e.scene.config.directionalLight.intensity=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:n})=>{e.scene.config.ambientLight.intensity=n.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const S=l.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);const a=new d;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());
