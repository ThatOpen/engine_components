import{a as rn,L as wr,i as $r,_ as zt,J as st,E as Er,b as Cr,m as ks,P as Ar,R as Sr,l as kr,X as ri}from"./index-C11PlHsI.js";import{V as an,c as _i,G as Sn,F as Or,L as Tr,d as kn,e as Nr,f as Pr,P as Qe,g as ge,D as Ir,A as Mr,C as Re,O as Lr,h as Rr,I as zr,R as jr,i as Os,j as Ts,k as Hr,l as Ns,m as Dr,n as Br,o as Ps,p as Is,q as Fr}from"./web-ifc-api-CgBULNZm.js";import{X as Ur,r as Vr,$ as M}from"./index-DoGS-bU7.js";var Wr=Object.defineProperty,qr=(e,t,i)=>t in e?Wr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,kt=(e,t,i)=>(qr(e,typeof t!="symbol"?t+"":t,i),i);const Gt=Math.min,lt=Math.max,ai=Math.round,yt=e=>({x:e,y:e}),Gr={left:"right",right:"left",bottom:"top",top:"bottom"},Yr={start:"end",end:"start"};function On(e,t,i){return lt(e,Gt(t,i))}function ze(e,t){return typeof e=="function"?e(t):e}function ct(e){return e.split("-")[0]}function xi(e){return e.split("-")[1]}function Ms(e){return e==="x"?"y":"x"}function Ls(e){return e==="y"?"height":"width"}function Mt(e){return["top","bottom"].includes(ct(e))?"y":"x"}function Rs(e){return Ms(Mt(e))}function Xr(e,t,i){i===void 0&&(i=!1);const n=xi(e),s=Rs(e),o=Ls(s);let r=s==="x"?n===(i?"end":"start")?"right":"left":n==="start"?"bottom":"top";return t.reference[o]>t.floating[o]&&(r=li(r)),[r,li(r)]}function Jr(e){const t=li(e);return[Ui(e),t,Ui(t)]}function Ui(e){return e.replace(/start|end/g,t=>Yr[t])}function Qr(e,t,i){const n=["left","right"],s=["right","left"],o=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return i?t?s:n:t?n:s;case"left":case"right":return t?o:r;default:return[]}}function Zr(e,t,i,n){const s=xi(e);let o=Qr(ct(e),i==="start",n);return s&&(o=o.map(r=>r+"-"+s),t&&(o=o.concat(o.map(Ui)))),o}function li(e){return e.replace(/left|right|bottom|top/g,t=>Gr[t])}function Kr(e){return{top:0,right:0,bottom:0,left:0,...e}}function zs(e){return typeof e!="number"?Kr(e):{top:e,right:e,bottom:e,left:e}}function Yt(e){const{x:t,y:i,width:n,height:s}=e;return{width:n,height:s,top:i,left:t,right:t+n,bottom:i+s,x:t,y:i}}function Tn(e,t,i){let{reference:n,floating:s}=e;const o=Mt(t),r=Rs(t),a=Ls(r),l=ct(t),d=o==="y",h=n.x+n.width/2-s.width/2,c=n.y+n.height/2-s.height/2,u=n[a]/2-s[a]/2;let p;switch(l){case"top":p={x:h,y:n.y-s.height};break;case"bottom":p={x:h,y:n.y+n.height};break;case"right":p={x:n.x+n.width,y:c};break;case"left":p={x:n.x-s.width,y:c};break;default:p={x:n.x,y:n.y}}switch(xi(t)){case"start":p[r]-=u*(i&&d?-1:1);break;case"end":p[r]+=u*(i&&d?-1:1);break}return p}const ta=async(e,t,i)=>{const{placement:n="bottom",strategy:s="absolute",middleware:o=[],platform:r}=i,a=o.filter(Boolean),l=await(r.isRTL==null?void 0:r.isRTL(t));let d=await r.getElementRects({reference:e,floating:t,strategy:s}),{x:h,y:c}=Tn(d,n,l),u=n,p={},b=0;for(let _=0;_<a.length;_++){const{name:g,fn:m}=a[_],{x:v,y:x,data:w,reset:E}=await m({x:h,y:c,initialPlacement:n,placement:u,strategy:s,middlewareData:p,rects:d,platform:r,elements:{reference:e,floating:t}});h=v??h,c=x??c,p={...p,[g]:{...p[g],...w}},E&&b<=50&&(b++,typeof E=="object"&&(E.placement&&(u=E.placement),E.rects&&(d=E.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:s}):E.rects),{x:h,y:c}=Tn(d,u,l)),_=-1)}return{x:h,y:c,placement:u,strategy:s,middlewareData:p}};async function ln(e,t){var i;t===void 0&&(t={});const{x:n,y:s,platform:o,rects:r,elements:a,strategy:l}=e,{boundary:d="clippingAncestors",rootBoundary:h="viewport",elementContext:c="floating",altBoundary:u=!1,padding:p=0}=ze(t,e),b=zs(p),_=a[u?c==="floating"?"reference":"floating":c],g=Yt(await o.getClippingRect({element:(i=await(o.isElement==null?void 0:o.isElement(_)))==null||i?_:_.contextElement||await(o.getDocumentElement==null?void 0:o.getDocumentElement(a.floating)),boundary:d,rootBoundary:h,strategy:l})),m=c==="floating"?{x:n,y:s,width:r.floating.width,height:r.floating.height}:r.reference,v=await(o.getOffsetParent==null?void 0:o.getOffsetParent(a.floating)),x=await(o.isElement==null?void 0:o.isElement(v))?await(o.getScale==null?void 0:o.getScale(v))||{x:1,y:1}:{x:1,y:1},w=Yt(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:m,offsetParent:v,strategy:l}):m);return{top:(g.top-w.top+b.top)/x.y,bottom:(w.bottom-g.bottom+b.bottom)/x.y,left:(g.left-w.left+b.left)/x.x,right:(w.right-g.right+b.right)/x.x}}const ea=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,n;const{placement:s,middlewareData:o,rects:r,initialPlacement:a,platform:l,elements:d}=t,{mainAxis:h=!0,crossAxis:c=!0,fallbackPlacements:u,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:b="none",flipAlignment:_=!0,...g}=ze(e,t);if((i=o.arrow)!=null&&i.alignmentOffset)return{};const m=ct(s),v=Mt(a),x=ct(a)===a,w=await(l.isRTL==null?void 0:l.isRTL(d.floating)),E=u||(x||!_?[li(a)]:Jr(a)),$=b!=="none";!u&&$&&E.push(...Zr(a,_,b,w));const C=[a,...E],P=await ln(t,g),T=[];let S=((n=o.flip)==null?void 0:n.overflows)||[];if(h&&T.push(P[m]),c){const L=Xr(s,r,w);T.push(P[L[0]],P[L[1]])}if(S=[...S,{placement:s,overflows:T}],!T.every(L=>L<=0)){var J,D;const L=(((J=o.flip)==null?void 0:J.index)||0)+1,ot=C[L];if(ot)return{data:{index:L,overflows:S},reset:{placement:ot}};let K=(D=S.filter(tt=>tt.overflows[0]<=0).sort((tt,V)=>tt.overflows[1]-V.overflows[1])[0])==null?void 0:D.placement;if(!K)switch(p){case"bestFit":{var pt;const tt=(pt=S.filter(V=>{if($){const et=Mt(V.placement);return et===v||et==="y"}return!0}).map(V=>[V.placement,V.overflows.filter(et=>et>0).reduce((et,me)=>et+me,0)]).sort((V,et)=>V[1]-et[1])[0])==null?void 0:pt[0];tt&&(K=tt);break}case"initialPlacement":K=a;break}if(s!==K)return{reset:{placement:K}}}return{}}}};function js(e){const t=Gt(...e.map(o=>o.left)),i=Gt(...e.map(o=>o.top)),n=lt(...e.map(o=>o.right)),s=lt(...e.map(o=>o.bottom));return{x:t,y:i,width:n-t,height:s-i}}function ia(e){const t=e.slice().sort((s,o)=>s.y-o.y),i=[];let n=null;for(let s=0;s<t.length;s++){const o=t[s];!n||o.y-n.y>n.height/2?i.push([o]):i[i.length-1].push(o),n=o}return i.map(s=>Yt(js(s)))}const na=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:n,rects:s,platform:o,strategy:r}=t,{padding:a=2,x:l,y:d}=ze(e,t),h=Array.from(await(o.getClientRects==null?void 0:o.getClientRects(n.reference))||[]),c=ia(h),u=Yt(js(h)),p=zs(a);function b(){if(c.length===2&&c[0].left>c[1].right&&l!=null&&d!=null)return c.find(g=>l>g.left-p.left&&l<g.right+p.right&&d>g.top-p.top&&d<g.bottom+p.bottom)||u;if(c.length>=2){if(Mt(i)==="y"){const S=c[0],J=c[c.length-1],D=ct(i)==="top",pt=S.top,L=J.bottom,ot=D?S.left:J.left,K=D?S.right:J.right,tt=K-ot,V=L-pt;return{top:pt,bottom:L,left:ot,right:K,width:tt,height:V,x:ot,y:pt}}const g=ct(i)==="left",m=lt(...c.map(S=>S.right)),v=Gt(...c.map(S=>S.left)),x=c.filter(S=>g?S.left===v:S.right===m),w=x[0].top,E=x[x.length-1].bottom,$=v,C=m,P=C-$,T=E-w;return{top:w,bottom:E,left:$,right:C,width:P,height:T,x:$,y:w}}return u}const _=await o.getElementRects({reference:{getBoundingClientRect:b},floating:n.floating,strategy:r});return s.reference.x!==_.reference.x||s.reference.y!==_.reference.y||s.reference.width!==_.reference.width||s.reference.height!==_.reference.height?{reset:{rects:_}}:{}}}};async function sa(e,t){const{placement:i,platform:n,elements:s}=e,o=await(n.isRTL==null?void 0:n.isRTL(s.floating)),r=ct(i),a=xi(i),l=Mt(i)==="y",d=["left","top"].includes(r)?-1:1,h=o&&l?-1:1,c=ze(t,e);let{mainAxis:u,crossAxis:p,alignmentAxis:b}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...c};return a&&typeof b=="number"&&(p=a==="end"?b*-1:b),l?{x:p*h,y:u*d}:{x:u*d,y:p*h}}const Hs=function(e){return{name:"offset",options:e,async fn(t){var i,n;const{x:s,y:o,placement:r,middlewareData:a}=t,l=await sa(t,e);return r===((i=a.offset)==null?void 0:i.placement)&&(n=a.arrow)!=null&&n.alignmentOffset?{}:{x:s+l.x,y:o+l.y,data:{...l,placement:r}}}}},oa=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:n,placement:s}=t,{mainAxis:o=!0,crossAxis:r=!1,limiter:a={fn:g=>{let{x:m,y:v}=g;return{x:m,y:v}}},...l}=ze(e,t),d={x:i,y:n},h=await ln(t,l),c=Mt(ct(s)),u=Ms(c);let p=d[u],b=d[c];if(o){const g=u==="y"?"top":"left",m=u==="y"?"bottom":"right",v=p+h[g],x=p-h[m];p=On(v,p,x)}if(r){const g=c==="y"?"top":"left",m=c==="y"?"bottom":"right",v=b+h[g],x=b-h[m];b=On(v,b,x)}const _=a.fn({...t,[u]:p,[c]:b});return{..._,data:{x:_.x-i,y:_.y-n}}}}};function _t(e){return Ds(e)?(e.nodeName||"").toLowerCase():"#document"}function B(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function wt(e){var t;return(t=(Ds(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Ds(e){return e instanceof Node||e instanceof B(e).Node}function it(e){return e instanceof Element||e instanceof B(e).Element}function nt(e){return e instanceof HTMLElement||e instanceof B(e).HTMLElement}function Nn(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof B(e).ShadowRoot}function je(e){const{overflow:t,overflowX:i,overflowY:n,display:s}=q(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+i)&&!["inline","contents"].includes(s)}function ra(e){return["table","td","th"].includes(_t(e))}function aa(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function cn(e){const t=dn(),i=it(e)?q(e):e;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(i.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(i.contain||"").includes(n))}function la(e){let t=Xt(e);for(;nt(t)&&!wi(t);){if(cn(t))return t;if(aa(t))return null;t=Xt(t)}return null}function dn(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function wi(e){return["html","body","#document"].includes(_t(e))}function q(e){return B(e).getComputedStyle(e)}function $i(e){return it(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Xt(e){if(_t(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Nn(e)&&e.host||wt(e);return Nn(t)?t.host:t}function Bs(e){const t=Xt(e);return wi(t)?e.ownerDocument?e.ownerDocument.body:e.body:nt(t)&&je(t)?t:Bs(t)}function Vi(e,t,i){var n;t===void 0&&(t=[]),i===void 0&&(i=!0);const s=Bs(e),o=s===((n=e.ownerDocument)==null?void 0:n.body),r=B(s);if(o){const a=ca(r);return t.concat(r,r.visualViewport||[],je(s)?s:[],a&&i?Vi(a):[])}return t.concat(s,Vi(s,[],i))}function ca(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Fs(e){const t=q(e);let i=parseFloat(t.width)||0,n=parseFloat(t.height)||0;const s=nt(e),o=s?e.offsetWidth:i,r=s?e.offsetHeight:n,a=ai(i)!==o||ai(n)!==r;return a&&(i=o,n=r),{width:i,height:n,$:a}}function Us(e){return it(e)?e:e.contextElement}function Vt(e){const t=Us(e);if(!nt(t))return yt(1);const i=t.getBoundingClientRect(),{width:n,height:s,$:o}=Fs(t);let r=(o?ai(i.width):i.width)/n,a=(o?ai(i.height):i.height)/s;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const da=yt(0);function Vs(e){const t=B(e);return!dn()||!t.visualViewport?da:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function ha(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==B(e)?!1:t}function Ae(e,t,i,n){t===void 0&&(t=!1),i===void 0&&(i=!1);const s=e.getBoundingClientRect(),o=Us(e);let r=yt(1);t&&(n?it(n)&&(r=Vt(n)):r=Vt(e));const a=ha(o,i,n)?Vs(o):yt(0);let l=(s.left+a.x)/r.x,d=(s.top+a.y)/r.y,h=s.width/r.x,c=s.height/r.y;if(o){const u=B(o),p=n&&it(n)?B(n):n;let b=u,_=b.frameElement;for(;_&&n&&p!==b;){const g=Vt(_),m=_.getBoundingClientRect(),v=q(_),x=m.left+(_.clientLeft+parseFloat(v.paddingLeft))*g.x,w=m.top+(_.clientTop+parseFloat(v.paddingTop))*g.y;l*=g.x,d*=g.y,h*=g.x,c*=g.y,l+=x,d+=w,b=B(_),_=b.frameElement}}return Yt({width:h,height:c,x:l,y:d})}const ua=[":popover-open",":modal"];function Ws(e){return ua.some(t=>{try{return e.matches(t)}catch{return!1}})}function pa(e){let{elements:t,rect:i,offsetParent:n,strategy:s}=e;const o=s==="fixed",r=wt(n),a=t?Ws(t.floating):!1;if(n===r||a&&o)return i;let l={scrollLeft:0,scrollTop:0},d=yt(1);const h=yt(0),c=nt(n);if((c||!c&&!o)&&((_t(n)!=="body"||je(r))&&(l=$i(n)),nt(n))){const u=Ae(n);d=Vt(n),h.x=u.x+n.clientLeft,h.y=u.y+n.clientTop}return{width:i.width*d.x,height:i.height*d.y,x:i.x*d.x-l.scrollLeft*d.x+h.x,y:i.y*d.y-l.scrollTop*d.y+h.y}}function fa(e){return Array.from(e.getClientRects())}function qs(e){return Ae(wt(e)).left+$i(e).scrollLeft}function ma(e){const t=wt(e),i=$i(e),n=e.ownerDocument.body,s=lt(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),o=lt(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight);let r=-i.scrollLeft+qs(e);const a=-i.scrollTop;return q(n).direction==="rtl"&&(r+=lt(t.clientWidth,n.clientWidth)-s),{width:s,height:o,x:r,y:a}}function ba(e,t){const i=B(e),n=wt(e),s=i.visualViewport;let o=n.clientWidth,r=n.clientHeight,a=0,l=0;if(s){o=s.width,r=s.height;const d=dn();(!d||d&&t==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}return{width:o,height:r,x:a,y:l}}function ga(e,t){const i=Ae(e,!0,t==="fixed"),n=i.top+e.clientTop,s=i.left+e.clientLeft,o=nt(e)?Vt(e):yt(1),r=e.clientWidth*o.x,a=e.clientHeight*o.y,l=s*o.x,d=n*o.y;return{width:r,height:a,x:l,y:d}}function Pn(e,t,i){let n;if(t==="viewport")n=ba(e,i);else if(t==="document")n=ma(wt(e));else if(it(t))n=ga(t,i);else{const s=Vs(e);n={...t,x:t.x-s.x,y:t.y-s.y}}return Yt(n)}function Gs(e,t){const i=Xt(e);return i===t||!it(i)||wi(i)?!1:q(i).position==="fixed"||Gs(i,t)}function va(e,t){const i=t.get(e);if(i)return i;let n=Vi(e,[],!1).filter(a=>it(a)&&_t(a)!=="body"),s=null;const o=q(e).position==="fixed";let r=o?Xt(e):e;for(;it(r)&&!wi(r);){const a=q(r),l=cn(r);!l&&a.position==="fixed"&&(s=null),(o?!l&&!s:!l&&a.position==="static"&&s&&["absolute","fixed"].includes(s.position)||je(r)&&!l&&Gs(e,r))?n=n.filter(d=>d!==r):s=a,r=Xt(r)}return t.set(e,n),n}function ya(e){let{element:t,boundary:i,rootBoundary:n,strategy:s}=e;const o=[...i==="clippingAncestors"?va(t,this._c):[].concat(i),n],r=o[0],a=o.reduce((l,d)=>{const h=Pn(t,d,s);return l.top=lt(h.top,l.top),l.right=Gt(h.right,l.right),l.bottom=Gt(h.bottom,l.bottom),l.left=lt(h.left,l.left),l},Pn(t,r,s));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function _a(e){const{width:t,height:i}=Fs(e);return{width:t,height:i}}function xa(e,t,i){const n=nt(t),s=wt(t),o=i==="fixed",r=Ae(e,!0,o,t);let a={scrollLeft:0,scrollTop:0};const l=yt(0);if(n||!n&&!o)if((_t(t)!=="body"||je(s))&&(a=$i(t)),n){const c=Ae(t,!0,o,t);l.x=c.x+t.clientLeft,l.y=c.y+t.clientTop}else s&&(l.x=qs(s));const d=r.left+a.scrollLeft-l.x,h=r.top+a.scrollTop-l.y;return{x:d,y:h,width:r.width,height:r.height}}function In(e,t){return!nt(e)||q(e).position==="fixed"?null:t?t(e):e.offsetParent}function Ys(e,t){const i=B(e);if(!nt(e)||Ws(e))return i;let n=In(e,t);for(;n&&ra(n)&&q(n).position==="static";)n=In(n,t);return n&&(_t(n)==="html"||_t(n)==="body"&&q(n).position==="static"&&!cn(n))?i:n||la(e)||i}const wa=async function(e){const t=this.getOffsetParent||Ys,i=this.getDimensions;return{reference:xa(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function $a(e){return q(e).direction==="rtl"}const Ea={convertOffsetParentRelativeRectToViewportRelativeRect:pa,getDocumentElement:wt,getClippingRect:ya,getOffsetParent:Ys,getElementRects:wa,getClientRects:fa,getDimensions:_a,getScale:Vt,isElement:it,isRTL:$a},Xs=oa,Js=ea,Qs=na,Zs=(e,t,i)=>{const n=new Map,s={platform:Ea,...i},o={...s.platform,_c:n};return ta(e,t,{...s,platform:o})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ii=globalThis,hn=ii.ShadowRoot&&(ii.ShadyCSS===void 0||ii.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,un=Symbol(),Mn=new WeakMap;let Ks=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==un)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(hn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Mn.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Mn.set(t,e))}return e}toString(){return this.cssText}};const Ca=e=>new Ks(typeof e=="string"?e:e+"",void 0,un),O=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,s,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new Ks(i,e,un)},Aa=(e,t)=>{if(hn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),s=ii.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)}},Ln=hn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Ca(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Sa,defineProperty:ka,getOwnPropertyDescriptor:Oa,getOwnPropertyNames:Ta,getOwnPropertySymbols:Na,getPrototypeOf:Pa}=Object,Jt=globalThis,Rn=Jt.trustedTypes,Ia=Rn?Rn.emptyScript:"",zn=Jt.reactiveElementPolyfillSupport,xe=(e,t)=>e,ci={toAttribute(e,t){switch(t){case Boolean:e=e?Ia:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},pn=(e,t)=>!Sa(e,t),jn={attribute:!0,type:String,converter:ci,reflect:!1,hasChanged:pn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Jt.litPropertyMetadata??(Jt.litPropertyMetadata=new WeakMap);class Ft extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=jn){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),s=this.getPropertyDescriptor(t,n,i);s!==void 0&&ka(this.prototype,t,s)}}static getPropertyDescriptor(t,i,n){const{get:s,set:o}=Oa(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return s==null?void 0:s.call(this)},set(r){const a=s==null?void 0:s.call(this);o.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??jn}static _$Ei(){if(this.hasOwnProperty(xe("elementProperties")))return;const t=Pa(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(xe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(xe("properties"))){const i=this.properties,n=[...Ta(i),...Na(i)];for(const s of n)this.createProperty(s,i[s])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,s]of i)this.elementProperties.set(n,s)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const s=this._$Eu(i,n);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const s of n)i.unshift(Ln(s))}else t!==void 0&&i.push(Ln(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Aa(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const r=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:ci).toAttribute(i,s.type);this._$Em=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(t,i){var n;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const r=s.getPropertyOptions(o),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:ci;this._$Em=o,this[o]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??pn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,r]of s)r.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(n)):this._$EU()}catch(s){throw i=!1,this._$EU(),s}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var s;return(s=n.hostUpdated)==null?void 0:s.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Ft.elementStyles=[],Ft.shadowRootOptions={mode:"open"},Ft[xe("elementProperties")]=new Map,Ft[xe("finalized")]=new Map,zn==null||zn({ReactiveElement:Ft}),(Jt.reactiveElementVersions??(Jt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const di=globalThis,hi=di.trustedTypes,Hn=hi?hi.createPolicy("lit-html",{createHTML:e=>e}):void 0,to="$lit$",bt=`lit$${Math.random().toFixed(9).slice(2)}$`,eo="?"+bt,Ma=`<${eo}>`,Lt=document,Se=()=>Lt.createComment(""),ke=e=>e===null||typeof e!="object"&&typeof e!="function",fn=Array.isArray,La=e=>fn(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ri=`[ 	
\f\r]`,ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Dn=/-->/g,Bn=/>/g,Ot=RegExp(`>|${Ri}(?:([^\\s"'>=/]+)(${Ri}*=${Ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fn=/'/g,Un=/"/g,io=/^(?:script|style|textarea|title)$/i,Ra=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),y=Ra(1),Qt=Symbol.for("lit-noChange"),I=Symbol.for("lit-nothing"),Vn=new WeakMap,Nt=Lt.createTreeWalker(Lt,129);function no(e,t){if(!fn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Hn!==void 0?Hn.createHTML(t):t}const za=(e,t)=>{const i=e.length-1,n=[];let s,o=t===2?"<svg>":t===3?"<math>":"",r=ve;for(let a=0;a<i;a++){const l=e[a];let d,h,c=-1,u=0;for(;u<l.length&&(r.lastIndex=u,h=r.exec(l),h!==null);)u=r.lastIndex,r===ve?h[1]==="!--"?r=Dn:h[1]!==void 0?r=Bn:h[2]!==void 0?(io.test(h[2])&&(s=RegExp("</"+h[2],"g")),r=Ot):h[3]!==void 0&&(r=Ot):r===Ot?h[0]===">"?(r=s??ve,c=-1):h[1]===void 0?c=-2:(c=r.lastIndex-h[2].length,d=h[1],r=h[3]===void 0?Ot:h[3]==='"'?Un:Fn):r===Un||r===Fn?r=Ot:r===Dn||r===Bn?r=ve:(r=Ot,s=void 0);const p=r===Ot&&e[a+1].startsWith("/>")?" ":"";o+=r===ve?l+Ma:c>=0?(n.push(d),l.slice(0,c)+to+l.slice(c)+bt+p):l+bt+(c===-2?a:p)}return[no(e,o+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Oe{constructor({strings:t,_$litType$:i},n){let s;this.parts=[];let o=0,r=0;const a=t.length-1,l=this.parts,[d,h]=za(t,i);if(this.el=Oe.createElement(d,n),Nt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=Nt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(to)){const u=h[r++],p=s.getAttribute(c).split(bt),b=/([.?@])?(.*)/.exec(u);l.push({type:1,index:o,name:b[2],strings:p,ctor:b[1]==="."?Ha:b[1]==="?"?Da:b[1]==="@"?Ba:Ei}),s.removeAttribute(c)}else c.startsWith(bt)&&(l.push({type:6,index:o}),s.removeAttribute(c));if(io.test(s.tagName)){const c=s.textContent.split(bt),u=c.length-1;if(u>0){s.textContent=hi?hi.emptyScript:"";for(let p=0;p<u;p++)s.append(c[p],Se()),Nt.nextNode(),l.push({type:2,index:++o});s.append(c[u],Se())}}}else if(s.nodeType===8)if(s.data===eo)l.push({type:2,index:o});else{let c=-1;for(;(c=s.data.indexOf(bt,c+1))!==-1;)l.push({type:7,index:o}),c+=bt.length-1}o++}}static createElement(t,i){const n=Lt.createElement("template");return n.innerHTML=t,n}}function Zt(e,t,i=e,n){var s,o;if(t===Qt)return t;let r=n!==void 0?(s=i.o)==null?void 0:s[n]:i.l;const a=ke(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((o=r==null?void 0:r._$AO)==null||o.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i.o??(i.o=[]))[n]=r:i.l=r),r!==void 0&&(t=Zt(e,r._$AS(e,t.values),r,n)),t}class ja{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,s=((t==null?void 0:t.creationScope)??Lt).importNode(i,!0);Nt.currentNode=s;let o=Nt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new He(o,o.nextSibling,this,t):l.type===1?d=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(d=new Fa(o,this,t)),this._$AV.push(d),l=n[++a]}r!==(l==null?void 0:l.index)&&(o=Nt.nextNode(),r++)}return Nt.currentNode=Lt,s}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class He{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,i,n,s){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=Zt(this,t,i),ke(t)?t===I||t==null||t===""?(this._$AH!==I&&this._$AR(),this._$AH=I):t!==this._$AH&&t!==Qt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):La(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==I&&ke(this._$AH)?this._$AA.nextSibling.data=t:this.T(Lt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Oe.createElement(no(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===o)this._$AH.p(n);else{const r=new ja(o,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=Vn.get(t.strings);return i===void 0&&Vn.set(t.strings,i=new Oe(t)),i}k(t){fn(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,s=0;for(const o of t)s===i.length?i.push(n=new He(this.O(Se()),this.O(Se()),this,this.options)):n=i[s],n._$AI(o),s++;s<i.length&&(this._$AR(n&&n._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var i;this._$AM===void 0&&(this.v=t,(i=this._$AP)==null||i.call(this,t))}}class Ei{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,s,o){this.type=1,this._$AH=I,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=I}_$AI(t,i=this,n,s){const o=this.strings;let r=!1;if(o===void 0)t=Zt(this,t,i,0),r=!ke(t)||t!==this._$AH&&t!==Qt,r&&(this._$AH=t);else{const a=t;let l,d;for(t=o[0],l=0;l<o.length-1;l++)d=Zt(this,a[n+l],i,l),d===Qt&&(d=this._$AH[l]),r||(r=!ke(d)||d!==this._$AH[l]),d===I?t=I:t!==I&&(t+=(d??"")+o[l+1]),this._$AH[l]=d}r&&!s&&this.j(t)}j(t){t===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ha extends Ei{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===I?void 0:t}}class Da extends Ei{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==I)}}class Ba extends Ei{constructor(t,i,n,s,o){super(t,i,n,s,o),this.type=5}_$AI(t,i=this){if((t=Zt(this,t,i,0)??I)===Qt)return;const n=this._$AH,s=t===I&&n!==I||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==I&&(n===I||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Fa{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Zt(this,t)}}const Wn=di.litHtmlPolyfillSupport;Wn==null||Wn(Oe,He),(di.litHtmlVersions??(di.litHtmlVersions=[])).push("3.2.0");const Kt=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let s=n._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;n._$litPart$=s=new He(t.insertBefore(Se(),o),o,void 0,i??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let k=class extends Ft{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=Kt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return Qt}};var qn;k._$litElement$=!0,k.finalized=!0,(qn=globalThis.litElementHydrateSupport)==null||qn.call(globalThis,{LitElement:k});const Gn=globalThis.litElementPolyfillSupport;Gn==null||Gn({LitElement:k});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ua={attribute:!0,type:String,converter:ci,reflect:!1,hasChanged:pn},Va=(e=Ua,t,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function f(e){return(t,i)=>typeof i=="object"?Va(e,t,i):((n,s,o)=>{const r=s.hasOwnProperty(o);return s.constructor.createProperty(o,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(s,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function se(e){return f({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wa=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qa={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ga=e=>(...t)=>({_$litDirective$:e,values:t});class Ya{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,n){this.t=t,this._$AM=i,this.i=n}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const we=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const s of n)(i=s._$AO)==null||i.call(s,t,!1),we(s,t);return!0},ui=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},so=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Qa(t)}};function Xa(e){this._$AN!==void 0?(ui(this),this._$AM=e,so(this)):this._$AM=e}function Ja(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(n))for(let o=i;o<n.length;o++)we(n[o],!1),ui(n[o]);else n!=null&&(we(n,!1),ui(n));else we(this,e)}const Qa=e=>{e.type==qa.CHILD&&(e._$AP??(e._$AP=Ja),e._$AQ??(e._$AQ=Xa))};class Za extends Ya{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,n){super._$AT(t,i,n),so(this),this.isConnected=t._$AU}_$AO(t,i=!0){var n,s;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(s=this.disconnected)==null||s.call(this)),i&&(we(this,t),ui(this))}setValue(t){if(Wa(this.t))this.t._$AI(t,this);else{const i=[...this.t._$AH];i[this.i]=t,this.t._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wt=()=>new Ka;class Ka{}const zi=new WeakMap,vt=Ga(class extends Za{render(e){return I}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),I}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=zi.get(t);i===void 0&&(i=new WeakMap,zi.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=zi.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const oo=Object.freeze({left:0,top:0,width:16,height:16}),pi=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),De=Object.freeze({...oo,...pi}),Wi=Object.freeze({...De,body:"",hidden:!1}),tl=Object.freeze({width:null,height:null}),ro=Object.freeze({...tl,...pi});function el(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function n(s){for(;s<0;)s+=4;return s%4}if(i===""){const s=parseInt(e);return isNaN(s)?0:n(s)}else if(i!==e){let s=0;switch(i){case"%":s=25;break;case"deg":s=90}if(s){let o=parseFloat(e.slice(0,e.length-i.length));return isNaN(o)?0:(o=o/s,o%1===0?n(o):0)}}return t}const il=/[\s,]+/;function nl(e,t){t.split(il).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const ao={...ro,preserveAspectRatio:""};function Yn(e){const t={...ao},i=(n,s)=>e.getAttribute(n)||s;return t.width=i("width",null),t.height=i("height",null),t.rotate=el(i("rotate","")),nl(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function sl(e,t){for(const i in ao)if(e[i]!==t[i])return!0;return!1}const $e=/^[a-z0-9]+(-[a-z0-9]+)*$/,Be=(e,t,i,n="")=>{const s=e.split(":");if(e.slice(0,1)==="@"){if(s.length<2||s.length>3)return null;n=s.shift().slice(1)}if(s.length>3||!s.length)return null;if(s.length>1){const a=s.pop(),l=s.pop(),d={provider:s.length>0?s[0]:n,prefix:l,name:a};return t&&!ni(d)?null:d}const o=s[0],r=o.split("-");if(r.length>1){const a={provider:n,prefix:r.shift(),name:r.join("-")};return t&&!ni(a)?null:a}if(i&&n===""){const a={provider:n,prefix:"",name:o};return t&&!ni(a,i)?null:a}return null},ni=(e,t)=>e?!!((e.provider===""||e.provider.match($e))&&(t&&e.prefix===""||e.prefix.match($e))&&e.name.match($e)):!1;function ol(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const n=((e.rotate||0)+(t.rotate||0))%4;return n&&(i.rotate=n),i}function Xn(e,t){const i=ol(e,t);for(const n in Wi)n in pi?n in e&&!(n in i)&&(i[n]=pi[n]):n in t?i[n]=t[n]:n in e&&(i[n]=e[n]);return i}function rl(e,t){const i=e.icons,n=e.aliases||Object.create(null),s=Object.create(null);function o(r){if(i[r])return s[r]=[];if(!(r in s)){s[r]=null;const a=n[r]&&n[r].parent,l=a&&o(a);l&&(s[r]=[a].concat(l))}return s[r]}return Object.keys(i).concat(Object.keys(n)).forEach(o),s}function al(e,t,i){const n=e.icons,s=e.aliases||Object.create(null);let o={};function r(a){o=Xn(n[a]||s[a],o)}return r(t),i.forEach(r),Xn(e,o)}function lo(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(s=>{t(s,null),i.push(s)});const n=rl(e);for(const s in n){const o=n[s];o&&(t(s,al(e,s,o)),i.push(s))}return i}const ll={provider:"",aliases:{},not_found:{},...oo};function ji(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function co(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!ji(e,ll))return null;const i=t.icons;for(const s in i){const o=i[s];if(!s.match($e)||typeof o.body!="string"||!ji(o,Wi))return null}const n=t.aliases||Object.create(null);for(const s in n){const o=n[s],r=o.parent;if(!s.match($e)||typeof r!="string"||!i[r]&&!n[r]||!ji(o,Wi))return null}return t}const fi=Object.create(null);function cl(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function xt(e,t){const i=fi[e]||(fi[e]=Object.create(null));return i[t]||(i[t]=cl(e,t))}function mn(e,t){return co(t)?lo(t,(i,n)=>{n?e.icons[i]=n:e.missing.add(i)}):[]}function dl(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function hl(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(fi)).forEach(n=>{(typeof n=="string"&&typeof t=="string"?[t]:Object.keys(fi[n]||{})).forEach(s=>{const o=xt(n,s);i=i.concat(Object.keys(o.icons).map(r=>(n!==""?"@"+n+":":"")+s+":"+r))})}),i}let Te=!1;function ho(e){return typeof e=="boolean"&&(Te=e),Te}function Ne(e){const t=typeof e=="string"?Be(e,!0,Te):e;if(t){const i=xt(t.provider,t.prefix),n=t.name;return i.icons[n]||(i.missing.has(n)?null:void 0)}}function uo(e,t){const i=Be(e,!0,Te);if(!i)return!1;const n=xt(i.provider,i.prefix);return dl(n,i.name,t)}function Jn(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),Te&&!t&&!e.prefix){let s=!1;return co(e)&&(e.prefix="",lo(e,(o,r)=>{r&&uo(o,r)&&(s=!0)})),s}const i=e.prefix;if(!ni({provider:t,prefix:i,name:"a"}))return!1;const n=xt(t,i);return!!mn(n,e)}function Qn(e){return!!Ne(e)}function ul(e){const t=Ne(e);return t?{...De,...t}:null}function pl(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((s,o)=>s.provider!==o.provider?s.provider.localeCompare(o.provider):s.prefix!==o.prefix?s.prefix.localeCompare(o.prefix):s.name.localeCompare(o.name));let n={provider:"",prefix:"",name:""};return e.forEach(s=>{if(n.name===s.name&&n.prefix===s.prefix&&n.provider===s.provider)return;n=s;const o=s.provider,r=s.prefix,a=s.name,l=i[o]||(i[o]=Object.create(null)),d=l[r]||(l[r]=xt(o,r));let h;a in d.icons?h=t.loaded:r===""||d.missing.has(a)?h=t.missing:h=t.pending;const c={provider:o,prefix:r,name:a};h.push(c)}),t}function po(e,t){e.forEach(i=>{const n=i.loaderCallbacks;n&&(i.loaderCallbacks=n.filter(s=>s.id!==t))})}function fl(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const n=e.provider,s=e.prefix;t.forEach(o=>{const r=o.icons,a=r.pending.length;r.pending=r.pending.filter(l=>{if(l.prefix!==s)return!0;const d=l.name;if(e.icons[d])r.loaded.push({provider:n,prefix:s,name:d});else if(e.missing.has(d))r.missing.push({provider:n,prefix:s,name:d});else return i=!0,!0;return!1}),r.pending.length!==a&&(i||po([e],o.id),o.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),o.abort))})}))}let ml=0;function bl(e,t,i){const n=ml++,s=po.bind(null,i,n);if(!t.pending.length)return s;const o={id:n,icons:t,callback:e,abort:s};return i.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(o)}),s}const qi=Object.create(null);function Zn(e,t){qi[e]=t}function Gi(e){return qi[e]||qi[""]}function gl(e,t=!0,i=!1){const n=[];return e.forEach(s=>{const o=typeof s=="string"?Be(s,t,i):s;o&&n.push(o)}),n}var vl={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function yl(e,t,i,n){const s=e.resources.length,o=e.random?Math.floor(Math.random()*s):e.index;let r;if(e.random){let $=e.resources.slice(0);for(r=[];$.length>1;){const C=Math.floor(Math.random()*$.length);r.push($[C]),$=$.slice(0,C).concat($.slice(C+1))}r=r.concat($)}else r=e.resources.slice(o).concat(e.resources.slice(0,o));const a=Date.now();let l="pending",d=0,h,c=null,u=[],p=[];typeof n=="function"&&p.push(n);function b(){c&&(clearTimeout(c),c=null)}function _(){l==="pending"&&(l="aborted"),b(),u.forEach($=>{$.status==="pending"&&($.status="aborted")}),u=[]}function g($,C){C&&(p=[]),typeof $=="function"&&p.push($)}function m(){return{startTime:a,payload:t,status:l,queriesSent:d,queriesPending:u.length,subscribe:g,abort:_}}function v(){l="failed",p.forEach($=>{$(void 0,h)})}function x(){u.forEach($=>{$.status==="pending"&&($.status="aborted")}),u=[]}function w($,C,P){const T=C!=="success";switch(u=u.filter(S=>S!==$),l){case"pending":break;case"failed":if(T||!e.dataAfterTimeout)return;break;default:return}if(C==="abort"){h=P,v();return}if(T){h=P,u.length||(r.length?E():v());return}if(b(),x(),!e.random){const S=e.resources.indexOf($.resource);S!==-1&&S!==e.index&&(e.index=S)}l="completed",p.forEach(S=>{S(P)})}function E(){if(l!=="pending")return;b();const $=r.shift();if($===void 0){if(u.length){c=setTimeout(()=>{b(),l==="pending"&&(x(),v())},e.timeout);return}v();return}const C={status:"pending",resource:$,callback:(P,T)=>{w(C,P,T)}};u.push(C),d++,c=setTimeout(E,e.rotate),i($,t,C.callback)}return setTimeout(E),m}function fo(e){const t={...vl,...e};let i=[];function n(){i=i.filter(r=>r().status==="pending")}function s(r,a,l){const d=yl(t,r,a,(h,c)=>{n(),l&&l(h,c)});return i.push(d),d}function o(r){return i.find(a=>r(a))||null}return{query:s,find:o,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:n}}function bn(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Ci=Object.create(null),Ze=["https://api.simplesvg.com","https://api.unisvg.com"],Yi=[];for(;Ze.length>0;)Ze.length===1||Math.random()>.5?Yi.push(Ze.shift()):Yi.push(Ze.pop());Ci[""]=bn({resources:["https://api.iconify.design"].concat(Yi)});function Kn(e,t){const i=bn(t);return i===null?!1:(Ci[e]=i,!0)}function Ai(e){return Ci[e]}function _l(){return Object.keys(Ci)}function ts(){}const Hi=Object.create(null);function xl(e){if(!Hi[e]){const t=Ai(e);if(!t)return;const i=fo(t),n={config:t,redundancy:i};Hi[e]=n}return Hi[e]}function mo(e,t,i){let n,s;if(typeof e=="string"){const o=Gi(e);if(!o)return i(void 0,424),ts;s=o.send;const r=xl(e);r&&(n=r.redundancy)}else{const o=bn(e);if(o){n=fo(o);const r=e.resources?e.resources[0]:"",a=Gi(r);a&&(s=a.send)}}return!n||!s?(i(void 0,424),ts):n.query(t,s,i)().abort}const es="iconify2",Pe="iconify",bo=Pe+"-count",is=Pe+"-version",go=36e5,wl=168,$l=50;function Xi(e,t){try{return e.getItem(t)}catch{}}function gn(e,t,i){try{return e.setItem(t,i),!0}catch{}}function ns(e,t){try{e.removeItem(t)}catch{}}function Ji(e,t){return gn(e,bo,t.toString())}function Qi(e){return parseInt(Xi(e,bo))||0}const It={local:!0,session:!0},vo={local:new Set,session:new Set};let vn=!1;function El(e){vn=e}let Ke=typeof window>"u"?{}:window;function yo(e){const t=e+"Storage";try{if(Ke&&Ke[t]&&typeof Ke[t].length=="number")return Ke[t]}catch{}It[e]=!1}function _o(e,t){const i=yo(e);if(!i)return;const n=Xi(i,is);if(n!==es){if(n){const a=Qi(i);for(let l=0;l<a;l++)ns(i,Pe+l.toString())}gn(i,is,es),Ji(i,0);return}const s=Math.floor(Date.now()/go)-wl,o=a=>{const l=Pe+a.toString(),d=Xi(i,l);if(typeof d=="string"){try{const h=JSON.parse(d);if(typeof h=="object"&&typeof h.cached=="number"&&h.cached>s&&typeof h.provider=="string"&&typeof h.data=="object"&&typeof h.data.prefix=="string"&&t(h,a))return!0}catch{}ns(i,l)}};let r=Qi(i);for(let a=r-1;a>=0;a--)o(a)||(a===r-1?(r--,Ji(i,r)):vo[e].add(a))}function xo(){if(!vn){El(!0);for(const e in It)_o(e,t=>{const i=t.data,n=t.provider,s=i.prefix,o=xt(n,s);if(!mn(o,i).length)return!1;const r=i.lastModified||-1;return o.lastModifiedCached=o.lastModifiedCached?Math.min(o.lastModifiedCached,r):r,!0})}}function Cl(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const n in It)_o(n,s=>{const o=s.data;return s.provider!==e.provider||o.prefix!==e.prefix||o.lastModified===t});return!0}function Al(e,t){vn||xo();function i(n){let s;if(!It[n]||!(s=yo(n)))return;const o=vo[n];let r;if(o.size)o.delete(r=Array.from(o).shift());else if(r=Qi(s),r>=$l||!Ji(s,r+1))return;const a={cached:Math.floor(Date.now()/go),provider:e.provider,data:t};return gn(s,Pe+r.toString(),JSON.stringify(a))}t.lastModified&&!Cl(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function ss(){}function Sl(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,fl(e)}))}function kl(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:n}=e,s=e.iconsToLoad;delete e.iconsToLoad;let o;!s||!(o=Gi(i))||o.prepare(i,n,s).forEach(r=>{mo(i,r,a=>{if(typeof a!="object")r.icons.forEach(l=>{e.missing.add(l)});else try{const l=mn(e,a);if(!l.length)return;const d=e.pendingIcons;d&&l.forEach(h=>{d.delete(h)}),Al(e,a)}catch(l){console.error(l)}Sl(e)})})}))}const yn=(e,t)=>{const i=gl(e,!0,ho()),n=pl(i);if(!n.pending.length){let l=!0;return t&&setTimeout(()=>{l&&t(n.loaded,n.missing,n.pending,ss)}),()=>{l=!1}}const s=Object.create(null),o=[];let r,a;return n.pending.forEach(l=>{const{provider:d,prefix:h}=l;if(h===a&&d===r)return;r=d,a=h,o.push(xt(d,h));const c=s[d]||(s[d]=Object.create(null));c[h]||(c[h]=[])}),n.pending.forEach(l=>{const{provider:d,prefix:h,name:c}=l,u=xt(d,h),p=u.pendingIcons||(u.pendingIcons=new Set);p.has(c)||(p.add(c),s[d][h].push(c))}),o.forEach(l=>{const{provider:d,prefix:h}=l;s[d][h].length&&kl(l,s[d][h])}),t?bl(t,n,o):ss},Ol=e=>new Promise((t,i)=>{const n=typeof e=="string"?Be(e,!0):e;if(!n){i(e);return}yn([n||e],s=>{if(s.length&&n){const o=Ne(n);if(o){t({...De,...o});return}}i(e)})});function Tl(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function Nl(e,t){const i=typeof e=="string"?Be(e,!0,!0):null;if(!i){const o=Tl(e);return{value:e,data:o}}const n=Ne(i);if(n!==void 0||!i.prefix)return{value:e,name:i,data:n};const s=yn([i],()=>t(e,i,Ne(i)));return{value:e,name:i,loading:s}}function Di(e){return e.hasAttribute("inline")}let wo=!1;try{wo=navigator.vendor.indexOf("Apple")===0}catch{}function Pl(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(wo||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const Il=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Ml=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function Zi(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const n=e.split(Il);if(n===null||!n.length)return e;const s=[];let o=n.shift(),r=Ml.test(o);for(;;){if(r){const a=parseFloat(o);isNaN(a)?s.push(o):s.push(Math.ceil(a*t*i)/i)}else s.push(o);if(o=n.shift(),o===void 0)return s.join("");r=!r}}function Ll(e,t="defs"){let i="";const n=e.indexOf("<"+t);for(;n>=0;){const s=e.indexOf(">",n),o=e.indexOf("</"+t);if(s===-1||o===-1)break;const r=e.indexOf(">",o);if(r===-1)break;i+=e.slice(s+1,o).trim(),e=e.slice(0,n).trim()+e.slice(r+1)}return{defs:i,content:e}}function Rl(e,t){return e?"<defs>"+e+"</defs>"+t:t}function zl(e,t,i){const n=Ll(e);return Rl(n.defs,t+n.content+i)}const jl=e=>e==="unset"||e==="undefined"||e==="none";function $o(e,t){const i={...De,...e},n={...ro,...t},s={left:i.left,top:i.top,width:i.width,height:i.height};let o=i.body;[i,n].forEach(_=>{const g=[],m=_.hFlip,v=_.vFlip;let x=_.rotate;m?v?x+=2:(g.push("translate("+(s.width+s.left).toString()+" "+(0-s.top).toString()+")"),g.push("scale(-1 1)"),s.top=s.left=0):v&&(g.push("translate("+(0-s.left).toString()+" "+(s.height+s.top).toString()+")"),g.push("scale(1 -1)"),s.top=s.left=0);let w;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:w=s.height/2+s.top,g.unshift("rotate(90 "+w.toString()+" "+w.toString()+")");break;case 2:g.unshift("rotate(180 "+(s.width/2+s.left).toString()+" "+(s.height/2+s.top).toString()+")");break;case 3:w=s.width/2+s.left,g.unshift("rotate(-90 "+w.toString()+" "+w.toString()+")");break}x%2===1&&(s.left!==s.top&&(w=s.left,s.left=s.top,s.top=w),s.width!==s.height&&(w=s.width,s.width=s.height,s.height=w)),g.length&&(o=zl(o,'<g transform="'+g.join(" ")+'">',"</g>"))});const r=n.width,a=n.height,l=s.width,d=s.height;let h,c;r===null?(c=a===null?"1em":a==="auto"?d:a,h=Zi(c,l/d)):(h=r==="auto"?l:r,c=a===null?Zi(h,d/l):a==="auto"?d:a);const u={},p=(_,g)=>{jl(g)||(u[_]=g.toString())};p("width",h),p("height",c);const b=[s.left,s.top,l,d];return u.viewBox=b.join(" "),{attributes:u,viewBox:b,body:o}}function _n(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const n in t)i+=" "+n+'="'+t[n]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function Hl(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Dl(e){return"data:image/svg+xml,"+Hl(e)}function Eo(e){return'url("'+Dl(e)+'")'}const Bl=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let mi=Bl();function Fl(e){mi=e}function Ul(){return mi}function Vl(e,t){const i=Ai(e);if(!i)return 0;let n;if(!i.maxURL)n=0;else{let s=0;i.resources.forEach(r=>{s=Math.max(s,r.length)});const o=t+".json?icons=";n=i.maxURL-s-i.path.length-o.length}return n}function Wl(e){return e===404}const ql=(e,t,i)=>{const n=[],s=Vl(e,t),o="icons";let r={type:o,provider:e,prefix:t,icons:[]},a=0;return i.forEach((l,d)=>{a+=l.length+1,a>=s&&d>0&&(n.push(r),r={type:o,provider:e,prefix:t,icons:[]},a=l.length),r.icons.push(l)}),n.push(r),n};function Gl(e){if(typeof e=="string"){const t=Ai(e);if(t)return t.path}return"/"}const Yl=(e,t,i)=>{if(!mi){i("abort",424);return}let n=Gl(t.provider);switch(t.type){case"icons":{const o=t.prefix,r=t.icons.join(","),a=new URLSearchParams({icons:r});n+=o+".json?"+a.toString();break}case"custom":{const o=t.uri;n+=o.slice(0,1)==="/"?o.slice(1):o;break}default:i("abort",400);return}let s=503;mi(e+n).then(o=>{const r=o.status;if(r!==200){setTimeout(()=>{i(Wl(r)?"abort":"next",r)});return}return s=501,o.json()}).then(o=>{if(typeof o!="object"||o===null){setTimeout(()=>{o===404?i("abort",o):i("next",s)});return}setTimeout(()=>{i("success",o)})}).catch(()=>{i("next",s)})},Xl={prepare:ql,send:Yl};function os(e,t){switch(e){case"local":case"session":It[e]=t;break;case"all":for(const i in It)It[i]=t;break}}const Bi="data-style";let Co="";function Jl(e){Co=e}function rs(e,t){let i=Array.from(e.childNodes).find(n=>n.hasAttribute&&n.hasAttribute(Bi));i||(i=document.createElement("style"),i.setAttribute(Bi,Bi),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+Co}function Ao(){Zn("",Xl),ho(!0);let e;try{e=window}catch{}if(e){if(xo(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(n=>{try{(typeof n!="object"||n===null||n instanceof Array||typeof n.icons!="object"||typeof n.prefix!="string"||!Jn(n))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const n="IconifyProviders["+i+"] is invalid.";try{const s=t[i];if(typeof s!="object"||!s||s.resources===void 0)continue;Kn(i,s)||console.error(n)}catch{console.error(n)}}}}return{enableCache:t=>os(t,!0),disableCache:t=>os(t,!1),iconLoaded:Qn,iconExists:Qn,getIcon:ul,listIcons:hl,addIcon:uo,addCollection:Jn,calculateSize:Zi,buildIcon:$o,iconToHTML:_n,svgToURL:Eo,loadIcons:yn,loadIcon:Ol,addAPIProvider:Kn,appendCustomStyle:Jl,_api:{getAPIConfig:Ai,setAPIModule:Zn,sendAPIQuery:mo,setFetch:Fl,getFetch:Ul,listAPIProviders:_l}}}const Ki={"background-color":"currentColor"},So={"background-color":"transparent"},as={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},ls={"-webkit-mask":Ki,mask:Ki,background:So};for(const e in ls){const t=ls[e];for(const i in as)t[e+"-"+i]=as[i]}function cs(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Ql(e,t,i){const n=document.createElement("span");let s=e.body;s.indexOf("<a")!==-1&&(s+="<!-- "+Date.now()+" -->");const o=e.attributes,r=_n(s,{...o,width:t.width+"",height:t.height+""}),a=Eo(r),l=n.style,d={"--svg":a,width:cs(o.width),height:cs(o.height),...i?Ki:So};for(const h in d)l.setProperty(h,d[h]);return n}let Ee;function Zl(){try{Ee=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{Ee=null}}function Kl(e){return Ee===void 0&&Zl(),Ee?Ee.createHTML(e):e}function tc(e){const t=document.createElement("span"),i=e.attributes;let n="";i.width||(n="width: inherit;"),i.height||(n+="height: inherit;"),n&&(i.style=n);const s=_n(e.body,i);return t.innerHTML=Kl(s),t.firstChild}function tn(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function ds(e,t){const i=t.icon.data,n=t.customisations,s=$o(i,n);n.preserveAspectRatio&&(s.attributes.preserveAspectRatio=n.preserveAspectRatio);const o=t.renderedMode;let r;switch(o){case"svg":r=tc(s);break;default:r=Ql(s,{...De,...i},o==="mask")}const a=tn(e);a?r.tagName==="SPAN"&&a.tagName===r.tagName?a.setAttribute("style",r.getAttribute("style")):e.replaceChild(r,a):e.appendChild(r)}function hs(e,t,i){const n=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:n}}function ec(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const n=t.get(e);if(n)return n;const s=["icon","mode","inline","observe","width","height","rotate","flip"],o=class extends i{constructor(){super(),kt(this,"_shadowRoot"),kt(this,"_initialised",!1),kt(this,"_state"),kt(this,"_checkQueued",!1),kt(this,"_connected",!1),kt(this,"_observer",null),kt(this,"_visible",!0);const a=this._shadowRoot=this.attachShadow({mode:"open"}),l=Di(this);rs(a,l),this._state=hs({value:""},l),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return s.slice(0)}attributeChangedCallback(a){switch(a){case"inline":{const l=Di(this),d=this._state;l!==d.inline&&(d.inline=l,rs(this._shadowRoot,l));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const a=this.getAttribute("icon");if(a&&a.slice(0,1)==="{")try{return JSON.parse(a)}catch{}return a}set icon(a){typeof a=="object"&&(a=JSON.stringify(a)),this.setAttribute("icon",a)}get inline(){return Di(this)}set inline(a){a?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(a){a?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const a=this._state;if(a.rendered){const l=this._shadowRoot;if(a.renderedMode==="svg")try{l.lastChild.setCurrentTime(0);return}catch{}ds(l,a)}}get status(){const a=this._state;return a.rendered?"rendered":a.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const a=this._state,l=this.getAttribute("icon");if(l!==a.icon.value){this._iconChanged(l);return}if(!a.rendered||!this._visible)return;const d=this.getAttribute("mode"),h=Yn(this);(a.attrMode!==d||sl(a.customisations,h)||!tn(this._shadowRoot))&&this._renderIcon(a.icon,h,d)}_iconChanged(a){const l=Nl(a,(d,h,c)=>{const u=this._state;if(u.rendered||this.getAttribute("icon")!==d)return;const p={value:d,name:h,data:c};p.data?this._gotIconData(p):u.icon=p});l.data?this._gotIconData(l):this._state=hs(l,this._state.inline,this._state)}_forceRender(){if(!this._visible){const a=tn(this._shadowRoot);a&&this._shadowRoot.removeChild(a);return}this._queueCheck()}_gotIconData(a){this._checkQueued=!1,this._renderIcon(a,Yn(this),this.getAttribute("mode"))}_renderIcon(a,l,d){const h=Pl(a.data.body,d),c=this._state.inline;ds(this._shadowRoot,this._state={rendered:!0,icon:a,inline:c,customisations:l,attrMode:d,renderedMode:h})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(a=>{const l=a.some(d=>d.isIntersecting);l!==this._visible&&(this._visible=l,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};s.forEach(a=>{a in o.prototype||Object.defineProperty(o.prototype,a,{get:function(){return this.getAttribute(a)},set:function(l){l!==null?this.setAttribute(a,l):this.removeAttribute(a)}})});const r=Ao();for(const a in r)o[a]=o.prototype[a]=r[a];return t.define(e,o),o}ec()||Ao();var ic=Object.defineProperty,nc=Object.getOwnPropertyDescriptor,Q=(e,t,i,n)=>{for(var s=n>1?void 0:n?nc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&ic(t,i,s),s},ti;const G=(ti=class extends k{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=Wt(),this._tooltip=Wt(),this._contextMenu=Wt(),this._mouseLeave=!1,this.onWindowMouseUp=e=>{const{value:t}=this._contextMenu;!this.contains(e.target)&&t&&(t.visible=!1)},this.onClick=e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.mouseLeave=!0}set loading(e){if(this._loading=e,e)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=e,this.icon="eos-icons:loading";else{const{disabled:t,icon:i}=this._stateBeforeLoading;this.disabled=t,this.icon=i}}get loading(){return this._loading}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&Zs(e,t,{placement:"bottom",middleware:[Hs(10),Qs(),Js(),Xs({padding:5})]}).then(i=>{const{x:n,y:s}=i;Object.assign(t.style,{left:`${n}px`,top:`${s}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}onChildrenClick(e){e.stopPropagation();const{value:t}=this._contextMenu;t&&(t.visible=!t.visible)}onSlotChange(e){const{value:t}=this._contextMenu,i=e.target.assignedElements();for(const n of i){if(!(n instanceof ti)){n.remove(),console.warn("Only bim-button is allowed inside bim-button. Child has been removed.");continue}n.addEventListener("click",()=>t==null?void 0:t.updatePosition())}this.requestUpdate()}click(){this.disabled||super.click()}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){const e=y`
      <div ${vt(this._tooltip)} class="tooltip">
        ${this.tooltipTitle?y`<p style="text-wrap: nowrap;">
              <strong>${this.tooltipTitle}</strong>
            </p>`:null}
        ${this.tooltipText?y`<p style="width: 9rem;">${this.tooltipText}</p>`:null}
      </div>
    `,t=this.children.length>0;return y`
      <div ${vt(this._parent)} class="parent" @click=${this.onClick}>
        ${this.label||this.icon?y`
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
        ${t?y`
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
          ${vt(this._contextMenu)}
          style="row-gap: var(--bim-ui_size-4xs)"
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </bim-context-menu>
      </div>
    `}},ti.styles=O`
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
  `,ti);Q([f({type:String,reflect:!0})],G.prototype,"label",2);Q([f({type:Boolean,attribute:"label-hidden",reflect:!0})],G.prototype,"labelHidden",2);Q([f({type:Boolean,reflect:!0})],G.prototype,"active",2);Q([f({type:Boolean,reflect:!0,attribute:"disabled"})],G.prototype,"disabled",2);Q([f({type:String,reflect:!0})],G.prototype,"icon",2);Q([f({type:Boolean,reflect:!0})],G.prototype,"vertical",2);Q([f({type:Number,attribute:"tooltip-time",reflect:!0})],G.prototype,"tooltipTime",2);Q([f({type:Boolean,attribute:"tooltip-visible",reflect:!0})],G.prototype,"tooltipVisible",2);Q([f({type:String,attribute:"tooltip-title",reflect:!0})],G.prototype,"tooltipTitle",2);Q([f({type:String,attribute:"tooltip-text",reflect:!0})],G.prototype,"tooltipText",2);Q([f({type:Boolean,reflect:!0})],G.prototype,"loading",1);let sc=G;var oc=Object.defineProperty,Fe=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&oc(t,i,s),s};const ko=class extends k{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(e){e.stopPropagation(),this.checked=e.target.checked,this.dispatchEvent(this.onValueChange)}render(){return y`
      <div class="parent">
        ${this.label?y`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};ko.styles=O`
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
  `;let oe=ko;Fe([f({type:String,reflect:!0})],oe.prototype,"icon");Fe([f({type:String,reflect:!0})],oe.prototype,"name");Fe([f({type:String,reflect:!0})],oe.prototype,"label");Fe([f({type:Boolean,reflect:!0})],oe.prototype,"checked");Fe([f({type:Boolean,reflect:!0})],oe.prototype,"inverted");var rc=Object.defineProperty,re=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&rc(t,i,s),s};const Oo=class extends k{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=Wt(),this._textInput=Wt(),this.onValueChange=new Event("input"),this.onOpacityInput=e=>{const t=e.target;this.opacity=t.value,this.dispatchEvent(this.onValueChange)}}set value(e){const{color:t,opacity:i}=e;this.color=t,i&&(this.opacity=i)}get value(){const e={color:this.color};return this.opacity&&(e.opacity=this.opacity),e}onColorInput(e){e.stopPropagation();const{value:t}=this._colorInput;t&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}onTextInput(e){e.stopPropagation();const{value:t}=this._textInput;if(!t)return;const{value:i}=t;let n=i.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),t.value=n.slice(0,7),t.value.length===7&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:e}=this._colorInput;e&&e.click()}render(){return y`
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
                ${vt(this._colorInput)}
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
                ${vt(this._textInput)}
                @input="${this.onTextInput}"
                value="${this.color}"
                type="text"
                aria-label=${this.label||this.name||"Text Color Input"}
              />
            </div>
            ${this.opacity!==void 0?y`<bim-number-input
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
    `}};Oo.styles=O`
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
  `;let jt=Oo;re([f({type:String,reflect:!0})],jt.prototype,"name");re([f({type:String,reflect:!0})],jt.prototype,"label");re([f({type:String,reflect:!0})],jt.prototype,"icon");re([f({type:Boolean,reflect:!0})],jt.prototype,"vertical");re([f({type:Number,reflect:!0})],jt.prototype,"opacity");re([f({type:String,reflect:!0})],jt.prototype,"color");const ac=O`
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
`,lc=O`
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
`,Ht={scrollbar:ac,globalStyles:lc};var cc=Object.defineProperty,dc=Object.getOwnPropertyDescriptor,hc=(e,t,i,n)=>{for(var s=dc(t,i),o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&cc(t,i,s),s};const To=class extends k{constructor(){super(...arguments),this._visible=!1,this._middleware={name:"middleware",async fn(e){const{right:t,top:i}=await ln(e);return e.x-=Math.sign(t)===1?t+5:0,e.y-=Math.sign(i)===1?i+5:0,e}}}get visible(){return this._visible}set visible(e){this._visible=e,e&&this.updatePosition()}async updatePosition(e){const t=e||this.parentNode;if(!t){this.visible=!1,console.warn("No target element found for context-menu.");return}const i=await Zs(t,this,{placement:"right",middleware:[Hs(10),Qs(),Js(),Xs({padding:5}),this._middleware]}),{x:n,y:s}=i;this.style.left=`${n}px`,this.style.top=`${s}px`}render(){return y` <slot></slot> `}};To.styles=[Ht.scrollbar,O`
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
    `];let No=To;hc([f({type:Boolean,reflect:!0})],No.prototype,"visible");class $t extends k{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const n of t)this.elements.add(n);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const n of i)n.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const n=i[0];if(!n.isIntersecting)return;const s=n.target;t.unobserve(s);const o=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][o];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,n=[...this.elements][i];n&&t.observe(n)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const n=document.createDocumentFragment();if(t.length===0)return Kt(t(),n),n.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let s=i;const o=t,r=a=>(s={...s,...a},Kt(o(s),n),s);return r(i),[n.firstElementChild,r]}}const bi=(e,t=!0)=>{let i={};for(const n of e.children){const s=n,o=s.getAttribute("name")||s.getAttribute("label");if(o){if("value"in s){const r=s.value;if(typeof r=="object"&&!Array.isArray(r)&&Object.keys(r).length===0)continue;i[o]=s.value}else if(t){const r=bi(s);if(Object.keys(r).length===0)continue;i[o]=r}}else t&&(i={...i,...bi(s)})}return i},Si=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,uc=[">=","<=","=",">","<","?","/","#"];function us(e){const t=uc.find(r=>e.split(r).length===2),i=e.split(t).map(r=>r.trim()),[n,s]=i,o=s.startsWith("'")&&s.endsWith("'")?s.replace(/'/g,""):Si(s);return{key:n,condition:t,value:o}}const en=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(n=>n.trim());for(const n of i){const s=!n.startsWith("(")&&!n.endsWith(")"),o=n.startsWith("(")&&n.endsWith(")");if(s){const r=us(n);t.push(r)}if(o){const r={operator:"&",queries:n.replace(/^(\()|(\))$/g,"").split("&").map(a=>a.trim()).map((a,l)=>{const d=us(a);return l>0&&(d.operator="&"),d})};t.push(r)}}return t}catch{return null}},ps=(e,t,i)=>{let n=!1;switch(t){case"=":n=e===i;break;case"?":n=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(n=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(n=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(n=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(n=e>=i);break;case"/":n=String(e).startsWith(String(i));break}return n};var pc=Object.defineProperty,fc=Object.getOwnPropertyDescriptor,Et=(e,t,i,n)=>{for(var s=n>1?void 0:n?fc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&pc(t,i,s),s};const Po=class extends k{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Si(this.label):this.label}set value(e){this._value=e}render(){return y`
      <div class="parent" .title=${this.label??""}>
        ${this.img||this.icon||this.label?y` <div style="display: flex; column-gap: 0.375rem">
              ${this.checkbox&&!this.noMark?y`<bim-checkbox
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
        ${!this.checkbox&&!this.noMark&&this.checked?y`<svg
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
    `}};Po.styles=O`
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
  `;let j=Po;Et([f({type:String,reflect:!0})],j.prototype,"img",2);Et([f({type:String,reflect:!0})],j.prototype,"label",2);Et([f({type:String,reflect:!0})],j.prototype,"icon",2);Et([f({type:Boolean,reflect:!0})],j.prototype,"checked",2);Et([f({type:Boolean,reflect:!0})],j.prototype,"checkbox",2);Et([f({type:Boolean,attribute:"no-mark",reflect:!0})],j.prototype,"noMark",2);Et([f({converter:{fromAttribute(e){return e&&Si(e)}}})],j.prototype,"value",1);Et([f({type:Boolean,reflect:!0})],j.prototype,"vertical",2);var mc=Object.defineProperty,bc=Object.getOwnPropertyDescriptor,Ct=(e,t,i,n)=>{for(var s=n>1?void 0:n?bc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&mc(t,i,s),s};const Io=class extends $t{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this.onWindowMouseUp=e=>{this.visible&&(this.contains(e.target)||(this.visible=!1))},this.onOptionClick=e=>{const t=e.target,i=this._value.has(t);if(!this.multiple&&!this.required&&!i)this._value=new Set([t]);else if(!this.multiple&&!this.required&&i)this._value=new Set([]);else if(!this.multiple&&this.required&&!i)this._value=new Set([t]);else if(this.multiple&&!this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&!this.required&&i){const n=[...this._value].filter(s=>s!==t);this._value=new Set(n)}else if(this.multiple&&this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&this.required&&i){const n=[...this._value].filter(o=>o!==t),s=new Set(n);s.size!==0&&(this._value=s)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(e){this._visible=e,e||this.resetVisibleElements()}get visible(){return this._visible}set value(e){if(this.required&&Object.keys(e).length===0)return;const t=new Set;for(const i of e){const n=this.findOption(i);if(n&&(t.add(n),!this.multiple&&Object.keys(e).length===1))break}this._value=t,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(e=>e instanceof j&&e.checked).map(e=>e.value)}get _options(){const e=new Set([...this.elements]);for(const t of this.children)t instanceof j&&e.add(t);return[...e]}onSlotChange(e){const t=e.target.assignedElements();this.observe(t);const i=new Set;for(const n of this.elements){if(!(n instanceof j)){n.remove();continue}n.checked&&i.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=i}updateOptionsState(){for(const e of this._options)e instanceof j&&(e.checked=this._value.has(e))}findOption(e){return this._options.find(t=>t instanceof j?t.label===e||t.value===e:!1)}connectedCallback(){super.connectedCallback(),window.addEventListener("mouseup",this.onWindowMouseUp)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mouseup",this.onWindowMouseUp)}render(){let e,t,i;if(this._value.size===0)e="Select an option...";else if(this._value.size===1){const n=[...this._value][0];e=(n==null?void 0:n.label)||(n==null?void 0:n.value),t=n==null?void 0:n.img,i=n==null?void 0:n.icon}else e=`Multiple (${this._value.size})`;return y`
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
        </div>
        <bim-context-menu .visible=${this.visible}>
          <slot @slotchange=${this.onSlotChange}></slot>
          ${this.visibleElements.map(n=>n)}
        </bim-context-menu>
      </bim-input>
    `}};Io.styles=[Ht.scrollbar,O`
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
    `];let dt=Io;Ct([f({type:String,reflect:!0})],dt.prototype,"name",2);Ct([f({type:String,reflect:!0})],dt.prototype,"icon",2);Ct([f({type:String,reflect:!0})],dt.prototype,"label",2);Ct([f({type:Boolean,reflect:!0})],dt.prototype,"multiple",2);Ct([f({type:Boolean,reflect:!0})],dt.prototype,"required",2);Ct([f({type:Boolean,reflect:!0})],dt.prototype,"vertical",2);Ct([f({type:Boolean,reflect:!0})],dt.prototype,"visible",1);Ct([se()],dt.prototype,"_value",2);var gc=Object.defineProperty,Mo=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&gc(t,i,s),s};const Lo=class extends k{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(e){const t=e.split(`
`).map(i=>i.trim()).map(i=>i.split('"')[1]).filter(i=>i!==void 0).flatMap(i=>i.split(/\s+/));return[...new Set(t)].filter(i=>i!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const e=this.layouts[this.layout],t=this.getUniqueAreasFromTemplate(e.template).map(i=>{const n=e.elements[i];return n&&(n.style.gridArea=i),n}).filter(i=>!!i);this.style.gridTemplate=e.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...t)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return y`<slot></slot>`}};Lo.styles=O`
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
  `;let xn=Lo;Mo([f({type:Boolean,reflect:!0})],xn.prototype,"floating");Mo([f({type:String,reflect:!0})],xn.prototype,"layout");const nn=class extends k{render(){return y`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};nn.styles=O`
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
  `,nn.properties={icon:{type:String}};let vc=nn;var yc=Object.defineProperty,ki=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&yc(t,i,s),s};const Ro=class extends k{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const e={};for(const t of this.children){const i=t;"value"in i?e[i.name||i.label]=i.value:"checked"in i&&(e[i.name||i.label]=i.checked)}return e}set value(e){const t=[...this.children];for(const i in e){const n=t.find(r=>{const a=r;return a.name===i||a.label===i});if(!n)continue;const s=n,o=e[i];typeof o=="boolean"?s.checked=o:s.value=o}}render(){return y`
      <div class="parent">
        ${this.label||this.icon?y`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};Ro.styles=O`
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
  `;let Ue=Ro;ki([f({type:String,reflect:!0})],Ue.prototype,"name");ki([f({type:String,reflect:!0})],Ue.prototype,"label");ki([f({type:String,reflect:!0})],Ue.prototype,"icon");ki([f({type:Boolean,reflect:!0})],Ue.prototype,"vertical");var _c=Object.defineProperty,Ve=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&_c(t,i,s),s};const zo=class extends k{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Si(this.textContent):this.textContent}render(){return y`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?y`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?y`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};zo.styles=O`
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
  `;let ae=zo;Ve([f({type:String,reflect:!0})],ae.prototype,"img");Ve([f({type:Boolean,attribute:"label-hidden",reflect:!0})],ae.prototype,"labelHidden");Ve([f({type:String,reflect:!0})],ae.prototype,"icon");Ve([f({type:Boolean,attribute:"icon-hidden",reflect:!0})],ae.prototype,"iconHidden");Ve([f({type:Boolean,reflect:!0})],ae.prototype,"vertical");var xc=Object.defineProperty,wc=Object.getOwnPropertyDescriptor,Y=(e,t,i,n)=>{for(var s=n>1?void 0:n?wc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&xc(t,i,s),s};const jo=class extends k{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=Wt(),this.onValueChange=new Event("change")}set value(e){this.setValue(e.toString())}get value(){return this._value}onChange(e){e.stopPropagation();const{value:t}=this._input;t&&this.setValue(t.value)}setValue(e){const{value:t}=this._input;let i=e;if(i=i.replace(/[^0-9.-]/g,""),i=i.replace(/(\..*)\./g,"$1"),i.endsWith(".")||(i.lastIndexOf("-")>0&&(i=i[0]+i.substring(1).replace(/-/g,"")),i==="-"||i==="-0"))return;let n=Number(i);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,t&&(t.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:e}=this._input;e&&Number.isNaN(Number(e.value))&&(e.value=this.value.toString())}onSliderMouseDown(e){document.body.style.cursor="w-resize";const{clientX:t}=e,i=this.value;let n=!1;const s=a=>{var l;n=!0;const{clientX:d}=a,h=this.step??1,c=((l=h.toString().split(".")[1])==null?void 0:l.length)||0,u=1/(this.sensitivity??1),p=(d-t)/u;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const b=i+p*h;this.setValue(b.toFixed(c))},o=()=>{this.slider=!0,this.removeEventListener("blur",o)},r=()=>{document.removeEventListener("mousemove",s),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",o),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",s),document.addEventListener("mouseup",r)}onFocus(e){e.stopPropagation();const t=i=>{i.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",t))};window.addEventListener("keydown",t)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:e}=this._input;e&&e.focus()}render(){const e=y`
      ${this.pref||this.icon?y`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${vt(this._input)}
        type="text"
        aria-label=${this.label||this.name||"Number Input"}
        size="1"
        @input=${r=>r.stopPropagation()}
        @change=${this.onChange}
        @blur=${this.onBlur}
        @focus=${this.onFocus}
        .value=${this.value.toString()}
      />
      ${this.suffix?y`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            >${this.suffix}</bim-label
          >`:null}
    `,t=this.min??-1/0,i=this.max??1/0,n=100*(this.value-t)/(i-t),s=y`
      <style>
        .slider-indicator {
          width: ${`${n}%`};
        }
      </style>
      <div class="slider" @mousedown=${this.onSliderMouseDown}>
        <div class="slider-indicator"></div>
        ${this.pref||this.icon?y`<bim-label
              style="z-index: 1; margin-right: 0.125rem"
              .icon=${this.icon}
              >${`${this.pref}: `}</bim-label
            >`:null}
        <bim-label style="z-index: 1;">${this.value}</bim-label>
        ${this.suffix?y`<bim-label style="z-index: 1;">${this.suffix}</bim-label>`:null}
      </div>
    `,o=`${this.label||this.name||this.pref?`${this.label||this.name||this.pref}: `:""}${this.value}${this.suffix??""}`;return y`
      <bim-input
        title=${o}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        ${this.slider?s:e}
      </bim-input>
    `}};jo.styles=O`
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
  `;let F=jo;Y([f({type:String,reflect:!0})],F.prototype,"name",2);Y([f({type:String,reflect:!0})],F.prototype,"icon",2);Y([f({type:String,reflect:!0})],F.prototype,"label",2);Y([f({type:String,reflect:!0})],F.prototype,"pref",2);Y([f({type:Number,reflect:!0})],F.prototype,"min",2);Y([f({type:Number,reflect:!0})],F.prototype,"value",1);Y([f({type:Number,reflect:!0})],F.prototype,"step",2);Y([f({type:Number,reflect:!0})],F.prototype,"sensitivity",2);Y([f({type:Number,reflect:!0})],F.prototype,"max",2);Y([f({type:String,reflect:!0})],F.prototype,"suffix",2);Y([f({type:Boolean,reflect:!0})],F.prototype,"vertical",2);Y([f({type:Boolean,reflect:!0})],F.prototype,"slider",2);var $c=Object.defineProperty,Ec=Object.getOwnPropertyDescriptor,We=(e,t,i,n)=>{for(var s=n>1?void 0:n?Ec(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&$c(t,i,s),s};const Ho=class extends k{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.activationButton=document.createElement("bim-button")}set hidden(e){this._hidden=e,this.activationButton.active=!e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return bi(this)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(o=>{const r=o;return r.name===i||r.label===i});if(!n)continue;const s=n;s.value=e[i]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!0}expandSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,y`
      <div class="parent">
        ${this.label||this.name||this.icon?y`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};Ho.styles=[Ht.scrollbar,O`
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
    `];let le=Ho;We([f({type:String,reflect:!0})],le.prototype,"icon",2);We([f({type:String,reflect:!0})],le.prototype,"name",2);We([f({type:String,reflect:!0})],le.prototype,"label",2);We([f({type:Boolean,reflect:!0})],le.prototype,"hidden",1);We([f({type:Boolean,attribute:"header-hidden",reflect:!0})],le.prototype,"headerHidden",2);var Cc=Object.defineProperty,qe=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Cc(t,i,s),s};const Do=class extends k{constructor(){super(...arguments),this.onValueChange=new Event("change")}get value(){return bi(this)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(o=>{const r=o;return r.name===i||r.label===i});if(!n)continue;const s=n;s.value=e[i]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const e=this.label||this.icon||this.name||this.fixed,t=y`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,i=y`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?t:i,s=y`
      <div
        class="header"
        title=${this.label??""}
        @click=${this.onHeaderClick}
      >
        ${this.label||this.icon||this.name?y`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        ${this.fixed?null:n}
      </div>
    `;return y`
      <div class="parent">
        ${e?s:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};Do.styles=[Ht.scrollbar,O`
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
    `];let ce=Do;qe([f({type:String,reflect:!0})],ce.prototype,"icon");qe([f({type:String,reflect:!0})],ce.prototype,"label");qe([f({type:String,reflect:!0})],ce.prototype,"name");qe([f({type:Boolean,reflect:!0})],ce.prototype,"fixed");qe([f({type:Boolean,reflect:!0})],ce.prototype,"collapsed");var Ac=Object.defineProperty,Ge=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Ac(t,i,s),s};const Bo=class extends k{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=e=>{this._value=e.target,this.dispatchEvent(this.onValueChange);for(const t of this.children)t instanceof j&&(t.checked=t===e.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(e){const t=this.findOption(e);if(t){for(const i of this._options)i.checked=i===t;this._value=t,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(e){const t=e.target.assignedElements();for(const i of t)i instanceof j&&(i.noMark=!0,i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick))}findOption(e){return this._options.find(t=>t instanceof j?t.label===e||t.value===e:!1)}firstUpdated(){const e=[...this.children].find(t=>t instanceof j&&t.checked);e&&(this._value=e)}render(){return y`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};Bo.styles=O`
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
  `;let de=Bo;Ge([f({type:String,reflect:!0})],de.prototype,"name");Ge([f({type:String,reflect:!0})],de.prototype,"icon");Ge([f({type:String,reflect:!0})],de.prototype,"label");Ge([f({type:Boolean,reflect:!0})],de.prototype,"vertical");Ge([se()],de.prototype,"_value");const Sc=()=>y`
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
  `,kc=()=>y`
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
  `;var Oc=Object.defineProperty,Tc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Oc(t,i,s),s};const Fo=class extends k{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return y`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};Fo.styles=O`
    :host {
      padding: 0.25rem 1rem;
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
  `;let Uo=Fo;Tc([f({type:String,reflect:!0})],Uo.prototype,"column");var Nc=Object.defineProperty,Pc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Nc(t,i,s),s};const Vo=class extends k{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(e,t=!1){for(const i of this._groups)i.childrenHidden=typeof e>"u"?!i.childrenHidden:!e,t&&i.toggleChildren(e,t)}render(){return this._groups=[],y`
      <slot></slot>
      ${this.data.map(e=>{const t=document.createElement("bim-table-group");return this._groups.push(t),t.table=this.table,t.data=e,t})}
    `}};Vo.styles=O`
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
  `;let Wo=Vo;Pc([f({type:Array,attribute:!1})],Wo.prototype,"data");var Ic=Object.defineProperty,Mc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Ic(t,i,s),s};const qo=class extends k{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(e,t=!1){this._children&&(this.childrenHidden=typeof e>"u"?!this.childrenHidden:!e,t&&this._children.toggleGroups(e,t))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const e=this.table.getGroupIndentation(this.data)??0,t=y`
      ${this.table.noIndentation?null:y`
            <style>
              .branch-vertical {
                left: ${e+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,i=document.createDocumentFragment();Kt(t,i);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${e-1+(this.table.selectableRows?2.05:.5625)}rem`);let s=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const l=document.createElementNS("http://www.w3.org/2000/svg","path");l.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(l);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const h=document.createElementNS("http://www.w3.org/2000/svg","path");h.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(h),s=document.createElement("div"),s.addEventListener("click",c=>{c.stopPropagation(),this.toggleChildren()}),s.classList.add("caret"),s.style.left=`${(this.table.selectableRows?1.5:.125)+e}rem`,this.childrenHidden?s.append(a):s.append(d)}const o=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&o.append(i),o.table=this.table,o.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:o}})),s&&this.data.children&&o.append(s),e!==0&&(!this.data.children||this.childrenHidden)&&n&&o.append(n);let r;if(this.data.children){r=document.createElement("bim-table-children"),this._children=r,r.table=this.table,r.data=this.data.children;const a=document.createDocumentFragment();Kt(t,a),r.append(a)}return y`
      <div class="parent">${o} ${this.childrenHidden?null:r}</div>
    `}};qo.styles=O`
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
  `;let Go=qo;Mc([f({type:Boolean,attribute:"children-hidden",reflect:!0})],Go.prototype,"childrenHidden");var Lc=Object.defineProperty,he=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Lc(t,i,s),s};const Yo=class extends k{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(e=>{this._intersecting=e[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.name)}get _columnWidths(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.width)}get _isSelected(){var e;return(e=this.table)==null?void 0:e.selection.has(this.data)}onSelectionChange(e){if(!this.table)return;const t=e.target;this.selected=t.value,t.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const e=this.table.getRowIndentation(this.data)??0,t=this.isHeader?this.data:this.table.computeRowDeclaration(this.data)??this.data,i=[];for(const n in t){if(this.hiddenColumns.includes(n))continue;const s=t[n];let o;if(typeof s=="string"||typeof s=="boolean"||typeof s=="number"?(o=document.createElement("bim-label"),o.textContent=String(s)):s instanceof HTMLElement?o=s:(o=document.createDocumentFragment(),Kt(s,o)),!o)continue;const r=document.createElement("bim-table-cell");r.append(o),r.column=n,this._columnNames.indexOf(n)===0&&!this.isHeader&&(r.style.marginLeft=`${(this.table.noIndentation?0:e)+.125}rem`);const a=this._columnNames.indexOf(n);r.setAttribute("data-column-index",String(a)),r.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),r.toggleAttribute("data-cell-header",this.isHeader),r.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:r}})),i.push(r)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,y`
      ${!this.isHeader&&this.table.selectableRows?y`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${i}
      <slot></slot>
    `}render(){return y`${this._intersecting?this.compute():y``}`}};Yo.styles=O`
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
  `;let Dt=Yo;he([f({type:Boolean,reflect:!0})],Dt.prototype,"selected");he([f({attribute:!1})],Dt.prototype,"columns");he([f({attribute:!1})],Dt.prototype,"hiddenColumns");he([f({attribute:!1})],Dt.prototype,"data");he([f({type:Boolean,attribute:"is-header",reflect:!0})],Dt.prototype,"isHeader");he([se()],Dt.prototype,"_intersecting");var Rc=Object.defineProperty,zc=Object.getOwnPropertyDescriptor,Z=(e,t,i,n)=>{for(var s=n>1?void 0:n?zc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Rc(t,i,s),s};const Xo=class extends k{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this.loadingErrorElement=null,this._stringFilterFunction=(e,t)=>Object.values(t.data).some(i=>String(i).toLowerCase().includes(e.toLowerCase())),this._queryFilterFunction=(e,t)=>{let i=!1;const n=en(e)??[];for(const s of n){if("queries"in s){i=!1;break}const{condition:o,value:r}=s;let{key:a}=s;if(a.startsWith("[")&&a.endsWith("]")){const l=a.replace("[","").replace("]","");a=l,i=Object.keys(t.data).filter(d=>d.includes(l)).map(d=>ps(t.data[d],o,r)).some(d=>d)}else i=ps(t.data[a],o,r);if(!i)break}return i}}set columns(e){const t=[];for(const i of e){const n=typeof i=="string"?{name:i,width:`minmax(${this.minColWidth}, 1fr)`}:i;t.push(n)}this._columns=t,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const e={};for(const t of this.columns)if(typeof t=="string")e[t]=t;else{const{name:i}=t;e[i]=i}return e}get value(){return this._filteredData}set queryString(e){this.toggleAttribute("data-processing",!0),this._queryString=e&&e.trim()!==""?e.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(e){this._data=e,this.updateFilteredData(),this.computeMissingColumns(e)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(e=>{setTimeout(()=>{e(this.data)})})}set hiddenColumns(e){this._hiddenColumns=e,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(en(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(e){let t=!1;for(const i of e){const{children:n,data:s}=i;for(const o in s)this._columns.map(r=>typeof r=="string"?r:r.name).includes(o)||(this._columns.push({name:o,width:`minmax(${this.minColWidth}, 1fr)`}),t=!0);if(n){const o=this.computeMissingColumns(n);o&&!t&&(t=o)}}return t}generateText(e="comma",t=this.value,i="",n=!0){const s=this._textDelimiters[e];let o="";const r=this.columns.map(a=>a.name);if(n){this.indentationInText&&(o+=`Indentation${s}`);const a=`${r.join(s)}
`;o+=a}for(const[a,l]of t.entries()){const{data:d,children:h}=l,c=this.indentationInText?`${i}${a+1}${s}`:"",u=r.map(b=>d[b]??""),p=`${c}${u.join(s)}
`;o+=p,h&&(o+=this.generateText(e,l.children,`${i}${a+1}.`,!1))}return o}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}computeRowDeclaration(e){const t={};for(const i in e){const n=this.dataTransform[i];n?t[i]=n(e[i],e):t[i]=e[i]}return t}downloadData(e="BIM Table Data",t="json"){let i=null;if(t==="json"&&(i=new File([JSON.stringify(this.value,void 0,2)],`${e}.json`)),t==="csv"&&(i=new File([this.csv],`${e}.csv`)),t==="tsv"&&(i=new File([this.tsv],`${e}.tsv`)),!i)return;const n=document.createElement("a");n.href=URL.createObjectURL(i),n.download=i.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(e,t=this.value,i=0){for(const n of t){if(n.data===e)return i;if(n.children){const s=this.getRowIndentation(e,n.children,i+1);if(s!==null)return s}}return null}getGroupIndentation(e,t=this.value,i=0){for(const n of t){if(n===e)return i;if(n.children){const s=this.getGroupIndentation(e,n.children,i+1);if(s!==null)return s}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(e=!1){if(this._filteredData.length!==0&&!e||!this.loadFunction)return!1;this.loading=!0;try{const t=await this.loadFunction();return this.data=t,this.loading=!1,this._errorLoading=!1,!0}catch(t){return this.loading=!1,this._filteredData.length!==0||(t instanceof Error&&this.loadingErrorElement&&t.message.trim()!==""&&(this.loadingErrorElement.textContent=t.message),this._errorLoading=!0),!1}}filter(e,t=this.filterFunction??this._stringFilterFunction,i=this.data){const n=[];for(const s of i)if(t(e,s)){if(this.preserveStructureOnFilter){const o={data:s.data};if(s.children){const r=this.filter(e,t,s.children);r.length&&(o.children=r)}n.push(o)}else if(n.push({data:s.data}),s.children){const o=this.filter(e,t,s.children);n.push(...o)}}else if(s.children){const o=this.filter(e,t,s.children);this.preserveStructureOnFilter&&o.length?n.push({data:s.data,children:o}):n.push(...o)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return Sc();if(this._errorLoading)return y`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return y`<slot name="missing-data"></slot>`;const e=document.createElement("bim-table-row");e.table=this,e.isHeader=!0,e.data=this._headerRowData,e.style.gridArea="Header",e.style.position="sticky",e.style.top="0",e.style.zIndex="5";const t=document.createElement("bim-table-children");return t.table=this,t.data=this.value,t.style.gridArea="Body",t.style.backgroundColor="transparent",y`
      <div class="parent">
        ${this.headersHidden?null:e} ${kc()}
        <div style="overflow-x: hidden; grid-area: Body">${t}</div>
      </div>
    `}};Xo.styles=[Ht.scrollbar,O`
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
    `];let X=Xo;Z([se()],X.prototype,"_filteredData",2);Z([f({type:Boolean,attribute:"headers-hidden",reflect:!0})],X.prototype,"headersHidden",2);Z([f({type:String,attribute:"min-col-width",reflect:!0})],X.prototype,"minColWidth",2);Z([f({type:Array,attribute:!1})],X.prototype,"columns",1);Z([f({type:Array,attribute:!1})],X.prototype,"data",1);Z([f({type:Boolean,reflect:!0})],X.prototype,"expanded",2);Z([f({type:Boolean,reflect:!0,attribute:"selectable-rows"})],X.prototype,"selectableRows",2);Z([f({attribute:!1})],X.prototype,"selection",2);Z([f({type:Boolean,attribute:"no-indentation",reflect:!0})],X.prototype,"noIndentation",2);Z([f({type:Boolean,reflect:!0})],X.prototype,"loading",2);Z([se()],X.prototype,"_errorLoading",2);var jc=Object.defineProperty,Hc=Object.getOwnPropertyDescriptor,Oi=(e,t,i,n)=>{for(var s=n>1?void 0:n?Hc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&jc(t,i,s),s};const Jo=class extends k{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:e}=this;if(e&&this.name===this._defaultName){const t=[...e.children].indexOf(this);this.name=`${this._defaultName}${t}`}}render(){return y` <slot></slot> `}};Jo.styles=O`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let W=Jo;Oi([f({type:String,reflect:!0})],W.prototype,"name",2);Oi([f({type:String,reflect:!0})],W.prototype,"label",2);Oi([f({type:String,reflect:!0})],W.prototype,"icon",2);Oi([f({type:Boolean,reflect:!0})],W.prototype,"hidden",1);var Dc=Object.defineProperty,Bc=Object.getOwnPropertyDescriptor,ue=(e,t,i,n)=>{for(var s=n>1?void 0:n?Bc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Dc(t,i,s),s};const Qo=class extends k{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=e=>{const t=e.target;t instanceof W&&!t.hidden&&(t.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=t.name,t.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(e){this._tab=e;const t=[...this.children],i=t.find(n=>n instanceof W&&n.name===e);for(const n of t){if(!(n instanceof W))continue;n.hidden=i!==n;const s=this.getTabSwitcher(n.name);s&&s.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(e){return this._switchers.find(t=>t.getAttribute("data-name")===e)}createSwitchers(){this._switchers=[];for(const e of this.children){if(!(e instanceof W))continue;const t=document.createElement("div");t.addEventListener("click",()=>{this.tab===e.name?this.toggleAttribute("tab",!1):this.tab=e.name}),t.setAttribute("data-name",e.name),t.className="switcher";const i=document.createElement("bim-label");i.textContent=e.label??"",i.icon=e.icon,t.append(i),this._switchers.push(t)}}onSlotChange(e){this.createSwitchers();const t=e.target.assignedElements(),i=t.find(n=>n instanceof W?this.tab?n.name===this.tab:!n.hidden:!1);i&&i instanceof W&&(this.tab=i.name);for(const n of t){if(!(n instanceof W)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),i!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return y`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Qo.styles=[Ht.scrollbar,O`
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
    `];let Bt=Qo;ue([se()],Bt.prototype,"_switchers",2);ue([f({type:Boolean,reflect:!0})],Bt.prototype,"bottom",2);ue([f({type:Boolean,attribute:"switchers-hidden",reflect:!0})],Bt.prototype,"switchersHidden",2);ue([f({type:Boolean,reflect:!0})],Bt.prototype,"floating",2);ue([f({type:String,reflect:!0})],Bt.prototype,"tab",1);ue([f({type:Boolean,attribute:"switchers-full",reflect:!0})],Bt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fc=e=>e??I;var Uc=Object.defineProperty,Vc=Object.getOwnPropertyDescriptor,At=(e,t,i,n)=>{for(var s=n>1?void 0:n?Vc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Uc(t,i,s),s};const Zo=class extends k{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(e){this._inputTypes.includes(e)&&(this._type=e)}get type(){return this._type}get query(){return en(this.value)}onInputChange(e){e.stopPropagation();const t=e.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=t.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("input");t==null||t.focus()})}render(){return y`
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
          placeholder=${Fc(this.placeholder)}
          @input=${this.onInputChange}
        />
      </bim-input>
    `}};Zo.styles=O`
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
  `;let ht=Zo;At([f({type:String,reflect:!0})],ht.prototype,"icon",2);At([f({type:String,reflect:!0})],ht.prototype,"label",2);At([f({type:String,reflect:!0})],ht.prototype,"name",2);At([f({type:String,reflect:!0})],ht.prototype,"placeholder",2);At([f({type:String,reflect:!0})],ht.prototype,"value",2);At([f({type:Boolean,reflect:!0})],ht.prototype,"vertical",2);At([f({type:Number,reflect:!0})],ht.prototype,"debounce",2);At([f({type:String,reflect:!0})],ht.prototype,"type",1);var Wc=Object.defineProperty,qc=Object.getOwnPropertyDescriptor,Ko=(e,t,i,n)=>{for(var s=n>1?void 0:n?qc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Wc(t,i,s),s};const tr=class extends k{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const e=this.children;for(const t of e)this.vertical?t.setAttribute("label-hidden",""):t.removeAttribute("label-hidden")}render(){return y`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};tr.styles=O`
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
  `;let Ti=tr;Ko([f({type:Number,reflect:!0})],Ti.prototype,"rows",2);Ko([f({type:Boolean,reflect:!0})],Ti.prototype,"vertical",1);var Gc=Object.defineProperty,Yc=Object.getOwnPropertyDescriptor,Ni=(e,t,i,n)=>{for(var s=n>1?void 0:n?Yc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Gc(t,i,s),s};const er=class extends k{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(e){this._labelHidden=e,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const e=this.children;for(const t of e)t instanceof Ti&&(t.vertical=this.vertical),t.toggleAttribute("label-hidden",this.vertical)}render(){return y`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?y`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};er.styles=O`
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
  `;let pe=er;Ni([f({type:String,reflect:!0})],pe.prototype,"label",2);Ni([f({type:String,reflect:!0})],pe.prototype,"icon",2);Ni([f({type:Boolean,reflect:!0})],pe.prototype,"vertical",1);Ni([f({type:Boolean,attribute:"label-hidden",reflect:!0})],pe.prototype,"labelHidden",1);const ir=class A{static set config(t){this._config={...A._config,...t}}static get config(){return A._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=Ht.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){A.init()}static init(){A.addGlobalStyles(),A.defineCustomElement("bim-button",sc),A.defineCustomElement("bim-checkbox",oe),A.defineCustomElement("bim-color-input",jt),A.defineCustomElement("bim-context-menu",No),A.defineCustomElement("bim-dropdown",dt),A.defineCustomElement("bim-grid",xn),A.defineCustomElement("bim-icon",vc),A.defineCustomElement("bim-input",Ue),A.defineCustomElement("bim-label",ae),A.defineCustomElement("bim-number-input",F),A.defineCustomElement("bim-option",j),A.defineCustomElement("bim-panel",le),A.defineCustomElement("bim-panel-section",ce),A.defineCustomElement("bim-selector",de),A.defineCustomElement("bim-table",X),A.defineCustomElement("bim-tabs",Bt),A.defineCustomElement("bim-tab",W),A.defineCustomElement("bim-table-cell",Uo),A.defineCustomElement("bim-table-children",Wo),A.defineCustomElement("bim-table-group",Go),A.defineCustomElement("bim-table-row",Dt),A.defineCustomElement("bim-text-input",ht),A.defineCustomElement("bim-toolbar",Pi),A.defineCustomElement("bim-toolbar-group",Ti),A.defineCustomElement("bim-toolbar-section",pe),A.defineCustomElement("bim-viewport",or)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let n=0;n<10;n++){const s=Math.floor(Math.random()*t.length);i+=t.charAt(s)}return i}};ir._config={sectionLabelOnVerticalToolbar:!1};let sn=ir;var Xc=Object.defineProperty,Jc=Object.getOwnPropertyDescriptor,wn=(e,t,i,n)=>{for(var s=n>1?void 0:n?Jc(t,i):t,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=(n?r(t,i,s):r(s))||s);return n&&s&&Xc(t,i,s),s};const nr=class extends k{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(e){this._vertical=e,this.updateSections()}get vertical(){return this._vertical}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const e=this.children;for(const t of e)t instanceof pe&&(t.labelHidden=this.vertical&&!sn.config.sectionLabelOnVerticalToolbar,t.vertical=this.vertical)}render(){return y`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};nr.styles=O`
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
  `;let Pi=nr;wn([f({type:String,reflect:!0})],Pi.prototype,"icon",2);wn([f({type:Boolean,attribute:"labels-hidden",reflect:!0})],Pi.prototype,"labelsHidden",2);wn([f({type:Boolean,reflect:!0})],Pi.prototype,"vertical",1);var Qc=Object.defineProperty,Zc=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&Qc(t,i,s),s};const sr=class extends k{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return y`
      <div class="parent">
        <slot></slot>
      </div>
    `}};sr.styles=O`
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
  `;let or=sr;Zc([f({type:String,reflect:!0})],or.prototype,"name");const Kc=e=>{const{components:t}=e,i=t.get(Er);return y`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const n=document.createElement("input");n.type="file",n.accept=".ifc",n.onchange=async()=>{if(n.files===null||n.files.length===0)return;const s=n.files[0];n.remove();const o=await s.arrayBuffer(),r=new Uint8Array(o),a=await i.load(r);a.name=s.name.replace(".ifc","")},n.click()}}
    ></bim-button>
  `},td=e=>$t.create(Kc,e),ed=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:td},Symbol.toStringTag,{value:"Module"}));({...ed});const id=e=>{const{components:t,actions:i,tags:n}=e,s=(i==null?void 0:i.dispose)??!0,o=(i==null?void 0:i.download)??!0,r=(i==null?void 0:i.visibility)??!0,a=(n==null?void 0:n.schema)??!0,l=(n==null?void 0:n.viewDefinition)??!0,d=t.get(zt),h=document.createElement("bim-table");h.addEventListener("cellcreated",({detail:u})=>{const{cell:p}=u;p.style.padding="0.25rem 0"}),h.hiddenColumns=["modelID"],h.headersHidden=!0;const c=[];for(const[,u]of d.groups){if(!u)continue;const p={data:{Name:u.name||u.uuid,modelID:u.uuid}};c.push(p)}return h.dataTransform={Name:(u,p)=>{const{modelID:b}=p;if(typeof b!="string")return u;const _=d.groups.get(b);if(!_)return b;const g={};for(const C of _.items)g[C.id]=C.ids;let m;const{schema:v}=_.ifcMetadata;a&&v&&(m=y`
          <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${v}</bim-label>
          `);let x;if(l&&"viewDefinition"in _.ifcMetadata){const C=_.ifcMetadata.viewDefinition;x=y`
          ${C.split(",").map(P=>y`<bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${P}</bim-label>`)}
        `}let w;s&&(w=y`<bim-button @click=${()=>d.disposeGroup(_)} icon="mdi:delete"></bim-button>`);let E;r&&(E=y`<bim-button @click=${C=>{const P=t.get(ks),T=C.target;P.set(T.hasAttribute("data-model-hidden"),g),T.toggleAttribute("data-model-hidden"),T.icon=T.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye"}} icon="mdi:eye"></bim-button>`);let $;return o&&($=y`<bim-button @click=${()=>{const C=document.createElement("input");C.type="file",C.accept=".ifc",C.multiple=!1,C.addEventListener("change",async()=>{if(!(C.files&&C.files.length===1))return;const P=C.files[0],T=await P.arrayBuffer(),S=await t.get(Sr).saveToIfc(_,new Uint8Array(T)),J=new File([S],P.name),D=document.createElement("a");D.href=URL.createObjectURL(J),D.download=J.name,D.click(),URL.revokeObjectURL(D.href)}),C.click()}} icon="flowbite:download-solid"></bim-button>`),y`
       <div style="display: flex; flex: 1; gap: var(--bim-ui_size-4xs); justify-content: space-between; overflow: auto;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bim-ui_size-4xs); flex-grow: 1; overflow: auto;">
          <div style="min-height: 1.75rem; overflow: auto; display: flex;">
            <bim-label style="white-space: normal;">${u}</bim-label>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--bim-ui_size-4xs); overflow: auto;">
            ${m}
            ${x}
          </div>
        </div>
        <div style="display: flex; align-self: flex-start; flex-shrink: 0;">
          ${$}
          ${E}
          ${w}
        </div>
       </div>
      `}},h.data=c,y`
    <div>
      ${c.length===0?y`<bim-label>No models has been loaded yet</bim-label>`:h}
    </div>
  `},nd=(e,t=!0)=>{const i=$t.create(id,e);if(t){const{components:n}=e,s=n.get(zt),[,o]=i;s.onFragmentsLoaded.add(()=>setTimeout(()=>o())),s.onFragmentsDisposed.add(()=>o())}return i},sd=Object.freeze(Object.defineProperty({__proto__:null,modelsList:nd},Symbol.toStringTag,{value:"Module"})),rr=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",e=>e.includes("Value"),e=>e.startsWith("Material"),e=>e.startsWith("Relating"),e=>{const t=["IsGroupedBy","IsDecomposedBy"];return e.startsWith("Is")&&!t.includes(e)}];async function si(e,t,i,n=rr,s=!1){const o=e.get(st),r=await t.getProperties(i);if(!r)return{data:{Entity:`${i} properties not found...`}};const a=o.relationMaps[t.uuid],l={data:{}};for(const d in r){const h=n.map(u=>typeof u=="string"?d===u:u(d)).includes(!0);if(!(d==="type"||h))continue;const c=r[d];if(c)if(c.type===5){l.children||(l.children=[]);const u=await si(e,t,c.value,n,s);l.children.push(u)}else if(typeof c=="object"&&!Array.isArray(c)){const{value:u,type:p}=c;if(s)p===1||p===2||p===3||(l.data[d]=u);else{const b=typeof u=="number"?Number(u.toFixed(3)):u;l.data[d]=b}}else if(Array.isArray(c))for(const u of c){if(u.type!==5)continue;l.children||(l.children=[]);const p=await si(e,t,u.value,n,s);l.children.push(p)}else if(d==="type"){const u=ri[c];l.data.Entity=u}else l.data[d]=c}if(a&&a.get(r.expressID)){const d=a.get(r.expressID);for(const h of n){const c=[];if(typeof h=="string"){const u=o._inverseAttributes.indexOf(h);u!==-1&&c.push(u)}else{const u=o._inverseAttributes.filter(p=>h(p));for(const p of u){const b=o._inverseAttributes.indexOf(p);c.push(b)}}for(const u of c){const p=d.get(u);if(p)for(const b of p){const _=await si(e,t,b,n,s);l.children||(l.children=[]),l.children.push(_)}}}}return l}const od=e=>{const{components:t,fragmentIdMap:i,attributesToInclude:n,editable:s,tableDefinition:o}=e,r=t.get(zt);let a;return typeof n=="function"?a=n(rr):a=n,y`<bim-table ${vt(async l=>{if(!l)return;const d=l,h=[],c=[];for(const u in i){const p=r.list.get(u);if(!(p&&p.group))continue;const b=p.group,_=c.find(g=>g.model===b);if(_)for(const g of i[u])_.expressIDs.add(g);else{const g={model:b,expressIDs:new Set(i[u])};c.push(g)}}for(const u of c){const{model:p,expressIDs:b}=u;for(const _ of b){const g=await si(t,p,_,a,s);h.push(g)}}d.dataTransform=o,d.data=h,d.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},rd=e=>$t.create(od,e),ad=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:rd},Symbol.toStringTag,{value:"Module"}));let ft;const ld=e=>{const{components:t,classifications:i}=e,n=t.get(Cr),s=t.get(ks);ft||(ft=document.createElement("bim-table"),ft.headersHidden=!0,ft.hiddenColumns=["system"],ft.columns=["Name",{name:"Actions",width:"auto"}],ft.dataTransform={Actions:(r,a)=>{const{system:l,Name:d}=a;if(!(typeof l=="string"&&typeof d=="string"))return r;const h=n.list[l];if(!(h&&h[d]))return r;const c=h[d],{map:u}=c;return y`
          <div>
            <bim-checkbox checked @change=${p=>{const b=p.target;s.set(b.value,u)}}></bim-checkbox>
          </div>
        `}});const o=[];for(const r of i){const a=typeof r=="string"?r:r.system,l=typeof r=="string"?r:r.label,d=n.list[a];d&&o.push({data:{Name:l,system:a},children:Object.keys(d).map(h=>({data:{Name:h,system:a,Actions:""}}))})}return ft.data=o,y`${ft}`},cd=(e,t=!0)=>{const i=$t.create(ld,e);if(t){const{components:n}=e,s=n.get(zt),[,o]=i;s.onFragmentsDisposed.add(()=>o())}return i},dd=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:cd},Symbol.toStringTag,{value:"Module"})),ar=async(e,t,i)=>{var n,s,o,r;const a=e.get(st),l={data:{Name:(n=i.Name)==null?void 0:n.value},children:[{data:{Name:"Identification",Value:(s=i.Identification)==null?void 0:s.value}},{data:{Name:"Name",Value:(o=i.Name)==null?void 0:o.value}},{data:{Name:"Description",Value:(r=i.Description)==null?void 0:r.value}}]},d=a.getEntityRelations(t,i.expressID,"IsNestedBy");if(!d)return l;l.children||(l.children=[]);const h=[];l.children.push({data:{Name:"Tasks"},children:h});for(const c of d){const u=await t.getProperties(c);if(!u)continue;const p=await ar(e,t,u);h.push(p)}return l},hd=async(e,t,i)=>{const n=[];for(const s of i){const o=await ar(e,t,s);n.push(o)}return{data:{Name:"Tasks"},children:n}},ud=async(e,t)=>{var i,n;const s={data:{Name:"Classifications"}};for(const o of t){const{value:r}=o.ReferencedSource,a=await e.getProperties(r);if(!a)continue;const l={data:{Name:a.Name.value},children:[{data:{Name:"Identification",Value:((i=o.Identification)==null?void 0:i.value)||((n=o.ItemReference)==null?void 0:n.value)}},{data:{Name:"Name",Value:o.Name.value}}]};s.children||(s.children=[]),s.children.push(l)}return s},pd=async(e,t)=>{const i={data:{Name:"Materials"}};for(const n of t){if(n.type===Ns){const s=n.ForLayerSet.value,o=await e.getProperties(s);if(!o)continue;for(const r of o.MaterialLayers){const{value:a}=r,l=await e.getProperties(a);if(!l)continue;const d=await e.getProperties(l.Material.value);if(!d)continue;const h={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:l.LayerThickness.value}},{data:{Name:"Material",Value:d.Name.value}}]};i.children||(i.children=[]),i.children.push(h)}}if(n.type===Is)for(const s of n.Materials){const{value:o}=s,r=await e.getProperties(o);if(!r)continue;const a={data:{Name:"Name",Value:r.Name.value}};i.children||(i.children=[]),i.children.push(a)}if(n.type===Ps){const s={data:{Name:"Name",Value:n.Name.value}};i.children||(i.children=[]),i.children.push(s)}}return i},fd=async(e,t)=>{const i={data:{Name:"PropertySets"}};for(const n of t){const s={data:{Name:n.Name.value}};if(n.type===Os){for(const o of n.HasProperties){const{value:r}=o,a=await e.getProperties(r);if(!a)continue;const l=Object.keys(a).find(h=>h.includes("Value"));if(!(l&&a[l]))continue;const d={data:{Name:a.Name.value,Value:a[l].value}};s.children||(s.children=[]),s.children.push(d)}s.children&&(i.children||(i.children=[]),i.children.push(s))}}return i},md=async(e,t)=>{const i={data:{Name:"QuantitySets"}};for(const n of t){const s={data:{Name:n.Name.value}};if(n.type===Ts){for(const o of n.Quantities){const{value:r}=o,a=await e.getProperties(r);if(!a)continue;const l=Object.keys(a).find(h=>h.includes("Value"));if(!(l&&a[l]))continue;const d={data:{Name:a.Name.value,Value:a[l].value}};s.children||(s.children=[]),s.children.push(d)}s.children&&(i.children||(i.children=[]),i.children.push(s))}}return i},bd=["OwnerHistory","ObjectPlacement","CompositionType"],lr=async(e,t)=>{const i={groupName:"Attributes",includeClass:!1,...t},{groupName:n,includeClass:s}=i,o={data:{Name:n}};s&&(o.children||(o.children=[]),o.children.push({data:{Name:"Class",Value:ri[e.type]}}));for(const r in e){if(bd.includes(r))continue;const a=e[r];if(a&&typeof a=="object"&&!Array.isArray(a)){if(a.type===jr)continue;const l={data:{Name:r,Value:a.value}};o.children||(o.children=[]),o.children.push(l)}}return o},te=(e,...t)=>{e.children||(e.children=[]),e.children.push(...t)},gd=async(e,t,i,n)=>{const s=e.get(st).getEntityRelations(t,i,"IsDefinedBy");if(s){const o=[],r=[];for(const l of s){const d=await t.getProperties(l);d&&(d.type===Os&&o.push(d),d.type===Ts&&r.push(d))}const a=await fd(t,o);a.children&&te(n,a),(await md(t,r)).children&&te(n,a)}},vd=async(e,t,i,n)=>{const s=e.get(st).getEntityRelations(t,i,"HasAssociations");if(s){const o=[],r=[];for(const d of s){const h=await t.getProperties(d);h&&(h.type===Hr&&o.push(h),(h.type===Ns||h.type===Dr||h.type===Br||h.type===Ps||h.type===Is)&&r.push(h))}const a=await ud(t,o);a.children&&te(n,a);const l=await pd(t,r);l.children&&te(n,l)}},yd=async(e,t,i,n)=>{const s=e.get(st).getEntityRelations(t,i,"HasAssignments");if(s){const o=[];for(const a of s){const l=await t.getProperties(a);l&&l.type===Fr&&o.push(l)}const r=await hd(e,t,o);r.children&&te(n,r)}},_d=async(e,t,i,n)=>{const s=e.get(st).getEntityRelations(t,i,"ContainedInStructure");if(s&&s[0]){const o=s[0],r=await t.getProperties(o);if(r){const a=await lr(r,{groupName:"SpatialContainer"});te(n,a)}}};let ei={};const xd=async(e,t)=>{var i;const n=e.get(st),s=e.get(zt),o=s.getModelIdMap(t);Object.keys(t).length===0&&(ei={});const r=[];for(const a in o){const l=s.groups.get(a);if(!l)continue;const d=n.relationMaps[l.uuid];if(!d)continue;a in ei||(ei[a]=new Map);const h=ei[a],c=o[a];for(const u of c){let p=h.get(u);if(p){r.push(p);continue}const b=await l.getProperties(u);if(!b)continue;p={data:{Name:(i=b.Name)==null?void 0:i.value}},r.push(p),h.set(u,p);const _=await lr(b,{includeClass:!0});p.children||(p.children=[]),p.children.push(_),d.get(u)&&(await gd(e,l,u,p),await vd(e,l,u,p),await yd(e,l,u,p),await _d(e,l,u,p))}}return r},wd=new Event("datacomputed");let rt;const $d=e=>{const t={emptySelectionWarning:!0,...e},{components:i,fragmentIdMap:n,emptySelectionWarning:s}=t;if(!rt&&(rt=document.createElement("bim-table"),rt.columns=[{name:"Name",width:"12rem"}],rt.headersHidden=!0,rt.addEventListener("cellcreated",({detail:o})=>{const{cell:r}=o;r.column==="Name"&&!("Value"in r.rowData)&&(r.style.gridColumn="1 / -1")}),s)){const o=document.createElement("bim-label");o.style.setProperty("--bim-icon--c","gold"),o.slot="missing-data",o.icon="ic:round-warning",o.textContent="Select some elements to display its properties",rt.append(o)}return xd(i,n).then(o=>{rt.data=o,o.length!==0&&rt.dispatchEvent(wd)}),y`${rt}`},Ed=e=>$t.create($d,e),Cd=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:Ed},Symbol.toStringTag,{value:"Module"})),on=async(e,t,i,n)=>{var s;const o=[],r=e.get(st),a=await t.getProperties(i);if(!a)return o;const{type:l}=a,d={data:{Entity:ri[l],Name:(s=a.Name)==null?void 0:s.value,modelID:t.uuid,expressID:i}};for(const h of n){const c=r.getEntityRelations(t,i,h);if(!c)continue;d.children||(d.children=[]),d.data.relations=JSON.stringify(c);const u={};for(const p of c){const b=await on(e,t,p,n);for(const _ of b)if(_.data.relations)d.children.push(_);else{const g=t.data.get(p);if(!g){d.children.push(_);continue}const m=g[1][1],v=ri[m];v in u||(u[v]=[]),_.data.Entity=_.data.Name,delete _.data.Name,u[v].push(_)}}for(const p in u){const b=u[p],_=b.map(m=>m.data.expressID),g={data:{Entity:p,modelID:t.uuid,relations:JSON.stringify(_)},children:b};d.children.push(g)}}return o.push(d),o},Ad=async(e,t,i,n)=>{const s=e.get(st),o=[];for(const r of t){let a;if(n)a={data:{Entity:r.name!==""?r.name:r.uuid},children:await on(e,r,n,i)};else{const l=s.relationMaps[r.uuid],d=await r.getAllPropertiesOfType(zr);if(!(l&&d))continue;const{expressID:h}=Object.values(d)[0];a={data:{Entity:r.name!==""?r.name:r.uuid},children:await on(e,r,h,i)}}o.push(a)}return o};let at;const Sd=(e,t)=>{const i=e.get(zt),{modelID:n,expressID:s,relations:o}=t.data;if(!n)return null;const r=i.groups.get(n);return r?r.getFragmentMap([s,...JSON.parse(o??"[]")]):null},kd=e=>{const{components:t,models:i,expressID:n}=e,s=e.selectHighlighterName??"select",o=e.hoverHighlighterName??"hover";at||(at=document.createElement("bim-table"),at.hiddenColumns=["modelID","expressID","relations"],at.columns=["Entity","Name"],at.headersHidden=!0,at.addEventListener("cellcreated",({detail:a})=>{const{cell:l}=a;l.column==="Entity"&&!("Name"in l.rowData)&&(l.style.gridColumn="1 / -1")})),at.addEventListener("rowcreated",a=>{a.stopImmediatePropagation();const{row:l}=a.detail,d=t.get(Vr),h=Sd(t,l);h&&Object.keys(h).length!==0&&(l.onmouseover=()=>{o&&(l.style.backgroundColor="var(--bim-ui_bg-contrast-20)",d.highlightByID(o,h,!0,!1,d.selection[s]??{}))},l.onmouseout=()=>{l.style.backgroundColor="",d.clear(o)},l.onclick=()=>{s&&d.highlightByID(s,h,!0,!0)})});const r=e.inverseAttributes??["IsDecomposedBy","ContainsElements"];return Ad(t,i,r,n).then(a=>at.data=a),y`${at}`},Od=(e,t=!0)=>{const i=$t.create(kd,e);if(t){const[,n]=i,{components:s}=e,o=s.get(zt),r=s.get(st),a=()=>n({models:o.groups.values()});r.onRelationsIndexed.add(a),o.onFragmentsDisposed.add(a)}return i},Td=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:Od},Symbol.toStringTag,{value:"Module"})),ye=(e,t)=>[...e.get(kr).list.values()].find(i=>i.world===t),Nd=(e,t)=>y`
    <bim-color-input @input=${i=>{const n=i.target;e.color=new Re(n.color)}} color=${t}></bim-color-input>
  `,Pd=(e,t)=>{const{postproduction:i}=e,n=i.n8ao.configuration;return y`
    <bim-color-input @input=${s=>{const o=s.target;n.color=new Re(o.color)}} color=${t}></bim-color-input>
  `},Id=(e,t)=>{const{color:i,opacity:n}=JSON.parse(t),{postproduction:s}=e,{customEffects:o}=s;return y`
    <bim-color-input @input=${r=>{const{color:a,opacity:l}=r.target;o.lineColor=new Re(a).getHex(),l&&(o.opacity=l/100)}} color=${i} opacity=${n*100}></bim-color-input>
  `},Md=(e,t)=>y`
    <bim-color-input @input=${i=>{const n=i.target,s=new Re(n.color);e.material.uniforms.uColor.value=s}} color=${t}></bim-color-input>
  `,Ld=(e,t)=>{const{postproduction:i}=e;return y`
    <bim-checkbox @change=${n=>{const s=n.target;i.setPasses({ao:s.checked})}} .checked=${t}></bim-checkbox>
  `},Rd=(e,t)=>{const{postproduction:i}=e;return y`
    <bim-checkbox @change=${n=>{const s=n.target;i.setPasses({gamma:s.checked})}} .checked=${t}></bim-checkbox>
  `},zd=(e,t)=>{const{postproduction:i}=e;return y`
    <bim-checkbox @change=${n=>{const s=n.target;i.setPasses({custom:s.checked})}} .checked=${t}></bim-checkbox>
  `},mt=(e,t,i,n=()=>{})=>y`
    <bim-checkbox .checked="${i}" @change="${s=>{const o=s.target.checked;e[t]=o,n(o)}}"></bim-checkbox> 
  `,N=(e,t,i,n)=>{const s={slider:!1,min:0,max:100,step:1,prefix:null,suffix:null,onInputSet:()=>{},...n},{slider:o,min:r,max:a,step:l,suffix:d,prefix:h,onInputSet:c}=s;return y`
    <bim-number-input
      .pref=${h}
      .suffix=${d}
      .slider=${o} 
      min=${r} 
      value="${i}" 
      max=${a} 
      step=${l} 
      @change="${u=>{const p=u.target.value;e[t]=p,c(p)}}"
    ></bim-number-input> 
  `},jd=e=>{const{components:t}=e,i=t.get(rn);return y`<bim-table ${vt(async n=>{var s,o,r,a,l;if(!n)return;const d=n;d.preserveStructureOnFilter=!0,d.dataTransform={Value:(c,u)=>{const p=u.World,b=i.list.get(p);if(!b)return c;const{scene:_,camera:g,renderer:m}=b,v=u.Name;if(v==="Grid"&&u.IsGridConfig&&typeof c=="boolean"){const x=ye(t,b);return x?mt(x,"visible",c):c}if(v==="Color"&&u.IsGridConfig&&typeof c=="string"){const x=ye(t,b);return x?Md(x,c):c}if(v==="Distance"&&u.IsGridConfig&&typeof c=="number"){const x=ye(t,b);return x?N(x.material.uniforms.uDistance,"value",c,{slider:!0,min:300,max:1e3}):c}if(v==="Size"&&u.IsGridConfig&&typeof c=="string"){const x=ye(t,b);if(!x)return c;const{x:w,y:E}=JSON.parse(c),$=N(x.material.uniforms.uSize1,"value",w,{slider:!0,suffix:"m",prefix:"A",min:1,max:20}),C=N(x.material.uniforms.uSize2,"value",E,{slider:!0,suffix:"m",prefix:"B",min:1,max:20});return y`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${$}${C}</div>
          `}if(v==="Near Frustum"&&g.three instanceof Qe&&typeof c=="number"){const x=g.three;return N(g.three,"near",c,{slider:!0,min:.1,max:10,step:.1,onInputSet:()=>x.updateProjectionMatrix()})}if(v==="Far Frustum"&&g.three instanceof Qe&&typeof c=="number"){const x=g.three;return N(g.three,"far",c,{slider:!0,min:300,max:2e3,step:10,onInputSet:()=>x.updateProjectionMatrix()})}if(v==="Field of View"&&g.three instanceof Qe&&typeof c=="number"){const x=g.three;return N(g.three,"fov",c,{slider:!0,min:10,max:120,onInputSet:()=>x.updateProjectionMatrix()})}if(v==="Invert Drag"&&g.hasCameraControls()&&typeof c=="boolean")return mt(g.controls,"dollyDragInverted",c);if(v==="Dolly Speed"&&g.hasCameraControls()&&typeof c=="number")return N(g.controls,"dollySpeed",c,{slider:!0,min:.5,max:3,step:.1});if(v==="Truck Speed"&&g.hasCameraControls()&&typeof c=="number")return N(g.controls,"truckSpeed",c,{slider:!0,min:.5,max:6,step:.1});if(v==="Smooth Time"&&g.hasCameraControls()&&typeof c=="number")return N(g.controls,"smoothTime",c,{slider:!0,min:.01,max:2,step:.01});if(v==="Intensity"&&typeof c=="number"){if(u.Light&&typeof u.Light=="string"){const x=_.three.children.find(w=>w.uuid===u.Light);return x&&x instanceof ge?N(x,"intensity",c,{slider:!0,min:0,max:10,step:.1}):c}if(u.IsAOConfig&&m instanceof M)return N(m.postproduction.n8ao.configuration,"intensity",c,{slider:!0,max:16,step:.1})}if(v==="Color"&&typeof c=="string"){const x=u.Light,w=_.three.children.find(E=>E.uuid===x);if(w&&w instanceof ge)return Nd(w,c);if(u.IsAOConfig&&m instanceof M)return Pd(m,c)}if(v==="Ambient Oclussion"&&typeof c=="boolean"&&u.IsAOConfig&&m instanceof M)return Ld(m,c);if(v==="Half Resolution"&&u.IsAOConfig&&m instanceof M&&typeof c=="boolean")return mt(m.postproduction.n8ao.configuration,"halfRes",c);if(v==="Screen Space Radius"&&u.IsAOConfig&&m instanceof M&&typeof c=="boolean")return mt(m.postproduction.n8ao.configuration,"screenSpaceRadius",c);if(v==="Radius"&&u.IsAOConfig&&m instanceof M&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"aoRadius",c,{slider:!0,max:2,step:.1});if(v==="Denoise Samples"&&u.IsAOConfig&&m instanceof M&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"denoiseSamples",c,{slider:!0,min:1,max:16});if(v==="Samples"&&u.IsAOConfig&&m instanceof M&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"aoSamples",c,{slider:!0,min:1,max:16});if(v==="Denoise Radius"&&u.IsAOConfig&&m instanceof M&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"denoiseRadius",c,{slider:!0,min:0,max:16,step:.1});if(v==="Distance Falloff"&&u.IsAOConfig&&m instanceof M&&typeof c=="number")return N(m.postproduction.n8ao.configuration,"distanceFalloff",c,{slider:!0,min:0,max:4,step:.1});if(v==="Directional Light"&&u.Light&&typeof u.Light=="string"&&typeof c=="boolean"){const x=_.three.children.find(w=>w.uuid===u.Light);return x&&x instanceof ge?mt(x,"visible",c):c}if(v==="Ambient Light"&&u.Light&&typeof u.Light=="string"&&typeof c=="boolean"){const x=_.three.children.find(w=>w.uuid===u.Light);return x&&x instanceof ge?mt(x,"visible",c):c}if(v==="Position"&&u.Light&&typeof u.Light=="string"&&typeof c=="string"){const x=_.three.children.find(S=>S.uuid===u.Light);if(!(x&&x instanceof ge))return c;const{x:w,y:E,z:$}=JSON.parse(c),C=N(x.position,"x",w,{slider:!0,prefix:"X",suffix:"m",min:-50,max:50}),P=N(x.position,"y",E,{slider:!0,prefix:"Y",suffix:"m",min:-50,max:50}),T=N(x.position,"z",$,{slider:!0,prefix:"Z",suffix:"m",min:-50,max:50});return y`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${C}${P}${T}</div>
          `}return v==="Custom Effects"&&u.IsCEConfig&&m instanceof M&&typeof c=="boolean"?zd(m,c):v==="Color"&&u.IsOutlineConfig&&m instanceof M&&typeof c=="string"?Id(m,c):v==="Tolerance"&&u.IsOutlineConfig&&m instanceof M&&typeof c=="number"?N(m.postproduction.customEffects,"tolerance",c,{slider:!0,min:0,max:6,step:.01}):v==="Outline"&&u.IsOutlineConfig&&m instanceof M&&typeof c=="boolean"?mt(m.postproduction.customEffects,"outlineEnabled",c):v==="Gloss"&&u.IsGlossConfig&&m instanceof M&&typeof c=="boolean"?mt(m.postproduction.customEffects,"glossEnabled",c):v==="Min"&&u.IsGlossConfig&&m instanceof M&&typeof c=="number"?N(m.postproduction.customEffects,"minGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):v==="Max"&&u.IsGlossConfig&&m instanceof M&&typeof c=="number"?N(m.postproduction.customEffects,"maxGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):v==="Exponent"&&u.IsGlossConfig&&m instanceof M&&typeof c=="number"?N(m.postproduction.customEffects,"glossExponent",c,{slider:!0,min:0,max:5,step:.01}):v==="Gamma Correction"&&u.IsGammaConfig&&m instanceof M&&typeof c=="boolean"?Rd(m,c):c}},d.addEventListener("cellcreated",({detail:c})=>{const u=c.cell.parentNode;if(!u)return;const p=u.querySelector("bim-table-cell[column='Name']"),b=u.querySelector("bim-table-cell[column='Value']");p&&!b&&(p.style.gridColumn="1 / -1")});const h=[];for(const[,c]of i.list){const{scene:u,camera:p,renderer:b}=c,_=ye(t,c),g={data:{Name:c instanceof Ar&&c.name||c.uuid},children:[]};if(u){const m={data:{Name:"Scene"}};if(_){const w={data:{Name:"Grid",Value:_.three.visible,World:c.uuid,IsGridConfig:!0},children:[{data:{Name:"Color",get Value(){return`#${_.material.uniforms.uColor.value.getHexString()}`},World:c.uuid,IsGridConfig:!0}},{data:{Name:"Size",get Value(){const E=_.material.uniforms.uSize1.value,$=_.material.uniforms.uSize2.value;return JSON.stringify({x:E,y:$})},World:c.uuid,IsGridConfig:!0}},{data:{Name:"Distance",Value:_.material.uniforms.uDistance.value,World:c.uuid,IsGridConfig:!0}}]};m.children||(m.children=[]),m.children.push(w)}const v=u.three.children.filter(w=>w instanceof Ir);for(const w of v){const E={data:{Name:"Directional Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Position",Value:JSON.stringify(w.position),World:c.uuid,Light:w.uuid}},{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};m.children||(m.children=[]),m.children.push(E)}const x=u.three.children.filter(w=>w instanceof Mr);for(const w of x){const E={data:{Name:"Ambient Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};m.children||(m.children=[]),m.children.push(E)}m.children&&((s=m.children)==null?void 0:s.length)>0&&((o=g.children)==null||o.push(m))}if(p.three instanceof Qe){const m={data:{Name:"Perspective Camera"},children:[{data:{Name:"Near Frustum",Value:p.three.near,World:c.uuid}},{data:{Name:"Far Frustum",Value:p.three.far,World:c.uuid}},{data:{Name:"Field of View",Value:p.three.fov,World:c.uuid}}]};if(p.hasCameraControls()){const{controls:v}=p,x={dollyDragInverted:"Invert Drag",dollySpeed:"Dolly Speed",truckSpeed:"Truck Speed",smoothTime:"Smooth Time"};for(const w in x){const E=v[w];E!=null&&((r=m.children)==null||r.push({data:{Name:x[w],Value:E,World:c.uuid}}))}}(a=g.children)==null||a.push(m)}if(b instanceof M){const{postproduction:m}=b,v=m.n8ao.configuration,x={data:{Name:"Renderer"},children:[{data:{Name:"Gamma Correction",Value:m.settings.gamma??!1,World:c.uuid,IsGammaConfig:!0}},{data:{Name:"Ambient Oclussion",Value:m.settings.ao??!1,World:c.uuid,IsAOConfig:!0},children:[{data:{Name:"Samples",Value:v.aoSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Color",Value:`#${v.color.getHexString()}`,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Half Resolution",Value:v.halfRes,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Screen Space Radius",Value:v.screenSpaceRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Radius",Value:v.aoRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Intensity",Value:v.intensity,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Distance Falloff",Value:v.distanceFalloff,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Samples",Value:v.denoiseSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Radius",Value:v.denoiseRadius,World:c.uuid,IsAOConfig:!0}}]},{data:{Name:"Custom Effects",Value:m.settings.custom??!1,World:c.uuid,IsCEConfig:!0},children:[{data:{Name:"Gloss",Value:m.customEffects.glossEnabled,World:c.uuid,IsGlossConfig:!0},children:[{data:{Name:"Min",Value:m.customEffects.minGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Max",Value:m.customEffects.maxGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Exponent",Value:m.customEffects.glossExponent,World:c.uuid,IsGlossConfig:!0}}]},{data:{Name:"Outline",Value:m.customEffects.outlineEnabled,World:c.uuid,IsOutlineConfig:!0},children:[{data:{Name:"Color",get Value(){const w=new Re(m.customEffects.lineColor),E=m.customEffects.opacity;return JSON.stringify({color:`#${w.getHexString()}`,opacity:E})},World:c.uuid,IsOutlineConfig:!0}},{data:{Name:"Tolerance",Value:m.customEffects.tolerance,World:c.uuid,IsOutlineConfig:!0}}]}]}]};(l=g.children)==null||l.push(x)}h.push(g)}d.columns=[{name:"Name",width:"11rem"}],d.hiddenColumns=["World","Light","IsAOConfig","IsCEConfig","IsGlossConfig","IsOutlineConfig","IsGammaConfig","IsGridConfig"],d.data=h})} headers-hidden expanded></bim-table>`},Hd=(e,t=!0)=>{const i=$t.create(jd,e);if(t){const[n]=i,s=()=>i[1](),{components:o}=e,r=o.get(rn);r.onDisposed.add(n.remove);for(const[,a]of r.list)a.onDisposed.add(s);n.addEventListener("disconnected",()=>{r.onDisposed.remove(n.remove);for(const[,a]of r.list)a.onDisposed.remove(s)})}return i},Dd=Object.freeze(Object.defineProperty({__proto__:null,worldsConfiguration:Hd},Symbol.toStringTag,{value:"Module"}));({...sd,...ad,...dd,...Cd,...Td,...Dd});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi=globalThis,$n=oi.ShadowRoot&&(oi.ShadyCSS===void 0||oi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,En=Symbol(),fs=new WeakMap;let cr=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==En)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if($n&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=fs.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&fs.set(t,e))}return e}toString(){return this.cssText}};const Bd=e=>new cr(typeof e=="string"?e:e+"",void 0,En),dr=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,s,o)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new cr(i,e,En)},Fd=(e,t)=>{if($n)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),s=oi.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)}},ms=$n?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Bd(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ud,defineProperty:Vd,getOwnPropertyDescriptor:Wd,getOwnPropertyNames:qd,getOwnPropertySymbols:Gd,getPrototypeOf:Yd}=Object,ee=globalThis,bs=ee.trustedTypes,Xd=bs?bs.emptyScript:"",gs=ee.reactiveElementPolyfillSupport,Ce=(e,t)=>e,gi={toAttribute(e,t){switch(t){case Boolean:e=e?Xd:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},Cn=(e,t)=>!Ud(e,t),vs={attribute:!0,type:String,converter:gi,reflect:!1,hasChanged:Cn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ee.litPropertyMetadata??(ee.litPropertyMetadata=new WeakMap);class Ut extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=vs){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),s=this.getPropertyDescriptor(t,n,i);s!==void 0&&Vd(this.prototype,t,s)}}static getPropertyDescriptor(t,i,n){const{get:s,set:o}=Wd(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return s==null?void 0:s.call(this)},set(r){const a=s==null?void 0:s.call(this);o.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??vs}static _$Ei(){if(this.hasOwnProperty(Ce("elementProperties")))return;const t=Yd(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ce("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ce("properties"))){const i=this.properties,n=[...qd(i),...Gd(i)];for(const s of n)this.createProperty(s,i[s])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,s]of i)this.elementProperties.set(n,s)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const s=this._$Eu(i,n);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const s of n)i.unshift(ms(s))}else t!==void 0&&i.push(ms(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fd(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const r=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:gi).toAttribute(i,s.type);this._$Em=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$Em=null}}_$AK(t,i){var n;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const r=s.getPropertyOptions(o),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:gi;this._$Em=o,this[o]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??Cn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,r]of s)r.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(n)):this._$EU()}catch(s){throw i=!1,this._$EU(),s}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var s;return(s=n.hostUpdated)==null?void 0:s.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Ut.elementStyles=[],Ut.shadowRootOptions={mode:"open"},Ut[Ce("elementProperties")]=new Map,Ut[Ce("finalized")]=new Map,gs==null||gs({ReactiveElement:Ut}),(ee.reactiveElementVersions??(ee.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vi=globalThis,yi=vi.trustedTypes,ys=yi?yi.createPolicy("lit-html",{createHTML:e=>e}):void 0,hr="$lit$",gt=`lit$${Math.random().toFixed(9).slice(2)}$`,ur="?"+gt,Jd=`<${ur}>`,Rt=document,Ie=()=>Rt.createComment(""),Me=e=>e===null||typeof e!="object"&&typeof e!="function",An=Array.isArray,Qd=e=>An(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Fi=`[ 	
\f\r]`,_e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_s=/-->/g,xs=/>/g,Tt=RegExp(`>|${Fi}(?:([^\\s"'>=/]+)(${Fi}*=${Fi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ws=/'/g,$s=/"/g,pr=/^(?:script|style|textarea|title)$/i,Zd=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),fr=Zd(1),ie=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Es=new WeakMap,Pt=Rt.createTreeWalker(Rt,129);function mr(e,t){if(!An(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ys!==void 0?ys.createHTML(t):t}const Kd=(e,t)=>{const i=e.length-1,n=[];let s,o=t===2?"<svg>":t===3?"<math>":"",r=_e;for(let a=0;a<i;a++){const l=e[a];let d,h,c=-1,u=0;for(;u<l.length&&(r.lastIndex=u,h=r.exec(l),h!==null);)u=r.lastIndex,r===_e?h[1]==="!--"?r=_s:h[1]!==void 0?r=xs:h[2]!==void 0?(pr.test(h[2])&&(s=RegExp("</"+h[2],"g")),r=Tt):h[3]!==void 0&&(r=Tt):r===Tt?h[0]===">"?(r=s??_e,c=-1):h[1]===void 0?c=-2:(c=r.lastIndex-h[2].length,d=h[1],r=h[3]===void 0?Tt:h[3]==='"'?$s:ws):r===$s||r===ws?r=Tt:r===_s||r===xs?r=_e:(r=Tt,s=void 0);const p=r===Tt&&e[a+1].startsWith("/>")?" ":"";o+=r===_e?l+Jd:c>=0?(n.push(d),l.slice(0,c)+hr+l.slice(c)+gt+p):l+gt+(c===-2?a:p)}return[mr(e,o+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Le{constructor({strings:t,_$litType$:i},n){let s;this.parts=[];let o=0,r=0;const a=t.length-1,l=this.parts,[d,h]=Kd(t,i);if(this.el=Le.createElement(d,n),Pt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=Pt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const c of s.getAttributeNames())if(c.endsWith(hr)){const u=h[r++],p=s.getAttribute(c).split(gt),b=/([.?@])?(.*)/.exec(u);l.push({type:1,index:o,name:b[2],strings:p,ctor:b[1]==="."?eh:b[1]==="?"?ih:b[1]==="@"?nh:Ii}),s.removeAttribute(c)}else c.startsWith(gt)&&(l.push({type:6,index:o}),s.removeAttribute(c));if(pr.test(s.tagName)){const c=s.textContent.split(gt),u=c.length-1;if(u>0){s.textContent=yi?yi.emptyScript:"";for(let p=0;p<u;p++)s.append(c[p],Ie()),Pt.nextNode(),l.push({type:2,index:++o});s.append(c[u],Ie())}}}else if(s.nodeType===8)if(s.data===ur)l.push({type:2,index:o});else{let c=-1;for(;(c=s.data.indexOf(gt,c+1))!==-1;)l.push({type:7,index:o}),c+=gt.length-1}o++}}static createElement(t,i){const n=Rt.createElement("template");return n.innerHTML=t,n}}function ne(e,t,i=e,n){var s,o;if(t===ie)return t;let r=n!==void 0?(s=i.o)==null?void 0:s[n]:i.l;const a=Me(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((o=r==null?void 0:r._$AO)==null||o.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i.o??(i.o=[]))[n]=r:i.l=r),r!==void 0&&(t=ne(e,r._$AS(e,t.values),r,n)),t}class th{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,s=((t==null?void 0:t.creationScope)??Rt).importNode(i,!0);Pt.currentNode=s;let o=Pt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new Ye(o,o.nextSibling,this,t):l.type===1?d=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(d=new sh(o,this,t)),this._$AV.push(d),l=n[++a]}r!==(l==null?void 0:l.index)&&(o=Pt.nextNode(),r++)}return Pt.currentNode=Rt,s}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class Ye{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,i,n,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=ne(this,t,i),Me(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==ie&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qd(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==z&&Me(this._$AH)?this._$AA.nextSibling.data=t:this.T(Rt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Le.createElement(mr(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===o)this._$AH.p(n);else{const r=new th(o,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=Es.get(t.strings);return i===void 0&&Es.set(t.strings,i=new Le(t)),i}k(t){An(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,s=0;for(const o of t)s===i.length?i.push(n=new Ye(this.O(Ie()),this.O(Ie()),this,this.options)):n=i[s],n._$AI(o),s++;s<i.length&&(this._$AR(n&&n._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var i;this._$AM===void 0&&(this.v=t,(i=this._$AP)==null||i.call(this,t))}}class Ii{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,s,o){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}_$AI(t,i=this,n,s){const o=this.strings;let r=!1;if(o===void 0)t=ne(this,t,i,0),r=!Me(t)||t!==this._$AH&&t!==ie,r&&(this._$AH=t);else{const a=t;let l,d;for(t=o[0],l=0;l<o.length-1;l++)d=ne(this,a[n+l],i,l),d===ie&&(d=this._$AH[l]),r||(r=!Me(d)||d!==this._$AH[l]),d===z?t=z:t!==z&&(t+=(d??"")+o[l+1]),this._$AH[l]=d}r&&!s&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class eh extends Ii{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class ih extends Ii{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class nh extends Ii{constructor(t,i,n,s,o){super(t,i,n,s,o),this.type=5}_$AI(t,i=this){if((t=ne(this,t,i,0)??z)===ie)return;const n=this._$AH,s=t===z&&n!==z||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==z&&(n===z||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class sh{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){ne(this,t)}}const Cs=vi.litHtmlPolyfillSupport;Cs==null||Cs(Le,Ye),(vi.litHtmlVersions??(vi.litHtmlVersions=[])).push("3.2.0");const oh=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let s=n._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;n._$litPart$=s=new Ye(t.insertBefore(Ie(),o),o,void 0,i??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class qt extends Ut{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const i=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=oh(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return ie}}var As;qt._$litElement$=!0,qt.finalized=!0,(As=globalThis.litElementHydrateSupport)==null||As.call(globalThis,{LitElement:qt});const Ss=globalThis.litElementPolyfillSupport;Ss==null||Ss({LitElement:qt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rh={attribute:!0,type:String,converter:gi,reflect:!1,hasChanged:Cn},ah=(e=rh,t,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function U(e){return(t,i)=>typeof i=="object"?ah(e,t,i):((n,s,o)=>{const r=s.hasOwnProperty(o);return s.constructor.createProperty(o,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(s,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lh(e){return U({...e,state:!0,attribute:!1})}class ch extends Lr{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new Rr(.5,.5),this.addEventListener("removed",function(){this.traverse(function(i){i.element instanceof Element&&i.element.parentNode!==null&&i.element.parentNode.removeChild(i.element)})})}copy(t,i){return super.copy(t,i),this.element=t.element.cloneNode(!0),this.center=t.center,this}}new an;new _i;new _i;new an;new an;class dh{constructor(t,i){this._group=new Sn,this._frustum=new Or,this._frustumMat=new _i,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new Tr({color:"#2e3338"}),this.numbers=new Sn,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._offsetX=0,this._offsetY=0,this._camera=t,this._container=i;const n=this.newGrid(-1),s=this.newGrid(-2);this.grids={main:n,secondary:s},this._group.add(s,n,this.numbers)}set scaleX(t){this._scaleX=t,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(t){this._scaleY=t,this.regenerate()}get scaleY(){return this._scaleY}set offsetX(t){this._offsetX=t,this.regenerate()}get offsetX(){return this._offsetX}set offsetY(t){this._offsetY=t,this.regenerate()}get offsetY(){return this._offsetY}get(){return this._group}dispose(){const{main:t,secondary:i}=this.grids;t.removeFromParent(),i.removeFromParent(),t.geometry.dispose(),t.material.dispose(),i.geometry.dispose(),i.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const t=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(t);const{planes:i}=this._frustum,n=i[0].constant*-i[0].normal.x,s=i[1].constant*-i[1].normal.x,o=i[2].constant*-i[2].normal.y,r=i[3].constant*-i[3].normal.y,a=Math.abs(n-s),l=Math.abs(r-o),{clientWidth:d,clientHeight:h}=this._container,c=Math.max(d,h),u=Math.max(a,l)/c,p=Math.ceil(Math.log10(a/this.scaleX)),b=Math.ceil(Math.log10(l/this.scaleY)),_=10**(p-2)*this.scaleX,g=10**(b-2)*this.scaleY,m=_*this.gridsFactor,v=g*this.gridsFactor,x=Math.ceil(l/v),w=Math.ceil(a/m),E=Math.ceil(l/g),$=Math.ceil(a/_),C=_*Math.ceil(s/_),P=g*Math.ceil(o/g),T=m*Math.ceil(s/m),S=v*Math.ceil(o/v),J=[...this.numbers.children];for(const H of J)H.removeFromParent();this.numbers.children=[];const D=[],pt=9*u,L=1e4,ot=T+this._offsetX,K=Math.round(Math.abs(ot/this.scaleX)*L)/L,tt=(w-1)*m,V=Math.round(Math.abs((ot+tt)/this.scaleX)*L)/L,et=Math.max(K,V).toString().length*pt;let me=Math.ceil(et/m)*m;for(let H=0;H<w;H++){let R=T+H*m;D.push(R,r,0,R,o,0),R=Math.round(R*L)/L,me=Math.round(me*L)/L;const be=R%me;if(!(m<1||v<1)&&Math.abs(be)>.01)continue;const Je=this.newNumber((R+this._offsetX)/this.scaleX),Li=12*u;Je.position.set(R,o+Li,0)}for(let H=0;H<x;H++){const R=S+H*v;D.push(s,R,0,n,R,0);const be=this.newNumber(R/this.scaleY);let Je=12;be.element.textContent&&(Je+=4*be.element.textContent.length);const Li=Je*u;be.position.set(s+Li,R,0)}const Mi=[];for(let H=0;H<$;H++){const R=C+H*_;Mi.push(R,r,0,R,o,0)}for(let H=0;H<E;H++){const R=P+H*g;Mi.push(s,R,0,n,R,0)}const vr=new kn(new Float32Array(D),3),yr=new kn(new Float32Array(Mi),3),{main:_r,secondary:xr}=this.grids;_r.geometry.setAttribute("position",vr),xr.geometry.setAttribute("position",yr)}newNumber(t){const i=document.createElement("bim-label");i.textContent=String(Math.round(t*100)/100);const n=new ch(i);return this.numbers.add(n),n}newGrid(t){const i=new Nr,n=new Pr(i,this.material);return n.frustumCulled=!1,n.renderOrder=t,n}isGridReady(){const t=this._camera.projectionMatrix.elements;for(let i=0;i<t.length;i++){const n=t[i];if(Number.isNaN(n))return!1}return!0}}var hh=Object.defineProperty,uh=Object.getOwnPropertyDescriptor,Xe=(e,t,i,n)=>{for(var s=uh(t,i),o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&hh(t,i,s),s};const br=class extends qt{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(t){if(this._gridColor=t,!(t&&this._grid))return;const i=Number(t.replace("#","0x"));Number.isNaN(i)||this._grid.material.color.setHex(i)}get gridColor(){return this._gridColor}set gridScaleX(t){this._gridScaleX=t,t&&this._grid&&(this._grid.scaleX=t)}get gridScaleX(){return this._gridScaleX}set gridScaleY(t){this._gridScaleY=t,t&&this._grid&&(this._grid.scaleY=t)}get gridScaleY(){return this._gridScaleY}get gridOffsetX(){var t;return((t=this._grid)==null?void 0:t.offsetX)||0}set gridOffsetX(t){this._grid&&(this._grid.offsetX=t)}get gridOffsetY(){var t;return((t=this._grid)==null?void 0:t.offsetY)||0}set gridOffsetY(t){this._grid&&(this._grid.offsetY=t)}set components(t){this.dispose();const i=t.get(rn).create();this._world=i,i.scene=new wr(t),i.scene.setup(),i.renderer=new Ur(t,this);const n=new $r(t);i.camera=n;const s=new dh(n.threeOrtho,this);this._grid=s,i.scene.three.add(s.get()),n.controls.addEventListener("update",()=>s.regenerate()),setTimeout(async()=>{i.camera.updateAspect(),n.set("Plan"),await n.controls.setLookAt(0,0,100,0,0,0),await n.projection.set("Orthographic"),n.controls.dollySpeed=3,n.controls.draggingSmoothTime=.085,n.controls.maxZoom=1e3,n.controls.zoom(4)})}get world(){return this._world}dispose(){var t;(t=this.world)==null||t.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return fr`<slot></slot>`}};br.styles=dr`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let fe=br;Xe([U({type:String,attribute:"grid-color",reflect:!0})],fe.prototype,"gridColor");Xe([U({type:Number,attribute:"grid-scale-x",reflect:!0})],fe.prototype,"gridScaleX");Xe([U({type:Number,attribute:"grid-scale-y",reflect:!0})],fe.prototype,"gridScaleY");Xe([U({type:Number,attribute:"grid-offset-x",reflect:!0})],fe.prototype,"gridOffsetX");Xe([U({type:Number,attribute:"grid-offset-y",reflect:!0})],fe.prototype,"gridOffsetY");var ph=Object.defineProperty,St=(e,t,i,n)=>{for(var s=void 0,o=e.length-1,r;o>=0;o--)(r=e[o])&&(s=r(t,i,s)||s);return s&&ph(t,i,s),s};const gr=class extends qt{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new _i,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=t=>Math.abs(t)<1e-10?0:t}set camera(t){this._camera=t,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:t}=this._matrix;this._cssMatrix3D=`matrix3d(
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
    `}render(){const t=this.size??this._defaults.size;return fr`
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
    `}};gr.styles=dr`
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
  `;let ut=gr;St([U({type:Number,reflect:!0})],ut.prototype,"size");St([U({type:String,attribute:"right-text",reflect:!0})],ut.prototype,"rightText");St([U({type:String,attribute:"left-text",reflect:!0})],ut.prototype,"leftText");St([U({type:String,attribute:"top-text",reflect:!0})],ut.prototype,"topText");St([U({type:String,attribute:"bottom-text",reflect:!0})],ut.prototype,"bottomText");St([U({type:String,attribute:"front-text",reflect:!0})],ut.prototype,"frontText");St([U({type:String,attribute:"back-text",reflect:!0})],ut.prototype,"backText");St([lh()],ut.prototype,"_cssMatrix3D");class yh{static init(){sn.defineCustomElement("bim-view-cube",ut),sn.defineCustomElement("bim-world-2d",fe)}}export{yh as g};
