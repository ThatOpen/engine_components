import{a4 as u,C as d}from"./web-ifc-api-x9swcCj5.js";import{S as m}from"./stats.min-BpIepu9J.js";import{p,J as a,m as c}from"./index-K5IA6oiZ.js";import{p as b,C,s as f,i as w,H as I,d as g,u as A,A as y}from"./index-D_egKO7i.js";const E=document.getElementById("container"),s=new b,L=s.get(C),t=L.create();t.scene=new f(s);t.renderer=new w(s,E);t.camera=new I(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const F=s.get(g);F.create(t);t.scene.three.background=null;const R=new A(s),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),h=await S.arrayBuffer(),T=new Uint8Array(h),i=R.load(T);t.scene.three.add(i);const o=s.get(y);o.byEntity(i);o.byIfcRel(i,u,"storeys");o.byModel(i.uuid,i);const $=o.find({entities:["IFCWALLSTANDARDCASE"]}),N=o.find({entities:["IFCSLAB"]}),U=o.find({entities:["IFCMEMBER","IFCPLATE"]}),v=o.find({entities:["IFCFURNISHINGELEMENT"]}),B=o.find({entities:["IFCDOOR"]}),D=o.find({models:[i.uuid]}),l=new m;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());p.init();const e=new d,r=a.create(()=>c`
    <bim-panel active label="Classifier Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(N,e)}}">
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
    `);document.body.append(r);const k=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(k);
