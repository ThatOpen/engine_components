import{Y as p}from"./web-ifc-api-r1ed24cU.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as f,L as m,m as d}from"./index-ByMLC5eT.js";import{C as u,W as w,S as I,d as g,a as h,G as L,f as y,k}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const C=document.getElementById("container"),t=new u,S=t.get(w),e=S.create();e.scene=new I(t);e.renderer=new g(t,C);e.camera=new h(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const v=t.get(L);v.create(e);e.scene.three.background=null;const i=t.get(y);await i.setup();i.settings.webIfc.COORDINATE_TO_ORIGIN=!0;async function R(){const c=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),a=new Uint8Array(c),n=await i.load(a);n.name="example",e.scene.three.add(n)}const U=t.get(k),r=new p;r.SetWasmPath("https://unpkg.com/web-ifc@0.0.66/",!0);await r.Init();const O=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),x=await O.arrayBuffer(),o=new b;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());f.init();const s=m.create(()=>d`
	<bim-panel active label="IFC Isolator Tutorial" class="options-menu">
	 <bim-panel-section collapsed label="Controls">
			<bim-panel-section style="padding-top: 10px;">
				<bim-button label="Load IFC"
					@click="${()=>{R()}}">
				</bim-button>

				<bim-button 
					label="Isolate Elements and Export to IFC" 
					@click="${async()=>{const l=await U.splitIfc(r,x,[6518]),c=new File([new Blob([l])],"isolated.ifc"),a=URL.createObjectURL(c),n=document.createElement("a");n.download="isolated.ifc",n.href=a,n.click(),URL.revokeObjectURL(a),n.remove()}}">	
				</bim-button>	

			</bim-panel-section>
		</bim-panel>
		`);document.body.append(s);const A=m.create(()=>d`
			<bim-button class="phone-menu-toggler" icon="solar:settings-bold"
				@click="${()=>{s.classList.contains("options-menu-visible")?s.classList.remove("options-menu-visible"):s.classList.add("options-menu-visible")}}">
			</bim-button>
		`);document.body.append(A);
