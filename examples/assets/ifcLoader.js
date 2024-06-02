import{aX as u,aY as b,aZ as f}from"./web-ifc-api-BffFJDIm.js";import{p as g,a as m,m as p}from"./index-DyM33b1I.js";import{S as w}from"./stats.min-GTpOrGrX.js";import{p as I,C,i as y,n as F,k as L,a as R,u as N,R as h}from"./index-D43g96vP.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),o=new I,E=o.get(C),t=E.create();t.scene=new y(o);t.renderer=new F(o,k);t.camera=new L(o);o.init();t.camera.controls.setLookAt(12,6,8,0,0,-10);t.scene.setup();const O=o.get(R);O.create(t);t.scene.three.background=null;const s=o.get(N),c=o.get(h);await c.setup();const x=[u,b,f];for(const e of x)c.settings.excludedCategories.add(e);c.settings.webIfc.COORDINATE_TO_ORIGIN=!0;async function v(){const n=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),i=new Uint8Array(n),l=await c.load(i);l.name="example",t.scene.three.add(l)}s.onFragmentsLoaded.add(e=>{console.log(e)});function d(e){const n=document.createElement("a");n.href=URL.createObjectURL(e),n.download=e.name,document.body.appendChild(n),n.click(),n.remove()}async function A(){if(!s.groups.size)return;const e=Array.from(s.groups.values())[0],n=s.export(e);d(new File([new Blob([n])],"small.frag"));const i=e.getLocalProperties();i&&d(new File([JSON.stringify(i)],"small.json"))}function B(){s.dispose()}const a=new w;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";t.renderer.onBeforeUpdate.add(()=>a.begin());t.renderer.onAfterUpdate.add(()=>a.end());g.init();const r=m.create(()=>p`
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
