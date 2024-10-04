import{ac as m,C as u}from"./web-ifc-api-Dlf_dxms.js";import{S as d}from"./stats.min-bmkVNhZk.js";import{T as b,z as a,m as c}from"./index-DtbylpTq.js";import{p,A as f,e as C,m as w,v as I,O as g,T as A,U as y}from"./index-6e07lNWw.js";const E=document.getElementById("container"),s=new p,T=s.get(f),t=T.create();t.scene=new C(s);t.renderer=new w(s,E);t.camera=new I(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const L=s.get(g);L.create(t);t.scene.three.background=null;const h=new A(s),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await F.arrayBuffer(),S=new Uint8Array(R),l=h.load(S);t.scene.three.add(l);const o=s.get(y);o.byEntity(l);o.byIfcRel(l,m,"storeys");o.byModel(l.uuid,l);const U=o.find({entities:["IFCWALLSTANDARDCASE"]}),v=o.find({entities:["IFCSLAB"]}),N=o.find({entities:["IFCMEMBER","IFCPLATE"]}),$=o.find({entities:["IFCFURNISHINGELEMENT"]}),B=o.find({entities:["IFCDOOR"]}),D=o.find({models:[l.uuid]}),i=new d;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());b.init();const e=new u,r=a.create(()=>c`
    <bim-panel active label="Classifier Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(U,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(v,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Curtain walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(N,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Furniture Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Doors Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(B,e)}}">
        </bim-color-input>
                  
        <bim-button 
          label="Reset walls color" 
          @click="${()=>{o.resetColor(D)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const O=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(O);
