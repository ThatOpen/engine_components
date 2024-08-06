var Pr=Object.defineProperty,jr=(i,t,e)=>t in i?Pr(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,st=(i,t,e)=>(jr(i,typeof t!="symbol"?t+"":t,e),e);const $t=Math.min,V=Math.max,ge=Math.round,Z=i=>({x:i,y:i}),Lr={left:"right",right:"left",bottom:"top",top:"bottom"},Mr={start:"end",end:"start"};function yi(i,t,e){return V(i,$t(t,e))}function Zt(i,t){return typeof i=="function"?i(t):i}function q(i){return i.split("-")[0]}function ke(i){return i.split("-")[1]}function on(i){return i==="x"?"y":"x"}function sn(i){return i==="y"?"height":"width"}function ht(i){return["top","bottom"].includes(q(i))?"y":"x"}function ln(i){return on(ht(i))}function Rr(i,t,e){e===void 0&&(e=!1);const r=ke(i),n=ln(i),o=sn(n);let s=n==="x"?r===(e?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[o]>t.floating[o]&&(s=ve(s)),[s,ve(s)]}function Hr(i){const t=ve(i);return[qe(i),t,qe(t)]}function qe(i){return i.replace(/start|end/g,t=>Mr[t])}function Br(i,t,e){const r=["left","right"],n=["right","left"],o=["top","bottom"],s=["bottom","top"];switch(i){case"top":case"bottom":return e?t?n:r:t?r:n;case"left":case"right":return t?o:s;default:return[]}}function Nr(i,t,e,r){const n=ke(i);let o=Br(q(i),e==="start",r);return n&&(o=o.map(s=>s+"-"+n),t&&(o=o.concat(o.map(qe)))),o}function ve(i){return i.replace(/left|right|bottom|top/g,t=>Lr[t])}function Ir(i){return{top:0,right:0,bottom:0,left:0,...i}}function an(i){return typeof i!="number"?Ir(i):{top:i,right:i,bottom:i,left:i}}function Et(i){const{x:t,y:e,width:r,height:n}=i;return{width:r,height:n,top:e,left:t,right:t+r,bottom:e+n,x:t,y:e}}function _i(i,t,e){let{reference:r,floating:n}=i;const o=ht(t),s=ln(t),l=sn(s),a=q(t),c=o==="y",h=r.x+r.width/2-n.width/2,d=r.y+r.height/2-n.height/2,p=r[l]/2-n[l]/2;let b;switch(a){case"top":b={x:h,y:r.y-n.height};break;case"bottom":b={x:h,y:r.y+r.height};break;case"right":b={x:r.x+r.width,y:d};break;case"left":b={x:r.x-n.width,y:d};break;default:b={x:r.x,y:r.y}}switch(ke(t)){case"start":b[s]-=p*(e&&c?-1:1);break;case"end":b[s]+=p*(e&&c?-1:1);break}return b}const Fr=async(i,t,e)=>{const{placement:r="bottom",strategy:n="absolute",middleware:o=[],platform:s}=e,l=o.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:i,floating:t,strategy:n}),{x:h,y:d}=_i(c,r,a),p=r,b={},f=0;for(let v=0;v<l.length;v++){const{name:g,fn:k}=l[v],{x:C,y:x,data:$,reset:T}=await k({x:h,y:d,initialPlacement:r,placement:p,strategy:n,middlewareData:b,rects:c,platform:s,elements:{reference:i,floating:t}});h=C??h,d=x??d,b={...b,[g]:{...b[g],...$}},T&&f<=50&&(f++,typeof T=="object"&&(T.placement&&(p=T.placement),T.rects&&(c=T.rects===!0?await s.getElementRects({reference:i,floating:t,strategy:n}):T.rects),{x:h,y:d}=_i(c,p,a)),v=-1)}return{x:h,y:d,placement:p,strategy:n,middlewareData:b}};async function oi(i,t){var e;t===void 0&&(t={});const{x:r,y:n,platform:o,rects:s,elements:l,strategy:a}=i,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:p=!1,padding:b=0}=Zt(t,i),f=an(b),v=l[p?d==="floating"?"reference":"floating":d],g=Et(await o.getClippingRect({element:(e=await(o.isElement==null?void 0:o.isElement(v)))==null||e?v:v.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(l.floating)),boundary:c,rootBoundary:h,strategy:a})),k=d==="floating"?{x:r,y:n,width:s.floating.width,height:s.floating.height}:s.reference,C=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l.floating)),x=await(o.isElement==null?void 0:o.isElement(C))?await(o.getScale==null?void 0:o.getScale(C))||{x:1,y:1}:{x:1,y:1},$=Et(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:k,offsetParent:C,strategy:a}):k);return{top:(g.top-$.top+f.top)/x.y,bottom:($.bottom-g.bottom+f.bottom)/x.y,left:(g.left-$.left+f.left)/x.x,right:($.right-g.right+f.right)/x.x}}const Dr=function(i){return i===void 0&&(i={}),{name:"flip",options:i,async fn(t){var e,r;const{placement:n,middlewareData:o,rects:s,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:h=!0,crossAxis:d=!0,fallbackPlacements:p,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:f="none",flipAlignment:v=!0,...g}=Zt(i,t);if((e=o.arrow)!=null&&e.alignmentOffset)return{};const k=q(n),C=ht(l),x=q(l)===l,$=await(a.isRTL==null?void 0:a.isRTL(c.floating)),T=p||(x||!v?[ve(l)]:Hr(l)),y=f!=="none";!p&&y&&T.push(...Nr(l,v,f,$));const z=[l,...T],H=await oi(t,g),B=[];let S=((r=o.flip)==null?void 0:r.overflows)||[];if(h&&B.push(H[k]),d){const I=Rr(n,s,$);B.push(H[I[0]],H[I[1]])}if(S=[...S,{placement:n,overflows:B}],!B.every(I=>I<=0)){var ft,It;const I=(((ft=o.flip)==null?void 0:ft.index)||0)+1,vt=z[I];if(vt)return{data:{index:I,overflows:S},reset:{placement:vt}};let G=(It=S.filter(J=>J.overflows[0]<=0).sort((J,F)=>J.overflows[1]-F.overflows[1])[0])==null?void 0:It.placement;if(!G)switch(b){case"bestFit":{var gt;const J=(gt=S.filter(F=>{if(y){const X=ht(F.placement);return X===C||X==="y"}return!0}).map(F=>[F.placement,F.overflows.filter(X=>X>0).reduce((X,zr)=>X+zr,0)]).sort((F,X)=>F[1]-X[1])[0])==null?void 0:gt[0];J&&(G=J);break}case"initialPlacement":G=l;break}if(n!==G)return{reset:{placement:G}}}return{}}}};function cn(i){const t=$t(...i.map(o=>o.left)),e=$t(...i.map(o=>o.top)),r=V(...i.map(o=>o.right)),n=V(...i.map(o=>o.bottom));return{x:t,y:e,width:r-t,height:n-e}}function Ur(i){const t=i.slice().sort((n,o)=>n.y-o.y),e=[];let r=null;for(let n=0;n<t.length;n++){const o=t[n];!r||o.y-r.y>r.height/2?e.push([o]):e[e.length-1].push(o),r=o}return e.map(n=>Et(cn(n)))}const Vr=function(i){return i===void 0&&(i={}),{name:"inline",options:i,async fn(t){const{placement:e,elements:r,rects:n,platform:o,strategy:s}=t,{padding:l=2,x:a,y:c}=Zt(i,t),h=Array.from(await(o.getClientRects==null?void 0:o.getClientRects(r.reference))||[]),d=Ur(h),p=Et(cn(h)),b=an(l);function f(){if(d.length===2&&d[0].left>d[1].right&&a!=null&&c!=null)return d.find(g=>a>g.left-b.left&&a<g.right+b.right&&c>g.top-b.top&&c<g.bottom+b.bottom)||p;if(d.length>=2){if(ht(e)==="y"){const S=d[0],ft=d[d.length-1],It=q(e)==="top",gt=S.top,I=ft.bottom,vt=It?S.left:ft.left,G=It?S.right:ft.right,J=G-vt,F=I-gt;return{top:gt,bottom:I,left:vt,right:G,width:J,height:F,x:vt,y:gt}}const g=q(e)==="left",k=V(...d.map(S=>S.right)),C=$t(...d.map(S=>S.left)),x=d.filter(S=>g?S.left===C:S.right===k),$=x[0].top,T=x[x.length-1].bottom,y=C,z=k,H=z-y,B=T-$;return{top:$,bottom:T,left:y,right:z,width:H,height:B,x:y,y:$}}return p}const v=await o.getElementRects({reference:{getBoundingClientRect:f},floating:r.floating,strategy:s});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function qr(i,t){const{placement:e,platform:r,elements:n}=i,o=await(r.isRTL==null?void 0:r.isRTL(n.floating)),s=q(e),l=ke(e),a=ht(e)==="y",c=["left","top"].includes(s)?-1:1,h=o&&a?-1:1,d=Zt(t,i);let{mainAxis:p,crossAxis:b,alignmentAxis:f}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return l&&typeof f=="number"&&(b=l==="end"?f*-1:f),a?{x:b*h,y:p*c}:{x:p*c,y:b*h}}const hn=function(i){return{name:"offset",options:i,async fn(t){var e,r;const{x:n,y:o,placement:s,middlewareData:l}=t,a=await qr(t,i);return s===((e=l.offset)==null?void 0:e.placement)&&(r=l.arrow)!=null&&r.alignmentOffset?{}:{x:n+a.x,y:o+a.y,data:{...a,placement:s}}}}},Wr=function(i){return i===void 0&&(i={}),{name:"shift",options:i,async fn(t){const{x:e,y:r,placement:n}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:l={fn:g=>{let{x:k,y:C}=g;return{x:k,y:C}}},...a}=Zt(i,t),c={x:e,y:r},h=await oi(t,a),d=ht(q(n)),p=on(d);let b=c[p],f=c[d];if(o){const g=p==="y"?"top":"left",k=p==="y"?"bottom":"right",C=b+h[g],x=b-h[k];b=yi(C,b,x)}if(s){const g=d==="y"?"top":"left",k=d==="y"?"bottom":"right",C=f+h[g],x=f-h[k];f=yi(C,f,x)}const v=l.fn({...t,[p]:b,[d]:f});return{...v,data:{x:v.x-e,y:v.y-r}}}}};function tt(i){return un(i)?(i.nodeName||"").toLowerCase():"#document"}function P(i){var t;return(i==null||(t=i.ownerDocument)==null?void 0:t.defaultView)||window}function it(i){var t;return(t=(un(i)?i.ownerDocument:i.document)||window.document)==null?void 0:t.documentElement}function un(i){return i instanceof Node||i instanceof P(i).Node}function W(i){return i instanceof Element||i instanceof P(i).Element}function D(i){return i instanceof HTMLElement||i instanceof P(i).HTMLElement}function xi(i){return typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof P(i).ShadowRoot}function te(i){const{overflow:t,overflowX:e,overflowY:r,display:n}=M(i);return/auto|scroll|overlay|hidden|clip/.test(t+r+e)&&!["inline","contents"].includes(n)}function Yr(i){return["table","td","th"].includes(tt(i))}function Qr(i){return[":popover-open",":modal"].some(t=>{try{return i.matches(t)}catch{return!1}})}function si(i){const t=li(),e=M(i);return e.transform!=="none"||e.perspective!=="none"||(e.containerType?e.containerType!=="normal":!1)||!t&&(e.backdropFilter?e.backdropFilter!=="none":!1)||!t&&(e.filter?e.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(e.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(e.contain||"").includes(r))}function Gr(i){let t=Ct(i);for(;D(t)&&!Ae(t);){if(Qr(t))return null;if(si(t))return t;t=Ct(t)}return null}function li(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Ae(i){return["html","body","#document"].includes(tt(i))}function M(i){return P(i).getComputedStyle(i)}function Oe(i){return W(i)?{scrollLeft:i.scrollLeft,scrollTop:i.scrollTop}:{scrollLeft:i.pageXOffset,scrollTop:i.pageYOffset}}function Ct(i){if(tt(i)==="html")return i;const t=i.assignedSlot||i.parentNode||xi(i)&&i.host||it(i);return xi(t)?t.host:t}function dn(i){const t=Ct(i);return Ae(t)?i.ownerDocument?i.ownerDocument.body:i.body:D(t)&&te(t)?t:dn(t)}function We(i,t,e){var r;t===void 0&&(t=[]),e===void 0&&(e=!0);const n=dn(i),o=n===((r=i.ownerDocument)==null?void 0:r.body),s=P(n);return o?t.concat(s,s.visualViewport||[],te(n)?n:[],s.frameElement&&e?We(s.frameElement):[]):t.concat(n,We(n,[],e))}function pn(i){const t=M(i);let e=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const n=D(i),o=n?i.offsetWidth:e,s=n?i.offsetHeight:r,l=ge(e)!==o||ge(r)!==s;return l&&(e=o,r=s),{width:e,height:r,$:l}}function bn(i){return W(i)?i:i.contextElement}function _t(i){const t=bn(i);if(!D(t))return Z(1);const e=t.getBoundingClientRect(),{width:r,height:n,$:o}=pn(t);let s=(o?ge(e.width):e.width)/r,l=(o?ge(e.height):e.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const Jr=Z(0);function mn(i){const t=P(i);return!li()||!t.visualViewport?Jr:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Xr(i,t,e){return t===void 0&&(t=!1),!e||t&&e!==P(i)?!1:t}function Wt(i,t,e,r){t===void 0&&(t=!1),e===void 0&&(e=!1);const n=i.getBoundingClientRect(),o=bn(i);let s=Z(1);t&&(r?W(r)&&(s=_t(r)):s=_t(i));const l=Xr(o,e,r)?mn(o):Z(0);let a=(n.left+l.x)/s.x,c=(n.top+l.y)/s.y,h=n.width/s.x,d=n.height/s.y;if(o){const p=P(o),b=r&&W(r)?P(r):r;let f=p,v=f.frameElement;for(;v&&r&&b!==f;){const g=_t(v),k=v.getBoundingClientRect(),C=M(v),x=k.left+(v.clientLeft+parseFloat(C.paddingLeft))*g.x,$=k.top+(v.clientTop+parseFloat(C.paddingTop))*g.y;a*=g.x,c*=g.y,h*=g.x,d*=g.y,a+=x,c+=$,f=P(v),v=f.frameElement}}return Et({width:h,height:d,x:a,y:c})}const Kr=[":popover-open",":modal"];function fn(i){return Kr.some(t=>{try{return i.matches(t)}catch{return!1}})}function Zr(i){let{elements:t,rect:e,offsetParent:r,strategy:n}=i;const o=n==="fixed",s=it(r),l=t?fn(t.floating):!1;if(r===s||l&&o)return e;let a={scrollLeft:0,scrollTop:0},c=Z(1);const h=Z(0),d=D(r);if((d||!d&&!o)&&((tt(r)!=="body"||te(s))&&(a=Oe(r)),D(r))){const p=Wt(r);c=_t(r),h.x=p.x+r.clientLeft,h.y=p.y+r.clientTop}return{width:e.width*c.x,height:e.height*c.y,x:e.x*c.x-a.scrollLeft*c.x+h.x,y:e.y*c.y-a.scrollTop*c.y+h.y}}function to(i){return Array.from(i.getClientRects())}function gn(i){return Wt(it(i)).left+Oe(i).scrollLeft}function eo(i){const t=it(i),e=Oe(i),r=i.ownerDocument.body,n=V(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),o=V(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-e.scrollLeft+gn(i);const l=-e.scrollTop;return M(r).direction==="rtl"&&(s+=V(t.clientWidth,r.clientWidth)-n),{width:n,height:o,x:s,y:l}}function io(i,t){const e=P(i),r=it(i),n=e.visualViewport;let o=r.clientWidth,s=r.clientHeight,l=0,a=0;if(n){o=n.width,s=n.height;const c=li();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:o,height:s,x:l,y:a}}function no(i,t){const e=Wt(i,!0,t==="fixed"),r=e.top+i.clientTop,n=e.left+i.clientLeft,o=D(i)?_t(i):Z(1),s=i.clientWidth*o.x,l=i.clientHeight*o.y,a=n*o.x,c=r*o.y;return{width:s,height:l,x:a,y:c}}function wi(i,t,e){let r;if(t==="viewport")r=io(i,e);else if(t==="document")r=eo(it(i));else if(W(t))r=no(t,e);else{const n=mn(i);r={...t,x:t.x-n.x,y:t.y-n.y}}return Et(r)}function vn(i,t){const e=Ct(i);return e===t||!W(e)||Ae(e)?!1:M(e).position==="fixed"||vn(e,t)}function ro(i,t){const e=t.get(i);if(e)return e;let r=We(i,[],!1).filter(l=>W(l)&&tt(l)!=="body"),n=null;const o=M(i).position==="fixed";let s=o?Ct(i):i;for(;W(s)&&!Ae(s);){const l=M(s),a=si(s);!a&&l.position==="fixed"&&(n=null),(o?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||te(s)&&!a&&vn(i,s))?r=r.filter(c=>c!==s):n=l,s=Ct(s)}return t.set(i,r),r}function oo(i){let{element:t,boundary:e,rootBoundary:r,strategy:n}=i;const o=[...e==="clippingAncestors"?ro(t,this._c):[].concat(e),r],s=o[0],l=o.reduce((a,c)=>{const h=wi(t,c,n);return a.top=V(h.top,a.top),a.right=$t(h.right,a.right),a.bottom=$t(h.bottom,a.bottom),a.left=V(h.left,a.left),a},wi(t,s,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function so(i){const{width:t,height:e}=pn(i);return{width:t,height:e}}function lo(i,t,e){const r=D(t),n=it(t),o=e==="fixed",s=Wt(i,!0,o,t);let l={scrollLeft:0,scrollTop:0};const a=Z(0);if(r||!r&&!o)if((tt(t)!=="body"||te(n))&&(l=Oe(t)),r){const d=Wt(t,!0,o,t);a.x=d.x+t.clientLeft,a.y=d.y+t.clientTop}else n&&(a.x=gn(n));const c=s.left+l.scrollLeft-a.x,h=s.top+l.scrollTop-a.y;return{x:c,y:h,width:s.width,height:s.height}}function $i(i,t){return!D(i)||M(i).position==="fixed"?null:t?t(i):i.offsetParent}function yn(i,t){const e=P(i);if(!D(i)||fn(i))return e;let r=$i(i,t);for(;r&&Yr(r)&&M(r).position==="static";)r=$i(r,t);return r&&(tt(r)==="html"||tt(r)==="body"&&M(r).position==="static"&&!si(r))?e:r||Gr(i)||e}const ao=async function(i){const t=this.getOffsetParent||yn,e=this.getDimensions;return{reference:lo(i.reference,await t(i.floating),i.strategy),floating:{x:0,y:0,...await e(i.floating)}}};function co(i){return M(i).direction==="rtl"}const ho={convertOffsetParentRelativeRectToViewportRelativeRect:Zr,getDocumentElement:it,getClippingRect:oo,getOffsetParent:yn,getElementRects:ao,getClientRects:to,getDimensions:so,getScale:_t,isElement:W,isRTL:co},_n=Wr,xn=Dr,wn=Vr,$n=(i,t,e)=>{const r=new Map,n={platform:ho,...e},o={...n.platform,_c:r};return Fr(i,t,{...n,platform:o})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,ai=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ci=Symbol(),Ei=new WeakMap;let En=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==ci)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o;const t=this.t;if(ai&&i===void 0){const e=t!==void 0&&t.length===1;e&&(i=Ei.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&Ei.set(t,i))}return i}toString(){return this.cssText}};const uo=i=>new En(typeof i=="string"?i:i+"",void 0,ci),E=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,n,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new En(e,i,ci)},po=(i,t)=>{if(ai)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),n=me.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=e.cssText,i.appendChild(r)}},Ci=ai?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return uo(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:bo,defineProperty:mo,getOwnPropertyDescriptor:fo,getOwnPropertyNames:go,getOwnPropertySymbols:vo,getPrototypeOf:yo}=Object,St=globalThis,Si=St.trustedTypes,_o=Si?Si.emptyScript:"",ki=St.reactiveElementPolyfillSupport,Dt=(i,t)=>i,ye={toAttribute(i,t){switch(t){case Boolean:i=i?_o:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},hi=(i,t)=>!bo(i,t),Ai={attribute:!0,type:String,converter:ye,reflect:!1,hasChanged:hi};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),St.litPropertyMetadata??(St.litPropertyMetadata=new WeakMap);class yt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ai){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(t,r,e);n!==void 0&&mo(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){const{get:n,set:o}=fo(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get(){return n==null?void 0:n.call(this)},set(s){const l=n==null?void 0:n.call(this);o.call(this,s),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ai}static _$Ei(){if(this.hasOwnProperty(Dt("elementProperties")))return;const t=yo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Dt("properties"))){const e=this.properties,r=[...go(e),...vo(e)];for(const n of r)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,n]of e)this.elementProperties.set(r,n)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const n=this._$Eu(e,r);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const n of r)e.unshift(Ci(n))}else t!==void 0&&e.push(Ci(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return po(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const n=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,n);if(o!==void 0&&n.reflect===!0){const s=(((r=n.converter)==null?void 0:r.toAttribute)!==void 0?n.converter:ye).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){var r;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const s=n.getPropertyOptions(o),l=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)==null?void 0:r.fromAttribute)!==void 0?s.converter:ye;this._$Em=o,this[o]=l.fromAttribute(e,s.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??hi)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,s]of n)s.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],s)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(r)):this._$EU()}catch(n){throw e=!1,this._$EU(),n}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var n;return(n=r.hostUpdated)==null?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}yt.elementStyles=[],yt.shadowRootOptions={mode:"open"},yt[Dt("elementProperties")]=new Map,yt[Dt("finalized")]=new Map,ki==null||ki({ReactiveElement:yt}),(St.reactiveElementVersions??(St.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _e=globalThis,xe=_e.trustedTypes,Oi=xe?xe.createPolicy("lit-html",{createHTML:i=>i}):void 0,Cn="$lit$",K=`lit$${Math.random().toFixed(9).slice(2)}$`,Sn="?"+K,xo=`<${Sn}>`,ut=document,Yt=()=>ut.createComment(""),Qt=i=>i===null||typeof i!="object"&&typeof i!="function",kn=Array.isArray,wo=i=>kn(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ne=`[ 	
\f\r]`,Ft=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ti=/-->/g,zi=/>/g,lt=RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pi=/'/g,ji=/"/g,An=/^(?:script|style|textarea|title)$/i,$o=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=$o(1),kt=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Li=new WeakMap,at=ut.createTreeWalker(ut,129);function On(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oi!==void 0?Oi.createHTML(t):t}const Eo=(i,t)=>{const e=i.length-1,r=[];let n,o=t===2?"<svg>":"",s=Ft;for(let l=0;l<e;l++){const a=i[l];let c,h,d=-1,p=0;for(;p<a.length&&(s.lastIndex=p,h=s.exec(a),h!==null);)p=s.lastIndex,s===Ft?h[1]==="!--"?s=Ti:h[1]!==void 0?s=zi:h[2]!==void 0?(An.test(h[2])&&(n=RegExp("</"+h[2],"g")),s=lt):h[3]!==void 0&&(s=lt):s===lt?h[0]===">"?(s=n??Ft,d=-1):h[1]===void 0?d=-2:(d=s.lastIndex-h[2].length,c=h[1],s=h[3]===void 0?lt:h[3]==='"'?ji:Pi):s===ji||s===Pi?s=lt:s===Ti||s===zi?s=Ft:(s=lt,n=void 0);const b=s===lt&&i[l+1].startsWith("/>")?" ":"";o+=s===Ft?a+xo:d>=0?(r.push(c),a.slice(0,d)+Cn+a.slice(d)+K+b):a+K+(d===-2?l:b)}return[On(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),r]};class Gt{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let o=0,s=0;const l=t.length-1,a=this.parts,[c,h]=Eo(t,e);if(this.el=Gt.createElement(c,r),at.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=at.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const d of n.getAttributeNames())if(d.endsWith(Cn)){const p=h[s++],b=n.getAttribute(d).split(K),f=/([.?@])?(.*)/.exec(p);a.push({type:1,index:o,name:f[2],strings:b,ctor:f[1]==="."?So:f[1]==="?"?ko:f[1]==="@"?Ao:Te}),n.removeAttribute(d)}else d.startsWith(K)&&(a.push({type:6,index:o}),n.removeAttribute(d));if(An.test(n.tagName)){const d=n.textContent.split(K),p=d.length-1;if(p>0){n.textContent=xe?xe.emptyScript:"";for(let b=0;b<p;b++)n.append(d[b],Yt()),at.nextNode(),a.push({type:2,index:++o});n.append(d[p],Yt())}}}else if(n.nodeType===8)if(n.data===Sn)a.push({type:2,index:o});else{let d=-1;for(;(d=n.data.indexOf(K,d+1))!==-1;)a.push({type:7,index:o}),d+=K.length-1}o++}}static createElement(t,e){const r=ut.createElement("template");return r.innerHTML=t,r}}function At(i,t,e=i,r){var n,o;if(t===kt)return t;let s=r!==void 0?(n=e._$Co)==null?void 0:n[r]:e._$Cl;const l=Qt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==l&&((o=s==null?void 0:s._$AO)==null||o.call(s,!1),l===void 0?s=void 0:(s=new l(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=At(i,s._$AS(i,t.values),s,r)),t}class Co{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,n=((t==null?void 0:t.creationScope)??ut).importNode(e,!0);at.currentNode=n;let o=at.nextNode(),s=0,l=0,a=r[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new ee(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new Oo(o,this,t)),this._$AV.push(c),a=r[++l]}s!==(a==null?void 0:a.index)&&(o=at.nextNode(),s++)}return at.currentNode=ut,n}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class ee{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=At(this,t,e),Qt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==kt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):wo(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==A&&Qt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ut.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Gt.createElement(On(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(r);else{const s=new Co(o,this),l=s.u(this.options);s.p(r),this.T(l),this._$AH=s}}_$AC(t){let e=Li.get(t.strings);return e===void 0&&Li.set(t.strings,e=new Gt(t)),e}k(t){kn(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,n=0;for(const o of t)n===e.length?e.push(r=new ee(this.S(Yt()),this.S(Yt()),this,this.options)):r=e[n],r._$AI(o),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=A}_$AI(t,e=this,r,n){const o=this.strings;let s=!1;if(o===void 0)t=At(this,t,e,0),s=!Qt(t)||t!==this._$AH&&t!==kt,s&&(this._$AH=t);else{const l=t;let a,c;for(t=o[0],a=0;a<o.length-1;a++)c=At(this,l[r+a],e,a),c===kt&&(c=this._$AH[a]),s||(s=!Qt(c)||c!==this._$AH[a]),c===A?t=A:t!==A&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class So extends Te{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class ko extends Te{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class Ao extends Te{constructor(t,e,r,n,o){super(t,e,r,n,o),this.type=5}_$AI(t,e=this){if((t=At(this,t,e,0)??A)===kt)return;const r=this._$AH,n=t===A&&r!==A||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==A&&(r===A||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Oo{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){At(this,t)}}const Mi=_e.litHtmlPolyfillSupport;Mi==null||Mi(Gt,ee),(_e.litHtmlVersions??(_e.litHtmlVersions=[])).push("3.1.4");const Ot=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let n=r._$litPart$;if(n===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=n=new ee(t.insertBefore(Yt(),o),o,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let w=class extends yt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const t=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=t.firstChild),t}update(i){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Ot(t,this.renderRoot,this.renderOptions)}connectedCallback(){var i;super.connectedCallback(),(i=this._$Do)==null||i.setConnected(!0)}disconnectedCallback(){var i;super.disconnectedCallback(),(i=this._$Do)==null||i.setConnected(!1)}render(){return kt}};var Ri;w._$litElement$=!0,w.finalized=!0,(Ri=globalThis.litElementHydrateSupport)==null||Ri.call(globalThis,{LitElement:w});const Hi=globalThis.litElementPolyfillSupport;Hi==null||Hi({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.6");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const To={attribute:!0,type:String,converter:ye,reflect:!1,hasChanged:hi},zo=(i=To,t,e)=>{const{kind:r,metadata:n}=e;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(e.name,i),r==="accessor"){const{name:s}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(s,a,i)},init(l){return l!==void 0&&this.P(s,void 0,i),l}}}if(r==="setter"){const{name:s}=e;return function(l){const a=this[s];t.call(this,l),this.requestUpdate(s,a,i)}}throw Error("Unsupported decorator location: "+r)};function u(i){return(t,e)=>typeof e=="object"?zo(i,t,e):((r,n,o)=>{const s=n.hasOwnProperty(o);return n.constructor.createProperty(o,s?{...r,wrapped:!0}:r),s?Object.getOwnPropertyDescriptor(n,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ie(i){return u({...i,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Po=i=>i.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jo={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Lo=i=>(...t)=>({_$litDirective$:i,values:t});let Mo=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,t,e){this._$Ct=i,this._$AM=t,this._$Ci=e}_$AS(i,t){return this.update(i,t)}update(i,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=(i,t)=>{var e;const r=i._$AN;if(r===void 0)return!1;for(const n of r)(e=n._$AO)==null||e.call(n,t,!1),Ut(n,t);return!0},we=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while((e==null?void 0:e.size)===0)},Tn=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),Bo(t)}};function Ro(i){this._$AN!==void 0?(we(this),this._$AM=i,Tn(this)):this._$AM=i}function Ho(i,t=!1,e=0){const r=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(r))for(let o=e;o<r.length;o++)Ut(r[o],!1),we(r[o]);else r!=null&&(Ut(r,!1),we(r));else Ut(this,i)}const Bo=i=>{i.type==jo.CHILD&&(i._$AP??(i._$AP=Ho),i._$AQ??(i._$AQ=Ro))};class No extends Mo{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),Tn(this),this.isConnected=t._$AU}_$AO(t,e=!0){var r,n;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(n=this.disconnected)==null||n.call(this)),e&&(Ut(this,t),we(this))}setValue(t){if(Po(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=()=>new Io;class Io{}const Ie=new WeakMap,wt=Lo(class extends No{render(i){return A}update(i,[t]){var e;const r=t!==this.Y;return r&&this.Y!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.Y=t,this.ht=(e=i.options)==null?void 0:e.host,this.rt(this.ct=i.element)),A}rt(i){if(this.isConnected||(i=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let e=Ie.get(t);e===void 0&&(e=new WeakMap,Ie.set(t,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),e.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){var i,t;return typeof this.Y=="function"?(i=Ie.get(this.ht??globalThis))==null?void 0:i.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const zn=Object.freeze({left:0,top:0,width:16,height:16}),$e=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),ne=Object.freeze({...zn,...$e}),Ye=Object.freeze({...ne,body:"",hidden:!1}),Fo=Object.freeze({width:null,height:null}),Pn=Object.freeze({...Fo,...$e});function Do(i,t=0){const e=i.replace(/^-?[0-9.]*/,"");function r(n){for(;n<0;)n+=4;return n%4}if(e===""){const n=parseInt(i);return isNaN(n)?0:r(n)}else if(e!==i){let n=0;switch(e){case"%":n=25;break;case"deg":n=90}if(n){let o=parseFloat(i.slice(0,i.length-e.length));return isNaN(o)?0:(o=o/n,o%1===0?r(o):0)}}return t}const Uo=/[\s,]+/;function Vo(i,t){t.split(Uo).forEach(e=>{switch(e.trim()){case"horizontal":i.hFlip=!0;break;case"vertical":i.vFlip=!0;break}})}const jn={...Pn,preserveAspectRatio:""};function Bi(i){const t={...jn},e=(r,n)=>i.getAttribute(r)||n;return t.width=e("width",null),t.height=e("height",null),t.rotate=Do(e("rotate","")),Vo(t,e("flip","")),t.preserveAspectRatio=e("preserveAspectRatio",e("preserveaspectratio","")),t}function qo(i,t){for(const e in jn)if(i[e]!==t[e])return!0;return!1}const Vt=/^[a-z0-9]+(-[a-z0-9]+)*$/,re=(i,t,e,r="")=>{const n=i.split(":");if(i.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;r=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:r,prefix:a,name:l};return t&&!fe(c)?null:c}const o=n[0],s=o.split("-");if(s.length>1){const l={provider:r,prefix:s.shift(),name:s.join("-")};return t&&!fe(l)?null:l}if(e&&r===""){const l={provider:r,prefix:"",name:o};return t&&!fe(l,e)?null:l}return null},fe=(i,t)=>i?!!((i.provider===""||i.provider.match(Vt))&&(t&&i.prefix===""||i.prefix.match(Vt))&&i.name.match(Vt)):!1;function Wo(i,t){const e={};!i.hFlip!=!t.hFlip&&(e.hFlip=!0),!i.vFlip!=!t.vFlip&&(e.vFlip=!0);const r=((i.rotate||0)+(t.rotate||0))%4;return r&&(e.rotate=r),e}function Ni(i,t){const e=Wo(i,t);for(const r in Ye)r in $e?r in i&&!(r in e)&&(e[r]=$e[r]):r in t?e[r]=t[r]:r in i&&(e[r]=i[r]);return e}function Yo(i,t){const e=i.icons,r=i.aliases||Object.create(null),n=Object.create(null);function o(s){if(e[s])return n[s]=[];if(!(s in n)){n[s]=null;const l=r[s]&&r[s].parent,a=l&&o(l);a&&(n[s]=[l].concat(a))}return n[s]}return Object.keys(e).concat(Object.keys(r)).forEach(o),n}function Qo(i,t,e){const r=i.icons,n=i.aliases||Object.create(null);let o={};function s(l){o=Ni(r[l]||n[l],o)}return s(t),e.forEach(s),Ni(i,o)}function Ln(i,t){const e=[];if(typeof i!="object"||typeof i.icons!="object")return e;i.not_found instanceof Array&&i.not_found.forEach(n=>{t(n,null),e.push(n)});const r=Yo(i);for(const n in r){const o=r[n];o&&(t(n,Qo(i,n,o)),e.push(n))}return e}const Go={provider:"",aliases:{},not_found:{},...zn};function Fe(i,t){for(const e in t)if(e in i&&typeof i[e]!=typeof t[e])return!1;return!0}function Mn(i){if(typeof i!="object"||i===null)return null;const t=i;if(typeof t.prefix!="string"||!i.icons||typeof i.icons!="object"||!Fe(i,Go))return null;const e=t.icons;for(const n in e){const o=e[n];if(!n.match(Vt)||typeof o.body!="string"||!Fe(o,Ye))return null}const r=t.aliases||Object.create(null);for(const n in r){const o=r[n],s=o.parent;if(!n.match(Vt)||typeof s!="string"||!e[s]&&!r[s]||!Fe(o,Ye))return null}return t}const Ee=Object.create(null);function Jo(i,t){return{provider:i,prefix:t,icons:Object.create(null),missing:new Set}}function et(i,t){const e=Ee[i]||(Ee[i]=Object.create(null));return e[t]||(e[t]=Jo(i,t))}function ui(i,t){return Mn(t)?Ln(t,(e,r)=>{r?i.icons[e]=r:i.missing.add(e)}):[]}function Xo(i,t,e){try{if(typeof e.body=="string")return i.icons[t]={...e},!0}catch{}return!1}function Ko(i,t){let e=[];return(typeof i=="string"?[i]:Object.keys(Ee)).forEach(r=>{(typeof r=="string"&&typeof t=="string"?[t]:Object.keys(Ee[r]||{})).forEach(n=>{const o=et(r,n);e=e.concat(Object.keys(o.icons).map(s=>(r!==""?"@"+r+":":"")+n+":"+s))})}),e}let Jt=!1;function Rn(i){return typeof i=="boolean"&&(Jt=i),Jt}function Xt(i){const t=typeof i=="string"?re(i,!0,Jt):i;if(t){const e=et(t.provider,t.prefix),r=t.name;return e.icons[r]||(e.missing.has(r)?null:void 0)}}function Hn(i,t){const e=re(i,!0,Jt);if(!e)return!1;const r=et(e.provider,e.prefix);return Xo(r,e.name,t)}function Ii(i,t){if(typeof i!="object")return!1;if(typeof t!="string"&&(t=i.provider||""),Jt&&!t&&!i.prefix){let n=!1;return Mn(i)&&(i.prefix="",Ln(i,(o,s)=>{s&&Hn(o,s)&&(n=!0)})),n}const e=i.prefix;if(!fe({provider:t,prefix:e,name:"a"}))return!1;const r=et(t,e);return!!ui(r,i)}function Fi(i){return!!Xt(i)}function Zo(i){const t=Xt(i);return t?{...ne,...t}:null}function ts(i){const t={loaded:[],missing:[],pending:[]},e=Object.create(null);i.sort((n,o)=>n.provider!==o.provider?n.provider.localeCompare(o.provider):n.prefix!==o.prefix?n.prefix.localeCompare(o.prefix):n.name.localeCompare(o.name));let r={provider:"",prefix:"",name:""};return i.forEach(n=>{if(r.name===n.name&&r.prefix===n.prefix&&r.provider===n.provider)return;r=n;const o=n.provider,s=n.prefix,l=n.name,a=e[o]||(e[o]=Object.create(null)),c=a[s]||(a[s]=et(o,s));let h;l in c.icons?h=t.loaded:s===""||c.missing.has(l)?h=t.missing:h=t.pending;const d={provider:o,prefix:s,name:l};h.push(d)}),t}function Bn(i,t){i.forEach(e=>{const r=e.loaderCallbacks;r&&(e.loaderCallbacks=r.filter(n=>n.id!==t))})}function es(i){i.pendingCallbacksFlag||(i.pendingCallbacksFlag=!0,setTimeout(()=>{i.pendingCallbacksFlag=!1;const t=i.loaderCallbacks?i.loaderCallbacks.slice(0):[];if(!t.length)return;let e=!1;const r=i.provider,n=i.prefix;t.forEach(o=>{const s=o.icons,l=s.pending.length;s.pending=s.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(i.icons[c])s.loaded.push({provider:r,prefix:n,name:c});else if(i.missing.has(c))s.missing.push({provider:r,prefix:n,name:c});else return e=!0,!0;return!1}),s.pending.length!==l&&(e||Bn([i],o.id),o.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),o.abort))})}))}let is=0;function ns(i,t,e){const r=is++,n=Bn.bind(null,e,r);if(!t.pending.length)return n;const o={id:r,icons:t,callback:i,abort:n};return e.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(o)}),n}const Qe=Object.create(null);function Di(i,t){Qe[i]=t}function Ge(i){return Qe[i]||Qe[""]}function rs(i,t=!0,e=!1){const r=[];return i.forEach(n=>{const o=typeof n=="string"?re(n,t,e):n;o&&r.push(o)}),r}var os={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function ss(i,t,e,r){const n=i.resources.length,o=i.random?Math.floor(Math.random()*n):i.index;let s;if(i.random){let y=i.resources.slice(0);for(s=[];y.length>1;){const z=Math.floor(Math.random()*y.length);s.push(y[z]),y=y.slice(0,z).concat(y.slice(z+1))}s=s.concat(y)}else s=i.resources.slice(o).concat(i.resources.slice(0,o));const l=Date.now();let a="pending",c=0,h,d=null,p=[],b=[];typeof r=="function"&&b.push(r);function f(){d&&(clearTimeout(d),d=null)}function v(){a==="pending"&&(a="aborted"),f(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,z){z&&(b=[]),typeof y=="function"&&b.push(y)}function k(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function C(){a="failed",b.forEach(y=>{y(void 0,h)})}function x(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,z,H){const B=z!=="success";switch(p=p.filter(S=>S!==y),a){case"pending":break;case"failed":if(B||!i.dataAfterTimeout)return;break;default:return}if(z==="abort"){h=H,C();return}if(B){h=H,p.length||(s.length?T():C());return}if(f(),x(),!i.random){const S=i.resources.indexOf(y.resource);S!==-1&&S!==i.index&&(i.index=S)}a="completed",b.forEach(S=>{S(H)})}function T(){if(a!=="pending")return;f();const y=s.shift();if(y===void 0){if(p.length){d=setTimeout(()=>{f(),a==="pending"&&(x(),C())},i.timeout);return}C();return}const z={status:"pending",resource:y,callback:(H,B)=>{$(z,H,B)}};p.push(z),c++,d=setTimeout(T,i.rotate),e(y,t,z.callback)}return setTimeout(T),k}function Nn(i){const t={...os,...i};let e=[];function r(){e=e.filter(s=>s().status==="pending")}function n(s,l,a){const c=ss(t,s,l,(h,d)=>{r(),a&&a(h,d)});return e.push(c),c}function o(s){return e.find(l=>s(l))||null}return{query:n,find:o,setIndex:s=>{t.index=s},getIndex:()=>t.index,cleanup:r}}function di(i){let t;if(typeof i.resources=="string")t=[i.resources];else if(t=i.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:i.path||"/",maxURL:i.maxURL||500,rotate:i.rotate||750,timeout:i.timeout||5e3,random:i.random===!0,index:i.index||0,dataAfterTimeout:i.dataAfterTimeout!==!1}}const ze=Object.create(null),de=["https://api.simplesvg.com","https://api.unisvg.com"],Je=[];for(;de.length>0;)de.length===1||Math.random()>.5?Je.push(de.shift()):Je.push(de.pop());ze[""]=di({resources:["https://api.iconify.design"].concat(Je)});function Ui(i,t){const e=di(t);return e===null?!1:(ze[i]=e,!0)}function Pe(i){return ze[i]}function ls(){return Object.keys(ze)}function Vi(){}const De=Object.create(null);function as(i){if(!De[i]){const t=Pe(i);if(!t)return;const e=Nn(t),r={config:t,redundancy:e};De[i]=r}return De[i]}function In(i,t,e){let r,n;if(typeof i=="string"){const o=Ge(i);if(!o)return e(void 0,424),Vi;n=o.send;const s=as(i);s&&(r=s.redundancy)}else{const o=di(i);if(o){r=Nn(o);const s=i.resources?i.resources[0]:"",l=Ge(s);l&&(n=l.send)}}return!r||!n?(e(void 0,424),Vi):r.query(t,n,e)().abort}const qi="iconify2",Kt="iconify",Fn=Kt+"-count",Wi=Kt+"-version",Dn=36e5,cs=168,hs=50;function Xe(i,t){try{return i.getItem(t)}catch{}}function pi(i,t,e){try{return i.setItem(t,e),!0}catch{}}function Yi(i,t){try{i.removeItem(t)}catch{}}function Ke(i,t){return pi(i,Fn,t.toString())}function Ze(i){return parseInt(Xe(i,Fn))||0}const ct={local:!0,session:!0},Un={local:new Set,session:new Set};let bi=!1;function us(i){bi=i}let pe=typeof window>"u"?{}:window;function Vn(i){const t=i+"Storage";try{if(pe&&pe[t]&&typeof pe[t].length=="number")return pe[t]}catch{}ct[i]=!1}function qn(i,t){const e=Vn(i);if(!e)return;const r=Xe(e,Wi);if(r!==qi){if(r){const l=Ze(e);for(let a=0;a<l;a++)Yi(e,Kt+a.toString())}pi(e,Wi,qi),Ke(e,0);return}const n=Math.floor(Date.now()/Dn)-cs,o=l=>{const a=Kt+l.toString(),c=Xe(e,a);if(typeof c=="string"){try{const h=JSON.parse(c);if(typeof h=="object"&&typeof h.cached=="number"&&h.cached>n&&typeof h.provider=="string"&&typeof h.data=="object"&&typeof h.data.prefix=="string"&&t(h,l))return!0}catch{}Yi(e,a)}};let s=Ze(e);for(let l=s-1;l>=0;l--)o(l)||(l===s-1?(s--,Ke(e,s)):Un[i].add(l))}function Wn(){if(!bi){us(!0);for(const i in ct)qn(i,t=>{const e=t.data,r=t.provider,n=e.prefix,o=et(r,n);if(!ui(o,e).length)return!1;const s=e.lastModified||-1;return o.lastModifiedCached=o.lastModifiedCached?Math.min(o.lastModifiedCached,s):s,!0})}}function ds(i,t){const e=i.lastModifiedCached;if(e&&e>=t)return e===t;if(i.lastModifiedCached=t,e)for(const r in ct)qn(r,n=>{const o=n.data;return n.provider!==i.provider||o.prefix!==i.prefix||o.lastModified===t});return!0}function ps(i,t){bi||Wn();function e(r){let n;if(!ct[r]||!(n=Vn(r)))return;const o=Un[r];let s;if(o.size)o.delete(s=Array.from(o).shift());else if(s=Ze(n),s>=hs||!Ke(n,s+1))return;const l={cached:Math.floor(Date.now()/Dn),provider:i.provider,data:t};return pi(n,Kt+s.toString(),JSON.stringify(l))}t.lastModified&&!ds(i,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),e("local")||e("session"))}function Qi(){}function bs(i){i.iconsLoaderFlag||(i.iconsLoaderFlag=!0,setTimeout(()=>{i.iconsLoaderFlag=!1,es(i)}))}function ms(i,t){i.iconsToLoad?i.iconsToLoad=i.iconsToLoad.concat(t).sort():i.iconsToLoad=t,i.iconsQueueFlag||(i.iconsQueueFlag=!0,setTimeout(()=>{i.iconsQueueFlag=!1;const{provider:e,prefix:r}=i,n=i.iconsToLoad;delete i.iconsToLoad;let o;!n||!(o=Ge(e))||o.prepare(e,r,n).forEach(s=>{In(e,s,l=>{if(typeof l!="object")s.icons.forEach(a=>{i.missing.add(a)});else try{const a=ui(i,l);if(!a.length)return;const c=i.pendingIcons;c&&a.forEach(h=>{c.delete(h)}),ps(i,l)}catch(a){console.error(a)}bs(i)})})}))}const mi=(i,t)=>{const e=rs(i,!0,Rn()),r=ts(e);if(!r.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(r.loaded,r.missing,r.pending,Qi)}),()=>{a=!1}}const n=Object.create(null),o=[];let s,l;return r.pending.forEach(a=>{const{provider:c,prefix:h}=a;if(h===l&&c===s)return;s=c,l=h,o.push(et(c,h));const d=n[c]||(n[c]=Object.create(null));d[h]||(d[h]=[])}),r.pending.forEach(a=>{const{provider:c,prefix:h,name:d}=a,p=et(c,h),b=p.pendingIcons||(p.pendingIcons=new Set);b.has(d)||(b.add(d),n[c][h].push(d))}),o.forEach(a=>{const{provider:c,prefix:h}=a;n[c][h].length&&ms(a,n[c][h])}),t?ns(t,r,o):Qi},fs=i=>new Promise((t,e)=>{const r=typeof i=="string"?re(i,!0):i;if(!r){e(i);return}mi([r||i],n=>{if(n.length&&r){const o=Xt(r);if(o){t({...ne,...o});return}}e(i)})});function gs(i){try{const t=typeof i=="string"?JSON.parse(i):i;if(typeof t.body=="string")return{...t}}catch{}}function vs(i,t){const e=typeof i=="string"?re(i,!0,!0):null;if(!e){const o=gs(i);return{value:i,data:o}}const r=Xt(e);if(r!==void 0||!e.prefix)return{value:i,name:e,data:r};const n=mi([e],()=>t(i,e,Xt(e)));return{value:i,name:e,loading:n}}function Ue(i){return i.hasAttribute("inline")}let Yn=!1;try{Yn=navigator.vendor.indexOf("Apple")===0}catch{}function ys(i,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Yn||i.indexOf("<a")===-1)?"svg":i.indexOf("currentColor")===-1?"bg":"mask"}const _s=/(-?[0-9.]*[0-9]+[0-9.]*)/g,xs=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ti(i,t,e){if(t===1)return i;if(e=e||100,typeof i=="number")return Math.ceil(i*t*e)/e;if(typeof i!="string")return i;const r=i.split(_s);if(r===null||!r.length)return i;const n=[];let o=r.shift(),s=xs.test(o);for(;;){if(s){const l=parseFloat(o);isNaN(l)?n.push(o):n.push(Math.ceil(l*t*e)/e)}else n.push(o);if(o=r.shift(),o===void 0)return n.join("");s=!s}}function ws(i,t="defs"){let e="";const r=i.indexOf("<"+t);for(;r>=0;){const n=i.indexOf(">",r),o=i.indexOf("</"+t);if(n===-1||o===-1)break;const s=i.indexOf(">",o);if(s===-1)break;e+=i.slice(n+1,o).trim(),i=i.slice(0,r).trim()+i.slice(s+1)}return{defs:e,content:i}}function $s(i,t){return i?"<defs>"+i+"</defs>"+t:t}function Es(i,t,e){const r=ws(i);return $s(r.defs,t+r.content+e)}const Cs=i=>i==="unset"||i==="undefined"||i==="none";function Qn(i,t){const e={...ne,...i},r={...Pn,...t},n={left:e.left,top:e.top,width:e.width,height:e.height};let o=e.body;[e,r].forEach(v=>{const g=[],k=v.hFlip,C=v.vFlip;let x=v.rotate;k?C?x+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):C&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}x%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(o=Es(o,'<g transform="'+g.join(" ")+'">',"</g>"))});const s=r.width,l=r.height,a=n.width,c=n.height;let h,d;s===null?(d=l===null?"1em":l==="auto"?c:l,h=ti(d,a/c)):(h=s==="auto"?a:s,d=l===null?ti(h,c/a):l==="auto"?c:l);const p={},b=(v,g)=>{Cs(g)||(p[v]=g.toString())};b("width",h),b("height",d);const f=[n.left,n.top,a,c];return p.viewBox=f.join(" "),{attributes:p,viewBox:f,body:o}}function fi(i,t){let e=i.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const r in t)e+=" "+r+'="'+t[r]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+e+">"+i+"</svg>"}function Ss(i){return i.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function ks(i){return"data:image/svg+xml,"+Ss(i)}function Gn(i){return'url("'+ks(i)+'")'}const As=()=>{let i;try{if(i=fetch,typeof i=="function")return i}catch{}};let Ce=As();function Os(i){Ce=i}function Ts(){return Ce}function zs(i,t){const e=Pe(i);if(!e)return 0;let r;if(!e.maxURL)r=0;else{let n=0;e.resources.forEach(s=>{n=Math.max(n,s.length)});const o=t+".json?icons=";r=e.maxURL-n-e.path.length-o.length}return r}function Ps(i){return i===404}const js=(i,t,e)=>{const r=[],n=zs(i,t),o="icons";let s={type:o,provider:i,prefix:t,icons:[]},l=0;return e.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(r.push(s),s={type:o,provider:i,prefix:t,icons:[]},l=a.length),s.icons.push(a)}),r.push(s),r};function Ls(i){if(typeof i=="string"){const t=Pe(i);if(t)return t.path}return"/"}const Ms=(i,t,e)=>{if(!Ce){e("abort",424);return}let r=Ls(t.provider);switch(t.type){case"icons":{const o=t.prefix,s=t.icons.join(","),l=new URLSearchParams({icons:s});r+=o+".json?"+l.toString();break}case"custom":{const o=t.uri;r+=o.slice(0,1)==="/"?o.slice(1):o;break}default:e("abort",400);return}let n=503;Ce(i+r).then(o=>{const s=o.status;if(s!==200){setTimeout(()=>{e(Ps(s)?"abort":"next",s)});return}return n=501,o.json()}).then(o=>{if(typeof o!="object"||o===null){setTimeout(()=>{o===404?e("abort",o):e("next",n)});return}setTimeout(()=>{e("success",o)})}).catch(()=>{e("next",n)})},Rs={prepare:js,send:Ms};function Gi(i,t){switch(i){case"local":case"session":ct[i]=t;break;case"all":for(const e in ct)ct[e]=t;break}}const Ve="data-style";let Jn="";function Hs(i){Jn=i}function Ji(i,t){let e=Array.from(i.childNodes).find(r=>r.hasAttribute&&r.hasAttribute(Ve));e||(e=document.createElement("style"),e.setAttribute(Ve,Ve),i.appendChild(e)),e.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+Jn}function Xn(){Di("",Rs),Rn(!0);let i;try{i=window}catch{}if(i){if(Wn(),i.IconifyPreload!==void 0){const t=i.IconifyPreload,e="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(r=>{try{(typeof r!="object"||r===null||r instanceof Array||typeof r.icons!="object"||typeof r.prefix!="string"||!Ii(r))&&console.error(e)}catch{console.error(e)}})}if(i.IconifyProviders!==void 0){const t=i.IconifyProviders;if(typeof t=="object"&&t!==null)for(const e in t){const r="IconifyProviders["+e+"] is invalid.";try{const n=t[e];if(typeof n!="object"||!n||n.resources===void 0)continue;Ui(e,n)||console.error(r)}catch{console.error(r)}}}}return{enableCache:t=>Gi(t,!0),disableCache:t=>Gi(t,!1),iconLoaded:Fi,iconExists:Fi,getIcon:Zo,listIcons:Ko,addIcon:Hn,addCollection:Ii,calculateSize:ti,buildIcon:Qn,iconToHTML:fi,svgToURL:Gn,loadIcons:mi,loadIcon:fs,addAPIProvider:Ui,appendCustomStyle:Hs,_api:{getAPIConfig:Pe,setAPIModule:Di,sendAPIQuery:In,setFetch:Os,getFetch:Ts,listAPIProviders:ls}}}const ei={"background-color":"currentColor"},Kn={"background-color":"transparent"},Xi={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},Ki={"-webkit-mask":ei,mask:ei,background:Kn};for(const i in Ki){const t=Ki[i];for(const e in Xi)t[i+"-"+e]=Xi[e]}function Zi(i){return i?i+(i.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Bs(i,t,e){const r=document.createElement("span");let n=i.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const o=i.attributes,s=fi(n,{...o,width:t.width+"",height:t.height+""}),l=Gn(s),a=r.style,c={"--svg":l,width:Zi(o.width),height:Zi(o.height),...e?ei:Kn};for(const h in c)a.setProperty(h,c[h]);return r}let qt;function Ns(){try{qt=window.trustedTypes.createPolicy("iconify",{createHTML:i=>i})}catch{qt=null}}function Is(i){return qt===void 0&&Ns(),qt?qt.createHTML(i):i}function Fs(i){const t=document.createElement("span"),e=i.attributes;let r="";e.width||(r="width: inherit;"),e.height||(r+="height: inherit;"),r&&(e.style=r);const n=fi(i.body,e);return t.innerHTML=Is(n),t.firstChild}function ii(i){return Array.from(i.childNodes).find(t=>{const e=t.tagName&&t.tagName.toUpperCase();return e==="SPAN"||e==="SVG"})}function tn(i,t){const e=t.icon.data,r=t.customisations,n=Qn(e,r);r.preserveAspectRatio&&(n.attributes.preserveAspectRatio=r.preserveAspectRatio);const o=t.renderedMode;let s;switch(o){case"svg":s=Fs(n);break;default:s=Bs(n,{...ne,...e},o==="mask")}const l=ii(i);l?s.tagName==="SPAN"&&l.tagName===s.tagName?l.setAttribute("style",s.getAttribute("style")):i.replaceChild(s,l):i.appendChild(s)}function en(i,t,e){const r=e&&(e.rendered?e:e.lastRender);return{rendered:!1,inline:t,icon:i,lastRender:r}}function Ds(i="iconify-icon"){let t,e;try{t=window.customElements,e=window.HTMLElement}catch{return}if(!t||!e)return;const r=t.get(i);if(r)return r;const n=["icon","mode","inline","observe","width","height","rotate","flip"],o=class extends e{constructor(){super(),st(this,"_shadowRoot"),st(this,"_initialised",!1),st(this,"_state"),st(this,"_checkQueued",!1),st(this,"_connected",!1),st(this,"_observer",null),st(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Ue(this);Ji(l,a),this._state=en({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Ue(this),c=this._state;a!==c.inline&&(c.inline=a,Ji(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Ue(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}tn(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),h=Bi(this);(l.attrMode!==c||qo(l.customisations,h)||!ii(this._shadowRoot))&&this._renderIcon(l.icon,h,c)}_iconChanged(l){const a=vs(l,(c,h,d)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const b={value:c,name:h,data:d};b.data?this._gotIconData(b):p.icon=b});a.data?this._gotIconData(a):this._state=en(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=ii(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Bi(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const h=ys(l.data.body,c),d=this._state.inline;tn(this._shadowRoot,this._state={rendered:!0,icon:l,inline:d,customisations:a,attrMode:c,renderedMode:h})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in o.prototype||Object.defineProperty(o.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const s=Xn();for(const l in s)o[l]=o.prototype[l]=s[l];return t.define(i,o),o}Ds()||Xn();var Us=Object.defineProperty,U=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Us(t,e,n),n},be;const N=(be=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._parent=xt(),this._tooltip=xt(),this._contextMenu=xt(),this._mouseLeave=!1,this.onWindowMouseUp=i=>{const{value:t}=this._contextMenu;!this.contains(i.target)&&t&&(t.visible=!1)},this.mouseLeave=!0}set mouseLeave(i){this._mouseLeave=i,i&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:i}=this._parent,{value:t}=this._tooltip;i&&t&&$n(i,t,{placement:"bottom",middleware:[hn(10),wn(),xn(),_n({padding:5})]}).then(e=>{const{x:r,y:n}=e;Object.assign(t.style,{left:`${r}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const i=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},i)}onChildrenClick(i){i.stopPropagation();const{value:t}=this._contextMenu;t&&(t.visible=!t.visible)}onSlotChange(i){const{value:t}=this._contextMenu,e=i.target.assignedElements();for(const r of e){if(!(r instanceof be)){r.remove(),console.warn("Only bim-button is allowed inside bim-button. Child has been removed.");continue}r.addEventListener("click",()=>t==null?void 0:t.updatePosition())}this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){const i=m`
      <div ${wt(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?m`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?m`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=this.children.length>0;return m`
      <div ${wt(this._parent)} class="parent">
        ${this.label||this.icon?m`
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
        ${this.tooltipTitle||this.tooltipText?i:null}
        ${t?m`
              <div class="children" @click=${this.onChildrenClick}>
                <svg
                  style="flex-shrink: 0; fill: var(--bim-dropdown--c, var(--bim-ui_bg-contrast-100))"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1.125rem"
                  viewBox="0 0 24 24"
                  width="1.125rem"
                  fill="#9ca3af"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                  />
                </svg>
              </div>
            `:null}
        <bim-context-menu
          ${wt(this._contextMenu)}
          style="row-gap: var(--bim-ui_size-4xs)"
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </bim-context-menu>
      </div>
    `}},be.styles=E`
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

    :host([disabled]) .parent {
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
  `,be);U([u({type:String,reflect:!0})],N.prototype,"label");U([u({type:Boolean,attribute:"label-hidden",reflect:!0})],N.prototype,"labelHidden");U([u({type:Boolean,reflect:!0})],N.prototype,"active");U([u({type:Boolean,reflect:!0,attribute:"disabled"})],N.prototype,"disabled");U([u({type:String,reflect:!0})],N.prototype,"icon");U([u({type:Boolean,reflect:!0})],N.prototype,"vertical");U([u({type:Number,attribute:"tooltip-time",reflect:!0})],N.prototype,"tooltipTime");U([u({type:Boolean,attribute:"tooltip-visible",reflect:!0})],N.prototype,"tooltipVisible");U([u({type:String,attribute:"tooltip-title",reflect:!0})],N.prototype,"tooltipTitle");U([u({type:String,attribute:"tooltip-text",reflect:!0})],N.prototype,"tooltipText");let Vs=N;var qs=Object.defineProperty,oe=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&qs(t,e,n),n};const Zn=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return m`
      <div class="parent">
        ${this.label?m`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};Zn.styles=E`
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
  `;let Tt=Zn;oe([u({type:String,reflect:!0})],Tt.prototype,"icon");oe([u({type:String,reflect:!0})],Tt.prototype,"name");oe([u({type:String,reflect:!0})],Tt.prototype,"label");oe([u({type:Boolean,reflect:!0})],Tt.prototype,"checked");oe([u({type:Boolean,reflect:!0})],Tt.prototype,"inverted");var Ws=Object.defineProperty,zt=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Ws(t,e,n),n};const tr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=xt(),this._textInput=xt(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const e=t.target;this.opacity=e.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:e,opacity:r}=t;this.color=e,r&&(this.opacity=r)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:e}=this._colorInput;e&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:e}=this._textInput;if(!e)return;const{value:r}=e;let n=r.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),e.value=n.slice(0,7),e.value.length===7&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return m`
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
                ${wt(this._colorInput)}
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
                ${wt(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?m`<bim-number-input
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
    `}};tr.styles=E`
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
  `;let dt=tr;zt([u({type:String,reflect:!0})],dt.prototype,"name");zt([u({type:String,reflect:!0})],dt.prototype,"label");zt([u({type:String,reflect:!0})],dt.prototype,"icon");zt([u({type:Boolean,reflect:!0})],dt.prototype,"vertical");zt([u({type:Number,reflect:!0})],dt.prototype,"opacity");zt([u({type:String,reflect:!0})],dt.prototype,"color");const Ys=E`
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
`,Qs=E`
  :root {
    /* Grayscale Colors */
    --bim-ui_gray-0: hsl(210 10% 5%);
    --bim-ui_gray-1: hsl(210 10% 10%);
    --bim-ui_gray-2: hsl(210 10% 20%);
    --bim-ui_gray-4: hsl(210 10% 40%);
    --bim-ui_gray-6: hsl(210 10% 60%);
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
    --bim-ui_bg-contrast-40: var(--bim-ui_gray-4);
    --bim-ui_bg-contrast-60: var(--bim-ui_gray-6);
    --bim-ui_bg-contrast-80: var(--bim-ui_gray-8);
    --bim-ui_bg-contrast-100: var(--bim-ui_gray-10);
  }

  html.bim-ui-light {
    --bim-ui_bg-base: var(--bim-ui_gray-10);
    --bim-ui_bg-contrast-10: var(--bim-ui_gray-9);
    --bim-ui_bg-contrast-20: var(--bim-ui_gray-8);
    --bim-ui_bg-contrast-40: var(--bim-ui_gray-6);
    --bim-ui_bg-contrast-60: var(--bim-ui_gray-4);
    --bim-ui_bg-contrast-80: var(--bim-ui_gray-2);
    --bim-ui_bg-contrast-100: var(--bim-ui_gray-0);
    --bim-ui_accent-base: #6528d7;
  }
`,pt={scrollbar:Ys,globalStyles:Qs};var Gs=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,Xs=(i,t,e,r)=>{for(var n=Js(t,e),o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Gs(t,e,n),n};const er=class extends w{constructor(){super(...arguments),this._visible=!1,this._middleware={name:"middleware",async fn(t){const{right:e,top:r}=await oi(t);return t.x-=Math.sign(e)===1?e+5:0,t.y-=Math.sign(r)===1?r+5:0,t}}}get visible(){return this._visible}set visible(t){this._visible=t,t&&this.updatePosition()}async updatePosition(t){const e=t||this.parentNode;if(!e){this.visible=!1,console.warn("No target element found for context-menu.");return}const r=await $n(e,this,{placement:"right",middleware:[hn(10),wn(),xn(),_n({padding:5}),this._middleware]}),{x:n,y:o}=r;this.style.left=`${n}px`,this.style.top=`${o}px`}render(){return m` <slot></slot> `}};er.styles=[pt.scrollbar,E`
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
    `];let ir=er;Xs([u({type:Boolean,reflect:!0})],ir.prototype,"visible");class Ks extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const r of t)this.elements.add(r);const e=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const r of e)r.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(e=>{const r=e[0];if(!r.isIntersecting)return;const n=r.target;t.unobserve(n);const o=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,s=[...this.elements][o];s&&(this.visibleElements=[...this.visibleElements,s],t.observe(s))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const e=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,r=[...this.elements][e];r&&t.observe(r)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const e of this.elements)t.unobserve(e);this.visibleElements=[],this.observeLastElement()}}static create(t,e){const r=document.createDocumentFragment();if(t.length===0)return Ot(t(),r),r.firstElementChild;if(!e)throw new Error("UIComponent: Initial state is required for statefull components.");let n=e;const o=t,s=l=>(n={...n,...l},Ot(o(n),r),n);return s(e),[r.firstElementChild,s]}}const Se=(i,t=!0)=>{let e={};for(const r of i.children){const n=r,o=n.getAttribute("name")||n.getAttribute("label");if(o){if("value"in n){const s=n.value;if(typeof s=="object"&&!Array.isArray(s)&&Object.keys(s).length===0)continue;e[o]=n.value}else if(t){const s=Se(n);if(Object.keys(s).length===0)continue;e[o]=s}}else t&&(e={...e,...Se(n)})}return e},je=i=>i==="true"||i==="false"?i==="true":i&&!isNaN(Number(i))&&i.trim()!==""?Number(i):i,Zs=[">=","<=","=",">","<","?","/","#"];function nn(i){const t=Zs.find(s=>i.split(s).length===2),e=i.split(t).map(s=>s.trim()),[r,n]=e,o=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):je(n);return{key:r,condition:t,value:o}}const ni=i=>{try{const t=[],e=i.split(/&(?![^()]*\))/).map(r=>r.trim());for(const r of e){const n=!r.startsWith("(")&&!r.endsWith(")"),o=r.startsWith("(")&&r.endsWith(")");if(n){const s=nn(r);t.push(s)}if(o){const s={operator:"&",queries:r.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=nn(l);return a>0&&(c.operator="&"),c})};t.push(s)}}return t}catch{return null}},rn=(i,t,e)=>{let r=!1;switch(t){case"=":r=i===e;break;case"?":r=String(i).includes(String(e));break;case"<":(typeof i=="number"||typeof e=="number")&&(r=i<e);break;case"<=":(typeof i=="number"||typeof e=="number")&&(r=i<=e);break;case">":(typeof i=="number"||typeof e=="number")&&(r=i>e);break;case">=":(typeof i=="number"||typeof e=="number")&&(r=i>=e);break;case"/":r=String(i).startsWith(String(e));break}return r};var tl=Object.defineProperty,el=Object.getOwnPropertyDescriptor,nt=(i,t,e,r)=>{for(var n=r>1?void 0:r?el(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&tl(t,e,n),n};const nr=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?je(this.label):this.label}set value(t){this._value=t}render(){return m`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?m` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?m`<bim-checkbox
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
        ${!this.checkbox&&!this.noMark&&this.checked?m`<svg
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
    `}};nr.styles=E`
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
  `;let O=nr;nt([u({type:String,reflect:!0})],O.prototype,"img",2);nt([u({type:String,reflect:!0})],O.prototype,"label",2);nt([u({type:String,reflect:!0})],O.prototype,"icon",2);nt([u({type:Boolean,reflect:!0})],O.prototype,"checked",2);nt([u({type:Boolean,reflect:!0})],O.prototype,"checkbox",2);nt([u({type:Boolean,attribute:"no-mark",reflect:!0})],O.prototype,"noMark",2);nt([u({converter:{fromAttribute(i){return i&&je(i)}}})],O.prototype,"value",1);nt([u({type:Boolean,reflect:!0})],O.prototype,"vertical",2);var il=Object.defineProperty,nl=Object.getOwnPropertyDescriptor,rt=(i,t,e,r)=>{for(var n=r>1?void 0:r?nl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&il(t,e,n),n};const rr=class extends Ks{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this.onWindowMouseUp=t=>{this.visible&&(this.contains(t.target)||(this.visible=!1))},this.onOptionClick=t=>{const e=t.target,r=this._value.has(e);if(!this.multiple&&!this.required&&!r)this._value=new Set([e]);else if(!this.multiple&&!this.required&&r)this._value=new Set([]);else if(!this.multiple&&this.required&&!r)this._value=new Set([e]);else if(this.multiple&&!this.required&&!r)this._value=new Set([...this._value,e]);else if(this.multiple&&!this.required&&r){const n=[...this._value].filter(o=>o!==e);this._value=new Set(n)}else if(this.multiple&&this.required&&!r)this._value=new Set([...this._value,e]);else if(this.multiple&&this.required&&r){const n=[...this._value].filter(s=>s!==e),o=new Set(n);o.size!==0&&(this._value=o)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){this._visible=t,t||this.resetVisibleElements()}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const e=new Set;for(const r of t){const n=this.findOption(r);if(n&&(e.add(n),!this.multiple&&Object.keys(t).length===1))break}this._value=e,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(t=>t instanceof O&&t.checked).map(t=>t.value)}get _options(){const t=new Set([...this.elements]);for(const e of this.children)e instanceof O&&t.add(e);return[...t]}onSlotChange(t){const e=t.target.assignedElements();this.observe(e);const r=new Set;for(const n of this.elements){if(!(n instanceof O)){n.remove();continue}n.checked&&r.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=r}updateOptionsState(){for(const t of this._options)t instanceof O&&(t.checked=this._value.has(t))}findOption(t){return this._options.find(e=>e instanceof O?e.label===t||e.value===t:!1)}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){let t,e,r;if(this._value.size===0)t="Select an option...";else if(this._value.size===1){const n=[...this._value][0];t=(n==null?void 0:n.label)||(n==null?void 0:n.value),e=n==null?void 0:n.img,r=n==null?void 0:n.icon}else t=`Multiple (${this._value.size})`;return m`
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
        </div>
        <bim-context-menu .visible=${this.visible}>
          <slot @slotchange=${this.onSlotChange}></slot>
          ${this.visibleElements.map(n=>n)}
        </bim-context-menu>
      </bim-input>
    `}};rr.styles=[pt.scrollbar,E`
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
    `];let Y=rr;rt([u({type:String,reflect:!0})],Y.prototype,"name",2);rt([u({type:String,reflect:!0})],Y.prototype,"icon",2);rt([u({type:String,reflect:!0})],Y.prototype,"label",2);rt([u({type:Boolean,reflect:!0})],Y.prototype,"multiple",2);rt([u({type:Boolean,reflect:!0})],Y.prototype,"required",2);rt([u({type:Boolean,reflect:!0})],Y.prototype,"vertical",2);rt([u({type:Boolean,reflect:!0})],Y.prototype,"visible",1);rt([ie()],Y.prototype,"_value",2);var rl=Object.defineProperty,or=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&rl(t,e,n),n};const sr=class extends w{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(t){const e=t.split(`
`).map(r=>r.trim()).map(r=>r.split('"')[1]).filter(r=>r!==void 0).flatMap(r=>r.split(/\s+/));return[...new Set(e)].filter(r=>r!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const t=this.layouts[this.layout],e=this.getUniqueAreasFromTemplate(t.template).map(r=>{const n=t.elements[r];return n&&(n.style.gridArea=r),n}).filter(r=>!!r);this.style.gridTemplate=t.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...e)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return m`<slot></slot>`}};sr.styles=E`
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
  `;let gi=sr;or([u({type:Boolean,reflect:!0})],gi.prototype,"floating");or([u({type:String,reflect:!0})],gi.prototype,"layout");const ri=class extends w{render(){return m`
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
  `,ri.properties={icon:{type:String}};let ol=ri;var sl=Object.defineProperty,Le=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&sl(t,e,n),n};const lr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const t={};for(const e of this.children){const r=e;"value"in r?t[r.name||r.label]=r.value:"checked"in r&&(t[r.name||r.label]=r.checked)}return t}set value(t){const e=[...this.children];for(const r in t){const n=e.find(l=>{const a=l;return a.name===r||a.label===r});if(!n)continue;const o=n,s=t[r];typeof s=="boolean"?o.checked=s:o.value=s}}render(){return m`
      <div class="parent">
        ${this.label||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};lr.styles=E`
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
  `;let se=lr;Le([u({type:String,reflect:!0})],se.prototype,"name");Le([u({type:String,reflect:!0})],se.prototype,"label");Le([u({type:String,reflect:!0})],se.prototype,"icon");Le([u({type:Boolean,reflect:!0})],se.prototype,"vertical");var ll=Object.defineProperty,le=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&ll(t,e,n),n};const ar=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?je(this.textContent):this.textContent}render(){return m`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?m`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?m`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};ar.styles=E`
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
        calc(var(--bim-label--fz, var(--bim-ui_size-xs)) * 1.5)
      );
    }

    :host([vertical]) img {
      max-height: var(
        --bim-label_icon--sz,
        calc(var(--bim-label--fz, var(--bim-ui_size-xs)) * 4)
      );
    }
  `;let Pt=ar;le([u({type:String,reflect:!0})],Pt.prototype,"img");le([u({type:Boolean,attribute:"label-hidden",reflect:!0})],Pt.prototype,"labelHidden");le([u({type:String,reflect:!0})],Pt.prototype,"icon");le([u({type:Boolean,attribute:"icon-hidden",reflect:!0})],Pt.prototype,"iconHidden");le([u({type:Boolean,reflect:!0})],Pt.prototype,"vertical");var al=Object.defineProperty,cl=Object.getOwnPropertyDescriptor,R=(i,t,e,r)=>{for(var n=r>1?void 0:r?cl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&al(t,e,n),n};const cr=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=xt(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:e}=this._input;e&&this.setValue(e.value)}setValue(t){const{value:e}=this._input;let r=t;if(r=r.replace(/[^0-9.-]/g,""),r=r.replace(/(\..*)\./g,"$1"),r.endsWith(".")||(r.lastIndexOf("-")>0&&(r=r[0]+r.substring(1).replace(/-/g,"")),r==="-"||r==="-0"))return;let n=Number(r);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,e&&(e.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:e}=t,r=this.value;let n=!1;const o=a=>{var c;n=!0;const{clientX:h}=a,d=this.step??1,p=((c=d.toString().split(".")[1])==null?void 0:c.length)||0,b=1/(this.sensitivity??1),f=(h-e)/b;if(Math.floor(Math.abs(f))!==Math.abs(f))return;const v=r+f*d;this.setValue(v.toFixed(p))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},l=()=>{document.removeEventListener("mousemove",o),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const e=r=>{r.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",e))};window.addEventListener("keydown",e)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=m`
      ${this.pref||this.icon?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${wt(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${l=>l.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.suffix?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            >${this.suffix}</bim-label
          >`:null}
    `,e=this.min??-1/0,r=this.max??1/0,n=100*(this.value-e)/(r-e),o=m`
      <style>
        .slider-indicator {
          width: ${`${n}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?m`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .icon=${this.icon}
              >${`${this.pref}: `}</bim-label
            >`:null}
        <bim-label style="z-index: 1;">${this.value}</bim-label>
        ${this.suffix?m`<bim-label style="z-index: 1;">${this.suffix}</bim-label>`:null}
      </div>
    `,s=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return m`
      <bim-input
        title=${s}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?o:t}
      </bim-input>
    `}};cr.styles=E`
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
  `;let j=cr;R([u({type:String,reflect:!0})],j.prototype,"name",2);R([u({type:String,reflect:!0})],j.prototype,"icon",2);R([u({type:String,reflect:!0})],j.prototype,"label",2);R([u({type:String,reflect:!0})],j.prototype,"pref",2);R([u({type:Number,reflect:!0})],j.prototype,"min",2);R([u({type:Number,reflect:!0})],j.prototype,"value",1);R([u({type:Number,reflect:!0})],j.prototype,"step",2);R([u({type:Number,reflect:!0})],j.prototype,"sensitivity",2);R([u({type:Number,reflect:!0})],j.prototype,"max",2);R([u({type:String,reflect:!0})],j.prototype,"suffix",2);R([u({type:Boolean,reflect:!0})],j.prototype,"vertical",2);R([u({type:Boolean,reflect:!0})],j.prototype,"slider",2);var hl=Object.defineProperty,ul=Object.getOwnPropertyDescriptor,ae=(i,t,e,r)=>{for(var n=r>1?void 0:r?ul(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&hl(t,e,n),n};const hr=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return Se(this)}set value(t){const e=[...this.children];for(const r in t){const n=e.find(s=>{const l=s;return l.name===r||l.label===r});if(!n)continue;const o=n;o.value=t[r]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,m`
      <div class="parent">
        ${this.label||this.name||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};hr.styles=[pt.scrollbar,E`
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
    `];let jt=hr;ae([u({type:String,reflect:!0})],jt.prototype,"icon",2);ae([u({type:String,reflect:!0})],jt.prototype,"name",2);ae([u({type:String,reflect:!0})],jt.prototype,"label",2);ae([u({type:Boolean,reflect:!0})],jt.prototype,"hidden",1);ae([u({type:Boolean,attribute:"header-hidden",reflect:!0})],jt.prototype,"headerHidden",2);var dl=Object.defineProperty,ce=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&dl(t,e,n),n};const ur=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change")}get value(){return Se(this)}set value(t){const e=[...this.children];for(const r in t){const n=e.find(s=>{const l=s;return l.name===r||l.label===r});if(!n)continue;const o=n;o.value=t[r]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,e=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,r=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?e:r,o=m`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return m`
      <div class="parent">
        ${t?o:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};ur.styles=[pt.scrollbar,E`
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
    `];let Lt=ur;ce([u({type:String,reflect:!0})],Lt.prototype,"icon");ce([u({type:String,reflect:!0})],Lt.prototype,"label");ce([u({type:String,reflect:!0})],Lt.prototype,"name");ce([u({type:Boolean,reflect:!0})],Lt.prototype,"fixed");ce([u({type:Boolean,reflect:!0})],Lt.prototype,"collapsed");var pl=Object.defineProperty,he=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&pl(t,e,n),n};const dr=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const e of this.children)e instanceof O&&(e.checked=e===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const e=this.findOption(t);if(e){for(const r of this._options)r.checked=r===e;this._value=e,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const e=t.target.assignedElements();for(const r of e)r instanceof O&&(r.noMark=!0,r.removeEventListener("click",this.onOptionClick),r.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(e=>e instanceof O?e.label===t||e.value===t:!1)}firstUpdated(){const t=[...this.children].find(e=>e instanceof O&&e.checked);t&&(this._value=t)}render(){return m`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};dr.styles=E`
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
  `;let Mt=dr;he([u({type:String,reflect:!0})],Mt.prototype,"name");he([u({type:String,reflect:!0})],Mt.prototype,"icon");he([u({type:String,reflect:!0})],Mt.prototype,"label");he([u({type:Boolean,reflect:!0})],Mt.prototype,"vertical");he([ie()],Mt.prototype,"_value");var bl=Object.defineProperty,ml=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&bl(t,e,n),n};const pr=class extends w{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return m`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};pr.styles=E`
    :host {
      padding: 0.25rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([data-column-index="0"]:not([data-cell-header])) {
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
  `;let br=pr;ml([u({type:String,reflect:!0})],br.prototype,"column");var fl=Object.defineProperty,gl=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&fl(t,e,n),n};const mr=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,e=!1){for(const r of this._groups)r.childrenHidden=typeof t>"u"?!r.childrenHidden:!t,e&&r.toggleChildren(t,e)}render(){return this._groups=[],m`
      <slot></slot>
      ${this.data.map(t=>{const e=document.createElement("bim-table-group");return this._groups.push(e),e.table=this.table,e.data=t,e})}
    `}};mr.styles=E`
    :host {
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
  `;let fr=mr;gl([u({type:Array,attribute:!1})],fr.prototype,"data");var vl=Object.defineProperty,yl=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&vl(t,e,n),n};const gr=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,e=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,e&&this._children.toggleGroups(t,e))}render(){var t,e;const r=((t=this.table)==null?void 0:t.getGroupIndentation(this.data))??0,n=m`
      <style>
        .branch-vertical {
          left: ${r+.5625}rem;
        }
      </style>
      <div class="branch branch-vertical"></div>
    `,o=document.createDocumentFragment();Ot(n,o);const s=document.createElement("div");s.classList.add("branch","branch-horizontal"),s.style.left=`${r-1+.5625}rem`;const l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("height","9.5"),l.setAttribute("width","7.5"),l.setAttribute("viewBox","0 0 4.6666672 7.3333333");const a=document.createElementNS("http://www.w3.org/2000/svg","path");a.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),l.append(a);const c=document.createElementNS("http://www.w3.org/2000/svg","svg");c.setAttribute("height","6.5"),c.setAttribute("width","9.5"),c.setAttribute("viewBox","0 0 5.9111118 5.0175439");const h=document.createElementNS("http://www.w3.org/2000/svg","path");h.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),c.append(h);const d=document.createElement("div");d.addEventListener("click",f=>{f.stopPropagation(),this.toggleChildren()}),d.classList.add("caret"),d.style.left=`${.125+r}rem`,this.childrenHidden?d.append(l):d.append(c);const p=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&p.append(o),p.table=this.table,p.data=this.data.data,(e=this.table)==null||e.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:p}})),this.data.children&&p.append(d),r!==0&&(!this.data.children||this.childrenHidden)&&p.append(s);let b;if(this.data.children){b=document.createElement("bim-table-children"),this._children=b,b.table=this.table,b.data=this.data.children;const f=document.createDocumentFragment();Ot(n,f),b.append(f)}return m`
      <div class="parent">${p} ${this.childrenHidden?null:b}</div>
    `}};gr.styles=E`
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
  `;let vr=gr;yl([u({type:Boolean,attribute:"children-hidden",reflect:!0})],vr.prototype,"childrenHidden");var _l=Object.defineProperty,ue=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&_l(t,e,n),n};const yr=class extends w{constructor(){super(...arguments),this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.name)}get _columnWidths(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.width)}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden))}compute(){var t,e,r;const n=((t=this.table)==null?void 0:t.getRowIndentation(this.data))??0,o=this.isHeader?this.data:((e=this.table)==null?void 0:e.computeRowDeclaration(this.data))??this.data,s=[];for(const l in o){if(this.hiddenColumns.includes(l))continue;const a=o[l];let c;if(typeof a=="string"||typeof a=="boolean"||typeof a=="number"?(c=document.createElement("bim-label"),c.textContent=String(a)):a instanceof HTMLElement?c=a:(c=document.createDocumentFragment(),Ot(a,c)),!c)continue;const h=document.createElement("bim-table-cell");h.append(c),h.column=l,this._columnNames.indexOf(l)===0&&!this.isHeader&&(h.style.marginLeft=`${n+.125}rem`);const d=this._columnNames.indexOf(l);h.setAttribute("data-column-index",String(d)),h.toggleAttribute("data-cell-header",this.isHeader),h.rowData=this.data,(r=this.table)==null||r.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:h}})),s.push(h)}return this.style.gridTemplateAreas=`"${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this._columnWidths.join(" ")}`,m`
      ${s}
      <slot></slot>
    `}render(){return m`${this._intersecting?this.compute():m``}`}};yr.styles=E`
    :host {
      position: relative;
      grid-area: Data;
      display: grid;
      min-height: 2.25rem;
    }

    ::slotted(.branch.branch-vertical) {
      top: 50%;
      bottom: 0;
    }
  `;let Rt=yr;ue([u({attribute:!1})],Rt.prototype,"columns");ue([u({attribute:!1})],Rt.prototype,"hiddenColumns");ue([u({attribute:!1})],Rt.prototype,"data");ue([u({type:Boolean,attribute:"is-header",reflect:!0})],Rt.prototype,"isHeader");ue([ie()],Rt.prototype,"_intersecting");var xl=Object.defineProperty,wl=Object.getOwnPropertyDescriptor,Ht=(i,t,e,r)=>{for(var n=r>1?void 0:r?wl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&xl(t,e,n),n};const _r=class extends w{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(t,e)=>Object.values(e.data).some(r=>String(r).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,e)=>{let r=!1;const n=ni(t)??[];for(const o of n){if("queries"in o){r=!1;break}const{condition:s,value:l}=o;let{key:a}=o;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,r=Object.keys(e.data).filter(h=>h.includes(c)).map(h=>rn(e.data[h],s,l)).some(h=>h)}else r=rn(e.data[a],s,l);if(!r)break}return r}}set columns(t){const e=[];for(const r of t){const n=typeof r=="string"?{name:r,width:`minmax(${this.minColWidth}, 1fr)`}:r;e.push(n)}this._columns=e,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const t={};for(const e of this.columns)if(typeof e=="string")t[e]=e;else{const{name:r}=e;t[r]=r}return t}get value(){return this._filteredData}set queryString(t){this._queryString=t&&t.trim()!==""?t.trim():null,this.updateFilteredData()}get queryString(){return this._queryString}set data(t){this._data=t,this.updateFilteredData(),this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(t=>{setTimeout(()=>{t(this.data)})})}set hiddenColumns(t){this._hiddenColumns=t,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(ni(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(t){let e=!1;for(const r of t){const{children:n,data:o}=r;for(const s in o)this._columns.map(l=>typeof l=="string"?l:l.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),e=!0);if(n){const s=this.computeMissingColumns(n);s&&!e&&(e=s)}}return e}generateText(t="comma",e=this.value,r="",n=!0){const o=this._textDelimiters[t];let s="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${o}`);const a=`${l.join(o)}
`;s+=a}for(const[a,c]of e.entries()){const{data:h,children:d}=c,p=this.indentationInText?`${r}${a+1}${o}`:"",b=l.map(v=>h[v]??""),f=`${p}${b.join(o)}
`;s+=f,d&&(s+=this.generateText(t,c.children,`${r}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}computeRowDeclaration(t){const e={};for(const r in t){const n=this.dataTransform[r];n?e[r]=n(t[r],t):e[r]=t[r]}return e}downloadData(t="BIM Table Data",e="json"){let r=null;if(e==="json"&&(r=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),e==="csv"&&(r=new File([this.csv],`${t}.csv`)),e==="tsv"&&(r=new File([this.tsv],`${t}.tsv`)),!r)return;const n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=r.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,e=this.value,r=0){for(const n of e){if(n.data===t)return r;if(n.children){const o=this.getRowIndentation(t,n.children,r+1);if(o!==null)return o}}return null}getGroupIndentation(t,e=this.value,r=0){for(const n of e){if(n===t)return r;if(n.children){const o=this.getGroupIndentation(t,n.children,r+1);if(o!==null)return o}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}filter(t,e=this.filterFunction??this._stringFilterFunction,r=this.data){const n=[];for(const o of r)if(e(t,o)){if(this.preserveStructureOnFilter){const s={data:o.data};if(o.children){const l=this.filter(t,e,o.children);l.length&&(s.children=l)}n.push(s)}else if(n.push({data:o.data}),o.children){const s=this.filter(t,e,o.children);n.push(...s)}}else if(o.children){const s=this.filter(t,e,o.children);this.preserveStructureOnFilter&&s.length?n.push({data:o.data,children:s}):n.push(...s)}return n}render(){const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const e=document.createElement("bim-table-children");return e.table=this,e.data=this.value,e.style.gridArea="Body",e.style.backgroundColor="transparent",m`
      <div class="parent">
        ${this.headersHidden?null:t}
        <div style="overflow-x: hidden; grid-area: Body">${e}</div>
      </div>
    `}};_r.styles=[pt.scrollbar,E`
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
    `];let bt=_r;Ht([ie()],bt.prototype,"_filteredData",2);Ht([u({type:Boolean,attribute:"headers-hidden",reflect:!0})],bt.prototype,"headersHidden",2);Ht([u({type:String,attribute:"min-col-width",reflect:!0})],bt.prototype,"minColWidth",2);Ht([u({type:Array,attribute:!1})],bt.prototype,"columns",1);Ht([u({type:Array,attribute:!1})],bt.prototype,"data",1);Ht([u({type:Boolean,reflect:!0})],bt.prototype,"expanded",2);var $l=Object.defineProperty,El=Object.getOwnPropertyDescriptor,Me=(i,t,e,r)=>{for(var n=r>1?void 0:r?El(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&$l(t,e,n),n};const xr=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const e=[...t.children].indexOf(this);this.name=`${this._defaultName}${e}`}}render(){return m` <slot></slot> `}};xr.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let L=xr;Me([u({type:String,reflect:!0})],L.prototype,"name",2);Me([u({type:String,reflect:!0})],L.prototype,"label",2);Me([u({type:String,reflect:!0})],L.prototype,"icon",2);Me([u({type:Boolean,reflect:!0})],L.prototype,"hidden",1);var Cl=Object.defineProperty,Sl=Object.getOwnPropertyDescriptor,Bt=(i,t,e,r)=>{for(var n=r>1?void 0:r?Sl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Cl(t,e,n),n};const wr=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=t=>{const e=t.target;e instanceof L&&!e.hidden&&(e.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=e.name,e.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const e=[...this.children],r=e.find(n=>n instanceof L&&n.name===t);for(const n of e){if(!(n instanceof L))continue;n.hidden=r!==n;const o=this.getTabSwitcher(n.name);o&&o.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(e=>e.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof L))continue;const e=document.createElement("div");e.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),e.setAttribute("data-name",t.name),e.className="switcher";const r=document.createElement("bim-label");r.textContent=t.label??"",r.icon=t.icon,e.append(r),this._switchers.push(e)}}onSlotChange(t){this.createSwitchers();const e=t.target.assignedElements(),r=e.find(n=>n instanceof L?this.tab?n.name===this.tab:!n.hidden:!1);r&&r instanceof L&&(this.tab=r.name);for(const n of e){if(!(n instanceof L)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),r!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return m`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};wr.styles=[pt.scrollbar,E`
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
    `];let mt=wr;Bt([ie()],mt.prototype,"_switchers",2);Bt([u({type:Boolean,reflect:!0})],mt.prototype,"bottom",2);Bt([u({type:Boolean,attribute:"switchers-hidden",reflect:!0})],mt.prototype,"switchersHidden",2);Bt([u({type:Boolean,reflect:!0})],mt.prototype,"floating",2);Bt([u({type:String,reflect:!0})],mt.prototype,"tab",1);Bt([u({type:Boolean,attribute:"switchers-full",reflect:!0})],mt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kl=i=>i??A;var Al=Object.defineProperty,Ol=Object.getOwnPropertyDescriptor,ot=(i,t,e,r)=>{for(var n=r>1?void 0:r?Ol(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Al(t,e,n),n};const $r=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return ni(this.value)}onInputChange(t){t.stopPropagation();const e=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=e.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("input");e==null||e.focus()})}render(){return m`
      <bim-input
        .name=${this.name}
        .icon=${this.icon}
        .label=${this.label}
        .vertical=${this.vertical}
      >
        <input
          aria-label=${this.label||this.name||"Text Input"}
          .type=${this.type}
          .value=${this.value}
          placeholder=${kl(this.placeholder)}
          @input=${this.onInputChange}
        />
      </bim-input>
    `}};$r.styles=E`
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
      --bim-input--olc: var(--bim-ui_accent-base);
    }

    /* :host([disabled]) {
      --bim-input--bgc: var(--bim-ui_bg-contrast-20);
    } */
  `;let Q=$r;ot([u({type:String,reflect:!0})],Q.prototype,"icon",2);ot([u({type:String,reflect:!0})],Q.prototype,"label",2);ot([u({type:String,reflect:!0})],Q.prototype,"name",2);ot([u({type:String,reflect:!0})],Q.prototype,"placeholder",2);ot([u({type:String,reflect:!0})],Q.prototype,"value",2);ot([u({type:Boolean,reflect:!0})],Q.prototype,"vertical",2);ot([u({type:Number,reflect:!0})],Q.prototype,"debounce",2);ot([u({type:String,reflect:!0})],Q.prototype,"type",1);var Tl=Object.defineProperty,zl=Object.getOwnPropertyDescriptor,Er=(i,t,e,r)=>{for(var n=r>1?void 0:r?zl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Tl(t,e,n),n};const Cr=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const e of t)this.vertical?e.setAttribute("label-hidden",""):e.removeAttribute("label-hidden")}render(){return m`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};Cr.styles=E`
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
  `;let Re=Cr;Er([u({type:Number,reflect:!0})],Re.prototype,"rows",2);Er([u({type:Boolean,reflect:!0})],Re.prototype,"vertical",1);var Pl=Object.defineProperty,jl=Object.getOwnPropertyDescriptor,He=(i,t,e,r)=>{for(var n=r>1?void 0:r?jl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Pl(t,e,n),n};const Sr=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const e of t)e instanceof Re&&(e.vertical=this.vertical),e.toggleAttribute("label-hidden",this.vertical)}render(){return m`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Sr.styles=E`
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
  `;let Nt=Sr;He([u({type:String,reflect:!0})],Nt.prototype,"label",2);He([u({type:String,reflect:!0})],Nt.prototype,"icon",2);He([u({type:Boolean,reflect:!0})],Nt.prototype,"vertical",1);He([u({type:Boolean,attribute:"label-hidden",reflect:!0})],Nt.prototype,"labelHidden",1);const kr=class _{static set config(t){this._config={..._._config,...t}}static get config(){return _._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=pt.globalStyles.cssText;const e=document.head.firstChild;e?document.head.insertBefore(t,e):document.head.append(t)}static defineCustomElement(t,e){customElements.get(t)||customElements.define(t,e)}static registerComponents(){_.init()}static init(){_.addGlobalStyles(),_.defineCustomElement("bim-button",Vs),_.defineCustomElement("bim-checkbox",Tt),_.defineCustomElement("bim-color-input",dt),_.defineCustomElement("bim-context-menu",ir),_.defineCustomElement("bim-dropdown",Y),_.defineCustomElement("bim-grid",gi),_.defineCustomElement("bim-icon",ol),_.defineCustomElement("bim-input",se),_.defineCustomElement("bim-label",Pt),_.defineCustomElement("bim-number-input",j),_.defineCustomElement("bim-option",O),_.defineCustomElement("bim-panel",jt),_.defineCustomElement("bim-panel-section",Lt),_.defineCustomElement("bim-selector",Mt),_.defineCustomElement("bim-table",bt),_.defineCustomElement("bim-tabs",mt),_.defineCustomElement("bim-tab",L),_.defineCustomElement("bim-table-cell",br),_.defineCustomElement("bim-table-children",fr),_.defineCustomElement("bim-table-group",vr),_.defineCustomElement("bim-table-row",Rt),_.defineCustomElement("bim-text-input",Q),_.defineCustomElement("bim-toolbar",Be),_.defineCustomElement("bim-toolbar-group",Re),_.defineCustomElement("bim-toolbar-section",Nt),_.defineCustomElement("bim-viewport",Tr)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let e="";for(let r=0;r<10;r++){const n=Math.floor(Math.random()*t.length);e+=t.charAt(n)}return e}};kr._config={sectionLabelOnVerticalToolbar:!1};let Ll=kr;var Ml=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,vi=(i,t,e,r)=>{for(var n=r>1?void 0:r?Rl(t,e):t,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Ml(t,e,n),n};const Ar=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const e of t)e instanceof Nt&&(e.labelHidden=this.vertical&&!Ll.config.sectionLabelOnVerticalToolbar,e.vertical=this.vertical)}render(){return m`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Ar.styles=E`
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
  `;let Be=Ar;vi([u({type:String,reflect:!0})],Be.prototype,"icon",2);vi([u({type:Boolean,attribute:"labels-hidden",reflect:!0})],Be.prototype,"labelsHidden",2);vi([u({type:Boolean,reflect:!0})],Be.prototype,"vertical",1);var Hl=Object.defineProperty,Bl=(i,t,e,r)=>{for(var n=void 0,o=i.length-1,s;o>=0;o--)(s=i[o])&&(n=s(t,e,n)||n);return n&&Hl(t,e,n),n};const Or=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return m`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Or.styles=E`
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
  `;let Tr=Or;Bl([u({type:String,reflect:!0})],Tr.prototype,"name");export{m as a,Ll as m,Ks as t};
