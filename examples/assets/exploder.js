var E=Object.defineProperty;var I=(n,o,e)=>o in n?E(n,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[o]=e;var r=(n,o,e)=>(I(n,typeof o!="symbol"?o+"":o,e),e);import{a as k}from"./web-ifc-api-BC8YMRiS.js";import{S as A}from"./stats.min-GTpOrGrX.js";import{p as B,a as N,m as T}from"./index-DyM33b1I.js";import{C as U,E as F,a as G,W as M,S as W,b as L,c as P}from"./index-B99Vyz6D.js";import{G as R}from"./index-vdN6D13n.js";import{C as b}from"./index-zq8_pZ9C.js";import{F as w}from"./index-Cy4SZRUH.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i=class i extends U{constructor(e){super(e);r(this,"enabled",!0);r(this,"height",10);r(this,"groupName","storeys");r(this,"onDisposed",new F);r(this,"list",new Set);e.add(i.uuid,this)}dispose(){this.list.clear(),this.onDisposed.trigger(),this.onDisposed.reset()}set(e){if(!this.enabled)return;const x=this.components.get(b),S=this.components.get(w),C=e?1:-1;let f=0;const c=x.list[this.groupName],g=new k;for(const d in c){g.elements[13]=f*C*this.height;for(const m in c[d]){const h=S.list.get(m),l=d+m,u=this.list.has(l);if(!h||e&&u||!e&&!u)continue;e?this.list.add(l):this.list.delete(l);const D=c[d][m];h.applyTransform(D,g)}f++}}};r(i,"uuid","d260618b-ce88-4c7d-826c-6debb91de3e2");let p=i;const $=document.getElementById("container"),t=new G,j=t.get(M),s=j.create();s.scene=new W(t);s.renderer=new L(t,$);s.camera=new P(t);t.init();s.camera.controls.setLookAt(12,6,8,0,0,-10);s.scene.setup();const q=t.get(R);q.create(s);const v=new w(t),z=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),H=await z.arrayBuffer(),J=new Uint8Array(H),y=v.load(J);s.scene.three.add(y);const K=t.get(p),O=t.get(b);O.byStorey(y);B.init();const Q=N.create(()=>T`
    <bim-panel active label="Exploder Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:n})=>{K.set(n.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(Q);const a=new A;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.right="auto";s.renderer.onBeforeUpdate.add(()=>a.begin());s.renderer.onAfterUpdate.add(()=>a.end());
