import{p as d,m as r,C as u,a as b,b as f}from"./index-BTQc5iy9.js";import{C as g,W as h,S as k,a as w,O as v,F as C,R as y,q as S}from"./index-D0VJ-jrh.js";const a=new g,x=a.get(h),n=x.create();n.scene=new k(a);n.scene.setup();n.scene.three.background=null;const p=document.getElementById("container");n.renderer=new w(a,p);n.camera=new v(a);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);a.init();const L="https://thatopen.github.io/engine_fragment/resources/worker.mjs",P=await fetch(L),$=await P.blob(),U=new File([$],"worker.mjs",{type:"text/javascript"}),O=URL.createObjectURL(U),o=a.get(C);o.init(O);n.camera.controls.addEventListener("update",()=>o.core.update());n.onCameraChanged.add(e=>{for(const[,l]of o.list)l.useCamera(e.three);o.core.update(!0)});o.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),o.core.update(!0)});o.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const j=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(j.map(async e=>{var c;const l=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!l)return null;const m=await(await fetch(e)).arrayBuffer();return o.core.load(m,{modelId:l})}));const z=a.get(y);z.get(n);const t=a.get(S);t.enabled=!0;p.ondblclick=()=>{t.enabled&&t.create(n)};const A=()=>{for(const[,e]of t.list)e.enabled=!e.enabled};window.onkeydown=e=>{(e.code==="Delete"||e.code==="Backspace")&&t.enabled&&t.delete(n)};d.init();const s=r.create(()=>b`
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

        <bim-checkbox label="Auto Scale Planes" checked
          @change="${({target:e})=>{t.autoScalePlanes=e.value;for(const[,l]of t.list)l.autoScale=e.value,e.value||(l.size=t.size)}}">
        </bim-checkbox>

        <bim-button 
          label="Toggle Clippings" 
          @click=${A}>  
        </bim-button>       
        
        <bim-button 
          label="Delete All" 
          @click="${()=>{t.deleteAll()}}">  
        </bim-button>       
        
      </bim-panel-section>
    </bim-panel>
  `);document.body.append(s);const B=r.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());
