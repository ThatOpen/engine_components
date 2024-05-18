import{C as l}from"./web-ifc-api-BFxa4VQ4.js";import{S as a}from"./stats.min-GTpOrGrX.js";import{k as c,C as m,b as p}from"./index-CA2cPfXk.js";import{C as d}from"./index-2WRq2SpB.js";import{W as u,S as b,a as f,b as C}from"./index-BSY2u5SV.js";import{G as w}from"./index-5vXSe8tN.js";import{C as g}from"./index-Ci1b-N1U.js";import{F as y}from"./index-CY9ZflN6.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),n=new d,F=n.get(u),r=F.create();r.scene=new b(n);r.renderer=new f(n,S);r.camera=new C(n);n.init();r.camera.controls.setLookAt(12,6,8,0,0,-10);r.scene.setup();const A=n.get(w);A.create(r);const E=new y(n),I=await fetch("../../../../../resources/small.frag"),L=await I.arrayBuffer(),R=new Uint8Array(L),i=E.load(R);r.scene.three.add(i);const o=n.get(g);o.byEntity(i);o.byStorey(i);o.byModel(i.uuid,i);c.registerComponents();const $=o.find({entities:["IFCWALLSTANDARDCASE"]}),h=o.find({entities:["IFCSLAB"]}),x=o.find({entities:["IFCMEMBER","IFCPLATE"]}),B=o.find({entities:["IFCFURNISHINGELEMENT"]}),M=o.find({entities:["IFCDOOR"]}),W=o.find({models:[i.uuid]}),e=new l,k=m.create(()=>p`
    <bim-panel active label="Classifier Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor($,e)}}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({target:t})=>{e.set(t.color),o.setColor(h,e)}}">
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
    `);document.body.append(k);const s=new a;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.right="auto";r.renderer.onBeforeUpdate.add(()=>s.begin());r.renderer.onAfterUpdate.add(()=>s.end());
