import{a8 as p}from"./web-ifc-api-BC8YMRiS.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{p as l,a as d,m as f}from"./index-DyM33b1I.js";import{a as w,W as g,S as b,b as u,c as h}from"./index-B99Vyz6D.js";import{G as y}from"./index-vdN6D13n.js";import{I as x}from"./index-BmLeol6g.js";import{F as S}from"./index-Cy4SZRUH.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./ifc-geometry-types-C3SKrzrZ.js";const I=document.getElementById("container"),t=new w,U=t.get(g),e=U.create();e.scene=new b(t);e.renderer=new u(t,I);e.camera=new h(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const B=t.get(y);B.create(e);const k=new S(t),F=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),O=await F.arrayBuffer(),A=new Uint8Array(O),E=k.load(A);e.scene.three.add(E);const r=new p;r.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/",!0);await r.Init();const L=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),R=await L.arrayBuffer(),j=new Uint8Array(R),J=r.OpenModel(j),v=t.get(x);l.init();const C=d.create(()=>f`
    <bim-panel active label="IFC JSON Exporter Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async()=>{const s=await v.export(r,J),i=JSON.stringify(s),c=new File([new Blob([i])],"properties.json"),a=URL.createObjectURL(c),n=document.createElement("a");n.download="properties.json",n.href=a,n.click(),URL.revokeObjectURL(a),n.remove()}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(C);const o=new m;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.right="auto";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());
