import{B as m,M as d,a as b}from"./web-ifc-api-BlmMr04K.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{C as u,W as h,S as w,a as k,G as g}from"./index-7tDlUpW2.js";import{T as f,L as c,m as r}from"./index-C8nqhRYO.js";import{W as y,w as v}from"./index-JIMkY7x4.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l=document.getElementById("container"),t=new u,x=t.get(h),e=x.create();e.scene=new w(t);e.renderer=new y(t,l);e.camera=new k(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const A=t.get(g);A.create(e);e.scene.three.background=null;const C=new m(3,3,3),D=new d({color:"#6528D7"}),i=new b(C,D);i.position.set(0,1.5,0);e.scene.three.add(i);e.meshes.add(i);const n=t.get(v);n.world=e;n.enabled=!0;l.ondblclick=()=>n.create();l.oncontextmenu=()=>n.endCreation();window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&n.deleteAll()};const a=new p;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());f.init();const s=c.create(()=>r`
  <bim-panel active label="Area Measurement Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
          <bim-label>Create area dimension: Double click</bim-label>  
          <bim-label>Calculate selected area: Right click</bim-label>  
          <bim-label>Delete  dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Others">
        <bim-checkbox checked label="Area dimensions enabled" 
          @change="${({target:o})=>{n.enabled=o.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Area dimensions visible" 
          @change="${({target:o})=>{n.visible=o.value}}">  
        </bim-checkbox>  
        
        <bim-button label="Delete all"
          @click="${()=>{n.deleteAll()}}">
        </bim-button>

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const S=c.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);
