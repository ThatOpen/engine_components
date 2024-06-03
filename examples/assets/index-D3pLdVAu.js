var Fr=Object.defineProperty;var Vr=(i,t,e)=>t in i?Fr(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var y=(i,t,e)=>(Vr(i,typeof t!="symbol"?t+"":t,e),e);import{y as Yr,f as Hs,V as _,c as F,e as Ui,z as Wr,A as Xr,E as qr,h as Kr,g as K,L as rn,Q as Zr,p as zi,o as Gr,a as bi,G as Pn,F as Qr,s as Jr,K as Ds,Y as Bs,Z as Us,_ as ta,$ as ea,a0 as Fs,a1 as Vs,a2 as Ys,a3 as ia,O as na,a4 as sa}from"./web-ifc-api-z0lP7pyY.js";import{D as Pt,J as an,C as oa,i as ra,o as aa,u as Qt,W as Ce,R as la,c as ca,B as ln}from"./index-CDtayhLQ.js";import{M as $t}from"./index-BhKBO6Dw.js";import"./import-wrapper-prod-QYycmO-A.js";import{M as ue}from"./mark-C_hqAPZ-.js";import{a as Mn,L as ha,b as ua}from"./Line2-CLLb6Jgt.js";import{G as da}from"./index-DVRunJPb.js";const di=class di{constructor(t,e){y(this,"scene");y(this,"onSelect",new Pt);y(this,"type");y(this,"selectCurve");y(this,"selectPoints");y(this,"hoverCurve");y(this,"hoverPoints");y(this,"caster",new Yr);this.scene=t,this.type=e,this.hoverCurve=this.newCurve(.003,4473924,!1),this.hoverPoints=this.newPoints(5,4473924),this.selectCurve=this.newCurve(.005,16777215,!0),this.selectPoints=this.newPoints(7,16777215)}dispose(){this.selectCurve&&this.scene.remove(this.selectCurve),this.selectCurve.material.dispose(),this.selectCurve.geometry.dispose(),this.selectCurve=null,this.hoverCurve.material.dispose(),this.hoverCurve.geometry.dispose(),this.hoverCurve=null,this.hoverPoints.material.dispose(),this.hoverPoints.geometry.dispose(),this.selectPoints.material.dispose(),this.selectPoints.geometry.dispose(),this.scene=null}castRay(t,e,s,n){const o=new Hs,r=s.getBoundingClientRect();o.x=(t.clientX-r.left)/r.width*2-1,o.y=-((t.clientY-r.top)/r.height)*2+1,this.caster.setFromCamera(o,e);const a=this.caster.intersectObjects(n);return a.length?a[0]:null}select(t){this.highlight(t,this.selectCurve,this.selectPoints,!0),this.onSelect.trigger(t)}unSelect(){this.selectCurve.removeFromParent(),this.selectPoints.removeFromParent()}hover(t){this.highlight(t,this.hoverCurve,this.hoverPoints,!1)}unHover(){this.hoverCurve.removeFromParent(),this.hoverPoints.removeFromParent()}setResolution({x:t,y:e}){this.selectCurve.material.resolution.set(t/e,1),this.hoverCurve.material.resolution.set(t/e,1)}highlight(t,e,s,n){const{alignment:o}=t.curve;this.scene.add(e),this.scene.add(s);const r=[],a=[],l=[];for(const d of o[this.type]){const p=d.mesh.geometry.attributes.position;for(const w of p.array)r.push(w);if(n){let w;if(this.type==="absolute"){const{horizontal:E}=d.alignment;w=E[d.index].data.TYPE}else w=d.data.TYPE;const x=di.settings.colors[w]||[1,1,1];for(let E=0;E<p.count;E++)a.push(...x)}const[m,g,b]=p.array;l.push(new _(m,g,b))}const c=r[r.length-3],h=r[r.length-2],u=r[r.length-1];l.push(new _(c,h,u)),r.length/3>e.geometry.attributes.position.count&&(e.geometry.dispose(),e.geometry=new Mn),e.geometry.setPositions(r),n&&e.geometry.setColors(a),s.geometry.setFromPoints(l)}newCurve(t,e,s){const n=new Mn,o=new ha({color:e,linewidth:t,vertexColors:s,worldUnits:!1,depthTest:!1}),r=new ua(n,o);return this.scene.add(r),r}newPoints(t,e){const s=new F,n=new Ui(new Float32Array,3);s.setAttribute("position",n);const o=new Wr({size:t,color:e,sizeAttenuation:!1,depthTest:!1}),r=new Xr(s,o);return r.frustumCulled=!1,this.scene.add(r),r}};y(di,"settings",{colors:{LINE:[213/255,0/255,255/255],CIRCULARARC:[0/255,46,255/255],CLOTHOID:[0/255,255/255,0/255],PARABOLICARC:[0/255,255/255,72/255],CONSTANTGRADIENT:[213/255,0/255,255/255]}});let Ge=di;const pa=["Station","Radius","Length","InitialKP","FinalKP","KP","Slope","Height","InitialKPV","FinalKPV"],pi=class pi extends an{constructor(e){super(e);y(this,"enabled",!0);y(this,"world",null);y(this,"_list",new Map);y(this,"_markerKey",0);y(this,"type","horizontal");y(this,"divisionLength",100);e.add(pi.uuid,this)}addKPStation(e,s,n){const o=this.components.get($t),r=document.createElement("div"),a=document.createElement("div");r.appendChild(a),a.innerHTML=s,a.style.color=o.color,a.style.borderBottom="1px dotted white",a.style.width="160px",a.style.textAlign="left";const l=new ue(e,r),c=new _;c.x=n.geometry.attributes.position.getX(n.geometry.attributes.position.count-1),c.y=n.geometry.attributes.position.getY(n.geometry.attributes.position.count-1),c.z=n.geometry.attributes.position.getZ(n.geometry.attributes.position.count-1);const h=new _;h.x=n.geometry.attributes.position.getX(n.geometry.attributes.position.count-2),h.y=n.geometry.attributes.position.getY(n.geometry.attributes.position.count-2),h.z=n.geometry.attributes.position.getZ(n.geometry.attributes.position.count-2);const u=new _;u.x=(c.x+h.x)/2,u.y=(c.y+h.y)/2,u.z=(c.z+h.z)/2,l.three.position.copy(u);const d=new _;d.subVectors(c,h).normalize();const p=new Zr;p.setFromUnitVectors(new _(0,1,0),d);const m=new qr().setFromQuaternion(p).z,g=Kr.radToDeg(m);a.style.transform=`rotate(${-g-90}deg) translate(-35%, -50%)`;const b=this._markerKey.toString();o.setupEvents(e,!0),o.getWorldMarkerList(e).set(b,{label:l,key:b,merged:!1,static:!1}),this._markerKey++,this.save(b,"KP")}addVerticalMarker(e,s,n,o,r){const a=this.components.get($t),l=document.createElement("span");l.innerHTML=s,l.style.color=a.color;const c=new ue(e,l,r);if(o==="Height"){const d=document.createElement("span");d.innerHTML=s,d.style.color=a.color;const{position:p}=n.geometry.attributes,g=(p.array.length/3-1)*3,b=p.array.slice(g,g+3);c.three.position.set(b[0],b[1]+10,b[2])}else if(o==="InitialKPV"){const{position:d}=n.geometry.attributes,p=d.getX(0),m=d.getY(0),g=d.getZ(0);c.three.position.set(p-20,m,g)}else if(o==="FinalKPV"){const{position:d}=n.geometry.attributes,p=d.getX(n.geometry.attributes.position.count-1),m=d.getY(n.geometry.attributes.position.count-1),g=d.getZ(n.geometry.attributes.position.count-1);c.three.position.set(p+20,m,g)}else if(o==="Slope"){l.style.color="grey";const{position:d}=n.geometry.attributes,p=new _;p.x=d.getX(0),p.y=d.getY(0),p.z=d.getZ(0);const m=new _;m.x=d.getX(d.count-1),m.y=d.getY(d.count-1),m.z=d.getZ(d.count-1);const g=new _;g.addVectors(p,m).multiplyScalar(.5),c.three.position.set(g.x,g.y-10,g.z)}const h=this._markerKey.toString();return a.setupEvents(e,!0),a.getWorldMarkerList(e).set(h,{label:c,key:h,type:o,merged:!1,static:!1}),this._markerKey++,this.save(h,o),c}addCivilMarker(e,s,n,o){const r=this.components.get($t),a=document.createElement("span");a.innerHTML=s,a.style.color=r.color;const l=new ue(e,a);if(o==="InitialKP"){const u=n.geometry.attributes.position.getX(0),d=n.geometry.attributes.position.getY(0),p=n.geometry.attributes.position.getZ(0);l.three.position.set(u+2,d+2,p)}else if(o==="FinalKP"){const u=n.geometry.attributes.position.getX(n.geometry.attributes.position.count-1),d=n.geometry.attributes.position.getY(n.geometry.attributes.position.count-1),p=n.geometry.attributes.position.getZ(n.geometry.attributes.position.count-1);l.three.position.set(u+2,d-2,p)}else if(o==="Length"){const u=new _;u.x=n.geometry.attributes.position.getX(0),u.y=n.geometry.attributes.position.getY(0),u.z=n.geometry.attributes.position.getZ(0);const d=new _;d.x=n.geometry.attributes.position.getX(n.geometry.attributes.position.count-1),d.y=n.geometry.attributes.position.getY(n.geometry.attributes.position.count-1),d.z=n.geometry.attributes.position.getZ(n.geometry.attributes.position.count-1);const p=u.distanceTo(d);l.three.element.innerText=p.toFixed(2);const m=d.clone().add(u).divideScalar(2);l.three.position.copy(m)}const c=this._markerKey.toString();return r.setupEvents(e,!0),r.getWorldMarkerList(e).set(c,{label:l,key:c,type:o,merged:!1,static:!1}),this._markerKey++,this.save(c,o),l}showKPStations(e){if(!this.world)throw new Error("A world is needed for this component to work!");if(this.type==="horizontal"){const s=this.generateStartAndEndKP(e);for(const[,o]of s)this.addKPStation(this.world,o.value,o.normal);const n=this.generateConstantKP(e);for(const[,o]of n)this.addKPStation(this.world,o.value,o.normal)}}showCurveLength(e,s){if(!this.world)throw new Error("A world is needed for this component to work!");const n=this.components.get($t),o=e.length,r=`${s.toFixed(2)} m`,a=Math.round(o/2),l=e[a],c=n.create(this.world,r,l,!0);c!==void 0&&this.save(c,"Radius")}showLineLength(e,s){if(!this.world)throw new Error("A world is needed for this component to work!");const n=this.components.get($t),o=new _;o.x=e.geometry.getAttribute("position").getX(0),o.y=e.geometry.getAttribute("position").getY(0),o.z=e.geometry.getAttribute("position").getZ(0);const r=new _;r.x=e.geometry.getAttribute("position").getX(1),r.y=e.geometry.getAttribute("position").getY(1),r.z=e.geometry.getAttribute("position").getZ(1);const a=`${s.toFixed(2)} m`,l=new _;l.addVectors(o,r).multiplyScalar(.5);const c=n.create(this.world,a,l,!0);c!==void 0&&this.save(c,"Radius")}showCurveRadius(e,s){if(!this.world)throw new Error("A world is needed for this component to work!");const n=this.components.get($t),o=new _;o.x=e.geometry.getAttribute("position").getX(0),o.y=e.geometry.getAttribute("position").getY(0),o.z=e.geometry.getAttribute("position").getZ(0);const r=new _;r.x=e.geometry.getAttribute("position").getX(1),r.y=e.geometry.getAttribute("position").getY(1),r.z=e.geometry.getAttribute("position").getZ(1);const a=`R = ${s.toFixed(2)} m`,l=new _;l.addVectors(o,r).multiplyScalar(.5);const c=n.create(this.world,a,l,!0);c!==void 0&&this.save(c,"Radius")}deleteByType(e=pa){const s=this.components.get($t);for(const n of e){const o=this._list.get(n);if(o){for(const r of o)s.delete(r);this._list.delete(n)}}}generateStartAndEndKP(e){const{alignment:s}=e.curve,n=new Map;for(const o of s.horizontal){const r=o.getLength();if(n.size>0){const a=o.index-1,c=n.get(a).distance+r,h=o.mesh.geometry.getAttribute("position"),u=h.count-1,d=new _;d.x=h.getX(u),d.y=h.getY(u),d.z=h.getZ(u);const p=this.createNormalLine(o.mesh);n.set(o.index,{value:this.getShortendKPValue(c),distance:c,point:d,normal:p})}else{const a=o.mesh.geometry.getAttribute("position"),l=a.count-1,c=new _;c.x=a.getX(l),c.y=a.getY(l),c.z=a.getZ(l);const h=this.createNormalLine(o.mesh);n.set(o.index,{value:this.getShortendKPValue(r),distance:r,point:c,normal:h})}}return n}createNormalLine(e){const s=e.geometry.attributes.position.count-1,n=s-1,o=new _;o.x=e.geometry.attributes.position.getX(s),o.y=e.geometry.attributes.position.getY(s),o.z=e.geometry.attributes.position.getZ(s);const r=new _;r.x=e.geometry.attributes.position.getX(n),r.y=e.geometry.attributes.position.getY(n),r.z=e.geometry.attributes.position.getZ(n);const l=new _().subVectors(o,r).clone().applyAxisAngle(new _(0,0,1),Math.PI*.5).normalize(),c=new F().setFromPoints([l.clone().setLength(10).add(o),l.clone().setLength(-10).add(o)]);return new K(c)}generateConstantKP(e){const{alignment:s}=e.curve,n=new Map,o=s.getLength("horizontal"),r=Math.floor(o/this.divisionLength);for(let a=0;a<r;a++){const l=a/r,c=s.getPointAt(l,"horizontal"),h=o*l,u=this.getNormal(s,c);n.set(a,{value:this.getShortendKPValue(h),distance:h,point:c,normal:u})}return n}getNormal(e,s){const n=[],o={start:new _,end:new _};for(let h=0;h<e.horizontal.length;h++){const d=e.horizontal[h].mesh.geometry.attributes.position,p=d.count;for(let m=0;m<p;m++){const g=d.getX(m),b=d.getY(m),w=d.getZ(m);n.push(new _(g,b,w))}}for(let h=0;h<n.length-1;h++){const u=n[h],d=n[h+1],p=u.distanceTo(s),m=d.distanceTo(s),g=u.distanceTo(d);Math.abs(p+m-g)<1e-5&&(o.start=u,o.end=d)}const a=new _().subVectors(o.end,o.start).clone().applyAxisAngle(new _(0,0,1),Math.PI*.5).normalize(),l=new F().setFromPoints([a.clone().setLength(10).add(s),a.clone().setLength(-10).add(s)]);return new K(l,new rn({color:16711680}))}getShortendKPValue(e){const s=e.toFixed(2),[n,o]=s.toString().split("."),r=o||"00";if(parseInt(n,10)>1e3&&parseInt(n,10)<1e4){const[a,...l]=n;return`${a}+${l.join("")}.${r}`}if(parseInt(n,10)>1e4){const[a,l,...c]=n;return`${a}${l}+${c.join("")}.${r}`}return`0+${n.padStart(3,"0")}.${r}`}save(e,s){this._list.has(s)||this._list.set(s,new Set),this._list.get(s).add(e)}};y(pi,"uuid","0af12c32-81ee-4100-a030-e9ae546f6170");let Bt=pi;class ma extends an{constructor(e){super(e);y(this,"enabled",!0);y(this,"_highlighter");y(this,"onHighlight",new Pt);y(this,"onMarkerChange",new Pt);y(this,"mouseMarkers");y(this,"onMarkerHidden",new Pt);y(this,"_curves",[]);y(this,"_previousAlignment",null);y(this,"_world",null);y(this,"updateLinesResolution",e=>{var s;(s=this._highlighter)==null||s.setResolution(e)});y(this,"onMouseMove",e=>{var a,l,c;if(!this._world)throw new Error("No world was given for this navigator!");if(!this._world.renderer)return;const n=this._world.renderer.three.domElement.parentElement,o=this._world.camera.three,r=(a=this._highlighter)==null?void 0:a.castRay(e,o,n,this._curves);if(r){const{object:h}=r;(l=this._highlighter)==null||l.hover(h),this.updateMarker(r,"hover");return}this.mouseMarkers&&(this.mouseMarkers.hover.visible=!1),(c=this._highlighter)==null||c.unHover(),this.onMarkerHidden.trigger({type:"hover"})});y(this,"onClick",e=>{var a,l;if(!this._world)throw new Error("No world was given for this navigator!");if(!this._world.renderer)return;const n=this._world.renderer.three.domElement.parentElement,o=this._world.camera.three,r=(a=this._highlighter)==null?void 0:a.castRay(e,o,n,this._curves);if(r){const c=r,h=c.object;if((l=this._highlighter)==null||l.select(h),this.updateMarker(c,"select"),this._world.camera.hasCameraControls()&&(h.geometry.boundingBox||h.geometry.computeBoundingBox(),h.geometry.boundingBox)){const u=this.getScaledBox(h.geometry.boundingBox,2);this._world.camera.controls.fitToBox(u,!0)}this.onHighlight.trigger({mesh:h,point:c.point}),this._previousAlignment!==h.curve.alignment&&(this.components.get(Bt).showKPStations(h),this._previousAlignment=h.curve.alignment)}});y(this,"onControlsUpdated",()=>{if(!this._world)throw new Error("No world was given for this navigator!");if(!(this._world.camera.three instanceof Gr)||!this._highlighter)return;const{zoom:e,left:s,right:n,top:o,bottom:r}=this._world.camera.three,a=s-n,l=o-r,h=Math.max(a,l)/e,u=40,{caster:d}=this._highlighter;d.params.Line.threshold=h/u})}get highlighter(){if(!this._highlighter)throw new Error("Highlighter not initialized. You must set a world first!");return this._highlighter}get world(){return this._world}set world(e){var n,o,r;if(e===this._world||(this._world&&this.setupEvents(!1),this._world=e,(n=this._highlighter)==null||n.dispose(),(o=this.mouseMarkers)==null||o.hover.dispose(),(r=this.mouseMarkers)==null||r.select.dispose(),!e))return;const s=e.scene.three;this._highlighter=new Ge(s,this.view),this.mouseMarkers={select:this.newMouseMarker("#ffffff",e),hover:this.newMouseMarker("#575757",e)},this.setupEvents(!0)}async draw(e,s){if(!e.civilData)throw new Error("The provided model doesn't have civil data!");if(!this._world)throw new Error("No world was given for this navigator!");const{alignments:n}=e.civilData,o=s||n.values(),r=this._world.scene.three,a=new zi;a.makeEmpty(),a.min.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),a.max.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(const c of o){if(!c)throw new Error("Alignment not found!");for(const h of c[this.view])if(r.add(h.mesh),this._curves.push(h.mesh),!a.isEmpty())a.expandByObject(h.mesh);else{h.mesh.geometry.computeBoundingBox();const u=h.mesh.geometry.boundingBox;u instanceof zi&&a.copy(u).applyMatrix4(h.mesh.matrixWorld)}}const l=this.getScaledBox(a,1.2);this._world.camera.hasCameraControls()&&await this._world.camera.controls.fitToBox(l,!1)}async dispose(){var e;(e=this._highlighter)==null||e.dispose(),this.clear(),this.onHighlight.reset(),this._curves=[]}clear(){var e,s;(e=this._highlighter)==null||e.unSelect(),(s=this._highlighter)==null||s.unHover();for(const n of this._curves)n.removeFromParent();this._curves=[]}setMarker(e,s,n){if(!this._curves.length)return;const o=e.getCurveAt(s,this.view),r=e.getPointAt(s,this.view),{index:a}=o.curve.getSegmentAt(o.percentage);this.setMouseMarker(r,o.curve.mesh,a,n)}setDefSegments(e){const s=[],n=[],o=(r,a)=>{const l=a[1]-r[1],c=a[0]-r[0];return l/c};for(let r=0;r<e.length;r++){const a=e[r];let l,c,h,u;for(let m=0;m<Object.keys(a).length/3;m++)if(a[m*3]!==void 0&&a[m*3+1]!==void 0){l=a[m*3],c=a[m*3+1];break}for(let m=Object.keys(a).length/3-1;m>=0;m--)if(a[m*3]!==void 0&&a[m*3+1]!==void 0){h=a[m*3],u=a[m*3+1];break}const p=(o([l,c],[h,u])*100).toFixed(2);n.push({slope:p})}for(const r of e)for(let a=0;a<r.length-3;a+=3){const l=r[a],c=r[a+1],h=r[a+2],u=r[a+3],d=r[a+4],p=r[a+5];s.push({start:new _(l,c,h),end:new _(u,d,p)})}return{defSegments:s,slope:n}}hideMarker(e){this.mouseMarkers&&(this.mouseMarkers[e].visible=!1)}setupEvents(e){var o,r;if(!this._world)throw new Error("No world was given for this navigator!");if(this._world.isDisposing||!this._world.renderer)return;const n=this._world.renderer.three.domElement.parentElement;(o=this._world.renderer)==null||o.onResize.remove(this.updateLinesResolution),n.removeEventListener("mousemove",this.onMouseMove),n.removeEventListener("click",this.onClick),this._world.camera.hasCameraControls()&&this._world.camera.controls.removeEventListener("update",this.onControlsUpdated),e&&(n.addEventListener("mousemove",this.onMouseMove),n.addEventListener("click",this.onClick),(r=this._world.renderer)==null||r.onResize.add(this.updateLinesResolution),this._world.camera.hasCameraControls()&&this._world.camera.controls.addEventListener("update",this.onControlsUpdated))}newMouseMarker(e,s){if(!this._world)throw new Error("No world was given for this navigator!");const n=s.scene.three,o=document.createElement("div"),r=document.createElement("div");o.appendChild(r),r.style.backgroundColor=e,r.style.width="3rem",r.style.height="3px";const a=new ue(this._world,o,n);return a.visible=!1,a}setMouseMarker(e,s,n,o){if(n===void 0||!this.mouseMarkers)return;this.mouseMarkers[o].visible=!0;const r=this.mouseMarkers[o].three;r.position.copy(e);const a=s,{startPoint:l,endPoint:c}=a.curve.getSegment(n),h=Math.atan2(c.y-l.y,c.x-l.x),u=r.element.children[0],d=90-h/Math.PI*180;u.style.transform=`rotate(${d}deg)`}updateMarker(e,s){const{point:n,index:o,object:r}=e,a=r,l=a.curve,c=a.curve.alignment,h=c.getPercentageAt(n,this.view),u=n.clone();this.setMouseMarker(u,a,o,s),h!==null&&this.onMarkerChange.trigger({alignment:c,percentage:h,type:s,curve:l})}getScaledBox(e,s){const n=new zi,o=new _,r=new _;return e.getCenter(r),e.getSize(o),o.multiplyScalar(s),n.setFromCenterAndSize(r,o),n}}class fa{constructor(t,e,s){y(this,"components");y(this,"_scene");y(this,"_world");y(this,"offset",10);y(this,"markupLines",[]);y(this,"currentCurveMesh");y(this,"markupMaterial",new rn({color:6842472}));this.components=t,this._scene=e,this._world=s}showCurveInfo(t){switch(this.disposeMarkups(),this.currentCurveMesh=t,t.curve.data.TYPE){case"LINE":this.showLineInfo(t,this.offset);break;case"CIRCULARARC":this.showCircularArcInfo(t,this.offset);break;case"CLOTHOID":this.showClothoidInfo(t,this.offset);break;default:console.log("Unknown curve type:",t.curve.data.TYPE);break}}updateOffset(t,e,s){const o=Math.max(t.height,t.width)/(e*150);o!==this.offset&&(this.offset=o,s&&this.currentCurveMesh&&this.showCurveInfo(this.currentCurveMesh))}dispose(){for(const t of this.markupLines)t.removeFromParent();this.disposeMarkups(),this.markupMaterial.dispose()}disposeMarkups(){for(const t of this.markupLines)t.geometry.dispose(),t.removeFromParent();this.markupLines=[]}unSelect(){this.disposeMarkups()}calculateTangent(t,e){const n=e*3,o=Math.max(0,n-3),r=Math.min(t.length-3,n+3),a=new _().fromArray(t,o);return new _().fromArray(t,r).clone().sub(a).normalize()}calculateParallelCurve(t,e,s){const n=[];for(let o=0;o<e;o++){const a=this.calculateTangent(t,o).clone().applyAxisAngle(new _(0,0,1),Math.PI/2);a.normalize();const l=a.clone().multiplyScalar(s),c=o*3,h=new _().fromArray(t,c).add(l);n.push(h)}return n}calculateDimensionLines(t,e){const s=[],n=t.geometry.attributes.position.array,o=e.geometry.attributes.position.array;if(n.length<6&&o.length<6)throw new Error("Line must have at least two vertices");const r=new _(n[0],n[1],n[2]),a=new _(o[0],o[1],o[2]),l=[],c=n.length-3,h=new _(n[c],n[c+1],n[c+2]),u=o.length-3,d=new _(o[u],o[u+1],o[u+2]);return s.push(r,a),l.push(h,d),{startDimensionPoints:s,endDimensionPoints:l}}offsetDimensionLine(t,e){const n=new _().copy(t[t.length-1]).sub(t[0]).normalize().clone().multiplyScalar(e);return t.map(r=>r.clone().add(n))}showLineInfo(t,e){const s=this.components.get(Bt);s.world=this._world,s.deleteByType(["Length","Radius"]);const n=t.geometry.attributes.position.array,o=this.calculateParallelCurve(n,n.length/3,e),r=new F().setFromPoints(o),a=new K(r,this.markupMaterial);s.showLineLength(a,t.curve.getLength()),this._scene.add(a),this.markupLines.push(a);const{startDimensionPoints:l,endDimensionPoints:c}=this.calculateDimensionLines(t,a),h=this.offsetDimensionLine(l,e*.1),u=this.offsetDimensionLine(c,e*.1),d=new F().setFromPoints(h),p=new F().setFromPoints(u),m=new K(d,this.markupMaterial);this._scene.add(m),this.markupLines.push(m);const g=new K(p,this.markupMaterial);this._scene.add(g),this.markupLines.push(g)}showClothoidInfo(t,e){const s=this.components.get(Bt);s.world=this._world,s.deleteByType(["Length","Radius"]);const n=t.geometry.attributes.position.array,o=this.calculateParallelCurve(n,n.length/3,e),r=new F().setFromPoints(o);s.showCurveLength(o,t.curve.getLength());const a=new K(r,this.markupMaterial);this._scene.add(a),this.markupLines.push(a);const{startDimensionPoints:l,endDimensionPoints:c}=this.calculateDimensionLines(t,a),h=this.offsetDimensionLine(l,e*.1),u=this.offsetDimensionLine(c,e*.1),d=new F().setFromPoints(h),p=new F().setFromPoints(u),m=new K(d,this.markupMaterial);this._scene.add(m),this.markupLines.push(m);const g=new K(p,this.markupMaterial);this._scene.add(g),this.markupLines.push(g)}showCircularArcInfo(t,e){const s=this.components.get(Bt);s.world=this._world,s.deleteByType(["Length","Radius"]);const n=t.curve.data.RADIUS,o=t.geometry.attributes.position.array,r=t.geometry.attributes.position.count,a=[],l=new _(o[0],o[1],o[2]),c=(r-1)*3,h=new _(o[c],o[c+1],o[c+2]),u=r/2*3,d=new _(o[u],o[u+1],o[u+2]),p=h.clone().sub(l).normalize(),m=new _(-p.y,p.x,0);m.multiplyScalar(n);const g=d.clone().add(m);a.push(d),a.push(g);const b=new F().setFromPoints(a),w=new K(b,this.markupMaterial);s.showCurveRadius(w,Math.abs(n)),this._scene.add(w),this.markupLines.push(w);const x=[];for(let V=0;V<r;V++){const R=this.calculateTangent(o,V),U=t.curve.data.RADIUS,B=new _(R.y,-R.x,0);B.normalize(),U<0&&B.negate();const Y=B.clone().multiplyScalar(e),st=V*3,ae=new _(o[st]+Y.x,o[st+1]+Y.y,o[st+2]+Y.z);x.push(ae)}const E=new F().setFromPoints(x);s.showCurveLength(x,t.curve.getLength());const k=new K(E,this.markupMaterial);this._scene.add(k),this.markupLines.push(k);const{startDimensionPoints:L,endDimensionPoints:$}=this.calculateDimensionLines(t,k),P=this.offsetDimensionLine(L,e*.1),O=this.offsetDimensionLine($,e*.1),T=new F().setFromPoints(P),A=new F().setFromPoints(O),J=new K(T,this.markupMaterial);this._scene.add(J),this.markupLines.push(J);const H=new K(A,this.markupMaterial);this._scene.add(H),this.markupLines.push(H)}}const mi=class mi extends ma{constructor(e){super(e);y(this,"view","horizontal");y(this,"planHighlighter");this.components.add(mi.uuid,this),this.onHighlight.add(({mesh:s})=>{!this._highlighter||!this.planHighlighter||this.planHighlighter.showCurveInfo(s)})}get world(){return super.world}set world(e){var s;super.world=e,e&&((s=this.planHighlighter)==null||s.dispose(),this.planHighlighter=new fa(this.components,e.scene.three,e))}};y(mi,"uuid","3096dea0-5bc2-41c7-abce-9089b6c9431b");let Ln=mi;const fi=class fi extends an{constructor(e){super(e);y(this,"onHighlight",new Pt);y(this,"enabled",!0);y(this,"_highlighter");y(this,"mouseMarkers");y(this,"onMarkerChange",new Pt);y(this,"onMarkerHidden",new Pt);y(this,"_curves",[]);y(this,"_world",null);y(this,"updateLinesResolution",e=>{var s;(s=this.highlighter)==null||s.setResolution(e)});y(this,"onClick",e=>{if(!this.enabled||!this._highlighter)return;if(!this.world)throw new Error("No world found!");if(!this.world.renderer)return;const s=this.world.renderer.three.domElement,n=this.world.camera.three,o=this._highlighter.castRay(e,n,s,this._curves);if(o){const r=o.object;this._highlighter.select(r),this.updateMarker(o,"select");const{point:a,index:l}=o;l!==void 0&&this.onHighlight.trigger({curve:r,point:a,index:l});return}this._highlighter.unSelect(),this.mouseMarkers&&(this.mouseMarkers.hover.visible=!1),this.onMarkerHidden.trigger({type:"hover"})});y(this,"onMouseMove",async e=>{if(!this.enabled||!this._highlighter)return;if(!this.world)throw new Error("No world found!");if(!this.world.renderer)return;const s=this.world.renderer.three.domElement,n=this.world.camera.three,o=this._highlighter.castRay(e,n,s,this._curves);if(o){this._highlighter.hover(o.object),this.updateMarker(o,"hover");return}this._highlighter.unHover()});this.components.add(fi.uuid,this)}get world(){return this._world}set world(e){var n,o,r;if(e===this._world||(this._world&&this.setupEvents(!1),this._world=e,(n=this._highlighter)==null||n.dispose(),(o=this.mouseMarkers)==null||o.hover.dispose(),(r=this.mouseMarkers)==null||r.select.dispose(),!e))return;const s=e.scene.three;this._highlighter=new Ge(s,"absolute"),this.mouseMarkers={select:this.newMouseMarker("#ffffff",e),hover:this.newMouseMarker("#575757",e)},this.setupEvents(!0)}get highlighter(){if(!this._highlighter)throw new Error("Navigator not initialized!");return this._highlighter}draw(e){if(!e.civilData)throw new Error("Model must have civil data!");if(!this.world)throw new Error("A world must be given before drawing an alignment!");const s=this.world.scene.three;for(const[n,o]of e.civilData.alignments)for(const{mesh:r}of o.absolute)s.add(r),this._curves.push(r)}newMouseMarker(e,s){const n=s.scene.three,o=document.createElement("div");o.style.backgroundColor=e,o.style.width="1rem",o.style.height="1rem",o.style.borderRadius="1rem";const r=new ue(s,o,n);return r.visible=!1,r}setMarker(e,s,n){if(!this.mouseMarkers)throw new Error("No mouse markers found! Initialize the world before using this.");const o=e.getPointAt(s,"absolute");this.mouseMarkers[n].visible=!0,this.mouseMarkers[n].three.position.copy(o)}hideMarker(e){if(!this.mouseMarkers)throw new Error("No mouse markers found! Initialize the world before using this.");const s=this.mouseMarkers[e].three;s.visible=!1}setupEvents(e){var n,o;if(!this.world)throw new Error("No world found!");if(this.world.isDisposing||!this.world.renderer)return;const s=this.world.renderer.three.domElement;(n=this.world.renderer)==null||n.onResize.remove(this.updateLinesResolution),s.removeEventListener("click",this.onClick),s.removeEventListener("mousemove",this.onMouseMove),e&&(s.addEventListener("click",this.onClick),s.addEventListener("mousemove",this.onMouseMove),(o=this.world.renderer)==null||o.onResize.add(this.updateLinesResolution))}updateMarker(e,s){if(!this.mouseMarkers)return;const{point:n,object:o}=e,r=o,a=r.curve,l=r.curve.alignment,c=l.getPercentageAt(n,"absolute");this.mouseMarkers[s].visible=!0,this.mouseMarkers[s].three.position.copy(n),c!==null&&this.onMarkerChange.trigger({alignment:l,percentage:c,type:s,curve:a})}};y(fi,"uuid","0a59c09e-2b49-474a-9320-99f51f40f182");let On=fi;var ba=Object.defineProperty,ga=(i,t,e)=>t in i?ba(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,Et=(i,t,e)=>(ga(i,typeof t!="symbol"?t+"":t,e),e);const Vt=Math.min,rt=Math.max,Qe=Math.round,mt=i=>({x:i,y:i}),va={left:"right",right:"left",bottom:"top",top:"bottom"},ya={start:"end",end:"start"};function Tn(i,t,e){return rt(i,Vt(t,e))}function Se(i,t){return typeof i=="function"?i(t):i}function at(i){return i.split("-")[0]}function gi(i){return i.split("-")[1]}function Ws(i){return i==="x"?"y":"x"}function Xs(i){return i==="y"?"height":"width"}function Pe(i){return["top","bottom"].includes(at(i))?"y":"x"}function qs(i){return Ws(Pe(i))}function _a(i,t,e){e===void 0&&(e=!1);const s=gi(i),n=qs(i),o=Xs(n);let r=n==="x"?s===(e?"end":"start")?"right":"left":s==="start"?"bottom":"top";return t.reference[o]>t.floating[o]&&(r=Je(r)),[r,Je(r)]}function wa(i){const t=Je(i);return[Fi(i),t,Fi(t)]}function Fi(i){return i.replace(/start|end/g,t=>ya[t])}function xa(i,t,e){const s=["left","right"],n=["right","left"],o=["top","bottom"],r=["bottom","top"];switch(i){case"top":case"bottom":return e?t?n:s:t?s:n;case"left":case"right":return t?o:r;default:return[]}}function $a(i,t,e,s){const n=gi(i);let o=xa(at(i),e==="start",s);return n&&(o=o.map(r=>r+"-"+n),t&&(o=o.concat(o.map(Fi)))),o}function Je(i){return i.replace(/left|right|bottom|top/g,t=>va[t])}function Ea(i){return{top:0,right:0,bottom:0,left:0,...i}}function Ks(i){return typeof i!="number"?Ea(i):{top:i,right:i,bottom:i,left:i}}function Yt(i){const{x:t,y:e,width:s,height:n}=i;return{width:s,height:n,top:e,left:t,right:t+s,bottom:e+n,x:t,y:e}}function zn(i,t,e){let{reference:s,floating:n}=i;const o=Pe(t),r=qs(t),a=Xs(r),l=at(t),c=o==="y",h=s.x+s.width/2-n.width/2,u=s.y+s.height/2-n.height/2,d=s[a]/2-n[a]/2;let p;switch(l){case"top":p={x:h,y:s.y-n.height};break;case"bottom":p={x:h,y:s.y+s.height};break;case"right":p={x:s.x+s.width,y:u};break;case"left":p={x:s.x-n.width,y:u};break;default:p={x:s.x,y:s.y}}switch(gi(t)){case"start":p[r]-=d*(e&&c?-1:1);break;case"end":p[r]+=d*(e&&c?-1:1);break}return p}const Aa=async(i,t,e)=>{const{placement:s="bottom",strategy:n="absolute",middleware:o=[],platform:r}=e,a=o.filter(Boolean),l=await(r.isRTL==null?void 0:r.isRTL(t));let c=await r.getElementRects({reference:i,floating:t,strategy:n}),{x:h,y:u}=zn(c,s,l),d=s,p={},m=0;for(let g=0;g<a.length;g++){const{name:b,fn:w}=a[g],{x,y:E,data:k,reset:L}=await w({x:h,y:u,initialPlacement:s,placement:d,strategy:n,middlewareData:p,rects:c,platform:r,elements:{reference:i,floating:t}});h=x??h,u=E??u,p={...p,[b]:{...p[b],...k}},L&&m<=50&&(m++,typeof L=="object"&&(L.placement&&(d=L.placement),L.rects&&(c=L.rects===!0?await r.getElementRects({reference:i,floating:t,strategy:n}):L.rects),{x:h,y:u}=zn(c,d,l)),g=-1)}return{x:h,y:u,placement:d,strategy:n,middlewareData:p}};async function cn(i,t){var e;t===void 0&&(t={});const{x:s,y:n,platform:o,rects:r,elements:a,strategy:l}=i,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:u="floating",altBoundary:d=!1,padding:p=0}=Se(t,i),m=Ks(p),g=a[d?u==="floating"?"reference":"floating":u],b=Yt(await o.getClippingRect({element:(e=await(o.isElement==null?void 0:o.isElement(g)))==null||e?g:g.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(a.floating)),boundary:c,rootBoundary:h,strategy:l})),w=u==="floating"?{x:s,y:n,width:r.floating.width,height:r.floating.height}:r.reference,x=await(o.getOffsetParent==null?void 0:o.getOffsetParent(a.floating)),E=await(o.isElement==null?void 0:o.isElement(x))?await(o.getScale==null?void 0:o.getScale(x))||{x:1,y:1}:{x:1,y:1},k=Yt(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:w,offsetParent:x,strategy:l}):w);return{top:(b.top-k.top+m.top)/E.y,bottom:(k.bottom-b.bottom+m.bottom)/E.y,left:(b.left-k.left+m.left)/E.x,right:(k.right-b.right+m.right)/E.x}}const ka=function(i){return i===void 0&&(i={}),{name:"flip",options:i,async fn(t){var e,s;const{placement:n,middlewareData:o,rects:r,initialPlacement:a,platform:l,elements:c}=t,{mainAxis:h=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:g=!0,...b}=Se(i,t);if((e=o.arrow)!=null&&e.alignmentOffset)return{};const w=at(n),x=at(a)===a,E=await(l.isRTL==null?void 0:l.isRTL(c.floating)),k=d||(x||!g?[Je(a)]:wa(a));!d&&m!=="none"&&k.push(...$a(a,g,m,E));const L=[a,...k],$=await cn(t,b),P=[];let O=((s=o.flip)==null?void 0:s.overflows)||[];if(h&&P.push($[w]),u){const H=_a(n,r,E);P.push($[H[0]],$[H[1]])}if(O=[...O,{placement:n,overflows:P}],!P.every(H=>H<=0)){var T,A;const H=(((T=o.flip)==null?void 0:T.index)||0)+1,V=L[H];if(V)return{data:{index:H,overflows:O},reset:{placement:V}};let R=(A=O.filter(U=>U.overflows[0]<=0).sort((U,B)=>U.overflows[1]-B.overflows[1])[0])==null?void 0:A.placement;if(!R)switch(p){case"bestFit":{var J;const U=(J=O.map(B=>[B.placement,B.overflows.filter(Y=>Y>0).reduce((Y,st)=>Y+st,0)]).sort((B,Y)=>B[1]-Y[1])[0])==null?void 0:J[0];U&&(R=U);break}case"initialPlacement":R=a;break}if(n!==R)return{reset:{placement:R}}}return{}}}};function Zs(i){const t=Vt(...i.map(o=>o.left)),e=Vt(...i.map(o=>o.top)),s=rt(...i.map(o=>o.right)),n=rt(...i.map(o=>o.bottom));return{x:t,y:e,width:s-t,height:n-e}}function Ca(i){const t=i.slice().sort((n,o)=>n.y-o.y),e=[];let s=null;for(let n=0;n<t.length;n++){const o=t[n];!s||o.y-s.y>s.height/2?e.push([o]):e[e.length-1].push(o),s=o}return e.map(n=>Yt(Zs(n)))}const Sa=function(i){return i===void 0&&(i={}),{name:"inline",options:i,async fn(t){const{placement:e,elements:s,rects:n,platform:o,strategy:r}=t,{padding:a=2,x:l,y:c}=Se(i,t),h=Array.from(await(o.getClientRects==null?void 0:o.getClientRects(s.reference))||[]),u=Ca(h),d=Yt(Zs(h)),p=Ks(a);function m(){if(u.length===2&&u[0].left>u[1].right&&l!=null&&c!=null)return u.find(b=>l>b.left-p.left&&l<b.right+p.right&&c>b.top-p.top&&c<b.bottom+p.bottom)||d;if(u.length>=2){if(Pe(e)==="y"){const A=u[0],J=u[u.length-1],H=at(e)==="top",V=A.top,R=J.bottom,U=H?A.left:J.left,B=H?A.right:J.right,Y=B-U,st=R-V;return{top:V,bottom:R,left:U,right:B,width:Y,height:st,x:U,y:V}}const b=at(e)==="left",w=rt(...u.map(A=>A.right)),x=Vt(...u.map(A=>A.left)),E=u.filter(A=>b?A.left===x:A.right===w),k=E[0].top,L=E[E.length-1].bottom,$=x,P=w,O=P-$,T=L-k;return{top:k,bottom:L,left:$,right:P,width:O,height:T,x:$,y:k}}return d}const g=await o.getElementRects({reference:{getBoundingClientRect:m},floating:s.floating,strategy:r});return n.reference.x!==g.reference.x||n.reference.y!==g.reference.y||n.reference.width!==g.reference.width||n.reference.height!==g.reference.height?{reset:{rects:g}}:{}}}};async function Pa(i,t){const{placement:e,platform:s,elements:n}=i,o=await(s.isRTL==null?void 0:s.isRTL(n.floating)),r=at(e),a=gi(e),l=Pe(e)==="y",c=["left","top"].includes(r)?-1:1,h=o&&l?-1:1,u=Se(t,i);let{mainAxis:d,crossAxis:p,alignmentAxis:m}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return a&&typeof m=="number"&&(p=a==="end"?m*-1:m),l?{x:p*h,y:d*c}:{x:d*c,y:p*h}}const Gs=function(i){return{name:"offset",options:i,async fn(t){var e,s;const{x:n,y:o,placement:r,middlewareData:a}=t,l=await Pa(t,i);return r===((e=a.offset)==null?void 0:e.placement)&&(s=a.arrow)!=null&&s.alignmentOffset?{}:{x:n+l.x,y:o+l.y,data:{...l,placement:r}}}}},Ma=function(i){return i===void 0&&(i={}),{name:"shift",options:i,async fn(t){const{x:e,y:s,placement:n}=t,{mainAxis:o=!0,crossAxis:r=!1,limiter:a={fn:b=>{let{x:w,y:x}=b;return{x:w,y:x}}},...l}=Se(i,t),c={x:e,y:s},h=await cn(t,l),u=Pe(at(n)),d=Ws(u);let p=c[d],m=c[u];if(o){const b=d==="y"?"top":"left",w=d==="y"?"bottom":"right",x=p+h[b],E=p-h[w];p=Tn(x,p,E)}if(r){const b=u==="y"?"top":"left",w=u==="y"?"bottom":"right",x=m+h[b],E=m-h[w];m=Tn(x,m,E)}const g=a.fn({...t,[d]:p,[u]:m});return{...g,data:{x:g.x-e,y:g.y-s}}}}};function ft(i){return Qs(i)?(i.nodeName||"").toLowerCase():"#document"}function W(i){var t;return(i==null||(t=i.ownerDocument)==null?void 0:t.defaultView)||window}function gt(i){var t;return(t=(Qs(i)?i.ownerDocument:i.document)||window.document)==null?void 0:t.documentElement}function Qs(i){return i instanceof Node||i instanceof W(i).Node}function lt(i){return i instanceof Element||i instanceof W(i).Element}function it(i){return i instanceof HTMLElement||i instanceof W(i).HTMLElement}function Rn(i){return typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof W(i).ShadowRoot}function Me(i){const{overflow:t,overflowX:e,overflowY:s,display:n}=G(i);return/auto|scroll|overlay|hidden|clip/.test(t+s+e)&&!["inline","contents"].includes(n)}function La(i){return["table","td","th"].includes(ft(i))}function hn(i){const t=un(),e=G(i);return e.transform!=="none"||e.perspective!=="none"||(e.containerType?e.containerType!=="normal":!1)||!t&&(e.backdropFilter?e.backdropFilter!=="none":!1)||!t&&(e.filter?e.filter!=="none":!1)||["transform","perspective","filter"].some(s=>(e.willChange||"").includes(s))||["paint","layout","strict","content"].some(s=>(e.contain||"").includes(s))}function Oa(i){let t=Wt(i);for(;it(t)&&!vi(t);){if(hn(t))return t;t=Wt(t)}return null}function un(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function vi(i){return["html","body","#document"].includes(ft(i))}function G(i){return W(i).getComputedStyle(i)}function yi(i){return lt(i)?{scrollLeft:i.scrollLeft,scrollTop:i.scrollTop}:{scrollLeft:i.pageXOffset,scrollTop:i.pageYOffset}}function Wt(i){if(ft(i)==="html")return i;const t=i.assignedSlot||i.parentNode||Rn(i)&&i.host||gt(i);return Rn(t)?t.host:t}function Js(i){const t=Wt(i);return vi(t)?i.ownerDocument?i.ownerDocument.body:i.body:it(t)&&Me(t)?t:Js(t)}function Vi(i,t,e){var s;t===void 0&&(t=[]),e===void 0&&(e=!0);const n=Js(i),o=n===((s=i.ownerDocument)==null?void 0:s.body),r=W(n);return o?t.concat(r,r.visualViewport||[],Me(n)?n:[],r.frameElement&&e?Vi(r.frameElement):[]):t.concat(n,Vi(n,[],e))}function to(i){const t=G(i);let e=parseFloat(t.width)||0,s=parseFloat(t.height)||0;const n=it(i),o=n?i.offsetWidth:e,r=n?i.offsetHeight:s,a=Qe(e)!==o||Qe(s)!==r;return a&&(e=o,s=r),{width:e,height:s,$:a}}function eo(i){return lt(i)?i:i.contextElement}function Ut(i){const t=eo(i);if(!it(t))return mt(1);const e=t.getBoundingClientRect(),{width:s,height:n,$:o}=to(t);let r=(o?Qe(e.width):e.width)/s,a=(o?Qe(e.height):e.height)/n;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const Ta=mt(0);function io(i){const t=W(i);return!un()||!t.visualViewport?Ta:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function za(i,t,e){return t===void 0&&(t=!1),!e||t&&e!==W(i)?!1:t}function ge(i,t,e,s){t===void 0&&(t=!1),e===void 0&&(e=!1);const n=i.getBoundingClientRect(),o=eo(i);let r=mt(1);t&&(s?lt(s)&&(r=Ut(s)):r=Ut(i));const a=za(o,e,s)?io(o):mt(0);let l=(n.left+a.x)/r.x,c=(n.top+a.y)/r.y,h=n.width/r.x,u=n.height/r.y;if(o){const d=W(o),p=s&&lt(s)?W(s):s;let m=d,g=m.frameElement;for(;g&&s&&p!==m;){const b=Ut(g),w=g.getBoundingClientRect(),x=G(g),E=w.left+(g.clientLeft+parseFloat(x.paddingLeft))*b.x,k=w.top+(g.clientTop+parseFloat(x.paddingTop))*b.y;l*=b.x,c*=b.y,h*=b.x,u*=b.y,l+=E,c+=k,m=W(g),g=m.frameElement}}return Yt({width:h,height:u,x:l,y:c})}const Ra=[":popover-open",":modal"];function no(i){return Ra.some(t=>{try{return i.matches(t)}catch{return!1}})}function Na(i){let{elements:t,rect:e,offsetParent:s,strategy:n}=i;const o=n==="fixed",r=gt(s),a=t?no(t.floating):!1;if(s===r||a&&o)return e;let l={scrollLeft:0,scrollTop:0},c=mt(1);const h=mt(0),u=it(s);if((u||!u&&!o)&&((ft(s)!=="body"||Me(r))&&(l=yi(s)),it(s))){const d=ge(s);c=Ut(s),h.x=d.x+s.clientLeft,h.y=d.y+s.clientTop}return{width:e.width*c.x,height:e.height*c.y,x:e.x*c.x-l.scrollLeft*c.x+h.x,y:e.y*c.y-l.scrollTop*c.y+h.y}}function Ia(i){return Array.from(i.getClientRects())}function so(i){return ge(gt(i)).left+yi(i).scrollLeft}function ja(i){const t=gt(i),e=yi(i),s=i.ownerDocument.body,n=rt(t.scrollWidth,t.clientWidth,s.scrollWidth,s.clientWidth),o=rt(t.scrollHeight,t.clientHeight,s.scrollHeight,s.clientHeight);let r=-e.scrollLeft+so(i);const a=-e.scrollTop;return G(s).direction==="rtl"&&(r+=rt(t.clientWidth,s.clientWidth)-n),{width:n,height:o,x:r,y:a}}function Ha(i,t){const e=W(i),s=gt(i),n=e.visualViewport;let o=s.clientWidth,r=s.clientHeight,a=0,l=0;if(n){o=n.width,r=n.height;const c=un();(!c||c&&t==="fixed")&&(a=n.offsetLeft,l=n.offsetTop)}return{width:o,height:r,x:a,y:l}}function Da(i,t){const e=ge(i,!0,t==="fixed"),s=e.top+i.clientTop,n=e.left+i.clientLeft,o=it(i)?Ut(i):mt(1),r=i.clientWidth*o.x,a=i.clientHeight*o.y,l=n*o.x,c=s*o.y;return{width:r,height:a,x:l,y:c}}function Nn(i,t,e){let s;if(t==="viewport")s=Ha(i,e);else if(t==="document")s=ja(gt(i));else if(lt(t))s=Da(t,e);else{const n=io(i);s={...t,x:t.x-n.x,y:t.y-n.y}}return Yt(s)}function oo(i,t){const e=Wt(i);return e===t||!lt(e)||vi(e)?!1:G(e).position==="fixed"||oo(e,t)}function Ba(i,t){const e=t.get(i);if(e)return e;let s=Vi(i,[],!1).filter(a=>lt(a)&&ft(a)!=="body"),n=null;const o=G(i).position==="fixed";let r=o?Wt(i):i;for(;lt(r)&&!vi(r);){const a=G(r),l=hn(r);!l&&a.position==="fixed"&&(n=null),(o?!l&&!n:!l&&a.position==="static"&&n&&["absolute","fixed"].includes(n.position)||Me(r)&&!l&&oo(i,r))?s=s.filter(c=>c!==r):n=a,r=Wt(r)}return t.set(i,s),s}function Ua(i){let{element:t,boundary:e,rootBoundary:s,strategy:n}=i;const o=[...e==="clippingAncestors"?Ba(t,this._c):[].concat(e),s],r=o[0],a=o.reduce((l,c)=>{const h=Nn(t,c,n);return l.top=rt(h.top,l.top),l.right=Vt(h.right,l.right),l.bottom=Vt(h.bottom,l.bottom),l.left=rt(h.left,l.left),l},Nn(t,r,n));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function Fa(i){const{width:t,height:e}=to(i);return{width:t,height:e}}function Va(i,t,e){const s=it(t),n=gt(t),o=e==="fixed",r=ge(i,!0,o,t);let a={scrollLeft:0,scrollTop:0};const l=mt(0);if(s||!s&&!o)if((ft(t)!=="body"||Me(n))&&(a=yi(t)),s){const u=ge(t,!0,o,t);l.x=u.x+t.clientLeft,l.y=u.y+t.clientTop}else n&&(l.x=so(n));const c=r.left+a.scrollLeft-l.x,h=r.top+a.scrollTop-l.y;return{x:c,y:h,width:r.width,height:r.height}}function In(i,t){return!it(i)||G(i).position==="fixed"?null:t?t(i):i.offsetParent}function ro(i,t){const e=W(i);if(!it(i)||no(i))return e;let s=In(i,t);for(;s&&La(s)&&G(s).position==="static";)s=In(s,t);return s&&(ft(s)==="html"||ft(s)==="body"&&G(s).position==="static"&&!hn(s))?e:s||Oa(i)||e}const Ya=async function(i){const t=this.getOffsetParent||ro,e=this.getDimensions;return{reference:Va(i.reference,await t(i.floating),i.strategy),floating:{x:0,y:0,...await e(i.floating)}}};function Wa(i){return G(i).direction==="rtl"}const Xa={convertOffsetParentRelativeRectToViewportRelativeRect:Na,getDocumentElement:gt,getClippingRect:Ua,getOffsetParent:ro,getElementRects:Ya,getClientRects:Ia,getDimensions:Fa,getScale:Ut,isElement:lt,isRTL:Wa},ao=Ma,lo=ka,co=Sa,ho=(i,t,e)=>{const s=new Map,n={platform:Xa,...e},o={...n.platform,_c:s};return Aa(i,t,{...n,platform:o})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xe=globalThis,dn=Xe.ShadowRoot&&(Xe.ShadyCSS===void 0||Xe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pn=Symbol(),jn=new WeakMap;let uo=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==pn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o;const t=this.t;if(dn&&i===void 0){const e=t!==void 0&&t.length===1;e&&(i=jn.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&jn.set(t,i))}return i}toString(){return this.cssText}};const qa=i=>new uo(typeof i=="string"?i:i+"",void 0,pn),M=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,n,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new uo(e,i,pn)},Ka=(i,t)=>{if(dn)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),n=Xe.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},Hn=dn?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return qa(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Za,defineProperty:Ga,getOwnPropertyDescriptor:Qa,getOwnPropertyNames:Ja,getOwnPropertySymbols:tl,getPrototypeOf:el}=Object,Xt=globalThis,Dn=Xt.trustedTypes,il=Dn?Dn.emptyScript:"",Bn=Xt.reactiveElementPolyfillSupport,de=(i,t)=>i,ti={toAttribute(i,t){switch(t){case Boolean:i=i?il:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},mn=(i,t)=>!Za(i,t),Un={attribute:!0,type:String,converter:ti,reflect:!1,hasChanged:mn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Xt.litPropertyMetadata??(Xt.litPropertyMetadata=new WeakMap);class Ht extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Un){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&Ga(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){const{get:n,set:o}=Qa(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get(){return n==null?void 0:n.call(this)},set(r){const a=n==null?void 0:n.call(this);o.call(this,r),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Un}static _$Ei(){if(this.hasOwnProperty(de("elementProperties")))return;const t=el(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(de("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(de("properties"))){const e=this.properties,s=[...Ja(e),...tl(e)];for(const n of s)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const n of s)e.unshift(Hn(n))}else t!==void 0&&e.push(Hn(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ka(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){const r=(((s=n.converter)==null?void 0:s.toAttribute)!==void 0?n.converter:ti).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(t,e){var s;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const r=n.getPropertyOptions(o),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((s=r.converter)==null?void 0:s.fromAttribute)!==void 0?r.converter:ti;this._$Em=o,this[o]=a.fromAttribute(e,r.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??mn)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,r]of n)r.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],r)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(s)):this._$EU()}catch(n){throw e=!1,this._$EU(),n}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var n;return(n=s.hostUpdated)==null?void 0:n.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Ht.elementStyles=[],Ht.shadowRootOptions={mode:"open"},Ht[de("elementProperties")]=new Map,Ht[de("finalized")]=new Map,Bn==null||Bn({ReactiveElement:Ht}),(Xt.reactiveElementVersions??(Xt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ei=globalThis,ii=ei.trustedTypes,Fn=ii?ii.createPolicy("lit-html",{createHTML:i=>i}):void 0,fn="$lit$",ot=`lit$${Math.random().toFixed(9).slice(2)}$`,bn="?"+ot,nl=`<${bn}>`,Lt=document,ve=()=>Lt.createComment(""),ye=i=>i===null||typeof i!="object"&&typeof i!="function",po=Array.isArray,mo=i=>po(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ri=`[ 	
\f\r]`,ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vn=/-->/g,Yn=/>/g,At=RegExp(`>|${Ri}(?:([^\\s"'>=/]+)(${Ri}*=${Ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Wn=/'/g,Xn=/"/g,fo=/^(?:script|style|textarea|title)$/i,sl=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),v=sl(1),qt=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),qn=new WeakMap,Ct=Lt.createTreeWalker(Lt,129);function bo(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fn!==void 0?Fn.createHTML(t):t}const go=(i,t)=>{const e=i.length-1,s=[];let n,o=t===2?"<svg>":"",r=ce;for(let a=0;a<e;a++){const l=i[a];let c,h,u=-1,d=0;for(;d<l.length&&(r.lastIndex=d,h=r.exec(l),h!==null);)d=r.lastIndex,r===ce?h[1]==="!--"?r=Vn:h[1]!==void 0?r=Yn:h[2]!==void 0?(fo.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=At):h[3]!==void 0&&(r=At):r===At?h[0]===">"?(r=n??ce,u=-1):h[1]===void 0?u=-2:(u=r.lastIndex-h[2].length,c=h[1],r=h[3]===void 0?At:h[3]==='"'?Xn:Wn):r===Xn||r===Wn?r=At:r===Vn||r===Yn?r=ce:(r=At,n=void 0);const p=r===At&&i[a+1].startsWith("/>")?" ":"";o+=r===ce?l+nl:u>=0?(s.push(c),l.slice(0,u)+fn+l.slice(u)+ot+p):l+ot+(u===-2?a:p)}return[bo(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};class _e{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let o=0,r=0;const a=t.length-1,l=this.parts,[c,h]=go(t,e);if(this.el=_e.createElement(c,s),Ct.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=Ct.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(fn)){const d=h[r++],p=n.getAttribute(u).split(ot),m=/([.?@])?(.*)/.exec(d);l.push({type:1,index:o,name:m[2],strings:p,ctor:m[1]==="."?yo:m[1]==="?"?_o:m[1]==="@"?wo:Le}),n.removeAttribute(u)}else u.startsWith(ot)&&(l.push({type:6,index:o}),n.removeAttribute(u));if(fo.test(n.tagName)){const u=n.textContent.split(ot),d=u.length-1;if(d>0){n.textContent=ii?ii.emptyScript:"";for(let p=0;p<d;p++)n.append(u[p],ve()),Ct.nextNode(),l.push({type:2,index:++o});n.append(u[d],ve())}}}else if(n.nodeType===8)if(n.data===bn)l.push({type:2,index:o});else{let u=-1;for(;(u=n.data.indexOf(ot,u+1))!==-1;)l.push({type:7,index:o}),u+=ot.length-1}o++}}static createElement(t,e){const s=Lt.createElement("template");return s.innerHTML=t,s}}function Ot(i,t,e=i,s){var n,o;if(t===qt)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const a=ye(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((o=r==null?void 0:r._$AO)==null||o.call(r,!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=Ot(i,r._$AS(i,t.values),r,s)),t}class vo{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,n=((t==null?void 0:t.creationScope)??Lt).importNode(e,!0);Ct.currentNode=n;let o=Ct.nextNode(),r=0,a=0,l=s[0];for(;l!==void 0;){if(r===l.index){let c;l.type===2?c=new Jt(o,o.nextSibling,this,t):l.type===1?c=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(c=new xo(o,this,t)),this._$AV.push(c),l=s[++a]}r!==(l==null?void 0:l.index)&&(o=Ct.nextNode(),r++)}return Ct.currentNode=Lt,n}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Jt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ot(this,t,e),ye(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==qt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):mo(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==z&&ye(this._$AH)?this._$AA.nextSibling.data=t:this.T(Lt.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=_e.createElement(bo(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const r=new vo(o,this),a=r.u(this.options);r.p(s),this.T(a),this._$AH=r}}_$AC(t){let e=qn.get(t.strings);return e===void 0&&qn.set(t.strings,e=new _e(t)),e}k(t){po(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,n=0;for(const o of t)n===e.length?e.push(s=new Jt(this.S(ve()),this.S(ve()),this,this.options)):s=e[n],s._$AI(o),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Le{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,o){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=z}_$AI(t,e=this,s,n){const o=this.strings;let r=!1;if(o===void 0)t=Ot(this,t,e,0),r=!ye(t)||t!==this._$AH&&t!==qt,r&&(this._$AH=t);else{const a=t;let l,c;for(t=o[0],l=0;l<o.length-1;l++)c=Ot(this,a[s+l],e,l),c===qt&&(c=this._$AH[l]),r||(r=!ye(c)||c!==this._$AH[l]),c===z?t=z:t!==z&&(t+=(c??"")+o[l+1]),this._$AH[l]=c}r&&!n&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class yo extends Le{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class _o extends Le{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class wo extends Le{constructor(t,e,s,n,o){super(t,e,s,n,o),this.type=5}_$AI(t,e=this){if((t=Ot(this,t,e,0)??z)===qt)return;const s=this._$AH,n=t===z&&s!==z||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==z&&(s===z||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class xo{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Ot(this,t)}}const ol={P:fn,A:ot,C:bn,M:1,L:go,R:vo,D:mo,V:Ot,I:Jt,H:Le,N:_o,U:wo,B:yo,F:xo},Kn=ei.litHtmlPolyfillSupport;Kn==null||Kn(_e,Jt),(ei.litHtmlVersions??(ei.litHtmlVersions=[])).push("3.1.3");const ni=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let n=s._$litPart$;if(n===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=n=new Jt(t.insertBefore(ve(),o),o,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let S=class extends Ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const t=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=t.firstChild),t}update(i){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=ni(t,this.renderRoot,this.renderOptions)}connectedCallback(){var i;super.connectedCallback(),(i=this._$Do)==null||i.setConnected(!0)}disconnectedCallback(){var i;super.disconnectedCallback(),(i=this._$Do)==null||i.setConnected(!1)}render(){return qt}};var Zn;S._$litElement$=!0,S.finalized=!0,(Zn=globalThis.litElementHydrateSupport)==null||Zn.call(globalThis,{LitElement:S});const Gn=globalThis.litElementPolyfillSupport;Gn==null||Gn({LitElement:S});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rl={attribute:!0,type:String,converter:ti,reflect:!1,hasChanged:mn},al=(i=rl,t,e)=>{const{kind:s,metadata:n}=e;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(e.name,i),s==="accessor"){const{name:r}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,i)},init(a){return a!==void 0&&this.P(r,void 0,i),a}}}if(s==="setter"){const{name:r}=e;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,i)}}throw Error("Unsupported decorator location: "+s)};function f(i){return(t,e)=>typeof e=="object"?al(i,t,e):((s,n,o)=>{const r=n.hasOwnProperty(o);return n.constructor.createProperty(o,r?{...s,wrapped:!0}:s),r?Object.getOwnPropertyDescriptor(n,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Oe(i){return f({...i,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:ll}=ol,Qn=(i,t)=>(i==null?void 0:i._$litType$)!==void 0,cl=i=>{var t;return((t=i==null?void 0:i._$litType$)==null?void 0:t.h)!=null},hl=i=>i.strings===void 0,Jn=()=>document.createComment(""),ts=(i,t,e)=>{var s;const n=i._$AA.parentNode,o=i._$AB;if(e===void 0){const r=n.insertBefore(Jn(),o),a=n.insertBefore(Jn(),o);e=new ll(r,a,i,i.options)}else{const r=e._$AB.nextSibling,a=e._$AM,l=a!==i;if(l){let c;(s=e._$AQ)==null||s.call(e,i),e._$AM=i,e._$AP!==void 0&&(c=i._$AU)!==a._$AU&&e._$AP(c)}if(r!==o||l){let c=e._$AA;for(;c!==r;){const h=c.nextSibling;n.insertBefore(c,o),c=h}}}return e},ul={},es=(i,t=ul)=>i._$AH=t,is=i=>i._$AH,dl=i=>{i._$AR()};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pl={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},$o=i=>(...t)=>({_$litDirective$:i,values:t});let Eo=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,t,e){this._$Ct=i,this._$AM=t,this._$Ci=e}_$AS(i,t){return this.update(i,t)}update(i,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pe=(i,t)=>{var e;const s=i._$AN;if(s===void 0)return!1;for(const n of s)(e=n._$AO)==null||e.call(n,t,!1),pe(n,t);return!0},si=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while((e==null?void 0:e.size)===0)},Ao=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),bl(t)}};function ml(i){this._$AN!==void 0?(si(this),this._$AM=i,Ao(this)):this._$AM=i}function fl(i,t=!1,e=0){const s=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(s))for(let o=e;o<s.length;o++)pe(s[o],!1),si(s[o]);else s!=null&&(pe(s,!1),si(s));else pe(this,i)}const bl=i=>{i.type==pl.CHILD&&(i._$AP??(i._$AP=fl),i._$AQ??(i._$AQ=ml))};class gl extends Eo{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,s){super._$AT(t,e,s),Ao(this),this.isConnected=t._$AU}_$AO(t,e=!0){var s,n;t!==this.isConnected&&(this.isConnected=t,t?(s=this.reconnected)==null||s.call(this):(n=this.disconnected)==null||n.call(this)),e&&(pe(this,t),si(this))}setValue(t){if(hl(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=()=>new vl;let vl=class{};const Ni=new WeakMap,X=$o(class extends gl{render(i){return z}update(i,[t]){var e;const s=t!==this.Y;return s&&this.Y!==void 0&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.Y=t,this.ht=(e=i.options)==null?void 0:e.host,this.rt(this.ct=i.element)),z}rt(i){if(typeof this.Y=="function"){const t=this.ht??globalThis;let e=Ni.get(t);e===void 0&&(e=new WeakMap,Ni.set(t,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),e.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){var i,t;return typeof this.Y=="function"?(i=Ni.get(this.ht??globalThis))==null?void 0:i.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const ko=Object.freeze({left:0,top:0,width:16,height:16}),oi=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Te=Object.freeze({...ko,...oi}),Yi=Object.freeze({...Te,body:"",hidden:!1}),yl=Object.freeze({width:null,height:null}),Co=Object.freeze({...yl,...oi});function _l(i,t=0){const e=i.replace(/^-?[0-9.]*/,"");function s(n){for(;n<0;)n+=4;return n%4}if(e===""){const n=parseInt(i);return isNaN(n)?0:s(n)}else if(e!==i){let n=0;switch(e){case"%":n=25;break;case"deg":n=90}if(n){let o=parseFloat(i.slice(0,i.length-e.length));return isNaN(o)?0:(o=o/n,o%1===0?s(o):0)}}return t}const wl=/[\s,]+/;function xl(i,t){t.split(wl).forEach(e=>{switch(e.trim()){case"horizontal":i.hFlip=!0;break;case"vertical":i.vFlip=!0;break}})}const So={...Co,preserveAspectRatio:""};function ns(i){const t={...So},e=(s,n)=>i.getAttribute(s)||n;return t.width=e("width",null),t.height=e("height",null),t.rotate=_l(e("rotate","")),xl(t,e("flip","")),t.preserveAspectRatio=e("preserveAspectRatio",e("preserveaspectratio","")),t}function $l(i,t){for(const e in So)if(i[e]!==t[e])return!0;return!1}const me=/^[a-z0-9]+(-[a-z0-9]+)*$/,ze=(i,t,e,s="")=>{const n=i.split(":");if(i.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;s=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const a=n.pop(),l=n.pop(),c={provider:n.length>0?n[0]:s,prefix:l,name:a};return t&&!qe(c)?null:c}const o=n[0],r=o.split("-");if(r.length>1){const a={provider:s,prefix:r.shift(),name:r.join("-")};return t&&!qe(a)?null:a}if(e&&s===""){const a={provider:s,prefix:"",name:o};return t&&!qe(a,e)?null:a}return null},qe=(i,t)=>i?!!((i.provider===""||i.provider.match(me))&&(t&&i.prefix===""||i.prefix.match(me))&&i.name.match(me)):!1;function El(i,t){const e={};!i.hFlip!=!t.hFlip&&(e.hFlip=!0),!i.vFlip!=!t.vFlip&&(e.vFlip=!0);const s=((i.rotate||0)+(t.rotate||0))%4;return s&&(e.rotate=s),e}function ss(i,t){const e=El(i,t);for(const s in Yi)s in oi?s in i&&!(s in e)&&(e[s]=oi[s]):s in t?e[s]=t[s]:s in i&&(e[s]=i[s]);return e}function Al(i,t){const e=i.icons,s=i.aliases||Object.create(null),n=Object.create(null);function o(r){if(e[r])return n[r]=[];if(!(r in n)){n[r]=null;const a=s[r]&&s[r].parent,l=a&&o(a);l&&(n[r]=[a].concat(l))}return n[r]}return Object.keys(e).concat(Object.keys(s)).forEach(o),n}function kl(i,t,e){const s=i.icons,n=i.aliases||Object.create(null);let o={};function r(a){o=ss(s[a]||n[a],o)}return r(t),e.forEach(r),ss(i,o)}function Po(i,t){const e=[];if(typeof i!="object"||typeof i.icons!="object")return e;i.not_found instanceof Array&&i.not_found.forEach(n=>{t(n,null),e.push(n)});const s=Al(i);for(const n in s){const o=s[n];o&&(t(n,kl(i,n,o)),e.push(n))}return e}const Cl={provider:"",aliases:{},not_found:{},...ko};function Ii(i,t){for(const e in t)if(e in i&&typeof i[e]!=typeof t[e])return!1;return!0}function Mo(i){if(typeof i!="object"||i===null)return null;const t=i;if(typeof t.prefix!="string"||!i.icons||typeof i.icons!="object"||!Ii(i,Cl))return null;const e=t.icons;for(const n in e){const o=e[n];if(!n.match(me)||typeof o.body!="string"||!Ii(o,Yi))return null}const s=t.aliases||Object.create(null);for(const n in s){const o=s[n],r=o.parent;if(!n.match(me)||typeof r!="string"||!e[r]&&!s[r]||!Ii(o,Yi))return null}return t}const ri=Object.create(null);function Sl(i,t){return{provider:i,prefix:t,icons:Object.create(null),missing:new Set}}function bt(i,t){const e=ri[i]||(ri[i]=Object.create(null));return e[t]||(e[t]=Sl(i,t))}function gn(i,t){return Mo(t)?Po(t,(e,s)=>{s?i.icons[e]=s:i.missing.add(e)}):[]}function Pl(i,t,e){try{if(typeof e.body=="string")return i.icons[t]={...e},!0}catch{}return!1}function Ml(i,t){let e=[];return(typeof i=="string"?[i]:Object.keys(ri)).forEach(s=>{(typeof s=="string"&&typeof t=="string"?[t]:Object.keys(ri[s]||{})).forEach(n=>{const o=bt(s,n);e=e.concat(Object.keys(o.icons).map(r=>(s!==""?"@"+s+":":"")+n+":"+r))})}),e}let we=!1;function Lo(i){return typeof i=="boolean"&&(we=i),we}function xe(i){const t=typeof i=="string"?ze(i,!0,we):i;if(t){const e=bt(t.provider,t.prefix),s=t.name;return e.icons[s]||(e.missing.has(s)?null:void 0)}}function Oo(i,t){const e=ze(i,!0,we);if(!e)return!1;const s=bt(e.provider,e.prefix);return Pl(s,e.name,t)}function os(i,t){if(typeof i!="object")return!1;if(typeof t!="string"&&(t=i.provider||""),we&&!t&&!i.prefix){let n=!1;return Mo(i)&&(i.prefix="",Po(i,(o,r)=>{r&&Oo(o,r)&&(n=!0)})),n}const e=i.prefix;if(!qe({provider:t,prefix:e,name:"a"}))return!1;const s=bt(t,e);return!!gn(s,i)}function rs(i){return!!xe(i)}function Ll(i){const t=xe(i);return t?{...Te,...t}:null}function Ol(i){const t={loaded:[],missing:[],pending:[]},e=Object.create(null);i.sort((n,o)=>n.provider!==o.provider?n.provider.localeCompare(o.provider):n.prefix!==o.prefix?n.prefix.localeCompare(o.prefix):n.name.localeCompare(o.name));let s={provider:"",prefix:"",name:""};return i.forEach(n=>{if(s.name===n.name&&s.prefix===n.prefix&&s.provider===n.provider)return;s=n;const o=n.provider,r=n.prefix,a=n.name,l=e[o]||(e[o]=Object.create(null)),c=l[r]||(l[r]=bt(o,r));let h;a in c.icons?h=t.loaded:r===""||c.missing.has(a)?h=t.missing:h=t.pending;const u={provider:o,prefix:r,name:a};h.push(u)}),t}function To(i,t){i.forEach(e=>{const s=e.loaderCallbacks;s&&(e.loaderCallbacks=s.filter(n=>n.id!==t))})}function Tl(i){i.pendingCallbacksFlag||(i.pendingCallbacksFlag=!0,setTimeout(()=>{i.pendingCallbacksFlag=!1;const t=i.loaderCallbacks?i.loaderCallbacks.slice(0):[];if(!t.length)return;let e=!1;const s=i.provider,n=i.prefix;t.forEach(o=>{const r=o.icons,a=r.pending.length;r.pending=r.pending.filter(l=>{if(l.prefix!==n)return!0;const c=l.name;if(i.icons[c])r.loaded.push({provider:s,prefix:n,name:c});else if(i.missing.has(c))r.missing.push({provider:s,prefix:n,name:c});else return e=!0,!0;return!1}),r.pending.length!==a&&(e||To([i],o.id),o.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),o.abort))})}))}let zl=0;function Rl(i,t,e){const s=zl++,n=To.bind(null,e,s);if(!t.pending.length)return n;const o={id:s,icons:t,callback:i,abort:n};return e.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(o)}),n}const Wi=Object.create(null);function as(i,t){Wi[i]=t}function Xi(i){return Wi[i]||Wi[""]}function Nl(i,t=!0,e=!1){const s=[];return i.forEach(n=>{const o=typeof n=="string"?ze(n,t,e):n;o&&s.push(o)}),s}var Il={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function jl(i,t,e,s){const n=i.resources.length,o=i.random?Math.floor(Math.random()*n):i.index;let r;if(i.random){let $=i.resources.slice(0);for(r=[];$.length>1;){const P=Math.floor(Math.random()*$.length);r.push($[P]),$=$.slice(0,P).concat($.slice(P+1))}r=r.concat($)}else r=i.resources.slice(o).concat(i.resources.slice(0,o));const a=Date.now();let l="pending",c=0,h,u=null,d=[],p=[];typeof s=="function"&&p.push(s);function m(){u&&(clearTimeout(u),u=null)}function g(){l==="pending"&&(l="aborted"),m(),d.forEach($=>{$.status==="pending"&&($.status="aborted")}),d=[]}function b($,P){P&&(p=[]),typeof $=="function"&&p.push($)}function w(){return{startTime:a,payload:t,status:l,queriesSent:c,queriesPending:d.length,subscribe:b,abort:g}}function x(){l="failed",p.forEach($=>{$(void 0,h)})}function E(){d.forEach($=>{$.status==="pending"&&($.status="aborted")}),d=[]}function k($,P,O){const T=P!=="success";switch(d=d.filter(A=>A!==$),l){case"pending":break;case"failed":if(T||!i.dataAfterTimeout)return;break;default:return}if(P==="abort"){h=O,x();return}if(T){h=O,d.length||(r.length?L():x());return}if(m(),E(),!i.random){const A=i.resources.indexOf($.resource);A!==-1&&A!==i.index&&(i.index=A)}l="completed",p.forEach(A=>{A(O)})}function L(){if(l!=="pending")return;m();const $=r.shift();if($===void 0){if(d.length){u=setTimeout(()=>{m(),l==="pending"&&(E(),x())},i.timeout);return}x();return}const P={status:"pending",resource:$,callback:(O,T)=>{k(P,O,T)}};d.push(P),c++,u=setTimeout(L,i.rotate),e($,t,P.callback)}return setTimeout(L),w}function zo(i){const t={...Il,...i};let e=[];function s(){e=e.filter(r=>r().status==="pending")}function n(r,a,l){const c=jl(t,r,a,(h,u)=>{s(),l&&l(h,u)});return e.push(c),c}function o(r){return e.find(a=>r(a))||null}return{query:n,find:o,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:s}}function vn(i){let t;if(typeof i.resources=="string")t=[i.resources];else if(t=i.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:i.path||"/",maxURL:i.maxURL||500,rotate:i.rotate||750,timeout:i.timeout||5e3,random:i.random===!0,index:i.index||0,dataAfterTimeout:i.dataAfterTimeout!==!1}}const _i=Object.create(null),Ve=["https://api.simplesvg.com","https://api.unisvg.com"],qi=[];for(;Ve.length>0;)Ve.length===1||Math.random()>.5?qi.push(Ve.shift()):qi.push(Ve.pop());_i[""]=vn({resources:["https://api.iconify.design"].concat(qi)});function ls(i,t){const e=vn(t);return e===null?!1:(_i[i]=e,!0)}function wi(i){return _i[i]}function Hl(){return Object.keys(_i)}function cs(){}const ji=Object.create(null);function Dl(i){if(!ji[i]){const t=wi(i);if(!t)return;const e=zo(t),s={config:t,redundancy:e};ji[i]=s}return ji[i]}function Ro(i,t,e){let s,n;if(typeof i=="string"){const o=Xi(i);if(!o)return e(void 0,424),cs;n=o.send;const r=Dl(i);r&&(s=r.redundancy)}else{const o=vn(i);if(o){s=zo(o);const r=i.resources?i.resources[0]:"",a=Xi(r);a&&(n=a.send)}}return!s||!n?(e(void 0,424),cs):s.query(t,n,e)().abort}const hs="iconify2",$e="iconify",No=$e+"-count",us=$e+"-version",Io=36e5,Bl=168,Ul=50;function Ki(i,t){try{return i.getItem(t)}catch{}}function yn(i,t,e){try{return i.setItem(t,e),!0}catch{}}function ds(i,t){try{i.removeItem(t)}catch{}}function Zi(i,t){return yn(i,No,t.toString())}function Gi(i){return parseInt(Ki(i,No))||0}const Mt={local:!0,session:!0},jo={local:new Set,session:new Set};let _n=!1;function Fl(i){_n=i}let Ye=typeof window>"u"?{}:window;function Ho(i){const t=i+"Storage";try{if(Ye&&Ye[t]&&typeof Ye[t].length=="number")return Ye[t]}catch{}Mt[i]=!1}function Do(i,t){const e=Ho(i);if(!e)return;const s=Ki(e,us);if(s!==hs){if(s){const a=Gi(e);for(let l=0;l<a;l++)ds(e,$e+l.toString())}yn(e,us,hs),Zi(e,0);return}const n=Math.floor(Date.now()/Io)-Bl,o=a=>{const l=$e+a.toString(),c=Ki(e,l);if(typeof c=="string"){try{const h=JSON.parse(c);if(typeof h=="object"&&typeof h.cached=="number"&&h.cached>n&&typeof h.provider=="string"&&typeof h.data=="object"&&typeof h.data.prefix=="string"&&t(h,a))return!0}catch{}ds(e,l)}};let r=Gi(e);for(let a=r-1;a>=0;a--)o(a)||(a===r-1?(r--,Zi(e,r)):jo[i].add(a))}function Bo(){if(!_n){Fl(!0);for(const i in Mt)Do(i,t=>{const e=t.data,s=t.provider,n=e.prefix,o=bt(s,n);if(!gn(o,e).length)return!1;const r=e.lastModified||-1;return o.lastModifiedCached=o.lastModifiedCached?Math.min(o.lastModifiedCached,r):r,!0})}}function Vl(i,t){const e=i.lastModifiedCached;if(e&&e>=t)return e===t;if(i.lastModifiedCached=t,e)for(const s in Mt)Do(s,n=>{const o=n.data;return n.provider!==i.provider||o.prefix!==i.prefix||o.lastModified===t});return!0}function Yl(i,t){_n||Bo();function e(s){let n;if(!Mt[s]||!(n=Ho(s)))return;const o=jo[s];let r;if(o.size)o.delete(r=Array.from(o).shift());else if(r=Gi(n),r>=Ul||!Zi(n,r+1))return;const a={cached:Math.floor(Date.now()/Io),provider:i.provider,data:t};return yn(n,$e+r.toString(),JSON.stringify(a))}t.lastModified&&!Vl(i,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),e("local")||e("session"))}function ps(){}function Wl(i){i.iconsLoaderFlag||(i.iconsLoaderFlag=!0,setTimeout(()=>{i.iconsLoaderFlag=!1,Tl(i)}))}function Xl(i,t){i.iconsToLoad?i.iconsToLoad=i.iconsToLoad.concat(t).sort():i.iconsToLoad=t,i.iconsQueueFlag||(i.iconsQueueFlag=!0,setTimeout(()=>{i.iconsQueueFlag=!1;const{provider:e,prefix:s}=i,n=i.iconsToLoad;delete i.iconsToLoad;let o;!n||!(o=Xi(e))||o.prepare(e,s,n).forEach(r=>{Ro(e,r,a=>{if(typeof a!="object")r.icons.forEach(l=>{i.missing.add(l)});else try{const l=gn(i,a);if(!l.length)return;const c=i.pendingIcons;c&&l.forEach(h=>{c.delete(h)}),Yl(i,a)}catch(l){console.error(l)}Wl(i)})})}))}const wn=(i,t)=>{const e=Nl(i,!0,Lo()),s=Ol(e);if(!s.pending.length){let l=!0;return t&&setTimeout(()=>{l&&t(s.loaded,s.missing,s.pending,ps)}),()=>{l=!1}}const n=Object.create(null),o=[];let r,a;return s.pending.forEach(l=>{const{provider:c,prefix:h}=l;if(h===a&&c===r)return;r=c,a=h,o.push(bt(c,h));const u=n[c]||(n[c]=Object.create(null));u[h]||(u[h]=[])}),s.pending.forEach(l=>{const{provider:c,prefix:h,name:u}=l,d=bt(c,h),p=d.pendingIcons||(d.pendingIcons=new Set);p.has(u)||(p.add(u),n[c][h].push(u))}),o.forEach(l=>{const{provider:c,prefix:h}=l;n[c][h].length&&Xl(l,n[c][h])}),t?Rl(t,s,o):ps},ql=i=>new Promise((t,e)=>{const s=typeof i=="string"?ze(i,!0):i;if(!s){e(i);return}wn([s||i],n=>{if(n.length&&s){const o=xe(s);if(o){t({...Te,...o});return}}e(i)})});function Kl(i){try{const t=typeof i=="string"?JSON.parse(i):i;if(typeof t.body=="string")return{...t}}catch{}}function Zl(i,t){const e=typeof i=="string"?ze(i,!0,!0):null;if(!e){const o=Kl(i);return{value:i,data:o}}const s=xe(e);if(s!==void 0||!e.prefix)return{value:i,name:e,data:s};const n=wn([e],()=>t(i,e,xe(e)));return{value:i,name:e,loading:n}}function Hi(i){return i.hasAttribute("inline")}let Uo=!1;try{Uo=navigator.vendor.indexOf("Apple")===0}catch{}function Gl(i,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Uo||i.indexOf("<a")===-1)?"svg":i.indexOf("currentColor")===-1?"bg":"mask"}const Ql=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Jl=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function Qi(i,t,e){if(t===1)return i;if(e=e||100,typeof i=="number")return Math.ceil(i*t*e)/e;if(typeof i!="string")return i;const s=i.split(Ql);if(s===null||!s.length)return i;const n=[];let o=s.shift(),r=Jl.test(o);for(;;){if(r){const a=parseFloat(o);isNaN(a)?n.push(o):n.push(Math.ceil(a*t*e)/e)}else n.push(o);if(o=s.shift(),o===void 0)return n.join("");r=!r}}function tc(i,t="defs"){let e="";const s=i.indexOf("<"+t);for(;s>=0;){const n=i.indexOf(">",s),o=i.indexOf("</"+t);if(n===-1||o===-1)break;const r=i.indexOf(">",o);if(r===-1)break;e+=i.slice(n+1,o).trim(),i=i.slice(0,s).trim()+i.slice(r+1)}return{defs:e,content:i}}function ec(i,t){return i?"<defs>"+i+"</defs>"+t:t}function ic(i,t,e){const s=tc(i);return ec(s.defs,t+s.content+e)}const nc=i=>i==="unset"||i==="undefined"||i==="none";function Fo(i,t){const e={...Te,...i},s={...Co,...t},n={left:e.left,top:e.top,width:e.width,height:e.height};let o=e.body;[e,s].forEach(g=>{const b=[],w=g.hFlip,x=g.vFlip;let E=g.rotate;w?x?E+=2:(b.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),b.push("scale(-1 1)"),n.top=n.left=0):x&&(b.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),b.push("scale(1 -1)"),n.top=n.left=0);let k;switch(E<0&&(E-=Math.floor(E/4)*4),E=E%4,E){case 1:k=n.height/2+n.top,b.unshift("rotate(90 "+k.toString()+" "+k.toString()+")");break;case 2:b.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:k=n.width/2+n.left,b.unshift("rotate(-90 "+k.toString()+" "+k.toString()+")");break}E%2===1&&(n.left!==n.top&&(k=n.left,n.left=n.top,n.top=k),n.width!==n.height&&(k=n.width,n.width=n.height,n.height=k)),b.length&&(o=ic(o,'<g transform="'+b.join(" ")+'">',"</g>"))});const r=s.width,a=s.height,l=n.width,c=n.height;let h,u;r===null?(u=a===null?"1em":a==="auto"?c:a,h=Qi(u,l/c)):(h=r==="auto"?l:r,u=a===null?Qi(h,c/l):a==="auto"?c:a);const d={},p=(g,b)=>{nc(b)||(d[g]=b.toString())};p("width",h),p("height",u);const m=[n.left,n.top,l,c];return d.viewBox=m.join(" "),{attributes:d,viewBox:m,body:o}}function xn(i,t){let e=i.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const s in t)e+=" "+s+'="'+t[s]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+e+">"+i+"</svg>"}function sc(i){return i.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function oc(i){return"data:image/svg+xml,"+sc(i)}function Vo(i){return'url("'+oc(i)+'")'}const rc=()=>{let i;try{if(i=fetch,typeof i=="function")return i}catch{}};let ai=rc();function ac(i){ai=i}function lc(){return ai}function cc(i,t){const e=wi(i);if(!e)return 0;let s;if(!e.maxURL)s=0;else{let n=0;e.resources.forEach(r=>{n=Math.max(n,r.length)});const o=t+".json?icons=";s=e.maxURL-n-e.path.length-o.length}return s}function hc(i){return i===404}const uc=(i,t,e)=>{const s=[],n=cc(i,t),o="icons";let r={type:o,provider:i,prefix:t,icons:[]},a=0;return e.forEach((l,c)=>{a+=l.length+1,a>=n&&c>0&&(s.push(r),r={type:o,provider:i,prefix:t,icons:[]},a=l.length),r.icons.push(l)}),s.push(r),s};function dc(i){if(typeof i=="string"){const t=wi(i);if(t)return t.path}return"/"}const pc=(i,t,e)=>{if(!ai){e("abort",424);return}let s=dc(t.provider);switch(t.type){case"icons":{const o=t.prefix,r=t.icons.join(","),a=new URLSearchParams({icons:r});s+=o+".json?"+a.toString();break}case"custom":{const o=t.uri;s+=o.slice(0,1)==="/"?o.slice(1):o;break}default:e("abort",400);return}let n=503;ai(i+s).then(o=>{const r=o.status;if(r!==200){setTimeout(()=>{e(hc(r)?"abort":"next",r)});return}return n=501,o.json()}).then(o=>{if(typeof o!="object"||o===null){setTimeout(()=>{o===404?e("abort",o):e("next",n)});return}setTimeout(()=>{e("success",o)})}).catch(()=>{e("next",n)})},mc={prepare:uc,send:pc};function ms(i,t){switch(i){case"local":case"session":Mt[i]=t;break;case"all":for(const e in Mt)Mt[e]=t;break}}const Di="data-style";let Yo="";function fc(i){Yo=i}function fs(i,t){let e=Array.from(i.childNodes).find(s=>s.hasAttribute&&s.hasAttribute(Di));e||(e=document.createElement("style"),e.setAttribute(Di,Di),i.appendChild(e)),e.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+Yo}function Wo(){as("",mc),Lo(!0);let i;try{i=window}catch{}if(i){if(Bo(),i.IconifyPreload!==void 0){const t=i.IconifyPreload,e="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(s=>{try{(typeof s!="object"||s===null||s instanceof Array||typeof s.icons!="object"||typeof s.prefix!="string"||!os(s))&&console.error(e)}catch{console.error(e)}})}if(i.IconifyProviders!==void 0){const t=i.IconifyProviders;if(typeof t=="object"&&t!==null)for(const e in t){const s="IconifyProviders["+e+"] is invalid.";try{const n=t[e];if(typeof n!="object"||!n||n.resources===void 0)continue;ls(e,n)||console.error(s)}catch{console.error(s)}}}}return{enableCache:t=>ms(t,!0),disableCache:t=>ms(t,!1),iconLoaded:rs,iconExists:rs,getIcon:Ll,listIcons:Ml,addIcon:Oo,addCollection:os,calculateSize:Qi,buildIcon:Fo,iconToHTML:xn,svgToURL:Vo,loadIcons:wn,loadIcon:ql,addAPIProvider:ls,appendCustomStyle:fc,_api:{getAPIConfig:wi,setAPIModule:as,sendAPIQuery:Ro,setFetch:ac,getFetch:lc,listAPIProviders:Hl}}}const Ji={"background-color":"currentColor"},Xo={"background-color":"transparent"},bs={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},gs={"-webkit-mask":Ji,mask:Ji,background:Xo};for(const i in gs){const t=gs[i];for(const e in bs)t[i+"-"+e]=bs[e]}function vs(i){return i?i+(i.match(/^[-0-9.]+$/)?"px":""):"inherit"}function bc(i,t,e){const s=document.createElement("span");let n=i.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const o=i.attributes,r=xn(n,{...o,width:t.width+"",height:t.height+""}),a=Vo(r),l=s.style,c={"--svg":a,width:vs(o.width),height:vs(o.height),...e?Ji:Xo};for(const h in c)l.setProperty(h,c[h]);return s}let fe;function gc(){try{fe=window.trustedTypes.createPolicy("iconify",{createHTML:i=>i})}catch{fe=null}}function vc(i){return fe===void 0&&gc(),fe?fe.createHTML(i):i}function yc(i){const t=document.createElement("span"),e=i.attributes;let s="";e.width||(s="width: inherit;"),e.height||(s+="height: inherit;"),s&&(e.style=s);const n=xn(i.body,e);return t.innerHTML=vc(n),t.firstChild}function tn(i){return Array.from(i.childNodes).find(t=>{const e=t.tagName&&t.tagName.toUpperCase();return e==="SPAN"||e==="SVG"})}function ys(i,t){const e=t.icon.data,s=t.customisations,n=Fo(e,s);s.preserveAspectRatio&&(n.attributes.preserveAspectRatio=s.preserveAspectRatio);const o=t.renderedMode;let r;switch(o){case"svg":r=yc(n);break;default:r=bc(n,{...Te,...e},o==="mask")}const a=tn(i);a?r.tagName==="SPAN"&&a.tagName===r.tagName?a.setAttribute("style",r.getAttribute("style")):i.replaceChild(r,a):i.appendChild(r)}function _s(i,t,e){const s=e&&(e.rendered?e:e.lastRender);return{rendered:!1,inline:t,icon:i,lastRender:s}}function _c(i="iconify-icon"){let t,e;try{t=window.customElements,e=window.HTMLElement}catch{return}if(!t||!e)return;const s=t.get(i);if(s)return s;const n=["icon","mode","inline","observe","width","height","rotate","flip"],o=class extends e{constructor(){super(),Et(this,"_shadowRoot"),Et(this,"_initialised",!1),Et(this,"_state"),Et(this,"_checkQueued",!1),Et(this,"_connected",!1),Et(this,"_observer",null),Et(this,"_visible",!0);const a=this._shadowRoot=this.attachShadow({mode:"open"}),l=Hi(this);fs(a,l),this._state=_s({value:""},l),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(a){switch(a){case"inline":{const l=Hi(this),c=this._state;l!==c.inline&&(c.inline=l,fs(this._shadowRoot,l));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const a=this.getAttribute("icon");if(a&&a.slice(0,1)==="{")try{return JSON.parse(a)}catch{}return a}set icon(a){typeof a=="object"&&(a=JSON.stringify(a)),this.setAttribute("icon",a)}get inline(){return Hi(this)}set inline(a){a?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(a){a?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const a=this._state;if(a.rendered){const l=this._shadowRoot;if(a.renderedMode==="svg")try{l.lastChild.setCurrentTime(0);return}catch{}ys(l,a)}}get status(){const a=this._state;return a.rendered?"rendered":a.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const a=this._state,l=this.getAttribute("icon");if(l!==a.icon.value){this._iconChanged(l);return}if(!a.rendered||!this._visible)return;const c=this.getAttribute("mode"),h=ns(this);(a.attrMode!==c||$l(a.customisations,h)||!tn(this._shadowRoot))&&this._renderIcon(a.icon,h,c)}_iconChanged(a){const l=Zl(a,(c,h,u)=>{const d=this._state;if(d.rendered||this.getAttribute("icon")!==c)return;const p={value:c,name:h,data:u};p.data?this._gotIconData(p):d.icon=p});l.data?this._gotIconData(l):this._state=_s(l,this._state.inline,this._state)}_forceRender(){if(!this._visible){const a=tn(this._shadowRoot);a&&this._shadowRoot.removeChild(a);return}this._queueCheck()}_gotIconData(a){this._checkQueued=!1,this._renderIcon(a,ns(this),this.getAttribute("mode"))}_renderIcon(a,l,c){const h=Gl(a.data.body,c),u=this._state.inline;ys(this._shadowRoot,this._state={rendered:!0,icon:a,inline:u,customisations:l,attrMode:c,renderedMode:h})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(a=>{const l=a.some(c=>c.isIntersecting);l!==this._visible&&(this._visible=l,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(a=>{a in o.prototype||Object.defineProperty(o.prototype,a,{get:function(){return this.getAttribute(a)},set:function(l){l!==null?this.setAttribute(a,l):this.removeAttribute(a)}})});const r=Wo();for(const a in r)o[a]=o.prototype[a]=r[a];return t.define(i,o),o}_c()||Wo();var wc=Object.defineProperty,nt=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&wc(t,e,n),n},We;const tt=(We=class extends S{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._parent=pt(),this._tooltip=pt(),this._contextMenu=pt(),this._mouseLeave=!1,this.onWindowMouseUp=i=>{const{value:t}=this._contextMenu;!this.contains(i.target)&&t&&(t.visible=!1)},this.mouseLeave=!0,this.addEventListener("click",i=>i.stopPropagation())}set mouseLeave(i){this._mouseLeave=i,i&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:i}=this._parent,{value:t}=this._tooltip;i&&t&&ho(i,t,{placement:"bottom",middleware:[Gs(10),co(),lo(),ao({padding:5})]}).then(e=>{const{x:s,y:n}=e;Object.assign(t.style,{left:`${s}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const i=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},i)}onChildrenClick(i){i.stopPropagation();const{value:t}=this._contextMenu;t&&(t.visible=!t.visible)}onSlotChange(i){const{value:t}=this._contextMenu,e=i.target.assignedElements();for(const s of e){if(!(s instanceof We)){s.remove(),console.warn("Only bim-button is allowed inside bim-button. Child has been removed.");continue}s.addEventListener("click",()=>t==null?void 0:t.updatePosition())}this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){const i=v`
      <div ${X(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?v`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?v`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=this.children.length>0;return v`
      <style>
        .button {
          border-radius: var(
            --bim-button--bdrs,
            ${t?"var(--bim-ui_size-4xs) 0 0 var(--bim-ui_size-4xs)":"var(--bim-ui_size-4xs)"}
          );
        }
        .children {
          border-radius: var(
            --bim-button--bdrs,
            ${t?"0 var(--bim-ui_size-4xs) var(--bim-ui_size-4xs) 0":"var(--bim-ui_size-4xs)"}
          );
        }
      </style>
      <div ${X(this._parent)} class="parent">
        ${this.label||this.icon?v`
              <div
                class="button"
                @mouseenter=${this.onMouseEnter}
                @mouseleave=${()=>this.mouseLeave=!0}
              >
                <bim-label
                  .label=${this.label}
                  .icon=${this.icon}
                  .vertical=${this.vertical}
                  .labelHidden=${this.labelHidden}
                ></bim-label>
              </div>
            `:null}
        ${this.tooltipTitle||this.tooltipText?i:null}
        ${t?v`
              <div class="children" @click=${this.onChildrenClick}>
                <bim-icon .icon=${"ic:round-plus"}></bim-icon>
              </div>
            `:null}
        <bim-context-menu
          ${X(this._contextMenu)}
          style="row-gap: var(--bim-ui_size-4xs)"
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </bim-context-menu>
      </div>
    `}},We.styles=M`
    :host {
      display: block;
      flex: 1;
      pointer-events: none;
    }

    :host(:not([disabled]):hover) {
      cursor: pointer;
    }

    bim-label {
      pointer-events: none;
    }

    .parent {
      --bim-label--c: var(--bim-ui_bg-contrast-80);
      --bim-label--fz: var(--bim-ui_size-xs);
      --bim-icon--c: var(--bim-label--c);
      display: flex;
      height: 100%;
      user-select: none;
      row-gap: 0.125rem;
      column-gap: 0.125rem;
    }

    .button,
    .children {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      min-height: var(--bim-ui_size-5xl);
      min-width: var(--bim-ui_size-5xl);
      background-color: var(--bim-button--bgc, var(--bim-ui_bg-contrast-20));
      outline: var(--bim-button--olw) solid var(--bim-button--olc);
    }

    .button {
      flex-grow: 1;
    }

    :host(:not([label-hidden])[label]) .button {
      justify-content: var(--bim-button--jc, center);
    }

    :host(:hover) .button,
    :host(:hover) .children {
      --bim-label--c: var(--bim-ui_main-contrast);
      --bim-icon--c: var(--bim-ui_main-contrast);
      fill: white;
      background-color: var(--bim-ui_color-main);
    }

    :host(:not([label]):not([icon])) .children {
      flex: 1;
    }

    :host([active]) .button {
      --bim-label--c: var(--bim-ui_main-contrast);
      --bim-icon--c: var(--bim-ui_main-contrast);
      background-color: var(--bim-ui_color-main);
    }

    :host([vertical]) .parent {
      justify-content: center;
    }

    :host(:not([label-hidden])[label]) .button {
      padding: 0 0.75rem;
    }

    :host([disabled]) .parent {
      background-color: gray;
    }

    .children {
      --bim-icon--fz: var(--bim-ui_size-base);
      padding: 0 0.125rem;
    }

    ::slotted(bim-button) {
      --bim-icon--fz: var(--bim-ui_size-base);
      --bim-button--bgc: var(
        --bim-context-menu--bgc,
        var(--bim-ui_bg-contrast-20)
      );
      --bim-button--bdrs: var(--bim-ui_size-4xs);
      --bim-button--olw: 0;
      --bim-button--olc: transparent;
    }

    .tooltip {
      position: absolute;
      padding: 0.75rem;
      z-index: 99;
      display: flex;
      flex-flow: column;
      row-gap: 0.375rem;
      box-shadow: 0 0 10px 3px rgba(0 0 0 / 20%);
      outline: 1px solid var(--bim-ui_bg-contrast-40);
      font-size: var(--bim-ui_size-xs);
      border-radius: var(--bim-ui_size-4xs);
      background-color: var(--bim-ui_bg-contrast-20);
      color: var(--bim-ui_bg-contrast-100);
    }

    .tooltip p {
      margin: 0;
      padding: 0;
    }

    :host(:not([tooltip-visible])) .tooltip {
      display: none;
    }
  `,We);nt([f({type:String,reflect:!0})],tt.prototype,"label");nt([f({type:Boolean,attribute:"label-hidden",reflect:!0})],tt.prototype,"labelHidden");nt([f({type:Boolean,reflect:!0})],tt.prototype,"active");nt([f({type:Boolean,reflect:!0,attribute:"disabled"})],tt.prototype,"disabled");nt([f({type:String,reflect:!0})],tt.prototype,"icon");nt([f({type:Boolean,reflect:!0})],tt.prototype,"vertical");nt([f({type:Number,attribute:"tooltip-time",reflect:!0})],tt.prototype,"tooltipTime");nt([f({type:Boolean,attribute:"tooltip-visible",reflect:!0})],tt.prototype,"tooltipVisible");nt([f({type:String,attribute:"tooltip-title",reflect:!0})],tt.prototype,"tooltipTitle");nt([f({type:String,attribute:"tooltip-text",reflect:!0})],tt.prototype,"tooltipText");let xc=tt;var $c=Object.defineProperty,Re=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&$c(t,e,n),n};const qo=class extends S{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(i){i.stopPropagation(),this.checked=i.target.checked,this.dispatchEvent(this.onValueChange)}render(){return v`
      <div class="parent">
        ${this.label?v`<bim-label
              label="${this.label}"
              .icon="${this.icon}"
            ></bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};qo.styles=M`
    :host {
      display: block;
    }

    .parent {
      display: flex;
      justify-content: space-between;
      height: 1.75rem;
      column-gap: 0.5rem;
      width: 100%;
      align-items: center;
    }

    :host([inverted]) .parent {
      flex-direction: row-reverse;
      justify-content: start;
    }

    input {
      height: 1rem;
      width: 1rem;
      cursor: pointer;
      border: none;
      outline: none;
      accent-color: var(--bim-checkbox--c, var(--bim-ui_color-main));
    }

    input:focus {
      outline: var(--bim-checkbox--olw, 2px) solid
        var(--bim-checkbox--olc, var(--bim-ui_color-accent));
    }
  `;let te=qo;Re([f({type:String,reflect:!0})],te.prototype,"icon");Re([f({type:String,reflect:!0})],te.prototype,"name");Re([f({type:String,reflect:!0})],te.prototype,"label");Re([f({type:Boolean,reflect:!0})],te.prototype,"checked");Re([f({type:Boolean,reflect:!0})],te.prototype,"inverted");var Ec=Object.defineProperty,ee=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Ec(t,e,n),n};const Ko=class extends S{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=pt(),this._textInput=pt(),this.onValueChange=new Event("input"),this.onOpacityInput=i=>{const t=i.target;this.opacity=t.value,this.dispatchEvent(this.onValueChange)}}set value(i){const{color:t,opacity:e}=i;this.color=t,e&&(this.opacity=e)}get value(){const i={color:this.color};return this.opacity&&(i.opacity=this.opacity),i}onColorInput(i){i.stopPropagation();const{value:t}=this._colorInput;t&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}onTextInput(i){i.stopPropagation();const{value:t}=this._textInput;if(!t)return;const{value:e}=t;let s=e.replace(/[^a-fA-F0-9]/g,"");s.startsWith("#")||(s=`#${s}`),t.value=s.slice(0,7),t.value.length===7&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:i}=this._colorInput;i&&i.click()}render(){return v`
      <div class="parent">
        <bim-input
          .label=${this.label}
          .icon=${this.icon}
          .vertical="${this.vertical}"
        >
          <div class="color-container">
            <div
              style="display: flex; align-items: center; gap: .375rem; height: 100%; flex: 1; padding: 0 0.5rem;"
            >
              <input
                ${X(this._colorInput)}
                @input="${this.onColorInput}"
                type="color"
                aria-label=${this.label||this.name||"Color Input"}
                value="${this.color}"
              />
              <div
                @click=${this.focus}
                class="sample"
                style="background-color: ${this.color}"
              ></div>
              <input
                ${X(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?v`<bim-number-input
                  @input=${this.onOpacityInput}
                  slider
                  suffix="%"
                  min="0"
                  value=${this.opacity}
                  max="100"
                ></bim-number-input>`:null}
          </div>
        </bim-input>
      </div>
    `}};Ko.styles=M`
    :host {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
      flex: 1;
      display: block;
    }

    :host(:focus) {
      --bim-input--olw: var(--bim-number-input--olw, 2px);
      --bim-input--olc: var(--bim-ui_color-accent);
    }

    .parent {
      display: flex;
      gap: 0.375rem;
    }

    .color-container {
      position: relative;
      outline: none;
      display: flex;
      height: 100%;
      gap: 0.5rem;
      justify-content: flex-start;
      align-items: center;
      flex: 1;
      border-radius: var(--bim-color-input--bdrs, var(--bim-ui_size-4xs));
    }

    .color-container input[type="color"] {
      position: absolute;
      bottom: -0.25rem;
      visibility: hidden;
      width: 0;
      height: 0;
    }

    .color-container .sample {
      width: 1rem;
      height: 1rem;
      border-radius: 0.125rem;
      background-color: #fff;
    }

    .color-container input[type="text"] {
      height: 100%;
      flex: 1;
      width: 3.25rem;
      text-transform: uppercase;
      font-size: 0.75rem;
      background-color: transparent;
      padding: 0%;
      outline: none;
      border: none;
      color: var(--bim-color-input--c, var(--bim-ui_bg-contrast-100));
    }

    bim-number-input {
      flex-grow: 0;
    }
  `;let zt=Ko;ee([f({type:String,reflect:!0})],zt.prototype,"name");ee([f({type:String,reflect:!0})],zt.prototype,"label");ee([f({type:String,reflect:!0})],zt.prototype,"icon");ee([f({type:Boolean,reflect:!0})],zt.prototype,"vertical");ee([f({type:Number,reflect:!0})],zt.prototype,"opacity");ee([f({type:String,reflect:!0})],zt.prototype,"color");const Ac=M`
  ::-webkit-scrollbar {
    width: 0.4rem;
    height: 0.4rem;
    overflow: hidden;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0.25rem;
    background-color: var(
      --bim-scrollbar--c,
      color-mix(in lab, var(--bim-ui_color-main), white 15%)
    );
  }

  ::-webkit-scrollbar-track {
    background-color: var(--bim-scrollbar--bgc, var(--bim-ui_bg-base));
  }
`,kc=M`
  :root {
    /* Backgrounds */
    --bim-ui_bg-base: hsl(210 10% 5%);
    --bim-ui_bg-contrast-10: hsl(210 10% 10%);
    --bim-ui_bg-contrast-20: hsl(210 10% 20%);
    --bim-ui_bg-contrast-40: hsl(210 10% 40%);
    --bim-ui_bg-contrast-60: hsl(210 10% 60%);
    --bim-ui_bg-contrast-80: hsl(210 10% 80%);
    --bim-ui_bg-contrast-100: hsl(210 10% 95%);

    /* Main/accent app color that contrasts with bg-base */
    --bim-ui_bg-main-contrast: #6528d7;
    --bim-ui_bg-accent-contrast: #6528d7;

    /* Colors */
    --bim-ui_color-main: #6528d7;
    --bim-ui_color-accent: #bcf124;

    --bim-ui_main-base: #6528d7;
    --bim-ui_main-contrast: hsl(210 10% 95%);
    --bim-ui_accent-base: #bcf124;
    --bim-ui_accent-contrast: hsl(210 10% 5%);

    /* Sizes */
    --bim-ui_size-4xs: 0.375rem;
    --bim-ui_size-3xs: 0.5rem;
    --bim-ui_size-2xs: 0.625rem;
    --bim-ui_size-xs: 0.75rem;
    --bim-ui_size-sm: 0.875rem;
    --bim-ui_size-base: 1rem;
    --bim-ui_size-lg: 1.125rem;
    --bim-ui_size-xl: 1.25rem;
    --bim-ui_size-2xl: 1.375rem;
    --bim-ui_size-3xl: 1.5rem;
    --bim-ui_size-4xl: 1.625rem;
    --bim-ui_size-5xl: 1.75rem;
    --bim-ui_size-6xl: 1.875rem;
    --bim-ui_size-7xl: 2rem;
    --bim-ui_size-8xl: 2.125rem;
    --bim-ui_size-9xl: 2.25rem;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bim-ui_bg-base: hsl(210 10% 5%);
      --bim-ui_bg-contrast-10: hsl(210 10% 10%);
      --bim-ui_bg-contrast-20: hsl(210 10% 20%);
      --bim-ui_bg-contrast-40: hsl(210 10% 40%);
      --bim-ui_bg-contrast-60: hsl(210 10% 60%);
      --bim-ui_bg-contrast-80: hsl(210 10% 80%);
      --bim-ui_bg-contrast-100: hsl(210 10% 95%);
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      --bim-ui_bg-base: hsl(210 10% 95%);
      --bim-ui_bg-contrast-10: hsl(210 10% 90%);
      --bim-ui_bg-contrast-20: hsl(210 10% 85%);
      --bim-ui_bg-contrast-40: hsl(210 10% 60%);
      --bim-ui_bg-contrast-60: hsl(210 10% 40%);
      --bim-ui_bg-contrast-80: hsl(210 10% 20%);
      --bim-ui_bg-contrast-100: hsl(210 10% 5%);

      --bim-ui_color-main: #6528d7;
      --bim-ui_color-accent: #6528d7;
    }
  }

  html.bim-ui-dark {
    --bim-ui_bg-base: hsl(210 10% 5%);
    --bim-ui_bg-contrast-10: hsl(210 10% 10%);
    --bim-ui_bg-contrast-20: hsl(210 10% 20%);
    --bim-ui_bg-contrast-40: hsl(210 10% 40%);
    --bim-ui_bg-contrast-60: hsl(210 10% 60%);
    --bim-ui_bg-contrast-80: hsl(210 10% 80%);
    --bim-ui_bg-contrast-100: hsl(210 10% 95%);
  }

  html.bim-ui-light {
    --bim-ui_bg-base: hsl(210 10% 95%);
    --bim-ui_bg-contrast-10: hsl(210 10% 90%);
    --bim-ui_bg-contrast-20: hsl(210 10% 85%);
    --bim-ui_bg-contrast-40: hsl(210 10% 60%);
    --bim-ui_bg-contrast-60: hsl(210 10% 40%);
    --bim-ui_bg-contrast-80: hsl(210 10% 20%);
    --bim-ui_bg-contrast-100: hsl(210 10% 5%);

    --bim-ui_color-main: #6528d7;
    --bim-ui_color-accent: #6528d7;
  }

  bim-grid:not([floating]) bim-toolbars-container {
    background-color: var(--bim-ui_bg-base);
  }

  bim-grid[floating] bim-toolbars-container {
    background-color: transparent;
  }
`,Rt={scrollbar:Ac,globalStyles:kc};var Cc=Object.defineProperty,Sc=Object.getOwnPropertyDescriptor,Pc=(i,t,e,s)=>{for(var n=Sc(t,e),o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Cc(t,e,n),n};const Zo=class extends S{constructor(){super(...arguments),this._visible=!1,this._middleware={name:"middleware",async fn(i){const{right:t,top:e}=await cn(i);return i.x-=Math.sign(t)===1?t+5:0,i.y-=Math.sign(e)===1?e+5:0,i}}}get visible(){return this._visible}set visible(i){this._visible=i,i&&this.updatePosition()}async updatePosition(i){const t=i||this.parentNode;if(!t){this.visible=!1,console.warn("No target element found for context-menu.");return}const e=await ho(t,this,{placement:"right",middleware:[Gs(10),co(),lo(),ao({padding:5}),this._middleware]}),{x:s,y:n}=e;this.style.left=`${s}px`,this.style.top=`${n}px`}render(){return v` <slot></slot> `}};Zo.styles=[Rt.scrollbar,M`
      :host {
        --bim-label--fz: var(--bim-ui_size-xs);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        overflow: auto;
        max-height: 20rem;
        min-width: 3rem;
        flex-direction: column;
        box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        border-radius: var(--bim-ui_size-4xs);
        background-color: var(
          --bim-context-menu--bgc,
          var(--bim-ui_bg-contrast-20)
        );
      }

      :host([visible]) {
        display: flex;
      }

      :host(:not([visible])) {
        display: none;
      }
    `];let Go=Zo;Pc([f({type:Boolean,reflect:!0})],Go.prototype,"visible");class Nt extends S{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const s of t)this.elements.add(s);const e=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const s of e)s.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(e=>{const s=e[0];if(!s.isIntersecting)return;const n=s.target;t.unobserve(n);const o=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][o];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const e=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,s=[...this.elements][e];s&&t.observe(s)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const e of this.elements)t.unobserve(e);this.visibleElements=[],this.observeLastElement()}}static create(t,e){const s=document.createDocumentFragment();if(t.length===0)return ni(t(),s),s.firstElementChild;if(!e)throw new Error("UIComponent: Initial state is required for statefull components.");let n=e;const o=t,r=a=>(n={...n,...a},ni(o(n),s),n);return r(e),[s.firstElementChild,r]}}const li=(i,t=!0)=>{let e={};for(const s of i.children){const n=s,o=n.getAttribute("name")||n.getAttribute("label");if(o){if("value"in n){const r=n.value;if(typeof r=="object"&&!Array.isArray(r)&&Object.keys(r).length===0)continue;e[o]=n.value}else if(t){const r=li(n);if(Object.keys(r).length===0)continue;e[o]=r}}else t&&(e={...e,...li(n)})}return e},xi=i=>i==="true"||i==="false"?i==="true":i&&!isNaN(Number(i))&&i.trim()!==""?Number(i):i,Mc=["=",">",">=","<","<=","?","/","#"];function ws(i){const t=Mc.filter(r=>i.split(r).length===2)[0],e=i.split(t).map(r=>r.trim()),[s,n]=e,o=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):xi(n);return{key:s,condition:t,value:o}}const en=i=>{try{const t=[],e=i.split(/&(?![^()]*\))/).map(s=>s.trim());for(const s of e){const n=!s.startsWith("(")&&!s.endsWith(")"),o=s.startsWith("(")&&s.endsWith(")");if(n){const r=ws(s);t.push(r)}if(o){const r={operator:"&",queries:s.replace(/^(\()|(\))$/g,"").split("&").map(a=>a.trim()).map((a,l)=>{const c=ws(a);return l>0&&(c.operator="&"),c})};t.push(r)}}return t}catch{return null}},xs=(i,t,e)=>{let s=!1;switch(t){case"=":s=i===e;break;case"?":s=String(i).includes(String(e));break;case"<":(typeof i=="number"||typeof e=="number")&&(s=i<e);break;case"<=":(typeof i=="number"||typeof e=="number")&&(s=i<=e);break;case">":(typeof i=="number"||typeof e=="number")&&(s=i>e);break;case">=":(typeof i=="number"||typeof e=="number")&&(s=i>=e);break;case"/":s=String(i).startsWith(String(e));break}return s};var Lc=Object.defineProperty,Oc=Object.getOwnPropertyDescriptor,vt=(i,t,e,s)=>{for(var n=s>1?void 0:s?Oc(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&Lc(t,e,n),n};const Qo=class extends S{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?xi(this.label):this.label}set value(i){this._value=i}render(){return v`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?v` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?v`<bim-checkbox
                    style="pointer-events: none"
                    .checked=${this.checked}
                  ></bim-checkbox>`:null}
              <bim-label
                .vertical=${this.vertical}
                .label=${this.label}
                .icon=${this.icon}
                .img=${this.img}
              ></bim-label>
            </div>`:null}
        ${!this.checkbox&&!this.noMark&&this.checked?v`<svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.125rem"
              viewBox="0 0 24 24"
              width="1.125rem"
              fill="#FFFFFF"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>`:null}
        <slot></slot>
      </div>
    `}};Qo.styles=M`
    :host {
      --bim-label--c: var(--bim-ui_bg-contrast-100);
      display: block;
      box-sizing: border-box;
      flex: 1;
      padding: 0rem 0.5rem;
      border-radius: var(--bim-ui_size-4xs);
    }

    :host(:hover) {
      cursor: pointer;
      background-color: color-mix(
        in lab,
        var(--bim-selector--bgc, var(--bim-ui_bg-contrast-20)),
        var(--bim-ui_color-main) 10%
      );
    }

    :host([checked]) {
      --bim-label--c: color-mix(in lab, var(--bim-ui_color-main), white 30%);
    }

    :host([checked]) svg {
      fill: color-mix(in lab, var(--bim-ui_color-main), white 30%);
    }

    .parent {
      box-sizing: border-box;
      display: flex;
      justify-content: var(--bim-option--jc, space-between);
      column-gap: 0.5rem;
      align-items: center;
      min-height: 1.75rem;
      height: 100%;
    }

    input {
      height: 1rem;
      width: 1rem;
      cursor: pointer;
      border: none;
      outline: none;
      accent-color: var(--bim-checkbox--c, var(--bim-ui_color-main));
    }

    input:focus {
      outline: var(--bim-checkbox--olw, 2px) solid
        var(--bim-checkbox--olc, var(--bim-ui_color-accent));
    }

    bim-label {
      pointer-events: none;
    }
  `;let N=Qo;vt([f({type:String,reflect:!0})],N.prototype,"img",2);vt([f({type:String,reflect:!0})],N.prototype,"label",2);vt([f({type:String,reflect:!0})],N.prototype,"icon",2);vt([f({type:Boolean,reflect:!0})],N.prototype,"checked",2);vt([f({type:Boolean,reflect:!0})],N.prototype,"checkbox",2);vt([f({type:Boolean,attribute:"no-mark",reflect:!0})],N.prototype,"noMark",2);vt([f({converter:{fromAttribute(i){return i&&xi(i)}}})],N.prototype,"value",1);vt([f({type:Boolean,reflect:!0})],N.prototype,"vertical",2);var Tc=Object.defineProperty,zc=Object.getOwnPropertyDescriptor,yt=(i,t,e,s)=>{for(var n=s>1?void 0:s?zc(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&Tc(t,e,n),n};const Jo=class extends Nt{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._inputContainer=pt(),this._listElement=pt(),this._visible=!1,this._value=[],this.onValueChange=new Event("change"),this.onWindowMouseUp=i=>{this.visible&&(this.contains(i.target)||(this.visible=!1))},this.onOptionClick=i=>{const t=i.target,e=this._value.includes(t);if(!this.multiple&&!this.required&&!e)this._value=[t];else if(!this.multiple&&!this.required&&e)this._value=[];else if(!this.multiple&&this.required&&!e)this._value=[t];else if(this.multiple&&!this.required&&!e)this._value=[...this._value,t];else if(this.multiple&&!this.required&&e)this._value=this._value.filter(s=>s!==t);else if(this.multiple&&this.required&&!e)this._value=[...this._value,t];else if(this.multiple&&this.required&&e){const s=this._value.filter(n=>n!==t);s.length!==0&&(this._value=s)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(i){this._visible=i,i||this.resetVisibleElements()}get visible(){return this._visible}set value(i){if(this.required&&Object.keys(i).length===0)return;const t=[];for(const e of i){const s=this.findOption(e);if(s&&(t.push(s),!this.multiple&&Object.keys(i).length>1))break}this._value=t,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return this._value.filter(i=>i instanceof N&&i.checked).map(i=>i.value)}get _options(){const i=[...this.elements];for(const t of this.children)t instanceof N&&i.push(t);return i}onSlotChange(i){const t=i.target.assignedElements();this.observe(t);for(const e of t){if(!(e instanceof N)){e.remove();continue}e.removeEventListener("click",this.onOptionClick),e.addEventListener("click",this.onOptionClick)}}updateOptionsState(){for(const i of this._options)i instanceof N&&(this._value.includes(i)?i.checked=!0:i.checked=!1)}findOption(i){return this._options.find(t=>t instanceof N?t.label===i||t.value===i:!1)}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}firstUpdated(){for(const i of this.children)i instanceof N&&i.checked&&this._value.push(i)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){let i,t,e;if(this._value.length===0)i="Select an option...";else if(this._value.length===1){const s=this._value[0];i=(s==null?void 0:s.label)||(s==null?void 0:s.value),t=s==null?void 0:s.img,e=s==null?void 0:s.icon}else i=`Multiple (${this._value.length})`;return v`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div
          ${X(this._inputContainer)}
          class="input"
          @click=${()=>this.visible=!this.visible}
        >
          <bim-label
            label=${i}
            .img=${t}
            .icon=${e}
            style="overflow: hidden;"
          ></bim-label>
          <svg
            style="flex-shrink: 0"
            xmlns="http://www.w3.org/2000/svg"
            height="1.125rem"
            viewBox="0 0 24 24"
            width="1.125rem"
            fill="#9ca3af"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
        <bim-context-menu ${X(this._listElement)} .visible=${this.visible}>
          <slot @slotchange=${this.onSlotChange}></slot>
          ${this.visibleElements.map(s=>s)}
        </bim-context-menu>
      </bim-input>
    `}};Jo.styles=[Rt.scrollbar,M`
      :host {
        --bim-input--bgc: var(
          --bim-dropdown--bgc,
          var(--bim-ui_bg-contrast-20)
        );
        --bim-input--olw: var(--bim-dropdown--olw, 2px);
        --bim-input--olc: var(--bim-dropdown--olc, transparent);
        --bim-input--bdrs: var(--bim-dropdown--bdrs, var(--bim-ui_size-4xs));
        flex: 1;
        display: block;
      }

      :host([visible]) {
        --bim-input--olc: var(
          --bim-dropdown¡focus--c,
          var(--bim-ui_color-accent)
        );
      }

      .input {
        --bim-label--fz: var(--bim-drodown--fz, var(--bim-ui_size-xs));
        --bim-label--c: var(--bim-dropdown--c, var(--bim-ui_bg-contrast-100));
        height: 100%;
        display: flex;
        flex: 1;
        overflow: hidden;
        column-gap: 0.25rem;
        outline: none;
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem;
      }

      bim-label {
        pointer-events: none;
      }
    `];let ct=Jo;yt([f({type:String,reflect:!0})],ct.prototype,"name",2);yt([f({type:String,reflect:!0})],ct.prototype,"icon",2);yt([f({type:String,reflect:!0})],ct.prototype,"label",2);yt([f({type:Boolean,reflect:!0})],ct.prototype,"multiple",2);yt([f({type:Boolean,reflect:!0})],ct.prototype,"required",2);yt([f({type:Boolean,reflect:!0})],ct.prototype,"vertical",2);yt([f({type:Boolean,reflect:!0})],ct.prototype,"visible",1);yt([Oe()],ct.prototype,"_value",2);var Rc=Object.defineProperty,tr=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Rc(t,e,n),n};const er=class extends S{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(i){const t=i.split(`
`).map(e=>e.trim()).map(e=>e.split('"')[1]).filter(e=>e!==void 0).flatMap(e=>e.split(/\s+/));return[...new Set(t)].filter(e=>e!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const i=this.layouts[this.layout],t=this.getUniqueAreasFromTemplate(i.template).map(e=>{const s=i.elements[e];return s&&(s.style.gridArea=e),s}).filter(e=>!!e);this.style.gridTemplate=i.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...t)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return v`<slot></slot>`}};er.styles=M`
    :host {
      display: grid;
      height: 100%;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* :host(:not([layout])) {
      display: none;
    } */

    :host([floating]) {
      --bim-panel--bdrs: var(--bim-ui_size-4xs);
      background-color: transparent;
      padding: 1rem;
      gap: 1rem;
      position: absolute;
      pointer-events: none;
      top: 0px;
      left: 0px;
    }

    :host(:not([floating])) {
      --bim-panel--bdrs: 0;
      background-color: var(--bim-ui_bg-contrast-20);
      gap: 1px;
    }
  `;let $n=er;tr([f({type:Boolean,reflect:!0})],$n.prototype,"floating");tr([f({type:String,reflect:!0})],$n.prototype,"layout");const nn=class extends S{render(){return v`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};nn.styles=M`
    :host {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
    }

    iconify-icon {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
      color: var(--bim-icon--c);
    }
  `,nn.properties={icon:{type:String}};let Nc=nn;var Ic=Object.defineProperty,$i=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Ic(t,e,n),n};const ir=class extends S{constructor(){super(),this.onValueChange=new Event("change"),this.vertical=!1}get value(){const i={};for(const t of this.children){const e=t;"value"in e?i[e.name||e.label]=e.value:"checked"in e&&(i[e.name||e.label]=e.checked)}return i}set value(i){const t=[...this.children];for(const e in i){const s=t.find(r=>{const a=r;return a.name===e||a.label===e});if(!s)continue;const n=s,o=i[e];typeof o=="boolean"?n.checked=o:n.value=o}}render(){return v`
      <div class="parent">
        ${this.label||this.icon?v`<bim-label
              .label=${this.label}
              .icon=${this.icon}
            ></bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};ir.styles=M`
    :host {
      flex: 1;
      display: block;
    }

    .parent {
      display: flex;
      flex-wrap: wrap;
      column-gap: 1rem;
      row-gap: 0.375rem;
      user-select: none;
      flex: 1;
    }

    :host(:not([vertical])) .parent {
      justify-content: space-between;
    }

    :host([vertical]) .parent {
      flex-direction: column;
    }

    .input {
      overflow: hidden;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      min-height: 1.75rem;
      min-width: 4rem;
      gap: var(--bim-input--g, var(--bim-ui_size-4xs));
      padding: var(--bim-input--p, 0);
      background-color: var(--bim-input--bgc, transparent);
      outline: var(--bim-input--olw, 2px) solid
        var(--bim-input--olc, transparent);
      border-radius: var(--bim-input--bdrs, var(--bim-ui_size-4xs));
    }

    :host(:not([vertical])) .input {
      flex: 1;
      justify-content: flex-end;
    }

    :host(:not([vertical])[label]) .input {
      max-width: 13rem;
    }
  `;let Ne=ir;$i([f({type:String,reflect:!0})],Ne.prototype,"name");$i([f({type:String,reflect:!0})],Ne.prototype,"label");$i([f({type:String,reflect:!0})],Ne.prototype,"icon");$i([f({type:Boolean,reflect:!0})],Ne.prototype,"vertical");var jc=Object.defineProperty,ie=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&jc(t,e,n),n};const nr=class extends S{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.label?xi(this.label):this.label}render(){return v`
      <div class="parent" .title=${this.label??""}>
        ${this.img?v`<img .src=${this.img} .alt=${this.label||""} />`:null}
        ${!this.iconHidden&&this.icon?v`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        ${!this.labelHidden&&this.label?v`<label>${this.label}</label>`:null}
      </div>
    `}};nr.styles=M`
    :host {
      --bim-icon--c: var(--bim-label--c);
      color: var(--bim-label--c, var(--bim-ui_bg-contrast-60));
      font-size: var(--bim-label--fz, var(--bim-ui_size-xs));
      overflow: hidden;
    }

    .parent {
      display: flex;
      align-items: center;
      column-gap: 0.25rem;
      row-gap: 0.125rem;
      user-select: none;
      height: 100%;
    }

    :host([vertical]) .parent {
      flex-direction: column;
    }

    label {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    img {
      height: 100%;
      aspect-ratio: 1;
      border-radius: 100%;
      margin-right: 0.125rem;
    }

    :host(:not([vertical])) img {
      max-height: var(
        --bim-label_icon--sz,
        calc(var(--bim-label--fz, var(--bim-ui_size-xs)) * 1.5)
      );
    }

    :host([vertical]) img {
      max-height: var(
        --bim-label_icon--sz,
        calc(var(--bim-label--fz, var(--bim-ui_size-xs)) * 4)
      );
    }
  `;let It=nr;ie([f({type:String,reflect:!0})],It.prototype,"label");ie([f({type:String,reflect:!0})],It.prototype,"img");ie([f({type:Boolean,attribute:"label-hidden",reflect:!0})],It.prototype,"labelHidden");ie([f({type:String,reflect:!0})],It.prototype,"icon");ie([f({type:Boolean,attribute:"icon-hidden",reflect:!0})],It.prototype,"iconHidden");ie([f({type:Boolean,reflect:!0})],It.prototype,"vertical");var Hc=Object.defineProperty,Dc=Object.getOwnPropertyDescriptor,Q=(i,t,e,s)=>{for(var n=s>1?void 0:s?Dc(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&Hc(t,e,n),n};const sr=class extends S{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=pt(),this.onValueChange=new Event("change")}set value(i){this.setValue(i.toString())}get value(){return this._value}onChange(i){i.stopPropagation();const{value:t}=this._input;t&&this.setValue(t.value)}setValue(i){const{value:t}=this._input;let e=i;if(e=e.replace(/[^0-9.-]/g,""),e=e.replace(/(\..*)\./g,"$1"),e.endsWith(".")||(e.lastIndexOf("-")>0&&(e=e[0]+e.substring(1).replace(/-/g,"")),e==="-"||e==="-0"))return;let s=Number(e);Number.isNaN(s)||(s=this.min!==void 0?Math.max(s,this.min):s,s=this.max!==void 0?Math.min(s,this.max):s,this.value!==s&&(this._value=s,t&&(t.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:i}=this._input;i&&Number.isNaN(Number(i.value))&&(i.value=this.value.toString())}onSliderMouseDown(i){document.body.style.cursor="w-resize";const{clientX:t}=i,e=this.value;let s=!1;const n=a=>{var l;s=!0;const{clientX:c}=a,h=this.step??1,u=((l=h.toString().split(".")[1])==null?void 0:l.length)||0,d=1/(this.sensitivity??1),p=(c-t)/d;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const m=e+p*h;this.setValue(m.toFixed(u))},o=()=>{this.slider=!0,this.removeEventListener("blur",o)},r=()=>{document.removeEventListener("mousemove",n),document.body.style.cursor="default",s?s=!1:(this.addEventListener("blur",o),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",n),document.addEventListener("mouseup",r)}onFocus(i){i.stopPropagation();const t=e=>{e.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",t))};window.addEventListener("keydown",t)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:i}=this._input;i&&i.focus()}render(){const i=v`
      ${this.pref||this.icon?v`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .label=${this.pref}
            .icon=${this.icon}
          ></bim-label>`:null}
      <input
        ${X(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${r=>r.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.suffix?v`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .label=${this.suffix}
          ></bim-label>`:null}
    `,t=this.min??-1/0,e=this.max??1/0,s=100*(this.value-t)/(e-t),n=v`
      <style>
        .slider-indicator {
          width: ${`${s}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?v`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .label=${`${this.pref}: `}
              .icon=${this.icon}
            ></bim-label>`:null}
        <bim-label
          style="z-index: 1;"
          .label=${this.value.toString()}
        ></bim-label>
        ${this.suffix?v`<bim-label
              style="z-index: 1;"
              .label=${this.suffix}
            ></bim-label>`:null}
      </div>
    `,o=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return v`
      <bim-input
        title=${o}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?n:i}
      </bim-input>
    `}};sr.styles=M`
    :host {
      --bim-input--bgc: var(
        --bim-number-input--bgc,
        var(--bim-ui_bg-contrast-20)
      );
      --bim-input--olw: var(--bim-number-input--olw, 2px);
      --bim-input--olc: var(--bim-number-input--olc, transparent);
      --bim-input--bdrs: var(--bim-number-input--bdrs, var(--bim-ui_size-4xs));
      --bim-input--p: 0 0.375rem;
      flex: 1;
      display: block;
    }

    :host(:focus) {
      --bim-input--olw: var(--bim-number-input--olw, 2px);
      --bim-input--olc: var(
        --bim-number-input¡focus--c,
        var(--bim-ui_color-accent)
      );
    }

    :host(:not([slider])) bim-label {
      --bim-label--c: var(
        --bim-number-input_affixes--c,
        var(--bim-ui_bg-contrast-60)
      );
      --bim-label--fz: var(
        --bim-number-input_affixes--fz,
        var(--bim-ui_size-xs)
      );
    }

    p {
      margin: 0;
      padding: 0;
    }

    input {
      background-color: transparent;
      outline: none;
      border: none;
      padding: 0;
      flex-grow: 1;
      text-align: right;
      font-family: inherit;
      font-feature-settings: inherit;
      font-variation-settings: inherit;
      font-size: var(--bim-number-input--fz, var(--bim-ui_size-xs));
      color: var(--bim-number-input--c, var(--bim-ui_bg-contrast-100));
    }

    :host([suffix]:not([pref])) input {
      text-align: left;
    }

    :host([slider]) {
      --bim-input--p: 0;
    }

    :host([slider]) .slider {
      --bim-label--c: var(--bim-ui_bg-contrast-100);
    }

    .slider {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .slider-indicator {
      height: 100%;
      background-color: var(--bim-ui_color-main);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: var(--bim-input--bdrs, var(--bim-ui_size-4xs));
    }

    bim-input {
      display: flex;
    }

    bim-label {
      pointer-events: none;
    }
  `;let q=sr;Q([f({type:String,reflect:!0})],q.prototype,"name",2);Q([f({type:String,reflect:!0})],q.prototype,"icon",2);Q([f({type:String,reflect:!0})],q.prototype,"label",2);Q([f({type:String,reflect:!0})],q.prototype,"pref",2);Q([f({type:Number,reflect:!0})],q.prototype,"min",2);Q([f({type:Number,reflect:!0})],q.prototype,"value",1);Q([f({type:Number,reflect:!0})],q.prototype,"step",2);Q([f({type:Number,reflect:!0})],q.prototype,"sensitivity",2);Q([f({type:Number,reflect:!0})],q.prototype,"max",2);Q([f({type:String,reflect:!0})],q.prototype,"suffix",2);Q([f({type:Boolean,reflect:!0})],q.prototype,"vertical",2);Q([f({type:Boolean,reflect:!0})],q.prototype,"slider",2);var Bc=Object.defineProperty,Uc=Object.getOwnPropertyDescriptor,Ei=(i,t,e,s)=>{for(var n=s>1?void 0:s?Uc(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&Bc(t,e,n),n};const or=class extends S{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.activationButton=document.createElement("bim-button")}set hidden(i){this._hidden=i,this.activationButton.active=!i,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return li(this)}set value(i){const t=[...this.children];for(const e in i){const s=t.find(o=>{const r=o;return r.name===e||r.label===e});if(!s)continue;const n=s;n.value=i[e]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const i=this.querySelectorAll("bim-panel-section");for(const t of i)t.collapsed=!0}expandSections(){const i=this.querySelectorAll("bim-panel-section");for(const t of i)t.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,v`
      <div class="parent">
        ${this.label||this.name||this.icon?v`<bim-label
              .label=${this.label||this.name}
              .icon=${this.icon}
            ></bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};or.styles=[Rt.scrollbar,M`
      :host {
        display: flex;
        border-radius: var(--bim-ui_size-base);
        background-color: var(--bim-ui_bg-base);
        min-width: 20rem;
        overflow: auto;
      }

      :host([hidden]) {
        display: none;
      }

      .parent {
        display: flex;
        flex: 1;
        flex-direction: column;
        pointer-events: auto;
      }

      .parent bim-label {
        --bim-label--c: var(--bim-panel--c, var(--bim-ui_bg-contrast-80));
        --bim-label--fz: var(--bim-panel--fz, var(--bim-ui_size-sm));
        font-weight: 600;
        padding: 1rem;
        flex-shrink: 0;
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      }

      .sections {
        display: flex;
        flex-direction: column;
        overflow: auto;
      }

      ::slotted(bim-panel-section:not(:last-child)) {
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      }
    `];let Ie=or;Ei([f({type:String,reflect:!0})],Ie.prototype,"icon",2);Ei([f({type:String,reflect:!0})],Ie.prototype,"name",2);Ei([f({type:String,reflect:!0})],Ie.prototype,"label",2);Ei([f({type:Boolean,reflect:!0})],Ie.prototype,"hidden",1);var Fc=Object.defineProperty,je=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Fc(t,e,n),n};const rr=class extends S{constructor(){super(...arguments),this.onValueChange=new Event("change")}get value(){return li(this)}set value(i){const t=[...this.children];for(const e in i){const s=t.find(o=>{const r=o;return r.name===e||r.label===e});if(!s)continue;const n=s;n.value=i[e]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const i=this.label||this.icon||this.name||this.fixed,t=v`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,e=v`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,s=this.collapsed?t:e,n=v`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?v`<bim-label
              .label=${this.label||this.name}
              .icon=${this.icon}
            ></bim-label>`:null}
        ${this.fixed?null:s}
      </div>
    `;return v`
      <div class="parent">
        ${i?n:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};rr.styles=[Rt.scrollbar,M`
      :host {
        display: block;
        /* height: 100%; */
        pointer-events: auto;
      }

      :host(:not([fixed])) .header:hover {
        --bim-label--c: var(
          --bim-panel-section¡hover,
          var(--bim-ui_color-accent)
        );
        cursor: pointer;
        color: var(--bim-panel-section¡hover, var(--bim-ui_color-accent));
      }

      :host(:not([fixed])) .header:hover svg {
        fill: var(--bim-panel-section¡hover, var(--bim-ui_color-accent));
      }

      .header {
        --bim-label--fz: var(--bim-panel--fz, var(--bim-ui_size-sm));
        z-index: 3;
        flex-shrink: 0;
        /* position: sticky;
        top: 0; */
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        user-select: none;
        height: 1.5rem;
        padding: 0.75rem 1rem;
        /* background-color: var(--bim-panel-section--bgc, var(--bim-ui_bg-base)); */
        color: var(--bim-panel-section--c, var(--bim-ui_bg-contrast-80));
      }

      .header svg {
        fill: var(--bim-panel-section--c, var(--bim-ui_bg-contrast-80));
      }

      .title {
        display: flex;
        align-items: center;
        column-gap: 0.5rem;
      }

      .title p {
        font-size: var(--bim-panel-section--fz, var(--bim-ui_size-sm));
      }

      .components {
        display: flex;
        flex-direction: column;
        row-gap: 0.75rem;
        padding: 0.125rem 1rem 1rem;
      }

      :host(:not([fixed])[collapsed]) .components {
        display: none;
      }

      bim-label {
        pointer-events: none;
      }
    `];let ne=rr;je([f({type:String,reflect:!0})],ne.prototype,"icon");je([f({type:String,reflect:!0})],ne.prototype,"label");je([f({type:String,reflect:!0})],ne.prototype,"name");je([f({type:Boolean,reflect:!0})],ne.prototype,"fixed");je([f({type:Boolean,reflect:!0})],ne.prototype,"collapsed");var Vc=Object.defineProperty,He=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Vc(t,e,n),n};const ar=class extends S{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=i=>{this._value=i.target,this.dispatchEvent(this.onValueChange);for(const t of this.children)t instanceof N&&(t.checked=t===i.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(i){const t=this.findOption(i);if(t){for(const e of this._options)e.checked=e===t;this._value=t,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(i){const t=i.target.assignedElements();for(const e of t)e instanceof N&&(e.noMark=!0,e.removeEventListener("click",this.onOptionClick),e.addEventListener("click",this.onOptionClick))}findOption(i){return this._options.find(t=>t instanceof N?t.label===i||t.value===i:!1)}firstUpdated(){const i=[...this.children].find(t=>t instanceof N&&t.checked);i&&(this._value=i)}render(){return v`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};ar.styles=M`
    :host {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
      --bim-input--g: 0;
      --bim-option--jc: center;
      flex: 1;
      display: block;
    }

    ::slotted(bim-option) {
      border-radius: 0;
    }

    ::slotted(bim-option[checked]) {
      --bim-label--c: white;
      background-color: var(--bim-ui_color-main);
    }
  `;let se=ar;He([f({type:String,reflect:!0})],se.prototype,"name");He([f({type:String,reflect:!0})],se.prototype,"icon");He([f({type:String,reflect:!0})],se.prototype,"label");He([f({type:Boolean,reflect:!0})],se.prototype,"vertical");He([Oe()],se.prototype,"_value");var Yc=Object.defineProperty,Wc=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Yc(t,e,n),n};const lr=class extends S{constructor(){super(...arguments),this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return v`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};lr.styles=M`
    :host {
      padding: 0.25rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ::slotted(*) {
      --bim-input--bgc: transparent;
      --bim-input--olc: var(--bim-ui_bg-contrast-20);
      --bim-input--olw: 1px;
    }

    ::slotted(bim-input) {
      --bim-input--olw: 0;
    }
  `;let cr=lr;Wc([f({type:String,reflect:!0})],cr.prototype,"column");var Xc=Object.defineProperty,qc=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Xc(t,e,n),n};const hr=class extends S{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(i,t=!1){for(const e of this._groups)e.childrenHidden=typeof i>"u"?!e.childrenHidden:!i,t&&e.toggleChildren(i,t)}render(){return this._groups=[],v`
      ${this.data.map(i=>{const t=document.createElement("bim-table-group");return this._groups.push(t),t.table=this.table,t.data=i,t})}
    `}};hr.styles=M`
    :host {
      position: relative;
      grid-area: Children;
    }

    :host([hidden]) {
      display: none;
    }
  `;let ur=hr;qc([f({type:Array,attribute:!1})],ur.prototype,"data");var Kc=Object.defineProperty,Zc=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Kc(t,e,n),n};const dr=class extends S{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(i,t=!1){this._children&&(this.childrenHidden=typeof i>"u"?!this.childrenHidden:!i,t&&this._children.toggleGroups(i,t))}render(){var i,t;const e=((i=this.table)==null?void 0:i.getGroupIndentation(this.data))??0,s=v`
      <style>
        .branch-vertical {
          left: ${e+.5625}rem;
        }
      </style>
      <div class="branch branch-vertical"></div>
    `,n=document.createElement("div");n.classList.add("branch","branch-horizontal"),n.style.left=`${e-1+.5625}rem`;const o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.setAttribute("height","9.5"),o.setAttribute("width","7.5"),o.setAttribute("viewBox","0 0 4.6666672 7.3333333");const r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),o.append(r);const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","6.5"),a.setAttribute("width","9.5"),a.setAttribute("viewBox","0 0 5.9111118 5.0175439");const l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),a.append(l);const c=document.createElement("div");c.addEventListener("click",()=>this.toggleChildren()),c.classList.add("caret"),c.style.left=`${.125+e}rem`,this.childrenHidden?c.append(o):c.append(a);const h=document.createElement("bim-table-row");h.table=this.table,h.data=this.data.data,(t=this.table)==null||t.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:h}})),this.data.children&&h.append(c),e!==0&&(!this.data.children||this.childrenHidden)&&h.append(n);let u;return this.data.children&&(u=document.createElement("bim-table-children"),this._children=u,u.table=this.table,u.data=this.data.children),v`
      <div class="parent">
        ${this.data.children&&!this.childrenHidden?s:null}
        ${h} ${this.childrenHidden?null:u}
      </div>
    `}};dr.styles=M`
    :host {
      position: relative;
    }

    .parent {
      display: grid;
      grid-template-areas: "Data" "Children";
    }

    .branch {
      position: absolute;
      z-index: 1;
    }

    .branch-vertical {
      top: 1rem;
      bottom: 1rem;
      border-left: 1px dotted var(--bim-ui_bg-contrast-40);
    }

    .branch-horizontal {
      top: 50%;
      width: 1rem;
      border-bottom: 1px dotted var(--bim-ui_bg-contrast-40);
    }

    .caret {
      position: absolute;
      z-index: 2;
      transform: translateY(-50%) rotate(0deg);
      top: 50%;
      display: flex;
      width: 0.95rem;
      height: 0.95rem;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .caret svg {
      fill: var(--bim-ui_bg-contrast-60);
    }
  `;let pr=dr;Zc([f({type:Boolean,attribute:"children-hidden",reflect:!0})],pr.prototype,"childrenHidden");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $s=i=>cl(i)?i._$litType$.h:i.strings,Gc=$o(class extends Eo{constructor(i){super(i),this.et=new WeakMap}render(i){return[i]}update(i,[t]){const e=Qn(this.it)?$s(this.it):null,s=Qn(t)?$s(t):null;if(e!==null&&(s===null||e!==s)){const n=is(i).pop();let o=this.et.get(e);if(o===void 0){const r=document.createDocumentFragment();o=ni(z,r),o.setConnected(!1),this.et.set(e,o)}es(o,[n]),ts(o,void 0,n)}if(s!==null){if(e===null||e!==s){const n=this.et.get(s);if(n!==void 0){const o=is(n).pop();dl(i),ts(i,void 0,o),es(i,[o])}}this.it=t}else this.it=void 0;return this.render(t)}});var Qc=Object.defineProperty,Ai=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&Qc(t,e,n),n};const mr=class extends S{constructor(){super(),this.data={},this._table=this.closest("bim-table"),this.onTableIndentationColorChange=i=>{var t;if(!this.table)return;const e=i.detail,{indentationLevel:s,color:n}=e;((t=this.table)==null?void 0:t.getRowIndentation(this.data))===s&&(this.style.backgroundColor=n)},this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this._observer=new IntersectionObserver(i=>{this._intersecting=i[0].isIntersecting},{rootMargin:"10px"}),this.columns=[],this.isHeader=!1}get _columnNames(){return this.columns.map(i=>i.name)}get _columnWidths(){return this.columns.map(i=>i.width)}set table(i){this._table&&(this.columns=[],this._table.removeEventListener("columnschange",this.onTableColumnsChange)),this._table=i,this._table&&(this.columns=this._table.columns,this._table.addEventListener("columnschange",this.onTableColumnsChange),this._table.addEventListener("indentation",this.onTableIndentationColorChange))}get table(){return this._table}connectedCallback(){super.connectedCallback(),this._observer.observe(this)}compute(){var i,t;const e=((i=this.table)==null?void 0:i.getRowIndentation(this.data))??0,s=this.isHeader?this.data:((t=this.table)==null?void 0:t.computeRowDeclaration(this.data))??this.data,n=[];for(const o in s){const r=s[o];let a;typeof r=="string"||typeof r=="boolean"||typeof r=="number"?a=v`<bim-label label="${r}"></bim-label>`:a=r;const l=this._columnNames.indexOf(o)===0,c=`
        ${l&&!this.isHeader?"justify-content: normal":""};
        ${l&&!this.isHeader?`margin-left: ${e+.125}rem`:""}
      `,h=v`
        <bim-table-cell ${X(u=>{if(!u)return;const d=u;d.rowData=this.data,setTimeout(()=>{var p;(p=this.table)==null||p.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:d}}))})})} style="${c}" .column=${o}
          >${a}</bim-table-cell
        >
      `;n.push(h)}return v`
      <style>
        :host {
          grid-template-areas: "${this._columnNames.join(" ")}";
          grid-template-columns: ${this._columnWidths.join(" ")};
        }
      </style>
      ${n}
      <slot></slot>
    `}render(){return v`${Gc(this._intersecting?this.compute():v``)}`}};mr.styles=M`
    :host {
      position: relative;
      grid-area: Data;
      display: grid;
      min-height: 2.25rem;
      /* border-bottom: 1px solid var(--bim-ui_bg-contrast-20); */
    }
  `;let De=mr;Ai([f({type:Array,attribute:!1})],De.prototype,"columns");Ai([f({type:Object,attribute:!1})],De.prototype,"data");Ai([f({type:Boolean,attribute:"is-header",reflect:!0})],De.prototype,"isHeader");Ai([Oe()],De.prototype,"_intersecting");var Jc=Object.defineProperty,th=Object.getOwnPropertyDescriptor,jt=(i,t,e,s)=>{for(var n=s>1?void 0:s?th(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&Jc(t,e,n),n};const fr=class extends S{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.definition={},this._stringFilterFunction=(i,t)=>Object.values(t.data).some(e=>String(e).toLowerCase().includes(i.toLowerCase())),this._queryFilterFunction=(i,t)=>{let e=!1;const s=en(i)??[];for(const n of s){if("queries"in n){e=!1;break}const{condition:o,value:r}=n;let{key:a}=n;if(a.startsWith("[")&&a.endsWith("]")){const l=a.replace("[","").replace("]","");a=l,e=Object.keys(t.data).filter(c=>c.includes(l)).map(c=>xs(t.data[c],o,r)).some(c=>c)}else e=xs(t.data[a],o,r);if(!e)break}return e}}set columns(i){const t=[];for(const e of i){const s=typeof e=="string"?{name:e,width:`minmax(${this.minColWidth}, 1fr)`}:e;t.push(s)}this._columns=t,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const i={};for(const t of this.columns)if(typeof t=="string")i[t]=t;else{const{name:e}=t;i[e]=e}return i}get value(){return this.queryString?this._filteredData:this.data}set queryString(i){const t=i&&i.trim()!==""?i.trim():null;this._queryString=t,t?(en(t)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(t)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(t)),this.preserveStructureOnFilter&&(this._expandedBeforeSearch===void 0&&(this._expandedBeforeSearch=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeSearch!==void 0&&(this.expanded=this._expandedBeforeSearch,this._expandedBeforeSearch=void 0),this._filteredData=this.data)}get queryString(){return this._queryString}set data(i){this._data=i,this.computeMissingColumns(i)&&(this.columns=this._columns)}get data(){return this._data}computeMissingColumns(i){let t=!1;for(const e of i){const{children:s,data:n}=e;for(const o in n)this._columns.map(r=>typeof r=="string"?r:r.name).includes(o)||(this._columns.push({name:o,width:`minmax(${this.minColWidth}, 1fr)`}),t=!0);if(s){const o=this.computeMissingColumns(s);o&&!t&&(t=o)}}return t}generateText(i="comma",t=this.value,e="",s=!0){const n=this._textDelimiters[i];let o="";const r=this.columns.map(a=>a.name);if(s){this.indentationInText&&(o+=`Indentation${n}`);const a=`${r.join(n)}
`;o+=a}for(const[a,l]of t.entries()){const{data:c,children:h}=l,u=this.indentationInText?`${e}${a+1}${n}`:"",d=r.map(m=>c[m]??""),p=`${u}${d.join(n)}
`;o+=p,h&&(o+=this.generateText(i,l.children,`${e}${a+1}.`,!1))}return o}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}computeRowDeclaration(i){const t={};for(const e in i){const s=this.definition[e];s?t[e]=s(i[e],i):t[e]=i[e]}return t}downloadData(i="BIM Table Data",t="json"){let e=null;if(t==="json"&&(e=new File([JSON.stringify(this.value,void 0,2)],`${i}.json`)),t==="csv"&&(e=new File([this.csv],`${i}.csv`)),t==="tsv"&&(e=new File([this.tsv],`${i}.tsv`)),!e)return;const s=document.createElement("a");s.href=URL.createObjectURL(e),s.download=e.name,s.click(),URL.revokeObjectURL(s.href)}getRowIndentation(i,t=this.value,e=0){for(const s of t){if(s.data===i)return e;if(s.children){const n=this.getRowIndentation(i,s.children,e+1);if(n!==null)return n}}return null}getGroupIndentation(i,t=this.value,e=0){for(const s of t){if(s===i)return e;if(s.children){const n=this.getGroupIndentation(i,s.children,e+1);if(n!==null)return n}}return null}setIndentationColor(i,t){const e=new CustomEvent("indentation",{detail:{indentationLevel:i,color:t}});this.dispatchEvent(e)}filter(i,t=this.filterFunction??this._stringFilterFunction,e=this.data){const s=[];for(const n of e)if(t(i,n)){if(this.preserveStructureOnFilter){const o={data:n.data};if(n.children){const r=this.filter(i,t,n.children);r.length&&(o.children=r)}s.push(o)}else if(s.push({data:n.data}),n.children){const o=this.filter(i,t,n.children);s.push(...o)}}else if(n.children){const o=this.filter(i,t,n.children);this.preserveStructureOnFilter&&o.length?s.push({data:n.data,children:o}):s.push(...o)}return s}render(){const i=document.createElement("bim-table-row");i.table=this,i.isHeader=!0,i.data=this._headerRowData,i.style.gridArea="Header",i.style.position="sticky",i.style.top="0",i.style.zIndex="5";const t=document.createElement("bim-table-children");return t.table=this,t.data=this.value,t.style.gridArea="Body",t.style.backgroundColor="transparent",v`
      <div class="parent">
        ${this.headersHidden?null:i}
        <div style="overflow-x: hidden; grid-area: Body">${t}</div>
      </div>
    `}};fr.styles=[Rt.scrollbar,M`
      :host {
        --bim-button--bgc: transparent;
        position: relative;
        overflow: auto;
        display: block;
        pointer-events: auto;
      }

      .parent {
        display: grid;
        grid-template:
          "Header" auto
          "Body" 1fr
          "Footer" auto;
        overflow: auto;
        height: 100%;
      }

      .parent > bim-table-row[is-header] {
        color: var(--bim-table_header--c, var(--bim-ui_bg-contrast-100));
        background-color: var(
          --bim-table_header--bgc,
          var(--bim-ui_bg-contrast-20)
        );
      }

      .controls {
        display: flex;
        gap: 0.375rem;
        flex-wrap: wrap;
        margin-bottom: 0.5rem;
      }
    `];let _t=fr;jt([Oe()],_t.prototype,"_filteredData",2);jt([f({type:Boolean,attribute:"headers-hidden",reflect:!0})],_t.prototype,"headersHidden",2);jt([f({type:String,attribute:"min-col-width",reflect:!0})],_t.prototype,"minColWidth",2);jt([f({type:Array,attribute:!1})],_t.prototype,"columns",1);jt([f({type:String,attribute:"search-string",reflect:!0})],_t.prototype,"queryString",1);jt([f({type:Array,attribute:!1})],_t.prototype,"data",1);jt([f({type:Boolean,reflect:!0})],_t.prototype,"expanded",2);var eh=Object.defineProperty,ih=Object.getOwnPropertyDescriptor,ki=(i,t,e,s)=>{for(var n=s>1?void 0:s?ih(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&eh(t,e,n),n};const br=class extends S{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(i){this._hidden=i,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:i}=this;if(i&&this.name===this._defaultName){const t=[...i.children].indexOf(this);this.name=`${this._defaultName}${t}`}}render(){return v` <slot></slot> `}};br.styles=M`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let Z=br;ki([f({type:String,reflect:!0})],Z.prototype,"name",2);ki([f({type:String,reflect:!0})],Z.prototype,"label",2);ki([f({type:String,reflect:!0})],Z.prototype,"icon",2);ki([f({type:Boolean,reflect:!0})],Z.prototype,"hidden",1);var nh=Object.defineProperty,sh=Object.getOwnPropertyDescriptor,Be=(i,t,e,s)=>{for(var n=s>1?void 0:s?sh(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&nh(t,e,n),n};const gr=class extends S{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.onTabHiddenChange=i=>{const t=i.target;t instanceof Z&&!t.hidden&&(t.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=t.name,t.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(i){this._tab=i;const t=[...this.children],e=t.find(s=>s instanceof Z&&s.name===i);for(const s of t){if(!(s instanceof Z))continue;s.hidden=e!==s;const n=this.getTabSwitcher(s.name);n&&n.toggleAttribute("data-active",!s.hidden)}}get tab(){return this._tab}getTabSwitcher(i){return this._switchers.find(t=>t.getAttribute("data-name")===i)}createSwitchers(){this._switchers=[];for(const i of this.children){if(!(i instanceof Z))continue;const t=document.createElement("div");t.addEventListener("click",()=>{this.tab===i.name?this.toggleAttribute("tab",!1):this.tab=i.name}),t.setAttribute("data-name",i.name),t.className="switcher";const e=document.createElement("bim-label");e.label=i.label,e.icon=i.icon,t.append(e),this._switchers.push(t)}}onSlotChange(i){this.createSwitchers();const t=i.target.assignedElements(),e=t.find(s=>s instanceof Z?this.tab?s.name===this.tab:!s.hidden:!1);e&&e instanceof Z&&(this.tab=e.name);for(const s of t){if(!(s instanceof Z)){s.remove();continue}s.removeEventListener("hiddenchange",this.onTabHiddenChange),e!==s&&(s.hidden=!0),s.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return v`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};gr.styles=[Rt.scrollbar,M`
      * {
        box-sizing: border-box;
      }

      :host {
        background-color: var(--bim-ui_bg-base);
        display: block;
        overflow: auto;
      }

      .parent {
        display: grid;
        grid-template: "switchers" auto "content" 1fr;
        height: 100%;
      }

      :host([bottom]) .parent {
        grid-template: "content" 1fr "switchers" auto;
      }

      .switchers {
        display: flex;
        height: 2.25rem;
        font-weight: 600;
        grid-area: switchers;
      }

      .switcher {
        cursor: pointer;
        pointer-events: auto;
        background-color: var(--bim-ui_bg-base);
        padding: 0rem 0.75rem;
        color: var(--bim-ui_bg-contrast-60);
      }

      .switcher:hover,
      .switcher[data-active] {
        --bim-label--c: var(--bim-ui_main-contrast);
        background-color: var(--bim-ui_color-main);
      }

      .switchers bim-label {
        pointer-events: none;
      }

      :host([switchers-hidden]) .switchers {
        display: none;
      }

      .content {
        grid-area: content;
        overflow: auto;
      }

      :host(:not([bottom])) .content {
        border-top: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host([bottom]) .content {
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host(:not([tab])) .content {
        display: none;
      }

      :host([floating]) {
        background-color: transparent;
      }

      :host([floating]) .switchers {
        justify-self: center;
        overflow: auto;
      }

      :host([floating]:not([bottom])) .switchers {
        border-radius: var(--bim-ui_size-2xs) var(--bim-ui_size-2xs) 0 0;
        border-top: 1px solid var(--bim-ui_bg-contrast-20);
        border-left: 1px solid var(--bim-ui_bg-contrast-20);
        border-right: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host([floating][bottom]) .switchers {
        border-radius: 0 0 var(--bim-ui_size-2xs) var(--bim-ui_size-2xs);
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
        border-left: 1px solid var(--bim-ui_bg-contrast-20);
        border-right: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host([floating]:not([tab])) .switchers {
        border-radius: var(--bim-ui_size-2xs);
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host([floating][bottom]:not([tab])) .switchers {
        border-top: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host([floating]) .content {
        border: 1px solid var(--bim-ui_bg-contrast-20);
        border-radius: var(--bim-ui_size-2xs);
        background-color: var(--bim-ui_bg-base);
      }
    `];let oe=gr;Be([Oe()],oe.prototype,"_switchers",2);Be([f({type:Boolean,reflect:!0})],oe.prototype,"bottom",2);Be([f({type:Boolean,attribute:"switchers-hidden",reflect:!0})],oe.prototype,"switchersHidden",2);Be([f({type:Boolean,reflect:!0})],oe.prototype,"floating",2);Be([f({type:String,reflect:!0})],oe.prototype,"tab",1);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oh=i=>i??z;var rh=Object.defineProperty,ah=Object.getOwnPropertyDescriptor,wt=(i,t,e,s)=>{for(var n=s>1?void 0:s?ah(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&rh(t,e,n),n};const vr=class extends S{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(i){this._inputTypes.includes(i)&&(this._type=i)}get type(){return this._type}get query(){return en(this.value)}onInputChange(i){i.stopPropagation();const t=i.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=t.value,this.dispatchEvent(this.onValueChange)},this.debounce)}render(){return v`
      <bim-input
        .name=${this.name}
        .icon=${this.icon}
        .label=${this.label}
        .vertical=${this.vertical}
      >
        <input
          aria-label=${this.label||this.name||"Checkbox Input"}
          .type=${this.type}
          .value=${this.value}
          placeholder=${oh(this.placeholder)}
          @input=${this.onInputChange}
        />
      </bim-input>
    `}};vr.styles=M`
    :host {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
      flex: 1;
      display: block;
    }

    input {
      background-color: transparent;
      outline: none;
      border: none;
      width: 100%;
      height: 100%;
      padding: 0 var(--bim-ui_size-3xs);
      border-radius: var(--bim-text-input--bdrs, var(--bim-ui_size-4xs));
      color: var(--bim-text-input--c, var(--bim-ui_bg-contrast-100));
    }

    :host(:focus) {
      --bim-input--olc: var(--bim-ui_color-accent);
    }

    /* :host([disabled]) {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
    } */
  `;let ht=vr;wt([f({type:String,reflect:!0})],ht.prototype,"icon",2);wt([f({type:String,reflect:!0})],ht.prototype,"label",2);wt([f({type:String,reflect:!0})],ht.prototype,"name",2);wt([f({type:String,reflect:!0})],ht.prototype,"placeholder",2);wt([f({type:String,reflect:!0})],ht.prototype,"value",2);wt([f({type:Boolean,reflect:!0})],ht.prototype,"vertical",2);wt([f({type:Number,reflect:!0})],ht.prototype,"debounce",2);wt([f({type:String,reflect:!0})],ht.prototype,"type",1);var lh=Object.defineProperty,ch=Object.getOwnPropertyDescriptor,yr=(i,t,e,s)=>{for(var n=s>1?void 0:s?ch(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&lh(t,e,n),n};const _r=class extends S{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(i){this._vertical=i,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const i=this.children;for(const t of i)this.vertical?t.setAttribute("label-hidden",""):t.removeAttribute("label-hidden")}render(){return v`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};_r.styles=M`
    .parent {
      display: grid;
      gap: 0.25rem;
    }

    ::slotted(bim-button[label]:not([vertical])) {
      --bim-button--jc: flex-start;
    }
  `;let Ci=_r;yr([f({type:Number,reflect:!0})],Ci.prototype,"rows",2);yr([f({type:Boolean,reflect:!0})],Ci.prototype,"vertical",1);var hh=Object.defineProperty,uh=Object.getOwnPropertyDescriptor,Si=(i,t,e,s)=>{for(var n=s>1?void 0:s?uh(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&hh(t,e,n),n};const wr=class extends S{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(i){this._vertical=i,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(i){this._labelHidden=i,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const i=this.children;for(const t of i)t instanceof Ci&&(t.vertical=this.vertical),t.toggleAttribute("label-hidden",this.vertical)}render(){return v`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?v`<bim-label
              .label=${this.label}
              .icon=${this.icon}
            ></bim-label>`:null}
      </div>
    `}};wr.styles=M`
    :host {
      --bim-label--fz: var(--bim-ui_size-xs);
      --bim-label--c: var(--bim-ui_bg-contrast-60);
      display: block;
      flex: 1;
    }

    :host(:not([vertical])) ::slotted(bim-button[vertical]) {
      --bim-icon--fz: var(--bim-ui_size-5xl);
      min-height: 3.75rem;
    }

    .parent {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      padding: 0.5rem;
    }

    :host([vertical]) .parent {
      flex-direction: row-reverse;
    }

    :host([vertical]) .parent > bim-label {
      writing-mode: tb;
    }

    .children {
      display: flex;
      gap: 0.25rem;
    }

    :host([vertical]) .children {
      flex-direction: column;
    }
  `;let re=wr;Si([f({type:String,reflect:!0})],re.prototype,"label",2);Si([f({type:String,reflect:!0})],re.prototype,"icon",2);Si([f({type:Boolean,reflect:!0})],re.prototype,"vertical",1);Si([f({type:Boolean,attribute:"label-hidden",reflect:!0})],re.prototype,"labelHidden",1);const xr=class C{static set config(t){this._config={...C._config,...t}}static get config(){return C._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=Rt.globalStyles.cssText;const e=document.head.firstChild;e?document.head.insertBefore(t,e):document.head.append(t)}static defineCustomElement(t,e){customElements.get(t)||customElements.define(t,e)}static registerComponents(){C.init()}static init(){C.addGlobalStyles(),C.defineCustomElement("bim-button",xc),C.defineCustomElement("bim-checkbox",te),C.defineCustomElement("bim-color-input",zt),C.defineCustomElement("bim-context-menu",Go),C.defineCustomElement("bim-dropdown",ct),C.defineCustomElement("bim-grid",$n),C.defineCustomElement("bim-icon",Nc),C.defineCustomElement("bim-input",Ne),C.defineCustomElement("bim-label",It),C.defineCustomElement("bim-number-input",q),C.defineCustomElement("bim-option",N),C.defineCustomElement("bim-panel",Ie),C.defineCustomElement("bim-panel-section",ne),C.defineCustomElement("bim-selector",se),C.defineCustomElement("bim-table",_t),C.defineCustomElement("bim-tabs",oe),C.defineCustomElement("bim-tab",Z),C.defineCustomElement("bim-table-cell",cr),C.defineCustomElement("bim-table-children",ur),C.defineCustomElement("bim-table-group",pr),C.defineCustomElement("bim-table-row",De),C.defineCustomElement("bim-text-input",ht),C.defineCustomElement("bim-toolbar",Pi),C.defineCustomElement("bim-toolbar-group",Ci),C.defineCustomElement("bim-toolbar-section",re),C.defineCustomElement("bim-viewport",Ar)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let e="";for(let s=0;s<10;s++){const n=Math.floor(Math.random()*t.length);e+=t.charAt(n)}return e}};xr._config={sectionLabelOnVerticalToolbar:!1};let sn=xr;var dh=Object.defineProperty,ph=Object.getOwnPropertyDescriptor,En=(i,t,e,s)=>{for(var n=s>1?void 0:s?ph(t,e):t,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=(s?r(t,e,n):r(n))||n);return s&&n&&dh(t,e,n),n};const $r=class extends S{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(i){this._vertical=i,this.updateSections()}get vertical(){return this._vertical}set hidden(i){this._hidden=i,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const i=this.children;for(const t of i)t instanceof re&&(t.labelHidden=this.vertical&&!sn.config.sectionLabelOnVerticalToolbar,t.vertical=this.vertical)}render(){return v`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};$r.styles=M`
    :host {
      --bim-button--bgc: transparent;
      background-color: var(--bim-ui_bg-base);
      border-radius: var(--bim-ui_size-2xs);
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .parent {
      display: flex;
      width: min-content;
    }

    :host([vertical]) .parent {
      flex-direction: column;
    }

    :host([vertical]) {
      width: min-content;
      border-radius: var(--bim-ui_size-2xs);
      border: 1px solid var(--bim-ui_bg-contrast-20);
    }

    ::slotted(bim-toolbar-section:not(:last-child)) {
      border-right: 1px solid var(--bim-ui_bg-contrast-20);
      border-bottom: none;
    }

    :host([vertical]) ::slotted(bim-toolbar-section:not(:last-child)) {
      border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      border-right: none;
    }
  `;let Pi=$r;En([f({type:String,reflect:!0})],Pi.prototype,"icon",2);En([f({type:Boolean,attribute:"labels-hidden",reflect:!0})],Pi.prototype,"labelsHidden",2);En([f({type:Boolean,reflect:!0})],Pi.prototype,"vertical",1);var mh=Object.defineProperty,fh=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&mh(t,e,n),n};const Er=class extends S{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return v`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Er.styles=M`
    :host {
      display: grid;
      min-width: 0;
      min-height: 0;
      height: 100%;
    }

    .parent {
      overflow: hidden;
      position: relative;
    }
  `;let Ar=Er;fh([f({type:String,reflect:!0})],Ar.prototype,"name");const bh=i=>{const{components:t}=i,e=t.get(la);return v`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const s=document.createElement("input");s.type="file",s.accept=".ifc",s.onchange=async()=>{if(s.files===null||s.files.length===0)return;const n=s.files[0];s.remove();const o=await n.arrayBuffer(),r=new Uint8Array(o),a=await e.load(r);a.name=n.name.replace(".ifc","")},s.click()}}
    ></bim-button>
  `},gh=i=>Nt.create(bh,i),vh=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:gh},Symbol.toStringTag,{value:"Module"}));({...vh});const yh=i=>{const{components:t}=i,e=t.get(Qt),s=document.createElement("bim-table");s.columns=["Model"],s.headersHidden=!0;const n=[];for(const[,o]of e.groups){if(!o)continue;const r={data:{Model:o.name||o.uuid,Actions:o.uuid}};n.push(r)}return s.definition={Actions:o=>{if(typeof o!="string")return o;const r=e.groups.get(o);return r?v`
        <bim-button @click=${a=>{r.visible=!r.visible;const l=a.target;l.icon=r.visible?"mdi:eye":"mdi:eye-off"}} icon="mdi:eye"></bim-button>
        <bim-button @click=${()=>e.disposeGroup(r)} icon="mdi:delete"></bim-button>
      `:o}},s.columns=["Model",{name:"Actions",width:"auto"}],s.data=n,v`
    <div>
      ${n.length===0?v`<bim-label label="No models has been loaded yet"></bim-label>`:s}
    </div>
  `},_h=(i,t=!0)=>{const e=Nt.create(yh,i);if(t){const{components:s}=i,n=s.get(Qt),[,o]=e;n.onFragmentsLoaded.add(()=>setTimeout(()=>o())),n.onFragmentsDisposed.add(()=>o())}return e},wh=Object.freeze(Object.defineProperty({__proto__:null,modelsList:_h},Symbol.toStringTag,{value:"Module"})),kr=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",i=>i.includes("Value"),i=>i.startsWith("Material"),i=>i.startsWith("Relating"),i=>{const t=["IsGroupedBy","IsDecomposedBy"];return i.startsWith("Is")&&!t.includes(i)}];async function Ke(i,t,e,s=kr,n=!1){const o=i.get(Ce),r=await t.getProperties(e);if(!r)return{data:{Entity:`${e} properties not found...`}};const a=o.relationMaps[t.uuid],l={data:{}};for(const c in r){const h=s.map(d=>typeof d=="string"?c===d:d(c)).includes(!0);if(!(c==="type"||h))continue;const u=r[c];if(u)if(u.type===5){l.children||(l.children=[]);const d=await Ke(i,t,u.value,s,n);l.children.push(d)}else if(typeof u=="object"&&!Array.isArray(u)){const{value:d,type:p}=u;if(n)p===1||p===2||p===3||(l.data[c]=d);else{const m=typeof d=="number"?Number(d.toFixed(3)):d;l.data[c]=m}}else if(Array.isArray(u))for(const d of u){if(d.type!==5)continue;l.children||(l.children=[]);const p=await Ke(i,t,d.value,s,n);l.children.push(p)}else if(c==="type"){const d=ln[u];l.data.Entity=d}else l.data[c]=u}if(a&&a.get(r.expressID)){const c=a.get(r.expressID);for(const h of s){const u=[];if(typeof h=="string"){const d=o._inverseAttributes.indexOf(h);d!==-1&&u.push(d)}else{const d=o._inverseAttributes.filter(p=>h(p));for(const p of d){const m=o._inverseAttributes.indexOf(p);u.push(m)}}for(const d of u){const p=c.get(d);if(p)for(const m of p){const g=await Ke(i,t,m,s,n);l.children||(l.children=[]),l.children.push(g)}}}}return l}const xh=i=>{const{components:t,fragmentIdMap:e,attributesToInclude:s,editable:n,tableDefinition:o}=i,r=t.get(Qt);let a;return typeof s=="function"?a=s(kr):a=s,v`<bim-table ${X(async l=>{if(!l)return;const c=l,h=[],u=[];for(const d in e){const p=r.list.get(d);if(!(p&&p.group))continue;const m=p.group,g=u.find(b=>b.model===m);if(g)for(const b of e[d])g.expressIDs.add(b);else{const b={model:m,expressIDs:new Set(e[d])};u.push(b)}}for(const d of u){const{model:p,expressIDs:m}=d;for(const g of m){const b=await Ke(t,p,g,a,n);h.push(b)}}c.definition=o,c.data=h,c.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},$h=i=>Nt.create(xh,i),Eh=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:$h},Symbol.toStringTag,{value:"Module"}));function Ah(i){const t=Object.keys(i).pop();return t&&i[t].length>0?i[t][0]:""}function Cr(i){return i.map(t=>{const e={data:{System:Ah(t.filter)}};return t.children&&t.children.length>0&&(e.children=Cr(t.children)),e})}const kh=i=>{const{components:t,classifications:e}=i,s=t.get(ca),n=o=>{if(!o)return;const r=o;r.definition={Actions:c=>c};const a=(c,h={})=>{const u=s.list,d=c[0],p=u[d],m=[];if(!d||!p)return m;for(const g in p){const b={...h,[d]:[g]},w=s.find(b);if(Object.keys(w).length>0){const x={filter:b};x.children=a(c.slice(1),b),m.push(x)}}return m},l=[];for(const c in e){const h=e[c],u=a(h),d=Cr(u);l.push({data:{System:c},children:d})}r.data=l};return v`
  <div>
    ${Object.keys(e).length===0?v`<bim-label label="No classifications to show"></bim-label>`:v`<bim-table ${X(n)} headers-hidden expanded></bim-table>`}
  </div>
  `},Ch=(i,t=!0)=>{const e=Nt.create(kh,i);if(t){const{components:s}=i,n=s.get(Qt),[,o]=e;n.onFragmentsDisposed.add(()=>o())}return e},Sh=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:Ch},Symbol.toStringTag,{value:"Module"})),Ph=["OwnerHistory","ObjectPlacement","CompositionType"],Es=async(i,t,e)=>{const s={groupName:"Attributes",includeClass:!1,...e},{groupName:n,includeClass:o}=s,r=await i.getProperties(t)??{},a={data:{Name:n}};o&&(a.children||(a.children=[]),a.children.push({data:{Name:"Class",Value:ln[r.type]}}));for(const l in r){if(Ph.includes(l))continue;const c=r[l];if(c&&typeof c=="object"&&!Array.isArray(c)){if(c.type===sa)continue;const h={data:{Name:l,Value:c.value}};a.children||(a.children=[]),a.children.push(h)}}return a},Mh=async(i,t)=>{const e={data:{Name:"Property Sets"}};for(const s of t){const n=await i.getProperties(s);if(!n)continue;const o={data:{Name:n.Name.value}};if(n.type===Ds){for(const r of n.HasProperties){const{value:a}=r,l=await i.getProperties(a);if(!l)continue;const c=Object.keys(l).find(u=>u.includes("Value"));if(!(c&&l[c]))continue;const h={data:{Name:l.Name.value,Value:l[c].value}};o.children||(o.children=[]),o.children.push(h)}o.children&&(e.children||(e.children=[]),e.children.push(o))}}return e},Lh=async(i,t)=>{const e={data:{Name:"Quantity Sets"}};for(const s of t){const n=await i.getProperties(s);if(!n)continue;const o={data:{Name:n.Name.value}};if(n.type===Bs){for(const r of n.Quantities){const{value:a}=r,l=await i.getProperties(a);if(!l)continue;const c=Object.keys(l).find(u=>u.includes("Value"));if(!(c&&l[c]))continue;const h={data:{Name:l.Name.value,Value:l[c].value}};o.children||(o.children=[]),o.children.push(h)}o.children&&(e.children||(e.children=[]),e.children.push(o))}}return e},Oh=async(i,t)=>{const e={data:{Name:"Materials"}};for(const s of t){const n=await i.getProperties(s);if(n.type===Us){const o=n.ForLayerSet.value,r=await i.getProperties(o);for(const a of r.MaterialLayers){const{value:l}=a,c=await i.getProperties(l),h=await i.getProperties(c.Material.value),u={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:c.LayerThickness.value}},{data:{Name:"Material",Value:h.Name.value}}]};e.children||(e.children=[]),e.children.push(u)}}if(n.type===Vs)for(const o of n.Materials){const{value:r}=o,a={data:{Name:"Name",Value:(await i.getProperties(r)).Name.value}};e.children||(e.children=[]),e.children.push(a)}if(n.type===Fs){const o={data:{Name:"Name",Value:(await i.getProperties(s)).Name.value}};e.children||(e.children=[]),e.children.push(o)}}return e},Th=async(i,t)=>{const e={data:{Name:"Classifications"}};for(const s of t){const n=await i.getProperties(s);if(n.type===Ys){const{value:o}=n.ReferencedSource,r={data:{Name:(await i.getProperties(o)).Name.value},children:[{data:{Name:"Identification",Value:n.Identification.value}},{data:{Name:"Name",Value:n.Name.value}}]};e.children||(e.children=[]),e.children.push(r)}}return e},zh=i=>{const{components:t,fragmentIdMap:e}=i,s=t.get(Ce),n=t.get(Qt);return v`<bim-table ${X(async o=>{var r;if(!o)return;const a=[],l=[];for(const h in e){const u=n.list.get(h);if(!(u&&u.group))continue;const d=u.group,p=l.find(m=>m.model===d);if(p)for(const m of e[h])p.expressIDs.add(m);else{const m={model:d,expressIDs:new Set(e[h])};l.push(m)}}for(const h in l){const{model:u,expressIDs:d}=l[h],p=s.relationMaps[u.uuid];if(!p)return;for(const m of d){const g=await u.getProperties(m);if(!g)continue;const b={data:{Name:(r=g.Name)==null?void 0:r.value,Value:""}};a.push(b);const w=await Es(u,m,{includeClass:!0});if(b.children||(b.children=[]),b.children.push(w),!p.get(m))continue;const x=s.getEntityRelations(u,m,"IsDefinedBy");if(x){const L=x.filter(async T=>{const A=await u.getProperties(T);return A?A.type===Ds:!1}),$=await Mh(u,L);$.children&&b.children.push($);const P=x.filter(async T=>{const A=await u.getProperties(T);return A?A.type===Bs:!1}),O=await Lh(u,P);O.children&&b.children.push(O)}const E=s.getEntityRelations(u,m,"HasAssociations");if(E){const L=E.filter(async T=>{const A=await u.getProperties(T);return A?A.type===Us||A.type===ta||A.type===ea||A.type===Fs||A.type===Vs:!1}),$=await Oh(u,L);$.children&&b.children.push($);const P=E.filter(async T=>{const A=await u.getProperties(T);return A?A.type===Ys:!1}),O=await Th(u,P);O.children&&b.children.push(O)}const k=s.getEntityRelations(u,m,"ContainedInStructure");if(k){const L=k[0],$=await Es(u,L,{groupName:"SpatialContainer"});b.children.push($)}}}const c=o;c.columns=[{name:"Name",width:"12rem"}],c.data=a})} headers-hidden></bim-table>`},Rh=i=>Nt.create(zh,i),Nh=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:Rh},Symbol.toStringTag,{value:"Module"})),on=async(i,t,e,s)=>{var n;const o=[],r=i.get(Ce),a=await t.getProperties(e);if(!a)return o;const{type:l}=a,c={data:{Entity:ln[l],Name:(n=a.Name)==null?void 0:n.value}};for(const h of s){const u=r.getEntityRelations(t,e,h);if(u)for(const d of u){const p=await on(i,t,d,s);c.children||(c.children=[]),c.children.push(...p)}}return o.push(c),o},Ih=i=>{const{components:t,models:e,inverseAttributes:s,expressID:n}=i,o=s??["IsDecomposedBy","ContainsElements"];return v`<bim-table ${X(async r=>{if(!r)return;const a=t.get(Ce),l=[];for(const h of e){let u;if(n)u={data:{Entity:h.name!==""?h.name:h.uuid},children:await on(t,h,n,o)};else{const d=a.relationMaps[h.uuid],p=await h.getAllPropertiesOfType(ia);if(!(d&&p))continue;const{expressID:m}=Object.values(p)[0];u={data:{Entity:h.name!==""?h.name:h.uuid},children:await on(t,h,m,o)}}l.push(u)}const c=r;c.columns=["Entity","Name"],c.data=l})} headers-hidden></bim-table>`},jh=(i,t=!0)=>{const e=Nt.create(Ih,i);if(t){const[,s]=e,{components:n}=i,o=n.get(Qt),r=n.get(Ce),a=()=>s({models:o.groups.values()});r.onRelationsIndexed.add(a),o.onFragmentsDisposed.add(a)}return e},Hh=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:jh},Symbol.toStringTag,{value:"Module"}));({...wh,...Eh,...Sh,...Nh,...Hh});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ze=globalThis,An=Ze.ShadowRoot&&(Ze.ShadyCSS===void 0||Ze.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kn=Symbol(),As=new WeakMap;let Sr=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o;const t=this.t;if(An&&i===void 0){const e=t!==void 0&&t.length===1;e&&(i=As.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&As.set(t,i))}return i}toString(){return this.cssText}};const Dh=i=>new Sr(typeof i=="string"?i:i+"",void 0,kn),Pr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,n,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new Sr(e,i,kn)},Bh=(i,t)=>{if(An)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),n=Ze.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}},ks=An?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Dh(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Uh,defineProperty:Fh,getOwnPropertyDescriptor:Vh,getOwnPropertyNames:Yh,getOwnPropertySymbols:Wh,getPrototypeOf:Xh}=Object,Kt=globalThis,Cs=Kt.trustedTypes,qh=Cs?Cs.emptyScript:"",Ss=Kt.reactiveElementPolyfillSupport,be=(i,t)=>i,ci={toAttribute(i,t){switch(t){case Boolean:i=i?qh:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Cn=(i,t)=>!Uh(i,t),Ps={attribute:!0,type:String,converter:ci,reflect:!1,hasChanged:Cn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Kt.litPropertyMetadata??(Kt.litPropertyMetadata=new WeakMap);class Dt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ps){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(t,s,e);n!==void 0&&Fh(this.prototype,t,n)}}static getPropertyDescriptor(t,e,s){const{get:n,set:o}=Vh(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get(){return n==null?void 0:n.call(this)},set(r){const a=n==null?void 0:n.call(this);o.call(this,r),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ps}static _$Ei(){if(this.hasOwnProperty(be("elementProperties")))return;const t=Xh(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(be("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(be("properties"))){const e=this.properties,s=[...Yh(e),...Wh(e)];for(const n of s)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,n]of e)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const n=this._$Eu(e,s);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const n of s)e.unshift(ks(n))}else t!==void 0&&e.push(ks(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bh(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){const r=(((s=n.converter)==null?void 0:s.toAttribute)!==void 0?n.converter:ci).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(t,e){var s;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const r=n.getPropertyOptions(o),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((s=r.converter)==null?void 0:s.fromAttribute)!==void 0?r.converter:ci;this._$Em=o,this[o]=a.fromAttribute(e,r.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Cn)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,r]of n)r.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],r)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(s)):this._$EU()}catch(n){throw e=!1,this._$EU(),n}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var n;return(n=s.hostUpdated)==null?void 0:n.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Dt.elementStyles=[],Dt.shadowRootOptions={mode:"open"},Dt[be("elementProperties")]=new Map,Dt[be("finalized")]=new Map,Ss==null||Ss({ReactiveElement:Dt}),(Kt.reactiveElementVersions??(Kt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hi=globalThis,ui=hi.trustedTypes,Ms=ui?ui.createPolicy("lit-html",{createHTML:i=>i}):void 0,Mr="$lit$",dt=`lit$${Math.random().toFixed(9).slice(2)}$`,Lr="?"+dt,Kh=`<${Lr}>`,Tt=document,Ee=()=>Tt.createComment(""),Ae=i=>i===null||typeof i!="object"&&typeof i!="function",Or=Array.isArray,Zh=i=>Or(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Bi=`[ 	
\f\r]`,he=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ls=/-->/g,Os=/>/g,kt=RegExp(`>|${Bi}(?:([^\\s"'>=/]+)(${Bi}*=${Bi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ts=/'/g,zs=/"/g,Tr=/^(?:script|style|textarea|title)$/i,Gh=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),zr=Gh(1),Zt=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),Rs=new WeakMap,St=Tt.createTreeWalker(Tt,129);function Rr(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ms!==void 0?Ms.createHTML(t):t}const Qh=(i,t)=>{const e=i.length-1,s=[];let n,o=t===2?"<svg>":"",r=he;for(let a=0;a<e;a++){const l=i[a];let c,h,u=-1,d=0;for(;d<l.length&&(r.lastIndex=d,h=r.exec(l),h!==null);)d=r.lastIndex,r===he?h[1]==="!--"?r=Ls:h[1]!==void 0?r=Os:h[2]!==void 0?(Tr.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=kt):h[3]!==void 0&&(r=kt):r===kt?h[0]===">"?(r=n??he,u=-1):h[1]===void 0?u=-2:(u=r.lastIndex-h[2].length,c=h[1],r=h[3]===void 0?kt:h[3]==='"'?zs:Ts):r===zs||r===Ts?r=kt:r===Ls||r===Os?r=he:(r=kt,n=void 0);const p=r===kt&&i[a+1].startsWith("/>")?" ":"";o+=r===he?l+Kh:u>=0?(s.push(c),l.slice(0,u)+Mr+l.slice(u)+dt+p):l+dt+(u===-2?a:p)}return[Rr(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};class ke{constructor({strings:t,_$litType$:e},s){let n;this.parts=[];let o=0,r=0;const a=t.length-1,l=this.parts,[c,h]=Qh(t,e);if(this.el=ke.createElement(c,s),St.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=St.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(Mr)){const d=h[r++],p=n.getAttribute(u).split(dt),m=/([.?@])?(.*)/.exec(d);l.push({type:1,index:o,name:m[2],strings:p,ctor:m[1]==="."?tu:m[1]==="?"?eu:m[1]==="@"?iu:Mi}),n.removeAttribute(u)}else u.startsWith(dt)&&(l.push({type:6,index:o}),n.removeAttribute(u));if(Tr.test(n.tagName)){const u=n.textContent.split(dt),d=u.length-1;if(d>0){n.textContent=ui?ui.emptyScript:"";for(let p=0;p<d;p++)n.append(u[p],Ee()),St.nextNode(),l.push({type:2,index:++o});n.append(u[d],Ee())}}}else if(n.nodeType===8)if(n.data===Lr)l.push({type:2,index:o});else{let u=-1;for(;(u=n.data.indexOf(dt,u+1))!==-1;)l.push({type:7,index:o}),u+=dt.length-1}o++}}static createElement(t,e){const s=Tt.createElement("template");return s.innerHTML=t,s}}function Gt(i,t,e=i,s){var n,o;if(t===Zt)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const a=Ae(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((o=r==null?void 0:r._$AO)==null||o.call(r,!1),a===void 0?r=void 0:(r=new a(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=Gt(i,r._$AS(i,t.values),r,s)),t}class Jh{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,n=((t==null?void 0:t.creationScope)??Tt).importNode(e,!0);St.currentNode=n;let o=St.nextNode(),r=0,a=0,l=s[0];for(;l!==void 0;){if(r===l.index){let c;l.type===2?c=new Ue(o,o.nextSibling,this,t):l.type===1?c=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(c=new nu(o,this,t)),this._$AV.push(c),l=s[++a]}r!==(l==null?void 0:l.index)&&(o=St.nextNode(),r++)}return St.currentNode=Tt,n}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Ue{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,n){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Gt(this,t,e),Ae(t)?t===j||t==null||t===""?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==Zt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zh(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==j&&Ae(this._$AH)?this._$AA.nextSibling.data=t:this.T(Tt.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=ke.createElement(Rr(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const r=new Jh(o,this),a=r.u(this.options);r.p(s),this.T(a),this._$AH=r}}_$AC(t){let e=Rs.get(t.strings);return e===void 0&&Rs.set(t.strings,e=new ke(t)),e}k(t){Or(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,n=0;for(const o of t)n===e.length?e.push(s=new Ue(this.S(Ee()),this.S(Ee()),this,this.options)):s=e[n],s._$AI(o),n++;n<e.length&&(this._$AR(s&&s._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Mi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,n,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}_$AI(t,e=this,s,n){const o=this.strings;let r=!1;if(o===void 0)t=Gt(this,t,e,0),r=!Ae(t)||t!==this._$AH&&t!==Zt,r&&(this._$AH=t);else{const a=t;let l,c;for(t=o[0],l=0;l<o.length-1;l++)c=Gt(this,a[s+l],e,l),c===Zt&&(c=this._$AH[l]),r||(r=!Ae(c)||c!==this._$AH[l]),c===j?t=j:t!==j&&(t+=(c??"")+o[l+1]),this._$AH[l]=c}r&&!n&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tu extends Mi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class eu extends Mi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class iu extends Mi{constructor(t,e,s,n,o){super(t,e,s,n,o),this.type=5}_$AI(t,e=this){if((t=Gt(this,t,e,0)??j)===Zt)return;const s=this._$AH,n=t===j&&s!==j||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==j&&(s===j||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class nu{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Gt(this,t)}}const Ns=hi.litHtmlPolyfillSupport;Ns==null||Ns(ke,Ue),(hi.litHtmlVersions??(hi.litHtmlVersions=[])).push("3.1.3");const su=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let n=s._$litPart$;if(n===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=n=new Ue(t.insertBefore(Ee(),o),o,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ft extends Dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=su(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Zt}}var Is;Ft._$litElement$=!0,Ft.finalized=!0,(Is=globalThis.litElementHydrateSupport)==null||Is.call(globalThis,{LitElement:Ft});const js=globalThis.litElementPolyfillSupport;js==null||js({LitElement:Ft});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ou={attribute:!0,type:String,converter:ci,reflect:!1,hasChanged:Cn},ru=(i=ou,t,e)=>{const{kind:s,metadata:n}=e;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(e.name,i),s==="accessor"){const{name:r}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,i)},init(a){return a!==void 0&&this.P(r,void 0,i),a}}}if(s==="setter"){const{name:r}=e;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,i)}}throw Error("Unsupported decorator location: "+s)};function et(i){return(t,e)=>typeof e=="object"?ru(i,t,e):((s,n,o)=>{const r=n.hasOwnProperty(o);return n.constructor.createProperty(o,r?{...s,wrapped:!0}:s),r?Object.getOwnPropertyDescriptor(n,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function au(i){return et({...i,state:!0,attribute:!1})}class lu extends na{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new Hs(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&e.element.parentNode!==null&&e.element.parentNode.removeChild(e.element)})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}}new _;new bi;new bi;new _;new _;class cu{constructor(t,e){this._group=new Pn,this._frustum=new Qr,this._frustumMat=new bi,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new rn({color:"#2e3338"}),this.numbers=new Pn,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._camera=t,this._container=e;const s=this.newGrid(-1),n=this.newGrid(-2);this.grids={main:s,secondary:n},this._group.add(n,s,this.numbers)}set scaleX(t){this._scaleX=t,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(t){this._scaleY=t,this.regenerate()}get scaleY(){return this._scaleY}get(){return this._group}dispose(){const{main:t,secondary:e}=this.grids;t.removeFromParent(),e.removeFromParent(),t.geometry.dispose(),t.material.dispose(),e.geometry.dispose(),e.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const t=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(t);const{planes:e}=this._frustum,s=e[0].constant*-e[0].normal.x,n=e[1].constant*-e[1].normal.x,o=e[2].constant*-e[2].normal.y,r=e[3].constant*-e[3].normal.y,a=Math.abs(s-n),l=Math.abs(r-o),{clientWidth:c,clientHeight:h}=this._container,u=Math.max(c,h),d=Math.max(a,l)/u,p=Math.ceil(Math.log10(a/this.scaleX)),m=Math.ceil(Math.log10(l/this.scaleY)),g=10**(p-2)*this.scaleX,b=10**(m-2)*this.scaleY,w=g*this.gridsFactor,x=b*this.gridsFactor,E=Math.ceil(l/x),k=Math.ceil(a/w),L=Math.ceil(l/b),$=Math.ceil(a/g),P=g*Math.ceil(n/g),O=b*Math.ceil(o/b),T=w*Math.ceil(n/w),A=x*Math.ceil(o/x),J=[...this.numbers.children];for(const D of J)D.removeFromParent();this.numbers.children=[];const H=[],V=9*d,R=1e4,U=Math.round(Math.abs(T/this.scaleX)*R)/R,B=(k-1)*w,Y=Math.round(Math.abs((T+B)/this.scaleX)*R)/R,st=Math.max(U,Y).toString().length*V;let ae=Math.ceil(st/w)*w;for(let D=0;D<k;D++){let I=T+D*w;H.push(I,r,0,I,o,0);const le=I/this.scaleX;I=Math.round(I*R)/R,ae=Math.round(ae*R)/R;const Fe=I%ae;if(!(w<1||x<1)&&Math.abs(Fe)>.01)continue;const Ti=this.newNumber(le),Ur=12*d;Ti.position.set(I,o+Ur,0)}for(let D=0;D<E;D++){const I=A+D*x;H.push(n,I,0,s,I,0);const le=this.newNumber(I/this.scaleY);let Fe=12;le.element.textContent&&(Fe+=4*le.element.textContent.length);const Ti=Fe*d;le.position.set(n+Ti,I,0)}const Oi=[];for(let D=0;D<$;D++){const I=P+D*g;Oi.push(I,r,0,I,o,0)}for(let D=0;D<L;D++){const I=O+D*b;Oi.push(n,I,0,s,I,0)}const jr=new Ui(new Float32Array(H),3),Hr=new Ui(new Float32Array(Oi),3),{main:Dr,secondary:Br}=this.grids;Dr.geometry.setAttribute("position",jr),Br.geometry.setAttribute("position",Hr)}newNumber(t){const e=document.createElement("bim-label");e.label=String(Math.round(t*100)/100);const s=new lu(e);return this.numbers.add(s),s}newGrid(t){const e=new F,s=new Jr(e,this.material);return s.frustumCulled=!1,s.renderOrder=t,s}isGridReady(){const t=this._camera.projectionMatrix.elements;for(let e=0;e<t.length;e++){const s=t[e];if(Number.isNaN(s))return!1}return!0}}var hu=Object.defineProperty,uu=Object.getOwnPropertyDescriptor,Sn=(i,t,e,s)=>{for(var n=uu(t,e),o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&hu(t,e,n),n};const Nr=class extends Ft{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(t){if(this._gridColor=t,!(t&&this._grid))return;const e=Number(t.replace("#","0x"));Number.isNaN(e)||this._grid.material.color.setHex(e)}get gridColor(){return this._gridColor}set gridScaleX(t){this._gridScaleX=t,t&&this._grid&&(this._grid.scaleX=t)}get gridScaleX(){return this._gridScaleX}set gridScaleY(t){this._gridScaleY=t,t&&this._grid&&(this._grid.scaleY=t)}get gridScaleY(){return this._gridScaleY}set components(t){this.dispose();const e=t.get(oa).create();this._world=e,e.scene=new ra(t),e.scene.setup(),e.renderer=new da(t,this);const s=new aa(t);e.camera=s;const n=new cu(s.threeOrtho,this);this._grid=n,e.scene.three.add(n.get()),s.controls.addEventListener("update",()=>n.regenerate()),setTimeout(async()=>{e.camera.updateAspect(),s.set("Plan"),await s.controls.setLookAt(0,0,100,0,0,0),await s.projection.set("Orthographic"),s.controls.dollySpeed=3,s.controls.draggingSmoothTime=.085,s.controls.maxZoom=1e3,s.controls.zoom(4)})}get world(){return this._world}dispose(){var t;(t=this.world)==null||t.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return zr`<slot></slot>`}};Nr.styles=Pr`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let Li=Nr;Sn([et({type:String,attribute:"grid-color",reflect:!0})],Li.prototype,"gridColor");Sn([et({type:Number,attribute:"grid-scale-x",reflect:!0})],Li.prototype,"gridScaleX");Sn([et({type:Number,attribute:"grid-scale-y",reflect:!0})],Li.prototype,"gridScaleY");var du=Object.defineProperty,xt=(i,t,e,s)=>{for(var n=void 0,o=i.length-1,r;o>=0;o--)(r=i[o])&&(n=r(t,e,n)||n);return n&&du(t,e,n),n};const Ir=class extends Ft{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new bi,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=t=>Math.abs(t)<1e-10?0:t}set camera(t){this._camera=t,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:t}=this._matrix;this._cssMatrix3D=`matrix3d(
      ${this._epsilon(t[0])},
      ${this._epsilon(-t[1])},
      ${this._epsilon(t[2])},
      ${this._epsilon(t[3])},
      ${this._epsilon(t[4])},
      ${this._epsilon(-t[5])},
      ${this._epsilon(t[6])},
      ${this._epsilon(t[7])},
      ${this._epsilon(t[8])},
      ${this._epsilon(-t[9])},
      ${this._epsilon(t[10])},
      ${this._epsilon(t[11])},
      ${this._epsilon(t[12])},
      ${this._epsilon(-t[13])},
      ${this._epsilon(t[14])},
      ${this._epsilon(t[15])})
    `}render(){const t=this.size??this._defaults.size;return zr`
      <style>
        .face,
        .cube {
          width: ${t}px;
          height: ${t}px;
          transform: translateZ(-300px) ${this._cssMatrix3D};
        }

        .face-right {
          translate: ${t/2}px 0 0;
        }

        .face-left {
          translate: ${-t/2}px 0 0;
        }

        .face-top {
          translate: 0 ${t/2}px 0;
        }

        .face-bottom {
          translate: 0 ${-t/2}px 0;
        }

        .face-front {
          translate: 0 0 ${t/2}px;
        }

        .face-back {
          translate: 0 0 ${-t/2}px;
        }
      </style>
      <div class="parent">
        <div class="cube">
          <div
            class="face x-direction face-right"
            @click=${()=>this.dispatchEvent(this._onRightClick)}
          >
            ${this.rightText}
          </div>
          <div
            class="face x-direction face-left"
            @click=${()=>this.dispatchEvent(this._onLeftClick)}
          >
            ${this.leftText}
          </div>
          <div
            class="face y-direction face-top"
            @click=${()=>this.dispatchEvent(this._onTopClick)}
          >
            ${this.topText}
          </div>
          <div
            class="face y-direction face-bottom"
            @click=${()=>this.dispatchEvent(this._onBottomClick)}
          >
            ${this.bottomText}
          </div>
          <div
            class="face z-direction face-front"
            @click=${()=>this.dispatchEvent(this._onFrontClick)}
          >
            ${this.frontText}
          </div>
          <div
            class="face z-direction face-back"
            @click=${()=>this.dispatchEvent(this._onBackClick)}
          >
            ${this.backText}
          </div>
        </div>
      </div>
    `}};Ir.styles=Pr`
    :host {
      position: absolute;
      z-index: 999;
      bottom: 1rem;
      right: 1rem;
    }

    .parent {
      perspective: 400px;
    }

    .cube {
      position: relative;
      transform-style: preserve-3d;
    }

    .face {
      position: absolute;
      display: flex;
      justify-content: center;
      user-select: none;
      align-items: center;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
      color: var(--bim-view-cube--c, white);
      font-size: var(--bim-view-cube--fz, --bim-ui_size-2xl);
    }

    .x-direction {
      // background-color: var(--bim-view-cube_x--bgc, #c93830DD);
      background-color: var(--bim-view-cube_x--bgc, #01a6bcde);
    }

    .x-direction:hover {
      background-color: var(--bim-ui_color-accent, white);
    }

    .y-direction {
      // background-color: var(--bim-view-cube_y--bgc, #54ff19DD);
      background-color: var(--bim-view-cube_y--bgc, #8d0ec8de);
    }

    .y-direction:hover {
      background-color: var(--bim-ui_color-accent, white);
    }

    .z-direction {
      // background-color: var(--bim-view-cube_z--bgc, #3041c9DD);
      background-color: var(--bim-view-cube_z--bgc, #2718afde);
    }

    .z-direction:hover {
      background-color: var(--bim-ui_color-accent, white);
    }

    .face-front {
      transform: rotateX(180deg);
    }

    .face-back {
      transform: rotateZ(180deg);
    }

    .face-top {
      transform: rotateX(90deg);
    }

    .face-bottom {
      transform: rotateX(270deg);
    }

    .face-right {
      transform: rotateY(-270deg) rotateX(180deg);
    }

    .face-left {
      transform: rotateY(-90deg) rotateX(180deg);
    }
  `;let ut=Ir;xt([et({type:Number,reflect:!0})],ut.prototype,"size");xt([et({type:String,attribute:"right-text",reflect:!0})],ut.prototype,"rightText");xt([et({type:String,attribute:"left-text",reflect:!0})],ut.prototype,"leftText");xt([et({type:String,attribute:"top-text",reflect:!0})],ut.prototype,"topText");xt([et({type:String,attribute:"bottom-text",reflect:!0})],ut.prototype,"bottomText");xt([et({type:String,attribute:"front-text",reflect:!0})],ut.prototype,"frontText");xt([et({type:String,attribute:"back-text",reflect:!0})],ut.prototype,"backText");xt([au()],ut.prototype,"_cssMatrix3D");class $u{static init(){sn.defineCustomElement("bim-view-cube",ut),sn.defineCustomElement("bim-world-2d",Li)}}export{On as C,$u as Z,Ln as a,ma as b,Bt as c};
