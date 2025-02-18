import{W as ki,S as Vo,O as Wo,G as Go,F as Vt,I as ht,B as Oi,V as vn,f as Qr,H as Yo,g as Zr,c as Kr,h as ta,i as mi,T as yt}from"./index-4oEgnBmA.js";import{V as yn,c as Ti,C as ue,G as Fn,F as ea,L as ia,d as Bn,e as na,f as oa,P as ri,g as Ce,D as sa,A as ra,O as aa,h as la,I as ca,R as da,i as qo,j as Xo,k as ua,l as Jo,m as ha,n as pa,o as Qo,p as Zo,q as ma,r as fa}from"./web-ifc-api-r1ed24cU.js";import{X as ba,W as P,L as ga}from"./index-CDKMALq_.js";var va=Object.defineProperty,ya=(e,t,i)=>t in e?va(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,Nt=(e,t,i)=>(ya(e,typeof t!="symbol"?t+"":t,i),i);const te=Math.min,mt=Math.max,fi=Math.round,Ct=e=>({x:e,y:e}),_a={left:"right",right:"left",bottom:"top",top:"bottom"},$a={start:"end",end:"start"};function Un(e,t,i){return mt(e,te(t,i))}function Ge(e,t){return typeof e=="function"?e(t):e}function ft(e){return e.split("-")[0]}function Ii(e){return e.split("-")[1]}function Ko(e){return e==="x"?"y":"x"}function ts(e){return e==="y"?"height":"width"}function Ht(e){return["top","bottom"].includes(ft(e))?"y":"x"}function es(e){return Ko(Ht(e))}function xa(e,t,i){i===void 0&&(i=!1);const n=Ii(e),o=es(e),s=ts(o);let r=o==="x"?n===(i?"end":"start")?"right":"left":n==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=bi(r)),[r,bi(r)]}function wa(e){const t=bi(e);return[en(e),t,en(t)]}function en(e){return e.replace(/start|end/g,t=>$a[t])}function Ca(e,t,i){const n=["left","right"],o=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return i?t?o:n:t?n:o;case"left":case"right":return t?s:r;default:return[]}}function Aa(e,t,i,n){const o=Ii(e);let s=Ca(ft(e),i==="start",n);return o&&(s=s.map(r=>r+"-"+o),t&&(s=s.concat(s.map(en)))),s}function bi(e){return e.replace(/left|right|bottom|top/g,t=>_a[t])}function Ea(e){return{top:0,right:0,bottom:0,left:0,...e}}function is(e){return typeof e!="number"?Ea(e):{top:e,right:e,bottom:e,left:e}}function ee(e){const{x:t,y:i,width:n,height:o}=e;return{width:n,height:o,top:i,left:t,right:t+n,bottom:i+o,x:t,y:i}}function Vn(e,t,i){let{reference:n,floating:o}=e;const s=Ht(t),r=es(t),l=ts(r),a=ft(t),d=s==="y",u=n.x+n.width/2-o.width/2,c=n.y+n.height/2-o.height/2,h=n[l]/2-o[l]/2;let p;switch(a){case"top":p={x:u,y:n.y-o.height};break;case"bottom":p={x:u,y:n.y+n.height};break;case"right":p={x:n.x+n.width,y:c};break;case"left":p={x:n.x-o.width,y:c};break;default:p={x:n.x,y:n.y}}switch(Ii(t)){case"start":p[r]-=h*(i&&d?-1:1);break;case"end":p[r]+=h*(i&&d?-1:1);break}return p}const Sa=async(e,t,i)=>{const{placement:n="bottom",strategy:o="absolute",middleware:s=[],platform:r}=i,l=s.filter(Boolean),a=await(r.isRTL==null?void 0:r.isRTL(t));let d=await r.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:c}=Vn(d,n,a),h=n,p={},b=0;for(let $=0;$<l.length;$++){const{name:v,fn:f}=l[$],{x:y,y:_,data:x,reset:A}=await f({x:u,y:c,initialPlacement:n,placement:h,strategy:o,middlewareData:p,rects:d,platform:r,elements:{reference:e,floating:t}});u=y??u,c=_??c,p={...p,[v]:{...p[v],...x}},A&&b<=50&&(b++,typeof A=="object"&&(A.placement&&(h=A.placement),A.rects&&(d=A.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:o}):A.rects),{x:u,y:c}=Vn(d,h,a)),$=-1)}return{x:u,y:c,placement:h,strategy:o,middlewareData:p}};async function ns(e,t){var i;t===void 0&&(t={});const{x:n,y:o,platform:s,rects:r,elements:l,strategy:a}=e,{boundary:d="clippingAncestors",rootBoundary:u="viewport",elementContext:c="floating",altBoundary:h=!1,padding:p=0}=Ge(t,e),b=is(p),$=l[h?c==="floating"?"reference":"floating":c],v=ee(await s.getClippingRect({element:(i=await(s.isElement==null?void 0:s.isElement($)))==null||i?$:$.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(l.floating)),boundary:d,rootBoundary:u,strategy:a})),f=c==="floating"?{x:n,y:o,width:r.floating.width,height:r.floating.height}:r.reference,y=await(s.getOffsetParent==null?void 0:s.getOffsetParent(l.floating)),_=await(s.isElement==null?void 0:s.isElement(y))?await(s.getScale==null?void 0:s.getScale(y))||{x:1,y:1}:{x:1,y:1},x=ee(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:f,offsetParent:y,strategy:a}):f);return{top:(v.top-x.top+b.top)/_.y,bottom:(x.bottom-v.bottom+b.bottom)/_.y,left:(v.left-x.left+b.left)/_.x,right:(x.right-v.right+b.right)/_.x}}const ka=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,n;const{placement:o,middlewareData:s,rects:r,initialPlacement:l,platform:a,elements:d}=t,{mainAxis:u=!0,crossAxis:c=!0,fallbackPlacements:h,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:b="none",flipAlignment:$=!0,...v}=Ge(e,t);if((i=s.arrow)!=null&&i.alignmentOffset)return{};const f=ft(o),y=Ht(l),_=ft(l)===l,x=await(a.isRTL==null?void 0:a.isRTL(d.floating)),A=h||(_||!$?[bi(l)]:wa(l)),C=b!=="none";!h&&C&&A.push(...Aa(l,$,b,x));const T=[l,...A],M=await ns(t,v),S=[];let E=((n=s.flip)==null?void 0:n.overflows)||[];if(u&&S.push(M[f]),c){const w=xa(o,r,x);S.push(M[w[0]],M[w[1]])}if(E=[...E,{placement:o,overflows:S}],!S.every(w=>w<=0)){var B,q;const w=(((B=s.flip)==null?void 0:B.index)||0)+1,L=T[w];if(L)return{data:{index:w,overflows:E},reset:{placement:L}};let V=(q=E.filter(K=>K.overflows[0]<=0).sort((K,tt)=>K.overflows[1]-tt.overflows[1])[0])==null?void 0:q.placement;if(!V)switch(p){case"bestFit":{var G;const K=(G=E.filter(tt=>{if(C){const ct=Ht(tt.placement);return ct===y||ct==="y"}return!0}).map(tt=>[tt.placement,tt.overflows.filter(ct=>ct>0).reduce((ct,xe)=>ct+xe,0)]).sort((tt,ct)=>tt[1]-ct[1])[0])==null?void 0:G[0];K&&(V=K);break}case"initialPlacement":V=l;break}if(o!==V)return{reset:{placement:V}}}return{}}}};function os(e){const t=te(...e.map(s=>s.left)),i=te(...e.map(s=>s.top)),n=mt(...e.map(s=>s.right)),o=mt(...e.map(s=>s.bottom));return{x:t,y:i,width:n-t,height:o-i}}function Oa(e){const t=e.slice().sort((o,s)=>o.y-s.y),i=[];let n=null;for(let o=0;o<t.length;o++){const s=t[o];!n||s.y-n.y>n.height/2?i.push([s]):i[i.length-1].push(s),n=s}return i.map(o=>ee(os(o)))}const Ta=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:n,rects:o,platform:s,strategy:r}=t,{padding:l=2,x:a,y:d}=Ge(e,t),u=Array.from(await(s.getClientRects==null?void 0:s.getClientRects(n.reference))||[]),c=Oa(u),h=ee(os(u)),p=is(l);function b(){if(c.length===2&&c[0].left>c[1].right&&a!=null&&d!=null)return c.find(v=>a>v.left-p.left&&a<v.right+p.right&&d>v.top-p.top&&d<v.bottom+p.bottom)||h;if(c.length>=2){if(Ht(i)==="y"){const E=c[0],B=c[c.length-1],q=ft(i)==="top",G=E.top,w=B.bottom,L=q?E.left:B.left,V=q?E.right:B.right,K=V-L,tt=w-G;return{top:G,bottom:w,left:L,right:V,width:K,height:tt,x:L,y:G}}const v=ft(i)==="left",f=mt(...c.map(E=>E.right)),y=te(...c.map(E=>E.left)),_=c.filter(E=>v?E.left===y:E.right===f),x=_[0].top,A=_[_.length-1].bottom,C=y,T=f,M=T-C,S=A-x;return{top:x,bottom:A,left:C,right:T,width:M,height:S,x:C,y:x}}return h}const $=await s.getElementRects({reference:{getBoundingClientRect:b},floating:n.floating,strategy:r});return o.reference.x!==$.reference.x||o.reference.y!==$.reference.y||o.reference.width!==$.reference.width||o.reference.height!==$.reference.height?{reset:{rects:$}}:{}}}};async function Ia(e,t){const{placement:i,platform:n,elements:o}=e,s=await(n.isRTL==null?void 0:n.isRTL(o.floating)),r=ft(i),l=Ii(i),a=Ht(i)==="y",d=["left","top"].includes(r)?-1:1,u=s&&a?-1:1,c=Ge(t,e);let{mainAxis:h,crossAxis:p,alignmentAxis:b}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return l&&typeof b=="number"&&(p=l==="end"?b*-1:b),a?{x:p*u,y:h*d}:{x:h*d,y:p*u}}const ss=function(e){return{name:"offset",options:e,async fn(t){var i,n;const{x:o,y:s,placement:r,middlewareData:l}=t,a=await Ia(t,e);return r===((i=l.offset)==null?void 0:i.placement)&&(n=l.arrow)!=null&&n.alignmentOffset?{}:{x:o+a.x,y:s+a.y,data:{...a,placement:r}}}}},Na=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:n,placement:o}=t,{mainAxis:s=!0,crossAxis:r=!1,limiter:l={fn:v=>{let{x:f,y}=v;return{x:f,y}}},...a}=Ge(e,t),d={x:i,y:n},u=await ns(t,a),c=Ht(ft(o)),h=Ko(c);let p=d[h],b=d[c];if(s){const v=h==="y"?"top":"left",f=h==="y"?"bottom":"right",y=p+u[v],_=p-u[f];p=Un(y,p,_)}if(r){const v=c==="y"?"top":"left",f=c==="y"?"bottom":"right",y=b+u[v],_=b-u[f];b=Un(y,b,_)}const $=l.fn({...t,[h]:p,[c]:b});return{...$,data:{x:$.x-i,y:$.y-n,enabled:{[h]:s,[c]:r}}}}}};function Ni(){return typeof window<"u"}function At(e){return rs(e)?(e.nodeName||"").toLowerCase():"#document"}function Q(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function St(e){var t;return(t=(rs(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function rs(e){return Ni()?e instanceof Node||e instanceof Q(e).Node:!1}function dt(e){return Ni()?e instanceof Element||e instanceof Q(e).Element:!1}function ut(e){return Ni()?e instanceof HTMLElement||e instanceof Q(e).HTMLElement:!1}function Wn(e){return!Ni()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof Q(e).ShadowRoot}function Ye(e){const{overflow:t,overflowX:i,overflowY:n,display:o}=it(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+i)&&!["inline","contents"].includes(o)}function Ma(e){return["table","td","th"].includes(At(e))}function Pa(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function _n(e){const t=$n(),i=dt(e)?it(e):e;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(i.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(i.contain||"").includes(n))}function Ra(e){let t=ie(e);for(;ut(t)&&!Mi(t);){if(_n(t))return t;if(Pa(t))return null;t=ie(t)}return null}function $n(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Mi(e){return["html","body","#document"].includes(At(e))}function it(e){return Q(e).getComputedStyle(e)}function Pi(e){return dt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ie(e){if(At(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Wn(e)&&e.host||St(e);return Wn(t)?t.host:t}function as(e){const t=ie(e);return Mi(t)?e.ownerDocument?e.ownerDocument.body:e.body:ut(t)&&Ye(t)?t:as(t)}function ls(e,t,i){var n;t===void 0&&(t=[]);const o=as(e),s=o===((n=e.ownerDocument)==null?void 0:n.body),r=Q(o);return s?(La(r),t.concat(r,r.visualViewport||[],Ye(o)?o:[],[])):t.concat(o,ls(o,[]))}function La(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function cs(e){const t=it(e);let i=parseFloat(t.width)||0,n=parseFloat(t.height)||0;const o=ut(e),s=o?e.offsetWidth:i,r=o?e.offsetHeight:n,l=fi(i)!==s||fi(n)!==r;return l&&(i=s,n=r),{width:i,height:n,$:l}}function ds(e){return dt(e)?e:e.contextElement}function Qt(e){const t=ds(e);if(!ut(t))return Ct(1);const i=t.getBoundingClientRect(),{width:n,height:o,$:s}=cs(t);let r=(s?fi(i.width):i.width)/n,l=(s?fi(i.height):i.height)/o;return(!r||!Number.isFinite(r))&&(r=1),(!l||!Number.isFinite(l))&&(l=1),{x:r,y:l}}const ja=Ct(0);function us(e){const t=Q(e);return!$n()||!t.visualViewport?ja:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function za(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==Q(e)?!1:t}function Re(e,t,i,n){t===void 0&&(t=!1),i===void 0&&(i=!1);const o=e.getBoundingClientRect(),s=ds(e);let r=Ct(1);t&&(n?dt(n)&&(r=Qt(n)):r=Qt(e));const l=za(s,i,n)?us(s):Ct(0);let a=(o.left+l.x)/r.x,d=(o.top+l.y)/r.y,u=o.width/r.x,c=o.height/r.y;if(s){const h=Q(s),p=n&&dt(n)?Q(n):n;let b=h,$=b.frameElement;for(;$&&n&&p!==b;){const v=Qt($),f=$.getBoundingClientRect(),y=it($),_=f.left+($.clientLeft+parseFloat(y.paddingLeft))*v.x,x=f.top+($.clientTop+parseFloat(y.paddingTop))*v.y;a*=v.x,d*=v.y,u*=v.x,c*=v.y,a+=_,d+=x,b=Q($),$=b.frameElement}}return ee({width:u,height:c,x:a,y:d})}const Da=[":popover-open",":modal"];function hs(e){return Da.some(t=>{try{return e.matches(t)}catch{return!1}})}function Ha(e){let{elements:t,rect:i,offsetParent:n,strategy:o}=e;const s=o==="fixed",r=St(n),l=t?hs(t.floating):!1;if(n===r||l&&s)return i;let a={scrollLeft:0,scrollTop:0},d=Ct(1);const u=Ct(0),c=ut(n);if((c||!c&&!s)&&((At(n)!=="body"||Ye(r))&&(a=Pi(n)),ut(n))){const h=Re(n);d=Qt(n),u.x=h.x+n.clientLeft,u.y=h.y+n.clientTop}return{width:i.width*d.x,height:i.height*d.y,x:i.x*d.x-a.scrollLeft*d.x+u.x,y:i.y*d.y-a.scrollTop*d.y+u.y}}function Fa(e){return Array.from(e.getClientRects())}function ps(e){return Re(St(e)).left+Pi(e).scrollLeft}function Ba(e){const t=St(e),i=Pi(e),n=e.ownerDocument.body,o=mt(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),s=mt(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight);let r=-i.scrollLeft+ps(e);const l=-i.scrollTop;return it(n).direction==="rtl"&&(r+=mt(t.clientWidth,n.clientWidth)-o),{width:o,height:s,x:r,y:l}}function Ua(e,t){const i=Q(e),n=St(e),o=i.visualViewport;let s=n.clientWidth,r=n.clientHeight,l=0,a=0;if(o){s=o.width,r=o.height;const d=$n();(!d||d&&t==="fixed")&&(l=o.offsetLeft,a=o.offsetTop)}return{width:s,height:r,x:l,y:a}}function Va(e,t){const i=Re(e,!0,t==="fixed"),n=i.top+e.clientTop,o=i.left+e.clientLeft,s=ut(e)?Qt(e):Ct(1),r=e.clientWidth*s.x,l=e.clientHeight*s.y,a=o*s.x,d=n*s.y;return{width:r,height:l,x:a,y:d}}function Gn(e,t,i){let n;if(t==="viewport")n=Ua(e,i);else if(t==="document")n=Ba(St(e));else if(dt(t))n=Va(t,i);else{const o=us(e);n={...t,x:t.x-o.x,y:t.y-o.y}}return ee(n)}function ms(e,t){const i=ie(e);return i===t||!dt(i)||Mi(i)?!1:it(i).position==="fixed"||ms(i,t)}function Wa(e,t){const i=t.get(e);if(i)return i;let n=ls(e,[]).filter(l=>dt(l)&&At(l)!=="body"),o=null;const s=it(e).position==="fixed";let r=s?ie(e):e;for(;dt(r)&&!Mi(r);){const l=it(r),a=_n(r);!a&&l.position==="fixed"&&(o=null),(s?!a&&!o:!a&&l.position==="static"&&o&&["absolute","fixed"].includes(o.position)||Ye(r)&&!a&&ms(e,r))?n=n.filter(d=>d!==r):o=l,r=ie(r)}return t.set(e,n),n}function Ga(e){let{element:t,boundary:i,rootBoundary:n,strategy:o}=e;const s=[...i==="clippingAncestors"?Wa(t,this._c):[].concat(i),n],r=s[0],l=s.reduce((a,d)=>{const u=Gn(t,d,o);return a.top=mt(u.top,a.top),a.right=te(u.right,a.right),a.bottom=te(u.bottom,a.bottom),a.left=mt(u.left,a.left),a},Gn(t,r,o));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Ya(e){const{width:t,height:i}=cs(e);return{width:t,height:i}}function qa(e,t,i){const n=ut(t),o=St(t),s=i==="fixed",r=Re(e,!0,s,t);let l={scrollLeft:0,scrollTop:0};const a=Ct(0);if(n||!n&&!s)if((At(t)!=="body"||Ye(o))&&(l=Pi(t)),n){const c=Re(t,!0,s,t);a.x=c.x+t.clientLeft,a.y=c.y+t.clientTop}else o&&(a.x=ps(o));const d=r.left+l.scrollLeft-a.x,u=r.top+l.scrollTop-a.y;return{x:d,y:u,width:r.width,height:r.height}}function Yn(e,t){return!ut(e)||it(e).position==="fixed"?null:t?t(e):e.offsetParent}function fs(e,t){const i=Q(e);if(!ut(e)||hs(e))return i;let n=Yn(e,t);for(;n&&Ma(n)&&it(n).position==="static";)n=Yn(n,t);return n&&(At(n)==="html"||At(n)==="body"&&it(n).position==="static"&&!_n(n))?i:n||Ra(e)||i}const Xa=async function(e){const t=this.getOffsetParent||fs,i=this.getDimensions;return{reference:qa(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function Ja(e){return it(e).direction==="rtl"}const Qa={convertOffsetParentRelativeRectToViewportRelativeRect:Ha,getDocumentElement:St,getClippingRect:Ga,getOffsetParent:fs,getElementRects:Xa,getClientRects:Fa,getDimensions:Ya,getScale:Qt,isElement:dt,isRTL:Ja},bs=Na,gs=ka,vs=Ta,ys=(e,t,i)=>{const n=new Map,o={platform:Qa,...i},s={...o.platform,_c:n};return Sa(e,t,{...o,platform:s})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const di=globalThis,xn=di.ShadowRoot&&(di.ShadyCSS===void 0||di.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,wn=Symbol(),qn=new WeakMap;let _s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==wn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(xn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=qn.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&qn.set(t,e))}return e}toString(){return this.cssText}};const Za=e=>new _s(typeof e=="string"?e:e+"",void 0,wn),I=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new _s(i,e,wn)},Ka=(e,t)=>{if(xn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),o=di.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=i.cssText,e.appendChild(n)}},Xn=xn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Za(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:tl,defineProperty:el,getOwnPropertyDescriptor:il,getOwnPropertyNames:nl,getOwnPropertySymbols:ol,getPrototypeOf:sl}=Object,ne=globalThis,Jn=ne.trustedTypes,rl=Jn?Jn.emptyScript:"",Qn=ne.reactiveElementPolyfillSupport,Oe=(e,t)=>e,gi={toAttribute(e,t){switch(t){case Boolean:e=e?rl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},Cn=(e,t)=>!tl(e,t),Zn={attribute:!0,type:String,converter:gi,reflect:!1,hasChanged:Cn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ne.litPropertyMetadata??(ne.litPropertyMetadata=new WeakMap);class Xt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Zn){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),o=this.getPropertyDescriptor(t,n,i);o!==void 0&&el(this.prototype,t,o)}}static getPropertyDescriptor(t,i,n){const{get:o,set:s}=il(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return o==null?void 0:o.call(this)},set(r){const l=o==null?void 0:o.call(this);s.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Zn}static _$Ei(){if(this.hasOwnProperty(Oe("elementProperties")))return;const t=sl(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Oe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Oe("properties"))){const i=this.properties,n=[...nl(i),...ol(i)];for(const o of n)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,o]of i)this.elementProperties.set(n,o)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const o=this._$Eu(i,n);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const o of n)i.unshift(Xn(o))}else t!==void 0&&i.push(Xn(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ka(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:gi).toAttribute(i,o.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,i){var n;const o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=o.getPropertyOptions(s),l=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:gi;this._$Em=s,this[s]=l.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??Cn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,r]of o)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(o=>{var s;return(s=o.hostUpdate)==null?void 0:s.call(o)}),this.update(n)):this._$EU()}catch(o){throw i=!1,this._$EU(),o}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdated)==null?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Xt.elementStyles=[],Xt.shadowRootOptions={mode:"open"},Xt[Oe("elementProperties")]=new Map,Xt[Oe("finalized")]=new Map,Qn==null||Qn({ReactiveElement:Xt}),(ne.reactiveElementVersions??(ne.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vi=globalThis,yi=vi.trustedTypes,Kn=yi?yi.createPolicy("lit-html",{createHTML:e=>e}):void 0,$s="$lit$",xt=`lit$${Math.random().toFixed(9).slice(2)}$`,xs="?"+xt,al=`<${xs}>`,Ft=document,Le=()=>Ft.createComment(""),je=e=>e===null||typeof e!="object"&&typeof e!="function",An=Array.isArray,ll=e=>An(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Yi=`[ 	
\f\r]`,Ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,to=/-->/g,eo=/>/g,Mt=RegExp(`>|${Yi}(?:([^\\s"'>=/]+)(${Yi}*=${Yi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),io=/'/g,no=/"/g,ws=/^(?:script|style|textarea|title)$/i,cl=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),m=cl(1),Bt=Symbol.for("lit-noChange"),R=Symbol.for("lit-nothing"),oo=new WeakMap,Rt=Ft.createTreeWalker(Ft,129);function Cs(e,t){if(!An(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Kn!==void 0?Kn.createHTML(t):t}const dl=(e,t)=>{const i=e.length-1,n=[];let o,s=t===2?"<svg>":t===3?"<math>":"",r=Ae;for(let l=0;l<i;l++){const a=e[l];let d,u,c=-1,h=0;for(;h<a.length&&(r.lastIndex=h,u=r.exec(a),u!==null);)h=r.lastIndex,r===Ae?u[1]==="!--"?r=to:u[1]!==void 0?r=eo:u[2]!==void 0?(ws.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Mt):u[3]!==void 0&&(r=Mt):r===Mt?u[0]===">"?(r=o??Ae,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Mt:u[3]==='"'?no:io):r===no||r===io?r=Mt:r===to||r===eo?r=Ae:(r=Mt,o=void 0);const p=r===Mt&&e[l+1].startsWith("/>")?" ":"";s+=r===Ae?a+al:c>=0?(n.push(d),a.slice(0,c)+$s+a.slice(c)+xt+p):a+xt+(c===-2?l:p)}return[Cs(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class ze{constructor({strings:t,_$litType$:i},n){let o;this.parts=[];let s=0,r=0;const l=t.length-1,a=this.parts,[d,u]=dl(t,i);if(this.el=ze.createElement(d,n),Rt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=Rt.nextNode())!==null&&a.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith($s)){const h=u[r++],p=o.getAttribute(c).split(xt),b=/([.?@])?(.*)/.exec(h);a.push({type:1,index:s,name:b[2],strings:p,ctor:b[1]==="."?hl:b[1]==="?"?pl:b[1]==="@"?ml:Ri}),o.removeAttribute(c)}else c.startsWith(xt)&&(a.push({type:6,index:s}),o.removeAttribute(c));if(ws.test(o.tagName)){const c=o.textContent.split(xt),h=c.length-1;if(h>0){o.textContent=yi?yi.emptyScript:"";for(let p=0;p<h;p++)o.append(c[p],Le()),Rt.nextNode(),a.push({type:2,index:++s});o.append(c[h],Le())}}}else if(o.nodeType===8)if(o.data===xs)a.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(xt,c+1))!==-1;)a.push({type:7,index:s}),c+=xt.length-1}s++}}static createElement(t,i){const n=Ft.createElement("template");return n.innerHTML=t,n}}function oe(e,t,i=e,n){var o,s;if(t===Bt)return t;let r=n!==void 0?(o=i._$Co)==null?void 0:o[n]:i._$Cl;const l=je(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==l&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),l===void 0?r=void 0:(r=new l(e),r._$AT(e,i,n)),n!==void 0?(i._$Co??(i._$Co=[]))[n]=r:i._$Cl=r),r!==void 0&&(t=oe(e,r._$AS(e,t.values),r,n)),t}class ul{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,o=((t==null?void 0:t.creationScope)??Ft).importNode(i,!0);Rt.currentNode=o;let s=Rt.nextNode(),r=0,l=0,a=n[0];for(;a!==void 0;){if(r===a.index){let d;a.type===2?d=new qe(s,s.nextSibling,this,t):a.type===1?d=new a.ctor(s,a.name,a.strings,this,t):a.type===6&&(d=new fl(s,this,t)),this._$AV.push(d),a=n[++l]}r!==(a==null?void 0:a.index)&&(s=Rt.nextNode(),r++)}return Rt.currentNode=Ft,o}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class qe{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,n,o){this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=o,this._$Cv=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=oe(this,t,i),je(t)?t===R||t==null||t===""?(this._$AH!==R&&this._$AR(),this._$AH=R):t!==this._$AH&&t!==Bt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ll(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==R&&je(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ft.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=ze.createElement(Cs(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(n);else{const r=new ul(s,this),l=r.u(this.options);r.p(n),this.T(l),this._$AH=r}}_$AC(t){let i=oo.get(t.strings);return i===void 0&&oo.set(t.strings,i=new ze(t)),i}k(t){An(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,o=0;for(const s of t)o===i.length?i.push(n=new qe(this.O(Le()),this.O(Le()),this,this.options)):n=i[o],n._$AI(s),o++;o<i.length&&(this._$AR(n&&n._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class Ri{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,o,s){this.type=1,this._$AH=R,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=R}_$AI(t,i=this,n,o){const s=this.strings;let r=!1;if(s===void 0)t=oe(this,t,i,0),r=!je(t)||t!==this._$AH&&t!==Bt,r&&(this._$AH=t);else{const l=t;let a,d;for(t=s[0],a=0;a<s.length-1;a++)d=oe(this,l[n+a],i,a),d===Bt&&(d=this._$AH[a]),r||(r=!je(d)||d!==this._$AH[a]),d===R?t=R:t!==R&&(t+=(d??"")+s[a+1]),this._$AH[a]=d}r&&!o&&this.j(t)}j(t){t===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class hl extends Ri{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===R?void 0:t}}class pl extends Ri{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==R)}}class ml extends Ri{constructor(t,i,n,o,s){super(t,i,n,o,s),this.type=5}_$AI(t,i=this){if((t=oe(this,t,i,0)??R)===Bt)return;const n=this._$AH,o=t===R&&n!==R||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==R&&(n===R||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class fl{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){oe(this,t)}}const so=vi.litHtmlPolyfillSupport;so==null||so(ze,qe),(vi.litHtmlVersions??(vi.litHtmlVersions=[])).push("3.2.1");const se=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let o=n._$litPart$;if(o===void 0){const s=(i==null?void 0:i.renderBefore)??null;n._$litPart$=o=new qe(t.insertBefore(Le(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends Xt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=se(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Bt}};var ro;O._$litElement$=!0,O.finalized=!0,(ro=globalThis.litElementHydrateSupport)==null||ro.call(globalThis,{LitElement:O});const ao=globalThis.litElementPolyfillSupport;ao==null||ao({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bl={attribute:!0,type:String,converter:gi,reflect:!1,hasChanged:Cn},gl=(e=bl,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,a,e)},init(l){return l!==void 0&&this.P(r,void 0,e),l}}}if(n==="setter"){const{name:r}=i;return function(l){const a=this[r];t.call(this,l),this.requestUpdate(r,a,e)}}throw Error("Unsupported decorator location: "+n)};function g(e){return(t,i)=>typeof i=="object"?gl(e,t,i):((n,o,s)=>{const r=o.hasOwnProperty(s);return o.constructor.createProperty(s,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function he(e){return g({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vl=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const As={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Es=e=>(...t)=>({_$litDirective$:e,values:t});let Ss=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Te=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const o of n)(i=o._$AO)==null||i.call(o,t,!1),Te(o,t);return!0},_i=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},ks=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),$l(t)}};function yl(e){this._$AN!==void 0?(_i(this),this._$AM=e,ks(this)):this._$AM=e}function _l(e,t=!1,i=0){const n=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(n))for(let s=i;s<n.length;s++)Te(n[s],!1),_i(n[s]);else n!=null&&(Te(n,!1),_i(n));else Te(this,e)}const $l=e=>{e.type==As.CHILD&&(e._$AP??(e._$AP=_l),e._$AQ??(e._$AQ=yl))};class xl extends Ss{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,n){super._$AT(t,i,n),ks(this),this.isConnected=t._$AU}_$AO(t,i=!0){var n,o;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(o=this.disconnected)==null||o.call(this)),i&&(Te(this,t),_i(this))}setValue(t){if(vl(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const re=()=>new wl;class wl{}const qi=new WeakMap,Y=Es(class extends xl{render(e){return R}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),R}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=qi.get(t);i===void 0&&(i=new WeakMap,qi.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=qi.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Os=Object.freeze({left:0,top:0,width:16,height:16}),$i=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Xe=Object.freeze({...Os,...$i}),nn=Object.freeze({...Xe,body:"",hidden:!1}),Cl=Object.freeze({width:null,height:null}),Ts=Object.freeze({...Cl,...$i});function Al(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function n(o){for(;o<0;)o+=4;return o%4}if(i===""){const o=parseInt(e);return isNaN(o)?0:n(o)}else if(i!==e){let o=0;switch(i){case"%":o=25;break;case"deg":o=90}if(o){let s=parseFloat(e.slice(0,e.length-i.length));return isNaN(s)?0:(s=s/o,s%1===0?n(s):0)}}return t}const El=/[\s,]+/;function Sl(e,t){t.split(El).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const Is={...Ts,preserveAspectRatio:""};function lo(e){const t={...Is},i=(n,o)=>e.getAttribute(n)||o;return t.width=i("width",null),t.height=i("height",null),t.rotate=Al(i("rotate","")),Sl(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function kl(e,t){for(const i in Is)if(e[i]!==t[i])return!0;return!1}const Ie=/^[a-z0-9]+(-[a-z0-9]+)*$/,Je=(e,t,i,n="")=>{const o=e.split(":");if(e.slice(0,1)==="@"){if(o.length<2||o.length>3)return null;n=o.shift().slice(1)}if(o.length>3||!o.length)return null;if(o.length>1){const l=o.pop(),a=o.pop(),d={provider:o.length>0?o[0]:n,prefix:a,name:l};return t&&!ui(d)?null:d}const s=o[0],r=s.split("-");if(r.length>1){const l={provider:n,prefix:r.shift(),name:r.join("-")};return t&&!ui(l)?null:l}if(i&&n===""){const l={provider:n,prefix:"",name:s};return t&&!ui(l,i)?null:l}return null},ui=(e,t)=>e?!!((e.provider===""||e.provider.match(Ie))&&(t&&e.prefix===""||e.prefix.match(Ie))&&e.name.match(Ie)):!1;function Ol(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const n=((e.rotate||0)+(t.rotate||0))%4;return n&&(i.rotate=n),i}function co(e,t){const i=Ol(e,t);for(const n in nn)n in $i?n in e&&!(n in i)&&(i[n]=$i[n]):n in t?i[n]=t[n]:n in e&&(i[n]=e[n]);return i}function Tl(e,t){const i=e.icons,n=e.aliases||Object.create(null),o=Object.create(null);function s(r){if(i[r])return o[r]=[];if(!(r in o)){o[r]=null;const l=n[r]&&n[r].parent,a=l&&s(l);a&&(o[r]=[l].concat(a))}return o[r]}return Object.keys(i).concat(Object.keys(n)).forEach(s),o}function Il(e,t,i){const n=e.icons,o=e.aliases||Object.create(null);let s={};function r(l){s=co(n[l]||o[l],s)}return r(t),i.forEach(r),co(e,s)}function Ns(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(o=>{t(o,null),i.push(o)});const n=Tl(e);for(const o in n){const s=n[o];s&&(t(o,Il(e,o,s)),i.push(o))}return i}const Nl={provider:"",aliases:{},not_found:{},...Os};function Xi(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function Ms(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Xi(e,Nl))return null;const i=t.icons;for(const o in i){const s=i[o];if(!o.match(Ie)||typeof s.body!="string"||!Xi(s,nn))return null}const n=t.aliases||Object.create(null);for(const o in n){const s=n[o],r=s.parent;if(!o.match(Ie)||typeof r!="string"||!i[r]&&!n[r]||!Xi(s,nn))return null}return t}const xi=Object.create(null);function Ml(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function Et(e,t){const i=xi[e]||(xi[e]=Object.create(null));return i[t]||(i[t]=Ml(e,t))}function En(e,t){return Ms(t)?Ns(t,(i,n)=>{n?e.icons[i]=n:e.missing.add(i)}):[]}function Pl(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function Rl(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(xi)).forEach(n=>{(typeof n=="string"&&typeof t=="string"?[t]:Object.keys(xi[n]||{})).forEach(o=>{const s=Et(n,o);i=i.concat(Object.keys(s.icons).map(r=>(n!==""?"@"+n+":":"")+o+":"+r))})}),i}let De=!1;function Ps(e){return typeof e=="boolean"&&(De=e),De}function He(e){const t=typeof e=="string"?Je(e,!0,De):e;if(t){const i=Et(t.provider,t.prefix),n=t.name;return i.icons[n]||(i.missing.has(n)?null:void 0)}}function Rs(e,t){const i=Je(e,!0,De);if(!i)return!1;const n=Et(i.provider,i.prefix);return Pl(n,i.name,t)}function uo(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),De&&!t&&!e.prefix){let o=!1;return Ms(e)&&(e.prefix="",Ns(e,(s,r)=>{r&&Rs(s,r)&&(o=!0)})),o}const i=e.prefix;if(!ui({provider:t,prefix:i,name:"a"}))return!1;const n=Et(t,i);return!!En(n,e)}function ho(e){return!!He(e)}function Ll(e){const t=He(e);return t?{...Xe,...t}:null}function jl(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((o,s)=>o.provider!==s.provider?o.provider.localeCompare(s.provider):o.prefix!==s.prefix?o.prefix.localeCompare(s.prefix):o.name.localeCompare(s.name));let n={provider:"",prefix:"",name:""};return e.forEach(o=>{if(n.name===o.name&&n.prefix===o.prefix&&n.provider===o.provider)return;n=o;const s=o.provider,r=o.prefix,l=o.name,a=i[s]||(i[s]=Object.create(null)),d=a[r]||(a[r]=Et(s,r));let u;l in d.icons?u=t.loaded:r===""||d.missing.has(l)?u=t.missing:u=t.pending;const c={provider:s,prefix:r,name:l};u.push(c)}),t}function Ls(e,t){e.forEach(i=>{const n=i.loaderCallbacks;n&&(i.loaderCallbacks=n.filter(o=>o.id!==t))})}function zl(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const n=e.provider,o=e.prefix;t.forEach(s=>{const r=s.icons,l=r.pending.length;r.pending=r.pending.filter(a=>{if(a.prefix!==o)return!0;const d=a.name;if(e.icons[d])r.loaded.push({provider:n,prefix:o,name:d});else if(e.missing.has(d))r.missing.push({provider:n,prefix:o,name:d});else return i=!0,!0;return!1}),r.pending.length!==l&&(i||Ls([e],s.id),s.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),s.abort))})}))}let Dl=0;function Hl(e,t,i){const n=Dl++,o=Ls.bind(null,i,n);if(!t.pending.length)return o;const s={id:n,icons:t,callback:e,abort:o};return i.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(s)}),o}const on=Object.create(null);function po(e,t){on[e]=t}function sn(e){return on[e]||on[""]}function Fl(e,t=!0,i=!1){const n=[];return e.forEach(o=>{const s=typeof o=="string"?Je(o,t,i):o;s&&n.push(s)}),n}var Bl={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function Ul(e,t,i,n){const o=e.resources.length,s=e.random?Math.floor(Math.random()*o):e.index;let r;if(e.random){let C=e.resources.slice(0);for(r=[];C.length>1;){const T=Math.floor(Math.random()*C.length);r.push(C[T]),C=C.slice(0,T).concat(C.slice(T+1))}r=r.concat(C)}else r=e.resources.slice(s).concat(e.resources.slice(0,s));const l=Date.now();let a="pending",d=0,u,c=null,h=[],p=[];typeof n=="function"&&p.push(n);function b(){c&&(clearTimeout(c),c=null)}function $(){a==="pending"&&(a="aborted"),b(),h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function v(C,T){T&&(p=[]),typeof C=="function"&&p.push(C)}function f(){return{startTime:l,payload:t,status:a,queriesSent:d,queriesPending:h.length,subscribe:v,abort:$}}function y(){a="failed",p.forEach(C=>{C(void 0,u)})}function _(){h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function x(C,T,M){const S=T!=="success";switch(h=h.filter(E=>E!==C),a){case"pending":break;case"failed":if(S||!e.dataAfterTimeout)return;break;default:return}if(T==="abort"){u=M,y();return}if(S){u=M,h.length||(r.length?A():y());return}if(b(),_(),!e.random){const E=e.resources.indexOf(C.resource);E!==-1&&E!==e.index&&(e.index=E)}a="completed",p.forEach(E=>{E(M)})}function A(){if(a!=="pending")return;b();const C=r.shift();if(C===void 0){if(h.length){c=setTimeout(()=>{b(),a==="pending"&&(_(),y())},e.timeout);return}y();return}const T={status:"pending",resource:C,callback:(M,S)=>{x(T,M,S)}};h.push(T),d++,c=setTimeout(A,e.rotate),i(C,t,T.callback)}return setTimeout(A),f}function js(e){const t={...Bl,...e};let i=[];function n(){i=i.filter(r=>r().status==="pending")}function o(r,l,a){const d=Ul(t,r,l,(u,c)=>{n(),a&&a(u,c)});return i.push(d),d}function s(r){return i.find(l=>r(l))||null}return{query:o,find:s,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:n}}function Sn(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Li=Object.create(null),ai=["https://api.simplesvg.com","https://api.unisvg.com"],rn=[];for(;ai.length>0;)ai.length===1||Math.random()>.5?rn.push(ai.shift()):rn.push(ai.pop());Li[""]=Sn({resources:["https://api.iconify.design"].concat(rn)});function mo(e,t){const i=Sn(t);return i===null?!1:(Li[e]=i,!0)}function ji(e){return Li[e]}function Vl(){return Object.keys(Li)}function fo(){}const Ji=Object.create(null);function Wl(e){if(!Ji[e]){const t=ji(e);if(!t)return;const i=js(t),n={config:t,redundancy:i};Ji[e]=n}return Ji[e]}function zs(e,t,i){let n,o;if(typeof e=="string"){const s=sn(e);if(!s)return i(void 0,424),fo;o=s.send;const r=Wl(e);r&&(n=r.redundancy)}else{const s=Sn(e);if(s){n=js(s);const r=e.resources?e.resources[0]:"",l=sn(r);l&&(o=l.send)}}return!n||!o?(i(void 0,424),fo):n.query(t,o,i)().abort}const bo="iconify2",Fe="iconify",Ds=Fe+"-count",go=Fe+"-version",Hs=36e5,Gl=168,Yl=50;function an(e,t){try{return e.getItem(t)}catch{}}function kn(e,t,i){try{return e.setItem(t,i),!0}catch{}}function vo(e,t){try{e.removeItem(t)}catch{}}function ln(e,t){return kn(e,Ds,t.toString())}function cn(e){return parseInt(an(e,Ds))||0}const jt={local:!0,session:!0},Fs={local:new Set,session:new Set};let On=!1;function ql(e){On=e}let li=typeof window>"u"?{}:window;function Bs(e){const t=e+"Storage";try{if(li&&li[t]&&typeof li[t].length=="number")return li[t]}catch{}jt[e]=!1}function Us(e,t){const i=Bs(e);if(!i)return;const n=an(i,go);if(n!==bo){if(n){const l=cn(i);for(let a=0;a<l;a++)vo(i,Fe+a.toString())}kn(i,go,bo),ln(i,0);return}const o=Math.floor(Date.now()/Hs)-Gl,s=l=>{const a=Fe+l.toString(),d=an(i,a);if(typeof d=="string"){try{const u=JSON.parse(d);if(typeof u=="object"&&typeof u.cached=="number"&&u.cached>o&&typeof u.provider=="string"&&typeof u.data=="object"&&typeof u.data.prefix=="string"&&t(u,l))return!0}catch{}vo(i,a)}};let r=cn(i);for(let l=r-1;l>=0;l--)s(l)||(l===r-1?(r--,ln(i,r)):Fs[e].add(l))}function Vs(){if(!On){ql(!0);for(const e in jt)Us(e,t=>{const i=t.data,n=t.provider,o=i.prefix,s=Et(n,o);if(!En(s,i).length)return!1;const r=i.lastModified||-1;return s.lastModifiedCached=s.lastModifiedCached?Math.min(s.lastModifiedCached,r):r,!0})}}function Xl(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const n in jt)Us(n,o=>{const s=o.data;return o.provider!==e.provider||s.prefix!==e.prefix||s.lastModified===t});return!0}function Jl(e,t){On||Vs();function i(n){let o;if(!jt[n]||!(o=Bs(n)))return;const s=Fs[n];let r;if(s.size)s.delete(r=Array.from(s).shift());else if(r=cn(o),r>=Yl||!ln(o,r+1))return;const l={cached:Math.floor(Date.now()/Hs),provider:e.provider,data:t};return kn(o,Fe+r.toString(),JSON.stringify(l))}t.lastModified&&!Xl(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function yo(){}function Ql(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,zl(e)}))}function Zl(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:n}=e,o=e.iconsToLoad;delete e.iconsToLoad;let s;!o||!(s=sn(i))||s.prepare(i,n,o).forEach(r=>{zs(i,r,l=>{if(typeof l!="object")r.icons.forEach(a=>{e.missing.add(a)});else try{const a=En(e,l);if(!a.length)return;const d=e.pendingIcons;d&&a.forEach(u=>{d.delete(u)}),Jl(e,l)}catch(a){console.error(a)}Ql(e)})})}))}const Tn=(e,t)=>{const i=Fl(e,!0,Ps()),n=jl(i);if(!n.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(n.loaded,n.missing,n.pending,yo)}),()=>{a=!1}}const o=Object.create(null),s=[];let r,l;return n.pending.forEach(a=>{const{provider:d,prefix:u}=a;if(u===l&&d===r)return;r=d,l=u,s.push(Et(d,u));const c=o[d]||(o[d]=Object.create(null));c[u]||(c[u]=[])}),n.pending.forEach(a=>{const{provider:d,prefix:u,name:c}=a,h=Et(d,u),p=h.pendingIcons||(h.pendingIcons=new Set);p.has(c)||(p.add(c),o[d][u].push(c))}),s.forEach(a=>{const{provider:d,prefix:u}=a;o[d][u].length&&Zl(a,o[d][u])}),t?Hl(t,n,s):yo},Kl=e=>new Promise((t,i)=>{const n=typeof e=="string"?Je(e,!0):e;if(!n){i(e);return}Tn([n||e],o=>{if(o.length&&n){const s=He(n);if(s){t({...Xe,...s});return}}i(e)})});function tc(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function ec(e,t){const i=typeof e=="string"?Je(e,!0,!0):null;if(!i){const s=tc(e);return{value:e,data:s}}const n=He(i);if(n!==void 0||!i.prefix)return{value:e,name:i,data:n};const o=Tn([i],()=>t(e,i,He(i)));return{value:e,name:i,loading:o}}function Qi(e){return e.hasAttribute("inline")}let Ws=!1;try{Ws=navigator.vendor.indexOf("Apple")===0}catch{}function ic(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Ws||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const nc=/(-?[0-9.]*[0-9]+[0-9.]*)/g,oc=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function dn(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const n=e.split(nc);if(n===null||!n.length)return e;const o=[];let s=n.shift(),r=oc.test(s);for(;;){if(r){const l=parseFloat(s);isNaN(l)?o.push(s):o.push(Math.ceil(l*t*i)/i)}else o.push(s);if(s=n.shift(),s===void 0)return o.join("");r=!r}}function sc(e,t="defs"){let i="";const n=e.indexOf("<"+t);for(;n>=0;){const o=e.indexOf(">",n),s=e.indexOf("</"+t);if(o===-1||s===-1)break;const r=e.indexOf(">",s);if(r===-1)break;i+=e.slice(o+1,s).trim(),e=e.slice(0,n).trim()+e.slice(r+1)}return{defs:i,content:e}}function rc(e,t){return e?"<defs>"+e+"</defs>"+t:t}function ac(e,t,i){const n=sc(e);return rc(n.defs,t+n.content+i)}const lc=e=>e==="unset"||e==="undefined"||e==="none";function Gs(e,t){const i={...Xe,...e},n={...Ts,...t},o={left:i.left,top:i.top,width:i.width,height:i.height};let s=i.body;[i,n].forEach($=>{const v=[],f=$.hFlip,y=$.vFlip;let _=$.rotate;f?y?_+=2:(v.push("translate("+(o.width+o.left).toString()+" "+(0-o.top).toString()+")"),v.push("scale(-1 1)"),o.top=o.left=0):y&&(v.push("translate("+(0-o.left).toString()+" "+(o.height+o.top).toString()+")"),v.push("scale(1 -1)"),o.top=o.left=0);let x;switch(_<0&&(_-=Math.floor(_/4)*4),_=_%4,_){case 1:x=o.height/2+o.top,v.unshift("rotate(90 "+x.toString()+" "+x.toString()+")");break;case 2:v.unshift("rotate(180 "+(o.width/2+o.left).toString()+" "+(o.height/2+o.top).toString()+")");break;case 3:x=o.width/2+o.left,v.unshift("rotate(-90 "+x.toString()+" "+x.toString()+")");break}_%2===1&&(o.left!==o.top&&(x=o.left,o.left=o.top,o.top=x),o.width!==o.height&&(x=o.width,o.width=o.height,o.height=x)),v.length&&(s=ac(s,'<g transform="'+v.join(" ")+'">',"</g>"))});const r=n.width,l=n.height,a=o.width,d=o.height;let u,c;r===null?(c=l===null?"1em":l==="auto"?d:l,u=dn(c,a/d)):(u=r==="auto"?a:r,c=l===null?dn(u,d/a):l==="auto"?d:l);const h={},p=($,v)=>{lc(v)||(h[$]=v.toString())};p("width",u),p("height",c);const b=[o.left,o.top,a,d];return h.viewBox=b.join(" "),{attributes:h,viewBox:b,body:s}}function In(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const n in t)i+=" "+n+'="'+t[n]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function cc(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function dc(e){return"data:image/svg+xml,"+cc(e)}function Ys(e){return'url("'+dc(e)+'")'}const uc=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let wi=uc();function hc(e){wi=e}function pc(){return wi}function mc(e,t){const i=ji(e);if(!i)return 0;let n;if(!i.maxURL)n=0;else{let o=0;i.resources.forEach(r=>{o=Math.max(o,r.length)});const s=t+".json?icons=";n=i.maxURL-o-i.path.length-s.length}return n}function fc(e){return e===404}const bc=(e,t,i)=>{const n=[],o=mc(e,t),s="icons";let r={type:s,provider:e,prefix:t,icons:[]},l=0;return i.forEach((a,d)=>{l+=a.length+1,l>=o&&d>0&&(n.push(r),r={type:s,provider:e,prefix:t,icons:[]},l=a.length),r.icons.push(a)}),n.push(r),n};function gc(e){if(typeof e=="string"){const t=ji(e);if(t)return t.path}return"/"}const vc=(e,t,i)=>{if(!wi){i("abort",424);return}let n=gc(t.provider);switch(t.type){case"icons":{const s=t.prefix,r=t.icons.join(","),l=new URLSearchParams({icons:r});n+=s+".json?"+l.toString();break}case"custom":{const s=t.uri;n+=s.slice(0,1)==="/"?s.slice(1):s;break}default:i("abort",400);return}let o=503;wi(e+n).then(s=>{const r=s.status;if(r!==200){setTimeout(()=>{i(fc(r)?"abort":"next",r)});return}return o=501,s.json()}).then(s=>{if(typeof s!="object"||s===null){setTimeout(()=>{s===404?i("abort",s):i("next",o)});return}setTimeout(()=>{i("success",s)})}).catch(()=>{i("next",o)})},yc={prepare:bc,send:vc};function _o(e,t){switch(e){case"local":case"session":jt[e]=t;break;case"all":for(const i in jt)jt[i]=t;break}}const Zi="data-style";let qs="";function _c(e){qs=e}function $o(e,t){let i=Array.from(e.childNodes).find(n=>n.hasAttribute&&n.hasAttribute(Zi));i||(i=document.createElement("style"),i.setAttribute(Zi,Zi),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+qs}function Xs(){po("",yc),Ps(!0);let e;try{e=window}catch{}if(e){if(Vs(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(n=>{try{(typeof n!="object"||n===null||n instanceof Array||typeof n.icons!="object"||typeof n.prefix!="string"||!uo(n))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const n="IconifyProviders["+i+"] is invalid.";try{const o=t[i];if(typeof o!="object"||!o||o.resources===void 0)continue;mo(i,o)||console.error(n)}catch{console.error(n)}}}}return{enableCache:t=>_o(t,!0),disableCache:t=>_o(t,!1),iconLoaded:ho,iconExists:ho,getIcon:Ll,listIcons:Rl,addIcon:Rs,addCollection:uo,calculateSize:dn,buildIcon:Gs,iconToHTML:In,svgToURL:Ys,loadIcons:Tn,loadIcon:Kl,addAPIProvider:mo,appendCustomStyle:_c,_api:{getAPIConfig:ji,setAPIModule:po,sendAPIQuery:zs,setFetch:hc,getFetch:pc,listAPIProviders:Vl}}}const un={"background-color":"currentColor"},Js={"background-color":"transparent"},xo={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},wo={"-webkit-mask":un,mask:un,background:Js};for(const e in wo){const t=wo[e];for(const i in xo)t[e+"-"+i]=xo[i]}function Co(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function $c(e,t,i){const n=document.createElement("span");let o=e.body;o.indexOf("<a")!==-1&&(o+="<!-- "+Date.now()+" -->");const s=e.attributes,r=In(o,{...s,width:t.width+"",height:t.height+""}),l=Ys(r),a=n.style,d={"--svg":l,width:Co(s.width),height:Co(s.height),...i?un:Js};for(const u in d)a.setProperty(u,d[u]);return n}let Ne;function xc(){try{Ne=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{Ne=null}}function wc(e){return Ne===void 0&&xc(),Ne?Ne.createHTML(e):e}function Cc(e){const t=document.createElement("span"),i=e.attributes;let n="";i.width||(n="width: inherit;"),i.height||(n+="height: inherit;"),n&&(i.style=n);const o=In(e.body,i);return t.innerHTML=wc(o),t.firstChild}function hn(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function Ao(e,t){const i=t.icon.data,n=t.customisations,o=Gs(i,n);n.preserveAspectRatio&&(o.attributes.preserveAspectRatio=n.preserveAspectRatio);const s=t.renderedMode;let r;switch(s){case"svg":r=Cc(o);break;default:r=$c(o,{...Xe,...i},s==="mask")}const l=hn(e);l?r.tagName==="SPAN"&&l.tagName===r.tagName?l.setAttribute("style",r.getAttribute("style")):e.replaceChild(r,l):e.appendChild(r)}function Eo(e,t,i){const n=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:n}}function Ac(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const n=t.get(e);if(n)return n;const o=["icon","mode","inline","observe","width","height","rotate","flip"],s=class extends i{constructor(){super(),Nt(this,"_shadowRoot"),Nt(this,"_initialised",!1),Nt(this,"_state"),Nt(this,"_checkQueued",!1),Nt(this,"_connected",!1),Nt(this,"_observer",null),Nt(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Qi(this);$o(l,a),this._state=Eo({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return o.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Qi(this),d=this._state;a!==d.inline&&(d.inline=a,$o(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Qi(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}Ao(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const d=this.getAttribute("mode"),u=lo(this);(l.attrMode!==d||kl(l.customisations,u)||!hn(this._shadowRoot))&&this._renderIcon(l.icon,u,d)}_iconChanged(l){const a=ec(l,(d,u,c)=>{const h=this._state;if(h.rendered||this.getAttribute("icon")!==d)return;const p={value:d,name:u,data:c};p.data?this._gotIconData(p):h.icon=p});a.data?this._gotIconData(a):this._state=Eo(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=hn(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,lo(this),this.getAttribute("mode"))}_renderIcon(l,a,d){const u=ic(l.data.body,d),c=this._state.inline;Ao(this._shadowRoot,this._state={rendered:!0,icon:l,inline:c,customisations:a,attrMode:d,renderedMode:u})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(d=>d.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};o.forEach(l=>{l in s.prototype||Object.defineProperty(s.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const r=Xs();for(const l in r)s[l]=s.prototype[l]=r[l];return t.define(e,s),s}Ac()||Xs();const Ec=I`
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
`,Sc=I`
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
`,kt={scrollbar:Ec,globalStyles:Sc},Qs=class k{static set config(t){this._config={...k._config,...t}}static get config(){return k._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=kt.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){k.init()}static init(){k.addGlobalStyles(),k.defineCustomElement("bim-button",Mc),k.defineCustomElement("bim-checkbox",pe),k.defineCustomElement("bim-color-input",Wt),k.defineCustomElement("bim-context-menu",mn),k.defineCustomElement("bim-dropdown",bt),k.defineCustomElement("bim-grid",Mn),k.defineCustomElement("bim-icon",Fc),k.defineCustomElement("bim-input",Ze),k.defineCustomElement("bim-label",fe),k.defineCustomElement("bim-number-input",Z),k.defineCustomElement("bim-option",F),k.defineCustomElement("bim-panel",Gt),k.defineCustomElement("bim-panel-section",be),k.defineCustomElement("bim-selector",ge),k.defineCustomElement("bim-table",st),k.defineCustomElement("bim-tabs",qt),k.defineCustomElement("bim-tab",et),k.defineCustomElement("bim-table-cell",hr),k.defineCustomElement("bim-table-children",mr),k.defineCustomElement("bim-table-group",br),k.defineCustomElement("bim-table-row",Yt),k.defineCustomElement("bim-text-input",rt),k.defineCustomElement("bim-toolbar",Ui),k.defineCustomElement("bim-toolbar-group",Fi),k.defineCustomElement("bim-toolbar-section",_e),k.defineCustomElement("bim-viewport",Sr)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let n=0;n<10;n++){const o=Math.floor(Math.random()*t.length);i+=t.charAt(o)}return i}};Qs._config={sectionLabelOnVerticalToolbar:!1};let W=Qs;class z extends O{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const n of t)this.elements.add(n);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const n of i)n.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const n=i[0];if(!n.isIntersecting)return;const o=n.target;t.unobserve(o);const s=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][s];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,n=[...this.elements][i];n&&t.observe(n)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const n=document.createDocumentFragment();if(t.length===0)return se(t(),n),n.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let o=i;const s=t,r=a=>(o={...o,...a},se(s(o,r),n),o);r(i);const l=()=>o;return[n.firstElementChild,r,l]}}const Be=(e,t={},i=!0)=>{let n={};for(const o of e.children){const s=o,r=s.getAttribute("name")||s.getAttribute("label"),l=t[r];if(r){if("value"in s&&typeof s.value<"u"&&s.value!==null){const a=s.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;n[r]=l?l(s.value):s.value}else if(i){const a=Be(s,t);if(Object.keys(a).length===0)continue;n[r]=l?l(a):a}}else i&&(n={...n,...Be(s,t)})}return n},zi=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,kc=[">=","<=","=",">","<","?","/","#"];function So(e){const t=kc.find(r=>e.split(r).length===2),i=e.split(t).map(r=>r.trim()),[n,o]=i,s=o.startsWith("'")&&o.endsWith("'")?o.replace(/'/g,""):zi(o);return{key:n,condition:t,value:s}}const pn=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(n=>n.trim());for(const n of i){const o=!n.startsWith("(")&&!n.endsWith(")"),s=n.startsWith("(")&&n.endsWith(")");if(o){const r=So(n);t.push(r)}if(s){const r={operator:"&",queries:n.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const d=So(l);return a>0&&(d.operator="&"),d})};t.push(r)}}return t}catch{return null}},ko=(e,t,i)=>{let n=!1;switch(t){case"=":n=e===i;break;case"?":n=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(n=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(n=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(n=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(n=e>=i);break;case"/":n=String(e).startsWith(String(i));break}return n};var Oc=Object.defineProperty,Tc=Object.getOwnPropertyDescriptor,Zs=(e,t,i,n)=>{for(var o=Tc(t,i),s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Oc(t,i,o),o},H;const Nn=(H=class extends O{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(e){this._placement=e,this.updatePosition()}static removeMenus(){for(const e of H.menus)e instanceof H&&(e.visible=!1);H.dialog.close(),H.dialog.remove()}get visible(){return this._visible}set visible(e){var t;this._visible=e,e?(H.dialog.parentElement||document.body.append(H.dialog),this._previousContainer=this.parentElement,H.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,H.dialog.append(this),H.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const e=this.placement??"right",t=await ys(this._previousContainer,this,{placement:e,middleware:[ss(10),vs(),gs(),bs({padding:5})]}),{x:i,y:n}=t;this.style.left=`${i}px`,this.style.top=`${n}px`}connectedCallback(){super.connectedCallback(),H.menus.push(this)}render(){return m` <slot></slot> `}},H.styles=[kt.scrollbar,I`
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
    `],H.dialog=z.create(()=>m` <dialog
      @click=${e=>{e.target===H.dialog&&H.removeMenus()}}
      @cancel=${()=>H.removeMenus()}
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
    ></dialog>`),H.menus=[],H);Zs([g({type:String,reflect:!0})],Nn.prototype,"placement");Zs([g({type:Boolean,reflect:!0})],Nn.prototype,"visible");let mn=Nn;var Ic=Object.defineProperty,Nc=Object.getOwnPropertyDescriptor,at=(e,t,i,n)=>{for(var o=n>1?void 0:n?Nc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Ic(t,i,o),o},Ee;const nt=(Ee=class extends O{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=re(),this._tooltip=re(),this._mouseLeave=!1,this.onClick=e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const e=this._contextMenu;if(e){const t=this.getAttribute("data-context-group");t&&e.setAttribute("data-context-group",t),this.closeNestedContexts();const i=W.newRandomId();for(const n of e.children)n instanceof Ee&&n.setAttribute("data-context-group",i);e.visible=!0}},this.mouseLeave=!0}set loading(e){if(this._loading=e,e)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=e,this.icon="eos-icons:loading";else{const{disabled:t,icon:i}=this._stateBeforeLoading;this.disabled=t,this.icon=i}}get loading(){return this._loading}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&ys(e,t,{placement:"bottom",middleware:[ss(10),vs(),gs(),bs({padding:5})]}).then(i=>{const{x:n,y:o}=i;Object.assign(t.style,{left:`${n}px`,top:`${o}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}closeNestedContexts(){const e=this.getAttribute("data-context-group");if(e)for(const t of mn.dialog.children){const i=t.getAttribute("data-context-group");if(t instanceof mn&&i===e){t.visible=!1,t.removeAttribute("data-context-group");for(const n of t.children)n instanceof Ee&&(n.closeNestedContexts(),n.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const e=m`
      <div ${Y(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?m`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?m`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
      style="fill: var(--bim-label--c)"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`;return m`
      <div ${Y(this._parent)} class="parent" @click=${this.onClick}>
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
                  >${this.label}${this.label&&this._contextMenu?t:null}</bim-label
                >
              </div>
            `:null}
        ${this.tooltipTitle||this.tooltipText?e:null}
      </div>
      <slot></slot>
    `}},Ee.styles=I`
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
  `,Ee);at([g({type:String,reflect:!0})],nt.prototype,"label",2);at([g({type:Boolean,attribute:"label-hidden",reflect:!0})],nt.prototype,"labelHidden",2);at([g({type:Boolean,reflect:!0})],nt.prototype,"active",2);at([g({type:Boolean,reflect:!0,attribute:"disabled"})],nt.prototype,"disabled",2);at([g({type:String,reflect:!0})],nt.prototype,"icon",2);at([g({type:Boolean,reflect:!0})],nt.prototype,"vertical",2);at([g({type:Number,attribute:"tooltip-time",reflect:!0})],nt.prototype,"tooltipTime",2);at([g({type:Boolean,attribute:"tooltip-visible",reflect:!0})],nt.prototype,"tooltipVisible",2);at([g({type:String,attribute:"tooltip-title",reflect:!0})],nt.prototype,"tooltipTitle",2);at([g({type:String,attribute:"tooltip-text",reflect:!0})],nt.prototype,"tooltipText",2);at([g({type:Boolean,reflect:!0})],nt.prototype,"loading",1);let Mc=nt;var Pc=Object.defineProperty,Qe=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Pc(t,i,o),o};const Ks=class extends O{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(e){e.stopPropagation(),this.checked=e.target.checked,this.dispatchEvent(this.onValueChange)}render(){return m`
      <div class="parent">
        ${this.label?m`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};Ks.styles=I`
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
  `;let pe=Ks;Qe([g({type:String,reflect:!0})],pe.prototype,"icon");Qe([g({type:String,reflect:!0})],pe.prototype,"name");Qe([g({type:String,reflect:!0})],pe.prototype,"label");Qe([g({type:Boolean,reflect:!0})],pe.prototype,"checked");Qe([g({type:Boolean,reflect:!0})],pe.prototype,"inverted");var Rc=Object.defineProperty,me=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Rc(t,i,o),o};const tr=class extends O{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=re(),this._textInput=re(),this.onValueChange=new Event("input"),this.onOpacityInput=e=>{const t=e.target;this.opacity=t.value,this.dispatchEvent(this.onValueChange)}}set value(e){const{color:t,opacity:i}=e;this.color=t,i&&(this.opacity=i)}get value(){const e={color:this.color};return this.opacity&&(e.opacity=this.opacity),e}onColorInput(e){e.stopPropagation();const{value:t}=this._colorInput;t&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}onTextInput(e){e.stopPropagation();const{value:t}=this._textInput;if(!t)return;const{value:i}=t;let n=i.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),t.value=n.slice(0,7),t.value.length===7&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:e}=this._colorInput;e&&e.click()}render(){return m`
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
    `}};tr.styles=I`
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
  `;let Wt=tr;me([g({type:String,reflect:!0})],Wt.prototype,"name");me([g({type:String,reflect:!0})],Wt.prototype,"label");me([g({type:String,reflect:!0})],Wt.prototype,"icon");me([g({type:Boolean,reflect:!0})],Wt.prototype,"vertical");me([g({type:Number,reflect:!0})],Wt.prototype,"opacity");me([g({type:String,reflect:!0})],Wt.prototype,"color");var Lc=Object.defineProperty,jc=Object.getOwnPropertyDescriptor,Ot=(e,t,i,n)=>{for(var o=n>1?void 0:n?jc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Lc(t,i,o),o};const er=class extends O{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?zi(this.label):this.label}set value(e){this._value=e}render(){return m`
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
    `}};er.styles=I`
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
  `;let F=er;Ot([g({type:String,reflect:!0})],F.prototype,"img",2);Ot([g({type:String,reflect:!0})],F.prototype,"label",2);Ot([g({type:String,reflect:!0})],F.prototype,"icon",2);Ot([g({type:Boolean,reflect:!0})],F.prototype,"checked",2);Ot([g({type:Boolean,reflect:!0})],F.prototype,"checkbox",2);Ot([g({type:Boolean,attribute:"no-mark",reflect:!0})],F.prototype,"noMark",2);Ot([g({converter:{fromAttribute(e){return e&&zi(e)}}})],F.prototype,"value",1);Ot([g({type:Boolean,reflect:!0})],F.prototype,"vertical",2);var zc=Object.defineProperty,Dc=Object.getOwnPropertyDescriptor,Tt=(e,t,i,n)=>{for(var o=n>1?void 0:n?Dc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&zc(t,i,o),o};const ir=class extends z{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=re(),this.onOptionClick=e=>{const t=e.target,i=this._value.has(t);if(!this.multiple&&!this.required&&!i)this._value=new Set([t]);else if(!this.multiple&&!this.required&&i)this._value=new Set([]);else if(!this.multiple&&this.required&&!i)this._value=new Set([t]);else if(this.multiple&&!this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&!this.required&&i){const n=[...this._value].filter(o=>o!==t);this._value=new Set(n)}else if(this.multiple&&this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&this.required&&i){const n=[...this._value].filter(s=>s!==t),o=new Set(n);o.size!==0&&(this._value=o)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(e){if(e){const{value:t}=this._contextMenu;if(!t)return;for(const i of this.elements)t.append(i);this._visible=!0}else{for(const t of this.elements)this.append(t);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(e){if(this.required&&Object.keys(e).length===0)return;const t=new Set;for(const i of e){const n=this.findOption(i);if(n&&(t.add(n),!this.multiple&&Object.keys(e).length===1))break}this._value=t,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(e=>e instanceof F&&e.checked).map(e=>e.value)}get _options(){const e=new Set([...this.elements]);for(const t of this.children)t instanceof F&&e.add(t);return[...e]}onSlotChange(e){const t=e.target.assignedElements();this.observe(t);const i=new Set;for(const n of this.elements){if(!(n instanceof F)){n.remove();continue}n.checked&&i.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=i}updateOptionsState(){for(const e of this._options)e instanceof F&&(e.checked=this._value.has(e))}findOption(e){return this._options.find(t=>t instanceof F?t.label===e||t.value===e:!1)}render(){let e,t,i;if(this._value.size===0)e="Select an option...";else if(this._value.size===1){const n=[...this._value][0];e=(n==null?void 0:n.label)||(n==null?void 0:n.value),t=n==null?void 0:n.img,i=n==null?void 0:n.icon}else e=`Multiple (${this._value.size})`;return m`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div class="input" @click=${()=>this.visible=!this.visible}>
          <bim-label
            .img=${t}
            .icon=${i}
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
            ${Y(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};ir.styles=[kt.scrollbar,I`
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
    `];let bt=ir;Tt([g({type:String,reflect:!0})],bt.prototype,"name",2);Tt([g({type:String,reflect:!0})],bt.prototype,"icon",2);Tt([g({type:String,reflect:!0})],bt.prototype,"label",2);Tt([g({type:Boolean,reflect:!0})],bt.prototype,"multiple",2);Tt([g({type:Boolean,reflect:!0})],bt.prototype,"required",2);Tt([g({type:Boolean,reflect:!0})],bt.prototype,"vertical",2);Tt([g({type:Boolean,reflect:!0})],bt.prototype,"visible",1);Tt([he()],bt.prototype,"_value",2);var Hc=Object.defineProperty,nr=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Hc(t,i,o),o};const or=class extends O{constructor(){super(...arguments),this.floating=!1,this._layouts={},this._updateFunctions={}}set layouts(e){this._layouts=e;const t={};for(const[i,n]of Object.entries(e))for(const o in n.elements)t[i]||(t[i]={}),t[i][o]=s=>{const r=this._updateFunctions[i];if(!r)return;const l=r[o];l&&l(s)};this.updateComponent=t}get layouts(){return this._layouts}getLayoutAreas(e){const{template:t}=e,i=t.split(`
`).map(n=>n.trim()).map(n=>n.split('"')[1]).filter(n=>n!==void 0).flatMap(n=>n.split(/\s+/));return[...new Set(i)].filter(n=>n!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this._updateFunctions={},this.layouts[this.layout]){this.innerHTML="",this._updateFunctions[this.layout]={};const e=this._updateFunctions[this.layout],t=this.layouts[this.layout],i=this.getLayoutAreas(t).map(n=>{const o=t.elements[n];if(!o)return null;if(o instanceof HTMLElement)return o.style.gridArea=n,o;if("template"in o){const{template:s,initialState:r}=o,[l,a]=z.create(s,r);return l.style.gridArea=n,e[n]=a,l}return z.create(o)}).filter(n=>!!n);this.style.gridTemplate=t.template,this.append(...i),this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange)}}else this._updateFunctions={},this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return m`<slot></slot>`}};or.styles=I`
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
  `;let Mn=or;nr([g({type:Boolean,reflect:!0})],Mn.prototype,"floating");nr([g({type:String,reflect:!0})],Mn.prototype,"layout");const fn=class extends O{render(){return m`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};fn.styles=I`
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
  `,fn.properties={icon:{type:String}};let Fc=fn;var Bc=Object.defineProperty,Di=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Bc(t,i,o),o};const sr=class extends O{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const e={};for(const t of this.children){const i=t;"value"in i?e[i.name||i.label]=i.value:"checked"in i&&(e[i.name||i.label]=i.checked)}return e}set value(e){const t=[...this.children];for(const i in e){const n=t.find(r=>{const l=r;return l.name===i||l.label===i});if(!n)continue;const o=n,s=e[i];typeof s=="boolean"?o.checked=s:o.value=s}}render(){return m`
      <div class="parent">
        ${this.label||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};sr.styles=I`
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
  `;let Ze=sr;Di([g({type:String,reflect:!0})],Ze.prototype,"name");Di([g({type:String,reflect:!0})],Ze.prototype,"label");Di([g({type:String,reflect:!0})],Ze.prototype,"icon");Di([g({type:Boolean,reflect:!0})],Ze.prototype,"vertical");var Uc=Object.defineProperty,Ke=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Uc(t,i,o),o};const rr=class extends O{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?zi(this.textContent):this.textContent}render(){return m`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?m`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?m`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};rr.styles=I`
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
  `;let fe=rr;Ke([g({type:String,reflect:!0})],fe.prototype,"img");Ke([g({type:Boolean,attribute:"label-hidden",reflect:!0})],fe.prototype,"labelHidden");Ke([g({type:String,reflect:!0})],fe.prototype,"icon");Ke([g({type:Boolean,attribute:"icon-hidden",reflect:!0})],fe.prototype,"iconHidden");Ke([g({type:Boolean,reflect:!0})],fe.prototype,"vertical");var Vc=Object.defineProperty,Wc=Object.getOwnPropertyDescriptor,ot=(e,t,i,n)=>{for(var o=n>1?void 0:n?Wc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Vc(t,i,o),o};const ar=class extends O{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=re(),this.onValueChange=new Event("change")}set value(e){this.setValue(e.toString())}get value(){return this._value}onChange(e){e.stopPropagation();const{value:t}=this._input;t&&this.setValue(t.value)}setValue(e){const{value:t}=this._input;let i=e;if(i=i.replace(/[^0-9.-]/g,""),i=i.replace(/(\..*)\./g,"$1"),i.endsWith(".")||(i.lastIndexOf("-")>0&&(i=i[0]+i.substring(1).replace(/-/g,"")),i==="-"||i==="-0"))return;let n=Number(i);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,t&&(t.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:e}=this._input;e&&Number.isNaN(Number(e.value))&&(e.value=this.value.toString())}onSliderMouseDown(e){document.body.style.cursor="w-resize";const{clientX:t}=e,i=this.value;let n=!1;const o=l=>{var a;n=!0;const{clientX:d}=l,u=this.step??1,c=((a=u.toString().split(".")[1])==null?void 0:a.length)||0,h=1/(this.sensitivity??1),p=(d-t)/h;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const b=i+p*u;this.setValue(b.toFixed(c))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},r=()=>{document.removeEventListener("mousemove",o),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",r)}onFocus(e){e.stopPropagation();const t=i=>{i.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",t))};window.addEventListener("keydown",t)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:e}=this._input;e&&e.focus()}render(){const e=m`
      ${this.pref||this.icon?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${Y(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${r=>r.stopPropagation()}
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
    `,t=this.min??-1/0,i=this.max??1/0,n=100*(this.value-t)/(i-t),o=m`
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
        ${this.slider?o:e}
      </bim-input>
    `}};ar.styles=I`
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
  `;let Z=ar;ot([g({type:String,reflect:!0})],Z.prototype,"name",2);ot([g({type:String,reflect:!0})],Z.prototype,"icon",2);ot([g({type:String,reflect:!0})],Z.prototype,"label",2);ot([g({type:String,reflect:!0})],Z.prototype,"pref",2);ot([g({type:Number,reflect:!0})],Z.prototype,"min",2);ot([g({type:Number,reflect:!0})],Z.prototype,"value",1);ot([g({type:Number,reflect:!0})],Z.prototype,"step",2);ot([g({type:Number,reflect:!0})],Z.prototype,"sensitivity",2);ot([g({type:Number,reflect:!0})],Z.prototype,"max",2);ot([g({type:String,reflect:!0})],Z.prototype,"suffix",2);ot([g({type:Boolean,reflect:!0})],Z.prototype,"vertical",2);ot([g({type:Boolean,reflect:!0})],Z.prototype,"slider",2);var Gc=Object.defineProperty,Yc=Object.getOwnPropertyDescriptor,ti=(e,t,i,n)=>{for(var o=n>1?void 0:n?Yc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Gc(t,i,o),o};const lr=class extends O{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(e){this._hidden=e,this.activationButton.active=!e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return Be(this,this.valueTransform)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(s=>{const r=s;return r.name===i||r.label===i});if(!n)continue;const o=n;o.value=e[i]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!0}expandSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,m`
      <div class="parent">
        ${this.label||this.name||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};lr.styles=[kt.scrollbar,I`
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
    `];let Gt=lr;ti([g({type:String,reflect:!0})],Gt.prototype,"icon",2);ti([g({type:String,reflect:!0})],Gt.prototype,"name",2);ti([g({type:String,reflect:!0})],Gt.prototype,"label",2);ti([g({type:Boolean,reflect:!0})],Gt.prototype,"hidden",1);ti([g({type:Boolean,attribute:"header-hidden",reflect:!0})],Gt.prototype,"headerHidden",2);var qc=Object.defineProperty,ei=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&qc(t,i,o),o};const cr=class extends O{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const e=this.parentElement;let t;return e instanceof Gt&&(t=e.valueTransform),Object.values(this.valueTransform).length!==0&&(t=this.valueTransform),Be(this,t)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(s=>{const r=s;return r.name===i||r.label===i});if(!n)continue;const o=n;o.value=e[i]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const e=this.label||this.icon||this.name||this.fixed,t=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,i=m`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?t:i,o=m`
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
        ${e?o:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};cr.styles=[kt.scrollbar,I`
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
    `];let be=cr;ei([g({type:String,reflect:!0})],be.prototype,"icon");ei([g({type:String,reflect:!0})],be.prototype,"label");ei([g({type:String,reflect:!0})],be.prototype,"name");ei([g({type:Boolean,reflect:!0})],be.prototype,"fixed");ei([g({type:Boolean,reflect:!0})],be.prototype,"collapsed");var Xc=Object.defineProperty,ii=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Xc(t,i,o),o};const dr=class extends O{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=e=>{this._value=e.target,this.dispatchEvent(this.onValueChange);for(const t of this.children)t instanceof F&&(t.checked=t===e.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(e){const t=this.findOption(e);if(t){for(const i of this._options)i.checked=i===t;this._value=t,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(e){const t=e.target.assignedElements();for(const i of t)i instanceof F&&(i.noMark=!0,i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick))}findOption(e){return this._options.find(t=>t instanceof F?t.label===e||t.value===e:!1)}firstUpdated(){const e=[...this.children].find(t=>t instanceof F&&t.checked);e&&(this._value=e)}render(){return m`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};dr.styles=I`
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
  `;let ge=dr;ii([g({type:String,reflect:!0})],ge.prototype,"name");ii([g({type:String,reflect:!0})],ge.prototype,"icon");ii([g({type:String,reflect:!0})],ge.prototype,"label");ii([g({type:Boolean,reflect:!0})],ge.prototype,"vertical");ii([he()],ge.prototype,"_value");const Jc=()=>m`
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
  `,Qc=()=>m`
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
  `;var Zc=Object.defineProperty,Kc=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Zc(t,i,o),o};const ur=class extends O{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return m`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};ur.styles=I`
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
  `;let hr=ur;Kc([g({type:String,reflect:!0})],hr.prototype,"column");var td=Object.defineProperty,ed=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&td(t,i,o),o};const pr=class extends O{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(e,t=!1){for(const i of this._groups)i.childrenHidden=typeof e>"u"?!i.childrenHidden:!e,t&&i.toggleChildren(e,t)}render(){return this._groups=[],m`
      <slot></slot>
      ${this.data.map(e=>{const t=document.createElement("bim-table-group");return this._groups.push(t),t.table=this.table,t.data=e,t})}
    `}};pr.styles=I`
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
  `;let mr=pr;ed([g({type:Array,attribute:!1})],mr.prototype,"data");var id=Object.defineProperty,nd=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&id(t,i,o),o};const fr=class extends O{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(e,t=!1){this._children&&(this.childrenHidden=typeof e>"u"?!this.childrenHidden:!e,t&&this._children.toggleGroups(e,t))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const e=this.table.getGroupIndentation(this.data)??0,t=m`
      ${this.table.noIndentation?null:m`
            <style>
              .branch-vertical {
                left: ${e+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,i=document.createDocumentFragment();se(t,i);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${e-1+(this.table.selectableRows?2.05:.5625)}rem`);let o=null;if(!this.table.noIndentation){const l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("height","9.5"),l.setAttribute("width","7.5"),l.setAttribute("viewBox","0 0 4.6666672 7.3333333");const a=document.createElementNS("http://www.w3.org/2000/svg","path");a.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),l.append(a);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(u),o=document.createElement("div"),o.addEventListener("click",c=>{c.stopPropagation(),this.toggleChildren()}),o.classList.add("caret"),o.style.left=`${(this.table.selectableRows?1.5:.125)+e}rem`,this.childrenHidden?o.append(l):o.append(d)}const s=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&s.append(i),s.table=this.table,s.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:s}})),o&&this.data.children&&s.append(o),e!==0&&(!this.data.children||this.childrenHidden)&&n&&s.append(n);let r;if(this.data.children){r=document.createElement("bim-table-children"),this._children=r,r.table=this.table,r.data=this.data.children;const l=document.createDocumentFragment();se(t,l),r.append(l)}return m`
      <div class="parent">${s} ${this.childrenHidden?null:r}</div>
    `}};fr.styles=I`
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
  `;let br=fr;nd([g({type:Boolean,attribute:"children-hidden",reflect:!0})],br.prototype,"childrenHidden");var od=Object.defineProperty,ve=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&od(t,i,o),o};const gr=class extends O{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(e=>{this._intersecting=e[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.name)}get _columnWidths(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.width)}get _isSelected(){var e;return(e=this.table)==null?void 0:e.selection.has(this.data)}onSelectionChange(e){if(!this.table)return;const t=e.target;this.selected=t.value,t.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const e=this.table.getRowIndentation(this.data)??0,t=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,i=[];for(const n in t){if(this.hiddenColumns.includes(n))continue;const o=t[n];let s;if(typeof o=="string"||typeof o=="boolean"||typeof o=="number"?(s=document.createElement("bim-label"),s.textContent=String(o)):o instanceof HTMLElement?s=o:(s=document.createDocumentFragment(),se(o,s)),!s)continue;const r=document.createElement("bim-table-cell");r.append(s),r.column=n,this._columnNames.indexOf(n)===0&&(r.style.marginLeft=`${this.table.noIndentation?0:e+.75}rem`);const l=this._columnNames.indexOf(n);r.setAttribute("data-column-index",String(l)),r.toggleAttribute("data-no-indentation",l===0&&this.table.noIndentation),r.toggleAttribute("data-cell-header",this.isHeader),r.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:r}})),i.push(r)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,m`
      ${!this.isHeader&&this.table.selectableRows?m`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${i}
      <slot></slot>
    `}render(){return m`${this._intersecting?this.compute():m``}`}};gr.styles=I`
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
  `;let Yt=gr;ve([g({type:Boolean,reflect:!0})],Yt.prototype,"selected");ve([g({attribute:!1})],Yt.prototype,"columns");ve([g({attribute:!1})],Yt.prototype,"hiddenColumns");ve([g({attribute:!1})],Yt.prototype,"data");ve([g({type:Boolean,attribute:"is-header",reflect:!0})],Yt.prototype,"isHeader");ve([he()],Yt.prototype,"_intersecting");var sd=Object.defineProperty,rd=Object.getOwnPropertyDescriptor,lt=(e,t,i,n)=>{for(var o=n>1?void 0:n?rd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&sd(t,i,o),o};const vr=class extends O{constructor(){super(...arguments),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(e,t)=>Object.values(t.data).some(i=>String(i).toLowerCase().includes(e.toLowerCase())),this._queryFilterFunction=(e,t)=>{let i=!1;const n=pn(e)??[];for(const o of n){if("queries"in o){i=!1;break}const{condition:s,value:r}=o;let{key:l}=o;if(l.startsWith("[")&&l.endsWith("]")){const a=l.replace("[","").replace("]","");l=a,i=Object.keys(t.data).filter(d=>d.includes(a)).map(d=>ko(t.data[d],s,r)).some(d=>d)}else i=ko(t.data[l],s,r);if(!i)break}return i}}set columns(e){const t=[];for(const i of e){const n=typeof i=="string"?{name:i,width:`minmax(${this.minColWidth}, 1fr)`}:i;t.push(n)}this._columns=t,this.computeMissingColumns(this.data),this.dispatchEvent(new Event("columnschange"))}get columns(){return this._columns}get _headerRowData(){const e={};for(const t of this.columns){const{name:i}=t;e[i]=String(i)}return e}get value(){return this._filteredData}set queryString(e){this.toggleAttribute("data-processing",!0),this._queryString=e&&e.trim()!==""?e.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(e){this._data=e,this.updateFilteredData(),this.computeMissingColumns(e)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(e=>{setTimeout(()=>{e(this.data)})})}set hiddenColumns(e){this._hiddenColumns=e,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(pn(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(e){let t=!1;for(const i of e){const{children:n,data:o}=i;for(const s in o)this._columns.map(r=>typeof r=="string"?r:r.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),t=!0);if(n){const s=this.computeMissingColumns(n);s&&!t&&(t=s)}}return t}generateText(e="comma",t=this.value,i="",n=!0){const o=this._textDelimiters[e];let s="";const r=this.columns.map(l=>l.name);if(n){this.indentationInText&&(s+=`Indentation${o}`);const l=`${r.join(o)}
`;s+=l}for(const[l,a]of t.entries()){const{data:d,children:u}=a,c=this.indentationInText?`${i}${l+1}${o}`:"",h=r.map(b=>d[b]??""),p=`${c}${h.join(o)}
`;s+=p,u&&(s+=this.generateText(e,a.children,`${i}${l+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(e){const t={};for(const n of Object.keys(this.dataTransform)){const o=this.columns.find(s=>s.name===n);o&&o.forceDataTransform&&(n in e||(e[n]=""))}const i=e;for(const n in i){const o=this.dataTransform[n];o?t[n]=o(i[n],e):t[n]=e[n]}return t}downloadData(e="BIM Table Data",t="json"){let i=null;if(t==="json"&&(i=new File([JSON.stringify(this.value,void 0,2)],`${e}.json`)),t==="csv"&&(i=new File([this.csv],`${e}.csv`)),t==="tsv"&&(i=new File([this.tsv],`${e}.tsv`)),!i)return;const n=document.createElement("a");n.href=URL.createObjectURL(i),n.download=i.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(e,t=this.value,i=0){for(const n of t){if(n.data===e)return i;if(n.children){const o=this.getRowIndentation(e,n.children,i+1);if(o!==null)return o}}return null}getGroupIndentation(e,t=this.value,i=0){for(const n of t){if(n===e)return i;if(n.children){const o=this.getGroupIndentation(e,n.children,i+1);if(o!==null)return o}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(e=!1){if(this._filteredData.length!==0&&!e||!this.loadFunction)return!1;this.loading=!0;try{const t=await this.loadFunction();return this.data=t,this.loading=!1,this._errorLoading=!1,!0}catch(t){if(this.loading=!1,this._filteredData.length!==0)return!1;const i=this.querySelector("[slot='error-loading']"),n=i==null?void 0:i.querySelector("[data-table-element='error-message']");return t instanceof Error&&n&&t.message.trim()!==""&&(n.textContent=t.message),this._errorLoading=!0,!1}}filter(e,t=this.filterFunction??this._stringFilterFunction,i=this.data){const n=[];for(const o of i)if(t(e,o)){if(this.preserveStructureOnFilter){const s={data:o.data};if(o.children){const r=this.filter(e,t,o.children);r.length&&(s.children=r)}n.push(s)}else if(n.push({data:o.data}),o.children){const s=this.filter(e,t,o.children);n.push(...s)}}else if(o.children){const s=this.filter(e,t,o.children);this.preserveStructureOnFilter&&s.length?n.push({data:o.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return Jc();if(this._errorLoading)return m`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return m`<slot name="missing-data"></slot>`;const e=document.createElement("bim-table-row");e.table=this,e.isHeader=!0,e.data=this._headerRowData,e.style.gridArea="Header",e.style.position="sticky",e.style.top="0",e.style.zIndex="5";const t=document.createElement("bim-table-children");return t.table=this,t.data=this.value,t.style.gridArea="Body",t.style.backgroundColor="transparent",m`
      <div class="parent">
        ${this.headersHidden?null:e} ${Qc()}
        <div style="overflow-x: hidden; grid-area: Body">${t}</div>
      </div>
    `}};vr.styles=[kt.scrollbar,I`
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
    `];let st=vr;lt([he()],st.prototype,"_filteredData",2);lt([g({type:Boolean,attribute:"headers-hidden",reflect:!0})],st.prototype,"headersHidden",2);lt([g({type:String,attribute:"min-col-width",reflect:!0})],st.prototype,"minColWidth",2);lt([g({type:Array,attribute:!1})],st.prototype,"columns",1);lt([g({type:Array,attribute:!1})],st.prototype,"data",1);lt([g({type:Boolean,reflect:!0})],st.prototype,"expanded",2);lt([g({type:Boolean,reflect:!0,attribute:"selectable-rows"})],st.prototype,"selectableRows",2);lt([g({attribute:!1})],st.prototype,"selection",2);lt([g({type:Boolean,attribute:"no-indentation",reflect:!0})],st.prototype,"noIndentation",2);lt([g({type:Boolean,reflect:!0})],st.prototype,"loading",2);lt([he()],st.prototype,"_errorLoading",2);var ad=Object.defineProperty,ld=Object.getOwnPropertyDescriptor,Hi=(e,t,i,n)=>{for(var o=n>1?void 0:n?ld(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&ad(t,i,o),o};const yr=class extends O{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:e}=this;if(e&&this.name===this._defaultName){const t=[...e.children].indexOf(this);this.name=`${this._defaultName}${t}`}}render(){return m` <slot></slot> `}};yr.styles=I`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let et=yr;Hi([g({type:String,reflect:!0})],et.prototype,"name",2);Hi([g({type:String,reflect:!0})],et.prototype,"label",2);Hi([g({type:String,reflect:!0})],et.prototype,"icon",2);Hi([g({type:Boolean,reflect:!0})],et.prototype,"hidden",1);var cd=Object.defineProperty,dd=Object.getOwnPropertyDescriptor,ye=(e,t,i,n)=>{for(var o=n>1?void 0:n?dd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&cd(t,i,o),o};const _r=class extends O{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=e=>{const t=e.target;t instanceof et&&!t.hidden&&(t.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=t.name,t.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(e){this._tab=e;const t=[...this.children],i=t.find(n=>n instanceof et&&n.name===e);for(const n of t){if(!(n instanceof et))continue;n.hidden=i!==n;const o=this.getTabSwitcher(n.name);o&&o.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(e){return this._switchers.find(t=>t.getAttribute("data-name")===e)}createSwitchers(){this._switchers=[];for(const e of this.children){if(!(e instanceof et))continue;const t=document.createElement("div");t.addEventListener("click",()=>{this.tab===e.name?this.toggleAttribute("tab",!1):this.tab=e.name}),t.setAttribute("data-name",e.name),t.className="switcher";const i=document.createElement("bim-label");i.textContent=e.label??"",i.icon=e.icon,t.append(i),this._switchers.push(t)}}onSlotChange(e){this.createSwitchers();const t=e.target.assignedElements(),i=t.find(n=>n instanceof et?this.tab?n.name===this.tab:!n.hidden:!1);i&&i instanceof et&&(this.tab=i.name);for(const n of t){if(!(n instanceof et)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),i!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return m`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};_r.styles=[kt.scrollbar,I`
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
    `];let qt=_r;ye([he()],qt.prototype,"_switchers",2);ye([g({type:Boolean,reflect:!0})],qt.prototype,"bottom",2);ye([g({type:Boolean,attribute:"switchers-hidden",reflect:!0})],qt.prototype,"switchersHidden",2);ye([g({type:Boolean,reflect:!0})],qt.prototype,"floating",2);ye([g({type:String,reflect:!0})],qt.prototype,"tab",1);ye([g({type:Boolean,attribute:"switchers-full",reflect:!0})],qt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oo=e=>e??R;var ud=Object.defineProperty,hd=Object.getOwnPropertyDescriptor,gt=(e,t,i,n)=>{for(var o=n>1?void 0:n?hd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&ud(t,i,o),o};const $r=class extends O{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(e){this._inputTypes.includes(e)&&(this._type=e)}get type(){return this._type}get query(){return pn(this.value)}onInputChange(e){e.stopPropagation();const t=e.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=t.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("input");t==null||t.focus()})}render(){return m`
      <bim-input
        .name=${this.name}
        .icon=${this.icon}
        .label=${this.label}
        .vertical=${this.vertical}
      >
        ${this.type==="area"?m` <textarea
              aria-label=${this.label||this.name||"Text Input"}
              .value=${this.value}
              .rows=${this.rows??5}
              placeholder=${Oo(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:m` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${Oo(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};$r.styles=[kt.scrollbar,I`
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
    `];let rt=$r;gt([g({type:String,reflect:!0})],rt.prototype,"icon",2);gt([g({type:String,reflect:!0})],rt.prototype,"label",2);gt([g({type:String,reflect:!0})],rt.prototype,"name",2);gt([g({type:String,reflect:!0})],rt.prototype,"placeholder",2);gt([g({type:String,reflect:!0})],rt.prototype,"value",2);gt([g({type:Boolean,reflect:!0})],rt.prototype,"vertical",2);gt([g({type:Number,reflect:!0})],rt.prototype,"debounce",2);gt([g({type:Number,reflect:!0})],rt.prototype,"rows",2);gt([g({type:String,reflect:!0})],rt.prototype,"type",1);var pd=Object.defineProperty,md=Object.getOwnPropertyDescriptor,xr=(e,t,i,n)=>{for(var o=n>1?void 0:n?md(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&pd(t,i,o),o};const wr=class extends O{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const e=this.children;for(const t of e)this.vertical?t.setAttribute("label-hidden",""):t.removeAttribute("label-hidden")}render(){return m`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};wr.styles=I`
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
  `;let Fi=wr;xr([g({type:Number,reflect:!0})],Fi.prototype,"rows",2);xr([g({type:Boolean,reflect:!0})],Fi.prototype,"vertical",1);var fd=Object.defineProperty,bd=Object.getOwnPropertyDescriptor,Bi=(e,t,i,n)=>{for(var o=n>1?void 0:n?bd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&fd(t,i,o),o};const Cr=class extends O{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(e){this._labelHidden=e,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const e=this.children;for(const t of e)t instanceof Fi&&(t.vertical=this.vertical),t.toggleAttribute("label-hidden",this.vertical)}render(){return m`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Cr.styles=I`
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
  `;let _e=Cr;Bi([g({type:String,reflect:!0})],_e.prototype,"label",2);Bi([g({type:String,reflect:!0})],_e.prototype,"icon",2);Bi([g({type:Boolean,reflect:!0})],_e.prototype,"vertical",1);Bi([g({type:Boolean,attribute:"label-hidden",reflect:!0})],_e.prototype,"labelHidden",1);var gd=Object.defineProperty,vd=Object.getOwnPropertyDescriptor,Pn=(e,t,i,n)=>{for(var o=n>1?void 0:n?vd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&gd(t,i,o),o};const Ar=class extends O{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(e){this._vertical=e,this.updateSections()}get vertical(){return this._vertical}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const e=this.children;for(const t of e)t instanceof _e&&(t.labelHidden=this.vertical&&!W.config.sectionLabelOnVerticalToolbar,t.vertical=this.vertical)}render(){return m`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Ar.styles=I`
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
  `;let Ui=Ar;Pn([g({type:String,reflect:!0})],Ui.prototype,"icon",2);Pn([g({type:Boolean,attribute:"labels-hidden",reflect:!0})],Ui.prototype,"labelsHidden",2);Pn([g({type:Boolean,reflect:!0})],Ui.prototype,"vertical",1);var yd=Object.defineProperty,_d=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&yd(t,i,o),o};const Er=class extends O{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return m`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Er.styles=I`
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
  `;let Sr=Er;_d([g({type:String,reflect:!0})],Sr.prototype,"name");/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kr="important",$d=" !"+kr,zt=Es(class extends Ss{constructor(e){var t;if(super(e),e.type!==As.ATTRIBUTE||e.name!=="style"||((t=e.strings)==null?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return n==null?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(const n of this.ft)t[n]==null&&(this.ft.delete(n),n.includes("-")?i.removeProperty(n):i[n]=null);for(const n in t){const o=t[n];if(o!=null){this.ft.add(n);const s=typeof o=="string"&&o.endsWith($d);n.includes("-")||s?i.setProperty(n,s?o.slice(0,-11):o,s?kr:""):i[n]=o}}return Bt}}),xd=e=>{const{components:t}=e,i=t.get(Qr);return m`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const n=document.createElement("input");n.type="file",n.accept=".ifc",n.onchange=async()=>{if(n.files===null||n.files.length===0)return;const o=n.files[0],s=o.name.replace(".ifc","");n.remove();const r=await o.arrayBuffer(),l=new Uint8Array(r);await i.load(l,!0,s)},n.click()}}
    ></bim-button>
  `},wd=e=>z.create(xd,e),Cd=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:wd},Symbol.toStringTag,{value:"Module"}));({...Cd});const Ad=e=>{const{components:t,actions:i,tags:n}=e,o=(i==null?void 0:i.dispose)??!0,s=(i==null?void 0:i.download)??!0,r=(i==null?void 0:i.visibility)??!0,l=(n==null?void 0:n.schema)??!0,a=(n==null?void 0:n.viewDefinition)??!0,d=t.get(Vt),u=({detail:c})=>{const{cell:h}=c;h.style.padding="0.25rem 0"};return m`
    <bim-table ${Y(c=>{if(!c)return;const h=c;h.hiddenColumns=["modelID"];const p=[];for(const[,b]of d.groups){if(!b)continue;const $={data:{Name:b.name||b.uuid,modelID:b.uuid}};p.push($)}h.dataTransform={Name:(b,$)=>{const{modelID:v}=$;if(typeof v!="string")return b;const f=d.groups.get(v);if(!f)return v;const y={};for(const S of f.items)y[S.id]=S.ids;let _;const{schema:x}=f.ifcMetadata;l&&x&&(_=m`
            <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${x}</bim-label>
            `);let A;if(a&&"viewDefinition"in f.ifcMetadata){const S=f.ifcMetadata.viewDefinition;A=m`
            ${S.split(",").map(E=>m`<bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${E}</bim-label>`)}
          `}let C;o&&(C=m`<bim-button @click=${()=>d.disposeGroup(f)} icon="mdi:delete"></bim-button>`);let T;r&&(T=m`<bim-button @click=${S=>{const E=t.get(Yo),B=S.target;E.set(B.hasAttribute("data-model-hidden"),y),B.toggleAttribute("data-model-hidden"),B.icon=B.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye"}} icon="mdi:eye"></bim-button>`);let M;return s&&(M=m`<bim-button @click=${()=>{const S=document.createElement("input");S.type="file",S.accept=".ifc",S.multiple=!1,S.addEventListener("change",async()=>{if(!(S.files&&S.files.length===1))return;const E=S.files[0],B=await E.arrayBuffer(),q=await t.get(Zr).saveToIfc(f,new Uint8Array(B)),G=new File([q],E.name),w=document.createElement("a");w.href=URL.createObjectURL(G),w.download=G.name,w.click(),URL.revokeObjectURL(w.href)}),S.click()}} icon="flowbite:download-solid"></bim-button>`),m`
         <div style="display: flex; flex: 1; gap: var(--bim-ui_size-4xs); justify-content: space-between; overflow: auto;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bim-ui_size-4xs); flex-grow: 1; overflow: auto;">
            <div style="min-height: 1.75rem; overflow: auto; display: flex;">
              <bim-label style="white-space: normal;">${b}</bim-label>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: var(--bim-ui_size-4xs); overflow: auto;">
              ${_}
              ${A}
            </div>
          </div>
          <div style="display: flex; align-self: flex-start; flex-shrink: 0;">
            ${M}
            ${T}
            ${C}
          </div>
         </div>
        `}},h.data=p})} @cellcreated=${u} headers-hidden no-indentation>
      <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No models has been loaded yet
      </bim-label>
    </bim-table>
  `},Ed=(e,t=!0)=>{const i=z.create(Ad,e);if(t){const{components:n}=e,o=n.get(Vt),[,s]=i;o.onFragmentsLoaded.add(()=>setTimeout(()=>s())),o.onFragmentsDisposed.add(()=>s())}return i},Sd=Object.freeze(Object.defineProperty({__proto__:null,modelsList:Ed},Symbol.toStringTag,{value:"Module"})),Or=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",e=>e.includes("Value"),e=>e.startsWith("Material"),e=>e.startsWith("Relating"),e=>{const t=["IsGroupedBy","IsDecomposedBy"];return e.startsWith("Is")&&!t.includes(e)}];async function hi(e,t,i,n=Or,o=!1){const s=e.get(ht),r=await t.getProperties(i);if(!r)return{data:{Entity:`${i} properties not found...`}};const l=s.relationMaps[t.uuid],a={data:{}};for(const d in r){const u=n.map(h=>typeof h=="string"?d===h:h(d)).includes(!0);if(!(d==="type"||u))continue;const c=r[d];if(c)if(c.type===5){a.children||(a.children=[]);const h=await hi(e,t,c.value,n,o);a.children.push(h)}else if(typeof c=="object"&&!Array.isArray(c)){const{value:h,type:p}=c;if(o)p===1||p===2||p===3||(a.data[d]=h);else{const b=typeof h=="number"?Number(h.toFixed(3)):h;a.data[d]=b}}else if(Array.isArray(c))for(const h of c){if(h.type!==5)continue;a.children||(a.children=[]);const p=await hi(e,t,h.value,n,o);a.children.push(p)}else if(d==="type"){const h=mi[c];a.data.Entity=h}else a.data[d]=c}if(l&&l.get(r.expressID)){const d=l.get(r.expressID);for(const u of n){const c=[];if(typeof u=="string"){const h=s._inverseAttributes.indexOf(u);h!==-1&&c.push(h)}else{const h=s._inverseAttributes.filter(p=>u(p));for(const p of h){const b=s._inverseAttributes.indexOf(p);c.push(b)}}for(const h of c){const p=d.get(h);if(p)for(const b of p){const $=await hi(e,t,b,n,o);a.children||(a.children=[]),a.children.push($)}}}}return a}const kd=e=>{const{components:t,fragmentIdMap:i,attributesToInclude:n,editable:o,tableDefinition:s}=e,r=t.get(Vt);let l;return typeof n=="function"?l=n(Or):l=n,m`<bim-table ${Y(async a=>{if(!a)return;const d=a,u=[],c=[];for(const h in i){const p=r.list.get(h);if(!(p&&p.group))continue;const b=p.group,$=c.find(v=>v.model===b);if($)for(const v of i[h])$.expressIDs.add(v);else{const v={model:b,expressIDs:new Set(i[h])};c.push(v)}}for(const h of c){const{model:p,expressIDs:b}=h;for(const $ of b){const v=await hi(t,p,$,l,o);u.push(v)}}d.dataTransform=s,d.data=u,d.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},Od=e=>z.create(kd,e),Td=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:Od},Symbol.toStringTag,{value:"Module"}));let _t;const Id=e=>{const{components:t,classifications:i}=e,n=t.get(Kr),o=t.get(Yo);_t||(_t=document.createElement("bim-table"),_t.headersHidden=!0,_t.hiddenColumns=["system"],_t.columns=["Name",{name:"Actions",width:"auto"}],_t.dataTransform={Actions:(r,l)=>{const{system:a,Name:d}=l;if(!(typeof a=="string"&&typeof d=="string"))return r;const u=n.list[a];if(!(u&&u[d]))return r;const c=u[d],{map:h}=c;return m`
          <div>
            <bim-checkbox checked @change=${p=>{const b=p.target;o.set(b.value,h)}}></bim-checkbox>
          </div>
        `}});const s=[];for(const r of i){const l=typeof r=="string"?r:r.system,a=typeof r=="string"?r:r.label,d=n.list[l];d&&s.push({data:{Name:a,system:l},children:Object.keys(d).map(u=>({data:{Name:u,system:l,Actions:""}}))})}return _t.data=s,m`${_t}`},Nd=(e,t=!0)=>{const i=z.create(Id,e);if(t){const{components:n}=e,o=n.get(Vt),[,s]=i;o.onFragmentsDisposed.add(()=>s())}return i},Md=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:Nd},Symbol.toStringTag,{value:"Module"})),Tr=async(e,t,i)=>{var n,o,s,r;const l=e.get(ht),a={data:{Name:(n=i.Name)==null?void 0:n.value},children:[{data:{Name:"Identification",Value:(o=i.Identification)==null?void 0:o.value}},{data:{Name:"Name",Value:(s=i.Name)==null?void 0:s.value}},{data:{Name:"Description",Value:(r=i.Description)==null?void 0:r.value}}]},d=l.getEntityRelations(t,i.expressID,"IsNestedBy");if(!d)return a;a.children||(a.children=[]);const u=[];a.children.push({data:{Name:"Tasks"},children:u});for(const c of d){const h=await t.getProperties(c);if(!h)continue;const p=await Tr(e,t,h);u.push(p)}return a},Pd=async(e,t,i)=>{const n=[];for(const o of i){const s=await Tr(e,t,o);n.push(s)}return{data:{Name:"Tasks"},children:n}},Rd=async(e,t)=>{var i,n,o,s;const r={data:{Name:"Classifications"}};for(const l of t){const{value:a}=l.ReferencedSource,d=await e.getProperties(a);if(!d)continue;const u={data:{Name:(i=d.Name)==null?void 0:i.value},children:[{data:{Name:"Identification",Value:((n=l.Identification)==null?void 0:n.value)||((o=l.ItemReference)==null?void 0:o.value)}},{data:{Name:"Name",Value:(s=l.Name)==null?void 0:s.value}}]};r.children||(r.children=[]),r.children.push(u)}return r},Ld=async(e,t)=>{var i,n,o,s,r,l;const a={data:{Name:"Materials"}};for(const d of t){if(d.type===Jo){const u=(i=d.ForLayerSet)==null?void 0:i.value,c=await e.getProperties(u);if(!c)continue;for(const h of c.MaterialLayers){const{value:p}=h,b=await e.getProperties(p);if(!b)continue;const $=await e.getProperties((n=b.Material)==null?void 0:n.value);if(!$)continue;const v={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:(o=b.LayerThickness)==null?void 0:o.value}},{data:{Name:"Material",Value:(s=$.Name)==null?void 0:s.value}}]};a.children||(a.children=[]),a.children.push(v)}}if(d.type===Zo)for(const u of d.Materials){const{value:c}=u,h=await e.getProperties(c);if(!h)continue;const p={data:{Name:"Name",Value:(r=h.Name)==null?void 0:r.value}};a.children||(a.children=[]),a.children.push(p)}if(d.type===Qo){const u={data:{Name:"Name",Value:(l=d.Name)==null?void 0:l.value}};a.children||(a.children=[]),a.children.push(u)}}return a},jd={IFCLENGTHMEASURE:"LENGTHUNIT",IFCAREAMEASURE:"AREAUNIT",IFCVOLUMEMEASURE:"VOLUMEUNIT",IFCPLANEANGLEMEASURE:"PLANEANGLEUNIT"},zd={MILLIMETRE:{symbol:"mm",digits:0},METRE:{symbol:"m",digits:2},KILOMETRE:{symbol:"km",digits:2},SQUARE_METRE:{symbol:"m²",digits:2},CUBIC_METRE:{symbol:"m³",digits:2},DEGREE:{symbol:"°",digits:2},RADIAN:{symbol:"rad",digits:2},GRAM:{symbol:"g",digits:0},KILOGRAM:{symbol:"kg",digits:2},MILLISECOND:{symbol:"ms",digits:0},SECOND:{symbol:"s",digits:0}},Ir=async(e,t)=>{var i,n,o;const s=Object.values(await e.getAllPropertiesOfType(fa))[0];let r;for(const l of s.Units){const a=await e.getProperties(l.value);if(a&&((i=a.UnitType)==null?void 0:i.value)===jd[t]){r=`${((n=a.Prefix)==null?void 0:n.value)??""}${((o=a.Name)==null?void 0:o.value)??""}`;break}}return r?zd[r]:null},Dd=async(e,t,i)=>{var n,o;const{displayUnits:s}=i,r={data:{Name:"PropertySets"}};for(const l of t){const a={data:{Name:(n=l.Name)==null?void 0:n.value}};if(l.type===qo){for(const d of l.HasProperties){const{value:u}=d,c=await e.getProperties(u);if(!c)continue;const h=Object.keys(c).find(v=>v.includes("Value"));if(!(h&&c[h]))continue;let p=c[h].value,b="";if(s){const{name:v}=c[h],f=await Ir(e,v)??{};b=f.symbol,p=c[h].value,typeof p=="number"&&f.digits&&(p=p.toFixed(f.digits))}const $={data:{Name:(o=c.Name)==null?void 0:o.value,Value:`${p} ${b??""}`}};a.children||(a.children=[]),a.children.push($)}a.children&&(r.children||(r.children=[]),r.children.push(a))}}return r},Hd=async(e,t,i)=>{var n,o;const{displayUnits:s}=i,r={data:{Name:"QuantitySets"}};for(const l of t){const a={data:{Name:(n=l.Name)==null?void 0:n.value}};if(l.type===Xo){for(const d of l.Quantities){const{value:u}=d,c=await e.getProperties(u);if(!c)continue;const h=Object.keys(c).find(v=>v.includes("Value"));if(!(h&&c[h]))continue;let p=c[h].value,b="";if(s){const{name:v}=c[h],f=await Ir(e,v)??{};b=f.symbol,p=c[h].value,typeof p=="number"&&f.digits&&(p=p.toFixed(f.digits))}const $={data:{Name:(o=c.Name)==null?void 0:o.value,Value:`${p} ${b??""}`}};a.children||(a.children=[]),a.children.push($)}a.children&&(r.children||(r.children=[]),r.children.push(a))}}return r},Fd=["OwnerHistory","ObjectPlacement","CompositionType"],Nr=async(e,t)=>{const i={groupName:"Attributes",includeClass:!1,...t},{groupName:n,includeClass:o}=i,s={data:{Name:n}};o&&(s.children||(s.children=[]),s.children.push({data:{Name:"Class",Value:mi[e.type]}}));for(const r in e){if(Fd.includes(r))continue;const l=e[r];if(l&&typeof l=="object"&&!Array.isArray(l)){if(l.type===da)continue;const a={data:{Name:r,Value:l.value}};s.children||(s.children=[]),s.children.push(a)}}return s},ae=(e,...t)=>{e.children||(e.children=[]),e.children.push(...t)},Bd=async(e,t,i,n,o)=>{const s=e.get(ht).getEntityRelations(t,i,"IsDefinedBy");if(s){const r=[],l=[];for(const u of s){const c=await t.getProperties(u);c&&(c.type===qo&&r.push(c),c.type===Xo&&l.push(c))}const a=await Dd(t,r,o);a.children&&ae(n,a);const d=await Hd(t,l,o);d.children&&ae(n,d)}},Ud=async(e,t,i,n)=>{const o=e.get(ht).getEntityRelations(t,i,"HasAssociations");if(o){const s=[],r=[];for(const d of o){const u=await t.getProperties(d);u&&(u.type===ua&&s.push(u),(u.type===Jo||u.type===ha||u.type===pa||u.type===Qo||u.type===Zo)&&r.push(u))}const l=await Rd(t,s);l.children&&ae(n,l);const a=await Ld(t,r);a.children&&ae(n,a)}},Vd=async(e,t,i,n)=>{const o=e.get(ht).getEntityRelations(t,i,"HasAssignments");if(o){const s=[];for(const l of o){const a=await t.getProperties(l);a&&a.type===ma&&s.push(a)}const r=await Pd(e,t,s);r.children&&ae(n,r)}},Wd=async(e,t,i,n)=>{const o=e.get(ht).getEntityRelations(t,i,"ContainedInStructure");if(o&&o[0]){const s=o[0],r=await t.getProperties(s);if(r){const l=await Nr(r,{groupName:"SpatialContainer"});ae(n,l)}}};let ci={};const Gd=async(e,t,i)=>{var n;const o=e.get(ht),s=e.get(Vt),r=s.getModelIdMap(t);Object.keys(t).length===0&&(ci={});const l=[];for(const a in r){const d=s.groups.get(a);if(!d)continue;const u=o.relationMaps[d.uuid];if(!u)continue;a in ci||(ci[a]=new Map);const c=ci[a],h=r[a];for(const p of h){let b=c.get(p);if(b){l.push(b);continue}const $=await d.getProperties(p);if(!$)continue;b={data:{Name:(n=$.Name)==null?void 0:n.value}},l.push(b),c.set(p,b);const v=await Nr($,{includeClass:!0});b.children||(b.children=[]),b.children.push(v),u.get(p)&&(await Bd(e,d,p,b,i),await Ud(e,d,p,b),await Vd(e,d,p,b),await Wd(e,d,p,b))}}return l},Yd=e=>{const t={emptySelectionWarning:!0,...e},{components:i,fragmentIdMap:n,emptySelectionWarning:o}=t;return m`
    <bim-table @cellcreated=${({detail:s})=>{const{cell:r}=s;r.column==="Name"&&!("Value"in r.rowData)&&(r.style.gridColumn="1 / -1")}} ${Y(async s=>{if(!s)return;const r=s;r.columns=[{name:"Name",width:"12rem"}],r.headersHidden=!0,r.loadFunction=()=>Gd(i,n,e),await r.loadData(!0)&&r.dispatchEvent(new Event("datacomputed"))})}>
      ${o?m`
            <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
              Select some elements to display its properties
            </bim-label>
            `:null}
      <bim-label slot="error-loading" style="--bim-icon--c: #e72e2e" icon="bxs:error-alt">
        Something went wrong with the properties
      </bim-label>
    </bim-table>
  `},qd=e=>z.create(Yd,e),Xd=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:qd},Symbol.toStringTag,{value:"Module"})),bn=async(e,t,i,n)=>{var o;const s=[],r=e.get(ht),l=await t.getProperties(i);if(!l)return s;const{type:a}=l,d={data:{Entity:mi[a],Name:(o=l.Name)==null?void 0:o.value,modelID:t.uuid,expressID:i}};for(const u of n){const c=r.getEntityRelations(t,i,u);if(!c)continue;d.children||(d.children=[]),d.data.relations=JSON.stringify(c);const h={};for(const p of c){const b=await bn(e,t,p,n);for(const $ of b)if($.data.relations)d.children.push($);else{const v=t.data.get(p);if(!v){d.children.push($);continue}const f=v[1][1],y=mi[f];y in h||(h[y]=[]),$.data.Entity=$.data.Name,delete $.data.Name,h[y].push($)}}for(const p in h){const b=h[p],$=b.map(f=>f.data.expressID),v={data:{Entity:p,modelID:t.uuid,relations:JSON.stringify($)},children:b};d.children.push(v)}}return s.push(d),s},Jd=async(e,t,i,n)=>{const o=e.get(ht),s=[];for(const r of t){let l;if(n)l={data:{Entity:r.name!==""?r.name:r.uuid},children:await bn(e,r,n,i)};else{const a=o.relationMaps[r.uuid],d=await r.getAllPropertiesOfType(ca);if(!(a&&d))continue;const{expressID:u}=Object.values(d)[0];l={data:{Entity:r.name!==""?r.name:r.uuid},children:await bn(e,r,u,i)}}s.push(l)}return s};let pt;const Qd=(e,t)=>{const i=e.get(Vt),{modelID:n,expressID:o,relations:s}=t;if(!n)return null;const r=i.groups.get(n);return r?r.getFragmentMap([o,...JSON.parse(s??"[]")]):null},Zd=e=>{const{components:t,models:i,expressID:n}=e,o=e.selectHighlighterName??"select",s=e.hoverHighlighterName??"hover";pt||(pt=document.createElement("bim-table"),pt.hiddenColumns=["modelID","expressID","relations"],pt.columns=["Entity","Name"],pt.headersHidden=!0,pt.addEventListener("cellcreated",({detail:l})=>{const{cell:a}=l;a.column==="Entity"&&!("Name"in a.rowData)&&(a.style.gridColumn="1 / -1")})),pt.addEventListener("rowcreated",l=>{l.stopImmediatePropagation();const{row:a}=l.detail,d=t.get(ga),u=Qd(t,a.data);u&&Object.keys(u).length!==0&&(a.onmouseover=()=>{s&&(a.style.backgroundColor="var(--bim-ui_bg-contrast-20)",d.highlightByID(s,u,!0,!1,d.selection[o]??{}))},a.onmouseout=()=>{a.style.backgroundColor="",d.clear(s)},a.onclick=()=>{o&&d.highlightByID(o,u,!0,!0)})});const r=e.inverseAttributes??["IsDecomposedBy","ContainsElements"];return Jd(t,i,r,n).then(l=>pt.data=l),m`${pt}`},Kd=(e,t=!0)=>{const i=z.create(Zd,e);if(t){const[,n]=i,{components:o}=e,s=o.get(Vt),r=o.get(ht),l=()=>n({models:s.groups.values()});r.onRelationsIndexed.add(l),s.onFragmentsDisposed.add(l)}return i},tu=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:Kd},Symbol.toStringTag,{value:"Module"})),Se=(e,t)=>[...e.get(Go).list.values()].find(i=>i.world===t),eu=(e,t)=>m`
    <bim-color-input @input=${i=>{const n=i.target;e.color=new ue(n.color)}} color=${t}></bim-color-input>
  `,iu=(e,t)=>{const{postproduction:i}=e,n=i.n8ao.configuration;return m`
    <bim-color-input @input=${o=>{const s=o.target;n.color=new ue(s.color)}} color=${t}></bim-color-input>
  `},nu=(e,t)=>{const{color:i,opacity:n}=JSON.parse(t),{postproduction:o}=e,{customEffects:s}=o;return m`
    <bim-color-input @input=${r=>{const{color:l,opacity:a}=r.target;s.lineColor=new ue(l).getHex(),a&&(s.opacity=a/100)}} color=${i} opacity=${n*100}></bim-color-input>
  `},ou=(e,t)=>m`
    <bim-color-input @input=${i=>{const n=i.target,o=new ue(n.color);e.material.uniforms.uColor.value=o}} color=${t}></bim-color-input>
  `,su=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({ao:o.checked})}} .checked=${t}></bim-checkbox>
  `},ru=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({gamma:o.checked})}} .checked=${t}></bim-checkbox>
  `},au=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({custom:o.checked})}} .checked=${t}></bim-checkbox>
  `},$t=(e,t,i,n=()=>{})=>m`
    <bim-checkbox .checked="${i}" @change="${o=>{const s=o.target.checked;e[t]=s,n(s)}}"></bim-checkbox> 
  `,N=(e,t,i,n)=>{const o={slider:!1,min:0,max:100,step:1,prefix:null,suffix:null,onInputSet:()=>{},...n},{slider:s,min:r,max:l,step:a,suffix:d,prefix:u,onInputSet:c}=o;return m`
    <bim-number-input
      .pref=${u}
      .suffix=${d}
      .slider=${s} 
      min=${r} 
      value="${i}" 
      max=${l} 
      step=${a} 
      @change="${h=>{const p=h.target.value;e[t]=p,c(p)}}"
    ></bim-number-input> 
  `},lu=e=>{const{components:t}=e,i=t.get(ki);return m`
    <bim-table @cellcreated=${({detail:n})=>{const o=n.cell.parentNode;if(!o)return;const s=o.querySelector("bim-table-cell[column='Name']"),r=o.querySelector("bim-table-cell[column='Value']");s&&!r&&(s.style.gridColumn="1 / -1")}} ${Y(async n=>{var o,s,r,l,a;if(!n)return;const d=n;d.preserveStructureOnFilter=!0,d.dataTransform={Value:(c,h)=>{const p=h.World,b=i.list.get(p);if(!b)return c;const{scene:$,camera:v,renderer:f}=b,y=h.Name;if(y==="Grid"&&h.IsGridConfig&&typeof c=="boolean"){const _=Se(t,b);return _?$t(_,"visible",c):c}if(y==="Color"&&h.IsGridConfig&&typeof c=="string"){const _=Se(t,b);return _?ou(_,c):c}if(y==="Distance"&&h.IsGridConfig&&typeof c=="number"){const _=Se(t,b);return _?N(_.material.uniforms.uDistance,"value",c,{slider:!0,min:300,max:1e3}):c}if(y==="Size"&&h.IsGridConfig&&typeof c=="string"){const _=Se(t,b);if(!_)return c;const{x,y:A}=JSON.parse(c),C=N(_.material.uniforms.uSize1,"value",x,{slider:!0,suffix:"m",prefix:"A",min:1,max:20}),T=N(_.material.uniforms.uSize2,"value",A,{slider:!0,suffix:"m",prefix:"B",min:1,max:20});return m`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${C}${T}</div>
          `}if(y==="Near Frustum"&&v.three instanceof ri&&typeof c=="number"){const _=v.three;return N(v.three,"near",c,{slider:!0,min:.1,max:10,step:.1,onInputSet:()=>_.updateProjectionMatrix()})}if(y==="Far Frustum"&&v.three instanceof ri&&typeof c=="number"){const _=v.three;return N(v.three,"far",c,{slider:!0,min:300,max:2e3,step:10,onInputSet:()=>_.updateProjectionMatrix()})}if(y==="Field of View"&&v.three instanceof ri&&typeof c=="number"){const _=v.three;return N(v.three,"fov",c,{slider:!0,min:10,max:120,onInputSet:()=>_.updateProjectionMatrix()})}if(y==="Invert Drag"&&v.hasCameraControls()&&typeof c=="boolean")return $t(v.controls,"dollyDragInverted",c);if(y==="Dolly Speed"&&v.hasCameraControls()&&typeof c=="number")return N(v.controls,"dollySpeed",c,{slider:!0,min:.5,max:3,step:.1});if(y==="Truck Speed"&&v.hasCameraControls()&&typeof c=="number")return N(v.controls,"truckSpeed",c,{slider:!0,min:.5,max:6,step:.1});if(y==="Smooth Time"&&v.hasCameraControls()&&typeof c=="number")return N(v.controls,"smoothTime",c,{slider:!0,min:.01,max:2,step:.01});if(y==="Intensity"&&typeof c=="number"){if(h.Light&&typeof h.Light=="string"){const _=$.three.children.find(x=>x.uuid===h.Light);return _&&_ instanceof Ce?N(_,"intensity",c,{slider:!0,min:0,max:10,step:.1}):c}if(h.IsAOConfig&&f instanceof P)return N(f.postproduction.n8ao.configuration,"intensity",c,{slider:!0,max:16,step:.1})}if(y==="Color"&&typeof c=="string"){const _=h.Light,x=$.three.children.find(A=>A.uuid===_);if(x&&x instanceof Ce)return eu(x,c);if(h.IsAOConfig&&f instanceof P)return iu(f,c)}if(y==="Ambient Oclussion"&&typeof c=="boolean"&&h.IsAOConfig&&f instanceof P)return su(f,c);if(y==="Half Resolution"&&h.IsAOConfig&&f instanceof P&&typeof c=="boolean")return $t(f.postproduction.n8ao.configuration,"halfRes",c);if(y==="Screen Space Radius"&&h.IsAOConfig&&f instanceof P&&typeof c=="boolean")return $t(f.postproduction.n8ao.configuration,"screenSpaceRadius",c);if(y==="Radius"&&h.IsAOConfig&&f instanceof P&&typeof c=="number")return N(f.postproduction.n8ao.configuration,"aoRadius",c,{slider:!0,max:2,step:.1});if(y==="Denoise Samples"&&h.IsAOConfig&&f instanceof P&&typeof c=="number")return N(f.postproduction.n8ao.configuration,"denoiseSamples",c,{slider:!0,min:1,max:16});if(y==="Samples"&&h.IsAOConfig&&f instanceof P&&typeof c=="number")return N(f.postproduction.n8ao.configuration,"aoSamples",c,{slider:!0,min:1,max:16});if(y==="Denoise Radius"&&h.IsAOConfig&&f instanceof P&&typeof c=="number")return N(f.postproduction.n8ao.configuration,"denoiseRadius",c,{slider:!0,min:0,max:16,step:.1});if(y==="Distance Falloff"&&h.IsAOConfig&&f instanceof P&&typeof c=="number")return N(f.postproduction.n8ao.configuration,"distanceFalloff",c,{slider:!0,min:0,max:4,step:.1});if(y==="Directional Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const _=$.three.children.find(x=>x.uuid===h.Light);return _&&_ instanceof Ce?$t(_,"visible",c):c}if(y==="Ambient Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const _=$.three.children.find(x=>x.uuid===h.Light);return _&&_ instanceof Ce?$t(_,"visible",c):c}if(y==="Position"&&h.Light&&typeof h.Light=="string"&&typeof c=="string"){const _=$.three.children.find(E=>E.uuid===h.Light);if(!(_&&_ instanceof Ce))return c;const{x,y:A,z:C}=JSON.parse(c),T=N(_.position,"x",x,{slider:!0,prefix:"X",suffix:"m",min:-50,max:50}),M=N(_.position,"y",A,{slider:!0,prefix:"Y",suffix:"m",min:-50,max:50}),S=N(_.position,"z",C,{slider:!0,prefix:"Z",suffix:"m",min:-50,max:50});return m`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${T}${M}${S}</div>
          `}return y==="Custom Effects"&&h.IsCEConfig&&f instanceof P&&typeof c=="boolean"?au(f,c):y==="Color"&&h.IsOutlineConfig&&f instanceof P&&typeof c=="string"?nu(f,c):y==="Tolerance"&&h.IsOutlineConfig&&f instanceof P&&typeof c=="number"?N(f.postproduction.customEffects,"tolerance",c,{slider:!0,min:0,max:6,step:.01}):y==="Outline"&&h.IsOutlineConfig&&f instanceof P&&typeof c=="boolean"?$t(f.postproduction.customEffects,"outlineEnabled",c):y==="Gloss"&&h.IsGlossConfig&&f instanceof P&&typeof c=="boolean"?$t(f.postproduction.customEffects,"glossEnabled",c):y==="Min"&&h.IsGlossConfig&&f instanceof P&&typeof c=="number"?N(f.postproduction.customEffects,"minGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):y==="Max"&&h.IsGlossConfig&&f instanceof P&&typeof c=="number"?N(f.postproduction.customEffects,"maxGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):y==="Exponent"&&h.IsGlossConfig&&f instanceof P&&typeof c=="number"?N(f.postproduction.customEffects,"glossExponent",c,{slider:!0,min:0,max:5,step:.01}):y==="Gamma Correction"&&h.IsGammaConfig&&f instanceof P&&typeof c=="boolean"?ru(f,c):c}};const u=[];for(const[,c]of i.list){const{scene:h,camera:p,renderer:b}=c,$=Se(t,c),v={data:{Name:c instanceof ta&&c.name||c.uuid},children:[]};if(h){const f={data:{Name:"Scene"}};if($){const x=`#${$.material.uniforms.uColor.value.getHexString()}`,A=JSON.stringify({x:$.material.uniforms.uSize1.value,y:$.material.uniforms.uSize2.value}),C={data:{Name:"Grid",Value:$.three.visible,World:c.uuid,IsGridConfig:!0},children:[{data:{Name:"Color",Value:x,World:c.uuid,IsGridConfig:!0}},{data:{Name:"Size",Value:A,World:c.uuid,IsGridConfig:!0}},{data:{Name:"Distance",Value:$.material.uniforms.uDistance.value,World:c.uuid,IsGridConfig:!0}}]};f.children||(f.children=[]),f.children.push(C)}const y=h.three.children.filter(x=>x instanceof sa);for(const x of y){const A={data:{Name:"Directional Light",Value:x.visible,World:c.uuid,Light:x.uuid},children:[{data:{Name:"Position",Value:JSON.stringify(x.position),World:c.uuid,Light:x.uuid}},{data:{Name:"Intensity",Value:x.intensity,World:c.uuid,Light:x.uuid}},{data:{Name:"Color",Value:`#${x.color.getHexString()}`,World:c.uuid,Light:x.uuid}}]};f.children||(f.children=[]),f.children.push(A)}const _=h.three.children.filter(x=>x instanceof ra);for(const x of _){const A={data:{Name:"Ambient Light",Value:x.visible,World:c.uuid,Light:x.uuid},children:[{data:{Name:"Intensity",Value:x.intensity,World:c.uuid,Light:x.uuid}},{data:{Name:"Color",Value:`#${x.color.getHexString()}`,World:c.uuid,Light:x.uuid}}]};f.children||(f.children=[]),f.children.push(A)}f.children&&((o=f.children)==null?void 0:o.length)>0&&((s=v.children)==null||s.push(f))}if(p.three instanceof ri){const f={data:{Name:"Perspective Camera"},children:[{data:{Name:"Near Frustum",Value:p.three.near,World:c.uuid}},{data:{Name:"Far Frustum",Value:p.three.far,World:c.uuid}},{data:{Name:"Field of View",Value:p.three.fov,World:c.uuid}}]};if(p.hasCameraControls()){const{controls:y}=p,_={dollyDragInverted:"Invert Drag",dollySpeed:"Dolly Speed",truckSpeed:"Truck Speed",smoothTime:"Smooth Time"};for(const x in _){const A=y[x];A!=null&&((r=f.children)==null||r.push({data:{Name:_[x],Value:A,World:c.uuid}}))}}(l=v.children)==null||l.push(f)}if(b instanceof P){const{postproduction:f}=b,y=f.n8ao.configuration,_={data:{Name:"Renderer"},children:[{data:{Name:"Gamma Correction",Value:f.settings.gamma??!1,World:c.uuid,IsGammaConfig:!0}},{data:{Name:"Ambient Oclussion",Value:f.settings.ao??!1,World:c.uuid,IsAOConfig:!0},children:[{data:{Name:"Samples",Value:y.aoSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Color",Value:`#${y.color.getHexString()}`,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Half Resolution",Value:y.halfRes,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Screen Space Radius",Value:y.screenSpaceRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Radius",Value:y.aoRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Intensity",Value:y.intensity,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Distance Falloff",Value:y.distanceFalloff,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Samples",Value:y.denoiseSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Radius",Value:y.denoiseRadius,World:c.uuid,IsAOConfig:!0}}]},{data:{Name:"Custom Effects",Value:f.settings.custom??!1,World:c.uuid,IsCEConfig:!0},children:[{data:{Name:"Gloss",Value:f.customEffects.glossEnabled,World:c.uuid,IsGlossConfig:!0},children:[{data:{Name:"Min",Value:f.customEffects.minGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Max",Value:f.customEffects.maxGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Exponent",Value:f.customEffects.glossExponent,World:c.uuid,IsGlossConfig:!0}}]},{data:{Name:"Outline",Value:f.customEffects.outlineEnabled,World:c.uuid,IsOutlineConfig:!0},children:[{data:{Name:"Color",get Value(){const x=new ue(f.customEffects.lineColor),A=f.customEffects.opacity;return JSON.stringify({color:`#${x.getHexString()}`,opacity:A})},World:c.uuid,IsOutlineConfig:!0}},{data:{Name:"Tolerance",Value:f.customEffects.tolerance,World:c.uuid,IsOutlineConfig:!0}}]}]}]};(a=v.children)==null||a.push(_)}u.push(v)}d.columns=[{name:"Name",width:"11rem"}],d.hiddenColumns=["World","Light","IsAOConfig","IsCEConfig","IsGlossConfig","IsOutlineConfig","IsGammaConfig","IsGridConfig"],d.data=u})} headers-hidden expanded>
     <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No worlds to configure
      </bim-label>
    </bim-table>
  `},cu=(e,t=!0)=>{const i=z.create(lu,e);if(t){const[,n]=i,{components:o}=e;o.get(ki).list.onItemDeleted.add(()=>n())}return i},du=Object.freeze(Object.defineProperty({__proto__:null,worldsConfiguration:cu},Symbol.toStringTag,{value:"Module"})),Zt=(e,t)=>{const i=t[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
    <div style="display: flex; gap: 0.25rem; overflow: hidden;">
      ${!(i!=null&&i.picture)&&(s||r)?m`
        <bim-label
          style=${zt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
        `:null}
      <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
    </div>
  `},J={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#414141","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},Kt={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"var(--bim-ui_bg-contrast-100)"};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ci=globalThis,Ai=Ci.trustedTypes,To=Ai?Ai.createPolicy("lit-html",{createHTML:e=>e}):void 0,Mr="$lit$",wt=`lit$${Math.random().toFixed(9).slice(2)}$`,Pr="?"+wt,uu=`<${Pr}>`,Ut=document,Ue=()=>Ut.createComment(""),Ve=e=>e===null||typeof e!="object"&&typeof e!="function",Rn=Array.isArray,hu=e=>Rn(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ki=`[ 	
\f\r]`,ke=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Io=/-->/g,No=/>/g,Pt=RegExp(`>|${Ki}(?:([^\\s"'>=/]+)(${Ki}*=${Ki}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mo=/'/g,Po=/"/g,Rr=/^(?:script|style|textarea|title)$/i,pu=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),Ln=pu(1),le=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),Ro=new WeakMap,Lt=Ut.createTreeWalker(Ut,129);function Lr(e,t){if(!Rn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return To!==void 0?To.createHTML(t):t}const mu=(e,t)=>{const i=e.length-1,n=[];let o,s=t===2?"<svg>":t===3?"<math>":"",r=ke;for(let l=0;l<i;l++){const a=e[l];let d,u,c=-1,h=0;for(;h<a.length&&(r.lastIndex=h,u=r.exec(a),u!==null);)h=r.lastIndex,r===ke?u[1]==="!--"?r=Io:u[1]!==void 0?r=No:u[2]!==void 0?(Rr.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Pt):u[3]!==void 0&&(r=Pt):r===Pt?u[0]===">"?(r=o??ke,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Pt:u[3]==='"'?Po:Mo):r===Po||r===Mo?r=Pt:r===Io||r===No?r=ke:(r=Pt,o=void 0);const p=r===Pt&&e[l+1].startsWith("/>")?" ":"";s+=r===ke?a+uu:c>=0?(n.push(d),a.slice(0,c)+Mr+a.slice(c)+wt+p):a+wt+(c===-2?l:p)}return[Lr(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class We{constructor({strings:t,_$litType$:i},n){let o;this.parts=[];let s=0,r=0;const l=t.length-1,a=this.parts,[d,u]=mu(t,i);if(this.el=We.createElement(d,n),Lt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=Lt.nextNode())!==null&&a.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(Mr)){const h=u[r++],p=o.getAttribute(c).split(wt),b=/([.?@])?(.*)/.exec(h);a.push({type:1,index:s,name:b[2],strings:p,ctor:b[1]==="."?bu:b[1]==="?"?gu:b[1]==="@"?vu:Vi}),o.removeAttribute(c)}else c.startsWith(wt)&&(a.push({type:6,index:s}),o.removeAttribute(c));if(Rr.test(o.tagName)){const c=o.textContent.split(wt),h=c.length-1;if(h>0){o.textContent=Ai?Ai.emptyScript:"";for(let p=0;p<h;p++)o.append(c[p],Ue()),Lt.nextNode(),a.push({type:2,index:++s});o.append(c[h],Ue())}}}else if(o.nodeType===8)if(o.data===Pr)a.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(wt,c+1))!==-1;)a.push({type:7,index:s}),c+=wt.length-1}s++}}static createElement(t,i){const n=Ut.createElement("template");return n.innerHTML=t,n}}function ce(e,t,i=e,n){var o,s;if(t===le)return t;let r=n!==void 0?(o=i._$Co)==null?void 0:o[n]:i._$Cl;const l=Ve(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==l&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),l===void 0?r=void 0:(r=new l(e),r._$AT(e,i,n)),n!==void 0?(i._$Co??(i._$Co=[]))[n]=r:i._$Cl=r),r!==void 0&&(t=ce(e,r._$AS(e,t.values),r,n)),t}class fu{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,o=((t==null?void 0:t.creationScope)??Ut).importNode(i,!0);Lt.currentNode=o;let s=Lt.nextNode(),r=0,l=0,a=n[0];for(;a!==void 0;){if(r===a.index){let d;a.type===2?d=new ni(s,s.nextSibling,this,t):a.type===1?d=new a.ctor(s,a.name,a.strings,this,t):a.type===6&&(d=new yu(s,this,t)),this._$AV.push(d),a=n[++l]}r!==(a==null?void 0:a.index)&&(s=Lt.nextNode(),r++)}return Lt.currentNode=Ut,o}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class ni{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,n,o){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=o,this._$Cv=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=ce(this,t,i),Ve(t)?t===j||t==null||t===""?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==le&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hu(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&Ve(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ut.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=We.createElement(Lr(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(n);else{const r=new fu(s,this),l=r.u(this.options);r.p(n),this.T(l),this._$AH=r}}_$AC(t){let i=Ro.get(t.strings);return i===void 0&&Ro.set(t.strings,i=new We(t)),i}k(t){Rn(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,o=0;for(const s of t)o===i.length?i.push(n=new ni(this.O(Ue()),this.O(Ue()),this,this.options)):n=i[o],n._$AI(s),o++;o<i.length&&(this._$AR(n&&n._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class Vi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,o,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=j}_$AI(t,i=this,n,o){const s=this.strings;let r=!1;if(s===void 0)t=ce(this,t,i,0),r=!Ve(t)||t!==this._$AH&&t!==le,r&&(this._$AH=t);else{const l=t;let a,d;for(t=s[0],a=0;a<s.length-1;a++)d=ce(this,l[n+a],i,a),d===le&&(d=this._$AH[a]),r||(r=!Ve(d)||d!==this._$AH[a]),d===j?t=j:t!==j&&(t+=(d??"")+s[a+1]),this._$AH[a]=d}r&&!o&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class bu extends Vi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class gu extends Vi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class vu extends Vi{constructor(t,i,n,o,s){super(t,i,n,o,s),this.type=5}_$AI(t,i=this){if((t=ce(this,t,i,0)??j)===le)return;const n=this._$AH,o=t===j&&n!==j||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==j&&(n===j||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class yu{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){ce(this,t)}}const Lo=Ci.litHtmlPolyfillSupport;Lo==null||Lo(We,ni),(Ci.litHtmlVersions??(Ci.litHtmlVersions=[])).push("3.2.1");const _u=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let o=n._$litPart$;if(o===void 0){const s=(i==null?void 0:i.renderBefore)??null;n._$litPart$=o=new ni(t.insertBefore(Ue(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $u=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xu={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},wu=e=>(...t)=>({_$litDirective$:e,values:t});let Cu=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Me=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const o of n)(i=o._$AO)==null||i.call(o,t,!1),Me(o,t);return!0},Ei=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},jr=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Su(t)}};function Au(e){this._$AN!==void 0?(Ei(this),this._$AM=e,jr(this)):this._$AM=e}function Eu(e,t=!1,i=0){const n=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(n))for(let s=i;s<n.length;s++)Me(n[s],!1),Ei(n[s]);else n!=null&&(Me(n,!1),Ei(n));else Me(this,e)}const Su=e=>{e.type==xu.CHILD&&(e._$AP??(e._$AP=Eu),e._$AQ??(e._$AQ=Au))};let ku=class extends Cu{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),jr(this),this.isConnected=e._$AU}_$AO(e,t=!0){var i,n;e!==this.isConnected&&(this.isConnected=e,e?(i=this.reconnected)==null||i.call(this):(n=this.disconnected)==null||n.call(this)),t&&(Me(this,e),Ei(this))}setValue(e){if($u(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gn=()=>new Ou;let Ou=class{};const tn=new WeakMap,Tu=wu(class extends ku{render(e){return j}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),j}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=tn.get(t);i===void 0&&(i=new WeakMap,tn.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=tn.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Iu={dueDate:e=>{if(typeof e=="string"&&e.trim()!=="")return new Date(e)},status:e=>{if(Array.isArray(e)&&e.length!==0)return e[0]},type:e=>{if(Array.isArray(e)&&e.length!==0)return e[0]},priority:e=>{if(Array.isArray(e)&&e.length!==0)return e[0]},stage:e=>{if(Array.isArray(e)&&e.length!==0)return e[0]},assignedTo:e=>{if(Array.isArray(e)&&e.length!==0)return e[0]},labels:e=>{if(Array.isArray(e))return new Set(e)}},zr=e=>{const{components:t,topic:i,value:n,onCancel:o,onSubmit:s,styles:r}=e,l=s??(()=>{}),a=t.get(Oi),d=(n==null?void 0:n.title)??(i==null?void 0:i.title)??yt.default.title,u=(n==null?void 0:n.status)??(i==null?void 0:i.status)??yt.default.status,c=(n==null?void 0:n.type)??(i==null?void 0:i.type)??yt.default.type,h=(n==null?void 0:n.priority)??(i==null?void 0:i.priority)??yt.default.priority,p=(n==null?void 0:n.assignedTo)??(i==null?void 0:i.assignedTo)??yt.default.assignedTo,b=(n==null?void 0:n.labels)??(i==null?void 0:i.labels)??yt.default.labels,$=(n==null?void 0:n.stage)??(i==null?void 0:i.stage)??yt.default.stage,v=(n==null?void 0:n.description)??(i==null?void 0:i.description)??yt.default.description,f=i!=null&&i.dueDate?i.dueDate.toISOString().split("T")[0]:null,y=new Set([...a.config.statuses]);u&&y.add(u);const _=new Set([...a.config.types]);c&&_.add(c);const x=new Set([...a.config.priorities]);h&&x.add(h);const A=new Set([...a.config.users]);p&&A.add(p);const C=new Set([...a.config.labels]);if(b)for(const w of b)C.add(w);const T=new Set([...a.config.stages]);$&&T.add($);const M=gn(),S=async()=>{const{value:w}=M;if(!w)return;const L=Be(w,Iu);if(i)i.set(L),await l(i);else{const V=a.create(L);await l(V)}},E=gn(),B=w=>{const{value:L}=E;if(!L)return;const V=w.target;L.disabled=V.value.trim()===""},q=`btn-${W.newRandomId()}`,G=`btn-${W.newRandomId()}`;return m`
    <div ${Y(M)} style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; gap: 0.375rem">
        <bim-text-input @input=${B} vertical label="Title" name="title" .value=${d}></bim-text-input>
        ${i?m`
            <bim-dropdown vertical label="Status" name="status" required>
              ${[...y].map(w=>m`<bim-option label=${w} .checked=${u===w}></bim-option>`)}
            </bim-dropdown>`:m``}
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-dropdown vertical label="Type" name="type" required>
          ${[..._].map(w=>m`<bim-option label=${w} .checked=${c===w}></bim-option>`)}
        </bim-dropdown>
        <bim-dropdown vertical label="Priority" name="priority">
          ${[...x].map(w=>m`<bim-option label=${w} .checked=${h===w}></bim-option>`)}
        </bim-dropdown>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-dropdown vertical label="Labels" name="labels" multiple>
          ${[...C].map(w=>m`<bim-option label=${w} .checked=${b?[...b].includes(w):!1}></bim-option>`)}
        </bim-dropdown>
        <bim-dropdown vertical label="Assignee" name="assignedTo">
          ${[...A].map(w=>{const L=r!=null&&r.users?r.users[w]:null,V=L?L.name:w,K=L==null?void 0:L.picture;return m`<bim-option label=${V} value=${w} .img=${K} .checked=${p===w}></bim-option>`})}
        </bim-dropdown>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-text-input vertical type="date" label="Due Date" name="dueDate" .value=${f}></bim-text-input> 
        <bim-dropdown vertical label="Stage" name="stage">
          ${[...T].map(w=>m`<bim-option label=${w} .checked=${$===w}></bim-option>`)}
        </bim-dropdown>
      </div>
      <bim-text-input vertical label="Description" name="description" type="area" .value=${v??null}></bim-text-input>
      <div style="justify-content: right; display: flex; gap: 0.375rem">
        <style>
          #${G} {
            background-color: transparent;
          }

          #${G}:hover {
            --bim-label--c: #FF5252;
          }

          #${q}:hover {
            background-color: #329936;
          }
        </style>
        <bim-button id=${G} style="flex: 0" @click=${o} label="Cancel"></bim-button>
        <bim-button id=${q} style="flex: 0" @click=${S} ${Y(E)} label=${i?"Update Topic":"Add Topic"} icon=${i?"tabler:refresh":"mi:add"}></bim-button>
      </div>
    </div>
  `},Nu=e=>{const{components:t,dataStyles:i,onTopicEnter:n}=e,o=t.get(Oi),s=e.topics??o.list.values();return m`
    <bim-table no-indentation ${Y(r=>{if(!r)return;const l=r;l.hiddenColumns.length===0&&(l.hiddenColumns=["Guid"]),l.columns=["Title"],l.dataTransform={Title:(a,d)=>{const{Guid:u}=d;if(typeof u!="string")return a;const c=o.list.get(u);if(!c)return a;const h=`btn-${W.newRandomId()}`;return m`
          <div style="display: flex; overflow: hidden;">
            <style>
              #${h} {
                background-color: transparent
              }

              #${h}:hover {
                --bim-label--c: var(--bim-ui_accent-base)
              }
            </style>
            <bim-button @click=${()=>{n&&n(c)}} id=${h} icon="iconamoon:enter-duotone"></bim-button>
            <bim-label>${a}</bim-label>
          </div>
        `},Priority:a=>{if(typeof a!="string")return a;const d=((i==null?void 0:i.priorities)??J.priorities)[a];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${zt({...Kt,...d==null?void 0:d.style})}
          >${a}
          </bim-label>
        `},Status:a=>{if(typeof a!="string")return a;const d=((i==null?void 0:i.statuses)??J.statuses)[a];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${zt({...Kt,...d==null?void 0:d.style})}
          >${a}
          </bim-label>
        `},Type:a=>{if(typeof a!="string")return a;const d=((i==null?void 0:i.types)??J.types)[a];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${zt({...Kt,...d==null?void 0:d.style})}
          >${a}
          </bim-label>
        `},Author:a=>typeof a!="string"?a:Zt(a,(i==null?void 0:i.users)??J.users),Assignee:a=>typeof a!="string"?a:Zt(a,(i==null?void 0:i.users)??J.users)},l.data=[...s].map(a=>{var d;return{data:{Guid:a.guid,Title:a.title,Status:a.status,Description:a.description??"",Author:a.creationAuthor,Assignee:a.assignedTo??"",Date:a.creationDate.toDateString(),DueDate:((d=a.dueDate)==null?void 0:d.toDateString())??"",Type:a.type,Priority:a.priority??""}}})})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">There are no topics to display</bim-label>
    </bim-table>
  `},Dr=(e,t=!0)=>{const i=z.create(Nu,e);if(t){const{components:n,topics:o}=e,[,s]=i,r=n.get(Oi);if(r.list.onItemUpdated.add(()=>s()),r.list.onItemDeleted.add(()=>s()),o)for(const l of o)l.relatedTopics.onItemAdded.add(()=>s()),l.relatedTopics.onItemDeleted.add(()=>s()),l.relatedTopics.onCleared.add(()=>s());else r.list.onItemSet.add(()=>s())}return i},Mu=Object.freeze(Object.defineProperty({__proto__:null,topicsList:Dr},Symbol.toStringTag,{value:"Module"})),Pu=e=>{const{topic:t,styles:i,viewpoint:n}=e,o={delete:!0,...e.actions};return m`
    <bim-table no-indentation ${Y(s=>{if(!s)return;const r=s;r.headersHidden=!0,r.hiddenColumns=["guid","author"],r.dataTransform={Comment:(a,d)=>{const{guid:u}=d;if(typeof u!="string")return a;const c=t.comments.get(u);if(!c)return a;const h=()=>{t.comments.delete(u)},p=`btn-${W.newRandomId()}`;return m`
          <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex; gap: 0.375rem;">
                ${Zt(c.author,i??J.users)}
                <bim-label style="color: var(--bim-ui_bg-contrast-40)">@ ${c.date.toDateString()}</bim-label>
              </div>
              <div>
                <style>
                  #${p} {
                    background-color: transparent;
                    --bim-label--c: var(--bim-ui_bg-contrast-60)
                  }

                  #${p}:hover {
                    --bim-label--c: #FF5252;
                  }
                </style>
                ${o!=null&&o.delete?m`<bim-button @click=${h} id=${p} icon="majesticons:delete-bin"></bim-button>`:null}
              </div>
            </div>
            <bim-label style="margin-left: 1.7rem; white-space: normal">${c.comment}</bim-label>
          </div>
        `}};let l=t.comments.values();n&&(l=[...t.comments.values()].filter(a=>a.viewpoint===n)),r.data=[...l].map(a=>({data:{guid:a.guid,Comment:a.comment,author:(()=>{const d=i;if(!d)return a.author;const u=d[a.author];return(u==null?void 0:u.name)??a.author})()}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">This topic has no comments</bim-label>
    </bim-table>
  `},Hr=(e,t=!0)=>{const i=z.create(Pu,e);if(t){const{topic:n}=e,[o,s]=i;n.comments.onItemSet.add(()=>s()),n.comments.onItemUpdated.add(()=>s()),n.comments.onItemDeleted.add(()=>s()),n.comments.onCleared.add(()=>s())}return i},Ru=Object.freeze(Object.defineProperty({__proto__:null,topicComments:Hr},Symbol.toStringTag,{value:"Module"})),Lu=e=>{var t;const{components:i,topic:n}=e,o={selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!!n,...e.actions},s=i.get(vn),r=((t=e.topic)==null?void 0:t.viewpoints)??s.list.keys(),l=[];for(const a of r){const d=s.list.get(a);d&&l.push(d)}return m`
    <bim-table no-indentation ${Y(a=>{if(!a)return;const d=a;d.addEventListener("cellcreated",({detail:u})=>{const{cell:c}=u;c.style.padding="0.25rem"}),d.headersHidden=!0,d.hiddenColumns=["Guid"],d.columns=["Title",{name:"Actions",width:"auto"}],d.dataTransform={Actions:(u,c)=>{const{Guid:h}=c;if(!(h&&typeof h=="string"))return h||"";const p=s.list.get(h);return p?m`
          <bim-button icon="ph:eye-fill" @click=${()=>p.go()}></bim-button>
          ${Object.values(o).includes(!0)?m`
                <bim-button icon="prime:ellipsis-v">
                  <bim-context-menu>
                    ${o.selectComponents?m`<bim-button label="Select Components" @click=${()=>console.log(p.selection)}></bim-button> `:null}
                    ${o.colorizeComponent?m`<bim-button label="Colorize Components" @click=${()=>p.applyColors()}></bim-button> `:null}
                    ${o.resetColors?m`<bim-button label="Reset Colors" @click=${()=>p.resetColors()}></bim-button> `:null}
                    ${o.updateCamera?m`<bim-button label="Update Camera" @click=${()=>p.updateCamera()}></bim-button> `:null}
                    ${o.unlink?m`<bim-button .disabled=${!n} label="Unlink" @click=${()=>n==null?void 0:n.viewpoints.delete(p.guid)}></bim-button> `:null}
                    ${o.delete?m`<bim-button label="Delete" @click=${()=>s.list.delete(p.guid)}></bim-button>`:null}
                  </bim-context-menu>
                </bim-button>
              `:null}
        `:h}},d.data=l.map((u,c)=>({data:{Guid:u.guid,Title:u.title??`Viewpoint ${e.topic?c+1:""}`,Actions:""}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">No viewpoints to show</bim-label>
    </bim-table>
  `},Fr=(e,t=!0)=>{const i=z.create(Lu,e),{components:n,topic:o}=e;if(t){const[,s]=i,r=n.get(vn);r.list.onItemUpdated.add(()=>s()),r.list.onItemDeleted.add(()=>s()),r.list.onCleared.add(()=>s()),o?(o.viewpoints.onItemAdded.add(()=>s()),o.viewpoints.onItemDeleted.add(()=>s()),o.viewpoints.onCleared.add(()=>s())):r.list.onItemSet.add(()=>s())}return i},ju=Object.freeze(Object.defineProperty({__proto__:null,viewpointsList:Fr},Symbol.toStringTag,{value:"Module"}));({...Sd,...Td,...Md,...Xd,...tu,...du,...Mu,...Ru,...ju});const zu=e=>m`
    <bim-panel-section fixed label="New Topic" name="topic">
      ${zr(e)}
    </bim-panel-section>
  `,Du=e=>z.create(zu,e),Hu=Object.freeze(Object.defineProperty({__proto__:null,topic:Du},Symbol.toStringTag,{value:"Module"}));({...Hu});const Fu=(e,t)=>{const{components:i,editing:n,topic:o,styles:s}=e,r={update:!0,...e.actions},l=(s==null?void 0:s.priorities)??J.priorities,a=(s==null?void 0:s.statuses)??J.statuses,d=(s==null?void 0:s.types)??J.types;let u;o!=null&&o.priority&&(u=l[o.priority]);let c;o!=null&&o.type&&(c=d[o.type]);let h;o!=null&&o.type&&(h=a[o.status]);let p,b;return n?p=zr({components:i,topic:o,styles:s,onSubmit:()=>{t({editing:!1})},onCancel:()=>{t({editing:!1})}}):b=m`
      <div>
        <bim-label>Title</bim-label>
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${o.title}</bim-label>
      </div>

      ${o.description?m`
            <div>
              <bim-label>Description</bim-label>
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100); white-space: normal">${o.description}</bim-label>
            </div>
          `:null}

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Status</bim-label>
        <bim-label .icon=${h==null?void 0:h.icon} style=${zt({...Kt,...h==null?void 0:h.style})}
        >${o.status}
        </bim-label>
      </div>

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Type</bim-label>
        <bim-label .icon=${c==null?void 0:c.icon} style=${zt({...Kt,...c==null?void 0:c.style})}
        >${o.type}
        </bim-label>
      </div>

      ${o.priority?m`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Priority</bim-label>
              <bim-label .icon=${u==null?void 0:u.icon} style=${zt({...Kt,...u==null?void 0:u.style})}
              >${o.priority}
              </bim-label>
            </div>`:null}

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Author</bim-label>
        ${Zt(o.creationAuthor,(s==null?void 0:s.users)??J.users)}
      </div>

      ${o.assignedTo?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Assignee</bim-label>
            ${Zt(o.assignedTo,(s==null?void 0:s.users)??J.users)}
          </div>`:null}

      ${o.dueDate?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Due Date</bim-label>
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${o.dueDate.toDateString()}</bim-label>
          </div>`:null}

      ${o.modifiedAuthor?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Modified By</bim-label>
            ${Zt(o.modifiedAuthor,(s==null?void 0:s.users)??J.users)}
          </div>`:null}

      ${o.modifiedDate?m`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Modified Date</bim-label>
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${o.modifiedDate.toDateString()}</bim-label>
            </div>`:null}

      ${o.labels.size!==0?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Labels</bim-label>
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${[...o.labels].join(", ")}</bim-label>
          </div>`:null}

      ${r.update?m`
              <bim-button @click=${()=>t({editing:!0})} label="Update Information" icon="tabler:refresh"></bim-button> 
            `:null}
    `,m`
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${n?p:b}
    </div>
  `},Bu=e=>z.create(Fu,e),Uu=Object.freeze(Object.defineProperty({__proto__:null,topicInformation:Bu},Symbol.toStringTag,{value:"Module"})),Vu=(e,t)=>{const{showInput:i,topic:n,styles:o}=e,s={add:!0,delete:!0,...e.actions},r=`input-${W.newRandomId()}`,l=`btn-${W.newRandomId()}`,a=`btn-${W.newRandomId()}`,d=()=>document.getElementById(l),u=()=>document.getElementById(r),c=()=>{const _=u();return _?_.value.trim().length>0:!1},h=()=>{t({showInput:!0})},p=()=>{const _=u(),x=c();_&&x&&(n.createComment(_.value),t({showInput:!1}))},b=()=>{t({showInput:!1})},$=()=>{const _=d();if(_){if(!u()){_.disabled=!0;return}_.disabled=!c()}},v=m`
    ${s.add?m`<bim-button @click=${h} label="Add Comment" icon="majesticons:comment-line"></bim-button>`:null}
  `,f=m`
    <bim-text-input id=${r} @input=${$} @keypress=${_=>{_.code==="Enter"&&_.ctrlKey&&p()}} type="area"></bim-text-input>

    <div style="justify-content: right; display: flex; gap: 0.375rem">
      <style>
        #${l} {
          background-color: #329936;
        }  

        #${a} {
          background-color: transparent;
        }

        #${a}:hover {
          --bim-label--c: #FF5252;
        }
      </style>

      <bim-button style="flex: 0" id=${a} @click=${b} label="Cancel"></bim-button>
      <bim-button style="flex: 0" id=${l} @click=${p} label="Accept" icon="material-symbols:check" disabled></bim-button>
    </div>
  `,[y]=Hr({topic:n,actions:s,styles:o??J.users});return m`
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      ${y}
      ${i?f:v}
    </div>
  `},Wu=e=>z.create(Vu,e),Gu=Object.freeze(Object.defineProperty({__proto__:null,topicComments:Wu},Symbol.toStringTag,{value:"Module"})),Yu=(e,t)=>{const{components:i,topic:n,linking:o}=e,s=i.get(Oi),r={link:!0,...e.actions},[l,a]=Dr({components:i,topics:[...n.relatedTopics].map(h=>s.list.get(h)).map(h=>h)});l.headersHidden=!0,l.hiddenColumns=["Guid","Status","Description","Author","Assignee","Date","DueDate","Type","Priority"];const d=()=>m`
      <bim-text-input placeholder="Search..." debounce="100" @input=${h=>{const p=h.target;p instanceof rt&&(l.queryString=p.value)}}></bim-text-input> 
    `;let u,c;if(o){l.selectableRows=!0,a({topics:void 0});const h=l.data.filter(f=>{const{Guid:y}=f.data;return typeof y!="string"?!1:n.relatedTopics.has(y)}).map(f=>f.data);l.selection=new Set(h);const p=()=>{const f=[...l.selection].map(({Guid:y})=>typeof y!="string"?null:s.list.has(y)?y:null).map(y=>y);n.relatedTopics.clear(),n.relatedTopics.add(...f),t({linking:!1})},b=()=>{t({linking:!1})},$=`btn-${W.newRandomId()}`,v=`btn-${W.newRandomId()}`;u=m`
      <div style="display: flex; gap: 0.25rem">
        <style>
          #${$}:hover {
            background-color: #329936;
          }  

          #${v} {
            background-color: transparent;
          }

          #${v}:hover {
            --bim-label--c: #FF5252;
          }
        </style>
        ${d()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          <bim-button id=${v} @click=${b} style="flex: 0" label="Cancel" icon="material-symbols:close"></bim-button>
          <bim-button id=${$} @click=${p} style="flex: 0" label="Accept" icon="material-symbols:check"></bim-button>
        </div>
      </div> 
    `}else{l.selectableRows=!1;const h=()=>{t({linking:!0})};c=m`
      <div style="display: flex; justify-content: right; gap: 0.25rem">
        ${d()}
        ${r.link?m`<bim-button style="flex: 0" @click=${h} icon="tabler:link"></bim-button>`:null}
      </div> 
    `}return m`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${c}
      ${u}
      ${l}
    </div> 
  `},qu=e=>z.create(Yu,e),Xu=Object.freeze(Object.defineProperty({__proto__:null,topicRelations:qu},Symbol.toStringTag,{value:"Module"})),Ju=(e,t)=>{const{components:i,topic:n,world:o,linking:s}=e,r={add:!0,link:!0,selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!0,...e.actions},l=i.get(vn),[a,d]=Fr({components:i,topic:n,actions:r}),u=()=>m`
      <bim-text-input placeholder="Search..." debounce="100" @input=${p=>{const b=p.target;b instanceof rt&&(a.queryString=b.value)}}></bim-text-input> 
    `;let c,h;if(s){a.selectableRows=!0,d({topic:void 0,actions:{delete:!1,updateCamera:!1,colorizeComponent:!1,resetColors:!1}});const p=a.data.filter(y=>{const{Guid:_}=y.data;return typeof _!="string"?!1:n.viewpoints.has(_)}).map(y=>y.data);a.selection=new Set(p);const b=()=>{const y=[...a.selection].map(({Guid:_})=>typeof _!="string"?null:l.list.has(_)?_:null).map(_=>_);n.viewpoints.clear(),n.viewpoints.add(...y),t({linking:!1})},$=()=>{t({linking:!1})},v=`btn-${W.newRandomId()}`,f=`btn-${W.newRandomId()}`;c=m`
      <div style="display: flex; gap: 0.25rem">
        <style>
          #${v}:hover {
            background-color: #329936;
          }  

          #${f} {
            background-color: transparent;
          }

          #${f}:hover {
            --bim-label--c: #FF5252;
          }
        </style>
        ${u()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          <bim-button id=${f} @click=${$} style="flex: 0" label="Cancel" icon="material-symbols:close"></bim-button>
          <bim-button id=${v} @click=${b} style="flex: 0" label="Accept" icon="material-symbols:check"></bim-button>
        </div>
      </div> 
    `}else{a.selectableRows=!1,d({topic:n,actions:r});const p=()=>{if(!(n&&o&&r.add&&!s))return;const f=l.create(o);n.viewpoints.add(f.guid)},b=()=>{t({linking:!0})},$=m`<bim-button style="flex: 0" @click=${p} .disabled=${!o} icon="mi:add"></bim-button>`,v=m`<bim-button style="flex: 0" @click=${b} icon="tabler:link"></bim-button>`;h=m`
      <div style="display: flex; justify-content: right; gap: 0.25rem">
        ${u()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          ${r.add?$:null}
          ${r.link?v:null}
        </div>
      </div> 
    `}return m`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${h}
      ${c}
      ${a}
    </div> 
  `},Qu=e=>z.create(Ju,e),Zu=Object.freeze(Object.defineProperty({__proto__:null,topicViewpoints:Qu},Symbol.toStringTag,{value:"Module"}));({...Uu,...Gu,...Xu,...Zu});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pi=globalThis,jn=pi.ShadowRoot&&(pi.ShadyCSS===void 0||pi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zn=Symbol(),jo=new WeakMap;let Br=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==zn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(jn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=jo.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&jo.set(t,e))}return e}toString(){return this.cssText}};const Ku=e=>new Br(typeof e=="string"?e:e+"",void 0,zn),Dn=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new Br(i,e,zn)},th=(e,t)=>{if(jn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),o=pi.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=i.cssText,e.appendChild(n)}},zo=jn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Ku(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:eh,defineProperty:ih,getOwnPropertyDescriptor:nh,getOwnPropertyNames:oh,getOwnPropertySymbols:sh,getPrototypeOf:rh}=Object,de=globalThis,Do=de.trustedTypes,ah=Do?Do.emptyScript:"",Ho=de.reactiveElementPolyfillSupport,Pe=(e,t)=>e,Si={toAttribute(e,t){switch(t){case Boolean:e=e?ah:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},Hn=(e,t)=>!eh(e,t),Fo={attribute:!0,type:String,converter:Si,reflect:!1,hasChanged:Hn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),de.litPropertyMetadata??(de.litPropertyMetadata=new WeakMap);class Jt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Fo){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),o=this.getPropertyDescriptor(t,n,i);o!==void 0&&ih(this.prototype,t,o)}}static getPropertyDescriptor(t,i,n){const{get:o,set:s}=nh(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return o==null?void 0:o.call(this)},set(r){const l=o==null?void 0:o.call(this);s.call(this,r),this.requestUpdate(t,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Fo}static _$Ei(){if(this.hasOwnProperty(Pe("elementProperties")))return;const t=rh(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Pe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pe("properties"))){const i=this.properties,n=[...oh(i),...sh(i)];for(const o of n)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,o]of i)this.elementProperties.set(n,o)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const o=this._$Eu(i,n);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const o of n)i.unshift(zo(o))}else t!==void 0&&i.push(zo(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return th(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:Si).toAttribute(i,o.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,i){var n;const o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=o.getPropertyOptions(s),l=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:Si;this._$Em=s,this[s]=l.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??Hn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,r]of o)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(o=>{var s;return(s=o.hostUpdate)==null?void 0:s.call(o)}),this.update(n)):this._$EU()}catch(o){throw i=!1,this._$EU(),o}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdated)==null?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Jt.elementStyles=[],Jt.shadowRootOptions={mode:"open"},Jt[Pe("elementProperties")]=new Map,Jt[Pe("finalized")]=new Map,Ho==null||Ho({ReactiveElement:Jt}),(de.reactiveElementVersions??(de.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Dt=class extends Jt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=_u(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return le}};var Bo;Dt._$litElement$=!0,Dt.finalized=!0,(Bo=globalThis.litElementHydrateSupport)==null||Bo.call(globalThis,{LitElement:Dt});const Uo=globalThis.litElementPolyfillSupport;Uo==null||Uo({LitElement:Dt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lh={attribute:!0,type:String,converter:Si,reflect:!1,hasChanged:Hn},ch=(e=lh,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(r,a,e)},init(l){return l!==void 0&&this.P(r,void 0,e),l}}}if(n==="setter"){const{name:r}=i;return function(l){const a=this[r];t.call(this,l),this.requestUpdate(r,a,e)}}throw Error("Unsupported decorator location: "+n)};function X(e){return(t,i)=>typeof i=="object"?ch(e,t,i):((n,o,s)=>{const r=o.hasOwnProperty(s);return o.constructor.createProperty(s,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dh(e){return X({...e,state:!0,attribute:!1})}class uh extends aa{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new la(.5,.5),this.addEventListener("removed",function(){this.traverse(function(i){i.element instanceof Element&&i.element.parentNode!==null&&i.element.parentNode.removeChild(i.element)})})}copy(t,i){return super.copy(t,i),this.element=t.element.cloneNode(!0),this.center=t.center,this}}new yn;new Ti;new Ti;new yn;new yn;class hh{constructor(t,i){this._group=new Fn,this._frustum=new ea,this._frustumMat=new Ti,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new ia({color:"#2e3338"}),this.numbers=new Fn,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._offsetX=0,this._offsetY=0,this._camera=t,this._container=i;const n=this.newGrid(-1),o=this.newGrid(-2);this.grids={main:n,secondary:o},this._group.add(o,n,this.numbers)}set scaleX(t){this._scaleX=t,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(t){this._scaleY=t,this.regenerate()}get scaleY(){return this._scaleY}set offsetX(t){this._offsetX=t,this.regenerate()}get offsetX(){return this._offsetX}set offsetY(t){this._offsetY=t,this.regenerate()}get offsetY(){return this._offsetY}get(){return this._group}dispose(){const{main:t,secondary:i}=this.grids;t.removeFromParent(),i.removeFromParent(),t.geometry.dispose(),t.material.dispose(),i.geometry.dispose(),i.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const t=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(t);const{planes:i}=this._frustum,n=i[0].constant*-i[0].normal.x,o=i[1].constant*-i[1].normal.x,s=i[2].constant*-i[2].normal.y,r=i[3].constant*-i[3].normal.y,l=Math.abs(n-o),a=Math.abs(r-s),{clientWidth:d,clientHeight:u}=this._container,c=Math.max(d,u),h=Math.max(l,a)/c,p=Math.ceil(Math.log10(l/this.scaleX)),b=Math.ceil(Math.log10(a/this.scaleY)),$=10**(p-2)*this.scaleX,v=10**(b-2)*this.scaleY,f=$*this.gridsFactor,y=v*this.gridsFactor,_=Math.ceil(a/y),x=Math.ceil(l/f),A=Math.ceil(a/v),C=Math.ceil(l/$),T=$*Math.ceil(o/$),M=v*Math.ceil(s/v),S=f*Math.ceil(o/f),E=y*Math.ceil(s/y),B=[...this.numbers.children];for(const U of B)U.removeFromParent();this.numbers.children=[];const q=[],G=9*h,w=1e4,L=S+this._offsetX,V=Math.round(Math.abs(L/this.scaleX)*w)/w,K=(x-1)*f,tt=Math.round(Math.abs((L+K)/this.scaleX)*w)/w,ct=Math.max(V,tt).toString().length*G;let xe=Math.ceil(ct/f)*f;for(let U=0;U<x;U++){let D=S+U*f;q.push(D,r,0,D,s,0),D=Math.round(D*w)/w,xe=Math.round(xe*w)/w;const we=D%xe;if(!(f<1||y<1)&&Math.abs(we)>.01)continue;const si=this.newNumber((D+this._offsetX)/this.scaleX),Gi=12*h;si.position.set(D,s+Gi,0)}for(let U=0;U<_;U++){const D=E+U*y;q.push(o,D,0,n,D,0);const we=this.newNumber(D/this.scaleY);let si=12;we.element.textContent&&(si+=4*we.element.textContent.length);const Gi=si*h;we.position.set(o+Gi,D,0)}const Wi=[];for(let U=0;U<C;U++){const D=T+U*$;Wi.push(D,r,0,D,s,0)}for(let U=0;U<A;U++){const D=M+U*v;Wi.push(o,D,0,n,D,0)}const Yr=new Bn(new Float32Array(q),3),qr=new Bn(new Float32Array(Wi),3),{main:Xr,secondary:Jr}=this.grids;Xr.geometry.setAttribute("position",Yr),Jr.geometry.setAttribute("position",qr)}newNumber(t){const i=document.createElement("bim-label");i.textContent=String(Math.round(t*100)/100);const n=new uh(i);return this.numbers.add(n),n}newGrid(t){const i=new na,n=new oa(i,this.material);return n.frustumCulled=!1,n.renderOrder=t,n}isGridReady(){const t=this._camera.projectionMatrix.elements;for(let i=0;i<t.length;i++){const n=t[i];if(Number.isNaN(n))return!1}return!0}}var ph=Object.defineProperty,mh=Object.getOwnPropertyDescriptor,oi=(e,t,i,n)=>{for(var o=mh(t,i),s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&ph(t,i,o),o};const Ur=class extends Dt{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(t){if(this._gridColor=t,!(t&&this._grid))return;const i=Number(t.replace("#","0x"));Number.isNaN(i)||this._grid.material.color.setHex(i)}get gridColor(){return this._gridColor}set gridScaleX(t){this._gridScaleX=t,t&&this._grid&&(this._grid.scaleX=t)}get gridScaleX(){return this._gridScaleX}set gridScaleY(t){this._gridScaleY=t,t&&this._grid&&(this._grid.scaleY=t)}get gridScaleY(){return this._gridScaleY}get gridOffsetX(){var t;return((t=this._grid)==null?void 0:t.offsetX)||0}set gridOffsetX(t){this._grid&&(this._grid.offsetX=t)}get gridOffsetY(){var t;return((t=this._grid)==null?void 0:t.offsetY)||0}set gridOffsetY(t){this._grid&&(this._grid.offsetY=t)}set components(t){this.dispose();const i=t.get(ki).create();this._world=i,i.scene=new Vo(t),i.scene.setup(),i.renderer=new ba(t,this);const n=new Wo(t);i.camera=n;const o=new hh(n.threeOrtho,this);this._grid=o,i.scene.three.add(o.get()),n.controls.addEventListener("update",()=>o.regenerate()),setTimeout(async()=>{i.camera.updateAspect(),n.set("Plan"),await n.controls.setLookAt(0,0,100,0,0,0),await n.projection.set("Orthographic"),n.controls.dollySpeed=3,n.controls.draggingSmoothTime=.085,n.controls.maxZoom=1e3,n.controls.zoom(4)})}get world(){return this._world}dispose(){var t;(t=this.world)==null||t.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return Ln`<slot></slot>`}};Ur.styles=Dn`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let $e=Ur;oi([X({type:String,attribute:"grid-color",reflect:!0})],$e.prototype,"gridColor");oi([X({type:Number,attribute:"grid-scale-x",reflect:!0})],$e.prototype,"gridScaleX");oi([X({type:Number,attribute:"grid-scale-y",reflect:!0})],$e.prototype,"gridScaleY");oi([X({type:Number,attribute:"grid-offset-x",reflect:!0})],$e.prototype,"gridOffsetX");oi([X({type:Number,attribute:"grid-offset-y",reflect:!0})],$e.prototype,"gridOffsetY");var fh=Object.defineProperty,It=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&fh(t,i,o),o};const Vr=class extends Dt{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new Ti,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=t=>Math.abs(t)<1e-10?0:t}set camera(t){this._camera=t,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:t}=this._matrix;this._cssMatrix3D=`matrix3d(
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
    `}render(){const t=this.size??this._defaults.size;return Ln`
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
    `}};Vr.styles=Dn`
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
  `;let vt=Vr;It([X({type:Number,reflect:!0})],vt.prototype,"size");It([X({type:String,attribute:"right-text",reflect:!0})],vt.prototype,"rightText");It([X({type:String,attribute:"left-text",reflect:!0})],vt.prototype,"leftText");It([X({type:String,attribute:"top-text",reflect:!0})],vt.prototype,"topText");It([X({type:String,attribute:"bottom-text",reflect:!0})],vt.prototype,"bottomText");It([X({type:String,attribute:"front-text",reflect:!0})],vt.prototype,"frontText");It([X({type:String,attribute:"back-text",reflect:!0})],vt.prototype,"backText");It([dh()],vt.prototype,"_cssMatrix3D");var bh=Object.defineProperty,gh=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&bh(t,i,o),o};const Wr=class extends Dt{constructor(){super(...arguments),this.world=null,this._components=null,this._viewport=gn()}set components(t){var i;if(this._components=t,this.components){const n=this.components.get(ki);this.world=n.create(),this.world.name=this.name}else(i=this.world)==null||i.dispose(),this.world=null}get components(){return this._components}connectedCallback(){super.connectedCallback(),this.world&&(this.world.enabled=!0)}disconnectedCallback(){super.disconnectedCallback(),this.world&&(this.world.enabled=!1)}dispose(){this.components=null,this.remove()}firstUpdated(){const{value:t}=this._viewport;if(!(this.components&&t&&this.world))return;const i=new Vo(this.components);this.world.scene=i,i.setup(),i.three.background=null;const n=new P(this.components,t);this.world.renderer=n;const{postproduction:o}=n,s=new Wo(this.components);this.world.camera=s;const r=this.components.get(Go).create(this.world);r.material.uniforms.uColor.value=new ue(4342338),r.material.uniforms.uSize1.value=2,r.material.uniforms.uSize2.value=8,o.enabled=!0,o.customEffects.excludedMeshes.push(r.three),o.setPasses({custom:!0,ao:!0,gamma:!0}),o.customEffects.lineColor=1513756}onSlotChange(){const t=new Event("slotchange");this.dispatchEvent(t)}render(){return Ln` <bim-viewport ${Tu(this._viewport)}>
      <slot @slotchange=${this.onSlotChange}></slot>
    </bim-viewport>`}};Wr.styles=Dn``;let Gr=Wr;gh([X({type:String,reflect:!0})],Gr.prototype,"name");class Ch{static init(){W.defineCustomElement("bim-view-cube",vt),W.defineCustomElement("bim-world-2d",$e),W.defineCustomElement("bim-world",Gr)}}export{Ch as w};
