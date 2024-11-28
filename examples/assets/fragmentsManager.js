import"./web-ifc-api-nU1-R_1k.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{C as u,W as b,S as g,d as f,a as w,G as h,F as y}from"./index-C8rcJyf0.js";import{T as k,z as l,m}from"./index-BEvRfOoQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";const F=document.getElementById("container"),n=new u,L=n.get(b),e=L.create();e.scene=new g(n);e.renderer=new f(n,F);e.camera=new w(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const S=n.get(h);S.create(e);e.scene.three.background=null;const s=n.get(y);let d="";async function v(){if(s.groups.size)return;const t=await(await fetch("https://thatopen.github.io/engine_components/resources/small.frag")).arrayBuffer(),c=new Uint8Array(t),r=s.load(c);e.scene.three.add(r),d=r.uuid}function x(o){const t=document.createElement("a");t.href=URL.createObjectURL(o),t.download=o.name,document.body.appendChild(t),t.click(),t.remove()}function z(){if(!s.groups.size)return;const o=s.groups.get(d);if(!o)return;const t=s.export(o),c=new Blob([t]),r=new File([c],"small.frag");x(r)}function C(){s.dispose()}const a=new p;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());k.init();const i=l.create(()=>m`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${()=>{v()}}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${()=>{C()}}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${()=>{z()}}">
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const U=l.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(U);
