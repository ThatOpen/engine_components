import{at as c}from"./web-ifc-api-D3oDn2HF.js";import{S as l}from"./stats.min-DDrWCSVO.js";import{p as m,J as a,m as r}from"./index-K5IA6oiZ.js";import{a as d,W as p,S as b,c as u,b as f,G as g,F as h,n as w,e as y}from"./index-DPB0U-mi.js";const S=document.getElementById("container"),t=new d,x=t.get(p),e=x.create();e.scene=new b(t);e.renderer=new u(t,S);e.camera=new f(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const C=t.get(g);C.create(e);e.scene.three.background=null;const E=new h(t),I=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),L=await I.arrayBuffer(),v=new Uint8Array(L),s=E.load(v);e.scene.three.add(s);const A=await fetch("https://thatopen.github.io/engine_components/resources/small.json");s.setLocalProperties(await A.json());const k=t.get(w),R=t.get(y);R.byIfcRel(s,c,"storeys");const n=new l;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());m.init();const o=a.create(()=>r`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({target:i})=>{k.set(i.value)}}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(o);const T=a.create(()=>r`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{o.classList.contains("options-menu-visible")?o.classList.remove("options-menu-visible"):o.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
