import"./web-ifc-api-BffFJDIm.js";import{S as f}from"./stats.min-GTpOrGrX.js";import{p as g,a as m,m as u}from"./index-DyM33b1I.js";import{a as w}from"./index-BSAL1QGz.js";import{W as y,S as I,a as R,b as S,G as x}from"./index-C7tNMTLj.js";import{I as L,a as h}from"./index-EnshWEFz.js";import{I as U}from"./index-CvFWk4AU.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DCGuIamj.js";const P=document.getElementById("container"),o=new w,k=o.get(y),t=k.create();t.scene=new I(o);t.renderer=new R(o,P);t.camera=new S(o);o.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const v=o.get(x);v.create(t);t.scene.three.background=null;const b=o.get(U);await b.setup();const j=await fetch("/resources/small.ifc"),A=await j.arrayBuffer(),C=new Uint8Array(A),e=await b.load(C);t.scene.three.add(e);const n=o.get(L);await n.process(e);const p=n.getEntityRelations(e,6518,"IsDefinedBy");if(p)for(const s of p){const c=await e.getProperties(s);console.log(c),await h.getPsetProps(e,s,async r=>{const a=await e.getProperties(r);console.log(a)})}const O=(s,c)=>{const r=new File([s],c),a=document.createElement("a");a.href=URL.createObjectURL(r),a.download=r.name,a.click(),URL.revokeObjectURL(a.href)},B=n.serializeModelRelations(e);console.log(B);const E=n.serializeAllRelations();delete n.relationMaps[e.uuid];const F=await fetch("/resources/small-relations.json"),M=n.getRelationsMapFromJSON(await F.text());n.setRelationMap(e,M);const d=n.getEntityRelations(e,6518,"ContainedInStructure");if(d&&d[0]){const s=await e.getProperties(d[0]);console.log(s)}const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());g.init();const l=m.create(()=>u`
  <bim-panel active label="IFC Relations Indexer Tutorial" class="options-menu">
  <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{O(E,"relations-index-all.json")}}">  
        </bim-button>        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(l);const z=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
