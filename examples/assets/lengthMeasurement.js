import{B as b,M as d,a as m}from"./web-ifc-api-BXZoUgQp.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{p as u,C as h,O as k,S as w,H as g,u as D,k as f}from"./index-Bt57B43I.js";import{d as y,R as i,m as c}from"./index-CqPyogbW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),t=new u,v=t.get(h),e=v.create();e.scene=new k(t);e.renderer=new w(t,r);e.camera=new g(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const x=t.get(D);x.create(e);e.scene.three.background=null;const M=new b(3,3,3),B=new d({color:"#6528D7"}),a=new m(M,B);a.position.set(0,1.5,0);e.scene.three.add(a);e.meshes.add(a);const n=t.get(f);n.world=e;n.enabled=!0;n.snapDistance=1;r.ondblclick=()=>n.create();window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&n.delete()};const s=new p;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());y.init();const l=i.create(()=>c`
  <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Others">
        <bim-checkbox checked label="Dimensions enabled" 
          @change="${({target:o})=>{n.enabled=o.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Dimensions visible" 
          @change="${({target:o})=>{n.visible=o.value}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Dimensions Color" color="#202932" 
          @input="${({target:o})=>{n.color.set(o.color)}}">
        </bim-color-input>
        
        <bim-button label="Delete all"
          @click="${()=>{n.deleteAll()}}">
        </bim-button>

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(l);const C=i.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);
