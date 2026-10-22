const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./three.tsl-DSP6Wist.js","./three.webgpu-Bi3xGA5a.js","./TransformControls-uP1Cexzu.js"])))=>i.map(i=>d[i]);
import{aJ as Qs,aK as it,aL as as,aM as Ys,aN as Re,aO as cs,aP as K,w as se,C as ae,aQ as $,am as Ee,aR as Js,aS as Zs,f as en,E as Q,aw as tn,V as I,I as ls,aE as ft,av as us,aT as sn,aU as nn,o as et,aV as on,aW as hs,aX as rn,aY as an,aZ as cn,a_ as at,N as X,a$ as ct,b0 as ln,b1 as un,b2 as hn,z as tt,L as dn,b3 as ds,s as ke,r as Me,b4 as fn,B as pn,b5 as mn,M as pt,p as gn,u as _n,a6 as xn,a7 as yn,G as Ce,g as bn,x as wn,O as vn,b6 as Tn,b7 as Sn,b8 as An,b9 as Mn,ba as fs,bb as Rn,bc as Kt,bd as Wt,be as Xt,bf as $t,bg as Qt,a5 as Cn,bh as En,t as ze,J as Ln,Y as Oe,bi as ps,bj as ms,bk as gs,bl as _s,aF as ie,bm as kn,bn as Be,bo as Le,bp as xs,bq as ys,Z as bs,aD as In,$ as Fn,br as lt,bs as ut,ax as ws,af as vs,bt as Pn,aB as Ts,ac as Ue,aG as De,ab as Ss,a as Yt,i as Nn,e as Un,X as Dn,S as On,K as Bn,n as zn,b as Hn}from"./TransformControls-uP1Cexzu.js";import{a as Gn,E as Jt,f as Zt,c as qn,W as jn,S as Vn,O as Kn,G as Wn,F as As}from"./graphic-vertex-picker-BijCnCEg.js";import{P as Xn,a as $n,b as Qn}from"./index-B9_sa_qD.js";import{_ as Yn}from"./preload-helper-PPVm8Dsz.js";import"./index-bKcSih7U.js";import"./renderer-with-2d-CrQsY-US.js";function es(c,e){if(e===Qs)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),c;if(e===it||e===as){let t=c.getIndex();if(t===null){const r=[],a=c.getAttribute("position");if(a!==void 0){for(let i=0;i<a.count;i++)r.push(i);c.setIndex(r),t=c.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),c}const s=t.count-2,n=[];if(e===it)for(let r=1;r<=s;r++)n.push(t.getX(0)),n.push(t.getX(r)),n.push(t.getX(r+1));else for(let r=0;r<s;r++)r%2===0?(n.push(t.getX(r)),n.push(t.getX(r+1)),n.push(t.getX(r+2))):(n.push(t.getX(r+2)),n.push(t.getX(r+1)),n.push(t.getX(r)));n.length/3!==s&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const o=c.clone();return o.setIndex(n),o.clearGroups(),o}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),c}function Jn(c){const e=new Map,t=new Map,s=c.clone();return Ms(c,s,function(n,o){e.set(o,n),t.set(n,o)}),s.traverse(function(n){if(!n.isSkinnedMesh)return;const o=n,r=e.get(n),a=r.skeleton.bones;o.skeleton=r.skeleton.clone(),o.bindMatrix.copy(r.bindMatrix),o.skeleton.bones=a.map(function(i){return t.get(i)}),o.bind(o.skeleton,o.bindMatrix)}),s}function Ms(c,e,t){t(c,e);for(let s=0;s<c.children.length;s++)Ms(c.children[s],e.children[s],t)}class Zn extends Ys{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new oo(t)}),this.register(function(t){return new ro(t)}),this.register(function(t){return new mo(t)}),this.register(function(t){return new go(t)}),this.register(function(t){return new _o(t)}),this.register(function(t){return new ao(t)}),this.register(function(t){return new co(t)}),this.register(function(t){return new lo(t)}),this.register(function(t){return new uo(t)}),this.register(function(t){return new no(t)}),this.register(function(t){return new ho(t)}),this.register(function(t){return new io(t)}),this.register(function(t){return new po(t)}),this.register(function(t){return new fo(t)}),this.register(function(t){return new to(t)}),this.register(function(t){return new ts(t,A.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ts(t,A.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new xo(t)})}load(e,t,s,n){const o=this;let r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){const l=Re.extractUrlBase(e);r=Re.resolveURL(l,this.path)}else r=Re.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){n?n(l):console.error(l),o.manager.itemError(e),o.manager.itemEnd(e)},i=new cs(this.manager);i.setPath(this.path),i.setResponseType("arraybuffer"),i.setRequestHeader(this.requestHeader),i.setWithCredentials(this.withCredentials),i.load(e,function(l){try{o.parse(l,r,function(u){t(u),o.manager.itemEnd(e)},a)}catch(u){a(u)}},s,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,s,n){let o;const r={},a={},i=new TextDecoder;if(typeof e=="string")o=JSON.parse(e);else if(e instanceof ArrayBuffer)if(i.decode(new Uint8Array(e,0,4))===Rs){try{r[A.KHR_BINARY_GLTF]=new yo(e)}catch(h){n&&n(h);return}o=JSON.parse(r[A.KHR_BINARY_GLTF].content)}else o=JSON.parse(i.decode(e));else o=e;if(o.asset===void 0||o.asset.version[0]<2){n&&n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Io(o,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,r[h.name]=!0}if(o.extensionsUsed)for(let u=0;u<o.extensionsUsed.length;++u){const h=o.extensionsUsed[u],d=o.extensionsRequired||[];switch(h){case A.KHR_MATERIALS_UNLIT:r[h]=new so;break;case A.KHR_DRACO_MESH_COMPRESSION:r[h]=new bo(o,this.dracoLoader);break;case A.KHR_TEXTURE_TRANSFORM:r[h]=new wo;break;case A.KHR_MESH_QUANTIZATION:r[h]=new vo;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(r),l.setPlugins(a),l.parse(s,n)}parseAsync(e,t){const s=this;return new Promise(function(n,o){s.parse(e,t,n,o)})}}function eo(){let c={};return{get:function(e){return c[e]},add:function(e,t){c[e]=t},remove:function(e){delete c[e]},removeAll:function(){c={}}}}function F(c,e,t){const s=c.json.materials[e];return s.extensions&&s.extensions[t]?s.extensions[t]:null}const A={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class to{constructor(e){this.parser=e,this.name=A.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let s=0,n=t.length;s<n;s++){const o=t[s];o.extensions&&o.extensions[this.name]&&o.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,o.extensions[this.name].light)}}_loadLight(e){const t=this.parser,s="light:"+e;let n=t.cache.get(s);if(n)return n;const o=t.json,i=((o.extensions&&o.extensions[this.name]||{}).lights||[])[e];let l;const u=new ae(16777215);i.color!==void 0&&u.setRGB(i.color[0],i.color[1],i.color[2],$);const h=i.range!==void 0?i.range:0;switch(i.type){case"directional":l=new en(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Zs(u),l.distance=h;break;case"spot":l=new Js(u),l.distance=h,i.spot=i.spot||{},i.spot.innerConeAngle=i.spot.innerConeAngle!==void 0?i.spot.innerConeAngle:0,i.spot.outerConeAngle=i.spot.outerConeAngle!==void 0?i.spot.outerConeAngle:Math.PI/4,l.angle=i.spot.outerConeAngle,l.penumbra=1-i.spot.innerConeAngle/i.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+i.type)}return l.position.set(0,0,0),V(l,i),i.intensity!==void 0&&(l.intensity=i.intensity),l.name=t.createUniqueName(i.name||"light_"+e),n=Promise.resolve(l),t.cache.add(s,n),n}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,s=this.parser,o=s.json.nodes[e],a=(o.extensions&&o.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(i){return s._getNodeRef(t.cache,a,i)})}}class so{constructor(){this.name=A.KHR_MATERIALS_UNLIT}getMaterialType(){return Me}extendParams(e,t,s){const n=[];e.color=new ae(1,1,1),e.opacity=1;const o=t.pbrMetallicRoughness;if(o){if(Array.isArray(o.baseColorFactor)){const r=o.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],$),e.opacity=r[3]}o.baseColorTexture!==void 0&&n.push(s.assignTexture(e,"map",o.baseColorTexture,Ee))}return Promise.all(n)}}class no{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);return s===null||s.emissiveStrength!==void 0&&(t.emissiveIntensity=s.emissiveStrength),Promise.resolve()}}class oo{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];if(s.clearcoatFactor!==void 0&&(t.clearcoat=s.clearcoatFactor),s.clearcoatTexture!==void 0&&n.push(this.parser.assignTexture(t,"clearcoatMap",s.clearcoatTexture)),s.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=s.clearcoatRoughnessFactor),s.clearcoatRoughnessTexture!==void 0&&n.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",s.clearcoatRoughnessTexture)),s.clearcoatNormalTexture!==void 0&&(n.push(this.parser.assignTexture(t,"clearcoatNormalMap",s.clearcoatNormalTexture)),s.clearcoatNormalTexture.scale!==void 0)){const o=s.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new se(o,o)}return Promise.all(n)}}class ro{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_DISPERSION}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);return s===null||(t.dispersion=s.dispersion!==void 0?s.dispersion:0),Promise.resolve()}}class io{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];return s.iridescenceFactor!==void 0&&(t.iridescence=s.iridescenceFactor),s.iridescenceTexture!==void 0&&n.push(this.parser.assignTexture(t,"iridescenceMap",s.iridescenceTexture)),s.iridescenceIor!==void 0&&(t.iridescenceIOR=s.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),s.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=s.iridescenceThicknessMinimum),s.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=s.iridescenceThicknessMaximum),s.iridescenceThicknessTexture!==void 0&&n.push(this.parser.assignTexture(t,"iridescenceThicknessMap",s.iridescenceThicknessTexture)),Promise.all(n)}}class ao{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_SHEEN}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];if(t.sheenColor=new ae(0,0,0),t.sheenRoughness=0,t.sheen=1,s.sheenColorFactor!==void 0){const o=s.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],$)}return s.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=s.sheenRoughnessFactor),s.sheenColorTexture!==void 0&&n.push(this.parser.assignTexture(t,"sheenColorMap",s.sheenColorTexture,Ee)),s.sheenRoughnessTexture!==void 0&&n.push(this.parser.assignTexture(t,"sheenRoughnessMap",s.sheenRoughnessTexture)),Promise.all(n)}}class co{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];return s.transmissionFactor!==void 0&&(t.transmission=s.transmissionFactor),s.transmissionTexture!==void 0&&n.push(this.parser.assignTexture(t,"transmissionMap",s.transmissionTexture)),Promise.all(n)}}class lo{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_VOLUME}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];t.thickness=s.thicknessFactor!==void 0?s.thicknessFactor:0,s.thicknessTexture!==void 0&&n.push(this.parser.assignTexture(t,"thicknessMap",s.thicknessTexture)),t.attenuationDistance=s.attenuationDistance||1/0;const o=s.attenuationColor||[1,1,1];return t.attenuationColor=new ae().setRGB(o[0],o[1],o[2],$),Promise.all(n)}}class uo{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_IOR}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);return s===null||(t.ior=s.ior!==void 0?s.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class ho{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_SPECULAR}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];t.specularIntensity=s.specularFactor!==void 0?s.specularFactor:1,s.specularTexture!==void 0&&n.push(this.parser.assignTexture(t,"specularIntensityMap",s.specularTexture));const o=s.specularColorFactor||[1,1,1];return t.specularColor=new ae().setRGB(o[0],o[1],o[2],$),s.specularColorTexture!==void 0&&n.push(this.parser.assignTexture(t,"specularColorMap",s.specularColorTexture,Ee)),Promise.all(n)}}class fo{constructor(e){this.parser=e,this.name=A.EXT_MATERIALS_BUMP}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];return t.bumpScale=s.bumpFactor!==void 0?s.bumpFactor:1,s.bumpTexture!==void 0&&n.push(this.parser.assignTexture(t,"bumpMap",s.bumpTexture)),Promise.all(n)}}class po{constructor(e){this.parser=e,this.name=A.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return F(this.parser,e,this.name)!==null?K:null}extendMaterialParams(e,t){const s=F(this.parser,e,this.name);if(s===null)return Promise.resolve();const n=[];return s.anisotropyStrength!==void 0&&(t.anisotropy=s.anisotropyStrength),s.anisotropyRotation!==void 0&&(t.anisotropyRotation=s.anisotropyRotation),s.anisotropyTexture!==void 0&&n.push(this.parser.assignTexture(t,"anisotropyMap",s.anisotropyTexture)),Promise.all(n)}}class mo{constructor(e){this.parser=e,this.name=A.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,s=t.json,n=s.textures[e];if(!n.extensions||!n.extensions[this.name])return null;const o=n.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(s.extensionsRequired&&s.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,o.source,r)}}class go{constructor(e){this.parser=e,this.name=A.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,s=this.parser,n=s.json,o=n.textures[e];if(!o.extensions||!o.extensions[t])return null;const r=o.extensions[t],a=n.images[r.source];let i=s.textureLoader;if(a.uri){const l=s.options.manager.getHandler(a.uri);l!==null&&(i=l)}return s.loadTextureImage(e,r.source,i)}}class _o{constructor(e){this.parser=e,this.name=A.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,s=this.parser,n=s.json,o=n.textures[e];if(!o.extensions||!o.extensions[t])return null;const r=o.extensions[t],a=n.images[r.source];let i=s.textureLoader;if(a.uri){const l=s.options.manager.getHandler(a.uri);l!==null&&(i=l)}return s.loadTextureImage(e,r.source,i)}}class ts{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,s=t.bufferViews[e];if(s.extensions&&s.extensions[this.name]){const n=s.extensions[this.name],o=this.parser.getDependency("buffer",n.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return o.then(function(a){const i=n.byteOffset||0,l=n.byteLength||0,u=n.count,h=n.byteStride,d=new Uint8Array(a,i,l);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(u,h,d,n.mode,n.filter).then(function(f){return f.buffer}):r.ready.then(function(){const f=new ArrayBuffer(u*h);return r.decodeGltfBuffer(new Uint8Array(f),u,h,d,n.mode,n.filter),f})})}else return null}}class xo{constructor(e){this.name=A.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,s=t.nodes[e];if(!s.extensions||!s.extensions[this.name]||s.mesh===void 0)return null;const n=t.meshes[s.mesh];for(const l of n.primitives)if(l.mode!==G.TRIANGLES&&l.mode!==G.TRIANGLE_STRIP&&l.mode!==G.TRIANGLE_FAN&&l.mode!==void 0)return null;const r=s.extensions[this.name].attributes,a=[],i={};for(const l in r)a.push(this.parser.getDependency("accessor",r[l]).then(u=>(i[l]=u,i[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const u=l.pop(),h=u.isGroup?u.children:[u],d=l[0].count,f=[];for(const p of h){const x=new Q,g=new I,_=new ls,b=new I(1,1,1),m=new tn(p.geometry,p.material,d);for(let v=0;v<d;v++)i.TRANSLATION&&g.fromBufferAttribute(i.TRANSLATION,v),i.ROTATION&&_.fromBufferAttribute(i.ROTATION,v),i.SCALE&&b.fromBufferAttribute(i.SCALE,v),m.setMatrixAt(v,x.compose(g,_,b));for(const v in i)if(v==="_COLOR_0"){const E=i[v];m.instanceColor=new ft(E.array,E.itemSize,E.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&p.geometry.setAttribute(v,i[v]);us.prototype.copy.call(m,p),this.parser.assignFinalMaterial(m),f.push(m)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const Rs="glTF",Ae=12,ss={JSON:1313821514,BIN:5130562};class yo{constructor(e){this.name=A.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ae),s=new TextDecoder;if(this.header={magic:s.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Rs)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const n=this.header.length-Ae,o=new DataView(e,Ae);let r=0;for(;r<n;){const a=o.getUint32(r,!0);r+=4;const i=o.getUint32(r,!0);if(r+=4,i===ss.JSON){const l=new Uint8Array(e,Ae+r,a);this.content=s.decode(l)}else if(i===ss.BIN){const l=Ae+r;this.body=e.slice(l,l+a)}r+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class bo{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=A.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const s=this.json,n=this.dracoLoader,o=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},i={},l={};for(const u in r){const h=ht[u]||u.toLowerCase();a[h]=r[u]}for(const u in e.attributes){const h=ht[u]||u.toLowerCase();if(r[u]!==void 0){const d=s.accessors[e.attributes[u]],f=fe[d.componentType];l[h]=f.name,i[h]=d.normalized===!0}}return t.getDependency("bufferView",o).then(function(u){return new Promise(function(h,d){n.decodeDracoFile(u,function(f){for(const p in f.attributes){const x=f.attributes[p],g=i[p];g!==void 0&&(x.normalized=g)}h(f)},a,l,$,d)})})}}class wo{constructor(){this.name=A.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class vo{constructor(){this.name=A.KHR_MESH_QUANTIZATION}}class Cs extends En{constructor(e,t,s,n){super(e,t,s,n)}copySampleValue_(e){const t=this.resultBuffer,s=this.sampleValues,n=this.valueSize,o=e*n*3+n;for(let r=0;r!==n;r++)t[r]=s[o+r];return t}interpolate_(e,t,s,n){const o=this.resultBuffer,r=this.sampleValues,a=this.valueSize,i=a*2,l=a*3,u=n-t,h=(s-t)/u,d=h*h,f=d*h,p=e*l,x=p-l,g=-2*f+3*d,_=f-d,b=1-g,m=_-d+h;for(let v=0;v!==a;v++){const E=r[x+v+a],L=r[x+v+i]*u,w=r[p+v+a],y=r[p+v]*u;o[v]=b*E+m*L+g*w+_*y}return o}}const To=new ls;class So extends Cs{interpolate_(e,t,s,n){const o=super.interpolate_(e,t,s,n);return To.fromArray(o).normalize().toArray(o),o}}const G={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},fe={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ns={9728:X,9729:at,9984:cn,9985:an,9986:rn,9987:hs},os={33071:un,33648:ln,10497:ct},st={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ht={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},J={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Ao={CUBICSPLINE:void 0,LINEAR:fs,STEP:Mn},nt={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Mo(c){return c.DefaultMaterial===void 0&&(c.DefaultMaterial=new ds({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Cn})),c.DefaultMaterial}function oe(c,e,t){for(const s in t.extensions)c[s]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[s]=t.extensions[s])}function V(c,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(c.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ro(c,e,t){let s=!1,n=!1,o=!1;for(let l=0,u=e.length;l<u;l++){const h=e[l];if(h.POSITION!==void 0&&(s=!0),h.NORMAL!==void 0&&(n=!0),h.COLOR_0!==void 0&&(o=!0),s&&n&&o)break}if(!s&&!n&&!o)return Promise.resolve(c);const r=[],a=[],i=[];for(let l=0,u=e.length;l<u;l++){const h=e[l];if(s){const d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):c.attributes.position;r.push(d)}if(n){const d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):c.attributes.normal;a.push(d)}if(o){const d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):c.attributes.color;i.push(d)}}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(i)]).then(function(l){const u=l[0],h=l[1],d=l[2];return s&&(c.morphAttributes.position=u),n&&(c.morphAttributes.normal=h),o&&(c.morphAttributes.color=d),c.morphTargetsRelative=!0,c})}function Co(c,e){if(c.updateMorphTargets(),e.weights!==void 0)for(let t=0,s=e.weights.length;t<s;t++)c.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(c.morphTargetInfluences.length===t.length){c.morphTargetDictionary={};for(let s=0,n=t.length;s<n;s++)c.morphTargetDictionary[t[s]]=s}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Eo(c){let e;const t=c.extensions&&c.extensions[A.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+ot(t.attributes):e=c.indices+":"+ot(c.attributes)+":"+c.mode,c.targets!==void 0)for(let s=0,n=c.targets.length;s<n;s++)e+=":"+ot(c.targets[s]);return e}function ot(c){let e="";const t=Object.keys(c).sort();for(let s=0,n=t.length;s<n;s++)e+=t[s]+":"+c[t[s]]+";";return e}function dt(c){switch(c){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Lo(c){return c.search(/\.jpe?g($|\?)/i)>0||c.search(/^data\:image\/jpeg/)===0?"image/jpeg":c.search(/\.webp($|\?)/i)>0||c.search(/^data\:image\/webp/)===0?"image/webp":c.search(/\.ktx2($|\?)/i)>0||c.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const ko=new Q;class Io{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new eo,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let s=!1,n=-1,o=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const a=navigator.userAgent;s=/^((?!chrome|android).)*safari/i.test(a)===!0;const i=a.match(/Version\/(\d+)/);n=s&&i?parseInt(i[1],10):-1,o=a.indexOf("Firefox")>-1,r=o?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||s&&n<17||o&&r<98?this.textureLoader=new sn(this.options.manager):this.textureLoader=new nn(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new cs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const s=this,n=this.json,o=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([s.getDependencies("scene"),s.getDependencies("animation"),s.getDependencies("camera")])}).then(function(r){const a={scene:r[0][n.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:n.asset,parser:s,userData:{}};return oe(o,a,n),V(a,n),Promise.all(s._invokeAll(function(i){return i.afterRoot&&i.afterRoot(a)})).then(function(){for(const i of a.scenes)i.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],s=this.json.meshes||[];for(let n=0,o=t.length;n<o;n++){const r=t[n].joints;for(let a=0,i=r.length;a<i;a++)e[r[a]].isBone=!0}for(let n=0,o=e.length;n<o;n++){const r=e[n];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(s[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,s){if(e.refs[t]<=1)return s;const n=s.clone(),o=(r,a)=>{const i=this.associations.get(r);i!=null&&this.associations.set(a,i);for(const[l,u]of r.children.entries())o(u,a.children[l])};return o(s,n),n.name+="_instance_"+e.uses[t]++,n}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let s=0;s<t.length;s++){const n=e(t[s]);if(n)return n}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const s=[];for(let n=0;n<t.length;n++){const o=e(t[n]);o&&s.push(o)}return s}getDependency(e,t){const s=e+":"+t;let n=this.cache.get(s);if(!n){switch(e){case"scene":n=this.loadScene(t);break;case"node":n=this._invokeOne(function(o){return o.loadNode&&o.loadNode(t)});break;case"mesh":n=this._invokeOne(function(o){return o.loadMesh&&o.loadMesh(t)});break;case"accessor":n=this.loadAccessor(t);break;case"bufferView":n=this._invokeOne(function(o){return o.loadBufferView&&o.loadBufferView(t)});break;case"buffer":n=this.loadBuffer(t);break;case"material":n=this._invokeOne(function(o){return o.loadMaterial&&o.loadMaterial(t)});break;case"texture":n=this._invokeOne(function(o){return o.loadTexture&&o.loadTexture(t)});break;case"skin":n=this.loadSkin(t);break;case"animation":n=this._invokeOne(function(o){return o.loadAnimation&&o.loadAnimation(t)});break;case"camera":n=this.loadCamera(t);break;default:if(n=this._invokeOne(function(o){return o!=this&&o.getDependency&&o.getDependency(e,t)}),!n)throw new Error("Unknown type: "+e);break}this.cache.add(s,n)}return n}getDependencies(e){let t=this.cache.get(e);if(!t){const s=this,n=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(n.map(function(o,r){return s.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],s=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[A.KHR_BINARY_GLTF].body);const n=this.options;return new Promise(function(o,r){s.load(Re.resolveURL(t.uri,n.path),o,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(s){const n=t.byteLength||0,o=t.byteOffset||0;return s.slice(o,o+n)})}loadAccessor(e){const t=this,s=this.json,n=this.json.accessors[e];if(n.bufferView===void 0&&n.sparse===void 0){const r=st[n.type],a=fe[n.componentType],i=n.normalized===!0,l=new a(n.count*r);return Promise.resolve(new et(l,r,i))}const o=[];return n.bufferView!==void 0?o.push(this.getDependency("bufferView",n.bufferView)):o.push(null),n.sparse!==void 0&&(o.push(this.getDependency("bufferView",n.sparse.indices.bufferView)),o.push(this.getDependency("bufferView",n.sparse.values.bufferView))),Promise.all(o).then(function(r){const a=r[0],i=st[n.type],l=fe[n.componentType],u=l.BYTES_PER_ELEMENT,h=u*i,d=n.byteOffset||0,f=n.bufferView!==void 0?s.bufferViews[n.bufferView].byteStride:void 0,p=n.normalized===!0;let x,g;if(f&&f!==h){const _=Math.floor(d/f),b="InterleavedBuffer:"+n.bufferView+":"+n.componentType+":"+_+":"+n.count;let m=t.cache.get(b);m||(x=new l(a,_*f,n.count*f/u),m=new on(x,f/u),t.cache.add(b,m)),g=new Rn(m,i,d%f/u,p)}else a===null?x=new l(n.count*i):x=new l(a,d,n.count*i),g=new et(x,i,p);if(n.sparse!==void 0){const _=st.SCALAR,b=fe[n.sparse.indices.componentType],m=n.sparse.indices.byteOffset||0,v=n.sparse.values.byteOffset||0,E=new b(r[1],m,n.sparse.count*_),L=new l(r[2],v,n.sparse.count*i);a!==null&&(g=new et(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let w=0,y=E.length;w<y;w++){const T=E[w];if(g.setX(T,L[w*i]),i>=2&&g.setY(T,L[w*i+1]),i>=3&&g.setZ(T,L[w*i+2]),i>=4&&g.setW(T,L[w*i+3]),i>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){const t=this.json,s=this.options,o=t.textures[e].source,r=t.images[o];let a=this.textureLoader;if(r.uri){const i=s.manager.getHandler(r.uri);i!==null&&(a=i)}return this.loadTextureImage(e,o,a)}loadTextureImage(e,t,s){const n=this,o=this.json,r=o.textures[e],a=o.images[t],i=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[i])return this.textureCache[i];const l=this.loadImageSource(t,s).then(function(u){u.flipY=!1,u.name=r.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const d=(o.samplers||{})[r.sampler]||{};return u.magFilter=ns[d.magFilter]||at,u.minFilter=ns[d.minFilter]||hs,u.wrapS=os[d.wrapS]||ct,u.wrapT=os[d.wrapT]||ct,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==X&&u.minFilter!==at,n.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[i]=l,l}loadImageSource(e,t){const s=this,n=this.json,o=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const r=n.images[e],a=self.URL||self.webkitURL;let i=r.uri||"",l=!1;if(r.bufferView!==void 0)i=s.getDependency("bufferView",r.bufferView).then(function(h){l=!0;const d=new Blob([h],{type:r.mimeType});return i=a.createObjectURL(d),i});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(i).then(function(h){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(x){const g=new Kt(x);g.needsUpdate=!0,d(g)}),t.load(Re.resolveURL(h,o.path),p,void 0,f)})}).then(function(h){return l===!0&&a.revokeObjectURL(i),V(h,r),h.userData.mimeType=r.mimeType||Lo(r.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",i),h});return this.sourceCache[e]=u,u}assignTexture(e,t,s,n){const o=this;return this.getDependency("texture",s.index).then(function(r){if(!r)return null;if(s.texCoord!==void 0&&s.texCoord>0&&(r=r.clone(),r.channel=s.texCoord),o.extensions[A.KHR_TEXTURE_TRANSFORM]){const a=s.extensions!==void 0?s.extensions[A.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const i=o.associations.get(r);r=o.extensions[A.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),o.associations.set(r,i)}}return n!==void 0&&(r.colorSpace=n),e[t]=r,r})}assignFinalMaterial(e){const t=e.geometry;let s=e.material;const n=t.attributes.tangent===void 0,o=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+s.uuid;let i=this.cache.get(a);i||(i=new hn,tt.prototype.copy.call(i,s),i.color.copy(s.color),i.map=s.map,i.sizeAttenuation=!1,this.cache.add(a,i)),s=i}else if(e.isLine){const a="LineBasicMaterial:"+s.uuid;let i=this.cache.get(a);i||(i=new dn,tt.prototype.copy.call(i,s),i.color.copy(s.color),i.map=s.map,this.cache.add(a,i)),s=i}if(n||o||r){let a="ClonedMaterial:"+s.uuid+":";n&&(a+="derivative-tangents:"),o&&(a+="vertex-colors:"),r&&(a+="flat-shading:");let i=this.cache.get(a);i||(i=s.clone(),o&&(i.vertexColors=!0),r&&(i.flatShading=!0),n&&(i.normalScale&&(i.normalScale.y*=-1),i.clearcoatNormalScale&&(i.clearcoatNormalScale.y*=-1)),this.cache.add(a,i),this.associations.set(i,this.associations.get(s))),s=i}e.material=s}getMaterialType(){return ds}loadMaterial(e){const t=this,s=this.json,n=this.extensions,o=s.materials[e];let r;const a={},i=o.extensions||{},l=[];if(i[A.KHR_MATERIALS_UNLIT]){const h=n[A.KHR_MATERIALS_UNLIT];r=h.getMaterialType(),l.push(h.extendParams(a,o,t))}else{const h=o.pbrMetallicRoughness||{};if(a.color=new ae(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){const d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],$),a.opacity=d[3]}h.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",h.baseColorTexture,Ee)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}o.doubleSided===!0&&(a.side=ke);const u=o.alphaMode||nt.OPAQUE;if(u===nt.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===nt.MASK&&(a.alphaTest=o.alphaCutoff!==void 0?o.alphaCutoff:.5)),o.normalTexture!==void 0&&r!==Me&&(l.push(t.assignTexture(a,"normalMap",o.normalTexture)),a.normalScale=new se(1,1),o.normalTexture.scale!==void 0)){const h=o.normalTexture.scale;a.normalScale.set(h,h)}if(o.occlusionTexture!==void 0&&r!==Me&&(l.push(t.assignTexture(a,"aoMap",o.occlusionTexture)),o.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=o.occlusionTexture.strength)),o.emissiveFactor!==void 0&&r!==Me){const h=o.emissiveFactor;a.emissive=new ae().setRGB(h[0],h[1],h[2],$)}return o.emissiveTexture!==void 0&&r!==Me&&l.push(t.assignTexture(a,"emissiveMap",o.emissiveTexture,Ee)),Promise.all(l).then(function(){const h=new r(a);return o.name&&(h.name=o.name),V(h,o),t.associations.set(h,{materials:e}),o.extensions&&oe(n,h,o),h})}createUniqueName(e){const t=fn.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,s=this.extensions,n=this.primitiveCache;function o(a){return s[A.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(i){return rs(i,a,t)})}const r=[];for(let a=0,i=e.length;a<i;a++){const l=e[a],u=Eo(l),h=n[u];if(h)r.push(h.promise);else{let d;l.extensions&&l.extensions[A.KHR_DRACO_MESH_COMPRESSION]?d=o(l):d=rs(new pn,l,t),n[u]={primitive:l,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){const t=this,s=this.json,n=this.extensions,o=s.meshes[e],r=o.primitives,a=[];for(let i=0,l=r.length;i<l;i++){const u=r[i].material===void 0?Mo(this.cache):this.getDependency("material",r[i].material);a.push(u)}return a.push(t.loadGeometries(r)),Promise.all(a).then(function(i){const l=i.slice(0,i.length-1),u=i[i.length-1],h=[];for(let f=0,p=u.length;f<p;f++){const x=u[f],g=r[f];let _;const b=l[f];if(g.mode===G.TRIANGLES||g.mode===G.TRIANGLE_STRIP||g.mode===G.TRIANGLE_FAN||g.mode===void 0)_=o.isSkinnedMesh===!0?new mn(x,b):new pt(x,b),_.isSkinnedMesh===!0&&_.normalizeSkinWeights(),g.mode===G.TRIANGLE_STRIP?_.geometry=es(_.geometry,as):g.mode===G.TRIANGLE_FAN&&(_.geometry=es(_.geometry,it));else if(g.mode===G.LINES)_=new gn(x,b);else if(g.mode===G.LINE_STRIP)_=new _n(x,b);else if(g.mode===G.LINE_LOOP)_=new xn(x,b);else if(g.mode===G.POINTS)_=new yn(x,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(_.geometry.morphAttributes).length>0&&Co(_,o),_.name=t.createUniqueName(o.name||"mesh_"+e),V(_,o),g.extensions&&oe(n,_,g),t.assignFinalMaterial(_),h.push(_)}for(let f=0,p=h.length;f<p;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return o.extensions&&oe(n,h[0],o),h[0];const d=new Ce;o.extensions&&oe(n,d,o),t.associations.set(d,{meshes:e});for(let f=0,p=h.length;f<p;f++)d.add(h[f]);return d})}loadCamera(e){let t;const s=this.json.cameras[e],n=s[s.type];if(!n){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return s.type==="perspective"?t=new bn(wn.radToDeg(n.yfov),n.aspectRatio||1,n.znear||1,n.zfar||2e6):s.type==="orthographic"&&(t=new vn(-n.xmag,n.xmag,n.ymag,-n.ymag,n.znear,n.zfar)),s.name&&(t.name=this.createUniqueName(s.name)),V(t,s),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],s=[];for(let n=0,o=t.joints.length;n<o;n++)s.push(this._loadNodeShallow(t.joints[n]));return t.inverseBindMatrices!==void 0?s.push(this.getDependency("accessor",t.inverseBindMatrices)):s.push(null),Promise.all(s).then(function(n){const o=n.pop(),r=n,a=[],i=[];for(let l=0,u=r.length;l<u;l++){const h=r[l];if(h){a.push(h);const d=new Q;o!==null&&d.fromArray(o.array,l*16),i.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Tn(a,i)})}loadAnimation(e){const t=this.json,s=this,n=t.animations[e],o=n.name?n.name:"animation_"+e,r=[],a=[],i=[],l=[],u=[];for(let h=0,d=n.channels.length;h<d;h++){const f=n.channels[h],p=n.samplers[f.sampler],x=f.target,g=x.node,_=n.parameters!==void 0?n.parameters[p.input]:p.input,b=n.parameters!==void 0?n.parameters[p.output]:p.output;x.node!==void 0&&(r.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",_)),i.push(this.getDependency("accessor",b)),l.push(p),u.push(x))}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(i),Promise.all(l),Promise.all(u)]).then(function(h){const d=h[0],f=h[1],p=h[2],x=h[3],g=h[4],_=[];for(let m=0,v=d.length;m<v;m++){const E=d[m],L=f[m],w=p[m],y=x[m],T=g[m];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const R=s._createAnimationTracks(E,L,w,y,T);if(R)for(let S=0;S<R.length;S++)_.push(R[S])}const b=new Sn(o,void 0,_);return V(b,n),b})}createNodeMesh(e){const t=this.json,s=this,n=t.nodes[e];return n.mesh===void 0?null:s.getDependency("mesh",n.mesh).then(function(o){const r=s._getNodeRef(s.meshCache,n.mesh,o);return n.weights!==void 0&&r.traverse(function(a){if(a.isMesh)for(let i=0,l=n.weights.length;i<l;i++)a.morphTargetInfluences[i]=n.weights[i]}),r})}loadNode(e){const t=this.json,s=this,n=t.nodes[e],o=s._loadNodeShallow(e),r=[],a=n.children||[];for(let l=0,u=a.length;l<u;l++)r.push(s.getDependency("node",a[l]));const i=n.skin===void 0?Promise.resolve(null):s.getDependency("skin",n.skin);return Promise.all([o,Promise.all(r),i]).then(function(l){const u=l[0],h=l[1],d=l[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,ko)});for(let f=0,p=h.length;f<p;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){const f=u.userData.pivot,p=h[0];u.pivot=new I().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],p.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){const t=this.json,s=this.extensions,n=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const o=t.nodes[e],r=o.name?n.createUniqueName(o.name):"",a=[],i=n._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return i&&a.push(i),o.camera!==void 0&&a.push(n.getDependency("camera",o.camera).then(function(l){return n._getNodeRef(n.cameraCache,o.camera,l)})),n._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(o.isBone===!0?u=new An:l.length>1?u=new Ce:l.length===1?u=l[0]:u=new us,u!==l[0])for(let h=0,d=l.length;h<d;h++)u.add(l[h]);if(o.name&&(u.userData.name=o.name,u.name=r),V(u,o),o.extensions&&oe(s,u,o),o.matrix!==void 0){const h=new Q;h.fromArray(o.matrix),u.applyMatrix4(h)}else o.translation!==void 0&&u.position.fromArray(o.translation),o.rotation!==void 0&&u.quaternion.fromArray(o.rotation),o.scale!==void 0&&u.scale.fromArray(o.scale);if(!n.associations.has(u))n.associations.set(u,{});else if(o.mesh!==void 0&&n.meshCache.refs[o.mesh]>1){const h=n.associations.get(u);n.associations.set(u,{...h})}return n.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,s=this.json.scenes[e],n=this,o=new Ce;s.name&&(o.name=n.createUniqueName(s.name)),V(o,s),s.extensions&&oe(t,o,s);const r=s.nodes||[],a=[];for(let i=0,l=r.length;i<l;i++)a.push(n.getDependency("node",r[i]));return Promise.all(a).then(function(i){for(let u=0,h=i.length;u<h;u++){const d=i[u];d.parent!==null?o.add(Jn(d)):o.add(d)}const l=u=>{const h=new Map;for(const[d,f]of n.associations)(d instanceof tt||d instanceof Kt)&&h.set(d,f);return u.traverse(d=>{const f=n.associations.get(d);f!=null&&h.set(d,f)}),h};return n.associations=l(o),o})}_createAnimationTracks(e,t,s,n,o){const r=[],a=e.name?e.name:e.uuid,i=[];function l(f){f.morphTargetInfluences&&i.push(f.name?f.name:f.uuid)}J[o.path]===J.weights?(l(e),e.isGroup&&e.children.forEach(l)):i.push(a);let u;switch(J[o.path]){case J.weights:u=Xt;break;case J.rotation:u=$t;break;case J.translation:case J.scale:u=Wt;break;default:s.itemSize===1?u=Xt:u=Wt;break}const h=n.interpolation!==void 0?Ao[n.interpolation]:fs,d=this._getArrayFromAccessor(s);for(let f=0,p=i.length;f<p;f++){const x=new u(i[f]+"."+J[o.path],t.array,d,h);n.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),r.push(x)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const s=dt(t.constructor),n=new Float32Array(t.length);for(let o=0,r=t.length;o<r;o++)n[o]=t[o]*s;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(s){const n=this instanceof $t?So:Cs;return new n(this.times,this.values,this.getValueSize()/3,s)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Fo(c,e,t){const s=e.attributes,n=new ze;if(s.POSITION!==void 0){const a=t.json.accessors[s.POSITION],i=a.min,l=a.max;if(i!==void 0&&l!==void 0){if(n.set(new I(i[0],i[1],i[2]),new I(l[0],l[1],l[2])),a.normalized){const u=dt(fe[a.componentType]);n.min.multiplyScalar(u),n.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const o=e.targets;if(o!==void 0){const a=new I,i=new I;for(let l=0,u=o.length;l<u;l++){const h=o[l];if(h.POSITION!==void 0){const d=t.json.accessors[h.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(i.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),i.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),i.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){const x=dt(fe[d.componentType]);i.multiplyScalar(x)}a.max(i)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}n.expandByVector(a)}c.boundingBox=n;const r=new Ln;n.getCenter(r.center),r.radius=n.min.distanceTo(n.max)/2,c.boundingSphere=r}function rs(c,e,t){const s=e.attributes,n=[];function o(r,a){return t.getDependency("accessor",r).then(function(i){c.setAttribute(a,i)})}for(const r in s){const a=ht[r]||r.toLowerCase();a in c.attributes||n.push(o(s[r],a))}if(e.indices!==void 0&&!c.index){const r=t.getDependency("accessor",e.indices).then(function(a){c.setIndex(a)});n.push(r)}return Qt.workingColorSpace!==$&&"COLOR_0"in s&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qt.workingColorSpace}" not supported.`),V(c,e),Fo(c,e,t),Promise.all(n).then(function(){return e.targets!==void 0?Ro(c,e.targets,t):c})}const Es=`
let centers = null, count = 0, order = null, depths = null;
let groupIdx = null, groupStart = null, groupCount = null, nLev = 0, active = null;
const BUCKETS = 65536;
const counts = new Uint32Array(BUCKETS);

function runSort(idx, N, dx, dy, dz) {
  const c = centers, ord = order, dep = depths;
  let dmin = Infinity, dmax = -Infinity;
  for (let i = 0; i < N; i++) {
    const o = idx[i] * 3;
    const d = c[o] * dx + c[o + 1] * dy + c[o + 2] * dz;
    dep[i] = d; if (d < dmin) dmin = d; if (d > dmax) dmax = d;
  }
  const scale = (BUCKETS - 1) / (dmax - dmin || 1);
  counts.fill(0);
  for (let i = 0; i < N; i++) counts[((dep[i] - dmin) * scale) | 0]++;
  let acc = 0;
  for (let b = 0; b < BUCKETS; b++) { const cc = counts[b]; counts[b] = acc; acc += cc; }
  for (let i = 0; i < N; i++) ord[counts[((dep[i] - dmin) * scale) | 0]++] = idx[i];
  const out = new Uint32Array(N);
  for (let i = 0; i < N; i++) out[i] = ord[N - 1 - i]; // far first (back-to-front)
  return out;
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    centers = new Float32Array(m.centers); count = centers.length / 3;
    order = new Uint32Array(count); depths = new Float32Array(count);
    self.postMessage({ type: "ready", count }); return;
  }
  if (m.type === "initGroups") {
    centers = new Float32Array(m.centers); count = centers.length / 3;
    order = new Uint32Array(count); depths = new Float32Array(count); active = new Uint32Array(count);
    groupIdx = new Uint32Array(m.groupIdx); groupStart = new Uint32Array(m.groupStart);
    groupCount = new Uint32Array(m.groupCount); nLev = m.nLev;
    self.postMessage({ type: "ready", count }); return;
  }
  if (m.type === "sort" && centers && order && depths) {
    const t0 = performance.now();
    const dx = m.dir[0], dy = m.dir[1], dz = m.dir[2];
    const sub = m.active ? new Uint32Array(m.active) : null;
    let idx, N;
    if (sub) { idx = sub; N = sub.length; }
    else { idx = (active || (active = new Uint32Array(count))); for (let i = 0; i < count; i++) idx[i] = i; N = count; }
    const out = runSort(idx, N, dx, dy, dz);
    self.postMessage({ type: "sorted", order: out.buffer, version: m.version, sortMs: performance.now() - t0, n: N }, [out.buffer]);
    return;
  }
  if (m.type === "sortCells" && centers && groupIdx && groupStart && groupCount && active) {
    const t0 = performance.now();
    const dx = m.dir[0], dy = m.dir[1], dz = m.dir[2];
    const cellLod = new Uint8Array(m.cellLod);
    let N = 0;
    for (let cIdx = 0; cIdx < cellLod.length; cIdx++) {
      const lod = cellLod[cIdx];
      if (lod >= nLev) continue; // culled cell (outside frustum) contributes nothing
      const gi = cIdx * nLev + lod;
      const s = groupStart[gi], n = groupCount[gi];
      for (let k = 0; k < n; k++) active[N++] = groupIdx[s + k];
    }
    const out = runSort(active, N, dx, dy, dz);
    self.postMessage({ type: "sorted", order: out.buffer, version: m.version, sortMs: performance.now() - t0, n: N }, [out.buffer]);
    return;
  }

  // ── STREAMING protocol (out-of-core GSplatStream) ─────────────────────────
  // 'centers' is a fixed BUDGET-sized slab; chunks copy their centres into their slab rows on
  // load and the main thread sends the per-frame wanted slab index RANGES to sort GLOBALLY.
  if (m.type === "initBudget") {
    count = m.budget;
    centers = new Float32Array(count * 3);   // slab of BUDGET splat centres (rows mirror the GPU)
    order = new Uint32Array(count); depths = new Float32Array(count); active = new Uint32Array(count);
    self.postMessage({ type: "ready", count }); return;
  }
  if (m.type === "addChunk" && centers) {
    // slabStart = rowStart*2048 (absolute splat index of the chunk's first slab slot).
    const cen = new Float32Array(m.centers);
    centers.set(cen, m.slabStart * 3);
    return;
  }
  if (m.type === "removeChunk" && centers) {
    // nothing to clear: evicted rows are simply never referenced by a wanted range until reused.
    return;
  }
  if (m.type === "sortActive" && centers && active) {
    const t0 = performance.now();
    const dx = m.dir[0], dy = m.dir[1], dz = m.dir[2];
    // ranges = Int32Array [start0,count0, start1,count1, …] (absolute slab indices). Expand into
    // the active list, then global counting-sort back-to-front by centre·dir.
    const ranges = new Int32Array(m.ranges);
    let N = 0;
    for (let r = 0; r < ranges.length; r += 2) {
      const s = ranges[r], n = ranges[r + 1];
      for (let k = 0; k < n; k++) active[N++] = s + k;
    }
    const out = runSort(active, N, dx, dy, dz);
    self.postMessage({ type: "sorted", order: out.buffer, version: m.version, sortMs: performance.now() - t0, n: N }, [out.buffer]);
  }
};
`;let mt=null;async function Po(){mt??=await Yn(()=>import("./three.tsl-DSP6Wist.js"),__vite__mapDeps([0,1,2]),import.meta.url)}function No(){return mt!==null}function Uo(c){const e=mt;if(!e)throw new Error("SplatLoader: call `prepareWebgpuSplats()` before building a webgpu splat material.");const{Fn:t,If:s,Discard:n,uniform:o,texture:r,textureLoad:a,varyingProperty:i,attribute:l,positionGeometry:u,modelViewMatrix:h,cameraProjectionMatrix:d,screenCoordinate:f,transpose:p,mat3:x,ivec2:g,int:_,uint:b,float:m,vec2:v,vec3:E,vec4:L,max:w,min:y,length:T,exp:R,sqrt:S,smoothstep:N,clamp:M,abs:C,bitAnd:D,shiftRight:z}=e,ge=c.shBands??0,le=o(c.uViewport.value),H=o(c.uFocal.value),ue=o(c.uMinPx.value).onFrameUpdate(()=>c.uMinPx.value),yt=o(c.uOrtho.value).onFrameUpdate(()=>c.uOrtho.value),bt=o(0),wt=o(.1),vt=o(1),Ie=o(0),He=o(new se(4,-2)),Tt=o(new I),St=o(0),Fe=Array.from({length:8},()=>o(new Oe)),At=r(c.texCenter),Mt=r(c.texCovA),Rt=r(c.texCovB),Ct=r(c.texColor),Pe=ge>0&&c.texSH?r(c.texSH):null,Et=r(Do()),Ge=i("vec2","vSplatPos"),qe=i("vec4","vSplatColor"),Lt=i("float","vSplatDepth"),zs=l("aSlot","float"),O=new(void 0);O.name="WebgpuSplatMaterial",O.vertexNode=t(()=>{const U=_(1).toVar(),q=L(0,0,2,1).toVar(),_e=_(zs),xe=g(_e.mod(_(k)),_e.div(_(k))),It=At.load(xe).xyz.toVar(),ye=Mt.load(xe).xyz,Ne=Rt.load(xe).xyz,he=Ct.load(xe).toVar(),Gs=x(ye.x,ye.y,ye.z,ye.y,Ne.x,Ne.y,ye.z,Ne.y,Ne.z),Y=h.mul(L(It,1)).toVar();for(let W=0;W<8;W++)s(_(W).lessThan(St).and(Y.xyz.dot(Fe[W].xyz).greaterThan(Fe[W].w)),()=>{U.assign(_(0))});const be=d.mul(Y).toVar();s(be.w.lessThanEqual(0),()=>{U.assign(_(0))});const Ve=m(0).toVar();return s(U.equal(_(1)),()=>{const W=be.xy.div(be.w).toVar();Ve.assign(be.z.div(be.w));const Ke=m(0).toVar(),Ft=m(0).toVar(),We=m(0).toVar(),Pt=m(0).toVar();s(yt.greaterThan(.5),()=>{Ke.assign(H.x),We.assign(H.y)}).Else(()=>{const j=Y.z.mul(Y.z);Ke.assign(H.x.div(Y.z)),Ft.assign(H.x.mul(Y.x).div(j).negate()),We.assign(H.y.div(Y.z)),Pt.assign(H.y.mul(Y.y).div(j).negate())});const qs=x(Ke,m(0),Ft,m(0),We,Pt,m(0),m(0),m(0)),js=x(h.element(0).xyz,h.element(1).xyz,h.element(2).xyz),Nt=p(js).mul(qs),Xe=p(Nt).mul(Gs).mul(Nt),$e=Xe.element(0).x.add(.3).toVar(),Ut=Xe.element(0).y.toVar(),Dt=Xe.element(1).y.add(.3).toVar(),Ot=$e.add(Dt).mul(.5).toVar(),Bt=T(v($e.sub(Dt).mul(.5),Ut)).toVar(),zt=Ot.add(Bt).toVar(),Vs=w(Ot.sub(Bt),m(.1)).toVar(),Ht=v(Ut,zt.sub($e)).toVar(),Gt=T(Ht).toVar(),Qe=Gt.greaterThan(1e-9).select(Ht.div(Gt),v(1,0)).toVar(),we=y(S(zt.mul(2)),m(1024)).toVar(),ve=y(S(Vs.mul(2)),m(1024)).toVar();s(ue.greaterThan(0),()=>{const j=w(we,ve).mul(2).toVar();s(bt.greaterThan(.5),()=>{const Te=ue.mul(.5),Se=w(we,Te).toVar(),de=w(ve,Te).toVar();he.a.mulAssign(we.mul(ve).div(Se.mul(de))),we.assign(Se),ve.assign(de),s(he.a.lessThan(wt),()=>{U.assign(_(0))})}).Else(()=>{s(j.lessThan(ue),()=>{U.assign(_(0))}),he.a.mulAssign(N(ue,ue.mul(2),j))})});const qt=Qe.mul(we).toVar(),jt=v(Qe.y,Qe.x.negate()).mul(ve).toVar(),Vt=C(qt).add(C(jt)).div(le).mul(2).toVar();s(C(W.x).sub(Vt.x).greaterThan(1).or(C(W.y).sub(Vt.y).greaterThan(1)),()=>{U.assign(_(0))}),Pe&&s(U.equal(_(1)),()=>{const j=It.sub(Tt).toVar(),Te=T(j).toVar(),Se=vt.mul(Ie.greaterThan(0).select(m(1).sub(N(Ie.mul(.8),Ie,Te)),m(1))).toVar();s(Se.greaterThan(0),()=>{const de=j.div(w(Te,m(1e-6))).toVar(),Ye=a(Pe,xe).toVar(),Je=Ze=>E(m(D(Ze,b(255))),m(D(z(Ze,b(8)),b(255))),m(D(z(Ze,b(16)),b(255)))).div(255).mul(He.x).add(He.y),Ks=Je(Ye.x),Ws=Je(Ye.y),Xs=Je(Ye.z),$s=Ks.mul(de.y).sub(Ws.mul(de.z)).sub(Xs.mul(de.x)).mul(.4886025119029199);he.rgb.assign(M(he.rgb.add($s.mul(Se)),E(0),E(1)))})}),s(U.equal(_(1)),()=>{const j=qt.mul(u.x).add(jt.mul(u.y)).div(le).mul(2);q.assign(L(W.add(j),Ve,1))})}),Ge.assign(u.xy),qe.assign(he),Lt.assign(Ve),q})(),O.fragmentNode=t(()=>{const U=Ge.dot(Ge).negate().toVar();n(U.lessThan(-4));const q=a(Et,g(f.xy)).r;n(Lt.greaterThan(q));const _e=R(U).mul(qe.a).toVar();return L(qe.rgb.mul(_e),_e)})(),O.side=ke,O.transparent=!0,O.depthTest=!1,O.depthWrite=!1,O.fog=!1,O.blending=ps,O.blendEquation=ms,O.blendSrc=gs,O.blendDst=_s;const Hs=Fe.map(U=>U.value),kt={uCutPlanes:{get value(){return Hs},set value(U){for(let q=0;q<8;q++)Fe[q].value.copy(U[q]??new Oe)}},uShBands:{value:ge},uTexW:{value:k}},je={texCenter:At,texCovA:Mt,texCovB:Rt,texColor:Ct,sceneDepth:Et,uViewport:le,uFocal:H,uMinPx:ue,uOrtho:yt,uSubPixel:bt,uSubMinA:wt,uShStrength:vt,uShMaxDist:Ie,uShRange:He,uCamLocal:Tt,uNumClip:St};Pe&&(je.texSH=Pe);for(const U of Object.keys(je)){const q=je[U];Object.defineProperty(kt,U,{enumerable:!0,get:()=>q,set:()=>{}})}return O.uniforms=kt,O}let re=null;function Do(){return re||(re=new ie(new Float32Array([1]),1,1,kn,Be),re.minFilter=re.magFilter=X,re.colorSpace=Le,re.needsUpdate=!0),re}const k=2048,Oo=`
in vec3 position;          // quad corner ∈ [-2,2]
in float aSlot;
uniform mat4 modelViewMatrix, projectionMatrix;
uniform int uTexW;
uniform float uMinPx;      // minimum projected splat size (0=off)
uniform float uSubPixel;   // 1 = keep sub-pixel splats (grow + compensate) instead of dropping them
uniform float uSubMinA;    // in that mode, drop a grown splat once its compensated alpha falls here
uniform float uOrtho;      // 1 = orthographic camera (constant Jacobian, no 1/depth)
uniform vec2 uViewport, uFocal;
uniform vec4 uCutPlanes[8];   // active clipping planes in VIEW space (xyz=normal, w=constant)
uniform int uNumClip;          // 0 = clipping off
uniform int uShBands;          // 0 = no spherical harmonics (flat colour), 1 = degree 1
uniform float uShStrength;     // 0..1 user dial over the view-dependent term
uniform vec2 uShRange;         // (scale, offset) dequant for the 8-bit SH texture
uniform vec3 uCamLocal;        // camera position in the DATASET's local space
uniform float uShMaxDist;      // drop SH beyond this distance from the camera (0 = no limit)
out vec2 vPos;
out vec4 vColor;`,Bo=`
  // DISTANCE limit. The view-dependent term is only perceptible on surfaces close enough to read
  // as a surface; past that it is a per-splat cost paying for nothing. The vector to the splat is
  // needed for the SH direction anyway, so its length is nearly free and is computed BEFORE the
  // branch — that way a splat past the limit skips the texture fetch entirely, which is the whole
  // point. Ramped over the last 20% rather than cut, so splats don't change colour as they cross
  // it: a hard boundary here would reproduce the distance "cut" artefact this codebase was already
  // criticised for.
  vec3 toSplat = center - uCamLocal;
  float shDist = length(toSplat);
  float shAmt = uShStrength * (uShMaxDist > 0.0
    ? 1.0 - smoothstep(uShMaxDist * 0.8, uShMaxDist, shDist)
    : 1.0);
  if (uShBands > 0 && shAmt > 0.0) {
    vec3 d = toSplat / max(shDist, 1e-6);
    // ONE fetch, not three. All 9 coefficients ride in a single RGBA32UI texel: x/y/z each pack
    // one basis's r,g,b as three bytes (w spare). The quad has 4 vertices and every one of them
    // repeats this lookup, so fetch count is multiplied by 4 per splat — trading 3 fetches for a
    // handful of integer shifts is the right way round. The on-disk SHQ1 layout is UNCHANGED;
    // the decode worker does this packing, so existing datasets need no reconversion.
    uvec4 p = texelFetch(texSH, loc, 0);
    vec3 c1 = vec3((p.x >> 0) & 255u, (p.x >> 8) & 255u, (p.x >> 16) & 255u) / 255.0 * uShRange.x + uShRange.y;
    vec3 c2 = vec3((p.y >> 0) & 255u, (p.y >> 8) & 255u, (p.y >> 16) & 255u) / 255.0 * uShRange.x + uShRange.y;
    vec3 c3 = vec3((p.z >> 0) & 255u, (p.z >> 8) & 255u, (p.z >> 16) & 255u) / 255.0 * uShRange.x + uShRange.y;
    vec3 sh = 0.4886025119029199 * (d.y * c1 - d.z * c2 - d.x * c3);
    vColor.rgb = clamp(vColor.rgb + sh * shAmt, 0.0, 1.0);
  }`,zo=`
  vPos = position.xy;
  vec4 cam = modelViewMatrix * vec4(center, 1.0);
  // Section clipping: cull the whole splat when its centre is on the clipped side of
  // any active plane (planes pre-transformed to view space). Matches three's material
  // clipping convention (discard where dot(viewPos, n) > constant).
  for (int ci = 0; ci < 8; ci++) {
    if (ci >= uNumClip) break;
    if (dot(cam.xyz, uCutPlanes[ci].xyz) > uCutPlanes[ci].w) {
      gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return;
    }
  }
  vec4 pos2d = projectionMatrix * cam;
  // Only reject splats whose CENTRE is behind the camera (the perspective divide would
  // flip). Do NOT cull on the near plane by centre: a large splat straddling the near
  // plane must still draw its visible part — the GPU near-clips the quad per-fragment via
  // gl_Position.z. Discarding the whole splat by centre made close splats pop out entirely.
  // (The screen-extent frustum cull happens below, once the projected size is known.)
  if (pos2d.w <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
  vec2 vCenter = pos2d.xy / pos2d.w;
  float ndcZ = pos2d.z / pos2d.w;   // splat-centre depth → occlude against the borrowed BIM depth
  // Projection Jacobian ∂screen/∂view. PERSPECTIVE: depth-dependent (focal/z, with the
  // cam.x/z² off-diagonal). ORTHOGRAPHIC: constant (uFocal is already pixels-per-world-unit
  // = 0.5·viewport·projElem for an ortho matrix), no 1/depth → splats keep a constant screen
  // size with distance, matching the point-cloud ortho path.
  mat3 J = uOrtho > 0.5
    ? mat3(uFocal.x, 0.0, 0.0,
           0.0, uFocal.y, 0.0,
           0.0, 0.0, 0.0)
    : mat3(uFocal.x / cam.z, 0.0, -(uFocal.x * cam.x) / (cam.z * cam.z),
           0.0, uFocal.y / cam.z, -(uFocal.y * cam.y) / (cam.z * cam.z),
           0.0, 0.0, 0.0);
  mat3 T = transpose(mat3(modelViewMatrix)) * J;
  mat3 cov2d = transpose(T) * Vrk * T;
  float d1 = cov2d[0][0] + 0.3;       // INRIA low-pass dilation
  float off = cov2d[0][1];
  float d2 = cov2d[1][1] + 0.3;
  float mid = 0.5 * (d1 + d2);
  float rad = length(vec2(0.5 * (d1 - d2), off));
  float l1 = mid + rad;
  float l2 = max(mid - rad, 0.1);     // minor-eigenvalue floor
  vec2 eig = vec2(off, l1 - d1);
  float eigLen = length(eig);
  vec2 dvec = eigLen > 1e-9 ? eig / eigLen : vec2(1.0, 0.0);
  float a1 = min(sqrt(2.0 * l1), 1024.0);
  float a2 = min(sqrt(2.0 * l2), 1024.0);
  // SUB-PIXEL SPLATS. This used to be a hard discard — anything projecting under uMinPx vanished —
  // and that is the "cut at a fixed distance" the capture looked like it had: a binary boundary
  // that travels with the camera. It also quietly capped detail, because the extra gaussians a
  // finer LOD adds are SMALLER, so they were discarded on arrival: raising lodQuality from 0.55 to
  // 2.0 drew 20% more splats and produced a bit-identical image, while with the discard off the
  // same change did alter it.
  //
  // Instead, grow a too-small splat to the floor size and scale its opacity by the area it gained,
  // so its total contribution (area x opacity) is preserved. Distant surfaces then thin out
  // continuously instead of ending at a line, and LOD detail actually reaches the screen. The
  // remaining cull is on ALPHA, not size: it drops only what has faded past 8-bit visibility, so
  // it can never produce a visible edge.
  // SUB-PIXEL SPLATS — two ways, because "no visible edge" and "distant detail survives" are
  // different goals with very different price tags.
  //
  // DEFAULT (uSubPixel = 0): still discard below uMinPx, so the cost is unchanged, but RAMP the
  // opacity down over the band just above the threshold. A splat now fades out and is only dropped
  // once it is already invisible, instead of blinking out at full strength. That removes the hard
  // boundary — the "cut at a fixed distance" — for free.
  //
  // OPT-IN (uSubPixel = 1): don't discard at all. Grow the splat to the floor size and scale its
  // opacity by the area it gained, preserving its total contribution. This is the only mode where
  // the finer gaussians a higher lodQuality streams in actually reach the screen: measured, with
  // the discard active, raising lodQuality 0.55 -> 2.0 drew 20% more splats and produced a
  // BIT-IDENTICAL image, because everything it added was immediately culled. It is expensive
  // (~2x frame time on a 4M-splat view) and, counter-intuitively, a LARGER uMinPx costs MORE here
  // since it inflates every tiny quad rather than removing it.
  if (uMinPx > 0.0) {
    float szPx = 2.0 * max(a1, a2);
    if (uSubPixel > 0.5) {
      float rMin = uMinPx * 0.5;
      float b1 = max(a1, rMin), b2 = max(a2, rMin);
      vColor.a *= (a1 * a2) / (b1 * b2);
      a1 = b1; a2 = b2;
      // The cull here is on ALPHA, never on size, which is what keeps the transition smooth: a
      // splat's opacity decays continuously with distance and it is dropped only once it has
      // faded to uSubMinA. Raising that threshold is therefore a pure cost/fidelity dial that
      // CANNOT reintroduce a hard edge — unlike a size cut, which is the artefact this whole
      // change exists to remove.
      if (vColor.a < uSubMinA) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
    } else {
      if (szPx < uMinPx) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
      vColor.a *= smoothstep(uMinPx, uMinPx * 2.0, szPx);
    }
  }
  vec2 majorAxis = a1 * dvec;
  vec2 minorAxis = a2 * vec2(dvec.y, -dvec.x);
  // EXTENT-AWARE frustum cull (x/y only): skip a splat only when its screen AABB —
  // centre ± projected half-extent — is fully outside NDC, so a big splat near a screen
  // edge (or that you're standing next to) isn't culled just because its centre left the
  // frustum. Near/far are handled by the GPU's per-fragment clip on gl_Position.z.
  vec2 ext = (abs(majorAxis) + abs(minorAxis)) / uViewport * 2.0;
  if (abs(vCenter.x) - ext.x > 1.0 || abs(vCenter.y) - ext.y > 1.0) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return;
  }
${Bo}
  vec2 offset = (position.x * majorAxis + position.y * minorAxis) / uViewport * 2.0;
  gl_Position = vec4(vCenter + offset, ndcZ, 1.0);`,Ls=`${Oo}
uniform highp sampler2D texCenter, texCovA, texCovB;
uniform sampler2D texColor;
uniform highp usampler2D texSH;   // RGBA32UI: 9 SH bytes packed into one texel
void main() {
  int idx = int(aSlot);
  ivec2 loc = ivec2(idx % uTexW, idx / uTexW);
  vec3 center = texelFetch(texCenter, loc, 0).xyz;
  vec3 ca = texelFetch(texCovA, loc, 0).xyz; // xx,xy,xz
  vec3 cb = texelFetch(texCovB, loc, 0).xyz; // yy,yz,zz
  vColor = texelFetch(texColor, loc, 0);
  mat3 Vrk = mat3(ca.x, ca.y, ca.z,  ca.y, cb.x, cb.y,  ca.z, cb.y, cb.z);
${zo}
}`,Ho=`
precision highp float;
precision highp int;   // must match the vertex stage or shared-uniform link fails → black
in vec2 vPos;
in vec4 vColor;
out vec4 fragColor;
void main() {
  float A = -dot(vPos, vPos);
  if (A < -4.0) discard;
  float B = exp(A) * vColor.a;
  fragColor = vec4(B * vColor.rgb, B); // premultiplied
}`,Go=[-2,-2,0,2,-2,0,2,2,0,-2,2,0],qo=[0,1,2,0,2,3];function ks(){const c=new In;return c.setAttribute("position",new Fn(Go,3)),c.setIndex(qo),c}let Z=null;function jo(){return Z||(Z=new ie(new Uint32Array(4),1,1,lt,ut),Z.internalFormat="RGBA32UI",Z.minFilter=Z.magFilter=X,Z.colorSpace=Le,Z.needsUpdate=!0),Z}function Is(c){return No()?Uo(c):new xs({glslVersion:bs,vertexShader:Ls,fragmentShader:Ho,side:ke,transparent:!0,depthTest:!0,depthWrite:!1,depthFunc:ys,blending:ps,blendEquation:ms,blendSrc:gs,blendDst:_s,uniforms:{texCenter:{value:c.texCenter},texCovA:{value:c.texCovA},texCovB:{value:c.texCovB},texColor:{value:c.texColor},texSH:{value:c.texSH??jo()},uShBands:{value:c.shBands??0},uShStrength:{value:1},uShMaxDist:{value:0},uShRange:{value:new se(4,-2)},uCamLocal:{value:new I},uTexW:{value:k},uViewport:c.uViewport,uFocal:c.uFocal,uMinPx:c.uMinPx,uSubPixel:{value:0},uSubMinA:{value:.1},uOrtho:c.uOrtho,uCutPlanes:{value:Array.from({length:8},()=>new Oe)},uNumClip:{value:0}}})}function Vo(c){return`
precision highp float;
precision highp int;
in vec2 vPos;
in vec4 vColor;
out vec4 fragColor;
void main() {
  float A = -dot(vPos, vPos);
  if (A < -4.0) discard;
  float B = exp(A) * vColor.a;
  if (B < 0.5) discard;              // front solid surface only — drop the faint tails
  ${c}
  fragColor = packedDepth;
}`}function Ko(c,e){return new xs({glslVersion:bs,vertexShader:Ls,fragmentShader:Vo(e),side:ke,transparent:!1,depthTest:!0,depthWrite:!0,depthFunc:ys,uniforms:c})}function Wo(c,e,t,s,n,o=0){for(let r=0;r<t;r++){const a=c[r*3],i=c[r*3+1],l=c[r*3+2],u=e[r*4],h=e[r*4+1],d=e[r*4+2],f=e[r*4+3],p=1-2*(h*h+d*d),x=2*(u*h+f*d),g=2*(u*d-f*h),_=2*(u*h-f*d),b=1-2*(u*u+d*d),m=2*(h*d+f*u),v=2*(u*d+f*h),E=2*(h*d-f*u),L=1-2*(u*u+h*h),w=p*a,y=x*a,T=g*a,R=_*i,S=b*i,N=m*i,M=v*l,C=E*l,D=L*l,z=(o+r)*4;s[z]=w*w+R*R+M*M,s[z+1]=w*y+R*S+M*C,s[z+2]=w*T+R*N+M*D,n[z]=y*y+S*S+C*C,n[z+1]=y*T+S*N+C*D,n[z+2]=T*T+N*N+D*D}}function Xo(c,e,t,s){const n=new Float32Array(s*4),o=new Float32Array(s*4);return Wo(c,e,t,n,o,0),{covA:n,covB:o}}function $o(c,e,t,s){let n=0,o=e;for(;n<s&&c>o;)o*=t,n++;return n}class Qo{object=new Ce;center=new I;radius;total;nCells;_mesh;_geo;_mat;_aIndex;_idxArr;_worker;_workerUrl;_textures=[];_gpuBytes=0;_disposed=!1;_uViewport={value:new se(1,1)};_uFocal={value:new se};_uMinPx={value:3};_uOrtho={value:0};_G=10;_nLev;_mn;_sz;_cellCenter;_base;_mult=2;_lastLod;_cellLod;_CULLED=255;_visN=0;_sortMs=0;_sortPending=!1;_version=0;_dirty=!0;_visCells=0;_fwd=new I;_lastDir=new I(0,0,1);_frustum=new ws;_pvm=new Q;_mInv=new Q;_nrm3=new vs;_camLocal=new I;_cbox=new ze;constructor(e){const t=Pn.toHalfFloat;this._nLev=e.length,this.total=e.reduce((w,y)=>w+y.count,0);const s=Math.ceil(this.total/k),n=k*s,o=new Float32Array(n*4),r=new Uint16Array(n*4),a=new Uint16Array(n*4),i=new Uint8Array(n*4),l=new Float32Array(this.total*3),u=[1/0,1/0,1/0],h=[-1/0,-1/0,-1/0];for(const w of e)for(let y=0;y<w.count;y++)for(let T=0;T<3;T++){const R=w.centers[y*3+T];R<u[T]&&(u[T]=R),R>h[T]&&(h[T]=R)}const d=this._G,f=this.nCells=d*d*d,p=[h[0]-u[0]||1,h[1]-u[1]||1,h[2]-u[2]||1];this._mn=u,this._sz=p;const x=(w,y,T)=>{const R=Math.min(d-1,Math.max(0,(w-u[0])/p[0]*d|0)),S=Math.min(d-1,Math.max(0,(y-u[1])/p[1]*d|0));return(Math.min(d-1,Math.max(0,(T-u[2])/p[2]*d|0))*d+S)*d+R},g=this._nLev,_=Array.from({length:f},()=>Array.from({length:g},()=>[]));let b=0;for(let w=0;w<g;w++){const y=e[w],{covA:T,covB:R}=Xo(y.scales,y.quats,y.count,y.count);for(let S=0;S<y.count;S++){const N=y.centers[S*3],M=y.centers[S*3+1],C=y.centers[S*3+2];o[b*4]=N,o[b*4+1]=M,o[b*4+2]=C,l[b*3]=N,l[b*3+1]=M,l[b*3+2]=C,r[b*4]=t(T[S*4]),r[b*4+1]=t(T[S*4+1]),r[b*4+2]=t(T[S*4+2]),a[b*4]=t(R[S*4]),a[b*4+1]=t(R[S*4+1]),a[b*4+2]=t(R[S*4+2]),i[b*4]=y.colors[S*4]*255,i[b*4+1]=y.colors[S*4+1]*255,i[b*4+2]=y.colors[S*4+2]*255,i[b*4+3]=y.colors[S*4+3]*255,_[x(N,M,C)][w].push(b),b++}}const m=new Uint32Array(f*g),v=new Uint32Array(f*g),E=new Uint32Array(this.total);let L=0;for(let w=0;w<f;w++)for(let y=0;y<g;y++){const T=_[w][y],R=w*g+y;m[R]=L,v[R]=T.length;for(let S=0;S<T.length;S++)E[L++]=T[S]}this._cellCenter=new Float32Array(f*3);for(let w=0;w<d;w++)for(let y=0;y<d;y++)for(let T=0;T<d;T++){const R=(w*d+y)*d+T;this._cellCenter[R*3]=u[0]+(T+.5)/d*p[0],this._cellCenter[R*3+1]=u[1]+(y+.5)/d*p[1],this._cellCenter[R*3+2]=u[2]+(w+.5)/d*p[2]}this.center.set((u[0]+h[0])/2,(u[1]+h[1])/2,(u[2]+h[2])/2),this.radius=Math.hypot(p[0],p[1],p[2])/2||1,this._base=this.radius*.55,this._lastLod=new Int16Array(f).fill(-1),this._cellLod=new Uint8Array(f),this._mat=Is({texCenter:this._dataTex(o,s),texCovA:this._halfTex(r,s),texCovB:this._halfTex(a,s),texColor:this._u8Tex(i,s),uViewport:this._uViewport,uFocal:this._uFocal,uMinPx:this._uMinPx,uOrtho:this._uOrtho}),this._geo=ks(),this._idxArr=new Float32Array(this.total),this._aIndex=new ft(this._idxArr,1),this._aIndex.setUsage(Ts),this._geo.setAttribute("aSlot",this._aIndex),this._geo.instanceCount=0,this._mesh=new pt(this._geo,this._mat),this._mesh.frustumCulled=!1,this._mesh.userData.splatCount=0,this.object.add(this._mesh),this._workerUrl=URL.createObjectURL(new Blob([Es],{type:"application/javascript"})),this._worker=new Worker(this._workerUrl),this._worker.postMessage({type:"initGroups",centers:l.buffer,groupIdx:E.buffer,groupStart:m.buffer,groupCount:v.buffer,nLev:g},[l.buffer,E.buffer,m.buffer,v.buffer]),this._worker.onmessage=w=>{if(this._disposed||w.data.type!=="sorted")return;const y=new Uint32Array(w.data.order);this._visN=w.data.n,this._idxArr.set(y.subarray(0,this._visN)),this._aIndex.clearUpdateRanges(),this._aIndex.addUpdateRange(0,this._visN),this._aIndex.needsUpdate=!0,this._geo.instanceCount=this._visN,this._mesh.userData.splatCount=this._visN,this._sortMs=w.data.sortMs,this._sortPending=!1}}get gpuBytes(){return this._gpuBytes}get drawn(){return this._visN}get cellsInView(){return this._visCells}get sortMs(){return this._sortMs}get lodBase(){return this._base}set lodBase(e){this._base=e,this._lastLod.fill(-1),this._dirty=!0}setFrameUniforms(e,t,s,n){this._uViewport.value.set(e,t);const o=s.projectionMatrix.elements;this._uFocal.value.set(o[0]*.5*e,o[5]*.5*t),this._uMinPx.value=n,this._uOrtho.value=s.isOrthographicCamera?1:0}update(e){if(this._disposed)return;this.object.updateMatrixWorld(),this._mInv.copy(this.object.matrixWorld).invert(),this._pvm.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).multiply(this.object.matrixWorld),this._frustum.setFromProjectionMatrix(this._pvm),this._camLocal.copy(e.position).applyMatrix4(this._mInv),e.getWorldDirection(this._fwd),this._nrm3.getNormalMatrix(this._mInv),this._fwd.applyMatrix3(this._nrm3).normalize();const t=this._G,s=this._mn,n=this._sz,o=n[0]/t,r=n[1]/t,a=n[2]/t,i=this._camLocal.x,l=this._camLocal.y,u=this._camLocal.z;let h=!1;this._visCells=0;for(let f=0;f<this.nCells;f++){const p=f%t,x=(f/t|0)%t,g=f/(t*t)|0;this._cbox.min.set(s[0]+p*o,s[1]+x*r,s[2]+g*a),this._cbox.max.set(this._cbox.min.x+o,this._cbox.min.y+r,this._cbox.min.z+a);let _;if(!this._frustum.intersectsBox(this._cbox))_=this._CULLED;else{const b=this._cellCenter[f*3]-i,m=this._cellCenter[f*3+1]-l,v=this._cellCenter[f*3+2]-u;_=Math.min(this._nLev-1,$o(Math.hypot(b,m,v),this._base,this._mult,this._nLev-1)),this._visCells++}this._cellLod[f]=_,_!==this._lastLod[f]&&(this._lastLod[f]=_,h=!0)}h&&(this._dirty=!0);const d=this._fwd.dot(this._lastDir)<.9995;!this._sortPending&&(this._dirty||d)&&(this._lastDir.copy(this._fwd),this._dirty=!1,this._sortPending=!0,this._version++,this._worker.postMessage({type:"sortCells",dir:[this._fwd.x,this._fwd.y,this._fwd.z],cellLod:this._cellLod.slice().buffer,version:this._version}))}dispose(){this._disposed=!0,this._worker.terminate(),URL.revokeObjectURL(this._workerUrl),this.object.remove(this._mesh),this._geo.dispose(),this._mat.dispose();for(const e of this._textures)e.dispose()}_dataTex(e,t){const s=new ie(e,k,t,Ue,Be);return s.minFilter=s.magFilter=X,s.needsUpdate=!0,this._gpuBytes+=k*t*16,this._textures.push(s),s}_halfTex(e,t){const s=new ie(e,k,t,Ue,De);return s.minFilter=s.magFilter=X,s.needsUpdate=!0,this._gpuBytes+=k*t*8,this._textures.push(s),s}_u8Tex(e,t){const s=new ie(e,k,t,Ue,Ss);return s.minFilter=s.magFilter=X,s.colorSpace=Le,s.needsUpdate=!0,this._gpuBytes+=k*t*4,this._textures.push(s),s}}const Yo=`
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const SH_C0_SOG = 0.2820948; // SH degree-0 DC factor (matches VERT_SOG / loadSOGChunkData)

// float32 → float16 (half). Standard bit-twiddle via aliased Float32/Uint32 views. Reproduces
// THREE.DataUtils.toHalfFloat exactly (round-to-nearest-even, subnormals, Inf/NaN).
const _f32 = new Float32Array(1);
const _u32 = new Uint32Array(_f32.buffer);
function toHalf(val) {
  _f32[0] = val;
  const x = _u32[0];
  const bits = (x >> 16) & 0x8000;
  let m = (x >> 12) & 0x07ff;
  const e = (x >> 23) & 0xff;
  if (e < 103) return bits;
  if (e > 142) {
    let out = bits | 0x7c00;
    out |= (e === 255 ? 0 : 1) && (x & 0x007fffff);
    return out;
  }
  if (e < 113) {
    m |= 0x0800;
    return bits | ((m >> (114 - e)) + ((m >> (113 - e)) & 1));
  }
  let out = bits | ((e - 112) << 10) | (m >> 1);
  out += m & 1;
  return out;
}

// Decode a lossless WebP ArrayBuffer to raw, UN-premultiplied RGBA bytes. Preferred path is
// WebCodecs ImageDecoder (workers support it) — a 2D-canvas roundtrip would un-premultiply and
// perturb the quat "mode" (alpha) + sh0 opacity by ±1 LSB. Same logic as sog.ts decodeWebpRGBA.
async function decodeWebpRGBA(bytes) {
  const ID = self.ImageDecoder;
  if (ID) {
    const dec = new ID({ data: bytes, type: "image/webp" });
    const res = await dec.decode();
    const image = res.image; // a VideoFrame
    const w = image.displayWidth, h = image.displayHeight;
    const size = image.allocationSize({ format: "RGBA" });
    const out = new Uint8Array(size);
    await image.copyTo(out, { format: "RGBA" });
    if (image.close) image.close();
    return { data: out, width: w, height: h };
  }
  const bmp = await createImageBitmap(new Blob([bytes], { type: "image/webp" }), {
    premultiplyAlpha: "none", colorSpaceConversion: "none",
  });
  const w = bmp.width, h = bmp.height;
  const cv = new OffscreenCanvas(w, h);
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bmp, 0, 0);
  const data = new Uint8Array(ctx.getImageData(0, 0, w, h).data.buffer.slice(0));
  if (bmp.close) bmp.close();
  return { data, width: w, height: h };
}

// Allocate the OUT slab arrays for a node of \`count\` splats. \`withSh\` also allocates the
// spherical-harmonics slab: ONE RGBA32UI texel per splat (4 uint32) holding all 9 coefficients.
function allocOut(count, withSh) {
  return {
    center: new Float32Array(count * 4),   // xyz + 0 pad
    covA: new Uint16Array(count * 4),       // half xx,xy,xz + 0
    covB: new Uint16Array(count * 4),       // half yy,yz,zz + 0
    color: new Uint8Array(count * 4),       // RGBA u8
    centers: new Float32Array(count * 3),   // xyz-only for the sort worker
    sh: withSh ? new Uint32Array(count * 4) : null,
  };
}

// SHQ1 sidecar → the texSH slab layout. Positional: splat i of the .sh IS splat i of the .fq.
//
// The 9 file bytes (basis-major, rgb interleaved) pack into ONE texel: x/y/z each carry one
// basis's r,g,b in their low three bytes, w spare. It used to be 3 RGB texels, which cost the
// vertex shader 3 fetches — and the quad has 4 vertices, so 12 lookups per splat. The FILE layout
// is untouched by this, so datasets converted before the change still load.
//
// Returns false when the sidecar doesn't match the node: a mismatched pair would tint splats with
// a neighbour's coefficients, so drop it and render flat rather than render wrong.
// Two magics: "SHQ1" carries r,g,b per basis; "SHQM" carries ONE value per basis, which is
// replicated across r,g,b right here. Doing the replication in the worker keeps the shader and the
// texture layout identical for both, so mono is purely a transport saving (9 -> 3 bytes/splat).
function expandSh(o, count, shBytes) {
  if (!o.sh || !shBytes) return false;
  const dv = new DataView(shBytes);
  const magic = dv.getUint32(0, false);
  const mono = magic === 0x5348514d; // "SHQM"
  if (!mono && magic !== 0x53485131) return false; // "SHQ1"
  if (dv.getUint32(4, true) !== count) return false;
  const per = mono ? 3 : 9;
  const src = new Uint8Array(shBytes, 20);
  if (src.length < count * per) return false;
  const dst = o.sh;
  for (let i = 0; i < count; i++) {
    const s = i * per, d = i * 4;
    if (mono) {
      const v0 = src[s], v1 = src[s + 1], v2 = src[s + 2];
      dst[d] = (v0 | (v0 << 8) | (v0 << 16)) >>> 0;
      dst[d + 1] = (v1 | (v1 << 8) | (v1 << 16)) >>> 0;
      dst[d + 2] = (v2 | (v2 << 8) | (v2 << 16)) >>> 0;
    } else {
      dst[d] = (src[s] | (src[s + 1] << 8) | (src[s + 2] << 16)) >>> 0;
      dst[d + 1] = (src[s + 3] | (src[s + 4] << 8) | (src[s + 5] << 16)) >>> 0;
      dst[d + 2] = (src[s + 6] | (src[s + 7] << 8) | (src[s + 8] << 16)) >>> 0;
    }
    dst[d + 3] = 0;
  }
  return true;
}

// The SHARED output tail. Inputs are per-splat, PRE Y-up flip: center (cx,cy,cz), LINEAR scale
// (sx,sy,sz), quat (qx,qy,qz,qw), colour (r,g,b,a in 0..1). Applies the 180°-about-X Y-up flip
// (negate y,z; quat (qx,qy,qz,qw) → (qw,-qz,qy,-qx)), builds covariance Σ = M Mᵀ (M = R·diag(s)),
// half-quantizes it, and writes center/covA/covB/color/centers at index i.
function emitSlab(o, i, cx, cy, cz, sx, sy, sz, qx, qy, qz, qw, r, g, b, a) {
  const co = i * 4, ce = i * 3;
  const fx = cx, fy = -cy, fz = -cz;
  o.center[co] = fx; o.center[co + 1] = fy; o.center[co + 2] = fz; o.center[co + 3] = 0;
  o.centers[ce] = fx; o.centers[ce + 1] = fy; o.centers[ce + 2] = fz;
  // Y-up flip: (qx,qy,qz,qw) → (qw, -qz, qy, -qx).
  const rx = qw, ry = -qz, rz = qy, rw = -qx;
  const r0x = 1 - 2 * (ry * ry + rz * rz), r0y = 2 * (rx * ry + rw * rz), r0z = 2 * (rx * rz - rw * ry);
  const r1x = 2 * (rx * ry - rw * rz), r1y = 1 - 2 * (rx * rx + rz * rz), r1z = 2 * (ry * rz + rw * rx);
  const r2x = 2 * (rx * rz + rw * ry), r2y = 2 * (ry * rz - rw * rx), r2z = 1 - 2 * (rx * rx + ry * ry);
  const m0x = r0x * sx, m0y = r0y * sx, m0z = r0z * sx;
  const m1x = r1x * sy, m1y = r1y * sy, m1z = r1z * sy;
  const m2x = r2x * sz, m2y = r2y * sz, m2z = r2z * sz;
  o.covA[co] = toHalf(m0x * m0x + m1x * m1x + m2x * m2x);
  o.covA[co + 1] = toHalf(m0x * m0y + m1x * m1y + m2x * m2y);
  o.covA[co + 2] = toHalf(m0x * m0z + m1x * m1z + m2x * m2z);
  o.covA[co + 3] = 0;
  o.covB[co] = toHalf(m0y * m0y + m1y * m1y + m2y * m2y);
  o.covB[co + 1] = toHalf(m0y * m0z + m1y * m1z + m2y * m2z);
  o.covB[co + 2] = toHalf(m0z * m0z + m1z * m1z + m2z * m2z);
  o.covB[co + 3] = 0;
  o.color[co] = clamp01(r) * 255;
  o.color[co + 1] = clamp01(g) * 255;
  o.color[co + 2] = clamp01(b) * 255;
  o.color[co + 3] = a * 255;
}

function postDecoded(file, count, o, hasSh) {
  const msg = { type: "decoded", file, count,
    center: o.center.buffer, covA: o.covA.buffer, covB: o.covB.buffer,
    color: o.color.buffer, centers: o.centers.buffer, sh: null };
  const transfer = [o.center.buffer, o.covA.buffer, o.covB.buffer, o.color.buffer, o.centers.buffer];
  if (hasSh) { msg.sh = o.sh.buffer; transfer.push(o.sh.buffer); }
  self.postMessage(msg, transfer);
}

// SOG node: 5 WebP images + codebooks → per-splat (pre-flip) → emitSlab.
async function decodeSOG(m) {
  const { file, count, mins, maxs, scalesCodebook, sh0Codebook, webp } = m;
  const [loImg, hiImg, scImg, qImg, cImg] = await Promise.all([
    decodeWebpRGBA(webp.meansL), decodeWebpRGBA(webp.meansU),
    decodeWebpRGBA(webp.scales), decodeWebpRGBA(webp.quats), decodeWebpRGBA(webp.sh0),
  ]);
  const lo = loImg.data, hi = hiImg.data, sc = scImg.data, qd = qImg.data, c0 = cImg.data;
  const o = allocOut(count, false); // SOG carries its own SH bands; not wired up here
  const S2 = Math.SQRT2;
  for (let i = 0; i < count; i++) {
    const p = i * 4;
    // means: 16-bit per comp (hi*256 + lo) → log → center (pre-flip).
    let cx = 0, cy = 0, cz = 0;
    for (let cc = 0; cc < 3; cc++) {
      const nrm = (hi[p + cc] * 256 + lo[p + cc]) / 65535;
      const logp = mins[cc] + (maxs[cc] - mins[cc]) * nrm;
      const v = Math.sign(logp) * (Math.exp(Math.abs(logp)) - 1);
      if (cc === 0) cx = v; else if (cc === 1) cy = v; else cz = v;
    }
    // scales: codebook lookup by byte index, then exp → linear.
    const sx = Math.exp(scalesCodebook[Math.round(sc[p])]);
    const sy = Math.exp(scalesCodebook[Math.round(sc[p + 1])]);
    const sz = Math.exp(scalesCodebook[Math.round(sc[p + 2])]);
    // quats: largest-component mode in alpha; reconstruct (x,y,z,w) (pre-flip).
    const a = (qd[p] / 255 - 0.5) * S2, b = (qd[p + 1] / 255 - 0.5) * S2, c = (qd[p + 2] / 255 - 0.5) * S2;
    const dd = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const mode = Math.round((qd[p + 3] / 255) * 255) - 252; // 0..3
    let qx, qy, qz, qw;
    if (mode === 0) { qx = a; qy = b; qz = c; qw = dd; }
    else if (mode === 1) { qx = dd; qy = b; qz = c; qw = a; }
    else if (mode === 2) { qx = b; qy = dd; qz = c; qw = a; }
    else { qx = b; qy = c; qz = dd; qw = a; }
    // color: sh0 codebook DC term → rgb (0..1), alpha straight from byte (0..1).
    const r = clamp01(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[p])]);
    const g = clamp01(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[p + 1])]);
    const bl = clamp01(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[p + 2])]);
    const al = c0[p + 3] / 255;
    emitSlab(o, i, cx, cy, cz, sx, sy, sz, qx, qy, qz, qw, r, g, bl, al);
  }
  postDecoded(file, count, o, false);
}

