import"./web-ifc-api-r1ed24cU.js";import{S as p}from"./stats.min-GTpOrGrX.js";import{C as u,W as b,S as g,d as f,a as w,G as h,F as y}from"./index-4oEgnBmA.js";import{T as L,L as l,m}from"./index-ByMLC5eT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),n=new u,F=n.get(b),e=F.create();e.scene=new g(n);e.renderer=new f(n,k);e.camera=new w(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const S=n.get(h);S.create(e);e.scene.three.background=null;const s=n.get(y);let d="";async function v(){if(s.groups.size)return;const t=await(await fetch("https://thatopen.github.io/engine_components/resources/small.frag")).arrayBuffer(),c=new Uint8Array(t),r=s.load(c);e.scene.three.add(r),d=r.uuid}function x(o){const t=document.createElement("a");t.href=URL.createObjectURL(o),t.download=o.name,document.body.appendChild(t),t.click(),t.remove()}function C(){if(!s.groups.size)return;const o=s.groups.get(d);if(!o)return;const t=s.export(o),c=new Blob([t]),r=new File([c],"small.frag");x(r)}function U(){s.dispose()}const a=new p;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());L.init();const i=l.create(()=>m`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${()=>{v()}}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${()=>{U()}}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${()=>{C()}}">
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const B=l.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);
