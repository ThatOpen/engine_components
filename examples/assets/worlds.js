import{Z as p,B as u,a as b,d as g,av as f,e as w,f as y,L as h,w as L,V as v,C}from"./web-ifc-api-CKmHUvxw.js";import{T as S,L as l,m as c}from"./index-ByMLC5eT.js";import{S as x}from"./stats.min-GTpOrGrX.js";import{C as B,W as M,S as A}from"./index-BGVa1Y3B.js";import{S as k,a as D}from"./simple-renderer-CKpUJy5R.js";import"./_commonjsHelpers-Cpj98o6Y.js";const I=document.getElementById("container"),n=new B,P=n.get(M),e=P.create();e.scene=new k(n);e.renderer=new D(n,I);e.camera=new A(n);n.init();e.scene.setup();e.scene.three.background=null;const U=new p({color:"#6528D7",transparent:!0,opacity:.2}),G=new u,t=new b(G,U);e.scene.three.add(t);t.rotation.x+=Math.PI/4.2;t.rotation.y+=Math.PI/4.2;t.rotation.z+=Math.PI/4.2;t.updateMatrixWorld();const W=new Float32Array(3e5),r=new g(W,3,!1);r.setUsage(f);const m=new w;m.setAttribute("position",r);const i=new y(m,new h({color:"red",linewidth:.001}));i.frustumCulled=!1;e.scene.three.add(i);const $=new L(new v(0,0,1),0),d=n.get(void 0);d.plane=$;const{index:T}=d.generate({meshes:[t],posAttr:r});i.geometry.setDrawRange(0,T);r.needsUpdate=!0;console.log(i);e.camera.controls.setLookAt(3,3,3,0,0,0);const o=new x;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());S.init();const a=l.create(()=>c`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:s})=>{e.scene.config.backgroundColor=new C(s.color)}}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({target:s})=>{e.scene.config.directionalLight.intensity=s.value}}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({target:s})=>{e.scene.config.ambientLight.intensity=s.value}}">
        </bim-number-input>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(a);const z=l.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(z);
