const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./three.tsl-bQ5sYDei.js","./three.webgpu-DZYsJmo3.js","./TransformControls-lNp9RmyE.js","./index-D7sJySqt.js"])))=>i.map(i=>d[i]);
import{Y as B,X as U,aD as _e,$ as X,aE as Y,J as we,V as P,a as J,i as Se,E as ee,aF as xe,ac as te,ab as ye,N as L,x as Pe,M as ie,a7 as Ce,e as j,w as ze,O as Oe,P as ke,W as De,aG as Ne,S as Me,K as Te,n as Re,b as Ee}from"./TransformControls-lNp9RmyE.js";import{a as Ae,E as ne,f as Le,c as Be,W as We,S as Ve,O as Fe,G as Ue,F as ae,b as Ie}from"./graphic-vertex-picker-DI4NqEOA.js";import{P as He,a as je,b as Ge}from"./index-DRMWQziR.js";import{_ as le}from"./preload-helper-PPVm8Dsz.js";import"./index-w2Uqv0fG.js";import"./renderer-with-2d-DTPUqC0M.js";const $e=new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]),qe=[0,1,2,0,2,3],Qe=new Float32Array([0,0,1,0,1,1,0,1]),re=new WeakMap;function Ze(o){const e=re.get(o);if(e)return e;const i=o.getAttribute("position"),t=o.getAttribute("rgba"),r=new _e;return r.setAttribute("position",new X($e,3)),r.setAttribute("uv",new X(Qe,2)),r.setIndex(qe),r.setAttribute("iPosition",new Y(i.array,i.itemSize)),r.setAttribute("iRgba",new Y(t.array,t.itemSize,t.normalized)),r.instanceCount=i.count,r.boundingSphere=new we(new P,1/0),re.set(o,r),r}let ce=null;async function Ke(){ce??=await le(()=>import("./three.tsl-bQ5sYDei.js"),__vite__mapDeps([0,1,2]),import.meta.url)}function Xe(o){const e=ce;if(!e)throw new Error("PointCloudLoader: call `prepareWebgpuPoints()` before building a webgpu point material.");const{Fn:i,If:t,Loop:r,attribute:a,uniform:n,texture:u,int:l,float:s,vec3:h,vec4:f,ivec2:g,bitAnd:v,shiftRight:m,positionView:_}=e,c={visibleNodes:u(o),uOctreeSize:n(1),uOctreeSpacing:n(1),uScreenHeight:n(1),fov:n(1),uOrtho:n(0),uOrthoWorldHeight:n(1),size:n(1),smallestSize:n(2),maxSize:n(50),uOverlap:n(1.2),uLevel:n(0),uVNStart:n(0),uCircle:n(1),uOutline:n(.18),uEmitDepth:n(0),uNumClip:n(0),clip:Array.from({length:8},()=>n(new B))},S=a("iPosition","vec3"),T=a("iRgba","vec4"),R=i(()=>{const b=h(0,0,0).toVar(),d=l(c.uVNStart).toVar(),x=s(c.uLevel).toVar(),k=s(c.uLevel).toVar(),N=l(0).toVar();return r({start:0,end:31,type:"int"},({i:me})=>{t(N.equal(l(0)),()=>{const q=c.uOctreeSize.div(s(2).pow(s(me).add(c.uLevel))),E=S.sub(b).div(q).add(.5).floor(),Q=l(E.x.mul(4).add(E.y.mul(2)).add(E.z).add(.5).floor()),A=c.visibleNodes.load(g(d,l(0))),Z=l(A.r.mul(255).add(.5).floor());t(v(m(Z,Q),l(1)).equal(l(1)),()=>{const fe=l(A.g.mul(255).add(.5).floor()).mul(l(256)),ge=l(A.b.mul(255).add(.5).floor()),ve=v(Z,m(l(255),l(8).sub(Q))),K=l(0).toVar();r({start:0,end:8,type:"int"},({i:be})=>{K.addAssign(v(m(ve,be),l(1)))}),d.assign(d.add(fe).add(ge).add(K)),x.addAssign(1)}).Else(()=>{k.assign(x.add(A.a.mul(255).div(10).sub(10))),N.assign(l(1))}),t(N.equal(l(0)),()=>{b.assign(b.add(E.mul(q).mul(.5))),k.assign(x)})})}),k}),z=i(()=>{const b=_.z,d=s(0).toVar();t(c.uOrtho.greaterThan(.5),()=>{d.assign(c.uScreenHeight.div(c.uOrthoWorldHeight))}).Else(()=>{const N=c.fov.div(2).tan();d.assign(c.uScreenHeight.mul(-.5).div(N.mul(b)))});const x=c.uOctreeSpacing.mul(c.uOverlap);return c.size.mul(x).div(s(2).pow(R())).mul(d).max(c.smallestSize).min(c.maxSize)}),I=i(()=>{const b=l(0).toVar();for(let d=0;d<8;d++)t(l(d).lessThan(c.uNumClip),()=>{const x=c.clip[d];t(_.dot(x.xyz).greaterThan(x.w),()=>{b.assign(l(1))})});return b}),w=new(void 0);w.sizeAttenuation=!1,w.transparent=!1,w.blending=U,w.positionNode=S,w.sizeNode=i(()=>I().equal(l(1)).select(s(0),z()))(),w.colorNode=i(()=>{const d=e.uv().sub(.5).mul(2).length();t(c.uCircle.greaterThan(.5).and(d.greaterThan(1)),()=>{e.Discard()});const x=c.uOutline.mul(e.smoothstep(3,8,z())).mul(c.uCircle.step(.5)),k=e.mix(T.rgb,T.rgb.mul(.25),e.smoothstep(s(1).sub(x),s(1),d));return f(k,c.uEmitDepth.greaterThan(.5).select(_.z.negate(),s(1)))})();const H=Array.from({length:8},(b,d)=>c.clip[d].value),$={uCutPlanes:{get value(){return H},set value(b){for(let d=0;d<8;d++)c.clip[d].value.copy(b[d]??new B)}}};for(const b of Object.keys(c)){if(b==="clip")continue;const d=c[b];Object.defineProperty($,b,{enumerable:!0,get:()=>d,set:()=>{}})}return w.uniforms=$,w}function Ye(o,e,i,t){e.fill(0);const r=new Map;for(const s of o)r.set(s,i(s));const a=[...o].sort((s,h)=>{const f=r.get(s),g=r.get(h);return f.length!==g.length?f.length-g.length:f===g?0:f<g?-1:1}),n=new Map,u=new Map,l=[];return a.forEach((s,h)=>{const f=r.get(s);n.set(f,h),u.set(s,h);const g=n.get(f.slice(0,-1));h>0&&g!==void 0&&(e[g*4]|=1<<Number(f[f.length-1]),l[g]??=h);const v=t(s);e[h*4+3]=typeof v=="number"&&!Number.isNaN(v)?10*(Math.log2(v)/2+8.5):100}),l.forEach((s,h)=>{const f=s-h;e[h*4+1]=f>>8,e[h*4+2]=f&255}),u}const Je={pointBudget:15e5,minNodePixelSize:260,overlap:1.2,maxSize:50,edl:!1,edlStrength:.4,edlRadius:1.4,shape:"circle",outline:.18},oe=2048;function ue(o){return o.geometryNode?.name??o.name??"r"}function se(o){const e=o.geometryNode||o;return typeof e.level=="number"?e.level:Math.max(0,ue(o).length-1)}function et(){return{visibleNodes:{value:null},uOctreeSize:{value:1},uOctreeSpacing:{value:1},uScreenHeight:{value:1},fov:{value:1},uOrtho:{value:0},uOrthoWorldHeight:{value:1},size:{value:1},smallestSize:{value:2},maxSize:{value:50},uOverlap:{value:1.2},uLevel:{value:0},uVNStart:{value:0},uCircle:{value:1},uOutline:{value:.18},uEmitDepth:{value:0},uCutPlanes:{value:Array.from({length:8},()=>new B)},uNumClip:{value:0}}}const de=`
      precision highp float;
      precision highp int;
      attribute vec4 rgba;
      uniform float uScreenHeight, fov, size, minSize, maxSize, uOverlap;
      uniform float uOctreeSpacing, uOctreeSize, uLevel, uVNStart;
      uniform float uOrtho, uOrthoWorldHeight;   // ortho camera: distance-independent sizing
      uniform sampler2D visibleNodes;
      uniform vec4 uCutPlanes[8];   // active section planes in VIEW space (xyz=normal, w=const)
      uniform int uNumClip;          // 0 = clipping off
      varying vec3 vColor;
      varying float vSize;
      varying float vViewZ;

      float rnd(float x){ return floor(x + 0.5); }
      vec3 rnd3(vec3 v){ return floor(v + 0.5); }
      int numberOfOnes(int number, int index){
        int numOnes = 0; int tmp = 128;
        for(int i = 7; i >= 0; i--){
          if(number >= tmp){ number = number - tmp; if(i <= index){ numOnes++; } }
          tmp = tmp / 2;
        }
        return numOnes;
      }
      bool isBitSet(int number, int index){
        int powi = 1;
        if(index == 1) powi = 2; else if(index == 2) powi = 4; else if(index == 3) powi = 8;
        else if(index == 4) powi = 16; else if(index == 5) powi = 32;
        else if(index == 6) powi = 64; else if(index == 7) powi = 128;
        int tmp = number / powi;
        return (tmp - (tmp / 2) * 2) == 1;
      }
      float getLOD(){
        vec3 offset = vec3(0.0);
        int iOffset = int(uVNStart);
        float depth = uLevel;
        for(float i = 0.0; i <= 30.0; i++){
          float nodeSizeAtLevel = uOctreeSize / pow(2.0, i + uLevel);
          vec3 index3d = (position - offset) / nodeSizeAtLevel;
          index3d = rnd3(index3d);
          int index = int(rnd(4.0 * index3d.x + 2.0 * index3d.y + index3d.z));
          vec4 value = texture2D(visibleNodes, vec2(float(iOffset) / 2048.0, 0.0));
          int mask = int(rnd(value.r * 255.0));
          if(isBitSet(mask, index)){
            int advanceG = int(rnd(value.g * 255.0)) * 256;
            int advanceB = int(rnd(value.b * 255.0));
            int advanceChild = numberOfOnes(mask, index - 1);
            iOffset = iOffset + advanceG + advanceB + advanceChild;
            depth = depth + 1.0;
          } else {
            float lodOffset = (255.0 * value.a) / 10.0 - 10.0;
            return depth + lodOffset;
          }
          offset = offset + (vec3(1.0) * nodeSizeAtLevel * 0.5) * index3d;
        }
        return depth;
      }
      void main(){
        vColor = rgba.rgb;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Section clipping: cull the point when it's on the clipped side of any active
        // plane (view-space; matches three's convention: discard dot(viewPos,n) > const).
        for (int ci = 0; ci < 8; ci++) {
          if (ci >= uNumClip) break;
          if (dot(mvPosition.xyz, uCutPlanes[ci].xyz) > uCutPlanes[ci].w) {
            gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return;
          }
        }
        gl_Position = projectionMatrix * mvPosition;
        vViewZ = -mvPosition.z;                         // linear eye distance (EDL alpha)
        // World→pixel scale for the point sprite. PERSPECTIVE: foreshortened (∝ 1/depth).
        // ORTHOGRAPHIC: distance-INDEPENDENT — a constant pixels-per-world-unit given by
        // the viewport height in pixels over the world height it spans. Using the
        // perspective factor under ortho makes far points shrink → the cloud looks sparse
        // and the adaptive LOD-size compensation (which rides on projFactor) breaks, so
        // node boundaries stop blending (the rectangular density seams).
        float projFactor;
        if (uOrtho > 0.5) {
          projFactor = uScreenHeight / uOrthoWorldHeight;
        } else {
          float slope = tan(fov / 2.0);
          projFactor = -0.5 * uScreenHeight / (slope * mvPosition.z);
        }
        float r = uOctreeSpacing * uOverlap;            // overdraw lever
        float lod = getLOD();
        float worldSpaceSize = size * r / pow(2.0, lod);
        float pointSize = worldSpaceSize * projFactor;
        pointSize = max(minSize, pointSize);
        pointSize = min(maxSize, pointSize);
        gl_PointSize = pointSize;
        vSize = pointSize;
      }`,tt=`
      precision highp float;
      uniform float uCircle, uOutline, uEmitDepth;
      varying vec3 vColor;
      varying float vSize;
      varying float vViewZ;
      void main(){
        vec3 col = vColor;
        float r = length(gl_PointCoord - 0.5) * 2.0;
        if (uCircle > 0.5 && r > 1.0) discard;          // round points
        // Dark-rim outline is a RADIAL fade (uses r), so it only reads correctly on
        // ROUND points — on a square sprite it would draw a circle inside the quad.
        // Gate it on the round shape (+ a >0 strength so it's fully skippable).
        if (uCircle > 0.5 && uOutline > 0.0) {
          float ol = uOutline * smoothstep(3.0, 8.0, vSize);
          col = mix(col, col * 0.25, smoothstep(1.0 - ol, 1.0, r)); // dark rim (faded for small)
        }
        // uEmitDepth=1 (EDL pass): alpha = linear eye depth; uEmitDepth=0: OPAQUE alpha=1.
        gl_FragColor = vec4(col, uEmitDepth > 0.5 ? vViewZ : 1.0);
      }`;function it(){return new j({blending:U,uniforms:et(),vertexShader:de,fragmentShader:tt})}function nt(o,e){return new j({blending:U,depthTest:!0,depthWrite:!0,uniforms:e,vertexShader:de,fragmentShader:`
      precision highp float;
      uniform float uCircle;
      void main(){
        float r = length(gl_PointCoord - 0.5) * 2.0;
        if (uCircle > 0.5 && r > 1.0) discard;   // round points: match the visible disc
        ${o}
        gl_FragColor = packedDepth;
      }`})}class W extends Ae{static uuid="a1e6c3d2-7f4b-4a91-9c2e-3d5f8b0a6e14";onDisposed=new ne;onCloudLoaded=new ne;list=new Map;settings={...Je};_world=null;_enabled=!0;_wired=!1;_potree=null;_clouds=new Map;_scene=new J;_clipScratch=Array.from({length:8},()=>new B);_scratchPlane=new Se;_matBase=it();_webgpuPoints=!1;_webgpu=!1;_directSeam(){return this._webgpu||!this.settings.edl}_pickPicker=null;_pickContributor=null;_pickDepthMats=new Map;_edlRT=null;_edlMat=null;_edlScene=null;_edlCam=null;constructor(e){super(e),e.add(W.uuid,this)}set world(e){e!==this._world&&(this._unwire(),this._world=e,e&&this._enabled&&this._wire())}get world(){return this._world}set enabled(e){e!==this._enabled&&(this._enabled=e,e&&this._world?this._wire():this._unwire())}get enabled(){return this._enabled}async load(e,i){if(!this._world)throw new Error("PointCloudLoader: set `world` before calling load().");const t=typeof e=="string"?{url:e}:e,r=i?.id??t.url,a=t.url.endsWith("/")?t.url:`${t.url}/`,n=t.metadata??"metadata.json",u=t.requestManager??rt(a),{Potree:l}=await le(async()=>{const{Potree:H}=await import("./index-D7sJySqt.js");return{Potree:H}},__vite__mapDeps([3,2]),import.meta.url);this._potree||(this._potree=new l),this._potree.pointBudget=this.settings.pointBudget;const s=await this._potree.loadPointCloud(n,u);s.rotation.x=-Math.PI/2,s.minNodePixelSize=this.settings.minNodePixelSize,s.updateMatrixWorld(!0);const h=s.pcoGeometry.boundingBox.clone(),f=h.getCenter(new P),g=s.position.clone(),v=f.clone().add(g),m=i?.anchor?i.anchor.clone():v,_=new ee().extractRotation(s.matrixWorld),c=m.clone().sub(g);s.position.copy(c).applyMatrix4(_).negate(),s.updateMatrixWorld(!0);const S=h.applyMatrix4(s.matrixWorld),T=s.pcoGeometry?.spacing||0,R=new Uint8Array(oe*4),z=new xe(R,oe,1,te,ye);z.minFilter=L,z.magFilter=L,z.generateMipmaps=!1,z.needsUpdate=!0;const I={id:r,pco:s,anchor:m,box:S,spacing:T,wrappers:new Map,vnData:R,vnTexture:z,centered:!!i?.anchor};this.remove(r),this._clouds.set(r,I),i?.fitCamera&&this._fit(S);const w={id:r,anchor:m,box:S,object:s,get visiblePointCount(){return s.numVisiblePoints??0}};return this.list.set(r,w),this.onCloudLoaded.trigger(w),w}remove(e){const i=this._clouds.get(e);if(i){for(const t of i.wrappers.values())this._scene.remove(t),t.material.dispose();i.wrappers.clear(),i.vnTexture.dispose(),this._clouds.delete(e)}this.list.delete(e)}dispose(){this._unwire();for(const e of[...this._clouds.keys()])this.remove(e);this._matBase.dispose(),this._edlRT?.dispose(),this._edlMat?.dispose(),this._world=null,this._potree=null,this.onCloudLoaded.reset(),this.onDisposed.trigger(),this.onDisposed.reset()}_renderer(){const e=this._world?.renderer;return e&&e.postproduction&&e.onBeforeUpdate?e:null}static teachCapabilities(e){!e||e.capabilities||(e.capabilities={logarithmicDepthBuffer:!1})}_wire(){if(this._wired)return;const e=this._renderer();e&&(W.teachCapabilities(e.three),e.three.isWebGPURenderer&&(this._webgpu=!0,Ke().then(()=>{this._webgpuPoints=!0})),e.onBeforeUpdate.add(this._update),e.postproduction.addOcclusionPass(this._occlusion,this._directSeam()),this._registerPickContributor(),this._wired=!0)}_unwire(){if(!this._wired)return;const e=this._renderer();e&&(e.onBeforeUpdate.remove(this._update),e.postproduction.removeOcclusionPass(this._occlusion)),this._unregisterPickContributor(),this._wired=!1}_registerPickContributor(){if(!this._world||this._pickContributor)return;const e=this.components.get(Le).get(this._world);this._pickPicker=e,this._pickContributor=({renderer:i})=>this._renderPickDepth(i),e.pickDepthContributors.add(this._pickContributor)}_unregisterPickContributor(){this._pickPicker&&this._pickContributor&&this._pickPicker.pickDepthContributors.delete(this._pickContributor),this._pickPicker=null,this._pickContributor=null;for(const e of this._pickDepthMats.values())e.dispose();this._pickDepthMats.clear()}_renderPickDepth(e){if(!this._pickPicker||this._clouds.size===0)return;const i=this._world?.camera.three;if(!i)return;const t=this._pickPicker.depthPackBody,r=new Set;for(const a of this._clouds.values())for(const n of a.wrappers.values()){if(!n.visible)continue;r.add(n.uuid);let u=this._pickDepthMats.get(n.uuid);if(!u){const s=n.material.uniforms;u=nt(t,s),this._pickDepthMats.set(n.uuid,u)}const l=n.material;n.material=u,e.render(n,i),n.material=l}for(const[a,n]of this._pickDepthMats)r.has(a)||(n.dispose(),this._pickDepthMats.delete(a))}_update=()=>{if(!this._enabled||!this._world||this._clouds.size===0)return;const e=this._potree,i=this._renderer();if(!e||!i)return;e.pointBudget=this.settings.pointBudget,i.postproduction.setOcclusionDirect(this._occlusion,this._directSeam());const t=this._world.camera.three,r=[];for(const a of this._clouds.values())a.pco.minNodePixelSize=this.settings.minNodePixelSize,r.push(a.pco);e.updatePointClouds(r,t,i.three);for(const a of this._clouds.values())this._syncCloud(a,t);this._applySettings()};_syncCloud(e,i){const{pco:t}=e;t.updateMatrixWorld(!0),e.centered||this._centerOnCentroid(e);const r=t.visibleNodes||[],a=this._buildVisibilityTexture(e,r),n=new P,u=(t.pcoGeometry?.boundingBox).getSize(n).x,l=Pe.degToRad(i.fov??60),s=i.isOrthographicCamera===!0,h=i,f=s?(h.top-h.bottom)/(h.zoom||1):1,g=new Set;for(const v of r){const m=v.sceneNode;if(!m||!m.geometry?.attributes?.rgba)continue;g.add(m.uuid);let _=e.wrappers.get(m.uuid);if(!_){const S=this._webgpuPoints?Xe(e.vnTexture):this._matBase.clone();S.uniforms.visibleNodes.value=e.vnTexture,S.uniforms.uOctreeSpacing.value=e.spacing,_=this._webgpuPoints?new ie(Ze(m.geometry),S):new Ce(m.geometry,S),_.matrixAutoUpdate=!1,_.frustumCulled=!1,e.wrappers.set(m.uuid,_),this._scene.add(_)}const c=_.material.uniforms;c.uOctreeSize.value=u,c.fov.value=l,c.uOrtho.value=s?1:0,c.uOrthoWorldHeight.value=f,c.uLevel.value=se(v),c.uVNStart.value=a.get(v)??0,_.matrix.copy(m.matrixWorld),_.matrixWorldNeedsUpdate=!0}for(const[v,m]of e.wrappers)g.has(v)||(this._scene.remove(m),m.material.dispose(),e.wrappers.delete(v))}_centerOnCentroid(e){const{pco:i}=e;let t=null;for(const s of i.visibleNodes||[])if(se(s)===0&&s.sceneNode?.geometry?.attributes?.position){t=s.sceneNode;break}if(t||(t=(i.visibleNodes||[])[0]?.sceneNode),!t?.geometry?.attributes?.position?.count)return;t.updateMatrixWorld(!0);const r=t.geometry.attributes.position,a=new P,n=new P;for(let s=0;s<r.count;s++)a.fromBufferAttribute(r,s).applyMatrix4(t.matrixWorld),n.add(a);n.multiplyScalar(1/r.count),i.position.sub(n),i.updateMatrixWorld(!0);const u=new ee().extractRotation(i.matrixWorld),l=n.clone().applyMatrix4(u.clone().invert());e.anchor.add(l),e.box.translate(n.clone().negate()),e.centered=!0}_buildVisibilityTexture(e,i){const{vnData:t,vnTexture:r}=e,a=Ye(i,t,ue,n=>n.geometryNode?.density);return r.needsUpdate=!0,a}_applySettings(){const e=this.settings,i=t=>{t.maxSize.value=e.maxSize,t.uOverlap.value=e.overlap,t.uCircle.value=e.shape==="circle"?1:0,t.uOutline.value=e.outline,t.uEmitDepth.value=e.edl&&!this._webgpu?1:0};i(this._matBase.uniforms);for(const t of this._clouds.values())for(const r of t.wrappers.values())i(r.material.uniforms)}_computeClipPlanes(e){const i=this._world?.renderer,t=i?.clippingPlanes??[],r=i?.three?.clippingPlanes??[],a=t.length?t:r,n=Math.min(a.length,8);for(let u=0;u<n;u++){const l=this._scratchPlane.copy(a[u]).applyMatrix4(e.matrixWorldInverse);this._clipScratch[u].set(-l.normal.x,-l.normal.y,-l.normal.z,l.constant)}return n}_occlusion=e=>{const i=this._computeClipPlanes(e.camera);for(const n of this._clouds.values())for(const u of n.wrappers.values()){const l=u.material.uniforms;l.uScreenHeight.value=e.height;for(let s=0;s<i;s++)l.uCutPlanes.value[s].copy(this._clipScratch[s]);l.uNumClip.value=i}if(this._directSeam()){e.renderer.render(this._scene,e.camera);return}const t=this._ensureEdl(e.width,e.height,e.depth),r=e.renderer.getContext();e.renderer.setRenderTarget(t),r.clearBufferfv(r.COLOR,0,[0,0,0,0]),e.renderer.render(this._scene,e.camera);const a=this._edlMat;a.uniforms.uColor.value=t.texture,a.uniforms.uDrawnPixels.value.set(e.width,e.height),a.uniforms.uStrength.value=this.settings.edlStrength,a.uniforms.uRadius.value=this.settings.edlRadius,e.renderer.setRenderTarget(e.target),e.renderer.render(this._edlScene,this._edlCam)};_ensureEdl(e,i,t){return this._edlMat||(this._edlMat=new j({blending:U,depthTest:!1,depthWrite:!1,transparent:!0,uniforms:{uColor:{value:null},uDrawnPixels:{value:new ze(1,1)},uStrength:{value:this.settings.edlStrength},uRadius:{value:this.settings.edlRadius}},vertexShader:`
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
          precision highp float;
          uniform sampler2D uColor; uniform vec2 uDrawnPixels;
          uniform float uStrength, uRadius;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(uColor, vUv);
            if (c.a <= 0.0) { gl_FragColor = vec4(0.0); return; } // no point -> transparent
            float lz = log2(c.a);
            vec2 px = uRadius / uDrawnPixels;
            float resp = 0.0; float n = 0.0;
            for (int i = 0; i < 4; i++) {
              vec2 o = i == 0 ? vec2(1.,0.) : i == 1 ? vec2(-1.,0.) : i == 2 ? vec2(0.,1.) : vec2(0.,-1.);
              float za = texture2D(uColor, vUv + o * px).a;
              if (za <= 0.0) continue;
              resp += max(0.0, lz - log2(za)); n += 1.0;
            }
            resp = n > 0.0 ? resp / n : 0.0;
            float shade = exp(-resp * uStrength * 300.0);
            gl_FragColor = vec4(c.rgb * shade, 1.0);        // OPAQUE where points exist
          }`}),this._edlScene=new J,this._edlCam=new Oe(-1,1,1,-1,0,1),this._edlScene.add(new ie(new ke(2,2),this._edlMat))),this._edlRT&&this._edlRT.width===e&&this._edlRT.height===i?(this._edlRT.depthTexture=t,this._edlRT):(this._edlRT&&(this._edlRT.depthTexture=null,this._edlRT.dispose()),this._edlRT=new De(e,i,{type:Ne,format:te,minFilter:L,magFilter:L,depthBuffer:!0}),this._edlRT.depthTexture=t,this._edlRT)}_fit(e){const i=this._world;if(!i)return;const t=i.camera.three,r=e.getCenter(new P),a=e.getSize(new P),n=Math.max(a.x,a.y,a.z)||10;t.isPerspectiveCamera&&(t.near=n/1e3,t.far=n*100,t.updateProjectionMatrix());const u=i.camera.controls;u?.fitToBox?u.fitToBox(e,!0):u?.setLookAt&&u.setLookAt(r.x+n*.7,r.y+n*.7,r.z+n*.7,r.x,r.y,r.z,!0)}}function rt(o){return{getUrl(e){return o+e},fetch(e,i){return fetch(e,{...i||{},cache:"no-store"})}}}const C=new Be,ot=C.get(We),p=ot.create();p.scene=new Ve(C);p.scene.setup();p.scene.three.background=null;const G=document.getElementById("container");p.renderer=new He(C,G);p.camera=new Fe(C);C.init();const st=C.get(Ue),pe=st.create(p);pe.config.color.set(6710886);p.renderer.postproduction.enabled=!0;p.renderer.postproduction.mode=je.DEFERRED;p.renderer.postproduction.style=Ge.COLOR_PEN_SHADOWS;p.renderer.postproduction.basePass.isolatedMaterials.push(pe.material);p.dynamicAnchor=!1;const at=await ae.getWorker(),O=C.get(ae);O.init(at);p.camera.controls.addEventListener("update",()=>O.core.update());p.onCameraChanged.add(o=>{for(const[,e]of O.list)e.useCamera(o.three);O.core.update(!0)});O.list.onItemSet.add(({value:o})=>{o.useCamera(p.camera.three),p.scene.three.add(o.object),O.core.update(!0)});const lt=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");await O.core.load(await lt.arrayBuffer(),{modelId:"school_arq"});const V=C.get(W);V.world=p;const ct=o=>({getUrl:e=>`local/${e}`,async fetch(e,i){const r=(typeof e=="string"?e:e.toString()).split(/[\\/]/).pop().split("?")[0],a=o.get(r);if(!a)return new Response(null,{status:404});const u=new Headers(i?.headers).get("Range")?.match(/bytes=(\d+)-(\d*)/);if(!u)return new Response(a);const l=Number(u[1]),s=u[2]?Number(u[2])+1:a.size;return new Response(a.slice(l,s),{status:206})}}),F=C.get(Ie);F.enabled=!0;let M=null;const he=async o=>{const e=new Map;for(const n of Array.from(o))e.set(n.name,n);const t=["metadata.json","hierarchy.bin","octree.bin"].filter(n=>!e.has(n));if(t.length){alert(`Missing Potree 2.0 files: ${t.join(", ")}`);return}const r=await V.load({url:"local",requestManager:ct(e)},{id:`local-${V.list.size}`,fitCamera:!0}),a=r.box.getSize(new P).length()||100;p.camera.three.near=Math.max(a/5e3,.01),p.camera.three.far=a*200,p.camera.three.updateProjectionMatrix(),M&&await F.delete(p,M),M=F.createFromNormalAndCoplanarPoint(p,new P(0,1,0),r.box.getCenter(new P))},ut=()=>{const o=document.createElement("input");o.type="file",o.multiple=!0,o.accept=".json,.bin",o.addEventListener("change",()=>{o.files&&he(o.files)}),o.click()};G.addEventListener("dragover",o=>o.preventDefault());G.addEventListener("drop",o=>{o.preventDefault(),o.dataTransfer?.files&&he(o.dataTransfer.files)});const D=new Me;D.showPanel(2);document.body.append(D.dom);D.dom.style.left="0px";D.dom.style.zIndex="unset";p.renderer.onBeforeUpdate.add(()=>D.begin());p.renderer.onAfterUpdate.add(()=>D.end());Te.init();const y=V.settings,dt=Re.create(()=>Ee`
  <bim-panel active label="Point Cloud Loader" class="options-menu">

    <bim-panel-section label="Your point cloud">
      <bim-label style="white-space: normal">
        Pick or drop metadata.json, hierarchy.bin and octree.bin (Potree 2.0).
      </bim-label>
      <bim-button label="Load Potree 2.0 files" @click=${ut}></bim-button>
    </bim-panel-section>

    <bim-panel-section label="Quality">

      <bim-number-input
        slider step="0.05" label="Overlap (overdraw / coverage)"
        value="${y.overlap}" min="1" max="1.7"
        @change="${({target:o})=>{y.overlap=o.value}}">
      </bim-number-input>

      <bim-number-input
        slider step="10" label="Detail (min node px)"
        value="${y.minNodePixelSize}" min="80" max="400"
        @change="${({target:o})=>{y.minNodePixelSize=o.value}}">
      </bim-number-input>

      <bim-number-input
        slider step="100000" label="Point budget"
        value="${y.pointBudget}" min="250000" max="3000000"
        @change="${({target:o})=>{y.pointBudget=o.value}}">
      </bim-number-input>

      <bim-number-input
        slider step="2" label="Max point size (px)"
        value="${y.maxSize}" min="2" max="50"
        @change="${({target:o})=>{y.maxSize=o.value}}">
      </bim-number-input>

      <bim-checkbox label="EDL (eye-dome lighting)"
        ?checked=${y.edl}
        @change="${({target:o})=>{y.edl=o.value}}">
      </bim-checkbox>

      <bim-checkbox checked label="Section the cloud"
        @change="${({target:o})=>{const e=M?F.list.get(M):void 0;e&&(e.enabled=o.value)}}">
      </bim-checkbox>

    </bim-panel-section>

  </bim-panel>
  `);document.body.append(dt);
