import{B as b,M as m,a as p,C as d}from"./web-ifc-api-r1ed24cU.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{T as h,L as s,m as c}from"./index-ByMLC5eT.js";import{C as g,W as f,S as k,d as w,a as y,R as C,e as v}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),t=new g,M=t.get(f),e=M.create();e.scene=new k(t);e.renderer=new w(t,r);e.camera=new y(t);t.init();e.camera.controls.setLookAt(10,10,10,0,0,0);e.scene.setup();e.scene.three.background=null;const x=new b(3,3,3),S=new m({color:"#6528D7"}),a=new p(x,S);a.position.set(0,1.5,0);e.scene.three.add(a);e.meshes.add(a);const $=t.get(C);$.get(e);const o=t.get(v);o.enabled=!0;r.ondblclick=()=>{o.enabled&&o.create(e)};window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&o.enabled&&o.delete(e)};const l=new u;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>l.begin());e.renderer.onAfterUpdate.add(()=>l.end());h.init();const i=s.create(()=>c`
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
          @input="${({target:n})=>{o.config.color=new d(n.color)}}">
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
    `);document.body.append(i);const P=s.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(P);
