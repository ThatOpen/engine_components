import{aX as d,aY as p,aZ as l}from"./web-ifc-api-BC8YMRiS.js";import{p as f,a as u,m as b}from"./index-DyM33b1I.js";import{S as g}from"./stats.min-GTpOrGrX.js";import{a as I,W as w,S as F,b as C,c as y}from"./index-B99Vyz6D.js";import{G as E}from"./index-vdN6D13n.js";import{F as O}from"./index-Cy4SZRUH.js";import{I as R}from"./index-DBI1qVdf.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./ifc-metadata-reader-j9dl-lHS.js";import"./ifc-fragment-settings-CiVry-YT.js";import"./index-BmLeol6g.js";import"./ifc-geometry-types-C3SKrzrZ.js";const x=document.getElementById("container"),n=new I,L=n.get(w),o=L.create();o.scene=new F(n);o.renderer=new C(n,x);o.camera=new y(n);n.init();o.camera.controls.setLookAt(12,6,8,0,0,-10);o.scene.setup();const N=n.get(E);N.create(o);const a=n.get(O),r=n.get(R);await r.setup();const h=[d,p,l];for(const e of h)r.settings.excludedCategories.add(e);r.settings.webIfc.COORDINATE_TO_ORIGIN=!0;r.settings.webIfc.OPTIMIZE_PROFILES=!0;async function S(){const t=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),i=new Uint8Array(t),c=await r.load(i);c.name="example",o.scene.three.add(c)}function m(e){const t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=e.name,document.body.appendChild(t),t.click(),t.remove()}async function A(){if(!a.groups.size)return;const e=Array.from(a.groups.values())[0],t=a.export(e);m(new File([new Blob([t])],"small.frag"));const i=e.getLocalProperties();i&&m(new File([JSON.stringify(i)],"small.json"))}function k(){a.dispose()}const s=new g;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";o.renderer.onBeforeUpdate.add(()=>s.begin());o.renderer.onAfterUpdate.add(()=>s.end());f.init();const T=u.create(()=>b`
    <bim-panel active label="IFC Loader Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${()=>{S()}}">
        </bim-button>  
            
        <bim-button label="Export fragments"
          @click="${()=>{A()}}">
        </bim-button>  
            
        <bim-button label="Dispose fragments"
          @click="${()=>{k()}}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(T);a.onFragmentsLoaded.add(e=>{console.log(e)});
