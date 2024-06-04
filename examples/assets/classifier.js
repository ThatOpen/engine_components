import{at as m,C as d}from"./web-ifc-api-D3oDn2HF.js";import{S as p}from"./stats.min-DDrWCSVO.js";import{p as u,J as a,m as c}from"./index-K5IA6oiZ.js";import{a as b,W as C,S as f,c as g,b as w,G as I,F as S,e as y}from"./index-DPB0U-mi.js";const A=document.getElementById("container"),s=new b,E=s.get(C),t=E.create();t.scene=new f(s);t.renderer=new g(s,A);t.camera=new w(s);s.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const F=s.get(I);F.create(t);t.scene.three.background=null;const L=new S(s),R=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),h=await R.arrayBuffer(),T=new Uint8Array(h),l=L.load(T);t.scene.three.add(l);const o=s.get(y);o.byEntity(l);o.byIfcRel(l,m,"storeys");o.byModel(l.uuid,l);const N=o.find({entities:["IFCWALLSTANDARDCASE"]}),$=o.find({entities:["IFCSLAB"]}),U=o.find({entities:["IFCMEMBER","IFCPLATE"]}),v=o.find({entities:["IFCFURNISHINGELEMENT"]}),B=o.find({entities:["IFCDOOR"]}),D=o.find({models:[l.uuid]}),i=new p;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());u.init();const e=new d,r=a.create(()=>c`
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
    `);document.body.append(r);const M=a.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(M);
