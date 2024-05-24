var z=Object.defineProperty;var C=(u,v,e)=>v in u?z(u,v,{enumerable:!0,configurable:!0,writable:!0,value:e}):u[v]=e;var s=(u,v,e)=>(C(u,typeof v!="symbol"?v+"":v,e),e);import{d as w,l as k,m as T,n as E,M as g,G as U,W as y,o as F,p as R,V as M,q as S,B as $,b as O,C as G}from"./web-ifc-api-BC8YMRiS.js";import{J as I,U as V,a as H,f as W,p as A,s as N,k as j,N as L}from"./index-DQ59awSV.js";import{S as Z}from"./stats.min-GTpOrGrX.js";import{p as q,a as J,m as X}from"./index-DyM33b1I.js";import{R as K}from"./renderer-with-2d-BWBYTINn.js";import"./import-wrapper-prod-LhqN7JJy.js";import"./_commonjsHelpers-Cpj98o6Y.js";const Q={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float h;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

			gl_FragColor = sum;

		}`},Y={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform float v;

		varying vec2 vUv;

		void main() {

			vec4 sum = vec4( 0.0 );

			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
			sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

			gl_FragColor = sum;

		}`},m=class m extends I{constructor(e){super(e);s(this,"onDisposed",new V);s(this,"enabled",!0);s(this,"cameraHeight",10);s(this,"darkness",1.2);s(this,"opacity",1);s(this,"resolution",512);s(this,"amount",3.5);s(this,"planeColor",16777215);s(this,"shadowOffset",0);s(this,"shadowExtraScaleFactor",1.5);s(this,"list",{});s(this,"tempMaterial",new w({visible:!1}));s(this,"depthMaterial",new k);this.components.add(m.uuid,this),this.initializeDepthMaterial()}dispose(){for(const e in this.list)this.deleteShadow(e);this.tempMaterial.dispose(),this.depthMaterial.dispose(),this.components=null,this.onDisposed.trigger(m.uuid),this.onDisposed.reset()}create(e,r,t){if(this.list[r])throw new Error(`There is already a shadow with ID ${r}`);const{size:i,center:l,min:c}=this.getSizeCenterMin(e),d=this.createShadow(r,i,t);return this.initializeShadow(d,l,c),this.createPlanes(d,i),this.bakeShadow(e,d),d.root}deleteShadow(e){const r=this.components.get(H),t=this.list[e];if(delete this.list[e],!t)throw new Error(`No shadow with ID ${e} was found.`);r.destroy(t.root),r.destroy(t.blurPlane),t.rt.dispose(),t.rtBlur.dispose()}createPlanes(e,r){const t=new T(r.x,r.z).rotateX(Math.PI/2);this.createBasePlane(e,t),m.createBlurPlane(e,t)}initializeShadow(e,r,t){this.initializeRoot(e,r,t),m.initializeRenderTargets(e),m.initializeCamera(e)}bakeShadow(e,r){const t=r.world.scene.three;if(!(t instanceof E))throw new Error("The core of the scene of the world must be a scene!");if(!r.world.renderer)throw new Error("The given world must have a renderer!");const i=r.world.renderer.three,l=e.map(a=>!!a.parent);for(let a=0;a<e.length;a++)l[a]||t.add(e[a]);const c=t.children.filter(a=>!e.includes(a)&&a!==r.root);for(let a=c.length-1;a>=0;a--)t.remove(c[a]);const d=t.background;t.background=null,t.overrideMaterial=this.depthMaterial;const D=[];for(const a of e)D.push(a.visible),a.visible=!0;i.setRenderTarget(r.rt),i.render(t,r.camera),t.overrideMaterial=null,this.blurShadow(r,this.amount),this.blurShadow(r,this.amount*.4),i.setRenderTarget(null),t.background=d;for(let a=0;a<e.length;a++)e[a].visible=D[a];for(let a=c.length-1;a>=0;a--)t.add(c[a]);for(let a=0;a<e.length;a++)l[a]||t.remove(e[a])}static initializeCamera(e){e.camera.rotation.x=Math.PI/2,e.root.add(e.camera)}static initializeRenderTargets(e){e.rt.texture.generateMipmaps=!1,e.rtBlur.texture.generateMipmaps=!1}initializeRoot(e,r,t){const i=e.world.scene.three;e.root.position.set(r.x,t.y-this.shadowOffset,r.z),i.add(e.root)}createBasePlane(e,r){const t=this.createPlaneMaterial(e),i=new g(r,t);i.renderOrder=2,e.root.add(i),i.scale.y=-1}static createBlurPlane(e,r){e.blurPlane.geometry=r,e.blurPlane.visible=!1,e.root.add(e.blurPlane)}createPlaneMaterial(e){if(!e.world.renderer)throw new Error("The given world must have a renderer!");const r=e.world.renderer.three;return new w({map:e.rt.texture,opacity:this.opacity,transparent:!0,depthWrite:!1,clippingPlanes:r.clippingPlanes})}initializeDepthMaterial(){this.depthMaterial.depthTest=!1,this.depthMaterial.depthWrite=!1;const e="gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",r="gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );";this.depthMaterial.userData.darkness={value:this.darkness},this.depthMaterial.onBeforeCompile=t=>{t.uniforms.darkness=this.depthMaterial.userData.darkness,t.fragmentShader=`
						uniform float darkness;
						${t.fragmentShader.replace(e,r)}
					`}}createShadow(e,r,t){return this.list[e]={root:new U,world:t,rt:new y(this.resolution,this.resolution),rtBlur:new y(this.resolution,this.resolution),blurPlane:new g,camera:this.createCamera(r)},this.list[e]}createCamera(e){return new F(-e.x/2,e.x/2,e.z/2,-e.z/2,0,this.cameraHeight)}getSizeCenterMin(e){const r=e[0].parent,t=new U;t.children=e;const i=new R().setFromObject(t);r==null||r.add(...e);const l=new M;i.getSize(l),l.x*=this.shadowExtraScaleFactor,l.z*=this.shadowExtraScaleFactor;const c=new M;i.getCenter(c);const d=i.min;return{size:l,center:c,min:d}}blurShadow(e,r){if(!e.world.renderer)throw new Error("The given world must have a renderer!");const t=new S(Q);t.depthTest=!1;const i=new S(Y);i.depthTest=!1,e.blurPlane.visible=!0,e.blurPlane.material=t,e.blurPlane.material.uniforms.tDiffuse.value=e.rt.texture,t.uniforms.h.value=r*1/256;const l=e.world.renderer.three;l.setRenderTarget(e.rtBlur),l.render(e.blurPlane,e.camera),e.blurPlane.material=i,e.blurPlane.material.uniforms.tDiffuse.value=e.rtBlur.texture,i.uniforms.v.value=r*1/256,l.setRenderTarget(e.rt),l.render(e.blurPlane,e.camera),e.blurPlane.visible=!1}};s(m,"uuid","f833a09a-a3ab-4c58-b03e-da5298c7a1b6");let b=m;const P=document.getElementById("container"),p=new W,_=p.get(A),n=_.create();n.scene=new N(p);n.renderer=new K(p,P);n.camera=new j(p);n.scene.setup();p.init();n.camera.controls.setLookAt(5,5,5,0,0,0);P.appendChild(n.renderer.three2D.domElement);const B=p.get(L);B.config.color.setHex(14540253);B.create(n);const ee=new $(3,3,3),te=new O({color:"#6528D7"}),h=new g(ee,te);h.position.set(0,1.5,0);n.scene.three.background=new G("white");n.scene.three.add(h);n.meshes.add(h);const o=new b(p);o.shadowExtraScaleFactor=15;o.shadowOffset=.1;const f="example";o.create([h],f,n);q.init();const re=J.create(()=>X`
    <bim-panel active label="Shadow Dropper Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
          
        <bim-number-input 
          slider label="Extra scale factor" step="1" 
          value="${o.shadowExtraScaleFactor}" min="0" max="20"
          @change="${({target:u})=>{o.shadowExtraScaleFactor=u.value,o.deleteShadow(f),o.create([h],f,n)}}">
        </bim-number-input> 
                  
        <bim-number-input 
          slider label="Amount" step="1" 
          value="${o.amount}" min="0" max="20"
          @change="${({target:u})=>{o.amount=u.value,o.deleteShadow(f),o.create([h],f,n)}}">
        </bim-number-input>    
                       
        <bim-number-input 
          slider label="Shadow offset" step="0.01" 
          value="${o.shadowOffset}" min="0" max="3"
          @change="${({target:u})=>{o.shadowOffset=u.value,o.deleteShadow(f),o.create([h],f,n)}}">
        </bim-number-input> 

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(re);const x=new Z;x.showPanel(2);document.body.append(x.dom);x.dom.style.left="0px";n.renderer.onBeforeUpdate.add(()=>x.begin());n.renderer.onAfterUpdate.add(()=>x.end());
