import"./web-ifc-api-BC8YMRiS.js";import{p as m,a as d,m as f}from"./index-DyM33b1I.js";import{a as w,W as g,S as u,b,c as y}from"./index-BY1If8xF.js";import{G as I}from"./index-DE4WfR4J.js";import{I as R,a as x}from"./index-CqfCnTh7.js";import{I as S}from"./index-C7O9OzBe.js";import"./ifc-metadata-reader-j9dl-lHS.js";import"./ifc-fragment-settings-CiVry-YT.js";import"./index-Bx9XDaXc.js";import"./ifc-geometry-types-C3SKrzrZ.js";const L=document.getElementById("container"),t=new w,h=t.get(g),n=h.create();n.scene=new u(t);n.renderer=new b(t,L);n.camera=new y(t);t.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const O=t.get(I);O.create(n);const p=t.get(S);await p.setup();const P=await fetch("/resources/small.ifc"),U=await P.arrayBuffer(),j=new Uint8Array(U),e=await p.load(j);n.scene.three.add(e);const o=t.get(R);await o.process(e);const c=o.getEntityRelations(e,6518,"IsDefinedBy");if(c)for(const a of c){const r=await e.getProperties(a);console.log(r),await x.getPsetProps(e,a,async i=>{const s=await e.getProperties(i);console.log(s)})}const E=(a,r)=>{const i=new File([a],r),s=document.createElement("a");s.href=URL.createObjectURL(i),s.download=i.name,s.click(),URL.revokeObjectURL(s.href)},k=o.serializeModelRelations(e);console.log(k);const A=o.serializeAllRelations();delete o.relationMaps[e.uuid];const C=await fetch("/resources/small-relations.json"),F=o.getRelationsMapFromJSON(await C.text());o.setRelationMap(e,F);const l=o.getEntityRelations(e,6518,"ContainedInStructure");if(l&&l[0]){const a=await e.getProperties(l[0]);console.log(a)}m.init();const J=d.create(()=>f`
    <bim-panel active label="IFC JSON Exporter Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{E(A,"relations-index-all.json")}}">  
        </bim-button>        
        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(J);
