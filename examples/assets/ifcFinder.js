import"./web-ifc-api-CpQ3aV8c.js";import{T as w,z as r,m as i}from"./index-BEvRfOoQ.js";import{S as h}from"./stats.min-GTpOrGrX.js";import{C as v,T as x,s as F,g as R,x as C,L as I,a as L,G as T,W as $,e as k,A,d as B}from"./index-B03kGVBW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),e=new v,U=e.get(x),t=U.create();t.scene=new F(e);t.renderer=new R(e,S);t.camera=new C(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const z=e.get(I);z.create(t);t.scene.three.background=null;const E=new L(e),G=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),W=await G.arrayBuffer(),_=new Uint8Array(W),c=E.load(_);t.scene.three.add(c);const m=e.get(T),j=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),M=m.getRelationsMapFromJSON(await j.text());m.setRelationMap(c,M);const N=e.get($),n=N.create(),O=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await O.arrayBuffer()],"example"),u=new k(e,{name:"category",inclusive:!1,rules:[]});n.add(u);const p={type:"category",value:/IfcWallStandardCase/};u.rules.push(p);const d={type:"property",name:/.*/,value:/yeso/},g=new A(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const P=n.items,o=e.get(B);o.set(!1);o.set(!0,P);const s=new h;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());w.init();const f=r.create(()=>i`
  <bim-text-input label="Category" value="${p.value.source}"></bim-text-input>
  `),y=r.create(()=>i`
  <bim-text-input label="Property" value="${d.value.source}"></bim-text-input>
  `),Q=async()=>{u.clear(),g.clear(),p.value=new RegExp(f.value),d.value=new RegExp(y.value),await n.update(c.uuid,b);const l=n.items;if(console.log(l),Object.keys(l).length===0){alert("No items found!");return}o.set(!1),o.set(!0,l)},a=r.create(()=>i`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${f}
        ${y}
      
        <bim-button label="Update"
          @click="${async()=>{await Q()}}">
        </bim-button>  
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(a);const q=r.create(()=>i`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(q);
