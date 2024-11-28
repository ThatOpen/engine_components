import"./web-ifc-api-nU1-R_1k.js";import{T as w,L as r,m as i}from"./index-Pmg-1x-J.js";import{S as h}from"./stats.min-GTpOrGrX.js";import{C as v,W as x,S as F,d as I,a as R,G as S,F as C,g as L,l as $,m as k,n as B,H as Q}from"./index-C8rcJyf0.js";import"./_commonjsHelpers-Cpj98o6Y.js";const U=document.getElementById("container"),e=new v,A=e.get(x),t=A.create();t.scene=new F(e);t.renderer=new I(e,U);t.camera=new R(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const E=e.get(S);E.create(t);t.scene.three.background=null;const G=new C(e),M=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),P=await M.arrayBuffer(),T=new Uint8Array(P),c=G.load(T);t.scene.three.add(c);const m=e.get(L),W=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),_=m.getRelationsMapFromJSON(await W.text());m.setRelationMap(c,_);const j=e.get($),n=j.create(),H=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await H.arrayBuffer()],"example"),p=new k(e,{name:"category",inclusive:!1,rules:[]});n.add(p);const u={type:"category",value:/IfcWallStandardCase/};p.rules.push(u);const d={type:"property",name:/.*/,value:/yeso/},g=new B(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const N=n.items,o=e.get(Q);o.set(!1);o.set(!0,N);const a=new h;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());w.init();const f=r.create(()=>i`
  <bim-text-input label="Category" value="${u.value.source}"></bim-text-input>
  `),y=r.create(()=>i`
  <bim-text-input label="Property" value="${d.value.source}"></bim-text-input>
  `),O=async()=>{p.clear(),g.clear(),u.value=new RegExp(f.value),d.value=new RegExp(y.value),await n.update(c.uuid,b);const l=n.items;if(console.log(l),Object.keys(l).length===0){alert("No items found!");return}o.set(!1),o.set(!0,l)},s=r.create(()=>i`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${f}
        ${y}
      
        <bim-button label="Update"
          @click="${async()=>{await O()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const q=r.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(q);
