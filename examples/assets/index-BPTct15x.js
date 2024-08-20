import{e as De,t as fn,a as gn,L as Ur,i as Vr,_ as Ht,J as at,E as Wr,b as Gr,m as Uo,P as qr,R as Yr,l as Xr,X as di}from"./index-Cbq44wZW.js";import{V as vn,c as Si,G as zn,F as Jr,L as Qr,d as Fn,e as Zr,f as Kr,P as ti,g as ye,D as ta,A as ea,C as ze,O as ia,h as na,I as oa,R as sa,i as Vo,j as Wo,k as ra,l as Go,m as aa,n as la,o as qo,p as Yo,q as ca}from"./web-ifc-api-CgBULNZm.js";import{X as da,r as ua,$ as L}from"./index-DconH7kp.js";var ha=Object.defineProperty,pa=(e,t,i)=>t in e?ha(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,It=(e,t,i)=>(pa(e,typeof t!="symbol"?t+"":t,i),i);const Jt=Math.min,ht=Math.max,ui=Math.round,$t=e=>({x:e,y:e}),ma={left:"right",right:"left",bottom:"top",top:"bottom"},ba={start:"end",end:"start"};function Hn(e,t,i){return ht(e,Jt(t,i))}function Fe(e,t){return typeof e=="function"?e(t):e}function mt(e){return e.split("-")[0]}function ki(e){return e.split("-")[1]}function Xo(e){return e==="x"?"y":"x"}function Jo(e){return e==="y"?"height":"width"}function Rt(e){return["top","bottom"].includes(mt(e))?"y":"x"}function Qo(e){return Xo(Rt(e))}function fa(e,t,i){i===void 0&&(i=!1);const n=ki(e),o=Qo(e),s=Jo(o);let r=o==="x"?n===(i?"end":"start")?"right":"left":n==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=hi(r)),[r,hi(r)]}function ga(e){const t=hi(e);return[Ki(e),t,Ki(t)]}function Ki(e){return e.replace(/start|end/g,t=>ba[t])}function va(e,t,i){const n=["left","right"],o=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return i?t?o:n:t?n:o;case"left":case"right":return t?s:r;default:return[]}}function ya(e,t,i,n){const o=ki(e);let s=va(mt(e),i==="start",n);return o&&(s=s.map(r=>r+"-"+o),t&&(s=s.concat(s.map(Ki)))),s}function hi(e){return e.replace(/left|right|bottom|top/g,t=>ma[t])}function _a(e){return{top:0,right:0,bottom:0,left:0,...e}}function Zo(e){return typeof e!="number"?_a(e):{top:e,right:e,bottom:e,left:e}}function Qt(e){const{x:t,y:i,width:n,height:o}=e;return{width:n,height:o,top:i,left:t,right:t+n,bottom:i+o,x:t,y:i}}function Bn(e,t,i){let{reference:n,floating:o}=e;const s=Rt(t),r=Qo(t),a=Jo(r),l=mt(t),d=s==="y",u=n.x+n.width/2-o.width/2,c=n.y+n.height/2-o.height/2,h=n[a]/2-o[a]/2;let p;switch(l){case"top":p={x:u,y:n.y-o.height};break;case"bottom":p={x:u,y:n.y+n.height};break;case"right":p={x:n.x+n.width,y:c};break;case"left":p={x:n.x-o.width,y:c};break;default:p={x:n.x,y:n.y}}switch(ki(t)){case"start":p[r]-=h*(i&&d?-1:1);break;case"end":p[r]+=h*(i&&d?-1:1);break}return p}const xa=async(e,t,i)=>{const{placement:n="bottom",strategy:o="absolute",middleware:s=[],platform:r}=i,a=s.filter(Boolean),l=await(r.isRTL==null?void 0:r.isRTL(t));let d=await r.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:c}=Bn(d,n,l),h=n,p={},g=0;for(let _=0;_<a.length;_++){const{name:v,fn:f}=a[_],{x:y,y:x,data:w,reset:E}=await f({x:u,y:c,initialPlacement:n,placement:h,strategy:o,middlewareData:p,rects:d,platform:r,elements:{reference:e,floating:t}});u=y??u,c=x??c,p={...p,[v]:{...p[v],...w}},E&&g<=50&&(g++,typeof E=="object"&&(E.placement&&(h=E.placement),E.rects&&(d=E.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:o}):E.rects),{x:u,y:c}=Bn(d,h,l)),_=-1)}return{x:u,y:c,placement:h,strategy:o,middlewareData:p}};async function Ko(e,t){var i;t===void 0&&(t={});const{x:n,y:o,platform:s,rects:r,elements:a,strategy:l}=e,{boundary:d="clippingAncestors",rootBoundary:u="viewport",elementContext:c="floating",altBoundary:h=!1,padding:p=0}=Fe(t,e),g=Zo(p),_=a[h?c==="floating"?"reference":"floating":c],v=Qt(await s.getClippingRect({element:(i=await(s.isElement==null?void 0:s.isElement(_)))==null||i?_:_.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:d,rootBoundary:u,strategy:l})),f=c==="floating"?{x:n,y:o,width:r.floating.width,height:r.floating.height}:r.reference,y=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),x=await(s.isElement==null?void 0:s.isElement(y))?await(s.getScale==null?void 0:s.getScale(y))||{x:1,y:1}:{x:1,y:1},w=Qt(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:f,offsetParent:y,strategy:l}):f);return{top:(v.top-w.top+g.top)/x.y,bottom:(w.bottom-v.bottom+g.bottom)/x.y,left:(v.left-w.left+g.left)/x.x,right:(w.right-v.right+g.right)/x.x}}const wa=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,n;const{placement:o,middlewareData:s,rects:r,initialPlacement:a,platform:l,elements:d}=t,{mainAxis:u=!0,crossAxis:c=!0,fallbackPlacements:h,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:_=!0,...v}=Fe(e,t);if((i=s.arrow)!=null&&i.alignmentOffset)return{};const f=mt(o),y=Rt(a),x=mt(a)===a,w=await(l.isRTL==null?void 0:l.isRTL(d.floating)),E=h||(x||!_?[hi(a)]:ga(a)),C=g!=="none";!h&&C&&E.push(...ya(a,_,g,w));const A=[a,...E],N=await Ko(t,v),$=[];let S=((n=s.flip)==null?void 0:n.overflows)||[];if(u&&$.push(N[f]),c){const j=fa(o,r,w);$.push(N[j[0]],N[j[1]])}if(S=[...S,{placement:o,overflows:$}],!$.every(j=>j<=0)){var k,U;const j=(((k=s.flip)==null?void 0:k.index)||0)+1,ct=A[j];if(ct)return{data:{index:j,overflows:S},reset:{placement:ct}};let it=(U=S.filter(nt=>nt.overflows[0]<=0).sort((nt,q)=>nt.overflows[1]-q.overflows[1])[0])==null?void 0:U.placement;if(!it)switch(p){case"bestFit":{var vt;const nt=(vt=S.filter(q=>{if(C){const ot=Rt(q.placement);return ot===y||ot==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(ot=>ot>0).reduce((ot,ge)=>ot+ge,0)]).sort((q,ot)=>q[1]-ot[1])[0])==null?void 0:vt[0];nt&&(it=nt);break}case"initialPlacement":it=a;break}if(o!==it)return{reset:{placement:it}}}return{}}}};function ts(e){const t=Jt(...e.map(s=>s.left)),i=Jt(...e.map(s=>s.top)),n=ht(...e.map(s=>s.right)),o=ht(...e.map(s=>s.bottom));return{x:t,y:i,width:n-t,height:o-i}}function $a(e){const t=e.slice().sort((o,s)=>o.y-s.y),i=[];let n=null;for(let o=0;o<t.length;o++){const s=t[o];!n||s.y-n.y>n.height/2?i.push([s]):i[i.length-1].push(s),n=s}return i.map(o=>Qt(ts(o)))}const Ca=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:n,rects:o,platform:s,strategy:r}=t,{padding:a=2,x:l,y:d}=Fe(e,t),u=Array.from(await(s.getClientRects==null?void 0:s.getClientRects(n.reference))||[]),c=$a(u),h=Qt(ts(u)),p=Zo(a);function g(){if(c.length===2&&c[0].left>c[1].right&&l!=null&&d!=null)return c.find(v=>l>v.left-p.left&&l<v.right+p.right&&d>v.top-p.top&&d<v.bottom+p.bottom)||h;if(c.length>=2){if(Rt(i)==="y"){const S=c[0],k=c[c.length-1],U=mt(i)==="top",vt=S.top,j=k.bottom,ct=U?S.left:k.left,it=U?S.right:k.right,nt=it-ct,q=j-vt;return{top:vt,bottom:j,left:ct,right:it,width:nt,height:q,x:ct,y:vt}}const v=mt(i)==="left",f=ht(...c.map(S=>S.right)),y=Jt(...c.map(S=>S.left)),x=c.filter(S=>v?S.left===y:S.right===f),w=x[0].top,E=x[x.length-1].bottom,C=y,A=f,N=A-C,$=E-w;return{top:w,bottom:E,left:C,right:A,width:N,height:$,x:C,y:w}}return h}const _=await s.getElementRects({reference:{getBoundingClientRect:g},floating:n.floating,strategy:r});return o.reference.x!==_.reference.x||o.reference.y!==_.reference.y||o.reference.width!==_.reference.width||o.reference.height!==_.reference.height?{reset:{rects:_}}:{}}}};async function Ea(e,t){const{placement:i,platform:n,elements:o}=e,s=await(n.isRTL==null?void 0:n.isRTL(o.floating)),r=mt(i),a=ki(i),l=Rt(i)==="y",d=["left","top"].includes(r)?-1:1,u=s&&l?-1:1,c=Fe(t,e);let{mainAxis:h,crossAxis:p,alignmentAxis:g}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...c};return a&&typeof g=="number"&&(p=a==="end"?g*-1:g),l?{x:p*u,y:h*d}:{x:h*d,y:p*u}}const es=function(e){return{name:"offset",options:e,async fn(t){var i,n;const{x:o,y:s,placement:r,middlewareData:a}=t,l=await Ea(t,e);return r===((i=a.offset)==null?void 0:i.placement)&&(n=a.arrow)!=null&&n.alignmentOffset?{}:{x:o+l.x,y:s+l.y,data:{...l,placement:r}}}}},Aa=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:n,placement:o}=t,{mainAxis:s=!0,crossAxis:r=!1,limiter:a={fn:v=>{let{x:f,y}=v;return{x:f,y}}},...l}=Fe(e,t),d={x:i,y:n},u=await Ko(t,l),c=Rt(mt(o)),h=Xo(c);let p=d[h],g=d[c];if(s){const v=h==="y"?"top":"left",f=h==="y"?"bottom":"right",y=p+u[v],x=p-u[f];p=Hn(y,p,x)}if(r){const v=c==="y"?"top":"left",f=c==="y"?"bottom":"right",y=g+u[v],x=g-u[f];g=Hn(y,g,x)}const _=a.fn({...t,[h]:p,[c]:g});return{..._,data:{x:_.x-i,y:_.y-n}}}}};function Ct(e){return is(e)?(e.nodeName||"").toLowerCase():"#document"}function V(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function At(e){var t;return(t=(is(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function is(e){return e instanceof Node||e instanceof V(e).Node}function st(e){return e instanceof Element||e instanceof V(e).Element}function rt(e){return e instanceof HTMLElement||e instanceof V(e).HTMLElement}function Un(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof V(e).ShadowRoot}function He(e){const{overflow:t,overflowX:i,overflowY:n,display:o}=X(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+i)&&!["inline","contents"].includes(o)}function Sa(e){return["table","td","th"].includes(Ct(e))}function ka(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function yn(e){const t=_n(),i=st(e)?X(e):e;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(i.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(i.contain||"").includes(n))}function Oa(e){let t=Zt(e);for(;rt(t)&&!Oi(t);){if(yn(t))return t;if(ka(t))return null;t=Zt(t)}return null}function _n(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Oi(e){return["html","body","#document"].includes(Ct(e))}function X(e){return V(e).getComputedStyle(e)}function Ti(e){return st(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Zt(e){if(Ct(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Un(e)&&e.host||At(e);return Un(t)?t.host:t}function ns(e){const t=Zt(e);return Oi(t)?e.ownerDocument?e.ownerDocument.body:e.body:rt(t)&&He(t)?t:ns(t)}function tn(e,t,i){var n;t===void 0&&(t=[]),i===void 0&&(i=!0);const o=ns(e),s=o===((n=e.ownerDocument)==null?void 0:n.body),r=V(o);if(s){const a=Ta(r);return t.concat(r,r.visualViewport||[],He(o)?o:[],a&&i?tn(a):[])}return t.concat(o,tn(o,[],i))}function Ta(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function os(e){const t=X(e);let i=parseFloat(t.width)||0,n=parseFloat(t.height)||0;const o=rt(e),s=o?e.offsetWidth:i,r=o?e.offsetHeight:n,a=ui(i)!==s||ui(n)!==r;return a&&(i=s,n=r),{width:i,height:n,$:a}}function ss(e){return st(e)?e:e.contextElement}function Yt(e){const t=ss(e);if(!rt(t))return $t(1);const i=t.getBoundingClientRect(),{width:n,height:o,$:s}=os(t);let r=(s?ui(i.width):i.width)/n,a=(s?ui(i.height):i.height)/o;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const Ia=$t(0);function rs(e){const t=V(e);return!_n()||!t.visualViewport?Ia:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Na(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==V(e)?!1:t}function ke(e,t,i,n){t===void 0&&(t=!1),i===void 0&&(i=!1);const o=e.getBoundingClientRect(),s=ss(e);let r=$t(1);t&&(n?st(n)&&(r=Yt(n)):r=Yt(e));const a=Na(s,i,n)?rs(s):$t(0);let l=(o.left+a.x)/r.x,d=(o.top+a.y)/r.y,u=o.width/r.x,c=o.height/r.y;if(s){const h=V(s),p=n&&st(n)?V(n):n;let g=h,_=g.frameElement;for(;_&&n&&p!==g;){const v=Yt(_),f=_.getBoundingClientRect(),y=X(_),x=f.left+(_.clientLeft+parseFloat(y.paddingLeft))*v.x,w=f.top+(_.clientTop+parseFloat(y.paddingTop))*v.y;l*=v.x,d*=v.y,u*=v.x,c*=v.y,l+=x,d+=w,g=V(_),_=g.frameElement}}return Qt({width:u,height:c,x:l,y:d})}const Pa=[":popover-open",":modal"];function as(e){return Pa.some(t=>{try{return e.matches(t)}catch{return!1}})}function Ma(e){let{elements:t,rect:i,offsetParent:n,strategy:o}=e;const s=o==="fixed",r=At(n),a=t?as(t.floating):!1;if(n===r||a&&s)return i;let l={scrollLeft:0,scrollTop:0},d=$t(1);const u=$t(0),c=rt(n);if((c||!c&&!s)&&((Ct(n)!=="body"||He(r))&&(l=Ti(n)),rt(n))){const h=ke(n);d=Yt(n),u.x=h.x+n.clientLeft,u.y=h.y+n.clientTop}return{width:i.width*d.x,height:i.height*d.y,x:i.x*d.x-l.scrollLeft*d.x+u.x,y:i.y*d.y-l.scrollTop*d.y+u.y}}function La(e){return Array.from(e.getClientRects())}function ls(e){return ke(At(e)).left+Ti(e).scrollLeft}function ja(e){const t=At(e),i=Ti(e),n=e.ownerDocument.body,o=ht(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),s=ht(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight);let r=-i.scrollLeft+ls(e);const a=-i.scrollTop;return X(n).direction==="rtl"&&(r+=ht(t.clientWidth,n.clientWidth)-o),{width:o,height:s,x:r,y:a}}function Ra(e,t){const i=V(e),n=At(e),o=i.visualViewport;let s=n.clientWidth,r=n.clientHeight,a=0,l=0;if(o){s=o.width,r=o.height;const d=_n();(!d||d&&t==="fixed")&&(a=o.offsetLeft,l=o.offsetTop)}return{width:s,height:r,x:a,y:l}}function Da(e,t){const i=ke(e,!0,t==="fixed"),n=i.top+e.clientTop,o=i.left+e.clientLeft,s=rt(e)?Yt(e):$t(1),r=e.clientWidth*s.x,a=e.clientHeight*s.y,l=o*s.x,d=n*s.y;return{width:r,height:a,x:l,y:d}}function Vn(e,t,i){let n;if(t==="viewport")n=Ra(e,i);else if(t==="document")n=ja(At(e));else if(st(t))n=Da(t,i);else{const o=rs(e);n={...t,x:t.x-o.x,y:t.y-o.y}}return Qt(n)}function cs(e,t){const i=Zt(e);return i===t||!st(i)||Oi(i)?!1:X(i).position==="fixed"||cs(i,t)}function za(e,t){const i=t.get(e);if(i)return i;let n=tn(e,[],!1).filter(a=>st(a)&&Ct(a)!=="body"),o=null;const s=X(e).position==="fixed";let r=s?Zt(e):e;for(;st(r)&&!Oi(r);){const a=X(r),l=yn(r);!l&&a.position==="fixed"&&(o=null),(s?!l&&!o:!l&&a.position==="static"&&o&&["absolute","fixed"].includes(o.position)||He(r)&&!l&&cs(e,r))?n=n.filter(d=>d!==r):o=a,r=Zt(r)}return t.set(e,n),n}function Fa(e){let{element:t,boundary:i,rootBoundary:n,strategy:o}=e;const s=[...i==="clippingAncestors"?za(t,this._c):[].concat(i),n],r=s[0],a=s.reduce((l,d)=>{const u=Vn(t,d,o);return l.top=ht(u.top,l.top),l.right=Jt(u.right,l.right),l.bottom=Jt(u.bottom,l.bottom),l.left=ht(u.left,l.left),l},Vn(t,r,o));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function Ha(e){const{width:t,height:i}=os(e);return{width:t,height:i}}function Ba(e,t,i){const n=rt(t),o=At(t),s=i==="fixed",r=ke(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=$t(0);if(n||!n&&!s)if((Ct(t)!=="body"||He(o))&&(a=Ti(t)),n){const c=ke(t,!0,s,t);l.x=c.x+t.clientLeft,l.y=c.y+t.clientTop}else o&&(l.x=ls(o));const d=r.left+a.scrollLeft-l.x,u=r.top+a.scrollTop-l.y;return{x:d,y:u,width:r.width,height:r.height}}function Wn(e,t){return!rt(e)||X(e).position==="fixed"?null:t?t(e):e.offsetParent}function ds(e,t){const i=V(e);if(!rt(e)||as(e))return i;let n=Wn(e,t);for(;n&&Sa(n)&&X(n).position==="static";)n=Wn(n,t);return n&&(Ct(n)==="html"||Ct(n)==="body"&&X(n).position==="static"&&!yn(n))?i:n||Oa(e)||i}const Ua=async function(e){const t=this.getOffsetParent||ds,i=this.getDimensions;return{reference:Ba(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function Va(e){return X(e).direction==="rtl"}const Wa={convertOffsetParentRelativeRectToViewportRelativeRect:Ma,getDocumentElement:At,getClippingRect:Fa,getOffsetParent:ds,getElementRects:Ua,getClientRects:La,getDimensions:Ha,getScale:Yt,isElement:st,isRTL:Va},us=Aa,hs=wa,ps=Ca,ms=(e,t,i)=>{const n=new Map,o={platform:Wa,...i},s={...o.platform,_c:n};return xa(e,t,{...o,platform:s})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi=globalThis,xn=oi.ShadowRoot&&(oi.ShadyCSS===void 0||oi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,wn=Symbol(),Gn=new WeakMap;let bs=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==wn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(xn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Gn.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Gn.set(t,e))}return e}toString(){return this.cssText}};const Ga=e=>new bs(typeof e=="string"?e:e+"",void 0,wn),I=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new bs(i,e,wn)},qa=(e,t)=>{if(xn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),o=oi.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=i.cssText,e.appendChild(n)}},qn=xn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Ga(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ya,defineProperty:Xa,getOwnPropertyDescriptor:Ja,getOwnPropertyNames:Qa,getOwnPropertySymbols:Za,getPrototypeOf:Ka}=Object,Kt=globalThis,Yn=Kt.trustedTypes,tl=Yn?Yn.emptyScript:"",Xn=Kt.reactiveElementPolyfillSupport,$e=(e,t)=>e,pi={toAttribute(e,t){switch(t){case Boolean:e=e?tl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},$n=(e,t)=>!Ya(e,t),Jn={attribute:!0,type:String,converter:pi,reflect:!1,hasChanged:$n};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Kt.litPropertyMetadata??(Kt.litPropertyMetadata=new WeakMap);class Gt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Jn){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),o=this.getPropertyDescriptor(t,n,i);o!==void 0&&Xa(this.prototype,t,o)}}static getPropertyDescriptor(t,i,n){const{get:o,set:s}=Ja(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return o==null?void 0:o.call(this)},set(r){const a=o==null?void 0:o.call(this);s.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Jn}static _$Ei(){if(this.hasOwnProperty($e("elementProperties")))return;const t=Ka(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($e("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($e("properties"))){const i=this.properties,n=[...Qa(i),...Za(i)];for(const o of n)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,o]of i)this.elementProperties.set(n,o)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const o=this._$Eu(i,n);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const o of n)i.unshift(qn(o))}else t!==void 0&&i.push(qn(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qa(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:pi).toAttribute(i,o.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,i){var n;const o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=o.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:pi;this._$Em=s,this[s]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??$n)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,r]of o)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(o=>{var s;return(s=o.hostUpdate)==null?void 0:s.call(o)}),this.update(n)):this._$EU()}catch(o){throw i=!1,this._$EU(),o}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdated)==null?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Gt.elementStyles=[],Gt.shadowRootOptions={mode:"open"},Gt[$e("elementProperties")]=new Map,Gt[$e("finalized")]=new Map,Xn==null||Xn({ReactiveElement:Gt}),(Kt.reactiveElementVersions??(Kt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mi=globalThis,bi=mi.trustedTypes,Qn=bi?bi.createPolicy("lit-html",{createHTML:e=>e}):void 0,fs="$lit$",xt=`lit$${Math.random().toFixed(9).slice(2)}$`,gs="?"+xt,el=`<${gs}>`,Dt=document,Oe=()=>Dt.createComment(""),Te=e=>e===null||typeof e!="object"&&typeof e!="function",Cn=Array.isArray,il=e=>Cn(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ui=`[ 	
\f\r]`,_e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Zn=/-->/g,Kn=/>/g,Nt=RegExp(`>|${Ui}(?:([^\\s"'>=/]+)(${Ui}*=${Ui}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),to=/'/g,eo=/"/g,vs=/^(?:script|style|textarea|title)$/i,nl=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),m=nl(1),zt=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),io=new WeakMap,Mt=Dt.createTreeWalker(Dt,129);function ys(e,t){if(!Cn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qn!==void 0?Qn.createHTML(t):t}const ol=(e,t)=>{const i=e.length-1,n=[];let o,s=t===2?"<svg>":t===3?"<math>":"",r=_e;for(let a=0;a<i;a++){const l=e[a];let d,u,c=-1,h=0;for(;h<l.length&&(r.lastIndex=h,u=r.exec(l),u!==null);)h=r.lastIndex,r===_e?u[1]==="!--"?r=Zn:u[1]!==void 0?r=Kn:u[2]!==void 0?(vs.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Nt):u[3]!==void 0&&(r=Nt):r===Nt?u[0]===">"?(r=o??_e,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Nt:u[3]==='"'?eo:to):r===eo||r===to?r=Nt:r===Zn||r===Kn?r=_e:(r=Nt,o=void 0);const p=r===Nt&&e[a+1].startsWith("/>")?" ":"";s+=r===_e?l+el:c>=0?(n.push(d),l.slice(0,c)+fs+l.slice(c)+xt+p):l+xt+(c===-2?a:p)}return[ys(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Ie{constructor({strings:t,_$litType$:i},n){let o;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[d,u]=ol(t,i);if(this.el=Ie.createElement(d,n),Mt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=Mt.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(fs)){const h=u[r++],p=o.getAttribute(c).split(xt),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:s,name:g[2],strings:p,ctor:g[1]==="."?rl:g[1]==="?"?al:g[1]==="@"?ll:Ii}),o.removeAttribute(c)}else c.startsWith(xt)&&(l.push({type:6,index:s}),o.removeAttribute(c));if(vs.test(o.tagName)){const c=o.textContent.split(xt),h=c.length-1;if(h>0){o.textContent=bi?bi.emptyScript:"";for(let p=0;p<h;p++)o.append(c[p],Oe()),Mt.nextNode(),l.push({type:2,index:++s});o.append(c[h],Oe())}}}else if(o.nodeType===8)if(o.data===gs)l.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(xt,c+1))!==-1;)l.push({type:7,index:s}),c+=xt.length-1}s++}}static createElement(t,i){const n=Dt.createElement("template");return n.innerHTML=t,n}}function te(e,t,i=e,n){var o,s;if(t===zt)return t;let r=n!==void 0?(o=i.o)==null?void 0:o[n]:i.l;const a=Te(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i.o??(i.o=[]))[n]=r:i.l=r),r!==void 0&&(t=te(e,r._$AS(e,t.values),r,n)),t}class sl{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,o=((t==null?void 0:t.creationScope)??Dt).importNode(i,!0);Mt.currentNode=o;let s=Mt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new Be(s,s.nextSibling,this,t):l.type===1?d=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(d=new cl(s,this,t)),this._$AV.push(d),l=n[++a]}r!==(l==null?void 0:l.index)&&(s=Mt.nextNode(),r++)}return Mt.currentNode=Dt,o}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class Be{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,i,n,o){this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=o,this.v=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=te(this,t,i),Te(t)?t===M||t==null||t===""?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==zt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):il(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==M&&Te(this._$AH)?this._$AA.nextSibling.data=t:this.T(Dt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Ie.createElement(ys(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(n);else{const r=new sl(s,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=io.get(t.strings);return i===void 0&&io.set(t.strings,i=new Ie(t)),i}k(t){Cn(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,o=0;for(const s of t)o===i.length?i.push(n=new Be(this.O(Oe()),this.O(Oe()),this,this.options)):n=i[o],n._$AI(s),o++;o<i.length&&(this._$AR(n&&n._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var i;this._$AM===void 0&&(this.v=t,(i=this._$AP)==null||i.call(this,t))}}class Ii{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,o,s){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}_$AI(t,i=this,n,o){const s=this.strings;let r=!1;if(s===void 0)t=te(this,t,i,0),r=!Te(t)||t!==this._$AH&&t!==zt,r&&(this._$AH=t);else{const a=t;let l,d;for(t=s[0],l=0;l<s.length-1;l++)d=te(this,a[n+l],i,l),d===zt&&(d=this._$AH[l]),r||(r=!Te(d)||d!==this._$AH[l]),d===M?t=M:t!==M&&(t+=(d??"")+s[l+1]),this._$AH[l]=d}r&&!o&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class rl extends Ii{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}}class al extends Ii{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==M)}}class ll extends Ii{constructor(t,i,n,o,s){super(t,i,n,o,s),this.type=5}_$AI(t,i=this){if((t=te(this,t,i,0)??M)===zt)return;const n=this._$AH,o=t===M&&n!==M||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==M&&(n===M||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class cl{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){te(this,t)}}const no=mi.litHtmlPolyfillSupport;no==null||no(Ie,Be),(mi.litHtmlVersions??(mi.litHtmlVersions=[])).push("3.2.0");const ee=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let o=n._$litPart$;if(o===void 0){const s=(i==null?void 0:i.renderBefore)??null;n._$litPart$=o=new Be(t.insertBefore(Oe(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let T=class extends Gt{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=ee(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return zt}};var oo;T._$litElement$=!0,T.finalized=!0,(oo=globalThis.litElementHydrateSupport)==null||oo.call(globalThis,{LitElement:T});const so=globalThis.litElementPolyfillSupport;so==null||so({LitElement:T});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dl={attribute:!0,type:String,converter:pi,reflect:!1,hasChanged:$n},ul=(e=dl,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function b(e){return(t,i)=>typeof i=="object"?ul(e,t,i):((n,o,s)=>{const r=o.hasOwnProperty(s);return o.constructor.createProperty(s,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ae(e){return b({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hl=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _s={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},xs=e=>(...t)=>({_$litDirective$:e,values:t});class ws{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,n){this.t=t,this._$AM=i,this.i=n}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ce=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const o of n)(i=o._$AO)==null||i.call(o,t,!1),Ce(o,t);return!0},fi=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},$s=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),bl(t)}};function pl(e){this._$AN!==void 0?(fi(this),this._$AM=e,$s(this)):this._$AM=e}function ml(e,t=!1,i=0){const n=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(n))for(let s=i;s<n.length;s++)Ce(n[s],!1),fi(n[s]);else n!=null&&(Ce(n,!1),fi(n));else Ce(this,e)}const bl=e=>{e.type==_s.CHILD&&(e._$AP??(e._$AP=ml),e._$AQ??(e._$AQ=pl))};class fl extends ws{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,n){super._$AT(t,i,n),$s(this),this.isConnected=t._$AU}_$AO(t,i=!0){var n,o;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(o=this.disconnected)==null||o.call(this)),i&&(Ce(this,t),fi(this))}setValue(t){if(hl(this.t))this.t._$AI(t,this);else{const i=[...this.t._$AH];i[this.i]=t,this.t._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ie=()=>new gl;class gl{}const Vi=new WeakMap,J=xs(class extends fl{render(e){return M}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),M}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=Vi.get(t);i===void 0&&(i=new WeakMap,Vi.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Vi.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Cs=Object.freeze({left:0,top:0,width:16,height:16}),gi=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Ue=Object.freeze({...Cs,...gi}),en=Object.freeze({...Ue,body:"",hidden:!1}),vl=Object.freeze({width:null,height:null}),Es=Object.freeze({...vl,...gi});function yl(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function n(o){for(;o<0;)o+=4;return o%4}if(i===""){const o=parseInt(e);return isNaN(o)?0:n(o)}else if(i!==e){let o=0;switch(i){case"%":o=25;break;case"deg":o=90}if(o){let s=parseFloat(e.slice(0,e.length-i.length));return isNaN(s)?0:(s=s/o,s%1===0?n(s):0)}}return t}const _l=/[\s,]+/;function xl(e,t){t.split(_l).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const As={...Es,preserveAspectRatio:""};function ro(e){const t={...As},i=(n,o)=>e.getAttribute(n)||o;return t.width=i("width",null),t.height=i("height",null),t.rotate=yl(i("rotate","")),xl(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function wl(e,t){for(const i in As)if(e[i]!==t[i])return!0;return!1}const Ee=/^[a-z0-9]+(-[a-z0-9]+)*$/,Ve=(e,t,i,n="")=>{const o=e.split(":");if(e.slice(0,1)==="@"){if(o.length<2||o.length>3)return null;n=o.shift().slice(1)}if(o.length>3||!o.length)return null;if(o.length>1){const a=o.pop(),l=o.pop(),d={provider:o.length>0?o[0]:n,prefix:l,name:a};return t&&!si(d)?null:d}const s=o[0],r=s.split("-");if(r.length>1){const a={provider:n,prefix:r.shift(),name:r.join("-")};return t&&!si(a)?null:a}if(i&&n===""){const a={provider:n,prefix:"",name:s};return t&&!si(a,i)?null:a}return null},si=(e,t)=>e?!!((e.provider===""||e.provider.match(Ee))&&(t&&e.prefix===""||e.prefix.match(Ee))&&e.name.match(Ee)):!1;function $l(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const n=((e.rotate||0)+(t.rotate||0))%4;return n&&(i.rotate=n),i}function ao(e,t){const i=$l(e,t);for(const n in en)n in gi?n in e&&!(n in i)&&(i[n]=gi[n]):n in t?i[n]=t[n]:n in e&&(i[n]=e[n]);return i}function Cl(e,t){const i=e.icons,n=e.aliases||Object.create(null),o=Object.create(null);function s(r){if(i[r])return o[r]=[];if(!(r in o)){o[r]=null;const a=n[r]&&n[r].parent,l=a&&s(a);l&&(o[r]=[a].concat(l))}return o[r]}return Object.keys(i).concat(Object.keys(n)).forEach(s),o}function El(e,t,i){const n=e.icons,o=e.aliases||Object.create(null);let s={};function r(a){s=ao(n[a]||o[a],s)}return r(t),i.forEach(r),ao(e,s)}function Ss(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(o=>{t(o,null),i.push(o)});const n=Cl(e);for(const o in n){const s=n[o];s&&(t(o,El(e,o,s)),i.push(o))}return i}const Al={provider:"",aliases:{},not_found:{},...Cs};function Wi(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function ks(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Wi(e,Al))return null;const i=t.icons;for(const o in i){const s=i[o];if(!o.match(Ee)||typeof s.body!="string"||!Wi(s,en))return null}const n=t.aliases||Object.create(null);for(const o in n){const s=n[o],r=s.parent;if(!o.match(Ee)||typeof r!="string"||!i[r]&&!n[r]||!Wi(s,en))return null}return t}const vi=Object.create(null);function Sl(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function Et(e,t){const i=vi[e]||(vi[e]=Object.create(null));return i[t]||(i[t]=Sl(e,t))}function En(e,t){return ks(t)?Ss(t,(i,n)=>{n?e.icons[i]=n:e.missing.add(i)}):[]}function kl(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function Ol(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(vi)).forEach(n=>{(typeof n=="string"&&typeof t=="string"?[t]:Object.keys(vi[n]||{})).forEach(o=>{const s=Et(n,o);i=i.concat(Object.keys(s.icons).map(r=>(n!==""?"@"+n+":":"")+o+":"+r))})}),i}let Ne=!1;function Os(e){return typeof e=="boolean"&&(Ne=e),Ne}function Pe(e){const t=typeof e=="string"?Ve(e,!0,Ne):e;if(t){const i=Et(t.provider,t.prefix),n=t.name;return i.icons[n]||(i.missing.has(n)?null:void 0)}}function Ts(e,t){const i=Ve(e,!0,Ne);if(!i)return!1;const n=Et(i.provider,i.prefix);return kl(n,i.name,t)}function lo(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),Ne&&!t&&!e.prefix){let o=!1;return ks(e)&&(e.prefix="",Ss(e,(s,r)=>{r&&Ts(s,r)&&(o=!0)})),o}const i=e.prefix;if(!si({provider:t,prefix:i,name:"a"}))return!1;const n=Et(t,i);return!!En(n,e)}function co(e){return!!Pe(e)}function Tl(e){const t=Pe(e);return t?{...Ue,...t}:null}function Il(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((o,s)=>o.provider!==s.provider?o.provider.localeCompare(s.provider):o.prefix!==s.prefix?o.prefix.localeCompare(s.prefix):o.name.localeCompare(s.name));let n={provider:"",prefix:"",name:""};return e.forEach(o=>{if(n.name===o.name&&n.prefix===o.prefix&&n.provider===o.provider)return;n=o;const s=o.provider,r=o.prefix,a=o.name,l=i[s]||(i[s]=Object.create(null)),d=l[r]||(l[r]=Et(s,r));let u;a in d.icons?u=t.loaded:r===""||d.missing.has(a)?u=t.missing:u=t.pending;const c={provider:s,prefix:r,name:a};u.push(c)}),t}function Is(e,t){e.forEach(i=>{const n=i.loaderCallbacks;n&&(i.loaderCallbacks=n.filter(o=>o.id!==t))})}function Nl(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const n=e.provider,o=e.prefix;t.forEach(s=>{const r=s.icons,a=r.pending.length;r.pending=r.pending.filter(l=>{if(l.prefix!==o)return!0;const d=l.name;if(e.icons[d])r.loaded.push({provider:n,prefix:o,name:d});else if(e.missing.has(d))r.missing.push({provider:n,prefix:o,name:d});else return i=!0,!0;return!1}),r.pending.length!==a&&(i||Is([e],s.id),s.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),s.abort))})}))}let Pl=0;function Ml(e,t,i){const n=Pl++,o=Is.bind(null,i,n);if(!t.pending.length)return o;const s={id:n,icons:t,callback:e,abort:o};return i.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(s)}),o}const nn=Object.create(null);function uo(e,t){nn[e]=t}function on(e){return nn[e]||nn[""]}function Ll(e,t=!0,i=!1){const n=[];return e.forEach(o=>{const s=typeof o=="string"?Ve(o,t,i):o;s&&n.push(s)}),n}var jl={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function Rl(e,t,i,n){const o=e.resources.length,s=e.random?Math.floor(Math.random()*o):e.index;let r;if(e.random){let C=e.resources.slice(0);for(r=[];C.length>1;){const A=Math.floor(Math.random()*C.length);r.push(C[A]),C=C.slice(0,A).concat(C.slice(A+1))}r=r.concat(C)}else r=e.resources.slice(s).concat(e.resources.slice(0,s));const a=Date.now();let l="pending",d=0,u,c=null,h=[],p=[];typeof n=="function"&&p.push(n);function g(){c&&(clearTimeout(c),c=null)}function _(){l==="pending"&&(l="aborted"),g(),h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function v(C,A){A&&(p=[]),typeof C=="function"&&p.push(C)}function f(){return{startTime:a,payload:t,status:l,queriesSent:d,queriesPending:h.length,subscribe:v,abort:_}}function y(){l="failed",p.forEach(C=>{C(void 0,u)})}function x(){h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function w(C,A,N){const $=A!=="success";switch(h=h.filter(S=>S!==C),l){case"pending":break;case"failed":if($||!e.dataAfterTimeout)return;break;default:return}if(A==="abort"){u=N,y();return}if($){u=N,h.length||(r.length?E():y());return}if(g(),x(),!e.random){const S=e.resources.indexOf(C.resource);S!==-1&&S!==e.index&&(e.index=S)}l="completed",p.forEach(S=>{S(N)})}function E(){if(l!=="pending")return;g();const C=r.shift();if(C===void 0){if(h.length){c=setTimeout(()=>{g(),l==="pending"&&(x(),y())},e.timeout);return}y();return}const A={status:"pending",resource:C,callback:(N,$)=>{w(A,N,$)}};h.push(A),d++,c=setTimeout(E,e.rotate),i(C,t,A.callback)}return setTimeout(E),f}function Ns(e){const t={...jl,...e};let i=[];function n(){i=i.filter(r=>r().status==="pending")}function o(r,a,l){const d=Rl(t,r,a,(u,c)=>{n(),l&&l(u,c)});return i.push(d),d}function s(r){return i.find(a=>r(a))||null}return{query:o,find:s,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:n}}function An(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Ni=Object.create(null),ei=["https://api.simplesvg.com","https://api.unisvg.com"],sn=[];for(;ei.length>0;)ei.length===1||Math.random()>.5?sn.push(ei.shift()):sn.push(ei.pop());Ni[""]=An({resources:["https://api.iconify.design"].concat(sn)});function ho(e,t){const i=An(t);return i===null?!1:(Ni[e]=i,!0)}function Pi(e){return Ni[e]}function Dl(){return Object.keys(Ni)}function po(){}const Gi=Object.create(null);function zl(e){if(!Gi[e]){const t=Pi(e);if(!t)return;const i=Ns(t),n={config:t,redundancy:i};Gi[e]=n}return Gi[e]}function Ps(e,t,i){let n,o;if(typeof e=="string"){const s=on(e);if(!s)return i(void 0,424),po;o=s.send;const r=zl(e);r&&(n=r.redundancy)}else{const s=An(e);if(s){n=Ns(s);const r=e.resources?e.resources[0]:"",a=on(r);a&&(o=a.send)}}return!n||!o?(i(void 0,424),po):n.query(t,o,i)().abort}const mo="iconify2",Me="iconify",Ms=Me+"-count",bo=Me+"-version",Ls=36e5,Fl=168,Hl=50;function rn(e,t){try{return e.getItem(t)}catch{}}function Sn(e,t,i){try{return e.setItem(t,i),!0}catch{}}function fo(e,t){try{e.removeItem(t)}catch{}}function an(e,t){return Sn(e,Ms,t.toString())}function ln(e){return parseInt(rn(e,Ms))||0}const jt={local:!0,session:!0},js={local:new Set,session:new Set};let kn=!1;function Bl(e){kn=e}let ii=typeof window>"u"?{}:window;function Rs(e){const t=e+"Storage";try{if(ii&&ii[t]&&typeof ii[t].length=="number")return ii[t]}catch{}jt[e]=!1}function Ds(e,t){const i=Rs(e);if(!i)return;const n=rn(i,bo);if(n!==mo){if(n){const a=ln(i);for(let l=0;l<a;l++)fo(i,Me+l.toString())}Sn(i,bo,mo),an(i,0);return}const o=Math.floor(Date.now()/Ls)-Fl,s=a=>{const l=Me+a.toString(),d=rn(i,l);if(typeof d=="string"){try{const u=JSON.parse(d);if(typeof u=="object"&&typeof u.cached=="number"&&u.cached>o&&typeof u.provider=="string"&&typeof u.data=="object"&&typeof u.data.prefix=="string"&&t(u,a))return!0}catch{}fo(i,l)}};let r=ln(i);for(let a=r-1;a>=0;a--)s(a)||(a===r-1?(r--,an(i,r)):js[e].add(a))}function zs(){if(!kn){Bl(!0);for(const e in jt)Ds(e,t=>{const i=t.data,n=t.provider,o=i.prefix,s=Et(n,o);if(!En(s,i).length)return!1;const r=i.lastModified||-1;return s.lastModifiedCached=s.lastModifiedCached?Math.min(s.lastModifiedCached,r):r,!0})}}function Ul(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const n in jt)Ds(n,o=>{const s=o.data;return o.provider!==e.provider||s.prefix!==e.prefix||s.lastModified===t});return!0}function Vl(e,t){kn||zs();function i(n){let o;if(!jt[n]||!(o=Rs(n)))return;const s=js[n];let r;if(s.size)s.delete(r=Array.from(s).shift());else if(r=ln(o),r>=Hl||!an(o,r+1))return;const a={cached:Math.floor(Date.now()/Ls),provider:e.provider,data:t};return Sn(o,Me+r.toString(),JSON.stringify(a))}t.lastModified&&!Ul(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function go(){}function Wl(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,Nl(e)}))}function Gl(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:n}=e,o=e.iconsToLoad;delete e.iconsToLoad;let s;!o||!(s=on(i))||s.prepare(i,n,o).forEach(r=>{Ps(i,r,a=>{if(typeof a!="object")r.icons.forEach(l=>{e.missing.add(l)});else try{const l=En(e,a);if(!l.length)return;const d=e.pendingIcons;d&&l.forEach(u=>{d.delete(u)}),Vl(e,a)}catch(l){console.error(l)}Wl(e)})})}))}const On=(e,t)=>{const i=Ll(e,!0,Os()),n=Il(i);if(!n.pending.length){let l=!0;return t&&setTimeout(()=>{l&&t(n.loaded,n.missing,n.pending,go)}),()=>{l=!1}}const o=Object.create(null),s=[];let r,a;return n.pending.forEach(l=>{const{provider:d,prefix:u}=l;if(u===a&&d===r)return;r=d,a=u,s.push(Et(d,u));const c=o[d]||(o[d]=Object.create(null));c[u]||(c[u]=[])}),n.pending.forEach(l=>{const{provider:d,prefix:u,name:c}=l,h=Et(d,u),p=h.pendingIcons||(h.pendingIcons=new Set);p.has(c)||(p.add(c),o[d][u].push(c))}),s.forEach(l=>{const{provider:d,prefix:u}=l;o[d][u].length&&Gl(l,o[d][u])}),t?Ml(t,n,s):go},ql=e=>new Promise((t,i)=>{const n=typeof e=="string"?Ve(e,!0):e;if(!n){i(e);return}On([n||e],o=>{if(o.length&&n){const s=Pe(n);if(s){t({...Ue,...s});return}}i(e)})});function Yl(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function Xl(e,t){const i=typeof e=="string"?Ve(e,!0,!0):null;if(!i){const s=Yl(e);return{value:e,data:s}}const n=Pe(i);if(n!==void 0||!i.prefix)return{value:e,name:i,data:n};const o=On([i],()=>t(e,i,Pe(i)));return{value:e,name:i,loading:o}}function qi(e){return e.hasAttribute("inline")}let Fs=!1;try{Fs=navigator.vendor.indexOf("Apple")===0}catch{}function Jl(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Fs||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const Ql=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Zl=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function cn(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const n=e.split(Ql);if(n===null||!n.length)return e;const o=[];let s=n.shift(),r=Zl.test(s);for(;;){if(r){const a=parseFloat(s);isNaN(a)?o.push(s):o.push(Math.ceil(a*t*i)/i)}else o.push(s);if(s=n.shift(),s===void 0)return o.join("");r=!r}}function Kl(e,t="defs"){let i="";const n=e.indexOf("<"+t);for(;n>=0;){const o=e.indexOf(">",n),s=e.indexOf("</"+t);if(o===-1||s===-1)break;const r=e.indexOf(">",s);if(r===-1)break;i+=e.slice(o+1,s).trim(),e=e.slice(0,n).trim()+e.slice(r+1)}return{defs:i,content:e}}function tc(e,t){return e?"<defs>"+e+"</defs>"+t:t}function ec(e,t,i){const n=Kl(e);return tc(n.defs,t+n.content+i)}const ic=e=>e==="unset"||e==="undefined"||e==="none";function Hs(e,t){const i={...Ue,...e},n={...Es,...t},o={left:i.left,top:i.top,width:i.width,height:i.height};let s=i.body;[i,n].forEach(_=>{const v=[],f=_.hFlip,y=_.vFlip;let x=_.rotate;f?y?x+=2:(v.push("translate("+(o.width+o.left).toString()+" "+(0-o.top).toString()+")"),v.push("scale(-1 1)"),o.top=o.left=0):y&&(v.push("translate("+(0-o.left).toString()+" "+(o.height+o.top).toString()+")"),v.push("scale(1 -1)"),o.top=o.left=0);let w;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:w=o.height/2+o.top,v.unshift("rotate(90 "+w.toString()+" "+w.toString()+")");break;case 2:v.unshift("rotate(180 "+(o.width/2+o.left).toString()+" "+(o.height/2+o.top).toString()+")");break;case 3:w=o.width/2+o.left,v.unshift("rotate(-90 "+w.toString()+" "+w.toString()+")");break}x%2===1&&(o.left!==o.top&&(w=o.left,o.left=o.top,o.top=w),o.width!==o.height&&(w=o.width,o.width=o.height,o.height=w)),v.length&&(s=ec(s,'<g transform="'+v.join(" ")+'">',"</g>"))});const r=n.width,a=n.height,l=o.width,d=o.height;let u,c;r===null?(c=a===null?"1em":a==="auto"?d:a,u=cn(c,l/d)):(u=r==="auto"?l:r,c=a===null?cn(u,d/l):a==="auto"?d:a);const h={},p=(_,v)=>{ic(v)||(h[_]=v.toString())};p("width",u),p("height",c);const g=[o.left,o.top,l,d];return h.viewBox=g.join(" "),{attributes:h,viewBox:g,body:s}}function Tn(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const n in t)i+=" "+n+'="'+t[n]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function nc(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function oc(e){return"data:image/svg+xml,"+nc(e)}function Bs(e){return'url("'+oc(e)+'")'}const sc=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let yi=sc();function rc(e){yi=e}function ac(){return yi}function lc(e,t){const i=Pi(e);if(!i)return 0;let n;if(!i.maxURL)n=0;else{let o=0;i.resources.forEach(r=>{o=Math.max(o,r.length)});const s=t+".json?icons=";n=i.maxURL-o-i.path.length-s.length}return n}function cc(e){return e===404}const dc=(e,t,i)=>{const n=[],o=lc(e,t),s="icons";let r={type:s,provider:e,prefix:t,icons:[]},a=0;return i.forEach((l,d)=>{a+=l.length+1,a>=o&&d>0&&(n.push(r),r={type:s,provider:e,prefix:t,icons:[]},a=l.length),r.icons.push(l)}),n.push(r),n};function uc(e){if(typeof e=="string"){const t=Pi(e);if(t)return t.path}return"/"}const hc=(e,t,i)=>{if(!yi){i("abort",424);return}let n=uc(t.provider);switch(t.type){case"icons":{const s=t.prefix,r=t.icons.join(","),a=new URLSearchParams({icons:r});n+=s+".json?"+a.toString();break}case"custom":{const s=t.uri;n+=s.slice(0,1)==="/"?s.slice(1):s;break}default:i("abort",400);return}let o=503;yi(e+n).then(s=>{const r=s.status;if(r!==200){setTimeout(()=>{i(cc(r)?"abort":"next",r)});return}return o=501,s.json()}).then(s=>{if(typeof s!="object"||s===null){setTimeout(()=>{s===404?i("abort",s):i("next",o)});return}setTimeout(()=>{i("success",s)})}).catch(()=>{i("next",o)})},pc={prepare:dc,send:hc};function vo(e,t){switch(e){case"local":case"session":jt[e]=t;break;case"all":for(const i in jt)jt[i]=t;break}}const Yi="data-style";let Us="";function mc(e){Us=e}function yo(e,t){let i=Array.from(e.childNodes).find(n=>n.hasAttribute&&n.hasAttribute(Yi));i||(i=document.createElement("style"),i.setAttribute(Yi,Yi),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+Us}function Vs(){uo("",pc),Os(!0);let e;try{e=window}catch{}if(e){if(zs(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(n=>{try{(typeof n!="object"||n===null||n instanceof Array||typeof n.icons!="object"||typeof n.prefix!="string"||!lo(n))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const n="IconifyProviders["+i+"] is invalid.";try{const o=t[i];if(typeof o!="object"||!o||o.resources===void 0)continue;ho(i,o)||console.error(n)}catch{console.error(n)}}}}return{enableCache:t=>vo(t,!0),disableCache:t=>vo(t,!1),iconLoaded:co,iconExists:co,getIcon:Tl,listIcons:Ol,addIcon:Ts,addCollection:lo,calculateSize:cn,buildIcon:Hs,iconToHTML:Tn,svgToURL:Bs,loadIcons:On,loadIcon:ql,addAPIProvider:ho,appendCustomStyle:mc,_api:{getAPIConfig:Pi,setAPIModule:uo,sendAPIQuery:Ps,setFetch:rc,getFetch:ac,listAPIProviders:Dl}}}const dn={"background-color":"currentColor"},Ws={"background-color":"transparent"},_o={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},xo={"-webkit-mask":dn,mask:dn,background:Ws};for(const e in xo){const t=xo[e];for(const i in _o)t[e+"-"+i]=_o[i]}function wo(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function bc(e,t,i){const n=document.createElement("span");let o=e.body;o.indexOf("<a")!==-1&&(o+="<!-- "+Date.now()+" -->");const s=e.attributes,r=Tn(o,{...s,width:t.width+"",height:t.height+""}),a=Bs(r),l=n.style,d={"--svg":a,width:wo(s.width),height:wo(s.height),...i?dn:Ws};for(const u in d)l.setProperty(u,d[u]);return n}let Ae;function fc(){try{Ae=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{Ae=null}}function gc(e){return Ae===void 0&&fc(),Ae?Ae.createHTML(e):e}function vc(e){const t=document.createElement("span"),i=e.attributes;let n="";i.width||(n="width: inherit;"),i.height||(n+="height: inherit;"),n&&(i.style=n);const o=Tn(e.body,i);return t.innerHTML=gc(o),t.firstChild}function un(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function $o(e,t){const i=t.icon.data,n=t.customisations,o=Hs(i,n);n.preserveAspectRatio&&(o.attributes.preserveAspectRatio=n.preserveAspectRatio);const s=t.renderedMode;let r;switch(s){case"svg":r=vc(o);break;default:r=bc(o,{...Ue,...i},s==="mask")}const a=un(e);a?r.tagName==="SPAN"&&a.tagName===r.tagName?a.setAttribute("style",r.getAttribute("style")):e.replaceChild(r,a):e.appendChild(r)}function Co(e,t,i){const n=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:n}}function yc(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const n=t.get(e);if(n)return n;const o=["icon","mode","inline","observe","width","height","rotate","flip"],s=class extends i{constructor(){super(),It(this,"_shadowRoot"),It(this,"_initialised",!1),It(this,"_state"),It(this,"_checkQueued",!1),It(this,"_connected",!1),It(this,"_observer",null),It(this,"_visible",!0);const a=this._shadowRoot=this.attachShadow({mode:"open"}),l=qi(this);yo(a,l),this._state=Co({value:""},l),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return o.slice(0)}attributeChangedCallback(a){switch(a){case"inline":{const l=qi(this),d=this._state;l!==d.inline&&(d.inline=l,yo(this._shadowRoot,l));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const a=this.getAttribute("icon");if(a&&a.slice(0,1)==="{")try{return JSON.parse(a)}catch{}return a}set icon(a){typeof a=="object"&&(a=JSON.stringify(a)),this.setAttribute("icon",a)}get inline(){return qi(this)}set inline(a){a?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(a){a?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const a=this._state;if(a.rendered){const l=this._shadowRoot;if(a.renderedMode==="svg")try{l.lastChild.setCurrentTime(0);return}catch{}$o(l,a)}}get status(){const a=this._state;return a.rendered?"rendered":a.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const a=this._state,l=this.getAttribute("icon");if(l!==a.icon.value){this._iconChanged(l);return}if(!a.rendered||!this._visible)return;const d=this.getAttribute("mode"),u=ro(this);(a.attrMode!==d||wl(a.customisations,u)||!un(this._shadowRoot))&&this._renderIcon(a.icon,u,d)}_iconChanged(a){const l=Xl(a,(d,u,c)=>{const h=this._state;if(h.rendered||this.getAttribute("icon")!==d)return;const p={value:d,name:u,data:c};p.data?this._gotIconData(p):h.icon=p});l.data?this._gotIconData(l):this._state=Co(l,this._state.inline,this._state)}_forceRender(){if(!this._visible){const a=un(this._shadowRoot);a&&this._shadowRoot.removeChild(a);return}this._queueCheck()}_gotIconData(a){this._checkQueued=!1,this._renderIcon(a,ro(this),this.getAttribute("mode"))}_renderIcon(a,l,d){const u=Jl(a.data.body,d),c=this._state.inline;$o(this._shadowRoot,this._state={rendered:!0,icon:a,inline:c,customisations:l,attrMode:d,renderedMode:u})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(a=>{const l=a.some(d=>d.isIntersecting);l!==this._visible&&(this._visible=l,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};o.forEach(a=>{a in s.prototype||Object.defineProperty(s.prototype,a,{get:function(){return this.getAttribute(a)},set:function(l){l!==null?this.setAttribute(a,l):this.removeAttribute(a)}})});const r=Vs();for(const a in r)s[a]=s.prototype[a]=r[a];return t.define(e,s),s}yc()||Vs();var _c=Object.defineProperty,xc=Object.getOwnPropertyDescriptor,tt=(e,t,i,n)=>{for(var o=n>1?void 0:n?xc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&_c(t,i,o),o};const Gs=class extends T{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=ie(),this._tooltip=ie(),this._mouseLeave=!1,this.onClick=e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const e=this._contextMenu;e&&(e.visible=!0)},this.mouseLeave=!0}set loading(e){if(this._loading=e,e)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=e,this.icon="eos-icons:loading";else{const{disabled:t,icon:i}=this._stateBeforeLoading;this.disabled=t,this.icon=i}}get loading(){return this._loading}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&ms(e,t,{placement:"bottom",middleware:[es(10),ps(),hs(),us({padding:5})]}).then(i=>{const{x:n,y:o}=i;Object.assign(t.style,{left:`${n}px`,top:`${o}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const e=m`
      <div ${J(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?m`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?m`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `;return m`
      <div ${J(this._parent)} class="parent" @click=${this.onClick}>
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
        ${this.tooltipTitle||this.tooltipText?e:null}
      </div>
      <slot></slot>
    `}};Gs.styles=I`
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
  `;let Q=Gs;tt([b({type:String,reflect:!0})],Q.prototype,"label",2);tt([b({type:Boolean,attribute:"label-hidden",reflect:!0})],Q.prototype,"labelHidden",2);tt([b({type:Boolean,reflect:!0})],Q.prototype,"active",2);tt([b({type:Boolean,reflect:!0,attribute:"disabled"})],Q.prototype,"disabled",2);tt([b({type:String,reflect:!0})],Q.prototype,"icon",2);tt([b({type:Boolean,reflect:!0})],Q.prototype,"vertical",2);tt([b({type:Number,attribute:"tooltip-time",reflect:!0})],Q.prototype,"tooltipTime",2);tt([b({type:Boolean,attribute:"tooltip-visible",reflect:!0})],Q.prototype,"tooltipVisible",2);tt([b({type:String,attribute:"tooltip-title",reflect:!0})],Q.prototype,"tooltipTitle",2);tt([b({type:String,attribute:"tooltip-text",reflect:!0})],Q.prototype,"tooltipText",2);tt([b({type:Boolean,reflect:!0})],Q.prototype,"loading",1);var wc=Object.defineProperty,We=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&wc(t,i,o),o};const qs=class extends T{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(e){e.stopPropagation(),this.checked=e.target.checked,this.dispatchEvent(this.onValueChange)}render(){return m`
      <div class="parent">
        ${this.label?m`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};qs.styles=I`
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
  `;let le=qs;We([b({type:String,reflect:!0})],le.prototype,"icon");We([b({type:String,reflect:!0})],le.prototype,"name");We([b({type:String,reflect:!0})],le.prototype,"label");We([b({type:Boolean,reflect:!0})],le.prototype,"checked");We([b({type:Boolean,reflect:!0})],le.prototype,"inverted");var $c=Object.defineProperty,ce=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&$c(t,i,o),o};const Ys=class extends T{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=ie(),this._textInput=ie(),this.onValueChange=new Event("input"),this.onOpacityInput=e=>{const t=e.target;this.opacity=t.value,this.dispatchEvent(this.onValueChange)}}set value(e){const{color:t,opacity:i}=e;this.color=t,i&&(this.opacity=i)}get value(){const e={color:this.color};return this.opacity&&(e.opacity=this.opacity),e}onColorInput(e){e.stopPropagation();const{value:t}=this._colorInput;t&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}onTextInput(e){e.stopPropagation();const{value:t}=this._textInput;if(!t)return;const{value:i}=t;let n=i.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),t.value=n.slice(0,7),t.value.length===7&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:e}=this._colorInput;e&&e.click()}render(){return m`
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
                ${J(this._colorInput)}
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
                ${J(this._textInput)}
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
    `}};Ys.styles=I`
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
  `;let Bt=Ys;ce([b({type:String,reflect:!0})],Bt.prototype,"name");ce([b({type:String,reflect:!0})],Bt.prototype,"label");ce([b({type:String,reflect:!0})],Bt.prototype,"icon");ce([b({type:Boolean,reflect:!0})],Bt.prototype,"vertical");ce([b({type:Number,reflect:!0})],Bt.prototype,"opacity");ce([b({type:String,reflect:!0})],Bt.prototype,"color");const Cc=I`
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
`,Ec=I`
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
`,St={scrollbar:Cc,globalStyles:Ec},Xs=class O{static set config(t){this._config={...O._config,...t}}static get config(){return O._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=St.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){O.init()}static init(){O.addGlobalStyles(),O.defineCustomElement("bim-button",Q),O.defineCustomElement("bim-checkbox",le),O.defineCustomElement("bim-color-input",Bt),O.defineCustomElement("bim-context-menu",kc),O.defineCustomElement("bim-dropdown",bt),O.defineCustomElement("bim-grid",Nn),O.defineCustomElement("bim-icon",Lc),O.defineCustomElement("bim-input",Ge),O.defineCustomElement("bim-label",de),O.defineCustomElement("bim-number-input",W),O.defineCustomElement("bim-option",F),O.defineCustomElement("bim-panel",Ut),O.defineCustomElement("bim-panel-section",ue),O.defineCustomElement("bim-selector",he),O.defineCustomElement("bim-table",K),O.defineCustomElement("bim-tabs",Wt),O.defineCustomElement("bim-tab",Y),O.defineCustomElement("bim-table-cell",lr),O.defineCustomElement("bim-table-children",dr),O.defineCustomElement("bim-table-group",hr),O.defineCustomElement("bim-table-row",Vt),O.defineCustomElement("bim-text-input",lt),O.defineCustomElement("bim-toolbar",zi),O.defineCustomElement("bim-toolbar-group",Ri),O.defineCustomElement("bim-toolbar-section",be),O.defineCustomElement("bim-viewport",$r)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let n=0;n<10;n++){const o=Math.floor(Math.random()*t.length);i+=t.charAt(o)}return i}};Xs._config={sectionLabelOnVerticalToolbar:!1};let hn=Xs;class B extends T{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const n of t)this.elements.add(n);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const n of i)n.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const n=i[0];if(!n.isIntersecting)return;const o=n.target;t.unobserve(o);const s=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][s];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,n=[...this.elements][i];n&&t.observe(n)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const n=document.createDocumentFragment();if(t.length===0)return ee(t(),n),n.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let o=i;const s=t,r=l=>(o={...o,...l},ee(s(o),n),o);r(i);const a=()=>o;return[n.firstElementChild,r,a]}}var Ac=Object.defineProperty,Sc=Object.getOwnPropertyDescriptor,Js=(e,t,i,n)=>{for(var o=Sc(t,i),s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Ac(t,i,o),o},D;const In=(D=class extends T{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(e){this._placement=e,this.updatePosition()}static removeMenus(){for(const e of D.menus)e instanceof D&&(e.visible=!1);D.dialog.close(),D.dialog.remove()}get visible(){return this._visible}set visible(e){var t;this._visible=e,e?(D.dialog.parentElement||document.body.append(D.dialog),this._previousContainer=this.parentElement,D.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,D.dialog.append(this),D.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const e=this.placement??"right",t=await ms(this._previousContainer,this,{placement:e,middleware:[es(10),ps(),hs(),us({padding:5})]}),{x:i,y:n}=t;this.style.left=`${i}px`,this.style.top=`${n}px`}connectedCallback(){super.connectedCallback(),D.menus.push(this)}render(){return m` <slot></slot> `}},D.styles=[St.scrollbar,I`
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
    `],D.dialog=B.create(()=>m` <dialog
      @click=${e=>{e.target===D.dialog&&D.removeMenus()}}
      @cancel=${()=>D.removeMenus()}
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
    ></dialog>`),D.menus=[],D);Js([b({type:String,reflect:!0})],In.prototype,"placement");Js([b({type:Boolean,reflect:!0})],In.prototype,"visible");let kc=In;const _i=(e,t={},i=!0)=>{let n={};for(const o of e.children){const s=o,r=s.getAttribute("name")||s.getAttribute("label"),a=t[r];if(r){if("value"in s&&typeof s.value<"u"&&s.value!==null){const l=s.value;if(typeof l=="object"&&!Array.isArray(l)&&Object.keys(l).length===0)continue;n[r]=a?a(s.value):s.value}else if(i){const l=_i(s,t);if(Object.keys(l).length===0)continue;n[r]=a?a(l):l}}else i&&(n={...n,..._i(s,t)})}return n},Mi=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,Oc=[">=","<=","=",">","<","?","/","#"];function Eo(e){const t=Oc.find(r=>e.split(r).length===2),i=e.split(t).map(r=>r.trim()),[n,o]=i,s=o.startsWith("'")&&o.endsWith("'")?o.replace(/'/g,""):Mi(o);return{key:n,condition:t,value:s}}const pn=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(n=>n.trim());for(const n of i){const o=!n.startsWith("(")&&!n.endsWith(")"),s=n.startsWith("(")&&n.endsWith(")");if(o){const r=Eo(n);t.push(r)}if(s){const r={operator:"&",queries:n.replace(/^(\()|(\))$/g,"").split("&").map(a=>a.trim()).map((a,l)=>{const d=Eo(a);return l>0&&(d.operator="&"),d})};t.push(r)}}return t}catch{return null}},Ao=(e,t,i)=>{let n=!1;switch(t){case"=":n=e===i;break;case"?":n=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(n=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(n=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(n=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(n=e>=i);break;case"/":n=String(e).startsWith(String(i));break}return n};var Tc=Object.defineProperty,Ic=Object.getOwnPropertyDescriptor,kt=(e,t,i,n)=>{for(var o=n>1?void 0:n?Ic(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Tc(t,i,o),o};const Qs=class extends T{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Mi(this.label):this.label}set value(e){this._value=e}render(){return m`
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
    `}};Qs.styles=I`
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
  `;let F=Qs;kt([b({type:String,reflect:!0})],F.prototype,"img",2);kt([b({type:String,reflect:!0})],F.prototype,"label",2);kt([b({type:String,reflect:!0})],F.prototype,"icon",2);kt([b({type:Boolean,reflect:!0})],F.prototype,"checked",2);kt([b({type:Boolean,reflect:!0})],F.prototype,"checkbox",2);kt([b({type:Boolean,attribute:"no-mark",reflect:!0})],F.prototype,"noMark",2);kt([b({converter:{fromAttribute(e){return e&&Mi(e)}}})],F.prototype,"value",1);kt([b({type:Boolean,reflect:!0})],F.prototype,"vertical",2);var Nc=Object.defineProperty,Pc=Object.getOwnPropertyDescriptor,Ot=(e,t,i,n)=>{for(var o=n>1?void 0:n?Pc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Nc(t,i,o),o};const Zs=class extends B{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=ie(),this.onOptionClick=e=>{const t=e.target,i=this._value.has(t);if(!this.multiple&&!this.required&&!i)this._value=new Set([t]);else if(!this.multiple&&!this.required&&i)this._value=new Set([]);else if(!this.multiple&&this.required&&!i)this._value=new Set([t]);else if(this.multiple&&!this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&!this.required&&i){const n=[...this._value].filter(o=>o!==t);this._value=new Set(n)}else if(this.multiple&&this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&this.required&&i){const n=[...this._value].filter(s=>s!==t),o=new Set(n);o.size!==0&&(this._value=o)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(e){if(e){const{value:t}=this._contextMenu;if(!t)return;for(const i of this.elements)t.append(i);this._visible=!0}else{for(const t of this.elements)this.append(t);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(e){if(this.required&&Object.keys(e).length===0)return;const t=new Set;for(const i of e){const n=this.findOption(i);if(n&&(t.add(n),!this.multiple&&Object.keys(e).length===1))break}this._value=t,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(e=>e instanceof F&&e.checked).map(e=>e.value)}get _options(){const e=new Set([...this.elements]);for(const t of this.children)t instanceof F&&e.add(t);return[...e]}onSlotChange(e){const t=e.target.assignedElements();this.observe(t);const i=new Set;for(const n of this.elements){if(!(n instanceof F)){n.remove();continue}n.checked&&i.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=i}updateOptionsState(){for(const e of this._options)e instanceof F&&(e.checked=this._value.has(e))}findOption(e){return this._options.find(t=>t instanceof F?t.label===e||t.value===e:!1)}render(){let e,t,i;if(this._value.size===0)e="Select an option...";else if(this._value.size===1){const n=[...this._value][0];e=(n==null?void 0:n.label)||(n==null?void 0:n.value),t=n==null?void 0:n.img,i=n==null?void 0:n.icon}else e=`Multiple (${this._value.size})`;return m`
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
            ${J(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};Zs.styles=[St.scrollbar,I`
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
    `];let bt=Zs;Ot([b({type:String,reflect:!0})],bt.prototype,"name",2);Ot([b({type:String,reflect:!0})],bt.prototype,"icon",2);Ot([b({type:String,reflect:!0})],bt.prototype,"label",2);Ot([b({type:Boolean,reflect:!0})],bt.prototype,"multiple",2);Ot([b({type:Boolean,reflect:!0})],bt.prototype,"required",2);Ot([b({type:Boolean,reflect:!0})],bt.prototype,"vertical",2);Ot([b({type:Boolean,reflect:!0})],bt.prototype,"visible",1);Ot([ae()],bt.prototype,"_value",2);var Mc=Object.defineProperty,Ks=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Mc(t,i,o),o};const tr=class extends T{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(e){const t=e.split(`
`).map(i=>i.trim()).map(i=>i.split('"')[1]).filter(i=>i!==void 0).flatMap(i=>i.split(/\s+/));return[...new Set(t)].filter(i=>i!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const e=this.layouts[this.layout],t=this.getUniqueAreasFromTemplate(e.template).map(i=>{const n=e.elements[i];return n&&(n.style.gridArea=i),n}).filter(i=>!!i);this.style.gridTemplate=e.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...t)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return m`<slot></slot>`}};tr.styles=I`
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
  `;let Nn=tr;Ks([b({type:Boolean,reflect:!0})],Nn.prototype,"floating");Ks([b({type:String,reflect:!0})],Nn.prototype,"layout");const mn=class extends T{render(){return m`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};mn.styles=I`
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
  `,mn.properties={icon:{type:String}};let Lc=mn;var jc=Object.defineProperty,Li=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&jc(t,i,o),o};const er=class extends T{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const e={};for(const t of this.children){const i=t;"value"in i?e[i.name||i.label]=i.value:"checked"in i&&(e[i.name||i.label]=i.checked)}return e}set value(e){const t=[...this.children];for(const i in e){const n=t.find(r=>{const a=r;return a.name===i||a.label===i});if(!n)continue;const o=n,s=e[i];typeof s=="boolean"?o.checked=s:o.value=s}}render(){return m`
      <div class="parent">
        ${this.label||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};er.styles=I`
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
  `;let Ge=er;Li([b({type:String,reflect:!0})],Ge.prototype,"name");Li([b({type:String,reflect:!0})],Ge.prototype,"label");Li([b({type:String,reflect:!0})],Ge.prototype,"icon");Li([b({type:Boolean,reflect:!0})],Ge.prototype,"vertical");var Rc=Object.defineProperty,qe=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Rc(t,i,o),o};const ir=class extends T{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Mi(this.textContent):this.textContent}render(){return m`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?m`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?m`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};ir.styles=I`
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
  `;let de=ir;qe([b({type:String,reflect:!0})],de.prototype,"img");qe([b({type:Boolean,attribute:"label-hidden",reflect:!0})],de.prototype,"labelHidden");qe([b({type:String,reflect:!0})],de.prototype,"icon");qe([b({type:Boolean,attribute:"icon-hidden",reflect:!0})],de.prototype,"iconHidden");qe([b({type:Boolean,reflect:!0})],de.prototype,"vertical");var Dc=Object.defineProperty,zc=Object.getOwnPropertyDescriptor,Z=(e,t,i,n)=>{for(var o=n>1?void 0:n?zc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Dc(t,i,o),o};const nr=class extends T{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=ie(),this.onValueChange=new Event("change")}set value(e){this.setValue(e.toString())}get value(){return this._value}onChange(e){e.stopPropagation();const{value:t}=this._input;t&&this.setValue(t.value)}setValue(e){const{value:t}=this._input;let i=e;if(i=i.replace(/[^0-9.-]/g,""),i=i.replace(/(\..*)\./g,"$1"),i.endsWith(".")||(i.lastIndexOf("-")>0&&(i=i[0]+i.substring(1).replace(/-/g,"")),i==="-"||i==="-0"))return;let n=Number(i);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,t&&(t.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:e}=this._input;e&&Number.isNaN(Number(e.value))&&(e.value=this.value.toString())}onSliderMouseDown(e){document.body.style.cursor="w-resize";const{clientX:t}=e,i=this.value;let n=!1;const o=a=>{var l;n=!0;const{clientX:d}=a,u=this.step??1,c=((l=u.toString().split(".")[1])==null?void 0:l.length)||0,h=1/(this.sensitivity??1),p=(d-t)/h;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const g=i+p*u;this.setValue(g.toFixed(c))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},r=()=>{document.removeEventListener("mousemove",o),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",r)}onFocus(e){e.stopPropagation();const t=i=>{i.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",t))};window.addEventListener("keydown",t)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:e}=this._input;e&&e.focus()}render(){const e=m`
      ${this.pref||this.icon?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${J(this._input)}
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
    `}};nr.styles=I`
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
  `;let W=nr;Z([b({type:String,reflect:!0})],W.prototype,"name",2);Z([b({type:String,reflect:!0})],W.prototype,"icon",2);Z([b({type:String,reflect:!0})],W.prototype,"label",2);Z([b({type:String,reflect:!0})],W.prototype,"pref",2);Z([b({type:Number,reflect:!0})],W.prototype,"min",2);Z([b({type:Number,reflect:!0})],W.prototype,"value",1);Z([b({type:Number,reflect:!0})],W.prototype,"step",2);Z([b({type:Number,reflect:!0})],W.prototype,"sensitivity",2);Z([b({type:Number,reflect:!0})],W.prototype,"max",2);Z([b({type:String,reflect:!0})],W.prototype,"suffix",2);Z([b({type:Boolean,reflect:!0})],W.prototype,"vertical",2);Z([b({type:Boolean,reflect:!0})],W.prototype,"slider",2);var Fc=Object.defineProperty,Hc=Object.getOwnPropertyDescriptor,Ye=(e,t,i,n)=>{for(var o=n>1?void 0:n?Hc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Fc(t,i,o),o};const or=class extends T{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(e){this._hidden=e,this.activationButton.active=!e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return _i(this,this.valueTransform)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(s=>{const r=s;return r.name===i||r.label===i});if(!n)continue;const o=n;o.value=e[i]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!0}expandSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,m`
      <div class="parent">
        ${this.label||this.name||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};or.styles=[St.scrollbar,I`
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
    `];let Ut=or;Ye([b({type:String,reflect:!0})],Ut.prototype,"icon",2);Ye([b({type:String,reflect:!0})],Ut.prototype,"name",2);Ye([b({type:String,reflect:!0})],Ut.prototype,"label",2);Ye([b({type:Boolean,reflect:!0})],Ut.prototype,"hidden",1);Ye([b({type:Boolean,attribute:"header-hidden",reflect:!0})],Ut.prototype,"headerHidden",2);var Bc=Object.defineProperty,Xe=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Bc(t,i,o),o};const sr=class extends T{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const e=this.parentElement;let t;return e instanceof Ut&&(t=e.valueTransform),Object.values(this.valueTransform).length!==0&&(t=this.valueTransform),_i(this,t)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(s=>{const r=s;return r.name===i||r.label===i});if(!n)continue;const o=n;o.value=e[i]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const e=this.label||this.icon||this.name||this.fixed,t=m`<svg
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
    `}};sr.styles=[St.scrollbar,I`
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
    `];let ue=sr;Xe([b({type:String,reflect:!0})],ue.prototype,"icon");Xe([b({type:String,reflect:!0})],ue.prototype,"label");Xe([b({type:String,reflect:!0})],ue.prototype,"name");Xe([b({type:Boolean,reflect:!0})],ue.prototype,"fixed");Xe([b({type:Boolean,reflect:!0})],ue.prototype,"collapsed");var Uc=Object.defineProperty,Je=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Uc(t,i,o),o};const rr=class extends T{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=e=>{this._value=e.target,this.dispatchEvent(this.onValueChange);for(const t of this.children)t instanceof F&&(t.checked=t===e.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(e){const t=this.findOption(e);if(t){for(const i of this._options)i.checked=i===t;this._value=t,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(e){const t=e.target.assignedElements();for(const i of t)i instanceof F&&(i.noMark=!0,i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick))}findOption(e){return this._options.find(t=>t instanceof F?t.label===e||t.value===e:!1)}firstUpdated(){const e=[...this.children].find(t=>t instanceof F&&t.checked);e&&(this._value=e)}render(){return m`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};rr.styles=I`
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
  `;let he=rr;Je([b({type:String,reflect:!0})],he.prototype,"name");Je([b({type:String,reflect:!0})],he.prototype,"icon");Je([b({type:String,reflect:!0})],he.prototype,"label");Je([b({type:Boolean,reflect:!0})],he.prototype,"vertical");Je([ae()],he.prototype,"_value");const Vc=()=>m`
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
  `,Wc=()=>m`
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
  `;var Gc=Object.defineProperty,qc=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Gc(t,i,o),o};const ar=class extends T{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return m`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};ar.styles=I`
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
  `;let lr=ar;qc([b({type:String,reflect:!0})],lr.prototype,"column");var Yc=Object.defineProperty,Xc=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Yc(t,i,o),o};const cr=class extends T{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(e,t=!1){for(const i of this._groups)i.childrenHidden=typeof e>"u"?!i.childrenHidden:!e,t&&i.toggleChildren(e,t)}render(){return this._groups=[],m`
      <slot></slot>
      ${this.data.map(e=>{const t=document.createElement("bim-table-group");return this._groups.push(t),t.table=this.table,t.data=e,t})}
    `}};cr.styles=I`
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
  `;let dr=cr;Xc([b({type:Array,attribute:!1})],dr.prototype,"data");var Jc=Object.defineProperty,Qc=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Jc(t,i,o),o};const ur=class extends T{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(e,t=!1){this._children&&(this.childrenHidden=typeof e>"u"?!this.childrenHidden:!e,t&&this._children.toggleGroups(e,t))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const e=this.table.getGroupIndentation(this.data)??0,t=m`
      ${this.table.noIndentation?null:m`
            <style>
              .branch-vertical {
                left: ${e+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,i=document.createDocumentFragment();ee(t,i);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${e-1+(this.table.selectableRows?2.05:.5625)}rem`);let o=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(l);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(u),o=document.createElement("div"),o.addEventListener("click",c=>{c.stopPropagation(),this.toggleChildren()}),o.classList.add("caret"),o.style.left=`${(this.table.selectableRows?1.5:.125)+e}rem`,this.childrenHidden?o.append(a):o.append(d)}const s=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&s.append(i),s.table=this.table,s.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:s}})),o&&this.data.children&&s.append(o),e!==0&&(!this.data.children||this.childrenHidden)&&n&&s.append(n);let r;if(this.data.children){r=document.createElement("bim-table-children"),this._children=r,r.table=this.table,r.data=this.data.children;const a=document.createDocumentFragment();ee(t,a),r.append(a)}return m`
      <div class="parent">${s} ${this.childrenHidden?null:r}</div>
    `}};ur.styles=I`
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
  `;let hr=ur;Qc([b({type:Boolean,attribute:"children-hidden",reflect:!0})],hr.prototype,"childrenHidden");var Zc=Object.defineProperty,pe=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Zc(t,i,o),o};const pr=class extends T{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(e=>{this._intersecting=e[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.name)}get _columnWidths(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.width)}get _isSelected(){var e;return(e=this.table)==null?void 0:e.selection.has(this.data)}onSelectionChange(e){if(!this.table)return;const t=e.target;this.selected=t.value,t.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const e=this.table.getRowIndentation(this.data)??0,t=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,i=[];for(const n in t){if(this.hiddenColumns.includes(n))continue;const o=t[n];let s;if(typeof o=="string"||typeof o=="boolean"||typeof o=="number"?(s=document.createElement("bim-label"),s.textContent=String(o)):o instanceof HTMLElement?s=o:(s=document.createDocumentFragment(),ee(o,s)),!s)continue;const r=document.createElement("bim-table-cell");r.append(s),r.column=n,this._columnNames.indexOf(n)===0&&!this.isHeader&&(r.style.marginLeft=`${(this.table.noIndentation?0:e)+.75}rem`);const a=this._columnNames.indexOf(n);r.setAttribute("data-column-index",String(a)),r.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),r.toggleAttribute("data-cell-header",this.isHeader),r.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:r}})),i.push(r)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,m`
      ${!this.isHeader&&this.table.selectableRows?m`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${i}
      <slot></slot>
    `}render(){return m`${this._intersecting?this.compute():m``}`}};pr.styles=I`
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
  `;let Vt=pr;pe([b({type:Boolean,reflect:!0})],Vt.prototype,"selected");pe([b({attribute:!1})],Vt.prototype,"columns");pe([b({attribute:!1})],Vt.prototype,"hiddenColumns");pe([b({attribute:!1})],Vt.prototype,"data");pe([b({type:Boolean,attribute:"is-header",reflect:!0})],Vt.prototype,"isHeader");pe([ae()],Vt.prototype,"_intersecting");var Kc=Object.defineProperty,td=Object.getOwnPropertyDescriptor,et=(e,t,i,n)=>{for(var o=n>1?void 0:n?td(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Kc(t,i,o),o};const mr=class extends T{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this.loadingErrorElement=null,this._stringFilterFunction=(e,t)=>Object.values(t.data).some(i=>String(i).toLowerCase().includes(e.toLowerCase())),this._queryFilterFunction=(e,t)=>{let i=!1;const n=pn(e)??[];for(const o of n){if("queries"in o){i=!1;break}const{condition:s,value:r}=o;let{key:a}=o;if(a.startsWith("[")&&a.endsWith("]")){const l=a.replace("[","").replace("]","");a=l,i=Object.keys(t.data).filter(d=>d.includes(l)).map(d=>Ao(t.data[d],s,r)).some(d=>d)}else i=Ao(t.data[a],s,r);if(!i)break}return i}}set columns(e){const t=[];for(const i of e){const n=typeof i=="string"?{name:i,width:`minmax(${this.minColWidth}, 1fr)`}:i;t.push(n)}this._columns=t,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const e={};for(const t of this.columns)if(typeof t=="string")e[t]=t;else{const{name:i}=t;e[i]=i}return e}get value(){return this._filteredData}set queryString(e){this.toggleAttribute("data-processing",!0),this._queryString=e&&e.trim()!==""?e.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(e){this._data=e,this.updateFilteredData(),this.computeMissingColumns(e)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(e=>{setTimeout(()=>{e(this.data)})})}set hiddenColumns(e){this._hiddenColumns=e,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(pn(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(e){let t=!1;for(const i of e){const{children:n,data:o}=i;for(const s in o)this._columns.map(r=>typeof r=="string"?r:r.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),t=!0);if(n){const s=this.computeMissingColumns(n);s&&!t&&(t=s)}}return t}generateText(e="comma",t=this.value,i="",n=!0){const o=this._textDelimiters[e];let s="";const r=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${o}`);const a=`${r.join(o)}
`;s+=a}for(const[a,l]of t.entries()){const{data:d,children:u}=l,c=this.indentationInText?`${i}${a+1}${o}`:"",h=r.map(g=>d[g]??""),p=`${c}${h.join(o)}
`;s+=p,u&&(s+=this.generateText(e,l.children,`${i}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(e){const t={};for(const i of Object.keys(this.dataTransform)){const n=this.columns.find(o=>o.name===i);n&&n.forceDataTransform&&(i in e||(e[i]=""))}for(const i in e){const n=this.dataTransform[i];n?t[i]=n(e[i],e):t[i]=e[i]}return t}downloadData(e="BIM Table Data",t="json"){let i=null;if(t==="json"&&(i=new File([JSON.stringify(this.value,void 0,2)],`${e}.json`)),t==="csv"&&(i=new File([this.csv],`${e}.csv`)),t==="tsv"&&(i=new File([this.tsv],`${e}.tsv`)),!i)return;const n=document.createElement("a");n.href=URL.createObjectURL(i),n.download=i.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(e,t=this.value,i=0){for(const n of t){if(n.data===e)return i;if(n.children){const o=this.getRowIndentation(e,n.children,i+1);if(o!==null)return o}}return null}getGroupIndentation(e,t=this.value,i=0){for(const n of t){if(n===e)return i;if(n.children){const o=this.getGroupIndentation(e,n.children,i+1);if(o!==null)return o}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(e=!1){if(this._filteredData.length!==0&&!e||!this.loadFunction)return!1;this.loading=!0;try{const t=await this.loadFunction();return this.data=t,this.loading=!1,this._errorLoading=!1,!0}catch(t){return this.loading=!1,this._filteredData.length!==0||(t instanceof Error&&this.loadingErrorElement&&t.message.trim()!==""&&(this.loadingErrorElement.textContent=t.message),this._errorLoading=!0),!1}}filter(e,t=this.filterFunction??this._stringFilterFunction,i=this.data){const n=[];for(const o of i)if(t(e,o)){if(this.preserveStructureOnFilter){const s={data:o.data};if(o.children){const r=this.filter(e,t,o.children);r.length&&(s.children=r)}n.push(s)}else if(n.push({data:o.data}),o.children){const s=this.filter(e,t,o.children);n.push(...s)}}else if(o.children){const s=this.filter(e,t,o.children);this.preserveStructureOnFilter&&s.length?n.push({data:o.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return Vc();if(this._errorLoading)return m`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return m`<slot name="missing-data"></slot>`;const e=document.createElement("bim-table-row");e.table=this,e.isHeader=!0,e.data=this._headerRowData,e.style.gridArea="Header",e.style.position="sticky",e.style.top="0",e.style.zIndex="5";const t=document.createElement("bim-table-children");return t.table=this,t.data=this.value,t.style.gridArea="Body",t.style.backgroundColor="transparent",m`
      <div class="parent">
        ${this.headersHidden?null:e} ${Wc()}
        <div style="overflow-x: hidden; grid-area: Body">${t}</div>
      </div>
    `}};mr.styles=[St.scrollbar,I`
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
    `];let K=mr;et([ae()],K.prototype,"_filteredData",2);et([b({type:Boolean,attribute:"headers-hidden",reflect:!0})],K.prototype,"headersHidden",2);et([b({type:String,attribute:"min-col-width",reflect:!0})],K.prototype,"minColWidth",2);et([b({type:Array,attribute:!1})],K.prototype,"columns",1);et([b({type:Array,attribute:!1})],K.prototype,"data",1);et([b({type:Boolean,reflect:!0})],K.prototype,"expanded",2);et([b({type:Boolean,reflect:!0,attribute:"selectable-rows"})],K.prototype,"selectableRows",2);et([b({attribute:!1})],K.prototype,"selection",2);et([b({type:Boolean,attribute:"no-indentation",reflect:!0})],K.prototype,"noIndentation",2);et([b({type:Boolean,reflect:!0})],K.prototype,"loading",2);et([ae()],K.prototype,"_errorLoading",2);var ed=Object.defineProperty,id=Object.getOwnPropertyDescriptor,ji=(e,t,i,n)=>{for(var o=n>1?void 0:n?id(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&ed(t,i,o),o};const br=class extends T{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:e}=this;if(e&&this.name===this._defaultName){const t=[...e.children].indexOf(this);this.name=`${this._defaultName}${t}`}}render(){return m` <slot></slot> `}};br.styles=I`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let Y=br;ji([b({type:String,reflect:!0})],Y.prototype,"name",2);ji([b({type:String,reflect:!0})],Y.prototype,"label",2);ji([b({type:String,reflect:!0})],Y.prototype,"icon",2);ji([b({type:Boolean,reflect:!0})],Y.prototype,"hidden",1);var nd=Object.defineProperty,od=Object.getOwnPropertyDescriptor,me=(e,t,i,n)=>{for(var o=n>1?void 0:n?od(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&nd(t,i,o),o};const fr=class extends T{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=e=>{const t=e.target;t instanceof Y&&!t.hidden&&(t.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=t.name,t.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(e){this._tab=e;const t=[...this.children],i=t.find(n=>n instanceof Y&&n.name===e);for(const n of t){if(!(n instanceof Y))continue;n.hidden=i!==n;const o=this.getTabSwitcher(n.name);o&&o.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(e){return this._switchers.find(t=>t.getAttribute("data-name")===e)}createSwitchers(){this._switchers=[];for(const e of this.children){if(!(e instanceof Y))continue;const t=document.createElement("div");t.addEventListener("click",()=>{this.tab===e.name?this.toggleAttribute("tab",!1):this.tab=e.name}),t.setAttribute("data-name",e.name),t.className="switcher";const i=document.createElement("bim-label");i.textContent=e.label??"",i.icon=e.icon,t.append(i),this._switchers.push(t)}}onSlotChange(e){this.createSwitchers();const t=e.target.assignedElements(),i=t.find(n=>n instanceof Y?this.tab?n.name===this.tab:!n.hidden:!1);i&&i instanceof Y&&(this.tab=i.name);for(const n of t){if(!(n instanceof Y)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),i!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return m`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};fr.styles=[St.scrollbar,I`
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
    `];let Wt=fr;me([ae()],Wt.prototype,"_switchers",2);me([b({type:Boolean,reflect:!0})],Wt.prototype,"bottom",2);me([b({type:Boolean,attribute:"switchers-hidden",reflect:!0})],Wt.prototype,"switchersHidden",2);me([b({type:Boolean,reflect:!0})],Wt.prototype,"floating",2);me([b({type:String,reflect:!0})],Wt.prototype,"tab",1);me([b({type:Boolean,attribute:"switchers-full",reflect:!0})],Wt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const So=e=>e??M;var sd=Object.defineProperty,rd=Object.getOwnPropertyDescriptor,ft=(e,t,i,n)=>{for(var o=n>1?void 0:n?rd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&sd(t,i,o),o};const gr=class extends T{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(e){this._inputTypes.includes(e)&&(this._type=e)}get type(){return this._type}get query(){return pn(this.value)}onInputChange(e){e.stopPropagation();const t=e.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=t.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("input");t==null||t.focus()})}render(){return m`
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
              placeholder=${So(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:m` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${So(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};gr.styles=[St.scrollbar,I`
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
    `];let lt=gr;ft([b({type:String,reflect:!0})],lt.prototype,"icon",2);ft([b({type:String,reflect:!0})],lt.prototype,"label",2);ft([b({type:String,reflect:!0})],lt.prototype,"name",2);ft([b({type:String,reflect:!0})],lt.prototype,"placeholder",2);ft([b({type:String,reflect:!0})],lt.prototype,"value",2);ft([b({type:Boolean,reflect:!0})],lt.prototype,"vertical",2);ft([b({type:Number,reflect:!0})],lt.prototype,"debounce",2);ft([b({type:Number,reflect:!0})],lt.prototype,"rows",2);ft([b({type:String,reflect:!0})],lt.prototype,"type",1);var ad=Object.defineProperty,ld=Object.getOwnPropertyDescriptor,vr=(e,t,i,n)=>{for(var o=n>1?void 0:n?ld(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&ad(t,i,o),o};const yr=class extends T{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const e=this.children;for(const t of e)this.vertical?t.setAttribute("label-hidden",""):t.removeAttribute("label-hidden")}render(){return m`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};yr.styles=I`
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
  `;let Ri=yr;vr([b({type:Number,reflect:!0})],Ri.prototype,"rows",2);vr([b({type:Boolean,reflect:!0})],Ri.prototype,"vertical",1);var cd=Object.defineProperty,dd=Object.getOwnPropertyDescriptor,Di=(e,t,i,n)=>{for(var o=n>1?void 0:n?dd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&cd(t,i,o),o};const _r=class extends T{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(e){this._labelHidden=e,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const e=this.children;for(const t of e)t instanceof Ri&&(t.vertical=this.vertical),t.toggleAttribute("label-hidden",this.vertical)}render(){return m`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};_r.styles=I`
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
  `;let be=_r;Di([b({type:String,reflect:!0})],be.prototype,"label",2);Di([b({type:String,reflect:!0})],be.prototype,"icon",2);Di([b({type:Boolean,reflect:!0})],be.prototype,"vertical",1);Di([b({type:Boolean,attribute:"label-hidden",reflect:!0})],be.prototype,"labelHidden",1);var ud=Object.defineProperty,hd=Object.getOwnPropertyDescriptor,Pn=(e,t,i,n)=>{for(var o=n>1?void 0:n?hd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&ud(t,i,o),o};const xr=class extends T{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(e){this._vertical=e,this.updateSections()}get vertical(){return this._vertical}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const e=this.children;for(const t of e)t instanceof be&&(t.labelHidden=this.vertical&&!hn.config.sectionLabelOnVerticalToolbar,t.vertical=this.vertical)}render(){return m`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};xr.styles=I`
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
  `;let zi=xr;Pn([b({type:String,reflect:!0})],zi.prototype,"icon",2);Pn([b({type:Boolean,attribute:"labels-hidden",reflect:!0})],zi.prototype,"labelsHidden",2);Pn([b({type:Boolean,reflect:!0})],zi.prototype,"vertical",1);var pd=Object.defineProperty,md=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&pd(t,i,o),o};const wr=class extends T{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return m`
      <div class="parent">
        <slot></slot>
      </div>
    `}};wr.styles=I`
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
  `;let $r=wr;md([b({type:String,reflect:!0})],$r.prototype,"name");/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Cr="important",bd=" !"+Cr,pt=xs(class extends ws{constructor(e){var t;if(super(e),e.type!==_s.ATTRIBUTE||e.name!=="style"||((t=e.strings)==null?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return n==null?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(const n of this.ft)t[n]==null&&(this.ft.delete(n),n.includes("-")?i.removeProperty(n):i[n]=null);for(const n in t){const o=t[n];if(o!=null){this.ft.add(n);const s=typeof o=="string"&&o.endsWith(bd);n.includes("-")||s?i.setProperty(n,s?o.slice(0,-11):o,s?Cr:""):i[n]=o}}return zt}}),fd=e=>{const{components:t}=e,i=t.get(Wr);return m`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const n=document.createElement("input");n.type="file",n.accept=".ifc",n.onchange=async()=>{if(n.files===null||n.files.length===0)return;const o=n.files[0];n.remove();const s=await o.arrayBuffer(),r=new Uint8Array(s),a=await i.load(r);a.name=o.name.replace(".ifc","")},n.click()}}
    ></bim-button>
  `},gd=e=>B.create(fd,e),vd=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:gd},Symbol.toStringTag,{value:"Module"}));({...vd});const ri={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#414141","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},Xi={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"var(--bim-ui_bg-contrast-100)"},ko=(e,t)=>{const i=((t==null?void 0:t.users)??ri.users)[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${!(i!=null&&i.picture)&&(s||r)?m`
      <bim-label
        style=${pt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
      `:null}
    <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
  </div>
`},yd=e=>{const{components:t,dataStyles:i,onTopicEnter:n}=e,o=t.get(De),s=e.topics??o.list.values();return m`
    <bim-table @cellcreated=${({detail:r})=>{const{cell:a}=r;a.style.marginLeft="0"}} ${J(r=>{if(!r)return;const a=r;a.hiddenColumns=["Guid"],a.columns=["Title"],a.selectableRows=!0,a.dataTransform={Title:(l,d)=>{const{Guid:u}=d;if(typeof u!="string")return l;const c=o.list.get(u);return c?m`
        <div style="display: flex; overflow: hidden;">
          <style>
            #BBETO {
              background-color: transparent
            }
  
            #BBETO:hover {
              --bim-label--c: var(--bim-ui_accent-base)
            }
          </style> 
          <bim-button @click=${()=>{n&&n(c)}} id="BBETO" icon="iconamoon:enter-duotone"></bim-button>
          <bim-label>${l}</bim-label>
        </div>`:l},Priority:l=>{if(typeof l!="string")return l;const d=((i==null?void 0:i.priorities)??ri.priorities)[l];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${pt({...Xi,...d==null?void 0:d.style})}
          >${l}
          </bim-label>
        `},Status:l=>{if(typeof l!="string")return l;const d=((i==null?void 0:i.statuses)??ri.statuses)[l];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${pt({...Xi,...d==null?void 0:d.style})}
          >${l}
          </bim-label>
        `},Type:l=>{if(typeof l!="string")return l;const d=((i==null?void 0:i.types)??ri.types)[l];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${pt({...Xi,...d==null?void 0:d.style})}
          >${l}
          </bim-label>
        `},Author:l=>typeof l!="string"?l:ko(l,i),Assignee:l=>typeof l!="string"?l:ko(l,i)},a.data=[...s].map(l=>{var d;return{data:{Guid:l.guid,Title:l.title,Status:l.status,Description:l.description??"",Author:l.creationAuthor,Assignee:l.assignedTo??"",Date:l.creationDate.toDateString(),DueDate:((d=l.dueDate)==null?void 0:d.toDateString())??"",Type:l.type,Priority:l.priority??""}}})})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">There are no topics to display</bim-label>
    </bim-table>`},Er=(e,t=!0)=>{const i=B.create(yd,e);if(t){const{components:n,topics:o}=e,[,s]=i,r=n.get(De);if(r.list.onItemUpdated.add(()=>s()),r.list.onItemDeleted.add(()=>s()),o)for(const a of o)a.relatedTopics.onItemAdded.add(()=>s()),a.relatedTopics.onItemDeleted.add(()=>s()),a.relatedTopics.onCleared.add(()=>s());else r.list.onItemSet.add(()=>s())}return i},_d=Object.freeze(Object.defineProperty({__proto__:null,topicsList:Er},Symbol.toStringTag,{value:"Module"})),xd=e=>{var t;const{components:i,topic:n,actions:o}=e,s={selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!!n,...o},r=i.get(fn),a=((t=e.topic)==null?void 0:t.viewpoints)??r.list.keys(),l=[];for(const d of a){const u=r.list.get(d);u&&l.push(u)}return m`
    <bim-table ${J(d=>{if(!d)return;const u=d;u.addEventListener("cellcreated",({detail:c})=>{const{cell:h}=c;h.style.padding="0.25rem"}),u.headersHidden=!0,u.hiddenColumns=["Guid"],u.columns=["Title",{name:"Actions",width:"auto"}],u.dataTransform={Actions:(c,h)=>{const{Guid:p}=h;if(!(p&&typeof p=="string"))return p;const g=r.list.get(p);return g?m`
          <bim-button icon="ph:eye-fill" @click=${()=>g.go()}></bim-button>
          ${Object.values(s).includes(!0)?m`
                <bim-button icon="prime:ellipsis-v">
                  <bim-context-menu>
                    ${s.selectComponents?m`<bim-button label="Select Components" @click=${()=>console.log(g.selection)}></bim-button> `:null}
                    ${s.colorizeComponent?m`<bim-button label="Colorize Components" @click=${()=>g.colorize()}></bim-button> `:null}
                    ${s.resetColors?m`<bim-button label="Reset Colors" @click=${()=>g.resetColors()}></bim-button> `:null}
                    ${s.updateCamera?m`<bim-button label="Update Camera" @click=${()=>g.updateCamera()}></bim-button> `:null}
                    ${s.unlink?m`<bim-button .disabled=${!n} label="Unlink" @click=${()=>n==null?void 0:n.viewpoints.delete(g.guid)}></bim-button> `:null}
                    ${s.delete?m`<bim-button label="Delete" @click=${()=>r.list.delete(g.guid)}></bim-button>`:null}
                  </bim-context-menu>
                </bim-button>
              `:null}
        `:p}},u.data=l.map((c,h)=>({data:{Guid:c.guid,Title:c.title??`Viewpoint ${e.topic?h+1:""}`,Actions:""}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">No viewpoints to show</bim-label>
    </bim-table>
  `},Mn=(e,t=!0)=>{const i=B.create(xd,e),{components:n,topic:o}=e;if(t){const[,s]=i,r=n.get(fn);r.list.onItemUpdated.add(()=>s()),r.list.onItemDeleted.add(()=>s()),r.list.onCleared.add(()=>s()),o?(o.viewpoints.onItemAdded.add(()=>s()),o.viewpoints.onItemDeleted.add(()=>s()),o.viewpoints.onCleared.add(()=>s())):r.list.onItemSet.add(()=>s())}return i},wd=Object.freeze(Object.defineProperty({__proto__:null,viewpointsList:Mn},Symbol.toStringTag,{value:"Module"})),$d={"jhon.doe@example.com":{name:"Jhon Doe",picture:"https://www.profilebakery.com/wp-content/uploads/2023/04/Profile-Image-AI.jpg"}},Cd=(e,t)=>{const i=(t??$d)[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${!(i!=null&&i.picture)&&(s||r)?m`
      <bim-label
        style=${pt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
      `:null}
    <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
  </div>
`},Ed=e=>{const{topic:t,styles:i,viewpoint:n,actions:o}=e,s={delete:!0,...o};return m`<bim-table @cellcreated=${({detail:r})=>{const{cell:a}=r;a.style.marginLeft="0"}} ${J(r=>{if(!r)return;const a=r;a.headersHidden=!0,a.hiddenColumns=["guid","author"],a.dataTransform={Comment:(d,u)=>{const{guid:c}=u;if(typeof c!="string")return d;const h=t.comments.get(c);if(!h)return d;const p=()=>{t.comments.delete(c)};return m`
        <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1">
          <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; gap: 0.375rem;">
              ${Cd(h.author,i)}
              <bim-label style="color: var(--bim-ui_bg-contrast-40)">@ ${h.date.toDateString()}</bim-label>
            </div>
            <div>
              <style>
                #TCDBT {
                  background-color: transparent;
                  --bim-label--c: var(--bim-ui_bg-contrast-60)
                }

                #TCDBT:hover {
                  --bim-label--c: #FF5252;
                }
              </style>
              ${s!=null&&s.delete?m`<bim-button @click=${p} id="TCDBT" icon="majesticons:delete-bin"></bim-button>`:null}
            </div>
          </div>
          <bim-label style="margin-left: 1.7rem; white-space: normal">${h.comment}</bim-label>
        </div>
      `}};let l=t.comments.values();n&&(l=[...t.comments.values()].filter(d=>d.viewpoint===n)),a.data=[...l].map(d=>({data:{guid:d.guid,Comment:d.comment,author:(()=>{const u=i;if(!u)return d.author;const c=u[d.author];return(c==null?void 0:c.name)??d.author})()}}))})}><bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">This topic has no comments</bim-label></bim-table>`},Ar=(e,t=!0)=>{const i=B.create(Ed,e);if(t){const{topic:n}=e,[o,s]=i;n.comments.onItemSet.add(()=>s()),n.comments.onItemUpdated.add(()=>s()),n.comments.onItemDeleted.add(()=>s()),n.comments.onCleared.add(()=>s())}return i},Ad=Object.freeze(Object.defineProperty({__proto__:null,topicComments:Ar},Symbol.toStringTag,{value:"Module"})),ai={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"#2E2E2E"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#2E2E2E","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},Ji={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"white"},Qi=(e,t)=>{const i=((t==null?void 0:t.users)??ai.users)[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${!(i!=null&&i.picture)&&(s||r)?m`
      <bim-label
        style=${pt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
      `:null}
    <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
  </div>
`},[xi,Sd]=B.create(e=>{const{topic:t}=e,i=document.createElement("bim-text-input");i.type="area";const n=()=>{i.value="",xi.close(),xi.remove()};return m`
     <dialog>
      ${t?m`
            <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 20rem;">
              <bim-panel-section label="New Comment" fixed>
                ${i}
                <div style="justify-content: right; display: flex; gap: 0.375rem">
                  <style>
                    #PAISD {
                      background-color: transparent;
                    }

                    #PAISD:hover {
                      --bim-label--c: #FF5252;
                    }

                    #MDOG9:hover {
                      background-color: #329936;
                    }
                  </style>
                  <bim-button @click=${n} style="flex: 0" id="PAISD" label="Cancel"></bim-button>
                  <bim-button @click=${()=>{const o=i.value;!t||o.trim()===""||(t.createComment(o),n())}} style="flex: 0" id="MDOG9" label="Add Comment"} icon="mi:add"}></bim-button>
                </div>
              </bim-panel-section>
            </bim-panel> 
          `:m`<bim-label>No topic refereced</bim-label>`}
     </dialog> 
    `},{}),[wi,kd]=B.create(e=>{const{components:t,topic:i}=e;let n;t&&(n=Mn({components:t,actions:{delete:!1,updateCamera:!1,colorizeComponent:!1,resetColors:!1,selectComponents:!1}})[0],n.selectableRows=!0);const o=()=>{wi.close(),wi.remove(),n==null||n.remove()};return m`
     <dialog>
      ${i?m`
            <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 20rem;">
              <bim-panel-section label="Link Viewpoints" fixed>
                ${n}
                <div style="justify-content: right; display: flex; gap: 0.375rem">
                  <style>
                    #PAISD {
                      background-color: transparent;
                    }

                    #PAISD:hover {
                      --bim-label--c: #FF5252;
                    }

                    #MDOG9:hover {
                      background-color: #329936;
                    }
                  </style>
                  <bim-button @click=${o} style="flex: 0" id="PAISD" label="Cancel"></bim-button>
                  <bim-button @click=${()=>{if(!(n&&i))return;const s=n.selection;for(const r of s){const{Guid:a}=r;typeof a=="string"&&i.viewpoints.add(a)}o()}} style="flex: 0" id="MDOG9" label="Link Viewpoints"} icon="mi:add"}></bim-button>
                </div>
              </bim-panel-section>
            </bim-panel> 
          `:m`<bim-label>No topic refereced</bim-label>`}
     </dialog> 
    `},{}),[$i,Od]=B.create(e=>{const{components:t,topic:i}=e;let n;if(t){const s=[...t.get(De).list.values()].filter(r=>r!==i);n=Er({components:t,topics:s})[0],n.selectableRows=!0,n.hiddenColumns=["Guid","Author","Assignee","Date","DueDate"]}const o=()=>{$i.close(),$i.remove(),n==null||n.remove()};return m`
     <dialog>
        <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 50rem;">
          <bim-panel-section label="Link Viewpoints" fixed>
            ${n}
            <div style="justify-content: right; display: flex; gap: 0.375rem">
              <style>
                #PAISD {
                  background-color: transparent;
                }

                #PAISD:hover {
                  --bim-label--c: #FF5252;
                }

                #MDOG9:hover {
                  background-color: #329936;
                }
              </style>
              <bim-button @click=${o} style="flex: 0" id="PAISD" label="Cancel"></bim-button>
              <bim-button @click=${()=>{if(!(n&&i))return;const s=n.selection;for(const r of s){const{Guid:a}=r;typeof a=="string"&&i.relatedTopics.add(a)}o()}} style="flex: 0" id="MDOG9" label="Link Topics"} icon="mi:add"}></bim-button>
            </div>
          </bim-panel-section>
        </bim-panel> 
     </dialog> 
    `},{}),Td=e=>{const{components:t,topic:i,styles:n,onUpdateInformation:o,actions:s,world:r}=e,a={update:!0,addComments:!0,linkViewpoints:!0,addViewpoints:!0,linkTopics:!0,...s},l=(n==null?void 0:n.priorities)??ai.priorities,d=(n==null?void 0:n.statuses)??ai.statuses,u=(n==null?void 0:n.types)??ai.types;let c;i!=null&&i.priority&&(c=l[i.priority]);let h;i!=null&&i.type&&(h=u[i.type]);let p;i!=null&&i.type&&(p=d[i.status]);let g,_,v;i&&(g=Ar({topic:i,styles:n==null?void 0:n.users})[0],_=Mn({components:t,topic:i})[0]);const f=()=>{if(!(i&&r))return;const E=t.get(fn).create(r);i.viewpoints.add(E.guid)},y=()=>{Sd({topic:i}),document.body.append(xi),xi.showModal()},x=()=>{kd({components:t,topic:i}),document.body.append(wi),wi.showModal()},w=()=>{Od({components:t,topic:i}),document.body.append($i),$i.showModal()};return m`
   <bim-panel>
    ${i?m`
      <bim-panel-section label="Information" icon="ph:info-bold" collapsed>
      <div>
        <bim-label>Title</bim-label> 
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${i.title}</bim-label> 
      </div>
      <div>
        <bim-label>Description</bim-label> 
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${i.description}</bim-label> 
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Status</bim-label> 
        <bim-label .icon=${p==null?void 0:p.icon} style=${pt({...Ji,...p==null?void 0:p.style})}
        >${i.status}
        </bim-label>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Type</bim-label> 
        <bim-label .icon=${h==null?void 0:h.icon} style=${pt({...Ji,...h==null?void 0:h.style})}
        >${i.type}
        </bim-label>
      </div>
      ${i.priority?m`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Priority</bim-label> 
              <bim-label .icon=${c==null?void 0:c.icon} style=${pt({...Ji,...c==null?void 0:c.style})}
              >${i.priority}
              </bim-label>
            </div>`:null}
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Author</bim-label> 
        ${Qi(i.creationAuthor,n)}
      </div>
      ${i.assignedTo?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Assignee</bim-label> 
            ${Qi(i.assignedTo,n)}
          </div>`:null}
      ${i.dueDate?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Due Date</bim-label> 
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${i.dueDate.toDateString()}</bim-label>
          </div>`:null}
      ${i.modifiedAuthor?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Modified By</bim-label> 
            ${Qi(i.modifiedAuthor,n)}
          </div>`:null}
      ${i.modifiedDate?m`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Modified Date</bim-label> 
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${i.modifiedDate.toDateString()}</bim-label>
            </div>`:null}
      ${i.labels.size!==0?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Labels</bim-label> 
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${[...i.labels].join(", ")}</bim-label>
          </div>`:null}
      ${a.update?m`
            <bim-button @click=${()=>{o&&o(i)}} label="Update Information" icon="tabler:refresh"></bim-button> 
          `:null}
    </bim-panel-section>
    <bim-panel-section label="Comments" icon="majesticons:comment-line">
      ${g}
      ${a.addComments?m`
            <bim-button @click=${y} label="Add Comment" icon="majesticons:comment-line"></bim-button>
          `:null}
    </bim-panel-section>
    <bim-panel-section label="Viewpoints" icon="tabler:camera">
      ${_}
      ${a.linkViewpoints||a.addViewpoints?m`
          <div style="display: flex; gap: 0.375rem">
            ${a.addViewpoints?m`<bim-button @click=${f} .disabled=${!r} label="Add Viewpoint" icon="mi:add"></bim-button> `:null}
            ${a.linkViewpoints?m`<bim-button @click=${x} label="Link Viewpoint" icon="tabler:camera"></bim-button>`:null}
          </div>
          `:null}
    </bim-panel-section>
    <!-- <bim-panel-section label="Related Topics" icon="material-symbols:topic-outline">
      ${v}
      ${a.linkViewpoints?m`
            <bim-button @click=${w} label="Link Topic" icon="material-symbols:topic-outline"></bim-button> 
          `:null}
    </bim-panel-section> -->
    `:m`<bim-label>No topic selected!</bim-label>`}
   </bim-panel> 
  `},Id=(e,t=!0)=>{const i=B.create(Td,e);if(t){const{components:n}=e,[o,s]=i;n.get(De).list.onItemUpdated.add(({value:r})=>{const{topic:a}=s(),{guid:l}=r;l===(a==null?void 0:a.guid)&&s()})}return i},Nd=Object.freeze(Object.defineProperty({__proto__:null,topicData:Id},Symbol.toStringTag,{value:"Module"}));({...Nd});const Pd=e=>{const{components:t,actions:i,tags:n}=e,o=(i==null?void 0:i.dispose)??!0,s=(i==null?void 0:i.download)??!0,r=(i==null?void 0:i.visibility)??!0,a=(n==null?void 0:n.schema)??!0,l=(n==null?void 0:n.viewDefinition)??!0,d=t.get(Ht),u=document.createElement("bim-table");u.addEventListener("cellcreated",({detail:h})=>{const{cell:p}=h;p.style.padding="0.25rem 0"}),u.hiddenColumns=["modelID"],u.headersHidden=!0;const c=[];for(const[,h]of d.groups){if(!h)continue;const p={data:{Name:h.name||h.uuid,modelID:h.uuid}};c.push(p)}return u.dataTransform={Name:(h,p)=>{const{modelID:g}=p;if(typeof g!="string")return h;const _=d.groups.get(g);if(!_)return g;const v={};for(const A of _.items)v[A.id]=A.ids;let f;const{schema:y}=_.ifcMetadata;a&&y&&(f=m`
          <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${y}</bim-label>
          `);let x;if(l&&"viewDefinition"in _.ifcMetadata){const A=_.ifcMetadata.viewDefinition;x=m`
          ${A.split(",").map(N=>m`<bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${N}</bim-label>`)}
        `}let w;o&&(w=m`<bim-button @click=${()=>d.disposeGroup(_)} icon="mdi:delete"></bim-button>`);let E;r&&(E=m`<bim-button @click=${A=>{const N=t.get(Uo),$=A.target;N.set($.hasAttribute("data-model-hidden"),v),$.toggleAttribute("data-model-hidden"),$.icon=$.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye"}} icon="mdi:eye"></bim-button>`);let C;return s&&(C=m`<bim-button @click=${()=>{const A=document.createElement("input");A.type="file",A.accept=".ifc",A.multiple=!1,A.addEventListener("change",async()=>{if(!(A.files&&A.files.length===1))return;const N=A.files[0],$=await N.arrayBuffer(),S=await t.get(Yr).saveToIfc(_,new Uint8Array($)),k=new File([S],N.name),U=document.createElement("a");U.href=URL.createObjectURL(k),U.download=k.name,U.click(),URL.revokeObjectURL(U.href)}),A.click()}} icon="flowbite:download-solid"></bim-button>`),m`
       <div style="display: flex; flex: 1; gap: var(--bim-ui_size-4xs); justify-content: space-between; overflow: auto;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bim-ui_size-4xs); flex-grow: 1; overflow: auto;">
          <div style="min-height: 1.75rem; overflow: auto; display: flex;">
            <bim-label style="white-space: normal;">${h}</bim-label>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--bim-ui_size-4xs); overflow: auto;">
            ${f}
            ${x}
          </div>
        </div>
        <div style="display: flex; align-self: flex-start; flex-shrink: 0;">
          ${C}
          ${E}
          ${w}
        </div>
       </div>
      `}},u.data=c,m`
    <div>
      ${c.length===0?m`<bim-label>No models has been loaded yet</bim-label>`:u}
    </div>
  `},Md=(e,t=!0)=>{const i=B.create(Pd,e);if(t){const{components:n}=e,o=n.get(Ht),[,s]=i;o.onFragmentsLoaded.add(()=>setTimeout(()=>s())),o.onFragmentsDisposed.add(()=>s())}return i},Ld=Object.freeze(Object.defineProperty({__proto__:null,modelsList:Md},Symbol.toStringTag,{value:"Module"})),Sr=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",e=>e.includes("Value"),e=>e.startsWith("Material"),e=>e.startsWith("Relating"),e=>{const t=["IsGroupedBy","IsDecomposedBy"];return e.startsWith("Is")&&!t.includes(e)}];async function li(e,t,i,n=Sr,o=!1){const s=e.get(at),r=await t.getProperties(i);if(!r)return{data:{Entity:`${i} properties not found...`}};const a=s.relationMaps[t.uuid],l={data:{}};for(const d in r){const u=n.map(h=>typeof h=="string"?d===h:h(d)).includes(!0);if(!(d==="type"||u))continue;const c=r[d];if(c)if(c.type===5){l.children||(l.children=[]);const h=await li(e,t,c.value,n,o);l.children.push(h)}else if(typeof c=="object"&&!Array.isArray(c)){const{value:h,type:p}=c;if(o)p===1||p===2||p===3||(l.data[d]=h);else{const g=typeof h=="number"?Number(h.toFixed(3)):h;l.data[d]=g}}else if(Array.isArray(c))for(const h of c){if(h.type!==5)continue;l.children||(l.children=[]);const p=await li(e,t,h.value,n,o);l.children.push(p)}else if(d==="type"){const h=di[c];l.data.Entity=h}else l.data[d]=c}if(a&&a.get(r.expressID)){const d=a.get(r.expressID);for(const u of n){const c=[];if(typeof u=="string"){const h=s._inverseAttributes.indexOf(u);h!==-1&&c.push(h)}else{const h=s._inverseAttributes.filter(p=>u(p));for(const p of h){const g=s._inverseAttributes.indexOf(p);c.push(g)}}for(const h of c){const p=d.get(h);if(p)for(const g of p){const _=await li(e,t,g,n,o);l.children||(l.children=[]),l.children.push(_)}}}}return l}const jd=e=>{const{components:t,fragmentIdMap:i,attributesToInclude:n,editable:o,tableDefinition:s}=e,r=t.get(Ht);let a;return typeof n=="function"?a=n(Sr):a=n,m`<bim-table ${J(async l=>{if(!l)return;const d=l,u=[],c=[];for(const h in i){const p=r.list.get(h);if(!(p&&p.group))continue;const g=p.group,_=c.find(v=>v.model===g);if(_)for(const v of i[h])_.expressIDs.add(v);else{const v={model:g,expressIDs:new Set(i[h])};c.push(v)}}for(const h of c){const{model:p,expressIDs:g}=h;for(const _ of g){const v=await li(t,p,_,a,o);u.push(v)}}d.dataTransform=s,d.data=u,d.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},Rd=e=>B.create(jd,e),Dd=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:Rd},Symbol.toStringTag,{value:"Module"}));let yt;const zd=e=>{const{components:t,classifications:i}=e,n=t.get(Gr),o=t.get(Uo);yt||(yt=document.createElement("bim-table"),yt.headersHidden=!0,yt.hiddenColumns=["system"],yt.columns=["Name",{name:"Actions",width:"auto"}],yt.dataTransform={Actions:(r,a)=>{const{system:l,Name:d}=a;if(!(typeof l=="string"&&typeof d=="string"))return r;const u=n.list[l];if(!(u&&u[d]))return r;const c=u[d],{map:h}=c;return m`
          <div>
            <bim-checkbox checked @change=${p=>{const g=p.target;o.set(g.value,h)}}></bim-checkbox>
          </div>
        `}});const s=[];for(const r of i){const a=typeof r=="string"?r:r.system,l=typeof r=="string"?r:r.label,d=n.list[a];d&&s.push({data:{Name:l,system:a},children:Object.keys(d).map(u=>({data:{Name:u,system:a,Actions:""}}))})}return yt.data=s,m`${yt}`},Fd=(e,t=!0)=>{const i=B.create(zd,e);if(t){const{components:n}=e,o=n.get(Ht),[,s]=i;o.onFragmentsDisposed.add(()=>s())}return i},Hd=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:Fd},Symbol.toStringTag,{value:"Module"})),kr=async(e,t,i)=>{var n,o,s,r;const a=e.get(at),l={data:{Name:(n=i.Name)==null?void 0:n.value},children:[{data:{Name:"Identification",Value:(o=i.Identification)==null?void 0:o.value}},{data:{Name:"Name",Value:(s=i.Name)==null?void 0:s.value}},{data:{Name:"Description",Value:(r=i.Description)==null?void 0:r.value}}]},d=a.getEntityRelations(t,i.expressID,"IsNestedBy");if(!d)return l;l.children||(l.children=[]);const u=[];l.children.push({data:{Name:"Tasks"},children:u});for(const c of d){const h=await t.getProperties(c);if(!h)continue;const p=await kr(e,t,h);u.push(p)}return l},Bd=async(e,t,i)=>{const n=[];for(const o of i){const s=await kr(e,t,o);n.push(s)}return{data:{Name:"Tasks"},children:n}},Ud=async(e,t)=>{var i,n;const o={data:{Name:"Classifications"}};for(const s of t){const{value:r}=s.ReferencedSource,a=await e.getProperties(r);if(!a)continue;const l={data:{Name:a.Name.value},children:[{data:{Name:"Identification",Value:((i=s.Identification)==null?void 0:i.value)||((n=s.ItemReference)==null?void 0:n.value)}},{data:{Name:"Name",Value:s.Name.value}}]};o.children||(o.children=[]),o.children.push(l)}return o},Vd=async(e,t)=>{const i={data:{Name:"Materials"}};for(const n of t){if(n.type===Go){const o=n.ForLayerSet.value,s=await e.getProperties(o);if(!s)continue;for(const r of s.MaterialLayers){const{value:a}=r,l=await e.getProperties(a);if(!l)continue;const d=await e.getProperties(l.Material.value);if(!d)continue;const u={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:l.LayerThickness.value}},{data:{Name:"Material",Value:d.Name.value}}]};i.children||(i.children=[]),i.children.push(u)}}if(n.type===Yo)for(const o of n.Materials){const{value:s}=o,r=await e.getProperties(s);if(!r)continue;const a={data:{Name:"Name",Value:r.Name.value}};i.children||(i.children=[]),i.children.push(a)}if(n.type===qo){const o={data:{Name:"Name",Value:n.Name.value}};i.children||(i.children=[]),i.children.push(o)}}return i},Wd=async(e,t)=>{const i={data:{Name:"PropertySets"}};for(const n of t){const o={data:{Name:n.Name.value}};if(n.type===Vo){for(const s of n.HasProperties){const{value:r}=s,a=await e.getProperties(r);if(!a)continue;const l=Object.keys(a).find(u=>u.includes("Value"));if(!(l&&a[l]))continue;const d={data:{Name:a.Name.value,Value:a[l].value}};o.children||(o.children=[]),o.children.push(d)}o.children&&(i.children||(i.children=[]),i.children.push(o))}}return i},Gd=async(e,t)=>{const i={data:{Name:"QuantitySets"}};for(const n of t){const o={data:{Name:n.Name.value}};if(n.type===Wo){for(const s of n.Quantities){const{value:r}=s,a=await e.getProperties(r);if(!a)continue;const l=Object.keys(a).find(u=>u.includes("Value"));if(!(l&&a[l]))continue;const d={data:{Name:a.Name.value,Value:a[l].value}};o.children||(o.children=[]),o.children.push(d)}o.children&&(i.children||(i.children=[]),i.children.push(o))}}return i},qd=["OwnerHistory","ObjectPlacement","CompositionType"],Or=async(e,t)=>{const i={groupName:"Attributes",includeClass:!1,...t},{groupName:n,includeClass:o}=i,s={data:{Name:n}};o&&(s.children||(s.children=[]),s.children.push({data:{Name:"Class",Value:di[e.type]}}));for(const r in e){if(qd.includes(r))continue;const a=e[r];if(a&&typeof a=="object"&&!Array.isArray(a)){if(a.type===sa)continue;const l={data:{Name:r,Value:a.value}};s.children||(s.children=[]),s.children.push(l)}}return s},ne=(e,...t)=>{e.children||(e.children=[]),e.children.push(...t)},Yd=async(e,t,i,n)=>{const o=e.get(at).getEntityRelations(t,i,"IsDefinedBy");if(o){const s=[],r=[];for(const l of o){const d=await t.getProperties(l);d&&(d.type===Vo&&s.push(d),d.type===Wo&&r.push(d))}const a=await Wd(t,s);a.children&&ne(n,a),(await Gd(t,r)).children&&ne(n,a)}},Xd=async(e,t,i,n)=>{const o=e.get(at).getEntityRelations(t,i,"HasAssociations");if(o){const s=[],r=[];for(const d of o){const u=await t.getProperties(d);u&&(u.type===ra&&s.push(u),(u.type===Go||u.type===aa||u.type===la||u.type===qo||u.type===Yo)&&r.push(u))}const a=await Ud(t,s);a.children&&ne(n,a);const l=await Vd(t,r);l.children&&ne(n,l)}},Jd=async(e,t,i,n)=>{const o=e.get(at).getEntityRelations(t,i,"HasAssignments");if(o){const s=[];for(const a of o){const l=await t.getProperties(a);l&&l.type===ca&&s.push(l)}const r=await Bd(e,t,s);r.children&&ne(n,r)}},Qd=async(e,t,i,n)=>{const o=e.get(at).getEntityRelations(t,i,"ContainedInStructure");if(o&&o[0]){const s=o[0],r=await t.getProperties(s);if(r){const a=await Or(r,{groupName:"SpatialContainer"});ne(n,a)}}};let ni={};const Zd=async(e,t)=>{var i;const n=e.get(at),o=e.get(Ht),s=o.getModelIdMap(t);Object.keys(t).length===0&&(ni={});const r=[];for(const a in s){const l=o.groups.get(a);if(!l)continue;const d=n.relationMaps[l.uuid];if(!d)continue;a in ni||(ni[a]=new Map);const u=ni[a],c=s[a];for(const h of c){let p=u.get(h);if(p){r.push(p);continue}const g=await l.getProperties(h);if(!g)continue;p={data:{Name:(i=g.Name)==null?void 0:i.value}},r.push(p),u.set(h,p);const _=await Or(g,{includeClass:!0});p.children||(p.children=[]),p.children.push(_),d.get(h)&&(await Yd(e,l,h,p),await Xd(e,l,h,p),await Jd(e,l,h,p),await Qd(e,l,h,p))}}return r},Kd=new Event("datacomputed");let dt;const tu=e=>{const t={emptySelectionWarning:!0,...e},{components:i,fragmentIdMap:n,emptySelectionWarning:o}=t;if(!dt&&(dt=document.createElement("bim-table"),dt.columns=[{name:"Name",width:"12rem"}],dt.headersHidden=!0,dt.addEventListener("cellcreated",({detail:s})=>{const{cell:r}=s;r.column==="Name"&&!("Value"in r.rowData)&&(r.style.gridColumn="1 / -1")}),o)){const s=document.createElement("bim-label");s.style.setProperty("--bim-icon--c","gold"),s.slot="missing-data",s.icon="ic:round-warning",s.textContent="Select some elements to display its properties",dt.append(s)}return Zd(i,n).then(s=>{dt.data=s,s.length!==0&&dt.dispatchEvent(Kd)}),m`${dt}`},eu=e=>B.create(tu,e),iu=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:eu},Symbol.toStringTag,{value:"Module"})),bn=async(e,t,i,n)=>{var o;const s=[],r=e.get(at),a=await t.getProperties(i);if(!a)return s;const{type:l}=a,d={data:{Entity:di[l],Name:(o=a.Name)==null?void 0:o.value,modelID:t.uuid,expressID:i}};for(const u of n){const c=r.getEntityRelations(t,i,u);if(!c)continue;d.children||(d.children=[]),d.data.relations=JSON.stringify(c);const h={};for(const p of c){const g=await bn(e,t,p,n);for(const _ of g)if(_.data.relations)d.children.push(_);else{const v=t.data.get(p);if(!v){d.children.push(_);continue}const f=v[1][1],y=di[f];y in h||(h[y]=[]),_.data.Entity=_.data.Name,delete _.data.Name,h[y].push(_)}}for(const p in h){const g=h[p],_=g.map(f=>f.data.expressID),v={data:{Entity:p,modelID:t.uuid,relations:JSON.stringify(_)},children:g};d.children.push(v)}}return s.push(d),s},nu=async(e,t,i,n)=>{const o=e.get(at),s=[];for(const r of t){let a;if(n)a={data:{Entity:r.name!==""?r.name:r.uuid},children:await bn(e,r,n,i)};else{const l=o.relationMaps[r.uuid],d=await r.getAllPropertiesOfType(oa);if(!(l&&d))continue;const{expressID:u}=Object.values(d)[0];a={data:{Entity:r.name!==""?r.name:r.uuid},children:await bn(e,r,u,i)}}s.push(a)}return s};let ut;const ou=(e,t)=>{const i=e.get(Ht),{modelID:n,expressID:o,relations:s}=t.data;if(!n)return null;const r=i.groups.get(n);return r?r.getFragmentMap([o,...JSON.parse(s??"[]")]):null},su=e=>{const{components:t,models:i,expressID:n}=e,o=e.selectHighlighterName??"select",s=e.hoverHighlighterName??"hover";ut||(ut=document.createElement("bim-table"),ut.hiddenColumns=["modelID","expressID","relations"],ut.columns=["Entity","Name"],ut.headersHidden=!0,ut.addEventListener("cellcreated",({detail:a})=>{const{cell:l}=a;l.column==="Entity"&&!("Name"in l.rowData)&&(l.style.gridColumn="1 / -1")})),ut.addEventListener("rowcreated",a=>{a.stopImmediatePropagation();const{row:l}=a.detail,d=t.get(ua),u=ou(t,l);u&&Object.keys(u).length!==0&&(l.onmouseover=()=>{s&&(l.style.backgroundColor="var(--bim-ui_bg-contrast-20)",d.highlightByID(s,u,!0,!1,d.selection[o]??{}))},l.onmouseout=()=>{l.style.backgroundColor="",d.clear(s)},l.onclick=()=>{o&&d.highlightByID(o,u,!0,!0)})});const r=e.inverseAttributes??["IsDecomposedBy","ContainsElements"];return nu(t,i,r,n).then(a=>ut.data=a),m`${ut}`},ru=(e,t=!0)=>{const i=B.create(su,e);if(t){const[,n]=i,{components:o}=e,s=o.get(Ht),r=o.get(at),a=()=>n({models:s.groups.values()});r.onRelationsIndexed.add(a),s.onFragmentsDisposed.add(a)}return i},au=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:ru},Symbol.toStringTag,{value:"Module"})),xe=(e,t)=>[...e.get(Xr).list.values()].find(i=>i.world===t),lu=(e,t)=>m`
    <bim-color-input @input=${i=>{const n=i.target;e.color=new ze(n.color)}} color=${t}></bim-color-input>
  `,cu=(e,t)=>{const{postproduction:i}=e,n=i.n8ao.configuration;return m`
    <bim-color-input @input=${o=>{const s=o.target;n.color=new ze(s.color)}} color=${t}></bim-color-input>
  `},du=(e,t)=>{const{color:i,opacity:n}=JSON.parse(t),{postproduction:o}=e,{customEffects:s}=o;return m`
    <bim-color-input @input=${r=>{const{color:a,opacity:l}=r.target;s.lineColor=new ze(a).getHex(),l&&(s.opacity=l/100)}} color=${i} opacity=${n*100}></bim-color-input>
  `},uu=(e,t)=>m`
    <bim-color-input @input=${i=>{const n=i.target,o=new ze(n.color);e.material.uniforms.uColor.value=o}} color=${t}></bim-color-input>
  `,hu=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({ao:o.checked})}} .checked=${t}></bim-checkbox>
  `},pu=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({gamma:o.checked})}} .checked=${t}></bim-checkbox>
  `},mu=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({custom:o.checked})}} .checked=${t}></bim-checkbox>
  `},_t=(e,t,i,n=()=>{})=>m`
    <bim-checkbox .checked="${i}" @change="${o=>{const s=o.target.checked;e[t]=s,n(s)}}"></bim-checkbox> 
  `,P=(e,t,i,n)=>{const o={slider:!1,min:0,max:100,step:1,prefix:null,suffix:null,onInputSet:()=>{},...n},{slider:s,min:r,max:a,step:l,suffix:d,prefix:u,onInputSet:c}=o;return m`
    <bim-number-input
      .pref=${u}
      .suffix=${d}
      .slider=${s} 
      min=${r} 
      value="${i}" 
      max=${a} 
      step=${l} 
      @change="${h=>{const p=h.target.value;e[t]=p,c(p)}}"
    ></bim-number-input> 
  `},bu=e=>{const{components:t}=e,i=t.get(gn);return m`<bim-table ${J(async n=>{var o,s,r,a,l;if(!n)return;const d=n;d.preserveStructureOnFilter=!0,d.dataTransform={Value:(c,h)=>{const p=h.World,g=i.list.get(p);if(!g)return c;const{scene:_,camera:v,renderer:f}=g,y=h.Name;if(y==="Grid"&&h.IsGridConfig&&typeof c=="boolean"){const x=xe(t,g);return x?_t(x,"visible",c):c}if(y==="Color"&&h.IsGridConfig&&typeof c=="string"){const x=xe(t,g);return x?uu(x,c):c}if(y==="Distance"&&h.IsGridConfig&&typeof c=="number"){const x=xe(t,g);return x?P(x.material.uniforms.uDistance,"value",c,{slider:!0,min:300,max:1e3}):c}if(y==="Size"&&h.IsGridConfig&&typeof c=="string"){const x=xe(t,g);if(!x)return c;const{x:w,y:E}=JSON.parse(c),C=P(x.material.uniforms.uSize1,"value",w,{slider:!0,suffix:"m",prefix:"A",min:1,max:20}),A=P(x.material.uniforms.uSize2,"value",E,{slider:!0,suffix:"m",prefix:"B",min:1,max:20});return m`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${C}${A}</div>
          `}if(y==="Near Frustum"&&v.three instanceof ti&&typeof c=="number"){const x=v.three;return P(v.three,"near",c,{slider:!0,min:.1,max:10,step:.1,onInputSet:()=>x.updateProjectionMatrix()})}if(y==="Far Frustum"&&v.three instanceof ti&&typeof c=="number"){const x=v.three;return P(v.three,"far",c,{slider:!0,min:300,max:2e3,step:10,onInputSet:()=>x.updateProjectionMatrix()})}if(y==="Field of View"&&v.three instanceof ti&&typeof c=="number"){const x=v.three;return P(v.three,"fov",c,{slider:!0,min:10,max:120,onInputSet:()=>x.updateProjectionMatrix()})}if(y==="Invert Drag"&&v.hasCameraControls()&&typeof c=="boolean")return _t(v.controls,"dollyDragInverted",c);if(y==="Dolly Speed"&&v.hasCameraControls()&&typeof c=="number")return P(v.controls,"dollySpeed",c,{slider:!0,min:.5,max:3,step:.1});if(y==="Truck Speed"&&v.hasCameraControls()&&typeof c=="number")return P(v.controls,"truckSpeed",c,{slider:!0,min:.5,max:6,step:.1});if(y==="Smooth Time"&&v.hasCameraControls()&&typeof c=="number")return P(v.controls,"smoothTime",c,{slider:!0,min:.01,max:2,step:.01});if(y==="Intensity"&&typeof c=="number"){if(h.Light&&typeof h.Light=="string"){const x=_.three.children.find(w=>w.uuid===h.Light);return x&&x instanceof ye?P(x,"intensity",c,{slider:!0,min:0,max:10,step:.1}):c}if(h.IsAOConfig&&f instanceof L)return P(f.postproduction.n8ao.configuration,"intensity",c,{slider:!0,max:16,step:.1})}if(y==="Color"&&typeof c=="string"){const x=h.Light,w=_.three.children.find(E=>E.uuid===x);if(w&&w instanceof ye)return lu(w,c);if(h.IsAOConfig&&f instanceof L)return cu(f,c)}if(y==="Ambient Oclussion"&&typeof c=="boolean"&&h.IsAOConfig&&f instanceof L)return hu(f,c);if(y==="Half Resolution"&&h.IsAOConfig&&f instanceof L&&typeof c=="boolean")return _t(f.postproduction.n8ao.configuration,"halfRes",c);if(y==="Screen Space Radius"&&h.IsAOConfig&&f instanceof L&&typeof c=="boolean")return _t(f.postproduction.n8ao.configuration,"screenSpaceRadius",c);if(y==="Radius"&&h.IsAOConfig&&f instanceof L&&typeof c=="number")return P(f.postproduction.n8ao.configuration,"aoRadius",c,{slider:!0,max:2,step:.1});if(y==="Denoise Samples"&&h.IsAOConfig&&f instanceof L&&typeof c=="number")return P(f.postproduction.n8ao.configuration,"denoiseSamples",c,{slider:!0,min:1,max:16});if(y==="Samples"&&h.IsAOConfig&&f instanceof L&&typeof c=="number")return P(f.postproduction.n8ao.configuration,"aoSamples",c,{slider:!0,min:1,max:16});if(y==="Denoise Radius"&&h.IsAOConfig&&f instanceof L&&typeof c=="number")return P(f.postproduction.n8ao.configuration,"denoiseRadius",c,{slider:!0,min:0,max:16,step:.1});if(y==="Distance Falloff"&&h.IsAOConfig&&f instanceof L&&typeof c=="number")return P(f.postproduction.n8ao.configuration,"distanceFalloff",c,{slider:!0,min:0,max:4,step:.1});if(y==="Directional Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const x=_.three.children.find(w=>w.uuid===h.Light);return x&&x instanceof ye?_t(x,"visible",c):c}if(y==="Ambient Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const x=_.three.children.find(w=>w.uuid===h.Light);return x&&x instanceof ye?_t(x,"visible",c):c}if(y==="Position"&&h.Light&&typeof h.Light=="string"&&typeof c=="string"){const x=_.three.children.find(S=>S.uuid===h.Light);if(!(x&&x instanceof ye))return c;const{x:w,y:E,z:C}=JSON.parse(c),A=P(x.position,"x",w,{slider:!0,prefix:"X",suffix:"m",min:-50,max:50}),N=P(x.position,"y",E,{slider:!0,prefix:"Y",suffix:"m",min:-50,max:50}),$=P(x.position,"z",C,{slider:!0,prefix:"Z",suffix:"m",min:-50,max:50});return m`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${A}${N}${$}</div>
          `}return y==="Custom Effects"&&h.IsCEConfig&&f instanceof L&&typeof c=="boolean"?mu(f,c):y==="Color"&&h.IsOutlineConfig&&f instanceof L&&typeof c=="string"?du(f,c):y==="Tolerance"&&h.IsOutlineConfig&&f instanceof L&&typeof c=="number"?P(f.postproduction.customEffects,"tolerance",c,{slider:!0,min:0,max:6,step:.01}):y==="Outline"&&h.IsOutlineConfig&&f instanceof L&&typeof c=="boolean"?_t(f.postproduction.customEffects,"outlineEnabled",c):y==="Gloss"&&h.IsGlossConfig&&f instanceof L&&typeof c=="boolean"?_t(f.postproduction.customEffects,"glossEnabled",c):y==="Min"&&h.IsGlossConfig&&f instanceof L&&typeof c=="number"?P(f.postproduction.customEffects,"minGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):y==="Max"&&h.IsGlossConfig&&f instanceof L&&typeof c=="number"?P(f.postproduction.customEffects,"maxGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):y==="Exponent"&&h.IsGlossConfig&&f instanceof L&&typeof c=="number"?P(f.postproduction.customEffects,"glossExponent",c,{slider:!0,min:0,max:5,step:.01}):y==="Gamma Correction"&&h.IsGammaConfig&&f instanceof L&&typeof c=="boolean"?pu(f,c):c}},d.addEventListener("cellcreated",({detail:c})=>{const h=c.cell.parentNode;if(!h)return;const p=h.querySelector("bim-table-cell[column='Name']"),g=h.querySelector("bim-table-cell[column='Value']");p&&!g&&(p.style.gridColumn="1 / -1")});const u=[];for(const[,c]of i.list){const{scene:h,camera:p,renderer:g}=c,_=xe(t,c),v={data:{Name:c instanceof qr&&c.name||c.uuid},children:[]};if(h){const f={data:{Name:"Scene"}};if(_){const w={data:{Name:"Grid",Value:_.three.visible,World:c.uuid,IsGridConfig:!0},children:[{data:{Name:"Color",get Value(){return`#${_.material.uniforms.uColor.value.getHexString()}`},World:c.uuid,IsGridConfig:!0}},{data:{Name:"Size",get Value(){const E=_.material.uniforms.uSize1.value,C=_.material.uniforms.uSize2.value;return JSON.stringify({x:E,y:C})},World:c.uuid,IsGridConfig:!0}},{data:{Name:"Distance",Value:_.material.uniforms.uDistance.value,World:c.uuid,IsGridConfig:!0}}]};f.children||(f.children=[]),f.children.push(w)}const y=h.three.children.filter(w=>w instanceof ta);for(const w of y){const E={data:{Name:"Directional Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Position",Value:JSON.stringify(w.position),World:c.uuid,Light:w.uuid}},{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};f.children||(f.children=[]),f.children.push(E)}const x=h.three.children.filter(w=>w instanceof ea);for(const w of x){const E={data:{Name:"Ambient Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};f.children||(f.children=[]),f.children.push(E)}f.children&&((o=f.children)==null?void 0:o.length)>0&&((s=v.children)==null||s.push(f))}if(p.three instanceof ti){const f={data:{Name:"Perspective Camera"},children:[{data:{Name:"Near Frustum",Value:p.three.near,World:c.uuid}},{data:{Name:"Far Frustum",Value:p.three.far,World:c.uuid}},{data:{Name:"Field of View",Value:p.three.fov,World:c.uuid}}]};if(p.hasCameraControls()){const{controls:y}=p,x={dollyDragInverted:"Invert Drag",dollySpeed:"Dolly Speed",truckSpeed:"Truck Speed",smoothTime:"Smooth Time"};for(const w in x){const E=y[w];E!=null&&((r=f.children)==null||r.push({data:{Name:x[w],Value:E,World:c.uuid}}))}}(a=v.children)==null||a.push(f)}if(g instanceof L){const{postproduction:f}=g,y=f.n8ao.configuration,x={data:{Name:"Renderer"},children:[{data:{Name:"Gamma Correction",Value:f.settings.gamma??!1,World:c.uuid,IsGammaConfig:!0}},{data:{Name:"Ambient Oclussion",Value:f.settings.ao??!1,World:c.uuid,IsAOConfig:!0},children:[{data:{Name:"Samples",Value:y.aoSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Color",Value:`#${y.color.getHexString()}`,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Half Resolution",Value:y.halfRes,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Screen Space Radius",Value:y.screenSpaceRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Radius",Value:y.aoRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Intensity",Value:y.intensity,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Distance Falloff",Value:y.distanceFalloff,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Samples",Value:y.denoiseSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Radius",Value:y.denoiseRadius,World:c.uuid,IsAOConfig:!0}}]},{data:{Name:"Custom Effects",Value:f.settings.custom??!1,World:c.uuid,IsCEConfig:!0},children:[{data:{Name:"Gloss",Value:f.customEffects.glossEnabled,World:c.uuid,IsGlossConfig:!0},children:[{data:{Name:"Min",Value:f.customEffects.minGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Max",Value:f.customEffects.maxGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Exponent",Value:f.customEffects.glossExponent,World:c.uuid,IsGlossConfig:!0}}]},{data:{Name:"Outline",Value:f.customEffects.outlineEnabled,World:c.uuid,IsOutlineConfig:!0},children:[{data:{Name:"Color",get Value(){const w=new ze(f.customEffects.lineColor),E=f.customEffects.opacity;return JSON.stringify({color:`#${w.getHexString()}`,opacity:E})},World:c.uuid,IsOutlineConfig:!0}},{data:{Name:"Tolerance",Value:f.customEffects.tolerance,World:c.uuid,IsOutlineConfig:!0}}]}]}]};(l=v.children)==null||l.push(x)}u.push(v)}d.columns=[{name:"Name",width:"11rem"}],d.hiddenColumns=["World","Light","IsAOConfig","IsCEConfig","IsGlossConfig","IsOutlineConfig","IsGammaConfig","IsGridConfig"],d.data=u})} headers-hidden expanded></bim-table>`},fu=(e,t=!0)=>{const i=B.create(bu,e);if(t){const[n]=i,o=()=>i[1](),{components:s}=e,r=s.get(gn);r.onDisposed.add(n.remove);for(const[,a]of r.list)a.onDisposed.add(o);n.addEventListener("disconnected",()=>{r.onDisposed.remove(n.remove);for(const[,a]of r.list)a.onDisposed.remove(o)})}return i},gu=Object.freeze(Object.defineProperty({__proto__:null,worldsConfiguration:fu},Symbol.toStringTag,{value:"Module"}));({...Ld,...Dd,...Hd,...iu,...au,...gu,..._d,...Ad,...wd});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ci=globalThis,Ei=Ci.trustedTypes,Oo=Ei?Ei.createPolicy("lit-html",{createHTML:e=>e}):void 0,Tr="$lit$",wt=`lit$${Math.random().toFixed(9).slice(2)}$`,Ir="?"+wt,vu=`<${Ir}>`,Ft=document,Le=()=>Ft.createComment(""),je=e=>e===null||typeof e!="object"&&typeof e!="function",Ln=Array.isArray,yu=e=>Ln(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Zi=`[ 	
\f\r]`,we=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,To=/-->/g,Io=/>/g,Pt=RegExp(`>|${Zi}(?:([^\\s"'>=/]+)(${Zi}*=${Zi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),No=/'/g,Po=/"/g,Nr=/^(?:script|style|textarea|title)$/i,_u=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),Pr=_u(1),oe=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Mo=new WeakMap,Lt=Ft.createTreeWalker(Ft,129);function Mr(e,t){if(!Ln(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Oo!==void 0?Oo.createHTML(t):t}const xu=(e,t)=>{const i=e.length-1,n=[];let o,s=t===2?"<svg>":t===3?"<math>":"",r=we;for(let a=0;a<i;a++){const l=e[a];let d,u,c=-1,h=0;for(;h<l.length&&(r.lastIndex=h,u=r.exec(l),u!==null);)h=r.lastIndex,r===we?u[1]==="!--"?r=To:u[1]!==void 0?r=Io:u[2]!==void 0?(Nr.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Pt):u[3]!==void 0&&(r=Pt):r===Pt?u[0]===">"?(r=o??we,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Pt:u[3]==='"'?Po:No):r===Po||r===No?r=Pt:r===To||r===Io?r=we:(r=Pt,o=void 0);const p=r===Pt&&e[a+1].startsWith("/>")?" ":"";s+=r===we?l+vu:c>=0?(n.push(d),l.slice(0,c)+Tr+l.slice(c)+wt+p):l+wt+(c===-2?a:p)}return[Mr(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Re{constructor({strings:t,_$litType$:i},n){let o;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[d,u]=xu(t,i);if(this.el=Re.createElement(d,n),Lt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=Lt.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(Tr)){const h=u[r++],p=o.getAttribute(c).split(wt),g=/([.?@])?(.*)/.exec(h);l.push({type:1,index:s,name:g[2],strings:p,ctor:g[1]==="."?$u:g[1]==="?"?Cu:g[1]==="@"?Eu:Fi}),o.removeAttribute(c)}else c.startsWith(wt)&&(l.push({type:6,index:s}),o.removeAttribute(c));if(Nr.test(o.tagName)){const c=o.textContent.split(wt),h=c.length-1;if(h>0){o.textContent=Ei?Ei.emptyScript:"";for(let p=0;p<h;p++)o.append(c[p],Le()),Lt.nextNode(),l.push({type:2,index:++s});o.append(c[h],Le())}}}else if(o.nodeType===8)if(o.data===Ir)l.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(wt,c+1))!==-1;)l.push({type:7,index:s}),c+=wt.length-1}s++}}static createElement(t,i){const n=Ft.createElement("template");return n.innerHTML=t,n}}function se(e,t,i=e,n){var o,s;if(t===oe)return t;let r=n!==void 0?(o=i.o)==null?void 0:o[n]:i.l;const a=je(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i.o??(i.o=[]))[n]=r:i.l=r),r!==void 0&&(t=se(e,r._$AS(e,t.values),r,n)),t}class wu{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,o=((t==null?void 0:t.creationScope)??Ft).importNode(i,!0);Lt.currentNode=o;let s=Lt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new Qe(s,s.nextSibling,this,t):l.type===1?d=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(d=new Au(s,this,t)),this._$AV.push(d),l=n[++a]}r!==(l==null?void 0:l.index)&&(s=Lt.nextNode(),r++)}return Lt.currentNode=Ft,o}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class Qe{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,i,n,o){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=o,this.v=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=se(this,t,i),je(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yu(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==z&&je(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ft.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Re.createElement(Mr(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(n);else{const r=new wu(s,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=Mo.get(t.strings);return i===void 0&&Mo.set(t.strings,i=new Re(t)),i}k(t){Ln(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,o=0;for(const s of t)o===i.length?i.push(n=new Qe(this.O(Le()),this.O(Le()),this,this.options)):n=i[o],n._$AI(s),o++;o<i.length&&(this._$AR(n&&n._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var i;this._$AM===void 0&&(this.v=t,(i=this._$AP)==null||i.call(this,t))}}class Fi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,o,s){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}_$AI(t,i=this,n,o){const s=this.strings;let r=!1;if(s===void 0)t=se(this,t,i,0),r=!je(t)||t!==this._$AH&&t!==oe,r&&(this._$AH=t);else{const a=t;let l,d;for(t=s[0],l=0;l<s.length-1;l++)d=se(this,a[n+l],i,l),d===oe&&(d=this._$AH[l]),r||(r=!je(d)||d!==this._$AH[l]),d===z?t=z:t!==z&&(t+=(d??"")+s[l+1]),this._$AH[l]=d}r&&!o&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class $u extends Fi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class Cu extends Fi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class Eu extends Fi{constructor(t,i,n,o,s){super(t,i,n,o,s),this.type=5}_$AI(t,i=this){if((t=se(this,t,i,0)??z)===oe)return;const n=this._$AH,o=t===z&&n!==z||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==z&&(n===z||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Au{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){se(this,t)}}const Lo=Ci.litHtmlPolyfillSupport;Lo==null||Lo(Re,Qe),(Ci.litHtmlVersions??(Ci.litHtmlVersions=[])).push("3.2.0");const Su=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let o=n._$litPart$;if(o===void 0){const s=(i==null?void 0:i.renderBefore)??null;n._$litPart$=o=new Qe(t.insertBefore(Le(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ku=()=>new Ou;class Ou{}const Tu=e=>{const{components:t,topic:i,onCancel:n,onSubmit:o,styles:s}=e,r=o??(()=>{}),a=t.get(De),l=(i==null?void 0:i.title)??null,d=(i==null?void 0:i.status)??null,u=(i==null?void 0:i.type)??null,c=(i==null?void 0:i.priority)??null,h=(i==null?void 0:i.assignedTo)??null,p=(i==null?void 0:i.labels)??null,g=(i==null?void 0:i.stage)??null,_=(i==null?void 0:i.description)??null,v=i!=null&&i.dueDate?i.dueDate.toISOString().split("T")[0]:null,f=new Set([...a.config.statuses]);d&&f.add(d);const y=new Set([...a.config.types]);u&&y.add(u);const x=new Set([...a.config.priorities]);c&&x.add(c);const w=new Set([...a.config.users]);h&&w.add(h);const E=new Set([...a.config.labels]);if(p)for(const $ of p)E.add($);const C=new Set([...a.config.stages]);g&&C.add(g);const A=ku(),N=async()=>{const{value:$}=A;if(!$)return;Object.values($.valueTransform).length===0&&($.valueTransform={dueDate:k=>{if(typeof k=="string"&&k.trim()!=="")return new Date(k)},status:k=>{if(Array.isArray(k)&&k.length!==0)return k[0]},type:k=>{if(Array.isArray(k)&&k.length!==0)return k[0]},priority:k=>{if(Array.isArray(k)&&k.length!==0)return k[0]},assignedTo:k=>{if(Array.isArray(k)&&k.length!==0)return k[0]}});const S=$.value;if(i)i.set(S),await r(i);else{const k=a.create(S);await r(k)}};return m`
    <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 22rem;">
      <bim-panel-section ${J(A)} fixed label="New Topic" name="topic">
        <div style="display: flex; gap: 0.375rem">
          <bim-text-input vertical label="Title" name="title" .value=${l}></bim-text-input>
          ${i?m`
              <bim-dropdown vertical label="Status" name="status" required>
                ${[...f].map($=>m`<bim-option label=${$} .checked=${d===$}></bim-option>`)}
              </bim-dropdown>`:m``}
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-dropdown vertical label="Type" name="type" required>
            ${[...y].map($=>m`<bim-option label=${$} .checked=${u===$}></bim-option>`)}
          </bim-dropdown>
          <bim-dropdown vertical label="Priority" name="priority">
            ${[...x].map($=>m`<bim-option label=${$} .checked=${c===$}></bim-option>`)}
          </bim-dropdown>
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-dropdown vertical label="Labels" name="labels" multiple>
            ${[...E].map($=>m`<bim-option label=${$} .checked=${p==null?void 0:p.has($)}></bim-option>`)}
          </bim-dropdown>
          <bim-dropdown vertical label="Assignee" name="assignedTo">
            ${[...w].map($=>{const S=s!=null&&s.users?s.users[$]:null,k=S?S.name:$,U=S==null?void 0:S.picture;return m`<bim-option label=${k} value=${$} .img=${U} .checked=${h===$}></bim-option>`})}
          </bim-dropdown>
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-text-input vertical type="date" label="Due Date" name="dueDate" .value=${v}></bim-text-input> 
          <bim-dropdown vertical label="Stage" name="stage">
            ${[...C].map($=>m`<bim-option label=${$} .checked=${g===$}></bim-option>`)}
          </bim-dropdown>
        </div>
        <bim-text-input vertical label="Description" name="description" type="area" .value=${_??null}></bim-text-input>
        <div style="justify-content: right; display: flex; gap: 0.375rem">
          <style>
            #A7T9K {
              background-color: transparent;
            }

            #A7T9K:hover {
              --bim-label--c: #FF5252;
            }

            #W3F2J:hover {
              background-color: #329936;
            }
          </style>
          <bim-button @click=${n} style="flex: 0" id="A7T9K" label="Cancel"></bim-button>
          <bim-button @click=${N} style="flex: 0" id="W3F2J" label=${i?"Update Topic":"Add Topic"} icon=${i?"tabler:refresh":"mi:add"}></bim-button>
        </div>
      </bim-panel-section>
    </bim-panel>
  `},Iu=e=>B.create(Tu,e),Nu=Object.freeze(Object.defineProperty({__proto__:null,createTopic:Iu},Symbol.toStringTag,{value:"Module"}));({...Nu});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ci=globalThis,jn=ci.ShadowRoot&&(ci.ShadyCSS===void 0||ci.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Rn=Symbol(),jo=new WeakMap;let Lr=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Rn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(jn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=jo.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&jo.set(t,e))}return e}toString(){return this.cssText}};const Pu=e=>new Lr(typeof e=="string"?e:e+"",void 0,Rn),jr=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new Lr(i,e,Rn)},Mu=(e,t)=>{if(jn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),o=ci.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=i.cssText,e.appendChild(n)}},Ro=jn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Pu(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Lu,defineProperty:ju,getOwnPropertyDescriptor:Ru,getOwnPropertyNames:Du,getOwnPropertySymbols:zu,getPrototypeOf:Fu}=Object,re=globalThis,Do=re.trustedTypes,Hu=Do?Do.emptyScript:"",zo=re.reactiveElementPolyfillSupport,Se=(e,t)=>e,Ai={toAttribute(e,t){switch(t){case Boolean:e=e?Hu:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},Dn=(e,t)=>!Lu(e,t),Fo={attribute:!0,type:String,converter:Ai,reflect:!1,hasChanged:Dn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),re.litPropertyMetadata??(re.litPropertyMetadata=new WeakMap);class qt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Fo){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),o=this.getPropertyDescriptor(t,n,i);o!==void 0&&ju(this.prototype,t,o)}}static getPropertyDescriptor(t,i,n){const{get:o,set:s}=Ru(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return o==null?void 0:o.call(this)},set(r){const a=o==null?void 0:o.call(this);s.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Fo}static _$Ei(){if(this.hasOwnProperty(Se("elementProperties")))return;const t=Fu(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Se("properties"))){const i=this.properties,n=[...Du(i),...zu(i)];for(const o of n)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,o]of i)this.elementProperties.set(n,o)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const o=this._$Eu(i,n);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const o of n)i.unshift(Ro(o))}else t!==void 0&&i.push(Ro(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Mu(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:Ai).toAttribute(i,o.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,i){var n;const o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=o.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:Ai;this._$Em=s,this[s]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??Dn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,r]of o)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(o=>{var s;return(s=o.hostUpdate)==null?void 0:s.call(o)}),this.update(n)):this._$EU()}catch(o){throw i=!1,this._$EU(),o}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdated)==null?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}qt.elementStyles=[],qt.shadowRootOptions={mode:"open"},qt[Se("elementProperties")]=new Map,qt[Se("finalized")]=new Map,zo==null||zo({ReactiveElement:qt}),(re.reactiveElementVersions??(re.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Xt extends qt{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const i=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Su(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return oe}}var Ho;Xt._$litElement$=!0,Xt.finalized=!0,(Ho=globalThis.litElementHydrateSupport)==null||Ho.call(globalThis,{LitElement:Xt});const Bo=globalThis.litElementPolyfillSupport;Bo==null||Bo({LitElement:Xt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bu={attribute:!0,type:String,converter:Ai,reflect:!1,hasChanged:Dn},Uu=(e=Bu,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function G(e){return(t,i)=>typeof i=="object"?Uu(e,t,i):((n,o,s)=>{const r=o.hasOwnProperty(s);return o.constructor.createProperty(s,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Vu(e){return G({...e,state:!0,attribute:!1})}class Wu extends ia{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new na(.5,.5),this.addEventListener("removed",function(){this.traverse(function(i){i.element instanceof Element&&i.element.parentNode!==null&&i.element.parentNode.removeChild(i.element)})})}copy(t,i){return super.copy(t,i),this.element=t.element.cloneNode(!0),this.center=t.center,this}}new vn;new Si;new Si;new vn;new vn;class Gu{constructor(t,i){this._group=new zn,this._frustum=new Jr,this._frustumMat=new Si,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new Qr({color:"#2e3338"}),this.numbers=new zn,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._offsetX=0,this._offsetY=0,this._camera=t,this._container=i;const n=this.newGrid(-1),o=this.newGrid(-2);this.grids={main:n,secondary:o},this._group.add(o,n,this.numbers)}set scaleX(t){this._scaleX=t,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(t){this._scaleY=t,this.regenerate()}get scaleY(){return this._scaleY}set offsetX(t){this._offsetX=t,this.regenerate()}get offsetX(){return this._offsetX}set offsetY(t){this._offsetY=t,this.regenerate()}get offsetY(){return this._offsetY}get(){return this._group}dispose(){const{main:t,secondary:i}=this.grids;t.removeFromParent(),i.removeFromParent(),t.geometry.dispose(),t.material.dispose(),i.geometry.dispose(),i.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const t=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(t);const{planes:i}=this._frustum,n=i[0].constant*-i[0].normal.x,o=i[1].constant*-i[1].normal.x,s=i[2].constant*-i[2].normal.y,r=i[3].constant*-i[3].normal.y,a=Math.abs(n-o),l=Math.abs(r-s),{clientWidth:d,clientHeight:u}=this._container,c=Math.max(d,u),h=Math.max(a,l)/c,p=Math.ceil(Math.log10(a/this.scaleX)),g=Math.ceil(Math.log10(l/this.scaleY)),_=10**(p-2)*this.scaleX,v=10**(g-2)*this.scaleY,f=_*this.gridsFactor,y=v*this.gridsFactor,x=Math.ceil(l/y),w=Math.ceil(a/f),E=Math.ceil(l/v),C=Math.ceil(a/_),A=_*Math.ceil(o/_),N=v*Math.ceil(s/v),$=f*Math.ceil(o/f),S=y*Math.ceil(s/y),k=[...this.numbers.children];for(const H of k)H.removeFromParent();this.numbers.children=[];const U=[],vt=9*h,j=1e4,ct=$+this._offsetX,it=Math.round(Math.abs(ct/this.scaleX)*j)/j,nt=(w-1)*f,q=Math.round(Math.abs((ct+nt)/this.scaleX)*j)/j,ot=Math.max(it,q).toString().length*vt;let ge=Math.ceil(ot/f)*f;for(let H=0;H<w;H++){let R=$+H*f;U.push(R,r,0,R,s,0),R=Math.round(R*j)/j,ge=Math.round(ge*j)/j;const ve=R%ge;if(!(f<1||y<1)&&Math.abs(ve)>.01)continue;const Ke=this.newNumber((R+this._offsetX)/this.scaleX),Bi=12*h;Ke.position.set(R,s+Bi,0)}for(let H=0;H<x;H++){const R=S+H*y;U.push(o,R,0,n,R,0);const ve=this.newNumber(R/this.scaleY);let Ke=12;ve.element.textContent&&(Ke+=4*ve.element.textContent.length);const Bi=Ke*h;ve.position.set(o+Bi,R,0)}const Hi=[];for(let H=0;H<C;H++){const R=A+H*_;Hi.push(R,r,0,R,s,0)}for(let H=0;H<E;H++){const R=N+H*v;Hi.push(o,R,0,n,R,0)}const zr=new Fn(new Float32Array(U),3),Fr=new Fn(new Float32Array(Hi),3),{main:Hr,secondary:Br}=this.grids;Hr.geometry.setAttribute("position",zr),Br.geometry.setAttribute("position",Fr)}newNumber(t){const i=document.createElement("bim-label");i.textContent=String(Math.round(t*100)/100);const n=new Wu(i);return this.numbers.add(n),n}newGrid(t){const i=new Zr,n=new Kr(i,this.material);return n.frustumCulled=!1,n.renderOrder=t,n}isGridReady(){const t=this._camera.projectionMatrix.elements;for(let i=0;i<t.length;i++){const n=t[i];if(Number.isNaN(n))return!1}return!0}}var qu=Object.defineProperty,Yu=Object.getOwnPropertyDescriptor,Ze=(e,t,i,n)=>{for(var o=Yu(t,i),s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&qu(t,i,o),o};const Rr=class extends Xt{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(t){if(this._gridColor=t,!(t&&this._grid))return;const i=Number(t.replace("#","0x"));Number.isNaN(i)||this._grid.material.color.setHex(i)}get gridColor(){return this._gridColor}set gridScaleX(t){this._gridScaleX=t,t&&this._grid&&(this._grid.scaleX=t)}get gridScaleX(){return this._gridScaleX}set gridScaleY(t){this._gridScaleY=t,t&&this._grid&&(this._grid.scaleY=t)}get gridScaleY(){return this._gridScaleY}get gridOffsetX(){var t;return((t=this._grid)==null?void 0:t.offsetX)||0}set gridOffsetX(t){this._grid&&(this._grid.offsetX=t)}get gridOffsetY(){var t;return((t=this._grid)==null?void 0:t.offsetY)||0}set gridOffsetY(t){this._grid&&(this._grid.offsetY=t)}set components(t){this.dispose();const i=t.get(gn).create();this._world=i,i.scene=new Ur(t),i.scene.setup(),i.renderer=new da(t,this);const n=new Vr(t);i.camera=n;const o=new Gu(n.threeOrtho,this);this._grid=o,i.scene.three.add(o.get()),n.controls.addEventListener("update",()=>o.regenerate()),setTimeout(async()=>{i.camera.updateAspect(),n.set("Plan"),await n.controls.setLookAt(0,0,100,0,0,0),await n.projection.set("Orthographic"),n.controls.dollySpeed=3,n.controls.draggingSmoothTime=.085,n.controls.maxZoom=1e3,n.controls.zoom(4)})}get world(){return this._world}dispose(){var t;(t=this.world)==null||t.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return Pr`<slot></slot>`}};Rr.styles=jr`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let fe=Rr;Ze([G({type:String,attribute:"grid-color",reflect:!0})],fe.prototype,"gridColor");Ze([G({type:Number,attribute:"grid-scale-x",reflect:!0})],fe.prototype,"gridScaleX");Ze([G({type:Number,attribute:"grid-scale-y",reflect:!0})],fe.prototype,"gridScaleY");Ze([G({type:Number,attribute:"grid-offset-x",reflect:!0})],fe.prototype,"gridOffsetX");Ze([G({type:Number,attribute:"grid-offset-y",reflect:!0})],fe.prototype,"gridOffsetY");var Xu=Object.defineProperty,Tt=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Xu(t,i,o),o};const Dr=class extends Xt{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new Si,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=t=>Math.abs(t)<1e-10?0:t}set camera(t){this._camera=t,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:t}=this._matrix;this._cssMatrix3D=`matrix3d(
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
    `}render(){const t=this.size??this._defaults.size;return Pr`
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
    `}};Dr.styles=jr`
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
  `;let gt=Dr;Tt([G({type:Number,reflect:!0})],gt.prototype,"size");Tt([G({type:String,attribute:"right-text",reflect:!0})],gt.prototype,"rightText");Tt([G({type:String,attribute:"left-text",reflect:!0})],gt.prototype,"leftText");Tt([G({type:String,attribute:"top-text",reflect:!0})],gt.prototype,"topText");Tt([G({type:String,attribute:"bottom-text",reflect:!0})],gt.prototype,"bottomText");Tt([G({type:String,attribute:"front-text",reflect:!0})],gt.prototype,"frontText");Tt([G({type:String,attribute:"back-text",reflect:!0})],gt.prototype,"backText");Tt([Vu()],gt.prototype,"_cssMatrix3D");class eh{static init(){hn.defineCustomElement("bim-view-cube",gt),hn.defineCustomElement("bim-world-2d",fe)}}export{eh as Z};
