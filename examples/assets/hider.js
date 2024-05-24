var k=Object.defineProperty;var V=(t,s,e)=>s in t?k(t,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[s]=e;var f=(t,s,e)=>(V(t,typeof s!="symbol"?s+"":s,e),e);import"./web-ifc-api-BC8YMRiS.js";import{S as $}from"./stats.min-GTpOrGrX.js";import{p as A,a as b,m as h}from"./index-DyM33b1I.js";import{C as B,a as U,W as j,S as q,b as v,c as E}from"./index-B99Vyz6D.js";import{G as F}from"./index-vdN6D13n.js";import{C as G}from"./index-zq8_pZ9C.js";import{F as w}from"./index-Cy4SZRUH.js";import{C as I}from"./index-CQ204xoG.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./async-event-D8tC9awa.js";const m=class m extends B{constructor(e){super(e);f(this,"enabled",!0);this.components.add(m.uuid,this)}set(e,o){const d=this.components.get(w);if(!o){for(const c in d.list){const a=d.list.get(c);a&&(a.setVisibility(e),this.updateCulledVisibility(a))}return}for(const c in o){const a=o[c],p=d.list.get(c);p&&(p.setVisibility(e,a),this.updateCulledVisibility(p))}}isolate(e){this.set(!1),this.set(!0,e)}updateCulledVisibility(e){const o=this.components.get(I);for(const[d,c]of o.list){const a=c.colorMeshes.get(e.id);a&&(a.count=e.mesh.count)}}};f(m,"uuid","dd9ccf2d-8a21-4821-b7f6-2949add16a29");let u=m;const M=document.getElementById("container"),n=new U,N=n.get(j),i=N.create();i.scene=new q(n);i.renderer=new v(n,M);i.camera=new E(n);n.init();i.camera.controls.setLookAt(12,6,8,0,0,-10);i.scene.setup();const O=n.get(F);O.create(i);const W=new w(n),D=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),L=await D.arrayBuffer(),P=new Uint8Array(L),y=W.load(P);i.scene.three.add(y);const x=new u(n),r=new G(n);r.byStorey(y);r.byEntity(y);const C={},R=Object.keys(r.list.storeys);for(const t of R)C[t]=!0;const S={},T=Object.keys(r.list.entities);for(const t of T)S[t]=!0;A.init();const g=b.create(()=>h`
    <bim-panel active label="Hider Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
      <bim-panel-section fixed name="Floors" style="padding-top: 10px;">
      </bim-panel-section>
      
      <bim-panel-section fixed name="Categories" style="padding-top: 10px;">
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(g);const z=g.querySelector("bim-panel-section[name='Floors']"),J=g.querySelector("bim-panel-section[name='Categories']");for(const t in C){const s=b.create(()=>h`
      <bim-checkbox checked label="${t}"
        @change="${({target:e})=>{const o=r.find({storeys:[t]});x.set(e.value,o)}}">
      </bim-checkbox>
    `);z.append(s)}for(const t in S){const s=b.create(()=>h`
      <bim-checkbox checked label="${t}"
        @change="${({target:e})=>{const o=r.find({entities:[t]});x.set(e.value,o)}}">
      </bim-checkbox>
    `);J.append(s)}const l=new $;l.showPanel(2);document.body.append(l.dom);l.dom.style.left="0px";i.renderer.onBeforeUpdate.add(()=>l.begin());i.renderer.onAfterUpdate.add(()=>l.end());
