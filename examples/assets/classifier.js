import{a2 as d,C as m}from"./web-ifc-api-5J0YW9AE.js";import{S as u}from"./stats.min-BpIepu9J.js";import{m as b,t as a,a as c}from"./index-tywNknxv.js";import{p,C,s as f,i as w,k as I,d as g,h as A,A as y}from"./index-ChhmFBcB.js";const E=document.getElementById("container"),s=new p,L=s.get(C),t=L.create();t.scene=new f(s);t.renderer=new w(s,E);t.camera=new I(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const h=s.get(g);h.create(t);t.scene.three.background=null;const F=new A(s),R=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await R.arrayBuffer(),T=new Uint8Array(S),i=F.load(T);t.scene.three.add(i);const o=s.get(y);o.byEntity(i);o.byIfcRel(i,d,"storeys");o.byModel(i.uuid,i);const N=o.find({entities:["IFCWALLSTANDARDCASE"]}),$=o.find({entities:["IFCSLAB"]}),k=o.find({entities:["IFCMEMBER","IFCPLATE"]}),U=o.find({entities:["IFCFURNISHINGELEMENT"]}),v=o.find({entities:["IFCDOOR"]}),B=o.find({models:[i.uuid]}),l=new u;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());b.init();const e=new m,r=a.create(()=>c`
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
          @input="${({target:n})=>{e.set(n.color),o.setColor(k,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Furniture Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(U,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Doors Color" color="#202932" 
          @input="${({target:n})=>{e.set(n.color),o.setColor(v,e)}}">
        </bim-color-input>
                  
        <bim-button 
          label="Reset walls color" 
          @click="${()=>{o.resetColor(B)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const D=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(D);
