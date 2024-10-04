import{B as r,M as m,a as d,C as p}from"./web-ifc-api-Dlf_dxms.js";import{S as u}from"./stats.min-bmkVNhZk.js";import{T as h,z as s,m as c}from"./index-DtbylpTq.js";import{p as g,A as f,e as k,m as w,v,o as y,S as M}from"./index-6e07lNWw.js";const b=document.getElementById("container"),t=new g,x=t.get(f),e=x.create();e.scene=new k(t);e.renderer=new w(t,b);e.camera=new v(t);t.init();e.camera.controls.setLookAt(10,10,10,0,0,0);e.scene.setup();e.scene.three.background=null;const C=new r(3,3,3),$=new m({color:"#6528D7"}),a=new d(C,$);a.position.set(0,1.5,0);e.scene.three.add(a);e.meshes.add(a);const P=t.get(y);P.get(e);const o=t.get(M);o.enabled=!0;b.ondblclick=()=>{o.enabled&&o.create(e)};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&o.enabled&&o.delete(e)};const l=new u;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>l.begin());e.renderer.onAfterUpdate.add(()=>l.end());h.init();const i=s.create(()=>c`
    <bim-panel label="Clipper Tutorial" class="options-menu">
          <bim-panel-section collapsed label="Commands">
      
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section collapsed label="Others"">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({target:n})=>{o.config.enabled=n.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({target:n})=>{o.config.visible=n.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:n})=>{o.config.color=new p(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({target:n})=>{o.config.opacity=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({target:n})=>{o.config.size=n.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${()=>{o.deleteAll()}}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cube" 
          @click="${()=>{a.rotation.x=2*Math.PI*Math.random(),a.rotation.y=2*Math.PI*Math.random(),a.rotation.z=2*Math.PI*Math.random()}}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const z=s.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
