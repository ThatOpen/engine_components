import"./web-ifc-api-BXZoUgQp.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{d as f,R as m,m as u}from"./index-CqPyogbW.js";import{o as w,a as y,L as h,M as R,N as I,l as E,E as S,J as L,b as x}from"./index-CbQqmTVP.js";import"./_commonjsHelpers-Cpj98o6Y.js";const B=document.getElementById("container"),o=new w,M=o.get(y),n=M.create();n.scene=new h(o);n.renderer=new R(o,B);n.camera=new I(o);o.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const P=o.get(E);P.create(n);n.scene.three.background=null;const g=o.get(S);await g.setup();const U=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),k=await U.arrayBuffer(),v=new Uint8Array(k),e=await g.load(v);n.scene.three.add(e);const t=o.get(L);await t.process(e);const p=t.getEntityRelations(e,6518,"IsDefinedBy");if(p)for(const s of p){const r=await e.getProperties(s);console.log(r),await x.getPsetProps(e,s,async l=>{const i=await e.getProperties(l);console.log(i)})}const j=(s,r)=>{const l=new File([s],r),i=document.createElement("a");i.href=URL.createObjectURL(l),i.download=l.name,i.click(),URL.revokeObjectURL(i.href)},A=t.serializeModelRelations(e);console.log(A);const C=t.serializeAllRelations();delete t.relationMaps[e.uuid];const D=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),J=t.getRelationsMapFromJSON(await D.text());t.setRelationMap(e,J);const d=t.getEntityRelations(e,6518,"ContainedInStructure");if(d&&d[0]){const s=await e.getProperties(d[0]);console.log(s)}const N=t.getEntitiesWithRelation(e,"ContainedInStructure",138);console.log(`IfcBuildingStorey 138 has the following IfcElement: ${[...N]}`);const O=t.getEntitiesWithRelation(e,"ContainsElements",186);console.log(`IfcElement 186 is located inside IfcBuildingStorey ${[...O][0]}`);const $=t.getEntitiesWithRelation(e,"IsDefinedBy",303);console.log(`${[...$]} are defined by IfcPropertySet 303`);const a=new b;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>a.begin());n.renderer.onAfterUpdate.add(()=>a.end());f.init();const c=m.create(()=>u`
  <bim-panel active label="IFC Relations Indexer Tutorial" class="options-menu">
  <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{j(C,"relations-index-all.json")}}">  
        </bim-button>        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(c);const F=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(F);
