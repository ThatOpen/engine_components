import"./web-ifc-api-CuDRTh9k.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{C as d,W as b,S as p,a as u,G as h}from"./index-MG2l5tzA.js";import{T as w,L as c,m as r}from"./index-C8nqhRYO.js";import{W as k,B as g,M as f,a as y,w as v}from"./index-CeXOB-rx.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l=document.getElementById("container"),t=new d,x=t.get(b),e=x.create();e.scene=new p(t);e.renderer=new k(t,l);e.camera=new u(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const A=t.get(h);A.create(e);e.scene.three.background=null;const C=new g(3,3,3),D=new f({color:"#6528D7"}),i=new y(C,D);i.position.set(0,1.5,0);e.scene.three.add(i);e.meshes.add(i);const n=t.get(v);n.world=e;n.enabled=!0;l.ondblclick=()=>n.create();l.oncontextmenu=()=>n.endCreation();window.onkeydown=o=>{(o.code==="Delete"||o.code==="Backspace")&&n.deleteAll()};const a=new m;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());w.init();const s=c.create(()=>r`
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
