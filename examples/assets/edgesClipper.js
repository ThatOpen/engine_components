import{B as h,b as w,M as c,d as s,L as d}from"./web-ifc-api-BC8YMRiS.js";import{S as M}from"./stats.min-GTpOrGrX.js";import{p as g,a as f,m as x}from"./index-DyM33b1I.js";import{f as y,p as k,s as P,k as v,N as B,H as C,m as $}from"./index-BmA4XTIx.js";import{C as E,E as I}from"./index-G1IrRYgc.js";import{P as D}from"./index-DKqERfnq.js";import"./import-wrapper-prod-LhqN7JJy.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./renderer-with-2d-k8_K2aYf.js";const p=document.getElementById("container"),a=new y,L=a.get(k),e=L.create();e.scene=new P(a);e.renderer=new D(a,p);e.camera=new v(a);e.renderer.postproduction.enabled=!0;e.renderer.postproduction.customEffects.outlineEnabled=!0;a.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const b=a.get(B);b.config.color.setHex(6710886);const S=b.create(e);e.renderer.postproduction.customEffects.excludedMeshes.push(S.three);const m=new h(3,3,3),u=new w({color:"#6528D7"}),n=new c(m,u);n.position.set(-2,1.5,0);e.scene.three.add(n);e.meshes.add(n);const l=new c(m,u);l.position.set(2,1.5,0);e.scene.three.add(l);e.meshes.add(l);const z=a.get(C);z.get(e);const o=a.get($);o.enabled=!0;const r=a.get(E);o.Type=I;const A=new s({color:"lightblue",side:2}),H=new d({color:"blue"}),O=new s({color:"blue",opacity:.5,side:2,transparent:!0});r.styles.create("Red lines",new Set([n]),e,H,A,O);const R=new s({color:"salmon",side:2}),F=new d({color:"red"}),G=new s({color:"red",opacity:.5,side:2,transparent:!0});r.styles.create("Blue lines",new Set([l]),e,F,R,G);p.ondblclick=()=>o.create(e);window.onkeydown=t=>{(t.code==="Delete"||t.code==="Backspace")&&o.delete(e)};const i=new M;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";e.renderer.onBeforeUpdate.add(()=>i.begin());e.renderer.onAfterUpdate.add(()=>i.end());g.init();const N=f.create(()=>x`
    <bim-panel label="Clipper Tutorial" style="position: fixed; top: 5px; right: 5px" active>
          <bim-panel-section fixed label="Commands" >
      
        <bim-label label="Double click: Create clipping plane"></bim-label>
        <bim-label label="Delete key: Delete clipping plane"></bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section fixed label="Others" >
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({target:t})=>{o.enabled=t.value,r.visible=t.value}}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({target:t})=>{o.visible=t.value}}">
        </bim-checkbox>   
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({target:t})=>{o.material.color.set(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({target:t})=>{o.material.opacity=t.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({target:t})=>{o.size=t.value}}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${()=>{o.deleteAll()}}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cubes" 
          @click="${()=>{n.rotation.x=2*Math.PI*Math.random(),n.rotation.y=2*Math.PI*Math.random(),n.rotation.z=2*Math.PI*Math.random(),n.updateMatrixWorld(),l.rotation.x=2*Math.PI*Math.random(),l.rotation.y=2*Math.PI*Math.random(),l.rotation.z=2*Math.PI*Math.random(),l.updateMatrixWorld(),r.update(!0)}}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(N);
