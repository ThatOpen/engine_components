import"./web-ifc-api-r1ed24cU.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{C as d,W as b,S as p,a as u,G as g,F as f}from"./index-4oEgnBmA.js";import{T as h,L as l,m as i}from"./index-ByMLC5eT.js";import{W as w,O as L,L as v}from"./index-CDKMALq_.js";import"./_commonjsHelpers-Cpj98o6Y.js";const y=document.getElementById("container"),t=new d,k=t.get(b),e=k.create();e.scene=new p(t);e.renderer=new w(t,y);e.camera=new u(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const C=t.get(g);C.create(e);e.scene.three.background=null;const S=new f(t),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),W=await F.arrayBuffer(),A=new Uint8Array(W),B=S.load(A);e.scene.three.add(B);const o=t.get(L);o.world=e;o.enabled=!0;const a=t.get(v);a.setup({world:e});a.events.select.onHighlight.add(r=>{const c=o.getVolumeFromFragments(r);console.log(c)});a.events.select.onClear.add(()=>{o.clear()});const n=new m;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());h.init();const s=l.create(()=>i`
  <bim-panel active label="Volume Measurement Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
          <bim-label>Create dimension: Left click</bim-label>  
          <bim-label>Delete dimension: Left click el</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Others"> 
        
        <bim-button label="Delete all"
          @click="${()=>{o.clear(),a.clear()}}">
        </bim-button>

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const O=l.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(O);
