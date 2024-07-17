import"./web-ifc-api-5J0YW9AE.js";import{S as u}from"./stats.min-BpIepu9J.js";import{p,C as b,s as g,i as f,k as w,d as h,h as k}from"./index-CAlyvYyy.js";import{m as y,t as l,a as d}from"./index-tywNknxv.js";const L=document.getElementById("container"),n=new p,v=n.get(b),e=v.create();e.scene=new g(n);e.renderer=new f(n,L);e.camera=new w(n);n.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const x=n.get(h);x.create(e);e.scene.three.background=null;const s=n.get(k);let m="";async function F(){if(s.groups.size)return;const t=await(await fetch("https://thatopen.github.io/engine_components/resources/small.frag")).arrayBuffer(),c=new Uint8Array(t),i=s.load(c);e.scene.three.add(i),m=i.uuid}function U(o){const t=document.createElement("a");t.href=URL.createObjectURL(o),t.download=o.name,document.body.appendChild(t),t.click(),t.remove()}function B(){if(!s.groups.size)return;const o=s.groups.get(m);if(!o)return;const t=s.export(o),c=new Blob([t]),i=new File([c],"small.frag");U(i)}function C(){s.dispose()}const a=new u;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());y.init();const r=l.create(()=>d`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${()=>{F()}}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${()=>{C()}}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${()=>{B()}}">
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const $=l.create(()=>d`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append($);
