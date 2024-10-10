import"./web-ifc-api-Dxv4iFj4.js";import{T as w,z as r,m as i}from"./index-DtbylpTq.js";import{S as h}from"./stats.min-DYv0AsOH.js";import{C as v,T as x,e as F,m as k,U as R,O as C,a as I,k as T,G as U,g as $,A,c as B}from"./index-BgsLex8O.js";const L=document.getElementById("container"),e=new v,O=e.get(x),t=O.create();t.scene=new F(e);t.renderer=new k(e,L);t.camera=new R(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const S=e.get(C);S.create(t);t.scene.three.background=null;const z=new I(e),E=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),G=await E.arrayBuffer(),M=new Uint8Array(G),c=z.load(M);t.scene.three.add(c);const m=e.get(T),_=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),j=m.getRelationsMapFromJSON(await _.text());m.setRelationMap(c,j);const N=e.get(U),n=N.create(),P=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await P.arrayBuffer()],"example"),u=new $(e,{name:"category",inclusive:!1,rules:[]});n.add(u);const p={type:"category",value:/IfcWallStandardCase/};u.rules.push(p);const d={type:"property",name:/.*/,value:/yeso/},g=new A(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const Q=n.items,o=e.get(B);o.set(!1);o.set(!0,Q);const s=new h;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());w.init();const f=r.create(()=>i`
  <bim-text-input label="Category" value="${p.value.source}"></bim-text-input>
  `),y=r.create(()=>i`
  <bim-text-input label="Property" value="${d.value.source}"></bim-text-input>
  `),q=async()=>{u.clear(),g.clear(),p.value=new RegExp(f.value),d.value=new RegExp(y.value),await n.update(c.uuid,b);const l=n.items;if(console.log(l),Object.keys(l).length===0){alert("No items found!");return}o.set(!1),o.set(!0,l)},a=r.create(()=>i`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${f}
        ${y}
      
        <bim-button label="Update"
          @click="${async()=>{await q()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(a);const J=r.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
