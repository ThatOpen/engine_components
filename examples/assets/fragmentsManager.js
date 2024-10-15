import"./web-ifc-api-B5wucqPq.js";import{S as u}from"./stats.min-bBCj9H3B.js";import{C as b,T as p,e as g,m as f,U as w,O as h,a as y}from"./index-0bdztiQ8.js";import{T as k,z as l,m}from"./index-DtbylpTq.js";const L=document.getElementById("container"),n=new b,U=n.get(p),e=U.create();e.scene=new g(n);e.renderer=new f(n,L);e.camera=new w(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=n.get(h);v.create(e);e.scene.three.background=null;const s=n.get(y);let d="";async function T(){if(s.groups.size)return;const t=await(await fetch("https://thatopen.github.io/engine_components/resources/small.frag")).arrayBuffer(),c=new Uint8Array(t),r=s.load(c);e.scene.three.add(r),d=r.uuid}function x(o){const t=document.createElement("a");t.href=URL.createObjectURL(o),t.download=o.name,document.body.appendChild(t),t.click(),t.remove()}function z(){if(!s.groups.size)return;const o=s.groups.get(d);if(!o)return;const t=s.export(o),c=new Blob([t]),r=new File([c],"small.frag");x(r)}function F(){s.dispose()}const a=new u;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());k.init();const i=l.create(()=>m`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${()=>{T()}}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${()=>{F()}}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${()=>{z()}}">
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const B=l.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(B);
