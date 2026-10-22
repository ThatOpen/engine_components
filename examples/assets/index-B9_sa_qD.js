const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./composition-fzkXgeTY.js","./TransformControls-uP1Cexzu.js","./three.tsl-DSP6Wist.js","./three.webgpu-Bi3xGA5a.js"])))=>i.map(i=>d[i]);
import{_ as Xt}from"./preload-helper-PPVm8Dsz.js";import{Y as Qt,Z as Oe,_ as fe,$ as Te,a0 as Et,a1 as At,a2 as qt,a3 as Yt,a4 as Zt,a5 as Kt,E as ft,F as nt,g as lt}from"./graphic-vertex-picker-BijCnCEg.js";import{R as Jt}from"./renderer-with-2d-CrQsY-US.js";import{M as Pe,O as pt,B as je,$ as St,e as C,kb as se,w as k,W as F,aG as ie,X as V,aq as $t,V as te,E as We,aF as ye,a$ as Ie,kc as es,bj as ue,kd as ce,ke as bt,kf as Mt,bi as mt,C as I,D as gt,kg as ts,kh as ss,N as U,ac as B,ab as Q,bp as Dt,bg as is,ki as rs,ak as as,aj as os,ai as ns,ah as ls,kj as hs,ag as ds,kk as us,bc as Tt,a_ as N,s as cs,bn as vt,o as Ot,a as xt,b1 as Ge,Y as Rt,G as Nt,r as fs,c as ps,kl as Ft,bk as ct,Z as pe,km as ms,kn as Lt,bm as zt,bl as gs,bo as vs,am as Pt,ko as xs,a4 as _s}from"./TransformControls-uP1Cexzu.js";const Be={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class J{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ws=new pt(-1,1,1,-1,0,1);class Ss extends je{constructor(){super(),this.setAttribute("position",new St([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new St([0,2,0,0,2,0],2))}}const bs=new Ss;class K{constructor(e){this._mesh=new Pe(bs,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ws)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ms extends J{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof C?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=se.clone(e.uniforms),this.material=new C({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new K(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class yt extends J{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class Ts extends J{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ps{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const s=e.getSize(new k);this._width=s.width,this._height=s.height,t=new F(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ie}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ms(Be),this.copyPass.material.blending=V,this.timer=new $t}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let s=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),a.needsSwap){if(s){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}yt!==void 0&&(a instanceof yt?s=!0:a instanceof Ts&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new k);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const s=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(s,i),this.renderTarget2.setSize(s,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(s,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Re={defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new k},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new We},cameraProjectionMatrixInverse:{value:new We},cameraWorldMatrix:{value:new We},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new te(-1,-1,-1)},sceneBoxMax:{value:new te(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Ne={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},ht={uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function ys(d=5){const e=Math.floor(d)%2===0?Math.floor(d)+1:Math.floor(d),t=Cs(e),s=t.length,i=new Uint8Array(s*4);for(let a=0;a<s;++a){const o=t[a],l=2*Math.PI*o/s,n=new te(Math.cos(l),Math.sin(l),0).normalize();i[a*4]=(n.x*.5+.5)*255,i[a*4+1]=(n.y*.5+.5)*255,i[a*4+2]=127,i[a*4+3]=255}const r=new ye(i,e,e);return r.wrapS=Ie,r.wrapT=Ie,r.needsUpdate=!0,r}function Cs(d){const e=Math.floor(d)%2===0?Math.floor(d)+1:Math.floor(d),t=e*e,s=Array(t).fill(0);let i=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(i===-1&&r===e?(r=e-2,i=0):(r===e&&(r=0),i<0&&(i=e-1)),s[i*e+r]!==0){r-=2,i++;continue}else s[i*e+r]=a++;r++,i--}return s}const Fe={defines:{SAMPLES:16,SAMPLE_VECTORS:Ut(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new k},cameraProjectionMatrixInverse:{value:new We},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Ut(d,e,t){const s=Es(d,e,t);let i="vec3[SAMPLES](";for(let r=0;r<d;r++){const a=s[r];i+=`vec3(${a.x}, ${a.y}, ${a.z})${r<d-1?",":")"}`}return i}function Es(d,e,t){const s=[];for(let i=0;i<d;i++){const r=2*Math.PI*e*i/d,a=Math.pow(i/(d-1),t);s.push(new te(Math.cos(r),Math.sin(r),a))}return s}class As{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let s,i,r;const a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),n=Math.floor(t+o),c=(3-Math.sqrt(3))/6,p=(l+n)*c,m=l-p,h=n-p,v=e-m,T=t-h;let P,b;v>T?(P=1,b=0):(P=0,b=1);const f=v-P+c,O=T-b+c,E=v-1+2*c,_=T-1+2*c,w=l&255,S=n&255,A=this.perm[w+this.perm[S]]%12,M=this.perm[w+P+this.perm[S+b]]%12,u=this.perm[w+1+this.perm[S+1]]%12;let g=.5-v*v-T*T;g<0?s=0:(g*=g,s=g*g*this._dot(this.grad3[A],v,T));let x=.5-f*f-O*O;x<0?i=0:(x*=x,i=x*x*this._dot(this.grad3[M],f,O));let y=.5-E*E-_*_;return y<0?r=0:(y*=y,r=y*y*this._dot(this.grad3[u],E,_)),70*(s+i+r)}noise3d(e,t,s){let i,r,a,o;const n=(e+t+s)*.3333333333333333,c=Math.floor(e+n),p=Math.floor(t+n),m=Math.floor(s+n),h=1/6,v=(c+p+m)*h,T=c-v,P=p-v,b=m-v,f=e-T,O=t-P,E=s-b;let _,w,S,A,M,u;f>=O?O>=E?(_=1,w=0,S=0,A=1,M=1,u=0):f>=E?(_=1,w=0,S=0,A=1,M=0,u=1):(_=0,w=0,S=1,A=1,M=0,u=1):O<E?(_=0,w=0,S=1,A=0,M=1,u=1):f<E?(_=0,w=1,S=0,A=0,M=1,u=1):(_=0,w=1,S=0,A=1,M=1,u=0);const g=f-_+h,x=O-w+h,y=E-S+h,L=f-A+2*h,G=O-M+2*h,R=E-u+2*h,z=f-1+3*h,W=O-1+3*h,D=E-1+3*h,$=c&255,ee=p&255,de=m&255,Ce=this.perm[$+this.perm[ee+this.perm[de]]]%12,Ee=this.perm[$+_+this.perm[ee+w+this.perm[de+S]]]%12,Ae=this.perm[$+A+this.perm[ee+M+this.perm[de+u]]]%12,De=this.perm[$+1+this.perm[ee+1+this.perm[de+1]]]%12;let re=.6-f*f-O*O-E*E;re<0?i=0:(re*=re,i=re*re*this._dot3(this.grad3[Ce],f,O,E));let ae=.6-g*g-x*x-y*y;ae<0?r=0:(ae*=ae,r=ae*ae*this._dot3(this.grad3[Ee],g,x,y));let oe=.6-L*L-G*G-R*R;oe<0?a=0:(oe*=oe,a=oe*oe*this._dot3(this.grad3[Ae],L,G,R));let ne=.6-z*z-W*W-D*D;return ne<0?o=0:(ne*=ne,o=ne*ne*this._dot3(this.grad3[De],z,W,D)),32*(i+r+a+o)}noise4d(e,t,s,i){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,n=(5-Math.sqrt(5))/20;let c,p,m,h,v;const T=(e+t+s+i)*l,P=Math.floor(e+T),b=Math.floor(t+T),f=Math.floor(s+T),O=Math.floor(i+T),E=(P+b+f+O)*n,_=P-E,w=b-E,S=f-E,A=O-E,M=e-_,u=t-w,g=s-S,x=i-A,y=M>u?32:0,L=M>g?16:0,G=u>g?8:0,R=M>x?4:0,z=u>x?2:0,W=g>x?1:0,D=y+L+G+R+z+W,$=a[D][0]>=3?1:0,ee=a[D][1]>=3?1:0,de=a[D][2]>=3?1:0,Ce=a[D][3]>=3?1:0,Ee=a[D][0]>=2?1:0,Ae=a[D][1]>=2?1:0,De=a[D][2]>=2?1:0,re=a[D][3]>=2?1:0,ae=a[D][0]>=1?1:0,oe=a[D][1]>=1?1:0,ne=a[D][2]>=1?1:0,wt=a[D][3]>=1?1:0,Ve=M-$+n,Xe=u-ee+n,Qe=g-de+n,qe=x-Ce+n,Ye=M-Ee+2*n,Ze=u-Ae+2*n,Ke=g-De+2*n,Je=x-re+2*n,$e=M-ae+3*n,et=u-oe+3*n,tt=g-ne+3*n,st=x-wt+3*n,it=M-1+4*n,rt=u-1+4*n,at=g-1+4*n,ot=x-1+4*n,me=P&255,ge=b&255,ve=f&255,xe=O&255,Gt=o[me+o[ge+o[ve+o[xe]]]]%32,kt=o[me+$+o[ge+ee+o[ve+de+o[xe+Ce]]]]%32,Ht=o[me+Ee+o[ge+Ae+o[ve+De+o[xe+re]]]]%32,jt=o[me+ae+o[ge+oe+o[ve+ne+o[xe+wt]]]]%32,Vt=o[me+1+o[ge+1+o[ve+1+o[xe+1]]]]%32;let _e=.6-M*M-u*u-g*g-x*x;_e<0?c=0:(_e*=_e,c=_e*_e*this._dot4(r[Gt],M,u,g,x));let we=.6-Ve*Ve-Xe*Xe-Qe*Qe-qe*qe;we<0?p=0:(we*=we,p=we*we*this._dot4(r[kt],Ve,Xe,Qe,qe));let Se=.6-Ye*Ye-Ze*Ze-Ke*Ke-Je*Je;Se<0?m=0:(Se*=Se,m=Se*Se*this._dot4(r[Ht],Ye,Ze,Ke,Je));let be=.6-$e*$e-et*et-tt*tt-st*st;be<0?h=0:(be*=be,h=be*be*this._dot4(r[jt],$e,et,tt,st));let Me=.6-it*it-rt*rt-at*at-ot*ot;return Me<0?v=0:(Me*=Me,v=Me*Me*this._dot4(r[Vt],it,rt,at,ot)),27*(c+p+m+h+v)}_dot(e,t,s){return e[0]*t+e[1]*s}_dot3(e,t,s,i){return e[0]*t+e[1]*s+e[2]*i}_dot4(e,t,s,i,r){return e[0]*t+e[1]*s+e[2]*i+e[3]*r}}class X extends J{constructor(e,t,s=512,i=512,r,a,o){super(),this.width=s,this.height=i,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=ys(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new F(this.width,this.height,{type:ie}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new C({defines:Object.assign({},Re.defines),uniforms:se.clone(Re.uniforms),vertexShader:Re.vertexShader,fragmentShader:Re.fragmentShader,blending:V,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new es,this.normalMaterial.blending=V,this.pdMaterial=new C({defines:Object.assign({},Fe.defines),uniforms:se.clone(Fe.uniforms),vertexShader:Fe.vertexShader,fragmentShader:Fe.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new C({defines:Object.assign({},Ne.defines),uniforms:se.clone(Ne.uniforms),vertexShader:Ne.vertexShader,fragmentShader:Ne.fragmentShader,blending:V}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new C({uniforms:se.clone(Be.uniforms),vertexShader:Be.vertexShader,fragmentShader:Be.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Mt,blendDst:ce,blendEquation:ue,blendSrcAlpha:bt,blendDstAlpha:ce,blendEquationAlpha:ue}),this.blendMaterial=new C({uniforms:se.clone(ht.uniforms),vertexShader:ht.vertexShader,fragmentShader:ht.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:mt,blendSrc:Mt,blendDst:ce,blendEquation:ue,blendSrcAlpha:bt,blendDstAlpha:ce,blendEquationAlpha:ue}),this._fsQuad=new K(null),this._originalClearColor=new I,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new gt,this.depthTexture.format=ts,this.depthTexture.type=ss,this.normalRenderTarget=new F(this.width,this.height,{minFilter:U,magFilter:U,type:ie,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);const s=this.normalTexture?1:0,i=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=s,this.gtaoMaterial.defines.DEPTH_SWIZZLING=i,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=s,this.pdMaterial.defines.DEPTH_SWIZZLING=i,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Ut(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,s){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case X.OUTPUT.Off:break;case X.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=s.texture,this.copyMaterial.blending=V,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case X.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=V,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case X.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=V,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case X.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case X.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=V,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case X.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=s.texture,this.copyMaterial.blending=V,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,s,i,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(s),e.autoClear=!1,i!=null&&(e.setClearColor(i),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,s,i,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(s),e.autoClear=!1,i=t.clearColor||i,r=t.clearAlpha||r,i!=null&&(e.setClearColor(i),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(s){(s.isPoints||s.isLine||s.isLine2)&&s.visible&&(s.visible=!1,t.push(s))})}_restoreVisibility(){const e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){const t=new As,s=e*e*4,i=new Uint8Array(s);for(let a=0;a<e;a++)for(let o=0;o<e;o++){const l=a,n=o;i[(a*e+o)*4]=(t.noise(l,n)*.5+.5)*255,i[(a*e+o)*4+1]=(t.noise(l+e,n)*.5+.5)*255,i[(a*e+o)*4+2]=(t.noise(l,n+e)*.5+.5)*255,i[(a*e+o)*4+3]=(t.noise(l+e,n+e)*.5+.5)*255}const r=new ye(i,e,e,B,Q);return r.wrapS=Ie,r.wrapT=Ie,r.needsUpdate=!0,r}}X.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};const Le={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Ds extends J{constructor(){super(),this.isOutputPass=!0,this.uniforms=se.clone(Le.uniforms),this.material=new Dt({name:Le.name,uniforms:this.uniforms,vertexShader:Le.vertexShader,fragmentShader:Le.fragmentShader}),this._fsQuad=new K(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},is.getTransfer(this._outputColorSpace)===rs&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===as?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===os?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ns?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ls?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===hs?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ds?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===us&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const ze={defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new k(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`},Ue={defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new k(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`},dt={uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new k(1/1024,1/512)}},vertexShader:`

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`};class Os extends J{constructor(){super(),this._edgesRT=new F(1,1,{depthBuffer:!1,type:ie}),this._edgesRT.texture.name="SMAAPass.edges",this._weightsRT=new F(1,1,{depthBuffer:!1,type:ie}),this._weightsRT.texture.name="SMAAPass.weights";const e=this,t=new Image;t.src=this._getAreaTexture(),t.onload=function(){e._areaTexture.needsUpdate=!0},this._areaTexture=new Tt,this._areaTexture.name="SMAAPass.area",this._areaTexture.image=t,this._areaTexture.minFilter=N,this._areaTexture.generateMipmaps=!1,this._areaTexture.flipY=!1;const s=new Image;s.src=this._getSearchTexture(),s.onload=function(){e._searchTexture.needsUpdate=!0},this._searchTexture=new Tt,this._searchTexture.name="SMAAPass.search",this._searchTexture.image=s,this._searchTexture.magFilter=U,this._searchTexture.minFilter=U,this._searchTexture.generateMipmaps=!1,this._searchTexture.flipY=!1,this._uniformsEdges=se.clone(ze.uniforms),this._materialEdges=new C({defines:Object.assign({},ze.defines),uniforms:this._uniformsEdges,vertexShader:ze.vertexShader,fragmentShader:ze.fragmentShader}),this._uniformsWeights=se.clone(Ue.uniforms),this._uniformsWeights.tDiffuse.value=this._edgesRT.texture,this._uniformsWeights.tArea.value=this._areaTexture,this._uniformsWeights.tSearch.value=this._searchTexture,this._materialWeights=new C({defines:Object.assign({},Ue.defines),uniforms:this._uniformsWeights,vertexShader:Ue.vertexShader,fragmentShader:Ue.fragmentShader}),this._uniformsBlend=se.clone(dt.uniforms),this._uniformsBlend.tDiffuse.value=this._weightsRT.texture,this._materialBlend=new C({uniforms:this._uniformsBlend,vertexShader:dt.vertexShader,fragmentShader:dt.fragmentShader}),this._fsQuad=new K(null)}render(e,t,s){this._uniformsEdges.tDiffuse.value=s.texture,this._fsQuad.material=this._materialEdges,e.setRenderTarget(this._edgesRT),this.clear&&e.clear(),this._fsQuad.render(e),this._fsQuad.material=this._materialWeights,e.setRenderTarget(this._weightsRT),this.clear&&e.clear(),this._fsQuad.render(e),this._uniformsBlend.tColor.value=s.texture,this._fsQuad.material=this._materialBlend,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this._fsQuad.render(e))}setSize(e,t){this._edgesRT.setSize(e,t),this._weightsRT.setSize(e,t),this._materialEdges.uniforms.resolution.value.set(1/e,1/t),this._materialWeights.uniforms.resolution.value.set(1/e,1/t),this._materialBlend.uniforms.resolution.value.set(1/e,1/t)}dispose(){this._edgesRT.dispose(),this._weightsRT.dispose(),this._areaTexture.dispose(),this._searchTexture.dispose(),this._materialEdges.dispose(),this._materialWeights.dispose(),this._materialBlend.dispose(),this._fsQuad.dispose()}_getAreaTexture(){return"data:image/png;base64,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"}_getSearchTexture(){return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="}}class Rs extends X{_fragments;_hiddenMaterials=new Map;constructor(e,t,s,i,r){super(t,s,i,r),this._fragments=e}render(e,t,s,i,r){this._hideLodMaterials(),super.render(e,t,s,i,r),this._restoreLodMaterials()}_hideLodMaterials(){if(this._hiddenMaterials.clear(),!!this._fragments.initialized)for(const[,e]of this._fragments.core.models.materials.list)"isLodMaterial"in e&&(this._hiddenMaterials.set(e,e.visible),e.visible=!1)}_restoreLodMaterials(){for(const[e,t]of this._hiddenMaterials)e.visible=t;this._hiddenMaterials.clear()}}var Wt=(d=>(d[d.DEFAULT=0]="DEFAULT",d[d.GLOBAL=1]="GLOBAL",d))(Wt||{});class Ns extends J{_edgeMaterial;_combineMaterial;_fsQuad;_edgeRenderTarget;_vertexColorRenderTarget;_fragments;_renderer;_overrideMaterial;_depthBiasStrength=.005;_mode=0;xray=!1;get mode(){return this._mode}set mode(e){this._mode=e,this.setMaterialToMesh(!1)}get width(){return this._edgeMaterial.uniforms.width.value}set width(e){this._edgeMaterial.uniforms.width.value=e}get color(){return this._combineMaterial.uniforms.edgeColor.value}set color(e){this._combineMaterial.uniforms.edgeColor.value=e}get depthBiasStrength(){return this._depthBiasStrength}set depthBiasStrength(e){this._depthBiasStrength=e,this._overrideMaterial&&(this._overrideMaterial.uniforms.depthBiasStrength.value=e)}constructor(e,t,s=1){super(),this._renderer=e,this._fragments=t,this._overrideMaterial=new C({clipping:!0,side:cs,uniforms:{depthBiasStrength:{value:this._depthBiasStrength}},vertexShader:`
        #include <common>
        #include <clipping_planes_pars_vertex>

        attribute vec3 color;
        varying vec3 vColor;
        uniform float depthBiasStrength;

        void main() {
          vColor = color;

          #include <begin_vertex>
          #include <project_vertex>

          // Coplanar priority, applied as a small WORLD-space nudge toward the
          // camera in view space (+Z is toward the camera), then re-projected.
          // A constant clip-space bias falls off ~1/d while the real depth gap
          // falls off ~1/d^2, so at distance it overran genuine occluders and
          // leaked their edges (#718). A view-space offset instead behaves like
          // a real epsilon separation: its projected depth gap scales like real
          // geometry, so it breaks coplanar ties at every distance without ever
          // pulling an occluder forward. Convention-independent (correct under
          // standard-Z and reversed-Z). mvPosition comes from <project_vertex>,
          // so instancing/batching are already applied.
          //
          // Two terms (mirrors beta's per-faceId band + hash, adapted to view
          // space): luminance priority so brighter surfaces render on top, plus
          // a deterministic per-colour hash so coplanar surfaces of EQUAL
          // priority still get a stable winner instead of z-fighting. The hash
          // is a fraction of the priority step, so priority still dominates.
          float priority = dot(color, vec3(0.299, 0.587, 0.114));
          float tie = fract(
            sin(dot(color, vec3(12.9898, 78.233, 37.719))) * 43758.5453
          );
          mvPosition.z += (priority + (tie - 0.5) * 0.25) * depthBiasStrength;
          gl_Position = projectionMatrix * mvPosition;

          #include <clipping_planes_vertex>
        }
      `,fragmentShader:`
        varying vec3 vColor;
        #include <clipping_planes_pars_fragment>

        void main() {
          #include <clipping_planes_fragment>
          gl_FragColor = vec4(vColor, 1.0);
        }
      `}),this._edgeMaterial=new C({uniforms:{tDiffuse:{value:null},width:{value:s}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float width;
        varying vec2 vUv;

        void main() {
          vec2 texel = vec2(1.0 / float(textureSize(tDiffuse, 0).x), 1.0 / float(textureSize(tDiffuse, 0).y));
          vec2 offset = texel * width;
          
          vec4 center = texture2D(tDiffuse, vUv);
          vec4 right = texture2D(tDiffuse, vUv + vec2(offset.x, 0.0));
          vec4 up = texture2D(tDiffuse, vUv + vec2(0.0, offset.y));
          
          float diff = 0.0;
          diff += distance(center.rgb, right.rgb);
          diff += distance(center.rgb, up.rgb);
          gl_FragColor = vec4(vec3(step(0.0001, diff)), 1.0);
        }
      `}),this._combineMaterial=new C({uniforms:{tDiffuse:{value:null},tEdges:{value:null},edgeColor:{value:new I(8947848)}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform sampler2D tEdges;
        uniform vec3 edgeColor;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          vec4 edges = texture2D(tEdges, vUv);
          
          // Combine color with edges (edges are black, so we multiply)
          gl_FragColor = mix(color, vec4(edgeColor, 1.0), edges.r);
        }
      `}),this._fsQuad=new K(this._edgeMaterial),this._edgeRenderTarget=new F(1,1,{minFilter:N,magFilter:N,format:B});const i={minFilter:N,magFilter:N,format:B};if(this._renderer.three.capabilities.reversedDepthBuffer===!0){const a=new gt(1,1);a.type=vt,i.depthTexture=a}this._vertexColorRenderTarget=new F(1,1,i)}setSize(e,t){this._edgeRenderTarget.setSize(e,t),this._vertexColorRenderTarget.setSize(e,t)}setWidth(e){this._edgeMaterial.uniforms.width.value=e}render(e,t,s){const i=this._renderer.currentWorld,r=i.scene.three,a=i.scene.three,o=a.fog,l=a.background;a.fog=null,a.background=null;const n=[];if(a.traverse(c=>{c.isMesh&&c.receiveShadow&&(c.receiveShadow=!1,n.push(c))}),this._mode===0)this.setMaterialToMesh(!0),e.setRenderTarget(this._vertexColorRenderTarget),e.render(r,i.camera.three),this.setMaterialToMesh(!1);else if(this._mode===1){const c=r.overrideMaterial;r.overrideMaterial=this._overrideMaterial,e.setRenderTarget(this._vertexColorRenderTarget),e.render(r,i.camera.three),r.overrideMaterial=c}a.fog=o,a.background=l;for(const c of n)c.receiveShadow=!0;this._edgeMaterial.uniforms.tDiffuse.value=this._vertexColorRenderTarget.texture,this._fsQuad.material=this._edgeMaterial,e.setRenderTarget(this._edgeRenderTarget),this._fsQuad.render(e),this._combineMaterial.uniforms.tDiffuse.value=s.texture,this._combineMaterial.uniforms.tEdges.value=this._edgeRenderTarget.texture,this._fsQuad.material=this._combineMaterial,this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(t),this._fsQuad.render(e)}dispose(){this._edgeMaterial.dispose(),this._combineMaterial.dispose(),this._overrideMaterial.dispose(),this._fsQuad.dispose(),this._edgeRenderTarget.dispose(),this._vertexColorRenderTarget.dispose()}setMaterialToMesh(e){if(this._fragments.initialized){for(const[,t]of this._fragments.core.models.list)for(const[,s]of t.tiles)if(!("isLODGeometry"in s.geometry))if(e){s.userData.edgePassPreviousMaterial=s.material;const i=s.material;if(this.xray)s.material=this._overrideMaterial;else if(Array.isArray(i)){let r=s.userData.edgePassOverrideArray;(!r||r.length!==i.length)&&(r=new Array(i.length).fill(this._overrideMaterial),s.userData.edgePassOverrideArray=r),s.material=r}else s.material=[this._overrideMaterial]}else"edgePassPreviousMaterial"in s.userData&&(s.material=s.userData.edgePassPreviousMaterial)}}}const Ct=new WeakMap;function ke(d){const e=d.userData?.fullIndex;if(!e)return d.index;let t=Ct.get(e);return t||(t=new Ot(e,1),Ct.set(e,t)),t}const le=256,Z="default",Fs=`
  #include <clipping_planes_pars_vertex>
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <clipping_planes_vertex>
  }
`,Ls=`
  #include <clipping_planes_pars_fragment>
  uniform vec4 idColor;
  void main() {
    #include <clipping_planes_fragment>
    gl_FragColor = idColor;
  }
`;class zs extends J{debugShowMask=!1;_world;_maskTarget;_rootScene;_fsQuad;_debugQuad;_overlayBuffer;_overlayQuad;_blendQuad;_width;_height;_resolutionScale=1;_groups=new Map;_groupsById=new Map;_outlinedTiles=new Map;_nextId=1;_maxThickness=2;_paletteData;_paletteTexture;constructor(e,t,s){super(),this._world=s,this._width=e,this._height=t,this._maskTarget=new F(e,t,{minFilter:U,magFilter:U,format:B,type:Q,depthBuffer:!0}),this._rootScene=new xt,this._rootScene.background=null,this._paletteData=new Uint8Array(le*2*4),this._paletteTexture=new ye(this._paletteData,le,2,B,Q),this._paletteTexture.minFilter=U,this._paletteTexture.magFilter=U,this._paletteTexture.wrapS=Ge,this._paletteTexture.wrapT=Ge,this._paletteTexture.needsUpdate=!0,this._fsQuad=new K(new C({uniforms:{tDiffuse:{value:null},tMask:{value:null},tPalette:{value:this._paletteTexture},resolution:{value:new k(e,t)},maxThickness:{value:this._maxThickness}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          precision highp float;
          varying vec2 vUv;

          uniform sampler2D tDiffuse;
          uniform sampler2D tMask;
          uniform sampler2D tPalette;
          uniform vec2 resolution;
          uniform float maxThickness;

          // Palette is 256x2. y=0.25 (row 0) line, y=0.75 (row 1) fill.
          vec4 paletteLine(float id) {
            return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.25));
          }
          vec4 paletteFill(float id) {
            return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.75));
          }

          float readId(vec2 uv) {
            return floor(texture2D(tMask, uv).r * 255.0 + 0.5);
          }

          void main() {
            vec4 scene = texture2D(tDiffuse, vUv);
            float centerId = readId(vUv);

            if (centerId < 0.5) {
              gl_FragColor = scene;
              return;
            }

            // Inward outline: we are inside group centerId. Apply its fill,
            // and if any pixel within this group's thickness belongs to a
            // different id, we are near the group's interior silhouette and
            // paint the outline color. This guarantees outlines never spill
            // past the group's own footprint.
            vec4 fill = paletteFill(centerId);
            vec4 line = paletteLine(centerId);
            float t = line.a * 255.0;
            vec2 texel = 1.0 / resolution;

            vec3 rgb = mix(scene.rgb, fill.rgb, fill.a);

            // Inner outline of width t, sampled as a fixed 8-tap RING at
            // radius t (diagonals normalized by 1/sqrt(2) so they land at
            // radius t too). A box scan of the whole neighbourhood cost
            // O((2t+1)^2) dependent reads for every interior pixel (they never
            // hit the early break), which made a close-up selection filling
            // the screen the frame's bottleneck. The ring is O(1) whatever the
            // thickness: a tap of length t hitting a different id means a
            // boundary is within t along that direction, so it paints the
            // same solid t-wide inward band.
            float edge = 0.0;
            if (t >= 0.5) {
              vec2 o = texel * t;
              const float D = 0.70710678;
              if      (readId(vUv + vec2( o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0,  o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0, -o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D, -o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D, -o.y * D)) != centerId) edge = 1.0;
            }

            if (edge > 0.5) rgb = line.rgb;
            gl_FragColor = vec4(rgb, 1.0);
          }
        `})),this._debugQuad=new K(new C({uniforms:{tMask:{value:null}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform sampler2D tMask;
          varying vec2 vUv;
          void main() {
            float id = texture2D(tMask, vUv).r;
            gl_FragColor = vec4(vec3(id * 8.0), 1.0);
          }
        `})),this._overlayBuffer=new F(1,1,{minFilter:N,magFilter:N,format:B,type:Q,depthBuffer:!1,stencilBuffer:!1}),this._overlayQuad=new K(new C({blending:V,depthTest:!1,depthWrite:!1,uniforms:{tMask:{value:null},tPalette:{value:this._paletteTexture},resolution:{value:new k(e,t)},outlineScale:{value:1}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D tMask;
          uniform sampler2D tPalette;
          uniform vec2 resolution;
          uniform float outlineScale;

          vec4 paletteLine(float id) { return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.25)); }
          vec4 paletteFill(float id) { return texture2D(tPalette, vec2((id + 0.5) / 256.0, 0.75)); }
          float readId(vec2 uv) { return floor(texture2D(tMask, uv).r * 255.0 + 0.5); }

          void main() {
            float centerId = readId(vUv);
            if (centerId < 0.5) { gl_FragColor = vec4(0.0); return; }

            vec4 fill = paletteFill(centerId);
            vec4 line = paletteLine(centerId);
            // Thickness in scaled pixels: full-resolution thickness x scale,
            // at least 1 so a thin outline survives the downscale (0 stays 0).
            float tFull = line.a * 255.0;
            float t = tFull < 0.5 ? 0.0 : max(1.0, tFull * outlineScale);
            vec2 texel = 1.0 / resolution;

            float edge = 0.0;
            if (t >= 0.5) {
              vec2 o = texel * t;
              const float D = 0.70710678;
              if      (readId(vUv + vec2( o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x, 0.0)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0,  o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(0.0, -o.y)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D,  o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2( o.x * D, -o.y * D)) != centerId) edge = 1.0;
              else if (readId(vUv + vec2(-o.x * D, -o.y * D)) != centerId) edge = 1.0;
            }

            vec3 col = edge > 0.5 ? line.rgb : fill.rgb;
            float a = edge > 0.5 ? 1.0 : fill.a;
            gl_FragColor = vec4(col * a, a);
          }
        `})),this._blendQuad=new K(new C({blending:V,depthTest:!1,depthWrite:!1,uniforms:{tDiffuse:{value:null},tOverlay:{value:null}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D tDiffuse;
          uniform sampler2D tOverlay;
          void main() {
            vec4 scene = texture2D(tDiffuse, vUv);
            vec4 ov = texture2D(tOverlay, vUv);
            gl_FragColor = vec4(scene.rgb * (1.0 - ov.a) + ov.rgb, scene.a);
          }
        `})),this.addGroup(Z,{outlineColor:new I(16762880),fillColor:new I(16776960),fillOpacity:.3,thickness:2})}addGroup(e,t){let s=this._groups.get(e);if(s)return t&&this.configureGroup(e,t),s;const i=this.allocateId(),r=t?.priority??0,a=new C({uniforms:{idColor:{value:new Rt(i/255,0,0,1)}},clipping:!0,vertexShader:Fs,fragmentShader:Ls,depthTest:!0,depthWrite:!0,transparent:!1,polygonOffset:r!==0,polygonOffsetFactor:-r,polygonOffsetUnits:-r}),o=new Nt;return o.name=`outline-group:${e}`,o.renderOrder=r,this._rootScene.add(o),s={id:i,name:e,container:o,material:a,outlineColor:t?.outlineColor?.clone()??new I(16762880),fillColor:t?.fillColor?.clone()??new I(16776960),fillOpacity:t?.fillOpacity??.3,thickness:t?.thickness??2,priority:r},this._groups.set(e,s),this._groupsById.set(i,s),this.writePaletteEntry(s),this.updateMaxThickness(),s}configureGroup(e,t){const s=this._groups.get(e);s&&(t.outlineColor&&s.outlineColor.copy(t.outlineColor),t.fillColor&&s.fillColor.copy(t.fillColor),t.fillOpacity!==void 0&&(s.fillOpacity=t.fillOpacity),t.thickness!==void 0&&(s.thickness=t.thickness),t.priority!==void 0&&(s.priority=t.priority,s.material.polygonOffset=t.priority!==0,s.material.polygonOffsetFactor=-t.priority,s.material.polygonOffsetUnits=-t.priority,s.container.renderOrder=t.priority),this.writePaletteEntry(s),this.updateMaxThickness())}removeGroup(e){if(e===Z)return;const t=this._groups.get(e);if(t){for(const[s,i]of this._outlinedTiles)i.groupName===e&&(i.proxy.removeFromParent(),this._outlinedTiles.delete(s));for(;t.container.children.length;)t.container.children[0].removeFromParent();t.container.removeFromParent(),t.material.dispose(),this._groups.delete(e),this._groupsById.delete(t.id),this.clearPaletteEntry(t.id),this.updateMaxThickness()}}hasGroup(e){return this._groups.has(e)}getGroup(e){return this._groups.get(e)}addMeshToGroup(e,t){let s=this._groups.get(t);s||(s=this.addGroup(t)),e.material=s.material,s.container.add(e)}attachOutlinedTile(e,t,s=Z){let i=this._groups.get(s);i||(i=this.addGroup(s));const r=this.getOutlinedTileKey(e,s),a=this._outlinedTiles.get(r);if(a){const m=a.proxy.geometry,h=ke(e.geometry);h&&m.index!==h&&m.setIndex(h),m.clearGroups(),this.fillProxyGroups(m,t);return}const o=e.geometry,l=new je;l.attributes=o.attributes;const n=ke(o);n&&l.setIndex(n),l.boundingBox=o.boundingBox,l.boundingSphere=o.boundingSphere,this.fillProxyGroups(l,t);const c=new Pe(l,[i.material]);c.matrixAutoUpdate=!1,c.matrixWorldAutoUpdate=!1,c.frustumCulled=!1,c.matrixWorld.copy(e.matrixWorld),i.container.add(c),this._outlinedTiles.set(r,{source:e,proxy:c,groupName:s})}detachOutlinedTile(e,t){if(t!==void 0){const s=this.getOutlinedTileKey(e,t),i=this._outlinedTiles.get(s);if(!i)return;i.proxy.removeFromParent(),this._outlinedTiles.delete(s);return}for(const[s,i]of this._outlinedTiles)i.source===e&&(i.proxy.removeFromParent(),this._outlinedTiles.delete(s))}hasOutlinedTile(e,t){if(t!==void 0)return this._outlinedTiles.has(this.getOutlinedTileKey(e,t));for(const s of this._outlinedTiles.values())if(s.source===e)return!0;return!1}getGroupContainer(e){let t=this._groups.get(e);return t||(t=this.addGroup(e)),t.container}getGroupScene(e){return this.getGroupContainer(e)}listGroups(){return[...this._groups.keys()]}get scene(){return this._groups.get(Z).container}get outlineColor(){return this._groups.get(Z).outlineColor}set outlineColor(e){this.configureGroup(Z,{outlineColor:e})}get thickness(){return this._groups.get(Z).thickness}set thickness(e){this.configureGroup(Z,{thickness:e})}get fillColor(){return this._groups.get(Z).fillColor}set fillColor(e){this.configureGroup(Z,{fillColor:e})}get fillOpacity(){return this._groups.get(Z).fillOpacity}set fillOpacity(e){this.configureGroup(Z,{fillOpacity:e})}get resolutionScale(){return this._resolutionScale}set resolutionScale(e){const t=Math.min(1,Math.max(.25,e));t!==this._resolutionScale&&(this._resolutionScale=t,this.applyResolution())}setSize(e,t){this._width=e,this._height=t,this.applyResolution()}applyResolution(){const e=this._resolutionScale,t=Math.max(1,this._width),s=Math.max(1,this._height),i=e>=1?t:Math.max(1,Math.floor(t*e)),r=e>=1?s:Math.max(1,Math.floor(s*e));if(this._maskTarget.setSize(i,r),this._fsQuad.material.uniforms.resolution.value.set(i,r),e<1){this._overlayBuffer.setSize(i,r);const o=this._overlayQuad.material;o.uniforms.resolution.value.set(i,r),o.uniforms.outlineScale.value=e}else this._overlayBuffer.setSize(1,1)}_withoutData=new Set;hasData(e){const t=e.geometry;if(!t)return!0;const s=Object.values(t.attributes??{}),i=t.index;return s.every(r=>r&&(r.array!==void 0||r.data?.array!==void 0))&&(!i||i.array!==void 0)}leaveOutWhatHasNoData(){this._rootScene.traverse(e=>{!e.visible||this.hasData(e)||(e.visible=!1,this._withoutData.add(e))})}showAgainWhatHasData(){if(this._withoutData.size!==0)for(const e of[...this._withoutData]){if(!e.parent||e.visible){this._withoutData.delete(e);continue}this.hasData(e)&&(e.visible=!0,this._withoutData.delete(e))}}syncLocalClippingPlanes(){const e=this._world.renderer?.clippingPlanes??[];let t=null;for(const s of e)s.isLocal&&(t||(t=[]),t.push(s));for(const s of this._groups.values()){const i=s.material.clippingPlanes;if(!t){i&&i.length&&(s.material.clippingPlanes=null);continue}i&&i.length===t.length&&i.every((a,o)=>a===t[o])||(s.material.clippingPlanes=t)}}render(e,t,s){const i=this._world.camera.three,r=e.getClearColor(new I),a=e.getClearAlpha();if(e.setClearColor(0,0),e.setRenderTarget(this._maskTarget),e.clear(!0,!0,!1),this._outlinedTiles.size>0)for(const n of this._outlinedTiles.values())n.proxy.matrixWorld.copy(n.source.matrixWorld);this.syncLocalClippingPlanes(),this.showAgainWhatHasData();try{e.render(this._rootScene,i)}catch(n){this.leaveOutWhatHasNoData(),console.error("[outline] a ghost could not be drawn and was left out:",n)}if(e.setClearColor(r,a),this.debugShowMask){const n=this._debugQuad.material;n.uniforms.tMask.value=this._maskTarget.texture,this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(t),this._debugQuad.render(e);return}if(this._resolutionScale>=1){const n=this._fsQuad.material;n.uniforms.tDiffuse.value=s.texture,n.uniforms.tMask.value=this._maskTarget.texture,n.uniforms.maxThickness.value=this._maxThickness,this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(t),this._fsQuad.render(e);return}const o=this._overlayQuad.material;o.uniforms.tMask.value=this._maskTarget.texture,e.setRenderTarget(this._overlayBuffer),this._overlayQuad.render(e);const l=this._blendQuad.material;l.uniforms.tDiffuse.value=s.texture,l.uniforms.tOverlay.value=this._overlayBuffer.texture,this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(t),this._blendQuad.render(e)}dispose(){this._fsQuad.material.dispose(),this._debugQuad.material.dispose(),this._overlayQuad.material.dispose(),this._blendQuad.material.dispose(),this._fsQuad.dispose(),this._debugQuad.dispose(),this._overlayQuad.dispose(),this._blendQuad.dispose(),this._maskTarget.dispose(),this._overlayBuffer.dispose(),this._withoutData.clear(),this._paletteTexture.dispose();for(const e of this._outlinedTiles.values())e.proxy.removeFromParent();this._outlinedTiles.clear();for(const e of this._groups.values()){for(;e.container.children.length;)e.container.children[0].removeFromParent();e.container.removeFromParent(),e.material.dispose()}this._groups.clear(),this._groupsById.clear()}fillProxyGroups(e,t){const s=t.position,i=t.size,r=Math.min(s.length,i.length);for(let a=0;a<r;a++){const o=s[a],l=i[a],n=l===4294967295?1/0:l;e.addGroup(o,n,0)}}getOutlinedTileKey(e,t){return`${t}:${e.uuid}`}allocateId(){for(let e=0;e<le-1;e++){const t=(this._nextId-1+e)%(le-1)+1;if(!this._groupsById.has(t))return this._nextId=t%(le-1)+1,t}throw new Error(`SimpleOutlinePass: cannot allocate outline group id, ${le-1} groups active.`)}writePaletteEntry(e){const t=e.id,s=t*4,i=(le+t)*4,r=this._paletteData,a=o=>Math.max(0,Math.min(255,Math.round(o)));r[s]=a(e.outlineColor.r*255),r[s+1]=a(e.outlineColor.g*255),r[s+2]=a(e.outlineColor.b*255),r[s+3]=a(e.thickness),r[i]=a(e.fillColor.r*255),r[i+1]=a(e.fillColor.g*255),r[i+2]=a(e.fillColor.b*255),r[i+3]=a(e.fillOpacity*255),this._paletteTexture.needsUpdate=!0}clearPaletteEntry(e){const t=this._paletteData,s=e*4,i=(le+e)*4;for(let r=0;r<4;r++)t[s+r]=0;for(let r=0;r<4;r++)t[i+r]=0;this._paletteTexture.needsUpdate=!0}updateMaxThickness(){let e=1;for(const t of this._groups.values())t.thickness>e&&(e=t.thickness);this._maxThickness=Math.max(1,Math.round(e))}}class Us extends J{materialToExclude=new fs({color:0});_excludedMaterials=new Set;_originalMaterials=new Map;_renderer;_world;_fsQuad;_combineMaterial;_excludedRenderTarget;constructor(e,t){super(),this._renderer=e,this._world=t,this._excludedRenderTarget=new F(1,1,{minFilter:N,magFilter:N,format:B}),this._combineMaterial=new C({uniforms:{tDiffuse:{value:null},tExcluded:{value:null}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform sampler2D tExcluded;
        varying vec2 vUv;

        void main() {
          vec4 inputColor = texture2D(tDiffuse, vUv);
          vec4 excludedColor = texture2D(tExcluded, vUv);
          
          // If excluded pixel is black (or very dark), use input color
          // Otherwise, use excluded color
          float excludedLuminance = (excludedColor.r + excludedColor.g + excludedColor.b) / 3.0;
          float threshold = 0.01; // Adjust this threshold as needed
          
          if (excludedLuminance < threshold) {
            gl_FragColor = inputColor;
          } else {
            gl_FragColor = excludedColor;
          }
        }
      `}),this._fsQuad=new K(this._combineMaterial)}addExcludedMaterial(e){this._excludedMaterials.add(e)}removeExcludedMaterial(e){this._excludedMaterials.delete(e)}clearExcludedMaterials(){this._excludedMaterials.clear()}get excludedMaterials(){return Array.from(this._excludedMaterials)}setSize(e,t){this._excludedRenderTarget.setSize(e,t)}render(e,t,s){const i=this._world.scene.three,r=this._world.camera.three,a=e.getClearColor(new I),o=e.getClearAlpha();e.setClearColor(0,0),this._substituteMaterials(i),e.setRenderTarget(this._excludedRenderTarget),e.render(i,r),this._restoreMaterials(),this._combineMaterial.uniforms.tDiffuse.value=s.texture,this._combineMaterial.uniforms.tExcluded.value=this._excludedRenderTarget.texture,this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(t),this._fsQuad.render(e),e.setClearColor(a,o)}_substituteMaterials(e){if(e instanceof Pe){const t=e.material;if(Array.isArray(t)){for(const s of t)if("isLodMaterial"in s)return}else if("isLodMaterial"in t)return;this._excludedMaterials.has(t)||(this._originalMaterials.set(e,t),e.material=this.materialToExclude)}for(const t of e.children)this._substituteMaterials(t)}_restoreMaterials(){for(const[e,t]of this._originalMaterials)e.material=t;this._originalMaterials.clear()}dispose(){this.materialToExclude.dispose(),this._combineMaterial.dispose(),this._fsQuad.dispose(),this._excludedRenderTarget.dispose(),this._excludedMaterials.clear(),this._originalMaterials.clear()}}class Ws extends J{scene;camera;overrideMaterial;clearColor;clearAlpha;clearDepth;needsSwap;isolatedMaterials=[];_oldClearColor;constructor(e,t,s=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new I}render(e,t,s){for(const o of this.isolatedMaterials)o.userData.wasVisibleBasePass!==void 0&&(o.visible=o.userData.wasVisibleBasePass);const i=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth===!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=i;for(const o of this.isolatedMaterials)o.userData.wasVisibleBasePass=o.visible,o.visible=!1}}function Bs(){return new C({clipping:!0,uniforms:{glossExponent:{value:10},fresnelExponent:{value:6},glossFactor:{value:.2},fresnelFactor:{value:1}},vertexShader:`
    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_vertex>
  
    void main() {
       #include <begin_vertex>
       
       vec4 absPosition = vec4(position, 1.0);
       vNormal = normal;
       
       #ifdef USE_INSTANCING
          absPosition = instanceMatrix * absPosition;
          vNormal = (instanceMatrix * vec4(normal, 0.)).xyz;
       #endif
       
       absPosition = modelMatrix * absPosition;
       vNormal = (normalize(modelMatrix * vec4(vNormal, 0.))).xyz;
       
       gl_Position = projectionMatrix * viewMatrix * absPosition;
       
       vCameraPosition = cameraPosition;
       vPosition = absPosition.xyz;
       
       #include <project_vertex>
       #include <clipping_planes_vertex>
    }
    `,fragmentShader:`
    uniform float glossExponent;
    uniform float glossFactor;
    uniform float fresnelExponent;
    uniform float fresnelFactor;

    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_fragment>
  
    void main() {
      #include <clipping_planes_fragment>
      vec3 cameraPixelVec = normalize(vCameraPosition - vPosition);
      float dotProduct = dot(vNormal, cameraPixelVec);

      // Use abs() for both gloss and fresnel to handle DoubleSide materials
      // On back faces, dotProduct is negative, which breaks the fresnel calculation

      float absDotProduct = abs(dotProduct);
      float gloss = absDotProduct;

      // Use absDotProduct instead of dotProduct to prevent values > 1.0
      
      float fresnel = pow(1.0 - absDotProduct, fresnelExponent) * fresnelFactor;

      gloss = pow(gloss, glossExponent) * glossFactor;

      float result = gloss + fresnel;

      gl_FragColor = vec4(result, result, result, 1.);
    }
    `})}class Is extends J{resolution;renderScene;renderCamera;fsQuad;glossOverrideMaterial;glossBuffer;_glossEnabled=!0;get glossEnabled(){return this._glossEnabled}set glossEnabled(e){this._glossEnabled=e;const t=this.fsQuad.material;t.uniforms.glossEnabled.value=e?1:0}get minGloss(){return this.fsQuad.material.uniforms.minGloss.value}set minGloss(e){const t=this.fsQuad.material;t.uniforms.minGloss.value=e}get maxGloss(){return this.fsQuad.material.uniforms.maxGloss.value}set maxGloss(e){const t=this.fsQuad.material;t.uniforms.maxGloss.value=e}get glossExponent(){return this.glossOverrideMaterial.uniforms.glossExponent.value}set glossExponent(e){this.glossOverrideMaterial.uniforms.glossExponent.value=e}get fresnelExponent(){return this.glossOverrideMaterial.uniforms.fresnelExponent.value}set fresnelExponent(e){this.glossOverrideMaterial.uniforms.fresnelExponent.value=e}get glossFactor(){return this.glossOverrideMaterial.uniforms.glossFactor.value}set glossFactor(e){this.glossOverrideMaterial.uniforms.glossFactor.value=e}get fresnelFactor(){return this.glossOverrideMaterial.uniforms.fresnelFactor.value}set fresnelFactor(e){this.glossOverrideMaterial.uniforms.fresnelFactor.value=e}constructor(e,t){super(),this.renderScene=t.scene.three,this.renderCamera=t.camera.three,this.resolution=new k(e.x,e.y),this.fsQuad=new K,this.fsQuad.material=this.createGlossMaterial(),this.glossBuffer=this.newRenderTarget();const s=Bs();this.glossOverrideMaterial=s}dispose(){this.glossBuffer.dispose(),this.glossOverrideMaterial.dispose(),this.fsQuad.dispose()}setSize(e,t){this.glossBuffer.setSize(e,t),this.resolution.set(e,t),this.fsQuad.material.uniforms.screenSize.value.set(this.resolution.x,this.resolution.y,1/this.resolution.x,1/this.resolution.y)}render(e,t,s){const i=t.depthBuffer;t.depthBuffer=!1;const r=this.renderScene.overrideMaterial,a=this.renderScene.background;this.renderScene.background=null,e.setRenderTarget(this.glossBuffer),this.renderScene.overrideMaterial=this.glossOverrideMaterial,e.render(this.renderScene,this.renderCamera),this.renderScene.overrideMaterial=r,this.renderScene.background=a;const o=this.fsQuad.material;o.uniforms.glossBuffer.value=this.glossBuffer.texture,o.uniforms.sceneColorBuffer.value=s.texture,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.fsQuad.render(e)),t.depthBuffer=i}get vertexShader(){return`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `}get fragmentShader(){return`
      uniform sampler2D sceneColorBuffer;
      uniform sampler2D glossBuffer;
      uniform vec4 screenSize;
      uniform float glossEnabled;
      uniform float minGloss;
      uniform float maxGloss;


      varying vec2 vUv;

      vec4 getValue(sampler2D buffer, int x, int y) {
        return texture2D(buffer, vUv + screenSize.zw * vec2(x, y));
      }

      void main() {
        vec4 sceneColor = getValue(sceneColorBuffer, 0, 0);
        
        // Apply gloss effect
        vec3 gloss = getValue(glossBuffer, 0, 0).xyz;
        // Prevent the gloss from being zero, which would break normalize() later
        gloss = max(gloss, vec3(0.001));
        
        vec3 glossEffect = gloss * glossEnabled;

        // Map glossEffect to range [minGloss, maxGloss]
        // All dimensions of the glossEffect are the same, so we can use the x dimension.
        float mappedGloss = minGloss + (maxGloss - minGloss) * glossEffect.x;


        glossEffect = normalize(glossEffect) * mappedGloss;

        vec4 glossedColor = sceneColor + vec4(glossEffect, 0.0);

        // Prevent the glossed color from being darker than zero
        glossedColor = max(glossedColor, vec4(0.0, 0.0, 0.0, sceneColor.a));
        
        gl_FragColor = glossedColor;
      }
    `}createGlossMaterial(){return new C({uniforms:{sceneColorBuffer:{value:null},glossBuffer:{value:null},glossEnabled:{value:this._glossEnabled?1:0},minGloss:{value:-.12},maxGloss:{value:.8},screenSize:{value:new Rt(this.resolution.x,this.resolution.y,1/this.resolution.x,1/this.resolution.y)}},vertexShader:this.vertexShader,fragmentShader:this.fragmentShader})}newRenderTarget(){const e=new F(this.resolution.x,this.resolution.y);return e.texture.colorSpace="srgb-linear",e.texture.format=B,e.texture.type=ie,e.texture.minFilter=U,e.texture.magFilter=U,e.texture.generateMipmaps=!1,e.stencilBuffer=!1,e}}class Gs{renderTarget;depthTexture;_width;_height;constructor(e,t){this._width=Math.max(1,Math.floor(e)),this._height=Math.max(1,Math.floor(t)),this.depthTexture=new gt(this._width,this._height),this.depthTexture.type=vt,this.depthTexture.format=ps,this.depthTexture.minFilter=U,this.depthTexture.magFilter=U,this.renderTarget=new F(this._width,this._height,{count:3,depthTexture:this.depthTexture,minFilter:U,magFilter:U,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1});const[s,i,r]=this.renderTarget.textures;s.name="capturedColor",s.type=ie,s.format=B,s.minFilter=N,s.magFilter=N,i.name="gNormalOcta",i.type=ie,i.format=Ft,i.internalFormat="RG16F",r.name="gFaceId",r.type=Q,r.format=B}get width(){return this._width}get height(){return this._height}get colorTexture(){return this.renderTarget.textures[0]}get normalTexture(){return this.renderTarget.textures[1]}get faceIdTexture(){return this.renderTarget.textures[2]}setSize(e,t){this._width=Math.max(1,Math.floor(e)),this._height=Math.max(1,Math.floor(t)),this.renderTarget.setSize(this._width,this._height),this.depthTexture.image.width=this._width,this.depthTexture.image.height=this._height,this.depthTexture.needsUpdate=!0}dispose(){this.renderTarget.dispose(),this.depthTexture.dispose()}}class Bt{target;_clearColor=new I;_nonEmitters=[];_opaque=[];_translucent=[];_depthWriteSaved=[];onPixels=null;translucentAsOpaque=!1;noOpacityIsGlass=!1;translucentEdges=!1;seeThrough=!1;_edgesTarget=null;_edgesScene=null;_edgesMaterial=null;_edgesCamera=new pt(-1,1,1,-1,0,1);_madeOpaque=[];constructor(e,t){this.target=new Gs(e,t)}setSize(e,t){this.target.setSize(e,t)}render(e,t,s,i=!0,r=!1){const a=e.getContext(),o=e.autoClear,l=e.getRenderTarget(),n=t.background;t.background=null,e.getClearColor(this._clearColor);const c=e.getClearAlpha(),p=this.__clock??(()=>{});if(this.classify(t),p("  classify"),e.autoClear=!1,e.setRenderTarget(this.target.renderTarget),this.onPixels?.(this.target.renderTarget.width,this.target.renderTarget.height),i&&r?a.clear(a.DEPTH_BUFFER_BIT):i&&(a.clearBufferfv(a.COLOR,0,[this._clearColor.r,this._clearColor.g,this._clearColor.b,c]),a.clearBufferfv(a.COLOR,1,[0,0,0,0]),a.clearBufferfv(a.COLOR,2,[1,1,1,0]),a.clear(a.DEPTH_BUFFER_BIT)),this.setVisible(this._nonEmitters,!1),p("  ocultar"),this.setVisible(this._translucent,!1),r&&a.drawBuffers([a.NONE,a.NONE,a.NONE]),e.render(t,s),r&&a.drawBuffers([a.COLOR_ATTACHMENT0,a.COLOR_ATTACHMENT1,a.COLOR_ATTACHMENT2]),p("  opacos"),this.setVisible(this._translucent,!0),!r&&this._translucent.length>0&&globalThis.__sinTranslucidos!==!0){this.setVisible(this._opaque,!1),this.suppressDepthWrite();try{a.drawBuffers([a.COLOR_ATTACHMENT0,a.NONE,a.NONE]),e.render(t,s)}finally{a.drawBuffers([a.COLOR_ATTACHMENT0,a.COLOR_ATTACHMENT1,a.COLOR_ATTACHMENT2]),this.restoreDepthWrite(),this.setVisible(this._opaque,!0)}}!r&&this.translucentEdges&&(this._translucent.length>0||this.seeThrough)&&this.translucentEdgesInto(e,t,s,a),p("  translucidos"),this.restoreOpaque(),this.setVisible(this._nonEmitters,!0),this._nonEmitters.length=0,this._opaque.length=0,this._translucent.length=0,e.setRenderTarget(l),e.autoClear=o,t.background=n}classify(e){e.traverse(t=>{const s=t.material;if(!(!s||!t.visible)){if(!this.emits(s)){this._nonEmitters.push(t);return}for(const i of Array.isArray(s)?s:[s])i&&Qt(i);this.isTranslucent(s)&&(!this.translucentAsOpaque||this.unseen(s)&&!this.noOpacityIsGlass)?this._translucent.push(t):this.isTranslucent(s)?(this.makeOpaque(s),this._opaque.push(t)):this._opaque.push(t)}})}unseen(e){const t=Array.isArray(e)?e:[e];return t.length>0&&t.every(s=>!s||s.opacity<=0)}makeOpaque(e){for(const t of Array.isArray(e)?e:[e])if(!(!t||this._madeOpaque.some(s=>s.material===t))){if(t.opacity<=0&&!this.noOpacityIsGlass){this._madeOpaque.push({material:t,transparent:t.transparent,opacity:t.opacity,depthWrite:t.depthWrite,visible:t.visible}),t.visible=!1;continue}this._madeOpaque.push({material:t,transparent:t.transparent,opacity:t.opacity,depthWrite:t.depthWrite}),t.transparent=!1,t.opacity=1,t.depthWrite=!0}}restoreOpaque(){for(const e of this._madeOpaque)e.material.transparent=e.transparent,e.material.opacity=e.opacity,e.material.depthWrite=e.depthWrite,e.visible!==void 0&&(e.material.visible=e.visible);this._madeOpaque.length=0}setVisible(e,t){for(const s of e)s.visible=t}emits(e){return Array.isArray(e)?e.some(t=>!!t?.userData?.hasCaptureEmission):!!e?.userData?.hasCaptureEmission}isTranslucent(e){const t=s=>!!s&&(s.transparent===!0||typeof s.opacity=="number"&&s.opacity<1);return Array.isArray(e)?e.some(t):t(e)}suppressDepthWrite(){for(const e of this._translucent){const t=e.material,s=Array.isArray(t)?t:[t];for(const i of s)i?.userData?.hasCaptureEmission&&(this._depthWriteSaved.push({material:i,value:i.depthWrite}),i.depthWrite=!1)}}restoreDepthWrite(){for(const e of this._depthWriteSaved)e.material.depthWrite=e.value;this._depthWriteSaved.length=0}translucentEdgesInto(e,t,s,i){const r=this.target.renderTarget,{width:a,height:o}=this.target;if(this._edgesTarget&&(this._edgesTarget.width!==a||this._edgesTarget.height!==o)&&this.edgesTargetDropped(),!this._edgesTarget){this._edgesTarget=new F(a,o,{count:3,depthTexture:this.target.depthTexture,minFilter:U,magFilter:U,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1});const[p,m,h]=this._edgesTarget.textures;p.type=ie,m.type=ie,m.format=Ft,m.internalFormat="RG16F",h.type=Q,h.format=B}if(!this._edgesMaterial){this._edgesMaterial=new Dt({glslVersion:pe,uniforms:{faces:{value:null}},vertexShader:`
          in vec3 position;
          void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
        `,fragmentShader:`
          precision highp float;
          precision highp sampler2D;
          uniform sampler2D faces;
          layout(location = 2) out vec4 seed;
          bool differs(vec4 a, vec4 b) {
            if (a.a < 0.5 && b.a < 0.5) return false;   // neither is a see-through surface
            return any(greaterThan(abs(a.rgb - b.rgb), vec3(0.5 / 255.0)));
          }
          void main() {
            ivec2 at = ivec2(gl_FragCoord.xy);
            ivec2 last = textureSize(faces, 0) - 1;
            vec4 here = texelFetch(faces, at, 0);
            vec4 right = texelFetch(faces, min(at + ivec2(1, 0), last), 0);
            vec4 up = texelFetch(faces, min(at + ivec2(0, 1), last), 0);
            if (!differs(here, right) && !differs(here, up)) discard;
            // Unlike its neighbours and never the empty id (1,1,1) nor near zero: a hash of the pixel.
            vec3 h = fract(sin(vec3(dot(vec2(at), vec2(12.9898, 78.233)), dot(vec2(at), vec2(39.346, 11.135)),
              dot(vec2(at), vec2(73.156, 52.235)))) * 43758.5453);
            seed = vec4(0.1 + 0.8 * h, 1.0);
          }
        `,depthTest:!1,depthWrite:!1,blending:mt,blendEquation:ue,blendSrc:ct,blendDst:ce,blendSrcAlpha:ce,blendDstAlpha:ct});const p=new je;p.setAttribute("position",new Ot(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const m=new Pe(p,this._edgesMaterial);m.frustumCulled=!1,this._edgesScene=new xt,this._edgesScene.add(m)}const l=this._translucent.filter(p=>this.unseen(p.material)),n=l.length<this._translucent.length;if(!n&&!this.seeThrough)return;e.setRenderTarget(this._edgesTarget),i.drawBuffers([i.NONE,i.NONE,i.COLOR_ATTACHMENT2]),i.clearBufferfv(i.COLOR,2,[0,0,0,0]);const c=e.state.buffers.depth;c.setMask(!1),c.setLocked(!0),n&&(this.setVisible(this._opaque,!1),this.setVisible(l,!1),e.render(t,s),this.setVisible(l,!0),this.setVisible(this._opaque,!0)),this.seeThrough&&(this.blended(ms,()=>{Oe(!0);try{e.render(t,s)}finally{Oe(!1)}}),e.setRenderTarget(r),i.drawBuffers([i.COLOR_ATTACHMENT0,i.NONE,i.NONE]),this.blended(Lt,()=>{Oe("veil");try{e.render(t,s)}finally{Oe(!1),i.drawBuffers([i.COLOR_ATTACHMENT0,i.COLOR_ATTACHMENT1,i.COLOR_ATTACHMENT2])}})),c.setLocked(!1),c.setMask(!0),e.setRenderTarget(r),i.drawBuffers([i.NONE,i.NONE,i.COLOR_ATTACHMENT2]),this._edgesMaterial.uniforms.faces.value=this._edgesTarget.textures[2],e.render(this._edgesScene,this._edgesCamera),i.drawBuffers([i.COLOR_ATTACHMENT0,i.COLOR_ATTACHMENT1,i.COLOR_ATTACHMENT2])}blended(e,t){const s=new Map;for(const i of this._opaque){const r=i.material;for(const a of Array.isArray(r)?r:[r])!a||s.has(a)||(s.set(a,[a.blending,a.transparent]),a.blending=e,a.transparent=!0)}try{t()}finally{for(const[i,[r,a]]of s)i.blending=r,i.transparent=a}}edgesTargetDropped(){this._edgesTarget&&(this._edgesTarget.depthTexture=null,this._edgesTarget.dispose(),this._edgesTarget=null)}dispose(){this.edgesTargetDropped(),this.target.dispose(),this._edgesMaterial?.dispose()}}const ks=`
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uOcclusion;        // R = AO
  uniform sampler2D uHiZ;       // R = linear eye depth (level 0)
  uniform sampler2D uNormal;    // RG = octahedral view normal
  uniform vec2 uTexel;          // 1 / resolution
  uniform vec2 uDirection;      // (1,0) horizontal | (0,1) vertical
  uniform int uRadius;          // taps each side
  uniform float uDepthSigma;    // depth edge sensitivity (linear units)
  uniform float uNormalSigma;   // crease sensitivity

  vec3 octDecode(vec2 e) {
    vec3 n = vec3(e.xy, 1.0 - abs(e.x) - abs(e.y));
    if (n.z < 0.0) {
      n.xy = (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
    }
    return normalize(n);
  }

  void main() {
    float aoC = texture(uOcclusion, vUv).r;
    float depthC = texture(uHiZ, vUv).r;
    vec3 nC = octDecode(texture(uNormal, vUv).rg);

    float sum = aoC;          // centre tap, weight 1
    float wsum = 1.0;

    for (int i = 1; i <= 16; i++) {
      if (i > uRadius) break;
      float spatial = exp(-float(i * i) / (2.0 * float(uRadius) * float(uRadius)));
      for (int s = -1; s <= 1; s += 2) {
        vec2 off = uDirection * uTexel * float(i * s);
        vec2 uv = vUv + off;
        float ao = texture(uOcclusion, uv).r;
        float depth = texture(uHiZ, uv).r;
        vec3 n = octDecode(texture(uNormal, uv).rg);

        float dd = (depth - depthC) / max(uDepthSigma, 1e-4);
        float wDepth = exp(-dd * dd);
        float nDiff = 1.0 - max(dot(nC, n), 0.0);
        float wNormal = exp(-(nDiff * nDiff) / max(uNormalSigma * uNormalSigma, 1e-6));

        float w = spatial * wDepth * wNormal;
        sum += ao * w;
        wsum += w;
      }
    }

    outColor = vec4(sum / max(wsum, 1e-4), 0.0, 0.0, 1.0);
  }
`,_t={radius:5,depthSigma:.5,normalSigma:.3};class Hs{settings;outputTarget;_scratch;_material;_quad;_width;_height;constructor(e,t,s=_t){this._width=Math.max(1,Math.floor(e)),this._height=Math.max(1,Math.floor(t)),this.settings={...s};const i={format:zt,type:Q,minFilter:N,magFilter:N,depthBuffer:!1,stencilBuffer:!1};this._scratch=new F(this._width,this._height,i),this.outputTarget=new F(this._width,this._height,i),this._scratch.texture.name="aoDenoiseH",this.outputTarget.texture.name="aoDenoised",this._material=new C({glslVersion:pe,vertexShader:`
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,fragmentShader:ks,uniforms:{uOcclusion:{value:null},uHiZ:{value:null},uNormal:{value:null},uTexel:{value:new k(1/this._width,1/this._height)},uDirection:{value:new k(1,0)},uRadius:{value:this.settings.radius},uDepthSigma:{value:this.settings.depthSigma},uNormalSigma:{value:this.settings.normalSigma}},depthTest:!1,depthWrite:!1}),this._quad=new fe(this._material)}get texture(){return this.outputTarget.texture}setSize(e,t){this._width=Math.max(1,Math.floor(e)),this._height=Math.max(1,Math.floor(t)),this._scratch.setSize(this._width,this._height),this.outputTarget.setSize(this._width,this._height),this._material.uniforms.uTexel.value.set(1/this._width,1/this._height)}render(e,t,s,i){const r=this._material.uniforms;r.uHiZ.value=s,r.uNormal.value=i,r.uRadius.value=this.settings.radius,r.uDepthSigma.value=this.settings.depthSigma,r.uNormalSigma.value=this.settings.normalSigma,r.uOcclusion.value=t,r.uDirection.value.set(1,0),this._quad.render(e,this._scratch),r.uOcclusion.value=this._scratch.texture,r.uDirection.value.set(0,1),this._quad.render(e,this.outputTarget)}dispose(){this._material.dispose(),this._scratch.dispose(),this.outputTarget.dispose()}}const js=`
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uImage;
  uniform vec2 uTexel;

  const float EDGE_MIN = 1.0 / 24.0;
  const float EDGE_THRESHOLD = 1.0 / 8.0;
  const float SUBPIX = 0.75;
  const float SPAN_MAX = 8.0;

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec4 texM = texture(uImage, vUv);
    vec3 rgbM = texM.rgb;
    float lumaHere = luma(rgbM);
    float lNW = luma(texture(uImage, vUv + vec2(-uTexel.x, -uTexel.y)).rgb);
    float lNE = luma(texture(uImage, vUv + vec2( uTexel.x, -uTexel.y)).rgb);
    float lSW = luma(texture(uImage, vUv + vec2(-uTexel.x,  uTexel.y)).rgb);
    float lSE = luma(texture(uImage, vUv + vec2( uTexel.x,  uTexel.y)).rgb);

    float lMin = min(lumaHere, min(min(lNW, lNE), min(lSW, lSE)));
    float lMax = max(lumaHere, max(max(lNW, lNE), max(lSW, lSE)));
    float range = lMax - lMin;

    // Not an edge: pass through (alpha preserved so a transparent background survives).
    if (range < max(EDGE_MIN, lMax * EDGE_THRESHOLD)) {
      outColor = vec4(rgbM, texM.a);
      return;
    }

    // Edge direction from the corner luma gradient.
    vec2 dir;
    dir.x = -((lNW + lNE) - (lSW + lSE));
    dir.y =  ((lNW + lSW) - (lNE + lSE));

    float reduce = max((lNW + lNE + lSW + lSE) * 0.25 * (1.0 / 8.0), 1.0 / 128.0);
    float rcpMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + reduce);
    dir = clamp(dir * rcpMin, -SPAN_MAX, SPAN_MAX) * uTexel;

    vec3 rgbA = 0.5 * (
      texture(uImage, vUv + dir * (1.0 / 3.0 - 0.5)).rgb +
      texture(uImage, vUv + dir * (2.0 / 3.0 - 0.5)).rgb);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
      texture(uImage, vUv + dir * -0.5).rgb +
      texture(uImage, vUv + dir * 0.5).rgb);

    float lumaFar = luma(rgbB);
    vec3 result = (lumaFar < lMin || lumaFar > lMax) ? rgbA : rgbB;
    outColor = vec4(mix(rgbM, result, SUBPIX), texM.a);
  }
`;class Vs{_material;_quad;constructor(e,t){this._material=new C({glslVersion:pe,vertexShader:`
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,fragmentShader:js,uniforms:{uImage:{value:null},uTexel:{value:new k(1/Math.max(1,e),1/Math.max(1,t))}},depthTest:!1,depthWrite:!1}),this._quad=new fe(this._material)}setSize(e,t){this._material.uniforms.uTexel.value.set(1/Math.max(1,e),1/Math.max(1,t))}render(e,t,s){this._material.uniforms.uImage.value=t,this._quad.render(e,s)}dispose(){this._material.dispose()}}const H=16,Xs=`
  precision highp float;
  uniform sampler2D uDepthSheet;
  uniform ivec2 uSize;
  uniform bool uReversed;
  void main() {
    ivec2 block = ivec2(gl_FragCoord.xy);
    ivec2 from = block * uSize / ${H};
    ivec2 to = (block + 1) * uSize / ${H};
    float nearest = uReversed ? 0.0 : 1.0;
    float farthest = uReversed ? 1.0 : 0.0;
    float seen = 0.0;
    // A block is walked in steps so a large pass costs a bounded number of reads; a surface narrower than a
    // step can be missed, which only makes the map slightly smaller than it could be at worst.
    ivec2 span = max(to - from, ivec2(1));
    ivec2 step = max(span / 24, ivec2(1));
    for (int y = from.y; y < to.y; y += step.y) {
      for (int x = from.x; x < to.x; x += step.x) {
        float d = texelFetch(uDepthSheet, ivec2(x, y), 0).r;
        // Cleared texels are no surface: nothing there to receive a shadow.
        if (uReversed ? d <= 0.0 : d >= 1.0) continue;
        seen = 1.0;
        nearest = uReversed ? max(nearest, d) : min(nearest, d);
        farthest = uReversed ? min(farthest, d) : max(farthest, d);
      }
    }
    gl_FragColor = vec4(nearest, farthest, seen, 1.0);
  }
`;class Qs{camera=new pt(-1,1,1,-1,.01,10);_capture=null;_captures=new Map;_side=0;_ranges=null;_rangeQuad=null;_rangePixels=new Float32Array(H*H*4);onPixels=null;lastFit=null;get depthTexture(){return this._capture?.target.depthTexture??null}get texelInMetres(){return this._side>0?(this.camera.right-this.camera.left)/this._side:0}render(e,t,s,i,r){const a=Math.max(256,Math.min(8192,Math.round(s.resolution??4096))),o=s.bounds.getCenter(new te),l=Math.max(.001,s.bounds.getSize(new te).length()/2),n=s.towardSun.clone().normalize();this.camera.position.copy(o).addScaledVector(n,l*2),this.camera.up.set(0,1,0),Math.abs(n.y)>.99&&this.camera.up.set(0,0,1),this.camera.lookAt(o),this.camera.updateMatrixWorld(!0);const{sides:c,side:p}=this.fitTo(e,s.bounds,l,a,r??null,s.groundAt??null),[m,h,v,T]=c;let P=this._captures.get(p);P||(P=new Bt(p,p),this._captures.set(p,P)),P.onPixels=this.onPixels,this._capture=P,this._side=p,this.camera.left=m,this.camera.right=h,this.camera.top=T,this.camera.bottom=v,this.camera.near=l*.5,this.camera.far=l*3.5,this.camera.updateProjectionMatrix(),this.camera.updateMatrixWorld(!0);const b=[];for(const f of i)f.visible&&(f.visible=!1,b.push(f));this._capture.render(e,t,this.camera,!0,!globalThis.__sunFullCapture);for(const f of b)f.visible=!0}fitTo(e,t,s,i,r,a=null){const o=[-s,s,-s,s],l=(u,g)=>!globalThis.__sunFixedSide&&Number.isFinite(g)&&g>0?Math.min(i,Math.max(256,2**Math.ceil(Math.log2(u/g)))):i,n=(u,g,x=2*s,y=0)=>{this.lastFit={width:x,texel:x/g,blocksSeen:y,why:u}};if(!r||!r.width||!r.height)return n("no pass to fit to",i),{sides:o,side:i};const c=new te(0,0,.5).unproject(r.camera).distanceTo(new te(2/r.width,0,.5).unproject(r.camera)),p=(u,g=0)=>{const x=l(2*s,c);return n(u,x,2*s,g),{sides:o,side:x}},m=this.camera.matrixWorldInverse,h=new te,v=()=>({lowX:1/0,highX:-1/0,lowY:1/0,highY:-1/0}),T=u=>(g,x,y)=>{h.set(g,x,y).unproject(r.camera).applyMatrix4(m),u.lowX=Math.min(u.lowX,h.x),u.highX=Math.max(u.highX,h.x),u.lowY=Math.min(u.lowY,h.y),u.highY=Math.max(u.highY,h.y)},P=new te,b=u=>{if(a===null)return;const g=r.reversed?1:-1,x=r.reversed?0:1;for(const[y,L]of[[-1,-1],[1,-1],[-1,1],[1,1]]){P.set(y,L,g).unproject(r.camera),h.set(y,L,x).unproject(r.camera);const G=h.y-P.y;if(Math.abs(G)<1e-9)continue;const R=(a-P.y)/G;R<0||R>1||(h.sub(P).multiplyScalar(R).add(P).applyMatrix4(m),u.lowX=Math.min(u.lowX,h.x),u.highX=Math.max(u.highX,h.x),u.lowY=Math.min(u.lowY,h.y),u.highY=Math.max(u.highY,h.y))}},f=v();for(let u=0;u<8;u+=1)h.set(u&1?t.max.x:t.min.x,u&2?t.max.y:t.min.y,u&4?t.max.z:t.min.z),h.applyMatrix4(m),f.lowX=Math.min(f.lowX,h.x),f.highX=Math.max(f.highX,h.x),f.lowY=Math.min(f.lowY,h.y),f.highY=Math.max(f.highY,h.y);const O=u=>{const g=Math.max(u.lowX,f.lowX),x=Math.min(u.highX,f.highX),y=Math.max(u.lowY,f.lowY),L=Math.min(u.highY,f.highY);if(!(x>g&&L>y)||!Number.isFinite(g+x+y+L))return null;const G=Math.max((x-g)*1.05,(L-y)*1.05),R=l(G,c),z=Math.max(G,Number.isFinite(c)?c*R:0),W=Math.min(2*s,2**(Math.ceil(Math.log2(z)*4)/4));if(W>=2*s)return null;const D=W/R,$=Math.round((g+x)/2/D)*D,ee=Math.round((y+L)/2/D)*D;return{sides:[$-W/2,$+W/2,ee-W/2,ee+W/2],side:R,width:W,texel:D}};if(2*s/i<=c)return p("the whole box is as fine as the pass");{let u=1/0,g=-1/0;for(let z=0;z<8;z+=1){h.set(z&1?t.max.x:t.min.x,z&2?t.max.y:t.min.y,z&4?t.max.z:t.min.z);const W=h.project(r.camera).z;u=Math.min(u,W),g=Math.max(g,W)}const x=r.reversed?0:-1,y=[Math.max(x,Math.min(1,u)),Math.max(x,Math.min(1,g))],L=v(),G=T(L);for(const z of y)for(const[W,D]of[[-1,-1],[1,-1],[-1,1],[1,1]])G(W,D,z);b(L);const R=O(L);if(R&&R.texel<=c)return n("fitted to the frame through the box",R.side,R.width),{sides:R.sides,side:R.side}}const E=this.rangesOf(e,r),_=v(),w=T(_),S=u=>r.reversed?u:u*2-1;let A=0;for(let u=0;u<H;u+=1)for(let g=0;g<H;g+=1){const x=(u*H+g)*4;if(!(E[x+2]>0))continue;A+=1;const y=g/H*2-1,L=(g+1)/H*2-1,G=u/H*2-1,R=(u+1)/H*2-1;for(const z of[S(E[x]),S(E[x+1])])w(y,G,z),w(L,G,z),w(y,R,z),w(L,R,z)}if(b(_),!A&&a===null)return n("the pass shows no surface",256),{sides:o,side:256};const M=O(_);return M?(n("fitted to the surfaces the pass shows",M.side,M.width,A),{sides:M.sides,side:M.side}):p("what the pass shows spans the whole box",A)}rangesOf(e,t){this._ranges||(this._ranges=new F(H,H,{type:vt,format:B,minFilter:U,magFilter:U,depthBuffer:!1}),this._rangeQuad=new fe(new C({uniforms:{uDepthSheet:{value:null},uSize:{value:new k},uReversed:{value:!1}},vertexShader:"void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Xs,depthTest:!1,depthWrite:!1})));const s=this._rangeQuad.material;return s.uniforms.uDepthSheet.value=t.depth,s.uniforms.uSize.value.set(t.width,t.height),s.uniforms.uReversed.value=t.reversed,this._rangeQuad.render(e,this._ranges),e.readRenderTargetPixels(this._ranges,0,0,H,H,this._rangePixels),this._rangePixels}dispose(){for(const e of this._captures.values())e.dispose();this._captures.clear(),this._capture=null,this._ranges?.dispose(),this._ranges=null,this._rangeQuad?.material?.dispose(),this._rangeQuad=null}}var It=(d=>(d[d.SCREEN_SPACE=0]="SCREEN_SPACE",d[d.WORLD_SPACE=1]="WORLD_SPACE",d))(It||{});class qs{settings;sunShadow=new Qs;_sunDrawn=!1;capture;pyramid;ao;worldAo;denoise;composite;fxaa;_ldrTarget;_directFrame=null;_gridColor=null;_overlayColor=null;_occlusionColor=null;_gridBlendQuad;_screenCopyQuad;_occlusionBlendQuad;_whiteAo;_lastAo=null;_hasCaptured=!1;_width;_height;constructor(e,t,s){this._width=Math.max(1,Math.floor(e)),this._height=Math.max(1,Math.floor(t)),this.settings={ao:{...At,...s?.ao??{}},worldAo:{...Et,...s?.worldAo??{}},denoise:{..._t,...s?.denoise??{}},composite:{...Te,...s?.composite??{}},fxaaEnabled:s?.fxaaEnabled??!0,aoEnabled:s?.aoEnabled??!0,aoMode:s?.aoMode??0,aoHalfRes:s?.aoHalfRes??!0,hizHalfRes:s?.hizHalfRes??!1,renderScale:s?.renderScale??1,sunShadow:s?.sunShadow??null,background:s?.background??null,crop:s?.crop??null,overTheTarget:s?.overTheTarget??!1};const i=this.fullSize(),r=this.aoSize();this.capture=new Bt(i.w,i.h),this._ldrTarget=new F(i.w,i.h,{type:Q,format:B,minFilter:N,magFilter:N,depthBuffer:!1,stencilBuffer:!1}),this._ldrTarget.texture.name="compositeLdr",this.pyramid=new qt(i.w,i.h),this.ao=new Yt(r.w,r.h,this.settings.ao),this.worldAo=new Zt(r.w,r.h,this.settings.worldAo),this.denoise=new Hs(r.w,r.h,this.settings.denoise),this.composite=new Kt(i.w,i.h,this.settings.composite),this.fxaa=new Vs(i.w,i.h),this._whiteAo=new ye(new Uint8Array([255]),1,1,zt),this._whiteAo.needsUpdate=!0;const a=new C({glslVersion:pe,vertexShader:`
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,fragmentShader:`
        precision highp float;
        in vec2 vUv;
        out vec4 outColor;
        uniform sampler2D uImage;
        void main() { outColor = texture(uImage, vUv); }
      `,uniforms:{uImage:{value:null}},transparent:!0,depthTest:!1,depthWrite:!1});this._gridBlendQuad=new fe(a);const o=new C({glslVersion:pe,vertexShader:`
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,fragmentShader:`
        precision highp float;
        in vec2 vUv;
        out vec4 outColor;
        uniform sampler2D uImage;
        void main() { outColor = texture(uImage, vUv); }
      `,uniforms:{uImage:{value:null}},depthTest:!1,depthWrite:!1,blending:V});this._screenCopyQuad=new fe(o);const l=new C({glslVersion:pe,vertexShader:`
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,fragmentShader:`
        precision highp float;
        in vec2 vUv;
        out vec4 outColor;
        uniform sampler2D uImage;
        void main() { outColor = texture(uImage, vUv); }
      `,uniforms:{uImage:{value:null}},transparent:!0,depthTest:!1,depthWrite:!1,blending:mt,blendEquation:ue,blendSrc:ct,blendDst:gs});this._occlusionBlendQuad=new fe(l)}get depthTexture(){return this.capture.target.depthTexture}get renderScale(){return this.settings.renderScale}set renderScale(e){this.settings.renderScale=Math.max(.1,Math.min(1,e)),this.setSize(this._width,this._height)}get aoHalfRes(){return this.settings.aoHalfRes}set aoHalfRes(e){e!==this.settings.aoHalfRes&&(this.settings.aoHalfRes=e,this.setSize(this._width,this._height))}get hizHalfRes(){return this.settings.hizHalfRes}set hizHalfRes(e){e!==this.settings.hizHalfRes&&(this.settings.hizHalfRes=e,this.setSize(this._width,this._height))}fullSize(){const e=Math.max(.1,Math.min(1,this.settings.renderScale));return{w:Math.max(1,Math.floor(this._width*e)),h:Math.max(1,Math.floor(this._height*e))}}hizSize(){const e=this.fullSize();return this.settings.hizHalfRes?{w:Math.max(1,Math.floor(e.w/2)),h:Math.max(1,Math.floor(e.h/2))}:e}aoSize(){const e=this.fullSize();return this.settings.aoHalfRes?{w:Math.max(1,Math.floor(e.w/2)),h:Math.max(1,Math.floor(e.h/2))}:e}setSize(e,t){this._width=Math.max(1,Math.floor(e)),this._height=Math.max(1,Math.floor(t));const s=this.fullSize(),i=this.aoSize();this.capture.setSize(s.w,s.h),this._ldrTarget.setSize(s.w,s.h);const r=this.hizSize();this.pyramid.setSize(r.w,r.h),this.ao.setSize(i.w,i.h),this.worldAo.setSize(i.w,i.h),this.denoise.setSize(i.w,i.h),this.composite.setSize(s.w,s.h),this.fxaa.setSize(s.w,s.h),this.releaseGridColor(),this.releaseDirectFrame(),this.releaseOcclusionColor(),this.releaseOverlayColor()}captureChunk(e,t,s,i){const r=e.getRenderTarget();this.capture.render(e,t,s,i),this._hasCaptured=!0,e.setRenderTarget(r)}markChunksFinished(){this._finishingChunks=!0}_finishingChunks=!1;render(e,t,s,i,r,a,o=!1,l=[]){const n=t.matrixWorldAutoUpdate;n&&t.updateMatrixWorld(),t.matrixWorldAutoUpdate=!1;try{this.renderFrame(e,t,s,i,r,a,o,l)}finally{t.matrixWorldAutoUpdate=n}}renderFrame(e,t,s,i,r,a,o,l){const n=globalThis.__pipelinePhases?[]:null,c=n?_=>n.push([_,performance.now()]):()=>{};c("start");const p=e.getRenderTarget(),m=this.ensureDirectFrame();c("ensureDirectFrame");const h=o&&this._hasCaptured,v=this._finishingChunks;this._finishingChunks=!1;const T=h||v,P=h&&!v;let b=this._lastAo??this._whiteAo;if(!T){const _=[],w=S=>{if(S)for(const A of S)A.visible&&(A.visible=!1,_.push(A))};w(r),w(a),n&&(this.capture.__clock=c);try{this.capture.render(e,t,s)}finally{for(const S of _)S.visible=!0}c("capture"),this._hasCaptured=!0}if(!P){if(b=this._whiteAo,this.settings.aoEnabled){this.pyramid.build(e,this.capture.target.depthTexture,s);const _=this.settings.aoMode===1?this.worldAo:this.ao;_.render(e,this.pyramid,this.capture.target.normalTexture,this.capture.target.faceIdTexture,s),this.denoise.render(e,_.texture,this.pyramid.texture,this.capture.target.normalTexture),b=this.denoise.texture}this._lastAo=b,c("ao")}const f=this.settings.sunShadow;f&&(!h||!this._sunDrawn)&&(this.sunShadow.render(e,t,f,[...r??[],...a??[]],{camera:s,depth:this.capture.target.depthTexture,width:this.capture.target.depthTexture.image.width,height:this.capture.target.depthTexture.image.height,reversed:e.capabilities.reversedDepthBuffer===!0}),this._sunDrawn=!0,c("sun")),f||(this._sunDrawn=!1),this.composite.render(e,this._ldrTarget,{color:this.capture.target.colorTexture,ao:b,depth:this.capture.target.depthTexture,normal:this.capture.target.normalTexture,faceId:this.capture.target.faceIdTexture},s,f&&this.sunShadow.depthTexture?{depth:this.sunShadow.depthTexture,camera:this.sunShadow.camera,tone:f.tone,texel:this.sunShadow.texelInMetres,groundAt:f.groundAt??null}:null,this.settings.background,this.settings.crop),c("composite");const O=!this.settings.overTheTarget&&!i&&l.length===0&&!(a&&a.length)&&!(r&&r.length),E=O?p:m;if(this.settings.fxaaEnabled)this.fxaa.render(e,this._ldrTarget.texture,E);else{const _=this._screenCopyQuad.material;_.uniforms.uImage.value=this._ldrTarget.texture,this._screenCopyQuad.render(e,E)}if(c("fxaa"),O){if(e.setRenderTarget(p),n){c("cola y blit");const _={};for(let S=1;S<n.length;S++)_[n[S][0]]=Math.round((n[S][1]-n[S-1][1])*100)/100;const w=this.fullSize();globalThis.__lastPipeline={size:`${w.w}x${w.h}`,direct:!0,why:"nothing to draw on top",aoEnabled:this.settings.aoEnabled,fxaaEnabled:this.settings.fxaaEnabled,reuse:h,total:Math.round((n[n.length-1][1]-n[0][1])*100)/100,parts:_}}return}if(l.length){const _=this.capture.target.depthTexture,w=this.fullSize(),S=e.autoClear;e.autoClear=!1;for(const{pass:A,direct:M}of l)M&&(e.setRenderTarget(m),A({renderer:e,camera:s,target:m,depth:_,width:w.w,height:w.h}));for(const{pass:A,direct:M}of l){if(M)continue;const u=this.ensureOcclusionColor();e.setRenderTarget(u);const g=e.getContext();g.clearBufferfv(g.COLOR,0,[0,0,0,0]),A({renderer:e,camera:s,target:u,depth:_,width:w.w,height:w.h});const x=this._occlusionBlendQuad.material;x.uniforms.uImage.value=u.texture,this._occlusionBlendQuad.render(e,m)}e.autoClear=S,e.setRenderTarget(p)}if(a&&a.length&&this.renderDepthOverlay(e,t,s,m,a),r&&r.length&&this.paintOverlay(e,t,s,m,r),i&&i(m),!i){const _=this._screenCopyQuad.material;_.uniforms.uImage.value=m.texture;const w=this.settings.overTheTarget;_.blending=w?Lt:V,_.transparent=w,this._screenCopyQuad.render(e,p)}if(e.setRenderTarget(p),n){c("cola y blit");const _={};for(let S=1;S<n.length;S++)_[n[S][0]]=Math.round((n[S][1]-n[S-1][1])*100)/100;const w=this.fullSize();globalThis.__lastPipeline={size:`${w.w}x${w.h}`,direct:!1,stallingPasses:{tail:!!i,occlusion:l.length,overprintDepth:a?.length??0,overlayPlane:r?.length??0},aoEnabled:this.settings.aoEnabled,fxaaEnabled:this.settings.fxaaEnabled,reuse:h,total:Math.round((n[n.length-1][1]-n[0][1])*100)/100,parts:_}}}renderDepthOverlay(e,t,s,i,r){const a=this.ensureGridColor(),o=new Set(r),l=[],n=[];t.traverse(h=>{if(!h.visible)return;const v=h.material;if(!v)return;const T=Array.isArray(v)?v:[v];if(!T.some(b=>o.has(b))){h.visible=!1,l.push(h);return}for(const b of T)o.has(b)&&(n.push({material:b,blending:b.blending,depthWrite:b.depthWrite}),b.blending=V,b.depthWrite=!1)});const c=e.getRenderTarget(),p=e.autoClear;e.autoClear=!1,e.setRenderTarget(a);const m=e.getContext();m.clearBufferfv(m.COLOR,0,[0,0,0,0]);try{e.render(t,s),e.autoClear=p;const h=this._gridBlendQuad.material;h.uniforms.uImage.value=a.texture,this._gridBlendQuad.render(e,i)}finally{e.autoClear=p,e.setRenderTarget(c);for(const h of l)h.visible=!0;for(const h of n)h.material.blending=h.blending,h.material.depthWrite=h.depthWrite}}ensureGridColor(){const e=this.fullSize();return this._gridColor&&(this._gridColor.width!==e.w||this._gridColor.height!==e.h)&&this.releaseGridColor(),this._gridColor||(this._gridColor=new F(e.w,e.h,{type:Q,format:B,minFilter:N,magFilter:N,depthBuffer:!0,stencilBuffer:!1}),this._gridColor.texture.name="v2GridOverlay",this._gridColor.depthTexture=this.capture.target.depthTexture),this._gridColor}releaseGridColor(){this._gridColor&&(this._gridColor.depthTexture=null,this._gridColor.dispose(),this._gridColor=null)}paintOverlay(e,t,s,i,r){const a=new Set(r),o=[],l=[];let n=!1;if(t.traverse(v=>{if(!v.visible)return;const T=v.material;if(!T)return;const P=Array.isArray(T)?T:[T];if(!P.some(f=>a.has(f))){v.visible=!1,o.push(v);return}n=!0;for(const f of P)a.has(f)&&(f.userData?.preserveBlending||(l.push({material:f,blending:f.blending}),f.blending=V))}),!n){for(const v of o)v.visible=!0;return}const c=this.ensureOverlayColor(),p=e.getRenderTarget(),m=e.autoClear;e.autoClear=!1,e.setRenderTarget(c);const h=e.getContext();h.clearBufferfv(h.COLOR,0,[0,0,0,0]);try{e.render(t,s),e.autoClear=m;const v=this._gridBlendQuad.material;v.uniforms.uImage.value=c.texture,this._gridBlendQuad.render(e,i)}finally{e.autoClear=m,e.setRenderTarget(p);for(const v of o)v.visible=!0;for(const v of l)v.material.blending=v.blending}}ensureOverlayColor(){const e=this.fullSize();return this._overlayColor&&(this._overlayColor.width!==e.w||this._overlayColor.height!==e.h)&&this.releaseOverlayColor(),this._overlayColor||(this._overlayColor=new F(e.w,e.h,{type:Q,format:B,minFilter:N,magFilter:N,depthBuffer:!1,stencilBuffer:!1}),this._overlayColor.texture.name="v2HoverOverlay"),this._overlayColor}releaseOverlayColor(){this._overlayColor&&(this._overlayColor.dispose(),this._overlayColor=null)}ensureOcclusionColor(){const e=this.fullSize();return this._occlusionColor&&(this._occlusionColor.width!==e.w||this._occlusionColor.height!==e.h)&&this.releaseOcclusionColor(),this._occlusionColor||(this._occlusionColor=new F(e.w,e.h,{type:Q,format:B,minFilter:N,magFilter:N,depthBuffer:!0,stencilBuffer:!1}),this._occlusionColor.texture.name="v2SplatOcclusion",this._occlusionColor.depthTexture=this.capture.target.depthTexture),this._occlusionColor}releaseOcclusionColor(){this._occlusionColor&&(this._occlusionColor.depthTexture=null,this._occlusionColor.dispose(),this._occlusionColor=null)}ensureDirectFrame(){const e=this.fullSize();return this._directFrame&&(this._directFrame.width!==e.w||this._directFrame.height!==e.h)&&this.releaseDirectFrame(),this._directFrame||(this._directFrame=new F(e.w,e.h,{type:Q,format:B,minFilter:N,magFilter:N,depthBuffer:!0,stencilBuffer:!1}),this._directFrame.texture.name="v2DirectFrame",this._directFrame.depthTexture=this.capture.target.depthTexture),this._directFrame}releaseDirectFrame(){this._directFrame&&(this._directFrame.depthTexture=null,this._directFrame.dispose(),this._directFrame=null)}dispose(){this._ldrTarget.dispose(),this.releaseGridColor(),this.releaseDirectFrame(),this.releaseOcclusionColor(),this.releaseOverlayColor(),this._gridBlendQuad.dispose(),this._screenCopyQuad.dispose(),this._occlusionBlendQuad.dispose(),this._whiteAo.dispose(),this.capture.dispose(),this.pyramid.dispose(),this.ao.dispose(),this.worldAo.dispose(),this.denoise.dispose(),this.composite.dispose(),this.fxaa.dispose()}}var j=(d=>(d[d.COLOR=0]="COLOR",d[d.PEN=1]="PEN",d[d.PEN_SHADOWS=2]="PEN_SHADOWS",d[d.COLOR_PEN=3]="COLOR_PEN",d[d.COLOR_SHADOWS=4]="COLOR_SHADOWS",d[d.COLOR_PEN_SHADOWS=5]="COLOR_PEN_SHADOWS",d))(j||{}),Y=(d=>(d[d.COMPOSER=0]="COMPOSER",d[d.DEFERRED=1]="DEFERRED",d))(Y||{});class He{invisibleMaterials=new Set;composer;splatOcclusionPass;splatOcclusionDirect=!1;occlusionPasses=new Map;addOcclusionPass(e,t=!1){this.occlusionPasses.set(e,{direct:t})}removeOcclusionPass(e){this.occlusionPasses.delete(e)}setOcclusionDirect(e,t){const s=this.occlusionPasses.get(e);s&&(s.direct=t)}get deferredDepthTexture(){return this._deferred?.depthTexture}onStyleChanged=new ft;_enabled=!1;_initialized=!1;_basePass;_aoPass;_outputPass;_edgeDetectionPass;_smaaPass;_simpleOutlinePass;_excludedObjectsPass;_glossPass;_style=j.COLOR;_outlinesEnabled=!1;_glossEnabled=!1;_smaaEnabled=!1;_excludedObjectsEnabled=!1;_msaaEnabled=!1;_components;_renderer;_clearColor=new I;_mode=Y.COMPOSER;_deferred;defaultAoParameters={radius:.25,distanceExponent:5.7,thickness:10,scale:2,samples:16,distanceFallOff:1,screenSpaceRadius:!0};get basePass(){if(!this._basePass)throw new Error("Base pass not initialized");return this._basePass}get enabled(){return this._enabled}set enabled(e){if(this._enabled=e,e&&!this._initialized&&this.initialize(),!e)for(const t of this.basePass.isolatedMaterials){if(t.userData?.keepHidden===!0){t.visible=!1;continue}t.visible=!0}}get aoPass(){if(!this._aoPass)throw new Error("AO pass not initialized");return this._aoPass}get outlinePass(){if(!this._simpleOutlinePass)throw new Error("Outline pass not initialized");return this._simpleOutlinePass}get edgesPass(){if(!this._edgeDetectionPass)throw new Error("Edge detection pass not initialized");return this._edgeDetectionPass}get excludedObjectsPass(){if(!this._excludedObjectsPass)throw new Error("Excluded objects pass not initialized");return this._excludedObjectsPass}get glossPass(){if(!this._glossPass)throw new Error("Gloss pass not initialized");return this._glossPass}get outlinesEnabled(){return this._outlinesEnabled}set outlinesEnabled(e){this._outlinesEnabled=e,this.style=this._style}get excludedObjectsEnabled(){return this._excludedObjectsEnabled}set excludedObjectsEnabled(e){this._excludedObjectsEnabled=e,this.style=this._style}get glossEnabled(){return this._glossEnabled}set glossEnabled(e){this._glossEnabled=e,this.style=this._style}get smaaEnabled(){return this._smaaEnabled}set smaaEnabled(e){this._smaaEnabled=e,this.style=this._style}get msaaEnabled(){return this._msaaEnabled}set msaaEnabled(e){this._msaaEnabled=e,this.applySamples()}get style(){return this._style}set style(e){if(this._mode===Y.DEFERRED){this._style=e,this._applyDeferredStyle(e),this.onStyleChanged.trigger(e);return}this.composer&&(!this.composer||!this._basePass||!this._smaaPass||!this._outputPass||!this._aoPass||!this._edgeDetectionPass||!this._simpleOutlinePass||!this._excludedObjectsPass||!this._glossPass||(this._style===j.PEN_SHADOWS&&this._aoPass.updateGtaoMaterial(this.defaultAoParameters),this._style=e,this.clear(),e===j.COLOR&&(this.composer.addPass(this._basePass),this._glossEnabled&&this.composer.addPass(this._glossPass),this._outlinesEnabled&&this.composer.addPass(this._simpleOutlinePass),this._excludedObjectsEnabled&&this.composer.addPass(this._excludedObjectsPass),this._smaaEnabled&&this.composer.addPass(this._smaaPass),this.composer.addPass(this._outputPass)),e===j.PEN&&(this.composer.addPass(this._edgeDetectionPass),this._outlinesEnabled&&this.composer.addPass(this._simpleOutlinePass),this._excludedObjectsEnabled&&this.composer.addPass(this._excludedObjectsPass),this._smaaEnabled&&this.composer.addPass(this._smaaPass)),e===j.PEN_SHADOWS&&(this.composer.addPass(this._basePass),this.composer.addPass(this._aoPass),this._aoPass.output=X.OUTPUT.AO,this.composer.addPass(this._edgeDetectionPass),this._outlinesEnabled&&this.composer.addPass(this._simpleOutlinePass),this._excludedObjectsEnabled&&this.composer.addPass(this._excludedObjectsPass),this._smaaEnabled&&this.composer.addPass(this._smaaPass),this.composer.addPass(this._outputPass)),e===j.COLOR_PEN&&(this.composer.addPass(this._basePass),this._glossEnabled&&this.composer.addPass(this._glossPass),this.composer.addPass(this._edgeDetectionPass),this._outlinesEnabled&&this.composer.addPass(this._simpleOutlinePass),this._excludedObjectsEnabled&&this.composer.addPass(this._excludedObjectsPass),this._smaaEnabled&&this.composer.addPass(this._smaaPass),this.composer.addPass(this._outputPass)),e===j.COLOR_SHADOWS&&(this.composer.addPass(this._basePass),this._glossEnabled&&this.composer.addPass(this._glossPass),this.composer.addPass(this._aoPass),this._aoPass.output=X.OUTPUT.Default,this._outlinesEnabled&&this.composer.addPass(this._simpleOutlinePass),this._excludedObjectsEnabled&&this.composer.addPass(this._excludedObjectsPass),this._smaaEnabled&&this.composer.addPass(this._smaaPass),this.composer.addPass(this._outputPass)),e===j.COLOR_PEN_SHADOWS&&(this.composer.addPass(this._basePass),this._glossEnabled&&this.composer.addPass(this._glossPass),this.composer.addPass(this._aoPass),this._aoPass.output=X.OUTPUT.Default,this.composer.addPass(this._edgeDetectionPass),this._outlinesEnabled&&this.composer.addPass(this._simpleOutlinePass),this._excludedObjectsEnabled&&this.composer.addPass(this._excludedObjectsPass),this._smaaEnabled&&this.composer.addPass(this._smaaPass),this.composer.addPass(this._outputPass)),this.onStyleChanged.trigger(e)))}_applyDeferredStyle(e){if(!this._deferred)return;const t=j,s=e===t.COLOR||e===t.COLOR_PEN||e===t.COLOR_SHADOWS||e===t.COLOR_PEN_SHADOWS,i=e===t.PEN||e===t.PEN_SHADOWS||e===t.COLOR_PEN||e===t.COLOR_PEN_SHADOWS,r=e===t.PEN_SHADOWS||e===t.COLOR_SHADOWS||e===t.COLOR_PEN_SHADOWS,a=this._deferred.composite.settings;a.colorEnabled=s,a.contourEnabled=i,this._deferred.settings.aoEnabled=r}get mode(){return this._mode}set mode(e){const t=this._mode===Y.DEFERRED;this._mode=e,e===Y.DEFERRED?(this.deferred,this.setCaptureEmission(!0),this.style=this._style):(t&&(this.setCaptureEmission(!1),this.releaseDeferred()),this.style=this._style)}captureEmitters=new Set;addCaptureEmitter(e){this.captureEmitters.add(e),this._mode===Y.DEFERRED&&e(!0)}removeCaptureEmitter(e){if(this.captureEmitters.delete(e))try{e(!1)}catch{}}setCaptureEmission(e){try{this._components.get(nt)?.core?.models?.materials?.setCaptureEmission?.(e)}catch{}for(const t of this.captureEmitters)try{t(e)}catch{}}get deferred(){if(!this._deferred){const e=Math.max(1,this._renderer.three.domElement.width),t=Math.max(1,this._renderer.three.domElement.height);this._deferred=new qs(e,t,this._deferredSettings);const s=(i,r)=>{try{this._components.get(nt)?.core?.models?.materials?.setCapturePixels?.(i,r)}catch{}};this._deferred.capture.onPixels=s,this._deferred.sunShadow.onPixels=s,this._renderer.applyPostproductionSize()}return this._deferred}_deferredSettings;releaseDeferred(){this._deferred&&(this._deferredSettings=this._deferred.settings,this._deferred.dispose(),this._deferred=void 0)}constructor(e,t){this._components=e,this._renderer=t}update(){if(this._mode===Y.DEFERRED){this.updateDeferred();return}if(!this.composer)return;for(const s of this.invisibleMaterials)s.userData.wasVisibleForPostproduction=s.visible,s.visible=!1;const e=this._renderer.three;e.getClearColor(this._clearColor);const t=e.getClearAlpha();e.setClearColor(16777215,1),e.setRenderTarget(this.composer.renderTarget1),e.clear(),e.setRenderTarget(this.composer.renderTarget2),e.clear(),e.setRenderTarget(null),e.setClearColor(this._clearColor,t),this.composer.render();for(const s of this.invisibleMaterials)s.visible=s.userData.wasVisibleForPostproduction}updateOverlayOnly(){this._mode===Y.DEFERRED&&this.updateDeferred(!0)}finishChunks(){this._mode!==Y.DEFERRED||!this._deferred||(this._deferred.markChunksFinished(),this.updateDeferred(!0))}captureChunk(e){if(this._mode!==Y.DEFERRED||!this._deferred)return;const t=this._renderer.currentWorld;if(!t)return;const s=t.scene.three,i=t.camera.three;e&&this.setCaptureEmission(!0);for(const r of this.invisibleMaterials)r.userData.wasVisibleForPostproduction=r.visible,r.visible=!1;this._deferred.captureChunk(this._renderer.three,s,i,e);for(const r of this.invisibleMaterials)r.visible=r.userData.wasVisibleForPostproduction}updateDeferred(e=!1){const t=this._renderer.currentWorld;if(!t)return;const s=t.scene.three,i=t.camera.three,r=this._renderer.three;e||this.setCaptureEmission(!0);for(const h of this.invisibleMaterials)h.userData.wasVisibleForPostproduction=h.visible,h.visible=!1;r.getClearColor(this._clearColor);const a=r.getClearAlpha(),o=this._outlinesEnabled&&this._simpleOutlinePass&&!this._deferred?.settings?.overTheTarget?this._simpleOutlinePass:null,l=this._basePass?.isolatedMaterials??[],n=l.filter(h=>h.depthTest===!1),c=l.filter(h=>h.depthTest!==!1),p=o?h=>{o.renderToScreen=!0,o.render(r,h,h)}:void 0,m=[];this.splatOcclusionPass&&m.push({pass:this.splatOcclusionPass,direct:this.splatOcclusionDirect});for(const[h,v]of this.occlusionPasses)m.push({pass:h,direct:v.direct});try{this.deferred.render(r,s,i,p,n,c,e,m)}finally{r.setClearColor(this._clearColor,a);for(const h of this.invisibleMaterials)h.visible=h.userData.wasVisibleForPostproduction}}dispose(){this._mode===Y.DEFERRED&&this.setCaptureEmission(!1),this.releaseDeferred(),this._deferredSettings=void 0,this.occlusionPasses.clear(),this.captureEmitters.clear(),this.composer?.dispose(),this._aoPass?.dispose(),this._outputPass?.dispose(),this._edgeDetectionPass?.dispose(),this._smaaPass?.dispose(),this._simpleOutlinePass?.dispose(),this._excludedObjectsPass?.dispose(),this._glossPass?.dispose()}setSize(e,t){e===0||t===0||(this.composer&&this.composer.setSize(e,t),this._deferred&&this._deferred.setSize(e,t),this._simpleOutlinePass&&this._simpleOutlinePass.setSize(e,t),this._excludedObjectsPass&&this._excludedObjectsPass.setSize(e,t),this._glossPass&&this._glossPass.setSize(e,t))}updateCamera(){const e=this._renderer.currentWorld.camera.three;this._basePass&&(this._basePass.camera=e),this._aoPass&&(this._aoPass.camera=e)}clear(){if(!this.composer)return;const e=[...this.composer.passes];for(const t of e)this.composer.removePass(t);this._renderer.three.setClearColor(0,0),this._renderer.three.setRenderTarget(this.composer.renderTarget1),this._renderer.three.clear(),this._renderer.three.setRenderTarget(this.composer.renderTarget2),this._renderer.three.clear(),this._renderer.three.setRenderTarget(null)}static MSAA_SAMPLES=4;applySamples(){if(!this.composer)return;const e=this._renderer.three.capabilities?.maxSamples??He.MSAA_SAMPLES,t=this._msaaEnabled?He.MSAA_SAMPLES:0,s=Math.max(0,Math.min(t,e)),i=[this.composer.renderTarget1,this.composer.renderTarget2];for(const r of i)r.samples!==s&&(r.samples=s,r.dispose())}initialize(){this._initialized=!0;const e=this._renderer.currentWorld.scene.three,t=this._renderer.currentWorld.camera.three;this._renderer.three.setClearColor(0,0),this.composer=new Ps(this._renderer.three),this.composer.setPixelRatio(1),this.applySamples();const s=new Ws(e,t);this._basePass=s,this._smaaPass=new Os;const i=this._components.get(nt);this._aoPass=new Rs(i,e,t,this._renderer.three.domElement.width,this._renderer.three.domElement.height),this._aoPass.output=X.OUTPUT.Default,this._edgeDetectionPass=new Ns(this._renderer,i),this._outputPass=new Ds,this._simpleOutlinePass=new zs(this._renderer.three.domElement.width,this._renderer.three.domElement.height,this._renderer.currentWorld),this._excludedObjectsPass=new Us(this._renderer,this._renderer.currentWorld),this._glossPass=new Is(new k(this._renderer.three.domElement.width,this._renderer.three.domElement.height),this._renderer.currentWorld),this.style=j.COLOR}}const he=256,q="default";class Ys{debugShowMask=!1;resolutionScale=1;_rootScene=new xt;_groups=new Map;_groupsById=new Map;_outlinedTiles=new Map;_nextId=1;_paletteData=new Uint8Array(he*2*4);_paletteTexture;constructor(){this._rootScene.background=null,this._paletteTexture=new ye(this._paletteData,he,2,B,Q),this._paletteTexture.minFilter=U,this._paletteTexture.magFilter=U,this._paletteTexture.wrapS=Ge,this._paletteTexture.wrapT=Ge,this._paletteTexture.colorSpace=vs,this._paletteTexture.needsUpdate=!0,this.addGroup(q,{outlineColor:new I(16762880),fillColor:new I(16776960),fillOpacity:.3,thickness:2})}get maskScene(){return this._rootScene}get paletteTexture(){return this._paletteTexture}get active(){for(const e of this._groups.values())if(e.container.children.length>0)return!0;return!1}_everActive=!1;get everActive(){return this._everActive}advance(){for(const e of this._outlinedTiles.values())for(const t of e.values())t.proxy.matrixWorld.copy(t.source.matrixWorld)}addGroup(e,t){let s=this._groups.get(e);if(s)return t&&this.configureGroup(e,t),s;const i=this.allocateId(),r=t?.priority??0,a=this.buildGhostMaterial(i,r),o=new Nt;return o.name=`outline-group:${e}`,o.renderOrder=r,this._rootScene.add(o),s={id:i,name:e,container:o,material:a,outlineColor:t?.outlineColor?.clone()??new I(16762880),fillColor:t?.fillColor?.clone()??new I(16776960),fillOpacity:t?.fillOpacity??.3,thickness:t?.thickness??2,priority:r},this._groups.set(e,s),this._groupsById.set(i,s),this.writePaletteEntry(s),s}configureGroup(e,t){const s=this._groups.get(e);s&&(t.outlineColor&&s.outlineColor.copy(t.outlineColor),t.fillColor&&s.fillColor.copy(t.fillColor),t.fillOpacity!==void 0&&(s.fillOpacity=t.fillOpacity),t.thickness!==void 0&&(s.thickness=t.thickness),t.priority!==void 0&&(s.priority=t.priority,s.material.polygonOffset=t.priority!==0,s.material.polygonOffsetFactor=-t.priority,s.material.polygonOffsetUnits=-t.priority,s.container.renderOrder=t.priority),this.writePaletteEntry(s))}removeGroup(e){if(e===q)return;const t=this._groups.get(e);if(t){for(;t.container.children.length;)t.container.children[0].removeFromParent();t.container.removeFromParent(),t.material.dispose(),this._groups.delete(e),this._groupsById.delete(t.id);for(const[s,i]of this._outlinedTiles)i.delete(e)&&i.size===0&&this._outlinedTiles.delete(s);this.clearPaletteEntry(t.id)}}hasGroup(e){return this._groups.has(e)}getGroup(e){return this._groups.get(e)}addMeshToGroup(e,t){let s=this._groups.get(t);s||(s=this.addGroup(t));const i=e.geometry.groups&&e.geometry.groups.length>0;e.material=i?[s.material]:s.material,s.container.add(e),this._everActive=!0}attachOutlinedTile(e,t,s=q){let i=this._groups.get(s);i||(i=this.addGroup(s));let r=this._outlinedTiles.get(e);r||(r=new Map,this._outlinedTiles.set(e,r));const a=r.get(s);if(a){const p=a.proxy.geometry,m=ke(e.geometry);m&&p.index!==m&&p.setIndex(m),p.clearGroups(),this.fillProxyGroups(p,t);return}const o=e.geometry,l=new je;l.attributes=o.attributes;const n=ke(o);n&&l.setIndex(n),l.boundingBox=o.boundingBox,l.boundingSphere=o.boundingSphere,this.fillProxyGroups(l,t);const c=new Pe(l,[i.material]);c.matrixAutoUpdate=!1,c.matrixWorldAutoUpdate=!1,c.frustumCulled=!1,c.matrixWorld.copy(e.matrixWorld),i.container.add(c),r.set(s,{source:e,proxy:c,groupName:s}),this._everActive=!0}detachOutlinedTile(e,t=q){const s=this._outlinedTiles.get(e);if(!s)return;const i=s.get(t);i&&(i.proxy.removeFromParent(),s.delete(t),s.size===0&&this._outlinedTiles.delete(e))}hasOutlinedTile(e,t){const s=this._outlinedTiles.get(e);return s?t===void 0?s.size>0:s.has(t):!1}getGroupContainer(e){let t=this._groups.get(e);return t||(t=this.addGroup(e)),t.container}getGroupScene(e){return this.getGroupContainer(e)}listGroups(){return[...this._groups.keys()]}get scene(){return this._groups.get(q).container}get outlineColor(){return this._groups.get(q).outlineColor}set outlineColor(e){this.configureGroup(q,{outlineColor:e})}get thickness(){return this._groups.get(q).thickness}set thickness(e){this.configureGroup(q,{thickness:e})}get fillColor(){return this._groups.get(q).fillColor}set fillColor(e){this.configureGroup(q,{fillColor:e})}get fillOpacity(){return this._groups.get(q).fillOpacity}set fillOpacity(e){this.configureGroup(q,{fillOpacity:e})}dispose(){for(const e of this._outlinedTiles.values())for(const t of e.values())t.proxy.removeFromParent();this._outlinedTiles.clear();for(const e of this._groups.values()){for(;e.container.children.length;)e.container.children[0].removeFromParent();e.container.removeFromParent(),e.material.dispose()}this._groups.clear(),this._groupsById.clear(),this._paletteTexture.dispose()}buildGhostMaterial(e,t){throw new Error("WebGPUOutlinePass: `three` must resolve to the webgpu build (ESGPU) before outline groups are created.")}fillProxyGroups(e,t){const s=t.position,i=t.size,r=Math.min(s.length,i.length);for(let a=0;a<r;a++){const o=s[a],l=i[a],n=l===4294967295?1/0:l;e.addGroup(o,n,0)}}allocateId(){for(let e=0;e<he-1;e++){const t=(this._nextId-1+e)%(he-1)+1;if(!this._groupsById.has(t))return this._nextId=t%(he-1)+1,t}throw new Error(`WebGPUOutlinePass: cannot allocate outline group id, ${he-1} groups active.`)}writePaletteEntry(e){const t=e.id,s=t*4,i=(he+t)*4,r=this._paletteData,a=n=>Math.max(0,Math.min(255,Math.round(n))),o=e.outlineColor.getRGB({r:0,g:0,b:0},Pt),l=e.fillColor.getRGB({r:0,g:0,b:0},Pt);r[s]=a(o.r*255),r[s+1]=a(o.g*255),r[s+2]=a(o.b*255),r[s+3]=a(e.thickness),r[i]=a(l.r*255),r[i+1]=a(l.g*255),r[i+2]=a(l.b*255),r[i+3]=a(e.fillOpacity*255),this._paletteTexture.needsUpdate=!0}clearPaletteEntry(e){const t=this._paletteData,s=e*4,i=(he+e)*4;for(let r=0;r<4;r++)t[s+r]=0;for(let r=0;r<4;r++)t[i+r]=0;this._paletteTexture.needsUpdate=!0}}const ut=[1,Math.SQRT2,2,3,4,5,6];function Zs(d){for(const e of ut)if(d<=e)return e;return ut[ut.length-1]}class Ks{onStyleChanged=new ft;mode=Y.DEFERRED;deferred={settings:{aoEnabled:!0,aoMode:It.SCREEN_SPACE,fxaaEnabled:!0,sunShadow:null,background:null,crop:null,overTheTarget:!1},capture:{translucentAsOpaque:!1},aoHalfRes:!0,renderScale:1,ao:{settings:{...At}},worldAo:{settings:{...Et}},denoise:{settings:{..._t}},composite:{settings:{...Te,edgeColor:Te.edgeColor.clone(),paperColor:Te.paperColor.clone(),sheenColor:Te.sheenColor.clone()}}};deferredDepthTexture=void 0;basePass={isolatedMaterials:[]};excludedObjectsPass={addExcludedMaterial:e=>{},removeExcludedMaterial:e=>{}};edgesPass={width:1,color:new I(0),mode:Wt.DEFAULT};glossPass={minGloss:0,maxGloss:0,glossExponent:1,fresnelExponent:1,glossFactor:0,fresnelFactor:0};aoPass={blendIntensity:1,updateGtaoMaterial:e=>{},updatePdMaterial:e=>{}};defaultAoParameters={radius:.25,distanceExponent:5.7,thickness:10,scale:2,samples:16,distanceFallOff:1,screenSpaceRadius:!0};outlinePass=new Ys;invisibleMaterials=new Set;outlinesEnabled=!1;excludedObjectsEnabled=!1;glossEnabled=!1;smaaEnabled=!1;_style=j.COLOR;_enabled=!1;_host;_occlusionPasses=new Map;constructor(e){this._host=e,this._applyStyle(this._style)}get enabled(){return this._enabled}set enabled(e){this._enabled=e,this._host.needsUpdate=!0}get style(){return this._style}set style(e){this._style=e,this._applyStyle(e),this._host.needsUpdate=!0,this.onStyleChanged.trigger(e)}addOcclusionPass(e,t=!0){this._occlusionPasses.set(e,t),this._host.needsUpdate=!0}removeOcclusionPass(e){this._occlusionPasses.delete(e)&&(this._host.needsUpdate=!0)}setOcclusionDirect(e,t){this._occlusionPasses.has(e)&&this._occlusionPasses.get(e)!==t&&(this._occlusionPasses.set(e,t),this._host.needsUpdate=!0)}_seamSignature(){let e="";for(const t of this._occlusionPasses.values())e+=t?"d":"l";return e}updateCamera(){}setSize(e,t){}mountOptions(e){return{...e,composite:this.deferred.composite.settings,view:this._viewSaid()?this.deferred.settings:null,sunMost:this._sunMost,capture:this.deferred.capture,overlays:this.basePass.isolatedMaterials,ao:e.ao!==!1&&this.deferred.settings.aoEnabled,fxaa:e.fxaa!==!1&&this.deferred.settings.fxaaEnabled,outline:this.outlinesEnabled&&this.outlinePass.everActive?this.outlinePass:null,seams:[...this._occlusionPasses].map(([t,s])=>({pass:t,direct:s}))}}needsRemount(e,t){if(!e)return!0;const s=this.deferred.composite.settings,{settings:i}=this.deferred,r=this.basePass.isolatedMaterials,a=r.some(l=>l.depthTest!==!1),o=r.some(l=>l.depthTest===!1);return e.depthOverlays!==a||e.flatOverlays!==o||e.colorEnabled!==s.colorEnabled||e.contourEnabled!==s.contourEnabled||e.normal!==(s.tonalShadingEnabled===!0||s.glossFactor>0||s.fresnelFactor>0)||e.faceR8!==(t.faceR8===!0)||e.reach!==Zs(s.edgeHalfWidth+s.edgeAA)||e.ao!==(t.ao!==!1&&i.aoEnabled)||e.fxaa!==(t.fxaa!==!1&&i.fxaaEnabled)||e.edges!==(t.edges!==!1)||e.outlines!==(this.outlinesEnabled&&this.outlinePass.everActive)||e.seams!==this._seamSignature()||!!e.view!==this._viewSaid()||(e.sunMost??0)!==this._sunMost}_viewEverSaid=!1;_sunMost=0;_viewSaid(){const{settings:e}=this.deferred;(e.crop||e.background||e.sunShadow)&&(this._viewEverSaid=!0);const t=e.sunShadow;return t&&(this._sunMost=Math.max(this._sunMost,Math.round(t.resolution??4096))),this._viewEverSaid}dispose(){this.onStyleChanged.reset(),this._occlusionPasses.clear()}_applyStyle(e){const t=j,s=e===t.COLOR||e===t.COLOR_PEN||e===t.COLOR_SHADOWS||e===t.COLOR_PEN_SHADOWS,i=e===t.PEN||e===t.PEN_SHADOWS||e===t.COLOR_PEN||e===t.COLOR_PEN_SHADOWS,r=e===t.PEN_SHADOWS||e===t.COLOR_SHADOWS||e===t.COLOR_PEN_SHADOWS,a=this.deferred.composite.settings;a.colorEnabled=s,a.contourEnabled=i,this.deferred.settings.aoEnabled=r}}class Js{enabled=!1;scale=1/(globalThis.devicePixelRatio||1);settleMs=500;normalFromDepth=!0;onSwitch=new ft;get active(){return this._active}get switches(){return this._switches}get remounts(){return this._remounts}_active="full";_switches=0;_remounts=0}class ii extends Jt{manualDefaultStyle=j.COLOR;turnOffOnManualMode=!0;manualModeDelay=50;_postproduction;_timeout=null;_previousStyle=j.COLOR;_previousEnabled=!1;get postproduction(){if(this.api==="webgpu")return this._gpuPostproduction;if(!this._postproduction)throw new Error("Renderer not initialized yet with a world!");return this._postproduction}cssSize=!1;adaptiveResolution=!1;adaptiveTargetFps=60;adaptiveMinScale=.75;adaptiveDebug=!1;adaptiveMaxScale=1;get _resolutionCeiling(){return this.cssSize?1:Math.min(window.devicePixelRatio,2)}get _effectiveMinScale(){return Math.max(this.adaptiveMinScale,1/this._resolutionCeiling)}_adaptiveScale=1;_frameMsEma=0;_lastFrameStamp=0;_adaptiveFrames=0;_adaptivePending=0;pipeline=null;webgpuPost={face:!0,ao:!0,edges:!0,fxaa:!0,scene8:!1,faceR8:!1,tonal:!0,sheen:!0,dither:!0};pipelineCacheSize=3;pipelineStats={reused:0,compiled:0,disposed:0};movingResolution=new Js;pictureHeld=!1;pipelinesBeingMade=0;_pipelineCamera=null;_mounting=0;_composition=null;_lastGpuRenderAt=-1/0;_keptPipelines=[];_lowPipeline=null;_lowCamera=null;_lowNormalFromDepth=!1;_lastCameraState=new Float64Array(32);_lastCameraSampled=null;_lastMoveAt=-1/0;_asidePatched=!1;_asideNow=!1;_asideAll=!1;_madeAsideNow=0;_whole=new WeakSet;_wholeTarget=null;_webgpuPostproduction;get _gpuPostproduction(){return this._webgpuPostproduction||(this._webgpuPostproduction=new Ks(this)),this._webgpuPostproduction}_pageColor=new I(1,1,1);constructor(e,t,s){super(e,t,s),this._keepRenderOrderUnderReversedDepth(),this.onResize.add(i=>{if(this.api==="webgpu"){this._pageColorForCanvas();return}this.setPostproductionSize(i)}),this.onWorldChanged.add(()=>{if(this.currentWorld&&this.api==="webgpu"){this._mountPipeline();return}this.currentWorld&&(this._postproduction&&this._postproduction.dispose(),this._postproduction=new He(e,this),this._postproduction.onStyleChanged.add(i=>{this._previousStyle=i}),this.setPostproductionSize())})}_keepRenderOrderUnderReversedDepth(){if(this.api!=="webgl")return;const e=Number(_s)<186,t=this.three.capabilities;if(!e||t?.reversedDepthBuffer!==!0)return;const s=(i,r)=>i.groupOrder!==r.groupOrder?r.groupOrder-i.groupOrder:i.renderOrder!==r.renderOrder?r.renderOrder-i.renderOrder:0;this.three.setOpaqueSort((i,r)=>{const a=s(i,r);return a!==0?a:i.material.id!==r.material.id?i.material.id-r.material.id:i.z!==r.z?i.z-r.z:i.id-r.id}),this.three.setTransparentSort((i,r)=>{const a=s(i,r);return a!==0?a:i.z!==r.z?r.z-i.z:i.id-r.id})}get drawnPipeline(){return this.movingResolution.active==="low"&&this._lowPipeline?this._lowPipeline:this.pipeline}remountPipeline(){this.api!=="webgpu"||!this.currentWorld||this._mountPipeline()}_keepPipeline(e,t){if(e)for(this._keptPipelines.push({pipeline:e,camera:t});this._keptPipelines.length>Math.max(0,this.pipelineCacheSize);)this._keptPipelines.shift().pipeline.dispose?.(),this.pipelineStats.disposed++}_reuseKeptPipeline(e){const t=this._gpuPostproduction,s=this._keptPipelines.findIndex(r=>r.camera===e&&!t.needsRemount(r.pipeline.compiled,this.webgpuPost));if(s<0)return!1;const[i]=this._keptPipelines.splice(s,1);return this._keepPipeline(this.pipeline,this._pipelineCamera),this.pipeline=i.pipeline,this._pipelineCamera=e,this.pipelineStats.reused++,this.needsUpdate=!0,!0}async _mountPipeline(){const e=this.currentWorld;if(e){this._mounting++;try{const t=this._pipelineCamera;try{this._pipelineCamera=e.camera.three}catch{this._pipelineCamera=null}if(this._composition||(this._composition=await Xt(()=>import("./composition-fzkXgeTY.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)),this.currentWorld!==e)return;let s;try{s=e.camera.three}catch{this._pipelineCamera=null;return}const i=this.pipeline;if(i&&t===s&&!this._gpuPostproduction.needsRemount(i.compiled,this.webgpuPost)){this._pipelineCamera=s;return}if(this._pipelineCamera=t,this._reuseKeptPipeline(s))return;this._composeNow(e,s)}finally{this._mounting--}}}_composeNow(e,t){const s=this.pipeline,i=this._pipelineCamera;this.pipeline=this._composition.mountComposition(this.three,e.scene.three,t,{...this._gpuPostproduction.mountOptions(this.webgpuPost),page:this._pageColorForCanvas()}),this._pipelineCamera=t,this.pipelineStats.compiled++,this._keepPipeline(s,i),this.needsUpdate=!0}_pageColorForCanvas(){if(this.three.alpha===!0)return null;let e=this.container,t=!1;for(;e&&!t;){const i=getComputedStyle(e).backgroundColor.match(/[\d.]+/g)?.map(Number)??[],r=i.length>=4?i[3]:i.length===3?1:0;i.length>=3&&r>0&&(this._pageColor.setRGB(i[0]/255,i[1]/255,i[2]/255),t=!0);const a=e.getRootNode();e=e.parentElement??a.host??null}return t||this._pageColor.setRGB(1,1,1),this._pageColor}_cameraMoved(e){e.updateMatrixWorld();const t=e.matrixWorld.elements,s=e.projectionMatrix.elements,i=this._lastCameraState,r=this._lastCameraSampled!==e;let a=!1;for(let o=0;o<32&&!a;o++){const l=o<16?t[o]:s[o-16];a=Math.abs(l-i[o])>1e-5*(1+Math.abs(l))}return(a||r)&&(i.set(t),i.set(s,16),this._lastCameraSampled=e),a&&!r}_movingSceneScale(){const e=this.three.getPixelRatio?.()||window.devicePixelRatio||1;return Math.min(1,Math.max(this.movingResolution.scale,1/e))}_disposeLowPipeline(){this._lowPipeline?.dispose?.(),this._lowPipeline=null,this._lowCamera=null}_lowPipelineFor(e,t,s){const i=this.movingResolution,r=this._lowPipeline;if(r&&this._lowCamera===t&&this._lowNormalFromDepth===i.normalFromDepth&&r.compiled?.sceneScale===s&&!this._gpuPostproduction.needsRemount(r.compiled,this.webgpuPost))return r;this._disposeLowPipeline();const a=this._composition.mountComposition(this.three,e.scene.three,t,{...this._gpuPostproduction.mountOptions(this.webgpuPost),page:this._pageColorForCanvas(),sceneScale:s,...i.normalFromDepth?{normalFromDepth:!0}:{}}),o=this.pipeline?.look?.settings,l=a.look?.settings;if(o&&l&&o!==l)for(const n of Object.keys(o))n.startsWith("reflection")&&(l[n]=o[n]);return this._lowPipeline=a,this._lowCamera=t,this._lowNormalFromDepth=i.normalFromDepth,i._remounts++,a}_pipelineToDraw(e,t,s){const i=this.movingResolution;if(!i.enabled)return this._lastCameraSampled=null,this._noteDrawn("full"),this._lowPipeline&&this._disposeLowPipeline(),this.pipeline;this._cameraMoved(t)&&(this._lastMoveAt=s);const r=this._movingSceneScale(),o=r<1&&this._composition&&this.three.getRenderTarget()===null&&s-this._lastMoveAt<i.settleMs?this._lowPipelineFor(e,t,r):this.pipeline;return this._noteDrawn(o===this.pipeline?"full":"low"),this._lowPipeline&&this._lowCamera!==t&&this._disposeLowPipeline(),o}_noteDrawn(e){const t=this.movingResolution;t._active!==e&&(t._active=e,t._switches++,t.onSwitch.trigger(e))}_wakeForFullFrame(){const e=this.movingResolution;e._active==="low"&&(!e.enabled||performance.now()-this._lastMoveAt>=e.settleMs)&&(this.needsUpdate=!0)}_pipelinesMadeAside(){if(this._asidePatched)return;const e=this.three._pipelines;if(!e?.getForRender)return;this._asidePatched=!0;const t=e.getForRender.bind(e),s={push:i=>{this.pipelinesBeingMade++,this._madeAsideNow++,i.finally(()=>{this.pipelinesBeingMade--,this.needsUpdate=!0})}};e.getForRender=(i,r=null)=>t(i,r??(this._asideNow&&(this._asideAll||!i.object?.isQuadMesh)?s:null))}_madeWhole(e){if(this._whole.has(e))return!0;if(this.pipelinesBeingMade>0)return!1;const t=this.three.getDrawingBufferSize(new k);let s=this._wholeTarget;(!s||s.width!==t.x||s.height!==t.y)&&(s?.dispose(),s=this._wholeTarget=new xs(t.x,t.y,{type:Q,depthBuffer:!0}));const i=this.three.getRenderTarget();this._madeAsideNow=0,this._asideAll=!0,this.three.setRenderTarget(s);try{e.__refresh?.(),e.render()}finally{this.three.setRenderTarget(i),this._asideAll=!1}return this._madeAsideNow>0?!1:(this._whole.add(e),!0)}_updateWebGPU(){if(!this.currentWorld)return;if(!this._webgpuInitialized){this.needsUpdate=!0;return}const e=performance.now();if(e-this._lastGpuRenderAt<4){this.needsUpdate=!0;return}if(this._lastGpuRenderAt=e,this.onBeforeUpdate.trigger(),this.pictureHeld){this.needsUpdate=!0;return}this._pipelinesMadeAside(),this._asideNow=this.three.getRenderTarget()===null;try{this._drawWebGPU(e)}finally{this._asideNow=!1}}_drawWebGPU(e){if(!this.currentWorld)return;const t=this.currentWorld.scene.three,s=this.currentWorld.camera.three;this.syncWebGPUClipping(t);const i=this._gpuPostproduction;if(i.enabled&&!this.pipeline&&this._mounting===0&&this._mountPipeline(),i.enabled&&this.pipeline&&this._mounting===0&&(s!==this._pipelineCamera||i.needsRemount(this.pipeline.compiled,this.webgpuPost))&&!this._reuseKeptPipeline(s)&&(this._composition?this._composeNow(this.currentWorld,s):this._mountPipeline()),i.enabled&&this.pipeline){let r=this._pipelineToDraw(this.currentWorld,s,e);if(this._asideNow&&!this._madeWhole(r))if(r!==this.pipeline&&this._whole.has(this.pipeline))r=this.pipeline,this._noteDrawn("full");else{this.needsUpdate=!0,this.onAfterUpdate.trigger();return}r.__refresh?.(),r.render()}else this._noteDrawn("full"),this.renderOverPage(t,s);this.onAfterUpdate.trigger()}update(){if(!this.enabled||!this.currentWorld||(this.api==="webgpu"&&this._wakeForFullFrame(),this.mode===lt.MANUAL&&!this.needsUpdate))return;if(this.needsUpdate=!1,this.api==="webgpu"){this._updateWebGPU();return}this._updateAdaptiveScale(),this.onBeforeUpdate.trigger();const e=this.currentWorld.scene.three,t=this.currentWorld.camera.three;this.mode===lt.MANUAL&&(this.turnOffOnManualMode&&(this._timeout===null&&(this._previousEnabled=this.postproduction.enabled),this.postproduction.enabled&&(this.postproduction.enabled=!1)),this.manualDefaultStyle!==this.postproduction.style&&this.setStyleWithoutEvent(this.manualDefaultStyle)),this.postproduction.enabled?this.postproduction.update():this.three.render(e,t),this.mode===lt.MANUAL&&(this._timeout&&clearTimeout(this._timeout),this._timeout=setTimeout(()=>{this._timeout=null,this.turnOffOnManualMode&&(this.postproduction.enabled=this._previousEnabled),this.setStyleWithoutEvent(this._previousStyle),this.postproduction.enabled&&this.postproduction.update()},this.manualModeDelay)),this.onAfterUpdate.trigger()}updateOverlayOnly(){if(!(!this.enabled||!this.currentWorld)){if(this.api==="webgpu"){this.update();return}if(!this.postproduction.enabled||this.postproduction.mode!==Y.DEFERRED){this.update();return}this.onBeforeUpdate.trigger(),this.postproduction.updateOverlayOnly(),this.onAfterUpdate.trigger()}}applyPostproductionSize(){this.setPostproductionSize()}dispose(){if(this._timeout!==null&&(clearTimeout(this._timeout),this._timeout=null),super.dispose(),this.api==="webgpu"){this.pipeline?.dispose?.(),this.pipeline=null;for(const e of this._keptPipelines)e.pipeline.dispose?.();this._keptPipelines.length=0,this._disposeLowPipeline(),this._wholeTarget?.dispose(),this._wholeTarget=null,this.movingResolution.onSwitch.reset(),this._webgpuPostproduction?.dispose();return}this.postproduction.dispose()}setStyleWithoutEvent(e){this.postproduction.onStyleChanged.enabled=!1,this.postproduction.style=e,this.postproduction.onStyleChanged.enabled=!0}setPostproductionSize(e){if(e&&(e.x===0||e.y===0)||!this.container||!this._postproduction)return;const t=this._resolutionCeiling,s=this.adaptiveResolution?this._adaptiveScale:1,i=Math.max(1,t*s),r=(e?.x??this.container.clientWidth)*i,a=(e?.y??this.container.clientHeight)*i;r===0||a===0||this.postproduction.setSize(r,a)}_updateAdaptiveScale(){if(!this.adaptiveResolution){this._adaptiveScale!==1&&(this._adaptiveScale=1,this.setPostproductionSize()),this._frameMsEma=0,this._lastFrameStamp=0,this._adaptiveFrames=0,this._adaptivePending=0;return}const e=performance.now();if(this._lastFrameStamp>0){const i=e-this._lastFrameStamp;i>0&&i<1e3&&(this._frameMsEma=this._frameMsEma===0?i:this._frameMsEma*.8+i*.2)}if(this._lastFrameStamp=e,this._adaptiveFrames+=1,this._adaptiveFrames<8||this._frameMsEma===0)return;this._adaptiveFrames=0;const t=1e3/Math.max(1,this.adaptiveTargetFps);let s=0;if(this._frameMsEma>t*1.25?s=-1:this._frameMsEma<t*.7&&(s=1),this.adaptiveDebug&&console.log(`[adaptive] ema=${this._frameMsEma.toFixed(1)}ms target=${t.toFixed(1)}ms(${this.adaptiveTargetFps}fps) dir=${s} scale=${this._adaptiveScale.toFixed(2)} [min=${this._effectiveMinScale.toFixed(2)} max=${this.adaptiveMaxScale}]`),s<0){const i=Math.max(this._effectiveMinScale,this._adaptiveScale-.1);i!==this._adaptiveScale&&(this._adaptiveScale=i,this.setPostproductionSize()),this._adaptivePending=0}else if(s>0&&this._adaptivePending>0){const i=Math.min(this.adaptiveMaxScale,this._adaptiveScale+.05);i!==this._adaptiveScale&&(this._adaptiveScale=i,this.setPostproductionSize()),this._adaptivePending=0}else this._adaptivePending=s}}export{It as D,Wt as E,ii as P,Y as a,j as b};
