import"./web-ifc-api-Df2dhA4n.js";import{T as w,z as r,m as i}from"./index-DtbylpTq.js";import{S as h}from"./stats.min-GTpOrGrX.js";import{C as v,T as x,e as F,m as k,x as R,y as C,a as I,G as T,k as $,g as A,A as B,D as L}from"./index-CC2Loeen.js";import"./_commonjsHelpers-Cpj98o6Y.js";const S=document.getElementById("container"),e=new v,U=e.get(x),t=U.create();t.scene=new F(e);t.renderer=new k(e,S);t.camera=new R(e);e.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const z=e.get(C);z.create(t);t.scene.three.background=null;const E=new I(e),G=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),_=await G.arrayBuffer(),j=new Uint8Array(_),c=E.load(j);t.scene.three.add(c);const d=e.get(T),D=await fetch("https://thatopen.github.io/engine_components/resources/small-relations.json"),M=d.getRelationsMapFromJSON(await D.text());d.setRelationMap(c,M);const N=e.get($),n=N.create(),O=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),b=new File([await O.arrayBuffer()],"example"),u=new A(e,{name:"category",inclusive:!1,rules:[]});n.add(u);const p={type:"category",value:/IfcWallStandardCase/};u.rules.push(p);const m={type:"property",name:/.*/,value:/yeso/},g=new B(e,{name:"property",inclusive:!1,rules:[m]});n.add(g);await n.update(c.uuid,b);const P=n.items,o=e.get(L);o.set(!1);o.set(!0,P);const s=new h;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());w.init();const y=r.create(()=>i`
  <bim-text-input label="Category" value="${p.value.source}"></bim-text-input>
  `),f=r.create(()=>i`
  <bim-text-input label="Property" value="${m.value.source}"></bim-text-input>
  `),Q=async()=>{u.clear(),g.clear(),p.value=new RegExp(y.value),m.value=new RegExp(f.value),await n.update(c.uuid,b);const l=n.items;if(console.log(l),Object.keys(l).length===0){alert("No items found!");return}o.set(!1),o.set(!0,l)},a=r.create(()=>i`
  <bim-panel active label="IFC Finder Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        ${y}
        ${f}
      
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
