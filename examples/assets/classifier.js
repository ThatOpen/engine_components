import{C as l}from"./web-ifc-api-CmZKgq4q.js";import{S as a}from"./stats.min-GTpOrGrX.js";import{k as c,C as m,b as p}from"./index-CA2cPfXk.js";import{a as d,W as u,S as b,b as f,c as C}from"./index-D-_Rgxo_.js";import{G as w}from"./index-0yMcLqZW.js";import{C as g}from"./index-Cm1ATmb3.js";import{F as y}from"./index-AoMuzpS3.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),n=new d,F=n.get(u),r=F.create();r.scene=new b(n);r.renderer=new f(n,S);r.camera=new C(n);n.init();r.camera.controls.setLookAt(12,6,8,0,0,-10);r.scene.setup();const A=n.get(w);A.create(r);const E=new y(n),I=await fetch("../../../../../resources/small.frag"),L=await I.arrayBuffer(),R=new Uint8Array(L),s=E.load(R);r.scene.three.add(s);const o=n.get(g);o.byEntity(s);o.byStorey(s);o.byModel(s.uuid,s);c.registerComponents();const $=o.find({entities:["IFCWALLSTANDARDCASE"]}),h=o.find({entities:["IFCSLAB"]}),x=o.find({entities:["IFCMEMBER","IFCPLATE"]}),B=o.find({entities:["IFCFURNISHINGELEMENT"]}),M=o.find({entities:["IFCDOOR"]}),W=o.find({models:[s.uuid]}),e=new l,k=m.create(()=>p`
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
    `);document.body.append(k);const i=new a;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.right="auto";r.renderer.onBeforeUpdate.add(()=>i.begin());r.renderer.onAfterUpdate.add(()=>i.end());
