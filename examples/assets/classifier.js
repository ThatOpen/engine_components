import{ac as m,C as p}from"./web-ifc-api-r1ed24cU.js";import{S as d}from"./stats.min-GTpOrGrX.js";import{T as u,L as a,m as c}from"./index-ByMLC5eT.js";import{C as b,W as C,S as f,d as g,a as w,G as I,F as L,c as S}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const y=document.getElementById("container"),s=new b,h=s.get(C),t=h.create();t.scene=new f(s);t.renderer=new g(s,y);t.camera=new w(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=s.get(I);A.create(t);t.scene.three.background=null;const E=new L(s),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await F.arrayBuffer(),T=new Uint8Array(R),i=E.load(T);t.scene.three.add(i);const N=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await N.json());const o=s.get(S);o.byEntity(i);o.byIfcRel(i,m,"storeys");o.byModel(i.uuid,i);const $=o.find({entities:["IFCWALLSTANDARDCASE"]}),U=o.find({entities:["IFCSLAB"]}),v=o.find({entities:["IFCMEMBER","IFCPLATE"]}),B=o.find({entities:["IFCFURNISHINGELEMENT"]}),D=o.find({entities:["IFCDOOR"]}),M=o.find({models:[i.uuid]}),l=new d;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());u.init();const e=new p,r=a.create(()=>c`
    <bim-panel active label="Classifier Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(U,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Curtain walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(v,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Furniture Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(B,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Doors Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(D,e)}}">
        </bim-color-input>
                  
        <bim-button 
          label="Reset walls color" 
          @click="${()=>{o.resetColor(M)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const W=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(W);
