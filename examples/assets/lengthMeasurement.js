import{B as s,b as c,M as r}from"./web-ifc-api-BiYij3qq.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{f as b,p as d,s as p,k as u,N as h}from"./index-B3b_h8A8.js";import{p as w,a as f,m as k}from"./index-DyM33b1I.js";import"./import-wrapper-prod-vMwJRSad.js";import{P as x}from"./index-Cb-lnTew.js";import{L as D}from"./index-Bn2R_Puk.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./renderer-with-2d-Dwkf_fcQ.js";import"./index-Csb2AJ1X.js";import"./mark-B9TqPH3U.js";import"./dimension-mark-BiAWnjiH.js";import"./graphic-vertex-picker-C182o4t3.js";const l=document.getElementById("container"),t=new b,g=t.get(d),e=g.create();e.scene=new p(t);e.renderer=new x(t,l);e.camera=new u(t);t.init();e.camera.controls.setLookAt(5,5,5,0,0,0);e.scene.setup();const y=t.get(h);y.create(e);const M=new s(3,3,3),B=new c({color:"#6528D7"}),a=new r(M,B);a.position.set(0,1.5,0);e.scene.three.add(a);e.meshes.add(a);const o=new D(t);o.world=e;o.enabled=!0;o.snapDistance=1;l.ondblclick=()=>o.create();window.onkeydown=n=>{(n.code==="Delete"||n.code==="Backspace")&&o.delete()};const i=new m;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";e.renderer.onBeforeUpdate.add(()=>i.begin());e.renderer.onAfterUpdate.add(()=>i.end());w.init();const $=f.create(()=>k`
    <bim-panel active label="Exploder Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
        <bim-panel-section fixed label="Commands" >
          <bim-label label="Create dimension: Double click"></bim-label>  
          <bim-label label="Delete dimension: Delete"></bim-label>  
        </bim-checkbox>  

      </bim-panel-section>
      
      <bim-panel-section fixed label="Others">
        <bim-checkbox checked label="Dimensions enabled" 
          @change="${({target:n})=>{o.enabled=n.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Dimensions visible" 
          @change="${({target:n})=>{o.visible=n.value}}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Dimensions Color" color="#202932" 
          @input="${({target:n})=>{o.color.set(n.color)}}">
        </bim-color-input>
        
        <bim-button label="Delete all"
          @click="${()=>{o.deleteAll()}}">
        </bim-button>

      </bim-panel-section>
    </bim-panel>
    `);document.body.append($);
