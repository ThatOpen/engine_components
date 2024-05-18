import{m as o,B as r,M as a,C as s,D as c,A as l}from"./web-ifc-api-eJ7dR4yy.js";import{k as m,C as p,b}from"./index-CA2cPfXk.js";import{a as d,W as u,S as h,b as g,c as f}from"./index-BRIP3dnE.js";const w=document.getElementById("container"),i=new d,y=i.get(u),e=y.create();e.scene=new h(i);e.renderer=new g(i,w);e.camera=new f(i);i.init();const x=new o({color:"#6528D7"}),C=new r,k=new a(C,x);e.scene.three.add(k);e.scene.setup();e.camera.controls.setLookAt(3,3,3,0,0,0);m.registerComponents();const v=p.create(()=>b`
    <bim-panel label="Worlds Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section style="padding-top: 10px">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:n})=>{e.scene.three.background=new s(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:n})=>{for(const t of e.scene.three.children)t instanceof c&&(t.intensity=n.value)}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:n})=>{for(const t of e.scene.three.children)t instanceof l&&(t.intensity=n.value)}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(v);
