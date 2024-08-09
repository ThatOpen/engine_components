import{a2 as u,C as m}from"./web-ifc-api-cV7FPlIA.js";import{S as d}from"./stats.min-BpIepu9J.js";import{m as b,t as a,a as c}from"./index-TmOv0r_5.js";import{p,C,O as f,a as w,H as I,u as g,h as y,F as A}from"./index-BkOJFY0w.js";const E=document.getElementById("container"),s=new p,F=s.get(C),t=F.create();t.scene=new f(s);t.renderer=new w(s,E);t.camera=new I(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const L=s.get(g);L.create(t);t.scene.three.background=null;const h=new y(s),R=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await R.arrayBuffer(),T=new Uint8Array(S),l=h.load(T);t.scene.three.add(l);const o=s.get(A);o.byEntity(l);o.byIfcRel(l,u,"storeys");o.byModel(l.uuid,l);const N=o.find({entities:["IFCWALLSTANDARDCASE"]}),$=o.find({entities:["IFCSLAB"]}),U=o.find({entities:["IFCMEMBER","IFCPLATE"]}),v=o.find({entities:["IFCFURNISHINGELEMENT"]}),B=o.find({entities:["IFCDOOR"]}),D=o.find({models:[l.uuid]}),i=new d;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());b.init();const e=new m,r=a.create(()=>c`
    <bim-panel active label="Classifier Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(N,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Curtain walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(U,e)}}">
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
