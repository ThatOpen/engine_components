import{B as r,b as m,M as p}from"./web-ifc-api-z0lP7pyY.js";import{S as d}from"./stats.min-GTpOrGrX.js";import{p as u,a as s,m as c}from"./index-DyM33b1I.js";import{p as h,C as k,i as g,n as w,k as y,H as v,A as M}from"./index-CDtayhLQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";const b=document.getElementById("container"),a=new h,x=a.get(k),e=x.create();e.scene=new g(a);e.renderer=new w(a,b);e.camera=new y(a);a.init();e.camera.controls.setLookAt(10,10,10,0,0,0);e.scene.setup();e.scene.three.background=null;const f=new r(3,3,3),$=new m({color:"#6528D7"}),l=new p(f,$);l.position.set(0,1.5,0);e.scene.three.add(l);e.meshes.add(l);const C=a.get(v);C.get(e);const t=a.get(M);t.enabled=!0;b.ondblclick=()=>t.create(e);window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&t.delete(e)};const o=new d;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());u.init();const i=s.create(()=>c`
    <bim-panel label="Clipper Tutorial" class="options-menu">
          <bim-panel-section collapsed label="Commands">
      
        <bim-label label="Double click: Create clipping plane"></bim-label>
        <bim-label label="Delete key: Delete clipping plane"></bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section collapsed label="Others"">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({target:n})=>{t.enabled=n.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({target:n})=>{t.visible=n.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:n})=>{t.material.color.set(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({target:n})=>{t.material.opacity=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({target:n})=>{t.size=n.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${()=>{t.deleteAll()}}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cube" 
          @click="${()=>{l.rotation.x=2*Math.PI*Math.random(),l.rotation.y=2*Math.PI*Math.random(),l.rotation.z=2*Math.PI*Math.random()}}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const P=s.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);
