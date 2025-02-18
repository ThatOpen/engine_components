import"./web-ifc-api-r1ed24cU.js";import{S as l}from"./stats.min-GTpOrGrX.js";import{T as b,L as c,m as r}from"./index-ByMLC5eT.js";import{C as d,W as p,S as u,d as f,a as g,G as h,F as v,s as x}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),o=new d,w=o.get(p),t=w.create();t.scene=new u(o);t.renderer=new f(o,k);t.camera=new g(o);t.scene.setup();o.init();const y=o.get(h);y.create(t);t.camera.controls.setLookAt(1,2,-2,-2,0,-5);t.scene.three.background=null;const $=new v(o),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),z=await S.arrayBuffer(),L=new Uint8Array(z),B=$.load(L);t.scene.three.add(B);const C=new x(o),n=C.create(t),E=document.getElementById("minimap"),m=n.renderer.domElement;m.style.borderRadius="12px";E.append(m);n.resize();const a=new l;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());b.init();const s=n.getSize(),i=c.create(()=>r`
    <bim-panel label="Minimap Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({target:e})=>{n.enabled=e.value}}">  
        </bim-checkbox>
        
        <bim-checkbox checked="true" label="Visible" 
          @change="${({target:e})=>{n.config.visible=e.value}}">  
        </bim-checkbox>
        
        <bim-checkbox checked label="Lock rotation" 
          @change="${({target:e})=>{n.config.lockRotation=e.value}}">  
        </bim-checkbox>
        
        <bim-number-input 
          slider label="Zoom" value="${n.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({target:e})=>{n.config.zoom=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider label="Front offset" value="${n.frontOffset}" min="0" max="5" step="1" 
          @change="${({target:e})=>{n.config.frontOffset=e.value}}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${s.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({target:e})=>{n.config.sizeX=e.value}}">
          </bim-number-input>        
        
          <bim-number-input slider value="${s.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({target:e})=>{n.config.sizeY=e.value}}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const M=c.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(M);
