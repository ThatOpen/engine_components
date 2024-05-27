import{k as l,B as c,M as m,C as d,a_ as p,a$ as b}from"./web-ifc-api-BC8YMRiS.js";import{p as u,a,m as r}from"./index-DyM33b1I.js";import{f as h,p as f,s as g,i as w,k as y}from"./index-b4ozRbQy.js";import{S as k}from"./stats.min-GTpOrGrX.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),s=new h,L=s.get(f),e=L.create();e.scene=new g(s);e.renderer=new w(s,v);e.camera=new y(s);s.init();e.scene.three.background=null;const $=new l({color:"#6528D7"}),x=new c,B=new m(x,$);e.scene.three.add(B);e.scene.setup();e.camera.controls.setLookAt(3,3,3,0,0,0);const n=new k;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());u.init();const i=a.create(()=>r`
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
    `);document.body.append(i);const A=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(A);
