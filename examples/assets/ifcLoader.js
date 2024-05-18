import{i as d,j as l,k as p}from"./web-ifc-api-eJ7dR4yy.js";import{S as f}from"./stats.min-GTpOrGrX.js";import{k as b,C as u,b as g}from"./index-CA2cPfXk.js";import{a as I,W as w,S as C,b as F,c as y}from"./index-BRIP3dnE.js";import{G as E}from"./index-aZ7tPJp1.js";import{F as O}from"./index-DUv5fNdI.js";import{I as R}from"./index--fV9GqHW.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./ifc-metadata-reader-D3JIxhGv.js";import"./ifc-fragment-settings-CERESExK.js";import"./index-Cm2Maecs.js";import"./ifc-geometry-types-C3SKrzrZ.js";const x=document.getElementById("container"),n=new I,L=n.get(w),o=L.create();o.scene=new C(n);o.renderer=new F(n,x);o.camera=new y(n);n.init();o.camera.controls.setLookAt(12,6,8,0,0,-10);o.scene.setup();const N=n.get(E);N.create(o);const a=n.get(O),r=n.get(R);await r.setup();const k=[d,l,p];for(const e of k)r.settings.excludedCategories.add(e);r.settings.webIfc.COORDINATE_TO_ORIGIN=!0;r.settings.webIfc.OPTIMIZE_PROFILES=!0;async function S(){const t=await(await fetch("../../../../../resources/small.ifc")).arrayBuffer(),i=new Uint8Array(t),c=await r.load(i);c.name="example",o.scene.three.add(c)}function m(e){const t=document.createElement("a");t.href=URL.createObjectURL(e),t.download=e.name,document.body.appendChild(t),t.click(),t.remove()}async function A(){if(!a.groups.size)return;const e=Array.from(a.groups.values())[0],t=a.export(e);m(new File([new Blob([t])],"small.frag"));const i=e.getLocalProperties();i&&m(new File([JSON.stringify(i)],"small.json"))}function h(){a.dispose()}const s=new f;s.showPanel(2);document.body.append(s.dom);s.dom.style.left="0px";o.renderer.onBeforeUpdate.add(()=>s.begin());o.renderer.onAfterUpdate.add(()=>s.end());b.registerComponents();const T=u.create(()=>g`
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
          @click="${()=>{h()}}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `);document.body.append(T);a.onFragmentsLoaded.add(e=>{console.log(e)});
