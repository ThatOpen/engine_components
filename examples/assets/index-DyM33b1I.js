var Wo=Object.defineProperty,Yo=(e,t,i)=>t in e?Wo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,ct=(e,t,i)=>(Yo(e,typeof t!="symbol"?t+"":t,i),i);const $t=Math.min,W=Math.max,pe=Math.round,tt=e=>({x:e,y:e}),Qo={left:"right",right:"left",bottom:"top",top:"bottom"},Go={start:"end",end:"start"};function _i(e,t,i){return W(e,$t(t,i))}function Qt(e,t){return typeof e=="function"?e(t):e}function Q(e){return e.split("-")[0]}function Ee(e){return e.split("-")[1]}function dn(e){return e==="x"?"y":"x"}function pn(e){return e==="y"?"height":"width"}function Gt(e){return["top","bottom"].includes(Q(e))?"y":"x"}function bn(e){return dn(Gt(e))}function Jo(e,t,i){i===void 0&&(i=!1);const o=Ee(e),n=bn(e),r=pn(n);let s=n==="x"?o===(i?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[r]>t.floating[r]&&(s=be(s)),[s,be(s)]}function Xo(e){const t=be(e);return[Ve(e),t,Ve(t)]}function Ve(e){return e.replace(/start|end/g,t=>Go[t])}function Zo(e,t,i){const o=["left","right"],n=["right","left"],r=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return i?t?n:o:t?o:n;case"left":case"right":return t?r:s;default:return[]}}function Ko(e,t,i,o){const n=Ee(e);let r=Zo(Q(e),i==="start",o);return n&&(r=r.map(s=>s+"-"+n),t&&(r=r.concat(r.map(Ve)))),r}function be(e){return e.replace(/left|right|bottom|top/g,t=>Qo[t])}function tr(e){return{top:0,right:0,bottom:0,left:0,...e}}function fn(e){return typeof e!="number"?tr(e):{top:e,right:e,bottom:e,left:e}}function Et(e){const{x:t,y:i,width:o,height:n}=e;return{width:o,height:n,top:i,left:t,right:t+o,bottom:i+n,x:t,y:i}}function xi(e,t,i){let{reference:o,floating:n}=e;const r=Gt(t),s=bn(t),l=pn(s),a=Q(t),c=r==="y",h=o.x+o.width/2-n.width/2,d=o.y+o.height/2-n.height/2,p=o[l]/2-n[l]/2;let b;switch(a){case"top":b={x:h,y:o.y-n.height};break;case"bottom":b={x:h,y:o.y+o.height};break;case"right":b={x:o.x+o.width,y:d};break;case"left":b={x:o.x-n.width,y:d};break;default:b={x:o.x,y:o.y}}switch(Ee(t)){case"start":b[s]-=p*(i&&c?-1:1);break;case"end":b[s]+=p*(i&&c?-1:1);break}return b}const er=async(e,t,i)=>{const{placement:o="bottom",strategy:n="absolute",middleware:r=[],platform:s}=i,l=r.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:e,floating:t,strategy:n}),{x:h,y:d}=xi(c,o,a),p=o,b={},m=0;for(let v=0;v<l.length;v++){const{name:g,fn:C}=l[v],{x:A,y:_,data:$,reset:z}=await C({x:h,y:d,initialPlacement:o,placement:p,strategy:n,middlewareData:b,rects:c,platform:s,elements:{reference:e,floating:t}});h=A??h,d=_??d,b={...b,[g]:{...b[g],...$}},z&&m<=50&&(m++,typeof z=="object"&&(z.placement&&(p=z.placement),z.rects&&(c=z.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:n}):z.rects),{x:h,y:d}=xi(c,p,a)),v=-1)}return{x:h,y:d,placement:p,strategy:n,middlewareData:b}};async function oi(e,t){var i;t===void 0&&(t={});const{x:o,y:n,platform:r,rects:s,elements:l,strategy:a}=e,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:p=!1,padding:b=0}=Qt(t,e),m=fn(b),v=l[p?d==="floating"?"reference":"floating":d],g=Et(await r.getClippingRect({element:(i=await(r.isElement==null?void 0:r.isElement(v)))==null||i?v:v.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:h,strategy:a})),C=d==="floating"?{x:o,y:n,width:s.floating.width,height:s.floating.height}:s.reference,A=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),_=await(r.isElement==null?void 0:r.isElement(A))?await(r.getScale==null?void 0:r.getScale(A))||{x:1,y:1}:{x:1,y:1},$=Et(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:C,offsetParent:A,strategy:a}):C);return{top:(g.top-$.top+m.top)/_.y,bottom:($.bottom-g.bottom+m.bottom)/_.y,left:(g.left-$.left+m.left)/_.x,right:($.right-g.right+m.right)/_.x}}const ir=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,o;const{placement:n,middlewareData:r,rects:s,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:h=!0,crossAxis:d=!0,fallbackPlacements:p,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...g}=Qt(e,t);if((i=r.arrow)!=null&&i.alignmentOffset)return{};const C=Q(n),A=Q(l)===l,_=await(a.isRTL==null?void 0:a.isRTL(c.floating)),$=p||(A||!v?[be(l)]:Xo(l));!p&&m!=="none"&&$.push(...Ko(l,v,m,_));const z=[l,...$],y=await oi(t,g),O=[];let P=((o=r.flip)==null?void 0:o.overflows)||[];if(h&&O.push(y[C]),d){const N=Jo(n,s,_);O.push(y[N[0]],y[N[1]])}if(P=[...P,{placement:n,overflows:O}],!O.every(N=>N<=0)){var F,S;const N=(((F=r.flip)==null?void 0:F.index)||0)+1,_t=z[N];if(_t)return{data:{index:N,overflows:P},reset:{placement:_t}};let Z=(S=P.filter(I=>I.overflows[0]<=0).sort((I,V)=>I.overflows[1]-V.overflows[1])[0])==null?void 0:S.placement;if(!Z)switch(b){case"bestFit":{var yt;const I=(yt=P.map(V=>[V.placement,V.overflows.filter(at=>at>0).reduce((at,He)=>at+He,0)]).sort((V,at)=>V[1]-at[1])[0])==null?void 0:yt[0];I&&(Z=I);break}case"initialPlacement":Z=l;break}if(n!==Z)return{reset:{placement:Z}}}return{}}}};function mn(e){const t=$t(...e.map(r=>r.left)),i=$t(...e.map(r=>r.top)),o=W(...e.map(r=>r.right)),n=W(...e.map(r=>r.bottom));return{x:t,y:i,width:o-t,height:n-i}}function nr(e){const t=e.slice().sort((n,r)=>n.y-r.y),i=[];let o=null;for(let n=0;n<t.length;n++){const r=t[n];!o||r.y-o.y>o.height/2?i.push([r]):i[i.length-1].push(r),o=r}return i.map(n=>Et(mn(n)))}const or=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:o,rects:n,platform:r,strategy:s}=t,{padding:l=2,x:a,y:c}=Qt(e,t),h=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(o.reference))||[]),d=nr(h),p=Et(mn(h)),b=fn(l);function m(){if(d.length===2&&d[0].left>d[1].right&&a!=null&&c!=null)return d.find(g=>a>g.left-b.left&&a<g.right+b.right&&c>g.top-b.top&&c<g.bottom+b.bottom)||p;if(d.length>=2){if(Gt(i)==="y"){const S=d[0],yt=d[d.length-1],N=Q(i)==="top",_t=S.top,Z=yt.bottom,I=N?S.left:yt.left,V=N?S.right:yt.right,at=V-I,He=Z-_t;return{top:_t,bottom:Z,left:I,right:V,width:at,height:He,x:I,y:_t}}const g=Q(i)==="left",C=W(...d.map(S=>S.right)),A=$t(...d.map(S=>S.left)),_=d.filter(S=>g?S.left===A:S.right===C),$=_[0].top,z=_[_.length-1].bottom,y=A,O=C,P=O-y,F=z-$;return{top:$,bottom:z,left:y,right:O,width:P,height:F,x:y,y:$}}return p}const v=await r.getElementRects({reference:{getBoundingClientRect:m},floating:o.floating,strategy:s});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function rr(e,t){const{placement:i,platform:o,elements:n}=e,r=await(o.isRTL==null?void 0:o.isRTL(n.floating)),s=Q(i),l=Ee(i),a=Gt(i)==="y",c=["left","top"].includes(s)?-1:1,h=r&&a?-1:1,d=Qt(t,e);let{mainAxis:p,crossAxis:b,alignmentAxis:m}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return l&&typeof m=="number"&&(b=l==="end"?m*-1:m),a?{x:b*h,y:p*c}:{x:p*c,y:b*h}}const gn=function(e){return{name:"offset",options:e,async fn(t){var i,o;const{x:n,y:r,placement:s,middlewareData:l}=t,a=await rr(t,e);return s===((i=l.offset)==null?void 0:i.placement)&&(o=l.arrow)!=null&&o.alignmentOffset?{}:{x:n+a.x,y:r+a.y,data:{...a,placement:s}}}}},sr=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:o,placement:n}=t,{mainAxis:r=!0,crossAxis:s=!1,limiter:l={fn:g=>{let{x:C,y:A}=g;return{x:C,y:A}}},...a}=Qt(e,t),c={x:i,y:o},h=await oi(t,a),d=Gt(Q(n)),p=dn(d);let b=c[p],m=c[d];if(r){const g=p==="y"?"top":"left",C=p==="y"?"bottom":"right",A=b+h[g],_=b-h[C];b=_i(A,b,_)}if(s){const g=d==="y"?"top":"left",C=d==="y"?"bottom":"right",A=m+h[g],_=m-h[C];m=_i(A,m,_)}const v=l.fn({...t,[p]:b,[d]:m});return{...v,data:{x:v.x-i,y:v.y-o}}}}};function et(e){return vn(e)?(e.nodeName||"").toLowerCase():"#document"}function j(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function nt(e){var t;return(t=(vn(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function vn(e){return e instanceof Node||e instanceof j(e).Node}function G(e){return e instanceof Element||e instanceof j(e).Element}function D(e){return e instanceof HTMLElement||e instanceof j(e).HTMLElement}function wi(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof j(e).ShadowRoot}function Jt(e){const{overflow:t,overflowX:i,overflowY:o,display:n}=R(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+i)&&!["inline","contents"].includes(n)}function lr(e){return["table","td","th"].includes(et(e))}function ri(e){const t=si(),i=R(e);return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(i.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(i.contain||"").includes(o))}function ar(e){let t=At(e);for(;D(t)&&!Ae(t);){if(ri(t))return t;t=At(t)}return null}function si(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Ae(e){return["html","body","#document"].includes(et(e))}function R(e){return j(e).getComputedStyle(e)}function Ce(e){return G(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function At(e){if(et(e)==="html")return e;const t=e.assignedSlot||e.parentNode||wi(e)&&e.host||nt(e);return wi(t)?t.host:t}function yn(e){const t=At(e);return Ae(t)?e.ownerDocument?e.ownerDocument.body:e.body:D(t)&&Jt(t)?t:yn(t)}function qe(e,t,i){var o;t===void 0&&(t=[]),i===void 0&&(i=!0);const n=yn(e),r=n===((o=e.ownerDocument)==null?void 0:o.body),s=j(n);return r?t.concat(s,s.visualViewport||[],Jt(n)?n:[],s.frameElement&&i?qe(s.frameElement):[]):t.concat(n,qe(n,[],i))}function _n(e){const t=R(e);let i=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const n=D(e),r=n?e.offsetWidth:i,s=n?e.offsetHeight:o,l=pe(i)!==r||pe(o)!==s;return l&&(i=r,o=s),{width:i,height:o,$:l}}function xn(e){return G(e)?e:e.contextElement}function wt(e){const t=xn(e);if(!D(t))return tt(1);const i=t.getBoundingClientRect(),{width:o,height:n,$:r}=_n(t);let s=(r?pe(i.width):i.width)/o,l=(r?pe(i.height):i.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const cr=tt(0);function wn(e){const t=j(e);return!si()||!t.visualViewport?cr:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function hr(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==j(e)?!1:t}function Dt(e,t,i,o){t===void 0&&(t=!1),i===void 0&&(i=!1);const n=e.getBoundingClientRect(),r=xn(e);let s=tt(1);t&&(o?G(o)&&(s=wt(o)):s=wt(e));const l=hr(r,i,o)?wn(r):tt(0);let a=(n.left+l.x)/s.x,c=(n.top+l.y)/s.y,h=n.width/s.x,d=n.height/s.y;if(r){const p=j(r),b=o&&G(o)?j(o):o;let m=p,v=m.frameElement;for(;v&&o&&b!==m;){const g=wt(v),C=v.getBoundingClientRect(),A=R(v),_=C.left+(v.clientLeft+parseFloat(A.paddingLeft))*g.x,$=C.top+(v.clientTop+parseFloat(A.paddingTop))*g.y;a*=g.x,c*=g.y,h*=g.x,d*=g.y,a+=_,c+=$,m=j(v),v=m.frameElement}}return Et({width:h,height:d,x:a,y:c})}const ur=[":popover-open",":modal"];function $n(e){return ur.some(t=>{try{return e.matches(t)}catch{return!1}})}function dr(e){let{elements:t,rect:i,offsetParent:o,strategy:n}=e;const r=n==="fixed",s=nt(o),l=t?$n(t.floating):!1;if(o===s||l&&r)return i;let a={scrollLeft:0,scrollTop:0},c=tt(1);const h=tt(0),d=D(o);if((d||!d&&!r)&&((et(o)!=="body"||Jt(s))&&(a=Ce(o)),D(o))){const p=Dt(o);c=wt(o),h.x=p.x+o.clientLeft,h.y=p.y+o.clientTop}return{width:i.width*c.x,height:i.height*c.y,x:i.x*c.x-a.scrollLeft*c.x+h.x,y:i.y*c.y-a.scrollTop*c.y+h.y}}function pr(e){return Array.from(e.getClientRects())}function En(e){return Dt(nt(e)).left+Ce(e).scrollLeft}function br(e){const t=nt(e),i=Ce(e),o=e.ownerDocument.body,n=W(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=W(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let s=-i.scrollLeft+En(e);const l=-i.scrollTop;return R(o).direction==="rtl"&&(s+=W(t.clientWidth,o.clientWidth)-n),{width:n,height:r,x:s,y:l}}function fr(e,t){const i=j(e),o=nt(e),n=i.visualViewport;let r=o.clientWidth,s=o.clientHeight,l=0,a=0;if(n){r=n.width,s=n.height;const c=si();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:r,height:s,x:l,y:a}}function mr(e,t){const i=Dt(e,!0,t==="fixed"),o=i.top+e.clientTop,n=i.left+e.clientLeft,r=D(e)?wt(e):tt(1),s=e.clientWidth*r.x,l=e.clientHeight*r.y,a=n*r.x,c=o*r.y;return{width:s,height:l,x:a,y:c}}function $i(e,t,i){let o;if(t==="viewport")o=fr(e,i);else if(t==="document")o=br(nt(e));else if(G(t))o=mr(t,i);else{const n=wn(e);o={...t,x:t.x-n.x,y:t.y-n.y}}return Et(o)}function An(e,t){const i=At(e);return i===t||!G(i)||Ae(i)?!1:R(i).position==="fixed"||An(i,t)}function gr(e,t){const i=t.get(e);if(i)return i;let o=qe(e,[],!1).filter(l=>G(l)&&et(l)!=="body"),n=null;const r=R(e).position==="fixed";let s=r?At(e):e;for(;G(s)&&!Ae(s);){const l=R(s),a=ri(s);!a&&l.position==="fixed"&&(n=null),(r?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||Jt(s)&&!a&&An(e,s))?o=o.filter(c=>c!==s):n=l,s=At(s)}return t.set(e,o),o}function vr(e){let{element:t,boundary:i,rootBoundary:o,strategy:n}=e;const r=[...i==="clippingAncestors"?gr(t,this._c):[].concat(i),o],s=r[0],l=r.reduce((a,c)=>{const h=$i(t,c,n);return a.top=W(h.top,a.top),a.right=$t(h.right,a.right),a.bottom=$t(h.bottom,a.bottom),a.left=W(h.left,a.left),a},$i(t,s,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function yr(e){const{width:t,height:i}=_n(e);return{width:t,height:i}}function _r(e,t,i){const o=D(t),n=nt(t),r=i==="fixed",s=Dt(e,!0,r,t);let l={scrollLeft:0,scrollTop:0};const a=tt(0);if(o||!o&&!r)if((et(t)!=="body"||Jt(n))&&(l=Ce(t)),o){const d=Dt(t,!0,r,t);a.x=d.x+t.clientLeft,a.y=d.y+t.clientTop}else n&&(a.x=En(n));const c=s.left+l.scrollLeft-a.x,h=s.top+l.scrollTop-a.y;return{x:c,y:h,width:s.width,height:s.height}}function Ei(e,t){return!D(e)||R(e).position==="fixed"?null:t?t(e):e.offsetParent}function Cn(e,t){const i=j(e);if(!D(e)||$n(e))return i;let o=Ei(e,t);for(;o&&lr(o)&&R(o).position==="static";)o=Ei(o,t);return o&&(et(o)==="html"||et(o)==="body"&&R(o).position==="static"&&!ri(o))?i:o||ar(e)||i}const xr=async function(e){const t=this.getOffsetParent||Cn,i=this.getDimensions;return{reference:_r(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function wr(e){return R(e).direction==="rtl"}const $r={convertOffsetParentRelativeRectToViewportRelativeRect:dr,getDocumentElement:nt,getClippingRect:vr,getOffsetParent:Cn,getElementRects:xr,getClientRects:pr,getDimensions:yr,getScale:wt,isElement:G,isRTL:wr},kn=sr,Sn=ir,On=or,Tn=(e,t,i)=>{const o=new Map,n={platform:$r,...i},r={...n.platform,_c:o};return er(e,t,{...n,platform:r})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=globalThis,li=ue.ShadowRoot&&(ue.ShadyCSS===void 0||ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ai=Symbol(),Ai=new WeakMap;let zn=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ai)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(li&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Ai.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Ai.set(t,e))}return e}toString(){return this.cssText}};const Er=e=>new zn(typeof e=="string"?e:e+"",void 0,ai),E=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((o,n,r)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[r+1],e[0]);return new zn(i,e,ai)},Ar=(e,t)=>{if(li)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const o=document.createElement("style"),n=ue.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=i.cssText,e.appendChild(o)}},Ci=li?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const o of t.cssRules)i+=o.cssText;return Er(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Cr,defineProperty:kr,getOwnPropertyDescriptor:Sr,getOwnPropertyNames:Or,getOwnPropertySymbols:Tr,getPrototypeOf:zr}=Object,Ct=globalThis,ki=Ct.trustedTypes,Pr=ki?ki.emptyScript:"",Si=Ct.reactiveElementPolyfillSupport,Ht=(e,t)=>e,fe={toAttribute(e,t){switch(t){case Boolean:e=e?Pr:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},ci=(e,t)=>!Cr(e,t),Oi={attribute:!0,type:String,converter:fe,reflect:!1,hasChanged:ci};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Ct.litPropertyMetadata??(Ct.litPropertyMetadata=new WeakMap);class xt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Oi){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const o=Symbol(),n=this.getPropertyDescriptor(t,o,i);n!==void 0&&kr(this.prototype,t,n)}}static getPropertyDescriptor(t,i,o){const{get:n,set:r}=Sr(this.prototype,t)??{get(){return this[i]},set(s){this[i]=s}};return{get(){return n==null?void 0:n.call(this)},set(s){const l=n==null?void 0:n.call(this);r.call(this,s),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Oi}static _$Ei(){if(this.hasOwnProperty(Ht("elementProperties")))return;const t=zr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ht("properties"))){const i=this.properties,o=[...Or(i),...Tr(i)];for(const n of o)this.createProperty(n,i[n])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[o,n]of i)this.elementProperties.set(o,n)}this._$Eh=new Map;for(const[i,o]of this.elementProperties){const n=this._$Eu(i,o);n!==void 0&&this._$Eh.set(n,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const n of o)i.unshift(Ci(n))}else t!==void 0&&i.push(Ci(t));return i}static _$Eu(t,i){const o=i.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const o of i.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ar(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var o;return(o=i.hostConnected)==null?void 0:o.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var o;return(o=i.hostDisconnected)==null?void 0:o.call(i)})}attributeChangedCallback(t,i,o){this._$AK(t,o)}_$EC(t,i){var o;const n=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,n);if(r!==void 0&&n.reflect===!0){const s=(((o=n.converter)==null?void 0:o.toAttribute)!==void 0?n.converter:fe).toAttribute(i,n.type);this._$Em=t,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,i){var o;const n=this.constructor,r=n._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const s=n.getPropertyOptions(r),l=typeof s.converter=="function"?{fromAttribute:s.converter}:((o=s.converter)==null?void 0:o.fromAttribute)!==void 0?s.converter:fe;this._$Em=r,this[r]=l.fromAttribute(i,s.type),this._$Em=null}}requestUpdate(t,i,o){if(t!==void 0){if(o??(o=this.constructor.getPropertyOptions(t)),!(o.hasChanged??ci)(this[t],i))return;this.P(t,i,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,o){this._$AL.has(t)||this._$AL.set(t,i),o.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[r,s]of n)s.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],s)}let i=!1;const o=this._$AL;try{i=this.shouldUpdate(o),i?(this.willUpdate(o),(t=this._$EO)==null||t.forEach(n=>{var r;return(r=n.hostUpdate)==null?void 0:r.call(n)}),this.update(o)):this._$EU()}catch(n){throw i=!1,this._$EU(),n}i&&this._$AE(o)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(o=>{var n;return(n=o.hostUpdated)==null?void 0:n.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}xt.elementStyles=[],xt.shadowRootOptions={mode:"open"},xt[Ht("elementProperties")]=new Map,xt[Ht("finalized")]=new Map,Si==null||Si({ReactiveElement:xt}),(Ct.reactiveElementVersions??(Ct.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,ge=me.trustedTypes,Ti=ge?ge.createPolicy("lit-html",{createHTML:e=>e}):void 0,hi="$lit$",q=`lit$${Math.random().toFixed(9).slice(2)}$`,ui="?"+q,jr=`<${ui}>`,pt=document,Ut=()=>pt.createComment(""),Ft=e=>e===null||typeof e!="object"&&typeof e!="function",Pn=Array.isArray,jn=e=>Pn(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Be=`[ 	
\f\r]`,Rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zi=/-->/g,Pi=/>/g,ht=RegExp(`>|${Be}(?:([^\\s"'>=/]+)(${Be}*=${Be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ji=/'/g,Li=/"/g,Ln=/^(?:script|style|textarea|title)$/i,Lr=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),f=Lr(1),kt=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),Mi=new WeakMap,ut=pt.createTreeWalker(pt,129);function Mn(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ti!==void 0?Ti.createHTML(t):t}const Rn=(e,t)=>{const i=e.length-1,o=[];let n,r=t===2?"<svg>":"",s=Rt;for(let l=0;l<i;l++){const a=e[l];let c,h,d=-1,p=0;for(;p<a.length&&(s.lastIndex=p,h=s.exec(a),h!==null);)p=s.lastIndex,s===Rt?h[1]==="!--"?s=zi:h[1]!==void 0?s=Pi:h[2]!==void 0?(Ln.test(h[2])&&(n=RegExp("</"+h[2],"g")),s=ht):h[3]!==void 0&&(s=ht):s===ht?h[0]===">"?(s=n??Rt,d=-1):h[1]===void 0?d=-2:(d=s.lastIndex-h[2].length,c=h[1],s=h[3]===void 0?ht:h[3]==='"'?Li:ji):s===Li||s===ji?s=ht:s===zi||s===Pi?s=Rt:(s=ht,n=void 0);const b=s===ht&&e[l+1].startsWith("/>")?" ":"";r+=s===Rt?a+jr:d>=0?(o.push(c),a.slice(0,d)+hi+a.slice(d)+q+b):a+q+(d===-2?l:b)}return[Mn(e,r+(e[i]||"<?>")+(t===2?"</svg>":"")),o]};class Vt{constructor({strings:t,_$litType$:i},o){let n;this.parts=[];let r=0,s=0;const l=t.length-1,a=this.parts,[c,h]=Rn(t,i);if(this.el=Vt.createElement(c,o),ut.currentNode=this.el.content,i===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=ut.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const d of n.getAttributeNames())if(d.endsWith(hi)){const p=h[s++],b=n.getAttribute(d).split(q),m=/([.?@])?(.*)/.exec(p);a.push({type:1,index:r,name:m[2],strings:b,ctor:m[1]==="."?Bn:m[1]==="?"?Nn:m[1]==="@"?In:Xt}),n.removeAttribute(d)}else d.startsWith(q)&&(a.push({type:6,index:r}),n.removeAttribute(d));if(Ln.test(n.tagName)){const d=n.textContent.split(q),p=d.length-1;if(p>0){n.textContent=ge?ge.emptyScript:"";for(let b=0;b<p;b++)n.append(d[b],Ut()),ut.nextNode(),a.push({type:2,index:++r});n.append(d[p],Ut())}}}else if(n.nodeType===8)if(n.data===ui)a.push({type:2,index:r});else{let d=-1;for(;(d=n.data.indexOf(q,d+1))!==-1;)a.push({type:7,index:r}),d+=q.length-1}r++}}static createElement(t,i){const o=pt.createElement("template");return o.innerHTML=t,o}}function bt(e,t,i=e,o){var n,r;if(t===kt)return t;let s=o!==void 0?(n=i._$Co)==null?void 0:n[o]:i._$Cl;const l=Ft(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==l&&((r=s==null?void 0:s._$AO)==null||r.call(s,!1),l===void 0?s=void 0:(s=new l(e),s._$AT(e,i,o)),o!==void 0?(i._$Co??(i._$Co=[]))[o]=s:i._$Cl=s),s!==void 0&&(t=bt(e,s._$AS(e,t.values),s,o)),t}class Hn{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:o}=this._$AD,n=((t==null?void 0:t.creationScope)??pt).importNode(i,!0);ut.currentNode=n;let r=ut.nextNode(),s=0,l=0,a=o[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new St(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new Dn(r,this,t)),this._$AV.push(c),a=o[++l]}s!==(a==null?void 0:a.index)&&(r=ut.nextNode(),s++)}return ut.currentNode=pt,n}p(t){let i=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,i),i+=o.strings.length-2):o._$AI(t[i])),i++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,o,n){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=o,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=bt(this,t,i),Ft(t)?t===k||t==null||t===""?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==kt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):jn(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==k&&Ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(pt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:o,_$litType$:n}=t,r=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Vt.createElement(Mn(n.h,n.h[0]),this.options)),n);if(((i=this._$AH)==null?void 0:i._$AD)===r)this._$AH.p(o);else{const s=new Hn(r,this),l=s.u(this.options);s.p(o),this.T(l),this._$AH=s}}_$AC(t){let i=Mi.get(t.strings);return i===void 0&&Mi.set(t.strings,i=new Vt(t)),i}k(t){Pn(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let o,n=0;for(const r of t)n===i.length?i.push(o=new St(this.S(Ut()),this.S(Ut()),this,this.options)):o=i[n],o._$AI(r),n++;n<i.length&&(this._$AR(o&&o._$AB.nextSibling,n),i.length=n)}_$AR(t=this._$AA.nextSibling,i){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,i);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class Xt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,o,n,r){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=i,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=k}_$AI(t,i=this,o,n){const r=this.strings;let s=!1;if(r===void 0)t=bt(this,t,i,0),s=!Ft(t)||t!==this._$AH&&t!==kt,s&&(this._$AH=t);else{const l=t;let a,c;for(t=r[0],a=0;a<r.length-1;a++)c=bt(this,l[o+a],i,a),c===kt&&(c=this._$AH[a]),s||(s=!Ft(c)||c!==this._$AH[a]),c===k?t=k:t!==k&&(t+=(c??"")+r[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Bn extends Xt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===k?void 0:t}}class Nn extends Xt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==k)}}class In extends Xt{constructor(t,i,o,n,r){super(t,i,o,n,r),this.type=5}_$AI(t,i=this){if((t=bt(this,t,i,0)??k)===kt)return;const o=this._$AH,n=t===k&&o!==k||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==k&&(o===k||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Dn{constructor(t,i,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){bt(this,t)}}const Mr={P:hi,A:q,C:ui,M:1,L:Rn,R:Hn,D:jn,V:bt,I:St,H:Xt,N:Nn,U:In,B:Bn,F:Dn},Ri=me.litHtmlPolyfillSupport;Ri==null||Ri(Vt,St),(me.litHtmlVersions??(me.litHtmlVersions=[])).push("3.1.3");const ve=(e,t,i)=>{const o=(i==null?void 0:i.renderBefore)??t;let n=o._$litPart$;if(n===void 0){const r=(i==null?void 0:i.renderBefore)??null;o._$litPart$=n=new St(t.insertBefore(Ut(),r),r,void 0,i??{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let w=class extends xt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return kt}};var Hi;w._$litElement$=!0,w.finalized=!0,(Hi=globalThis.litElementHydrateSupport)==null||Hi.call(globalThis,{LitElement:w});const Bi=globalThis.litElementPolyfillSupport;Bi==null||Bi({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rr={attribute:!0,type:String,converter:fe,reflect:!1,hasChanged:ci},Hr=(e=Rr,t,i)=>{const{kind:o,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(i.name,e),o==="accessor"){const{name:s}=i;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(s,a,e)},init(l){return l!==void 0&&this.P(s,void 0,e),l}}}if(o==="setter"){const{name:s}=i;return function(l){const a=this[s];t.call(this,l),this.requestUpdate(s,a,e)}}throw Error("Unsupported decorator location: "+o)};function u(e){return(t,i)=>typeof i=="object"?Hr(e,t,i):((o,n,r)=>{const s=n.hasOwnProperty(r);return n.constructor.createProperty(r,s?{...o,wrapped:!0}:o),s?Object.getOwnPropertyDescriptor(n,r):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Zt(e){return u({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Br}=Mr,Ni=(e,t)=>(e==null?void 0:e._$litType$)!==void 0,Nr=e=>{var t;return((t=e==null?void 0:e._$litType$)==null?void 0:t.h)!=null},Ir=e=>e.strings===void 0,Ii=()=>document.createComment(""),Di=(e,t,i)=>{var o;const n=e._$AA.parentNode,r=e._$AB;if(i===void 0){const s=n.insertBefore(Ii(),r),l=n.insertBefore(Ii(),r);i=new Br(s,l,e,e.options)}else{const s=i._$AB.nextSibling,l=i._$AM,a=l!==e;if(a){let c;(o=i._$AQ)==null||o.call(i,e),i._$AM=e,i._$AP!==void 0&&(c=e._$AU)!==l._$AU&&i._$AP(c)}if(s!==r||a){let c=i._$AA;for(;c!==s;){const h=c.nextSibling;n.insertBefore(c,r),c=h}}}return i},Dr={},Ui=(e,t=Dr)=>e._$AH=t,Fi=e=>e._$AH,Ur=e=>{e._$AR()};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Un=e=>(...t)=>({_$litDirective$:e,values:t});let Fn=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bt=(e,t)=>{var i;const o=e._$AN;if(o===void 0)return!1;for(const n of o)(i=n._$AO)==null||i.call(n,t,!1),Bt(n,t);return!0},ye=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},Vn=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Wr(t)}};function Vr(e){this._$AN!==void 0?(ye(this),this._$AM=e,Vn(this)):this._$AM=e}function qr(e,t=!1,i=0){const o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let r=i;r<o.length;r++)Bt(o[r],!1),ye(o[r]);else o!=null&&(Bt(o,!1),ye(o));else Bt(this,e)}const Wr=e=>{e.type==Fr.CHILD&&(e._$AP??(e._$AP=qr),e._$AQ??(e._$AQ=Vr))};class Yr extends Fn{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,o){super._$AT(t,i,o),Vn(this),this.isConnected=t._$AU}_$AO(t,i=!0){var o,n;t!==this.isConnected&&(this.isConnected=t,t?(o=this.reconnected)==null||o.call(this):(n=this.disconnected)==null||n.call(this)),i&&(Bt(this,t),ye(this))}setValue(t){if(Ir(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K=()=>new Qr;let Qr=class{};const Ne=new WeakMap,Y=Un(class extends Yr{render(e){return k}update(e,[t]){var i;const o=t!==this.Y;return o&&this.Y!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),k}rt(e){if(typeof this.Y=="function"){const t=this.ht??globalThis;let i=Ne.get(t);i===void 0&&(i=new WeakMap,Ne.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Ne.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const qn=Object.freeze({left:0,top:0,width:16,height:16}),_e=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Kt=Object.freeze({...qn,..._e}),We=Object.freeze({...Kt,body:"",hidden:!1}),Gr=Object.freeze({width:null,height:null}),Wn=Object.freeze({...Gr,..._e});function Jr(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function o(n){for(;n<0;)n+=4;return n%4}if(i===""){const n=parseInt(e);return isNaN(n)?0:o(n)}else if(i!==e){let n=0;switch(i){case"%":n=25;break;case"deg":n=90}if(n){let r=parseFloat(e.slice(0,e.length-i.length));return isNaN(r)?0:(r=r/n,r%1===0?o(r):0)}}return t}const Xr=/[\s,]+/;function Zr(e,t){t.split(Xr).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const Yn={...Wn,preserveAspectRatio:""};function Vi(e){const t={...Yn},i=(o,n)=>e.getAttribute(o)||n;return t.width=i("width",null),t.height=i("height",null),t.rotate=Jr(i("rotate","")),Zr(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function Kr(e,t){for(const i in Yn)if(e[i]!==t[i])return!0;return!1}const Nt=/^[a-z0-9]+(-[a-z0-9]+)*$/,te=(e,t,i,o="")=>{const n=e.split(":");if(e.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;o=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:o,prefix:a,name:l};return t&&!de(c)?null:c}const r=n[0],s=r.split("-");if(s.length>1){const l={provider:o,prefix:s.shift(),name:s.join("-")};return t&&!de(l)?null:l}if(i&&o===""){const l={provider:o,prefix:"",name:r};return t&&!de(l,i)?null:l}return null},de=(e,t)=>e?!!((e.provider===""||e.provider.match(Nt))&&(t&&e.prefix===""||e.prefix.match(Nt))&&e.name.match(Nt)):!1;function ts(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const o=((e.rotate||0)+(t.rotate||0))%4;return o&&(i.rotate=o),i}function qi(e,t){const i=ts(e,t);for(const o in We)o in _e?o in e&&!(o in i)&&(i[o]=_e[o]):o in t?i[o]=t[o]:o in e&&(i[o]=e[o]);return i}function es(e,t){const i=e.icons,o=e.aliases||Object.create(null),n=Object.create(null);function r(s){if(i[s])return n[s]=[];if(!(s in n)){n[s]=null;const l=o[s]&&o[s].parent,a=l&&r(l);a&&(n[s]=[l].concat(a))}return n[s]}return Object.keys(i).concat(Object.keys(o)).forEach(r),n}function is(e,t,i){const o=e.icons,n=e.aliases||Object.create(null);let r={};function s(l){r=qi(o[l]||n[l],r)}return s(t),i.forEach(s),qi(e,r)}function Qn(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(n=>{t(n,null),i.push(n)});const o=es(e);for(const n in o){const r=o[n];r&&(t(n,is(e,n,r)),i.push(n))}return i}const ns={provider:"",aliases:{},not_found:{},...qn};function Ie(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function Gn(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Ie(e,ns))return null;const i=t.icons;for(const n in i){const r=i[n];if(!n.match(Nt)||typeof r.body!="string"||!Ie(r,We))return null}const o=t.aliases||Object.create(null);for(const n in o){const r=o[n],s=r.parent;if(!n.match(Nt)||typeof s!="string"||!i[s]&&!o[s]||!Ie(r,We))return null}return t}const xe=Object.create(null);function os(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function it(e,t){const i=xe[e]||(xe[e]=Object.create(null));return i[t]||(i[t]=os(e,t))}function di(e,t){return Gn(t)?Qn(t,(i,o)=>{o?e.icons[i]=o:e.missing.add(i)}):[]}function rs(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function ss(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(xe)).forEach(o=>{(typeof o=="string"&&typeof t=="string"?[t]:Object.keys(xe[o]||{})).forEach(n=>{const r=it(o,n);i=i.concat(Object.keys(r.icons).map(s=>(o!==""?"@"+o+":":"")+n+":"+s))})}),i}let qt=!1;function Jn(e){return typeof e=="boolean"&&(qt=e),qt}function Wt(e){const t=typeof e=="string"?te(e,!0,qt):e;if(t){const i=it(t.provider,t.prefix),o=t.name;return i.icons[o]||(i.missing.has(o)?null:void 0)}}function Xn(e,t){const i=te(e,!0,qt);if(!i)return!1;const o=it(i.provider,i.prefix);return rs(o,i.name,t)}function Wi(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),qt&&!t&&!e.prefix){let n=!1;return Gn(e)&&(e.prefix="",Qn(e,(r,s)=>{s&&Xn(r,s)&&(n=!0)})),n}const i=e.prefix;if(!de({provider:t,prefix:i,name:"a"}))return!1;const o=it(t,i);return!!di(o,e)}function Yi(e){return!!Wt(e)}function ls(e){const t=Wt(e);return t?{...Kt,...t}:null}function as(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((n,r)=>n.provider!==r.provider?n.provider.localeCompare(r.provider):n.prefix!==r.prefix?n.prefix.localeCompare(r.prefix):n.name.localeCompare(r.name));let o={provider:"",prefix:"",name:""};return e.forEach(n=>{if(o.name===n.name&&o.prefix===n.prefix&&o.provider===n.provider)return;o=n;const r=n.provider,s=n.prefix,l=n.name,a=i[r]||(i[r]=Object.create(null)),c=a[s]||(a[s]=it(r,s));let h;l in c.icons?h=t.loaded:s===""||c.missing.has(l)?h=t.missing:h=t.pending;const d={provider:r,prefix:s,name:l};h.push(d)}),t}function Zn(e,t){e.forEach(i=>{const o=i.loaderCallbacks;o&&(i.loaderCallbacks=o.filter(n=>n.id!==t))})}function cs(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const o=e.provider,n=e.prefix;t.forEach(r=>{const s=r.icons,l=s.pending.length;s.pending=s.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(e.icons[c])s.loaded.push({provider:o,prefix:n,name:c});else if(e.missing.has(c))s.missing.push({provider:o,prefix:n,name:c});else return i=!0,!0;return!1}),s.pending.length!==l&&(i||Zn([e],r.id),r.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),r.abort))})}))}let hs=0;function us(e,t,i){const o=hs++,n=Zn.bind(null,i,o);if(!t.pending.length)return n;const r={id:o,icons:t,callback:e,abort:n};return i.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(r)}),n}const Ye=Object.create(null);function Qi(e,t){Ye[e]=t}function Qe(e){return Ye[e]||Ye[""]}function ds(e,t=!0,i=!1){const o=[];return e.forEach(n=>{const r=typeof n=="string"?te(n,t,i):n;r&&o.push(r)}),o}var ps={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function bs(e,t,i,o){const n=e.resources.length,r=e.random?Math.floor(Math.random()*n):e.index;let s;if(e.random){let y=e.resources.slice(0);for(s=[];y.length>1;){const O=Math.floor(Math.random()*y.length);s.push(y[O]),y=y.slice(0,O).concat(y.slice(O+1))}s=s.concat(y)}else s=e.resources.slice(r).concat(e.resources.slice(0,r));const l=Date.now();let a="pending",c=0,h,d=null,p=[],b=[];typeof o=="function"&&b.push(o);function m(){d&&(clearTimeout(d),d=null)}function v(){a==="pending"&&(a="aborted"),m(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,O){O&&(b=[]),typeof y=="function"&&b.push(y)}function C(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function A(){a="failed",b.forEach(y=>{y(void 0,h)})}function _(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,O,P){const F=O!=="success";switch(p=p.filter(S=>S!==y),a){case"pending":break;case"failed":if(F||!e.dataAfterTimeout)return;break;default:return}if(O==="abort"){h=P,A();return}if(F){h=P,p.length||(s.length?z():A());return}if(m(),_(),!e.random){const S=e.resources.indexOf(y.resource);S!==-1&&S!==e.index&&(e.index=S)}a="completed",b.forEach(S=>{S(P)})}function z(){if(a!=="pending")return;m();const y=s.shift();if(y===void 0){if(p.length){d=setTimeout(()=>{m(),a==="pending"&&(_(),A())},e.timeout);return}A();return}const O={status:"pending",resource:y,callback:(P,F)=>{$(O,P,F)}};p.push(O),c++,d=setTimeout(z,e.rotate),i(y,t,O.callback)}return setTimeout(z),C}function Kn(e){const t={...ps,...e};let i=[];function o(){i=i.filter(s=>s().status==="pending")}function n(s,l,a){const c=bs(t,s,l,(h,d)=>{o(),a&&a(h,d)});return i.push(c),c}function r(s){return i.find(l=>s(l))||null}return{query:n,find:r,setIndex:s=>{t.index=s},getIndex:()=>t.index,cleanup:o}}function pi(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const ke=Object.create(null),ae=["https://api.simplesvg.com","https://api.unisvg.com"],Ge=[];for(;ae.length>0;)ae.length===1||Math.random()>.5?Ge.push(ae.shift()):Ge.push(ae.pop());ke[""]=pi({resources:["https://api.iconify.design"].concat(Ge)});function Gi(e,t){const i=pi(t);return i===null?!1:(ke[e]=i,!0)}function Se(e){return ke[e]}function fs(){return Object.keys(ke)}function Ji(){}const De=Object.create(null);function ms(e){if(!De[e]){const t=Se(e);if(!t)return;const i=Kn(t),o={config:t,redundancy:i};De[e]=o}return De[e]}function to(e,t,i){let o,n;if(typeof e=="string"){const r=Qe(e);if(!r)return i(void 0,424),Ji;n=r.send;const s=ms(e);s&&(o=s.redundancy)}else{const r=pi(e);if(r){o=Kn(r);const s=e.resources?e.resources[0]:"",l=Qe(s);l&&(n=l.send)}}return!o||!n?(i(void 0,424),Ji):o.query(t,n,i)().abort}const Xi="iconify2",Yt="iconify",eo=Yt+"-count",Zi=Yt+"-version",io=36e5,gs=168,vs=50;function Je(e,t){try{return e.getItem(t)}catch{}}function bi(e,t,i){try{return e.setItem(t,i),!0}catch{}}function Ki(e,t){try{e.removeItem(t)}catch{}}function Xe(e,t){return bi(e,eo,t.toString())}function Ze(e){return parseInt(Je(e,eo))||0}const dt={local:!0,session:!0},no={local:new Set,session:new Set};let fi=!1;function ys(e){fi=e}let ce=typeof window>"u"?{}:window;function oo(e){const t=e+"Storage";try{if(ce&&ce[t]&&typeof ce[t].length=="number")return ce[t]}catch{}dt[e]=!1}function ro(e,t){const i=oo(e);if(!i)return;const o=Je(i,Zi);if(o!==Xi){if(o){const l=Ze(i);for(let a=0;a<l;a++)Ki(i,Yt+a.toString())}bi(i,Zi,Xi),Xe(i,0);return}const n=Math.floor(Date.now()/io)-gs,r=l=>{const a=Yt+l.toString(),c=Je(i,a);if(typeof c=="string"){try{const h=JSON.parse(c);if(typeof h=="object"&&typeof h.cached=="number"&&h.cached>n&&typeof h.provider=="string"&&typeof h.data=="object"&&typeof h.data.prefix=="string"&&t(h,l))return!0}catch{}Ki(i,a)}};let s=Ze(i);for(let l=s-1;l>=0;l--)r(l)||(l===s-1?(s--,Xe(i,s)):no[e].add(l))}function so(){if(!fi){ys(!0);for(const e in dt)ro(e,t=>{const i=t.data,o=t.provider,n=i.prefix,r=it(o,n);if(!di(r,i).length)return!1;const s=i.lastModified||-1;return r.lastModifiedCached=r.lastModifiedCached?Math.min(r.lastModifiedCached,s):s,!0})}}function _s(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const o in dt)ro(o,n=>{const r=n.data;return n.provider!==e.provider||r.prefix!==e.prefix||r.lastModified===t});return!0}function xs(e,t){fi||so();function i(o){let n;if(!dt[o]||!(n=oo(o)))return;const r=no[o];let s;if(r.size)r.delete(s=Array.from(r).shift());else if(s=Ze(n),s>=vs||!Xe(n,s+1))return;const l={cached:Math.floor(Date.now()/io),provider:e.provider,data:t};return bi(n,Yt+s.toString(),JSON.stringify(l))}t.lastModified&&!_s(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function tn(){}function ws(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,cs(e)}))}function $s(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:o}=e,n=e.iconsToLoad;delete e.iconsToLoad;let r;!n||!(r=Qe(i))||r.prepare(i,o,n).forEach(s=>{to(i,s,l=>{if(typeof l!="object")s.icons.forEach(a=>{e.missing.add(a)});else try{const a=di(e,l);if(!a.length)return;const c=e.pendingIcons;c&&a.forEach(h=>{c.delete(h)}),xs(e,l)}catch(a){console.error(a)}ws(e)})})}))}const mi=(e,t)=>{const i=ds(e,!0,Jn()),o=as(i);if(!o.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(o.loaded,o.missing,o.pending,tn)}),()=>{a=!1}}const n=Object.create(null),r=[];let s,l;return o.pending.forEach(a=>{const{provider:c,prefix:h}=a;if(h===l&&c===s)return;s=c,l=h,r.push(it(c,h));const d=n[c]||(n[c]=Object.create(null));d[h]||(d[h]=[])}),o.pending.forEach(a=>{const{provider:c,prefix:h,name:d}=a,p=it(c,h),b=p.pendingIcons||(p.pendingIcons=new Set);b.has(d)||(b.add(d),n[c][h].push(d))}),r.forEach(a=>{const{provider:c,prefix:h}=a;n[c][h].length&&$s(a,n[c][h])}),t?us(t,o,r):tn},Es=e=>new Promise((t,i)=>{const o=typeof e=="string"?te(e,!0):e;if(!o){i(e);return}mi([o||e],n=>{if(n.length&&o){const r=Wt(o);if(r){t({...Kt,...r});return}}i(e)})});function As(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function Cs(e,t){const i=typeof e=="string"?te(e,!0,!0):null;if(!i){const r=As(e);return{value:e,data:r}}const o=Wt(i);if(o!==void 0||!i.prefix)return{value:e,name:i,data:o};const n=mi([i],()=>t(e,i,Wt(i)));return{value:e,name:i,loading:n}}function Ue(e){return e.hasAttribute("inline")}let lo=!1;try{lo=navigator.vendor.indexOf("Apple")===0}catch{}function ks(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(lo||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const Ss=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Os=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function Ke(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const o=e.split(Ss);if(o===null||!o.length)return e;const n=[];let r=o.shift(),s=Os.test(r);for(;;){if(s){const l=parseFloat(r);isNaN(l)?n.push(r):n.push(Math.ceil(l*t*i)/i)}else n.push(r);if(r=o.shift(),r===void 0)return n.join("");s=!s}}function Ts(e,t="defs"){let i="";const o=e.indexOf("<"+t);for(;o>=0;){const n=e.indexOf(">",o),r=e.indexOf("</"+t);if(n===-1||r===-1)break;const s=e.indexOf(">",r);if(s===-1)break;i+=e.slice(n+1,r).trim(),e=e.slice(0,o).trim()+e.slice(s+1)}return{defs:i,content:e}}function zs(e,t){return e?"<defs>"+e+"</defs>"+t:t}function Ps(e,t,i){const o=Ts(e);return zs(o.defs,t+o.content+i)}const js=e=>e==="unset"||e==="undefined"||e==="none";function ao(e,t){const i={...Kt,...e},o={...Wn,...t},n={left:i.left,top:i.top,width:i.width,height:i.height};let r=i.body;[i,o].forEach(v=>{const g=[],C=v.hFlip,A=v.vFlip;let _=v.rotate;C?A?_+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):A&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(_<0&&(_-=Math.floor(_/4)*4),_=_%4,_){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}_%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(r=Ps(r,'<g transform="'+g.join(" ")+'">',"</g>"))});const s=o.width,l=o.height,a=n.width,c=n.height;let h,d;s===null?(d=l===null?"1em":l==="auto"?c:l,h=Ke(d,a/c)):(h=s==="auto"?a:s,d=l===null?Ke(h,c/a):l==="auto"?c:l);const p={},b=(v,g)=>{js(g)||(p[v]=g.toString())};b("width",h),b("height",d);const m=[n.left,n.top,a,c];return p.viewBox=m.join(" "),{attributes:p,viewBox:m,body:r}}function gi(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const o in t)i+=" "+o+'="'+t[o]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function Ls(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ms(e){return"data:image/svg+xml,"+Ls(e)}function co(e){return'url("'+Ms(e)+'")'}const Rs=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let we=Rs();function Hs(e){we=e}function Bs(){return we}function Ns(e,t){const i=Se(e);if(!i)return 0;let o;if(!i.maxURL)o=0;else{let n=0;i.resources.forEach(s=>{n=Math.max(n,s.length)});const r=t+".json?icons=";o=i.maxURL-n-i.path.length-r.length}return o}function Is(e){return e===404}const Ds=(e,t,i)=>{const o=[],n=Ns(e,t),r="icons";let s={type:r,provider:e,prefix:t,icons:[]},l=0;return i.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(o.push(s),s={type:r,provider:e,prefix:t,icons:[]},l=a.length),s.icons.push(a)}),o.push(s),o};function Us(e){if(typeof e=="string"){const t=Se(e);if(t)return t.path}return"/"}const Fs=(e,t,i)=>{if(!we){i("abort",424);return}let o=Us(t.provider);switch(t.type){case"icons":{const r=t.prefix,s=t.icons.join(","),l=new URLSearchParams({icons:s});o+=r+".json?"+l.toString();break}case"custom":{const r=t.uri;o+=r.slice(0,1)==="/"?r.slice(1):r;break}default:i("abort",400);return}let n=503;we(e+o).then(r=>{const s=r.status;if(s!==200){setTimeout(()=>{i(Is(s)?"abort":"next",s)});return}return n=501,r.json()}).then(r=>{if(typeof r!="object"||r===null){setTimeout(()=>{r===404?i("abort",r):i("next",n)});return}setTimeout(()=>{i("success",r)})}).catch(()=>{i("next",n)})},Vs={prepare:Ds,send:Fs};function en(e,t){switch(e){case"local":case"session":dt[e]=t;break;case"all":for(const i in dt)dt[i]=t;break}}const Fe="data-style";let ho="";function qs(e){ho=e}function nn(e,t){let i=Array.from(e.childNodes).find(o=>o.hasAttribute&&o.hasAttribute(Fe));i||(i=document.createElement("style"),i.setAttribute(Fe,Fe),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+ho}function uo(){Qi("",Vs),Jn(!0);let e;try{e=window}catch{}if(e){if(so(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(o=>{try{(typeof o!="object"||o===null||o instanceof Array||typeof o.icons!="object"||typeof o.prefix!="string"||!Wi(o))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const o="IconifyProviders["+i+"] is invalid.";try{const n=t[i];if(typeof n!="object"||!n||n.resources===void 0)continue;Gi(i,n)||console.error(o)}catch{console.error(o)}}}}return{enableCache:t=>en(t,!0),disableCache:t=>en(t,!1),iconLoaded:Yi,iconExists:Yi,getIcon:ls,listIcons:ss,addIcon:Xn,addCollection:Wi,calculateSize:Ke,buildIcon:ao,iconToHTML:gi,svgToURL:co,loadIcons:mi,loadIcon:Es,addAPIProvider:Gi,appendCustomStyle:qs,_api:{getAPIConfig:Se,setAPIModule:Qi,sendAPIQuery:to,setFetch:Hs,getFetch:Bs,listAPIProviders:fs}}}const ti={"background-color":"currentColor"},po={"background-color":"transparent"},on={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},rn={"-webkit-mask":ti,mask:ti,background:po};for(const e in rn){const t=rn[e];for(const i in on)t[e+"-"+i]=on[i]}function sn(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Ws(e,t,i){const o=document.createElement("span");let n=e.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const r=e.attributes,s=gi(n,{...r,width:t.width+"",height:t.height+""}),l=co(s),a=o.style,c={"--svg":l,width:sn(r.width),height:sn(r.height),...i?ti:po};for(const h in c)a.setProperty(h,c[h]);return o}let It;function Ys(){try{It=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{It=null}}function Qs(e){return It===void 0&&Ys(),It?It.createHTML(e):e}function Gs(e){const t=document.createElement("span"),i=e.attributes;let o="";i.width||(o="width: inherit;"),i.height||(o+="height: inherit;"),o&&(i.style=o);const n=gi(e.body,i);return t.innerHTML=Qs(n),t.firstChild}function ei(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function ln(e,t){const i=t.icon.data,o=t.customisations,n=ao(i,o);o.preserveAspectRatio&&(n.attributes.preserveAspectRatio=o.preserveAspectRatio);const r=t.renderedMode;let s;switch(r){case"svg":s=Gs(n);break;default:s=Ws(n,{...Kt,...i},r==="mask")}const l=ei(e);l?s.tagName==="SPAN"&&l.tagName===s.tagName?l.setAttribute("style",s.getAttribute("style")):e.replaceChild(s,l):e.appendChild(s)}function an(e,t,i){const o=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:o}}function Js(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const o=t.get(e);if(o)return o;const n=["icon","mode","inline","observe","width","height","rotate","flip"],r=class extends i{constructor(){super(),ct(this,"_shadowRoot"),ct(this,"_initialised",!1),ct(this,"_state"),ct(this,"_checkQueued",!1),ct(this,"_connected",!1),ct(this,"_observer",null),ct(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Ue(this);nn(l,a),this._state=an({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Ue(this),c=this._state;a!==c.inline&&(c.inline=a,nn(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Ue(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}ln(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),h=Vi(this);(l.attrMode!==c||Kr(l.customisations,h)||!ei(this._shadowRoot))&&this._renderIcon(l.icon,h,c)}_iconChanged(l){const a=Cs(l,(c,h,d)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const b={value:c,name:h,data:d};b.data?this._gotIconData(b):p.icon=b});a.data?this._gotIconData(a):this._state=an(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=ei(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Vi(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const h=ks(l.data.body,c),d=this._state.inline;ln(this._shadowRoot,this._state={rendered:!0,icon:l,inline:d,customisations:a,attrMode:c,renderedMode:h})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in r.prototype||Object.defineProperty(r.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const s=uo();for(const l in s)r[l]=r.prototype[l]=s[l];return t.define(e,r),r}Js()||uo();var Xs=Object.defineProperty,U=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Xs(t,i,n),n},he;const B=(he=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._parent=K(),this._tooltip=K(),this._contextMenu=K(),this._mouseLeave=!1,this.onWindowMouseUp=e=>{const{value:t}=this._contextMenu;!this.contains(e.target)&&t&&(t.visible=!1)},this.mouseLeave=!0,this.addEventListener("click",e=>e.stopPropagation())}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&Tn(e,t,{placement:"bottom",middleware:[gn(10),On(),Sn(),kn({padding:5})]}).then(i=>{const{x:o,y:n}=i;Object.assign(t.style,{left:`${o}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}onChildrenClick(e){e.stopPropagation();const{value:t}=this._contextMenu;t&&(t.visible=!t.visible)}onSlotChange(e){const{value:t}=this._contextMenu,i=e.target.assignedElements();for(const o of i){if(!(o instanceof he)){o.remove(),console.warn("Only bim-button is allowed inside bim-button. Child has been removed.");continue}o.addEventListener("click",()=>t==null?void 0:t.updatePosition())}this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){const e=f`
      <div ${Y(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?f`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?f`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=this.children.length>0;return f`
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
      <div ${Y(this._parent)} class="parent">
        ${this.label||this.icon?f`
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
        ${this.tooltipTitle||this.tooltipText?e:null}
        ${t?f`
              <div class="children" @click=${this.onChildrenClick}>
                <bim-icon .icon=${"ic:round-plus"}></bim-icon>
              </div>
            `:null}
        <bim-context-menu
          ${Y(this._contextMenu)}
          style="row-gap: var(--bim-ui_size-4xs)"
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </bim-context-menu>
      </div>
    `}},he.styles=E`
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
  `,he);U([u({type:String,reflect:!0})],B.prototype,"label");U([u({type:Boolean,attribute:"label-hidden",reflect:!0})],B.prototype,"labelHidden");U([u({type:Boolean,reflect:!0})],B.prototype,"active");U([u({type:Boolean,reflect:!0,attribute:"disabled"})],B.prototype,"disabled");U([u({type:String,reflect:!0})],B.prototype,"icon");U([u({type:Boolean,reflect:!0})],B.prototype,"vertical");U([u({type:Number,attribute:"tooltip-time",reflect:!0})],B.prototype,"tooltipTime");U([u({type:Boolean,attribute:"tooltip-visible",reflect:!0})],B.prototype,"tooltipVisible");U([u({type:String,attribute:"tooltip-title",reflect:!0})],B.prototype,"tooltipTitle");U([u({type:String,attribute:"tooltip-text",reflect:!0})],B.prototype,"tooltipText");let Zs=B;var Ks=Object.defineProperty,ee=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Ks(t,i,n),n};const bo=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return f`
      <div class="parent">
        ${this.label?f`<bim-label
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
    `}};bo.styles=E`
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
  `;let Ot=bo;ee([u({type:String,reflect:!0})],Ot.prototype,"icon");ee([u({type:String,reflect:!0})],Ot.prototype,"name");ee([u({type:String,reflect:!0})],Ot.prototype,"label");ee([u({type:Boolean,reflect:!0})],Ot.prototype,"checked");ee([u({type:Boolean,reflect:!0})],Ot.prototype,"inverted");var tl=Object.defineProperty,Tt=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&tl(t,i,n),n};const fo=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=K(),this._textInput=K(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const i=t.target;this.opacity=i.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:i,opacity:o}=t;this.color=i,o&&(this.opacity=o)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:i}=this._colorInput;i&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:i}=this._textInput;if(!i)return;const{value:o}=i;let n=o.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),i.value=n.slice(0,7),i.value.length===7&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return f`
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
                ${Y(this._colorInput)}
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
                ${Y(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?f`<bim-number-input
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
    `}};fo.styles=E`
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
  `;let ft=fo;Tt([u({type:String,reflect:!0})],ft.prototype,"name");Tt([u({type:String,reflect:!0})],ft.prototype,"label");Tt([u({type:String,reflect:!0})],ft.prototype,"icon");Tt([u({type:Boolean,reflect:!0})],ft.prototype,"vertical");Tt([u({type:Number,reflect:!0})],ft.prototype,"opacity");Tt([u({type:String,reflect:!0})],ft.prototype,"color");const el=E`
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
`,il=E`
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
`,mt={scrollbar:el,globalStyles:il};var nl=Object.defineProperty,ol=Object.getOwnPropertyDescriptor,rl=(e,t,i,o)=>{for(var n=ol(t,i),r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&nl(t,i,n),n};const mo=class extends w{constructor(){super(...arguments),this._visible=!1,this._middleware={name:"middleware",async fn(t){const{right:i,top:o}=await oi(t);return t.x-=Math.sign(i)===1?i+5:0,t.y-=Math.sign(o)===1?o+5:0,t}}}get visible(){return this._visible}set visible(t){this._visible=t,t&&this.updatePosition()}async updatePosition(t){const i=t||this.parentNode;if(!i){this.visible=!1,console.warn("No target element found for context-menu.");return}const o=await Tn(i,this,{placement:"right",middleware:[gn(10),On(),Sn(),kn({padding:5}),this._middleware]}),{x:n,y:r}=o;this.style.left=`${n}px`,this.style.top=`${r}px`}render(){return f` <slot></slot> `}};mo.styles=[mt.scrollbar,E`
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
    `];let go=mo;rl([u({type:Boolean,reflect:!0})],go.prototype,"visible");class sl extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const o of t)this.elements.add(o);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const o of i)o.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const o=i[0];if(!o.isIntersecting)return;const n=o.target;t.unobserve(n);const r=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,s=[...this.elements][r];s&&(this.visibleElements=[...this.visibleElements,s],t.observe(s))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,o=[...this.elements][i];o&&t.observe(o)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const o=document.createDocumentFragment();if(t.length===0)return ve(t(),o),o.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let n=i;const r=t,s=l=>(n={...n,...l},ve(r(n),o),n);return s(i),[o.firstElementChild,s]}}const $e=(e,t=!0)=>{let i={};for(const o of e.children){const n=o,r=n.getAttribute("name")||n.getAttribute("label");if(r){if("value"in n){const s=n.value;if(typeof s=="object"&&!Array.isArray(s)&&Object.keys(s).length===0)continue;i[r]=n.value}else if(t){const s=$e(n);if(Object.keys(s).length===0)continue;i[r]=s}}else t&&(i={...i,...$e(n)})}return i},Oe=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,ll=["=",">",">=","<","<=","?","/","#"];function cn(e){const t=ll.filter(s=>e.split(s).length===2)[0],i=e.split(t).map(s=>s.trim()),[o,n]=i,r=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):Oe(n);return{key:o,condition:t,value:r}}const ii=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(o=>o.trim());for(const o of i){const n=!o.startsWith("(")&&!o.endsWith(")"),r=o.startsWith("(")&&o.endsWith(")");if(n){const s=cn(o);t.push(s)}if(r){const s={operator:"&",queries:o.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=cn(l);return a>0&&(c.operator="&"),c})};t.push(s)}}return t}catch{return null}},hn=(e,t,i)=>{let o=!1;switch(t){case"=":o=e===i;break;case"?":o=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(o=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(o=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(o=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(o=e>=i);break;case"/":o=String(e).startsWith(String(i));break}return o};var al=Object.defineProperty,cl=Object.getOwnPropertyDescriptor,ot=(e,t,i,o)=>{for(var n=o>1?void 0:o?cl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&al(t,i,n),n};const vo=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Oe(this.label):this.label}set value(t){this._value=t}render(){return f`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?f` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?f`<bim-checkbox
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
        ${!this.checkbox&&!this.noMark&&this.checked?f`<svg
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
    `}};vo.styles=E`
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
  `;let T=vo;ot([u({type:String,reflect:!0})],T.prototype,"img",2);ot([u({type:String,reflect:!0})],T.prototype,"label",2);ot([u({type:String,reflect:!0})],T.prototype,"icon",2);ot([u({type:Boolean,reflect:!0})],T.prototype,"checked",2);ot([u({type:Boolean,reflect:!0})],T.prototype,"checkbox",2);ot([u({type:Boolean,attribute:"no-mark",reflect:!0})],T.prototype,"noMark",2);ot([u({converter:{fromAttribute(e){return e&&Oe(e)}}})],T.prototype,"value",1);ot([u({type:Boolean,reflect:!0})],T.prototype,"vertical",2);var hl=Object.defineProperty,ul=Object.getOwnPropertyDescriptor,rt=(e,t,i,o)=>{for(var n=o>1?void 0:o?ul(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&hl(t,i,n),n};const yo=class extends sl{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._inputContainer=K(),this._listElement=K(),this._visible=!1,this._value=[],this.onValueChange=new Event("change"),this.onWindowMouseUp=t=>{this.visible&&(this.contains(t.target)||(this.visible=!1))},this.onOptionClick=t=>{const i=t.target,o=this._value.includes(i);if(!this.multiple&&!this.required&&!o)this._value=[i];else if(!this.multiple&&!this.required&&o)this._value=[];else if(!this.multiple&&this.required&&!o)this._value=[i];else if(this.multiple&&!this.required&&!o)this._value=[...this._value,i];else if(this.multiple&&!this.required&&o)this._value=this._value.filter(n=>n!==i);else if(this.multiple&&this.required&&!o)this._value=[...this._value,i];else if(this.multiple&&this.required&&o){const n=this._value.filter(r=>r!==i);n.length!==0&&(this._value=n)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){this._visible=t,t||this.resetVisibleElements()}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const i=[];for(const o of t){const n=this.findOption(o);if(n&&(i.push(n),!this.multiple&&Object.keys(t).length>1))break}this._value=i,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return this._value.filter(t=>t instanceof T&&t.checked).map(t=>t.value)}get _options(){const t=[...this.elements];for(const i of this.children)i instanceof T&&t.push(i);return t}onSlotChange(t){const i=t.target.assignedElements();this.observe(i);for(const o of i){if(!(o instanceof T)){o.remove();continue}o.removeEventListener("click",this.onOptionClick),o.addEventListener("click",this.onOptionClick)}}updateOptionsState(){for(const t of this._options)t instanceof T&&(this._value.includes(t)?t.checked=!0:t.checked=!1)}findOption(t){return this._options.find(i=>i instanceof T?i.label===t||i.value===t:!1)}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}firstUpdated(){for(const t of this.children)t instanceof T&&t.checked&&this._value.push(t)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){let t,i,o;if(this._value.length===0)t="Select an option...";else if(this._value.length===1){const n=this._value[0];t=(n==null?void 0:n.label)||(n==null?void 0:n.value),i=n==null?void 0:n.img,o=n==null?void 0:n.icon}else t=`Multiple (${this._value.length})`;return f`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div
          ${Y(this._inputContainer)}
          class="input"
          @click=${()=>this.visible=!this.visible}
        >
          <bim-label
            label=${t}
            .img=${i}
            .icon=${o}
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
        <bim-context-menu ${Y(this._listElement)} .visible=${this.visible}>
          <slot @slotchange=${this.onSlotChange}></slot>
          ${this.visibleElements.map(n=>n)}
        </bim-context-menu>
      </bim-input>
    `}};yo.styles=[mt.scrollbar,E`
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
    `];let J=yo;rt([u({type:String,reflect:!0})],J.prototype,"name",2);rt([u({type:String,reflect:!0})],J.prototype,"icon",2);rt([u({type:String,reflect:!0})],J.prototype,"label",2);rt([u({type:Boolean,reflect:!0})],J.prototype,"multiple",2);rt([u({type:Boolean,reflect:!0})],J.prototype,"required",2);rt([u({type:Boolean,reflect:!0})],J.prototype,"vertical",2);rt([u({type:Boolean,reflect:!0})],J.prototype,"visible",1);rt([Zt()],J.prototype,"_value",2);var dl=Object.defineProperty,_o=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&dl(t,i,n),n};const xo=class extends w{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(t){const i=t.split(`
`).map(o=>o.trim()).map(o=>o.split('"')[1]).filter(o=>o!==void 0).flatMap(o=>o.split(/\s+/));return[...new Set(i)].filter(o=>o!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const t=this.layouts[this.layout],i=this.getUniqueAreasFromTemplate(t.template).map(o=>{const n=t.elements[o];return n&&(n.style.gridArea=o),n}).filter(o=>!!o);this.style.gridTemplate=t.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...i)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return f`<slot></slot>`}};xo.styles=E`
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
  `;let vi=xo;_o([u({type:Boolean,reflect:!0})],vi.prototype,"floating");_o([u({type:String,reflect:!0})],vi.prototype,"layout");const ni=class extends w{render(){return f`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};ni.styles=E`
    :host {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
    }

    iconify-icon {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
      color: var(--bim-icon--c);
    }
  `,ni.properties={icon:{type:String}};let pl=ni;var bl=Object.defineProperty,Te=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&bl(t,i,n),n};const wo=class extends w{constructor(){super(),this.onValueChange=new Event("change"),this.vertical=!1}get value(){const t={};for(const i of this.children){const o=i;"value"in o?t[o.name||o.label]=o.value:"checked"in o&&(t[o.name||o.label]=o.checked)}return t}set value(t){const i=[...this.children];for(const o in t){const n=i.find(l=>{const a=l;return a.name===o||a.label===o});if(!n)continue;const r=n,s=t[o];typeof s=="boolean"?r.checked=s:r.value=s}}render(){return f`
      <div class="parent">
        ${this.label||this.icon?f`<bim-label
              .label=${this.label}
              .icon=${this.icon}
            ></bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};wo.styles=E`
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
  `;let ie=wo;Te([u({type:String,reflect:!0})],ie.prototype,"name");Te([u({type:String,reflect:!0})],ie.prototype,"label");Te([u({type:String,reflect:!0})],ie.prototype,"icon");Te([u({type:Boolean,reflect:!0})],ie.prototype,"vertical");var fl=Object.defineProperty,zt=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&fl(t,i,n),n};const $o=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.label?Oe(this.label):this.label}render(){return f`
      <div class="parent" .title=${this.label??""}>
        ${this.img?f`<img .src=${this.img} .alt=${this.label||""} />`:null}
        ${!this.iconHidden&&this.icon?f`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        ${!this.labelHidden&&this.label?f`<label>${this.label}</label>`:null}
      </div>
    `}};$o.styles=E`
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
  `;let gt=$o;zt([u({type:String,reflect:!0})],gt.prototype,"label");zt([u({type:String,reflect:!0})],gt.prototype,"img");zt([u({type:Boolean,attribute:"label-hidden",reflect:!0})],gt.prototype,"labelHidden");zt([u({type:String,reflect:!0})],gt.prototype,"icon");zt([u({type:Boolean,attribute:"icon-hidden",reflect:!0})],gt.prototype,"iconHidden");zt([u({type:Boolean,reflect:!0})],gt.prototype,"vertical");var ml=Object.defineProperty,gl=Object.getOwnPropertyDescriptor,H=(e,t,i,o)=>{for(var n=o>1?void 0:o?gl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&ml(t,i,n),n};const Eo=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=K(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:i}=this._input;i&&this.setValue(i.value)}setValue(t){const{value:i}=this._input;let o=t;if(o=o.replace(/[^0-9.-]/g,""),o=o.replace(/(\..*)\./g,"$1"),o.endsWith(".")||(o.lastIndexOf("-")>0&&(o=o[0]+o.substring(1).replace(/-/g,"")),o==="-"||o==="-0"))return;let n=Number(o);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,i&&(i.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:i}=t,o=this.value;let n=!1;const r=a=>{var c;n=!0;const{clientX:h}=a,d=this.step??1,p=((c=d.toString().split(".")[1])==null?void 0:c.length)||0,b=1/(this.sensitivity??1),m=(h-i)/b;if(Math.floor(Math.abs(m))!==Math.abs(m))return;const v=o+m*d;this.setValue(v.toFixed(p))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},l=()=>{document.removeEventListener("mousemove",r),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const i=o=>{o.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=f`
      ${this.pref||this.icon?f`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .label=${this.pref}
            .icon=${this.icon}
          ></bim-label>`:null}
      <input
        ${Y(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${l=>l.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.suffix?f`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .label=${this.suffix}
          ></bim-label>`:null}
    `,i=this.min??-1/0,o=this.max??1/0,n=100*(this.value-i)/(o-i),r=f`
      <style>
        .slider-indicator {
          width: ${`${n}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?f`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .label=${`${this.pref}: `}
              .icon=${this.icon}
            ></bim-label>`:null}
        <bim-label
          style="z-index: 1;"
          .label=${this.value.toString()}
        ></bim-label>
        ${this.suffix?f`<bim-label
              style="z-index: 1;"
              .label=${this.suffix}
            ></bim-label>`:null}
      </div>
    `,s=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return f`
      <bim-input
        title=${s}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?r:t}
      </bim-input>
    `}};Eo.styles=E`
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
  `;let L=Eo;H([u({type:String,reflect:!0})],L.prototype,"name",2);H([u({type:String,reflect:!0})],L.prototype,"icon",2);H([u({type:String,reflect:!0})],L.prototype,"label",2);H([u({type:String,reflect:!0})],L.prototype,"pref",2);H([u({type:Number,reflect:!0})],L.prototype,"min",2);H([u({type:Number,reflect:!0})],L.prototype,"value",1);H([u({type:Number,reflect:!0})],L.prototype,"step",2);H([u({type:Number,reflect:!0})],L.prototype,"sensitivity",2);H([u({type:Number,reflect:!0})],L.prototype,"max",2);H([u({type:String,reflect:!0})],L.prototype,"suffix",2);H([u({type:Boolean,reflect:!0})],L.prototype,"vertical",2);H([u({type:Boolean,reflect:!0})],L.prototype,"slider",2);var vl=Object.defineProperty,yl=Object.getOwnPropertyDescriptor,ze=(e,t,i,o)=>{for(var n=o>1?void 0:o?yl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&vl(t,i,n),n};const Ao=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return $e(this)}set value(t){const i=[...this.children];for(const o in t){const n=i.find(s=>{const l=s;return l.name===o||l.label===o});if(!n)continue;const r=n;r.value=t[o]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const i of t)i.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const i of t)i.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,f`
      <div class="parent">
        ${this.label||this.name||this.icon?f`<bim-label
              .label=${this.label||this.name}
              .icon=${this.icon}
            ></bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};Ao.styles=[mt.scrollbar,E`
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
    `];let ne=Ao;ze([u({type:String,reflect:!0})],ne.prototype,"icon",2);ze([u({type:String,reflect:!0})],ne.prototype,"name",2);ze([u({type:String,reflect:!0})],ne.prototype,"label",2);ze([u({type:Boolean,reflect:!0})],ne.prototype,"hidden",1);var _l=Object.defineProperty,oe=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&_l(t,i,n),n};const Co=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change")}get value(){return $e(this)}set value(t){const i=[...this.children];for(const o in t){const n=i.find(s=>{const l=s;return l.name===o||l.label===o});if(!n)continue;const r=n;r.value=t[o]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,i=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,o=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?i:o,r=f`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?f`<bim-label
              .label=${this.label||this.name}
              .icon=${this.icon}
            ></bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return f`
      <div class="parent">
        ${t?r:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};Co.styles=[mt.scrollbar,E`
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
    `];let Pt=Co;oe([u({type:String,reflect:!0})],Pt.prototype,"icon");oe([u({type:String,reflect:!0})],Pt.prototype,"label");oe([u({type:String,reflect:!0})],Pt.prototype,"name");oe([u({type:Boolean,reflect:!0})],Pt.prototype,"fixed");oe([u({type:Boolean,reflect:!0})],Pt.prototype,"collapsed");var xl=Object.defineProperty,re=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&xl(t,i,n),n};const ko=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const i of this.children)i instanceof T&&(i.checked=i===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const i=this.findOption(t);if(i){for(const o of this._options)o.checked=o===i;this._value=i,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const i=t.target.assignedElements();for(const o of i)o instanceof T&&(o.noMark=!0,o.removeEventListener("click",this.onOptionClick),o.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(i=>i instanceof T?i.label===t||i.value===t:!1)}firstUpdated(){const t=[...this.children].find(i=>i instanceof T&&i.checked);t&&(this._value=t)}render(){return f`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};ko.styles=E`
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
  `;let jt=ko;re([u({type:String,reflect:!0})],jt.prototype,"name");re([u({type:String,reflect:!0})],jt.prototype,"icon");re([u({type:String,reflect:!0})],jt.prototype,"label");re([u({type:Boolean,reflect:!0})],jt.prototype,"vertical");re([Zt()],jt.prototype,"_value");var wl=Object.defineProperty,$l=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&wl(t,i,n),n};const So=class extends w{constructor(){super(...arguments),this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return f`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};So.styles=E`
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
  `;let Oo=So;$l([u({type:String,reflect:!0})],Oo.prototype,"column");var El=Object.defineProperty,Al=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&El(t,i,n),n};const To=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,i=!1){for(const o of this._groups)o.childrenHidden=typeof t>"u"?!o.childrenHidden:!t,i&&o.toggleChildren(t,i)}render(){return this._groups=[],f`
      ${this.data.map(t=>{const i=document.createElement("bim-table-group");return this._groups.push(i),i.table=this.table,i.data=t,i})}
    `}};To.styles=E`
    :host {
      position: relative;
      grid-area: Children;
    }

    :host([hidden]) {
      display: none;
    }
  `;let zo=To;Al([u({type:Array,attribute:!1})],zo.prototype,"data");var Cl=Object.defineProperty,kl=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Cl(t,i,n),n};const Po=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,i=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,i&&this._children.toggleGroups(t,i))}render(){var t,i;const o=((t=this.table)==null?void 0:t.getGroupIndentation(this.data))??0,n=f`
      <style>
        .branch-vertical {
          left: ${o+.5625}rem;
        }
      </style>
      <div class="branch branch-vertical"></div>
    `,r=document.createElement("div");r.classList.add("branch","branch-horizontal"),r.style.left=`${o-1+.5625}rem`;const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("height","9.5"),s.setAttribute("width","7.5"),s.setAttribute("viewBox","0 0 4.6666672 7.3333333");const l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),s.append(l);const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","6.5"),a.setAttribute("width","9.5"),a.setAttribute("viewBox","0 0 5.9111118 5.0175439");const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),a.append(c);const h=document.createElement("div");h.addEventListener("click",()=>this.toggleChildren()),h.classList.add("caret"),h.style.left=`${.125+o}rem`,this.childrenHidden?h.append(s):h.append(a);const d=document.createElement("bim-table-row");d.table=this.table,d.data=this.data.data,(i=this.table)==null||i.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:d}})),this.data.children&&d.append(h),o!==0&&(!this.data.children||this.childrenHidden)&&d.append(r);let p;return this.data.children&&(p=document.createElement("bim-table-children"),this._children=p,p.table=this.table,p.data=this.data.children),f`
      <div class="parent">
        ${this.data.children&&!this.childrenHidden?n:null}
        ${d} ${this.childrenHidden?null:p}
      </div>
    `}};Po.styles=E`
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
  `;let jo=Po;kl([u({type:Boolean,attribute:"children-hidden",reflect:!0})],jo.prototype,"childrenHidden");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const un=e=>Nr(e)?e._$litType$.h:e.strings,Sl=Un(class extends Fn{constructor(e){super(e),this.et=new WeakMap}render(e){return[e]}update(e,[t]){const i=Ni(this.it)?un(this.it):null,o=Ni(t)?un(t):null;if(i!==null&&(o===null||i!==o)){const n=Fi(e).pop();let r=this.et.get(i);if(r===void 0){const s=document.createDocumentFragment();r=ve(k,s),r.setConnected(!1),this.et.set(i,r)}Ui(r,[n]),Di(r,void 0,n)}if(o!==null){if(i===null||i!==o){const n=this.et.get(o);if(n!==void 0){const r=Fi(n).pop();Ur(e),Di(e,void 0,r),Ui(e,[r])}}this.it=t}else this.it=void 0;return this.render(t)}});var Ol=Object.defineProperty,Pe=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Ol(t,i,n),n};const Lo=class extends w{constructor(){super(),this.data={},this._table=this.closest("bim-table"),this.onTableIndentationColorChange=t=>{var i;if(!this.table)return;const o=t.detail,{indentationLevel:n,color:r}=o;((i=this.table)==null?void 0:i.getRowIndentation(this.data))===n&&(this.style.backgroundColor=r)},this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"10px"}),this.columns=[],this.isHeader=!1}get _columnNames(){return this.columns.map(t=>t.name)}get _columnWidths(){return this.columns.map(t=>t.width)}set table(t){this._table&&(this.columns=[],this._table.removeEventListener("columnschange",this.onTableColumnsChange)),this._table=t,this._table&&(this.columns=this._table.columns,this._table.addEventListener("columnschange",this.onTableColumnsChange),this._table.addEventListener("indentation",this.onTableIndentationColorChange))}get table(){return this._table}connectedCallback(){super.connectedCallback(),this._observer.observe(this)}compute(){var t,i;const o=((t=this.table)==null?void 0:t.getRowIndentation(this.data))??0,n=this.isHeader?this.data:((i=this.table)==null?void 0:i.computeRowDeclaration(this.data))??this.data,r=[];for(const s in n){const l=n[s];let a;typeof l=="string"||typeof l=="boolean"||typeof l=="number"?a=f`<bim-label label="${l}"></bim-label>`:a=l;const c=this._columnNames.indexOf(s)===0,h=`
        ${c&&!this.isHeader?"justify-content: normal":""};
        ${c&&!this.isHeader?`margin-left: ${o+.125}rem`:""}
      `,d=f`
        <bim-table-cell ${Y(p=>{if(!p)return;const b=p;b.rowData=this.data,setTimeout(()=>{var m;(m=this.table)==null||m.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:b}}))})})} style="${h}" .column=${s}
          >${a}</bim-table-cell
        >
      `;r.push(d)}return f`
      <style>
        :host {
          grid-template-areas: "${this._columnNames.join(" ")}";
          grid-template-columns: ${this._columnWidths.join(" ")};
        }
      </style>
      ${r}
      <slot></slot>
    `}render(){return f`${Sl(this._intersecting?this.compute():f``)}`}};Lo.styles=E`
    :host {
      position: relative;
      grid-area: Data;
      display: grid;
      min-height: 2.25rem;
      /* border-bottom: 1px solid var(--bim-ui_bg-contrast-20); */
    }
  `;let se=Lo;Pe([u({type:Array,attribute:!1})],se.prototype,"columns");Pe([u({type:Object,attribute:!1})],se.prototype,"data");Pe([u({type:Boolean,attribute:"is-header",reflect:!0})],se.prototype,"isHeader");Pe([Zt()],se.prototype,"_intersecting");var Tl=Object.defineProperty,zl=Object.getOwnPropertyDescriptor,vt=(e,t,i,o)=>{for(var n=o>1?void 0:o?zl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Tl(t,i,n),n};const Mo=class extends w{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.definition={},this._stringFilterFunction=(t,i)=>Object.values(i.data).some(o=>String(o).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,i)=>{let o=!1;const n=ii(t)??[];for(const r of n){if("queries"in r){o=!1;break}const{condition:s,value:l}=r;let{key:a}=r;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,o=Object.keys(i.data).filter(h=>h.includes(c)).map(h=>hn(i.data[h],s,l)).some(h=>h)}else o=hn(i.data[a],s,l);if(!o)break}return o}}set columns(t){const i=[];for(const o of t){const n=typeof o=="string"?{name:o,width:`minmax(${this.minColWidth}, 1fr)`}:o;i.push(n)}this._columns=i,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const t={};for(const i of this.columns)if(typeof i=="string")t[i]=i;else{const{name:o}=i;t[o]=o}return t}get value(){return this.queryString?this._filteredData:this.data}set queryString(t){const i=t&&t.trim()!==""?t.trim():null;this._queryString=i,i?(ii(i)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(i)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(i)),this.preserveStructureOnFilter&&(this._expandedBeforeSearch===void 0&&(this._expandedBeforeSearch=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeSearch!==void 0&&(this.expanded=this._expandedBeforeSearch,this._expandedBeforeSearch=void 0),this._filteredData=this.data)}get queryString(){return this._queryString}set data(t){this._data=t,this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}computeMissingColumns(t){let i=!1;for(const o of t){const{children:n,data:r}=o;for(const s in r)this._columns.map(l=>typeof l=="string"?l:l.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),i=!0);if(n){const s=this.computeMissingColumns(n);s&&!i&&(i=s)}}return i}generateText(t="comma",i=this.value,o="",n=!0){const r=this._textDelimiters[t];let s="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${r}`);const a=`${l.join(r)}
`;s+=a}for(const[a,c]of i.entries()){const{data:h,children:d}=c,p=this.indentationInText?`${o}${a+1}${r}`:"",b=l.map(v=>h[v]??""),m=`${p}${b.join(r)}
`;s+=m,d&&(s+=this.generateText(t,c.children,`${o}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}computeRowDeclaration(t){const i={};for(const o in t){const n=this.definition[o];n?i[o]=n(t[o],t):i[o]=t[o]}return i}downloadData(t="BIM Table Data",i="json"){let o=null;if(i==="json"&&(o=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),i==="csv"&&(o=new File([this.csv],`${t}.csv`)),i==="tsv"&&(o=new File([this.tsv],`${t}.tsv`)),!o)return;const n=document.createElement("a");n.href=URL.createObjectURL(o),n.download=o.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,i=this.value,o=0){for(const n of i){if(n.data===t)return o;if(n.children){const r=this.getRowIndentation(t,n.children,o+1);if(r!==null)return r}}return null}getGroupIndentation(t,i=this.value,o=0){for(const n of i){if(n===t)return o;if(n.children){const r=this.getGroupIndentation(t,n.children,o+1);if(r!==null)return r}}return null}setIndentationColor(t,i){const o=new CustomEvent("indentation",{detail:{indentationLevel:t,color:i}});this.dispatchEvent(o)}filter(t,i=this.filterFunction??this._stringFilterFunction,o=this.data){const n=[];for(const r of o)if(i(t,r)){if(this.preserveStructureOnFilter){const s={data:r.data};if(r.children){const l=this.filter(t,i,r.children);l.length&&(s.children=l)}n.push(s)}else if(n.push({data:r.data}),r.children){const s=this.filter(t,i,r.children);n.push(...s)}}else if(r.children){const s=this.filter(t,i,r.children);this.preserveStructureOnFilter&&s.length?n.push({data:r.data,children:s}):n.push(...s)}return n}render(){const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const i=document.createElement("bim-table-children");return i.table=this,i.data=this.value,i.style.gridArea="Body",i.style.backgroundColor="transparent",f`
      <div class="parent">
        ${this.headersHidden?null:t}
        <div style="overflow-x: hidden; grid-area: Body">${i}</div>
      </div>
    `}};Mo.styles=[mt.scrollbar,E`
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
    `];let st=Mo;vt([Zt()],st.prototype,"_filteredData",2);vt([u({type:Boolean,attribute:"headers-hidden",reflect:!0})],st.prototype,"headersHidden",2);vt([u({type:String,attribute:"min-col-width",reflect:!0})],st.prototype,"minColWidth",2);vt([u({type:Array,attribute:!1})],st.prototype,"columns",1);vt([u({type:String,attribute:"search-string",reflect:!0})],st.prototype,"queryString",1);vt([u({type:Array,attribute:!1})],st.prototype,"data",1);vt([u({type:Boolean,reflect:!0})],st.prototype,"expanded",2);var Pl=Object.defineProperty,jl=Object.getOwnPropertyDescriptor,je=(e,t,i,o)=>{for(var n=o>1?void 0:o?jl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Pl(t,i,n),n};const Ro=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const i=[...t.children].indexOf(this);this.name=`${this._defaultName}${i}`}}render(){return f` <slot></slot> `}};Ro.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let M=Ro;je([u({type:String,reflect:!0})],M.prototype,"name",2);je([u({type:String,reflect:!0})],M.prototype,"label",2);je([u({type:String,reflect:!0})],M.prototype,"icon",2);je([u({type:Boolean,reflect:!0})],M.prototype,"hidden",1);var Ll=Object.defineProperty,Ml=Object.getOwnPropertyDescriptor,le=(e,t,i,o)=>{for(var n=o>1?void 0:o?Ml(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Ll(t,i,n),n};const Ho=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.onTabHiddenChange=t=>{const i=t.target;i instanceof M&&!i.hidden&&(i.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=i.name,i.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const i=[...this.children],o=i.find(n=>n instanceof M&&n.name===t);for(const n of i){if(!(n instanceof M))continue;n.hidden=o!==n;const r=this.getTabSwitcher(n.name);r&&r.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(i=>i.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof M))continue;const i=document.createElement("div");i.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),i.setAttribute("data-name",t.name),i.className="switcher";const o=document.createElement("bim-label");o.label=t.label,o.icon=t.icon,i.append(o),this._switchers.push(i)}}onSlotChange(t){this.createSwitchers();const i=t.target.assignedElements(),o=i.find(n=>n instanceof M?this.tab?n.name===this.tab:!n.hidden:!1);o&&o instanceof M&&(this.tab=o.name);for(const n of i){if(!(n instanceof M)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),o!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return f`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Ho.styles=[mt.scrollbar,E`
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
    `];let Lt=Ho;le([Zt()],Lt.prototype,"_switchers",2);le([u({type:Boolean,reflect:!0})],Lt.prototype,"bottom",2);le([u({type:Boolean,attribute:"switchers-hidden",reflect:!0})],Lt.prototype,"switchersHidden",2);le([u({type:Boolean,reflect:!0})],Lt.prototype,"floating",2);le([u({type:String,reflect:!0})],Lt.prototype,"tab",1);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rl=e=>e??k;var Hl=Object.defineProperty,Bl=Object.getOwnPropertyDescriptor,lt=(e,t,i,o)=>{for(var n=o>1?void 0:o?Bl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Hl(t,i,n),n};const Bo=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return ii(this.value)}onInputChange(t){t.stopPropagation();const i=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=i.value,this.dispatchEvent(this.onValueChange)},this.debounce)}render(){return f`
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
          placeholder=${Rl(this.placeholder)}
          @input=${this.onInputChange}
        />
      </bim-input>
    `}};Bo.styles=E`
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
  `;let X=Bo;lt([u({type:String,reflect:!0})],X.prototype,"icon",2);lt([u({type:String,reflect:!0})],X.prototype,"label",2);lt([u({type:String,reflect:!0})],X.prototype,"name",2);lt([u({type:String,reflect:!0})],X.prototype,"placeholder",2);lt([u({type:String,reflect:!0})],X.prototype,"value",2);lt([u({type:Boolean,reflect:!0})],X.prototype,"vertical",2);lt([u({type:Number,reflect:!0})],X.prototype,"debounce",2);lt([u({type:String,reflect:!0})],X.prototype,"type",1);var Nl=Object.defineProperty,Il=Object.getOwnPropertyDescriptor,No=(e,t,i,o)=>{for(var n=o>1?void 0:o?Il(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Nl(t,i,n),n};const Io=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const i of t)this.vertical?i.setAttribute("label-hidden",""):i.removeAttribute("label-hidden")}render(){return f`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};Io.styles=E`
    .parent {
      display: grid;
      gap: 0.25rem;
    }

    ::slotted(bim-button[label]:not([vertical])) {
      --bim-button--jc: flex-start;
    }
  `;let Le=Io;No([u({type:Number,reflect:!0})],Le.prototype,"rows",2);No([u({type:Boolean,reflect:!0})],Le.prototype,"vertical",1);var Dl=Object.defineProperty,Ul=Object.getOwnPropertyDescriptor,Me=(e,t,i,o)=>{for(var n=o>1?void 0:o?Ul(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Dl(t,i,n),n};const Do=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const i of t)i instanceof Le&&(i.vertical=this.vertical),i.toggleAttribute("label-hidden",this.vertical)}render(){return f`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?f`<bim-label
              .label=${this.label}
              .icon=${this.icon}
            ></bim-label>`:null}
      </div>
    `}};Do.styles=E`
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
  `;let Mt=Do;Me([u({type:String,reflect:!0})],Mt.prototype,"label",2);Me([u({type:String,reflect:!0})],Mt.prototype,"icon",2);Me([u({type:Boolean,reflect:!0})],Mt.prototype,"vertical",1);Me([u({type:Boolean,attribute:"label-hidden",reflect:!0})],Mt.prototype,"labelHidden",1);const Uo=class x{static set config(t){this._config={...x._config,...t}}static get config(){return x._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=mt.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){x.init()}static init(){x.addGlobalStyles(),x.defineCustomElement("bim-button",Zs),x.defineCustomElement("bim-checkbox",Ot),x.defineCustomElement("bim-color-input",ft),x.defineCustomElement("bim-context-menu",go),x.defineCustomElement("bim-dropdown",J),x.defineCustomElement("bim-grid",vi),x.defineCustomElement("bim-icon",pl),x.defineCustomElement("bim-input",ie),x.defineCustomElement("bim-label",gt),x.defineCustomElement("bim-number-input",L),x.defineCustomElement("bim-option",T),x.defineCustomElement("bim-panel",ne),x.defineCustomElement("bim-panel-section",Pt),x.defineCustomElement("bim-selector",jt),x.defineCustomElement("bim-table",st),x.defineCustomElement("bim-tabs",Lt),x.defineCustomElement("bim-tab",M),x.defineCustomElement("bim-table-cell",Oo),x.defineCustomElement("bim-table-children",zo),x.defineCustomElement("bim-table-group",jo),x.defineCustomElement("bim-table-row",se),x.defineCustomElement("bim-text-input",X),x.defineCustomElement("bim-toolbar",Re),x.defineCustomElement("bim-toolbar-group",Le),x.defineCustomElement("bim-toolbar-section",Mt),x.defineCustomElement("bim-viewport",qo)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let o=0;o<10;o++){const n=Math.floor(Math.random()*t.length);i+=t.charAt(n)}return i}};Uo._config={sectionLabelOnVerticalToolbar:!1};let Fl=Uo;var Vl=Object.defineProperty,ql=Object.getOwnPropertyDescriptor,yi=(e,t,i,o)=>{for(var n=o>1?void 0:o?ql(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Vl(t,i,n),n};const Fo=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const i of t)i instanceof Mt&&(i.labelHidden=this.vertical&&!Fl.config.sectionLabelOnVerticalToolbar,i.vertical=this.vertical)}render(){return f`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Fo.styles=E`
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
  `;let Re=Fo;yi([u({type:String,reflect:!0})],Re.prototype,"icon",2);yi([u({type:Boolean,attribute:"labels-hidden",reflect:!0})],Re.prototype,"labelsHidden",2);yi([u({type:Boolean,reflect:!0})],Re.prototype,"vertical",1);var Wl=Object.defineProperty,Yl=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Wl(t,i,n),n};const Vo=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return f`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Vo.styles=E`
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
  `;let qo=Vo;Yl([u({type:String,reflect:!0})],qo.prototype,"name");export{sl as a,f as m,Fl as p};
