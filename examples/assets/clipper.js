import{l as d,c as r,C as u,a as b,b as g}from"./index-BET5fVdQ.js";import{C as f,W as h,S as w,a as k,O as C,F as y,R as v,i as x}from"./index-B31d80Z1.js";const a=new f,L=a.get(h),t=L.create();t.scene=new w(a);t.scene.setup();t.scene.three.background=null;const p=document.getElementById("container");t.renderer=new k(a,p);t.camera=new C(a);await t.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const S="https://thatopen.github.io/engine_fragment/resources/worker.mjs",U=await fetch(S),$=await U.blob(),O=new File([$],"worker.mjs",{type:"text/javascript"}),P=URL.createObjectURL(O),o=a.get(y);o.init(P);t.camera.controls.addEventListener("update",()=>o.core.update());t.onCameraChanged.add(e=>{for(const[,i]of o.list)i.useCamera(e.three);o.core.update(!0)});o.list.onItemSet.add(({value:e})=>{e.useCamera(t.camera.three),t.scene.three.add(e.object),o.core.update(!0)});o.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const j=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(j.map(async e=>{var c;const i=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!i)return null;const m=await(await fetch(e)).arrayBuffer();return o.core.load(m,{modelId:i})}));const B=a.get(v);B.get(t);const n=a.get(x);n.enabled=!0;p.ondblclick=()=>{n.enabled&&n.create(t)};const D=()=>{for(const[,e]of n.list)e.enabled=!e.enabled};window.onkeydown=e=>{(e.code==="Delete"||e.code==="Backspace")&&n.enabled&&n.delete(t)};d.init();const s=r.create(()=>b`
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
          @click=${D}>  
        </bim-button>       
        
        <bim-button 
          label="Delete All" 
          @click="${()=>{n.deleteAll()}}">  
        </bim-button>       
        
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(s);const F=r.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);const l=new g;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());
