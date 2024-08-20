import{bd as b,be as u,bf as f}from"./web-ifc-api-CgBULNZm.js";import{d as g,R as m,m as p}from"./index-CqPyogbW.js";import{S as w}from"./stats.min-GTpOrGrX.js";import{o as I,a as y,L,M as C,N,l as E,_ as F,E as R}from"./index-Cbq44wZW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const h=document.getElementById("container"),o=new I,O=o.get(y),t=O.create();t.scene=new L(o);t.renderer=new C(o,h);t.camera=new N(o);o.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const x=o.get(E);x.create(t);t.scene.three.background=null;const a=o.get(F),c=o.get(R);await c.setup();const k=[b,u,f];for(const e of k)c.settings.excludedCategories.add(e);c.settings.webIfc.COORDINATE_TO_ORIGIN=!0;async function v(){const n=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),i=new Uint8Array(n),l=await c.load(i);l.name="example",t.scene.three.add(l)}a.onFragmentsLoaded.add(e=>{console.log(e)});function d(e){const n=document.createElement("a");n.href=URL.createObjectURL(e),n.download=e.name,document.body.appendChild(n),n.click(),n.remove()}async function A(){if(!a.groups.size)return;const e=Array.from(a.groups.values())[0],n=a.export(e);d(new File([new Blob([n])],"small.frag"));const i=e.getLocalProperties();i&&d(new File([JSON.stringify(i)],"small.json"))}function B(){a.dispose()}const s=new w;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";s.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>s.begin());t.renderer.onAfterUpdate.add(()=>s.end());g.init();const r=m.create(()=>p`
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
  `);document.body.append(r);const T=m.create(()=>p`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(T);
