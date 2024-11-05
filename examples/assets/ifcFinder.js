import"./web-ifc-api-BlC6WGhG.js";import{T as w,z as r,m as i}from"./index-DtbylpTq.js";import{S as h}from"./stats.min-ClRtqrR4.js";import{C as v,T as x,e as F,m as R,x as C,N as I,a as T,G as $,z as k,g as z,A,D as B}from"./index-D5jRLLPO.js";const L=document.getElementById("container"),e=new v,N=e.get(x),t=N.create();t.scene=new F(e);t.renderer=new R(e,L);t.camera=new C(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const S=e.get(I);S.create(t);t.scene.three.background=null;const U=new T(e),E=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),G=await E.arrayBuffer(),_=new Uint8Array(G),c=U.load(_);t.scene.three.add(c);const m=e.get($),j=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),D=m.getRelationsMapFromJSON(await j.text());m.setRelationMap(c,D);const M=e.get(k),n=M.create(),O=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await O.arrayBuffer()],"example"),u=new z(e,{name:"category",inclusive:!1,rules:[]});n.add(u);const p={type:"category",value:/IfcWallStandardCase/};u.rules.push(p);const d={type:"property",name:/.*/,value:/yeso/},g=new A(e,{name:"property",inclusive:!1,rules:[d]});n.add(g);await n.update(c.uuid,b);const P=n.items,o=e.get(B);o.set(!1);o.set(!0,P);const s=new h;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());w.init();const f=r.create(()=>i`
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
