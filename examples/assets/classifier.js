import{ag as m,C as u}from"./web-ifc-api-CpQ3aV8c.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{T as d,z as a,m as c}from"./index-BEvRfOoQ.js";import{C as b,T as C,s as f,g,x as w,L as I,a as L,B as h}from"./index-B03kGVBW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const y=document.getElementById("container"),s=new b,T=s.get(C),t=T.create();t.scene=new f(s);t.renderer=new g(s,y);t.camera=new w(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=s.get(I);A.create(t);t.scene.three.background=null;const E=new L(s),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await F.arrayBuffer(),S=new Uint8Array(R),i=E.load(S);t.scene.three.add(i);const B=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await B.json());const o=s.get(h);o.byEntity(i);o.byIfcRel(i,m,"storeys");o.byModel(i.uuid,i);const N=o.find({entities:["IFCWALLSTANDARDCASE"]}),$=o.find({entities:["IFCSLAB"]}),U=o.find({entities:["IFCMEMBER","IFCPLATE"]}),v=o.find({entities:["IFCFURNISHINGELEMENT"]}),D=o.find({entities:["IFCDOOR"]}),k=o.find({models:[i.uuid]}),l=new p;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());d.init();const e=new u,r=a.create(()=>c`
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
          @input="${({target:n})=>{e.set(n.color),o.setColor(D,e)}}">
        </bim-color-input>
                  
        <bim-button 
          label="Reset walls color" 
          @click="${()=>{o.resetColor(k)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const x=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(x);
