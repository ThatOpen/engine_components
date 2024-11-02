import{B as m,M as p,a as u,C as b}from"./web-ifc-api-DyW6VqW2.js";import{C as h,T as w,e as f,x as g,N as x}from"./index-DYQXApaH.js";import{S as v}from"./stats.min-Bv-3LaW7.js";import{T as S,z as c,m as d}from"./index-DtbylpTq.js";import{n as y,i as $}from"./index-C3aMWf-D.js";const l=document.getElementById("container"),o=new h,C=o.get(w),e=C.create();e.scene=new f(o);e.renderer=new y(o,l);e.camera=new g(o);e.scene.setup();o.init();e.camera.controls.setLookAt(5,5,5,0,0,0);l.appendChild(e.renderer.three2D.domElement);const E=o.get(x),M=E.create(e);M.config.color.setHex(14540253);const T=new m(3,3,3),B=new p({color:"#6528D7"}),n=new u(T,B);n.position.set(0,1.5,0);e.scene.three.add(n);e.meshes.add(n);e.scene.three.background=new b("white");const t=o.get($);t.shadowExtraScaleFactor=15;t.shadowOffset=.1;const a="example";t.create([n],a,e);const s=new v;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());S.init();const i=c.create(()=>d`
  <bim-panel active label="Shadow dropper Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
          
        <bim-number-input 
          slider label="Extra scale factor" step="1" 
          value="${t.shadowExtraScaleFactor}" min="0" max="20"
          @change="${({target:r})=>{t.shadowExtraScaleFactor=r.value,t.deleteShadow(a),t.create([n],a,e)}}">
        </bim-number-input> 
                  
        <bim-number-input 
          slider label="Amount" step="1" 
          value="${t.amount}" min="0" max="20"
          @change="${({target:r})=>{t.amount=r.value,t.deleteShadow(a),t.create([n],a,e)}}">
        </bim-number-input>    
                       
        <bim-number-input 
          slider label="Shadow offset" step="0.01" 
          value="${t.shadowOffset}" min="0" max="3"
          @change="${({target:r})=>{t.shadowOffset=r.value,t.deleteShadow(a),t.create([n],a,e)}}">
        </bim-number-input> 

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const L=c.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(L);
