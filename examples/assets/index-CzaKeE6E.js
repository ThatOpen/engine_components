import{M as He,i as $n,T as Ni,e as Qo,P as Ko,y as Zo,a as Ht,G as ct,b as ea,D as ts,L as ia,B as na,Q as oa,R as vt,d as pi}from"./index-CC2Loeen.js";import{V as Cn,c as Ii,C as ae,G as qn,F as sa,L as ra,d as Yn,e as aa,f as la,P as ni,g as _e,D as ca,A as da,O as ua,h as ha,I as pa,R as ma,i as es,j as is,k as ba,l as ns,m as fa,n as ga,o as os,p as ss,q as va,r as ya}from"./web-ifc-api-Df2dhA4n.js";import{r as _a,x as R,p as xa}from"./index-CQOV9xGw.js";var wa=Object.defineProperty,$a=(e,t,i)=>t in e?wa(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,Nt=(e,t,i)=>($a(e,typeof t!="symbol"?t+"":t,i),i);const Jt=Math.min,ht=Math.max,mi=Math.round,$t=e=>({x:e,y:e}),Ca={left:"right",right:"left",bottom:"top",top:"bottom"},Aa={start:"end",end:"start"};function Xn(e,t,i){return ht(e,Jt(t,i))}function Ue(e,t){return typeof e=="function"?e(t):e}function mt(e){return e.split("-")[0]}function Pi(e){return e.split("-")[1]}function rs(e){return e==="x"?"y":"x"}function as(e){return e==="y"?"height":"width"}function jt(e){return["top","bottom"].includes(mt(e))?"y":"x"}function ls(e){return rs(jt(e))}function Ea(e,t,i){i===void 0&&(i=!1);const n=Pi(e),o=ls(e),s=as(o);let r=o==="x"?n===(i?"end":"start")?"right":"left":n==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(r=bi(r)),[r,bi(r)]}function Sa(e){const t=bi(e);return[rn(e),t,rn(t)]}function rn(e){return e.replace(/start|end/g,t=>Aa[t])}function ka(e,t,i){const n=["left","right"],o=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(e){case"top":case"bottom":return i?t?o:n:t?n:o;case"left":case"right":return t?s:r;default:return[]}}function Ta(e,t,i,n){const o=Pi(e);let s=ka(mt(e),i==="start",n);return o&&(s=s.map(r=>r+"-"+o),t&&(s=s.concat(s.map(rn)))),s}function bi(e){return e.replace(/left|right|bottom|top/g,t=>Ca[t])}function Oa(e){return{top:0,right:0,bottom:0,left:0,...e}}function cs(e){return typeof e!="number"?Oa(e):{top:e,right:e,bottom:e,left:e}}function Qt(e){const{x:t,y:i,width:n,height:o}=e;return{width:n,height:o,top:i,left:t,right:t+n,bottom:i+o,x:t,y:i}}function Jn(e,t,i){let{reference:n,floating:o}=e;const s=jt(t),r=ls(t),a=as(r),l=mt(t),d=s==="y",u=n.x+n.width/2-o.width/2,c=n.y+n.height/2-o.height/2,h=n[a]/2-o[a]/2;let p;switch(l){case"top":p={x:u,y:n.y-o.height};break;case"bottom":p={x:u,y:n.y+n.height};break;case"right":p={x:n.x+n.width,y:c};break;case"left":p={x:n.x-o.width,y:c};break;default:p={x:n.x,y:n.y}}switch(Pi(t)){case"start":p[r]-=h*(i&&d?-1:1);break;case"end":p[r]+=h*(i&&d?-1:1);break}return p}const Na=async(e,t,i)=>{const{placement:n="bottom",strategy:o="absolute",middleware:s=[],platform:r}=i,a=s.filter(Boolean),l=await(r.isRTL==null?void 0:r.isRTL(t));let d=await r.getElementRects({reference:e,floating:t,strategy:o}),{x:u,y:c}=Jn(d,n,l),h=n,p={},b=0;for(let v=0;v<a.length;v++){const{name:y,fn:g}=a[v],{x:_,y:x,data:w,reset:A}=await g({x:u,y:c,initialPlacement:n,placement:h,strategy:o,middlewareData:p,rects:d,platform:r,elements:{reference:e,floating:t}});u=_??u,c=x??c,p={...p,[y]:{...p[y],...w}},A&&b<=50&&(b++,typeof A=="object"&&(A.placement&&(h=A.placement),A.rects&&(d=A.rects===!0?await r.getElementRects({reference:e,floating:t,strategy:o}):A.rects),{x:u,y:c}=Jn(d,h,l)),v=-1)}return{x:u,y:c,placement:h,strategy:o,middlewareData:p}};async function ds(e,t){var i;t===void 0&&(t={});const{x:n,y:o,platform:s,rects:r,elements:a,strategy:l}=e,{boundary:d="clippingAncestors",rootBoundary:u="viewport",elementContext:c="floating",altBoundary:h=!1,padding:p=0}=Ue(t,e),b=cs(p),v=a[h?c==="floating"?"reference":"floating":c],y=Qt(await s.getClippingRect({element:(i=await(s.isElement==null?void 0:s.isElement(v)))==null||i?v:v.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:d,rootBoundary:u,strategy:l})),g=c==="floating"?{x:n,y:o,width:r.floating.width,height:r.floating.height}:r.reference,_=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),x=await(s.isElement==null?void 0:s.isElement(_))?await(s.getScale==null?void 0:s.getScale(_))||{x:1,y:1}:{x:1,y:1},w=Qt(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:g,offsetParent:_,strategy:l}):g);return{top:(y.top-w.top+b.top)/x.y,bottom:(w.bottom-y.bottom+b.bottom)/x.y,left:(y.left-w.left+b.left)/x.x,right:(w.right-y.right+b.right)/x.x}}const Ia=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var i,n;const{placement:o,middlewareData:s,rects:r,initialPlacement:a,platform:l,elements:d}=t,{mainAxis:u=!0,crossAxis:c=!0,fallbackPlacements:h,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:b="none",flipAlignment:v=!0,...y}=Ue(e,t);if((i=s.arrow)!=null&&i.alignmentOffset)return{};const g=mt(o),_=jt(a),x=mt(a)===a,w=await(l.isRTL==null?void 0:l.isRTL(d.floating)),A=h||(x||!v?[bi(a)]:Sa(a)),C=b!=="none";!h&&C&&A.push(...Ta(a,v,b,w));const N=[a,...A],L=await ds(t,y),k=[];let S=((n=s.flip)==null?void 0:n.overflows)||[];if(u&&k.push(L[g]),c){const $=Ea(o,r,w);k.push(L[$[0]],L[$[1]])}if(S=[...S,{placement:o,overflows:k}],!k.every($=>$<=0)){var H,E;const $=(((H=s.flip)==null?void 0:H.index)||0)+1,et=N[$];if(et)return{data:{index:$,overflows:S},reset:{placement:et}};let ot=(E=S.filter(st=>st.overflows[0]<=0).sort((st,X)=>st.overflows[1]-X.overflows[1])[0])==null?void 0:E.placement;if(!ot)switch(p){case"bestFit":{var M;const st=(M=S.filter(X=>{if(C){const rt=jt(X.placement);return rt===_||rt==="y"}return!0}).map(X=>[X.placement,X.overflows.filter(rt=>rt>0).reduce((rt,ve)=>rt+ve,0)]).sort((X,rt)=>X[1]-rt[1])[0])==null?void 0:M[0];st&&(ot=st);break}case"initialPlacement":ot=a;break}if(o!==ot)return{reset:{placement:ot}}}return{}}}};function us(e){const t=Jt(...e.map(s=>s.left)),i=Jt(...e.map(s=>s.top)),n=ht(...e.map(s=>s.right)),o=ht(...e.map(s=>s.bottom));return{x:t,y:i,width:n-t,height:o-i}}function Pa(e){const t=e.slice().sort((o,s)=>o.y-s.y),i=[];let n=null;for(let o=0;o<t.length;o++){const s=t[o];!n||s.y-n.y>n.height/2?i.push([s]):i[i.length-1].push(s),n=s}return i.map(o=>Qt(us(o)))}const Ma=function(e){return e===void 0&&(e={}),{name:"inline",options:e,async fn(t){const{placement:i,elements:n,rects:o,platform:s,strategy:r}=t,{padding:a=2,x:l,y:d}=Ue(e,t),u=Array.from(await(s.getClientRects==null?void 0:s.getClientRects(n.reference))||[]),c=Pa(u),h=Qt(us(u)),p=cs(a);function b(){if(c.length===2&&c[0].left>c[1].right&&l!=null&&d!=null)return c.find(y=>l>y.left-p.left&&l<y.right+p.right&&d>y.top-p.top&&d<y.bottom+p.bottom)||h;if(c.length>=2){if(jt(i)==="y"){const S=c[0],H=c[c.length-1],E=mt(i)==="top",M=S.top,$=H.bottom,et=E?S.left:H.left,ot=E?S.right:H.right,st=ot-et,X=$-M;return{top:M,bottom:$,left:et,right:ot,width:st,height:X,x:et,y:M}}const y=mt(i)==="left",g=ht(...c.map(S=>S.right)),_=Jt(...c.map(S=>S.left)),x=c.filter(S=>y?S.left===_:S.right===g),w=x[0].top,A=x[x.length-1].bottom,C=_,N=g,L=N-C,k=A-w;return{top:w,bottom:A,left:C,right:N,width:L,height:k,x:C,y:w}}return h}const v=await s.getElementRects({reference:{getBoundingClientRect:b},floating:n.floating,strategy:r});return o.reference.x!==v.reference.x||o.reference.y!==v.reference.y||o.reference.width!==v.reference.width||o.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function La(e,t){const{placement:i,platform:n,elements:o}=e,s=await(n.isRTL==null?void 0:n.isRTL(o.floating)),r=mt(i),a=Pi(i),l=jt(i)==="y",d=["left","top"].includes(r)?-1:1,u=s&&l?-1:1,c=Ue(t,e);let{mainAxis:h,crossAxis:p,alignmentAxis:b}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...c};return a&&typeof b=="number"&&(p=a==="end"?b*-1:b),l?{x:p*u,y:h*d}:{x:h*d,y:p*u}}const hs=function(e){return{name:"offset",options:e,async fn(t){var i,n;const{x:o,y:s,placement:r,middlewareData:a}=t,l=await La(t,e);return r===((i=a.offset)==null?void 0:i.placement)&&(n=a.arrow)!=null&&n.alignmentOffset?{}:{x:o+l.x,y:s+l.y,data:{...l,placement:r}}}}},Ra=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:i,y:n,placement:o}=t,{mainAxis:s=!0,crossAxis:r=!1,limiter:a={fn:y=>{let{x:g,y:_}=y;return{x:g,y:_}}},...l}=Ue(e,t),d={x:i,y:n},u=await ds(t,l),c=jt(mt(o)),h=rs(c);let p=d[h],b=d[c];if(s){const y=h==="y"?"top":"left",g=h==="y"?"bottom":"right",_=p+u[y],x=p-u[g];p=Xn(_,p,x)}if(r){const y=c==="y"?"top":"left",g=c==="y"?"bottom":"right",_=b+u[y],x=b-u[g];b=Xn(_,b,x)}const v=a.fn({...t,[h]:p,[c]:b});return{...v,data:{x:v.x-i,y:v.y-n}}}}};function Ct(e){return ps(e)?(e.nodeName||"").toLowerCase():"#document"}function q(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Et(e){var t;return(t=(ps(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function ps(e){return e instanceof Node||e instanceof q(e).Node}function at(e){return e instanceof Element||e instanceof q(e).Element}function lt(e){return e instanceof HTMLElement||e instanceof q(e).HTMLElement}function Qn(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof q(e).ShadowRoot}function Ve(e){const{overflow:t,overflowX:i,overflowY:n,display:o}=Q(e);return/auto|scroll|overlay|hidden|clip/.test(t+n+i)&&!["inline","contents"].includes(o)}function Da(e){return["table","td","th"].includes(Ct(e))}function ja(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch{return!1}})}function An(e){const t=En(),i=at(e)?Q(e):e;return i.transform!=="none"||i.perspective!=="none"||(i.containerType?i.containerType!=="normal":!1)||!t&&(i.backdropFilter?i.backdropFilter!=="none":!1)||!t&&(i.filter?i.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(i.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(i.contain||"").includes(n))}function za(e){let t=Kt(e);for(;lt(t)&&!Mi(t);){if(An(t))return t;if(ja(t))return null;t=Kt(t)}return null}function En(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Mi(e){return["html","body","#document"].includes(Ct(e))}function Q(e){return q(e).getComputedStyle(e)}function Li(e){return at(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Kt(e){if(Ct(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Qn(e)&&e.host||Et(e);return Qn(t)?t.host:t}function ms(e){const t=Kt(e);return Mi(t)?e.ownerDocument?e.ownerDocument.body:e.body:lt(t)&&Ve(t)?t:ms(t)}function an(e,t,i){var n;t===void 0&&(t=[]),i===void 0&&(i=!0);const o=ms(e),s=o===((n=e.ownerDocument)==null?void 0:n.body),r=q(o);if(s){const a=Fa(r);return t.concat(r,r.visualViewport||[],Ve(o)?o:[],a&&i?an(a):[])}return t.concat(o,an(o,[],i))}function Fa(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function bs(e){const t=Q(e);let i=parseFloat(t.width)||0,n=parseFloat(t.height)||0;const o=lt(e),s=o?e.offsetWidth:i,r=o?e.offsetHeight:n,a=mi(i)!==s||mi(n)!==r;return a&&(i=s,n=r),{width:i,height:n,$:a}}function fs(e){return at(e)?e:e.contextElement}function Xt(e){const t=fs(e);if(!lt(t))return $t(1);const i=t.getBoundingClientRect(),{width:n,height:o,$:s}=bs(t);let r=(s?mi(i.width):i.width)/n,a=(s?mi(i.height):i.height)/o;return(!r||!Number.isFinite(r))&&(r=1),(!a||!Number.isFinite(a))&&(a=1),{x:r,y:a}}const Ba=$t(0);function gs(e){const t=q(e);return!En()||!t.visualViewport?Ba:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Ha(e,t,i){return t===void 0&&(t=!1),!i||t&&i!==q(e)?!1:t}function Ie(e,t,i,n){t===void 0&&(t=!1),i===void 0&&(i=!1);const o=e.getBoundingClientRect(),s=fs(e);let r=$t(1);t&&(n?at(n)&&(r=Xt(n)):r=Xt(e));const a=Ha(s,i,n)?gs(s):$t(0);let l=(o.left+a.x)/r.x,d=(o.top+a.y)/r.y,u=o.width/r.x,c=o.height/r.y;if(s){const h=q(s),p=n&&at(n)?q(n):n;let b=h,v=b.frameElement;for(;v&&n&&p!==b;){const y=Xt(v),g=v.getBoundingClientRect(),_=Q(v),x=g.left+(v.clientLeft+parseFloat(_.paddingLeft))*y.x,w=g.top+(v.clientTop+parseFloat(_.paddingTop))*y.y;l*=y.x,d*=y.y,u*=y.x,c*=y.y,l+=x,d+=w,b=q(v),v=b.frameElement}}return Qt({width:u,height:c,x:l,y:d})}const Ua=[":popover-open",":modal"];function vs(e){return Ua.some(t=>{try{return e.matches(t)}catch{return!1}})}function Va(e){let{elements:t,rect:i,offsetParent:n,strategy:o}=e;const s=o==="fixed",r=Et(n),a=t?vs(t.floating):!1;if(n===r||a&&s)return i;let l={scrollLeft:0,scrollTop:0},d=$t(1);const u=$t(0),c=lt(n);if((c||!c&&!s)&&((Ct(n)!=="body"||Ve(r))&&(l=Li(n)),lt(n))){const h=Ie(n);d=Xt(n),u.x=h.x+n.clientLeft,u.y=h.y+n.clientTop}return{width:i.width*d.x,height:i.height*d.y,x:i.x*d.x-l.scrollLeft*d.x+u.x,y:i.y*d.y-l.scrollTop*d.y+u.y}}function Wa(e){return Array.from(e.getClientRects())}function ys(e){return Ie(Et(e)).left+Li(e).scrollLeft}function Ga(e){const t=Et(e),i=Li(e),n=e.ownerDocument.body,o=ht(t.scrollWidth,t.clientWidth,n.scrollWidth,n.clientWidth),s=ht(t.scrollHeight,t.clientHeight,n.scrollHeight,n.clientHeight);let r=-i.scrollLeft+ys(e);const a=-i.scrollTop;return Q(n).direction==="rtl"&&(r+=ht(t.clientWidth,n.clientWidth)-o),{width:o,height:s,x:r,y:a}}function qa(e,t){const i=q(e),n=Et(e),o=i.visualViewport;let s=n.clientWidth,r=n.clientHeight,a=0,l=0;if(o){s=o.width,r=o.height;const d=En();(!d||d&&t==="fixed")&&(a=o.offsetLeft,l=o.offsetTop)}return{width:s,height:r,x:a,y:l}}function Ya(e,t){const i=Ie(e,!0,t==="fixed"),n=i.top+e.clientTop,o=i.left+e.clientLeft,s=lt(e)?Xt(e):$t(1),r=e.clientWidth*s.x,a=e.clientHeight*s.y,l=o*s.x,d=n*s.y;return{width:r,height:a,x:l,y:d}}function Kn(e,t,i){let n;if(t==="viewport")n=qa(e,i);else if(t==="document")n=Ga(Et(e));else if(at(t))n=Ya(t,i);else{const o=gs(e);n={...t,x:t.x-o.x,y:t.y-o.y}}return Qt(n)}function _s(e,t){const i=Kt(e);return i===t||!at(i)||Mi(i)?!1:Q(i).position==="fixed"||_s(i,t)}function Xa(e,t){const i=t.get(e);if(i)return i;let n=an(e,[],!1).filter(a=>at(a)&&Ct(a)!=="body"),o=null;const s=Q(e).position==="fixed";let r=s?Kt(e):e;for(;at(r)&&!Mi(r);){const a=Q(r),l=An(r);!l&&a.position==="fixed"&&(o=null),(s?!l&&!o:!l&&a.position==="static"&&o&&["absolute","fixed"].includes(o.position)||Ve(r)&&!l&&_s(e,r))?n=n.filter(d=>d!==r):o=a,r=Kt(r)}return t.set(e,n),n}function Ja(e){let{element:t,boundary:i,rootBoundary:n,strategy:o}=e;const s=[...i==="clippingAncestors"?Xa(t,this._c):[].concat(i),n],r=s[0],a=s.reduce((l,d)=>{const u=Kn(t,d,o);return l.top=ht(u.top,l.top),l.right=Jt(u.right,l.right),l.bottom=Jt(u.bottom,l.bottom),l.left=ht(u.left,l.left),l},Kn(t,r,o));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function Qa(e){const{width:t,height:i}=bs(e);return{width:t,height:i}}function Ka(e,t,i){const n=lt(t),o=Et(t),s=i==="fixed",r=Ie(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=$t(0);if(n||!n&&!s)if((Ct(t)!=="body"||Ve(o))&&(a=Li(t)),n){const c=Ie(t,!0,s,t);l.x=c.x+t.clientLeft,l.y=c.y+t.clientTop}else o&&(l.x=ys(o));const d=r.left+a.scrollLeft-l.x,u=r.top+a.scrollTop-l.y;return{x:d,y:u,width:r.width,height:r.height}}function Zn(e,t){return!lt(e)||Q(e).position==="fixed"?null:t?t(e):e.offsetParent}function xs(e,t){const i=q(e);if(!lt(e)||vs(e))return i;let n=Zn(e,t);for(;n&&Da(n)&&Q(n).position==="static";)n=Zn(n,t);return n&&(Ct(n)==="html"||Ct(n)==="body"&&Q(n).position==="static"&&!An(n))?i:n||za(e)||i}const Za=async function(e){const t=this.getOffsetParent||xs,i=this.getDimensions;return{reference:Ka(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await i(e.floating)}}};function tl(e){return Q(e).direction==="rtl"}const el={convertOffsetParentRelativeRectToViewportRelativeRect:Va,getDocumentElement:Et,getClippingRect:Ja,getOffsetParent:xs,getElementRects:Za,getClientRects:Wa,getDimensions:Qa,getScale:Xt,isElement:at,isRTL:tl},ws=Ra,$s=Ia,Cs=Ma,As=(e,t,i)=>{const n=new Map,o={platform:el,...i},s={...o.platform,_c:n};return Na(e,t,{...o,platform:s})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ai=globalThis,Sn=ai.ShadowRoot&&(ai.ShadyCSS===void 0||ai.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,kn=Symbol(),to=new WeakMap;let Es=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Sn&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=to.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&to.set(t,e))}return e}toString(){return this.cssText}};const il=e=>new Es(typeof e=="string"?e:e+"",void 0,kn),I=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new Es(i,e,kn)},nl=(e,t)=>{if(Sn)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),o=ai.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=i.cssText,e.appendChild(n)}},eo=Sn?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return il(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ol,defineProperty:sl,getOwnPropertyDescriptor:rl,getOwnPropertyNames:al,getOwnPropertySymbols:ll,getPrototypeOf:cl}=Object,Zt=globalThis,io=Zt.trustedTypes,dl=io?io.emptyScript:"",no=Zt.reactiveElementPolyfillSupport,Ae=(e,t)=>e,fi={toAttribute(e,t){switch(t){case Boolean:e=e?dl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},Tn=(e,t)=>!ol(e,t),oo={attribute:!0,type:String,converter:fi,reflect:!1,hasChanged:Tn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Zt.litPropertyMetadata??(Zt.litPropertyMetadata=new WeakMap);class qt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=oo){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),o=this.getPropertyDescriptor(t,n,i);o!==void 0&&sl(this.prototype,t,o)}}static getPropertyDescriptor(t,i,n){const{get:o,set:s}=rl(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return o==null?void 0:o.call(this)},set(r){const a=o==null?void 0:o.call(this);s.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??oo}static _$Ei(){if(this.hasOwnProperty(Ae("elementProperties")))return;const t=cl(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ae("properties"))){const i=this.properties,n=[...al(i),...ll(i)];for(const o of n)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,o]of i)this.elementProperties.set(n,o)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const o=this._$Eu(i,n);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const o of n)i.unshift(eo(o))}else t!==void 0&&i.push(eo(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nl(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:fi).toAttribute(i,o.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,i){var n;const o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=o.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:fi;this._$Em=s,this[s]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??Tn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,r]of o)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(o=>{var s;return(s=o.hostUpdate)==null?void 0:s.call(o)}),this.update(n)):this._$EU()}catch(o){throw i=!1,this._$EU(),o}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdated)==null?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}qt.elementStyles=[],qt.shadowRootOptions={mode:"open"},qt[Ae("elementProperties")]=new Map,qt[Ae("finalized")]=new Map,no==null||no({ReactiveElement:qt}),(Zt.reactiveElementVersions??(Zt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gi=globalThis,vi=gi.trustedTypes,so=vi?vi.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ss="$lit$",xt=`lit$${Math.random().toFixed(9).slice(2)}$`,ks="?"+xt,ul=`<${ks}>`,zt=document,Pe=()=>zt.createComment(""),Me=e=>e===null||typeof e!="object"&&typeof e!="function",On=Array.isArray,hl=e=>On(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Yi=`[ 	
\f\r]`,xe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ro=/-->/g,ao=/>/g,It=RegExp(`>|${Yi}(?:([^\\s"'>=/]+)(${Yi}*=${Yi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),lo=/'/g,co=/"/g,Ts=/^(?:script|style|textarea|title)$/i,pl=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),m=pl(1),Ft=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),uo=new WeakMap,Mt=zt.createTreeWalker(zt,129);function Os(e,t){if(!On(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return so!==void 0?so.createHTML(t):t}const ml=(e,t)=>{const i=e.length-1,n=[];let o,s=t===2?"<svg>":t===3?"<math>":"",r=xe;for(let a=0;a<i;a++){const l=e[a];let d,u,c=-1,h=0;for(;h<l.length&&(r.lastIndex=h,u=r.exec(l),u!==null);)h=r.lastIndex,r===xe?u[1]==="!--"?r=ro:u[1]!==void 0?r=ao:u[2]!==void 0?(Ts.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=It):u[3]!==void 0&&(r=It):r===It?u[0]===">"?(r=o??xe,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?It:u[3]==='"'?co:lo):r===co||r===lo?r=It:r===ro||r===ao?r=xe:(r=It,o=void 0);const p=r===It&&e[a+1].startsWith("/>")?" ":"";s+=r===xe?l+ul:c>=0?(n.push(d),l.slice(0,c)+Ss+l.slice(c)+xt+p):l+xt+(c===-2?a:p)}return[Os(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Le{constructor({strings:t,_$litType$:i},n){let o;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[d,u]=ml(t,i);if(this.el=Le.createElement(d,n),Mt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=Mt.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(Ss)){const h=u[r++],p=o.getAttribute(c).split(xt),b=/([.?@])?(.*)/.exec(h);l.push({type:1,index:s,name:b[2],strings:p,ctor:b[1]==="."?fl:b[1]==="?"?gl:b[1]==="@"?vl:Ri}),o.removeAttribute(c)}else c.startsWith(xt)&&(l.push({type:6,index:s}),o.removeAttribute(c));if(Ts.test(o.tagName)){const c=o.textContent.split(xt),h=c.length-1;if(h>0){o.textContent=vi?vi.emptyScript:"";for(let p=0;p<h;p++)o.append(c[p],Pe()),Mt.nextNode(),l.push({type:2,index:++s});o.append(c[h],Pe())}}}else if(o.nodeType===8)if(o.data===ks)l.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(xt,c+1))!==-1;)l.push({type:7,index:s}),c+=xt.length-1}s++}}static createElement(t,i){const n=zt.createElement("template");return n.innerHTML=t,n}}function te(e,t,i=e,n){var o,s;if(t===Ft)return t;let r=n!==void 0?(o=i.o)==null?void 0:o[n]:i.l;const a=Me(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i.o??(i.o=[]))[n]=r:i.l=r),r!==void 0&&(t=te(e,r._$AS(e,t.values),r,n)),t}class bl{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,o=((t==null?void 0:t.creationScope)??zt).importNode(i,!0);Mt.currentNode=o;let s=Mt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new We(s,s.nextSibling,this,t):l.type===1?d=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(d=new yl(s,this,t)),this._$AV.push(d),l=n[++a]}r!==(l==null?void 0:l.index)&&(s=Mt.nextNode(),r++)}return Mt.currentNode=zt,o}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class We{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,i,n,o){this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=o,this.v=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=te(this,t,i),Me(t)?t===D||t==null||t===""?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==Ft&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):hl(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==D&&Me(this._$AH)?this._$AA.nextSibling.data=t:this.T(zt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Le.createElement(Os(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(n);else{const r=new bl(s,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=uo.get(t.strings);return i===void 0&&uo.set(t.strings,i=new Le(t)),i}k(t){On(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,o=0;for(const s of t)o===i.length?i.push(n=new We(this.O(Pe()),this.O(Pe()),this,this.options)):n=i[o],n._$AI(s),o++;o<i.length&&(this._$AR(n&&n._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var i;this._$AM===void 0&&(this.v=t,(i=this._$AP)==null||i.call(this,t))}}class Ri{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,o,s){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=D}_$AI(t,i=this,n,o){const s=this.strings;let r=!1;if(s===void 0)t=te(this,t,i,0),r=!Me(t)||t!==this._$AH&&t!==Ft,r&&(this._$AH=t);else{const a=t;let l,d;for(t=s[0],l=0;l<s.length-1;l++)d=te(this,a[n+l],i,l),d===Ft&&(d=this._$AH[l]),r||(r=!Me(d)||d!==this._$AH[l]),d===D?t=D:t!==D&&(t+=(d??"")+s[l+1]),this._$AH[l]=d}r&&!o&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class fl extends Ri{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}}class gl extends Ri{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==D)}}class vl extends Ri{constructor(t,i,n,o,s){super(t,i,n,o,s),this.type=5}_$AI(t,i=this){if((t=te(this,t,i,0)??D)===Ft)return;const n=this._$AH,o=t===D&&n!==D||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==D&&(n===D||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class yl{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){te(this,t)}}const ho=gi.litHtmlPolyfillSupport;ho==null||ho(Le,We),(gi.litHtmlVersions??(gi.litHtmlVersions=[])).push("3.2.0");const ee=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let o=n._$litPart$;if(o===void 0){const s=(i==null?void 0:i.renderBefore)??null;n._$litPart$=o=new We(t.insertBefore(Pe(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends qt{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=ee(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return Ft}};var po;O._$litElement$=!0,O.finalized=!0,(po=globalThis.litElementHydrateSupport)==null||po.call(globalThis,{LitElement:O});const mo=globalThis.litElementPolyfillSupport;mo==null||mo({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _l={attribute:!0,type:String,converter:fi,reflect:!1,hasChanged:Tn},xl=(e=_l,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function f(e){return(t,i)=>typeof i=="object"?xl(e,t,i):((n,o,s)=>{const r=o.hasOwnProperty(s);return o.constructor.createProperty(s,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function le(e){return f({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wl=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ns={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Is=e=>(...t)=>({_$litDirective$:e,values:t});class Ps{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,n){this.t=t,this._$AM=i,this.i=n}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const o of n)(i=o._$AO)==null||i.call(o,t,!1),Ee(o,t);return!0},yi=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},Ms=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Al(t)}};function $l(e){this._$AN!==void 0?(yi(this),this._$AM=e,Ms(this)):this._$AM=e}function Cl(e,t=!1,i=0){const n=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(n))for(let s=i;s<n.length;s++)Ee(n[s],!1),yi(n[s]);else n!=null&&(Ee(n,!1),yi(n));else Ee(this,e)}const Al=e=>{e.type==Ns.CHILD&&(e._$AP??(e._$AP=Cl),e._$AQ??(e._$AQ=$l))};class El extends Ps{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,n){super._$AT(t,i,n),Ms(this),this.isConnected=t._$AU}_$AO(t,i=!0){var n,o;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(o=this.disconnected)==null||o.call(this)),i&&(Ee(this,t),yi(this))}setValue(t){if(wl(this.t))this.t._$AI(t,this);else{const i=[...this.t._$AH];i[this.i]=t,this.t._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ie=()=>new Sl;class Sl{}const Xi=new WeakMap,W=Is(class extends El{render(e){return D}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),D}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=Xi.get(t);i===void 0&&(i=new WeakMap,Xi.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=Xi.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Ls=Object.freeze({left:0,top:0,width:16,height:16}),_i=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),Ge=Object.freeze({...Ls,..._i}),ln=Object.freeze({...Ge,body:"",hidden:!1}),kl=Object.freeze({width:null,height:null}),Rs=Object.freeze({...kl,..._i});function Tl(e,t=0){const i=e.replace(/^-?[0-9.]*/,"");function n(o){for(;o<0;)o+=4;return o%4}if(i===""){const o=parseInt(e);return isNaN(o)?0:n(o)}else if(i!==e){let o=0;switch(i){case"%":o=25;break;case"deg":o=90}if(o){let s=parseFloat(e.slice(0,e.length-i.length));return isNaN(s)?0:(s=s/o,s%1===0?n(s):0)}}return t}const Ol=/[\s,]+/;function Nl(e,t){t.split(Ol).forEach(i=>{switch(i.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}const Ds={...Rs,preserveAspectRatio:""};function bo(e){const t={...Ds},i=(n,o)=>e.getAttribute(n)||o;return t.width=i("width",null),t.height=i("height",null),t.rotate=Tl(i("rotate","")),Nl(t,i("flip","")),t.preserveAspectRatio=i("preserveAspectRatio",i("preserveaspectratio","")),t}function Il(e,t){for(const i in Ds)if(e[i]!==t[i])return!0;return!1}const Se=/^[a-z0-9]+(-[a-z0-9]+)*$/,qe=(e,t,i,n="")=>{const o=e.split(":");if(e.slice(0,1)==="@"){if(o.length<2||o.length>3)return null;n=o.shift().slice(1)}if(o.length>3||!o.length)return null;if(o.length>1){const a=o.pop(),l=o.pop(),d={provider:o.length>0?o[0]:n,prefix:l,name:a};return t&&!li(d)?null:d}const s=o[0],r=s.split("-");if(r.length>1){const a={provider:n,prefix:r.shift(),name:r.join("-")};return t&&!li(a)?null:a}if(i&&n===""){const a={provider:n,prefix:"",name:s};return t&&!li(a,i)?null:a}return null},li=(e,t)=>e?!!((e.provider===""||e.provider.match(Se))&&(t&&e.prefix===""||e.prefix.match(Se))&&e.name.match(Se)):!1;function Pl(e,t){const i={};!e.hFlip!=!t.hFlip&&(i.hFlip=!0),!e.vFlip!=!t.vFlip&&(i.vFlip=!0);const n=((e.rotate||0)+(t.rotate||0))%4;return n&&(i.rotate=n),i}function fo(e,t){const i=Pl(e,t);for(const n in ln)n in _i?n in e&&!(n in i)&&(i[n]=_i[n]):n in t?i[n]=t[n]:n in e&&(i[n]=e[n]);return i}function Ml(e,t){const i=e.icons,n=e.aliases||Object.create(null),o=Object.create(null);function s(r){if(i[r])return o[r]=[];if(!(r in o)){o[r]=null;const a=n[r]&&n[r].parent,l=a&&s(a);l&&(o[r]=[a].concat(l))}return o[r]}return Object.keys(i).concat(Object.keys(n)).forEach(s),o}function Ll(e,t,i){const n=e.icons,o=e.aliases||Object.create(null);let s={};function r(a){s=fo(n[a]||o[a],s)}return r(t),i.forEach(r),fo(e,s)}function js(e,t){const i=[];if(typeof e!="object"||typeof e.icons!="object")return i;e.not_found instanceof Array&&e.not_found.forEach(o=>{t(o,null),i.push(o)});const n=Ml(e);for(const o in n){const s=n[o];s&&(t(o,Ll(e,o,s)),i.push(o))}return i}const Rl={provider:"",aliases:{},not_found:{},...Ls};function Ji(e,t){for(const i in t)if(i in e&&typeof e[i]!=typeof t[i])return!1;return!0}function zs(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!Ji(e,Rl))return null;const i=t.icons;for(const o in i){const s=i[o];if(!o.match(Se)||typeof s.body!="string"||!Ji(s,ln))return null}const n=t.aliases||Object.create(null);for(const o in n){const s=n[o],r=s.parent;if(!o.match(Se)||typeof r!="string"||!i[r]&&!n[r]||!Ji(s,ln))return null}return t}const xi=Object.create(null);function Dl(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function At(e,t){const i=xi[e]||(xi[e]=Object.create(null));return i[t]||(i[t]=Dl(e,t))}function Nn(e,t){return zs(t)?js(t,(i,n)=>{n?e.icons[i]=n:e.missing.add(i)}):[]}function jl(e,t,i){try{if(typeof i.body=="string")return e.icons[t]={...i},!0}catch{}return!1}function zl(e,t){let i=[];return(typeof e=="string"?[e]:Object.keys(xi)).forEach(n=>{(typeof n=="string"&&typeof t=="string"?[t]:Object.keys(xi[n]||{})).forEach(o=>{const s=At(n,o);i=i.concat(Object.keys(s.icons).map(r=>(n!==""?"@"+n+":":"")+o+":"+r))})}),i}let Re=!1;function Fs(e){return typeof e=="boolean"&&(Re=e),Re}function De(e){const t=typeof e=="string"?qe(e,!0,Re):e;if(t){const i=At(t.provider,t.prefix),n=t.name;return i.icons[n]||(i.missing.has(n)?null:void 0)}}function Bs(e,t){const i=qe(e,!0,Re);if(!i)return!1;const n=At(i.provider,i.prefix);return jl(n,i.name,t)}function go(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),Re&&!t&&!e.prefix){let o=!1;return zs(e)&&(e.prefix="",js(e,(s,r)=>{r&&Bs(s,r)&&(o=!0)})),o}const i=e.prefix;if(!li({provider:t,prefix:i,name:"a"}))return!1;const n=At(t,i);return!!Nn(n,e)}function vo(e){return!!De(e)}function Fl(e){const t=De(e);return t?{...Ge,...t}:null}function Bl(e){const t={loaded:[],missing:[],pending:[]},i=Object.create(null);e.sort((o,s)=>o.provider!==s.provider?o.provider.localeCompare(s.provider):o.prefix!==s.prefix?o.prefix.localeCompare(s.prefix):o.name.localeCompare(s.name));let n={provider:"",prefix:"",name:""};return e.forEach(o=>{if(n.name===o.name&&n.prefix===o.prefix&&n.provider===o.provider)return;n=o;const s=o.provider,r=o.prefix,a=o.name,l=i[s]||(i[s]=Object.create(null)),d=l[r]||(l[r]=At(s,r));let u;a in d.icons?u=t.loaded:r===""||d.missing.has(a)?u=t.missing:u=t.pending;const c={provider:s,prefix:r,name:a};u.push(c)}),t}function Hs(e,t){e.forEach(i=>{const n=i.loaderCallbacks;n&&(i.loaderCallbacks=n.filter(o=>o.id!==t))})}function Hl(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let i=!1;const n=e.provider,o=e.prefix;t.forEach(s=>{const r=s.icons,a=r.pending.length;r.pending=r.pending.filter(l=>{if(l.prefix!==o)return!0;const d=l.name;if(e.icons[d])r.loaded.push({provider:n,prefix:o,name:d});else if(e.missing.has(d))r.missing.push({provider:n,prefix:o,name:d});else return i=!0,!0;return!1}),r.pending.length!==a&&(i||Hs([e],s.id),s.callback(r.loaded.slice(0),r.missing.slice(0),r.pending.slice(0),s.abort))})}))}let Ul=0;function Vl(e,t,i){const n=Ul++,o=Hs.bind(null,i,n);if(!t.pending.length)return o;const s={id:n,icons:t,callback:e,abort:o};return i.forEach(r=>{(r.loaderCallbacks||(r.loaderCallbacks=[])).push(s)}),o}const cn=Object.create(null);function yo(e,t){cn[e]=t}function dn(e){return cn[e]||cn[""]}function Wl(e,t=!0,i=!1){const n=[];return e.forEach(o=>{const s=typeof o=="string"?qe(o,t,i):o;s&&n.push(s)}),n}var Gl={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function ql(e,t,i,n){const o=e.resources.length,s=e.random?Math.floor(Math.random()*o):e.index;let r;if(e.random){let C=e.resources.slice(0);for(r=[];C.length>1;){const N=Math.floor(Math.random()*C.length);r.push(C[N]),C=C.slice(0,N).concat(C.slice(N+1))}r=r.concat(C)}else r=e.resources.slice(s).concat(e.resources.slice(0,s));const a=Date.now();let l="pending",d=0,u,c=null,h=[],p=[];typeof n=="function"&&p.push(n);function b(){c&&(clearTimeout(c),c=null)}function v(){l==="pending"&&(l="aborted"),b(),h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function y(C,N){N&&(p=[]),typeof C=="function"&&p.push(C)}function g(){return{startTime:a,payload:t,status:l,queriesSent:d,queriesPending:h.length,subscribe:y,abort:v}}function _(){l="failed",p.forEach(C=>{C(void 0,u)})}function x(){h.forEach(C=>{C.status==="pending"&&(C.status="aborted")}),h=[]}function w(C,N,L){const k=N!=="success";switch(h=h.filter(S=>S!==C),l){case"pending":break;case"failed":if(k||!e.dataAfterTimeout)return;break;default:return}if(N==="abort"){u=L,_();return}if(k){u=L,h.length||(r.length?A():_());return}if(b(),x(),!e.random){const S=e.resources.indexOf(C.resource);S!==-1&&S!==e.index&&(e.index=S)}l="completed",p.forEach(S=>{S(L)})}function A(){if(l!=="pending")return;b();const C=r.shift();if(C===void 0){if(h.length){c=setTimeout(()=>{b(),l==="pending"&&(x(),_())},e.timeout);return}_();return}const N={status:"pending",resource:C,callback:(L,k)=>{w(N,L,k)}};h.push(N),d++,c=setTimeout(A,e.rotate),i(C,t,N.callback)}return setTimeout(A),g}function Us(e){const t={...Gl,...e};let i=[];function n(){i=i.filter(r=>r().status==="pending")}function o(r,a,l){const d=ql(t,r,a,(u,c)=>{n(),l&&l(u,c)});return i.push(d),d}function s(r){return i.find(a=>r(a))||null}return{query:o,find:s,setIndex:r=>{t.index=r},getIndex:()=>t.index,cleanup:n}}function In(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const Di=Object.create(null),oi=["https://api.simplesvg.com","https://api.unisvg.com"],un=[];for(;oi.length>0;)oi.length===1||Math.random()>.5?un.push(oi.shift()):un.push(oi.pop());Di[""]=In({resources:["https://api.iconify.design"].concat(un)});function _o(e,t){const i=In(t);return i===null?!1:(Di[e]=i,!0)}function ji(e){return Di[e]}function Yl(){return Object.keys(Di)}function xo(){}const Qi=Object.create(null);function Xl(e){if(!Qi[e]){const t=ji(e);if(!t)return;const i=Us(t),n={config:t,redundancy:i};Qi[e]=n}return Qi[e]}function Vs(e,t,i){let n,o;if(typeof e=="string"){const s=dn(e);if(!s)return i(void 0,424),xo;o=s.send;const r=Xl(e);r&&(n=r.redundancy)}else{const s=In(e);if(s){n=Us(s);const r=e.resources?e.resources[0]:"",a=dn(r);a&&(o=a.send)}}return!n||!o?(i(void 0,424),xo):n.query(t,o,i)().abort}const wo="iconify2",je="iconify",Ws=je+"-count",$o=je+"-version",Gs=36e5,Jl=168,Ql=50;function hn(e,t){try{return e.getItem(t)}catch{}}function Pn(e,t,i){try{return e.setItem(t,i),!0}catch{}}function Co(e,t){try{e.removeItem(t)}catch{}}function pn(e,t){return Pn(e,Ws,t.toString())}function mn(e){return parseInt(hn(e,Ws))||0}const Rt={local:!0,session:!0},qs={local:new Set,session:new Set};let Mn=!1;function Kl(e){Mn=e}let si=typeof window>"u"?{}:window;function Ys(e){const t=e+"Storage";try{if(si&&si[t]&&typeof si[t].length=="number")return si[t]}catch{}Rt[e]=!1}function Xs(e,t){const i=Ys(e);if(!i)return;const n=hn(i,$o);if(n!==wo){if(n){const a=mn(i);for(let l=0;l<a;l++)Co(i,je+l.toString())}Pn(i,$o,wo),pn(i,0);return}const o=Math.floor(Date.now()/Gs)-Jl,s=a=>{const l=je+a.toString(),d=hn(i,l);if(typeof d=="string"){try{const u=JSON.parse(d);if(typeof u=="object"&&typeof u.cached=="number"&&u.cached>o&&typeof u.provider=="string"&&typeof u.data=="object"&&typeof u.data.prefix=="string"&&t(u,a))return!0}catch{}Co(i,l)}};let r=mn(i);for(let a=r-1;a>=0;a--)s(a)||(a===r-1?(r--,pn(i,r)):qs[e].add(a))}function Js(){if(!Mn){Kl(!0);for(const e in Rt)Xs(e,t=>{const i=t.data,n=t.provider,o=i.prefix,s=At(n,o);if(!Nn(s,i).length)return!1;const r=i.lastModified||-1;return s.lastModifiedCached=s.lastModifiedCached?Math.min(s.lastModifiedCached,r):r,!0})}}function Zl(e,t){const i=e.lastModifiedCached;if(i&&i>=t)return i===t;if(e.lastModifiedCached=t,i)for(const n in Rt)Xs(n,o=>{const s=o.data;return o.provider!==e.provider||s.prefix!==e.prefix||s.lastModified===t});return!0}function tc(e,t){Mn||Js();function i(n){let o;if(!Rt[n]||!(o=Ys(n)))return;const s=qs[n];let r;if(s.size)s.delete(r=Array.from(s).shift());else if(r=mn(o),r>=Ql||!pn(o,r+1))return;const a={cached:Math.floor(Date.now()/Gs),provider:e.provider,data:t};return Pn(o,je+r.toString(),JSON.stringify(a))}t.lastModified&&!Zl(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),i("local")||i("session"))}function Ao(){}function ec(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,Hl(e)}))}function ic(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:i,prefix:n}=e,o=e.iconsToLoad;delete e.iconsToLoad;let s;!o||!(s=dn(i))||s.prepare(i,n,o).forEach(r=>{Vs(i,r,a=>{if(typeof a!="object")r.icons.forEach(l=>{e.missing.add(l)});else try{const l=Nn(e,a);if(!l.length)return;const d=e.pendingIcons;d&&l.forEach(u=>{d.delete(u)}),tc(e,a)}catch(l){console.error(l)}ec(e)})})}))}const Ln=(e,t)=>{const i=Wl(e,!0,Fs()),n=Bl(i);if(!n.pending.length){let l=!0;return t&&setTimeout(()=>{l&&t(n.loaded,n.missing,n.pending,Ao)}),()=>{l=!1}}const o=Object.create(null),s=[];let r,a;return n.pending.forEach(l=>{const{provider:d,prefix:u}=l;if(u===a&&d===r)return;r=d,a=u,s.push(At(d,u));const c=o[d]||(o[d]=Object.create(null));c[u]||(c[u]=[])}),n.pending.forEach(l=>{const{provider:d,prefix:u,name:c}=l,h=At(d,u),p=h.pendingIcons||(h.pendingIcons=new Set);p.has(c)||(p.add(c),o[d][u].push(c))}),s.forEach(l=>{const{provider:d,prefix:u}=l;o[d][u].length&&ic(l,o[d][u])}),t?Vl(t,n,s):Ao},nc=e=>new Promise((t,i)=>{const n=typeof e=="string"?qe(e,!0):e;if(!n){i(e);return}Ln([n||e],o=>{if(o.length&&n){const s=De(n);if(s){t({...Ge,...s});return}}i(e)})});function oc(e){try{const t=typeof e=="string"?JSON.parse(e):e;if(typeof t.body=="string")return{...t}}catch{}}function sc(e,t){const i=typeof e=="string"?qe(e,!0,!0):null;if(!i){const s=oc(e);return{value:e,data:s}}const n=De(i);if(n!==void 0||!i.prefix)return{value:e,name:i,data:n};const o=Ln([i],()=>t(e,i,De(i)));return{value:e,name:i,loading:o}}function Ki(e){return e.hasAttribute("inline")}let Qs=!1;try{Qs=navigator.vendor.indexOf("Apple")===0}catch{}function rc(e,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Qs||e.indexOf("<a")===-1)?"svg":e.indexOf("currentColor")===-1?"bg":"mask"}const ac=/(-?[0-9.]*[0-9]+[0-9.]*)/g,lc=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function bn(e,t,i){if(t===1)return e;if(i=i||100,typeof e=="number")return Math.ceil(e*t*i)/i;if(typeof e!="string")return e;const n=e.split(ac);if(n===null||!n.length)return e;const o=[];let s=n.shift(),r=lc.test(s);for(;;){if(r){const a=parseFloat(s);isNaN(a)?o.push(s):o.push(Math.ceil(a*t*i)/i)}else o.push(s);if(s=n.shift(),s===void 0)return o.join("");r=!r}}function cc(e,t="defs"){let i="";const n=e.indexOf("<"+t);for(;n>=0;){const o=e.indexOf(">",n),s=e.indexOf("</"+t);if(o===-1||s===-1)break;const r=e.indexOf(">",s);if(r===-1)break;i+=e.slice(o+1,s).trim(),e=e.slice(0,n).trim()+e.slice(r+1)}return{defs:i,content:e}}function dc(e,t){return e?"<defs>"+e+"</defs>"+t:t}function uc(e,t,i){const n=cc(e);return dc(n.defs,t+n.content+i)}const hc=e=>e==="unset"||e==="undefined"||e==="none";function Ks(e,t){const i={...Ge,...e},n={...Rs,...t},o={left:i.left,top:i.top,width:i.width,height:i.height};let s=i.body;[i,n].forEach(v=>{const y=[],g=v.hFlip,_=v.vFlip;let x=v.rotate;g?_?x+=2:(y.push("translate("+(o.width+o.left).toString()+" "+(0-o.top).toString()+")"),y.push("scale(-1 1)"),o.top=o.left=0):_&&(y.push("translate("+(0-o.left).toString()+" "+(o.height+o.top).toString()+")"),y.push("scale(1 -1)"),o.top=o.left=0);let w;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:w=o.height/2+o.top,y.unshift("rotate(90 "+w.toString()+" "+w.toString()+")");break;case 2:y.unshift("rotate(180 "+(o.width/2+o.left).toString()+" "+(o.height/2+o.top).toString()+")");break;case 3:w=o.width/2+o.left,y.unshift("rotate(-90 "+w.toString()+" "+w.toString()+")");break}x%2===1&&(o.left!==o.top&&(w=o.left,o.left=o.top,o.top=w),o.width!==o.height&&(w=o.width,o.width=o.height,o.height=w)),y.length&&(s=uc(s,'<g transform="'+y.join(" ")+'">',"</g>"))});const r=n.width,a=n.height,l=o.width,d=o.height;let u,c;r===null?(c=a===null?"1em":a==="auto"?d:a,u=bn(c,l/d)):(u=r==="auto"?l:r,c=a===null?bn(u,d/l):a==="auto"?d:a);const h={},p=(v,y)=>{hc(y)||(h[v]=y.toString())};p("width",u),p("height",c);const b=[o.left,o.top,l,d];return h.viewBox=b.join(" "),{attributes:h,viewBox:b,body:s}}function Rn(e,t){let i=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const n in t)i+=" "+n+'="'+t[n]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+i+">"+e+"</svg>"}function pc(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function mc(e){return"data:image/svg+xml,"+pc(e)}function Zs(e){return'url("'+mc(e)+'")'}const bc=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let wi=bc();function fc(e){wi=e}function gc(){return wi}function vc(e,t){const i=ji(e);if(!i)return 0;let n;if(!i.maxURL)n=0;else{let o=0;i.resources.forEach(r=>{o=Math.max(o,r.length)});const s=t+".json?icons=";n=i.maxURL-o-i.path.length-s.length}return n}function yc(e){return e===404}const _c=(e,t,i)=>{const n=[],o=vc(e,t),s="icons";let r={type:s,provider:e,prefix:t,icons:[]},a=0;return i.forEach((l,d)=>{a+=l.length+1,a>=o&&d>0&&(n.push(r),r={type:s,provider:e,prefix:t,icons:[]},a=l.length),r.icons.push(l)}),n.push(r),n};function xc(e){if(typeof e=="string"){const t=ji(e);if(t)return t.path}return"/"}const wc=(e,t,i)=>{if(!wi){i("abort",424);return}let n=xc(t.provider);switch(t.type){case"icons":{const s=t.prefix,r=t.icons.join(","),a=new URLSearchParams({icons:r});n+=s+".json?"+a.toString();break}case"custom":{const s=t.uri;n+=s.slice(0,1)==="/"?s.slice(1):s;break}default:i("abort",400);return}let o=503;wi(e+n).then(s=>{const r=s.status;if(r!==200){setTimeout(()=>{i(yc(r)?"abort":"next",r)});return}return o=501,s.json()}).then(s=>{if(typeof s!="object"||s===null){setTimeout(()=>{s===404?i("abort",s):i("next",o)});return}setTimeout(()=>{i("success",s)})}).catch(()=>{i("next",o)})},$c={prepare:_c,send:wc};function Eo(e,t){switch(e){case"local":case"session":Rt[e]=t;break;case"all":for(const i in Rt)Rt[i]=t;break}}const Zi="data-style";let tr="";function Cc(e){tr=e}function So(e,t){let i=Array.from(e.childNodes).find(n=>n.hasAttribute&&n.hasAttribute(Zi));i||(i=document.createElement("style"),i.setAttribute(Zi,Zi),e.appendChild(i)),i.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+tr}function er(){yo("",$c),Fs(!0);let e;try{e=window}catch{}if(e){if(Js(),e.IconifyPreload!==void 0){const t=e.IconifyPreload,i="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(n=>{try{(typeof n!="object"||n===null||n instanceof Array||typeof n.icons!="object"||typeof n.prefix!="string"||!go(n))&&console.error(i)}catch{console.error(i)}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(const i in t){const n="IconifyProviders["+i+"] is invalid.";try{const o=t[i];if(typeof o!="object"||!o||o.resources===void 0)continue;_o(i,o)||console.error(n)}catch{console.error(n)}}}}return{enableCache:t=>Eo(t,!0),disableCache:t=>Eo(t,!1),iconLoaded:vo,iconExists:vo,getIcon:Fl,listIcons:zl,addIcon:Bs,addCollection:go,calculateSize:bn,buildIcon:Ks,iconToHTML:Rn,svgToURL:Zs,loadIcons:Ln,loadIcon:nc,addAPIProvider:_o,appendCustomStyle:Cc,_api:{getAPIConfig:ji,setAPIModule:yo,sendAPIQuery:Vs,setFetch:fc,getFetch:gc,listAPIProviders:Yl}}}const fn={"background-color":"currentColor"},ir={"background-color":"transparent"},ko={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},To={"-webkit-mask":fn,mask:fn,background:ir};for(const e in To){const t=To[e];for(const i in ko)t[e+"-"+i]=ko[i]}function Oo(e){return e?e+(e.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Ac(e,t,i){const n=document.createElement("span");let o=e.body;o.indexOf("<a")!==-1&&(o+="<!-- "+Date.now()+" -->");const s=e.attributes,r=Rn(o,{...s,width:t.width+"",height:t.height+""}),a=Zs(r),l=n.style,d={"--svg":a,width:Oo(s.width),height:Oo(s.height),...i?fn:ir};for(const u in d)l.setProperty(u,d[u]);return n}let ke;function Ec(){try{ke=window.trustedTypes.createPolicy("iconify",{createHTML:e=>e})}catch{ke=null}}function Sc(e){return ke===void 0&&Ec(),ke?ke.createHTML(e):e}function kc(e){const t=document.createElement("span"),i=e.attributes;let n="";i.width||(n="width: inherit;"),i.height||(n+="height: inherit;"),n&&(i.style=n);const o=Rn(e.body,i);return t.innerHTML=Sc(o),t.firstChild}function gn(e){return Array.from(e.childNodes).find(t=>{const i=t.tagName&&t.tagName.toUpperCase();return i==="SPAN"||i==="SVG"})}function No(e,t){const i=t.icon.data,n=t.customisations,o=Ks(i,n);n.preserveAspectRatio&&(o.attributes.preserveAspectRatio=n.preserveAspectRatio);const s=t.renderedMode;let r;switch(s){case"svg":r=kc(o);break;default:r=Ac(o,{...Ge,...i},s==="mask")}const a=gn(e);a?r.tagName==="SPAN"&&a.tagName===r.tagName?a.setAttribute("style",r.getAttribute("style")):e.replaceChild(r,a):e.appendChild(r)}function Io(e,t,i){const n=i&&(i.rendered?i:i.lastRender);return{rendered:!1,inline:t,icon:e,lastRender:n}}function Tc(e="iconify-icon"){let t,i;try{t=window.customElements,i=window.HTMLElement}catch{return}if(!t||!i)return;const n=t.get(e);if(n)return n;const o=["icon","mode","inline","observe","width","height","rotate","flip"],s=class extends i{constructor(){super(),Nt(this,"_shadowRoot"),Nt(this,"_initialised",!1),Nt(this,"_state"),Nt(this,"_checkQueued",!1),Nt(this,"_connected",!1),Nt(this,"_observer",null),Nt(this,"_visible",!0);const a=this._shadowRoot=this.attachShadow({mode:"open"}),l=Ki(this);So(a,l),this._state=Io({value:""},l),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return o.slice(0)}attributeChangedCallback(a){switch(a){case"inline":{const l=Ki(this),d=this._state;l!==d.inline&&(d.inline=l,So(this._shadowRoot,l));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const a=this.getAttribute("icon");if(a&&a.slice(0,1)==="{")try{return JSON.parse(a)}catch{}return a}set icon(a){typeof a=="object"&&(a=JSON.stringify(a)),this.setAttribute("icon",a)}get inline(){return Ki(this)}set inline(a){a?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(a){a?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const a=this._state;if(a.rendered){const l=this._shadowRoot;if(a.renderedMode==="svg")try{l.lastChild.setCurrentTime(0);return}catch{}No(l,a)}}get status(){const a=this._state;return a.rendered?"rendered":a.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const a=this._state,l=this.getAttribute("icon");if(l!==a.icon.value){this._iconChanged(l);return}if(!a.rendered||!this._visible)return;const d=this.getAttribute("mode"),u=bo(this);(a.attrMode!==d||Il(a.customisations,u)||!gn(this._shadowRoot))&&this._renderIcon(a.icon,u,d)}_iconChanged(a){const l=sc(a,(d,u,c)=>{const h=this._state;if(h.rendered||this.getAttribute("icon")!==d)return;const p={value:d,name:u,data:c};p.data?this._gotIconData(p):h.icon=p});l.data?this._gotIconData(l):this._state=Io(l,this._state.inline,this._state)}_forceRender(){if(!this._visible){const a=gn(this._shadowRoot);a&&this._shadowRoot.removeChild(a);return}this._queueCheck()}_gotIconData(a){this._checkQueued=!1,this._renderIcon(a,bo(this),this.getAttribute("mode"))}_renderIcon(a,l,d){const u=rc(a.data.body,d),c=this._state.inline;No(this._shadowRoot,this._state={rendered:!0,icon:a,inline:c,customisations:l,attrMode:d,renderedMode:u})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(a=>{const l=a.some(d=>d.isIntersecting);l!==this._visible&&(this._visible=l,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};o.forEach(a=>{a in s.prototype||Object.defineProperty(s.prototype,a,{get:function(){return this.getAttribute(a)},set:function(l){l!==null?this.setAttribute(a,l):this.removeAttribute(a)}})});const r=er();for(const a in r)s[a]=s.prototype[a]=r[a];return t.define(e,s),s}Tc()||er();const Oc=I`
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
`,Nc=I`
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
`,St={scrollbar:Oc,globalStyles:Nc},nr=class T{static set config(t){this._config={...T._config,...t}}static get config(){return T._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=St.globalStyles.cssText;const i=document.head.firstChild;i?document.head.insertBefore(t,i):document.head.append(t)}static defineCustomElement(t,i){customElements.get(t)||customElements.define(t,i)}static registerComponents(){T.init()}static init(){T.addGlobalStyles(),T.defineCustomElement("bim-button",Rc),T.defineCustomElement("bim-checkbox",ce),T.defineCustomElement("bim-color-input",Ut),T.defineCustomElement("bim-context-menu",vn),T.defineCustomElement("bim-dropdown",bt),T.defineCustomElement("bim-grid",jn),T.defineCustomElement("bim-icon",Wc),T.defineCustomElement("bim-input",Xe),T.defineCustomElement("bim-label",ue),T.defineCustomElement("bim-number-input",Y),T.defineCustomElement("bim-option",B),T.defineCustomElement("bim-panel",Vt),T.defineCustomElement("bim-panel-section",he),T.defineCustomElement("bim-selector",pe),T.defineCustomElement("bim-table",tt),T.defineCustomElement("bim-tabs",Gt),T.defineCustomElement("bim-tab",J),T.defineCustomElement("bim-table-cell",vr),T.defineCustomElement("bim-table-children",_r),T.defineCustomElement("bim-table-group",wr),T.defineCustomElement("bim-table-row",Wt),T.defineCustomElement("bim-text-input",dt),T.defineCustomElement("bim-toolbar",Vi),T.defineCustomElement("bim-toolbar-group",Hi),T.defineCustomElement("bim-toolbar-section",fe),T.defineCustomElement("bim-viewport",Pr)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let i="";for(let n=0;n<10;n++){const o=Math.floor(Math.random()*t.length);i+=t.charAt(o)}return i}};nr._config={sectionLabelOnVerticalToolbar:!1};let Te=nr;class V extends O{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const n of t)this.elements.add(n);const i=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const n of i)n.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(i=>{const n=i[0];if(!n.isIntersecting)return;const o=n.target;t.unobserve(o);const s=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,r=[...this.elements][s];r&&(this.visibleElements=[...this.visibleElements,r],t.observe(r))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const i=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,n=[...this.elements][i];n&&t.observe(n)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const i of this.elements)t.unobserve(i);this.visibleElements=[],this.observeLastElement()}}static create(t,i){const n=document.createDocumentFragment();if(t.length===0)return ee(t(),n),n.firstElementChild;if(!i)throw new Error("UIComponent: Initial state is required for statefull components.");let o=i;const s=t,r=l=>(o={...o,...l},ee(s(o),n),o);r(i);const a=()=>o;return[n.firstElementChild,r,a]}}var Ic=Object.defineProperty,Pc=Object.getOwnPropertyDescriptor,or=(e,t,i,n)=>{for(var o=Pc(t,i),s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Ic(t,i,o),o},F;const Dn=(F=class extends O{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(e){this._placement=e,this.updatePosition()}static removeMenus(){for(const e of F.menus)e instanceof F&&(e.visible=!1);F.dialog.close(),F.dialog.remove()}get visible(){return this._visible}set visible(e){var t;this._visible=e,e?(F.dialog.parentElement||document.body.append(F.dialog),this._previousContainer=this.parentElement,F.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,F.dialog.append(this),F.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const e=this.placement??"right",t=await As(this._previousContainer,this,{placement:e,middleware:[hs(10),Cs(),$s(),ws({padding:5})]}),{x:i,y:n}=t;this.style.left=`${i}px`,this.style.top=`${n}px`}connectedCallback(){super.connectedCallback(),F.menus.push(this)}render(){return m` <slot></slot> `}},F.styles=[St.scrollbar,I`
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
    `],F.dialog=V.create(()=>m` <dialog
      @click=${e=>{e.target===F.dialog&&F.removeMenus()}}
      @cancel=${()=>F.removeMenus()}
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
    ></dialog>`),F.menus=[],F);or([f({type:String,reflect:!0})],Dn.prototype,"placement");or([f({type:Boolean,reflect:!0})],Dn.prototype,"visible");let vn=Dn;var Mc=Object.defineProperty,Lc=Object.getOwnPropertyDescriptor,it=(e,t,i,n)=>{for(var o=n>1?void 0:n?Lc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Mc(t,i,o),o},we;const K=(we=class extends O{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=ie(),this._tooltip=ie(),this._mouseLeave=!1,this.onClick=e=>{e.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const e=this._contextMenu;if(e){const t=this.getAttribute("data-context-group");t&&e.setAttribute("data-context-group",t),this.closeNestedContexts();const i=Te.newRandomId();for(const n of e.children)n instanceof we&&n.setAttribute("data-context-group",i);e.visible=!0}},this.mouseLeave=!0}set loading(e){if(this._loading=e,e)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=e,this.icon="eos-icons:loading";else{const{disabled:t,icon:i}=this._stateBeforeLoading;this.disabled=t,this.icon=i}}get loading(){return this._loading}set mouseLeave(e){this._mouseLeave=e,e&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:e}=this._parent,{value:t}=this._tooltip;e&&t&&As(e,t,{placement:"bottom",middleware:[hs(10),Cs(),$s(),ws({padding:5})]}).then(i=>{const{x:n,y:o}=i;Object.assign(t.style,{left:`${n}px`,top:`${o}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const e=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},e)}closeNestedContexts(){const e=this.getAttribute("data-context-group");if(e)for(const t of vn.dialog.children){const i=t.getAttribute("data-context-group");if(t instanceof vn&&i===e){t.visible=!1,t.removeAttribute("data-context-group");for(const n of t.children)n instanceof we&&(n.closeNestedContexts(),n.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const e=m`
      <div ${W(this._tooltip)} class="tooltip">
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
      <div ${W(this._parent)} class="parent" @click=${this.onClick}>
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
    `}},we.styles=I`
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
  `,we);it([f({type:String,reflect:!0})],K.prototype,"label",2);it([f({type:Boolean,attribute:"label-hidden",reflect:!0})],K.prototype,"labelHidden",2);it([f({type:Boolean,reflect:!0})],K.prototype,"active",2);it([f({type:Boolean,reflect:!0,attribute:"disabled"})],K.prototype,"disabled",2);it([f({type:String,reflect:!0})],K.prototype,"icon",2);it([f({type:Boolean,reflect:!0})],K.prototype,"vertical",2);it([f({type:Number,attribute:"tooltip-time",reflect:!0})],K.prototype,"tooltipTime",2);it([f({type:Boolean,attribute:"tooltip-visible",reflect:!0})],K.prototype,"tooltipVisible",2);it([f({type:String,attribute:"tooltip-title",reflect:!0})],K.prototype,"tooltipTitle",2);it([f({type:String,attribute:"tooltip-text",reflect:!0})],K.prototype,"tooltipText",2);it([f({type:Boolean,reflect:!0})],K.prototype,"loading",1);let Rc=K;var Dc=Object.defineProperty,Ye=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Dc(t,i,o),o};const sr=class extends O{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(e){e.stopPropagation(),this.checked=e.target.checked,this.dispatchEvent(this.onValueChange)}render(){return m`
      <div class="parent">
        ${this.label?m`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};sr.styles=I`
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
  `;let ce=sr;Ye([f({type:String,reflect:!0})],ce.prototype,"icon");Ye([f({type:String,reflect:!0})],ce.prototype,"name");Ye([f({type:String,reflect:!0})],ce.prototype,"label");Ye([f({type:Boolean,reflect:!0})],ce.prototype,"checked");Ye([f({type:Boolean,reflect:!0})],ce.prototype,"inverted");var jc=Object.defineProperty,de=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&jc(t,i,o),o};const rr=class extends O{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=ie(),this._textInput=ie(),this.onValueChange=new Event("input"),this.onOpacityInput=e=>{const t=e.target;this.opacity=t.value,this.dispatchEvent(this.onValueChange)}}set value(e){const{color:t,opacity:i}=e;this.color=t,i&&(this.opacity=i)}get value(){const e={color:this.color};return this.opacity&&(e.opacity=this.opacity),e}onColorInput(e){e.stopPropagation();const{value:t}=this._colorInput;t&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}onTextInput(e){e.stopPropagation();const{value:t}=this._textInput;if(!t)return;const{value:i}=t;let n=i.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),t.value=n.slice(0,7),t.value.length===7&&(this.color=t.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:e}=this._colorInput;e&&e.click()}render(){return m`
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
    `}};rr.styles=I`
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
  `;let Ut=rr;de([f({type:String,reflect:!0})],Ut.prototype,"name");de([f({type:String,reflect:!0})],Ut.prototype,"label");de([f({type:String,reflect:!0})],Ut.prototype,"icon");de([f({type:Boolean,reflect:!0})],Ut.prototype,"vertical");de([f({type:Number,reflect:!0})],Ut.prototype,"opacity");de([f({type:String,reflect:!0})],Ut.prototype,"color");const $i=(e,t={},i=!0)=>{let n={};for(const o of e.children){const s=o,r=s.getAttribute("name")||s.getAttribute("label"),a=t[r];if(r){if("value"in s&&typeof s.value<"u"&&s.value!==null){const l=s.value;if(typeof l=="object"&&!Array.isArray(l)&&Object.keys(l).length===0)continue;n[r]=a?a(s.value):s.value}else if(i){const l=$i(s,t);if(Object.keys(l).length===0)continue;n[r]=a?a(l):l}}else i&&(n={...n,...$i(s,t)})}return n},zi=e=>e==="true"||e==="false"?e==="true":e&&!isNaN(Number(e))&&e.trim()!==""?Number(e):e,zc=[">=","<=","=",">","<","?","/","#"];function Po(e){const t=zc.find(r=>e.split(r).length===2),i=e.split(t).map(r=>r.trim()),[n,o]=i,s=o.startsWith("'")&&o.endsWith("'")?o.replace(/'/g,""):zi(o);return{key:n,condition:t,value:s}}const yn=e=>{try{const t=[],i=e.split(/&(?![^()]*\))/).map(n=>n.trim());for(const n of i){const o=!n.startsWith("(")&&!n.endsWith(")"),s=n.startsWith("(")&&n.endsWith(")");if(o){const r=Po(n);t.push(r)}if(s){const r={operator:"&",queries:n.replace(/^(\()|(\))$/g,"").split("&").map(a=>a.trim()).map((a,l)=>{const d=Po(a);return l>0&&(d.operator="&"),d})};t.push(r)}}return t}catch{return null}},Mo=(e,t,i)=>{let n=!1;switch(t){case"=":n=e===i;break;case"?":n=String(e).includes(String(i));break;case"<":(typeof e=="number"||typeof i=="number")&&(n=e<i);break;case"<=":(typeof e=="number"||typeof i=="number")&&(n=e<=i);break;case">":(typeof e=="number"||typeof i=="number")&&(n=e>i);break;case">=":(typeof e=="number"||typeof i=="number")&&(n=e>=i);break;case"/":n=String(e).startsWith(String(i));break}return n};var Fc=Object.defineProperty,Bc=Object.getOwnPropertyDescriptor,kt=(e,t,i,n)=>{for(var o=n>1?void 0:n?Bc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Fc(t,i,o),o};const ar=class extends O{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?zi(this.label):this.label}set value(e){this._value=e}render(){return m`
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
    `}};ar.styles=I`
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
  `;let B=ar;kt([f({type:String,reflect:!0})],B.prototype,"img",2);kt([f({type:String,reflect:!0})],B.prototype,"label",2);kt([f({type:String,reflect:!0})],B.prototype,"icon",2);kt([f({type:Boolean,reflect:!0})],B.prototype,"checked",2);kt([f({type:Boolean,reflect:!0})],B.prototype,"checkbox",2);kt([f({type:Boolean,attribute:"no-mark",reflect:!0})],B.prototype,"noMark",2);kt([f({converter:{fromAttribute(e){return e&&zi(e)}}})],B.prototype,"value",1);kt([f({type:Boolean,reflect:!0})],B.prototype,"vertical",2);var Hc=Object.defineProperty,Uc=Object.getOwnPropertyDescriptor,Tt=(e,t,i,n)=>{for(var o=n>1?void 0:n?Uc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Hc(t,i,o),o};const lr=class extends V{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=ie(),this.onOptionClick=e=>{const t=e.target,i=this._value.has(t);if(!this.multiple&&!this.required&&!i)this._value=new Set([t]);else if(!this.multiple&&!this.required&&i)this._value=new Set([]);else if(!this.multiple&&this.required&&!i)this._value=new Set([t]);else if(this.multiple&&!this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&!this.required&&i){const n=[...this._value].filter(o=>o!==t);this._value=new Set(n)}else if(this.multiple&&this.required&&!i)this._value=new Set([...this._value,t]);else if(this.multiple&&this.required&&i){const n=[...this._value].filter(s=>s!==t),o=new Set(n);o.size!==0&&(this._value=o)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(e){if(e){const{value:t}=this._contextMenu;if(!t)return;for(const i of this.elements)t.append(i);this._visible=!0}else{for(const t of this.elements)this.append(t);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(e){if(this.required&&Object.keys(e).length===0)return;const t=new Set;for(const i of e){const n=this.findOption(i);if(n&&(t.add(n),!this.multiple&&Object.keys(e).length===1))break}this._value=t,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(e=>e instanceof B&&e.checked).map(e=>e.value)}get _options(){const e=new Set([...this.elements]);for(const t of this.children)t instanceof B&&e.add(t);return[...e]}onSlotChange(e){const t=e.target.assignedElements();this.observe(t);const i=new Set;for(const n of this.elements){if(!(n instanceof B)){n.remove();continue}n.checked&&i.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=i}updateOptionsState(){for(const e of this._options)e instanceof B&&(e.checked=this._value.has(e))}findOption(e){return this._options.find(t=>t instanceof B?t.label===e||t.value===e:!1)}render(){let e,t,i;if(this._value.size===0)e="Select an option...";else if(this._value.size===1){const n=[...this._value][0];e=(n==null?void 0:n.label)||(n==null?void 0:n.value),t=n==null?void 0:n.img,i=n==null?void 0:n.icon}else e=`Multiple (${this._value.size})`;return m`
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
            ${W(this._contextMenu)}
            .visible=${this.visible}
            @hidden=${()=>{this.visible&&(this.visible=!1)}}
          >
            <slot @slotchange=${this.onSlotChange}></slot>
          </bim-context-menu>
        </div>
      </bim-input>
    `}};lr.styles=[St.scrollbar,I`
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
    `];let bt=lr;Tt([f({type:String,reflect:!0})],bt.prototype,"name",2);Tt([f({type:String,reflect:!0})],bt.prototype,"icon",2);Tt([f({type:String,reflect:!0})],bt.prototype,"label",2);Tt([f({type:Boolean,reflect:!0})],bt.prototype,"multiple",2);Tt([f({type:Boolean,reflect:!0})],bt.prototype,"required",2);Tt([f({type:Boolean,reflect:!0})],bt.prototype,"vertical",2);Tt([f({type:Boolean,reflect:!0})],bt.prototype,"visible",1);Tt([le()],bt.prototype,"_value",2);var Vc=Object.defineProperty,cr=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Vc(t,i,o),o};const dr=class extends O{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(e){const t=e.split(`
`).map(i=>i.trim()).map(i=>i.split('"')[1]).filter(i=>i!==void 0).flatMap(i=>i.split(/\s+/));return[...new Set(t)].filter(i=>i!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const e=this.layouts[this.layout],t=this.getUniqueAreasFromTemplate(e.template).map(i=>{const n=e.elements[i];return n&&(n.style.gridArea=i),n}).filter(i=>!!i);this.style.gridTemplate=e.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...t)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return m`<slot></slot>`}};dr.styles=I`
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
  `;let jn=dr;cr([f({type:Boolean,reflect:!0})],jn.prototype,"floating");cr([f({type:String,reflect:!0})],jn.prototype,"layout");const _n=class extends O{render(){return m`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};_n.styles=I`
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
  `,_n.properties={icon:{type:String}};let Wc=_n;var Gc=Object.defineProperty,Fi=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Gc(t,i,o),o};const ur=class extends O{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const e={};for(const t of this.children){const i=t;"value"in i?e[i.name||i.label]=i.value:"checked"in i&&(e[i.name||i.label]=i.checked)}return e}set value(e){const t=[...this.children];for(const i in e){const n=t.find(r=>{const a=r;return a.name===i||a.label===i});if(!n)continue;const o=n,s=e[i];typeof s=="boolean"?o.checked=s:o.value=s}}render(){return m`
      <div class="parent">
        ${this.label||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};ur.styles=I`
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
  `;let Xe=ur;Fi([f({type:String,reflect:!0})],Xe.prototype,"name");Fi([f({type:String,reflect:!0})],Xe.prototype,"label");Fi([f({type:String,reflect:!0})],Xe.prototype,"icon");Fi([f({type:Boolean,reflect:!0})],Xe.prototype,"vertical");var qc=Object.defineProperty,Je=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&qc(t,i,o),o};const hr=class extends O{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?zi(this.textContent):this.textContent}render(){return m`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?m`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?m`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};hr.styles=I`
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
  `;let ue=hr;Je([f({type:String,reflect:!0})],ue.prototype,"img");Je([f({type:Boolean,attribute:"label-hidden",reflect:!0})],ue.prototype,"labelHidden");Je([f({type:String,reflect:!0})],ue.prototype,"icon");Je([f({type:Boolean,attribute:"icon-hidden",reflect:!0})],ue.prototype,"iconHidden");Je([f({type:Boolean,reflect:!0})],ue.prototype,"vertical");var Yc=Object.defineProperty,Xc=Object.getOwnPropertyDescriptor,Z=(e,t,i,n)=>{for(var o=n>1?void 0:n?Xc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Yc(t,i,o),o};const pr=class extends O{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=ie(),this.onValueChange=new Event("change")}set value(e){this.setValue(e.toString())}get value(){return this._value}onChange(e){e.stopPropagation();const{value:t}=this._input;t&&this.setValue(t.value)}setValue(e){const{value:t}=this._input;let i=e;if(i=i.replace(/[^0-9.-]/g,""),i=i.replace(/(\..*)\./g,"$1"),i.endsWith(".")||(i.lastIndexOf("-")>0&&(i=i[0]+i.substring(1).replace(/-/g,"")),i==="-"||i==="-0"))return;let n=Number(i);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,t&&(t.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:e}=this._input;e&&Number.isNaN(Number(e.value))&&(e.value=this.value.toString())}onSliderMouseDown(e){document.body.style.cursor="w-resize";const{clientX:t}=e,i=this.value;let n=!1;const o=a=>{var l;n=!0;const{clientX:d}=a,u=this.step??1,c=((l=u.toString().split(".")[1])==null?void 0:l.length)||0,h=1/(this.sensitivity??1),p=(d-t)/h;if(Math.floor(Math.abs(p))!==Math.abs(p))return;const b=i+p*u;this.setValue(b.toFixed(c))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},r=()=>{document.removeEventListener("mousemove",o),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",o),document.addEventListener("mouseup",r)}onFocus(e){e.stopPropagation();const t=i=>{i.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",t))};window.addEventListener("keydown",t)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:e}=this._input;e&&e.focus()}render(){const e=m`
      ${this.pref||this.icon?m`<bim-label
            style="pointer-events: auto"
            @mousedown=${this.onSliderMouseDown}
            .icon=${this.icon}
            >${this.pref}</bim-label
          >`:null}
      <input
        ${W(this._input)}
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
    `}};pr.styles=I`
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
  `;let Y=pr;Z([f({type:String,reflect:!0})],Y.prototype,"name",2);Z([f({type:String,reflect:!0})],Y.prototype,"icon",2);Z([f({type:String,reflect:!0})],Y.prototype,"label",2);Z([f({type:String,reflect:!0})],Y.prototype,"pref",2);Z([f({type:Number,reflect:!0})],Y.prototype,"min",2);Z([f({type:Number,reflect:!0})],Y.prototype,"value",1);Z([f({type:Number,reflect:!0})],Y.prototype,"step",2);Z([f({type:Number,reflect:!0})],Y.prototype,"sensitivity",2);Z([f({type:Number,reflect:!0})],Y.prototype,"max",2);Z([f({type:String,reflect:!0})],Y.prototype,"suffix",2);Z([f({type:Boolean,reflect:!0})],Y.prototype,"vertical",2);Z([f({type:Boolean,reflect:!0})],Y.prototype,"slider",2);var Jc=Object.defineProperty,Qc=Object.getOwnPropertyDescriptor,Qe=(e,t,i,n)=>{for(var o=n>1?void 0:n?Qc(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&Jc(t,i,o),o};const mr=class extends O{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(e){this._hidden=e,this.activationButton.active=!e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return $i(this,this.valueTransform)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(s=>{const r=s;return r.name===i||r.label===i});if(!n)continue;const o=n;o.value=e[i]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!0}expandSections(){const e=this.querySelectorAll("bim-panel-section");for(const t of e)t.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,m`
      <div class="parent">
        ${this.label||this.name||this.icon?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};mr.styles=[St.scrollbar,I`
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
    `];let Vt=mr;Qe([f({type:String,reflect:!0})],Vt.prototype,"icon",2);Qe([f({type:String,reflect:!0})],Vt.prototype,"name",2);Qe([f({type:String,reflect:!0})],Vt.prototype,"label",2);Qe([f({type:Boolean,reflect:!0})],Vt.prototype,"hidden",1);Qe([f({type:Boolean,attribute:"header-hidden",reflect:!0})],Vt.prototype,"headerHidden",2);var Kc=Object.defineProperty,Ke=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Kc(t,i,o),o};const br=class extends O{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const e=this.parentElement;let t;return e instanceof Vt&&(t=e.valueTransform),Object.values(this.valueTransform).length!==0&&(t=this.valueTransform),$i(this,t)}set value(e){const t=[...this.children];for(const i in e){const n=t.find(s=>{const r=s;return r.name===i||r.label===i});if(!n)continue;const o=n;o.value=e[i]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const e=this.label||this.icon||this.name||this.fixed,t=m`<svg
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
    `}};br.styles=[St.scrollbar,I`
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
    `];let he=br;Ke([f({type:String,reflect:!0})],he.prototype,"icon");Ke([f({type:String,reflect:!0})],he.prototype,"label");Ke([f({type:String,reflect:!0})],he.prototype,"name");Ke([f({type:Boolean,reflect:!0})],he.prototype,"fixed");Ke([f({type:Boolean,reflect:!0})],he.prototype,"collapsed");var Zc=Object.defineProperty,Ze=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&Zc(t,i,o),o};const fr=class extends O{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=e=>{this._value=e.target,this.dispatchEvent(this.onValueChange);for(const t of this.children)t instanceof B&&(t.checked=t===e.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(e){const t=this.findOption(e);if(t){for(const i of this._options)i.checked=i===t;this._value=t,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(e){const t=e.target.assignedElements();for(const i of t)i instanceof B&&(i.noMark=!0,i.removeEventListener("click",this.onOptionClick),i.addEventListener("click",this.onOptionClick))}findOption(e){return this._options.find(t=>t instanceof B?t.label===e||t.value===e:!1)}firstUpdated(){const e=[...this.children].find(t=>t instanceof B&&t.checked);e&&(this._value=e)}render(){return m`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};fr.styles=I`
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
  `;let pe=fr;Ze([f({type:String,reflect:!0})],pe.prototype,"name");Ze([f({type:String,reflect:!0})],pe.prototype,"icon");Ze([f({type:String,reflect:!0})],pe.prototype,"label");Ze([f({type:Boolean,reflect:!0})],pe.prototype,"vertical");Ze([le()],pe.prototype,"_value");const td=()=>m`
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
  `,ed=()=>m`
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
  `;var id=Object.defineProperty,nd=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&id(t,i,o),o};const gr=class extends O{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return m`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};gr.styles=I`
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
  `;let vr=gr;nd([f({type:String,reflect:!0})],vr.prototype,"column");var od=Object.defineProperty,sd=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&od(t,i,o),o};const yr=class extends O{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(e,t=!1){for(const i of this._groups)i.childrenHidden=typeof e>"u"?!i.childrenHidden:!e,t&&i.toggleChildren(e,t)}render(){return this._groups=[],m`
      <slot></slot>
      ${this.data.map(e=>{const t=document.createElement("bim-table-group");return this._groups.push(t),t.table=this.table,t.data=e,t})}
    `}};yr.styles=I`
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
  `;let _r=yr;sd([f({type:Array,attribute:!1})],_r.prototype,"data");var rd=Object.defineProperty,ad=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&rd(t,i,o),o};const xr=class extends O{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(e,t=!1){this._children&&(this.childrenHidden=typeof e>"u"?!this.childrenHidden:!e,t&&this._children.toggleGroups(e,t))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const e=this.table.getGroupIndentation(this.data)??0,t=m`
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
    `}};xr.styles=I`
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
  `;let wr=xr;ad([f({type:Boolean,attribute:"children-hidden",reflect:!0})],wr.prototype,"childrenHidden");var ld=Object.defineProperty,me=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&ld(t,i,o),o};const $r=class extends O{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(e=>{this._intersecting=e[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.name)}get _columnWidths(){return this.columns.filter(e=>!this.hiddenColumns.includes(e.name)).map(e=>e.width)}get _isSelected(){var e;return(e=this.table)==null?void 0:e.selection.has(this.data)}onSelectionChange(e){if(!this.table)return;const t=e.target;this.selected=t.value,t.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const e=this.table.getRowIndentation(this.data)??0,t=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,i=[];for(const n in t){if(this.hiddenColumns.includes(n))continue;const o=t[n];let s;if(typeof o=="string"||typeof o=="boolean"||typeof o=="number"?(s=document.createElement("bim-label"),s.textContent=String(o)):o instanceof HTMLElement?s=o:(s=document.createDocumentFragment(),ee(o,s)),!s)continue;const r=document.createElement("bim-table-cell");r.append(s),r.column=n,this._columnNames.indexOf(n)===0&&(r.style.marginLeft=`${this.table.noIndentation?0:e+.75}rem`);const a=this._columnNames.indexOf(n);r.setAttribute("data-column-index",String(a)),r.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),r.toggleAttribute("data-cell-header",this.isHeader),r.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:r}})),i.push(r)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,m`
      ${!this.isHeader&&this.table.selectableRows?m`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${i}
      <slot></slot>
    `}render(){return m`${this._intersecting?this.compute():m``}`}};$r.styles=I`
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
  `;let Wt=$r;me([f({type:Boolean,reflect:!0})],Wt.prototype,"selected");me([f({attribute:!1})],Wt.prototype,"columns");me([f({attribute:!1})],Wt.prototype,"hiddenColumns");me([f({attribute:!1})],Wt.prototype,"data");me([f({type:Boolean,attribute:"is-header",reflect:!0})],Wt.prototype,"isHeader");me([le()],Wt.prototype,"_intersecting");var cd=Object.defineProperty,dd=Object.getOwnPropertyDescriptor,nt=(e,t,i,n)=>{for(var o=n>1?void 0:n?dd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&cd(t,i,o),o};const Cr=class extends O{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this.loadingErrorElement=null,this._stringFilterFunction=(e,t)=>Object.values(t.data).some(i=>String(i).toLowerCase().includes(e.toLowerCase())),this._queryFilterFunction=(e,t)=>{let i=!1;const n=yn(e)??[];for(const o of n){if("queries"in o){i=!1;break}const{condition:s,value:r}=o;let{key:a}=o;if(a.startsWith("[")&&a.endsWith("]")){const l=a.replace("[","").replace("]","");a=l,i=Object.keys(t.data).filter(d=>d.includes(l)).map(d=>Mo(t.data[d],s,r)).some(d=>d)}else i=Mo(t.data[a],s,r);if(!i)break}return i}}set columns(e){const t=[];for(const i of e){const n=typeof i=="string"?{name:i,width:`minmax(${this.minColWidth}, 1fr)`}:i;t.push(n)}this._columns=t,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const e={};for(const t of this.columns)if(typeof t=="string")e[t]=t;else{const{name:i}=t;e[i]=i}return e}get value(){return this._filteredData}set queryString(e){this.toggleAttribute("data-processing",!0),this._queryString=e&&e.trim()!==""?e.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(e){this._data=e,this.updateFilteredData(),this.computeMissingColumns(e)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(e=>{setTimeout(()=>{e(this.data)})})}set hiddenColumns(e){this._hiddenColumns=e,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(yn(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(e){let t=!1;for(const i of e){const{children:n,data:o}=i;for(const s in o)this._columns.map(r=>typeof r=="string"?r:r.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),t=!0);if(n){const s=this.computeMissingColumns(n);s&&!t&&(t=s)}}return t}generateText(e="comma",t=this.value,i="",n=!0){const o=this._textDelimiters[e];let s="";const r=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${o}`);const a=`${r.join(o)}
`;s+=a}for(const[a,l]of t.entries()){const{data:d,children:u}=l,c=this.indentationInText?`${i}${a+1}${o}`:"",h=r.map(b=>d[b]??""),p=`${c}${h.join(o)}
`;s+=p,u&&(s+=this.generateText(e,l.children,`${i}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(e){const t={};for(const i of Object.keys(this.dataTransform)){const n=this.columns.find(o=>o.name===i);n&&n.forceDataTransform&&(i in e||(e[i]=""))}for(const i in e){const n=this.dataTransform[i];n?t[i]=n(e[i],e):t[i]=e[i]}return t}downloadData(e="BIM Table Data",t="json"){let i=null;if(t==="json"&&(i=new File([JSON.stringify(this.value,void 0,2)],`${e}.json`)),t==="csv"&&(i=new File([this.csv],`${e}.csv`)),t==="tsv"&&(i=new File([this.tsv],`${e}.tsv`)),!i)return;const n=document.createElement("a");n.href=URL.createObjectURL(i),n.download=i.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(e,t=this.value,i=0){for(const n of t){if(n.data===e)return i;if(n.children){const o=this.getRowIndentation(e,n.children,i+1);if(o!==null)return o}}return null}getGroupIndentation(e,t=this.value,i=0){for(const n of t){if(n===e)return i;if(n.children){const o=this.getGroupIndentation(e,n.children,i+1);if(o!==null)return o}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(e=!1){if(this._filteredData.length!==0&&!e||!this.loadFunction)return!1;this.loading=!0;try{const t=await this.loadFunction();return this.data=t,this.loading=!1,this._errorLoading=!1,!0}catch(t){return this.loading=!1,this._filteredData.length!==0||(t instanceof Error&&this.loadingErrorElement&&t.message.trim()!==""&&(this.loadingErrorElement.textContent=t.message),this._errorLoading=!0),!1}}filter(e,t=this.filterFunction??this._stringFilterFunction,i=this.data){const n=[];for(const o of i)if(t(e,o)){if(this.preserveStructureOnFilter){const s={data:o.data};if(o.children){const r=this.filter(e,t,o.children);r.length&&(s.children=r)}n.push(s)}else if(n.push({data:o.data}),o.children){const s=this.filter(e,t,o.children);n.push(...s)}}else if(o.children){const s=this.filter(e,t,o.children);this.preserveStructureOnFilter&&s.length?n.push({data:o.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return td();if(this._errorLoading)return m`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return m`<slot name="missing-data"></slot>`;const e=document.createElement("bim-table-row");e.table=this,e.isHeader=!0,e.data=this._headerRowData,e.style.gridArea="Header",e.style.position="sticky",e.style.top="0",e.style.zIndex="5";const t=document.createElement("bim-table-children");return t.table=this,t.data=this.value,t.style.gridArea="Body",t.style.backgroundColor="transparent",m`
      <div class="parent">
        ${this.headersHidden?null:e} ${ed()}
        <div style="overflow-x: hidden; grid-area: Body">${t}</div>
      </div>
    `}};Cr.styles=[St.scrollbar,I`
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
    `];let tt=Cr;nt([le()],tt.prototype,"_filteredData",2);nt([f({type:Boolean,attribute:"headers-hidden",reflect:!0})],tt.prototype,"headersHidden",2);nt([f({type:String,attribute:"min-col-width",reflect:!0})],tt.prototype,"minColWidth",2);nt([f({type:Array,attribute:!1})],tt.prototype,"columns",1);nt([f({type:Array,attribute:!1})],tt.prototype,"data",1);nt([f({type:Boolean,reflect:!0})],tt.prototype,"expanded",2);nt([f({type:Boolean,reflect:!0,attribute:"selectable-rows"})],tt.prototype,"selectableRows",2);nt([f({attribute:!1})],tt.prototype,"selection",2);nt([f({type:Boolean,attribute:"no-indentation",reflect:!0})],tt.prototype,"noIndentation",2);nt([f({type:Boolean,reflect:!0})],tt.prototype,"loading",2);nt([le()],tt.prototype,"_errorLoading",2);var ud=Object.defineProperty,hd=Object.getOwnPropertyDescriptor,Bi=(e,t,i,n)=>{for(var o=n>1?void 0:n?hd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&ud(t,i,o),o};const Ar=class extends O{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:e}=this;if(e&&this.name===this._defaultName){const t=[...e.children].indexOf(this);this.name=`${this._defaultName}${t}`}}render(){return m` <slot></slot> `}};Ar.styles=I`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let J=Ar;Bi([f({type:String,reflect:!0})],J.prototype,"name",2);Bi([f({type:String,reflect:!0})],J.prototype,"label",2);Bi([f({type:String,reflect:!0})],J.prototype,"icon",2);Bi([f({type:Boolean,reflect:!0})],J.prototype,"hidden",1);var pd=Object.defineProperty,md=Object.getOwnPropertyDescriptor,be=(e,t,i,n)=>{for(var o=n>1?void 0:n?md(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&pd(t,i,o),o};const Er=class extends O{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=e=>{const t=e.target;t instanceof J&&!t.hidden&&(t.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=t.name,t.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(e){this._tab=e;const t=[...this.children],i=t.find(n=>n instanceof J&&n.name===e);for(const n of t){if(!(n instanceof J))continue;n.hidden=i!==n;const o=this.getTabSwitcher(n.name);o&&o.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(e){return this._switchers.find(t=>t.getAttribute("data-name")===e)}createSwitchers(){this._switchers=[];for(const e of this.children){if(!(e instanceof J))continue;const t=document.createElement("div");t.addEventListener("click",()=>{this.tab===e.name?this.toggleAttribute("tab",!1):this.tab=e.name}),t.setAttribute("data-name",e.name),t.className="switcher";const i=document.createElement("bim-label");i.textContent=e.label??"",i.icon=e.icon,t.append(i),this._switchers.push(t)}}onSlotChange(e){this.createSwitchers();const t=e.target.assignedElements(),i=t.find(n=>n instanceof J?this.tab?n.name===this.tab:!n.hidden:!1);i&&i instanceof J&&(this.tab=i.name);for(const n of t){if(!(n instanceof J)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),i!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return m`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Er.styles=[St.scrollbar,I`
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
    `];let Gt=Er;be([le()],Gt.prototype,"_switchers",2);be([f({type:Boolean,reflect:!0})],Gt.prototype,"bottom",2);be([f({type:Boolean,attribute:"switchers-hidden",reflect:!0})],Gt.prototype,"switchersHidden",2);be([f({type:Boolean,reflect:!0})],Gt.prototype,"floating",2);be([f({type:String,reflect:!0})],Gt.prototype,"tab",1);be([f({type:Boolean,attribute:"switchers-full",reflect:!0})],Gt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lo=e=>e??D;var bd=Object.defineProperty,fd=Object.getOwnPropertyDescriptor,ft=(e,t,i,n)=>{for(var o=n>1?void 0:n?fd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&bd(t,i,o),o};const Sr=class extends O{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(e){this._inputTypes.includes(e)&&(this._type=e)}get type(){return this._type}get query(){return yn(this.value)}onInputChange(e){e.stopPropagation();const t=e.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=t.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("input");t==null||t.focus()})}render(){return m`
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
              placeholder=${Lo(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:m` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${Lo(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};Sr.styles=[St.scrollbar,I`
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
    `];let dt=Sr;ft([f({type:String,reflect:!0})],dt.prototype,"icon",2);ft([f({type:String,reflect:!0})],dt.prototype,"label",2);ft([f({type:String,reflect:!0})],dt.prototype,"name",2);ft([f({type:String,reflect:!0})],dt.prototype,"placeholder",2);ft([f({type:String,reflect:!0})],dt.prototype,"value",2);ft([f({type:Boolean,reflect:!0})],dt.prototype,"vertical",2);ft([f({type:Number,reflect:!0})],dt.prototype,"debounce",2);ft([f({type:Number,reflect:!0})],dt.prototype,"rows",2);ft([f({type:String,reflect:!0})],dt.prototype,"type",1);var gd=Object.defineProperty,vd=Object.getOwnPropertyDescriptor,kr=(e,t,i,n)=>{for(var o=n>1?void 0:n?vd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&gd(t,i,o),o};const Tr=class extends O{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const e=this.children;for(const t of e)this.vertical?t.setAttribute("label-hidden",""):t.removeAttribute("label-hidden")}render(){return m`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};Tr.styles=I`
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
  `;let Hi=Tr;kr([f({type:Number,reflect:!0})],Hi.prototype,"rows",2);kr([f({type:Boolean,reflect:!0})],Hi.prototype,"vertical",1);var yd=Object.defineProperty,_d=Object.getOwnPropertyDescriptor,Ui=(e,t,i,n)=>{for(var o=n>1?void 0:n?_d(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&yd(t,i,o),o};const Or=class extends O{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(e){this._vertical=e,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(e){this._labelHidden=e,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const e=this.children;for(const t of e)t instanceof Hi&&(t.vertical=this.vertical),t.toggleAttribute("label-hidden",this.vertical)}render(){return m`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?m`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Or.styles=I`
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
  `;let fe=Or;Ui([f({type:String,reflect:!0})],fe.prototype,"label",2);Ui([f({type:String,reflect:!0})],fe.prototype,"icon",2);Ui([f({type:Boolean,reflect:!0})],fe.prototype,"vertical",1);Ui([f({type:Boolean,attribute:"label-hidden",reflect:!0})],fe.prototype,"labelHidden",1);var xd=Object.defineProperty,wd=Object.getOwnPropertyDescriptor,zn=(e,t,i,n)=>{for(var o=n>1?void 0:n?wd(t,i):t,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=(n?r(t,i,o):r(o))||o);return n&&o&&xd(t,i,o),o};const Nr=class extends O{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(e){this._vertical=e,this.updateSections()}get vertical(){return this._vertical}set hidden(e){this._hidden=e,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const e=this.children;for(const t of e)t instanceof fe&&(t.labelHidden=this.vertical&&!Te.config.sectionLabelOnVerticalToolbar,t.vertical=this.vertical)}render(){return m`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Nr.styles=I`
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
  `;let Vi=Nr;zn([f({type:String,reflect:!0})],Vi.prototype,"icon",2);zn([f({type:Boolean,attribute:"labels-hidden",reflect:!0})],Vi.prototype,"labelsHidden",2);zn([f({type:Boolean,reflect:!0})],Vi.prototype,"vertical",1);var $d=Object.defineProperty,Cd=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&$d(t,i,o),o};const Ir=class extends O{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return m`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Ir.styles=I`
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
  `;let Pr=Ir;Cd([f({type:String,reflect:!0})],Pr.prototype,"name");/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mr="important",Ad=" !"+Mr,pt=Is(class extends Ps{constructor(e){var t;if(super(e),e.type!==Ns.ATTRIBUTE||e.name!=="style"||((t=e.strings)==null?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return n==null?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(const n of this.ft)t[n]==null&&(this.ft.delete(n),n.includes("-")?i.removeProperty(n):i[n]=null);for(const n in t){const o=t[n];if(o!=null){this.ft.add(n);const s=typeof o=="string"&&o.endsWith(Ad);n.includes("-")||s?i.setProperty(n,s?o.slice(0,-11):o,s?Mr:""):i[n]=o}}return Ft}}),Ed=e=>{const{components:t}=e,i=t.get(ea);return m`
    <bim-button
      data-ui-id="import-ifc"
      label="Load IFC"
      icon="mage:box-3d-fill"
      @click=${()=>{const n=document.createElement("input");n.type="file",n.accept=".ifc",n.onchange=async()=>{if(n.files===null||n.files.length===0)return;const o=n.files[0],s=o.name.replace(".ifc","");n.remove();const r=await o.arrayBuffer(),a=new Uint8Array(r);await i.load(a,!0,s)},n.click()}}
    ></bim-button>
  `},Sd=e=>V.create(Ed,e),kd=Object.freeze(Object.defineProperty({__proto__:null,loadIfc:Sd},Symbol.toStringTag,{value:"Module"}));({...kd});const ci={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#414141","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},tn={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"var(--bim-ui_bg-contrast-100)"},Ro=(e,t)=>{const i=((t==null?void 0:t.users)??ci.users)[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${!(i!=null&&i.picture)&&(s||r)?m`
      <bim-label
        style=${pt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
      `:null}
    <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
  </div>
`},Td=e=>{const{components:t,dataStyles:i,onTopicEnter:n}=e,o=t.get(He),s=e.topics??o.list.values();return m`
    <bim-table @cellcreated=${({detail:r})=>{const{cell:a}=r;a.style.marginLeft="0"}} ${W(r=>{if(!r)return;const a=r;a.hiddenColumns=["Guid"],a.columns=["Title"],a.selectableRows=!0,a.dataTransform={Title:(l,d)=>{const{Guid:u}=d;if(typeof u!="string")return l;const c=o.list.get(u);return c?m`
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
        </div>`:l},Priority:l=>{if(typeof l!="string")return l;const d=((i==null?void 0:i.priorities)??ci.priorities)[l];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${pt({...tn,...d==null?void 0:d.style})}
          >${l}
          </bim-label>
        `},Status:l=>{if(typeof l!="string")return l;const d=((i==null?void 0:i.statuses)??ci.statuses)[l];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${pt({...tn,...d==null?void 0:d.style})}
          >${l}
          </bim-label>
        `},Type:l=>{if(typeof l!="string")return l;const d=((i==null?void 0:i.types)??ci.types)[l];return m`
          <bim-label
            .icon=${d==null?void 0:d.icon}
            style=${pt({...tn,...d==null?void 0:d.style})}
          >${l}
          </bim-label>
        `},Author:l=>typeof l!="string"?l:Ro(l,i),Assignee:l=>typeof l!="string"?l:Ro(l,i)},a.data=[...s].map(l=>{var d;return{data:{Guid:l.guid,Title:l.title,Status:l.status,Description:l.description??"",Author:l.creationAuthor,Assignee:l.assignedTo??"",Date:l.creationDate.toDateString(),DueDate:((d=l.dueDate)==null?void 0:d.toDateString())??"",Type:l.type,Priority:l.priority??""}}})})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">There are no topics to display</bim-label>
    </bim-table>`},Lr=(e,t=!0)=>{const i=V.create(Td,e);if(t){const{components:n,topics:o}=e,[,s]=i,r=n.get(He);if(r.list.onItemUpdated.add(()=>s()),r.list.onItemDeleted.add(()=>s()),o)for(const a of o)a.relatedTopics.onItemAdded.add(()=>s()),a.relatedTopics.onItemDeleted.add(()=>s()),a.relatedTopics.onCleared.add(()=>s());else r.list.onItemSet.add(()=>s())}return i},Od=Object.freeze(Object.defineProperty({__proto__:null,topicsList:Lr},Symbol.toStringTag,{value:"Module"})),Nd=e=>{var t;const{components:i,topic:n,actions:o}=e,s={selectComponents:!0,colorizeComponent:!0,resetColors:!0,updateCamera:!0,delete:!0,unlink:!!n,...o},r=i.get($n),a=((t=e.topic)==null?void 0:t.viewpoints)??r.list.keys(),l=[];for(const d of a){const u=r.list.get(d);u&&l.push(u)}return m`
    <bim-table ${W(d=>{if(!d)return;const u=d;u.addEventListener("cellcreated",({detail:c})=>{const{cell:h}=c;h.style.padding="0.25rem"}),u.headersHidden=!0,u.hiddenColumns=["Guid"],u.columns=["Title",{name:"Actions",width:"auto"}],u.dataTransform={Actions:(c,h)=>{const{Guid:p}=h;if(!(p&&typeof p=="string"))return p;const b=r.list.get(p);return b?m`
          <bim-button icon="ph:eye-fill" @click=${()=>b.go()}></bim-button>
          ${Object.values(s).includes(!0)?m`
                <bim-button icon="prime:ellipsis-v">
                  <bim-context-menu>
                    ${s.selectComponents?m`<bim-button label="Select Components" @click=${()=>console.log(b.selection)}></bim-button> `:null}
                    ${s.colorizeComponent?m`<bim-button label="Colorize Components" @click=${()=>b.colorize()}></bim-button> `:null}
                    ${s.resetColors?m`<bim-button label="Reset Colors" @click=${()=>b.resetColors()}></bim-button> `:null}
                    ${s.updateCamera?m`<bim-button label="Update Camera" @click=${()=>b.updateCamera()}></bim-button> `:null}
                    ${s.unlink?m`<bim-button .disabled=${!n} label="Unlink" @click=${()=>n==null?void 0:n.viewpoints.delete(b.guid)}></bim-button> `:null}
                    ${s.delete?m`<bim-button label="Delete" @click=${()=>r.list.delete(b.guid)}></bim-button>`:null}
                  </bim-context-menu>
                </bim-button>
              `:null}
        `:p}},u.data=l.map((c,h)=>({data:{Guid:c.guid,Title:c.title??`Viewpoint ${e.topic?h+1:""}`,Actions:""}}))})}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">No viewpoints to show</bim-label>
    </bim-table>
  `},Fn=(e,t=!0)=>{const i=V.create(Nd,e),{components:n,topic:o}=e;if(t){const[,s]=i,r=n.get($n);r.list.onItemUpdated.add(()=>s()),r.list.onItemDeleted.add(()=>s()),r.list.onCleared.add(()=>s()),o?(o.viewpoints.onItemAdded.add(()=>s()),o.viewpoints.onItemDeleted.add(()=>s()),o.viewpoints.onCleared.add(()=>s())):r.list.onItemSet.add(()=>s())}return i},Id=Object.freeze(Object.defineProperty({__proto__:null,viewpointsList:Fn},Symbol.toStringTag,{value:"Module"})),Pd={"jhon.doe@example.com":{name:"Jhon Doe",picture:"https://www.profilebakery.com/wp-content/uploads/2023/04/Profile-Image-AI.jpg"}},Md=(e,t)=>{const i=(t??Pd)[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${!(i!=null&&i.picture)&&(s||r)?m`
      <bim-label
        style=${pt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
      `:null}
    <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
  </div>
`},Ld=e=>{const{topic:t,styles:i,viewpoint:n,actions:o}=e,s={delete:!0,...o};return m`<bim-table @cellcreated=${({detail:r})=>{const{cell:a}=r;a.style.marginLeft="0"}} ${W(r=>{if(!r)return;const a=r;a.headersHidden=!0,a.hiddenColumns=["guid","author"],a.dataTransform={Comment:(d,u)=>{const{guid:c}=u;if(typeof c!="string")return d;const h=t.comments.get(c);if(!h)return d;const p=()=>{t.comments.delete(c)};return m`
        <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1">
          <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; gap: 0.375rem;">
              ${Md(h.author,i)}
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
      `}};let l=t.comments.values();n&&(l=[...t.comments.values()].filter(d=>d.viewpoint===n)),a.data=[...l].map(d=>({data:{guid:d.guid,Comment:d.comment,author:(()=>{const u=i;if(!u)return d.author;const c=u[d.author];return(c==null?void 0:c.name)??d.author})()}}))})}><bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">This topic has no comments</bim-label></bim-table>`},Rr=(e,t=!0)=>{const i=V.create(Ld,e);if(t){const{topic:n}=e,[o,s]=i;n.comments.onItemSet.add(()=>s()),n.comments.onItemUpdated.add(()=>s()),n.comments.onItemDeleted.add(()=>s()),n.comments.onCleared.add(()=>s())}return i},Rd=Object.freeze(Object.defineProperty({__proto__:null,topicComments:Rr},Symbol.toStringTag,{value:"Module"})),di={users:{"jhon.doe@example.com":{name:"Jhon Doe"}},priorities:{"On hold":{icon:"flowbite:circle-pause-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#767676"}},Minor:{icon:"mingcute:arrows-down-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#4CAF50"}},Normal:{icon:"fa6-solid:grip-lines",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Major:{icon:"mingcute:arrows-up-fill",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Critical:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}}},statuses:{Active:{icon:"prime:circle-fill",style:{backgroundColor:"#2E2E2E"}},"In Progress":{icon:"prime:circle-fill",style:{backgroundColor:"#fa89004d","--bim-label--c":"#FB8C00","--bim-icon--c":"#FB8C00"}},"In Review":{icon:"prime:circle-fill",style:{backgroundColor:"#9c6bff4d","--bim-label--c":"#9D6BFF","--bim-icon--c":"#9D6BFF"}},Done:{icon:"prime:circle-fill",style:{backgroundColor:"#4CAF504D","--bim-label--c":"#4CAF50","--bim-icon--c":"#4CAF50"}},Closed:{icon:"prime:circle-fill",style:{backgroundColor:"#2E2E2E","--bim-label--c":"#727272","--bim-icon--c":"#727272"}}},types:{Clash:{icon:"gg:close-r",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Issue:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Failure:{icon:"mdi:bug-outline",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Inquiry:{icon:"majesticons:comment-line",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Fault:{icon:"ph:warning",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FF5252"}},Remark:{icon:"ph:note-blank-bold",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#FB8C00"}},Request:{icon:"mynaui:edit-one",style:{backgroundColor:"var(--bim-ui_bg-contrast-20)","--bim-icon--c":"#9D6BFF"}}}},en={padding:"0.25rem 0.5rem",borderRadius:"999px","--bim-label--c":"white"},nn=(e,t)=>{const i=((t==null?void 0:t.users)??di.users)[e],n=(i==null?void 0:i.name)??e,o=n.trim().split(/\s+/);let s,r;return o[0]&&o[0][0]&&(s=o[0][0].toUpperCase(),o[0][1]&&(r=o[0][1].toUpperCase())),o[1]&&o[1][0]&&(r=o[1][0].toUpperCase()),m`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${!(i!=null&&i.picture)&&(s||r)?m`
      <bim-label
        style=${pt({borderRadius:"999px",padding:"0.375rem",backgroundColor:"var(--bim-ui_bg-contrast-20)",aspectRatio:"1",fontSize:"0.7rem"})}>${s}${r}</bim-label>
      `:null}
    <bim-label .img=${i==null?void 0:i.picture}>${n}</bim-label>
  </div>
`},[Ci,Dd]=V.create(e=>{const{topic:t}=e,i=document.createElement("bim-text-input");i.type="area";const n=()=>{i.value="",Ci.close(),Ci.remove()};return m`
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
    `},{}),[Ai,jd]=V.create(e=>{const{components:t,topic:i}=e;let n;t&&(n=Fn({components:t,actions:{delete:!1,updateCamera:!1,colorizeComponent:!1,resetColors:!1,selectComponents:!1}})[0],n.selectableRows=!0);const o=()=>{Ai.close(),Ai.remove(),n==null||n.remove()};return m`
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
    `},{}),[Ei,zd]=V.create(e=>{const{components:t,topic:i}=e;let n;if(t){const s=[...t.get(He).list.values()].filter(r=>r!==i);n=Lr({components:t,topics:s})[0],n.selectableRows=!0,n.hiddenColumns=["Guid","Author","Assignee","Date","DueDate"]}const o=()=>{Ei.close(),Ei.remove(),n==null||n.remove()};return m`
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
    `},{}),Fd=e=>{const{components:t,topic:i,styles:n,onUpdateInformation:o,actions:s,world:r}=e,a={update:!0,addComments:!0,linkViewpoints:!0,addViewpoints:!0,linkTopics:!0,...s},l=(n==null?void 0:n.priorities)??di.priorities,d=(n==null?void 0:n.statuses)??di.statuses,u=(n==null?void 0:n.types)??di.types;let c;i!=null&&i.priority&&(c=l[i.priority]);let h;i!=null&&i.type&&(h=u[i.type]);let p;i!=null&&i.type&&(p=d[i.status]);let b,v,y;i&&(b=Rr({topic:i,styles:n==null?void 0:n.users})[0],v=Fn({components:t,topic:i})[0]);const g=()=>{if(!(i&&r))return;const A=t.get($n).create(r);i.viewpoints.add(A.guid)},_=()=>{Dd({topic:i}),document.body.append(Ci),Ci.showModal()},x=()=>{jd({components:t,topic:i}),document.body.append(Ai),Ai.showModal()},w=()=>{zd({components:t,topic:i}),document.body.append(Ei),Ei.showModal()};return m`
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
        <bim-label .icon=${p==null?void 0:p.icon} style=${pt({...en,...p==null?void 0:p.style})}
        >${i.status}
        </bim-label>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Type</bim-label> 
        <bim-label .icon=${h==null?void 0:h.icon} style=${pt({...en,...h==null?void 0:h.style})}
        >${i.type}
        </bim-label>
      </div>
      ${i.priority?m`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Priority</bim-label> 
              <bim-label .icon=${c==null?void 0:c.icon} style=${pt({...en,...c==null?void 0:c.style})}
              >${i.priority}
              </bim-label>
            </div>`:null}
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Author</bim-label> 
        ${nn(i.creationAuthor,n)}
      </div>
      ${i.assignedTo?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Assignee</bim-label> 
            ${nn(i.assignedTo,n)}
          </div>`:null}
      ${i.dueDate?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Due Date</bim-label> 
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${i.dueDate.toDateString()}</bim-label>
          </div>`:null}
      ${i.modifiedAuthor?m`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Modified By</bim-label> 
            ${nn(i.modifiedAuthor,n)}
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
      ${b}
      ${a.addComments?m`
            <bim-button @click=${_} label="Add Comment" icon="majesticons:comment-line"></bim-button>
          `:null}
    </bim-panel-section>
    <bim-panel-section label="Viewpoints" icon="tabler:camera">
      ${v}
      ${a.linkViewpoints||a.addViewpoints?m`
          <div style="display: flex; gap: 0.375rem">
            ${a.addViewpoints?m`<bim-button @click=${g} .disabled=${!r} label="Add Viewpoint" icon="mi:add"></bim-button> `:null}
            ${a.linkViewpoints?m`<bim-button @click=${x} label="Link Viewpoint" icon="tabler:camera"></bim-button>`:null}
          </div>
          `:null}
    </bim-panel-section>
    <!-- <bim-panel-section label="Related Topics" icon="material-symbols:topic-outline">
      ${y}
      ${a.linkViewpoints?m`
            <bim-button @click=${w} label="Link Topic" icon="material-symbols:topic-outline"></bim-button> 
          `:null}
    </bim-panel-section> -->
    `:m`<bim-label>No topic selected!</bim-label>`}
   </bim-panel> 
  `},Bd=(e,t=!0)=>{const i=V.create(Fd,e);if(t){const{components:n}=e,[o,s]=i;n.get(He).list.onItemUpdated.add(({value:r})=>{const{topic:a}=s(),{guid:l}=r;l===(a==null?void 0:a.guid)&&s()})}return i},Hd=Object.freeze(Object.defineProperty({__proto__:null,topicData:Bd},Symbol.toStringTag,{value:"Module"}));({...Hd});const Ud=e=>{const{components:t,actions:i,tags:n}=e,o=(i==null?void 0:i.dispose)??!0,s=(i==null?void 0:i.download)??!0,r=(i==null?void 0:i.visibility)??!0,a=(n==null?void 0:n.schema)??!0,l=(n==null?void 0:n.viewDefinition)??!0,d=t.get(Ht),u=({detail:c})=>{const{cell:h}=c;h.style.padding="0.25rem 0"};return m`
    <bim-table ${W(c=>{if(!c)return;const h=c;h.hiddenColumns=["modelID"];const p=[];for(const[,b]of d.groups){if(!b)continue;const v={data:{Name:b.name||b.uuid,modelID:b.uuid}};p.push(v)}h.dataTransform={Name:(b,v)=>{const{modelID:y}=v;if(typeof y!="string")return b;const g=d.groups.get(y);if(!g)return y;const _={};for(const k of g.items)_[k.id]=k.ids;let x;const{schema:w}=g.ifcMetadata;a&&w&&(x=m`
            <bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${w}</bim-label>
            `);let A;if(l&&"viewDefinition"in g.ifcMetadata){const k=g.ifcMetadata.viewDefinition;A=m`
            ${k.split(",").map(S=>m`<bim-label style="background-color: var(--bim-ui_main-base); padding: 0 0.25rem; color: var(--bim-ui_main-contrast); border-radius: 0.25rem;">${S}</bim-label>`)}
          `}let C;o&&(C=m`<bim-button @click=${()=>d.disposeGroup(g)} icon="mdi:delete"></bim-button>`);let N;r&&(N=m`<bim-button @click=${k=>{const S=t.get(ts),H=k.target;S.set(H.hasAttribute("data-model-hidden"),_),H.toggleAttribute("data-model-hidden"),H.icon=H.hasAttribute("data-model-hidden")?"mdi:eye-off":"mdi:eye"}} icon="mdi:eye"></bim-button>`);let L;return s&&(L=m`<bim-button @click=${()=>{const k=document.createElement("input");k.type="file",k.accept=".ifc",k.multiple=!1,k.addEventListener("change",async()=>{if(!(k.files&&k.files.length===1))return;const S=k.files[0],H=await S.arrayBuffer(),E=await t.get(ia).saveToIfc(g,new Uint8Array(H)),M=new File([E],S.name),$=document.createElement("a");$.href=URL.createObjectURL(M),$.download=M.name,$.click(),URL.revokeObjectURL($.href)}),k.click()}} icon="flowbite:download-solid"></bim-button>`),m`
         <div style="display: flex; flex: 1; gap: var(--bim-ui_size-4xs); justify-content: space-between; overflow: auto;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bim-ui_size-4xs); flex-grow: 1; overflow: auto;">
            <div style="min-height: 1.75rem; overflow: auto; display: flex;">
              <bim-label style="white-space: normal;">${b}</bim-label>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: var(--bim-ui_size-4xs); overflow: auto;">
              ${x}
              ${A}
            </div>
          </div>
          <div style="display: flex; align-self: flex-start; flex-shrink: 0;">
            ${L}
            ${N}
            ${C}
          </div>
         </div>
        `}},h.data=p})} @cellcreated=${u} headers-hidden no-indentation>
      <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No models has been loaded yet
      </bim-label>
    </bim-table>
  `},Vd=(e,t=!0)=>{const i=V.create(Ud,e);if(t){const{components:n}=e,o=n.get(Ht),[,s]=i;o.onFragmentsLoaded.add(()=>setTimeout(()=>s())),o.onFragmentsDisposed.add(()=>s())}return i},Wd=Object.freeze(Object.defineProperty({__proto__:null,modelsList:Vd},Symbol.toStringTag,{value:"Module"})),Dr=["Name","ContainedInStructure","ForLayerSet","LayerThickness","HasProperties","HasAssociations","HasAssignments","HasPropertySets","PredefinedType","Quantities","ReferencedSource","Identification",e=>e.includes("Value"),e=>e.startsWith("Material"),e=>e.startsWith("Relating"),e=>{const t=["IsGroupedBy","IsDecomposedBy"];return e.startsWith("Is")&&!t.includes(e)}];async function ui(e,t,i,n=Dr,o=!1){const s=e.get(ct),r=await t.getProperties(i);if(!r)return{data:{Entity:`${i} properties not found...`}};const a=s.relationMaps[t.uuid],l={data:{}};for(const d in r){const u=n.map(h=>typeof h=="string"?d===h:h(d)).includes(!0);if(!(d==="type"||u))continue;const c=r[d];if(c)if(c.type===5){l.children||(l.children=[]);const h=await ui(e,t,c.value,n,o);l.children.push(h)}else if(typeof c=="object"&&!Array.isArray(c)){const{value:h,type:p}=c;if(o)p===1||p===2||p===3||(l.data[d]=h);else{const b=typeof h=="number"?Number(h.toFixed(3)):h;l.data[d]=b}}else if(Array.isArray(c))for(const h of c){if(h.type!==5)continue;l.children||(l.children=[]);const p=await ui(e,t,h.value,n,o);l.children.push(p)}else if(d==="type"){const h=pi[c];l.data.Entity=h}else l.data[d]=c}if(a&&a.get(r.expressID)){const d=a.get(r.expressID);for(const u of n){const c=[];if(typeof u=="string"){const h=s._inverseAttributes.indexOf(u);h!==-1&&c.push(h)}else{const h=s._inverseAttributes.filter(p=>u(p));for(const p of h){const b=s._inverseAttributes.indexOf(p);c.push(b)}}for(const h of c){const p=d.get(h);if(p)for(const b of p){const v=await ui(e,t,b,n,o);l.children||(l.children=[]),l.children.push(v)}}}}return l}const Gd=e=>{const{components:t,fragmentIdMap:i,attributesToInclude:n,editable:o,tableDefinition:s}=e,r=t.get(Ht);let a;return typeof n=="function"?a=n(Dr):a=n,m`<bim-table ${W(async l=>{if(!l)return;const d=l,u=[],c=[];for(const h in i){const p=r.list.get(h);if(!(p&&p.group))continue;const b=p.group,v=c.find(y=>y.model===b);if(v)for(const y of i[h])v.expressIDs.add(y);else{const y={model:b,expressIDs:new Set(i[h])};c.push(y)}}for(const h of c){const{model:p,expressIDs:b}=h;for(const v of b){const y=await ui(t,p,v,a,o);u.push(y)}}d.dataTransform=s,d.data=u,d.columns=[{name:"Entity",width:"minmax(15rem, 1fr)"}]})}></bim-table>`},qd=e=>V.create(Gd,e),Yd=Object.freeze(Object.defineProperty({__proto__:null,entityAttributes:qd},Symbol.toStringTag,{value:"Module"}));let yt;const Xd=e=>{const{components:t,classifications:i}=e,n=t.get(na),o=t.get(ts);yt||(yt=document.createElement("bim-table"),yt.headersHidden=!0,yt.hiddenColumns=["system"],yt.columns=["Name",{name:"Actions",width:"auto"}],yt.dataTransform={Actions:(r,a)=>{const{system:l,Name:d}=a;if(!(typeof l=="string"&&typeof d=="string"))return r;const u=n.list[l];if(!(u&&u[d]))return r;const c=u[d],{map:h}=c;return m`
          <div>
            <bim-checkbox checked @change=${p=>{const b=p.target;o.set(b.value,h)}}></bim-checkbox>
          </div>
        `}});const s=[];for(const r of i){const a=typeof r=="string"?r:r.system,l=typeof r=="string"?r:r.label,d=n.list[a];d&&s.push({data:{Name:l,system:a},children:Object.keys(d).map(u=>({data:{Name:u,system:a,Actions:""}}))})}return yt.data=s,m`${yt}`},Jd=(e,t=!0)=>{const i=V.create(Xd,e);if(t){const{components:n}=e,o=n.get(Ht),[,s]=i;o.onFragmentsDisposed.add(()=>s())}return i},Qd=Object.freeze(Object.defineProperty({__proto__:null,classificationTree:Jd},Symbol.toStringTag,{value:"Module"})),jr=async(e,t,i)=>{var n,o,s,r;const a=e.get(ct),l={data:{Name:(n=i.Name)==null?void 0:n.value},children:[{data:{Name:"Identification",Value:(o=i.Identification)==null?void 0:o.value}},{data:{Name:"Name",Value:(s=i.Name)==null?void 0:s.value}},{data:{Name:"Description",Value:(r=i.Description)==null?void 0:r.value}}]},d=a.getEntityRelations(t,i.expressID,"IsNestedBy");if(!d)return l;l.children||(l.children=[]);const u=[];l.children.push({data:{Name:"Tasks"},children:u});for(const c of d){const h=await t.getProperties(c);if(!h)continue;const p=await jr(e,t,h);u.push(p)}return l},Kd=async(e,t,i)=>{const n=[];for(const o of i){const s=await jr(e,t,o);n.push(s)}return{data:{Name:"Tasks"},children:n}},Zd=async(e,t)=>{var i,n;const o={data:{Name:"Classifications"}};for(const s of t){const{value:r}=s.ReferencedSource,a=await e.getProperties(r);if(!a)continue;const l={data:{Name:a.Name.value},children:[{data:{Name:"Identification",Value:((i=s.Identification)==null?void 0:i.value)||((n=s.ItemReference)==null?void 0:n.value)}},{data:{Name:"Name",Value:s.Name.value}}]};o.children||(o.children=[]),o.children.push(l)}return o},tu=async(e,t)=>{const i={data:{Name:"Materials"}};for(const n of t){if(n.type===ns){const o=n.ForLayerSet.value,s=await e.getProperties(o);if(!s)continue;for(const r of s.MaterialLayers){const{value:a}=r,l=await e.getProperties(a);if(!l)continue;const d=await e.getProperties(l.Material.value);if(!d)continue;const u={data:{Name:"Layer"},children:[{data:{Name:"Thickness",Value:l.LayerThickness.value}},{data:{Name:"Material",Value:d.Name.value}}]};i.children||(i.children=[]),i.children.push(u)}}if(n.type===ss)for(const o of n.Materials){const{value:s}=o,r=await e.getProperties(s);if(!r)continue;const a={data:{Name:"Name",Value:r.Name.value}};i.children||(i.children=[]),i.children.push(a)}if(n.type===os){const o={data:{Name:"Name",Value:n.Name.value}};i.children||(i.children=[]),i.children.push(o)}}return i},eu={IFCLENGTHMEASURE:"LENGTHUNIT",IFCAREAMEASURE:"AREAUNIT",IFCVOLUMEMEASURE:"VOLUMEUNIT",IFCPLANEANGLEMEASURE:"PLANEANGLEUNIT"},iu={MILLIMETRE:{symbol:"mm",digits:0},METRE:{symbol:"m",digits:2},KILOMETRE:{symbol:"km",digits:2},SQUARE_METRE:{symbol:"m²",digits:2},CUBIC_METRE:{symbol:"m³",digits:2},DEGREE:{symbol:"°",digits:2},RADIAN:{symbol:"rad",digits:2},GRAM:{symbol:"g",digits:0},KILOGRAM:{symbol:"kg",digits:2},MILLISECOND:{symbol:"ms",digits:0},SECOND:{symbol:"s",digits:0}},zr=async(e,t)=>{var i,n,o;const s=Object.values(await e.getAllPropertiesOfType(ya))[0];let r;for(const a of s.Units){const l=await e.getProperties(a.value);if(l&&((i=l.UnitType)==null?void 0:i.value)===eu[t]){r=`${((n=l.Prefix)==null?void 0:n.value)??""}${((o=l.Name)==null?void 0:o.value)??""}`;break}}return r?iu[r]:null},nu=async(e,t,i)=>{const{displayUnits:n}=i,o={data:{Name:"PropertySets"}};for(const s of t){const r={data:{Name:s.Name.value}};if(s.type===es){for(const a of s.HasProperties){const{value:l}=a,d=await e.getProperties(l);if(!d)continue;const u=Object.keys(d).find(b=>b.includes("Value"));if(!(u&&d[u]))continue;let c=d[u].value,h="";if(n){const{name:b}=d[u],v=await zr(e,b)??{};h=v.symbol,c=d[u].value,typeof c=="number"&&v.digits&&(c=c.toFixed(v.digits))}const p={data:{Name:d.Name.value,Value:`${c} ${h??""}`}};r.children||(r.children=[]),r.children.push(p)}r.children&&(o.children||(o.children=[]),o.children.push(r))}}return o},ou=async(e,t,i)=>{const{displayUnits:n}=i,o={data:{Name:"QuantitySets"}};for(const s of t){const r={data:{Name:s.Name.value}};if(s.type===is){for(const a of s.Quantities){const{value:l}=a,d=await e.getProperties(l);if(!d)continue;const u=Object.keys(d).find(b=>b.includes("Value"));if(!(u&&d[u]))continue;let c=d[u].value,h="";if(n){const{name:b}=d[u],v=await zr(e,b)??{};h=v.symbol,c=d[u].value,typeof c=="number"&&v.digits&&(c=c.toFixed(v.digits))}const p={data:{Name:d.Name.value,Value:`${c} ${h??""}`}};r.children||(r.children=[]),r.children.push(p)}r.children&&(o.children||(o.children=[]),o.children.push(r))}}return o},su=["OwnerHistory","ObjectPlacement","CompositionType"],Fr=async(e,t)=>{const i={groupName:"Attributes",includeClass:!1,...t},{groupName:n,includeClass:o}=i,s={data:{Name:n}};o&&(s.children||(s.children=[]),s.children.push({data:{Name:"Class",Value:pi[e.type]}}));for(const r in e){if(su.includes(r))continue;const a=e[r];if(a&&typeof a=="object"&&!Array.isArray(a)){if(a.type===ma)continue;const l={data:{Name:r,Value:a.value}};s.children||(s.children=[]),s.children.push(l)}}return s},ne=(e,...t)=>{e.children||(e.children=[]),e.children.push(...t)},ru=async(e,t,i,n,o)=>{const s=e.get(ct).getEntityRelations(t,i,"IsDefinedBy");if(s){const r=[],a=[];for(const u of s){const c=await t.getProperties(u);c&&(c.type===es&&r.push(c),c.type===is&&a.push(c))}const l=await nu(t,r,o);l.children&&ne(n,l);const d=await ou(t,a,o);d.children&&ne(n,d)}},au=async(e,t,i,n)=>{const o=e.get(ct).getEntityRelations(t,i,"HasAssociations");if(o){const s=[],r=[];for(const d of o){const u=await t.getProperties(d);u&&(u.type===ba&&s.push(u),(u.type===ns||u.type===fa||u.type===ga||u.type===os||u.type===ss)&&r.push(u))}const a=await Zd(t,s);a.children&&ne(n,a);const l=await tu(t,r);l.children&&ne(n,l)}},lu=async(e,t,i,n)=>{const o=e.get(ct).getEntityRelations(t,i,"HasAssignments");if(o){const s=[];for(const a of o){const l=await t.getProperties(a);l&&l.type===va&&s.push(l)}const r=await Kd(e,t,s);r.children&&ne(n,r)}},cu=async(e,t,i,n)=>{const o=e.get(ct).getEntityRelations(t,i,"ContainedInStructure");if(o&&o[0]){const s=o[0],r=await t.getProperties(s);if(r){const a=await Fr(r,{groupName:"SpatialContainer"});ne(n,a)}}};let ri={};const du=async(e,t,i)=>{var n;const o=e.get(ct),s=e.get(Ht),r=s.getModelIdMap(t);Object.keys(t).length===0&&(ri={});const a=[];for(const l in r){const d=s.groups.get(l);if(!d)continue;const u=o.relationMaps[d.uuid];if(!u)continue;l in ri||(ri[l]=new Map);const c=ri[l],h=r[l];for(const p of h){let b=c.get(p);if(b){a.push(b);continue}const v=await d.getProperties(p);if(!v)continue;b={data:{Name:(n=v.Name)==null?void 0:n.value}},a.push(b),c.set(p,b);const y=await Fr(v,{includeClass:!0});b.children||(b.children=[]),b.children.push(y),u.get(p)&&(await ru(e,d,p,b,i),await au(e,d,p,b),await lu(e,d,p,b),await cu(e,d,p,b))}}return a},uu=e=>{const t={emptySelectionWarning:!0,...e},{components:i,fragmentIdMap:n,emptySelectionWarning:o}=t;return m`
    <bim-table @cellcreated=${({detail:s})=>{const{cell:r}=s;r.column==="Name"&&!("Value"in r.rowData)&&(r.style.gridColumn="1 / -1")}} ${W(async s=>{if(!s)return;const r=s;r.columns=[{name:"Name",width:"12rem"}],r.headersHidden=!0,r.loadFunction=()=>du(i,n,e),await r.loadData(!0)&&r.dispatchEvent(new Event("datacomputed"))})}>
      ${o?m`
            <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
              Select some elements to display its properties
            </bim-label>
          `:null}
    </bim-table>
  `},hu=e=>V.create(uu,e),pu=Object.freeze(Object.defineProperty({__proto__:null,elementProperties:hu},Symbol.toStringTag,{value:"Module"})),xn=async(e,t,i,n)=>{var o;const s=[],r=e.get(ct),a=await t.getProperties(i);if(!a)return s;const{type:l}=a,d={data:{Entity:pi[l],Name:(o=a.Name)==null?void 0:o.value,modelID:t.uuid,expressID:i}};for(const u of n){const c=r.getEntityRelations(t,i,u);if(!c)continue;d.children||(d.children=[]),d.data.relations=JSON.stringify(c);const h={};for(const p of c){const b=await xn(e,t,p,n);for(const v of b)if(v.data.relations)d.children.push(v);else{const y=t.data.get(p);if(!y){d.children.push(v);continue}const g=y[1][1],_=pi[g];_ in h||(h[_]=[]),v.data.Entity=v.data.Name,delete v.data.Name,h[_].push(v)}}for(const p in h){const b=h[p],v=b.map(g=>g.data.expressID),y={data:{Entity:p,modelID:t.uuid,relations:JSON.stringify(v)},children:b};d.children.push(y)}}return s.push(d),s},mu=async(e,t,i,n)=>{const o=e.get(ct),s=[];for(const r of t){let a;if(n)a={data:{Entity:r.name!==""?r.name:r.uuid},children:await xn(e,r,n,i)};else{const l=o.relationMaps[r.uuid],d=await r.getAllPropertiesOfType(pa);if(!(l&&d))continue;const{expressID:u}=Object.values(d)[0];a={data:{Entity:r.name!==""?r.name:r.uuid},children:await xn(e,r,u,i)}}s.push(a)}return s};let ut;const bu=(e,t)=>{const i=e.get(Ht),{modelID:n,expressID:o,relations:s}=t.data;if(!n)return null;const r=i.groups.get(n);return r?r.getFragmentMap([o,...JSON.parse(s??"[]")]):null},fu=e=>{const{components:t,models:i,expressID:n}=e,o=e.selectHighlighterName??"select",s=e.hoverHighlighterName??"hover";ut||(ut=document.createElement("bim-table"),ut.hiddenColumns=["modelID","expressID","relations"],ut.columns=["Entity","Name"],ut.headersHidden=!0,ut.addEventListener("cellcreated",({detail:a})=>{const{cell:l}=a;l.column==="Entity"&&!("Name"in l.rowData)&&(l.style.gridColumn="1 / -1")})),ut.addEventListener("rowcreated",a=>{a.stopImmediatePropagation();const{row:l}=a.detail,d=t.get(xa),u=bu(t,l);u&&Object.keys(u).length!==0&&(l.onmouseover=()=>{s&&(l.style.backgroundColor="var(--bim-ui_bg-contrast-20)",d.highlightByID(s,u,!0,!1,d.selection[o]??{}))},l.onmouseout=()=>{l.style.backgroundColor="",d.clear(s)},l.onclick=()=>{o&&d.highlightByID(o,u,!0,!0)})});const r=e.inverseAttributes??["IsDecomposedBy","ContainsElements"];return mu(t,i,r,n).then(a=>ut.data=a),m`${ut}`},gu=(e,t=!0)=>{const i=V.create(fu,e);if(t){const[,n]=i,{components:o}=e,s=o.get(Ht),r=o.get(ct),a=()=>n({models:s.groups.values()});r.onRelationsIndexed.add(a),s.onFragmentsDisposed.add(a)}return i},vu=Object.freeze(Object.defineProperty({__proto__:null,relationsTree:gu},Symbol.toStringTag,{value:"Module"})),$e=(e,t)=>[...e.get(Zo).list.values()].find(i=>i.world===t),yu=(e,t)=>m`
    <bim-color-input @input=${i=>{const n=i.target;e.color=new ae(n.color)}} color=${t}></bim-color-input>
  `,_u=(e,t)=>{const{postproduction:i}=e,n=i.n8ao.configuration;return m`
    <bim-color-input @input=${o=>{const s=o.target;n.color=new ae(s.color)}} color=${t}></bim-color-input>
  `},xu=(e,t)=>{const{color:i,opacity:n}=JSON.parse(t),{postproduction:o}=e,{customEffects:s}=o;return m`
    <bim-color-input @input=${r=>{const{color:a,opacity:l}=r.target;s.lineColor=new ae(a).getHex(),l&&(s.opacity=l/100)}} color=${i} opacity=${n*100}></bim-color-input>
  `},wu=(e,t)=>m`
    <bim-color-input @input=${i=>{const n=i.target,o=new ae(n.color);e.material.uniforms.uColor.value=o}} color=${t}></bim-color-input>
  `,$u=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({ao:o.checked})}} .checked=${t}></bim-checkbox>
  `},Cu=(e,t)=>{const{postproduction:i}=e;return m`
    <bim-checkbox @change=${n=>{const o=n.target;i.setPasses({gamma:o.checked})}} .checked=${t}></bim-checkbox>
  `},Au=(e,t)=>{const{postproduction:i}=e;return m`
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
  `},Eu=e=>{const{components:t}=e,i=t.get(Ni);return m`
    <bim-table @cellcreated=${({detail:n})=>{const o=n.cell.parentNode;if(!o)return;const s=o.querySelector("bim-table-cell[column='Name']"),r=o.querySelector("bim-table-cell[column='Value']");s&&!r&&(s.style.gridColumn="1 / -1")}} ${W(async n=>{var o,s,r,a,l;if(!n)return;const d=n;d.preserveStructureOnFilter=!0,d.dataTransform={Value:(c,h)=>{const p=h.World,b=i.list.get(p);if(!b)return c;const{scene:v,camera:y,renderer:g}=b,_=h.Name;if(_==="Grid"&&h.IsGridConfig&&typeof c=="boolean"){const x=$e(t,b);return x?_t(x,"visible",c):c}if(_==="Color"&&h.IsGridConfig&&typeof c=="string"){const x=$e(t,b);return x?wu(x,c):c}if(_==="Distance"&&h.IsGridConfig&&typeof c=="number"){const x=$e(t,b);return x?P(x.material.uniforms.uDistance,"value",c,{slider:!0,min:300,max:1e3}):c}if(_==="Size"&&h.IsGridConfig&&typeof c=="string"){const x=$e(t,b);if(!x)return c;const{x:w,y:A}=JSON.parse(c),C=P(x.material.uniforms.uSize1,"value",w,{slider:!0,suffix:"m",prefix:"A",min:1,max:20}),N=P(x.material.uniforms.uSize2,"value",A,{slider:!0,suffix:"m",prefix:"B",min:1,max:20});return m`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${C}${N}</div>
          `}if(_==="Near Frustum"&&y.three instanceof ni&&typeof c=="number"){const x=y.three;return P(y.three,"near",c,{slider:!0,min:.1,max:10,step:.1,onInputSet:()=>x.updateProjectionMatrix()})}if(_==="Far Frustum"&&y.three instanceof ni&&typeof c=="number"){const x=y.three;return P(y.three,"far",c,{slider:!0,min:300,max:2e3,step:10,onInputSet:()=>x.updateProjectionMatrix()})}if(_==="Field of View"&&y.three instanceof ni&&typeof c=="number"){const x=y.three;return P(y.three,"fov",c,{slider:!0,min:10,max:120,onInputSet:()=>x.updateProjectionMatrix()})}if(_==="Invert Drag"&&y.hasCameraControls()&&typeof c=="boolean")return _t(y.controls,"dollyDragInverted",c);if(_==="Dolly Speed"&&y.hasCameraControls()&&typeof c=="number")return P(y.controls,"dollySpeed",c,{slider:!0,min:.5,max:3,step:.1});if(_==="Truck Speed"&&y.hasCameraControls()&&typeof c=="number")return P(y.controls,"truckSpeed",c,{slider:!0,min:.5,max:6,step:.1});if(_==="Smooth Time"&&y.hasCameraControls()&&typeof c=="number")return P(y.controls,"smoothTime",c,{slider:!0,min:.01,max:2,step:.01});if(_==="Intensity"&&typeof c=="number"){if(h.Light&&typeof h.Light=="string"){const x=v.three.children.find(w=>w.uuid===h.Light);return x&&x instanceof _e?P(x,"intensity",c,{slider:!0,min:0,max:10,step:.1}):c}if(h.IsAOConfig&&g instanceof R)return P(g.postproduction.n8ao.configuration,"intensity",c,{slider:!0,max:16,step:.1})}if(_==="Color"&&typeof c=="string"){const x=h.Light,w=v.three.children.find(A=>A.uuid===x);if(w&&w instanceof _e)return yu(w,c);if(h.IsAOConfig&&g instanceof R)return _u(g,c)}if(_==="Ambient Oclussion"&&typeof c=="boolean"&&h.IsAOConfig&&g instanceof R)return $u(g,c);if(_==="Half Resolution"&&h.IsAOConfig&&g instanceof R&&typeof c=="boolean")return _t(g.postproduction.n8ao.configuration,"halfRes",c);if(_==="Screen Space Radius"&&h.IsAOConfig&&g instanceof R&&typeof c=="boolean")return _t(g.postproduction.n8ao.configuration,"screenSpaceRadius",c);if(_==="Radius"&&h.IsAOConfig&&g instanceof R&&typeof c=="number")return P(g.postproduction.n8ao.configuration,"aoRadius",c,{slider:!0,max:2,step:.1});if(_==="Denoise Samples"&&h.IsAOConfig&&g instanceof R&&typeof c=="number")return P(g.postproduction.n8ao.configuration,"denoiseSamples",c,{slider:!0,min:1,max:16});if(_==="Samples"&&h.IsAOConfig&&g instanceof R&&typeof c=="number")return P(g.postproduction.n8ao.configuration,"aoSamples",c,{slider:!0,min:1,max:16});if(_==="Denoise Radius"&&h.IsAOConfig&&g instanceof R&&typeof c=="number")return P(g.postproduction.n8ao.configuration,"denoiseRadius",c,{slider:!0,min:0,max:16,step:.1});if(_==="Distance Falloff"&&h.IsAOConfig&&g instanceof R&&typeof c=="number")return P(g.postproduction.n8ao.configuration,"distanceFalloff",c,{slider:!0,min:0,max:4,step:.1});if(_==="Directional Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const x=v.three.children.find(w=>w.uuid===h.Light);return x&&x instanceof _e?_t(x,"visible",c):c}if(_==="Ambient Light"&&h.Light&&typeof h.Light=="string"&&typeof c=="boolean"){const x=v.three.children.find(w=>w.uuid===h.Light);return x&&x instanceof _e?_t(x,"visible",c):c}if(_==="Position"&&h.Light&&typeof h.Light=="string"&&typeof c=="string"){const x=v.three.children.find(S=>S.uuid===h.Light);if(!(x&&x instanceof _e))return c;const{x:w,y:A,z:C}=JSON.parse(c),N=P(x.position,"x",w,{slider:!0,prefix:"X",suffix:"m",min:-50,max:50}),L=P(x.position,"y",A,{slider:!0,prefix:"Y",suffix:"m",min:-50,max:50}),k=P(x.position,"z",C,{slider:!0,prefix:"Z",suffix:"m",min:-50,max:50});return m`
            <div style="display: flex; gap: 0.25rem; width: 100%; flex-wrap: wrap">${N}${L}${k}</div>
          `}return _==="Custom Effects"&&h.IsCEConfig&&g instanceof R&&typeof c=="boolean"?Au(g,c):_==="Color"&&h.IsOutlineConfig&&g instanceof R&&typeof c=="string"?xu(g,c):_==="Tolerance"&&h.IsOutlineConfig&&g instanceof R&&typeof c=="number"?P(g.postproduction.customEffects,"tolerance",c,{slider:!0,min:0,max:6,step:.01}):_==="Outline"&&h.IsOutlineConfig&&g instanceof R&&typeof c=="boolean"?_t(g.postproduction.customEffects,"outlineEnabled",c):_==="Gloss"&&h.IsGlossConfig&&g instanceof R&&typeof c=="boolean"?_t(g.postproduction.customEffects,"glossEnabled",c):_==="Min"&&h.IsGlossConfig&&g instanceof R&&typeof c=="number"?P(g.postproduction.customEffects,"minGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):_==="Max"&&h.IsGlossConfig&&g instanceof R&&typeof c=="number"?P(g.postproduction.customEffects,"maxGloss",c,{slider:!0,min:-.5,max:.5,step:.01}):_==="Exponent"&&h.IsGlossConfig&&g instanceof R&&typeof c=="number"?P(g.postproduction.customEffects,"glossExponent",c,{slider:!0,min:0,max:5,step:.01}):_==="Gamma Correction"&&h.IsGammaConfig&&g instanceof R&&typeof c=="boolean"?Cu(g,c):c}};const u=[];for(const[,c]of i.list){const{scene:h,camera:p,renderer:b}=c,v=$e(t,c),y={data:{Name:c instanceof oa&&c.name||c.uuid},children:[]};if(h){const g={data:{Name:"Scene"}};if(v){const w=`#${v.material.uniforms.uColor.value.getHexString()}`,A=JSON.stringify({x:v.material.uniforms.uSize1.value,y:v.material.uniforms.uSize2.value}),C={data:{Name:"Grid",Value:v.three.visible,World:c.uuid,IsGridConfig:!0},children:[{data:{Name:"Color",Value:w,World:c.uuid,IsGridConfig:!0}},{data:{Name:"Size",Value:A,World:c.uuid,IsGridConfig:!0}},{data:{Name:"Distance",Value:v.material.uniforms.uDistance.value,World:c.uuid,IsGridConfig:!0}}]};g.children||(g.children=[]),g.children.push(C)}const _=h.three.children.filter(w=>w instanceof ca);for(const w of _){const A={data:{Name:"Directional Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Position",Value:JSON.stringify(w.position),World:c.uuid,Light:w.uuid}},{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};g.children||(g.children=[]),g.children.push(A)}const x=h.three.children.filter(w=>w instanceof da);for(const w of x){const A={data:{Name:"Ambient Light",Value:w.visible,World:c.uuid,Light:w.uuid},children:[{data:{Name:"Intensity",Value:w.intensity,World:c.uuid,Light:w.uuid}},{data:{Name:"Color",Value:`#${w.color.getHexString()}`,World:c.uuid,Light:w.uuid}}]};g.children||(g.children=[]),g.children.push(A)}g.children&&((o=g.children)==null?void 0:o.length)>0&&((s=y.children)==null||s.push(g))}if(p.three instanceof ni){const g={data:{Name:"Perspective Camera"},children:[{data:{Name:"Near Frustum",Value:p.three.near,World:c.uuid}},{data:{Name:"Far Frustum",Value:p.three.far,World:c.uuid}},{data:{Name:"Field of View",Value:p.three.fov,World:c.uuid}}]};if(p.hasCameraControls()){const{controls:_}=p,x={dollyDragInverted:"Invert Drag",dollySpeed:"Dolly Speed",truckSpeed:"Truck Speed",smoothTime:"Smooth Time"};for(const w in x){const A=_[w];A!=null&&((r=g.children)==null||r.push({data:{Name:x[w],Value:A,World:c.uuid}}))}}(a=y.children)==null||a.push(g)}if(b instanceof R){const{postproduction:g}=b,_=g.n8ao.configuration,x={data:{Name:"Renderer"},children:[{data:{Name:"Gamma Correction",Value:g.settings.gamma??!1,World:c.uuid,IsGammaConfig:!0}},{data:{Name:"Ambient Oclussion",Value:g.settings.ao??!1,World:c.uuid,IsAOConfig:!0},children:[{data:{Name:"Samples",Value:_.aoSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Color",Value:`#${_.color.getHexString()}`,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Half Resolution",Value:_.halfRes,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Screen Space Radius",Value:_.screenSpaceRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Radius",Value:_.aoRadius,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Intensity",Value:_.intensity,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Distance Falloff",Value:_.distanceFalloff,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Samples",Value:_.denoiseSamples,World:c.uuid,IsAOConfig:!0}},{data:{Name:"Denoise Radius",Value:_.denoiseRadius,World:c.uuid,IsAOConfig:!0}}]},{data:{Name:"Custom Effects",Value:g.settings.custom??!1,World:c.uuid,IsCEConfig:!0},children:[{data:{Name:"Gloss",Value:g.customEffects.glossEnabled,World:c.uuid,IsGlossConfig:!0},children:[{data:{Name:"Min",Value:g.customEffects.minGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Max",Value:g.customEffects.maxGloss,World:c.uuid,IsGlossConfig:!0}},{data:{Name:"Exponent",Value:g.customEffects.glossExponent,World:c.uuid,IsGlossConfig:!0}}]},{data:{Name:"Outline",Value:g.customEffects.outlineEnabled,World:c.uuid,IsOutlineConfig:!0},children:[{data:{Name:"Color",get Value(){const w=new ae(g.customEffects.lineColor),A=g.customEffects.opacity;return JSON.stringify({color:`#${w.getHexString()}`,opacity:A})},World:c.uuid,IsOutlineConfig:!0}},{data:{Name:"Tolerance",Value:g.customEffects.tolerance,World:c.uuid,IsOutlineConfig:!0}}]}]}]};(l=y.children)==null||l.push(x)}u.push(y)}d.columns=[{name:"Name",width:"11rem"}],d.hiddenColumns=["World","Light","IsAOConfig","IsCEConfig","IsGlossConfig","IsOutlineConfig","IsGammaConfig","IsGridConfig"],d.data=u})} headers-hidden expanded>
     <bim-label slot="missing-data" style="--bim-icon--c: gold" icon="ic:round-warning">
        No worlds to configure
      </bim-label>
    </bim-table>
  `},Su=(e,t=!0)=>{const i=V.create(Eu,e);if(t){const[,n]=i,{components:o}=e;o.get(Ni).list.onItemDeleted.add(()=>n())}return i},ku=Object.freeze(Object.defineProperty({__proto__:null,worldsConfiguration:Su},Symbol.toStringTag,{value:"Module"}));({...Wd,...Yd,...Qd,...pu,...vu,...ku,...Od,...Rd,...Id});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Si=globalThis,ki=Si.trustedTypes,Do=ki?ki.createPolicy("lit-html",{createHTML:e=>e}):void 0,Br="$lit$",wt=`lit$${Math.random().toFixed(9).slice(2)}$`,Hr="?"+wt,Tu=`<${Hr}>`,Bt=document,ze=()=>Bt.createComment(""),Fe=e=>e===null||typeof e!="object"&&typeof e!="function",Bn=Array.isArray,Ou=e=>Bn(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",on=`[ 	
\f\r]`,Ce=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,jo=/-->/g,zo=/>/g,Pt=RegExp(`>|${on}(?:([^\\s"'>=/]+)(${on}*=${on}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fo=/'/g,Bo=/"/g,Ur=/^(?:script|style|textarea|title)$/i,Nu=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),Hn=Nu(1),oe=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),Ho=new WeakMap,Lt=Bt.createTreeWalker(Bt,129);function Vr(e,t){if(!Bn(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Do!==void 0?Do.createHTML(t):t}const Iu=(e,t)=>{const i=e.length-1,n=[];let o,s=t===2?"<svg>":t===3?"<math>":"",r=Ce;for(let a=0;a<i;a++){const l=e[a];let d,u,c=-1,h=0;for(;h<l.length&&(r.lastIndex=h,u=r.exec(l),u!==null);)h=r.lastIndex,r===Ce?u[1]==="!--"?r=jo:u[1]!==void 0?r=zo:u[2]!==void 0?(Ur.test(u[2])&&(o=RegExp("</"+u[2],"g")),r=Pt):u[3]!==void 0&&(r=Pt):r===Pt?u[0]===">"?(r=o??Ce,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,d=u[1],r=u[3]===void 0?Pt:u[3]==='"'?Bo:Fo):r===Bo||r===Fo?r=Pt:r===jo||r===zo?r=Ce:(r=Pt,o=void 0);const p=r===Pt&&e[a+1].startsWith("/>")?" ":"";s+=r===Ce?l+Tu:c>=0?(n.push(d),l.slice(0,c)+Br+l.slice(c)+wt+p):l+wt+(c===-2?a:p)}return[Vr(e,s+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),n]};class Be{constructor({strings:t,_$litType$:i},n){let o;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[d,u]=Iu(t,i);if(this.el=Be.createElement(d,n),Lt.currentNode=this.el.content,i===2||i===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=Lt.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(Br)){const h=u[r++],p=o.getAttribute(c).split(wt),b=/([.?@])?(.*)/.exec(h);l.push({type:1,index:s,name:b[2],strings:p,ctor:b[1]==="."?Mu:b[1]==="?"?Lu:b[1]==="@"?Ru:Wi}),o.removeAttribute(c)}else c.startsWith(wt)&&(l.push({type:6,index:s}),o.removeAttribute(c));if(Ur.test(o.tagName)){const c=o.textContent.split(wt),h=c.length-1;if(h>0){o.textContent=ki?ki.emptyScript:"";for(let p=0;p<h;p++)o.append(c[p],ze()),Lt.nextNode(),l.push({type:2,index:++s});o.append(c[h],ze())}}}else if(o.nodeType===8)if(o.data===Hr)l.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(wt,c+1))!==-1;)l.push({type:7,index:s}),c+=wt.length-1}s++}}static createElement(t,i){const n=Bt.createElement("template");return n.innerHTML=t,n}}function se(e,t,i=e,n){var o,s;if(t===oe)return t;let r=n!==void 0?(o=i.o)==null?void 0:o[n]:i.l;const a=Fe(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==a&&((s=r==null?void 0:r._$AO)==null||s.call(r,!1),a===void 0?r=void 0:(r=new a(e),r._$AT(e,i,n)),n!==void 0?(i.o??(i.o=[]))[n]=r:i.l=r),r!==void 0&&(t=se(e,r._$AS(e,t.values),r,n)),t}class Pu{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:n}=this._$AD,o=((t==null?void 0:t.creationScope)??Bt).importNode(i,!0);Lt.currentNode=o;let s=Lt.nextNode(),r=0,a=0,l=n[0];for(;l!==void 0;){if(r===l.index){let d;l.type===2?d=new ti(s,s.nextSibling,this,t):l.type===1?d=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(d=new Du(s,this,t)),this._$AV.push(d),l=n[++a]}r!==(l==null?void 0:l.index)&&(s=Lt.nextNode(),r++)}return Lt.currentNode=Bt,o}p(t){let i=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,i),i+=n.strings.length-2):n._$AI(t[i])),i++}}class ti{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,i,n,o){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=n,this.options=o,this.v=(o==null?void 0:o.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=se(this,t,i),Fe(t)?t===j||t==null||t===""?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==oe&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ou(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&Fe(this._$AH)?this._$AA.nextSibling.data=t:this.T(Bt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:n,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Be.createElement(Vr(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(n);else{const r=new Pu(s,this),a=r.u(this.options);r.p(n),this.T(a),this._$AH=r}}_$AC(t){let i=Ho.get(t.strings);return i===void 0&&Ho.set(t.strings,i=new Be(t)),i}k(t){Bn(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let n,o=0;for(const s of t)o===i.length?i.push(n=new ti(this.O(ze()),this.O(ze()),this,this.options)):n=i[o],n._$AI(s),o++;o<i.length&&(this._$AR(n&&n._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,i);t&&t!==this._$AB;){const o=t.nextSibling;t.remove(),t=o}}setConnected(t){var i;this._$AM===void 0&&(this.v=t,(i=this._$AP)==null||i.call(this,t))}}class Wi{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,n,o,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=j}_$AI(t,i=this,n,o){const s=this.strings;let r=!1;if(s===void 0)t=se(this,t,i,0),r=!Fe(t)||t!==this._$AH&&t!==oe,r&&(this._$AH=t);else{const a=t;let l,d;for(t=s[0],l=0;l<s.length-1;l++)d=se(this,a[n+l],i,l),d===oe&&(d=this._$AH[l]),r||(r=!Fe(d)||d!==this._$AH[l]),d===j?t=j:t!==j&&(t+=(d??"")+s[l+1]),this._$AH[l]=d}r&&!o&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mu extends Wi{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class Lu extends Wi{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class Ru extends Wi{constructor(t,i,n,o,s){super(t,i,n,o,s),this.type=5}_$AI(t,i=this){if((t=se(this,t,i,0)??j)===oe)return;const n=this._$AH,o=t===j&&n!==j||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,s=t!==j&&(n===j||o);o&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,t):this._$AH.handleEvent(t)}}class Du{constructor(t,i,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){se(this,t)}}const Uo=Si.litHtmlPolyfillSupport;Uo==null||Uo(Be,ti),(Si.litHtmlVersions??(Si.litHtmlVersions=[])).push("3.2.0");const ju=(e,t,i)=>{const n=(i==null?void 0:i.renderBefore)??t;let o=n._$litPart$;if(o===void 0){const s=(i==null?void 0:i.renderBefore)??null;n._$litPart$=o=new ti(t.insertBefore(ze(),s),s,void 0,i??{})}return o._$AI(e),o};/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zu=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fu={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Bu=e=>(...t)=>({_$litDirective$:e,values:t});let Hu=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this.t=e,this._$AM=t,this.i=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oe=(e,t)=>{var i;const n=e._$AN;if(n===void 0)return!1;for(const o of n)(i=o._$AO)==null||i.call(o,t,!1),Oe(o,t);return!0},Ti=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},Wr=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Wu(t)}};function Uu(e){this._$AN!==void 0?(Ti(this),this._$AM=e,Wr(this)):this._$AM=e}function Vu(e,t=!1,i=0){const n=this._$AH,o=this._$AN;if(o!==void 0&&o.size!==0)if(t)if(Array.isArray(n))for(let s=i;s<n.length;s++)Oe(n[s],!1),Ti(n[s]);else n!=null&&(Oe(n,!1),Ti(n));else Oe(this,e)}const Wu=e=>{e.type==Fu.CHILD&&(e._$AP??(e._$AP=Vu),e._$AQ??(e._$AQ=Uu))};class Gu extends Hu{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,n){super._$AT(t,i,n),Wr(this),this.isConnected=t._$AU}_$AO(t,i=!0){var n,o;t!==this.isConnected&&(this.isConnected=t,t?(n=this.reconnected)==null||n.call(this):(o=this.disconnected)==null||o.call(this)),i&&(Oe(this,t),Ti(this))}setValue(t){if(zu(this.t))this.t._$AI(t,this);else{const i=[...this.t._$AH];i[this.i]=t,this.t._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wn=()=>new qu;class qu{}const sn=new WeakMap,Yu=Bu(class extends Gu{render(e){return j}update(e,[t]){var i;const n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=(i=e.options)==null?void 0:i.host,this.rt(this.ct=e.element)),j}rt(e){if(this.isConnected||(e=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let i=sn.get(t);i===void 0&&(i=new WeakMap,sn.set(t,i)),i.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),i.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){var e,t;return typeof this.Y=="function"?(e=sn.get(this.ht??globalThis))==null?void 0:e.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Xu=e=>{const{components:t,topic:i,value:n,onCancel:o,onSubmit:s,styles:r}=e,a=s??(()=>{}),l=t.get(He),d=(n==null?void 0:n.title)??(i==null?void 0:i.title)??vt.default.title,u=(n==null?void 0:n.status)??(i==null?void 0:i.status)??vt.default.status,c=(n==null?void 0:n.type)??(i==null?void 0:i.type)??vt.default.type,h=(n==null?void 0:n.priority)??(i==null?void 0:i.priority)??vt.default.priority,p=(n==null?void 0:n.assignedTo)??(i==null?void 0:i.assignedTo)??vt.default.assignedTo,b=(n==null?void 0:n.labels)??(i==null?void 0:i.labels)??vt.default.labels,v=(n==null?void 0:n.stage)??(i==null?void 0:i.stage)??vt.default.stage,y=(n==null?void 0:n.description)??(i==null?void 0:i.description)??vt.default.description,g=i!=null&&i.dueDate?i.dueDate.toISOString().split("T")[0]:null,_=new Set([...l.config.statuses]);u&&_.add(u);const x=new Set([...l.config.types]);c&&x.add(c);const w=new Set([...l.config.priorities]);h&&w.add(h);const A=new Set([...l.config.users]);p&&A.add(p);const C=new Set([...l.config.labels]);if(b)for(const E of b)C.add(E);const N=new Set([...l.config.stages]);v&&N.add(v);const L=wn(),k=async()=>{const{value:E}=L;if(!E)return;Object.values(E.valueTransform).length===0&&(E.valueTransform={dueDate:$=>{if(typeof $=="string"&&$.trim()!=="")return new Date($)},status:$=>{if(Array.isArray($)&&$.length!==0)return $[0]},type:$=>{if(Array.isArray($)&&$.length!==0)return $[0]},priority:$=>{if(Array.isArray($)&&$.length!==0)return $[0]},assignedTo:$=>{if(Array.isArray($)&&$.length!==0)return $[0]}});const M=E.value;if(i)i.set(M),await a(i);else{const $=l.create(M);await a($)}},S=wn(),H=E=>{const{value:M}=S;if(!M)return;const $=E.target;M.disabled=$.value.trim()===""};return m`
    <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 22rem;">
      <bim-panel-section ${W(L)} fixed label="New Topic" name="topic">
        <div style="display: flex; gap: 0.375rem">
          <bim-text-input @input=${H} vertical label="Title" name="title" .value=${d}></bim-text-input>
          ${i?m`
              <bim-dropdown vertical label="Status" name="status" required>
                ${[..._].map(E=>m`<bim-option label=${E} .checked=${u===E}></bim-option>`)}
              </bim-dropdown>`:m``}
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-dropdown vertical label="Type" name="type" required>
            ${[...x].map(E=>m`<bim-option label=${E} .checked=${c===E}></bim-option>`)}
          </bim-dropdown>
          <bim-dropdown vertical label="Priority" name="priority">
            ${[...w].map(E=>m`<bim-option label=${E} .checked=${h===E}></bim-option>`)}
          </bim-dropdown>
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-dropdown vertical label="Labels" name="labels" multiple>
            ${[...C].map(E=>m`<bim-option label=${E} .checked=${b?[...b].includes(E):!1}></bim-option>`)}
          </bim-dropdown>
          <bim-dropdown vertical label="Assignee" name="assignedTo">
            ${[...A].map(E=>{const M=r!=null&&r.users?r.users[E]:null,$=M?M.name:E,et=M==null?void 0:M.picture;return m`<bim-option label=${$} value=${E} .img=${et} .checked=${p===E}></bim-option>`})}
          </bim-dropdown>
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-text-input vertical type="date" label="Due Date" name="dueDate" .value=${g}></bim-text-input> 
          <bim-dropdown vertical label="Stage" name="stage">
            ${[...N].map(E=>m`<bim-option label=${E} .checked=${v===E}></bim-option>`)}
          </bim-dropdown>
        </div>
        <bim-text-input vertical label="Description" name="description" type="area" .value=${y??null}></bim-text-input>
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
          <bim-button @click=${o} style="flex: 0" id="A7T9K" label="Cancel"></bim-button>
          <bim-button ${W(S)} @click=${k} style="flex: 0" id="W3F2J" label=${i?"Update Topic":"Add Topic"} icon=${i?"tabler:refresh":"mi:add"}></bim-button>
        </div>
      </bim-panel-section>
    </bim-panel>
  `},Ju=e=>V.create(Xu,e),Qu=Object.freeze(Object.defineProperty({__proto__:null,createTopic:Ju},Symbol.toStringTag,{value:"Module"}));({...Qu});/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hi=globalThis,Un=hi.ShadowRoot&&(hi.ShadyCSS===void 0||hi.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Vn=Symbol(),Vo=new WeakMap;let Gr=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Vn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Un&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Vo.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Vo.set(t,e))}return e}toString(){return this.cssText}};const Ku=e=>new Gr(typeof e=="string"?e:e+"",void 0,Vn),Wn=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((n,o,s)=>n+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[s+1],e[0]);return new Gr(i,e,Vn)},Zu=(e,t)=>{if(Un)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const n=document.createElement("style"),o=hi.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=i.cssText,e.appendChild(n)}},Wo=Un?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const n of t.cssRules)i+=n.cssText;return Ku(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:th,defineProperty:eh,getOwnPropertyDescriptor:ih,getOwnPropertyNames:nh,getOwnPropertySymbols:oh,getPrototypeOf:sh}=Object,re=globalThis,Go=re.trustedTypes,rh=Go?Go.emptyScript:"",qo=re.reactiveElementPolyfillSupport,Ne=(e,t)=>e,Oi={toAttribute(e,t){switch(t){case Boolean:e=e?rh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},Gn=(e,t)=>!th(e,t),Yo={attribute:!0,type:String,converter:Oi,reflect:!1,hasChanged:Gn};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),re.litPropertyMetadata??(re.litPropertyMetadata=new WeakMap);class Yt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Yo){if(i.state&&(i.attribute=!1),this._$Ei(),this.elementProperties.set(t,i),!i.noAccessor){const n=Symbol(),o=this.getPropertyDescriptor(t,n,i);o!==void 0&&eh(this.prototype,t,o)}}static getPropertyDescriptor(t,i,n){const{get:o,set:s}=ih(this.prototype,t)??{get(){return this[i]},set(r){this[i]=r}};return{get(){return o==null?void 0:o.call(this)},set(r){const a=o==null?void 0:o.call(this);s.call(this,r),this.requestUpdate(t,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Yo}static _$Ei(){if(this.hasOwnProperty(Ne("elementProperties")))return;const t=sh(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ne("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ne("properties"))){const i=this.properties,n=[...nh(i),...oh(i)];for(const o of n)this.createProperty(o,i[o])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[n,o]of i)this.elementProperties.set(n,o)}this._$Eh=new Map;for(const[i,n]of this.elementProperties){const o=this._$Eu(i,n);o!==void 0&&this._$Eh.set(o,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const o of n)i.unshift(Wo(o))}else t!==void 0&&i.push(Wo(t));return i}static _$Eu(t,i){const n=i.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(i=>i(this))}addController(t){var i;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)==null||i.call(t))}removeController(t){var i;(i=this._$EO)==null||i.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const n of i.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zu(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostConnected)==null?void 0:n.call(i)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostDisconnected)==null?void 0:n.call(i)})}attributeChangedCallback(t,i,n){this._$AK(t,n)}_$EC(t,i){var n;const o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){const r=(((n=o.converter)==null?void 0:n.toAttribute)!==void 0?o.converter:Oi).toAttribute(i,o.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,i){var n;const o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const r=o.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:((n=r.converter)==null?void 0:n.fromAttribute)!==void 0?r.converter:Oi;this._$Em=s,this[s]=a.fromAttribute(i,r.type),this._$Em=null}}requestUpdate(t,i,n){if(t!==void 0){if(n??(n=this.constructor.getPropertyOptions(t)),!(n.hasChanged??Gn)(this[t],i))return;this.P(t,i,n)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,i,n){this._$AL.has(t)||this._$AL.set(t,i),n.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[s,r]of o)r.wrapped!==!0||this._$AL.has(s)||this[s]===void 0||this.P(s,this[s],r)}let i=!1;const n=this._$AL;try{i=this.shouldUpdate(n),i?(this.willUpdate(n),(t=this._$EO)==null||t.forEach(o=>{var s;return(s=o.hostUpdate)==null?void 0:s.call(o)}),this.update(n)):this._$EU()}catch(o){throw i=!1,this._$EU(),o}i&&this._$AE(n)}willUpdate(t){}_$AE(t){var i;(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdated)==null?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(i=>this._$EC(i,this[i]))),this._$EU()}updated(t){}firstUpdated(t){}}Yt.elementStyles=[],Yt.shadowRootOptions={mode:"open"},Yt[Ne("elementProperties")]=new Map,Yt[Ne("finalized")]=new Map,qo==null||qo({ReactiveElement:Yt}),(re.reactiveElementVersions??(re.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Dt extends Yt{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const i=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=ju(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return oe}}var Xo;Dt._$litElement$=!0,Dt.finalized=!0,(Xo=globalThis.litElementHydrateSupport)==null||Xo.call(globalThis,{LitElement:Dt});const Jo=globalThis.litElementPolyfillSupport;Jo==null||Jo({LitElement:Dt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ah={attribute:!0,type:String,converter:Oi,reflect:!1,hasChanged:Gn},lh=(e=ah,t,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(s===void 0&&globalThis.litPropertyMetadata.set(o,s=new Map),s.set(i.name,e),n==="accessor"){const{name:r}=i;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(r,l,e)},init(a){return a!==void 0&&this.P(r,void 0,e),a}}}if(n==="setter"){const{name:r}=i;return function(a){const l=this[r];t.call(this,a),this.requestUpdate(r,l,e)}}throw Error("Unsupported decorator location: "+n)};function G(e){return(t,i)=>typeof i=="object"?lh(e,t,i):((n,o,s)=>{const r=o.hasOwnProperty(s);return o.constructor.createProperty(s,r?{...n,wrapped:!0}:n),r?Object.getOwnPropertyDescriptor(o,s):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ch(e){return G({...e,state:!0,attribute:!1})}class dh extends ua{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ha(.5,.5),this.addEventListener("removed",function(){this.traverse(function(i){i.element instanceof Element&&i.element.parentNode!==null&&i.element.parentNode.removeChild(i.element)})})}copy(t,i){return super.copy(t,i),this.element=t.element.cloneNode(!0),this.center=t.center,this}}new Cn;new Ii;new Ii;new Cn;new Cn;class uh{constructor(t,i){this._group=new qn,this._frustum=new sa,this._frustumMat=new Ii,this._regenerateDelay=200,this._regenerateCounter=0,this.material=new ra({color:"#2e3338"}),this.numbers=new qn,this.maxRegenerateRetrys=4,this.gridsFactor=5,this._scaleX=1,this._scaleY=1,this._offsetX=0,this._offsetY=0,this._camera=t,this._container=i;const n=this.newGrid(-1),o=this.newGrid(-2);this.grids={main:n,secondary:o},this._group.add(o,n,this.numbers)}set scaleX(t){this._scaleX=t,this.regenerate()}get scaleX(){return this._scaleX}set scaleY(t){this._scaleY=t,this.regenerate()}get scaleY(){return this._scaleY}set offsetX(t){this._offsetX=t,this.regenerate()}get offsetX(){return this._offsetX}set offsetY(t){this._offsetY=t,this.regenerate()}get offsetY(){return this._offsetY}get(){return this._group}dispose(){const{main:t,secondary:i}=this.grids;t.removeFromParent(),i.removeFromParent(),t.geometry.dispose(),t.material.dispose(),i.geometry.dispose(),i.material.dispose()}regenerate(){if(!this.isGridReady()){if(this._regenerateCounter++,this._regenerateCounter>this.maxRegenerateRetrys)throw new Error("Grid could not be regenerated");setTimeout(()=>this.regenerate,this._regenerateDelay);return}this._regenerateCounter=0,this._camera.updateMatrix(),this._camera.updateMatrixWorld();const t=this._frustumMat.multiplyMatrices(this._camera.projectionMatrix,this._camera.matrixWorldInverse);this._frustum.setFromProjectionMatrix(t);const{planes:i}=this._frustum,n=i[0].constant*-i[0].normal.x,o=i[1].constant*-i[1].normal.x,s=i[2].constant*-i[2].normal.y,r=i[3].constant*-i[3].normal.y,a=Math.abs(n-o),l=Math.abs(r-s),{clientWidth:d,clientHeight:u}=this._container,c=Math.max(d,u),h=Math.max(a,l)/c,p=Math.ceil(Math.log10(a/this.scaleX)),b=Math.ceil(Math.log10(l/this.scaleY)),v=10**(p-2)*this.scaleX,y=10**(b-2)*this.scaleY,g=v*this.gridsFactor,_=y*this.gridsFactor,x=Math.ceil(l/_),w=Math.ceil(a/g),A=Math.ceil(l/y),C=Math.ceil(a/v),N=v*Math.ceil(o/v),L=y*Math.ceil(s/y),k=g*Math.ceil(o/g),S=_*Math.ceil(s/_),H=[...this.numbers.children];for(const U of H)U.removeFromParent();this.numbers.children=[];const E=[],M=9*h,$=1e4,et=k+this._offsetX,ot=Math.round(Math.abs(et/this.scaleX)*$)/$,st=(w-1)*g,X=Math.round(Math.abs((et+st)/this.scaleX)*$)/$,rt=Math.max(ot,X).toString().length*M;let ve=Math.ceil(rt/g)*g;for(let U=0;U<w;U++){let z=k+U*g;E.push(z,r,0,z,s,0),z=Math.round(z*$)/$,ve=Math.round(ve*$)/$;const ye=z%ve;if(!(g<1||_<1)&&Math.abs(ye)>.01)continue;const ii=this.newNumber((z+this._offsetX)/this.scaleX),qi=12*h;ii.position.set(z,s+qi,0)}for(let U=0;U<x;U++){const z=S+U*_;E.push(o,z,0,n,z,0);const ye=this.newNumber(z/this.scaleY);let ii=12;ye.element.textContent&&(ii+=4*ye.element.textContent.length);const qi=ii*h;ye.position.set(o+qi,z,0)}const Gi=[];for(let U=0;U<C;U++){const z=N+U*v;Gi.push(z,r,0,z,s,0)}for(let U=0;U<A;U++){const z=L+U*y;Gi.push(o,z,0,n,z,0)}const Qr=new Yn(new Float32Array(E),3),Kr=new Yn(new Float32Array(Gi),3),{main:Zr,secondary:ta}=this.grids;Zr.geometry.setAttribute("position",Qr),ta.geometry.setAttribute("position",Kr)}newNumber(t){const i=document.createElement("bim-label");i.textContent=String(Math.round(t*100)/100);const n=new dh(i);return this.numbers.add(n),n}newGrid(t){const i=new aa,n=new la(i,this.material);return n.frustumCulled=!1,n.renderOrder=t,n}isGridReady(){const t=this._camera.projectionMatrix.elements;for(let i=0;i<t.length;i++){const n=t[i];if(Number.isNaN(n))return!1}return!0}}var hh=Object.defineProperty,ph=Object.getOwnPropertyDescriptor,ei=(e,t,i,n)=>{for(var o=ph(t,i),s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&hh(t,i,o),o};const qr=class extends Dt{constructor(){super(...arguments),this._grid=null,this._world=null,this.resize=()=>{this._world&&this._grid&&this._grid.regenerate()}}set gridColor(t){if(this._gridColor=t,!(t&&this._grid))return;const i=Number(t.replace("#","0x"));Number.isNaN(i)||this._grid.material.color.setHex(i)}get gridColor(){return this._gridColor}set gridScaleX(t){this._gridScaleX=t,t&&this._grid&&(this._grid.scaleX=t)}get gridScaleX(){return this._gridScaleX}set gridScaleY(t){this._gridScaleY=t,t&&this._grid&&(this._grid.scaleY=t)}get gridScaleY(){return this._gridScaleY}get gridOffsetX(){var t;return((t=this._grid)==null?void 0:t.offsetX)||0}set gridOffsetX(t){this._grid&&(this._grid.offsetX=t)}get gridOffsetY(){var t;return((t=this._grid)==null?void 0:t.offsetY)||0}set gridOffsetY(t){this._grid&&(this._grid.offsetY=t)}set components(t){this.dispose();const i=t.get(Ni).create();this._world=i,i.scene=new Qo(t),i.scene.setup(),i.renderer=new _a(t,this);const n=new Ko(t);i.camera=n;const o=new uh(n.threeOrtho,this);this._grid=o,i.scene.three.add(o.get()),n.controls.addEventListener("update",()=>o.regenerate()),setTimeout(async()=>{i.camera.updateAspect(),n.set("Plan"),await n.controls.setLookAt(0,0,100,0,0,0),await n.projection.set("Orthographic"),n.controls.dollySpeed=3,n.controls.draggingSmoothTime=.085,n.controls.maxZoom=1e3,n.controls.zoom(4)})}get world(){return this._world}dispose(){var t;(t=this.world)==null||t.dispose(),this._world=null,this._grid=null}connectedCallback(){super.connectedCallback(),new ResizeObserver(this.resize).observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.dispose()}render(){return Hn`<slot></slot>`}};qr.styles=Wn`
    :host {
      position: relative;
      display: flex;
      min-width: 0px;
      height: 100%;
      background-color: var(--bim-ui_bg-base);
    }
  `;let ge=qr;ei([G({type:String,attribute:"grid-color",reflect:!0})],ge.prototype,"gridColor");ei([G({type:Number,attribute:"grid-scale-x",reflect:!0})],ge.prototype,"gridScaleX");ei([G({type:Number,attribute:"grid-scale-y",reflect:!0})],ge.prototype,"gridScaleY");ei([G({type:Number,attribute:"grid-offset-x",reflect:!0})],ge.prototype,"gridOffsetX");ei([G({type:Number,attribute:"grid-offset-y",reflect:!0})],ge.prototype,"gridOffsetY");var mh=Object.defineProperty,Ot=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&mh(t,i,o),o};const Yr=class extends Dt{constructor(){super(...arguments),this._defaults={size:60},this._cssMatrix3D="",this._matrix=new Ii,this._onRightClick=new Event("rightclick"),this._onLeftClick=new Event("leftclick"),this._onTopClick=new Event("topclick"),this._onBottomClick=new Event("bottomclick"),this._onFrontClick=new Event("frontclick"),this._onBackClick=new Event("backclick"),this._camera=null,this._epsilon=t=>Math.abs(t)<1e-10?0:t}set camera(t){this._camera=t,this.updateOrientation()}get camera(){return this._camera}updateOrientation(){if(!this.camera)return;this._matrix.extractRotation(this.camera.matrixWorldInverse);const{elements:t}=this._matrix;this._cssMatrix3D=`matrix3d(
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
    `}render(){const t=this.size??this._defaults.size;return Hn`
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
    `}};Yr.styles=Wn`
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
  `;let gt=Yr;Ot([G({type:Number,reflect:!0})],gt.prototype,"size");Ot([G({type:String,attribute:"right-text",reflect:!0})],gt.prototype,"rightText");Ot([G({type:String,attribute:"left-text",reflect:!0})],gt.prototype,"leftText");Ot([G({type:String,attribute:"top-text",reflect:!0})],gt.prototype,"topText");Ot([G({type:String,attribute:"bottom-text",reflect:!0})],gt.prototype,"bottomText");Ot([G({type:String,attribute:"front-text",reflect:!0})],gt.prototype,"frontText");Ot([G({type:String,attribute:"back-text",reflect:!0})],gt.prototype,"backText");Ot([ch()],gt.prototype,"_cssMatrix3D");var bh=Object.defineProperty,fh=(e,t,i,n)=>{for(var o=void 0,s=e.length-1,r;s>=0;s--)(r=e[s])&&(o=r(t,i,o)||o);return o&&bh(t,i,o),o};const Xr=class extends Dt{constructor(){super(...arguments),this.world=null,this._components=null,this._viewport=wn()}set components(t){var i;if(this._components=t,this.components){const n=this.components.get(Ni);this.world=n.create(),this.world.name=this.name}else(i=this.world)==null||i.dispose(),this.world=null}get components(){return this._components}connectedCallback(){super.connectedCallback(),this.world&&(this.world.enabled=!0)}disconnectedCallback(){super.disconnectedCallback(),this.world&&(this.world.enabled=!1)}firstUpdated(){const{value:t}=this._viewport;if(!(this.components&&t&&this.world))return;const i=new Qo(this.components);this.world.scene=i,i.setup(),i.three.background=null;const n=new R(this.components,t);this.world.renderer=n;const{postproduction:o}=n,s=new Ko(this.components);this.world.camera=s;const r=this.components.get(Zo).create(this.world);r.material.uniforms.uColor.value=new ae(4342338),r.material.uniforms.uSize1.value=2,r.material.uniforms.uSize2.value=8,o.enabled=!0,o.customEffects.excludedMeshes.push(r.three),o.setPasses({custom:!0,ao:!0,gamma:!0}),o.customEffects.lineColor=1513756}render(){return Hn`<bim-viewport ${Yu(this._viewport)}
      ><slot></slot
    ></bim-viewport>`}};Xr.styles=Wn``;let Jr=Xr;fh([G({type:String,reflect:!0})],Jr.prototype,"name");class $h{static init(){Te.defineCustomElement("bim-view-cube",gt),Te.defineCustomElement("bim-world-2d",ge),Te.defineCustomElement("bim-world",Jr)}}export{$h as v};
