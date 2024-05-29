var W=Object.defineProperty;var Q=(b,h,t)=>h in b?W(b,h,{enumerable:!0,configurable:!0,writable:!0,value:t}):b[h]=t;var p=(b,h,t)=>(Q(b,typeof h!="symbol"?h+"":h,t),t);import{V as u,E as q,h as J,c as y,g as v,L as Z,Q as tt,p as I,o as et}from"./web-ifc-api-BC8YMRiS.js";import{J as B,U as V}from"./index-b4ozRbQy.js";import{a as nt}from"./index-BaoxwJyW.js";import{M as k}from"./index-WVnKWA4H.js";import"./import-wrapper-prod-LhqN7JJy.js";import{M as x}from"./mark-Cj_PmUva.js";const ot=["Station","Radius","Length","InitialKP","FinalKP","KP","Slope","Height","InitialKPV","FinalKPV"],M=class M extends B{constructor(t){super(t);p(this,"enabled",!0);p(this,"world",null);p(this,"_list",new Map);p(this,"_markerKey",0);p(this,"type","horizontal");p(this,"divisionLength",100);t.add(M.uuid,this)}addKPStation(t,i,e){const n=this.components.get(k),s=document.createElement("div"),o=document.createElement("div");s.appendChild(o),o.innerHTML=i,o.style.color=n.color,o.style.borderBottom="1px dotted white",o.style.width="160px",o.style.textAlign="left";const a=new x(t,s),r=new u;r.x=e.geometry.attributes.position.getX(e.geometry.attributes.position.count-1),r.y=e.geometry.attributes.position.getY(e.geometry.attributes.position.count-1),r.z=e.geometry.attributes.position.getZ(e.geometry.attributes.position.count-1);const c=new u;c.x=e.geometry.attributes.position.getX(e.geometry.attributes.position.count-2),c.y=e.geometry.attributes.position.getY(e.geometry.attributes.position.count-2),c.z=e.geometry.attributes.position.getZ(e.geometry.attributes.position.count-2);const d=new u;d.x=(r.x+c.x)/2,d.y=(r.y+c.y)/2,d.z=(r.z+c.z)/2,a.three.position.copy(d);const l=new u;l.subVectors(r,c).normalize();const g=new tt;g.setFromUnitVectors(new u(0,1,0),l);const m=new q().setFromQuaternion(g).z,w=J.radToDeg(m);o.style.transform=`rotate(${-w-90}deg) translate(-35%, -50%)`;const f=this._markerKey.toString();n.setupEvents(t,!0),n.getWorldMarkerList(t).set(f,{label:a,key:f,merged:!1,static:!1}),this._markerKey++,this.save(f,"KP")}addVerticalMarker(t,i,e,n,s){const o=this.components.get(k),a=document.createElement("span");a.innerHTML=i,a.style.color=o.color;const r=new x(t,a,s);if(n==="Height"){const l=document.createElement("span");l.innerHTML=i,l.style.color=o.color;const{position:g}=e.geometry.attributes,w=(g.array.length/3-1)*3,f=g.array.slice(w,w+3);r.three.position.set(f[0],f[1]+10,f[2])}else if(n==="InitialKPV"){const{position:l}=e.geometry.attributes,g=l.getX(0),m=l.getY(0),w=l.getZ(0);r.three.position.set(g-20,m,w)}else if(n==="FinalKPV"){const{position:l}=e.geometry.attributes,g=l.getX(e.geometry.attributes.position.count-1),m=l.getY(e.geometry.attributes.position.count-1),w=l.getZ(e.geometry.attributes.position.count-1);r.three.position.set(g+20,m,w)}else if(n==="Slope"){a.style.color="grey";const{position:l}=e.geometry.attributes,g=new u;g.x=l.getX(0),g.y=l.getY(0),g.z=l.getZ(0);const m=new u;m.x=l.getX(l.count-1),m.y=l.getY(l.count-1),m.z=l.getZ(l.count-1);const w=new u;w.addVectors(g,m).multiplyScalar(.5),r.three.position.set(w.x,w.y-10,w.z)}const c=this._markerKey.toString();return o.setupEvents(t,!0),o.getWorldMarkerList(t).set(c,{label:r,key:c,type:n,merged:!1,static:!1}),this._markerKey++,this.save(c,n),r}addCivilMarker(t,i,e,n){const s=this.components.get(k),o=document.createElement("span");o.innerHTML=i,o.style.color=s.color;const a=new x(t,o);if(n==="InitialKP"){const d=e.geometry.attributes.position.getX(0),l=e.geometry.attributes.position.getY(0),g=e.geometry.attributes.position.getZ(0);a.three.position.set(d+2,l+2,g)}else if(n==="FinalKP"){const d=e.geometry.attributes.position.getX(e.geometry.attributes.position.count-1),l=e.geometry.attributes.position.getY(e.geometry.attributes.position.count-1),g=e.geometry.attributes.position.getZ(e.geometry.attributes.position.count-1);a.three.position.set(d+2,l-2,g)}else if(n==="Length"){const d=new u;d.x=e.geometry.attributes.position.getX(0),d.y=e.geometry.attributes.position.getY(0),d.z=e.geometry.attributes.position.getZ(0);const l=new u;l.x=e.geometry.attributes.position.getX(e.geometry.attributes.position.count-1),l.y=e.geometry.attributes.position.getY(e.geometry.attributes.position.count-1),l.z=e.geometry.attributes.position.getZ(e.geometry.attributes.position.count-1);const g=d.distanceTo(l);a.three.element.innerText=g.toFixed(2);const m=l.clone().add(d).divideScalar(2);a.three.position.copy(m)}const r=this._markerKey.toString();return s.setupEvents(t,!0),s.getWorldMarkerList(t).set(r,{label:a,key:r,type:n,merged:!1,static:!1}),this._markerKey++,this.save(r,n),a}showKPStations(t){if(!this.world)throw new Error("A world is needed for this component to work!");if(this.type==="horizontal"){const i=this.generateStartAndEndKP(t);for(const[,n]of i)this.addKPStation(this.world,n.value,n.normal);const e=this.generateConstantKP(t);for(const[,n]of e)this.addKPStation(this.world,n.value,n.normal)}}showCurveLength(t,i){if(!this.world)throw new Error("A world is needed for this component to work!");const e=this.components.get(k),n=t.length,s=`${i.toFixed(2)} m`,o=Math.round(n/2),a=t[o],r=e.create(this.world,s,a,!0);r!==void 0&&this.save(r,"Radius")}showLineLength(t,i){if(!this.world)throw new Error("A world is needed for this component to work!");const e=this.components.get(k),n=new u;n.x=t.geometry.getAttribute("position").getX(0),n.y=t.geometry.getAttribute("position").getY(0),n.z=t.geometry.getAttribute("position").getZ(0);const s=new u;s.x=t.geometry.getAttribute("position").getX(1),s.y=t.geometry.getAttribute("position").getY(1),s.z=t.geometry.getAttribute("position").getZ(1);const o=`${i.toFixed(2)} m`,a=new u;a.addVectors(n,s).multiplyScalar(.5);const r=e.create(this.world,o,a,!0);r!==void 0&&this.save(r,"Radius")}showCurveRadius(t,i){if(!this.world)throw new Error("A world is needed for this component to work!");const e=this.components.get(k),n=new u;n.x=t.geometry.getAttribute("position").getX(0),n.y=t.geometry.getAttribute("position").getY(0),n.z=t.geometry.getAttribute("position").getZ(0);const s=new u;s.x=t.geometry.getAttribute("position").getX(1),s.y=t.geometry.getAttribute("position").getY(1),s.z=t.geometry.getAttribute("position").getZ(1);const o=`R = ${i.toFixed(2)} m`,a=new u;a.addVectors(n,s).multiplyScalar(.5);const r=e.create(this.world,o,a,!0);r!==void 0&&this.save(r,"Radius")}deleteByType(t=ot){const i=this.components.get(k);for(const e of t){const n=this._list.get(e);if(n){for(const s of n)i.delete(s);this._list.delete(e)}}}generateStartAndEndKP(t){const{alignment:i}=t.curve,e=new Map;for(const n of i.horizontal){const s=n.getLength();if(e.size>0){const o=n.index-1,r=e.get(o).distance+s,c=n.mesh.geometry.getAttribute("position"),d=c.count-1,l=new u;l.x=c.getX(d),l.y=c.getY(d),l.z=c.getZ(d);const g=this.createNormalLine(n.mesh);e.set(n.index,{value:this.getShortendKPValue(r),distance:r,point:l,normal:g})}else{const o=n.mesh.geometry.getAttribute("position"),a=o.count-1,r=new u;r.x=o.getX(a),r.y=o.getY(a),r.z=o.getZ(a);const c=this.createNormalLine(n.mesh);e.set(n.index,{value:this.getShortendKPValue(s),distance:s,point:r,normal:c})}}return e}createNormalLine(t){const i=t.geometry.attributes.position.count-1,e=i-1,n=new u;n.x=t.geometry.attributes.position.getX(i),n.y=t.geometry.attributes.position.getY(i),n.z=t.geometry.attributes.position.getZ(i);const s=new u;s.x=t.geometry.attributes.position.getX(e),s.y=t.geometry.attributes.position.getY(e),s.z=t.geometry.attributes.position.getZ(e);const a=new u().subVectors(n,s).clone().applyAxisAngle(new u(0,0,1),Math.PI*.5).normalize(),r=new y().setFromPoints([a.clone().setLength(10).add(n),a.clone().setLength(-10).add(n)]);return new v(r)}generateConstantKP(t){const{alignment:i}=t.curve,e=new Map,n=i.getLength("horizontal"),s=Math.floor(n/this.divisionLength);for(let o=0;o<s;o++){const a=o/s,r=i.getPointAt(a,"horizontal"),c=n*a,d=this.getNormal(i,r);e.set(o,{value:this.getShortendKPValue(c),distance:c,point:r,normal:d})}return e}getNormal(t,i){const e=[],n={start:new u,end:new u};for(let c=0;c<t.horizontal.length;c++){const l=t.horizontal[c].mesh.geometry.attributes.position,g=l.count;for(let m=0;m<g;m++){const w=l.getX(m),f=l.getY(m),P=l.getZ(m);e.push(new u(w,f,P))}}for(let c=0;c<e.length-1;c++){const d=e[c],l=e[c+1],g=d.distanceTo(i),m=l.distanceTo(i),w=d.distanceTo(l);Math.abs(g+m-w)<1e-5&&(n.start=d,n.end=l)}const o=new u().subVectors(n.end,n.start).clone().applyAxisAngle(new u(0,0,1),Math.PI*.5).normalize(),a=new y().setFromPoints([o.clone().setLength(10).add(i),o.clone().setLength(-10).add(i)]);return new v(a,new Z({color:16711680}))}getShortendKPValue(t){const i=t.toFixed(2),[e,n]=i.toString().split("."),s=n||"00";if(parseInt(e,10)>1e3&&parseInt(e,10)<1e4){const[o,...a]=e;return`${o}+${a.join("")}.${s}`}if(parseInt(e,10)>1e4){const[o,a,...r]=e;return`${o}${a}+${r.join("")}.${s}`}return`0+${e.padStart(3,"0")}.${s}`}save(t,i){this._list.has(i)||this._list.set(i,new Set),this._list.get(i).add(t)}};p(M,"uuid","0af12c32-81ee-4100-a030-e9ae546f6170");let L=M;class st extends B{constructor(t){super(t);p(this,"enabled",!0);p(this,"_highlighter");p(this,"onHighlight",new V);p(this,"onMarkerChange",new V);p(this,"mouseMarkers");p(this,"onMarkerHidden",new V);p(this,"_curves",[]);p(this,"_previousAlignment",null);p(this,"_world",null);p(this,"updateLinesResolution",t=>{var i;(i=this._highlighter)==null||i.setResolution(t)});p(this,"onMouseMove",t=>{var o,a,r;if(!this._world)throw new Error("No world was given for this navigator!");if(!this._world.renderer)return;const e=this._world.renderer.three.domElement.parentElement,n=this._world.camera.three,s=(o=this._highlighter)==null?void 0:o.castRay(t,n,e,this._curves);if(s){const{object:c}=s;(a=this._highlighter)==null||a.hover(c),this.updateMarker(s,"hover");return}this.mouseMarkers&&(this.mouseMarkers.hover.visible=!1),(r=this._highlighter)==null||r.unHover(),this.onMarkerHidden.trigger({type:"hover"})});p(this,"onClick",t=>{var o,a;if(!this._world)throw new Error("No world was given for this navigator!");if(!this._world.renderer)return;const e=this._world.renderer.three.domElement.parentElement,n=this._world.camera.three,s=(o=this._highlighter)==null?void 0:o.castRay(t,n,e,this._curves);if(s){const r=s,c=r.object;if((a=this._highlighter)==null||a.select(c),this.updateMarker(r,"select"),this._world.camera.hasCameraControls()&&(c.geometry.boundingBox||c.geometry.computeBoundingBox(),c.geometry.boundingBox)){const d=this.getScaledBox(c.geometry.boundingBox,2);this._world.camera.controls.fitToBox(d,!0)}this.onHighlight.trigger({mesh:c,point:r.point}),this._previousAlignment!==c.curve.alignment&&(this.components.get(L).showKPStations(c),this._previousAlignment=c.curve.alignment)}});p(this,"onControlsUpdated",()=>{if(!this._world)throw new Error("No world was given for this navigator!");if(!(this._world.camera.three instanceof et)||!this._highlighter)return;const{zoom:t,left:i,right:e,top:n,bottom:s}=this._world.camera.three,o=i-e,a=n-s,c=Math.max(o,a)/t,d=40,{caster:l}=this._highlighter;l.params.Line.threshold=c/d})}get highlighter(){if(!this._highlighter)throw new Error("Highlighter not initialized. You must set a world first!");return this._highlighter}get world(){return this._world}set world(t){var e,n,s;if(t===this._world||(this._world&&this.setupEvents(!1),this._world=t,(e=this._highlighter)==null||e.dispose(),(n=this.mouseMarkers)==null||n.hover.dispose(),(s=this.mouseMarkers)==null||s.select.dispose(),!t))return;const i=t.scene.three;this._highlighter=new nt(i,this.view),this.mouseMarkers={select:this.newMouseMarker("#ffffff",t),hover:this.newMouseMarker("#575757",t)},this.setupEvents(!0)}async draw(t,i){if(!t.civilData)throw new Error("The provided model doesn't have civil data!");if(!this._world)throw new Error("No world was given for this navigator!");const{alignments:e}=t.civilData,n=i||e.values(),s=this._world.scene.three,o=new I;o.makeEmpty(),o.min.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),o.max.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(const r of n){if(!r)throw new Error("Alignment not found!");for(const c of r[this.view])if(s.add(c.mesh),this._curves.push(c.mesh),!o.isEmpty())o.expandByObject(c.mesh);else{c.mesh.geometry.computeBoundingBox();const d=c.mesh.geometry.boundingBox;d instanceof I&&o.copy(d).applyMatrix4(c.mesh.matrixWorld)}}const a=this.getScaledBox(o,1.2);this._world.camera.hasCameraControls()&&await this._world.camera.controls.fitToBox(a,!1)}async dispose(){var t;(t=this._highlighter)==null||t.dispose(),this.clear(),this.onHighlight.reset(),this._curves=[]}clear(){var t,i;(t=this._highlighter)==null||t.unSelect(),(i=this._highlighter)==null||i.unHover();for(const e of this._curves)e.removeFromParent();this._curves=[]}setMarker(t,i,e){if(!this._curves.length)return;const n=t.getCurveAt(i,this.view),s=t.getPointAt(i,this.view),{index:o}=n.curve.getSegmentAt(n.percentage);this.setMouseMarker(s,n.curve.mesh,o,e)}setDefSegments(t){const i=[],e=[],n=(s,o)=>{const a=o[1]-s[1],r=o[0]-s[0];return a/r};for(let s=0;s<t.length;s++){const o=t[s];let a,r,c,d;for(let m=0;m<Object.keys(o).length/3;m++)if(o[m*3]!==void 0&&o[m*3+1]!==void 0){a=o[m*3],r=o[m*3+1];break}for(let m=Object.keys(o).length/3-1;m>=0;m--)if(o[m*3]!==void 0&&o[m*3+1]!==void 0){c=o[m*3],d=o[m*3+1];break}const g=(n([a,r],[c,d])*100).toFixed(2);e.push({slope:g})}for(const s of t)for(let o=0;o<s.length-3;o+=3){const a=s[o],r=s[o+1],c=s[o+2],d=s[o+3],l=s[o+4],g=s[o+5];i.push({start:new u(a,r,c),end:new u(d,l,g)})}return{defSegments:i,slope:e}}hideMarker(t){this.mouseMarkers&&(this.mouseMarkers[t].visible=!1)}setupEvents(t){var n,s;if(!this._world)throw new Error("No world was given for this navigator!");if(!this._world.renderer)return;const e=this._world.renderer.three.domElement.parentElement;(n=this._world.renderer)==null||n.onResize.remove(this.updateLinesResolution),e.removeEventListener("mousemove",this.onMouseMove),e.removeEventListener("click",this.onClick),this._world.camera.hasCameraControls()&&this._world.camera.controls.removeEventListener("update",this.onControlsUpdated),t&&(e.addEventListener("mousemove",this.onMouseMove),e.addEventListener("click",this.onClick),(s=this._world.renderer)==null||s.onResize.add(this.updateLinesResolution),this._world.camera.hasCameraControls()&&this._world.camera.controls.addEventListener("update",this.onControlsUpdated))}newMouseMarker(t,i){if(!this._world)throw new Error("No world was given for this navigator!");const e=i.scene.three,n=document.createElement("div"),s=document.createElement("div");n.appendChild(s),s.style.backgroundColor=t,s.style.width="3rem",s.style.height="3px";const o=new x(this._world,n,e);return o.visible=!1,o}setMouseMarker(t,i,e,n){if(e===void 0||!this.mouseMarkers)return;this.mouseMarkers[n].visible=!0;const s=this.mouseMarkers[n].three;s.position.copy(t);const o=i,{startPoint:a,endPoint:r}=o.curve.getSegment(e),c=Math.atan2(r.y-a.y,r.x-a.x),d=s.element.children[0],l=90-c/Math.PI*180;d.style.transform=`rotate(${l}deg)`}updateMarker(t,i){const{point:e,index:n,object:s}=t,o=s,a=o.curve,r=o.curve.alignment,c=r.getPercentageAt(e,this.view),d=e.clone();this.setMouseMarker(d,o,n,i),c!==null&&this.onMarkerChange.trigger({alignment:r,percentage:c,type:i,curve:a})}getScaledBox(t,i){const e=new I,n=new u,s=new u;return t.getCenter(s),t.getSize(n),n.multiplyScalar(i),e.setFromCenterAndSize(s,n),e}}class it{constructor(h,t,i){p(this,"components");p(this,"_scene");p(this,"_world");p(this,"offset",10);p(this,"markupLines",[]);p(this,"currentCurveMesh");p(this,"markupMaterial",new Z({color:6842472}));this.components=h,this._scene=t,this._world=i}showCurveInfo(h){switch(this.disposeMarkups(),this.currentCurveMesh=h,h.curve.data.TYPE){case"LINE":this.showLineInfo(h,this.offset);break;case"CIRCULARARC":this.showCircularArcInfo(h,this.offset);break;case"CLOTHOID":this.showClothoidInfo(h,this.offset);break;default:console.log("Unknown curve type:",h.curve.data.TYPE);break}}updateOffset(h,t,i){const n=Math.max(h.height,h.width)/(t*150);n!==this.offset&&(this.offset=n,i&&this.currentCurveMesh&&this.showCurveInfo(this.currentCurveMesh))}dispose(){for(const h of this.markupLines)h.removeFromParent();this.disposeMarkups(),this.markupMaterial.dispose()}disposeMarkups(){for(const h of this.markupLines)h.geometry.dispose(),h.removeFromParent();this.markupLines=[]}unSelect(){this.disposeMarkups()}calculateTangent(h,t){const e=t*3,n=Math.max(0,e-3),s=Math.min(h.length-3,e+3),o=new u().fromArray(h,n);return new u().fromArray(h,s).clone().sub(o).normalize()}calculateParallelCurve(h,t,i){const e=[];for(let n=0;n<t;n++){const o=this.calculateTangent(h,n).clone().applyAxisAngle(new u(0,0,1),Math.PI/2);o.normalize();const a=o.clone().multiplyScalar(i),r=n*3,c=new u().fromArray(h,r).add(a);e.push(c)}return e}calculateDimensionLines(h,t){const i=[],e=h.geometry.attributes.position.array,n=t.geometry.attributes.position.array;if(e.length<6&&n.length<6)throw new Error("Line must have at least two vertices");const s=new u(e[0],e[1],e[2]),o=new u(n[0],n[1],n[2]),a=[],r=e.length-3,c=new u(e[r],e[r+1],e[r+2]),d=n.length-3,l=new u(n[d],n[d+1],n[d+2]);return i.push(s,o),a.push(c,l),{startDimensionPoints:i,endDimensionPoints:a}}offsetDimensionLine(h,t){const e=new u().copy(h[h.length-1]).sub(h[0]).normalize().clone().multiplyScalar(t);return h.map(s=>s.clone().add(e))}showLineInfo(h,t){const i=this.components.get(L);i.world=this._world,i.deleteByType(["Length","Radius"]);const e=h.geometry.attributes.position.array,n=this.calculateParallelCurve(e,e.length/3,t),s=new y().setFromPoints(n),o=new v(s,this.markupMaterial);i.showLineLength(o,h.curve.getLength()),this._scene.add(o),this.markupLines.push(o);const{startDimensionPoints:a,endDimensionPoints:r}=this.calculateDimensionLines(h,o),c=this.offsetDimensionLine(a,t*.1),d=this.offsetDimensionLine(r,t*.1),l=new y().setFromPoints(c),g=new y().setFromPoints(d),m=new v(l,this.markupMaterial);this._scene.add(m),this.markupLines.push(m);const w=new v(g,this.markupMaterial);this._scene.add(w),this.markupLines.push(w)}showClothoidInfo(h,t){const i=this.components.get(L);i.world=this._world,i.deleteByType(["Length","Radius"]);const e=h.geometry.attributes.position.array,n=this.calculateParallelCurve(e,e.length/3,t),s=new y().setFromPoints(n);i.showCurveLength(n,h.curve.getLength());const o=new v(s,this.markupMaterial);this._scene.add(o),this.markupLines.push(o);const{startDimensionPoints:a,endDimensionPoints:r}=this.calculateDimensionLines(h,o),c=this.offsetDimensionLine(a,t*.1),d=this.offsetDimensionLine(r,t*.1),l=new y().setFromPoints(c),g=new y().setFromPoints(d),m=new v(l,this.markupMaterial);this._scene.add(m),this.markupLines.push(m);const w=new v(g,this.markupMaterial);this._scene.add(w),this.markupLines.push(w)}showCircularArcInfo(h,t){const i=this.components.get(L);i.world=this._world,i.deleteByType(["Length","Radius"]);const e=h.curve.data.RADIUS,n=h.geometry.attributes.position.array,s=h.geometry.attributes.position.count,o=[],a=new u(n[0],n[1],n[2]),r=(s-1)*3,c=new u(n[r],n[r+1],n[r+2]),d=s/2*3,l=new u(n[d],n[d+1],n[d+2]),g=c.clone().sub(a).normalize(),m=new u(-g.y,g.x,0);m.multiplyScalar(e);const w=l.clone().add(m);o.push(l),o.push(w);const f=new y().setFromPoints(o),P=new v(f,this.markupMaterial);i.showCurveRadius(P,Math.abs(e)),this._scene.add(P),this.markupLines.push(P);const A=[];for(let _=0;_<s;_++){const Y=this.calculateTangent(n,_),j=h.curve.data.RADIUS,E=new u(Y.y,-Y.x,0);E.normalize(),j<0&&E.negate();const z=E.clone().multiplyScalar(t),D=_*3,O=new u(n[D]+z.x,n[D+1]+z.y,n[D+2]+z.z);A.push(O)}const H=new y().setFromPoints(A);i.showCurveLength(A,h.curve.getLength());const C=new v(H,this.markupMaterial);this._scene.add(C),this.markupLines.push(C);const{startDimensionPoints:R,endDimensionPoints:T}=this.calculateDimensionLines(h,C),N=this.offsetDimensionLine(R,t*.1),U=this.offsetDimensionLine(T,t*.1),$=new y().setFromPoints(N),G=new y().setFromPoints(U),X=new v($,this.markupMaterial);this._scene.add(X),this.markupLines.push(X);const K=new v(G,this.markupMaterial);this._scene.add(K),this.markupLines.push(K)}}const S=class S extends st{constructor(t){super(t);p(this,"view","horizontal");p(this,"planHighlighter");this.components.add(S.uuid,this),this.onHighlight.add(({mesh:i})=>{!this._highlighter||!this.planHighlighter||this.planHighlighter.showCurveInfo(i)})}get world(){return super.world}set world(t){var i;super.world=t,t&&((i=this.planHighlighter)==null||i.dispose(),this.planHighlighter=new it(this.components,t.scene.three,t))}};p(S,"uuid","3096dea0-5bc2-41c7-abce-9089b6c9431b");let F=S;export{F as C,st as a,L as b};