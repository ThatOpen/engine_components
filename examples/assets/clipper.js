import{B as r,M as m,a as p}from"./web-ifc-api-CwSt8Jc1.js";import{S as d}from"./stats.min-BpIepu9J.js";import{p as u,J as s,m as c}from"./index-K5IA6oiZ.js";import{p as h,C as g,s as k,i as w,H as y,z as v,R as M}from"./index-BVLgAR8-.js";const b=document.getElementById("container"),a=new h,x=a.get(g),e=x.create();e.scene=new k(a);e.renderer=new w(a,b);e.camera=new y(a);a.init();e.camera.controls.setLookAt(10,10,10,0,0,0);e.scene.setup();e.scene.three.background=null;const f=new r(3,3,3),$=new m({color:"#6528D7"}),o=new p(f,$);o.position.set(0,1.5,0);e.scene.three.add(o);e.meshes.add(o);const C=a.get(v);C.get(e);const n=a.get(M);n.enabled=!0;b.ondblclick=()=>n.create(e);window.onkeydown=t=>{(t.code==="Delete"||t.code==="Backspace")&&n.delete(e)};const l=new d;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>l.begin());e.renderer.onAfterUpdate.add(()=>l.end());u.init();const i=s.create(()=>c`
    <bim-panel label="Clipper Tutorial" class="options-menu">
          <bim-panel-section collapsed label="Commands">
      
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section collapsed label="Others"">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({target:t})=>{n.enabled=t.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({target:t})=>{n.visible=t.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:t})=>{n.material.color.set(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({target:t})=>{n.material.opacity=t.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({target:t})=>{n.size=t.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${()=>{n.deleteAll()}}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cube" 
          @click="${()=>{o.rotation.x=2*Math.PI*Math.random(),o.rotation.y=2*Math.PI*Math.random(),o.rotation.z=2*Math.PI*Math.random()}}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const P=s.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);
