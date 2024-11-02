import"./web-ifc-api-DyW6VqW2.js";import{T as w,z as r,m as i}from"./index-DtbylpTq.js";import{S as h}from"./stats.min-Bv-3LaW7.js";import{C as v,T as x,e as R,m as F,x as B,N as C,a as I,b as L,h as T,R as $,j as k,L as N}from"./index-DYQXApaH.js";const S=document.getElementById("container"),e=new v,U=e.get(x),t=U.create();t.scene=new R(e);t.renderer=new F(e,S);t.camera=new B(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const j=e.get(C);j.create(t);t.scene.three.background=null;const z=new I(e),A=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),E=await A.arrayBuffer(),_=new Uint8Array(E),c=z.load(_);t.scene.three.add(c);const m=e.get(L),M=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),O=m.getRelationsMapFromJSON(await M.text());m.setRelationMap(c,O);const P=e.get(T),n=P.create(),Q=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await Q.arrayBuffer()],"example"),u=new $(e,{name:"category",inclusive:!1,rules:[]});n.add(u);const p={type:"category",value:/IfcWallStandardCase/};u.rules.push(p);const d={type:"property",name:/.*/,value:/yeso/},g=new k(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const q=n.items,o=e.get(N);o.set(!1);o.set(!0,q);const s=new h;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());w.init();const f=r.create(()=>i`
  <bim-text-input label="Category" value="${p.value.source}"></bim-text-input>
  `),y=r.create(()=>i`
  <bim-text-input label="Property" value="${d.value.source}"></bim-text-input>
  `),G=async()=>{u.clear(),g.clear(),p.value=new RegExp(f.value),d.value=new RegExp(y.value),await n.update(c.uuid,b);const l=n.items;if(console.log(l),Object.keys(l).length===0){alert("No items found!");return}o.set(!1),o.set(!0,l)},a=r.create(()=>i`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${f}
        ${y}
      
        <bim-button label="Update"
          @click="${async()=>{await G()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(a);const J=r.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(J);
