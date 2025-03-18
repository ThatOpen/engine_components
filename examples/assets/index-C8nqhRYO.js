var Hr=Object.defineProperty,Nr=(t,e,i)=>e in t?Hr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ue=(t,e,i)=>(Nr(t,typeof e!="symbol"?e+"":e,i),i);const Ce=Math.min,Q=Math.max,vt=Math.round,ne=t=>({x:t,y:t}),Ir={left:"right",right:"left",bottom:"top",top:"bottom"},Fr={start:"end",end:"start"};function $i(t,e,i){return Q(t,Ce(e,i))}function nt(t,e){return typeof t=="function"?t(e):t}function J(t){return t.split("-")[0]}function Ot(t){return t.split("-")[1]}function un(t){return t==="x"?"y":"x"}function dn(t){return t==="y"?"height":"width"}function fe(t){return["top","bottom"].includes(J(t))?"y":"x"}function hn(t){return un(fe(t))}function Dr(t,e,i){i===void 0&&(i=!1);const r=Ot(t),n=hn(t),s=dn(n);let o=n==="x"?r===(i?"end":"start")?"right":"left":r==="start"?"bottom":"top";return e.reference[s]>e.floating[s]&&(o=yt(o)),[o,yt(o)]}function Ur(t){const e=yt(t);return[Gt(t),e,Gt(e)]}function Gt(t){return t.replace(/start|end/g,e=>Fr[e])}function Vr(t,e,i){const r=["left","right"],n=["right","left"],s=["top","bottom"],o=["bottom","top"];switch(t){case"top":case"bottom":return i?e?n:r:e?r:n;case"left":case"right":return e?s:o;default:return[]}}function qr(t,e,i,r){const n=Ot(t);let s=Vr(J(t),i==="start",r);return n&&(s=s.map(o=>o+"-"+n),e&&(s=s.concat(s.map(Gt)))),s}function yt(t){return t.replace(/left|right|bottom|top/g,e=>Ir[e])}function Wr(t){return{top:0,right:0,bottom:0,left:0,...t}}function pn(t){return typeof t!="number"?Wr(t):{top:t,right:t,bottom:t,left:t}}function Se(t){const{x:e,y:i,width:r,height:n}=t;return{width:r,height:n,top:i,left:e,right:e+r,bottom:i+n,x:e,y:i}}function Ei(t,e,i){let{reference:r,floating:n}=t;const s=fe(e),o=hn(e),l=dn(o),a=J(e),c=s==="y",d=r.x+r.width/2-n.width/2,h=r.y+r.height/2-n.height/2,p=r[l]/2-n[l]/2;let f;switch(a){case"top":f={x:d,y:r.y-n.height};break;case"bottom":f={x:d,y:r.y+r.height};break;case"right":f={x:r.x+r.width,y:h};break;case"left":f={x:r.x-n.width,y:h};break;default:f={x:r.x,y:r.y}}switch(Ot(e)){case"start":f[o]-=p*(i&&c?-1:1);break;case"end":f[o]+=p*(i&&c?-1:1);break}return f}const Yr=async(t,e,i)=>{const{placement:r="bottom",strategy:n="absolute",middleware:s=[],platform:o}=i,l=s.filter(Boolean),a=await(o.isRTL==null?void 0:o.isRTL(e));let c=await o.getElementRects({reference:t,floating:e,strategy:n}),{x:d,y:h}=Ei(c,r,a),p=r,f={},m=0;for(let v=0;v<l.length;v++){const{name:g,fn:k}=l[v],{x:C,y:x,data:$,reset:z}=await k({x:d,y:h,initialPlacement:r,placement:p,strategy:n,middlewareData:f,rects:c,platform:o,elements:{reference:t,floating:e}});d=C??d,h=x??h,f={...f,[g]:{...f[g],...$}},z&&m<=50&&(m++,typeof z=="object"&&(z.placement&&(p=z.placement),z.rects&&(c=z.rects===!0?await o.getElementRects({reference:t,floating:e,strategy:n}):z.rects),{x:d,y:h}=Ei(c,p,a)),v=-1)}return{x:d,y:h,placement:p,strategy:n,middlewareData:f}};async function fn(t,e){var i;e===void 0&&(e={});const{x:r,y:n,platform:s,rects:o,elements:l,strategy:a}=t,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:h="floating",altBoundary:p=!1,padding:f=0}=nt(e,t),m=pn(f),v=l[p?h==="floating"?"reference":"floating":h],g=Se(await s.getClippingRect({element:(i=await(s.isElement==null?void 0:s.isElement(v)))==null||i?v:v.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(l.floating)),boundary:c,rootBoundary:d,strategy:a})),k=h==="floating"?{x:r,y:n,width:o.floating.width,height:o.floating.height}:o.reference,C=await(s.getOffsetParent==null?void 0:s.getOffsetParent(l.floating)),x=await(s.isElement==null?void 0:s.isElement(C))?await(s.getScale==null?void 0:s.getScale(C))||{x:1,y:1}:{x:1,y:1},$=Se(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:k,offsetParent:C,strategy:a}):k);return{top:(g.top-$.top+m.top)/x.y,bottom:($.bottom-g.bottom+m.bottom)/x.y,left:(g.left-$.left+m.left)/x.x,right:($.right-g.right+m.right)/x.x}}const Gr=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var i,r;const{placement:n,middlewareData:s,rects:o,initialPlacement:l,platform:a,elements:c}=e,{mainAxis:d=!0,crossAxis:h=!0,fallbackPlacements:p,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...g}=nt(t,e);if((i=s.arrow)!=null&&i.alignmentOffset)return{};const k=J(n),C=fe(l),x=J(l)===l,$=await(a.isRTL==null?void 0:a.isRTL(c.floating)),z=p||(x||!v?[yt(l)]:Ur(l)),y=m!=="none";!p&&y&&z.push(...qr(l,v,m,$));const L=[l,...z],I=await fn(e,g),F=[];let S=((r=s.flip)==null?void 0:r.overflows)||[];if(d&&F.push(I[k]),h){const V=Dr(n,o,$);F.push(I[V[0]],I[V[1]])}if(S=[...S,{placement:n,overflows:F}],!F.every(V=>V<=0)){var _e,Ue;const V=(((_e=s.flip)==null?void 0:_e.index)||0)+1,we=L[V];if(we)return{data:{index:V,overflows:S},reset:{placement:we}};let Z=(Ue=S.filter(ee=>ee.overflows[0]<=0).sort((ee,q)=>ee.overflows[1]-q.overflows[1])[0])==null?void 0:Ue.placement;if(!Z)switch(f){case"bestFit":{var xe;const ee=(xe=S.filter(q=>{if(y){const te=fe(q.placement);return te===C||te==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(te=>te>0).reduce((te,Br)=>te+Br,0)]).sort((q,te)=>q[1]-te[1])[0])==null?void 0:xe[0];ee&&(Z=ee);break}case"initialPlacement":Z=l;break}if(n!==Z)return{reset:{placement:Z}}}return{}}}};function bn(t){const e=Ce(...t.map(s=>s.left)),i=Ce(...t.map(s=>s.top)),r=Q(...t.map(s=>s.right)),n=Q(...t.map(s=>s.bottom));return{x:e,y:i,width:r-e,height:n-i}}function Qr(t){const e=t.slice().sort((n,s)=>n.y-s.y),i=[];let r=null;for(let n=0;n<e.length;n++){const s=e[n];!r||s.y-r.y>r.height/2?i.push([s]):i[i.length-1].push(s),r=s}return i.map(n=>Se(bn(n)))}const Jr=function(t){return t===void 0&&(t={}),{name:"inline",options:t,async fn(e){const{placement:i,elements:r,rects:n,platform:s,strategy:o}=e,{padding:l=2,x:a,y:c}=nt(t,e),d=Array.from(await(s.getClientRects==null?void 0:s.getClientRects(r.reference))||[]),h=Qr(d),p=Se(bn(d)),f=pn(l);function m(){if(h.length===2&&h[0].left>h[1].right&&a!=null&&c!=null)return h.find(g=>a>g.left-f.left&&a<g.right+f.right&&c>g.top-f.top&&c<g.bottom+f.bottom)||p;if(h.length>=2){if(fe(i)==="y"){const S=h[0],_e=h[h.length-1],Ue=J(i)==="top",xe=S.top,V=_e.bottom,we=Ue?S.left:_e.left,Z=Ue?S.right:_e.right,ee=Z-we,q=V-xe;return{top:xe,bottom:V,left:we,right:Z,width:ee,height:q,x:we,y:xe}}const g=J(i)==="left",k=Q(...h.map(S=>S.right)),C=Ce(...h.map(S=>S.left)),x=h.filter(S=>g?S.left===C:S.right===k),$=x[0].top,z=x[x.length-1].bottom,y=C,L=k,I=L-y,F=z-$;return{top:$,bottom:z,left:y,right:L,width:I,height:F,x:y,y:$}}return p}const v=await s.getElementRects({reference:{getBoundingClientRect:m},floating:r.floating,strategy:o});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function Xr(t,e){const{placement:i,platform:r,elements:n}=t,s=await(r.isRTL==null?void 0:r.isRTL(n.floating)),o=J(i),l=Ot(i),a=fe(i)==="y",c=["left","top"].includes(o)?-1:1,d=s&&a?-1:1,h=nt(e,t);let{mainAxis:p,crossAxis:f,alignmentAxis:m}=typeof h=="number"?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:h.mainAxis||0,crossAxis:h.crossAxis||0,alignmentAxis:h.alignmentAxis};return l&&typeof m=="number"&&(f=l==="end"?m*-1:m),a?{x:f*d,y:p*c}:{x:p*c,y:f*d}}const mn=function(t){return{name:"offset",options:t,async fn(e){var i,r;const{x:n,y:s,placement:o,middlewareData:l}=e,a=await Xr(e,t);return o===((i=l.offset)==null?void 0:i.placement)&&(r=l.arrow)!=null&&r.alignmentOffset?{}:{x:n+a.x,y:s+a.y,data:{...a,placement:o}}}}},Kr=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:i,y:r,placement:n}=e,{mainAxis:s=!0,crossAxis:o=!1,limiter:l={fn:g=>{let{x:k,y:C}=g;return{x:k,y:C}}},...a}=nt(t,e),c={x:i,y:r},d=await fn(e,a),h=fe(J(n)),p=un(h);let f=c[p],m=c[h];if(s){const g=p==="y"?"top":"left",k=p==="y"?"bottom":"right",C=f+d[g],x=f-d[k];f=$i(C,f,x)}if(o){const g=h==="y"?"top":"left",k=h==="y"?"bottom":"right",C=m+d[g],x=m-d[k];m=$i(C,m,x)}const v=l.fn({...e,[p]:f,[h]:m});return{...v,data:{x:v.x-i,y:v.y-r,enabled:{[p]:s,[h]:o}}}}}};function Tt(){return typeof window<"u"}function re(t){return gn(t)?(t.nodeName||"").toLowerCase():"#document"}function j(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function oe(t){var e;return(e=(gn(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function gn(t){return Tt()?t instanceof Node||t instanceof j(t).Node:!1}function W(t){return Tt()?t instanceof Element||t instanceof j(t).Element:!1}function Y(t){return Tt()?t instanceof HTMLElement||t instanceof j(t).HTMLElement:!1}function Ci(t){return!Tt()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof j(t).ShadowRoot}function rt(t){const{overflow:e,overflowX:i,overflowY:r,display:n}=R(t);return/auto|scroll|overlay|hidden|clip/.test(e+r+i)&&!["inline","contents"].includes(n)}function Zr(t){return["table","td","th"].includes(re(t))}function es(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function ai(t){const e=ci(),i=W(t)?R(t):t;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!e&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!e&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(i.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(i.contain||"").includes(r))}function ts(t){let e=ke(t);for(;Y(e)&&!zt(e);){if(ai(e))return e;if(es(e))return null;e=ke(e)}return null}function ci(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function zt(t){return["html","body","#document"].includes(re(t))}function R(t){return j(t).getComputedStyle(t)}function Lt(t){return W(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function ke(t){if(re(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Ci(t)&&t.host||oe(t);return Ci(e)?e.host:e}function vn(t){const e=ke(t);return zt(e)?t.ownerDocument?t.ownerDocument.body:t.body:Y(e)&&rt(e)?e:vn(e)}function yn(t,e,i){var r;e===void 0&&(e=[]);const n=vn(t),s=n===((r=t.ownerDocument)==null?void 0:r.body),o=j(n);return s?(is(o),e.concat(o,o.visualViewport||[],rt(n)?n:[],[])):e.concat(n,yn(n,[]))}function is(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function _n(t){const e=R(t);let i=parseFloat(e.width)||0,r=parseFloat(e.height)||0;const n=Y(t),s=n?t.offsetWidth:i,o=n?t.offsetHeight:r,l=vt(i)!==s||vt(r)!==o;return l&&(i=s,r=o),{width:i,height:r,$:l}}function xn(t){return W(t)?t:t.contextElement}function Ee(t){const e=xn(t);if(!Y(e))return ne(1);const i=e.getBoundingClientRect(),{width:r,height:n,$:s}=_n(e);let o=(s?vt(i.width):i.width)/r,l=(s?vt(i.height):i.height)/n;return(!o||!Number.isFinite(o))&&(o=1),(!l||!Number.isFinite(l))&&(l=1),{x:o,y:l}}const ns=ne(0);function wn(t){const e=j(t);return!ci()||!e.visualViewport?ns:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function rs(t,e,i){return e===void 0&&(e=!1),!i||e&&i!==j(t)?!1:e}function Je(t,e,i,r){e===void 0&&(e=!1),i===void 0&&(i=!1);const n=t.getBoundingClientRect(),s=xn(t);let o=ne(1);e&&(r?W(r)&&(o=Ee(r)):o=Ee(t));const l=rs(s,i,r)?wn(s):ne(0);let a=(n.left+l.x)/o.x,c=(n.top+l.y)/o.y,d=n.width/o.x,h=n.height/o.y;if(s){const p=j(s),f=r&&W(r)?j(r):r;let m=p,v=m.frameElement;for(;v&&r&&f!==m;){const g=Ee(v),k=v.getBoundingClientRect(),C=R(v),x=k.left+(v.clientLeft+parseFloat(C.paddingLeft))*g.x,$=k.top+(v.clientTop+parseFloat(C.paddingTop))*g.y;a*=g.x,c*=g.y,d*=g.x,h*=g.y,a+=x,c+=$,m=j(v),v=m.frameElement}}return Se({width:d,height:h,x:a,y:c})}const ss=[":popover-open",":modal"];function $n(t){return ss.some(e=>{try{return t.matches(e)}catch{return!1}})}function os(t){let{elements:e,rect:i,offsetParent:r,strategy:n}=t;const s=n==="fixed",o=oe(r),l=e?$n(e.floating):!1;if(r===o||l&&s)return i;let a={scrollLeft:0,scrollTop:0},c=ne(1);const d=ne(0),h=Y(r);if((h||!h&&!s)&&((re(r)!=="body"||rt(o))&&(a=Lt(r)),Y(r))){const p=Je(r);c=Ee(r),d.x=p.x+r.clientLeft,d.y=p.y+r.clientTop}return{width:i.width*c.x,height:i.height*c.y,x:i.x*c.x-a.scrollLeft*c.x+d.x,y:i.y*c.y-a.scrollTop*c.y+d.y}}function ls(t){return Array.from(t.getClientRects())}function En(t){return Je(oe(t)).left+Lt(t).scrollLeft}function as(t){const e=oe(t),i=Lt(t),r=t.ownerDocument.body,n=Q(e.scrollWidth,e.clientWidth,r.scrollWidth,r.clientWidth),s=Q(e.scrollHeight,e.clientHeight,r.scrollHeight,r.clientHeight);let o=-i.scrollLeft+En(t);const l=-i.scrollTop;return R(r).direction==="rtl"&&(o+=Q(e.clientWidth,r.clientWidth)-n),{width:n,height:s,x:o,y:l}}function cs(t,e){const i=j(t),r=oe(t),n=i.visualViewport;let s=r.clientWidth,o=r.clientHeight,l=0,a=0;if(n){s=n.width,o=n.height;const c=ci();(!c||c&&e==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:s,height:o,x:l,y:a}}function us(t,e){const i=Je(t,!0,e==="fixed"),r=i.top+t.clientTop,n=i.left+t.clientLeft,s=Y(t)?Ee(t):ne(1),o=t.clientWidth*s.x,l=t.clientHeight*s.y,a=n*s.x,c=r*s.y;return{width:o,height:l,x:a,y:c}}function Si(t,e,i){let r;if(e==="viewport")r=cs(t,i);else if(e==="document")r=as(oe(t));else if(W(e))r=us(e,i);else{const n=wn(t);r={...e,x:e.x-n.x,y:e.y-n.y}}return Se(r)}function Cn(t,e){const i=ke(t);return i===e||!W(i)||zt(i)?!1:R(i).position==="fixed"||Cn(i,e)}function ds(t,e){const i=e.get(t);if(i)return i;let r=yn(t,[]).filter(l=>W(l)&&re(l)!=="body"),n=null;const s=R(t).position==="fixed";let o=s?ke(t):t;for(;W(o)&&!zt(o);){const l=R(o),a=ai(o);!a&&l.position==="fixed"&&(n=null),(s?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||rt(o)&&!a&&Cn(t,o))?r=r.filter(c=>c!==o):n=l,o=ke(o)}return e.set(t,r),r}function hs(t){let{element:e,boundary:i,rootBoundary:r,strategy:n}=t;const s=[...i==="clippingAncestors"?ds(e,this._c):[].concat(i),r],o=s[0],l=s.reduce((a,c)=>{const d=Si(e,c,n);return a.top=Q(d.top,a.top),a.right=Ce(d.right,a.right),a.bottom=Ce(d.bottom,a.bottom),a.left=Q(d.left,a.left),a},Si(e,o,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function ps(t){const{width:e,height:i}=_n(t);return{width:e,height:i}}function fs(t,e,i){const r=Y(e),n=oe(e),s=i==="fixed",o=Je(t,!0,s,e);let l={scrollLeft:0,scrollTop:0};const a=ne(0);if(r||!r&&!s)if((re(e)!=="body"||rt(n))&&(l=Lt(e)),r){const h=Je(e,!0,s,e);a.x=h.x+e.clientLeft,a.y=h.y+e.clientTop}else n&&(a.x=En(n));const c=o.left+l.scrollLeft-a.x,d=o.top+l.scrollTop-a.y;return{x:c,y:d,width:o.width,height:o.height}}function ki(t,e){return!Y(t)||R(t).position==="fixed"?null:e?e(t):t.offsetParent}function Sn(t,e){const i=j(t);if(!Y(t)||$n(t))return i;let r=ki(t,e);for(;r&&Zr(r)&&R(r).position==="static";)r=ki(r,e);return r&&(re(r)==="html"||re(r)==="body"&&R(r).position==="static"&&!ai(r))?i:r||ts(t)||i}const bs=async function(t){const e=this.getOffsetParent||Sn,i=this.getDimensions;return{reference:fs(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,...await i(t.floating)}}};function ms(t){return R(t).direction==="rtl"}const gs={convertOffsetParentRelativeRectToViewportRelativeRect:os,getDocumentElement:oe,getClippingRect:hs,getOffsetParent:Sn,getElementRects:bs,getClientRects:ls,getDimensions:ps,getScale:Ee,isElement:W,isRTL:ms},kn=Kr,An=Gr,On=Jr,Tn=(t,e,i)=>{const r=new Map,n={platform:gs,...i},s={...n.platform,_c:r};return Yr(t,e,{...n,platform:s})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,ui=mt.ShadowRoot&&(mt.ShadyCSS===void 0||mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,di=Symbol(),Ai=new WeakMap;let zn=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==di)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ui&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Ai.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ai.set(e,t))}return t}toString(){return this.cssText}};const vs=t=>new zn(typeof t=="string"?t:t+"",void 0,di),E=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((r,n,s)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[s+1],t[0]);return new zn(i,t,di)},ys=(t,e)=>{if(ui)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const r=document.createElement("style"),n=mt.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=i.cssText,t.appendChild(r)}},Oi=ui?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const r of e.cssRules)i+=r.cssText;return vs(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_s,defineProperty:xs,getOwnPropertyDescriptor:ws,getOwnPropertyNames:$s,getOwnPropertySymbols:Es,getPrototypeOf:Cs}=Object,Ae=globalThis,Ti=Ae.trustedTypes,Ss=Ti?Ti.emptyScript:"",zi=Ae.reactiveElementPolyfillSupport,We=(t,e)=>t,_t={toAttribute(t,e){switch(e){case Boolean:t=t?Ss:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},hi=(t,e)=>!_s(t,e),Li={attribute:!0,type:String,converter:_t,reflect:!1,hasChanged:hi};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Ae.litPropertyMetadata??(Ae.litPropertyMetadata=new WeakMap);class $e extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=Li){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(e,i),!i.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(e,r,i);n!==void 0&&xs(this.prototype,e,n)}}static getPropertyDescriptor(e,i,r){const{get:n,set:s}=ws(this.prototype,e)??{get(){return this[i]},set(o){this[i]=o}};return{get(){return n==null?void 0:n.call(this)},set(o){const l=n==null?void 0:n.call(this);s.call(this,o),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Li}static _$Ei(){if(this.hasOwnProperty(We("elementProperties")))return;const e=Cs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(We("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(We("properties"))){const i=this.properties,r=[...$s(i),...Es(i)];for(const n of r)this.createProperty(n,i[n])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[r,n]of i)this.elementProperties.set(r,n)}this._$Eh=new Map;for(const[i,r]of this.elementProperties){const n=this._$Eu(i,r);n!==void 0&&this._$Eh.set(n,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const n of r)i.unshift(Oi(n))}else e!==void 0&&i.push(Oi(e));return i}static _$Eu(e,i){const r=i.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const r of i.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ys(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var r;return(r=i.hostConnected)==null?void 0:r.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var r;return(r=i.hostDisconnected)==null?void 0:r.call(i)})}attributeChangedCallback(e,i,r){this._$AK(e,r)}_$EC(e,i){var r;const n=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,n);if(s!==void 0&&n.reflect===!0){const o=(((r=n.converter)==null?void 0:r.toAttribute)!==void 0?n.converter:_t).toAttribute(i,n.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,i){var r;const n=this.constructor,s=n._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const o=n.getPropertyOptions(s),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:_t;this._$Em=s,this[s]=l.fromAttribute(i,o.type),this._$Em=null}}requestUpdate(e,i,r){if(e!==void 0){if(r??(r=this.constructor.getPropertyOptions(e)),!(r.hasChanged??hi)(this[e],i))return;this.P(e,i,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,i,r){this._$AL.has(e)||this._$AL.set(e,i),r.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[s,o]of n)o.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],o)}let i=!1;const r=this._$AL;try{i=this.shouldUpdate(r),i?(this.willUpdate(r),(e=this._$EO)==null||e.forEach(n=>{var s;return(s=n.hostUpdate)==null?void 0:s.call(n)}),this.update(r)):this._$EU()}catch(n){throw i=!1,this._$EU(),n}i&&this._$AE(r)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(r=>{var n;return(n=r.hostUpdated)==null?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(e){}firstUpdated(e){}}$e.elementStyles=[],$e.shadowRootOptions={mode:"open"},$e[We("elementProperties")]=new Map,$e[We("finalized")]=new Map,zi==null||zi({ReactiveElement:$e}),(Ae.reactiveElementVersions??(Ae.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,wt=xt.trustedTypes,ji=wt?wt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ln="$lit$",ie=`lit$${Math.random().toFixed(9).slice(2)}$`,jn="?"+ie,ks=`<${jn}>`,be=document,Xe=()=>be.createComment(""),Ke=t=>t===null||typeof t!="object"&&typeof t!="function",pi=Array.isArray,As=t=>pi(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Dt=`[ 	
\f\r]`,Ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pi=/-->/g,Mi=/>/g,de=RegExp(`>|${Dt}(?:([^\\s"'>=/]+)(${Dt}*=${Dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ri=/'/g,Bi=/"/g,Pn=/^(?:script|style|textarea|title)$/i,Os=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),b=Os(1),Oe=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Hi=new WeakMap,he=be.createTreeWalker(be,129);function Mn(t,e){if(!pi(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ji!==void 0?ji.createHTML(e):e}const Ts=(t,e)=>{const i=t.length-1,r=[];let n,s=e===2?"<svg>":e===3?"<math>":"",o=Ve;for(let l=0;l<i;l++){const a=t[l];let c,d,h=-1,p=0;for(;p<a.length&&(o.lastIndex=p,d=o.exec(a),d!==null);)p=o.lastIndex,o===Ve?d[1]==="!--"?o=Pi:d[1]!==void 0?o=Mi:d[2]!==void 0?(Pn.test(d[2])&&(n=RegExp("</"+d[2],"g")),o=de):d[3]!==void 0&&(o=de):o===de?d[0]===">"?(o=n??Ve,h=-1):d[1]===void 0?h=-2:(h=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?de:d[3]==='"'?Bi:Ri):o===Bi||o===Ri?o=de:o===Pi||o===Mi?o=Ve:(o=de,n=void 0);const f=o===de&&t[l+1].startsWith("/>")?" ":"";s+=o===Ve?a+ks:h>=0?(r.push(c),a.slice(0,h)+Ln+a.slice(h)+ie+f):a+ie+(h===-2?l:f)}return[Mn(t,s+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};class Ze{constructor({strings:e,_$litType$:i},r){let n;this.parts=[];let s=0,o=0;const l=e.length-1,a=this.parts,[c,d]=Ts(e,i);if(this.el=Ze.createElement(c,r),he.currentNode=this.el.content,i===2||i===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=he.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const h of n.getAttributeNames())if(h.endsWith(Ln)){const p=d[o++],f=n.getAttribute(h).split(ie),m=/([.?@])?(.*)/.exec(p);a.push({type:1,index:s,name:m[2],strings:f,ctor:m[1]==="."?Ls:m[1]==="?"?js:m[1]==="@"?Ps:jt}),n.removeAttribute(h)}else h.startsWith(ie)&&(a.push({type:6,index:s}),n.removeAttribute(h));if(Pn.test(n.tagName)){const h=n.textContent.split(ie),p=h.length-1;if(p>0){n.textContent=wt?wt.emptyScript:"";for(let f=0;f<p;f++)n.append(h[f],Xe()),he.nextNode(),a.push({type:2,index:++s});n.append(h[p],Xe())}}}else if(n.nodeType===8)if(n.data===jn)a.push({type:2,index:s});else{let h=-1;for(;(h=n.data.indexOf(ie,h+1))!==-1;)a.push({type:7,index:s}),h+=ie.length-1}s++}}static createElement(e,i){const r=be.createElement("template");return r.innerHTML=e,r}}function Te(t,e,i=t,r){var n,s;if(e===Oe)return e;let o=r!==void 0?(n=i._$Co)==null?void 0:n[r]:i._$Cl;const l=Ke(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((s=o==null?void 0:o._$AO)==null||s.call(o,!1),l===void 0?o=void 0:(o=new l(t),o._$AT(t,i,r)),r!==void 0?(i._$Co??(i._$Co=[]))[r]=o:i._$Cl=o),o!==void 0&&(e=Te(t,o._$AS(t,e.values),o,r)),e}class zs{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:r}=this._$AD,n=((e==null?void 0:e.creationScope)??be).importNode(i,!0);he.currentNode=n;let s=he.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new st(s,s.nextSibling,this,e):a.type===1?c=new a.ctor(s,a.name,a.strings,this,e):a.type===6&&(c=new Ms(s,this,e)),this._$AV.push(c),a=r[++l]}o!==(a==null?void 0:a.index)&&(s=he.nextNode(),o++)}return he.currentNode=be,n}p(e){let i=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,i),i+=r.strings.length-2):r._$AI(e[i])),i++}}class st{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,r,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=r,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=Te(this,e,i),Ke(e)?e===A||e==null||e===""?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==Oe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):As(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&Ke(this._$AH)?this._$AA.nextSibling.data=e:this.T(be.createTextNode(e)),this._$AH=e}$(e){var i;const{values:r,_$litType$:n}=e,s=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=Ze.createElement(Mn(n.h,n.h[0]),this.options)),n);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const o=new zs(s,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(e){let i=Hi.get(e.strings);return i===void 0&&Hi.set(e.strings,i=new Ze(e)),i}k(e){pi(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let r,n=0;for(const s of e)n===i.length?i.push(r=new st(this.O(Xe()),this.O(Xe()),this,this.options)):r=i[n],r._$AI(s),n++;n<i.length&&(this._$AR(r&&r._$AB.nextSibling,n),i.length=n)}_$AR(e=this._$AA.nextSibling,i){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,i);e&&e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class jt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,r,n,s){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=i,this._$AM=n,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=A}_$AI(e,i=this,r,n){const s=this.strings;let o=!1;if(s===void 0)e=Te(this,e,i,0),o=!Ke(e)||e!==this._$AH&&e!==Oe,o&&(this._$AH=e);else{const l=e;let a,c;for(e=s[0],a=0;a<s.length-1;a++)c=Te(this,l[r+a],i,a),c===Oe&&(c=this._$AH[a]),o||(o=!Ke(c)||c!==this._$AH[a]),c===A?e=A:e!==A&&(e+=(c??"")+s[a+1]),this._$AH[a]=c}o&&!n&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ls extends jt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}}class js extends jt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}}class Ps extends jt{constructor(e,i,r,n,s){super(e,i,r,n,s),this.type=5}_$AI(e,i=this){if((e=Te(this,e,i,0)??A)===Oe)return;const r=this._$AH,n=e===A&&r!==A||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==A&&(r===A||n);n&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class Ms{constructor(e,i,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Te(this,e)}}const Ni=xt.litHtmlPolyfillSupport;Ni==null||Ni(Ze,st),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.2.1");const ze=(t,e,i)=>{const r=(i==null?void 0:i.renderBefore)??e;let n=r._$litPart$;if(n===void 0){const s=(i==null?void 0:i.renderBefore)??null;r._$litPart$=n=new st(e.insertBefore(Xe(),s),s,void 0,i??{})}return n._$AI(t),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let w=class extends $e{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ze(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Oe}};var Ii;w._$litElement$=!0,w.finalized=!0,(Ii=globalThis.litElementHydrateSupport)==null||Ii.call(globalThis,{LitElement:w});const Fi=globalThis.litElementPolyfillSupport;Fi==null||Fi({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rs={attribute:!0,type:String,converter:_t,reflect:!1,hasChanged:hi},Bs=(t=Rs,e,i)=>{const{kind:r,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),s.set(i.name,t),r==="accessor"){const{name:o}=i;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,t)},init(l){return l!==void 0&&this.P(o,void 0,t),l}}}if(r==="setter"){const{name:o}=i;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,t)}}throw Error("Unsupported decorator location: "+r)};function u(t){return(e,i)=>typeof i=="object"?Bs(t,e,i):((r,n,s)=>{const o=n.hasOwnProperty(s);return n.constructor.createProperty(s,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(n,s):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Pe(t){return u({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hs=t=>t.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ns={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Is=t=>(...e)=>({_$litDirective$:t,values:e});let Fs=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ye=(t,e)=>{var i;const r=t._$AN;if(r===void 0)return!1;for(const n of r)(i=n._$AO)==null||i.call(n,e,!1),Ye(n,e);return!0},$t=t=>{let e,i;do{if((e=t._$AM)===void 0)break;i=e._$AN,i.delete(t),t=e}while((i==null?void 0:i.size)===0)},Rn=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(i===void 0)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),Vs(e)}};function Ds(t){this._$AN!==void 0?($t(this),this._$AM=t,Rn(this)):this._$AM=t}function Us(t,e=!1,i=0){const r=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(r))for(let s=i;s<r.length;s++)Ye(r[s],!1),$t(r[s]);else r!=null&&(Ye(r,!1),$t(r));else Ye(this,t)}const Vs=t=>{t.type==Ns.CHILD&&(t._$AP??(t._$AP=Us),t._$AQ??(t._$AQ=Ds))};class qs extends Fs{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,i,r){super._$AT(e,i,r),Rn(this),this.isConnected=e._$AU}_$AO(e,i=!0){var r,n;e!==this.isConnected&&(this.isConnected=e,e?(r=this.reconnected)==null||r.call(this):(n=this.disconnected)==null||n.call(this)),i&&(Ye(this,e),$t(this))}setValue(e){if(Hs(this._$Ct))this._$Ct._$AI(e,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=e,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le=()=>new Ws;class Ws{}const Ut=new WeakMap,je=Is(class extends qs{render(t){return A}update(t,[e]){var i;const r=e!==this.Y;return r&&this.Y!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=e,this.ht=(i=t.options)==null?void 0:i.host,this.rt(this.ct=t.element)),A}rt(t){if(this.isConnected||(t=void 0),typeof this.Y=="function"){const e=this.ht??globalThis;let i=Ut.get(e);i===void 0&&(i=new WeakMap,Ut.set(e,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,t),t!==void 0&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){var t,e;return typeof this.Y=="function"?(t=Ut.get(this.ht??globalThis))==null?void 0:t.get(this.Y):(e=this.Y)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Bn=Object.freeze({left:0,top:0,width:16,height:16}),Et=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),ot=Object.freeze({...Bn,...Et}),Qt=Object.freeze({...ot,body:"",hidden:!1}),Ys=Object.freeze({width:null,height:null}),Hn=Object.freeze({...Ys,...Et});function Gs(t,e=0){const i=t.replace(/^-?[0-9.]*/,"");function r(n){for(;n<0;)n+=4;return n%4}if(i===""){const n=parseInt(t);return isNaN(n)?0:r(n)}else if(i!==t){let n=0;switch(i){case"%":n=25;break;case"deg":n=90}if(n){let s=parseFloat(t.slice(0,t.length-i.length));return isNaN(s)?0:(s=s/n,s%1===0?r(s):0)}}return e}const Qs=/[\s,]+/;function Js(t,e){e.split(Qs).forEach(i=>{switch(i.trim()){case"horizontal":t.hFlip=!0;break;case"vertical":t.vFlip=!0;break}})}const Nn={...Hn,preserveAspectRatio:""};function Di(t){const e={...Nn},i=(r,n)=>t.getAttribute(r)||n;return e.width=i("width",null),e.height=i("height",null),e.rotate=Gs(i("rotate","")),Js(e,i("flip","")),e.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),e}function Xs(t,e){for(const i in Nn)if(t[i]!==e[i])return!0;return!1}const Ge=/^[a-z0-9]+(-[a-z0-9]+)*$/,lt=(t,e,i,r="")=>{const n=t.split(":");if(t.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;r=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:r,prefix:a,name:l};return e&&!gt(c)?null:c}const s=n[0],o=s.split("-");if(o.length>1){const l={provider:r,prefix:o.shift(),name:o.join("-")};return e&&!gt(l)?null:l}if(i&&r===""){const l={provider:r,prefix:"",name:s};return e&&!gt(l,i)?null:l}return null},gt=(t,e)=>t?!!((t.provider===""||t.provider.match(Ge))&&(e&&t.prefix===""||t.prefix.match(Ge))&&t.name.match(Ge)):!1;function Ks(t,e){const i={};!t.hFlip!=!e.hFlip&&(i.hFlip=!0),!t.vFlip!=!e.vFlip&&(i.vFlip=!0);const r=((t.rotate||0)+(e.rotate||0))%4;return r&&(i.rotate=r),i}function Ui(t,e){const i=Ks(t,e);for(const r in Qt)r in Et?r in t&&!(r in i)&&(i[r]=Et[r]):r in e?i[r]=e[r]:r in t&&(i[r]=t[r]);return i}function Zs(t,e){const i=t.icons,r=t.aliases||Object.create(null),n=Object.create(null);function s(o){if(i[o])return n[o]=[];if(!(o in n)){n[o]=null;const l=r[o]&&r[o].parent,a=l&&s(l);a&&(n[o]=[l].concat(a))}return n[o]}return Object.keys(i).concat(Object.keys(r)).forEach(s),n}function eo(t,e,i){const r=t.icons,n=t.aliases||Object.create(null);let s={};function o(l){s=Ui(r[l]||n[l],s)}return o(e),i.forEach(o),Ui(t,s)}function In(t,e){const i=[];if(typeof t!="object"||typeof t.icons!="object")return i;t.not_found instanceof Array&&t.not_found.forEach(n=>{e(n,null),i.push(n)});const r=Zs(t);for(const n in r){const s=r[n];s&&(e(n,eo(t,n,s)),i.push(n))}return i}const to={provider:"",aliases:{},not_found:{},...Bn};function Vt(t,e){for(const i in e)if(i in t&&typeof t[i]!=typeof e[i])return!1;return!0}function Fn(t){if(typeof t!="object"||t===null)return null;const e=t;if(typeof e.prefix!="string"||!t.icons||typeof t.icons!="object"||!Vt(t,to))return null;const i=e.icons;for(const n in i){const s=i[n];if(!n.match(Ge)||typeof s.body!="string"||!Vt(s,Qt))return null}const r=e.aliases||Object.create(null);for(const n in r){const s=r[n],o=s.parent;if(!n.match(Ge)||typeof o!="string"||!i[o]&&!r[o]||!Vt(s,Qt))return null}return e}const Ct=Object.create(null);function io(t,e){return{provider:t,prefix:e,icons:Object.create(null),missing:new Set}}function se(t,e){const i=Ct[t]||(Ct[t]=Object.create(null));return i[e]||(i[e]=io(t,e))}function fi(t,e){return Fn(e)?In(e,(i,r)=>{r?t.icons[i]=r:t.missing.add(i)}):[]}function no(t,e,i){try{if(typeof i.body=="string")return t.icons[e]={...i},!0}catch{}return!1}function ro(t,e){let i=[];return(typeof t=="string"?[t]:Object.keys(Ct)).forEach(r=>{(typeof r=="string"&&typeof e=="string"?[e]:Object.keys(Ct[r]||{})).forEach(n=>{const s=se(r,n);i=i.concat(Object.keys(s.icons).map(o=>(r!==""?"@"+r+":":"")+n+":"+o))})}),i}let et=!1;function Dn(t){return typeof t=="boolean"&&(et=t),et}function tt(t){const e=typeof t=="string"?lt(t,!0,et):t;if(e){const i=se(e.provider,e.prefix),r=e.name;return i.icons[r]||(i.missing.has(r)?null:void 0)}}function Un(t,e){const i=lt(t,!0,et);if(!i)return!1;const r=se(i.provider,i.prefix);return no(r,i.name,e)}function Vi(t,e){if(typeof t!="object")return!1;if(typeof e!="string"&&(e=t.provider||""),et&&!e&&!t.prefix){let n=!1;return Fn(t)&&(t.prefix="",In(t,(s,o)=>{o&&Un(s,o)&&(n=!0)})),n}const i=t.prefix;if(!gt({provider:e,prefix:i,name:"a"}))return!1;const r=se(e,i);return!!fi(r,t)}function qi(t){return!!tt(t)}function so(t){const e=tt(t);return e?{...ot,...e}:null}function oo(t){const e={loaded:[],missing:[],pending:[]},i=Object.create(null);t.sort((n,s)=>n.provider!==s.provider?n.provider.localeCompare(s.provider):n.prefix!==s.prefix?n.prefix.localeCompare(s.prefix):n.name.localeCompare(s.name));let r={provider:"",prefix:"",name:""};return t.forEach(n=>{if(r.name===n.name&&r.prefix===n.prefix&&r.provider===n.provider)return;r=n;const s=n.provider,o=n.prefix,l=n.name,a=i[s]||(i[s]=Object.create(null)),c=a[o]||(a[o]=se(s,o));let d;l in c.icons?d=e.loaded:o===""||c.missing.has(l)?d=e.missing:d=e.pending;const h={provider:s,prefix:o,name:l};d.push(h)}),e}function Vn(t,e){t.forEach(i=>{const r=i.loaderCallbacks;r&&(i.loaderCallbacks=r.filter(n=>n.id!==e))})}function lo(t){t.pendingCallbacksFlag||(t.pendingCallbacksFlag=!0,setTimeout(()=>{t.pendingCallbacksFlag=!1;const e=t.loaderCallbacks?t.loaderCallbacks.slice(0):[];if(!e.length)return;let i=!1;const r=t.provider,n=t.prefix;e.forEach(s=>{const o=s.icons,l=o.pending.length;o.pending=o.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(t.icons[c])o.loaded.push({provider:r,prefix:n,name:c});else if(t.missing.has(c))o.missing.push({provider:r,prefix:n,name:c});else return i=!0,!0;return!1}),o.pending.length!==l&&(i||Vn([t],s.id),s.callback(o.loaded.slice(0),o.missing.slice(0),o.pending.slice(0),s.abort))})}))}let ao=0;function co(t,e,i){const r=ao++,n=Vn.bind(null,i,r);if(!e.pending.length)return n;const s={id:r,icons:e,callback:t,abort:n};return i.forEach(o=>{(o.loaderCallbacks||(o.loaderCallbacks=[])).push(s)}),n}const Jt=Object.create(null);function Wi(t,e){Jt[t]=e}function Xt(t){return Jt[t]||Jt[""]}function uo(t,e=!0,i=!1){const r=[];return t.forEach(n=>{const s=typeof n=="string"?lt(n,e,i):n;s&&r.push(s)}),r}var ho={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function po(t,e,i,r){const n=t.resources.length,s=t.random?Math.floor(Math.random()*n):t.index;let o;if(t.random){let y=t.resources.slice(0);for(o=[];y.length>1;){const L=Math.floor(Math.random()*y.length);o.push(y[L]),y=y.slice(0,L).concat(y.slice(L+1))}o=o.concat(y)}else o=t.resources.slice(s).concat(t.resources.slice(0,s));const l=Date.now();let a="pending",c=0,d,h=null,p=[],f=[];typeof r=="function"&&f.push(r);function m(){h&&(clearTimeout(h),h=null)}function v(){a==="pending"&&(a="aborted"),m(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,L){L&&(f=[]),typeof y=="function"&&f.push(y)}function k(){return{startTime:l,payload:e,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function C(){a="failed",f.forEach(y=>{y(void 0,d)})}function x(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,L,I){const F=L!=="success";switch(p=p.filter(S=>S!==y),a){case"pending":break;case"failed":if(F||!t.dataAfterTimeout)return;break;default:return}if(L==="abort"){d=I,C();return}if(F){d=I,p.length||(o.length?z():C());return}if(m(),x(),!t.random){const S=t.resources.indexOf(y.resource);S!==-1&&S!==t.index&&(t.index=S)}a="completed",f.forEach(S=>{S(I)})}function z(){if(a!=="pending")return;m();const y=o.shift();if(y===void 0){if(p.length){h=setTimeout(()=>{m(),a==="pending"&&(x(),C())},t.timeout);return}C();return}const L={status:"pending",resource:y,callback:(I,F)=>{$(L,I,F)}};p.push(L),c++,h=setTimeout(z,t.rotate),i(y,e,L.callback)}return setTimeout(z),k}function qn(t){const e={...ho,...t};let i=[];function r(){i=i.filter(o=>o().status==="pending")}function n(o,l,a){const c=po(e,o,l,(d,h)=>{r(),a&&a(d,h)});return i.push(c),c}function s(o){return i.find(l=>o(l))||null}return{query:n,find:s,setIndex:o=>{e.index=o},getIndex:()=>e.index,cleanup:r}}function bi(t){let e;if(typeof t.resources=="string")e=[t.resources];else if(e=t.resources,!(e instanceof Array)||!e.length)return null;return{resources:e,path:t.path||"/",maxURL:t.maxURL||500,rotate:t.rotate||750,timeout:t.timeout||5e3,random:t.random===!0,index:t.index||0,dataAfterTimeout:t.dataAfterTimeout!==!1}}const Pt=Object.create(null),ft=["https://api.simplesvg.com","https://api.unisvg.com"],Kt=[];for(;ft.length>0;)ft.length===1||Math.random()>.5?Kt.push(ft.shift()):Kt.push(ft.pop());Pt[""]=bi({resources:["https://api.iconify.design"].concat(Kt)});function Yi(t,e){const i=bi(e);return i===null?!1:(Pt[t]=i,!0)}function Mt(t){return Pt[t]}function fo(){return Object.keys(Pt)}function Gi(){}const qt=Object.create(null);function bo(t){if(!qt[t]){const e=Mt(t);if(!e)return;const i=qn(e),r={config:e,redundancy:i};qt[t]=r}return qt[t]}function Wn(t,e,i){let r,n;if(typeof t=="string"){const s=Xt(t);if(!s)return i(void 0,424),Gi;n=s.send;const o=bo(t);o&&(r=o.redundancy)}else{const s=bi(t);if(s){r=qn(s);const o=t.resources?t.resources[0]:"",l=Xt(o);l&&(n=l.send)}}return!r||!n?(i(void 0,424),Gi):r.query(e,n,i)().abort}const Qi="iconify2",it="iconify",Yn=it+"-count",Ji=it+"-version",Gn=36e5,mo=168,go=50;function Zt(t,e){try{return t.getItem(e)}catch{}}function mi(t,e,i){try{return t.setItem(e,i),!0}catch{}}function Xi(t,e){try{t.removeItem(e)}catch{}}function ei(t,e){return mi(t,Yn,e.toString())}function ti(t){return parseInt(Zt(t,Yn))||0}const pe={local:!0,session:!0},Qn={local:new Set,session:new Set};let gi=!1;function vo(t){gi=t}let bt=typeof window>"u"?{}:window;function Jn(t){const e=t+"Storage";try{if(bt&&bt[e]&&typeof bt[e].length=="number")return bt[e]}catch{}pe[t]=!1}function Xn(t,e){const i=Jn(t);if(!i)return;const r=Zt(i,Ji);if(r!==Qi){if(r){const l=ti(i);for(let a=0;a<l;a++)Xi(i,it+a.toString())}mi(i,Ji,Qi),ei(i,0);return}const n=Math.floor(Date.now()/Gn)-mo,s=l=>{const a=it+l.toString(),c=Zt(i,a);if(typeof c=="string"){try{const d=JSON.parse(c);if(typeof d=="object"&&typeof d.cached=="number"&&d.cached>n&&typeof d.provider=="string"&&typeof d.data=="object"&&typeof d.data.prefix=="string"&&e(d,l))return!0}catch{}Xi(i,a)}};let o=ti(i);for(let l=o-1;l>=0;l--)s(l)||(l===o-1?(o--,ei(i,o)):Qn[t].add(l))}function Kn(){if(!gi){vo(!0);for(const t in pe)Xn(t,e=>{const i=e.data,r=e.provider,n=i.prefix,s=se(r,n);if(!fi(s,i).length)return!1;const o=i.lastModified||-1;return s.lastModifiedCached=s.lastModifiedCached?Math.min(s.lastModifiedCached,o):o,!0})}}function yo(t,e){const i=t.lastModifiedCached;if(i&&i>=e)return i===e;if(t.lastModifiedCached=e,i)for(const r in pe)Xn(r,n=>{const s=n.data;return n.provider!==t.provider||s.prefix!==t.prefix||s.lastModified===e});return!0}function _o(t,e){gi||Kn();function i(r){let n;if(!pe[r]||!(n=Jn(r)))return;const s=Qn[r];let o;if(s.size)s.delete(o=Array.from(s).shift());else if(o=ti(n),o>=go||!ei(n,o+1))return;const l={cached:Math.floor(Date.now()/Gn),provider:t.provider,data:e};return mi(n,it+o.toString(),JSON.stringify(l))}e.lastModified&&!yo(t,e.lastModified)||Object.keys(e.icons).length&&(e.not_found&&(e=Object.assign({},e),delete e.not_found),i("local")||i("session"))}function Ki(){}function xo(t){t.iconsLoaderFlag||(t.iconsLoaderFlag=!0,setTimeout(()=>{t.iconsLoaderFlag=!1,lo(t)}))}function wo(t,e){t.iconsToLoad?t.iconsToLoad=t.iconsToLoad.concat(e).sort():t.iconsToLoad=e,t.iconsQueueFlag||(t.iconsQueueFlag=!0,setTimeout(()=>{t.iconsQueueFlag=!1;const{provider:i,prefix:r}=t,n=t.iconsToLoad;delete t.iconsToLoad;let s;!n||!(s=Xt(i))||s.prepare(i,r,n).forEach(o=>{Wn(i,o,l=>{if(typeof l!="object")o.icons.forEach(a=>{t.missing.add(a)});else try{const a=fi(t,l);if(!a.length)return;const c=t.pendingIcons;c&&a.forEach(d=>{c.delete(d)}),_o(t,l)}catch(a){console.error(a)}xo(t)})})}))}const vi=(t,e)=>{const i=uo(t,!0,Dn()),r=oo(i);if(!r.pending.length){let a=!0;return e&&setTimeout(()=>{a&&e(r.loaded,r.missing,r.pending,Ki)}),()=>{a=!1}}const n=Object.create(null),s=[];let o,l;return r.pending.forEach(a=>{const{provider:c,prefix:d}=a;if(d===l&&c===o)return;o=c,l=d,s.push(se(c,d));const h=n[c]||(n[c]=Object.create(null));h[d]||(h[d]=[])}),r.pending.forEach(a=>{const{provider:c,prefix:d,name:h}=a,p=se(c,d),f=p.pendingIcons||(p.pendingIcons=new Set);f.has(h)||(f.add(h),n[c][d].push(h))}),s.forEach(a=>{const{provider:c,prefix:d}=a;n[c][d].length&&wo(a,n[c][d])}),e?co(e,r,s):Ki},$o=t=>new Promise((e,i)=>{const r=typeof t=="string"?lt(t,!0):t;if(!r){i(t);return}vi([r||t],n=>{if(n.length&&r){const s=tt(r);if(s){e({...ot,...s});return}}i(t)})});function Eo(t){try{const e=typeof t=="string"?JSON.parse(t):t;if(typeof e.body=="string")return{...e}}catch{}}function Co(t,e){const i=typeof t=="string"?lt(t,!0,!0):null;if(!i){const s=Eo(t);return{value:t,data:s}}const r=tt(i);if(r!==void 0||!i.prefix)return{value:t,name:i,data:r};const n=vi([i],()=>e(t,i,tt(i)));return{value:t,name:i,loading:n}}function Wt(t){return t.hasAttribute("inline")}let Zn=!1;try{Zn=navigator.vendor.indexOf("Apple")===0}catch{}function So(t,e){switch(e){case"svg":case"bg":case"mask":return e}return e!=="style"&&(Zn||t.indexOf("<a")===-1)?"svg":t.indexOf("currentColor")===-1?"bg":"mask"}const ko=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Ao=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ii(t,e,i){if(e===1)return t;if(i=i||100,typeof t=="number")return Math.ceil(t*e*i)/i;if(typeof t!="string")return t;const r=t.split(ko);if(r===null||!r.length)return t;const n=[];let s=r.shift(),o=Ao.test(s);for(;;){if(o){const l=parseFloat(s);isNaN(l)?n.push(s):n.push(Math.ceil(l*e*i)/i)}else n.push(s);if(s=r.shift(),s===void 0)return n.join("");o=!o}}function Oo(t,e="defs"){let i="";const r=t.indexOf("<"+e);for(;r>=0;){const n=t.indexOf(">",r),s=t.indexOf("</"+e);if(n===-1||s===-1)break;const o=t.indexOf(">",s);if(o===-1)break;i+=t.slice(n+1,s).trim(),t=t.slice(0,r).trim()+t.slice(o+1)}return{defs:i,content:t}}function To(t,e){return t?"<defs>"+t+"</defs>"+e:e}function zo(t,e,i){const r=Oo(t);return To(r.defs,e+r.content+i)}const Lo=t=>t==="unset"||t==="undefined"||t==="none";function er(t,e){const i={...ot,...t},r={...Hn,...e},n={left:i.left,top:i.top,width:i.width,height:i.height};let s=i.body;[i,r].forEach(v=>{const g=[],k=v.hFlip,C=v.vFlip;let x=v.rotate;k?C?x+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):C&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}x%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(s=zo(s,'<g transform="'+g.join(" ")+'">',"</g>"))});const o=r.width,l=r.height,a=n.width,c=n.height;let d,h;o===null?(h=l===null?"1em":l==="auto"?c:l,d=ii(h,a/c)):(d=o==="auto"?a:o,h=l===null?ii(d,c/a):l==="auto"?c:l);const p={},f=(v,g)=>{Lo(g)||(p[v]=g.toString())};f("width",d),f("height",h);const m=[n.left,n.top,a,c];return p.viewBox=m.join(" "),{attributes:p,viewBox:m,body:s}}function yi(t,e){let i=t.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const r in e)i+=" "+r+'="'+e[r]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+t+"</svg>"}function jo(t){return t.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Po(t){return"data:image/svg+xml,"+jo(t)}function tr(t){return'url("'+Po(t)+'")'}const Mo=()=>{let t;try{if(t=fetch,typeof t=="function")return t}catch{}};let St=Mo();function Ro(t){St=t}function Bo(){return St}function Ho(t,e){const i=Mt(t);if(!i)return 0;let r;if(!i.maxURL)r=0;else{let n=0;i.resources.forEach(o=>{n=Math.max(n,o.length)});const s=e+".json?icons=";r=i.maxURL-n-i.path.length-s.length}return r}function No(t){return t===404}const Io=(t,e,i)=>{const r=[],n=Ho(t,e),s="icons";let o={type:s,provider:t,prefix:e,icons:[]},l=0;return i.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(r.push(o),o={type:s,provider:t,prefix:e,icons:[]},l=a.length),o.icons.push(a)}),r.push(o),r};function Fo(t){if(typeof t=="string"){const e=Mt(t);if(e)return e.path}return"/"}const Do=(t,e,i)=>{if(!St){i("abort",424);return}let r=Fo(e.provider);switch(e.type){case"icons":{const s=e.prefix,o=e.icons.join(","),l=new URLSearchParams({icons:o});r+=s+".json?"+l.toString();break}case"custom":{const s=e.uri;r+=s.slice(0,1)==="/"?s.slice(1):s;break}default:i("abort",400);return}let n=503;St(t+r).then(s=>{const o=s.status;if(o!==200){setTimeout(()=>{i(No(o)?"abort":"next",o)});return}return n=501,s.json()}).then(s=>{if(typeof s!="object"||s===null){setTimeout(()=>{s===404?i("abort",s):i("next",n)});return}setTimeout(()=>{i("success",s)})}).catch(()=>{i("next",n)})},Uo={prepare:Io,send:Do};function Zi(t,e){switch(t){case"local":case"session":pe[t]=e;break;case"all":for(const i in pe)pe[i]=e;break}}const Yt="data-style";let ir="";function Vo(t){ir=t}function en(t,e){let i=Array.from(t.childNodes).find(r=>r.hasAttribute&&r.hasAttribute(Yt));i||(i=document.createElement("style"),i.setAttribute(Yt,Yt),t.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(e?"-0.125em":"0")+"}span,svg{display:block}"+ir}function nr(){Wi("",Uo),Dn(!0);let t;try{t=window}catch{}if(t){if(Kn(),t.IconifyPreload!==void 0){const e=t.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof e=="object"&&e!==null&&(e instanceof Array?e:[e]).forEach(r=>{try{(typeof r!="object"||r===null||r instanceof Array||typeof r.icons!="object"||typeof r.prefix!="string"||!Vi(r))&&console.error(i)}catch{console.error(i)}})}if(t.IconifyProviders!==void 0){const e=t.IconifyProviders;if(typeof e=="object"&&e!==null)for(const i in e){const r="IconifyProviders["+i+"] is invalid.";try{const n=e[i];if(typeof n!="object"||!n||n.resources===void 0)continue;Yi(i,n)||console.error(r)}catch{console.error(r)}}}}return{enableCache:e=>Zi(e,!0),disableCache:e=>Zi(e,!1),iconLoaded:qi,iconExists:qi,getIcon:so,listIcons:ro,addIcon:Un,addCollection:Vi,calculateSize:ii,buildIcon:er,iconToHTML:yi,svgToURL:tr,loadIcons:vi,loadIcon:$o,addAPIProvider:Yi,appendCustomStyle:Vo,_api:{getAPIConfig:Mt,setAPIModule:Wi,sendAPIQuery:Wn,setFetch:Ro,getFetch:Bo,listAPIProviders:fo}}}const ni={"background-color":"currentColor"},rr={"background-color":"transparent"},tn={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},nn={"-webkit-mask":ni,mask:ni,background:rr};for(const t in nn){const e=nn[t];for(const i in tn)e[t+"-"+i]=tn[i]}function rn(t){return t?t+(t.match(/^[-0-9.]+$/)?"px":""):"inherit"}function qo(t,e,i){const r=document.createElement("span");let n=t.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const s=t.attributes,o=yi(n,{...s,width:e.width+"",height:e.height+""}),l=tr(o),a=r.style,c={"--svg":l,width:rn(s.width),height:rn(s.height),...i?ni:rr};for(const d in c)a.setProperty(d,c[d]);return r}let Qe;function Wo(){try{Qe=window.trustedTypes.createPolicy("iconify",{createHTML:t=>t})}catch{Qe=null}}function Yo(t){return Qe===void 0&&Wo(),Qe?Qe.createHTML(t):t}function Go(t){const e=document.createElement("span"),i=t.attributes;let r="";i.width||(r="width: inherit;"),i.height||(r+="height: inherit;"),r&&(i.style=r);const n=yi(t.body,i);return e.innerHTML=Yo(n),e.firstChild}function ri(t){return Array.from(t.childNodes).find(e=>{const i=e.tagName&&e.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function sn(t,e){const i=e.icon.data,r=e.customisations,n=er(i,r);r.preserveAspectRatio&&(n.attributes.preserveAspectRatio=r.preserveAspectRatio);const s=e.renderedMode;let o;switch(s){case"svg":o=Go(n);break;default:o=qo(n,{...ot,...i},s==="mask")}const l=ri(t);l?o.tagName==="SPAN"&&l.tagName===o.tagName?l.setAttribute("style",o.getAttribute("style")):t.replaceChild(o,l):t.appendChild(o)}function on(t,e,i){const r=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:e,icon:t,lastRender:r}}function Qo(t="iconify-icon"){let e,i;try{e=window.customElements,i=window.HTMLElement}catch{return}if(!e||!i)return;const r=e.get(t);if(r)return r;const n=["icon","mode","inline","observe","width","height","rotate","flip"],s=class extends i{constructor(){super(),ue(this,"_shadowRoot"),ue(this,"_initialised",!1),ue(this,"_state"),ue(this,"_checkQueued",!1),ue(this,"_connected",!1),ue(this,"_observer",null),ue(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Wt(this);en(l,a),this._state=on({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Wt(this),c=this._state;a!==c.inline&&(c.inline=a,en(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Wt(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}sn(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),d=Di(this);(l.attrMode!==c||Xs(l.customisations,d)||!ri(this._shadowRoot))&&this._renderIcon(l.icon,d,c)}_iconChanged(l){const a=Co(l,(c,d,h)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const f={value:c,name:d,data:h};f.data?this._gotIconData(f):p.icon=f});a.data?this._gotIconData(a):this._state=on(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=ri(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Di(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const d=So(l.data.body,c),h=this._state.inline;sn(this._shadowRoot,this._state={rendered:!0,icon:l,inline:h,customisations:a,attrMode:c,renderedMode:d})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in s.prototype||Object.defineProperty(s.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const o=nr();for(const l in o)s[l]=s.prototype[l]=o[l];return e.define(t,s),s}Qo()||nr();const Jo=E`
  ::-webkit-scrollbar {
    width: 0.4rem;
    height: 0.4rem;
    overflow: hidden;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0.25rem;
    background-color: var(
      --bim-scrollbar--c,
      color-mix(in lab, var(--bim-ui_main-base), white 15%)
    );
  }

  ::-webkit-scrollbar-track {
    background-color: var(--bim-scrollbar--bgc, var(--bim-ui_bg-base));
  }
`,Xo=E`
  :root {
    /* Grayscale Colors */
    --bim-ui_gray-0: hsl(210 10% 5%);
    --bim-ui_gray-1: hsl(210 10% 10%);
    --bim-ui_gray-2: hsl(210 10% 20%);
    --bim-ui_gray-3: hsl(210 10% 30%);
    --bim-ui_gray-4: hsl(210 10% 40%);
    --bim-ui_gray-6: hsl(210 10% 60%);
    --bim-ui_gray-7: hsl(210 10% 70%);
    --bim-ui_gray-8: hsl(210 10% 80%);
    --bim-ui_gray-9: hsl(210 10% 90%);
    --bim-ui_gray-10: hsl(210 10% 95%);

    /* Brand Colors */
    --bim-ui_main-base: #6528d7;
    --bim-ui_accent-base: #bcf124;

    /* Brand Colors Contrasts */
    --bim-ui_main-contrast: var(--bim-ui_gray-10);
    --bim-ui_accent-contrast: var(--bim-ui_gray-0);

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

  /* Background Colors */
  @media (prefers-color-scheme: dark) {
    :root {
      --bim-ui_bg-base: var(--bim-ui_gray-0);
      --bim-ui_bg-contrast-10: var(--bim-ui_gray-1);
      --bim-ui_bg-contrast-20: var(--bim-ui_gray-2);
      --bim-ui_bg-contrast-30: var(--bim-ui_gray-3);
      --bim-ui_bg-contrast-40: var(--bim-ui_gray-4);
      --bim-ui_bg-contrast-60: var(--bim-ui_gray-6);
      --bim-ui_bg-contrast-80: var(--bim-ui_gray-8);
      --bim-ui_bg-contrast-100: var(--bim-ui_gray-10);
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      --bim-ui_bg-base: var(--bim-ui_gray-10);
      --bim-ui_bg-contrast-10: var(--bim-ui_gray-9);
      --bim-ui_bg-contrast-20: var(--bim-ui_gray-8);
      --bim-ui_bg-contrast-30: var(--bim-ui_gray-7);
      --bim-ui_bg-contrast-40: var(--bim-ui_gray-6);
      --bim-ui_bg-contrast-60: var(--bim-ui_gray-4);
      --bim-ui_bg-contrast-80: var(--bim-ui_gray-2);
      --bim-ui_bg-contrast-100: var(--bim-ui_gray-0);
      --bim-ui_accent-base: #6528d7;
    }
  }

  html.bim-ui-dark {
    --bim-ui_bg-base: var(--bim-ui_gray-0);
    --bim-ui_bg-contrast-10: var(--bim-ui_gray-1);
    --bim-ui_bg-contrast-20: var(--bim-ui_gray-2);
    --bim-ui_bg-contrast-30: var(--bim-ui_gray-3);
    --bim-ui_bg-contrast-40: var(--bim-ui_gray-4);
    --bim-ui_bg-contrast-60: var(--bim-ui_gray-6);
    --bim-ui_bg-contrast-80: var(--bim-ui_gray-8);
    --bim-ui_bg-contrast-100: var(--bim-ui_gray-10);
  }

  html.bim-ui-light {
    --bim-ui_bg-base: var(--bim-ui_gray-10);
    --bim-ui_bg-contrast-10: var(--bim-ui_gray-9);
    --bim-ui_bg-contrast-20: var(--bim-ui_gray-8);
    --bim-ui_bg-contrast-30: var(--bim-ui_gray-7);
    --bim-ui_bg-contrast-40: var(--bim-ui_gray-6);
    --bim-ui_bg-contrast-60: var(--bim-ui_gray-4);
    --bim-ui_bg-contrast-80: var(--bim-ui_gray-2);
    --bim-ui_bg-contrast-100: var(--bim-ui_gray-0);
    --bim-ui_accent-base: #6528d7;
  }

  [data-context-dialog]::backdrop {
    background-color: transparent;
  }
`,le={scrollbar:Jo,globalStyles:Xo},sr=class _{static set config(e){this._config={..._._config,...e}}static get config(){return _._config}static addGlobalStyles(){let e=document.querySelector("style[id='bim-ui']");if(e)return;e=document.createElement("style"),e.id="bim-ui",e.textContent=le.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(e,i):document.head.append(e)}static defineCustomElement(e,i){customElements.get(e)||customElements.define(e,i)}static registerComponents(){_.init()}static init(){_.addGlobalStyles(),_.defineCustomElement("bim-button",nl),_.defineCustomElement("bim-checkbox",Me),_.defineCustomElement("bim-color-input",me),_.defineCustomElement("bim-context-menu",oi),_.defineCustomElement("bim-dropdown",X),_.defineCustomElement("bim-grid",xi),_.defineCustomElement("bim-icon",dl),_.defineCustomElement("bim-input",ct),_.defineCustomElement("bim-label",Be),_.defineCustomElement("bim-number-input",P),_.defineCustomElement("bim-option",T),_.defineCustomElement("bim-panel",ge),_.defineCustomElement("bim-panel-section",He),_.defineCustomElement("bim-selector",Ne),_.defineCustomElement("bim-table",N),_.defineCustomElement("bim-tabs",ye),_.defineCustomElement("bim-tab",M),_.defineCustomElement("bim-table-cell",xr),_.defineCustomElement("bim-table-children",$r),_.defineCustomElement("bim-table-group",Cr),_.defineCustomElement("bim-table-row",ve),_.defineCustomElement("bim-text-input",G),_.defineCustomElement("bim-toolbar",Ft),_.defineCustomElement("bim-toolbar-group",Nt),_.defineCustomElement("bim-toolbar-section",De),_.defineCustomElement("bim-viewport",Rr)}static newRandomId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let r=0;r<10;r++){const n=Math.floor(Math.random()*e.length);i+=e.charAt(n)}return i}};sr._config={sectionLabelOnVerticalToolbar:!1};let or=sr;class kt extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=e=>{if(!this.useObserver)return;for(const r of e)this.elements.add(r);const i=e.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const r of i)r.remove();this.observeLastElement()}}set visibleElements(e){this._visibleElements=this.useObserver?e:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const e=new IntersectionObserver(i=>{const r=i[0];if(!r.isIntersecting)return;const n=r.target;e.unobserve(n);const s=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,o=[...this.elements][s];o&&(this.visibleElements=[...this.visibleElements,o],e.observe(o))},{threshold:.5});return e}observeLastElement(){const e=this.getLazyObserver();if(!e)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,r=[...this.elements][i];r&&e.observe(r)}resetVisibleElements(){const e=this.getLazyObserver();if(e){for(const i of this.elements)e.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(e,i){const r=document.createDocumentFragment();if(e.length===0)return ze(e(),r),r.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let n=i;const s=e,o=a=>(n={...n,...a},ze(s(n,o),r),n);o(i);const l=()=>n;return[r.firstElementChild,o,l]}}const At=(t,e={},i=!0)=>{let r={};for(const n of t.children){const s=n,o=s.getAttribute("name")||s.getAttribute("label"),l=e[o];if(o){if("value"in s&&typeof s.value<"u"&&s.value!==null){const a=s.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;r[o]=l?l(s.value):s.value}else if(i){const a=At(s,e);if(Object.keys(a).length===0)continue;r[o]=l?l(a):a}}else i&&(r={...r,...At(s,e)})}return r},Rt=t=>t==="true"||t==="false"?t==="true":t&&!isNaN(Number(t))&&t.trim()!==""?Number(t):t,Ko=[">=","<=","=",">","<","?","/","#"];function ln(t){const e=Ko.find(o=>t.split(o).length===2),i=t.split(e).map(o=>o.trim()),[r,n]=i,s=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):Rt(n);return{key:r,condition:e,value:s}}const si=t=>{try{const e=[],i=t.split(/&(?![^()]*\))/).map(r=>r.trim());for(const r of i){const n=!r.startsWith("(")&&!r.endsWith(")"),s=r.startsWith("(")&&r.endsWith(")");if(n){const o=ln(r);e.push(o)}if(s){const o={operator:"&",queries:r.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=ln(l);return a>0&&(c.operator="&"),c})};e.push(o)}}return e}catch{return null}},an=(t,e,i)=>{let r=!1;switch(e){case"=":r=t===i;break;case"?":r=String(t).includes(String(i));break;case"<":(typeof t=="number"||typeof i=="number")&&(r=t<i);break;case"<=":(typeof t=="number"||typeof i=="number")&&(r=t<=i);break;case">":(typeof t=="number"||typeof i=="number")&&(r=t>i);break;case">=":(typeof t=="number"||typeof i=="number")&&(r=t>=i);break;case"/":r=String(t).startsWith(String(i));break}return r};var Zo=Object.defineProperty,el=Object.getOwnPropertyDescriptor,lr=(t,e,i,r)=>{for(var n=el(e,i),s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&Zo(e,i,n),n},O;const _i=(O=class extends w{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(t){this._placement=t,this.updatePosition()}static removeMenus(){for(const t of O.menus)t instanceof O&&(t.visible=!1);O.dialog.close(),O.dialog.remove()}get visible(){return this._visible}set visible(t){var e;this._visible=t,t?(O.dialog.parentElement||document.body.append(O.dialog),this._previousContainer=this.parentElement,O.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,O.dialog.append(this),O.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((e=this._previousContainer)==null||e.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const t=this.placement??"right",e=await Tn(this._previousContainer,this,{placement:t,middleware:[mn(10),On(),An(),kn({padding:5})]}),{x:i,y:r}=e;this.style.left=`${i}px`,this.style.top=`${r}px`}connectedCallback(){super.connectedCallback(),O.menus.push(this)}render(){return b` <slot></slot> `}},O.styles=[le.scrollbar,E`
      :host {
        pointer-events: auto;
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
        display: flex;
        background-color: var(
          --bim-context-menu--bgc,
          var(--bim-ui_bg-contrast-20)
        );
      }

      :host(:not([visible])) {
        display: none;
      }
    `],O.dialog=kt.create(()=>b` <dialog
      @click=${t=>{t.target===O.dialog&&O.removeMenus()}}
      @cancel=${()=>O.removeMenus()}
      data-context-dialog
      style="
      width: 0;
      height: 0;
      position: relative;
      padding: 0;
      border: none;
      outline: none;
      margin: none;
      overflow: visible;
      background-color: transparent;
    "
    ></dialog>`),O.menus=[],O);lr([u({type:String,reflect:!0})],_i.prototype,"placement");lr([u({type:Boolean,reflect:!0})],_i.prototype,"visible");let oi=_i;var tl=Object.defineProperty,il=Object.getOwnPropertyDescriptor,D=(t,e,i,r)=>{for(var n=r>1?void 0:r?il(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&tl(e,i,n),n},qe;const B=(qe=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=Le(),this._tooltip=Le(),this._mouseLeave=!1,this.onClick=t=>{t.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const t=this._contextMenu;if(t){const e=this.getAttribute("data-context-group");e&&t.setAttribute("data-context-group",e),this.closeNestedContexts();const i=or.newRandomId();for(const r of t.children)r instanceof qe&&r.setAttribute("data-context-group",i);t.visible=!0}},this.mouseLeave=!0}set loading(t){if(this._loading=t,t)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=t,this.icon="eos-icons:loading";else{const{disabled:e,icon:i}=this._stateBeforeLoading;this.disabled=e,this.icon=i}}get loading(){return this._loading}set mouseLeave(t){this._mouseLeave=t,t&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:t}=this._parent,{value:e}=this._tooltip;t&&e&&Tn(t,e,{placement:"bottom",middleware:[mn(10),On(),An(),kn({padding:5})]}).then(i=>{const{x:r,y:n}=i;Object.assign(e.style,{left:`${r}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const t=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},t)}closeNestedContexts(){const t=this.getAttribute("data-context-group");if(t)for(const e of oi.dialog.children){const i=e.getAttribute("data-context-group");if(e instanceof oi&&i===t){e.visible=!1,e.removeAttribute("data-context-group");for(const r of e.children)r instanceof qe&&(r.closeNestedContexts(),r.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const t=b`
      <div ${je(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?b`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?b`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,e=b`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
      style="fill: var(--bim-label--c)"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`;return b`
      <div ${je(this._parent)} class="parent" @click=${this.onClick}>
        ${this.label||this.icon?b`
              <div
                class="button"
                @mouseenter=${this.onMouseEnter}
                @mouseleave=${()=>this.mouseLeave=!0}
              >
                <bim-label
                  .icon=${this.icon}
                  .vertical=${this.vertical}
                  .labelHidden=${this.labelHidden}
                  >${this.label}${this.label&&this._contextMenu?e:null}</bim-label
                >
              </div>
            `:null}
        ${this.tooltipTitle||this.tooltipText?t:null}
      </div>
      <slot></slot>
    `}},qe.styles=E`
    :host {
      --bim-label--c: var(--bim-ui_bg-contrast-100, white);
      display: block;
      flex: 1;
      pointer-events: none;
      background-color: var(--bim-button--bgc, var(--bim-ui_bg-contrast-20));
      border-radius: var(--bim-ui_size-4xs);
      transition: all 0.15s;
    }

    :host(:not([disabled]):hover) {
      cursor: pointer;
    }

    bim-label {
      pointer-events: none;
    }

    .parent {
      --bim-icon--c: var(--bim-label--c);
      position: relative;
      display: flex;
      height: 100%;
      user-select: none;
      row-gap: 0.125rem;
      min-height: var(--bim-ui_size-5xl);
      min-width: var(--bim-ui_size-5xl);
    }

    .button,
    .children {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
    }

    .children {
      padding: 0 0.375rem;
      position: absolute;
      height: 100%;
      right: 0;
    }

    :host(:not([label-hidden])[icon][vertical]) .parent {
      min-height: 2.5rem;
    }

    .button {
      flex-grow: 1;
    }

    :host(:not([label-hidden])[label]) .button {
      justify-content: var(--bim-button--jc, center);
    }

    :host(:hover),
    :host([active]) {
      --bim-label--c: var(--bim-ui_main-contrast);
      background-color: var(--bim-ui_main-base);
    }

    :host(:not([label]):not([icon])) .children {
      flex: 1;
    }

    :host([vertical]) .parent {
      justify-content: center;
    }

    :host(:not([label-hidden])[label]) .button {
      padding: 0 0.5rem;
    }

    :host([disabled]) {
      --bim-label--c: var(--bim-ui_bg-contrast-80) !important;
      background-color: gray !important;
    }

    ::slotted(bim-button) {
      --bim-icon--fz: var(--bim-ui_size-base);
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
  `,qe);D([u({type:String,reflect:!0})],B.prototype,"label",2);D([u({type:Boolean,attribute:"label-hidden",reflect:!0})],B.prototype,"labelHidden",2);D([u({type:Boolean,reflect:!0})],B.prototype,"active",2);D([u({type:Boolean,reflect:!0,attribute:"disabled"})],B.prototype,"disabled",2);D([u({type:String,reflect:!0})],B.prototype,"icon",2);D([u({type:Boolean,reflect:!0})],B.prototype,"vertical",2);D([u({type:Number,attribute:"tooltip-time",reflect:!0})],B.prototype,"tooltipTime",2);D([u({type:Boolean,attribute:"tooltip-visible",reflect:!0})],B.prototype,"tooltipVisible",2);D([u({type:String,attribute:"tooltip-title",reflect:!0})],B.prototype,"tooltipTitle",2);D([u({type:String,attribute:"tooltip-text",reflect:!0})],B.prototype,"tooltipText",2);D([u({type:Boolean,reflect:!0})],B.prototype,"loading",1);let nl=B;var rl=Object.defineProperty,at=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&rl(e,i,n),n};const ar=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(e){e.stopPropagation(),this.checked=e.target.checked,this.dispatchEvent(this.onValueChange)}render(){return b`
      <div class="parent">
        ${this.label?b`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};ar.styles=E`
    :host {
      display: block;
    }

    .parent {
      display: flex;
      justify-content: space-between;
      height: 1.75rem;
      column-gap: 0.25rem;
      width: 100%;
      align-items: center;
      transition: all 0.15s;
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
      accent-color: var(--bim-checkbox--c, var(--bim-ui_main-base));
      transition: all 0.15s;
    }

    input:focus {
      outline: var(--bim-checkbox--olw, 2px) solid
        var(--bim-checkbox--olc, var(--bim-ui_accent-base));
    }
  `;let Me=ar;at([u({type:String,reflect:!0})],Me.prototype,"icon");at([u({type:String,reflect:!0})],Me.prototype,"name");at([u({type:String,reflect:!0})],Me.prototype,"label");at([u({type:Boolean,reflect:!0})],Me.prototype,"checked");at([u({type:Boolean,reflect:!0})],Me.prototype,"inverted");var sl=Object.defineProperty,Re=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&sl(e,i,n),n};const cr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=Le(),this._textInput=Le(),this.onValueChange=new Event("input"),this.onOpacityInput=e=>{const i=e.target;this.opacity=i.value,this.dispatchEvent(this.onValueChange)}}set value(e){const{color:i,opacity:r}=e;this.color=i,r&&(this.opacity=r)}get value(){const e={color:this.color};return this.opacity&&(e.opacity=this.opacity),e}onColorInput(e){e.stopPropagation();const{value:i}=this._colorInput;i&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}onTextInput(e){e.stopPropagation();const{value:i}=this._textInput;if(!i)return;const{value:r}=i;let n=r.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),i.value=n.slice(0,7),i.value.length===7&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:e}=this._colorInput;e&&e.click()}render(){return b`
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
                ${je(this._colorInput)}
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
                ${je(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?b`<bim-number-input
                  @change=${this.onOpacityInput}
                  slider
                  suffix="%"
                  min="0"
                  value=${this.opacity}
                  max="100"
                ></bim-number-input>`:null}
          </div>
        </bim-input>
      </div>
    `}};cr.styles=E`
    :host {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
      flex: 1;
      display: block;
    }

    :host(:focus) {
      --bim-input--olw: var(--bim-number-input--olw, 2px);
      --bim-input--olc: var(--bim-ui_accent-base);
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
  `;let me=cr;Re([u({type:String,reflect:!0})],me.prototype,"name");Re([u({type:String,reflect:!0})],me.prototype,"label");Re([u({type:String,reflect:!0})],me.prototype,"icon");Re([u({type:Boolean,reflect:!0})],me.prototype,"vertical");Re([u({type:Number,reflect:!0})],me.prototype,"opacity");Re([u({type:String,reflect:!0})],me.prototype,"color");var ol=Object.defineProperty,ll=Object.getOwnPropertyDescriptor,ae=(t,e,i,r)=>{for(var n=r>1?void 0:r?ll(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&ol(e,i,n),n};const ur=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Rt(this.label):this.label}set value(e){this._value=e}render(){return b`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?b` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?b`<bim-checkbox
                    style="pointer-events: none"
                    .checked=${this.checked}
                  ></bim-checkbox>`:null}
              <bim-label
                .vertical=${this.vertical}
                .icon=${this.icon}
                .img=${this.img}
                >${this.label}</bim-label
              >
            </div>`:null}
        ${!this.checkbox&&!this.noMark&&this.checked?b`<svg
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
    `}};ur.styles=E`
    :host {
      --bim-label--c: var(--bim-ui_bg-contrast-100);
      display: block;
      box-sizing: border-box;
      flex: 1;
      padding: 0rem 0.5rem;
      border-radius: var(--bim-ui_size-4xs);
      transition: all 0.15s;
    }

    :host(:hover) {
      cursor: pointer;
      background-color: color-mix(
        in lab,
        var(--bim-selector--bgc, var(--bim-ui_bg-contrast-20)),
        var(--bim-ui_main-base) 10%
      );
    }

    :host([checked]) {
      --bim-label--c: color-mix(in lab, var(--bim-ui_main-base), white 30%);
    }

    :host([checked]) svg {
      fill: color-mix(in lab, var(--bim-ui_main-base), white 30%);
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
      accent-color: var(--bim-checkbox--c, var(--bim-ui_main-base));
    }

    input:focus {
      outline: var(--bim-checkbox--olw, 2px) solid
        var(--bim-checkbox--olc, var(--bim-ui_accent-base));
    }

    bim-label {
      pointer-events: none;
    }
  `;let T=ur;ae([u({type:String,reflect:!0})],T.prototype,"img",2);ae([u({type:String,reflect:!0})],T.prototype,"label",2);ae([u({type:String,reflect:!0})],T.prototype,"icon",2);ae([u({type:Boolean,reflect:!0})],T.prototype,"checked",2);ae([u({type:Boolean,reflect:!0})],T.prototype,"checkbox",2);ae([u({type:Boolean,attribute:"no-mark",reflect:!0})],T.prototype,"noMark",2);ae([u({converter:{fromAttribute(t){return t&&Rt(t)}}})],T.prototype,"value",1);ae([u({type:Boolean,reflect:!0})],T.prototype,"vertical",2);var al=Object.defineProperty,cl=Object.getOwnPropertyDescriptor,ce=(t,e,i,r)=>{for(var n=r>1?void 0:r?cl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&al(e,i,n),n};const dr=class extends kt{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=Le(),this.onOptionClick=e=>{const i=e.target,r=this._value.has(i);if(!this.multiple&&!this.required&&!r)this._value=new Set([i]);else if(!this.multiple&&!this.required&&r)this._value=new Set([]);else if(!this.multiple&&this.required&&!r)this._value=new Set([i]);else if(this.multiple&&!this.required&&!r)this._value=new Set([...this._value,i]);else if(this.multiple&&!this.required&&r){const n=[...this._value].filter(s=>s!==i);this._value=new Set(n)}else if(this.multiple&&this.required&&!r)this._value=new Set([...this._value,i]);else if(this.multiple&&this.required&&r){const n=[...this._value].filter(o=>o!==i),s=new Set(n);s.size!==0&&(this._value=s)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(e){if(e){const{value:i}=this._contextMenu;if(!i)return;for(const r of this.elements)i.append(r);this._visible=!0}else{for(const i of this.elements)this.append(i);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(e){if(this.required&&Object.keys(e).length===0)return;const i=new Set;for(const r of e){const n=this.findOption(r);if(n&&(i.add(n),!this.multiple&&Object.keys(e).length===1))break}this._value=i,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(e=>e instanceof T&&e.checked).map(e=>e.value)}get _options(){const e=new Set([...this.elements]);for(const i of this.children)i instanceof T&&e.add(i);return[...e]}onSlotChange(e){const i=e.target.assignedElements();this.observe(i);const r=new Set;for(const n of this.elements){if(!(n instanceof T)){n.remove();continue}n.checked&&r.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=r}updateOptionsState(){for(const e of this._options)e instanceof T&&(e.checked=this._value.has(e))}findOption(e){return this._options.find(i=>i instanceof T?i.label===e||i.value===e:!1)}render(){let e,i,r;if(this._value.size===0)e="Select an option...";else if(this._value.size===1){const n=[...this._value][0];e=(n==null?void 0:n.label)||(n==null?void 0:n.value),i=n==null?void 0:n.img,r=n==null?void 0:n.icon}else e=`Multiple (${this._value.size})`;return b`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div class="input" @click=${()=>this.visible=!this.visible}>
          <bim-label
            .img=${i}
            .icon=${r}
            style="overflow: hidden;"
            >${e}</bim-label
          >
          <svg
            style="flex-shrink: 0; fill: var(--bim-dropdown--c, var(--bim-ui_bg-contrast-100))"
            xmlns="http://www.w3.org/2000/svg"
            height="1.125rem"
            viewBox="0 0 24 24"
            width="1.125rem"
            fill="#9ca3af"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
          <bim-context-menu
            ${je(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};dr.styles=[le.scrollbar,E`
      :host {
        --bim-input--bgc: var(
          --bim-dropdown--bgc,
          var(--bim-ui_bg-contrast-20)
        );
        --bim-input--olw: 2px;
        --bim-input--olc: transparent;
        --bim-input--bdrs: var(--bim-ui_size-4xs);
        flex: 1;
        display: block;
      }

      :host([visible]) {
        --bim-input--olc: var(--bim-ui_accent-base);
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
    `];let X=dr;ce([u({type:String,reflect:!0})],X.prototype,"name",2);ce([u({type:String,reflect:!0})],X.prototype,"icon",2);ce([u({type:String,reflect:!0})],X.prototype,"label",2);ce([u({type:Boolean,reflect:!0})],X.prototype,"multiple",2);ce([u({type:Boolean,reflect:!0})],X.prototype,"required",2);ce([u({type:Boolean,reflect:!0})],X.prototype,"vertical",2);ce([u({type:Boolean,reflect:!0})],X.prototype,"visible",1);ce([Pe()],X.prototype,"_value",2);var ul=Object.defineProperty,hr=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&ul(e,i,n),n};const pr=class extends w{constructor(){super(...arguments),this.floating=!1,this._layouts={},this._updateFunctions={}}set layouts(e){this._layouts=e;const i={};for(const[r,n]of Object.entries(e))for(const s in n.elements)i[r]||(i[r]={}),i[r][s]=o=>{const l=this._updateFunctions[r];if(!l)return;const a=l[s];a&&a(o)};this.updateComponent=i}get layouts(){return this._layouts}getLayoutAreas(e){const{template:i}=e,r=i.split(`
`).map(n=>n.trim()).map(n=>n.split('"')[1]).filter(n=>n!==void 0).flatMap(n=>n.split(/\s+/));return[...new Set(r)].filter(n=>n!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this._updateFunctions={},this.layouts[this.layout]){this.innerHTML="",this._updateFunctions[this.layout]={};const e=this._updateFunctions[this.layout],i=this.layouts[this.layout],r=this.getLayoutAreas(i).map(n=>{const s=i.elements[n];if(!s)return null;if(s instanceof HTMLElement)return s.style.gridArea=n,s;if("template"in s){const{template:o,initialState:l}=s,[a,c]=kt.create(o,l);return a.style.gridArea=n,e[n]=c,a}return kt.create(s)}).filter(n=>!!n);this.style.gridTemplate=i.template,this.append(...r),this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange)}}else this._updateFunctions={},this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return b`<slot></slot>`}};pr.styles=E`
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
  `;let xi=pr;hr([u({type:Boolean,reflect:!0})],xi.prototype,"floating");hr([u({type:String,reflect:!0})],xi.prototype,"layout");const li=class extends w{render(){return b`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};li.styles=E`
    :host {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
    }

    iconify-icon {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
      color: var(--bim-icon--c);
      transition: all 0.15s;
    }
  `,li.properties={icon:{type:String}};let dl=li;var hl=Object.defineProperty,Bt=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&hl(e,i,n),n};const fr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const e={};for(const i of this.children){const r=i;"value"in r?e[r.name||r.label]=r.value:"checked"in r&&(e[r.name||r.label]=r.checked)}return e}set value(e){const i=[...this.children];for(const r in e){const n=i.find(l=>{const a=l;return a.name===r||a.label===r});if(!n)continue;const s=n,o=e[r];typeof o=="boolean"?s.checked=o:s.value=o}}render(){return b`
      <div class="parent">
        ${this.label||this.icon?b`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};fr.styles=E`
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
      min-width: 3rem;
      gap: var(--bim-input--g, var(--bim-ui_size-4xs));
      padding: var(--bim-input--p, 0);
      background-color: var(--bim-input--bgc, transparent);
      outline: var(--bim-input--olw, 2px) solid
        var(--bim-input--olc, transparent);
      border-radius: var(--bim-input--bdrs, var(--bim-ui_size-4xs));
      transition: all 0.15s;
    }

    :host(:not([vertical])) .input {
      flex: 1;
      justify-content: flex-end;
    }

    :host(:not([vertical])[label]) .input {
      max-width: fit-content;
    }
  `;let ct=fr;Bt([u({type:String,reflect:!0})],ct.prototype,"name");Bt([u({type:String,reflect:!0})],ct.prototype,"label");Bt([u({type:String,reflect:!0})],ct.prototype,"icon");Bt([u({type:Boolean,reflect:!0})],ct.prototype,"vertical");var pl=Object.defineProperty,ut=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&pl(e,i,n),n};const br=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Rt(this.textContent):this.textContent}render(){return b`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?b`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?b`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};br.styles=E`
    :host {
      --bim-icon--c: var(--bim-label--c);
      color: var(--bim-label--c, var(--bim-ui_bg-contrast-60));
      font-size: var(--bim-label--fz, var(--bim-ui_size-xs));
      overflow: hidden;
      display: block;
      white-space: nowrap;
      line-height: 1.1rem;
      transition: all 0.15s;
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

    .parent p {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 0.125rem;
    }

    :host([label-hidden]) .parent p,
    :host(:empty) .parent p {
      display: none;
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
        calc(var(--bim-label--fz, var(--bim-ui_size-xs)) * 1.8)
      );
    }

    :host([vertical]) img {
      max-height: var(
        --bim-label_icon--sz,
        calc(var(--bim-label--fz, var(--bim-ui_size-xs)) * 4)
      );
    }
  `;let Be=br;ut([u({type:String,reflect:!0})],Be.prototype,"img");ut([u({type:Boolean,attribute:"label-hidden",reflect:!0})],Be.prototype,"labelHidden");ut([u({type:String,reflect:!0})],Be.prototype,"icon");ut([u({type:Boolean,attribute:"icon-hidden",reflect:!0})],Be.prototype,"iconHidden");ut([u({type:Boolean,reflect:!0})],Be.prototype,"vertical");var fl=Object.defineProperty,bl=Object.getOwnPropertyDescriptor,H=(t,e,i,r)=>{for(var n=r>1?void 0:r?bl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&fl(e,i,n),n};const mr=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=Le(),this.onValueChange=new Event("change")}set value(e){this.setValue(e.toString())}get value(){return this._value}onChange(e){e.stopPropagation();const{value:i}=this._input;i&&this.setValue(i.value)}setValue(e){const{value:i}=this._input;let r=e;if(r=r.replace(/[^0-9.-]/g,""),r=r.replace(/(\..*)\./g,"$1"),r.endsWith(".")||(r.lastIndexOf("-")>0&&(r=r[0]+r.substring(1).replace(/-/g,"")),r==="-"||r==="-0"))return;let n=Number(r);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,i&&(i.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:e}=this._input;e&&Number.isNaN(Number(e.value))&&(e.value=this.value.toString())}onSliderMouseDown(e){document.body.style.cursor="w-resize";const{clientX:i}=e,r=this.value;let n=!1;const s=a=>{var c;n=!0;const{clientX:d}=a,h=this.step??1,p=((c=h.toString().split(".")[1])==null?void 0:c.length)||0,f=1/(this.sensitivity??1),m=(d-i)/f;if(Math.floor(Math.abs(m))!==Math.abs(m))return;const v=r+m*h;this.setValue(v.toFixed(p))},o=()=>{this.slider=!0,this.removeEventListener("blur",o)},l=()=>{document.removeEventListener("mousemove",s),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",o),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",s),document.addEventListener("mouseup",l)}onFocus(e){e.stopPropagation();const i=r=>{r.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:e}=this._input;e&&e.focus()}render(){const e=b`
      ${this.pref||this.icon?b`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${je(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${l=>l.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.suffix?b`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            >${this.suffix}</bim-label
          >`:null}
    `,i=this.min??-1/0,r=this.max??1/0,n=100*(this.value-i)/(r-i),s=b`
      <style>
        .slider-indicator {
          width: ${`${n}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?b`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .icon=${this.icon}
              >${`${this.pref}: `}</bim-label
            >`:null}
        <bim-label style="z-index: 1;">${this.value}</bim-label>
        ${this.suffix?b`<bim-label style="z-index: 1;">${this.suffix}</bim-label>`:null}
      </div>
    `,o=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return b`
      <bim-input
        title=${o}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?s:e}
      </bim-input>
    `}};mr.styles=E`
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
        var(--bim-ui_accent-base)
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
      padding: 0 0.5rem;
    }

    .slider-indicator {
      height: 100%;
      background-color: var(--bim-ui_main-base);
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
  `;let P=mr;H([u({type:String,reflect:!0})],P.prototype,"name",2);H([u({type:String,reflect:!0})],P.prototype,"icon",2);H([u({type:String,reflect:!0})],P.prototype,"label",2);H([u({type:String,reflect:!0})],P.prototype,"pref",2);H([u({type:Number,reflect:!0})],P.prototype,"min",2);H([u({type:Number,reflect:!0})],P.prototype,"value",1);H([u({type:Number,reflect:!0})],P.prototype,"step",2);H([u({type:Number,reflect:!0})],P.prototype,"sensitivity",2);H([u({type:Number,reflect:!0})],P.prototype,"max",2);H([u({type:String,reflect:!0})],P.prototype,"suffix",2);H([u({type:Boolean,reflect:!0})],P.prototype,"vertical",2);H([u({type:Boolean,reflect:!0})],P.prototype,"slider",2);var ml=Object.defineProperty,gl=Object.getOwnPropertyDescriptor,dt=(t,e,i,r)=>{for(var n=r>1?void 0:r?gl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&ml(e,i,n),n};const gr=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(e){this._hidden=e,this.activationButton.active=!e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return At(this,this.valueTransform)}set value(e){const i=[...this.children];for(const r in e){const n=i.find(o=>{const l=o;return l.name===r||l.label===r});if(!n)continue;const s=n;s.value=e[r]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const e=this.querySelectorAll("bim-panel-section");for(const i of e)i.collapsed=!0}expandSections(){const e=this.querySelectorAll("bim-panel-section");for(const i of e)i.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,b`
      <div class="parent">
        ${this.label||this.name||this.icon?b`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};gr.styles=[le.scrollbar,E`
      :host {
        display: flex;
        border-radius: var(--bim-ui_size-base);
        background-color: var(--bim-ui_bg-base);
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
        overflow: auto;
      }

      .parent bim-label {
        --bim-label--c: var(--bim-panel--c, var(--bim-ui_bg-contrast-80));
        --bim-label--fz: var(--bim-panel--fz, var(--bim-ui_size-sm));
        font-weight: 600;
        padding: 1rem;
        flex-shrink: 0;
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      }

      :host([header-hidden]) .parent bim-label {
        display: none;
      }

      .sections {
        display: flex;
        flex-direction: column;
        overflow: auto;
      }

      ::slotted(bim-panel-section:not(:last-child)) {
        border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      }
    `];let ge=gr;dt([u({type:String,reflect:!0})],ge.prototype,"icon",2);dt([u({type:String,reflect:!0})],ge.prototype,"name",2);dt([u({type:String,reflect:!0})],ge.prototype,"label",2);dt([u({type:Boolean,reflect:!0})],ge.prototype,"hidden",1);dt([u({type:Boolean,attribute:"header-hidden",reflect:!0})],ge.prototype,"headerHidden",2);var vl=Object.defineProperty,ht=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&vl(e,i,n),n};const vr=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const e=this.parentElement;let i;return e instanceof ge&&(i=e.valueTransform),Object.values(this.valueTransform).length!==0&&(i=this.valueTransform),At(this,i)}set value(e){const i=[...this.children];for(const r in e){const n=i.find(o=>{const l=o;return l.name===r||l.label===r});if(!n)continue;const s=n;s.value=e[r]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const e=this.label||this.icon||this.name||this.fixed,i=b`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,r=b`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?i:r,s=b`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?b`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return b`
      <div class="parent">
        ${e?s:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};vr.styles=[le.scrollbar,E`
      :host {
        display: block;
        pointer-events: auto;
      }

      :host(:not([fixed])) .header:hover {
        --bim-label--c: var(--bim-ui_accent-base);
        color: var(--bim-ui_accent-base);
        cursor: pointer;
      }

      :host(:not([fixed])) .header:hover svg {
        fill: var(--bim-ui_accent-base);
      }

      .header {
        --bim-label--fz: var(--bim-ui_size-sm);
        --bim-label--c: var(--bim-ui_bg-contrast-80);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        height: 1.5rem;
        padding: 0.75rem 1rem;
      }

      .header svg {
        fill: var(--bim-ui_bg-contrast-80);
      }

      .title {
        display: flex;
        align-items: center;
        column-gap: 0.5rem;
      }

      .title p {
        font-size: var(--bim-ui_size-sm);
      }

      .components {
        display: flex;
        flex-direction: column;
        row-gap: 0.75rem;
        padding: 0.125rem 1rem 1rem;
      }

      :host(:not([fixed])[collapsed]) .components {
        display: none;
        height: 0px;
      }

      bim-label {
        pointer-events: none;
      }
    `];let He=vr;ht([u({type:String,reflect:!0})],He.prototype,"icon");ht([u({type:String,reflect:!0})],He.prototype,"label");ht([u({type:String,reflect:!0})],He.prototype,"name");ht([u({type:Boolean,reflect:!0})],He.prototype,"fixed");ht([u({type:Boolean,reflect:!0})],He.prototype,"collapsed");var yl=Object.defineProperty,pt=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&yl(e,i,n),n};const yr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=e=>{this._value=e.target,this.dispatchEvent(this.onValueChange);for(const i of this.children)i instanceof T&&(i.checked=i===e.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(e){const i=this.findOption(e);if(i){for(const r of this._options)r.checked=r===i;this._value=i,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(e){const i=e.target.assignedElements();for(const r of i)r instanceof T&&(r.noMark=!0,r.removeEventListener("click",this.onOptionClick),r.addEventListener("click",this.onOptionClick))}findOption(e){return this._options.find(i=>i instanceof T?i.label===e||i.value===e:!1)}firstUpdated(){const e=[...this.children].find(i=>i instanceof T&&i.checked);e&&(this._value=e)}render(){return b`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};yr.styles=E`
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
      --bim-label--c: var(--bim-ui_main-contrast);
      background-color: var(--bim-ui_main-base);
    }
  `;let Ne=yr;pt([u({type:String,reflect:!0})],Ne.prototype,"name");pt([u({type:String,reflect:!0})],Ne.prototype,"icon");pt([u({type:String,reflect:!0})],Ne.prototype,"label");pt([u({type:Boolean,reflect:!0})],Ne.prototype,"vertical");pt([Pe()],Ne.prototype,"_value");const _l=()=>b`
    <style>
      div {
        display: flex;
        gap: 0.375rem;
        border-radius: 0.25rem;
        min-height: 1.25rem;
      }

      [data-type="row"] {
        background-color: var(--bim-ui_bg-contrast-10);
        animation: row-loading 1s linear infinite alternate;
        padding: 0.5rem;
      }

      [data-type="cell"] {
        background-color: var(--bim-ui_bg-contrast-20);
        flex: 0.25;
      }

      @keyframes row-loading {
        0% {
          background-color: var(--bim-ui_bg-contrast-10);
        }
        100% {
          background-color: var(--bim-ui_bg-contrast-20);
        }
      }
    </style>
    <div style="display: flex; flex-direction: column;">
      <div data-type="row" style="gap: 2rem">
        <div data-type="cell" style="flex: 1"></div>
        <div data-type="cell" style="flex: 2"></div>
        <div data-type="cell" style="flex: 1"></div>
        <div data-type="cell" style="flex: 0.5"></div>
      </div>
      <div style="display: flex;">
        <div data-type="row" style="flex: 1">
          <div data-type="cell" style="flex: 0.5"></div>
        </div>
        <div data-type="row" style="flex: 2">
          <div data-type="cell" style="flex: 0.75"></div>
        </div>
        <div data-type="row" style="flex: 1">
          <div data-type="cell"></div>
        </div>
        <div data-type="row" style="flex: 0.5">
          <div data-type="cell" style="flex: 0.75"></div>
        </div>
      </div>
      <div style="display: flex;">
        <div data-type="row" style="flex: 1">
          <div data-type="cell" style="flex: 0.75"></div>
        </div>
        <div data-type="row" style="flex: 2">
          <div data-type="cell"></div>
        </div>
        <div data-type="row" style="flex: 1">
          <div data-type="cell" style="flex: 0.5"></div>
        </div>
        <div data-type="row" style="flex: 0.5">
          <div data-type="cell" style="flex: 0.5"></div>
        </div>
      </div>
      <div style="display: flex;">
        <div data-type="row" style="flex: 1">
          <div data-type="cell"></div>
        </div>
        <div data-type="row" style="flex: 2">
          <div data-type="cell" style="flex: 0.5"></div>
        </div>
        <div data-type="row" style="flex: 1">
          <div data-type="cell" style="flex: 0.75"></div>
        </div>
        <div data-type="row" style="flex: 0.5">
          <div data-type="cell" style="flex: 0.7s5"></div>
        </div>
      </div>
    </div>
  `,xl=()=>b`
    <style>
      .loader {
        grid-area: Processing;
        position: relative;
        padding: 0.125rem;
      }
      .loader:before {
        content: "";
        position: absolute;
      }
      .loader .loaderBar {
        position: absolute;
        top: 0;
        right: 100%;
        bottom: 0;
        left: 0;
        background: var(--bim-ui_main-base);
        /* width: 25%; */
        width: 0;
        animation: borealisBar 2s linear infinite;
      }

      @keyframes borealisBar {
        0% {
          left: 0%;
          right: 100%;
          width: 0%;
        }
        10% {
          left: 0%;
          right: 75%;
          width: 25%;
        }
        90% {
          right: 0%;
          left: 75%;
          width: 25%;
        }
        100% {
          left: 100%;
          right: 0%;
          width: 0%;
        }
      }
    </style>
    <div class="loader">
      <div class="loaderBar"></div>
    </div>
  `;var wl=Object.defineProperty,$l=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&wl(e,i,n),n};const _r=class extends w{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return b`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};_r.styles=E`
    :host {
      padding: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([data-column-index="0"]) {
      justify-content: normal;
    }

    :host([data-column-index="0"]:not([data-cell-header]))
      ::slotted(bim-label) {
      text-align: left;
    }

    ::slotted(*) {
      --bim-input--bgc: transparent;
      --bim-input--olc: var(--bim-ui_bg-contrast-20);
      --bim-input--olw: 1px;
    }

    ::slotted(bim-input) {
      --bim-input--olw: 0;
    }

    ::slotted(bim-label) {
      white-space: normal;
      text-align: center;
    }
  `;let xr=_r;$l([u({type:String,reflect:!0})],xr.prototype,"column");var El=Object.defineProperty,Cl=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&El(e,i,n),n};const wr=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(e,i=!1){for(const r of this._groups)r.childrenHidden=typeof e>"u"?!r.childrenHidden:!e,i&&r.toggleChildren(e,i)}render(){return this._groups=[],b`
      <slot></slot>
      ${this.data.map(e=>{const i=document.createElement("bim-table-group");return this._groups.push(i),i.table=this.table,i.data=e,i})}
    `}};wr.styles=E`
    :host {
      --bim-button--bgc: transparent;
      position: relative;
      grid-area: Children;
    }

    :host([hidden]) {
      display: none;
    }

    ::slotted(.branch.branch-vertical) {
      top: 0;
      bottom: 1.125rem;
    }
  `;let $r=wr;Cl([u({type:Array,attribute:!1})],$r.prototype,"data");var Sl=Object.defineProperty,kl=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&Sl(e,i,n),n};const Er=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(e,i=!1){this._children&&(this.childrenHidden=typeof e>"u"?!this.childrenHidden:!e,i&&this._children.toggleGroups(e,i))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const e=this.table.getGroupIndentation(this.data)??0,i=b`
      ${this.table.noIndentation?null:b`
            <style>
              .branch-vertical {
                left: ${e+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,r=document.createDocumentFragment();ze(i,r);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${e-1+(this.table.selectableRows?2.05:.5625)}rem`);let s=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(c);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const h=document.createElementNS("http://www.w3.org/2000/svg","path");h.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(h),s=document.createElement("div"),s.addEventListener("click",p=>{p.stopPropagation(),this.toggleChildren()}),s.classList.add("caret"),s.style.left=`${(this.table.selectableRows?1.5:.125)+e}rem`,this.childrenHidden?s.append(a):s.append(d)}const o=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&o.append(r),o.table=this.table,o.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:o}})),s&&this.data.children&&o.append(s),e!==0&&(!this.data.children||this.childrenHidden)&&n&&o.append(n);let l;if(this.data.children){l=document.createElement("bim-table-children"),this._children=l,l.table=this.table,l.data=this.data.children;const a=document.createDocumentFragment();ze(i,a),l.append(a)}return b`
      <div class="parent">${o} ${this.childrenHidden?null:l}</div>
    `}};Er.styles=E`
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
  `;let Cr=Er;kl([u({type:Boolean,attribute:"children-hidden",reflect:!0})],Cr.prototype,"childrenHidden");var Al=Object.defineProperty,Ie=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&Al(e,i,n),n};const Sr=class extends w{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(e=>{this._intersecting=e[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.name)}get _columnWidths(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.width)}get _isSelected(){var e;return(e=this.table)==null?void 0:e.selection.has(this.data)}onSelectionChange(e){if(!this.table)return;const i=e.target;this.selected=i.value,i.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const e=this.table.getRowIndentation(this.data)??0,i=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,r=[];for(const n in i){if(this.hiddenColumns.includes(n))continue;const s=i[n];let o;if(typeof s=="string"||typeof s=="boolean"||typeof s=="number"?(o=document.createElement("bim-label"),o.textContent=String(s)):s instanceof HTMLElement?o=s:(o=document.createDocumentFragment(),ze(s,o)),!o)continue;const l=document.createElement("bim-table-cell");l.append(o),l.column=n,this._columnNames.indexOf(n)===0&&(l.style.marginLeft=`${this.table.noIndentation?0:e+.75}rem`);const a=this._columnNames.indexOf(n);l.setAttribute("data-column-index",String(a)),l.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),l.toggleAttribute("data-cell-header",this.isHeader),l.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:l}})),r.push(l)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,b`
      ${!this.isHeader&&this.table.selectableRows?b`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${r}
      <slot></slot>
    `}render(){return b`${this._intersecting?this.compute():b``}`}};Sr.styles=E`
    :host {
      position: relative;
      grid-area: Data;
      display: grid;
      min-height: 2.25rem;
      transition: all 0.15s;
    }

    ::slotted(.branch.branch-vertical) {
      top: 50%;
      bottom: 0;
    }

    :host([selected]) {
      background-color: color-mix(
        in lab,
        var(--bim-ui_bg-contrast-20) 30%,
        var(--bim-ui_main-base) 10%
      );
    }
  `;let ve=Sr;Ie([u({type:Boolean,reflect:!0})],ve.prototype,"selected");Ie([u({attribute:!1})],ve.prototype,"columns");Ie([u({attribute:!1})],ve.prototype,"hiddenColumns");Ie([u({attribute:!1})],ve.prototype,"data");Ie([u({type:Boolean,attribute:"is-header",reflect:!0})],ve.prototype,"isHeader");Ie([Pe()],ve.prototype,"_intersecting");var Ol=Object.defineProperty,Tl=Object.getOwnPropertyDescriptor,U=(t,e,i,r)=>{for(var n=r>1?void 0:r?Tl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&Ol(e,i,n),n};const kr=class extends w{constructor(){super(...arguments),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(e,i)=>Object.values(i.data).some(r=>String(r).toLowerCase().includes(e.toLowerCase())),this._queryFilterFunction=(e,i)=>{let r=!1;const n=si(e)??[];for(const s of n){if("queries"in s){r=!1;break}const{condition:o,value:l}=s;let{key:a}=s;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,r=Object.keys(i.data).filter(d=>d.includes(c)).map(d=>an(i.data[d],o,l)).some(d=>d)}else r=an(i.data[a],o,l);if(!r)break}return r}}set columns(e){const i=[];for(const r of e){const n=typeof r=="string"?{name:r,width:`minmax(${this.minColWidth}, 1fr)`}:r;i.push(n)}this._columns=i,this.computeMissingColumns(this.data),this.dispatchEvent(new Event("columnschange"))}get columns(){return this._columns}get _headerRowData(){const e={};for(const i of this.columns){const{name:r}=i;e[r]=String(r)}return e}get value(){return this._filteredData}set queryString(e){this.toggleAttribute("data-processing",!0),this._queryString=e&&e.trim()!==""?e.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(e){this._data=e,this.updateFilteredData(),this.computeMissingColumns(e)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(e=>{setTimeout(()=>{e(this.data)})})}set hiddenColumns(e){this._hiddenColumns=e,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(si(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(e){let i=!1;for(const r of e){const{children:n,data:s}=r;for(const o in s)this._columns.map(l=>typeof l=="string"?l:l.name).includes(o)||(this._columns.push({name:o,width:`minmax(${this.minColWidth}, 1fr)`}),i=!0);if(n){const o=this.computeMissingColumns(n);o&&!i&&(i=o)}}return i}generateText(e="comma",i=this.value,r="",n=!0){const s=this._textDelimiters[e];let o="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(o+=`Indentation${s}`);const a=`${l.join(s)}
`;o+=a}for(const[a,c]of i.entries()){const{data:d,children:h}=c,p=this.indentationInText?`${r}${a+1}${s}`:"",f=l.map(v=>d[v]??""),m=`${p}${f.join(s)}
`;o+=m,h&&(o+=this.generateText(e,c.children,`${r}${a+1}.`,!1))}return o}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(e){const i={};for(const n of Object.keys(this.dataTransform)){const s=this.columns.find(o=>o.name===n);s&&s.forceDataTransform&&(n in e||(e[n]=""))}const r=e;for(const n in r){const s=this.dataTransform[n];s?i[n]=s(r[n],e):i[n]=e[n]}return i}downloadData(e="BIM Table Data",i="json"){let r=null;if(i==="json"&&(r=new File([JSON.stringify(this.value,void 0,2)],`${e}.json`)),i==="csv"&&(r=new File([this.csv],`${e}.csv`)),i==="tsv"&&(r=new File([this.tsv],`${e}.tsv`)),!r)return;const n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=r.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(e,i=this.value,r=0){for(const n of i){if(n.data===e)return r;if(n.children){const s=this.getRowIndentation(e,n.children,r+1);if(s!==null)return s}}return null}getGroupIndentation(e,i=this.value,r=0){for(const n of i){if(n===e)return r;if(n.children){const s=this.getGroupIndentation(e,n.children,r+1);if(s!==null)return s}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(e=!1){if(this._filteredData.length!==0&&!e||!this.loadFunction)return!1;this.loading=!0;try{const i=await this.loadFunction();return this.data=i,this.loading=!1,this._errorLoading=!1,!0}catch(i){if(this.loading=!1,this._filteredData.length!==0)return!1;const r=this.querySelector("[slot='error-loading']"),n=r==null?void 0:r.querySelector("[data-table-element='error-message']");return i instanceof Error&&n&&i.message.trim()!==""&&(n.textContent=i.message),this._errorLoading=!0,!1}}filter(e,i=this.filterFunction??this._stringFilterFunction,r=this.data){const n=[];for(const s of r)if(i(e,s)){if(this.preserveStructureOnFilter){const o={data:s.data};if(s.children){const l=this.filter(e,i,s.children);l.length&&(o.children=l)}n.push(o)}else if(n.push({data:s.data}),s.children){const o=this.filter(e,i,s.children);n.push(...o)}}else if(s.children){const o=this.filter(e,i,s.children);this.preserveStructureOnFilter&&o.length?n.push({data:s.data,children:o}):n.push(...o)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return _l();if(this._errorLoading)return b`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return b`<slot name="missing-data"></slot>`;const e=document.createElement("bim-table-row");e.table=this,e.isHeader=!0,e.data=this._headerRowData,e.style.gridArea="Header",e.style.position="sticky",e.style.top="0",e.style.zIndex="5";const i=document.createElement("bim-table-children");return i.table=this,i.data=this.value,i.style.gridArea="Body",i.style.backgroundColor="transparent",b`
      <div class="parent">
        ${this.headersHidden?null:e} ${xl()}
        <div style="overflow-x: hidden; grid-area: Body">${i}</div>
      </div>
    `}};kr.styles=[le.scrollbar,E`
      :host {
        position: relative;
        overflow: auto;
        display: block;
        pointer-events: auto;
      }

      :host(:not([data-processing])) .loader {
        display: none;
      }

      .parent {
        display: grid;
        grid-template:
          "Header" auto
          "Processing" auto
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
    `];let N=kr;U([Pe()],N.prototype,"_filteredData",2);U([u({type:Boolean,attribute:"headers-hidden",reflect:!0})],N.prototype,"headersHidden",2);U([u({type:String,attribute:"min-col-width",reflect:!0})],N.prototype,"minColWidth",2);U([u({type:Array,attribute:!1})],N.prototype,"columns",1);U([u({type:Array,attribute:!1})],N.prototype,"data",1);U([u({type:Boolean,reflect:!0})],N.prototype,"expanded",2);U([u({type:Boolean,reflect:!0,attribute:"selectable-rows"})],N.prototype,"selectableRows",2);U([u({attribute:!1})],N.prototype,"selection",2);U([u({type:Boolean,attribute:"no-indentation",reflect:!0})],N.prototype,"noIndentation",2);U([u({type:Boolean,reflect:!0})],N.prototype,"loading",2);U([Pe()],N.prototype,"_errorLoading",2);var zl=Object.defineProperty,Ll=Object.getOwnPropertyDescriptor,Ht=(t,e,i,r)=>{for(var n=r>1?void 0:r?Ll(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&zl(e,i,n),n};const Ar=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:e}=this;if(e&&this.name===this._defaultName){const i=[...e.children].indexOf(this);this.name=`${this._defaultName}${i}`}}render(){return b` <slot></slot> `}};Ar.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let M=Ar;Ht([u({type:String,reflect:!0})],M.prototype,"name",2);Ht([u({type:String,reflect:!0})],M.prototype,"label",2);Ht([u({type:String,reflect:!0})],M.prototype,"icon",2);Ht([u({type:Boolean,reflect:!0})],M.prototype,"hidden",1);var jl=Object.defineProperty,Pl=Object.getOwnPropertyDescriptor,Fe=(t,e,i,r)=>{for(var n=r>1?void 0:r?Pl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&jl(e,i,n),n};const Or=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=e=>{const i=e.target;i instanceof M&&!i.hidden&&(i.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=i.name,i.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(e){this._tab=e;const i=[...this.children],r=i.find(n=>n instanceof M&&n.name===e);for(const n of i){if(!(n instanceof M))continue;n.hidden=r!==n;const s=this.getTabSwitcher(n.name);s&&s.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(e){return this._switchers.find(i=>i.getAttribute("data-name")===e)}createSwitchers(){this._switchers=[];for(const e of this.children){if(!(e instanceof M))continue;const i=document.createElement("div");i.addEventListener("click",()=>{this.tab===e.name?this.toggleAttribute("tab",!1):this.tab=e.name}),i.setAttribute("data-name",e.name),i.className="switcher";const r=document.createElement("bim-label");r.textContent=e.label??"",r.icon=e.icon,i.append(r),this._switchers.push(i)}}onSlotChange(e){this.createSwitchers();const i=e.target.assignedElements(),r=i.find(n=>n instanceof M?this.tab?n.name===this.tab:!n.hidden:!1);r&&r instanceof M&&(this.tab=r.name);for(const n of i){if(!(n instanceof M)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),r!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return b`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Or.styles=[le.scrollbar,E`
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
        --bim-label--c: var(--bim-ui_bg-contrast-80);
        background-color: var(--bim-ui_bg-base);
        cursor: pointer;
        pointer-events: auto;
        padding: 0rem 0.75rem;
        display: flex;
        justify-content: center;
        transition: all 0.15s;
      }

      :host([switchers-full]) .switcher {
        flex: 1;
      }

      .switcher:hover,
      .switcher[data-active] {
        --bim-label--c: var(--bim-ui_main-contrast);
        background-color: var(--bim-ui_main-base);
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
    `];let ye=Or;Fe([Pe()],ye.prototype,"_switchers",2);Fe([u({type:Boolean,reflect:!0})],ye.prototype,"bottom",2);Fe([u({type:Boolean,attribute:"switchers-hidden",reflect:!0})],ye.prototype,"switchersHidden",2);Fe([u({type:Boolean,reflect:!0})],ye.prototype,"floating",2);Fe([u({type:String,reflect:!0})],ye.prototype,"tab",1);Fe([u({type:Boolean,attribute:"switchers-full",reflect:!0})],ye.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cn=t=>t??A;var Ml=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,K=(t,e,i,r)=>{for(var n=r>1?void 0:r?Rl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&Ml(e,i,n),n};const Tr=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(e){this._inputTypes.includes(e)&&(this._type=e)}get type(){return this._type}get query(){return si(this.value)}onInputChange(e){e.stopPropagation();const i=e.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=i.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var e;const i=(e=this.shadowRoot)==null?void 0:e.querySelector("input");i==null||i.focus()})}render(){return b`
      <bim-input
        .name=${this.name}
        .icon=${this.icon}
        .label=${this.label}
        .vertical=${this.vertical}
      >
        ${this.type==="area"?b` <textarea
              aria-label=${this.label||this.name||"Text Input"}
              .value=${this.value}
              .rows=${this.rows??5}
              placeholder=${cn(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:b` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${cn(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};Tr.styles=[le.scrollbar,E`
      :host {
        --bim-input--bgc: var(--bim-ui_bg-contrast-20);
        flex: 1;
        display: block;
      }

      input,
      textarea {
        font-family: inherit;
        background-color: transparent;
        border: none;
        width: 100%;
        padding: var(--bim-ui_size-3xs);
        color: var(--bim-text-input--c, var(--bim-ui_bg-contrast-100));
      }

      input {
        outline: none;
        height: 100%;
        padding: 0 var(--bim-ui_size-3xs); /* Override padding */
        border-radius: var(--bim-text-input--bdrs, var(--bim-ui_size-4xs));
      }

      textarea {
        line-height: 1.1rem;
        resize: vertical;
      }

      :host(:focus) {
        --bim-input--olc: var(--bim-ui_accent-base);
      }

      /* :host([disabled]) {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
    } */
    `];let G=Tr;K([u({type:String,reflect:!0})],G.prototype,"icon",2);K([u({type:String,reflect:!0})],G.prototype,"label",2);K([u({type:String,reflect:!0})],G.prototype,"name",2);K([u({type:String,reflect:!0})],G.prototype,"placeholder",2);K([u({type:String,reflect:!0})],G.prototype,"value",2);K([u({type:Boolean,reflect:!0})],G.prototype,"vertical",2);K([u({type:Number,reflect:!0})],G.prototype,"debounce",2);K([u({type:Number,reflect:!0})],G.prototype,"rows",2);K([u({type:String,reflect:!0})],G.prototype,"type",1);var Bl=Object.defineProperty,Hl=Object.getOwnPropertyDescriptor,zr=(t,e,i,r)=>{for(var n=r>1?void 0:r?Hl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&Bl(e,i,n),n};const Lr=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const e=this.children;for(const i of e)this.vertical?i.setAttribute("label-hidden",""):i.removeAttribute("label-hidden")}render(){return b`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};Lr.styles=E`
    .parent {
      display: grid;
      gap: 0.25rem;
    }

    ::slotted(bim-button[label]:not([vertical])) {
      --bim-button--jc: flex-start;
    }

    ::slotted(bim-button) {
      --bim-label--c: var(--bim-ui_bg-contrast-80);
    }
  `;let Nt=Lr;zr([u({type:Number,reflect:!0})],Nt.prototype,"rows",2);zr([u({type:Boolean,reflect:!0})],Nt.prototype,"vertical",1);var Nl=Object.defineProperty,Il=Object.getOwnPropertyDescriptor,It=(t,e,i,r)=>{for(var n=r>1?void 0:r?Il(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&Nl(e,i,n),n};const jr=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(e){this._labelHidden=e,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const e=this.children;for(const i of e)i instanceof Nt&&(i.vertical=this.vertical),i.toggleAttribute("label-hidden",this.vertical)}render(){return b`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?b`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};jr.styles=E`
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

    ::slotted(bim-button) {
      --bim-label--c: var(--bim-ui_bg-contrast-80);
    }

    .parent {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      padding: 0.5rem;
      height: 100%;
      box-sizing: border-box;
      justify-content: space-between;
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
  `;let De=jr;It([u({type:String,reflect:!0})],De.prototype,"label",2);It([u({type:String,reflect:!0})],De.prototype,"icon",2);It([u({type:Boolean,reflect:!0})],De.prototype,"vertical",1);It([u({type:Boolean,attribute:"label-hidden",reflect:!0})],De.prototype,"labelHidden",1);var Fl=Object.defineProperty,Dl=Object.getOwnPropertyDescriptor,wi=(t,e,i,r)=>{for(var n=r>1?void 0:r?Dl(e,i):e,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=(r?o(e,i,n):o(n))||n);return r&&n&&Fl(e,i,n),n};const Pr=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(e){this._vertical=e,this.updateSections()}get vertical(){return this._vertical}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const e=this.children;for(const i of e)i instanceof De&&(i.labelHidden=this.vertical&&!or.config.sectionLabelOnVerticalToolbar,i.vertical=this.vertical)}render(){return b`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Pr.styles=E`
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
      pointer-events: auto;
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
  `;let Ft=Pr;wi([u({type:String,reflect:!0})],Ft.prototype,"icon",2);wi([u({type:Boolean,attribute:"labels-hidden",reflect:!0})],Ft.prototype,"labelsHidden",2);wi([u({type:Boolean,reflect:!0})],Ft.prototype,"vertical",1);var Ul=Object.defineProperty,Vl=(t,e,i,r)=>{for(var n=void 0,s=t.length-1,o;s>=0;s--)(o=t[s])&&(n=o(e,i,n)||n);return n&&Ul(e,i,n),n};const Mr=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return b`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Mr.styles=E`
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
  `;let Rr=Mr;Vl([u({type:String,reflect:!0})],Rr.prototype,"name");export{kt as L,or as T,b as m};
