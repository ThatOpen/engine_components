import"./web-ifc-api-CuDRTh9k.js";import{S as r}from"./stats.min-GTpOrGrX.js";import{W as c,a as d,N as m}from"./index-CeXOB-rx.js";import{C as b,W as p,S as f,a as u,G as h,F as w}from"./index-MG2l5tzA.js";import{T as g,L as y,m as S}from"./index-C8nqhRYO.js";import"./_commonjsHelpers-Cpj98o6Y.js";const l=document.getElementById("container"),a=new b,k=a.get(p),e=k.create();e.scene=new f(a);e.renderer=new c(a,l);e.camera=new u(a);a.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const L=a.get(h);L.create(e);e.scene.three.background=null;const A=new w(a),C=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),D=await C.arrayBuffer(),x=new Uint8Array(D),i=A.load(x);e.scene.three.add(i);for(const t of i.children)t instanceof d&&e.meshes.add(t);const n=a.get(m);n.world=e;n.enabled=!0;l.ondblclick=()=>n.create();let o;window.addEventListener("keydown",t=>{t.code==="KeyO"?n.delete():t.code==="KeyS"?(o=n.get(),n.deleteAll()):t.code==="KeyL"&&o&&n.set(o)});const s=new r;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());g.init();const P=y.create(()=>S`
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
