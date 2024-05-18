var D=Object.defineProperty;var I=(n,o,e)=>o in n?D(n,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[o]=e;var r=(n,o,e)=>(I(n,typeof o!="symbol"?o+"":o,e),e);import{a as A}from"./web-ifc-api-BFxa4VQ4.js";import{S as B}from"./stats.min-GTpOrGrX.js";import{k as E,C as N,b as T}from"./index-CA2cPfXk.js";import{a as U,E as F,C as G}from"./index-2WRq2SpB.js";import{W as M,S as W,a as L,b as P}from"./index-BSY2u5SV.js";import{G as R}from"./index-5vXSe8tN.js";import{C as b}from"./index-Ci1b-N1U.js";import{F as w}from"./index-CY9ZflN6.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i=class i extends U{constructor(e){super(e);r(this,"enabled",!0);r(this,"height",10);r(this,"groupName","storeys");r(this,"onDisposed",new F);r(this,"list",new Set);e.add(i.uuid,this)}dispose(){this.list.clear(),this.onDisposed.trigger(),this.onDisposed.reset()}set(e){if(!this.enabled)return;const x=this.components.get(b),C=this.components.get(w),S=e?1:-1;let f=0;const c=x.list[this.groupName],g=new A;for(const d in c){g.elements[13]=f*S*this.height;for(const m in c[d]){const h=C.list.get(m),l=d+m,u=this.list.has(l);if(!h||e&&u||!e&&!u)continue;e?this.list.add(l):this.list.delete(l);const k=c[d][m];h.applyTransform(k,g)}f++}}};r(i,"uuid","d260618b-ce88-4c7d-826c-6debb91de3e2");let p=i;const $=document.getElementById("container"),t=new G,j=t.get(M),s=j.create();s.scene=new W(t);s.renderer=new L(t,$);s.camera=new P(t);t.init();s.camera.controls.setLookAt(12,6,8,0,0,-10);s.scene.setup();const q=t.get(R);q.create(s);const v=new w(t),z=await fetch("../../../../../resources/small.frag"),H=await z.arrayBuffer(),J=new Uint8Array(H),y=v.load(J);s.scene.three.add(y);const K=t.get(p),O=t.get(b);O.byStorey(y);E.registerComponents();const Q=N.create(()=>T`
    <bim-panel active label="Classifier Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:n})=>{K.set(n.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(Q);const a=new B;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.right="auto";s.renderer.onBeforeUpdate.add(()=>a.begin());s.renderer.onAfterUpdate.add(()=>a.end());
