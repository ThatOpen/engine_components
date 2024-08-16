var Mr=Object.defineProperty,Rr=(i,t,e)=>t in i?Mr(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,ht=(i,t,e)=>(Rr(i,typeof t!="symbol"?t+"":t,e),e);const Ct=Math.min,G=Math.max,ge=Math.round,nt=i=>({x:i,y:i}),Hr={left:"right",right:"left",bottom:"top",top:"bottom"},Br={start:"end",end:"start"};function _i(i,t,e){return G(i,Ct(t,e))}function ie(i,t){return typeof i=="function"?i(t):i}function J(i){return i.split("-")[0]}function Se(i){return i.split("-")[1]}function ln(i){return i==="x"?"y":"x"}function an(i){return i==="y"?"height":"width"}function bt(i){return["top","bottom"].includes(J(i))?"y":"x"}function cn(i){return ln(bt(i))}function Nr(i,t,e){e===void 0&&(e=!1);const r=Se(i),n=cn(i),o=an(n);let s=n==="x"?r===(e?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[o]>t.floating[o]&&(s=ve(s)),[s,ve(s)]}function Ir(i){const t=ve(i);return[qe(i),t,qe(t)]}function qe(i){return i.replace(/start|end/g,t=>Br[t])}function Fr(i,t,e){const r=["left","right"],n=["right","left"],o=["top","bottom"],s=["bottom","top"];switch(i){case"top":case"bottom":return e?t?n:r:t?r:n;case"left":case"right":return t?o:s;default:return[]}}function Dr(i,t,e,r){const n=Se(i);let o=Fr(J(i),e==="start",r);return n&&(o=o.map(s=>s+"-"+n),t&&(o=o.concat(o.map(qe)))),o}function ve(i){return i.replace(/left|right|bottom|top/g,t=>Hr[t])}function Ur(i){return{top:0,right:0,bottom:0,left:0,...i}}function hn(i){return typeof i!="number"?Ur(i):{top:i,right:i,bottom:i,left:i}}function kt(i){const{x:t,y:e,width:r,height:n}=i;return{width:r,height:n,top:e,left:t,right:t+r,bottom:e+n,x:t,y:e}}function xi(i,t,e){let{reference:r,floating:n}=i;const o=bt(t),s=cn(t),l=an(s),a=J(t),c=o==="y",d=r.x+r.width/2-n.width/2,u=r.y+r.height/2-n.height/2,p=r[l]/2-n[l]/2;let b;switch(a){case"top":b={x:d,y:r.y-n.height};break;case"bottom":b={x:d,y:r.y+r.height};break;case"right":b={x:r.x+r.width,y:u};break;case"left":b={x:r.x-n.width,y:u};break;default:b={x:r.x,y:r.y}}switch(Se(t)){case"start":b[s]-=p*(e&&c?-1:1);break;case"end":b[s]+=p*(e&&c?-1:1);break}return b}const Vr=async(i,t,e)=>{const{placement:r="bottom",strategy:n="absolute",middleware:o=[],platform:s}=e,l=o.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:i,floating:t,strategy:n}),{x:d,y:u}=xi(c,r,a),p=r,b={},m=0;for(let v=0;v<l.length;v++){const{name:g,fn:S}=l[v],{x:C,y:x,data:$,reset:z}=await S({x:d,y:u,initialPlacement:r,placement:p,strategy:n,middlewareData:b,rects:c,platform:s,elements:{reference:i,floating:t}});d=C??d,u=x??u,b={...b,[g]:{...b[g],...$}},z&&m<=50&&(m++,typeof z=="object"&&(z.placement&&(p=z.placement),z.rects&&(c=z.rects===!0?await s.getElementRects({reference:i,floating:t,strategy:n}):z.rects),{x:d,y:u}=xi(c,p,a)),v=-1)}return{x:d,y:u,placement:p,strategy:n,middlewareData:b}};async function dn(i,t){var e;t===void 0&&(t={});const{x:r,y:n,platform:o,rects:s,elements:l,strategy:a}=i,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:p=!1,padding:b=0}=ie(t,i),m=hn(b),v=l[p?u==="floating"?"reference":"floating":u],g=kt(await o.getClippingRect({element:(e=await(o.isElement==null?void 0:o.isElement(v)))==null||e?v:v.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(l.floating)),boundary:c,rootBoundary:d,strategy:a})),S=u==="floating"?{x:r,y:n,width:s.floating.width,height:s.floating.height}:s.reference,C=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l.floating)),x=await(o.isElement==null?void 0:o.isElement(C))?await(o.getScale==null?void 0:o.getScale(C))||{x:1,y:1}:{x:1,y:1},$=kt(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:S,offsetParent:C,strategy:a}):S);return{top:(g.top-$.top+m.top)/x.y,bottom:($.bottom-g.bottom+m.bottom)/x.y,left:(g.left-$.left+m.left)/x.x,right:($.right-g.right+m.right)/x.x}}const qr=function(i){return i===void 0&&(i={}),{name:"flip",options:i,async fn(t){var e,r;const{placement:n,middlewareData:o,rects:s,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:p,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...g}=ie(i,t);if((e=o.arrow)!=null&&e.alignmentOffset)return{};const S=J(n),C=bt(l),x=J(l)===l,$=await(a.isRTL==null?void 0:a.isRTL(c.floating)),z=p||(x||!v?[ve(l)]:Ir(l)),y=m!=="none";!p&&y&&z.push(...Dr(l,v,m,$));const P=[l,...z],I=await dn(t,g),F=[];let k=((r=o.flip)==null?void 0:r.overflows)||[];if(d&&F.push(I[S]),u){const V=Nr(n,s,$);F.push(I[V[0]],I[V[1]])}if(k=[...k,{placement:n,overflows:F}],!F.every(V=>V<=0)){var _t,Ut;const V=(((_t=o.flip)==null?void 0:_t.index)||0)+1,wt=P[V];if(wt)return{data:{index:V,overflows:k},reset:{placement:wt}};let Z=(Ut=k.filter(tt=>tt.overflows[0]<=0).sort((tt,q)=>tt.overflows[1]-q.overflows[1])[0])==null?void 0:Ut.placement;if(!Z)switch(b){case"bestFit":{var xt;const tt=(xt=k.filter(q=>{if(y){const et=bt(q.placement);return et===C||et==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(et=>et>0).reduce((et,Lr)=>et+Lr,0)]).sort((q,et)=>q[1]-et[1])[0])==null?void 0:xt[0];tt&&(Z=tt);break}case"initialPlacement":Z=l;break}if(n!==Z)return{reset:{placement:Z}}}return{}}}};function un(i){const t=Ct(...i.map(o=>o.left)),e=Ct(...i.map(o=>o.top)),r=G(...i.map(o=>o.right)),n=G(...i.map(o=>o.bottom));return{x:t,y:e,width:r-t,height:n-e}}function Wr(i){const t=i.slice().sort((n,o)=>n.y-o.y),e=[];let r=null;for(let n=0;n<t.length;n++){const o=t[n];!r||o.y-r.y>r.height/2?e.push([o]):e[e.length-1].push(o),r=o}return e.map(n=>kt(un(n)))}const Yr=function(i){return i===void 0&&(i={}),{name:"inline",options:i,async fn(t){const{placement:e,elements:r,rects:n,platform:o,strategy:s}=t,{padding:l=2,x:a,y:c}=ie(i,t),d=Array.from(await(o.getClientRects==null?void 0:o.getClientRects(r.reference))||[]),u=Wr(d),p=kt(un(d)),b=hn(l);function m(){if(u.length===2&&u[0].left>u[1].right&&a!=null&&c!=null)return u.find(g=>a>g.left-b.left&&a<g.right+b.right&&c>g.top-b.top&&c<g.bottom+b.bottom)||p;if(u.length>=2){if(bt(e)==="y"){const k=u[0],_t=u[u.length-1],Ut=J(e)==="top",xt=k.top,V=_t.bottom,wt=Ut?k.left:_t.left,Z=Ut?k.right:_t.right,tt=Z-wt,q=V-xt;return{top:xt,bottom:V,left:wt,right:Z,width:tt,height:q,x:wt,y:xt}}const g=J(e)==="left",S=G(...u.map(k=>k.right)),C=Ct(...u.map(k=>k.left)),x=u.filter(k=>g?k.left===C:k.right===S),$=x[0].top,z=x[x.length-1].bottom,y=C,P=S,I=P-y,F=z-$;return{top:$,bottom:z,left:y,right:P,width:I,height:F,x:y,y:$}}return p}const v=await o.getElementRects({reference:{getBoundingClientRect:m},floating:r.floating,strategy:s});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function Qr(i,t){const{placement:e,platform:r,elements:n}=i,o=await(r.isRTL==null?void 0:r.isRTL(n.floating)),s=J(e),l=Se(e),a=bt(e)==="y",c=["left","top"].includes(s)?-1:1,d=o&&a?-1:1,u=ie(t,i);let{mainAxis:p,crossAxis:b,alignmentAxis:m}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return l&&typeof m=="number"&&(b=l==="end"?m*-1:m),a?{x:b*d,y:p*c}:{x:p*c,y:b*d}}const pn=function(i){return{name:"offset",options:i,async fn(t){var e,r;const{x:n,y:o,placement:s,middlewareData:l}=t,a=await Qr(t,i);return s===((e=l.offset)==null?void 0:e.placement)&&(r=l.arrow)!=null&&r.alignmentOffset?{}:{x:n+a.x,y:o+a.y,data:{...a,placement:s}}}}},Gr=function(i){return i===void 0&&(i={}),{name:"shift",options:i,async fn(t){const{x:e,y:r,placement:n}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:l={fn:g=>{let{x:S,y:C}=g;return{x:S,y:C}}},...a}=ie(i,t),c={x:e,y:r},d=await dn(t,a),u=bt(J(n)),p=ln(u);let b=c[p],m=c[u];if(o){const g=p==="y"?"top":"left",S=p==="y"?"bottom":"right",C=b+d[g],x=b-d[S];b=_i(C,b,x)}if(s){const g=u==="y"?"top":"left",S=u==="y"?"bottom":"right",C=m+d[g],x=m-d[S];m=_i(C,m,x)}const v=l.fn({...t,[p]:b,[u]:m});return{...v,data:{x:v.x-e,y:v.y-r}}}}};function rt(i){return bn(i)?(i.nodeName||"").toLowerCase():"#document"}function j(i){var t;return(i==null||(t=i.ownerDocument)==null?void 0:t.defaultView)||window}function st(i){var t;return(t=(bn(i)?i.ownerDocument:i.document)||window.document)==null?void 0:t.documentElement}function bn(i){return i instanceof Node||i instanceof j(i).Node}function W(i){return i instanceof Element||i instanceof j(i).Element}function Y(i){return i instanceof HTMLElement||i instanceof j(i).HTMLElement}function wi(i){return typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof j(i).ShadowRoot}function ne(i){const{overflow:t,overflowX:e,overflowY:r,display:n}=R(i);return/auto|scroll|overlay|hidden|clip/.test(t+r+e)&&!["inline","contents"].includes(n)}function Jr(i){return["table","td","th"].includes(rt(i))}function Xr(i){return[":popover-open",":modal"].some(t=>{try{return i.matches(t)}catch{return!1}})}function oi(i){const t=si(),e=W(i)?R(i):i;return e.transform!=="none"||e.perspective!=="none"||(e.containerType?e.containerType!=="normal":!1)||!t&&(e.backdropFilter?e.backdropFilter!=="none":!1)||!t&&(e.filter?e.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(e.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(e.contain||"").includes(r))}function Kr(i){let t=St(i);for(;Y(t)&&!Ae(t);){if(oi(t))return t;if(Xr(t))return null;t=St(t)}return null}function si(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Ae(i){return["html","body","#document"].includes(rt(i))}function R(i){return j(i).getComputedStyle(i)}function Oe(i){return W(i)?{scrollLeft:i.scrollLeft,scrollTop:i.scrollTop}:{scrollLeft:i.scrollX,scrollTop:i.scrollY}}function St(i){if(rt(i)==="html")return i;const t=i.assignedSlot||i.parentNode||wi(i)&&i.host||st(i);return wi(t)?t.host:t}function fn(i){const t=St(i);return Ae(t)?i.ownerDocument?i.ownerDocument.body:i.body:Y(t)&&ne(t)?t:fn(t)}function We(i,t,e){var r;t===void 0&&(t=[]),e===void 0&&(e=!0);const n=fn(i),o=n===((r=i.ownerDocument)==null?void 0:r.body),s=j(n);if(o){const l=Zr(s);return t.concat(s,s.visualViewport||[],ne(n)?n:[],l&&e?We(l):[])}return t.concat(n,We(n,[],e))}function Zr(i){return i.parent&&Object.getPrototypeOf(i.parent)?i.frameElement:null}function mn(i){const t=R(i);let e=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const n=Y(i),o=n?i.offsetWidth:e,s=n?i.offsetHeight:r,l=ge(e)!==o||ge(r)!==s;return l&&(e=o,r=s),{width:e,height:r,$:l}}function gn(i){return W(i)?i:i.contextElement}function Et(i){const t=gn(i);if(!Y(t))return nt(1);const e=t.getBoundingClientRect(),{width:r,height:n,$:o}=mn(t);let s=(o?ge(e.width):e.width)/r,l=(o?ge(e.height):e.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const to=nt(0);function vn(i){const t=j(i);return!si()||!t.visualViewport?to:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function eo(i,t,e){return t===void 0&&(t=!1),!e||t&&e!==j(i)?!1:t}function Gt(i,t,e,r){t===void 0&&(t=!1),e===void 0&&(e=!1);const n=i.getBoundingClientRect(),o=gn(i);let s=nt(1);t&&(r?W(r)&&(s=Et(r)):s=Et(i));const l=eo(o,e,r)?vn(o):nt(0);let a=(n.left+l.x)/s.x,c=(n.top+l.y)/s.y,d=n.width/s.x,u=n.height/s.y;if(o){const p=j(o),b=r&&W(r)?j(r):r;let m=p,v=m.frameElement;for(;v&&r&&b!==m;){const g=Et(v),S=v.getBoundingClientRect(),C=R(v),x=S.left+(v.clientLeft+parseFloat(C.paddingLeft))*g.x,$=S.top+(v.clientTop+parseFloat(C.paddingTop))*g.y;a*=g.x,c*=g.y,d*=g.x,u*=g.y,a+=x,c+=$,m=j(v),v=m.frameElement}}return kt({width:d,height:u,x:a,y:c})}const io=[":popover-open",":modal"];function yn(i){return io.some(t=>{try{return i.matches(t)}catch{return!1}})}function no(i){let{elements:t,rect:e,offsetParent:r,strategy:n}=i;const o=n==="fixed",s=st(r),l=t?yn(t.floating):!1;if(r===s||l&&o)return e;let a={scrollLeft:0,scrollTop:0},c=nt(1);const d=nt(0),u=Y(r);if((u||!u&&!o)&&((rt(r)!=="body"||ne(s))&&(a=Oe(r)),Y(r))){const p=Gt(r);c=Et(r),d.x=p.x+r.clientLeft,d.y=p.y+r.clientTop}return{width:e.width*c.x,height:e.height*c.y,x:e.x*c.x-a.scrollLeft*c.x+d.x,y:e.y*c.y-a.scrollTop*c.y+d.y}}function ro(i){return Array.from(i.getClientRects())}function _n(i){return Gt(st(i)).left+Oe(i).scrollLeft}function oo(i){const t=st(i),e=Oe(i),r=i.ownerDocument.body,n=G(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),o=G(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-e.scrollLeft+_n(i);const l=-e.scrollTop;return R(r).direction==="rtl"&&(s+=G(t.clientWidth,r.clientWidth)-n),{width:n,height:o,x:s,y:l}}function so(i,t){const e=j(i),r=st(i),n=e.visualViewport;let o=r.clientWidth,s=r.clientHeight,l=0,a=0;if(n){o=n.width,s=n.height;const c=si();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:o,height:s,x:l,y:a}}function lo(i,t){const e=Gt(i,!0,t==="fixed"),r=e.top+i.clientTop,n=e.left+i.clientLeft,o=Y(i)?Et(i):nt(1),s=i.clientWidth*o.x,l=i.clientHeight*o.y,a=n*o.x,c=r*o.y;return{width:s,height:l,x:a,y:c}}function $i(i,t,e){let r;if(t==="viewport")r=so(i,e);else if(t==="document")r=oo(st(i));else if(W(t))r=lo(t,e);else{const n=vn(i);r={...t,x:t.x-n.x,y:t.y-n.y}}return kt(r)}function xn(i,t){const e=St(i);return e===t||!W(e)||Ae(e)?!1:R(e).position==="fixed"||xn(e,t)}function ao(i,t){const e=t.get(i);if(e)return e;let r=We(i,[],!1).filter(l=>W(l)&&rt(l)!=="body"),n=null;const o=R(i).position==="fixed";let s=o?St(i):i;for(;W(s)&&!Ae(s);){const l=R(s),a=oi(s);!a&&l.position==="fixed"&&(n=null),(o?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||ne(s)&&!a&&xn(i,s))?r=r.filter(c=>c!==s):n=l,s=St(s)}return t.set(i,r),r}function co(i){let{element:t,boundary:e,rootBoundary:r,strategy:n}=i;const o=[...e==="clippingAncestors"?ao(t,this._c):[].concat(e),r],s=o[0],l=o.reduce((a,c)=>{const d=$i(t,c,n);return a.top=G(d.top,a.top),a.right=Ct(d.right,a.right),a.bottom=Ct(d.bottom,a.bottom),a.left=G(d.left,a.left),a},$i(t,s,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function ho(i){const{width:t,height:e}=mn(i);return{width:t,height:e}}function uo(i,t,e){const r=Y(t),n=st(t),o=e==="fixed",s=Gt(i,!0,o,t);let l={scrollLeft:0,scrollTop:0};const a=nt(0);if(r||!r&&!o)if((rt(t)!=="body"||ne(n))&&(l=Oe(t)),r){const u=Gt(t,!0,o,t);a.x=u.x+t.clientLeft,a.y=u.y+t.clientTop}else n&&(a.x=_n(n));const c=s.left+l.scrollLeft-a.x,d=s.top+l.scrollTop-a.y;return{x:c,y:d,width:s.width,height:s.height}}function Ei(i,t){return!Y(i)||R(i).position==="fixed"?null:t?t(i):i.offsetParent}function wn(i,t){const e=j(i);if(!Y(i)||yn(i))return e;let r=Ei(i,t);for(;r&&Jr(r)&&R(r).position==="static";)r=Ei(r,t);return r&&(rt(r)==="html"||rt(r)==="body"&&R(r).position==="static"&&!oi(r))?e:r||Kr(i)||e}const po=async function(i){const t=this.getOffsetParent||wn,e=this.getDimensions;return{reference:uo(i.reference,await t(i.floating),i.strategy),floating:{x:0,y:0,...await e(i.floating)}}};function bo(i){return R(i).direction==="rtl"}const fo={convertOffsetParentRelativeRectToViewportRelativeRect:no,getDocumentElement:st,getClippingRect:co,getOffsetParent:wn,getElementRects:po,getClientRects:ro,getDimensions:ho,getScale:Et,isElement:W,isRTL:bo},$n=Gr,En=qr,Cn=Yr,kn=(i,t,e)=>{const r=new Map,n={platform:fo,...e},o={...n.platform,_c:r};return Vr(i,t,{...n,platform:o})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fe=globalThis,li=fe.ShadowRoot&&(fe.ShadyCSS===void 0||fe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ai=Symbol(),Ci=new WeakMap;let Sn=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==ai)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o;const t=this.t;if(li&&i===void 0){const e=t!==void 0&&t.length===1;e&&(i=Ci.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&Ci.set(t,i))}return i}toString(){return this.cssText}};const mo=i=>new Sn(typeof i=="string"?i:i+"",void 0,ai),E=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,n,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new Sn(e,i,ai)},go=(i,t)=>{if(li)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),n=fe.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=e.cssText,i.appendChild(r)}},ki=li?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return mo(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:vo,defineProperty:yo,getOwnPropertyDescriptor:_o,getOwnPropertyNames:xo,getOwnPropertySymbols:wo,getPrototypeOf:$o}=Object,At=globalThis,Si=At.trustedTypes,Eo=Si?Si.emptyScript:"",Ai=At.reactiveElementPolyfillSupport,qt=(i,t)=>i,ye={toAttribute(i,t){switch(t){case Boolean:i=i?Eo:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ci=(i,t)=>!vo(i,t),Oi={attribute:!0,type:String,converter:ye,reflect:!1,hasChanged:ci};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),At.litPropertyMetadata??(At.litPropertyMetadata=new WeakMap);class $t extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Oi){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(t,r,e);n!==void 0&&yo(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){const{get:n,set:o}=_o(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get(){return n==null?void 0:n.call(this)},set(s){const l=n==null?void 0:n.call(this);o.call(this,s),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Oi}static _$Ei(){if(this.hasOwnProperty(qt("elementProperties")))return;const t=$o(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(qt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(qt("properties"))){const e=this.properties,r=[...xo(e),...wo(e)];for(const n of r)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,n]of e)this.elementProperties.set(r,n)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const n=this._$Eu(e,r);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const n of r)e.unshift(ki(n))}else t!==void 0&&e.push(ki(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return go(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){const s=(((r=n.converter)==null?void 0:r.toAttribute)!==void 0?n.converter:ye).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){var r;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const s=n.getPropertyOptions(o),l=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)==null?void 0:r.fromAttribute)!==void 0?s.converter:ye;this._$Em=o,this[o]=l.fromAttribute(e,s.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ci)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,s]of n)s.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],s)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(r)):this._$EU()}catch(n){throw e=!1,this._$EU(),n}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var n;return(n=r.hostUpdated)==null?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}$t.elementStyles=[],$t.shadowRootOptions={mode:"open"},$t[qt("elementProperties")]=new Map,$t[qt("finalized")]=new Map,Ai==null||Ai({ReactiveElement:$t}),(At.reactiveElementVersions??(At.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _e=globalThis,xe=_e.trustedTypes,Ti=xe?xe.createPolicy("lit-html",{createHTML:i=>i}):void 0,An="$lit$",it=`lit$${Math.random().toFixed(9).slice(2)}$`,On="?"+it,Co=`<${On}>`,ft=document,Jt=()=>ft.createComment(""),Xt=i=>i===null||typeof i!="object"&&typeof i!="function",hi=Array.isArray,ko=i=>hi(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ne=`[ 	
\f\r]`,Vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zi=/-->/g,Pi=/>/g,dt=RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ji=/'/g,Li=/"/g,Tn=/^(?:script|style|textarea|title)$/i,So=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),f=So(1),Ot=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Mi=new WeakMap,ut=ft.createTreeWalker(ft,129);function zn(i,t){if(!hi(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ti!==void 0?Ti.createHTML(t):t}const Ao=(i,t)=>{const e=i.length-1,r=[];let n,o=t===2?"<svg>":t===3?"<math>":"",s=Vt;for(let l=0;l<e;l++){const a=i[l];let c,d,u=-1,p=0;for(;p<a.length&&(s.lastIndex=p,d=s.exec(a),d!==null);)p=s.lastIndex,s===Vt?d[1]==="!--"?s=zi:d[1]!==void 0?s=Pi:d[2]!==void 0?(Tn.test(d[2])&&(n=RegExp("</"+d[2],"g")),s=dt):d[3]!==void 0&&(s=dt):s===dt?d[0]===">"?(s=n??Vt,u=-1):d[1]===void 0?u=-2:(u=s.lastIndex-d[2].length,c=d[1],s=d[3]===void 0?dt:d[3]==='"'?Li:ji):s===Li||s===ji?s=dt:s===zi||s===Pi?s=Vt:(s=dt,n=void 0);const b=s===dt&&i[l+1].startsWith("/>")?" ":"";o+=s===Vt?a+Co:u>=0?(r.push(c),a.slice(0,u)+An+a.slice(u)+it+b):a+it+(u===-2?l:b)}return[zn(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class Kt{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let o=0,s=0;const l=t.length-1,a=this.parts,[c,d]=Ao(t,e);if(this.el=Kt.createElement(c,r),ut.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=ut.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(An)){const p=d[s++],b=n.getAttribute(u).split(it),m=/([.?@])?(.*)/.exec(p);a.push({type:1,index:o,name:m[2],strings:b,ctor:m[1]==="."?To:m[1]==="?"?zo:m[1]==="@"?Po:Te}),n.removeAttribute(u)}else u.startsWith(it)&&(a.push({type:6,index:o}),n.removeAttribute(u));if(Tn.test(n.tagName)){const u=n.textContent.split(it),p=u.length-1;if(p>0){n.textContent=xe?xe.emptyScript:"";for(let b=0;b<p;b++)n.append(u[b],Jt()),ut.nextNode(),a.push({type:2,index:++o});n.append(u[p],Jt())}}}else if(n.nodeType===8)if(n.data===On)a.push({type:2,index:o});else{let u=-1;for(;(u=n.data.indexOf(it,u+1))!==-1;)a.push({type:7,index:o}),u+=it.length-1}o++}}static createElement(t,e){const r=ft.createElement("template");return r.innerHTML=t,r}}function Tt(i,t,e=i,r){var n,o;if(t===Ot)return t;let s=r!==void 0?(n=e.o)==null?void 0:n[r]:e.l;const l=Xt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==l&&((o=s==null?void 0:s._$AO)==null||o.call(s,!1),l===void 0?s=void 0:(s=new l(i),s._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=s:e.l=s),s!==void 0&&(t=Tt(i,s._$AS(i,t.values),s,r)),t}class Oo{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,n=((t==null?void 0:t.creationScope)??ft).importNode(e,!0);ut.currentNode=n;let o=ut.nextNode(),s=0,l=0,a=r[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new re(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new jo(o,this,t)),this._$AV.push(c),a=r[++l]}s!==(a==null?void 0:a.index)&&(o=ut.nextNode(),s++)}return ut.currentNode=ft,n}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class re{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this.v=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Tt(this,t,e),Xt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==Ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ko(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&Xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ft.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Kt.createElement(zn(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(r);else{const s=new Oo(o,this),l=s.u(this.options);s.p(r),this.T(l),this._$AH=s}}_$AC(t){let e=Mi.get(t.strings);return e===void 0&&Mi.set(t.strings,e=new Kt(t)),e}k(t){hi(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,n=0;for(const o of t)n===e.length?e.push(r=new re(this.O(Jt()),this.O(Jt()),this,this.options)):r=e[n],r._$AI(o),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=A}_$AI(t,e=this,r,n){const o=this.strings;let s=!1;if(o===void 0)t=Tt(this,t,e,0),s=!Xt(t)||t!==this._$AH&&t!==Ot,s&&(this._$AH=t);else{const l=t;let a,c;for(t=o[0],a=0;a<o.length-1;a++)c=Tt(this,l[r+a],e,a),c===Ot&&(c=this._$AH[a]),s||(s=!Xt(c)||c!==this._$AH[a]),c===A?t=A:t!==A&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class To extends Te{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class zo extends Te{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class Po extends Te{constructor(t,e,r,n,o){super(t,e,r,n,o),this.type=5}_$AI(t,e=this){if((t=Tt(this,t,e,0)??A)===Ot)return;const r=this._$AH,n=t===A&&r!==A||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==A&&(r===A||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class jo{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Tt(this,t)}}const Ri=_e.litHtmlPolyfillSupport;Ri==null||Ri(Kt,re),(_e.litHtmlVersions??(_e.litHtmlVersions=[])).push("3.2.0");const zt=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let n=r._$litPart$;if(n===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=n=new re(t.insertBefore(Jt(),o),o,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class w extends $t{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=zt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Ot}}var Hi;w._$litElement$=!0,w.finalized=!0,(Hi=globalThis.litElementHydrateSupport)==null||Hi.call(globalThis,{LitElement:w});const Bi=globalThis.litElementPolyfillSupport;Bi==null||Bi({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lo={attribute:!0,type:String,converter:ye,reflect:!1,hasChanged:ci},Mo=(i=Lo,t,e)=>{const{kind:r,metadata:n}=e;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(e.name,i),r==="accessor"){const{name:s}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(s,a,i)},init(l){return l!==void 0&&this.P(s,void 0,i),l}}}if(r==="setter"){const{name:s}=e;return function(l){const a=this[s];t.call(this,l),this.requestUpdate(s,a,i)}}throw Error("Unsupported decorator location: "+r)};function h(i){return(t,e)=>typeof e=="object"?Mo(i,t,e):((r,n,o)=>{const s=n.hasOwnProperty(o);return n.constructor.createProperty(o,s?{...r,wrapped:!0}:r),s?Object.getOwnPropertyDescriptor(n,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lt(i){return h({...i,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ro=i=>i.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ho={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Bo=i=>(...t)=>({_$litDirective$:i,values:t});class No{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this.t=t,this._$AM=e,this.i=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wt=(i,t)=>{var e;const r=i._$AN;if(r===void 0)return!1;for(const n of r)(e=n._$AO)==null||e.call(n,t,!1),Wt(n,t);return!0},we=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while((e==null?void 0:e.size)===0)},Pn=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),Do(t)}};function Io(i){this._$AN!==void 0?(we(this),this._$AM=i,Pn(this)):this._$AM=i}function Fo(i,t=!1,e=0){const r=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(r))for(let o=e;o<r.length;o++)Wt(r[o],!1),we(r[o]);else r!=null&&(Wt(r,!1),we(r));else Wt(this,i)}const Do=i=>{i.type==Ho.CHILD&&(i._$AP??(i._$AP=Fo),i._$AQ??(i._$AQ=Io))};class Uo extends No{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),Pn(this),this.isConnected=t._$AU}_$AO(t,e=!0){var r,n;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(n=this.disconnected)==null||n.call(this)),e&&(Wt(this,t),we(this))}setValue(t){if(Ro(this.t))this.t._$AI(t,this);else{const e=[...this.t._$AH];e[this.i]=t,this.t._$AI(e,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=()=>new Vo;class Vo{}const Ie=new WeakMap,jt=Bo(class extends Uo{render(i){return A}update(i,[t]){var e;const r=t!==this.Y;return r&&this.Y!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=t,this.ht=(e=i.options)==null?void 0:e.host,this.rt(this.ct=i.element)),A}rt(i){if(this.isConnected||(i=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let e=Ie.get(t);e===void 0&&(e=new WeakMap,Ie.set(t,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),e.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){var i,t;return typeof this.Y=="function"?(i=Ie.get(this.ht??globalThis))==null?void 0:i.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const jn=Object.freeze({left:0,top:0,width:16,height:16}),$e=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),oe=Object.freeze({...jn,...$e}),Ye=Object.freeze({...oe,body:"",hidden:!1}),qo=Object.freeze({width:null,height:null}),Ln=Object.freeze({...qo,...$e});function Wo(i,t=0){const e=i.replace(/^-?[0-9.]*/,"");function r(n){for(;n<0;)n+=4;return n%4}if(e===""){const n=parseInt(i);return isNaN(n)?0:r(n)}else if(e!==i){let n=0;switch(e){case"%":n=25;break;case"deg":n=90}if(n){let o=parseFloat(i.slice(0,i.length-e.length));return isNaN(o)?0:(o=o/n,o%1===0?r(o):0)}}return t}const Yo=/[\s,]+/;function Qo(i,t){t.split(Yo).forEach(e=>{switch(e.trim()){case"horizontal":i.hFlip=!0;break;case"vertical":i.vFlip=!0;break}})}const Mn={...Ln,preserveAspectRatio:""};function Ni(i){const t={...Mn},e=(r,n)=>i.getAttribute(r)||n;return t.width=e("width",null),t.height=e("height",null),t.rotate=Wo(e("rotate","")),Qo(t,e("flip","")),t.preserveAspectRatio=e("preserveAspectRatio",e("preserveaspectratio","")),t}function Go(i,t){for(const e in Mn)if(i[e]!==t[e])return!0;return!1}const Yt=/^[a-z0-9]+(-[a-z0-9]+)*$/,se=(i,t,e,r="")=>{const n=i.split(":");if(i.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;r=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:r,prefix:a,name:l};return t&&!me(c)?null:c}const o=n[0],s=o.split("-");if(s.length>1){const l={provider:r,prefix:s.shift(),name:s.join("-")};return t&&!me(l)?null:l}if(e&&r===""){const l={provider:r,prefix:"",name:o};return t&&!me(l,e)?null:l}return null},me=(i,t)=>i?!!((i.provider===""||i.provider.match(Yt))&&(t&&i.prefix===""||i.prefix.match(Yt))&&i.name.match(Yt)):!1;function Jo(i,t){const e={};!i.hFlip!=!t.hFlip&&(e.hFlip=!0),!i.vFlip!=!t.vFlip&&(e.vFlip=!0);const r=((i.rotate||0)+(t.rotate||0))%4;return r&&(e.rotate=r),e}function Ii(i,t){const e=Jo(i,t);for(const r in Ye)r in $e?r in i&&!(r in e)&&(e[r]=$e[r]):r in t?e[r]=t[r]:r in i&&(e[r]=i[r]);return e}function Xo(i,t){const e=i.icons,r=i.aliases||Object.create(null),n=Object.create(null);function o(s){if(e[s])return n[s]=[];if(!(s in n)){n[s]=null;const l=r[s]&&r[s].parent,a=l&&o(l);a&&(n[s]=[l].concat(a))}return n[s]}return Object.keys(e).concat(Object.keys(r)).forEach(o),n}function Ko(i,t,e){const r=i.icons,n=i.aliases||Object.create(null);let o={};function s(l){o=Ii(r[l]||n[l],o)}return s(t),e.forEach(s),Ii(i,o)}function Rn(i,t){const e=[];if(typeof i!="object"||typeof i.icons!="object")return e;i.not_found instanceof Array&&i.not_found.forEach(n=>{t(n,null),e.push(n)});const r=Xo(i);for(const n in r){const o=r[n];o&&(t(n,Ko(i,n,o)),e.push(n))}return e}const Zo={provider:"",aliases:{},not_found:{},...jn};function Fe(i,t){for(const e in t)if(e in i&&typeof i[e]!=typeof t[e])return!1;return!0}function Hn(i){if(typeof i!="object"||i===null)return null;const t=i;if(typeof t.prefix!="string"||!i.icons||typeof i.icons!="object"||!Fe(i,Zo))return null;const e=t.icons;for(const n in e){const o=e[n];if(!n.match(Yt)||typeof o.body!="string"||!Fe(o,Ye))return null}const r=t.aliases||Object.create(null);for(const n in r){const o=r[n],s=o.parent;if(!n.match(Yt)||typeof s!="string"||!e[s]&&!r[s]||!Fe(o,Ye))return null}return t}const Ee=Object.create(null);function ts(i,t){return{provider:i,prefix:t,icons:Object.create(null),missing:new Set}}function ot(i,t){const e=Ee[i]||(Ee[i]=Object.create(null));return e[t]||(e[t]=ts(i,t))}function di(i,t){return Hn(t)?Rn(t,(e,r)=>{r?i.icons[e]=r:i.missing.add(e)}):[]}function es(i,t,e){try{if(typeof e.body=="string")return i.icons[t]={...e},!0}catch{}return!1}function is(i,t){let e=[];return(typeof i=="string"?[i]:Object.keys(Ee)).forEach(r=>{(typeof r=="string"&&typeof t=="string"?[t]:Object.keys(Ee[r]||{})).forEach(n=>{const o=ot(r,n);e=e.concat(Object.keys(o.icons).map(s=>(r!==""?"@"+r+":":"")+n+":"+s))})}),e}let Zt=!1;function Bn(i){return typeof i=="boolean"&&(Zt=i),Zt}function te(i){const t=typeof i=="string"?se(i,!0,Zt):i;if(t){const e=ot(t.provider,t.prefix),r=t.name;return e.icons[r]||(e.missing.has(r)?null:void 0)}}function Nn(i,t){const e=se(i,!0,Zt);if(!e)return!1;const r=ot(e.provider,e.prefix);return es(r,e.name,t)}function Fi(i,t){if(typeof i!="object")return!1;if(typeof t!="string"&&(t=i.provider||""),Zt&&!t&&!i.prefix){let n=!1;return Hn(i)&&(i.prefix="",Rn(i,(o,s)=>{s&&Nn(o,s)&&(n=!0)})),n}const e=i.prefix;if(!me({provider:t,prefix:e,name:"a"}))return!1;const r=ot(t,e);return!!di(r,i)}function Di(i){return!!te(i)}function ns(i){const t=te(i);return t?{...oe,...t}:null}function rs(i){const t={loaded:[],missing:[],pending:[]},e=Object.create(null);i.sort((n,o)=>n.provider!==o.provider?n.provider.localeCompare(o.provider):n.prefix!==o.prefix?n.prefix.localeCompare(o.prefix):n.name.localeCompare(o.name));let r={provider:"",prefix:"",name:""};return i.forEach(n=>{if(r.name===n.name&&r.prefix===n.prefix&&r.provider===n.provider)return;r=n;const o=n.provider,s=n.prefix,l=n.name,a=e[o]||(e[o]=Object.create(null)),c=a[s]||(a[s]=ot(o,s));let d;l in c.icons?d=t.loaded:s===""||c.missing.has(l)?d=t.missing:d=t.pending;const u={provider:o,prefix:s,name:l};d.push(u)}),t}function In(i,t){i.forEach(e=>{const r=e.loaderCallbacks;r&&(e.loaderCallbacks=r.filter(n=>n.id!==t))})}function os(i){i.pendingCallbacksFlag||(i.pendingCallbacksFlag=!0,setTimeout(()=>{i.pendingCallbacksFlag=!1;const t=i.loaderCallbacks?i.loaderCallbacks.slice(0):[];if(!t.length)return;let e=!1;const r=i.provider,n=i.prefix;t.forEach(o=>{const s=o.icons,l=s.pending.length;s.pending=s.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(i.icons[c])s.loaded.push({provider:r,prefix:n,name:c});else if(i.missing.has(c))s.missing.push({provider:r,prefix:n,name:c});else return e=!0,!0;return!1}),s.pending.length!==l&&(e||In([i],o.id),o.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),o.abort))})}))}let ss=0;function ls(i,t,e){const r=ss++,n=In.bind(null,e,r);if(!t.pending.length)return n;const o={id:r,icons:t,callback:i,abort:n};return e.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(o)}),n}const Qe=Object.create(null);function Ui(i,t){Qe[i]=t}function Ge(i){return Qe[i]||Qe[""]}function as(i,t=!0,e=!1){const r=[];return i.forEach(n=>{const o=typeof n=="string"?se(n,t,e):n;o&&r.push(o)}),r}var cs={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function hs(i,t,e,r){const n=i.resources.length,o=i.random?Math.floor(Math.random()*n):i.index;let s;if(i.random){let y=i.resources.slice(0);for(s=[];y.length>1;){const P=Math.floor(Math.random()*y.length);s.push(y[P]),y=y.slice(0,P).concat(y.slice(P+1))}s=s.concat(y)}else s=i.resources.slice(o).concat(i.resources.slice(0,o));const l=Date.now();let a="pending",c=0,d,u=null,p=[],b=[];typeof r=="function"&&b.push(r);function m(){u&&(clearTimeout(u),u=null)}function v(){a==="pending"&&(a="aborted"),m(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,P){P&&(b=[]),typeof y=="function"&&b.push(y)}function S(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function C(){a="failed",b.forEach(y=>{y(void 0,d)})}function x(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,P,I){const F=P!=="success";switch(p=p.filter(k=>k!==y),a){case"pending":break;case"failed":if(F||!i.dataAfterTimeout)return;break;default:return}if(P==="abort"){d=I,C();return}if(F){d=I,p.length||(s.length?z():C());return}if(m(),x(),!i.random){const k=i.resources.indexOf(y.resource);k!==-1&&k!==i.index&&(i.index=k)}a="completed",b.forEach(k=>{k(I)})}function z(){if(a!=="pending")return;m();const y=s.shift();if(y===void 0){if(p.length){u=setTimeout(()=>{m(),a==="pending"&&(x(),C())},i.timeout);return}C();return}const P={status:"pending",resource:y,callback:(I,F)=>{$(P,I,F)}};p.push(P),c++,u=setTimeout(z,i.rotate),e(y,t,P.callback)}return setTimeout(z),S}function Fn(i){const t={...cs,...i};let e=[];function r(){e=e.filter(s=>s().status==="pending")}function n(s,l,a){const c=hs(t,s,l,(d,u)=>{r(),a&&a(d,u)});return e.push(c),c}function o(s){return e.find(l=>s(l))||null}return{query:n,find:o,setIndex:s=>{t.index=s},getIndex:()=>t.index,cleanup:r}}function ui(i){let t;if(typeof i.resources=="string")t=[i.resources];else if(t=i.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:i.path||"/",maxURL:i.maxURL||500,rotate:i.rotate||750,timeout:i.timeout||5e3,random:i.random===!0,index:i.index||0,dataAfterTimeout:i.dataAfterTimeout!==!1}}const ze=Object.create(null),pe=["https://api.simplesvg.com","https://api.unisvg.com"],Je=[];for(;pe.length>0;)pe.length===1||Math.random()>.5?Je.push(pe.shift()):Je.push(pe.pop());ze[""]=ui({resources:["https://api.iconify.design"].concat(Je)});function Vi(i,t){const e=ui(t);return e===null?!1:(ze[i]=e,!0)}function Pe(i){return ze[i]}function ds(){return Object.keys(ze)}function qi(){}const De=Object.create(null);function us(i){if(!De[i]){const t=Pe(i);if(!t)return;const e=Fn(t),r={config:t,redundancy:e};De[i]=r}return De[i]}function Dn(i,t,e){let r,n;if(typeof i=="string"){const o=Ge(i);if(!o)return e(void 0,424),qi;n=o.send;const s=us(i);s&&(r=s.redundancy)}else{const o=ui(i);if(o){r=Fn(o);const s=i.resources?i.resources[0]:"",l=Ge(s);l&&(n=l.send)}}return!r||!n?(e(void 0,424),qi):r.query(t,n,e)().abort}const Wi="iconify2",ee="iconify",Un=ee+"-count",Yi=ee+"-version",Vn=36e5,ps=168,bs=50;function Xe(i,t){try{return i.getItem(t)}catch{}}function pi(i,t,e){try{return i.setItem(t,e),!0}catch{}}function Qi(i,t){try{i.removeItem(t)}catch{}}function Ke(i,t){return pi(i,Un,t.toString())}function Ze(i){return parseInt(Xe(i,Un))||0}const pt={local:!0,session:!0},qn={local:new Set,session:new Set};let bi=!1;function fs(i){bi=i}let be=typeof window>"u"?{}:window;function Wn(i){const t=i+"Storage";try{if(be&&be[t]&&typeof be[t].length=="number")return be[t]}catch{}pt[i]=!1}function Yn(i,t){const e=Wn(i);if(!e)return;const r=Xe(e,Yi);if(r!==Wi){if(r){const l=Ze(e);for(let a=0;a<l;a++)Qi(e,ee+a.toString())}pi(e,Yi,Wi),Ke(e,0);return}const n=Math.floor(Date.now()/Vn)-ps,o=l=>{const a=ee+l.toString(),c=Xe(e,a);if(typeof c=="string"){try{const d=JSON.parse(c);if(typeof d=="object"&&typeof d.cached=="number"&&d.cached>n&&typeof d.provider=="string"&&typeof d.data=="object"&&typeof d.data.prefix=="string"&&t(d,l))return!0}catch{}Qi(e,a)}};let s=Ze(e);for(let l=s-1;l>=0;l--)o(l)||(l===s-1?(s--,Ke(e,s)):qn[i].add(l))}function Qn(){if(!bi){fs(!0);for(const i in pt)Yn(i,t=>{const e=t.data,r=t.provider,n=e.prefix,o=ot(r,n);if(!di(o,e).length)return!1;const s=e.lastModified||-1;return o.lastModifiedCached=o.lastModifiedCached?Math.min(o.lastModifiedCached,s):s,!0})}}function ms(i,t){const e=i.lastModifiedCached;if(e&&e>=t)return e===t;if(i.lastModifiedCached=t,e)for(const r in pt)Yn(r,n=>{const o=n.data;return n.provider!==i.provider||o.prefix!==i.prefix||o.lastModified===t});return!0}function gs(i,t){bi||Qn();function e(r){let n;if(!pt[r]||!(n=Wn(r)))return;const o=qn[r];let s;if(o.size)o.delete(s=Array.from(o).shift());else if(s=Ze(n),s>=bs||!Ke(n,s+1))return;const l={cached:Math.floor(Date.now()/Vn),provider:i.provider,data:t};return pi(n,ee+s.toString(),JSON.stringify(l))}t.lastModified&&!ms(i,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),e("local")||e("session"))}function Gi(){}function vs(i){i.iconsLoaderFlag||(i.iconsLoaderFlag=!0,setTimeout(()=>{i.iconsLoaderFlag=!1,os(i)}))}function ys(i,t){i.iconsToLoad?i.iconsToLoad=i.iconsToLoad.concat(t).sort():i.iconsToLoad=t,i.iconsQueueFlag||(i.iconsQueueFlag=!0,setTimeout(()=>{i.iconsQueueFlag=!1;const{provider:e,prefix:r}=i,n=i.iconsToLoad;delete i.iconsToLoad;let o;!n||!(o=Ge(e))||o.prepare(e,r,n).forEach(s=>{Dn(e,s,l=>{if(typeof l!="object")s.icons.forEach(a=>{i.missing.add(a)});else try{const a=di(i,l);if(!a.length)return;const c=i.pendingIcons;c&&a.forEach(d=>{c.delete(d)}),gs(i,l)}catch(a){console.error(a)}vs(i)})})}))}const fi=(i,t)=>{const e=as(i,!0,Bn()),r=rs(e);if(!r.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(r.loaded,r.missing,r.pending,Gi)}),()=>{a=!1}}const n=Object.create(null),o=[];let s,l;return r.pending.forEach(a=>{const{provider:c,prefix:d}=a;if(d===l&&c===s)return;s=c,l=d,o.push(ot(c,d));const u=n[c]||(n[c]=Object.create(null));u[d]||(u[d]=[])}),r.pending.forEach(a=>{const{provider:c,prefix:d,name:u}=a,p=ot(c,d),b=p.pendingIcons||(p.pendingIcons=new Set);b.has(u)||(b.add(u),n[c][d].push(u))}),o.forEach(a=>{const{provider:c,prefix:d}=a;n[c][d].length&&ys(a,n[c][d])}),t?ls(t,r,o):Gi},_s=i=>new Promise((t,e)=>{const r=typeof i=="string"?se(i,!0):i;if(!r){e(i);return}fi([r||i],n=>{if(n.length&&r){const o=te(r);if(o){t({...oe,...o});return}}e(i)})});function xs(i){try{const t=typeof i=="string"?JSON.parse(i):i;if(typeof t.body=="string")return{...t}}catch{}}function ws(i,t){const e=typeof i=="string"?se(i,!0,!0):null;if(!e){const o=xs(i);return{value:i,data:o}}const r=te(e);if(r!==void 0||!e.prefix)return{value:i,name:e,data:r};const n=fi([e],()=>t(i,e,te(e)));return{value:i,name:e,loading:n}}function Ue(i){return i.hasAttribute("inline")}let Gn=!1;try{Gn=navigator.vendor.indexOf("Apple")===0}catch{}function $s(i,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Gn||i.indexOf("<a")===-1)?"svg":i.indexOf("currentColor")===-1?"bg":"mask"}const Es=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Cs=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ti(i,t,e){if(t===1)return i;if(e=e||100,typeof i=="number")return Math.ceil(i*t*e)/e;if(typeof i!="string")return i;const r=i.split(Es);if(r===null||!r.length)return i;const n=[];let o=r.shift(),s=Cs.test(o);for(;;){if(s){const l=parseFloat(o);isNaN(l)?n.push(o):n.push(Math.ceil(l*t*e)/e)}else n.push(o);if(o=r.shift(),o===void 0)return n.join("");s=!s}}function ks(i,t="defs"){let e="";const r=i.indexOf("<"+t);for(;r>=0;){const n=i.indexOf(">",r),o=i.indexOf("</"+t);if(n===-1||o===-1)break;const s=i.indexOf(">",o);if(s===-1)break;e+=i.slice(n+1,o).trim(),i=i.slice(0,r).trim()+i.slice(s+1)}return{defs:e,content:i}}function Ss(i,t){return i?"<defs>"+i+"</defs>"+t:t}function As(i,t,e){const r=ks(i);return Ss(r.defs,t+r.content+e)}const Os=i=>i==="unset"||i==="undefined"||i==="none";function Jn(i,t){const e={...oe,...i},r={...Ln,...t},n={left:e.left,top:e.top,width:e.width,height:e.height};let o=e.body;[e,r].forEach(v=>{const g=[],S=v.hFlip,C=v.vFlip;let x=v.rotate;S?C?x+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):C&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}x%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(o=As(o,'<g transform="'+g.join(" ")+'">',"</g>"))});const s=r.width,l=r.height,a=n.width,c=n.height;let d,u;s===null?(u=l===null?"1em":l==="auto"?c:l,d=ti(u,a/c)):(d=s==="auto"?a:s,u=l===null?ti(d,c/a):l==="auto"?c:l);const p={},b=(v,g)=>{Os(g)||(p[v]=g.toString())};b("width",d),b("height",u);const m=[n.left,n.top,a,c];return p.viewBox=m.join(" "),{attributes:p,viewBox:m,body:o}}function mi(i,t){let e=i.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const r in t)e+=" "+r+'="'+t[r]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+e+">"+i+"</svg>"}function Ts(i){return i.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function zs(i){return"data:image/svg+xml,"+Ts(i)}function Xn(i){return'url("'+zs(i)+'")'}const Ps=()=>{let i;try{if(i=fetch,typeof i=="function")return i}catch{}};let Ce=Ps();function js(i){Ce=i}function Ls(){return Ce}function Ms(i,t){const e=Pe(i);if(!e)return 0;let r;if(!e.maxURL)r=0;else{let n=0;e.resources.forEach(s=>{n=Math.max(n,s.length)});const o=t+".json?icons=";r=e.maxURL-n-e.path.length-o.length}return r}function Rs(i){return i===404}const Hs=(i,t,e)=>{const r=[],n=Ms(i,t),o="icons";let s={type:o,provider:i,prefix:t,icons:[]},l=0;return e.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(r.push(s),s={type:o,provider:i,prefix:t,icons:[]},l=a.length),s.icons.push(a)}),r.push(s),r};function Bs(i){if(typeof i=="string"){const t=Pe(i);if(t)return t.path}return"/"}const Ns=(i,t,e)=>{if(!Ce){e("abort",424);return}let r=Bs(t.provider);switch(t.type){case"icons":{const o=t.prefix,s=t.icons.join(","),l=new URLSearchParams({icons:s});r+=o+".json?"+l.toString();break}case"custom":{const o=t.uri;r+=o.slice(0,1)==="/"?o.slice(1):o;break}default:e("abort",400);return}let n=503;Ce(i+r).then(o=>{const s=o.status;if(s!==200){setTimeout(()=>{e(Rs(s)?"abort":"next",s)});return}return n=501,o.json()}).then(o=>{if(typeof o!="object"||o===null){setTimeout(()=>{o===404?e("abort",o):e("next",n)});return}setTimeout(()=>{e("success",o)})}).catch(()=>{e("next",n)})},Is={prepare:Hs,send:Ns};function Ji(i,t){switch(i){case"local":case"session":pt[i]=t;break;case"all":for(const e in pt)pt[e]=t;break}}const Ve="data-style";let Kn="";function Fs(i){Kn=i}function Xi(i,t){let e=Array.from(i.childNodes).find(r=>r.hasAttribute&&r.hasAttribute(Ve));e||(e=document.createElement("style"),e.setAttribute(Ve,Ve),i.appendChild(e)),e.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+Kn}function Zn(){Ui("",Is),Bn(!0);let i;try{i=window}catch{}if(i){if(Qn(),i.IconifyPreload!==void 0){const t=i.IconifyPreload,e="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(r=>{try{(typeof r!="object"||r===null||r instanceof Array||typeof r.icons!="object"||typeof r.prefix!="string"||!Fi(r))&&console.error(e)}catch{console.error(e)}})}if(i.IconifyProviders!==void 0){const t=i.IconifyProviders;if(typeof t=="object"&&t!==null)for(const e in t){const r="IconifyProviders["+e+"] is invalid.";try{const n=t[e];if(typeof n!="object"||!n||n.resources===void 0)continue;Vi(e,n)||console.error(r)}catch{console.error(r)}}}}return{enableCache:t=>Ji(t,!0),disableCache:t=>Ji(t,!1),iconLoaded:Di,iconExists:Di,getIcon:ns,listIcons:is,addIcon:Nn,addCollection:Fi,calculateSize:ti,buildIcon:Jn,iconToHTML:mi,svgToURL:Xn,loadIcons:fi,loadIcon:_s,addAPIProvider:Vi,appendCustomStyle:Fs,_api:{getAPIConfig:Pe,setAPIModule:Ui,sendAPIQuery:Dn,setFetch:js,getFetch:Ls,listAPIProviders:ds}}}const ei={"background-color":"currentColor"},tr={"background-color":"transparent"},Ki={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},Zi={"-webkit-mask":ei,mask:ei,background:tr};for(const i in Zi){const t=Zi[i];for(const e in Ki)t[i+"-"+e]=Ki[e]}function tn(i){return i?i+(i.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Ds(i,t,e){const r=document.createElement("span");let n=i.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const o=i.attributes,s=mi(n,{...o,width:t.width+"",height:t.height+""}),l=Xn(s),a=r.style,c={"--svg":l,width:tn(o.width),height:tn(o.height),...e?ei:tr};for(const d in c)a.setProperty(d,c[d]);return r}let Qt;function Us(){try{Qt=window.trustedTypes.createPolicy("iconify",{createHTML:i=>i})}catch{Qt=null}}function Vs(i){return Qt===void 0&&Us(),Qt?Qt.createHTML(i):i}function qs(i){const t=document.createElement("span"),e=i.attributes;let r="";e.width||(r="width: inherit;"),e.height||(r+="height: inherit;"),r&&(e.style=r);const n=mi(i.body,e);return t.innerHTML=Vs(n),t.firstChild}function ii(i){return Array.from(i.childNodes).find(t=>{const e=t.tagName&&t.tagName.toUpperCase();return e==="SPAN"||e==="SVG"})}function en(i,t){const e=t.icon.data,r=t.customisations,n=Jn(e,r);r.preserveAspectRatio&&(n.attributes.preserveAspectRatio=r.preserveAspectRatio);const o=t.renderedMode;let s;switch(o){case"svg":s=qs(n);break;default:s=Ds(n,{...oe,...e},o==="mask")}const l=ii(i);l?s.tagName==="SPAN"&&l.tagName===s.tagName?l.setAttribute("style",s.getAttribute("style")):i.replaceChild(s,l):i.appendChild(s)}function nn(i,t,e){const r=e&&(e.rendered?e:e.lastRender);return{rendered:!1,inline:t,icon:i,lastRender:r}}function Ws(i="iconify-icon"){let t,e;try{t=window.customElements,e=window.HTMLElement}catch{return}if(!t||!e)return;const r=t.get(i);if(r)return r;const n=["icon","mode","inline","observe","width","height","rotate","flip"],o=class extends e{constructor(){super(),ht(this,"_shadowRoot"),ht(this,"_initialised",!1),ht(this,"_state"),ht(this,"_checkQueued",!1),ht(this,"_connected",!1),ht(this,"_observer",null),ht(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Ue(this);Xi(l,a),this._state=nn({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Ue(this),c=this._state;a!==c.inline&&(c.inline=a,Xi(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Ue(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}en(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),d=Ni(this);(l.attrMode!==c||Go(l.customisations,d)||!ii(this._shadowRoot))&&this._renderIcon(l.icon,d,c)}_iconChanged(l){const a=ws(l,(c,d,u)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const b={value:c,name:d,data:u};b.data?this._gotIconData(b):p.icon=b});a.data?this._gotIconData(a):this._state=nn(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=ii(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Ni(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const d=$s(l.data.body,c),u=this._state.inline;en(this._shadowRoot,this._state={rendered:!0,icon:l,inline:u,customisations:a,attrMode:c,renderedMode:d})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in o.prototype||Object.defineProperty(o.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const s=Zn();for(const l in s)o[l]=o.prototype[l]=s[l];return t.define(i,o),o}Ws()||Zn();var Ys=Object.defineProperty,Qs=Object.getOwnPropertyDescriptor,D=(i,t,e,r)=>{for(var n=r>1?void 0:r?Qs(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Ys(t,e,n),n};const er=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=Pt(),this._tooltip=Pt(),this._mouseLeave=!1,this.onClick=t=>{t.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const t=this._contextMenu;t&&(t.visible=!0)},this.mouseLeave=!0}set loading(t){if(this._loading=t,t)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=t,this.icon="eos-icons:loading";else{const{disabled:e,icon:r}=this._stateBeforeLoading;this.disabled=e,this.icon=r}}get loading(){return this._loading}set mouseLeave(t){this._mouseLeave=t,t&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:t}=this._parent,{value:e}=this._tooltip;t&&e&&kn(t,e,{placement:"bottom",middleware:[pn(10),Cn(),En(),$n({padding:5})]}).then(r=>{const{x:n,y:o}=r;Object.assign(e.style,{left:`${n}px`,top:`${o}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const t=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},t)}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const t=f`
      <div ${jt(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?f`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?f`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `;return f`
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
                  >${this.label}</bim-label
                >
              </div>
            `:null}
        ${this.tooltipTitle||this.tooltipText?t:null}
      </div>
      <slot></slot>
    `}};er.styles=E`
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
      --bim-label--c: var(--bim-ui_bg-contrast-80);
      background-color: gray;
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
  `;let H=er;D([h({type:String,reflect:!0})],H.prototype,"label",2);D([h({type:Boolean,attribute:"label-hidden",reflect:!0})],H.prototype,"labelHidden",2);D([h({type:Boolean,reflect:!0})],H.prototype,"active",2);D([h({type:Boolean,reflect:!0,attribute:"disabled"})],H.prototype,"disabled",2);D([h({type:String,reflect:!0})],H.prototype,"icon",2);D([h({type:Boolean,reflect:!0})],H.prototype,"vertical",2);D([h({type:Number,attribute:"tooltip-time",reflect:!0})],H.prototype,"tooltipTime",2);D([h({type:Boolean,attribute:"tooltip-visible",reflect:!0})],H.prototype,"tooltipVisible",2);D([h({type:String,attribute:"tooltip-title",reflect:!0})],H.prototype,"tooltipTitle",2);D([h({type:String,attribute:"tooltip-text",reflect:!0})],H.prototype,"tooltipText",2);D([h({type:Boolean,reflect:!0})],H.prototype,"loading",1);var Gs=Object.defineProperty,le=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Gs(t,e,n),n};const ir=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return f`
      <div class="parent">
        ${this.label?f`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};ir.styles=E`
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
  `;let Mt=ir;le([h({type:String,reflect:!0})],Mt.prototype,"icon");le([h({type:String,reflect:!0})],Mt.prototype,"name");le([h({type:String,reflect:!0})],Mt.prototype,"label");le([h({type:Boolean,reflect:!0})],Mt.prototype,"checked");le([h({type:Boolean,reflect:!0})],Mt.prototype,"inverted");var Js=Object.defineProperty,Rt=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Js(t,e,n),n};const nr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=Pt(),this._textInput=Pt(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const e=t.target;this.opacity=e.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:e,opacity:r}=t;this.color=e,r&&(this.opacity=r)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:e}=this._colorInput;e&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:e}=this._textInput;if(!e)return;const{value:r}=e;let n=r.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),e.value=n.slice(0,7),e.value.length===7&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return f`
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
    `}};nr.styles=E`
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
  `;let mt=nr;Rt([h({type:String,reflect:!0})],mt.prototype,"name");Rt([h({type:String,reflect:!0})],mt.prototype,"label");Rt([h({type:String,reflect:!0})],mt.prototype,"icon");Rt([h({type:Boolean,reflect:!0})],mt.prototype,"vertical");Rt([h({type:Number,reflect:!0})],mt.prototype,"opacity");Rt([h({type:String,reflect:!0})],mt.prototype,"color");const Xs=E`
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
`,Ks=E`
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
`,lt={scrollbar:Xs,globalStyles:Ks},rr=class _{static set config(t){this._config={..._._config,...t}}static get config(){return _._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=lt.globalStyles.cssText;const e=document.head.firstChild;e?document.head.insertBefore(t,e):document.head.append(t)}static defineCustomElement(t,e){customElements.get(t)||customElements.define(t,e)}static registerComponents(){_.init()}static init(){_.addGlobalStyles(),_.defineCustomElement("bim-button",H),_.defineCustomElement("bim-checkbox",Mt),_.defineCustomElement("bim-color-input",mt),_.defineCustomElement("bim-context-menu",il),_.defineCustomElement("bim-dropdown",X),_.defineCustomElement("bim-grid",vi),_.defineCustomElement("bim-icon",cl),_.defineCustomElement("bim-input",ae),_.defineCustomElement("bim-label",Ht),_.defineCustomElement("bim-number-input",L),_.defineCustomElement("bim-option",T),_.defineCustomElement("bim-panel",gt),_.defineCustomElement("bim-panel-section",Bt),_.defineCustomElement("bim-selector",Nt),_.defineCustomElement("bim-table",N),_.defineCustomElement("bim-tabs",yt),_.defineCustomElement("bim-tab",M),_.defineCustomElement("bim-table-cell",vr),_.defineCustomElement("bim-table-children",_r),_.defineCustomElement("bim-table-group",wr),_.defineCustomElement("bim-table-row",vt),_.defineCustomElement("bim-text-input",Q),_.defineCustomElement("bim-toolbar",Be),_.defineCustomElement("bim-toolbar-group",Re),_.defineCustomElement("bim-toolbar-section",Dt),_.defineCustomElement("bim-viewport",jr)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let e="";for(let r=0;r<10;r++){const n=Math.floor(Math.random()*t.length);e+=t.charAt(n)}return e}};rr._config={sectionLabelOnVerticalToolbar:!1};let Zs=rr;class or extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const r of t)this.elements.add(r);const e=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const r of e)r.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(e=>{const r=e[0];if(!r.isIntersecting)return;const n=r.target;t.unobserve(n);const o=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,s=[...this.elements][o];s&&(this.visibleElements=[...this.visibleElements,s],t.observe(s))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const e=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,r=[...this.elements][e];r&&t.observe(r)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const e of this.elements)t.unobserve(e);this.visibleElements=[],this.observeLastElement()}}static create(t,e){const r=document.createDocumentFragment();if(t.length===0)return zt(t(),r),r.firstElementChild;if(!e)throw new Error("UIComponent: Initial state is required for statefull components.");let n=e;const o=t,s=a=>(n={...n,...a},zt(o(n),r),n);s(e);const l=()=>n;return[r.firstElementChild,s,l]}}var tl=Object.defineProperty,el=Object.getOwnPropertyDescriptor,sr=(i,t,e,r)=>{for(var n=el(t,e),o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&tl(t,e,n),n},O;const gi=(O=class extends w{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(i){this._placement=i,this.updatePosition()}static removeMenus(){for(const i of O.menus)i instanceof O&&(i.visible=!1);O.dialog.close(),O.dialog.remove()}get visible(){return this._visible}set visible(i){var t;this._visible=i,i?(O.dialog.parentElement||document.body.append(O.dialog),this._previousContainer=this.parentElement,O.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,O.dialog.append(this),O.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const i=this.placement??"right",t=await kn(this._previousContainer,this,{placement:i,middleware:[pn(10),Cn(),En(),$n({padding:5})]}),{x:e,y:r}=t;this.style.left=`${e}px`,this.style.top=`${r}px`}connectedCallback(){super.connectedCallback(),O.menus.push(this)}render(){return f` <slot></slot> `}},O.styles=[lt.scrollbar,E`
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
    `],O.dialog=or.create(()=>f` <dialog
      @click=${i=>{i.target===O.dialog&&O.removeMenus()}}
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
    ></dialog>`),O.menus=[],O);sr([h({type:String,reflect:!0})],gi.prototype,"placement");sr([h({type:Boolean,reflect:!0})],gi.prototype,"visible");let il=gi;const ke=(i,t={},e=!0)=>{let r={};for(const n of i.children){const o=n,s=o.getAttribute("name")||o.getAttribute("label"),l=t[s];if(s){if("value"in o&&typeof o.value<"u"&&o.value!==null){const a=o.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;r[s]=l?l(o.value):o.value}else if(e){const a=ke(o,t);if(Object.keys(a).length===0)continue;r[s]=l?l(a):a}}else e&&(r={...r,...ke(o,t)})}return r},je=i=>i==="true"||i==="false"?i==="true":i&&!isNaN(Number(i))&&i.trim()!==""?Number(i):i,nl=[">=","<=","=",">","<","?","/","#"];function rn(i){const t=nl.find(s=>i.split(s).length===2),e=i.split(t).map(s=>s.trim()),[r,n]=e,o=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):je(n);return{key:r,condition:t,value:o}}const ni=i=>{try{const t=[],e=i.split(/&(?![^()]*\))/).map(r=>r.trim());for(const r of e){const n=!r.startsWith("(")&&!r.endsWith(")"),o=r.startsWith("(")&&r.endsWith(")");if(n){const s=rn(r);t.push(s)}if(o){const s={operator:"&",queries:r.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=rn(l);return a>0&&(c.operator="&"),c})};t.push(s)}}return t}catch{return null}},on=(i,t,e)=>{let r=!1;switch(t){case"=":r=i===e;break;case"?":r=String(i).includes(String(e));break;case"<":(typeof i=="number"||typeof e=="number")&&(r=i<e);break;case"<=":(typeof i=="number"||typeof e=="number")&&(r=i<=e);break;case">":(typeof i=="number"||typeof e=="number")&&(r=i>e);break;case">=":(typeof i=="number"||typeof e=="number")&&(r=i>=e);break;case"/":r=String(i).startsWith(String(e));break}return r};var rl=Object.defineProperty,ol=Object.getOwnPropertyDescriptor,at=(i,t,e,r)=>{for(var n=r>1?void 0:r?ol(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&rl(t,e,n),n};const lr=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?je(this.label):this.label}set value(t){this._value=t}render(){return f`
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
    `}};lr.styles=E`
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
  `;let T=lr;at([h({type:String,reflect:!0})],T.prototype,"img",2);at([h({type:String,reflect:!0})],T.prototype,"label",2);at([h({type:String,reflect:!0})],T.prototype,"icon",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checked",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checkbox",2);at([h({type:Boolean,attribute:"no-mark",reflect:!0})],T.prototype,"noMark",2);at([h({converter:{fromAttribute(i){return i&&je(i)}}})],T.prototype,"value",1);at([h({type:Boolean,reflect:!0})],T.prototype,"vertical",2);var sl=Object.defineProperty,ll=Object.getOwnPropertyDescriptor,ct=(i,t,e,r)=>{for(var n=r>1?void 0:r?ll(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&sl(t,e,n),n};const ar=class extends or{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=Pt(),this.onOptionClick=t=>{const e=t.target,r=this._value.has(e);if(!this.multiple&&!this.required&&!r)this._value=new Set([e]);else if(!this.multiple&&!this.required&&r)this._value=new Set([]);else if(!this.multiple&&this.required&&!r)this._value=new Set([e]);else if(this.multiple&&!this.required&&!r)this._value=new Set([...this._value,e]);else if(this.multiple&&!this.required&&r){const n=[...this._value].filter(o=>o!==e);this._value=new Set(n)}else if(this.multiple&&this.required&&!r)this._value=new Set([...this._value,e]);else if(this.multiple&&this.required&&r){const n=[...this._value].filter(s=>s!==e),o=new Set(n);o.size!==0&&(this._value=o)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){if(t){const{value:e}=this._contextMenu;if(!e)return;for(const r of this.elements)e.append(r);this._visible=!0}else{for(const e of this.elements)this.append(e);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const e=new Set;for(const r of t){const n=this.findOption(r);if(n&&(e.add(n),!this.multiple&&Object.keys(t).length===1))break}this._value=e,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(t=>t instanceof T&&t.checked).map(t=>t.value)}get _options(){const t=new Set([...this.elements]);for(const e of this.children)e instanceof T&&t.add(e);return[...t]}onSlotChange(t){const e=t.target.assignedElements();this.observe(e);const r=new Set;for(const n of this.elements){if(!(n instanceof T)){n.remove();continue}n.checked&&r.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=r}updateOptionsState(){for(const t of this._options)t instanceof T&&(t.checked=this._value.has(t))}findOption(t){return this._options.find(e=>e instanceof T?e.label===t||e.value===t:!1)}render(){let t,e,r;if(this._value.size===0)t="Select an option...";else if(this._value.size===1){const n=[...this._value][0];t=(n==null?void 0:n.label)||(n==null?void 0:n.value),e=n==null?void 0:n.img,r=n==null?void 0:n.icon}else t=`Multiple (${this._value.size})`;return f`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div class="input" @click=${()=>this.visible=!this.visible}>
          <bim-label
            .img=${e}
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
            ${jt(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};ar.styles=[lt.scrollbar,E`
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
    `];let X=ar;ct([h({type:String,reflect:!0})],X.prototype,"name",2);ct([h({type:String,reflect:!0})],X.prototype,"icon",2);ct([h({type:String,reflect:!0})],X.prototype,"label",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"multiple",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"required",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"vertical",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"visible",1);ct([Lt()],X.prototype,"_value",2);var al=Object.defineProperty,cr=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&al(t,e,n),n};const hr=class extends w{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(t){const e=t.split(`
`).map(r=>r.trim()).map(r=>r.split('"')[1]).filter(r=>r!==void 0).flatMap(r=>r.split(/\s+/));return[...new Set(e)].filter(r=>r!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const t=this.layouts[this.layout],e=this.getUniqueAreasFromTemplate(t.template).map(r=>{const n=t.elements[r];return n&&(n.style.gridArea=r),n}).filter(r=>!!r);this.style.gridTemplate=t.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...e)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return f`<slot></slot>`}};hr.styles=E`
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
  `;let vi=hr;cr([h({type:Boolean,reflect:!0})],vi.prototype,"floating");cr([h({type:String,reflect:!0})],vi.prototype,"layout");const ri=class extends w{render(){return f`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};ri.styles=E`
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
  `,ri.properties={icon:{type:String}};let cl=ri;var hl=Object.defineProperty,Le=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&hl(t,e,n),n};const dr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const t={};for(const e of this.children){const r=e;"value"in r?t[r.name||r.label]=r.value:"checked"in r&&(t[r.name||r.label]=r.checked)}return t}set value(t){const e=[...this.children];for(const r in t){const n=e.find(l=>{const a=l;return a.name===r||a.label===r});if(!n)continue;const o=n,s=t[r];typeof s=="boolean"?o.checked=s:o.value=s}}render(){return f`
      <div class="parent">
        ${this.label||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};dr.styles=E`
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
  `;let ae=dr;Le([h({type:String,reflect:!0})],ae.prototype,"name");Le([h({type:String,reflect:!0})],ae.prototype,"label");Le([h({type:String,reflect:!0})],ae.prototype,"icon");Le([h({type:Boolean,reflect:!0})],ae.prototype,"vertical");var dl=Object.defineProperty,ce=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&dl(t,e,n),n};const ur=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?je(this.textContent):this.textContent}render(){return f`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?f`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?f`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};ur.styles=E`
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
  `;let Ht=ur;ce([h({type:String,reflect:!0})],Ht.prototype,"img");ce([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Ht.prototype,"labelHidden");ce([h({type:String,reflect:!0})],Ht.prototype,"icon");ce([h({type:Boolean,attribute:"icon-hidden",reflect:!0})],Ht.prototype,"iconHidden");ce([h({type:Boolean,reflect:!0})],Ht.prototype,"vertical");var ul=Object.defineProperty,pl=Object.getOwnPropertyDescriptor,B=(i,t,e,r)=>{for(var n=r>1?void 0:r?pl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&ul(t,e,n),n};const pr=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=Pt(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:e}=this._input;e&&this.setValue(e.value)}setValue(t){const{value:e}=this._input;let r=t;if(r=r.replace(/[^0-9.-]/g,""),r=r.replace(/(\..*)\./g,"$1"),r.endsWith(".")||(r.lastIndexOf("-")>0&&(r=r[0]+r.substring(1).replace(/-/g,"")),r==="-"||r==="-0"))return;let n=Number(r);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,e&&(e.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:e}=t,r=this.value;let n=!1;const o=a=>{var c;n=!0;const{clientX:d}=a,u=this.step??1,p=((c=u.toString().split(".")[1])==null?void 0:c.length)||0,b=1/(this.sensitivity??1),m=(d-e)/b;if(Math.floor(Math.abs(m))!==Math.abs(m))return;const v=r+m*u;this.setValue(v.toFixed(p))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},l=()=>{document.removeEventListener("mousemove",o),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const e=r=>{r.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",e))};window.addEventListener("keydown",e)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=f`
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
    `,e=this.min??-1/0,r=this.max??1/0,n=100*(this.value-e)/(r-e),o=f`
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
    `}};pr.styles=E`
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
  `;let L=pr;B([h({type:String,reflect:!0})],L.prototype,"name",2);B([h({type:String,reflect:!0})],L.prototype,"icon",2);B([h({type:String,reflect:!0})],L.prototype,"label",2);B([h({type:String,reflect:!0})],L.prototype,"pref",2);B([h({type:Number,reflect:!0})],L.prototype,"min",2);B([h({type:Number,reflect:!0})],L.prototype,"value",1);B([h({type:Number,reflect:!0})],L.prototype,"step",2);B([h({type:Number,reflect:!0})],L.prototype,"sensitivity",2);B([h({type:Number,reflect:!0})],L.prototype,"max",2);B([h({type:String,reflect:!0})],L.prototype,"suffix",2);B([h({type:Boolean,reflect:!0})],L.prototype,"vertical",2);B([h({type:Boolean,reflect:!0})],L.prototype,"slider",2);var bl=Object.defineProperty,fl=Object.getOwnPropertyDescriptor,he=(i,t,e,r)=>{for(var n=r>1?void 0:r?fl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&bl(t,e,n),n};const br=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return ke(this,this.valueTransform)}set value(t){const e=[...this.children];for(const r in t){const n=e.find(s=>{const l=s;return l.name===r||l.label===r});if(!n)continue;const o=n;o.value=t[r]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,f`
      <div class="parent">
        ${this.label||this.name||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};br.styles=[lt.scrollbar,E`
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
    `];let gt=br;he([h({type:String,reflect:!0})],gt.prototype,"icon",2);he([h({type:String,reflect:!0})],gt.prototype,"name",2);he([h({type:String,reflect:!0})],gt.prototype,"label",2);he([h({type:Boolean,reflect:!0})],gt.prototype,"hidden",1);he([h({type:Boolean,attribute:"header-hidden",reflect:!0})],gt.prototype,"headerHidden",2);var ml=Object.defineProperty,de=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&ml(t,e,n),n};const fr=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const t=this.parentElement;let e;return t instanceof gt&&(e=t.valueTransform),Object.values(this.valueTransform).length!==0&&(e=this.valueTransform),ke(this,e)}set value(t){const e=[...this.children];for(const r in t){const n=e.find(s=>{const l=s;return l.name===r||l.label===r});if(!n)continue;const o=n;o.value=t[r]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,e=f`<svg
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
    </svg>`,n=this.collapsed?e:r,o=f`
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
    `}};fr.styles=[lt.scrollbar,E`
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
    `];let Bt=fr;de([h({type:String,reflect:!0})],Bt.prototype,"icon");de([h({type:String,reflect:!0})],Bt.prototype,"label");de([h({type:String,reflect:!0})],Bt.prototype,"name");de([h({type:Boolean,reflect:!0})],Bt.prototype,"fixed");de([h({type:Boolean,reflect:!0})],Bt.prototype,"collapsed");var gl=Object.defineProperty,ue=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&gl(t,e,n),n};const mr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const e of this.children)e instanceof T&&(e.checked=e===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const e=this.findOption(t);if(e){for(const r of this._options)r.checked=r===e;this._value=e,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const e=t.target.assignedElements();for(const r of e)r instanceof T&&(r.noMark=!0,r.removeEventListener("click",this.onOptionClick),r.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(e=>e instanceof T?e.label===t||e.value===t:!1)}firstUpdated(){const t=[...this.children].find(e=>e instanceof T&&e.checked);t&&(this._value=t)}render(){return f`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};mr.styles=E`
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
  `;let Nt=mr;ue([h({type:String,reflect:!0})],Nt.prototype,"name");ue([h({type:String,reflect:!0})],Nt.prototype,"icon");ue([h({type:String,reflect:!0})],Nt.prototype,"label");ue([h({type:Boolean,reflect:!0})],Nt.prototype,"vertical");ue([Lt()],Nt.prototype,"_value");const vl=()=>f`
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
  `,yl=()=>f`
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
  `;var _l=Object.defineProperty,xl=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&_l(t,e,n),n};const gr=class extends w{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return f`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};gr.styles=E`
    :host {
      padding: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([data-column-index="0"]:not([data-no-indentation])) {
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
  `;let vr=gr;xl([h({type:String,reflect:!0})],vr.prototype,"column");var wl=Object.defineProperty,$l=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&wl(t,e,n),n};const yr=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,e=!1){for(const r of this._groups)r.childrenHidden=typeof t>"u"?!r.childrenHidden:!t,e&&r.toggleChildren(t,e)}render(){return this._groups=[],f`
      <slot></slot>
      ${this.data.map(t=>{const e=document.createElement("bim-table-group");return this._groups.push(e),e.table=this.table,e.data=t,e})}
    `}};yr.styles=E`
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
  `;let _r=yr;$l([h({type:Array,attribute:!1})],_r.prototype,"data");var El=Object.defineProperty,Cl=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&El(t,e,n),n};const xr=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,e=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,e&&this._children.toggleGroups(t,e))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const t=this.table.getGroupIndentation(this.data)??0,e=f`
      ${this.table.noIndentation?null:f`
            <style>
              .branch-vertical {
                left: ${t+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,r=document.createDocumentFragment();zt(e,r);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${t-1+(this.table.selectableRows?2.05:.5625)}rem`);let o=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(c);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(u),o=document.createElement("div"),o.addEventListener("click",p=>{p.stopPropagation(),this.toggleChildren()}),o.classList.add("caret"),o.style.left=`${(this.table.selectableRows?1.5:.125)+t}rem`,this.childrenHidden?o.append(a):o.append(d)}const s=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&s.append(r),s.table=this.table,s.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:s}})),o&&this.data.children&&s.append(o),t!==0&&(!this.data.children||this.childrenHidden)&&n&&s.append(n);let l;if(this.data.children){l=document.createElement("bim-table-children"),this._children=l,l.table=this.table,l.data=this.data.children;const a=document.createDocumentFragment();zt(e,a),l.append(a)}return f`
      <div class="parent">${s} ${this.childrenHidden?null:l}</div>
    `}};xr.styles=E`
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
  `;let wr=xr;Cl([h({type:Boolean,attribute:"children-hidden",reflect:!0})],wr.prototype,"childrenHidden");var kl=Object.defineProperty,It=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&kl(t,e,n),n};const $r=class extends w{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.name)}get _columnWidths(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.width)}get _isSelected(){var t;return(t=this.table)==null?void 0:t.selection.has(this.data)}onSelectionChange(t){if(!this.table)return;const e=t.target;this.selected=e.value,e.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const t=this.table.getRowIndentation(this.data)??0,e=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,r=[];for(const n in e){if(this.hiddenColumns.includes(n))continue;const o=e[n];let s;if(typeof o=="string"||typeof o=="boolean"||typeof o=="number"?(s=document.createElement("bim-label"),s.textContent=String(o)):o instanceof HTMLElement?s=o:(s=document.createDocumentFragment(),zt(o,s)),!s)continue;const l=document.createElement("bim-table-cell");l.append(s),l.column=n,this._columnNames.indexOf(n)===0&&!this.isHeader&&(l.style.marginLeft=`${(this.table.noIndentation?0:t)+.75}rem`);const a=this._columnNames.indexOf(n);l.setAttribute("data-column-index",String(a)),l.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),l.toggleAttribute("data-cell-header",this.isHeader),l.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:l}})),r.push(l)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,f`
      ${!this.isHeader&&this.table.selectableRows?f`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${r}
      <slot></slot>
    `}render(){return f`${this._intersecting?this.compute():f``}`}};$r.styles=E`
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
  `;let vt=$r;It([h({type:Boolean,reflect:!0})],vt.prototype,"selected");It([h({attribute:!1})],vt.prototype,"columns");It([h({attribute:!1})],vt.prototype,"hiddenColumns");It([h({attribute:!1})],vt.prototype,"data");It([h({type:Boolean,attribute:"is-header",reflect:!0})],vt.prototype,"isHeader");It([Lt()],vt.prototype,"_intersecting");var Sl=Object.defineProperty,Al=Object.getOwnPropertyDescriptor,U=(i,t,e,r)=>{for(var n=r>1?void 0:r?Al(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Sl(t,e,n),n};const Er=class extends w{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this.loadingErrorElement=null,this._stringFilterFunction=(t,e)=>Object.values(e.data).some(r=>String(r).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,e)=>{let r=!1;const n=ni(t)??[];for(const o of n){if("queries"in o){r=!1;break}const{condition:s,value:l}=o;let{key:a}=o;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,r=Object.keys(e.data).filter(d=>d.includes(c)).map(d=>on(e.data[d],s,l)).some(d=>d)}else r=on(e.data[a],s,l);if(!r)break}return r}}set columns(t){const e=[];for(const r of t){const n=typeof r=="string"?{name:r,width:`minmax(${this.minColWidth}, 1fr)`}:r;e.push(n)}this._columns=e,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const t={};for(const e of this.columns)if(typeof e=="string")t[e]=e;else{const{name:r}=e;t[r]=r}return t}get value(){return this._filteredData}set queryString(t){this.toggleAttribute("data-processing",!0),this._queryString=t&&t.trim()!==""?t.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(t){this._data=t,this.updateFilteredData(),this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(t=>{setTimeout(()=>{t(this.data)})})}set hiddenColumns(t){this._hiddenColumns=t,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(ni(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(t){let e=!1;for(const r of t){const{children:n,data:o}=r;for(const s in o)this._columns.map(l=>typeof l=="string"?l:l.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),e=!0);if(n){const s=this.computeMissingColumns(n);s&&!e&&(e=s)}}return e}generateText(t="comma",e=this.value,r="",n=!0){const o=this._textDelimiters[t];let s="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${o}`);const a=`${l.join(o)}
`;s+=a}for(const[a,c]of e.entries()){const{data:d,children:u}=c,p=this.indentationInText?`${r}${a+1}${o}`:"",b=l.map(v=>d[v]??""),m=`${p}${b.join(o)}
`;s+=m,u&&(s+=this.generateText(t,c.children,`${r}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(t){const e={};for(const r of Object.keys(this.dataTransform)){const n=this.columns.find(o=>o.name===r);n&&n.forceDataTransform&&(r in t||(t[r]=""))}for(const r in t){const n=this.dataTransform[r];n?e[r]=n(t[r],t):e[r]=t[r]}return e}downloadData(t="BIM Table Data",e="json"){let r=null;if(e==="json"&&(r=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),e==="csv"&&(r=new File([this.csv],`${t}.csv`)),e==="tsv"&&(r=new File([this.tsv],`${t}.tsv`)),!r)return;const n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=r.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,e=this.value,r=0){for(const n of e){if(n.data===t)return r;if(n.children){const o=this.getRowIndentation(t,n.children,r+1);if(o!==null)return o}}return null}getGroupIndentation(t,e=this.value,r=0){for(const n of e){if(n===t)return r;if(n.children){const o=this.getGroupIndentation(t,n.children,r+1);if(o!==null)return o}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(t=!1){if(this._filteredData.length!==0&&!t||!this.loadFunction)return!1;this.loading=!0;try{const e=await this.loadFunction();return this.data=e,this.loading=!1,this._errorLoading=!1,!0}catch(e){return this.loading=!1,this._filteredData.length!==0||(e instanceof Error&&this.loadingErrorElement&&e.message.trim()!==""&&(this.loadingErrorElement.textContent=e.message),this._errorLoading=!0),!1}}filter(t,e=this.filterFunction??this._stringFilterFunction,r=this.data){const n=[];for(const o of r)if(e(t,o)){if(this.preserveStructureOnFilter){const s={data:o.data};if(o.children){const l=this.filter(t,e,o.children);l.length&&(s.children=l)}n.push(s)}else if(n.push({data:o.data}),o.children){const s=this.filter(t,e,o.children);n.push(...s)}}else if(o.children){const s=this.filter(t,e,o.children);this.preserveStructureOnFilter&&s.length?n.push({data:o.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return vl();if(this._errorLoading)return f`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return f`<slot name="missing-data"></slot>`;const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const e=document.createElement("bim-table-children");return e.table=this,e.data=this.value,e.style.gridArea="Body",e.style.backgroundColor="transparent",f`
      <div class="parent">
        ${this.headersHidden?null:t} ${yl()}
        <div style="overflow-x: hidden; grid-area: Body">${e}</div>
      </div>
    `}};Er.styles=[lt.scrollbar,E`
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
    `];let N=Er;U([Lt()],N.prototype,"_filteredData",2);U([h({type:Boolean,attribute:"headers-hidden",reflect:!0})],N.prototype,"headersHidden",2);U([h({type:String,attribute:"min-col-width",reflect:!0})],N.prototype,"minColWidth",2);U([h({type:Array,attribute:!1})],N.prototype,"columns",1);U([h({type:Array,attribute:!1})],N.prototype,"data",1);U([h({type:Boolean,reflect:!0})],N.prototype,"expanded",2);U([h({type:Boolean,reflect:!0,attribute:"selectable-rows"})],N.prototype,"selectableRows",2);U([h({attribute:!1})],N.prototype,"selection",2);U([h({type:Boolean,attribute:"no-indentation",reflect:!0})],N.prototype,"noIndentation",2);U([h({type:Boolean,reflect:!0})],N.prototype,"loading",2);U([Lt()],N.prototype,"_errorLoading",2);var Ol=Object.defineProperty,Tl=Object.getOwnPropertyDescriptor,Me=(i,t,e,r)=>{for(var n=r>1?void 0:r?Tl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Ol(t,e,n),n};const Cr=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const e=[...t.children].indexOf(this);this.name=`${this._defaultName}${e}`}}render(){return f` <slot></slot> `}};Cr.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let M=Cr;Me([h({type:String,reflect:!0})],M.prototype,"name",2);Me([h({type:String,reflect:!0})],M.prototype,"label",2);Me([h({type:String,reflect:!0})],M.prototype,"icon",2);Me([h({type:Boolean,reflect:!0})],M.prototype,"hidden",1);var zl=Object.defineProperty,Pl=Object.getOwnPropertyDescriptor,Ft=(i,t,e,r)=>{for(var n=r>1?void 0:r?Pl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&zl(t,e,n),n};const kr=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=t=>{const e=t.target;e instanceof M&&!e.hidden&&(e.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=e.name,e.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const e=[...this.children],r=e.find(n=>n instanceof M&&n.name===t);for(const n of e){if(!(n instanceof M))continue;n.hidden=r!==n;const o=this.getTabSwitcher(n.name);o&&o.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(e=>e.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof M))continue;const e=document.createElement("div");e.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),e.setAttribute("data-name",t.name),e.className="switcher";const r=document.createElement("bim-label");r.textContent=t.label??"",r.icon=t.icon,e.append(r),this._switchers.push(e)}}onSlotChange(t){this.createSwitchers();const e=t.target.assignedElements(),r=e.find(n=>n instanceof M?this.tab?n.name===this.tab:!n.hidden:!1);r&&r instanceof M&&(this.tab=r.name);for(const n of e){if(!(n instanceof M)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),r!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return f`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};kr.styles=[lt.scrollbar,E`
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
    `];let yt=kr;Ft([Lt()],yt.prototype,"_switchers",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"bottom",2);Ft([h({type:Boolean,attribute:"switchers-hidden",reflect:!0})],yt.prototype,"switchersHidden",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"floating",2);Ft([h({type:String,reflect:!0})],yt.prototype,"tab",1);Ft([h({type:Boolean,attribute:"switchers-full",reflect:!0})],yt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const sn=i=>i??A;var jl=Object.defineProperty,Ll=Object.getOwnPropertyDescriptor,K=(i,t,e,r)=>{for(var n=r>1?void 0:r?Ll(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&jl(t,e,n),n};const Sr=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return ni(this.value)}onInputChange(t){t.stopPropagation();const e=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=e.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("input");e==null||e.focus()})}render(){return f`
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
              placeholder=${sn(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:f` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${sn(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};Sr.styles=[lt.scrollbar,E`
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
    `];let Q=Sr;K([h({type:String,reflect:!0})],Q.prototype,"icon",2);K([h({type:String,reflect:!0})],Q.prototype,"label",2);K([h({type:String,reflect:!0})],Q.prototype,"name",2);K([h({type:String,reflect:!0})],Q.prototype,"placeholder",2);K([h({type:String,reflect:!0})],Q.prototype,"value",2);K([h({type:Boolean,reflect:!0})],Q.prototype,"vertical",2);K([h({type:Number,reflect:!0})],Q.prototype,"debounce",2);K([h({type:Number,reflect:!0})],Q.prototype,"rows",2);K([h({type:String,reflect:!0})],Q.prototype,"type",1);var Ml=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,Ar=(i,t,e,r)=>{for(var n=r>1?void 0:r?Rl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Ml(t,e,n),n};const Or=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const e of t)this.vertical?e.setAttribute("label-hidden",""):e.removeAttribute("label-hidden")}render(){return f`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};Or.styles=E`
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
  `;let Re=Or;Ar([h({type:Number,reflect:!0})],Re.prototype,"rows",2);Ar([h({type:Boolean,reflect:!0})],Re.prototype,"vertical",1);var Hl=Object.defineProperty,Bl=Object.getOwnPropertyDescriptor,He=(i,t,e,r)=>{for(var n=r>1?void 0:r?Bl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Hl(t,e,n),n};const Tr=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const e of t)e instanceof Re&&(e.vertical=this.vertical),e.toggleAttribute("label-hidden",this.vertical)}render(){return f`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Tr.styles=E`
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
  `;let Dt=Tr;He([h({type:String,reflect:!0})],Dt.prototype,"label",2);He([h({type:String,reflect:!0})],Dt.prototype,"icon",2);He([h({type:Boolean,reflect:!0})],Dt.prototype,"vertical",1);He([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Dt.prototype,"labelHidden",1);var Nl=Object.defineProperty,Il=Object.getOwnPropertyDescriptor,yi=(i,t,e,r)=>{for(var n=r>1?void 0:r?Il(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Nl(t,e,n),n};const zr=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const e of t)e instanceof Dt&&(e.labelHidden=this.vertical&&!Zs.config.sectionLabelOnVerticalToolbar,e.vertical=this.vertical)}render(){return f`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};zr.styles=E`
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
  `;let Be=zr;yi([h({type:String,reflect:!0})],Be.prototype,"icon",2);yi([h({type:Boolean,attribute:"labels-hidden",reflect:!0})],Be.prototype,"labelsHidden",2);yi([h({type:Boolean,reflect:!0})],Be.prototype,"vertical",1);var Fl=Object.defineProperty,Dl=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Fl(t,e,n),n};const Pr=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return f`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Pr.styles=E`
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
  `;let jr=Pr;Dl([h({type:String,reflect:!0})],jr.prototype,"name");export{or as R,Zs as d,f as m};
