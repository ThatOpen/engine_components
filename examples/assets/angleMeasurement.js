import{B as d,M as m,a as b}from"./web-ifc-api-BlmMr04K.js";import{C as p,W as u,S as g,a as w,G as h}from"./index-7tDlUpW2.js";import{T as k,L as c,m as i}from"./index-C8nqhRYO.js";import{W as f,v as y}from"./index-JIMkY7x4.js";import{S as v}from"./stats.min-GTpOrGrX.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),n=new p,S=n.get(u),e=S.create();e.scene=new g(n);e.renderer=new f(n,r);e.camera=new w(n);n.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const D=n.get(h);D.create(e);e.scene.three.background=null;const L=new d(3,3,3),M=new m({color:"#6528D7"}),l=new b(L,M);l.position.set(0,1.5,0);e.scene.three.add(l);e.meshes.add(l);const t=n.get(y);t.world=e;t.enabled=!0;r.ondblclick=()=>t.create();window.onkeydown=a=>{(a.code==="Delete"||a.code==="Backspace")&&t.deleteAll()};const o=new v;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());k.init();const s=c.create(()=>i`
  <bim-panel active label="Angle Measurement Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
          <bim-label>Create angle: Double click</bim-label>  
          <bim-label>Delete angle: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Others">
        <bim-checkbox checked label="angles enabled" 
          @change="${({target:a})=>{t.enabled=a.value}}">  
        </bim-checkbox>       
        
        <bim-button label="Delete all"
          @click="${()=>{t.deleteAll()}}">
        </bim-button>

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const x=c.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(x);
