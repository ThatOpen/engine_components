import{C as l}from"./web-ifc-api-BC8YMRiS.js";import{S as a}from"./stats.min-GTpOrGrX.js";import{p as c,a as m,m as p}from"./index-DyM33b1I.js";import{a as d,W as u,S as b,b as f,c as C}from"./index-B99Vyz6D.js";import{G as w}from"./index-vdN6D13n.js";import{C as g}from"./index-zq8_pZ9C.js";import{F as y}from"./index-Cy4SZRUH.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),r=new d,F=r.get(u),n=F.create();n.scene=new b(r);n.renderer=new f(r,S);n.camera=new C(r);r.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const A=r.get(w);A.create(n);const E=new y(r),I=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),h=await I.arrayBuffer(),L=new Uint8Array(h),i=E.load(L);n.scene.three.add(i);const o=r.get(g);o.byEntity(i);o.byStorey(i);o.byModel(i.uuid,i);c.init();const R=o.find({entities:["IFCWALLSTANDARDCASE"]}),$=o.find({entities:["IFCSLAB"]}),x=o.find({entities:["IFCMEMBER","IFCPLATE"]}),B=o.find({entities:["IFCFURNISHINGELEMENT"]}),M=o.find({entities:["IFCDOOR"]}),W=o.find({models:[i.uuid]}),e=new l,D=m.create(()=>p`
    <bim-panel active label="Classifier Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor(R,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Curtain walls Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor(x,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Furniture Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor(B,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Doors Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor(M,e)}}">
        </bim-color-input>
                  
        <bim-button 
          label="Reset walls color" 
          @click="${()=>{o.resetColor(W)}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(D);const s=new a;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.right="auto";n.renderer.onBeforeUpdate.add(()=>s.begin());n.renderer.onAfterUpdate.add(()=>s.end());
