import{p as u,m as r,C as g,a as b,b as f}from"./index-r1u2qk8S.js";import{C as h,W as k,S as C,a as v,O as w,F as p,R as y,q as S}from"./index-Dx2GLmSS.js";const o=new h,P=o.get(k),n=P.create();n.scene=new C(o);n.scene.setup();n.scene.three.background=null;const m=document.getElementById("container");n.renderer=new v(o,m);n.camera=new w(o);await n.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);o.init();const x=await p.getWorker(),a=o.get(p);a.init(x);n.camera.controls.addEventListener("update",()=>a.core.update());n.onCameraChanged.add(e=>{for(const[,l]of a.list)l.useCamera(e.three);a.core.update(!0)});a.list.onItemSet.add(({value:e})=>{e.useCamera(n.camera.three),n.scene.three.add(e.object),e.getClippingPlanesEvent=()=>Array.from(n.renderer.three.clippingPlanes)||[],a.core.update(!0)});a.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const $=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all($.map(async e=>{var c;const l=(c=e.split("/").pop())==null?void 0:c.split(".").shift();if(!l)return null;const d=await(await fetch(e)).arrayBuffer();return a.core.load(d,{modelId:l})}));const L=o.get(y);L.get(n);const t=o.get(S);t.enabled=!0;m.ondblclick=()=>{t.enabled&&t.create(n)};const A=()=>{for(const[,e]of t.list)e.enabled=!e.enabled};window.onkeydown=e=>{(e.code==="Delete"||e.code==="Backspace")&&t.enabled&&t.delete(n)};u.init();const s=r.create(()=>b`
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
          @input="${({target:e})=>{t.config.color=new g(e.color)}}">
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
  `);document.body.append(s);const O=r.create(()=>b`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(O);const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());
