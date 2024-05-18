import"./web-ifc-api-CmZKgq4q.js";import{k as m,C as d,b as f}from"./index-CA2cPfXk.js";import{a as w,W as g,S as u,b,c as y}from"./index-D-_Rgxo_.js";import{G as I}from"./index-0yMcLqZW.js";import{I as R,a as x}from"./index-AoMuzpS3.js";import{I as S}from"./index-BHBDWQUL.js";import"./ifc-metadata-reader-Ct4A3d-k.js";import"./ifc-fragment-settings-BgEjp--L.js";import"./index-Dj9q8Wwk.js";import"./ifc-geometry-types-C3SKrzrZ.js";const L=document.getElementById("container"),t=new w,h=t.get(g),n=h.create();n.scene=new u(t);n.renderer=new b(t,L);n.camera=new y(t);t.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const k=t.get(I);k.create(n);const p=t.get(S);await p.setup();const C=await fetch("/resources/small.ifc"),O=await C.arrayBuffer(),P=new Uint8Array(O),e=await p.load(P);n.scene.three.add(e);const o=t.get(R);await o.process(e);const l=o.getEntityRelations(e,6518,"IsDefinedBy");if(l)for(const s of l){const i=await e.getProperties(s);console.log(i),await x.getPsetProps(e,s,async r=>{const a=await e.getProperties(r);console.log(a)})}const U=(s,i)=>{const r=new File([s],i),a=document.createElement("a");a.href=URL.createObjectURL(r),a.download=r.name,a.click(),URL.revokeObjectURL(a.href)},j=o.serializeModelRelations(e);console.log(j);const E=o.serializeAllRelations();delete o.relationMaps[e.uuid];const A=await fetch("/resources/small-relations.json"),F=o.getRelationsMapFromJSON(await A.text());o.setRelationMap(e,F);const c=o.getEntityRelations(e,6518,"ContainedInStructure");if(c&&c[0]){const s=await e.getProperties(c[0]);console.log(s)}m.registerComponents();const J=d.create(()=>f`
    <bim-panel active label="IFC JSON Exporter Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{U(E,"relations-index-all.json")}}">  
        </bim-button>        
        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(J);
