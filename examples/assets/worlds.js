import{k as a,B as r,M as s,C as c,a_ as l,a$ as m}from"./web-ifc-api-BC8YMRiS.js";import{p,a as d,m as b}from"./index-DyM33b1I.js";import{f as u,p as f,s as h,i as g,k as w}from"./index-BmA4XTIx.js";import{S as y}from"./stats.min-GTpOrGrX.js";import"./_commonjsHelpers-Cpj98o6Y.js";const x=document.getElementById("container"),o=new u,k=o.get(f),e=k.create();e.scene=new h(o);e.renderer=new g(o,x);e.camera=new w(o);o.init();const v=new a({color:"#6528D7"}),B=new r,$=new s(B,v);e.scene.three.add($);e.scene.setup();e.camera.controls.setLookAt(3,3,3,0,0,0);p.init();const A=d.create(()=>b`
    <bim-panel label="Worlds Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section >
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:n})=>{e.scene.three.background=new c(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:n})=>{for(const t of e.scene.three.children)t instanceof l&&(t.intensity=n.value)}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:n})=>{for(const t of e.scene.three.children)t instanceof m&&(t.intensity=n.value)}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(A);const i=new y;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";e.renderer.onBeforeUpdate.add(()=>i.begin());e.renderer.onAfterUpdate.add(()=>i.end());
