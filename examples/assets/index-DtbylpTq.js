var Ho=Object.defineProperty,Io=(i,t,e)=>t in i?Ho(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,ht=(i,t,e)=>(Io(i,typeof t!="symbol"?t+"":t,e),e);const Ct=Math.min,Q=Math.max,ve=Math.round,nt=i=>({x:i,y:i}),No={left:"right",right:"left",bottom:"top",top:"bottom"},Fo={start:"end",end:"start"};function wi(i,t,e){return Q(i,Ct(t,e))}function ne(i,t){return typeof i=="function"?i(t):i}function J(i){return i.split("-")[0]}function Ae(i){return i.split("-")[1]}function cn(i){return i==="x"?"y":"x"}function hn(i){return i==="y"?"height":"width"}function bt(i){return["top","bottom"].includes(J(i))?"y":"x"}function dn(i){return cn(bt(i))}function Do(i,t,e){e===void 0&&(e=!1);const o=Ae(i),n=dn(i),r=hn(n);let s=n==="x"?o===(e?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[r]>t.floating[r]&&(s=ye(s)),[s,ye(s)]}function Uo(i){const t=ye(i);return[We(i),t,We(t)]}function We(i){return i.replace(/start|end/g,t=>Fo[t])}function Vo(i,t,e){const o=["left","right"],n=["right","left"],r=["top","bottom"],s=["bottom","top"];switch(i){case"top":case"bottom":return e?t?n:o:t?o:n;case"left":case"right":return t?r:s;default:return[]}}function qo(i,t,e,o){const n=Ae(i);let r=Vo(J(i),e==="start",o);return n&&(r=r.map(s=>s+"-"+n),t&&(r=r.concat(r.map(We)))),r}function ye(i){return i.replace(/left|right|bottom|top/g,t=>No[t])}function Wo(i){return{top:0,right:0,bottom:0,left:0,...i}}function un(i){return typeof i!="number"?Wo(i):{top:i,right:i,bottom:i,left:i}}function kt(i){const{x:t,y:e,width:o,height:n}=i;return{width:o,height:n,top:e,left:t,right:t+o,bottom:e+n,x:t,y:e}}function $i(i,t,e){let{reference:o,floating:n}=i;const r=bt(t),s=dn(t),l=hn(s),a=J(t),c=r==="y",d=o.x+o.width/2-n.width/2,u=o.y+o.height/2-n.height/2,p=o[l]/2-n[l]/2;let b;switch(a){case"top":b={x:d,y:o.y-n.height};break;case"bottom":b={x:d,y:o.y+o.height};break;case"right":b={x:o.x+o.width,y:u};break;case"left":b={x:o.x-n.width,y:u};break;default:b={x:o.x,y:o.y}}switch(Ae(t)){case"start":b[s]-=p*(e&&c?-1:1);break;case"end":b[s]+=p*(e&&c?-1:1);break}return b}const Yo=async(i,t,e)=>{const{placement:o="bottom",strategy:n="absolute",middleware:r=[],platform:s}=e,l=r.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(t));let c=await s.getElementRects({reference:i,floating:t,strategy:n}),{x:d,y:u}=$i(c,o,a),p=o,b={},m=0;for(let v=0;v<l.length;v++){const{name:g,fn:S}=l[v],{x:C,y:x,data:$,reset:z}=await S({x:d,y:u,initialPlacement:o,placement:p,strategy:n,middlewareData:b,rects:c,platform:s,elements:{reference:i,floating:t}});d=C??d,u=x??u,b={...b,[g]:{...b[g],...$}},z&&m<=50&&(m++,typeof z=="object"&&(z.placement&&(p=z.placement),z.rects&&(c=z.rects===!0?await s.getElementRects({reference:i,floating:t,strategy:n}):z.rects),{x:d,y:u}=$i(c,p,a)),v=-1)}return{x:d,y:u,placement:p,strategy:n,middlewareData:b}};async function pn(i,t){var e;t===void 0&&(t={});const{x:o,y:n,platform:r,rects:s,elements:l,strategy:a}=i,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:p=!1,padding:b=0}=ne(t,i),m=un(b),v=l[p?u==="floating"?"reference":"floating":u],g=kt(await r.getClippingRect({element:(e=await(r.isElement==null?void 0:r.isElement(v)))==null||e?v:v.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:d,strategy:a})),S=u==="floating"?{x:o,y:n,width:s.floating.width,height:s.floating.height}:s.reference,C=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),x=await(r.isElement==null?void 0:r.isElement(C))?await(r.getScale==null?void 0:r.getScale(C))||{x:1,y:1}:{x:1,y:1},$=kt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:S,offsetParent:C,strategy:a}):S);return{top:(g.top-$.top+m.top)/x.y,bottom:($.bottom-g.bottom+m.bottom)/x.y,left:(g.left-$.left+m.left)/x.x,right:($.right-g.right+m.right)/x.x}}const Go=function(i){return i===void 0&&(i={}),{name:"flip",options:i,async fn(t){var e,o;const{placement:n,middlewareData:r,rects:s,initialPlacement:l,platform:a,elements:c}=t,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:p,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...g}=ne(i,t);if((e=r.arrow)!=null&&e.alignmentOffset)return{};const S=J(n),C=bt(l),x=J(l)===l,$=await(a.isRTL==null?void 0:a.isRTL(c.floating)),z=p||(x||!v?[ye(l)]:Uo(l)),y=m!=="none";!p&&y&&z.push(...qo(l,v,m,$));const j=[l,...z],N=await pn(t,g),F=[];let k=((o=r.flip)==null?void 0:o.overflows)||[];if(d&&F.push(N[S]),u){const V=Do(n,s,$);F.push(N[V[0]],N[V[1]])}if(k=[...k,{placement:n,overflows:F}],!F.every(V=>V<=0)){var _t,Ut;const V=(((_t=r.flip)==null?void 0:_t.index)||0)+1,wt=j[V];if(wt)return{data:{index:V,overflows:k},reset:{placement:wt}};let Z=(Ut=k.filter(tt=>tt.overflows[0]<=0).sort((tt,q)=>tt.overflows[1]-q.overflows[1])[0])==null?void 0:Ut.placement;if(!Z)switch(b){case"bestFit":{var xt;const tt=(xt=k.filter(q=>{if(y){const et=bt(q.placement);return et===C||et==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(et=>et>0).reduce((et,Bo)=>et+Bo,0)]).sort((q,et)=>q[1]-et[1])[0])==null?void 0:xt[0];tt&&(Z=tt);break}case"initialPlacement":Z=l;break}if(n!==Z)return{reset:{placement:Z}}}return{}}}};function bn(i){const t=Ct(...i.map(r=>r.left)),e=Ct(...i.map(r=>r.top)),o=Q(...i.map(r=>r.right)),n=Q(...i.map(r=>r.bottom));return{x:t,y:e,width:o-t,height:n-e}}function Qo(i){const t=i.slice().sort((n,r)=>n.y-r.y),e=[];let o=null;for(let n=0;n<t.length;n++){const r=t[n];!o||r.y-o.y>o.height/2?e.push([r]):e[e.length-1].push(r),o=r}return e.map(n=>kt(bn(n)))}const Jo=function(i){return i===void 0&&(i={}),{name:"inline",options:i,async fn(t){const{placement:e,elements:o,rects:n,platform:r,strategy:s}=t,{padding:l=2,x:a,y:c}=ne(i,t),d=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(o.reference))||[]),u=Qo(d),p=kt(bn(d)),b=un(l);function m(){if(u.length===2&&u[0].left>u[1].right&&a!=null&&c!=null)return u.find(g=>a>g.left-b.left&&a<g.right+b.right&&c>g.top-b.top&&c<g.bottom+b.bottom)||p;if(u.length>=2){if(bt(e)==="y"){const k=u[0],_t=u[u.length-1],Ut=J(e)==="top",xt=k.top,V=_t.bottom,wt=Ut?k.left:_t.left,Z=Ut?k.right:_t.right,tt=Z-wt,q=V-xt;return{top:xt,bottom:V,left:wt,right:Z,width:tt,height:q,x:wt,y:xt}}const g=J(e)==="left",S=Q(...u.map(k=>k.right)),C=Ct(...u.map(k=>k.left)),x=u.filter(k=>g?k.left===C:k.right===S),$=x[0].top,z=x[x.length-1].bottom,y=C,j=S,N=j-y,F=z-$;return{top:$,bottom:z,left:y,right:j,width:N,height:F,x:y,y:$}}return p}const v=await r.getElementRects({reference:{getBoundingClientRect:m},floating:o.floating,strategy:s});return n.reference.x!==v.reference.x||n.reference.y!==v.reference.y||n.reference.width!==v.reference.width||n.reference.height!==v.reference.height?{reset:{rects:v}}:{}}}};async function Xo(i,t){const{placement:e,platform:o,elements:n}=i,r=await(o.isRTL==null?void 0:o.isRTL(n.floating)),s=J(e),l=Ae(e),a=bt(e)==="y",c=["left","top"].includes(s)?-1:1,d=r&&a?-1:1,u=ne(t,i);let{mainAxis:p,crossAxis:b,alignmentAxis:m}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return l&&typeof m=="number"&&(b=l==="end"?m*-1:m),a?{x:b*d,y:p*c}:{x:p*c,y:b*d}}const fn=function(i){return{name:"offset",options:i,async fn(t){var e,o;const{x:n,y:r,placement:s,middlewareData:l}=t,a=await Xo(t,i);return s===((e=l.offset)==null?void 0:e.placement)&&(o=l.arrow)!=null&&o.alignmentOffset?{}:{x:n+a.x,y:r+a.y,data:{...a,placement:s}}}}},Ko=function(i){return i===void 0&&(i={}),{name:"shift",options:i,async fn(t){const{x:e,y:o,placement:n}=t,{mainAxis:r=!0,crossAxis:s=!1,limiter:l={fn:g=>{let{x:S,y:C}=g;return{x:S,y:C}}},...a}=ne(i,t),c={x:e,y:o},d=await pn(t,a),u=bt(J(n)),p=cn(u);let b=c[p],m=c[u];if(r){const g=p==="y"?"top":"left",S=p==="y"?"bottom":"right",C=b+d[g],x=b-d[S];b=wi(C,b,x)}if(s){const g=u==="y"?"top":"left",S=u==="y"?"bottom":"right",C=m+d[g],x=m-d[S];m=wi(C,m,x)}const v=l.fn({...t,[p]:b,[u]:m});return{...v,data:{x:v.x-e,y:v.y-o}}}}};function ot(i){return mn(i)?(i.nodeName||"").toLowerCase():"#document"}function P(i){var t;return(i==null||(t=i.ownerDocument)==null?void 0:t.defaultView)||window}function st(i){var t;return(t=(mn(i)?i.ownerDocument:i.document)||window.document)==null?void 0:t.documentElement}function mn(i){return i instanceof Node||i instanceof P(i).Node}function W(i){return i instanceof Element||i instanceof P(i).Element}function Y(i){return i instanceof HTMLElement||i instanceof P(i).HTMLElement}function Ei(i){return typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof P(i).ShadowRoot}function oe(i){const{overflow:t,overflowX:e,overflowY:o,display:n}=R(i);return/auto|scroll|overlay|hidden|clip/.test(t+o+e)&&!["inline","contents"].includes(n)}function Zo(i){return["table","td","th"].includes(ot(i))}function tr(i){return[":popover-open",":modal"].some(t=>{try{return i.matches(t)}catch{return!1}})}function li(i){const t=ai(),e=W(i)?R(i):i;return e.transform!=="none"||e.perspective!=="none"||(e.containerType?e.containerType!=="normal":!1)||!t&&(e.backdropFilter?e.backdropFilter!=="none":!1)||!t&&(e.filter?e.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(e.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(e.contain||"").includes(o))}function er(i){let t=St(i);for(;Y(t)&&!Oe(t);){if(li(t))return t;if(tr(t))return null;t=St(t)}return null}function ai(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Oe(i){return["html","body","#document"].includes(ot(i))}function R(i){return P(i).getComputedStyle(i)}function Te(i){return W(i)?{scrollLeft:i.scrollLeft,scrollTop:i.scrollTop}:{scrollLeft:i.scrollX,scrollTop:i.scrollY}}function St(i){if(ot(i)==="html")return i;const t=i.assignedSlot||i.parentNode||Ei(i)&&i.host||st(i);return Ei(t)?t.host:t}function gn(i){const t=St(i);return Oe(t)?i.ownerDocument?i.ownerDocument.body:i.body:Y(t)&&oe(t)?t:gn(t)}function Ye(i,t,e){var o;t===void 0&&(t=[]),e===void 0&&(e=!0);const n=gn(i),r=n===((o=i.ownerDocument)==null?void 0:o.body),s=P(n);if(r){const l=ir(s);return t.concat(s,s.visualViewport||[],oe(n)?n:[],l&&e?Ye(l):[])}return t.concat(n,Ye(n,[],e))}function ir(i){return i.parent&&Object.getPrototypeOf(i.parent)?i.frameElement:null}function vn(i){const t=R(i);let e=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const n=Y(i),r=n?i.offsetWidth:e,s=n?i.offsetHeight:o,l=ve(e)!==r||ve(o)!==s;return l&&(e=r,o=s),{width:e,height:o,$:l}}function yn(i){return W(i)?i:i.contextElement}function Et(i){const t=yn(i);if(!Y(t))return nt(1);const e=t.getBoundingClientRect(),{width:o,height:n,$:r}=vn(t);let s=(r?ve(e.width):e.width)/o,l=(r?ve(e.height):e.height)/n;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const nr=nt(0);function _n(i){const t=P(i);return!ai()||!t.visualViewport?nr:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function or(i,t,e){return t===void 0&&(t=!1),!e||t&&e!==P(i)?!1:t}function Jt(i,t,e,o){t===void 0&&(t=!1),e===void 0&&(e=!1);const n=i.getBoundingClientRect(),r=yn(i);let s=nt(1);t&&(o?W(o)&&(s=Et(o)):s=Et(i));const l=or(r,e,o)?_n(r):nt(0);let a=(n.left+l.x)/s.x,c=(n.top+l.y)/s.y,d=n.width/s.x,u=n.height/s.y;if(r){const p=P(r),b=o&&W(o)?P(o):o;let m=p,v=m.frameElement;for(;v&&o&&b!==m;){const g=Et(v),S=v.getBoundingClientRect(),C=R(v),x=S.left+(v.clientLeft+parseFloat(C.paddingLeft))*g.x,$=S.top+(v.clientTop+parseFloat(C.paddingTop))*g.y;a*=g.x,c*=g.y,d*=g.x,u*=g.y,a+=x,c+=$,m=P(v),v=m.frameElement}}return kt({width:d,height:u,x:a,y:c})}const rr=[":popover-open",":modal"];function xn(i){return rr.some(t=>{try{return i.matches(t)}catch{return!1}})}function sr(i){let{elements:t,rect:e,offsetParent:o,strategy:n}=i;const r=n==="fixed",s=st(o),l=t?xn(t.floating):!1;if(o===s||l&&r)return e;let a={scrollLeft:0,scrollTop:0},c=nt(1);const d=nt(0),u=Y(o);if((u||!u&&!r)&&((ot(o)!=="body"||oe(s))&&(a=Te(o)),Y(o))){const p=Jt(o);c=Et(o),d.x=p.x+o.clientLeft,d.y=p.y+o.clientTop}return{width:e.width*c.x,height:e.height*c.y,x:e.x*c.x-a.scrollLeft*c.x+d.x,y:e.y*c.y-a.scrollTop*c.y+d.y}}function lr(i){return Array.from(i.getClientRects())}function wn(i){return Jt(st(i)).left+Te(i).scrollLeft}function ar(i){const t=st(i),e=Te(i),o=i.ownerDocument.body,n=Q(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=Q(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let s=-e.scrollLeft+wn(i);const l=-e.scrollTop;return R(o).direction==="rtl"&&(s+=Q(t.clientWidth,o.clientWidth)-n),{width:n,height:r,x:s,y:l}}function cr(i,t){const e=P(i),o=st(i),n=e.visualViewport;let r=o.clientWidth,s=o.clientHeight,l=0,a=0;if(n){r=n.width,s=n.height;const c=ai();(!c||c&&t==="fixed")&&(l=n.offsetLeft,a=n.offsetTop)}return{width:r,height:s,x:l,y:a}}function hr(i,t){const e=Jt(i,!0,t==="fixed"),o=e.top+i.clientTop,n=e.left+i.clientLeft,r=Y(i)?Et(i):nt(1),s=i.clientWidth*r.x,l=i.clientHeight*r.y,a=n*r.x,c=o*r.y;return{width:s,height:l,x:a,y:c}}function Ci(i,t,e){let o;if(t==="viewport")o=cr(i,e);else if(t==="document")o=ar(st(i));else if(W(t))o=hr(t,e);else{const n=_n(i);o={...t,x:t.x-n.x,y:t.y-n.y}}return kt(o)}function $n(i,t){const e=St(i);return e===t||!W(e)||Oe(e)?!1:R(e).position==="fixed"||$n(e,t)}function dr(i,t){const e=t.get(i);if(e)return e;let o=Ye(i,[],!1).filter(l=>W(l)&&ot(l)!=="body"),n=null;const r=R(i).position==="fixed";let s=r?St(i):i;for(;W(s)&&!Oe(s);){const l=R(s),a=li(s);!a&&l.position==="fixed"&&(n=null),(r?!a&&!n:!a&&l.position==="static"&&n&&["absolute","fixed"].includes(n.position)||oe(s)&&!a&&$n(i,s))?o=o.filter(c=>c!==s):n=l,s=St(s)}return t.set(i,o),o}function ur(i){let{element:t,boundary:e,rootBoundary:o,strategy:n}=i;const r=[...e==="clippingAncestors"?dr(t,this._c):[].concat(e),o],s=r[0],l=r.reduce((a,c)=>{const d=Ci(t,c,n);return a.top=Q(d.top,a.top),a.right=Ct(d.right,a.right),a.bottom=Ct(d.bottom,a.bottom),a.left=Q(d.left,a.left),a},Ci(t,s,n));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function pr(i){const{width:t,height:e}=vn(i);return{width:t,height:e}}function br(i,t,e){const o=Y(t),n=st(t),r=e==="fixed",s=Jt(i,!0,r,t);let l={scrollLeft:0,scrollTop:0};const a=nt(0);if(o||!o&&!r)if((ot(t)!=="body"||oe(n))&&(l=Te(t)),o){const u=Jt(t,!0,r,t);a.x=u.x+t.clientLeft,a.y=u.y+t.clientTop}else n&&(a.x=wn(n));const c=s.left+l.scrollLeft-a.x,d=s.top+l.scrollTop-a.y;return{x:c,y:d,width:s.width,height:s.height}}function ki(i,t){return!Y(i)||R(i).position==="fixed"?null:t?t(i):i.offsetParent}function En(i,t){const e=P(i);if(!Y(i)||xn(i))return e;let o=ki(i,t);for(;o&&Zo(o)&&R(o).position==="static";)o=ki(o,t);return o&&(ot(o)==="html"||ot(o)==="body"&&R(o).position==="static"&&!li(o))?e:o||er(i)||e}const fr=async function(i){const t=this.getOffsetParent||En,e=this.getDimensions;return{reference:br(i.reference,await t(i.floating),i.strategy),floating:{x:0,y:0,...await e(i.floating)}}};function mr(i){return R(i).direction==="rtl"}const gr={convertOffsetParentRelativeRectToViewportRelativeRect:sr,getDocumentElement:st,getClippingRect:ur,getOffsetParent:En,getElementRects:fr,getClientRects:lr,getDimensions:pr,getScale:Et,isElement:W,isRTL:mr},Cn=Ko,kn=Go,Sn=Jo,An=(i,t,e)=>{const o=new Map,n={platform:gr,...e},r={...n.platform,_c:o};return Yo(i,t,{...n,platform:r})};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis,ci=me.ShadowRoot&&(me.ShadyCSS===void 0||me.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,hi=Symbol(),Si=new WeakMap;let On=class{constructor(i,t,e){if(this._$cssResult$=!0,e!==hi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=i,this.t=t}get styleSheet(){let i=this.o;const t=this.t;if(ci&&i===void 0){const e=t!==void 0&&t.length===1;e&&(i=Si.get(t)),i===void 0&&((this.o=i=new CSSStyleSheet).replaceSync(this.cssText),e&&Si.set(t,i))}return i}toString(){return this.cssText}};const vr=i=>new On(typeof i=="string"?i:i+"",void 0,hi),E=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((o,n,r)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[r+1],i[0]);return new On(e,i,hi)},yr=(i,t)=>{if(ci)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const o=document.createElement("style"),n=me.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,i.appendChild(o)}},Ai=ci?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return vr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_r,defineProperty:xr,getOwnPropertyDescriptor:wr,getOwnPropertyNames:$r,getOwnPropertySymbols:Er,getPrototypeOf:Cr}=Object,At=globalThis,Oi=At.trustedTypes,kr=Oi?Oi.emptyScript:"",Ti=At.reactiveElementPolyfillSupport,Wt=(i,t)=>i,_e={toAttribute(i,t){switch(t){case Boolean:i=i?kr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},di=(i,t)=>!_r(i,t),zi={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:di};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),At.litPropertyMetadata??(At.litPropertyMetadata=new WeakMap);class $t extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=zi){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&xr(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){const{get:n,set:r}=wr(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get(){return n==null?void 0:n.call(this)},set(s){const l=n==null?void 0:n.call(this);r.call(this,s),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??zi}static _$Ei(){if(this.hasOwnProperty(Wt("elementProperties")))return;const t=Cr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Wt("properties"))){const e=this.properties,o=[...$r(e),...Er(e)];for(const n of o)this.createProperty(n,e[n])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(const[e,o]of this.elementProperties){const n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const n of o)e.unshift(Ai(n))}else t!==void 0&&e.push(Ai(t));return e}static _$Eu(t,e){const o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var o;return(o=e.hostConnected)==null?void 0:o.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var o;return(o=e.hostDisconnected)==null?void 0:o.call(e)})}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EC(t,e){var o;const n=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,n);if(r!==void 0&&n.reflect===!0){const s=(((o=n.converter)==null?void 0:o.toAttribute)!==void 0?n.converter:_e).toAttribute(e,n.type);this._$Em=t,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){var o;const n=this.constructor,r=n._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const s=n.getPropertyOptions(r),l=typeof s.converter=="function"?{fromAttribute:s.converter}:((o=s.converter)==null?void 0:o.fromAttribute)!==void 0?s.converter:_e;this._$Em=r,this[r]=l.fromAttribute(e,s.type),this._$Em=null}}requestUpdate(t,e,o){if(t!==void 0){if(o??(o=this.constructor.getPropertyOptions(t)),!(o.hasChanged??di)(this[t],e))return;this.P(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,o){this._$AL.has(t)||this._$AL.set(t,e),o.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[r,s]of n)s.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],s)}let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),(t=this._$EO)==null||t.forEach(n=>{var r;return(r=n.hostUpdate)==null?void 0:r.call(n)}),this.update(o)):this._$EU()}catch(n){throw e=!1,this._$EU(),n}e&&this._$AE(o)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(o=>{var n;return(n=o.hostUpdated)==null?void 0:n.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}$t.elementStyles=[],$t.shadowRootOptions={mode:"open"},$t[Wt("elementProperties")]=new Map,$t[Wt("finalized")]=new Map,Ti==null||Ti({ReactiveElement:$t}),(At.reactiveElementVersions??(At.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xe=globalThis,we=xe.trustedTypes,ji=we?we.createPolicy("lit-html",{createHTML:i=>i}):void 0,Tn="$lit$",it=`lit$${Math.random().toFixed(9).slice(2)}$`,zn="?"+it,Sr=`<${zn}>`,ft=document,Xt=()=>ft.createComment(""),Kt=i=>i===null||typeof i!="object"&&typeof i!="function",ui=Array.isArray,Ar=i=>ui(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Ne=`[ 	
\f\r]`,Vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pi=/-->/g,Li=/>/g,dt=RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mi=/'/g,Ri=/"/g,jn=/^(?:script|style|textarea|title)$/i,Or=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),f=Or(1),Ot=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Bi=new WeakMap,ut=ft.createTreeWalker(ft,129);function Pn(i,t){if(!ui(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ji!==void 0?ji.createHTML(t):t}const Tr=(i,t)=>{const e=i.length-1,o=[];let n,r=t===2?"<svg>":t===3?"<math>":"",s=Vt;for(let l=0;l<e;l++){const a=i[l];let c,d,u=-1,p=0;for(;p<a.length&&(s.lastIndex=p,d=s.exec(a),d!==null);)p=s.lastIndex,s===Vt?d[1]==="!--"?s=Pi:d[1]!==void 0?s=Li:d[2]!==void 0?(jn.test(d[2])&&(n=RegExp("</"+d[2],"g")),s=dt):d[3]!==void 0&&(s=dt):s===dt?d[0]===">"?(s=n??Vt,u=-1):d[1]===void 0?u=-2:(u=s.lastIndex-d[2].length,c=d[1],s=d[3]===void 0?dt:d[3]==='"'?Ri:Mi):s===Ri||s===Mi?s=dt:s===Pi||s===Li?s=Vt:(s=dt,n=void 0);const b=s===dt&&i[l+1].startsWith("/>")?" ":"";r+=s===Vt?a+Sr:u>=0?(o.push(c),a.slice(0,u)+Tn+a.slice(u)+it+b):a+it+(u===-2?l:b)}return[Pn(i,r+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]};class Zt{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let r=0,s=0;const l=t.length-1,a=this.parts,[c,d]=Tr(t,e);if(this.el=Zt.createElement(c,o),ut.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=ut.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(Tn)){const p=d[s++],b=n.getAttribute(u).split(it),m=/([.?@])?(.*)/.exec(p);a.push({type:1,index:r,name:m[2],strings:b,ctor:m[1]==="."?jr:m[1]==="?"?Pr:m[1]==="@"?Lr:ze}),n.removeAttribute(u)}else u.startsWith(it)&&(a.push({type:6,index:r}),n.removeAttribute(u));if(jn.test(n.tagName)){const u=n.textContent.split(it),p=u.length-1;if(p>0){n.textContent=we?we.emptyScript:"";for(let b=0;b<p;b++)n.append(u[b],Xt()),ut.nextNode(),a.push({type:2,index:++r});n.append(u[p],Xt())}}}else if(n.nodeType===8)if(n.data===zn)a.push({type:2,index:r});else{let u=-1;for(;(u=n.data.indexOf(it,u+1))!==-1;)a.push({type:7,index:r}),u+=it.length-1}r++}}static createElement(t,e){const o=ft.createElement("template");return o.innerHTML=t,o}}function Tt(i,t,e=i,o){var n,r;if(t===Ot)return t;let s=o!==void 0?(n=e.o)==null?void 0:n[o]:e.l;const l=Kt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==l&&((r=s==null?void 0:s._$AO)==null||r.call(s,!1),l===void 0?s=void 0:(s=new l(i),s._$AT(i,e,o)),o!==void 0?(e.o??(e.o=[]))[o]=s:e.l=s),s!==void 0&&(t=Tt(i,s._$AS(i,t.values),s,o)),t}class zr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,n=((t==null?void 0:t.creationScope)??ft).importNode(e,!0);ut.currentNode=n;let r=ut.nextNode(),s=0,l=0,a=o[0];for(;a!==void 0;){if(s===a.index){let c;a.type===2?c=new re(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new Mr(r,this,t)),this._$AV.push(c),a=o[++l]}s!==(a==null?void 0:a.index)&&(r=ut.nextNode(),s++)}return ut.currentNode=ft,n}p(t){let e=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class re{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,o,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this.v=(n==null?void 0:n.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Tt(this,t,e),Kt(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==Ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ar(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&Kt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ft.createTextNode(t)),this._$AH=t}$(t){var e;const{values:o,_$litType$:n}=t,r=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=Zt.createElement(Pn(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(o);else{const s=new zr(r,this),l=s.u(this.options);s.p(o),this.T(l),this._$AH=s}}_$AC(t){let e=Bi.get(t.strings);return e===void 0&&Bi.set(t.strings,e=new Zt(t)),e}k(t){ui(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,n=0;for(const r of t)n===e.length?e.push(o=new re(this.O(Xt()),this.O(Xt()),this,this.options)):o=e[n],o._$AI(r),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class ze{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,r){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=A}_$AI(t,e=this,o,n){const r=this.strings;let s=!1;if(r===void 0)t=Tt(this,t,e,0),s=!Kt(t)||t!==this._$AH&&t!==Ot,s&&(this._$AH=t);else{const l=t;let a,c;for(t=r[0],a=0;a<r.length-1;a++)c=Tt(this,l[o+a],e,a),c===Ot&&(c=this._$AH[a]),s||(s=!Kt(c)||c!==this._$AH[a]),c===A?t=A:t!==A&&(t+=(c??"")+r[a+1]),this._$AH[a]=c}s&&!n&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class jr extends ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class Pr extends ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class Lr extends ze{constructor(t,e,o,n,r){super(t,e,o,n,r),this.type=5}_$AI(t,e=this){if((t=Tt(this,t,e,0)??A)===Ot)return;const o=this._$AH,n=t===A&&o!==A||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==A&&(o===A||n);n&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mr{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Tt(this,t)}}const Hi=xe.litHtmlPolyfillSupport;Hi==null||Hi(Zt,re),(xe.litHtmlVersions??(xe.litHtmlVersions=[])).push("3.2.0");const zt=(i,t,e)=>{const o=(e==null?void 0:e.renderBefore)??t;let n=o._$litPart$;if(n===void 0){const r=(e==null?void 0:e.renderBefore)??null;o._$litPart$=n=new re(t.insertBefore(Xt(),r),r,void 0,e??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class w extends $t{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=zt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Ot}}var Ii;w._$litElement$=!0,w.finalized=!0,(Ii=globalThis.litElementHydrateSupport)==null||Ii.call(globalThis,{LitElement:w});const Ni=globalThis.litElementPolyfillSupport;Ni==null||Ni({LitElement:w});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rr={attribute:!0,type:String,converter:_e,reflect:!1,hasChanged:di},Br=(i=Rr,t,e)=>{const{kind:o,metadata:n}=e;let r=globalThis.litPropertyMetadata.get(n);if(r===void 0&&globalThis.litPropertyMetadata.set(n,r=new Map),r.set(e.name,i),o==="accessor"){const{name:s}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(s,a,i)},init(l){return l!==void 0&&this.P(s,void 0,i),l}}}if(o==="setter"){const{name:s}=e;return function(l){const a=this[s];t.call(this,l),this.requestUpdate(s,a,i)}}throw Error("Unsupported decorator location: "+o)};function h(i){return(t,e)=>typeof e=="object"?Br(i,t,e):((o,n,r)=>{const s=n.hasOwnProperty(r);return n.constructor.createProperty(r,s?{...o,wrapped:!0}:o),s?Object.getOwnPropertyDescriptor(n,r):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lt(i){return h({...i,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hr=i=>i.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ir={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Nr=i=>(...t)=>({_$litDirective$:i,values:t});class Fr{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this.t=t,this._$AM=e,this.i=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yt=(i,t)=>{var e;const o=i._$AN;if(o===void 0)return!1;for(const n of o)(e=n._$AO)==null||e.call(n,t,!1),Yt(n,t);return!0},$e=i=>{let t,e;do{if((t=i._$AM)===void 0)break;e=t._$AN,e.delete(i),i=t}while((e==null?void 0:e.size)===0)},Ln=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),Vr(t)}};function Dr(i){this._$AN!==void 0?($e(this),this._$AM=i,Ln(this)):this._$AM=i}function Ur(i,t=!1,e=0){const o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let r=e;r<o.length;r++)Yt(o[r],!1),$e(o[r]);else o!=null&&(Yt(o,!1),$e(o));else Yt(this,i)}const Vr=i=>{i.type==Ir.CHILD&&(i._$AP??(i._$AP=Ur),i._$AQ??(i._$AQ=Dr))};class qr extends Fr{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,o){super._$AT(t,e,o),Ln(this),this.isConnected=t._$AU}_$AO(t,e=!0){var o,n;t!==this.isConnected&&(this.isConnected=t,t?(o=this.reconnected)==null||o.call(this):(n=this.disconnected)==null||n.call(this)),e&&(Yt(this,t),$e(this))}setValue(t){if(Hr(this.t))this.t._$AI(t,this);else{const e=[...this.t._$AH];e[this.i]=t,this.t._$AI(e,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt=()=>new Wr;class Wr{}const Fe=new WeakMap,Pt=Nr(class extends qr{render(i){return A}update(i,[t]){var e;const o=t!==this.Y;return o&&this.Y!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.Y=t,this.ht=(e=i.options)==null?void 0:e.host,this.rt(this.ct=i.element)),A}rt(i){if(this.isConnected||(i=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let e=Fe.get(t);e===void 0&&(e=new WeakMap,Fe.set(t,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),e.set(this.Y,i),i!==void 0&&this.Y.call(this.ht,i)}else this.Y.value=i}get lt(){var i,t;return typeof this.Y=="function"?(i=Fe.get(this.ht??globalThis))==null?void 0:i.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 2.0.0
*/const Mn=Object.freeze({left:0,top:0,width:16,height:16}),Ee=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),se=Object.freeze({...Mn,...Ee}),Ge=Object.freeze({...se,body:"",hidden:!1}),Yr=Object.freeze({width:null,height:null}),Rn=Object.freeze({...Yr,...Ee});function Gr(i,t=0){const e=i.replace(/^-?[0-9.]*/,"");function o(n){for(;n<0;)n+=4;return n%4}if(e===""){const n=parseInt(i);return isNaN(n)?0:o(n)}else if(e!==i){let n=0;switch(e){case"%":n=25;break;case"deg":n=90}if(n){let r=parseFloat(i.slice(0,i.length-e.length));return isNaN(r)?0:(r=r/n,r%1===0?o(r):0)}}return t}const Qr=/[\s,]+/;function Jr(i,t){t.split(Qr).forEach(e=>{switch(e.trim()){case"horizontal":i.hFlip=!0;break;case"vertical":i.vFlip=!0;break}})}const Bn={...Rn,preserveAspectRatio:""};function Fi(i){const t={...Bn},e=(o,n)=>i.getAttribute(o)||n;return t.width=e("width",null),t.height=e("height",null),t.rotate=Gr(e("rotate","")),Jr(t,e("flip","")),t.preserveAspectRatio=e("preserveAspectRatio",e("preserveaspectratio","")),t}function Xr(i,t){for(const e in Bn)if(i[e]!==t[e])return!0;return!1}const Gt=/^[a-z0-9]+(-[a-z0-9]+)*$/,le=(i,t,e,o="")=>{const n=i.split(":");if(i.slice(0,1)==="@"){if(n.length<2||n.length>3)return null;o=n.shift().slice(1)}if(n.length>3||!n.length)return null;if(n.length>1){const l=n.pop(),a=n.pop(),c={provider:n.length>0?n[0]:o,prefix:a,name:l};return t&&!ge(c)?null:c}const r=n[0],s=r.split("-");if(s.length>1){const l={provider:o,prefix:s.shift(),name:s.join("-")};return t&&!ge(l)?null:l}if(e&&o===""){const l={provider:o,prefix:"",name:r};return t&&!ge(l,e)?null:l}return null},ge=(i,t)=>i?!!((i.provider===""||i.provider.match(Gt))&&(t&&i.prefix===""||i.prefix.match(Gt))&&i.name.match(Gt)):!1;function Kr(i,t){const e={};!i.hFlip!=!t.hFlip&&(e.hFlip=!0),!i.vFlip!=!t.vFlip&&(e.vFlip=!0);const o=((i.rotate||0)+(t.rotate||0))%4;return o&&(e.rotate=o),e}function Di(i,t){const e=Kr(i,t);for(const o in Ge)o in Ee?o in i&&!(o in e)&&(e[o]=Ee[o]):o in t?e[o]=t[o]:o in i&&(e[o]=i[o]);return e}function Zr(i,t){const e=i.icons,o=i.aliases||Object.create(null),n=Object.create(null);function r(s){if(e[s])return n[s]=[];if(!(s in n)){n[s]=null;const l=o[s]&&o[s].parent,a=l&&r(l);a&&(n[s]=[l].concat(a))}return n[s]}return Object.keys(e).concat(Object.keys(o)).forEach(r),n}function ts(i,t,e){const o=i.icons,n=i.aliases||Object.create(null);let r={};function s(l){r=Di(o[l]||n[l],r)}return s(t),e.forEach(s),Di(i,r)}function Hn(i,t){const e=[];if(typeof i!="object"||typeof i.icons!="object")return e;i.not_found instanceof Array&&i.not_found.forEach(n=>{t(n,null),e.push(n)});const o=Zr(i);for(const n in o){const r=o[n];r&&(t(n,ts(i,n,r)),e.push(n))}return e}const es={provider:"",aliases:{},not_found:{},...Mn};function De(i,t){for(const e in t)if(e in i&&typeof i[e]!=typeof t[e])return!1;return!0}function In(i){if(typeof i!="object"||i===null)return null;const t=i;if(typeof t.prefix!="string"||!i.icons||typeof i.icons!="object"||!De(i,es))return null;const e=t.icons;for(const n in e){const r=e[n];if(!n.match(Gt)||typeof r.body!="string"||!De(r,Ge))return null}const o=t.aliases||Object.create(null);for(const n in o){const r=o[n],s=r.parent;if(!n.match(Gt)||typeof s!="string"||!e[s]&&!o[s]||!De(r,Ge))return null}return t}const Ce=Object.create(null);function is(i,t){return{provider:i,prefix:t,icons:Object.create(null),missing:new Set}}function rt(i,t){const e=Ce[i]||(Ce[i]=Object.create(null));return e[t]||(e[t]=is(i,t))}function pi(i,t){return In(t)?Hn(t,(e,o)=>{o?i.icons[e]=o:i.missing.add(e)}):[]}function ns(i,t,e){try{if(typeof e.body=="string")return i.icons[t]={...e},!0}catch{}return!1}function os(i,t){let e=[];return(typeof i=="string"?[i]:Object.keys(Ce)).forEach(o=>{(typeof o=="string"&&typeof t=="string"?[t]:Object.keys(Ce[o]||{})).forEach(n=>{const r=rt(o,n);e=e.concat(Object.keys(r.icons).map(s=>(o!==""?"@"+o+":":"")+n+":"+s))})}),e}let te=!1;function Nn(i){return typeof i=="boolean"&&(te=i),te}function ee(i){const t=typeof i=="string"?le(i,!0,te):i;if(t){const e=rt(t.provider,t.prefix),o=t.name;return e.icons[o]||(e.missing.has(o)?null:void 0)}}function Fn(i,t){const e=le(i,!0,te);if(!e)return!1;const o=rt(e.provider,e.prefix);return ns(o,e.name,t)}function Ui(i,t){if(typeof i!="object")return!1;if(typeof t!="string"&&(t=i.provider||""),te&&!t&&!i.prefix){let n=!1;return In(i)&&(i.prefix="",Hn(i,(r,s)=>{s&&Fn(r,s)&&(n=!0)})),n}const e=i.prefix;if(!ge({provider:t,prefix:e,name:"a"}))return!1;const o=rt(t,e);return!!pi(o,i)}function Vi(i){return!!ee(i)}function rs(i){const t=ee(i);return t?{...se,...t}:null}function ss(i){const t={loaded:[],missing:[],pending:[]},e=Object.create(null);i.sort((n,r)=>n.provider!==r.provider?n.provider.localeCompare(r.provider):n.prefix!==r.prefix?n.prefix.localeCompare(r.prefix):n.name.localeCompare(r.name));let o={provider:"",prefix:"",name:""};return i.forEach(n=>{if(o.name===n.name&&o.prefix===n.prefix&&o.provider===n.provider)return;o=n;const r=n.provider,s=n.prefix,l=n.name,a=e[r]||(e[r]=Object.create(null)),c=a[s]||(a[s]=rt(r,s));let d;l in c.icons?d=t.loaded:s===""||c.missing.has(l)?d=t.missing:d=t.pending;const u={provider:r,prefix:s,name:l};d.push(u)}),t}function Dn(i,t){i.forEach(e=>{const o=e.loaderCallbacks;o&&(e.loaderCallbacks=o.filter(n=>n.id!==t))})}function ls(i){i.pendingCallbacksFlag||(i.pendingCallbacksFlag=!0,setTimeout(()=>{i.pendingCallbacksFlag=!1;const t=i.loaderCallbacks?i.loaderCallbacks.slice(0):[];if(!t.length)return;let e=!1;const o=i.provider,n=i.prefix;t.forEach(r=>{const s=r.icons,l=s.pending.length;s.pending=s.pending.filter(a=>{if(a.prefix!==n)return!0;const c=a.name;if(i.icons[c])s.loaded.push({provider:o,prefix:n,name:c});else if(i.missing.has(c))s.missing.push({provider:o,prefix:n,name:c});else return e=!0,!0;return!1}),s.pending.length!==l&&(e||Dn([i],r.id),r.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),r.abort))})}))}let as=0;function cs(i,t,e){const o=as++,n=Dn.bind(null,e,o);if(!t.pending.length)return n;const r={id:o,icons:t,callback:i,abort:n};return e.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(r)}),n}const Qe=Object.create(null);function qi(i,t){Qe[i]=t}function Je(i){return Qe[i]||Qe[""]}function hs(i,t=!0,e=!1){const o=[];return i.forEach(n=>{const r=typeof n=="string"?le(n,t,e):n;r&&o.push(r)}),o}var ds={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function us(i,t,e,o){const n=i.resources.length,r=i.random?Math.floor(Math.random()*n):i.index;let s;if(i.random){let y=i.resources.slice(0);for(s=[];y.length>1;){const j=Math.floor(Math.random()*y.length);s.push(y[j]),y=y.slice(0,j).concat(y.slice(j+1))}s=s.concat(y)}else s=i.resources.slice(r).concat(i.resources.slice(0,r));const l=Date.now();let a="pending",c=0,d,u=null,p=[],b=[];typeof o=="function"&&b.push(o);function m(){u&&(clearTimeout(u),u=null)}function v(){a==="pending"&&(a="aborted"),m(),p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function g(y,j){j&&(b=[]),typeof y=="function"&&b.push(y)}function S(){return{startTime:l,payload:t,status:a,queriesSent:c,queriesPending:p.length,subscribe:g,abort:v}}function C(){a="failed",b.forEach(y=>{y(void 0,d)})}function x(){p.forEach(y=>{y.status==="pending"&&(y.status="aborted")}),p=[]}function $(y,j,N){const F=j!=="success";switch(p=p.filter(k=>k!==y),a){case"pending":break;case"failed":if(F||!i.dataAfterTimeout)return;break;default:return}if(j==="abort"){d=N,C();return}if(F){d=N,p.length||(s.length?z():C());return}if(m(),x(),!i.random){const k=i.resources.indexOf(y.resource);k!==-1&&k!==i.index&&(i.index=k)}a="completed",b.forEach(k=>{k(N)})}function z(){if(a!=="pending")return;m();const y=s.shift();if(y===void 0){if(p.length){u=setTimeout(()=>{m(),a==="pending"&&(x(),C())},i.timeout);return}C();return}const j={status:"pending",resource:y,callback:(N,F)=>{$(j,N,F)}};p.push(j),c++,u=setTimeout(z,i.rotate),e(y,t,j.callback)}return setTimeout(z),S}function Un(i){const t={...ds,...i};let e=[];function o(){e=e.filter(s=>s().status==="pending")}function n(s,l,a){const c=us(t,s,l,(d,u)=>{o(),a&&a(d,u)});return e.push(c),c}function r(s){return e.find(l=>s(l))||null}return{query:n,find:r,setIndex:s=>{t.index=s},getIndex:()=>t.index,cleanup:o}}function bi(i){let t;if(typeof i.resources=="string")t=[i.resources];else if(t=i.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:i.path||"/",maxURL:i.maxURL||500,rotate:i.rotate||750,timeout:i.timeout||5e3,random:i.random===!0,index:i.index||0,dataAfterTimeout:i.dataAfterTimeout!==!1}}const je=Object.create(null),be=["https://api.simplesvg.com","https://api.unisvg.com"],Xe=[];for(;be.length>0;)be.length===1||Math.random()>.5?Xe.push(be.shift()):Xe.push(be.pop());je[""]=bi({resources:["https://api.iconify.design"].concat(Xe)});function Wi(i,t){const e=bi(t);return e===null?!1:(je[i]=e,!0)}function Pe(i){return je[i]}function ps(){return Object.keys(je)}function Yi(){}const Ue=Object.create(null);function bs(i){if(!Ue[i]){const t=Pe(i);if(!t)return;const e=Un(t),o={config:t,redundancy:e};Ue[i]=o}return Ue[i]}function Vn(i,t,e){let o,n;if(typeof i=="string"){const r=Je(i);if(!r)return e(void 0,424),Yi;n=r.send;const s=bs(i);s&&(o=s.redundancy)}else{const r=bi(i);if(r){o=Un(r);const s=i.resources?i.resources[0]:"",l=Je(s);l&&(n=l.send)}}return!o||!n?(e(void 0,424),Yi):o.query(t,n,e)().abort}const Gi="iconify2",ie="iconify",qn=ie+"-count",Qi=ie+"-version",Wn=36e5,fs=168,ms=50;function Ke(i,t){try{return i.getItem(t)}catch{}}function fi(i,t,e){try{return i.setItem(t,e),!0}catch{}}function Ji(i,t){try{i.removeItem(t)}catch{}}function Ze(i,t){return fi(i,qn,t.toString())}function ti(i){return parseInt(Ke(i,qn))||0}const pt={local:!0,session:!0},Yn={local:new Set,session:new Set};let mi=!1;function gs(i){mi=i}let fe=typeof window>"u"?{}:window;function Gn(i){const t=i+"Storage";try{if(fe&&fe[t]&&typeof fe[t].length=="number")return fe[t]}catch{}pt[i]=!1}function Qn(i,t){const e=Gn(i);if(!e)return;const o=Ke(e,Qi);if(o!==Gi){if(o){const l=ti(e);for(let a=0;a<l;a++)Ji(e,ie+a.toString())}fi(e,Qi,Gi),Ze(e,0);return}const n=Math.floor(Date.now()/Wn)-fs,r=l=>{const a=ie+l.toString(),c=Ke(e,a);if(typeof c=="string"){try{const d=JSON.parse(c);if(typeof d=="object"&&typeof d.cached=="number"&&d.cached>n&&typeof d.provider=="string"&&typeof d.data=="object"&&typeof d.data.prefix=="string"&&t(d,l))return!0}catch{}Ji(e,a)}};let s=ti(e);for(let l=s-1;l>=0;l--)r(l)||(l===s-1?(s--,Ze(e,s)):Yn[i].add(l))}function Jn(){if(!mi){gs(!0);for(const i in pt)Qn(i,t=>{const e=t.data,o=t.provider,n=e.prefix,r=rt(o,n);if(!pi(r,e).length)return!1;const s=e.lastModified||-1;return r.lastModifiedCached=r.lastModifiedCached?Math.min(r.lastModifiedCached,s):s,!0})}}function vs(i,t){const e=i.lastModifiedCached;if(e&&e>=t)return e===t;if(i.lastModifiedCached=t,e)for(const o in pt)Qn(o,n=>{const r=n.data;return n.provider!==i.provider||r.prefix!==i.prefix||r.lastModified===t});return!0}function ys(i,t){mi||Jn();function e(o){let n;if(!pt[o]||!(n=Gn(o)))return;const r=Yn[o];let s;if(r.size)r.delete(s=Array.from(r).shift());else if(s=ti(n),s>=ms||!Ze(n,s+1))return;const l={cached:Math.floor(Date.now()/Wn),provider:i.provider,data:t};return fi(n,ie+s.toString(),JSON.stringify(l))}t.lastModified&&!vs(i,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),e("local")||e("session"))}function Xi(){}function _s(i){i.iconsLoaderFlag||(i.iconsLoaderFlag=!0,setTimeout(()=>{i.iconsLoaderFlag=!1,ls(i)}))}function xs(i,t){i.iconsToLoad?i.iconsToLoad=i.iconsToLoad.concat(t).sort():i.iconsToLoad=t,i.iconsQueueFlag||(i.iconsQueueFlag=!0,setTimeout(()=>{i.iconsQueueFlag=!1;const{provider:e,prefix:o}=i,n=i.iconsToLoad;delete i.iconsToLoad;let r;!n||!(r=Je(e))||r.prepare(e,o,n).forEach(s=>{Vn(e,s,l=>{if(typeof l!="object")s.icons.forEach(a=>{i.missing.add(a)});else try{const a=pi(i,l);if(!a.length)return;const c=i.pendingIcons;c&&a.forEach(d=>{c.delete(d)}),ys(i,l)}catch(a){console.error(a)}_s(i)})})}))}const gi=(i,t)=>{const e=hs(i,!0,Nn()),o=ss(e);if(!o.pending.length){let a=!0;return t&&setTimeout(()=>{a&&t(o.loaded,o.missing,o.pending,Xi)}),()=>{a=!1}}const n=Object.create(null),r=[];let s,l;return o.pending.forEach(a=>{const{provider:c,prefix:d}=a;if(d===l&&c===s)return;s=c,l=d,r.push(rt(c,d));const u=n[c]||(n[c]=Object.create(null));u[d]||(u[d]=[])}),o.pending.forEach(a=>{const{provider:c,prefix:d,name:u}=a,p=rt(c,d),b=p.pendingIcons||(p.pendingIcons=new Set);b.has(u)||(b.add(u),n[c][d].push(u))}),r.forEach(a=>{const{provider:c,prefix:d}=a;n[c][d].length&&xs(a,n[c][d])}),t?cs(t,o,r):Xi},ws=i=>new Promise((t,e)=>{const o=typeof i=="string"?le(i,!0):i;if(!o){e(i);return}gi([o||i],n=>{if(n.length&&o){const r=ee(o);if(r){t({...se,...r});return}}e(i)})});function $s(i){try{const t=typeof i=="string"?JSON.parse(i):i;if(typeof t.body=="string")return{...t}}catch{}}function Es(i,t){const e=typeof i=="string"?le(i,!0,!0):null;if(!e){const r=$s(i);return{value:i,data:r}}const o=ee(e);if(o!==void 0||!e.prefix)return{value:i,name:e,data:o};const n=gi([e],()=>t(i,e,ee(e)));return{value:i,name:e,loading:n}}function Ve(i){return i.hasAttribute("inline")}let Xn=!1;try{Xn=navigator.vendor.indexOf("Apple")===0}catch{}function Cs(i,t){switch(t){case"svg":case"bg":case"mask":return t}return t!=="style"&&(Xn||i.indexOf("<a")===-1)?"svg":i.indexOf("currentColor")===-1?"bg":"mask"}const ks=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Ss=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function ei(i,t,e){if(t===1)return i;if(e=e||100,typeof i=="number")return Math.ceil(i*t*e)/e;if(typeof i!="string")return i;const o=i.split(ks);if(o===null||!o.length)return i;const n=[];let r=o.shift(),s=Ss.test(r);for(;;){if(s){const l=parseFloat(r);isNaN(l)?n.push(r):n.push(Math.ceil(l*t*e)/e)}else n.push(r);if(r=o.shift(),r===void 0)return n.join("");s=!s}}function As(i,t="defs"){let e="";const o=i.indexOf("<"+t);for(;o>=0;){const n=i.indexOf(">",o),r=i.indexOf("</"+t);if(n===-1||r===-1)break;const s=i.indexOf(">",r);if(s===-1)break;e+=i.slice(n+1,r).trim(),i=i.slice(0,o).trim()+i.slice(s+1)}return{defs:e,content:i}}function Os(i,t){return i?"<defs>"+i+"</defs>"+t:t}function Ts(i,t,e){const o=As(i);return Os(o.defs,t+o.content+e)}const zs=i=>i==="unset"||i==="undefined"||i==="none";function Kn(i,t){const e={...se,...i},o={...Rn,...t},n={left:e.left,top:e.top,width:e.width,height:e.height};let r=e.body;[e,o].forEach(v=>{const g=[],S=v.hFlip,C=v.vFlip;let x=v.rotate;S?C?x+=2:(g.push("translate("+(n.width+n.left).toString()+" "+(0-n.top).toString()+")"),g.push("scale(-1 1)"),n.top=n.left=0):C&&(g.push("translate("+(0-n.left).toString()+" "+(n.height+n.top).toString()+")"),g.push("scale(1 -1)"),n.top=n.left=0);let $;switch(x<0&&(x-=Math.floor(x/4)*4),x=x%4,x){case 1:$=n.height/2+n.top,g.unshift("rotate(90 "+$.toString()+" "+$.toString()+")");break;case 2:g.unshift("rotate(180 "+(n.width/2+n.left).toString()+" "+(n.height/2+n.top).toString()+")");break;case 3:$=n.width/2+n.left,g.unshift("rotate(-90 "+$.toString()+" "+$.toString()+")");break}x%2===1&&(n.left!==n.top&&($=n.left,n.left=n.top,n.top=$),n.width!==n.height&&($=n.width,n.width=n.height,n.height=$)),g.length&&(r=Ts(r,'<g transform="'+g.join(" ")+'">',"</g>"))});const s=o.width,l=o.height,a=n.width,c=n.height;let d,u;s===null?(u=l===null?"1em":l==="auto"?c:l,d=ei(u,a/c)):(d=s==="auto"?a:s,u=l===null?ei(d,c/a):l==="auto"?c:l);const p={},b=(v,g)=>{zs(g)||(p[v]=g.toString())};b("width",d),b("height",u);const m=[n.left,n.top,a,c];return p.viewBox=m.join(" "),{attributes:p,viewBox:m,body:r}}function vi(i,t){let e=i.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const o in t)e+=" "+o+'="'+t[o]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+e+">"+i+"</svg>"}function js(i){return i.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ps(i){return"data:image/svg+xml,"+js(i)}function Zn(i){return'url("'+Ps(i)+'")'}const Ls=()=>{let i;try{if(i=fetch,typeof i=="function")return i}catch{}};let ke=Ls();function Ms(i){ke=i}function Rs(){return ke}function Bs(i,t){const e=Pe(i);if(!e)return 0;let o;if(!e.maxURL)o=0;else{let n=0;e.resources.forEach(s=>{n=Math.max(n,s.length)});const r=t+".json?icons=";o=e.maxURL-n-e.path.length-r.length}return o}function Hs(i){return i===404}const Is=(i,t,e)=>{const o=[],n=Bs(i,t),r="icons";let s={type:r,provider:i,prefix:t,icons:[]},l=0;return e.forEach((a,c)=>{l+=a.length+1,l>=n&&c>0&&(o.push(s),s={type:r,provider:i,prefix:t,icons:[]},l=a.length),s.icons.push(a)}),o.push(s),o};function Ns(i){if(typeof i=="string"){const t=Pe(i);if(t)return t.path}return"/"}const Fs=(i,t,e)=>{if(!ke){e("abort",424);return}let o=Ns(t.provider);switch(t.type){case"icons":{const r=t.prefix,s=t.icons.join(","),l=new URLSearchParams({icons:s});o+=r+".json?"+l.toString();break}case"custom":{const r=t.uri;o+=r.slice(0,1)==="/"?r.slice(1):r;break}default:e("abort",400);return}let n=503;ke(i+o).then(r=>{const s=r.status;if(s!==200){setTimeout(()=>{e(Hs(s)?"abort":"next",s)});return}return n=501,r.json()}).then(r=>{if(typeof r!="object"||r===null){setTimeout(()=>{r===404?e("abort",r):e("next",n)});return}setTimeout(()=>{e("success",r)})}).catch(()=>{e("next",n)})},Ds={prepare:Is,send:Fs};function Ki(i,t){switch(i){case"local":case"session":pt[i]=t;break;case"all":for(const e in pt)pt[e]=t;break}}const qe="data-style";let to="";function Us(i){to=i}function Zi(i,t){let e=Array.from(i.childNodes).find(o=>o.hasAttribute&&o.hasAttribute(qe));e||(e=document.createElement("style"),e.setAttribute(qe,qe),i.appendChild(e)),e.textContent=":host{display:inline-block;vertical-align:"+(t?"-0.125em":"0")+"}span,svg{display:block}"+to}function eo(){qi("",Ds),Nn(!0);let i;try{i=window}catch{}if(i){if(Jn(),i.IconifyPreload!==void 0){const t=i.IconifyPreload,e="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(o=>{try{(typeof o!="object"||o===null||o instanceof Array||typeof o.icons!="object"||typeof o.prefix!="string"||!Ui(o))&&console.error(e)}catch{console.error(e)}})}if(i.IconifyProviders!==void 0){const t=i.IconifyProviders;if(typeof t=="object"&&t!==null)for(const e in t){const o="IconifyProviders["+e+"] is invalid.";try{const n=t[e];if(typeof n!="object"||!n||n.resources===void 0)continue;Wi(e,n)||console.error(o)}catch{console.error(o)}}}}return{enableCache:t=>Ki(t,!0),disableCache:t=>Ki(t,!1),iconLoaded:Vi,iconExists:Vi,getIcon:rs,listIcons:os,addIcon:Fn,addCollection:Ui,calculateSize:ei,buildIcon:Kn,iconToHTML:vi,svgToURL:Zn,loadIcons:gi,loadIcon:ws,addAPIProvider:Wi,appendCustomStyle:Us,_api:{getAPIConfig:Pe,setAPIModule:qi,sendAPIQuery:Vn,setFetch:Ms,getFetch:Rs,listAPIProviders:ps}}}const ii={"background-color":"currentColor"},io={"background-color":"transparent"},tn={image:"var(--svg)",repeat:"no-repeat",size:"100% 100%"},en={"-webkit-mask":ii,mask:ii,background:io};for(const i in en){const t=en[i];for(const e in tn)t[i+"-"+e]=tn[e]}function nn(i){return i?i+(i.match(/^[-0-9.]+$/)?"px":""):"inherit"}function Vs(i,t,e){const o=document.createElement("span");let n=i.body;n.indexOf("<a")!==-1&&(n+="<!-- "+Date.now()+" -->");const r=i.attributes,s=vi(n,{...r,width:t.width+"",height:t.height+""}),l=Zn(s),a=o.style,c={"--svg":l,width:nn(r.width),height:nn(r.height),...e?ii:io};for(const d in c)a.setProperty(d,c[d]);return o}let Qt;function qs(){try{Qt=window.trustedTypes.createPolicy("iconify",{createHTML:i=>i})}catch{Qt=null}}function Ws(i){return Qt===void 0&&qs(),Qt?Qt.createHTML(i):i}function Ys(i){const t=document.createElement("span"),e=i.attributes;let o="";e.width||(o="width: inherit;"),e.height||(o+="height: inherit;"),o&&(e.style=o);const n=vi(i.body,e);return t.innerHTML=Ws(n),t.firstChild}function ni(i){return Array.from(i.childNodes).find(t=>{const e=t.tagName&&t.tagName.toUpperCase();return e==="SPAN"||e==="SVG"})}function on(i,t){const e=t.icon.data,o=t.customisations,n=Kn(e,o);o.preserveAspectRatio&&(n.attributes.preserveAspectRatio=o.preserveAspectRatio);const r=t.renderedMode;let s;switch(r){case"svg":s=Ys(n);break;default:s=Vs(n,{...se,...e},r==="mask")}const l=ni(i);l?s.tagName==="SPAN"&&l.tagName===s.tagName?l.setAttribute("style",s.getAttribute("style")):i.replaceChild(s,l):i.appendChild(s)}function rn(i,t,e){const o=e&&(e.rendered?e:e.lastRender);return{rendered:!1,inline:t,icon:i,lastRender:o}}function Gs(i="iconify-icon"){let t,e;try{t=window.customElements,e=window.HTMLElement}catch{return}if(!t||!e)return;const o=t.get(i);if(o)return o;const n=["icon","mode","inline","observe","width","height","rotate","flip"],r=class extends e{constructor(){super(),ht(this,"_shadowRoot"),ht(this,"_initialised",!1),ht(this,"_state"),ht(this,"_checkQueued",!1),ht(this,"_connected",!1),ht(this,"_observer",null),ht(this,"_visible",!0);const l=this._shadowRoot=this.attachShadow({mode:"open"}),a=Ve(this);Zi(l,a),this._state=rn({value:""},a),this._queueCheck()}connectedCallback(){this._connected=!0,this.startObserver()}disconnectedCallback(){this._connected=!1,this.stopObserver()}static get observedAttributes(){return n.slice(0)}attributeChangedCallback(l){switch(l){case"inline":{const a=Ve(this),c=this._state;a!==c.inline&&(c.inline=a,Zi(this._shadowRoot,a));break}case"observer":{this.observer?this.startObserver():this.stopObserver();break}default:this._queueCheck()}}get icon(){const l=this.getAttribute("icon");if(l&&l.slice(0,1)==="{")try{return JSON.parse(l)}catch{}return l}set icon(l){typeof l=="object"&&(l=JSON.stringify(l)),this.setAttribute("icon",l)}get inline(){return Ve(this)}set inline(l){l?this.setAttribute("inline","true"):this.removeAttribute("inline")}get observer(){return this.hasAttribute("observer")}set observer(l){l?this.setAttribute("observer","true"):this.removeAttribute("observer")}restartAnimation(){const l=this._state;if(l.rendered){const a=this._shadowRoot;if(l.renderedMode==="svg")try{a.lastChild.setCurrentTime(0);return}catch{}on(a,l)}}get status(){const l=this._state;return l.rendered?"rendered":l.icon.data===null?"failed":"loading"}_queueCheck(){this._checkQueued||(this._checkQueued=!0,setTimeout(()=>{this._check()}))}_check(){if(!this._checkQueued)return;this._checkQueued=!1;const l=this._state,a=this.getAttribute("icon");if(a!==l.icon.value){this._iconChanged(a);return}if(!l.rendered||!this._visible)return;const c=this.getAttribute("mode"),d=Fi(this);(l.attrMode!==c||Xr(l.customisations,d)||!ni(this._shadowRoot))&&this._renderIcon(l.icon,d,c)}_iconChanged(l){const a=Es(l,(c,d,u)=>{const p=this._state;if(p.rendered||this.getAttribute("icon")!==c)return;const b={value:c,name:d,data:u};b.data?this._gotIconData(b):p.icon=b});a.data?this._gotIconData(a):this._state=rn(a,this._state.inline,this._state)}_forceRender(){if(!this._visible){const l=ni(this._shadowRoot);l&&this._shadowRoot.removeChild(l);return}this._queueCheck()}_gotIconData(l){this._checkQueued=!1,this._renderIcon(l,Fi(this),this.getAttribute("mode"))}_renderIcon(l,a,c){const d=Cs(l.data.body,c),u=this._state.inline;on(this._shadowRoot,this._state={rendered:!0,icon:l,inline:u,customisations:a,attrMode:c,renderedMode:d})}startObserver(){if(!this._observer)try{this._observer=new IntersectionObserver(l=>{const a=l.some(c=>c.isIntersecting);a!==this._visible&&(this._visible=a,this._forceRender())}),this._observer.observe(this)}catch{if(this._observer){try{this._observer.disconnect()}catch{}this._observer=null}}}stopObserver(){this._observer&&(this._observer.disconnect(),this._observer=null,this._visible=!0,this._connected&&this._forceRender())}};n.forEach(l=>{l in r.prototype||Object.defineProperty(r.prototype,l,{get:function(){return this.getAttribute(l)},set:function(a){a!==null?this.setAttribute(l,a):this.removeAttribute(l)}})});const s=eo();for(const l in s)r[l]=r.prototype[l]=s[l];return t.define(i,r),r}Gs()||eo();const Qs=E`
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
`,Js=E`
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
`,lt={scrollbar:Qs,globalStyles:Js},no=class _{static set config(t){this._config={..._._config,...t}}static get config(){return _._config}static addGlobalStyles(){let t=document.querySelector("style[id='bim-ui']");if(t)return;t=document.createElement("style"),t.id="bim-ui",t.textContent=lt.globalStyles.cssText;const e=document.head.firstChild;e?document.head.insertBefore(t,e):document.head.append(t)}static defineCustomElement(t,e){customElements.get(t)||customElements.define(t,e)}static registerComponents(){_.init()}static init(){_.addGlobalStyles(),_.defineCustomElement("bim-button",el),_.defineCustomElement("bim-checkbox",Mt),_.defineCustomElement("bim-color-input",mt),_.defineCustomElement("bim-context-menu",oi),_.defineCustomElement("bim-dropdown",X),_.defineCustomElement("bim-grid",_i),_.defineCustomElement("bim-icon",hl),_.defineCustomElement("bim-input",ce),_.defineCustomElement("bim-label",Bt),_.defineCustomElement("bim-number-input",L),_.defineCustomElement("bim-option",T),_.defineCustomElement("bim-panel",gt),_.defineCustomElement("bim-panel-section",Ht),_.defineCustomElement("bim-selector",It),_.defineCustomElement("bim-table",I),_.defineCustomElement("bim-tabs",yt),_.defineCustomElement("bim-tab",M),_.defineCustomElement("bim-table-cell",xo),_.defineCustomElement("bim-table-children",$o),_.defineCustomElement("bim-table-group",Co),_.defineCustomElement("bim-table-row",vt),_.defineCustomElement("bim-text-input",G),_.defineCustomElement("bim-toolbar",Ie),_.defineCustomElement("bim-toolbar-group",Be),_.defineCustomElement("bim-toolbar-section",Dt),_.defineCustomElement("bim-viewport",Ro)}static newRandomId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let e="";for(let o=0;o<10;o++){const n=Math.floor(Math.random()*t.length);e+=t.charAt(n)}return e}};no._config={sectionLabelOnVerticalToolbar:!1};let oo=no;class ro extends w{constructor(){super(...arguments),this._lazyLoadObserver=null,this._visibleElements=[],this.ELEMENTS_BEFORE_OBSERVER=20,this.useObserver=!1,this.elements=new Set,this.observe=t=>{if(!this.useObserver)return;for(const o of t)this.elements.add(o);const e=t.slice(this.ELEMENTS_BEFORE_OBSERVER);for(const o of e)o.remove();this.observeLastElement()}}set visibleElements(t){this._visibleElements=this.useObserver?t:[],this.requestUpdate()}get visibleElements(){return this._visibleElements}getLazyObserver(){if(!this.useObserver)return null;if(this._lazyLoadObserver)return this._lazyLoadObserver;const t=new IntersectionObserver(e=>{const o=e[0];if(!o.isIntersecting)return;const n=o.target;t.unobserve(n);const r=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length,s=[...this.elements][r];s&&(this.visibleElements=[...this.visibleElements,s],t.observe(s))},{threshold:.5});return t}observeLastElement(){const t=this.getLazyObserver();if(!t)return;const e=this.ELEMENTS_BEFORE_OBSERVER+this.visibleElements.length-1,o=[...this.elements][e];o&&t.observe(o)}resetVisibleElements(){const t=this.getLazyObserver();if(t){for(const e of this.elements)t.unobserve(e);this.visibleElements=[],this.observeLastElement()}}static create(t,e){const o=document.createDocumentFragment();if(t.length===0)return zt(t(),o),o.firstElementChild;if(!e)throw new Error("UIComponent: Initial state is required for statefull components.");let n=e;const r=t,s=a=>(n={...n,...a},zt(r(n),o),n);s(e);const l=()=>n;return[o.firstElementChild,s,l]}}var Xs=Object.defineProperty,Ks=Object.getOwnPropertyDescriptor,so=(i,t,e,o)=>{for(var n=Ks(t,e),r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&Xs(t,e,n),n},O;const yi=(O=class extends w{constructor(){super(...arguments),this._previousContainer=null,this._visible=!1}get placement(){return this._placement}set placement(i){this._placement=i,this.updatePosition()}static removeMenus(){for(const i of O.menus)i instanceof O&&(i.visible=!1);O.dialog.close(),O.dialog.remove()}get visible(){return this._visible}set visible(i){var t;this._visible=i,i?(O.dialog.parentElement||document.body.append(O.dialog),this._previousContainer=this.parentElement,O.dialog.style.top=`${window.scrollY||document.documentElement.scrollTop}px`,O.dialog.append(this),O.dialog.showModal(),this.updatePosition(),this.dispatchEvent(new Event("visible"))):((t=this._previousContainer)==null||t.append(this),this._previousContainer=null,this.dispatchEvent(new Event("hidden")))}async updatePosition(){if(!(this.visible&&this._previousContainer))return;const i=this.placement??"right",t=await An(this._previousContainer,this,{placement:i,middleware:[fn(10),Sn(),kn(),Cn({padding:5})]}),{x:e,y:o}=t;this.style.left=`${e}px`,this.style.top=`${o}px`}connectedCallback(){super.connectedCallback(),O.menus.push(this)}render(){return f` <slot></slot> `}},O.styles=[lt.scrollbar,E`
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
    `],O.dialog=ro.create(()=>f` <dialog
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
    ></dialog>`),O.menus=[],O);so([h({type:String,reflect:!0})],yi.prototype,"placement");so([h({type:Boolean,reflect:!0})],yi.prototype,"visible");let oi=yi;var Zs=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,D=(i,t,e,o)=>{for(var n=o>1?void 0:o?tl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Zs(t,e,n),n},qt;const B=(qt=class extends w{constructor(){super(),this.labelHidden=!1,this.active=!1,this.disabled=!1,this.vertical=!1,this.tooltipVisible=!1,this._stateBeforeLoading={disabled:!1,icon:""},this._loading=!1,this._parent=jt(),this._tooltip=jt(),this._mouseLeave=!1,this.onClick=i=>{i.stopPropagation(),this.disabled||this.dispatchEvent(new Event("click"))},this.showContextMenu=()=>{const i=this._contextMenu;if(i){const t=this.getAttribute("data-context-group");t&&i.setAttribute("data-context-group",t),this.closeNestedContexts();const e=oo.newRandomId();for(const o of i.children)o instanceof qt&&o.setAttribute("data-context-group",e);i.visible=!0}},this.mouseLeave=!0}set loading(i){if(this._loading=i,i)this._stateBeforeLoading={disabled:this.disabled,icon:this.icon},this.disabled=i,this.icon="eos-icons:loading";else{const{disabled:t,icon:e}=this._stateBeforeLoading;this.disabled=t,this.icon=e}}get loading(){return this._loading}set mouseLeave(i){this._mouseLeave=i,i&&(this.tooltipVisible=!1,clearTimeout(this.timeoutID))}get mouseLeave(){return this._mouseLeave}computeTooltipPosition(){const{value:i}=this._parent,{value:t}=this._tooltip;i&&t&&An(i,t,{placement:"bottom",middleware:[fn(10),Sn(),kn(),Cn({padding:5})]}).then(e=>{const{x:o,y:n}=e;Object.assign(t.style,{left:`${o}px`,top:`${n}px`})})}onMouseEnter(){if(!(this.tooltipTitle||this.tooltipText))return;this.mouseLeave=!1;const i=this.tooltipTime??700;this.timeoutID=setTimeout(()=>{this.mouseLeave||(this.computeTooltipPosition(),this.tooltipVisible=!0)},i)}closeNestedContexts(){const i=this.getAttribute("data-context-group");if(i)for(const t of oi.dialog.children){const e=t.getAttribute("data-context-group");if(t instanceof oi&&e===i){t.visible=!1,t.removeAttribute("data-context-group");for(const o of t.children)o instanceof qt&&(o.closeNestedContexts(),o.removeAttribute("data-context-group"))}}}click(){this.disabled||super.click()}get _contextMenu(){return this.querySelector("bim-context-menu")}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.showContextMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.showContextMenu)}render(){const i=f`
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
        ${this.tooltipTitle||this.tooltipText?i:null}
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
  `,qt);D([h({type:String,reflect:!0})],B.prototype,"label",2);D([h({type:Boolean,attribute:"label-hidden",reflect:!0})],B.prototype,"labelHidden",2);D([h({type:Boolean,reflect:!0})],B.prototype,"active",2);D([h({type:Boolean,reflect:!0,attribute:"disabled"})],B.prototype,"disabled",2);D([h({type:String,reflect:!0})],B.prototype,"icon",2);D([h({type:Boolean,reflect:!0})],B.prototype,"vertical",2);D([h({type:Number,attribute:"tooltip-time",reflect:!0})],B.prototype,"tooltipTime",2);D([h({type:Boolean,attribute:"tooltip-visible",reflect:!0})],B.prototype,"tooltipVisible",2);D([h({type:String,attribute:"tooltip-title",reflect:!0})],B.prototype,"tooltipTitle",2);D([h({type:String,attribute:"tooltip-text",reflect:!0})],B.prototype,"tooltipText",2);D([h({type:Boolean,reflect:!0})],B.prototype,"loading",1);let el=B;var il=Object.defineProperty,ae=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&il(t,e,n),n};const lo=class extends w{constructor(){super(...arguments),this.checked=!1,this.inverted=!1,this.onValueChange=new Event("change")}get value(){return this.checked}onChange(t){t.stopPropagation(),this.checked=t.target.checked,this.dispatchEvent(this.onValueChange)}render(){return f`
      <div class="parent">
        ${this.label?f`<bim-label .icon="${this.icon}">${this.label}</bim-label> `:null}
        <input
          type="checkbox"
          aria-label=${this.label||this.name||"Checkbox Input"}
          @change="${this.onChange}"
          .checked="${this.checked}"
        />
      </div>
    `}};lo.styles=E`
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
  `;let Mt=lo;ae([h({type:String,reflect:!0})],Mt.prototype,"icon");ae([h({type:String,reflect:!0})],Mt.prototype,"name");ae([h({type:String,reflect:!0})],Mt.prototype,"label");ae([h({type:Boolean,reflect:!0})],Mt.prototype,"checked");ae([h({type:Boolean,reflect:!0})],Mt.prototype,"inverted");var nl=Object.defineProperty,Rt=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&nl(t,e,n),n};const ao=class extends w{constructor(){super(...arguments),this.vertical=!1,this.color="#bcf124",this._colorInput=jt(),this._textInput=jt(),this.onValueChange=new Event("input"),this.onOpacityInput=t=>{const e=t.target;this.opacity=e.value,this.dispatchEvent(this.onValueChange)}}set value(t){const{color:e,opacity:o}=t;this.color=e,o&&(this.opacity=o)}get value(){const t={color:this.color};return this.opacity&&(t.opacity=this.opacity),t}onColorInput(t){t.stopPropagation();const{value:e}=this._colorInput;e&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}onTextInput(t){t.stopPropagation();const{value:e}=this._textInput;if(!e)return;const{value:o}=e;let n=o.replace(/[^a-fA-F0-9]/g,"");n.startsWith("#")||(n=`#${n}`),e.value=n.slice(0,7),e.value.length===7&&(this.color=e.value,this.dispatchEvent(this.onValueChange))}focus(){const{value:t}=this._colorInput;t&&t.click()}render(){return f`
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
    `}};ao.styles=E`
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
  `;let mt=ao;Rt([h({type:String,reflect:!0})],mt.prototype,"name");Rt([h({type:String,reflect:!0})],mt.prototype,"label");Rt([h({type:String,reflect:!0})],mt.prototype,"icon");Rt([h({type:Boolean,reflect:!0})],mt.prototype,"vertical");Rt([h({type:Number,reflect:!0})],mt.prototype,"opacity");Rt([h({type:String,reflect:!0})],mt.prototype,"color");const Se=(i,t={},e=!0)=>{let o={};for(const n of i.children){const r=n,s=r.getAttribute("name")||r.getAttribute("label"),l=t[s];if(s){if("value"in r&&typeof r.value<"u"&&r.value!==null){const a=r.value;if(typeof a=="object"&&!Array.isArray(a)&&Object.keys(a).length===0)continue;o[s]=l?l(r.value):r.value}else if(e){const a=Se(r,t);if(Object.keys(a).length===0)continue;o[s]=l?l(a):a}}else e&&(o={...o,...Se(r,t)})}return o},Le=i=>i==="true"||i==="false"?i==="true":i&&!isNaN(Number(i))&&i.trim()!==""?Number(i):i,ol=[">=","<=","=",">","<","?","/","#"];function sn(i){const t=ol.find(s=>i.split(s).length===2),e=i.split(t).map(s=>s.trim()),[o,n]=e,r=n.startsWith("'")&&n.endsWith("'")?n.replace(/'/g,""):Le(n);return{key:o,condition:t,value:r}}const ri=i=>{try{const t=[],e=i.split(/&(?![^()]*\))/).map(o=>o.trim());for(const o of e){const n=!o.startsWith("(")&&!o.endsWith(")"),r=o.startsWith("(")&&o.endsWith(")");if(n){const s=sn(o);t.push(s)}if(r){const s={operator:"&",queries:o.replace(/^(\()|(\))$/g,"").split("&").map(l=>l.trim()).map((l,a)=>{const c=sn(l);return a>0&&(c.operator="&"),c})};t.push(s)}}return t}catch{return null}},ln=(i,t,e)=>{let o=!1;switch(t){case"=":o=i===e;break;case"?":o=String(i).includes(String(e));break;case"<":(typeof i=="number"||typeof e=="number")&&(o=i<e);break;case"<=":(typeof i=="number"||typeof e=="number")&&(o=i<=e);break;case">":(typeof i=="number"||typeof e=="number")&&(o=i>e);break;case">=":(typeof i=="number"||typeof e=="number")&&(o=i>=e);break;case"/":o=String(i).startsWith(String(e));break}return o};var rl=Object.defineProperty,sl=Object.getOwnPropertyDescriptor,at=(i,t,e,o)=>{for(var n=o>1?void 0:o?sl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&rl(t,e,n),n};const co=class extends w{constructor(){super(...arguments),this.checked=!1,this.checkbox=!1,this.noMark=!1,this.vertical=!1}get value(){return this._value!==void 0?this._value:this.label?Le(this.label):this.label}set value(t){this._value=t}render(){return f`
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
    `}};co.styles=E`
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
  `;let T=co;at([h({type:String,reflect:!0})],T.prototype,"img",2);at([h({type:String,reflect:!0})],T.prototype,"label",2);at([h({type:String,reflect:!0})],T.prototype,"icon",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checked",2);at([h({type:Boolean,reflect:!0})],T.prototype,"checkbox",2);at([h({type:Boolean,attribute:"no-mark",reflect:!0})],T.prototype,"noMark",2);at([h({converter:{fromAttribute(i){return i&&Le(i)}}})],T.prototype,"value",1);at([h({type:Boolean,reflect:!0})],T.prototype,"vertical",2);var ll=Object.defineProperty,al=Object.getOwnPropertyDescriptor,ct=(i,t,e,o)=>{for(var n=o>1?void 0:o?al(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&ll(t,e,n),n};const ho=class extends ro{constructor(){super(),this.multiple=!1,this.required=!1,this.vertical=!1,this._visible=!1,this._value=new Set,this.onValueChange=new Event("change"),this._contextMenu=jt(),this.onOptionClick=t=>{const e=t.target,o=this._value.has(e);if(!this.multiple&&!this.required&&!o)this._value=new Set([e]);else if(!this.multiple&&!this.required&&o)this._value=new Set([]);else if(!this.multiple&&this.required&&!o)this._value=new Set([e]);else if(this.multiple&&!this.required&&!o)this._value=new Set([...this._value,e]);else if(this.multiple&&!this.required&&o){const n=[...this._value].filter(r=>r!==e);this._value=new Set(n)}else if(this.multiple&&this.required&&!o)this._value=new Set([...this._value,e]);else if(this.multiple&&this.required&&o){const n=[...this._value].filter(s=>s!==e),r=new Set(n);r.size!==0&&(this._value=r)}this.updateOptionsState(),this.dispatchEvent(this.onValueChange)},this.useObserver=!0}set visible(t){if(t){const{value:e}=this._contextMenu;if(!e)return;for(const o of this.elements)e.append(o);this._visible=!0}else{for(const e of this.elements)this.append(e);this._visible=!1,this.resetVisibleElements()}}get visible(){return this._visible}set value(t){if(this.required&&Object.keys(t).length===0)return;const e=new Set;for(const o of t){const n=this.findOption(o);if(n&&(e.add(n),!this.multiple&&Object.keys(t).length===1))break}this._value=e,this.updateOptionsState(),this.dispatchEvent(this.onValueChange)}get value(){return[...this._value].filter(t=>t instanceof T&&t.checked).map(t=>t.value)}get _options(){const t=new Set([...this.elements]);for(const e of this.children)e instanceof T&&t.add(e);return[...t]}onSlotChange(t){const e=t.target.assignedElements();this.observe(e);const o=new Set;for(const n of this.elements){if(!(n instanceof T)){n.remove();continue}n.checked&&o.add(n),n.removeEventListener("click",this.onOptionClick),n.addEventListener("click",this.onOptionClick)}this._value=o}updateOptionsState(){for(const t of this._options)t instanceof T&&(t.checked=this._value.has(t))}findOption(t){return this._options.find(e=>e instanceof T?e.label===t||e.value===t:!1)}render(){let t,e,o;if(this._value.size===0)t="Select an option...";else if(this._value.size===1){const n=[...this._value][0];t=(n==null?void 0:n.label)||(n==null?void 0:n.value),e=n==null?void 0:n.img,o=n==null?void 0:n.icon}else t=`Multiple (${this._value.size})`;return f`
      <bim-input
        title=${this.label??""}
        .label=${this.label}
        .icon=${this.icon}
        .vertical=${this.vertical}
      >
        <div class="input" @click=${()=>this.visible=!this.visible}>
          <bim-label
            .img=${e}
            .icon=${o}
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
    `}};ho.styles=[lt.scrollbar,E`
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
    `];let X=ho;ct([h({type:String,reflect:!0})],X.prototype,"name",2);ct([h({type:String,reflect:!0})],X.prototype,"icon",2);ct([h({type:String,reflect:!0})],X.prototype,"label",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"multiple",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"required",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"vertical",2);ct([h({type:Boolean,reflect:!0})],X.prototype,"visible",1);ct([Lt()],X.prototype,"_value",2);var cl=Object.defineProperty,uo=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&cl(t,e,n),n};const po=class extends w{constructor(){super(...arguments),this.floating=!1,this.layouts={}}getUniqueAreasFromTemplate(t){const e=t.split(`
`).map(o=>o.trim()).map(o=>o.split('"')[1]).filter(o=>o!==void 0).flatMap(o=>o.split(/\s+/));return[...new Set(e)].filter(o=>o!=="")}firstUpdated(){this._onLayoutChange=new Event("layoutchange")}render(){if(this.layout){if(this.layouts[this.layout]){this.innerHTML="";const t=this.layouts[this.layout],e=this.getUniqueAreasFromTemplate(t.template).map(o=>{const n=t.elements[o];return n&&(n.style.gridArea=o),n}).filter(o=>!!o);this.style.gridTemplate=t.template,this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange),this.append(...e)}}else this.innerHTML="",this.style.gridTemplate="",this._onLayoutChange&&this.dispatchEvent(this._onLayoutChange);return f`<slot></slot>`}};po.styles=E`
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
  `;let _i=po;uo([h({type:Boolean,reflect:!0})],_i.prototype,"floating");uo([h({type:String,reflect:!0})],_i.prototype,"layout");const si=class extends w{render(){return f`
      <iconify-icon .icon=${this.icon} height="none"></iconify-icon>
    `}};si.styles=E`
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
  `,si.properties={icon:{type:String}};let hl=si;var dl=Object.defineProperty,Me=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&dl(t,e,n),n};const bo=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change")}get value(){const t={};for(const e of this.children){const o=e;"value"in o?t[o.name||o.label]=o.value:"checked"in o&&(t[o.name||o.label]=o.checked)}return t}set value(t){const e=[...this.children];for(const o in t){const n=e.find(l=>{const a=l;return a.name===o||a.label===o});if(!n)continue;const r=n,s=t[o];typeof s=="boolean"?r.checked=s:r.value=s}}render(){return f`
      <div class="parent">
        ${this.label||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="input">
          <slot></slot>
        </div>
      </div>
    `}};bo.styles=E`
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
  `;let ce=bo;Me([h({type:String,reflect:!0})],ce.prototype,"name");Me([h({type:String,reflect:!0})],ce.prototype,"label");Me([h({type:String,reflect:!0})],ce.prototype,"icon");Me([h({type:Boolean,reflect:!0})],ce.prototype,"vertical");var ul=Object.defineProperty,he=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&ul(t,e,n),n};const fo=class extends w{constructor(){super(...arguments),this.labelHidden=!1,this.iconHidden=!1,this.vertical=!1}get value(){return this.textContent?Le(this.textContent):this.textContent}render(){return f`
      <div class="parent" .title=${this.textContent??""}>
        ${this.img?f`<img .src=${this.img} .alt=${this.textContent||""} />`:null}
        ${!this.iconHidden&&this.icon?f`<bim-icon .icon=${this.icon}></bim-icon>`:null}
        <p><slot></slot></p>
      </div>
    `}};fo.styles=E`
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
  `;let Bt=fo;he([h({type:String,reflect:!0})],Bt.prototype,"img");he([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Bt.prototype,"labelHidden");he([h({type:String,reflect:!0})],Bt.prototype,"icon");he([h({type:Boolean,attribute:"icon-hidden",reflect:!0})],Bt.prototype,"iconHidden");he([h({type:Boolean,reflect:!0})],Bt.prototype,"vertical");var pl=Object.defineProperty,bl=Object.getOwnPropertyDescriptor,H=(i,t,e,o)=>{for(var n=o>1?void 0:o?bl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&pl(t,e,n),n};const mo=class extends w{constructor(){super(...arguments),this._value=0,this.vertical=!1,this.slider=!1,this._input=jt(),this.onValueChange=new Event("change")}set value(t){this.setValue(t.toString())}get value(){return this._value}onChange(t){t.stopPropagation();const{value:e}=this._input;e&&this.setValue(e.value)}setValue(t){const{value:e}=this._input;let o=t;if(o=o.replace(/[^0-9.-]/g,""),o=o.replace(/(\..*)\./g,"$1"),o.endsWith(".")||(o.lastIndexOf("-")>0&&(o=o[0]+o.substring(1).replace(/-/g,"")),o==="-"||o==="-0"))return;let n=Number(o);Number.isNaN(n)||(n=this.min!==void 0?Math.max(n,this.min):n,n=this.max!==void 0?Math.min(n,this.max):n,this.value!==n&&(this._value=n,e&&(e.value=this.value.toString()),this.requestUpdate(),this.dispatchEvent(this.onValueChange)))}onBlur(){const{value:t}=this._input;t&&Number.isNaN(Number(t.value))&&(t.value=this.value.toString())}onSliderMouseDown(t){document.body.style.cursor="w-resize";const{clientX:e}=t,o=this.value;let n=!1;const r=a=>{var c;n=!0;const{clientX:d}=a,u=this.step??1,p=((c=u.toString().split(".")[1])==null?void 0:c.length)||0,b=1/(this.sensitivity??1),m=(d-e)/b;if(Math.floor(Math.abs(m))!==Math.abs(m))return;const v=o+m*u;this.setValue(v.toFixed(p))},s=()=>{this.slider=!0,this.removeEventListener("blur",s)},l=()=>{document.removeEventListener("mousemove",r),document.body.style.cursor="default",n?n=!1:(this.addEventListener("blur",s),this.slider=!1,requestAnimationFrame(()=>this.focus())),document.removeEventListener("mouseup",l)};document.addEventListener("mousemove",r),document.addEventListener("mouseup",l)}onFocus(t){t.stopPropagation();const e=o=>{o.key==="Escape"&&(this.blur(),window.removeEventListener("keydown",e))};window.addEventListener("keydown",e)}connectedCallback(){super.connectedCallback(),this.min&&this.min>this.value&&(this._value=this.min),this.max&&this.max<this.value&&(this._value=this.max)}focus(){const{value:t}=this._input;t&&t.focus()}render(){const t=f`
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
    `,e=this.min??-1/0,o=this.max??1/0,n=100*(this.value-e)/(o-e),r=f`
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
        ${this.slider?r:t}
      </bim-input>
    `}};mo.styles=E`
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
  `;let L=mo;H([h({type:String,reflect:!0})],L.prototype,"name",2);H([h({type:String,reflect:!0})],L.prototype,"icon",2);H([h({type:String,reflect:!0})],L.prototype,"label",2);H([h({type:String,reflect:!0})],L.prototype,"pref",2);H([h({type:Number,reflect:!0})],L.prototype,"min",2);H([h({type:Number,reflect:!0})],L.prototype,"value",1);H([h({type:Number,reflect:!0})],L.prototype,"step",2);H([h({type:Number,reflect:!0})],L.prototype,"sensitivity",2);H([h({type:Number,reflect:!0})],L.prototype,"max",2);H([h({type:String,reflect:!0})],L.prototype,"suffix",2);H([h({type:Boolean,reflect:!0})],L.prototype,"vertical",2);H([h({type:Boolean,reflect:!0})],L.prototype,"slider",2);var fl=Object.defineProperty,ml=Object.getOwnPropertyDescriptor,de=(i,t,e,o)=>{for(var n=o>1?void 0:o?ml(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&fl(t,e,n),n};const go=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this._hidden=!1,this.headerHidden=!1,this.valueTransform={},this.activationButton=document.createElement("bim-button")}set hidden(t){this._hidden=t,this.activationButton.active=!t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}get value(){return Se(this,this.valueTransform)}set value(t){const e=[...this.children];for(const o in t){const n=e.find(s=>{const l=s;return l.name===o||l.label===o});if(!n)continue;const r=n;r.value=t[o]}}connectedCallback(){super.connectedCallback(),this.activationButton.active=!this.hidden,this.activationButton.onclick=()=>this.hidden=!this.hidden}disconnectedCallback(){super.disconnectedCallback(),this.activationButton.remove()}collapseSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!0}expandSections(){const t=this.querySelectorAll("bim-panel-section");for(const e of t)e.collapsed=!1}render(){return this.activationButton.icon=this.icon,this.activationButton.label=this.label||this.name,this.activationButton.tooltipTitle=this.label||this.name,f`
      <div class="parent">
        ${this.label||this.name||this.icon?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
        <div class="sections">
          <slot></slot>
        </div>
      </div>
    `}};go.styles=[lt.scrollbar,E`
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
    `];let gt=go;de([h({type:String,reflect:!0})],gt.prototype,"icon",2);de([h({type:String,reflect:!0})],gt.prototype,"name",2);de([h({type:String,reflect:!0})],gt.prototype,"label",2);de([h({type:Boolean,reflect:!0})],gt.prototype,"hidden",1);de([h({type:Boolean,attribute:"header-hidden",reflect:!0})],gt.prototype,"headerHidden",2);var gl=Object.defineProperty,ue=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&gl(t,e,n),n};const vo=class extends w{constructor(){super(...arguments),this.onValueChange=new Event("change"),this.valueTransform={}}get value(){const t=this.parentElement;let e;return t instanceof gt&&(e=t.valueTransform),Object.values(this.valueTransform).length!==0&&(e=this.valueTransform),Se(this,e)}set value(t){const e=[...this.children];for(const o in t){const n=e.find(s=>{const l=s;return l.name===o||l.label===o});if(!n)continue;const r=n;r.value=t[o]}}onHeaderClick(){this.fixed||(this.collapsed=!this.collapsed)}render(){const t=this.label||this.icon||this.name||this.fixed,e=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>`,o=f`<svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.125rem"
      viewBox="0 0 24 24"
      width="1.125rem"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
    </svg>`,n=this.collapsed?e:o,r=f`
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
        ${t?r:null}
        <div class="components">
          <slot></slot>
        </div>
      </div>
    `}};vo.styles=[lt.scrollbar,E`
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
    `];let Ht=vo;ue([h({type:String,reflect:!0})],Ht.prototype,"icon");ue([h({type:String,reflect:!0})],Ht.prototype,"label");ue([h({type:String,reflect:!0})],Ht.prototype,"name");ue([h({type:Boolean,reflect:!0})],Ht.prototype,"fixed");ue([h({type:Boolean,reflect:!0})],Ht.prototype,"collapsed");var vl=Object.defineProperty,pe=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&vl(t,e,n),n};const yo=class extends w{constructor(){super(...arguments),this.vertical=!1,this.onValueChange=new Event("change"),this._canEmitEvents=!1,this._value=document.createElement("bim-option"),this.onOptionClick=t=>{this._value=t.target,this.dispatchEvent(this.onValueChange);for(const e of this.children)e instanceof T&&(e.checked=e===t.target)}}get _options(){return[...this.querySelectorAll("bim-option")]}set value(t){const e=this.findOption(t);if(e){for(const o of this._options)o.checked=o===e;this._value=e,this._canEmitEvents&&this.dispatchEvent(this.onValueChange)}}get value(){return this._value.value}onSlotChange(t){const e=t.target.assignedElements();for(const o of e)o instanceof T&&(o.noMark=!0,o.removeEventListener("click",this.onOptionClick),o.addEventListener("click",this.onOptionClick))}findOption(t){return this._options.find(e=>e instanceof T?e.label===t||e.value===t:!1)}firstUpdated(){const t=[...this.children].find(e=>e instanceof T&&e.checked);t&&(this._value=t)}render(){return f`
      <bim-input
        .vertical=${this.vertical}
        .label=${this.label}
        .icon=${this.icon}
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </bim-input>
    `}};yo.styles=E`
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
  `;let It=yo;pe([h({type:String,reflect:!0})],It.prototype,"name");pe([h({type:String,reflect:!0})],It.prototype,"icon");pe([h({type:String,reflect:!0})],It.prototype,"label");pe([h({type:Boolean,reflect:!0})],It.prototype,"vertical");pe([Lt()],It.prototype,"_value");const yl=()=>f`
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
  `,_l=()=>f`
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
  `;var xl=Object.defineProperty,wl=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&xl(t,e,n),n};const _o=class extends w{constructor(){super(...arguments),this.column="",this.columnIndex=0,this.rowData={}}get data(){return this.column?this.rowData[this.column]:null}render(){return f`
      <style>
        :host {
          grid-area: ${this.column??"unset"};
        }
      </style>
      <slot></slot>
    `}};_o.styles=E`
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
  `;let xo=_o;wl([h({type:String,reflect:!0})],xo.prototype,"column");var $l=Object.defineProperty,El=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&$l(t,e,n),n};const wo=class extends w{constructor(){super(...arguments),this._groups=[],this.data=[],this.table=this.closest("bim-table")}toggleGroups(t,e=!1){for(const o of this._groups)o.childrenHidden=typeof t>"u"?!o.childrenHidden:!t,e&&o.toggleChildren(t,e)}render(){return this._groups=[],f`
      <slot></slot>
      ${this.data.map(t=>{const e=document.createElement("bim-table-group");return this._groups.push(e),e.table=this.table,e.data=t,e})}
    `}};wo.styles=E`
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
  `;let $o=wo;El([h({type:Array,attribute:!1})],$o.prototype,"data");var Cl=Object.defineProperty,kl=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&Cl(t,e,n),n};const Eo=class extends w{constructor(){super(...arguments),this.data={data:{}},this.childrenHidden=!0,this.table=this.closest("bim-table")}connectedCallback(){super.connectedCallback(),this.table&&this.table.expanded?this.childrenHidden=!1:this.childrenHidden=!0}toggleChildren(t,e=!1){this._children&&(this.childrenHidden=typeof t>"u"?!this.childrenHidden:!t,e&&this._children.toggleGroups(t,e))}render(){if(!this.table)throw new Error("TableGroup: parent table wasn't found!");const t=this.table.getGroupIndentation(this.data)??0,e=f`
      ${this.table.noIndentation?null:f`
            <style>
              .branch-vertical {
                left: ${t+(this.table.selectableRows?1.9375:.5625)}rem;
              }
            </style>
            <div class="branch branch-vertical"></div>
          `}
    `,o=document.createDocumentFragment();zt(e,o);let n=null;this.table.noIndentation||(n=document.createElement("div"),n.classList.add("branch","branch-horizontal"),n.style.left=`${t-1+(this.table.selectableRows?2.05:.5625)}rem`);let r=null;if(!this.table.noIndentation){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.setAttribute("height","9.5"),a.setAttribute("width","7.5"),a.setAttribute("viewBox","0 0 4.6666672 7.3333333");const c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("d","m 1.7470835,6.9583848 2.5899999,-2.59 c 0.39,-0.39 0.39,-1.02 0,-1.41 L 1.7470835,0.36838483 c -0.63,-0.62000003 -1.71000005,-0.18 -1.71000005,0.70999997 v 5.17 c 0,0.9 1.08000005,1.34 1.71000005,0.71 z"),a.append(c);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("height","6.5"),d.setAttribute("width","9.5"),d.setAttribute("viewBox","0 0 5.9111118 5.0175439");const u=document.createElementNS("http://www.w3.org/2000/svg","path");u.setAttribute("d","M -0.33616196,1.922522 2.253838,4.5125219 c 0.39,0.39 1.02,0.39 1.41,0 L 6.2538379,1.922522 c 0.6200001,-0.63 0.18,-1.71000007 -0.7099999,-1.71000007 H 0.37383804 c -0.89999997,0 -1.33999997,1.08000007 -0.71,1.71000007 z"),d.append(u),r=document.createElement("div"),r.addEventListener("click",p=>{p.stopPropagation(),this.toggleChildren()}),r.classList.add("caret"),r.style.left=`${(this.table.selectableRows?1.5:.125)+t}rem`,this.childrenHidden?r.append(a):r.append(d)}const s=document.createElement("bim-table-row");this.data.children&&!this.childrenHidden&&s.append(o),s.table=this.table,s.data=this.data.data,this.table.dispatchEvent(new CustomEvent("rowcreated",{detail:{row:s}})),r&&this.data.children&&s.append(r),t!==0&&(!this.data.children||this.childrenHidden)&&n&&s.append(n);let l;if(this.data.children){l=document.createElement("bim-table-children"),this._children=l,l.table=this.table,l.data=this.data.children;const a=document.createDocumentFragment();zt(e,a),l.append(a)}return f`
      <div class="parent">${s} ${this.childrenHidden?null:l}</div>
    `}};Eo.styles=E`
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
  `;let Co=Eo;kl([h({type:Boolean,attribute:"children-hidden",reflect:!0})],Co.prototype,"childrenHidden");var Sl=Object.defineProperty,Nt=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&Sl(t,e,n),n};const ko=class extends w{constructor(){super(...arguments),this.selected=!1,this.columns=[],this.hiddenColumns=[],this.data={},this.isHeader=!1,this.table=this.closest("bim-table"),this.onTableColumnsChange=()=>{this.table&&(this.columns=this.table.columns)},this.onTableColumnsHidden=()=>{this.table&&(this.hiddenColumns=this.table.hiddenColumns)},this._observer=new IntersectionObserver(t=>{this._intersecting=t[0].isIntersecting},{rootMargin:"36px"})}get _columnNames(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.name)}get _columnWidths(){return this.columns.filter(t=>!this.hiddenColumns.includes(t.name)).map(t=>t.width)}get _isSelected(){var t;return(t=this.table)==null?void 0:t.selection.has(this.data)}onSelectionChange(t){if(!this.table)return;const e=t.target;this.selected=e.value,e.value?(this.table.selection.add(this.data),this.table.dispatchEvent(new CustomEvent("rowselected",{detail:{data:this.data}}))):(this.table.selection.delete(this.data),this.table.dispatchEvent(new CustomEvent("rowdeselected",{detail:{data:this.data}})))}connectedCallback(){super.connectedCallback(),this._observer.observe(this),this.table&&(this.columns=this.table.columns,this.hiddenColumns=this.table.hiddenColumns,this.table.addEventListener("columnschange",this.onTableColumnsChange),this.table.addEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",this._isSelected))}disconnectedCallback(){super.disconnectedCallback(),this._observer.unobserve(this),this.table&&(this.columns=[],this.hiddenColumns=[],this.table.removeEventListener("columnschange",this.onTableColumnsChange),this.table.removeEventListener("columnshidden",this.onTableColumnsHidden),this.toggleAttribute("selected",!1))}compute(){if(!this.table)throw new Error("TableRow: parent table wasn't found!");const t=this.table.getRowIndentation(this.data)??0,e=this.isHeader?this.data:this.table.applyDataTransform(this.data)??this.data,o=[];for(const n in e){if(this.hiddenColumns.includes(n))continue;const r=e[n];let s;if(typeof r=="string"||typeof r=="boolean"||typeof r=="number"?(s=document.createElement("bim-label"),s.textContent=String(r)):r instanceof HTMLElement?s=r:(s=document.createDocumentFragment(),zt(r,s)),!s)continue;const l=document.createElement("bim-table-cell");l.append(s),l.column=n,this._columnNames.indexOf(n)===0&&(l.style.marginLeft=`${this.table.noIndentation?0:t+.75}rem`);const a=this._columnNames.indexOf(n);l.setAttribute("data-column-index",String(a)),l.toggleAttribute("data-no-indentation",a===0&&this.table.noIndentation),l.toggleAttribute("data-cell-header",this.isHeader),l.rowData=this.data,this.table.dispatchEvent(new CustomEvent("cellcreated",{detail:{cell:l}})),o.push(l)}return this.style.gridTemplateAreas=`"${this.table.selectableRows?"Selection":""} ${this._columnNames.join(" ")}"`,this.style.gridTemplateColumns=`${this.table.selectableRows?"1.6rem":""} ${this._columnWidths.join(" ")}`,f`
      ${!this.isHeader&&this.table.selectableRows?f`<bim-checkbox
            @change=${this.onSelectionChange}
            .checked=${this._isSelected}
            style="align-self: center; justify-self: center"
          ></bim-checkbox>`:null}
      ${o}
      <slot></slot>
    `}render(){return f`${this._intersecting?this.compute():f``}`}};ko.styles=E`
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
  `;let vt=ko;Nt([h({type:Boolean,reflect:!0})],vt.prototype,"selected");Nt([h({attribute:!1})],vt.prototype,"columns");Nt([h({attribute:!1})],vt.prototype,"hiddenColumns");Nt([h({attribute:!1})],vt.prototype,"data");Nt([h({type:Boolean,attribute:"is-header",reflect:!0})],vt.prototype,"isHeader");Nt([Lt()],vt.prototype,"_intersecting");var Al=Object.defineProperty,Ol=Object.getOwnPropertyDescriptor,U=(i,t,e,o)=>{for(var n=o>1?void 0:o?Ol(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Al(t,e,n),n};const So=class extends w{constructor(){super(...arguments),this._columnsChange=new Event("columnschange"),this._filteredData=[],this.headersHidden=!1,this.minColWidth="4rem",this._columns=[],this._textDelimiters={comma:",",tab:"	"},this._queryString=null,this._data=[],this.expanded=!1,this.preserveStructureOnFilter=!1,this.indentationInText=!1,this.dataTransform={},this.selectableRows=!1,this.selection=new Set,this.noIndentation=!1,this.loading=!1,this._errorLoading=!1,this._onColumnsHidden=new Event("columnshidden"),this._hiddenColumns=[],this.loadingErrorElement=null,this._stringFilterFunction=(t,e)=>Object.values(e.data).some(o=>String(o).toLowerCase().includes(t.toLowerCase())),this._queryFilterFunction=(t,e)=>{let o=!1;const n=ri(t)??[];for(const r of n){if("queries"in r){o=!1;break}const{condition:s,value:l}=r;let{key:a}=r;if(a.startsWith("[")&&a.endsWith("]")){const c=a.replace("[","").replace("]","");a=c,o=Object.keys(e.data).filter(d=>d.includes(c)).map(d=>ln(e.data[d],s,l)).some(d=>d)}else o=ln(e.data[a],s,l);if(!o)break}return o}}set columns(t){const e=[];for(const o of t){const n=typeof o=="string"?{name:o,width:`minmax(${this.minColWidth}, 1fr)`}:o;e.push(n)}this._columns=e,this.computeMissingColumns(this.data),this.dispatchEvent(this._columnsChange)}get columns(){return this._columns}get _headerRowData(){const t={};for(const e of this.columns)if(typeof e=="string")t[e]=e;else{const{name:o}=e;t[o]=o}return t}get value(){return this._filteredData}set queryString(t){this.toggleAttribute("data-processing",!0),this._queryString=t&&t.trim()!==""?t.trim():null,this.updateFilteredData(),this.toggleAttribute("data-processing",!1)}get queryString(){return this._queryString}set data(t){this._data=t,this.updateFilteredData(),this.computeMissingColumns(t)&&(this.columns=this._columns)}get data(){return this._data}get dataAsync(){return new Promise(t=>{setTimeout(()=>{t(this.data)})})}set hiddenColumns(t){this._hiddenColumns=t,setTimeout(()=>{this.dispatchEvent(this._onColumnsHidden)})}get hiddenColumns(){return this._hiddenColumns}updateFilteredData(){this.queryString?(ri(this.queryString)?(this.filterFunction=this._queryFilterFunction,this._filteredData=this.filter(this.queryString)):(this.filterFunction=this._stringFilterFunction,this._filteredData=this.filter(this.queryString)),this.preserveStructureOnFilter&&(this._expandedBeforeFilter===void 0&&(this._expandedBeforeFilter=this.expanded),this.expanded=!0)):(this.preserveStructureOnFilter&&this._expandedBeforeFilter!==void 0&&(this.expanded=this._expandedBeforeFilter,this._expandedBeforeFilter=void 0),this._filteredData=this.data)}computeMissingColumns(t){let e=!1;for(const o of t){const{children:n,data:r}=o;for(const s in r)this._columns.map(l=>typeof l=="string"?l:l.name).includes(s)||(this._columns.push({name:s,width:`minmax(${this.minColWidth}, 1fr)`}),e=!0);if(n){const s=this.computeMissingColumns(n);s&&!e&&(e=s)}}return e}generateText(t="comma",e=this.value,o="",n=!0){const r=this._textDelimiters[t];let s="";const l=this.columns.map(a=>a.name);if(n){this.indentationInText&&(s+=`Indentation${r}`);const a=`${l.join(r)}
`;s+=a}for(const[a,c]of e.entries()){const{data:d,children:u}=c,p=this.indentationInText?`${o}${a+1}${r}`:"",b=l.map(v=>d[v]??""),m=`${p}${b.join(r)}
`;s+=m,u&&(s+=this.generateText(t,c.children,`${o}${a+1}.`,!1))}return s}get csv(){return this.generateText("comma")}get tsv(){return this.generateText("tab")}applyDataTransform(t){const e={};for(const o of Object.keys(this.dataTransform)){const n=this.columns.find(r=>r.name===o);n&&n.forceDataTransform&&(o in t||(t[o]=""))}for(const o in t){const n=this.dataTransform[o];n?e[o]=n(t[o],t):e[o]=t[o]}return e}downloadData(t="BIM Table Data",e="json"){let o=null;if(e==="json"&&(o=new File([JSON.stringify(this.value,void 0,2)],`${t}.json`)),e==="csv"&&(o=new File([this.csv],`${t}.csv`)),e==="tsv"&&(o=new File([this.tsv],`${t}.tsv`)),!o)return;const n=document.createElement("a");n.href=URL.createObjectURL(o),n.download=o.name,n.click(),URL.revokeObjectURL(n.href)}getRowIndentation(t,e=this.value,o=0){for(const n of e){if(n.data===t)return o;if(n.children){const r=this.getRowIndentation(t,n.children,o+1);if(r!==null)return r}}return null}getGroupIndentation(t,e=this.value,o=0){for(const n of e){if(n===t)return o;if(n.children){const r=this.getGroupIndentation(t,n.children,o+1);if(r!==null)return r}}return null}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new Event("connected"))}disconnectedCallback(){super.disconnectedCallback(),this.dispatchEvent(new Event("disconnected"))}async loadData(t=!1){if(this._filteredData.length!==0&&!t||!this.loadFunction)return!1;this.loading=!0;try{const e=await this.loadFunction();return this.data=e,this.loading=!1,this._errorLoading=!1,!0}catch(e){return this.loading=!1,this._filteredData.length!==0||(e instanceof Error&&this.loadingErrorElement&&e.message.trim()!==""&&(this.loadingErrorElement.textContent=e.message),this._errorLoading=!0),!1}}filter(t,e=this.filterFunction??this._stringFilterFunction,o=this.data){const n=[];for(const r of o)if(e(t,r)){if(this.preserveStructureOnFilter){const s={data:r.data};if(r.children){const l=this.filter(t,e,r.children);l.length&&(s.children=l)}n.push(s)}else if(n.push({data:r.data}),r.children){const s=this.filter(t,e,r.children);n.push(...s)}}else if(r.children){const s=this.filter(t,e,r.children);this.preserveStructureOnFilter&&s.length?n.push({data:r.data,children:s}):n.push(...s)}return n}get _missingDataElement(){return this.querySelector("[slot='missing-data']")}render(){if(this.loading)return yl();if(this._errorLoading)return f`<slot name="error-loading"></slot>`;if(this._filteredData.length===0&&this._missingDataElement)return f`<slot name="missing-data"></slot>`;const t=document.createElement("bim-table-row");t.table=this,t.isHeader=!0,t.data=this._headerRowData,t.style.gridArea="Header",t.style.position="sticky",t.style.top="0",t.style.zIndex="5";const e=document.createElement("bim-table-children");return e.table=this,e.data=this.value,e.style.gridArea="Body",e.style.backgroundColor="transparent",f`
      <div class="parent">
        ${this.headersHidden?null:t} ${_l()}
        <div style="overflow-x: hidden; grid-area: Body">${e}</div>
      </div>
    `}};So.styles=[lt.scrollbar,E`
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
    `];let I=So;U([Lt()],I.prototype,"_filteredData",2);U([h({type:Boolean,attribute:"headers-hidden",reflect:!0})],I.prototype,"headersHidden",2);U([h({type:String,attribute:"min-col-width",reflect:!0})],I.prototype,"minColWidth",2);U([h({type:Array,attribute:!1})],I.prototype,"columns",1);U([h({type:Array,attribute:!1})],I.prototype,"data",1);U([h({type:Boolean,reflect:!0})],I.prototype,"expanded",2);U([h({type:Boolean,reflect:!0,attribute:"selectable-rows"})],I.prototype,"selectableRows",2);U([h({attribute:!1})],I.prototype,"selection",2);U([h({type:Boolean,attribute:"no-indentation",reflect:!0})],I.prototype,"noIndentation",2);U([h({type:Boolean,reflect:!0})],I.prototype,"loading",2);U([Lt()],I.prototype,"_errorLoading",2);var Tl=Object.defineProperty,zl=Object.getOwnPropertyDescriptor,Re=(i,t,e,o)=>{for(var n=o>1?void 0:o?zl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Tl(t,e,n),n};const Ao=class extends w{constructor(){super(...arguments),this._defaultName="__unnamed__",this.name=this._defaultName,this._hidden=!1}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}connectedCallback(){super.connectedCallback();const{parentElement:t}=this;if(t&&this.name===this._defaultName){const e=[...t.children].indexOf(this);this.name=`${this._defaultName}${e}`}}render(){return f` <slot></slot> `}};Ao.styles=E`
    :host {
      display: block;
      height: 100%;
    }

    :host([hidden]) {
      display: none;
    }
  `;let M=Ao;Re([h({type:String,reflect:!0})],M.prototype,"name",2);Re([h({type:String,reflect:!0})],M.prototype,"label",2);Re([h({type:String,reflect:!0})],M.prototype,"icon",2);Re([h({type:Boolean,reflect:!0})],M.prototype,"hidden",1);var jl=Object.defineProperty,Pl=Object.getOwnPropertyDescriptor,Ft=(i,t,e,o)=>{for(var n=o>1?void 0:o?Pl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&jl(t,e,n),n};const Oo=class extends w{constructor(){super(...arguments),this._switchers=[],this.bottom=!1,this.switchersHidden=!1,this.floating=!1,this.switchersFull=!1,this.onTabHiddenChange=t=>{const e=t.target;e instanceof M&&!e.hidden&&(e.removeEventListener("hiddenchange",this.onTabHiddenChange),this.tab=e.name,e.addEventListener("hiddenchange",this.onTabHiddenChange))}}set tab(t){this._tab=t;const e=[...this.children],o=e.find(n=>n instanceof M&&n.name===t);for(const n of e){if(!(n instanceof M))continue;n.hidden=o!==n;const r=this.getTabSwitcher(n.name);r&&r.toggleAttribute("data-active",!n.hidden)}}get tab(){return this._tab}getTabSwitcher(t){return this._switchers.find(e=>e.getAttribute("data-name")===t)}createSwitchers(){this._switchers=[];for(const t of this.children){if(!(t instanceof M))continue;const e=document.createElement("div");e.addEventListener("click",()=>{this.tab===t.name?this.toggleAttribute("tab",!1):this.tab=t.name}),e.setAttribute("data-name",t.name),e.className="switcher";const o=document.createElement("bim-label");o.textContent=t.label??"",o.icon=t.icon,e.append(o),this._switchers.push(e)}}onSlotChange(t){this.createSwitchers();const e=t.target.assignedElements(),o=e.find(n=>n instanceof M?this.tab?n.name===this.tab:!n.hidden:!1);o&&o instanceof M&&(this.tab=o.name);for(const n of e){if(!(n instanceof M)){n.remove();continue}n.removeEventListener("hiddenchange",this.onTabHiddenChange),o!==n&&(n.hidden=!0),n.addEventListener("hiddenchange",this.onTabHiddenChange)}}render(){return f`
      <div class="parent">
        <div class="switchers">${this._switchers}</div>
        <div class="content">
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `}};Oo.styles=[lt.scrollbar,E`
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
    `];let yt=Oo;Ft([Lt()],yt.prototype,"_switchers",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"bottom",2);Ft([h({type:Boolean,attribute:"switchers-hidden",reflect:!0})],yt.prototype,"switchersHidden",2);Ft([h({type:Boolean,reflect:!0})],yt.prototype,"floating",2);Ft([h({type:String,reflect:!0})],yt.prototype,"tab",1);Ft([h({type:Boolean,attribute:"switchers-full",reflect:!0})],yt.prototype,"switchersFull",2);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const an=i=>i??A;var Ll=Object.defineProperty,Ml=Object.getOwnPropertyDescriptor,K=(i,t,e,o)=>{for(var n=o>1?void 0:o?Ml(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Ll(t,e,n),n};const To=class extends w{constructor(){super(...arguments),this._inputTypes=["date","datetime-local","email","month","password","search","tel","text","time","url","week","area"],this.value="",this.vertical=!1,this._type="text",this.onValueChange=new Event("input")}set type(t){this._inputTypes.includes(t)&&(this._type=t)}get type(){return this._type}get query(){return ri(this.value)}onInputChange(t){t.stopPropagation();const e=t.target;clearTimeout(this._debounceTimeoutID),this._debounceTimeoutID=setTimeout(()=>{this.value=e.value,this.dispatchEvent(this.onValueChange)},this.debounce)}focus(){setTimeout(()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("input");e==null||e.focus()})}render(){return f`
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
              placeholder=${an(this.placeholder)}
              @input=${this.onInputChange}
            ></textarea>`:f` <input
              aria-label=${this.label||this.name||"Text Input"}
              .type=${this.type}
              .value=${this.value}
              placeholder=${an(this.placeholder)}
              @input=${this.onInputChange}
            />`}
      </bim-input>
    `}};To.styles=[lt.scrollbar,E`
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
    `];let G=To;K([h({type:String,reflect:!0})],G.prototype,"icon",2);K([h({type:String,reflect:!0})],G.prototype,"label",2);K([h({type:String,reflect:!0})],G.prototype,"name",2);K([h({type:String,reflect:!0})],G.prototype,"placeholder",2);K([h({type:String,reflect:!0})],G.prototype,"value",2);K([h({type:Boolean,reflect:!0})],G.prototype,"vertical",2);K([h({type:Number,reflect:!0})],G.prototype,"debounce",2);K([h({type:Number,reflect:!0})],G.prototype,"rows",2);K([h({type:String,reflect:!0})],G.prototype,"type",1);var Rl=Object.defineProperty,Bl=Object.getOwnPropertyDescriptor,zo=(i,t,e,o)=>{for(var n=o>1?void 0:o?Bl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Rl(t,e,n),n};const jo=class extends w{constructor(){super(...arguments),this.rows=2,this._vertical=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}updateChildren(){const t=this.children;for(const e of t)this.vertical?e.setAttribute("label-hidden",""):e.removeAttribute("label-hidden")}render(){return f`
      <style>
        .parent {
          grid-auto-flow: ${this.vertical?"row":"column"};
          grid-template-rows: repeat(${this.rows}, 1fr);
        }
      </style>
      <div class="parent">
        <slot @slotchange=${this.updateChildren}></slot>
      </div>
    `}};jo.styles=E`
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
  `;let Be=jo;zo([h({type:Number,reflect:!0})],Be.prototype,"rows",2);zo([h({type:Boolean,reflect:!0})],Be.prototype,"vertical",1);var Hl=Object.defineProperty,Il=Object.getOwnPropertyDescriptor,He=(i,t,e,o)=>{for(var n=o>1?void 0:o?Il(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Hl(t,e,n),n};const Po=class extends w{constructor(){super(...arguments),this._vertical=!1,this._labelHidden=!1}set vertical(t){this._vertical=t,this.updateChildren()}get vertical(){return this._vertical}set labelHidden(t){this._labelHidden=t,this.updateChildren()}get labelHidden(){return this._labelHidden}updateChildren(){const t=this.children;for(const e of t)e instanceof Be&&(e.vertical=this.vertical),e.toggleAttribute("label-hidden",this.vertical)}render(){return f`
      <div class="parent">
        <div class="children">
          <slot @slotchange=${this.updateChildren}></slot>
        </div>
        ${!this.labelHidden&&(this.label||this.icon)?f`<bim-label .icon=${this.icon}>${this.label}</bim-label>`:null}
      </div>
    `}};Po.styles=E`
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
  `;let Dt=Po;He([h({type:String,reflect:!0})],Dt.prototype,"label",2);He([h({type:String,reflect:!0})],Dt.prototype,"icon",2);He([h({type:Boolean,reflect:!0})],Dt.prototype,"vertical",1);He([h({type:Boolean,attribute:"label-hidden",reflect:!0})],Dt.prototype,"labelHidden",1);var Nl=Object.defineProperty,Fl=Object.getOwnPropertyDescriptor,xi=(i,t,e,o)=>{for(var n=o>1?void 0:o?Fl(t,e):t,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Nl(t,e,n),n};const Lo=class extends w{constructor(){super(...arguments),this.labelsHidden=!1,this._vertical=!1,this._hidden=!1}set vertical(t){this._vertical=t,this.updateSections()}get vertical(){return this._vertical}set hidden(t){this._hidden=t,this.dispatchEvent(new Event("hiddenchange"))}get hidden(){return this._hidden}updateSections(){const t=this.children;for(const e of t)e instanceof Dt&&(e.labelHidden=this.vertical&&!oo.config.sectionLabelOnVerticalToolbar,e.vertical=this.vertical)}render(){return f`
      <div class="parent">
        <slot @slotchange=${this.updateSections}></slot>
      </div>
    `}};Lo.styles=E`
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
  `;let Ie=Lo;xi([h({type:String,reflect:!0})],Ie.prototype,"icon",2);xi([h({type:Boolean,attribute:"labels-hidden",reflect:!0})],Ie.prototype,"labelsHidden",2);xi([h({type:Boolean,reflect:!0})],Ie.prototype,"vertical",1);var Dl=Object.defineProperty,Ul=(i,t,e,o)=>{for(var n=void 0,r=i.length-1,s;r>=0;r--)(s=i[r])&&(n=s(t,e,n)||n);return n&&Dl(t,e,n),n};const Mo=class extends w{constructor(){super(),this._onResize=new Event("resize"),new ResizeObserver(()=>{setTimeout(()=>{this.dispatchEvent(this._onResize)})}).observe(this)}render(){return f`
      <div class="parent">
        <slot></slot>
      </div>
    `}};Mo.styles=E`
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
  `;let Ro=Mo;Ul([h({type:String,reflect:!0})],Ro.prototype,"name");export{oo as T,f as m,ro as z};
