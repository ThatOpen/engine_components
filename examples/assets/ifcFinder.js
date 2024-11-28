import"./web-ifc-api-nU1-R_1k.js";import{T as w,z as r,m as i}from"./index-BEvRfOoQ.js";import{S as h}from"./stats.min-GTpOrGrX.js";import{C as v,W as x,S as F,d as I,a as R,G as S,F as C,g as $,l as k,m as B,n as L,H as Q}from"./index-C8rcJyf0.js";import"./_commonjsHelpers-Cpj98o6Y.js";const U=document.getElementById("container"),e=new v,z=e.get(x),t=z.create();t.scene=new F(e);t.renderer=new I(e,U);t.camera=new R(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const A=e.get(S);A.create(t);t.scene.three.background=null;const E=new C(e),G=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),M=await G.arrayBuffer(),P=new Uint8Array(M),c=E.load(P);t.scene.three.add(c);const m=e.get($),T=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),W=m.getRelationsMapFromJSON(await T.text());m.setRelationMap(c,W);const _=e.get(k),n=_.create(),j=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await j.arrayBuffer()],"example"),p=new B(e,{name:"category",inclusive:!1,rules:[]});n.add(p);const u={type:"category",value:/IfcWallStandardCase/};p.rules.push(u);const d={type:"property",name:/.*/,value:/yeso/},g=new L(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const H=n.items,o=e.get(Q);o.set(!1);o.set(!0,H);const a=new h;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());w.init();const f=r.create(()=>i`
  <bim-text-input label="Category" value="${u.value.source}"></bim-text-input>
  `),y=r.create(()=>i`
  <bim-text-input label="Property" value="${d.value.source}"></bim-text-input>
  `),N=async()=>{p.clear(),g.clear(),u.value=new RegExp(f.value),d.value=new RegExp(y.value),await n.update(c.uuid,b);const l=n.items;if(console.log(l),Object.keys(l).length===0){alert("No items found!");return}o.set(!1),o.set(!0,l)},s=r.create(()=>i`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${f}
        ${y}
      
        <bim-button label="Update"
          @click="${async()=>{await N()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(s);const O=r.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(O);
