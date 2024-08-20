import{B as M,M as y,a as d,b as c,L as b}from"./web-ifc-api-CgBULNZm.js";import{S as f}from"./stats.min-GTpOrGrX.js";import{d as k,R as m,m as p}from"./index-CqPyogbW.js";import{o as x,a as v,L,N as P,l as $,K as B,d as I}from"./index-Cbq44wZW.js";import{$ as C,K as D,c as z}from"./index-DconH7kp.js";import"./_commonjsHelpers-Cpj98o6Y.js";const u=document.getElementById("container"),o=new x,E=o.get(v),e=E.create();e.scene=new L(o);e.renderer=new C(o,u);e.camera=new P(o);e.renderer.postproduction.enabled=!0;e.renderer.postproduction.customEffects.outlineEnabled=!0;o.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const h=o.get($);h.config.color.setHex(6710886);const S=h.create(e);e.renderer.postproduction.customEffects.excludedMeshes.push(S.three);e.scene.three.background=null;const g=new M(3,3,3),w=new y({color:"#6528D7"}),a=new d(g,w);a.position.set(-2,1.5,0);e.scene.three.add(a);e.meshes.add(a);const l=new d(g,w);l.position.set(2,1.5,0);e.scene.three.add(l);e.meshes.add(l);const K=o.get(B);K.get(e);const n=o.get(I);n.enabled=!0;const r=o.get(D);n.Type=z;const R=new c({color:"lightblue",side:2}),A=new b({color:"blue"}),O=new c({color:"blue",opacity:.5,side:2,transparent:!0});r.styles.create("Red lines",new Set([a]),e,A,R,O);const F=new c({color:"salmon",side:2}),G=new b({color:"red"}),N=new c({color:"red",opacity:.5,side:2,transparent:!0});r.styles.create("Blue lines",new Set([l]),e,G,F,N);u.ondblclick=()=>{n.enabled&&n.create(e)};window.onkeydown=t=>{(t.code==="Delete"||t.code==="Backspace")&&n.enabled&&n.delete(e)};const s=new f;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());k.init();const i=m.create(()=>p`
  <bim-panel active label="Edges Clipper Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section collapsed label="Others">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({target:t})=>{n.enabled=t.value,r.visible=t.value}}">
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
          label="Rotate cubes" 
          @click="${()=>{a.rotation.x=2*Math.PI*Math.random(),a.rotation.y=2*Math.PI*Math.random(),a.rotation.z=2*Math.PI*Math.random(),a.updateMatrixWorld(),l.rotation.x=2*Math.PI*Math.random(),l.rotation.y=2*Math.PI*Math.random(),l.rotation.z=2*Math.PI*Math.random(),l.updateMatrixWorld(),r.update(!0)}}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const T=m.create(()=>p`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
