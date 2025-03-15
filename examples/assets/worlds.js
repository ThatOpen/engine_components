import{aE as l,aJ as c,$ as m,ad as d}from"./web-ifc-api-CuDRTh9k.js";import{T as p,L as s,m as r}from"./index-C8nqhRYO.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{C as b,W as g,S as h}from"./index-DyluN7yj.js";import{S as y,a as f}from"./simple-renderer-DzfSGNCc.js";import"./_commonjsHelpers-Cpj98o6Y.js";const w=document.getElementById("container"),o=new b,L=o.get(g),e=L.create();e.scene=new y(o);e.renderer=new f(o,w);e.camera=new h(o);o.init();e.scene.setup();e.scene.three.background=null;const v=new l({color:"#6528D7",transparent:!0,opacity:.2}),S=new c,a=new m(S,v);e.scene.three.add(a);a.rotation.x+=Math.PI/4.2;a.rotation.y+=Math.PI/4.2;a.rotation.z+=Math.PI/4.2;a.updateMatrixWorld();e.camera.controls.setLookAt(3,3,3,0,0,0);const n=new u;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());p.init();const i=s.create(()=>r`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:t})=>{e.scene.config.backgroundColor=new d(t.color)}}">
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
    `);document.body.append(i);const x=s.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(x);
