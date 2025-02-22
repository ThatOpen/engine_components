import{a as m}from"./web-ifc-api-r1ed24cU.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{C as p,W as u,S as f,a as g,G as h,F as w}from"./index-4oEgnBmA.js";import{T as y,L as i,m as c}from"./index-ByMLC5eT.js";import{W as k,P as S}from"./index-CDKMALq_.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=document.getElementById("container"),s=new p,L=s.get(u),e=L.create();e.scene=new f(s);e.renderer=new k(s,r);e.camera=new g(s);s.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const v=s.get(h);v.create(e);e.scene.three.background=null;const P=new w(s),A=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),C=await A.arrayBuffer(),D=new Uint8Array(C),d=P.load(D);e.scene.three.add(d);for(const t of d.children)t instanceof m&&e.meshes.add(t);const n=s.get(S);n.world=e;n.enabled=!0;r.ondblclick=()=>n.create();let l;window.addEventListener("keydown",t=>{t.code==="KeyO"?n.delete():t.code==="KeyS"?(l=n.get(),n.deleteAll()):t.code==="KeyL"&&l&&n.set(l)});const o=new b;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());y.init();const a=i.create(()=>c`
  <bim-panel active label="Face Measurement Tutorial" class="options-menu">
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
    `);document.body.append(a);const x=i.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(x);
