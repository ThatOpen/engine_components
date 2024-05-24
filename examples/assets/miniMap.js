import{C as c}from"./web-ifc-api-BC8YMRiS.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{p as l,a as p,m as d}from"./index-DyM33b1I.js";import{f as b,p as u,s as f,i as g,k as h,N as x,u as w,h as y}from"./index-BmA4XTIx.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),a=new b,v=a.get(u),n=v.create();n.scene=new f(a);n.renderer=new g(a,k);n.camera=new h(a);n.scene.setup();a.init();const z=a.get(x);z.create(n);n.camera.controls.setLookAt(1,2,-2,-2,0,-5);const $=new w(a),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),B=await S.arrayBuffer(),C=new Uint8Array(B),E=$.load(C);n.scene.three.add(E);const A=new y(a),t=A.create(n),R=document.getElementById("minimap"),s=t.renderer.domElement;s.style.borderRadius="12px";R.append(s);l.init();const r=t.getSize(),U=p.create(()=>d`
    <bim-panel label="Minimap Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section >
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({target:e})=>{t.enabled=e.value}}">  
        </bim-checkbox>
        
        <bim-checkbox label="Lock rotation" 
          @change="${({target:e})=>{t.lockRotation=e.value}}">  
        </bim-checkbox>
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:e})=>{n.scene.three.background=new c(e.color)}}">
        </bim-color-input>
        
        
        <bim-number-input 
          slider label="Zoom" value="${t.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({target:e})=>{t.frontOffset=e.value}}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${r.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({target:e})=>{const o=t.getSize();o.x=e.value,t.resize(o)}}">
          </bim-number-input>        
        
          <bim-number-input slider value="${r.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({target:e})=>{const o=t.getSize();o.y=e.value,t.resize(o)}}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(U);const i=new m;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";n.renderer.onBeforeUpdate.add(()=>i.begin());n.renderer.onAfterUpdate.add(()=>i.end());
