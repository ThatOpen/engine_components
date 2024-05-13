var pe=Object.defineProperty;var me=(s,e,t)=>e in s?pe(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var o=(s,e,t)=>(me(s,typeof e!="symbol"?e+"":e,t),t);import{f as ge,U as ee,h as C,i as ve,j as D,k as j,V as f,l as we,F as J,m as I,n as M,W as ye,o as te,p as k,a as _e,q as be,M as ne,r as ie,D as xe,A as Se,B as Ee,b as Me}from"./web-ifc-api-Glg4rFxW.js";import{S as Ae}from"./stats.min-GTpOrGrX.js";import{D as B,J as Le,e as ze}from"./import-wrapper-prod-DOkjDpKP.js";import{P as Ue}from"./index-Cla0sIX3.js";import{D as Pe}from"./types-BHr6GdIp.js";import{M as Ce}from"./mark-C0U8dImi.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-CZFmkGMI.js";C.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ge(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};D.line={uniforms:ee.merge([C.common,C.fog,C.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class T extends ve{constructor(e){super({type:"LineMaterial",uniforms:ee.clone(D.line.uniforms),vertexShader:D.line.vertexShader,fragmentShader:D.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}}const $=new j,z=new f;class se extends we{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new J(e,3)),this.setAttribute("uv",new J(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new I(t,6,1);return this.setAttribute("instanceStart",new M(i,3,0)),this.setAttribute("instanceEnd",new M(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new I(t,6,1);return this.setAttribute("instanceColorStart",new M(i,3,0)),this.setAttribute("instanceColorEnd",new M(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new ye(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new j);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),$.setFromBufferAttribute(t),this.boundingBox.union($))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new te),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,l=e.count;r<l;r++)z.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(z)),z.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(z));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class re extends se{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setColors(i),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}const X=new f,Q=new f,d=new k,c=new k,w=new k,W=new f,G=new _e,u=new be,Y=new f,U=new j,P=new te,y=new k;let _,S;function Z(s,e,t){return y.set(0,0,-e,1).applyMatrix4(s.projectionMatrix),y.multiplyScalar(1/y.w),y.x=S/t.width,y.y=S/t.height,y.applyMatrix4(s.projectionMatrixInverse),y.multiplyScalar(1/y.w),Math.abs(Math.max(y.x,y.y))}function De(s,e){const t=s.matrixWorld,i=s.geometry,n=i.attributes.instanceStart,r=i.attributes.instanceEnd,l=Math.min(i.instanceCount,n.count);for(let a=0,p=l;a<p;a++){u.start.fromBufferAttribute(n,a),u.end.fromBufferAttribute(r,a),u.applyMatrix4(t);const g=new f,v=new f;_.distanceSqToSegment(u.start,u.end,v,g),v.distanceTo(g)<S*.5&&e.push({point:v,pointOnLine:g,distance:_.origin.distanceTo(v),object:s,face:null,faceIndex:a,uv:null,uv1:null})}}function Be(s,e,t){const i=e.projectionMatrix,r=s.material.resolution,l=s.matrixWorld,a=s.geometry,p=a.attributes.instanceStart,g=a.attributes.instanceEnd,v=Math.min(a.instanceCount,p.count),m=-e.near;_.at(1,w),w.w=1,w.applyMatrix4(e.matrixWorldInverse),w.applyMatrix4(i),w.multiplyScalar(1/w.w),w.x*=r.x/2,w.y*=r.y/2,w.z=0,W.copy(w),G.multiplyMatrices(e.matrixWorldInverse,l);for(let b=0,ue=v;b<ue;b++){if(d.fromBufferAttribute(p,b),c.fromBufferAttribute(g,b),d.w=1,c.w=1,d.applyMatrix4(G),c.applyMatrix4(G),d.z>m&&c.z>m)continue;if(d.z>m){const E=d.z-c.z,x=(d.z-m)/E;d.lerp(c,x)}else if(c.z>m){const E=c.z-d.z,x=(c.z-m)/E;c.lerp(d,x)}d.applyMatrix4(i),c.applyMatrix4(i),d.multiplyScalar(1/d.w),c.multiplyScalar(1/c.w),d.x*=r.x/2,d.y*=r.y/2,c.x*=r.x/2,c.y*=r.y/2,u.start.copy(d),u.start.z=0,u.end.copy(c),u.end.z=0;const q=u.closestPointToPointParameter(W,!0);u.at(q,Y);const K=ie.lerp(d.z,c.z,q),he=K>=-1&&K<=1,fe=W.distanceTo(Y)<S*.5;if(he&&fe){u.start.fromBufferAttribute(p,b),u.end.fromBufferAttribute(g,b),u.start.applyMatrix4(l),u.end.applyMatrix4(l);const E=new f,x=new f;_.distanceSqToSegment(u.start,u.end,x,E),t.push({point:x,pointOnLine:E,distance:_.origin.distanceTo(x),object:s,face:null,faceIndex:b,uv:null,uv1:null})}}}class ke extends ne{constructor(e=new se,t=new T({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let l=0,a=0,p=t.count;l<p;l++,a+=2)X.fromBufferAttribute(t,l),Q.fromBufferAttribute(i,l),n[a]=a===0?0:n[a-1],n[a+1]=n[a]+X.distanceTo(Q);const r=new I(n,2,1);return e.setAttribute("instanceDistanceStart",new M(r,1,0)),e.setAttribute("instanceDistanceEnd",new M(r,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;_=e.ray;const l=this.matrixWorld,a=this.geometry,p=this.material;S=p.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),P.copy(a.boundingSphere).applyMatrix4(l);let g;if(i)g=S*.5;else{const m=Math.max(n.near,P.distanceToPoint(_.origin));g=Z(n,m,p.resolution)}if(P.radius+=g,_.intersectsSphere(P)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),U.copy(a.boundingBox).applyMatrix4(l);let v;if(i)v=S*.5;else{const m=Math.max(n.near,U.distanceToPoint(_.origin));v=Z(n,m,p.resolution)}U.expandByScalar(v),_.intersectsBox(U)!==!1&&(i?De(this,t):Be(this,n,t))}}class Te extends ke{constructor(e=new re,t=new T({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}class Oe{constructor(e,t){o(this,"enabled",!0);o(this,"visible",!0);o(this,"points",[]);o(this,"world");o(this,"onDisposed",new B);o(this,"_lineMaterial",new T({color:6629591,linewidth:2}));o(this,"_lineGeometry",new re);o(this,"_line",new Te(this._lineGeometry,this._lineMaterial));o(this,"_labelMarker");o(this,"onAngleComputed",new B);o(this,"onPointAdded",new B);this.world=e;const i=document.createElement("div");i.className=Pe,this._labelMarker=new Ce(e,i),this.labelMarker.visible=!1,this.onPointAdded.add(()=>{this.points.length===1&&e.scene.three.add(this._line),this.points.length===3&&(this.labelMarker.visible=!0)}),this.onAngleComputed.add(n=>{this.labelMarker.three.element.textContent=`${n.toFixed(2)}°`,this.labelMarker.three.position.copy(this.points[1]??new f)}),t==null||t.forEach(n=>this.setPoint(n))}set lineMaterial(e){this._lineMaterial.dispose(),this._lineMaterial=e,this._line.material=e,this._lineMaterial.resolution.set(window.innerWidth,window.innerHeight)}get lineMaterial(){return this._lineMaterial}set labelMarker(e){this._labelMarker.dispose(),this._labelMarker=e}get labelMarker(){return this._labelMarker}get angle(){return{points:this.points,angle:this.computeAngle()}}setPoint(e,t){let i;if(t?i=t:i=this.points.length===0?0:this.points.length,![0,1,2].includes(i))return;this.points[i]=e,this.onPointAdded.trigger(e);const n=this.points.map(r=>[r.x,r.y,r.z]);this._lineGeometry.setPositions(n.flat())}toggleLabel(){this.labelMarker.toggleVisibility()}computeAngle(){const e=this.points[0],t=this.points[1],i=this.points[2];if(!(e&&t&&i))return 0;const n=new f().subVectors(t,e),r=new f().subVectors(t,i),l=ie.radToDeg(n.angleTo(r));return this.onAngleComputed.trigger(l),l}dispose(){this.points=[],this.labelMarker.dispose(),this.onAngleComputed.reset(),this.onPointAdded.reset(),this.labelMarker.dispose(),this._line.removeFromParent(),this._lineMaterial.dispose(),this._lineGeometry.dispose(),this.onDisposed.trigger(),this.onDisposed.reset()}}const A=class A extends Le{constructor(t){super(t);o(this,"onDisposed",new B);o(this,"world");o(this,"list",[]);o(this,"_lineMaterial");o(this,"_enabled",!1);o(this,"_vertexPicker");o(this,"_currentAngleElement",null);o(this,"_clickCount",0);o(this,"create",()=>{if(!this.enabled)return;if(!this.world){console.log("No world selected for angle measurement!");return}const t=this._vertexPicker.get(this.world);if(t){if(!this._currentAngleElement){const i=new Oe(this.world);i.lineMaterial=this.lineMaterial,this._currentAngleElement=i}this._currentAngleElement.setPoint(t,this._clickCount),this._currentAngleElement.setPoint(t,this._clickCount+1),this._currentAngleElement.setPoint(t,this._clickCount+2),this._currentAngleElement.computeAngle(),this._clickCount++,this._clickCount===3&&this.endCreation()}});o(this,"onMouseMove",()=>{if(!this.world){console.log("No world selected for angle measurement!");return}const t=this._vertexPicker.get(this.world);t&&this._currentAngleElement&&(this._currentAngleElement.setPoint(t,this._clickCount),this._currentAngleElement.computeAngle())});o(this,"onKeyDown",t=>{this.enabled&&(t.key==="z"&&t.ctrlKey&&this._currentAngleElement,t.key==="Escape"&&(this._clickCount===0&&!this._currentAngleElement?this.enabled=!1:this.cancelCreation()))});this.components.add(A.uuid,this),this._vertexPicker=new ze(t),this._lineMaterial=new T({color:6629591,linewidth:2})}set lineMaterial(t){this._lineMaterial.dispose(),this._lineMaterial=t,this._lineMaterial.resolution.set(window.innerWidth,window.innerHeight)}get lineMaterial(){return this._lineMaterial}set enabled(t){this._enabled=t,this.setupEvents(t),this._vertexPicker.enabled=t,t||this.cancelCreation()}get enabled(){return this._enabled}set workingPlane(t){this._vertexPicker.workingPlane=t}get workingPlane(){return this._vertexPicker.workingPlane}dispose(){this.setupEvents(!1),this._lineMaterial.dispose(),this._vertexPicker.dispose();for(const t of this.list)t.dispose();this._currentAngleElement&&this._currentAngleElement.dispose(),this.components=null,this.onDisposed.trigger(A.uuid),this.onDisposed.reset()}delete(){}deleteAll(){for(const t of this.list)t.dispose();this.list=[]}endCreation(){this._currentAngleElement&&(this.list.push(this._currentAngleElement),this._currentAngleElement.computeAngle(),this._currentAngleElement=null),this._clickCount=0}cancelCreation(){this._currentAngleElement&&(this._currentAngleElement.dispose(),this._currentAngleElement=null),this._clickCount=0}setupEvents(t){if(!this.world)throw new Error("No world selected for angle measurement!");if(!this.world.renderer)throw new Error("The given world doesn't have a renderer!");const n=this.world.renderer.three.domElement.parentElement;t?(n.addEventListener("click",this.create),n.addEventListener("mousemove",this.onMouseMove),window.addEventListener("keydown",this.onKeyDown)):(n.removeEventListener("click",this.create),n.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("keydown",this.onKeyDown))}};o(A,"uuid","622fb2c9-528c-4b0a-8a0e-6a1375f0a3aa");let N=A;const oe=document.getElementById("container"),h=new(void 0),ae=new(void 0)(h);ae.setup();h.scene=ae;const F=new Ue(h,oe);h.renderer=F;const le=new(void 0)(h);h.camera=le;h.raycaster=new(void 0)(h);h.init();const H=h.scene.get();le.controls.setLookAt(10,10,10,0,0,0);const R=new xe;R.position.set(5,10,3);R.intensity=.5;H.add(R);const de=new Se;de.intensity=.5;H.add(de);new(void 0)(h);const We=new Ee(3,3,3),Ge=new Me({color:"#6528D7"}),V=new ne(We,Ge);V.position.set(0,1.5,0);H.add(V);h.meshes.add(V);const O=new N(h);O.enabled=!0;oe.ondblclick=()=>O.create();window.onkeydown=s=>{(s.code==="Delete"||s.code==="Backspace")&&O.delete()};const ce=new(void 0)(h,{name:"Main Toolbar",position:"bottom"});ce.addChild(O.uiElement.get("main"));h.ui.addToolbar(ce);const L=new Ae;L.showPanel(2);document.body.append(L.dom);L.dom.style.left="0px";F.onBeforeUpdate.add(()=>L.begin());F.onAfterUpdate.add(()=>L.end());