// FQC1 node: one flat-quant blob (see fq-codec.ts / ply.ts parseFqChunk) → per-splat (pre-flip)
// → emitSlab. Header: "FQC1" + uint32 count + uint32 numSubChunks + float32[numSub*18] bounds +
// uint32[count*4] packed (pos 11-10-11, rot 2-10-10-10, scale-log 11-10-11, color 8888).
function decodeFQ(m) {
  const dv = new DataView(m.bytes);
  const N = dv.getUint32(4, true);
  const numSub = dv.getUint32(8, true);
  const cstride = 18;
  const chunk = new Float32Array(numSub * cstride);
  let boff = 12;
  for (let i = 0; i < chunk.length; i++) { chunk[i] = dv.getFloat32(boff, true); boff += 4; }
  const o = allocOut(N, !!m.sh);
  const hasSh = expandSh(o, N, m.sh);
  const un = (v, bits) => (v & ((1 << bits) - 1)) / ((1 << bits) - 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const S2 = Math.SQRT2;
  let off = boff;
  for (let i = 0; i < N; i++) {
    const pp = dv.getUint32(off, true), pr = dv.getUint32(off + 4, true);
    const ps = dv.getUint32(off + 8, true), pc = dv.getUint32(off + 12, true); off += 16;
    const ci = Math.floor(i / 256) * cstride;
    const cx = lerp(chunk[ci], chunk[ci + 3], un(pp >>> 21, 11));
    const cy = lerp(chunk[ci + 1], chunk[ci + 4], un(pp >>> 11, 10));
    const cz = lerp(chunk[ci + 2], chunk[ci + 5], un(pp, 11));
    const a = (un(pr >>> 20, 10) - 0.5) * S2, b = (un(pr >>> 10, 10) - 0.5) * S2, c = (un(pr, 10) - 0.5) * S2;
    const dd = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const li = pr >>> 30;
    let qx, qy, qz, qw;
    if (li === 0) { qx = a; qy = b; qz = c; qw = dd; }
    else if (li === 1) { qx = dd; qy = b; qz = c; qw = a; }
    else if (li === 2) { qx = b; qy = dd; qz = c; qw = a; }
    else { qx = b; qy = c; qz = dd; qw = a; }
    const sx = Math.exp(lerp(chunk[ci + 6], chunk[ci + 9], un(ps >>> 21, 11)));
    const sy = Math.exp(lerp(chunk[ci + 7], chunk[ci + 10], un(ps >>> 11, 10)));
    const sz = Math.exp(lerp(chunk[ci + 8], chunk[ci + 11], un(ps, 11)));
    const r = lerp(chunk[ci + 12], chunk[ci + 15], un(pc >>> 24, 8));
    const g = lerp(chunk[ci + 13], chunk[ci + 16], un(pc >>> 16, 8));
    const bl = lerp(chunk[ci + 14], chunk[ci + 17], un(pc >>> 8, 8));
    const al = un(pc, 8);
    emitSlab(o, i, cx, cy, cz, sx, sy, sz, qx, qy, qz, qw, r, g, bl, al);
  }
  postDecoded(m.file, N, o, hasSh);
}

self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "decode") await decodeSOG(m);
  else if (m.type === "decodeFQ") decodeFQ(m);
};
`,ee=c=>Array.isArray(c)?c:Object.keys(c).sort((e,t)=>+e-+t).map(e=>c[e]);async function Jo(c,e){const t=e??(_=>fetch(_)),s=await(await t(`${c}/meta.json`)).json(),n=s.count,o=ee(s.means.files),r=ee(s.scales.files),a=ee(s.quats.files),i=ee(s.sh0.files),l=async _=>(await t(`${c}/${_}`)).arrayBuffer(),[u,h,d,f,p]=await Promise.all([l(o[0]),l(o[1]),l(r[0]),l(a[0]),l(i[0])]),x=ee(s.means.mins),g=ee(s.means.maxs);return{count:n,mins:[x[0],x[1],x[2]],maxs:[g[0],g[1],g[2]],scalesCodebook:Float32Array.from(ee(s.scales.codebook)),sh0Codebook:Float32Array.from(ee(s.sh0.codebook)),webp:{meansL:u,meansU:h,scales:d,quats:f,sh0:p}}}function Zo(c,e,t,s,n){const o=Math.max(c[0]-t,0,t-e[0]),r=Math.max(c[1]-s,0,s-e[1]),a=Math.max(c[2]-n,0,n-e[2]);return Math.hypot(o,r,a)}function er(c,e,t,s){if(c<e)return 0;let n=Math.floor(Math.log(c/e)/Math.log(t))+1;return Math.max(0,Math.min(s,n))}class tr{free;constructor(e){this.free=[{start:0,rows:e}]}alloc(e){for(let t=0;t<this.free.length;t++){const s=this.free[t];if(s.rows>=e){const n=s.start;return s.rows===e?this.free.splice(t,1):(s.start+=e,s.rows-=e),n}}return-1}free_(e,t){const s={start:e,rows:t};let n=0;for(;n<this.free.length&&this.free[n].start<e;)n++;this.free.splice(n,0,s),n>0&&this.free[n-1].start+this.free[n-1].rows===s.start&&(this.free[n-1].rows+=s.rows,this.free.splice(n,1),n--),n+1<this.free.length&&this.free[n].start+this.free[n].rows===this.free[n+1].start&&(this.free[n].rows+=this.free[n+1].rows,this.free.splice(n+1,1))}}const sr=6e6,is=8421504;class gt{object=new Ce;center=new I;radius;total;nCells;_budget;_texH;_texLen;_mesh;_geo;_mat;_aIndex;_idxArr;_texCenter;_texCovA;_texCovB;_texColor;_bufCenter;_bufCovA;_bufCovB;_bufColor;_shBands;_texSH=null;_bufSH=null;_worker;_workerUrl;_unpackerPool=[];_decodeWorkerUrl;_freeDecodeWorkers=[];_decodeWaiters=[];_disposed=!1;_uViewport={value:new se(1,1)};_uFocal={value:new se};_uMinPx={value:3};_uOrtho={value:0};_listing;_fetchFn;_rootAddress;_alloc;_resident=new Map;_fetching=new Set;_fetchQueue=[];_maxFetches;_uploadDirty=!1;_dirtyRowMin=1/0;_dirtyRowMax=-1;_glReady=!1;_base;_mult=2;_visN=0;_sortMs=0;_sortPending=!1;_version=0;_frame=0;_visLeaves=0;_lastRangesKey="";_dirty=!1;_wantRanges=new Int32Array(0);_wantDir=[0,0,1];_fwd=new I;_lastDir=new I(0,0,1);_frustum=new ws;_pvm=new Q;_mInv=new Q;_nrm3=new vs;_camLocal=new I;_box=new ze;static async create(e,t,s){const n=t??(l=>fetch(l)),o=e.replace(/\/$/,""),r=await n(`${o}/lod-meta.json`),a=await r.text();if(!r.ok||a.trimStart().startsWith("<"))throw new Error(`[SplatLoader] no splat manifest at ${o}/lod-meta.json (HTTP ${r.status}${a.trimStart().startsWith("<")?", got HTML":""}) — does that dataset folder exist?`);const i=JSON.parse(a);return new gt(nr(i),o,t,s)}constructor(e,t,s,n){this._listing=e,this._rootAddress=t.replace(/\/$/,""),this._fetchFn=s,this._budget=Math.max(k,n?.budget??sr),this._maxFetches=n?.maxConcurrentFetches??3,this.nCells=e.leaves.length,this.total=e.counts?.[0]??e.leaves.reduce((i,l)=>i+(l.lods[0]?.count??0),0);const o=e.tree.min,r=e.tree.max;this.center.set((o[0]+r[0])/2,(o[1]+r[1])/2,(o[2]+r[2])/2),this.radius=Math.hypot(r[0]-o[0],r[1]-o[1],r[2]-o[2])/2||1,this._base=this.radius*.55,this._texH=Math.ceil(this._budget/k),this._texLen=k*this._texH,this._bufCenter=new Float32Array(this._texLen*4),this._bufCovA=new Uint16Array(this._texLen*4),this._bufCovB=new Uint16Array(this._texLen*4),this._bufColor=new Uint8Array(this._texLen*4),this._texCenter=this._mkTex(this._bufCenter,Be),this._texCovA=this._mkTex(this._bufCovA,De),this._texCovB=this._mkTex(this._bufCovB,De),this._texColor=this._mkTex(this._bufColor,Ss),this._texColor.colorSpace=Le,this._shBands=e.shFilenames?.length?e.shBands??0:0,this._shBands>0&&(this._bufSH=new Uint32Array(this._texLen*4).fill(is),this._texSH=new ie(this._bufSH,k,this._texH,lt,ut),this._texSH.minFilter=this._texSH.magFilter=X,this._texSH.colorSpace=Le,this._texSH.needsUpdate=!0),this._mat=Is({texCenter:this._texCenter,texCovA:this._texCovA,texCovB:this._texCovB,texColor:this._texColor,texSH:this._texSH??void 0,shBands:this._shBands,uViewport:this._uViewport,uFocal:this._uFocal,uMinPx:this._uMinPx,uOrtho:this._uOrtho}),this._geo=ks(),this._idxArr=new Float32Array(this._budget),this._aIndex=new ft(this._idxArr,1),this._aIndex.setUsage(Ts),this._geo.setAttribute("aSlot",this._aIndex),this._geo.instanceCount=0,this._mesh=new pt(this._geo,this._mat),this._mesh.frustumCulled=!1,this._mesh.userData.splatCount=0,this.object.add(this._mesh),this._alloc=new tr(this._texH),this._workerUrl=URL.createObjectURL(new Blob([Es],{type:"application/javascript"})),this._worker=new Worker(this._workerUrl),this._worker.postMessage({type:"initBudget",budget:this._budget}),this._worker.onmessage=i=>{if(this._disposed||i.data.type!=="sorted")return;const l=new Uint32Array(i.data.order);this._visN=i.data.n,this._idxArr.set(l.subarray(0,this._visN)),this._aIndex.clearUpdateRanges(),this._aIndex.addUpdateRange(0,this._visN),this._aIndex.needsUpdate=!0,this._geo.instanceCount=this._visN,this._mesh.userData.splatCount=this._visN,this._sortMs=i.data.sortMs,this._sortPending=!1,this._dispatchSort()},this._decodeWorkerUrl=URL.createObjectURL(new Blob([Yo],{type:"application/javascript"}));const a=Math.max(1,n?.maxConcurrentFetches??2);for(let i=0;i<a;i++){const l=new Worker(this._decodeWorkerUrl);this._unpackerPool.push(l),this._freeDecodeWorkers.push(l)}}get drawn(){return this._visN}get cellsInView(){return this._visLeaves}get sortMs(){return this._sortMs}get lodBase(){return this._base}set lodBase(e){this._base=e}get shBands(){return this._shBands}get shStrength(){return this._mat.uniforms.uShStrength.value}set shStrength(e){this._mat.uniforms.uShStrength.value=Math.max(0,Math.min(1,e))}get shMaxDistance(){return this._mat.uniforms.uShMaxDist.value}set shMaxDistance(e){this._mat.uniforms.uShMaxDist.value=Math.max(0,e)}drawnByDistance=[0,0,0,0,0];get subPixelDetail(){return this._mat.uniforms.uSubPixel.value>.5}set subPixelDetail(e){this._mat.uniforms.uSubPixel.value=e?1:0}get subPixelMinAlpha(){return this._mat.uniforms.uSubMinA.value}set subPixelMinAlpha(e){this._mat.uniforms.uSubMinA.value=Math.max(0,e)}setFrameUniforms(e,t,s,n){this._uViewport.value.set(e,t);const o=s.projectionMatrix.elements;this._uFocal.value.set(o[0]*.5*e,o[5]*.5*t),this._uMinPx.value=n,this._uOrtho.value=s.isOrthographicCamera?1:0}update(e){if(this._disposed)return;this._frame++,this.object.updateMatrixWorld(),this._mInv.copy(this.object.matrixWorld).invert(),this._pvm.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse).multiply(this.object.matrixWorld),this._frustum.setFromProjectionMatrix(this._pvm),this._camLocal.copy(e.position).applyMatrix4(this._mInv),e.getWorldDirection(this._fwd),this._nrm3.getNormalMatrix(this._mInv),this._fwd.applyMatrix3(this._nrm3).normalize(),this._shBands>0&&this._mat.uniforms.uCamLocal.value.copy(this._camLocal);const t=this._listing.leaves,s=this._listing.lodLevels-1,n=this._camLocal.x,o=this._camLocal.y,r=this._camLocal.z,a=[];this._visLeaves=0;for(let h=0;h<t.length;h++){const d=t[h];if(this._box.min.set(d.min[0],d.min[1],d.min[2]),this._box.max.set(d.max[0],d.max[1],d.max[2]),!this._frustum.intersectsBox(this._box))continue;this._visLeaves++;const f=Zo(d.min,d.max,n,o,r),p=Math.min(d.lods.length-1,er(f,this._base,this._mult,Math.min(s,d.lods.length-1)));a.push({leaf:d,lodIdx:p,dist:f})}let i=0;for(const h of a)i+=h.leaf.lods[h.lodIdx].count;if(i>this._budget){const h=a.slice().sort((f,p)=>p.dist-f.dist);let d=0;for(;i>this._budget&&d++<t.length*s+1;){let f=!1;for(const p of h){if(i<=this._budget)break;if(p.lodIdx<p.leaf.lods.length-1){const x=p.leaf.lods[p.lodIdx].count;p.lodIdx++,i+=p.leaf.lods[p.lodIdx].count-x,f=!0}}if(!f)break}}const l=new Set,u=[];this.drawnByDistance.fill(0);for(const h of a){const d=h.leaf.lods[h.lodIdx];l.add(d.file);let f=this._resident.has(d.file)?h.lodIdx:-1;if(f<0){let _=1/0;for(let b=h.leaf.lods.length-1;b>=0;b--){if(!this._resident.has(h.leaf.lods[b].file))continue;const m=Math.abs(b-h.lodIdx);m<_&&(_=m,f=b)}}if(f<0)continue;const p=h.leaf.lods[f],x=this._resident.get(p.file);x.lastWantedFrame=this._frame,u.push({file:p.file,slabStart:x.rowBegins*k+p.offset,count:p.count});const g=h.dist<25?0:h.dist<50?1:h.dist<100?2:h.dist<200?3:4;this.drawnByDistance[g]+=p.count}for(const h of l)this._resident.has(h)||this._fetching.has(h)||this._fetchQueue.includes(h)||this._fetchQueue.push(h);this._pumpFetches(l),this._maybeSort(u)}flushUploads(e){if(this._disposed||!this._uploadDirty)return;this._glReady||(e.initTexture(this._texCenter),e.initTexture(this._texCovA),e.initTexture(this._texCovB),e.initTexture(this._texColor),this._texSH&&e.initTexture(this._texSH),this._glReady=!0);const t=this._dirtyRowMin,s=this._dirtyRowMax-this._dirtyRowMin+1;s>0&&(this._subUpload(e,this._texCenter,this._bufCenter,t,s,4),this._subUpload(e,this._texCovA,this._bufCovA,t,s,4),this._subUpload(e,this._texCovB,this._bufCovB,t,s,4),this._subUpload(e,this._texColor,this._bufColor,t,s,4),this._texSH&&this._bufSH&&this._subUpload(e,this._texSH,this._bufSH,t,s,4)),this._uploadDirty=!1,this._dirtyRowMin=1/0,this._dirtyRowMax=-1}dispose(){this._disposed=!0,this._worker.terminate(),URL.revokeObjectURL(this._workerUrl);for(const e of this._unpackerPool)e.terminate();this._unpackerPool.length=0,this._freeDecodeWorkers.length=0;for(const e of this._decodeWaiters.splice(0))e(void 0);URL.revokeObjectURL(this._decodeWorkerUrl),this.object.remove(this._mesh),this._geo.dispose(),this._mat.dispose(),this._texCenter.dispose(),this._texCovA.dispose(),this._texCovB.dispose(),this._texColor.dispose(),this._texSH?.dispose()}_mkTex(e,t){const s=new ie(e,k,this._texH,Ue,t);return s.minFilter=s.magFilter=X,s.needsUpdate=!0,s}_subUpload(e,t,s,n,o,r,a=k){const l=e.properties?.get?.(t)?.__webglTexture,u=l?e.getContext():null;if(!l||!u){t.needsUpdate=!0;return}const h=this._glFormatType(u,t.type),d=t.format===lt?u.RGBA_INTEGER:u.RGBA,f=s.subarray(n*a*r,(n+o)*a*r),p=u.getParameter(u.UNPACK_FLIP_Y_WEBGL);u.bindTexture(u.TEXTURE_2D,l),u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL,!1),u.texSubImage2D(u.TEXTURE_2D,0,0,n,a,o,d,h.type,f),u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL,p)}_glFormatType(e,t){return t===Be?{type:e.FLOAT}:t===De?{type:e.HALF_FLOAT}:t===ut?{type:e.UNSIGNED_INT}:{type:e.UNSIGNED_BYTE}}_pumpFetches(e){for(;this._fetching.size<this._maxFetches&&this._fetchQueue.length;){const t=this._fetchQueue.shift();this._resident.has(t)||this._fetching.has(t)||e.has(t)&&(this._fetching.add(t),this._fetchChunk(t))}}_acquireDecodeWorker(){const e=this._freeDecodeWorkers.pop();return e?Promise.resolve(e):new Promise(t=>this._decodeWaiters.push(t))}_releaseDecodeWorker(e){const t=this._decodeWaiters.shift();t?t(e):this._freeDecodeWorkers.push(e)}async _fetchChunk(e){try{const t=this._listing.filenames[e],s=this._listing.format==="fq";let n=null,o=null,r=null;if(s){const d=this._fetchFn??(p=>fetch(p)),f=this._shBands>0?this._listing.shFilenames?.[e]:void 0;[o,r]=await Promise.all([d(`${this._rootAddress}/${t}`).then(p=>p.arrayBuffer()),f?d(`${this._rootAddress}/${f}`).then(p=>p.ok?p.arrayBuffer():null).catch(()=>null):Promise.resolve(null)])}else{const d=t.replace(/\/meta\.json$/,"");n=await Jo(`${this._rootAddress}/${d}`,this._fetchFn)}if(this._disposed)return;const a=await this._acquireDecodeWorker();if(this._disposed||!a)return;const i=await new Promise(d=>{const f=p=>{p.data?.type!=="decoded"||p.data.file!==e||(a.removeEventListener("message",f),d(p.data))};if(a.addEventListener("message",f),s){const p=[o];r&&p.push(r),a.postMessage({type:"decodeFQ",file:e,bytes:o,sh:r},p)}else{const p=n;a.postMessage({type:"decode",file:e,count:p.count,mins:p.mins,maxs:p.maxs,scalesCodebook:p.scalesCodebook,sh0Codebook:p.sh0Codebook,webp:p.webp},[p.webp.meansL,p.webp.meansU,p.webp.scales,p.webp.quats,p.webp.sh0])}});if(this._releaseDecodeWorker(a),this._disposed||!i)return;const l=i.count,u=Math.ceil(l/k);let h=this._alloc.alloc(u);if(h<0&&(this._evictUntil(u,e),h=this._alloc.alloc(u)),h<0)return;this._bakeDecoded(i,h,u),this._resident.set(e,{rowBegins:h,rows:u,splatCount:l,lastWantedFrame:this._frame}),this._worker.postMessage({type:"addChunk",slabStart:h*k,centers:i.centers},[i.centers])}finally{this._fetching.delete(e)}}_evictUntil(e,t){if(this._freeRowsAtLeast(e))return;const s=[...this._resident.entries()].filter(([n,o])=>n!==t&&o.lastWantedFrame!==this._frame).sort((n,o)=>n[1].lastWantedFrame-o[1].lastWantedFrame);for(const[n,o]of s)if(this._alloc.free_(o.rowBegins,o.rows),this._resident.delete(n),this._worker.postMessage({type:"removeChunk",slabStart:o.rowBegins*k}),this._freeRowsAtLeast(e))break}_freeRowsAtLeast(e){const t=this._alloc.alloc(e);return t>=0?(this._alloc.free_(t,e),!0):!1}_bakeDecoded(e,t,s){const n=t*k*4;if(this._bufCenter.set(new Float32Array(e.center),n),this._bufCovA.set(new Uint16Array(e.covA),n),this._bufCovB.set(new Uint16Array(e.covB),n),this._bufColor.set(new Uint8Array(e.color),n),this._bufSH){const o=t*k*4;e.sh?this._bufSH.set(new Uint32Array(e.sh),o):this._bufSH.fill(is,o,o+s*k*4)}this._uploadDirty=!0,t<this._dirtyRowMin&&(this._dirtyRowMin=t),t+s-1>this._dirtyRowMax&&(this._dirtyRowMax=t+s-1)}_maybeSort(e){const t=new Int32Array(e.length*2);let s="";for(let o=0;o<e.length;o++)t[o*2]=e[o].slabStart,t[o*2+1]=e[o].count,s+=e[o].slabStart+":"+e[o].count+"|";const n=this._fwd.dot(this._lastDir)<.9995;s===this._lastRangesKey&&!n||(this._lastRangesKey=s,this._lastDir.copy(this._fwd),this._wantRanges=t,this._wantDir=[this._fwd.x,this._fwd.y,this._fwd.z],this._dirty=!0,this._dispatchSort())}_dispatchSort(){this._sortPending||!this._dirty||(this._dirty=!1,this._sortPending=!0,this._version++,this._worker.postMessage({type:"sortActive",dir:this._wantDir,ranges:this._wantRanges.buffer.slice(0),version:this._version}))}}function nr(c){const e=[],t=n=>{const o=n.bound.min,r=n.bound.max,a=[o[0],-r[1],-r[2]],i=[r[0],-o[1],-o[2]];if(n.children)return{min:a,max:i,children:n.children.map(t)};const l=[];for(const h of Object.keys(n.lods).sort((d,f)=>+d-+f))l[+h]=n.lods[h];const u=e.length;return e.push({min:a,max:i,lods:l}),{min:a,max:i,leaf:u}},s=t(c.tree);return{filenames:c.filenames,leaves:e,tree:s,lodLevels:c.lodLevels,counts:c.counts,format:c.format,shBands:c.shBands,shFilenames:c.shFilenames}}const rt=.28209479177387814,or=c=>1/(1+Math.exp(-c));function rr(c){const e=new Uint8Array(c),t=Ps(e),n=new TextDecoder().decode(e.subarray(0,t)).split(/\r?\n/);let o=0;const r=[];for(const M of n){const C=M.match(/^element vertex (\d+)/);C&&(o=parseInt(C[1],10));const D=M.match(/^property float (\S+)/);D&&r.push(D[1])}if(!o)throw new Error("no vertices in ply");const a=r.length*4,i={};r.forEach((M,C)=>{i[M]=C*4});const l=M=>{if(!(M in i))throw new Error(`missing property ${M}`);return i[M]},u=l("x"),h=l("y"),d=l("z"),f=l("scale_0"),p=l("scale_1"),x=l("scale_2"),g=l("rot_0"),_=l("rot_1"),b=l("rot_2"),m=l("rot_3"),v=l("opacity"),E=l("f_dc_0"),L=l("f_dc_1"),w=l("f_dc_2"),y=new DataView(c,t),T=new Float32Array(o*3),R=new Float32Array(o*3),S=new Float32Array(o*4),N=new Float32Array(o*4);for(let M=0;M<o;M++){const C=M*a;T[M*3]=y.getFloat32(C+u,!0),T[M*3+1]=y.getFloat32(C+h,!0),T[M*3+2]=y.getFloat32(C+d,!0),R[M*3]=Math.exp(y.getFloat32(C+f,!0)),R[M*3+1]=Math.exp(y.getFloat32(C+p,!0)),R[M*3+2]=Math.exp(y.getFloat32(C+x,!0));const D=y.getFloat32(C+g,!0),z=y.getFloat32(C+_,!0),ge=y.getFloat32(C+b,!0),le=y.getFloat32(C+m,!0),H=Math.hypot(D,z,ge,le)||1;S[M*4]=z/H,S[M*4+1]=ge/H,S[M*4+2]=le/H,S[M*4+3]=D/H,N[M*4]=pe(.5+rt*y.getFloat32(C+E,!0)),N[M*4+1]=pe(.5+rt*y.getFloat32(C+L,!0)),N[M*4+2]=pe(.5+rt*y.getFloat32(C+w,!0)),N[M*4+3]=or(y.getFloat32(C+v,!0))}return{count:o,centers:T,scales:R,quats:S,colors:N}}function pe(c){return c<0?0:c>1?1:c}function ir(c){for(let e=0;e<c.count;e++){c.centers[e*3+1]=-c.centers[e*3+1],c.centers[e*3+2]=-c.centers[e*3+2];const t=c.quats[e*4],s=c.quats[e*4+1],n=c.quats[e*4+2],o=c.quats[e*4+3];c.quats[e*4]=o,c.quats[e*4+1]=-n,c.quats[e*4+2]=s,c.quats[e*4+3]=-t}}function ar(c){const e=new Uint8Array(c),t=Ps(e),s=new TextDecoder().decode(e.subarray(0,t)),n=[];for(const f of s.split(/\r?\n/)){const p=f.match(/^element\s+(\S+)\s+(\d+)/);if(p){n.push({name:p[1],count:parseInt(p[2],10),props:[]});continue}const x=f.match(/^property\s+\S+\s+(\S+)/);x&&n.length&&n[n.length-1].props.push(x[1])}const o=n.find(f=>f.name==="chunk"),r=n.find(f=>f.name==="vertex");if(!o||!r)throw new Error("not a compressed.ply (missing chunk/vertex element)");const a=o.props.length,i=o.props.includes("min_r"),l=r.count,u=new DataView(c);let h=t;const d=new Float32Array(o.count*a);for(let f=0;f<d.length;f++)d[f]=u.getFloat32(h,!0),h+=4;return Fs(u,h,l,d,a,i)}function Fs(c,e,t,s,n,o){const r=new Float32Array(t*3),a=new Float32Array(t*3),i=new Float32Array(t*4),l=new Float32Array(t*4),u=(p,x,g)=>p+(x-p)*g,h=(p,x)=>(p&(1<<x)-1)/((1<<x)-1),d=Math.SQRT2;let f=e;for(let p=0;p<t;p++){const x=c.getUint32(f,!0),g=c.getUint32(f+4,!0),_=c.getUint32(f+8,!0),b=c.getUint32(f+12,!0);f+=16;const m=Math.floor(p/256)*n;r[p*3]=u(s[m],s[m+3],h(x>>>21,11)),r[p*3+1]=u(s[m+1],s[m+4],h(x>>>11,10)),r[p*3+2]=u(s[m+2],s[m+5],h(x,11));const v=(h(g>>>20,10)-.5)*d,E=(h(g>>>10,10)-.5)*d,L=(h(g,10)-.5)*d,w=Math.sqrt(Math.max(0,1-(v*v+E*E+L*L))),y=g>>>30;y===0?(i[p*4]=v,i[p*4+1]=E,i[p*4+2]=L,i[p*4+3]=w):y===1?(i[p*4]=w,i[p*4+1]=E,i[p*4+2]=L,i[p*4+3]=v):y===2?(i[p*4]=E,i[p*4+1]=w,i[p*4+2]=L,i[p*4+3]=v):(i[p*4]=E,i[p*4+1]=L,i[p*4+2]=w,i[p*4+3]=v),a[p*3]=Math.exp(u(s[m+6],s[m+9],h(_>>>21,11))),a[p*3+1]=Math.exp(u(s[m+7],s[m+10],h(_>>>11,10))),a[p*3+2]=Math.exp(u(s[m+8],s[m+11],h(_,11)));const T=h(b>>>24,8),R=h(b>>>16,8),S=h(b>>>8,8);l[p*4]=pe(o?u(s[m+12],s[m+15],T):T),l[p*4+1]=pe(o?u(s[m+13],s[m+16],R):R),l[p*4+2]=pe(o?u(s[m+14],s[m+17],S):S),l[p*4+3]=h(b,8)}return{count:t,centers:r,scales:a,quats:i,colors:l}}function cr(c){const e=new DataView(c);if(e.getUint32(0,!1)!==1179730737)throw new Error("not an FQC1 chunk");const t=e.getUint32(4,!0),s=e.getUint32(8,!0),n=18,o=new Float32Array(s*n);let r=12;for(let a=0;a<o.length;a++)o[a]=e.getFloat32(r,!0),r+=4;return Fs(e,r,t,o,n,!0)}function Ps(c){const e="end_header",t=Math.min(c.length,65536);for(let s=0;s<t;s++){let n=!0;for(let o=0;o<e.length;o++)if(c[s+o]!==e.charCodeAt(o)){n=!1;break}if(n){let o=s+e.length;for(;o<c.length&&c[o]!==10;)o++;return o+1}}throw new Error("end_header not found")}class _t extends Gn{static uuid="b2f7d4e3-8a5c-4b02-ad3f-4e6a9c1b7f25";onDisposed=new Jt;onSplatLoaded=new Jt;list=new Map;minPixelSize=3;subPixelDetail=!1;subPixelMinAlpha=.1;lodQuality=.55;shStrength=1;shMaxDistance=0;_world=null;_enabled=!0;_wired=!1;_webgpu=!1;_scene=new Yt;_splats=new Map;_placements=new Map;_gaussianScale=1;_pickPicker=null;_pickContributor=null;_pickDepthMats=new Map;_collisionScene=new Yt;_collisions=new Map;_clipScratch=Array.from({length:8},()=>new Oe);_scratchPlane=new Nn;constructor(e){super(e),e.add(_t.uuid,this)}set world(e){e!==this._world&&(this._unwire(),this._world=e,e&&this._enabled&&this._wire())}get world(){return this._world}set enabled(e){e!==this._enabled&&(this._enabled=e,e&&this._world?this._wire():this._unwire())}get enabled(){return this._enabled}get splatCount(){let e=0;for(const t of this._splats.values())e+=t.drawn;return e}get gaussianScale(){return this._gaussianScale}set gaussianScale(e){this._gaussianScale=Math.max(.01,e);for(const t of this._splats.keys())this._place(t)}async load(e,t){if(!this._world)throw new Error("SplatLoader: set `world` before calling load().");if(!this._renderer())throw new Error("SplatLoader: the world's renderer is not a PostproductionRenderer.");this._renderer().three.isWebGPURenderer&&(await Po(),this._webgpu=!0);const s=typeof e=="string"?{url:e}:e,n=this._manifestUrl(s),o=t?.id??s.url??s.lodUrls?.[0]??n??`splat-${this._splats.size}`;let r;if(n){const u=n.replace(/\/?lod-meta\.json$/,""),h=this._manifestFetchFn(s);this.remove(o),r=await gt.create(u,h,{budget:s.streamBudget})}else{const u=await this._decodeSource(s);if(!u.length)throw new Error("SplatLoader: no splat data decoded from source.");this.remove(o),r=new Qo(u)}this._scene.add(r.object),this._splats.set(o,r);const a=t?.transform?t.transform.clone():new Q().setPosition(t?.anchor??new I);this._placements.set(o,a);const i=new I().setFromMatrixPosition(a),l={id:o,streamed:!1,anchor:i,box:new ze,object:r,get splatCount(){return r.drawn}};return this.list.set(o,l),this._place(o),this.onSplatLoaded.trigger(l),l}_place(e){const t=this._splats.get(e),s=this._placements.get(e);if(!t||!s)return;s.decompose(t.object.position,t.object.quaternion,t.object.scale),t.object.scale.multiplyScalar(this._gaussianScale),t.object.updateMatrix(),t.object.updateMatrixWorld(!0);const n=this._collisions.get(e);n&&(s.decompose(n.position,n.quaternion,n.scale),n.scale.multiplyScalar(this._gaussianScale),n.updateMatrixWorld(!0));const o=this.list.get(e);o&&o.box.setFromCenterAndSize(t.center,new I(t.radius*2,t.radius*2,t.radius*2)).applyMatrix4(t.object.matrixWorld)}remove(e){const t=this._splats.get(e);t&&(this._scene.remove(t.object),t.dispose(),this._splats.delete(e)),this.removeCollisionProxy(e),this._placements.delete(e),this.list.delete(e)}setTransform(e,t){const s=n=>{this._splats.has(n)&&(this._placements.set(n,e.clone()),this._place(n))};if(t)s(t);else for(const n of this._splats.keys())s(n)}getTransform(e){const t=e??this._splats.keys().next().value;if(!t)return null;const s=this._placements.get(t);return s?s.clone():null}async setCollisionProxy(e,t){if(!this._splats.has(e))throw new Error(`[splat] setCollisionProxy: no splat "${e}"`);if(!this._world)throw new Error("[splat] setCollisionProxy: no world");const s=new Zn,o=(t.bytes?await new Promise((l,u)=>s.parse(t.bytes,"",l,u)):await s.loadAsync(t.url)).scene,a=this.components.get(Zt).get(this._world).depthPackBody,i=new Un({blending:Dn,depthTest:!0,depthWrite:!0,side:ke,vertexShader:`
        precision highp float;
        void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
        precision highp float;
        void main(){ ${a} gl_FragColor = packedDepth; }`});o.traverse(l=>{l.isMesh&&(l.material=i,l.frustumCulled=!1)}),this.removeCollisionProxy(e),this._collisions.set(e,o),this._collisionScene.add(o),this._place(e)}removeCollisionProxy(e){const t=this._collisions.get(e);t&&(this._collisionScene.remove(t),t.traverse(s=>{s.isMesh&&(s.geometry?.dispose?.(),s.material?.dispose?.())}),this._collisions.delete(e))}dispose(){this._unwire();for(const e of[...this._splats.keys()])this.remove(e);this._world=null,this.onSplatLoaded.reset(),this.onDisposed.trigger(),this.onDisposed.reset()}_manifestUrl(e){return e.manifestUrl?e.manifestUrl:e.url&&/lod-meta\.json$/.test(e.url)?e.url:null}_manifestFetchFn(e){const t=e.requestManager;if(t)return async s=>t.fetch(await t.getUrl(s))}async _decodeSource(e){const t=async s=>{if(e.requestManager){const o=await e.requestManager.getUrl(s),r=await e.requestManager.fetch(o);return new Uint8Array(await r.arrayBuffer())}const n=await fetch(s);if(!n.ok)throw new Error(`fetch ${s} → HTTP ${n.status}`);return new Uint8Array(await n.arrayBuffer())};if(e.lodUrls?.length){const s=[];for(const n of e.lodUrls)s.push(this._decodeBytes(await t(n)));return s}return e.fileBytes?[this._decodeBytes(e.fileBytes)]:e.url?[this._decodeBytes(await t(e.url))]:[]}_decodeBytes(e){const t=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength);let s;if(e.length>=4&&e[0]===70&&e[1]===81&&e[2]===67&&e[3]===49)s=cr(t);else{const n=new TextDecoder().decode(e.subarray(0,Math.min(e.length,2048)));s=/element\s+chunk\s+\d+/.test(n)?ar(t):rr(t)}return ir(s),s}_renderer(){const e=this._world?.renderer;return e&&e.postproduction&&e.onBeforeUpdate?e:null}_wire(){if(this._wired)return;const e=this._renderer();e&&(e.postproduction.addOcclusionPass(this._occlusion,!1),this._registerPickContributor(),this._wired=!0)}_unwire(){if(!this._wired)return;const e=this._renderer();e&&e.postproduction.removeOcclusionPass(this._occlusion),this._unregisterPickContributor(),this._wired=!1}_registerPickContributor(){if(!this._world||this._pickContributor)return;const e=this.components.get(Zt).get(this._world);this._pickPicker=e,this._pickContributor=({renderer:t,camera:s})=>this._renderPickDepth(t,s),e.pickDepthContributors.add(this._pickContributor)}_unregisterPickContributor(){this._pickPicker&&this._pickContributor&&this._pickPicker.pickDepthContributors.delete(this._pickContributor),this._pickPicker=null,this._pickContributor=null;for(const e of this._pickDepthMats.values())e.dispose();this._pickDepthMats.clear()}_renderPickDepth(e,t){if(!this._pickPicker||this._splats.size===0||this._webgpu&&this._collisions.size===0)return;if(this._collisions.size>0){this._collisionScene.updateMatrixWorld(!0),e.render(this._collisionScene,t);return}const s=this._pickPicker.depthPackBody;this._scene.updateMatrixWorld(!0);const n=[],o=new Set;this._scene.traverse(r=>{if(!r.isMesh)return;const a=r,i=a.material;if(!i||!i.uniforms)return;o.add(a.uuid);let l=this._pickDepthMats.get(a.uuid);l||(l=Ko(i.uniforms,s),this._pickDepthMats.set(a.uuid,l)),n.push([a,a.material]),a.material=l}),e.render(this._scene,t);for(const[r,a]of n)r.material=a;for(const[r,a]of this._pickDepthMats)o.has(r)||(a.dispose(),this._pickDepthMats.delete(r))}_occlusion=e=>{if(!this._enabled||this._splats.size===0)return;const t=e.camera;for(const s of this._splats.values())s.lodBase=this.lodQuality*s.radius,s.shBands&&(s.shStrength=this.shStrength,s.shMaxDistance=this.shMaxDistance),s.subPixelDetail!==void 0&&(s.subPixelDetail=this.subPixelDetail,s.subPixelMinAlpha=this.subPixelMinAlpha),s.setFrameUniforms(e.width,e.height,t,this.minPixelSize),s.update(t),s.flushUploads?.(e.renderer);if(this._updateClipUniforms(t),this._webgpu){const s=e.sceneDepth;s&&this._scene.traverse(n=>{const o=n.material?.uniforms;o?.sceneDepth&&(o.sceneDepth.value=s)})}this._scene.updateMatrixWorld(!0),e.renderer.setRenderTarget(e.target),e.renderer.render(this._scene,t)};_updateClipUniforms(e){const t=this._world?.renderer,s=t?.clippingPlanes??[],n=t?.three?.clippingPlanes??[],o=s.length?s:n,r=Math.min(o.length,8);for(let a=0;a<r;a++){const i=this._scratchPlane.copy(o[a]).applyMatrix4(e.matrixWorldInverse);this._clipScratch[a].set(-i.normal.x,-i.normal.y,-i.normal.z,i.constant)}this._scene.traverse(a=>{const l=a.material?.uniforms;if(!(!l?.uCutPlanes||!l.uNumClip)){for(let u=0;u<r;u++)l.uCutPlanes.value[u].copy(this._clipScratch[u]);l.uNumClip.value=r}})}}const ne=new qn,lr=ne.get(jn),P=lr.create();P.scene=new Vn(ne);P.scene.setup();P.scene.three.background=null;const xt=document.getElementById("container");P.renderer=new Xn(ne,xt);P.camera=new Kn(ne);ne.init();const ur=ne.get(Wn),Ns=ur.create(P);Ns.config.color.set(6710886);P.renderer.postproduction.enabled=!0;P.renderer.postproduction.mode=$n.DEFERRED;P.renderer.postproduction.style=Qn.COLOR_PEN_SHADOWS;P.renderer.postproduction.basePass.isolatedMaterials.push(Ns.material);P.dynamicAnchor=!1;const hr=await As.getWorker(),ce=ne.get(As);ce.init(hr);P.camera.controls.addEventListener("update",()=>ce.core.update());P.onCameraChanged.add(c=>{for(const[,e]of ce.list)e.useCamera(c.three);ce.core.update(!0)});const Us=[];ce.list.onItemSet.add(({value:c})=>{c.useCamera(P.camera.three),P.scene.three.add(c.object),Us.push(c.object),ce.core.update(!0)});const dr=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");await ce.core.load(await dr.arrayBuffer(),{modelId:"school_arq"});const B=ne.get(_t);B.world=P;let te=null;const Ds=async()=>{if(!te)return;const c=te.box.getCenter(new I),e=te.box.getSize(new I).length()/2||8;await P.camera.controls.setLookAt(c.x+e,c.y+e*.7,c.z+e,c.x,c.y,c.z,!0)},Os=async c=>{const e=new Uint8Array(await c.arrayBuffer());te&&B.remove(te.id),te=await B.load({fileBytes:e},{id:c.name}),await Ds()},fr=()=>{const c=document.createElement("input");c.type="file",c.accept=".ply",c.addEventListener("change",()=>{const e=c.files?.[0];e&&Os(e)}),c.click()};xt.addEventListener("dragover",c=>c.preventDefault());xt.addEventListener("drop",c=>{c.preventDefault();const e=c.dataTransfer?.files?.[0];e&&Os(e)});const me=new On;me.showPanel(2);document.body.append(me.dom);me.dom.style.left="0px";me.dom.style.zIndex="unset";P.renderer.onBeforeUpdate.add(()=>me.begin());P.renderer.onAfterUpdate.add(()=>me.end());Bn.init();const Bs=zn.create(()=>Hn`
  <bim-panel active label="Splat Loader" class="options-menu">

    <bim-panel-section label="Your capture">
      <bim-label style="white-space: normal">
        Pick or drop a gaussian splat .ply / .compressed.ply file.
      </bim-label>
      <bim-button label="Load splat file" @click=${fr}></bim-button>
      <bim-button label="Frame splats" @click=${()=>Ds()}></bim-button>
      <bim-label id="splat-count">No splats loaded</bim-label>
    </bim-panel-section>

    <bim-panel-section label="Settings">

      <bim-checkbox label="BIM model" checked
        @change="${({target:c})=>{for(const e of Us)e.visible=c.value}}">
      </bim-checkbox>

      <bim-checkbox label="Splats enabled" checked
        @change="${({target:c})=>{B.enabled=c.value}}">
      </bim-checkbox>

      <bim-number-input label="Gaussian scale" slider
        value="${B.gaussianScale}" min="0.01" max="200" step="0.01"
        @change="${({target:c})=>{B.gaussianScale=c.value}}">
      </bim-number-input>

      <bim-number-input label="Min pixel size (cull)" slider
        value="${B.minPixelSize}" min="0" max="8" step="0.25"
        @change="${({target:c})=>{B.minPixelSize=c.value}}">
      </bim-number-input>

      <bim-number-input label="LOD distance (×radius)" slider
        value="${B.lodQuality}" min="0.1" max="4" step="0.05"
        @change="${({target:c})=>{B.lodQuality=c.value}}">
      </bim-number-input>

      <bim-number-input label="View-dependent colour (SH)" slider
        value="${B.shStrength}" min="0" max="1" step="0.05"
        @change="${({target:c})=>{B.shStrength=c.value}}">
      </bim-number-input>

    </bim-panel-section>

  </bim-panel>
  `);document.body.append(Bs);const pr=Bs.querySelector("#splat-count");setInterval(()=>{if(!te)return;const c=te.object.total.toLocaleString();pr.textContent=`${B.splatCount.toLocaleString()} / ${c} gaussians`},250);
