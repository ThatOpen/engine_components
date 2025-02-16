var No=Object.defineProperty,Io=(e,t,i)=>t in e?No(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,ht=(e,t,i)=>(Io(e,typeof t!="symbol"?t+"":t,i),i);const Ct=Math.min,Q=Math.max,ve=Math.round,nt=e=>({x:e,y:e}),Fo={left:"right",right:"left",bottom:"top",top:"bottom"},Do={start:"end",end:"start"};function $i(e,t,i){return Q(e,Ct(t,i))}function ne(e,t){return typeof e=="function"?e(t):e}function J(e){return e.split("-")[0]}function Oe(e){return e.split("-")[1]}function hn(e){return e==="x"?"y":"x"}function dn(e){return e==="y"?"height":"width"}function bt(e){return["top","bottom"].includes(J(e))?"y":"x"}function un(e){return hn(bt(e))}function Uo(e,t,i){i===void 0&&(i=!1);const o=Oe(e),n=un(e),r=dn(n);let s=n==="x"?o===(i?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[r]>t.floating[r]&&(s=ye(s)),[s,ye(s)]}function Vo(e){const t=ye(e);return[Ge(e),t,Ge(t)]}function Ge(e){return e.replace(/start|end/g,t=>Do[t])}function qo(e,t,i){const o=["left","right"],n=["right","left"],r=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return i?t?n:o:t?o:n;case"left":case"right":return t?r:s;default:return[]}}function Wo(e,t,i,o){const n=Oe(e);let r=qo(J(e),i==="start",o);return n&&(r=r.map(s=>s+"-"+n),t&&(r=r.concat(r.map(Ge)))),r}function ye(e){return e.replace(/left|right|bottom|top/g,t=>Fo[t])}function Yo(e){return{top:0,right:0,bottom:0,left:0,...e}}function pn(e){return typeof e!="number"?Yo(e):{top:e,right:e,bottom:e,left:e}}function St(e){const{x:t,y:i,width:o,height:n}=e;return{width:o,height:n,top:i,left:t,right:t+o,bottom:i+n,x:t,y:i}}function Ei(e,t,i){let{reference:o,floating:n}=e;const r=bt(t),s=un(t),l=dn(s),a=J(t),c=r==="y",d=o.x+o.width/2-n.width/2,u=o.y+o.height/2-n.height/2,p=o[l]/2-n[l]/2;let b;switch(a){case"top":b={x:d,y:o.y-n.height};break;case"bottom":b={x:d,y:o.y+o.height};break;case"right":b={x:o.x+o.width,y:u};break;case"left":b={x:o.x-n.width,y:u};break;default:b={x:o.x,y:o.y}}switch(Oe(t)){case"start":b[s]-=p*(i&&c?-1:1);break;case"end":b[s]+=p*(i&&c?-1:1);break}return b}const Go=async(e,t,i)=>{const{placement:o="bottom",strategy:n="absolute",middleware:r=[],platform:s}=i,l=r.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:e,floating:t,strategy:n}),{x:d,y:u}=Ei(c,o,a),p=o,b={},m=0;for(let v=0;v<l.length;v++){const{name:g,fn:k}=l[v],{x:C,y:x,data:$,reset:z}=await k({x:d,y:u,initialPlacement:o,placement:p,strategy:n,middlewareData:b,rects:c,platform:s,elements:{reference:e,floating:t}});d=C??d,u=x??u,b={...b,[g]:{...b[g],...$}},z&&m<=50&&(m++,typeof z=="object"&&(z.placement&&(p=z.placement),z.rects&&(c=z.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:n}):z.rects),{x:d,y:u}=Ei(c,p,a)),v=-1)}return{x:d,y:u,placement:p,strategy:n,middlewareData:b}};async function bn(e,t){var i;t===void 0&&(t={});const{x:o,y:n,platform:r,rects:s,elements:l,strategy:a}=e,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:p=!1,padding:b=0}=ne(t,e),m=pn(b),v=l[p?u==="floating"?"reference":"floating":u],g=St(await r.getClippingRect({element:(i=await(r.isElement==null?void 0:r.isElement(v)))==null||i?v:v.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:d,strategy:a})),k=u==="floating"?{x:o,y:n,width:s.floating.width,height:s.floating.height}:s.reference,C=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),x=await(r.isElement==null?void 0:r.isElement(C))?await(r.getScale==null?void 0:r.getScale(C))||{x:1,y:1}:{x:1,y:1},$=St(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:k,offsetParent:C,strategy:a}):k);return{top:(g.top-$.top+m.top)/x.y,bottom:($.bottom-g.bottom+m.bottom)/x.y,left:(g.left-$.left+m.left)/x.x,right:($.right-g.right+m.right)/x.x}}const Qo=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,o;const{placement:n,middlewareData:r,rects:s,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:p,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...g}=ne(e,t);if((i=r.arrow)!=null&&i.alignmentOffset)return{};const k=J(n),C=bt(l),x=J(l)===l,$=await(a.isRTL==null?void 0:a.isRTL(c.floating)),z=p||(x||!v?[ye(l)]:Vo(l)),y=m!=="none";!p&&y&&z.push(...Wo(l,v,m,$));const L=[l,...z],I=await bn(t,g),F=[];let S=((o=r.flip)==null?void 0:o.overflows)||[];if(d&&F.push(I[k]),u){const V=Uo(n,s,$);F.push(I[V[0]],I[V[1]])}if(S=[...S,{placement:n,overflows:F}],!F.every(V=>V<=0)){var _t,Ut;const V=(((_t=r.flip)==null?void 0:_t.index)||0)+1,wt=L[V];if(wt)return{data:{index:V,overflows:S},reset:{placement:wt}};let Z=(Ut=S.filter(tt=>tt.overflows[0]<=0).sort((tt,q)=>tt.overflows[1]-q.overflows[1])[0])==null?void 0:Ut.placement;if(!Z)switch(b){case"bestFit":{var xt;const tt=(xt=S.filter(q=>{if(y){const et=bt(q.placement);return et===C||et==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(et=>et>0).reduce((et,Ho)=>et+Ho,0)]).sort((q,et)=>q[1]-et[1])[0])==null?void 0:xt[0];tt&&(Z=tt);break}case"initialPlacement":Z=l;break}if(n!==Z)return{reset:{placement:Z}}}return{}}}};function fn(e){const t=Ct(...e.map(r=>r.left)),i=Ct(...e.map(r=>r.top)),o=Q(...e.map(r=>r.right)),n=Q(...e.map(r=>r.bottom));return{x:t,y:i,width:o-t,height:n-i}}function Jo(e){const t=e.slice().sort((n,r)=>n.y-r.y),i=[];let o=null;for(let n=0;n<t.length;n++){const r=t[n];!o||r.y-o.y>o.height/2?i.push([r]):i[i.length-1].push(r),o=r}return i.map(n=>St(fn(n)))}const Xo=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:o,rects:n,platform:r,strategy:s}=t,{padding:l=2,x:a,y:c}=ne(e,t),d=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(o.reference))||[]),u=Jo(d),p=St(fn(d)),b=pn(l);function m(){if(u.length===2&&u[0].left>u[1].right&&a!=null&&c!=null)return u.find(g=>a>g.left-b.left&&a<g.right+b.right&&c>g.top-b.top&&c<g.bottom+b.bottom)||p;if(u.length>=2){if(bt(i)==="y"){const S=u[0],_t=u[u.length-1],Ut=J(i)==="top",xt=S.top,V=_t.bottom,wt=Ut?S.left:_t.left,Z=Ut?S.right:_t.right,tt=Z-wt,q=V-xt;return{top:xt,bottom:V,left:wt,right:Z,width:tt,height:q,x:wt,y:xt}}const g=J(i)==="left",k=Q(...u.map(S=>S.right)),C=Ct(...u.map(S=>S.left)),x=u.filter(S=>g?S.left===C:S.right===k),$=x[0].top,z=x[x.length-1].bottom,y=C,L=k,I=L-y,F=z-$;return{top:$,bottom:z,left:y,right:L,width:I,height:F,x:y,y:$}}return p}const v=await r.getElementRects({reference:{getBoundingClientRect:m},floating:o.floating,strategy:s});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function Ko(e,t){const{placement:i,platform:o,elements:n}=e,r=await(o.isRTL==null?void 0:o.isRTL(n.floating)),s=J(i),l=Oe(i),a=bt(i)==="y",c=["left","top"].includes(s)?-1:1,d=r&&a?-1:1,u=ne(t,e);let{mainAxis:p,crossAxis:b,alignmentAxis:m}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return l&&typeof m=="number"&&(b=l==="end"?m*-1:m),a?{x:b*d,y:p*c}:{x:p*c,y:b*d}}const mn=function(e){return{name:"offset",options:e,async fn(t){var i,o;const{x:n,y:r,placement:s,middlewareData:l}=t,a=await Ko(t,e);return s===((i=l.offset)==null?void 0:i.placement)&&(o=l.arrow)!=null&&o.alignmentOffset?{}:{x:n+a.x,y:r+a.y,data:{...a,placement:s}}}}},Zo=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:o,placement:n}=t,{mainAxis:r=!0,crossAxis:s=!1,limiter:l={fn:g=>{let{x:k,y:C}=g;return{x:k,y:C}}},...a}=ne(e,t),c={x:i,y:o},d=await bn(t,a),u=bt(J(n)),p=hn(u);let b=c[p],m=c[u];if(r){const g=p==="y"?"top":"left",k=p==="y"?"bottom":"right",C=b+d[g],x=b-d[k];b=$i(C,b,x)}if(s){const g=u==="y"?"top":"left",k=u==="y"?"bottom":"right",C=m+d[g],x=m-d[k];m=$i(C,m,x)}const v=l.fn({...t,[p]:b,[u]:m});return{...v,data:{x:v.x-i,y:v.y-o,enabled:{[p]:r,[u]:s}}}}}};function Te(){return typeof window<"u"}function ot(e){return gn(e)?(e.nodeName||"").toLowerCase():"#document"}function j(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function st(e){var t;return(t=(gn(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function gn(e){return Te()?e instanceof Node||e instanceof j(e).Node:!1}function W(e){return Te()?e instanceof Element||e instanceof j(e).Element:!1}function Y(e){return Te()?e instanceof HTMLElement||e instanceof j(e).HTMLElement:!1}function Ci(e){return!Te()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof j(e).ShadowRoot}function oe(e){const{overflow:t,overflowX:i,overflowY:o,display:n}=R(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+i)&&!["inline","contents"].includes(n)}function tr(e){return["table","td","th"].includes(ot(e))}function er(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function ai(e){const t=ci(),i=W(e)?R(e):e;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(i.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(i.contain||"").includes(o))}function ir(e){let t=kt(e);for(;Y(t)&&!ze(t);){if(ai(t))return t;if(er(t))return null;t=kt(t)}return null}function ci(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function ze(e){return["html","body","#document"].includes(ot(e))}function R(e){return j(e).getComputedStyle(e)}function Le(e){return W(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function kt(e){if(ot(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Ci(e)&&e.host||st(e);return Ci(t)?t.host:t}function vn(e){const t=kt(e);return ze(t)?e.ownerDocument?e.ownerDocument.body:e.body:Y(t)&&oe(t)?t:vn(t)}function yn(e,t,i){var o;t===void 0&&(t=[]);const n=vn(e),r=n===((o=e.ownerDocument)==null?void 0:o.body),s=j(n);return r?(nr(s),t.concat(s,s.visualViewport||[],oe(n)?n:[],[])):t.concat(n,yn(n,[]))}function nr(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function _n(e){const t=R(e);let i=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const n=Y(e),r=n?e.offsetWidth:i,s=n?e.offsetHeight:o,l=ve(i)!==r||ve(o)!==s;return l&&(i=r,o=s),{width:i,height:o,$:l}}function xn(e){return W(e)?e:e.contextElement}function Et(e){const t=xn(e);if(!Y(t))return nt(1);const i=t.getBoundingClientRect(),{width:o,height:n,$:r}=_n(t);let s=(r?ve(i.width):i.width)/o,l=(r?ve(i.height):i.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const or=nt(0);function wn(e){const t=j(e);return!ci()||!t.visualViewport?or:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function rr(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==j(e)?!1:t}function Jt(e,t,i,o){t===void 0&&(t=!1),i===void 0&&(i=!1);const n=e.getBoundingClientRect(),r=xn(e);let s=nt(1);t&&(o?W(o)&&(s=Et(o)):s=Et(e));const l=rr(r,i,o)?wn(r):nt(0);let a=(n.left+l.x)/s.x,c=(n.top+l.y)/s.y,d=n.width/s.x,u=n.height/s.y;if(r){const p=j(r),b=o&&W(o)?j(o):o;let m=p,v=m.frameElement;for(;v&&o&&b!==m;){const g=Et(v),k=v.getBoundingClientRect(),C=R(v),x=k.left+(v.clientLeft+parseFloat(C.paddingLeft))*g.x,$=k.top+(v.clientTop+parseFloat(C.paddingTop))*g.y;a*=g.x,c*=g.y,d*=g.x,u*=g.y,a+=x,c+=$,m=j(v),v=m.frameElement}}return St({width:d,height:u,x:a,y:c})}const sr=[":popover-open",":modal"];function $n(e){return sr.some(t=>{try{return e.matches(t)}catch{return!1}})}function lr(e){let{elements:t,rect:i,offsetParent:o,strategy:n}=e;const r=n==="fixed",s=st(o),l=t?$n(t.floating):!1;if(o===s||l&&r)return i;let a={scrollLeft:0,scrollTop:0},c=nt(1);const d=nt(0),u=Y(o);if((u||!u&&!r)&&((ot(o)!=="body"||oe(s))&&(a=Le(o)),Y(o))){const p=Jt(o);c=Et(o),d.x=p.x+o.clientLeft,d.y=p.y+o.clientTop}return{width:i.width*c.x,height:i.height*c.y,x:i.x*c.x-a.scrollLeft*c.x+d.x,y:i.y*c.y-a.scrollTop*c.y+d.y}}function ar(e){return Array.from(e.getClientRects())}function En(e){return Jt(st(e)).left+Le(e).scrollLeft}function cr(e){const t=st(e),i=Le(e),o=e.ownerDocument.body,n=Q(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=Q(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let s=-i.scrollLeft+En(e);const l=-i.scrollTop;return R(o).direction==="rtl"&&(s+=Q(t.clientWidth,o.clientWidth)-n),{width:n,height:r,x:s,y:l}}function hr(e,t){const i=j(e),o=st(e),n=i.visualViewport;let r=o.clientWidth,s=o.clientHeight,l=0,a=0;if(n){r=n.width,s=n.height;const c=ci();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:r,height:s,x:l,y:a}}function dr(e,t){const i=Jt(e,!0,t==="fixed"),o=i.top+e.clientTop,n=i.left+e.clientLeft,r=Y(e)?Et(e):nt(1),s=e.clientWidth*r.x,l=e.clientHeight*r.y,a=n*r.x,c=o*r.y;return{width:s,height:l,x:a,y:c}}function Si(e,t,i){let o;if(t==="viewport")o=hr(e,i);else if(t==="document")o=cr(st(e));else if(W(t))o=dr(t,i);else{const n=wn(e);o={...t,x:t.x-n.x,y:t.y-n.y}}return St(o)}function Cn(e,t){const i=kt(e);return i===t||!W(i)||ze(i)?!1:R(i).position==="fixed"||Cn(i,t)}function ur(e,t){const i=t.get(e);if(i)return i;let o=yn(e,[]).filter(l=>W(l)&&ot(l)!=="body"),n=null;const r=R(e).position==="fixed";let s=r?kt(e):e;for(;W(s)&&!ze(s);){const l=R(s),a=ai(s);!a&&l.position==="fixed"&&(n=null),(r?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||oe(s)&&!a&&Cn(e,s))?o=o.filter(c=>c!==s):n=l,s=kt(s)}return t.set(e,o),o}function pr(e){let{element:t,boundary:i,rootBoundary:o,strategy:n}=e;const r=[...i==="clippingAncestors"?ur(t,this._c):[].concat(i),o],s=r[0],l=r.reduce((a,c)=>{const d=Si(t,c,n);return a.top=Q(d.top,a.top),a.right=Ct(d.right,a.right),a.bottom=Ct(d.bottom,a.bottom),a.left=Q(d.left,a.left),a},Si(t,s,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function br(e){const{width:t,height:i}=_n(e);return{width:t,height:i}}function fr(e,t,i){const o=Y(t),n=st(t),r=i==="fixed",s=Jt(e,!0,r,t);let l={scrollLeft:0,scrollTop:0};const a=nt(0);if(o||!o&&!r)if((ot(t)!=="body"||oe(n))&&(l=Le(t)),o){const u=Jt(t,!0,r,t);a.x=u.x+t.clientLeft,a.y=u.y+t.clientTop}else n&&(a.x=En(n));const c=s.left+l.scrollLeft-a.x,d=s.top+l.scrollTop-a.y;return{x:c,y:d,width:s.width,height:s.height}}function ki(e,t){return!Y(e)||R(e).position==="fixed"?null:t?t(e):e.offsetParent}function Sn(e,t){const i=j(e);if(!Y(e)||$n(e))return i;let o=ki(e,t);for(;o&&tr(o)&&R(o).position==="static";)o=ki(o,t);return o&&(ot(o)==="html"||ot(o)==="body"&&R(o).position==="static"&&!ai(o))?i:o||ir(e)||i}const mr=async function(e){const t=this.getOffsetParent||Sn,i=this.getDimensions;return{reference:fr(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function gr(e){return R(e).direction==="rtl"}const vr={convertOffsetParentRelativeRectToViewportRelativeRect:lr,getDocumentElement:st,getClippingRect:pr,getOffsetParent:Sn,getElementRects:mr,getClientRects:ar,getDimensions:br,getScale:Et,isElement:W,isRTL:gr},kn=Zo,An=Qo,On=Xo,Tn=(e,t,i)=>{const o=new Map,n={platform:vr,...i},r={...n.platform,_c:o};return Go(e,t,{...n,platform:r})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,hi=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,di=Symbol(),Ai=new WeakMap;let zn=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==di)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(hi&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Ai.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Ai.set(t,e))}return e}toString(){return this.cssText}};const yr=e=>new zn(typeof e=="string"?e:e+"",void 0,di),E=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((o,n,r)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[r+1],e[0]);return new zn(i,e,di)},_r=(e,t)=>{if(hi)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const o=document.createElement("style"),n=me.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=i.cssText,e.appendChild(o)}},Oi=hi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const o of t.cssRules)i+=o.cssText;return yr(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xr,defineProperty:wr,getOwnPropertyDescriptor:$r,getOwnPropertyNames:Er,getOwnPropertySymbols:Cr,getPrototypeOf:Sr}=Object,At=globalThis,Ti=At.trustedTypes,kr=Ti?Ti.emptyScript:"",zi=At.reactiveElementPolyfillSupport,Wt=(e,t)=>e,_e={toAttribute(e,t){switch(t){case Boolean:e=e?kr:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},ui=(e,t)=>!xr(e,t),Li={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:ui};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),At.litPropertyMetadata??(At.litPropertyMetadata=new WeakMap);class $t extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Li){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const o=Symbol(),n=this.getPropertyDescriptor(t,o,i);n!==void 0&&wr(this.prototype,t,n)}}static getPropertyDescriptor(t,i,o){const{get:n,set:r}=$r(this.prototype,t)??{get(){return this[i]},set(s){this[i]=s}};return{get(){return n==null?void 0:n.call(this)},set(s){const l=n==null?void 0:n.call(this);r.call(this,s),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Li}static _$Ei(){if(this.hasOwnProperty(Wt("elementProperties")))return;const t=Sr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Wt("properties"))){const i=this.properties,o=[...Er(i),...Cr(i)];for(const n of o)this.createProperty(n,i[n])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[o,n]of i)this.elementProperties.set(o,n)}this._$Eh=new Map;for(const[i,o]of this.elementProperties){const n=this._$Eu(i,o);n!==void 0&&this._$Eh.set(n,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const n of o)i.unshift(Oi(n))}else t!==void 0&&i.push(Oi(t));return i}static _$Eu(t,i){const o=i.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const o of i.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _r(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var o;return(o=i.hostConnected)==null?void 0:o.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var o;return(o=i.hostDisconnected)==null?void 0:o.call(i)})}attributeChangedCallback(t,i,o){this._$AK(t,o)}_$EC(t,i){var o;const n=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,n);if(r!==void 0&&n.reflect===!0){const s=(((o=n.converter)==null?void 0:o.toAttribute)!==void 0?n.converter:_e).toAttribute(i,n.type);this._$Em=t,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,i){var o;const n=this.constructor,r=n._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const s=n.getPropertyOptions(r),l=typeof s.converter=="function"?{fromAttribute:s.converter}:((o=s.converter)==null?void 0:o.fromAttribute)!==void 0?s.converter:_e;this._$Em=r,this[r]=l.fromAttribute(i,s.type),this._$Em=null}}requestUpdate(t,i,o){if(t!==void 0){if(o??(o=this.constructor.getPropertyOptions(t)),!(o.hasChanged??ui)(this[t],i))return;this.P(t,i,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,o){this._$AL.has(t)||this._$AL.set(t,i),o.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[r,s]of n)s.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],s)}let i=!1;const o=this._$AL;try{i=this.shouldUpdate(o),i?(this.willUpdate(o),(t=this._$EO)==null||t.forEach(n=>{var r;return(r=n.hostUpdate)==null?void 0:r.call(n)}),this.update(o)):this._$EU()}catch(n){throw i=!1,this._$EU(),n}i&&this._$AE(o)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(o=>{var n;return(n=o.hostUpdated)==null?void 0:n.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}$t.elementStyles=[],$t.shadowRootOptions={mode:"open"},$t[Wt("elementProperties")]=new Map,$t[Wt("finalized")]=new Map,zi==null||zi({ReactiveElement:$t}),(At.reactiveElementVersions??(At.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe=globalThis,we=xe.trustedTypes,ji=we?we.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ln="$lit$",it=`lit$${Math.random().toFixed(9).slice(2)}$`,jn="?"+it,Ar=`<${jn}>`,ft=document,Xt=()=>ft.createComment(""),Kt=e=>e===null||typeof e!="object"&&typeof e!="function",pi=Array.isArray,Or=e=>pi(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",De=`[ 	
\f\r]`,Vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pi=/-->/g,Mi=/>/g,dt=RegExp(`>|${De}(?:([^\\s"'>=/]+)(${De}*=${De}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ri=/'/g,Bi=/"/g,Pn=/^(?:script|style|textarea|title)$/i,Tr=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),f=Tr(1),Ot=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Hi=new WeakMap,ut=ft.createTreeWalker(ft,129);function Mn(e,t){if(!pi(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ji!==void 0?ji.createHTML(t):t}const zr=(e,t)=>{const i=e.length-1,o=[];let n,r=t===2?"<svg>":t===3?"<math>":"",s=Vt;for(let l=0;l<i;l++){const a=e[l];let c,d,u=-1,p=0;for(;p<a.length&&(s.lastIndex=p,d=s.exec(a),d!==null);)p=s.lastIndex,s===Vt?d[1]==="!--"?s=Pi:d[1]!==void 0?s=Mi:d[2]!==void 0?(Pn.test(d[2])&&(n=RegExp("</"+d[2],"g")),s=dt):d[3]!==void 0&&(s=dt):s===dt?d[0]===">"?(s=n??Vt,u=-1):d[1]===void 0?u=-2:(u=s.lastIndex-d[2].length,c=d[1],s=d[3]===void 0?dt:d[3]==='"'?Bi:Ri):s===Bi||s===Ri?s=dt:s===Pi||s===Mi?s=Vt:(s=dt,n=void 0);const b=s===dt&&e[l+1].startsWith("/>")?" ":"";r+=s===Vt?a+Ar:u>=0?(o.push(c),a.slice(0,u)+Ln+a.slice(u)+it+b):a+it+(u===-2?l:b)}return[Mn(e,r+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]};class Zt{constructor({strings:t,_$litType$:i},o){let n;this.parts=[];let r=0,s=0;const l=t.length-1,a=this.parts,[c,d]=zr(t,i);if(this.el=Zt.createElement(c,o),ut.currentNode=this.el.content,i===2||i===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=ut.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(Ln)){const p=d[s++],b=n.getAttribute(u).split(it),m=/([.?@])?(.*)/.exec(p);a.push({type:1,index:r,name:m[2],strings:b,ctor:m[1]==="."?jr:m[1]==="?"?Pr:m[1]==="@"?Mr:je}),n.removeAttribute(u)}else u.startsWith(it)&&(a.push({type:6,index:r}),n.removeAttribute(u));if(Pn.test(n.tagName)){const u=n.textContent.split(it),p=u.length-1;if(p>0){n.textContent=we?we.emptyScript:"";for(let b=0;b<p;b++)n.append(u[b],Xt()),ut.nextNode(),a.push({type:2,index:++r});n.append(u[p],Xt())}}}else if(n.nodeType===8)if(n.data===jn)a.push({type:2,index:r});else{let u=-1;for(;(u=n.data.indexOf(it,u+1))!==-1;)a.push({type:7,index:r}),u+=it.length-1}r++}}static createElement(t,i){const o=ft.createElement("template");return o.innerHTML=t,o}}function Tt(e,t,i=e,o){var n,r;if(t===Ot)return t;let s=o!==void 0?(n=i._$Co)==null?void 0:n[o]:i._$Cl;const l=Kt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==l&&((r=s==null?void 0:s._$AO)==null||r.call(s,!1),l===void 0?s=void 0:(s=new l(e),s._$AT(e,i,o)),o!==void 0?(i._$Co??(i._$Co=[]))[o]=s:i._$Cl=s),s!==void 0&&(t=Tt(e,s._$AS(e,t.values),s,o)),t}class Lr{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:o}=this._$AD,n=((t==null?void 0:t.creationScope)??ft).importNode(i,!0);ut.currentNode=n;let r=ut.nextNode(),s=0,l=0,a=o[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new re(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new Rr(r,this,t)),this._$AV.push(c),a=o[++l]}s!==(a==null?void 0:a.index)&&(r=ut.nextNode(),s++)}return ut.currentNode=ft,n}p(t){let i=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,i),i+=o.strings.length-2):o._$AI(t[i])),i++}}class re{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,o,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=o,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=Tt(this,t,i),Kt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==Ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Or(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&Kt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ft.createTextNode(t)),this._$AH=t}$(t){var i;const{values:o,_$litType$:n}=t,r=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Zt.createElement(Mn(n.h,n.h[0]),this.options)),n);if(((i=this._$AH)==null?void 0:i._$AD)===r)this._$AH.p(o);else{const s=new Lr(r,this),l=s.u(this.options);s.p(o),this.T(l),this._$AH=s}}_$AC(t){let i=Hi.get(t.strings);return i===void 0&&Hi.set(t.strings,i=new Zt(t)),i}k(t){pi(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let o,n=0;for(const r of t)n===i.length?i.push(o=new re(this.O(Xt()),this.O(Xt()),this,this.options)):o=i[n],o._$AI(r),n++;n<i.length&&(this._$AR(o&&o._$AB.nextSibling,n),i.length=n)}_$AR(t=this._$AA.nextSibling,i){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,i);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class je{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,o,n,r){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=A}_$AI(t,i=this,o,n){const r=this.strings;let s=!1;if(r===void 0)t=Tt(this,t,i,0),s=!Kt(t)||t!==this._$AH&&t!==Ot,s&&(this._$AH=t);else{const l=t;let a,c;for(t=r[0],a=0;a<r.length-1;a++)c=Tt(this,l[o+a],i,a),c===Ot&&(c=this._$AH[a]),s||(s=!Kt(c)||c!==this._$AH[a]),c===A?t=A:t!==A&&(t+=(c??"")+r[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class jr extends je{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class Pr extends je{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class Mr extends je{constructor(t,i,o,n,r){super(t,i,o,n,r),this.type=5}_$AI(t,i=this){if((t=Tt(this,t,i,0)??A)===Ot)return;const o=this._$AH,n=t===A&&o!==A||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==A&&(o===A||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Rr{constructor(t,i,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Tt(this,t)}}const Ni=xe.litHtmlPolyfillSupport;Ni==null||Ni(Zt,re),(xe.litHtmlVersions??(xe.litHtmlVersions=[])).push("3.2.1");const zt=(e,t,i)=>{const o=(i==null?void 0:i.renderBefore)??t;let n=o._$litPart$;if(n===void 0){const r=(i==null?void 0:i.renderBefore)??null;o._$litPart$=n=new re(t.insertBefore(Xt(),r),r,void 0,i??{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let w=class extends $t{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=zt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ot}};var Ii;w._$litElement$=!0,w.finalized=!0,(Ii=globalThis.litElementHydrateSupport)==null||Ii.call(globalThis,{LitElement:w});const Fi=globalThis.litElementPolyfillSupport;Fi==null||Fi({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Br={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:ui},Hr=(e=Br,t,i)=>{const{kind:o,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(i.name,e),o==="accessor"){const{name:s}=i;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(s,a,e)},init(l){return l!==void 0&&this.P(s,void 0,e),l}}}if(o==="setter"){const{name:s}=i;return function(l){const a=this[s];t.call(this,l),this.requestUpdate(s,a,e)}}throw Error("Unsupported decorator location: "+o)};function h(e){return(t,i)=>typeof i=="object"?Hr(e,t,i):((o,n,r)=>{const s=n.hasOwnProperty(r);return n.constructor.createProperty(r,s?{...o,wrapped:!0}:o),s?Object.getOwnPropertyDescriptor(n,r):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Pt(e){return h({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nr=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ir={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Fr=e=>(...t)=>({_$litDirective$:e,values:t});let Dr=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yt=(e,t)=>{var i;const o=e._$AN;if(o===void 0)return!1;for(const n of o)(i=n._$AO)==null||i.call(n,t,!1),Yt(n,t);return!0},$e=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},Rn=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),qr(t)}};function Ur(e){this._$AN!==void 0?($e(this),this._$AM=e,Rn(this)):this._$AM=e}function Vr(e,t=!1,i=0){const o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let r=i;r<o.length;r++)Yt(o[r],!1),$e(o[r]);else o!=null&&(Yt(o,!1),$e(o));else Yt(this,e)}const qr=e=>{e.type==Ir.CHILD&&(e._$AP??(e._$AP=Vr),e._$AQ??(e._$AQ=Ur))};class Wr extends Dr{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,o){super._$AT(t,i,o),Rn(this),this.isConnected=t._$AU}_$AO(t,i=!0){var o,n;t!==this.isConnected&&(this.isConnected=t,t?(o=this.reconnected)==null||o.call(this):(n=this.disconnected)==null||n.call(this)),i&&(Yt(this,t),$e(this))}setValue(t){if(Nr(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt=()=>new Yr;class Yr{}const Ue=new WeakMap,jt=Fr(class extends Wr{render(e){return A}update(e,[t]){var i;const o=t!==this.Y;return o&&this.Y!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),A}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=Ue.get(t);i===void 0&&(i=new WeakMap,Ue.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Ue.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Bn=Object.freeze({left:0,top:0,width:16,height:16}),Ee=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),se=Object.freeze({...Bn,...Ee}),Qe=Object.freeze({...se,body:"",hidden:!1}),Gr=Object.freeze({width:null,height:null}),Hn=Object.freeze({...Gr,...Ee});function Qr(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function o(n){for(;n<0;)n+=4;return n%4}if(i===""){const n=parseInt(e);return isNaN(n)?0:o(n)}else if(i!==e){let n=0;switch(i){case"%":n=25;break;case"deg":n=90}if(n){let r=parseFloat(e.slice(0,e.length-i.length));return isNaN(r)?0:(r=r/n,r%1===0?o(r):0)}}return t}const Jr=/[\s,]+/;function Xr(e,t){t.split(Jr).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const Nn={...Hn,preserveAspectRatio:""};function Di(e){const t={...Nn},i=(o,n)=>e.getAttribute(o)||n;return t.width=i("width",null),t.height=i("height",null),t.rotate=Qr(i("rotate","")),Xr(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function Kr(e,t){for(const i in Nn)if(e[i]!==t[i])return!0;return!1}const Gt=/^[a-z0-9]+(-[a-z0-9]+)*$/,le=(e,t,i,o="")=>{const n=e.split(":");if(e.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;o=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:o,prefix:a,name:l};return t&&!ge(c)?null:c}const r=n[0],s=r.split("-");if(s.length>1){const l={provider:o,prefix:s.shift(),name:s.join("-")};return t&&!ge(l)?null:l}if(i&&o===""){const l={provider:o,prefix:"",name:r};return t&&!ge(l,i)?null:l}return null},ge=(e,t)=>e?!!((e.provider===""||e.provider.match(Gt))&&(t&&e.prefix===""||e.prefix.match(Gt))&&e.name.match(Gt)):!1;function Zr(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const o=((e.rotate||0)+(t.rotate||0))%4;return o&&(i.rotate=o),i}function Ui(e,t){const i=Zr(e,t);for(const o in Qe)o in Ee?o in e&&!(o in i)&&(i[o]=Ee[o]):o in t?i[o]=t[o]:o in e&&(i[o]=e[o]);return i}function ts(e,t){const i=e.icons,o=e.aliases||Object.create(null),n=Object.create(null);function r(s){if(i[s])return n[s]=[];if(!(s in n)){n[s]=null;const l=o[s]&&o[s].parent,a=l&&r(l);a&&(n[s]=[l].concat(a))}return n[s]}return Object.keys(i).concat(Object.keys(o)).forEach(r),n}function es(e,t,i){const o=e.icons,n=e.aliases||Object.create(null);let r={};function s(l){r=Ui(o[l]||n[l],r)}return s(t),i.forEach(s),Ui(e,r)}function In(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(n=>{t(n,null),i.push(n)});const o=ts(e);for(const n in o){const r=o[n];r&&(t(n,es(e,n,r)),i.push(n))}return i}const is={provider:"",aliases:{},not_found:{},...Bn};function Ve(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function Fn(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Ve(e,is))return null;const i=t.icons;for(const n in i){const r=i[n];if(!n.match(Gt)||typeof r.body!="string"||!Ve(r,Qe))return null}const o=t.aliases||Object.create(null);for(const n in o){const r=o[n],s=r.parent;if(!n.match(Gt)||typeof s!="string"||!i[s]&&!o[s]||!Ve(r,Qe))return null}return t}const Ce=Object.create(null);function ns(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function rt(e,t){const i=Ce[e]||(Ce[e]=Object.create(null));return i[t]||(i[t]=ns(e,t))}function bi(e,t){return Fn(t)?In(t,(i,o)=>{o?e.icons[i]=o:e.missing.add(i)}):[]}function os(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function rs(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(Ce)).forEach(o=>{(typeof o=="string"&&typeof t=="string"?[t]:Object.keys(Ce[o]||{})).forEach(n=>{const r=rt(o,n);i=i.concat(Object.keys(r.icons).map(s=>(o!==""?"@"+o+":":"")+n+":"+s))})}),i}let te=!1;function Dn(e){return typeof e=="boolean"&&(te=e),te}function ee(e){const t=typeof e=="string"?le(e,!0,te):e;if(t){const i=rt(t.provider,t.prefix),o=t.name;return i.icons[o]||(i.missing.has(o)?null:void 0)}}function Un(e,t){const i=le(e,!0,te);if(!i)return!1;const o=rt(i.provider,i.prefix);return os(o,i.name,t)}function Vi(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),te&&!t&&!e.prefix){let n=!1;return Fn(e)&&(e.prefix="",In(e,(r,s)=>{s&&Un(r,s)&&(n=!0)})),n}const i=e.prefix;if(!ge({provider:t,prefix:i,name:"a"}))return!1;const o=rt(t,i);return!!bi(o,e)}function qi(e){return!!ee(e)}function ss(e){const t=ee(e);return t?{...se,...t}:null}function ls(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((n,r)=>n.provider!==r.provider?n.provider.localeCompare(r.provider):n.prefix!==r.prefix?n.prefix.localeCompare(r.prefix):n.name.localeCompare(r.name));let o={provider:"",prefix:"",name:""};return e.forEach(n=>{if(o.name===n.name&&o.prefix===n.prefix&&o.provider===n.provider)return;o=n;const r=n.provider,s=n.prefix,l=n.name,a=i[r]||(i[r]=Object.create(null)),c=a[s]||(a[s]=rt(r,s));let d;l in c.icons?d=t.loaded:s===""||c.missing.has(l)?d=t.missing:d=t.pending;const u={provider:r,prefix:s,name:l};d.push(u)}),t}function Vn(e,t){e.forEach(i=>{const o=i.loaderCallbacks;o&&(i.loaderCallbacks=o.filter(n=>n.id!==t))})}function as(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const o=e.provider,n=e.prefix;t.forEach(r=>{const s=r.icons,l=s.pending.length;s.pending=s.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(e.icons[c])s.loaded.push({provider:o,prefix:n,name:c});else if(e.missing.has(c))s.missing.push({provider:o,prefix:n,name:c});else return i=!0,!0;return!1}),s.pending.length!==l&&(i||Vn([e],r.id),r.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),r.abort))})}))}let cs=0;function hs(e,t,i){const o=cs++,n=Vn.bind(null,i,o);if(!t.pending.length)return n;const r={id:o,icons:t,callback:e,abort:n};return i.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(r)}),n}const Je=Object.create(null);function Wi(e,t){Je[e]=t}function Xe(e){return Je[e]||Je[""]}function ds(e,t=!0,i=!1){const o=[];return e.forEach(n=>{const r=typeof n=="string"?le(n,t,i):n;r&&o.push(r)}),o}var us={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function ps(e,t,i,o){const n=e.resources.length,r=e.random?Math.floor(Math.random()*n):e.index;let s;if(e.random){let y=e.resources.slice(0);for(s=[];y.length>1;){const L=Math.floor(Math.random()*y.length);s.push(y[L]),y=y.slice(0,L).concat(y.slice(L+1))}s=s.concat(y)}else s=e.resources.slice(r).concat(e.resources.slice(0,r));const l=Date.now();let a="pending",c=0,d,u=null,p=[],b=[];typeof o=="function"&&b.push(o);function m(){u&&(clearTimeout(u),u=null)}function v(){a==="pending"&&(a="aborted"),m(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,L){L&&(b=[]),typeof y=="function"&&b.push(y)}function k(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function C(){a="failed",b.forEach(y=>{y(void 0,d)})}function x(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,L,I){const F=L!=="success";switch(p=p.filter(S=>S!==y),a){case"pending":break;case"failed":if(F||!e.dataAfterTimeout)return;break;default:return}if(L==="abort"){d=I,C();return}if(F){d=I,p.length||(s.length?z():C());return}if(m(),x(),!e.random){const S=e.resources.indexOf(y.resource);S!==-1&&S!==e.index&&(e.index=S)}a="completed",b.forEach(S=>{S(I)})}function z(){if(a!=="pending")return;m();const y=s.shift();if(y===void 0){if(p.length){u=setTimeout(()=>{m(),a==="pending"&&(x(),C())},e.timeout);return}C();return}const L={status:"pending",resource:y,callback:(I,F)=>{$(L,I,F)}};p.push(L),c++,u=setTimeout(z,e.rotate),i(y,t,L.callback)}return setTimeout(z),k}function qn(e){const t={...us,...e};let i=[];function o(){i=i.filter(s=>s().status==="pending")}function n(s,l,a){const c=ps(t,s,l,(d,u)=>{o(),a&&a(d,u)});return i.push(c),c}function r(s){return i.find(l=>s(l))||null}return{query:n,find:r,setIndex:s=>{t.index=s},getIndex:()=>t.index,cleanup:o}}function fi(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Pe=Object.create(null),be=["https://api.simplesvg.com","https://api.unisvg.com"],Ke=[];for(;be.length>0;)be.length===1||Math.random()>.5?Ke.push(be.shift()):Ke.push(be.pop());Pe[""]=fi({resources:["https://api.iconify.design"].concat(Ke)});function Yi(e,t){const i=fi(t);return i===null?!1:(Pe[e]=i,!0)}function Me(e){return Pe[e]}function bs(){return Object.keys(Pe)}function Gi(){}const qe=Object.create(null);function fs(e){if(!qe[e]){const t=Me(e);if(!t)return;const i=qn(t),o={config:t,redundancy:i};qe[e]=o}return qe[e]}function Wn(e,t,i){let o,n;if(typeof e=="string"){const r=Xe(e);if(!r)return i(void 0,424),Gi;n=r.send;const s=fs(e);s&&(o=s.redundancy)}else{const r=fi(e);if(r){o=qn(r);const s=e.resources?e.resources[0]:"",l=Xe(s);l&&(n=l.send)}}return!o||!n?(i(void 0,424),Gi):o.query(t,n,i)().abort}const Qi="iconify2",ie="iconify",Yn=ie+"-count",Ji=ie+"-version",Gn=36e5,ms=168,gs=50;function Ze(e,t){try{return e.getItem(t)}catch{}}function mi(e,t,i){try{return e.setItem(t,i),!0}catch{}}function Xi(e,t){try{e.removeItem(t)}catch{}}function ti(e,t){return mi(e,Yn,t.toString())}function ei(e){return parseInt(Ze(e,Yn))||0}const pt={local:!0,session:!0},Qn={local:new Set,session:new Set};let gi=!1;function vs(e){gi=e}let fe=typeof window>"u"?{}:window;function Jn(e){const t=e+"Storage";try{if(fe&&fe[t]&&typeof fe[t].length=="number")return fe[t]}catch{}pt[e]=!1}function Xn(e,t){const i=Jn(e);if(!i)return;const o=Ze(i,Ji);if(o!==Qi){if(o){const l=ei(i);for(let a=0;a<l;a++)Xi(i,ie+a.toString())}mi(i,Ji,Qi),ti(i,0);return}const n=Math.floor(Date.now()/Gn)-ms,r=l=>{const a=ie+l.toString(),c=Ze(i,a);if(typeof c=="string"){try{const d=JSON.parse(c);if(typeof d=="object"&&typeof d.cached=="number"&&d.cached>n&&typeof d.provider=="string"&&typeof d.data=="object"&&typeof d.data.prefix=="string"&&t(d,l))return!0}catch{}Xi(i,a)}};let s=ei(i);for(let l=s-1;l>=0;l--)r(l)||(l===s-1?(s--,ti(i,s)):Qn[e].add(l))}function Kn(){if(!gi){vs(!0);for(const e in pt)Xn(e,t=>{const i=t.data,o=t.provider,n=i.prefix,r=rt(o,n);if(!bi(r,i).length)return!1;const s=i.lastModified||-1;return r.lastModifiedCached=r.lastModifiedCached?Math.min(r.lastModifiedCached,s):s,!0})}}function ys(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const o in pt)Xn(o,n=>{const r=n.data;return n.provider!==e.provider||r.prefix!==e.prefix||r.lastModified===t});return!0}function _s(e,t){gi||Kn();function i(o){let n;if(!pt[o]||!(n=Jn(o)))return;const r=Qn[o];let s;if(r.size)r.delete(s=Array.from(r).shift());else if(s=ei(n),s>=gs||!ti(n,s+1))return;const l={cached:Math.floor(Date.now()/Gn),provider:e.provider,data:t};return mi(n,ie+s.toString(),JSON.stringify(l))}t.lastModified&&!ys(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function Ki(){}function xs(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,as(e)}))}function ws(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:o}=e,n=e.iconsToLoad;delete e.iconsToLoad;let r;!n||!(r=Xe(i))||r.prepare(i,o,n).forEach(s=>{Wn(i,s,l=>{if(typeof l!="object")s.icons.forEach(a=>{e.missing.add(a)});else try{const a=bi(e,l);if(!a.length)return;const c=e.pendingIcons;c&&a.forEach(d=>{c.delete(d)}),_s(e,l)}catch(a){console.error(a)}xs(e)})})}))}const vi=(e,t)=>{const i=ds(e,!0,Dn()),o=ls(i);if(!o.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(o.loaded,o.missing,o.pending,Ki)}),()=>{a=!1}}const n=Object.create(null),r=[];let s,l;return o.pending.forEach(a=>{const{provider:c,prefix:d}=a;if(d===l&&c===s)return;s=c,l=d,r.push(rt(c,d));const u=n[c]||(n[c]=Object.create(null));u[d]||(u[d]=[])}),o.pending.forEach(a=>{const{provider:c,prefix:d,name:u}=a,p=rt(c,d),b=p.pendingIcons||(p.pendingIcons=new Set);b.has(u)||(b.add(u),n[c][d].push(u))}),r.forEach(a=>{const{provider:c,prefix:d}=a;n[c][d].length&&ws(a,n[c][d])}),t?hs(t,o,r):Ki},$s=e=>new Promise((t,i)=>{const o=typeof e=="string"?le(e,!0):e;if(!o){i(e);return}vi([o||e],n=>{if(n.length&&o){const r=ee(o);if(r){t({...se,...r});return}}i(e)})});function Es(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function Cs(e,t){const i=typeof e=="string"?le(e,!0,!0):null;if(!i){const r=Es(e);return{value:e,data:r}}const o=ee(i);if(o!==void 0||!i.prefix)return{value:e,name:i,data:o};const n=vi([i],()=>t(e,i,ee(i)));return{value:e,name:i,loading:n}}function We(e){return e.hasAttribute("inline")}let Zn=!1;try{Zn=navigator.vendor.indexOf("Apple")===0}catch{}function Ss(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Zn||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const ks=/(-?[0-9.]*[0-9]+[0-9.]*)/g,As=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ii(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const o=e.split(ks);if(o===null||!o.length)return e;const n=[];let r=o.shift(),s=As.test(r);for(;;){if(s){const l=parseFloat(r);isNaN(l)?n.push(r):n.push(Math.ceil(l*t*i)/i)}else n.push(r);if(r=o.shift(),r===void 0)return n.join("");s=!s}}function Os(e,t="defs"){let i="";const o=e.indexOf("<"+t);for(;o>=0;){const n=e.indexOf(">",o),r=e.indexOf("</"+t);if(n===-1||r===-1)break;const s=e.indexOf(">",r);if(s===-1)break;i+=e.slice(n+1,r).trim(),e=e.slice(0,o).trim()+e.slice(s+1)}return{defs:i,content:e}}function Ts(e,t){return e?"<defs>"+e+"</defs>"+t:t}function zs(e,t,i){const o=Os(e);return Ts(o.defs,t+o.content+i)}const Ls=e=>e==="unset"||e==="undefined"||e==="none";function to(e,t){const i={...se,...e},o={...Hn,...t},n={left:i.left,top:i.top,width:i.width,height:i.height};let r=i.body;[i,o].forEach(v=>{const g=[],k=v.hFlip,C=v.vFlip;let x=v.rotate;k?C?x+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):C&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}x%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(r=zs(r,'<g transform="'+g.join(" ")+'">',"</g>"))});const s=o.width,l=o.height,a=n.width,c=n.height;let d,u;s===null?(u=l===null?"1em":l==="auto"?c:l,d=ii(u,a/c)):(d=s==="auto"?a:s,u=l===null?ii(d,c/a):l==="auto"?c:l);const p={},b=(v,g)=>{Ls(g)||(p[v]=g.toString())};b("width",d),b("height",u);const m=[n.left,n.top,a,c];return p.viewBox=m.join(" "),{attributes:p,viewBox:m,body:r}}function yi(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const o in t)i+=" "+o+'="'+t[o]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function js(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ps(e){return"data:image/svg+xml,"+js(e)}function eo(e){return'url("'+Ps(e)+'")'}const Ms=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let Se=Ms();function Rs(e){Se=e}function Bs(){return Se}function Hs(e,t){const i=Me(e);if(!i)return 0;let o;if(!i.maxURL)o=0;else{let n=0;i.resources.forEach(s=>{n=Math.max(n,s.length)});const r=t+".json?icons=";o=i.maxURL-n-i.path.length-r.length}return o}function Ns(e){return e===404}const Is=(e,t,i)=>{const o=[],n=Hs(e,t),r="icons";let s={type:r,provider:e,prefix:t,icons:[]},l=0;return i.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(o.push(s),s={type:r,provider:e,prefix:t,icons:[]},l=a.length),s.icons.push(a)}),o.push(s),o};function Fs(e){if(typeof e=="string"){const t=Me(e);if(t)return t.path}return"/"}const Ds=(e,t,i)=>{if(!Se){i("abort",424);return}let o=Fs(t.provider);switch(t.type){case"icons":{const r=t.prefix,s=t.icons.join(","),l=new URLSearchParams({icons:s});o+=r+".json?"+l.toString();break}case"custom":{const r=t.uri;o+=r.slice(0,1)==="/"?r.slice(1):r;break}default:i("abort",400);return}let n=503;Se(e+o).then(r=>{const s=r.status;if(s!==200){setTimeout(()=>{i(Ns(s)?"abort":"next",s)});return}return n=501,r.json()}).then(r=>{if(typeof r!="object"||r===null){setTimeout(()=>{r===404?i("abort",r):i("next",n)});return}setTimeout(()=>{i("success",r)})}).catch(()=>{i("next",n)})},Us={prepare:Is,send:Ds};function Zi(e,t){switch(e){case"local":case"session":pt[e]=t;break;case"all":for(const i in pt)pt[i]=t;break}}const Ye="data-style";let io="";function Vs(e){io=e}function tn(e,t){let i=Array.from(e.childNodes).find(o=>o.hasAttribute&&o.hasAttribute(Ye));i||(i=document.createElement("style"),i.setAttribute(Ye,Ye),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+io}function no(){Wi("",Us),Dn(!0);let e;try{e=window}catch{}if(e){if(Kn(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(o=>{try{(typeof o!="object"||o===null||o instanceof Array||typeof o.icons!="object"||typeof o.prefix!="string"||!Vi(o))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const o="IconifyProviders["+i+"] is invalid.";try{const n=t[i];if(typeof n!="object"||!n||n.resources===void 0)continue;Yi(i,n)||console.error(o)}catch{console.error(o)}}}}return{enableCache:t=>Zi(t,!0),disableCache:t=>Zi(t,!1),iconLoaded:qi,iconExists:qi,getIcon:ss,listIcons:rs,addIcon:Un,addCollection:Vi,calculateSize:ii,buildIcon:to,iconToHTML:yi,svgToURL:eo,loadIcons:vi,loadIcon:$s,addAPIProvider:Yi,appendCustomStyle:Vs,_api:{getAPIConfig:Me,setAPIModule:Wi,sendAPIQuery:Wn,setFetch:Rs,getFetch:Bs,listAPIProviders:bs}}}const ni={"background-color":"currentColor"},oo={"background-color":"transparent"},en={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},nn={"-webkit-mask":ni,mask:ni,background:oo};for(const e in nn){const t=nn[e];for(const i in en)t[e+"-"+i]=en[i]}function on(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function qs(e,t,i){const o=document.createElement("span");let n=e.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const r=e.attributes,s=yi(n,{...r,width:t.width+"",height:t.height+""}),l=eo(s),a=o.style,c={"--svg":l,width:on(r.width),height:on(r.height),...i?ni:oo};for(const d in c)a.setProperty(d,c[d]);return o}let Qt;function Ws(){try{Qt=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{Qt=null}}function Ys(e){return Qt===void 0&&Ws(),Qt?Qt.createHTML(e):e}function Gs(e){const t=document.createElement("span"),i=e.attributes;let o="";i.width||(o="width: inherit;"),i.height||(o+="height: inherit;"),o&&(i.style=o);const n=yi(e.body,i);return t.innerHTML=Ys(n),t.firstChild}function oi(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function rn(e,t){const i=t.icon.data,o=t.customisations,n=to(i,o);o.preserveAspectRatio&&(n.attributes.preserveAspectRatio=o.preserveAspectRatio);const r=t.renderedMode;let s;switch(r){case"svg":s=Gs(n);break;default:s=qs(n,{...se,...i},r==="mask")}const l=oi(e);l?s.tagName==="SPAN"&&l.tagName===s.tagName?l.setAttribute("style",s.getAttribute("style")):e.replaceChild(s,l):e.appendChild(s)}function sn(e,t,i){const o=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:o}}function Qs(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const o=t.get(e);if(o)return o;const n=["icon","mode","inline","observe","width","height","rotate","flip"],r=class extends i{constructor(){super(),ht(this,"_shadowRoot"),ht(this,"_initialised",!1),ht(this,"_state"),ht(this,"_checkQueued",!1),ht(this,"_connected",!1),ht(this,"_observer",null),ht(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=We(this);tn(l,a),this._state=sn({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=We(this),c=this._state;a!==c.inline&&(c.inline=a,tn(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return We(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}rn(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),d=Di(this);(l.attrMode!==c||Kr(l.customisations,d)||!oi(this._shadowRoot))&&this._renderIcon(l.icon,d,c)}_iconChanged(l){const a=Cs(l,(c,d,u)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const b={value:c,name:d,data:u};b.data?this._gotIconData(b):p.icon=b});a.data?this._gotIconData(a):this._state=sn(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=oi(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Di(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const d=Ss(l.data.body,c),u=this._state.inline;rn(this._shadowRoot,this._state={rendered:!0,icon:l,inline:u,customisations:a,attrMode:c,renderedMode:d})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in r.prototype||Object.defineProperty(r.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const s=no();for(const l in s)r[l]=r.prototype[l]=s[l];return t.define(e,r),r}Qs()||no();const Js=E`
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
`,Xs=E`
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
`,lt={scrollbar:Js,globalStyles:Xs},ro=class _{static set config(t){this._config={..._._config,...t}}static get config(){return _._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=lt.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){_.init()}static init(){_.addGlobalStyles(),_.defineCustomElement("bim-button",nl),_.defineCustomElement("bim-checkbox",Mt),_.defineCustomElement("bim-color-input",mt),_.defineCustomElement("bim-context-menu",si),_.defineCustomElement("bim-dropdown",X),_.defineCustomElement("bim-grid",xi),_.defineCustomElement("bim-icon",dl),_.defineCustomElement("bim-input",ce),_.defineCustomElement("bim-label",Bt),_.defineCustomElement("bim-number-input",P),_.defineCustomElement("bim-option",T),_.defineCustomElement("bim-panel",gt),_.defineCustomElement("bim-panel-section",Ht),_.defineCustomElement("bim-selector",Nt),_.defineCustomElement("bim-table",N),_.defineCustomElement("bim-tabs",yt),_.defineCustomElement("bim-tab",M),_.defineCustomElement("bim-table-cell",wo),_.defineCustomElement("bim-table-children",Eo),_.defineCustomElement("bim-table-group",So),_.defineCustomElement("bim-table-row",vt),_.defineCustomElement("bim-text-input",G),_.defineCustomElement("bim-toolbar",Fe),_.defineCustomElement("bim-toolbar-group",Ne),_.defineCustomElement("bim-toolbar-section",Dt),_.defineCustomElement("bim-viewport",Bo)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let o=0;o<10;o++){const n=Math.floor(Math.random()*t.length);i+=t.charAt(n)}return i}};ro._config={sectionLabelOnVerticalToolbar:!1};let so=ro;class ke extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const o of t)this.elements.add(o);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const o of i)o.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const o=i[0];if(!o.isIntersecting)return;const n=o.target;t.unobserve(n);const r=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,s=[...this.elements][r];s&&(this.visibleElements=[...this.visibleElements,s],t.observe(s))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,o=[...this.elements][i];o&&t.observe(o)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const o=document.createDocumentFragment();if(t.length===0)return zt(t(),o),o.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let n=i;const r=t,s=a=>(n={...n,...a},zt(r(n,s),o),n);s(i);const l=()=>n;return[o.firstElementChild,s,l]}}const Ae=(e,t={},i=!0)=>{let o={};for(const n of e.children){const r=n,s=r.getAttribute("name")||r.getAttribute("label"),l=t[s];if(s){if("value"in r&&typeof r.value<"u"&&r.value!==null){const a=r.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;o[s]=l?l(r.value):r.value}else if(i){const a=Ae(r,t);if(Object.keys(a).length===0)continue;o[s]=l?l(a):a}}else i&&(o={...o,...Ae(r,t)})}return o},Re=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,Ks=[">=","<=","=",">","<","?","/","#"];function ln(e){const t=Ks.find(s=>e.split(s).length===2),i=e.split(t).map(s=>s.trim()),[o,n]=i,r=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):Re(n);return{key:o,condition:t,value:r}}const ri=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(o=>o.trim());for(const o of i){const n=!o.startsWith("(")&&!o.endsWith(")"),r=o.startsWith("(")&&o.endsWith(")");if(n){const s=ln(o);t.push(s)}if(r){const s={operator:"&",queries:o.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=ln(l);return a>0&&(c.operator="&"),c})};t.push(s)}}return t}catch{return null}},an=(e,t,i)=>{let o=!1;switch(t){case"=":o=e===i;break;case"?":o=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(o=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(o=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(o=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(o=e>=i);break;case"/":o=String(e).startsWith(String(i));break}return o};var Zs=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,lo=(e,t,i,o)=>{for(var n=tl(t,i),r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Zs(t,i,n),n},O;const _i=(O=class extends w{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(e){this._placement=e,this.updatePosition()}static removeMenus(){for(const e of O.menus)e instanceof O&&(e.visible=!1);O.dialog.close(),O.dialog.remove()}get visible(){return this._visible}set visible(e){var t;this._visible=e,e?(O.dialog.parentElement||document.body.append(O.dialog),this._previousContainer=this.parentElement,O.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,O.dialog.append(this),O.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const e=this.placement??"right",t=await Tn(this._previousContainer,this,{placement:e,middleware:[mn(10),On(),An(),kn({padding:5})]}),{x:i,y:o}=t;this.style.left=`${i}px`,this.style.top=`${o}px`}connectedCallback(){super.connectedCallback(),O.menus.push(this)}render(){return f` <slot></slot> `}},O.styles=[lt.scrollbar,E`
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
    `],O.dialog=ke.create(()=>f` <dialog
      @click=${e=>{e.target===O.dialog&&O.removeMenus()}}
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
    ></dialog>`),O.menus=[],O);lo([h({type:String,reflect:!0})],_i.prototype,"placement");lo([h({type:Boolean,reflect:!0})],_i.prototype,"visible");let si=_i;var el=Object.defineProperty,il=Object.getOwnPropertyDescriptor,D=(e,t,i,o)=>{for(var n=o>1?void 0:o?il(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&el(t,i,n),n},qt;const B=(qt=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=Lt(),this._tooltip=Lt(),this._mouseLeave=!1,this.onClick=e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const e=this._contextMenu;if(e){const t=this.getAttribute("data-context-group");t&&e.setAttribute("data-context-group",t),this.closeNestedContexts();const i=so.newRandomId();for(const o of e.children)o instanceof qt&&o.setAttribute("data-context-group",i);e.visible=!0}},this.mouseLeave=!0}set loading(e){if(this._loading=e,e)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=e,this.icon="eos-icons:loading";else{const{disabled:t,icon:i}=this._stateBeforeLoading;this.disabled=t,this.icon=i}}get loading(){return this._loading}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&Tn(e,t,{placement:"bottom",middleware:[mn(10),On(),An(),kn({padding:5})]}).then(i=>{const{x:o,y:n}=i;Object.assign(t.style,{left:`${o}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}closeNestedContexts(){const e=this.getAttribute("data-context-group");if(e)for(const t of si.dialog.children){const i=t.getAttribute("data-context-group");if(t instanceof si&&i===e){t.visible=!1,t.removeAttribute("data-context-group");for(const o of t.children)o instanceof qt&&(o.closeNestedContexts(),o.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const e=f`
      <div ${jt(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?f`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?f`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
      style="fill: var(--bim-label--c)"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`;return f`
      <div ${jt(this._parent)} class="parent" @click=${this.onClick}>
        ${this.label||this.icon?f`
              <div
                class="button"
                @mouseenter=${this.onMouseEnter}
                @mouseleave=${()=>this.mouseLeave=!0}
              >
                <bim-label
                  .icon=${this.icon}
                  .vertical=${this.vertical}
                  .labelHidden=${this.labelHidden}
                  >${this.label}${this.label&&this._contextMenu?t:null}</bim-label
                >
              </div>
            `:null}
        ${this.tooltipTitle||this.tooltipText?e:null}
      </div>
      <slot></slot>
    `}},qt.styles=E`
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
  `,qt);D([h({type:String,reflect:!0})],B.prototype,"label",2);D([h({type:Boolean,attribute:"label-hidden",reflect:!0})],B.prototype,"labelHidden",2);D([h({type:Boolean,reflect:!0})],B.prototype,"active",2);D([h({type:Boolean,reflect:!0,attribute:"disabled"})],B.prototype,"disabled",2);D([h({type:String,reflect:!0})],B.prototype,"icon",2);D([h({type:Boolean,reflect:!0})],B.prototype,"vertical",2);D([h({type:Number,attribute:"tooltip-time",reflect:!0})],B.prototype,"tooltipTime",2);D([h({type:Boolean,attribute:"tooltip-visible",reflect:!0})],B.prototype,"tooltipVisible",2);D([h({type:String,attribute:"tooltip-title",reflect:!0})],B.prototype,"tooltipTitle",2);D([h({type:String,attribute:"tooltip-text",reflect:!0})],B.prototype,"tooltipText",2);D([h({type:Boolean,reflect:!0})],B.prototype,"loading",1);let nl=B;var ol=Object.defineProperty,ae=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&ol(t,i,n),n};const ao=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return f`
      <div class="parent">
        ${this.label?f`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};ao.styles=E`
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
  `;let Mt=ao;ae([h({type:String,reflect:!0})],Mt.prototype,"icon");ae([h({type:String,reflect:!0})],Mt.prototype,"name");ae([h({type:String,reflect:!0})],Mt.prototype,"label");ae([h({type:Boolean,reflect:!0})],Mt.prototype,"checked");ae([h({type:Boolean,reflect:!0})],Mt.prototype,"inverted");var rl=Object.defineProperty,Rt=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&rl(t,i,n),n};const co=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=Lt(),this._textInput=Lt(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const i=t.target;this.opacity=i.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:i,opacity:o}=t;this.color=i,o&&(this.opacity=o)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:i}=this._colorInput;i&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:i}=this._textInput;if(!i)return;const{value:o}=i;let n=o.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),i.value=n.slice(0,7),i.value.length===7&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return f`
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
                ${jt(this._colorInput)}
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
                ${jt(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?f`<bim-number-input
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
    `}};co.styles=E`
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
  `;let mt=co;Rt([h({type:String,reflect:!0})],mt.prototype,"name");Rt([h({type:String,reflect:!0})],mt.prototype,"label");Rt([h({type:String,reflect:!0})],mt.prototype,"icon");Rt([h({type:Boolean,reflect:!0})],mt.prototype,"vertical");Rt([h({type:Number,reflect:!0})],mt.prototype,"opacity");Rt([h({type:String,reflect:!0})],mt.prototype,"color");var sl=Object.defineProperty,ll=Object.getOwnPropertyDescriptor,at=(e,t,i,o)=>{for(var n=o>1?void 0:o?ll(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&sl(t,i,n),n};const ho=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Re(this.label):this.label}set value(t){this._value=t}render(){return f`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?f` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?f`<bim-checkbox
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
    `}};ho.styles=E`
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
  `;let T=ho;at([h({type:String,reflect:!0})],T.prototype,"img",2);at([h({type:String,reflect:!0})],T.prototype,"label",2);at([h({type:String,reflect:!0})],T.prototype,"icon",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checked",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checkbox",2);at([h({type:Boolean,attribute:"no-mark",reflect:!0})],T.prototype,"noMark",2);at([h({converter:{fromAttribute(e){return e&&Re(e)}}})],T.prototype,"value",1);at([h({type:Boolean,reflect:!0})],T.prototype,"vertical",2);var al=Object.defineProperty,cl=Object.getOwnPropertyDescriptor,ct=(e,t,i,o)=>{for(var n=o>1?void 0:o?cl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&al(t,i,n),n};const uo=class extends ke{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=Lt(),this.onOptionClick=t=>{const i=t.target,o=this._value.has(i);if(!this.multiple&&!this.required&&!o)this._value=new Set([i]);else if(!this.multiple&&!this.required&&o)this._value=new Set([]);else if(!this.multiple&&this.required&&!o)this._value=new Set([i]);else if(this.multiple&&!this.required&&!o)this._value=new Set([...this._value,i]);else if(this.multiple&&!this.required&&o){const n=[...this._value].filter(r=>r!==i);this._value=new Set(n)}else if(this.multiple&&this.required&&!o)this._value=new Set([...this._value,i]);else if(this.multiple&&this.required&&o){const n=[...this._value].filter(s=>s!==i),r=new Set(n);r.size!==0&&(this._value=r)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){if(t){const{value:i}=this._contextMenu;if(!i)return;for(const o of this.elements)i.append(o);this._visible=!0}else{for(const i of this.elements)this.append(i);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const i=new Set;for(const o of t){const n=this.findOption(o);if(n&&(i.add(n),!this.multiple&&Object.keys(t).length===1))break}this._value=i,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(t=>t instanceof T&&t.checked).map(t=>t.value)}get _options(){const t=new Set([...this.elements]);for(const i of this.children)i instanceof T&&t.add(i);return[...t]}onSlotChange(t){const i=t.target.assignedElements();this.observe(i);const o=new Set;for(const n of this.elements){if(!(n instanceof T)){n.remove();continue}n.checked&&o.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=o}updateOptionsState(){for(const t of this._options)t instanceof T&&(t.checked=this._value.has(t))}findOption(t){return this._options.find(i=>i instanceof T?i.label===t||i.value===t:!1)}render(){let t,i,o;if(this._value.size===0)t="Select an option...";else if(this._value.size===1){const n=[...this._value][0];t=(n==null?void 0:n.label)||(n==null?void 0:n.value),i=n==null?void 0:n.img,o=n==null?void 0:n.icon}else t=`Multiple (${this._value.size})`;return f`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div class="input" @click=${()=>this.visible=!this.visible}>
          <bim-label
            .img=${i}
            .icon=${o}
            style="overflow: hidden;"
            >${t}</bim-label
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
            ${jt(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};uo.styles=[lt.scrollbar,E`
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
    `];let X=uo;ct([h({type:String,reflect:!0})],X.prototype,"name",2);ct([h({type:String,reflect:!0})],X.prototype,"icon",2);ct([h({type:String,reflect:!0})],X.prototype,"label",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"multiple",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"required",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"vertical",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"visible",1);ct([Pt()],X.prototype,"_value",2);var hl=Object.defineProperty,po=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&hl(t,i,n),n};const bo=class extends w{constructor(){super(...arguments),this.floating=!1,this._layouts={},this._updateFunctions={}}set layouts(t){this._layouts=t;const i={};for(const[o,n]of Object.entries(t))for(const r in n.elements)i[o]||(i[o]={}),i[o][r]=s=>{const l=this._updateFunctions[o];if(!l)return;const a=l[r];a&&a(s)};this.updateComponent=i}get layouts(){return this._layouts}getLayoutAreas(t){const{template:i}=t,o=i.split(`
`).map(n=>n.trim()).map(n=>n.split('"')[1]).filter(n=>n!==void 0).flatMap(n=>n.split(/\s+/));return[...new Set(o)].filter(n=>n!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this._updateFunctions={},this.layouts[this.layout]){this.innerHTML="",this._updateFunctions[this.layout]={};const t=this._updateFunctions[this.layout],i=this.layouts[this.layout],o=this.getLayoutAreas(i).map(n=>{const r=i.elements[n];if(!r)return null;if(r instanceof HTMLElement)return r.style.gridArea=n,r;if("template"in r){const{template:s,initialState:l}=r,[a,c]=ke.create(s,l);return a.style.gridArea=n,t[n]=c,a}return ke.create(r)}).filter(n=>!!n);this.style.gridTemplate=i.template,this.append(...o),this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange)}}else this._updateFunctions={},this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return f`<slot></slot>`}};bo.styles=E`
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
  `;let xi=bo;po([h({type:Boolean,reflect:!0})],xi.prototype,"floating");po([h({type:String,reflect:!0})],xi.prototype,"layout");const li=class extends w{render(){return f`
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
  `,li.properties={icon:{type:String}};let dl=li;var ul=Object.defineProperty,Be=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&ul(t,i,n),n};const fo=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const t={};for(const i of this.children){const o=i;"value"in o?t[o.name||o.label]=o.value:"checked"in o&&(t[o.name||o.label]=o.checked)}return t}set value(t){const i=[...this.children];for(const o in t){const n=i.find(l=>{const a=l;return a.name===o||a.label===o});if(!n)continue;const r=n,s=t[o];typeof s=="boolean"?r.checked=s:r.value=s}}render(){return f`
      <div class="parent">
        ${this.label||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};fo.styles=E`
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
  `;let ce=fo;Be([h({type:String,reflect:!0})],ce.prototype,"name");Be([h({type:String,reflect:!0})],ce.prototype,"label");Be([h({type:String,reflect:!0})],ce.prototype,"icon");Be([h({type:Boolean,reflect:!0})],ce.prototype,"vertical");var pl=Object.defineProperty,he=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&pl(t,i,n),n};const mo=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Re(this.textContent):this.textContent}render(){return f`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?f`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?f`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};mo.styles=E`
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
  `;let Bt=mo;he([h({type:String,reflect:!0})],Bt.prototype,"img");he([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Bt.prototype,"labelHidden");he([h({type:String,reflect:!0})],Bt.prototype,"icon");he([h({type:Boolean,attribute:"icon-hidden",reflect:!0})],Bt.prototype,"iconHidden");he([h({type:Boolean,reflect:!0})],Bt.prototype,"vertical");var bl=Object.defineProperty,fl=Object.getOwnPropertyDescriptor,H=(e,t,i,o)=>{for(var n=o>1?void 0:o?fl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&bl(t,i,n),n};const go=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=Lt(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:i}=this._input;i&&this.setValue(i.value)}setValue(t){const{value:i}=this._input;let o=t;if(o=o.replace(/[^0-9.-]/g,""),o=o.replace(/(\..*)\./g,"$1"),o.endsWith(".")||(o.lastIndexOf("-")>0&&(o=o[0]+o.substring(1).replace(/-/g,"")),o==="-"||o==="-0"))return;let n=Number(o);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,i&&(i.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:i}=t,o=this.value;let n=!1;const r=a=>{var c;n=!0;const{clientX:d}=a,u=this.step??1,p=((c=u.toString().split(".")[1])==null?void 0:c.length)||0,b=1/(this.sensitivity??1),m=(d-i)/b;if(Math.floor(Math.abs(m))!==Math.abs(m))return;const v=o+m*u;this.setValue(v.toFixed(p))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},l=()=>{document.removeEventListener("mousemove",r),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const i=o=>{o.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=f`
      ${this.pref||this.icon?f`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${jt(this._input)}
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
            >${this.suffix}</bim-label
          >`:null}
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
              .icon=${this.icon}
              >${`${this.pref}: `}</bim-label
            >`:null}
        <bim-label style="z-index: 1;">${this.value}</bim-label>
        ${this.suffix?f`<bim-label style="z-index: 1;">${this.suffix}</bim-label>`:null}
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
    `}};go.styles=E`
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
  `;let P=go;H([h({type:String,reflect:!0})],P.prototype,"name",2);H([h({type:String,reflect:!0})],P.prototype,"icon",2);H([h({type:String,reflect:!0})],P.prototype,"label",2);H([h({type:String,reflect:!0})],P.prototype,"pref",2);H([h({type:Number,reflect:!0})],P.prototype,"min",2);H([h({type:Number,reflect:!0})],P.prototype,"value",1);H([h({type:Number,reflect:!0})],P.prototype,"step",2);H([h({type:Number,reflect:!0})],P.prototype,"sensitivity",2);H([h({type:Number,reflect:!0})],P.prototype,"max",2);H([h({type:String,reflect:!0})],P.prototype,"suffix",2);H([h({type:Boolean,reflect:!0})],P.prototype,"vertical",2);H([h({type:Boolean,reflect:!0})],P.prototype,"slider",2);var ml=Object.defineProperty,gl=Object.getOwnPropertyDescriptor,de=(e,t,i,o)=>{for(var n=o>1?void 0:o?gl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&ml(t,i,n),n};const vo=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return Ae(this,this.valueTransform)}set value(t){const i=[...this.children];for(const o in t){const n=i.find(s=>{const l=s;return l.name===o||l.label===o});if(!n)continue;const r=n;r.value=t[o]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const i of t)i.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const i of t)i.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,f`
      <div class="parent">
        ${this.label||this.name||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};vo.styles=[lt.scrollbar,E`
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
    `];let gt=vo;de([h({type:String,reflect:!0})],gt.prototype,"icon",2);de([h({type:String,reflect:!0})],gt.prototype,"name",2);de([h({type:String,reflect:!0})],gt.prototype,"label",2);de([h({type:Boolean,reflect:!0})],gt.prototype,"hidden",1);de([h({type:Boolean,attribute:"header-hidden",reflect:!0})],gt.prototype,"headerHidden",2);var vl=Object.defineProperty,ue=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&vl(t,i,n),n};const yo=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const t=this.parentElement;let i;return t instanceof gt&&(i=t.valueTransform),Object.values(this.valueTransform).length!==0&&(i=this.valueTransform),Ae(this,i)}set value(t){const i=[...this.children];for(const o in t){const n=i.find(s=>{const l=s;return l.name===o||l.label===o});if(!n)continue;const r=n;r.value=t[o]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,i=f`<svg
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
        ${this.label||this.icon||this.name?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return f`
      <div class="parent">
        ${t?r:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};yo.styles=[lt.scrollbar,E`
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
    `];let Ht=yo;ue([h({type:String,reflect:!0})],Ht.prototype,"icon");ue([h({type:String,reflect:!0})],Ht.prototype,"label");ue([h({type:String,reflect:!0})],Ht.prototype,"name");ue([h({type:Boolean,reflect:!0})],Ht.prototype,"fixed");ue([h({type:Boolean,reflect:!0})],Ht.prototype,"collapsed");var yl=Object.defineProperty,pe=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&yl(t,i,n),n};const _o=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const i of this.children)i instanceof T&&(i.checked=i===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const i=this.findOption(t);if(i){for(const o of this._options)o.checked=o===i;this._value=i,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const i=t.target.assignedElements();for(const o of i)o instanceof T&&(o.noMark=!0,o.removeEventListener("click",this.onOptionClick),o.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(i=>i instanceof T?i.label===t||i.value===t:!1)}firstUpdated(){const t=[...this.children].find(i=>i instanceof T&&i.checked);t&&(this._value=t)}render(){return f`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};_o.styles=E`
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
  `;let Nt=_o;pe([h({type:String,reflect:!0})],Nt.prototype,"name");pe([h({type:String,reflect:!0})],Nt.prototype,"icon");pe([h({type:String,reflect:!0})],Nt.prototype,"label");pe([h({type:Boolean,reflect:!0})],Nt.prototype,"vertical");pe([Pt()],Nt.prototype,"_value");const _l=()=>f`
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
  `,xl=()=>f`
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
  `;var wl=Object.defineProperty,$l=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&wl(t,i,n),n};const xo=class extends w{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return f`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};xo.styles=E`
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
  `;let wo=xo;$l([h({type:String,reflect:!0})],wo.prototype,"column");var El=Object.defineProperty,Cl=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&El(t,i,n),n};const $o=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,i=!1){for(const o of this._groups)o.childrenHidden=typeof t>"u"?!o.childrenHidden:!t,i&&o.toggleChildren(t,i)}render(){return this._groups=[],f`
      <slot></slot>
      ${this.data.map(t=>{const i=document.createElement("bim-table-group");return this._groups.push(i),i.table=this.table,i.data=t,i})}
    `}};$o.styles=E`
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
  `;let Eo=$o;Cl([h({type:Array,attribute:!1})],Eo.prototype,"data");var Sl=Object.defineProperty,kl=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Sl(t,i,n),n};const Co=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,i=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,i&&this._children.toggleGroups(t,i))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const t=this.table.getGroupIndentation(this.data)??0,i=f`
      ${this.table.noIndentation?null:f`
            <style>
              .branch-vertical {
                left: ${t+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,o=document.createDocumentFragment();zt(i,o);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${t-1+(this.table.selectableRows?2.05:.5625)}rem`);let r=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(c);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(u),r=document.createElement("div"),r.addEventListener("click",p=>{p.stopPropagation(),this.toggleChildren()}),r.classList.add("caret"),r.style.left=`${(this.table.selectableRows?1.5:.125)+t}rem`,this.childrenHidden?r.append(a):r.append(d)}const s=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&s.append(o),s.table=this.table,s.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:s}})),r&&this.data.children&&s.append(r),t!==0&&(!this.data.children||this.childrenHidden)&&n&&s.append(n);let l;if(this.data.children){l=document.createElement("bim-table-children"),this._children=l,l.table=this.table,l.data=this.data.children;const a=document.createDocumentFragment();zt(i,a),l.append(a)}return f`
      <div class="parent">${s} ${this.childrenHidden?null:l}</div>
    `}};Co.styles=E`
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
  `;let So=Co;kl([h({type:Boolean,attribute:"children-hidden",reflect:!0})],So.prototype,"childrenHidden");var Al=Object.defineProperty,It=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Al(t,i,n),n};const ko=class extends w{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.name)}get _columnWidths(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.width)}get _isSelected(){var t;return(t=this.table)==null?void 0:t.selection.has(this.data)}onSelectionChange(t){if(!this.table)return;const i=t.target;this.selected=i.value,i.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const t=this.table.getRowIndentation(this.data)??0,i=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,o=[];for(const n in i){if(this.hiddenColumns.includes(n))continue;const r=i[n];let s;if(typeof r=="string"||typeof r=="boolean"||typeof r=="number"?(s=document.createElement("bim-label"),s.textContent=String(r)):r instanceof HTMLElement?s=r:(s=document.createDocumentFragment(),zt(r,s)),!s)continue;const l=document.createElement("bim-table-cell");l.append(s),l.column=n,this._columnNames.indexOf(n)===0&&(l.style.marginLeft=`${this.table.noIndentation?0:t+.75}rem`);const a=this._columnNames.indexOf(n);l.setAttribute("data-column-index",String(a)),l.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),l.toggleAttribute("data-cell-header",this.isHeader),l.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:l}})),o.push(l)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,f`
      ${!this.isHeader&&this.table.selectableRows?f`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${o}
      <slot></slot>
    `}render(){return f`${this._intersecting?this.compute():f``}`}};ko.styles=E`
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
  `;let vt=ko;It([h({type:Boolean,reflect:!0})],vt.prototype,"selected");It([h({attribute:!1})],vt.prototype,"columns");It([h({attribute:!1})],vt.prototype,"hiddenColumns");It([h({attribute:!1})],vt.prototype,"data");It([h({type:Boolean,attribute:"is-header",reflect:!0})],vt.prototype,"isHeader");It([Pt()],vt.prototype,"_intersecting");var Ol=Object.defineProperty,Tl=Object.getOwnPropertyDescriptor,U=(e,t,i,o)=>{for(var n=o>1?void 0:o?Tl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Ol(t,i,n),n};const Ao=class extends w{constructor(){super(...arguments),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(t,i)=>Object.values(i.data).some(o=>String(o).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,i)=>{let o=!1;const n=ri(t)??[];for(const r of n){if("queries"in r){o=!1;break}const{condition:s,value:l}=r;let{key:a}=r;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,o=Object.keys(i.data).filter(d=>d.includes(c)).map(d=>an(i.data[d],s,l)).some(d=>d)}else o=an(i.data[a],s,l);if(!o)break}return o}}set columns(t){const i=[];for(const o of t){const n=typeof o=="string"?{name:o,width:`minmax(${this.minColWidth}, 1fr)`}:o;i.push(n)}this._columns=i,this.computeMissingColumns(this.data),this.dispatchEvent(new Event("columnschange"))}get columns(){return this._columns}get _headerRowData(){const t={};for(const i of this.columns){const{name:o}=i;t[o]=String(o)}return t}get value(){return this._filteredData}set queryString(t){this.toggleAttribute("data-processing",!0),this._queryString=t&&t.trim()!==""?t.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(t){this._data=t,this.updateFilteredData(),this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(t=>{setTimeout(()=>{t(this.data)})})}set hiddenColumns(t){this._hiddenColumns=t,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(ri(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(t){let i=!1;for(const o of t){const{children:n,data:r}=o;for(const s in r)this._columns.map(l=>typeof l=="string"?l:l.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),i=!0);if(n){const s=this.computeMissingColumns(n);s&&!i&&(i=s)}}return i}generateText(t="comma",i=this.value,o="",n=!0){const r=this._textDelimiters[t];let s="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${r}`);const a=`${l.join(r)}
`;s+=a}for(const[a,c]of i.entries()){const{data:d,children:u}=c,p=this.indentationInText?`${o}${a+1}${r}`:"",b=l.map(v=>d[v]??""),m=`${p}${b.join(r)}
`;s+=m,u&&(s+=this.generateText(t,c.children,`${o}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(t){const i={};for(const n of Object.keys(this.dataTransform)){const r=this.columns.find(s=>s.name===n);r&&r.forceDataTransform&&(n in t||(t[n]=""))}const o=t;for(const n in o){const r=this.dataTransform[n];r?i[n]=r(o[n],t):i[n]=t[n]}return i}downloadData(t="BIM Table Data",i="json"){let o=null;if(i==="json"&&(o=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),i==="csv"&&(o=new File([this.csv],`${t}.csv`)),i==="tsv"&&(o=new File([this.tsv],`${t}.tsv`)),!o)return;const n=document.createElement("a");n.href=URL.createObjectURL(o),n.download=o.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,i=this.value,o=0){for(const n of i){if(n.data===t)return o;if(n.children){const r=this.getRowIndentation(t,n.children,o+1);if(r!==null)return r}}return null}getGroupIndentation(t,i=this.value,o=0){for(const n of i){if(n===t)return o;if(n.children){const r=this.getGroupIndentation(t,n.children,o+1);if(r!==null)return r}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(t=!1){if(this._filteredData.length!==0&&!t||!this.loadFunction)return!1;this.loading=!0;try{const i=await this.loadFunction();return this.data=i,this.loading=!1,this._errorLoading=!1,!0}catch(i){if(this.loading=!1,this._filteredData.length!==0)return!1;const o=this.querySelector("[slot='error-loading']"),n=o==null?void 0:o.querySelector("[data-table-element='error-message']");return i instanceof Error&&n&&i.message.trim()!==""&&(n.textContent=i.message),this._errorLoading=!0,!1}}filter(t,i=this.filterFunction??this._stringFilterFunction,o=this.data){const n=[];for(const r of o)if(i(t,r)){if(this.preserveStructureOnFilter){const s={data:r.data};if(r.children){const l=this.filter(t,i,r.children);l.length&&(s.children=l)}n.push(s)}else if(n.push({data:r.data}),r.children){const s=this.filter(t,i,r.children);n.push(...s)}}else if(r.children){const s=this.filter(t,i,r.children);this.preserveStructureOnFilter&&s.length?n.push({data:r.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return _l();if(this._errorLoading)return f`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return f`<slot name="missing-data"></slot>`;const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const i=document.createElement("bim-table-children");return i.table=this,i.data=this.value,i.style.gridArea="Body",i.style.backgroundColor="transparent",f`
      <div class="parent">
        ${this.headersHidden?null:t} ${xl()}
        <div style="overflow-x: hidden; grid-area: Body">${i}</div>
      </div>
    `}};Ao.styles=[lt.scrollbar,E`
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
    `];let N=Ao;U([Pt()],N.prototype,"_filteredData",2);U([h({type:Boolean,attribute:"headers-hidden",reflect:!0})],N.prototype,"headersHidden",2);U([h({type:String,attribute:"min-col-width",reflect:!0})],N.prototype,"minColWidth",2);U([h({type:Array,attribute:!1})],N.prototype,"columns",1);U([h({type:Array,attribute:!1})],N.prototype,"data",1);U([h({type:Boolean,reflect:!0})],N.prototype,"expanded",2);U([h({type:Boolean,reflect:!0,attribute:"selectable-rows"})],N.prototype,"selectableRows",2);U([h({attribute:!1})],N.prototype,"selection",2);U([h({type:Boolean,attribute:"no-indentation",reflect:!0})],N.prototype,"noIndentation",2);U([h({type:Boolean,reflect:!0})],N.prototype,"loading",2);U([Pt()],N.prototype,"_errorLoading",2);var zl=Object.defineProperty,Ll=Object.getOwnPropertyDescriptor,He=(e,t,i,o)=>{for(var n=o>1?void 0:o?Ll(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&zl(t,i,n),n};const Oo=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const i=[...t.children].indexOf(this);this.name=`${this._defaultName}${i}`}}render(){return f` <slot></slot> `}};Oo.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let M=Oo;He([h({type:String,reflect:!0})],M.prototype,"name",2);He([h({type:String,reflect:!0})],M.prototype,"label",2);He([h({type:String,reflect:!0})],M.prototype,"icon",2);He([h({type:Boolean,reflect:!0})],M.prototype,"hidden",1);var jl=Object.defineProperty,Pl=Object.getOwnPropertyDescriptor,Ft=(e,t,i,o)=>{for(var n=o>1?void 0:o?Pl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&jl(t,i,n),n};const To=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=t=>{const i=t.target;i instanceof M&&!i.hidden&&(i.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=i.name,i.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const i=[...this.children],o=i.find(n=>n instanceof M&&n.name===t);for(const n of i){if(!(n instanceof M))continue;n.hidden=o!==n;const r=this.getTabSwitcher(n.name);r&&r.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(i=>i.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof M))continue;const i=document.createElement("div");i.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),i.setAttribute("data-name",t.name),i.className="switcher";const o=document.createElement("bim-label");o.textContent=t.label??"",o.icon=t.icon,i.append(o),this._switchers.push(i)}}onSlotChange(t){this.createSwitchers();const i=t.target.assignedElements(),o=i.find(n=>n instanceof M?this.tab?n.name===this.tab:!n.hidden:!1);o&&o instanceof M&&(this.tab=o.name);for(const n of i){if(!(n instanceof M)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),o!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return f`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};To.styles=[lt.scrollbar,E`
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
    `];let yt=To;Ft([Pt()],yt.prototype,"_switchers",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"bottom",2);Ft([h({type:Boolean,attribute:"switchers-hidden",reflect:!0})],yt.prototype,"switchersHidden",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"floating",2);Ft([h({type:String,reflect:!0})],yt.prototype,"tab",1);Ft([h({type:Boolean,attribute:"switchers-full",reflect:!0})],yt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cn=e=>e??A;var Ml=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,K=(e,t,i,o)=>{for(var n=o>1?void 0:o?Rl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Ml(t,i,n),n};const zo=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return ri(this.value)}onInputChange(t){t.stopPropagation();const i=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=i.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var t;const i=(t=this.shadowRoot)==null?void 0:t.querySelector("input");i==null||i.focus()})}render(){return f`
      <bim-input
        .name=${this.name}
        .icon=${this.icon}
        .label=${this.label}
        .vertical=${this.vertical}
      >
        ${this.type==="area"?f` <textarea
              aria-label=${this.label||this.name||"Text Input"}
              .value=${this.value}
              .rows=${this.rows??5}
              placeholder=${cn(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:f` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${cn(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};zo.styles=[lt.scrollbar,E`
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
    `];let G=zo;K([h({type:String,reflect:!0})],G.prototype,"icon",2);K([h({type:String,reflect:!0})],G.prototype,"label",2);K([h({type:String,reflect:!0})],G.prototype,"name",2);K([h({type:String,reflect:!0})],G.prototype,"placeholder",2);K([h({type:String,reflect:!0})],G.prototype,"value",2);K([h({type:Boolean,reflect:!0})],G.prototype,"vertical",2);K([h({type:Number,reflect:!0})],G.prototype,"debounce",2);K([h({type:Number,reflect:!0})],G.prototype,"rows",2);K([h({type:String,reflect:!0})],G.prototype,"type",1);var Bl=Object.defineProperty,Hl=Object.getOwnPropertyDescriptor,Lo=(e,t,i,o)=>{for(var n=o>1?void 0:o?Hl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Bl(t,i,n),n};const jo=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const i of t)this.vertical?i.setAttribute("label-hidden",""):i.removeAttribute("label-hidden")}render(){return f`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};jo.styles=E`
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
  `;let Ne=jo;Lo([h({type:Number,reflect:!0})],Ne.prototype,"rows",2);Lo([h({type:Boolean,reflect:!0})],Ne.prototype,"vertical",1);var Nl=Object.defineProperty,Il=Object.getOwnPropertyDescriptor,Ie=(e,t,i,o)=>{for(var n=o>1?void 0:o?Il(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Nl(t,i,n),n};const Po=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const i of t)i instanceof Ne&&(i.vertical=this.vertical),i.toggleAttribute("label-hidden",this.vertical)}render(){return f`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Po.styles=E`
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
  `;let Dt=Po;Ie([h({type:String,reflect:!0})],Dt.prototype,"label",2);Ie([h({type:String,reflect:!0})],Dt.prototype,"icon",2);Ie([h({type:Boolean,reflect:!0})],Dt.prototype,"vertical",1);Ie([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Dt.prototype,"labelHidden",1);var Fl=Object.defineProperty,Dl=Object.getOwnPropertyDescriptor,wi=(e,t,i,o)=>{for(var n=o>1?void 0:o?Dl(t,i):t,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=(o?s(t,i,n):s(n))||n);return o&&n&&Fl(t,i,n),n};const Mo=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const i of t)i instanceof Dt&&(i.labelHidden=this.vertical&&!so.config.sectionLabelOnVerticalToolbar,i.vertical=this.vertical)}render(){return f`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Mo.styles=E`
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
  `;let Fe=Mo;wi([h({type:String,reflect:!0})],Fe.prototype,"icon",2);wi([h({type:Boolean,attribute:"labels-hidden",reflect:!0})],Fe.prototype,"labelsHidden",2);wi([h({type:Boolean,reflect:!0})],Fe.prototype,"vertical",1);var Ul=Object.defineProperty,Vl=(e,t,i,o)=>{for(var n=void 0,r=e.length-1,s;r>=0;r--)(s=e[r])&&(n=s(t,i,n)||n);return n&&Ul(t,i,n),n};const Ro=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return f`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Ro.styles=E`
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
  `;let Bo=Ro;Vl([h({type:String,reflect:!0})],Bo.prototype,"name");export{ke as L,so as T,f as m};
