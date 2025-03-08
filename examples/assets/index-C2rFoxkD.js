import{W as On,S as Us,O as Vs,G as Ws,F as Ve,I as he,B as Tn,V as yi,f as Qo,H as Gs,g as Zo,c as Ko,h as ea,i as mn,T as ve}from"./index-MG2l5tzA.js";import{I as ta,R as na,a as Ys,b as qs,c as ia,d as Xs,e as sa,f as ra,g as Js,h as Qs,i as oa,j as aa}from"./web-ifc-api-CuDRTh9k.js";import{V as vi,j as In,X as la,W as P,C as dt,G as Fi,l as ca,d as ua,m as Bi,n as da,o as ha,L as pa,p as an,q as Ct,D as fa,r as ma,s as ba,t as ga}from"./index-CeXOB-rx.js";var ya=Object.defineProperty,va=(t,e,n)=>e in t?ya(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,Ne=(t,e,n)=>(va(t,typeof e!="symbol"?e+"":e,n),n);const et=Math.min,fe=Math.max,bn=Math.round,Ce=t=>({x:t,y:t}),_a={left:"right",right:"left",bottom:"top",top:"bottom"},$a={start:"end",end:"start"};function Ui(t,e,n){return fe(t,et(e,n))}function Gt(t,e){return typeof t=="function"?t(e):t}function me(t){return t.split("-")[0]}function Nn(t){return t.split("-")[1]}function Zs(t){return t==="x"?"y":"x"}function Ks(t){return t==="y"?"height":"width"}function He(t){return["top","bottom"].includes(me(t))?"y":"x"}function er(t){return Zs(He(t))}function xa(t,e,n){n===void 0&&(n=!1);const i=Nn(t),s=er(t),r=Ks(s);let o=s==="x"?i===(n?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[r]>e.floating[r]&&(o=gn(o)),[o,gn(o)]}function wa(t){const e=gn(t);return[ni(t),e,ni(e)]}function ni(t){return t.replace(/start|end/g,e=>$a[e])}function Ca(t,e,n){const i=["left","right"],s=["right","left"],r=["top","bottom"],o=["bottom","top"];switch(t){case"top":case"bottom":return n?e?s:i:e?i:s;case"left":case"right":return e?r:o;default:return[]}}function Aa(t,e,n,i){const s=Nn(t);let r=Ca(me(t),n==="start",i);return s&&(r=r.map(o=>o+"-"+s),e&&(r=r.concat(r.map(ni)))),r}function gn(t){return t.replace(/left|right|bottom|top/g,e=>_a[e])}function Ea(t){return{top:0,right:0,bottom:0,left:0,...t}}function tr(t){return typeof t!="number"?Ea(t):{top:t,right:t,bottom:t,left:t}}function tt(t){const{x:e,y:n,width:i,height:s}=t;return{width:i,height:s,top:n,left:e,right:e+i,bottom:n+s,x:e,y:n}}function Vi(t,e,n){let{reference:i,floating:s}=t;const r=He(e),o=er(e),l=Ks(o),a=me(e),u=r==="y",d=i.x+i.width/2-s.width/2,c=i.y+i.height/2-s.height/2,h=i[l]/2-s[l]/2;let p;switch(a){case"top":p={x:d,y:i.y-s.height};break;case"bottom":p={x:d,y:i.y+i.height};break;case"right":p={x:i.x+i.width,y:c};break;case"left":p={x:i.x-s.width,y:c};break;default:p={x:i.x,y:i.y}}switch(Nn(e)){case"start":p[o]-=h*(n&&u?-1:1);break;case"end":p[o]+=h*(n&&u?-1:1);break}return p}const Sa=async(t,e,n)=>{const{placement:i="bottom",strategy:s="absolute",middleware:r=[],platform:o}=n,l=r.filter(Boolean),a=await(o.isRTL==null?void 0:o.isRTL(e));let u=await o.getElementRects({reference:t,floating:e,strategy:s}),{x:d,y:c}=Vi(u,i,a),h=i,p={},b=0;for(let $=0;$<l.length;$++){const{name:y,fn:m}=l[$],{x:v,y:_,data:x,reset:A}=await m({x:d,y:c,initialPlacement:i,placement:h,strategy:s,middlewareData:p,rects:u,platform:o,elements:{reference:t,floating:e}});d=v??d,c=_??c,p={...p,[y]:{...p[y],...x}},A&&b<=50&&(b++,typeof A=="object"&&(A.placement&&(h=A.placement),A.rects&&(u=A.rects===!0?await o.getElementRects({reference:t,floating:e,strategy:s}):A.rects),{x:d,y:c}=Vi(u,h,a)),$=-1)}return{x:d,y:c,placement:h,strategy:s,middlewareData:p}};async function nr(t,e){var n;e===void 0&&(e={});const{x:i,y:s,platform:r,rects:o,elements:l,strategy:a}=t,{boundary:u="clippingAncestors",rootBoundary:d="viewport",elementContext:c="floating",altBoundary:h=!1,padding:p=0}=Gt(e,t),b=tr(p),$=l[h?c==="floating"?"reference":"floating":c],y=tt(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement($)))==null||n?$:$.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:u,rootBoundary:d,strategy:a})),m=c==="floating"?{x:i,y:s,width:o.floating.width,height:o.floating.height}:o.reference,v=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),_=await(r.isElement==null?void 0:r.isElement(v))?await(r.getScale==null?void 0:r.getScale(v))||{x:1,y:1}:{x:1,y:1},x=tt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:m,offsetParent:v,strategy:a}):m);return{top:(y.top-x.top+b.top)/_.y,bottom:(x.bottom-y.bottom+b.bottom)/_.y,left:(y.left-x.left+b.left)/_.x,right:(x.right-y.right+b.right)/_.x}}const ka=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var n,i;const{placement:s,middlewareData:r,rects:o,initialPlacement:l,platform:a,elements:u}=e,{mainAxis:d=!0,crossAxis:c=!0,fallbackPlacements:h,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:b="none",flipAlignment:$=!0,...y}=Gt(t,e);if((n=r.arrow)!=null&&n.alignmentOffset)return{};const m=me(s),v=He(l),_=me(l)===l,x=await(a.isRTL==null?void 0:a.isRTL(u.floating)),A=h||(_||!$?[gn(l)]:wa(l)),C=b!=="none";!h&&C&&A.push(...Aa(l,$,b,x));const T=[l,...A],M=await nr(e,y),S=[];let E=((i=r.flip)==null?void 0:i.overflows)||[];if(d&&S.push(M[m]),c){const w=xa(s,o,x);S.push(M[w[0]],M[w[1]])}if(E=[...E,{placement:s,overflows:S}],!S.every(w=>w<=0)){var B,q;const w=(((B=r.flip)==null?void 0:B.index)||0)+1,L=T[w];if(L)return{data:{index:w,overflows:E},reset:{placement:L}};let V=(q=E.filter(K=>K.overflows[0]<=0).sort((K,ee)=>K.overflows[1]-ee.overflows[1])[0])==null?void 0:q.placement;if(!V)switch(p){case"bestFit":{var G;const K=(G=E.filter(ee=>{if(C){const ce=He(ee.placement);return ce===v||ce==="y"}return!0}).map(ee=>[ee.placement,ee.overflows.filter(ce=>ce>0).reduce((ce,xt)=>ce+xt,0)]).sort((ee,ce)=>ee[1]-ce[1])[0])==null?void 0:G[0];K&&(V=K);break}case"initialPlacement":V=l;break}if(s!==V)return{reset:{placement:V}}}return{}}}};function ir(t){const e=et(...t.map(r=>r.left)),n=et(...t.map(r=>r.top)),i=fe(...t.map(r=>r.right)),s=fe(...t.map(r=>r.bottom));return{x:e,y:n,width:i-e,height:s-n}}function Oa(t){const e=t.slice().sort((s,r)=>s.y-r.y),n=[];let i=null;for(let s=0;s<e.length;s++){const r=e[s];!i||r.y-i.y>i.height/2?n.push([r]):n[n.length-1].push(r),i=r}return n.map(s=>tt(ir(s)))}const Ta=function(t){return t===void 0&&(t={}),{name:"inline",options:t,async fn(e){const{placement:n,elements:i,rects:s,platform:r,strategy:o}=e,{padding:l=2,x:a,y:u}=Gt(t,e),d=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(i.reference))||[]),c=Oa(d),h=tt(ir(d)),p=tr(l);function b(){if(c.length===2&&c[0].left>c[1].right&&a!=null&&u!=null)return c.find(y=>a>y.left-p.left&&a<y.right+p.right&&u>y.top-p.top&&u<y.bottom+p.bottom)||h;if(c.length>=2){if(He(n)==="y"){const E=c[0],B=c[c.length-1],q=me(n)==="top",G=E.top,w=B.bottom,L=q?E.left:B.left,V=q?E.right:B.right,K=V-L,ee=w-G;return{top:G,bottom:w,left:L,right:V,width:K,height:ee,x:L,y:G}}const y=me(n)==="left",m=fe(...c.map(E=>E.right)),v=et(...c.map(E=>E.left)),_=c.filter(E=>y?E.left===v:E.right===m),x=_[0].top,A=_[_.length-1].bottom,C=v,T=m,M=T-C,S=A-x;return{top:x,bottom:A,left:C,right:T,width:M,height:S,x:C,y:x}}return h}const $=await r.getElementRects({reference:{getBoundingClientRect:b},floating:i.floating,strategy:o});return s.reference.x!==$.reference.x||s.reference.y!==$.reference.y||s.reference.width!==$.reference.width||s.reference.height!==$.reference.height?{reset:{rects:$}}:{}}}};async function Ia(t,e){const{placement:n,platform:i,elements:s}=t,r=await(i.isRTL==null?void 0:i.isRTL(s.floating)),o=me(n),l=Nn(n),a=He(n)==="y",u=["left","top"].includes(o)?-1:1,d=r&&a?-1:1,c=Gt(e,t);let{mainAxis:h,crossAxis:p,alignmentAxis:b}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return l&&typeof b=="number"&&(p=l==="end"?b*-1:b),a?{x:p*d,y:h*u}:{x:h*u,y:p*d}}const sr=function(t){return{name:"offset",options:t,async fn(e){var n,i;const{x:s,y:r,placement:o,middlewareData:l}=e,a=await Ia(e,t);return o===((n=l.offset)==null?void 0:n.placement)&&(i=l.arrow)!=null&&i.alignmentOffset?{}:{x:s+a.x,y:r+a.y,data:{...a,placement:o}}}}},Na=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:n,y:i,placement:s}=e,{mainAxis:r=!0,crossAxis:o=!1,limiter:l={fn:y=>{let{x:m,y:v}=y;return{x:m,y:v}}},...a}=Gt(t,e),u={x:n,y:i},d=await nr(e,a),c=He(me(s)),h=Zs(c);let p=u[h],b=u[c];if(r){const y=h==="y"?"top":"left",m=h==="y"?"bottom":"right",v=p+d[y],_=p-d[m];p=Ui(v,p,_)}if(o){const y=c==="y"?"top":"left",m=c==="y"?"bottom":"right",v=b+d[y],_=b-d[m];b=Ui(v,b,_)}const $=l.fn({...e,[h]:p,[c]:b});return{...$,data:{x:$.x-n,y:$.y-i,enabled:{[h]:r,[c]:o}}}}}};function Mn(){return typeof window<"u"}function Ae(t){return rr(t)?(t.nodeName||"").toLowerCase():"#document"}function Q(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function Se(t){var e;return(e=(rr(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function rr(t){return Mn()?t instanceof Node||t instanceof Q(t).Node:!1}function ue(t){return Mn()?t instanceof Element||t instanceof Q(t).Element:!1}function de(t){return Mn()?t instanceof HTMLElement||t instanceof Q(t).HTMLElement:!1}function Wi(t){return!Mn()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof Q(t).ShadowRoot}function Yt(t){const{overflow:e,overflowX:n,overflowY:i,display:s}=ne(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+n)&&!["inline","contents"].includes(s)}function Ma(t){return["table","td","th"].includes(Ae(t))}function Pa(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function _i(t){const e=$i(),n=ue(t)?ne(t):t;return n.transform!=="none"||n.perspective!=="none"||(n.containerType?n.containerType!=="normal":!1)||!e&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!e&&(n.filter?n.filter!=="none":!1)||["transform","perspective","filter"].some(i=>(n.willChange||"").includes(i))||["paint","layout","strict","content"].some(i=>(n.contain||"").includes(i))}function Ra(t){let e=nt(t);for(;de(e)&&!Pn(e);){if(_i(e))return e;if(Pa(e))return null;e=nt(e)}return null}function $i(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Pn(t){return["html","body","#document"].includes(Ae(t))}function ne(t){return Q(t).getComputedStyle(t)}function Rn(t){return ue(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function nt(t){if(Ae(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Wi(t)&&t.host||Se(t);return Wi(e)?e.host:e}function or(t){const e=nt(t);return Pn(e)?t.ownerDocument?t.ownerDocument.body:t.body:de(e)&&Yt(e)?e:or(e)}function ar(t,e,n){var i;e===void 0&&(e=[]);const s=or(t),r=s===((i=t.ownerDocument)==null?void 0:i.body),o=Q(s);return r?(La(o),e.concat(o,o.visualViewport||[],Yt(s)?s:[],[])):e.concat(s,ar(s,[]))}function La(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function lr(t){const e=ne(t);let n=parseFloat(e.width)||0,i=parseFloat(e.height)||0;const s=de(t),r=s?t.offsetWidth:n,o=s?t.offsetHeight:i,l=bn(n)!==r||bn(i)!==o;return l&&(n=r,i=o),{width:n,height:i,$:l}}function cr(t){return ue(t)?t:t.contextElement}function Qe(t){const e=cr(t);if(!de(e))return Ce(1);const n=e.getBoundingClientRect(),{width:i,height:s,$:r}=lr(e);let o=(r?bn(n.width):n.width)/i,l=(r?bn(n.height):n.height)/s;return(!o||!Number.isFinite(o))&&(o=1),(!l||!Number.isFinite(l))&&(l=1),{x:o,y:l}}const ja=Ce(0);function ur(t){const e=Q(t);return!$i()||!e.visualViewport?ja:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function za(t,e,n){return e===void 0&&(e=!1),!n||e&&n!==Q(t)?!1:e}function Rt(t,e,n,i){e===void 0&&(e=!1),n===void 0&&(n=!1);const s=t.getBoundingClientRect(),r=cr(t);let o=Ce(1);e&&(i?ue(i)&&(o=Qe(i)):o=Qe(t));const l=za(r,n,i)?ur(r):Ce(0);let a=(s.left+l.x)/o.x,u=(s.top+l.y)/o.y,d=s.width/o.x,c=s.height/o.y;if(r){const h=Q(r),p=i&&ue(i)?Q(i):i;let b=h,$=b.frameElement;for(;$&&i&&p!==b;){const y=Qe($),m=$.getBoundingClientRect(),v=ne($),_=m.left+($.clientLeft+parseFloat(v.paddingLeft))*y.x,x=m.top+($.clientTop+parseFloat(v.paddingTop))*y.y;a*=y.x,u*=y.y,d*=y.x,c*=y.y,a+=_,u+=x,b=Q($),$=b.frameElement}}return tt({width:d,height:c,x:a,y:u})}const Da=[":popover-open",":modal"];function dr(t){return Da.some(e=>{try{return t.matches(e)}catch{return!1}})}function Ha(t){let{elements:e,rect:n,offsetParent:i,strategy:s}=t;const r=s==="fixed",o=Se(i),l=e?dr(e.floating):!1;if(i===o||l&&r)return n;let a={scrollLeft:0,scrollTop:0},u=Ce(1);const d=Ce(0),c=de(i);if((c||!c&&!r)&&((Ae(i)!=="body"||Yt(o))&&(a=Rn(i)),de(i))){const h=Rt(i);u=Qe(i),d.x=h.x+i.clientLeft,d.y=h.y+i.clientTop}return{width:n.width*u.x,height:n.height*u.y,x:n.x*u.x-a.scrollLeft*u.x+d.x,y:n.y*u.y-a.scrollTop*u.y+d.y}}function Fa(t){return Array.from(t.getClientRects())}function hr(t){return Rt(Se(t)).left+Rn(t).scrollLeft}function Ba(t){const e=Se(t),n=Rn(t),i=t.ownerDocument.body,s=fe(e.scrollWidth,e.clientWidth,i.scrollWidth,i.clientWidth),r=fe(e.scrollHeight,e.clientHeight,i.scrollHeight,i.clientHeight);let o=-n.scrollLeft+hr(t);const l=-n.scrollTop;return ne(i).direction==="rtl"&&(o+=fe(e.clientWidth,i.clientWidth)-s),{width:s,height:r,x:o,y:l}}function Ua(t,e){const n=Q(t),i=Se(t),s=n.visualViewport;let r=i.clientWidth,o=i.clientHeight,l=0,a=0;if(s){r=s.width,o=s.height;const u=$i();(!u||u&&e==="fixed")&&(l=s.offsetLeft,a=s.offsetTop)}return{width:r,height:o,x:l,y:a}}function Va(t,e){const n=Rt(t,!0,e==="fixed"),i=n.top+t.clientTop,s=n.left+t.clientLeft,r=de(t)?Qe(t):Ce(1),o=t.clientWidth*r.x,l=t.clientHeight*r.y,a=s*r.x,u=i*r.y;return{width:o,height:l,x:a,y:u}}function Gi(t,e,n){let i;if(e==="viewport")i=Ua(t,n);else if(e==="document")i=Ba(Se(t));else if(ue(e))i=Va(e,n);else{const s=ur(t);i={...e,x:e.x-s.x,y:e.y-s.y}}return tt(i)}function pr(t,e){const n=nt(t);return n===e||!ue(n)||Pn(n)?!1:ne(n).position==="fixed"||pr(n,e)}function Wa(t,e){const n=e.get(t);if(n)return n;let i=ar(t,[]).filter(l=>ue(l)&&Ae(l)!=="body"),s=null;const r=ne(t).position==="fixed";let o=r?nt(t):t;for(;ue(o)&&!Pn(o);){const l=ne(o),a=_i(o);!a&&l.position==="fixed"&&(s=null),(r?!a&&!s:!a&&l.position==="static"&&s&&["absolute","fixed"].includes(s.position)||Yt(o)&&!a&&pr(t,o))?i=i.filter(u=>u!==o):s=l,o=nt(o)}return e.set(t,i),i}function Ga(t){let{element:e,boundary:n,rootBoundary:i,strategy:s}=t;const r=[...n==="clippingAncestors"?Wa(e,this._c):[].concat(n),i],o=r[0],l=r.reduce((a,u)=>{const d=Gi(e,u,s);return a.top=fe(d.top,a.top),a.right=et(d.right,a.right),a.bottom=et(d.bottom,a.bottom),a.left=fe(d.left,a.left),a},Gi(e,o,s));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Ya(t){const{width:e,height:n}=lr(t);return{width:e,height:n}}function qa(t,e,n){const i=de(e),s=Se(e),r=n==="fixed",o=Rt(t,!0,r,e);let l={scrollLeft:0,scrollTop:0};const a=Ce(0);if(i||!i&&!r)if((Ae(e)!=="body"||Yt(s))&&(l=Rn(e)),i){const c=Rt(e,!0,r,e);a.x=c.x+e.clientLeft,a.y=c.y+e.clientTop}else s&&(a.x=hr(s));const u=o.left+l.scrollLeft-a.x,d=o.top+l.scrollTop-a.y;return{x:u,y:d,width:o.width,height:o.height}}function Yi(t,e){return!de(t)||ne(t).position==="fixed"?null:e?e(t):t.offsetParent}function fr(t,e){const n=Q(t);if(!de(t)||dr(t))return n;let i=Yi(t,e);for(;i&&Ma(i)&&ne(i).position==="static";)i=Yi(i,e);return i&&(Ae(i)==="html"||Ae(i)==="body"&&ne(i).position==="static"&&!_i(i))?n:i||Ra(t)||n}const Xa=async function(t){const e=this.getOffsetParent||fr,n=this.getDimensions;return{reference:qa(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,...await n(t.floating)}}};function Ja(t){return ne(t).direction==="rtl"}const Qa={convertOffsetParentRelativeRectToViewportRelativeRect:Ha,getDocumentElement:Se,getClippingRect:Ga,getOffsetParent:fr,getElementRects:Xa,getClientRects:Fa,getDimensions:Ya,getScale:Qe,isElement:ue,isRTL:Ja},mr=Na,br=ka,gr=Ta,yr=(t,e,n)=>{const i=new Map,s={platform:Qa,...n},r={...s.platform,_c:i};return Sa(t,e,{...s,platform:r})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dn=globalThis,xi=dn.ShadowRoot&&(dn.ShadyCSS===void 0||dn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,wi=Symbol(),qi=new WeakMap;let vr=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==wi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(xi&&t===void 0){const n=e!==void 0&&e.length===1;n&&(t=qi.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&qi.set(e,t))}return t}toString(){return this.cssText}};const Za=t=>new vr(typeof t=="string"?t:t+"",void 0,wi),I=(t,...e)=>{const n=t.length===1?t[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1],t[0]);return new vr(n,t,wi)},Ka=(t,e)=>{if(xi)t.adoptedStyleSheets=e.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of e){const i=document.createElement("style"),s=dn.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=n.cssText,t.appendChild(i)}},Xi=xi?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let n="";for(const i of e.cssRules)n+=i.cssText;return Za(n)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:el,defineProperty:tl,getOwnPropertyDescriptor:nl,getOwnPropertyNames:il,getOwnPropertySymbols:sl,getPrototypeOf:rl}=Object,it=globalThis,Ji=it.trustedTypes,ol=Ji?Ji.emptyScript:"",Qi=it.reactiveElementPolyfillSupport,Ot=(t,e)=>t,yn={toAttribute(t,e){switch(e){case Boolean:t=t?ol:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let n=t;switch(e){case Boolean:n=t!==null;break;case Number:n=t===null?null:Number(t);break;case Object:case Array:try{n=JSON.parse(t)}catch{n=null}}return n}},Ci=(t,e)=>!el(t,e),Zi={attribute:!0,type:String,converter:yn,reflect:!1,hasChanged:Ci};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),it.litPropertyMetadata??(it.litPropertyMetadata=new WeakMap);class Xe extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,n=Zi){if(n.state&&(n.attribute=!1),this._$Ei(),this.elementProperties.set(e,n),!n.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,n);s!==void 0&&tl(this.prototype,e,s)}}static getPropertyDescriptor(e,n,i){const{get:s,set:r}=nl(this.prototype,e)??{get(){return this[n]},set(o){this[n]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);r.call(this,o),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Zi}static _$Ei(){if(this.hasOwnProperty(Ot("elementProperties")))return;const e=rl(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ot("properties"))){const n=this.properties,i=[...il(n),...sl(n)];for(const s of i)this.createProperty(s,n[s])}const e=this[Symbol.metadata];if(e!==null){const n=litPropertyMetadata.get(e);if(n!==void 0)for(const[i,s]of n)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[n,i]of this.elementProperties){const s=this._$Eu(n,i);s!==void 0&&this._$Eh.set(s,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const n=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const s of i)n.unshift(Xi(s))}else e!==void 0&&n.push(Xi(e));return n}static _$Eu(e,n){const i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(n=>n(this))}addController(e){var n;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((n=e.hostConnected)==null||n.call(e))}removeController(e){var n;(n=this._$EO)==null||n.delete(e)}_$E_(){const e=new Map,n=this.constructor.elementProperties;for(const i of n.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ka(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(n=>{var i;return(i=n.hostConnected)==null?void 0:i.call(n)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(n=>{var i;return(i=n.hostDisconnected)==null?void 0:i.call(n)})}attributeChangedCallback(e,n,i){this._$AK(e,i)}_$EC(e,n){var i;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:yn).toAttribute(n,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,n){var i;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)==null?void 0:i.fromAttribute)!==void 0?o.converter:yn;this._$Em=r,this[r]=l.fromAttribute(n,o.type),this._$Em=null}}requestUpdate(e,n,i){if(e!==void 0){if(i??(i=this.constructor.getPropertyOptions(e)),!(i.hasChanged??Ci)(this[e],n))return;this.P(e,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,n,i){this._$AL.has(e)||this._$AL.set(e,n),i.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let n=!1;const i=this._$AL;try{n=this.shouldUpdate(i),n?(this.willUpdate(i),(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(i)):this._$EU()}catch(s){throw n=!1,this._$EU(),s}n&&this._$AE(i)}willUpdate(e){}_$AE(e){var n;(n=this._$EO)==null||n.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(n=>this._$EC(n,this[n]))),this._$EU()}updated(e){}firstUpdated(e){}}Xe.elementStyles=[],Xe.shadowRootOptions={mode:"open"},Xe[Ot("elementProperties")]=new Map,Xe[Ot("finalized")]=new Map,Qi==null||Qi({ReactiveElement:Xe}),(it.reactiveElementVersions??(it.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vn=globalThis,_n=vn.trustedTypes,Ki=_n?_n.createPolicy("lit-html",{createHTML:t=>t}):void 0,_r="$lit$",xe=`lit$${Math.random().toFixed(9).slice(2)}$`,$r="?"+xe,al=`<${$r}>`,Fe=document,Lt=()=>Fe.createComment(""),jt=t=>t===null||typeof t!="object"&&typeof t!="function",Ai=Array.isArray,ll=t=>Ai(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",qn=`[ 	
\f\r]`,At=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,es=/-->/g,ts=/>/g,Me=RegExp(`>|${qn}(?:([^\\s"'>=/]+)(${qn}*=${qn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ns=/'/g,is=/"/g,xr=/^(?:script|style|textarea|title)$/i,cl=t=>(e,...n)=>({_$litType$:t,strings:e,values:n}),f=cl(1),Be=Symbol.for("lit-noChange"),R=Symbol.for("lit-nothing"),ss=new WeakMap,Re=Fe.createTreeWalker(Fe,129);function wr(t,e){if(!Ai(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ki!==void 0?Ki.createHTML(e):e}const ul=(t,e)=>{const n=t.length-1,i=[];let s,r=e===2?"<svg>":e===3?"<math>":"",o=At;for(let l=0;l<n;l++){const a=t[l];let u,d,c=-1,h=0;for(;h<a.length&&(o.lastIndex=h,d=o.exec(a),d!==null);)h=o.lastIndex,o===At?d[1]==="!--"?o=es:d[1]!==void 0?o=ts:d[2]!==void 0?(xr.test(d[2])&&(s=RegExp("</"+d[2],"g")),o=Me):d[3]!==void 0&&(o=Me):o===Me?d[0]===">"?(o=s??At,c=-1):d[1]===void 0?c=-2:(c=o.lastIndex-d[2].length,u=d[1],o=d[3]===void 0?Me:d[3]==='"'?is:ns):o===is||o===ns?o=Me:o===es||o===ts?o=At:(o=Me,s=void 0);const p=o===Me&&t[l+1].startsWith("/>")?" ":"";r+=o===At?a+al:c>=0?(i.push(u),a.slice(0,c)+_r+a.slice(c)+xe+p):a+xe+(c===-2?l:p)}return[wr(t,r+(t[n]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class zt{constructor({strings:e,_$litType$:n},i){let s;this.parts=[];let r=0,o=0;const l=e.length-1,a=this.parts,[u,d]=ul(e,n);if(this.el=zt.createElement(u,i),Re.currentNode=this.el.content,n===2||n===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=Re.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(_r)){const h=d[o++],p=s.getAttribute(c).split(xe),b=/([.?@])?(.*)/.exec(h);a.push({type:1,index:r,name:b[2],strings:p,ctor:b[1]==="."?hl:b[1]==="?"?pl:b[1]==="@"?fl:Ln}),s.removeAttribute(c)}else c.startsWith(xe)&&(a.push({type:6,index:r}),s.removeAttribute(c));if(xr.test(s.tagName)){const c=s.textContent.split(xe),h=c.length-1;if(h>0){s.textContent=_n?_n.emptyScript:"";for(let p=0;p<h;p++)s.append(c[p],Lt()),Re.nextNode(),a.push({type:2,index:++r});s.append(c[h],Lt())}}}else if(s.nodeType===8)if(s.data===$r)a.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(xe,c+1))!==-1;)a.push({type:7,index:r}),c+=xe.length-1}r++}}static createElement(e,n){const i=Fe.createElement("template");return i.innerHTML=e,i}}function st(t,e,n=t,i){var s,r;if(e===Be)return e;let o=i!==void 0?(s=n._$Co)==null?void 0:s[i]:n._$Cl;const l=jt(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((r=o==null?void 0:o._$AO)==null||r.call(o,!1),l===void 0?o=void 0:(o=new l(t),o._$AT(t,n,i)),i!==void 0?(n._$Co??(n._$Co=[]))[i]=o:n._$Cl=o),o!==void 0&&(e=st(t,o._$AS(t,e.values),o,i)),e}class dl{constructor(e,n){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:n},parts:i}=this._$AD,s=((e==null?void 0:e.creationScope)??Fe).importNode(n,!0);Re.currentNode=s;let r=Re.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new qt(r,r.nextSibling,this,e):a.type===1?u=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(u=new ml(r,this,e)),this._$AV.push(u),a=i[++l]}o!==(a==null?void 0:a.index)&&(r=Re.nextNode(),o++)}return Re.currentNode=Fe,s}p(e){let n=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,n),n+=i.strings.length-2):i._$AI(e[n])),n++}}class qt{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,n,i,s){this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=e,this._$AB=n,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=n.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,n=this){e=st(this,e,n),jt(e)?e===R||e==null||e===""?(this._$AH!==R&&this._$AR(),this._$AH=R):e!==this._$AH&&e!==Be&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ll(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==R&&jt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Fe.createTextNode(e)),this._$AH=e}$(e){var n;const{values:i,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=zt.createElement(wr(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(i);else{const o=new dl(r,this),l=o.u(this.options);o.p(i),this.T(l),this._$AH=o}}_$AC(e){let n=ss.get(e.strings);return n===void 0&&ss.set(e.strings,n=new zt(e)),n}k(e){Ai(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let i,s=0;for(const r of e)s===n.length?n.push(i=new qt(this.O(Lt()),this.O(Lt()),this,this.options)):i=n[s],i._$AI(r),s++;s<n.length&&(this._$AR(i&&i._$AB.nextSibling,s),n.length=s)}_$AR(e=this._$AA.nextSibling,n){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,n);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var n;this._$AM===void 0&&(this._$Cv=e,(n=this._$AP)==null||n.call(this,e))}}class Ln{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,n,i,s,r){this.type=1,this._$AH=R,this._$AN=void 0,this.element=e,this.name=n,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=R}_$AI(e,n=this,i,s){const r=this.strings;let o=!1;if(r===void 0)e=st(this,e,n,0),o=!jt(e)||e!==this._$AH&&e!==Be,o&&(this._$AH=e);else{const l=e;let a,u;for(e=r[0],a=0;a<r.length-1;a++)u=st(this,l[i+a],n,a),u===Be&&(u=this._$AH[a]),o||(o=!jt(u)||u!==this._$AH[a]),u===R?e=R:e!==R&&(e+=(u??"")+r[a+1]),this._$AH[a]=u}o&&!s&&this.j(e)}j(e){e===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class hl extends Ln{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===R?void 0:e}}class pl extends Ln{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==R)}}class fl extends Ln{constructor(e,n,i,s,r){super(e,n,i,s,r),this.type=5}_$AI(e,n=this){if((e=st(this,e,n,0)??R)===Be)return;const i=this._$AH,s=e===R&&i!==R||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==R&&(i===R||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var n;typeof this._$AH=="function"?this._$AH.call(((n=this.options)==null?void 0:n.host)??this.element,e):this._$AH.handleEvent(e)}}class ml{constructor(e,n,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){st(this,e)}}const rs=vn.litHtmlPolyfillSupport;rs==null||rs(zt,qt),(vn.litHtmlVersions??(vn.litHtmlVersions=[])).push("3.2.1");const rt=(t,e,n)=>{const i=(n==null?void 0:n.renderBefore)??e;let s=i._$litPart$;if(s===void 0){const r=(n==null?void 0:n.renderBefore)??null;i._$litPart$=s=new qt(e.insertBefore(Lt(),r),r,void 0,n??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends Xe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=rt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Be}};var os;O._$litElement$=!0,O.finalized=!0,(os=globalThis.litElementHydrateSupport)==null||os.call(globalThis,{LitElement:O});const as=globalThis.litElementPolyfillSupport;as==null||as({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bl={attribute:!0,type:String,converter:yn,reflect:!1,hasChanged:Ci},gl=(t=bl,e,n)=>{const{kind:i,metadata:s}=n;let r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),r.set(n.name,t),i==="accessor"){const{name:o}=n;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,t)},init(l){return l!==void 0&&this.P(o,void 0,t),l}}}if(i==="setter"){const{name:o}=n;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,t)}}throw Error("Unsupported decorator location: "+i)};function g(t){return(e,n)=>typeof n=="object"?gl(t,e,n):((i,s,r)=>{const o=s.hasOwnProperty(r);return s.constructor.createProperty(r,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(t,e,n)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return g({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yl=t=>t.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Cr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ar=t=>(...e)=>({_$litDirective$:t,values:e});let Er=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=(t,e)=>{var n;const i=t._$AN;if(i===void 0)return!1;for(const s of i)(n=s._$AO)==null||n.call(s,e,!1),Tt(s,e);return!0},$n=t=>{let e,n;do{if((e=t._$AM)===void 0)break;n=e._$AN,n.delete(t),t=e}while((n==null?void 0:n.size)===0)},Sr=t=>{for(let e;e=t._$AM;t=e){let n=e._$AN;if(n===void 0)e._$AN=n=new Set;else if(n.has(t))break;n.add(t),$l(e)}};function vl(t){this._$AN!==void 0?($n(this),this._$AM=t,Sr(this)):this._$AM=t}function _l(t,e=!1,n=0){const i=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(i))for(let r=n;r<i.length;r++)Tt(i[r],!1),$n(i[r]);else i!=null&&(Tt(i,!1),$n(i));else Tt(this,t)}const $l=t=>{t.type==Cr.CHILD&&(t._$AP??(t._$AP=_l),t._$AQ??(t._$AQ=vl))};class xl extends Er{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,n,i){super._$AT(e,n,i),Sr(this),this.isConnected=e._$AU}_$AO(e,n=!0){var i,s;e!==this.isConnected&&(this.isConnected=e,e?(i=this.reconnected)==null||i.call(this):(s=this.disconnected)==null||s.call(this)),n&&(Tt(this,e),$n(this))}setValue(e){if(yl(this._$Ct))this._$Ct._$AI(e,this);else{const n=[...this._$Ct._$AH];n[this._$Ci]=e,this._$Ct._$AI(n,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ot=()=>new wl;class wl{}const Xn=new WeakMap,Y=Ar(class extends xl{render(t){return R}update(t,[e]){var n;const i=e!==this.Y;return i&&this.Y!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.Y=e,this.ht=(n=t.options)==null?void 0:n.host,this.rt(this.ct=t.element)),R}rt(t){if(this.isConnected||(t=void 0),typeof this.Y=="function"){const e=this.ht??globalThis;let n=Xn.get(e);n===void 0&&(n=new WeakMap,Xn.set(e,n)),n.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),n.set(this.Y,t),t!==void 0&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){var t,e;return typeof this.Y=="function"?(t=Xn.get(this.ht??globalThis))==null?void 0:t.get(this.Y):(e=this.Y)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const kr=Object.freeze({left:0,top:0,width:16,height:16}),xn=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Xt=Object.freeze({...kr,...xn}),ii=Object.freeze({...Xt,body:"",hidden:!1}),Cl=Object.freeze({width:null,height:null}),Or=Object.freeze({...Cl,...xn});function Al(t,e=0){const n=t.replace(/^-?[0-9.]*/,"");function i(s){for(;s<0;)s+=4;return s%4}if(n===""){const s=parseInt(t);return isNaN(s)?0:i(s)}else if(n!==t){let s=0;switch(n){case"%":s=25;break;case"deg":s=90}if(s){let r=parseFloat(t.slice(0,t.length-n.length));return isNaN(r)?0:(r=r/s,r%1===0?i(r):0)}}return e}const El=/[\s,]+/;function Sl(t,e){e.split(El).forEach(n=>{switch(n.trim()){case"horizontal":t.hFlip=!0;break;case"vertical":t.vFlip=!0;break}})}const Tr={...Or,preserveAspectRatio:""};function ls(t){const e={...Tr},n=(i,s)=>t.getAttribute(i)||s;return e.width=n("width",null),e.height=n("height",null),e.rotate=Al(n("rotate","")),Sl(e,n("flip","")),e.preserveAspectRatio=n("preserveAspectRatio",n("preserveaspectratio","")),e}function kl(t,e){for(const n in Tr)if(t[n]!==e[n])return!0;return!1}const It=/^[a-z0-9]+(-[a-z0-9]+)*$/,Jt=(t,e,n,i="")=>{const s=t.split(":");if(t.slice(0,1)==="@"){if(s.length<2||s.length>3)return null;i=s.shift().slice(1)}if(s.length>3||!s.length)return null;if(s.length>1){const l=s.pop(),a=s.pop(),u={provider:s.length>0?s[0]:i,prefix:a,name:l};return e&&!hn(u)?null:u}const r=s[0],o=r.split("-");if(o.length>1){const l={provider:i,prefix:o.shift(),name:o.join("-")};return e&&!hn(l)?null:l}if(n&&i===""){const l={provider:i,prefix:"",name:r};return e&&!hn(l,n)?null:l}return null},hn=(t,e)=>t?!!((t.provider===""||t.provider.match(It))&&(e&&t.prefix===""||t.prefix.match(It))&&t.name.match(It)):!1;function Ol(t,e){const n={};!t.hFlip!=!e.hFlip&&(n.hFlip=!0),!t.vFlip!=!e.vFlip&&(n.vFlip=!0);const i=((t.rotate||0)+(e.rotate||0))%4;return i&&(n.rotate=i),n}function cs(t,e){const n=Ol(t,e);for(const i in ii)i in xn?i in t&&!(i in n)&&(n[i]=xn[i]):i in e?n[i]=e[i]:i in t&&(n[i]=t[i]);return n}function Tl(t,e){const n=t.icons,i=t.aliases||Object.create(null),s=Object.create(null);function r(o){if(n[o])return s[o]=[];if(!(o in s)){s[o]=null;const l=i[o]&&i[o].parent,a=l&&r(l);a&&(s[o]=[l].concat(a))}return s[o]}return Object.keys(n).concat(Object.keys(i)).forEach(r),s}function Il(t,e,n){const i=t.icons,s=t.aliases||Object.create(null);let r={};function o(l){r=cs(i[l]||s[l],r)}return o(e),n.forEach(o),cs(t,r)}function Ir(t,e){const n=[];if(typeof t!="object"||typeof t.icons!="object")return n;t.not_found instanceof Array&&t.not_found.forEach(s=>{e(s,null),n.push(s)});const i=Tl(t);for(const s in i){const r=i[s];r&&(e(s,Il(t,s,r)),n.push(s))}return n}const Nl={provider:"",aliases:{},not_found:{},...kr};function Jn(t,e){for(const n in e)if(n in t&&typeof t[n]!=typeof e[n])return!1;return!0}function Nr(t){if(typeof t!="object"||t===null)return null;const e=t;if(typeof e.prefix!="string"||!t.icons||typeof t.icons!="object"||!Jn(t,Nl))return null;const n=e.icons;for(const s in n){const r=n[s];if(!s.match(It)||typeof r.body!="string"||!Jn(r,ii))return null}const i=e.aliases||Object.create(null);for(const s in i){const r=i[s],o=r.parent;if(!s.match(It)||typeof o!="string"||!n[o]&&!i[o]||!Jn(r,ii))return null}return e}const wn=Object.create(null);function Ml(t,e){return{provider:t,prefix:e,icons:Object.create(null),missing:new Set}}function Ee(t,e){const n=wn[t]||(wn[t]=Object.create(null));return n[e]||(n[e]=Ml(t,e))}function Ei(t,e){return Nr(e)?Ir(e,(n,i)=>{i?t.icons[n]=i:t.missing.add(n)}):[]}function Pl(t,e,n){try{if(typeof n.body=="string")return t.icons[e]={...n},!0}catch{}return!1}function Rl(t,e){let n=[];return(typeof t=="string"?[t]:Object.keys(wn)).forEach(i=>{(typeof i=="string"&&typeof e=="string"?[e]:Object.keys(wn[i]||{})).forEach(s=>{const r=Ee(i,s);n=n.concat(Object.keys(r.icons).map(o=>(i!==""?"@"+i+":":"")+s+":"+o))})}),n}let Dt=!1;function Mr(t){return typeof t=="boolean"&&(Dt=t),Dt}function Ht(t){const e=typeof t=="string"?Jt(t,!0,Dt):t;if(e){const n=Ee(e.provider,e.prefix),i=e.name;return n.icons[i]||(n.missing.has(i)?null:void 0)}}function Pr(t,e){const n=Jt(t,!0,Dt);if(!n)return!1;const i=Ee(n.provider,n.prefix);return Pl(i,n.name,e)}function us(t,e){if(typeof t!="object")return!1;if(typeof e!="string"&&(e=t.provider||""),Dt&&!e&&!t.prefix){let s=!1;return Nr(t)&&(t.prefix="",Ir(t,(r,o)=>{o&&Pr(r,o)&&(s=!0)})),s}const n=t.prefix;if(!hn({provider:e,prefix:n,name:"a"}))return!1;const i=Ee(e,n);return!!Ei(i,t)}function ds(t){return!!Ht(t)}function Ll(t){const e=Ht(t);return e?{...Xt,...e}:null}function jl(t){const e={loaded:[],missing:[],pending:[]},n=Object.create(null);t.sort((s,r)=>s.provider!==r.provider?s.provider.localeCompare(r.provider):s.prefix!==r.prefix?s.prefix.localeCompare(r.prefix):s.name.localeCompare(r.name));let i={provider:"",prefix:"",name:""};return t.forEach(s=>{if(i.name===s.name&&i.prefix===s.prefix&&i.provider===s.provider)return;i=s;const r=s.provider,o=s.prefix,l=s.name,a=n[r]||(n[r]=Object.create(null)),u=a[o]||(a[o]=Ee(r,o));let d;l in u.icons?d=e.loaded:o===""||u.missing.has(l)?d=e.missing:d=e.pending;const c={provider:r,prefix:o,name:l};d.push(c)}),e}function Rr(t,e){t.forEach(n=>{const i=n.loaderCallbacks;i&&(n.loaderCallbacks=i.filter(s=>s.id!==e))})}function zl(t){t.pendingCallbacksFlag||(t.pendingCallbacksFlag=!0,setTimeout(()=>{t.pendingCallbacksFlag=!1;const e=t.loaderCallbacks?t.loaderCallbacks.slice(0):[];if(!e.length)return;let n=!1;const i=t.provider,s=t.prefix;e.forEach(r=>{const o=r.icons,l=o.pending.length;o.pending=o.pending.filter(a=>{if(a.prefix!==s)return!0;const u=a.name;if(t.icons[u])o.loaded.push({provider:i,prefix:s,name:u});else if(t.missing.has(u))o.missing.push({provider:i,prefix:s,name:u});else return n=!0,!0;return!1}),o.pending.length!==l&&(n||Rr([t],r.id),r.callback(o.loaded.slice(0),o.missing.slice(0),o.pending.slice(0),r.abort))})}))}let Dl=0;function Hl(t,e,n){const i=Dl++,s=Rr.bind(null,n,i);if(!e.pending.length)return s;const r={id:i,icons:e,callback:t,abort:s};return n.forEach(o=>{(o.loaderCallbacks||(o.loaderCallbacks=[])).push(r)}),s}const si=Object.create(null);function hs(t,e){si[t]=e}function ri(t){return si[t]||si[""]}function Fl(t,e=!0,n=!1){const i=[];return t.forEach(s=>{const r=typeof s=="string"?Jt(s,e,n):s;r&&i.push(r)}),i}var Bl={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function Ul(t,e,n,i){const s=t.resources.length,r=t.random?Math.floor(Math.random()*s):t.index;let o;if(t.random){let C=t.resources.slice(0);for(o=[];C.length>1;){const T=Math.floor(Math.random()*C.length);o.push(C[T]),C=C.slice(0,T).concat(C.slice(T+1))}o=o.concat(C)}else o=t.resources.slice(r).concat(t.resources.slice(0,r));const l=Date.now();let a="pending",u=0,d,c=null,h=[],p=[];typeof i=="function"&&p.push(i);function b(){c&&(clearTimeout(c),c=null)}function $(){a==="pending"&&(a="aborted"),b(),h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function y(C,T){T&&(p=[]),typeof C=="function"&&p.push(C)}function m(){return{startTime:l,payload:e,status:a,queriesSent:u,queriesPending:h.length,subscribe:y,abort:$}}function v(){a="failed",p.forEach(C=>{C(void 0,d)})}function _(){h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function x(C,T,M){const S=T!=="success";switch(h=h.filter(E=>E!==C),a){case"pending":break;case"failed":if(S||!t.dataAfterTimeout)return;break;default:return}if(T==="abort"){d=M,v();return}if(S){d=M,h.length||(o.length?A():v());return}if(b(),_(),!t.random){const E=t.resources.indexOf(C.resource);E!==-1&&E!==t.index&&(t.index=E)}a="completed",p.forEach(E=>{E(M)})}function A(){if(a!=="pending")return;b();const C=o.shift();if(C===void 0){if(h.length){c=setTimeout(()=>{b(),a==="pending"&&(_(),v())},t.timeout);return}v();return}const T={status:"pending",resource:C,callback:(M,S)=>{x(T,M,S)}};h.push(T),u++,c=setTimeout(A,t.rotate),n(C,e,T.callback)}return setTimeout(A),m}function Lr(t){const e={...Bl,...t};let n=[];function i(){n=n.filter(o=>o().status==="pending")}function s(o,l,a){const u=Ul(e,o,l,(d,c)=>{i(),a&&a(d,c)});return n.push(u),u}function r(o){return n.find(l=>o(l))||null}return{query:s,find:r,setIndex:o=>{e.index=o},getIndex:()=>e.index,cleanup:i}}function Si(t){let e;if(typeof t.resources=="string")e=[t.resources];else if(e=t.resources,!(e instanceof Array)||!e.length)return null;return{resources:e,path:t.path||"/",maxURL:t.maxURL||500,rotate:t.rotate||750,timeout:t.timeout||5e3,random:t.random===!0,index:t.index||0,dataAfterTimeout:t.dataAfterTimeout!==!1}}const jn=Object.create(null),ln=["https://api.simplesvg.com","https://api.unisvg.com"],oi=[];for(;ln.length>0;)ln.length===1||Math.random()>.5?oi.push(ln.shift()):oi.push(ln.pop());jn[""]=Si({resources:["https://api.iconify.design"].concat(oi)});function ps(t,e){const n=Si(e);return n===null?!1:(jn[t]=n,!0)}function zn(t){return jn[t]}function Vl(){return Object.keys(jn)}function fs(){}const Qn=Object.create(null);function Wl(t){if(!Qn[t]){const e=zn(t);if(!e)return;const n=Lr(e),i={config:e,redundancy:n};Qn[t]=i}return Qn[t]}function jr(t,e,n){let i,s;if(typeof t=="string"){const r=ri(t);if(!r)return n(void 0,424),fs;s=r.send;const o=Wl(t);o&&(i=o.redundancy)}else{const r=Si(t);if(r){i=Lr(r);const o=t.resources?t.resources[0]:"",l=ri(o);l&&(s=l.send)}}return!i||!s?(n(void 0,424),fs):i.query(e,s,n)().abort}const ms="iconify2",Ft="iconify",zr=Ft+"-count",bs=Ft+"-version",Dr=36e5,Gl=168,Yl=50;function ai(t,e){try{return t.getItem(e)}catch{}}function ki(t,e,n){try{return t.setItem(e,n),!0}catch{}}function gs(t,e){try{t.removeItem(e)}catch{}}function li(t,e){return ki(t,zr,e.toString())}function ci(t){return parseInt(ai(t,zr))||0}const je={local:!0,session:!0},Hr={local:new Set,session:new Set};let Oi=!1;function ql(t){Oi=t}let cn=typeof window>"u"?{}:window;function Fr(t){const e=t+"Storage";try{if(cn&&cn[e]&&typeof cn[e].length=="number")return cn[e]}catch{}je[t]=!1}function Br(t,e){const n=Fr(t);if(!n)return;const i=ai(n,bs);if(i!==ms){if(i){const l=ci(n);for(let a=0;a<l;a++)gs(n,Ft+a.toString())}ki(n,bs,ms),li(n,0);return}const s=Math.floor(Date.now()/Dr)-Gl,r=l=>{const a=Ft+l.toString(),u=ai(n,a);if(typeof u=="string"){try{const d=JSON.parse(u);if(typeof d=="object"&&typeof d.cached=="number"&&d.cached>s&&typeof d.provider=="string"&&typeof d.data=="object"&&typeof d.data.prefix=="string"&&e(d,l))return!0}catch{}gs(n,a)}};let o=ci(n);for(let l=o-1;l>=0;l--)r(l)||(l===o-1?(o--,li(n,o)):Hr[t].add(l))}function Ur(){if(!Oi){ql(!0);for(const t in je)Br(t,e=>{const n=e.data,i=e.provider,s=n.prefix,r=Ee(i,s);if(!Ei(r,n).length)return!1;const o=n.lastModified||-1;return r.lastModifiedCached=r.lastModifiedCached?Math.min(r.lastModifiedCached,o):o,!0})}}function Xl(t,e){const n=t.lastModifiedCached;if(n&&n>=e)return n===e;if(t.lastModifiedCached=e,n)for(const i in je)Br(i,s=>{const r=s.data;return s.provider!==t.provider||r.prefix!==t.prefix||r.lastModified===e});return!0}function Jl(t,e){Oi||Ur();function n(i){let s;if(!je[i]||!(s=Fr(i)))return;const r=Hr[i];let o;if(r.size)r.delete(o=Array.from(r).shift());else if(o=ci(s),o>=Yl||!li(s,o+1))return;const l={cached:Math.floor(Date.now()/Dr),provider:t.provider,data:e};return ki(s,Ft+o.toString(),JSON.stringify(l))}e.lastModified&&!Xl(t,e.lastModified)||Object.keys(e.icons).length&&(e.not_found&&(e=Object.assign({},e),delete e.not_found),n("local")||n("session"))}function ys(){}function Ql(t){t.iconsLoaderFlag||(t.iconsLoaderFlag=!0,setTimeout(()=>{t.iconsLoaderFlag=!1,zl(t)}))}function Zl(t,e){t.iconsToLoad?t.iconsToLoad=t.iconsToLoad.concat(e).sort():t.iconsToLoad=e,t.iconsQueueFlag||(t.iconsQueueFlag=!0,setTimeout(()=>{t.iconsQueueFlag=!1;const{provider:n,prefix:i}=t,s=t.iconsToLoad;delete t.iconsToLoad;let r;!s||!(r=ri(n))||r.prepare(n,i,s).forEach(o=>{jr(n,o,l=>{if(typeof l!="object")o.icons.forEach(a=>{t.missing.add(a)});else try{const a=Ei(t,l);if(!a.length)return;const u=t.pendingIcons;u&&a.forEach(d=>{u.delete(d)}),Jl(t,l)}catch(a){console.error(a)}Ql(t)})})}))}const Ti=(t,e)=>{const n=Fl(t,!0,Mr()),i=jl(n);if(!i.pending.length){let a=!0;return e&&setTimeout(()=>{a&&e(i.loaded,i.missing,i.pending,ys)}),()=>{a=!1}}const s=Object.create(null),r=[];let o,l;return i.pending.forEach(a=>{const{provider:u,prefix:d}=a;if(d===l&&u===o)return;o=u,l=d,r.push(Ee(u,d));const c=s[u]||(s[u]=Object.create(null));c[d]||(c[d]=[])}),i.pending.forEach(a=>{const{provider:u,prefix:d,name:c}=a,h=Ee(u,d),p=h.pendingIcons||(h.pendingIcons=new Set);p.has(c)||(p.add(c),s[u][d].push(c))}),r.forEach(a=>{const{provider:u,prefix:d}=a;s[u][d].length&&Zl(a,s[u][d])}),e?Hl(e,i,r):ys},Kl=t=>new Promise((e,n)=>{const i=typeof t=="string"?Jt(t,!0):t;if(!i){n(t);return}Ti([i||t],s=>{if(s.length&&i){const r=Ht(i);if(r){e({...Xt,...r});return}}n(t)})});function ec(t){try{const e=typeof t=="string"?JSON.parse(t):t;if(typeof e.body=="string")return{...e}}catch{}}function tc(t,e){const n=typeof t=="string"?Jt(t,!0,!0):null;if(!n){const r=ec(t);return{value:t,data:r}}const i=Ht(n);if(i!==void 0||!n.prefix)return{value:t,name:n,data:i};const s=Ti([n],()=>e(t,n,Ht(n)));return{value:t,name:n,loading:s}}function Zn(t){return t.hasAttribute("inline")}let Vr=!1;try{Vr=navigator.vendor.indexOf("Apple")===0}catch{}function nc(t,e){switch(e){case"svg":case"bg":case"mask":return e}return e!=="style"&&(Vr||t.indexOf("<a")===-1)?"svg":t.indexOf("currentColor")===-1?"bg":"mask"}const ic=/(-?[0-9.]*[0-9]+[0-9.]*)/g,sc=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ui(t,e,n){if(e===1)return t;if(n=n||100,typeof t=="number")return Math.ceil(t*e*n)/n;if(typeof t!="string")return t;const i=t.split(ic);if(i===null||!i.length)return t;const s=[];let r=i.shift(),o=sc.test(r);for(;;){if(o){const l=parseFloat(r);isNaN(l)?s.push(r):s.push(Math.ceil(l*e*n)/n)}else s.push(r);if(r=i.shift(),r===void 0)return s.join("");o=!o}}function rc(t,e="defs"){let n="";const i=t.indexOf("<"+e);for(;i>=0;){const s=t.indexOf(">",i),r=t.indexOf("</"+e);if(s===-1||r===-1)break;const o=t.indexOf(">",r);if(o===-1)break;n+=t.slice(s+1,r).trim(),t=t.slice(0,i).trim()+t.slice(o+1)}return{defs:n,content:t}}function oc(t,e){return t?"<defs>"+t+"</defs>"+e:e}function ac(t,e,n){const i=rc(t);return oc(i.defs,e+i.content+n)}const lc=t=>t==="unset"||t==="undefined"||t==="none";function Wr(t,e){const n={...Xt,...t},i={...Or,...e},s={left:n.left,top:n.top,width:n.width,height:n.height};let r=n.body;[n,i].forEach($=>{const y=[],m=$.hFlip,v=$.vFlip;let _=$.rotate;m?v?_+=2:(y.push("translate("+(s.width+s.left).toString()+" "+(0-s.top).toString()+")"),y.push("scale(-1 1)"),s.top=s.left=0):v&&(y.push("translate("+(0-s.left).toString()+" "+(s.height+s.top).toString()+")"),y.push("scale(1 -1)"),s.top=s.left=0);let x;switch(_<0&&(_-=Math.floor(_/4)*4),_=_%4,_){case 1:x=s.height/2+s.top,y.unshift("rotate(90 "+x.toString()+" "+x.toString()+")");break;case 2:y.unshift("rotate(180 "+(s.width/2+s.left).toString()+" "+(s.height/2+s.top).toString()+")");break;case 3:x=s.width/2+s.left,y.unshift("rotate(-90 "+x.toString()+" "+x.toString()+")");break}_%2===1&&(s.left!==s.top&&(x=s.left,s.left=s.top,s.top=x),s.width!==s.height&&(x=s.width,s.width=s.height,s.height=x)),y.length&&(r=ac(r,'<g transform="'+y.join(" ")+'">',"</g>"))});const o=i.width,l=i.height,a=s.width,u=s.height;let d,c;o===null?(c=l===null?"1em":l==="auto"?u:l,d=ui(c,a/u)):(d=o==="auto"?a:o,c=l===null?ui(d,u/a):l==="auto"?u:l);const h={},p=($,y)=>{lc(y)||(h[$]=y.toString())};p("width",d),p("height",c);const b=[s.left,s.top,a,u];return h.viewBox=b.join(" "),{attributes:h,viewBox:b,body:r}}function Ii(t,e){let n=t.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const i in e)n+=" "+i+'="'+e[i]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+n+">"+t+"</svg>"}function cc(t){return t.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function uc(t){return"data:image/svg+xml,"+cc(t)}function Gr(t){return'url("'+uc(t)+'")'}const dc=()=>{let t;try{if(t=fetch,typeof t=="function")return t}catch{}};let Cn=dc();function hc(t){Cn=t}function pc(){return Cn}function fc(t,e){const n=zn(t);if(!n)return 0;let i;if(!n.maxURL)i=0;else{let s=0;n.resources.forEach(o=>{s=Math.max(s,o.length)});const r=e+".json?icons=";i=n.maxURL-s-n.path.length-r.length}return i}function mc(t){return t===404}const bc=(t,e,n)=>{const i=[],s=fc(t,e),r="icons";let o={type:r,provider:t,prefix:e,icons:[]},l=0;return n.forEach((a,u)=>{l+=a.length+1,l>=s&&u>0&&(i.push(o),o={type:r,provider:t,prefix:e,icons:[]},l=a.length),o.icons.push(a)}),i.push(o),i};function gc(t){if(typeof t=="string"){const e=zn(t);if(e)return e.path}return"/"}const yc=(t,e,n)=>{if(!Cn){n("abort",424);return}let i=gc(e.provider);switch(e.type){case"icons":{const r=e.prefix,o=e.icons.join(","),l=new URLSearchParams({icons:o});i+=r+".json?"+l.toString();break}case"custom":{const r=e.uri;i+=r.slice(0,1)==="/"?r.slice(1):r;break}default:n("abort",400);return}let s=503;Cn(t+i).then(r=>{const o=r.status;if(o!==200){setTimeout(()=>{n(mc(o)?"abort":"next",o)});return}return s=501,r.json()}).then(r=>{if(typeof r!="object"||r===null){setTimeout(()=>{r===404?n("abort",r):n("next",s)});return}setTimeout(()=>{n("success",r)})}).catch(()=>{n("next",s)})},vc={prepare:bc,send:yc};function vs(t,e){switch(t){case"local":case"session":je[t]=e;break;case"all":for(const n in je)je[n]=e;break}}const Kn="data-style";let Yr="";function _c(t){Yr=t}function _s(t,e){let n=Array.from(t.childNodes).find(i=>i.hasAttribute&&i.hasAttribute(Kn));n||(n=document.createElement("style"),n.setAttribute(Kn,Kn),t.appendChild(n)),n.textContent=":host{display:inline-block;vertical-align:"+(e?"-0.125em":"0")+"}span,svg{display:block}"+Yr}function qr(){hs("",vc),Mr(!0);let t;try{t=window}catch{}if(t){if(Ur(),t.IconifyPreload!==void 0){const e=t.IconifyPreload,n="Invalid IconifyPreload syntax.";typeof e=="object"&&e!==null&&(e instanceof Array?e:[e]).forEach(i=>{try{(typeof i!="object"||i===null||i instanceof Array||typeof i.icons!="object"||typeof i.prefix!="string"||!us(i))&&console.error(n)}catch{console.error(n)}})}if(t.IconifyProviders!==void 0){const e=t.IconifyProviders;if(typeof e=="object"&&e!==null)for(const n in e){const i="IconifyProviders["+n+"] is invalid.";try{const s=e[n];if(typeof s!="object"||!s||s.resources===void 0)continue;ps(n,s)||console.error(i)}catch{console.error(i)}}}}return{enableCache:e=>vs(e,!0),disableCache:e=>vs(e,!1),iconLoaded:ds,iconExists:ds,getIcon:Ll,listIcons:Rl,addIcon:Pr,addCollection:us,calculateSize:ui,buildIcon:Wr,iconToHTML:Ii,svgToURL:Gr,loadIcons:Ti,loadIcon:Kl,addAPIProvider:ps,appendCustomStyle:_c,_api:{getAPIConfig:zn,setAPIModule:hs,sendAPIQuery:jr,setFetch:hc,getFetch:pc,listAPIProviders:Vl}}}const di={"background-color":"currentColor"},Xr={"background-color":"transparent"},$s={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},xs={"-webkit-mask":di,mask:di,background:Xr};for(const t in xs){const e=xs[t];for(const n in $s)e[t+"-"+n]=$s[n]}function ws(t){return t?t+(t.match(/^[-0-9.]+$/)?"px":""):"inherit"}function $c(t,e,n){const i=document.createElement("span");let s=t.body;s.indexOf("<a")!==-1&&(s+="<!-- "+Date.now()+" -->");const r=t.attributes,o=Ii(s,{...r,width:e.width+"",height:e.height+""}),l=Gr(o),a=i.style,u={"--svg":l,width:ws(r.width),height:ws(r.height),...n?di:Xr};for(const d in u)a.setProperty(d,u[d]);return i}let Nt;function xc(){try{Nt=window.trustedTypes.createPolicy("iconify",{createHTML:t=>t})}catch{Nt=null}}function wc(t){return Nt===void 0&&xc(),Nt?Nt.createHTML(t):t}function Cc(t){const e=document.createElement("span"),n=t.attributes;let i="";n.width||(i="width: inherit;"),n.height||(i+="height: inherit;"),i&&(n.style=i);const s=Ii(t.body,n);return e.innerHTML=wc(s),e.firstChild}function hi(t){return Array.from(t.childNodes).find(e=>{const n=e.tagName&&e.tagName.toUpperCase();return n==="SPAN"||n==="SVG"})}function Cs(t,e){const n=e.icon.data,i=e.customisations,s=Wr(n,i);i.preserveAspectRatio&&(s.attributes.preserveAspectRatio=i.preserveAspectRatio);const r=e.renderedMode;let o;switch(r){case"svg":o=Cc(s);break;default:o=$c(s,{...Xt,...n},r==="mask")}const l=hi(t);l?o.tagName==="SPAN"&&l.tagName===o.tagName?l.setAttribute("style",o.getAttribute("style")):t.replaceChild(o,l):t.appendChild(o)}function As(t,e,n){const i=n&&(n.rendered?n:n.lastRender);return{rendered:!1,inline:e,icon:t,lastRender:i}}function Ac(t="iconify-icon"){let e,n;try{e=window.customElements,n=window.HTMLElement}catch{return}if(!e||!n)return;const i=e.get(t);if(i)return i;const s=["icon","mode","inline","observe","width","height","rotate","flip"],r=class extends n{constructor(){super(),Ne(this,"_shadowRoot"),Ne(this,"_initialised",!1),Ne(this,"_state"),Ne(this,"_checkQueued",!1),Ne(this,"_connected",!1),Ne(this,"_observer",null),Ne(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Zn(this);_s(l,a),this._state=As({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return s.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Zn(this),u=this._state;a!==u.inline&&(u.inline=a,_s(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Zn(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}Cs(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const u=this.getAttribute("mode"),d=ls(this);(l.attrMode!==u||kl(l.customisations,d)||!hi(this._shadowRoot))&&this._renderIcon(l.icon,d,u)}_iconChanged(l){const a=tc(l,(u,d,c)=>{const h=this._state;if(h.rendered||this.getAttribute("icon")!==u)return;const p={value:u,name:d,data:c};p.data?this._gotIconData(p):h.icon=p});a.data?this._gotIconData(a):this._state=As(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=hi(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,ls(this),this.getAttribute("mode"))}_renderIcon(l,a,u){const d=nc(l.data.body,u),c=this._state.inline;Cs(this._shadowRoot,this._state={rendered:!0,icon:l,inline:c,customisations:a,attrMode:u,renderedMode:d})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(u=>u.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};s.forEach(l=>{l in r.prototype||Object.defineProperty(r.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const o=qr();for(const l in o)r[l]=r.prototype[l]=o[l];return e.define(t,r),r}Ac()||qr();const Ec=I`
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
`,ke={scrollbar:Ec,globalStyles:Sc},Jr=class k{static set config(e){this._config={...k._config,...e}}static get config(){return k._config}static addGlobalStyles(){let e=document.querySelector("style[id='bim-ui']");if(e)return;e=document.createElement("style"),e.id="bim-ui",e.textContent=ke.globalStyles.cssText;const n=document.head.firstChild;n?document.head.insertBefore(e,n):document.head.append(e)}static defineCustomElement(e,n){customElements.get(e)||customElements.define(e,n)}static registerComponents(){k.init()}static init(){k.addGlobalStyles(),k.defineCustomElement("bim-button",Mc),k.defineCustomElement("bim-checkbox",pt),k.defineCustomElement("bim-color-input",We),k.defineCustomElement("bim-context-menu",fi),k.defineCustomElement("bim-dropdown",be),k.defineCustomElement("bim-grid",Mi),k.defineCustomElement("bim-icon",Fc),k.defineCustomElement("bim-input",Zt),k.defineCustomElement("bim-label",mt),k.defineCustomElement("bim-number-input",Z),k.defineCustomElement("bim-option",F),k.defineCustomElement("bim-panel",Ge),k.defineCustomElement("bim-panel-section",bt),k.defineCustomElement("bim-selector",gt),k.defineCustomElement("bim-table",re),k.defineCustomElement("bim-tabs",qe),k.defineCustomElement("bim-tab",te),k.defineCustomElement("bim-table-cell",ho),k.defineCustomElement("bim-table-children",fo),k.defineCustomElement("bim-table-group",bo),k.defineCustomElement("bim-table-row",Ye),k.defineCustomElement("bim-text-input",oe),k.defineCustomElement("bim-toolbar",Vn),k.defineCustomElement("bim-toolbar-group",Bn),k.defineCustomElement("bim-toolbar-section",_t),k.defineCustomElement("bim-viewport",So)}static newRandomId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let n="";for(let i=0;i<10;i++){const s=Math.floor(Math.random()*e.length);n+=e.charAt(s)}return n}};Jr._config={sectionLabelOnVerticalToolbar:!1};let W=Jr;class z extends O{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=e=>{if(!this.useObserver)return;for(const i of e)this.elements.add(i);const n=e.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const i of n)i.remove();this.observeLastElement()}}set visibleElements(e){this._visibleElements=this.useObserver?e:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const e=new IntersectionObserver(n=>{const i=n[0];if(!i.isIntersecting)return;const s=i.target;e.unobserve(s);const r=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,o=[...this.elements][r];o&&(this.visibleElements=[...this.visibleElements,o],e.observe(o))},{threshold:.5});return e}observeLastElement(){const e=this.getLazyObserver();if(!e)return;const n=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,i=[...this.elements][n];i&&e.observe(i)}resetVisibleElements(){const e=this.getLazyObserver();if(e){for(const n of this.elements)e.unobserve(n);this.visibleElements=[],this.observeLastElement()}}static create(e,n){const i=document.createDocumentFragment();if(e.length===0)return rt(e(),i),i.firstElementChild;if(!n)throw new Error("UIComponent: Initial state is required for statefull components.");let s=n;const r=e,o=a=>(s={...s,...a},rt(r(s,o),i),s);o(n);const l=()=>s;return[i.firstElementChild,o,l]}}const Bt=(t,e={},n=!0)=>{let i={};for(const s of t.children){const r=s,o=r.getAttribute("name")||r.getAttribute("label"),l=e[o];if(o){if("value"in r&&typeof r.value<"u"&&r.value!==null){const a=r.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;i[o]=l?l(r.value):r.value}else if(n){const a=Bt(r,e);if(Object.keys(a).length===0)continue;i[o]=l?l(a):a}}else n&&(i={...i,...Bt(r,e)})}return i},Dn=t=>t==="true"||t==="false"?t==="true":t&&!isNaN(Number(t))&&t.trim()!==""?Number(t):t,kc=[">=","<=","=",">","<","?","/","#"];function Es(t){const e=kc.find(o=>t.split(o).length===2),n=t.split(e).map(o=>o.trim()),[i,s]=n,r=s.startsWith("'")&&s.endsWith("'")?s.replace(/'/g,""):Dn(s);return{key:i,condition:e,value:r}}const pi=t=>{try{const e=[],n=t.split(/&(?![^()]*\))/).map(i=>i.trim());for(const i of n){const s=!i.startsWith("(")&&!i.endsWith(")"),r=i.startsWith("(")&&i.endsWith(")");if(s){const o=Es(i);e.push(o)}if(r){const o={operator:"&",queries:i.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const u=Es(l);return a>0&&(u.operator="&"),u})};e.push(o)}}return e}catch{return null}},Ss=(t,e,n)=>{let i=!1;switch(e){case"=":i=t===n;break;case"?":i=String(t).includes(String(n));break;case"<":(typeof t=="number"||typeof n=="number")&&(i=t<n);break;case"<=":(typeof t=="number"||typeof n=="number")&&(i=t<=n);break;case">":(typeof t=="number"||typeof n=="number")&&(i=t>n);break;case">=":(typeof t=="number"||typeof n=="number")&&(i=t>=n);break;case"/":i=String(t).startsWith(String(n));break}return i};var Oc=Object.defineProperty,Tc=Object.getOwnPropertyDescriptor,Qr=(t,e,n,i)=>{for(var s=Tc(e,n),r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Oc(e,n,s),s},H;const Ni=(H=class extends O{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(t){this._placement=t,this.updatePosition()}static removeMenus(){for(const t of H.menus)t instanceof H&&(t.visible=!1);H.dialog.close(),H.dialog.remove()}get visible(){return this._visible}set visible(t){var e;this._visible=t,t?(H.dialog.parentElement||document.body.append(H.dialog),this._previousContainer=this.parentElement,H.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,H.dialog.append(this),H.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((e=this._previousContainer)==null||e.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const t=this.placement??"right",e=await yr(this._previousContainer,this,{placement:t,middleware:[sr(10),gr(),br(),mr({padding:5})]}),{x:n,y:i}=e;this.style.left=`${n}px`,this.style.top=`${i}px`}connectedCallback(){super.connectedCallback(),H.menus.push(this)}render(){return f` <slot></slot> `}},H.styles=[ke.scrollbar,I`
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
    `],H.dialog=z.create(()=>f` <dialog
      @click=${t=>{t.target===H.dialog&&H.removeMenus()}}
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
    ></dialog>`),H.menus=[],H);Qr([g({type:String,reflect:!0})],Ni.prototype,"placement");Qr([g({type:Boolean,reflect:!0})],Ni.prototype,"visible");let fi=Ni;var Ic=Object.defineProperty,Nc=Object.getOwnPropertyDescriptor,ae=(t,e,n,i)=>{for(var s=i>1?void 0:i?Nc(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&Ic(e,n,s),s},Et;const ie=(Et=class extends O{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=ot(),this._tooltip=ot(),this._mouseLeave=!1,this.onClick=t=>{t.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const t=this._contextMenu;if(t){const e=this.getAttribute("data-context-group");e&&t.setAttribute("data-context-group",e),this.closeNestedContexts();const n=W.newRandomId();for(const i of t.children)i instanceof Et&&i.setAttribute("data-context-group",n);t.visible=!0}},this.mouseLeave=!0}set loading(t){if(this._loading=t,t)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=t,this.icon="eos-icons:loading";else{const{disabled:e,icon:n}=this._stateBeforeLoading;this.disabled=e,this.icon=n}}get loading(){return this._loading}set mouseLeave(t){this._mouseLeave=t,t&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:t}=this._parent,{value:e}=this._tooltip;t&&e&&yr(t,e,{placement:"bottom",middleware:[sr(10),gr(),br(),mr({padding:5})]}).then(n=>{const{x:i,y:s}=n;Object.assign(e.style,{left:`${i}px`,top:`${s}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const t=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},t)}closeNestedContexts(){const t=this.getAttribute("data-context-group");if(t)for(const e of fi.dialog.children){const n=e.getAttribute("data-context-group");if(e instanceof fi&&n===t){e.visible=!1,e.removeAttribute("data-context-group");for(const i of e.children)i instanceof Et&&(i.closeNestedContexts(),i.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const t=f`
      <div ${Y(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?f`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?f`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,e=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
      style="fill: var(--bim-label--c)"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`;return f`
      <div ${Y(this._parent)} class="parent" @click=${this.onClick}>
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
                  >${this.label}${this.label&&this._contextMenu?e:null}</bim-label
                >
              </div>
            `:null}
        ${this.tooltipTitle||this.tooltipText?t:null}
      </div>
      <slot></slot>
    `}},Et.styles=I`
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
  `,Et);ae([g({type:String,reflect:!0})],ie.prototype,"label",2);ae([g({type:Boolean,attribute:"label-hidden",reflect:!0})],ie.prototype,"labelHidden",2);ae([g({type:Boolean,reflect:!0})],ie.prototype,"active",2);ae([g({type:Boolean,reflect:!0,attribute:"disabled"})],ie.prototype,"disabled",2);ae([g({type:String,reflect:!0})],ie.prototype,"icon",2);ae([g({type:Boolean,reflect:!0})],ie.prototype,"vertical",2);ae([g({type:Number,attribute:"tooltip-time",reflect:!0})],ie.prototype,"tooltipTime",2);ae([g({type:Boolean,attribute:"tooltip-visible",reflect:!0})],ie.prototype,"tooltipVisible",2);ae([g({type:String,attribute:"tooltip-title",reflect:!0})],ie.prototype,"tooltipTitle",2);ae([g({type:String,attribute:"tooltip-text",reflect:!0})],ie.prototype,"tooltipText",2);ae([g({type:Boolean,reflect:!0})],ie.prototype,"loading",1);let Mc=ie;var Pc=Object.defineProperty,Qt=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Pc(e,n,s),s};const Zr=class extends O{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return f`
      <div class="parent">
        ${this.label?f`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};Zr.styles=I`
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
  `;let pt=Zr;Qt([g({type:String,reflect:!0})],pt.prototype,"icon");Qt([g({type:String,reflect:!0})],pt.prototype,"name");Qt([g({type:String,reflect:!0})],pt.prototype,"label");Qt([g({type:Boolean,reflect:!0})],pt.prototype,"checked");Qt([g({type:Boolean,reflect:!0})],pt.prototype,"inverted");var Rc=Object.defineProperty,ft=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Rc(e,n,s),s};const Kr=class extends O{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=ot(),this._textInput=ot(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const e=t.target;this.opacity=e.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:e,opacity:n}=t;this.color=e,n&&(this.opacity=n)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:e}=this._colorInput;e&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:e}=this._textInput;if(!e)return;const{value:n}=e;let i=n.replace(/[^a-fA-F0-9]/g,"");i.startsWith("#")||(i=`#${i}`),e.value=i.slice(0,7),e.value.length===7&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return f`
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
    `}};Kr.styles=I`
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
  `;let We=Kr;ft([g({type:String,reflect:!0})],We.prototype,"name");ft([g({type:String,reflect:!0})],We.prototype,"label");ft([g({type:String,reflect:!0})],We.prototype,"icon");ft([g({type:Boolean,reflect:!0})],We.prototype,"vertical");ft([g({type:Number,reflect:!0})],We.prototype,"opacity");ft([g({type:String,reflect:!0})],We.prototype,"color");var Lc=Object.defineProperty,jc=Object.getOwnPropertyDescriptor,Oe=(t,e,n,i)=>{for(var s=i>1?void 0:i?jc(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&Lc(e,n,s),s};const eo=class extends O{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Dn(this.label):this.label}set value(t){this._value=t}render(){return f`
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
    `}};eo.styles=I`
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
  `;let F=eo;Oe([g({type:String,reflect:!0})],F.prototype,"img",2);Oe([g({type:String,reflect:!0})],F.prototype,"label",2);Oe([g({type:String,reflect:!0})],F.prototype,"icon",2);Oe([g({type:Boolean,reflect:!0})],F.prototype,"checked",2);Oe([g({type:Boolean,reflect:!0})],F.prototype,"checkbox",2);Oe([g({type:Boolean,attribute:"no-mark",reflect:!0})],F.prototype,"noMark",2);Oe([g({converter:{fromAttribute(t){return t&&Dn(t)}}})],F.prototype,"value",1);Oe([g({type:Boolean,reflect:!0})],F.prototype,"vertical",2);var zc=Object.defineProperty,Dc=Object.getOwnPropertyDescriptor,Te=(t,e,n,i)=>{for(var s=i>1?void 0:i?Dc(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&zc(e,n,s),s};const to=class extends z{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=ot(),this.onOptionClick=t=>{const e=t.target,n=this._value.has(e);if(!this.multiple&&!this.required&&!n)this._value=new Set([e]);else if(!this.multiple&&!this.required&&n)this._value=new Set([]);else if(!this.multiple&&this.required&&!n)this._value=new Set([e]);else if(this.multiple&&!this.required&&!n)this._value=new Set([...this._value,e]);else if(this.multiple&&!this.required&&n){const i=[...this._value].filter(s=>s!==e);this._value=new Set(i)}else if(this.multiple&&this.required&&!n)this._value=new Set([...this._value,e]);else if(this.multiple&&this.required&&n){const i=[...this._value].filter(r=>r!==e),s=new Set(i);s.size!==0&&(this._value=s)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){if(t){const{value:e}=this._contextMenu;if(!e)return;for(const n of this.elements)e.append(n);this._visible=!0}else{for(const e of this.elements)this.append(e);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const e=new Set;for(const n of t){const i=this.findOption(n);if(i&&(e.add(i),!this.multiple&&Object.keys(t).length===1))break}this._value=e,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(t=>t instanceof F&&t.checked).map(t=>t.value)}get _options(){const t=new Set([...this.elements]);for(const e of this.children)e instanceof F&&t.add(e);return[...t]}onSlotChange(t){const e=t.target.assignedElements();this.observe(e);const n=new Set;for(const i of this.elements){if(!(i instanceof F)){i.remove();continue}i.checked&&n.add(i),i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick)}this._value=n}updateOptionsState(){for(const t of this._options)t instanceof F&&(t.checked=this._value.has(t))}findOption(t){return this._options.find(e=>e instanceof F?e.label===t||e.value===t:!1)}render(){let t,e,n;if(this._value.size===0)t="Select an option...";else if(this._value.size===1){const i=[...this._value][0];t=(i==null?void 0:i.label)||(i==null?void 0:i.value),e=i==null?void 0:i.img,n=i==null?void 0:i.icon}else t=`Multiple (${this._value.size})`;return f`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div class="input" @click=${()=>this.visible=!this.visible}>
          <bim-label
            .img=${e}
            .icon=${n}
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
            ${Y(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};to.styles=[ke.scrollbar,I`
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
    `];let be=to;Te([g({type:String,reflect:!0})],be.prototype,"name",2);Te([g({type:String,reflect:!0})],be.prototype,"icon",2);Te([g({type:String,reflect:!0})],be.prototype,"label",2);Te([g({type:Boolean,reflect:!0})],be.prototype,"multiple",2);Te([g({type:Boolean,reflect:!0})],be.prototype,"required",2);Te([g({type:Boolean,reflect:!0})],be.prototype,"vertical",2);Te([g({type:Boolean,reflect:!0})],be.prototype,"visible",1);Te([ht()],be.prototype,"_value",2);var Hc=Object.defineProperty,no=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Hc(e,n,s),s};const io=class extends O{constructor(){super(...arguments),this.floating=!1,this._layouts={},this._updateFunctions={}}set layouts(t){this._layouts=t;const e={};for(const[n,i]of Object.entries(t))for(const s in i.elements)e[n]||(e[n]={}),e[n][s]=r=>{const o=this._updateFunctions[n];if(!o)return;const l=o[s];l&&l(r)};this.updateComponent=e}get layouts(){return this._layouts}getLayoutAreas(t){const{template:e}=t,n=e.split(`
`).map(i=>i.trim()).map(i=>i.split('"')[1]).filter(i=>i!==void 0).flatMap(i=>i.split(/\s+/));return[...new Set(n)].filter(i=>i!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this._updateFunctions={},this.layouts[this.layout]){this.innerHTML="",this._updateFunctions[this.layout]={};const t=this._updateFunctions[this.layout],e=this.layouts[this.layout],n=this.getLayoutAreas(e).map(i=>{const s=e.elements[i];if(!s)return null;if(s instanceof HTMLElement)return s.style.gridArea=i,s;if("template"in s){const{template:r,initialState:o}=s,[l,a]=z.create(r,o);return l.style.gridArea=i,t[i]=a,l}return z.create(s)}).filter(i=>!!i);this.style.gridTemplate=e.template,this.append(...n),this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange)}}else this._updateFunctions={},this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return f`<slot></slot>`}};io.styles=I`
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
  `;let Mi=io;no([g({type:Boolean,reflect:!0})],Mi.prototype,"floating");no([g({type:String,reflect:!0})],Mi.prototype,"layout");const mi=class extends O{render(){return f`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};mi.styles=I`
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
  `,mi.properties={icon:{type:String}};let Fc=mi;var Bc=Object.defineProperty,Hn=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Bc(e,n,s),s};const so=class extends O{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const t={};for(const e of this.children){const n=e;"value"in n?t[n.name||n.label]=n.value:"checked"in n&&(t[n.name||n.label]=n.checked)}return t}set value(t){const e=[...this.children];for(const n in t){const i=e.find(o=>{const l=o;return l.name===n||l.label===n});if(!i)continue;const s=i,r=t[n];typeof r=="boolean"?s.checked=r:s.value=r}}render(){return f`
      <div class="parent">
        ${this.label||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};so.styles=I`
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
  `;let Zt=so;Hn([g({type:String,reflect:!0})],Zt.prototype,"name");Hn([g({type:String,reflect:!0})],Zt.prototype,"label");Hn([g({type:String,reflect:!0})],Zt.prototype,"icon");Hn([g({type:Boolean,reflect:!0})],Zt.prototype,"vertical");var Uc=Object.defineProperty,Kt=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Uc(e,n,s),s};const ro=class extends O{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Dn(this.textContent):this.textContent}render(){return f`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?f`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?f`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};ro.styles=I`
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
  `;let mt=ro;Kt([g({type:String,reflect:!0})],mt.prototype,"img");Kt([g({type:Boolean,attribute:"label-hidden",reflect:!0})],mt.prototype,"labelHidden");Kt([g({type:String,reflect:!0})],mt.prototype,"icon");Kt([g({type:Boolean,attribute:"icon-hidden",reflect:!0})],mt.prototype,"iconHidden");Kt([g({type:Boolean,reflect:!0})],mt.prototype,"vertical");var Vc=Object.defineProperty,Wc=Object.getOwnPropertyDescriptor,se=(t,e,n,i)=>{for(var s=i>1?void 0:i?Wc(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&Vc(e,n,s),s};const oo=class extends O{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=ot(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:e}=this._input;e&&this.setValue(e.value)}setValue(t){const{value:e}=this._input;let n=t;if(n=n.replace(/[^0-9.-]/g,""),n=n.replace(/(\..*)\./g,"$1"),n.endsWith(".")||(n.lastIndexOf("-")>0&&(n=n[0]+n.substring(1).replace(/-/g,"")),n==="-"||n==="-0"))return;let i=Number(n);Number.isNaN(i)||(i=this.min!==void 0?Math.max(i,this.min):i,i=this.max!==void 0?Math.min(i,this.max):i,this.value!==i&&(this._value=i,e&&(e.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:e}=t,n=this.value;let i=!1;const s=l=>{var a;i=!0;const{clientX:u}=l,d=this.step??1,c=((a=d.toString().split(".")[1])==null?void 0:a.length)||0,h=1/(this.sensitivity??1),p=(u-e)/h;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const b=n+p*d;this.setValue(b.toFixed(c))},r=()=>{this.slider=!0,this.removeEventListener("blur",r)},o=()=>{document.removeEventListener("mousemove",s),document.body.style.cursor="default",i?i=!1:(this.addEventListener("blur",r),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",o)};document.addEventListener("mousemove",s),document.addEventListener("mouseup",o)}onFocus(t){t.stopPropagation();const e=n=>{n.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",e))};window.addEventListener("keydown",e)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=f`
      ${this.pref||this.icon?f`<bim-label
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
        @input=${o=>o.stopPropagation()}
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
    `,e=this.min??-1/0,n=this.max??1/0,i=100*(this.value-e)/(n-e),s=f`
      <style>
        .slider-indicator {
          width: ${`${i}%`};
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
    `,r=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return f`
      <bim-input
        title=${r}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?s:t}
      </bim-input>
    `}};oo.styles=I`
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
  `;let Z=oo;se([g({type:String,reflect:!0})],Z.prototype,"name",2);se([g({type:String,reflect:!0})],Z.prototype,"icon",2);se([g({type:String,reflect:!0})],Z.prototype,"label",2);se([g({type:String,reflect:!0})],Z.prototype,"pref",2);se([g({type:Number,reflect:!0})],Z.prototype,"min",2);se([g({type:Number,reflect:!0})],Z.prototype,"value",1);se([g({type:Number,reflect:!0})],Z.prototype,"step",2);se([g({type:Number,reflect:!0})],Z.prototype,"sensitivity",2);se([g({type:Number,reflect:!0})],Z.prototype,"max",2);se([g({type:String,reflect:!0})],Z.prototype,"suffix",2);se([g({type:Boolean,reflect:!0})],Z.prototype,"vertical",2);se([g({type:Boolean,reflect:!0})],Z.prototype,"slider",2);var Gc=Object.defineProperty,Yc=Object.getOwnPropertyDescriptor,en=(t,e,n,i)=>{for(var s=i>1?void 0:i?Yc(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&Gc(e,n,s),s};const ao=class extends O{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return Bt(this,this.valueTransform)}set value(t){const e=[...this.children];for(const n in t){const i=e.find(r=>{const o=r;return o.name===n||o.label===n});if(!i)continue;const s=i;s.value=t[n]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,f`
      <div class="parent">
        ${this.label||this.name||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};ao.styles=[ke.scrollbar,I`
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
    `];let Ge=ao;en([g({type:String,reflect:!0})],Ge.prototype,"icon",2);en([g({type:String,reflect:!0})],Ge.prototype,"name",2);en([g({type:String,reflect:!0})],Ge.prototype,"label",2);en([g({type:Boolean,reflect:!0})],Ge.prototype,"hidden",1);en([g({type:Boolean,attribute:"header-hidden",reflect:!0})],Ge.prototype,"headerHidden",2);var qc=Object.defineProperty,tn=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&qc(e,n,s),s};const lo=class extends O{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const t=this.parentElement;let e;return t instanceof Ge&&(e=t.valueTransform),Object.values(this.valueTransform).length!==0&&(e=this.valueTransform),Bt(this,e)}set value(t){const e=[...this.children];for(const n in t){const i=e.find(r=>{const o=r;return o.name===n||o.label===n});if(!i)continue;const s=i;s.value=t[n]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,e=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,n=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,i=this.collapsed?e:n,s=f`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        ${this.fixed?null:i}
      </div>
    `;return f`
      <div class="parent">
        ${t?s:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};lo.styles=[ke.scrollbar,I`
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
    `];let bt=lo;tn([g({type:String,reflect:!0})],bt.prototype,"icon");tn([g({type:String,reflect:!0})],bt.prototype,"label");tn([g({type:String,reflect:!0})],bt.prototype,"name");tn([g({type:Boolean,reflect:!0})],bt.prototype,"fixed");tn([g({type:Boolean,reflect:!0})],bt.prototype,"collapsed");var Xc=Object.defineProperty,nn=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Xc(e,n,s),s};const co=class extends O{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const e of this.children)e instanceof F&&(e.checked=e===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const e=this.findOption(t);if(e){for(const n of this._options)n.checked=n===e;this._value=e,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const e=t.target.assignedElements();for(const n of e)n instanceof F&&(n.noMark=!0,n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(e=>e instanceof F?e.label===t||e.value===t:!1)}firstUpdated(){const t=[...this.children].find(e=>e instanceof F&&e.checked);t&&(this._value=t)}render(){return f`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};co.styles=I`
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
  `;let gt=co;nn([g({type:String,reflect:!0})],gt.prototype,"name");nn([g({type:String,reflect:!0})],gt.prototype,"icon");nn([g({type:String,reflect:!0})],gt.prototype,"label");nn([g({type:Boolean,reflect:!0})],gt.prototype,"vertical");nn([ht()],gt.prototype,"_value");const Jc=()=>f`
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
  `,Qc=()=>f`
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
  `;var Zc=Object.defineProperty,Kc=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&Zc(e,n,s),s};const uo=class extends O{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return f`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};uo.styles=I`
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
  `;let ho=uo;Kc([g({type:String,reflect:!0})],ho.prototype,"column");var eu=Object.defineProperty,tu=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&eu(e,n,s),s};const po=class extends O{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,e=!1){for(const n of this._groups)n.childrenHidden=typeof t>"u"?!n.childrenHidden:!t,e&&n.toggleChildren(t,e)}render(){return this._groups=[],f`
      <slot></slot>
      ${this.data.map(t=>{const e=document.createElement("bim-table-group");return this._groups.push(e),e.table=this.table,e.data=t,e})}
    `}};po.styles=I`
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
  `;let fo=po;tu([g({type:Array,attribute:!1})],fo.prototype,"data");var nu=Object.defineProperty,iu=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&nu(e,n,s),s};const mo=class extends O{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,e=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,e&&this._children.toggleGroups(t,e))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const t=this.table.getGroupIndentation(this.data)??0,e=f`
      ${this.table.noIndentation?null:f`
            <style>
              .branch-vertical {
                left: ${t+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,n=document.createDocumentFragment();rt(e,n);let i=null;this.table.noIndentation||(i=document.createElement("div"),i.classList.add("branch","branch-horizontal"),i.style.left=`${t-1+(this.table.selectableRows?2.05:.5625)}rem`);let s=null;if(!this.table.noIndentation){const l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("height","9.5"),l.setAttribute("width","7.5"),l.setAttribute("viewBox","0 0 4.6666672 7.3333333");const a=document.createElementNS("http://www.w3.org/2000/svg","path");a.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),l.append(a);const u=document.createElementNS("http://www.w3.org/2000/svg","svg");u.setAttribute("height","6.5"),u.setAttribute("width","9.5"),u.setAttribute("viewBox","0 0 5.9111118 5.0175439");const d=document.createElementNS("http://www.w3.org/2000/svg","path");d.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),u.append(d),s=document.createElement("div"),s.addEventListener("click",c=>{c.stopPropagation(),this.toggleChildren()}),s.classList.add("caret"),s.style.left=`${(this.table.selectableRows?1.5:.125)+t}rem`,this.childrenHidden?s.append(l):s.append(u)}const r=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&r.append(n),r.table=this.table,r.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:r}})),s&&this.data.children&&r.append(s),t!==0&&(!this.data.children||this.childrenHidden)&&i&&r.append(i);let o;if(this.data.children){o=document.createElement("bim-table-children"),this._children=o,o.table=this.table,o.data=this.data.children;const l=document.createDocumentFragment();rt(e,l),o.append(l)}return f`
      <div class="parent">${r} ${this.childrenHidden?null:o}</div>
    `}};mo.styles=I`
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
  `;let bo=mo;iu([g({type:Boolean,attribute:"children-hidden",reflect:!0})],bo.prototype,"childrenHidden");var su=Object.defineProperty,yt=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&su(e,n,s),s};const go=class extends O{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.name)}get _columnWidths(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.width)}get _isSelected(){var t;return(t=this.table)==null?void 0:t.selection.has(this.data)}onSelectionChange(t){if(!this.table)return;const e=t.target;this.selected=e.value,e.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const t=this.table.getRowIndentation(this.data)??0,e=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,n=[];for(const i in e){if(this.hiddenColumns.includes(i))continue;const s=e[i];let r;if(typeof s=="string"||typeof s=="boolean"||typeof s=="number"?(r=document.createElement("bim-label"),r.textContent=String(s)):s instanceof HTMLElement?r=s:(r=document.createDocumentFragment(),rt(s,r)),!r)continue;const o=document.createElement("bim-table-cell");o.append(r),o.column=i,this._columnNames.indexOf(i)===0&&(o.style.marginLeft=`${this.table.noIndentation?0:t+.75}rem`);const l=this._columnNames.indexOf(i);o.setAttribute("data-column-index",String(l)),o.toggleAttribute("data-no-indentation",l===0&&this.table.noIndentation),o.toggleAttribute("data-cell-header",this.isHeader),o.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:o}})),n.push(o)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,f`
      ${!this.isHeader&&this.table.selectableRows?f`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${n}
      <slot></slot>
    `}render(){return f`${this._intersecting?this.compute():f``}`}};go.styles=I`
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
  `;let Ye=go;yt([g({type:Boolean,reflect:!0})],Ye.prototype,"selected");yt([g({attribute:!1})],Ye.prototype,"columns");yt([g({attribute:!1})],Ye.prototype,"hiddenColumns");yt([g({attribute:!1})],Ye.prototype,"data");yt([g({type:Boolean,attribute:"is-header",reflect:!0})],Ye.prototype,"isHeader");yt([ht()],Ye.prototype,"_intersecting");var ru=Object.defineProperty,ou=Object.getOwnPropertyDescriptor,le=(t,e,n,i)=>{for(var s=i>1?void 0:i?ou(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&ru(e,n,s),s};const yo=class extends O{constructor(){super(...arguments),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(t,e)=>Object.values(e.data).some(n=>String(n).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,e)=>{let n=!1;const i=pi(t)??[];for(const s of i){if("queries"in s){n=!1;break}const{condition:r,value:o}=s;let{key:l}=s;if(l.startsWith("[")&&l.endsWith("]")){const a=l.replace("[","").replace("]","");l=a,n=Object.keys(e.data).filter(u=>u.includes(a)).map(u=>Ss(e.data[u],r,o)).some(u=>u)}else n=Ss(e.data[l],r,o);if(!n)break}return n}}set columns(t){const e=[];for(const n of t){const i=typeof n=="string"?{name:n,width:`minmax(${this.minColWidth}, 1fr)`}:n;e.push(i)}this._columns=e,this.computeMissingColumns(this.data),this.dispatchEvent(new Event("columnschange"))}get columns(){return this._columns}get _headerRowData(){const t={};for(const e of this.columns){const{name:n}=e;t[n]=String(n)}return t}get value(){return this._filteredData}set queryString(t){this.toggleAttribute("data-processing",!0),this._queryString=t&&t.trim()!==""?t.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(t){this._data=t,this.updateFilteredData(),this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(t=>{setTimeout(()=>{t(this.data)})})}set hiddenColumns(t){this._hiddenColumns=t,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(pi(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(t){let e=!1;for(const n of t){const{children:i,data:s}=n;for(const r in s)this._columns.map(o=>typeof o=="string"?o:o.name).includes(r)||(this._columns.push({name:r,width:`minmax(${this.minColWidth}, 1fr)`}),e=!0);if(i){const r=this.computeMissingColumns(i);r&&!e&&(e=r)}}return e}generateText(t="comma",e=this.value,n="",i=!0){const s=this._textDelimiters[t];let r="";const o=this.columns.map(l=>l.name);if(i){this.indentationInText&&(r+=`Indentation${s}`);const l=`${o.join(s)}
`;r+=l}for(const[l,a]of e.entries()){const{data:u,children:d}=a,c=this.indentationInText?`${n}${l+1}${s}`:"",h=o.map(b=>u[b]??""),p=`${c}${h.join(s)}
`;r+=p,d&&(r+=this.generateText(t,a.children,`${n}${l+1}.`,!1))}return r}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(t){const e={};for(const i of Object.keys(this.dataTransform)){const s=this.columns.find(r=>r.name===i);s&&s.forceDataTransform&&(i in t||(t[i]=""))}const n=t;for(const i in n){const s=this.dataTransform[i];s?e[i]=s(n[i],t):e[i]=t[i]}return e}downloadData(t="BIM Table Data",e="json"){let n=null;if(e==="json"&&(n=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),e==="csv"&&(n=new File([this.csv],`${t}.csv`)),e==="tsv"&&(n=new File([this.tsv],`${t}.tsv`)),!n)return;const i=document.createElement("a");i.href=URL.createObjectURL(n),i.download=n.name,i.click(),URL.revokeObjectURL(i.href)}getRowIndentation(t,e=this.value,n=0){for(const i of e){if(i.data===t)return n;if(i.children){const s=this.getRowIndentation(t,i.children,n+1);if(s!==null)return s}}return null}getGroupIndentation(t,e=this.value,n=0){for(const i of e){if(i===t)return n;if(i.children){const s=this.getGroupIndentation(t,i.children,n+1);if(s!==null)return s}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(t=!1){if(this._filteredData.length!==0&&!t||!this.loadFunction)return!1;this.loading=!0;try{const e=await this.loadFunction();return this.data=e,this.loading=!1,this._errorLoading=!1,!0}catch(e){if(this.loading=!1,this._filteredData.length!==0)return!1;const n=this.querySelector("[slot='error-loading']"),i=n==null?void 0:n.querySelector("[data-table-element='error-message']");return e instanceof Error&&i&&e.message.trim()!==""&&(i.textContent=e.message),this._errorLoading=!0,!1}}filter(t,e=this.filterFunction??this._stringFilterFunction,n=this.data){const i=[];for(const s of n)if(e(t,s)){if(this.preserveStructureOnFilter){const r={data:s.data};if(s.children){const o=this.filter(t,e,s.children);o.length&&(r.children=o)}i.push(r)}else if(i.push({data:s.data}),s.children){const r=this.filter(t,e,s.children);i.push(...r)}}else if(s.children){const r=this.filter(t,e,s.children);this.preserveStructureOnFilter&&r.length?i.push({data:s.data,children:r}):i.push(...r)}return i}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return Jc();if(this._errorLoading)return f`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return f`<slot name="missing-data"></slot>`;const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const e=document.createElement("bim-table-children");return e.table=this,e.data=this.value,e.style.gridArea="Body",e.style.backgroundColor="transparent",f`
      <div class="parent">
        ${this.headersHidden?null:t} ${Qc()}
        <div style="overflow-x: hidden; grid-area: Body">${e}</div>
      </div>
    `}};yo.styles=[ke.scrollbar,I`
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
    `];let re=yo;le([ht()],re.prototype,"_filteredData",2);le([g({type:Boolean,attribute:"headers-hidden",reflect:!0})],re.prototype,"headersHidden",2);le([g({type:String,attribute:"min-col-width",reflect:!0})],re.prototype,"minColWidth",2);le([g({type:Array,attribute:!1})],re.prototype,"columns",1);le([g({type:Array,attribute:!1})],re.prototype,"data",1);le([g({type:Boolean,reflect:!0})],re.prototype,"expanded",2);le([g({type:Boolean,reflect:!0,attribute:"selectable-rows"})],re.prototype,"selectableRows",2);le([g({attribute:!1})],re.prototype,"selection",2);le([g({type:Boolean,attribute:"no-indentation",reflect:!0})],re.prototype,"noIndentation",2);le([g({type:Boolean,reflect:!0})],re.prototype,"loading",2);le([ht()],re.prototype,"_errorLoading",2);var au=Object.defineProperty,lu=Object.getOwnPropertyDescriptor,Fn=(t,e,n,i)=>{for(var s=i>1?void 0:i?lu(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&au(e,n,s),s};const vo=class extends O{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const e=[...t.children].indexOf(this);this.name=`${this._defaultName}${e}`}}render(){return f` <slot></slot> `}};vo.styles=I`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let te=vo;Fn([g({type:String,reflect:!0})],te.prototype,"name",2);Fn([g({type:String,reflect:!0})],te.prototype,"label",2);Fn([g({type:String,reflect:!0})],te.prototype,"icon",2);Fn([g({type:Boolean,reflect:!0})],te.prototype,"hidden",1);var cu=Object.defineProperty,uu=Object.getOwnPropertyDescriptor,vt=(t,e,n,i)=>{for(var s=i>1?void 0:i?uu(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&cu(e,n,s),s};const _o=class extends O{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=t=>{const e=t.target;e instanceof te&&!e.hidden&&(e.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=e.name,e.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const e=[...this.children],n=e.find(i=>i instanceof te&&i.name===t);for(const i of e){if(!(i instanceof te))continue;i.hidden=n!==i;const s=this.getTabSwitcher(i.name);s&&s.toggleAttribute("data-active",!i.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(e=>e.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof te))continue;const e=document.createElement("div");e.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),e.setAttribute("data-name",t.name),e.className="switcher";const n=document.createElement("bim-label");n.textContent=t.label??"",n.icon=t.icon,e.append(n),this._switchers.push(e)}}onSlotChange(t){this.createSwitchers();const e=t.target.assignedElements(),n=e.find(i=>i instanceof te?this.tab?i.name===this.tab:!i.hidden:!1);n&&n instanceof te&&(this.tab=n.name);for(const i of e){if(!(i instanceof te)){i.remove();continue}i.removeEventListener("hiddenchange",this.onTabHiddenChange),n!==i&&(i.hidden=!0),i.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return f`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};_o.styles=[ke.scrollbar,I`
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
    `];let qe=_o;vt([ht()],qe.prototype,"_switchers",2);vt([g({type:Boolean,reflect:!0})],qe.prototype,"bottom",2);vt([g({type:Boolean,attribute:"switchers-hidden",reflect:!0})],qe.prototype,"switchersHidden",2);vt([g({type:Boolean,reflect:!0})],qe.prototype,"floating",2);vt([g({type:String,reflect:!0})],qe.prototype,"tab",1);vt([g({type:Boolean,attribute:"switchers-full",reflect:!0})],qe.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ks=t=>t??R;var du=Object.defineProperty,hu=Object.getOwnPropertyDescriptor,ge=(t,e,n,i)=>{for(var s=i>1?void 0:i?hu(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&du(e,n,s),s};const $o=class extends O{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return pi(this.value)}onInputChange(t){t.stopPropagation();const e=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=e.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("input");e==null||e.focus()})}render(){return f`
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
              placeholder=${ks(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:f` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${ks(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};$o.styles=[ke.scrollbar,I`
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
    `];let oe=$o;ge([g({type:String,reflect:!0})],oe.prototype,"icon",2);ge([g({type:String,reflect:!0})],oe.prototype,"label",2);ge([g({type:String,reflect:!0})],oe.prototype,"name",2);ge([g({type:String,reflect:!0})],oe.prototype,"placeholder",2);ge([g({type:String,reflect:!0})],oe.prototype,"value",2);ge([g({type:Boolean,reflect:!0})],oe.prototype,"vertical",2);ge([g({type:Number,reflect:!0})],oe.prototype,"debounce",2);ge([g({type:Number,reflect:!0})],oe.prototype,"rows",2);ge([g({type:String,reflect:!0})],oe.prototype,"type",1);var pu=Object.defineProperty,fu=Object.getOwnPropertyDescriptor,xo=(t,e,n,i)=>{for(var s=i>1?void 0:i?fu(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&pu(e,n,s),s};const wo=class extends O{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const e of t)this.vertical?e.setAttribute("label-hidden",""):e.removeAttribute("label-hidden")}render(){return f`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};wo.styles=I`
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
  `;let Bn=wo;xo([g({type:Number,reflect:!0})],Bn.prototype,"rows",2);xo([g({type:Boolean,reflect:!0})],Bn.prototype,"vertical",1);var mu=Object.defineProperty,bu=Object.getOwnPropertyDescriptor,Un=(t,e,n,i)=>{for(var s=i>1?void 0:i?bu(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&mu(e,n,s),s};const Co=class extends O{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const e of t)e instanceof Bn&&(e.vertical=this.vertical),e.toggleAttribute("label-hidden",this.vertical)}render(){return f`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Co.styles=I`
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
  `;let _t=Co;Un([g({type:String,reflect:!0})],_t.prototype,"label",2);Un([g({type:String,reflect:!0})],_t.prototype,"icon",2);Un([g({type:Boolean,reflect:!0})],_t.prototype,"vertical",1);Un([g({type:Boolean,attribute:"label-hidden",reflect:!0})],_t.prototype,"labelHidden",1);var gu=Object.defineProperty,yu=Object.getOwnPropertyDescriptor,Pi=(t,e,n,i)=>{for(var s=i>1?void 0:i?yu(e,n):e,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=(i?o(e,n,s):o(s))||s);return i&&s&&gu(e,n,s),s};const Ao=class extends O{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const e of t)e instanceof _t&&(e.labelHidden=this.vertical&&!W.config.sectionLabelOnVerticalToolbar,e.vertical=this.vertical)}render(){return f`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Ao.styles=I`
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
  `;let Vn=Ao;Pi([g({type:String,reflect:!0})],Vn.prototype,"icon",2);Pi([g({type:Boolean,attribute:"labels-hidden",reflect:!0})],Vn.prototype,"labelsHidden",2);Pi([g({type:Boolean,reflect:!0})],Vn.prototype,"vertical",1);var vu=Object.defineProperty,_u=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&vu(e,n,s),s};const Eo=class extends O{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return f`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Eo.styles=I`
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
  `;let So=Eo;_u([g({type:String,reflect:!0})],So.prototype,"name");/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ko="important",$u=" !"+ko,ze=Ar(class extends Er{constructor(t){var e;if(super(t),t.type!==Cr.ATTRIBUTE||t.name!=="style"||((e=t.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,n)=>{const i=t[n];return i==null?e:e+`${n=n.includes("-")?n:n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){const{style:n}=t.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const i of this.ft)e[i]==null&&(this.ft.delete(i),i.includes("-")?n.removeProperty(i):n[i]=null);for(const i in e){const s=e[i];if(s!=null){this.ft.add(i);const r=typeof s=="string"&&s.endsWith($u);i.includes("-")||r?n.setProperty(i,r?s.slice(0,-11):s,r?ko:""):n[i]=s}}return Be}}),xu=t=>{const{components:e}=t,n=e.get(Qo);return f`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const i=document.createElement("input");i.type="file",i.accept=".ifc",i.onchange=async()=>{if(i.files===null||i.files.length===0)return;const s=i.files[0],r=s.name.replace(".ifc","");i.remove();const o=await s.arrayBuffer(),l=new Uint8Array(o);await n.load(l,!0,r)},i.click()}}
    ></bim-button>
  `},wu=t=>z.create(xu,t),Cu=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:wu},Symbol.toStringTag,{value:"Module"}));({...Cu});const Au=t=>{const{components:e,actions:n,tags:i}=t,s=(n==null?void 0:n.dispose)??!0,r=(n==null?void 0:n.download)??!0,o=(n==null?void 0:n.visibility)??!0,l=(i==null?void 0:i.schema)??!0,a=(i==null?void 0:i.viewDefinition)??!0,u=e.get(Ve),d=({detail:c})=>{const{cell:h}=c;h.style.padding="0.25rem 0"};return f`
    <bim-table ${Y(c=>{if(!c)return;const h=c;h.hiddenColumns=["modelID"];const p=[];for(const[,b]of u.groups){if(!b)continue;const $={data:{Name:b.name||b.uuid,modelID:b.uuid}};p.push($)}h.dataTransform={Name:(b,$)=>{const{modelID:y}=$;if(typeof y!="string")return b;const m=u.groups.get(y);if(!m)return y;const v={};for(const S of m.items)v[S.id]=S.ids;let _;const{schema:x}=m.ifcMetadata;l&&x&&(_=f`
            <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${x}</bim-label>
            `);let A;if(a&&"viewDefinition"in m.ifcMetadata){const S=m.ifcMetadata.viewDefinition;A=f`
            ${S.split(",").map(E=>f`<bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${E}</bim-label>`)}
          `}let C;s&&(C=f`<bim-button @click=${()=>u.disposeGroup(m)} icon="mdi:delete"></bim-button>`);let T;o&&(T=f`<bim-button @click=${S=>{const E=e.get(Gs),B=S.target;E.set(B.hasAttribute("data-model-hidden"),v),B.toggleAttribute("data-model-hidden"),B.icon=B.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye"}} icon="mdi:eye"></bim-button>`);let M;return r&&(M=f`<bim-button @click=${()=>{const S=document.createElement("input");S.type="file",S.accept=".ifc",S.multiple=!1,S.addEventListener("change",async()=>{if(!(S.files&&S.files.length===1))return;const E=S.files[0],B=await E.arrayBuffer(),q=await e.get(Zo).saveToIfc(m,new Uint8Array(B)),G=new File([q],E.name),w=document.createElement("a");w.href=URL.createObjectURL(G),w.download=G.name,w.click(),URL.revokeObjectURL(w.href)}),S.click()}} icon="flowbite:download-solid"></bim-button>`),f`
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
        `}},h.data=p})} @cellcreated=${d} headers-hidden no-indentation>
      <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No models has been loaded yet
      </bim-label>
    </bim-table>
  `},Eu=(t,e=!0)=>{const n=z.create(Au,t);if(e){const{components:i}=t,s=i.get(Ve),[,r]=n;s.onFragmentsLoaded.add(()=>setTimeout(()=>r())),s.onFragmentsDisposed.add(()=>r())}return n},Su=Object.freeze(Object.defineProperty({__proto__:null,modelsList:Eu},Symbol.toStringTag,{value:"Module"})),Oo=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",t=>t.includes("Value"),t=>t.startsWith("Material"),t=>t.startsWith("Relating"),t=>{const e=["IsGroupedBy","IsDecomposedBy"];return t.startsWith("Is")&&!e.includes(t)}];async function pn(t,e,n,i=Oo,s=!1){const r=t.get(he),o=await e.getProperties(n);if(!o)return{data:{Entity:`${n} properties not found...`}};const l=r.relationMaps[e.uuid],a={data:{}};for(const u in o){const d=i.map(h=>typeof h=="string"?u===h:h(u)).includes(!0);if(!(u==="type"||d))continue;const c=o[u];if(c)if(c.type===5){a.children||(a.children=[]);const h=await pn(t,e,c.value,i,s);a.children.push(h)}else if(typeof c=="object"&&!Array.isArray(c)){const{value:h,type:p}=c;if(s)p===1||p===2||p===3||(a.data[u]=h);else{const b=typeof h=="number"?Number(h.toFixed(3)):h;a.data[u]=b}}else if(Array.isArray(c))for(const h of c){if(h.type!==5)continue;a.children||(a.children=[]);const p=await pn(t,e,h.value,i,s);a.children.push(p)}else if(u==="type"){const h=mn[c];a.data.Entity=h}else a.data[u]=c}if(l&&l.get(o.expressID)){const u=l.get(o.expressID);for(const d of i){const c=[];if(typeof d=="string"){const h=r._inverseAttributes.indexOf(d);h!==-1&&c.push(h)}else{const h=r._inverseAttributes.filter(p=>d(p));for(const p of h){const b=r._inverseAttributes.indexOf(p);c.push(b)}}for(const h of c){const p=u.get(h);if(p)for(const b of p){const $=await pn(t,e,b,i,s);a.children||(a.children=[]),a.children.push($)}}}}return a}const ku=t=>{const{components:e,fragmentIdMap:n,attributesToInclude:i,editable:s,tableDefinition:r}=t,o=e.get(Ve);let l;return typeof i=="function"?l=i(Oo):l=i,f`<bim-table ${Y(async a=>{if(!a)return;const u=a,d=[],c=[];for(const h in n){const p=o.list.get(h);if(!(p&&p.group))continue;const b=p.group,$=c.find(y=>y.model===b);if($)for(const y of n[h])$.expressIDs.add(y);else{const y={model:b,expressIDs:new Set(n[h])};c.push(y)}}for(const h of c){const{model:p,expressIDs:b}=h;for(const $ of b){const y=await pn(e,p,$,l,s);d.push(y)}}u.dataTransform=r,u.data=d,u.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},Ou=t=>z.create(ku,t),Tu=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:Ou},Symbol.toStringTag,{value:"Module"}));let _e;const Iu=t=>{const{components:e,classifications:n}=t,i=e.get(Ko),s=e.get(Gs);_e||(_e=document.createElement("bim-table"),_e.headersHidden=!0,_e.hiddenColumns=["system"],_e.columns=["Name",{name:"Actions",width:"auto"}],_e.dataTransform={Actions:(o,l)=>{const{system:a,Name:u}=l;if(!(typeof a=="string"&&typeof u=="string"))return o;const d=i.list[a];if(!(d&&d[u]))return o;const c=d[u],{map:h}=c;return f`
          <div>
            <bim-checkbox checked @change=${p=>{const b=p.target;s.set(b.value,h)}}></bim-checkbox>
          </div>
        `}});const r=[];for(const o of n){const l=typeof o=="string"?o:o.system,a=typeof o=="string"?o:o.label,u=i.list[l];u&&r.push({data:{Name:a,system:l},children:Object.keys(u).map(d=>({data:{Name:d,system:l,Actions:""}}))})}return _e.data=r,f`${_e}`},Nu=(t,e=!0)=>{const n=z.create(Iu,t);if(e){const{components:i}=t,s=i.get(Ve),[,r]=n;s.onFragmentsDisposed.add(()=>r())}return n},Mu=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:Nu},Symbol.toStringTag,{value:"Module"})),To=async(t,e,n)=>{var i,s,r,o;const l=t.get(he),a={data:{Name:(i=n.Name)==null?void 0:i.value},children:[{data:{Name:"Identification",Value:(s=n.Identification)==null?void 0:s.value}},{data:{Name:"Name",Value:(r=n.Name)==null?void 0:r.value}},{data:{Name:"Description",Value:(o=n.Description)==null?void 0:o.value}}]},u=l.getEntityRelations(e,n.expressID,"IsNestedBy");if(!u)return a;a.children||(a.children=[]);const d=[];a.children.push({data:{Name:"Tasks"},children:d});for(const c of u){const h=await e.getProperties(c);if(!h)continue;const p=await To(t,e,h);d.push(p)}return a},Pu=async(t,e,n)=>{const i=[];for(const s of n){const r=await To(t,e,s);i.push(r)}return{data:{Name:"Tasks"},children:i}},Ru=async(t,e)=>{var n,i,s,r;const o={data:{Name:"Classifications"}};for(const l of e){const{value:a}=l.ReferencedSource,u=await t.getProperties(a);if(!u)continue;const d={data:{Name:(n=u.Name)==null?void 0:n.value},children:[{data:{Name:"Identification",Value:((i=l.Identification)==null?void 0:i.value)||((s=l.ItemReference)==null?void 0:s.value)}},{data:{Name:"Name",Value:(r=l.Name)==null?void 0:r.value}}]};o.children||(o.children=[]),o.children.push(d)}return o},Lu=async(t,e)=>{var n,i,s,r,o,l;const a={data:{Name:"Materials"}};for(const u of e){if(u.type===Xs){const d=(n=u.ForLayerSet)==null?void 0:n.value,c=await t.getProperties(d);if(!c)continue;for(const h of c.MaterialLayers){const{value:p}=h,b=await t.getProperties(p);if(!b)continue;const $=await t.getProperties((i=b.Material)==null?void 0:i.value);if(!$)continue;const y={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:(s=b.LayerThickness)==null?void 0:s.value}},{data:{Name:"Material",Value:(r=$.Name)==null?void 0:r.value}}]};a.children||(a.children=[]),a.children.push(y)}}if(u.type===Qs)for(const d of u.Materials){const{value:c}=d,h=await t.getProperties(c);if(!h)continue;const p={data:{Name:"Name",Value:(o=h.Name)==null?void 0:o.value}};a.children||(a.children=[]),a.children.push(p)}if(u.type===Js){const d={data:{Name:"Name",Value:(l=u.Name)==null?void 0:l.value}};a.children||(a.children=[]),a.children.push(d)}}return a},ju={IFCLENGTHMEASURE:"LENGTHUNIT",IFCAREAMEASURE:"AREAUNIT",IFCVOLUMEMEASURE:"VOLUMEUNIT",IFCPLANEANGLEMEASURE:"PLANEANGLEUNIT"},zu={MILLIMETRE:{symbol:"mm",digits:0},METRE:{symbol:"m",digits:2},KILOMETRE:{symbol:"km",digits:2},SQUARE_METRE:{symbol:"m²",digits:2},CUBIC_METRE:{symbol:"m³",digits:2},DEGREE:{symbol:"°",digits:2},RADIAN:{symbol:"rad",digits:2},GRAM:{symbol:"g",digits:0},KILOGRAM:{symbol:"kg",digits:2},MILLISECOND:{symbol:"ms",digits:0},SECOND:{symbol:"s",digits:0}},Io=async(t,e)=>{var n,i,s;const r=Object.values(await t.getAllPropertiesOfType(aa))[0];let o;for(const l of r.Units){const a=await t.getProperties(l.value);if(a&&((n=a.UnitType)==null?void 0:n.value)===ju[e]){o=`${((i=a.Prefix)==null?void 0:i.value)??""}${((s=a.Name)==null?void 0:s.value)??""}`;break}}return o?zu[o]:null},Du=async(t,e,n)=>{var i,s;const{displayUnits:r}=n,o={data:{Name:"PropertySets"}};for(const l of e){const a={data:{Name:(i=l.Name)==null?void 0:i.value}};if(l.type===Ys){for(const u of l.HasProperties){const{value:d}=u,c=await t.getProperties(d);if(!c)continue;const h=Object.keys(c).find(y=>y.includes("Value"));if(!(h&&c[h]))continue;let p=c[h].value,b="";if(r){const{name:y}=c[h],m=await Io(t,y)??{};b=m.symbol,p=c[h].value,typeof p=="number"&&m.digits&&(p=p.toFixed(m.digits))}const $={data:{Name:(s=c.Name)==null?void 0:s.value,Value:`${p} ${b??""}`}};a.children||(a.children=[]),a.children.push($)}a.children&&(o.children||(o.children=[]),o.children.push(a))}}return o},Hu=async(t,e,n)=>{var i,s;const{displayUnits:r}=n,o={data:{Name:"QuantitySets"}};for(const l of e){const a={data:{Name:(i=l.Name)==null?void 0:i.value}};if(l.type===qs){for(const u of l.Quantities){const{value:d}=u,c=await t.getProperties(d);if(!c)continue;const h=Object.keys(c).find(y=>y.includes("Value"));if(!(h&&c[h]))continue;let p=c[h].value,b="";if(r){const{name:y}=c[h],m=await Io(t,y)??{};b=m.symbol,p=c[h].value,typeof p=="number"&&m.digits&&(p=p.toFixed(m.digits))}const $={data:{Name:(s=c.Name)==null?void 0:s.value,Value:`${p} ${b??""}`}};a.children||(a.children=[]),a.children.push($)}a.children&&(o.children||(o.children=[]),o.children.push(a))}}return o},Fu=["OwnerHistory","ObjectPlacement","CompositionType"],No=async(t,e)=>{const n={groupName:"Attributes",includeClass:!1,...e},{groupName:i,includeClass:s}=n,r={data:{Name:i}};s&&(r.children||(r.children=[]),r.children.push({data:{Name:"Class",Value:mn[t.type]}}));for(const o in t){if(Fu.includes(o))continue;const l=t[o];if(l&&typeof l=="object"&&!Array.isArray(l)){if(l.type===na)continue;const a={data:{Name:o,Value:l.value}};r.children||(r.children=[]),r.children.push(a)}}return r},at=(t,...e)=>{t.children||(t.children=[]),t.children.push(...e)},Bu=async(t,e,n,i,s)=>{const r=t.get(he).getEntityRelations(e,n,"IsDefinedBy");if(r){const o=[],l=[];for(const d of r){const c=await e.getProperties(d);c&&(c.type===Ys&&o.push(c),c.type===qs&&l.push(c))}const a=await Du(e,o,s);a.children&&at(i,a);const u=await Hu(e,l,s);u.children&&at(i,u)}},Uu=async(t,e,n,i)=>{const s=t.get(he).getEntityRelations(e,n,"HasAssociations");if(s){const r=[],o=[];for(const u of s){const d=await e.getProperties(u);d&&(d.type===ia&&r.push(d),(d.type===Xs||d.type===sa||d.type===ra||d.type===Js||d.type===Qs)&&o.push(d))}const l=await Ru(e,r);l.children&&at(i,l);const a=await Lu(e,o);a.children&&at(i,a)}},Vu=async(t,e,n,i)=>{const s=t.get(he).getEntityRelations(e,n,"HasAssignments");if(s){const r=[];for(const l of s){const a=await e.getProperties(l);a&&a.type===oa&&r.push(a)}const o=await Pu(t,e,r);o.children&&at(i,o)}},Wu=async(t,e,n,i)=>{const s=t.get(he).getEntityRelations(e,n,"ContainedInStructure");if(s&&s[0]){const r=s[0],o=await e.getProperties(r);if(o){const l=await No(o,{groupName:"SpatialContainer"});at(i,l)}}};let un={};const Gu=async(t,e,n)=>{var i;const s=t.get(he),r=t.get(Ve),o=r.getModelIdMap(e);Object.keys(e).length===0&&(un={});const l=[];for(const a in o){const u=r.groups.get(a);if(!u)continue;const d=s.relationMaps[u.uuid];if(!d)continue;a in un||(un[a]=new Map);const c=un[a],h=o[a];for(const p of h){let b=c.get(p);if(b){l.push(b);continue}const $=await u.getProperties(p);if(!$)continue;b={data:{Name:(i=$.Name)==null?void 0:i.value}},l.push(b),c.set(p,b);const y=await No($,{includeClass:!0});b.children||(b.children=[]),b.children.push(y),d.get(p)&&(await Bu(t,u,p,b,n),await Uu(t,u,p,b),await Vu(t,u,p,b),await Wu(t,u,p,b))}}return l},Yu=t=>{const e={emptySelectionWarning:!0,...t},{components:n,fragmentIdMap:i,emptySelectionWarning:s}=e;return f`
    <bim-table @cellcreated=${({detail:r})=>{const{cell:o}=r;o.column==="Name"&&!("Value"in o.rowData)&&(o.style.gridColumn="1 / -1")}} ${Y(async r=>{if(!r)return;const o=r;o.columns=[{name:"Name",width:"12rem"}],o.headersHidden=!0,o.loadFunction=()=>Gu(n,i,t),await o.loadData(!0)&&o.dispatchEvent(new Event("datacomputed"))})}>
      ${s?f`
            <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
              Select some elements to display its properties
            </bim-label>
            `:null}
      <bim-label slot="error-loading" style="--bim-icon--c: #e72e2e" icon="bxs:error-alt">
        Something went wrong with the properties
      </bim-label>
    </bim-table>
  `},qu=t=>z.create(Yu,t),Xu=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:qu},Symbol.toStringTag,{value:"Module"})),bi=async(t,e,n,i)=>{var s;const r=[],o=t.get(he),l=await e.getProperties(n);if(!l)return r;const{type:a}=l,u={data:{Entity:mn[a],Name:(s=l.Name)==null?void 0:s.value,modelID:e.uuid,expressID:n}};for(const d of i){const c=o.getEntityRelations(e,n,d);if(!c)continue;u.children||(u.children=[]),u.data.relations=JSON.stringify(c);const h={};for(const p of c){const b=await bi(t,e,p,i);for(const $ of b)if($.data.relations)u.children.push($);else{const y=e.data.get(p);if(!y){u.children.push($);continue}const m=y[1][1],v=mn[m];v in h||(h[v]=[]),$.data.Entity=$.data.Name,delete $.data.Name,h[v].push($)}}for(const p in h){const b=h[p],$=b.map(m=>m.data.expressID),y={data:{Entity:p,modelID:e.uuid,relations:JSON.stringify($)},children:b};u.children.push(y)}}return r.push(u),r},Ju=async(t,e,n,i)=>{const s=t.get(he),r=[];for(const o of e){let l;if(i)l={data:{Entity:o.name!==""?o.name:o.uuid},children:await bi(t,o,i,n)};else{const a=s.relationMaps[o.uuid],u=await o.getAllPropertiesOfType(ta);if(!(a&&u))continue;const{expressID:d}=Object.values(u)[0];l={data:{Entity:o.name!==""?o.name:o.uuid},children:await bi(t,o,d,n)}}r.push(l)}return r};let pe;const Qu=(t,e)=>{const n=t.get(Ve),{modelID:i,expressID:s,relations:r}=e;if(!i)return null;const o=n.groups.get(i);return o?o.getFragmentMap([s,...JSON.parse(r??"[]")]):null},Zu=t=>{const{components:e,models:n,expressID:i}=t,s=t.selectHighlighterName??"select",r=t.hoverHighlighterName??"hover";pe||(pe=document.createElement("bim-table"),pe.hiddenColumns=["modelID","expressID","relations"],pe.columns=["Entity","Name"],pe.headersHidden=!0,pe.addEventListener("cellcreated",({detail:l})=>{const{cell:a}=l;a.column==="Entity"&&!("Name"in a.rowData)&&(a.style.gridColumn="1 / -1")})),pe.addEventListener("rowcreated",l=>{l.stopImmediatePropagation();const{row:a}=l.detail,u=e.get(pa),d=Qu(e,a.data);d&&Object.keys(d).length!==0&&(a.onmouseover=()=>{r&&(a.style.backgroundColor="var(--bim-ui_bg-contrast-20)",u.highlightByID(r,d,!0,!1,u.selection[s]??{}))},a.onmouseout=()=>{a.style.backgroundColor="",u.clear(r)},a.onclick=()=>{s&&u.highlightByID(s,d,!0,!0)})});const o=t.inverseAttributes??["IsDecomposedBy","ContainsElements"];return Ju(e,n,o,i).then(l=>pe.data=l),f`${pe}`},Ku=(t,e=!0)=>{const n=z.create(Zu,t);if(e){const[,i]=n,{components:s}=t,r=s.get(Ve),o=s.get(he),l=()=>i({models:r.groups.values()});o.onRelationsIndexed.add(l),r.onFragmentsDisposed.add(l)}return n},ed=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:Ku},Symbol.toStringTag,{value:"Module"})),St=(t,e)=>[...t.get(Ws).list.values()].find(n=>n.world===e),td=(t,e)=>f`
    <bim-color-input @input=${n=>{const i=n.target;t.color=new dt(i.color)}} color=${e}></bim-color-input>
  `,nd=(t,e)=>{const{postproduction:n}=t,i=n.n8ao.configuration;return f`
    <bim-color-input @input=${s=>{const r=s.target;i.color=new dt(r.color)}} color=${e}></bim-color-input>
  `},id=(t,e)=>{const{color:n,opacity:i}=JSON.parse(e),{postproduction:s}=t,{customEffects:r}=s;return f`
    <bim-color-input @input=${o=>{const{color:l,opacity:a}=o.target;r.lineColor=new dt(l).getHex(),a&&(r.opacity=a/100)}} color=${n} opacity=${i*100}></bim-color-input>
  `},sd=(t,e)=>f`
    <bim-color-input @input=${n=>{const i=n.target,s=new dt(i.color);t.material.uniforms.uColor.value=s}} color=${e}></bim-color-input>
  `,rd=(t,e)=>{const{postproduction:n}=t;return f`
    <bim-checkbox @change=${i=>{const s=i.target;n.setPasses({ao:s.checked})}} .checked=${e}></bim-checkbox>
  `},od=(t,e)=>{const{postproduction:n}=t;return f`
    <bim-checkbox @change=${i=>{const s=i.target;n.setPasses({gamma:s.checked})}} .checked=${e}></bim-checkbox>
  `},ad=(t,e)=>{const{postproduction:n}=t;return f`
    <bim-checkbox @change=${i=>{const s=i.target;n.setPasses({custom:s.checked})}} .checked=${e}></bim-checkbox>
  `},$e=(t,e,n,i=()=>{})=>f`
    <bim-checkbox .checked="${n}" @change="${s=>{const r=s.target.checked;t[e]=r,i(r)}}"></bim-checkbox> 
  `,N=(t,e,n,i)=>{const s={slider:!1,min:0,max:100,step:1,prefix:null,suffix:null,onInputSet:()=>{},...i},{slider:r,min:o,max:l,step:a,suffix:u,prefix:d,onInputSet:c}=s;return f`
    <bim-number-input
      .pref=${d}
      .suffix=${u}
      .slider=${r} 
      min=${o} 
      value="${n}" 
      max=${l} 
      step=${a} 
      @change="${h=>{const p=h.target.value;t[e]=p,c(p)}}"
    ></bim-number-input> 
  `},ld=t=>{const{components:e}=t,n=e.get(On);return f`
    <bim-table @cellcreated=${({detail:i})=>{const s=i.cell.parentNode;if(!s)return;const r=s.querySelector("bim-table-cell[column='Name']"),o=s.querySelector("bim-table-cell[column='Value']");r&&!o&&(r.style.gridColumn="1 / -1")}} ${Y(async i=>{var s,r,o,l,a;if(!i)return;const u=i;u.preserveStructureOnFilter=!0,u.dataTransform={Value:(c,h)=>{const p=h.World,b=n.list.get(p);if(!b)return c;const{scene:$,camera:y,renderer:m}=b,v=h.Name;if(v==="Grid"&&h.IsGridConfig&&typeof c=="boolean"){const _=St(e,b);return _?$e(_,"visible",c):c}if(v==="Color"&&h.IsGridConfig&&typeof c=="string"){const _=St(e,b);return _?sd(_,c):c}if(v==="Distance"&&h.IsGridConfig&&typeof c=="number"){const _=St(e,b);return _?N(_.material.uniforms.uDistance,"value",c,{slider:!0,min:300,max:1e3}):c}if(v==="Size"&&h.IsGridConfig&&typeof c=="string"){const _=St(e,b);if(!_)return c;const{x,y:A}=JSON.parse(c),C=N(_.material.uniforms.uSize1,"value",x,{slider:!0,suffix:"m",prefix:"A",min:1,max:20}),T=N(_.material.uniforms.uSize2,"value",A,{slider:!0,suffix:"m",prefix:"B",min:1,max:20});return f`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${C}${T}</div>
          `}if(v==="Near Frustum"&&y.three instanceof an&&typeof c=="number"){const _=y.three;return N(y.three,"near",c,{slider:!0,min:.1,max:10,step:.1,onInputSet:()=>_.updateProjectionMatrix()})}if(v==="Far Frustum"&&y.three instanceof an&&typeof c=="number"){const _=y.three;return N(y.three,"far",c,{slider:!0,min:300,max:2e3,step:10,onInputSet:()=>_.updateProjectionMatrix()})}if(v==="Field of View"&&y.three instanceof an&&typeof c=="number"){const _=y.three;return N(y.three,"fov",c,{slider:!0,min:10,max:120,onInputSet:()=>_.updateProjectionMatrix()})}if(v==="Invert Drag"&&y.hasCameraControls()&&typeof c=="boolean")return $e(y.controls,"dollyDragInverted",c);if(v==="Dolly Speed"&&y.hasCameraControls()&&typeof c=="number")return N(y.controls,"dollySpeed",c,{slider:!0,min:.5,max:3,step:.1});if(v==="Truck Speed"&&y.hasCameraControls()&&typeof c=="number")return N(y.controls,"truckSpeed",c,{slider:!0,min:.5,max:6,step:.1});if(v==="Smooth Time"&&y.hasCameraControls()&&typeof c=="number")return N(y.controls,"smoothTime",c,{slider:!0,min:.01,max:2,step:.01});if(v==="Intensity"&&typeof c=="number"){if(h.Light&&typeof h.Light=="string"){const _=$.three.children.find(x=>x.uuid===h.Light);return _&&_ instanceof Ct?N(_,"intensity",c,{slider:!0,min:0,max:10,step:.1}):c}if(h.IsAOConfig&&m instanceof P)return N(m.postproduction.n8ao.configuration,"intensity",c,{slider:!0,max:16,step:.1})}if(v==="Color"&&typeof c=="string"){const _=h.Light,x=$.three.children.find(A=>A.uuid===_);if(x&&x instanceof Ct)return td(x,c);if(h.IsAOConfig&&m instanceof P)return nd(m,c)}if(v==="Ambient Oclussion"&&typeof c=="boolean"&&h.IsAOConfig&&m instanceof P)return rd(m,c);if(v==="Half Resolution"&&h.IsAOConfig&&m instanceof P&&typeof c=="boolean")return $e(m.postproduction.n8ao.configuration,"halfRes",c);if(v==="Screen Space Radius"&&h.IsAOConfig&&m instanceof P&&typeof c=="boolean")return $e(m.postproduction.n8ao.configuration,"screenSpaceRadius",c);if(v==="Radius"&&h.IsAOConfig&&m instanceof P&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"aoRadius",c,{slider:!0,max:2,step:.1});if(v==="Denoise Samples"&&h.IsAOConfig&&m instanceof P&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"denoiseSamples",c,{slider:!0,min:1,max:16});if(v==="Samples"&&h.IsAOConfig&&m instanceof P&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"aoSamples",c,{slider:!0,min:1,max:16});if(v==="Denoise Radius"&&h.IsAOConfig&&m instanceof P&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"denoiseRadius",c,{slider:!0,min:0,max:16,step:.1});if(v==="Distance Falloff"&&h.IsAOConfig&&m instanceof P&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"distanceFalloff",c,{slider:!0,min:0,max:4,step:.1});if(v==="Directional Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const _=$.three.children.find(x=>x.uuid===h.Light);return _&&_ instanceof Ct?$e(_,"visible",c):c}if(v==="Ambient Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const _=$.three.children.find(x=>x.uuid===h.Light);return _&&_ instanceof Ct?$e(_,"visible",c):c}if(v==="Position"&&h.Light&&typeof h.Light=="string"&&typeof c=="string"){const _=$.three.children.find(E=>E.uuid===h.Light);if(!(_&&_ instanceof Ct))return c;const{x,y:A,z:C}=JSON.parse(c),T=N(_.position,"x",x,{slider:!0,prefix:"X",suffix:"m",min:-50,max:50}),M=N(_.position,"y",A,{slider:!0,prefix:"Y",suffix:"m",min:-50,max:50}),S=N(_.position,"z",C,{slider:!0,prefix:"Z",suffix:"m",min:-50,max:50});return f`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${T}${M}${S}</div>
          `}return v==="Custom Effects"&&h.IsCEConfig&&m instanceof P&&typeof c=="boolean"?ad(m,c):v==="Color"&&h.IsOutlineConfig&&m instanceof P&&typeof c=="string"?id(m,c):v==="Tolerance"&&h.IsOutlineConfig&&m instanceof P&&typeof c=="number"?N(m.postproduction.customEffects,"tolerance",c,{slider:!0,min:0,max:6,step:.01}):v==="Outline"&&h.IsOutlineConfig&&m instanceof P&&typeof c=="boolean"?$e(m.postproduction.customEffects,"outlineEnabled",c):v==="Gloss"&&h.IsGlossConfig&&m instanceof P&&typeof c=="boolean"?$e(m.postproduction.customEffects,"glossEnabled",c):v==="Min"&&h.IsGlossConfig&&m instanceof P&&typeof c=="number"?N(m.postproduction.customEffects,"minGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):v==="Max"&&h.IsGlossConfig&&m instanceof P&&typeof c=="number"?N(m.postproduction.customEffects,"maxGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):v==="Exponent"&&h.IsGlossConfig&&m instanceof P&&typeof c=="number"?N(m.postproduction.customEffects,"glossExponent",c,{slider:!0,min:0,max:5,step:.01}):v==="Gamma Correction"&&h.IsGammaConfig&&m instanceof P&&typeof c=="boolean"?od(m,c):c}};const d=[];for(const[,c]of n.list){const{scene:h,camera:p,renderer:b}=c,$=St(e,c),y={data:{Name:c instanceof ea&&c.name||c.uuid},children:[]};if(h){const m={data:{Name:"Scene"}};if($){const x=`#${$.material.uniforms.uColor.value.getHexString()}`,A=JSON.stringify({x:$.material.uniforms.uSize1.value,y:$.material.uniforms.uSize2.value}),C={data:{Name:"Grid",Value:$.three.visible,World:c.uuid,IsGridConfig:!0},children:[{data:{Name:"Color",Value:x,World:c.uuid,IsGridConfig:!0}},{data:{Name:"Size",Value:A,World:c.uuid,IsGridConfig:!0}},{data:{Name:"Distance",Value:$.material.uniforms.uDistance.value,World:c.uuid,IsGridConfig:!0}}]};m.children||(m.children=[]),m.children.push(C)}const v=h.three.children.filter(x=>x instanceof fa);for(const x of v){const A={data:{Name:"Directional Light",Value:x.visible,World:c.uuid,Light:x.uuid},children:[{data:{Name:"Position",Value:JSON.stringify(x.position),World:c.uuid,Light:x.uuid}},{data:{Name:"Intensity",Value:x.intensity,World:c.uuid,Light:x.uuid}},{data:{Name:"Color",Value:`#${x.color.getHexString()}`,World:c.uuid,Light:x.uuid}}]};m.children||(m.children=[]),m.children.push(A)}const _=h.three.children.filter(x=>x instanceof ma);for(const x of _){const A={data:{Name:"Ambient Light",Value:x.visible,World:c.uuid,Light:x.uuid},children:[{data:{Name:"Intensity",Value:x.intensity,World:c.uuid,Light:x.uuid}},{data:{Name:"Color",Value:`#${x.color.getHexString()}`,World:c.uuid,Light:x.uuid}}]};m.children||(m.children=[]),m.children.push(A)}m.children&&((s=m.children)==null?void 0:s.length)>0&&((r=y.children)==null||r.push(m))}if(p.three instanceof an){const m={data:{Name:"Perspective Camera"},children:[{data:{Name:"Near Frustum",Value:p.three.near,World:c.uuid}},{data:{Name:"Far Frustum",Value:p.three.far,World:c.uuid}},{data:{Name:"Field of View",Value:p.three.fov,World:c.uuid}}]};if(p.hasCameraControls()){const{controls:v}=p,_={dollyDragInverted:"Invert Drag",dollySpeed:"Dolly Speed",truckSpeed:"Truck Speed",smoothTime:"Smooth Time"};for(const x in _){const A=v[x];A!=null&&((o=m.children)==null||o.push({data:{Name:_[x],Value:A,World:c.uuid}}))}}(l=y.children)==null||l.push(m)}if(b instanceof P){const{postproduction:m}=b,v=m.n8ao.configuration,_={data:{Name:"Renderer"},children:[{data:{Name:"Gamma Correction",Value:m.settings.gamma??!1,World:c.uuid,IsGammaConfig:!0}},{data:{Name:"Ambient Oclussion",Value:m.settings.ao??!1,World:c.uuid,IsAOConfig:!0},children:[{data:{Name:"Samples",Value:v.aoSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Color",Value:`#${v.color.getHexString()}`,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Half Resolution",Value:v.halfRes,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Screen Space Radius",Value:v.screenSpaceRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Radius",Value:v.aoRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Intensity",Value:v.intensity,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Distance Falloff",Value:v.distanceFalloff,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Samples",Value:v.denoiseSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Radius",Value:v.denoiseRadius,World:c.uuid,IsAOConfig:!0}}]},{data:{Name:"Custom Effects",Value:m.settings.custom??!1,World:c.uuid,IsCEConfig:!0},children:[{data:{Name:"Gloss",Value:m.customEffects.glossEnabled,World:c.uuid,IsGlossConfig:!0},children:[{data:{Name:"Min",Value:m.customEffects.minGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Max",Value:m.customEffects.maxGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Exponent",Value:m.customEffects.glossExponent,World:c.uuid,IsGlossConfig:!0}}]},{data:{Name:"Outline",Value:m.customEffects.outlineEnabled,World:c.uuid,IsOutlineConfig:!0},children:[{data:{Name:"Color",get Value(){const x=new dt(m.customEffects.lineColor),A=m.customEffects.opacity;return JSON.stringify({color:`#${x.getHexString()}`,opacity:A})},World:c.uuid,IsOutlineConfig:!0}},{data:{Name:"Tolerance",Value:m.customEffects.tolerance,World:c.uuid,IsOutlineConfig:!0}}]}]}]};(a=y.children)==null||a.push(_)}d.push(y)}u.columns=[{name:"Name",width:"11rem"}],u.hiddenColumns=["World","Light","IsAOConfig","IsCEConfig","IsGlossConfig","IsOutlineConfig","IsGammaConfig","IsGridConfig"],u.data=d})} headers-hidden expanded>
     <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No worlds to configure
      </bim-label>
    </bim-table>
  `},cd=(t,e=!0)=>{const n=z.create(ld,t);if(e){const[,i]=n,{components:s}=t;s.get(On).list.onItemDeleted.add(()=>i())}return n},ud=Object.freeze(Object.defineProperty({__proto__:null,worldsConfiguration:cd},Symbol.toStringTag,{value:"Module"})),Ze=(t,e)=>{const n=e[t],i=(n==null?void 0:n.name)??t,s=i.trim().split(/\s+/);let r,o;return s[0]&&s[0][0]&&(r=s[0][0].toUpperCase(),s[0][1]&&(o=s[0][1].toUpperCase())),s[1]&&s[1][0]&&(o=s[1][0].toUpperCase()),f`
    <div style="display: flex; gap: 0.25rem; overflow: hidden;">
      ${!(n!=null&&n.picture)&&(r||o)?f`
        <bim-label
          style=${ze({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${r}${o}</bim-label>
        `:null}
      <bim-label .img=${n==null?void 0:n.picture}>${i}</bim-label>
    </div>
  `},J={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#414141","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},Ke={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"var(--bim-ui_bg-contrast-100)"};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const An=globalThis,En=An.trustedTypes,Os=En?En.createPolicy("lit-html",{createHTML:t=>t}):void 0,Mo="$lit$",we=`lit$${Math.random().toFixed(9).slice(2)}$`,Po="?"+we,dd=`<${Po}>`,Ue=document,Ut=()=>Ue.createComment(""),Vt=t=>t===null||typeof t!="object"&&typeof t!="function",Ri=Array.isArray,hd=t=>Ri(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",ei=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ts=/-->/g,Is=/>/g,Pe=RegExp(`>|${ei}(?:([^\\s"'>=/]+)(${ei}*=${ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ns=/'/g,Ms=/"/g,Ro=/^(?:script|style|textarea|title)$/i,pd=t=>(e,...n)=>({_$litType$:t,strings:e,values:n}),Li=pd(1),lt=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),Ps=new WeakMap,Le=Ue.createTreeWalker(Ue,129);function Lo(t,e){if(!Ri(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Os!==void 0?Os.createHTML(e):e}const fd=(t,e)=>{const n=t.length-1,i=[];let s,r=e===2?"<svg>":e===3?"<math>":"",o=kt;for(let l=0;l<n;l++){const a=t[l];let u,d,c=-1,h=0;for(;h<a.length&&(o.lastIndex=h,d=o.exec(a),d!==null);)h=o.lastIndex,o===kt?d[1]==="!--"?o=Ts:d[1]!==void 0?o=Is:d[2]!==void 0?(Ro.test(d[2])&&(s=RegExp("</"+d[2],"g")),o=Pe):d[3]!==void 0&&(o=Pe):o===Pe?d[0]===">"?(o=s??kt,c=-1):d[1]===void 0?c=-2:(c=o.lastIndex-d[2].length,u=d[1],o=d[3]===void 0?Pe:d[3]==='"'?Ms:Ns):o===Ms||o===Ns?o=Pe:o===Ts||o===Is?o=kt:(o=Pe,s=void 0);const p=o===Pe&&t[l+1].startsWith("/>")?" ":"";r+=o===kt?a+dd:c>=0?(i.push(u),a.slice(0,c)+Mo+a.slice(c)+we+p):a+we+(c===-2?l:p)}return[Lo(t,r+(t[n]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class Wt{constructor({strings:e,_$litType$:n},i){let s;this.parts=[];let r=0,o=0;const l=e.length-1,a=this.parts,[u,d]=fd(e,n);if(this.el=Wt.createElement(u,i),Le.currentNode=this.el.content,n===2||n===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=Le.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(Mo)){const h=d[o++],p=s.getAttribute(c).split(we),b=/([.?@])?(.*)/.exec(h);a.push({type:1,index:r,name:b[2],strings:p,ctor:b[1]==="."?bd:b[1]==="?"?gd:b[1]==="@"?yd:Wn}),s.removeAttribute(c)}else c.startsWith(we)&&(a.push({type:6,index:r}),s.removeAttribute(c));if(Ro.test(s.tagName)){const c=s.textContent.split(we),h=c.length-1;if(h>0){s.textContent=En?En.emptyScript:"";for(let p=0;p<h;p++)s.append(c[p],Ut()),Le.nextNode(),a.push({type:2,index:++r});s.append(c[h],Ut())}}}else if(s.nodeType===8)if(s.data===Po)a.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(we,c+1))!==-1;)a.push({type:7,index:r}),c+=we.length-1}r++}}static createElement(e,n){const i=Ue.createElement("template");return i.innerHTML=e,i}}function ct(t,e,n=t,i){var s,r;if(e===lt)return e;let o=i!==void 0?(s=n._$Co)==null?void 0:s[i]:n._$Cl;const l=Vt(e)?void 0:e._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((r=o==null?void 0:o._$AO)==null||r.call(o,!1),l===void 0?o=void 0:(o=new l(t),o._$AT(t,n,i)),i!==void 0?(n._$Co??(n._$Co=[]))[i]=o:n._$Cl=o),o!==void 0&&(e=ct(t,o._$AS(t,e.values),o,i)),e}class md{constructor(e,n){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=n}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:n},parts:i}=this._$AD,s=((e==null?void 0:e.creationScope)??Ue).importNode(n,!0);Le.currentNode=s;let r=Le.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new sn(r,r.nextSibling,this,e):a.type===1?u=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(u=new vd(r,this,e)),this._$AV.push(u),a=i[++l]}o!==(a==null?void 0:a.index)&&(r=Le.nextNode(),o++)}return Le.currentNode=Ue,s}p(e){let n=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,n),n+=i.strings.length-2):i._$AI(e[n])),n++}}class sn{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,n,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=n,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const n=this._$AM;return n!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=n.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,n=this){e=ct(this,e,n),Vt(e)?e===j||e==null||e===""?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==lt&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):hd(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&Vt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ue.createTextNode(e)),this._$AH=e}$(e){var n;const{values:i,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Wt.createElement(Lo(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(i);else{const o=new md(r,this),l=o.u(this.options);o.p(i),this.T(l),this._$AH=o}}_$AC(e){let n=Ps.get(e.strings);return n===void 0&&Ps.set(e.strings,n=new Wt(e)),n}k(e){Ri(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let i,s=0;for(const r of e)s===n.length?n.push(i=new sn(this.O(Ut()),this.O(Ut()),this,this.options)):i=n[s],i._$AI(r),s++;s<n.length&&(this._$AR(i&&i._$AB.nextSibling,s),n.length=s)}_$AR(e=this._$AA.nextSibling,n){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,n);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var n;this._$AM===void 0&&(this._$Cv=e,(n=this._$AP)==null||n.call(this,e))}}class Wn{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,n,i,s,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=n,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,n=this,i,s){const r=this.strings;let o=!1;if(r===void 0)e=ct(this,e,n,0),o=!Vt(e)||e!==this._$AH&&e!==lt,o&&(this._$AH=e);else{const l=e;let a,u;for(e=r[0],a=0;a<r.length-1;a++)u=ct(this,l[i+a],n,a),u===lt&&(u=this._$AH[a]),o||(o=!Vt(u)||u!==this._$AH[a]),u===j?e=j:e!==j&&(e+=(u??"")+r[a+1]),this._$AH[a]=u}o&&!s&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class bd extends Wn{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class gd extends Wn{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class yd extends Wn{constructor(e,n,i,s,r){super(e,n,i,s,r),this.type=5}_$AI(e,n=this){if((e=ct(this,e,n,0)??j)===lt)return;const i=this._$AH,s=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var n;typeof this._$AH=="function"?this._$AH.call(((n=this.options)==null?void 0:n.host)??this.element,e):this._$AH.handleEvent(e)}}class vd{constructor(e,n,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=n,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ct(this,e)}}const Rs=An.litHtmlPolyfillSupport;Rs==null||Rs(Wt,sn),(An.litHtmlVersions??(An.litHtmlVersions=[])).push("3.2.1");const _d=(t,e,n)=>{const i=(n==null?void 0:n.renderBefore)??e;let s=i._$litPart$;if(s===void 0){const r=(n==null?void 0:n.renderBefore)??null;i._$litPart$=s=new sn(e.insertBefore(Ut(),r),r,void 0,n??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $d=t=>t.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xd={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},wd=t=>(...e)=>({_$litDirective$:t,values:e});let Cd=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,n){this._$Ct=t,this._$AM=e,this._$Ci=n}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=(t,e)=>{var n;const i=t._$AN;if(i===void 0)return!1;for(const s of i)(n=s._$AO)==null||n.call(s,e,!1),Mt(s,e);return!0},Sn=t=>{let e,n;do{if((e=t._$AM)===void 0)break;n=e._$AN,n.delete(t),t=e}while((n==null?void 0:n.size)===0)},jo=t=>{for(let e;e=t._$AM;t=e){let n=e._$AN;if(n===void 0)e._$AN=n=new Set;else if(n.has(t))break;n.add(t),Sd(e)}};function Ad(t){this._$AN!==void 0?(Sn(this),this._$AM=t,jo(this)):this._$AM=t}function Ed(t,e=!1,n=0){const i=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(i))for(let r=n;r<i.length;r++)Mt(i[r],!1),Sn(i[r]);else i!=null&&(Mt(i,!1),Sn(i));else Mt(this,t)}const Sd=t=>{t.type==xd.CHILD&&(t._$AP??(t._$AP=Ed),t._$AQ??(t._$AQ=Ad))};let kd=class extends Cd{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,n){super._$AT(t,e,n),jo(this),this.isConnected=t._$AU}_$AO(t,e=!0){var n,i;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(i=this.disconnected)==null||i.call(this)),e&&(Mt(this,t),Sn(this))}setValue(t){if($d(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gi=()=>new Od;let Od=class{};const ti=new WeakMap,Td=wd(class extends kd{render(t){return j}update(t,[e]){var n;const i=e!==this.Y;return i&&this.Y!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.Y=e,this.ht=(n=t.options)==null?void 0:n.host,this.rt(this.ct=t.element)),j}rt(t){if(this.isConnected||(t=void 0),typeof this.Y=="function"){const e=this.ht??globalThis;let n=ti.get(e);n===void 0&&(n=new WeakMap,ti.set(e,n)),n.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),n.set(this.Y,t),t!==void 0&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){var t,e;return typeof this.Y=="function"?(t=ti.get(this.ht??globalThis))==null?void 0:t.get(this.Y):(e=this.Y)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Id={dueDate:t=>{if(typeof t=="string"&&t.trim()!=="")return new Date(t)},status:t=>{if(Array.isArray(t)&&t.length!==0)return t[0]},type:t=>{if(Array.isArray(t)&&t.length!==0)return t[0]},priority:t=>{if(Array.isArray(t)&&t.length!==0)return t[0]},stage:t=>{if(Array.isArray(t)&&t.length!==0)return t[0]},assignedTo:t=>{if(Array.isArray(t)&&t.length!==0)return t[0]},labels:t=>{if(Array.isArray(t))return new Set(t)}},zo=t=>{const{components:e,topic:n,value:i,onCancel:s,onSubmit:r,styles:o}=t,l=r??(()=>{}),a=e.get(Tn),u=(i==null?void 0:i.title)??(n==null?void 0:n.title)??ve.default.title,d=(i==null?void 0:i.status)??(n==null?void 0:n.status)??ve.default.status,c=(i==null?void 0:i.type)??(n==null?void 0:n.type)??ve.default.type,h=(i==null?void 0:i.priority)??(n==null?void 0:n.priority)??ve.default.priority,p=(i==null?void 0:i.assignedTo)??(n==null?void 0:n.assignedTo)??ve.default.assignedTo,b=(i==null?void 0:i.labels)??(n==null?void 0:n.labels)??ve.default.labels,$=(i==null?void 0:i.stage)??(n==null?void 0:n.stage)??ve.default.stage,y=(i==null?void 0:i.description)??(n==null?void 0:n.description)??ve.default.description,m=n!=null&&n.dueDate?n.dueDate.toISOString().split("T")[0]:null,v=new Set([...a.config.statuses]);d&&v.add(d);const _=new Set([...a.config.types]);c&&_.add(c);const x=new Set([...a.config.priorities]);h&&x.add(h);const A=new Set([...a.config.users]);p&&A.add(p);const C=new Set([...a.config.labels]);if(b)for(const w of b)C.add(w);const T=new Set([...a.config.stages]);$&&T.add($);const M=gi(),S=async()=>{const{value:w}=M;if(!w)return;const L=Bt(w,Id);if(n)n.set(L),await l(n);else{const V=a.create(L);await l(V)}},E=gi(),B=w=>{const{value:L}=E;if(!L)return;const V=w.target;L.disabled=V.value.trim()===""},q=`btn-${W.newRandomId()}`,G=`btn-${W.newRandomId()}`;return f`
    <div ${Y(M)} style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; gap: 0.375rem">
        <bim-text-input @input=${B} vertical label="Title" name="title" .value=${u}></bim-text-input>
        ${n?f`
            <bim-dropdown vertical label="Status" name="status" required>
              ${[...v].map(w=>f`<bim-option label=${w} .checked=${d===w}></bim-option>`)}
            </bim-dropdown>`:f``}
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-dropdown vertical label="Type" name="type" required>
          ${[..._].map(w=>f`<bim-option label=${w} .checked=${c===w}></bim-option>`)}
        </bim-dropdown>
        <bim-dropdown vertical label="Priority" name="priority">
          ${[...x].map(w=>f`<bim-option label=${w} .checked=${h===w}></bim-option>`)}
        </bim-dropdown>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-dropdown vertical label="Labels" name="labels" multiple>
          ${[...C].map(w=>f`<bim-option label=${w} .checked=${b?[...b].includes(w):!1}></bim-option>`)}
        </bim-dropdown>
        <bim-dropdown vertical label="Assignee" name="assignedTo">
          ${[...A].map(w=>{const L=o!=null&&o.users?o.users[w]:null,V=L?L.name:w,K=L==null?void 0:L.picture;return f`<bim-option label=${V} value=${w} .img=${K} .checked=${p===w}></bim-option>`})}
        </bim-dropdown>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-text-input vertical type="date" label="Due Date" name="dueDate" .value=${m}></bim-text-input> 
        <bim-dropdown vertical label="Stage" name="stage">
          ${[...T].map(w=>f`<bim-option label=${w} .checked=${$===w}></bim-option>`)}
        </bim-dropdown>
      </div>
      <bim-text-input vertical label="Description" name="description" type="area" .value=${y??null}></bim-text-input>
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
        <bim-button id=${G} style="flex: 0" @click=${s} label="Cancel"></bim-button>
        <bim-button id=${q} style="flex: 0" @click=${S} ${Y(E)} label=${n?"Update Topic":"Add Topic"} icon=${n?"tabler:refresh":"mi:add"}></bim-button>
      </div>
    </div>
  `},Nd=t=>{const{components:e,dataStyles:n,onTopicEnter:i}=t,s=e.get(Tn),r=t.topics??s.list.values();return f`
    <bim-table no-indentation ${Y(o=>{if(!o)return;const l=o;l.hiddenColumns.length===0&&(l.hiddenColumns=["Guid"]),l.columns=["Title"],l.dataTransform={Title:(a,u)=>{const{Guid:d}=u;if(typeof d!="string")return a;const c=s.list.get(d);if(!c)return a;const h=`btn-${W.newRandomId()}`;return f`
          <div style="display: flex; overflow: hidden;">
            <style>
              #${h} {
                background-color: transparent
              }

              #${h}:hover {
                --bim-label--c: var(--bim-ui_accent-base)
              }
            </style>
            <bim-button @click=${()=>{i&&i(c)}} id=${h} icon="iconamoon:enter-duotone"></bim-button>
            <bim-label>${a}</bim-label>
          </div>
        `},Priority:a=>{if(typeof a!="string")return a;const u=((n==null?void 0:n.priorities)??J.priorities)[a];return f`
          <bim-label
            .icon=${u==null?void 0:u.icon}
            style=${ze({...Ke,...u==null?void 0:u.style})}
          >${a}
          </bim-label>
        `},Status:a=>{if(typeof a!="string")return a;const u=((n==null?void 0:n.statuses)??J.statuses)[a];return f`
          <bim-label
            .icon=${u==null?void 0:u.icon}
            style=${ze({...Ke,...u==null?void 0:u.style})}
          >${a}
          </bim-label>
        `},Type:a=>{if(typeof a!="string")return a;const u=((n==null?void 0:n.types)??J.types)[a];return f`
          <bim-label
            .icon=${u==null?void 0:u.icon}
            style=${ze({...Ke,...u==null?void 0:u.style})}
          >${a}
          </bim-label>
        `},Author:a=>typeof a!="string"?a:Ze(a,(n==null?void 0:n.users)??J.users),Assignee:a=>typeof a!="string"?a:Ze(a,(n==null?void 0:n.users)??J.users)},l.data=[...r].map(a=>{var u;return{data:{Guid:a.guid,Title:a.title,Status:a.status,Description:a.description??"",Author:a.creationAuthor,Assignee:a.assignedTo??"",Date:a.creationDate.toDateString(),DueDate:((u=a.dueDate)==null?void 0:u.toDateString())??"",Type:a.type,Priority:a.priority??""}}})})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">There are no topics to display</bim-label>
    </bim-table>
  `},Do=(t,e=!0)=>{const n=z.create(Nd,t);if(e){const{components:i,topics:s}=t,[,r]=n,o=i.get(Tn);if(o.list.onItemUpdated.add(()=>r()),o.list.onItemDeleted.add(()=>r()),s)for(const l of s)l.relatedTopics.onItemAdded.add(()=>r()),l.relatedTopics.onItemDeleted.add(()=>r()),l.relatedTopics.onCleared.add(()=>r());else o.list.onItemSet.add(()=>r())}return n},Md=Object.freeze(Object.defineProperty({__proto__:null,topicsList:Do},Symbol.toStringTag,{value:"Module"})),Pd=t=>{const{topic:e,styles:n,viewpoint:i}=t,s={delete:!0,...t.actions};return f`
    <bim-table no-indentation ${Y(r=>{if(!r)return;const o=r;o.headersHidden=!0,o.hiddenColumns=["guid","author"],o.dataTransform={Comment:(a,u)=>{const{guid:d}=u;if(typeof d!="string")return a;const c=e.comments.get(d);if(!c)return a;const h=()=>{e.comments.delete(d)},p=`btn-${W.newRandomId()}`;return f`
          <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1">
            <div style="display: flex; justify-content: space-between;">
              <div style="display: flex; gap: 0.375rem;">
                ${Ze(c.author,n??J.users)}
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
                ${s!=null&&s.delete?f`<bim-button @click=${h} id=${p} icon="majesticons:delete-bin"></bim-button>`:null}
              </div>
            </div>
            <bim-label style="margin-left: 1.7rem; white-space: normal">${c.comment}</bim-label>
          </div>
        `}};let l=e.comments.values();i&&(l=[...e.comments.values()].filter(a=>a.viewpoint===i)),o.data=[...l].map(a=>({data:{guid:a.guid,Comment:a.comment,author:(()=>{const u=n;if(!u)return a.author;const d=u[a.author];return(d==null?void 0:d.name)??a.author})()}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">This topic has no comments</bim-label>
    </bim-table>
  `},Ho=(t,e=!0)=>{const n=z.create(Pd,t);if(e){const{topic:i}=t,[s,r]=n;i.comments.onItemSet.add(()=>r()),i.comments.onItemUpdated.add(()=>r()),i.comments.onItemDeleted.add(()=>r()),i.comments.onCleared.add(()=>r())}return n},Rd=Object.freeze(Object.defineProperty({__proto__:null,topicComments:Ho},Symbol.toStringTag,{value:"Module"})),Ld=t=>{var e;const{components:n,topic:i}=t,s={selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!!i,...t.actions},r=n.get(yi),o=((e=t.topic)==null?void 0:e.viewpoints)??r.list.keys(),l=[];for(const a of o){const u=r.list.get(a);u&&l.push(u)}return f`
    <bim-table no-indentation ${Y(a=>{if(!a)return;const u=a;u.addEventListener("cellcreated",({detail:d})=>{const{cell:c}=d;c.style.padding="0.25rem"}),u.headersHidden=!0,u.hiddenColumns=["Guid"],u.columns=["Title",{name:"Actions",width:"auto"}],u.dataTransform={Actions:(d,c)=>{const{Guid:h}=c;if(!(h&&typeof h=="string"))return h||"";const p=r.list.get(h);return p?f`
          <bim-button icon="ph:eye-fill" @click=${()=>p.go()}></bim-button>
          ${Object.values(s).includes(!0)?f`
                <bim-button icon="prime:ellipsis-v">
                  <bim-context-menu>
                    ${s.selectComponents?f`<bim-button label="Select Components" @click=${()=>console.log(p.selection)}></bim-button> `:null}
                    ${s.colorizeComponent?f`<bim-button label="Colorize Components" @click=${()=>p.applyColors()}></bim-button> `:null}
                    ${s.resetColors?f`<bim-button label="Reset Colors" @click=${()=>p.resetColors()}></bim-button> `:null}
                    ${s.updateCamera?f`<bim-button label="Update Camera" @click=${()=>p.updateCamera()}></bim-button> `:null}
                    ${s.unlink?f`<bim-button .disabled=${!i} label="Unlink" @click=${()=>i==null?void 0:i.viewpoints.delete(p.guid)}></bim-button> `:null}
                    ${s.delete?f`<bim-button label="Delete" @click=${()=>r.list.delete(p.guid)}></bim-button>`:null}
                  </bim-context-menu>
                </bim-button>
              `:null}
        `:h}},u.data=l.map((d,c)=>({data:{Guid:d.guid,Title:d.title??`Viewpoint ${t.topic?c+1:""}`,Actions:""}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">No viewpoints to show</bim-label>
    </bim-table>
  `},Fo=(t,e=!0)=>{const n=z.create(Ld,t),{components:i,topic:s}=t;if(e){const[,r]=n,o=i.get(yi);o.list.onItemUpdated.add(()=>r()),o.list.onItemDeleted.add(()=>r()),o.list.onCleared.add(()=>r()),s?(s.viewpoints.onItemAdded.add(()=>r()),s.viewpoints.onItemDeleted.add(()=>r()),s.viewpoints.onCleared.add(()=>r())):o.list.onItemSet.add(()=>r())}return n},jd=Object.freeze(Object.defineProperty({__proto__:null,viewpointsList:Fo},Symbol.toStringTag,{value:"Module"}));({...Su,...Tu,...Mu,...Xu,...ed,...ud,...Md,...Rd,...jd});const zd=t=>f`
    <bim-panel-section fixed label="New Topic" name="topic">
      ${zo(t)}
    </bim-panel-section>
  `,Dd=t=>z.create(zd,t),Hd=Object.freeze(Object.defineProperty({__proto__:null,topic:Dd},Symbol.toStringTag,{value:"Module"}));({...Hd});const Fd=(t,e)=>{const{components:n,editing:i,topic:s,styles:r}=t,o={update:!0,...t.actions},l=(r==null?void 0:r.priorities)??J.priorities,a=(r==null?void 0:r.statuses)??J.statuses,u=(r==null?void 0:r.types)??J.types;let d;s!=null&&s.priority&&(d=l[s.priority]);let c;s!=null&&s.type&&(c=u[s.type]);let h;s!=null&&s.type&&(h=a[s.status]);let p,b;return i?p=zo({components:n,topic:s,styles:r,onSubmit:()=>{e({editing:!1})},onCancel:()=>{e({editing:!1})}}):b=f`
      <div>
        <bim-label>Title</bim-label>
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${s.title}</bim-label>
      </div>

      ${s.description?f`
            <div>
              <bim-label>Description</bim-label>
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100); white-space: normal">${s.description}</bim-label>
            </div>
          `:null}

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Status</bim-label>
        <bim-label .icon=${h==null?void 0:h.icon} style=${ze({...Ke,...h==null?void 0:h.style})}
        >${s.status}
        </bim-label>
      </div>

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Type</bim-label>
        <bim-label .icon=${c==null?void 0:c.icon} style=${ze({...Ke,...c==null?void 0:c.style})}
        >${s.type}
        </bim-label>
      </div>

      ${s.priority?f`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Priority</bim-label>
              <bim-label .icon=${d==null?void 0:d.icon} style=${ze({...Ke,...d==null?void 0:d.style})}
              >${s.priority}
              </bim-label>
            </div>`:null}

      <div style="display: flex; gap: 0.375rem">
        <bim-label>Author</bim-label>
        ${Ze(s.creationAuthor,(r==null?void 0:r.users)??J.users)}
      </div>

      ${s.assignedTo?f`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Assignee</bim-label>
            ${Ze(s.assignedTo,(r==null?void 0:r.users)??J.users)}
          </div>`:null}

      ${s.dueDate?f`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Due Date</bim-label>
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${s.dueDate.toDateString()}</bim-label>
          </div>`:null}

      ${s.modifiedAuthor?f`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Modified By</bim-label>
            ${Ze(s.modifiedAuthor,(r==null?void 0:r.users)??J.users)}
          </div>`:null}

      ${s.modifiedDate?f`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Modified Date</bim-label>
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${s.modifiedDate.toDateString()}</bim-label>
            </div>`:null}

      ${s.labels.size!==0?f`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Labels</bim-label>
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${[...s.labels].join(", ")}</bim-label>
          </div>`:null}

      ${o.update?f`
              <bim-button @click=${()=>e({editing:!0})} label="Update Information" icon="tabler:refresh"></bim-button> 
            `:null}
    `,f`
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${i?p:b}
    </div>
  `},Bd=t=>z.create(Fd,t),Ud=Object.freeze(Object.defineProperty({__proto__:null,topicInformation:Bd},Symbol.toStringTag,{value:"Module"})),Vd=(t,e)=>{const{showInput:n,topic:i,styles:s}=t,r={add:!0,delete:!0,...t.actions},o=`input-${W.newRandomId()}`,l=`btn-${W.newRandomId()}`,a=`btn-${W.newRandomId()}`,u=()=>document.getElementById(l),d=()=>document.getElementById(o),c=()=>{const _=d();return _?_.value.trim().length>0:!1},h=()=>{e({showInput:!0})},p=()=>{const _=d(),x=c();_&&x&&(i.createComment(_.value),e({showInput:!1}))},b=()=>{e({showInput:!1})},$=()=>{const _=u();if(_){if(!d()){_.disabled=!0;return}_.disabled=!c()}},y=f`
    ${r.add?f`<bim-button @click=${h} label="Add Comment" icon="majesticons:comment-line"></bim-button>`:null}
  `,m=f`
    <bim-text-input id=${o} @input=${$} @keypress=${_=>{_.code==="Enter"&&_.ctrlKey&&p()}} type="area"></bim-text-input>

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
  `,[v]=Ho({topic:i,actions:r,styles:s??J.users});return f`
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      ${v}
      ${n?m:y}
    </div>
  `},Wd=t=>z.create(Vd,t),Gd=Object.freeze(Object.defineProperty({__proto__:null,topicComments:Wd},Symbol.toStringTag,{value:"Module"})),Yd=(t,e)=>{const{components:n,topic:i,linking:s}=t,r=n.get(Tn),o={link:!0,...t.actions},[l,a]=Do({components:n,topics:[...i.relatedTopics].map(h=>r.list.get(h)).map(h=>h)});l.headersHidden=!0,l.hiddenColumns=["Guid","Status","Description","Author","Assignee","Date","DueDate","Type","Priority"];const u=()=>f`
      <bim-text-input placeholder="Search..." debounce="100" @input=${h=>{const p=h.target;p instanceof oe&&(l.queryString=p.value)}}></bim-text-input> 
    `;let d,c;if(s){l.selectableRows=!0,a({topics:void 0});const h=l.data.filter(m=>{const{Guid:v}=m.data;return typeof v!="string"?!1:i.relatedTopics.has(v)}).map(m=>m.data);l.selection=new Set(h);const p=()=>{const m=[...l.selection].map(({Guid:v})=>typeof v!="string"?null:r.list.has(v)?v:null).map(v=>v);i.relatedTopics.clear(),i.relatedTopics.add(...m),e({linking:!1})},b=()=>{e({linking:!1})},$=`btn-${W.newRandomId()}`,y=`btn-${W.newRandomId()}`;d=f`
      <div style="display: flex; gap: 0.25rem">
        <style>
          #${$}:hover {
            background-color: #329936;
          }  

          #${y} {
            background-color: transparent;
          }

          #${y}:hover {
            --bim-label--c: #FF5252;
          }
        </style>
        ${u()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          <bim-button id=${y} @click=${b} style="flex: 0" label="Cancel" icon="material-symbols:close"></bim-button>
          <bim-button id=${$} @click=${p} style="flex: 0" label="Accept" icon="material-symbols:check"></bim-button>
        </div>
      </div> 
    `}else{l.selectableRows=!1;const h=()=>{e({linking:!0})};c=f`
      <div style="display: flex; justify-content: right; gap: 0.25rem">
        ${u()}
        ${o.link?f`<bim-button style="flex: 0" @click=${h} icon="tabler:link"></bim-button>`:null}
      </div> 
    `}return f`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${c}
      ${d}
      ${l}
    </div> 
  `},qd=t=>z.create(Yd,t),Xd=Object.freeze(Object.defineProperty({__proto__:null,topicRelations:qd},Symbol.toStringTag,{value:"Module"})),Jd=(t,e)=>{const{components:n,topic:i,world:s,linking:r}=t,o={add:!0,link:!0,selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!0,...t.actions},l=n.get(yi),[a,u]=Fo({components:n,topic:i,actions:o}),d=()=>f`
      <bim-text-input placeholder="Search..." debounce="100" @input=${p=>{const b=p.target;b instanceof oe&&(a.queryString=b.value)}}></bim-text-input> 
    `;let c,h;if(r){a.selectableRows=!0,u({topic:void 0,actions:{delete:!1,updateCamera:!1,colorizeComponent:!1,resetColors:!1}});const p=a.data.filter(v=>{const{Guid:_}=v.data;return typeof _!="string"?!1:i.viewpoints.has(_)}).map(v=>v.data);a.selection=new Set(p);const b=()=>{const v=[...a.selection].map(({Guid:_})=>typeof _!="string"?null:l.list.has(_)?_:null).map(_=>_);i.viewpoints.clear(),i.viewpoints.add(...v),e({linking:!1})},$=()=>{e({linking:!1})},y=`btn-${W.newRandomId()}`,m=`btn-${W.newRandomId()}`;c=f`
      <div style="display: flex; gap: 0.25rem">
        <style>
          #${y}:hover {
            background-color: #329936;
          }  

          #${m} {
            background-color: transparent;
          }

          #${m}:hover {
            --bim-label--c: #FF5252;
          }
        </style>
        ${d()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          <bim-button id=${m} @click=${$} style="flex: 0" label="Cancel" icon="material-symbols:close"></bim-button>
          <bim-button id=${y} @click=${b} style="flex: 0" label="Accept" icon="material-symbols:check"></bim-button>
        </div>
      </div> 
    `}else{a.selectableRows=!1,u({topic:i,actions:o});const p=()=>{if(!(i&&s&&o.add&&!r))return;const m=l.create(s);i.viewpoints.add(m.guid)},b=()=>{e({linking:!0})},$=f`<bim-button style="flex: 0" @click=${p} .disabled=${!s} icon="mi:add"></bim-button>`,y=f`<bim-button style="flex: 0" @click=${b} icon="tabler:link"></bim-button>`;h=f`
      <div style="display: flex; justify-content: right; gap: 0.25rem">
        ${d()}
        <div style="display: flex; justify-content: right; gap: 0.25rem">
          ${o.add?$:null}
          ${o.link?y:null}
        </div>
      </div> 
    `}return f`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      ${h}
      ${c}
      ${a}
    </div> 
  `},Qd=t=>z.create(Jd,t),Zd=Object.freeze(Object.defineProperty({__proto__:null,topicViewpoints:Qd},Symbol.toStringTag,{value:"Module"}));({...Ud,...Gd,...Xd,...Zd});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fn=globalThis,ji=fn.ShadowRoot&&(fn.ShadyCSS===void 0||fn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zi=Symbol(),Ls=new WeakMap;let Bo=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==zi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ji&&t===void 0){const n=e!==void 0&&e.length===1;n&&(t=Ls.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Ls.set(e,t))}return t}toString(){return this.cssText}};const Kd=t=>new Bo(typeof t=="string"?t:t+"",void 0,zi),Di=(t,...e)=>{const n=t.length===1?t[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1],t[0]);return new Bo(n,t,zi)},eh=(t,e)=>{if(ji)t.adoptedStyleSheets=e.map(n=>n instanceof CSSStyleSheet?n:n.styleSheet);else for(const n of e){const i=document.createElement("style"),s=fn.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=n.cssText,t.appendChild(i)}},js=ji?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let n="";for(const i of e.cssRules)n+=i.cssText;return Kd(n)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:th,defineProperty:nh,getOwnPropertyDescriptor:ih,getOwnPropertyNames:sh,getOwnPropertySymbols:rh,getPrototypeOf:oh}=Object,ut=globalThis,zs=ut.trustedTypes,ah=zs?zs.emptyScript:"",Ds=ut.reactiveElementPolyfillSupport,Pt=(t,e)=>t,kn={toAttribute(t,e){switch(e){case Boolean:t=t?ah:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let n=t;switch(e){case Boolean:n=t!==null;break;case Number:n=t===null?null:Number(t);break;case Object:case Array:try{n=JSON.parse(t)}catch{n=null}}return n}},Hi=(t,e)=>!th(t,e),Hs={attribute:!0,type:String,converter:kn,reflect:!1,hasChanged:Hi};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ut.litPropertyMetadata??(ut.litPropertyMetadata=new WeakMap);class Je extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,n=Hs){if(n.state&&(n.attribute=!1),this._$Ei(),this.elementProperties.set(e,n),!n.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,n);s!==void 0&&nh(this.prototype,e,s)}}static getPropertyDescriptor(e,n,i){const{get:s,set:r}=ih(this.prototype,e)??{get(){return this[n]},set(o){this[n]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);r.call(this,o),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Hs}static _$Ei(){if(this.hasOwnProperty(Pt("elementProperties")))return;const e=oh(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Pt("properties"))){const n=this.properties,i=[...sh(n),...rh(n)];for(const s of i)this.createProperty(s,n[s])}const e=this[Symbol.metadata];if(e!==null){const n=litPropertyMetadata.get(e);if(n!==void 0)for(const[i,s]of n)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[n,i]of this.elementProperties){const s=this._$Eu(n,i);s!==void 0&&this._$Eh.set(s,n)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const n=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const s of i)n.unshift(js(s))}else e!==void 0&&n.push(js(e));return n}static _$Eu(e,n){const i=n.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(n=>n(this))}addController(e){var n;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((n=e.hostConnected)==null||n.call(e))}removeController(e){var n;(n=this._$EO)==null||n.delete(e)}_$E_(){const e=new Map,n=this.constructor.elementProperties;for(const i of n.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return eh(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(n=>{var i;return(i=n.hostConnected)==null?void 0:i.call(n)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(n=>{var i;return(i=n.hostDisconnected)==null?void 0:i.call(n)})}attributeChangedCallback(e,n,i){this._$AK(e,i)}_$EC(e,n){var i;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:kn).toAttribute(n,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,n){var i;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)==null?void 0:i.fromAttribute)!==void 0?o.converter:kn;this._$Em=r,this[r]=l.fromAttribute(n,o.type),this._$Em=null}}requestUpdate(e,n,i){if(e!==void 0){if(i??(i=this.constructor.getPropertyOptions(e)),!(i.hasChanged??Hi)(this[e],n))return;this.P(e,n,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,n,i){this._$AL.has(e)||this._$AL.set(e,n),i.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(n){Promise.reject(n)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let n=!1;const i=this._$AL;try{n=this.shouldUpdate(i),n?(this.willUpdate(i),(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(i)):this._$EU()}catch(s){throw n=!1,this._$EU(),s}n&&this._$AE(i)}willUpdate(e){}_$AE(e){var n;(n=this._$EO)==null||n.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(n=>this._$EC(n,this[n]))),this._$EU()}updated(e){}firstUpdated(e){}}Je.elementStyles=[],Je.shadowRootOptions={mode:"open"},Je[Pt("elementProperties")]=new Map,Je[Pt("finalized")]=new Map,Ds==null||Ds({ReactiveElement:Je}),(ut.reactiveElementVersions??(ut.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let De=class extends Je{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_d(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return lt}};var Fs;De._$litElement$=!0,De.finalized=!0,(Fs=globalThis.litElementHydrateSupport)==null||Fs.call(globalThis,{LitElement:De});const Bs=globalThis.litElementPolyfillSupport;Bs==null||Bs({LitElement:De});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lh={attribute:!0,type:String,converter:kn,reflect:!1,hasChanged:Hi},ch=(t=lh,e,n)=>{const{kind:i,metadata:s}=n;let r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),r.set(n.name,t),i==="accessor"){const{name:o}=n;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,t)},init(l){return l!==void 0&&this.P(o,void 0,t),l}}}if(i==="setter"){const{name:o}=n;return function(l){const a=this[o];e.call(this,l),this.requestUpdate(o,a,t)}}throw Error("Unsupported decorator location: "+i)};function X(t){return(e,n)=>typeof n=="object"?ch(t,e,n):((i,s,r)=>{const o=s.hasOwnProperty(r);return s.constructor.createProperty(r,o?{...i,wrapped:!0}:i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(t,e,n)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function uh(t){return X({...t,state:!0,attribute:!1})}class dh extends ba{constructor(e=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=e,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ga(.5,.5),this.addEventListener("removed",function(){this.traverse(function(n){n.element instanceof Element&&n.element.parentNode!==null&&n.element.parentNode.removeChild(n.element)})})}copy(e,n){return super.copy(e,n),this.element=e.element.cloneNode(!0),this.center=e.center,this}}new vi;new In;new In;new vi;new vi;class hh{constructor(e,n){this._group=new Fi,this._frustum=new ca,this._frustumMat=new In,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new ua({color:"#2e3338"}),this.numbers=new Fi,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._offsetX=0,this._offsetY=0,this._camera=e,this._container=n;const i=this.newGrid(-1),s=this.newGrid(-2);this.grids={main:i,secondary:s},this._group.add(s,i,this.numbers)}set scaleX(e){this._scaleX=e,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(e){this._scaleY=e,this.regenerate()}get scaleY(){return this._scaleY}set offsetX(e){this._offsetX=e,this.regenerate()}get offsetX(){return this._offsetX}set offsetY(e){this._offsetY=e,this.regenerate()}get offsetY(){return this._offsetY}get(){return this._group}dispose(){const{main:e,secondary:n}=this.grids;e.removeFromParent(),n.removeFromParent(),e.geometry.dispose(),e.material.dispose(),n.geometry.dispose(),n.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const e=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(e);const{planes:n}=this._frustum,i=n[0].constant*-n[0].normal.x,s=n[1].constant*-n[1].normal.x,r=n[2].constant*-n[2].normal.y,o=n[3].constant*-n[3].normal.y,l=Math.abs(i-s),a=Math.abs(o-r),{clientWidth:u,clientHeight:d}=this._container,c=Math.max(u,d),h=Math.max(l,a)/c,p=Math.ceil(Math.log10(l/this.scaleX)),b=Math.ceil(Math.log10(a/this.scaleY)),$=10**(p-2)*this.scaleX,y=10**(b-2)*this.scaleY,m=$*this.gridsFactor,v=y*this.gridsFactor,_=Math.ceil(a/v),x=Math.ceil(l/m),A=Math.ceil(a/y),C=Math.ceil(l/$),T=$*Math.ceil(s/$),M=y*Math.ceil(r/y),S=m*Math.ceil(s/m),E=v*Math.ceil(r/v),B=[...this.numbers.children];for(const U of B)U.removeFromParent();this.numbers.children=[];const q=[],G=9*h,w=1e4,L=S+this._offsetX,V=Math.round(Math.abs(L/this.scaleX)*w)/w,K=(x-1)*m,ee=Math.round(Math.abs((L+K)/this.scaleX)*w)/w,ce=Math.max(V,ee).toString().length*G;let xt=Math.ceil(ce/m)*m;for(let U=0;U<x;U++){let D=S+U*m;q.push(D,o,0,D,r,0),D=Math.round(D*w)/w,xt=Math.round(xt*w)/w;const wt=D%xt;if(!(m<1||v<1)&&Math.abs(wt)>.01)continue;const on=this.newNumber((D+this._offsetX)/this.scaleX),Yn=12*h;on.position.set(D,r+Yn,0)}for(let U=0;U<_;U++){const D=E+U*v;q.push(s,D,0,i,D,0);const wt=this.newNumber(D/this.scaleY);let on=12;wt.element.textContent&&(on+=4*wt.element.textContent.length);const Yn=on*h;wt.position.set(s+Yn,D,0)}const Gn=[];for(let U=0;U<C;U++){const D=T+U*$;Gn.push(D,o,0,D,r,0)}for(let U=0;U<A;U++){const D=M+U*y;Gn.push(s,D,0,i,D,0)}const Yo=new Bi(new Float32Array(q),3),qo=new Bi(new Float32Array(Gn),3),{main:Xo,secondary:Jo}=this.grids;Xo.geometry.setAttribute("position",Yo),Jo.geometry.setAttribute("position",qo)}newNumber(e){const n=document.createElement("bim-label");n.textContent=String(Math.round(e*100)/100);const i=new dh(n);return this.numbers.add(i),i}newGrid(e){const n=new da,i=new ha(n,this.material);return i.frustumCulled=!1,i.renderOrder=e,i}isGridReady(){const e=this._camera.projectionMatrix.elements;for(let n=0;n<e.length;n++){const i=e[n];if(Number.isNaN(i))return!1}return!0}}var ph=Object.defineProperty,fh=Object.getOwnPropertyDescriptor,rn=(t,e,n,i)=>{for(var s=fh(e,n),r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&ph(e,n,s),s};const Uo=class extends De{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(e){if(this._gridColor=e,!(e&&this._grid))return;const n=Number(e.replace("#","0x"));Number.isNaN(n)||this._grid.material.color.setHex(n)}get gridColor(){return this._gridColor}set gridScaleX(e){this._gridScaleX=e,e&&this._grid&&(this._grid.scaleX=e)}get gridScaleX(){return this._gridScaleX}set gridScaleY(e){this._gridScaleY=e,e&&this._grid&&(this._grid.scaleY=e)}get gridScaleY(){return this._gridScaleY}get gridOffsetX(){var e;return((e=this._grid)==null?void 0:e.offsetX)||0}set gridOffsetX(e){this._grid&&(this._grid.offsetX=e)}get gridOffsetY(){var e;return((e=this._grid)==null?void 0:e.offsetY)||0}set gridOffsetY(e){this._grid&&(this._grid.offsetY=e)}set components(e){this.dispose();const n=e.get(On).create();this._world=n,n.scene=new Us(e),n.scene.setup(),n.renderer=new la(e,this);const i=new Vs(e);n.camera=i;const s=new hh(i.threeOrtho,this);this._grid=s,n.scene.three.add(s.get()),i.controls.addEventListener("update",()=>s.regenerate()),setTimeout(async()=>{n.camera.updateAspect(),i.set("Plan"),await i.controls.setLookAt(0,0,100,0,0,0),await i.projection.set("Orthographic"),i.controls.dollySpeed=3,i.controls.draggingSmoothTime=.085,i.controls.maxZoom=1e3,i.controls.zoom(4)})}get world(){return this._world}dispose(){var e;(e=this.world)==null||e.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return Li`<slot></slot>`}};Uo.styles=Di`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let $t=Uo;rn([X({type:String,attribute:"grid-color",reflect:!0})],$t.prototype,"gridColor");rn([X({type:Number,attribute:"grid-scale-x",reflect:!0})],$t.prototype,"gridScaleX");rn([X({type:Number,attribute:"grid-scale-y",reflect:!0})],$t.prototype,"gridScaleY");rn([X({type:Number,attribute:"grid-offset-x",reflect:!0})],$t.prototype,"gridOffsetX");rn([X({type:Number,attribute:"grid-offset-y",reflect:!0})],$t.prototype,"gridOffsetY");var mh=Object.defineProperty,Ie=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&mh(e,n,s),s};const Vo=class extends De{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new In,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=e=>Math.abs(e)<1e-10?0:e}set camera(e){this._camera=e,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:e}=this._matrix;this._cssMatrix3D=`matrix3d(
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
    `}render(){const e=this.size??this._defaults.size;return Li`
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
    `}};Vo.styles=Di`
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
  `;let ye=Vo;Ie([X({type:Number,reflect:!0})],ye.prototype,"size");Ie([X({type:String,attribute:"right-text",reflect:!0})],ye.prototype,"rightText");Ie([X({type:String,attribute:"left-text",reflect:!0})],ye.prototype,"leftText");Ie([X({type:String,attribute:"top-text",reflect:!0})],ye.prototype,"topText");Ie([X({type:String,attribute:"bottom-text",reflect:!0})],ye.prototype,"bottomText");Ie([X({type:String,attribute:"front-text",reflect:!0})],ye.prototype,"frontText");Ie([X({type:String,attribute:"back-text",reflect:!0})],ye.prototype,"backText");Ie([uh()],ye.prototype,"_cssMatrix3D");var bh=Object.defineProperty,gh=(t,e,n,i)=>{for(var s=void 0,r=t.length-1,o;r>=0;r--)(o=t[r])&&(s=o(e,n,s)||s);return s&&bh(e,n,s),s};const Wo=class extends De{constructor(){super(...arguments),this.world=null,this._components=null,this._viewport=gi()}set components(e){var n;if(this._components=e,this.components){const i=this.components.get(On);this.world=i.create(),this.world.name=this.name}else(n=this.world)==null||n.dispose(),this.world=null}get components(){return this._components}connectedCallback(){super.connectedCallback(),this.world&&(this.world.enabled=!0)}disconnectedCallback(){super.disconnectedCallback(),this.world&&(this.world.enabled=!1)}dispose(){this.components=null,this.remove()}firstUpdated(){const{value:e}=this._viewport;if(!(this.components&&e&&this.world))return;const n=new Us(this.components);this.world.scene=n,n.setup(),n.three.background=null;const i=new P(this.components,e);this.world.renderer=i;const{postproduction:s}=i,r=new Vs(this.components);this.world.camera=r;const o=this.components.get(Ws).create(this.world);o.material.uniforms.uColor.value=new dt(4342338),o.material.uniforms.uSize1.value=2,o.material.uniforms.uSize2.value=8,s.enabled=!0,s.customEffects.excludedMeshes.push(o.three),s.setPasses({custom:!0,ao:!0,gamma:!0}),s.customEffects.lineColor=1513756}onSlotChange(){const e=new Event("slotchange");this.dispatchEvent(e)}render(){return Li` <bim-viewport ${Td(this._viewport)}>
      <slot @slotchange=${this.onSlotChange}></slot>
    </bim-viewport>`}};Wo.styles=Di``;let Go=Wo;gh([X({type:String,reflect:!0})],Go.prototype,"name");class Ch{static init(){W.defineCustomElement("bim-view-cube",ye),W.defineCustomElement("bim-world-2d",$t),W.defineCustomElement("bim-world",Go)}}export{Ch as w};
