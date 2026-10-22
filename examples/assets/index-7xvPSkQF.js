import{E as N,R as fe,C as ke,n as Me,y as dt,a as ut,z as pt,B as P,F as M,W as _e,S as Ee,O as Te,G as ht,T as be,H as Se,J as se,K as le,P as Y,Q as we,X as mt,h as bt}from"./graphic-vertex-picker-DI4NqEOA.js";import{V as Ie,C as H,bw as ge,w as gt,a as De,R as ye,l as ft,t as yt,J as vt,bx as ce,by as O,bz as _t,bA as de,b,E as Pe,bB as F,m as C,d as wt,G as xe,ax as St,L as xt,o as $e,B as $t,p as Ct,n as E,K as I,bC as J,bD as kt,bE as Re,bF as Mt}from"./TransformControls-lNp9RmyE.js";let Et=class{three;world;wasVisible=!0;onDisposed=new N;set visible(e){this.three.visible=e,this.wasVisible=e}get visible(){return this.three.visible}constructor(e,t,i){this.world=e;let s;if(t)s=t;else{s=document.createElement("div");const o="6px";s.style.color="white",s.style.height=o,s.style.width=o,s.style.borderRadius="50%",s.style.border="2px solid rgb(122, 75, 209)",s.style.zIndex="-20"}this.three=new ke(s),(i||e.scene.three).add(this.three),this.visible=!0}toggleVisibility(){this.visible=!this.visible}notDisplay(){this.visible=!1}dispose(){this.three.removeFromParent(),this.three.element.remove(),this.onDisposed.trigger(),this.onDisposed.reset()}};class Tt extends Me{three2D=new dt;constructor(e,t,i){super(e,t,i),this.onAfterUpdate.add(()=>{if(this.onBeforeUpdate.trigger(this),!this.enabled||!this.currentWorld)return;const s=this.currentWorld.scene.three,o=this.currentWorld.camera.three;s instanceof De&&this.three2D.render(s,o)}),this.onDisposed.add(()=>{this.three2D.domElement.remove()}),this.onResize.add(({x:s,y:o})=>{this.three2D.setSize(s,o)}),this.setupHtmlRenderer(),this.resize()}setupHtmlRenderer(){this.three2D.domElement.style.position="absolute",this.three2D.domElement.style.top="0px",this.three2D.domElement.style.pointerEvents="none",this.container&&(this.container.appendChild(this.three2D.domElement),this.container.style.position="relative")}}const It=16;Array.from({length:It},()=>new Ie);const Oe=8;Array.from({length:Oe},(r,e)=>e===0?null:`    if (lvl == ${e}) result = texture(uHiZ[${e}], uv).r;`).filter(Boolean).join(`
`);Array.from({length:Oe},(r,e)=>`    if (slot == ${e}) return texture(uDepthChain[${e}], at).r;`).join(`
`);new H(0,0,0),new H(1,1,1),new H(1,1,1);new H(1,1,1);let oe=class ve extends ut{static uuid="cb8a76f2-654a-4b50-80c6-66fd83cafd77";onDisposed=new N;onBeforeUpdate=new N;onAfterUpdate=new N;onSetup=new N;isSetup=!1;enabled=!0;events={};multiple="ctrlKey";zoomFactor=1.5;zoomToSelection=!1;backupColor=null;selection={};config={selectName:"select",selectionColor:null,autoHighlightOnClick:!0,world:null,selectEnabled:!0,autoUpdateFragments:!0,selectMaterialDefinition:{color:new H("#BCF124"),renderedFaces:ye.ONE,opacity:1,transparent:!1,preserveOriginalMaterial:!0,_explicitProps:["color","opacity","transparent"]}};styles=new ft;autoToggle=new Set;mouseDownPosition={x:0,y:0};mouseMoveThreshold=5;selectable={};eventManager=new pt;_mouseState={down:!1,moved:!1};constructor(e){super(e),this.components.add(ve.uuid,this),this.eventManager.list.add(this.onSetup),this.eventManager.list.add(this.onDisposed),this.setStyleEvents()}setStyleEvents(){this.styles.onBeforeDelete.add(async({key:e})=>{if(await this.clear(e),delete this.selection[e],!(e in this.events))return;const{onClear:t,onHighlight:i,onBeforeHighlight:s}=this.events[e];this.eventManager.list.delete(t),this.eventManager.list.delete(i),this.eventManager.list.delete(s),delete this.events[e]}),this.styles.onItemSet.add(({key:e})=>{this.selection[e]={};const t=new N,i=new N,s=new N;this.events[e]={onHighlight:t,onClear:s,onBeforeHighlight:i},this.eventManager.add([s,t,i])})}async dispose(){this.setupEvents(!1),this.onBeforeUpdate.reset(),this.onAfterUpdate.reset(),this.selection={},this.styles.clear(),this.onDisposed.trigger(ve.uuid),this.eventManager.reset(),this.isSetup=!1}add(e){if(console.warn("highlighter.add() is deprecated, use highlighter.styles.set() instead"),typeof e=="string")this.styles.set(e,null);else{const{customId:t}=e;this.styles.set(t,e)}}async remove(e){console.warn("highlighter.remove() is deprecated, use highlighter.styles.delete() instead"),this.styles.delete(e)}async highlight(e,t=!0,i=this.zoomToSelection,s=null){if(!this.enabled)return;if(!this.config.world)throw new Error("No world found in config!");const o=this.config.world;if(!this.selection[e])throw new Error(`Selection ${e} does not exist.`);const n=await this.components.get(fe).get(o).castRay();if(!n||n.localId===void 0||n.localId===null){t&&this.clear(e);return}const{localId:a,fragments:{modelId:l}}=n,c={[l]:new Set([a])};await this.highlightByID(e,c,t,i,s,!0)}_fromHighlight=!1;async highlightByID(e,t,i=!0,s=this.zoomToSelection,o=null,n=!1){if(!this.enabled)return;this._fromHighlight=!0,this.events[e].onBeforeHighlight.trigger(this.selection[e]);let a=P.clone(t);const l=this.components.get(M);for(const[p,m]of Object.entries(t)){const h=l.list.get(p);h?.isDeltaModel&&h.parentModelId&&P.add(a,{[h.parentModelId]:m})}const c=this.selectable?.[e];if(c){const p=P.clone(c);a=P.intersect([a,p])}if(o){const p=P.clone(o);for(const[m,h]of Object.entries(p)){const f=l.list.get(m);f?.deltaModelId&&P.add(p,{[f.deltaModelId]:h})}P.remove(a,o)}const d=n&&this.autoToggle.has(e),u=d&&P.isEqual(this.selection[e],a);if(i&&!u&&await this.clear(e),d){const p={};let m=!1;for(const h in a){const f=this.selection[e][h];if(!f)continue;const v=a[h];for(const y of v)if(f.has(y)){f.delete(y);let g=p[h];g||(g=new Set,p[h]=g),g.add(y),m=!0}else f.add(y);a[h]=f}m&&this.events[e].onClear.trigger(p)}this.updateStyleMap(e,a),this.events[e].onHighlight.trigger(this.selection[e]),this._fromHighlight=!1,await this.updateColors(),s&&await this.zoomSelection(a)}async updateColors(){const e=this.components.get(M),t=[e.resetHighlight()],i={};for(const s of this.getStylesByPriority()){const o=this.styles.get(s);if(!o)continue;const n=P.clone(this.selection[s]);if(P.remove(n,i),P.add(i,this.selection[s]),P.isEmpty(n))continue;const{priority:a,...l}=o;t.push(e.highlight({...l,customId:s},n))}this.config.autoUpdateFragments&&t.push(e.core.update(!0)),await Promise.allSettled(t)}getStylesByPriority(){const e=Object.keys(this.selection);return[...e].sort((t,i)=>{const s=this.getPriority(t),o=this.getPriority(i);return s!==o?o-s:e.indexOf(i)-e.indexOf(t)})}getPriority(e){const t=this.styles.get(e)?.priority;return t!==void 0?t:e===this.config.selectName?Number.MAX_SAFE_INTEGER:0}updateStyleMap(e,t){const i=this.selection[e];for(const s in t){let o=i[s];o||(o=new Set,i[s]=o);const n=t[s];for(const a of n)o.add(a)}}async clear(e,t){const i=e?[e]:Object.keys(this.selection),s=t??void 0;for(const o of i){const n=this.selection[o]??{},a=s??n,l={};for(const[c,d]of Object.entries(a)){const u=n[c];if(u)for(const p of d){if(!u.delete(p))continue;let m=l[c];m||(m=new Set,l[c]=m),m.add(p)}}Object.keys(l).length>0&&this.events[o].onClear.trigger(l),P.remove(this.selection[o],l)}this._fromHighlight||await this.updateColors()}setup(e){if(this.isSetup)return;this.config={...this.config,...e};const{selectName:t,selectionColor:i,selectMaterialDefinition:s}=this.config;this.config.world&&this.components.get(fe).get(this.config.world),s?(i&&(console.warn("highlighter.config.selectionColor is deprecated, use selectMaterialDefinition instead"),s.color=i),this.styles.set(t,s)):this.styles.set(t,null),this.autoToggle.add(this.config.selectName),this.setupEvents(!0),this.enabled=!0,this.isSetup=!0,this.onSetup.trigger(this)}async zoomSelection(e){if(!this.config.world)throw new Error("No world found in config!");const t=this.config.world;let i=!1;for(const f in e)if(e[f].size>0){i=!0;break}if(!i||!t.camera.hasCameraControls())return;const s=await this.components.get(M).getBBoxes(e),o=new vt,n=new yt;for(const f of s)n.union(f);n.getBoundingSphere(o);const a=1/0,l=-1/0,{x:c,y:d,z:u}=o.center,p=o.radius===a||c===a||d===a||u===a,m=o.radius===l||c===l||d===l||u===l,h=o.radius===0;p||m||h||(o.radius*=this.zoomFactor,await t.camera.controls.fitToSphere(o,!0))}setupEvents(e){if(!this.config.world){console.log("No world found while setting up events!");return}if(this.config.world.isDisposing)return;if(!this.config.world.renderer)throw new Error("The given world doesn't have a renderer!");const t=this.config.world.renderer.three.domElement;t.removeEventListener("mousedown",this.onMouseDown),t.removeEventListener("mouseup",this.onMouseUp),t.removeEventListener("pointermove",this.onMouseMove),e&&(t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("mouseup",this.onMouseUp),t.addEventListener("pointermove",this.onMouseMove))}onMouseDown=e=>{this.enabled&&(this.debounceTimeout&&clearTimeout(this.debounceTimeout),this.mouseDownPosition={x:e.clientX,y:e.clientY},this._mouseState.down=!0)};debounceTimeout=null;onMouseUp=async e=>{if(!this.enabled)return;const{world:t,autoHighlightOnClick:i,selectEnabled:s}=this.config;if(!t)throw new Error("No world found!");if(!t.renderer)throw new Error("This world doesn't have a renderer!");if(e.target===t.renderer.three.domElement){if(this._mouseState.down=!1,this._mouseState.moved||e.button!==0){this._mouseState.moved=!1;return}if(this._mouseState.moved=!1,i&&s){const o=this.multiple==="none"?!0:!e[this.multiple];await this.highlight(this.config.selectName,o,this.zoomToSelection)}}};onMouseMove=async e=>{if(!this.enabled)return;const t=e.clientX-this.mouseDownPosition.x,i=e.clientY-this.mouseDownPosition.y,s=Math.sqrt(t*t+i*i);this._mouseState.moved||s>this.mouseMoveThreshold&&(this._mouseState.moved=this._mouseState.down)}},Vi=class W{onDisposed=new N;marker=null;_world=null;set world(e){e!==this._world&&(this.detachCursorTracking(),this._world=e,e&&this.attachCursorTracking())}get world(){return this._world}_pointerMoveHandler=null;mode=0;maxDistance=1;_pickerSize=6;get pickerSize(){return this._pickerSize}set pickerSize(e){this._pickerSize=e;const t=`${e}px`;this.marker&&(this.marker.three.element.style.width=t,this.marker.three.element.style.height=t)}_enabled=!1;set enabled(e){this._enabled=e,this.marker&&(this.marker.visible=e),e&&this.get()}get enabled(){return this._enabled}_components;static baseSnappingStyle={height:"6px",width:"6px",borderRadius:"100%",borderWidth:"2px",borderColor:"rgb(122, 75, 209)",borderStyle:"solid",zIndex:"-20"};static snappingStyles={[ge.FACE]:{...W.baseSnappingStyle},[ge.POINT]:{...W.baseSnappingStyle,borderColor:"#e25959",borderRadius:"0"},[ge.LINE]:{...W.baseSnappingStyle,borderColor:"#2d2d2d",borderRadius:"0"}};constructor(e){this._components=e}dispose(){this.detachCursorTracking(),this.marker&&this.marker.dispose()}async get(e){const t=e?.world??this.world;if(!t)throw new Error("GraphicVertexPicker: a world is need to get a casting result.");const i=await this._components.get(fe).get(t).castRay({snappingClasses:e?.snappingClasses});if(i){if(!this.marker){const s=document.createElement("div");this.marker=new Et(t,s)}if(this.marker.world!==t&&(this.marker.world=t,this.marker.three.removeFromParent(),t.scene.three.add(this.marker.three)),this.marker.visible=!0,this.marker.three.position.copy(i.point),this._snapStickyClient={x:this._lastClient.x,y:this._lastClient.y},"snappingClass"in i&&typeof i.snappingClass=="number"&&(i.snappingClass===0||i.snappingClass===1||i.snappingClass===2)){const s=W.snappingStyles[i.snappingClass]??W.baseSnappingStyle;Object.assign(this.marker.three.element.style,s)}else Object.assign(this.marker.three.element.style,W.baseSnappingStyle);this.applyMarkerSize()}else this.marker&&(this.marker.visible=!1,this._snapStickyClient=null);return i}applyMarkerSize(){if(!this.marker)return;const e=`${this._pickerSize}px`;this.marker.three.element.style.width=e,this.marker.three.element.style.height=e}stickyRadiusPx=12;_lastNdc=new gt(2,2);_lastClient={x:0,y:0};_ndcWorld=new Ie;_cursorRafScheduled=!1;_snapStickyClient=null;attachCursorTracking(){if(!this._world?.renderer)return;const e=this._world.renderer.three.domElement;this._pointerMoveHandler=t=>{const i=e.getBoundingClientRect(),s=(t.clientX-i.left)/i.width*2-1,o=-((t.clientY-i.top)/i.height)*2+1;if(this._lastNdc.set(s,o),this._lastClient.x=t.clientX,this._lastClient.y=t.clientY,this._snapStickyClient){const n=t.clientX-this._snapStickyClient.x,a=t.clientY-this._snapStickyClient.y;if(n*n+a*a<=this.stickyRadiusPx*this.stickyRadiusPx)return;this._snapStickyClient=null}this._cursorRafScheduled||(this._cursorRafScheduled=!0,requestAnimationFrame(()=>{this._cursorRafScheduled=!1,this.syncMarkerToCursor(),this._world?.renderer?.update()}))},e.addEventListener("pointermove",this._pointerMoveHandler)}detachCursorTracking(){!this._pointerMoveHandler||!this._world?.renderer||(this._world.renderer.three.domElement.removeEventListener("pointermove",this._pointerMoveHandler),this._pointerMoveHandler=null)}syncMarkerToCursor(){if(!this.marker||!this._world?.camera)return;const e=this._world.camera.three;this._ndcWorld.set(this._lastNdc.x,this._lastNdc.y,.5).unproject(e),this.marker.three.position.copy(this._ndcWorld)}};class Dt{constructor(e,t){this._group=new xe,this._frustum=new St,this._frustumMat=new Pe,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new xt({color:"#2e3338"}),this.numbers=new xe,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._offsetX=0,this._offsetY=0,this._camera=e,this._container=t;const i=this.newGrid(-1),s=this.newGrid(-2);this.grids={main:i,secondary:s},this._group.add(s,i,this.numbers)}set scaleX(e){this._scaleX=e,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(e){this._scaleY=e,this.regenerate()}get scaleY(){return this._scaleY}set offsetX(e){this._offsetX=e,this.regenerate()}get offsetX(){return this._offsetX}set offsetY(e){this._offsetY=e,this.regenerate()}get offsetY(){return this._offsetY}get(){return this._group}dispose(){const{main:e,secondary:t}=this.grids;e.removeFromParent(),t.removeFromParent(),e.geometry.dispose(),e.material.dispose(),t.geometry.dispose(),t.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const e=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(e);const{planes:t}=this._frustum,i=t[0].constant*-t[0].normal.x,s=t[1].constant*-t[1].normal.x,o=t[2].constant*-t[2].normal.y,n=t[3].constant*-t[3].normal.y,a=Math.abs(i-s),l=Math.abs(n-o),{clientWidth:c,clientHeight:d}=this._container,u=Math.max(c,d),p=Math.max(a,l)/u,m=Math.ceil(Math.log10(a/this.scaleX)),h=Math.ceil(Math.log10(l/this.scaleY)),f=10**(m-2)*this.scaleX,v=10**(h-2)*this.scaleY,y=f*this.gridsFactor,g=v*this.gridsFactor,_=Math.ceil(l/g),w=Math.ceil(a/y),x=Math.ceil(l/v),$=Math.ceil(a/f),z=f*Math.ceil(s/f),U=v*Math.ceil(o/v),A=y*Math.ceil(s/y),j=g*Math.ceil(o/g),X=[...this.numbers.children];for(const T of X)T.removeFromParent();this.numbers.children=[];const L=[],V=9*p,S=1e4,D=A+this._offsetX,G=Math.round(Math.abs(D/this.scaleX)*S)/S,ue=(w-1)*y,ot=Math.round(Math.abs((D+ue)/this.scaleX)*S)/S,nt=Math.max(G,ot).toString().length*V;let pe=Math.ceil(nt/y)*y;for(let T=0;T<w;T++){let k=A+T*y;L.push(k,n,0,k,o,0),k=Math.round(k*S)/S,pe=Math.round(pe*S)/S;const te=k%pe;if(!(y<1||g<1)&&Math.abs(te)>.01)continue;const re=this.newNumber((k+this._offsetX)/this.scaleX),me=12*p;re.position.set(k,o+me,0)}for(let T=0;T<_;T++){const k=j+T*g;L.push(s,k,0,i,k,0);const te=this.newNumber(k/this.scaleY);let re=12;te.element.textContent&&(re+=4*te.element.textContent.length);const me=re*p;te.position.set(s+me,k,0)}const he=[];for(let T=0;T<$;T++){const k=z+T*f;he.push(k,n,0,k,o,0)}for(let T=0;T<x;T++){const k=U+T*v;he.push(s,k,0,i,k,0)}const rt=new $e(new Float32Array(L),3),at=new $e(new Float32Array(he),3),{main:lt,secondary:ct}=this.grids;lt.geometry.setAttribute("position",rt),ct.geometry.setAttribute("position",at)}newNumber(e){const t=document.createElement("bim-label");t.textContent=String(Math.round(e*100)/100);const i=new ke(t);return this.numbers.add(i),i}newGrid(e){const t=new $t,i=new Ct(t,this.material);return i.frustumCulled=!1,i.renderOrder=e,i}isGridReady(){const e=this._camera.projectionMatrix.elements;for(let t=0;t<e.length;t++){const i=e[t];if(Number.isNaN(i))return!1}return!0}}var Pt=Object.defineProperty,Rt=Object.getOwnPropertyDescriptor,ne=(r,e,t,i)=>{for(var s=Rt(e,t),o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(e,t,s)||s);return s&&Pt(e,t,s),s};const ze=class extends de{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(e){if(this._gridColor=e,!(e&&this._grid))return;const t=Number(e.replace("#","0x"));Number.isNaN(t)||this._grid.material.color.setHex(t)}get gridColor(){return this._gridColor}set gridScaleX(e){this._gridScaleX=e,e&&this._grid&&(this._grid.scaleX=e)}get gridScaleX(){return this._gridScaleX}set gridScaleY(e){this._gridScaleY=e,e&&this._grid&&(this._grid.scaleY=e)}get gridScaleY(){return this._gridScaleY}get gridOffsetX(){var e;return((e=this._grid)==null?void 0:e.offsetX)||0}set gridOffsetX(e){this._grid&&(this._grid.offsetX=e)}get gridOffsetY(){var e;return((e=this._grid)==null?void 0:e.offsetY)||0}set gridOffsetY(e){this._grid&&(this._grid.offsetY=e)}set components(e){this.dispose();const t=e.get(_e).create();this._world=t,t.scene=new Ee(e),t.scene.setup(),t.renderer=new Tt(e,this);const i=new Te(e);t.camera=i;const s=new Dt(i.threeOrtho,this);this._grid=s,t.scene.three.add(s.get()),i.controls.addEventListener("update",()=>s.regenerate()),setTimeout(async()=>{t.camera.updateAspect(),i.set("Plan"),await i.controls.setLookAt(0,0,100,0,0,0),await i.projection.set("Orthographic"),i.controls.dollySpeed=3,i.controls.draggingSmoothTime=.085,i.controls.maxZoom=1e3,i.controls.zoom(4)})}get world(){return this._world}dispose(){var e;(e=this.world)==null||e.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return b`<slot></slot>`}};ze.styles=ce`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let ee=ze;ne([O({type:String,attribute:"grid-color",reflect:!0})],ee.prototype,"gridColor");ne([O({type:Number,attribute:"grid-scale-x",reflect:!0})],ee.prototype,"gridScaleX");ne([O({type:Number,attribute:"grid-scale-y",reflect:!0})],ee.prototype,"gridScaleY");ne([O({type:Number,attribute:"grid-offset-x",reflect:!0})],ee.prototype,"gridOffsetX");ne([O({type:Number,attribute:"grid-offset-y",reflect:!0})],ee.prototype,"gridOffsetY");var Ot=Object.defineProperty,q=(r,e,t,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(e,t,s)||s);return s&&Ot(e,t,s),s};const Ae=class extends de{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new Pe,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=e=>Math.abs(e)<1e-10?0:e}set camera(e){this._camera=e,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:e}=this._matrix;this._cssMatrix3D=`matrix3d(
      ${this._epsilon(e[0])},
      ${this._epsilon(-e[1])},
      ${this._epsilon(e[2])},
      ${this._epsilon(e[3])},
      ${this._epsilon(e[4])},
      ${this._epsilon(-e[5])},
      ${this._epsilon(e[6])},
      ${this._epsilon(e[7])},
      ${this._epsilon(e[8])},
      ${this._epsilon(-e[9])},
      ${this._epsilon(e[10])},
      ${this._epsilon(e[11])},
      ${this._epsilon(e[12])},
      ${this._epsilon(-e[13])},
      ${this._epsilon(e[14])},
      ${this._epsilon(e[15])})
    `}render(){const e=this.size??this._defaults.size;return b`
      <style>
        .face,
        .cube {
          width: ${e}px;
          height: ${e}px;
          transform: translateZ(-300px) ${this._cssMatrix3D};
        }

        .face-right {
          translate: ${e/2}px 0 0;
        }

        .face-left {
          translate: ${-e/2}px 0 0;
        }

        .face-top {
          translate: 0 ${e/2}px 0;
        }

        .face-bottom {
          translate: 0 ${-e/2}px 0;
        }

        .face-front {
          translate: 0 0 ${e/2}px;
        }

        .face-back {
          translate: 0 0 ${-e/2}px;
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
    `}};Ae.styles=ce`
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
      background-color: var(--bim-ui_accent-base, white);
    }

    .y-direction {
      // background-color: var(--bim-view-cube_y--bgc, #54ff19DD);
      background-color: var(--bim-view-cube_y--bgc, #8d0ec8de);
    }

    .y-direction:hover {
      background-color: var(--bim-ui_accent-base, white);
    }

    .z-direction {
      // background-color: var(--bim-view-cube_z--bgc, #3041c9DD);
      background-color: var(--bim-view-cube_z--bgc, #2718afde);
    }

    .z-direction:hover {
      background-color: var(--bim-ui_accent-base, white);
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
  `;let B=Ae;q([O({type:Number,reflect:!0})],B.prototype,"size");q([O({type:String,attribute:"right-text",reflect:!0})],B.prototype,"rightText");q([O({type:String,attribute:"left-text",reflect:!0})],B.prototype,"leftText");q([O({type:String,attribute:"top-text",reflect:!0})],B.prototype,"topText");q([O({type:String,attribute:"bottom-text",reflect:!0})],B.prototype,"bottomText");q([O({type:String,attribute:"front-text",reflect:!0})],B.prototype,"frontText");q([O({type:String,attribute:"back-text",reflect:!0})],B.prototype,"backText");q([_t()],B.prototype,"_cssMatrix3D");var zt=Object.defineProperty,At=(r,e,t,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(e,t,s)||s);return s&&zt(e,t,s),s};const je=class extends de{constructor(){super(...arguments),this.world=null,this._components=null,this._viewport=F()}set components(e){var t;if(this._components=e,this.components){const i=this.components.get(_e);this.world=i.create(),this.world.name=this.name}else(t=this.world)==null||t.dispose(),this.world=null}get components(){return this._components}connectedCallback(){super.connectedCallback(),this.world&&(this.world.enabled=!0)}disconnectedCallback(){super.disconnectedCallback(),this.world&&(this.world.enabled=!1)}dispose(){this.components=null,this.remove()}firstUpdated(){const{value:e}=this._viewport;if(!(this.components&&e&&this.world))return;const t=new Ee(this.components);this.world.scene=t,t.setup(),t.three.background=null;const i=new Me(this.components,e);this.world.renderer=i;const s=new Te(this.components);this.world.camera=s;const o=this.components.get(ht).create(this.world);o.material.uniforms.uColor.value=new H(4342338),o.material.uniforms.uSize1.value=2,o.material.uniforms.uSize2.value=8}onSlotChange(){const e=new Event("slotchange");this.dispatchEvent(e)}render(){return b` <bim-viewport ${C(this._viewport)}>
      <slot @slotchange=${this.onSlotChange}></slot>
    </bim-viewport>`}};je.styles=ce``;let Le=je;At([O({type:String,reflect:!0})],Le.prototype,"name");const Ne=class extends de{constructor(){super(...arguments),this._canvasRef=F(),this._worldRef=F(),this._overlaysRef=F(),this._toolbarContainerRef=F(),this._vpToolbarRef=F(),this._paperToolbarRef=F(),this._renderer=null,this._resizeObserver=null,this._slots=new Map,this._paperLabels=new Map,this._renderPending=!1,this._pan={x:40,y:40},this._zoom=.5,this._panning=!1,this._panStart={x:0,y:0},this._panOrigin={x:0,y:0},this._editingSlot=null,this._selectedSlot=null,this._selectedPaper=null,this._vpSection=null,this._vpNameInput=null,this._vpScaleDropdown=null,this._paperSection=null,this._paperSheetInput=null,this._paperLabelInput=null,this._paperSizeDropdown=null,this._paperOrientDropdown=null,this._dragSlot=null,this._dragType=null,this._dragStartClient={x:0,y:0},this._dragTotalMovement=0,this._dragOrigin=null,this._dragPaper=null,this._dragPaperStartClient={x:0,y:0},this._dragPaperOrigin={x:0,y:0},this._dragPaperTotalMovement=0,this.components=null,this._onWheel=e=>{e.preventDefault();const t=this.getBoundingClientRect(),i=e.clientX-t.left,s=e.clientY-t.top,o=Math.pow(.999,e.deltaY),n=Math.max(.05,Math.min(10,this._zoom*o));this._pan.x=i-(i-this._pan.x)*(n/this._zoom),this._pan.y=s-(s-this._pan.y)*(n/this._zoom),this._zoom=n,this._applyTransform(),this.requestRender()},this._onMouseDown=e=>{if(e.button===0&&!this._editingSlot){const t=e.composedPath().find(i=>i instanceof Element&&i.tagName==="BIM-PAPER-SPACE");t?(this._dragPaper=t,this._dragPaperStartClient={x:e.clientX,y:e.clientY},this._dragPaperOrigin={x:t.offsetLeft,y:t.offsetTop},this._dragPaperTotalMovement=0):(this._selectedSlot&&this._selectSlot(null),this._selectedPaper&&this._selectPaper(null))}e.button!==1&&e.button!==2||(e.preventDefault(),this._panning=!0,this._panStart={x:e.clientX,y:e.clientY},this._panOrigin={...this._pan},this.style.cursor="grabbing")},this._onMouseMove=e=>{if(this._panning&&(this._pan.x=this._panOrigin.x+(e.clientX-this._panStart.x),this._pan.y=this._panOrigin.y+(e.clientY-this._panStart.y),this._applyTransform(),this.requestRender()),this._dragSlot&&this._dragType&&this._dragOrigin){const t=e.clientX-this._dragStartClient.x,i=e.clientY-this._dragStartClient.y;this._dragTotalMovement=Math.max(this._dragTotalMovement,Math.abs(t)+Math.abs(i)),this._dragType==="move"?this._applyMoveDrag(t,i):this._applyResizeDrag(this._dragType,t,i),this.requestRender()}if(this._dragPaper){const t=e.clientX-this._dragPaperStartClient.x,i=e.clientY-this._dragPaperStartClient.y;this._dragPaperTotalMovement=Math.max(this._dragPaperTotalMovement,Math.abs(t)+Math.abs(i)),this._dragPaper.style.left=`${this._dragPaperOrigin.x+t/this._zoom}px`,this._dragPaper.style.top=`${this._dragPaperOrigin.y+i/this._zoom}px`,this.requestRender()}},this._onMouseUp=e=>{if(this._panning&&(e.button===1||e.button===2)&&(this._panning=!1,this.style.cursor="default"),this._dragSlot&&e.button===0){const t=this._dragTotalMovement<4,i=this._dragSlot;this._dragSlot=null,this._dragType=null,this._dragOrigin=null,t&&this._handleSlotClick(i,e)}if(this._dragPaper&&e.button===0){const t=this._dragPaperTotalMovement<4,i=this._dragPaper;this._dragPaper=null,t&&this._selectPaper(this._selectedPaper===i?null:i)}},this._onContextMenu=e=>e.preventDefault()}addViewport(e,t,i,s){var o;const n={drawingId:t,viewportId:i,paper:e,x:s.x,y:s.y,borderEl:null,nameEl:null,handles:null};this._createBorderEl(n),(o=this._overlaysRef.value)==null||o.appendChild(n.borderEl),this._slots.has(e)||(this._slots.set(e,[]),this._createPaperLabel(e)),this._slots.get(e).push(n),this.requestRender()}getViewportElement(e,t){var i;return((i=this._findSlot(e,t))==null?void 0:i.borderEl)??null}getSlotsForPaper(e){return(this._slots.get(e)??[]).map(t=>({drawingId:t.drawingId,viewportId:t.viewportId,x:t.x,y:t.y}))}enterEditMode(e,t){const i=this._findSlot(e,t);if(i){this._editingSlot&&this.exitEditMode(),this._editingSlot=i,i.borderEl.style.border="2px dashed rgba(255,140,0,0.9)",i.borderEl.style.boxShadow="0 0 0 1px rgba(255,140,0,0.3)",i.borderEl.style.cursor="crosshair";for(const s of Object.values(i.handles))s.style.display="none"}}exitEditMode(){if(!this._editingSlot)return;const e=this._editingSlot;if(this._editingSlot=null,this._selectedSlot===e){e.borderEl.style.border="2px solid rgba(0,136,255,1)",e.borderEl.style.boxShadow="0 0 0 1px rgba(0,136,255,0.3)",e.borderEl.style.cursor="move";for(const t of Object.values(e.handles))t.style.display="block"}else e.borderEl.style.border="1.5px solid rgba(0,136,255,0.7)",e.borderEl.style.boxShadow="",e.borderEl.style.cursor="pointer"}removeViewport(e,t,i){var s;const o=this._slots.get(e);if(!o)return;const n=o.findIndex(a=>a.drawingId===t&&a.viewportId===i);n!==-1&&(o[n]===this._selectedSlot&&this._selectSlot(null),o[n].borderEl.remove(),o.splice(n,1),o.length===0&&(this._slots.delete(e),(s=this._paperLabels.get(e))==null||s.remove(),this._paperLabels.delete(e)),this.requestRender())}requestRender(){this._renderPending||(this._renderPending=!0,requestAnimationFrame(()=>{this._renderPending=!1,this._doRender()}))}_createPaperLabel(e){var t;const i=document.createElement("bim-label");i.style.cssText="position:absolute;pointer-events:none;transition:none;--bim-label--c:var(--bim-ui_bg-contrast-100);--bim-label--fz:1.5rem;",(t=this._overlaysRef.value)==null||t.appendChild(i),this._paperLabels.set(e,i)}_createBorderEl(e){const t=document.createElement("div");t.style.cssText="position:absolute;box-sizing:border-box;border:1.5px solid rgba(0,136,255,0.7);pointer-events:auto;cursor:pointer;";const i=[{pos:"TL",left:"0%",top:"0%",cursor:"nwse-resize"},{pos:"T",left:"50%",top:"0%",cursor:"ns-resize"},{pos:"TR",left:"100%",top:"0%",cursor:"nesw-resize"},{pos:"L",left:"0%",top:"50%",cursor:"ew-resize"},{pos:"R",left:"100%",top:"50%",cursor:"ew-resize"},{pos:"BL",left:"0%",top:"100%",cursor:"nesw-resize"},{pos:"B",left:"50%",top:"100%",cursor:"ns-resize"},{pos:"BR",left:"100%",top:"100%",cursor:"nwse-resize"}],s={};for(const n of i){const a=document.createElement("div");a.style.cssText=`position:absolute;width:8px;height:8px;background:#fff;border:1.5px solid rgba(0,136,255,0.9);border-radius:2px;transform:translate(-50%,-50%);display:none;pointer-events:none;left:${n.left};top:${n.top};cursor:${n.cursor};`,a.addEventListener("mousedown",l=>this._onHandleMouseDown(e,n.pos,l)),t.appendChild(a),s[n.pos]=a}t.addEventListener("mousedown",n=>this._onBorderMouseDown(e,n));const o=document.createElement("bim-label");o.textContent=this._nameLabel(this._resolveVp(e)),o.style.cssText="position:absolute;top:-18px;left:0;pointer-events:none;--bim-label--c:rgba(0,136,255,0.85);",t.appendChild(o),e.borderEl=t,e.nameEl=o,e.handles=s}_selectSlot(e){if(this._selectedSlot){const t=this._selectedSlot;t.borderEl.style.border="1.5px solid rgba(0,136,255,0.7)",t.borderEl.style.boxShadow="",t.borderEl.style.cursor="pointer";for(const i of Object.values(t.handles))i.style.display="none",i.style.pointerEvents="none";this.dispatchEvent(new CustomEvent("viewportdeselect",{detail:{paper:t.paper,drawingId:t.drawingId,viewportId:t.viewportId},bubbles:!0,composed:!0}))}if(e&&this._selectPaper(null),this._selectedSlot=e,e){e.borderEl.style.border="2px solid rgba(0,136,255,1)",e.borderEl.style.boxShadow="0 0 0 1px rgba(0,136,255,0.3)",e.borderEl.style.cursor="move";for(const t of Object.values(e.handles))t.style.display="block",t.style.pointerEvents="auto";this._showVpToolbar(this._resolveVp(e)),this.dispatchEvent(new CustomEvent("viewportselect",{detail:{paper:e.paper,drawingId:e.drawingId,viewportId:e.viewportId},bubbles:!0,composed:!0}))}else this._hideToolbar()}_selectPaper(e){if(this._selectedPaper){const t=this._selectedPaper;t.style.outline="",t.style.outlineOffset="",this._selectedPaper=null,this.dispatchEvent(new CustomEvent("paperdeselect",{detail:{paper:t},bubbles:!0,composed:!0}))}e&&this._selectSlot(null),this._selectedPaper=e,e?(e.style.outline="5px solid rgba(255,140,0,0.9)",e.style.outlineOffset="6px",this._showPaperToolbar(e),this.dispatchEvent(new CustomEvent("paperselect",{detail:{paper:e},bubbles:!0,composed:!0}))):this._selectedSlot||this._hideToolbar()}_showVpToolbar(e){this._vpSection&&(this._vpSection.label=e?.name||"Viewport"),this._vpNameInput&&(this._vpNameInput.value=e?.name??""),this._vpScaleDropdown&&(this._vpScaleDropdown.value=[String(e?.drawingScale??100)]),this._vpToolbarRef.value&&(this._vpToolbarRef.value.style.display=""),this._paperToolbarRef.value&&(this._paperToolbarRef.value.style.display="none");const t=this._toolbarContainerRef.value;t&&(t.style.display="block")}_showPaperToolbar(e){this._paperSection&&(this._paperSection.label=e.label||`${e.size} · ${e.orientation}`),this._paperSheetInput&&(this._paperSheetInput.value=e.sheetNumber),this._paperLabelInput&&(this._paperLabelInput.value=e.label),this._paperSizeDropdown&&(this._paperSizeDropdown.value=[e.size]),this._paperOrientDropdown&&(this._paperOrientDropdown.value=[e.orientation]),this._vpToolbarRef.value&&(this._vpToolbarRef.value.style.display="none"),this._paperToolbarRef.value&&(this._paperToolbarRef.value.style.display="");const t=this._toolbarContainerRef.value;t&&(t.style.display="block")}_hideToolbar(){const e=this._toolbarContainerRef.value;e&&(e.style.display="none")}_onBorderMouseDown(e,t){t.button===0&&e!==this._editingSlot&&(t.stopPropagation(),this._startDrag(e,"move",t))}_onHandleMouseDown(e,t,i){i.button===0&&e!==this._editingSlot&&(i.stopPropagation(),this._startDrag(e,t,i))}_startDrag(e,t,i){const s=this._resolveVp(e);s&&(this._dragSlot=e,this._dragType=t,this._dragStartClient={x:i.clientX,y:i.clientY},this._dragTotalMovement=0,this._dragOrigin={x:e.x,y:e.y,left:s.left,right:s.right,top:s.top,bottom:s.bottom})}_findSlot(e,t){for(const i of this._slots.values()){const s=i.find(o=>o.drawingId===e&&o.viewportId===t);if(s)return s}return null}_resolveVp(e){if(!this.components)return null;const t=this.components.get(be).list.get(e.drawingId);return t?.viewports.get(e.viewportId)??null}_getPxPerMm(e){return e.drawingAreaEl.getBoundingClientRect().width/(e.widthMm-2*e.margin)}_applyMoveDrag(e,t){const i=this._dragSlot,s=this._dragOrigin,o=this._resolveVp(i);if(!o)return;const n=i.paper,a=this._getPxPerMm(n),l=(n.drawingSlotEl??n.drawingAreaEl).getBoundingClientRect(),c=l.width/a,d=l.height/a,u=(o.right-o.left)*(1e3/o.drawingScale),p=(o.top-o.bottom)*(1e3/o.drawingScale);i.x=Math.max(0,Math.min(c-u,s.x+e/a)),i.y=Math.max(0,Math.min(d-p,s.y+t/a))}_applyResizeDrag(e,t,i){const s=this._dragSlot,o=this._dragOrigin,n=this._resolveVp(s);if(!n)return;const a=s.paper,l=this._getPxPerMm(a)*(1e3/n.drawingScale),c=t/l,d=i/l;e.includes("L")&&(n.left=o.left+c),e.includes("R")&&(n.right=o.right+c),e.includes("T")&&(n.top=o.top-d),e.includes("B")&&(n.bottom=o.bottom-d);const u=n.drawingScale,p=this._getPxPerMm(a),m=(a.drawingSlotEl??a.drawingAreaEl).getBoundingClientRect(),h=m.width/p,f=m.height/p,v=(h-s.x)*u/1e3,y=(f-s.y)*u/1e3,g=.1;e.includes("L")&&(n.left=Math.max(n.left,n.right-v),n.left=Math.min(n.left,n.right-g)),e.includes("R")&&(n.right=Math.min(n.right,n.left+v),n.right=Math.max(n.right,n.left+g)),e.includes("T")&&(n.top=Math.min(n.top,n.bottom+y),n.top=Math.max(n.top,n.bottom+g)),e.includes("B")&&(n.bottom=Math.max(n.bottom,n.top-y),n.bottom=Math.min(n.bottom,n.top-g))}_nameLabel(e){if(!e)return"";const t=e.name??"",i=`1:${e.drawingScale}`;return t?`${t} - ${i}`:i}_sceneOf(e){let t=e.camera;for(;t;){if(t instanceof De)return t;t=t.parent}return null}_doRender(){const e=this._renderer;if(!e||this._slots.size===0)return;const t=this.getBoundingClientRect(),i=t.width,s=t.height;e.setScissorTest(!1),e.setClearColor(0,0),e.clear(),e.setScissorTest(!0);for(const[o,n]of this._slots){const a=this._paperLabels.get(o);if(a){const m=o.getBoundingClientRect(),h=(m.left-t.left-this._pan.x)/this._zoom,f=(m.top-t.top-this._pan.y)/this._zoom-42;a.style.left=`${h}px`,a.style.top=`${f}px`;const v=[o.sheetNumber,o.label].filter(Boolean);a.textContent=v.length?v.join(": "):""}const l=o.drawingAreaEl;if(!l)continue;const c=l.getBoundingClientRect(),d=c.width/(o.widthMm-2*o.margin),u=o.drawingSlotEl??l,p=u!==l?u.getBoundingClientRect():c;for(const m of n){const h=this._resolveVp(m),f=h?this._sceneOf(h):null,v=h?(h.right-h.left)*(1e3/h.drawingScale):0,y=h?(h.top-h.bottom)*(1e3/h.drawingScale):0,g=p.left-t.left+m.x*d,_=p.top-t.top+m.y*d,w=v*d,x=y*d,$=(g-this._pan.x)/this._zoom,z=(_-this._pan.y)/this._zoom,U=w/this._zoom,A=x/this._zoom;if(m.borderEl.style.left=`${$}px`,m.borderEl.style.top=`${z}px`,m.borderEl.style.width=`${U}px`,m.borderEl.style.height=`${A}px`,m.nameEl.textContent=this._nameLabel(h),!f||!h||g+w<=0||g>=i||_+x<=0||_>=s)continue;const j=Math.round(g),X=Math.round(s-_-x),L=Math.round(w),V=Math.round(x);e.setScissor(j,X,L,V),e.setViewport(j,X,L,V),e.setClearColor(16777215,1),e.clear(),e.render(f,h.camera)}}e.setScissorTest(!1)}_applyTransform(){const e=`translate(${this._pan.x}px,${this._pan.y}px) scale(${this._zoom})`;this._worldRef.value&&(this._worldRef.value.style.transform=e),this._overlaysRef.value&&(this._overlaysRef.value.style.transform=e)}_handleSlotClick(e,t){t.detail>=2?this.dispatchEvent(new CustomEvent("viewportactivate",{detail:{paper:e.paper,drawingId:e.drawingId,viewportId:e.viewportId},bubbles:!0,composed:!0})):this._selectSlot(this._selectedSlot===e?null:e)}connectedCallback(){super.connectedCallback(),this.addEventListener("wheel",this._onWheel,{passive:!1}),this.addEventListener("mousedown",this._onMouseDown),this.addEventListener("contextmenu",this._onContextMenu),window.addEventListener("mousemove",this._onMouseMove),window.addEventListener("mouseup",this._onMouseUp)}disconnectedCallback(){var e,t;super.disconnectedCallback(),this.removeEventListener("wheel",this._onWheel),this.removeEventListener("mousedown",this._onMouseDown),this.removeEventListener("contextmenu",this._onContextMenu),window.removeEventListener("mousemove",this._onMouseMove),window.removeEventListener("mouseup",this._onMouseUp),(e=this._resizeObserver)==null||e.disconnect(),(t=this._renderer)==null||t.dispose(),this._renderer=null}_buildVpToolbar(){const e=this._vpToolbarRef.value;if(!e)return;const t=document.createElement("bim-dropdown");t.label="Scale",t.vertical=!0,t.style.width="140px";for(const a of[25,50,100,200,500]){const l=document.createElement("bim-option");l.label=`1:${a}`,l.value=String(a),t.appendChild(l)}t.addEventListener("change",()=>{if(!this._selectedSlot)return;const a=this._resolveVp(this._selectedSlot);if(!a)return;const l=Number(t.value[0]);Number.isNaN(l)||(a.drawingScale=l,this.requestRender())});const i=document.createElement("bim-text-input");i.label="Name",i.vertical=!0,i.placeholder="Viewport name...",i.style.width="140px",i.addEventListener("input",()=>{if(!this._selectedSlot)return;const a=this._resolveVp(this._selectedSlot);a&&(a.name=i.value,this._vpSection&&(this._vpSection.label=i.value||"Viewport"),this.requestRender())});const s=document.createElement("bim-button");s.label="Export DXF",s.icon="mingcute:file-export-line",s.vertical=!0,s.addEventListener("click",()=>{if(!this._selectedSlot||!this.components)return;const a=this._resolveVp(this._selectedSlot);if(!a)return;const l=this.components.get(be).list.get(this._selectedSlot.drawingId);if(!l)return;const c=this.components.get(Se).exporter.export([{drawing:l,viewports:[{viewport:a}]}]);this.dispatchEvent(new CustomEvent("viewportdxfexport",{detail:{drawingId:this._selectedSlot.drawingId,viewportId:this._selectedSlot.viewportId,dxf:c},bubbles:!0,composed:!0}))});const o=document.createElement("bim-toolbar-section");o.appendChild(i),o.appendChild(t),e.appendChild(o);const n=document.createElement("bim-toolbar-section");n.label="Export",n.appendChild(s),e.appendChild(n),this._vpSection=o,this._vpNameInput=i,this._vpScaleDropdown=t}_buildPaperToolbar(){const e=this._paperToolbarRef.value;if(!e)return;const t=document.createElement("bim-text-input");t.label="Sheet",t.vertical=!0,t.placeholder="A-01...",t.style.width="100px",t.addEventListener("input",()=>{this._selectedPaper&&(this._selectedPaper.sheetNumber=t.value,this.requestRender())});const i=document.createElement("bim-text-input");i.label="Label",i.vertical=!0,i.placeholder="Sheet label...",i.style.width="160px",i.addEventListener("input",()=>{this._selectedPaper&&(this._selectedPaper.label=i.value,this._paperSection&&(this._paperSection.label=i.value||`${this._selectedPaper.size} · ${this._selectedPaper.orientation}`),this.requestRender())});const s=document.createElement("bim-dropdown");s.label="Size",s.vertical=!0;for(const c of["A0","A1","A2","A3","A4"]){const d=document.createElement("bim-option");d.label=c,d.value=c,s.appendChild(d)}s.addEventListener("change",()=>{this._selectedPaper&&(this._selectedPaper.size=s.value[0],this.requestRender())});const o=document.createElement("bim-dropdown");o.label="Orientation",o.vertical=!0;for(const[c,d]of[["Landscape","landscape"],["Portrait","portrait"]]){const u=document.createElement("bim-option");u.label=c,u.value=d,o.appendChild(u)}o.addEventListener("change",()=>{this._selectedPaper&&(this._selectedPaper.orientation=o.value[0],this.requestRender())});const n=document.createElement("bim-button");n.label="Export DXF",n.icon="mingcute:file-export-line",n.vertical=!0,n.addEventListener("click",()=>{var c;if(!this._selectedPaper||!this.components)return;const d=this.components.get(be),u=new Map;for(const{drawingId:m,viewportId:h,x:f,y:v}of this.getSlotsForPaper(this._selectedPaper)){if(!u.has(m)){const g=d.list.get(m);if(!g)continue;u.set(m,{drawing:g,viewports:[]})}const y=(c=d.list.get(m))==null?void 0:c.viewports.get(h);y&&u.get(m).viewports.push({viewport:y,x:f,y:v})}const p=this.components.get(Se).exporter.export([...u.values()],{widthMm:this._selectedPaper.widthMm,heightMm:this._selectedPaper.heightMm,margin:this._selectedPaper.margin});this.dispatchEvent(new CustomEvent("paperdxfexport",{detail:{paper:this._selectedPaper,dxf:p},bubbles:!0,composed:!0}))});const a=document.createElement("bim-toolbar-section");a.appendChild(t),a.appendChild(i),a.appendChild(s),a.appendChild(o),e.appendChild(a);const l=document.createElement("bim-toolbar-section");l.label="Export",l.appendChild(n),e.appendChild(l),this._paperSection=a,this._paperSheetInput=t,this._paperLabelInput=i,this._paperSizeDropdown=s,this._paperOrientDropdown=o}firstUpdated(){var e;(e=this._toolbarContainerRef.value)==null||e.addEventListener("mousedown",t=>t.stopPropagation()),this._buildVpToolbar(),this._buildPaperToolbar(),this._applyTransform(),this._renderer=new wt({canvas:this._canvasRef.value,antialias:!0,alpha:!0}),this._renderer.setPixelRatio(window.devicePixelRatio),this._renderer.autoClear=!1,this._renderer.setSize(this.clientWidth,this.clientHeight),this._resizeObserver=new ResizeObserver(()=>{var t;(t=this._renderer)==null||t.setSize(this.clientWidth,this.clientHeight),this.requestRender()}),this._resizeObserver.observe(this)}render(){return b`
      <div class="world" ${C(this._worldRef)}>
        <slot></slot>
      </div>
      <canvas ${C(this._canvasRef)}></canvas>
      <div class="overlays" ${C(this._overlaysRef)}></div>
      <div class="toolbar-container" ${C(this._toolbarContainerRef)}>
        <bim-toolbar style="border: 1px solid var(--bim-ui_bg-contrast-20); box-shadow: 0 2px 8px rgba(0,0,0,0.25);" ${C(this._vpToolbarRef)}></bim-toolbar>
        <bim-toolbar style="border: 1px solid var(--bim-ui_bg-contrast-20); box-shadow: 0 2px 8px rgba(0,0,0,0.25); display: none;" ${C(this._paperToolbarRef)}></bim-toolbar>
      </div>
    `}};Ne.styles=ce`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      background-color: var(--bim-ui_bg-base);
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 24px 24px;
      cursor: default;
      user-select: none;
    }

    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .world,
    .overlays {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: 0 0;
    }

    .overlays {
      pointer-events: none;
    }

    .toolbar-container {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: none;
      z-index: 10;
    }
  `;let jt=Ne;class Wi{static init(){I.defineCustomElement("bim-view-cube",B),I.defineCustomElement("bim-world-2d",ee),I.defineCustomElement("bim-world",Le),I.defineCustomElement("bim-sheet-board",jt)}}const Z=(r,e)=>{const t=e[r],i=t?.name??r,s=i.trim().split(/\s+/);let o,n;return s[0]&&s[0][0]&&(o=s[0][0].toUpperCase(),s[0][1]&&(n=s[0][1].toUpperCase())),s[1]&&s[1][0]&&(n=s[1][0].toUpperCase()),b`
    <div style="display: flex; gap: 0.25rem; overflow: hidden;">
      ${!(t!=null&&t.picture)&&(o||n)?b`
        <bim-label
          style=${J({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${o}${n}</bim-label>
        `:null}
      <bim-label .img=${t?.picture}>${i}</bim-label>
    </div>
  `},R={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#414141","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},Q={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"var(--bim-ui_bg-contrast-100)"},Lt={dueDate:r=>{if(typeof r=="string"&&r.trim()!=="")return new Date(r)},status:r=>{if(Array.isArray(r)&&r.length!==0)return r[0]},type:r=>{if(Array.isArray(r)&&r.length!==0)return r[0]},priority:r=>{if(Array.isArray(r)&&r.length!==0)return r[0]},stage:r=>{if(Array.isArray(r)&&r.length!==0)return r[0]},assignedTo:r=>{if(Array.isArray(r)&&r.length!==0)return r[0]},labels:r=>{if(Array.isArray(r))return new Set(r)}},Fe=r=>{const{components:e,topic:t,value:i,onCancel:s,onSubmit:o,styles:n}=r,a=o??(()=>{}),l=e.get(se),c=i?.title??t?.title??Y.default.title,d=i?.status??t?.status??Y.default.status,u=i?.type??t?.type??Y.default.type,p=i?.priority??t?.priority??Y.default.priority,m=i?.assignedTo??t?.assignedTo??Y.default.assignedTo,h=i?.labels??t?.labels??Y.default.labels,f=i?.stage??t?.stage??Y.default.stage,v=i?.description??t?.description??Y.default.description,y=t!=null&&t.dueDate?t.dueDate.toISOString().split("T")[0]:null,g=new Set([...l.config.statuses]);d&&g.add(d);const _=new Set([...l.config.types]);u&&_.add(u);const w=new Set([...l.config.priorities]);p&&w.add(p);const x=new Set([...l.config.users]);m&&x.add(m);const $=new Set([...l.config.labels]);if(h)for(const S of h)$.add(S);const z=new Set([...l.config.stages]);f&&z.add(f);const U=F(),A=async()=>{const{value:S}=U;if(!S)return;const D=Mt(S,Lt);if(t)t.set(D),await a(t);else{const G=l.create(D);await a(G)}},j=F(),X=S=>{const{value:D}=j;if(!D)return;const G=S.target;D.disabled=G.value.trim()===""},L=`btn-${I.newRandomId()}`,V=`btn-${I.newRandomId()}`;return b`
    <div ${C(U)} style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; gap: 0.375rem">
        <bim-text-input @input=${X} vertical label="Title" name="title" .value=${c}></bim-text-input>
        ${t?b`
            <bim-dropdown vertical label="Status" name="status" required>
              ${[...g].map(S=>b`<bim-option label=${S} .checked=${d===S}></bim-option>`)}
            </bim-dropdown>`:b``}
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-dropdown vertical label="Type" name="type" required>
          ${[..._].map(S=>b`<bim-option label=${S} .checked=${u===S}></bim-option>`)}
        </bim-dropdown>
        <bim-dropdown vertical label="Priority" name="priority">
          ${[...w].map(S=>b`<bim-option label=${S} .checked=${p===S}></bim-option>`)}
        </bim-dropdown>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-dropdown vertical label="Labels" name="labels" multiple>
          ${[...$].map(S=>b`<bim-option label=${S} .checked=${h?[...h].includes(S):!1}></bim-option>`)}
        </bim-dropdown>
        <bim-dropdown vertical label="Assignee" name="assignedTo">
          ${[...x].map(S=>{const D=n!=null&&n.users?n.users[S]:null,G=D?D.name:S,ue=D?.picture;return b`<bim-option label=${G} value=${S} .img=${ue} .checked=${m===S}></bim-option>`})}
        </bim-dropdown>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-text-input vertical type="date" label="Due Date" name="dueDate" .value=${y}></bim-text-input> 
        <bim-dropdown vertical label="Stage" name="stage">
          ${[...z].map(S=>b`<bim-option label=${S} .checked=${f===S}></bim-option>`)}
        </bim-dropdown>
      </div>
      <bim-text-input vertical label="Description" name="description" type="area" .value=${v??null}></bim-text-input>
      <div style="justify-content: right; display: flex; gap: 0.375rem">
        <style>
          #${V} {
            background-color: transparent;
          }

          #${V}:hover {
            --bim-label--c: #FF5252;
          }

          #${L}:hover {
            background-color: #329936;
          }
        </style>
        <bim-button id=${V} style="flex: 0" @click=${s} label="Cancel"></bim-button>
        <bim-button id=${L} style="flex: 0" @click=${A} ${C(j)} label=${t?"Update Topic":"Add Topic"} icon=${t?"tabler:refresh":"mi:add"}></bim-button>
      </div>
    </div>
  `},Nt=r=>{const{components:e,modelUserData:t,worldName:i}=r;return b`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{if(!(e&&i))return;const o=[...e.get(_e).list.values()].find(a=>"name"in a&&a.name===i);if(!o)return;const n=document.createElement("input");n.type="file",n.accept=".ifc",n.onchange=async()=>{if(n.files===null||n.files.length===0)return;const a=n.files[0],l=await a.arrayBuffer(),c=new Uint8Array(l),d=a.name.replace(".ifc",""),u=e.get(M),p=e.get(mt);p.settings.autoSetWasm=!1,p.settings.wasm={path:"https://unpkg.com/web-ifc@0.0.77/",absolute:!1};const m=await p.load(c,!0,d,{userData:t});o.scene.three.add(m.object),m.useCamera(o.camera.three),u.core.update(!0)},n.click()}}
    ></bim-button>
  `},Ft=r=>E.create(Nt,r),Bt=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:Ft},Symbol.toStringTag,{value:"Module"})),Ut=r=>{const{components:e,world:t}=r;return b`
    <bim-button @click=${()=>{const s=document.createElement("input");s.type="file",s.accept=".frag",s.onchange=async()=>{if(s.files===null||s.files.length===0)return;const o=s.files[0],n=await o.arrayBuffer(),a=new Uint8Array(n),l=o.name.replace(".frag",""),c=e.get(M),d=await c.core.load(a,{modelId:l});t&&(t.scene.three.add(d.object),d.useCamera(t.camera.three),c.core.update(!0))},s.click()}}></bim-button>
  `},Xt=r=>{const e=E.create(Ut,r),[t]=e;return t.label="Load FRAG",t.icon="mage:box-3d-fill",e},Vt=Object.freeze(Object.defineProperty({__proto__:null,loadFrag:Xt},Symbol.toStringTag,{value:"Module"}));({...Bt,...Vt});const ae=r=>r===null?[]:Array.isArray(r)?r:[r],Be=(r,e)=>{if(r.localId!==null&&r.localId!==void 0&&e.push(r.localId),r.children)for(const t of r.children)Be(t,e)},ie=(r,e,t,i=!1,s=new Set)=>{const{localId:o,category:n,children:a}=e;if(n&&a){if(s.has(n)){const c=[];for(const d of a){const u=ie(r,d,t,i,s);for(const p of ae(u))p.data.category||(p.data={...p.data,category:n}),c.push(p)}return c.length>0?c:null}if(i&&a.length===1){const c=ie(r,a[0],t,i,s);if(c&&!Array.isArray(c))return c.data={...c.data,category:n},c;if(Array.isArray(c)){for(const d of c)d.data.category||(d.data={...d.data,category:n});return c}return c}const l={data:{Name:n,category:n,modelId:r.modelId,children:JSON.stringify(a.map(c=>c.localId))}};for(const c of a){const d=ie(r,c,t,i,s);for(const u of ae(d))u.data.category||(u.data={...u.data,category:n}),l.children||(l.children=[]),l.children.push(u)}return l}if(o!=null){const l=t.get(o);if(l===void 0)return null;const c={data:{Name:l,modelId:r.modelId,localId:o}};for(const d of a??[]){const u=ie(r,d,t,i,s);for(const p of ae(u))c.children||(c.children=[]),c.children.push(p)}return c}return null},Yt=async(r,e=!1,t=new Set)=>{const i=[];for(const s of r){const o=await s.getSpatialStructure(),n=[];Be(o,n);const a=new Map;if(n.length>0){const u=await s.getItemsData(n,{attributesDefault:!1,attributes:["Name"]});for(let p=0;p<n.length;p++){const m=u[p];if(!m)continue;const h=m.Name,f=h&&"value"in h?h.value:void 0;a.set(n[p],f==null?"":String(f))}}const l=ie(s,o,a,e,t),c=ae(l);if(c.length===0)continue;const d={data:{Name:s.modelId,modelId:s.modelId},children:c};i.push(d)}return i},Ue=r=>{const{components:e,models:t,collapseSingleChildCategories:i=!1,collapseCategories:s=[]}=r,o=new Set(s),n=r.selectHighlighterName??"select";return b`
    <bim-table @rowcreated=${d=>{d.stopImmediatePropagation();const{row:u}=d.detail,p=e.get(oe),m=e.get(M);u.onclick=async()=>{if(!n)return;const{data:{modelId:h,localId:f,children:v}}=u;if(!(h&&(f!==void 0||v)))return;const y=m.list.get(h);if(y){if(f!==void 0){const g=await y.getItemsChildren([f]),_=g.length!==0?new Set(g):new Set([f]),w={[h]:_};p.highlightByID(n,w,!0)}else if(v){const g=JSON.parse(v),_=await y.getItemsChildren(g),w=_.length!==0?_:g,x={[h]:w};p.highlightByID(n,x,!0)}}}}} @cellcreated=${({detail:d})=>{const{cell:u}=d;u.column==="Name"&&!u.rowData.Name&&(u.style.gridColumn="1 / -1")}} ${C(async d=>{if(!d)return;const u=d;u.loadFunction=async()=>new Promise(p=>{setTimeout(()=>{p(Yt(t,i,o))})}),u.loadData(!0)})} headers-hidden>
      <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No models available to display the spatial structure!
      </bim-label>
    </bim-table>
  `},Ht=(r,e=!0)=>{const t=E.create(Ue,r),[i,s]=t;if(i.hiddenColumns=["modelId","localId","children","category"],i.columns=["Name"],i.headersHidden=!0,e){const{components:o}=r,n=o.get(M);n.list.onItemSet.add(()=>s({models:n.list.values()})),n.list.onItemDeleted.add(()=>s())}return t},qt=Object.freeze(Object.defineProperty({__proto__:null,spatialTree:Ht,spatialTreeTemplate:Ue},Symbol.toStringTag,{value:"Module"}));let K={};const Ce={_category:"Category",_localId:"LocalId",_guid:"Guid"},Gt=(r,e,t,i,s,o)=>{const n={data:{type:"attribute",modelId:i,localId:s,Name:e in Ce?Ce[e]:e,Value:t,dataType:o}};r.children||(r.children=[]),r.children.push(n)},Xe=(r,e,t)=>{var i;r in K||(K[r]=new Map);const s=K[r],o=e._localId.value,n=(i=e[t.defaultItemNameKey])==null?void 0:i.value,a=e._category.value,l=n?.toString().length>0?n.toString():a??String(o);if(s.has(o))return{data:{modelId:r,localId:o,type:"item",Name:l}};const c={data:{modelId:r,localId:o,type:"item",Name:l}};s.set(o,c);for(const d in e){const u=e[d];if(!Array.isArray(u))Gt(c,d,u.value,r,o,u.type);else{const p={data:{Name:d,type:"relation"}};c.children||(c.children=[]),c.children.push(p);for(const m of u){const h=Xe(r,m,t);p.children||(p.children=[]),p.children.push(h)}}}return c},Wt=async(r,e,t)=>{const i=r.get(M);Object.keys(e).length===0&&(K={});const s=[];for(const o in e){const n=i.list.get(o);if(!n)continue;o in K||(K[o]=new Map);const a=K[o],l=e[o];for(const c of l){let d=a.get(c);if(d){s.push(d);continue}const[u]=await n.getItemsData([c],t.itemsDataConfig);d=Xe(o,u,t),s.push(d)}}return s},Ve=r=>{const e={defaultItemNameKey:"Name",itemsDataConfig:{attributesDefault:!0,relationsDefault:{attributes:!1,relations:!1},relations:{IsDefinedBy:{attributes:!0,relations:!0},DefinesOccurrence:{attributes:!1,relations:!1},ContainedInStructure:{attributes:!0,relations:!0},ContainsElements:{attributes:!1,relations:!1},Decomposes:{attributes:!1,relations:!1},ObjectTypeOf:{attributes:!1,relations:!1}}},...r},{components:t,modelIdMap:i,emptySelectionWarning:s}=r,o=Object.keys(i).reduce((l,c)=>(c.includes("DELTA")||(l[c]=i[c]),l),{});return b`
    <bim-table @cellcreated=${({detail:l})=>{const{cell:c}=l,{Name:d,Value:u}=c.rowData;d&&u===void 0&&setTimeout(()=>{c.style.gridColumn="1 / -1"})}} ${C(async l=>{if(!l)return;const c=l;c.loadFunction=async()=>Wt(t,o,e),await c.loadData(!0)&&c.dispatchEvent(new Event("datacomputed"))})}>
      ${s?b`
            <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
              Select some elements to display its properties
            </bim-label>
            `:null}
      <bim-label slot="error-loading" style="--bim-icon--c: #e72e2e" icon="bxs:error-alt">
        Something went wrong with the properties
      </bim-label>
    </bim-table>
  `},Kt=new Map,Jt={METRE:"m",SQUARE_METRE:"m²",CUBIC_METRE:"m³"},Zt=async(r,e)=>{const t=r.get(M).list.get(e);if(!t)throw new Error(`ItemsDataUI: model ${e} not found.`);let i=Kt.get(t.modelId);if(!i){const[s]=Object.values(await t.getItemsOfCategories([/UNITASSIGNMENT/])).flat(),[o]=await t.getItemsData([s],{relations:{Units:{relations:!1,attributes:!0}}});if(!Array.isArray(o.Units))return[];i=o.Units}return i},Qt=(r,e)=>{const{components:t}=r;e.columns=[{name:"Name",width:"12rem"}],e.visibleColumns=["Name","Value"],e.headersHidden=!0,e.dataTransform={Value:(i,s)=>{const{dataType:o,modelId:n}=s;return o?b`<bim-label ${C(async l=>{if(!(l&&n))return;const c=await Zt(t,n),d=o.replace("IFC","").replace("MEASURE","UNIT"),u=c.find(m=>m.UnitType&&"value"in m.UnitType?m.UnitType.value===d:!1);if(!u||!(u.Name&&"value"in u.Name))return i;const p=`${i.toFixed(2)} ${Jt[u.Name.value]??u.Name.value}`;l.textContent=p})}></bim-label>`:i}}},ei=r=>{const e=E.create(Ve,r),[t]=e;return Qt(r,t),e},ti=Object.freeze(Object.defineProperty({__proto__:null,itemsData:ei,itemsDataTemplate:Ve},Symbol.toStringTag,{value:"Module"})),Ye=r=>{const{components:e}=r,t=r.missingDataMessage??"No models has been loaded yet",i=e.get(M),s=({detail:n})=>{const{cell:a}=n;a.style.padding="0.25rem 0"};return b`
    <bim-table ${C(async n=>{if(!n)return;const a=n,l=[];if(i.initialized)for(const[,c]of i.list){if(!(c&&!c.isDeltaModel))continue;const d=await c.getMetadata(),u={data:{Name:c.modelId,modelId:c.modelId,metadata:JSON.stringify(d)}};l.push(u)}a.data=l})} @cellcreated=${s}>
      <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        ${t}
      </bim-label>
    </bim-table>
  `},ii=(r,e)=>{const{components:t,actions:i,metaDataTags:s}=r,o=t.get(M),n=i?.dispose??!0,a=i?.download??!0,l=i?.visibility??!0,c=s??[];e.hiddenColumns=["modelId","metadata"],e.headersHidden=!0,e.noIndentation=!0,e.dataTransform={Name:(d,u)=>{if(!o.initialized)return d;const{modelId:p,metadata:m}=u;if(!p)return d;const h=o.list.get(p);if(!h)return p;const f=[];if(m){const _=JSON.parse(m);for(const w of c){const x=_[w];if(!(typeof x=="string"||typeof x=="boolean"||typeof x=="number"))continue;const $=b`
            <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${x}</bim-label>
            `;f.push($)}}let v;n&&(v=b`<bim-button @click=${()=>o.core.disposeModel(h.modelId)} icon="mdi:delete"></bim-button>`);let y;l&&(y=b`<bim-button @click=${async({target:w})=>{w.loading=!0,await h.setVisible(void 0,w.hasAttribute("data-model-hidden")),await o.core.update(!0),w.toggleAttribute("data-model-hidden"),w.icon=w.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye",w.loading=!1}} icon="mdi:eye"></bim-button>`);let g;return a&&(g=b`<bim-button @click=${async()=>{const w=await h.getBuffer(!1),x=new File([w],`${h.modelId}.frag`),$=document.createElement("a");$.href=URL.createObjectURL(x),$.download=x.name,$.click(),URL.revokeObjectURL($.href)}} icon="flowbite:download-solid"></bim-button>`),b`
       <div style="display: flex; flex: 1; gap: var(--bim-ui_size-4xs); justify-content: space-between; overflow: auto;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bim-ui_size-4xs); flex-grow: 1; overflow: auto;">
          <div style="min-height: 1.75rem; overflow: auto; display: flex;">
            <bim-label style="white-space: normal;">${d}</bim-label>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--bim-ui_size-4xs); overflow: auto;">
            ${f}
          </div>
        </div>
        <div style="display: flex; align-self: flex-start; flex-shrink: 0;">
          ${g}
          ${y}
          ${v}
        </div>
       </div>
      `}}},si=(r,e=!0)=>{const t=E.create(Ye,r),[i,s]=t;if(ii(r,i),e){const{components:o}=r,n=o.get(M),a=()=>setTimeout(()=>s());n.list.onItemSet.add(a),n.list.onItemDeleted.add(a)}return t},oi=Object.freeze(Object.defineProperty({__proto__:null,modelsList:si,modelsListTemplate:Ye},Symbol.toStringTag,{value:"Module"})),He=r=>{var e;const{components:t}=r,i=r.missingDataMessage??"No viewpoints to display",s=t.get(le),o=((e=r.topic)==null?void 0:e.viewpoints)??s.list.keys(),n=[];for(const c of o){const d=s.list.get(c);d&&n.push(d)}const a=c=>{if(!c)return;const d=c;d.data=n.map((u,p)=>({data:{Guid:u.guid,Title:u.title??`Viewpoint ${r.topic?p+1:""}`,Actions:""}}))},l=({detail:c})=>{const{cell:d}=c;d.style.padding="0.25rem"};return b`
    <bim-table ${C(a)} @cellcreated=${l}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${i}</bim-label>
    </bim-table>
  `},ni=(r,e)=>{const{components:t,topic:i}=r;e.noIndentation=!0,e.headersHidden=!0,e.hiddenColumns=["Guid"],e.columns=["Title",{name:"Actions",width:"auto"}];const s={selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!!i,...r.actions},o=t.get(le);e.dataTransform={Actions:(n,a)=>{const{Guid:l}=a;if(!(l&&typeof l=="string"))return n;const c=o.list.get(l);if(!c)return n;const d=async({target:g})=>{g.loading=!0,await c.go(),g.loading=!1};let u;s.selectComponents&&(u=b`
          <bim-button label="Select Components" @click=${async({target:_})=>{const w=t.get(M),x=t.get(oe);if(!x.isSetup)return;_.loading=!0;const $=await w.guidsToModelIdMap([...c.selectionComponents]);await x.highlightByID("select",$),_.loading=!1}}></bim-button>
        `);let p;s.colorizeComponent&&(p=b`
          <bim-button label="Colorize Components" @click=${async({target:_})=>{_.loading=!0,await c.setColorizationState(!0),_.loading=!1}}></bim-button>
        `);let m;s.resetColors&&(m=b`
          <bim-button label="Reset Colors" @click=${async({target:_})=>{_.loading=!0,await c.setColorizationState(!1),_.loading=!1}}></bim-button>
        `);let h;s.updateCamera&&(h=b`
          <bim-button label="Update Camera" @click=${()=>c.updateCamera()}></bim-button>
        `);let f;s.unlink&&(f=b`
          <bim-button label="Unlink" @click=${()=>i?.viewpoints.delete(c.guid)}></bim-button>
        `);let v;s.delete&&(v=b`
          <bim-button label="Delete" @click=${()=>{o.list.delete(c.guid),kt.removeMenus()}}></bim-button>
        `);let y;return Object.values(s).includes(!0)&&(y=b`
          <bim-button icon="prime:ellipsis-v">
            <bim-context-menu>
              ${u}
              ${p}
              ${m}
              ${h}
              ${f}
              ${v}
            </bim-context-menu>
          </bim-button>
        `),b`
        <bim-button icon="ph:eye-fill" @click=${d}></bim-button>
        ${y}
      `}}},qe=(r,e=!0)=>{const t=E.create(He,r),[i,s]=t;if(ni(r,i),e){const{components:o,topic:n}=r,a=o.get(le);a.list.onItemUpdated.add(()=>s()),a.list.onItemDeleted.add(()=>s()),a.list.onCleared.add(()=>s()),n?(n.viewpoints.onItemAdded.add(()=>s()),n.viewpoints.onItemDeleted.add(()=>s()),n.viewpoints.onCleared.add(()=>s())):a.list.onItemSet.add(()=>s())}return t},ri=Object.freeze(Object.defineProperty({__proto__:null,viewpointsList:qe,viewpointsListTemplate:He},Symbol.toStringTag,{value:"Module"})),Ge=r=>{const{components:e}=r,t=r.missingDataMessage??"No topics to display",i=e.get(se),s=r.topics??i.list.values();return b`
    <bim-table no-indentation ${C(n=>{if(!n)return;const a=n;a.data=[...s].map(l=>{var c;return{data:{Guid:l.guid,Title:l.title,Status:l.status,Description:l.description??"",Author:l.creationAuthor,Assignee:l.assignedTo??"",Date:l.creationDate.toDateString(),DueDate:((c=l.dueDate)==null?void 0:c.toDateString())??"",Type:l.type,Priority:l.priority??"",Actions:""}}})})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${t}</bim-label>
    </bim-table>
  `},ai=(r,e)=>{const{dataStyles:t}=r;e.hiddenColumns.length===0&&(e.hiddenColumns=["Guid","Actions"]),e.columns=["Title"],e.dataTransform={Priority:i=>{if(typeof i!="string")return i;const s=(t?.priorities??R.priorities)[i];return b`
            <bim-label
              .icon=${s?.icon}
              style=${J({...Q,...s?.style})}
            >${i}
            </bim-label>
          `},Status:i=>{if(typeof i!="string")return i;const s=(t?.statuses??R.statuses)[i];return b`
            <bim-label
              .icon=${s?.icon}
              style=${J({...Q,...s?.style})}
            >${i}
            </bim-label>
          `},Type:i=>{if(typeof i!="string")return i;const s=(t?.types??R.types)[i];return b`
            <bim-label
              .icon=${s?.icon}
              style=${J({...Q,...s?.style})}
            >${i}
            </bim-label>
          `},Author:i=>typeof i!="string"?i:Z(i,t?.users??R.users),Assignee:i=>typeof i!="string"?i:Z(i,t?.users??R.users)}},We=(r,e=!0)=>{const t=E.create(Ge,r),[i,s]=t;if(ai(r,i),e){const{components:o,topics:n}=r,a=o.get(se),l=()=>s();if(a.list.onItemUpdated.add(l),a.list.onItemDeleted.add(l),n)for(const c of n)c.relatedTopics.onItemAdded.add(l),c.relatedTopics.onItemDeleted.add(l),c.relatedTopics.onCleared.add(l);else a.list.onItemSet.add(l)}return t},li=Object.freeze(Object.defineProperty({__proto__:null,topicsList:We,topicsListTemplate:Ge},Symbol.toStringTag,{value:"Module"})),Ke=r=>{const{topic:e,styles:t,viewpoint:i}=r,s=r.missingDataMessage??"The topic has no comments";return b`
    <bim-table no-indentation ${C(n=>{if(!n)return;const a=n;let l=e.comments.values();i&&(l=[...e.comments.values()].filter(c=>c.viewpoint===i.guid)),a.data=[...l].map(c=>({data:{guid:c.guid,Comment:c.comment,author:(()=>{const d=t;if(!d)return c.author;const u=d[c.author];return u?.name??c.author})()}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${s}</bim-label>
    </bim-table>
  `},ci=(r,e)=>{const{topic:t,styles:i}=r,s={delete:!0,...r.actions};e.headersHidden=!0,e.hiddenColumns=["guid","author"],e.dataTransform={Comment:(o,n)=>{const{guid:a}=n;if(typeof a!="string")return o;const l=t.comments.get(a);if(!l)return o;const c=()=>{t.comments.delete(a)};let d;if(s.delete){const u=`btn-${I.newRandomId()}`;d=b`
          <div>
            <style>
              #${u} {
                background-color: transparent;
                --bim-label--c: var(--bim-ui_bg-contrast-60)
              }
  
              #${u}:hover {
                --bim-label--c: #FF5252;
              }
            </style>
            <bim-button @click=${c} id=${u} icon="majesticons:delete-bin"></bim-button>
          </div>
        `}return b`
        <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1">
          <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; gap: 0.375rem;">
              ${Z(l.author,i??R.users)}
              <bim-label style="color: var(--bim-ui_bg-contrast-40)">@ ${l.date.toDateString()}</bim-label>
            </div>
            ${d}
          </div>
          <bim-label style="margin-left: 1.7rem; white-space: normal">${l.comment}</bim-label>
        </div>
      `}}},Je=(r,e=!0)=>{const t=E.create(Ke,r),[i,s]=t;if(ci(r,i),e){const{topic:o}=r,n=()=>s();o.comments.onItemSet.add(n),o.comments.onItemUpdated.add(n),o.comments.onItemDeleted.add(n),o.comments.onCleared.add(n)}return t},di=Object.freeze(Object.defineProperty({__proto__:null,commentsList:Je,commentsListTemplate:Ke},Symbol.toStringTag,{value:"Module"}));({...qt,...ti,...oi,...ri,...li,...di});const Ze=(r,e)=>{const{showInput:t,topic:i,styles:s}=r,o={add:!0,delete:!0,...r.actions},n=`input-${I.newRandomId()}`,a=`btn-${I.newRandomId()}`,l=`btn-${I.newRandomId()}`,c=()=>document.getElementById(a),d=()=>document.getElementById(n),u=()=>{const w=d();return w?w.value.trim().length>0:!1},p=()=>{e({showInput:!0})},m=()=>{const w=d(),x=u();w&&x&&(i.createComment(w.value),e({showInput:!1}))},h=()=>{e({showInput:!1})},f=()=>{const w=c();if(w){if(!d()){w.disabled=!0;return}w.disabled=!u()}},v=b`
    ${o.add?b`<bim-button @click=${p} label="Add Comment" icon="majesticons:comment-line"></bim-button>`:null}
  `,y=w=>{w.code==="Enter"&&w.ctrlKey&&m()},g=b`
    <bim-text-input id=${n} @input=${f} @keypress=${y} type="area"></bim-text-input>

    <div style="justify-content: right; display: flex; gap: 0.375rem">
      <style>
        #${a} {
          background-color: #329936;
        }  

        #${l} {
          background-color: transparent;
        }

        #${l}:hover {
          --bim-label--c: #FF5252;
        }
      </style>

      <bim-button style="flex: 0" id=${l} @click=${h} label="Cancel"></bim-button>
      <bim-button style="flex: 0" id=${a} @click=${m} label="Accept" icon="material-symbols:check" disabled></bim-button>
    </div>
  `,[_]=Je({topic:i,actions:o,styles:s??R.users});return b`
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      ${_}
      ${t?g:v}
    </div>
  `},ui=r=>E.create(Ze,r),pi=Object.freeze(Object.defineProperty({__proto__:null,topicComments:ui,topicCommentsSectionTemplate:Ze},Symbol.toStringTag,{value:"Module"})),Qe=(r,e)=>{const{components:t,editing:i,topic:s,styles:o}=r,n={update:!0,...r.actions},a=o?.priorities??R.priorities,l=o?.statuses??R.statuses,c=o?.types??R.types;let d;s!=null&&s.priority&&(d=a[s.priority]);let u;s!=null&&s.type&&(u=c[s.type]);let p;s!=null&&s.type&&(p=l[s.status]);let m,h;return i?m=Fe({components:t,topic:s,styles:o,onSubmit:()=>{e({editing:!1})},onCancel:()=>{e({editing:!1})}}):h=b`
      <div>
        <bim-label>Title</bim-label>
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${s.title}</bim-label>
      </div>

      ${s.description?b`
            <div>
              <bim-label>Description</bim-label>
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100); white-space: normal">${s.description}</bim-label>
            </div>
          `:null}

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Status</bim-label>
        <bim-label .icon=${p?.icon} style=${J({...Q,...p?.style})}
        >${s.status}
        </bim-label>
      </div>

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Type</bim-label>
        <bim-label .icon=${u?.icon} style=${J({...Q,...u?.style})}
        >${s.type}
        </bim-label>
      </div>

      ${s.priority?b`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Priority</bim-label>
              <bim-label .icon=${d?.icon} style=${J({...Q,...d?.style})}
              >${s.priority}
              </bim-label>
            </div>`:null}

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Author</bim-label>
        ${Z(s.creationAuthor,o?.users??R.users)}
      </div>

      ${s.assignedTo?b`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Assignee</bim-label>
            ${Z(s.assignedTo,o?.users??R.users)}
          </div>`:null}

      ${s.dueDate?b`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Due Date</bim-label>
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${s.dueDate.toDateString()}</bim-label>
          </div>`:null}

      ${s.modifiedAuthor?b`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Modified By</bim-label>
            ${Z(s.modifiedAuthor,o?.users??R.users)}
          </div>`:null}

      ${s.modifiedDate?b`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Modified Date</bim-label>
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${s.modifiedDate.toDateString()}</bim-label>
            </div>`:null}

      ${s.labels.size!==0?b`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Labels</bim-label>
            <bim-label style="white-space: normal; --bim-label--c: var(--bim-ui_bg-contrast-100)">${[...s.labels].join(", ")}</bim-label>
          </div>`:null}

      ${n.update?b`
              <bim-button @click=${()=>e({editing:!0})} label="Update Information" icon="tabler:refresh"></bim-button> 
            `:null}
    `,b`
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${i?m:h}
    </div>
  `},hi=r=>E.create(Qe,r),mi=Object.freeze(Object.defineProperty({__proto__:null,topicInformation:hi,topicInformationSectionTemplate:Qe},Symbol.toStringTag,{value:"Module"})),et=(r,e)=>{const{components:t,topic:i,linking:s}=r,o=t.get(se),n={link:!0,...r.actions},[a,l]=We({components:t,topics:[...i.relatedTopics].map(p=>o.list.get(p)).map(p=>p)});a.headersHidden=!0,a.hiddenColumns=["Guid","Status","Description","Author","Assignee","Date","DueDate","Type","Priority"];const c=()=>b`
      <bim-text-input placeholder="Search..." debounce="100" @input=${m=>{const h=m.target;h instanceof Re&&(a.queryString=h.value)}}></bim-text-input> 
    `;let d,u;if(s){a.selectableRows=!0,l({topics:void 0});const p=a.data.filter(y=>{const{Guid:g}=y.data;return typeof g!="string"?!1:i.relatedTopics.has(g)}).map(y=>y.data);a.selection.add(...p);const m=()=>{const y=[...a.selection].map(({Guid:g})=>typeof g!="string"?null:o.list.has(g)?g:null).map(g=>g);i.relatedTopics.clear(),i.relatedTopics.add(...y),e({linking:!1})},h=()=>{e({linking:!1})},f=`btn-${I.newRandomId()}`,v=`btn-${I.newRandomId()}`;d=b`
      <div style="display: flex; gap: 0.25rem">
        <style>
          #${f}:hover {
            background-color: #329936;
          }  

          #${v} {
            background-color: transparent;
          }

          #${v}:hover {
            --bim-label--c: #FF5252;
          }
        </style>
        ${c()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          <bim-button id=${v} @click=${h} style="flex: 0" label="Cancel" icon="material-symbols:close"></bim-button>
          <bim-button id=${f} @click=${m} style="flex: 0" label="Accept" icon="material-symbols:check"></bim-button>
        </div>
      </div> 
    `}else{a.selectableRows=!1;const p=()=>{e({linking:!0})};u=b`
      <div style="display: flex; justify-content: right; gap: 0.25rem">
        ${c()}
        ${n.link?b`<bim-button style="flex: 0" @click=${p} icon="tabler:link"></bim-button>`:null}
      </div> 
    `}return b`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${u}
      ${d}
      ${a}
    </div> 
  `},bi=r=>E.create(et,r),gi=Object.freeze(Object.defineProperty({__proto__:null,topicRelations:bi,topicRelationsSectionTemplate:et},Symbol.toStringTag,{value:"Module"})),tt=(r,e)=>{const{components:t,topic:i,world:s,linking:o}=r,n={add:!0,link:!0,selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!0,...r.actions},a=t.get(le),[l,c]=qe({components:t,topic:i,actions:n}),d=()=>b`
      <bim-text-input placeholder="Search..." debounce="100" @input=${h=>{const f=h.target;f instanceof Re&&(l.queryString=f.value)}}></bim-text-input> 
    `;let u,p;if(o){l.selectableRows=!0,c({topic:void 0,actions:{delete:!1,updateCamera:!1,colorizeComponent:!1,resetColors:!1}});const m=l.data.filter(g=>{const{Guid:_}=g.data;return typeof _!="string"?!1:i.viewpoints.has(_)}).map(g=>g.data);l.selection.add(...m);const h=()=>{const g=[...l.selection].map(({Guid:_})=>typeof _!="string"?null:a.list.has(_)?_:null).map(_=>_);i.viewpoints.clear(),i.viewpoints.add(...g),e({linking:!1})},f=()=>{e({linking:!1})},v=`btn-${I.newRandomId()}`,y=`btn-${I.newRandomId()}`;u=b`
      <div style="display: flex; gap: 0.25rem">
        <style>
          #${v}:hover {
            background-color: #329936;
          }  

          #${y} {
            background-color: transparent;
          }

          #${y}:hover {
            --bim-label--c: #FF5252;
          }
        </style>
        ${d()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          <bim-button id=${y} @click=${f} style="flex: 0" label="Cancel" icon="material-symbols:close"></bim-button>
          <bim-button id=${v} @click=${h} style="flex: 0" label="Accept" icon="material-symbols:check"></bim-button>
        </div>
      </div> 
    `}else{l.selectableRows=!1,c({topic:i,actions:n});const m=()=>{if(!(i&&n.add&&!o))return;const y=a.create();s&&(y.world=s),i.viewpoints.add(y.guid)},h=()=>{e({linking:!0})},f=b`<bim-button style="flex: 0" @click=${m} .disabled=${!s} icon="mi:add"></bim-button>`,v=b`<bim-button style="flex: 0" @click=${h} icon="tabler:link"></bim-button>`;p=b`
      <div style="display: flex; justify-content: right; gap: 0.25rem">
        ${d()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          ${n.add?f:null}
          ${n.link?v:null}
        </div>
      </div> 
    `}return b`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${p}
      ${u}
      ${l}
    </div> 
  `},fi=r=>E.create(tt,r),yi=Object.freeze(Object.defineProperty({__proto__:null,topicViewpoints:fi,topicViewpointsSectionTemplate:tt},Symbol.toStringTag,{value:"Module"}));({...pi,...mi,...gi,...yi});const vi=r=>b`
    <bim-panel-section fixed label="New Topic" name="topic">
      ${Fe(r)}
    </bim-panel-section>
  `,_i=r=>E.create(vi,r),wi=Object.freeze(Object.defineProperty({__proto__:null,topic:_i},Symbol.toStringTag,{value:"Module"}));({...wi});async function Si(r,e){const t=e.get(M),i=new bt;for(const[n,a]of t.list)for(const[l,c]of Object.entries(r)){const d=await a.getItemsData(Array.from(c));for(const u of d){if(!u||!("value"in u._category))continue;const p=u._category.value,m=i.get(p)??0;i.set(p,m+1)}}const s=[...i.keys()],o=[...i.values()].map(n=>({value:n}));return{labels:s,datasets:{Categories:o}}}const xi=r=>{const{type:e,modelIdMap:t,components:i,addLabels:s=!0}=r,o=i.get(M),n=i.get(oe),a=i.get(we),l=r.missingDataMessage??"No data in this chart.";return b`
    <bim-chart ${C(async d=>{if(!d)return;const u=d;if(u.loadFunction=async()=>Si(t,i),await u.loadData(!0),s){const p=u.querySelector("[slot='labels']");p&&(p.charts=[u],p.addEventListener("label-click",async m=>{const h=m,{label:f,visibility:v}=h.detail,y=[];for(const[g,_]of o.list){const w=await _.getItemsOfCategories([new RegExp(f)]),x=Object.values(w).flat(),$={[g]:new Set(x)};y.push(a.set(v,$))}y.push(o.core.update(!0)),await Promise.all(y)}))}u.addEventListener("sectionclick",async p=>{const m=p,{label:h}=m.detail;for(const[f,v]of o.list){const y=await v.getItemsOfCategories([new RegExp(h)]),g=Object.values(y).flat(),_={[f]:new Set(g)};n.highlightByID("select",_,!0,!0)}})})} type=${e??"bar"}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${l}</bim-label>
      ${s?b`<bim-chart-legend slot="labels"></bim-chart-legend>`:""}
    </bim-chart>
  `},$i=r=>E.create(xi,r),Ci=Object.freeze(Object.defineProperty({__proto__:null,categoriesChart:$i},Symbol.toStringTag,{value:"Module"})),it="Passed",st="Failed";async function ki(r){const e=[],t=[],i={};for(const n of r)for(const[a,l]of n.entries()){for(const c of l.values()){const{guid:d,pass:u}=c;d&&(u?e.push(d):t.push(d))}i[a]={Passed:e,Failed:t}}const s={value:e.length,data:{guids:e,guidsMap:i}},o={value:t.length,data:{guids:t,guidsMap:i}};return{labels:[it,st],datasets:{"IDS Compliance":[s,o]}}}const Mi=r=>{const{type:e,idsResult:t,components:i,addLabels:s=!0}=r,o=i.get(M),n=i.get(oe),a=i.get(we);n.styles.set(it,{color:new H("green"),renderedFaces:ye.ONE,opacity:1,transparent:!1}),n.styles.set(st,{color:new H("red"),renderedFaces:ye.ONE,opacity:1,transparent:!1});const l=r.missingDataMessage??"No data in this chart.";return b`
    <bim-chart ${C(async d=>{if(!d)return;const u=d;if(u.loadFunction=async()=>{const p=Array.isArray(t)?t:[t];return ki(p)},u.colors=["green","red"],await u.loadData(!0),s){const p=u.querySelector("[slot='labels']");p&&(p.charts=[u]),p.addEventListener("label-click",async m=>{const{label:h,data:f,visibility:v}=m.detail,y=[];for(const g of f){const{guidsMap:_}=g;for(const[w,x]of Object.entries(_)){const $=o.list.get(w);if(!$)continue;const z=x[h];if(!z||z.length===0)continue;const U=(async()=>{const A=(await $.getLocalIdsByGuids(z)).filter(X=>X!==null);if(A.length===0)return;const j={[w]:new Set(A)};await a.set(v,j)})();y.push(U)}}await Promise.all(y)})}u.addEventListener("sectionclick",async p=>{const{values:m,label:h}=p.detail;await n.clear();for(const f of m){const{data:v}=f;if(!v)continue;const{guids:y}=v;for(const[g,_]of o.list){const w=(await _.getLocalIdsByGuids(y)).filter($=>$!==null),x={[g]:new Set(w)};await n.highlightByID(h,x,!0,!1)}}})})} type=${e??"bar"} colorfulBars=${e==="bar"}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${l}</bim-label>
      ${s?b`<bim-chart-legend slot="labels"></bim-chart-legend>`:""}
    </bim-chart>
  `},Ei=r=>E.create(Mi,r),Ti=Object.freeze(Object.defineProperty({__proto__:null,idsChart:Ei},Symbol.toStringTag,{value:"Module"})),Ii=r=>{const{charts:e}=r,t=r.missingDataMessage??"No charts attached";return b`
    <bim-chart-legend ${C(async s=>{if(!s)return;const o=s;o.charts=e})}>
      <bim-label slot="no-chart" icon="ph:warning-fill" style="--bim-icon--c: gold;">${t}</bim-label>
    </bim-chart-legend>
  `},Di=r=>E.create(Ii,r),Pi=Object.freeze(Object.defineProperty({__proto__:null,labels:Di},Symbol.toStringTag,{value:"Module"}));async function Ri(r,e){const t={};for(const o of r){let n=o[e];n==null?n="Not defined":n instanceof Date?n=n.toLocaleDateString():n=String(n),t[n]||(t[n]=[]),t[n].push(o)}const i=Object.keys(t),s=[];for(const o of i){const n=t[o];s.push({value:n.length,data:{topics:n.map(({guid:a})=>a)}})}return{labels:i,datasets:{Topics:s}}}const Oi=r=>{const{components:e,type:t,addLabels:i=!0,grouper:s="stage"}=r,o=r.filterFunction??(()=>!0),n=[...e.get(se).list.values()].filter(o),a=r.missingDataMessage??"No data in this chart.";return b`
    <bim-chart ${C(async c=>{if(!c)return;const d=c;if(d.loadFunction=async()=>Ri(n,s),await d.loadData(!0),i){const u=d.querySelector("[slot='labels']");u&&(u.charts=[d])}})} type=${t??"bar"}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${a}</bim-label>
      ${i?b`<bim-chart-legend slot="labels"></bim-chart-legend>`:""}
    </bim-chart>
  `},zi=r=>E.create(Oi,r),Ai=Object.freeze(Object.defineProperty({__proto__:null,topicsChart:zi},Symbol.toStringTag,{value:"Module"}));async function ji(r,e,t,i){const s=i.get(M).list.get(t);if(!s)return{labels:[],datasets:{}};const o=await s.getAttributesUniqueValues([{categories:[e],get:r}]);if(!o)return{labels:[],datasets:{}};const n=[],a=[];for(const[l,c]of Object.entries(o))for(const{value:d,localIds:u}of Object.values(c)){n.push(d);const p=u.length;a.push({value:p,data:{modelIdMap:{[t]:new Set(u)}}})}return{labels:n,datasets:{[r.toString()]:a}}}const Li=r=>{const{type:e,attribute:t,category:i,modelId:s,components:o,addLabels:n=!0}=r,a={zoom:!0,...r.highlight},l=o.get(M),c=o.get(oe),d=o.get(we),u=r.missingDataMessage??"No data in this chart.";return b`
    <bim-chart ${C(async m=>{if(!m)return;const h=m;if(h.loadFunction=async()=>ji(t,i,s,o),await h.loadData(!0),n){const f=h.querySelector("[slot='labels']");f&&(f.charts=[h]),f.addEventListener("label-click",async v=>{const{data:y,visibility:g}=v.detail;for(const _ of y){const{modelIdMap:w}=_;await d.set(g,w)}await l.core.update(!0)})}h.addEventListener("sectionclick",async f=>{const{values:v}=f.detail,y=[];for(const g of v){const{data:_}=g;if(!_)continue;const{modelIdMap:w}=_;y.push(c.highlightByID("select",w,!0,a.zoom))}await Promise.all(y)})})} type=${e??"bar"}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">${u}</bim-label>
      ${n?b`<bim-chart-legend slot="labels"></bim-chart-legend>`:""}
    </bim-chart>
  `},Ni=r=>E.create(Li,r),Fi=Object.freeze(Object.defineProperty({__proto__:null,attributesChart:Ni},Symbol.toStringTag,{value:"Module"}));({...Ci,...Ti,...Ai,...Pi,...Fi});export{Wi as u};
