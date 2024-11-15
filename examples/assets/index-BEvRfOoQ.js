var Br=Object.defineProperty,Ir=(e,t,i)=>t in e?Br(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,ht=(e,t,i)=>(Ir(e,typeof t!="symbol"?t+"":t,i),i);const Ct=Math.min,Q=Math.max,ve=Math.round,nt=e=>({x:e,y:e}),Nr={left:"right",right:"left",bottom:"top",top:"bottom"},Fr={start:"end",end:"start"};function $i(e,t,i){return Q(e,Ct(t,i))}function ne(e,t){return typeof e=="function"?e(t):e}function J(e){return e.split("-")[0]}function Ae(e){return e.split("-")[1]}function hn(e){return e==="x"?"y":"x"}function dn(e){return e==="y"?"height":"width"}function bt(e){return["top","bottom"].includes(J(e))?"y":"x"}function un(e){return hn(bt(e))}function Dr(e,t,i){i===void 0&&(i=!1);const r=Ae(e),n=un(e),o=dn(n);let s=n==="x"?r===(i?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[o]>t.floating[o]&&(s=ye(s)),[s,ye(s)]}function Ur(e){const t=ye(e);return[Ye(e),t,Ye(t)]}function Ye(e){return e.replace(/start|end/g,t=>Fr[t])}function Vr(e,t,i){const r=["left","right"],n=["right","left"],o=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return i?t?n:r:t?r:n;case"left":case"right":return t?o:s;default:return[]}}function qr(e,t,i,r){const n=Ae(e);let o=Vr(J(e),i==="start",r);return n&&(o=o.map(s=>s+"-"+n),t&&(o=o.concat(o.map(Ye)))),o}function ye(e){return e.replace(/left|right|bottom|top/g,t=>Nr[t])}function Wr(e){return{top:0,right:0,bottom:0,left:0,...e}}function pn(e){return typeof e!="number"?Wr(e):{top:e,right:e,bottom:e,left:e}}function kt(e){const{x:t,y:i,width:r,height:n}=e;return{width:r,height:n,top:i,left:t,right:t+r,bottom:i+n,x:t,y:i}}function Ei(e,t,i){let{reference:r,floating:n}=e;const o=bt(t),s=un(t),l=dn(s),a=J(t),c=o==="y",d=r.x+r.width/2-n.width/2,u=r.y+r.height/2-n.height/2,p=r[l]/2-n[l]/2;let b;switch(a){case"top":b={x:d,y:r.y-n.height};break;case"bottom":b={x:d,y:r.y+r.height};break;case"right":b={x:r.x+r.width,y:u};break;case"left":b={x:r.x-n.width,y:u};break;default:b={x:r.x,y:r.y}}switch(Ae(t)){case"start":b[s]-=p*(i&&c?-1:1);break;case"end":b[s]+=p*(i&&c?-1:1);break}return b}const Yr=async(e,t,i)=>{const{placement:r="bottom",strategy:n="absolute",middleware:o=[],platform:s}=i,l=o.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:e,floating:t,strategy:n}),{x:d,y:u}=Ei(c,r,a),p=r,b={},m=0;for(let v=0;v<l.length;v++){const{name:g,fn:S}=l[v],{x:C,y:x,data:$,reset:z}=await S({x:d,y:u,initialPlacement:r,placement:p,strategy:n,middlewareData:b,rects:c,platform:s,elements:{reference:e,floating:t}});d=C??d,u=x??u,b={...b,[g]:{...b[g],...$}},z&&m<=50&&(m++,typeof z=="object"&&(z.placement&&(p=z.placement),z.rects&&(c=z.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:n}):z.rects),{x:d,y:u}=Ei(c,p,a)),v=-1)}return{x:d,y:u,placement:p,strategy:n,middlewareData:b}};async function bn(e,t){var i;t===void 0&&(t={});const{x:r,y:n,platform:o,rects:s,elements:l,strategy:a}=e,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:p=!1,padding:b=0}=ne(t,e),m=pn(b),v=l[p?u==="floating"?"reference":"floating":u],g=kt(await o.getClippingRect({element:(i=await(o.isElement==null?void 0:o.isElement(v)))==null||i?v:v.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(l.floating)),boundary:c,rootBoundary:d,strategy:a})),S=u==="floating"?{x:r,y:n,width:s.floating.width,height:s.floating.height}:s.reference,C=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l.floating)),x=await(o.isElement==null?void 0:o.isElement(C))?await(o.getScale==null?void 0:o.getScale(C))||{x:1,y:1}:{x:1,y:1},$=kt(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:S,offsetParent:C,strategy:a}):S);return{top:(g.top-$.top+m.top)/x.y,bottom:($.bottom-g.bottom+m.bottom)/x.y,left:(g.left-$.left+m.left)/x.x,right:($.right-g.right+m.right)/x.x}}const Gr=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,r;const{placement:n,middlewareData:o,rects:s,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:p,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...g}=ne(e,t);if((i=o.arrow)!=null&&i.alignmentOffset)return{};const S=J(n),C=bt(l),x=J(l)===l,$=await(a.isRTL==null?void 0:a.isRTL(c.floating)),z=p||(x||!v?[ye(l)]:Ur(l)),y=m!=="none";!p&&y&&z.push(...qr(l,v,m,$));const j=[l,...z],N=await bn(t,g),F=[];let k=((r=o.flip)==null?void 0:r.overflows)||[];if(d&&F.push(N[S]),u){const V=Dr(n,s,$);F.push(N[V[0]],N[V[1]])}if(k=[...k,{placement:n,overflows:F}],!F.every(V=>V<=0)){var _t,Ut;const V=(((_t=o.flip)==null?void 0:_t.index)||0)+1,wt=j[V];if(wt)return{data:{index:V,overflows:k},reset:{placement:wt}};let Z=(Ut=k.filter(tt=>tt.overflows[0]<=0).sort((tt,q)=>tt.overflows[1]-q.overflows[1])[0])==null?void 0:Ut.placement;if(!Z)switch(b){case"bestFit":{var xt;const tt=(xt=k.filter(q=>{if(y){const et=bt(q.placement);return et===C||et==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(et=>et>0).reduce((et,Hr)=>et+Hr,0)]).sort((q,et)=>q[1]-et[1])[0])==null?void 0:xt[0];tt&&(Z=tt);break}case"initialPlacement":Z=l;break}if(n!==Z)return{reset:{placement:Z}}}return{}}}};function fn(e){const t=Ct(...e.map(o=>o.left)),i=Ct(...e.map(o=>o.top)),r=Q(...e.map(o=>o.right)),n=Q(...e.map(o=>o.bottom));return{x:t,y:i,width:r-t,height:n-i}}function Qr(e){const t=e.slice().sort((n,o)=>n.y-o.y),i=[];let r=null;for(let n=0;n<t.length;n++){const o=t[n];!r||o.y-r.y>r.height/2?i.push([o]):i[i.length-1].push(o),r=o}return i.map(n=>kt(fn(n)))}const Jr=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:r,rects:n,platform:o,strategy:s}=t,{padding:l=2,x:a,y:c}=ne(e,t),d=Array.from(await(o.getClientRects==null?void 0:o.getClientRects(r.reference))||[]),u=Qr(d),p=kt(fn(d)),b=pn(l);function m(){if(u.length===2&&u[0].left>u[1].right&&a!=null&&c!=null)return u.find(g=>a>g.left-b.left&&a<g.right+b.right&&c>g.top-b.top&&c<g.bottom+b.bottom)||p;if(u.length>=2){if(bt(i)==="y"){const k=u[0],_t=u[u.length-1],Ut=J(i)==="top",xt=k.top,V=_t.bottom,wt=Ut?k.left:_t.left,Z=Ut?k.right:_t.right,tt=Z-wt,q=V-xt;return{top:xt,bottom:V,left:wt,right:Z,width:tt,height:q,x:wt,y:xt}}const g=J(i)==="left",S=Q(...u.map(k=>k.right)),C=Ct(...u.map(k=>k.left)),x=u.filter(k=>g?k.left===C:k.right===S),$=x[0].top,z=x[x.length-1].bottom,y=C,j=S,N=j-y,F=z-$;return{top:$,bottom:z,left:y,right:j,width:N,height:F,x:y,y:$}}return p}const v=await o.getElementRects({reference:{getBoundingClientRect:m},floating:r.floating,strategy:s});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function Xr(e,t){const{placement:i,platform:r,elements:n}=e,o=await(r.isRTL==null?void 0:r.isRTL(n.floating)),s=J(i),l=Ae(i),a=bt(i)==="y",c=["left","top"].includes(s)?-1:1,d=o&&a?-1:1,u=ne(t,e);let{mainAxis:p,crossAxis:b,alignmentAxis:m}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return l&&typeof m=="number"&&(b=l==="end"?m*-1:m),a?{x:b*d,y:p*c}:{x:p*c,y:b*d}}const mn=function(e){return{name:"offset",options:e,async fn(t){var i,r;const{x:n,y:o,placement:s,middlewareData:l}=t,a=await Xr(t,e);return s===((i=l.offset)==null?void 0:i.placement)&&(r=l.arrow)!=null&&r.alignmentOffset?{}:{x:n+a.x,y:o+a.y,data:{...a,placement:s}}}}},Kr=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:r,placement:n}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:l={fn:g=>{let{x:S,y:C}=g;return{x:S,y:C}}},...a}=ne(e,t),c={x:i,y:r},d=await bn(t,a),u=bt(J(n)),p=hn(u);let b=c[p],m=c[u];if(o){const g=p==="y"?"top":"left",S=p==="y"?"bottom":"right",C=b+d[g],x=b-d[S];b=$i(C,b,x)}if(s){const g=u==="y"?"top":"left",S=u==="y"?"bottom":"right",C=m+d[g],x=m-d[S];m=$i(C,m,x)}const v=l.fn({...t,[p]:b,[u]:m});return{...v,data:{x:v.x-i,y:v.y-r,enabled:{[p]:o,[u]:s}}}}}};function Oe(){return typeof window<"u"}function rt(e){return gn(e)?(e.nodeName||"").toLowerCase():"#document"}function P(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function st(e){var t;return(t=(gn(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function gn(e){return Oe()?e instanceof Node||e instanceof P(e).Node:!1}function W(e){return Oe()?e instanceof Element||e instanceof P(e).Element:!1}function Y(e){return Oe()?e instanceof HTMLElement||e instanceof P(e).HTMLElement:!1}function Ci(e){return!Oe()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof P(e).ShadowRoot}function re(e){const{overflow:t,overflowX:i,overflowY:r,display:n}=R(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+i)&&!["inline","contents"].includes(n)}function Zr(e){return["table","td","th"].includes(rt(e))}function to(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function ai(e){const t=ci(),i=W(e)?R(e):e;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(i.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(i.contain||"").includes(r))}function eo(e){let t=St(e);for(;Y(t)&&!Te(t);){if(ai(t))return t;if(to(t))return null;t=St(t)}return null}function ci(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Te(e){return["html","body","#document"].includes(rt(e))}function R(e){return P(e).getComputedStyle(e)}function ze(e){return W(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function St(e){if(rt(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Ci(e)&&e.host||st(e);return Ci(t)?t.host:t}function vn(e){const t=St(e);return Te(t)?e.ownerDocument?e.ownerDocument.body:e.body:Y(t)&&re(t)?t:vn(t)}function Ge(e,t,i){var r;t===void 0&&(t=[]),i===void 0&&(i=!0);const n=vn(e),o=n===((r=e.ownerDocument)==null?void 0:r.body),s=P(n);if(o){const l=io(s);return t.concat(s,s.visualViewport||[],re(n)?n:[],l&&i?Ge(l):[])}return t.concat(n,Ge(n,[],i))}function io(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function yn(e){const t=R(e);let i=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const n=Y(e),o=n?e.offsetWidth:i,s=n?e.offsetHeight:r,l=ve(i)!==o||ve(r)!==s;return l&&(i=o,r=s),{width:i,height:r,$:l}}function _n(e){return W(e)?e:e.contextElement}function Et(e){const t=_n(e);if(!Y(t))return nt(1);const i=t.getBoundingClientRect(),{width:r,height:n,$:o}=yn(t);let s=(o?ve(i.width):i.width)/r,l=(o?ve(i.height):i.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const no=nt(0);function xn(e){const t=P(e);return!ci()||!t.visualViewport?no:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function ro(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==P(e)?!1:t}function Jt(e,t,i,r){t===void 0&&(t=!1),i===void 0&&(i=!1);const n=e.getBoundingClientRect(),o=_n(e);let s=nt(1);t&&(r?W(r)&&(s=Et(r)):s=Et(e));const l=ro(o,i,r)?xn(o):nt(0);let a=(n.left+l.x)/s.x,c=(n.top+l.y)/s.y,d=n.width/s.x,u=n.height/s.y;if(o){const p=P(o),b=r&&W(r)?P(r):r;let m=p,v=m.frameElement;for(;v&&r&&b!==m;){const g=Et(v),S=v.getBoundingClientRect(),C=R(v),x=S.left+(v.clientLeft+parseFloat(C.paddingLeft))*g.x,$=S.top+(v.clientTop+parseFloat(C.paddingTop))*g.y;a*=g.x,c*=g.y,d*=g.x,u*=g.y,a+=x,c+=$,m=P(v),v=m.frameElement}}return kt({width:d,height:u,x:a,y:c})}const oo=[":popover-open",":modal"];function wn(e){return oo.some(t=>{try{return e.matches(t)}catch{return!1}})}function so(e){let{elements:t,rect:i,offsetParent:r,strategy:n}=e;const o=n==="fixed",s=st(r),l=t?wn(t.floating):!1;if(r===s||l&&o)return i;let a={scrollLeft:0,scrollTop:0},c=nt(1);const d=nt(0),u=Y(r);if((u||!u&&!o)&&((rt(r)!=="body"||re(s))&&(a=ze(r)),Y(r))){const p=Jt(r);c=Et(r),d.x=p.x+r.clientLeft,d.y=p.y+r.clientTop}return{width:i.width*c.x,height:i.height*c.y,x:i.x*c.x-a.scrollLeft*c.x+d.x,y:i.y*c.y-a.scrollTop*c.y+d.y}}function lo(e){return Array.from(e.getClientRects())}function $n(e){return Jt(st(e)).left+ze(e).scrollLeft}function ao(e){const t=st(e),i=ze(e),r=e.ownerDocument.body,n=Q(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),o=Q(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-i.scrollLeft+$n(e);const l=-i.scrollTop;return R(r).direction==="rtl"&&(s+=Q(t.clientWidth,r.clientWidth)-n),{width:n,height:o,x:s,y:l}}function co(e,t){const i=P(e),r=st(e),n=i.visualViewport;let o=r.clientWidth,s=r.clientHeight,l=0,a=0;if(n){o=n.width,s=n.height;const c=ci();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:o,height:s,x:l,y:a}}function ho(e,t){const i=Jt(e,!0,t==="fixed"),r=i.top+e.clientTop,n=i.left+e.clientLeft,o=Y(e)?Et(e):nt(1),s=e.clientWidth*o.x,l=e.clientHeight*o.y,a=n*o.x,c=r*o.y;return{width:s,height:l,x:a,y:c}}function ki(e,t,i){let r;if(t==="viewport")r=co(e,i);else if(t==="document")r=ao(st(e));else if(W(t))r=ho(t,i);else{const n=xn(e);r={...t,x:t.x-n.x,y:t.y-n.y}}return kt(r)}function En(e,t){const i=St(e);return i===t||!W(i)||Te(i)?!1:R(i).position==="fixed"||En(i,t)}function uo(e,t){const i=t.get(e);if(i)return i;let r=Ge(e,[],!1).filter(l=>W(l)&&rt(l)!=="body"),n=null;const o=R(e).position==="fixed";let s=o?St(e):e;for(;W(s)&&!Te(s);){const l=R(s),a=ai(s);!a&&l.position==="fixed"&&(n=null),(o?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||re(s)&&!a&&En(e,s))?r=r.filter(c=>c!==s):n=l,s=St(s)}return t.set(e,r),r}function po(e){let{element:t,boundary:i,rootBoundary:r,strategy:n}=e;const o=[...i==="clippingAncestors"?uo(t,this._c):[].concat(i),r],s=o[0],l=o.reduce((a,c)=>{const d=ki(t,c,n);return a.top=Q(d.top,a.top),a.right=Ct(d.right,a.right),a.bottom=Ct(d.bottom,a.bottom),a.left=Q(d.left,a.left),a},ki(t,s,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function bo(e){const{width:t,height:i}=yn(e);return{width:t,height:i}}function fo(e,t,i){const r=Y(t),n=st(t),o=i==="fixed",s=Jt(e,!0,o,t);let l={scrollLeft:0,scrollTop:0};const a=nt(0);if(r||!r&&!o)if((rt(t)!=="body"||re(n))&&(l=ze(t)),r){const u=Jt(t,!0,o,t);a.x=u.x+t.clientLeft,a.y=u.y+t.clientTop}else n&&(a.x=$n(n));const c=s.left+l.scrollLeft-a.x,d=s.top+l.scrollTop-a.y;return{x:c,y:d,width:s.width,height:s.height}}function Si(e,t){return!Y(e)||R(e).position==="fixed"?null:t?t(e):e.offsetParent}function Cn(e,t){const i=P(e);if(!Y(e)||wn(e))return i;let r=Si(e,t);for(;r&&Zr(r)&&R(r).position==="static";)r=Si(r,t);return r&&(rt(r)==="html"||rt(r)==="body"&&R(r).position==="static"&&!ai(r))?i:r||eo(e)||i}const mo=async function(e){const t=this.getOffsetParent||Cn,i=this.getDimensions;return{reference:fo(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function go(e){return R(e).direction==="rtl"}const vo={convertOffsetParentRelativeRectToViewportRelativeRect:so,getDocumentElement:st,getClippingRect:po,getOffsetParent:Cn,getElementRects:mo,getClientRects:lo,getDimensions:bo,getScale:Et,isElement:W,isRTL:go},kn=Kr,Sn=Gr,An=Jr,On=(e,t,i)=>{const r=new Map,n={platform:vo,...i},o={...n.platform,_c:r};return Yr(e,t,{...n,platform:o})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,hi=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,di=Symbol(),Ai=new WeakMap;let Tn=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==di)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(hi&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Ai.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Ai.set(t,e))}return e}toString(){return this.cssText}};const yo=e=>new Tn(typeof e=="string"?e:e+"",void 0,di),E=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((r,n,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[o+1],e[0]);return new Tn(i,e,di)},_o=(e,t)=>{if(hi)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const r=document.createElement("style"),n=me.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=i.cssText,e.appendChild(r)}},Oi=hi?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const r of t.cssRules)i+=r.cssText;return yo(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xo,defineProperty:wo,getOwnPropertyDescriptor:$o,getOwnPropertyNames:Eo,getOwnPropertySymbols:Co,getPrototypeOf:ko}=Object,At=globalThis,Ti=At.trustedTypes,So=Ti?Ti.emptyScript:"",zi=At.reactiveElementPolyfillSupport,Wt=(e,t)=>e,_e={toAttribute(e,t){switch(t){case Boolean:e=e?So:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},ui=(e,t)=>!xo(e,t),ji={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:ui};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),At.litPropertyMetadata??(At.litPropertyMetadata=new WeakMap);class $t extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=ji){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(t,r,i);n!==void 0&&wo(this.prototype,t,n)}}static getPropertyDescriptor(t,i,r){const{get:n,set:o}=$o(this.prototype,t)??{get(){return this[i]},set(s){this[i]=s}};return{get(){return n==null?void 0:n.call(this)},set(s){const l=n==null?void 0:n.call(this);o.call(this,s),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ji}static _$Ei(){if(this.hasOwnProperty(Wt("elementProperties")))return;const t=ko(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Wt("properties"))){const i=this.properties,r=[...Eo(i),...Co(i)];for(const n of r)this.createProperty(n,i[n])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[r,n]of i)this.elementProperties.set(r,n)}this._$Eh=new Map;for(const[i,r]of this.elementProperties){const n=this._$Eu(i,r);n!==void 0&&this._$Eh.set(n,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const n of r)i.unshift(Oi(n))}else t!==void 0&&i.push(Oi(t));return i}static _$Eu(t,i){const r=i.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const r of i.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _o(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostConnected)==null?void 0:r.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostDisconnected)==null?void 0:r.call(i)})}attributeChangedCallback(t,i,r){this._$AK(t,r)}_$EC(t,i){var r;const n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){const s=(((r=n.converter)==null?void 0:r.toAttribute)!==void 0?n.converter:_e).toAttribute(i,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,i){var r;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const s=n.getPropertyOptions(o),l=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)==null?void 0:r.fromAttribute)!==void 0?s.converter:_e;this._$Em=o,this[o]=l.fromAttribute(i,s.type),this._$Em=null}}requestUpdate(t,i,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ui)(this[t],i))return;this.P(t,i,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,r){this._$AL.has(t)||this._$AL.set(t,i),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,s]of n)s.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],s)}let i=!1;const r=this._$AL;try{i=this.shouldUpdate(r),i?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(r)):this._$EU()}catch(n){throw i=!1,this._$EU(),n}i&&this._$AE(r)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(r=>{var n;return(n=r.hostUpdated)==null?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}$t.elementStyles=[],$t.shadowRootOptions={mode:"open"},$t[Wt("elementProperties")]=new Map,$t[Wt("finalized")]=new Map,zi==null||zi({ReactiveElement:$t}),(At.reactiveElementVersions??(At.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe=globalThis,we=xe.trustedTypes,Pi=we?we.createPolicy("lit-html",{createHTML:e=>e}):void 0,zn="$lit$",it=`lit$${Math.random().toFixed(9).slice(2)}$`,jn="?"+it,Ao=`<${jn}>`,ft=document,Xt=()=>ft.createComment(""),Kt=e=>e===null||typeof e!="object"&&typeof e!="function",pi=Array.isArray,Oo=e=>pi(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Fe=`[ 	
\f\r]`,Vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Li=/-->/g,Mi=/>/g,dt=RegExp(`>|${Fe}(?:([^\\s"'>=/]+)(${Fe}*=${Fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ri=/'/g,Hi=/"/g,Pn=/^(?:script|style|textarea|title)$/i,To=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),f=To(1),Ot=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Bi=new WeakMap,ut=ft.createTreeWalker(ft,129);function Ln(e,t){if(!pi(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Pi!==void 0?Pi.createHTML(t):t}const zo=(e,t)=>{const i=e.length-1,r=[];let n,o=t===2?"<svg>":t===3?"<math>":"",s=Vt;for(let l=0;l<i;l++){const a=e[l];let c,d,u=-1,p=0;for(;p<a.length&&(s.lastIndex=p,d=s.exec(a),d!==null);)p=s.lastIndex,s===Vt?d[1]==="!--"?s=Li:d[1]!==void 0?s=Mi:d[2]!==void 0?(Pn.test(d[2])&&(n=RegExp("</"+d[2],"g")),s=dt):d[3]!==void 0&&(s=dt):s===dt?d[0]===">"?(s=n??Vt,u=-1):d[1]===void 0?u=-2:(u=s.lastIndex-d[2].length,c=d[1],s=d[3]===void 0?dt:d[3]==='"'?Hi:Ri):s===Hi||s===Ri?s=dt:s===Li||s===Mi?s=Vt:(s=dt,n=void 0);const b=s===dt&&e[l+1].startsWith("/>")?" ":"";o+=s===Vt?a+Ao:u>=0?(r.push(c),a.slice(0,u)+zn+a.slice(u)+it+b):a+it+(u===-2?l:b)}return[Ln(e,o+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class Zt{constructor({strings:t,_$litType$:i},r){let n;this.parts=[];let o=0,s=0;const l=t.length-1,a=this.parts,[c,d]=zo(t,i);if(this.el=Zt.createElement(c,r),ut.currentNode=this.el.content,i===2||i===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=ut.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(zn)){const p=d[s++],b=n.getAttribute(u).split(it),m=/([.?@])?(.*)/.exec(p);a.push({type:1,index:o,name:m[2],strings:b,ctor:m[1]==="."?Po:m[1]==="?"?Lo:m[1]==="@"?Mo:je}),n.removeAttribute(u)}else u.startsWith(it)&&(a.push({type:6,index:o}),n.removeAttribute(u));if(Pn.test(n.tagName)){const u=n.textContent.split(it),p=u.length-1;if(p>0){n.textContent=we?we.emptyScript:"";for(let b=0;b<p;b++)n.append(u[b],Xt()),ut.nextNode(),a.push({type:2,index:++o});n.append(u[p],Xt())}}}else if(n.nodeType===8)if(n.data===jn)a.push({type:2,index:o});else{let u=-1;for(;(u=n.data.indexOf(it,u+1))!==-1;)a.push({type:7,index:o}),u+=it.length-1}o++}}static createElement(t,i){const r=ft.createElement("template");return r.innerHTML=t,r}}function Tt(e,t,i=e,r){var n,o;if(t===Ot)return t;let s=r!==void 0?(n=i._$Co)==null?void 0:n[r]:i._$Cl;const l=Kt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==l&&((o=s==null?void 0:s._$AO)==null||o.call(s,!1),l===void 0?s=void 0:(s=new l(e),s._$AT(e,i,r)),r!==void 0?(i._$Co??(i._$Co=[]))[r]=s:i._$Cl=s),s!==void 0&&(t=Tt(e,s._$AS(e,t.values),s,r)),t}class jo{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:r}=this._$AD,n=((t==null?void 0:t.creationScope)??ft).importNode(i,!0);ut.currentNode=n;let o=ut.nextNode(),s=0,l=0,a=r[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new oe(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new Ro(o,this,t)),this._$AV.push(c),a=r[++l]}s!==(a==null?void 0:a.index)&&(o=ut.nextNode(),s++)}return ut.currentNode=ft,n}p(t){let i=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,i),i+=r.strings.length-2):r._$AI(t[i])),i++}}class oe{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,r,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=r,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=Tt(this,t,i),Kt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==Ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&Kt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ft.createTextNode(t)),this._$AH=t}$(t){var i;const{values:r,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Zt.createElement(Ln(n.h,n.h[0]),this.options)),n);if(((i=this._$AH)==null?void 0:i._$AD)===o)this._$AH.p(r);else{const s=new jo(o,this),l=s.u(this.options);s.p(r),this.T(l),this._$AH=s}}_$AC(t){let i=Bi.get(t.strings);return i===void 0&&Bi.set(t.strings,i=new Zt(t)),i}k(t){pi(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let r,n=0;for(const o of t)n===i.length?i.push(r=new oe(this.O(Xt()),this.O(Xt()),this,this.options)):r=i[n],r._$AI(o),n++;n<i.length&&(this._$AR(r&&r._$AB.nextSibling,n),i.length=n)}_$AR(t=this._$AA.nextSibling,i){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,i);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class je{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,r,n,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=n,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=A}_$AI(t,i=this,r,n){const o=this.strings;let s=!1;if(o===void 0)t=Tt(this,t,i,0),s=!Kt(t)||t!==this._$AH&&t!==Ot,s&&(this._$AH=t);else{const l=t;let a,c;for(t=o[0],a=0;a<o.length-1;a++)c=Tt(this,l[r+a],i,a),c===Ot&&(c=this._$AH[a]),s||(s=!Kt(c)||c!==this._$AH[a]),c===A?t=A:t!==A&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Po extends je{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class Lo extends je{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class Mo extends je{constructor(t,i,r,n,o){super(t,i,r,n,o),this.type=5}_$AI(t,i=this){if((t=Tt(this,t,i,0)??A)===Ot)return;const r=this._$AH,n=t===A&&r!==A||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==A&&(r===A||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Ro{constructor(t,i,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Tt(this,t)}}const Ii=xe.litHtmlPolyfillSupport;Ii==null||Ii(Zt,oe),(xe.litHtmlVersions??(xe.litHtmlVersions=[])).push("3.2.1");const zt=(e,t,i)=>{const r=(i==null?void 0:i.renderBefore)??t;let n=r._$litPart$;if(n===void 0){const o=(i==null?void 0:i.renderBefore)??null;r._$litPart$=n=new oe(t.insertBefore(Xt(),o),o,void 0,i??{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let w=class extends $t{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=zt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ot}};var Ni;w._$litElement$=!0,w.finalized=!0,(Ni=globalThis.litElementHydrateSupport)==null||Ni.call(globalThis,{LitElement:w});const Fi=globalThis.litElementPolyfillSupport;Fi==null||Fi({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ho={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:ui},Bo=(e=Ho,t,i)=>{const{kind:r,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(i.name,e),r==="accessor"){const{name:s}=i;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(s,a,e)},init(l){return l!==void 0&&this.P(s,void 0,e),l}}}if(r==="setter"){const{name:s}=i;return function(l){const a=this[s];t.call(this,l),this.requestUpdate(s,a,e)}}throw Error("Unsupported decorator location: "+r)};function h(e){return(t,i)=>typeof i=="object"?Bo(e,t,i):((r,n,o)=>{const s=n.hasOwnProperty(o);return n.constructor.createProperty(o,s?{...r,wrapped:!0}:r),s?Object.getOwnPropertyDescriptor(n,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lt(e){return h({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Io=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const No={CHILD:2},Fo=e=>(...t)=>({_$litDirective$:e,values:t});let Do=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yt=(e,t)=>{var i;const r=e._$AN;if(r===void 0)return!1;for(const n of r)(i=n._$AO)==null||i.call(n,t,!1),Yt(n,t);return!0},$e=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},Mn=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),qo(t)}};function Uo(e){this._$AN!==void 0?($e(this),this._$AM=e,Mn(this)):this._$AM=e}function Vo(e,t=!1,i=0){const r=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(r))for(let o=i;o<r.length;o++)Yt(r[o],!1),$e(r[o]);else r!=null&&(Yt(r,!1),$e(r));else Yt(this,e)}const qo=e=>{e.type==No.CHILD&&(e._$AP??(e._$AP=Vo),e._$AQ??(e._$AQ=Uo))};class Wo extends Do{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,r){super._$AT(t,i,r),Mn(this),this.isConnected=t._$AU}_$AO(t,i=!0){var r,n;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(n=this.disconnected)==null||n.call(this)),i&&(Yt(this,t),$e(this))}setValue(t){if(Io(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt=()=>new Yo;class Yo{}const De=new WeakMap,Pt=Fo(class extends Wo{render(e){return A}update(e,[t]){var i;const r=t!==this.Y;return r&&this.Y!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),A}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=De.get(t);i===void 0&&(i=new WeakMap,De.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=De.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Rn=Object.freeze({left:0,top:0,width:16,height:16}),Ee=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),se=Object.freeze({...Rn,...Ee}),Qe=Object.freeze({...se,body:"",hidden:!1}),Go=Object.freeze({width:null,height:null}),Hn=Object.freeze({...Go,...Ee});function Qo(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function r(n){for(;n<0;)n+=4;return n%4}if(i===""){const n=parseInt(e);return isNaN(n)?0:r(n)}else if(i!==e){let n=0;switch(i){case"%":n=25;break;case"deg":n=90}if(n){let o=parseFloat(e.slice(0,e.length-i.length));return isNaN(o)?0:(o=o/n,o%1===0?r(o):0)}}return t}const Jo=/[\s,]+/;function Xo(e,t){t.split(Jo).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const Bn={...Hn,preserveAspectRatio:""};function Di(e){const t={...Bn},i=(r,n)=>e.getAttribute(r)||n;return t.width=i("width",null),t.height=i("height",null),t.rotate=Qo(i("rotate","")),Xo(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function Ko(e,t){for(const i in Bn)if(e[i]!==t[i])return!0;return!1}const Gt=/^[a-z0-9]+(-[a-z0-9]+)*$/,le=(e,t,i,r="")=>{const n=e.split(":");if(e.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;r=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:r,prefix:a,name:l};return t&&!ge(c)?null:c}const o=n[0],s=o.split("-");if(s.length>1){const l={provider:r,prefix:s.shift(),name:s.join("-")};return t&&!ge(l)?null:l}if(i&&r===""){const l={provider:r,prefix:"",name:o};return t&&!ge(l,i)?null:l}return null},ge=(e,t)=>e?!!((e.provider===""||e.provider.match(Gt))&&(t&&e.prefix===""||e.prefix.match(Gt))&&e.name.match(Gt)):!1;function Zo(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const r=((e.rotate||0)+(t.rotate||0))%4;return r&&(i.rotate=r),i}function Ui(e,t){const i=Zo(e,t);for(const r in Qe)r in Ee?r in e&&!(r in i)&&(i[r]=Ee[r]):r in t?i[r]=t[r]:r in e&&(i[r]=e[r]);return i}function ts(e,t){const i=e.icons,r=e.aliases||Object.create(null),n=Object.create(null);function o(s){if(i[s])return n[s]=[];if(!(s in n)){n[s]=null;const l=r[s]&&r[s].parent,a=l&&o(l);a&&(n[s]=[l].concat(a))}return n[s]}return Object.keys(i).concat(Object.keys(r)).forEach(o),n}function es(e,t,i){const r=e.icons,n=e.aliases||Object.create(null);let o={};function s(l){o=Ui(r[l]||n[l],o)}return s(t),i.forEach(s),Ui(e,o)}function In(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(n=>{t(n,null),i.push(n)});const r=ts(e);for(const n in r){const o=r[n];o&&(t(n,es(e,n,o)),i.push(n))}return i}const is={provider:"",aliases:{},not_found:{},...Rn};function Ue(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function Nn(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Ue(e,is))return null;const i=t.icons;for(const n in i){const o=i[n];if(!n.match(Gt)||typeof o.body!="string"||!Ue(o,Qe))return null}const r=t.aliases||Object.create(null);for(const n in r){const o=r[n],s=o.parent;if(!n.match(Gt)||typeof s!="string"||!i[s]&&!r[s]||!Ue(o,Qe))return null}return t}const Ce=Object.create(null);function ns(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function ot(e,t){const i=Ce[e]||(Ce[e]=Object.create(null));return i[t]||(i[t]=ns(e,t))}function bi(e,t){return Nn(t)?In(t,(i,r)=>{r?e.icons[i]=r:e.missing.add(i)}):[]}function rs(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function os(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(Ce)).forEach(r=>{(typeof r=="string"&&typeof t=="string"?[t]:Object.keys(Ce[r]||{})).forEach(n=>{const o=ot(r,n);i=i.concat(Object.keys(o.icons).map(s=>(r!==""?"@"+r+":":"")+n+":"+s))})}),i}let te=!1;function Fn(e){return typeof e=="boolean"&&(te=e),te}function ee(e){const t=typeof e=="string"?le(e,!0,te):e;if(t){const i=ot(t.provider,t.prefix),r=t.name;return i.icons[r]||(i.missing.has(r)?null:void 0)}}function Dn(e,t){const i=le(e,!0,te);if(!i)return!1;const r=ot(i.provider,i.prefix);return rs(r,i.name,t)}function Vi(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),te&&!t&&!e.prefix){let n=!1;return Nn(e)&&(e.prefix="",In(e,(o,s)=>{s&&Dn(o,s)&&(n=!0)})),n}const i=e.prefix;if(!ge({provider:t,prefix:i,name:"a"}))return!1;const r=ot(t,i);return!!bi(r,e)}function qi(e){return!!ee(e)}function ss(e){const t=ee(e);return t?{...se,...t}:null}function ls(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((n,o)=>n.provider!==o.provider?n.provider.localeCompare(o.provider):n.prefix!==o.prefix?n.prefix.localeCompare(o.prefix):n.name.localeCompare(o.name));let r={provider:"",prefix:"",name:""};return e.forEach(n=>{if(r.name===n.name&&r.prefix===n.prefix&&r.provider===n.provider)return;r=n;const o=n.provider,s=n.prefix,l=n.name,a=i[o]||(i[o]=Object.create(null)),c=a[s]||(a[s]=ot(o,s));let d;l in c.icons?d=t.loaded:s===""||c.missing.has(l)?d=t.missing:d=t.pending;const u={provider:o,prefix:s,name:l};d.push(u)}),t}function Un(e,t){e.forEach(i=>{const r=i.loaderCallbacks;r&&(i.loaderCallbacks=r.filter(n=>n.id!==t))})}function as(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const r=e.provider,n=e.prefix;t.forEach(o=>{const s=o.icons,l=s.pending.length;s.pending=s.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(e.icons[c])s.loaded.push({provider:r,prefix:n,name:c});else if(e.missing.has(c))s.missing.push({provider:r,prefix:n,name:c});else return i=!0,!0;return!1}),s.pending.length!==l&&(i||Un([e],o.id),o.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),o.abort))})}))}let cs=0;function hs(e,t,i){const r=cs++,n=Un.bind(null,i,r);if(!t.pending.length)return n;const o={id:r,icons:t,callback:e,abort:n};return i.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(o)}),n}const Je=Object.create(null);function Wi(e,t){Je[e]=t}function Xe(e){return Je[e]||Je[""]}function ds(e,t=!0,i=!1){const r=[];return e.forEach(n=>{const o=typeof n=="string"?le(n,t,i):n;o&&r.push(o)}),r}var us={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function ps(e,t,i,r){const n=e.resources.length,o=e.random?Math.floor(Math.random()*n):e.index;let s;if(e.random){let y=e.resources.slice(0);for(s=[];y.length>1;){const j=Math.floor(Math.random()*y.length);s.push(y[j]),y=y.slice(0,j).concat(y.slice(j+1))}s=s.concat(y)}else s=e.resources.slice(o).concat(e.resources.slice(0,o));const l=Date.now();let a="pending",c=0,d,u=null,p=[],b=[];typeof r=="function"&&b.push(r);function m(){u&&(clearTimeout(u),u=null)}function v(){a==="pending"&&(a="aborted"),m(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,j){j&&(b=[]),typeof y=="function"&&b.push(y)}function S(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function C(){a="failed",b.forEach(y=>{y(void 0,d)})}function x(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,j,N){const F=j!=="success";switch(p=p.filter(k=>k!==y),a){case"pending":break;case"failed":if(F||!e.dataAfterTimeout)return;break;default:return}if(j==="abort"){d=N,C();return}if(F){d=N,p.length||(s.length?z():C());return}if(m(),x(),!e.random){const k=e.resources.indexOf(y.resource);k!==-1&&k!==e.index&&(e.index=k)}a="completed",b.forEach(k=>{k(N)})}function z(){if(a!=="pending")return;m();const y=s.shift();if(y===void 0){if(p.length){u=setTimeout(()=>{m(),a==="pending"&&(x(),C())},e.timeout);return}C();return}const j={status:"pending",resource:y,callback:(N,F)=>{$(j,N,F)}};p.push(j),c++,u=setTimeout(z,e.rotate),i(y,t,j.callback)}return setTimeout(z),S}function Vn(e){const t={...us,...e};let i=[];function r(){i=i.filter(s=>s().status==="pending")}function n(s,l,a){const c=ps(t,s,l,(d,u)=>{r(),a&&a(d,u)});return i.push(c),c}function o(s){return i.find(l=>s(l))||null}return{query:n,find:o,setIndex:s=>{t.index=s},getIndex:()=>t.index,cleanup:r}}function fi(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Pe=Object.create(null),be=["https://api.simplesvg.com","https://api.unisvg.com"],Ke=[];for(;be.length>0;)be.length===1||Math.random()>.5?Ke.push(be.shift()):Ke.push(be.pop());Pe[""]=fi({resources:["https://api.iconify.design"].concat(Ke)});function Yi(e,t){const i=fi(t);return i===null?!1:(Pe[e]=i,!0)}function Le(e){return Pe[e]}function bs(){return Object.keys(Pe)}function Gi(){}const Ve=Object.create(null);function fs(e){if(!Ve[e]){const t=Le(e);if(!t)return;const i=Vn(t),r={config:t,redundancy:i};Ve[e]=r}return Ve[e]}function qn(e,t,i){let r,n;if(typeof e=="string"){const o=Xe(e);if(!o)return i(void 0,424),Gi;n=o.send;const s=fs(e);s&&(r=s.redundancy)}else{const o=fi(e);if(o){r=Vn(o);const s=e.resources?e.resources[0]:"",l=Xe(s);l&&(n=l.send)}}return!r||!n?(i(void 0,424),Gi):r.query(t,n,i)().abort}const Qi="iconify2",ie="iconify",Wn=ie+"-count",Ji=ie+"-version",Yn=36e5,ms=168,gs=50;function Ze(e,t){try{return e.getItem(t)}catch{}}function mi(e,t,i){try{return e.setItem(t,i),!0}catch{}}function Xi(e,t){try{e.removeItem(t)}catch{}}function ti(e,t){return mi(e,Wn,t.toString())}function ei(e){return parseInt(Ze(e,Wn))||0}const pt={local:!0,session:!0},Gn={local:new Set,session:new Set};let gi=!1;function vs(e){gi=e}let fe=typeof window>"u"?{}:window;function Qn(e){const t=e+"Storage";try{if(fe&&fe[t]&&typeof fe[t].length=="number")return fe[t]}catch{}pt[e]=!1}function Jn(e,t){const i=Qn(e);if(!i)return;const r=Ze(i,Ji);if(r!==Qi){if(r){const l=ei(i);for(let a=0;a<l;a++)Xi(i,ie+a.toString())}mi(i,Ji,Qi),ti(i,0);return}const n=Math.floor(Date.now()/Yn)-ms,o=l=>{const a=ie+l.toString(),c=Ze(i,a);if(typeof c=="string"){try{const d=JSON.parse(c);if(typeof d=="object"&&typeof d.cached=="number"&&d.cached>n&&typeof d.provider=="string"&&typeof d.data=="object"&&typeof d.data.prefix=="string"&&t(d,l))return!0}catch{}Xi(i,a)}};let s=ei(i);for(let l=s-1;l>=0;l--)o(l)||(l===s-1?(s--,ti(i,s)):Gn[e].add(l))}function Xn(){if(!gi){vs(!0);for(const e in pt)Jn(e,t=>{const i=t.data,r=t.provider,n=i.prefix,o=ot(r,n);if(!bi(o,i).length)return!1;const s=i.lastModified||-1;return o.lastModifiedCached=o.lastModifiedCached?Math.min(o.lastModifiedCached,s):s,!0})}}function ys(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const r in pt)Jn(r,n=>{const o=n.data;return n.provider!==e.provider||o.prefix!==e.prefix||o.lastModified===t});return!0}function _s(e,t){gi||Xn();function i(r){let n;if(!pt[r]||!(n=Qn(r)))return;const o=Gn[r];let s;if(o.size)o.delete(s=Array.from(o).shift());else if(s=ei(n),s>=gs||!ti(n,s+1))return;const l={cached:Math.floor(Date.now()/Yn),provider:e.provider,data:t};return mi(n,ie+s.toString(),JSON.stringify(l))}t.lastModified&&!ys(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function Ki(){}function xs(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,as(e)}))}function ws(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:r}=e,n=e.iconsToLoad;delete e.iconsToLoad;let o;!n||!(o=Xe(i))||o.prepare(i,r,n).forEach(s=>{qn(i,s,l=>{if(typeof l!="object")s.icons.forEach(a=>{e.missing.add(a)});else try{const a=bi(e,l);if(!a.length)return;const c=e.pendingIcons;c&&a.forEach(d=>{c.delete(d)}),_s(e,l)}catch(a){console.error(a)}xs(e)})})}))}const vi=(e,t)=>{const i=ds(e,!0,Fn()),r=ls(i);if(!r.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(r.loaded,r.missing,r.pending,Ki)}),()=>{a=!1}}const n=Object.create(null),o=[];let s,l;return r.pending.forEach(a=>{const{provider:c,prefix:d}=a;if(d===l&&c===s)return;s=c,l=d,o.push(ot(c,d));const u=n[c]||(n[c]=Object.create(null));u[d]||(u[d]=[])}),r.pending.forEach(a=>{const{provider:c,prefix:d,name:u}=a,p=ot(c,d),b=p.pendingIcons||(p.pendingIcons=new Set);b.has(u)||(b.add(u),n[c][d].push(u))}),o.forEach(a=>{const{provider:c,prefix:d}=a;n[c][d].length&&ws(a,n[c][d])}),t?hs(t,r,o):Ki},$s=e=>new Promise((t,i)=>{const r=typeof e=="string"?le(e,!0):e;if(!r){i(e);return}vi([r||e],n=>{if(n.length&&r){const o=ee(r);if(o){t({...se,...o});return}}i(e)})});function Es(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function Cs(e,t){const i=typeof e=="string"?le(e,!0,!0):null;if(!i){const o=Es(e);return{value:e,data:o}}const r=ee(i);if(r!==void 0||!i.prefix)return{value:e,name:i,data:r};const n=vi([i],()=>t(e,i,ee(i)));return{value:e,name:i,loading:n}}function qe(e){return e.hasAttribute("inline")}let Kn=!1;try{Kn=navigator.vendor.indexOf("Apple")===0}catch{}function ks(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Kn||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const Ss=/(-?[0-9.]*[0-9]+[0-9.]*)/g,As=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ii(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const r=e.split(Ss);if(r===null||!r.length)return e;const n=[];let o=r.shift(),s=As.test(o);for(;;){if(s){const l=parseFloat(o);isNaN(l)?n.push(o):n.push(Math.ceil(l*t*i)/i)}else n.push(o);if(o=r.shift(),o===void 0)return n.join("");s=!s}}function Os(e,t="defs"){let i="";const r=e.indexOf("<"+t);for(;r>=0;){const n=e.indexOf(">",r),o=e.indexOf("</"+t);if(n===-1||o===-1)break;const s=e.indexOf(">",o);if(s===-1)break;i+=e.slice(n+1,o).trim(),e=e.slice(0,r).trim()+e.slice(s+1)}return{defs:i,content:e}}function Ts(e,t){return e?"<defs>"+e+"</defs>"+t:t}function zs(e,t,i){const r=Os(e);return Ts(r.defs,t+r.content+i)}const js=e=>e==="unset"||e==="undefined"||e==="none";function Zn(e,t){const i={...se,...e},r={...Hn,...t},n={left:i.left,top:i.top,width:i.width,height:i.height};let o=i.body;[i,r].forEach(v=>{const g=[],S=v.hFlip,C=v.vFlip;let x=v.rotate;S?C?x+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):C&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}x%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(o=zs(o,'<g transform="'+g.join(" ")+'">',"</g>"))});const s=r.width,l=r.height,a=n.width,c=n.height;let d,u;s===null?(u=l===null?"1em":l==="auto"?c:l,d=ii(u,a/c)):(d=s==="auto"?a:s,u=l===null?ii(d,c/a):l==="auto"?c:l);const p={},b=(v,g)=>{js(g)||(p[v]=g.toString())};b("width",d),b("height",u);const m=[n.left,n.top,a,c];return p.viewBox=m.join(" "),{attributes:p,viewBox:m,body:o}}function yi(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const r in t)i+=" "+r+'="'+t[r]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function Ps(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ls(e){return"data:image/svg+xml,"+Ps(e)}function tr(e){return'url("'+Ls(e)+'")'}const Ms=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let ke=Ms();function Rs(e){ke=e}function Hs(){return ke}function Bs(e,t){const i=Le(e);if(!i)return 0;let r;if(!i.maxURL)r=0;else{let n=0;i.resources.forEach(s=>{n=Math.max(n,s.length)});const o=t+".json?icons=";r=i.maxURL-n-i.path.length-o.length}return r}function Is(e){return e===404}const Ns=(e,t,i)=>{const r=[],n=Bs(e,t),o="icons";let s={type:o,provider:e,prefix:t,icons:[]},l=0;return i.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(r.push(s),s={type:o,provider:e,prefix:t,icons:[]},l=a.length),s.icons.push(a)}),r.push(s),r};function Fs(e){if(typeof e=="string"){const t=Le(e);if(t)return t.path}return"/"}const Ds=(e,t,i)=>{if(!ke){i("abort",424);return}let r=Fs(t.provider);switch(t.type){case"icons":{const o=t.prefix,s=t.icons.join(","),l=new URLSearchParams({icons:s});r+=o+".json?"+l.toString();break}case"custom":{const o=t.uri;r+=o.slice(0,1)==="/"?o.slice(1):o;break}default:i("abort",400);return}let n=503;ke(e+r).then(o=>{const s=o.status;if(s!==200){setTimeout(()=>{i(Is(s)?"abort":"next",s)});return}return n=501,o.json()}).then(o=>{if(typeof o!="object"||o===null){setTimeout(()=>{o===404?i("abort",o):i("next",n)});return}setTimeout(()=>{i("success",o)})}).catch(()=>{i("next",n)})},Us={prepare:Ns,send:Ds};function Zi(e,t){switch(e){case"local":case"session":pt[e]=t;break;case"all":for(const i in pt)pt[i]=t;break}}const We="data-style";let er="";function Vs(e){er=e}function tn(e,t){let i=Array.from(e.childNodes).find(r=>r.hasAttribute&&r.hasAttribute(We));i||(i=document.createElement("style"),i.setAttribute(We,We),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+er}function ir(){Wi("",Us),Fn(!0);let e;try{e=window}catch{}if(e){if(Xn(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(r=>{try{(typeof r!="object"||r===null||r instanceof Array||typeof r.icons!="object"||typeof r.prefix!="string"||!Vi(r))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const r="IconifyProviders["+i+"] is invalid.";try{const n=t[i];if(typeof n!="object"||!n||n.resources===void 0)continue;Yi(i,n)||console.error(r)}catch{console.error(r)}}}}return{enableCache:t=>Zi(t,!0),disableCache:t=>Zi(t,!1),iconLoaded:qi,iconExists:qi,getIcon:ss,listIcons:os,addIcon:Dn,addCollection:Vi,calculateSize:ii,buildIcon:Zn,iconToHTML:yi,svgToURL:tr,loadIcons:vi,loadIcon:$s,addAPIProvider:Yi,appendCustomStyle:Vs,_api:{getAPIConfig:Le,setAPIModule:Wi,sendAPIQuery:qn,setFetch:Rs,getFetch:Hs,listAPIProviders:bs}}}const ni={"background-color":"currentColor"},nr={"background-color":"transparent"},en={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},nn={"-webkit-mask":ni,mask:ni,background:nr};for(const e in nn){const t=nn[e];for(const i in en)t[e+"-"+i]=en[i]}function rn(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function qs(e,t,i){const r=document.createElement("span");let n=e.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const o=e.attributes,s=yi(n,{...o,width:t.width+"",height:t.height+""}),l=tr(s),a=r.style,c={"--svg":l,width:rn(o.width),height:rn(o.height),...i?ni:nr};for(const d in c)a.setProperty(d,c[d]);return r}let Qt;function Ws(){try{Qt=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{Qt=null}}function Ys(e){return Qt===void 0&&Ws(),Qt?Qt.createHTML(e):e}function Gs(e){const t=document.createElement("span"),i=e.attributes;let r="";i.width||(r="width: inherit;"),i.height||(r+="height: inherit;"),r&&(i.style=r);const n=yi(e.body,i);return t.innerHTML=Ys(n),t.firstChild}function ri(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function on(e,t){const i=t.icon.data,r=t.customisations,n=Zn(i,r);r.preserveAspectRatio&&(n.attributes.preserveAspectRatio=r.preserveAspectRatio);const o=t.renderedMode;let s;switch(o){case"svg":s=Gs(n);break;default:s=qs(n,{...se,...i},o==="mask")}const l=ri(e);l?s.tagName==="SPAN"&&l.tagName===s.tagName?l.setAttribute("style",s.getAttribute("style")):e.replaceChild(s,l):e.appendChild(s)}function sn(e,t,i){const r=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:r}}function Qs(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const r=t.get(e);if(r)return r;const n=["icon","mode","inline","observe","width","height","rotate","flip"],o=class extends i{constructor(){super(),ht(this,"_shadowRoot"),ht(this,"_initialised",!1),ht(this,"_state"),ht(this,"_checkQueued",!1),ht(this,"_connected",!1),ht(this,"_observer",null),ht(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=qe(this);tn(l,a),this._state=sn({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=qe(this),c=this._state;a!==c.inline&&(c.inline=a,tn(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return qe(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}on(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),d=Di(this);(l.attrMode!==c||Ko(l.customisations,d)||!ri(this._shadowRoot))&&this._renderIcon(l.icon,d,c)}_iconChanged(l){const a=Cs(l,(c,d,u)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const b={value:c,name:d,data:u};b.data?this._gotIconData(b):p.icon=b});a.data?this._gotIconData(a):this._state=sn(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=ri(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Di(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const d=ks(l.data.body,c),u=this._state.inline;on(this._shadowRoot,this._state={rendered:!0,icon:l,inline:u,customisations:a,attrMode:c,renderedMode:d})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in o.prototype||Object.defineProperty(o.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const s=ir();for(const l in s)o[l]=o.prototype[l]=s[l];return t.define(e,o),o}Qs()||ir();const Js=E`
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
`,lt={scrollbar:Js,globalStyles:Xs},rr=class _{static set config(t){this._config={..._._config,...t}}static get config(){return _._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=lt.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){_.init()}static init(){_.addGlobalStyles(),_.defineCustomElement("bim-button",nl),_.defineCustomElement("bim-checkbox",Mt),_.defineCustomElement("bim-color-input",mt),_.defineCustomElement("bim-context-menu",si),_.defineCustomElement("bim-dropdown",X),_.defineCustomElement("bim-grid",xi),_.defineCustomElement("bim-icon",dl),_.defineCustomElement("bim-input",ce),_.defineCustomElement("bim-label",Ht),_.defineCustomElement("bim-number-input",L),_.defineCustomElement("bim-option",T),_.defineCustomElement("bim-panel",gt),_.defineCustomElement("bim-panel-section",Bt),_.defineCustomElement("bim-selector",It),_.defineCustomElement("bim-table",I),_.defineCustomElement("bim-tabs",yt),_.defineCustomElement("bim-tab",M),_.defineCustomElement("bim-table-cell",xr),_.defineCustomElement("bim-table-children",$r),_.defineCustomElement("bim-table-group",Cr),_.defineCustomElement("bim-table-row",vt),_.defineCustomElement("bim-text-input",G),_.defineCustomElement("bim-toolbar",Ne),_.defineCustomElement("bim-toolbar-group",Be),_.defineCustomElement("bim-toolbar-section",Dt),_.defineCustomElement("bim-viewport",Rr)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let r=0;r<10;r++){const n=Math.floor(Math.random()*t.length);i+=t.charAt(n)}return i}};rr._config={sectionLabelOnVerticalToolbar:!1};let or=rr;class sr extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const r of t)this.elements.add(r);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const r of i)r.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const r=i[0];if(!r.isIntersecting)return;const n=r.target;t.unobserve(n);const o=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,s=[...this.elements][o];s&&(this.visibleElements=[...this.visibleElements,s],t.observe(s))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,r=[...this.elements][i];r&&t.observe(r)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const r=document.createDocumentFragment();if(t.length===0)return zt(t(),r),r.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let n=i;const o=t,s=a=>(n={...n,...a},zt(o(n,s),r),n);s(i);const l=()=>n;return[r.firstElementChild,s,l]}}const Se=(e,t={},i=!0)=>{let r={};for(const n of e.children){const o=n,s=o.getAttribute("name")||o.getAttribute("label"),l=t[s];if(s){if("value"in o&&typeof o.value<"u"&&o.value!==null){const a=o.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;r[s]=l?l(o.value):o.value}else if(i){const a=Se(o,t);if(Object.keys(a).length===0)continue;r[s]=l?l(a):a}}else i&&(r={...r,...Se(o,t)})}return r},Me=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,Ks=[">=","<=","=",">","<","?","/","#"];function ln(e){const t=Ks.find(s=>e.split(s).length===2),i=e.split(t).map(s=>s.trim()),[r,n]=i,o=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):Me(n);return{key:r,condition:t,value:o}}const oi=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(r=>r.trim());for(const r of i){const n=!r.startsWith("(")&&!r.endsWith(")"),o=r.startsWith("(")&&r.endsWith(")");if(n){const s=ln(r);t.push(s)}if(o){const s={operator:"&",queries:r.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=ln(l);return a>0&&(c.operator="&"),c})};t.push(s)}}return t}catch{return null}},an=(e,t,i)=>{let r=!1;switch(t){case"=":r=e===i;break;case"?":r=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(r=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(r=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(r=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(r=e>=i);break;case"/":r=String(e).startsWith(String(i));break}return r};var Zs=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,lr=(e,t,i,r)=>{for(var n=tl(t,i),o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&Zs(t,i,n),n},O;const _i=(O=class extends w{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(e){this._placement=e,this.updatePosition()}static removeMenus(){for(const e of O.menus)e instanceof O&&(e.visible=!1);O.dialog.close(),O.dialog.remove()}get visible(){return this._visible}set visible(e){var t;this._visible=e,e?(O.dialog.parentElement||document.body.append(O.dialog),this._previousContainer=this.parentElement,O.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,O.dialog.append(this),O.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const e=this.placement??"right",t=await On(this._previousContainer,this,{placement:e,middleware:[mn(10),An(),Sn(),kn({padding:5})]}),{x:i,y:r}=t;this.style.left=`${i}px`,this.style.top=`${r}px`}connectedCallback(){super.connectedCallback(),O.menus.push(this)}render(){return f` <slot></slot> `}},O.styles=[lt.scrollbar,E`
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
    `],O.dialog=sr.create(()=>f` <dialog
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
    ></dialog>`),O.menus=[],O);lr([h({type:String,reflect:!0})],_i.prototype,"placement");lr([h({type:Boolean,reflect:!0})],_i.prototype,"visible");let si=_i;var el=Object.defineProperty,il=Object.getOwnPropertyDescriptor,D=(e,t,i,r)=>{for(var n=r>1?void 0:r?il(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&el(t,i,n),n},qt;const H=(qt=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=jt(),this._tooltip=jt(),this._mouseLeave=!1,this.onClick=e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const e=this._contextMenu;if(e){const t=this.getAttribute("data-context-group");t&&e.setAttribute("data-context-group",t),this.closeNestedContexts();const i=or.newRandomId();for(const r of e.children)r instanceof qt&&r.setAttribute("data-context-group",i);e.visible=!0}},this.mouseLeave=!0}set loading(e){if(this._loading=e,e)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=e,this.icon="eos-icons:loading";else{const{disabled:t,icon:i}=this._stateBeforeLoading;this.disabled=t,this.icon=i}}get loading(){return this._loading}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&On(e,t,{placement:"bottom",middleware:[mn(10),An(),Sn(),kn({padding:5})]}).then(i=>{const{x:r,y:n}=i;Object.assign(t.style,{left:`${r}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}closeNestedContexts(){const e=this.getAttribute("data-context-group");if(e)for(const t of si.dialog.children){const i=t.getAttribute("data-context-group");if(t instanceof si&&i===e){t.visible=!1,t.removeAttribute("data-context-group");for(const r of t.children)r instanceof qt&&(r.closeNestedContexts(),r.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const e=f`
      <div ${Pt(this._tooltip)} class="tooltip">
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
      <div ${Pt(this._parent)} class="parent" @click=${this.onClick}>
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
  `,qt);D([h({type:String,reflect:!0})],H.prototype,"label",2);D([h({type:Boolean,attribute:"label-hidden",reflect:!0})],H.prototype,"labelHidden",2);D([h({type:Boolean,reflect:!0})],H.prototype,"active",2);D([h({type:Boolean,reflect:!0,attribute:"disabled"})],H.prototype,"disabled",2);D([h({type:String,reflect:!0})],H.prototype,"icon",2);D([h({type:Boolean,reflect:!0})],H.prototype,"vertical",2);D([h({type:Number,attribute:"tooltip-time",reflect:!0})],H.prototype,"tooltipTime",2);D([h({type:Boolean,attribute:"tooltip-visible",reflect:!0})],H.prototype,"tooltipVisible",2);D([h({type:String,attribute:"tooltip-title",reflect:!0})],H.prototype,"tooltipTitle",2);D([h({type:String,attribute:"tooltip-text",reflect:!0})],H.prototype,"tooltipText",2);D([h({type:Boolean,reflect:!0})],H.prototype,"loading",1);let nl=H;var rl=Object.defineProperty,ae=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&rl(t,i,n),n};const ar=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return f`
      <div class="parent">
        ${this.label?f`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
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
  `;let Mt=ar;ae([h({type:String,reflect:!0})],Mt.prototype,"icon");ae([h({type:String,reflect:!0})],Mt.prototype,"name");ae([h({type:String,reflect:!0})],Mt.prototype,"label");ae([h({type:Boolean,reflect:!0})],Mt.prototype,"checked");ae([h({type:Boolean,reflect:!0})],Mt.prototype,"inverted");var ol=Object.defineProperty,Rt=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&ol(t,i,n),n};const cr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=jt(),this._textInput=jt(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const i=t.target;this.opacity=i.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:i,opacity:r}=t;this.color=i,r&&(this.opacity=r)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:i}=this._colorInput;i&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:i}=this._textInput;if(!i)return;const{value:r}=i;let n=r.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),i.value=n.slice(0,7),i.value.length===7&&(this.color=i.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return f`
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
                ${Pt(this._colorInput)}
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
                ${Pt(this._textInput)}
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
  `;let mt=cr;Rt([h({type:String,reflect:!0})],mt.prototype,"name");Rt([h({type:String,reflect:!0})],mt.prototype,"label");Rt([h({type:String,reflect:!0})],mt.prototype,"icon");Rt([h({type:Boolean,reflect:!0})],mt.prototype,"vertical");Rt([h({type:Number,reflect:!0})],mt.prototype,"opacity");Rt([h({type:String,reflect:!0})],mt.prototype,"color");var sl=Object.defineProperty,ll=Object.getOwnPropertyDescriptor,at=(e,t,i,r)=>{for(var n=r>1?void 0:r?ll(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&sl(t,i,n),n};const hr=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Me(this.label):this.label}set value(t){this._value=t}render(){return f`
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
    `}};hr.styles=E`
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
  `;let T=hr;at([h({type:String,reflect:!0})],T.prototype,"img",2);at([h({type:String,reflect:!0})],T.prototype,"label",2);at([h({type:String,reflect:!0})],T.prototype,"icon",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checked",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checkbox",2);at([h({type:Boolean,attribute:"no-mark",reflect:!0})],T.prototype,"noMark",2);at([h({converter:{fromAttribute(e){return e&&Me(e)}}})],T.prototype,"value",1);at([h({type:Boolean,reflect:!0})],T.prototype,"vertical",2);var al=Object.defineProperty,cl=Object.getOwnPropertyDescriptor,ct=(e,t,i,r)=>{for(var n=r>1?void 0:r?cl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&al(t,i,n),n};const dr=class extends sr{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=jt(),this.onOptionClick=t=>{const i=t.target,r=this._value.has(i);if(!this.multiple&&!this.required&&!r)this._value=new Set([i]);else if(!this.multiple&&!this.required&&r)this._value=new Set([]);else if(!this.multiple&&this.required&&!r)this._value=new Set([i]);else if(this.multiple&&!this.required&&!r)this._value=new Set([...this._value,i]);else if(this.multiple&&!this.required&&r){const n=[...this._value].filter(o=>o!==i);this._value=new Set(n)}else if(this.multiple&&this.required&&!r)this._value=new Set([...this._value,i]);else if(this.multiple&&this.required&&r){const n=[...this._value].filter(s=>s!==i),o=new Set(n);o.size!==0&&(this._value=o)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){if(t){const{value:i}=this._contextMenu;if(!i)return;for(const r of this.elements)i.append(r);this._visible=!0}else{for(const i of this.elements)this.append(i);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const i=new Set;for(const r of t){const n=this.findOption(r);if(n&&(i.add(n),!this.multiple&&Object.keys(t).length===1))break}this._value=i,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(t=>t instanceof T&&t.checked).map(t=>t.value)}get _options(){const t=new Set([...this.elements]);for(const i of this.children)i instanceof T&&t.add(i);return[...t]}onSlotChange(t){const i=t.target.assignedElements();this.observe(i);const r=new Set;for(const n of this.elements){if(!(n instanceof T)){n.remove();continue}n.checked&&r.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=r}updateOptionsState(){for(const t of this._options)t instanceof T&&(t.checked=this._value.has(t))}findOption(t){return this._options.find(i=>i instanceof T?i.label===t||i.value===t:!1)}render(){let t,i,r;if(this._value.size===0)t="Select an option...";else if(this._value.size===1){const n=[...this._value][0];t=(n==null?void 0:n.label)||(n==null?void 0:n.value),i=n==null?void 0:n.img,r=n==null?void 0:n.icon}else t=`Multiple (${this._value.size})`;return f`
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
            ${Pt(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};dr.styles=[lt.scrollbar,E`
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
    `];let X=dr;ct([h({type:String,reflect:!0})],X.prototype,"name",2);ct([h({type:String,reflect:!0})],X.prototype,"icon",2);ct([h({type:String,reflect:!0})],X.prototype,"label",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"multiple",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"required",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"vertical",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"visible",1);ct([Lt()],X.prototype,"_value",2);var hl=Object.defineProperty,ur=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&hl(t,i,n),n};const pr=class extends w{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(t){const i=t.split(`
`).map(r=>r.trim()).map(r=>r.split('"')[1]).filter(r=>r!==void 0).flatMap(r=>r.split(/\s+/));return[...new Set(i)].filter(r=>r!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const t=this.layouts[this.layout],i=this.getUniqueAreasFromTemplate(t.template).map(r=>{const n=t.elements[r];return n&&(n.style.gridArea=r),n}).filter(r=>!!r);this.style.gridTemplate=t.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...i)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return f`<slot></slot>`}};pr.styles=E`
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
  `;let xi=pr;ur([h({type:Boolean,reflect:!0})],xi.prototype,"floating");ur([h({type:String,reflect:!0})],xi.prototype,"layout");const li=class extends w{render(){return f`
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
  `,li.properties={icon:{type:String}};let dl=li;var ul=Object.defineProperty,Re=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&ul(t,i,n),n};const br=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const t={};for(const i of this.children){const r=i;"value"in r?t[r.name||r.label]=r.value:"checked"in r&&(t[r.name||r.label]=r.checked)}return t}set value(t){const i=[...this.children];for(const r in t){const n=i.find(l=>{const a=l;return a.name===r||a.label===r});if(!n)continue;const o=n,s=t[r];typeof s=="boolean"?o.checked=s:o.value=s}}render(){return f`
      <div class="parent">
        ${this.label||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};br.styles=E`
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
  `;let ce=br;Re([h({type:String,reflect:!0})],ce.prototype,"name");Re([h({type:String,reflect:!0})],ce.prototype,"label");Re([h({type:String,reflect:!0})],ce.prototype,"icon");Re([h({type:Boolean,reflect:!0})],ce.prototype,"vertical");var pl=Object.defineProperty,he=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&pl(t,i,n),n};const fr=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Me(this.textContent):this.textContent}render(){return f`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?f`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?f`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};fr.styles=E`
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
  `;let Ht=fr;he([h({type:String,reflect:!0})],Ht.prototype,"img");he([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Ht.prototype,"labelHidden");he([h({type:String,reflect:!0})],Ht.prototype,"icon");he([h({type:Boolean,attribute:"icon-hidden",reflect:!0})],Ht.prototype,"iconHidden");he([h({type:Boolean,reflect:!0})],Ht.prototype,"vertical");var bl=Object.defineProperty,fl=Object.getOwnPropertyDescriptor,B=(e,t,i,r)=>{for(var n=r>1?void 0:r?fl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&bl(t,i,n),n};const mr=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=jt(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:i}=this._input;i&&this.setValue(i.value)}setValue(t){const{value:i}=this._input;let r=t;if(r=r.replace(/[^0-9.-]/g,""),r=r.replace(/(\..*)\./g,"$1"),r.endsWith(".")||(r.lastIndexOf("-")>0&&(r=r[0]+r.substring(1).replace(/-/g,"")),r==="-"||r==="-0"))return;let n=Number(r);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,i&&(i.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:i}=t,r=this.value;let n=!1;const o=a=>{var c;n=!0;const{clientX:d}=a,u=this.step??1,p=((c=u.toString().split(".")[1])==null?void 0:c.length)||0,b=1/(this.sensitivity??1),m=(d-i)/b;if(Math.floor(Math.abs(m))!==Math.abs(m))return;const v=r+m*u;this.setValue(v.toFixed(p))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},l=()=>{document.removeEventListener("mousemove",o),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const i=r=>{r.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",i))};window.addEventListener("keydown",i)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=f`
      ${this.pref||this.icon?f`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${Pt(this._input)}
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
    `,i=this.min??-1/0,r=this.max??1/0,n=100*(this.value-i)/(r-i),o=f`
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
        ${this.slider?o:t}
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
  `;let L=mr;B([h({type:String,reflect:!0})],L.prototype,"name",2);B([h({type:String,reflect:!0})],L.prototype,"icon",2);B([h({type:String,reflect:!0})],L.prototype,"label",2);B([h({type:String,reflect:!0})],L.prototype,"pref",2);B([h({type:Number,reflect:!0})],L.prototype,"min",2);B([h({type:Number,reflect:!0})],L.prototype,"value",1);B([h({type:Number,reflect:!0})],L.prototype,"step",2);B([h({type:Number,reflect:!0})],L.prototype,"sensitivity",2);B([h({type:Number,reflect:!0})],L.prototype,"max",2);B([h({type:String,reflect:!0})],L.prototype,"suffix",2);B([h({type:Boolean,reflect:!0})],L.prototype,"vertical",2);B([h({type:Boolean,reflect:!0})],L.prototype,"slider",2);var ml=Object.defineProperty,gl=Object.getOwnPropertyDescriptor,de=(e,t,i,r)=>{for(var n=r>1?void 0:r?gl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&ml(t,i,n),n};const gr=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return Se(this,this.valueTransform)}set value(t){const i=[...this.children];for(const r in t){const n=i.find(s=>{const l=s;return l.name===r||l.label===r});if(!n)continue;const o=n;o.value=t[r]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const i of t)i.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const i of t)i.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,f`
      <div class="parent">
        ${this.label||this.name||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};gr.styles=[lt.scrollbar,E`
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
    `];let gt=gr;de([h({type:String,reflect:!0})],gt.prototype,"icon",2);de([h({type:String,reflect:!0})],gt.prototype,"name",2);de([h({type:String,reflect:!0})],gt.prototype,"label",2);de([h({type:Boolean,reflect:!0})],gt.prototype,"hidden",1);de([h({type:Boolean,attribute:"header-hidden",reflect:!0})],gt.prototype,"headerHidden",2);var vl=Object.defineProperty,ue=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&vl(t,i,n),n};const vr=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const t=this.parentElement;let i;return t instanceof gt&&(i=t.valueTransform),Object.values(this.valueTransform).length!==0&&(i=this.valueTransform),Se(this,i)}set value(t){const i=[...this.children];for(const r in t){const n=i.find(s=>{const l=s;return l.name===r||l.label===r});if(!n)continue;const o=n;o.value=t[r]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,i=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,r=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?i:r,o=f`
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
        ${t?o:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};vr.styles=[lt.scrollbar,E`
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
    `];let Bt=vr;ue([h({type:String,reflect:!0})],Bt.prototype,"icon");ue([h({type:String,reflect:!0})],Bt.prototype,"label");ue([h({type:String,reflect:!0})],Bt.prototype,"name");ue([h({type:Boolean,reflect:!0})],Bt.prototype,"fixed");ue([h({type:Boolean,reflect:!0})],Bt.prototype,"collapsed");var yl=Object.defineProperty,pe=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&yl(t,i,n),n};const yr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const i of this.children)i instanceof T&&(i.checked=i===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const i=this.findOption(t);if(i){for(const r of this._options)r.checked=r===i;this._value=i,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const i=t.target.assignedElements();for(const r of i)r instanceof T&&(r.noMark=!0,r.removeEventListener("click",this.onOptionClick),r.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(i=>i instanceof T?i.label===t||i.value===t:!1)}firstUpdated(){const t=[...this.children].find(i=>i instanceof T&&i.checked);t&&(this._value=t)}render(){return f`
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
  `;let It=yr;pe([h({type:String,reflect:!0})],It.prototype,"name");pe([h({type:String,reflect:!0})],It.prototype,"icon");pe([h({type:String,reflect:!0})],It.prototype,"label");pe([h({type:Boolean,reflect:!0})],It.prototype,"vertical");pe([Lt()],It.prototype,"_value");const _l=()=>f`
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
  `;var wl=Object.defineProperty,$l=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&wl(t,i,n),n};const _r=class extends w{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return f`
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
  `;let xr=_r;$l([h({type:String,reflect:!0})],xr.prototype,"column");var El=Object.defineProperty,Cl=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&El(t,i,n),n};const wr=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,i=!1){for(const r of this._groups)r.childrenHidden=typeof t>"u"?!r.childrenHidden:!t,i&&r.toggleChildren(t,i)}render(){return this._groups=[],f`
      <slot></slot>
      ${this.data.map(t=>{const i=document.createElement("bim-table-group");return this._groups.push(i),i.table=this.table,i.data=t,i})}
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
  `;let $r=wr;Cl([h({type:Array,attribute:!1})],$r.prototype,"data");var kl=Object.defineProperty,Sl=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&kl(t,i,n),n};const Er=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,i=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,i&&this._children.toggleGroups(t,i))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const t=this.table.getGroupIndentation(this.data)??0,i=f`
      ${this.table.noIndentation?null:f`
            <style>
              .branch-vertical {
                left: ${t+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,r=document.createDocumentFragment();zt(i,r);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${t-1+(this.table.selectableRows?2.05:.5625)}rem`);let o=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(c);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(u),o=document.createElement("div"),o.addEventListener("click",p=>{p.stopPropagation(),this.toggleChildren()}),o.classList.add("caret"),o.style.left=`${(this.table.selectableRows?1.5:.125)+t}rem`,this.childrenHidden?o.append(a):o.append(d)}const s=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&s.append(r),s.table=this.table,s.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:s}})),o&&this.data.children&&s.append(o),t!==0&&(!this.data.children||this.childrenHidden)&&n&&s.append(n);let l;if(this.data.children){l=document.createElement("bim-table-children"),this._children=l,l.table=this.table,l.data=this.data.children;const a=document.createDocumentFragment();zt(i,a),l.append(a)}return f`
      <div class="parent">${s} ${this.childrenHidden?null:l}</div>
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
  `;let Cr=Er;Sl([h({type:Boolean,attribute:"children-hidden",reflect:!0})],Cr.prototype,"childrenHidden");var Al=Object.defineProperty,Nt=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&Al(t,i,n),n};const kr=class extends w{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.name)}get _columnWidths(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.width)}get _isSelected(){var t;return(t=this.table)==null?void 0:t.selection.has(this.data)}onSelectionChange(t){if(!this.table)return;const i=t.target;this.selected=i.value,i.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const t=this.table.getRowIndentation(this.data)??0,i=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,r=[];for(const n in i){if(this.hiddenColumns.includes(n))continue;const o=i[n];let s;if(typeof o=="string"||typeof o=="boolean"||typeof o=="number"?(s=document.createElement("bim-label"),s.textContent=String(o)):o instanceof HTMLElement?s=o:(s=document.createDocumentFragment(),zt(o,s)),!s)continue;const l=document.createElement("bim-table-cell");l.append(s),l.column=n,this._columnNames.indexOf(n)===0&&(l.style.marginLeft=`${this.table.noIndentation?0:t+.75}rem`);const a=this._columnNames.indexOf(n);l.setAttribute("data-column-index",String(a)),l.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),l.toggleAttribute("data-cell-header",this.isHeader),l.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:l}})),r.push(l)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,f`
      ${!this.isHeader&&this.table.selectableRows?f`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${r}
      <slot></slot>
    `}render(){return f`${this._intersecting?this.compute():f``}`}};kr.styles=E`
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
  `;let vt=kr;Nt([h({type:Boolean,reflect:!0})],vt.prototype,"selected");Nt([h({attribute:!1})],vt.prototype,"columns");Nt([h({attribute:!1})],vt.prototype,"hiddenColumns");Nt([h({attribute:!1})],vt.prototype,"data");Nt([h({type:Boolean,attribute:"is-header",reflect:!0})],vt.prototype,"isHeader");Nt([Lt()],vt.prototype,"_intersecting");var Ol=Object.defineProperty,Tl=Object.getOwnPropertyDescriptor,U=(e,t,i,r)=>{for(var n=r>1?void 0:r?Tl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&Ol(t,i,n),n};const Sr=class extends w{constructor(){super(...arguments),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(t,i)=>Object.values(i.data).some(r=>String(r).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,i)=>{let r=!1;const n=oi(t)??[];for(const o of n){if("queries"in o){r=!1;break}const{condition:s,value:l}=o;let{key:a}=o;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,r=Object.keys(i.data).filter(d=>d.includes(c)).map(d=>an(i.data[d],s,l)).some(d=>d)}else r=an(i.data[a],s,l);if(!r)break}return r}}set columns(t){const i=[];for(const r of t){const n=typeof r=="string"?{name:r,width:`minmax(${this.minColWidth}, 1fr)`}:r;i.push(n)}this._columns=i,this.computeMissingColumns(this.data),this.dispatchEvent(new Event("columnschange"))}get columns(){return this._columns}get _headerRowData(){const t={};for(const i of this.columns){const{name:r}=i;t[r]=String(r)}return t}get value(){return this._filteredData}set queryString(t){this.toggleAttribute("data-processing",!0),this._queryString=t&&t.trim()!==""?t.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(t){this._data=t,this.updateFilteredData(),this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(t=>{setTimeout(()=>{t(this.data)})})}set hiddenColumns(t){this._hiddenColumns=t,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(oi(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(t){let i=!1;for(const r of t){const{children:n,data:o}=r;for(const s in o)this._columns.map(l=>typeof l=="string"?l:l.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),i=!0);if(n){const s=this.computeMissingColumns(n);s&&!i&&(i=s)}}return i}generateText(t="comma",i=this.value,r="",n=!0){const o=this._textDelimiters[t];let s="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${o}`);const a=`${l.join(o)}
`;s+=a}for(const[a,c]of i.entries()){const{data:d,children:u}=c,p=this.indentationInText?`${r}${a+1}${o}`:"",b=l.map(v=>d[v]??""),m=`${p}${b.join(o)}
`;s+=m,u&&(s+=this.generateText(t,c.children,`${r}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(t){const i={};for(const n of Object.keys(this.dataTransform)){const o=this.columns.find(s=>s.name===n);o&&o.forceDataTransform&&(n in t||(t[n]=""))}const r=t;for(const n in r){const o=this.dataTransform[n];o?i[n]=o(r[n],t):i[n]=t[n]}return i}downloadData(t="BIM Table Data",i="json"){let r=null;if(i==="json"&&(r=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),i==="csv"&&(r=new File([this.csv],`${t}.csv`)),i==="tsv"&&(r=new File([this.tsv],`${t}.tsv`)),!r)return;const n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=r.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,i=this.value,r=0){for(const n of i){if(n.data===t)return r;if(n.children){const o=this.getRowIndentation(t,n.children,r+1);if(o!==null)return o}}return null}getGroupIndentation(t,i=this.value,r=0){for(const n of i){if(n===t)return r;if(n.children){const o=this.getGroupIndentation(t,n.children,r+1);if(o!==null)return o}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(t=!1){if(this._filteredData.length!==0&&!t||!this.loadFunction)return!1;this.loading=!0;try{const i=await this.loadFunction();return this.data=i,this.loading=!1,this._errorLoading=!1,!0}catch(i){if(this.loading=!1,this._filteredData.length!==0)return!1;const r=this.querySelector("[slot='error-loading']"),n=r==null?void 0:r.querySelector("[data-table-element='error-message']");return i instanceof Error&&n&&i.message.trim()!==""&&(n.textContent=i.message),this._errorLoading=!0,!1}}filter(t,i=this.filterFunction??this._stringFilterFunction,r=this.data){const n=[];for(const o of r)if(i(t,o)){if(this.preserveStructureOnFilter){const s={data:o.data};if(o.children){const l=this.filter(t,i,o.children);l.length&&(s.children=l)}n.push(s)}else if(n.push({data:o.data}),o.children){const s=this.filter(t,i,o.children);n.push(...s)}}else if(o.children){const s=this.filter(t,i,o.children);this.preserveStructureOnFilter&&s.length?n.push({data:o.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return _l();if(this._errorLoading)return f`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return f`<slot name="missing-data"></slot>`;const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const i=document.createElement("bim-table-children");return i.table=this,i.data=this.value,i.style.gridArea="Body",i.style.backgroundColor="transparent",f`
      <div class="parent">
        ${this.headersHidden?null:t} ${xl()}
        <div style="overflow-x: hidden; grid-area: Body">${i}</div>
      </div>
    `}};Sr.styles=[lt.scrollbar,E`
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
    `];let I=Sr;U([Lt()],I.prototype,"_filteredData",2);U([h({type:Boolean,attribute:"headers-hidden",reflect:!0})],I.prototype,"headersHidden",2);U([h({type:String,attribute:"min-col-width",reflect:!0})],I.prototype,"minColWidth",2);U([h({type:Array,attribute:!1})],I.prototype,"columns",1);U([h({type:Array,attribute:!1})],I.prototype,"data",1);U([h({type:Boolean,reflect:!0})],I.prototype,"expanded",2);U([h({type:Boolean,reflect:!0,attribute:"selectable-rows"})],I.prototype,"selectableRows",2);U([h({attribute:!1})],I.prototype,"selection",2);U([h({type:Boolean,attribute:"no-indentation",reflect:!0})],I.prototype,"noIndentation",2);U([h({type:Boolean,reflect:!0})],I.prototype,"loading",2);U([Lt()],I.prototype,"_errorLoading",2);var zl=Object.defineProperty,jl=Object.getOwnPropertyDescriptor,He=(e,t,i,r)=>{for(var n=r>1?void 0:r?jl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&zl(t,i,n),n};const Ar=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const i=[...t.children].indexOf(this);this.name=`${this._defaultName}${i}`}}render(){return f` <slot></slot> `}};Ar.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let M=Ar;He([h({type:String,reflect:!0})],M.prototype,"name",2);He([h({type:String,reflect:!0})],M.prototype,"label",2);He([h({type:String,reflect:!0})],M.prototype,"icon",2);He([h({type:Boolean,reflect:!0})],M.prototype,"hidden",1);var Pl=Object.defineProperty,Ll=Object.getOwnPropertyDescriptor,Ft=(e,t,i,r)=>{for(var n=r>1?void 0:r?Ll(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&Pl(t,i,n),n};const Or=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=t=>{const i=t.target;i instanceof M&&!i.hidden&&(i.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=i.name,i.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const i=[...this.children],r=i.find(n=>n instanceof M&&n.name===t);for(const n of i){if(!(n instanceof M))continue;n.hidden=r!==n;const o=this.getTabSwitcher(n.name);o&&o.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(i=>i.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof M))continue;const i=document.createElement("div");i.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),i.setAttribute("data-name",t.name),i.className="switcher";const r=document.createElement("bim-label");r.textContent=t.label??"",r.icon=t.icon,i.append(r),this._switchers.push(i)}}onSlotChange(t){this.createSwitchers();const i=t.target.assignedElements(),r=i.find(n=>n instanceof M?this.tab?n.name===this.tab:!n.hidden:!1);r&&r instanceof M&&(this.tab=r.name);for(const n of i){if(!(n instanceof M)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),r!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return f`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Or.styles=[lt.scrollbar,E`
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
    `];let yt=Or;Ft([Lt()],yt.prototype,"_switchers",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"bottom",2);Ft([h({type:Boolean,attribute:"switchers-hidden",reflect:!0})],yt.prototype,"switchersHidden",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"floating",2);Ft([h({type:String,reflect:!0})],yt.prototype,"tab",1);Ft([h({type:Boolean,attribute:"switchers-full",reflect:!0})],yt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cn=e=>e??A;var Ml=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,K=(e,t,i,r)=>{for(var n=r>1?void 0:r?Rl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&Ml(t,i,n),n};const Tr=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return oi(this.value)}onInputChange(t){t.stopPropagation();const i=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=i.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var t;const i=(t=this.shadowRoot)==null?void 0:t.querySelector("input");i==null||i.focus()})}render(){return f`
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
    `}};Tr.styles=[lt.scrollbar,E`
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
    `];let G=Tr;K([h({type:String,reflect:!0})],G.prototype,"icon",2);K([h({type:String,reflect:!0})],G.prototype,"label",2);K([h({type:String,reflect:!0})],G.prototype,"name",2);K([h({type:String,reflect:!0})],G.prototype,"placeholder",2);K([h({type:String,reflect:!0})],G.prototype,"value",2);K([h({type:Boolean,reflect:!0})],G.prototype,"vertical",2);K([h({type:Number,reflect:!0})],G.prototype,"debounce",2);K([h({type:Number,reflect:!0})],G.prototype,"rows",2);K([h({type:String,reflect:!0})],G.prototype,"type",1);var Hl=Object.defineProperty,Bl=Object.getOwnPropertyDescriptor,zr=(e,t,i,r)=>{for(var n=r>1?void 0:r?Bl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&Hl(t,i,n),n};const jr=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const i of t)this.vertical?i.setAttribute("label-hidden",""):i.removeAttribute("label-hidden")}render(){return f`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};jr.styles=E`
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
  `;let Be=jr;zr([h({type:Number,reflect:!0})],Be.prototype,"rows",2);zr([h({type:Boolean,reflect:!0})],Be.prototype,"vertical",1);var Il=Object.defineProperty,Nl=Object.getOwnPropertyDescriptor,Ie=(e,t,i,r)=>{for(var n=r>1?void 0:r?Nl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&Il(t,i,n),n};const Pr=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const i of t)i instanceof Be&&(i.vertical=this.vertical),i.toggleAttribute("label-hidden",this.vertical)}render(){return f`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Pr.styles=E`
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
  `;let Dt=Pr;Ie([h({type:String,reflect:!0})],Dt.prototype,"label",2);Ie([h({type:String,reflect:!0})],Dt.prototype,"icon",2);Ie([h({type:Boolean,reflect:!0})],Dt.prototype,"vertical",1);Ie([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Dt.prototype,"labelHidden",1);var Fl=Object.defineProperty,Dl=Object.getOwnPropertyDescriptor,wi=(e,t,i,r)=>{for(var n=r>1?void 0:r?Dl(t,i):t,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=(r?s(t,i,n):s(n))||n);return r&&n&&Fl(t,i,n),n};const Lr=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const i of t)i instanceof Dt&&(i.labelHidden=this.vertical&&!or.config.sectionLabelOnVerticalToolbar,i.vertical=this.vertical)}render(){return f`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Lr.styles=E`
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
  `;let Ne=Lr;wi([h({type:String,reflect:!0})],Ne.prototype,"icon",2);wi([h({type:Boolean,attribute:"labels-hidden",reflect:!0})],Ne.prototype,"labelsHidden",2);wi([h({type:Boolean,reflect:!0})],Ne.prototype,"vertical",1);var Ul=Object.defineProperty,Vl=(e,t,i,r)=>{for(var n=void 0,o=e.length-1,s;o>=0;o--)(s=e[o])&&(n=s(t,i,n)||n);return n&&Ul(t,i,n),n};const Mr=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return f`
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
  `;let Rr=Mr;Vl([h({type:String,reflect:!0})],Rr.prototype,"name");export{or as T,f as m,sr as z};
