import{C as s}from"./web-ifc-api-BiYij3qq.js";import{S as a}from"./stats.min-GTpOrGrX.js";import{p as c,a as m,m as p}from"./index-DyM33b1I.js";import{a as d,W as u,S as b,b as f,c as C}from"./index-DsPLPeA6.js";import{G as w}from"./index-GK9dObYT.js";import{C as y}from"./index-DvPyP2Ec.js";import{F as g}from"./index-Ba8czaZS.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),n=new d,F=n.get(u),r=F.create();r.scene=new b(n);r.renderer=new f(n,S);r.camera=new C(n);n.init();r.camera.controls.setLookAt(12,6,8,0,0,-10);r.scene.setup();const A=n.get(w);A.create(r);const E=new g(n),I=await fetch("../../../../../resources/small.frag"),L=await I.arrayBuffer(),R=new Uint8Array(L),i=E.load(R);r.scene.three.add(i);const o=n.get(y);o.byEntity(i);o.byStorey(i);o.byModel(i.uuid,i);c.init();const $=o.find({entities:["IFCWALLSTANDARDCASE"]}),h=o.find({entities:["IFCSLAB"]}),x=o.find({entities:["IFCMEMBER","IFCPLATE"]}),B=o.find({entities:["IFCFURNISHINGELEMENT"]}),M=o.find({entities:["IFCDOOR"]}),W=o.find({models:[i.uuid]}),e=new s,D=m.create(()=>p`
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
    `);document.body.append(D);const l=new a;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";l.dom.style.right="auto";r.renderer.onBeforeUpdate.add(()=>l.begin());r.renderer.onAfterUpdate.add(()=>l.end());
