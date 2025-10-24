import{u as d,V as r,C as u,f as b,a as g}from"./index-BVinSk0X.js";import{C as f,W as h,S as w,a as k,O as C,F as v,R as y,i as x}from"./index-DBG1qVuX.js";const o=new f,$=o.get(h),t=$.create();t.scene=new w(o);t.scene.setup();t.scene.three.background=null;const m=document.getElementById("container");t.renderer=new k(o,m);t.camera=new C(o);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);o.init();const L="https://thatopen.github.io/engine_fragment/resources/worker.mjs",P=await fetch(L),S=await P.blob(),U=new File([S],"worker.mjs",{type:"text/javascript"}),j=URL.createObjectURL(U),a=o.get(v);a.init(j);t.camera.controls.addEventListener("rest",()=>a.core.update(!0));t.onCameraChanged.add(e=>{for(const[,i]of a.list)i.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),a.core.update(!0)});const B=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(B.map(async e=>{var c;const i=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!i)return null;const p=await(await fetch(e)).arrayBuffer();return a.core.load(p,{modelId:i})}));const D=o.get(y);D.get(t);const n=o.get(x);n.enabled=!0;m.ondblclick=()=>{n.enabled&&n.create(t)};const R=()=>{for(const[,e]of n.list)e.enabled=!e.enabled};window.onkeydown=e=>{(e.code==="Delete"||e.code==="Backspace")&&n.enabled&&n.delete(t)};d.init();const s=r.create(()=>b`
    <bim-panel active label="Clipper Tutorial" class="options-menu">
      <bim-panel-section label="Commands">
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Controls">
        <bim-checkbox label="Component Enabled" checked 
          @change="${({target:e})=>{n.config.enabled=e.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper Visible" checked 
          @change="${({target:e})=>{n.config.visible=e.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:e})=>{n.config.color=new u(e.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes Opacity" value="0.2" min="0.1" max="1"
          @change="${({target:e})=>{n.config.opacity=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes Size" value="5" min="2" max="10"
          @change="${({target:e})=>{n.config.size=e.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Toggle Clippings" 
          @click=${R}>  
        </bim-button>       
        
        <bim-button 
          label="Delete All" 
          @click="${()=>{n.deleteAll()}}">  
        </bim-button>       
        
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(s);const A=r.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);const l=new g;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());
