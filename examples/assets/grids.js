import{a as c,B as l,b as m,C as b}from"./web-ifc-api-Dlf_dxms.js";import{S as d}from"./stats.min-bmkVNhZk.js";import{p,A as u,e as g,m as h,v,O as f}from"./index-6e07lNWw.js";import{T as w,z as a,m as r}from"./index-DtbylpTq.js";const y=document.getElementById("container"),o=new p,x=o.get(u),e=x.create();e.scene=new g(o);e.renderer=new h(o,y);e.camera=new v(o);o.init();const z=new c(new l,new m({color:"red"}));e.scene.three.add(z);e.scene.three.background=null;const G=o.get(f),i=G.create(e);console.log(i);w.init();const t=a.create(()=>r`
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
    `);document.body.append(t);const k=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{t.classList.contains("options-menu-visible")?t.classList.remove("options-menu-visible"):t.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(k);const s=new d;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());
