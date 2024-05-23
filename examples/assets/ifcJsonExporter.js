import{a8 as p}from"./web-ifc-api-BC8YMRiS.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{p as l,a as d,m as f}from"./index-DyM33b1I.js";import{a as w,W as b,S as u,b as g,c as y}from"./index-B99Vyz6D.js";import{G as x}from"./index-vdN6D13n.js";import{I as S}from"./index-BmLeol6g.js";import{F as h}from"./index-Cy4SZRUH.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./ifc-geometry-types-C3SKrzrZ.js";const I=document.getElementById("container"),t=new w,U=t.get(b),e=U.create();e.scene=new u(t);e.renderer=new g(t,I);e.camera=new y(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const B=t.get(x);B.create(e);const k=new h(t),F=await fetch("../../../../../resources/small.frag"),O=await F.arrayBuffer(),A=new Uint8Array(O),E=k.load(A);e.scene.three.add(E);const n=new p;n.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/",!0);await n.Init();const L=await fetch("../../../../../resources/small.ifc"),R=await L.arrayBuffer(),j=new Uint8Array(R),J=n.OpenModel(j),v=t.get(S);l.init();const C=d.create(()=>f`
    <bim-panel active label="IFC JSON Exporter Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const s=await v.export(n,J),c=JSON.stringify(s),i=new File([new Blob([c])],"properties.json"),a=URL.createObjectURL(i),r=document.createElement("a");r.download="properties.json",r.href=a,r.click(),URL.revokeObjectURL(a),r.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(C);const o=new m;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.right="auto";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());
