import{B as r,M as m,a as d}from"./web-ifc-api-CfQNUy7g.js";import{S as p}from"./stats.min-BpIepu9J.js";import{m as u,t as s,a as c}from"./index-tywNknxv.js";import{p as h,C as g,i as k,n as w,W as y,H as f,R as v}from"./index-D2xchnNe.js";const b=document.getElementById("container"),a=new h,M=a.get(g),e=M.create();e.scene=new k(a);e.renderer=new w(a,b);e.camera=new y(a);a.init();e.camera.controls.setLookAt(10,10,10,0,0,0);e.scene.setup();e.scene.three.background=null;const x=new r(3,3,3),C=new m({color:"#6528D7"}),l=new d(x,C);l.position.set(0,1.5,0);e.scene.three.add(l);e.meshes.add(l);const $=a.get(f);$.get(e);const t=a.get(v);t.enabled=!0;b.ondblclick=()=>{t.enabled&&t.create(e)};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&t.enabled&&t.delete(e)};const o=new p;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());u.init();const i=s.create(()=>c`
    <bim-panel label="Clipper Tutorial" class="options-menu">
          <bim-panel-section collapsed label="Commands">
      
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
       
        
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
