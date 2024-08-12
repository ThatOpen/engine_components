import"./web-ifc-api-CBCWqdvz.js";import{S as b}from"./stats.min-BpIepu9J.js";import{m as f,t as m,a as u}from"./index-TmOv0r_5.js";import{p as w,C as y,O as h,a as R,H as I,u as S,R as E,c as x,K as L}from"./index-B7_GRGdn.js";const B=document.getElementById("container"),o=new w,C=o.get(y),n=C.create();n.scene=new h(o);n.renderer=new R(o,B);n.camera=new I(o);o.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);n.scene.setup();const O=o.get(S);O.create(n);n.scene.three.background=null;const g=o.get(E);await g.setup();const P=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),U=await P.arrayBuffer(),k=new Uint8Array(U),e=await g.load(k);n.scene.three.add(e);const t=o.get(x);await t.process(e);const p=t.getEntityRelations(e,6518,"IsDefinedBy");if(p)for(const s of p){const r=await e.getProperties(s);console.log(r),await L.getPsetProps(e,s,async l=>{const i=await e.getProperties(l);console.log(i)})}const v=(s,r)=>{const l=new File([s],r),i=document.createElement("a");i.href=URL.createObjectURL(l),i.download=l.name,i.click(),URL.revokeObjectURL(i.href)},j=t.serializeModelRelations(e);console.log(j);const A=t.serializeAllRelations();delete t.relationMaps[e.uuid];const D=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),$=t.getRelationsMapFromJSON(await D.text());t.setRelationMap(e,$);const d=t.getEntityRelations(e,6518,"ContainedInStructure");if(d&&d[0]){const s=await e.getProperties(d[0]);console.log(s)}const F=t.getEntitiesWithRelation(e,"ContainedInStructure",138);console.log(`IfcBuildingStorey 138 has the following IfcElement: ${[...F]}`);const M=t.getEntitiesWithRelation(e,"ContainsElements",186);console.log(`IfcElement 186 is located inside IfcBuildingStorey ${[...M][0]}`);const z=t.getEntitiesWithRelation(e,"IsDefinedBy",303);console.log(`${[...z]} are defined by IfcPropertySet 303`);const a=new b;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>a.begin());n.renderer.onAfterUpdate.add(()=>a.end());f.init();const c=m.create(()=>u`
  <bim-panel active label="IFC Relations Indexer Tutorial" class="options-menu">
  <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{v(A,"relations-index-all.json")}}">  
        </bim-button>        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(c);const J=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
