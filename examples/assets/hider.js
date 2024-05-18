var k=Object.defineProperty;var V=(t,s,e)=>s in t?k(t,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[s]=e;var f=(t,s,e)=>(V(t,typeof s!="symbol"?s+"":s,e),e);import"./web-ifc-api-eJ7dR4yy.js";import{S as $}from"./stats.min-GTpOrGrX.js";import{k as A,C as b,b as y}from"./index-CA2cPfXk.js";import{C as B,a as U,W as j,S as q,b as v,c as E}from"./index-BRIP3dnE.js";import{G as F}from"./index-aZ7tPJp1.js";import{C as G}from"./index-12O_c3WE.js";import{F as C}from"./index-DUv5fNdI.js";import{C as I}from"./index-CMiiRoEZ.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./async-event-D8tC9awa.js";const m=class m extends B{constructor(e){super(e);f(this,"enabled",!0);this.components.add(m.uuid,this)}set(e,o){const d=this.components.get(C);if(!o){for(const a in d.list){const r=d.list.get(a);r&&(r.setVisibility(e),this.updateCulledVisibility(r))}return}for(const a in o){const r=o[a],p=d.list.get(a);p&&(p.setVisibility(e,r),this.updateCulledVisibility(p))}}isolate(e){this.set(!1),this.set(!0,e)}updateCulledVisibility(e){const o=this.components.get(I);for(const[d,a]of o.list){const r=a.colorMeshes.get(e.id);r&&(r.count=e.mesh.count)}}};f(m,"uuid","dd9ccf2d-8a21-4821-b7f6-2949add16a29");let u=m;const M=document.getElementById("container"),n=new U,N=n.get(j),i=N.create();i.scene=new q(n);i.renderer=new v(n,M);i.camera=new E(n);n.init();i.camera.controls.setLookAt(12,6,8,0,0,-10);i.scene.setup();const O=n.get(F);O.create(i);const W=new C(n),D=await fetch("../../../../../resources/small.frag"),L=await D.arrayBuffer(),P=new Uint8Array(L),g=W.load(P);i.scene.three.add(g);const w=new u(n),c=new G(n);c.byStorey(g);c.byEntity(g);const x={},R=Object.keys(c.list.storeys);for(const t of R)x[t]=!0;const S={},T=Object.keys(c.list.entities);for(const t of T)S[t]=!0;A.registerComponents();const h=b.create(()=>y`
    <bim-panel active label="Hider Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
      <bim-panel-section fixed name="Floors" style="padding-top: 10px;">
      </bim-panel-section>
      
      <bim-panel-section fixed name="Categories" style="padding-top: 10px;">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(h);const z=h.querySelector("bim-panel-section[name='Floors']"),J=h.querySelector("bim-panel-section[name='Categories']");for(const t in x){const s=b.create(()=>y`
      <bim-checkbox checked label="${t}"
        @change="${({target:e})=>{const o=c.find({storeys:[t]});w.set(e.value,o)}}">
      </bim-checkbox>
    `);z.append(s)}for(const t in S){const s=b.create(()=>y`
      <bim-checkbox checked label="${t}"
        @change="${({target:e})=>{const o=c.find({entities:[t]});w.set(e.value,o)}}">
      </bim-checkbox>
    `);J.append(s)}const l=new $;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";i.renderer.onBeforeUpdate.add(()=>l.begin());i.renderer.onAfterUpdate.add(()=>l.end());
