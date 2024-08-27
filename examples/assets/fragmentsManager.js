import"./web-ifc-api-JuXSH2nk.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{o as p,a as b,M as g,v as f,N as w,h,_ as y}from"./index-DtdmE_hK.js";import{d as k,R as l,m as d}from"./index-CqPyogbW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),n=new p,L=n.get(b),e=L.create();e.scene=new g(n);e.renderer=new f(n,v);e.camera=new w(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const x=n.get(h);x.create(e);e.scene.three.background=null;const s=n.get(y);let m="";async function F(){if(s.groups.size)return;const t=await(await fetch("https://thatopen.github.io/engine_components/resources/small.frag")).arrayBuffer(),c=new Uint8Array(t),r=s.load(c);e.scene.three.add(r),m=r.uuid}function U(o){const t=document.createElement("a");t.href=URL.createObjectURL(o),t.download=o.name,document.body.appendChild(t),t.click(),t.remove()}function B(){if(!s.groups.size)return;const o=s.groups.get(m);if(!o)return;const t=s.export(o),c=new Blob([t]),r=new File([c],"small.frag");U(r)}function R(){s.dispose()}const a=new u;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());k.init();const i=l.create(()=>d`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${()=>{F()}}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${()=>{R()}}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${()=>{B()}}">
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const $=l.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
