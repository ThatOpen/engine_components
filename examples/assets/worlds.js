import{a6 as l,B as c,a as m,C as d,D as b,A as p}from"./web-ifc-api-Du2rJhcJ.js";import{m as u,t as a,a as r}from"./index-tywNknxv.js";import{p as h,C as f,o as g,r as w,W as y}from"./index-BPLzurvS.js";import{S as v}from"./stats.min-BpIepu9J.js";const L=document.getElementById("container"),s=new h,C=s.get(f),e=C.create();e.scene=new g(s);e.renderer=new w(s,L);e.camera=new y(s);s.init();e.scene.three.background=null;const k=new l({color:"#6528D7"}),x=new c,A=new m(x,k);e.scene.three.add(A);e.scene.setup();e.camera.controls.setLookAt(3,3,3,0,0,0);const n=new v;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());u.init();const i=a.create(()=>r`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:t})=>{e.scene.three.background=new d(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:t})=>{for(const o of e.scene.three.children)o instanceof b&&(o.intensity=t.value)}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:t})=>{for(const o of e.scene.three.children)o instanceof p&&(o.intensity=t.value)}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const B=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);
