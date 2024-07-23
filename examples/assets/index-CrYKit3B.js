import{C as Ki,i as _r,o as xr,h as It,a as Te,b as wr,S as $r,A as Cr,g as Er,d as Ar,B as tn}from"./index-CrrO1BJs.js";import{V as en,c as mi,G as xn,F as Sr,L as kr,d as wn,e as Or,f as Tr,P as Ge,g as he,D as Nr,A as Pr,C as Ne,O as Mr,h as Ir,I as Cs,i as Es,j as As,k as Lr,l as zr,m as Ss,n as ks,o as Os,p as Rr,R as jr}from"./web-ifc-api-CfQNUy7g.js";import{B as Hr,a as Dr,S as P}from"./index-BREiuDZQ.js";var Fr=Object.defineProperty,Br=(e,t,i)=>t in e?Fr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,Et=(e,t,i)=>(Br(e,typeof t!="symbol"?t+"":t,i),i);const Ut=Math.min,it=Math.max,ei=Math.round,bt=e=>({x:e,y:e}),Ur={left:"right",right:"left",bottom:"top",top:"bottom"},Vr={start:"end",end:"start"};function $n(e,t,i){return it(e,Ut(t,i))}function Pe(e,t){return typeof e=="function"?e(t):e}function nt(e){return e.split("-")[0]}function fi(e){return e.split("-")[1]}function Ts(e){return e==="x"?"y":"x"}function Ns(e){return e==="y"?"height":"width"}function Nt(e){return["top","bottom"].includes(nt(e))?"y":"x"}function Ps(e){return Ts(Nt(e))}function Wr(e,t,i){i===void 0&&(i=!1);const n=fi(e),s=Ps(e),o=Ns(s);let r=s==="x"?n===(i?"end":"start")?"right":"left":n==="start"?"bottom":"top";return t.reference[o]>t.floating[o]&&(r=ii(r)),[r,ii(r)]}function qr(e){const t=ii(e);return[Ri(e),t,Ri(t)]}function Ri(e){return e.replace(/start|end/g,t=>Vr[t])}function Gr(e,t,i){const n=["left","right"],s=["right","left"],o=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return i?t?s:n:t?n:s;case"left":case"right":return t?o:r;default:return[]}}function Yr(e,t,i,n){const s=fi(e);let o=Gr(nt(e),i==="start",n);return s&&(o=o.map(r=>r+"-"+s),t&&(o=o.concat(o.map(Ri)))),o}function ii(e){return e.replace(/left|right|bottom|top/g,t=>Ur[t])}function Xr(e){return{top:0,right:0,bottom:0,left:0,...e}}function Ms(e){return typeof e!="number"?Xr(e):{top:e,right:e,bottom:e,left:e}}function Vt(e){const{x:t,y:i,width:n,height:s}=e;return{width:n,height:s,top:i,left:t,right:t+n,bottom:i+s,x:t,y:i}}function Cn(e,t,i){let{reference:n,floating:s}=e;const o=Nt(t),r=Ps(t),a=Ns(r),l=nt(t),u=o==="y",h=n.x+n.width/2-s.width/2,c=n.y+n.height/2-s.height/2,d=n[a]/2-s[a]/2;let p;switch(l){case"top":p={x:h,y:n.y-s.height};break;case"bottom":p={x:h,y:n.y+n.height};break;case"right":p={x:n.x+n.width,y:c};break;case"left":p={x:n.x-s.width,y:c};break;default:p={x:n.x,y:n.y}}switch(fi(t)){case"start":p[r]-=d*(i&&u?-1:1);break;case"end":p[r]+=d*(i&&u?-1:1);break}return p}const Jr=async(e,t,i)=>{const{placement:n="bottom",strategy:s="absolute",middleware:o=[],platform:r}=i,a=o.filter(Boolean),l=await(r.isRTL==null?void 0:r.isRTL(t));let u=await r.getElementRects({reference:e,floating:t,strategy:s}),{x:h,y:c}=Cn(u,n,l),d=n,p={},y=0;for(let x=0;x<a.length;x++){const{name:b,fn:f}=a[x],{x:g,y:v,data:w,reset:C}=await f({x:h,y:c,initialPlacement:n,placement:d,strategy:s,middlewareData:p,rects:u,platform:r,elements:{reference:e,floating:t}});h=g??h,c=v??c,p={...p,[b]:{...p[b],...w}},C&&y<=50&&(y++,typeof C=="object"&&(C.placement&&(d=C.placement),C.rects&&(u=C.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:s}):C.rects),{x:h,y:c}=Cn(u,d,l)),x=-1)}return{x:h,y:c,placement:d,strategy:s,middlewareData:p}};async function nn(e,t){var i;t===void 0&&(t={});const{x:n,y:s,platform:o,rects:r,elements:a,strategy:l}=e,{boundary:u="clippingAncestors",rootBoundary:h="viewport",elementContext:c="floating",altBoundary:d=!1,padding:p=0}=Pe(t,e),y=Ms(p),x=a[d?c==="floating"?"reference":"floating":c],b=Vt(await o.getClippingRect({element:(i=await(o.isElement==null?void 0:o.isElement(x)))==null||i?x:x.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(a.floating)),boundary:u,rootBoundary:h,strategy:l})),f=c==="floating"?{x:n,y:s,width:r.floating.width,height:r.floating.height}:r.reference,g=await(o.getOffsetParent==null?void 0:o.getOffsetParent(a.floating)),v=await(o.isElement==null?void 0:o.isElement(g))?await(o.getScale==null?void 0:o.getScale(g))||{x:1,y:1}:{x:1,y:1},w=Vt(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:f,offsetParent:g,strategy:l}):f);return{top:(b.top-w.top+y.top)/v.y,bottom:(w.bottom-b.bottom+y.bottom)/v.y,left:(b.left-w.left+y.left)/v.x,right:(w.right-b.right+y.right)/v.x}}const Qr=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,n;const{placement:s,middlewareData:o,rects:r,initialPlacement:a,platform:l,elements:u}=t,{mainAxis:h=!0,crossAxis:c=!0,fallbackPlacements:d,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:y="none",flipAlignment:x=!0,...b}=Pe(e,t);if((i=o.arrow)!=null&&i.alignmentOffset)return{};const f=nt(s),g=Nt(a),v=nt(a)===a,w=await(l.isRTL==null?void 0:l.isRTL(u.floating)),C=d||(v||!x?[ii(a)]:qr(a)),$=y!=="none";!d&&$&&C.push(...Yr(a,x,y,w));const E=[a,...C],H=await nn(t,b),R=[];let k=((n=o.flip)==null?void 0:n.overflows)||[];if(h&&R.push(H[f]),c){const M=Wr(s,r,w);R.push(H[M[0]],H[M[1]])}if(k=[...k,{placement:s,overflows:R}],!R.every(M=>M<=0)){var lt,tt;const M=(((lt=o.flip)==null?void 0:lt.index)||0)+1,ut=E[M];if(ut)return{data:{index:M,overflows:k},reset:{placement:ut}};let J=(tt=k.filter(Q=>Q.overflows[0]<=0).sort((Q,B)=>Q.overflows[1]-B.overflows[1])[0])==null?void 0:tt.placement;if(!J)switch(p){case"bestFit":{var ct;const Q=(ct=k.filter(B=>{if($){const U=Nt(B.placement);return U===g||U==="y"}return!0}).map(B=>[B.placement,B.overflows.filter(U=>U>0).reduce((U,ce)=>U+ce,0)]).sort((B,U)=>B[1]-U[1])[0])==null?void 0:ct[0];Q&&(J=Q);break}case"initialPlacement":J=a;break}if(s!==J)return{reset:{placement:J}}}return{}}}};function Is(e){const t=Ut(...e.map(o=>o.left)),i=Ut(...e.map(o=>o.top)),n=it(...e.map(o=>o.right)),s=it(...e.map(o=>o.bottom));return{x:t,y:i,width:n-t,height:s-i}}function Zr(e){const t=e.slice().sort((s,o)=>s.y-o.y),i=[];let n=null;for(let s=0;s<t.length;s++){const o=t[s];!n||o.y-n.y>n.height/2?i.push([o]):i[i.length-1].push(o),n=o}return i.map(s=>Vt(Is(s)))}const Kr=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:n,rects:s,platform:o,strategy:r}=t,{padding:a=2,x:l,y:u}=Pe(e,t),h=Array.from(await(o.getClientRects==null?void 0:o.getClientRects(n.reference))||[]),c=Zr(h),d=Vt(Is(h)),p=Ms(a);function y(){if(c.length===2&&c[0].left>c[1].right&&l!=null&&u!=null)return c.find(b=>l>b.left-p.left&&l<b.right+p.right&&u>b.top-p.top&&u<b.bottom+p.bottom)||d;if(c.length>=2){if(Nt(i)==="y"){const k=c[0],lt=c[c.length-1],tt=nt(i)==="top",ct=k.top,M=lt.bottom,ut=tt?k.left:lt.left,J=tt?k.right:lt.right,Q=J-ut,B=M-ct;return{top:ct,bottom:M,left:ut,right:J,width:Q,height:B,x:ut,y:ct}}const b=nt(i)==="left",f=it(...c.map(k=>k.right)),g=Ut(...c.map(k=>k.left)),v=c.filter(k=>b?k.left===g:k.right===f),w=v[0].top,C=v[v.length-1].bottom,$=g,E=f,H=E-$,R=C-w;return{top:w,bottom:C,left:$,right:E,width:H,height:R,x:$,y:w}}return d}const x=await o.getElementRects({reference:{getBoundingClientRect:y},floating:n.floating,strategy:r});return s.reference.x!==x.reference.x||s.reference.y!==x.reference.y||s.reference.width!==x.reference.width||s.reference.height!==x.reference.height?{reset:{rects:x}}:{}}}};async function ta(e,t){const{placement:i,platform:n,elements:s}=e,o=await(n.isRTL==null?void 0:n.isRTL(s.floating)),r=nt(i),a=fi(i),l=Nt(i)==="y",u=["left","top"].includes(r)?-1:1,h=o&&l?-1:1,c=Pe(t,e);let{mainAxis:d,crossAxis:p,alignmentAxis:y}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...c};return a&&typeof y=="number"&&(p=a==="end"?y*-1:y),l?{x:p*h,y:d*u}:{x:d*u,y:p*h}}const Ls=function(e){return{name:"offset",options:e,async fn(t){var i,n;const{x:s,y:o,placement:r,middlewareData:a}=t,l=await ta(t,e);return r===((i=a.offset)==null?void 0:i.placement)&&(n=a.arrow)!=null&&n.alignmentOffset?{}:{x:s+l.x,y:o+l.y,data:{...l,placement:r}}}}},ea=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:n,placement:s}=t,{mainAxis:o=!0,crossAxis:r=!1,limiter:a={fn:b=>{let{x:f,y:g}=b;return{x:f,y:g}}},...l}=Pe(e,t),u={x:i,y:n},h=await nn(t,l),c=Nt(nt(s)),d=Ts(c);let p=u[d],y=u[c];if(o){const b=d==="y"?"top":"left",f=d==="y"?"bottom":"right",g=p+h[b],v=p-h[f];p=$n(g,p,v)}if(r){const b=c==="y"?"top":"left",f=c==="y"?"bottom":"right",g=y+h[b],v=y-h[f];y=$n(g,y,v)}const x=a.fn({...t,[d]:p,[c]:y});return{...x,data:{x:x.x-i,y:x.y-n}}}}};function gt(e){return zs(e)?(e.nodeName||"").toLowerCase():"#document"}function D(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function yt(e){var t;return(t=(zs(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function zs(e){return e instanceof Node||e instanceof D(e).Node}function st(e){return e instanceof Element||e instanceof D(e).Element}function Z(e){return e instanceof HTMLElement||e instanceof D(e).HTMLElement}function En(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof D(e).ShadowRoot}function Me(e){const{overflow:t,overflowX:i,overflowY:n,display:s}=W(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+i)&&!["inline","contents"].includes(s)}function ia(e){return["table","td","th"].includes(gt(e))}function na(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function sn(e){const t=on(),i=W(e);return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(i.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(i.contain||"").includes(n))}function sa(e){let t=Wt(e);for(;Z(t)&&!bi(t);){if(na(t))return null;if(sn(t))return t;t=Wt(t)}return null}function on(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function bi(e){return["html","body","#document"].includes(gt(e))}function W(e){return D(e).getComputedStyle(e)}function gi(e){return st(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function Wt(e){if(gt(e)==="html")return e;const t=e.assignedSlot||e.parentNode||En(e)&&e.host||yt(e);return En(t)?t.host:t}function Rs(e){const t=Wt(e);return bi(t)?e.ownerDocument?e.ownerDocument.body:e.body:Z(t)&&Me(t)?t:Rs(t)}function ji(e,t,i){var n;t===void 0&&(t=[]),i===void 0&&(i=!0);const s=Rs(e),o=s===((n=e.ownerDocument)==null?void 0:n.body),r=D(s);return o?t.concat(r,r.visualViewport||[],Me(s)?s:[],r.frameElement&&i?ji(r.frameElement):[]):t.concat(s,ji(s,[],i))}function js(e){const t=W(e);let i=parseFloat(t.width)||0,n=parseFloat(t.height)||0;const s=Z(e),o=s?e.offsetWidth:i,r=s?e.offsetHeight:n,a=ei(i)!==o||ei(n)!==r;return a&&(i=o,n=r),{width:i,height:n,$:a}}function Hs(e){return st(e)?e:e.contextElement}function Ft(e){const t=Hs(e);if(!Z(t))return bt(1);const i=t.getBoundingClientRect(),{width:n,height:s,$:o}=js(t);let r=(o?ei(i.width):i.width)/n,a=(o?ei(i.height):i.height)/s;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const oa=bt(0);function Ds(e){const t=D(e);return!on()||!t.visualViewport?oa:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function ra(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==D(e)?!1:t}function _e(e,t,i,n){t===void 0&&(t=!1),i===void 0&&(i=!1);const s=e.getBoundingClientRect(),o=Hs(e);let r=bt(1);t&&(n?st(n)&&(r=Ft(n)):r=Ft(e));const a=ra(o,i,n)?Ds(o):bt(0);let l=(s.left+a.x)/r.x,u=(s.top+a.y)/r.y,h=s.width/r.x,c=s.height/r.y;if(o){const d=D(o),p=n&&st(n)?D(n):n;let y=d,x=y.frameElement;for(;x&&n&&p!==y;){const b=Ft(x),f=x.getBoundingClientRect(),g=W(x),v=f.left+(x.clientLeft+parseFloat(g.paddingLeft))*b.x,w=f.top+(x.clientTop+parseFloat(g.paddingTop))*b.y;l*=b.x,u*=b.y,h*=b.x,c*=b.y,l+=v,u+=w,y=D(x),x=y.frameElement}}return Vt({width:h,height:c,x:l,y:u})}const aa=[":popover-open",":modal"];function Fs(e){return aa.some(t=>{try{return e.matches(t)}catch{return!1}})}function la(e){let{elements:t,rect:i,offsetParent:n,strategy:s}=e;const o=s==="fixed",r=yt(n),a=t?Fs(t.floating):!1;if(n===r||a&&o)return i;let l={scrollLeft:0,scrollTop:0},u=bt(1);const h=bt(0),c=Z(n);if((c||!c&&!o)&&((gt(n)!=="body"||Me(r))&&(l=gi(n)),Z(n))){const d=_e(n);u=Ft(n),h.x=d.x+n.clientLeft,h.y=d.y+n.clientTop}return{width:i.width*u.x,height:i.height*u.y,x:i.x*u.x-l.scrollLeft*u.x+h.x,y:i.y*u.y-l.scrollTop*u.y+h.y}}function ca(e){return Array.from(e.getClientRects())}function Bs(e){return _e(yt(e)).left+gi(e).scrollLeft}function ua(e){const t=yt(e),i=gi(e),n=e.ownerDocument.body,s=it(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),o=it(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight);let r=-i.scrollLeft+Bs(e);const a=-i.scrollTop;return W(n).direction==="rtl"&&(r+=it(t.clientWidth,n.clientWidth)-s),{width:s,height:o,x:r,y:a}}function ha(e,t){const i=D(e),n=yt(e),s=i.visualViewport;let o=n.clientWidth,r=n.clientHeight,a=0,l=0;if(s){o=s.width,r=s.height;const u=on();(!u||u&&t==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}return{width:o,height:r,x:a,y:l}}function da(e,t){const i=_e(e,!0,t==="fixed"),n=i.top+e.clientTop,s=i.left+e.clientLeft,o=Z(e)?Ft(e):bt(1),r=e.clientWidth*o.x,a=e.clientHeight*o.y,l=s*o.x,u=n*o.y;return{width:r,height:a,x:l,y:u}}function An(e,t,i){let n;if(t==="viewport")n=ha(e,i);else if(t==="document")n=ua(yt(e));else if(st(t))n=da(t,i);else{const s=Ds(e);n={...t,x:t.x-s.x,y:t.y-s.y}}return Vt(n)}function Us(e,t){const i=Wt(e);return i===t||!st(i)||bi(i)?!1:W(i).position==="fixed"||Us(i,t)}function pa(e,t){const i=t.get(e);if(i)return i;let n=ji(e,[],!1).filter(a=>st(a)&&gt(a)!=="body"),s=null;const o=W(e).position==="fixed";let r=o?Wt(e):e;for(;st(r)&&!bi(r);){const a=W(r),l=sn(r);!l&&a.position==="fixed"&&(s=null),(o?!l&&!s:!l&&a.position==="static"&&s&&["absolute","fixed"].includes(s.position)||Me(r)&&!l&&Us(e,r))?n=n.filter(u=>u!==r):s=a,r=Wt(r)}return t.set(e,n),n}function ma(e){let{element:t,boundary:i,rootBoundary:n,strategy:s}=e;const o=[...i==="clippingAncestors"?pa(t,this._c):[].concat(i),n],r=o[0],a=o.reduce((l,u)=>{const h=An(t,u,s);return l.top=it(h.top,l.top),l.right=Ut(h.right,l.right),l.bottom=Ut(h.bottom,l.bottom),l.left=it(h.left,l.left),l},An(t,r,s));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function fa(e){const{width:t,height:i}=js(e);return{width:t,height:i}}function ba(e,t,i){const n=Z(t),s=yt(t),o=i==="fixed",r=_e(e,!0,o,t);let a={scrollLeft:0,scrollTop:0};const l=bt(0);if(n||!n&&!o)if((gt(t)!=="body"||Me(s))&&(a=gi(t)),n){const c=_e(t,!0,o,t);l.x=c.x+t.clientLeft,l.y=c.y+t.clientTop}else s&&(l.x=Bs(s));const u=r.left+a.scrollLeft-l.x,h=r.top+a.scrollTop-l.y;return{x:u,y:h,width:r.width,height:r.height}}function Sn(e,t){return!Z(e)||W(e).position==="fixed"?null:t?t(e):e.offsetParent}function Vs(e,t){const i=D(e);if(!Z(e)||Fs(e))return i;let n=Sn(e,t);for(;n&&ia(n)&&W(n).position==="static";)n=Sn(n,t);return n&&(gt(n)==="html"||gt(n)==="body"&&W(n).position==="static"&&!sn(n))?i:n||sa(e)||i}const ga=async function(e){const t=this.getOffsetParent||Vs,i=this.getDimensions;return{reference:ba(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function va(e){return W(e).direction==="rtl"}const ya={convertOffsetParentRelativeRectToViewportRelativeRect:la,getDocumentElement:yt,getClippingRect:ma,getOffsetParent:Vs,getElementRects:ga,getClientRects:ca,getDimensions:fa,getScale:Ft,isElement:st,isRTL:va},Ws=ea,qs=Qr,Gs=Kr,Ys=(e,t,i)=>{const n=new Map,s={platform:ya,...i},o={...s.platform,_c:n};return Jr(e,t,{...s,platform:o})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qe=globalThis,rn=Qe.ShadowRoot&&(Qe.ShadyCSS===void 0||Qe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,an=Symbol(),kn=new WeakMap;let Xs=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==an)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(rn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=kn.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&kn.set(t,e))}return e}toString(){return this.cssText}};const _a=e=>new Xs(typeof e=="string"?e:e+"",void 0,an),O=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,s,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new Xs(i,e,an)},xa=(e,t)=>{if(rn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),s=Qe.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)}},On=rn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return _a(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:wa,defineProperty:$a,getOwnPropertyDescriptor:Ca,getOwnPropertyNames:Ea,getOwnPropertySymbols:Aa,getPrototypeOf:Sa}=Object,qt=globalThis,Tn=qt.trustedTypes,ka=Tn?Tn.emptyScript:"",Nn=qt.reactiveElementPolyfillSupport,fe=(e,t)=>e,ni={toAttribute(e,t){switch(t){case Boolean:e=e?ka:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},ln=(e,t)=>!wa(e,t),Pn={attribute:!0,type:String,converter:ni,reflect:!1,hasChanged:ln};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),qt.litPropertyMetadata??(qt.litPropertyMetadata=new WeakMap);class Ht extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Pn){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),s=this.getPropertyDescriptor(t,n,i);s!==void 0&&$a(this.prototype,t,s)}}static getPropertyDescriptor(t,i,n){const{get:s,set:o}=Ca(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return s==null?void 0:s.call(this)},set(r){const a=s==null?void 0:s.call(this);o.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Pn}static _$Ei(){if(this.hasOwnProperty(fe("elementProperties")))return;const t=Sa(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(fe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(fe("properties"))){const i=this.properties,n=[...Ea(i),...Aa(i)];for(const s of n)this.createProperty(s,i[s])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,s]of i)this.elementProperties.set(n,s)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const s=this._$Eu(i,n);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const s of n)i.unshift(On(s))}else t!==void 0&&i.push(On(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xa(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const r=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:ni).toAttribute(i,s.type);this._$Em=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(t,i){var n;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const r=s.getPropertyOptions(o),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:ni;this._$Em=o,this[o]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??ln)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,r]of s)r.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(n)):this._$EU()}catch(s){throw i=!1,this._$EU(),s}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var s;return(s=n.hostUpdated)==null?void 0:s.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Ht.elementStyles=[],Ht.shadowRootOptions={mode:"open"},Ht[fe("elementProperties")]=new Map,Ht[fe("finalized")]=new Map,Nn==null||Nn({ReactiveElement:Ht}),(qt.reactiveElementVersions??(qt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const si=globalThis,oi=si.trustedTypes,Mn=oi?oi.createPolicy("lit-html",{createHTML:e=>e}):void 0,Js="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,Qs="?"+pt,Oa=`<${Qs}>`,Pt=document,xe=()=>Pt.createComment(""),we=e=>e===null||typeof e!="object"&&typeof e!="function",Zs=Array.isArray,Ta=e=>Zs(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ti=`[ 	
\f\r]`,de=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,In=/-->/g,Ln=/>/g,At=RegExp(`>|${Ti}(?:([^\\s"'>=/]+)(${Ti}*=${Ti}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zn=/'/g,Rn=/"/g,Ks=/^(?:script|style|textarea|title)$/i,Na=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),_=Na(1),Gt=Symbol.for("lit-noChange"),N=Symbol.for("lit-nothing"),jn=new WeakMap,kt=Pt.createTreeWalker(Pt,129);function to(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Mn!==void 0?Mn.createHTML(t):t}const Pa=(e,t)=>{const i=e.length-1,n=[];let s,o=t===2?"<svg>":"",r=de;for(let a=0;a<i;a++){const l=e[a];let u,h,c=-1,d=0;for(;d<l.length&&(r.lastIndex=d,h=r.exec(l),h!==null);)d=r.lastIndex,r===de?h[1]==="!--"?r=In:h[1]!==void 0?r=Ln:h[2]!==void 0?(Ks.test(h[2])&&(s=RegExp("</"+h[2],"g")),r=At):h[3]!==void 0&&(r=At):r===At?h[0]===">"?(r=s??de,c=-1):h[1]===void 0?c=-2:(c=r.lastIndex-h[2].length,u=h[1],r=h[3]===void 0?At:h[3]==='"'?Rn:zn):r===Rn||r===zn?r=At:r===In||r===Ln?r=de:(r=At,s=void 0);const p=r===At&&e[a+1].startsWith("/>")?" ":"";o+=r===de?l+Oa:c>=0?(n.push(u),l.slice(0,c)+Js+l.slice(c)+pt+p):l+pt+(c===-2?a:p)}return[to(e,o+(e[i]||"<?>")+(t===2?"</svg>":"")),n]};class $e{constructor({strings:t,_$litType$:i},n){let s;this.parts=[];let o=0,r=0;const a=t.length-1,l=this.parts,[u,h]=Pa(t,i);if(this.el=$e.createElement(u,n),kt.currentNode=this.el.content,i===2){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=kt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(Js)){const d=h[r++],p=s.getAttribute(c).split(pt),y=/([.?@])?(.*)/.exec(d);l.push({type:1,index:o,name:y[2],strings:p,ctor:y[1]==="."?Ia:y[1]==="?"?La:y[1]==="@"?za:vi}),s.removeAttribute(c)}else c.startsWith(pt)&&(l.push({type:6,index:o}),s.removeAttribute(c));if(Ks.test(s.tagName)){const c=s.textContent.split(pt),d=c.length-1;if(d>0){s.textContent=oi?oi.emptyScript:"";for(let p=0;p<d;p++)s.append(c[p],xe()),kt.nextNode(),l.push({type:2,index:++o});s.append(c[d],xe())}}}else if(s.nodeType===8)if(s.data===Qs)l.push({type:2,index:o});else{let c=-1;for(;(c=s.data.indexOf(pt,c+1))!==-1;)l.push({type:7,index:o}),c+=pt.length-1}o++}}static createElement(t,i){const n=Pt.createElement("template");return n.innerHTML=t,n}}function Yt(e,t,i=e,n){var s,o;if(t===Gt)return t;let r=n!==void 0?(s=i._$Co)==null?void 0:s[n]:i._$Cl;const a=we(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((o=r==null?void 0:r._$AO)==null||o.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i._$Co??(i._$Co=[]))[n]=r:i._$Cl=r),r!==void 0&&(t=Yt(e,r._$AS(e,t.values),r,n)),t}class Ma{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,s=((t==null?void 0:t.creationScope)??Pt).importNode(i,!0);kt.currentNode=s;let o=kt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let u;l.type===2?u=new Ie(o,o.nextSibling,this,t):l.type===1?u=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(u=new Ra(o,this,t)),this._$AV.push(u),l=n[++a]}r!==(l==null?void 0:l.index)&&(o=kt.nextNode(),r++)}return kt.currentNode=Pt,s}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class Ie{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,n,s){this.type=2,this._$AH=N,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=Yt(this,t,i),we(t)?t===N||t==null||t===""?(this._$AH!==N&&this._$AR(),this._$AH=N):t!==this._$AH&&t!==Gt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ta(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==N&&we(this._$AH)?this._$AA.nextSibling.data=t:this.T(Pt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=$e.createElement(to(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===o)this._$AH.p(n);else{const r=new Ma(o,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=jn.get(t.strings);return i===void 0&&jn.set(t.strings,i=new $e(t)),i}k(t){Zs(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,s=0;for(const o of t)s===i.length?i.push(n=new Ie(this.S(xe()),this.S(xe()),this,this.options)):n=i[s],n._$AI(o),s++;s<i.length&&(this._$AR(n&&n._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class vi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,s,o){this.type=1,this._$AH=N,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=N}_$AI(t,i=this,n,s){const o=this.strings;let r=!1;if(o===void 0)t=Yt(this,t,i,0),r=!we(t)||t!==this._$AH&&t!==Gt,r&&(this._$AH=t);else{const a=t;let l,u;for(t=o[0],l=0;l<o.length-1;l++)u=Yt(this,a[n+l],i,l),u===Gt&&(u=this._$AH[l]),r||(r=!we(u)||u!==this._$AH[l]),u===N?t=N:t!==N&&(t+=(u??"")+o[l+1]),this._$AH[l]=u}r&&!s&&this.j(t)}j(t){t===N?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ia extends vi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===N?void 0:t}}class La extends vi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==N)}}class za extends vi{constructor(t,i,n,s,o){super(t,i,n,s,o),this.type=5}_$AI(t,i=this){if((t=Yt(this,t,i,0)??N)===Gt)return;const n=this._$AH,s=t===N&&n!==N||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==N&&(n===N||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Ra{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Yt(this,t)}}const Hn=si.litHtmlPolyfillSupport;Hn==null||Hn($e,Ie),(si.litHtmlVersions??(si.litHtmlVersions=[])).push("3.1.4");const Xt=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let s=n._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;n._$litPart$=s=new Ie(t.insertBefore(xe(),o),o,void 0,i??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let S=class extends Ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Xt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Gt}};var Dn;S._$litElement$=!0,S.finalized=!0,(Dn=globalThis.litElementHydrateSupport)==null||Dn.call(globalThis,{LitElement:S});const Fn=globalThis.litElementPolyfillSupport;Fn==null||Fn({LitElement:S});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.6");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ja={attribute:!0,type:String,converter:ni,reflect:!1,hasChanged:ln},Ha=(e=ja,t,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function m(e){return(t,i)=>typeof i=="object"?Ha(e,t,i):((n,s,o)=>{const r=s.hasOwnProperty(o);return s.constructor.createProperty(o,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(s,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Le(e){return m({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Da=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fa={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ba=e=>(...t)=>({_$litDirective$:e,values:t});let Ua=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const be=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const s of n)(i=s._$AO)==null||i.call(s,t,!1),be(s,t);return!0},ri=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},eo=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),qa(t)}};function Va(e){this._$AN!==void 0?(ri(this),this._$AM=e,eo(this)):this._$AM=e}function Wa(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(n))for(let o=i;o<n.length;o++)be(n[o],!1),ri(n[o]);else n!=null&&(be(n,!1),ri(n));else be(this,e)}const qa=e=>{e.type==Fa.CHILD&&(e._$AP??(e._$AP=Wa),e._$AQ??(e._$AQ=Va))};class Ga extends Ua{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,n){super._$AT(t,i,n),eo(this),this.isConnected=t._$AU}_$AO(t,i=!0){var n,s;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(s=this.disconnected)==null||s.call(this)),i&&(be(this,t),ri(this))}setValue(t){if(Da(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=()=>new Ya;class Ya{}const Ni=new WeakMap,G=Ba(class extends Ga{render(e){return N}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),N}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=Ni.get(t);i===void 0&&(i=new WeakMap,Ni.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Ni.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const io=Object.freeze({left:0,top:0,width:16,height:16}),ai=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),ze=Object.freeze({...io,...ai}),Hi=Object.freeze({...ze,body:"",hidden:!1}),Xa=Object.freeze({width:null,height:null}),no=Object.freeze({...Xa,...ai});function Ja(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function n(s){for(;s<0;)s+=4;return s%4}if(i===""){const s=parseInt(e);return isNaN(s)?0:n(s)}else if(i!==e){let s=0;switch(i){case"%":s=25;break;case"deg":s=90}if(s){let o=parseFloat(e.slice(0,e.length-i.length));return isNaN(o)?0:(o=o/s,o%1===0?n(o):0)}}return t}const Qa=/[\s,]+/;function Za(e,t){t.split(Qa).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const so={...no,preserveAspectRatio:""};function Bn(e){const t={...so},i=(n,s)=>e.getAttribute(n)||s;return t.width=i("width",null),t.height=i("height",null),t.rotate=Ja(i("rotate","")),Za(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function Ka(e,t){for(const i in so)if(e[i]!==t[i])return!0;return!1}const ge=/^[a-z0-9]+(-[a-z0-9]+)*$/,Re=(e,t,i,n="")=>{const s=e.split(":");if(e.slice(0,1)==="@"){if(s.length<2||s.length>3)return null;n=s.shift().slice(1)}if(s.length>3||!s.length)return null;if(s.length>1){const a=s.pop(),l=s.pop(),u={provider:s.length>0?s[0]:n,prefix:l,name:a};return t&&!Ze(u)?null:u}const o=s[0],r=o.split("-");if(r.length>1){const a={provider:n,prefix:r.shift(),name:r.join("-")};return t&&!Ze(a)?null:a}if(i&&n===""){const a={provider:n,prefix:"",name:o};return t&&!Ze(a,i)?null:a}return null},Ze=(e,t)=>e?!!((e.provider===""||e.provider.match(ge))&&(t&&e.prefix===""||e.prefix.match(ge))&&e.name.match(ge)):!1;function tl(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const n=((e.rotate||0)+(t.rotate||0))%4;return n&&(i.rotate=n),i}function Un(e,t){const i=tl(e,t);for(const n in Hi)n in ai?n in e&&!(n in i)&&(i[n]=ai[n]):n in t?i[n]=t[n]:n in e&&(i[n]=e[n]);return i}function el(e,t){const i=e.icons,n=e.aliases||Object.create(null),s=Object.create(null);function o(r){if(i[r])return s[r]=[];if(!(r in s)){s[r]=null;const a=n[r]&&n[r].parent,l=a&&o(a);l&&(s[r]=[a].concat(l))}return s[r]}return Object.keys(i).concat(Object.keys(n)).forEach(o),s}function il(e,t,i){const n=e.icons,s=e.aliases||Object.create(null);let o={};function r(a){o=Un(n[a]||s[a],o)}return r(t),i.forEach(r),Un(e,o)}function oo(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(s=>{t(s,null),i.push(s)});const n=el(e);for(const s in n){const o=n[s];o&&(t(s,il(e,s,o)),i.push(s))}return i}const nl={provider:"",aliases:{},not_found:{},...io};function Pi(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function ro(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Pi(e,nl))return null;const i=t.icons;for(const s in i){const o=i[s];if(!s.match(ge)||typeof o.body!="string"||!Pi(o,Hi))return null}const n=t.aliases||Object.create(null);for(const s in n){const o=n[s],r=o.parent;if(!s.match(ge)||typeof r!="string"||!i[r]&&!n[r]||!Pi(o,Hi))return null}return t}const li=Object.create(null);function sl(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function vt(e,t){const i=li[e]||(li[e]=Object.create(null));return i[t]||(i[t]=sl(e,t))}function cn(e,t){return ro(t)?oo(t,(i,n)=>{n?e.icons[i]=n:e.missing.add(i)}):[]}function ol(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function rl(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(li)).forEach(n=>{(typeof n=="string"&&typeof t=="string"?[t]:Object.keys(li[n]||{})).forEach(s=>{const o=vt(n,s);i=i.concat(Object.keys(o.icons).map(r=>(n!==""?"@"+n+":":"")+s+":"+r))})}),i}let Ce=!1;function ao(e){return typeof e=="boolean"&&(Ce=e),Ce}function Ee(e){const t=typeof e=="string"?Re(e,!0,Ce):e;if(t){const i=vt(t.provider,t.prefix),n=t.name;return i.icons[n]||(i.missing.has(n)?null:void 0)}}function lo(e,t){const i=Re(e,!0,Ce);if(!i)return!1;const n=vt(i.provider,i.prefix);return ol(n,i.name,t)}function Vn(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),Ce&&!t&&!e.prefix){let s=!1;return ro(e)&&(e.prefix="",oo(e,(o,r)=>{r&&lo(o,r)&&(s=!0)})),s}const i=e.prefix;if(!Ze({provider:t,prefix:i,name:"a"}))return!1;const n=vt(t,i);return!!cn(n,e)}function Wn(e){return!!Ee(e)}function al(e){const t=Ee(e);return t?{...ze,...t}:null}function ll(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((s,o)=>s.provider!==o.provider?s.provider.localeCompare(o.provider):s.prefix!==o.prefix?s.prefix.localeCompare(o.prefix):s.name.localeCompare(o.name));let n={provider:"",prefix:"",name:""};return e.forEach(s=>{if(n.name===s.name&&n.prefix===s.prefix&&n.provider===s.provider)return;n=s;const o=s.provider,r=s.prefix,a=s.name,l=i[o]||(i[o]=Object.create(null)),u=l[r]||(l[r]=vt(o,r));let h;a in u.icons?h=t.loaded:r===""||u.missing.has(a)?h=t.missing:h=t.pending;const c={provider:o,prefix:r,name:a};h.push(c)}),t}function co(e,t){e.forEach(i=>{const n=i.loaderCallbacks;n&&(i.loaderCallbacks=n.filter(s=>s.id!==t))})}function cl(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const n=e.provider,s=e.prefix;t.forEach(o=>{const r=o.icons,a=r.pending.length;r.pending=r.pending.filter(l=>{if(l.prefix!==s)return!0;const u=l.name;if(e.icons[u])r.loaded.push({provider:n,prefix:s,name:u});else if(e.missing.has(u))r.missing.push({provider:n,prefix:s,name:u});else return i=!0,!0;return!1}),r.pending.length!==a&&(i||co([e],o.id),o.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),o.abort))})}))}let ul=0;function hl(e,t,i){const n=ul++,s=co.bind(null,i,n);if(!t.pending.length)return s;const o={id:n,icons:t,callback:e,abort:s};return i.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(o)}),s}const Di=Object.create(null);function qn(e,t){Di[e]=t}function Fi(e){return Di[e]||Di[""]}function dl(e,t=!0,i=!1){const n=[];return e.forEach(s=>{const o=typeof s=="string"?Re(s,t,i):s;o&&n.push(o)}),n}var pl={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function ml(e,t,i,n){const s=e.resources.length,o=e.random?Math.floor(Math.random()*s):e.index;let r;if(e.random){let $=e.resources.slice(0);for(r=[];$.length>1;){const E=Math.floor(Math.random()*$.length);r.push($[E]),$=$.slice(0,E).concat($.slice(E+1))}r=r.concat($)}else r=e.resources.slice(o).concat(e.resources.slice(0,o));const a=Date.now();let l="pending",u=0,h,c=null,d=[],p=[];typeof n=="function"&&p.push(n);function y(){c&&(clearTimeout(c),c=null)}function x(){l==="pending"&&(l="aborted"),y(),d.forEach($=>{$.status==="pending"&&($.status="aborted")}),d=[]}function b($,E){E&&(p=[]),typeof $=="function"&&p.push($)}function f(){return{startTime:a,payload:t,status:l,queriesSent:u,queriesPending:d.length,subscribe:b,abort:x}}function g(){l="failed",p.forEach($=>{$(void 0,h)})}function v(){d.forEach($=>{$.status==="pending"&&($.status="aborted")}),d=[]}function w($,E,H){const R=E!=="success";switch(d=d.filter(k=>k!==$),l){case"pending":break;case"failed":if(R||!e.dataAfterTimeout)return;break;default:return}if(E==="abort"){h=H,g();return}if(R){h=H,d.length||(r.length?C():g());return}if(y(),v(),!e.random){const k=e.resources.indexOf($.resource);k!==-1&&k!==e.index&&(e.index=k)}l="completed",p.forEach(k=>{k(H)})}function C(){if(l!=="pending")return;y();const $=r.shift();if($===void 0){if(d.length){c=setTimeout(()=>{y(),l==="pending"&&(v(),g())},e.timeout);return}g();return}const E={status:"pending",resource:$,callback:(H,R)=>{w(E,H,R)}};d.push(E),u++,c=setTimeout(C,e.rotate),i($,t,E.callback)}return setTimeout(C),f}function uo(e){const t={...pl,...e};let i=[];function n(){i=i.filter(r=>r().status==="pending")}function s(r,a,l){const u=ml(t,r,a,(h,c)=>{n(),l&&l(h,c)});return i.push(u),u}function o(r){return i.find(a=>r(a))||null}return{query:s,find:o,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:n}}function un(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const yi=Object.create(null),Ye=["https://api.simplesvg.com","https://api.unisvg.com"],Bi=[];for(;Ye.length>0;)Ye.length===1||Math.random()>.5?Bi.push(Ye.shift()):Bi.push(Ye.pop());yi[""]=un({resources:["https://api.iconify.design"].concat(Bi)});function Gn(e,t){const i=un(t);return i===null?!1:(yi[e]=i,!0)}function _i(e){return yi[e]}function fl(){return Object.keys(yi)}function Yn(){}const Mi=Object.create(null);function bl(e){if(!Mi[e]){const t=_i(e);if(!t)return;const i=uo(t),n={config:t,redundancy:i};Mi[e]=n}return Mi[e]}function ho(e,t,i){let n,s;if(typeof e=="string"){const o=Fi(e);if(!o)return i(void 0,424),Yn;s=o.send;const r=bl(e);r&&(n=r.redundancy)}else{const o=un(e);if(o){n=uo(o);const r=e.resources?e.resources[0]:"",a=Fi(r);a&&(s=a.send)}}return!n||!s?(i(void 0,424),Yn):n.query(t,s,i)().abort}const Xn="iconify2",Ae="iconify",po=Ae+"-count",Jn=Ae+"-version",mo=36e5,gl=168,vl=50;function Ui(e,t){try{return e.getItem(t)}catch{}}function hn(e,t,i){try{return e.setItem(t,i),!0}catch{}}function Qn(e,t){try{e.removeItem(t)}catch{}}function Vi(e,t){return hn(e,po,t.toString())}function Wi(e){return parseInt(Ui(e,po))||0}const Tt={local:!0,session:!0},fo={local:new Set,session:new Set};let dn=!1;function yl(e){dn=e}let Xe=typeof window>"u"?{}:window;function bo(e){const t=e+"Storage";try{if(Xe&&Xe[t]&&typeof Xe[t].length=="number")return Xe[t]}catch{}Tt[e]=!1}function go(e,t){const i=bo(e);if(!i)return;const n=Ui(i,Jn);if(n!==Xn){if(n){const a=Wi(i);for(let l=0;l<a;l++)Qn(i,Ae+l.toString())}hn(i,Jn,Xn),Vi(i,0);return}const s=Math.floor(Date.now()/mo)-gl,o=a=>{const l=Ae+a.toString(),u=Ui(i,l);if(typeof u=="string"){try{const h=JSON.parse(u);if(typeof h=="object"&&typeof h.cached=="number"&&h.cached>s&&typeof h.provider=="string"&&typeof h.data=="object"&&typeof h.data.prefix=="string"&&t(h,a))return!0}catch{}Qn(i,l)}};let r=Wi(i);for(let a=r-1;a>=0;a--)o(a)||(a===r-1?(r--,Vi(i,r)):fo[e].add(a))}function vo(){if(!dn){yl(!0);for(const e in Tt)go(e,t=>{const i=t.data,n=t.provider,s=i.prefix,o=vt(n,s);if(!cn(o,i).length)return!1;const r=i.lastModified||-1;return o.lastModifiedCached=o.lastModifiedCached?Math.min(o.lastModifiedCached,r):r,!0})}}function _l(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const n in Tt)go(n,s=>{const o=s.data;return s.provider!==e.provider||o.prefix!==e.prefix||o.lastModified===t});return!0}function xl(e,t){dn||vo();function i(n){let s;if(!Tt[n]||!(s=bo(n)))return;const o=fo[n];let r;if(o.size)o.delete(r=Array.from(o).shift());else if(r=Wi(s),r>=vl||!Vi(s,r+1))return;const a={cached:Math.floor(Date.now()/mo),provider:e.provider,data:t};return hn(s,Ae+r.toString(),JSON.stringify(a))}t.lastModified&&!_l(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function Zn(){}function wl(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,cl(e)}))}function $l(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:n}=e,s=e.iconsToLoad;delete e.iconsToLoad;let o;!s||!(o=Fi(i))||o.prepare(i,n,s).forEach(r=>{ho(i,r,a=>{if(typeof a!="object")r.icons.forEach(l=>{e.missing.add(l)});else try{const l=cn(e,a);if(!l.length)return;const u=e.pendingIcons;u&&l.forEach(h=>{u.delete(h)}),xl(e,a)}catch(l){console.error(l)}wl(e)})})}))}const pn=(e,t)=>{const i=dl(e,!0,ao()),n=ll(i);if(!n.pending.length){let l=!0;return t&&setTimeout(()=>{l&&t(n.loaded,n.missing,n.pending,Zn)}),()=>{l=!1}}const s=Object.create(null),o=[];let r,a;return n.pending.forEach(l=>{const{provider:u,prefix:h}=l;if(h===a&&u===r)return;r=u,a=h,o.push(vt(u,h));const c=s[u]||(s[u]=Object.create(null));c[h]||(c[h]=[])}),n.pending.forEach(l=>{const{provider:u,prefix:h,name:c}=l,d=vt(u,h),p=d.pendingIcons||(d.pendingIcons=new Set);p.has(c)||(p.add(c),s[u][h].push(c))}),o.forEach(l=>{const{provider:u,prefix:h}=l;s[u][h].length&&$l(l,s[u][h])}),t?hl(t,n,o):Zn},Cl=e=>new Promise((t,i)=>{const n=typeof e=="string"?Re(e,!0):e;if(!n){i(e);return}pn([n||e],s=>{if(s.length&&n){const o=Ee(n);if(o){t({...ze,...o});return}}i(e)})});function El(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function Al(e,t){const i=typeof e=="string"?Re(e,!0,!0):null;if(!i){const o=El(e);return{value:e,data:o}}const n=Ee(i);if(n!==void 0||!i.prefix)return{value:e,name:i,data:n};const s=pn([i],()=>t(e,i,Ee(i)));return{value:e,name:i,loading:s}}function Ii(e){return e.hasAttribute("inline")}let yo=!1;try{yo=navigator.vendor.indexOf("Apple")===0}catch{}function Sl(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(yo||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const kl=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Ol=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function qi(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const n=e.split(kl);if(n===null||!n.length)return e;const s=[];let o=n.shift(),r=Ol.test(o);for(;;){if(r){const a=parseFloat(o);isNaN(a)?s.push(o):s.push(Math.ceil(a*t*i)/i)}else s.push(o);if(o=n.shift(),o===void 0)return s.join("");r=!r}}function Tl(e,t="defs"){let i="";const n=e.indexOf("<"+t);for(;n>=0;){const s=e.indexOf(">",n),o=e.indexOf("</"+t);if(s===-1||o===-1)break;const r=e.indexOf(">",o);if(r===-1)break;i+=e.slice(s+1,o).trim(),e=e.slice(0,n).trim()+e.slice(r+1)}return{defs:i,content:e}}function Nl(e,t){return e?"<defs>"+e+"</defs>"+t:t}function Pl(e,t,i){const n=Tl(e);return Nl(n.defs,t+n.content+i)}const Ml=e=>e==="unset"||e==="undefined"||e==="none";function _o(e,t){const i={...ze,...e},n={...no,...t},s={left:i.left,top:i.top,width:i.width,height:i.height};let o=i.body;[i,n].forEach(x=>{const b=[],f=x.hFlip,g=x.vFlip;let v=x.rotate;f?g?v+=2:(b.push("translate("+(s.width+s.left).toString()+" "+(0-s.top).toString()+")"),b.push("scale(-1 1)"),s.top=s.left=0):g&&(b.push("translate("+(0-s.left).toString()+" "+(s.height+s.top).toString()+")"),b.push("scale(1 -1)"),s.top=s.left=0);let w;switch(v<0&&(v-=Math.floor(v/4)*4),v=v%4,v){case 1:w=s.height/2+s.top,b.unshift("rotate(90 "+w.toString()+" "+w.toString()+")");break;case 2:b.unshift("rotate(180 "+(s.width/2+s.left).toString()+" "+(s.height/2+s.top).toString()+")");break;case 3:w=s.width/2+s.left,b.unshift("rotate(-90 "+w.toString()+" "+w.toString()+")");break}v%2===1&&(s.left!==s.top&&(w=s.left,s.left=s.top,s.top=w),s.width!==s.height&&(w=s.width,s.width=s.height,s.height=w)),b.length&&(o=Pl(o,'<g transform="'+b.join(" ")+'">',"</g>"))});const r=n.width,a=n.height,l=s.width,u=s.height;let h,c;r===null?(c=a===null?"1em":a==="auto"?u:a,h=qi(c,l/u)):(h=r==="auto"?l:r,c=a===null?qi(h,u/l):a==="auto"?u:a);const d={},p=(x,b)=>{Ml(b)||(d[x]=b.toString())};p("width",h),p("height",c);const y=[s.left,s.top,l,u];return d.viewBox=y.join(" "),{attributes:d,viewBox:y,body:o}}function mn(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const n in t)i+=" "+n+'="'+t[n]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function Il(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ll(e){return"data:image/svg+xml,"+Il(e)}function xo(e){return'url("'+Ll(e)+'")'}const zl=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let ci=zl();function Rl(e){ci=e}function jl(){return ci}function Hl(e,t){const i=_i(e);if(!i)return 0;let n;if(!i.maxURL)n=0;else{let s=0;i.resources.forEach(r=>{s=Math.max(s,r.length)});const o=t+".json?icons=";n=i.maxURL-s-i.path.length-o.length}return n}function Dl(e){return e===404}const Fl=(e,t,i)=>{const n=[],s=Hl(e,t),o="icons";let r={type:o,provider:e,prefix:t,icons:[]},a=0;return i.forEach((l,u)=>{a+=l.length+1,a>=s&&u>0&&(n.push(r),r={type:o,provider:e,prefix:t,icons:[]},a=l.length),r.icons.push(l)}),n.push(r),n};function Bl(e){if(typeof e=="string"){const t=_i(e);if(t)return t.path}return"/"}const Ul=(e,t,i)=>{if(!ci){i("abort",424);return}let n=Bl(t.provider);switch(t.type){case"icons":{const o=t.prefix,r=t.icons.join(","),a=new URLSearchParams({icons:r});n+=o+".json?"+a.toString();break}case"custom":{const o=t.uri;n+=o.slice(0,1)==="/"?o.slice(1):o;break}default:i("abort",400);return}let s=503;ci(e+n).then(o=>{const r=o.status;if(r!==200){setTimeout(()=>{i(Dl(r)?"abort":"next",r)});return}return s=501,o.json()}).then(o=>{if(typeof o!="object"||o===null){setTimeout(()=>{o===404?i("abort",o):i("next",s)});return}setTimeout(()=>{i("success",o)})}).catch(()=>{i("next",s)})},Vl={prepare:Fl,send:Ul};function Kn(e,t){switch(e){case"local":case"session":Tt[e]=t;break;case"all":for(const i in Tt)Tt[i]=t;break}}const Li="data-style";let wo="";function Wl(e){wo=e}function ts(e,t){let i=Array.from(e.childNodes).find(n=>n.hasAttribute&&n.hasAttribute(Li));i||(i=document.createElement("style"),i.setAttribute(Li,Li),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+wo}function $o(){qn("",Vl),ao(!0);let e;try{e=window}catch{}if(e){if(vo(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(n=>{try{(typeof n!="object"||n===null||n instanceof Array||typeof n.icons!="object"||typeof n.prefix!="string"||!Vn(n))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const n="IconifyProviders["+i+"] is invalid.";try{const s=t[i];if(typeof s!="object"||!s||s.resources===void 0)continue;Gn(i,s)||console.error(n)}catch{console.error(n)}}}}return{enableCache:t=>Kn(t,!0),disableCache:t=>Kn(t,!1),iconLoaded:Wn,iconExists:Wn,getIcon:al,listIcons:rl,addIcon:lo,addCollection:Vn,calculateSize:qi,buildIcon:_o,iconToHTML:mn,svgToURL:xo,loadIcons:pn,loadIcon:Cl,addAPIProvider:Gn,appendCustomStyle:Wl,_api:{getAPIConfig:_i,setAPIModule:qn,sendAPIQuery:ho,setFetch:Rl,getFetch:jl,listAPIProviders:fl}}}const Gi={"background-color":"currentColor"},Co={"background-color":"transparent"},es={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},is={"-webkit-mask":Gi,mask:Gi,background:Co};for(const e in is){const t=is[e];for(const i in es)t[e+"-"+i]=es[i]}function ns(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function ql(e,t,i){const n=document.createElement("span");let s=e.body;s.indexOf("<a")!==-1&&(s+="<!-- "+Date.now()+" -->");const o=e.attributes,r=mn(s,{...o,width:t.width+"",height:t.height+""}),a=xo(r),l=n.style,u={"--svg":a,width:ns(o.width),height:ns(o.height),...i?Gi:Co};for(const h in u)l.setProperty(h,u[h]);return n}let ve;function Gl(){try{ve=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{ve=null}}function Yl(e){return ve===void 0&&Gl(),ve?ve.createHTML(e):e}function Xl(e){const t=document.createElement("span"),i=e.attributes;let n="";i.width||(n="width: inherit;"),i.height||(n+="height: inherit;"),n&&(i.style=n);const s=mn(e.body,i);return t.innerHTML=Yl(s),t.firstChild}function Yi(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function ss(e,t){const i=t.icon.data,n=t.customisations,s=_o(i,n);n.preserveAspectRatio&&(s.attributes.preserveAspectRatio=n.preserveAspectRatio);const o=t.renderedMode;let r;switch(o){case"svg":r=Xl(s);break;default:r=ql(s,{...ze,...i},o==="mask")}const a=Yi(e);a?r.tagName==="SPAN"&&a.tagName===r.tagName?a.setAttribute("style",r.getAttribute("style")):e.replaceChild(r,a):e.appendChild(r)}function os(e,t,i){const n=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:n}}function Jl(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const n=t.get(e);if(n)return n;const s=["icon","mode","inline","observe","width","height","rotate","flip"],o=class extends i{constructor(){super(),Et(this,"_shadowRoot"),Et(this,"_initialised",!1),Et(this,"_state"),Et(this,"_checkQueued",!1),Et(this,"_connected",!1),Et(this,"_observer",null),Et(this,"_visible",!0);const a=this._shadowRoot=this.attachShadow({mode:"open"}),l=Ii(this);ts(a,l),this._state=os({value:""},l),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return s.slice(0)}attributeChangedCallback(a){switch(a){case"inline":{const l=Ii(this),u=this._state;l!==u.inline&&(u.inline=l,ts(this._shadowRoot,l));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const a=this.getAttribute("icon");if(a&&a.slice(0,1)==="{")try{return JSON.parse(a)}catch{}return a}set icon(a){typeof a=="object"&&(a=JSON.stringify(a)),this.setAttribute("icon",a)}get inline(){return Ii(this)}set inline(a){a?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(a){a?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const a=this._state;if(a.rendered){const l=this._shadowRoot;if(a.renderedMode==="svg")try{l.lastChild.setCurrentTime(0);return}catch{}ss(l,a)}}get status(){const a=this._state;return a.rendered?"rendered":a.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const a=this._state,l=this.getAttribute("icon");if(l!==a.icon.value){this._iconChanged(l);return}if(!a.rendered||!this._visible)return;const u=this.getAttribute("mode"),h=Bn(this);(a.attrMode!==u||Ka(a.customisations,h)||!Yi(this._shadowRoot))&&this._renderIcon(a.icon,h,u)}_iconChanged(a){const l=Al(a,(u,h,c)=>{const d=this._state;if(d.rendered||this.getAttribute("icon")!==u)return;const p={value:u,name:h,data:c};p.data?this._gotIconData(p):d.icon=p});l.data?this._gotIconData(l):this._state=os(l,this._state.inline,this._state)}_forceRender(){if(!this._visible){const a=Yi(this._shadowRoot);a&&this._shadowRoot.removeChild(a);return}this._queueCheck()}_gotIconData(a){this._checkQueued=!1,this._renderIcon(a,Bn(this),this.getAttribute("mode"))}_renderIcon(a,l,u){const h=Sl(a.data.body,u),c=this._state.inline;ss(this._shadowRoot,this._state={rendered:!0,icon:a,inline:c,customisations:l,attrMode:u,renderedMode:h})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(a=>{const l=a.some(u=>u.isIntersecting);l!==this._visible&&(this._visible=l,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};s.forEach(a=>{a in o.prototype||Object.defineProperty(o.prototype,a,{get:function(){return this.getAttribute(a)},set:function(l){l!==null?this.setAttribute(a,l):this.removeAttribute(a)}})});const r=$o();for(const a in r)o[a]=o.prototype[a]=r[a];return t.define(e,o),o}Jl()||$o();var Ql=Object.defineProperty,K=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Ql(t,i,s),s},Je;const Y=(Je=class extends S{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._parent=ft(),this._tooltip=ft(),this._contextMenu=ft(),this._mouseLeave=!1,this.onWindowMouseUp=e=>{const{value:t}=this._contextMenu;!this.contains(e.target)&&t&&(t.visible=!1)},this.mouseLeave=!0,this.addEventListener("click",e=>e.stopPropagation())}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&Ys(e,t,{placement:"bottom",middleware:[Ls(10),Gs(),qs(),Ws({padding:5})]}).then(i=>{const{x:n,y:s}=i;Object.assign(t.style,{left:`${n}px`,top:`${s}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}onChildrenClick(e){e.stopPropagation();const{value:t}=this._contextMenu;t&&(t.visible=!t.visible)}onSlotChange(e){const{value:t}=this._contextMenu,i=e.target.assignedElements();for(const n of i){if(!(n instanceof Je)){n.remove(),console.warn("Only bim-button is allowed inside bim-button. Child has been removed.");continue}n.addEventListener("click",()=>t==null?void 0:t.updatePosition())}this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){const e=_`
      <div ${G(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?_`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?_`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=this.children.length>0;return _`
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
      <div ${G(this._parent)} class="parent">
        ${this.label||this.icon?_`
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
        ${this.tooltipTitle||this.tooltipText?e:null}
        ${t?_`
              <div class="children" @click=${this.onChildrenClick}>
                <bim-icon .icon=${"ic:round-plus"}></bim-icon>
              </div>
            `:null}
        <bim-context-menu
          ${G(this._contextMenu)}
          style="row-gap: var(--bim-ui_size-4xs)"
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </bim-context-menu>
      </div>
    `}},Je.styles=O`
    :host {
      --bim-label--c: var(--bim-ui_bg-contrast-100);
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
      background-color: var(--bim-ui_main-base);
    }

    :host(:not([label]):not([icon])) .children {
      flex: 1;
    }

    :host([active]) .button {
      --bim-label--c: var(--bim-ui_main-contrast);
      --bim-icon--c: var(--bim-ui_main-contrast);
      background-color: var(--bim-ui_main-base);
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
  `,Je);K([m({type:String,reflect:!0})],Y.prototype,"label");K([m({type:Boolean,attribute:"label-hidden",reflect:!0})],Y.prototype,"labelHidden");K([m({type:Boolean,reflect:!0})],Y.prototype,"active");K([m({type:Boolean,reflect:!0,attribute:"disabled"})],Y.prototype,"disabled");K([m({type:String,reflect:!0})],Y.prototype,"icon");K([m({type:Boolean,reflect:!0})],Y.prototype,"vertical");K([m({type:Number,attribute:"tooltip-time",reflect:!0})],Y.prototype,"tooltipTime");K([m({type:Boolean,attribute:"tooltip-visible",reflect:!0})],Y.prototype,"tooltipVisible");K([m({type:String,attribute:"tooltip-title",reflect:!0})],Y.prototype,"tooltipTitle");K([m({type:String,attribute:"tooltip-text",reflect:!0})],Y.prototype,"tooltipText");let Zl=Y;var Kl=Object.defineProperty,je=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Kl(t,i,s),s};const Eo=class extends S{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(e){e.stopPropagation(),this.checked=e.target.checked,this.dispatchEvent(this.onValueChange)}render(){return _`
      <div class="parent">
        ${this.label?_`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};Eo.styles=O`
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
      accent-color: var(--bim-checkbox--c, var(--bim-ui_main-base));
    }

    input:focus {
      outline: var(--bim-checkbox--olw, 2px) solid
        var(--bim-checkbox--olc, var(--bim-ui_accent-base));
    }
  `;let Kt=Eo;je([m({type:String,reflect:!0})],Kt.prototype,"icon");je([m({type:String,reflect:!0})],Kt.prototype,"name");je([m({type:String,reflect:!0})],Kt.prototype,"label");je([m({type:Boolean,reflect:!0})],Kt.prototype,"checked");je([m({type:Boolean,reflect:!0})],Kt.prototype,"inverted");var tc=Object.defineProperty,te=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&tc(t,i,s),s};const Ao=class extends S{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=ft(),this._textInput=ft(),this.onValueChange=new Event("input"),this.onOpacityInput=e=>{const t=e.target;this.opacity=t.value,this.dispatchEvent(this.onValueChange)}}set value(e){const{color:t,opacity:i}=e;this.color=t,i&&(this.opacity=i)}get value(){const e={color:this.color};return this.opacity&&(e.opacity=this.opacity),e}onColorInput(e){e.stopPropagation();const{value:t}=this._colorInput;t&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}onTextInput(e){e.stopPropagation();const{value:t}=this._textInput;if(!t)return;const{value:i}=t;let n=i.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),t.value=n.slice(0,7),t.value.length===7&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:e}=this._colorInput;e&&e.click()}render(){return _`
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
                ${G(this._colorInput)}
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
                ${G(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?_`<bim-number-input
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
    `}};Ao.styles=O`
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
  `;let Lt=Ao;te([m({type:String,reflect:!0})],Lt.prototype,"name");te([m({type:String,reflect:!0})],Lt.prototype,"label");te([m({type:String,reflect:!0})],Lt.prototype,"icon");te([m({type:Boolean,reflect:!0})],Lt.prototype,"vertical");te([m({type:Number,reflect:!0})],Lt.prototype,"opacity");te([m({type:String,reflect:!0})],Lt.prototype,"color");const ec=O`
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
`,ic=O`
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
`,zt={scrollbar:ec,globalStyles:ic};var nc=Object.defineProperty,sc=Object.getOwnPropertyDescriptor,oc=(e,t,i,n)=>{for(var s=sc(t,i),o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&nc(t,i,s),s};const So=class extends S{constructor(){super(...arguments),this._visible=!1,this._middleware={name:"middleware",async fn(e){const{right:t,top:i}=await nn(e);return e.x-=Math.sign(t)===1?t+5:0,e.y-=Math.sign(i)===1?i+5:0,e}}}get visible(){return this._visible}set visible(e){this._visible=e,e&&this.updatePosition()}async updatePosition(e){const t=e||this.parentNode;if(!t){this.visible=!1,console.warn("No target element found for context-menu.");return}const i=await Ys(t,this,{placement:"right",middleware:[Ls(10),Gs(),qs(),Ws({padding:5}),this._middleware]}),{x:n,y:s}=i;this.style.left=`${n}px`,this.style.top=`${s}px`}render(){return _` <slot></slot> `}};So.styles=[zt.scrollbar,O`
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
    `];let ko=So;oc([m({type:Boolean,reflect:!0})],ko.prototype,"visible");class _t extends S{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const n of t)this.elements.add(n);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const n of i)n.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const n=i[0];if(!n.isIntersecting)return;const s=n.target;t.unobserve(s);const o=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][o];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,n=[...this.elements][i];n&&t.observe(n)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const n=document.createDocumentFragment();if(t.length===0)return Xt(t(),n),n.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let s=i;const o=t,r=a=>(s={...s,...a},Xt(o(s),n),s);return r(i),[n.firstElementChild,r]}}const ui=(e,t=!0)=>{let i={};for(const n of e.children){const s=n,o=s.getAttribute("name")||s.getAttribute("label");if(o){if("value"in s){const r=s.value;if(typeof r=="object"&&!Array.isArray(r)&&Object.keys(r).length===0)continue;i[o]=s.value}else if(t){const r=ui(s);if(Object.keys(r).length===0)continue;i[o]=r}}else t&&(i={...i,...ui(s)})}return i},xi=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,rc=[">=","<=","=",">","<","?","/","#"];function rs(e){const t=rc.find(r=>e.split(r).length===2),i=e.split(t).map(r=>r.trim()),[n,s]=i,o=s.startsWith("'")&&s.endsWith("'")?s.replace(/'/g,""):xi(s);return{key:n,condition:t,value:o}}const Xi=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(n=>n.trim());for(const n of i){const s=!n.startsWith("(")&&!n.endsWith(")"),o=n.startsWith("(")&&n.endsWith(")");if(s){const r=rs(n);t.push(r)}if(o){const r={operator:"&",queries:n.replace(/^(\()|(\))$/g,"").split("&").map(a=>a.trim()).map((a,l)=>{const u=rs(a);return l>0&&(u.operator="&"),u})};t.push(r)}}return t}catch{return null}},as=(e,t,i)=>{let n=!1;switch(t){case"=":n=e===i;break;case"?":n=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(n=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(n=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(n=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(n=e>=i);break;case"/":n=String(e).startsWith(String(i));break}return n};var ac=Object.defineProperty,lc=Object.getOwnPropertyDescriptor,xt=(e,t,i,n)=>{for(var s=n>1?void 0:n?lc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&ac(t,i,s),s};const Oo=class extends S{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?xi(this.label):this.label}set value(e){this._value=e}render(){return _`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?_` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?_`<bim-checkbox
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
        ${!this.checkbox&&!this.noMark&&this.checked?_`<svg
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
    `}};Oo.styles=O`
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
  `;let I=Oo;xt([m({type:String,reflect:!0})],I.prototype,"img",2);xt([m({type:String,reflect:!0})],I.prototype,"label",2);xt([m({type:String,reflect:!0})],I.prototype,"icon",2);xt([m({type:Boolean,reflect:!0})],I.prototype,"checked",2);xt([m({type:Boolean,reflect:!0})],I.prototype,"checkbox",2);xt([m({type:Boolean,attribute:"no-mark",reflect:!0})],I.prototype,"noMark",2);xt([m({converter:{fromAttribute(e){return e&&xi(e)}}})],I.prototype,"value",1);xt([m({type:Boolean,reflect:!0})],I.prototype,"vertical",2);var cc=Object.defineProperty,uc=Object.getOwnPropertyDescriptor,wt=(e,t,i,n)=>{for(var s=n>1?void 0:n?uc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&cc(t,i,s),s};const To=class extends _t{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._inputContainer=ft(),this._listElement=ft(),this._visible=!1,this._value=[],this.onValueChange=new Event("change"),this.onWindowMouseUp=e=>{this.visible&&(this.contains(e.target)||(this.visible=!1))},this.onOptionClick=e=>{const t=e.target,i=this._value.includes(t);if(!this.multiple&&!this.required&&!i)this._value=[t];else if(!this.multiple&&!this.required&&i)this._value=[];else if(!this.multiple&&this.required&&!i)this._value=[t];else if(this.multiple&&!this.required&&!i)this._value=[...this._value,t];else if(this.multiple&&!this.required&&i)this._value=this._value.filter(n=>n!==t);else if(this.multiple&&this.required&&!i)this._value=[...this._value,t];else if(this.multiple&&this.required&&i){const n=this._value.filter(s=>s!==t);n.length!==0&&(this._value=n)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(e){this._visible=e,e||this.resetVisibleElements()}get visible(){return this._visible}set value(e){if(this.required&&Object.keys(e).length===0)return;const t=[];for(const i of e){const n=this.findOption(i);if(n&&(t.push(n),!this.multiple&&Object.keys(e).length>1))break}this._value=t,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return this._value.filter(e=>e instanceof I&&e.checked).map(e=>e.value)}get _options(){const e=[...this.elements];for(const t of this.children)t instanceof I&&e.push(t);return e}onSlotChange(e){const t=e.target.assignedElements();this.observe(t);for(const i of t){if(!(i instanceof I)){i.remove();continue}i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick)}}updateOptionsState(){for(const e of this._options)e instanceof I&&(this._value.includes(e)?e.checked=!0:e.checked=!1)}findOption(e){return this._options.find(t=>t instanceof I?t.label===e||t.value===e:!1)}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}firstUpdated(){for(const e of this.children)e instanceof I&&e.checked&&this._value.push(e)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){let e,t,i;if(this._value.length===0)e="Select an option...";else if(this._value.length===1){const n=this._value[0];e=(n==null?void 0:n.label)||(n==null?void 0:n.value),t=n==null?void 0:n.img,i=n==null?void 0:n.icon}else e=`Multiple (${this._value.length})`;return _`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div
          ${G(this._inputContainer)}
          class="input"
          @click=${()=>this.visible=!this.visible}
        >
          <bim-label
            .img=${t}
            .icon=${i}
            style="overflow: hidden;"
            >${e}</bim-label
          >
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
        <bim-context-menu ${G(this._listElement)} .visible=${this.visible}>
          <slot @slotchange=${this.onSlotChange}></slot>
          ${this.visibleElements.map(n=>n)}
        </bim-context-menu>
      </bim-input>
    `}};To.styles=[zt.scrollbar,O`
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
          var(--bim-ui_accent-base)
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
    `];let ot=To;wt([m({type:String,reflect:!0})],ot.prototype,"name",2);wt([m({type:String,reflect:!0})],ot.prototype,"icon",2);wt([m({type:String,reflect:!0})],ot.prototype,"label",2);wt([m({type:Boolean,reflect:!0})],ot.prototype,"multiple",2);wt([m({type:Boolean,reflect:!0})],ot.prototype,"required",2);wt([m({type:Boolean,reflect:!0})],ot.prototype,"vertical",2);wt([m({type:Boolean,reflect:!0})],ot.prototype,"visible",1);wt([Le()],ot.prototype,"_value",2);var hc=Object.defineProperty,No=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&hc(t,i,s),s};const Po=class extends S{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(e){const t=e.split(`
`).map(i=>i.trim()).map(i=>i.split('"')[1]).filter(i=>i!==void 0).flatMap(i=>i.split(/\s+/));return[...new Set(t)].filter(i=>i!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const e=this.layouts[this.layout],t=this.getUniqueAreasFromTemplate(e.template).map(i=>{const n=e.elements[i];return n&&(n.style.gridArea=i),n}).filter(i=>!!i);this.style.gridTemplate=e.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...t)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return _`<slot></slot>`}};Po.styles=O`
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
  `;let fn=Po;No([m({type:Boolean,reflect:!0})],fn.prototype,"floating");No([m({type:String,reflect:!0})],fn.prototype,"layout");const Ji=class extends S{render(){return _`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};Ji.styles=O`
    :host {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
    }

    iconify-icon {
      height: var(--bim-icon--fz, var(--bim-ui_size-sm));
      width: var(--bim-icon--fz, var(--bim-ui_size-sm));
      color: var(--bim-icon--c);
    }
  `,Ji.properties={icon:{type:String}};let dc=Ji;var pc=Object.defineProperty,wi=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&pc(t,i,s),s};const Mo=class extends S{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const e={};for(const t of this.children){const i=t;"value"in i?e[i.name||i.label]=i.value:"checked"in i&&(e[i.name||i.label]=i.checked)}return e}set value(e){const t=[...this.children];for(const i in e){const n=t.find(r=>{const a=r;return a.name===i||a.label===i});if(!n)continue;const s=n,o=e[i];typeof o=="boolean"?s.checked=o:s.value=o}}render(){return _`
      <div class="parent">
        ${this.label||this.icon?_`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};Mo.styles=O`
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
    }

    :host(:not([vertical])) .input {
      flex: 1;
      justify-content: flex-end;
    }

    :host(:not([vertical])[label]) .input {
      max-width: fit-content;
    }
  `;let He=Mo;wi([m({type:String,reflect:!0})],He.prototype,"name");wi([m({type:String,reflect:!0})],He.prototype,"label");wi([m({type:String,reflect:!0})],He.prototype,"icon");wi([m({type:Boolean,reflect:!0})],He.prototype,"vertical");var mc=Object.defineProperty,De=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&mc(t,i,s),s};const Io=class extends S{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?xi(this.textContent):this.textContent}render(){return _`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?_`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?_`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};Io.styles=O`
    :host {
      --bim-icon--c: var(--bim-label--c);
      color: var(--bim-label--c, var(--bim-ui_bg-contrast-60));
      font-size: var(--bim-label--fz, var(--bim-ui_size-xs));
      overflow: hidden;
      display: block;
      white-space: nowrap;
      line-height: 1.1rem;
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
  `;let ee=Io;De([m({type:String,reflect:!0})],ee.prototype,"img");De([m({type:Boolean,attribute:"label-hidden",reflect:!0})],ee.prototype,"labelHidden");De([m({type:String,reflect:!0})],ee.prototype,"icon");De([m({type:Boolean,attribute:"icon-hidden",reflect:!0})],ee.prototype,"iconHidden");De([m({type:Boolean,reflect:!0})],ee.prototype,"vertical");var fc=Object.defineProperty,bc=Object.getOwnPropertyDescriptor,q=(e,t,i,n)=>{for(var s=n>1?void 0:n?bc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&fc(t,i,s),s};const Lo=class extends S{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=ft(),this.onValueChange=new Event("change")}set value(e){this.setValue(e.toString())}get value(){return this._value}onChange(e){e.stopPropagation();const{value:t}=this._input;t&&this.setValue(t.value)}setValue(e){const{value:t}=this._input;let i=e;if(i=i.replace(/[^0-9.-]/g,""),i=i.replace(/(\..*)\./g,"$1"),i.endsWith(".")||(i.lastIndexOf("-")>0&&(i=i[0]+i.substring(1).replace(/-/g,"")),i==="-"||i==="-0"))return;let n=Number(i);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,t&&(t.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:e}=this._input;e&&Number.isNaN(Number(e.value))&&(e.value=this.value.toString())}onSliderMouseDown(e){document.body.style.cursor="w-resize";const{clientX:t}=e,i=this.value;let n=!1;const s=a=>{var l;n=!0;const{clientX:u}=a,h=this.step??1,c=((l=h.toString().split(".")[1])==null?void 0:l.length)||0,d=1/(this.sensitivity??1),p=(u-t)/d;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const y=i+p*h;this.setValue(y.toFixed(c))},o=()=>{this.slider=!0,this.removeEventListener("blur",o)},r=()=>{document.removeEventListener("mousemove",s),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",o),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",s),document.addEventListener("mouseup",r)}onFocus(e){e.stopPropagation();const t=i=>{i.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",t))};window.addEventListener("keydown",t)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:e}=this._input;e&&e.focus()}render(){const e=_`
      ${this.pref||this.icon?_`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${G(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${r=>r.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.suffix?_`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            >${this.suffix}</bim-label
          >`:null}
    `,t=this.min??-1/0,i=this.max??1/0,n=100*(this.value-t)/(i-t),s=_`
      <style>
        .slider-indicator {
          width: ${`${n}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?_`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .icon=${this.icon}
              >${`${this.pref}: `}</bim-label
            >`:null}
        <bim-label style="z-index: 1;">${this.value}</bim-label>
        ${this.suffix?_`<bim-label style="z-index: 1;">${this.suffix}</bim-label>`:null}
      </div>
    `,o=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return _`
      <bim-input
        title=${o}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?s:e}
      </bim-input>
    `}};Lo.styles=O`
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
  `;let F=Lo;q([m({type:String,reflect:!0})],F.prototype,"name",2);q([m({type:String,reflect:!0})],F.prototype,"icon",2);q([m({type:String,reflect:!0})],F.prototype,"label",2);q([m({type:String,reflect:!0})],F.prototype,"pref",2);q([m({type:Number,reflect:!0})],F.prototype,"min",2);q([m({type:Number,reflect:!0})],F.prototype,"value",1);q([m({type:Number,reflect:!0})],F.prototype,"step",2);q([m({type:Number,reflect:!0})],F.prototype,"sensitivity",2);q([m({type:Number,reflect:!0})],F.prototype,"max",2);q([m({type:String,reflect:!0})],F.prototype,"suffix",2);q([m({type:Boolean,reflect:!0})],F.prototype,"vertical",2);q([m({type:Boolean,reflect:!0})],F.prototype,"slider",2);var gc=Object.defineProperty,vc=Object.getOwnPropertyDescriptor,Fe=(e,t,i,n)=>{for(var s=n>1?void 0:n?vc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&gc(t,i,s),s};const zo=class extends S{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.activationButton=document.createElement("bim-button")}set hidden(e){this._hidden=e,this.activationButton.active=!e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return ui(this)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(o=>{const r=o;return r.name===i||r.label===i});if(!n)continue;const s=n;s.value=e[i]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!0}expandSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,_`
      <div class="parent">
        ${this.label||this.name||this.icon?_`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};zo.styles=[zt.scrollbar,O`
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
    `];let ie=zo;Fe([m({type:String,reflect:!0})],ie.prototype,"icon",2);Fe([m({type:String,reflect:!0})],ie.prototype,"name",2);Fe([m({type:String,reflect:!0})],ie.prototype,"label",2);Fe([m({type:Boolean,reflect:!0})],ie.prototype,"hidden",1);Fe([m({type:Boolean,attribute:"header-hidden",reflect:!0})],ie.prototype,"headerHidden",2);var yc=Object.defineProperty,Be=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&yc(t,i,s),s};const Ro=class extends S{constructor(){super(...arguments),this.onValueChange=new Event("change")}get value(){return ui(this)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(o=>{const r=o;return r.name===i||r.label===i});if(!n)continue;const s=n;s.value=e[i]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const e=this.label||this.icon||this.name||this.fixed,t=_`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,i=_`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?t:i,s=_`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?_`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return _`
      <div class="parent">
        ${e?s:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};Ro.styles=[zt.scrollbar,O`
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
      }

      bim-label {
        pointer-events: none;
      }
    `];let ne=Ro;Be([m({type:String,reflect:!0})],ne.prototype,"icon");Be([m({type:String,reflect:!0})],ne.prototype,"label");Be([m({type:String,reflect:!0})],ne.prototype,"name");Be([m({type:Boolean,reflect:!0})],ne.prototype,"fixed");Be([m({type:Boolean,reflect:!0})],ne.prototype,"collapsed");var _c=Object.defineProperty,Ue=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&_c(t,i,s),s};const jo=class extends S{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=e=>{this._value=e.target,this.dispatchEvent(this.onValueChange);for(const t of this.children)t instanceof I&&(t.checked=t===e.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(e){const t=this.findOption(e);if(t){for(const i of this._options)i.checked=i===t;this._value=t,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(e){const t=e.target.assignedElements();for(const i of t)i instanceof I&&(i.noMark=!0,i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick))}findOption(e){return this._options.find(t=>t instanceof I?t.label===e||t.value===e:!1)}firstUpdated(){const e=[...this.children].find(t=>t instanceof I&&t.checked);e&&(this._value=e)}render(){return _`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};jo.styles=O`
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
  `;let se=jo;Ue([m({type:String,reflect:!0})],se.prototype,"name");Ue([m({type:String,reflect:!0})],se.prototype,"icon");Ue([m({type:String,reflect:!0})],se.prototype,"label");Ue([m({type:Boolean,reflect:!0})],se.prototype,"vertical");Ue([Le()],se.prototype,"_value");var xc=Object.defineProperty,wc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&xc(t,i,s),s};const Ho=class extends S{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return _`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};Ho.styles=O`
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
  `;let Do=Ho;wc([m({type:String,reflect:!0})],Do.prototype,"column");var $c=Object.defineProperty,Cc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&$c(t,i,s),s};const Fo=class extends S{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(e,t=!1){for(const i of this._groups)i.childrenHidden=typeof e>"u"?!i.childrenHidden:!e,t&&i.toggleChildren(e,t)}render(){return this._groups=[],_`
      <slot></slot>
      ${this.data.map(e=>{const t=document.createElement("bim-table-group");return this._groups.push(t),t.table=this.table,t.data=e,t})}
    `}};Fo.styles=O`
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
  `;let Bo=Fo;Cc([m({type:Array,attribute:!1})],Bo.prototype,"data");var Ec=Object.defineProperty,Ac=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Ec(t,i,s),s};const Uo=class extends S{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(e,t=!1){this._children&&(this.childrenHidden=typeof e>"u"?!this.childrenHidden:!e,t&&this._children.toggleGroups(e,t))}render(){var e,t;const i=((e=this.table)==null?void 0:e.getGroupIndentation(this.data))??0,n=_`
      <style>
        .branch-vertical {
          left: ${i+.5625}rem;
        }
      </style>
      <div class="branch branch-vertical"></div>
    `,s=document.createDocumentFragment();Xt(n,s);const o=document.createElement("div");o.classList.add("branch","branch-horizontal"),o.style.left=`${i-1+.5625}rem`;const r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("height","9.5"),r.setAttribute("width","7.5"),r.setAttribute("viewBox","0 0 4.6666672 7.3333333");const a=document.createElementNS("http://www.w3.org/2000/svg","path");a.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),r.append(a);const l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("height","6.5"),l.setAttribute("width","9.5"),l.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),l.append(u);const h=document.createElement("div");h.addEventListener("click",p=>{p.stopPropagation(),this.toggleChildren()}),h.classList.add("caret"),h.style.left=`${.125+i}rem`,this.childrenHidden?h.append(r):h.append(l);const c=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&c.append(s),c.table=this.table,c.data=this.data.data,(t=this.table)==null||t.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:c}})),this.data.children&&c.append(h),i!==0&&(!this.data.children||this.childrenHidden)&&c.append(o);let d;if(this.data.children){d=document.createElement("bim-table-children"),this._children=d,d.table=this.table,d.data=this.data.children;const p=document.createDocumentFragment();Xt(n,p),d.append(p)}return _`
      <div class="parent">${c} ${this.childrenHidden?null:d}</div>
    `}};Uo.styles=O`
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
  `;let Vo=Uo;Ac([m({type:Boolean,attribute:"children-hidden",reflect:!0})],Vo.prototype,"childrenHidden");var Sc=Object.defineProperty,Ve=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Sc(t,i,s),s};const Wo=class extends S{constructor(){super(...arguments),this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(e=>{this._intersecting=e[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.name)}get _columnWidths(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.width)}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden))}compute(){var e,t,i;const n=((e=this.table)==null?void 0:e.getRowIndentation(this.data))??0,s=this.isHeader?this.data:((t=this.table)==null?void 0:t.computeRowDeclaration(this.data))??this.data,o=[];for(const r in s){if(this.hiddenColumns.includes(r))continue;const a=s[r];let l;if(typeof a=="string"||typeof a=="boolean"||typeof a=="number"?(l=document.createElement("bim-label"),l.textContent=String(a)):a instanceof HTMLElement?l=a:(l=document.createDocumentFragment(),Xt(a,l)),!l)continue;const u=document.createElement("bim-table-cell");u.append(l),u.column=r,this._columnNames.indexOf(r)===0&&!this.isHeader&&(u.style.marginLeft=`${n+.125}rem`);const h=this._columnNames.indexOf(r);u.setAttribute("data-column-index",String(h)),u.toggleAttribute("data-cell-header",this.isHeader),u.rowData=this.data,(i=this.table)==null||i.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:u}})),o.push(u)}return this.style.gridTemplateAreas=`"${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this._columnWidths.join(" ")}`,_`
      ${o}
      <slot></slot>
    `}render(){return _`${this._intersecting?this.compute():_``}`}};Wo.styles=O`
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
  `;let oe=Wo;Ve([m({attribute:!1})],oe.prototype,"columns");Ve([m({attribute:!1})],oe.prototype,"hiddenColumns");Ve([m({attribute:!1})],oe.prototype,"data");Ve([m({type:Boolean,attribute:"is-header",reflect:!0})],oe.prototype,"isHeader");Ve([Le()],oe.prototype,"_intersecting");var kc=Object.defineProperty,Oc=Object.getOwnPropertyDescriptor,re=(e,t,i,n)=>{for(var s=n>1?void 0:n?Oc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&kc(t,i,s),s};const qo=class extends S{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this._stringFilterFunction=(e,t)=>Object.values(t.data).some(i=>String(i).toLowerCase().includes(e.toLowerCase())),this._queryFilterFunction=(e,t)=>{let i=!1;const n=Xi(e)??[];for(const s of n){if("queries"in s){i=!1;break}const{condition:o,value:r}=s;let{key:a}=s;if(a.startsWith("[")&&a.endsWith("]")){const l=a.replace("[","").replace("]","");a=l,i=Object.keys(t.data).filter(u=>u.includes(l)).map(u=>as(t.data[u],o,r)).some(u=>u)}else i=as(t.data[a],o,r);if(!i)break}return i}}set columns(e){const t=[];for(const i of e){const n=typeof i=="string"?{name:i,width:`minmax(${this.minColWidth}, 1fr)`}:i;t.push(n)}this._columns=t,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const e={};for(const t of this.columns)if(typeof t=="string")e[t]=t;else{const{name:i}=t;e[i]=i}return e}get value(){return this._filteredData}set queryString(e){this._queryString=e&&e.trim()!==""?e.trim():null,this.updateFilteredData()}get queryString(){return this._queryString}set data(e){this._data=e,this.updateFilteredData(),this.computeMissingColumns(e)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(e=>{setTimeout(()=>{e(this.data)})})}set hiddenColumns(e){this._hiddenColumns=e,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(Xi(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(e){let t=!1;for(const i of e){const{children:n,data:s}=i;for(const o in s)this._columns.map(r=>typeof r=="string"?r:r.name).includes(o)||(this._columns.push({name:o,width:`minmax(${this.minColWidth}, 1fr)`}),t=!0);if(n){const o=this.computeMissingColumns(n);o&&!t&&(t=o)}}return t}generateText(e="comma",t=this.value,i="",n=!0){const s=this._textDelimiters[e];let o="";const r=this.columns.map(a=>a.name);if(n){this.indentationInText&&(o+=`Indentation${s}`);const a=`${r.join(s)}
`;o+=a}for(const[a,l]of t.entries()){const{data:u,children:h}=l,c=this.indentationInText?`${i}${a+1}${s}`:"",d=r.map(y=>u[y]??""),p=`${c}${d.join(s)}
`;o+=p,h&&(o+=this.generateText(e,l.children,`${i}${a+1}.`,!1))}return o}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}computeRowDeclaration(e){const t={};for(const i in e){const n=this.dataTransform[i];n?t[i]=n(e[i],e):t[i]=e[i]}return t}downloadData(e="BIM Table Data",t="json"){let i=null;if(t==="json"&&(i=new File([JSON.stringify(this.value,void 0,2)],`${e}.json`)),t==="csv"&&(i=new File([this.csv],`${e}.csv`)),t==="tsv"&&(i=new File([this.tsv],`${e}.tsv`)),!i)return;const n=document.createElement("a");n.href=URL.createObjectURL(i),n.download=i.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(e,t=this.value,i=0){for(const n of t){if(n.data===e)return i;if(n.children){const s=this.getRowIndentation(e,n.children,i+1);if(s!==null)return s}}return null}getGroupIndentation(e,t=this.value,i=0){for(const n of t){if(n===e)return i;if(n.children){const s=this.getGroupIndentation(e,n.children,i+1);if(s!==null)return s}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}filter(e,t=this.filterFunction??this._stringFilterFunction,i=this.data){const n=[];for(const s of i)if(t(e,s)){if(this.preserveStructureOnFilter){const o={data:s.data};if(s.children){const r=this.filter(e,t,s.children);r.length&&(o.children=r)}n.push(o)}else if(n.push({data:s.data}),s.children){const o=this.filter(e,t,s.children);n.push(...o)}}else if(s.children){const o=this.filter(e,t,s.children);this.preserveStructureOnFilter&&o.length?n.push({data:s.data,children:o}):n.push(...o)}return n}render(){const e=document.createElement("bim-table-row");e.table=this,e.isHeader=!0,e.data=this._headerRowData,e.style.gridArea="Header",e.style.position="sticky",e.style.top="0",e.style.zIndex="5";const t=document.createElement("bim-table-children");return t.table=this,t.data=this.value,t.style.gridArea="Body",t.style.backgroundColor="transparent",_`
      <div class="parent">
        ${this.headersHidden?null:e}
        <div style="overflow-x: hidden; grid-area: Body">${t}</div>
      </div>
    `}};qo.styles=[zt.scrollbar,O`
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
    `];let Rt=qo;re([Le()],Rt.prototype,"_filteredData",2);re([m({type:Boolean,attribute:"headers-hidden",reflect:!0})],Rt.prototype,"headersHidden",2);re([m({type:String,attribute:"min-col-width",reflect:!0})],Rt.prototype,"minColWidth",2);re([m({type:Array,attribute:!1})],Rt.prototype,"columns",1);re([m({type:Array,attribute:!1})],Rt.prototype,"data",1);re([m({type:Boolean,reflect:!0})],Rt.prototype,"expanded",2);var Tc=Object.defineProperty,Nc=Object.getOwnPropertyDescriptor,$i=(e,t,i,n)=>{for(var s=n>1?void 0:n?Nc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Tc(t,i,s),s};const Go=class extends S{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:e}=this;if(e&&this.name===this._defaultName){const t=[...e.children].indexOf(this);this.name=`${this._defaultName}${t}`}}render(){return _` <slot></slot> `}};Go.styles=O`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let V=Go;$i([m({type:String,reflect:!0})],V.prototype,"name",2);$i([m({type:String,reflect:!0})],V.prototype,"label",2);$i([m({type:String,reflect:!0})],V.prototype,"icon",2);$i([m({type:Boolean,reflect:!0})],V.prototype,"hidden",1);var Pc=Object.defineProperty,Mc=Object.getOwnPropertyDescriptor,ae=(e,t,i,n)=>{for(var s=n>1?void 0:n?Mc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Pc(t,i,s),s};const Yo=class extends S{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=e=>{const t=e.target;t instanceof V&&!t.hidden&&(t.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=t.name,t.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(e){this._tab=e;const t=[...this.children],i=t.find(n=>n instanceof V&&n.name===e);for(const n of t){if(!(n instanceof V))continue;n.hidden=i!==n;const s=this.getTabSwitcher(n.name);s&&s.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(e){return this._switchers.find(t=>t.getAttribute("data-name")===e)}createSwitchers(){this._switchers=[];for(const e of this.children){if(!(e instanceof V))continue;const t=document.createElement("div");t.addEventListener("click",()=>{this.tab===e.name?this.toggleAttribute("tab",!1):this.tab=e.name}),t.setAttribute("data-name",e.name),t.className="switcher";const i=document.createElement("bim-label");i.textContent=e.label??"",i.icon=e.icon,t.append(i),this._switchers.push(t)}}onSlotChange(e){this.createSwitchers();const t=e.target.assignedElements(),i=t.find(n=>n instanceof V?this.tab?n.name===this.tab:!n.hidden:!1);i&&i instanceof V&&(this.tab=i.name);for(const n of t){if(!(n instanceof V)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),i!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return _`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Yo.styles=[zt.scrollbar,O`
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
    `];let jt=Yo;ae([Le()],jt.prototype,"_switchers",2);ae([m({type:Boolean,reflect:!0})],jt.prototype,"bottom",2);ae([m({type:Boolean,attribute:"switchers-hidden",reflect:!0})],jt.prototype,"switchersHidden",2);ae([m({type:Boolean,reflect:!0})],jt.prototype,"floating",2);ae([m({type:String,reflect:!0})],jt.prototype,"tab",1);ae([m({type:Boolean,attribute:"switchers-full",reflect:!0})],jt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ic=e=>e??N;var Lc=Object.defineProperty,zc=Object.getOwnPropertyDescriptor,$t=(e,t,i,n)=>{for(var s=n>1?void 0:n?zc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Lc(t,i,s),s};const Xo=class extends S{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(e){this._inputTypes.includes(e)&&(this._type=e)}get type(){return this._type}get query(){return Xi(this.value)}onInputChange(e){e.stopPropagation();const t=e.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=t.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("input");t==null||t.focus()})}render(){return _`
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
          placeholder=${Ic(this.placeholder)}
          @input=${this.onInputChange}
        />
      </bim-input>
    `}};Xo.styles=O`
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
  `;let rt=Xo;$t([m({type:String,reflect:!0})],rt.prototype,"icon",2);$t([m({type:String,reflect:!0})],rt.prototype,"label",2);$t([m({type:String,reflect:!0})],rt.prototype,"name",2);$t([m({type:String,reflect:!0})],rt.prototype,"placeholder",2);$t([m({type:String,reflect:!0})],rt.prototype,"value",2);$t([m({type:Boolean,reflect:!0})],rt.prototype,"vertical",2);$t([m({type:Number,reflect:!0})],rt.prototype,"debounce",2);$t([m({type:String,reflect:!0})],rt.prototype,"type",1);var Rc=Object.defineProperty,jc=Object.getOwnPropertyDescriptor,Jo=(e,t,i,n)=>{for(var s=n>1?void 0:n?jc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Rc(t,i,s),s};const Qo=class extends S{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const e=this.children;for(const t of e)this.vertical?t.setAttribute("label-hidden",""):t.removeAttribute("label-hidden")}render(){return _`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};Qo.styles=O`
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
  `;let Ci=Qo;Jo([m({type:Number,reflect:!0})],Ci.prototype,"rows",2);Jo([m({type:Boolean,reflect:!0})],Ci.prototype,"vertical",1);var Hc=Object.defineProperty,Dc=Object.getOwnPropertyDescriptor,Ei=(e,t,i,n)=>{for(var s=n>1?void 0:n?Dc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Hc(t,i,s),s};const Zo=class extends S{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(e){this._labelHidden=e,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const e=this.children;for(const t of e)t instanceof Ci&&(t.vertical=this.vertical),t.toggleAttribute("label-hidden",this.vertical)}render(){return _`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?_`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Zo.styles=O`
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
  `;let le=Zo;Ei([m({type:String,reflect:!0})],le.prototype,"label",2);Ei([m({type:String,reflect:!0})],le.prototype,"icon",2);Ei([m({type:Boolean,reflect:!0})],le.prototype,"vertical",1);Ei([m({type:Boolean,attribute:"label-hidden",reflect:!0})],le.prototype,"labelHidden",1);const Ko=class A{static set config(t){this._config={...A._config,...t}}static get config(){return A._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=zt.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){A.init()}static init(){A.addGlobalStyles(),A.defineCustomElement("bim-button",Zl),A.defineCustomElement("bim-checkbox",Kt),A.defineCustomElement("bim-color-input",Lt),A.defineCustomElement("bim-context-menu",ko),A.defineCustomElement("bim-dropdown",ot),A.defineCustomElement("bim-grid",fn),A.defineCustomElement("bim-icon",dc),A.defineCustomElement("bim-input",He),A.defineCustomElement("bim-label",ee),A.defineCustomElement("bim-number-input",F),A.defineCustomElement("bim-option",I),A.defineCustomElement("bim-panel",ie),A.defineCustomElement("bim-panel-section",ne),A.defineCustomElement("bim-selector",se),A.defineCustomElement("bim-table",Rt),A.defineCustomElement("bim-tabs",jt),A.defineCustomElement("bim-tab",V),A.defineCustomElement("bim-table-cell",Do),A.defineCustomElement("bim-table-children",Bo),A.defineCustomElement("bim-table-group",Vo),A.defineCustomElement("bim-table-row",oe),A.defineCustomElement("bim-text-input",rt),A.defineCustomElement("bim-toolbar",Ai),A.defineCustomElement("bim-toolbar-group",Ci),A.defineCustomElement("bim-toolbar-section",le),A.defineCustomElement("bim-viewport",ir)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let n=0;n<10;n++){const s=Math.floor(Math.random()*t.length);i+=t.charAt(s)}return i}};Ko._config={sectionLabelOnVerticalToolbar:!1};let Qi=Ko;var Fc=Object.defineProperty,Bc=Object.getOwnPropertyDescriptor,bn=(e,t,i,n)=>{for(var s=n>1?void 0:n?Bc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Fc(t,i,s),s};const tr=class extends S{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(e){this._vertical=e,this.updateSections()}get vertical(){return this._vertical}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const e=this.children;for(const t of e)t instanceof le&&(t.labelHidden=this.vertical&&!Qi.config.sectionLabelOnVerticalToolbar,t.vertical=this.vertical)}render(){return _`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};tr.styles=O`
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
  `;let Ai=tr;bn([m({type:String,reflect:!0})],Ai.prototype,"icon",2);bn([m({type:Boolean,attribute:"labels-hidden",reflect:!0})],Ai.prototype,"labelsHidden",2);bn([m({type:Boolean,reflect:!0})],Ai.prototype,"vertical",1);var Uc=Object.defineProperty,Vc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Uc(t,i,s),s};const er=class extends S{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return _`
      <div class="parent">
        <slot></slot>
      </div>
    `}};er.styles=O`
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
  `;let ir=er;Vc([m({type:String,reflect:!0})],ir.prototype,"name");const Wc=e=>{const{components:t}=e,i=t.get(wr);return _`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const n=document.createElement("input");n.type="file",n.accept=".ifc",n.onchange=async()=>{if(n.files===null||n.files.length===0)return;const s=n.files[0];n.remove();const o=await s.arrayBuffer(),r=new Uint8Array(o),a=await i.load(r);a.name=s.name.replace(".ifc","")},n.click()}}
    ></bim-button>
  `},qc=e=>_t.create(Wc,e),Gc=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:qc},Symbol.toStringTag,{value:"Module"}));({...Gc});const Yc=e=>{const{components:t}=e,i=e.schemaTag??!0,n=e.viewDefinitionTag??!0,s=t.get(It),o=document.createElement("bim-table");o.addEventListener("cellcreated",({detail:a})=>{const{cell:l}=a;l.style.padding="0.25rem 0"}),o.hiddenColumns=["modelID"],o.headersHidden=!0;const r=[];for(const[,a]of s.groups){if(!a)continue;const l={data:{Name:a.name||a.uuid,modelID:a.uuid}};r.push(l)}return o.dataTransform={Name:(a,l)=>{const{modelID:u}=l;if(typeof u!="string")return a;const h=s.groups.get(u);if(!h)return u;const c={};for(const x of h.items)c[x.id]=x.ids;let d;const{schema:p}=h.ifcMetadata;i&&p&&(d=_`
          <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${p}</bim-label>
          `);let y;if(n&&"viewDefinition"in h.ifcMetadata){const x=h.ifcMetadata.viewDefinition;y=_`
          ${x.split(",").map(b=>_`<bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${b}</bim-label>`)}
        `}return _`
       <div style="display: flex; flex: 1; gap: var(--bim-ui_size-4xs); justify-content: space-between; overflow: auto;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bim-ui_size-4xs); flex-grow: 1; overflow: auto;">
          <div style="min-height: 1.75rem; overflow: auto; display: flex;">
            <bim-label style="white-space: normal;">${a}</bim-label>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--bim-ui_size-4xs); overflow: auto;">
            ${d}
            ${y}
          </div>
        </div>
        <div style="display: flex; gap: var(--bim-ui_size-4xs); align-self: flex-start; flex-shrink: 0;">
          <bim-button @click=${x=>{const b=t.get($r),f=x.target;b.set(f.hasAttribute("data-model-hidden"),c),f.toggleAttribute("data-model-hidden"),f.icon=f.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye"}} icon="mdi:eye"></bim-button>
          <bim-button @click=${()=>s.disposeGroup(h)} icon="mdi:delete"></bim-button>
        </div>
       </div>
      `}},o.data=r,_`
    <div>
      ${r.length===0?_`<bim-label>No models has been loaded yet</bim-label>`:o}
    </div>
  `},Xc=(e,t=!0)=>{const i=_t.create(Yc,e);if(t){const{components:n}=e,s=n.get(It),[,o]=i;s.onFragmentsLoaded.add(()=>setTimeout(()=>o())),s.onFragmentsDisposed.add(()=>o())}return i},Jc=Object.freeze(Object.defineProperty({__proto__:null,modelsList:Xc},Symbol.toStringTag,{value:"Module"})),nr=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",e=>e.includes("Value"),e=>e.startsWith("Material"),e=>e.startsWith("Relating"),e=>{const t=["IsGroupedBy","IsDecomposedBy"];return e.startsWith("Is")&&!t.includes(e)}];async function Ke(e,t,i,n=nr,s=!1){const o=e.get(Te),r=await t.getProperties(i);if(!r)return{data:{Entity:`${i} properties not found...`}};const a=o.relationMaps[t.uuid],l={data:{}};for(const u in r){const h=n.map(d=>typeof d=="string"?u===d:d(u)).includes(!0);if(!(u==="type"||h))continue;const c=r[u];if(c)if(c.type===5){l.children||(l.children=[]);const d=await Ke(e,t,c.value,n,s);l.children.push(d)}else if(typeof c=="object"&&!Array.isArray(c)){const{value:d,type:p}=c;if(s)p===1||p===2||p===3||(l.data[u]=d);else{const y=typeof d=="number"?Number(d.toFixed(3)):d;l.data[u]=y}}else if(Array.isArray(c))for(const d of c){if(d.type!==5)continue;l.children||(l.children=[]);const p=await Ke(e,t,d.value,n,s);l.children.push(p)}else if(u==="type"){const d=tn[c];l.data.Entity=d}else l.data[u]=c}if(a&&a.get(r.expressID)){const u=a.get(r.expressID);for(const h of n){const c=[];if(typeof h=="string"){const d=o._inverseAttributes.indexOf(h);d!==-1&&c.push(d)}else{const d=o._inverseAttributes.filter(p=>h(p));for(const p of d){const y=o._inverseAttributes.indexOf(p);c.push(y)}}for(const d of c){const p=u.get(d);if(p)for(const y of p){const x=await Ke(e,t,y,n,s);l.children||(l.children=[]),l.children.push(x)}}}}return l}const Qc=e=>{const{components:t,fragmentIdMap:i,attributesToInclude:n,editable:s,tableDefinition:o}=e,r=t.get(It);let a;return typeof n=="function"?a=n(nr):a=n,_`<bim-table ${G(async l=>{if(!l)return;const u=l,h=[],c=[];for(const d in i){const p=r.list.get(d);if(!(p&&p.group))continue;const y=p.group,x=c.find(b=>b.model===y);if(x)for(const b of i[d])x.expressIDs.add(b);else{const b={model:y,expressIDs:new Set(i[d])};c.push(b)}}for(const d of c){const{model:p,expressIDs:y}=d;for(const x of y){const b=await Ke(t,p,x,a,s);h.push(b)}}u.dataTransform=o,u.data=h,u.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},Zc=e=>_t.create(Qc,e),Kc=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:Zc},Symbol.toStringTag,{value:"Module"}));function tu(e){const t=Object.keys(e).pop();return t&&e[t].length>0?e[t][0]:""}function sr(e){return e.map(t=>{const i={data:{System:tu(t.filter)}};return t.children&&t.children.length>0&&(i.children=sr(t.children)),i})}const eu=e=>{const{components:t,classifications:i}=e,n=t.get(Cr),s=o=>{if(!o)return;const r=o;r.dataTransform={Actions:u=>u};const a=(u,h={})=>{const c=n.list,d=u[0],p=c[d],y=[];if(!d||!p)return y;for(const x in p){const b={...h,[d]:[x]},f=n.find(b);if(Object.keys(f).length>0){const g={filter:b};g.children=a(u.slice(1),b),y.push(g)}}return y},l=[];for(const u in i){const h=i[u],c=a(h),d=sr(c);l.push({data:{System:u},children:d})}r.data=l};return _`
  <div>
    ${Object.keys(i).length===0?_`<bim-label label="No classifications to show"></bim-label>`:_`<bim-table ${G(s)} headers-hidden expanded></bim-table>`}
  </div>
  `},iu=(e,t=!0)=>{const i=_t.create(eu,e);if(t){const{components:n}=e,s=n.get(It),[,o]=i;s.onFragmentsDisposed.add(()=>o())}return i},nu=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:iu},Symbol.toStringTag,{value:"Module"})),su=["OwnerHistory","ObjectPlacement","CompositionType"],ls=async(e,t,i)=>{const n={groupName:"Attributes",includeClass:!1,...i},{groupName:s,includeClass:o}=n,r=await e.getProperties(t)??{},a={data:{Name:s}};o&&(a.children||(a.children=[]),a.children.push({data:{Name:"Class",Value:tn[r.type]}}));for(const l in r){if(su.includes(l))continue;const u=r[l];if(u&&typeof u=="object"&&!Array.isArray(u)){if(u.type===jr)continue;const h={data:{Name:l,Value:u.value}};a.children||(a.children=[]),a.children.push(h)}}return a},ou=async(e,t)=>{const i={data:{Name:"Property Sets"}};for(const n of t){const s=await e.getProperties(n);if(!s)continue;const o={data:{Name:s.Name.value}};if(s.type===Cs){for(const r of s.HasProperties){const{value:a}=r,l=await e.getProperties(a);if(!l)continue;const u=Object.keys(l).find(c=>c.includes("Value"));if(!(u&&l[u]))continue;const h={data:{Name:l.Name.value,Value:l[u].value}};o.children||(o.children=[]),o.children.push(h)}o.children&&(i.children||(i.children=[]),i.children.push(o))}}return i},ru=async(e,t)=>{const i={data:{Name:"Quantity Sets"}};for(const n of t){const s=await e.getProperties(n);if(!s)continue;const o={data:{Name:s.Name.value}};if(s.type===Es){for(const r of s.Quantities){const{value:a}=r,l=await e.getProperties(a);if(!l)continue;const u=Object.keys(l).find(c=>c.includes("Value"));if(!(u&&l[u]))continue;const h={data:{Name:l.Name.value,Value:l[u].value}};o.children||(o.children=[]),o.children.push(h)}o.children&&(i.children||(i.children=[]),i.children.push(o))}}return i},au=async(e,t)=>{const i={data:{Name:"Materials"}};for(const n of t){const s=await e.getProperties(n);if(s&&s.type===As){const o=s.ForLayerSet.value,r=await e.getProperties(o);if(!r)continue;for(const a of r.MaterialLayers){const{value:l}=a,u=await e.getProperties(l);if(!u)continue;const h=await e.getProperties(u.Material.value);if(!h)continue;const c={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:u.LayerThickness.value}},{data:{Name:"Material",Value:h.Name.value}}]};i.children||(i.children=[]),i.children.push(c)}}if(s&&s.type===ks)for(const o of s.Materials){const{value:r}=o,a=await e.getProperties(r);if(!a)continue;const l={data:{Name:"Name",Value:a.Name.value}};i.children||(i.children=[]),i.children.push(l)}if(s&&s.type===Ss){const o=await e.getProperties(n);if(!o)continue;const r={data:{Name:"Name",Value:o.Name.value}};i.children||(i.children=[]),i.children.push(r)}}return i},lu=async(e,t)=>{var i,n;const s={data:{Name:"Classifications"}};for(const o of t){const r=await e.getProperties(o);if(r&&r.type===Os){const{value:a}=r.ReferencedSource,l=await e.getProperties(a);if(!l)continue;const u={data:{Name:l.Name.value},children:[{data:{Name:"Identification",Value:((i=r.Identification)==null?void 0:i.value)||((n=r.ItemReference)==null?void 0:n.value)}},{data:{Name:"Name",Value:r.Name.value}}]};s.children||(s.children=[]),s.children.push(u)}}return s},cu=async(e,t)=>{var i;const n=e.get(Te),s=e.get(It),o=[],r=[];for(const a in t){const l=s.list.get(a);if(!(l&&l.group))continue;const u=l.group,h=r.find(c=>c.model===u);if(h)for(const c of t[a])h.expressIDs.add(c);else{const c={model:u,expressIDs:new Set(t[a])};r.push(c)}}for(const a in r){const{model:l,expressIDs:u}=r[a],h=n.relationMaps[l.uuid];if(h)for(const c of u){const d=await l.getProperties(c);if(!d)continue;const p={data:{Name:(i=d.Name)==null?void 0:i.value}};o.push(p);const y=await ls(l,c,{includeClass:!0});if(p.children||(p.children=[]),p.children.push(y),!h.get(c))continue;const x=n.getEntityRelations(l,c,"IsDefinedBy");if(x){const g=x.filter(async $=>{const E=await l.getProperties($);return E?E.type===Cs:!1}),v=await ou(l,g);v.children&&p.children.push(v);const w=x.filter(async $=>{const E=await l.getProperties($);return E?E.type===Es:!1}),C=await ru(l,w);C.children&&p.children.push(C)}const b=n.getEntityRelations(l,c,"HasAssociations");if(b){const g=b.filter(async $=>{const E=await l.getProperties($);return E?E.type===As||E.type===Lr||E.type===zr||E.type===Ss||E.type===ks:!1}),v=await au(l,g);v.children&&p.children.push(v);const w=b.filter(async $=>{const E=await l.getProperties($);return E?E.type===Os:!1}),C=await lu(l,w);C.children&&p.children.push(C)}const f=n.getEntityRelations(l,c,"ContainedInStructure");if(f){const g=f[0],v=await ls(l,g,{groupName:"SpatialContainer"});p.children.push(v)}}}return o},uu=new Event("datacomputed");let ht;const hu=e=>{const{components:t,fragmentIdMap:i}=e;return ht||(ht=document.createElement("bim-table"),ht.columns=[{name:"Name",width:"12rem"}],ht.headersHidden=!0,ht.addEventListener("cellcreated",({detail:n})=>{const{cell:s}=n;s.column==="Name"&&!("Value"in s.rowData)&&(s.style.gridColumn="1 / -1")})),cu(t,i).then(n=>{ht.data=n,n.length!==0&&ht.dispatchEvent(uu)}),_`${ht}`},du=e=>_t.create(hu,e),pu=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:du},Symbol.toStringTag,{value:"Module"})),Zi=async(e,t,i,n)=>{var s;const o=[],r=e.get(Te),a=await t.getProperties(i);if(!a)return o;const{type:l}=a,u={data:{Entity:tn[l],Name:(s=a.Name)==null?void 0:s.value,modelID:t.uuid}};for(const h of n){const c=r.getEntityRelations(t,i,h);if(u.data.expressID=i,!!c){u.data.relations=JSON.stringify(c);for(const d of c){const p=await Zi(e,t,d,n);u.children||(u.children=[]),u.children.push(...p)}}}return o.push(u),o},mu=async(e,t,i,n)=>{const s=e.get(Te),o=[];for(const r of t){let a;if(n)a={data:{Entity:r.name!==""?r.name:r.uuid},children:await Zi(e,r,n,i)};else{const l=s.relationMaps[r.uuid],u=await r.getAllPropertiesOfType(Rr);if(!(l&&u))continue;const{expressID:h}=Object.values(u)[0];a={data:{Entity:r.name!==""?r.name:r.uuid},children:await Zi(e,r,h,i)}}o.push(a)}return o};let et;const cs=(e,t)=>{const i=e.get(It),{modelID:n,expressID:s,relations:o}=t.data;if(!(n&&s))return null;const r=i.groups.get(n);return r?r.getFragmentMap([s,...JSON.parse(o??"[]")]):null},fu=e=>{const{components:t,models:i,expressID:n}=e,s=e.selectHighlighterName??"select",o=e.hoverHighlighterName??"hover";et||(et=document.createElement("bim-table"),et.hiddenColumns=["modelID","expressID","relations"],et.columns=["Entity","Name"],et.headersHidden=!0,et.addEventListener("cellcreated",({detail:a})=>{const{cell:l}=a;l.column==="Entity"&&!("Name"in l.rowData)&&(l.style.gridColumn="1 / -1")})),et.addEventListener("rowcreated",a=>{a.stopImmediatePropagation();const{row:l}=a.detail,u=t.get(Dr);l.onmouseover=()=>{if(!o)return;const h=cs(t,l);h&&Object.keys(h).length!==0&&(l.style.backgroundColor="var(--bim-ui_bg-contrast-20)",u.highlightByID(o,h,!0,!1,u.selection[s]??{}))},l.onmouseout=()=>{l.style.backgroundColor="",u.clear(o)},l.onclick=()=>{if(!s)return;const h=cs(t,l);h&&Object.keys(h).length!==0&&u.highlightByID(s,h,!0,!0)}});const r=e.inverseAttributes??["IsDecomposedBy","ContainsElements"];return mu(t,i,r,n).then(a=>et.data=a),_`${et}`},bu=(e,t=!0)=>{const i=_t.create(fu,e);if(t){const[,n]=i,{components:s}=e,o=s.get(It),r=s.get(Te),a=()=>n({models:o.groups.values()});r.onRelationsIndexed.add(a),o.onFragmentsDisposed.add(a)}return i},gu=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:bu},Symbol.toStringTag,{value:"Module"})),pe=(e,t)=>[...e.get(Ar).list.values()].find(i=>i.world===t),vu=(e,t)=>_`
    <bim-color-input @input=${i=>{const n=i.target;e.color=new Ne(n.color)}} color=${t}></bim-color-input>
  `,yu=(e,t)=>{const{postproduction:i}=e,n=i.n8ao.configuration;return _`
    <bim-color-input @input=${s=>{const o=s.target;n.color=new Ne(o.color)}} color=${t}></bim-color-input>
  `},_u=(e,t)=>{const{color:i,opacity:n}=JSON.parse(t),{postproduction:s}=e,{customEffects:o}=s;return _`
    <bim-color-input @input=${r=>{const{color:a,opacity:l}=r.target;o.lineColor=new Ne(a).getHex(),l&&(o.opacity=l/100)}} color=${i} opacity=${n*100}></bim-color-input>
  `},xu=(e,t)=>_`
    <bim-color-input @input=${i=>{const n=i.target,s=new Ne(n.color);e.material.uniforms.uColor.value=s}} color=${t}></bim-color-input>
  `,wu=(e,t)=>{const{postproduction:i}=e;return _`
    <bim-checkbox @change=${n=>{const s=n.target;i.setPasses({ao:s.checked})}} .checked=${t}></bim-checkbox>
  `},$u=(e,t)=>{const{postproduction:i}=e;return _`
    <bim-checkbox @change=${n=>{const s=n.target;i.setPasses({gamma:s.checked})}} .checked=${t}></bim-checkbox>
  `},Cu=(e,t)=>{const{postproduction:i}=e;return _`
    <bim-checkbox @change=${n=>{const s=n.target;i.setPasses({custom:s.checked})}} .checked=${t}></bim-checkbox>
  `},dt=(e,t,i,n=()=>{})=>_`
    <bim-checkbox .checked="${i}" @change="${s=>{const o=s.target.checked;e[t]=o,n(o)}}"></bim-checkbox> 
  `,T=(e,t,i,n)=>{const s={slider:!1,min:0,max:100,step:1,prefix:null,suffix:null,onInputSet:()=>{},...n},{slider:o,min:r,max:a,step:l,suffix:u,prefix:h,onInputSet:c}=s;return _`
    <bim-number-input
      .pref=${h}
      .suffix=${u}
      .slider=${o} 
      min=${r} 
      value="${i}" 
      max=${a} 
      step=${l} 
      @change="${d=>{const p=d.target.value;e[t]=p,c(p)}}"
    ></bim-number-input> 
  `},Eu=e=>{const{components:t}=e,i=t.get(Ki);return _`<bim-table ${G(async n=>{var s,o,r,a,l;if(!n)return;const u=n;u.preserveStructureOnFilter=!0,u.dataTransform={Value:(c,d)=>{const p=d.World,y=i.list.get(p);if(!y)return c;const{scene:x,camera:b,renderer:f}=y,g=d.Name;if(g==="Grid"&&d.IsGridConfig&&typeof c=="boolean"){const v=pe(t,y);return v?dt(v,"visible",c):c}if(g==="Color"&&d.IsGridConfig&&typeof c=="string"){const v=pe(t,y);return v?xu(v,c):c}if(g==="Distance"&&d.IsGridConfig&&typeof c=="number"){const v=pe(t,y);return v?T(v.material.uniforms.uDistance,"value",c,{slider:!0,min:300,max:1e3}):c}if(g==="Size"&&d.IsGridConfig&&typeof c=="string"){const v=pe(t,y);if(!v)return c;const{x:w,y:C}=JSON.parse(c),$=T(v.material.uniforms.uSize1,"value",w,{slider:!0,suffix:"m",prefix:"A",min:1,max:20}),E=T(v.material.uniforms.uSize2,"value",C,{slider:!0,suffix:"m",prefix:"B",min:1,max:20});return _`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${$}${E}</div>
          `}if(g==="Near Frustum"&&b.three instanceof Ge&&typeof c=="number"){const v=b.three;return T(b.three,"near",c,{slider:!0,min:.1,max:10,step:.1,onInputSet:()=>v.updateProjectionMatrix()})}if(g==="Far Frustum"&&b.three instanceof Ge&&typeof c=="number"){const v=b.three;return T(b.three,"far",c,{slider:!0,min:300,max:2e3,step:10,onInputSet:()=>v.updateProjectionMatrix()})}if(g==="Field of View"&&b.three instanceof Ge&&typeof c=="number"){const v=b.three;return T(b.three,"fov",c,{slider:!0,min:10,max:120,onInputSet:()=>v.updateProjectionMatrix()})}if(g==="Invert Drag"&&b.hasCameraControls()&&typeof c=="boolean")return dt(b.controls,"dollyDragInverted",c);if(g==="Dolly Speed"&&b.hasCameraControls()&&typeof c=="number")return T(b.controls,"dollySpeed",c,{slider:!0,min:.5,max:3,step:.1});if(g==="Truck Speed"&&b.hasCameraControls()&&typeof c=="number")return T(b.controls,"truckSpeed",c,{slider:!0,min:.5,max:6,step:.1});if(g==="Smooth Time"&&b.hasCameraControls()&&typeof c=="number")return T(b.controls,"smoothTime",c,{slider:!0,min:.01,max:2,step:.01});if(g==="Intensity"&&typeof c=="number"){if(d.Light&&typeof d.Light=="string"){const v=x.three.children.find(w=>w.uuid===d.Light);return v&&v instanceof he?T(v,"intensity",c,{slider:!0,min:0,max:10,step:.1}):c}if(d.IsAOConfig&&f instanceof P)return T(f.postproduction.n8ao.configuration,"intensity",c,{slider:!0,max:16,step:.1})}if(g==="Color"&&typeof c=="string"){const v=d.Light,w=x.three.children.find(C=>C.uuid===v);if(w&&w instanceof he)return vu(w,c);if(d.IsAOConfig&&f instanceof P)return yu(f,c)}if(g==="Ambient Oclussion"&&typeof c=="boolean"&&d.IsAOConfig&&f instanceof P)return wu(f,c);if(g==="Half Resolution"&&d.IsAOConfig&&f instanceof P&&typeof c=="boolean")return dt(f.postproduction.n8ao.configuration,"halfRes",c);if(g==="Screen Space Radius"&&d.IsAOConfig&&f instanceof P&&typeof c=="boolean")return dt(f.postproduction.n8ao.configuration,"screenSpaceRadius",c);if(g==="Radius"&&d.IsAOConfig&&f instanceof P&&typeof c=="number")return T(f.postproduction.n8ao.configuration,"aoRadius",c,{slider:!0,max:2,step:.1});if(g==="Denoise Samples"&&d.IsAOConfig&&f instanceof P&&typeof c=="number")return T(f.postproduction.n8ao.configuration,"denoiseSamples",c,{slider:!0,min:1,max:16});if(g==="Samples"&&d.IsAOConfig&&f instanceof P&&typeof c=="number")return T(f.postproduction.n8ao.configuration,"aoSamples",c,{slider:!0,min:1,max:16});if(g==="Denoise Radius"&&d.IsAOConfig&&f instanceof P&&typeof c=="number")return T(f.postproduction.n8ao.configuration,"denoiseRadius",c,{slider:!0,min:0,max:16,step:.1});if(g==="Distance Falloff"&&d.IsAOConfig&&f instanceof P&&typeof c=="number")return T(f.postproduction.n8ao.configuration,"distanceFalloff",c,{slider:!0,min:0,max:4,step:.1});if(g==="Directional Light"&&d.Light&&typeof d.Light=="string"&&typeof c=="boolean"){const v=x.three.children.find(w=>w.uuid===d.Light);return v&&v instanceof he?dt(v,"visible",c):c}if(g==="Ambient Light"&&d.Light&&typeof d.Light=="string"&&typeof c=="boolean"){const v=x.three.children.find(w=>w.uuid===d.Light);return v&&v instanceof he?dt(v,"visible",c):c}if(g==="Position"&&d.Light&&typeof d.Light=="string"&&typeof c=="string"){const v=x.three.children.find(k=>k.uuid===d.Light);if(!(v&&v instanceof he))return c;const{x:w,y:C,z:$}=JSON.parse(c),E=T(v.position,"x",w,{slider:!0,prefix:"X",suffix:"m",min:-50,max:50}),H=T(v.position,"y",C,{slider:!0,prefix:"Y",suffix:"m",min:-50,max:50}),R=T(v.position,"z",$,{slider:!0,prefix:"Z",suffix:"m",min:-50,max:50});return _`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${E}${H}${R}</div>
          `}return g==="Custom Effects"&&d.IsCEConfig&&f instanceof P&&typeof c=="boolean"?Cu(f,c):g==="Color"&&d.IsOutlineConfig&&f instanceof P&&typeof c=="string"?_u(f,c):g==="Tolerance"&&d.IsOutlineConfig&&f instanceof P&&typeof c=="number"?T(f.postproduction.customEffects,"tolerance",c,{slider:!0,min:0,max:6,step:.01}):g==="Outline"&&d.IsOutlineConfig&&f instanceof P&&typeof c=="boolean"?dt(f.postproduction.customEffects,"outlineEnabled",c):g==="Gloss"&&d.IsGlossConfig&&f instanceof P&&typeof c=="boolean"?dt(f.postproduction.customEffects,"glossEnabled",c):g==="Min"&&d.IsGlossConfig&&f instanceof P&&typeof c=="number"?T(f.postproduction.customEffects,"minGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):g==="Max"&&d.IsGlossConfig&&f instanceof P&&typeof c=="number"?T(f.postproduction.customEffects,"maxGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):g==="Exponent"&&d.IsGlossConfig&&f instanceof P&&typeof c=="number"?T(f.postproduction.customEffects,"glossExponent",c,{slider:!0,min:0,max:5,step:.01}):g==="Gamma Correction"&&d.IsGammaConfig&&f instanceof P&&typeof c=="boolean"?$u(f,c):c}},u.addEventListener("cellcreated",({detail:c})=>{const d=c.cell.parentNode;if(!d)return;const p=d.querySelector("bim-table-cell[column='Name']"),y=d.querySelector("bim-table-cell[column='Value']");p&&!y&&(p.style.gridColumn="1 / -1")});const h=[];for(const[,c]of i.list){const{scene:d,camera:p,renderer:y}=c,x=pe(t,c),b={data:{Name:c instanceof Er&&c.name||c.uuid},children:[]};if(d){const f={data:{Name:"Scene"}};if(x){const w={data:{Name:"Grid",Value:x.three.visible,World:c.uuid,IsGridConfig:!0},children:[{data:{Name:"Color",get Value(){return`#${x.material.uniforms.uColor.value.getHexString()}`},World:c.uuid,IsGridConfig:!0}},{data:{Name:"Size",get Value(){const C=x.material.uniforms.uSize1.value,$=x.material.uniforms.uSize2.value;return JSON.stringify({x:C,y:$})},World:c.uuid,IsGridConfig:!0}},{data:{Name:"Distance",Value:x.material.uniforms.uDistance.value,World:c.uuid,IsGridConfig:!0}}]};f.children||(f.children=[]),f.children.push(w)}const g=d.three.children.filter(w=>w instanceof Nr);for(const w of g){const C={data:{Name:"Directional Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Position",Value:JSON.stringify(w.position),World:c.uuid,Light:w.uuid}},{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};f.children||(f.children=[]),f.children.push(C)}const v=d.three.children.filter(w=>w instanceof Pr);for(const w of v){const C={data:{Name:"Ambient Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};f.children||(f.children=[]),f.children.push(C)}f.children&&((s=f.children)==null?void 0:s.length)>0&&((o=b.children)==null||o.push(f))}if(p.three instanceof Ge){const f={data:{Name:"Perspective Camera"},children:[{data:{Name:"Near Frustum",Value:p.three.near,World:c.uuid}},{data:{Name:"Far Frustum",Value:p.three.far,World:c.uuid}},{data:{Name:"Field of View",Value:p.three.fov,World:c.uuid}}]};if(p.hasCameraControls()){const{controls:g}=p,v={dollyDragInverted:"Invert Drag",dollySpeed:"Dolly Speed",truckSpeed:"Truck Speed",smoothTime:"Smooth Time"};for(const w in v){const C=g[w];C!=null&&((r=f.children)==null||r.push({data:{Name:v[w],Value:C,World:c.uuid}}))}}(a=b.children)==null||a.push(f)}if(y instanceof P){const{postproduction:f}=y,g=f.n8ao.configuration,v={data:{Name:"Renderer"},children:[{data:{Name:"Gamma Correction",Value:f.settings.gamma??!1,World:c.uuid,IsGammaConfig:!0}},{data:{Name:"Ambient Oclussion",Value:f.settings.ao??!1,World:c.uuid,IsAOConfig:!0},children:[{data:{Name:"Samples",Value:g.aoSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Color",Value:`#${g.color.getHexString()}`,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Half Resolution",Value:g.halfRes,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Screen Space Radius",Value:g.screenSpaceRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Radius",Value:g.aoRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Intensity",Value:g.intensity,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Distance Falloff",Value:g.distanceFalloff,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Samples",Value:g.denoiseSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Radius",Value:g.denoiseRadius,World:c.uuid,IsAOConfig:!0}}]},{data:{Name:"Custom Effects",Value:f.settings.custom??!1,World:c.uuid,IsCEConfig:!0},children:[{data:{Name:"Gloss",Value:f.customEffects.glossEnabled,World:c.uuid,IsGlossConfig:!0},children:[{data:{Name:"Min",Value:f.customEffects.minGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Max",Value:f.customEffects.maxGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Exponent",Value:f.customEffects.glossExponent,World:c.uuid,IsGlossConfig:!0}}]},{data:{Name:"Outline",Value:f.customEffects.outlineEnabled,World:c.uuid,IsOutlineConfig:!0},children:[{data:{Name:"Color",get Value(){const w=new Ne(f.customEffects.lineColor),C=f.customEffects.opacity;return JSON.stringify({color:`#${w.getHexString()}`,opacity:C})},World:c.uuid,IsOutlineConfig:!0}},{data:{Name:"Tolerance",Value:f.customEffects.tolerance,World:c.uuid,IsOutlineConfig:!0}}]}]}]};(l=b.children)==null||l.push(v)}h.push(b)}u.columns=[{name:"Name",width:"11rem"}],u.hiddenColumns=["World","Light","IsAOConfig","IsCEConfig","IsGlossConfig","IsOutlineConfig","IsGammaConfig","IsGridConfig"],u.data=h})} headers-hidden expanded></bim-table>`},Au=(e,t=!0)=>{const i=_t.create(Eu,e);if(t){const[n]=i,s=()=>i[1](),{components:o}=e,r=o.get(Ki);r.onDisposed.add(n.remove);for(const[,a]of r.list)a.onDisposed.add(s);n.addEventListener("disconnected",()=>{r.onDisposed.remove(n.remove);for(const[,a]of r.list)a.onDisposed.remove(s)})}return i},Su=Object.freeze(Object.defineProperty({__proto__:null,worldsConfiguration:Au},Symbol.toStringTag,{value:"Module"}));({...Jc,...Kc,...nu,...pu,...gu,...Su});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ti=globalThis,gn=ti.ShadowRoot&&(ti.ShadyCSS===void 0||ti.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,vn=Symbol(),us=new WeakMap;let or=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==vn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(gn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=us.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&us.set(t,e))}return e}toString(){return this.cssText}};const ku=e=>new or(typeof e=="string"?e:e+"",void 0,vn),rr=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,s,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new or(i,e,vn)},Ou=(e,t)=>{if(gn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),s=ti.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)}},hs=gn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return ku(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Tu,defineProperty:Nu,getOwnPropertyDescriptor:Pu,getOwnPropertyNames:Mu,getOwnPropertySymbols:Iu,getPrototypeOf:Lu}=Object,Jt=globalThis,ds=Jt.trustedTypes,zu=ds?ds.emptyScript:"",ps=Jt.reactiveElementPolyfillSupport,ye=(e,t)=>e,hi={toAttribute(e,t){switch(t){case Boolean:e=e?zu:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},yn=(e,t)=>!Tu(e,t),ms={attribute:!0,type:String,converter:hi,reflect:!1,hasChanged:yn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Jt.litPropertyMetadata??(Jt.litPropertyMetadata=new WeakMap);class Dt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=ms){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),s=this.getPropertyDescriptor(t,n,i);s!==void 0&&Nu(this.prototype,t,s)}}static getPropertyDescriptor(t,i,n){const{get:s,set:o}=Pu(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return s==null?void 0:s.call(this)},set(r){const a=s==null?void 0:s.call(this);o.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ms}static _$Ei(){if(this.hasOwnProperty(ye("elementProperties")))return;const t=Lu(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ye("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ye("properties"))){const i=this.properties,n=[...Mu(i),...Iu(i)];for(const s of n)this.createProperty(s,i[s])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,s]of i)this.elementProperties.set(n,s)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const s=this._$Eu(i,n);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const s of n)i.unshift(hs(s))}else t!==void 0&&i.push(hs(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ou(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const r=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:hi).toAttribute(i,s.type);this._$Em=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(t,i){var n;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const r=s.getPropertyOptions(o),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:hi;this._$Em=o,this[o]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??yn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,r]of s)r.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(n)):this._$EU()}catch(s){throw i=!1,this._$EU(),s}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var s;return(s=n.hostUpdated)==null?void 0:s.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Dt.elementStyles=[],Dt.shadowRootOptions={mode:"open"},Dt[ye("elementProperties")]=new Map,Dt[ye("finalized")]=new Map,ps==null||ps({ReactiveElement:Dt}),(Jt.reactiveElementVersions??(Jt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const di=globalThis,pi=di.trustedTypes,fs=pi?pi.createPolicy("lit-html",{createHTML:e=>e}):void 0,ar="$lit$",mt=`lit$${Math.random().toFixed(9).slice(2)}$`,lr="?"+mt,Ru=`<${lr}>`,Mt=document,Se=()=>Mt.createComment(""),ke=e=>e===null||typeof e!="object"&&typeof e!="function",cr=Array.isArray,ju=e=>cr(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",zi=`[ 	
\f\r]`,me=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bs=/-->/g,gs=/>/g,St=RegExp(`>|${zi}(?:([^\\s"'>=/]+)(${zi}*=${zi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vs=/'/g,ys=/"/g,ur=/^(?:script|style|textarea|title)$/i,Hu=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),hr=Hu(1),Qt=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),_s=new WeakMap,Ot=Mt.createTreeWalker(Mt,129);function dr(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return fs!==void 0?fs.createHTML(t):t}const Du=(e,t)=>{const i=e.length-1,n=[];let s,o=t===2?"<svg>":"",r=me;for(let a=0;a<i;a++){const l=e[a];let u,h,c=-1,d=0;for(;d<l.length&&(r.lastIndex=d,h=r.exec(l),h!==null);)d=r.lastIndex,r===me?h[1]==="!--"?r=bs:h[1]!==void 0?r=gs:h[2]!==void 0?(ur.test(h[2])&&(s=RegExp("</"+h[2],"g")),r=St):h[3]!==void 0&&(r=St):r===St?h[0]===">"?(r=s??me,c=-1):h[1]===void 0?c=-2:(c=r.lastIndex-h[2].length,u=h[1],r=h[3]===void 0?St:h[3]==='"'?ys:vs):r===ys||r===vs?r=St:r===bs||r===gs?r=me:(r=St,s=void 0);const p=r===St&&e[a+1].startsWith("/>")?" ":"";o+=r===me?l+Ru:c>=0?(n.push(u),l.slice(0,c)+ar+l.slice(c)+mt+p):l+mt+(c===-2?a:p)}return[dr(e,o+(e[i]||"<?>")+(t===2?"</svg>":"")),n]};class Oe{constructor({strings:t,_$litType$:i},n){let s;this.parts=[];let o=0,r=0;const a=t.length-1,l=this.parts,[u,h]=Du(t,i);if(this.el=Oe.createElement(u,n),Ot.currentNode=this.el.content,i===2){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=Ot.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(ar)){const d=h[r++],p=s.getAttribute(c).split(mt),y=/([.?@])?(.*)/.exec(d);l.push({type:1,index:o,name:y[2],strings:p,ctor:y[1]==="."?Bu:y[1]==="?"?Uu:y[1]==="@"?Vu:Si}),s.removeAttribute(c)}else c.startsWith(mt)&&(l.push({type:6,index:o}),s.removeAttribute(c));if(ur.test(s.tagName)){const c=s.textContent.split(mt),d=c.length-1;if(d>0){s.textContent=pi?pi.emptyScript:"";for(let p=0;p<d;p++)s.append(c[p],Se()),Ot.nextNode(),l.push({type:2,index:++o});s.append(c[d],Se())}}}else if(s.nodeType===8)if(s.data===lr)l.push({type:2,index:o});else{let c=-1;for(;(c=s.data.indexOf(mt,c+1))!==-1;)l.push({type:7,index:o}),c+=mt.length-1}o++}}static createElement(t,i){const n=Mt.createElement("template");return n.innerHTML=t,n}}function Zt(e,t,i=e,n){var s,o;if(t===Qt)return t;let r=n!==void 0?(s=i._$Co)==null?void 0:s[n]:i._$Cl;const a=ke(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((o=r==null?void 0:r._$AO)==null||o.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i._$Co??(i._$Co=[]))[n]=r:i._$Cl=r),r!==void 0&&(t=Zt(e,r._$AS(e,t.values),r,n)),t}class Fu{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,s=((t==null?void 0:t.creationScope)??Mt).importNode(i,!0);Ot.currentNode=s;let o=Ot.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let u;l.type===2?u=new We(o,o.nextSibling,this,t):l.type===1?u=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(u=new Wu(o,this,t)),this._$AV.push(u),l=n[++a]}r!==(l==null?void 0:l.index)&&(o=Ot.nextNode(),r++)}return Ot.currentNode=Mt,s}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class We{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,i,n,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=Zt(this,t,i),ke(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==Qt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ju(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==z&&ke(this._$AH)?this._$AA.nextSibling.data=t:this.T(Mt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Oe.createElement(dr(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===o)this._$AH.p(n);else{const r=new Fu(o,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=_s.get(t.strings);return i===void 0&&_s.set(t.strings,i=new Oe(t)),i}k(t){cr(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,s=0;for(const o of t)s===i.length?i.push(n=new We(this.S(Se()),this.S(Se()),this,this.options)):n=i[s],n._$AI(o),s++;s<i.length&&(this._$AR(n&&n._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var i;this._$AM===void 0&&(this._$Cv=t,(i=this._$AP)==null||i.call(this,t))}}class Si{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,s,o){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}_$AI(t,i=this,n,s){const o=this.strings;let r=!1;if(o===void 0)t=Zt(this,t,i,0),r=!ke(t)||t!==this._$AH&&t!==Qt,r&&(this._$AH=t);else{const a=t;let l,u;for(t=o[0],l=0;l<o.length-1;l++)u=Zt(this,a[n+l],i,l),u===Qt&&(u=this._$AH[l]),r||(r=!ke(u)||u!==this._$AH[l]),u===z?t=z:t!==z&&(t+=(u??"")+o[l+1]),this._$AH[l]=u}r&&!s&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Bu extends Si{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class Uu extends Si{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class Vu extends Si{constructor(t,i,n,s,o){super(t,i,n,s,o),this.type=5}_$AI(t,i=this){if((t=Zt(this,t,i,0)??z)===Qt)return;const n=this._$AH,s=t===z&&n!==z||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==z&&(n===z||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Wu{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Zt(this,t)}}const xs=di.litHtmlPolyfillSupport;xs==null||xs(Oe,We),(di.litHtmlVersions??(di.litHtmlVersions=[])).push("3.1.4");const qu=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let s=n._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;n._$litPart$=s=new We(t.insertBefore(Se(),o),o,void 0,i??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Bt extends Dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const i=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qu(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Qt}}var ws;Bt._$litElement$=!0,Bt.finalized=!0,(ws=globalThis.litElementHydrateSupport)==null||ws.call(globalThis,{LitElement:Bt});const $s=globalThis.litElementPolyfillSupport;$s==null||$s({LitElement:Bt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.6");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gu={attribute:!0,type:String,converter:hi,reflect:!1,hasChanged:yn},Yu=(e=Gu,t,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function X(e){return(t,i)=>typeof i=="object"?Yu(e,t,i):((n,s,o)=>{const r=s.hasOwnProperty(o);return s.constructor.createProperty(o,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(s,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Xu(e){return X({...e,state:!0,attribute:!1})}class Ju extends Mr{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new Ir(.5,.5),this.addEventListener("removed",function(){this.traverse(function(i){i.element instanceof Element&&i.element.parentNode!==null&&i.element.parentNode.removeChild(i.element)})})}copy(t,i){return super.copy(t,i),this.element=t.element.cloneNode(!0),this.center=t.center,this}}new en;new mi;new mi;new en;new en;class Qu{constructor(t,i){this._group=new xn,this._frustum=new Sr,this._frustumMat=new mi,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new kr({color:"#2e3338"}),this.numbers=new xn,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._camera=t,this._container=i;const n=this.newGrid(-1),s=this.newGrid(-2);this.grids={main:n,secondary:s},this._group.add(s,n,this.numbers)}set scaleX(t){this._scaleX=t,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(t){this._scaleY=t,this.regenerate()}get scaleY(){return this._scaleY}get(){return this._group}dispose(){const{main:t,secondary:i}=this.grids;t.removeFromParent(),i.removeFromParent(),t.geometry.dispose(),t.material.dispose(),i.geometry.dispose(),i.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const t=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(t);const{planes:i}=this._frustum,n=i[0].constant*-i[0].normal.x,s=i[1].constant*-i[1].normal.x,o=i[2].constant*-i[2].normal.y,r=i[3].constant*-i[3].normal.y,a=Math.abs(n-s),l=Math.abs(r-o),{clientWidth:u,clientHeight:h}=this._container,c=Math.max(u,h),d=Math.max(a,l)/c,p=Math.ceil(Math.log10(a/this.scaleX)),y=Math.ceil(Math.log10(l/this.scaleY)),x=10**(p-2)*this.scaleX,b=10**(y-2)*this.scaleY,f=x*this.gridsFactor,g=b*this.gridsFactor,v=Math.ceil(l/g),w=Math.ceil(a/f),C=Math.ceil(l/b),$=Math.ceil(a/x),E=x*Math.ceil(s/x),H=b*Math.ceil(o/b),R=f*Math.ceil(s/f),k=g*Math.ceil(o/g),lt=[...this.numbers.children];for(const j of lt)j.removeFromParent();this.numbers.children=[];const tt=[],ct=9*d,M=1e4,ut=Math.round(Math.abs(R/this.scaleX)*M)/M,J=(w-1)*f,Q=Math.round(Math.abs((R+J)/this.scaleX)*M)/M,B=Math.max(ut,Q).toString().length*ct;let U=Math.ceil(B/f)*f;for(let j=0;j<w;j++){let L=R+j*f;tt.push(L,r,0,L,o,0);const ue=L/this.scaleX;L=Math.round(L*M)/M,U=Math.round(U*M)/M;const qe=L%U;if(!(f<1||g<1)&&Math.abs(qe)>.01)continue;const Oi=this.newNumber(ue),yr=12*d;Oi.position.set(L,o+yr,0)}for(let j=0;j<v;j++){const L=k+j*g;tt.push(s,L,0,n,L,0);const ue=this.newNumber(L/this.scaleY);let qe=12;ue.element.textContent&&(qe+=4*ue.element.textContent.length);const Oi=qe*d;ue.position.set(s+Oi,L,0)}const ce=[];for(let j=0;j<$;j++){const L=E+j*x;ce.push(L,r,0,L,o,0)}for(let j=0;j<C;j++){const L=H+j*b;ce.push(s,L,0,n,L,0)}const fr=new wn(new Float32Array(tt),3),br=new wn(new Float32Array(ce),3),{main:gr,secondary:vr}=this.grids;gr.geometry.setAttribute("position",fr),vr.geometry.setAttribute("position",br)}newNumber(t){const i=document.createElement("bim-label");i.textContent=String(Math.round(t*100)/100);const n=new Ju(i);return this.numbers.add(n),n}newGrid(t){const i=new Or,n=new Tr(i,this.material);return n.frustumCulled=!1,n.renderOrder=t,n}isGridReady(){const t=this._camera.projectionMatrix.elements;for(let i=0;i<t.length;i++){const n=t[i];if(Number.isNaN(n))return!1}return!0}}var Zu=Object.defineProperty,Ku=Object.getOwnPropertyDescriptor,_n=(e,t,i,n)=>{for(var s=Ku(t,i),o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Zu(t,i,s),s};const pr=class extends Bt{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(t){if(this._gridColor=t,!(t&&this._grid))return;const i=Number(t.replace("#","0x"));Number.isNaN(i)||this._grid.material.color.setHex(i)}get gridColor(){return this._gridColor}set gridScaleX(t){this._gridScaleX=t,t&&this._grid&&(this._grid.scaleX=t)}get gridScaleX(){return this._gridScaleX}set gridScaleY(t){this._gridScaleY=t,t&&this._grid&&(this._grid.scaleY=t)}get gridScaleY(){return this._gridScaleY}set components(t){this.dispose();const i=t.get(Ki).create();this._world=i,i.scene=new _r(t),i.scene.setup(),i.renderer=new Hr(t,this);const n=new xr(t);i.camera=n;const s=new Qu(n.threeOrtho,this);this._grid=s,i.scene.three.add(s.get()),n.controls.addEventListener("update",()=>s.regenerate()),setTimeout(async()=>{i.camera.updateAspect(),n.set("Plan"),await n.controls.setLookAt(0,0,100,0,0,0),await n.projection.set("Orthographic"),n.controls.dollySpeed=3,n.controls.draggingSmoothTime=.085,n.controls.maxZoom=1e3,n.controls.zoom(4)})}get world(){return this._world}dispose(){var t;(t=this.world)==null||t.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return hr`<slot></slot>`}};pr.styles=rr`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let ki=pr;_n([X({type:String,attribute:"grid-color",reflect:!0})],ki.prototype,"gridColor");_n([X({type:Number,attribute:"grid-scale-x",reflect:!0})],ki.prototype,"gridScaleX");_n([X({type:Number,attribute:"grid-scale-y",reflect:!0})],ki.prototype,"gridScaleY");var th=Object.defineProperty,Ct=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&th(t,i,s),s};const mr=class extends Bt{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new mi,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=t=>Math.abs(t)<1e-10?0:t}set camera(t){this._camera=t,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:t}=this._matrix;this._cssMatrix3D=`matrix3d(
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
    `}render(){const t=this.size??this._defaults.size;return hr`
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
    `}};mr.styles=rr`
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
  `;let at=mr;Ct([X({type:Number,reflect:!0})],at.prototype,"size");Ct([X({type:String,attribute:"right-text",reflect:!0})],at.prototype,"rightText");Ct([X({type:String,attribute:"left-text",reflect:!0})],at.prototype,"leftText");Ct([X({type:String,attribute:"top-text",reflect:!0})],at.prototype,"topText");Ct([X({type:String,attribute:"bottom-text",reflect:!0})],at.prototype,"bottomText");Ct([X({type:String,attribute:"front-text",reflect:!0})],at.prototype,"frontText");Ct([X({type:String,attribute:"back-text",reflect:!0})],at.prototype,"backText");Ct([Xu()],at.prototype,"_cssMatrix3D");class rh{static init(){Qi.defineCustomElement("bim-view-cube",at),Qi.defineCustomElement("bim-world-2d",ki)}}export{rh as r};
