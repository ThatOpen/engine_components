import"./web-ifc-api-CwSt8Jc1.js";import{S as g}from"./stats.min-BpIepu9J.js";import{p as f,J as m,m as u}from"./index-K5IA6oiZ.js";import{p as w,C as y,s as h,i as R,H as x,d as I,a as L,k,K as S}from"./index-DPXwPaYJ.js";const U=document.getElementById("container"),n=new w,v=n.get(y),t=v.create();t.scene=new h(n);t.renderer=new R(n,U);t.camera=new x(n);n.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const P=n.get(I);P.create(t);t.scene.three.background=null;const b=n.get(L);await b.setup();const j=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),A=await j.arrayBuffer(),C=new Uint8Array(A),e=await b.load(C);t.scene.three.add(e);const o=n.get(k);await o.process(e);const p=o.getEntityRelations(e,6518,"IsDefinedBy");if(p)for(const s of p){const c=await e.getProperties(s);console.log(c),await S.getPsetProps(e,s,async l=>{const a=await e.getProperties(l);console.log(a)})}const J=(s,c)=>{const l=new File([s],c),a=document.createElement("a");a.href=URL.createObjectURL(l),a.download=l.name,a.click(),URL.revokeObjectURL(a.href)},O=o.serializeModelRelations(e);console.log(O);const B=o.serializeAllRelations();delete o.relationMaps[e.uuid];const E=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),F=o.getRelationsMapFromJSON(await E.text());o.setRelationMap(e,F);const d=o.getEntityRelations(e,6518,"ContainedInStructure");if(d&&d[0]){const s=await e.getProperties(d[0]);console.log(s)}const i=new g;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());f.init();const r=m.create(()=>u`
  <bim-panel active label="IFC Relations Indexer Tutorial" class="options-menu">
  <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-button 
          label="Download relations" 
          @click="${async()=>{J(B,"relations-index-all.json")}}">  
        </bim-button>        

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const M=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(M);
