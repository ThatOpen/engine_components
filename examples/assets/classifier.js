import{ac as m,C as u}from"./web-ifc-api-BlC6WGhG.js";import{S as p}from"./stats.min-ClRtqrR4.js";import{T as d,z as a,m as c}from"./index-DtbylpTq.js";import{C as b,T as C,e as f,m as w,x as g,O as I,a as h,B as y}from"./index-B-8uKlMo.js";const T=document.getElementById("container"),s=new b,A=s.get(C),t=A.create();t.scene=new f(s);t.renderer=new w(s,T);t.camera=new g(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=s.get(I);E.create(t);t.scene.three.background=null;const L=new h(s),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),R=await F.arrayBuffer(),S=new Uint8Array(R),i=L.load(S);t.scene.three.add(i);const B=await fetch("https://thatopen.github.io/engine_components/resources/small.json");i.setLocalProperties(await B.json());const o=s.get(y);o.byEntity(i);o.byIfcRel(i,m,"storeys");o.byModel(i.uuid,i);const N=o.find({entities:["IFCWALLSTANDARDCASE"]}),$=o.find({entities:["IFCSLAB"]}),U=o.find({entities:["IFCMEMBER","IFCPLATE"]}),v=o.find({entities:["IFCFURNISHINGELEMENT"]}),D=o.find({entities:["IFCDOOR"]}),O=o.find({models:[i.uuid]}),l=new p;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>l.begin());t.renderer.onAfterUpdate.add(()=>l.end());d.init();const e=new u,r=a.create(()=>c`
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
          @click="${()=>{o.resetColor(O)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const k=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(k);
