import"./web-ifc-api-D3oDn2HF.js";import{S as p}from"./stats.min-DDrWCSVO.js";import{a as u,W as b,S as g,c as f,b as w,G as h,F as y}from"./index-DPB0U-mi.js";import{p as k,J as l,m}from"./index-K5IA6oiZ.js";const F=document.getElementById("container"),t=new u,L=t.get(b),e=L.create();e.scene=new g(t);e.renderer=new f(t,F);e.camera=new w(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const S=t.get(h);S.create(e);e.scene.three.background=null;const s=t.get(y);let d="";async function v(){if(s.groups.size)return;const n=await(await fetch("https://thatopen.github.io/engine_components/resources/small.frag")).arrayBuffer(),c=new Uint8Array(n),r=s.load(c);e.scene.three.add(r),d=r.uuid}function x(o){const n=document.createElement("a");n.href=URL.createObjectURL(o),n.download=o.name,document.body.appendChild(n),n.click(),n.remove()}function U(){if(!s.groups.size)return;const o=s.groups.get(d);if(!o)return;const n=s.export(o),c=new Blob([n]),r=new File([c],"small.frag");x(r)}function B(){s.dispose()}const a=new p;a.showPanel(2);document.body.append(a.dom);a.dom.style.left="0px";a.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>a.begin());e.renderer.onAfterUpdate.add(()=>a.end());k.init();const i=l.create(()=>m`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${()=>{v()}}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${()=>{B()}}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${()=>{U()}}">
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(i);const C=l.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{i.classList.contains("options-menu-visible")?i.classList.remove("options-menu-visible"):i.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(C);
