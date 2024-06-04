import"./web-ifc-api-D3oDn2HF.js";import{S as f}from"./stats.min-DDrWCSVO.js";import{p as g,J as m,m as u}from"./index-K5IA6oiZ.js";import{a as w,W as y,S as I,c as R,b as S,G as x,g as L,I as h,j as U}from"./index-DPB0U-mi.js";const P=document.getElementById("container"),o=new w,j=o.get(y),t=j.create();t.scene=new I(o);t.renderer=new R(o,P);t.camera=new S(o);o.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const k=o.get(x);k.create(t);t.scene.three.background=null;const b=o.get(L);await b.setup();const v=await fetch("/resources/small.ifc"),A=await v.arrayBuffer(),C=new Uint8Array(A),e=await b.load(C);t.scene.three.add(e);const n=o.get(h);await n.process(e);const p=n.getEntityRelations(e,6518,"IsDefinedBy");if(p)for(const s of p){const c=await e.getProperties(s);console.log(c),await U.getPsetProps(e,s,async l=>{const a=await e.getProperties(l);console.log(a)})}const J=(s,c)=>{const l=new File([s],c),a=document.createElement("a");a.href=URL.createObjectURL(l),a.download=l.name,a.click(),URL.revokeObjectURL(a.href)},O=n.serializeModelRelations(e);console.log(O);const B=n.serializeAllRelations();delete n.relationMaps[e.uuid];const E=await fetch("/resources/small-relations.json"),F=n.getRelationsMapFromJSON(await E.text());n.setRelationMap(e,F);const d=n.getEntityRelations(e,6518,"ContainedInStructure");if(d&&d[0]){const s=await e.getProperties(d[0]);console.log(s)}const i=new f;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>i.begin());t.renderer.onAfterUpdate.add(()=>i.end());g.init();const r=m.create(()=>u`
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
