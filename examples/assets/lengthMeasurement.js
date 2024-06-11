import{B as b,M as m,a as d}from"./web-ifc-api-C62xsSvk.js";import{S as p}from"./stats.min-BpIepu9J.js";import{p as u,C as h,i as k,k as w,u as g}from"./index-f5QEetul.js";import{p as f,J as l,m as c}from"./index-K5IA6oiZ.js";import{x as D,U as x}from"./index-dz1kMuu_.js";const r=document.getElementById("container"),t=new u,y=t.get(h),e=y.create();e.scene=new k(t);e.renderer=new D(t,r);e.camera=new w(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const v=t.get(g);v.create(e);e.scene.three.background=null;const M=new b(3,3,3),$=new m({color:"#6528D7"}),a=new d(M,$);a.position.set(0,1.5,0);e.scene.three.add(a);e.meshes.add(a);const n=t.get(x);n.world=e;n.enabled=!0;n.snapDistance=1;r.ondblclick=()=>n.create();window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&n.delete()};const s=new p;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());f.init();const i=l.create(()=>c`
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
    `);document.body.append(i);const B=l.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);
