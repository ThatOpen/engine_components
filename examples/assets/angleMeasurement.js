import{B as d,M as m,a as b}from"./web-ifc-api-r1ed24cU.js";import{C as p,W as u,S as w,a as g,G as h}from"./index-4oEgnBmA.js";import{T as k,L as c,m as i}from"./index-ByMLC5eT.js";import{W as f,w as y}from"./index-CDKMALq_.js";import{S}from"./stats.min-GTpOrGrX.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),n=new p,D=n.get(u),e=D.create();e.scene=new w(n);e.renderer=new f(n,r);e.camera=new g(n);n.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const L=n.get(h);L.create(e);e.scene.three.background=null;const M=new d(3,3,3),v=new m({color:"#6528D7"}),l=new b(M,v);l.position.set(0,1.5,0);e.scene.three.add(l);e.meshes.add(l);const t=n.get(y);t.world=e;t.enabled=!0;r.ondblclick=()=>t.create();window.onkeydown=a=>{(a.code==="Delete"||a.code==="Backspace")&&t.deleteAll()};const o=new S;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());k.init();const s=c.create(()=>i`
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
