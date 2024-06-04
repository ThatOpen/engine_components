import"./web-ifc-api-D3oDn2HF.js";import{S as p}from"./stats.min-DDrWCSVO.js";import{p as d,J as m,m as c}from"./index-K5IA6oiZ.js";import{a as b,W as u,S as f,c as g,b as h,G as v,F as x,o as y}from"./index-DPB0U-mi.js";const z=document.getElementById("container"),a=new b,w=a.get(u),t=w.create();t.scene=new f(a);t.renderer=new g(a,z);t.camera=new h(a);t.scene.setup();a.init();const S=a.get(v);S.create(t);t.camera.controls.setLookAt(1,2,-2,-2,0,-5);t.scene.three.background=null;const k=new x(a),$=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),B=await $.arrayBuffer(),L=new Uint8Array(B),C=k.load(L);t.scene.three.add(C);const E=new y(a),e=E.create(t),M=document.getElementById("minimap"),l=e.renderer.domElement;l.style.borderRadius="12px";M.append(l);e.resize();const o=new p;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>o.begin());t.renderer.onAfterUpdate.add(()=>o.end());d.init();const r=e.getSize(),i=m.create(()=>c`
    <bim-panel label="Minimap Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({target:n})=>{e.enabled=n.value}}">  
        </bim-checkbox>
        
        <bim-checkbox checked label="Lock rotation" 
          @change="${({target:n})=>{e.lockRotation=n.value}}">  
        </bim-checkbox>
        
        <bim-number-input 
          slider label="Zoom" value="${e.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({target:n})=>{e.zoom=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider label="Front offset" value="${e.frontOffset}" min="0" max="5" step="1" 
          @change="${({target:n})=>{e.frontOffset=n.value}}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${r.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({target:n})=>{const s=e.getSize();s.x=n.value,e.resize(s)}}">
          </bim-number-input>        
        
          <bim-number-input slider value="${r.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({target:n})=>{const s=e.getSize();s.y=n.value,e.resize(s)}}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const A=m.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);
