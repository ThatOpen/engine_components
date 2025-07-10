import{T as p,L as r,C as u,m as b,a as g}from"./index-BR15nMAM.js";import{C as f,W as h,S as k,a as C,O as w,F as v,R as y,i as x}from"./index-DQoMA9YT.js";const a=new f,$=a.get(h),n=$.create();n.scene=new k(a);n.scene.setup();n.scene.three.background=null;const m=document.getElementById("container");n.renderer=new C(a,m);n.camera=new w(a);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const L="/node_modules/@thatopen/fragments/dist/Worker/worker.mjs",o=a.get(v);o.init(L);n.camera.controls.addEventListener("rest",()=>o.core.update(!0));n.onCameraChanged.add(e=>{for(const[,i]of o.list)i.useCamera(e.three);o.core.update(!0)});o.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),o.core.update(!0)});const P=["/resources/frags/school_arq.frag"];await Promise.all(P.map(async e=>{var c;const i=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!i)return null;const d=await(await fetch(e)).arrayBuffer();return o.core.load(d,{modelId:i})}));const S=a.get(y);S.get(n);const t=a.get(x);t.enabled=!0;m.ondblclick=()=>{t.enabled&&t.create(n)};const D=()=>{for(const[,e]of t.list)e.enabled=!e.enabled};window.onkeydown=e=>{(e.code==="Delete"||e.code==="Backspace")&&t.enabled&&t.delete(n)};p.init();const s=r.create(()=>b`
    <bim-panel active label="Clipper Tutorial" class="options-menu">
      <bim-panel-section label="Commands">
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Controls">
        <bim-checkbox label="Component Enabled" checked 
          @change="${({target:e})=>{t.config.enabled=e.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper Visible" checked 
          @change="${({target:e})=>{t.config.visible=e.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:e})=>{t.config.color=new u(e.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes Opacity" value="0.2" min="0.1" max="1"
          @change="${({target:e})=>{t.config.opacity=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes Size" value="5" min="2" max="10"
          @change="${({target:e})=>{t.config.size=e.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Toggle Clippings" 
          @click=${D}>  
        </bim-button>       
        
        <bim-button 
          label="Delete All" 
          @click="${()=>{t.deleteAll()}}">  
        </bim-button>       
        
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(s);const A=r.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);const l=new g;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>l.begin());n.renderer.onAfterUpdate.add(()=>l.end());
