import{k as l,B as c,M as m,C as d,a_ as p,a$ as b}from"./web-ifc-api-BffFJDIm.js";import{p as u,a,m as r}from"./index-DyM33b1I.js";import{p as h,C as f,i as g,n as w,k as y}from"./index-D43g96vP.js";import{S as k}from"./stats.min-GTpOrGrX.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),i=new h,L=i.get(f),e=L.create();e.scene=new g(i);e.renderer=new w(i,v);e.camera=new y(i);i.init();e.scene.three.background=null;const C=new l({color:"#6528D7"}),$=new c,x=new m($,C);e.scene.three.add(x);e.scene.setup();e.camera.controls.setLookAt(3,3,3,0,0,0);const n=new k;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());u.init();const s=a.create(()=>r`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:t})=>{e.scene.three.background=new d(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:t})=>{for(const o of e.scene.three.children)o instanceof p&&(o.intensity=t.value)}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:t})=>{for(const o of e.scene.three.children)o instanceof b&&(o.intensity=t.value)}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const B=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);
