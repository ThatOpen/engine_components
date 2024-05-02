var z=Object.defineProperty;var C=(d,u,e)=>u in d?z(d,u,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[u]=e;var n=(d,u,e)=>(C(d,typeof u!="symbol"?u+"":u,e),e);import{M as w,a as k,P as T,S as E,b as p,G as b,W as U,O as R,B as F,V as y,c as M,d as G,e as O,C as V}from"./unzipit.module-zU76GtL2.js";import{S as I}from"./stats.min-GTpOrGrX.js";import{i as H,D as W,z as A}from"./N8AO-B1xyQodp.js";import{P as $}from"./index-COtLVqZs.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./serializer-B7p502p4.js";import"./stream-serializer-BX3dyAH0.js";const j={name:"HorizontalBlurShader",uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`

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

		}`},L={name:"VerticalBlurShader",uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`

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

		}`},v=class v extends H{constructor(e){super(e);n(this,"onDisposed",new W);n(this,"enabled",!0);n(this,"cameraHeight",10);n(this,"darkness",1.2);n(this,"opacity",1);n(this,"resolution",512);n(this,"amount",3.5);n(this,"planeColor",16777215);n(this,"shadowOffset",0);n(this,"shadowExtraScaleFactor",1.5);n(this,"list",{});n(this,"tempMaterial",new w({visible:!1}));n(this,"depthMaterial",new k);this.components.add(v.uuid,this),this.initializeDepthMaterial()}dispose(){for(const e in this.list)this.deleteShadow(e);this.tempMaterial.dispose(),this.depthMaterial.dispose(),this.components=null,this.onDisposed.trigger(v.uuid),this.onDisposed.reset()}create(e,r,t){if(this.list[r])throw new Error(`There is already a shadow with ID ${r}`);const{size:i,center:s,min:l}=this.getSizeCenterMin(e),c=this.createShadow(r,i,t);return this.initializeShadow(c,s,l),this.createPlanes(c,i),this.bakeShadow(e,c),c.root}deleteShadow(e){const r=this.components.get(A),t=this.list[e];if(delete this.list[e],!t)throw new Error(`No shadow with ID ${e} was found.`);r.destroy(t.root),r.destroy(t.blurPlane),t.rt.dispose(),t.rtBlur.dispose()}createPlanes(e,r){const t=new T(r.x,r.z).rotateX(Math.PI/2);this.createBasePlane(e,t),v.createBlurPlane(e,t)}initializeShadow(e,r,t){this.initializeRoot(e,r,t),v.initializeRenderTargets(e),v.initializeCamera(e)}bakeShadow(e,r){const t=r.world.scene.three;if(!(t instanceof E))throw new Error("The core of the scene of the world must be a scene!");if(!r.world.renderer)throw new Error("The given world must have a renderer!");const i=r.world.renderer.three,s=e.map(a=>!!a.parent);for(let a=0;a<e.length;a++)s[a]||t.add(e[a]);const l=t.children.filter(a=>!e.includes(a)&&a!==r.root);for(let a=l.length-1;a>=0;a--)t.remove(l[a]);const c=t.background;t.background=null,t.overrideMaterial=this.depthMaterial;const D=[];for(const a of e)D.push(a.visible),a.visible=!0;i.setRenderTarget(r.rt),i.render(t,r.camera),t.overrideMaterial=null,this.blurShadow(r,this.amount),this.blurShadow(r,this.amount*.4),i.setRenderTarget(null),t.background=c;for(let a=0;a<e.length;a++)e[a].visible=D[a];for(let a=l.length-1;a>=0;a--)t.add(l[a]);for(let a=0;a<e.length;a++)s[a]||t.remove(e[a])}static initializeCamera(e){e.camera.rotation.x=Math.PI/2,e.root.add(e.camera)}static initializeRenderTargets(e){e.rt.texture.generateMipmaps=!1,e.rtBlur.texture.generateMipmaps=!1}initializeRoot(e,r,t){const i=e.world.scene.three;e.root.position.set(r.x,t.y-this.shadowOffset,r.z),i.add(e.root)}createBasePlane(e,r){const t=this.createPlaneMaterial(e),i=new p(r,t);i.renderOrder=2,e.root.add(i),i.scale.y=-1}static createBlurPlane(e,r){e.blurPlane.geometry=r,e.blurPlane.visible=!1,e.root.add(e.blurPlane)}createPlaneMaterial(e){if(!e.world.renderer)throw new Error("The given world must have a renderer!");const r=e.world.renderer.three;return new w({map:e.rt.texture,opacity:this.opacity,transparent:!0,depthWrite:!1,clippingPlanes:r.clippingPlanes})}initializeDepthMaterial(){this.depthMaterial.depthTest=!1,this.depthMaterial.depthWrite=!1;const e="gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",r="gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );";this.depthMaterial.userData.darkness={value:this.darkness},this.depthMaterial.onBeforeCompile=t=>{t.uniforms.darkness=this.depthMaterial.userData.darkness,t.fragmentShader=`
						uniform float darkness;
						${t.fragmentShader.replace(e,r)}
					`}}createShadow(e,r,t){return this.list[e]={root:new b,world:t,rt:new U(this.resolution,this.resolution),rtBlur:new U(this.resolution,this.resolution),blurPlane:new p,camera:this.createCamera(r)},this.list[e]}createCamera(e){return new R(-e.x/2,e.x/2,e.z/2,-e.z/2,0,this.cameraHeight)}getSizeCenterMin(e){const r=e[0].parent,t=new b;t.children=e;const i=new F().setFromObject(t);r==null||r.add(...e);const s=new y;i.getSize(s),s.x*=this.shadowExtraScaleFactor,s.z*=this.shadowExtraScaleFactor;const l=new y;i.getCenter(l);const c=i.min;return{size:s,center:l,min:c}}blurShadow(e,r){if(!e.world.renderer)throw new Error("The given world must have a renderer!");const t=new M(j);t.depthTest=!1;const i=new M(L);i.depthTest=!1,e.blurPlane.visible=!0,e.blurPlane.material=t,e.blurPlane.material.uniforms.tDiffuse.value=e.rt.texture,t.uniforms.h.value=r*1/256;const s=e.world.renderer.three;s.setRenderTarget(e.rtBlur),s.render(e.blurPlane,e.camera),e.blurPlane.material=i,e.blurPlane.material.uniforms.tDiffuse.value=e.rtBlur.texture,i.uniforms.v.value=r*1/256,s.setRenderTarget(e.rt),s.render(e.blurPlane,e.camera),e.blurPlane.visible=!1}};n(v,"uuid","f833a09a-a3ab-4c58-b03e-da5298c7a1b6");let x=v;const Z=document.getElementById("container"),o=new(void 0),S=new(void 0)(o);S.setup();o.scene=S;const g=new $(o,Z);o.renderer=g;const P=new(void 0)(o);o.camera=P;o.raycaster=new(void 0)(o);o.init();const B=o.scene.get();P.controls.setLookAt(10,10,10,0,0,0);const N=new G(3,3,3),X=new O({color:"#6528D7"}),m=new p(N,X);m.position.set(0,1.5,0);B.background=new V("gray");B.add(m);o.meshes.add(m);const h=new x(o);h.shadowExtraScaleFactor=15;h.darkness=2;h.shadowOffset=.1;h.renderShadow([m],"example");const f=new I;f.showPanel(2);document.body.append(f.dom);f.dom.style.left="0px";g.onBeforeUpdate.add(()=>f.begin());g.onAfterUpdate.add(()=>f.end());
