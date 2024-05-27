import{C as p}from"./web-ifc-api-BC8YMRiS.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{p as b,a as c,m as l}from"./index-DyM33b1I.js";import{f as d,p as f,s as g,i as h,k as v,N as k,u as x,h as w}from"./index-b4ozRbQy.js";import"./_commonjsHelpers-Cpj98o6Y.js";const y=document.getElementById("container"),o=new d,z=o.get(f),t=z.create();t.scene=new g(o);t.renderer=new h(o,y);t.camera=new v(o);t.scene.setup();o.init();const $=o.get(k);$.create(t);t.camera.controls.setLookAt(1,2,-2,-2,0,-5);t.scene.three.background=null;const S=new x(o),B=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),C=await B.arrayBuffer(),L=new Uint8Array(C),E=S.load(L);t.scene.three.add(E);const A=new w(o),n=A.create(t),I=document.getElementById("minimap"),m=n.renderer.domElement;m.style.borderRadius="12px";I.append(m);n.resize();const a=new u;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());b.init();const r=n.getSize(),i=c.create(()=>l`
    <bim-panel label="Minimap Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({target:e})=>{n.enabled=e.value}}">  
        </bim-checkbox>
        
        <bim-checkbox checked label="Lock rotation" 
          @change="${({target:e})=>{n.lockRotation=e.value}}">  
        </bim-checkbox>
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:e})=>{t.scene.three.background=new p(e.color)}}">
        </bim-color-input>
        
        
        <bim-number-input 
          slider label="Zoom" value="${n.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({target:e})=>{n.zoom=e.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider label="Front offset" value="${n.frontOffset}" min="0" max="5" step="1" 
          @change="${({target:e})=>{n.frontOffset=e.value}}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${r.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({target:e})=>{const s=n.getSize();s.x=e.value,n.resize(s)}}">
          </bim-number-input>        
        
          <bim-number-input slider value="${r.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({target:e})=>{const s=n.getSize();s.y=e.value,n.resize(s)}}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const R=c.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(R);
