import{b0 as u,b1 as b,b2 as f}from"./web-ifc-api-CwSt8Jc1.js";import{p as g,J as m,m as p}from"./index-K5IA6oiZ.js";import{S as w}from"./stats.min-BpIepu9J.js";import{p as I,C,s as y,i as F,H as L,d as N,u as R,a as h}from"./index-BVLgAR8-.js";const E=document.getElementById("container"),o=new I,O=o.get(C),t=O.create();t.scene=new y(o);t.renderer=new F(o,E);t.camera=new L(o);o.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const x=o.get(N);x.create(t);t.scene.three.background=null;const a=o.get(R),r=o.get(h);await r.setup();const k=[u,b,f];for(const e of k)r.settings.excludedCategories.add(e);r.settings.webIfc.COORDINATE_TO_ORIGIN=!0;async function v(){const n=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),i=new Uint8Array(n),l=await r.load(i);l.name="example",t.scene.three.add(l)}a.onFragmentsLoaded.add(e=>{console.log(e)});function d(e){const n=document.createElement("a");n.href=URL.createObjectURL(e),n.download=e.name,document.body.appendChild(n),n.click(),n.remove()}async function A(){if(!a.groups.size)return;const e=Array.from(a.groups.values())[0],n=a.export(e);d(new File([new Blob([n])],"small.frag"));const i=e.getLocalProperties();i&&d(new File([JSON.stringify(i)],"small.json"))}function B(){a.dispose()}const s=new w;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());g.init();const c=m.create(()=>p`
  <bim-panel active label="IFC Loader Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{v()}}">
        </bim-button>  
            
        <bim-button label="Export fragments"
          @click="${()=>{A()}}">
        </bim-button>  
            
        <bim-button label="Dispose fragments"
          @click="${()=>{B()}}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(c);const T=m.create(()=>p`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
