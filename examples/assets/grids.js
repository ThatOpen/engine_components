import{a as c,B as l,b as m,C as b}from"./web-ifc-api-CpQ3aV8c.js";import{S as d}from"./stats.min-GTpOrGrX.js";import{C as p,T as u,s as g,g as h,x as f,L as w}from"./index-B03kGVBW.js";import{T as v,z as a,m as r}from"./index-BEvRfOoQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";const y=document.getElementById("container"),o=new p,x=o.get(u),e=x.create();e.scene=new g(o);e.renderer=new h(o,y);e.camera=new f(o);o.init();const z=new c(new l,new m({color:"red"}));e.scene.three.add(z);e.scene.three.background=null;const C=o.get(w),i=C.create(e);console.log(i);v.init();const t=a.create(()=>r`
    <bim-panel label="Grids Tutorial" class="options-menu">

      <bim-panel-section collapsed label="Controls"">
          
        <bim-checkbox label="Grid visible" checked 
          @change="${({target:n})=>{i.config.visible=n.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Grid Color" color="#bbbbbb" 
          @input="${({target:n})=>{i.config.color=new b(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid primary size" value="1" min="0" max="10"
          @change="${({target:n})=>{i.config.primarySize=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid secondary size" value="10" min="0" max="20"
          @change="${({target:n})=>{i.config.secondarySize=n.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(t);const G=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{t.classList.contains("options-menu-visible")?t.classList.remove("options-menu-visible"):t.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(G);const s=new d;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());
