import{bp as b,bq as u,br as f}from"./web-ifc-api-Dxv4iFj4.js";import{T as g,z as m,m as p}from"./index-DtbylpTq.js";import{S as w}from"./stats.min-DYv0AsOH.js";import{C as I,T as C,e as y,m as N,U as F,O as L,a as O,N as h}from"./index-2dtfnFEV.js";const E=document.getElementById("container"),o=new I,R=o.get(C),t=R.create();t.scene=new y(o);t.renderer=new N(o,E);t.camera=new F(o);o.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const T=o.get(L);T.create(t);t.scene.three.background=null;const a=o.get(O),i=o.get(h);await i.setup();const x=[b,u,f];for(const e of x)i.settings.excludedCategories.add(e);i.settings.webIfc.COORDINATE_TO_ORIGIN=!0;async function k(){const n=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),r=new Uint8Array(n),l=await i.load(r);l.name="example",t.scene.three.add(l)}a.onFragmentsLoaded.add(e=>{console.log(e)});function d(e){const n=document.createElement("a");n.href=URL.createObjectURL(e),n.download=e.name,document.body.appendChild(n),n.click(),n.remove()}async function v(){if(!a.groups.size)return;const e=Array.from(a.groups.values())[0],n=a.export(e);d(new File([new Blob([n])],"small.frag"));const r=e.getLocalProperties();r&&d(new File([JSON.stringify(r)],"small.json"))}function A(){a.dispose()}const s=new w;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());g.init();const c=m.create(()=>p`
  <bim-panel active label="IFC Loader Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{k()}}">
        </bim-button>  
            
        <bim-button label="Export fragments"
          @click="${()=>{v()}}">
        </bim-button>  
            
        <bim-button label="Dispose fragments"
          @click="${()=>{A()}}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(c);const U=m.create(()=>p`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{c.classList.contains("options-menu-visible")?c.classList.remove("options-menu-visible"):c.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);
