import{B as p,b as u,M as b,C as h}from"./web-ifc-api-D3oDn2HF.js";import{a as w,W as f,S,b as g,G as x}from"./index-DPB0U-mi.js";import{S as v}from"./stats.min-DDrWCSVO.js";import{p as y,J as c,m as d}from"./index-K5IA6oiZ.js";import{R as $,S as C}from"./index-B7gYOE6O.js";const l=document.getElementById("container"),n=new w,E=n.get(f),e=E.create();e.scene=new S(n);e.renderer=new $(n,l);e.camera=new g(n);e.scene.setup();n.init();e.camera.controls.setLookAt(5,5,5,0,0,0);l.appendChild(e.renderer.three2D.domElement);const m=n.get(x);m.config.color.setHex(14540253);m.create(e);const D=new p(3,3,3),M=new u({color:"#6528D7"}),o=new b(D,M);o.position.set(0,1.5,0);e.scene.three.add(o);e.meshes.add(o);e.scene.three.background=new h("white");const t=n.get(C);t.shadowExtraScaleFactor=15;t.shadowOffset=.1;const a="example";t.create([o],a,e);const s=new v;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>s.begin());e.renderer.onAfterUpdate.add(()=>s.end());y.init();const i=c.create(()=>d`
  <bim-panel active label="Shadow dropper Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
          
        <bim-number-input 
          slider label="Extra scale factor" step="1" 
          value="${t.shadowExtraScaleFactor}" min="0" max="20"
          @change="${({target:r})=>{t.shadowExtraScaleFactor=r.value,t.deleteShadow(a),t.create([o],a,e)}}">
        </bim-number-input> 
                  
        <bim-number-input 
          slider label="Amount" step="1" 
          value="${t.amount}" min="0" max="20"
          @change="${({target:r})=>{t.amount=r.value,t.deleteShadow(a),t.create([o],a,e)}}">
        </bim-number-input>    
                       
        <bim-number-input 
          slider label="Shadow offset" step="0.01" 
          value="${t.shadowOffset}" min="0" max="3"
          @change="${({target:r})=>{t.shadowOffset=r.value,t.deleteShadow(a),t.create([o],a,e)}}">
        </bim-number-input> 

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const B=c.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);
