import{B as u,b as h,M as c,d as r,L as d}from"./web-ifc-api-CmZKgq4q.js";import{S as w}from"./stats.min-GTpOrGrX.js";import{k as g,C as M,b as y}from"./index-CA2cPfXk.js";import{f as x,p as k,s as f,i as P,k as v,N as C,H as B,m as I}from"./import-wrapper-prod-Cl9qVCJR.js";import{C as $,E as D}from"./index-Du92Rlr0.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CINZ6ccg.js";import"./renderer-with-2d-RJhD6QVJ.js";const b=document.getElementById("container"),n=new x,L=n.get(k),e=L.create();e.scene=new f(n);e.renderer=new P(n,b);e.camera=new v(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const S=n.get(C);S.create(e);const p=new u(3,3,3),m=new h({color:"#6528D7"}),o=new c(p,m);o.position.set(-2,1.5,0);e.scene.three.add(o);e.meshes.add(o);const l=new c(p,m);l.position.set(2,1.5,0);e.scene.three.add(l);e.meshes.add(l);const z=n.get(B);z.get(e);const a=n.get(I);a.enabled=!0;const s=n.get($);a.Type=D;const E=new r({color:"lightblue",side:2}),A=new d({color:"blue"}),O=new r({color:"red",opacity:.2,side:2,transparent:!0});s.styles.create("Red lines",new Set([o]),e,A,E,O);const F=new r({color:"salmon",side:2}),G=new d({color:"red"}),H=new r({color:"red",opacity:.2,side:2,transparent:!0});s.styles.create("Blue lines",new Set([l]),e,G,F,H);b.ondblclick=()=>a.create(e);window.onkeydown=t=>{(t.code==="Delete"||t.code==="Backspace")&&a.delete(e)};const i=new w;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";e.renderer.onBeforeUpdate.add(()=>i.begin());e.renderer.onAfterUpdate.add(()=>i.end());g.registerComponents();const N=M.create(()=>y`
    <bim-panel label="Clipper Tutorial" style="position: fixed; top: 5px; right: 5px" active>
          <bim-panel-section fixed label="Commands" style="padding-top: 10px">
      
        <bim-label label="Double click: Create clipping plane"></bim-label>
        <bim-label label="Delete key: Delete clipping plane"></bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section fixed label="Others" style="padding-top: 10px">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({target:t})=>{a.enabled=t.value,s.visible=t.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({target:t})=>{a.visible=t.value}}">
        </bim-checkbox>   
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:t})=>{a.material.color.set(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({target:t})=>{a.material.opacity=t.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({target:t})=>{a.size=t.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${()=>{a.deleteAll()}}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cubes" 
          @click="${()=>{o.rotation.x=2*Math.PI*Math.random(),o.rotation.y=2*Math.PI*Math.random(),o.rotation.z=2*Math.PI*Math.random(),o.updateMatrixWorld(),l.rotation.x=2*Math.PI*Math.random(),l.rotation.y=2*Math.PI*Math.random(),l.rotation.z=2*Math.PI*Math.random(),l.updateMatrixWorld(),s.update(!0)}}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(N);
