import{aF as D,bk as r,aE as L,bl as P,as as I}from"./web-ifc-api-1K9lRohe.js";import{S as x}from"./stats.min-GTpOrGrX.js";import{T as U,z as w,m as g}from"./index-BEvRfOoQ.js";import{C,W as O,S as F,I as v,d as k,e as A,f as y,U as B}from"./index-DPb0C-yz.js";import{S as M,a as N,G as j}from"./index-Dxd81-jw.js";import"./_commonjsHelpers-Cpj98o6Y.js";const T=document.getElementById("container"),s=new C,W=s.get(O),a=W.create();a.scene=new M(s);a.renderer=new N(s,T);a.camera=new F(s);s.init();a.camera.controls.setLookAt(12,6,8,0,0,-10);a.scene.setup();const $=s.get(j);$.create(a);a.scene.three.background=null;const R=s.get(v);await R.setup();const z=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),G=await z.arrayBuffer(),S=new Uint8Array(G),e=await R.load(S);a.scene.three.add(e);const t=s.get(k);await t.process(e);const u=t.getEntityRelations(e,6518,"IsDefinedBy");if(u)for(const n of u){const i=await e.getProperties(n);console.log(i),await A.getPsetProps(e,n,async l=>{const o=await e.getProperties(l);console.log(o)})}const H=(n,i)=>{const l=new File([n],i),o=document.createElement("a");o.href=URL.createObjectURL(l),o.download=l.name,o.click(),URL.revokeObjectURL(o.href)},J=t.serializeModelRelations(e);console.log(J);const V=t.serializeAllRelations();delete t.relationMaps[e.uuid];const Y=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),_=t.getRelationsMapFromJSON(await Y.text());t.setRelationMap(e,_);const p=t.getEntityRelations(e,6518,"ContainedInStructure");if(p&&p[0]){const n=await e.getProperties(p[0]);console.log(n)}const q=t.getEntitiesWithRelation(e,"ContainedInStructure",138);console.log(`IfcBuildingStorey 138 has the following IfcElement: ${[...q]}`);const X=t.getEntitiesWithRelation(e,"ContainsElements",186);console.log(`IfcElement 186 is located inside IfcBuildingStorey ${[...X][0]}`);const K=t.getEntitiesWithRelation(e,"IsDefinedBy",303);console.log(`${[...K]} are defined by IfcPropertySet 303`);const m=s.get(y),b=await m.getEntityRef(e,D),E=new r.IfcPropertySingleValue(new r.IfcIdentifier("Property Name"),null,new r.IfcLabel("Property Value"),null);await m.setData(e,E);const f=new r.IfcPropertySet(new r.IfcGloballyUniqueId(B.create()),b?b[0]:null,new r.IfcLabel("My New Pset!"),null,[new L(E.expressID)]);await m.setData(e,f);const h=await e.getAllPropertiesOfType(P),Q=Object.values(h).map(n=>n.expressID);t.addEntitiesRelation(e,f.expressID,{type:I,inv:"DefinesOcurrence"},...Q);for(const n in h)t.addEntitiesRelation(e,Number(n),{type:I,inv:"IsDefinedBy"},f.expressID);const c=new x;c.showPanel(2);document.body.append(c.dom);c.dom.style.left="0px";c.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>c.begin());a.renderer.onAfterUpdate.add(()=>c.end());U.init();const d=w.create(()=>g`
  <bim-panel active label="IFC Relations Indexer Tutorial" class="options-menu">
  <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{H(V,"relations-index-all.json")}}">  
        </bim-button>        

        <bim-button 
          label="Download Model" 
          @click="${async()=>{const n=s.get(y);try{const i=await n.saveToIfc(e,S),l=new File([i],"new.ifc"),o=document.createElement("a");o.href=URL.createObjectURL(l),o.download=l.name,o.click(),URL.revokeObjectURL(o.href)}catch(i){alert(i)}}}">  
        </bim-button>        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(d);const Z=w.create(()=>g`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{d.classList.contains("options-menu-visible")?d.classList.remove("options-menu-visible"):d.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(Z);
