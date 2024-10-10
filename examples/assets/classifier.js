import{ac as m,C as u}from"./web-ifc-api-Dxv4iFj4.js";import{S as d}from"./stats.min-DYv0AsOH.js";import{T as b,z as a,m as c}from"./index-DtbylpTq.js";import{C as p,T as C,e as f,m as w,U as I,O as g,a as y,x as T}from"./index-BRzxhLMM.js";const A=document.getElementById("container"),s=new p,E=s.get(C),t=E.create();t.scene=new f(s);t.renderer=new w(s,A);t.camera=new I(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const L=s.get(g);L.create(t);t.scene.three.background=null;const h=new y(s),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await F.arrayBuffer(),S=new Uint8Array(R),l=h.load(S);t.scene.three.add(l);const o=s.get(T);o.byEntity(l);o.byIfcRel(l,m,"storeys");o.byModel(l.uuid,l);const U=o.find({entities:["IFCWALLSTANDARDCASE"]}),N=o.find({entities:["IFCSLAB"]}),$=o.find({entities:["IFCMEMBER","IFCPLATE"]}),v=o.find({entities:["IFCFURNISHINGELEMENT"]}),B=o.find({entities:["IFCDOOR"]}),D=o.find({models:[l.uuid]}),i=new d;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());b.init();const e=new u,r=a.create(()=>c`
    <bim-panel active label="Classifier Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(U,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(N,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Curtain walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Furniture Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(v,e)}}">
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
