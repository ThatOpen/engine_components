import{al as p}from"./web-ifc-api-eJ7dR4yy.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{k as l,C as d,b as f}from"./index-CA2cPfXk.js";import{a as w,W as b,S as g,b as u,c as y}from"./index-BRIP3dnE.js";import{G as x}from"./index-aZ7tPJp1.js";import{I as S}from"./index-Cm2Maecs.js";import{F as h}from"./index-DUv5fNdI.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./ifc-geometry-types-C3SKrzrZ.js";const I=document.getElementById("container"),t=new w,k=t.get(b),e=k.create();e.scene=new g(t);e.renderer=new u(t,I);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const U=t.get(x);U.create(e);const B=new h(t),F=await fetch("../../../../../resources/small.frag"),O=await F.arrayBuffer(),A=new Uint8Array(O),C=B.load(A);e.scene.three.add(C);const n=new p;n.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/",!0);await n.Init();const E=await fetch("../../../../../resources/small.ifc"),L=await E.arrayBuffer(),R=new Uint8Array(L),j=n.OpenModel(R),J=t.get(S);l.registerComponents();const v=d.create(()=>f`
    <bim-panel active label="IFC JSON Exporter Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const s=await J.export(n,j),c=JSON.stringify(s),i=new File([new Blob([c])],"properties.json"),a=URL.createObjectURL(i),r=document.createElement("a");r.download="properties.json",r.href=a,r.click(),URL.revokeObjectURL(a),r.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(v);const o=new m;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.right="auto";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());
