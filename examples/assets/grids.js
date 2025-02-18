import{a as l,B as c,b as m,C as d}from"./web-ifc-api-r1ed24cU.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{C as p,W as u,S as g,d as f,a as h,G as w}from"./index-4oEgnBmA.js";import{T as v,L as r,m as a}from"./index-ByMLC5eT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const y=document.getElementById("container"),o=new p,S=o.get(u),e=S.create();e.scene=new g(o);e.renderer=new f(o,y);e.camera=new h(o);o.init();const G=new l(new c,new m({color:"red"}));e.scene.three.add(G);e.scene.three.background=null;const x=o.get(w),s=x.create(e);console.log(s);v.init();const t=r.create(()=>a`
    <bim-panel label="Grids Tutorial" class="options-menu">

      <bim-panel-section collapsed label="Controls"">
          
        <bim-checkbox label="Grid visible" checked 
          @change="${({target:n})=>{s.config.visible=n.value}}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Grid Color" color="#bbbbbb" 
          @input="${({target:n})=>{s.config.color=new d(n.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid primary size" value="1" min="0" max="10"
          @change="${({target:n})=>{s.config.primarySize=n.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid secondary size" value="10" min="0" max="20"
          @change="${({target:n})=>{s.config.secondarySize=n.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(t);const C=r.create(()=>a`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{t.classList.contains("options-menu-visible")?t.classList.remove("options-menu-visible"):t.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);const i=new b;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";i.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>i.begin());e.renderer.onAfterUpdate.add(()=>i.end());
