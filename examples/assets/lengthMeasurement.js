import{B as m,M as b,a as d}from"./web-ifc-api-r1ed24cU.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{C as u,W as h,S as w,a as k,G as g}from"./index-4oEgnBmA.js";import{T as f,L as a,m as c}from"./index-ByMLC5eT.js";import{W as D,i as y}from"./index-CDKMALq_.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),t=new u,v=t.get(h),e=v.create();e.scene=new w(t);e.renderer=new D(t,r);e.camera=new k(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const x=t.get(g);x.create(e);e.scene.three.background=null;const L=new m(3,3,3),S=new b({color:"#6528D7"}),i=new d(L,S);i.position.set(0,1.5,0);e.scene.three.add(i);e.meshes.add(i);const n=t.get(y);n.world=e;n.enabled=!0;n.snapDistance=1;r.ondblclick=()=>n.create();window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&n.delete()};const s=new p;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());f.init();const l=a.create(()=>c`
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
    `);document.body.append(l);const C=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);
