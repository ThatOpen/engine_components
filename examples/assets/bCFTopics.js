import{bb as I}from"./web-ifc-api-JuXSH2nk.js";import{d as S,R as f,m as w}from"./index-CqPyogbW.js";import{C as F,W as B,S as D,I as P,a as x,F as A,B as E,V as L}from"./index-BICSFNrK.js";import{S as M,a as R,G as T}from"./index-M03DNf7F.js";import"./_commonjsHelpers-Cpj98o6Y.js";S.init();const e=new F,j=e.get(B),n=j.create(),u=new M(e);u.setup();n.scene=u;n.scene.three.add(new I(10));const s=document.createElement("bim-viewport"),b=new R(e,s);n.renderer=b;const g=new D(e);n.camera=g;s.addEventListener("resize",()=>{b.resize(),g.updateAspect()});const l=document.createElement("bim-grid");l.floating=!0;s.append(l);const G=e.get(T);G.create(n);e.init();const y=e.get(P);await y.setup();const V=e.get(x),k=e.get(A);k.onFragmentsLoaded.add(async t=>{n.scene.three.add(t),t.hasProperties&&await V.process(t);for(const o of t.items)n.meshes.add(o.mesh)});const W=async t=>{const o=[];for(const i of t){const r=await(await fetch(i)).arrayBuffer(),c=new Uint8Array(r),m=await y.load(c);o.push(m)}return o},z=await W(["https://thatopen.github.io/engine_components/resources/small.ifc"]),H=z[0],a=e.get(E);a.setup({types:new Set([...a.config.types,"Information","Coordination"]),statuses:new Set(["Active","In Progress","Done","In Review","Closed"]),users:new Set(["juan.hoyos4@gmail.com"])});const U=e.get(L);l.layouts={main:{template:`
      "empty topicPanel" 1fr
      /1fr 22rem
    `,elements:{}}};const $=async t=>{const o={viewpoints:[],topics:[]};for(const i of t){const r=await(await fetch(i)).arrayBuffer(),{viewpoints:c,topics:m}=await a.load(new Uint8Array(r),n);o.viewpoints.push(...c),o.topics.push(...m)}return o};await $([]);const p=a.create({title:"Missing information",description:"It seems these elements are badly defined.",dueDate:new Date("08-01-2020"),type:"Clash",priority:"Major",stage:"Design",labels:new Set(["Architecture","Cost Estimation"]),assignedTo:"juan.hoyos4@gmail.com"}),d=U.create(n,{title:"Custom Viewpoint"});d.addComponentsFromMap(H.getFragmentMap([186]));p.viewpoints.add(d.guid);const h=p.createComment("What if we talk about this next meeting?");h.author="juan.hoyos4@gmail.com";p.createComment("Hi there! I agree.");h.viewpoint=d;const N=f.create(()=>w`
   <bim-panel>
    <bim-panel-section label="Viewpoints">
      <!-- viewpointsListElement -->
    </bim-panel-section>
   </bim-panel>
  `),_=f.create(()=>w`
   <bim-panel>
    <bim-panel-section label="Topics">
      <div style="display: flex; gap: 0.25rem">
        <bim-button label="Download" icon="tabler:download" @click=${async()=>{}}></bim-button>
        <!-- <bim-button style="flex: 0;" label="New Topic" icon="mi:add" @click=${()=>{}}></bim-button> -->
      </div>
      <!-- topicsList -->
    </bim-panel-section>
   </bim-panel>
  `),v=document.getElementById("app");v.layouts={main:{template:`
      "leftPanel viewport" 2fr
      "leftPanel bottomPanel" 1fr
      / 25rem 1fr
    `,elements:{leftPanel:N,viewport:s,bottomPanel:_}}};v.layout="main";
