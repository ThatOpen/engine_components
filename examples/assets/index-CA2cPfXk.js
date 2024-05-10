var Po=Object.defineProperty,Lo=(i,t,e)=>t in i?Po(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,lt=(i,t,e)=>(Lo(i,typeof t!="symbol"?t+"":t,e),e);const wt=Math.min,q=Math.max,ae=Math.round,Z=i=>({x:i,y:i}),jo={left:"right",right:"left",bottom:"top",top:"bottom"},Ro={start:"end",end:"start"};function $i(i,t,e){return q(i,wt(t,e))}function qt(i,t){return typeof i=="function"?i(t):i}function Y(i){return i.split("-")[0]}function ve(i){return i.split("-")[1]}function ln(i){return i==="x"?"y":"x"}function an(i){return i==="y"?"height":"width"}function Wt(i){return["top","bottom"].includes(Y(i))?"y":"x"}function cn(i){return ln(Wt(i))}function Mo(i,t,e){e===void 0&&(e=!1);const o=ve(i),n=cn(i),s=an(n);let r=n==="x"?o===(e?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=ce(r)),[r,ce(r)]}function Bo(i){const t=ce(i);return[Me(i),t,Me(t)]}function Me(i){return i.replace(/start|end/g,t=>Ro[t])}function No(i,t,e){const o=["left","right"],n=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(i){case"top":case"bottom":return e?t?n:o:t?o:n;case"left":case"right":return t?s:r;default:return[]}}function Ho(i,t,e,o){const n=ve(i);let s=No(Y(i),e==="start",o);return n&&(s=s.map(r=>r+"-"+n),t&&(s=s.concat(s.map(Me)))),s}function ce(i){return i.replace(/left|right|bottom|top/g,t=>jo[t])}function Io(i){return{top:0,right:0,bottom:0,left:0,...i}}function hn(i){return typeof i!="number"?Io(i):{top:i,right:i,bottom:i,left:i}}function xt(i){const{x:t,y:e,width:o,height:n}=i;return{width:o,height:n,top:e,left:t,right:t+o,bottom:e+n,x:t,y:e}}function Ei(i,t,e){let{reference:o,floating:n}=i;const s=Wt(t),r=cn(t),l=an(r),a=Y(t),c=s==="y",h=o.x+o.width/2-n.width/2,u=o.y+o.height/2-n.height/2,b=o[l]/2-n[l]/2;let p;switch(a){case"top":p={x:h,y:o.y-n.height};break;case"bottom":p={x:h,y:o.y+o.height};break;case"right":p={x:o.x+o.width,y:u};break;case"left":p={x:o.x-n.width,y:u};break;default:p={x:o.x,y:o.y}}switch(ve(t)){case"start":p[r]-=b*(e&&c?-1:1);break;case"end":p[r]+=b*(e&&c?-1:1);break}return p}const Do=async(i,t,e)=>{const{placement:o="bottom",strategy:n="absolute",middleware:s=[],platform:r}=e,l=s.filter(Boolean),a=await(r.isRTL==null?void 0:r.isRTL(t));let c=await r.getElementRects({reference:i,floating:t,strategy:n}),{x:h,y:u}=Ei(c,o,a),b=o,p={},f=0;for(let v=0;v<l.length;v++){const{name:g,fn:C}=l[v],{x:A,y:w,data:$,reset:T}=await C({x:h,y:u,initialPlacement:o,placement:b,strategy:n,middlewareData:p,rects:c,platform:r,elements:{reference:i,floating:t}});h=A??h,u=w??u,p={...p,[g]:{...p[g],...$}},T&&f<=50&&(f++,typeof T=="object"&&(T.placement&&(b=T.placement),T.rects&&(c=T.rects===!0?await r.getElementRects({reference:i,floating:t,strategy:n}):T.rects),{x:h,y:u}=Ei(c,b,a)),v=-1)}return{x:h,y:u,placement:b,strategy:n,middlewareData:p}};async function oi(i,t){var e;t===void 0&&(t={});const{x:o,y:n,platform:s,rects:r,elements:l,strategy:a}=i,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:u="floating",altBoundary:b=!1,padding:p=0}=qt(t,i),f=hn(p),v=l[b?u==="floating"?"reference":"floating":u],g=xt(await s.getClippingRect({element:(e=await(s.isElement==null?void 0:s.isElement(v)))==null||e?v:v.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(l.floating)),boundary:c,rootBoundary:h,strategy:a})),C=u==="floating"?{x:o,y:n,width:r.floating.width,height:r.floating.height}:r.reference,A=await(s.getOffsetParent==null?void 0:s.getOffsetParent(l.floating)),w=await(s.isElement==null?void 0:s.isElement(A))?await(s.getScale==null?void 0:s.getScale(A))||{x:1,y:1}:{x:1,y:1},$=xt(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:C,offsetParent:A,strategy:a}):C);return{top:(g.top-$.top+f.top)/w.y,bottom:($.bottom-g.bottom+f.bottom)/w.y,left:(g.left-$.left+f.left)/w.x,right:($.right-g.right+f.right)/w.x}}const Uo=function(i){return i===void 0&&(i={}),{name:"flip",options:i,async fn(t){var e,o;const{placement:n,middlewareData:s,rects:r,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:h=!0,crossAxis:u=!0,fallbackPlacements:b,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:f="none",flipAlignment:v=!0,...g}=qt(i,t);if((e=s.arrow)!=null&&e.alignmentOffset)return{};const C=Y(n),A=Y(l)===l,w=await(a.isRTL==null?void 0:a.isRTL(c.floating)),$=b||(A||!v?[ce(l)]:Bo(l));!b&&f!=="none"&&$.push(...Ho(l,v,f,w));const T=[l,...$],y=await oi(t,g),S=[];let P=((o=s.flip)==null?void 0:o.overflows)||[];if(h&&S.push(y[C]),u){const H=Mo(n,r,w);S.push(y[H[0]],y[H[1]])}if(P=[...P,{placement:n,overflows:S}],!S.every(H=>H<=0)){var V,k;const H=(((V=s.flip)==null?void 0:V.index)||0)+1,gt=T[H];if(gt)return{data:{index:H,overflows:P},reset:{placement:gt}};let Q=(k=P.filter(I=>I.overflows[0]<=0).sort((I,F)=>I.overflows[1]-F.overflows[1])[0])==null?void 0:k.placement;if(!Q)switch(p){case"bestFit":{var ft;const I=(ft=P.map(F=>[F.placement,F.overflows.filter(rt=>rt>0).reduce((rt,Oe)=>rt+Oe,0)]).sort((F,rt)=>F[1]-rt[1])[0])==null?void 0:ft[0];I&&(Q=I);break}case"initialPlacement":Q=l;break}if(n!==Q)return{reset:{placement:Q}}}return{}}}};function un(i){const t=wt(...i.map(s=>s.left)),e=wt(...i.map(s=>s.top)),o=q(...i.map(s=>s.right)),n=q(...i.map(s=>s.bottom));return{x:t,y:e,width:o-t,height:n-e}}function Vo(i){const t=i.slice().sort((n,s)=>n.y-s.y),e=[];let o=null;for(let n=0;n<t.length;n++){const s=t[n];!o||s.y-o.y>o.height/2?e.push([s]):e[e.length-1].push(s),o=s}return e.map(n=>xt(un(n)))}const Fo=function(i){return i===void 0&&(i={}),{name:"inline",options:i,async fn(t){const{placement:e,elements:o,rects:n,platform:s,strategy:r}=t,{padding:l=2,x:a,y:c}=qt(i,t),h=Array.from(await(s.getClientRects==null?void 0:s.getClientRects(o.reference))||[]),u=Vo(h),b=xt(un(h)),p=hn(l);function f(){if(u.length===2&&u[0].left>u[1].right&&a!=null&&c!=null)return u.find(g=>a>g.left-p.left&&a<g.right+p.right&&c>g.top-p.top&&c<g.bottom+p.bottom)||b;if(u.length>=2){if(Wt(e)==="y"){const k=u[0],ft=u[u.length-1],H=Y(e)==="top",gt=k.top,Q=ft.bottom,I=H?k.left:ft.left,F=H?k.right:ft.right,rt=F-I,Oe=Q-gt;return{top:gt,bottom:Q,left:I,right:F,width:rt,height:Oe,x:I,y:gt}}const g=Y(e)==="left",C=q(...u.map(k=>k.right)),A=wt(...u.map(k=>k.left)),w=u.filter(k=>g?k.left===A:k.right===C),$=w[0].top,T=w[w.length-1].bottom,y=A,S=C,P=S-y,V=T-$;return{top:$,bottom:T,left:y,right:S,width:P,height:V,x:y,y:$}}return b}const v=await s.getElementRects({reference:{getBoundingClientRect:f},floating:o.floating,strategy:r});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function qo(i,t){const{placement:e,platform:o,elements:n}=i,s=await(o.isRTL==null?void 0:o.isRTL(n.floating)),r=Y(e),l=ve(e),a=Wt(e)==="y",c=["left","top"].includes(r)?-1:1,h=s&&a?-1:1,u=qt(t,i);let{mainAxis:b,crossAxis:p,alignmentAxis:f}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return l&&typeof f=="number"&&(p=l==="end"?f*-1:f),a?{x:p*h,y:b*c}:{x:b*c,y:p*h}}const dn=function(i){return{name:"offset",options:i,async fn(t){var e,o;const{x:n,y:s,placement:r,middlewareData:l}=t,a=await qo(t,i);return r===((e=l.offset)==null?void 0:e.placement)&&(o=l.arrow)!=null&&o.alignmentOffset?{}:{x:n+a.x,y:s+a.y,data:{...a,placement:r}}}}},Wo=function(i){return i===void 0&&(i={}),{name:"shift",options:i,async fn(t){const{x:e,y:o,placement:n}=t,{mainAxis:s=!0,crossAxis:r=!1,limiter:l={fn:g=>{let{x:C,y:A}=g;return{x:C,y:A}}},...a}=qt(i,t),c={x:e,y:o},h=await oi(t,a),u=Wt(Y(n)),b=ln(u);let p=c[b],f=c[u];if(s){const g=b==="y"?"top":"left",C=b==="y"?"bottom":"right",A=p+h[g],w=p-h[C];p=$i(A,p,w)}if(r){const g=u==="y"?"top":"left",C=u==="y"?"bottom":"right",A=f+h[g],w=f-h[C];f=$i(A,f,w)}const v=l.fn({...t,[b]:p,[u]:f});return{...v,data:{x:v.x-e,y:v.y-o}}}}};function tt(i){return pn(i)?(i.nodeName||"").toLowerCase():"#document"}function L(i){var t;return(i==null||(t=i.ownerDocument)==null?void 0:t.defaultView)||window}function it(i){var t;return(t=(pn(i)?i.ownerDocument:i.document)||window.document)==null?void 0:t.documentElement}function pn(i){return i instanceof Node||i instanceof L(i).Node}function G(i){return i instanceof Element||i instanceof L(i).Element}function D(i){return i instanceof HTMLElement||i instanceof L(i).HTMLElement}function Ai(i){return typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof L(i).ShadowRoot}function Yt(i){const{overflow:t,overflowX:e,overflowY:o,display:n}=R(i);return/auto|scroll|overlay|hidden|clip/.test(t+o+e)&&!["inline","contents"].includes(n)}function Yo(i){return["table","td","th"].includes(tt(i))}function si(i){const t=ri(),e=R(i);return e.transform!=="none"||e.perspective!=="none"||(e.containerType?e.containerType!=="normal":!1)||!t&&(e.backdropFilter?e.backdropFilter!=="none":!1)||!t&&(e.filter?e.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(e.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(e.contain||"").includes(o))}function Go(i){let t=$t(i);for(;D(t)&&!ye(t);){if(si(t))return t;t=$t(t)}return null}function ri(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function ye(i){return["html","body","#document"].includes(tt(i))}function R(i){return L(i).getComputedStyle(i)}function _e(i){return G(i)?{scrollLeft:i.scrollLeft,scrollTop:i.scrollTop}:{scrollLeft:i.pageXOffset,scrollTop:i.pageYOffset}}function $t(i){if(tt(i)==="html")return i;const t=i.assignedSlot||i.parentNode||Ai(i)&&i.host||it(i);return Ai(t)?t.host:t}function bn(i){const t=$t(i);return ye(t)?i.ownerDocument?i.ownerDocument.body:i.body:D(t)&&Yt(t)?t:bn(t)}function Be(i,t,e){var o;t===void 0&&(t=[]),e===void 0&&(e=!0);const n=bn(i),s=n===((o=i.ownerDocument)==null?void 0:o.body),r=L(n);return s?t.concat(r,r.visualViewport||[],Yt(n)?n:[],r.frameElement&&e?Be(r.frameElement):[]):t.concat(n,Be(n,[],e))}function mn(i){const t=R(i);let e=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const n=D(i),s=n?i.offsetWidth:e,r=n?i.offsetHeight:o,l=ae(e)!==s||ae(o)!==r;return l&&(e=s,o=r),{width:e,height:o,$:l}}function fn(i){return G(i)?i:i.contextElement}function _t(i){const t=fn(i);if(!D(t))return Z(1);const e=t.getBoundingClientRect(),{width:o,height:n,$:s}=mn(t);let r=(s?ae(e.width):e.width)/o,l=(s?ae(e.height):e.height)/n;return(!r||!Number.isFinite(r))&&(r=1),(!l||!Number.isFinite(l))&&(l=1),{x:r,y:l}}const Qo=Z(0);function gn(i){const t=L(i);return!ri()||!t.visualViewport?Qo:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Jo(i,t,e){return t===void 0&&(t=!1),!e||t&&e!==L(i)?!1:t}function Nt(i,t,e,o){t===void 0&&(t=!1),e===void 0&&(e=!1);const n=i.getBoundingClientRect(),s=fn(i);let r=Z(1);t&&(o?G(o)&&(r=_t(o)):r=_t(i));const l=Jo(s,e,o)?gn(s):Z(0);let a=(n.left+l.x)/r.x,c=(n.top+l.y)/r.y,h=n.width/r.x,u=n.height/r.y;if(s){const b=L(s),p=o&&G(o)?L(o):o;let f=b,v=f.frameElement;for(;v&&o&&p!==f;){const g=_t(v),C=v.getBoundingClientRect(),A=R(v),w=C.left+(v.clientLeft+parseFloat(A.paddingLeft))*g.x,$=C.top+(v.clientTop+parseFloat(A.paddingTop))*g.y;a*=g.x,c*=g.y,h*=g.x,u*=g.y,a+=w,c+=$,f=L(v),v=f.frameElement}}return xt({width:h,height:u,x:a,y:c})}const Xo=[":popover-open",":modal"];function vn(i){return Xo.some(t=>{try{return i.matches(t)}catch{return!1}})}function Ko(i){let{elements:t,rect:e,offsetParent:o,strategy:n}=i;const s=n==="fixed",r=it(o),l=t?vn(t.floating):!1;if(o===r||l&&s)return e;let a={scrollLeft:0,scrollTop:0},c=Z(1);const h=Z(0),u=D(o);if((u||!u&&!s)&&((tt(o)!=="body"||Yt(r))&&(a=_e(o)),D(o))){const b=Nt(o);c=_t(o),h.x=b.x+o.clientLeft,h.y=b.y+o.clientTop}return{width:e.width*c.x,height:e.height*c.y,x:e.x*c.x-a.scrollLeft*c.x+h.x,y:e.y*c.y-a.scrollTop*c.y+h.y}}function Zo(i){return Array.from(i.getClientRects())}function yn(i){return Nt(it(i)).left+_e(i).scrollLeft}function ts(i){const t=it(i),e=_e(i),o=i.ownerDocument.body,n=q(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),s=q(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let r=-e.scrollLeft+yn(i);const l=-e.scrollTop;return R(o).direction==="rtl"&&(r+=q(t.clientWidth,o.clientWidth)-n),{width:n,height:s,x:r,y:l}}function es(i,t){const e=L(i),o=it(i),n=e.visualViewport;let s=o.clientWidth,r=o.clientHeight,l=0,a=0;if(n){s=n.width,r=n.height;const c=ri();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:s,height:r,x:l,y:a}}function is(i,t){const e=Nt(i,!0,t==="fixed"),o=e.top+i.clientTop,n=e.left+i.clientLeft,s=D(i)?_t(i):Z(1),r=i.clientWidth*s.x,l=i.clientHeight*s.y,a=n*s.x,c=o*s.y;return{width:r,height:l,x:a,y:c}}function Ci(i,t,e){let o;if(t==="viewport")o=es(i,e);else if(t==="document")o=ts(it(i));else if(G(t))o=is(t,e);else{const n=gn(i);o={...t,x:t.x-n.x,y:t.y-n.y}}return xt(o)}function _n(i,t){const e=$t(i);return e===t||!G(e)||ye(e)?!1:R(e).position==="fixed"||_n(e,t)}function ns(i,t){const e=t.get(i);if(e)return e;let o=Be(i,[],!1).filter(l=>G(l)&&tt(l)!=="body"),n=null;const s=R(i).position==="fixed";let r=s?$t(i):i;for(;G(r)&&!ye(r);){const l=R(r),a=si(r);!a&&l.position==="fixed"&&(n=null),(s?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||Yt(r)&&!a&&_n(i,r))?o=o.filter(c=>c!==r):n=l,r=$t(r)}return t.set(i,o),o}function os(i){let{element:t,boundary:e,rootBoundary:o,strategy:n}=i;const s=[...e==="clippingAncestors"?ns(t,this._c):[].concat(e),o],r=s[0],l=s.reduce((a,c)=>{const h=Ci(t,c,n);return a.top=q(h.top,a.top),a.right=wt(h.right,a.right),a.bottom=wt(h.bottom,a.bottom),a.left=q(h.left,a.left),a},Ci(t,r,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function ss(i){const{width:t,height:e}=mn(i);return{width:t,height:e}}function rs(i,t,e){const o=D(t),n=it(t),s=e==="fixed",r=Nt(i,!0,s,t);let l={scrollLeft:0,scrollTop:0};const a=Z(0);if(o||!o&&!s)if((tt(t)!=="body"||Yt(n))&&(l=_e(t)),o){const u=Nt(t,!0,s,t);a.x=u.x+t.clientLeft,a.y=u.y+t.clientTop}else n&&(a.x=yn(n));const c=r.left+l.scrollLeft-a.x,h=r.top+l.scrollTop-a.y;return{x:c,y:h,width:r.width,height:r.height}}function ki(i,t){return!D(i)||R(i).position==="fixed"?null:t?t(i):i.offsetParent}function wn(i,t){const e=L(i);if(!D(i)||vn(i))return e;let o=ki(i,t);for(;o&&Yo(o)&&R(o).position==="static";)o=ki(o,t);return o&&(tt(o)==="html"||tt(o)==="body"&&R(o).position==="static"&&!si(o))?e:o||Go(i)||e}const ls=async function(i){const t=this.getOffsetParent||wn,e=this.getDimensions;return{reference:rs(i.reference,await t(i.floating),i.strategy),floating:{x:0,y:0,...await e(i.floating)}}};function as(i){return R(i).direction==="rtl"}const cs={convertOffsetParentRelativeRectToViewportRelativeRect:Ko,getDocumentElement:it,getClippingRect:os,getOffsetParent:wn,getElementRects:ls,getClientRects:Zo,getDimensions:ss,getScale:_t,isElement:G,isRTL:as},xn=Wo,$n=Uo,En=Fo,An=(i,t,e)=>{const o=new Map,n={platform:cs,...e},s={...n.platform,_c:o};return Do(i,t,{...n,platform:s})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const se=globalThis,li=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ai=Symbol(),Si=new WeakMap;let Cn=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==ai)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o;const t=this.t;if(li&&i===void 0){const e=t!==void 0&&t.length===1;e&&(i=Si.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&Si.set(t,i))}return i}toString(){return this.cssText}};const hs=i=>new Cn(typeof i=="string"?i:i+"",void 0,ai),x=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((o,n,s)=>o+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[s+1],i[0]);return new Cn(e,i,ai)},us=(i,t)=>{if(li)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const o=document.createElement("style"),n=se.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,i.appendChild(o)}},Oi=li?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return hs(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ds,defineProperty:ps,getOwnPropertyDescriptor:bs,getOwnPropertyNames:ms,getOwnPropertySymbols:fs,getPrototypeOf:gs}=Object,Et=globalThis,Ti=Et.trustedTypes,vs=Ti?Ti.emptyScript:"",zi=Et.reactiveElementPolyfillSupport,Lt=(i,t)=>i,he={toAttribute(i,t){switch(t){case Boolean:i=i?vs:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ci=(i,t)=>!ds(i,t),Pi={attribute:!0,type:String,converter:he,reflect:!1,hasChanged:ci};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Et.litPropertyMetadata??(Et.litPropertyMetadata=new WeakMap);class yt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Pi){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&ps(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){const{get:n,set:s}=bs(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get(){return n==null?void 0:n.call(this)},set(r){const l=n==null?void 0:n.call(this);s.call(this,r),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Pi}static _$Ei(){if(this.hasOwnProperty(Lt("elementProperties")))return;const t=gs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Lt("properties"))){const e=this.properties,o=[...ms(e),...fs(e)];for(const n of o)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(const[e,o]of this.elementProperties){const n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const n of o)e.unshift(Oi(n))}else t!==void 0&&e.push(Oi(t));return e}static _$Eu(t,e){const o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return us(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var o;return(o=e.hostConnected)==null?void 0:o.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var o;return(o=e.hostDisconnected)==null?void 0:o.call(e)})}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EC(t,e){var o;const n=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,n);if(s!==void 0&&n.reflect===!0){const r=(((o=n.converter)==null?void 0:o.toAttribute)!==void 0?n.converter:he).toAttribute(e,n.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){var o;const n=this.constructor,s=n._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=n.getPropertyOptions(s),l=typeof r.converter=="function"?{fromAttribute:r.converter}:((o=r.converter)==null?void 0:o.fromAttribute)!==void 0?r.converter:he;this._$Em=s,this[s]=l.fromAttribute(e,r.type),this._$Em=null}}requestUpdate(t,e,o){if(t!==void 0){if(o??(o=this.constructor.getPropertyOptions(t)),!(o.hasChanged??ci)(this[t],e))return;this.P(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,o){this._$AL.has(t)||this._$AL.set(t,e),o.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[s,r]of n)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),(t=this._$EO)==null||t.forEach(n=>{var s;return(s=n.hostUpdate)==null?void 0:s.call(n)}),this.update(o)):this._$EU()}catch(n){throw e=!1,this._$EU(),n}e&&this._$AE(o)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(o=>{var n;return(n=o.hostUpdated)==null?void 0:n.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}yt.elementStyles=[],yt.shadowRootOptions={mode:"open"},yt[Lt("elementProperties")]=new Map,yt[Lt("finalized")]=new Map,zi==null||zi({ReactiveElement:yt}),(Et.reactiveElementVersions??(Et.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=globalThis,de=ue.trustedTypes,Li=de?de.createPolicy("lit-html",{createHTML:i=>i}):void 0,kn="$lit$",J=`lit$${Math.random().toFixed(9).slice(2)}$`,Sn="?"+J,ys=`<${Sn}>`,ut=document,Ht=()=>ut.createComment(""),It=i=>i===null||typeof i!="object"&&typeof i!="function",On=Array.isArray,_s=i=>On(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Te=`[ 	
\f\r]`,Pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ji=/-->/g,Ri=/>/g,at=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mi=/'/g,Bi=/"/g,Tn=/^(?:script|style|textarea|title)$/i,ws=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=ws(1),At=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Ni=new WeakMap,ct=ut.createTreeWalker(ut,129);function zn(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Li!==void 0?Li.createHTML(t):t}const xs=(i,t)=>{const e=i.length-1,o=[];let n,s=t===2?"<svg>":"",r=Pt;for(let l=0;l<e;l++){const a=i[l];let c,h,u=-1,b=0;for(;b<a.length&&(r.lastIndex=b,h=r.exec(a),h!==null);)b=r.lastIndex,r===Pt?h[1]==="!--"?r=ji:h[1]!==void 0?r=Ri:h[2]!==void 0?(Tn.test(h[2])&&(n=RegExp("</"+h[2],"g")),r=at):h[3]!==void 0&&(r=at):r===at?h[0]===">"?(r=n??Pt,u=-1):h[1]===void 0?u=-2:(u=r.lastIndex-h[2].length,c=h[1],r=h[3]===void 0?at:h[3]==='"'?Bi:Mi):r===Bi||r===Mi?r=at:r===ji||r===Ri?r=Pt:(r=at,n=void 0);const p=r===at&&i[l+1].startsWith("/>")?" ":"";s+=r===Pt?a+ys:u>=0?(o.push(c),a.slice(0,u)+kn+a.slice(u)+J+p):a+J+(u===-2?l:p)}return[zn(i,s+(i[e]||"<?>")+(t===2?"</svg>":"")),o]};class Dt{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let s=0,r=0;const l=t.length-1,a=this.parts,[c,h]=xs(t,e);if(this.el=Dt.createElement(c,o),ct.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=ct.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(kn)){const b=h[r++],p=n.getAttribute(u).split(J),f=/([.?@])?(.*)/.exec(b);a.push({type:1,index:s,name:f[2],strings:p,ctor:f[1]==="."?Es:f[1]==="?"?As:f[1]==="@"?Cs:we}),n.removeAttribute(u)}else u.startsWith(J)&&(a.push({type:6,index:s}),n.removeAttribute(u));if(Tn.test(n.tagName)){const u=n.textContent.split(J),b=u.length-1;if(b>0){n.textContent=de?de.emptyScript:"";for(let p=0;p<b;p++)n.append(u[p],Ht()),ct.nextNode(),a.push({type:2,index:++s});n.append(u[b],Ht())}}}else if(n.nodeType===8)if(n.data===Sn)a.push({type:2,index:s});else{let u=-1;for(;(u=n.data.indexOf(J,u+1))!==-1;)a.push({type:7,index:s}),u+=J.length-1}s++}}static createElement(t,e){const o=ut.createElement("template");return o.innerHTML=t,o}}function Ct(i,t,e=i,o){var n,s;if(t===At)return t;let r=o!==void 0?(n=e._$Co)==null?void 0:n[o]:e._$Cl;const l=It(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==l&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),l===void 0?r=void 0:(r=new l(i),r._$AT(i,e,o)),o!==void 0?(e._$Co??(e._$Co=[]))[o]=r:e._$Cl=r),r!==void 0&&(t=Ct(i,r._$AS(i,t.values),r,o)),t}class $s{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,n=((t==null?void 0:t.creationScope)??ut).importNode(e,!0);ct.currentNode=n;let s=ct.nextNode(),r=0,l=0,a=o[0];for(;a!==void 0;){if(r===a.index){let c;a.type===2?c=new Gt(s,s.nextSibling,this,t):a.type===1?c=new a.ctor(s,a.name,a.strings,this,t):a.type===6&&(c=new ks(s,this,t)),this._$AV.push(c),a=o[++l]}r!==(a==null?void 0:a.index)&&(s=ct.nextNode(),r++)}return ct.currentNode=ut,n}p(t){let e=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class Gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Ct(this,t,e),It(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==At&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):_s(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==O&&It(this._$AH)?this._$AA.nextSibling.data=t:this.T(ut.createTextNode(t)),this._$AH=t}$(t){var e;const{values:o,_$litType$:n}=t,s=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Dt.createElement(zn(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)==null?void 0:e._$AD)===s)this._$AH.p(o);else{const r=new $s(s,this),l=r.u(this.options);r.p(o),this.T(l),this._$AH=r}}_$AC(t){let e=Ni.get(t.strings);return e===void 0&&Ni.set(t.strings,e=new Dt(t)),e}k(t){On(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,n=0;for(const s of t)n===e.length?e.push(o=new Gt(this.S(Ht()),this.S(Ht()),this,this.options)):o=e[n],o._$AI(s),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class we{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,s){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=O}_$AI(t,e=this,o,n){const s=this.strings;let r=!1;if(s===void 0)t=Ct(this,t,e,0),r=!It(t)||t!==this._$AH&&t!==At,r&&(this._$AH=t);else{const l=t;let a,c;for(t=s[0],a=0;a<s.length-1;a++)c=Ct(this,l[o+a],e,a),c===At&&(c=this._$AH[a]),r||(r=!It(c)||c!==this._$AH[a]),c===O?t=O:t!==O&&(t+=(c??"")+s[a+1]),this._$AH[a]=c}r&&!n&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Es extends we{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class As extends we{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class Cs extends we{constructor(t,e,o,n,s){super(t,e,o,n,s),this.type=5}_$AI(t,e=this){if((t=Ct(this,t,e,0)??O)===At)return;const o=this._$AH,n=t===O&&o!==O||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==O&&(o===O||n);n&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ks{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Ct(this,t)}}const Hi=ue.litHtmlPolyfillSupport;Hi==null||Hi(Dt,Gt),(ue.litHtmlVersions??(ue.litHtmlVersions=[])).push("3.1.3");const Ne=(i,t,e)=>{const o=(e==null?void 0:e.renderBefore)??t;let n=o._$litPart$;if(n===void 0){const s=(e==null?void 0:e.renderBefore)??null;o._$litPart$=n=new Gt(t.insertBefore(Ht(),s),s,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let jt=class extends yt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const t=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=t.firstChild),t}update(i){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(i),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){var i;super.connectedCallback(),(i=this._$Do)==null||i.setConnected(!0)}disconnectedCallback(){var i;super.disconnectedCallback(),(i=this._$Do)==null||i.setConnected(!1)}render(){return At}};var Ii;jt._$litElement$=!0,jt.finalized=!0,(Ii=globalThis.litElementHydrateSupport)==null||Ii.call(globalThis,{LitElement:jt});const Di=globalThis.litElementPolyfillSupport;Di==null||Di({LitElement:jt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ss={attribute:!0,type:String,converter:he,reflect:!1,hasChanged:ci},Os=(i=Ss,t,e)=>{const{kind:o,metadata:n}=e;let s=globalThis.litPropertyMetadata.get(n);if(s===void 0&&globalThis.litPropertyMetadata.set(n,s=new Map),s.set(e.name,i),o==="accessor"){const{name:r}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,a,i)},init(l){return l!==void 0&&this.P(r,void 0,i),l}}}if(o==="setter"){const{name:r}=e;return function(l){const a=this[r];t.call(this,l),this.requestUpdate(r,a,i)}}throw Error("Unsupported decorator location: "+o)};function d(i){return(t,e)=>typeof e=="object"?Os(i,t,e):((o,n,s)=>{const r=n.hasOwnProperty(s);return n.constructor.createProperty(s,r?{...o,wrapped:!0}:o),r?Object.getOwnPropertyDescriptor(n,s):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Pn(i){return d({...i,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ts=i=>i.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zs={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ps=i=>(...t)=>({_$litDirective$:i,values:t});let Ls=class{constructor(i){}get _$AU(){return this._$AM._$AU}_$AT(i,t,e){this._$Ct=i,this._$AM=t,this._$Ci=e}_$AS(i,t){return this.update(i,t)}update(i,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=(i,t)=>{var e;const o=i._$AN;if(o===void 0)return!1;for(const n of o)(e=n._$AO)==null||e.call(n,t,!1),Rt(n,t);return!0},pe=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while((e==null?void 0:e.size)===0)},Ln=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),Ms(t)}};function js(i){this._$AN!==void 0?(pe(this),this._$AM=i,Ln(this)):this._$AM=i}function Rs(i,t=!1,e=0){const o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let s=e;s<o.length;s++)Rt(o[s],!1),pe(o[s]);else o!=null&&(Rt(o,!1),pe(o));else Rt(this,i)}const Ms=i=>{i.type==zs.CHILD&&(i._$AP??(i._$AP=Rs),i._$AQ??(i._$AQ=js))};class Bs extends Ls{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,o){super._$AT(t,e,o),Ln(this),this.isConnected=t._$AU}_$AO(t,e=!0){var o,n;t!==this.isConnected&&(this.isConnected=t,t?(o=this.reconnected)==null||o.call(this):(n=this.disconnected)==null||n.call(this)),e&&(Rt(this,t),pe(this))}setValue(t){if(Ts(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K=()=>new Ns;class Ns{}const ze=new WeakMap,W=Ps(class extends Bs{render(i){return O}update(i,[t]){var e;const o=t!==this.Y;return o&&this.Y!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.Y=t,this.ht=(e=i.options)==null?void 0:e.host,this.rt(this.ct=i.element)),O}rt(i){if(typeof this.Y=="function"){const t=this.ht??globalThis;let e=ze.get(t);e===void 0&&(e=new WeakMap,ze.set(t,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),e.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){var i,t;return typeof this.Y=="function"?(i=ze.get(this.ht??globalThis))==null?void 0:i.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class E extends jt{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const o of t)this.elements.add(o);const e=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const o of e)o.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(e=>{const o=e[0];if(!o.isIntersecting)return;const n=o.target;t.unobserve(n);const s=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][s];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const e=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,o=[...this.elements][e];o&&t.observe(o)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const e of this.elements)t.unobserve(e);this.visibleElements=[],this.observeLastElement()}}static create(t,e){const o=document.createDocumentFragment();if(t.length===0)return Ne(t(),o),o.firstElementChild;if(!e)throw new Error("UIComponent: Initial state is required for statefull components.");let n=e;const s=t,r=l=>(n={...n,...l},Ne(s(n),o),n);return r(e),[o.firstElementChild,r]}}/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const jn=Object.freeze({left:0,top:0,width:16,height:16}),be=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Qt=Object.freeze({...jn,...be}),He=Object.freeze({...Qt,body:"",hidden:!1}),Hs=Object.freeze({width:null,height:null}),Rn=Object.freeze({...Hs,...be});function Is(i,t=0){const e=i.replace(/^-?[0-9.]*/,"");function o(n){for(;n<0;)n+=4;return n%4}if(e===""){const n=parseInt(i);return isNaN(n)?0:o(n)}else if(e!==i){let n=0;switch(e){case"%":n=25;break;case"deg":n=90}if(n){let s=parseFloat(i.slice(0,i.length-e.length));return isNaN(s)?0:(s=s/n,s%1===0?o(s):0)}}return t}const Ds=/[\s,]+/;function Us(i,t){t.split(Ds).forEach(e=>{switch(e.trim()){case"horizontal":i.hFlip=!0;break;case"vertical":i.vFlip=!0;break}})}const Mn={...Rn,preserveAspectRatio:""};function Ui(i){const t={...Mn},e=(o,n)=>i.getAttribute(o)||n;return t.width=e("width",null),t.height=e("height",null),t.rotate=Is(e("rotate","")),Us(t,e("flip","")),t.preserveAspectRatio=e("preserveAspectRatio",e("preserveaspectratio","")),t}function Vs(i,t){for(const e in Mn)if(i[e]!==t[e])return!0;return!1}const Mt=/^[a-z0-9]+(-[a-z0-9]+)*$/,Jt=(i,t,e,o="")=>{const n=i.split(":");if(i.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;o=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:o,prefix:a,name:l};return t&&!re(c)?null:c}const s=n[0],r=s.split("-");if(r.length>1){const l={provider:o,prefix:r.shift(),name:r.join("-")};return t&&!re(l)?null:l}if(e&&o===""){const l={provider:o,prefix:"",name:s};return t&&!re(l,e)?null:l}return null},re=(i,t)=>i?!!((i.provider===""||i.provider.match(Mt))&&(t&&i.prefix===""||i.prefix.match(Mt))&&i.name.match(Mt)):!1;function Fs(i,t){const e={};!i.hFlip!=!t.hFlip&&(e.hFlip=!0),!i.vFlip!=!t.vFlip&&(e.vFlip=!0);const o=((i.rotate||0)+(t.rotate||0))%4;return o&&(e.rotate=o),e}function Vi(i,t){const e=Fs(i,t);for(const o in He)o in be?o in i&&!(o in e)&&(e[o]=be[o]):o in t?e[o]=t[o]:o in i&&(e[o]=i[o]);return e}function qs(i,t){const e=i.icons,o=i.aliases||Object.create(null),n=Object.create(null);function s(r){if(e[r])return n[r]=[];if(!(r in n)){n[r]=null;const l=o[r]&&o[r].parent,a=l&&s(l);a&&(n[r]=[l].concat(a))}return n[r]}return Object.keys(e).concat(Object.keys(o)).forEach(s),n}function Ws(i,t,e){const o=i.icons,n=i.aliases||Object.create(null);let s={};function r(l){s=Vi(o[l]||n[l],s)}return r(t),e.forEach(r),Vi(i,s)}function Bn(i,t){const e=[];if(typeof i!="object"||typeof i.icons!="object")return e;i.not_found instanceof Array&&i.not_found.forEach(n=>{t(n,null),e.push(n)});const o=qs(i);for(const n in o){const s=o[n];s&&(t(n,Ws(i,n,s)),e.push(n))}return e}const Ys={provider:"",aliases:{},not_found:{},...jn};function Pe(i,t){for(const e in t)if(e in i&&typeof i[e]!=typeof t[e])return!1;return!0}function Nn(i){if(typeof i!="object"||i===null)return null;const t=i;if(typeof t.prefix!="string"||!i.icons||typeof i.icons!="object"||!Pe(i,Ys))return null;const e=t.icons;for(const n in e){const s=e[n];if(!n.match(Mt)||typeof s.body!="string"||!Pe(s,He))return null}const o=t.aliases||Object.create(null);for(const n in o){const s=o[n],r=s.parent;if(!n.match(Mt)||typeof r!="string"||!e[r]&&!o[r]||!Pe(s,He))return null}return t}const me=Object.create(null);function Gs(i,t){return{provider:i,prefix:t,icons:Object.create(null),missing:new Set}}function et(i,t){const e=me[i]||(me[i]=Object.create(null));return e[t]||(e[t]=Gs(i,t))}function hi(i,t){return Nn(t)?Bn(t,(e,o)=>{o?i.icons[e]=o:i.missing.add(e)}):[]}function Qs(i,t,e){try{if(typeof e.body=="string")return i.icons[t]={...e},!0}catch{}return!1}function Js(i,t){let e=[];return(typeof i=="string"?[i]:Object.keys(me)).forEach(o=>{(typeof o=="string"&&typeof t=="string"?[t]:Object.keys(me[o]||{})).forEach(n=>{const s=et(o,n);e=e.concat(Object.keys(s.icons).map(r=>(o!==""?"@"+o+":":"")+n+":"+r))})}),e}let Ut=!1;function Hn(i){return typeof i=="boolean"&&(Ut=i),Ut}function Vt(i){const t=typeof i=="string"?Jt(i,!0,Ut):i;if(t){const e=et(t.provider,t.prefix),o=t.name;return e.icons[o]||(e.missing.has(o)?null:void 0)}}function In(i,t){const e=Jt(i,!0,Ut);if(!e)return!1;const o=et(e.provider,e.prefix);return Qs(o,e.name,t)}function Fi(i,t){if(typeof i!="object")return!1;if(typeof t!="string"&&(t=i.provider||""),Ut&&!t&&!i.prefix){let n=!1;return Nn(i)&&(i.prefix="",Bn(i,(s,r)=>{r&&In(s,r)&&(n=!0)})),n}const e=i.prefix;if(!re({provider:t,prefix:e,name:"a"}))return!1;const o=et(t,e);return!!hi(o,i)}function qi(i){return!!Vt(i)}function Xs(i){const t=Vt(i);return t?{...Qt,...t}:null}function Ks(i){const t={loaded:[],missing:[],pending:[]},e=Object.create(null);i.sort((n,s)=>n.provider!==s.provider?n.provider.localeCompare(s.provider):n.prefix!==s.prefix?n.prefix.localeCompare(s.prefix):n.name.localeCompare(s.name));let o={provider:"",prefix:"",name:""};return i.forEach(n=>{if(o.name===n.name&&o.prefix===n.prefix&&o.provider===n.provider)return;o=n;const s=n.provider,r=n.prefix,l=n.name,a=e[s]||(e[s]=Object.create(null)),c=a[r]||(a[r]=et(s,r));let h;l in c.icons?h=t.loaded:r===""||c.missing.has(l)?h=t.missing:h=t.pending;const u={provider:s,prefix:r,name:l};h.push(u)}),t}function Dn(i,t){i.forEach(e=>{const o=e.loaderCallbacks;o&&(e.loaderCallbacks=o.filter(n=>n.id!==t))})}function Zs(i){i.pendingCallbacksFlag||(i.pendingCallbacksFlag=!0,setTimeout(()=>{i.pendingCallbacksFlag=!1;const t=i.loaderCallbacks?i.loaderCallbacks.slice(0):[];if(!t.length)return;let e=!1;const o=i.provider,n=i.prefix;t.forEach(s=>{const r=s.icons,l=r.pending.length;r.pending=r.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(i.icons[c])r.loaded.push({provider:o,prefix:n,name:c});else if(i.missing.has(c))r.missing.push({provider:o,prefix:n,name:c});else return e=!0,!0;return!1}),r.pending.length!==l&&(e||Dn([i],s.id),s.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),s.abort))})}))}let tr=0;function er(i,t,e){const o=tr++,n=Dn.bind(null,e,o);if(!t.pending.length)return n;const s={id:o,icons:t,callback:i,abort:n};return e.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(s)}),n}const Ie=Object.create(null);function Wi(i,t){Ie[i]=t}function De(i){return Ie[i]||Ie[""]}function ir(i,t=!0,e=!1){const o=[];return i.forEach(n=>{const s=typeof n=="string"?Jt(n,t,e):n;s&&o.push(s)}),o}var nr={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function or(i,t,e,o){const n=i.resources.length,s=i.random?Math.floor(Math.random()*n):i.index;let r;if(i.random){let y=i.resources.slice(0);for(r=[];y.length>1;){const S=Math.floor(Math.random()*y.length);r.push(y[S]),y=y.slice(0,S).concat(y.slice(S+1))}r=r.concat(y)}else r=i.resources.slice(s).concat(i.resources.slice(0,s));const l=Date.now();let a="pending",c=0,h,u=null,b=[],p=[];typeof o=="function"&&p.push(o);function f(){u&&(clearTimeout(u),u=null)}function v(){a==="pending"&&(a="aborted"),f(),b.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),b=[]}function g(y,S){S&&(p=[]),typeof y=="function"&&p.push(y)}function C(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:b.length,subscribe:g,abort:v}}function A(){a="failed",p.forEach(y=>{y(void 0,h)})}function w(){b.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),b=[]}function $(y,S,P){const V=S!=="success";switch(b=b.filter(k=>k!==y),a){case"pending":break;case"failed":if(V||!i.dataAfterTimeout)return;break;default:return}if(S==="abort"){h=P,A();return}if(V){h=P,b.length||(r.length?T():A());return}if(f(),w(),!i.random){const k=i.resources.indexOf(y.resource);k!==-1&&k!==i.index&&(i.index=k)}a="completed",p.forEach(k=>{k(P)})}function T(){if(a!=="pending")return;f();const y=r.shift();if(y===void 0){if(b.length){u=setTimeout(()=>{f(),a==="pending"&&(w(),A())},i.timeout);return}A();return}const S={status:"pending",resource:y,callback:(P,V)=>{$(S,P,V)}};b.push(S),c++,u=setTimeout(T,i.rotate),e(y,t,S.callback)}return setTimeout(T),C}function Un(i){const t={...nr,...i};let e=[];function o(){e=e.filter(r=>r().status==="pending")}function n(r,l,a){const c=or(t,r,l,(h,u)=>{o(),a&&a(h,u)});return e.push(c),c}function s(r){return e.find(l=>r(l))||null}return{query:n,find:s,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:o}}function ui(i){let t;if(typeof i.resources=="string")t=[i.resources];else if(t=i.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:i.path||"/",maxURL:i.maxURL||500,rotate:i.rotate||750,timeout:i.timeout||5e3,random:i.random===!0,index:i.index||0,dataAfterTimeout:i.dataAfterTimeout!==!1}}const xe=Object.create(null),ie=["https://api.simplesvg.com","https://api.unisvg.com"],Ue=[];for(;ie.length>0;)ie.length===1||Math.random()>.5?Ue.push(ie.shift()):Ue.push(ie.pop());xe[""]=ui({resources:["https://api.iconify.design"].concat(Ue)});function Yi(i,t){const e=ui(t);return e===null?!1:(xe[i]=e,!0)}function $e(i){return xe[i]}function sr(){return Object.keys(xe)}function Gi(){}const Le=Object.create(null);function rr(i){if(!Le[i]){const t=$e(i);if(!t)return;const e=Un(t),o={config:t,redundancy:e};Le[i]=o}return Le[i]}function Vn(i,t,e){let o,n;if(typeof i=="string"){const s=De(i);if(!s)return e(void 0,424),Gi;n=s.send;const r=rr(i);r&&(o=r.redundancy)}else{const s=ui(i);if(s){o=Un(s);const r=i.resources?i.resources[0]:"",l=De(r);l&&(n=l.send)}}return!o||!n?(e(void 0,424),Gi):o.query(t,n,e)().abort}const Qi="iconify2",Ft="iconify",Fn=Ft+"-count",Ji=Ft+"-version",qn=36e5,lr=168,ar=50;function Ve(i,t){try{return i.getItem(t)}catch{}}function di(i,t,e){try{return i.setItem(t,e),!0}catch{}}function Xi(i,t){try{i.removeItem(t)}catch{}}function Fe(i,t){return di(i,Fn,t.toString())}function qe(i){return parseInt(Ve(i,Fn))||0}const ht={local:!0,session:!0},Wn={local:new Set,session:new Set};let pi=!1;function cr(i){pi=i}let ne=typeof window>"u"?{}:window;function Yn(i){const t=i+"Storage";try{if(ne&&ne[t]&&typeof ne[t].length=="number")return ne[t]}catch{}ht[i]=!1}function Gn(i,t){const e=Yn(i);if(!e)return;const o=Ve(e,Ji);if(o!==Qi){if(o){const l=qe(e);for(let a=0;a<l;a++)Xi(e,Ft+a.toString())}di(e,Ji,Qi),Fe(e,0);return}const n=Math.floor(Date.now()/qn)-lr,s=l=>{const a=Ft+l.toString(),c=Ve(e,a);if(typeof c=="string"){try{const h=JSON.parse(c);if(typeof h=="object"&&typeof h.cached=="number"&&h.cached>n&&typeof h.provider=="string"&&typeof h.data=="object"&&typeof h.data.prefix=="string"&&t(h,l))return!0}catch{}Xi(e,a)}};let r=qe(e);for(let l=r-1;l>=0;l--)s(l)||(l===r-1?(r--,Fe(e,r)):Wn[i].add(l))}function Qn(){if(!pi){cr(!0);for(const i in ht)Gn(i,t=>{const e=t.data,o=t.provider,n=e.prefix,s=et(o,n);if(!hi(s,e).length)return!1;const r=e.lastModified||-1;return s.lastModifiedCached=s.lastModifiedCached?Math.min(s.lastModifiedCached,r):r,!0})}}function hr(i,t){const e=i.lastModifiedCached;if(e&&e>=t)return e===t;if(i.lastModifiedCached=t,e)for(const o in ht)Gn(o,n=>{const s=n.data;return n.provider!==i.provider||s.prefix!==i.prefix||s.lastModified===t});return!0}function ur(i,t){pi||Qn();function e(o){let n;if(!ht[o]||!(n=Yn(o)))return;const s=Wn[o];let r;if(s.size)s.delete(r=Array.from(s).shift());else if(r=qe(n),r>=ar||!Fe(n,r+1))return;const l={cached:Math.floor(Date.now()/qn),provider:i.provider,data:t};return di(n,Ft+r.toString(),JSON.stringify(l))}t.lastModified&&!hr(i,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),e("local")||e("session"))}function Ki(){}function dr(i){i.iconsLoaderFlag||(i.iconsLoaderFlag=!0,setTimeout(()=>{i.iconsLoaderFlag=!1,Zs(i)}))}function pr(i,t){i.iconsToLoad?i.iconsToLoad=i.iconsToLoad.concat(t).sort():i.iconsToLoad=t,i.iconsQueueFlag||(i.iconsQueueFlag=!0,setTimeout(()=>{i.iconsQueueFlag=!1;const{provider:e,prefix:o}=i,n=i.iconsToLoad;delete i.iconsToLoad;let s;!n||!(s=De(e))||s.prepare(e,o,n).forEach(r=>{Vn(e,r,l=>{if(typeof l!="object")r.icons.forEach(a=>{i.missing.add(a)});else try{const a=hi(i,l);if(!a.length)return;const c=i.pendingIcons;c&&a.forEach(h=>{c.delete(h)}),ur(i,l)}catch(a){console.error(a)}dr(i)})})}))}const bi=(i,t)=>{const e=ir(i,!0,Hn()),o=Ks(e);if(!o.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(o.loaded,o.missing,o.pending,Ki)}),()=>{a=!1}}const n=Object.create(null),s=[];let r,l;return o.pending.forEach(a=>{const{provider:c,prefix:h}=a;if(h===l&&c===r)return;r=c,l=h,s.push(et(c,h));const u=n[c]||(n[c]=Object.create(null));u[h]||(u[h]=[])}),o.pending.forEach(a=>{const{provider:c,prefix:h,name:u}=a,b=et(c,h),p=b.pendingIcons||(b.pendingIcons=new Set);p.has(u)||(p.add(u),n[c][h].push(u))}),s.forEach(a=>{const{provider:c,prefix:h}=a;n[c][h].length&&pr(a,n[c][h])}),t?er(t,o,s):Ki},br=i=>new Promise((t,e)=>{const o=typeof i=="string"?Jt(i,!0):i;if(!o){e(i);return}bi([o||i],n=>{if(n.length&&o){const s=Vt(o);if(s){t({...Qt,...s});return}}e(i)})});function mr(i){try{const t=typeof i=="string"?JSON.parse(i):i;if(typeof t.body=="string")return{...t}}catch{}}function fr(i,t){const e=typeof i=="string"?Jt(i,!0,!0):null;if(!e){const s=mr(i);return{value:i,data:s}}const o=Vt(e);if(o!==void 0||!e.prefix)return{value:i,name:e,data:o};const n=bi([e],()=>t(i,e,Vt(e)));return{value:i,name:e,loading:n}}function je(i){return i.hasAttribute("inline")}let Jn=!1;try{Jn=navigator.vendor.indexOf("Apple")===0}catch{}function gr(i,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Jn||i.indexOf("<a")===-1)?"svg":i.indexOf("currentColor")===-1?"bg":"mask"}const vr=/(-?[0-9.]*[0-9]+[0-9.]*)/g,yr=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function We(i,t,e){if(t===1)return i;if(e=e||100,typeof i=="number")return Math.ceil(i*t*e)/e;if(typeof i!="string")return i;const o=i.split(vr);if(o===null||!o.length)return i;const n=[];let s=o.shift(),r=yr.test(s);for(;;){if(r){const l=parseFloat(s);isNaN(l)?n.push(s):n.push(Math.ceil(l*t*e)/e)}else n.push(s);if(s=o.shift(),s===void 0)return n.join("");r=!r}}function _r(i,t="defs"){let e="";const o=i.indexOf("<"+t);for(;o>=0;){const n=i.indexOf(">",o),s=i.indexOf("</"+t);if(n===-1||s===-1)break;const r=i.indexOf(">",s);if(r===-1)break;e+=i.slice(n+1,s).trim(),i=i.slice(0,o).trim()+i.slice(r+1)}return{defs:e,content:i}}function wr(i,t){return i?"<defs>"+i+"</defs>"+t:t}function xr(i,t,e){const o=_r(i);return wr(o.defs,t+o.content+e)}const $r=i=>i==="unset"||i==="undefined"||i==="none";function Xn(i,t){const e={...Qt,...i},o={...Rn,...t},n={left:e.left,top:e.top,width:e.width,height:e.height};let s=e.body;[e,o].forEach(v=>{const g=[],C=v.hFlip,A=v.vFlip;let w=v.rotate;C?A?w+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):A&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(w<0&&(w-=Math.floor(w/4)*4),w=w%4,w){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}w%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(s=xr(s,'<g transform="'+g.join(" ")+'">',"</g>"))});const r=o.width,l=o.height,a=n.width,c=n.height;let h,u;r===null?(u=l===null?"1em":l==="auto"?c:l,h=We(u,a/c)):(h=r==="auto"?a:r,u=l===null?We(h,c/a):l==="auto"?c:l);const b={},p=(v,g)=>{$r(g)||(b[v]=g.toString())};p("width",h),p("height",u);const f=[n.left,n.top,a,c];return b.viewBox=f.join(" "),{attributes:b,viewBox:f,body:s}}function mi(i,t){let e=i.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const o in t)e+=" "+o+'="'+t[o]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+e+">"+i+"</svg>"}function Er(i){return i.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ar(i){return"data:image/svg+xml,"+Er(i)}function Kn(i){return'url("'+Ar(i)+'")'}const Cr=()=>{let i;try{if(i=fetch,typeof i=="function")return i}catch{}};let fe=Cr();function kr(i){fe=i}function Sr(){return fe}function Or(i,t){const e=$e(i);if(!e)return 0;let o;if(!e.maxURL)o=0;else{let n=0;e.resources.forEach(r=>{n=Math.max(n,r.length)});const s=t+".json?icons=";o=e.maxURL-n-e.path.length-s.length}return o}function Tr(i){return i===404}const zr=(i,t,e)=>{const o=[],n=Or(i,t),s="icons";let r={type:s,provider:i,prefix:t,icons:[]},l=0;return e.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(o.push(r),r={type:s,provider:i,prefix:t,icons:[]},l=a.length),r.icons.push(a)}),o.push(r),o};function Pr(i){if(typeof i=="string"){const t=$e(i);if(t)return t.path}return"/"}const Lr=(i,t,e)=>{if(!fe){e("abort",424);return}let o=Pr(t.provider);switch(t.type){case"icons":{const s=t.prefix,r=t.icons.join(","),l=new URLSearchParams({icons:r});o+=s+".json?"+l.toString();break}case"custom":{const s=t.uri;o+=s.slice(0,1)==="/"?s.slice(1):s;break}default:e("abort",400);return}let n=503;fe(i+o).then(s=>{const r=s.status;if(r!==200){setTimeout(()=>{e(Tr(r)?"abort":"next",r)});return}return n=501,s.json()}).then(s=>{if(typeof s!="object"||s===null){setTimeout(()=>{s===404?e("abort",s):e("next",n)});return}setTimeout(()=>{e("success",s)})}).catch(()=>{e("next",n)})},jr={prepare:zr,send:Lr};function Zi(i,t){switch(i){case"local":case"session":ht[i]=t;break;case"all":for(const e in ht)ht[e]=t;break}}const Re="data-style";let Zn="";function Rr(i){Zn=i}function tn(i,t){let e=Array.from(i.childNodes).find(o=>o.hasAttribute&&o.hasAttribute(Re));e||(e=document.createElement("style"),e.setAttribute(Re,Re),i.appendChild(e)),e.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+Zn}function to(){Wi("",jr),Hn(!0);let i;try{i=window}catch{}if(i){if(Qn(),i.IconifyPreload!==void 0){const t=i.IconifyPreload,e="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(o=>{try{(typeof o!="object"||o===null||o instanceof Array||typeof o.icons!="object"||typeof o.prefix!="string"||!Fi(o))&&console.error(e)}catch{console.error(e)}})}if(i.IconifyProviders!==void 0){const t=i.IconifyProviders;if(typeof t=="object"&&t!==null)for(const e in t){const o="IconifyProviders["+e+"] is invalid.";try{const n=t[e];if(typeof n!="object"||!n||n.resources===void 0)continue;Yi(e,n)||console.error(o)}catch{console.error(o)}}}}return{enableCache:t=>Zi(t,!0),disableCache:t=>Zi(t,!1),iconLoaded:qi,iconExists:qi,getIcon:Xs,listIcons:Js,addIcon:In,addCollection:Fi,calculateSize:We,buildIcon:Xn,iconToHTML:mi,svgToURL:Kn,loadIcons:bi,loadIcon:br,addAPIProvider:Yi,appendCustomStyle:Rr,_api:{getAPIConfig:$e,setAPIModule:Wi,sendAPIQuery:Vn,setFetch:kr,getFetch:Sr,listAPIProviders:sr}}}const Ye={"background-color":"currentColor"},eo={"background-color":"transparent"},en={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},nn={"-webkit-mask":Ye,mask:Ye,background:eo};for(const i in nn){const t=nn[i];for(const e in en)t[i+"-"+e]=en[e]}function on(i){return i?i+(i.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Mr(i,t,e){const o=document.createElement("span");let n=i.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const s=i.attributes,r=mi(n,{...s,width:t.width+"",height:t.height+""}),l=Kn(r),a=o.style,c={"--svg":l,width:on(s.width),height:on(s.height),...e?Ye:eo};for(const h in c)a.setProperty(h,c[h]);return o}let Bt;function Br(){try{Bt=window.trustedTypes.createPolicy("iconify",{createHTML:i=>i})}catch{Bt=null}}function Nr(i){return Bt===void 0&&Br(),Bt?Bt.createHTML(i):i}function Hr(i){const t=document.createElement("span"),e=i.attributes;let o="";e.width||(o="width: inherit;"),e.height||(o+="height: inherit;"),o&&(e.style=o);const n=mi(i.body,e);return t.innerHTML=Nr(n),t.firstChild}function Ge(i){return Array.from(i.childNodes).find(t=>{const e=t.tagName&&t.tagName.toUpperCase();return e==="SPAN"||e==="SVG"})}function sn(i,t){const e=t.icon.data,o=t.customisations,n=Xn(e,o);o.preserveAspectRatio&&(n.attributes.preserveAspectRatio=o.preserveAspectRatio);const s=t.renderedMode;let r;switch(s){case"svg":r=Hr(n);break;default:r=Mr(n,{...Qt,...e},s==="mask")}const l=Ge(i);l?r.tagName==="SPAN"&&l.tagName===r.tagName?l.setAttribute("style",r.getAttribute("style")):i.replaceChild(r,l):i.appendChild(r)}function rn(i,t,e){const o=e&&(e.rendered?e:e.lastRender);return{rendered:!1,inline:t,icon:i,lastRender:o}}function Ir(i="iconify-icon"){let t,e;try{t=window.customElements,e=window.HTMLElement}catch{return}if(!t||!e)return;const o=t.get(i);if(o)return o;const n=["icon","mode","inline","observe","width","height","rotate","flip"],s=class extends e{constructor(){super(),lt(this,"_shadowRoot"),lt(this,"_initialised",!1),lt(this,"_state"),lt(this,"_checkQueued",!1),lt(this,"_connected",!1),lt(this,"_observer",null),lt(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=je(this);tn(l,a),this._state=rn({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=je(this),c=this._state;a!==c.inline&&(c.inline=a,tn(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return je(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}sn(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),h=Ui(this);(l.attrMode!==c||Vs(l.customisations,h)||!Ge(this._shadowRoot))&&this._renderIcon(l.icon,h,c)}_iconChanged(l){const a=fr(l,(c,h,u)=>{const b=this._state;if(b.rendered||this.getAttribute("icon")!==c)return;const p={value:c,name:h,data:u};p.data?this._gotIconData(p):b.icon=p});a.data?this._gotIconData(a):this._state=rn(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=Ge(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Ui(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const h=gr(l.data.body,c),u=this._state.inline;sn(this._shadowRoot,this._state={rendered:!0,icon:l,inline:u,customisations:a,attrMode:c,renderedMode:h})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in s.prototype||Object.defineProperty(s.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const r=to();for(const l in r)s[l]=s.prototype[l]=r[l];return t.define(i,s),s}Ir()||to();var Dr=Object.defineProperty,U=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&Dr(t,e,n),n},oe;const N=(oe=class extends E{constructor(){super(),this._parent=K(),this._tooltip=K(),this._contextMenu=K(),this._mouseLeave=!1,this.onWindowMouseUp=i=>{const{value:t}=this._contextMenu;!this.contains(i.target)&&t&&(t.visible=!1)},this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this.mouseLeave=!0,this.addEventListener("click",i=>i.stopPropagation())}set mouseLeave(i){this._mouseLeave=i,i&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:i}=this._parent,{value:t}=this._tooltip;i&&t&&An(i,t,{placement:"bottom",middleware:[dn(10),En(),$n(),xn({padding:5})]}).then(e=>{const{x:o,y:n}=e;Object.assign(t.style,{left:`${o}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const i=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},i)}onChildrenClick(i){i.stopPropagation();const{value:t}=this._contextMenu;t&&(t.visible=!t.visible)}onSlotChange(i){const{value:t}=this._contextMenu,e=i.target.assignedElements();for(const o of e){if(!(o instanceof oe)){o.remove(),console.warn("Only bim-button is allowed inside bim-button. Child has been removed.");continue}o.addEventListener("click",()=>t==null?void 0:t.updatePosition())}this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){const i=m`
      <div ${W(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?m`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?m`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=this.children.length>0;return m`
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
      <div ${W(this._parent)} class="parent">
        ${this.label||this.icon?m`
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
        ${t?m`
              <div class="children" @click=${this.onChildrenClick}>
                <bim-icon .icon=${"ic:round-plus"}></bim-icon>
              </div>
            `:null}
        <bim-context-menu
          ${W(this._contextMenu)}
          style="row-gap: var(--bim-ui_size-4xs)"
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </bim-context-menu>
      </div>
    `}},oe.styles=x`
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
      --bim-label--c: white;
      --bim-icon--c: white;
      fill: white;
      background-color: var(--bim-ui_color-main);
    }

    :host(:not([label]):not([icon])) .children {
      flex: 1;
    }

    :host([active]) .button {
      --bim-label--c: white;
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
  `,oe);U([d({type:String,reflect:!0})],N.prototype,"label");U([d({type:Boolean,attribute:"label-hidden",reflect:!0})],N.prototype,"labelHidden");U([d({type:Boolean,reflect:!0})],N.prototype,"active");U([d({type:Boolean,reflect:!0,attribute:"disabled"})],N.prototype,"disabled");U([d({type:String,reflect:!0})],N.prototype,"icon");U([d({type:Boolean,reflect:!0})],N.prototype,"vertical");U([d({type:Number,attribute:"tooltip-time",reflect:!0})],N.prototype,"tooltipTime");U([d({type:Boolean,attribute:"tooltip-visible",reflect:!0})],N.prototype,"tooltipVisible");U([d({type:String,attribute:"tooltip-title",reflect:!0})],N.prototype,"tooltipTitle");U([d({type:String,attribute:"tooltip-text",reflect:!0})],N.prototype,"tooltipText");let Ur=N;var Vr=Object.defineProperty,Ee=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&Vr(t,e,n),n};const io=class extends E{constructor(){super(),this.onValueChange=new Event("change"),this.checked=!1}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return m`
      <div class="parent">
        ${this.label?m`<bim-label
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
    `}};io.styles=x`
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
  `;let Xt=io;Ee([d({type:String,reflect:!0})],Xt.prototype,"icon");Ee([d({type:String,reflect:!0})],Xt.prototype,"name");Ee([d({type:String,reflect:!0})],Xt.prototype,"label");Ee([d({type:Boolean,reflect:!0})],Xt.prototype,"checked");var Fr=Object.defineProperty,kt=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&Fr(t,e,n),n};const no=class extends E{constructor(){super(),this._colorInput=K(),this._textInput=K(),this.onValueChange=new Event("input"),this.vertical=!1,this.color="#bcf124"}set value(t){const{color:e,opacity:o}=t;this.color=e,o&&(this.opacity=o)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:e}=this._colorInput;e&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:e}=this._textInput;if(!e)return;const{value:o}=e;let n=o.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),e.value=n.slice(0,7),e.value.length===7&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){const t=e=>{const o=e.target;this.opacity=o.value,this.dispatchEvent(this.onValueChange)};return m`
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
                ${W(this._colorInput)}
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
                ${W(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?m`<bim-number-input
                  @input=${t}
                  slider
                  sufix="%"
                  min="0"
                  value=${this.opacity}
                  max="100"
                ></bim-number-input>`:null}
          </div>
        </bim-input>
      </div>
    `}};no.styles=x`
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
  `;let dt=no;kt([d({type:String,reflect:!0})],dt.prototype,"name");kt([d({type:String,reflect:!0})],dt.prototype,"label");kt([d({type:String,reflect:!0})],dt.prototype,"icon");kt([d({type:Boolean,reflect:!0})],dt.prototype,"vertical");kt([d({type:Number,reflect:!0})],dt.prototype,"opacity");kt([d({type:String,reflect:!0})],dt.prototype,"color");const qr=x`
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
`,Wr=x`
  :root {
    /* Backgrounds */
    --bim-ui_bg-base: hsl(210 10% 5%);
    --bim-ui_bg-contrast-10: hsl(210 10% 10%);
    --bim-ui_bg-contrast-20: hsl(210 10% 20%);
    --bim-ui_bg-contrast-40: hsl(210 10% 40%);
    --bim-ui_bg-contrast-60: hsl(210 10% 60%);
    --bim-ui_bg-contrast-80: hsl(210 10% 80%);
    --bim-ui_bg-contrast-100: hsl(210 10% 95%);

    /* Colors */
    --bim-ui_color-main: #6528d7;
    --bim-ui_color-accent: #bcf124;

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
`,nt={scrollbar:qr,globalStyles:Wr};var Yr=Object.defineProperty,Gr=Object.getOwnPropertyDescriptor,Qr=(i,t,e,o)=>{for(var n=Gr(t,e),s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&Yr(t,e,n),n};const oo=class extends E{constructor(){super(...arguments),this._visible=!1,this._middleware={name:"middleware",async fn(t){const{right:e,top:o}=await oi(t);return t.x-=Math.sign(e)===1?e+5:0,t.y-=Math.sign(o)===1?o+5:0,t}}}get visible(){return this._visible}set visible(t){this._visible=t,t&&this.updatePosition()}async updatePosition(t){const e=t||this.parentNode;if(!e){this.visible=!1,console.warn("No target element found for context-menu.");return}const o=await An(e,this,{placement:"right",middleware:[dn(10),En(),$n(),xn({padding:5}),this._middleware]}),{x:n,y:s}=o;this.style.left=`${n}px`,this.style.top=`${s}px`}render(){return m` <slot></slot> `}};oo.styles=[nt.scrollbar,x`
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
    `];let so=oo;Qr([d({type:Boolean,reflect:!0})],so.prototype,"visible");const ge=(i,t=!0)=>{let e={};for(const o of i.children){const n=o,s=n.getAttribute("name")||n.getAttribute("label");if(s){if("value"in n){const r=n.value;if(typeof r=="object"&&!Array.isArray(r)&&Object.keys(r).length===0)continue;e[s]=n.value}else if(t){const r=ge(n);if(Object.keys(r).length===0)continue;e[s]=r}}else t&&(e={...e,...ge(n)})}return e},fi=i=>i==="true"||i==="false"?i==="true":i&&!isNaN(Number(i))&&i.trim()!==""?Number(i):i;var Jr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,ot=(i,t,e,o)=>{for(var n=o>1?void 0:o?Xr(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&Jr(t,e,n),n};const ro=class extends E{get value(){return this._value!==void 0?this._value:this.label?fi(this.label):this.label}set value(t){this._value=t}constructor(){super(),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}render(){return m`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?m` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?m`<bim-checkbox
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
    `}};ro.styles=x`
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
        var(--bim-selector-input--bgc, var(--bim-ui_bg-contrast-20)),
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
  `;let z=ro;ot([d({type:String,reflect:!0})],z.prototype,"img",2);ot([d({type:String,reflect:!0})],z.prototype,"label",2);ot([d({type:String,reflect:!0})],z.prototype,"icon",2);ot([d({type:Boolean,reflect:!0})],z.prototype,"checked",2);ot([d({type:Boolean,reflect:!0})],z.prototype,"checkbox",2);ot([d({type:Boolean,attribute:"no-mark",reflect:!0})],z.prototype,"noMark",2);ot([d({converter:{fromAttribute(i){return i&&fi(i)}}})],z.prototype,"value",1);ot([d({type:Boolean,reflect:!0})],z.prototype,"vertical",2);var Kr=Object.defineProperty,St=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&Kr(t,e,n),n};const Qe=class extends E{constructor(){super(),this._inputContainer=K(),this._listElement=K(),this._visible=!1,this._value=[],this.onValueChange=new Event("change"),this.onWindowMouseUp=t=>{this.contains(t.target)||(this.visible=!1)},this.onOptionClick=t=>{const e=t.target.value,o=this._value.includes(e);if(!this.multiple&&!this.required&&!o)this.value=[e];else if(!this.multiple&&!this.required&&o)this.value=[];else if(!this.multiple&&this.required&&!o)this.value=[e];else if(this.multiple&&!this.required&&!o)this.value=[...this._value,e];else if(this.multiple&&!this.required&&o)this.value=this._value.filter(n=>n!==e);else if(this.multiple&&this.required&&!o)this.value=[...this._value,e];else if(this.multiple&&this.required&&o){const n=this._value.filter(s=>s!==e);n.length!==0&&(this.value=n)}},this.useObserver=!0,this.multiple=!1,this.required=!1,this.visible=!1,this.vertical=!1}get visible(){return this._visible}set visible(t){this._visible=t,t||this.resetVisibleElements()}set value(t){if(this.required&&Object.keys(t).length===0){console.warn("bim-dropdown was set as required but not value is set. Nothing has changed.");return}const e=[];for(const o of t){const n=this.findOption(o);if(n){if(e.push(n.value),!this.multiple&&Object.keys(t).length>1){console.warn("bim-dropdown wasn't set as multiple, but provided an array of values. Only first was taken.");break}}else console.warn(`bim-dropdown doesn't have ${o} as a possible value.`)}this._value=e,this.dispatchEvent(this.onValueChange),this.updateOptionsState()}get value(){return this._value}get _options(){const t=[...this.elements];for(const e of this.children)e instanceof z&&t.push(e);return t}onSlotChange(t){const e=t.target.assignedElements();this.observe(e);for(const o of e){if(!(o instanceof z)){console.warn("Only bim-option is allowed inside bim-dropdown. Child has been removed.");continue}o.removeEventListener("click",this.onOptionClick),o.addEventListener("click",this.onOptionClick)}}updateOptionsState(){for(const t of this._options)t instanceof z&&(this._value.includes(t.value)?t.checked=!0:t.checked=!1)}findOption(t){return this._options.find(e=>e instanceof z?e.label===t||e.value===t:!1)}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){let t,e,o;if(this._value.length===0)t="Select an option...";else if(this._value.length===1){const n=this.findOption(this._value[0]);t=(n==null?void 0:n.label)||(n==null?void 0:n.value),e=n==null?void 0:n.img,o=n==null?void 0:n.icon}else t=`Multiple (${this._value.length})`;return m`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div
          ${W(this._inputContainer)}
          class="input"
          @click=${()=>this.visible=!this.visible}
        >
          <bim-label
            label=${t}
            .img=${e}
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
        <bim-context-menu ${W(this._listElement)} .visible=${this.visible}>
          <slot @slotchange=${this.onSlotChange}></slot>
          ${this.visibleElements.map(n=>n)}
        </bim-context-menu>
      </bim-input>
    `}};Qe.styles=[nt.scrollbar,x`
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
    `],Qe.properties={visible:{type:Boolean,reflect:!0},value:{attribute:!1}};let pt=Qe;St([d({type:String,reflect:!0})],pt.prototype,"name");St([d({type:String,reflect:!0})],pt.prototype,"icon");St([d({type:String,reflect:!0})],pt.prototype,"label");St([d({type:Boolean,reflect:!0})],pt.prototype,"multiple");St([d({type:Boolean,reflect:!0})],pt.prototype,"required");St([d({type:Boolean,reflect:!0})],pt.prototype,"vertical");var Zr=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,lo=(i,t,e,o)=>{for(var n=o>1?void 0:o?tl(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&Zr(t,e,n),n},vt;const gi=(vt=class extends E{constructor(){super(),this._containers={},this._onLayoutChange=new Event("layout-change"),this.layouts={},this.childrenElements=new Set,this.floating=!1}get layout(){return this._layout}set layout(i){if(i){const t=this.layouts[i];if(!t){console.warn(`bim-grid: "${i}" layout is not defined, "${this.layout}" layout remained.`);return}this.style.gridTemplate=t,this.updateContainers()}else this.style.gridTemplate="",this.cleanup();this._layout=i,this.dispatchEvent(this._onLayoutChange)}get rows(){return this.style.gridTemplate.trim().split(/"([^"]*)"/).map((i,t)=>t%2!==0?i:null).filter(i=>i!==null)}get layoutAreas(){const i=new Set;for(const t of this.rows){const e=t.trim().split(/\s+/);for(const o of e)i.add(o)}return[...i]}static addContainerTag(i,t){vt.containerTags[i]=t}onSlotChange(i){const t=i.target.assignedElements();for(const e of t){this.childrenElements.add(e),e.toggleAttribute("floating",this.floating);try{const o=this.isVerticalArea(e.style.gridArea);"horizontal"in e?e.horizontal=!o:"vertical"in e&&(e.vertical=o)}catch{}}}updateContainers(){const{layoutAreas:i}=this;for(const t of i){if(!t.startsWith("c-"))continue;const e=t.split("-")[1],o=t.split("-")[2];if(!o)throw new Error(`bim-grid: you defined a container area without an id (${t})`);this.createContainer(e,o)}this.cleanup()}cleanup(){const{layoutAreas:i}=this;for(const t of this.childrenElements){const{gridArea:e}=t.style;i.includes(e)?this.append(t):t.remove()}}createContainer(i,t){const e=`c-${i}-${t}`;i in this._containers||(this._containers[i]=[]);const o=this._containers[i];let n=o.find(s=>s.style.gridArea===e);if(!n){const s=vt.containerTags[i]??"div";n=document.createElement(s),n.style.gridArea=e,o.push(n),this.childrenElements.add(n)}return n}isVerticalArea(i){const{rows:t}=this,e=t.find(r=>r.includes(i));if(!e)throw new Error(`${i} wasn't defined in the grid-template of this bim-grid`);const o=t.indexOf(e),n=o>0&&t[o-1].includes(i),s=o<t.length-1&&t[o+1].includes(i);return n||s}getContainer(i,t,e=!1){const o=`c-${i}-${t}`,n=this._containers[i];if(e)return this.createContainer(i,t);if(!n)throw new Error(`bim-grid: container of type "${i}" is not defined in this grid.`);const s=n.find(r=>r.style.gridArea===o);if(!s)throw new Error(`bim-grid: there is no container with id "${t}" in this grid.`);return s}render(){return m` <slot @slotchange=${this.onSlotChange}></slot> `}},vt.styles=x`
    :host {
      display: grid;
      height: 100%;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }

    :host(:not([layout])) {
      display: none;
    }

    :host([floating]) {
      --bim-toolbars-container--olw: 1px;
      --bim-toolbars-container--olc: var(--bim-ui_bg-contrast-20);
      --bim-toolbars-container--js: center;
      --bim-toolbars-container--as: start;
      --bim-toolbars-container_tabs--bgc: transparent;
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
      --bim-toolbars-container--js: auto;
      --bim-toolbars-container--as: auto;
      --bim-toolbars-container_tabs--bgc: var(--bim-ui_bg-base);
      --bim-panel--bdrs: 0;
      background-color: var(--bim-ui_bg-contrast-20);
      gap: 1px;
    }
  `,vt.containerTags={panels:"bim-panels-container",toolbars:"bim-toolbars-container"},vt);lo([d({type:Boolean,reflect:!0})],gi.prototype,"floating",2);lo([d({type:String,reflect:!0})],gi.prototype,"layout",1);let el=gi;const Je=class extends E{render(){return m`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};Je.styles=x`
    :host {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
    }

    iconify-icon {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
      color: var(--bim-icon--c);
    }
  `,Je.properties={icon:{type:String}};let il=Je;var nl=Object.defineProperty,Ae=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&nl(t,e,n),n};const ao=class extends E{constructor(){super(),this.onValueChange=new Event("change"),this.vertical=!1}get value(){const t={};for(const e of this.children){const o=e;"value"in o?t[o.name||o.label]=o.value:"checked"in o&&(t[o.name||o.label]=o.checked)}return t}set value(t){const e=[...this.children];for(const o in t){const n=e.find(l=>{const a=l;return a.name===o||a.label===o});if(!n)continue;const s=n,r=t[o];typeof r=="boolean"?s.checked=r:s.value=r}}render(){return m`
      <div class="parent">
        ${this.label||this.icon?m`<bim-label
              .label=${this.label}
              .icon=${this.icon}
            ></bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};ao.styles=x`
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
  `;let Kt=ao;Ae([d({type:String,reflect:!0})],Kt.prototype,"name");Ae([d({type:String,reflect:!0})],Kt.prototype,"label");Ae([d({type:String,reflect:!0})],Kt.prototype,"icon");Ae([d({type:Boolean,reflect:!0})],Kt.prototype,"vertical");var ol=Object.defineProperty,Ot=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&ol(t,e,n),n};const co=class extends E{get value(){return this.label?fi(this.label):this.label}constructor(){super(),this.iconHidden=!1,this.labelHidden=!1,this.vertical=!1}render(){return m`
      <div class="parent" .title=${this.label??""}>
        ${this.img?m`<img .src=${this.img} .alt=${this.label||""} />`:null}
        ${!this.iconHidden&&this.icon?m`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        ${!this.labelHidden&&this.label?m`<label>${this.label}</label>`:null}
      </div>
    `}};co.styles=x`
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
  `;let bt=co;Ot([d({type:String,reflect:!0})],bt.prototype,"label");Ot([d({type:String,reflect:!0})],bt.prototype,"img");Ot([d({type:Boolean,attribute:"label-hidden",reflect:!0})],bt.prototype,"labelHidden");Ot([d({type:String,reflect:!0})],bt.prototype,"icon");Ot([d({type:Boolean,attribute:"icon-hidden",reflect:!0})],bt.prototype,"iconHidden");Ot([d({type:Boolean,reflect:!0})],bt.prototype,"vertical");var sl=Object.defineProperty,rl=Object.getOwnPropertyDescriptor,M=(i,t,e,o)=>{for(var n=o>1?void 0:o?rl(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&sl(t,e,n),n};const ho=class extends E{constructor(){if(super(),this._value=0,this._input=K(),this.onValueChange=new Event("change"),this.vertical=!1,this.slider=!1,this.min&&this.max&&(this.min>this.max||this.max<this.min))throw new Error("bim-number-input min value can't be greater than max and max can't be lower than min.")}get value(){return this._value}set value(t){this.setValue(t.toString())}onChange(t){t.stopPropagation();const{value:e}=this._input;e&&this.setValue(e.value)}setValue(t){const{value:e}=this._input;let o=t;if(o=o.replace(/[^0-9.-]/g,""),o=o.replace(/(\..*)\./g,"$1"),o.endsWith(".")||(o.lastIndexOf("-")>0&&(o=o[0]+o.substring(1).replace(/-/g,"")),o==="-"||o==="-0"))return;let n=Number(o);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,e&&(e.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:e}=t,o=this.value;let n=!1;const s=a=>{var c;n=!0;const{clientX:h}=a,u=this.step??1,b=((c=u.toString().split(".")[1])==null?void 0:c.length)||0,p=1/(this.sensitivity??1),f=(h-e)/p;if(Math.floor(Math.abs(f))!==Math.abs(f))return;const v=o+f*u;this.setValue(v.toFixed(b))},r=()=>{this.slider=!0,this.removeEventListener("blur",r)},l=()=>{document.removeEventListener("mousemove",s),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",r),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",s),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const e=o=>{o.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",e))};window.addEventListener("keydown",e)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=m`
      ${this.pref||this.icon?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .label=${this.pref}
            .icon=${this.icon}
          ></bim-label>`:null}
      <input
        ${W(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${l=>l.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.sufix?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .label=${this.sufix}
          ></bim-label>`:null}
    `,e=this.min??-1/0,o=this.max??1/0,n=100*(this.value-e)/(o-e),s=m`
      <style>
        .slider-indicator {
          width: ${`${n}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?m`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .label=${`${this.pref}: `}
              .icon=${this.icon}
            ></bim-label>`:null}
        <bim-label
          style="z-index: 1;"
          .label=${this.value.toString()}
        ></bim-label>
        ${this.sufix?m`<bim-label
              style="z-index: 1;"
              .label=${this.sufix}
            ></bim-label>`:null}
      </div>
    `,r=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.sufix??""}`;return m`
      <bim-input
        title=${r}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?s:t}
      </bim-input>
    `}};ho.styles=x`
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

    :host([sufix]:not([pref])) input {
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
  `;let j=ho;M([d({type:String,reflect:!0})],j.prototype,"name",2);M([d({type:String,reflect:!0})],j.prototype,"icon",2);M([d({type:String,reflect:!0})],j.prototype,"label",2);M([d({type:String,reflect:!0})],j.prototype,"pref",2);M([d({type:Number,reflect:!0})],j.prototype,"min",2);M([d({type:Number,reflect:!0})],j.prototype,"value",1);M([d({type:Number,reflect:!0})],j.prototype,"step",2);M([d({type:Number,reflect:!0})],j.prototype,"sensitivity",2);M([d({type:Number,reflect:!0})],j.prototype,"max",2);M([d({type:String,reflect:!0})],j.prototype,"sufix",2);M([d({type:Boolean,reflect:!0})],j.prototype,"vertical",2);M([d({type:Boolean,reflect:!0})],j.prototype,"slider",2);var ll=Object.defineProperty,vi=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&ll(t,e,n),n};const Xe=class extends E{constructor(){super(),this.onValueChange=new Event("change"),this._hidden=!1,this.activationButton=document.createElement("bim-button"),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return ge(this)}set value(t){const e=[...this.children];for(const o in t){const n=e.find(r=>{const l=r;return l.name===o||l.label===o});if(!n)continue;const s=n;s.value=t[o]}}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,m`
      <div class="parent">
        ${this.label||this.name||this.icon?m`<bim-label
              .label=${this.label||this.name}
              .icon=${this.icon}
            ></bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};Xe.styles=[nt.scrollbar,x`
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

      /* :host(:not([hidden])) {
        display: none;
      } */

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
    `],Xe.properties={hidden:{type:Boolean,reflect:!0}};let X=Xe;vi([d({type:String,reflect:!0})],X.prototype,"icon");vi([d({type:String,reflect:!0})],X.prototype,"name");vi([d({type:String,reflect:!0})],X.prototype,"label");var al=Object.defineProperty,uo=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&al(t,e,n),n};const po=class extends E{constructor(){super(),this.onPanelHiddenChange=t=>{const e=t.target;if(e instanceof X&&!e.hidden)for(const o of this.children)!(o instanceof X)||o===e||(o.hidden=!0)},this.horizontal=!1,this.floating=!1}onSlotChange(t){const e=t.target.assignedElements(),o=e.find(n=>n instanceof X&&!n.hidden);for(const n of e)n instanceof X&&(n.removeEventListener("hiddenchange",this.onPanelHiddenChange),o!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onPanelHiddenChange))}render(){return m` <slot @slotchange=${this.onSlotChange}></slot> `}};po.styles=[nt.scrollbar,x`
      :host {
        display: flex;
        flex-direction: column;
        pointer-events: none;
        gap: 0.5rem;
        overflow: auto;
      }

      :host(:not([floating])) {
        background-color: var(--bim-ui_bg-base);
      }

      :host([horizontal]) {
        flex-direction: row;
      }

      :host([horizontal]) ::slotted(bim-panel) {
        /* max-width: 100%; */
        flex-grow: 1;
      }
    `];let yi=po;uo([d({type:Boolean,reflect:!0})],yi.prototype,"horizontal");uo([d({type:Boolean,reflect:!0})],yi.prototype,"floating");var cl=Object.defineProperty,Zt=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&cl(t,e,n),n};const bo=class extends E{constructor(){super(...arguments),this.onValueChange=new Event("change")}get value(){return ge(this)}set value(t){const e=[...this.children];for(const o in t){const n=e.find(r=>{const l=r;return l.name===o||l.label===o});if(!n)continue;const s=n;s.value=t[o]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,e=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,o=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?e:o,s=m`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?m`<bim-label
              .label=${this.label||this.name}
              .icon=${this.icon}
            ></bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return m`
      <div class="parent">
        ${t?s:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};bo.styles=[nt.scrollbar,x`
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
    `];let Tt=bo;Zt([d({type:String,reflect:!0})],Tt.prototype,"icon");Zt([d({type:String,reflect:!0})],Tt.prototype,"label");Zt([d({type:String,reflect:!0})],Tt.prototype,"name");Zt([d({type:Boolean,reflect:!0})],Tt.prototype,"fixed");Zt([d({type:Boolean,reflect:!0})],Tt.prototype,"collapsed");var hl=Object.defineProperty,Ce=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&hl(t,e,n),n};const Ke=class extends E{constructor(){super(),this.onValueChange=new Event("change"),this.onOptionClick=t=>{const e=t.target;this.value=e.value},this.vertical=!1}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const e=this._options.find(o=>o.value===t);if(e){for(const o of this._options)o!==e&&(o.checked=!1);e.checked=!0,this._value=e.value,this.dispatchEvent(this.onValueChange)}else console.warn(`bim-selector: "${t}" doesn't correspond with any of the values in the options for this input, value remained as "${this.value}".`)}get value(){return this._value}onSlotChange(t){const e=t.target.assignedElements();for(const o of e)o instanceof z&&(o.noMark=!0,o.removeEventListener("click",this.onOptionClick),o.addEventListener("click",this.onOptionClick))}render(){return m`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};Ke.styles=x`
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

    /* ::slotted(bim-option:first-child) {
      border-radius: var(--bim-ui_size-4xs) 0 0 var(--bim-ui_size-4xs);
    } */

    /* ::slotted(bim-option:last-child) {
      border-radius: 0 var(--bim-ui_size-4xs) var(--bim-ui_size-4xs) 0;
    } */
  `,Ke.properties={value:{attribute:!1}};let te=Ke;Ce([d({type:String,reflect:!0})],te.prototype,"name");Ce([d({type:String,reflect:!0})],te.prototype,"icon");Ce([d({type:String,reflect:!0})],te.prototype,"label");Ce([d({type:Boolean,reflect:!0})],te.prototype,"vertical");const mo=class _{static set config(t){this._config={..._._config,...t}}static get config(){return _._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=nt.globalStyles.cssText;const e=document.head.firstChild;e?document.head.insertBefore(t,e):document.head.append(t)}static defineCustomElement(t,e){customElements.get(t)||customElements.define(t,e)}static registerComponents(){_.addGlobalStyles(),_.defineCustomElement("bim-button",Ur),_.defineCustomElement("bim-checkbox",Xt),_.defineCustomElement("bim-color-input",dt),_.defineCustomElement("bim-context-menu",so),_.defineCustomElement("bim-dropdown",pt),_.defineCustomElement("bim-grid",el),_.defineCustomElement("bim-icon",il),_.defineCustomElement("bim-input",Kt),_.defineCustomElement("bim-label",bt),_.defineCustomElement("bim-number-input",j),_.defineCustomElement("bim-option",z),_.defineCustomElement("bim-panel",X),_.defineCustomElement("bim-panels-container",yi),_.defineCustomElement("bim-panel-section",Tt),_.defineCustomElement("bim-selector-input",te),_.defineCustomElement("bim-table",zt),_.defineCustomElement("bim-tabs",Se),_.defineCustomElement("bim-tab",B),_.defineCustomElement("bim-table-cell",go),_.defineCustomElement("bim-table-children",yo),_.defineCustomElement("bim-table-group",_o),_.defineCustomElement("bim-table-row",ke),_.defineCustomElement("bim-text-input",st),_.defineCustomElement("bim-toolbar",Oo),_.defineCustomElement("bim-toolbar-group",Co),_.defineCustomElement("bim-toolbar-section",ko),_.defineCustomElement("bim-toolbars-container",Cl),_.defineCustomElement("bim-viewport",zo)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let e="";for(let o=0;o<10;o++){const n=Math.floor(Math.random()*t.length);e+=t.charAt(n)}return e}};mo._config={sectionLabelOnVerticalToolbar:!1,multiPanels:!1,draggableToolbars:!0,draggablePanels:!0};let le=mo;var ul=Object.defineProperty,dl=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&ul(t,e,n),n};const fo=class extends E{get value(){if(this.children.length===1){const e=this.children[0];return"value"in e?e.value:e.textContent}const t=[];for(const e of this.children){const o="value"in e?e.value:e.textContent;t.push(o)}return t}render(){return m`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};fo.styles=x`
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
  `;let go=fo;dl([d({type:String,reflect:!0})],go.prototype,"column");var pl=Object.defineProperty,bl=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&pl(t,e,n),n};const vo=class extends E{constructor(){super(...arguments),this._groups=[],this.table=this.closest("bim-table")}get value(){return new Promise(t=>{setTimeout(async()=>{const e=[];for(const o of this._groups)e.push(await o.value);t(e)})})}render(){var t;return this._groups=[],m`
      ${(t=this.groups)==null?void 0:t.map(e=>{const o=document.createElement("bim-table-group");return this._groups.push(o),o.group=e,o.table=this.table,o})}
    `}};vo.styles=x`
    :host {
      position: relative;
      grid-area: Children;
    }

    :host([hidden]) {
      display: none;
    }
  `;let yo=vo;bl([d({type:Array,attribute:!1})],yo.prototype,"groups");var ml=Object.defineProperty,fl=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&ml(t,e,n),n};const Ze=class extends E{constructor(){super(),this._row=document.createElement("bim-table-row"),this._onChildrenExpanded=new Event("children-expanded"),this._onChildrenCollapsed=new Event("children-collapsed"),this.table=this.closest("bim-table"),this.onCaretClick=()=>{this.childrenHidden=!this.childrenHidden,this.childrenHidden?this.dispatchEvent(this._onChildrenCollapsed):this.dispatchEvent(this._onChildrenExpanded)},this.group={data:{}},this.childrenHidden=!1}get value(){return new Promise(t=>{setTimeout(async()=>{const e={data:{},id:this.group.id};e.data=await this._row.value,this._children&&(e.children=await this._children.value),t(e)})})}render(){var t;const e=((t=this.table)==null?void 0:t.getGroupIndentation(this.group))??0,o=m`
      <style>
        .branch-vertical {
          left: ${e+.5625}rem;
        }
      </style>
      <div class="branch branch-vertical"></div>
    `,n=document.createElement("div");n.classList.add("branch","branch-horizontal"),n.style.left=`${e-1+.5625}rem`;const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("height","9.5"),s.setAttribute("width","7.5"),s.setAttribute("viewBox","0 0 4.6666672 7.3333333");const r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),s.append(r);const l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("height","6.5"),l.setAttribute("width","9.5"),l.setAttribute("viewBox","0 0 5.9111118 5.0175439");const a=document.createElementNS("http://www.w3.org/2000/svg","path");a.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),l.append(a);const c=document.createElement("div");c.addEventListener("click",this.onCaretClick),c.classList.add("caret"),c.style.left=`${.125+e}rem`,this.childrenHidden?c.append(s):c.append(l);const h=document.createElement("bim-table-row");h.data=this.group.data,this.group.onRowCreated&&this.group.onRowCreated(h),this._row=h,h.table=this.table,this.group.children&&h.append(c),e!==0&&(!this.group.children||this.childrenHidden)&&h.append(n);let u;return this.group.children&&(u=document.createElement("bim-table-children"),this.group.onChildrenCreated&&this.group.onChildrenCreated(u),this._children=u,u.hidden=this.childrenHidden,u.groups=this.group.children,u.table=this.table),m`
      <div class="parent">
        ${this.group.children&&!this.childrenHidden?o:null}
        ${h} ${u}
      </div>
    `}};Ze.styles=x`
    :host {
      position: relative;
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
  `,Ze.properties={childrenHidden:{type:Boolean,attribute:"children-hidden",reflect:!0}};let _o=Ze;fl([d({type:Object,attribute:!1})],_o.prototype,"group");var gl=Object.defineProperty,_i=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&gl(t,e,n),n};const wo=class extends E{constructor(){super(),this._table=this.closest("bim-table"),this._cells=[],this.onTableIndentationColorChange=t=>{var e;if(!this.table)return;const o=t.detail,{indentationLevel:n,color:s}=o;((e=this.table)==null?void 0:e.getRowIndentation(this.data))===n&&(this.style.backgroundColor=s)},this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.columns=[],this.data={},this.isHeader=!1}get _columnNames(){return this.columns.map(t=>t.name)}get _columnWidths(){return this.columns.map(t=>t.width)}set table(t){this._table&&(this.columns=[],this._table.removeEventListener("columns-change",this.onTableColumnsChange)),this._table=t,this._table&&(this.columns=this._table.columns,this._table.addEventListener("columns-change",this.onTableColumnsChange),this._table.addEventListener("indentation",this.onTableIndentationColorChange))}get table(){return this._table}get value(){return new Promise(t=>{setTimeout(()=>{const e={};for(const o of this._cells)o.column&&(e[o.column]=o.value);t(e)})})}render(){var t;const e=((t=this.table)==null?void 0:t.getRowIndentation(this.data))??0,o=[];for(const n in this.data){const s=this.data[n];let r;typeof s=="function"?r=s(this.data):s instanceof HTMLElement?r=s:r=m`<bim-label label="${s}"></bim-label>`;const l=this._columnNames.indexOf(n)===0,a=`
        ${l&&!this.isHeader?"justify-content: normal":""};
        ${l&&!this.isHeader?`margin-left: ${e+.125}rem`:""}
      `;this._cells=[];const c=m`
        <bim-table-cell ${W(h=>{if(!h)return;const u=h;this._cells.push(u),setTimeout(()=>{this.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:u}}))})})} style="${a}" .column=${n}
          >${r}</bim-table-cell
        >
      `;o.push(c)}return m`
      <style>
        :host {
          grid-template-areas: "${this._columnNames.join(" ")}";
          grid-template-columns: ${this._columnWidths.join(" ")};
        }
      </style>
      ${o}
      <slot></slot>
    `}};wo.styles=x`
    :host {
      position: relative;
      grid-area: Data;
      display: grid;
      min-height: 2.25rem;
      /* border-bottom: 1px solid var(--bim-ui_bg-contrast-20); */
    }
  `;let ke=wo;_i([d({type:Array,attribute:!1})],ke.prototype,"columns");_i([d({type:Object,attribute:!1})],ke.prototype,"data");_i([d({type:Boolean,attribute:"is-header",reflect:!0})],ke.prototype,"isHeader");var vl=Object.defineProperty,yl=Object.getOwnPropertyDescriptor,ee=(i,t,e,o)=>{for(var n=o>1?void 0:o?yl(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&vl(t,e,n),n};const xo=class extends E{constructor(){super(),this._children=document.createElement("bim-table-children"),this._columnsChange=new Event("columns-change"),this._filteredRows=[],this._rows=[],this._columns=[],this.minColWidth="4rem",this.headersHidden=!1}set rows(t){for(const e of t)this.assignGroupDeclarationID(e);this._rows=t,this._filteredRows=t,this.computeMissingColumns(t)&&(this.columns=this._columns)}get rows(){return this._filteredRows}set columns(t){const e=[];for(const o of t){const n=typeof o=="string"?{name:o,width:`minmax(${this.minColWidth}, 1fr)`}:o;e.push(n)}this._columns=e,this.computeMissingColumns(this.rows),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const t={};for(const e of this.columns)if(typeof e=="string")t[e]=e;else{const{name:o}=e;t[o]=o}return t}get value(){return new Promise(t=>{setTimeout(async()=>{t(await this._children.value)})})}assignGroupDeclarationID(t){t.id||(t.id=le.newRandomId()),t.children&&t.children.forEach(e=>this.assignGroupDeclarationID(e))}getGroupDeclarationById(t,e=this._rows){for(const o of e){if(o.id===t)return o;if(o.children){const n=this.getGroupDeclarationById(t,o.children);if(n)return n}}}computeMissingColumns(t){let e=!1;for(const o of t){const{children:n,data:s}=o;for(const r in s)this._columns.map(l=>typeof l=="string"?l:l.name).includes(r)||(this._columns.push({name:r,width:`minmax(${this.minColWidth}, 1fr)`}),e=!0);if(n){const r=this.computeMissingColumns(n);r&&!e&&(e=r)}}return e}async downloadData(t="BIM Table Data"){const e=await this.value,o=new File([JSON.stringify(e,void 0,2)],`${t}.json`),n=document.createElement("a");n.href=URL.createObjectURL(o),n.download=o.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,e=this.rows,o=0){for(const n of e){if(n.data===t)return o;if(n.children){const s=this.getRowIndentation(t,n.children,o+1);if(s!==null)return s}}return null}getGroupIndentation(t,e=this.rows,o=0){for(const n of e){if(n===t)return o;if(n.children){const s=this.getGroupIndentation(t,n.children,o+1);if(s!==null)return s}}return null}setIndentationColor(t,e){const o=new CustomEvent("indentation",{detail:{indentationLevel:t,color:e}});this.dispatchEvent(o)}async filterRowsByValue(t,e=!1,o){const n=[],s=o??await this.value;for(const r of s){const l=Object.values(r.data).some(c=>Array.isArray(c)?c.includes(t):String(c)===t),a=this.getGroupDeclarationById(r.id);if(!a)return n;if(l){if(e){const c={data:a.data};if(r.children){const h=await this.filterRowsByValue(t,!0,r.children);h.length&&(c.children=h)}n.push(c)}else if(n.push({data:a.data}),r.children){const c=await this.filterRowsByValue(t,!1,r.children);n.push(...c)}}else if(r.children){const c=await this.filterRowsByValue(t,e,r.children);e&&c.length?n.push({data:a.data,children:c}):n.push(...c)}}return n}render(){const t=document.createElement("bim-table-row");t.isHeader=!0,t.data=this._headerRowData,t.table=this,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const e=document.createElement("bim-table-children");return this._children=e,e.groups=this._filteredRows,e.table=this,e.style.gridArea="Body",e.style.backgroundColor="transparent",m`
      <div class="parent">
        ${this.headersHidden?null:t}
        <div style="overflow-x: hidden; grid-area: Body">${e}</div>
      </div>
    `}};xo.styles=[nt.scrollbar,x`
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
    `];let zt=xo;ee([Pn()],zt.prototype,"_filteredRows",2);ee([d({type:Boolean,attribute:"headers-hidden",reflect:!0})],zt.prototype,"headersHidden",2);ee([d({type:String,attribute:"min-col-width",reflect:!0})],zt.prototype,"minColWidth",2);ee([d({type:Array,attribute:!1})],zt.prototype,"rows",1);ee([d({type:Array,attribute:!1})],zt.prototype,"columns",1);var _l=Object.defineProperty,wl=Object.getOwnPropertyDescriptor,wi=(i,t,e,o)=>{for(var n=o>1?void 0:o?wl(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&_l(t,e,n),n};const $o=class extends E{constructor(){super(...arguments),this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}onSlotChange(t){const e=t.target.assignedElements();for(const o of e);}render(){return m`
      <div class="parent">
        <slot @slotchange=${this.onSlotChange}></slot>
      </div>
    `}};$o.styles=x`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let B=$o;wi([d({type:String,reflect:!0})],B.prototype,"name",2);wi([d({type:String,reflect:!0})],B.prototype,"label",2);wi([d({type:Boolean,reflect:!0})],B.prototype,"hidden",1);var xl=Object.defineProperty,$l=Object.getOwnPropertyDescriptor,xi=(i,t,e,o)=>{for(var n=o>1?void 0:o?$l(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&xl(t,e,n),n};const Eo=class extends E{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this._defaultTabName="Unnamed Tab",this.onTabHiddenChange=t=>{const e=t.target;e instanceof B&&!e.hidden&&(e.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=e.name||e.label,e.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const e=[...this.children],o=e.find(n=>n instanceof B&&(n.name===t||n.label===t));for(const n of e){if(!(n instanceof B))continue;n.hidden=o!==n;const s=this.getTabSwitcher(n.name||n.label||this._defaultTabName);s&&s.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(e=>e.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof B))continue;const e=document.createElement("div");e.addEventListener("click",()=>this.tab=t.name||t.label||this._defaultTabName),e.setAttribute("data-name",t.name||t.label||this._defaultTabName),e.className="switcher";const o=document.createElement("bim-label");o.label=t.label||t.name||this._defaultTabName,e.append(o),this._switchers.push(e)}}onSlotChange(t){this.createSwitchers();const e=t.target.assignedElements(),o=e.find(n=>n instanceof B?this.tab?n.name===this.tab||n.label===this.tab:!n.hidden:!1);o&&o instanceof B&&(this.tab=o.name||o.label);for(const n of e){if(!(n instanceof B)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),o!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return m`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Eo.styles=x`
    :host {
      display: block;
      background-color: var(--bim-ui_bg-base);
    }

    .parent {
      display: grid;
      grid-template: "switchers" auto "content" 1fr;
      height: 100%;
    }

    :host([bottom]) .parent {
      grid-template: "content" "switchers";
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
      background-color: var(--bim-ui_color-main);
      --bim-label--c: var(--bim-ui_bg-contrast-100);
    }

    .switchers bim-label {
      pointer-events: none;
    }

    :host(:not([bottom])) .content {
      border-top: 1px solid var(--bim-ui_bg-contrast-20);
    }

    :host([bottom]) .content {
      border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
    }
  `;let Se=Eo;xi([Pn()],Se.prototype,"_switchers",2);xi([d({type:Boolean,reflect:!0})],Se.prototype,"bottom",2);xi([d({type:String,reflect:!0})],Se.prototype,"tab",1);var El=Object.defineProperty,Al=Object.getOwnPropertyDescriptor,mt=(i,t,e,o)=>{for(var n=o>1?void 0:o?Al(t,e):t,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=(o?r(t,e,n):r(n))||n);return o&&n&&El(t,e,n),n};const Ao=class extends E{constructor(){super(),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week"],this._type="text",this.onValueChange=new Event("input"),this.value="",this.placeholder="",this.vertical=!1}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}onInputChange(t){t.stopPropagation();const e=t.target;this.value=e.value,this.dispatchEvent(this.onValueChange)}render(){return m`
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
          .placeholder=${this.placeholder}
          @input=${this.onInputChange}
        />
      </bim-input>
    `}};Ao.styles=x`
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

    :host([disabled]) {
      /* --bim-input--bgc: var(--bim-ui_bg-) */
    }
  `;let st=Ao;mt([d({type:String,reflect:!0})],st.prototype,"icon",2);mt([d({type:String,reflect:!0})],st.prototype,"label",2);mt([d({type:String,reflect:!0})],st.prototype,"name",2);mt([d({type:String,reflect:!0})],st.prototype,"placeholder",2);mt([d({type:String,reflect:!0})],st.prototype,"value",2);mt([d({type:Boolean,reflect:!0})],st.prototype,"vertical",2);mt([d({type:String,reflect:!0})],st.prototype,"type",1);const ti=class extends E{constructor(){super(),this._vertical=!1,this.rows=2,this.vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const e of t)this.vertical?e.setAttribute("label-hidden",""):e.removeAttribute("label-hidden")}render(){return m`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};ti.styles=x`
    .parent {
      display: grid;
      gap: 0.25rem;
    }

    ::slotted(bim-button[label]:not([vertical])) {
      --bim-button--jc: flex-start;
    }
  `,ti.properties={rows:{type:Number,reflect:!0},vertical:{type:Boolean,reflect:!0}};let Co=ti;const ei=class extends E{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const e of t)e instanceof Co&&(e.vertical=this.vertical),e.toggleAttribute("label-hidden",this.vertical)}connectedCallback(){super.connectedCallback()}render(){return m`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?m`<bim-label
              .label=${this.label}
              .icon=${this.icon}
            ></bim-label>`:null}
      </div>
    `}};ei.styles=x`
    :host {
      --bim-label--fz: var(--bim-ui_size-xs);
      --bim-label--c: var(--bim-ui_bg-contrast-60);
      width: 100%;
      height: 100%;
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
      height: 100%;
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
  `,ei.properties={label:{type:String,reflect:!0},icon:{type:String,reflect:!0},vertical:{type:Boolean,reflect:!0},labelHidden:{type:Boolean,attribute:"label-hidden",reflect:!0}};let ko=ei;const ii=class So extends E{constructor(){super(),this._managerID=le.newRandomId(),this._active=!1,this._vertical=!1,this._gridArea="",this.activationButton=document.createElement("bim-button"),this.setActivationButton()}set active(t){var e;if(this._active=t,this.activationButton.active=t,t){const o=((e=this.parentElement)==null?void 0:e.children)??[];for(const n of o)n instanceof So&&n!==this&&(n.active=!1)}}get active(){return this._active}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}get gridArea(){return this._gridArea}set gridArea(t){this._gridArea=t,this.style.gridArea=`toolbar-${t}`}setActivationButton(){this.activationButton.draggable=le.config.draggableToolbars,this.activationButton.addEventListener("click",()=>this.active=!this.active),this.activationButton.setAttribute("data-ui-manager-id",this._managerID),this.activationButton.addEventListener("dragstart",t=>{const e=this.getAttribute("data-ui-manager-id");t.dataTransfer&&e&&(t.dataTransfer.setData("id",e),t.dataTransfer.effectAllowed="move");const o=document.querySelectorAll("bim-toolbars-container");for(const n of o)n!==this.parentElement&&(n.dropping=!0)}),this.activationButton.addEventListener("dragend",t=>{t.dataTransfer&&t.dataTransfer.clearData();const e=document.querySelectorAll("bim-toolbars-container");for(const o of e)o.dropping=!1})}updateSections(){const t=this.children;for(const e of t)e instanceof ko&&(e.labelHidden=this.vertical&&!le.config.sectionLabelOnVerticalToolbar,e.vertical=this.vertical)}firstUpdated(){this.setAttribute("data-ui-manager-id",this._managerID)}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}render(){return this.activationButton.label=this.label,this.activationButton.active=this.active,this.activationButton.icon=this.icon,m`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};ii.styles=x`
    :host {
      --bim-button--bgc: transparent;
      background-color: var(--bim-ui_bg-base);
      border-radius: var(--bim-ui_size-4xs);
    }

    :host([active]) {
      display: block;
    }

    :host(:not([active])) {
      display: none;
    }

    .parent {
      display: flex;
      align-items: center;
    }

    :host([vertical]) .parent {
      flex-direction: column;
    }

    ::slotted(bim-toolbar-section:not(:last-child)) {
      border-right: 1px solid var(--bim-ui_bg-contrast-20);
      border-bottom: none;
    }

    :host([vertical]) ::slotted(bim-toolbar-section:not(:last-child)) {
      border-bottom: 1px solid var(--bim-ui_bg-contrast-20);
      border-right: none;
    }
  `,ii.properties={label:{type:String,reflect:!0},icon:{type:String,reflect:!0},labelsHidden:{type:Boolean,attribute:"labels-hidden",reflect:!0},vertical:{type:Boolean,reflect:!0},gridArea:{type:String,attribute:!1},active:{type:Boolean,reflect:!0}};let Oo=ii;const ni=class extends E{constructor(){super(),this._vertical=!1,this._activationButtons=[],this.onDragOver=t=>{t.preventDefault(),t.dataTransfer&&(t.dataTransfer.effectAllowed="move")},this.onDrop=t=>{var e;t.preventDefault();const o=(e=t.dataTransfer)==null?void 0:e.getData("id");if(!o)return;const n=document.querySelector(`bim-toolbar[data-ui-manager-id='${o}']`);!n||[...this.children].includes(n)||this.append(n)},this.addEventListener("dragover",this.onDragOver),this.addEventListener("drop",this.onDrop)}set vertical(t){this._vertical=t,this.updateToolbars()}get vertical(){return this._vertical}updateToolbars(){let t=!1;for(const e of this.children)e instanceof Oo&&(t?e.active=!1:t=e.active,this._activationButtons.push(e.activationButton),e.vertical=this.vertical);this.requestUpdate()}render(){const t=m`<div class="tabs">
      ${this._activationButtons}
    </div>`,e=m`<bim-button style="flex-grow: 0;"
      >${this._activationButtons}</bim-button
    >`,o=m`<div class="drop-element"></div>`;return m`
      <div class="parent">
        ${this.vertical?null:t}
        ${this.vertical?e:null}
        ${this.dropping?o:m`
              <div class="toolbars">
                <slot @slotchange=${this.updateToolbars}></slot>
              </div>
            `}
      </div>
    `}};ni.styles=[nt.scrollbar,x`
      :host {
        display: block;
        justify-self: var(--bim-toolbars-container--js);
        align-self: var(--bim-toolbars-container--as);
      }

      :host([dropping]) {
        justify-self: auto;
        align-self: auto;
      }

      /* Parent */

      .parent {
        display: flex;
        pointer-events: auto;
      }

      :host([floating]) .parent {
        align-items: center;
      }

      :host([vertical]) .parent {
        height: 100%;
        flex-direction: column;
      }

      :host(:not([vertical])) .parent {
        flex-direction: column;
      }

      /* Tabs container */

      .tabs {
        --bim-label--fz: var(--bim-ui_size-xs);
        --bim-label--c: var(--bim-ui_bg-contrast-100);
        --bim-button--bdrs: 0;
        --bim-button--bgc: var(--bim-ui_bg-base);
        display: flex;
        width: fit-content;
      }

      :host([tabs-hidden]) .tabs {
        display: none;
      }

      :host([floating]) .tabs {
        overflow: hidden;
        border-top-left-radius: var(
          --bim-toolbars-container--bdrs,
          var(--bim-ui_size-4xs)
        );
        border-top-right-radius: var(
          --bim-toolbars-container--bdrs,
          var(--bim-ui_size-4xs)
        );
        box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.15);
        outline: var(--bim-toolbars-container--olw) solid
          var(--bim-toolbars-container--olc);
      }

      :host([vertical]) .tabs {
        display: none;
        writing-mode: tb;
      }

      .tabs bim-button {
        font-weight: 600;
        height: var(--bim-ui_size-9xl);
      }

      .tabs bim-button:hover,
      .tabs bim-button[active] {
        --bim-label--c: white;
        background-color: var(--bim-ui_color-main);
      }

      /* Toolbars container */

      .toolbars {
        overflow: auto;
        display: flex;
        flex: 1;
        background-color: var(
          --bim-toolbars-container--bgc,
          var(--bim-ui_bg-base)
        );
      }

      :host([floating]:not([vertical])) .toolbars {
        width: 120%;
        justify-content: center;
      }

      :host([floating]) .toolbars {
        outline: var(--bim-toolbars-container--olw) solid
          var(--bim-toolbars-container--olc);
        border-radius: var(
          --bim-toolbars-container--bdrs,
          var(--bim-ui_size-4xs)
        );
        box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.15);
      }

      :host([floating][vertical]) .toolbars {
        border-radius: var(
          --bim-toolbars-container--bdrs,
          0 0 var(--bim-ui_size-4xs) var(--bim-ui_size-4xs)
        );
      }

      :host([vertical]) .toolbars {
        flex-direction: column;
      }

      :host([tabs]) .toolbars {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      :host(:not([tabs-hidden]):not([floating])) .toolbars {
        border-top: 1px solid var(--bim-ui_bg-contrast-20);
      }

      /* More toolbars button */
      .parent > bim-button {
        --bim-button--bgc: var(--bim-ui_bg-base);
        --bim-button--bdrs: var(--bim-ui_size-4xs) var(--bim-ui_size-4xs) 0 0;
        --bim-button--olw: 1px;
        --bim-button--olc: var(--bim-ui_bg-contrast-20);
        width: 100%;
      }

      :host(:not([floating])) .parent > bim-button {
        --bim-button--bdrs: 0;
      }

      /* Drop element */

      .drop-element {
        box-sizing: border-box;
        min-width: 2.75rem;
        width: 100%;
        min-height: 2.75rem;
        height: 100%;
        background-color: #6528d70d;
        border: 2px dashed var(--bim-ui_color-main);
        border-radius: 1rem;
        z-index: 1000;
      }
    `],ni.properties={floating:{type:Boolean,reflect:!0},vertical:{type:Boolean,reflect:!0},gridArea:{type:String,attribute:!1},tabsHidden:{type:Boolean,attribute:"tabs-hidden",reflect:!0},dropping:{type:Boolean,reflect:!0}};let Cl=ni;var kl=Object.defineProperty,Sl=(i,t,e,o)=>{for(var n=void 0,s=i.length-1,r;s>=0;s--)(r=i[s])&&(n=r(t,e,n)||n);return n&&kl(t,e,n),n};const To=class extends E{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>this.dispatchEvent(this._onResize)).observe(this)}firstUpdated(){this.style.gridArea===""&&this.name&&(this.style.gridArea=this.name)}render(){return m`
      <div class="parent">
        <slot></slot>
      </div>
    `}};To.styles=x`
    :host {
      position: relative;
      display: block;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }

    .parent {
      position: relative;
      height: 100%;
    }
  `;let zo=To;Sl([d({type:String,reflect:!0})],zo.prototype,"name");export{E as C,m as b,le as k};
