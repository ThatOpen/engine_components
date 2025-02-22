import{a as r}from"./web-ifc-api-r1ed24cU.js";import{S as c}from"./stats.min-GTpOrGrX.js";import{C as d,W as m,S as b,a as p,G as f,F as u}from"./index-4oEgnBmA.js";import{T as h,L as w,m as g}from"./index-ByMLC5eT.js";import{W as y,N as S}from"./index-CDKMALq_.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l=document.getElementById("container"),a=new d,k=a.get(m),e=k.create();e.scene=new b(a);e.renderer=new y(a,l);e.camera=new p(a);a.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const L=a.get(f);L.create(e);e.scene.three.background=null;const A=new u(a),C=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),D=await C.arrayBuffer(),x=new Uint8Array(D),i=A.load(x);e.scene.three.add(i);for(const t of i.children)t instanceof r&&e.meshes.add(t);const n=a.get(S);n.world=e;n.enabled=!0;l.ondblclick=()=>n.create();let s;window.addEventListener("keydown",t=>{t.code==="KeyO"?n.delete():t.code==="KeyS"?(s=n.get(),n.deleteAll()):t.code==="KeyL"&&s&&n.set(s)});const o=new c;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());h.init();const P=w.create(()=>g`
  <bim-panel active label="Edge Measurement Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Press O</bim-label> 
          <bim-label>Delete all dimensions: Press S</bim-label> 
          <bim-label>Set/Show saved dimensions: Press L</bim-label>   
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Others">
        <bim-checkbox checked label="Dimensions enabled" 
          @change="${({target:t})=>{n.enabled=t.value}}">  
        </bim-checkbox>       
        
        <bim-button label="Delete all"
          @click="${()=>{n.deleteAll()}}">
        </bim-button>

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(P);
