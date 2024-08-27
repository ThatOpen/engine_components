import{B as p,M as u,a as b,C as h}from"./web-ifc-api-CgBULNZm.js";import{o as w,a as f,L as g,N as x,l as v}from"./index-c9A1IUGD.js";import{S}from"./stats.min-GTpOrGrX.js";import{d as y,R as c,m as l}from"./index-CqPyogbW.js";import{X as $,b as E}from"./index-UqY4hWbC.js";import"./_commonjsHelpers-Cpj98o6Y.js";const d=document.getElementById("container"),o=new w,L=o.get(f),e=L.create();e.scene=new g(o);e.renderer=new $(o,d);e.camera=new x(o);e.scene.setup();o.init();e.camera.controls.setLookAt(5,5,5,0,0,0);d.appendChild(e.renderer.three2D.domElement);const m=o.get(v);m.config.color.setHex(14540253);m.create(e);const M=new p(3,3,3),B=new u({color:"#6528D7"}),n=new b(M,B);n.position.set(0,1.5,0);e.scene.three.add(n);e.meshes.add(n);e.scene.three.background=new h("white");const t=o.get(E);t.shadowExtraScaleFactor=15;t.shadowOffset=.1;const a="example";t.create([n],a,e);const s=new S;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());y.init();const i=c.create(()=>l`
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
    `);document.body.append(i);const C=c.create(()=>l`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);
