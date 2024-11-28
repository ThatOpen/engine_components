import{af as r,B as l,a as c,C as m}from"./web-ifc-api-nU1-R_1k.js";import{T as d,L as i,m as a}from"./index-Pmg-1x-J.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{C as b,W as u,S as g,d as f,a as h}from"./index-C8rcJyf0.js";import"./_commonjsHelpers-Cpj98o6Y.js";const w=document.getElementById("container"),o=new b,y=o.get(u),e=y.create();e.scene=new g(o);e.renderer=new f(o,w);e.camera=new h(o);o.init();e.scene.setup();e.scene.three.background=null;const L=new r({color:"#6528D7"}),v=new l,C=new c(v,L);e.scene.three.add(C);e.camera.controls.setLookAt(3,3,3,0,0,0);const n=new p;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());d.init();const s=i.create(()=>a`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:t})=>{e.scene.config.backgroundColor=new m(t.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:t})=>{e.scene.config.directionalLight.intensity=t.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:t})=>{e.scene.config.ambientLight.intensity=t.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(s);const S=i.create(()=>a`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);
