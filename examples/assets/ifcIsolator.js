import{ae as p}from"./web-ifc-api-CpQ3aV8c.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as u,z as m,m as d}from"./index-BEvRfOoQ.js";import{C as f,T as w,s as g,g as I,x as h,L,b as y,k}from"./index-B03kGVBW.js";import"./_commonjsHelpers-Cpj98o6Y.js";const v=document.getElementById("container"),t=new f,x=t.get(w),e=x.create();e.scene=new g(t);e.renderer=new I(t,v);e.camera=new h(t);t.init();e.camera.controls.setLookAt(12,6,8,0,0,-10);e.scene.setup();const C=t.get(L);C.create(e);e.scene.three.background=null;const i=t.get(y);await i.setup();i.settings.webIfc.COORDINATE_TO_ORIGIN=!0;async function T(){const c=await(await fetch("https://thatopen.github.io/engine_components/resources/small.ifc")).arrayBuffer(),s=new Uint8Array(c),n=await i.load(s);n.name="example",e.scene.three.add(n)}const U=t.get(k),r=new p;r.SetWasmPath("https://unpkg.com/web-ifc@0.0.57/",!0);await r.Init();const O=await fetch("https://thatopen.github.io/engine_components/resources/small.ifc"),R=await O.arrayBuffer(),o=new b;o.showPanel(2);document.body.append(o.dom);o.dom.style.left="0px";o.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>o.begin());e.renderer.onAfterUpdate.add(()=>o.end());u.init();const a=m.create(()=>d`
	<bim-panel active label="IFC Isolator Tutorial" class="options-menu">
	 <bim-panel-section collapsed label="Controls">
			<bim-panel-section style="padding-top: 10px;">
				<bim-button label="Load IFC"
					@click="${()=>{T()}}">
				</bim-button>

				<bim-button 
					label="Isolate Elements and Export to IFC" 
					@click="${async()=>{const l=await U.splitIfc(r,R,[6518]),c=new File([new Blob([l])],"isolated.ifc"),s=URL.createObjectURL(c),n=document.createElement("a");n.download="isolated.ifc",n.href=s,n.click(),URL.revokeObjectURL(s),n.remove()}}">	
				</bim-button>	

			</bim-panel-section>
		</bim-panel>
		`);document.body.append(a);const A=m.create(()=>d`
			<bim-button class="phone-menu-toggler" icon="solar:settings-bold"
				@click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
			</bim-button>
		`);document.body.append(A);
