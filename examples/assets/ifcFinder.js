import"./web-ifc-api-BlC6WGhG.js";import{T as w,z as r,m as i}from"./index-DtbylpTq.js";import{S as h}from"./stats.min-ClRtqrR4.js";import{C as v,T as x,e as F,m as R,x as C,O as I,a as T,G as $,g as k,h as A,A as B,b as G}from"./index-B-8uKlMo.js";const L=document.getElementById("container"),e=new v,O=e.get(x),t=O.create();t.scene=new F(e);t.renderer=new R(e,L);t.camera=new C(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const S=e.get(I);S.create(t);t.scene.three.background=null;const U=new T(e),z=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),E=await z.arrayBuffer(),M=new Uint8Array(E),c=U.load(M);t.scene.three.add(c);const m=e.get($),_=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),j=m.getRelationsMapFromJSON(await _.text());m.setRelationMap(c,j);const N=e.get(k),n=N.create(),P=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await P.arrayBuffer()],"example"),u=new A(e,{name:"category",inclusive:!1,rules:[]});n.add(u);const p={type:"category",value:/IfcWallStandardCase/};u.rules.push(p);const d={type:"property",name:/.*/,value:/yeso/},g=new B(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const Q=n.items,o=e.get(G);o.set(!1);o.set(!0,Q);const s=new h;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());w.init();const f=r.create(()=>i`
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
